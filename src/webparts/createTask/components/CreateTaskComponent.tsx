import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import { Web, sp } from "sp-pnp-js";
import pnp from "sp-pnp-js";
import "@pnp/sp/sputilities";
let feedback: any = null;
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as moment from 'moment';
import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
import * as globalCommon from '../../../globalComponents/globalCommon';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import { Item } from '@pnp/sp/items';
import InlineEditingcolumns from '../../../globalComponents/inlineEditingcolumns';
let AllMetadata: any = []
let siteConfig: any = []
let AssignedToUsers: any = []
let AllClientCategories: any = [];
let SitesTypes: any = []
let subCategories: any = []
let selectedPortfolio: any = [];
let TeamMessagearray: any = [];
let AllComponents: any = []
let taskUsers: any = [];
let ClientActivityJson: any = null;
let taskCreated = false;
let createdTask: any = {}
let IsapprovalTask = false
let QueryPortfolioId: any = null;
let loggedInUser: any;
let oldTaskIrl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx";
let groupedComponentData: any = [];
let groupedProjectData: any = [];
var ContextValue: any = {};
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
var AllListId: any = {}
let AllProjects: any = [];
let DirectTask = false;
function CreateTaskComponent(props: any) {
    let base_Url = props?.pageContext?._web?.absoluteUrl;
    const [editTaskPopupData, setEditTaskPopupData] = React.useState({
        isOpenEditPopup: false,
        passdata: null
    })
    const [siteType, setSiteType] = React.useState([])
    const [sendApproverMail, setSendApproverMail] = React.useState(false);
    const [isTaskCreated, setIsTaskCreated] = React.useState(false)
    const [ProjectManagementPopup, setProjectManagementPopup] = React.useState(false)
    const [TaskTypes, setTaskTypes] = React.useState([])
    const [subCategory, setsubCategory] = React.useState([])
    const [SuggestedProjectsOfporfolio, setSuggestedProjectsOfporfolio] = React.useState([])
    const [SearchedServiceCompnentData, setSearchedServiceCompnentData] = React.useState<any>([]);
    const [SearchedServiceCompnentKey, setSearchedServiceCompnentKey] = React.useState<any>('');
    const [SearchedProjectItems, setSearchedProjectItems] = React.useState<any>([]);
    const [SearchedProjectKey, setSearchedProjectKey] = React.useState<any>('');
    const [priorityRank, setpriorityRank] = React.useState([])
    const [openPortfolioType, setOpenPortfolioType] = React.useState("");
    const [taskCat, setTaskCat] = React.useState([]);
    const [UserEmailNotify, setUserEmailNotify] = React.useState(false);
    const [IsOpenPortfolio, setIsOpenPortfolio] = React.useState(false);
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [relevantProjects, setRelevantProjects] = React.useState([]);
    const [Timing, setTiming] = React.useState([])
    const [isActive, setIsActive] = React.useState({
        siteType: false,
        time: false,
        rank: false,
        dueDate: false,
    });
    const [PageRelevantTask, setPageRelevantTask]: any = React.useState([])
    const [TaskUrlRelevantTask, setTaskUrlRelevantTask]: any = React.useState([])
    const [ComponentRelevantTask, setComponentRelevantTask]: any = React.useState([])

    const [isActiveCategory, setIsActiveCategory] = React.useState(false);
    const [selectedProjectData, setSelectedProjectData]: any = React.useState({});
    const [activeCategory, setActiveCategory] = React.useState([]);
    const [CMSToolComponent, setCMSToolComponent] = React.useState('');
    const [refreshPage, setRefreshPage] = React.useState(false);
    const [burgerMenuTaskDetails, setBurgerMenuTaskDetails]: any = React.useState({
        ComponentID: undefined,
        Siteurl: undefined,
        TaskType: undefined
    });
    const [save, setSave] = React.useState({ siteType: '', linkedServices: [], recentClick: undefined, Mileage: '', DueDate: undefined, dueDate: '', taskCategory: '', taskCategoryParent: '', rank: undefined, Time: '', taskName: '', taskUrl: undefined, portfolioType: 'Component', Component: [] })
    React.useEffect(() => {
        ContextValue = props.SelectedProp;
        GetSmartMetadata();
        LoadTaskUsers();
    }, [])
    React.useEffect(() => {
        try {
            $("#spPageCanvasContent").removeClass();
            $("#spPageCanvasContent").addClass("hundred");
        } catch (e) {
            console.log(e);
        }
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
        pageContext();
        setRefreshPage(!refreshPage);
    }, [PageRelevantTask, TaskUrlRelevantTask, ComponentRelevantTask])

    const GetComponents = async () => {
        let PropsObject: any = {
            MasterTaskListID: AllListId.MasterTaskListID,
            siteUrl: AllListId.siteUrl,
            TaskUserListId: AllListId.TaskUsertListID,
        }
        let componentDetails: any = [];
        let results = await globalCommon.GetServiceAndComponentAllData(PropsObject)
        if (results?.AllData?.length > 0) {
            componentDetails = results?.AllData;
            groupedComponentData = results?.GroupByData;
            groupedProjectData = results?.ProjectData;
            AllProjects = results?.FlatProjectData
        }
        return componentDetails
    }

    const EditPortfolio = (item: any, Type: any) => {
        if (Type == 'Component') {
            setIsOpenPortfolio(true);
            setOpenPortfolioType(Type)
            setCMSToolComponent(item);
        }
        if (Type == 'Project') {
            setProjectManagementPopup(true)
            setOpenPortfolioType(Type)
            setCMSToolComponent(item);
        }
    }

    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
        // let saveItem = save;
        if (functionType == "Close") {
            setProjectManagementPopup(false);
            setIsOpenPortfolio(false);
        } else {
            if (DataItem != undefined && DataItem.length > 0) {
                if (DataItem[0]?.Item_x0020_Type == "Project" || DataItem[0]?.Item_x0020_Type == "Sprint") {
                    setSave(prevSave => ({
                        ...prevSave,
                        Project: DataItem[0],
                    }));
                    setSelectedProjectData(DataItem[0]);
                    setProjectManagementPopup(false);
                    setSearchedProjectItems([]);
                    setSearchedProjectKey("");
                } else {
                    setSave(prevSave => ({
                        ...prevSave,
                        Component: DataItem,
                        portfolioType: "Component"
                    }));
                    let suggestedProjects = AllProjects?.filter((Projects: any) => Projects?.Portfolios?.some((port: any) => port?.Id == DataItem[0]?.Id));
                    setSuggestedProjectsOfporfolio(suggestedProjects);
                    // setSave({ ...save, Component: DataItem });
                    setSmartComponentData(DataItem);
                    selectedPortfolio = DataItem;
                    setSearchedServiceCompnentData([]);
                    setSearchedServiceCompnentKey('');
                    // selectPortfolioType('Component');
                    console.log("Popup component component ", DataItem)
                    setIsOpenPortfolio(false)
                }

            }

        }
        // setSave(saveItem);
    }, [])
    const autoSuggestionsForServiceAndComponent = (e: any) => {
        let SearchedKeyWord: any = e.target.value;
        let TempArray: any = [];
        if (SearchedKeyWord.length > 0) {
            if (AllComponents != undefined && AllComponents?.length > 0) {
                AllComponents?.map((AllDataItem: any) => {
                    if ((AllDataItem.Path?.toLowerCase())?.includes(SearchedKeyWord.toLowerCase())) {
                        TempArray.push(AllDataItem);
                    }
                })
            }
            if (TempArray != undefined && TempArray.length > 0) {
                setSearchedServiceCompnentData(TempArray);
                setSearchedServiceCompnentKey(SearchedKeyWord);
            }
        } else {
            setSearchedServiceCompnentData([]);
            setSearchedServiceCompnentKey("");
        }
    }
    const autoSuggestionsForProject = (e: any) => {
        let SearchedKeyWord: any = e.target.value;
        let TempArray: any = [];
        if (SearchedKeyWord.length > 0) {
            if (AllProjects != undefined && AllProjects?.length > 0) {
                AllProjects?.map((AllDataItem: any) => {
                    if ((AllDataItem.Path?.toLowerCase())?.includes(SearchedKeyWord.toLowerCase())) {
                        TempArray.push(AllDataItem);
                    }
                })
            }
            if (TempArray != undefined && TempArray.length > 0) {
                setSearchedProjectItems(TempArray);
                setSearchedProjectKey(SearchedKeyWord);
            }
        } else {
            setSearchedProjectItems([]);
            setSearchedProjectKey("");
        }
    }

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
        let BurgerMenuData = burgerMenuTaskDetails;
        if (props?.projectId == undefined) {
            let CompleteUrl = window.location.href;
            const params = new URLSearchParams(window.location.search);
            let siteUrlData = CompleteUrl?.split("Siteurl")[1];
            siteUrlData = siteUrlData?.split('&OR')[0]
            siteUrlData = siteUrlData?.slice(1, siteUrlData?.length)
            let paramSiteUrl = siteUrlData;
            let paramComponentId = params.get('ComponentID');
            // let paramComponentId = params.get('Component');
            let paramType = params.get('Type');
            let paramTaskType = params.get('TaskType');
            let paramServiceId = params.get('ServiceID');
            let externalSite = params.get('ExternalSite') === '1'
            let SDCTaskId = BurgerMenuData.SDCTaskId = params.get('TaskId');
            let SDCTitle = BurgerMenuData.SDCTitle = params.get('Title');
            let SDCSiteType = BurgerMenuData.SDCSiteType = params.get('siteType');
            let SDCTaxType = BurgerMenuData.SDCTaxType = params.get('TaxType');
            let SDCDueDate = BurgerMenuData.SDCDueDate = params.get('DueDate');
            let SDCPriority = BurgerMenuData.SDCPriority = params.get('Priority');
            let SDCCreatedBy = BurgerMenuData.SDCCreatedBy = params.get('CreatedBy');
            let SDCCreatedDate = BurgerMenuData.SDCCreatedDate = params.get('CreatedDate');
            let SDCDescription = BurgerMenuData.SDCDescription = params.get('Description');
            let SDCPageUrl = BurgerMenuData.SDCTaskUrl = params.get('TaskUrl');
            let SDCEmail = BurgerMenuData.SDCEmail = params.get('Email');
            let SDCTaskUrl = '';
            let SDCTaskDashboard = '';
            if (SDCDescription == 'null') {
                SDCDescription = null
            }
            let previousTaggedTaskToComp: any[] = []

            BurgerMenuData.ComponentID = paramComponentId;
            BurgerMenuData.Siteurl = paramSiteUrl;
            BurgerMenuData.TaskType = paramTaskType;

            let PageName = '';

            if (paramSiteUrl != undefined) {
                PageName = paramSiteUrl?.split('aspx')[0].split("").reverse().join("").split('/')[0].split("").reverse().join("");
                PageName = PageName + 'aspx'
            }
            if (paramComponentId == undefined && paramType == undefined && (paramSiteUrl != undefined || SDCTaskId != undefined && externalSite == false)) {
                BurgerMenuData.ComponentID = paramComponentId = "756";
                QueryPortfolioId = '756';
            }
            else if (paramComponentId == undefined && paramServiceId == undefined && paramSiteUrl != undefined && paramType == 'Service') {
                BurgerMenuData.ComponentID = paramServiceId = "4497";
                QueryPortfolioId = '4497';
            }

            if (paramComponentId != undefined) {
                QueryPortfolioId = paramComponentId;
                if (externalSite == false) {
                    let foundCom = AllComponents?.find((item: any) => {
                        if (item?.Id == paramComponentId) {
                            setComponent.push(item)
                            setSave((prev: any) => ({ ...prev, Component: setComponent }));
                            setSmartComponentData(setComponent);
                            let suggestedProjects = AllProjects?.filter((Projects: any) => Projects?.Portfolios?.some((port: any) => port?.Id == paramComponentId));
                            setSuggestedProjectsOfporfolio(suggestedProjects);
                            selectedPortfolio = setComponent
                            return true;
                        }
                    })
                }
                if (externalSite == true) {
                    const parts = paramSiteUrl?.toLowerCase()?.split("/");
                    const sitePagesIndex = parts.indexOf("sites");
                    let completeUrl = parts.slice(sitePagesIndex).join("/");
                    let foundationUrl: any = completeUrl.toLowerCase().split("/");
                    let foundationPageIndex = foundationUrl.indexOf("sitepages")
                    foundationUrl = foundationUrl.slice(foundationPageIndex).join("/")
                    let PageUrl = foundationUrl.toLowerCase().split('?')[0];
                    PageUrl = '/' + PageUrl;
                    PageUrl = PageUrl.split('#')[0];
                    let foundCom = AllComponents?.find((item: any) => {
                        if (item?.FoundationPageUrl?.toLowerCase() == PageUrl?.toLowerCase()) {
                            paramComponentId = QueryPortfolioId = item?.Id
                            setComponent.push(item)
                            setSave((prev: any) => ({ ...prev, Component: setComponent }));
                            setSmartComponentData(setComponent);
                            let suggestedProjects = AllProjects?.filter((Projects: any) => Projects?.Portfolios?.some((port: any) => port?.Id == paramComponentId));
                            setSuggestedProjectsOfporfolio(suggestedProjects);
                            selectedPortfolio = setComponent
                            return true;
                        }
                    })
                }
                if (SDCCreatedBy != undefined && SDCCreatedDate != undefined && SDCTaskUrl != undefined) {

                    let saveValue = save;
                    if (SDCSiteType?.toLowerCase() == 'alakdigital') {

                        SDCTaskUrl = `https://www.shareweb.ch/site/EI/DigitalAdministration/Team/Pages/Manage/TaskProfile.aspx?TaskId=${SDCTaskId}`
                        SDCTaskDashboard = `https://www.shareweb.ch/EI/DigitalAdministration/team/Pages/TeamDashboard.aspx`
                    } else {
                        SDCTaskUrl = `https://www.shareweb.ch/site/${SDCSiteType}/Team/Pages/Manage/TaskProfile.aspx?TaskId=${SDCTaskId}`
                        SDCTaskDashboard = `https://www.shareweb.ch/site/${SDCSiteType}/team/Pages/TeamDashboard.aspx`
                    }
                    BurgerMenuData.SDCTaskUrl = SDCTaskUrl;
                    BurgerMenuData.SDCTaskDashboard = SDCTaskDashboard;
                    let isTaskFound = false;
                    const creatSDCTas = () => {
                        let e = {
                            target: {
                                value: SDCTaskUrl
                            }
                        }
                        UrlPasteTitle(e);
                        saveValue.taskName = SDCTitle;
                        saveValue.taskUrl = SDCTaskUrl;
                        if (SDCDueDate != undefined && SDCDueDate != '' && SDCDueDate != null && SDCDueDate != "null") {
                            saveValue.DueDate = SDCDueDate
                        }
                        setSave(saveValue);

                        feedback = [{ "Title": "FeedBackPicture16019", "FeedBackDescriptions": [{ "Title": SDCDescription?.length > 0 && SDCDescription != null ? SDCDescription : SDCTitle, "Completed": false, "isShowComment": true, "Comments": [{ "Title": `Created ${SDCCreatedDate}  By ${SDCCreatedBy}   TaskUrl-${SDCPageUrl}`, "Created": moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'), "editableItem": false, "AuthorName": loggedInUser?.Title, "AuthorImage": loggedInUser?.Item_x0020_Cover?.Url }], "Id": "11185" }], "ImageDate": "16019" }]
                        let ccAct = {
                            ...BurgerMenuData,
                            "ClientActivityId": SDCTaskId, "ClientSite": SDCSiteType
                        }
                        ClientActivityJson = [ccAct];
                        if (SDCPriority != undefined && SDCPriority != '' && SDCPriority != null) {
                            setActiveTile("rank", "rank", SDCPriority)
                        }
                        createTask()
                    }
                    const web = new Web(AllListId?.siteUrl);
                    SitesTypes?.map(async (site: any) => {
                        if (site?.Title?.toLowerCase() == SDCSiteType?.toLowerCase()) {
                            const lists = web.lists.getById(site?.listId)
                            await lists.items.select('Id,Title,ComponentLink,component_x0020_link').getAll().then((data: any) => {
                                data?.map((task: any, index: any) => {
                                    if (task?.ComponentLink?.Url == SDCTaskUrl) {
                                        window.open(base_Url + "/SitePages/Task-Profile.aspx?taskId=" + task?.Id + "&Site=" + site?.Title, "_self")
                                        isTaskFound = true;
                                    } else if (task?.component_x0020_link?.Url == SDCTaskUrl) {
                                        window.open(base_Url + "/SitePages/Task-Profile.aspx?taskId=" + task?.Id + "&Site=" + site?.Title, "_self")
                                        isTaskFound = true;
                                    } else if (index == data?.length - 1 && !isTaskFound) {
                                        creatSDCTas();
                                    }
                                })
                                if (data?.length == 0 && !isTaskFound) {
                                    creatSDCTas();
                                }
                            })
                        }
                    })

                }
                else if (paramTaskType == 'Bug') {
                    DirectTask = true;
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
                    DirectTask = true;
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
                    let setTaskTitle = 'Feedback - ' + setComponent[0]?.Title + ' ' + moment(new Date()).format('DD-MM-YYYY');
                    saveValue.taskName = setTaskTitle;
                    subCategories?.map((item: any) => {
                        if (item.Title == "Feedback") {
                            selectSubTaskCategory(item.Title, item.Id, item)
                        }
                    })
                    saveValue.taskUrl = paramSiteUrl;
                    BurgerMenuData.TaskType = 'Feedback'
                    setSave(saveValue);
                    let e = {
                        target: {
                            value: paramSiteUrl
                        }
                    }
                    UrlPasteTitle(e);
                }
                if (paramTaskType != 'Bug' && paramTaskType != 'Design') {
                    await loadRelevantTask(paramComponentId, paramSiteUrl, PageName).then((response: any) => {
                        setRefreshPage(!refreshPage);
                    })
                }
            }
        } else if (props?.projectId != undefined && props?.projectItem != undefined) {
            AllComponents?.map((item: any) => {
                if (item?.Id == props?.createComponent?.portfolioData?.Id) {
                    if (props?.createComponent?.portfolioType === 'Component') {
                        setComponent.push(item)
                        setSave((prev: any) => ({ ...prev, portfolioType: 'Component' }))
                        setSmartComponentData(setComponent);
                        selectedPortfolio = setComponent
                    }
                }
            })
        }
        setBurgerMenuTaskDetails(BurgerMenuData)
    }

    const loadRelevantTask = async (PortfolioId: any, UrlTask: any, PageTask: any) => {
        let allData: any = [];
        let URLRelatedProjects: any = [];
        let query = '';
        query = "Categories,AssignedTo/Title,AssignedTo/Name,PriorityRank,TaskType/Id,TaskType/Title,AssignedTo/Id,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,AttachmentFiles/FileName,ComponentLink/Url,FileLeafRef,TaskLevel,TaskID,TaskLevel,Title,Id,PriorityRank,PercentComplete,Company,WebpartId,StartDate,DueDate,Status,Body,FeedBack,WebpartId,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ParentTask/TaskID,ParentTask/Title,ParentTask/Id,Project/Id,Project/Title&$expand=AssignedTo,Project,ParentTask,AttachmentFiles,TaskType,Portfolio,Author,Editor&$orderby=Modified desc"
        let PageRelevant = PageRelevantTask;
        let TaskUrlRelevant = TaskUrlRelevantTask;
        let ComponentRelevant = ComponentRelevantTask;

        const web = new Web(AllListId?.siteUrl);
        const batch = sp.createBatch();
        let count: any = 0;
        SitesTypes?.map((site: any) => {

            try {
                if (site?.listId != undefined) {
                    const lists = web.lists.getById(site?.listId)
                    lists.items.inBatch(batch).select(query)
                        .getAll()
                        .then((data: any) => {

                            data.map((item: any) => {
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
                                item.portfolio = {};
                                if (item?.Portfolio?.Id != undefined) {
                                    item.portfolio = item.Portfolio;
                                }
                                if (item?.Portfolio?.Id == PortfolioId) {
                                    ComponentRelevant.push(item);
                                }

                                item.TaskID = globalCommon.GetTaskId(item);

                                item.DisplayDueDate = moment(item?.DueDate).format('DD/MM/YYYY');
                                if (item.DisplayDueDate == "Invalid date" || item.DisplayDueDate == undefined) {
                                    item.DisplayDueDate = '';
                                }
                                item.CreateDate = moment(item?.Created).format('DD/MM/YYYY');
                                item.CreatedSearch = item.CreateDate + '' + item.Author;
                                item.bodys = item.Body != null && item.Body.split('<p><br></p>').join('');
                                if (item?.FeedBack != undefined) {
                                    item.descriptionsSearch = globalCommon.descriptionSearchData(item)
                                } else {
                                    item.descriptionsSearch = '';
                                }

                                item.DateModified = item.Modified;
                                item.ModifiedDate = moment(item?.Modified).format('DD/MM/YYYY');
                                item.ModifiedSearch = item.ModifiedDate + '' + item.Editor;
                                if (item.siteType != 'Offshore Tasks') {
                                    try {
                                        if (item?.ComponentLink?.Url.indexOf(UrlTask) > -1) {

                                            TaskUrlRelevant.push(item);
                                        }
                                        if (item?.ComponentLink?.Url.indexOf(PageTask) > -1) {
                                            if (!URLRelatedProjects?.some((Project: any) => Project?.Id == item?.Project?.Id) && item?.Project?.Id != undefined) {
                                                let foundProject = AllProjects?.find((Proj: any) => Proj.Id == item?.Project?.Id)
                                                foundProject.Count = 1;
                                                URLRelatedProjects.push(foundProject)
                                            } else {
                                                URLRelatedProjects = URLRelatedProjects?.map((project: any) => {
                                                    if (project.Id == item?.Project?.Id) {
                                                        project.Count += 1
                                                        return project
                                                    }
                                                    return project
                                                })
                                            }
                                            PageRelevant.push(item);
                                        }

                                    } catch (error) {
                                        console.log(error.message)
                                    }
                                }
                            })
                            count++;
                            if (count == SitesTypes.length) {
                                URLRelatedProjects = URLRelatedProjects.sort((a: any, b: any) => { return b.Count - a.Count })
                                setRelevantProjects(URLRelatedProjects)
                                console.log("inside Set Task")
                                setPageRelevantTask(PageRelevant)
                                setTaskUrlRelevantTask(TaskUrlRelevant)
                                setComponentRelevantTask(ComponentRelevant)
                                setSave({ ...save, recentClick: 'PortfolioId' })
                            }
                        })

                }
            } catch (error) {
                console.log(error)
            }
        })
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
        try {
            MetaData = await web.lists
                .getById(ContextValue.SmartMetadataListID)
                .items
                .select("Id,Title,listId,siteUrl,siteName,IsSendAttentionEmail/Id,Item_x005F_x0020_Cover,ParentID,Parent/Id,Parent/Title,EncodedAbsUrl,IsVisible,Created,Item_x0020_Cover,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,AlternativeTitle")
                .top(4999)
                .expand('Author,Editor,Parent,IsSendAttentionEmail')
                .get();
            AllMetadata = MetaData;
            AllMetadata?.map((metadata: any) => {
                if (metadata?.Title !== undefined && metadata?.Title !== 'Foundation' && metadata?.Title !== 'Master Tasks' && metadata?.Title !== 'DRR' && metadata?.Title !== 'Health' && metadata?.Title !== 'Gender' && metadata?.Title !== 'SP Online' && metadata?.TaxType == 'Sites' && metadata?.listId != undefined) {
                    SitesTypes.push(metadata);
                }
                if (metadata?.TaxType == 'Sites') {
                    siteConfig?.push(metadata)
                }
                if (metadata?.TaxType == 'Categories') {
                    TaskTypes?.push(metadata)
                }
                if (metadata?.TaxType == 'Priority Rank') {
                    Priority?.push(metadata)
                }
                if (metadata?.TaxType == 'Timings') {
                    Timing?.push(metadata)
                }
                if (metadata?.TaxType == 'Client Category') {
                    AllClientCategories?.push(metadata)
                }
            })
            Timing = sortDataOnOrder(Timing)
            SitesTypes = sortDataOnOrder(SitesTypes)
            siteConfig = sortDataOnOrder(siteConfig)
            TaskTypes = sortDataOnOrder(TaskTypes)
            Priority = sortDataOnOrder(Priority)
            if (SitesTypes?.length == 1) {
                setActiveTile("siteType", "siteType", SitesTypes[0].Title)
                setSiteType(SitesTypes)
            } else {
                setSiteType(SitesTypes)
            }
            setTiming(Timing)
            setpriorityRank(Priority)


            TaskTypes?.map((task: any) => {
                if (task?.ParentID !== undefined && task?.ParentID === 0 && task?.Title !== 'Phone') {
                    Task.push(task);
                    getChilds(task, TaskTypes);
                }
                if (task?.ParentID !== undefined && task?.ParentID !== 0 && task?.IsVisible) {
                    subCategories.push(task);
                }
            })
            Task?.map((taskItem: any) => {
                subCategories?.map((item: any) => {
                    if (taskItem?.Id === item?.Parent?.Id) {
                        try {
                            item.ActiveTile = false;
                            item.SubTaskActTile = item?.Title?.replace(/\s/g, "");
                        } catch (error) {
                            console.log(error);
                        }
                    }
                })
            })
            if (loggedInUser?.IsApprovalMail?.toLowerCase() == 'approve all') {
                IsapprovalTask = true
            }
            if (IsapprovalTask == true) {
                subCategories?.map((item: any) => {
                    if (item?.Title == "Approval" && !item.ActiveTile) {
                        selectSubTaskCategory(item?.Title, item?.Id, item)
                    }
                })
            }
        } catch (error) {

        }
        setsubCategory(subCategories);
        setTaskTypes(Task);
        await fetchBurgerMenuDetails();
    }
    const sortDataOnOrder = (data: any) => {
        return data?.sort((a: any, b: any) => {
            return a?.SortOrder - b?.SortOrder;
        });
    }
    let LoadTaskUsers = async () => {
        let AllTaskUsers: any = [];
        try {
            let web = new Web(props?.SelectedProp?.siteUrl);
            AllTaskUsers = await web.lists
                .getById(props?.SelectedProp?.TaskUsertListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,IsApprovalMail,Email,SortOrder,Role,IsShowTeamLeader,CategoriesItemsJson,IsTaskNotifications,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver")
                .get();

            // let pageContent = await globalCommon.pageContext();
            // console.log(pageContent)
            taskUsers = AllTaskUsers;
            let UserIds;
            AllTaskUsers?.map((user: any) => {
                if (props?.pageContext?.legacyPageContext?.userId == user?.AssingedToUser?.Id) {
                    loggedInUser = user;
                }

            })
            let CurrentUserId = loggedInUser?.AssingedToUserId;

            taskUsers = AllTaskUsers;
        }
        catch (error) {
            return Promise.reject(error);
        }
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

    const createTask = async () => {
        let currentUserId = loggedInUser?.AssingedToUserId
        var AssignedToIds: any[] = [];
        let MailArrayTitle: any[] = [];
        let ResponsibleIds: any = [];
        let Tasks: any = []
        if (save.taskName.length <= 0) {
            alert("Please Enter The Task Name")
        } else if (save.siteType.length <= 0) {
            alert("Please Select the Site ")
        }
        else {
            setIsTaskCreated(true)
            let CategoryTitle: any;
            let TeamMembersIds: any[] = [];
            subCategories?.map((item: any) => {
                taskCat?.map((cat: any) => {
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
                    if (cat.toLowerCase() === 'User Experience - UX') {
                        AssignedToIds.push(298)
                        TeamMembersIds.push(298);
                        ResponsibleIds.push(49);
                        taskUsers?.map((User: any) => {
                            if (User.Title === 'User Experience - UX' && burgerMenuTaskDetails.TaskType != "User Experience - UX" && TeamMembersIds.length === 0 && User.AssingedToUserId != null && User.AssingedToUserId != '' && User.AssingedToUserId != undefined) {
                                TeamMembersIds.push(User.AssingedToUserId);
                            }
                            else if (User.Title === 'User Experience - UX' && TeamMembersIds.length > 0) {
                                TeamMembersIds.map((workingMember: any) => {
                                    if (workingMember !== 48 && workingMember !== 49 && User.AssingedToUserId != null && User.AssingedToUserId != '' && User.AssingedToUserId != undefined) {
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
                    if (MailName != 'User Experience - UX') {
                        taskUsers?.map((User: any) => {
                            if (User.Title != undefined && MailName.Title != undefined && User.Title.toLowerCase().indexOf(MailName.Title.toLowerCase()) > -1 && User.ItemType != 'Group') {
                                RecipientMail.push(User);
                            }
                            if (MailName?.Title == 'User Experience - UX' && loggedInUser?.AssingedToUserId != 49 && User?.Title == 'Robert Ungethuem') {
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
                let portfolioId: any = null;

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

                    try {
                        if (selectedPortfolio !== undefined && selectedPortfolio.length >= 0) {
                            $.each(selectedPortfolio, function (index: any, smart: any) {
                                if (CategoryTitle?.indexOf("User Experience - UX") < 0) {
                                    if (smart?.AssignedTo && smart?.AssignedTo?.length > 0) {
                                        smart?.AssignedTo.forEach(function (i: any) {
                                            ResponsibleIds.push(i.Id)
                                        })
                                    }
                                    if (smart?.TeamMembers && smart?.TeamMembers?.length > 0) {
                                        smart?.TeamMembers.forEach(function (i: any) {
                                            TeamMembersIds.push(i.Id)
                                        })
                                    }
                                }

                                selectedComponent.push(smart.Id);
                                portfolioId = smart?.Id
                                if (selectedSite?.Parent?.Title == "SDC Sites") {

                                    siteCompositionDetails = smart?.SiteCompositionSettings;
                                    smart?.ClientCategory?.map((cc: any) => {
                                        if (cc.Id != undefined) {
                                            let foundCC = AllClientCategories?.find((allCC: any) => allCC?.Id == cc.Id)
                                            if (selectedSite?.Title?.toLowerCase() == 'shareweb') {
                                                selectedCC.push(cc.Id)
                                            } else if (selectedSite?.Title?.toLowerCase() == foundCC?.siteName?.toLowerCase()) {
                                                selectedCC.push(cc.Id)
                                            }
                                        }
                                    })
                                }
                            })
                        }
                        if (save?.siteType?.toLowerCase() == "shareweb" && selectedPortfolio?.length > 0) {
                            try {
                                postClientTime = JSON.parse(selectedPortfolio[0]?.Sitestagging)
                                siteCompositionDetails = selectedPortfolio[0]?.SiteCompositionSettings;
                            } catch (error) {
                                console.log(error, "Error Client Time")
                            }
                        } else {
                            var siteComp: any = {};
                            siteComp.Title = save?.siteType,
                                siteComp.localSiteComposition = true;
                            siteComp.SiteImages = selectedSite?.Item_x005F_x0020_Cover?.Url;
                            siteComp.ClienTimeDescription = 100,
                                //   siteComp.SiteImages = ,
                                siteComp.Date = moment(new Date().toLocaleString()).format("MM-DD-YYYY");
                            postClientTime = [siteComp]
                        }

                        if (DirectTask == true) {
                            selectedComponent = [QueryPortfolioId];
                            portfolioId = QueryPortfolioId;
                        }

                    } catch (error: any) {
                        console.log(error, 'Site Comp ')
                    }
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



                    //Latest code for Creating Task

                    var newCopyUrl = CopyUrl != undefined ? CopyUrl : '';

                    let ProjectId = null;
                    if (props?.projectId != undefined) {
                        ProjectId = props?.projectId
                    }
                    if ('Id' in selectedProjectData) {
                        ProjectId = selectedProjectData?.Id
                    }
                    var item = {
                        "Title": save.taskName,
                        "Priority": priority,
                        "Categories": CategoryTitle,
                        "DueDate": save.DueDate,
                        "Mileage": save.Mileage,
                        PercentComplete: 0,
                        ResponsibleTeamId: { "results": ResponsibleIds },
                        PortfolioId: portfolioId,
                        TeamMembersId: { "results": TeamMembersIds },
                        ProjectId: ProjectId,
                        // CMSToolComponentId: { "results": $scope.CMSToolComponent },
                        TaskCategoriesId: { "results": taskCat },
                        ClientCategoryId: { "results": selectedCC },
                        // LinkServiceTaskId: { "results": $scope.SaveServiceTaskItemId },
                        "PriorityRank": priorityRank,
                        FeedBack: feedback != null ? JSON.stringify(feedback) : null,
                        ClientActivityJson: ClientActivityJson != null ? JSON.stringify(ClientActivityJson) : null,
                        SiteCompositionSettings: siteCompositionDetails != undefined ? siteCompositionDetails : '',
                        AssignedToId: { "results": AssignedToIds },
                        TaskTypeId: 2,
                        Sitestagging: postClientTime != undefined ? JSON.stringify(postClientTime) : '',
                        ComponentLink: {
                            __metadata: { 'type': 'SP.FieldUrlValue' },
                            Description: save.taskUrl?.length > 0 ? save.taskUrl : null,
                            Url: save.taskUrl?.length > 0 ? save.taskUrl : null,
                        },
                    };
                    if (CategoryTitle?.toLowerCase().indexOf('approval') > -1)
                        item.PercentComplete = 0;
                    if (ResponsibleIds.length > 0) {
                        var ResponsibleTeam = ResponsibleIds;
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
                    let web = new Web(selectedSite?.siteUrl?.Url);
                    await web.lists.getById(selectedSite?.listId).items.add(item).then(async (data) => {
                        let newTitle = data?.data?.Title
                        let CreatedTaskID = data?.data?.Id
                        data.data.siteType = save.siteType;
                        if (CategoryTitle?.indexOf('Immediate') > -1 || CategoryTitle?.indexOf('Email Notification') > -1) {
                            let listID = '3BBA0B9A-4A9F-4CE0-BC15-61F4F550D556'
                            var postData = {
                                __metadata: { 'type': 'SP.Data.ImmediateNotificationsListItem' },
                                "Title": newTitle,
                                "TaskId": CreatedTaskID.toString(),
                                "Site": save.siteType
                            };
                            await createTaskByListId(selectedSite?.siteUrl?.Url, listID, postData, save.siteType)
                        }
                        //     if(CategoryTitle?.indexOf('Immediate') > -1 ){
                        //         await globalCommon?.sendImmediateEmailNotifications(data?.data?.Id, selectedSite?.siteUrl?.Url, selectedSite?.listId, data?.data, undefined, 'Immediate', taskUsers, props?.SelectedProp?.Context).then((response: any) => {
                        //             console.log(response);
                        //         });;
                        //     }

                        // }
                        if (CategoryTitle?.indexOf('Immediate') < -1) {
                            setSendApproverMail(true);
                        }

                        if (CategoryTitle?.indexOf("User Experience - UX") > -1) {
                            globalCommon.sendImmediateEmailNotifications(data?.data?.Id, selectedSite?.siteUrl?.Url, selectedSite?.listId, data?.data, RecipientMail, 'DesignMail', taskUsers, props?.SelectedProp?.Context).then((response: any) => {
                                console.log(response);
                            });
                        }
                        if (CategoryTitle?.indexOf("Approval") > -1) {
                            setSendApproverMail(true);
                            // globalCommon.sendImmediateEmailNotifications(data?.data?.Id, selectedSite?.siteUrl?.Url, selectedSite?.listId, data?.data, RecipientMail, 'ApprovalMail', taskUsers, props?.SelectedProp?.Context).then((response: any) => {
                            //     console.log(response);
                            // });
                        }


                        data.data.siteUrl = selectedSite?.siteUrl?.Url;

                        data.data.listId = selectedSite?.listId;
                        setIsTaskCreated(true)
                        taskCreated = true;
                        createdTask.Id = data?.data?.Id
                        createdTask.siteType = save.siteType
                        data.data.SiteIcon = selectedSite?.Item_x005F_x0020_Cover?.Url;
                        createdTask.SiteIcon = selectedSite?.Item_x005F_x0020_Cover?.Url;
                        if (UserEmailNotify) {

                            if (UserEmailNotify) {

                                let txtComment = `You have been tagged as Attention in the below task by ${loggedInUser?.Title}`;
                                let TeamMsg =
                                    txtComment +
                                    `</br> <a href=${selectedSite?.siteUrl?.Url}>${CreatedTaskID}-${newTitle}</a>`;

                                let sendUserEmail: any = [];
                                TeamMessagearray?.map((userDtl: any) => {
                                    taskUsers?.map((allUserItem: any) => {
                                        if (userDtl?.IsSendAttentionEmail?.Id == allUserItem.AssingedToUserId) {
                                            sendUserEmail.push(allUserItem.Email);
                                        }
                                    });
                                });
                                if (sendUserEmail?.length > 0) {
                                    await globalCommon.SendTeamMessage(
                                        sendUserEmail,
                                        TeamMsg,
                                        props.SelectedProp.Context
                                    );
                                }



                            }






                            // EmailNotificationOnTeams(data.data.siteUrl, data.data.Id, data.data.Title, save.siteType);
                        }
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
                setIsTaskCreated(false)
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
        let TestUrl = e?.target?.value;
        let saveValue = save;
        saveValue.taskUrl = TestUrl;
        if (SitesTypes?.length > 1) {
            let selectedSiteTitle = ''
            var testarray = e?.target?.value?.split('&');
            // TestUrl = $scope.ComponentLink;
            var item = '';
            if (TestUrl !== undefined) {
                if (TestUrl.toLowerCase().indexOf('.com') > -1)
                    TestUrl = TestUrl.split('.com')[1];
                else if (TestUrl.toLowerCase().indexOf('.ch') > -1)
                    TestUrl = TestUrl.split('.ch')[1];
                else if (TestUrl.toLowerCase().indexOf('.de') > -1) {
                    TestUrl = TestUrl.split('.de');
                    try {
                        if (TestUrl[0]?.toLowerCase()?.indexOf('gruene-washington') > -1) {
                            TestUrl = TestUrl[0];
                        } else {
                            TestUrl = TestUrl[1];
                        }
                    } catch (e) { }
                }
                let URLDataArr: any = TestUrl.split('/');
                for (let index = 0; index < SitesTypes?.length; index++) {
                    let site = SitesTypes[index];
                    let Isfound = false;
                    if (TestUrl !== undefined && URLDataArr?.find((urlItem: any) => urlItem?.toLowerCase() == site?.Title?.toLowerCase()) || (site?.AlternativeTitle != null && URLDataArr?.find((urlItem: any) => urlItem?.toLowerCase() == site?.AlternativeTitle?.toLowerCase()))) {
                        item = site.Title;
                        selectedSiteTitle = site.Title;
                        Isfound = true;
                    }
                    if (!Isfound) {
                        if (TestUrl !== undefined && site.AlternativeTitle != null) {
                            let sitesAlterNatives = site.AlternativeTitle.toLowerCase().split(';');
                            for (let j = 0; j < sitesAlterNatives.length; j++) {
                                let element = sitesAlterNatives[j];
                                if (URLDataArr?.find((urlItem: any) => urlItem?.toLowerCase() == element?.toLowerCase())) {
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


    const selectSubTaskCategory = (title: any, Id: any, item: any) => {
        if (item?.Parent?.Title == "Attention") {
            TeamMessagearray.push(item);
            setUserEmailNotify(true)
        }
        if (loggedInUser?.IsApprovalMail?.toLowerCase() == 'approve all but selected items' || loggedInUser?.IsApprovalMail?.toLowerCase() == 'approve selected' && !IsapprovalTask) {
            try {
                let selectedApprovalCat = JSON.parse(loggedInUser?.CategoriesItemsJson)
                IsapprovalTask = selectedApprovalCat?.some((selectiveApproval: any) => selectiveApproval?.Title == title)
                if (IsapprovalTask == true) {
                    subCategories?.map((item: any) => {
                        if (item?.Title == "Approval" && !item.ActiveTile) {
                            selectSubTaskCategory(item?.Title, item?.Id, item)
                        }
                    })
                }
            } catch (error: any) {
                console.log(error, "Can't Parse Selected Approval Categories")
            }
        }

        let activeCategoryArray = activeCategory;
        let TaskCategories: any[] = taskCat;
        if (item.ActiveTile) {
            if (IsapprovalTask && title == 'Approval') {
                console.log('')
            } else {
                item.ActiveTile = !item.ActiveTile;
                activeCategoryArray = activeCategoryArray.filter((category: any) => category !== title);
                TaskCategories = TaskCategories.filter((category: any) => category !== Id);
                if (loggedInUser?.IsApprovalMail?.toLowerCase() == 'approve all but selected items' || loggedInUser?.IsApprovalMail?.toLowerCase() == 'approve selected' && IsapprovalTask) {
                    try {
                        let selectedApprovalCat = JSON.parse(loggedInUser?.CategoriesItemsJson)
                        IsapprovalTask = !selectedApprovalCat?.some((selectiveApproval: any) => selectiveApproval?.Title == title)
                        subCategories?.map((item: any) => {
                            if (item?.Title == "Approval" && item.ActiveTile) {
                                selectSubTaskCategory(item?.Title, item?.Id, item)
                            }
                        })
                    } catch (error: any) {
                        console.log(error, "Can't Parse Selected Approval Categories")
                    }
                }
            }

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
            if (title?.indexOf('User Experience - UX') > -1) {

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
        setTaskCat(TaskCategories)

    }

    const inlineCallBack = React.useCallback((item: any) => {

    }, []);
    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 30,
                id: 'Id',
            },
            , {
                accessorFn: (row: any) => row?.siteType,
                cell: ({ row }) => <span>
                    <img className='circularImage rounded-circle' title={row?.original?.siteType} src={row?.original?.SiteIcon} />
                </span>,
                id: "Site",
                placeholder: "Site",
                header: "",
                resetSorting: false,
                resetColumnFilters: false,
                size: 60,
            },
            {
                accessorKey: "TaskID",
                id: 'TaskID',
                placeholder: "Task Id",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 70,
                cell: ({ row }) => (
                    <>
                        <span className="d-flex">
                            {row?.original?.TaskID}
                        </span>
                    </>
                ),
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row }) => (
                    <>
                        <div className="alignCenter createTableTitle">
                            <span className="column-description2 ">
                                <a
                                    className="text-content hreflink"
                                    title={row?.original?.Title}
                                    href={`${row?.original?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                    data-interception="off"
                                    target="_blank"
                                >
                                    {row?.original?.Title}
                                </a>

                            </span>
                            <span className='mt-1'>
                                {row?.original?.descriptionsSearch !== null && row?.original?.descriptionsSearch != '' && <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />}</span>
                        </div>
                    </>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 480,
            },
            {
                accessorFn: (row) => row?.portfolio?.Title,
                cell: ({ row }) => (
                    <span>
                        <a className="hreflink"
                            data-interception="off"
                            target="blank"
                            href={`${row?.original?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`} >
                            {row?.original?.portfolio?.Title}
                        </a>
                    </span>
                ),
                id: "portfolio",
                placeholder: "Portfolio",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 151,
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
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PriorityRank == filterValue
                },
                id: 'Priority',
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 42
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
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.DisplayDueDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 100
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
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PercentComplete == filterValue
                },
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 42
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span className='alignCenter'>
                        <span className='ms-1'>{row?.original?.CreateDate} </span>
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
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.CreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                isColumnDefultSortingDesc: true,
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                header: "",
                size: 120
            },
            {
                accessorFn: (row) => row?.Modified,
                cell: ({ row }) => (
                    <span className='alignCenter'>
                        <span className='ms-1'>{row?.original?.ModifiedDate} </span>

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
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.Editor?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.ModifiedDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Modified",
                header: "",
                size: 120
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
                id: 'EditPopup',
                accessorKey: "",
                canSort: false,
                resetSorting: false,
                resetColumnFilters: false,
                placeholder: "",
                size: 10
            },
        ],
        []
    );

    const CallBack = React.useCallback((items) => {
        setIsTaskCreated(false)
        setEditTaskPopupData({
            isOpenEditPopup: false,
            passdata: null
        })
        if (items == 'Delete' || items == "Close") {
            if (burgerMenuTaskDetails?.TaskType == 'Bug' || burgerMenuTaskDetails?.TaskType == 'Design' && createdTask?.Id != undefined) {
                window.open(base_Url + "/SitePages/CreateTask.aspx", "_self")
                createdTask = {};
                setIsTaskCreated(false)
            }
        } else if (items == "Save" && createdTask?.Id != undefined) {
            setTimeout(() => {
                window.open(base_Url + "/SitePages/Task-Profile.aspx?taskId=" + createdTask?.Id + "&Site=" + createdTask?.siteType, "_self")
                createdTask = {};
                setIsTaskCreated(false)
            }, 1200)
        }

    }, [])
    const EditPopup = React.useCallback((item: any) => {
        setEditTaskPopupData({
            isOpenEditPopup: true,
            passdata: item
        })
    }, [])
    // Approver Category Email 

    const changeTitle = (e: any) => {
        if (e.target.value.length > 56) {
            alert("Task Title is too long. Please chose a shorter name and enter the details into the task description.")
        } else {
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
        <>  <div className={save.portfolioType == "Service" ? "justify-content-center align-items-start d-flex" : 'justify-content-center align-items-start d-flex'}>
            <div className='creatTaskPage' >
                <div className='generalInfo'>
                    <div>
                        {props?.projectId == undefined ?
                            <h4 className="titleBorder">General Information</h4> : ''}
                        <div className='row p-0'>
                            <div className='col-sm-6  '>
                                <div className='input-group'>
                                    <label className='full-width form-label'>Task Name</label>
                                    <input type="text" placeholder='Enter task Name' className='form-control' value={save.taskName} onChange={(e) => { changeTitle(e) }}></input>
                                </div>
                            </div>
                            <div className='col-sm-3'>
                                <div className="input-group mb-2">
                                    <label className="form-label full-width">
                                        Portfolio Item
                                    </label>
                                    {smartComponentData?.length > 0 ? (
                                        <span className="full-width">
                                            {smartComponentData?.map((com: any) => {
                                                return (
                                                    <>
                                                        <div className="full-width replaceInput pe-0 alignCenter" style={{ width: '90%' }}>
                                                            <a title={com?.Title} target="_blank" data-interception="off" className="textDotted"
                                                                href={`${base_Url}/SitePages/Portfolio-Profile.aspx?taskId=${com?.Id}`} >
                                                                {com?.Title}
                                                            </a>
                                                            <span title="Remove Component" onClick={() => { setSmartComponentData([]), selectedPortfolio = [], setSuggestedProjectsOfporfolio([]) }}
                                                                style={{ backgroundColor: 'black' }} className="svg__iconbox svg__icon--cross hreflink mx-2"></span>
                                                        </div>

                                                    </>
                                                );
                                            })}
                                        </span>
                                    ) : (<input type="text" className="form-control" value={SearchedServiceCompnentKey}
                                        onChange={(e) => autoSuggestionsForServiceAndComponent(e)} placeholder="Search Portfolio Item" />)}
                                    <span className="input-group-text">
                                        <span title="Component Popup" onClick={(e) => EditPortfolio(save, 'Component')}
                                            className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {SearchedServiceCompnentData?.length > 0 ? (
                                        <div className="SmartTableOnTaskPopup">
                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                {SearchedServiceCompnentData.map((Item: any) => {
                                                    return (
                                                        <li className='hreflink list-group-item rounded-0 list-group-item-action p-1' key={Item.id} onClick={() => ComponentServicePopupCallBack([Item], undefined, undefined)} >
                                                            <a>{Item.Path}</a>
                                                        </li>
                                                    )
                                                }
                                                )}
                                            </ul>
                                        </div>) : null}
                                </div>



                            </div>
                            <div className='col-sm-3'>
                                <div className="input-group mb-2">
                                    <label className="form-label full-width">
                                        Project
                                    </label>
                                    {selectedProjectData?.Id != undefined ? (
                                        <span className="full-width">
                                            <div className="full-width replaceInput pe-0 alignCenter" style={{ width: '90%' }}>
                                                <a title={selectedProjectData?.Title} target="_blank" data-interception="off" className="textDotted"
                                                    href={`${base_Url}/SitePages/PX-Profile.aspx?ProjectId=${selectedProjectData?.ID}`} >
                                                    {selectedProjectData?.Title}
                                                </a>
                                                <span title="Remove Project" onClick={() => { setSelectedProjectData({}) }}
                                                    style={{ backgroundColor: 'black' }} className="svg__iconbox svg__icon--cross hreflink mx-2"></span>
                                            </div>

                                        </span>
                                    ) : (<input type="text" className="form-control" value={SearchedProjectKey}
                                        onChange={(e) => autoSuggestionsForProject(e)} placeholder="Search Project/Sprints" />)}
                                    <span className="input-group-text">
                                        <span title="Component Popup" onClick={(e) => EditPortfolio(save, 'Project')}
                                            className="svg__iconbox svg__icon--editBox"></span>
                                    </span>
                                    {SearchedProjectItems?.length > 0 ? (
                                        <div className="SmartTableOnTaskPopup">
                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                {SearchedProjectItems.map((Item: any) => {
                                                    return (
                                                        <li className='hreflink list-group-item rounded-0 list-group-item-action p-1' key={Item.id} onClick={() => ComponentServicePopupCallBack([Item], undefined, undefined)} >
                                                            <a>{Item.Path}</a>
                                                        </li>
                                                    )
                                                }
                                                )}
                                            </ul>
                                        </div>) : null}
                                </div>



                            </div>

                            <div className='col mt-2'>
                                <div className='input-group'>
                                    <label className='full-width'>Task URL</label>
                                    <input type="text" className='form-control' placeholder='Enter task Url' value={save.taskUrl} onChange={(e) => UrlPasteTitle(e)} disabled={burgerMenuTaskDetails?.Siteurl?.length > 0}></input>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {burgerMenuTaskDetails?.ComponentID != undefined ?
                    <div className={refreshPage != true ? 'mt-2' : 'mt-2'}>
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <button className="nav-link active" id="URL-Tasks" data-bs-toggle="tab" data-bs-target="#URLTasks" type="button" role="tab" aria-controls="URLTasks" aria-selected="true">
                                URL TASKS {("(" + (TaskUrlRelevantTask?.length > 0 ? TaskUrlRelevantTask?.length : 0) + ')')}
                            </button>

                            <button className="nav-link " id="Page-Tasks" data-bs-toggle="tab" data-bs-target="#PageTasks" type="button" role="tab" aria-controls="PageTasks" aria-selected="true">
                                PAGE TASKS {("(" + (PageRelevantTask?.length > 0 ? PageRelevantTask?.length : 0) + ')')}
                            </button>

                            <button className="nav-link " id="Component-Tasks" data-bs-toggle="tab" data-bs-target="#ComponentTasks" type="button" role="tab" aria-controls="ComponentTasks" aria-selected="false">
                                COMPONENT TASKS {("(" + (ComponentRelevantTask?.length > 0 ? ComponentRelevantTask?.length : 0) + ')')} </button>

                        </ul>
                        <div className="border border-top-0 clearfix p-2 tab-content " id="myTabContent">
                            <div className="tab-pane Alltable p-0 show active" style={{ maxHeight: "300px", overflow: 'hidden' }} id="URLTasks" role="tabpanel" aria-labelledby="URLTasks">
                                {TaskUrlRelevantTask?.length > 0 ?
                                    <>
                                        <div className={TaskUrlRelevantTask?.length > 0 ? 'fxhg' : ''}>
                                            <GlobalCommanTable wrapperHeight="100%" columns={column2} data={TaskUrlRelevantTask} callBackData={callBackData} />
                                        </div>
                                    </> : <div className='text-center full-width'>
                                        <span>No Tasks Available</span>
                                    </div>
                                }
                            </div>
                            <div className="tab-pane Alltable p-0 " style={{ maxHeight: "300px", overflow: 'hidden' }} id="PageTasks" role="tabpanel" aria-labelledby="PageTasks">
                                {PageRelevantTask?.length > 0 ?
                                    <>
                                        <div className={PageRelevantTask?.length > 0 ? 'fxhg' : ''}>
                                            <GlobalCommanTable wrapperHeight="100%" columns={column2} data={PageRelevantTask} callBackData={callBackData} />
                                        </div>
                                    </> : <div className='text-center full-width'>
                                        <span>No Tasks Available</span>
                                    </div>
                                }
                            </div>
                            <div className="tab-pane Alltable p-0" style={{ maxHeight: "300px", overflow: 'hidden' }} id="ComponentTasks" role="tabpanel" aria-labelledby="ComponentTasks">

                                {ComponentRelevantTask?.length > 0 ?
                                    <>
                                        <div className={ComponentRelevantTask?.length > 0 ? 'fxhg' : ''}>
                                            <GlobalCommanTable wrapperHeight="100%" columns={column2} data={ComponentRelevantTask} callBackData={callBackData} />
                                        </div>
                                    </> : <div className='text-center full-width'>
                                        <span>No Tasks Available</span>
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                    : ''}





                {/*---------------- Sites -------------
                -------------------------------*/}
                {siteType?.length > 1 ?
                    <div className='col mt-4'>
                        <h4 className="titleBorder ">Websites</h4>
                        <div className='clearfix p-0'>
                            <ul className="site-actions">
                                {siteType?.map((item: any) => {
                                    return (
                                        <>
                                            {(item.Title !== undefined && item.Title !== 'Offshore Tasks' && item.Title !== 'Master Tasks' && item.Title !== 'DRR' && item.Title !== 'SDC Sites' && item.Title !== 'QA') &&
                                                <>
                                                    <li
                                                        className={isActive.siteType && save.siteType === item.Title ? 'bgtile active text-center position-relative' : "position-relative bgtile text-center"} onClick={() => setActiveTile("siteType", "siteType", item.Title)} >
                                                        {/*  */}
                                                        <a className=' text-decoration-none' >
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
                        </div>
                    </div> : ''}

                {props?.projectId == undefined ? <>
                    <div className="clearfix"></div>
                    {/*---- Task Categories ---------
                -------------------------------*/}
                    <div className="col" >
                        {TaskTypes?.map((Task: any) => {
                            return (
                                <>
                                    <div className='mt-4 clearfix'>
                                        <h4 className="titleBorder "> {Task?.Title}</h4>
                                        <div className='col p-0 taskcatgoryPannel'  >
                                            {subCategory?.map((item: any) => {
                                                return (
                                                    <>
                                                        {Task.Id === item.ParentID &&
                                                            <a onClick={() => selectSubTaskCategory(item?.Title, item?.Id, item)} id={"subcategorytasks" + item.Id} className={item.ActiveTile ? 'bg-siteColor subcategoryTask active text-center' : 'bg-siteColor subcategoryTask text-center'} >
                                                                <span className="tasks-label">{item.Title}</span>
                                                            </a>
                                                        }
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </>)
                        })}
                    </div>
                    <div className="clearfix"></div>
                    {/*-----Priority Rank ---------------------------------------*/}
                    <div className='col clearfix mt-4'>
                        <h4 className="titleBorder ">Priority Rank</h4>

                        {/* <legend className="border-bottom fs-6">Priority Rank</legend> */}
                        <div className="taskcatgoryPannel alignCenter Priority">
                            <span className='me-2'>High priority</span>
                            {priorityRank?.map((item: any) => {
                                return (
                                    <a className={isActive.rank && save.rank === item.Title ? 'subcategoryTask active' : 'subcategoryTask'} onClick={() => setActiveTile("rank", "rank", item.Title)}> {item?.Title} </a>
                                )
                            })}
                            <span className='ms-3'>Low priority</span>

                        </div>

                    </div>
                    <div className="clearfix"></div>
                    {/*-----Time --------
                -------------------------------*/}

                    <div className='col mt-4 clearfix'>
                        <h4 className="titleBorder">Time</h4>
                        <div className="taskcatgoryPannel">
                            {Timing?.map((item: any) => {
                                return (
                                    <a className={isActive.time && save.Time === item.Title ? ' active subcategoryTask' : 'subcategoryTask'} onClick={() => setActiveTile("Time", "time", item.Title)}>{item.Title}</a>
                                )
                            })}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    {/*-----Due date --------
                -------------------------------*/}
                    <div className='col mt-4'>
                        <h4 className="titleBorder ">Due Date</h4>
                        <div className="taskcatgoryPannel">
                            <a className={isActive.dueDate && save.dueDate === 'Today' ? 'subcategoryTask active text-center' : 'subcategoryTask'} onClick={() => setActiveTile("dueDate", "dueDate", 'Today')}>Today&nbsp;{moment(new Date()).format('DD/MM/YYYY')}</a>
                            <a className={isActive.dueDate && save.dueDate === 'Tomorrow' ? 'subcategoryTask active text-center' : 'subcategoryTask'} onClick={() => setActiveTile("dueDate", "dueDate", 'Tomorrow')} id="Tomorrow">Tomorrow</a>
                            <a className={isActive.dueDate && save.dueDate === 'ThisWeek' ? 'subcategoryTask active text-center' : 'subcategoryTask'} onClick={() => setActiveTile("dueDate", "dueDate", 'ThisWeek')} id="ThisWeek">This Week</a>
                            <a className={isActive.dueDate && save.dueDate === 'NextWeek' ? 'subcategoryTask active text-center' : 'subcategoryTask'} onClick={() => setActiveTile("dueDate", "dueDate", 'NextWeek')} id="NextWeek">Next Week</a>
                            <a className={isActive.dueDate && save.dueDate === 'ThisMonth' ? 'subcategoryTask active text-center' : 'subcategoryTask'} onClick={() => setActiveTile("dueDate", "dueDate", 'ThisMonth')} id="ThisMonth">This Month</a>
                        </div>
                    </div>
                </> : ''}

                <footer className='col text-end mt-3'>
                    {
                        siteType?.map((site: any) => {
                            if (site.Title === save.siteType) {
                                return (
                                    <span className='ms-2'>
                                        {(site.Item_x005F_x0020_Cover !== undefined && site.Item_x005F_x0020_Cover?.Url !== undefined) &&
                                            <img className="createTask-SiteIcon mx-2" style={{ width: '31.5px' }} src={site.Item_x005F_x0020_Cover.Url} />
                                        }
                                    </span>
                                )
                            }
                        })
                    }
                    <button type="button" disabled={isTaskCreated} className='btn btn-primary bg-siteColor ' onClick={() => createTask()}>Submit</button>
                </footer>


                {(IsOpenPortfolio || ProjectManagementPopup) && (
                    <ServiceComponentPortfolioPopup
                        props={CMSToolComponent}
                        Dynamic={AllListId}
                        Call={ComponentServicePopupCallBack}
                        selectionType={"Single"}
                        groupedData={IsOpenPortfolio == true ? groupedComponentData : groupedProjectData}
                        showProject={ProjectManagementPopup}
                    />
                )}
                {editTaskPopupData.isOpenEditPopup ? <EditTaskPopup context={props?.SelectedProp.Context} SDCTaskDetails={burgerMenuTaskDetails}
                    sendApproverMail={sendApproverMail} AllListId={AllListId} Items={editTaskPopupData.passdata} Call={CallBack} pageType={'createTask'} /> : ''}
            </div >
            {(SuggestedProjectsOfporfolio?.length > 0 || relevantProjects?.length > 0) ?
                <span className="ms-4">
                    {SuggestedProjectsOfporfolio?.length > 0 ?
                        <div className="card mb-3">
                            <div className="card-body">
                                <h6 className="f-15 title titleBorder">Suggested Projects</h6>
                                <ul className="SpfxCheckRadio list-group list-group-flush">
                                    {SuggestedProjectsOfporfolio?.map((project: any) => {
                                        return (
                                            <li className='hreflink px-0 list-group-item rounded-0 list-group-item-action' >
                                                <input type="radio" className="radio" onClick={() => ComponentServicePopupCallBack([project], undefined, undefined)} checked={selectedProjectData?.Title == project?.Title} />
                                                <a className="hreflink" title={`${project?.PortfolioStructureID} - ${project?.Title}`} href={`${base_Url}/SitePages/PX-Profile.aspx?ProjectId=${project?.Id}`}
                                                    data-interception="off" target="_blank">{`${project?.PortfolioStructureID} - ${project?.Title}`}</a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        : ''}
                    {relevantProjects?.length > 0 ?
                        <div className="card mb-3">
                            <div className="card-body">
                                <h6 className="f-15 title titleBorder">Relevant Projects</h6>
                                <ul className="SpfxCheckRadio  list-group list-group-flush">
                                    {relevantProjects?.map((project: any) => {
                                        return (
                                            <li className='hreflink px-0 list-group-item rounded-0 list-group-item-action'>
                                                <input type="radio" className="radio" onClick={() => ComponentServicePopupCallBack([project], undefined, undefined)} checked={selectedProjectData?.Title == project?.Title} />
                                                <a className="hreflink" title={`${project?.PortfolioStructureID} - ${project?.Title} (${project?.Count})`} href={`${base_Url}/SitePages/PX-Profile.aspx?ProjectId=${project?.Id}`}
                                                    data-interception="off" target="_blank">{`${project?.PortfolioStructureID} - ${project?.Title} (${project?.Count})`}</a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        : ''}


                </span> : ''
            }
        </div >
        </>
    )
}

export default CreateTaskComponent;