import * as React from 'react';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import { Panel, PanelType, PrimaryButton } from 'office-ui-fabric-react';
import PageLoad from '../pageLoader';
import { GetTaskId } from '../globalCommon';
import { GlobalConstants } from '../../globalComponents/LocalCommon';
// import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { SlArrowRight, SlArrowDown } from "react-icons/sl";
// import SmartMetaSearchTable from '../../webparts/smartMetaSearch/components/SmartMetaSearchTable';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import { ModalBody } from 'react-bootstrap';
import * as Moment from 'moment';
import TeamSmartFilter from '../SmartFilterGolobalBomponents/TeamSmartFilter';
import { map } from 'jquery';
import * as globalCommon from '../globalCommon';
import GlobalCommanTable from '../GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import ReactPopperTooltipSingleLevel from '../Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import HighlightableCell from '../GroupByReactTableComponents/highlight';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup';
import InfoIconsToolTip from '../InfoIconsToolTip/InfoIconsToolTip';


let selectedfilter: any = [];
let renderData: any = [];
let tasksDataLoadUpdate: any = [];
let ProjectData: any = [];
let allLoadeDataMasterTaskAndTask: any = [];
let portfolioColor: any = '';
let allTaskDataFlatLoadeViewBackup: any = [];
let countAllTasksData: any = [];
var filt: any = "";
let pagesType: any = '';
let GroupItems: any = [];
let allMasterTaskDataFlatLoadeViewBackup: any = [];
let isColumnDefultSortingAsc: any = false;
let hasCustomExpanded: any = true;
let hasExpanded: any = true;
let temparr: any[] = [];
let tempdata: any[] = [];
let filteredtempdata: any = [];

const TaskMangementTable = (props: any) => {
    let item = props.selectedArray;
    let web = new Web(item.siteUrl);
    let isGMBH: boolean = false;
    if (item.siteUrl.indexOf('gmbh') !== -1) {
        isGMBH = true;
    } else {
        isGMBH = false;
    }
    if (item.siteUrl.indexOf('ksl') !== -1)
        isGMBH = true;

    let filters: any = [];
    let filterGroups1: any = [];
    let Response: any = [];
    let TaskUsers: any = [];
    let TasksItem: any = [];
    let ComponetsData: any = {};
    let AllComponetsData: any = [];

    const [AllClientCategory, setAllClientCategory] = React.useState([]);
    const [Updateditem, setUpdateditem] = React.useState([]);
    const [ShowTableItem, setShowTableItem] = React.useState<any>([]);
    const [iseditOpen, setiseditOpen] = React.useState(false);
    const [siteConfig, setSiteConfig] = React.useState<any[]>([]);
    const [AllSiteTasksDataLoadAll, setAllSiteTasksDataLoadAll] = React.useState([]);
    const [IsSmartfavoriteId, setIsSmartfavoriteId] = React.useState("");
    const [IsSmartfavorite, setIsSmartfavorite] = React.useState("");
    const [AlllistsData, setAlllistsData] = React.useState([]);
    const [portfolioTypeData, setPortfolioTypeData] = React.useState([])
    const [loading, setloading] = React.useState(false);
    const [filterCounters, setFilterCounters] = React.useState(false);
    const [updatedSmartFilter, setUpdatedSmartFilter] = React.useState(false);
    const [updatedSmartFilterFlatView, setUpdatedSmartFilterFlatView] = React.useState(false);
    const [smartAllFilterOriginalData, setAllSmartFilterOriginalData] = React.useState([]);
    const [smartAllFilterData, setAllSmartFilterData] = React.useState([]);
    const [smartTimeTotalFunction, setSmartTimeTotalFunction] = React.useState(null);
    const [data, setData] = React.useState([]);
    const [priorityRank, setpriorityRank] = React.useState([]);
    const [precentComplete, setPrecentComplete] = React.useState([]);
    const [AllMetadata, setMetadata] = React.useState([])
    const [AllUsers, setTaskUser] = React.useState([]);
    const [taskTypeData, setTaskTypeData] = React.useState([])
    const [taskTypeDataItem, setTaskTypeDataItem] = React.useState([]);
    const [taskTypeDataItemBackup, setTaskTypeDataItemBackup] = React.useState([]);
    const [IsUpdated, setIsUpdated] = React.useState("");
    const refreshData = () => setData(() => renderData);
    const [AllSiteTasksData, setAllSiteTasksData] = React.useState([]);
    const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
    const [AllMasterTasksData, setAllMasterTasks] = React.useState([]);
    const [AllFilteredTaskItems, setAllFilteredTaskItems] = React.useState<any[]>([]);
    const [portfolioTypeDataItemBackup, setPortFolioTypeIconBackup] = React.useState([]);
    const [flatViewDataAll, setFlatViewDataAll] = React.useState([]);
    const [clickFlatView, setclickFlatView] = React.useState(false);
    const [checkedList, setCheckedList] = React.useState<any>({});
    const [checkedList1, setCheckedList1] = React.useState([]);
    const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] = React.useState<any>([{ Title: 'Component', Suffix: 'C', Level: 1 }, { Title: 'SubComponent', Suffix: 'S', Level: 2 }, { Title: 'Feature', Suffix: 'F', Level: 3 }]);
    const [OpenAddStructurePopup, setOpenAddStructurePopup] = React.useState(false);

    let isUpdated: any = "";
    let AllTasks: any = [];
    let AllTasksSiteTasks: any = [];
    const [loaded, setLoaded] = React.useState(false);
    let AllListitems: any = [];

    React.useEffect(() => {
        setloading(true)
        GetSmartmetadata();
        getTaskUsers();
        getPortFolioType();
        getTaskType();
    }, []);
    React.useEffect(() => {
        if (AllSiteTasksData.length > 0 && AllMasterTasksData.length > 0) {
            setFilterCounters(true);
            setloading(false)
        }
    }, [AllSiteTasksData.length > 0 && AllMasterTasksData.length > 0])
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let query = params.get("PortfolioType");
        // if (query) {
        //     setIsUpdated(query);
        //     isUpdated = query;
        // }
        let smartFavoriteIdParam = params.get("SmartfavoriteId");
        if (smartFavoriteIdParam) {
            setIsSmartfavoriteId(smartFavoriteIdParam);
        }
        let smartFavoriteParam = params.get("smartfavorite");
        if (smartFavoriteParam) {
            setIsSmartfavorite(smartFavoriteParam);
        }
    }, [])

    React.useEffect(() => {
        if (isUpdated != "") {
            if (portfolioTypeData.length > 0) {
                portfolioTypeData?.map((elem: any) => {
                    if (elem.Title === isUpdated || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) {
                        portfolioColor = elem.Color;
                    }
                })
            }
        } else {
            if (portfolioTypeData.length > 0) {
                portfolioTypeData?.map((elem: any) => {
                    if (elem.Title === "Component") {
                        portfolioColor = elem.Color;
                    }
                })
            }
        }

    }, [AllSiteTasksData])

    React.useEffect(() => {
        if (AllMetadata.length > 0 && portfolioTypeData.length > 0) {
            GetComponents();
            LoadAllSiteTasks();
            // LoadAllSiteTasksAllData();
        }
    }, [AllMetadata.length > 0 && portfolioTypeData.length > 0])

    const GetSmartmetadata = async () => {
        let siteConfigSites: any = []
        var Priority: any = []
        let PrecentComplete: any = [];
        let smartmetaDetails: any = [];
        smartmetaDetails = await web.lists
            .getById(item?.SmartMetadataListID)
            .items.select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Configurations", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
            .top(4999).expand("Parent").get();
        setAllClientCategory(smartmetaDetails?.filter((metadata: any) => metadata?.TaxType == 'Client Category'));
        smartmetaDetails?.map((newtest: any) => {
            // if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
            if (newtest.Title == "SDC Sites" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
                newtest.DataLoadNew = false;
            else if (newtest.TaxType == 'Sites') {
                siteConfigSites.push(newtest)
            }
            if (newtest?.TaxType == 'Priority Rank') {
                Priority?.push(newtest)
            }
            if (newtest?.TaxType === 'Percent Complete' && newtest?.Title != 'In Preparation (0-9)' && newtest?.Title != 'Ongoing (10-89)' && newtest?.Title != 'Completed (90-100)') {
                PrecentComplete.push(newtest);
            }
        })
        if (siteConfigSites?.length > 0) {
            setSiteConfig(siteConfigSites)
        }
        Priority?.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        PrecentComplete?.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        setpriorityRank(Priority)
        setPrecentComplete(PrecentComplete)
        setMetadata(smartmetaDetails);
    };
    const getTaskUsers = async () => {
        let taskUsers = [];
        taskUsers = await web.lists
            .getById(item?.TaskUsertListID)
            .items.select(
                "Id",
                "Email",
                "Suffix",
                "Title",
                "Item_x0020_Cover",
                "AssingedToUser/Title",
                "AssingedToUser/EMail",
                "AssingedToUser/Id",
                "AssingedToUser/Name",
                "UserGroup/Id",
                "ItemType"
            )
            .expand("AssingedToUser", "UserGroup")
            .get();
        Response = taskUsers;
        TaskUsers = Response;
        setTaskUser(Response);
        console.log(Response);
    };
    const getTaskType = async () => {
        let taskTypeData = [];
        let typeData: any = [];
        taskTypeData = await web.lists
            .getById(item?.TaskTypeID)
            .items.select(
                'Id',
                'Level',
                'Title',
                'SortOrder',
            )
            .get();
        setTaskTypeData(taskTypeData);
        if (taskTypeData?.length > 0 && taskTypeData != undefined) {
            taskTypeData?.forEach((obj: any) => {
                if (obj != undefined) {
                    let Item: any = {};
                    Item.Title = obj.Title;
                    Item.SortOrder = obj.SortOrder;
                    Item[obj.Title + 'number'] = 0;
                    Item[obj.Title + 'filterNumber'] = 0;
                    Item[obj.Title + 'numberCopy'] = 0;
                    typeData.push(Item);
                }
            })
            console.log("Task Type retrieved:", typeData);
            typeData = typeData.sort((elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder);
            setTaskTypeDataItem(typeData);
        }
    };
    const getPortFolioType = async () => {
        let PortFolioType = [];
        PortFolioType = await web.lists
            .getById(item?.PortFolioTypeID)
            .items.select(
                "Id",
                "Title",
                "Color",
                "IdRange"
            )
            .get();
        setPortfolioTypeData(PortFolioType);
    };
    const findUserByName = (name: any) => {
        const user = AllUsers.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        let Image: any;
        if (user[0]?.Item_x0020_Cover != undefined) {
            Image = user[0].Item_x0020_Cover.Url;
        } else { Image = "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"; }
        return user ? Image : null;
    };
    const LoadAllSiteTasks = function () {
        let AllTasksData: any = [];
        let Counter = 0;
        if (siteConfig != undefined && siteConfig.length > 0) {
            map(siteConfig, async (config: any) => {
                // let web = new Web(ContextValue.siteUrl);
                let AllTasksMatches: any = [];
                AllTasksMatches = await web.lists
                    .getById(config.listId)
                    .items.select("ParentTask/Title", "ParentTask/Id", "ItemRank", "TaskLevel", "OffshoreComments", "TeamMembers/Id", "ClientCategory/Id", "ClientCategory/Title",
                        "TaskID", "ResponsibleTeam/Id", "ResponsibleTeam/Title", "ParentTask/TaskID", "TaskType/Level", "PriorityRank", "TeamMembers/Title", "FeedBack", "Title", "Id", "ID", "DueDate", "Comments", "Categories", "Status", "Body",
                        "PercentComplete", "ClientCategory", "Priority", "TaskType/Id", "TaskType/Title", "Portfolio/Id", "Portfolio/ItemType", "Portfolio/PortfolioStructureID", "Portfolio/Title",
                        "TaskCategories/Id", "TaskCategories/Title", "TeamMembers/Name", "Project/Id", "Project/PortfolioStructureID", "Project/Title", "Project/PriorityRank", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
                        "Created", "Modified", "IsTodaysTask", "workingThisWeek"
                    )
                    .expand(
                        "ParentTask", "Portfolio", "TaskType", "ClientCategory", "TeamMembers", "ResponsibleTeam", "AssignedTo", "Editor", "Author",
                        "TaskCategories", "Project",
                    ).orderBy("orderby", false).getAll();
                console.log(AllTasksMatches);
                Counter++;
                console.log(AllTasksMatches.length);
                if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
                    $.each(AllTasksMatches, function (index: any, item: any) {
                        item.isDrafted = false;
                        item.flag = true;
                        item.TitleNew = item.Title;
                        item.siteType = config.Title;
                        item.childs = [];
                        item.listId = config.listId;
                        // item.siteUrl = ContextValue.siteUrl;
                        item["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                        item.fontColorTask = "#000"
                        // if (item?.TaskCategories?.some((category: any) => category.Title.toLowerCase() === "draft")) { item.isDrafted = true; }
                    });
                    AllTasks = AllTasks.concat(AllTasksMatches);
                    if (Counter == siteConfig.length) {
                        // AllTasks = AllTasks?.filter((type: any) => type.isDrafted === false);
                        map(AllTasks, (result: any) => {
                            result.Id = result.Id != undefined ? result.Id : result.ID;
                            result.TeamLeaderUser = [];
                            result.AllTeamName = result.AllTeamName === undefined ? "" : result.AllTeamName;
                            result.chekbox = false;
                            result.descriptionsSearch = '';
                            result.commentsSearch = '';
                            result.timeSheetsDescriptionSearch = '';
                            result.SmartPriority = 0;
                            result.TaskTypeValue = '';
                            result.projectPriorityOnHover = '';
                            result.taskPriorityOnHover = result?.PriorityRank;
                            result.showFormulaOnHover;
                            result.portfolioItemsSearch = ''
                            if (result?.DueDate != null && result?.DueDate != undefined) {
                                result.serverDueDate = new Date(result?.DueDate).setHours(0, 0, 0, 0)
                            }
                            if (result?.Modified != null && result?.Modified != undefined) {
                                result.serverModifiedDate = new Date(result?.Modified).setHours(0, 0, 0, 0)
                            }
                            if (result?.Created != null && result?.Created != undefined) {
                                result.serverCreatedDate = new Date(result?.Created).setHours(0, 0, 0, 0)
                            }
                            result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
                            if (result.DisplayCreateDate == "Invalid date" || "") {
                                result.DisplayCreateDate = result.DisplayCreateDate.replaceAll("Invalid date", "");
                            }
                            if (result.Author) {
                                result.Author.autherImage = findUserByName(result.Author?.Id)
                            }
                            result.DisplayDueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
                            if (result.DisplayDueDate == "Invalid date" || "") {
                                result.DisplayDueDate = result?.DisplayDueDate.replaceAll("Invalid date", "");
                            }
                            result.Modified = Moment(result?.Modified).format("DD/MM/YYYY");
                            if (result.Modified == "Invalid date" || "") {
                                result.Modified = result?.Modified.replaceAll("Invalid date", "");
                            }
                            if (result?.TaskType) {
                                result.portfolioItemsSearch = result?.TaskType?.Title;
                            }

                            result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                            if (result.PercentComplete != undefined && result.PercentComplete != '' && result.PercentComplete != null) {
                                result.percentCompleteValue = parseInt(result?.PercentComplete);
                            }

                            result.chekbox = false;
                            if (result?.FeedBack && result?.FeedBack != undefined) {
                                const cleanText = (text: any) => text?.replace(/(<([^>]+)>)/gi, '').replace(/\n/g, '');
                                let descriptionSearchData = '';
                                try {
                                    const feedbackData = JSON.parse(result.FeedBack);
                                    descriptionSearchData = feedbackData[0]?.FeedBackDescriptions?.map((child: any) => {
                                        const childText = cleanText(child?.Title);
                                        const comments = (child?.Comments || [])?.map((comment: any) => {
                                            const commentText = cleanText(comment?.Title);
                                            const replyText = (comment?.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                                            return [commentText, replyText]?.filter(Boolean).join(' ');
                                        }).join(' ');

                                        const subtextData = (child.Subtext || [])?.map((subtext: any) => {
                                            const subtextComment = cleanText(subtext?.Title);
                                            const subtextReply = (subtext.ReplyMessages || [])?.map((val: any) => cleanText(val?.Title)).join(' ');
                                            const subtextComments = (subtext.Comments || [])?.map((subComment: any) => {
                                                const subCommentTitle = cleanText(subComment?.Title);
                                                const subCommentReplyText = (subComment.ReplyMessages || []).map((val: any) => cleanText(val?.Title)).join(' ');
                                                return [subCommentTitle, subCommentReplyText]?.filter(Boolean).join(' ');
                                            }).join(' ');
                                            return [subtextComment, subtextReply, subtextComments].filter(Boolean).join(' ');
                                        }).join(' ');

                                        return [childText, comments, subtextData].filter(Boolean).join(' ');
                                    }).join(' ');

                                    result.descriptionsSearch = descriptionSearchData;
                                } catch (error) {
                                    console.error("Error:", error);
                                }
                            }

                            try {
                                if (result?.Comments != null && result?.Comments != undefined) {
                                    const cleanedComments = result?.Comments?.replace(/[^\x20-\x7E]/g, '');
                                    const commentsFormData = JSON?.parse(cleanedComments);
                                    result.commentsSearch = commentsFormData?.reduce((accumulator: any, comment: any) => {
                                        return (accumulator + comment.Title + " " + comment?.ReplyMessages?.map((reply: any) => reply?.Title).join(" ") + " ");
                                    }, "").trim();
                                }
                            } catch (error) {
                                console.error("An error occurred:", error);
                            }
                            if (
                                result.AssignedTo != undefined &&
                                result.AssignedTo.length > 0
                            ) {
                                map(result.AssignedTo, (Assig: any) => {
                                    if (Assig.Id != undefined) {
                                        map(AllUsers, (users: any) => {
                                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.TeamLeaderUser.push(users);
                                                result.AllTeamName += users.Title + ";";
                                            }
                                        });
                                    }
                                });
                            }
                            if (result.ResponsibleTeam != undefined && result.ResponsibleTeam.length > 0) {
                                map(result.ResponsibleTeam, (Assig: any) => {
                                    if (Assig.Id != undefined) {
                                        map(AllUsers, (users: any) => {
                                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.TeamLeaderUser.push(users);
                                                result.AllTeamName += users.Title + ";";
                                            }
                                        });
                                    }
                                });
                            }
                            if (
                                result.TeamMembers != undefined &&
                                result.TeamMembers.length > 0
                            ) {
                                map(result.TeamMembers, (Assig: any) => {
                                    if (Assig.Id != undefined) {
                                        map(AllUsers, (users: any) => {
                                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.TeamLeaderUser.push(users);
                                                result.AllTeamName += users.Title + ";";
                                            }
                                        });
                                    }
                                });
                            }
                            if (result?.TaskCategories?.length > 0) {
                                result.TaskTypeValue = result?.TaskCategories?.map((val: any) => val.Title).join(",")
                            }

                            if (result?.ClientCategory?.length > 0) {
                                result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
                            } else {
                                result.ClientCategorySearch = ''
                            }
                            if (result?.Portfolio != undefined) {
                                result.tagComponentTitle = result?.Portfolio?.Title;
                                result.tagComponentId = result?.Portfolio.Id
                            }
                            result["TaskID"] = globalCommon.GetTaskId(result);
                            if (result.Project) {
                                result.ProjectTitle = result?.Project?.Title;
                                result.ProjectId = result?.Project?.Id;
                                result.projectStructerId = result?.Project?.PortfolioStructureID
                                const title = result?.Project?.Title || '';
                                const formattedDueDate = Moment(result?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                                result.joinedData = [];
                                if (result?.projectStructerId && title || formattedDueDate) {
                                    result.joinedData.push(`Project ${result?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                                }
                            }
                            result.SmartPriority = globalCommon.calculateSmartPriority(result);
                            result["Item_x0020_Type"] = "Task";
                            TasksItem.push(result);
                            AllTasksData.push(result);
                        });
                        setAllSiteTasksData(AllTasksData);
                        // let taskBackup = JSON.parse(JSON.stringify(AllTasksData));
                        allTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(AllTasksData))
                        // allLoadeDataMasterTaskAndTask = allLoadeDataMasterTaskAndTask.concat(taskBackup);
                    }
                }
            });
            // GetComponents();
        }
    };
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

    const getfilteritemChild = (childitem1: any, Allarray: any) => {
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

    function removeHtmlAndNewline(text: any) {
        if (text) {
            return text.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
        } else {
            return ''; // or any other default value you prefer
        }
    }
    const GetComponents = async () => {
        if (portfolioTypeData.length > 0) {
            portfolioTypeData?.map((elem: any) => {
                if (isUpdated === "") {
                    filt = "";
                } else if (isUpdated === elem.Title || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) { filt = "(PortfolioType/Title eq '" + elem.Title + "')" }
            })
        }
        let componentDetails = [];
        componentDetails = await web.lists
            .getById(item?.MasterTaskListID)
            .items
            .select("ID", "Id", "Title", "PortfolioLevel", "PortfolioStructureID", "Comments", "ItemRank", "Portfolio_x0020_Type", "Parent/Id", "Parent/Title",
                "DueDate", "Body", "FeedBack", "Item_x0020_Type", "Categories", "Short_x0020_Description_x0020_On", "PriorityRank", "Priority",
                "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title", "PercentComplete",
                "ResponsibleTeam/Id", "ResponsibleTeam/Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange", "PortfolioType/Title", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
                "Created", "Modified", "Deliverables", "TechnicalExplanations", "Help_x0020_Information", "AdminNotes", "Background", "Idea", "ValueAdded", "Sitestagging"
            )
            .expand(
                "Parent", "PortfolioType", "AssignedTo", "ClientCategory", "TeamMembers", "ResponsibleTeam", "Editor", "Author"
            )
            .top(4999)
            .filter(filt)
            .get();

        console.log(componentDetails);
        ProjectData = componentDetails.filter((projectItem: any) => projectItem.Item_x0020_Type === "Project" || projectItem.Item_x0020_Type === 'Sprint');
        componentDetails.forEach((result: any) => {
            // result.siteUrl = ContextValue?.siteUrl;
            result["siteType"] = "Master Tasks";
            result.AllTeamName = "";
            result.descriptionsSearch = '';
            result.SmartPriority = 0;
            result.commentsSearch = '';
            result.TaskTypeValue = '';
            result.timeSheetsDescriptionSearch = '';
            result.portfolioItemsSearch = result.Item_x0020_Type;
            result.TeamLeaderUser = [];
            if (result?.Portfolio != undefined) {
                result.tagComponentTitle = result?.Portfolio?.Title;
                result.tagComponentId = result?.Portfolio.Id
            }
            if (result.Item_x0020_Type === 'Component') {
                result.boldRow = 'boldClable'
                result.lableColor = 'f-bg';
            }
            if (result.Item_x0020_Type === 'SubComponent') {
                result.lableColor = 'a-bg';
            }
            if (result.Item_x0020_Type === 'Feature') {
                result.lableColor = 'w-bg';
            }
            if (result?.Item_x0020_Type != undefined) {
                result.SiteIconTitle = result?.Item_x0020_Type?.charAt(0);
            }
            result["TaskID"] = result?.PortfolioStructureID;

            if (result?.DueDate != null && result?.DueDate != undefined) {
                result.serverDueDate = new Date(result?.DueDate).setHours(0, 0, 0, 0)
            }
            if (result?.Modified != null && result?.Modified != undefined) {
                result.serverModifiedDate = new Date(result?.Modified).setHours(0, 0, 0, 0)
            }
            if (result?.Created != null && result?.Created != undefined) {
                result.serverCreatedDate = new Date(result?.Created).setHours(0, 0, 0, 0)
            }
            result.DisplayCreateDate = Moment(result.Created).format("DD/MM/YYYY");
            if (result.DisplayCreateDate == "Invalid date" || "") {
                result.DisplayCreateDate = result.DisplayCreateDate.replaceAll("Invalid date", "");
            }
            result.DisplayDueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
            if (result.DisplayDueDate == "Invalid date" || "") {
                result.DisplayDueDate = result?.DisplayDueDate.replaceAll("Invalid date", "");
            }
            result.Modified = Moment(result?.Modified).format("DD/MM/YYYY");
            if (result.Modified == "Invalid date" || "") {
                result.Modified = result?.Modified.replaceAll("Invalid date", "");
            }
            if (result.Author) {
                result.Author.autherImage = findUserByName(result.Author?.Id)
            }
            result.PercentComplete = (result?.PercentComplete * 100).toFixed(0) === "0" ? "" : (result?.PercentComplete * 100).toFixed(0);
            if (result.PercentComplete != undefined && result.PercentComplete != '' && result.PercentComplete != null) {
                result.percentCompleteValue = parseInt(result?.PercentComplete);
            }
            if (result?.Deliverables != undefined || result.Short_x0020_Description_x0020_On != undefined || result.TechnicalExplanations != undefined || result.Body != undefined || result.AdminNotes != undefined || result.ValueAdded != undefined
                || result.Idea != undefined || result.Background != undefined) {
                result.descriptionsSearch = `${removeHtmlAndNewline(result.Deliverables)} ${removeHtmlAndNewline(result.Short_x0020_Description_x0020_On)} ${removeHtmlAndNewline(result.TechnicalExplanations)} ${removeHtmlAndNewline(result.Body)} ${removeHtmlAndNewline(result.AdminNotes)} ${removeHtmlAndNewline(result.ValueAdded)} ${removeHtmlAndNewline(result.Idea)} ${removeHtmlAndNewline(result.Background)}`;
            }
            try {
                if (result?.Comments != null && result?.Comments != undefined) {
                    const cleanedComments = result?.Comments?.replace(/[^\x20-\x7E]/g, '');
                    const commentsFormData = JSON?.parse(cleanedComments);
                    result.commentsSearch = commentsFormData?.reduce((accumulator: any, comment: any) => {
                        return (accumulator + comment.Title + " " + comment?.ReplyMessages?.map((reply: any) => reply?.Title).join(" ") + " ");
                    }, "").trim();
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
            result.Id = result.Id != undefined ? result.Id : result.ID;
            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                map(result.AssignedTo, (Assig: any) => {
                    if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.AllTeamName += users.Title + ";";
                            }
                        });
                    }
                });
            }
            if (
                result.ResponsibleTeam != undefined &&
                result.ResponsibleTeam.length > 0
            ) {
                map(result.ResponsibleTeam, (Assig: any) => {
                    if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.AllTeamName += users.Title + ";";
                            }
                        });
                    }
                });
            }
            if (result.TeamMembers != undefined && result.TeamMembers.length > 0) {
                map(result.TeamMembers, (Assig: any) => {
                    if (Assig.Id != undefined) {
                        map(AllUsers, (users: any) => {
                            if (Assig.Id != undefined && users.AssingedToUser != undefined && Assig.Id == users.AssingedToUser.Id) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                                result.AllTeamName += users.Title + ";";
                            }
                        });
                    }
                });
            }
            portfolioTypeDataItem?.map((type: any) => {
                if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
                    type[type.Title + 'number'] += 1;
                    type[type.Title + 'filterNumber'] += 1;
                }
            })
            if (result?.ClientCategory?.length > 0) {
                result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
            } else {
                result.ClientCategorySearch = ''
            }
        });
        const portfolioLabelCountBackup: any = JSON.parse(JSON.stringify(portfolioTypeDataItem));
        setPortFolioTypeIconBackup(portfolioLabelCountBackup);
        setAllMasterTasks(componentDetails)
        allMasterTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(componentDetails));
        allLoadeDataMasterTaskAndTask = JSON.parse(JSON.stringify(componentDetails));
        AllComponetsData = componentDetails;
        ComponetsData["allComponets"] = componentDetails;
    };
    const ShowrelaventComponent = (item: any, event: any) => {
        const ischecked = event.target.checked
        if (item.Portfolio_x0020_Type !== undefined && item.Portfolio_x0020_Type === 'Service')
            pagesType = 'Service-Portfolio';
        else pagesType = 'componentportfolio';
        if (item.Item_x0020_Type !== undefined && item.Item_x0020_Type === 'Feature') {
            let item1: any = '';
            AllMasterTasksData?.forEach((x: any) => { if (x.Id === item.Parent.Id) item1 = x });
            GroupItems = [];
            AllMasterTasksData?.forEach((x: any) => { if ((x.Id === (item1 === undefined ? item.Parent.Id : item1.Parent.Id))) GroupItems.push(x) });
            GroupItems[0].childs = [];
            GroupItems[0].childs.push(item1);
            GroupItems[0].expanded = true;
            if (GroupItems[0]?.childs?.length > 0) {
                GroupItems[0].childs((obj: any) => {
                    obj.childs = [];
                    obj.expanded = true;
                    obj.childs.push(item);
                })
            }
        }
        if (item?.Item_x0020_Type && item.Item_x0020_Type === 'SubComponent') {
            let item1: any = undefined;
            GroupItems = [];
            AllMasterTasksData?.forEach((x: any) => { if ((x.Id === (item1 === undefined ? item.Parent.Id : item1.Parent.Id))) GroupItems.push(x) });
            if (GroupItems?.length > 0) {
                GroupItems[0].expanded = true;
                GroupItems[0].childs = [];
                GroupItems[0].childs.push(item);
            }
        }
    }

    const defaultselectFiltersBasedOnSmartFavorite = (obj: any, filter: any) => {
        if (obj?.Title === filter?.Title) {
            filter.selected = true;
        }
        if (filter.children != undefined && filter.children.length > 0) {
            filter?.children.map((childFilter: any) => {
                if (filter.selected && obj.Title === filter.Title) {
                    childFilter.selected = true;
                }
                defaultselectFiltersBasedOnSmartFavorite(obj, childFilter);
            })
        }
    }
    let isHeaderNotAvlable: any = false
    const switchFlatViewData = (data: any) => {
        let groupedDataItems = JSON.parse(JSON.stringify(data));
        const flattenedData = flattenData(groupedDataItems);
        hasCustomExpanded = false
        hasExpanded = false
        isHeaderNotAvlable = true
        isColumnDefultSortingAsc = true
        // setGroupByButtonClickData(data);
        setclickFlatView(true);
        setFlatViewDataAll(flattenedData)
        setData(flattenedData);
        // setData(smartAllFilterData);
    }
    function flattenData(groupedDataItems: any) {
        const flattenedData: any = [];
        function flatten(item: any) {
            if (item.Title != "Others") {
                flattenedData.push(item);
            }
            if (item?.subRows) {
                item?.subRows.forEach((subItem: any) => flatten(subItem));
                item.subRows = []
            }
        }
        groupedDataItems?.forEach((item: any) => { flatten(item) });
        return flattenedData;
    }

    React.useEffect(() => {
        if (smartAllFilterData?.length > 0 && updatedSmartFilter === false) {
            setLoaded(false);
            setAllFilteredTaskItems(smartAllFilterData);
            setData(smartAllFilterData);
        }
    }, [smartAllFilterData]);

    const smartFiltercallBackData = React.useCallback((filterData, updatedSmartFilter, smartTimeTotal, flatView) => {
        if (filterData.length > 0 && smartTimeTotal) {
            setUpdatedSmartFilter(updatedSmartFilter);
            setUpdatedSmartFilterFlatView(flatView);
            setAllSmartFilterOriginalData(filterData);
            setAllFilteredTaskItems(filterData);
            setData(filterData);
            let filterDataBackup = JSON.parse(JSON.stringify(filterData));
            setAllSmartFilterData(filterDataBackup);
            setSmartTimeTotalFunction(() => smartTimeTotal);
        } else if (updatedSmartFilter === true && filterData.length === 0) {
            renderData = [];
            renderData = renderData.concat(filterData)
            refreshData();
            setLoaded(true);
            setData([])
        }
    }, []);
    const EdittaskItems = (taskitem: any) => {
        setUpdateditem(taskitem);
        setiseditOpen(true);
    }
    const RemoveItem = (Item: any) => {
        let flag: any = confirm('Do you want to delete this item')
        if (flag) {
            web.lists.getById(Item?.listId).items.getById(Item?.Id).recycle().then(() => {
                alert("delete successfully")
                props.closeEditPopup()
            }).catch((error: any) => {
                console.error(error);
            });
        }
    }
    const callBackData1 = React.useCallback((getData: any, topCompoIcon: any) => {
        renderData = [];
        renderData = renderData.concat(getData);
        refreshData();
        // setTopCompoIcon(topCompoIcon);
    }, []);
    const callBackData = React.useCallback((checkData: any) => {
        let array: any = [];
        if (checkData != undefined) {
            setCheckedList(checkData);
            array.push(checkData);
        } else {
            setCheckedList({});
            array = [];
        }
        setCheckedList1(array);
    }, []);
    const OpenAddStructureModal = () => {
        setOpenAddStructurePopup(true);
    };
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                size: 5,
                id: 'Id'
            },
            {
                accessorFn: (row) => row?.portfolioItemsSearch,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        {row?.original?.SiteIcon != undefined ? (
                            <div className="alignCenter" title="Show All Child">
                                <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
                                    row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember me-1"
                                }
                                    src={row?.original?.SiteIcon}>
                                </img>
                            </div>
                        ) : (
                            <>
                                {row?.original?.Title != "Others" ? (
                                    <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                                        row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                                    }>
                                        {row?.original?.SiteIconTitle}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </>
                        )}
                    </div>
                ),
                id: "portfolioItemsSearch",
                placeholder: "Type",
                header: "",
                resetColumnFilters: false,
                size: 95,
            },
            {
                accessorFn: (row) => row?.TaskID,
                cell: ({ row, getValue }) => (
                    <>
                        <ReactPopperTooltipSingleLevel CMSToolId={getValue()} row={row?.original} AllListId={item} singleLevel={true} masterTaskData={allMasterTaskDataFlatLoadeViewBackup} AllSitesTaskData={allTaskDataFlatLoadeViewBackup} />
                    </>
                ),
                id: "TaskID",
                placeholder: "ID",
                header: "",
                resetColumnFilters: false,
                isColumnDefultSortingAsc: isColumnDefultSortingAsc,
                // isColumnDefultSortingAsc:true,
                size: 190,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row }) => (
                    <>
                        {row.original.siteName === 'Master Tasks' && <a target='_blank' href={`${item?.siteurl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}`}>{row.original.Title}</a>}
                        {row.original.siteName !== 'Master Tasks' && <a target='_blank' href={`${item?.siteurl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.siteName}`}>{row.original.Title}</a>}
                        {row?.original?.Body?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} /></span>}
                    </>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 500,
            },
            {
                cell: ({ row }) => (
                    <>
                        <a target='_blank' href={`${item?.siteurl}/SitePages/Portfolio-Profile.aspx?taskId=${row.original.tagComponentId}`}>{row.original.tagComponentTitle}</a>
                    </>
                ), accessorKey: "tagComponentTitle", placeholder: "Component", header: "", size: 70,
            },
            {
                accessorFn: (row) => row?.TaskTypeValue,
                cell: ({ row, column, getValue }) => (
                    <>
                        <span className="columnFixedTaskCate"><span title={row?.original?.TaskTypeValue} className="text-content">{row?.original?.TaskTypeValue}</span></span>
                    </>
                ),
                placeholder: "Task Type",
                header: "",
                resetColumnFilters: false,
                size: 130,
                id: "TaskTypeValue",
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row }) => (
                    <div className="text-center">{row?.original?.PercentComplete}</div>
                ),
                id: "PercentComplete",
                placeholder: "Status",
                resetColumnFilters: false,
                header: "",
                size: 42,
            },
            {
                accessorKey: "PriorityRank",
                placeholder: "Priority",
                header: "",
                size: 70,
            },
            {
                accessorKey: "Modified", placeholder: "Modified", header: "", size: 70, cell: ({ row }) => (
                    <>
                        {row.original.Modified}
                        {row.original?.userImageUrl ? <a target='_blank' href={`${item?.siteurl}/SitePages/TeamLeader-Dashboard.aspx?UserId=${row.original.userImageId}&Name=${row.original.userImageTitle}`}><img className='workmember ' src={row.original.userImageUrl} /></a> : <a target='_blank' href={`${item?.siteurl}/SitePages/TeamLeader-Dashboard.aspx?UserId=${row.original.userImageId}&Name=${row.original.userImageTitle}`}><img className='workmember ' src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/PublishingImages/Portraits/icon_user.jpg" /></a>}
                    </>
                )
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row, column, getValue }) => (
                    <>{row?.original?.DisplayDueDate && <div>{row?.original?.DisplayDueDate}</div>}</>
                ),
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.DisplayDueDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "DueDate",
                header: "",
                size: 91,
            },
            {
                cell: ({ row }) => (
                    <>
                        <a onClick={() => EdittaskItems(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a>
                    </>
                ),
                accessorKey: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'editIcon',
                size: 10,
            },
            {
                cell: ({ row }) => (
                    <>
                        <a onClick={() => RemoveItem(row.original)}><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333"></path></svg></a>
                    </>
                ),
                accessorKey: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'removeIcon',
                size: 10,
            }
        ], [data]
    );
    const CallBack = (type: any) => {
        setiseditOpen(false);
    }

    return (
        <>
            <section className="ContentSection">
                <div className="bg-wihite border p-2">
                    <div className="togglecontent mt-1">
                        {filterCounters == true ? <TeamSmartFilter AllSiteTasksDataLoadAll={AllSiteTasksDataLoadAll} IsUpdated={IsUpdated} IsSmartfavorite={IsSmartfavorite} IsSmartfavoriteId={IsSmartfavoriteId} ProjectData={ProjectData} portfolioTypeData={portfolioTypeData} setLoaded={setLoaded} AllSiteTasksData={AllSiteTasksData} AllMasterTasksData={AllMasterTasksData} SelectedProp={item} ContextValue={item} smartFiltercallBackData={smartFiltercallBackData} portfolioColor={portfolioColor} /> : ''}
                    </div>
                    <section className="Tabl1eContentSection row taskprofilepagegreen">
                        <div className="container-fluid p-0">
                            <section className="TableSection">
                                <div className="container p-0">
                                    <div className="Alltable mt-2 ">
                                        <div className="col-sm-12 p-0 smart">
                                            <div>
                                                <div>
                                                    {/* <GlobalCommanTable bulkEditIcon={true} priorityRank={priorityRank} precentComplete={precentComplete} portfolioTypeDataItemBackup={portfolioTypeDataItemBackup} taskTypeDataItemBackup={taskTypeDataItemBackup} flatViewDataAll={flatViewDataAll} setData={setData} updatedSmartFilterFlatView={updatedSmartFilterFlatView} setLoaded={setLoaded} clickFlatView={clickFlatView} switchFlatViewData={switchFlatViewData} flatView={true} switchGroupbyData={switchGroupbyData} smartTimeTotalFunction={smartTimeTotalFunction} SmartTimeIconShow={true} AllMasterTasksData={AllMasterTasksData} AllListId={item} columns={columns} restructureCallBack={callBackData1} data={data} callBackData={callBackData} TaskUsers={AllUsers} showHeader={true} portfolioColor={portfolioColor} portfolioTypeData={portfolioTypeDataItem} taskTypeDataItem={taskTypeDataItem} fixedWidth={true} portfolioTypeConfrigration={portfolioTypeConfrigration} showingAllPortFolioCount={true} showCreationAllButton={true} OpenAddStructureModal={OpenAddStructureModal} /> */}
                                                    <GlobalCommanTable columns={columns} data={data} showHeader={true} callBackData={callBackData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                    {/* {ShowTableItem && loading === false && <SmartMetaSearchTable SiteSmartfilters={SiteSmartfilters} AllListId={item}/>} */}
                </div >
            </section >
            {loading && <PageLoad />}
            {iseditOpen && <EditTaskPopup Items={Updateditem} AllListId={item} context={item?.ContextValue} Call={(Type: any) => { CallBack(Type) }} />}
        </>

    );

}

export default TaskMangementTable;
