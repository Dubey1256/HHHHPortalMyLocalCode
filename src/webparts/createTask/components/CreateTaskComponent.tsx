import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Web } from "sp-pnp-js";
import pnp, { PermissionKind } from "sp-pnp-js";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as moment from 'moment';
import ComponentPortPolioPopup from '../../EditPopupFiles/ComponentPortfolioSelection';
import LinkedComponent from '../../../globalComponents/EditTaskPopup/LinkedComponent';
import { GlobalConstants } from '../../../globalComponents/LocalCommon';
import * as globalCommon from '../../../globalComponents/globalCommon';
import { Item } from '@pnp/sp/items';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
let AllMetadata: any = []
let siteConfig: any = []
let AssignedToUsers: any = []
let SitesTypes: any = []
let AllComponents: any = []
let taskUsers: any = [];
let loggedInUser: any;
let oldTaskIrl = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx";
let Isapproval;
function CreateTaskComponent(props: any) {

    const [linkedComponentData, setLinkedComponentData] = React.useState([]);
    const [siteType, setSiteType] = React.useState([])
    const [TaskTypes, setTaskTypes] = React.useState([])
    const [subCategory, setsubCategory] = React.useState([])
    const [priorityRank, setpriorityRank] = React.useState([])
    const [IsComponent, setIsComponent] = React.useState(false);
    const [sharewebCat, setSharewebCat] = React.useState([]);
    const [IsServices, setIsServices] = React.useState(false);
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [Timing, setTiming] = React.useState([])
    const [isActive, setIsActive] = React.useState({
        siteType: false,
        time: false,
        rank: false,
        dueDate: false,

    });
    const [relevantTasks, setRelevantTasks]: any = React.useState([]);
    const [isActiveCategory, setIsActiveCategory] = React.useState(false);
    // const [isActiveCategory, setIsActiveCategory] = React.useState({});
    const [activeCategory, setActiveCategory] = React.useState([]);
    const [ShareWebComponent, setShareWebComponent] = React.useState('');
    // const [taskUrl, setTaskUrl] = React.useState('');
    const [burgerMenuTaskDetails, setBurgerMenuTaskDetails] = React.useState({
        ComponentID: undefined,
        Siteurl: undefined,
    });
    const [save, setSave] = React.useState({ siteType: '', linkedServices: [], recentClick: undefined, Mileage: '', DueDate: undefined, dueDate: '', taskCategory: '', taskCategoryParent: '', rank: undefined, Time: '', taskName: '', taskUrl: undefined, portfolioType: 'Component', Component: [] })
    React.useEffect(() => {
        LoadTaskUsers();
        GetComponents();
        GetSmartMetadata();
    }, [])
    React.useEffect(() => {
        LoadTaskUsers();
    }, [relevantTasks])

    const GetComponents = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let componentDetails = [];
        componentDetails = await web.lists
            //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
            .getByTitle('Master Tasks')
            .items
            //.getById(this.state.itemID)
            .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "SharewebCategories/Id", "SharewebCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("Team_x0020_Members", "Author", "ClientCategory", "Parent", "SharewebCategories", "AssignedTo", "ClientCategory")
            .top(4999)
            .get()
        return componentDetails;
    }
    const EditComponent = (item: any, title: any) => {
        setIsComponent(true);
        setShareWebComponent(item);
    }
    const EditLinkedServices = (item: any, title: any) => {
        setIsServices(true);
        setShareWebComponent(item);
    }
    const Call = (propsItems: any, type: any) => {
        setIsComponent(false);
        if (type === "LinkedComponent") {
            if (propsItems?.linkedComponent?.length > 0) {
                setSave({ ...save, linkedServices: propsItems.linkedComponent });
                setLinkedComponentData(propsItems.linkedComponent);
            }
        }
        if (type === "SmartComponent") {
            if (propsItems?.smartComponent?.length > 0) {
                setSave({ ...save, Component: propsItems.smartComponent });
                setSmartComponentData(propsItems.smartComponent);
            }
        }

    };
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
        const params = new URLSearchParams(window.location.search);

        AllComponents = await GetComponents();
        let paramSiteUrl = params.get("Siteurl");
        let paramComponentId = params.get('ComponentID');
        let paramType = params.get('Type');
        let paramServiceId = params.get('ServiceID');
        let previousTaggedTaskToComp: any[] = []
        if (paramComponentId == undefined && paramSiteUrl != undefined && paramType == undefined) {
            paramComponentId = "756";
        }
        else if (paramComponentId == undefined && paramServiceId == undefined && paramSiteUrl != undefined && paramType == 'Service') {
            paramServiceId = "4497";
        }
        setBurgerMenuTaskDetails({
            ComponentID: paramComponentId,
            Siteurl: paramSiteUrl
        })
        if (paramSiteUrl != undefined) {
            let baseUrl = window.location.href;
            if (baseUrl.indexOf('CreateTaskSpfx') > -1) {
                let QueryString = baseUrl.split("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTaskSpfx.aspx")[1]
                oldTaskIrl = oldTaskIrl + QueryString
            }
        }
        if (paramComponentId != undefined) {
            let setComponent: any = [];
            AllComponents.map((item: any) => {
                if (item?.Id == paramComponentId) {
                    setComponent.push(item)
                    setSave({ ...save, Component: setComponent });
                    setSmartComponentData(setComponent);
                }
            })
            if (paramSiteUrl != undefined) {
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
            }

            let query = "Categories,AssignedTo/Title,AssignedTo/Name,Component/Id,Priority_x0020_Rank,SharewebTaskType/Id,SharewebTaskType/Title,Component/Title,Services/Id,Services/Title,AssignedTo/Id,AttachmentFiles/FileName,component_x0020_link/Url,FileLeafRef,SharewebTaskLevel1No,SharewebTaskLevel2No,Title,Id,Priority_x0020_Rank,PercentComplete,Company,WebpartId,StartDate,DueDate,Status,Body,WebpartId,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=AssignedTo,AttachmentFiles,SharewebTaskType,Component,Services,Author,Editor&$orderby=Modified desc&$filter=Component/Id eq  '" + paramComponentId + "'"
            loadRelevantTask(query)
        }


    }
    const loadRelevantTask = async (query: any) => {
        try {
            let SiteTaskTaggedToComp: any[] = []
            let count = 0
            SitesTypes.map(async (site: any) => {
                await globalCommon.getData(site?.siteUrl?.Url, site?.listId, query).then((data: any) => {
                    data.map((item: any) => {

                        item.siteCover = site?.Item_x005F_x0020_Cover?.Url
                        item.siteType = site.siteName;
                        item.TaskName = item.Title;
                        taskUsers.map((user: any) => {
                            if (user?.AssingedToUser?.Id == item.Author.Id) {
                                item.AuthorCover = user?.Item_x0020_Cover?.Url
                            }
                            if (user?.AssingedToUser?.Id == item.Editor.Id) {
                                item.EditorCover = user?.Item_x0020_Cover?.Url
                            }

                        })

                        item.Author = item.Author.Title;
                        item.Editor = item.Editor.Title;
                        item.PercentComplete = item?.PercentComplete * 100;
                        item.Priority = item.Priority_x0020_Rank * 1;
                        if (item.Categories == null)
                            item.Categories = '';
                        //type.Priority = type.Priority.split('')[1];
                        //type.Component = type.Component.results[0].Title,
                        item.ComponentTitle = '';
                        if (item?.Component?.results?.length > 0) {
                            item.Component.results.map((comResult: any) => {
                                item.ComponentTitle = comResult.Title + ';' + item.ComponentTitle;
                            })
                        }
                        else {
                            item.ComponentTitle = '';
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

                        item.Shareweb_x0020_ID = globalCommon.getTaskId(item);

                        item.TaskDueDate = moment(item?.DueDate).format('YYYY-MM-DD');
                        if (item.TaskDueDate == "Invalid date" || item.TaskDueDate == undefined) {
                            item.TaskDueDate = '';
                        }
                        item.CreateDate = moment(item?.Created).format('YYYY-MM-DD');
                        item.CreatedSearch = item.CreateDate + '' + item.Author;
                        item.DateModified = item.Modified;
                        item.ModifiedDate = moment(item?.Modified).format('YYYY-MM-DD');
                        item.ModifiedSearch = item.ModifiedDate + '' + item.Editor;
                        if (item.siteType != 'Offshore Tasks') {
                            try {
                                SiteTaskTaggedToComp.push(item);
                            } catch (error) {
                                console.log(error.message)
                            }
                        }
                    })
                })
                count++;
                if (count == SitesTypes.length - 1) {
                    console.log("inside Set Task")
                    setRelevantTasks(SiteTaskTaggedToComp)
                }


            })
        } catch (error) {
            console.log(error.message)
        }


    }
    const GetSmartMetadata = async () => {
        var TaskTypes: any = []
        var Priority: any = []
        var Timing: any = []
        var subCategories: any = []
        var Task: any = []
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
        siteConfig.map((site: any) => {
            if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== 'Health' && site.Title !== 'Gender') {
                SitesTypes.push(site);
            }
        })
        setSiteType(SitesTypes)
        TaskTypes = getSmartMetadataItemsByTaxType(AllMetadata, 'Categories');
        Priority = getSmartMetadataItemsByTaxType(AllMetadata, 'Priority Rank');
        Timing = getSmartMetadataItemsByTaxType(AllMetadata, 'Timings');
        setTiming(Timing)
        setpriorityRank(Priority)

        TaskTypes.map((task: any) => {
            if (task.ParentID !== undefined && task.ParentID === 0 && task.Title !== 'Phone') {
                Task.push(task);
                getChilds(task, TaskTypes);
            }
            if (task.ParentID !== undefined && task.ParentID !== 0 && task.IsVisible) {
                subCategories.push(task);
            }
        })
        Task.map((taskItem: any) => {
            subCategories?.map((item: any) => {
                if (taskItem.Id === item.ParentID) {
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
        let AllTaskUsers = await globalCommon.loadTaskUsers();
        taskUsers = AllTaskUsers;
        let UserIds;
        AllTaskUsers.map((item: any) => {
            if (props?.pageContext?.user?.loginName == item.Email || props?.pageContext?.user?.loginName == item?.AssingedToUser?.EMail) {
                loggedInUser = item;
            }
        })
        let CurrentUserId = loggedInUser.AssingedToUserId;
        AllTaskUsers.map((user: any) => {
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
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
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
        items.map((childItem: any) => {
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
        } else {
            let CategoryTitle: any;
            let TeamMembersIds: any[] = [];
            sharewebCat.map((cat: any) => {
                subCategory?.map((item: any) => {
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
                CategoryTitle.split(';').map((cat: any) => {
                    if (cat.toLowerCase() === 'design') {
                        taskUsers.map((User: any) => {
                            if (User.Title === 'Design' && TeamMembersIds.length === 0) {
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

            AssignedToUsers.map((user: any) => {
                AssignedToIds.push(user.AssingedToUserId);
            });
            if (TeamMembersIds.length > 0) {
                TeamMembersIds.map((workingMember: any) => {
                    if (workingMember === 48 || workingMember === 49) {
                        AssignedToIds.push(workingMember);
                    }
                })
            }
            let RecipientMail: any = []
            if (MailArrayTitle != undefined && MailArrayTitle.length > 0) {
                RecipientMail = [];
                MailArrayTitle.map((MailName: any) => {
                    if (MailName != 'Design') {
                        taskUsers.map((User: any) => {
                            if (User.Title != undefined && MailName.Title != undefined && User.Title.toLowerCase().indexOf(MailName.Title.toLowerCase()) > -1 && User.ItemType != 'Group') {
                                RecipientMail.push(User);
                            }
                        });
                    }
                });
            }

            try {
                let selectedComponent: any[] = [];
                if (save.Component !== undefined && save.Component.length > 0) {
                    save.Component.map((com: any) => {
                        if (save.Component !== undefined && save.Component.length >= 0) {
                            $.each(save.Component, function (index: any, smart: any) {
                                selectedComponent.push(smart.Id);
                            })
                        }
                    })
                }
                let selectedService: any[] = [];
                if (save.linkedServices !== undefined && save.linkedServices.length > 0) {
                    save.linkedServices.map((com: any) => {
                        if (save.linkedServices !== undefined && save.linkedServices.length >= 0) {
                            $.each(save.linkedServices, function (index: any, smart: any) {
                                selectedService.push(smart.Id);
                            })
                        }
                    })
                }
                let CopyUrl;
                if (save.taskUrl != undefined && save.taskUrl.length > 255) {
                    CopyUrl = save.taskUrl
                    save.taskUrl = save.taskUrl.slice(0, 255)

                }
                let selectedSite: any;
                let priority: any;
                if (save.siteType !== undefined && save.siteType.length > 0) {
                    siteType.map((site: any) => {
                        if (site.Title === save.siteType) {
                            selectedSite = site;
                        }
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

                        var query = "SiteCompositionSettings,Sitestagging&$top=1&$filter=Id eq " + smartComponentData[0]?.Id;
                        const web = new Web(GlobalConstants.SP_SITE_URL);
                        await web.lists.getById(GlobalConstants.MASTER_TASKS_LISTID).items.select(query).get().then((data: any) => {
                            Tasks = data.data;
                        });
                    }

                    //Latest code for Creating Task

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
                        Responsible_x0020_TeamId: { "results": AssignedIds },
                        Team_x0020_MembersId: { "results": TeamMembersIds },
                        // SharewebComponentId: { "results": $scope.SharewebComponent },
                        SharewebCategoriesId: { "results": sharewebCat },
                        // LinkServiceTaskId: { "results": $scope.SaveServiceTaskItemId },
                        "Priority_x0020_Rank": priorityRank,
                        SiteCompositionSettings: '',
                        AssignedToId: { "results": AssignedToIds },
                        SharewebTaskTypeId: 2,
                        ClientTime: '',
                        component_x0020_link: {
                            __metadata: { 'type': 'SP.FieldUrlValue' },
                            Description: save.taskUrl?.length > 0 ? save.taskUrl : null,
                            Url: save.taskUrl?.length > 0 ? save.taskUrl : null,
                        },
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
                        item.Responsible_x0020_TeamId = { "results": ResponsibleTeam }
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
                        item.Responsible_x0020_TeamId = { "results": ResponsibleTeam }
                    }
                    if (Tasks != undefined && save.siteType == 'Shareweb') {
                        item.SiteCompositionSettings = Tasks[0]?.SiteCompositionSettings;
                        item.ClientTime = Tasks[0]?.Sitestagging;
                    }



                    //Code End

                    //Old itm Code 
                    // {
                    //     Title: save.taskName,
                    //     Priority_x0020_Rank: priorityRank,
                    //     Priority: priority,
                    //     PercentComplete: 0,
                    //     component_x0020_link: {
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
                    //     Team_x0020_MembersId: { "results": TeamMembersIds },
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
                        }
                        data.data.siteUrl = selectedSite?.siteUrl?.Url;
                        data.data.siteType = save.siteType;
                        data.data.siteUrl = selectedSite?.siteUrl?.Url;
                        window.open("https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + data.data.Id + "&Site=" + save.siteType, "_self")

                    })
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    }
    var createTaskByListId = async (siteUrl: any, listId: any, postData: any, siteName: any) =>{

        var currentUserId = loggedInUser.AssingedToUserId
        if (postData.Categories != undefined && (postData.Categories.toLowerCase().indexOf('approval') > -1)) {
            globalCommon.makePostDataForApprovalProcess(postData)
                .then(async (Data: any)=> {
                   await globalCommon.addData(siteUrl, listId, Data.postData)
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

    // const urlChange = (e: any) => {
    //    // setTaskUrl(e.target.value)
    //     UrlPasteTitle(e)
    // }

    const UrlPasteTitle = (e: any) => {
        let selectedSiteTitle = ''
        var testarray = e.target.value.split('&');
        let TestUrl = e.target.value;
        let saveValue = save;
        saveValue.taskUrl = TestUrl;
        // TestUrl = $scope.component_x0020_link;
        var item = '';
        if (TestUrl !== undefined) {
            SitesTypes.map((site: any) => {
                if (TestUrl.toLowerCase().indexOf('.com') > -1)
                    TestUrl = TestUrl.split('.com')[1];
                else if (TestUrl.toLowerCase().indexOf('.ch') > -1)
                    TestUrl = TestUrl.split('.ch')[1];
                else if (TestUrl.toLowerCase().indexOf('.de') > -1)
                    TestUrl = TestUrl.split('.de')[1];
                if (TestUrl !== undefined && ((TestUrl.toLowerCase().indexOf('/eps/')) > -1) && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() === 'eps') {
                        item = site.Title === 'EPS' ? item = 'EPS' : site = site.Title;
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/ei/') > -1 || TestUrl.toLowerCase().indexOf('/ee/') > -1) && TestUrl.toLowerCase().indexOf('/digitaladministration/') <= -1 && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() === 'ei') {
                        item = site.Title === 'EI' ? item = 'EI' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/digitaladministration/') > -1) && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() === 'alakdigital') {
                        item = site.Title === 'ALAKDigital' ? item = 'ALAKDigital' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/migration/') > -1) && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() === 'migration') {
                        item = site.Title === 'Migration' ? item = 'MIGRATION' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/education/') > -1)) {
                    if (site.Title.toLowerCase() === 'education') {
                        item = site.Title === 'Education' ? item = 'Education' : site = site.Title;
                        // if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/gender/') > -1)) {
                    if (site.Title.toLowerCase() === 'gender') {
                        item = site.Title === 'Gender' ? item = 'Gender' : site = site.Title;
                        // if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/drr/') > -1)) {
                    if (site.Title.toLowerCase() === 'drr') {
                        item = site.Title === 'DRR' ? item = 'DRR' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/health') > -1)) {
                    if (site.Title.toLowerCase() === 'health') {
                        item = site.Title === 'Health' ? item = 'Health' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }

                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/development-effectiveness/')) > -1 && TestUrl.toLowerCase().indexOf('smartconnect-shareweb') <= -1) {
                    if (site.Title.toLowerCase() === 'de') {
                        item = site.Title === 'DE' ? item = 'DE' : site = site.Title;
                        // if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/qa/') > -1)) {
                    if (site.Title.toLowerCase() === 'qa') {
                        item = site.Title === 'QA' ? item = 'QA' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/shareweb') > -1)) {
                    if (site.Title.toLowerCase() === 'shareweb') {
                        item = site.Title === 'Shareweb' ? item = 'Shareweb' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/joint') > -1)) {
                    if (site.Title.toLowerCase() === 'shareweb') {
                        item = site.Title === 'Shareweb' ? item = 'Shareweb' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('www.gruene-washington.de') > -1)) {
                    if (site.Title.toLowerCase() === 'gruene') {
                        item = site.Title === 'Gruene' ? item = 'Gruene' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('kathabeck.sharepoint.com') > -1)) {
                    if (site.Title.toLowerCase() === 'kathabeck') {
                        item = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('hhhhteams.sharepoint.com') > -1) || (TestUrl.toLowerCase().indexOf('hhhh') > -1)) {
                    if (site.Title.toLowerCase() === 'hhhh') {
                        item = site.Title === 'HHHH' ? item = 'HHHH' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('hhhhteams.sharepoint.com') > -1)) {
                    if (site.Title.toLowerCase() === 'Offshore Tasks') {
                        item = site.Title === 'Offshore Tasks' ? item = 'Offshore Tasks' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
                if (TestUrl !== undefined && (TestUrl.toLowerCase().indexOf('/sco-belgrade-online-monitoring-tool') > -1)) {
                    if (site.Title.toLowerCase() === 'shareweb') {
                        item = site.Title === 'Shareweb' ? item = 'Shareweb' : site = site.Title;
                        //if (item !== undefined && getLatestSiteName.toLowerCase() === site.Title.toLowerCase())
                        // setSelectedsiteType(site);
                        selectedSiteTitle = site.Title
                    }
                }
            })
            //if (item !== undefined && getLatestSiteName.toLowerCase() === item.toLowerCase())
            //$scope.selectedsiteMetadata(item);
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

    // const handleClick = (event: any) => {
    //     setIsActiveSite(current => !current);
    // };


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
    // const handleClick4 = (event: any) => {
    //     setIsActiveTime(current => !current);
    // };
    const selectPortfolioType = (item: any) => {
        if (item === 'Component') {
            setSave({ ...save, portfolioType: 'Component' })
            setSmartComponentData([])
        }
        if (item === 'Service') {
            setSave({ ...save, portfolioType: 'Service' })
            setLinkedComponentData([])
        }

    }

    const selectSubTaskCategory = (title: any, Id: any, item: any) => {


        let activeCategoryArray = activeCategory;
        let SharewebCategories: any[] = sharewebCat;
        if (item.ActiveTile) {
            item.ActiveTile = !item.ActiveTile;
            activeCategoryArray = activeCategoryArray.filter((category: any) => category !== title);
            SharewebCategories = SharewebCategories.filter((category: any) => category !== Id);

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
                taskUsers.map((User: any) => {
                    if (User.Role == 'QA') {
                        AssignedToUsers.filter((item: any) => item.Id != User.Id)
                        AssignedToUsers.push(User);
                        flag = false;
                    }
                });
            }
            if (title.indexOf('Design') > -1) {
                var flag = true;
                taskUsers.map((User: any) => {
                    if (User.Role == 'Developer' && User.Title == 'Design Team') {
                        AssignedToUsers.filter((item: any) => item.Id != User.Id)
                        AssignedToUsers.push(User);
                        flag = false;
                    }
                });
            }
            if (title.indexOf('Support') > -1) {
                var flag = true;
                taskUsers.map((User: any) => {
                    if (User.Role == 'Developer' && User.Title == 'Support') {
                        AssignedToUsers.filter((item: any) => item.Id != User.Id)
                        AssignedToUsers.push(User);
                        flag = false;
                    }
                });
            }
            item.ActiveTile = !item.ActiveTile;
            activeCategoryArray.push(title);
            SharewebCategories.push(Id)
        }
        setIsActiveCategory(!isActiveCategory)
        setActiveCategory(activeCategoryArray)
        setSharewebCat(SharewebCategories)

    }

    const columns: GridColDef[] = [
        { field: 'siteType', headerName: 'Site', width: 60, renderCell: (params) => <img className="client-icons" src={params?.row?.siteCover} /> },
        { field: 'Shareweb_x0020_ID', headerName: 'Task Id', width: 100 },
        {
            field: 'Title', headerName: 'Title', width: 250, renderCell: (params) => {
                return (
                    <div>
                        <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${params?.row?.Id}&Site=${params?.row?.siteType}`}>{params?.row?.Title}</a></span>
                    </div>
                )
            }
        },
        { field: 'TaskDueDate', headerName: 'Due Date', width: 120 },
        {
            field: 'Created', headerName: 'Created', width: 120, renderCell: (params) => {
                return (
                    <div>
                        {params?.row?.AuthorCover != undefined ? <img className="client-icons" title={params?.row?.Author} src={params?.row?.AuthorCover} alt='' /> : ''}

                        {params.row.CreateDate}
                    </div>
                )
            }
        },
        {
            field: 'Modified', headerName: 'Modified', width: 120, renderCell: (params) => {
                return (
                    <div>
                        {params?.row?.EditorCover != undefined ? <img className="client-icons" title={params?.row?.Editor} src={params?.row?.EditorCover} alt='' /> : ''}

                        {params.row.ModifiedDate}
                    </div>
                )
            }
        },
    ];

    return (
        <>  <div className={save.portfolioType == "Service" ? "serviepannelgreena" : ''}>
            <div className='Create-taskpage'>
                <div className='row'>
                    <div className='col-sm-12'>
                        <dl className='d-grid text-right pull-right'><span className="pull-right"> <a target='_blank' data-interception="off" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx" style={{ cursor: "pointer" }}>Old Create Task</a></span></dl>
                    <div className='col-sm-12 p-0'>
                        <dl className='d-grid text-right pull-right'><span className="pull-right"> <a target='_blank' href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx" style={{ cursor: "pointer" }}>Old Create Task</a></span></dl>
                    </div>
                    <div className='col-sm-6 ps-0'>
                        <label className='full-width'>Task Name</label>
                        <input type="text" placeholder='Enter task Name' className='full-width' value={save.taskName} onChange={(e) => setSave({ ...save, taskName: e.target.value })}></input>
                    </div>
                    <div className='col-sm-2 mt-4'>
                        <input
                            type="radio" className="form-check-input radio  me-1" defaultChecked={save.portfolioType === 'Component'}
                            name="taskcategory" onChange={() => selectPortfolioType('Component')} />
                        <label className='form-check-label me-2'>Component</label>
                        {
                            burgerMenuTaskDetails?.ComponentID == undefined ? <><input
                                type="radio" className="form-check-input radio  me-1"
                                name="taskcategory" onChange={() => selectPortfolioType('Service')} />
                                <label className='form-check-label'>Service</label></> : ''
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
                                {smartComponentData ? smartComponentData?.map((com: any) => {
                                    return (
                                        <>
                                            <div className="d-flex Component-container-edit-task" style={{ width: "81%" }}>
                                                <a style={{ color: "#fff !important" }} target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                <a>
                                                    <img className="mx-2" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />
                                                </a>
                                            </div>
                                        </>
                                    )
                                }) : null}

                                <span className="input-group-text">
                                    <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                        onClick={(e) => EditComponent(save, 'Component')} />
                                </span>
                            </div> : ''
                    }
                        {
                            save.portfolioType === 'Service' ? <div className="input-group">
                                <label className="form-label full-width">
                                    Service Portfolio
                                </label>
                                {
                                    linkedComponentData?.length > 0 ? <div>
                                        {linkedComponentData?.map((com: any) => {
                                            return (
                                                <>
                                                    <div className="d-flex Component-container-edit-task">
                                                        <div>
                                                            <a className="hreflink " target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                {com.Title}
                                                            </a>
                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setLinkedComponentData([])} />
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </div> :
                                        <input type="text" readOnly
                                            className="form-control"
                                        />
                                }
                                <span className="input-group-text">
                                    <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                        onClick={(e) => EditLinkedServices(save, 'Component')} />
                                </span>
                            </div> : ''
                        }
                    </div>
                </div>
                <div className='row mt-2'>
                    <div className='col-sm-12 p-0'>
                        <input type="text" placeholder='Enter task Url' value={taskUrl} className='col-sm-12' onChange={(e) => urlChange(e)} disabled={burgerMenuTaskDetails?.Siteurl?.length > 0}></input>

                    </div>
                </div>
                {relevantTask.length > 0 ?
                    <> 
                        <div className=' mb-5 mt-2 fxhg'>
                        <label >Component Tasks({relevantTask.length}) </label>
                            <DataGrid rows={relevantTask} columns={columns} getRowId={(row: any) => row.Shareweb_x0020_ID} />
                        </div>
                    </>
                    : ''
                }

                {/*---------------- Sites -------------
            -------------------------------*/}
                    <div className='row mt-2 border'>
                        <fieldset>
                            <legend className="border-bottom fs-6 ">Sites</legend>
                            <ul className="quick-actions ">
                                {siteType.map((item: any) => {
                                    return (
                                        <>
                                            {(item.Title !== undefined && item.Title !== 'Offshore Tasks' && item.Title !== 'Master Tasks' && item.Title !== 'DRR' && item.Title !== 'SDC Sites' && item.Title !== 'QA') &&
                                                <>
                                                    <li
                                                        className={isActive.siteType && save.siteType === item.Title ? '  mx-1 p-2 bg-siteColor selectedTaskList text-center mb-2 position-relative' : "mx-1 p-2 position-relative bg-siteColor text-center  mb-2"} onClick={() => setActiveTile("siteType", "siteType", item.Title)} >
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
                    {/*---- Task Categories ---------
            -------------------------------*/}
                    <div className='row mt-2 border'>
                        <fieldset >
                            <legend className="border-bottom fs-6">Task Categories</legend>
                            <div className="row " style={{ width: "100%" }}>
                                {TaskTypes.map((Task: any) => {
                                    return (
                                        <>
                                            <>
                                                <div
                                                    className=" col-sm-2 mt-1 text-center"  >
                                                    <div id={"subcategorytasks" + Task.Id} className={isActiveCategory ? 'task manage_tiles' : 'task manage_tiles'}>
                                                        <div className='bg-siteColor py-3'>
                                                            {(Task.Item_x005F_x0020_Cover !== undefined && Task.Item_x005F_x0020_Cover.Url !== undefined) &&
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
                    {/*-----Priority Rank --------
            -------------------------------*/}
                    <div className='row mt-2 border'>
                        <fieldset>
                            <legend className="border-bottom fs-6">Priority Rank</legend>
                            <dl className="row px-2 text-center">
                                {priorityRank.map((item: any) => {
                                    return (
                                        <>

                                            <>
                                                <dt
                                                    className={isActive.rank && save.rank === item.Title ? 'bg-siteColor col selectedTaskList  mx-1 p-2  mb-2 ' : 'bg-siteColor col mx-1 p-2  mb-2 '} onClick={() => setActiveTile("rank", "rank", item.Title)}>

                                                    <a className='text-white'>
                                                        <span>
                                                            <img src={item.Item_x005F_x0020_Cover.Url} />
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
                        {Timing.map((item: any) => {
                            return (
                                <>

                                    <>
                                        <div className={isActive.time && save.Time === item.Title ? 'bg-siteColor selectedTaskList Timetask mx-1 p-2 px-2   text-center' : 'bg-siteColor Timetask mx-1 p-2 px-2  text-center'} onClick={() => setActiveTile("Time", "time", item.Title)} >

                                            <a className='text-decoration-none text-white'>
                                                <span className="icon-sites">
                                                    <img className="icon-sites"
                                                        src={item.Item_x005F_x0020_Cover.Url} />
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
                <div className='col text-end mt-3'>
                    {
                        siteType.map((site: any) => {
                            if (site.Title === save.siteType) {
                                return (
                                    <span className='ms-2'>
                                        <img className="client-icons"
                                            src={site?.Item_x005F_x0020_Cover?.Url} />
                                    </span>
                                )
                            }
                        })
                    }
                    <button type="button" className='btn btn-primary bg-siteColor ' onClick={() => createTask()}>Submit</button>
                </div>
                {IsComponent && <ComponentPortPolioPopup props={ShareWebComponent} Call={Call}></ComponentPortPolioPopup>}
                {IsServices && <LinkedComponent props={ShareWebComponent} Call={Call}></LinkedComponent>}
            </div>
        </div>
</div></>
    )
}

export default CreateTaskComponent; 