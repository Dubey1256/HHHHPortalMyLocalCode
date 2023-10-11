import * as React from 'react';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import { Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import PageLoad from '../pageLoader';
import { GetTaskId } from '../globalCommon';
import {GlobalConstants} from '../../globalComponents/LocalCommon';
// import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import {SlArrowRight, SlArrowDown}from "react-icons/sl";
import SmartMetaSearchTable from '../../webparts/smartMetaSearch/components/SmartMetaSearchTable';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import { ModalBody } from 'react-bootstrap';
import * as moment from 'moment';

let selectedfilter:any = [];
let teamfilters:any = [];
let filterteamgroup:any=[];
let isShowItem:boolean = false;
let advanceValueAll:any = 'Allwords';
let updateFiltervalue:any = 'Title';
let keywordsvalue :any = '';
let copymastertasksitem:any = [];
let PortfolioItems:any = [];
const SmartFilterSearchGlobal = (AllListitem:any)=>{  
    let item = AllListitem.selectedArray;
    let PageContext = item.ContextValue;
    let web = new Web(PageContext._pageContext._web.absoluteUrl + '/')
    let isGMBH:boolean = false;
    if (PageContext._pageContext._web.absoluteUrl.indexOf('gmbh') !== -1) {
        isGMBH = true;
    } else {
        isGMBH = false;
    }
    if (PageContext._pageContext._web.absoluteUrl.indexOf('ksl') !== -1)
       isGMBH = true;
    // let stringSmartfavoriteID = PageContext._pageContext._web.absoluteUrl;
    // let TaskUserListId: any = item.TaskUserListId;
    // let SmartMetadataListId: any = item.SmartMetadataListId;
    let filters:any = [];
    let filterGroups1: any = [];                  
    const [advanceValue,setadvanceValue] = React.useState('Allwords');
    const [updatevalue,setupdatevalue] = React.useState('Title');
    const [FavoriteFieldvalue,setFavoriteFieldvalue] = React.useState('SmartFilterBased');    
    const [ShowTableItem,setShowTableItem] = React.useState<any>([]);
    const [expand,setexpand] = React.useState(false);
    const [isShowTable,setisShowTable] = React.useState(false);
    const [smartmetaDataDetails, setSmartmetaDataDetails] = React.useState([]);
    const [siteConfig, setSiteConfig] = React.useState<any[]>([]);
    const [IsSmartfilter, setIsSmartfilter] = React.useState<any>({'isSitefilter':false,'isCategoriesStatus':false,'isTeamMemberfilter':false,'isDatefilter':false});
    const [composervtask,setcomposervtask]=React.useState({'iscompo':false,'isservice':false,'istask':false});
    const [Createmodified, setCreatemodified]  = React.useState({"isCreated":false,"isModified":false,"isAssignedto":false});
    const [filterGroups, setfilterGroups] = React.useState([]);       
    const [filterItems, setfilterItems] = React.useState<any[]>([]);   
    const [startDate,setstartDate] = React.useState<any>('');
    const [endDate,setendDate] = React.useState<any>('');  
    const [duedate,setduedate]=React.useState<any>({"isCretaedDate":false,"isModifiedDate":false,"isDueDate":false});
    const [eventdatevalue,seteventdatevalue] = React.useState<any>('');
    const [selectedFavoriteitem,setselectedFavoriteitem]  = React.useState([]);
    const [opensmartfavorite,setopensmartfavorite] = React.useState(false);
    const [isShowEveryone,setisShowEveryone]= React.useState(false);
    const [smartTitle,setsmartTitle] = React.useState('');
    const [SmartFavoriteUrl,setSmartFavoriteUrl] = React.useState('');
    const [isSmartFavorites,setisSmartFavorites] = React.useState(false);
    const [SmartFavoritesConfig,setSmartFavoritesConfig] = React.useState<any[]>([]);
    const [EveryoneSmartFavorites,setEveryoneSmartFavorites] =  React.useState<any[]>([]);
    const [CreateMeSmartFavorites,setCreateMeSmartFavorites] =  React.useState<any[]>([]);
    const [AlllistsData,setAlllistsData]= React.useState([]);
    const [edit,setedit] = React.useState(false);
    const [editData,setEditData] = React.useState<any>();
    const [loading,setloading] = React.useState(false);
    const [ShowSelectdSmartfilter,setShowSelectdSmartfilter] = React.useState<any>();   
    let AllListitems:any = [];  
    
    React.useEffect(() => {
        getTaskUsers();
        GetSmartmetadata();
        PortfolioListItems();
    }, []);
    const getTaskUsers = async () => {
        let taskUsers:any = [];                
        try{
            let results = await web.lists
            .getById(GlobalConstants.TaskUsersListId)
            .items
            .select('Id', 'Title', 'Status','Role', 'Item_x0020_Cover', 'IsActive', 'AssingedToUserId','Suffix', 'UserGroupId', 'UserGroup/Id','UserGroup/Title', "ItemType")
            .filter('IsActive eq 1')
            .expand('UserGroup')
            .get();
            for (let index = 0; index < results?.length; index++) {
                let element = results[index];
                element.value = element.Id;
                element.label = element.TaxType;
                if (element.UserGroupId == undefined) {
                    getChilds(element, results);
                    taskUsers.push(element);
                }
            }
        }catch(error){
            console.log(error)
        }        
        // setTaskUsers(results);       
        taskUsers?.map((item:any)=>{
            item.TaxType = 'Team Member';
            if(item.children != undefined && item.children?.length>0){                
                item.children.forEach((childuser:any)=>{
                    childuser.TaxType = 'Team Member'
                    childuser.label = childuser.UserGroup.Title;
                    if(!checkDuplicateItem(teamfilters,childuser))                    
                      teamfilters.push(childuser);                  
                })
            }
            if(item.Title !== "QA" && item.Title !== "Design")
             filterteamgroup.push({Title:item.Title,selected:false,group:'Team Members'})
        })                   
    }

    const getChilds = (item: any, items: any) => {
        item.children = [];
        for (let index = 0; index < items?.length; index++) {
            let childItem = items[index];
            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                childItem.value = childItem.Id;
                childItem.label = childItem.Title;
                item.children.push(childItem);
                getChilds(childItem, items);
            }
        }
        if (item?.children?.length == 0) {
            delete item.children;
        }
    }
   
    const GetSmartmetadata = async () => {
       let siteConfigSites: any = [];
       let smartmetaDetails:any = [];
       let siteconfig1:any=[]    
      // let web = new Web(ContextValue?.siteUrl);
      try{
        let AllMetadata = await web.lists
        .getById(GlobalConstants.SP_SMARTMETADATA_LIST_ID)
        .items
        .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
        .top(4999)
        .expand('Parent')
        .get();

        for(let i = 0;i<AllMetadata?.length;i++){
            if(AllMetadata[i].TaxType != 'Task Types' && AllMetadata[i].TaxType != 'Task Type' && AllMetadata[i].TaxType != 'Time' && AllMetadata[i].TaxType != 'Status' && AllMetadata[i].Id != 300){
                smartmetaDetails.push(AllMetadata[i]);
            }
        }
        AllMetadata?.map((newtest: any) => {            
            if (newtest.TaxType == 'Sites')
                siteConfigSites.push(newtest)
        })
        siteConfigSites.map((item:any) => {
            if (item.Title != 'Foundation') {                
                if (item.Title.toLowerCase() != "drr" && item.Title != 'SDC Sites') {
                    siteconfig1.push(item)
                }
            }
        })
        setloading(true);
        LoadAllSiteTasks(siteconfig1);
      }catch(error){
        console.log(error);
      }              
        setSiteConfig(siteconfig1); 
        setSmartmetaDataDetails(smartmetaDetails);       
    }

    const checkDuplicateGroup = (groupitem: any, groupitems: any): boolean =>{
        if(groupitems?.length === 0) {return false}
        else {          
            return groupitems.some((item: any) => item.Title == groupitem);
        }
    }

    const checkDuplicateItem =(filteritems:any,filteritem:any):boolean =>{
        if(filteritems?.length === 0) {return false}
        else {          
            return filteritems.some((item: any) => item.Id == filteritem.Id);
        }
    }
    filterGroups1= [{ Title: 'Team Member', selected: false},
    {Title: 'Foundation',selected: false,Site:'sp'},
    {Title: 'Offshore Tasks',selected: false,Site:'sp'},
    {Title: 'SDC Sites',selected: false,Site:'sp'},
    {Title: 'Status',selected: false}];   
    
    filters = [
        {
            'Title': '0% Not Started',
            'Id': '0', 
            'TaxType': 'Status',
            'label': 'Status',
            'StatusValue': 0
        },
        {
            'Title': '01% For Approval', 'Id': '01',
            'TaxType': 'Status', 'label': 'Status',
            'StatusValue': 1
        }, {
            'Title': '02% Follow up', 'Id': '02',
            'TaxType': 'Status', 'label': 'Status',
            'StatusValue': 2
        },
        { 'Title': '03% Approved', 'Id': '03', 'TaxType': 'Status', 'label': 'Status', 'StatusValue': 3 },
        { 'Title': '05% Acknowledged', 'TaxType': 'Status', 'label': 'Status', 'Id': '05', 'StatusValue': 5 },
        { 'Title': '10% working on it', 'Id': '10', 'TaxType': 'Status', 'label': 'Status', 'StatusValue': 10 },
        { 'Title': '70% Re-Open', 'Id': '70', 'TaxType': 'Status', 'label': 'Status', 'StatusValue': 70 },
        { 'Title': '80% In QA Review', 'Id': '80', 'TaxType': 'Status', 'label': 'Status', 'StatusValue': 80 },
        { 'Title': '90% Task completed', 'Id': '90', 'TaxType': 'Status', 'label': 'Status', 'StatusValue': 90 },
        { 'Title': '93% For Review', 'Id': '93', 'TaxType': 'Status', 'label': 'Status', 'StatusValue': 93 },
        { 'Title': '96% Follow-up later', 'Id': '96', 'TaxType': 'Status', 'label': 'Status', 'StatusValue': 96 },
        { 'Title': '99% Completed', 'Id': '99', 'TaxType': 'Status', 'label': 'Status', 'StatusValue': 99 },
        { 'Title': '100% Closed', 'Id': '100', 'TaxType': 'Status', 'label': 'Status', 'StatusValue': 100 }];

    const loadSmartFilter = () =>{
        smartmetaDataDetails.forEach((filterItem:any)=>{
            if(filterItem.SmartFilters != undefined && filterItem.SmartFilters != null && filterItem.SmartFilters.indexOf('Dashboard') > -1){
                if(filterItem.ParentID == 0){   
                    filterItem.label = filterItem.TaxType;                 
                    if(filterItem.TaxType == 'Sites'){                                          
                        getfilteritemChild(filterItem, smartmetaDataDetails);
                        if(filterItem?.children?.length>0){
                            filterItem.children.forEach((childitem:any)=>{
                                childitem.label = filterItem.Title;
                                if(!checkDuplicateItem(filters,childitem))
                                 filters.push(childitem);
                            })                            
                        }
                        else{
                            if(!checkDuplicateItem(filters,filterItem))
                             filters.push(filterItem);
                        }
                        
                    }
                    else{
                        getfilteritemChild(filterItem, smartmetaDataDetails);
                        if(!checkDuplicateItem(filters,filterItem))
                          filters.push(filterItem);
                        
                    }
                    if(!checkDuplicateGroup(filterItem.TaxType,filterGroups1)){
                        if(filterItem.TaxType != 'Sites' && filterItem.TaxType != 'Ex-Staff' && filterItem.TaxType != 'Status' && filterItem.TaxType != 'Time' && filterItem.TaxType != 'Task Types'&& filterItem.TaxType != 'Task Type')
                         filterGroups1.push({Title:filterItem.TaxType,selected:false})                                             
                    }                                                                          
                }
            }          
        })

        filters.forEach((item:any)=>{
            if(item.Title==='Offshore Tasks'){
                item.label = item.Title;
                if (item.children != undefined && item?.children?.length > 0) {
                    item.children.forEach(item.children, function (sitechild:any) {
                        sitechild.label = item.Title;
                    })
                }
            }
        })
        teamfilters.map((teamitm:any)=>{            
            filters.push(teamitm);
        })
        filterteamgroup.map((teamgroup:any)=>{
            if(!checkDuplicateItem(filters,teamgroup))
             filterGroups1.push(teamgroup);
        })
        setfilterGroups(filterGroups1);        
        setfilterItems(filters);
        console.log(filterItems)
        console.log(filters)
    }
    const getfilteritemChild = (childitem1:any,Allarray:any)=>{
        childitem1.children = [];
        for (let index = 0; index < Allarray?.length; index++) {
            let childItem2 = Allarray[index];
            if (childItem2.ParentID != undefined && parseInt(childItem2.ParentID) == childitem1.ID) {                
                childitem1.children.push(childItem2);
                getfilteritemChild(childItem2, Allarray);
            }
        }
        if (childitem1?.children?.length == 0) {
            delete childitem1.children;
        }
    }
    const PortfolioListItems = () =>{
        web.lists.getById("c21ab0e4-4984-4ef7-81b5-805efaa3752e").items.select('Title','Color','Suffix','IdRange').getAll().then((response:any) => {
            PortfolioItems = response;
            console.log(PortfolioItems);
        }).catch((error: any) => {
            console.error(error);
        });
    }  

    const LoadAllSiteTasks=(siteconfig1:any)=>{
        const Alltaskitem:any = [];
        let listItems:any[] = [];
        (async () => {
            try {
              for (const listitem of siteconfig1) {
                if(listitem.Title==='Master Tasks'){
                    var query = "Deliverables,TechnicalExplanations,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,ValueAdded,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,PortfolioType/Title,PortfolioType/Id,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,TaskCategories/Id,TaskCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,TeamMembers/Title,TeamMembers/Name,Component/Id,Component/Title,Component/ItemType,TeamMembers/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title";
                    var expandlookup = "ComponentPortfolio,ServicePortfolio,Portfolio,PortfolioType,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,TeamMembers,TaskCategories,Parent"
                }
                else{
                    var query = "WebpartId,FeedBack,FolderID,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,PortfolioType/Title,PortfolioType/Id,Comments,component_x0020_link,TaskID,SharewebTaskLevel1No,SharewebTaskLevel2No,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,FileLeafRef,Title,Id,Priority_x0020_Rank,PercentComplete,StartDate,TeamMembers/Id,TeamMembers/Title,DueDate,Status,Body,Priority,Created,Modified,TaskType/Id,TaskType/Title,TaskType/Level,TaskType/Prefix,Author/Id,Author/Title,Editor/Id,Editor/Title,Component/Id,Component/Title,Services/Id,Services/Title,Events/Id,Events/Title,Categories,TaskCategories/Id,TaskCategories/Title,ClientCategory/Id,ClientCategory/Title";        
                    var expandlookup="ClientCategory,TaskType,TaskCategories,Portfolio,PortfolioType,Component,Services,Events,AssignedTo,TeamMembers,Author,Editor"
                }
                if(listitem?.listId){                   
                    const list = web.lists.getById(listitem?.listId);
                    const items = await list.items.select(query).expand(expandlookup).getAll();
                    listItems.push({ listitem, items });                     
                }
                else{
                    const items:any = [];
                    listItems.push({ listitem, items });
                }                
              }
              console.log("List Items:", listItems);
              listItems?.map((allitem:any)=>{
                if(allitem?.listitem?.Title==='Master Tasks')                  
                    copymastertasksitem = allitem.items;
                if(allitem?.items?.length>0){
                    allitem?.items.map((taskitems:any)=>{
                        taskitems.siteName = allitem?.listitem.siteName;
                        taskitems.listId = allitem?.listitem?.listId;
                        if (taskitems.siteName !== 'Master Tasks') {
                            taskitems.siteurl = allitem?.listitem?.Item_x005F_x0020_Cover?.Url || '';                            
                        }
                        else {

                            if(taskitems?.Item_x0020_Type)
                             taskitems.Item_x0020_Type = taskitems.Item_x0020_Type === "Component Category" ? "Component" : taskitems.Item_x0020_Type;
                            // val.SiteIcon = SharewebCommonFactoryService.GetIconImageUrl(val.siteType, _spPageContextInfo.webAbsoluteUrl, val);
                            if(taskitems.siteName === 'Master Tasks' && taskitems.Item_x0020_Type ==='Component')
                                taskitems.siteurl = PageContext._pageContext._web.absoluteUrl+'/SiteCollectionImages/ICONS/Shareweb/component_icon.png'
                            else if (taskitems.siteName === 'Master Tasks' && taskitems.Item_x0020_Type  ==='SubComponent')
                             taskitems.siteurl = PageContext._pageContext._web.absoluteUrl+'/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
                            else if (taskitems.siteName  === 'Master Tasks' && taskitems.Item_x0020_Type ==='Feature')
                             taskitems.siteurl = PageContext._pageContext._web.absoluteUrl+'/SiteCollectionImages/ICONS/Shareweb/feature_icon.png'                             
                        } 
                        taskitems.SiteIcon = taskitems.siteurl 
                        if (taskitems?.Item_x0020_Type) {
                            taskitems.isPortfolio = true;
                        } else {
                            taskitems.isPortfolio = false;
                        } 
                        if (taskitems?.Services?.results?.length > 0)
                          taskitems.Portfoliotype = 'Service';
                        else
                            taskitems.Portfoliotype = 'Component';

                        if (taskitems?.PortfolioType === 'Service' && taskitems?.siteName === 'Master Tasks') {
                            taskitems.Portfoliotype = 'Service';

                        }
                        else if (taskitems?.siteName === 'Master Tasks' && taskitems?.PortfolioType === 'Events') {
                            taskitems.Portfoliotype = 'Events';
                        }
                        else if (taskitems?.siteName === 'Master Tasks' && taskitems?.PortfolioType !== 'Events' && taskitems?.PortfolioType !== 'Service') {
                            taskitems.Portfoliotype = 'Component';
                        } 
                        if (taskitems?.ComponentPortfolio) {
                            taskitems.tagComponent = taskitems.ComponentPortfolio;
                        }
                        if (taskitems.ServicePortfolio) {
                            taskitems.tagComponent = taskitems.ServicePortfolio;
                        }                    
                        Alltaskitem.push(taskitems);        
                    });                    
                }                                                              
              })
              if(Alltaskitem?.length>0){
                Alltaskitem.map((taskitems:any)=>{
                    if(taskitems?.Portfolio != undefined && taskitems?.Portfolio != null){
                        taskitems.tagComponentTitle = taskitems.Portfolio.Title;
                        taskitems.tagComponentId = taskitems.Portfolio.Id
                    }                                      
                    // taskitems?.Services?.map((type:any)=>{
                    //     taskitems.tagComponentTitle = type.Title;
                    //     taskitems.tagComponentId = type.Id
                    // });
                    // taskitems?.Events?.map((type:any)=>{
                    //     taskitems.tagComponentTitle = type.Title;
                    //     taskitems.tagComponentId = type.Id
                    // });
                    if(taskitems?.PercentComplete)
                     taskitems.PercentComplete = parseInt((taskitems.PercentComplete * 100).toFixed(0));
                    teamfilters.map((useritems:any)=>{
                        if(useritems.AssingedToUserId === taskitems.Editor.Id && useritems.Item_x0020_Cover !== null){
                            taskitems.userImageUrl = useritems.Item_x0020_Cover.Url;
                            taskitems.userImageId = useritems.AssingedToUserId;
                            taskitems.userImageTitle = useritems.Title;
                        }
                    })                
                    if(taskitems?.TaskID === null)
                      taskitems.TaskID = GetTaskId(taskitems);                                           
                    taskitems.Created = moment(taskitems.Created).format('MM/DD/YYYY');                
                    taskitems.Modified = moment(taskitems.Modified).format('MM/DD/YYYY');
                    if (taskitems?.Component?.results?.length > 0) {
                        taskitems['Portfoliotype'] = 'Component';
                    }
                    if (taskitems?.Services?.results?.length > 0) {
                        taskitems['Portfoliotype'] = 'Service';
                    }
                    if (taskitems?.Events?.results?.length > 0) {
                        taskitems['Portfoliotype'] = 'Event';
                    }
                    if (!taskitems?.Component?.results?.length && !taskitems?.Services?.results?.length && !taskitems?.Events?.results?.length) {
                        taskitems['Portfoliotype'] = 'Component';
                    }
                    if(taskitems?.DueDate)
                        taskitems.DueDate = moment(taskitems.DueDate).format('MM/DD/YYYY');                              
                    AllListitems.push(taskitems);
                })
                console.log(AllListitems);
                setAlllistsData(AllListitems);
                setloading(false);
                // loadfilters(AllListitems);              
            }             
            } catch (error) {
              console.error("Error:", error);
            }            
        })();                              
    }
   
    React.useEffect(() => {
        loadSmartFilter();
    }, [smartmetaDataDetails])

    const showSmartFilter = (filter:any) => {
        switch(filter){
            case 'isSitefilter':
                if (IsSmartfilter.isSitefilter === true) {
                    setIsSmartfilter((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isSitefilter: false}
                    });                    
                } else {
                    setIsSmartfilter((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isSitefilter: true}                       
                    });                    
                }
                
                break;
            case 'isCategoriesStatus':
                if (IsSmartfilter.isCategoriesStatus === true) {
                    setIsSmartfilter((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isCategoriesStatus: false}
                    });
                } else {
                    setIsSmartfilter((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isCategoriesStatus: true}
                    });
                }
               
                break;
            case 'isTeamMemberfilter':
                if (IsSmartfilter.isTeamMemberfilter === true) {
                    setIsSmartfilter((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isTeamMemberfilter: false}
                    });
                } else {
                    setIsSmartfilter((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isTeamMemberfilter: true}
                    });
                }
                
                break;
            case 'isDatefilter':
                if (IsSmartfilter.isDatefilter === true) {
                    setIsSmartfilter((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isDatefilter: false}
                    });
                } else {
                    setIsSmartfilter((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isDatefilter: true}
                    });
                }
                
                break;
        }       
    }   

    const IsExitSmartfilter = (array:any, Item:any)=> {
        var isExists = false;
        var count = 0;
        Item.MultipleTitle = '';
        array.map((fitem:any) =>{
            if (fitem.label != undefined && Item.Title != undefined && fitem.label == Item.Title && fitem.selected === true) {
                isExists = true;
                count++;
                Item.MultipleTitle += (fitem.label === 'Date' ? fitem.TitleNew : fitem.Title) + ', ';
                return false;
            }
            else if(fitem.label === undefined && Item.Title != undefined && fitem.TaxType == Item.Title && fitem.selected === true){
                isExists = true;
                count++;
                Item.MultipleTitle += (fitem.label === 'Date' ? fitem.TitleNew : fitem.Title) + ', ';
                return false;
            }
        });
        if (Item.MultipleTitle != "")
            Item.MultipleTitle = Item.MultipleTitle.substring(0, Item.MultipleTitle.length - 2);
        Item.count = count;
        return isExists;
    }
    const issmartExists = (array:any, title:any)=> {
        var isExists = false;
        array.map((item1:any,index:any)=> {
            if (item1.Title == title.Title) {
                isExists = true;
                return false;
            }           
        });
        return isExists;
    }
    
    const handleGroupCheckboxChanged = (event:any,groupitem:any,smatvalue:any) =>{
        const ischecked =  event.target.checked;
        const dataid = event.target.id;       
        let ShowSelectdSmartfilter1:any = [];
        if(smatvalue === ''){           
            if(ischecked && groupitem.TaxType === undefined){
                groupitem.selected = true;
                filterItems.map((fitm:any)=>{
                    if(fitm.label === groupitem.Title){
                        fitm.selected = true;
                        fitm?.children?.map((child:any)=>{
                            child.selected = true;
                            child?.children?.map((childs:any)=>{
                                childs.selected = true;
                            })
                        })
                    }
                })
            }
            else if(ischecked && groupitem.TaxType !== undefined){
                filterItems.map((fitm:any)=>{
                    if(fitm.TaxType === groupitem.TaxType && fitm.Title === groupitem.Title){
                        fitm.selected = true;                        
                    }
                    fitm?.children?.map((child:any)=>{
                        if(fitm.selected)
                         child.selected = true;
                        else if(child.Title === groupitem.Title && child.TaxType === groupitem.TaxType){
                            child.selected = true;
                        }
                        child?.children?.map((childs:any)=>{
                            if(child.selected)
                             childs.selected = true;
                            else if(childs.Title === groupitem.Title && childs.TaxType === groupitem.TaxType){
                                childs.selected = true;
                            }
                        })
                    })
                })
            }
            else{
                groupitem.selected = false;
                filterItems.map((fitm:any)=>{
                    if(fitm.label === groupitem.Title || fitm.Title === groupitem.Title)
                     fitm.selected = false;                    
                    fitm?.children?.map((child:any)=>{
                        if(fitm?.selected === false){
                            child.selected = false;                             
                        }
                        else if(child.Title === groupitem.Title){
                            child.selected = false;
                        }
                        child?.children?.map((childs:any)=>{
                            if(child?.selected === false){
                                childs.selected = false;
                            }                                                       
                            else if(childs.Title === groupitem.Title){
                                childs.selected = false;
                            }
                        })
                    })
                })
                const selectedfilter1 = selectedfilter.filter((child:any) => child.selected === true)
                setShowSelectdSmartfilter(selectedfilter1);
            }
            filterItems.map((filterItem:any) =>{
                isShowItem = false; 
                if (filterItem?.selected && filterItem.Title != 'QA Team' && filterItem.Title != 'Support Team' && filterItem.Title != 'Design Team' && filterItem.Title != 'Senior Team' && filterItem.Title != 'HHHH Team')
                {
                    if(!checkDuplicateItem(selectedfilter,filterItem)){
                       // isShowItem = true;
                        selectedfilter.push(filterItem);
                    }
                   
                }
                if (filterItem?.children?.length > 0) {
                    filterItem.children.map((child:any)=> {
                        if (child?.selected){
                            // filterItem.selected = true;
                            if(!checkDuplicateItem(selectedfilter,child))
                                selectedfilter.push(child);                            
                           
                        }
                        if (child?.children?.length > 0) {
                            child.children.map((subchild:any) =>{
                                if (subchild?.selected){
                                    // filterItem.selected = true;
                                    if(!checkDuplicateItem(selectedfilter,child))
                                     selectedfilter.push(child);                                      
                                }
                            });
                        }
                    });
                }
            });
            selectedfilter?.map((smart:any)=>{
                if(smart.TaxType === 'Team Member' && smart.selected === true){
                    setCreatemodified({"isCreated":true,"isModified":true,"isAssignedto":true});
                }
                else if(smart.TaxType !== 'Team Member'){
                    setCreatemodified({"isCreated":false,"isModified":false,"isAssignedto":false});
                } 
                if(smart.selected){
                    var smartfilterItems:any = {};
                    smartfilterItems.Title = smart.label || smart.TaxType;
                    if (IsExitSmartfilter(selectedfilter, smartfilterItems)) {
                        if (smartfilterItems.count >= 3) {
                            smartfilterItems.selectTitle = ' : (' + smartfilterItems.count + ')';
                        } else smartfilterItems.selectTitle = ' : ' + smartfilterItems.MultipleTitle;
                    }
                    if (!issmartExists(ShowSelectdSmartfilter1, smartfilterItems))
                        ShowSelectdSmartfilter1.push(smartfilterItems);    
                }             
                                                   
            })
            setShowSelectdSmartfilter(ShowSelectdSmartfilter1);   
            if(dataid === 'Component'){
                if(composervtask.iscompo){
                    setcomposervtask((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, iscompo: false}
                    });
                }
                else{
                    setcomposervtask((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, iscompo: true}
                    });
                }
                
            }      
            else if(dataid === 'Service'){
                if(composervtask.isservice){
                    setcomposervtask((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isservice: false}
                    });
                }
                else{
                    setcomposervtask((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, isservice: true}
                    });
                }
                
            }        
            else if(dataid === 'Task'){
                if(composervtask.istask){
                    setcomposervtask((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, istask: false}
                    });
                }
                else{
                    setcomposervtask((previoussmartfilter: any) => {
                        return { ...previoussmartfilter, istask: true}
                    });
                }            
            }              
        }
        else if(smatvalue === 'smartfavorite'){
            if(ischecked){
                groupitem.selected = true;
                selectedFavoriteitem?.map((item:any,index:any)=>{
                    item.selected = true;
                })
            }
            else{
                groupitem.selected = false;
                selectedFavoriteitem?.map((item:any,index:any)=>{
                    item.selected = false;
                })                
            }                      
        }
            
    }       
   
    const Searchtasks=()=>{
        let searchingvalue:any = '';
        if(!isShowTable){            
            setisShowTable(true); 
            isShowItem = true;                                          
            if (keywordsvalue !== undefined  && keywordsvalue !== '') {
                selectedfilter?.map((key:any,index:any)=>{
                    if (key?.GlobalSearch !== undefined){
                        selectedfilter.splice(index,1)
                    }
                })
                filterItems.map((filterItm:any, index:any)=> {
                    if (filterItm?.GlobalSearch !== undefined)
                        filterItems.splice(index, 1);
                })
                var Item:any = {};
                Item.GlobalSearch = keywordsvalue
                if (advanceValueAll !== undefined)
                    Item.advanceValueAll = advanceValueAll;
                if (updateFiltervalue !== undefined)
                    Item.updateFilterAll = updateFiltervalue;
                Item.slectpopupradio = false;
                filterItems.push(Item);
                searchingvalue = Item;
            }
            if(searchingvalue !== undefined && searchingvalue !== ''){
                if(selectedfilter?.length > 0){
                    selectedfilter.push(searchingvalue);                   
                }
                else
                 selectedfilter = searchingvalue
            }             
            else
             selectedfilter = selectedfilter;

            setShowTableItem(selectedfilter);
        }       
        else{
            setisShowTable(false);            
        }         
    }
   
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
    const ClearFilters=()=>{
        selectedfilter=[];
        setShowTableItem([]);
        setShowSelectdSmartfilter([])
        filterItems.map((items:any)=>{
            if(items.selected){
                items.selected = false;
            }
            items?.children?.map((child:any)=>{
                child.selected = false;
                child?.children?.map((subchild:any)=>{
                    subchild.selected = false;
                })
            })
        })       
        setduedate({"isCretaedDate":false,"isModifiedDate":false,"isDueDate":false});
        setstartDate('');
        setendDate('');
        seteventdatevalue('');
        setCreatemodified({"isCreated":false,"isModified":false,"isAssignedto":false});
    }

    const filtercompo  = (event:any)=>{        
        // selectedfilter = []
        let showselected:any = [];
        if(event.target.checked){
            if(event.target.value === 'Component'){
                composervtask.iscompo = event.target.checked
               filterItems.map((filter:any)=>{
                    if(filter.Title === 'Component' && filter.TaxType === 'Portfolio Type'){
                        filter.selected = true;
                        if(!issmartExists(selectedfilter, filter))                       
                         selectedfilter.push(filter);
                        // showselected.Title = filter.TaxType;
                        // showselected.selectTitle = filter.Title;
                    }
                    
                })
            }
            else if(event.target.value=== 'Service'){
                composervtask.isservice = event.target.checked 
                filterItems.map((filter:any)=>{
                    if(filter.Title === 'Service' && filter.TaxType === 'Portfolio Type'){
                        filter.selected = true;                        
                        if(!issmartExists(selectedfilter, filter))                       
                         selectedfilter.push(filter);
                        // showselected.Title = filter.TaxType;
                        // showselected.selectTitle = filter.Title;
                    }
                     
                })
            }
            else if(event.target.value === 'Task'){
                composervtask.istask = event.target.checked
                filterItems.map((filter:any)=>{
                    if(filter.TaxType === 'Type'){
                        filter.selected = true;                       
                        if(!issmartExists(selectedfilter, filter))                       
                         selectedfilter.push(filter);
                        // showselected.Title = filter.TaxType;
                        // showselected.selectTitle = filter.Title;
                    }
                })
            }            
        }
        else {
            if(event.target.value === 'Component'){
                composervtask.iscompo = event.target.checked
               filterItems.map((filter:any)=>{
                    if(filter.Title === 'Component' && filter.TaxType === 'Portfolio Type'){
                        filter.selected = false;
                        selectedfilter.map((itm:any)=>{
                            if(itm.Id === filter.Id){
                                selectedfilter.splice(selectedfilter.indexOf(itm), 1);
                            }
                        })
                    }
                     
                })
            }
            else if(event.target.value === 'Service'){
                composervtask.isservice = event.target.checked 
                filterItems.map((filter:any)=>{
                    if(filter.Title === 'Service' && filter.TaxType === 'Portfolio Type')
                    {
                        filter.selected = false;
                        selectedfilter.map((itm:any)=>{
                            if(itm.Id === filter.Id){
                                selectedfilter.splice(selectedfilter.indexOf(itm), 1);
                            }
                        }) 
                    }               
                })
            }
            else if(event.target.value === 'Task'){
                composervtask.istask = event.target.checked
                filterItems.map((filter:any)=>{
                    if(filter.TaxType === 'Type')
                    {
                        filter.selected = false;
                        selectedfilter.map((itm:any)=>{
                            if(itm.Id === filter.Id){
                                selectedfilter.splice(selectedfilter.indexOf(itm), 1);
                            }
                        })
                    }
                })
            }
        }
        selectedfilter?.map((smart:any)=>{            
            if(smart.selected){
                var smartfilterItems:any = {};
                smartfilterItems.Title = smart.label || smart.TaxType;
                if (IsExitSmartfilter(selectedfilter, smartfilterItems)) {
                    if (smartfilterItems.count >= 3) {
                        smartfilterItems.selectTitle = ' : (' + smartfilterItems.count + ')';
                    } else smartfilterItems.selectTitle = ' : ' + smartfilterItems.MultipleTitle;
                }
                if (!issmartExists(showselected, smartfilterItems))
                 showselected.push(smartfilterItems);    
            }             
                                               
        })
        setShowSelectdSmartfilter(showselected);
        // setShowSelectdSmartfilter(showselected);
        console.log(filterItems);
    }

    const resetItem=()=> {
        setstartDate('');
        setendDate('');
        seteventdatevalue('');
        const updateitem = {"isCretaedDate":false,"isModifiedDate":false,"isDueDate":false};
        setduedate(updateitem);
    }

    const onDatevalueChanged=(event:any)=> {
        let eventvalue:any = event.target.value;
        const newDate = moment().format('MM/DD/YYYY');       
        if(eventvalue ===  'today'){
            setstartDate(new Date(newDate));
            setendDate(new Date(newDate));                                  
        }
        else if(eventvalue ===  'yesterday'){
            const yesterdaydate = moment().subtract(1,'days').format('MM/DD/YYYY'); 
            setstartDate(new Date(yesterdaydate));
            setendDate(new Date(yesterdaydate));              
        }
        else if(eventvalue ===  'thisweek'){
            const thisweek = moment().startOf('isoWeek').format('MM/DD/YYYY');           
            setstartDate(new Date(thisweek));
            setendDate(new Date(newDate));
            console.log(startDate);
            console.log(endDate);
        }
        else if(eventvalue ===  'last7days'){
            const last7days = moment().subtract(6, 'days').format('MM/DD/YYYY');            
            setstartDate(new Date(last7days));
            setendDate(new Date(newDate));
            console.log(startDate);
            console.log(endDate); 
        } 
        else if(eventvalue ===  'thismonth'){
            const thismonth = moment().startOf('month').format('MM/DD/YYYY');           
            setstartDate(new Date(thismonth));
            setendDate(new Date(newDate));
        } 
        else if(eventvalue ===  'lat30days'){
            const lastmonth = moment().subtract(30,'days').format('MM/DD/YYYY');
            const curr = moment().subtract(1, 'days').format('MM/DD/YYYY');           
            setstartDate(new Date(lastmonth));
            setendDate(new Date(curr));
        } 
        else if(eventvalue ===  'thisyear'){ 
            const entireyear = moment().subtract('year').month(0).startOf('month').format('DD/MM/YYYY');
            const currdate = moment().subtract(0, 'days').format('DD/MM/YYYY');               
            setstartDate(new Date(entireyear));
            setendDate(new Date(currdate));
        }
        else if(eventvalue ===  'lastyear'){ 
            const lastyear = moment().subtract(1, 'year').month(0).startOf('month').format('MM/DD/YYYY');
            const currdate = moment().subtract(1, 'year').month(11).endOf('month').format('MM/DD/YYYY');               
            setstartDate(new Date(lastyear));
            setendDate(new Date(currdate));
        }
        else if(eventvalue ===  'custom'){
            setstartDate('');
            setendDate('');
        }       
        const ischecked = event.target.checked;
        if(ischecked === true){
            const updateitem = {"isCretaedDate":true,"isModifiedDate":true,"isDueDate":true}
            setduedate(updateitem);
        }       
        seteventdatevalue(eventvalue);      
    }
    const handleCreatedModifiedvalue = (event:any) =>{
        if(!event.target.checked){
            switch(event.target.value){
                case "isCretaedDate":
                    setduedate((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isCretaedDate:false}
                    });
                    break;
                case "isModifiedDate":
                    setduedate((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isModifiedDate:false}
                    });
                    break;
                case 'isDueDate':
                    setduedate((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isDueDate:false}
                    });
                    break;
                case 'isCreated':
                    setCreatemodified((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isCreated:false}
                    });
                    break;
                case 'isModified':
                    setCreatemodified((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isModified:false}
                    });
                    break;
                case 'isAssignedto':
                    setCreatemodified((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isAssignedto:false}
                    });
                    break;
                default:
                    break;
    
            }
        }
        else{
            switch(event.target.value){
                case "isCretaedDate":
                    setduedate((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isCretaedDate:true}
                    });
                    break;
                case "isModifiedDate":
                    setduedate((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isModifiedDate:true}
                    });
                    break;
                case 'isDueDate':
                    setduedate((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isDueDate:true}
                    });
                    break;
                case 'isCreated':
                    setCreatemodified((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isCreated:true}
                    });
                    break;
                case 'isModified':
                    setCreatemodified((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isModified:true}
                    });
                    break;
                case 'isAssignedto':
                    setCreatemodified((updatesmartfilteritems:any)=>{
                        return{...updatesmartfilteritems,isAssignedto:true}
                    });
                    break;
                default:
                    break;
    
            }
        }
         

    }
    const changeStartDate = (event:any)=>{
        const datevalue = event.target.value;
        setstartDate(moment(datevalue).format('MM/DD/YYYY'));       
    }

    const changeEndDate = (event:any)=> {
        const datevalue = event.target.value;
        setendDate(moment(datevalue).format('MM/DD/YYYY'));        
    }
    const headerfield = (event:any)=>{      
        advanceValueAll = event.target.value; 
        setadvanceValue(advanceValueAll);       
    } 
    const updateFilter = (event:any)=>{
        updateFiltervalue = event.target.value;
        setupdatevalue(updateFiltervalue) 
    }

    const keywords = (event:any)=>{
        keywordsvalue = event.target.value;
    }
    const AddSmartFavorite = ()=>{
        let Favoriteitem:any = [];
        let dateitem:any={};
        filterItems?.map((item:any)=>{
            if(item.selected){
                setCreatemodified({"isCreated":true,"isModified":true,"isAssignedto":true});
                if(!checkDuplicateItem(Favoriteitem,item)){
                    Favoriteitem.push(item);
                } 
            }
            if(item?.children?.length>0){
                item.children.map((child:any)=>{
                    if(child.selected){
                        if(!checkDuplicateItem(Favoriteitem,child))
                         Favoriteitem.push(child);
                    }
                    if(child?.children?.length>0) {
                        child.children.map((childs:any)=>{
                            if(childs.selected){
                                if(!checkDuplicateItem(Favoriteitem,childs))
                                 Favoriteitem.push(childs);
                            }
                        })
                    }
                })
            }
        })        
        if(duedate?.isCretaedDate || duedate?.isModifiedDate || duedate?.isDueDate ){
            dateitem = duedate;
            dateitem['Group'] = 'Date';
            dateitem['label'] = 'Date';
            dateitem['Startdate'] = startDate;
            dateitem['EndDate'] = endDate;
            Favoriteitem.push(dateitem);
        }
        setselectedFavoriteitem(Favoriteitem);
        setopensmartfavorite(true);
    }
    const closePopup = ()=>{
        setopensmartfavorite(false);
    } 
   
    const loadAdminConfigurations = ()=>{           
        let SmartFavoritesConfig1:any[] = [];
        let copyCreateMeSmartFavorites:any = [];
        let copyEveryoneSmartFavorites:any = [];
        // if(stringSmartfavoriteID !== '')
        //  var filter = "Id eq " + stringSmartfavoriteID + "";
        // else
        //  var filter = "Key eq 'SmartfavoritesSearch'";
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
                        // if (stringSmartfavoriteID != undefined && stringSmartfavoriteID != '') {
                        //     config.FavoriteId = smart.Id;
                        //     config.Favorite = smart;
                        //     if (!checkDuplicateItem(SmartFavoritesConfig1, config.Favorite))
                        //        SmartFavoritesConfig1.push(config);                        
                        //     else if (config.CurrentUserID != undefined && config.CurrentUserID == PageContext._pageContext._initializationData.aadInfo.userId || config.isShowEveryone == true) {
                        //        config.FavoriteId = smart.Id;
                        //        config.Favorite = smart;
                        //     if (!checkDuplicateItem(SmartFavoritesConfig1, config.Favorite))
                        //         SmartFavoritesConfig.push(config);
                        //     if (config.isShowEveryone != false && !checkDuplicateItem(copyEveryoneSmartFavorites, config.Favorite))
                        //         copyEveryoneSmartFavorites.push(config);
                        //     if (config.isShowEveryone == false && !checkDuplicateItem(copyCreateMeSmartFavorites, config.Favorite))
                        //         copyCreateMeSmartFavorites.push(config);
                        //     }

                        // }
                        // config.FavoriteId = smart.Id;
                        // config.Favorite = smart;
                        // if (!checkDuplicateItem(SmartFavoritesConfig1, config.Favorite))
                        //    SmartFavoritesConfig1.push(config);                        
                        if (config.CurrentUserID !== undefined && config.CurrentUserID === PageContext._pageContext._legacyPageContext.userId || config.isShowEveryone === true) {
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

    const FilterFavoritesTask = (item:any, Items:any, itemIndex:any,val1:any) =>{  
        isShowItem = true; 
        item.map((objitem:any)=> {
            filterItems.map((filterItm:any)=>{
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
        setShowTableItem([...item]);
    }

    const cancelAddSmartfaviratesfilter = ()=>{

    }

    let SmartFavoritesConfig2:any=[];
    const AddSmartfaviratesfilter = ()=>{
        let SelectedFavorites:any=[];
        let AddnewItem:any = [];
        if(FavoriteFieldvalue === 'SmartFilterBased'){
            selectedFavoriteitem.map((filter:any)=>{
                if(filter.selected)
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
            CurrentUserID:PageContext._pageContext._legacyPageContext.userId,
            isShowEveryone:isShowEveryone,
            SelectedFavorites:SelectedFavorites,                     
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
            setopensmartfavorite(false);            
        }) 
                         
    }    

    const OpenSmartfavorites = (value:any)=>{
        if(value === 'isSmartFavorites'){            
            // if(stringSmartfavoriteID != undefined && stringSmartfavoriteID != '')
            //     LoadAllsmartfavourites();
            // else(SmartFavoritesConfig?.length === 0)
            //  loadAdminConfigurations()
            loadAdminConfigurations();           
            selectedfilter = [];
           setisSmartFavorites(true);
            
        }
        else{
            setisSmartFavorites(false);
        }
    }
    const FavoriteField = (event:any)=>
    {
        const fieldvalue = event.target.value;
        setFavoriteFieldvalue(fieldvalue);
    }

    const deletedItem = async (val: any, Type: any) => {
        if (Type == 'Onlyme') {
            var deleteConfirmation = confirm("Are you sure, you want to delete this?")
            if (deleteConfirmation) {
                
                await web.lists.getById(GlobalConstants.SHAREWEB_ADMIN_CONFIGURATIONS_LISTID).items.getById(val.FavoriteId).delete()
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
             
                await web.lists.getById(GlobalConstants.SHAREWEB_ADMIN_CONFIGURATIONS_LISTID).items.getById(val.FavoriteId).delete()

                EveryoneSmartFavorites?.forEach((vall: any, index: any) => {
                    if (vall.FavoriteId == val.FavoriteId) {
                        EveryoneSmartFavorites.splice(index, 1)
                    }
                })
                // setCount(count + 1)

            }
        }

    }
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className='subheading'>
                   Smart Favorites                    
                </div>
                {/* <Tooltip ComponentId="528" /> */}
            </div>
        );
    };
    const CheckedUncheckedItem = (e:any)=>{
        if(isShowEveryone)
         setisShowEveryone(false);
        else
         setisShowEveryone(true);
    }
    const ChangeTitle =(e:any)=>{
        const Title = e.target.value;
        setsmartTitle(Title);
    }
    const ChangeUrl = (event:any)  =>{
        const Url = event.target.value;
        setSmartFavoriteUrl(Url);
    }

    const SiteSmartfilters={
        Createmodified:Createmodified,
        selectedfilters:ShowTableItem,
        startDate:startDate,
        endDate:endDate,
        duedate:duedate,
        siteConfig:siteConfig,
        AllData:AlllistsData,
        isShowItem:isShowItem,
        isGMBH:isGMBH,
        copymastertasksitem:copymastertasksitem,
        
    }
    const isItemExistsGroup = (array:any, Item:any)=> {
        let isExists:any = false;
        array.map((itm:any) =>{
            if (itm.Group == Item.Group) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const defaultselectFiltersBasedOnSmartFavorite = (obj:any, filter:any)=> {       
        if (obj?.Title === filter?.Title) {
            filter.selected = true;
        }
        if (filter.children != undefined && filter.children.length > 0) {
            filter?.children.map((childFilter:any)=> {
                if (filter.selected && obj.Title === filter.Title) {
                    childFilter.selected = true;
                }              
                defaultselectFiltersBasedOnSmartFavorite(obj, childFilter);
            })
        }
    }
    const openEditPopup = (edititem: any) => {
        let selectedFiltersItemsGroups:any = [];        
        setedit(true)       
        if (edititem.SmartFavoriteType == 'SmartFilterBased') {
            if (edititem.SelectedFavorites != undefined) {
                edititem.SelectedFavorites.map((obj:any)=> {
                    let flag:any = true;
                    filterItems.map((filter:any) =>{
                        if (obj.Title == filter.Title && obj.Group == 'Date') {
                            filter.selected = true;
                            flag = false;
                        }
                        else if (obj.Group != 'Date') {
                            flag = false;
                            defaultselectFiltersBasedOnSmartFavorite(obj, filter);

                        }
                    })
                    if (flag) {
                        obj.selected = true;
                        filterItems.push(obj)
                    }
                    if (obj.Group != undefined && !isItemExistsGroup(selectedFiltersItemsGroups, obj))
                        selectedFiltersItemsGroups.push(obj)
                })
            }
        }
        else {
            setSmartFavoriteUrl(edititem.SelectedFavorites[0].Url);
        }
        setselectedFavoriteitem(selectedFiltersItemsGroups);
        setEditData(edititem);       
    }
    const closeEditPopup = ()=>{       
         setedit(false)
    }   
    const EditFavfilter = async () => {
        var AddData: any = []
        var newData: any = []
        editData.SelectedFavorites?.forEach((baa: any) => {
            if (baa.isSelected === true) {
                newData.push(baa)
            }

        })

        var favovitesItem: any = {}
        favovitesItem = {
            'SmartFavoriteType': editData.SmartFavoriteType,
            'Title': smartTitle != "" ? smartTitle : editData.Title,
            'isShowEveryone': isShowEveryone,
            'CurrentUserID': PageContext._pageContext._legacyPageContext.userId,
            'SelectedFavorites': newData


        }
        AddData.push(favovitesItem)       
        var Mydata = web.lists.getById(GlobalConstants.SHAREWEB_ADMIN_CONFIGURATIONS_LISTID).items.getById(editData.FavoriteId).update({
            Configurations: JSON.stringify(AddData),
            Key: 'SmartfavoritesSearch',
            Title: 'SmartfavoritesSearch',
        }).then((res: any) => {
            console.log(res)
            closeEditPopup()
        })

    }

    return (
        <>
            <section className="ContentSection">
                <div className="bg-wihite border p-2">
                    {!isSmartFavorites && <section className='udatefilter'>
                        <div className='row text-end' onClick={()=>OpenSmartfavorites('isSmartFavorites')}>
                          <a>Go to Smart Favorites</a>
                        </div>
                        <Row className='smartFilter'>
                            <details open>
                                <summary className='siteColor'> All filter {ShowSelectdSmartfilter?.length>0 && <span>-</span>} <span className="no-padding">
                                    {keywordsvalue && <span className="no-padding">{keywordsvalue}{ShowSelectdSmartfilter?.length>0 && <span>|</span>}</span>}
                                    {ShowSelectdSmartfilter?.map((updateditems:any,index:any)=>{
                                        return(
                                            <><span>
                                                <span className="no-padding">
                                                    {updateditems.Title ==='Foundation' && <span >MS Teams</span>}
                                                    {updateditems.Title !=='Foundation' && <span>{updateditems.Title} </span>}                                       
                                                    <span className="font-normal">{updateditems?.selectTitle}</span>
                                                    {index !== (ShowSelectdSmartfilter?.length -1) ? <span> | </span>:''}
                                                </span>
                                            </span>
                                            </>
                                        )
                                    })}</span>  
                                    <hr></hr> 
                                </summary>
                                <div className='m-0 py-2 px-3 row'>
                                    <div className='d-flex justify-content-between'>
                                        <div className='col-md-8'><input className='full-width' placeholder='Keywords' type='text' onChange={(e)=>keywords(e)}></input> </div>
                                        <div>
                                         <button className='btn btn-primary me-1' onClick={Searchtasks}>Update Filter</button>
                                         <button className='btn  btn-default' onClick={ClearFilters}> Clear Filters</button>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <div className='mt-2'>
                                        <label className='SpfxCheckRadio  me-2'>
                                         <input className='radio' type='radio' value="Allwords" checked={advanceValue === "Allwords"} onChange={(event)=>headerfield(event)}/> All words
                                        </label>
                                        <label className='SpfxCheckRadio   me-2'>
                                          <input className='radio' type='radio' value="Anywords" checked={advanceValue ==="Anywords"} onChange={(event)=>headerfield(event)}/> Any words
                                        </label>
                                        <label className='SpfxCheckRadio  me-2'>
                                          <input className='radio' type='radio' value="ExactPhrase" checked={advanceValue === "ExactPhrase"} onChange={(event)=>headerfield(event)}/> Exact Phrase
                                        </label>
                                        <span className='m-2'> | </span>
                                        <label className='SpfxCheckRadio  me-2 '>
                                          <input className='radio' type='radio' value="Title" checked={updatevalue === "Title"} onChange={(event)=>updateFilter(event)} /> Title
                                        </label>
                                        <label className='SpfxCheckRadio '>
                                         <input className='radio' type='radio' value="Allfields" checked={updatevalue === "Allfields"} onChange={(event)=>updateFilter(event)} /> All fields
                                        </label>
                                        <span className='m-2'>|</span>
                                        <label className='SpfxCheckRadio  me-2 '>
                                          <input className='form-check-input' type='checkbox'  id='Component' value='Component' onChange={(event)=>filtercompo(event)} /> Components
                                        </label>
                                        <label className='SpfxCheckRadio   me-2'>
                                         <input className='form-check-input' type='checkbox' id='Service' value='Service' onChange={(event)=>filtercompo(event)} /> Service
                                        </label>
                                        <span className='m-2'>|</span>
                                        <label className='SpfxCheckRadio '>
                                          <input className='form-check-input' type='checkbox' id='Task' value='Task' onChange={(event)=>filtercompo(event)} /> Task Items
                                        </label>
                                        </div>
                                        <div className='mt-2' onClick={AddSmartFavorite}>
                                          <a className='hreflink'>Add Smart Favorite</a> 
                                        </div>
                                    </div>
                                    {opensmartfavorite && <Panel title="popup-title" isOpen={true} onDismiss={closePopup} onRenderHeader={onRenderCustomHeaderMain} type={PanelType.medium} isBlocking={false}>                                       
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
                                                { selectedFavoriteitem?.length>0 && FavoriteFieldvalue === "SmartFilterBased" && <Row>
                                                    <table className='table hover border-0'>                                                                                                          
                                                        <tr className='border-bottom'>
                                                            { selectedFavoriteitem?.map((item: any, index: any) => { 
                                                                return(
                                                                    <td valign='top'>
                                                                        <div>
                                                                            <label className='smartPannel'>
                                                                              <span ><input className='form-check-input' type="checkbox" id={item.Title}  onChange={(event)=>handleGroupCheckboxChanged(event,item,"smartfavorite")}/> {item.label} </span>
                                                                            </label>
                                                                            
                                                                            {item.label !== 'Date' && <div>
                                                                                {filterItems?.length>0 && filterItems?.map((filteritem:any,index:any)=>{                                                                                           
                                                                                    return (
                                                                                        <div>                                                                                                                                                                       
                                                                                            {filteritem.label == item.label && <>
                                                                                                <span id="filterexpand">
                                                                                                    {filteritem.expand && filteritem?.children?.length > 0 &&  <SlArrowDown onClick={()=>loadMorefilter(filteritem)}></SlArrowDown>}
                                                                                                    {!filteritem.expand && filteritem?.children?.length > 0 && <SlArrowRight onClick={()=>loadMorefilter(filteritem)}></SlArrowRight>}
                                                                                                </span>                                                                                                
                                                                                                <span> 
                                                                                                    <input className='form-check-input' type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem,'')} /> {filteritem.Title}
                                                                                                </span>                                                                                                
                                                                                                <ul>
                                                                                                    {filteritem.expand === true && filteritem?.children?.length>0 && filteritem.children?.map((child:any)=>{
                                                                                                        return(<>
                                                                                                            <li style={{ listStyle: 'none' }}>
                                                                                                                <span id="filterexpand">
                                                                                                                    {child.expand && child?.children?.length > 0 &&  <SlArrowDown onClick={() => loadMorefilter(child)}></SlArrowDown> }
                                                                                                                    {!child.expand && child?.children?.length > 0 && <SlArrowRight onClick={() => loadMorefilter(child)}></SlArrowRight> }
                                                                                                                </span>
                                                                                                                <input className='form-check-input' type="checkbox" id={child.Title} value={child.Title} checked={child.selected} onChange={(event)=>handleGroupCheckboxChanged(event,child,'')} /> {child.Title}
                                                                                                                <ul>
                                                                                                                    {child.expand === true && child?.children?.length > 0 && child.children?.map((childs: any) => {
                                                                                                                        return (<li style={{ listStyle: 'none' }}><input className='form-check-input' type="checkbox" id={childs.Title} value={childs.Title} checked={childs.selected} onChange={(event)=>handleGroupCheckboxChanged(event,child,'')} /> {childs.Title} </li>);
                                                                                                                    })}
                                                                                                                </ul>
                                                                                                            </li></>)
                                                                                                        })}
                                                                                                </ul></>}                                                                                                                                                                                                                                                              
                                                                                    </div>)
                                                                                })}
                                                                            </div>}
                                                                            {item.label === 'Date' && <>                                                                                                
                                                                                <span> 
                                                                                    <input className='form-check-input' type="checkbox" checked={item.isCretaedDate} onChange={(event)=>handleGroupCheckboxChanged(event,item,'')} /> Created
                                                                                </span> 
                                                                                <span> 
                                                                                    <input className='form-check-input' type="checkbox" checked={item.isModifiedDate} onChange={(event)=>handleGroupCheckboxChanged(event,item,'')} /> Modified
                                                                                </span> 
                                                                                <span> 
                                                                                    <input className='form-check-input' type="checkbox" checked={item.isDueDate} onChange={(event)=>handleGroupCheckboxChanged(event,item,'')} /> DueDate
                                                                                </span> 
                                                                                </>
                                                                            }   
                                                                            
                                                                        </div>
                                                                    </td>                        
                                                                )
                                                            })}                                                              
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
                                </div>
                                <details>
                                  <summary className='siteColor' onClick={() => showSmartFilter('isSitefilter')}> Sites <hr></hr></summary>
                                    <>
                                    {IsSmartfilter.isSitefilter === true ? 
                                        <Row className='ps-30'  style={{ display: "block" }}>
                                          
                                                <table width="100%">
                                                    <tr className=''>
                                                        {filterGroups != null && filterGroups.length > 0 && filterGroups?.map((Group: any, index: any) => {
                                                            return (
                                                                <td valign="top">
                                                                    {Group.Site === 'sp'  &&
                                                                        <div> 
                                                                            {Group.Title !== 'Foundation' &&  <label className='smartPannel'>
                                                                               <span className='form-check'><input className='form-check-input' type="checkbox" id={Group.Title} checked={Group.selected} onChange={(event)=>handleGroupCheckboxChanged(event,Group,'')} /> {Group.Title} </span>
                                                                                </label>
                                                                            } 
                                                                            {Group.Title === 'Foundation' &&  <label className='smartPannel'>
                                                                            <input className='form-check-input' type="checkbox" id={Group.Title} checked={Group.selected} onChange={(event)=>handleGroupCheckboxChanged(event,Group,'')} /> MS Teams
                                                                                </label>
                                                                            }  
                                                                            <div>
                                                                                {filterItems?.map((filteritem:any,index:any)=>{
                                                                                    return (
                                                                                        <div>
                                                                                            {filteritem.label == Group.Title &&
                                                                                                <label>
                                                                                                    {filteritem.TaxType != 'Status' &&                                                                                           
                                                                                                        <span className='form-check'> <input className='form-check-input' type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem,'')} /> {filteritem.Title} </span>
                                                                                                    }                                                                                   
                                                                                                </label>
                                                                                            }
                                                                                        </div>
                                                                                                                                                                            
                                                                                    )
                                                                                })}
                                                                            </div>                                                                                                                                                                                                    
                                                                        </div> 
                                                                    }                                                            
                                                                                                                                
                                                                </td> )
                                                        })}
                                                    </tr>
                                                </table>                                        
                                            
                                        </Row>: ""}
                                    </>
                                </details>
                                <details>
                                    <summary className='siteColor'  onClick={() =>  showSmartFilter('isCategoriesStatus')}>  Categories and Status <hr></hr></summary>
                                    <> 
                                        {IsSmartfilter.isCategoriesStatus === true ? 
                                                <Row className='mt-1 ps-30 '  style={{ display: "block" }}>
                                                        <table width="100%" className="indicator_search">
                                                            <tr className=''>
                                                                {filterGroups?.length > 0 && filterGroups?.map((Group: any, index: any) => {
                                                                    return (
                                                                        <td valign="top">
                                                                            {Group.Site !== 'sp' && Group.Title != 'Team Member' && Group.Title !='Team' && Group.group !='Team Members' &&
                                                                                <div>                                                                      
                                                                                    {Group.Title !== 'teamSites' &&  <label className='smartPannel'>
                                                                                     <span className='form-check'><input className='form-check-input' type="checkbox" id={Group.Title} checked={Group.selected} onChange={(event)=>handleGroupCheckboxChanged(event,Group,'')}/> {Group.Title} </span>
                                                                                    </label>} 
                                                                                    {Group.Title === 'teamSites' &&   <label className='smartPannel'>
                                                                                    <span className='form-check'><input className='form-check-input' type="checkbox" id={Group.Title} checked={Group.selected} onChange={(event)=>handleGroupCheckboxChanged(event,Group,'')} /> Sites </span>
                                                                                    </label>}  
                                                                                    <div>
                                                                                        {filterItems?.length>0 && filterItems?.map((filteritem:any,index:any)=>{                                                                                           

                                                                                            return (
                                                                                                <div className='d-flex'>                                                                                                                                                                       
                                                                                                    {filteritem.label == Group.Title &&
                                                                                                    <><span id="filterexpand">
                                                                                                            {filteritem.expand && filteritem?.children?.length > 0 &&  <SlArrowDown onClick={()=>loadMorefilter(filteritem)}></SlArrowDown>}
                                                                                                            {!filteritem.expand && filteritem?.children?.length > 0 && <SlArrowRight onClick={()=>loadMorefilter(filteritem)}></SlArrowRight>}
                                                                                                        </span>                                                                                                          
                                                                                                                {filteritem.TaxType !== 'Status' &&
                                                                                                                    <span className='form-check'> <input className='form-check-input' type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem,'')} /> {filteritem.Title} 
                                                                                                                      <span>
                                                                                                                            {filteritem?.children?.length>0 ? <ul>
                                                                                                                            {filteritem.expand === true && filteritem.children?.map((child:any)=>{                                                                                                                   
                                                                                                                            return(<>
                                                                                                                                <li>
                                                                                                                                    <span id="filterexpand">
                                                                                                                                    {child.expand && child?.children?.length > 0 &&  <SlArrowDown onClick={() => loadMorefilter(child)}></SlArrowDown> }
                                                                                                                                    {!child.expand && child?.children?.length > 0 && <SlArrowRight onClick={() => loadMorefilter(child)}></SlArrowRight> }
                                                                                                                                    </span>
                                                                                                                                    <input className='form-check-input' type="checkbox" id={child.Title} value={child.Title} checked={child.selected} onChange={(event)=>handleGroupCheckboxChanged(event,child,'')} /> {child.Title}
                                                                                                                                    {child?.children?.length > 0 ?<ul>
                                                                                                                                        {child.expand === true && child.children?.map((childs: any) => {
                                                                                                                                            return (<li><input className='form-check-input' type="checkbox" id={childs.Title} value={childs.Title} checked={childs.selected} onChange={(event)=>handleGroupCheckboxChanged(event,child,'')} /> {childs.Title} </li>);
                                                                                                                                        })}
                                                                                                                                    </ul>:''}
                                                                                                                                </li></>)
                                                                                                                            })}
                                                                                                                            </ul> : ''}
                                                                                                                        </span>
                                                                                                                    </span>}
                                                                                                                {filteritem.TaxType === 'Status' &&
                                                                                                                    <span className='form-check'> <input className='form-check-input' type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem,'')} /> {filteritem.Title} </span>}
                                                                                                           
                                                                                                            
                                                                                                        </>
                                                                                                    }                                                                                                                                                                  
                                                                                                </div>
                                                                                                                                                                                    
                                                                                            )
                                                                                        })}
                                                                                    </div>                                                                                                                                                                                                    
                                                                                </div> 
                                                                            }                                                            
                                                                                                                                        
                                                                        </td> )
                                                                })}
                                                            </tr>
                                                        </table>                                        
                                                   
                                                </Row>: ""}
                                    </>
                                </details>
                                <details>
                                <summary className='siteColor' onClick={() => showSmartFilter('isTeamMemberfilter')}>  Team Members <hr></hr></summary>
                          
                                    <>
                                        {IsSmartfilter.isTeamMemberfilter === true ? 
                                            <Row className='ps-30'  style={{ display: "block" }}>
                                        
                                                    <Col className='mb-2 p-0'>
                                                        <label className='me-2'>
                                                            <input className='form-check-input' type="checkbox" value='isCreated' checked={Createmodified.isCreated} onChange={(e)=>handleCreatedModifiedvalue(e)} /> Created by
                                                        </label>
                                                        <label className='me-2'>
                                                            <input className='form-check-input' type="checkbox" value='isModified' checked={Createmodified.isModified} onChange={(e)=>handleCreatedModifiedvalue(e)}/> Modified by
                                                        </label>
                                                        <label className='me-2'>
                                                            <input className='form-check-input' type="checkbox" value='isAssignedto' checked={Createmodified.isAssignedto} onChange={(e)=>handleCreatedModifiedvalue(e)} /> Assigned to
                                                        </label>
                                                    </Col>
                                                    <table width="100%" className="indicator_search">
                                                        <tr className=''>
                                                        <td valign="top">
                                                           <Row>
                                                            {filterGroups != null && filterGroups.length > 0 && filterGroups?.map((Group: any, index: any) =>  {
                                                                    return (
                                                                        <>                                                                   
                                                                            {Group.group ==='Team Members' && Group.Title !='Team' && 
                                                                                <div className="col-md-3"> 
                                                                                    <label className='smartPannel'>
                                                                                        <span className='form-check'><input className='form-check-input'  type="checkbox" id={Group.Title} checked={Group.selected} onChange={(event)=>handleGroupCheckboxChanged(event,Group,'')} /> {Group.Title} </span>
                                                                                    </label>                                                                   
                                                                                    <div>
                                                                                        {filterItems?.map((filteritem:any,index:any)=>{                                                                                       
                                                                                            return (
                                                                                                <div >                                                                                                                                                                       
                                                                                                    {filteritem.label == Group.Title &&
                                                                                                        <><span id="filterexpand">
                                                                                                            {filteritem.expand && filteritem.children != undefined && filteritem.children.length > 0 && <SlArrowDown onClick={()=>loadMorefilter(filteritem)}></SlArrowDown>}
                                                                                                            {!filteritem.expand && filteritem.children != undefined && filteritem.children.length > 0 && <SlArrowRight onClick={()=>loadMorefilter(filteritem)}></SlArrowRight>}
                                                                                                        </span><span>
                                                                                                                {filteritem.TaxType !== 'Status' &&
                                                                                                                    <span className='form-check'><input className='form-check-input'  type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem,'')} />  {filteritem.Title}</span>}
                                                                                                                {filteritem.TaxType === 'Status' &&
                                                                                                                    <span className='form-check'><input className='form-check-input' type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem,'')} />  {filteritem.Title}</span>}

                                                                                                            </span>
                                                                                                            {filteritem?.children?.length>0 ? <ul>
                                                                                                                {filteritem.epand === true && filteritem.children?.map((child:any)=>{                                                                                                              
                                                                                                                return(<>
                                                                                                                    <li style={{ listStyle: 'none' }}>
                                                                                                                        <span id="filterexpand">
                                                                                                                        {child.expand && child.children != undefined && child.children.length > 0 && <SlArrowDown onClick={() => loadMorefilter(child)} ></SlArrowDown>}
                                                                                                                        {!child.expand && child.children != undefined && child.children.length > 0 && <SlArrowRight onClick={() => loadMorefilter(child)}></SlArrowRight>}
                                                                                                                        </span>
                                                                                                                        <input className='form-check-input' type="checkbox" id={child.Title} value={child.Title} checked={child.selected} onChange={(event)=>handleGroupCheckboxChanged(event,child,'')} /> {child.Title}
                                                                                                                        <ul>
                                                                                                                            {child.epand === true && child.children != undefined && child.children.length > 0 && child.children?.map((childs: any) => {
                                                                                                                                return (<li style={{ listStyle: 'none' }}><input className='form-check-input' type="checkbox" id={childs.Title} value={childs.Title} checked={childs.selected} onChange={(event)=>handleGroupCheckboxChanged(event,childs,'')} /> {childs.Title}</li>);
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
                                                                                    </div>                                                                                                                                                                                                    
                                                                                </div> 
                                                                            }                                                            
                                                                                                                                        
                                                                        </> )
                                                            })}
                                                           </Row>
                                                        </td>
                                                        </tr>
                                                    </table>                                        
                                              
                                            </Row>: ""}
                                    </>
                             
                                </details>
                                <details>
                                    <summary className='siteColor'  onClick={() =>showSmartFilter('isDatefilter')}>  Date <hr></hr></summary>
                              
                                    <>
                                        {IsSmartfilter.isDatefilter === true ? <div className="ps-30" style={{ display: "block" }}>
                                                                                                                       
                                                        <Col className='mb-2 '>
                                                            <label className='me-2'>
                                                                <input className='form-check-input'  type="checkbox" value = "isCretaedDate" checked={duedate.isCretaedDate} onChange={(event)=>handleCreatedModifiedvalue(event)} /> Created Date
                                                            </label>
                                                            <label className='me-2'>
                                                                <input className='form-check-input' type="checkbox" value = "isModifiedDate" checked={duedate.isModifiedDate} onChange={(event)=>handleCreatedModifiedvalue(event)} /> Modified Date
                                                            </label>
                                                            <label className='me-2'>
                                                                <input className='form-check-input' type="checkbox" value = "isDueDate" checked={duedate.isDueDate} onChange={(event)=>handleCreatedModifiedvalue(event)} /> Due Date
                                                            </label>
                                                        </Col>
                                                        <Col>
                                                            <span className='SpfxCheckRadio  me-2'>
                                                                <input className='radio' type="radio" value="today" checked={eventdatevalue === "today"}  onChange={onDatevalueChanged} />
                                                                 <label>Today</label>
                                                            </span>
                                                            <span className='SpfxCheckRadio  me-2'>
                                                                <input className='radio' type="radio" value="yesterday" checked={eventdatevalue === "yesterday"}  onChange={onDatevalueChanged} />
                                                                 <label>Yesterday</label>
                                                            </span >
                                                            <span className='SpfxCheckRadio  me-2'>
                                                                <input className='radio'  type="radio" value="thisweek" checked={eventdatevalue === "thisweek"} onChange={onDatevalueChanged} />
                                                                 <label>This Week</label>
                                                            </span>
                                                            <span className='SpfxCheckRadio  me-2'>
                                                                <input className='radio' type="radio" value="last7days" checked={eventdatevalue === "last7days"} onChange={onDatevalueChanged} />
                                                                 <label>Last 7 Days</label>
                                                            </span>
                                                            <span className='SpfxCheckRadio  me-2'>
                                                                <input className='radio' type="radio"  value="thismonth" checked={eventdatevalue === "thismonth"} onChange={onDatevalueChanged} />
                                                                 <label>This Month</label>
                                                            </span>
                                                            <span className='SpfxCheckRadio  me-2'>
                                                                <input className='radio' type="radio" value="lat30days"  checked={eventdatevalue === "lat30days"} onChange={onDatevalueChanged} />
                                                                 <label>Last 30 Days</label>
                                                            </span>
                                                            <span className='SpfxCheckRadio  me-2'>
                                                                <input className='radio' type="radio" value="thisyear"  checked={eventdatevalue === "thisyear"} onChange={onDatevalueChanged} />
                                                                <label>This Year</label>
                                                            </span>
                                                            <span className='SpfxCheckRadio  me-2'>
                                                                <input className='radio' type="radio" value="lastyear" checked={eventdatevalue === "lastyear"}  onChange={onDatevalueChanged} />
                                                                 <label>Last Year</label>
                                                            </span>
                                                            <span className='SpfxCheckRadio  me-2'>
                                                                <input className='radio' type="radio" value="custom" checked={eventdatevalue === "custom"} onChange={onDatevalueChanged} />
                                                                 <label>Custom</label>
                                                            </span>
                                                        </Col> 
                                                   
                                                    <Row className='mt-2'>
                                                        <div className="col-sm-5  ps-0">
                                                            
                                                            <div className='dateformate'>
                                                               <label>Start Date</label>
                                                                <input type="date" placeholder="dd/mm/yyyy" className="form-control date-picker"
                                                                    id="txtDate" value={startDate != null ? moment(new Date(startDate)).format('YYYY-MM-DD') : ''} onChange={(e)=>changeStartDate(e)} />
                                                                {/* <i className="fa fa-calendar form-control-feedback mt-10"></i> */}
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-5">
                                                            
                                                            <div className='dateformate'>
                                                                <label>End Date</label>
                                                                <input type="date" placeholder="dd/mm/yyyy" className="form-control"
                                                                    id="txtDate1" value={endDate != null ? moment(new Date(endDate)).format('YYYY-MM-DD') : ''} onChange={(e)=>changeEndDate(e)} />
                                                                {/* <i className="fa fa-calendar form-control-feedback mt-10"></i> */}
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-2">
                                                            <label className="hreflink pt-4" title="Clear Date Filters"
                                                            onClick={()=>resetItem()}><strong> Clear </strong>  </label>

                                                        </div>
                                                    </Row>                                   
                                        
                                        </div> : ""}
                                    </>
                          
                                </details>           
                            </details>
                        </Row>                                             
                    </section>}
                    {isSmartFavorites && <section className='udatefilter'>
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
                                             <a onClick={()=>FilterFavoritesTask(item1.SelectedFavorites,CreateMeSmartFavorites,item1,true)} className='hreflink'>{item1.Title}</a> <span className='d-flex'><span className="svg__iconbox svg__icon--openWeb"> </span><span onClick={() => openEditPopup(item1)} className="svg__iconbox svg__icon--edit"></span> <span  onClick={() => deletedItem(item1,'EveryOne')} className="svg__icon--trash  svg__iconbox"></span></span>
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
                                            <a onClick={()=>FilterFavoritesTask(item2.SelectedFavorites,CreateMeSmartFavorites,item2,true)} className='hreflink'>{item2.Title}</a><span className='d-flex'><span className="svg__iconbox svg__icon--openWeb"> </span><span onClick={() => openEditPopup(item2)} className="svg__iconbox svg__icon--edit"></span> <span onClick={() => deletedItem(item2,'Onlyme')} className="svg__icon--trash  svg__iconbox"></span></span>
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
                                    <div className="modal-body bg-f5f5 clearfix">
                                        <div className="mt-10 mb-10  col-sm-12 ">                                       
                                            <div className="col-sm-12 padL-0 mt-2">
                                                <label className="lblText col-sm-12 padL-0 PadR0">
                                                    Title<span className="pull-right">
                                                        <input type="checkbox" defaultChecked={editData?.isShowEveryone} onClick={() => CheckedUncheckedItem('isShowEveryone')} name="rating1" onChange={(e) => setisShowEveryone(e.target.checked)} /> For Everyone
                                                    </span>

                                                </label>                                            
                                                <input type="text" className='w-100' style={{ marginTop: -'2px', marginRight: '3px' }} defaultValue={editData?.Title} onChange={(e) => ChangeTitle(e)} />
                                                {editData?.SmartFavoriteType === 'UrlBased' && <label className="lblText col-sm-12 padL-0 PadR0">
                                                    Url<input type="text" className='w-100' style={{ marginTop: -'2px', marginRight: '3px' }} defaultValue={editData?.Url} onChange={(e) => ChangeUrl(e)} />

                                                </label>  }
                                            </div>

                                            <table className='indicator_search w-100'>
                                                <tbody>
                                                    <tr>
                                                        { selectedFavoriteitem.map((chil: any)  => { 
                                                                return(
                                                                    <td valign='top'>
                                                                        <div>
                                                                            <label className='smartPannel'>
                                                                              <span ><input className='form-check-input' type="checkbox" id={item.Title}  onChange={(event)=>handleGroupCheckboxChanged(event,item,"smartfavorite")}/> {chil.Group} </span>
                                                                            </label>
                                                                            
                                                                            {chil.TaxType !== 'Date' && <div>
                                                                                {filterItems?.length>0 && filterItems?.map((filteritem:any,index:any)=>{                                                                                           
                                                                                    return (
                                                                                        <div>                                                                                                                                                                       
                                                                                            {filteritem.label == chil.Group && <>
                                                                                                <span id="filterexpand">
                                                                                                    {filteritem.expand && filteritem?.children?.length > 0 &&  <SlArrowDown onClick={()=>loadMorefilter(filteritem)}></SlArrowDown>}
                                                                                                    {!filteritem.expand && filteritem?.children?.length > 0 && <SlArrowRight onClick={()=>loadMorefilter(filteritem)}></SlArrowRight>}
                                                                                                </span>                                                                                                
                                                                                                <span> 
                                                                                                    <input className='form-check-input' type="checkbox" id={filteritem.Title} value={filteritem.Title} checked={filteritem.selected} onChange={(event)=>handleGroupCheckboxChanged(event,filteritem,'')} /> {filteritem.Title}
                                                                                                </span>                                                                                                
                                                                                                <ul>
                                                                                                    {filteritem.expand === true && filteritem?.children?.length>0 && filteritem.children?.map((child:any)=>{
                                                                                                        return(<>
                                                                                                            <li style={{ listStyle: 'none' }}>
                                                                                                                <span id="filterexpand">
                                                                                                                    {child.expand && child?.children?.length > 0 &&  <SlArrowDown onClick={() => loadMorefilter(child)}></SlArrowDown> }
                                                                                                                    {!child.expand && child?.children?.length > 0 && <SlArrowRight onClick={() => loadMorefilter(child)}></SlArrowRight> }
                                                                                                                </span>
                                                                                                                <input className='form-check-input' type="checkbox" id={child.Title} value={child.Title} checked={child.selected} onChange={(event)=>handleGroupCheckboxChanged(event,child,'')} /> {child.Title}
                                                                                                                <ul>
                                                                                                                    {child.expand === true && child?.children?.length > 0 && child.children?.map((childs: any) => {
                                                                                                                        return (<li style={{ listStyle: 'none' }}><input className='form-check-input' type="checkbox" id={childs.Title} value={childs.Title} checked={childs.selected} onChange={(event)=>handleGroupCheckboxChanged(event,child,'')} /> {childs.Title} </li>);
                                                                                                                    })}
                                                                                                                </ul>
                                                                                                            </li></>)
                                                                                                        })}
                                                                                                </ul></>}                                                                                                                                                                                                                                                              
                                                                                    </div>)
                                                                                })}
                                                                            </div>}
                                                                            {chil.TaxType === 'Date' && <>                                                                                                
                                                                                <span> 
                                                                                    <input className='form-check-input' type="checkbox" checked={chil.isCretaedDate} onChange={(event)=>handleGroupCheckboxChanged(event,chil,'')} /> Created
                                                                                </span> 
                                                                                <span> 
                                                                                    <input className='form-check-input' type="checkbox" checked={chil.isModifiedDate} onChange={(event)=>handleGroupCheckboxChanged(event,chil,'')} /> Modified
                                                                                </span> 
                                                                                <span> 
                                                                                    <input className='form-check-input' type="checkbox" checked={chil.isDueDate} onChange={(event)=>handleGroupCheckboxChanged(event,chil,'')} /> DueDate
                                                                                </span> 
                                                                                </>
                                                                            }   
                                                                            
                                                                        </div>
                                                                    </td>                        
                                                                )
                                                            })} 

                                                    </tr>
                                                </tbody>
                                            </table>
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
                    {ShowTableItem && loading === false && <SmartMetaSearchTable SiteSmartfilters={SiteSmartfilters} AllListId={item}/>}
                </div >                
            </section >           
            {loading && <PageLoad />} 
        </>
    
    );

}

export default SmartFilterSearchGlobal;
