import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import { Web } from "sp-pnp-js";
import pnp, { PermissionKind } from "sp-pnp-js";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as moment from 'moment';
// import ComponentPortPolioPopup from '../../EditPopupFiles/ComponentPortfolioSelection';
// import LinkedComponent from '../../../globalComponents/EditTaskPopup/LinkedComponent';
import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
import { GlobalConstants } from '../../../globalComponents/LocalCommon';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Reference } from 'react-popper';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';
let AllMetadata: any = []
let siteConfig: any = []
let AssignedToUsers: any = []
let SitesTypes: any = []
let subCategories: any = []
let AllComponents: any = []
let taskUsers: any = [];
// let taskCreated = false;
let createdTask: any = {}
let QueryPortfolioId:any=null;
let loggedInUser: any;
let oldTaskIrl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx";
let Isapproval;
var ContextValue: any = {};
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
var AllListId: any = {}
let DirectTask=false;
function CreateTaskComponent(props: any) {
    let base_Url = props?.pageContext?._web?.absoluteUrl;
    const [editTaskPopupData, setEditTaskPopupData] = React.useState({
        isOpenEditPopup: false,
        passdata: null
    })
    const [linkedComponentData, setLinkedComponentData] = React.useState([]);
    const [siteType, setSiteType] = React.useState([])
    const [sendApproverMail, setSendApproverMail] = React.useState(false)
    const [TaskTypes, setTaskTypes] = React.useState([])
    const [subCategory, setsubCategory] = React.useState([])
    const [priorityRank, setpriorityRank] = React.useState([])
    const [openPortfolioType, setOpenPortfolioType] = React.useState("");
    const [sharewebCat, setSharewebCat] = React.useState([]);
    const [IsOpenPortfolio, setIsOpenPortfolio] = React.useState(false);
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [Timing, setTiming] = React.useState([])
    const [isActive, setIsActive] = React.useState({
        siteType: false,
        time: false,
        rank: false,
        dueDate: false,

    });
    const [relevantTasks, setRelevantTasks]: any = React.useState({
        ComponentRelevantTask: [],
        TaskUrlRelevantTask: [],
        PageRelevantTask: []
    });
    const [isActiveCategory, setIsActiveCategory] = React.useState(false);
    // const [isActiveCategory, setIsActiveCategory] = React.useState({});
    const [activeCategory, setActiveCategory] = React.useState([]);
    const [ShareWebComponent, setShareWebComponent] = React.useState('');
    const [refreshPage, setRefreshPage] = React.useState(false);
    const [burgerMenuTaskDetails, setBurgerMenuTaskDetails] = React.useState({
        ComponentID: undefined,
        Siteurl: undefined,
        TaskType: undefined
    });
    const [save, setSave] = React.useState({ siteType: '', linkedServices: [], recentClick: undefined, Mileage: '', DueDate: undefined, dueDate: '', taskCategory: '', taskCategoryParent: '', rank: undefined, Time: '', taskName: '', taskUrl: undefined, portfolioType: 'Component', Component: [] })
    React.useEffect(() => {
        ContextValue = props.SelectedProp;
        LoadTaskUsers();
        GetComponents();
        GetSmartMetadata();
    }, [])
    React.useEffect(() => {

        AllListId = {
            MasterTaskListID: props?.SelectedProp?.MasterTaskListID,
            TaskUsertListID: props?.SelectedProp?.TaskUsertListID,
            SmartMetadataListID: props?.SelectedProp?.SmartMetadataListID,
            //SiteTaskListID:this.props?.props?.SiteTaskListID,
            TaskTimeSheetListID: props?.SelectedProp?.TaskTimeSheetListID,
            DocumentsListID: props?.SelectedProp?.DocumentsListID,
            SmartInformationListID: props?.SelectedProp?.SmartInformationListID,
            siteUrl: props?.SelectedProp?.siteUrl,
            AdminConfigrationListID: props?.SelectedProp?.AdminConfigrationListID,
            isShowTimeEntry: isShowTimeEntry,
            isShowSiteCompostion: isShowSiteCompostion
        }
        try {
            isShowTimeEntry = props?.SelectedProp?.TimeEntry != "" ? JSON.parse(props?.SelectedProp?.TimeEntry) : "";
            isShowSiteCompostion = props?.SelectedProp?.SiteCompostion != "" ? JSON.parse(props?.SelectedProp?.SiteCompostion) : "";
            AllListId.isShowTimeEntry = isShowTimeEntry;
            AllListId.isShowSiteCompostion = isShowSiteCompostion;
            oldTaskIrl = `${AllListId.siteUrl}/SitePages/CreateTask-old.aspx`
        } catch (error: any) {
            console.log(error)
        }
        base_Url = AllListId?.siteUrl
        setRefreshPage(!refreshPage);
    }, [relevantTasks])

    const GetComponents = async () => {
        let web = new Web(base_Url);
        let componentDetails = [];
        componentDetails = await web.lists
            .getById(ContextValue.MasterTaskListID)
            //.getByTitle('Master Tasks')
            .items
            //.getById(this.state.itemID)
            .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "TaskCategories/Id", "TaskCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("TeamMembers", "Author", "ClientCategory", "Parent", "TaskCategories", "AssignedTo", "ClientCategory")
            .top(4999)
            .get()
        return componentDetails;
    }
    // const EditComponent = (item: any, title: any) => {
    //     setIsComponent(true);
    //     setShareWebComponent(item);
    // }
    const EditPortfolio = (item: any, Type: any) => {
        setIsOpenPortfolio(true);
        setOpenPortfolioType(Type)
        setShareWebComponent(item);
    }
    // const Call = (propsItems: any, type: any) => {
    //     setIsComponent(false);
    //     setIsServices(false);
    //     if (type === "SmartComponent") {
    //         if (propsItems?.smartComponent?.length > 0) {
    //             setSave({ ...save, Component: propsItems.smartComponent });
    //             setSmartComponentData(propsItems.smartComponent);
    //         }
    //     }
    //     if (type === "LinkedServices") {
    //         if (propsItems?.linkedComponent?.length > 0) {

    //             setLinkedComponentData(DataItem);
    //             setSmartComponentData([]);
    //             console.log("Popup component linkedComponent", DataItem);
    //         }
    //     }
    // };

    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
        // let saveItem = save;
        if (functionType == "Close") {
            setIsOpenPortfolio(false)
        } else {
            if (Type == "Service") {
                if (DataItem != undefined && DataItem.length > 0) {
                    // saveItem.linkedServices = DataItem;
                    // saveItem.portfolioType = "Service";
                    setSave(prevSave => ({
                        ...prevSave,
                        linkedServices: DataItem,
                        portfolioType: "Service"
                    }));
                    // setSave({ ...save, linkedServices: DataItem, portfolioType : "Service" });
                    setLinkedComponentData(DataItem);
                    // selectPortfolioType('Service')
                    console.log("Popup component services", DataItem);
                    setSmartComponentData([])
                }

            }
            if (Type == "Component") {
                if (DataItem != undefined && DataItem.length > 0) {
                    setSave(prevSave => ({
                        ...prevSave,
                        Component: DataItem,
                        portfolioType: "Component"
                    }));
                    // setSave({ ...save, Component: DataItem });
                    setSmartComponentData(DataItem);
                    // selectPortfolioType('Component');
                    setLinkedComponentData([]);
                    console.log("Popup component component ", DataItem)
                }

            }
            setIsOpenPortfolio(false)
        }
        // setSave(saveItem);
    }, [])
    const DueDate = (item: any) => {
        let date = new Date();
        let saveValue = save;
        let dueDate;
        if (isActive.dueDate) {
            saveValue.dueDate = item;
            if (item === "Today") {
                dueDate = date.toISOString();
            }
            if (item === "Tomorrow") {
                dueDate = date.setDate(date.getDate() + 1);
                dueDate = date.toISOString();
            }
            if (item === "ThisWeek") {
                date.setDate(date.getDate());
                var getdayitem = date.getDay();
                var dayscount = 7 - getdayitem
                date.setDate(date.getDate() + dayscount);
                dueDate = date.toISOString();
            }
            if (item === "NextWeek") {

                date.setDate(date.getDate() + 7);
                var getdayitem = date.getDay();
                var dayscount = 7 - getdayitem
                date.setDate(date.getDate() + dayscount);
                dueDate = date.toISOString();
            }
            if (item === "ThisMonth") {

                var year = date.getFullYear();
                var month = date.getMonth();
                var lastday = new Date(year, month + 1, 0);
                dueDate = lastday.toISOString();
            }
            if (item === undefined) {
                alert("Please select due date");
            }
        } else {
            saveValue.dueDate = '';
        }
        saveValue.DueDate = dueDate;
        setSave(saveValue);
    }
    const setTaskTime = (itemTitle: any) => {
        let saveValue = save;
        let Mileage;
        if (isActive.time) {
            saveValue.Time = itemTitle;
            if (itemTitle === 'Very Quick') {
                Mileage = '15'
            }
            if (itemTitle === 'Quick') {
                Mileage = '60'
            }
            if (itemTitle === 'Medium') {
                Mileage = '240'
            }
            if (itemTitle === 'Long') {
                Mileage = '480'
            }
        } else {
            saveValue.Time = '';
            Mileage = ''
        }
        saveValue.Mileage = Mileage;
        setSave(saveValue);
    }
    const fetchBurgerMenuDetails = async () => {
        AllComponents = await GetComponents();
        let setComponent: any = [];
        if (props?.projectId == undefined) {
            const params = new URLSearchParams(window.location.search);
            let BurgerMenuData = burgerMenuTaskDetails;

            let paramSiteUrl = params.get("Siteurl");
            let paramComponentId = params.get('ComponentID');
            let paramType = params.get('Type');
            let paramTaskType = params.get('TaskType');
            let paramServiceId = params.get('ServiceID');
            let previousTaggedTaskToComp: any[] = []
            if (paramComponentId == undefined && paramSiteUrl != undefined && paramType == undefined) {
                paramComponentId = "756";
                QueryPortfolioId='756';
            }
            else if (paramComponentId == undefined && paramServiceId == undefined && paramSiteUrl != undefined && paramType == 'Service') {
                paramServiceId = "4497";
                QueryPortfolioId='4497';
            }
            BurgerMenuData.ComponentID = paramComponentId;
            BurgerMenuData.Siteurl = paramSiteUrl;
            BurgerMenuData.TaskType = paramTaskType;
            setBurgerMenuTaskDetails(BurgerMenuData)
            let PageName = '';

            if (paramSiteUrl != undefined) {
                let baseUrl = window.location.href;
                
                PageName = paramSiteUrl?.split('aspx')[0].split("").reverse().join("").split('/')[0].split("").reverse().join("");
                PageName = PageName + 'aspx'
                // await loadRelevantTask(PageName, "PageTask")
                // await loadRelevantTask(paramSiteUrl, "UrlTask")
            }


            if (paramComponentId != undefined) {
                QueryPortfolioId=paramComponentId;
                AllComponents?.map((item: any) => {
                    if (item?.Id == paramComponentId) {
                        setComponent.push(item)
                        setSave((prev:any)=>({ ...prev, Component: setComponent }));
                        setSmartComponentData(setComponent);
                    }
                })

                if (paramTaskType == 'Bug') {
                    DirectTask=true;
                    subCategories?.map((item: any) => {
                        if (item.Title == "Bug") {
                            selectSubTaskCategory(item.Title, item.Id, item)
                        }
                    })
                    let saveValue = save;
                    let setTaskTitle = 'Bug - ' + setComponent[0]?.Title
                    saveValue.taskName = setTaskTitle;
                    saveValue.taskUrl = paramSiteUrl;
                    //  setTaskUrl(paramSiteUrl);
                    setSave(saveValue);
                    let e = {
                        target: {
                            value: paramSiteUrl
                        }
                    }
                    UrlPasteTitle(e);

                    createTask();
                } else if (paramTaskType == 'Design') {
                    DirectTask=true;
                    subCategories?.map((item: any) => {
                        if (item.Title == "Design") {
                            selectSubTaskCategory(item.Title, item.Id, item)
                        }
                    })
                    let saveValue = save;
                    let setTaskTitle = 'Design Task - ' + setComponent[0]?.Title
                    saveValue.taskName = setTaskTitle;
                    saveValue.taskUrl = paramSiteUrl;
                    //  setTaskUrl(paramSiteUrl);
                    setSave(saveValue);
                    let e = {
                        target: {
                            value: paramSiteUrl
                        }
                    }
                    UrlPasteTitle(e);

                    createTask();
                } else if (paramSiteUrl != undefined) {
                    let saveValue = save;
                    let setTaskTitle = 'Feedback - ' + setComponent[0]?.Title + ' ' + moment(new Date()).format('DD/MM/YYYY');
                    saveValue.taskName = setTaskTitle;
                    saveValue.taskUrl = paramSiteUrl;
                    //  setTaskUrl(paramSiteUrl);
                    setSave(saveValue);
                    let e = {
                        target: {
                            value: paramSiteUrl
                        }
                    }
                    UrlPasteTitle(e);
                    await loadRelevantTask(paramSiteUrl, "UrlTask")
                    await loadRelevantTask(PageName, "PageTask")
                }
                let Condition = "&$filter=Component/Id eq  '" + paramComponentId + "'"
                await loadRelevantTask(Condition, "ComponentId").then((response: any) => {
                    setRefreshPage(!refreshPage);
                })
            }
        } else if (props?.projectId != undefined && props?.projectItem != undefined) {
            AllComponents?.map((item: any) => {
                // if (item?.Id == props?.projectItem?.ComponentId[0]) {
                //     setComponent.push(item)
                //     setSave({ ...save, Component: setComponent });
                //     setSmartComponentData(setComponent);
                // }
                if (item?.Id == props?.createComponent?.portfolioData?.Id) {
                    if (props?.createComponent?.portfolioType === 'Component') {
                        selectPortfolioType('Component');
                        setComponent.push(item)
                        setSave((prev:any)=>({ ...prev, portfolioType: 'Component' }))
                        setSmartComponentData(setComponent);
                    }

                    if (props?.createComponent?.portfolioType === 'Service') {
                        selectPortfolioType('Service');
                        setComponent.push(item);
                        setSave((prev:any)=>({ ...prev, portfolioType: 'Service' }))
                        setLinkedComponentData(setComponent);
                    }
                }
            })
        }
    }
    const loadRelevantTask = async (Condition: any, type: any) => {
        let query = '';
        if (type == 'ComponentId') {
            query = "Categories,AssignedTo/Title,AssignedTo/Name,Component/Id,PriorityRank,TaskType/Id,TaskType/Title,Component/Title,Services/Id,Services/Title,AssignedTo/Id,AttachmentFiles/FileName,ComponentLink/Url,FileLeafRef,TaskLevel,TaskLevel,Title,Id,PriorityRank,PercentComplete,Company,WebpartId,StartDate,DueDate,Status,Body,WebpartId,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=AssignedTo,AttachmentFiles,TaskType,Component,Services,Author,Editor&$orderby=Modified desc" + Condition
        } else {
            query = "Categories,AssignedTo/Title,AssignedTo/Name,Component/Id,PriorityRank,TaskType/Id,TaskType/Title,Component/Title,Services/Id,Services/Title,AssignedTo/Id,AttachmentFiles/FileName,ComponentLink/Url,FileLeafRef,TaskLevel,TaskLevel,Title,Id,PriorityRank,PercentComplete,Company,WebpartId,StartDate,DueDate,Status,Body,WebpartId,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=AssignedTo,AttachmentFiles,TaskType,Component,Services,Author,Editor&$orderby=Modified desc"
        }
        let setRelTask = relevantTasks;
        try {
            let SiteTaskTaggedToComp: any[] = []
            let count = 0
            SitesTypes?.map(async (site: any) => {
                await globalCommon.getData(site?.siteUrl?.Url, site?.listId, query).then((data: any) => {
                    data?.map((item: any) => {

                        item.SiteIcon = site?.Item_x005F_x0020_Cover?.Url
                        item.siteType = site?.siteName;
                        item.TaskName = item.Title;
                        item.siteUrl = site?.siteUrl?.Url
                        item.listId = site?.listId
                        taskUsers?.map((user: any) => {
                            if (user?.AssingedToUser?.Id == item.Author.Id) {
                                item.AuthorCover = user?.Item_x0020_Cover?.Url
                            }
                            if (user?.AssingedToUser?.Id == item.Editor.Id) {
                                item.EditorCover = user?.Item_x0020_Cover?.Url
                            }

                        })
                        item.PercentComplete = item?.PercentComplete * 100;
                        item.Priority = item.PriorityRank * 1;
                        if (item.Categories == null)
                            item.Categories = '';
                        //type.Priority = type.Priority.split('')[1];
                        //type.Component = type.Component.results[0].Title,
                        item.ComponentTitle = '';
                        if (item?.Component?.length > 0) {
                            item.portfolio = item.Component[0];
                        }
                        if (item?.Services?.length > 0) {
                            item.portfolio = item.Services[0];
                        }
                        if (item?.Component?.results?.length > 0) {
                            item['Portfoliotype'] = 'Component';
                        }
                        if (item?.Services?.results?.length > 0) {
                            item['Portfoliotype'] = 'Service';
                        }
                        if (item?.Component?.results?.length > 0 && item?.Services?.results?.length > 0) {
                            item['Portfoliotype'] = 'Component';
                        }

                        item.TaskID = globalCommon.getTaskId(item);

                        item.DisplayDueDate = moment(item?.DueDate).format('DD/MM/YYYY');
                        if (item.DisplayDueDate == "Invalid date" || item.DisplayDueDate == undefined) {
                            item.DisplayDueDate = '';
                        }
                        item.CreateDate = moment(item?.Created).format('DD/MM/YYYY');
                        item.CreatedSearch = item.CreateDate + '' + item.Author;
                        item.bodys = item.Body != null && item.Body.split('<p><br></p>').join('');
                        item.DateModified = item.Modified;
                        item.ModifiedDate = moment(item?.Modified).format('DD/MM/YYYY');
                        item.ModifiedSearch = item.ModifiedDate + '' + item.Editor;
                        if (item.siteType != 'Offshore Tasks') {
                            try {
                                if (type == 'PageTask' || type == "UrlTask") {
                                    if (item?.ComponentLink?.Url.indexOf(Condition) > -1) {
                                        SiteTaskTaggedToComp.push(item);
                                    }
                                } else {
                                    SiteTaskTaggedToComp.push(item);
                                }

                            } catch (error) {
                                console.log(error.message)
                            }
                        }
                    })
                })
                count++;
                if (count == SitesTypes.length - 1) {
                    console.log("inside Set Task")
                    if (type == "ComponentId") {
                        setRelTask.ComponentRelevantTask = SiteTaskTaggedToComp;
                    }
                    if (type == "UrlTask") {
                        setRelTask.TaskUrlRelevantTask = SiteTaskTaggedToComp;
                    }
                    if (type == "PageTask") {
                        setRelTask.PageRelevantTask = SiteTaskTaggedToComp;
                    }
                    setRelevantTasks(setRelTask)
                    setSave({ ...save, recentClick: type })
                }
                // setRelevantTasks(setRelTask)

            })
        } catch (error) {
            console.log(error.message)
        }


    }
    const GetSmartMetadata = async () => {
        SitesTypes = [];
        subCategories = [];
        var TaskTypes: any = []
        var Priority: any = []
        var Timing: any = []
        var Task: any = []
        let web = new Web(base_Url);
        let MetaData = [];
        MetaData = await web.lists
            .getById(ContextValue.SmartMetadataListID)
            .items
            .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Parent/Id,Parent/Title,EncodedAbsUrl,IsVisible,Created,Item_x0020_Cover,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,AlternativeTitle")
            .top(4999)
            .expand('Author,Editor,Parent')
            .get();
        AllMetadata = MetaData;
        siteConfig = getSmartMetadataItemsByTaxType(AllMetadata, 'Sites')
        siteConfig?.map((site: any) => {
            if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== 'Health' && site.Title !== 'Gender') {
                SitesTypes.push(site);
            }
        })
        if (SitesTypes?.length == 1) {
            setActiveTile("siteType", "siteType", SitesTypes[0].Title)
            setSiteType(SitesTypes)
        } else {
            setSiteType(SitesTypes)
        }
        TaskTypes = getSmartMetadataItemsByTaxType(AllMetadata, 'Categories');
        Priority = getSmartMetadataItemsByTaxType(AllMetadata, 'Priority Rank');
        Timing = getSmartMetadataItemsByTaxType(AllMetadata, 'Timings');
        setTiming(Timing)
        setpriorityRank(Priority)


        TaskTypes?.map((task: any) => {
            if (task.ParentID !== undefined && task.ParentID === 0 && task.Title !== 'Phone') {
                Task.push(task);
                getChilds(task, TaskTypes);
            }
            if (task.ParentID !== undefined && task.ParentID !== 0 && task.IsVisible) {
                subCategories.push(task);
            }
        })
        Task?.map((taskItem: any) => {
            subCategories?.map((item: any) => {
                if (taskItem.Id === item.Parent.Id) {
                    try {
                        item.ActiveTile = false;
                        item.SubTaskActTile = item.Title.replace(/\s/g, "");
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
        })
        setsubCategory(subCategories);
        setTaskTypes(Task);
        await fetchBurgerMenuDetails();
    }

    let LoadTaskUsers = async () => {
        let AllTaskUsers: any = [];
        try {
            let web = new Web(props?.SelectedProp?.siteUrl);
            AllTaskUsers = await web.lists
                .getById(props?.SelectedProp?.TaskUsertListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,IsTaskNotifications,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
                .get();

            // let pageContent = await globalCommon.pageContext();
            // console.log(pageContent)
            taskUsers = AllTaskUsers;
            let UserIds;
            AllTaskUsers?.map((item: any) => {
                if (props?.pageContext?.user?.loginName == item.Email || props?.pageContext?.user?.loginName == item?.AssingedToUser?.EMail) {
                    loggedInUser = item;
                }
            })
            let CurrentUserId = loggedInUser?.AssingedToUserId;
            AllTaskUsers?.map((user: any) => {
                if (user.IsApprovalMail == 0)
                    user.IsApprovalMail = undefined;
                if (user.AssingedToUserId == CurrentUserId && (user.IsApprovalMail == undefined || user.IsApprovalMail == null || user.IsApprovalMail == '')) {
                    Isapproval = 'decide case by case';
                }
                if (user.AssingedToUserId == CurrentUserId && user.IsApprovalMail != undefined && user.IsApprovalMail != '' && user.IsApprovalMail != null && user.IsApprovalMail.toLowerCase() == 'approve all') {
                    Isapproval = 'approve all';
                }
                if (user.AssingedToUserId == CurrentUserId && user.IsApprovalMail != undefined && user.IsApprovalMail != '' && user.IsApprovalMail != null && user.IsApprovalMail.toLowerCase() == 'approve all but selected items') {
                    Isapproval = 'approve all but selected items';
                    user.SelectedCategoriesItems = []
                    if (user.CategoriesItemsJson != undefined && user.CategoriesItemsJson != null && user.CategoriesItemsJson != '') {
                        user.SelectedCategoriesItems = JSON.parse(user.CategoriesItemsJson);
                    }
                }
                if (user.AssingedToUserId == CurrentUserId && user.IsApprovalMail != undefined && user.IsApprovalMail != '' && user.IsApprovalMail != null && user.IsApprovalMail.toLowerCase() == 'decide case by case') {
                    Isapproval = 'decide case by case';
                }
            })
            taskUsers = AllTaskUsers;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems?.map((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });

        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        items?.map((childItem: any) => {
            if (childItem.ParentID !== undefined && parseInt(childItem.ParentID) === item.ID) {
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    }
    const savaData = () => {
        var data: any = {}
        data['taskName'] = save.taskName;
        data['taskUrl'] = save.taskUrl;
        data['siteType'] = save.siteType;
        data['taskCategory'] = save.taskCategory;
        data['taskCategoryParent'] = save.taskCategoryParent;
        data['priorityRank'] = save.rank;
        data['Time'] = save.Time;
        data['portfolioType'] = save.portfolioType;
        console.log(data)
    }
    let PageContent: any;
    const pageContext = async () => {
        try {
            PageContent = (await pnp.sp.site.getContextInfo());
        }
        catch (error) {
            return Promise.reject(error);
        }

        return PageContent;

    }
    pageContext();
    const createTask = async () => {
        let currentUserId = loggedInUser?.AssingedToUserId
        var AssignedToIds: any[] = [];
        let MailArrayTitle: any[] = [];
        let AssignedIds: any = [];
        let Tasks: any = []
        if (save.taskName.length <= 0) {
            alert("Please Enter The Task Name")
        } else if (save.siteType.length <= 0) {
            alert("Please Select the Site ")
        } else if (save.taskName.length > 56) {
            alert("Task Title is too long. Please chose a shorter name and enter the details into the task description.")
        }
        else {
            let CategoryTitle: any;
            let TeamMembersIds: any[] = [];
            sharewebCat?.map((cat: any) => {
                subCategories?.map((item: any) => {
                    if (cat === item.Id) {
                        if (CategoryTitle === undefined) {
                            CategoryTitle = item.Title + ';';
                        } else {
                            CategoryTitle += item.Title + ';';
                        }
                        MailArrayTitle.push(item)
                    }
                })

            })
            if (CategoryTitle !== undefined) {
                CategoryTitle.split(';')?.map((cat: any) => {
                    if (cat.toLowerCase() === 'design') {
                        taskUsers?.map((User: any) => {
                            if (User.Title === 'Design' && burgerMenuTaskDetails.TaskType != "Design" && TeamMembersIds.length === 0) {
                                TeamMembersIds.push(User.AssingedToUserId);
                            }
                            else if (User.Title === 'Design' && TeamMembersIds.length > 0) {
                                TeamMembersIds.map((workingMember: any) => {
                                    if (workingMember !== 48 && workingMember !== 49) {
                                        TeamMembersIds.push(User.AssingedToUserId);
                                    }
                                })
                            }
                        })
                    }
                })
            }

            AssignedToUsers?.map((user: any) => {
                AssignedToIds.push(user.AssingedToUserId);
            });
            if (TeamMembersIds.length > 0) {
                TeamMembersIds?.map((workingMember: any) => {
                    if (workingMember === 48 || workingMember === 49) {
                        AssignedToIds.push(workingMember);
                    }
                })
            }
            let RecipientMail: any = []
            if (MailArrayTitle != undefined && MailArrayTitle.length > 0) {
                RecipientMail = [];
                MailArrayTitle?.map((MailName: any) => {
                    if (MailName != 'Design') {
                        taskUsers?.map((User: any) => {
                            if (User.Title != undefined && MailName.Title != undefined && User.Title.toLowerCase().indexOf(MailName.Title.toLowerCase()) > -1 && User.ItemType != 'Group') {
                                RecipientMail.push(User);
                            }
                        });
                    }
                });
            }
            let selectedCC: any = [];
            let postClientTime: any;
            let siteCompositionDetails: any;
            try {
                let selectedComponent: any[] = [];
                let portfolioId :any =null;

                let CopyUrl;
                if (save.taskUrl != undefined && save.taskUrl.length > 255) {
                    CopyUrl = save.taskUrl
                    save.taskUrl = save.taskUrl.slice(0, 255)

                }
                let selectedSite: any;
                let priority: any;
                if (save.siteType !== undefined && save.siteType.length > 0) {
                    SitesTypes?.map((site: any) => {
                        if (site.Title === save.siteType) {
                            selectedSite = site;
                        }
                    })
                    if (smartComponentData?.length > 0) {
                        smartComponentData?.map((com: any) => {
                            if (smartComponentData !== undefined && smartComponentData.length >= 0) {
                                $.each(smartComponentData, function (index: any, smart: any) {
                                    selectedComponent.push(smart.Id);
                                    portfolioId=smart?.Id
                                    if (selectedSite?.Parent?.Title == "SDC Sites") {
                                        postClientTime = JSON.parse(smart?.Sitestagging);
                                        siteCompositionDetails = smart?.SiteCompositionSettings;
                                        smart?.ClientCategory?.map((cc: any) => {
                                            if (cc.Id != undefined) {
                                                selectedCC.push(cc.Id)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                    let selectedService: any[] = [];
                    if (linkedComponentData?.length > 0) {
                        linkedComponentData?.map((com: any) => {
                            if (linkedComponentData !== undefined && linkedComponentData.length >= 0) {
                                $.each(linkedComponentData, function (index: any, smart: any) {
                                    selectedService.push(smart.Id);
                                    portfolioId=smart?.Id
                                    if (selectedSite?.Parent?.Title == "SDC Sites") {
                                        postClientTime = JSON.parse(smart?.Sitestagging);
                                        siteCompositionDetails = smart?.SiteCompositionSettings;
                                        smart?.ClientCategory?.map((cc: any) => {
                                            if (cc.Id != undefined) {
                                                selectedCC.push(cc.Id)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                    if(DirectTask==true){
                        selectedComponent=[QueryPortfolioId];
                        portfolioId =QueryPortfolioId;
                    }
                    postClientTime?.map((items: any) => {
                        items.SiteName = items.Title
                    })
                    let priorityRank = 4;
                    if (save.rank === undefined || parseInt(save.rank) <= 0) {
                        setSave({ ...save, rank: 4 })
                        priority = '(2) Normal';
                    }
                    else {
                        priorityRank = parseInt(save.rank);
                        if (priorityRank >= 8 && priorityRank <= 10) {
                            priority = '(1) High';
                        }
                        if (priorityRank >= 4 && priorityRank <= 7) {
                            priority = '(2) Normal';
                        }
                        if (priorityRank >= 1 && priorityRank <= 3) {
                            priority = '(3) Low';
                        }
                    }

                    if (smartComponentData[0]?.Id != undefined) {

                        //var query = "SiteCompositionSettings,Sitestagging&$top=1&$filter=Id eq " + smartComponentData[0]?.Id;
                        //const web = new Web(PageContent?.SiteFullUrl + '/sp');
                        const web = new Web(PageContent?.WebFullUrl);
                        await web.lists.getById(ContextValue.MasterTaskListID).items.select("SiteCompositionSettings,Sitestagging").filter(`Id eq ${smartComponentData[0]?.Id}`).top(1).get().then((data: any) => {
                            Tasks = data[0];
                        });
                    }

                    //Latest code for Creating Task
                    if (burgerMenuTaskDetails.TaskType == "Design") {
                        AssignedToIds.push(40);
                        TeamMembersIds.push(40);
                        TeamMembersIds.push(49);
                    }
                    var newCopyUrl = CopyUrl != undefined ? CopyUrl : '';


                    var item = {
                        "Title": save.taskName,
                        "Priority": priority,
                        "Categories": CategoryTitle,
                        "DueDate": save.DueDate,
                        "Mileage": save.Mileage,
                        PercentComplete: 0,
                        ComponentId: { "results": (selectedComponent !== undefined && selectedComponent?.length > 0) ? selectedComponent : [] },
                        ServicesId: { "results": (selectedService !== undefined && selectedService?.length > 0) ? selectedService : [] },
                        ResponsibleTeamId: { "results": AssignedIds },
                        PortfolioId: portfolioId,
                        TeamMembersId: { "results": TeamMembersIds },
                        // SharewebComponentId: { "results": $scope.SharewebComponent },
                        SharewebCategoriesId: { "results": sharewebCat },
                        ClientCategoryId: { "results": selectedCC },
                        // LinkServiceTaskId: { "results": $scope.SaveServiceTaskItemId },
                        "PriorityRank": priorityRank,
                        SiteCompositionSettings: siteCompositionDetails != undefined ? siteCompositionDetails : '',
                        AssignedToId: { "results": AssignedToIds },
                        TaskTypeId:2,
                        SharewebTaskTypeId: 2,
                        ClientTime: postClientTime != undefined ? JSON.stringify(postClientTime) : '',
                        ComponentLink: {
                            __metadata: { 'type': 'SP.FieldUrlValue' },
                            Description: save.taskUrl?.length > 0 ? save.taskUrl : null,
                            Url: save.taskUrl?.length > 0 ? save.taskUrl : null,
                        },
                        ProjectId: props?.projectId != undefined ? props?.projectId : null
                    };
                    if (CategoryTitle?.toLowerCase().indexOf('approval') > -1)
                        item.PercentComplete = 0;
                    if (AssignedIds.length > 0) {
                        var ResponsibleTeam = AssignedIds;
                        if (!(CategoryTitle?.toLowerCase().indexOf('bug') > -1)) {
                            if (currentUserId == 23 || currentUserId == 41) {
                                ResponsibleTeam.push(14);
                            }
                            else if (currentUserId == 27 || currentUserId == 20 || currentUserId == 17 || currentUserId == 16 || currentUserId == 42 || currentUserId == 19 || currentUserId == 44 || currentUserId == 46 || currentUserId == 45 || currentUserId == 43 || currentUserId == 47 || currentUserId == 25 || currentUserId == 54 || currentUserId == 52 || currentUserId == 28 || currentUserId == 49 || currentUserId == 48 || currentUserId == 51 || currentUserId == 50 || currentUserId == 18) {
                                ResponsibleTeam.push(10);
                            }
                        }
                        item.ResponsibleTeamId = { "results": ResponsibleTeam }
                    }
                    else {
                        ResponsibleTeam = [];
                        if (!(CategoryTitle?.toLowerCase().indexOf('bug') > -1)) {
                            if (currentUserId == 23 || currentUserId == 41) {
                                ResponsibleTeam.push(14);
                            }
                            else if (currentUserId == 27 || currentUserId == 20 || currentUserId == 17 || currentUserId == 16 || currentUserId == 42 || currentUserId == 19 || currentUserId == 44 || currentUserId == 46 || currentUserId == 45 || currentUserId == 43 || currentUserId == 47 || currentUserId == 25 || currentUserId == 54 || currentUserId == 52 || currentUserId == 28 || currentUserId == 49 || currentUserId == 48 || currentUserId == 51 || currentUserId == 50 || currentUserId == 18) {
                                ResponsibleTeam.push(10);
                            }
                        }
                        item.ResponsibleTeamId = { "results": ResponsibleTeam }
                    }
                    // if (Tasks != undefined && save.siteType == 'Shareweb') {
                    //     item.SiteCompositionSettings = Tasks[0]?.SiteCompositionSettings!=undefined?Tasks[0]?.SiteCompositionSettings:Tasks?.SiteCompositionSettings;
                    //     item.ClientTime = Tasks[0]?.Sitestagging!=undefined?Tasks[0]?.Sitestagging:Tasks?.Sitestagging;
                    // }



                    //Code End

                    //Old itm Code 
                    // {
                    //     Title: save.taskName,
                    //     PriorityRank: priorityRank,
                    //     Priority: priority,
                    //     PercentComplete: 0,
                    //     ComponentLink: {
                    //         __metadata: { 'type': 'SP.FieldUrlValue' },
                    //         Description: save.taskUrl?.length > 0 ? save.taskUrl : null,
                    //         Url: save.taskUrl?.length > 0 ? save.taskUrl : null,
                    //     },
                    //     DueDate: save.DueDate,
                    //     ComponentId: { "results": (selectedComponent !== undefined && selectedComponent?.length > 0) ? selectedComponent : [] },
                    //     Mileage: save.Mileage,
                    //     ServicesId: { "results": (selectedService !== undefined && selectedService?.length > 0) ? selectedService : [] },
                    //     AssignedToId: { "results": AssignedToIds },
                    //     SharewebCategoriesId: { "results": sharewebCat },
                    //     TeamMembersId: { "results": TeamMembersIds },
                    // }
                    //Code End


                    let web = new Web(selectedSite?.siteUrl?.Url);
                    await web.lists.getById(selectedSite?.listId).items.add(item).then(async (data) => {
                        let newTitle = data?.data?.Title
                        let CreatedTaskID = data?.data?.Id
                        if (CategoryTitle?.indexOf('Immediate') > -1 || CategoryTitle?.indexOf("Email Notification") > -1) {
                            let listID = '3BBA0B9A-4A9F-4CE0-BC15-61F4F550D556'
                            var postData = {
                                __metadata: { 'type': 'SP.Data.ImmediateNotificationsListItem' },
                                "Title": newTitle,
                                "TaskId": CreatedTaskID.toString(),
                                "Site": save.siteType
                            };
                            await createTaskByListId(selectedSite?.siteUrl?.Url, listID, postData, save.siteType)
                            await sendImmediateEmailNotifications(data?.data?.Id, selectedSite?.siteUrl?.Url, selectedSite?.listId, data?.data, undefined, 'Immediate', undefined).then((response: any) => {
                                console.log(response);
                            });;
                        }
                        if (CategoryTitle?.indexOf('Immediate') < -1) {
                            setSendApproverMail(true);
                        }
                        if (CategoryTitle?.indexOf("Approval") > -1) {
                            setSendApproverMail(true);
                        }
                        if (RecipientMail?.length > 0) {
                            sendImmediateEmailNotifications(data?.data?.Id, selectedSite?.siteUrl?.Url, selectedSite?.listId, data?.data, RecipientMail, 'ApprovalMail', undefined).then((response: any) => {
                                console.log(response);
                            });
                        }
                        data.data.siteUrl = selectedSite?.siteUrl?.Url;
                        data.data.siteType = save.siteType;
                        data.data.listId = selectedSite?.listId;
                        // taskCreated = true;
                        createdTask.Id = data?.data?.Id
                        createdTask.siteType = save.siteType
                        data.data.SiteIcon = selectedSite?.Item_x005F_x0020_Cover?.Url;
                        createdTask.SiteIcon = selectedSite?.Item_x005F_x0020_Cover?.Url;
                        if (props?.projectId != undefined) {
                            EditPopup(data?.data)
                            props?.callBack
                        } else {
                            EditPopup(data?.data)
                        }
                    })
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    }

    const makePostDataForApprovalProcess = async (postData: any) => {
        var TaskUsers: any = taskUsers;
        if (TaskUsers?.length > 0) {
            var UserManager: any[] = [];
            TaskUsers.map((user: any) => {
                if (user?.Approver?.results?.length > 0) {
                    user.Approver.results.map((approver: any) => {
                        UserManager.push(approver?.Id)
                    })
                }
            })
            var Item = { TaskUsers: '', postData: '' };
            if ((postData?.Categories?.toLowerCase().indexOf('approval') > -1) && UserManager != undefined && UserManager?.length > 0) {
                //postData.PercentComplete = 0.01;
                //postData.Status = "For Approval";
                var isAvailable = false;
                if (postData?.ResponsibleTeamId?.results?.length > 0) {
                    postData.ResponsibleTeamId.results.map((user: any) => {
                        UserManager.map((ID: any) => {
                            if (ID == user) {
                                isAvailable = true;
                            }
                        })
                    })
                }
                if (!isAvailable) {
                    var TeamMembersID: any[] = [];
                    if (postData?.TeamMembersId?.results?.length > 0) {
                        postData.TeamMembersId.results((user: any) => {
                            UserManager.map((ID: any) => {
                                if (ID == user) {
                                    TeamMembersID.push(user);
                                }
                            })
                        })
                    }
                    UserManager.map((ID: any) => {
                        TeamMembersID.push(ID);
                    })
                    postData.TeamMembersId = { results: TeamMembersID };
                }
                if (postData?.AssignedToId?.results?.length > 0 && UserManager?.length > 0) {
                    UserManager.map((ID: any) => {
                        postData.AssignedToId.results.push(ID);
                    })
                }
                else {
                    postData.AssignedToId = { results: UserManager };
                }
            }
            Item.TaskUsers = TaskUsers;
            Item.postData = postData;
            Promise.resolve(Item);
        }
    }
    const addData = async (url: any, listId: any, item: any) => {
        const web = new Web(url);
        let result;
        try {
            result = (await web.lists.getById(listId).items.add(item));
        }
        catch (error) {
            return Promise.reject(error);
        }
        return result;
    }
    var createTaskByListId = async (siteUrl: any, listId: any, postData: any, siteName: any) => {

        var currentUserId = loggedInUser?.AssingedToUserId
        if (postData.Categories != undefined && (postData.Categories.toLowerCase().indexOf('approval') > -1)) {
            makePostDataForApprovalProcess(postData)
                .then(async (Data: any) => {
                    await addData(siteUrl, listId, Data.postData)
                        .then(function (response: any) {
                            response.d['Author'] = { Id: currentUserId };
                            Promise.resolve(response);
                        },
                            function (error: any) {
                                Promise.reject(error);
                            });
                },
                    function (error: any) {
                        Promise.reject(error);
                    });
        }
        else {
            await globalCommon.addData(siteUrl, listId, postData)
                .then(function (response) {
                    Promise.resolve(response);
                },
                    function (error) {
                        Promise.reject(error);
                    });
        }
        return Promise;
    };

    const UrlPasteTitle = (e: any) => {
        let TestUrl = e.target.value;
            let saveValue = save;
            saveValue.taskUrl = TestUrl;
            if (SitesTypes?.length > 1) {
                let selectedSiteTitle = ''
                var testarray = e.target.value.split('&');
                // TestUrl = $scope.ComponentLink;
                var item = '';
                if (TestUrl !== undefined) {
                    for (let index = 0; index < SitesTypes.length; index++) {
                        let site = SitesTypes[index];
                        if (TestUrl.toLowerCase().indexOf('.com') > -1)
                            TestUrl = TestUrl.split('.com')[1];
                        else if (TestUrl.toLowerCase().indexOf('.ch') > -1)
                            TestUrl = TestUrl.split('.ch')[1];
                        else if (TestUrl.toLowerCase().indexOf('.de') > -1)
                            TestUrl = TestUrl.split('.de')[1];

                        let Isfound = false;
                        if (TestUrl !== undefined && ((TestUrl.toLowerCase().indexOf('/' + site.Title.toLowerCase() + '/')) > -1 || (site.AlternativeTitle != null && (TestUrl.toLowerCase().indexOf(site.AlternativeTitle.toLowerCase())) > -1))) {
                            item = site.Title;
                            selectedSiteTitle = site.Title;
                            Isfound = true;
                        }

                        if (!Isfound) {
                            if (TestUrl !== undefined && site.AlternativeTitle != null) {
                                let sitesAlterNatives = site.AlternativeTitle.toLowerCase().split(';');
                                for (let j = 0; j < sitesAlterNatives.length; j++) {
                                    let element = sitesAlterNatives[j];
                                    if (TestUrl.toLowerCase().indexOf(element) > -1) {
                                        item = site.Title;
                                        selectedSiteTitle = site.Title;
                                        Isfound = true;
                                    }

                                }
                            }
                        }
                    }

                }

                saveValue.siteType = selectedSiteTitle;
                setSave(saveValue)
                if (selectedSiteTitle !== undefined) {
                    setIsActive({ ...isActive, siteType: true });
                }
                else {
                    setIsActive({ ...isActive, siteType: false });
                }
            }
        

    }

    const setActiveTile = (item: keyof typeof save, isActiveItem: keyof typeof isActive, title: any) => {

        let saveItem = save;
        let isActiveData = isActive;

        if (save[item] !== title) {
            saveItem[item] = title;
            setSave(saveItem);
            if (isActive[isActiveItem] !== true) {
                isActiveData[isActiveItem] = true;
                setIsActive(isActiveData);
            }
        } else if (save[item] === title) {
            saveItem[item] = '';
            setSave(saveItem);
            isActiveData[isActiveItem] = false;
            setIsActive(isActiveData);
        }
        if (item === "dueDate") {
            DueDate(title)
        }
        if (item === "Time") {
            setTaskTime(title)
        }
        setSave({ ...save, recentClick: isActiveItem })
    };

    const selectPortfolioType = (item: any) => {
        if (item === 'Component') {
            setSave({ ...save, portfolioType: 'Component' })
            // setSmartComponentData([])
        }
        if (item === 'Service') {
            setSave({ ...save, portfolioType: 'Service' })
            // setLinkedComponentData([])
        }
    }

    const selectSubTaskCategory = (title: any, Id: any, item: any) => {


        let activeCategoryArray = activeCategory;
        let TaskCategories: any[] = sharewebCat;
        if (item.ActiveTile) {
            item.ActiveTile = !item.ActiveTile;
            activeCategoryArray = activeCategoryArray.filter((category: any) => category !== title);
            TaskCategories = TaskCategories.filter((category: any) => category !== Id);

        } else if (!item.ActiveTile) {
            if (title === 'Email Notification' || title === 'Immediate' || title === 'Bug') {

                if (!isActive.rank) {
                    setActiveTile("rank", "rank", "10");
                }
                if (!isActive.dueDate) {
                    setActiveTile("dueDate", "dueDate", 'Today');
                }
            }
            if (title == 'Feedback' || title == 'Quality Control') {
                var flag = true;
                taskUsers?.map((User: any) => {
                    if (User.Role == 'QA') {
                        AssignedToUsers.filter((item: any) => item.Id != User.Id)
                        AssignedToUsers.push(User);
                        flag = false;
                    }
                });
            }
            if (title?.indexOf('Design') > -1) {
                var flag = true;
                taskUsers?.map((User: any) => {
                    if (User.Role == 'Developer' && User.Title == 'Design Team') {
                        AssignedToUsers.filter((item: any) => item.Id != User.Id)
                        AssignedToUsers.push(User);
                        flag = false;
                    }
                });
            }
            if (title?.indexOf('Support') > -1) {
                var flag = true;
                taskUsers?.map((User: any) => {
                    if (User.Role == 'Developer' && User.Title == 'Support') {
                        AssignedToUsers.filter((item: any) => item.Id != User.Id)
                        AssignedToUsers.push(User);
                        flag = false;
                    }
                });
            }
            item.ActiveTile = !item.ActiveTile;
            activeCategoryArray.push(title);
            TaskCategories.push(Id)
        }
        setIsActiveCategory(!isActiveCategory)
        setActiveCategory(activeCategoryArray)
        setSharewebCat(TaskCategories)

    }


    const inlineCallBack = React.useCallback((item: any) => {

    }, []);
    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row }) => (
                  <span>
                    <img className='circularImage rounded-circle' title={row?.original?.siteType} src={row?.original?.SiteIcon} />
                  </span>
                ),
                id: "Site",
                placeholder: "Site",
                header: "",
                resetSorting: false,
                resetColumnFilters: false,
                size: 50
              },
            {
                accessorKey: "TaskID",
                placeholder: "Task Id",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 70,
                cell: ({ row, getValue }) => (
                    <>
                        <span className="d-flex">
                            {row?.original?.TaskID}
                        </span>
                    </>
                ),
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <>
                        <span className='d-flex'>
                            {row.original.Services.length >= 1 ? (
                                <a
                                    className="hreflink text-success"
                                    href={`${props?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                    data-interception="off"
                                    target="_blank"
                                >
                                    {row?.original?.Title}
                                </a>
                            ) : (
                                <a
                                    className="hreflink"
                                    href={`${props?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                    data-interception="off"
                                    target="_blank"
                                >
                                    {row?.original?.Title}
                                </a>
                            )}
                            {row?.original?.Body !== null && row?.original?.Body != undefined ? <InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} /> : ''}
                        </span>
                    </>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.Portfolio,
                cell: ({ row }) => (
                    <span>
                        {row.original.Services.length >= 1 ? (
                            <a
                                className="hreflink text-success"
                                data-interception="off"
                                target="blank"
                                href={`${props?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
                            >
                                {row?.original?.portfolio?.Title}
                            </a>
                        ) : (
                            <a
                                className="hreflink"
                                data-interception="off"
                                target="blank"
                                href={`${props?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
                            >
                                {row?.original?.portfolio?.Title}
                            </a>
                        )}
                    </span>
                ),
                id: "Portfolio",
                placeholder: "Portfolio",
                resetColumnFilters: false,
                resetSorting: false,
                header: ""
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns
                            AllListId={AllListId}
                            type='Task'
                            callBack={inlineCallBack}
                            columnName='Priority'
                            item={row?.original}
                            TaskUsers={taskUsers}
                            pageName={'ProjectManagment'}
                        />
                    </span>
                ),
                placeholder: "Priority",
                id: 'Priority',
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 75
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={inlineCallBack}
                        columnName='DueDate'
                        item={row?.original}
                        TaskUsers={taskUsers}
                        pageName={'ProjectManagment'}
                    />
                ),
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Due Date",
                header: "",
                size: 80
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "descriptionsSearch",
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "commentsSearch",
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns
                            AllListId={AllListId}
                            callBack={inlineCallBack}
                            columnName='PercentComplete'
                            item={row?.original}
                            TaskUsers={taskUsers}
                            pageName={'ProjectManagment'}
                        />
                    </span>
                ),
                id: 'PercentComplete',
                placeholder: "% Complete",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 55
            },
            {
                accessorFn: (row) => row?.CreatedSearch,
                cell: ({ row }) => (
                    <span>
                        {row.original.Services.length >= 1 ? (
                            <span className='ms-1 text-success'>{row?.original?.CreateDate} </span>
                        ) : (
                            <span className='ms-1'>{row?.original?.CreateDate} </span>
                        )}

                        {row?.original?.AuthorCover != undefined ? (
                            <>
                                <a
                                    href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                    target="_blank"
                                    data-interception="off"
                                >
                                    <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.AuthorCover} />
                                </a>
                            </>
                        ) : (
                            <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                        )}
                    </span>
                ),
                id: 'Created',
                canSort: false,
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                header: "",
                size: 125
            },
            {
                accessorFn: (row) => row?.ModifiedSearch,
                cell: ({ row }) => (
                    <span>
                        {row.original.Services.length >= 1 ? (
                            <span className='ms-1 text-success'>{row?.original?.ModifiedDate} </span>
                        ) : (
                            <span className='ms-1'>{row?.original?.ModifiedDate} </span>
                        )}

                        {row?.original?.EditorCover != undefined ? (
                            <>
                                <a
                                    href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Editor?.Id}&Name=${row?.original?.Editor?.Title}`}
                                    target="_blank"
                                    data-interception="off"
                                >
                                    <img title={row?.original?.Editor?.Title} className="workmember ms-1" src={row?.original?.EditorCover} />
                                </a>
                            </>
                        ) : (
                            <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Editor?.Title}></span>
                        )}
                    </span>
                ),
                id: 'Modified',
                canSort: false,
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Modified",
                header: "",
                size: 125
            },
            {
                cell: ({ row }) => (
                    <span className='d-flex'>
                        <span
                            title='Edit Task'
                            onClick={() => EditPopup(row?.original)}
                            className='svg__iconbox svg__icon--edit hreflink'
                        ></span>
                    </span>
                ),
                id: 'Actions',
                accessorKey: "",
                canSort: false,
                resetSorting: false,
                resetColumnFilters: false,
                placeholder: "",
                size: 35
            },
        ],
        []
    );
    // const columns: GridColDef[] = [
    //     { field: 'siteType', headerName: 'Site', width: 60, renderCell: (params) => <img className="client-icons" src={params?.row?.siteCover} /> },
    //     { field: 'TaskID', headerName: 'Task Id', width: 75 },
    //     {
    //         field: 'Title', headerName: 'Title', width: 300, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     <span><a data-interception="off" target="blank" href={`${base_Url}/SitePages/Task-Profile.aspx?taskId=${params?.row?.Id}&Site=${params?.row?.siteType}`}>{params?.row?.Title}</a></span>
    //                 </div>
    //             )
    //         }
    //     },
    //     {
    //         field: 'ComponentTitle', headerName: 'Component', width: 150, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     <span><a data-interception="off" target="blank" href={`${base_Url}/SitePages/Portfolio-Profile.aspx?taskId=${params?.row?.newComponentId}`}>{params?.row?.ComponentTitle}</a></span>
    //                 </div>
    //             )
    //         }
    //     },
    //     {
    //         field: 'PercentComplete', headerName: '% Complete', width: 100, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     <span>{params?.row?.PercentComplete}%</span>
    //                 </div>
    //             )
    //         }
    //     },
    //     { field: 'Priority', headerName: 'Priority', width: 80 },
    //     { field: 'Categories', headerName: 'Categories', width: 120 },

    //     { field: 'TaskDueDate', headerName: 'Due Date', width: 115 },
    //     {
    //         field: 'Created', headerName: 'Created', width: 120, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     {params?.row?.AuthorCover != undefined ? <img className="client-icons" title={params?.row?.Author} src={params?.row?.AuthorCover} alt='' /> : ''}

    //                     {params.row.CreateDate}
    //                 </div>
    //             )
    //         }
    //     },
    //     {
    //         field: 'Modified', headerName: 'Modified', width: 120, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     {params?.row?.EditorCover != undefined ? <img className="client-icons" title={params?.row?.Editor} src={params?.row?.EditorCover} alt='' /> : ''}

    //                     {params.row.ModifiedDate}
    //                 </div>
    //             )
    //         }
    //     },
    //     {
    //         field: '', headerName: '', width: 40, renderCell: (params) => {
    //             return (
    //                 <div>
    //                     <span onClick={() => EditPopup(params?.row)} className="svg__iconbox svg__icon--edit"></span>
    //                     {/* <img onClick={() => EditPopup(params?.row)} src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"></img> */}
    //                 </div>
    //             )
    //         }
    //     },
    // ];
    const CallBack = React.useCallback((items) => {
        setEditTaskPopupData({
            isOpenEditPopup: false,
            passdata: null
        })
        if (items) {
            window.open(base_Url + "/SitePages/Task-Profile.aspx?taskId=" + createdTask?.Id + "&Site=" + createdTask?.siteType, "_self")
            createdTask = {};
        } else {
            location.reload();
        }

    }, [])
    const EditPopup = React.useCallback((item: any) => {
        setEditTaskPopupData({
            isOpenEditPopup: true,
            passdata: item
        })
    }, [])

    // Approver Category Email 
    const SendEmailFinal = async (to: any, subject: any, body: any) => {
        let sp = spfi().using(spSPFx(props?.SelectedProp?.Context));
        sp.utility.sendEmail({
            //Body of Email  
            Body: body,
            //Subject of Email  
            Subject: subject,
            //Array of string for To of Email  
            To: to,
            AdditionalHeaders: {
                "content-type": "text/html"
            },
        }).then(() => {
            console.log("Email Sent!");

        }).catch((err) => {
            console.log(err.message);
        });
    }
    const getData = async (url: any, listId: any, query: any) => {
        const web = new Web(url);
        let result;
        try {
            result = (await web.lists.getById(listId).items.select(query).getAll());
        }
        catch (error) {
            return Promise.reject(error);
        }

        return result;

    }
    const sendImmediateEmailNotifications = async (itemId: any, siteUrl: any, listId: any, item: any, RecipientMail: any, isLoadNotification: any, rootSite: any) => {
        await GetImmediateTaskNotificationEmails(item, isLoadNotification, rootSite)
            .then(async (ToEmails: any) => {
                try {
                    if (isLoadNotification == false)
                        ToEmails = [];
                    if (RecipientMail?.Email != undefined && ToEmails?.length == 0) {
                        ToEmails.push(RecipientMail.Email)
                    }
                    if (ToEmails.length > 0) {
                        var query = '';
                        query += "AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,Component/Id,Component/Title,Component/ItemType,ComponentLink,Categories,FeedBack,ComponentLink,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,Services/Id,Services/Title,Events/Id,Events/Title,TaskType/Id,TaskType/Title,TaskID,CompletedDate,TaskLevel,TaskLevel&$expand=AssignedTo,Component,AttachmentFiles,Author,Editor,TaskCategories,TaskType,Services,Events&$filter=Id eq " + itemId;
                        await getData(siteUrl, listId, query)
                            .then(async (data: any) => {
                                data?.map((item: any) => {
                                    item.PercentageCompleted = item?.PercentComplete < 1 ? item?.PercentComplete * 100 : item?.PercentComplete;
                                    item.PercentComplete = item?.PercentComplete < 1 ? item?.PercentComplete * 100 : item?.PercentComplete;
                                    if (item.PercentageCompleted != undefined) {
                                        item.PercentageCompleted = parseInt((item?.PercentageCompleted).toFixed(0));
                                    }
                                    if (item.PercentComplete != undefined) {
                                        item.PercentComplete = parseInt((item?.PercentComplete).toFixed(0));
                                    }
                                    item.taskLeader = 'None';
                                    if (item?.AssignedTo?.length > 0)
                                        item.taskLeader = globalCommon.getMultiUserValues(item);

                                    if (item?.PercentComplete != undefined) {
                                        item.PercentComplete = item.PercentComplete < 1 ? item.PercentComplete * 100 : item.PercentComplete;
                                        item.PercentComplete = parseInt((item.PercentComplete).toFixed(0));

                                        item.PercentageCompleted = item.PercentComplete;
                                    }
                                    if (item?.siteType != undefined) {
                                        item.siteType = item.siteType.replace(/_x0020_/g, ' ');
                                    }
                                })

                                var UpdateItem = data[0];
                                var siteType = save.siteType;
                                UpdateItem.siteType = '';
                                if (UpdateItem.siteType == '') {
                                    if (siteType != undefined) {
                                        siteType = siteType.replace(/_x0020_/g, '%20');
                                    }
                                    UpdateItem.siteType = siteType;
                                }
                                UpdateItem.TaskID = globalCommon.getTaskId(UpdateItem);
                                if (UpdateItem?.Author != undefined) {
                                    UpdateItem.Author1 = '';
                                    UpdateItem.Author1 = UpdateItem.Author.Title;
                                } else
                                    UpdateItem.Editor1 = '';
                                if (UpdateItem?.Editor != undefined) {
                                    UpdateItem.Editor1 = '';
                                    UpdateItem.Editor1 = UpdateItem.Editor.Title;
                                } else
                                    UpdateItem.Editor1 = '';
                                if (UpdateItem?.ComponentLink?.Url != undefined)
                                    UpdateItem.URL = UpdateItem?.ComponentLink?.Url;
                                else
                                    UpdateItem.URL = '';

                                if (UpdateItem?.DueDate != undefined)
                                    UpdateItem.DueDate = moment(new Date(UpdateItem.DueDate)).format('DD/MM/YYYY')
                                else
                                    UpdateItem.DueDate = '';
                                if (UpdateItem?.StartDate != undefined)
                                    UpdateItem.StartDate = moment(new Date(UpdateItem.StartDate)).format('DD/MM/YYYY')
                                else
                                    UpdateItem.StartDate = '';
                                if (UpdateItem?.CompletedDate != undefined)
                                    UpdateItem.CompletedDate = moment(new Date(UpdateItem.CompletedDate)).format('DD/MM/YYYY')
                                else
                                    UpdateItem.CompletedDate = '';

                                if (UpdateItem?.Created != undefined)
                                    UpdateItem.Created = moment(new Date(UpdateItem.Created)).format('DD/MM/YYYY')
                                else
                                    UpdateItem.Created = '';
                                if (UpdateItem?.Modified != undefined)
                                    UpdateItem.Modified = moment(new Date(UpdateItem.Modified)).format('DD/MM/YYYY')
                                else
                                    UpdateItem.Modified = '';
                                if (UpdateItem?.PercentComplete != undefined)
                                    UpdateItem.PercentComplete = UpdateItem.PercentComplete;
                                else
                                    UpdateItem.PercentComplete = '';
                                if (UpdateItem?.Priority != undefined)
                                    UpdateItem.Priority = UpdateItem.Priority;
                                else
                                    UpdateItem.Priority = '';
                                if (UpdateItem?.Body != undefined)
                                    UpdateItem.Body = $.parseHTML(UpdateItem.Body)[0]?.textContent;
                                else
                                    UpdateItem.Body = '';
                                if (UpdateItem?.Title != undefined)
                                    UpdateItem.Title = UpdateItem.Title;
                                else
                                    UpdateItem.Title = '';
                                UpdateItem.AssignedToTitle = '';
                                if (UpdateItem?.AssignedTo != undefined) {
                                    UpdateItem.AssignedTo.map((item: any) => {
                                        UpdateItem.AssignedToTitle += item.Title + ';';
                                    })
                                }
                                UpdateItem.ComponentName = '';
                                if (UpdateItem?.Component != undefined) {
                                    UpdateItem.Component.map((item: any) => {
                                        UpdateItem.ComponentName += item.Title + ';';
                                    })
                                }
                                UpdateItem.Category = '';
                                UpdateItem.Categories = '';
                                if (UpdateItem?.TaskCategories != undefined) {
                                    UpdateItem.TaskCategories.map((item: any) => {
                                        UpdateItem.Categories += item.Title + ';';
                                        UpdateItem.Category += item.Title + ',';
                                    })
                                }
                                var pos = UpdateItem?.Category?.lastIndexOf(',');
                                UpdateItem.Category = UpdateItem?.Category?.substring(0, pos) + UpdateItem?.Category?.substring(pos + 1);
                                var Commentdata = [];
                                UpdateItem.AllComments = '';
                                if (UpdateItem?.Comments != undefined) {
                                    Commentdata = JSON.parse(UpdateItem.Comments);
                                    Commentdata.map((comment: any) => {
                                        UpdateItem.AllComments += '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                            '<span>' +
                                            '<div style="margin-bottom:5px;">' +
                                            comment?.AuthorName +
                                            ' - ' +
                                            comment?.Created +
                                            '</div>' +
                                            comment?.Title +
                                            '</span>' +
                                            '</div>'
                                    })
                                }
                                UpdateItem.Description = '';
                                if (UpdateItem?.Body != undefined && UpdateItem?.Body != '')
                                    UpdateItem.Description = UpdateItem.Body;
                                if (UpdateItem?.FeedBack != undefined) {
                                    try {
                                        var Description = JSON.parse(UpdateItem?.FeedBack);
                                        if (Description?.length > 0) {
                                            UpdateItem.Description = '';
                                            Description[0]?.FeedBackDescriptions?.map((description: any, index: any) => {
                                                var index1 = index + 1;
                                                var Comment = '';
                                                if (description?.Comments?.length > 0) {
                                                    description.Comments.map((val: any) => {
                                                        Comment += '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                                            '<span>' +
                                                            '<div style="margin-bottom:5px;">' +
                                                            val?.AuthorName +
                                                            ' - ' +
                                                            val?.Created +
                                                            '</div>' +
                                                            val?.Title +
                                                            '</span>' +
                                                            '</div>'

                                                    })

                                                }
                                                UpdateItem.Description += '<tr><td colspan="1" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;font-size: 13px;flex-basis: 27px !important;border: 1px solid #ccc;"><span>' + index1 + '</span>' +
                                                    '</td>' +
                                                    '<td colspan="11" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' +
                                                    '<span>' +
                                                    description?.Title +
                                                    '</span>' +
                                                    Comment +
                                                    '</td>' +
                                                    '</tr>';
                                                if (description?.Subtext?.length > 0) {
                                                    description.Subtext.map((Childdescription: any, Childindex: any) => {
                                                        var Childindex1 = Childindex + 1;
                                                        var ChildComment = '';
                                                        if (Childdescription?.Comments?.length > 0) {
                                                            description.Comments.map((Childval: any) => {
                                                                ChildComment += '<div colspan="6" style="padding: 9px;border: 1px solid #ccc;background: #fbfbfb;color: #000;margin-top:5px;">' +
                                                                    '<span>' +
                                                                    '<div style="margin-bottom:5px;">' +
                                                                    Childval?.AuthorName +
                                                                    ' - ' +
                                                                    Childval?.Created +
                                                                    '</div>' +
                                                                    Childval?.Title +
                                                                    '</span>' +
                                                                    '</div>'

                                                            })

                                                        }
                                                        UpdateItem.Description += '<tr><td colspan="1" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;font-size: 13px;flex-basis: 27px !important;border: 1px solid #ccc;"><span>' + index1 + '.' + Childindex1 + '</span>' +
                                                            '</td>' +
                                                            '<td colspan="11" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' +
                                                            '<span>' +
                                                            Childdescription?.Title +
                                                            '</span>' +
                                                            ChildComment +
                                                            '</td>' +
                                                            '</tr>';
                                                    });

                                                }
                                            });
                                        }
                                        //$scope.AdditionalTimeSpent.push(item.AdditionalTime[0]);
                                    } catch (e) {
                                        console.log(e)
                                    }

                                }
                                let pageContent = await pageContext()
                                var siteUrl = pageContent?.SiteFullUrl + '/sp';
                                var Name = '';
                                var OtherDetails = '';
                                let Subject: any = '';
                                var TaskDescriptionStart = '';
                                var NoOfApprovalTask = '';
                                var TaskDescription = '';
                                var ApprovalRejectionComments = '';
                                var TaskComments = '';
                                var TaskDashBoardURl = '';
                                var ApprovalDashboard = '';
                                var TaskDashBoardTitle = '';
                                var ApprovalDashboardTitle = '';
                                var CC: any[] = [];
                                if (item == undefined) {
                                    //Subject = "[" + siteType + "-Task] " + UpdateItem.Title + "(" + UpdateItem.Category + ")";
                                    Subject = "[" + siteType + " - " + UpdateItem?.Category + " (" + UpdateItem?.PercentComplete + "%)] " + UpdateItem?.Title + "";
                                }

                                if (Subject == undefined || Subject == '') {
                                    if (UpdateItem?.PercentComplete != undefined && UpdateItem?.PercentComplete != '' && UpdateItem?.PercentComplete != 1 && UpdateItem?.Category != undefined && UpdateItem?.Category != '' && UpdateItem?.Category.toLowerCase('approval') > -1)
                                        item.CategoriesType = item?.Category?.replace('Approval,', '')
                                    Subject = "[" + siteType + " - " + UpdateItem?.Category + " (" + UpdateItem?.PercentComplete + "%)] " + UpdateItem?.Title + "";
                                }
                                if (UpdateItem?.PercentComplete != 1) {
                                    Subject = Subject?.replaceAll('Approval,', '')
                                    Subject = Subject?.replaceAll('Normal Approval,', '')
                                    Subject = Subject?.replaceAll('Normal Approval', '')
                                    Subject = Subject?.replaceAll('Quick Approval,', '')
                                    Subject = Subject?.replaceAll('Quick Approval', '')
                                    Subject = Subject?.replaceAll('Complex Approval,', '')
                                    Subject = Subject?.replaceAll('Complex Approval', '')
                                    Subject = Subject?.replaceAll(',,', ',')
                                }
                                if (UpdateItem?.PercentComplete == 1 && UpdateItem?.Category?.toLowerCase()?.indexOf('approval') > -1) {
                                    //Subject = Subject.replaceAll('Approval,', '')
                                    //if (Subject.indexOf('Normal Approval') <= -1 && Subject.indexOf('Quick Approval') <= -1 && Subject.indexOf('Complex Approval') <= -1)
                                    //    Subject = Subject.replaceAll('Approval', '')
                                    //Subject = Subject.replaceAll(',,', ',')
                                    Subject = "[" + siteType + " - " + "Approval" + "] " + UpdateItem?.Title + "";
                                    if (UpdateItem?.Category?.toLowerCase()?.indexOf('email notification') > -1 && UpdateItem?.Category?.toLowerCase().indexOf('immediate') > -1) {
                                        Subject = "[" + siteType + " - " + "Approval,Email notification,Immediate" + "] " + UpdateItem?.Title + "";
                                    }
                                    else if (UpdateItem?.Category?.toLowerCase()?.indexOf('email notification') > -1) {
                                        Subject = "[" + siteType + " - " + "Approval,Email notification" + "] " + UpdateItem?.Title + "";
                                    }
                                    else if (UpdateItem?.Category?.toLowerCase()?.indexOf('immediate') > -1) {
                                        Subject = "[" + siteType + " - " + "Approval,Immediate" + "] " + UpdateItem?.Title + "";
                                    }
                                }
                                var body =
                                    '<div>' +
                                    '</div>' +
                                    '<div style="margin-top:4px">' +
                                    TaskDescriptionStart +
                                    '</div>' +
                                    '<div style="margin-top:6px">' +
                                    TaskDescription +
                                    '</div>'
                                    + '<div style="margin-top:10px">' +
                                    NoOfApprovalTask +
                                    '</div>'
                                    + '<div style="margin-top:10px;">' +
                                    '<a style="padding-right: 17px;" href =' + TaskDashBoardURl + '>' + TaskDashBoardTitle + '</a>' +
                                    '<a href =' + ApprovalDashboard + '>' + ApprovalDashboardTitle + '</a>' +
                                    '</div>'
                                    + '<div style="margin-top:15px">' +
                                    '<a href =' + siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + UpdateItem?.Id + '&Site=' + siteType + '>' +
                                    UpdateItem?.Title + '</a>' +
                                    '</div>' +
                                    '<table style="width:100%">' +
                                    '<tbody>' +
                                    '<td style="width:70%;vertical-align: top;">' +
                                    '<table style="width:99%;">' +
                                    '<tbody>' +
                                    '<tr>'
                                    + '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Task Id:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.TaskID + '</span></td>' +
                                    '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Component:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.ComponentName + '</span> </td>' +
                                    '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Priority:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.Priority + '</span> </td>' +
                                    '</tr>' +
                                    '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Start Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.StartDate + '</span></td>' +
                                    '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Completion Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.CompletedDate + '</span> </td>' +
                                    '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Due Date:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.DueDate + '</span> </td>' +
                                    '</tr>' +
                                    '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Team Members:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.AssignedToTitle + '</span></td>' +
                                    '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created By:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.Author1 + '</span> </td>' +
                                    '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Created:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.Created + '</span> </td>' +
                                    '</tr>' +
                                    '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Categories:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.Categories + '</span></td>' +
                                    '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">Status:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.Status + '</span> </td>' +
                                    '<td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">% Complete:</b></td><td colspan="2" style="border: 1px solid #ccc;background: #fafafa;"> <span style="font-size: 13px; margin-left:13px" >' +
                                    UpdateItem?.PercentComplete + '%</span> </td>' +
                                    '</tr>' +
                                    '<tr><td style="border: 1px solid #ccc;background: #f4f4f4;"><b style="font-size: 13px;">URL:</b> </td><td colspan="7" style="border: 1px solid #ccc;background: #fafafa;"><span style="font-size: 13px; margin-left:13px">' +
                                    UpdateItem?.URL + '</span> </td>' +
                                    '</tr>' +
                                    ApprovalRejectionComments +
                                    '</tr> ' +
                                    '</tr>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '<table style="width:99%;margin-top: 10px;">' +
                                    '<tbody>' +
                                    '<tr>' + UpdateItem?.Description + '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '</td>' +
                                    '<td style="width:22%">' +
                                    '<table style="border:1px solid #ddd;border-radius:4px;margin-bottom:25%;width:100%">' +
                                    '<tbody>' +
                                    '<tr>' +
                                    '<td style="color:#333; background-color:#f5f5f5;border-bottom:1px solid #ddd">Comments:' + '</td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td>' + UpdateItem?.AllComments + '</td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '</td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '</td>' +
                                    '</tr>' +
                                    '</tbody>' +
                                    '</table>';
                                if (CC.length > 1)
                                    CC.splice(1, 1);
                                //'<tr><td colspan="7" style="background: #f4f4f4;text - align: left;padding: 10px 5px 10px 5px;color: #6F6F6F;font - family: arial;font - size: 14px;font - weight: bold;border - bottom: 2px solid #fff;border - right: 2px solid #fff;background-color: #fbfbfb;flex-basis: 100%;background-color: #fff;font-weight: normal;font-size: 13px;color: #000;margin-left: 2px;border: 1px solid #ccc;">' + UpdateItem.Description + '</td></tr>' +
                                if (RecipientMail?.length > 0) {
                                    if (ToEmails == undefined) {
                                        ToEmails = [];
                                    }
                                    RecipientMail.map((mail: any) => {
                                        ToEmails.push(mail.Email);
                                    })

                                }
                                var from = '',
                                    to = ToEmails,
                                    cc = CC,
                                    body = body,
                                    subject = Subject,
                                    ReplyTo = "deepak@hochhuth-consulting.de";
                                // sendEmail(from, to, body, subject, ReplyTo, cc);
                                SendEmailFinal(to, subject, body)
                            }, function (error) {
                                console.log(error);
                            })
                    }
                } catch (error) {
                    console.log(error)
                }
            },

                function (error) { });
    }
    const GetImmediateTaskNotificationEmails = async (item: any, isLoadNotification: any, rootsite: any) => {
        let pageContent = await pageContext()
        var isLoadNotification = isLoadNotification;
        var CurrentItem = item;
        var Allmail: any[] = [];
        try {
            if (taskUsers?.length > 0) {
                var Allusers = taskUsers
                if (item != undefined && isLoadNotification != undefined && isLoadNotification != '' && isLoadNotification == 'ApprovalMail') {
                    Allusers.map((user: any) => {
                        if (CurrentItem?.AuthorId == user?.AssingedToUserId) {
                            if (user?.Approver?.length > 0)
                                user.Approver.map((approver: any) => {
                                    Allmail.push(approver?.Name?.split('|')[2]);
                                })
                        }
                    })
                } else if (item != undefined && isLoadNotification != undefined && isLoadNotification != '' && isLoadNotification == 'Immediate') {
                    Allusers.map((user: any) => {
                        if (user?.IsTaskNotifications == true) {
                            if (user?.AssingedToUser?.EMail != undefined)
                                Allmail.push(user?.AssingedToUser?.EMail);
                        }
                    })
                }


                if (Allmail == undefined || Allmail.length == 0 && isLoadNotification == 'ApprovalMail')
                    alert("User has no Approver to send an email");


            } else {

                if (isLoadNotification == 'ApprovalMail')
                    alert("User has no Approver to send an email");
            }
            return Allmail;
        } catch (error) {
            console.log(error)
        }

    }
    const changeTitle = (e: any) => {
        if(e.target.value.length > 56){
            alert("Task Title is too long. Please chose a shorter name and enter the details into the task description.")
        }else{
            setSave(prevSave => ({
                ...prevSave,
                taskName: e.target.value
            }));
        }
    }

    const callBackData = (a: any) => {
        console.log();
    }

    return (
        <>  <div className={save.portfolioType == "Service" ? "serviepannelgreena" : ''}>
            <div className='Create-taskpage'>
                <div className='row'>
                    {props?.projectId == undefined ? <div className='col-sm-12'>
                        <div className='header-section full-width justify-content-between'>
                            <h2 style={{ color: "#000066", fontWeight: "600" }}>Create Task
                                <a data-interception="off" className=' text-end pull-right' target='_blank' href={oldTaskIrl} style={{ cursor: "pointer", fontSize: "14px" }}>Old Create Task</a>
                            </h2>
                        </div>
                    </div> : ''}
                    <div className='col-sm-6 ps-0'>
                        <label className='full-width'>Task Name</label>
                        <input type="text" placeholder='Enter task Name' className='full-width' value={save.taskName} onChange={(e) => { changeTitle(e) }}></input>
                    </div>
                    <div className='col-sm-2 p-0 mt-4'>
                        <label className='SpfxCheckRadio'>
                            <input
                                type="radio" className="radio" checked={save.portfolioType === 'Component'}
                                name="taskcategory" onChange={() => selectPortfolioType('Component')} />
                            Component</label>
                        {
                            burgerMenuTaskDetails?.ComponentID == undefined ? <>
                                <label className='SpfxCheckRadio ms-3'>
                                    <input
                                        type="radio" className="radio" checked={save.portfolioType === 'Service'}
                                        name="taskcategory" onChange={() => selectPortfolioType('Service')} />
                                    Service </label></> : ''
                        }
                    </div>
                    <div className='col-sm-4 pe-0'>{
                        save.portfolioType === 'Component' ?
                            <div className="input-group">
                                <label className="form-label full-width">Component Portfolio</label>
                                {smartComponentData?.length > 0 ? null :
                                    <>
                                        <input type="text" readOnly
                                            className="form-control"
                                            id="{{PortfoliosID}}" autoComplete="off"
                                        />
                                    </>
                                }
                                {smartComponentData?.length > 0 ? smartComponentData?.map((com: any) => {
                                    return (
                                        <>
                                            <div className="block d-flex justify-content-between pt-1 px-2" style={{ width: "89%" }}>
                                                <a style={{ color: "#fff !important" }} target="_blank" href={`${base_Url}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                <a>
                                                    <span title="Remove Component" onClick={() => setSmartComponentData([])}
                                                        style={{ backgroundColor: 'white' }} className="svg__iconbox svg__icon--cross hreflink mx-2"></span>
                                                </a>
                                            </div>
                                        </>
                                    )
                                }) : null}


                                <span className="input-group-text">
                                    <span onClick={(e) => EditPortfolio(save, 'Component')} style={{ backgroundColor: 'white' }} className="svg__iconbox svg__icon--edit"></span>
                                    {/* <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                        onClick={(e) => EditComponent(save, 'Component')} /> */}
                                </span>
                            </div> : ''
                    }
                        {
                            save.portfolioType === 'Service' ?
                                <div className="input-group">
                                    <label className="form-label full-width">
                                        Service Portfolio
                                    </label>
                                    {linkedComponentData?.length > 0 ? null :
                                        <>
                                            <input type="text" readOnly className="form-control"
                                                id="{{PortfoliosID}}" autoComplete="off" />
                                        </>
                                    }
                                    {linkedComponentData?.length > 0 ? linkedComponentData?.map((com: any) => {
                                        return (
                                            <>
                                                <div className="block d-flex justify-content-between pt-1 px-2" style={{ width: "89%" }}>
                                                    <a style={{ color: "#fff !important" }} target="_blank" href={`${base_Url}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                    <a>
                                                        <span title="Remove Service" style={{ backgroundColor: 'white', color: "#fff !important" }} onClick={() => setLinkedComponentData([])}
                                                            className="svg__iconbox svg__icon--cross hreflink mx-2"></span>
                                                    </a>
                                                </div>
                                            </>
                                        )
                                    }) : null}
                                    <span className="input-group-text">
                                        <span onClick={(e) => EditPortfolio(save, 'Service')} className="svg__iconbox svg__icon--edit"></span>
                                        {/* <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                        onClick={(e) => EditLinkedServices(save, 'Component')} /> */}
                                    </span>
                                </div> : ''
                        }
                    </div>
                </div>
                <div className='row mt-2 mb-3'>
                    <div className='col-sm-12 p-0'>
                        <input type="text" className='full-width ' placeholder='Enter task Url' value={save.taskUrl} onChange={(e) => UrlPasteTitle(e)} disabled={burgerMenuTaskDetails?.Siteurl?.length > 0}></input>

                    </div>
                </div>
                {burgerMenuTaskDetails?.Siteurl != undefined && burgerMenuTaskDetails?.ComponentID != undefined ?
                    <div className={refreshPage != true ? '' : ''}>
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            {burgerMenuTaskDetails?.Siteurl != undefined ?
                                <button className="nav-link active" id="URL-Tasks" data-bs-toggle="tab" data-bs-target="#URLTasks" type="button" role="tab" aria-controls="URLTasks" aria-selected="true">
                                    URL TASKS {relevantTasks?.ComponentRelevantTask?.length > 0 ? ("(" + relevantTasks?.TaskUrlRelevantTask?.length + ')') : ''}
                                </button> : ''}
                            {burgerMenuTaskDetails?.Siteurl != undefined ?
                                <button className="nav-link " id="Page-Tasks" data-bs-toggle="tab" data-bs-target="#PageTasks" type="button" role="tab" aria-controls="PageTasks" aria-selected="true">
                                    PAGE TASKS {relevantTasks?.ComponentRelevantTask?.length > 0 ? ("(" + relevantTasks?.PageRelevantTask?.length + ')') : ''}
                                </button> : ''}
                            {burgerMenuTaskDetails?.ComponentID != undefined ?
                                <button className="nav-link " id="Component-Tasks" data-bs-toggle="tab" data-bs-target="#ComponentTasks" type="button" role="tab" aria-controls="ComponentTasks" aria-selected="false">COMPONENT TASKS {relevantTasks?.ComponentRelevantTask?.length > 0 ? ("(" + relevantTasks?.ComponentRelevantTask?.length + ')') : ''}</button>
                                : ''}
                        </ul>
                        <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                            {burgerMenuTaskDetails?.Siteurl != undefined ? <div className="tab-pane Alltable mx-height show active" id="URLTasks" role="tabpanel" aria-labelledby="URLTasks">
                                {relevantTasks?.TaskUrlRelevantTask?.length > 0 ?
                                    <>
                                        <div className={relevantTasks?.TaskUrlRelevantTask?.length > 0 ? 'fxhg' : ''}>
                                            {/* ?ComponentID=1682&Siteurl=https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskDashboard.aspx */}
                                            <GlobalCommanTable columns={column2} data={relevantTasks?.TaskUrlRelevantTask} paginatedTable={true} callBackData={callBackData} />
                                            {/* <GlobalCommanTable AllListId={ContextValue} callBackData={callBackData} columns={columns} data={relevantTasks?.TaskUrlRelevantTask} TaskUsers={taskUsers} showHeader={true} fixedWidth={true} showingAllPortFolioCount={true} showCreationAllButton={true} /> */}
                                            {/* <DataGrid rows={relevantTasks?.TaskUrlRelevantTask} columns={columns} getRowId={(row: any) => row.TaskID} /> */}
                                        </div>
                                    </> : ''
                                }
                            </div> : ''}
                            {burgerMenuTaskDetails?.Siteurl != undefined ? <div className="tab-pane Alltable mx-height" id="PageTasks" role="tabpanel" aria-labelledby="PageTasks">
                                {relevantTasks?.PageRelevantTask?.length > 0 ?
                                    <>
                                        <div className={relevantTasks?.PageRelevantTask?.length > 0 ? 'fxhg' : ''}>
                                            <GlobalCommanTable columns={column2} data={relevantTasks?.PageRelevantTask} paginatedTable={true} callBackData={callBackData} />
                                            {/* <GlobalCommanTable AllListId={ContextValue} columns={columns} data={relevantTasks?.PageRelevantTask} TaskUsers={taskUsers} showHeader={true} fixedWidth={true} showingAllPortFolioCount={true} showCreationAllButton={true} /> */}
                                            {/* <DataGrid rows={relevantTasks?.PageRelevantTask} columns={columns} getRowId={(row: any) => row.TaskID} /> */}
                                        </div>
                                    </> : ''
                                }
                            </div> : ''}
                            {burgerMenuTaskDetails?.ComponentID != undefined ?
                                <div className="tab-pane Alltable mx-height" id="ComponentTasks" role="tabpanel" aria-labelledby="ComponentTasks">

                                    {relevantTasks?.ComponentRelevantTask?.length > 0 ?
                                        <>
                                            <div className={relevantTasks?.ComponentRelevantTask?.length > 0 ? 'fxhg' : ''}>
                                                <GlobalCommanTable columns={column2} data={relevantTasks?.ComponentRelevantTask} paginatedTable={true} callBackData={callBackData} />
                                                {/* <GlobalCommanTable AllListId={ContextValue} columns={columns} data={relevantTasks?.ComponentRelevantTask} TaskUsers={taskUsers} showHeader={true} fixedWidth={true} showingAllPortFolioCount={true} showCreationAllButton={true} /> */}
                                                {/* <DataGrid rows={relevantTasks?.ComponentRelevantTask} columns={columns} getRowId={(row: any) => row.TaskID} /> */}
                                            </div>
                                        </> : ''
                                    }

                                </div> : ''}
                        </div>
                    </div>
                    : ''}





                {/*---------------- Sites -------------
            -------------------------------*/}
                {siteType?.length > 1 ?
                    <div className='row mt-2 border'>
                        <fieldset>
                            <legend className="border-bottom fs-6 ">Sites</legend>
                            <ul className="quick-actions ">
                                {siteType?.map((item: any) => {
                                    return (
                                        <>
                                            {(item.Title !== undefined && item.Title !== 'Offshore Tasks' && item.Title !== 'Master Tasks' && item.Title !== 'DRR' && item.Title !== 'SDC Sites' && item.Title !== 'QA') &&
                                                <>
                                                    <li
                                                        className={isActive.siteType && save.siteType === item.Title ? '  mx-1 p-2 bg-siteColor selectedTaskList text-center mb-2 position-relative' : "mx-1 p-2 position-relative bg-siteColor text-center  mb-2"} onClick={() => setActiveTile("siteType", "siteType", item.Title)} >
                                                        {/*  */}
                                                        <a className='text-white text-decoration-none' >
                                                            <span className="icon-sites">
                                                                {item.Item_x005F_x0020_Cover != undefined &&
                                                                    <img className="icon-sites"
                                                                        src={item.Item_x005F_x0020_Cover.Url} />
                                                                }
                                                            </span>{item.Title}
                                                        </a>
                                                    </li>
                                                </>
                                            }
                                        </>)
                                })}
                            </ul>
                        </fieldset>
                    </div> : ''}

                {props?.projectId == undefined ? <>
                    {/*---- Task Categories ---------
            -------------------------------*/}
                    <div className='row mt-2 border'>
                        <fieldset >
                            <legend className="border-bottom fs-6">Task Categories</legend>
                            <div className="row " style={{ width: "100%" }}>
                                {TaskTypes?.map((Task: any) => {
                                    return (
                                        <>
                                            <>
                                                <div
                                                    className=" col-sm-2 mt-1 text-center"  >
                                                    <div id={"subcategorytasks" + Task.Id} className={isActiveCategory ? 'task manage_tiles' : 'task manage_tiles'}>
                                                        <div className='bg-siteColor py-3'>
                                                            {(Task.Item_x005F_x0020_Cover !== undefined && Task.Item_x005F_x0020_Cover?.Url !== undefined) &&
                                                                <img className="icon-task"
                                                                    src={Task.Item_x005F_x0020_Cover.Url} />}
                                                            <p className='m-0'>{Task.Title}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='subcategoryTasks kind_task col-sm-10'  >
                                                    {subCategory?.map((item: any) => {
                                                        return (
                                                            <>
                                                                {Task.Id === item.ParentID && <>
                                                                    {/* onClick={() => selectSubTaskCategory(item.Title, item.Id)} */}
                                                                    <a onClick={() => selectSubTaskCategory(item.Title, item.Id, item)} id={"subcategorytasks" + item.Id} className={item.ActiveTile ? 'bg-siteColor subcategoryTask selectedTaskList text-center' : 'bg-siteColor subcategoryTask text-center'} >

                                                                        <span className="icon-box">
                                                                            {(item.Item_x005F_x0020_Cover !== undefined && item.Item_x005F_x0020_Cover?.Url !== undefined) &&
                                                                                <img className="icon-task"
                                                                                    src={item.Item_x005F_x0020_Cover.Url} />}
                                                                        </span> <span className="tasks-label">{item.Title}</span>
                                                                    </a>
                                                                </>
                                                                }
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        </>)
                                })}
                            </div>
                        </fieldset>
                    </div>
                    {/*-----Priority Rank ---------------------------------------*/}
                    <div className='row mt-2 border'>
                        <fieldset>
                            <legend className="border-bottom fs-6">Priority Rank</legend>
                            <dl className="row px-2 text-center">
                                {priorityRank?.map((item: any) => {
                                    return (
                                        <>

                                            <>
                                                <dt
                                                    className={isActive.rank && save.rank === item.Title ? 'bg-siteColor col selectedTaskList  mx-1 p-2  mb-2 ' : 'bg-siteColor col mx-1 p-2  mb-2 '} onClick={() => setActiveTile("rank", "rank", item.Title)}>

                                                    <a className='text-white'>
                                                        <span>
                                                            {(item.Item_x005F_x0020_Cover !== undefined && item.Item_x005F_x0020_Cover?.Url !== undefined) &&
                                                                <img src={item.Item_x005F_x0020_Cover.Url} />}
                                                        </span>
                                                    </a>

                                                </dt>

                                            </>

                                        </>)
                                })}

                            </dl>
                        </fieldset>
                    </div>
                    {/*-----Time --------
            -------------------------------*/}
                    <div className='row mt-2 border'>
                        <fieldset>
                            <legend className="border-bottom fs-6">Time</legend>
                            <div className="row justify-content-md-center subcategoryTasks">
                                {Timing?.map((item: any) => {
                                    return (
                                        <>

                                            <>
                                                <div className={isActive.time && save.Time === item.Title ? 'bg-siteColor selectedTaskList Timetask mx-1 p-2 px-2   text-center' : 'bg-siteColor Timetask mx-1 p-2 px-2  text-center'} onClick={() => setActiveTile("Time", "time", item.Title)} >

                                                    <a className='text-decoration-none text-white'>
                                                        <span className="icon-sites">
                                                            {(item.Item_x005F_x0020_Cover !== undefined && item.Item_x005F_x0020_Cover?.Url !== undefined) &&
                                                                <img className="icon-sites"
                                                                    src={item.Item_x005F_x0020_Cover.Url} />
                                                            }
                                                        </span>{item.Title}
                                                    </a>
                                                </div>

                                            </>

                                        </>)
                                })}

                            </div>
                        </fieldset>
                    </div>
                    {/*-----Due date --------
            -------------------------------*/}
                    <div className='row mt-2 border'>
                        <fieldset>

                            <legend className="border-bottom fs-6">Due Date</legend>
                            <div className="row justify-content-md-center text-center mb-2">
                                <div className={isActive.dueDate && save.dueDate === 'Today' ? 'bg-siteColor col mx-1 p-2 px-2 selectedTaskList text-center' : 'mx-1 p-2 px-4 col bg-siteColor'} onClick={() => setActiveTile("dueDate", "dueDate", 'Today')}>
                                    <a className='text-decoration-none text-white'>Today&nbsp;{moment(new Date()).format('DD/MM/YYYY')}</a>
                                </div>
                                <div className={isActive.dueDate && save.dueDate === 'Tomorrow' ? 'bg-siteColor col mx-1 p-2 px-2 selectedTaskList text-center' : 'mx-1 p-2 px-4 col bg-siteColor'} onClick={() => setActiveTile("dueDate", "dueDate", 'Tomorrow')} id="Tomorrow"><a className='text-decoration-none text-white'>Tomorrow</a> </div>
                                <div className={isActive.dueDate && save.dueDate === 'ThisWeek' ? 'bg-siteColor col mx-1 p-2 px-2 selectedTaskList text-center' : 'mx-1 p-2 px-4 col bg-siteColor'} onClick={() => setActiveTile("dueDate", "dueDate", 'ThisWeek')} id="ThisWeek"><a className='text-decoration-none text-white'>This Week</a> </div>
                                <div className={isActive.dueDate && save.dueDate === 'NextWeek' ? 'bg-siteColor col mx-1 p-2 px-2 selectedTaskList text-center' : 'mx-1 p-2 px-4 col bg-siteColor'} onClick={() => setActiveTile("dueDate", "dueDate", 'NextWeek')} id="NextWeek"><a className='text-decoration-none text-white'>Next Week</a> </div>
                                <div className={isActive.dueDate && save.dueDate === 'ThisMonth' ? 'bg-siteColor col mx-1 p-2 px-2 selectedTaskList text-center' : 'mx-1 p-2 px-4 col bg-siteColor'} onClick={() => setActiveTile("dueDate", "dueDate", 'ThisMonth')} id="ThisMonth"><a className='text-decoration-none text-white'>This Month</a> </div>
                            </div>
                        </fieldset>
                    </div>
                </> : ''}

                <div className='col text-end mt-3'>
                    {
                        siteType?.map((site: any) => {
                            if (site.Title === save.siteType) {
                                return (
                                    <span className='ms-2'>
                                        {(site.Item_x005F_x0020_Cover !== undefined && site.Item_x005F_x0020_Cover?.Url !== undefined) &&
                                            <img className="client-icons" src={site.Item_x005F_x0020_Cover.Url} />
                                        }
                                    </span>
                                )
                            }
                        })
                    }
                    <button type="button" className='btnCol btn btn-primary' onClick={() => createTask()}>Submit</button>
                </div>
                {/* {IsComponent && <ServiceComponentPortfolioPopup props={ShareWebComponent} Call={Call} Dynamic={AllListId} AllListId={AllListId} smartComponentData={smartComponentData} ></ServiceComponentPortfolioPopup>}
                {IsServices && <LinkedComponent props={ShareWebComponent} Call={Call} AllListId={AllListId} Dynamic={AllListId} linkedComponentData={linkedComponentData}  ></LinkedComponent>} */}
                {/* {IsComponent &&
                    <ServiceComponentPortfolioPopup
                        props={ShareWebComponent}
                        Dynamic={AllListId}
                        ComponentType={"Component"}
                        Call={ComponentServicePopupCallBack}
                    />
                } */}
                {IsOpenPortfolio &&
                    <ServiceComponentPortfolioPopup
                        props={ShareWebComponent}
                        Dynamic={AllListId}
                        Call={ComponentServicePopupCallBack}
                        ComponentType={openPortfolioType}
                    />
                }
                {editTaskPopupData.isOpenEditPopup ? <EditTaskPopup context={props?.SelectedProp.Context}
                    sendApproverMail={sendApproverMail} AllListId={AllListId} Items={editTaskPopupData.passdata} Call={CallBack} /> : ''}
            </div>
        </div>
        </>
    )
}

export default CreateTaskComponent;