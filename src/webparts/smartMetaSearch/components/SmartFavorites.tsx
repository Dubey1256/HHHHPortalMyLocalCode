import * as React from 'react';
import { Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import {SlArrowRight, SlArrowDown}from "react-icons/sl";
import { Web } from "sp-pnp-js";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ModalBody } from 'react-bootstrap';
// import { GetTaskId } from '../globalComponents/globalCommon';
import {GlobalConstants} from '../../../globalComponents/LocalCommon';
import GlobalCommonTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';

let isShowItem:boolean = false;
let SelectFavoriteItem:any = [];
let smartfavselecteditem:any = [];
let filterGroups:any = [];
let AllfiltersItems:any = [];
const SmartFavorite = (props:any)=>{
    AllfiltersItems = props.filterItems;
    let web = new Web(props.PageContext._pageContext._web.absoluteUrl + '/');
    let parenturl = props.PageContext._pageContext._web.absoluteUrl; 
    const [EveryoneSmartFavorites,setEveryoneSmartFavorites] =  React.useState<any[]>([]);
    const [CreateMeSmartFavorites,setCreateMeSmartFavorites] =  React.useState<any[]>([]);
    const [edit,setedit] = React.useState(false);
    const [editData,setEditData] = React.useState<any>([]);
    const [isShowEveryone,setisShowEveryone]= React.useState(false);
    const [selectedFavoriteitem,setselectedFavoriteitem]  = React.useState([]);
    const [SmartFavoritesConfig,setSmartFavoritesConfig] = React.useState<any[]>([]);    
    const [SmartFavoriteUrl,setSmartFavoriteUrl] = React.useState('');
    const [smartTitle,setsmartTitle] = React.useState('');
    const [expand,setexpand] = React.useState(false);
    const [AllTask,setAllTask] = React.useState<any[]>([]);  
    const [FavoriteFieldvalue,setFavoriteFieldvalue] = React.useState('SmartFilterBased');

    const isItemExistsGroup = (array:any, Item:any)=> {
        let isExists:any = false;
        array.map((itm:any) =>{
            if ( itm?.label !== undefined && itm?.TaxType !== undefined && itm?.Group !== undefined && ((itm?.label === Item?.label)||(itm?.TaxType === Item?.TaxType || itm?.Group === Item?.Group))) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }    
    const IsGroupExist = (array:any, Item:any)=>{
        let isExists:any = false;
        array.map((itm:any) =>{
            if (itm.Title === Item) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const EditFavfilter =  () => {
        var AddData: any = []
        var newData: any = [];
        selectedFavoriteitem.map((item:any) =>{
            filterGroups.map((group:any) =>{
                if(item?.Group === 'Date'){
                    item.isCreatedDate = group.isCreatedDate
                    item.isDueDate = group.isDueDate
                    item.isModifiedDate = group.isModifiedDate
                }
            })
        })
        EveryoneSmartFavorites.map((item1:any)=>{
            if(editData.Title === item1.Title){
                item1.SelectedFavorites = selectedFavoriteitem;
            }
        })
        CreateMeSmartFavorites.map((item2:any)=>{
            if(editData.Title === item2.Title){
                item2.SelectedFavorites = selectedFavoriteitem;
            }
        })
        var favovitesItem: any = {}
        favovitesItem = {
            'SmartFavoriteType': editData.SmartFavoriteType,
            'Title': smartTitle != "" ? smartTitle : editData.Title,
            'isShowEveryone': isShowEveryone,
            'CurrentUserID': props.PageContext._pageContext._legacyPageContext.userId,
            'SelectedFavorites': selectedFavoriteitem
        }
        if(editData.SmartFavoriteType !== 'UrlBased'){
            favovitesItem['SelectedFavorites'] = selectedFavoriteitem;
        }
        else{
            editData.SelectedFavorites[0].Url = SmartFavoriteUrl;
            favovitesItem['SelectedFavorites'] = editData.SelectedFavorites;
        }
        AddData.push(favovitesItem)       
        web.lists.getById(GlobalConstants.SHAREWEB_ADMIN_CONFIGURATIONS_LISTID).items.getById(editData.FavoriteId).update({
            Configurations: JSON.stringify(AddData),
            Key: 'SmartfavoritesSearch',
            Title: 'SmartfavoritesSearch',
        }).then((res: any) => {
            console.log(res)
            closeEditPopup()
            loadAdminConfigurations();
        })

    }
    const checkDuplicateItem =(filteritems:any,filteritem:any):boolean =>{
        if(filteritems?.length === 0) {return false}
        else {          
            return filteritems.some((item: any) => item.Id == filteritem.Id);
        }
    }

    const handleGroupCheckboxChanged = (event:any,groupitem:any) =>{
        const ischecked =  event.target.checked;
        const dataid = event.target.id;  
        let childdata:any = []     
        let ShowSelectdSmartfilter1:any = [];
        ShowSelectdSmartfilter1 = selectedFavoriteitem;
        if(ischecked){           
            ShowSelectdSmartfilter1.push(groupitem);
            AllfiltersItems.map((fitm:any)=>{
                if(fitm.Title === groupitem.Title){
                    fitm.selected = true;                                     
                }
                fitm?.children?.map((child:any)=>{
                    if(fitm.selected){
                        child.selected = true;                        
                    }                     
                    else if(child.Title === groupitem.Title){
                        child.selected = true;                      
                    }                     
                    child?.children?.map((childs:any)=>{
                        if(child.selected){
                            childs.selected = true;                            
                        }                         
                        else if(childs.Title === groupitem.Title){
                            childs.selected = true;                         
                        }
                    })
                })
            })               
        }
        else{          
            groupitem.selected = false;
            selectedFavoriteitem?.map((item:any,index:any)=>{
                if(item.Title === groupitem.Title){
                    item.selected = false;
                }           
            }) 
            ShowSelectdSmartfilter1 = selectedFavoriteitem.filter((x:any)=>x.selected === true);           
            AllfiltersItems.map((fitm:any)=>{
                if(fitm.Title === groupitem.Title){
                    fitm.selected = false;                                     
                }
                fitm?.children?.map((child:any)=>{
                    if(fitm.selected){
                        child.selected = false;                        
                    }                     
                    else if(child.Title === groupitem.Title){
                        child.selected = false;                      
                    }                     
                    child?.children?.map((childs:any)=>{
                        if(child.selected){
                            childs.selected = false;                            
                        }                         
                        else if(childs.Title === groupitem.Title){
                            childs.selected = false;                         
                        }
                    })
                })
            })                                              
        }          
        ShowSelectdSmartfilter1 = ShowSelectdSmartfilter1.filter((selectitm:any)=>(AllfiltersItems.filter((x:any)=>x.selected === selectitm.selected)));
        setselectedFavoriteitem(ShowSelectdSmartfilter1);                               
            
    }  

    const defaultselectFiltersBasedOnSmartFavorite = (obj:any, filter:any)=> {
        if(obj.Group === 'Status'){
            if (obj?.StatusValue === filter?.StatusValue && obj.selected) {
                filter.selected = true;
            }
            else if(obj?.StatusValue !== filter?.StatusValue && filter.selected){
                filter.selected = false;
            } 
        }
        else if(obj.Group !== 'Status'){
            if (obj?.Title === filter?.Title && obj.selected) {
                filter.selected = true;
            }
            else if(obj?.Title !== filter?.Title && filter.selected){
                filter.selected = true;
            }  
        }
             
        if (filter.children != undefined && filter.children.length > 0) {
            filter?.children.map((childFilter:any)=> {
                if (obj.Title === childFilter.Title && obj.selected) {
                    filter.selected = true;
                    childFilter.selected = true;
                }
                else if(obj?.Title !== childFilter?.Title && childFilter.selected){
                    filter.selected = true;
                    childFilter.selected = true;
                }                          
                defaultselectFiltersBasedOnSmartFavorite(obj, childFilter);
            })
        }
    }      
    const openEditPopup = (edititem: any) => {
        AllfiltersItems = props.filterItems;
        filterGroups = [];
        let selectedFiltersItemsGroups:any = [];        
        setedit(true)       
        if (edititem.SmartFavoriteType == 'SmartFilterBased') {
            if (edititem.SelectedFavorites != undefined) {
                edititem.SelectedFavorites.map((obj:any)=> {                    
                    obj.selected = true;
                    let flag:any = true;
                    AllfiltersItems.map((filter:any) =>{
                        if(filter.Group == 'Smalsus Lead Team' || filter.Group == 'Senior Developer Team')
                           filter.Group = 'Smalsus Senior Team'
                        if (obj.Title == filter.Title && (obj.Group == 'Date' || obj.label == 'Date')) {
                            filter.selected = true;
                            flag = false;
                        }
                        else if (obj.Group != 'Date' || obj.label != 'Date') {
                            flag = false;
                            // filter.selected = false;                            
                            defaultselectFiltersBasedOnSmartFavorite(obj, filter);

                        }
                        if(obj.ItemType == 'User' && filter.ItemType == 'User' && obj?.Title == filter?.Title){
                            obj.Group = filter.Group
                        }
                    })
                    if (flag) {
                        obj.selected = true;
                        AllfiltersItems.push(obj)  
                    }
                    if ((obj.Group != undefined || obj.label != undefined) && obj.Group !== 'Date' && !isItemExistsGroup(selectedFiltersItemsGroups, obj)){                        
                        selectedFiltersItemsGroups.push(obj);
                        const Group = obj.Group || obj.label;
                        let temp:any = {}
                        if(!IsGroupExist(filterGroups,Group)){
                            temp['Title'] = Group;
                            temp['selected'] = false;
                            filterGroups.push(temp);
                        }                       
                    }
                    if (obj.Group === 'Date' && !isItemExistsGroup(selectedFiltersItemsGroups, obj)){                        
                        selectedFiltersItemsGroups.push(obj);
                        const Group = obj.Group || obj.label;
                        let temp:any = {}
                        if(!IsGroupExist(filterGroups,Group)){
                            temp['Title'] = obj.Group;
                            temp['selected'] = true;
                            temp['isCreatedDate'] = obj.isCreatedDate;
                            temp['isDueDate'] = obj.isDueDate;
                            temp['isModifiedDate'] = obj.isModifiedDate;
                            filterGroups.push(temp);
                        }                       
                    }
                })
            }
        }
        else {
            setSmartFavoriteUrl(edititem.SelectedFavorites[0].Url);
            selectedFiltersItemsGroups = edititem.SelectedFavorites;
        }
        setselectedFavoriteitem(selectedFiltersItemsGroups);
        setEditData(edititem);       
    }
    const ChangeTitle =(e:any)=>{
        const Title = e.target.value;
        setsmartTitle(Title);
    } 
    const ChangeUrl = (event:any)  =>{
        const Url = event.target.value;
        setSmartFavoriteUrl(Url);
    }
    const loadAdminConfigurations = ()=>{
        let SmartFavoritesConfig1:any[] = [];
        let copyCreateMeSmartFavorites:any = [];
        let copyEveryoneSmartFavorites:any = [];      
        var filter = "Key eq 'SmartfavoritesSearch'";
        web.lists
        .getById(GlobalConstants.SHAREWEB_ADMIN_CONFIGURATIONS_LISTID)
        .items
        .select('Id', 'Title', 'Value', 'Key', 'Description', 'DisplayTitle', 'Configurations')
        .filter(filter)        
        .get()
        .then((Results:any)=>{
            Results.map((smart:any)=>{
                if (smart.Configurations !== undefined) {
                    const Arrays = JSON.parse(smart.Configurations);
                    Arrays.map((config:any)=>{                       
                        if (config.CurrentUserID !== undefined && config.CurrentUserID === props.PageContext._pageContext._legacyPageContext.userId || config.isShowEveryone === true) {
                            config.FavoriteId = smart.Id;
                            config.Favorite = smart;
                            if (!checkDuplicateItem(SmartFavoritesConfig1, config.Favorite))
                              SmartFavoritesConfig1.push(config);
                            if (config.isShowEveryone !== false && !checkDuplicateItem(copyEveryoneSmartFavorites, config.Favorite))
                              copyEveryoneSmartFavorites.push(config);
                            if (config.isShowEveryone === false && !checkDuplicateItem(copyCreateMeSmartFavorites, config.Favorite))
                              copyCreateMeSmartFavorites.push(config);
                        }
                    })
                    setSmartFavoritesConfig([...SmartFavoritesConfig1]);
                    setEveryoneSmartFavorites([...copyEveryoneSmartFavorites]);
                    setCreateMeSmartFavorites([...copyCreateMeSmartFavorites]);
                }                

            })
            console.log(copyEveryoneSmartFavorites);

            // if (stringSmartfavoriteID) {
            //     Searchtasks();
            // }
        })
    }  
    React.useEffect(()=>{
        filterGroups=[]
        props.selectedFavoritefilteritem?.map((obj: any, index: any) => {
            if(obj.Group !== 'Date'){
                if (obj.Group != undefined || obj.label != undefined){
                    const Group = obj.Group || obj.label;
                    let temp:any = {}
                    if(!IsGroupExist(filterGroups,Group)){
                        temp['Title'] = Group;
                        temp['selected'] = false;
                        filterGroups.push(temp);
                    }                       
                }
                AllfiltersItems.map((fitm:any)=>{
                    if(fitm.Title === obj.Title){
                        fitm.selected = true;                                     
                    }
                    fitm?.children?.map((child:any)=>{
                        if(fitm.selected){
                            child.selected = true;                        
                        }                     
                        else if(child.Title === obj.Title){
                            child.selected = true;                      
                        }                     
                        child?.children?.map((childs:any)=>{
                            if(child.selected){
                                childs.selected = true;                            
                            }                         
                            else if(childs.Title === obj.Title){
                                childs.selected = true;                         
                            }
                        })
                    })
                })
            }
            else if(obj.Group === 'Date'){
                let temp:any = {}
                if(!IsGroupExist(filterGroups,obj.Group)){
                    temp['Title'] = obj.Group;
                    temp['selected'] = true;
                    temp['isCreatedDate'] = obj.isCreatedDate;
                    temp['isDueDate'] = obj.isDueDate;
                    temp['isModifiedDate'] = obj.isModifiedDate;
                    filterGroups.push(temp);
                } 
            }                 
        })
    },[props.opensmartfavorite])

    React.useEffect(()=>{
        loadAdminConfigurations();
    },[props.isSmartFavorites])

    const loadMorefilter=(filteritem: any)=> {
        if(filteritem.children.length>0){
            filteritem.children.forEach((childitem:any)=>{
                if(filteritem.Id === childitem.Parent.Id){
                    if(expand === true && filteritem.expand === true){
                        filteritem.expand = false;
                        setexpand(false);
                    }                     
                    else{
                        filteritem.expand = true;
                        setexpand(true);;
                    }                     
                }                 
            })
        }            
    }
    const OpenSmartfavorites = (type:any)=>{
        props.callback(type);
    }   

    const FilterFavoritesTask = (item:any, Items:any, itemIndex:any,val1:any) =>{  
        isShowItem = true; 
        item.map((objitem:any)=> {
            AllfiltersItems.map((filterItm:any)=>{
                if (objitem.Title !== undefined && filterItm.Title !== undefined && objitem.Title === filterItm.Title) {
                    filterItm.selected = true;                   
                }
                if (filterItm != undefined && filterItm.childs != undefined && filterItm.childs.length > 0) {
                    filterItm?.children.map((child:any) =>{
                        if (objitem.Title != undefined && child.Title != undefined && objitem.Title == child.Title) {
                            child.selected = true;                            
                        }
                        if (child.childs != undefined && child.childs.length > 0) {
                            child?.children.map((subchild:any)=> {
                                if (objitem.Title != undefined && subchild.Title != undefined && objitem.Title == subchild.Title) {
                                    subchild.selected = true;                                   
                                }
                            });
                        }
                    });
                }
            })
        })    
        smartfavselecteditem = item;
        SelectFavoriteItem = itemIndex;      
        props.callback(smartfavselecteditem);

    }
    const deletedItem = async (val: any, Type: any) => {
        if (Type == 'Onlyme') {
            var deleteConfirmation = confirm("Are you sure, you want to delete this?")
            if (deleteConfirmation) {
                
                await web.lists.getById(GlobalConstants.SHAREWEB_ADMIN_CONFIGURATIONS_LISTID).items.getById(val.FavoriteId).recycle()
                CreateMeSmartFavorites?.forEach((vall: any, index: any) => {
                    if (vall?.FavoriteId == val?.FavoriteId) {
                        CreateMeSmartFavorites.splice(index, 1)
                    }
                })
                // setCount(count + 1)

            }
        }
        else {
            var deleteConfirmation = confirm("Are you sure, you want to delete this?")
            if (deleteConfirmation) {
             
                await web.lists.getById(GlobalConstants.SHAREWEB_ADMIN_CONFIGURATIONS_LISTID).items.getById(val.FavoriteId).recycle()

                EveryoneSmartFavorites?.forEach((vall: any, index: any) => {
                    if (vall.FavoriteId == val.FavoriteId) {
                        EveryoneSmartFavorites.splice(index, 1)
                    }
                })
                // setCount(count + 1)

            }
        }
        loadAdminConfigurations();
    }
    const closeEditPopup = ()=>{       
        setedit(false)
    }     
    const CheckedUncheckedItem = (e:any)=>{
        if(isShowEveryone)
         setisShowEveryone(false);
        else
         setisShowEveryone(true);
    }
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className='subheading'>
                   <span className='siteColor'>Smart Favorites</span>                  
                </div>
                {/* <Tooltip ComponentId="528" /> */}
            </div>
        );
    };   
    const closePopup = ()=>{
        // props.opensmartfavorite = false;
        props.callback(false);
    } 
    let SmartFavoritesConfig2:any=[];
    const AddSmartfaviratesfilter = ()=>{
        let SelectedFavorites:any=[];
        let AddnewItem:any = [];
        if(FavoriteFieldvalue === 'SmartFilterBased'){
            props.selectedFavoritefilteritem.map((filter:any)=>{
                if(filter.selected || filter.Group === 'Date')
                 SelectedFavorites.push(filter);               
            })
        }
        else{
            var SmartFavorites = (SmartFavoriteUrl.split('SitePages/')[1]).split('.aspx')[0];
            SelectedFavorites.push({
                "Title": SmartFavorites,
                "TaxType": "Url",
                "Group": "Url",
                "Selected": true,
                "Url": SmartFavoriteUrl
            });
        }       
        const Favorite = {
            Title:smartTitle,
            SmartFavoriteType:FavoriteFieldvalue,
            CurrentUserID:props.PageContext._pageContext._legacyPageContext.userId,
            isShowEveryone:isShowEveryone,
            SelectedFavorites:SelectedFavorites, 
            Createmodified: props?.Createmodified
        }
        SmartFavoritesConfig2.push(Favorite);
        AddnewItem.push(Favorite);
        const postData = {            
            Configurations: JSON.stringify(AddnewItem),
            Key: 'SmartfavoritesSearch',
            Title: 'SmartfavoritesSearch',
        };
        web.lists.getById(GlobalConstants.SHAREWEB_ADMIN_CONFIGURATIONS_LISTID).items.add(postData).then((result:any) => {
            console.log("Successfully Added SmartFavorite") ;
            loadAdminConfigurations();
            cancelAddSmartfaviratesfilter();
            props.callback(false);        
        }) 
                         
    }
    const FavoriteField = (event:any)=>
    {
        const fieldvalue = event.target.value;
        setFavoriteFieldvalue(fieldvalue);
    } 
    const cancelAddSmartfaviratesfilter = ()=>{

    }    

    return(
        <>
         {props.opensmartfavorite && <Panel title="popup-title" isOpen={true} onDismiss={closePopup} onRenderHeader={onRenderCustomHeaderMain} type={PanelType.medium} isBlocking={false}>                                       
                                        <ModalBody>
                                            <div className="ms-modalExample-body">
                                                <div className='justify-content-between'>
                                                    <label className='SpfxCheckRadio  me-2'>
                                                    <input className='radio' type='radio' value="SmartFilterBased" checked={FavoriteFieldvalue === "SmartFilterBased"} onChange={(event)=>FavoriteField(event)}/> SmartFilter Based 
                                                    </label>                                           
                                                    <label className='SpfxCheckRadio  me-2'> 
                                                    <input className='radio' type='radio' value="UrlBased" checked={FavoriteFieldvalue === "UrlBased"} onChange={(event)=>FavoriteField(event)}/> Url Based 
                                                    </label>
                                                </div>
                                                {FavoriteFieldvalue === "SmartFilterBased" && <Row className='mb-2'>
                                                    <div className='input-group mt-3'>
                                                        <label className='d-flex form-label full-width justify-content-between'>Title <span><input type="checkbox" checked={isShowEveryone}  onChange={(e)=>CheckedUncheckedItem(e)} /> For EveryOne</span></label>
                                                        <input type="text" className='form-control' value={smartTitle} onChange={(e)=>ChangeTitle(e)} />
                                                    </div>
                                            
                                                    
                                                </Row>}
                                                {FavoriteFieldvalue == "UrlBased" && <Row className='mb-2'>
                                                    <div className='input-group mt-3'>
                                                        <label className='d-flex form-label full-width justify-content-between'>Title <span><input type="checkbox" checked={isShowEveryone} onChange={(e)=>CheckedUncheckedItem(e)}/> For EveryOne</span></label>
                                                        <input type="text" className='form-control' value={smartTitle} onChange={(e)=>ChangeTitle(e)} />
                                                    </div>
                                            
                                                    <div className='input-group mt-3'>
                                                        <label className='form-label full-width'> Url </label>
                                                        <input type="text" className='form-control' value={SmartFavoriteUrl} onChange={(e)=>ChangeUrl(e)}  />
                                                    </div>
                                            

                                                </Row>}
                                                { props.selectedFavoritefilteritem?.length>0 && FavoriteFieldvalue === "SmartFilterBased" && <Row>
                                                    <table className='table hover border-0'>                                                                                                          
                                                        <tr className='border-bottom'>                                                           
                                                             <td valign="top">
                                                                <Row>
                                                                {filterGroups != null && filterGroups.length > 0 && filterGroups?.map((Group: any, index: any) =>  {
                                                                    return (
                                                                    <>
                                                                        <div className="col-md-3"> 
                                                                            <label className='smartPannel'>
                                                                                <span className='form-check'><input className='form-check-input'  type="checkbox" id={Group.Title} checked={Group.selected} onChange={(event)=>handleGroupCheckboxChanged(event,Group)} /> {Group.Title} </span>
                                                                            </label>                                                                   
                                                                            <div>
                                                                                {Group.Title !== 'Date' && AllfiltersItems?.length>0 && AllfiltersItems?.map((filteritem:any,index:any)=>{                                                                                      
                                                                                    return (
                                                                                        <div >                                                                                                                                                                       
                                                                                            {(filteritem.label == Group.Title || filteritem.Group == Group.Title)&&
                                                                                                <><span id="filterexpand">
                                                                                                    {filteritem.expand && filteritem.children != undefined && filteritem.children.length > 0 && <SlArrowDown onClick={()=>loadMorefilter(filteritem)}></SlArrowDown>}
                                                                                                    {!filteritem.expand && filteritem.children != undefined && filteritem.children.length > 0 && <SlArrowRight onClick={()=>loadMorefilter(filteritem)}></SlArrowRight>}
                                                                                                </span><span>
                                                                                                        {filteritem.TaxType !== 'Status' &&
                                                                                                            <span className='form-check'><input className='form-check-input'  type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem)} />  {filteritem.Title}</span>}
                                                                                                        {filteritem.TaxType === 'Status' &&
                                                                                                            <span className='form-check'><input className='form-check-input' type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem)} />  {filteritem.Title}</span>}

                                                                                                    </span>
                                                                                                    {filteritem?.children?.length>0 ? <ul>
                                                                                                        {filteritem.expand === true && filteritem.children?.map((child:any)=>{                                                                                                              
                                                                                                        return(<>
                                                                                                            <li style={{ listStyle: 'none' }}>
                                                                                                                <span id="filterexpand">
                                                                                                                {child.expand && child.children != undefined && child.children.length > 0 && <SlArrowDown onClick={() => loadMorefilter(child)} ></SlArrowDown>}
                                                                                                                {!child.expand && child.children != undefined && child.children.length > 0 && <SlArrowRight onClick={() => loadMorefilter(child)}></SlArrowRight>}
                                                                                                                </span>
                                                                                                                <input className='form-check-input' type="checkbox" id={child.Title} value={child.Title} checked={child.selected} onChange={(event)=>handleGroupCheckboxChanged(event,child)} /> {child.Title}
                                                                                                                <ul>
                                                                                                                    {child.expand === true && child.children != undefined && child.children.length > 0 && child.children?.map((childs: any) => {
                                                                                                                        return (<li style={{ listStyle: 'none' }}><input className='form-check-input' type="checkbox" id={childs.Title} value={childs.Title} checked={childs.selected} onChange={(event)=>handleGroupCheckboxChanged(event,childs)} /> {childs.Title}</li>);
                                                                                                                    })}
                                                                                                                </ul>
                                                                                                            </li></>)
                                                                                                        })}
                                                                                                    </ul>:''}  
                                                                                                </>
                                                                                            }                                                                                                                                                                  
                                                                                        </div>
                                                                                                                                                                            
                                                                                    )
                                                                                })}
                                                                                {Group.Title === 'Date' && <>
                                                                                    <div> 
                                                                                        <input className='form-check-input' type="checkbox" defaultChecked={Group.isCreatedDate} onChange={(e)=>Group.isCreatedDate = e.target.checked} /> Created
                                                                                    </div> 
                                                                                    <div> 
                                                                                        <input className='form-check-input' type="checkbox" defaultChecked={Group.isModifiedDate} onChange={(e)=>Group.isModifiedDate = e.target.checked} /> Modified
                                                                                    </div> 
                                                                                    <div> 
                                                                                        <input className='form-check-input' type="checkbox" defaultChecked={Group.isDueDate} onChange={(e)=>Group.isDueDate = e.target.checked} /> DueDate
                                                                                    </div> 
                                                                                    </>
                                                                                }  
                                                                            </div>                                                                                                                                                                                                    
                                                                        </div>                                                                                                                                
                                                                    </> )
                                                                })}
                                                                </Row>
                                                            </td>  
                                                        </tr>                                                        
                                                    </table>
                                                </Row>}                  
                                            </div>        
                                        </ModalBody>
                                           
                                        <div className="text-end">                                         
                                          <button type='button' className='btn btn-primary me-1' onClick={AddSmartfaviratesfilter}> Add SmartFavorite </button>
                                          <button type='button' className='btn btn-default' onClick={closePopup}> Cancel </button>
                                        </div>
                                    </Panel>}  
         {props.isSmartFavorites &&  <section className='udatefilter'>
                        <div className='row text-end' onClick={()=>OpenSmartfavorites('isSmartFilter')}>
                          <a>Go to Smart Filter</a>
                        </div>                       
                        <div className='row'>
                            <Col>
                                <div className='bg-69 p-1 text-center'>
                                    <h6>EveryOne</h6>                                
                                </div>
                               <div>{EveryoneSmartFavorites?.length>0 && EveryoneSmartFavorites.map((item1:any)=>{                                     
                                   return(<>
                                       <div className='bg-ee my-1 p-1 w-100'>                                         
                                         <span className='d-flex'>
                                             <a onClick={()=>FilterFavoritesTask(item1.SelectedFavorites,EveryoneSmartFavorites,item1,true)} className='hreflink'>{item1.Title}</a> <span className='d-flex'><a target='_blank' href={`${parenturl}/TaskManagement.aspx?SmartfavoriteId=${item1.FavoriteId}&smartfavorite=${item1.Title}`}><span className="svg__iconbox svg__icon--openWeb"> </span></a><span onClick={() => openEditPopup(item1)} className="svg__iconbox svg__icon--edit"></span> <span  onClick={() => deletedItem(item1,'EveryOne')} className="svg__icon--trash  svg__iconbox"></span></span>
                                         </span>                                       
                                        </div>
                                 </>)
                                })}</div> 
                                <div>{EveryoneSmartFavorites?.length == 0  &&                                                                        
                                       <div className='bg-ee my-1 p-1 w-100'>                                         
                                         <span className='d-flex'>
                                             No Items Available
                                         </span>                                       
                                        </div>                                 
                                }</div>                           
                            </Col>                          
                            <Col>
                                <div className='bg-69 p-1 text-center'>
                                    <h6>Only Me</h6>
                                </div>                               
                                <div>{CreateMeSmartFavorites?.length>0 && CreateMeSmartFavorites.map((item2:any)=>{
                                    return(<>
                                    <div className='bg-ee my-1 p-1 w-100'>
                                        <div>                                    
                                        <span className='d-flex'>
                                            <a onClick={()=>FilterFavoritesTask(item2.SelectedFavorites,CreateMeSmartFavorites,item2,true)} className='hreflink'>{item2.Title}</a><span className='d-flex'><a target='_blank' href={`${parenturl}/TaskManagement.aspx?SmartfavoriteId=${item2.FavoriteId}&smartfavorite=${item2.Title}`}><span className="svg__iconbox svg__icon--openWeb"> </span></a><span onClick={() => openEditPopup(item2)} className="svg__iconbox svg__icon--edit"></span> <span onClick={() => deletedItem(item2,'Onlyme')} className="svg__icon--trash  svg__iconbox"></span></span>
                                        </span>
                                    </div>
                                    </div>
                                    </>)
                                })} 
                                </div>
                                <div>{CreateMeSmartFavorites?.length == 0  &&                                                                        
                                       <div className='bg-ee my-1 p-1 w-100'>                                         
                                         <span className='d-flex'>
                                             No Items Available
                                         </span>                                       
                                        </div>                                 
                                }</div>                                
                            </Col>
                            <Panel
                                onRenderHeader={onRenderCustomHeaderMain}
                                type={PanelType.custom}
                                customWidth="900px"
                                isOpen={edit}
                                onDismiss={closeEditPopup}
                                isBlocking={false}>

                                <div>
                                    <div className="modal-body  clearfix">
                                        <div className="mt-10 mb-10  col-sm-12 ">                                       
                                            <div className="col-sm-12   mb-2">
                                                <label className="full-width ">
                                                    Title<span className="pull-right">
                                                        <input className='form-check-input' type="checkbox" defaultChecked={editData?.isShowEveryone} onClick={() => CheckedUncheckedItem('isShowEveryone')} name="rating1" onChange={(e) => setisShowEveryone(e.target.checked)} /> For Everyone
                                                    </span>

                                                </label>                                            
                                                <input type="text" className='w-100' defaultValue={editData?.Title} onChange={(e) => ChangeTitle(e)} />
                                                {editData?.SmartFavoriteType === 'UrlBased' && <label className="full-width">
                                                    Url<input type="text" className='w-100'  defaultValue={SmartFavoriteUrl} onChange={(e) => ChangeUrl(e)} />
                                                </label>  }
                                            </div>

                                            {editData?.SmartFavoriteType !== 'UrlBased' ?<table className='indicator_search w-100'>
                                                <tbody>
                                                    <tr>  
                                                    <td valign="top">
                                                        <Row>
                                                        {filterGroups != null && filterGroups.length > 0 && filterGroups?.map((Group: any, index: any) =>  {
                                                            return (
                                                            <>
                                                                <div className="col-md-3"> 
                                                                    <label className='smartPannel'>
                                                                        {Group.Title === 'Date' ? <span className='form-check'><input className='form-check-input'  type="checkbox" id={Group.Title} defaultChecked={Group.selected} onChange={(event)=>Group.selected = event.target.checked} /> {Group.Title} </span>
                                                                         : <span className='form-check'><input className='form-check-input'  type="checkbox" id={Group.Title} checked={Group.selected} onChange={(event)=>handleGroupCheckboxChanged(event,Group)} /> {Group.Title} </span>}
                                                                    </label>                                                                   
                                                                    <div>
                                                                        {Group.Title !== 'Date' && AllfiltersItems?.length>0 && AllfiltersItems?.map((filteritem:any,index:any)=>{                                                                                      
                                                                            return (
                                                                                <div >                                                                                                                                                                       
                                                                                    {(filteritem.label == Group.Title || filteritem.Group == Group.Title)&&
                                                                                        <><span id="filterexpand">
                                                                                            {filteritem.expand && filteritem.children != undefined && filteritem.children.length > 0 && <SlArrowDown onClick={()=>loadMorefilter(filteritem)}></SlArrowDown>}
                                                                                            {!filteritem.expand && filteritem.children != undefined && filteritem.children.length > 0 && <SlArrowRight onClick={()=>loadMorefilter(filteritem)}></SlArrowRight>}
                                                                                        </span><span>
                                                                                                {filteritem.TaxType !== 'Status' &&
                                                                                                    <span className='form-check'><input className='form-check-input'  type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem)} />  {filteritem.Title}</span>}
                                                                                                {filteritem.TaxType === 'Status' &&
                                                                                                    <span className='form-check'><input className='form-check-input' type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem)} />  {filteritem.Title}</span>}

                                                                                            </span>
                                                                                            {filteritem?.children?.length>0 ? <ul>
                                                                                                {filteritem.expand === true && filteritem.children?.map((child:any)=>{                                                                                                              
                                                                                                return(<>
                                                                                                    <li style={{ listStyle: 'none' }}>
                                                                                                        <span id="filterexpand">
                                                                                                        {child.expand && child.children != undefined && child.children.length > 0 && <SlArrowDown onClick={() => loadMorefilter(child)} ></SlArrowDown>}
                                                                                                        {!child.expand && child.children != undefined && child.children.length > 0 && <SlArrowRight onClick={() => loadMorefilter(child)}></SlArrowRight>}
                                                                                                        </span>
                                                                                                        <input className='form-check-input' type="checkbox" id={child.Title} value={child.Title} checked={child.selected} onChange={(event)=>handleGroupCheckboxChanged(event,child)} /> {child.Title}
                                                                                                        <ul>
                                                                                                            {child.expand === true && child.children != undefined && child.children.length > 0 && child.children?.map((childs: any) => {
                                                                                                                return (<li style={{ listStyle: 'none' }}><input className='form-check-input' type="checkbox" id={childs.Title} value={childs.Title} checked={childs.selected} onChange={(event)=>handleGroupCheckboxChanged(event,childs)} /> {childs.Title}</li>);
                                                                                                            })}
                                                                                                        </ul>
                                                                                                    </li></>)
                                                                                                })}
                                                                                            </ul>:''}  
                                                                                        </>
                                                                                    }                                                                                                                                                                  
                                                                                </div>
                                                                                                                                                                    
                                                                            )
                                                                        })}
                                                                        {Group.Title === 'Date' && <>
                                                                            <div> 
                                                                                <input className='form-check-input' type="checkbox" defaultChecked={Group.isCreatedDate} onChange={(e)=>Group.isCreatedDate = e.target.checked} /> Created
                                                                            </div> 
                                                                            <div> 
                                                                                <input className='form-check-input' type="checkbox" defaultChecked={Group.isModifiedDate} onChange={(e)=>Group.isModifiedDate = e.target.checked} /> Modified
                                                                            </div> 
                                                                            <div> 
                                                                                <input className='form-check-input' type="checkbox" defaultChecked={Group.isDueDate} onChange={(e)=>Group.isDueDate = e.target.checked} /> DueDate
                                                                            </div> 
                                                                            </>
                                                                        }  
                                                                    </div>                                                                                                                                                                                                    
                                                                </div>                                                                                                                                
                                                            </> )
                                                        })}
                                                        </Row>
                                                    </td>
                                                    </tr>
                                                </tbody>
                                            </table> :""}
                                        </div>
                                    </div>

                                    <footer>
                                        <div className='row mt-4'>
                                            <div className="col-sm-12">
                                                <div className="text-end">
                                                    <button type="button" className="btn btn-primary ms-2" onClick={() => EditFavfilter()}>
                                                        Update
                                                    </button>
                                                    <span>
                                                        <button type="button" className="btn btn-primary ms-2" onClick={closeEditPopup}>
                                                            Cancel
                                                        </button>
                                                    </span>
                                                </div>

                                            </div>

                                        </div>

                                    </footer>
                                </div >
                            </Panel >   
                        </div>
                                         
            </section>}
        </>
    )
}
export default SmartFavorite;