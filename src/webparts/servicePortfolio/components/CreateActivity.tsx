import * as React from 'react';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import TeamConfigurationCard from '../../../globalComponents/TeamConfiguration/TeamConfiguration';
import FroalaImageUploadComponent from '../../../globalComponents/FlorarComponents/FlorarImageUploadComponent';
import FroalaCommentBox from '../../../globalComponents/FlorarComponents/FroalaCommentBoxComponent';
import ComponentPortPolioPopup from '../../EditPopupFiles/ComponentPortfolioSelection';
import Picker from '../../../globalComponents/EditTaskPopup/SmartMetaDataPicker';
//import "bootstrap/dist/css/bootstrap.min.css";
var AssignedToIds: any = [];
var ResponsibleTeamIds: any = [];
var TeamMemberIds: any = [];
const CreateActivity = (props: any) => {
    var AllItems = props.props
    console.log(props)
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(true);
    const [siteTypess, setSiteType] = React.useState([]);
    const [Categories, setCategories] = React.useState([]);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [selectPriority, setselectPriority] = React.useState('');
    const [Priorityy, setPriorityy] = React.useState(false);
    const [SharewebCategory, setSharewebCategory] = React.useState('');
    const [isDropItem, setisDropItem] = React.useState(false);
    const [isDropItemRes, setisDropItemRes] = React.useState(false);
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const [CategoriesData, setCategoriesData] = React.useState([]);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [isActive, setIsActive] = React.useState({
        siteType: false,
        time: false,
        rank: false,
        dueDate: false,

    });
    const [save, setSave] = React.useState({ Title: '', siteType: '', linkedServices: [], recentClick: undefined, DueDate: undefined, taskCategory: '' })

    var CheckCategory: any = []
    CheckCategory.push({ "TaxType": "Categories", "Title": "Phone", "Id": 199, "ParentId": 225 }, { "TaxType": "Categories", "Title": "Email Notification", "Id": 276, "ParentId": 225 }, { "TaxType": "Categories", "Title": "Approval", "Id": 227, "ParentId": 225 },
        { "TaxType": "Categories", "Title": "Immediate", "Id": 228, "parentId": 225 });

    React.useEffect(() => {
        GetSmartMetadata()
    }, [])
    const GetSmartMetadata = async () => {
        var SitesTypes: any = [];
        var siteConfig = []
        var AllMetadata: any = []
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let MetaData = [];
        MetaData = await web.lists
            .getByTitle('SmartMetadata')
            .items
            .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title")
            .top(4999)
            .expand('Author,Editor')
            .get();
        AllMetadata = MetaData;
        siteConfig = getSmartMetadataItemsByTaxType(AllMetadata, 'Sites')
        siteConfig?.forEach((site: any) => {
            if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== 'Health' && site.Title !== 'Gender') {
                site.IscreateTask = false;
                SitesTypes.push(site);
            }
        })
        setSiteType(SitesTypes)
        //setModalIsOpenToTrue();
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems?.forEach((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });

        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }
    const setActiveTile = (item: keyof typeof save, isActiveItem: keyof typeof isActive, value: any) => {
        AllItems['SiteListItem'] = value.Title
        let saveItem = save;
        let isActiveData = isActive;
        if (value.IscreateTask == false || value.IscreateTask == undefined) {
            value.IscreateTask = true
        }
        getActivitiesDetails(value)
        if (save[item] !== value.Title) {
            saveItem[item] = value.Title;
            setSave(saveItem);
            if (isActive[isActiveItem] !== true) {
                isActiveData[isActiveItem] = true;
                setIsActive(isActiveData);
            }
        } else if (save[item] === value.Title) {
            saveItem[item] = '';
            setSave(saveItem);
            isActiveData[isActiveItem] = false;
            setIsActive(isActiveData);
        }
        // if (item === "dueDate") {
        //     DueDate(title)
        // }
        // if (item === "Time") {
        //     setTaskTime(title)
        // }
        setSave({ ...save, recentClick: isActiveItem })
    };
    const Call = React.useCallback((item1: any, type: any) => {
        if (type == "SmartComponent") {
            if (AllItems != undefined && item1 != undefined) {
                AllItems.smartComponent = item1.smartComponent;
                setSmartComponentData(item1.smartComponent);
            }

        }

        if (type == "Category") {
            if (item1 != undefined && item1.Categories != "") {
                var title: any = {};
                title.Title = item1.categories;
                item1.categories.map((itenn: any) => {
                    if (!isItemExists(CategoriesData, itenn.Id)) {
                        CategoriesData.push(itenn);
                    }

                })
                item1.SharewebCategories?.map((itenn: any) => {
                    CategoriesData.push(itenn)
                })

                setCategoriesData(CategoriesData)
               

            }
        }

        // if (CategoriesData != undefined){
        //     CategoriesData.forEach(function(type:any){
        //     CheckCategory.forEach(function(val:any){
        //         if(type.Id == val.Id){
        //         BackupCat = type.Id
        //         setcheckedCat(true)
        //         }
        //       })

        //   })
        //   setUpdate(update+2)
        // }
        setIsComponentPicker(false);
        setIsComponent(false);
    }, []);
    const EditComponentPicker = (item: any) => {
        setIsComponentPicker(true);
        setSharewebCategory(item);
       
    }
    const FlorarImageUploadComponentCallBack = () => {
        console.log('Worrking')
    }
    const deleteCategories = (id: any) => {
        CategoriesData.map((catId, index) => {
            if (id == catId.Id) {
                CategoriesData.splice(index, 1)
            }
        })
        setCategoriesData(CategoriesData => ([...CategoriesData]));

    }
    var isItemExists = function (arr: any, Id: any) {
        var isExists = false;
        $.each(arr, function (index: any, items: any) {
            if (items.ID === Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const EditComponent = (items: any) => {

        setIsComponent(true);
        setSharewebComponent(items);

    }
    var LatestTaskNumber: any = ''
    var SharewebID: any = ''
    const getActivitiesDetails = async (item: any) => {
        console.log(item)
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails = [];
        componentDetails = await web.lists
            .getById(item.listId)
            .items
            .select("FolderID,Shareweb_x0020_ID,SharewebTaskLevel1No,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,Title,Id,Priority_x0020_Rank,PercentComplete,StartDate,DueDate,Status,Body,PercentComplete,Attachments,Priority,Created,Modified,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,SharewebTaskType/Prefix,ParentTask/Id,ParentTask/Title,ParentTask/Shareweb_x0020_ID,Author/Id,Author/Title,Editor/Id,Editor/Title")
            .expand("SharewebTaskType,ParentTask,AssignedTo,AttachmentFiles,Author,Editor")
            .filter("SharewebTaskType/Title eq 'Activities'")
            .orderBy("SharewebTaskLevel1No", false)
            .top(4999)
            .get()
        console.log(componentDetails)
        if (componentDetails.length == 0) {
            LatestTaskNumber = 1;
            item.LatestTaskNumber = LatestTaskNumber
        } else {
            LatestTaskNumber = componentDetails[0].SharewebTaskLevel1No;
            LatestTaskNumber += 1;
            item.LatestTaskNumber = LatestTaskNumber
        }
        if (AllItems != undefined) {
            if (AllItems.Portfolio_x0020_Type != undefined) {
                if (AllItems.Portfolio_x0020_Type == 'Component') {
                    SharewebID = 'CA' + LatestTaskNumber;
                }
                if (AllItems.Portfolio_x0020_Type == 'Service') {
                    SharewebID = 'SA' + LatestTaskNumber;
                }
                if (AllItems.Portfolio_x0020_Type == 'Events') {
                    SharewebID = 'EA' + LatestTaskNumber;
                }
            } else {
                SharewebID = 'A' + LatestTaskNumber;
            }
            item.SharewebID = SharewebID
        }
    }
    const closeTaskStatusUpdatePoup = (res:any) => {
        setTaskStatuspopup(false)
        props.Call(res);

    }
    const HtmlEditorCallBack = () => {
        console.log('Working')
    }
    const saveNoteCall = () => {
        var Component: any = []
        smartComponentData.forEach((com: any) => {
            if (com != undefined) {
                Component.push(com.Id)
            }

        })
        var categoriesItem = '';
        CategoriesData.map((category)=> {
            if (category.Title != undefined) {
                categoriesItem = categoriesItem == "" ? category.Title : categoriesItem + ';' + category.Title;
            }
        })
        var CategoryID:any=[]
        CategoriesData.map((category)=> {
            if (category.Id != undefined) {
                CategoryID.push(category.Id)
            }
        })
        if(isDropItemRes == true){
            if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
                TaskAssignedTo.map((taskInfo) => {
                    AssignedToIds.push(taskInfo.Id);
                })
            } 
            }
            if(isDropItem == true){
                if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
                    TaskTeamMembers.map((taskInfo) => {
                        TeamMemberIds.push(taskInfo.Id);
                    })
                } 
               }
               if(isDropItem == true){
                if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
                    TaskResponsibleTeam.map((taskInfo) => {
                        ResponsibleTeamIds.push(taskInfo.Id);
                    })
                } 
               }
        if (AllItems.Title == undefined) {
            alert("Enter The Task Name");
        }
        else if (AllItems.SiteListItem == undefined) {
            alert("Select Task List.");
        }

        else {
            siteTypess.forEach(async (value: any) => {
                if (value.IscreateTask == true) {
                    if (AllItems.NoteCall == 'Activities') {
                        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
                        await web.lists.getById(value.listId).items.add({
                            Title: save.Title != undefined && save.Title != '' ? save.Title : AllItems.Title,
                            ComponentId: { "results": Component },
                            Categories: categoriesItem ? categoriesItem : null,
                            SharewebCategoriesId: { "results": CategoryID },
                            SharewebTaskTypeId: 1,
                            Shareweb_x0020_ID: value.SharewebID,
                            SharewebTaskLevel1No: value.LatestTaskNumber,
                            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
                            Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
                            Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] }

                        }).then((res: any) => {
                            console.log(res);
                            closeTaskStatusUpdatePoup(res);
                           

                        })
                    }

                }
            })

        }

    }
    const DDComponentCallBack = (dt: any) => {
         // setTeamConfig(dt)
         setisDropItem(dt.isDrop)
        setisDropItemRes(dt.isDropRes)
        console.log(dt)
        if (dt?.AssignedTo?.length > 0) {
            let tempArray: any = [];
            dt.AssignedTo?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskAssignedTo(tempArray);
            console.log("Team Config  assigadf=====", tempArray)
        }
        if (dt?.TeamMemberUsers?.length > 0) {
            let tempArray: any = [];
            dt.TeamMemberUsers?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskTeamMembers(tempArray);
            console.log("Team Config member=====", tempArray)

        }
        if (dt.ResponsibleTeam != undefined && dt.ResponsibleTeam.length > 0) {
            let tempArray: any = [];
            dt.ResponsibleTeam?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskResponsibleTeam(tempArray);
            console.log("Team Config reasponsible ===== ", tempArray)

        }
        else{
            setTaskResponsibleTeam([])
        }
    }
    const SelectPriority =(priority:any,e:any)=>{
    if(priority == '(1) High'){
        setselectPriority('8')
    }
    if(priority == '(2) Normal'){
        setselectPriority("4")
    }
    if(priority == '(3) Low'){
        setselectPriority("1")
    }
    }
    const Priority=(e:any)=>{
        if(e.target.value == '1' || e.target.value == '2' || e.target.value == '3'){
            setselectPriority(e.target.value)
            setPriorityy(true)
        }
        if(e.target.value == '4' || e.target.value == '5' || e.target.value == '6' || e.target.value == '7'){
            setselectPriority(e.target.value)
            setPriorityy(true)
        }
        if(e.target.value == '8' || e.target.value == '9' || e.target.value == '10'){
            setselectPriority(e.target.value)
            setPriorityy(true)
        }

    }
    return (
        <>
            <Panel
                headerText="Create Quick Option - Activity"
                type={PanelType.custom}
                customWidth="1348px"
                isOpen={TaskStatuspopup}
                onDismiss={closeTaskStatusUpdatePoup}
                isBlocking={false}
            >
                <div className="modal-body">

                    <div className='row mt-2 border Create-taskpage'>
                        <fieldset>
                            <legend className="border-bottom fs-6 ">Sites</legend>
                            <ul className="quick-actions">
                                {siteTypess.map(function (item: any) {
                                    return (
                                        <>
                                            {(item.Title !== undefined && item.Title !== 'Offshore Tasks' && item.Title !== 'Master Tasks' && item.Title !== 'DRR' && item.Title !== 'SDC Sites' && item.Title !== 'QA') &&
                                                <>
                                                    <li
                                                        className={isActive.siteType && save.siteType === item.Title ? 'mx-1 p-2 bg-siteColor selectedTaskList text-center mb-2 position-relative' : "mx-1 p-2 position-relative bg-siteColor text-center  mb-2"} onClick={() => setActiveTile("siteType", "siteType", item)} >
                                                        {/*  */}
                                                        <a className='text-white text-decoration-none' >
                                                            <span className="icon-sites">
                                                                <img className="icon-sites"
                                                                    src={item.Item_x005F_x0020_Cover.Url} />
                                                            </span>{item.Title}
                                                        </a>
                                                    </li>
                                                </>
                                            }
                                        </>)
                                })}
                            </ul>
                        </fieldset>
                    </div>
                    <div className='row'>
                        <div className='col-sm-10'>
                            <div className="row">
                                <div className="col-sm-10 mb-10">
                                    <label className="full_width">
                                        Task Name <a id='siteName'
                                            ng-click="countClick==0?AddPlaceHolder():Test()">Site Name</a>
                                    </label>
                                    <input className="form-control" type="text" ng-required="true" placeholder="Enter Task Name"
                                        defaultValue={AllItems.Title} onChange={(e) => setSave({ ...save, Title: e.target.value })} />

                                </div>
                                <div className="col-sm-2 mb-10 padL-0">
                                    <label>Due Date</label>
                                    <input type="text" id="dueDatePicker" placeholder="DD/MM/YYYY"
                                        className="form-control" value={AllItems.DueDate} />
                                </div>
                                <div className='row mt-2'>

                                    <TeamConfigurationCard ItemInfo={AllItems} parentCallback={DDComponentCallBack}></TeamConfigurationCard>

                                </div>
                                <div className='row'>
                                    <div className='col-sm-5'>
                                        <FroalaImageUploadComponent callBack={FlorarImageUploadComponentCallBack} />
                                    </div>
                                    <div className='col-sm-7'>
                                        <FroalaCommentBox
                                            EditorValue={AllItems.Title != undefined ? AllItems.Title : ''}
                                            callBack={HtmlEditorCallBack}
                                        >
                                        </FroalaCommentBox>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-sm-2'>
                            {AllItems.Portfolio_x0020_Type == 'Component'
                                &&
                                <div className="col-sm-12 padL-0 PadR0">
                                    <div ng-show="smartComponent.length==0" className="col-sm-11 mb-10 padL-0">
                                        <label ng-show="!IsShowComSerBoth" className="full_width">Component</label>
                                        <input type="text" className="ui-autocomplete-input" id="txtSharewebComponentcrt"
                                        /><span role="status" aria-live="polite"
                                            className="ui-helper-hidden-accessible"></span>
                                    </div>
                                    <div className="col-sm-12 padL-0 PadR0">
                                        <div className="col-sm-12  top-assign  mb-10 padL-0 PadR0">
                                            {smartComponentData.map((cat: any) => {
                                                return (
                                                    <>
                                                        <div className=" col-sm-11 block" ng-mouseover="HoverIn(item);"
                                                            ng-mouseleave="ComponentTitle.STRING='';" title="{{ComponentTitle.STRING}}">

                                                            <a className="hreflink" target="_blank"
                                                                ng-href="{{CuurentSiteUrl}}/SitePages/Portfolio-Profile.aspx?taskId={{item.Id}}">{cat.Title}</a>
                                                            <a className="hreflink" ng-click="removeSmartComponent(item.Id)">
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" />
                                                            </a>
                                                        </div>
                                                    </>
                                                )
                                            })}

                                            <span ng-show="smartComponent.length!=0" className="col-sm-1">
                                                <a className="hreflink" title="Edit Component" data-toggle="modal"
                                                    onClick={(e) => EditComponent(AllItems)}>

                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png" />
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>}
                            <div className="col-sm-12 padL-0 Prioritytp PadR0 mt-2">
                                <fieldset>
                                    <label>Priority</label>
                                    <input type="text" className="" placeholder="Priority" ng-model="PriorityRank"
                                      defaultValue={selectPriority}  onChange={(e:any)=>Priority(e)} />
                                    <div className="mt-2">
                                        <label>
                                            <input style={{ margin: "-1px 2px 0" }} className="form-check-input" name="radioPriority"
                                                type="radio"  defaultChecked={Priorityy} onClick={(e:any)=>SelectPriority('(1) High',e)}
                                                 />High
                                        </label>
                                    </div>
                                    <div className="">
                                        <label>
                                            <input style={{ margin: "-1px 2px 0" }} className="form-check-input" name="radioPriority"
                                                type="radio" defaultChecked={Priorityy} onClick={(e:any)=>SelectPriority('(2) Normal',e)}
                                                 />Normal
                                        </label>
                                    </div>
                                    <div className="">
                                        <label>
                                            <input style={{ margin: "-1px 2px 0" }} className="form-check-input" name="radioPriority"
                                                type="radio" defaultChecked={Priorityy} onClick={(e:any)=>SelectPriority('(3) Low',e)} />Low
                                        </label>
                                    </div>
                                </fieldset>
                            </div>

                            <div className="row mt-2">
                                <div className="col-sm-12">
                                    <div className="col-sm-11 padding-0">
                                        <label>Categories</label>
                                        <input type="text" className="ui-autocomplete-input" id="txtCategories" />
                                    </div>
                                    <div className="col-sm-1 no-padding">

                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/images/EMMCopyTerm.png"
                                            onClick={() => EditComponentPicker(AllItems)} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 mt-2">
                                    {CheckCategory.map((item: any) => {
                                        return (
                                            <>
                                                <div
                                                    className="col-sm-12 padL-0 checkbox">
                                                    <input type="checkbox"
                                                        ng-click="selectRootLevelTerm(item)" />
                                                    <span style={{ marginLeft: "20px" }}> {item.Title}</span>
                                                </div>
                                            </>
                                        )
                                    })}
                                </div>


                            </div>
                            {CategoriesData != undefined ?
                                <div>
                                    {CategoriesData?.map((type: any, index: number) => {
                                        return (
                                            <>
                                                {(type.Title != "Phone" && type.Title != "Email Notification" && type.Title != "Approval" && type.Title != "Immediate") &&

                                                    <div className="Component-container-edit-task d-flex my-1 justify-content-between">
                                                        <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?${AllItems.Id}`}>
                                                            {type.Title}
                                                        </a>
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteCategories(type.Id)} className="p-1" />
                                                    </div>
                                                }
                                            </>
                                        )
                                    })}
                                </div> : null
                            }
                        </div>

                    </div>

                </div>


                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={() => saveNoteCall()}>
                        Submit
                    </button>

                </div>

            </Panel>
            {IsComponent && <ComponentPortPolioPopup props={SharewebComponent} Call={Call}></ComponentPortPolioPopup>}
            {IsComponentPicker && <Picker props={SharewebCategory} Call={Call}></Picker>}
        </>
    )
}

export default CreateActivity;