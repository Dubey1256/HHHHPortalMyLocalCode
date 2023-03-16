import * as React from 'react';
import * as $ from 'jquery';
import { ITaskprofileProps } from './ITaskprofileProps';
import { GlobalConstants } from '../../../globalComponents/LocalCommon';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryComponent';
import CreateActivity from '../../servicePortfolio/components/CreateActivity';
import CreateWS from '../../servicePortfolio/components/CreateWS';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import * as moment from 'moment';
import { MdAdd } from 'react-icons/Md';
// import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
// import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryComponent';
import PortfolioStructureCreationCard from '../../../globalComponents/tableControls/PortfolioStructureCreation';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from 'sp-pnp-js';
var AllTasks: any = [];
let siteConfig :any =[];
var IsUpdated: any = '';
var MeetingItems:any=[]
let AllWSTasks = [];
var allworkstreamTasks:any=[]
var filter: any = '';
var Array:any=[]
let taskUsers :any =[];
let IsShowRestru :any =false;
let componentDetails:any = '';
function TasksTable(props:any){
    const [data, setData] = React.useState([]);
     const [Isshow, setIsshow] = React.useState(false);
     const [checkedList, setCheckedList] = React.useState([]);
     const [AllUsers, setTaskUser] = React.useState([]); 
     const [IsTask, setIsTask] = React.useState(false);
     const [SharewebTask, setSharewebTask] = React.useState('');
     const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
     const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
     const [isShowTask, setIsShowTask] = React.useState(true);
     const [modalIsOpen, setModalIsOpen] = React.useState(false);
     const [count, setCount] = React.useState(0);
     const [ActivityDisable, setActivityDisable] = React.useState(true);
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const [lgShow, setLgShow] = React.useState(false);
    const [maidataBackup, setmaidataBackup] = React.useState([])
    const [OldArrayBackup, setOldArrayBackup] = React.useState([]);
    const [MeetingPopup, setMeetingPopup] = React.useState(false);
    const [WSPopup, setWSPopup] = React.useState(false);
    const [ActivityPopup, setActivityPopup] = React.useState(false);
    const [NewArrayBackup, setNewArrayBackup] = React.useState([]);
    const [ResturuningOpen, setResturuningOpen] = React.useState(false);
    const [RestructureChecked, setRestructureChecked] = React.useState([]);
     IsUpdated = props.Portfolio_x0020_Type;

      const GetSmartmetadata = async () => {
        //  var metadatItem: any = []
        let smartmetaDetails: any = [];
       
        var select: any = 'Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent'
        smartmetaDetails = await globalCommon.getData(GlobalConstants.SP_SITE_URL, GlobalConstants.SMARTMETADATA_LIST_ID, select);
        console.log(smartmetaDetails);
        smartmetaDetails.forEach((newtest:any) => {
            newtest.Id = newtest.ID;
            if (newtest.TaxType == 'Sites' && newtest.Title != 'Master Tasks' && newtest.Title != 'SDC Sites') {
                siteConfig.push(newtest)
            }
        });
       // var filter: any = '';
        if(props.props.SharewebTaskType !=undefined && props.props.SharewebTaskType !=undefined && props.props.SharewebTaskType ==='Activities'){
            filter += '(ParentTask/Id eq ' + props.props.Id + ' ) or '
        loadWSTasks(props.props);
        }
        else  if(props.props.SharewebTaskType !=undefined && props.props.SharewebTaskType !=undefined && props.props.SharewebTaskType ==='Workstream'){
            filter += '(ParentTask/Id eq ' + props.props.Id + ' )'
            loadActivityTasks(props.props);
        
        }
    }

    const loadActivityTasks = async (task: any) =>{
        let activity :any =[];
         var select = "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=Id eq " + task.ParentTask.Id + ""
         activity = await globalCommon.getData(GlobalConstants.SP_SITE_URL, task.listId, select)
         if(activity.length >0)
         GetComponents(activity[0])
         LoadAllSiteTasks(filter);
     }
        const loadWSTasks = async (task: any) =>{
       
        var select = "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=ParentTask/Id eq " + task.Id + ""
        AllWSTasks = await globalCommon.getData(GlobalConstants.SP_SITE_URL, task.listId, select)
        if(AllWSTasks.length  ===0)
        filter += '(ParentTask/Id eq ' + props.props.Id + ' )'
        AllWSTasks.forEach((obj: any, index: any) => {
            if ((AllWSTasks.length - 1) === index)
                filter += '(ParentTask/Id eq ' + obj.Id + ' )'
            else filter += '(ParentTask/Id eq ' + obj.Id + ' ) or ' 

        })
        LoadAllSiteTasks(filter);
        console.log(AllWSTasks);
    }
    var Response: any = []
    const getTaskUsers = async () => {
        taskUsers = Response  = await globalCommon.loadTaskUsers();
        setTaskUser(Response);
        console.log(Response);

    }
           const handleClose = () => setLgShow(false);
           const LoadAllSiteTasks =async (filter: any) => {
                var Response: any = []
                var Counter = 0;
               // filterarray.forEach((filter: any) => {
                    // siteConfig.forEach(async (config: any) => {
                    //     if (config.Title != 'Master Tasks' && config.Title != 'SDC Sites') {
                            try {
                                let AllTasksMatches = [];
                                var select = "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=" + filter + ""
                                AllTasksMatches = await globalCommon.getData(GlobalConstants.SP_SITE_URL, props.props.listId, select)
                                console.log(AllTasksMatches);
                                Counter++;
                                console.log(AllTasksMatches.length);
                                if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
        
                                    $.each(AllTasksMatches, function (index: any, item: any) {
                                        item.isDrafted = false;
                                        item.flag = true;
                                        item.siteType = props.props.siteType;
                                        item.childs = [];
                                        item.listId = props.props.listId;
                                        item.siteUrl = GlobalConstants.SP_SITE_URL;
                                        if (item.SharewebCategories != undefined) {
                                            if (item.SharewebCategories.length > 0) {
                                                $.each(item.SharewebCategories, function (ind: any, value: any) {
                                                    if (value.Title.toLowerCase() == 'draft') {
                                                        item.isDrafted = true;
                                                    }
                                                });
                                            }
                                        }
                                    })
                               
                                AllTasks = AllTasks.concat(AllTasksMatches);
                                AllTasks = $.grep(AllTasks, function (type: any) { return type.isDrafted == false });
        
        
                              //  if (Counter === siteConfig.length ) {
                                     AllTasks.forEach((result: any) => {
                                        //   result.TeamLeader = []
                                        result.CreatedDateImg = []
                                        result.TeamLeaderUserTitle = ''
                                        //  result.AllTeamMembers = []
                                        result.Display = 'none'
                                        result.DueDate = moment(result.DueDate).format('DD/MM/YYYY')
        
                                        if (result.DueDate == 'Invalid date' || '') {
                                            result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                                        }
                                        result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
        
                                        if (result.Short_x0020_Description_x0020_On != undefined) {
                                            result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                                        }
                                        if (result.Author != undefined) {
                                            if (result.Author.Id != undefined) {
                                                $.each(taskUsers, function (index: any, users: any) {
                                                    if (result.Author.Id != undefined && users.AssingedToUser != undefined && result.Author.Id == users.AssingedToUser.Id) {
                                                        users.ItemCover = users.Item_x0020_Cover.Url;
                                                        result.CreatedDateImg.push(users);
                                                    }
                                                })
                                            }
                                        }
                                        result['SiteIcon'] = globalCommon.GetIconImageUrl(result.siteType, GlobalConstants.MAIN_SITE_URL + '/SP', undefined);
                                        if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                                            result.ClientCategory.forEach((catego: any) => {
                                                result.ClientCategory.push(catego);
                                            })
                                        }
                                        if (result.Id === 498 || result.Id === 104)
                                            console.log(result);
                                        result['Shareweb_x0020_ID'] = globalCommon.getTaskId(result);
                                        if (result['Shareweb_x0020_ID'] == undefined) {
                                            result['Shareweb_x0020_ID'] = "";
                                        }
                                        result['Item_x0020_Type'] = 'Task';
        
                                        result.Portfolio_x0020_Type = 'Component';
                                       
                                    })
                                    let allParentTasks = $.grep(AllTasks, function (type: any) { return (type.ParentTask !=undefined && type.ParentTask.Id === props.props.Id) && (type.SharewebTaskType !=undefined && type.SharewebTaskType.Title != 'Workstream') });
                                    if(props.props.SharewebTaskType !=undefined && props.props.SharewebTaskType !=undefined && props.props.SharewebTaskType ==='Activities')
                                     allworkstreamTasks =  $.grep(AllTasks, function (task: any) { return (task.SharewebTaskType !=undefined && task.SharewebTaskType.Title === 'Workstream')});
                                    if(allworkstreamTasks !=undefined && allworkstreamTasks.length >0){
                                        allworkstreamTasks.forEach((obj:any) =>{
                                            if(obj.Id !=undefined){
                                                AllTasks.forEach((task:any) =>{
                                            if(task.ParentTask !=undefined && obj.Id ===task.ParentTask.Id){
                                                obj.childs =obj.childs !=undefined ?obj.childs :[]
                                                obj.childs.push(task);
                                            }
                                            if(obj.childs.length >0){
                                                obj.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                                                obj.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                                            }
                                              })
                                            }
                                            obj.Restructuring = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png";
                                            obj.childsLength =obj.childs !=undefined && obj.childs.length >0 ?obj.childs.length :0;
                                        })
                                    }
                                    
                                    var temp: any = {};
                                    temp.Title = 'Tasks';
                                    temp.childs = allParentTasks;
                                    temp.childsLength = allParentTasks.length;
                                    temp.flag = true;
                                    temp.show =true;
                                    temp.PercentComplete = '';
                                    temp.downArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                                    temp.RightArrowIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
                                    temp.ItemRank = '';
                                    temp.DueDate = '';
                                    if(allworkstreamTasks ===undefined)
                                    allworkstreamTasks =[];
                                    if(temp.childs.length >0)
                                    allworkstreamTasks =allworkstreamTasks.concat(temp);
                                    setData(allworkstreamTasks);
                                    setmaidataBackup(allworkstreamTasks)
                              //  }
                            }
                            } catch (error) {
                                console.log(error)
                            }
                        // } else Counter++;
        
                    //})
               // })
            }
            const GetComponents = async (Item:any) => {
                   var filt = "Id eq "+(Item.Component.length >0 ? Item.Component[0].Id :Item.Services[0].Id)+"";
                let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
              let compo =[];
              compo = await web.lists
                    .getById('ec34b38f-0669-480a-910c-f84e92e58adf')
                    .items
                    .select("ID", "Id", "Title", "Mileage", "Portfolio_x0020_Type","ItemType",
                    )
                   
                    .top(4999)
                    .filter(filt)
                    .get()
                    componentDetails=  compo[0]
                    if(componentDetails.ItemType ==='Component')
                    componentDetails.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';
                    if(componentDetails.ItemType ==='SubComponent')
                    componentDetails.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
                    if(componentDetails.ItemType ==='Feature')
                    componentDetails.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
                  //  setData(data =>[...allworkstreamTasks])

                    console.log(componentDetails);
            }
            React.useEffect(() => {
                MeetingItems.push(props)
                getTaskUsers(); 
                if((props.props.Component !=undefined && props.props.Component.length >0) || (props.props.Service !=undefined && props.props.Service[0].Id))
                GetComponents(props.props)
                if(props.props.ParentTask !=undefined && props.props.ParentTask.Title !=undefined )
                props.props.ParentIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png';
               else if(props.props.SharewebTaskType !=undefined && props.props.SharewebTaskType ==='Activities')
               props.props.CurrentIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Activity.png';
                if(props.props.SharewebTaskType !=undefined && props.props.SharewebTaskType ==='Workstream' )
                props.props.CurrentIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Workstream.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/icon_Workstream.png';
                GetSmartmetadata();
               
            },[]);
            const sortBy = () => {

                const copy = data
        
                copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);
        
                setTable(copy)
        
            }
            const sortByDng = () => {
        
                const copy = data
        
                copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);
        
                setTable(copy)
        
            }
            const handleOpenAll = () => {
                var Isshow1: any = Isshow == true ? false : true;
                data.forEach((obj) => {
                    obj.show = Isshow1;
                    if (obj.childs != undefined && obj.childs.length > 0) {
                        obj.childs.forEach( (subchild:any) => {
                            subchild.show = Isshow1;
                            if (subchild.childs != undefined && subchild.childs.length > 0) {
                                subchild.childs.forEach((child:any) => {
                                    child.show = Isshow1;
                                })
        
                            }
                        })
        
                    }
        
                })
                setIsshow(Isshow1);
                setData(data => ([...data]));
            };
            const handleOpen = (item: any) => {
              setIsShowTask(!isShowTask)
               // item.show = item.show = item.show == true ? false : true;
              // setData(data => ([...data]));
               
        
            };
            const onChangeHandler = (itrm: any) => {
                const list = [...checkedList];
                var flag = true;
                list.forEach((obj: any, index: any) => {
                    if (obj.Id != undefined && itrm?.Id != undefined && obj.Id === itrm.Id) {
                        flag = false;
                        list.splice(index, 1);
                    }
                })
                if (flag)
                    list.push(itrm);
                
                console.log(list);
                setCheckedList(checkedList => ([...list]));
                if(list.length ===0)
                clearreacture();
            };
            const EditItemTaskPopup = (item: any) => {
                // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
                setIsTask(true);
                setSharewebTask(item);
                // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
            }
            const EditData = (e: any, item: any) => {
                setIsTimeEntry(true);
                setSharewebTimeComponent(item);
            }
            const addModal = () => {
                setAddModalOpen(true)
            }
            const setModalIsOpenToTrue = () => {
                setModalIsOpen(true)
            }
            const Call = React.useCallback((childItem: any) => {
                setIsTask(false);
                setMeetingPopup(false);
                setWSPopup(false);
                var MainId: any = ''
                if (childItem != undefined) {
                    childItem.data['flag'] = true;
                    childItem.data['TitleNew'] = childItem.data.Title;
                    childItem.data['SharewebTaskType'] = { Title: 'Workstream' }
                    if (childItem.data.ServicesId != undefined && childItem.data.ServicesId.length > 0) {
                        MainId = childItem.data.ServicesId[0]
                    }
                    if (childItem.data.ComponentId != undefined && childItem.data.ComponentId.length > 0) {
                        MainId = childItem.data.ComponentId[0]
                    }
                    allworkstreamTasks.push(childItem.data)
                    
                    
                    // if (allworkstreamTasks != undefined) {
                    //     allworkstreamTasks.forEach((val: any) => {
                    //         if (val.Id == MainId) {
                    //             if(val.childs == undefined){
                    //                 val.childs=[]
                    //                 val.childs.push(childItem.data)
                    //             }
                    //             else{
                    //                 val.childs.push(childItem.data)
                    //             }
                               
                    //         }
          
                    //     })
                        setData(allworkstreamTasks)
                        setCount(count+1)
                       
                       
                        
                    
        
                }
            }, []);
            const TimeEntryCallBack = React.useCallback((item1) => {
                setIsTimeEntry(false);
            }, []);
            let isOpenPopup =false;
            const CloseCall = React.useCallback((item) => {
                if (!isOpenPopup && item.CreatedItem != undefined) {
                    item.CreatedItem.forEach((obj: any) => {
                        obj.data.childs = [];
                        obj.data.flag = true;
                        obj.data.TitleNew = obj.data.Title;
                        // obj.data.Team_x0020_Members=item.TeamMembersIds;
                        // obj.AssignedTo =item.AssignedIds;
                        obj.data.siteType = "Master Tasks";
                        obj.data['Shareweb_x0020_ID'] = obj.data.PortfolioStructureID;
                        if (item.props != undefined && item.props.SelectedItem != undefined && item.props.SelectedItem.childs != undefined) {
                            item.props.SelectedItem.childs = item.props.SelectedItem.childs == undefined ? [] : item.props.SelectedItem.childs;
                            item.props.SelectedItem.childs.unshift(obj.data);
                        }
        
                    })
                    // if (ComponentsData != undefined && ComponentsData.length > 0) {
                    //     ComponentsData.forEach((comp: any, index: any) => {
                    //         if (comp.Id != undefined && item.props.SelectedItem != undefined && comp.Id === item.props.SelectedItem.Id){
                    //             comp.childsLength =item.props.SelectedItem.childs.length;
                    //             comp.show = comp.show ==undefined ?false : comp.show
                    //             comp.childs = item.props.SelectedItem.childs;
                    //         }
                    //         if (comp.childs != undefined && comp.childs.length > 0) { 
                    //             comp.childs.forEach((subcomp: any, index: any) => {
                    //                 if (subcomp.Id != undefined && item.props.SelectedItem != undefined && subcomp.Id === item.props.SelectedItem.Id){
                    //                     subcomp.childsLength =item.props.SelectedItem.childs.length;
                    //                     subcomp.show = subcomp.show ==undefined ?false : subcomp.show
                    //                     subcomp.childs = item.props.SelectedItem.childs;
                    //                 }
                    //             })
                    //         }
        
                    //     })
                    //     // }
                    // }
                    // setData((data) => [...ComponentsData]);
                }
                if (!isOpenPopup && item.data != undefined) {
                    item.data.childs = [];
                    item.data.flag = true;
                    item.data.TitleNew = item.data.Title;
                    item.data.siteType = "Master Tasks"
                    item.data.childsLength = 0;
                    // item.data['Shareweb_x0020_ID'] = item.data.PortfolioStructureID;
                    // ComponentsData.unshift(item.data);
                   // setData((data) => [...ComponentsData]);
                }
                setAddModalOpen(false)
            }, []);
            function clearreacture (){
            
                    data.forEach((obj) => {
                        obj.isRestructureActive = false;
                        if (obj.childs != undefined && obj.childs.length > 0) {
                            obj.childs.forEach((sub: any) => {
                                obj.isRestructureActive = false;
                                if (sub.childs != undefined && sub.childs.length > 0) {
                                    sub.childs.forEach((subchild: any) => {
                                        obj.isRestructureActive = false;
                                    })
                                }

                            })
                        }


                    })
            
                setData((data) => [...data]);
            }

            const CreateOpenCall = React.useCallback((item) => {
                isOpenPopup = true;
                item.data.childs = [];
                item.data.flag = true;
                item.data.siteType = "Master Tasks"
                item.data.TitleNew = item.data.Title;
                item.data.childsLength = 0;
                item.data['Shareweb_x0020_ID'] = item.data.PortfolioStructureID;
                if (checkedList != undefined && checkedList.length > 0)
                    checkedList[0].childs.unshift(item.data);
                // else ComponentsData.unshift(item.data);
        
                // setSharewebComponent(item.data)
                // setIsComponent(true);
                // setData((data) => [...ComponentsData]);
                // setSharewebComponent(item);
            }, []);
            const buttonRestructuring = () => {
                var ArrayTest: any = [];
                //  if (checkedList != undefined && checkedList.length === 1) {
                // if (checkedList.length > 0 && checkedList[0].childs != undefined && checkedList[0].childs.length > 0 && checkedList[0].Item_x0020_Type === 'Workstream')
                //     alert('You are not allowed to Restructure this item.')
               
                if (checkedList.length > 0) {
                    data.forEach((obj) => {
                        if(obj.SharewebTaskType != undefined && obj.SharewebTaskType.Title !=undefined  && obj.SharewebTaskType.Title =='Workstream')
                        obj.isRestructureActive = true;
                        if (obj.Id === checkedList[0].Id) {
                            obj.isRestructureActive = false;
                            ArrayTest.push(...[obj])
                        }
                        if (obj.childs != undefined && obj.childs.length > 0) {
                            obj.childs.forEach((sub: any) => {
                                if (sub.Id === checkedList[0].Id) {
                                    obj.isRestructureActive = false;
                                    ArrayTest.push(...[obj])
                                    ArrayTest.push(...[sub])
                                    // ArrayTest.push(sub)
                                }
                                if (sub.childs != undefined && sub.childs.length > 0) {
                                    sub.childs.forEach((subchild: any) => {
                                        if (subchild.Item_x0020_Type === 'Feature')
                                            subchild.isRestructureActive = true;
                                        if (subchild.Id === checkedList[0].Id) {
                                            ArrayTest.push(...[obj])
                                            ArrayTest.push(...[sub])
                                            ArrayTest.push(...[subchild])
                                            // ArrayTest.push(sub)
                                        }
                                        if (subchild.childs != undefined && subchild.childs.length > 0) {
                                            subchild.childs.forEach((listsubchild: any) => {
                                                if (listsubchild.Id === checkedList[0].Id) {
                                                    ArrayTest.push(...[obj])
                                                    ArrayTest.push(...[sub])
                                                    ArrayTest.push(...[subchild])
                                                    ArrayTest.push(...[listsubchild])
                                                }
                                                if (listsubchild.childs != undefined && listsubchild.childs.length > 0) {
                                                    listsubchild.childs.forEach((sublistsubchild: any) => {
                                                        if (sublistsubchild.Id === checkedList[0].Id) {
                                                            ArrayTest.push(...[obj])
                                                            ArrayTest.push(...[sub])
                                                            ArrayTest.push(...[subchild])
                                                            ArrayTest.push(...[listsubchild])
                                                            ArrayTest.push(...[sublistsubchild])
                                                        }
        
                                                    })
                                                }
                                            })
                                        }
        
                                    })
                                }
        
                            })
                        }
        
        
                    })
                }
                setOldArrayBackup(ArrayTest)
                IsShowRestru =true;
                //setData((data) => [...maidataBackup]);
        
                //  }
                // setAddModalOpen(true)
            }
            const RestruringCloseCall = () => {
                IsShowRestru =false;
                clearreacture();
                setResturuningOpen(false)
            };
            const OpenModal = (item: any) => {
                var TestArray: any = [];
                setResturuningOpen(true);
                data.forEach((obj) => {
                    if (obj.Id === item.Id)
                        TestArray.push(obj)
                    if (obj.childs != undefined && obj.childs.length > 0) {
                        obj.childs.forEach((sub: any) => {
                            if (sub.Id === item.Id) {
                                //TestArray.push(obj)
                                TestArray.push(...[obj]);
                                TestArray.push(...[sub])
                            }
                            if (sub.childs != undefined && sub.childs.length > 0) {
                                sub.childs.forEach((newsub: any) => {
                                    if (newsub.Id === item.Id) {
                                        TestArray.push(...[obj])
                                        TestArray.push(...[sub])
                                        TestArray.push(...[newsub])
                                    }
        
                                })
                            }
        
                        })
                    }
        
                })
               let Items: any = []; Items.push(OldArrayBackup[OldArrayBackup.length - 1]);
               setRestructureChecked(Items);
               if(TestArray.length ===0)
               setNewArrayBackup(NewArrayBackup => ([...props.props]));
              else setNewArrayBackup(NewArrayBackup => ([...TestArray]));
              
        
            }
        
            const setRestructure = (item: any, title: any) => {
                let array: any = [];
                item.Item_x0020_Type = title;
                // if (item != undefined && title === 'SubComponent') {
                //     item.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
        
                //     ChengedTitle = 'Component';
        
                // }
                // if (item != undefined && title === 'Feature') {
                //     item.SiteIcon = IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
                //     ChengedTitle = 'SubComponent';
        
                // }
              //  setChengedItemTitle(title);
                array.push(item)
                setRestructureChecked((RestructureChecked: any) => [...array]);
                // maidataBackup.forEach((obj) => {
                //     if (obj.Id === item.Id) {
                //         PortfolioLevelNum = obj.childs.length + 1;
                //     }
                //     if (obj.childs != undefined && obj.childs.length > 0) {
                //         obj.childs.forEach((sub: any) => {
                //             if (sub.Id === item.Id) {
                //                 PortfolioLevelNum = sub.childs.length + 1;
                //             }
                //             if (sub.childs != undefined && sub.childs.length > 0) {
                //                 sub.childs.forEach((newsub: any) => {
                //                     if (newsub.Id === item.Id) {
                //                         PortfolioLevelNum = newsub.childs.length + 1;
                //                     }
        
                //                 })
                //             }
        
                //         })
                //     }
        
                // })
                // setRestructureChecked(item);
            }
            const UpdateTaskRestructure = async function () {
                var Ids: any = [];
                if (NewArrayBackup != undefined && NewArrayBackup.length > 0) {
                    NewArrayBackup.forEach((obj, index) => {
                        if ((NewArrayBackup.length - 1) === index)
                            Ids.push(obj.Id);
                    })
        
                }
        
                let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
                await web.lists.getById(checkedList[0].listId).items.getById(checkedList[0].Id).update({
                    // EventsId: checkedList[0].Portfolio_x0020_Type === 'Event' ? { "results": Ids } : [],
                    //    '__metadata': { 'type': 'SP.Data.'+checkedList[0].siteType+'ListItem' },
                    ParentTaskId: NewArrayBackup[0].Id,
                }).then((res: any) => {
                    maidataBackup.forEach((obj, index) => {
                        obj.isRestructureActive = false;
                        if (obj.Id === checkedList[0].Id) {
                            if (obj.childs.length === 0) {
                                obj.downArrowIcon = '';
                                obj.RightArrowIcon = '';
                            }
                        }
                        if (obj.childs != undefined && obj.childs.length > 0) {
                            obj.childs.forEach((sub: any, indexsub: any) => {
                                sub.isRestructureActive = false;
                                if (sub.Id === checkedList[0].Id) {
                                    obj.childs.splice(indexsub, 1)
                                    if (sub.childs.length === 0) {
                                        sub.downArrowIcon = '';
                                        sub.RightArrowIcon = '';
                                    }
        
                                }
                                if (sub.childs != undefined && sub.childs.length > 0) {
                                    sub.childs.forEach((newsub: any, lastIndex: any) => {
                                        newsub.isRestructureActive = false;
                                        if (newsub.Id === checkedList[0].Id) {
                                            sub.childs.splice(lastIndex, 1)
                                            if (newsub.childs.length === 0) {
                                                newsub.downArrowIcon = '';
                                                newsub.RightArrowIcon = '';
                                            }
                                        }
        
                                    })
                                }
        
                            })
                        }
        
                    })
                    maidataBackup.forEach((obj, index) => {
                        if (obj.Id === Ids[0]) {
                            obj.flag = true;
                            obj.show = true;
                            obj.downArrowIcon = obj.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                            obj.RightArrowIcon = obj.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
        
                            obj.childs.push(checkedList[0]);
                            obj.childsLength = obj.childs.length;
                        }
                        if (obj.childs != undefined && obj.childs.length > 0) {
                            obj.childs.forEach((sub: any, indexsub: any) => {
                                sub.isRestructureActive = false;
                                if (sub.Id === Ids[0]) {
                                    sub.flag = true;
                                    sub.show = true;
                                    sub.downArrowIcon = sub.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                                    sub.RightArrowIcon = sub.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
        
                                    sub.childs.push(checkedList[0]);
                                    sub.childsLength = sub.childs.length
                                }
                                if (sub.childs != undefined && sub.childs.length > 0) {
                                    sub.childs.forEach((newsub: any, lastIndex: any) => {
                                        if (newsub.Id === Ids[0]) {
                                            newsub.flag = true;
                                            newsub.show = true;
                                            newsub.downArrowIcon = newsub.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png';
                                            newsub.RightArrowIcon = newsub.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png';
        
                                            newsub.childs.push(checkedList[0]);
                                            newsub.childsLength = newsub.childs.length
        
        
        
                                        }
        
                                    })
                                }
        
                            })
                        }
        
                    })
                    setData(data => ([...maidataBackup]));
                    RestruringCloseCall()
                })
            }
            const openActivity=()=>{
                if(props.props.SharewebTaskType == 'Workstream'){
                    MeetingItems[0].props['NoteCall']='Task'
                    setMeetingPopup(true)
                 }
                 if(props.props.SharewebTaskType == 'Activities'){
                    setWSPopup(true)
                   
                }
               
            }
    return (
      
        <div className={IsUpdated === 'Events' ? 'app component eventpannelorange' : (IsUpdated == 'Service' ? 'app component serviepannelgreena' : 'app component')}>
        <div className="Alltable mt-10">
                 <div className="tbl-headings">
                    <span className="leftsec">
                        <span className=''>
                            {componentDetails !== undefined && props.props.ParentTask != undefined && props.props.ParentTask.Title != undefined &&
                                <>
                                    <img className='icon-sites-img ml20'  src={componentDetails.SiteIcon} />
                                    {'>'} <img className='icon-sites-img ml20' src={props.props.ParentIcon} />
                                    {'>'} <img className='icon-sites-img ml20' src={props.props.CurrentIcon} /> <a>{props.props.Title}</a>
                                </>
                            }
                            {componentDetails === undefined  && props.props.ParentTask != undefined && props.props.ParentTask.Title != undefined &&
                                <>
                                    
                                   <img  className='icon-sites-img ml20' src={props.props.ParentIcon} />
                                    {'>'} <img  className='icon-sites-img ml20' src={props.props.CurrentIcon} /> <a>{props.props.Title}</a>
                                </>
                            }
                             {componentDetails !== undefined && props.props.ParentTask === undefined &&
                                <>
                                    <img  className='icon-sites-img ml20' src={componentDetails.SiteIcon} />
                                    {'>'} <img  className='icon-sites-img ml20' src={props.props.CurrentIcon} /> <a>{props.props.Title}</a>
                                </>
                            }
                        </span>
                        <span className="g-search">
                            <input type="text" className="searchbox_height full_width" id="globalSearch" placeholder="search all"
                                ng-model="SearchComponent.GlobalSearch" />
                            <span className="gsearch-btn" ng-click="SearchAll_Item()"><i className="fa fa-search"></i></span>
                        </span>
                    </span>
                    <span className="toolbox mx-auto">
                         {/* <button type="button" className="btn btn-primary"
                            onClick={addModal} title=" Add Structure" disabled={false}>
                            Add Structure
                        </button> */}
                        <button type="button"
                                            className="btn btn-primary"
                                            onClick={() => openActivity()}
                                            disabled={props.SharewerbTaskType == 'Task'?ActivityDisable:false}>

                                            <MdAdd />
                                            Add Workstream-Task
                                        </button>
                        <button type="button"
                             className="btn btn-primary" disabled={checkedList.length ==0}
                             onClick={buttonRestructuring}>
                            Restructure
                        </button>
                        {/* <button type="button"
                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                            disabled={true}>
                            Compare
                        </button> */}
                        <a className='expand'>
                                            {/* <ExpndTable prop={expndpopup} prop1={tablecontiner} /> */}
                                        </a>
                        <a>
                            {/* <Tooltip ComponentId='1748'/> */}
                            
                        </a>
                    </span>
                </div> 
                <div className="col-sm-12 pad0 smart" >
                    <div className="section-event">
                        <div className="wrapper">
                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "2%" }}>
                                            <div style={{ width: "2%" }}>
                                            <div className="smart-relative sign hreflink" onClick={() => handleOpenAll()} >{Isshow ? <img src={(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png'} />
                                                                : <img src={(IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('service') > -1) ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png"} />}
                                                            </div>
                                            </div>
                                        </th>
                                        <th style={{ width: "6%" }}>
                                            <div style={{ width: "6%" }}></div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input type="search" placeholder="TaskId" className="full_width searchbox_height"
                                                // onChange={(e)=>SearchVale(e,"TaskId")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "23%" }}>
                                            <div style={{ width: "22%" }} className="smart-relative">
                                                <input type="search" placeholder="Title" className="full_width searchbox_height"
                                                //  onChange={(e)=>SearchAll(e)}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Client Category"
                                                    title="Client Category" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "ClientCategory")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "4%" }}>
                                            <div style={{ width: "4%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="%"
                                                    title="Percentage Complete" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "ClientCategory")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setStatusmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setStatusmodalIsOpenToTrue} /></i>
                                                                    </span></span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="ItemRank"
                                                    title="Item Rank" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "ClientCategory")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setItemRankmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setItemRankmodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "10%" }}>
                                            <div style={{ width: "9%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Team"
                                                    title="Team" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "Team")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setTeamMembermodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setTeamMembermodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "9%" }}>
                                            <div style={{ width: "8%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Due Date"
                                                    title="Due Date" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "Status")}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setDuemodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setDuemodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "11%" }}>
                                            <div style={{ width: "10%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Created Date"
                                                    title="Created Date" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "ItemRank")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        //  href="#myDropdown1"
                                                                        onClick={setCreatedmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setCreatedmodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Smart Time"
                                                    title="Smart Time" className="full_width searchbox_height"
                                                // onChange={(e) => handleChange1(e, "Due")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        //  href="#myDropdown1"
                                                                        onClick={setModalSmartIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setModalSmartIsOpenToTrue} /></i>
                                                                    </span> 
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "3%" }}>
                                            <div style={{ width: "2%" }}>
                                                {IsShowRestru ? 
                                                <img  className='icon-sites-img ml20'  onClick={(e) => OpenModal(props.props)} src={IsShowRestru && IsUpdated == 'Service Portfolio' ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png" : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"} ></img> :''}
                                            </div>
                                        </th>
                                        <th style={{ width: "3%" }}>
                                            <div style={{ width: "2%" }}></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <div id="SpfxProgressbar" style={{ display: "none" }}>
                                        <img  id="sharewebprogressbar-image" src={GlobalConstants.MAIN_SITE_URL + "/SiteCollectionImages/ICONS/32/loading_apple.gif"} alt="Loading..." />
                                    </div>
                                    {data?.length > 0 && data && data.map(function (item, index) {

                                        if (item.flag == true) {
                                            return (
                                                <>
                                                    <tr >
                                                        <td className="p-0" colSpan={13}>
                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                <tr className="bold for-c0l">
                                                                    <td style={{ width: "2%" }}>


                                                                        <div className="accordian-header" >
                                                                            {item.childs != undefined && item.childs.length > 0 &&
                                                                                <a className='hreflink'
                                                                                    title="Tap to expand the childs">
                                                                                    <div onClick={() => handleOpen(item)} className="sign">{item.childs.length > 0 && isShowTask ? <img src={item.downArrowIcon} />
                                                                                        : <img src={item.RightArrowIcon} />}
                                                                                    </div>
                                                                                </a>
                                                                            }
                                                                        </div>

                                                                    </td>
                                                                    <td style={{ width: "6%" }}>
                                                                    
                                                                        <div className="d-flex">
                                                                        {
                                                                     item.SharewebTaskType?.Title != 'Task' &&
                                                                            <span className='pe-2'><input type="checkbox" onChange={(e) => onChangeHandler(item)} /></span>
                                                                            }
                                                                              <span>  <a className="hreflink" data-toggle="modal">
                                                                                    <img className="icon-sites-img ml20" src={item.SiteIcon}></img>
                                                                                </a>
                                                                            </span>
                                                                        </div>
                                                                      
                                                                    </td>
                                                                    <td style={{ width: "7%" }}><span className="ml-2">{item.Shareweb_x0020_ID}</span></td>
                                                                    <td style={{ width: "23%" }}>
                                                                        {/* {item.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" onClick={() => window.open(GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/Portfolio-Profile.aspx?taskId= + ${item.Id}`, '_blank')} */}
                                                                        {item.siteType === "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                            href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + item.Id}
                                                                        >
                                                                            {item.Title}
                                                                        </a>}
                                                                        {item.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                            href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + item.Id + '&Site=' + item.siteType}
                                                                        >{item.Title}
                                                                        </a>}
                                                                        {item.childs != undefined && item.childs.length > 0 &&
                                                                            <span>{item.childs.length == 0 ? "" : <span className='ms-1'>({item.childsLength})</span>}</span>
                                                                        }
                                                                        {item.Short_x0020_Description_x0020_On != null &&
                                                                            // <span className="project-tool"><img
                                                                            //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                            //         <span className="tooltiptext">
                                                                            //             <div className="tooltip_Desc">
                                                                            //                 <span>{item.Short_x0020_Description_x0020_On}</span>
                                                                            //             </div>
                                                                            //         </span>
                                                                            //     </span>
                                                                            // </span>
                                                                            <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                <div className="popover__content">
                                                                                    {item.Short_x0020_Description_x0020_On}
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td style={{ width: "7%" }}>
                                                                        <div>
                                                                            {item.ClientCategory != undefined && item.ClientCategory.length > 0 && item.ClientCategory.map(function (client: { Title: string; }) {
                                                                                return (
                                                                                    <span className="ClientCategory-Usericon"
                                                                                        title={client.Title}>
                                                                                        <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                    </span>
                                                                                )
                                                                            })}</div>
                                                                    </td>
                                                                    <td style={{ width: "4%" }}>{item.PercentComplete}</td>
                                                                    <td style={{ width: "7%" }}>{item.ItemRank}</td>
                                                                    <td style={{ width: "10%" }}>
                                                                        <div>
                                                                            <ShowTaskTeamMembers props={item} TaskUsers={taskUsers}></ShowTaskTeamMembers>

                                                                        </div>
                                                                    </td>


                                                                    <td style={{ width: "9%" }}>{item.DueDate}</td>
                                                                    <td style={{ width: "11%" }}>
                                                                        {(item.CreatedDateImg != undefined && item.CreatedDateImg.length === 0 && item.Created != null) ?
                                                                            <>
                                                                                {item.Created != null ? moment(item.Created).format('DD/MM/YYYY') : ""}
                                                                                <img className='AssignUserPhoto' title={item.Author.Title} src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />
                                                                            </>
                                                                            :
                                                                            <>
                                                                                {item.CreatedDateImg != null ? item.CreatedDateImg.map((Creates: any) => {
                                                                                    return (
                                                                                        <span>
                                                                                            {item.Created != null ? moment(item.Created).format('DD/MM/YYYY') : ""}
                                                                                            <a target='_blank' data-interception="off" href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Creates.AssingedToUser.Id}&Name=${Creates.AssingedToUser.Title}`}>

                                                                                                <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                            </a>
                                                                                        </span>
                                                                                    )
                                                                                }) : ""}
                                                                            </>
                                                                        }
                                                                    </td>

                                                                    <td style={{ width: "7%" }}>
                                                                        {/* {item.Item_x0020_Type == 'Task' && item.TimeSpent != null &&
                                                                            <>
                                                                            {item.TimeSpent.toFixed(1)}
                                                                        </>
                                                                        } */}
                                                                    </td>

                                                                    <td style={{ width: "3%" }}>{item.Item_x0020_Type == 'Task' && item.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, item)}><img style={{ width: "22px" }} src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/clock-gray.png"}></img></a>}</td>
                                                                    <td style={{ width: "3%" }}>{item.siteType !== "Master Tasks" && item.Title !== 'Tasks' && item.isRestructureActive && <a href="#" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit"><img className='icon-sites-img' src={item.Restructuring} onClick={(e) => OpenModal(item)} /></a>}<a>
                                                                        {item.Item_x0020_Type == 'Task' && item.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(item)} />}</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    {isShowTask && item.childs?.length > 0 && (
                                                        <>
                                                            {item.childs.map(function (childitem: any) {
                                                                if (childitem.flag == true) {
                                                                    return (
                                                                        <>
                                                                            <tr >
                                                                                <td className="p-0" colSpan={13}>
                                                                                    <table className="table m-0" style={{ width: "100%" }}>
                                                                                        <tr className="for-c02">
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <div onClick={() => handleOpen(childitem)} className="sign">{childitem.childs.length > 0 && childitem.show ? <img src={childitem.downArrowIcon} />
                                                                                                    : <img src={childitem.RightArrowIcon} />}
                                                                                                </div>
                                                                                            </td>
                                                                                            <td style={{ width: "6%" }}>
                                                                                                {childitem.SharewebTaskType?.Title != 'Task' && 
                                                                                                <span className='pe-2'><input type="checkbox"  onChange={(e) => onChangeHandler(childitem)}  /></span>}
                                                                                                <span>
                                                                                                    <a className="hreflink" data-toggle="modal">
                                                                                                        <img className="icon-sites-img ml20" src={childitem.SiteIcon}></img>
                                                                                                    </a>
                                                                                                </span>
                                                                
                                                                                            </td>
                                                                                            <td style={{ width: "7%" }}>  <span className="ml-2">{childitem.Shareweb_x0020_ID}</span>
                                                                                            </td>
                                                                                            <td style={{ width: "23%" }}>
                                                                                                {childitem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                    href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id}
                                                                                                >{childitem.Title}
                                                                                                </a>}
                                                                                                {childitem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                    href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + childitem.Id + '&Site=' + childitem.siteType}
                                                                                                >{childitem.Title}
                                                                                                </a>}
                                                                                                {childitem.childs != undefined && childitem.childs.length > 0 &&
                                                                                                    <span className='ms-1'>({childitem.childsLength})</span>
                                                                                                }
                                                                                                {childitem.Short_x0020_Description_x0020_On != null &&
                                                                                                    // <span className="project-tool"><img
                                                                                                    //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                    //         <span className="tooltiptext">
                                                                                                    //             <div className="tooltip_Desc">
                                                                                                    //                 <span>{childitem.Short_x0020_Description_x0020_On}</span>
                                                                                                    //             </div>
                                                                                                    //         </span>
                                                                                                    //     </span>
                                                                                                    // </span>
                                                                                                    <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                        <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                                        <div className="popover__content">
                                                                                                            {childitem.Short_x0020_Description_x0020_On}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                            </td>
                                                                                            <td style={{ width: "7%" }}>
                                                                                                <div>
                                                                                                    {childitem.ClientCategory != undefined && childitem.ClientCategory.length > 0 && childitem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                        return (
                                                                                                            <span className="ClientCategory-Usericon"
                                                                                                                title={client.Title}>
                                                                                                                <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                            </span>
                                                                                                        )
                                                                                                    })}</div>
                                                                                            </td>
                                                                                            <td style={{ width: "4%" }}>{childitem.PercentComplete}</td>
                                                                                            <td style={{ width: "7%" }}>{childitem.ItemRank}</td>
                                                                                            <td style={{ width: "10%" }}><div>
                                                                                                <ShowTaskTeamMembers props={childitem} TaskUsers={taskUsers}></ShowTaskTeamMembers>
                                                                                            </div></td>
                                                                                            <td style={{ width: "9%" }}>{childitem.DueDate}</td>
                                                                                            <td style={{ width: "11%" }}>
                                                                                                {(childitem.CreatedDateImg != undefined && childitem.CreatedDateImg.length === 0 && childitem.Created != null) ?
                                                                                                    <>
                                                                                                        {childitem.Created != null ? moment(childitem.Created).format('DD/MM/YYYY') : ""}
                                                                                                        <img className='AssignUserPhoto' title={childitem.Author.Title} src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />

                                                                                                    </>
                                                                                                    :
                                                                                                    <>
                                                                                                        {childitem.CreatedDateImg != null ? childitem.CreatedDateImg.map((Creates: any) => {
                                                                                                            return (
                                                                                                                <span>
                                                                                                                    {childitem.Created != null ? moment(childitem.Created).format('DD/MM/YYYY') : ""}
                                                                                                                    <a target='_blank' data-interception="off" href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Creates.AssingedToUser.Id}&Name=${Creates.AssingedToUser.Title}`}>

                                                                                                                        <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                                                    </a>
                                                                                                                </span>
                                                                                                            )
                                                                                                        }) : ""}
                                                                                                    </>
                                                                                                }</td>

                                                                                            <td style={{ width: "7%" }}>
                                                                                                {/* {childitem.Item_x0020_Type == 'Task' &&
                                                                                                <>
                                                                                                {smartTime.toFixed(1)}
                                                                                                </>
                                                                                                }
                                                                                                {SmartTimes? <SmartTimeTotal props={childitem} CallBackSumSmartTime={CallBackSumSmartTime} /> : null} */}
                                                                                            </td>

                                                                                            <td style={{ width: "3%" }}>{childitem.Item_x0020_Type == 'Task' && childitem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childitem)}><img style={{ width: "22px" }} src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/clock-gray.png"}></img></a>}</td>
                                                                                            <td style={{ width: "3%" }}><a>
                                                                                                {childitem.Item_x0020_Type == 'Task' && childitem.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(childitem)} />}</a></td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                            {childitem.show && childitem.childs.length > 0 && (
                                                                                <>
                                                                                    {childitem.childs.map(function (childinew: any) {
                                                                                        if (childinew.flag == true) {
                                                                                            return (
                                                                                                <>
                                                                                                    <tr >
                                                                                                        <td className="p-0" colSpan={13}>
                                                                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                <tr className="tdrow">
                                                                                                                    <td style={{ width: "2%" }}>
                                                                                                                        <div className="accordian-header" onClick={() => handleOpen(childinew)}>
                                                                                                                            {childinew.childs.length > 0 &&
                                                                                                                                <a className='hreflink'
                                                                                                                                    title="Tap to expand the childs">
                                                                                                                                    <div className="sign">{childinew.childs.length > 0 && childinew.show ? <img src={childinew.downArrowIcon} />
                                                                                                                                        : <img src={childinew.RightArrowIcon} />}
                                                                                                                                    </div>
                                                                                                                                </a>
                                                                                                                            }

                                                                                                                        </div>

                                                                                                                    </td>
                                                                                                                    <td style={{ width: "6%" }}>
                                                                                                                    {childinew.SharewebTaskType?.Title != 'Task' && 
                                                                                                                        <span className='pe-2'><input type="checkbox" /></span>}
                                                                                                                            <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                <img className="icon-sites-img ml20" src={childinew.SiteIcon}></img>
                                                                                                                            </a>
                                                                                                                        
                                                                                                                  
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "7%" }}> <div className="d-flex">

                                                                                                                        <span className="ml-2">{childinew.Shareweb_x0020_ID}</span>
                                                                                                                    </div>
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "23%" }}>
                                                                                                                        {childinew.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                            href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childinew.Id}
                                                                                                                        >{childinew.Title}
                                                                                                                        </a>}
                                                                                                                        {childinew.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                            href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + childinew.Id + '&Site=' + childinew.siteType}
                                                                                                                        >{childinew.Title}
                                                                                                                        </a>}
                                                                                                                        {childinew.childs != undefined && childinew.childs.length > 0 &&
                                                                                                                            <span className='ms-1'>({childinew.childs.length})</span>
                                                                                                                        }
                                                                                                                        {childinew.Short_x0020_Description_x0020_On != null &&
                                                                                                                            // <span className="project-tool"><img
                                                                                                                            //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                            //         <span className="tooltiptext">
                                                                                                                            //             <div className="tooltip_Desc">
                                                                                                                            //                 <span>{childinew.Short_x0020_Description_x0020_On}</span>
                                                                                                                            //             </div>
                                                                                                                            //         </span>
                                                                                                                            //     </span>
                                                                                                                            // </span>
                                                                                                                            <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                                                                <div className="popover__content">
                                                                                                                                    {childinew.Short_x0020_Description_x0020_On}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "7%" }}>
                                                                                                                        <div>
                                                                                                                            {childinew.ClientCategory != undefined && childinew.ClientCategory.length > 0 && childinew.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                                return (
                                                                                                                                    <span className="ClientCategory-Usericon"
                                                                                                                                        title={client.Title}>
                                                                                                                                        <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                    </span>
                                                                                                                                )
                                                                                                                            })}</div>
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "4%" }}>{childinew.PercentComplete}</td>
                                                                                                                    <td style={{ width: "7%" }}>{childinew.ItemRank}</td>
                                                                                                                    <td style={{ width: "10%" }}>
                                                                                                                        <div>
                                                                                                                            <ShowTaskTeamMembers props={childinew} TaskUsers={taskUsers}></ShowTaskTeamMembers>
                                                                                                                            {/* {childinew.TeamLeaderUser != undefined && childinew.TeamLeaderUser != undefined && childinew.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                        return (
                                                                                                                            <span className="AssignUserPhoto"
                                                                                                                                title={client1.Title}>
                                                                                                                                <a>{client1.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                            </span>
                                                                                                                        )
                                                                                                                    })} */}
                                                                                                                        </div>

                                                                                                                    </td>
                                                                                                                    <td style={{ width: "9%" }}>{childinew.DueDate}</td>
                                                                                                                    <td style={{ width: "11%" }}>
                                                                                                                        {(childinew.CreatedDateImg != undefined && childinew.CreatedDateImg.length === 0 && childinew.Created != null) ?
                                                                                                                            <>
                                                                                                                                {childinew.Created != null ? moment(childinew.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                <img className='AssignUserPhoto' title={childinew.Author.Title} src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />

                                                                                                                            </>
                                                                                                                            :
                                                                                                                            <>
                                                                                                                                {childinew.CreatedDateImg != null ? childinew.CreatedDateImg.map((Creates: any) => {
                                                                                                                                    return (
                                                                                                                                        <span>
                                                                                                                                            {childinew.Created != null ? moment(childinew.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                            <a target='_blank' data-interception="off" href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Creates.AssingedToUser.Id}&Name=${Creates.AssingedToUser.Title}`}>

                                                                                                                                                <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                                                                            </a>
                                                                                                                                        </span>
                                                                                                                                    )
                                                                                                                                }) : ""}
                                                                                                                            </>
                                                                                                                        }
                                                                                                                    </td>

                                                                                                                    <td style={{ width: "7%" }}>
                                                                                                                    </td>

                                                                                                                    <td style={{ width: "3%" }}>{childinew.Item_x0020_Type == 'Task' && childinew.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, childinew)}><img style={{ width: "22px" }} src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/clock-gray.png"}></img></a>}</td>
                                                                                                                    <td style={{ width: "3%" }}><a>
                                                                                                                        {childinew.Item_x0020_Type == 'Task' && childinew.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(childinew)} />}</a></td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    {childinew.show && childinew.childs.length > 0 && (
                                                                                                        <>
                                                                                                            {childinew.childs.map(function (subchilditem: any) {
                                                                                                                return (
                                                                                                                    <>
                                                                                                                        <tr >
                                                                                                                            <td className="p-0" colSpan={13}>
                                                                                                                                <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                                    <tr className="for-c02">
                                                                                                                                        <td style={{ width: "2%" }}>
                                                                                                                                            <div className="accordian-header" onClick={() => handleOpen(subchilditem)}>
                                                                                                                                                {subchilditem.childs.length > 0 &&
                                                                                                                                                    <a className='hreflink'
                                                                                                                                                        title="Tap to expand the childs">
                                                                                                                                                        <div className="sign">{subchilditem.childs.length > 0 && subchilditem.show ? <img src={subchilditem.downArrowIcon} />
                                                                                                                                                            : <img src={subchilditem.RightArrowIcon} />}
                                                                                                                                                        </div>
                                                                                                                                                    </a>
                                                                                                                                                }
                                                                                                                                            </div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "6%" }}>
                                                                                                                                            <span className='pe-2'><input type="checkbox" /></span>
                                                                                                                                            <span>
                                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                    <img className="icon-sites-img ml20" src={subchilditem.SiteIcon}></img>
                                                                                                                                                </a>
                                                                                                                                            </span>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "7%" }}>  <div className="d-flex">

                                                                                                                                            <span className="ml-2">{subchilditem.Shareweb_x0020_ID}</span>
                                                                                                                                        </div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "23%" }}>
                                                                                                                                            {subchilditem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id}
                                                                                                                                            >{subchilditem.Title}
                                                                                                                                            </a>}
                                                                                                                                            {subchilditem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + subchilditem.Id + '&Site=' + subchilditem.siteType}
                                                                                                                                            >{subchilditem.Title}
                                                                                                                                            </a>}
                                                                                                                                            {subchilditem.childs != undefined && subchilditem.childs.length > 0 &&
                                                                                                                                                <span className='ms-1'>({subchilditem.childs.length})</span>
                                                                                                                                            }
                                                                                                                                            {subchilditem.Short_x0020_Description_x0020_On != null &&
                                                                                                                                                // <span className="project-tool"><img
                                                                                                                                                //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                                                //         <span className="tooltiptext">
                                                                                                                                                //             <div className="tooltip_Desc">
                                                                                                                                                //                 <span>{subchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                //             </div>
                                                                                                                                                //         </span>
                                                                                                                                                //     </span>
                                                                                                                                                // </span>
                                                                                                                                                <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                                    <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                                                                                    <div className="popover__content">
                                                                                                                                                        {subchilditem.Short_x0020_Description_x0020_On}
                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                            }
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "7%" }}>
                                                                                                                                            <div>
                                                                                                                                                {subchilditem.ClientCategory != undefined && subchilditem.ClientCategory.length > 0 && subchilditem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                                                    return (
                                                                                                                                                        <span className="ClientCategory-Usericon"
                                                                                                                                                            title={client.Title}>
                                                                                                                                                            <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                        </span>
                                                                                                                                                    )
                                                                                                                                                })}</div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "4%" }}>{subchilditem.PercentComplete}</td>
                                                                                                                                        <td style={{ width: "7%" }}>{subchilditem.ItemRank}</td>
                                                                                                                                        <td style={{ width: "10%" }}>
                                                                                                                                            <div>
                                                                                                                                                <ShowTaskTeamMembers props={subchilditem} TaskUsers={taskUsers}></ShowTaskTeamMembers>
                                                                                                                                            </div>
                                                                                                                                        </td>

                                                                                                                                        <td style={{ width: "9%" }}>{subchilditem.DueDate}</td>
                                                                                                                                        <td style={{ width: "11%" }}>
                                                                                                                                            {(subchilditem.CreatedDateImg != undefined && subchilditem.CreatedDateImg.length === 0 && subchilditem.Created != null) ?
                                                                                                                                                <>
                                                                                                                                                    {subchilditem.Created != null ? moment(subchilditem.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                                    <img className='AssignUserPhoto' title={subchilditem.Author.Title} src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />

                                                                                                                                                </>
                                                                                                                                                :
                                                                                                                                                <>
                                                                                                                                                    {subchilditem.CreatedDateImg != null ? subchilditem.CreatedDateImg.map((Creates: any) => {
                                                                                                                                                        return (
                                                                                                                                                            <span>
                                                                                                                                                                {subchilditem.Created != null ? moment(subchilditem.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                                                <a target='_blank' data-interception="off" href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Creates.AssingedToUser.Id}&Name=${Creates.AssingedToUser.Title}`}>

                                                                                                                                                                    <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                                                                                                </a>
                                                                                                                                                            </span>
                                                                                                                                                        )
                                                                                                                                                    }) : ""}
                                                                                                                                                </>
                                                                                                                                            }
                                                                                                                                        </td>

                                                                                                                                        <td style={{ width: "7%" }}>
                                                                                                                                            {/* {subchilditem.Item_x0020_Type == 'Task' &&
                                                                                                                                            <>
                                                                                                                                                {smartTime.toFixed(1)}
                                                                                                                                                </>
                                                                                                                                                }
                                                                                                                                                {SmartTimes? <SmartTimeTotal props={subchilditem} CallBackSumSmartTime={CallBackSumSmartTime} /> : null} */}
                                                                                                                                        </td>
                                                                                                                                        

                                                                                                                                        <td style={{ width: "3%" }}>{subchilditem.Item_x0020_Type == 'Task' && subchilditem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, subchilditem)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                                        <td style={{ width: "3%" }}><a>
                                                                                                                                            {subchilditem.Item_x0020_Type == 'Task' && subchilditem.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(subchilditem)} />}</a></td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        {subchilditem.show && subchilditem.childs.length > 0 && (
                                                                                                                            <>
                                                                                                                                {subchilditem.childs.map(function (nextsubchilditem: any) {
                                                                                                                                    return (
                                                                                                                                        <>
                                                                                                                                            <tr >
                                                                                                                                                <td className="p-0" colSpan={13}>
                                                                                                                                                    <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                                                        <tr className="for-c02">
                                                                                                                                                            <td style={{ width: "2%" }}>
                                                                                                                                                                <div className="accordian-header" onClick={() => handleOpen(nextsubchilditem)}>
                                                                                                                                                                    {nextsubchilditem.childs.length > 0 &&
                                                                                                                                                                        <a className='hreflink'
                                                                                                                                                                            title="Tap to expand the childs">
                                                                                                                                                                            <div className="sign">{nextsubchilditem.childs.length > 0 && nextsubchilditem.show ? <img src={nextsubchilditem.downArrowIcon} />
                                                                                                                                                                                : <img src={nextsubchilditem.RightArrowIcon} />}
                                                                                                                                                                            </div>
                                                                                                                                                                        </a>
                                                                                                                                                                    }
                                                                                                                                                                </div>
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "6%" }}>
                                                                                                                                                                <span className='pe-2'><input type="checkbox" /></span>
                                                                                                                                                                <span>
                                                                                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                                        <img className="icon-sites-img ml20" src={nextsubchilditem.SiteIcon}></img>
                                                                                                                                                                    </a>
                                                                                                                                                                </span>
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "7%" }}>  <div className="d-flex">

                                                                                                                                                                <span className="ml-2">{nextsubchilditem.Shareweb_x0020_ID}</span>
                                                                                                                                                            </div>
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "23%" }}>
                                                                                                                                                                {nextsubchilditem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                                    href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id}
                                                                                                                                                                >{nextsubchilditem.Title}
                                                                                                                                                                </a>}
                                                                                                                                                                {nextsubchilditem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                                    href={GlobalConstants.MAIN_SITE_URL + "/SP/SitePages/Task-Profile.aspx?taskId=" + nextsubchilditem.Id + '&Site=' + nextsubchilditem.siteType}
                                                                                                                                                                >{nextsubchilditem.Title}
                                                                                                                                                                </a>}
                                                                                                                                                                {nextsubchilditem.childs != undefined && nextsubchilditem.childs.length > 0 &&
                                                                                                                                                                    <span className='ms-1'>({nextsubchilditem.childs.length})</span>
                                                                                                                                                                }
                                                                                                                                                                {nextsubchilditem.Short_x0020_Description_x0020_On != null &&
                                                                                                                                                                    // <span className="project-tool"><img
                                                                                                                                                                    //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                                                                    //         <span className="tooltiptext">
                                                                                                                                                                    //             <div className="tooltip_Desc">
                                                                                                                                                                    //                 <span>{nextsubchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                                    //             </div>
                                                                                                                                                                    //         </span>
                                                                                                                                                                    //     </span>
                                                                                                                                                                    // </span>
                                                                                                                                                                    <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                                                        <img src={GlobalConstants.MAIN_SITE_URL + "/SP/SiteCollectionImages/ICONS/24/infoIcon.png"} />
                                                                                                                                                                        <div className="popover__content">
                                                                                                                                                                            {nextsubchilditem.Short_x0020_Description_x0020_On}
                                                                                                                                                                        </div>
                                                                                                                                                                    </div>
                                                                                                                                                                }
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "7%" }}>
                                                                                                                                                                <div>
                                                                                                                                                                    {nextsubchilditem.ClientCategory != undefined && nextsubchilditem.ClientCategory.length > 0 && nextsubchilditem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                                                                        return (
                                                                                                                                                                            <span className="ClientCategory-Usericon"
                                                                                                                                                                                title={client.Title}>
                                                                                                                                                                                <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                                            </span>
                                                                                                                                                                        )
                                                                                                                                                                    })}</div>
                                                                                                                                                            </td>
                                                                                                                                                            <td style={{ width: "4%" }}>{nextsubchilditem.PercentComplete}</td>
                                                                                                                                                            <td style={{ width: "7%" }}>{nextsubchilditem.ItemRank}</td>
                                                                                                                                                            <td style={{ width: "10%" }}>
                                                                                                                                                                <div>
                                                                                                                                                                    <ShowTaskTeamMembers props={nextsubchilditem} TaskUsers={taskUsers}></ShowTaskTeamMembers>
                                                                                                                                                                </div>
                                                                                                                                                            </td>

                                                                                                                                                            <td style={{ width: "9%" }}>{nextsubchilditem.DueDate}</td>
                                                                                                                                                            <td style={{ width: "11%" }}>
                                                                                                                                                                {(nextsubchilditem.CreatedDateImg != undefined && nextsubchilditem.CreatedDateImg.length === 0 && nextsubchilditem.Created != null) ?
                                                                                                                                                                    <>
                                                                                                                                                                        {nextsubchilditem.Created != null ? moment(nextsubchilditem.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                                                        <img className='AssignUserPhoto' title={nextsubchilditem.Author.Title} src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg" />

                                                                                                                                                                    </>
                                                                                                                                                                    :
                                                                                                                                                                    <>
                                                                                                                                                                        {nextsubchilditem.CreatedDateImg != null ? nextsubchilditem.CreatedDateImg.map((Creates: any) => {
                                                                                                                                                                            return (
                                                                                                                                                                                <span>
                                                                                                                                                                                    {nextsubchilditem.Created != null ? moment(nextsubchilditem.Created).format('DD/MM/YYYY') : ""}
                                                                                                                                                                                    <a target='_blank' data-interception="off" href={GlobalConstants.MAIN_SITE_URL + `/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${Creates.AssingedToUser.Id}&Name=${Creates.AssingedToUser.Title}`}>

                                                                                                                                                                                        <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                                                                                                                    </a>
                                                                                                                                                                                </span>
                                                                                                                                                                            )
                                                                                                                                                                        }) : ""}
                                                                                                                                                                    </>
                                                                                                                                                                }
                                                                                                                                                            </td>

                                                                                                                                                            <td style={{ width: "7%" }}>
                                                                                                                                                                {/* {nextsubchilditem.Item_x0020_Type == 'Task' &&
                                                                                                                                                                    <div>{nextsubchilditem.Mileage}</div>
                                                                                                                                                                } */}
                                                                                                                                                            </td>

                                                                                                                                                            <td style={{ width: "3%" }}>{nextsubchilditem.Item_x0020_Type == 'Task' && nextsubchilditem.siteType != "Master Tasks" && <a onClick={(e) => EditData(e, nextsubchilditem)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                                                            <td style={{ width: "3%" }}><a>
                                                                                                                                                                {nextsubchilditem.Item_x0020_Type == 'Task' && nextsubchilditem.siteType != "Master Tasks" && <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif" onClick={(e) => EditItemTaskPopup(nextsubchilditem)} />}</a></td>
                                                                                                                                                        </tr>
                                                                                                                                                    </table>
                                                                                                                                                </td>
                                                                                                                                            </tr>
                                                                                                                                        </>
                                                                                                                                    )
                                                                                                                                })}
                                                                                                                            </>

                                                                                                                        )}
                                                                                                                    </>
                                                                                                                )
                                                                                                            })}
                                                                                                        </>
                                                                                                    )}
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    })}</>
                                                                            )}</>
                                                                    )
                                                                }
                                                            })}
                                                        </>
                                                    )}
                                                </>
                                            )
                                        } 
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* {IsTask && <EditTaskPopup Items={SharewebTask} Call={Call}></EditTaskPopup>}
            {IsTimeEntry && <TimeEntryPopup props={SharewebTimeComponent} CallBackTimeEntry={TimeEntryCallBack}></TimeEntryPopup>} */}
          
            {/* <Panel headerText={` Create Component `} type={PanelType.medium} isOpen={addModalOpen} isBlocking={false} onDismiss={CloseCall}>
                <PortfolioStructureCreationCard CreatOpen={CreateOpenCall} Close={CloseCall} PortfolioType={IsUpdated} SelectedItem={checkedList != null && checkedList.length > 0 ? checkedList[0] : props} />
            </Panel> */}
               <Panel headerText={` Restructuring Tool `} type={PanelType.medium} isOpen={ResturuningOpen} isBlocking={false} onDismiss={RestruringCloseCall}>
                <div>
                    {ResturuningOpen ?
                        <div className='bg-ee p-2 restructurebox'>
                            <div>
                                {NewArrayBackup != undefined && NewArrayBackup.length > 0 ? <span>All below selected items will become child of  <img className="icon-sites-img me-1 " src={NewArrayBackup[0].SiteIcon}></img> <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + NewArrayBackup[0].Id}
                                ><span>{NewArrayBackup[0].Title}</span>
                                </a>  please click Submit to continue.</span> : ''}
                            </div>
                            <div> {checkedList != undefined && checkedList.length > 0 && (checkedList[0].SharewebTaskType.Title === 'Task' || checkedList[0].SharewebTaskType === undefined || checkedList[0].SharewebTaskType.Title === undefined)?
                                <div>
                                    <span> {'Select Task Type. :'}<input type="radio" name="fav_language" value="Workstream" checked={RestructureChecked[0].Item_x0020_Type == "Workstream" ? true : false} onChange={(e) => setRestructure(RestructureChecked[0], 'Workstream')} /><label className="ms-1"> {'Workstream'} </label></span>
                                    <span> <input type='radio' name="fav_language" value="Task" checked={RestructureChecked[0].Item_x0020_Type === "Task" ? true : false} onChange={(e) => setRestructure(RestructureChecked[0], 'Task')} /> <label className="ms-1"> {'Task'} </label> </span>
                                </div>
                                : ''}</div>
                            <div>
                                <span>  Old: </span>
                                {OldArrayBackup.map(function (obj: any, index) {
                                    if(obj.Title !=='Tasks'){
                                    return (
                                        <span> <img className="icon-sites-img me-1 ml20" src={obj.SiteIcon}></img><a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + obj.Id}
                                        ><span>{obj.Title}  </span>
                                        </a>{(OldArrayBackup.length - 1 < index) ? '>' : ''} </span>
                                    )
                                    }
                                })}

                            </div>
                            <div>
                                <span>  New:   </span> {NewArrayBackup.map(function (newobj: any, indexnew) {
                                    return (
                                        <>
                                            <span> <img className="icon-sites-img me-1 ml20" src={newobj.SiteIcon}></img><a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + newobj.Id}
                                            ><span>{newobj.Title}  </span>
                                            </a>{(NewArrayBackup.length - 1 < indexnew) ? '>' : ''}</span></>
                                    )
                                })}
                                <span> <img className="icon-sites-img me-1 ml20" src={RestructureChecked[0].SiteIcon}></img><a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + RestructureChecked[0].Id}
                                ><span>{RestructureChecked[0].Title}  </span>
                                </a></span>
                            </div>
                            {console.log("restructure functio test in div===================================")}
                           
                        </div>
                        : ''}
                </div>
                <footer className="mt-2 text-end">
                    {checkedList != undefined && checkedList.length > 0 && checkedList[0].Item_x0020_Type === 'Task' ?
                        <button type="button" className="btn btn-primary " onClick={(e) => UpdateTaskRestructure()}>Save</button>
                        :''}
                    <button type="button" className="btn btn-default btn-default ms-1" onClick={RestruringCloseCall}>Cancel</button>


                </footer>
            </Panel>
            {IsTask && <EditTaskPopup Items={SharewebTask} Call={Call}></EditTaskPopup>}
            {IsTimeEntry && <TimeEntryPopup props={SharewebTimeComponent} CallBackTimeEntry={TimeEntryCallBack}></TimeEntryPopup>}
            {MeetingPopup && <CreateActivity props={MeetingItems[0].props} Call={Call} LoadAllSiteTasks={LoadAllSiteTasks}></CreateActivity>}
            {WSPopup && <CreateWS props={MeetingItems[0].props} Call={Call} data={data}></CreateWS>}
           <Panel headerText={` Create Component `} type={PanelType.medium} isOpen={addModalOpen} isBlocking={false} onDismiss={CloseCall}>
                <PortfolioStructureCreationCard CreatOpen={CreateOpenCall} Close={CloseCall} PortfolioType={IsUpdated} SelectedItem={checkedList != null && checkedList.length > 0 ? checkedList[0] : props} />
            </Panel>
            </div>
    )

}
export default TasksTable;

function setTable(copy: any) {
    throw new Error('Function not implemented.');
}
// export interface ICommentCardProps {
//     siteUrl?: string;
//     userDisplayName?: string;
//     listName?: string;
//     itemID?: number;
//     Context?: any;
  
//   }
// export interface ITaskprofileState {
//     Result: any;
//     listName: string;
//     itemID: number;
//     isModalOpen: boolean;
//     imageInfo: any;
//     Display: string;
//     showcomment: string;
//     updateComment: boolean;
//     showComposition: boolean;
//     siteConfig: any;
//     // isOpenEditPopup: boolean;
//     // isTimeEntry: boolean,
//     // showPopup: any;
//     // maincollection: any;
//     // SharewebTimeComponent: any;
//     // isopenversionHistory:boolean;
//     // smarttimefunction: boolean;
//     // ApprovalStatus:boolean;
// }
// export default class TasksTable extends React.Component<ITaskprofileProps, ITaskprofileState> {
//     private taskUsers: any = [];
//     private smartMetaData: any = [];
//     private currentUser: any;
//     private oldTaskLink: any;
//     private site: any;
//     count: number = 0;
//     backGroundComment = false;
//     this: any;
//     public constructor(props: ITaskprofileProps, state: ITaskprofileState) {
//         super(props);
//         const params = new URLSearchParams(window.location.search);
//         console.log(params.get('taskId'));
//         console.log(params.get('Site'));
//         this.site = params.get('Site');
//         this.state = {
//             Result: {},
//             listName: params.get('Site'),
//             itemID: Number(params.get('taskId')),
//             isModalOpen: false,
//             imageInfo: {},
//             Display: 'none',
//             showcomment: 'none',
//             updateComment: false,
//             showComposition: true,
//             siteConfig: [],
//         }
//     }
//     private GetSmartmetadata = async () => {
//         //  var metadatItem: any = []
//         let smartmetaDetails: any = [];
//         var select: any = 'Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent'
//         smartmetaDetails = await globalCommon.getData(GlobalConstants.SP_SITE_URL, GlobalConstants.SMARTMETADATA_LIST_ID, select);
//         console.log(smartmetaDetails);
//         smartmetaDetails.forEach((newtest) => {
//             newtest.Id = newtest.ID;
//             if (newtest.TaxType == 'Sites' && newtest.Title != 'Master Tasks' && newtest.Title != 'SDC Sites') {
//                 this.state.siteConfig.push(newtest)
//             }
//         });
//     }
//     private async loadWSTasks(task: any) {
//         let AllWSTasks = [];
//         var select = "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=Parent/Id" + task.Id + ""
//         AllWSTasks = await globalCommon.getData(GlobalConstants.SP_SITE_URL, task.listId, select)
//         console.log(AllWSTasks);
//     }
//     private LoadAllSiteTasks(filterarray: any) {
//         var Response: any = []
//         var Counter = 0;
//         filterarray.forEach((filter: any) => {
//             this.state.siteConfig.forEach(async (config: any) => {
//                 if (config.Title != 'Master Tasks' && config.Title != 'SDC Sites') {
//                     try {
//                         let AllTasksMatches = [];
//                         var select = "SharewebTaskLevel2No,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id, Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=" + filter + ""
//                         AllTasksMatches = await globalCommon.getData(GlobalConstants.SP_SITE_URL, config.listId, select)
//                         console.log(AllTasksMatches);
//                         Counter++;
//                         console.log(AllTasksMatches.length);
//                         if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {

//                             $.each(AllTasksMatches, function (index: any, item: any) {
//                                 item.isDrafted = false;
//                                 item.flag = true;
//                                 item.siteType = config.Title;
//                                 item.childs = [];
//                                 item.listId = config.listId;
//                                 item.siteUrl = GlobalConstants.SP_SITE_URL;
//                                 if (item.SharewebCategories != undefined) {
//                                     if (item.SharewebCategories.length > 0) {
//                                         $.each(item.SharewebCategories, function (ind: any, value: any) {
//                                             if (value.Title.toLowerCase() == 'draft') {
//                                                 item.isDrafted = true;
//                                             }
//                                         });
//                                     }
//                                 }
//                             })
//                         }
//                         AllTasks = AllTasks.concat(AllTasksMatches);
//                         AllTasks = $.grep(AllTasks, function (type: any) { return type.isDrafted == false });


//                         if (Counter === (filterarray.length === 1 ? this.state.siteConfig.length : (this.state.siteConfig.length * filterarray.length))) {

//                             // map(AllTasks, (result: any) => {
//                             //     //   result.TeamLeader = []
//                             //     result.CreatedDateImg = []
//                             //     result.TeamLeaderUserTitle = ''
//                             //     //  result.AllTeamMembers = []
//                             //     result.Display = 'none'
//                             //     result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')

//                             //     if (result.DueDate == 'Invalid date' || '') {
//                             //         result.DueDate = result.DueDate.replaceAll("Invalid date", "")
//                             //     }
//                             //     result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

//                             //     if (result.Short_x0020_Description_x0020_On != undefined) {
//                             //         result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
//                             //     }
//                             //     if (result.Author != undefined) {
//                             //         if (result.Author.Id != undefined) {
//                             //             $.each(TaskUsers, function (index: any, users: any) {
//                             //                 if (result.Author.Id != undefined && users.AssingedToUser != undefined && result.Author.Id == users.AssingedToUser.Id) {
//                             //                     users.ItemCover = users.Item_x0020_Cover.Url;
//                             //                     result.CreatedDateImg.push(users);
//                             //                 }
//                             //             })
//                             //         }
//                             //     }
//                             //     result['SiteIcon'] = globalCommon.GetIconImageUrl(result.siteType, GlobalConstants.MAIN_SITE_URL + '/SP', undefined);
//                             //     if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
//                             //         map(result.Team_x0020_Members, (catego: any) => {
//                             //             result.ClientCategory.push(catego);
//                             //         })
//                             //     }
//                             //     if (result.Id === 498 || result.Id === 104)
//                             //         console.log(result);
//                             //     result['Shareweb_x0020_ID'] = globalCommon.getTaskId(result);
//                             //     if (result['Shareweb_x0020_ID'] == undefined) {
//                             //         result['Shareweb_x0020_ID'] = "";
//                             //     }
//                             //     result['Item_x0020_Type'] = 'Task';

//                             //     result.Portfolio_x0020_Type = 'Component';
//                             //     TasksItem.push(result);
//                             // })
//                             // let AllAcivities = $.grep(AllTasks, function (type: any) { return type.SharewebTaskType?.Title == 'Activities' });
//                             // if (AllAcivities != undefined && AllAcivities.length > 0) {
//                             //     AllAcivities.forEach((activ: any) => {
//                             //         if (activ.Id != undefined) {
//                             //             groupbyTasks(AllTasks, activ);
//                             //             AllTasks.forEach((obj: any) => {
//                             //                 if (obj.Id === activ.Id) {
//                             //                     obj.show = false;
//                             //                     obj.childs = activ.childs;
//                             //                     obj.childsLength = activ.childs.length;
//                             //                 }

//                             //             })
//                             //         }

//                             //     })

//                             // }
//                             // AllTasks = $.grep(AllTasks, function (type: any) { return type.tagged != true });
//                             // TasksItem = (AllTasks);
//                             // console.log(Response);
//                             // map(TasksItem, (task: any) => {
//                             //     if (!isItemExistsNew(CopyTaskData, task)) {
//                             //         CopyTaskData.push(task);
//                             //     }
//                             // })

//                             // // bindData();
//                             // makeFinalgrouping();
//                         }

//                     } catch (error) {
//                         console.log(error)
//                     }
//                 } else Counter++;

//             })
//         })
//     }
//     public render(): React.ReactElement<ITaskprofileProps> {
//         const {
//             description,
//             isDarkTheme,
//             environmentMessage,
//             hasTeamsContext,
//             userDisplayName
//           } = this.props;
//         return(
//             <div>'Test'</div>
//         )
//     }
// }