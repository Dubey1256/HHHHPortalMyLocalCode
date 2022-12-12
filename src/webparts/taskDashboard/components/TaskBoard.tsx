import * as React from 'react';
import * as $ from 'jquery';
import "bootstrap/dist/css/bootstrap.min.css";
//import { IDashboardProps } from './IDashboardProps';
import axios, { AxiosResponse } from 'axios';
import { BiTime, BiCalendar } from 'react-icons/Bi';
import '../../cssFolder/foundation.scss'
import Clienttask from './ClientTask';
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch } from 'react-icons/fa';
//import Calendar from 'react-calendar';
import * as Moment from 'moment';
import { HiOutlineDocumentText } from 'react-icons/Hi';
import './TaskDashboard.scss';




const TaskDashboards = (props: any) => {
    var CurrentDay = Moment().format("dddd");

    var CurrentDate = Moment().format("D");
    var CurrentMonth = Moment().format("MMM");
    var SiteUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH';
    var CurrentUrl = 'https://hhhhteams.sharepoint.com/sites/HHHH/sp';
    var isCreatedByFilter = false;
    var isModifiedByFilter = false;
    var isTeamLeaderByFilter = false;
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [order, setOrder] = React.useState('ASC');

    const [users, setUserList] = React.useState([]);
    const [AllTasks, setAllTasks] = React.useState([]);
     const [isComponentVisible, setIsComponentVisible] = React.useState(false);
    const [values, setValues] = React.useState([]);
    const [maidataBackup, setmaidataBackup] = React.useState([])
    const [taskUser, settaskUser] = React.useState([]);
    const [value, onChange] = React.useState(new Date());
    var AllMetaData: any = []
    var taskUsers: any = []
    var SitesConfig: any = []
    var user = { TaxType: 'Users' };
    var TaskTypeItems: any = []


    React.useEffect(() => {
        showProgressBar();
        LoadMetaData();
        


    }, []);

    let handleChange = (e: { target: { value: any; }; }, item: any) => {
        setSearch(e.target.value.toLowerCase());

        if (item == 'Title') {
            let searcjQery = e.target.value.toLowerCase(),
                displayedContacts = AllTasks.filter((el) => {
                    let searchValue = (el.Title.toLowerCase())
                    return searchValue.indexOf(searcjQery) !== -1;
                })
            setAllTasks(displayedContacts)
        }
        if (item == 'Shareweb_x0020_ID') {
            let searcjQery = e.target.value.toLowerCase(),
                displayedContacts = AllTasks.filter((el) => {
                    let searchValue = (el.Shareweb_x0020_ID.toLowerCase())
                    return searchValue.indexOf(searcjQery) !== -1;
                })
            setAllTasks(displayedContacts)
        }
        if (item == 'PercentComplete') {
            let searcjQery = e.target.value,
                displayedContacts = AllTasks.filter((el) => {

                    let searchValue = (el.PercentComplete)

                    return searchValue.toString().indexOf(searcjQery) !== -1;
                })
            setAllTasks(displayedContacts)
        }
    }
    const sortBy = (col: any) => {

        if (order === 'ASC') {
            const sorted = [...AllTasks].sort((a, b) =>
                a[col] > b[col] ? 1 : -1
            );
            setAllTasks(sorted)
            setOrder('DSC')

        }
    }
    const sortByDes = (col: any) => {
        if (order === 'DSC') {
            const sorted = [...AllTasks].sort((a, b) =>
                a[col] < b[col] ? 1 : -1
            );
            setAllTasks(sorted)
            setOrder('ASC')

        }

    }

    var ClientCategoryData: any = [];
    const LoadMetaData = () => {
        axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('01a34938-8c7e-4ea6-a003-cee649e8c67a')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent&$orderby=SortOrder&$top=4999")
            .then((response: AxiosResponse) => {
                var CurrentTaskType = ''
                var CurrentSiteType = ''
                console.log(response.data);
                setUserList(response.data);
                AllMetaData = response.data.value;
                var metadatItem: any = [];
                AllMetaData.map(function (item: any) {
                    if (item.TaxType != 'Task Types' && item.TaxType != 'Task Type' && item.TaxType != 'Time' && item.TaxType != 'Status' && item.Id != 300) {
                        metadatItem.push(item);
                    }
                })
                ClientCategoryData = getSmartMetadataItemsByTaxType(AllMetaData, 'Client Category');
                ClientCategoryData = [];
                ClientCategoryData.map(function (filterItem: any) {
                    let item: any = {};
                    item.ID = item.Id = filterItem.Id;
                    item.Title = filterItem.Title;
                    item.Group = filterItem.TaxType;
                    item.TaxType = filterItem.TaxType;
                    item.expanded = false;
                    if (filterItem.ParentID == 0) {
                        getChilds(item, ClientCategoryData);
                        if (!isItemExists(ClientCategoryData, item))
                            ClientCategoryData.push(item);
                    }
                })
                var PriorityRank = getSmartMetadataItemsByTaxType(AllMetaData, 'Priority Rank');
                metadatItem.map(function (index: any, item: any) {
                    if (item.Title == 'Task' && item.TaxType == 'Categories') {
                        metadatItem.splice(index, 1);
                    }
                })

                if (CurrentSiteType == '/team')
                    CurrentTaskType = 'teamSites';
                else
                    CurrentTaskType = 'Sites';
                AllMetaData.map(function (item: any) {
                    if (item.TaxType != undefined && (item.TaxType == 'Categories' || item.TaxType == 'Followup' || item.TaxType == 'Priority Rank' || item.TaxType == 'Timing' || item.TaxType == CurrentTaskType)) {
                        TaskTypeItems.push(item);
                    }
                })

                TaskTypeItems.push(user);
                // SitesConfig = getSmartMetadataItemsByTaxType(AllMetaData, CurrentTaskType);


                var GroupCategories = [];
                $.each(AllMetaData, (item: any) => {
                    if (item.Id == 13 || item.Id == 12 || item.Id == 11 || item.Id == 282 || item.Id == 191) {
                        if (item.Title == 'Development') {
                            item.newsortOrder = 1;
                        } else if (item.Title == 'Implementation') {
                            item.newsortOrder = 2;
                        } else if (item.Title == 'Bug') {
                            item.newsortOrder = 3;
                        } else if (item.Title == 'Design') {
                            item.newsortOrder = 4;
                        } else if (item.Title == 'Improvement') {
                            item.newsortOrder = 5;
                        }
                        item.expanded = false;
                        item.flag = true;
                        item.childs = [];
                        GroupCategories.push(item);
                    }
                });
                GroupCategories.push({ "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(322)", "uri": "https://www.hochhuth-consulting.de/sp/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(322)", "etag": "\"1\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 322, "Title": "Others", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": null, "TaxType": "TimesheetCategories", "Selectable": true, "ParentID": null, "SmartSuggestions": false, "ID": null, "expanded": false, "childs": [], "flag": true, newsortOrder: 6 });
               
        loadGmBHTaskUsers();
        loadAdminConfigurations();
        loadTaskUsers();

            },
                function (data) {
                });

    }
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        items.map(function (childItem: any) {
            if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    }
    const isItemExists = (array: any, Id: any) => {
        var isExists = false;
        array.map(function (index: any, item: any) {
            if (item.Id == Id && item.siteType != undefined) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }

    const Searchtasks =()=> {
       
        setIsComponentVisible(!isComponentVisible)
    }
    let currentUsers = [
        {
            "Title": "Piyoosh Bhardwaj",
            "UserGroup": "Senior Developer Team",
        },
        {
            "Title": "Deepak Trivedi",
            "UserGroup": "Smalsus Lead Team",
        },
        {
            "Title": "Kamal kishore",
            "UserGroup": "Desinger Team",
        },
        {
            "Title": "Ranu Trivedi",
            "UserGroup": "Dev Team",
        },
        {
            "Title": "Amit Kumar",
            "UserGroup": "Senior Developer Team",
        },
        {
            "Title": "Atul Kumar",
            "UserGroup": "Senior Developer Team",
        },
        {
            "Title": "Pravesh Kumar",
            "UserGroup": "Senior Developer Team",
        },
        {
            "Title": "Ankit Tiwari",
            "UserGroup": "Senior Developer Team",
        },
        {
            "Title": "Abhisek",
            "UserGroup": "Senior Developer Team",
        },
    ]

    const getSmartMetadataItemsByTaxType = (metadataItems: any, taxType: any) => {
        var Items: any = [];
        $.each(metadataItems, function (index: any, taxItem: any) {
            if (taxItem.TaxType == taxType)
                Items.push(taxItem);
        });
        return Items;
    }
    var GmBHtaskUsers: any = []
    var KSLtaskUsers: any = []

    const loadGmBHTaskUsers = function () {
        var AllTaskusers = []
        axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/Gmbh/_api/web/lists/getbyid('aebcb136-f18d-4beb-bb86-1194a7cf485d')/items?$select=Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType&$expand=AssingedToUser&$orderby=SortOrder asc,Title asc")
            .then(function (response: AxiosResponse) {
                GmBHtaskUsers = response.data.value;
            },
                function (error) {
                    alert(JSON.stringify(error));
                });
    };
    // const loadKSLTaskUsers = function () {
    //     var AllTaskusers = []
    //     axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/KSL/_api/web/lists/getbyid('4675d957-8957-4aaa-b0f5-370b0c09172d')items?$select=Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType&$expand=AssingedToUser&$orderby=SortOrder asc,Title asc")
    //         .then(function (response: AxiosResponse) {
    //             KSLtaskUsers = response.data.value;
    //         },
    //             function (error) {
    //                 alert(JSON.stringify(error));
    //             });
    // };

    const loadTaskUsers = () => {
        var AllTaskusers: any = []

        axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$select=Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver&$orderby=SortOrder asc,Title asc")
            .then((response: AxiosResponse) => {
                taskUsers = response.data.value;
                settaskUser(taskUsers)
                $.each(taskUsers, function (index: any, user: any) {
                    var ApproverUserItem = '';
                    var UserApproverMail: any = []
                    if (user.Title != undefined && user.IsShowTeamLeader == true) {
                        if (user.Approver != undefined) {
                            $.each(user.Approver.results, function (ApproverUser: any, index) {
                                ApproverUserItem += ApproverUser.Title + (index == user.Approver.results.length - 1 ? '' : ',');
                                UserApproverMail.push(ApproverUser.Name.split('|')[2]);
                            })
                            user['UserManagerName'] = ApproverUserItem;
                            user['UserManagerMail'] = UserApproverMail;
                        }
                        AllTaskusers.push(user);
                    }
                });
                // if (KSLtaskUsers != undefined && KSLtaskUsers.length > 0) {
                //     KSLtaskUsers.map(function (user:any) {
                //         if (!isItemExistUserTitle(taskUsers, user.Title)) {
                //              taskUsers.push(user);
                //          }
                //     });
                // }
                if (GmBHtaskUsers != undefined && GmBHtaskUsers.length > 0) {
                    GmBHtaskUsers.map(function (user: any) {
                        // if (!isItemExistUserTitle($scope.taskUsers, user.Title)) {
                        //     $scope.taskUsers.push(user);
                        // }
                    });
                }
                if (AllMetaData != undefined && AllMetaData.length > 0) {
                    loadAllSitesTask();
                }
            },
                function (data) {

                });

    }
    const loadAdminConfigurations = function () {

        var CurrentSiteType = ''

        axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('e968902a-3021-4af2-a30a-174ea95cf8fa')/items?$select=Id,Title,Value,Key,Description,DisplayTitle,Configurations&$filter=Key eq 'TaskDashboardConfiguration'")
            .then((response: AxiosResponse) => {
                var SmartFavoritesConfig = [];
                $.each(response.data.value, function (index: any, smart: any) {
                    if (smart.Configurations != undefined) {
                        SitesConfig = JSON.parse(smart.Configurations);
                    }
                });

            },
                function (error) {

                });
    }
    //var AllTasks:any = [];

    const loadAllSitesTask = () => {
        var WorkingTodayTasks = [];
        var AllSitesTask = [];
        var Tasks: any = []
        var Task: any = []

        var AllTask: any = [];
        var smartCategories = [];
        let allCalls = [];
        var uniqueNames:any=[]
        var arraycount = 0;
        Tasks = [{ "Title": "Task Dashboard", Childs: [], expanded: false, col: 12, "NewTitle": "taskdashboard", "DueDateWidth": 9, "SecondaryDueDateWidth": 7, "PriorityWidth": 8, "SecondaryPriorityWidth": 6, "TitleWidth": 23, "SecondaryTitleWidth": 21, "CreatedDateWidth": 9, "SecondaryCreatedDateWidth": 7, "SortProperty": "TaskDashboard", "SearchProperty": "SearchTaskDashboard" }, { "Title": "Working on Today", Childs: [], expanded: true, col: 12, "NewTitle": "workingontoday", "DueDateWidth": 9, "SecondaryDueDateWidth": 8, "PriorityWidth": 6, "SecondaryPriorityWidth": 5, "TitleWidth": 24, "SecondaryTitleWidth": 23, "SortProperty": "WorkingOnToday", "SearchProperty": "SearchWorkingOnToday" }, { "Title": "Created By", Childs: [], expanded: false, col: 6, "NewTitle": "createdby", "DueDateWidth": 15, "SecondaryDueDateWidth": 13, "CreatedDateWidth": 16, "SecondaryCreatedDateWidth": 14, "PriorityWidth": 11, "SecondaryPriorityWidth": 9, "TitleWidth": 34, "SecondaryTitleWidth": 33, "SortProperty": "CreatedBy", "SearchProperty": "SearchCreatedBy" }, { "Title": "Due This Week", Childs: [], expanded: false, col: 6, "NewTitle": "thisweek", "DueDateWidth": 15, "SecondaryDueDateWidth": 13, "CreatedDateWidth": 16, "SecondaryCreatedDateWidth": 14, "PriorityWidth": 11, "SecondaryPriorityWidth": 9, "TitleWidth": 35, "SecondaryTitleWidth": 33, "SortProperty": "DueThisWeek", "SearchProperty": "SearchDueThisWeek" }, { "Title": "Shareweb Task", Childs: [], expanded: false, col: 12, "NewTitle": "sharewebtask", "DueDateWidth": 9, "SecondaryDueDateWidth": 7, "PriorityWidth": 8, "SecondaryPriorityWidth": 6, "TitleWidth": 23, "SecondaryTitleWidth": 20, "CreatedDateWidth": 9, "SecondaryCreatedDateWidth": 7, "SortProperty": "SharewebTask", "SearchProperty": "SearchSharewebTask" }];
        SitesConfig.map(function (site: any) {
            if (site.listId != undefined && site.listId != null) {
                var url = (site.SiteUrl + "/_api/web/lists/getbyid( '" + site.listId + "')/items?$select=Id,Title,Priority_x0020_Rank,EstimatedTime,EstimatedTimeDescription,FeedBack,IsTodaysTask,Component/Id,component_x0020_link,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title,Approver/Title,Approver/Id,Approver/Name&$expand=AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,Approver&$top=4999");

                $.ajax({

                    url: url,

                    method: "GET",

                    headers: {

                        "Accept": "application/json; odata=verbose"

                    },

                    success: function (data) {

                        arraycount++;


                        data.d.results.map(function (item: any) {
                            item.currentsiteType = site.Site;
                            item.siteType = site.Title;
                            item.listId = site.listId;
                            item.SiteIcon = site.SiteIcon;
                            item.SiteUrl = site.SiteUrl;
                            item.DisplaySiteName = site.DisplaySiteName;
                            item.Responsible_x0020_TeamID = "";
                            //SiteIcon  SiteUrl                   
                            item.Select = false;
                            if (item.Item_x0020_Type) {
                                item.isPortfolio = true;
                            } else {
                                item.isPortfolio = false;
                            }
                            if (item.__metadata != undefined && item.__metadata.type != undefined) {
                                item.Metadatainfo = item.__metadata.type;
                            }
                            if (item.SharewebTaskType != undefined && item.SharewebTaskType.Id != undefined) {
                                item.SharewebTaskTypeTitle = item.SharewebTaskType.Title;
                            } else {
                                item.SharewebTaskTypeTitle = "Task"
                            }
                            try {
                                item.Responsible_x0020_TeamTitle = item.Responsible_x0020_Team.results[0].Title.replace('  ', ' ');
                                item.Responsible_x0020_TeamID = item.Responsible_x0020_Team.results[0].Id;
                            } catch (e) {
                                item.Responsible_x0020_TeamTitle = "";
                                item.Responsible_x0020_TeamID = "";
                            }
                            if (item.EstimatedTime == undefined || item.EstimatedTime == '')
                                item.EstimatedTime = 0;

                            if (item.EstimatedTimeDescription != undefined && item.EstimatedTimeDescription != '') {
                                item['DescriptionaAndCategory'] = JSON.parse(item.EstimatedTimeDescription)
                                item['shortDescription'] = item.DescriptionaAndCategory[0].shortDescription;
                            }

                            if (item.Priority_x0020_Rank == undefined || item.Priority_x0020_Rank == '')
                                item.Priority_x0020_Rank = 4;

                            if (item.SharewebCategories.results != undefined) {
                                item.Categories = "";
                                $.each(item.SharewebCategories.results, function (index: any, categories: any) {
                                    if (categories.Title != "Normal Approval" && categories.Title != "Complex Approval" && categories.Title != "Quick Approval") {
                                        item.Categories += categories.Title + ';';
                                    }
                                    if (categories.Title == "Normal Approval" || categories.Title == "Complex Approval" || categories.Title == "Quick Approval") {
                                        item["Is" + categories.Title.replace(" ", "")] = true;
                                    }
                                });
                                if (item.Categories != '')
                                    item.Categories = item.Categories.slice(0, -1);
                            }
                            item.AuthorTitle = item.Author.Title.replace('  ', ' ');
                            item.EditorTitle = item.Editor.Title.replace('  ', ' ');
                            item.Team_x0020_MembersTitle = "";
                            item.Team_x0020_MembersId = "";
                            $.each(item.Team_x0020_Members, function (member: any) {
                                item.Team_x0020_MembersTitle = item.Team_x0020_MembersTitle + "" + member.Title + ", ";
                                item.Team_x0020_MembersId = item.Team_x0020_MembersId + " " + member.Id;
                            })
                            item.AuthorId = item.Author.Id;
                            item.EditorId = item.Editor.Id;
                            item.AssigntoTitle = "";
                            item.AssigntoId = "";
                            if (item.AssignedTo) {
                                $.each(item.AssignedTo.results, function (assign: any) {
                                    item.AssigntoTitle = item.AssigntoTitle + " " + assign.Title;
                                    item.AssigntoId = item.AssigntoId + " " + assign.Id;
                                })
                            }
                            item.Team_x0020_MembersTitle = item.Team_x0020_MembersTitle.replace('  ', ' ');
                            item.Alluserimages = [];
                            item.AllCreatedimages = [];
                            item.AllModifiedimages = [];
                            item.TeamAlluserimages = [];
                            if (item.AssignedTo != undefined && item.AssignedTo.length > 0) {
                                $.each(item.AssignedTo, function (index: any, newitem: any) {
                                    var newuserdata: any = {};
                                    $.each(taskUsers, function (index: any, user: any) {
                                        if (newitem.Id == user.AssingedToUserId && user.Item_x0020_Cover != undefined) {
                                            newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
                                            newuserdata['Suffix'] = user.Suffix;
                                            newuserdata['Title'] = user.Title;
                                            newuserdata['UserId'] = user.AssingedToUserId;
                                            item['Usertitlename'] = user.Title;
                                        }
                                    })
                                    item.Alluserimages.push(newuserdata);
                                })
                            }
                            if (item.Author.Title != undefined && item.Author.Title.length > 0) {
                                let newuserdata: any = {};
                                $.each(taskUsers, function (index: any, user: any) {
                                    if (item.Author.Id == user.AssingedToUserId && user.Item_x0020_Cover != undefined) {
                                        newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
                                        newuserdata['Suffix'] = user.Suffix;
                                        newuserdata['Title'] = user.Title;
                                        newuserdata['UserId'] = user.AssingedToUserId;
                                        item['Usertitlename'] = user.Title;
                                    }
                                })
                                item.AllCreatedimages.push(newuserdata);
                            }
                            if (item.Editor.Title != undefined && item.Editor.Title.length > 0) {
                                let newuserdata: any = {};
                                $.each(taskUsers, function (index: any, user: any) {
                                    if (item.Editor.Id == user.AssingedToUserId && user.Item_x0020_Cover != undefined) {
                                        newuserdata['useimageurl'] = user.Item_x0020_Cover.Url;
                                        newuserdata['Suffix'] = user.Suffix;
                                        newuserdata['Title'] = user.Title;
                                        newuserdata['UserId'] = user.AssingedToUserId;
                                        item['Usertitlename'] = user.Title;
                                    }
                                })
                                item.AllModifiedimages.push(newuserdata);
                            }
                            if (item.Team_x0020_Members != undefined) {
                                $.each(item.Team_x0020_Members, function (index: any, teamnewitem: any) {
                                    var teamnewuserdata: any = {};
                                    $.each(taskUsers, function (index: any, teamuser: any) {
                                        if (teamnewitem.Id == teamuser.AssingedToUserId && teamuser.Item_x0020_Cover != undefined) {
                                            teamnewuserdata['useimageurl'] = teamuser.Item_x0020_Cover.Url;
                                            teamnewuserdata['Suffix'] = teamuser.Suffix;
                                            teamnewuserdata['Title'] = teamuser.Title;
                                            item['TeamUsertitlename'] = teamuser.Title;
                                        }

                                    })
                                    item.TeamAlluserimages.push(teamnewuserdata);
                                })
                            }
                            if (item.Alluserimages != undefined) {
                                item.allusername = '';
                                $.each(item.Alluserimages, function (index: any, items: any) {
                                    if (items.Title != undefined) {
                                        item.allusername += items.Title + ' ';
                                    }
                                })
                            }
                            if (item.TeamAlluserimages != undefined) {
                                item.allteammembername = '';
                                $.each(item.TeamAlluserimages, function (items: any) {
                                    if (items.Title != undefined) {
                                        item.allteammembername += items.Title + ' ';
                                    }
                                })
                            }
                            item['Companytype'] = 'Alltask';
                            if (item.siteType != undefined && item.siteType == 'Offshore Tasks') {
                                item['Companytype'] = 'Offshoretask';
                            }
                            // if (item.Author != undefined) {
                            //     $.each(taskUsers, function (index:any,newuser:any) {

                            //         if (item.Author.Title == newuser.AssingedToUser.Title) {
                            //             if (newuser.Item_x0020_Cover != undefined)
                            //                 item['autherimage'] = newuser.Item_x0020_Cover.Url;
                            //         }
                            //         if (item.Editor.Title == newuser.AssingedToUser.Title) {
                            //             if (newuser.Item_x0020_Cover != undefined)
                            //                 item['editoreimage'] = newuser.Item_x0020_Cover.Url;
                            //         }
                            //     })
                            // }
                            item.ModifiedDateTime = item.Modified;
                            // if (item.Modified != undefined)
                            //     item.Modifiednew = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY HH:mm');
                            // if (item.Created != undefined)
                            //     item.CreatedNew = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');
                            // if (item.Modified != undefined) {
                            //     item.ModifiedNew2 = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY');
                            // }
                            // if (item.Created != undefined) {
                            //     item.CreatedNew2 = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');
                            // }
                            // if (item.DueDate != undefined) {
                            //     item.DueDateNew2 = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.DueDate, 'DD/MM/YYYY');
                            // }
                            if (item.Component != undefined && item.Component.results != undefined && item.Component.results.length > 0) {
                                item['Portfoliotype'] = 'Component';
                            } else if (item.Services != undefined && item.Services.results && item.Services.results.length > 0) {
                                item['Portfoliotype'] = 'Service';
                            } else if (item.Events != undefined && item.Events.results != undefined && item.Events.results.length > 0) {
                                item['Portfoliotype'] = 'Event';
                            }
                            item['Portfolio_x0020_Type'] = item['Portfoliotype'];
                            if (item.PercentComplete != undefined && item.PercentComplete > 2) {
                                item.PercentComplete = parseInt((item.PercentComplete / 100).toFixed(0));
                            } else if (item.PercentComplete != undefined)
                                item.PercentComplete = parseInt((item.PercentComplete * 100).toFixed(0));
                            else
                                item.PercentComplete = 0;

                            // if (item.DueDate != undefined) {
                            //     item.TaskDueDatenew = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.DueDate, 'DD/MM/YYYY');
                            // }
                            smartCategories = getSmartCategories(item, AllMetaData);
                            item.AssignedToUsers = getMultiUserValues(item);
                            $.each(smartCategories, function (index: any, category: any) {
                                item.CategoryItem = item.CategoryItem != undefined ? item.CategoryItem + ';' + category.Title : category.Title;
                            });

                            item.ClientCategoryItem = "";
                            if (item.ClientCategory != undefined && item.ClientCategory.results != undefined && item.ClientCategory.results.length > 0) {
                                $.each(item.ClientCategory.results, function (category: any, index) {
                                    if (index == 0)
                                        item.ClientCategoryItem = item.ClientCategoryItem != undefined ? item.ClientCategoryItem + category.Title : category.Title;
                                    else
                                        item.ClientCategoryItem = item.ClientCategoryItem != undefined ? item.ClientCategoryItem + ';' + category.Title : category.Title;
                                })
                            }

                            if (item.CategoryItem != undefined && item.CategoryItem.indexOf('Draft') > -1) {
                                item['Companytype'] = 'Drafttask';
                            }
                            if (item.component_x0020_link != undefined && item.component_x0020_link.Url != undefined) {
                                item.componentlink = item.component_x0020_link.Url;
                            }
                            else {
                                item.componentlink = undefined;
                            }

                            item.componentString = item.Component != undefined && item.Component.results != undefined && item.Component.results.length > 0 ? getComponentasString(item.Component.results) : '';
                            item.Shareweb_x0020_ID = getSharewebId(item);

                            $.each(item.AssignedTo.results,function(index:any,items:any){
                            if (item.siteType != "Master Tasks" && items.Title == props.props && valuess.length == 0 && item.IsTodaysTask == true){
                                AllTask.push(item);
                            }
                                AllTask = AllTask.filter(
                                    (element:any, i:any) => i === AllTask.indexOf(element)
                                  );
                            })

                               if (item.Team_x0020_Members.results != undefined && props.props != "")
                            $.each(item.Team_x0020_Members.results,function(index:any,items:any){
                                      if(item.siteType != "Master Tasks" && items.Title == props.props && item.IsTodaysTask == true){
                                        AllTask.push(item);
                                       
                                      }
                            })

                            if (item.Team_x0020_Members.results != undefined && props.props == "")
                            $.each(item.Team_x0020_Members.results,function(index:any,items:any){
                                      if(item.siteType != "Master Tasks" && items.Title == valuess &&  valuess.length > 0 && item.IsTodaysTask == true){
                                        AllTask.push(item);2

                                      }
                            })
                           
                        
                            $.each(item.AssignedTo.results,function(index:any,items:any){
                            if (item.siteType != "Master Tasks" && items.Title == valuess && valuess.length > 0 && item.IsTodaysTask == true)
                                AllTask.push(item);
                            })  
                               

                        });
                        



                        if (arraycount == SitesConfig.length) {
                            setAllTasks(AllTask)
                            setmaidataBackup(AllTask)
                            showProgressHide();
                        }



                    },

                    error: function (error) {


                    }

                });

            }
            else
                arraycount++;
        });
        const getComponentasString = function (results: any) {
            var component = '';
            $.each(results, function (cmp: any) {
                component += cmp.Title + '; ';
            })
            return component;
        }

        const getMultiUserValues = (item: any) => {
            var users = '';
            var isuserexists = false;
            var Categories: any = []
            var userarray: any = [];
            if (item.AssignedTo != undefined && item.AssignedTo.results != undefined)
                userarray = item.AssignedTo.results;
            for (var i = 0; i < userarray.length; i++) {
                $.each(Categories, function (index: any, user: any) {
                    if (userarray[i].Id == user.AssingedToUserId) {
                        users += user.Title + ', ';
                        isuserexists = true;
                        return false;
                    }
                });
                if (!isuserexists)
                    users += userarray[i].Title + ', ';
            }
            if (users.length > 0)
                users = users.slice(0, -2);
            return users;
        };
        var getSmartCategories = (Item: any, AllTaxonomyItems: any) => {
            var smartCategories: any = [];
            if (Item.SharewebCategories != undefined) {
                $.each(Item.SharewebCategories.results, function (index: any, category: any) {
                    $.each(AllTaxonomyItems, function (index: any, taxonomyItem: any) {
                        if (taxonomyItem.Title == category.Title && (taxonomyItem.TaxType == "Categories" || taxonomyItem.TaxType == 'Category')) {
                            var item: any = {};
                            item.Title = taxonomyItem.Title;
                            item.Id = category.Id;
                            item.ParentID = taxonomyItem.ParentID;
                            smartCategories.push(item);
                        }
                    })

                })
            }
            return smartCategories;
        }

    }

    // const finalFilter=()=> {
    //     var temptask = [];
    //     var GlobalFilter = undefined;
    //     finalFilterAfterGlobalSearch(AllTasks);

    //     // if (GlobalFilter) {
    //     //     console.log(GlobalFilter);
    //     //     if (GlobalFilter.advanceValueAll == 'Allwords') {
    //     //         var testItemstoFilter = $scope.AllTasks;
    //     //         angular.forEach(GlobalFilter.GlobalSearch.split(' '), function (word) {
    //     //             if (GlobalFilter.updateFilterAll == "Allfields") {
    //     //                 temptask = $filter('filter')(testItemstoFilter, word);
    //     //                 testItemstoFilter = temptask;
    //     //             } else {
    //     //                 var filter1 = {};
    //     //                 filter1.Title = word;
    //     //                 temptask = $filter('filter')(testItemstoFilter, filter1);
    //     //                 testItemstoFilter = temptask;
    //     //             }

    //     //         })

    //     //         $scope.finalFilterAfterGlobalSearch(testItemstoFilter);
    //     //     } else if (GlobalFilter.advanceValueAll == 'Anywords') {
    //     //         var testItemstoFilter = $scope.AllTasks;
    //     //         angular.forEach(GlobalFilter.GlobalSearch.split(' '), function (word) {
    //     //             if (GlobalFilter.updateFilterAll == "Allfields") {
    //     //                 temptask = $.merge(temptask, $filter('filter')(testItemstoFilter, word));
    //     //             } else {
    //     //                 var filter1 = {};
    //     //                 filter1.Title = word;
    //     //                 temptask = $.merge(temptask, $filter('filter')(testItemstoFilter, filter1));
    //     //             }
    //     //         })
    //     //         testItemstoFilter = $scope.removeDuplicates(temptask);
    //     //         $scope.finalFilterAfterGlobalSearch(testItemstoFilter);
    //     //     } else if (GlobalFilter.advanceValueAll == 'ExactPhrase') {
    //     //         var testItemstoFilter = $scope.AllTasks;
    //     //         if (GlobalFilter.updateFilterAll == "Allfields") {
    //     //             temptask = $.merge(temptask, $filter('filter')(testItemstoFilter, GlobalFilter.GlobalSearch));
    //     //         } else {
    //     //             var filter1 = {};
    //     //             filter1.Title = GlobalFilter.GlobalSearch;
    //     //             temptask = $.merge(temptask, $filter('filter')(testItemstoFilter, filter1));
    //     //         }

    //     //         testItemstoFilter = $scope.removeDuplicates(temptask);
    //     //         $scope.finalFilterAfterGlobalSearch(testItemstoFilter);
    //     //     }
    //     // } else {
    //     //     $scope.finalFilterAfterGlobalSearch($scope.AllTasks);
    //     // }

    // }

    // const finalFilterAfterGlobalSearch =(tasks:any)=> {
    //     var tempAllTask = tasks;
    //     var isType = false;
    //     var isPType = false;
    //     var flag = false;
    //     var IsCompletedTaskItem = false;
    //     angular.forEach(highFilters, function (filter) {
    //         if (filter.name == "Team Member") {
    //             flag = true;
    //         }
    //     })
    //     if (!flag) {
    //         var userFilter = {};
    //         userFilter.name = "Team Member"
    //         userFilter.childs = [];
    //         // userFilter.childs.push(_spPageContextInfo.userId);
    //         if ($scope.UrlbasedFilterName != undefined && $scope.UrlbasedFilterName != '') {
    //             angular.forEach($scope.AllTaskusers, function (ValUser) {
    //                 if (ValUser.Title == $scope.UrlbasedFilterName) {
    //                     userFilter.childs.push(ValUser.AssingedToUserId);
    //                 }
    //             })
    //         } else {
    //             userFilter.childs.push(_spPageContextInfo.userId);
    //         }
    //         if ($scope.highFilters) {
    //             $scope.highFilters.push(userFilter);
    //         } else {
    //             $scope.highFilters = [];
    //             $scope.highFilters.push(userFilter);
    //         }
    //     }
    //     angular.forEach($scope.highFilters, function (fil) {
    //         if (fil.name == "Type") {
    //             isType = true;
    //         }
    //         if (fil.name == "Portfolio Type") {
    //             isPType = true;
    //         }
    //     })
    //     if (isType && isPType) {
    //         angular.forEach($scope.highFilters, function (fil) {

    //             if (fil.name == "Portfolio Type") {
    //                 fil.name = "Portfolio Task"
    //             }
    //         })
    //     }
    //     angular.forEach($scope.highFilters, function (high) {
    //         if (high.name == 'Sites') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 // tempfilter.siteType = filter; 
    //                 tempfilter.currentsiteType = filter;
    //                 tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter, true));
    //             })
    //             $scope.tempAllTask = tempdata;
    //         } else if (high.name == 'Categories') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 tempfilter.CategoryItem = filter;
    //                 tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));
    //             })
    //             $scope.tempAllTask = tempdata;
    //         }
    //         else if (high.name == 'Client Category') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 tempfilter.ClientCategoryItem = filter;
    //                 tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));
    //             })
    //             $scope.tempAllTask = tempdata;
    //         }
    //         else if (high.name == 'Priority') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 tempfilter.Priority_x0020_Rank = filter;
    //                 tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));
    //             })
    //             $scope.tempAllTask = tempdata;
    //         }
    //         else if (high.name == 'Portfolio Type') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 var tempval = [];
    //                 tempfilter.Portfolio_x0020_Type = filter;
    //                 var underfilter = {};
    //                 underfilter.isPortfolio = true;
    //                 tempval = $filter('filter')($scope.tempAllTask, underfilter);
    //                 tempdata = $.merge(tempdata, $filter('filter')(tempval, tempfilter));
    //             })
    //             $scope.tempAllTask = tempdata;
    //         } else if (high.name == 'Type') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 var tempval = [];
    //                 var underfilter = {};
    //                 underfilter.isPortfolio = false;
    //                 tempval = $filter('filter')($scope.tempAllTask, underfilter);
    //                 tempfilter.SharewebTaskTypeTitle = filter;
    //                 tempdata = $.merge(tempdata, $filter('filter')(tempval, tempfilter));
    //             })
    //             $scope.tempAllTask = tempdata;
    //         } else if (high.name == 'Portfolio Task') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 tempfilter.Portfoliotype = filter;
    //                 tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));
    //             })
    //             $scope.tempAllTask = tempdata;
    //         } else if (high.name == 'Status') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 tempfilter.PercentComplete = filter;
    //                 if (filter == 99 || filter == 100) {
    //                     IsCompletedTaskItem = true;
    //                 }
    //                 tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter, true));
    //             })
    //             $scope.tempAllTask = tempdata;
    //         } else if (high.name == 'Team Member') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 if ($scope.isCreatedByFilter) {
    //                     tempfilter = {};
    //                     tempfilter.AuthorId = filter;
    //                     tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));
    //                 }
    //                 if ($scope.isModifiedByFilter) {
    //                     tempfilter = {};
    //                     tempfilter.EditorId = filter;
    //                     tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));
    //                 }

    //                 if ($scope.isTeamLeaderByFilter) {
    //                     tempfilter = {};
    //                     tempfilter.AssigntoId = filter;
    //                     tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));
    //                 }

    //                 if (!$scope.isCreatedByFilter && !$scope.isModifiedByFilter && !$scope.isTeamLeaderByFilter) {
    //                     tempfilter = {};
    //                     tempfilter.AuthorId = filter;
    //                     tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));

    //                     tempfilter = {};
    //                     tempfilter.EditorId = filter;
    //                     tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));

    //                     tempfilter = {};
    //                     tempfilter.AssigntoId = filter;
    //                     tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter));


    //                     tempdata = $scope.removeDuplicates(tempdata);
    //                 }
    //             })
    //             $scope.tempAllTask = tempdata;
    //         }
    //         else if (high.name == 'Url') {
    //             var tempdata = [];
    //             angular.forEach(high.childs, function (filter) {
    //                 var tempfilter = {};
    //                 tempfilter.componentlink = filter;
    //                 tempdata = $.merge(tempdata, $filter('filter')($scope.tempAllTask, tempfilter, true));
    //             })
    //             $scope.tempAllTask = tempdata;
    //         }
    //     })
    //     $scope.finalFilteredTask = $scope.tempAllTask;
    //     if (!IsCompletedTaskItem) {
    //         $scope.finalFilteredTask = SharewebCommonFactoryService.ArrayCopy($.grep($scope.finalFilteredTask, function (type) { return (type.PercentComplete != 99 && type.PercentComplete != 100) }));
    //     }
    //     $scope.dateFiltersMethod();
    // }
    const getSharewebId = (item: any) => {
        var Shareweb_x0020_ID = undefined;
        if (item != undefined && item.SharewebTaskType != undefined && item.SharewebTaskType.Title == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No == undefined && item.SharewebTaskLevel2No == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
            if (item.SharewebTaskType.Title == 'MileStone')
                Shareweb_x0020_ID = 'M' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Activities' || item.SharewebTaskType.Title == 'Project') && item.SharewebTaskLevel1No != undefined) {
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Component != undefined && item.Events != undefined && item.Services != undefined)
                if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
                }
            if (item.Component == undefined && item.Events == undefined && item.Services == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
            if (item.SharewebTaskType.Title == 'Project')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No;

        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Workstream' || item.SharewebTaskType.Title == 'Step') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
            }
            if (item.SharewebTaskType.Title == 'Step')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No;

        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No + '-M' + item.Id;
            }
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No == undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                if (!item.Events.results != undefined && !item.Services.results != undefined && !item.Component.results != undefined) {
                    Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-M' + item.Id;
            }

        }
        return Shareweb_x0020_ID;
    }
    var showProgressBar = () => {


        $(' #SpfxProgressbar').show();
    }
    var showProgressHide = () => {

        $(' #SpfxProgressbar').hide();
    }
    var valuess: any = []
    const ChangeDropdown = (e: any) => {
        valuess = e.target.value
        setValues(e.target.value)
        props.props = ''
        loadAdminConfigurations();
        loadTaskUsers();
        LoadMetaData();
        showProgressBar();
    }


    const ClearSearch = (search: any) => {
        setAllTasks(maidataBackup)
        $("#searchTaskId").val(null)
        $("#searchTitle").val(null)
        $("#searchPercentComplete").val(null)


    }

    return (
        <>
        
            <div className="container-fluid">
            <div className='col-md-12 pad0 clearfix'>
                        <span className='pull-right'>
                            <select className='searchbox_height' value={values} onChange={(e) => ChangeDropdown(e)}>
                                <option value="Select">{props.props}{values}</option>
                                {currentUsers.map(function (item: any) {
                                    return (
                                        <option value={item.Title}>{item.Title}</option>
                                    )
                                })}
                            </select>
                        </span>
                    </div>

                <div className="row flex-nowrap">
                   
                    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-siteColor">
                        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white">
                            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">

                            </a>

                        </div>
                        <div className="fordates mb-10">
                            <p className="today">{CurrentDay}</p>
                            <p className="todaydate">{CurrentDate}</p>
                            <p className="prsemonth">{CurrentMonth}</p>
                        </div>

                        <h6 className='mt-20'>Quick Accesss</h6>
                        <div className="left-option">

                            {/* <div className="col-sm-6 side-opt">Task</div>
                            <div className="col-sm-6 side-opt">Timesheets <BiTime /></div> */}
                            <a href="https://hochhuth-consulting.de/"><div className="col-sm-6 side-opt">WebSites</div></a>
                            <a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/ApprovalPage.aspx"><div className="col-sm-6 side-opt">Approval<HiOutlineDocumentText /></div></a>
                            <a href="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SitePages/TeamCalendar.aspx?OR=Teams-HL&CT=1668424287203&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiIyNy8yMjEwMjgwNzIwMCIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D"><div className="col-sm-6 side-opt">Calendar <BiCalendar /></div></a>
                            <a href="https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Contacts-Overview.aspx?OR=Teams-HL&CT=1664521610471&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiIyNy8yMjA5MDQwMDcxMiIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D"><div className="col-sm-6 side-opt">Contact Database</div></a>
                        </div>
                       
                    </div>
                    <div className="col py-3">

                        <div id="SpfxProgressbar" style={{ display: "none" }}>
                            <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                        </div>
                        <div className="row">

                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Working on Today ({AllTasks.length})</h5>
                                        <div className='Alltable'>
                                            <div className='smart'>
                                                <div className='section-event'>
                                                    <table style={{ width: "100%" }} className="table table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "6%" }}>

                                                                </th>
                                                                <th style={{ width: "24%" }}>
                                                                    <div className="headcontainer smart-relative" style={{ width: "23%" }}>

                                                                        <input type="text" id="searchTaskId" className="searchbox_height full_width"

                                                                            placeholder="Search Id" ng-model="searchName" onChange={(e) => handleChange(e, 'Shareweb_x0020_ID')} />

                                                                        <span ng-show="searchName.length>0" className="searchclear"

                                                                            onClick={() => ClearSearch('Shareweb_x0020_ID')}>X</span>

                                                                        <span className="sorticon">

                                                                            <span>

                                                                                <i onClick={() => sortBy('Shareweb_x0020_ID')}><FaAngleUp /></i>

                                                                            </span>

                                                                            <span>

                                                                                <i onClick={() => sortByDes('Shareweb_x0020_ID')}><FaAngleDown /></i>

                                                                            </span>

                                                                        </span>



                                                                    </div>
                                                                </th>
                                                                <th style={{ width: "50%" }}>
                                                                    <div className="headcontainer smart-relative" style={{ width: "49%" }}>

                                                                        <input type="text" id="searchTitle" className="searchbox_height full_width"

                                                                            placeholder="Search Title" ng-model="searchName" onChange={(e) => handleChange(e, 'Title')} />

                                                                        <span ng-show="searchName.length>0" className="searchclear"

                                                                            onClick={() => ClearSearch('Title')}>X</span>

                                                                        <span className="sorticon">

                                                                            <span>

                                                                                <i onClick={() => sortBy('Title')}><FaAngleUp /></i>

                                                                            </span>

                                                                            <span>

                                                                                <i onClick={() => sortByDes('Title')}><FaAngleDown /></i>

                                                                            </span>

                                                                        </span>



                                                                    </div>
                                                                </th>
                                                                <th style={{ width: "20%" }}>
                                                                    <div className="headcontainer smart-relative" style={{ width: "19%" }}>

                                                                        <input type="text" id="searchPercentComplete" className="searchbox_height full_width"

                                                                            placeholder="%" ng-model="searchName" onChange={(e) => handleChange(e, 'PercentComplete')} />

                                                                        <span ng-show="searchName.length>0" className="searchclear"

                                                                            onClick={() => ClearSearch('PercentComplete')}>X</span>

                                                                        <span className="sorticon">

                                                                            <span>

                                                                                <i onClick={() => sortBy('PercentComplete')}><FaAngleUp /></i>

                                                                            </span>

                                                                            <span>

                                                                                <i onClick={() => sortByDes('PercentComplete')}><FaAngleDown /></i>

                                                                            </span>

                                                                        </span>



                                                                    </div>
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {AllTasks.map(function (item: any) {
                                                                //  if (search == "" || item.Title.toLowerCase().includes(search.toLowerCase()) || item.Shareweb_x0020_ID.toLowerCase().includes(search.toLowerCase()))  {
                                                                return (
                                                                    <>


                                                                        <tr>
                                                                            <td><span><img className="icon-sites-img" src={item.SiteIcon}></img></span></td>
                                                                            <td>{item.Shareweb_x0020_ID}</td>
                                                                            <td><span><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${item.Id}&Site=${item.siteType}`}>{item.Title}</a></span></td>
                                                                            <td>{item.PercentComplete}</td>
  
                                                                            {/* <td><EditTaskPopup Items={item}/></td> */}
                                                                            
                                                                           
                                                                            {/* {isComponentVisible ? <EditInstitution/> : null} */}
                                                                          
                                                                        </tr>




                                                                    </>
                                                                )
                                                                // }
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <Clienttask />
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Upcoming Events</h5>
                                        {/* <div className='work-today'>
                                                 <tr>
                                                 <th></th>
                                                  <th>Id</th>
                                                  <th>Title</th>
                                                  <th>%</th>
                                              
                                                </tr>
                                          {AllTasks.map(function(item:any){
                                            return(
                                                <>
                                                
                                                {item.IsTodaysTask  == true && 
                                               
                                                 
                                                <tr>
                                                       <td><span><img className="icon-sites-img" src={item.SiteIcon}></img></span></td>
                                                       <td>{item.Shareweb_x0020_ID}</td>
                                                       <td>{item.Title}</td>
                                                       <td>{item.PercentComplete}</td>
                                                </tr>
                                                

                                                }
                                                
                                                </>
                                            )
                                          })}
                                          </div> */}

                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default TaskDashboards;


