import React from 'react'
import { sp, Web } from "sp-pnp-js";
import PageLoader from '../../../globalComponents/pageLoader';
import * as Moment from 'moment';
import {
    ColumnDef,
} from "@tanstack/react-table";
import * as globalCommon from "../../../globalComponents/globalCommon";
import AddMeeting from './AddMeeting';
import MeetingPopupComponent from '../../../globalComponents/MeetingPopup/MeetingPopup';
import { mycontextValue } from '../../meetingOverViewPage/components/MeetingProfile';
import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import TagTaskToProjectPopup from '../../projectManagement/components/TagTaskToProjectPopup';
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
var siteConfig: any = []
var AllTaskUsers: any = [];
let MyAllData: any = []
var allSitesTasks: any = [];
var AllListId: any = {};
var currentUserId: '';
var currentUser: any = [];
let headerOptions: any = {
    openTab: true,
    teamsIcon: true
}
let AllSitesAllTasks: any = [];
var isShowTimeEntry: any = "";
let MasterListData: any = []
var isShowSiteCompostion: any = "";
const MeetingOverviewMain = (props: any) => {
    const contextdata: any = React.useContext(mycontextValue);
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [AllMeetings, setAllMeetings] = React.useState([]);
    const [AllTasks, setAllTasks] = React.useState([]);
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [currentUpdatingTask, setCurrentUpdatingTask]: any = React.useState({});
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    const [showMeetingPopup,setshowMeetingPopup]=React.useState(false);
    const[OverviewMeeting,setOverviewMeeting] = React.useState({});
    React.useEffect(() => {
        try {
            $("#spPageCanvasContent").removeClass();
            $("#spPageCanvasContent").addClass("hundred");
            $("#workbenchPageContent").removeClass();
            $("#workbenchPageContent").addClass("hundred");
            //   isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
            isShowSiteCompostion = props?.props?.SiteCompostion != "" ? JSON.parse(props?.props?.SiteCompostion) : ""
        } catch (error: any) {
            console.log(error)
        }
        AllListId = {
            MasterTaskListID: props?.props?.MasterTaskListID,
            TaskUsertListID: props?.props?.TaskUsertListID,
            SmartMetadataListID: props?.props?.SmartMetadataListID,
            //SiteTaskListID:this.props?.props?.SiteTaskListID,
            TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
            DocumentsListID: props?.props?.DocumentsListID,
            SmartInformationListID: props?.props?.SmartInformationListID,
            AdminConfigrationListID: props?.props?.AdminConfigrationListID,
            siteUrl: props?.props?.siteUrl,
            isShowTimeEntry: isShowTimeEntry,
            isShowSiteCompostion: isShowSiteCompostion,
            SmalsusLeaveCalendar: props?.props?.SmalsusLeaveCalendar,
            TaskTypeID: props?.props?.TaskTypeID
        }
        TaskUser()
        GetMetaData()
        GetMasterData()

    }, [])
    const TaskUser = async () => {
        if (AllListId?.TaskUsertListID != undefined) {
            let web = new Web(AllListId?.siteUrl);
            let taskUser = [];
            taskUser = await web.lists
                .getById(AllListId?.TaskUsertListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,technicalGroup,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,UserGroup/Id,ItemType,Approver/Id,Approver/Title,Approver/Name")
                .top(5000)
                .expand("AssingedToUser,Approver, UserGroup")
                .get();
            setAllTaskUser(taskUser);
            try {
                currentUserId = props?.props?.pageContext?.legacyPageContext?.userId
                taskUser?.map((item: any) => {
                    if (currentUserId == item?.AssingedToUser?.Id) {
                        currentUser = item;
                        setCurrentUserData(item);
                    }
                })
            } catch (error) {
                console.log(error)
            }

            AllTaskUsers = taskUser;
        } else {
            alert('Task User List Id not available')
        }
        // console.log("all task user =====", taskUser)
    }
    const GetMetaData = async () => {
        if (AllListId?.SmartMetadataListID != undefined) {
            let web = new Web(AllListId?.siteUrl);
            let smartmeta = [];
            let select: any = '';
            if (AllListId?.TaskTimeSheetListID != undefined && AllListId?.TaskTimeSheetListID != '') {
                select = 'Id,IsVisible,ParentID,Title,SmartSuggestions,Description,Configurations,TaxType,Description1,Item_x005F_x0020_Cover,Color_x0020_Tag,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title'
            } else {
                select = 'Id,IsVisible,ParentID,Title,SmartSuggestions,Configurations,TaxType,Item_x005F_x0020_Cover,Color_x0020_Tag,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title'
            }
            let TaxonomyItems = [];
            try {
                smartmeta = await web.lists
                    .getById(AllListId?.SmartMetadataListID)
                    .items.select(select)
                    .top(5000)
                    .expand("Parent")
                    .get();
                siteConfig = smartmeta.filter((data: any) => {
                    if (data?.TaxType == 'Sites' && data?.Title != 'Master Tasks' && data?.Title != "SDC Sites" && data?.listId != undefined) {
                        return data;
                    }
                });

                LoadAllSiteTasks();
                //loadAllComponent()
            } catch (error) {

            }
        } else {
            alert("Smart Metadata List Id Not available")
        }

    };
    const GetMasterData = async () => {
        if (AllListId?.MasterTaskListID != undefined) {
            let web = new Web(`${AllListId?.siteUrl}`);
            let taskUsers: any = [];
            let Alltask: any = [];
            // var AllUsers: any = []
            Alltask = await web.lists.getById(AllListId?.MasterTaskListID).items
                .select("Deliverables,TechnicalExplanations,PortfolioLevel,PortfolioStructureID,ValueAdded,Categories,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title")
                .expand("ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent")
                .top(4999).filter("Item_x0020_Type eq 'Meeting'")
                .getAll();
            Alltask.map((items: any) => {
                items.descriptionsSearch = '';
                items.ShowTeamsIcon = false
                items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                items.siteUrl = AllListId?.siteUrl;
                items.listId = AllListId?.MasterTaskListID;
                items.AssignedUser = []
                items.siteType = "Project"
                items.TeamMembersSearch = '';
                if (items.AssignedTo != undefined) {
                    items.AssignedTo.map((taskUser: any) => {
                        AllTaskUsers.map((user: any) => {
                            if (user.AssingedToUserId == taskUser.Id) {
                                if (user?.Title != undefined) {
                                    items.TeamMembersSearch = items.TeamMembersSearch + ' ' + user?.Title
                                }
                            }
                        })
                    })
                }
                items.descriptionsSearch = items.Short_x0020_Description_x0020_On != undefined ? items?.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
                items.commentsSearch = items?.Comments != null && items?.Comments != undefined ? items.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
                items['Shareweb_x0020_ID'] = items?.PortfolioStructureID
                items.DisplayDueDate = items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : ""
            })
            Alltask = sortOnPortfolioLevel(Alltask)
            setAllMeetings(Alltask)
        } else {
            alert('Master Task List Id Not Available')
        }

    }
    const sortOnPortfolioLevel = (Array: any) => {
        return Array.sort((a: any, b: any) => {
            return a?.PortfolioLevel - b?.PortfolioLevel;
        })
    }
    const meetingpopup = (itm:any) =>{
        setshowMeetingPopup(true);
        setOverviewMeeting(itm);
    }
    const CallBack = React.useCallback(() => {
        GetMasterData()
    }, [])
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {

    }, []);
    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                size: 20,
                id: 'Id',
            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        <span className="d-flex">
                            <span className='ms-1'>{row?.original?.Shareweb_x0020_ID}</span>
                        </span>

                    </>
                ),
                accessorKey: "Shareweb_x0020_ID",
                placeholder: "Id",
                id: 'Shareweb_x0020_ID',
                resetColumnFilters: false,
                resetSorting: false,
                size: 80,

            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.original?.Title}</a>
                        {row?.original?.Body !== null && <InfoIconsToolTip Discription={row?.original?.Body} row={row?.original} />}
                    </>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.Priority_x0020_Rank,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectManagment'} />

                    </span>
                ),
                id: "Priority_x0020_Rank",
                placeholder: "Priority",
                resetColumnFilters: false,
                size: 100,
                sortDescFirst: true,
                resetSorting: false,
                header: ""
            },
            {
                accessorFn: (row) => row?.TeamMembers?.map((elem: any) => elem.Title).join('-'),
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns
                            AllListId={AllListId}
                            callBack={CallBack}
                            columnName='Team'
                            item={row?.original}
                            TaskUsers={AllTaskUser}
                            pageName={'ProjectManagment'}
                        />
                    </span>
                ),
                id: 'TeamMembers',
                canSort: false,
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "TeamMembers",
                header: "",
                size: 152,
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
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName='DueDate'
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                        pageName={'ProjectManagment'}
                    />
                ),
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Meeting Date",
                header: "",
                size: 100,
            },
            {
                cell: ({ row }) => (
                    <a className="hreflink" title='Edit'
                    onClick={() => meetingpopup(row.original)}
                  > <span className='svg__iconbox svg__icon--edit'></span></a>
                ),
                id: 'row.original',
                accessorKey: "",
                placeholder: "",
                header: "",
                size: 10,
            },    
            // {

            //     cell: ({ row }) => (
            //         <>
            //             {row?.original?.siteType === "Project" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}

            //         </>
            //     ),
            //     id: 'Id',
            //     canSort: false,
            //     placeholder: "",
            //     header: "",
            //     resetColumnFilters: false,
            //     resetSorting: false,
            //     size: 35,
            // }
        ],
        [AllMeetings]
    );

    const LoadAllSiteTasks = async function () {
        setPageLoader(true)
        if (siteConfig?.length > 0) {
            try {
                var AllTask: any = [];
                let web = new Web(AllListId?.siteUrl);
                var arraycount = 0;
                const fetchPromises = siteConfig.map(async (config: any) => {
                    if (config?.listId != undefined) {
                        let smartmeta = [];
                        smartmeta = await web.lists
                            .getById(config?.listId)
                            .items
                            .select("Id,Title,Priority_x0020_Rank,ParentTask/Id,EstimatedTime,TaskID,TaskLevel,EstimatedTimeDescription,ComponentLink,workingThisWeek,EstimatedTime,SharewebTaskLevel1No,SharewebTaskLevel2No,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,Component/Id,Component/Title,Services/Id,Services/Title,PercentComplete,Events/Id,ComponentId,Categories,ServicesId,EventsId,PriorityRank,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,TaskType/Id,TaskType/Title,Created,Modified,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Portfolio/Id,Portfolio/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,component_x0020_link,TaskCategories/Title,TaskCategories/Id")
                            .expand('AssignedTo,Team_x0020_Members,Portfolio,ParentTask,Component,Services,Events,SharewebTaskType,TaskType,Responsible_x0020_Team,SharewebCategories,TaskCategories')
                            .top(4999)
                            .get();
                        arraycount++;
                        smartmeta.map((items: any) => {
                            // if (((items?.SharewebTaskLevel1No != undefined && items?.SharewebTaskLevel1No != null && items?.SharewebTaskLevel1No != '') || (items?.SharewebTaskLevel2No == '' && items?.SharewebTaskLevel2No == undefined && items?.SharewebTaskLevel2No == null)) && (items?.TaskLevel == null || items?.TaskLevel == '' || items?.TaskLevel == undefined)) {

                            items.Item_x0020_Type = 'tasks';
                            items.ShowTeamsIcon = false
                            items.descriptionsSearch = '';
                            items.AllTeamMember = [];
                            items.taskType = items?.SharewebTaskType?.Id,
                                items.siteType = config.Title;
                            items.siteUrl = config.siteUrl.Url;
                            items.commentsSearch = items?.Comments != null && items?.Comments != undefined ? items.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
                            items.listId = config.listId;
                            items['TaskLevel'] = items?.SharewebTaskType?.Title === 'Activities' ? items?.SharewebTaskLevel1No : items?.SharewebTaskLevel2No;
                            items.TeamMembersSearch = "";
                            // items.Shareweb_x0020_ID = globalCommon.getTaskId(items);
                            if (items?.taskType == undefined && items?.Shareweb_x0020_ID?.charAt(0) == 'T') {
                                //  items.TaskTypeId == 2;
                                items.taskType == 2;
                            }
                            items.TaskCategories = [];
                            if (items?.SharewebCategories?.length > 0) {
                                items?.SharewebCategories?.map((cat: any) => {
                                    items.TaskCategories.push(cat?.Id)
                                })
                            }
                            items.ResTeam = [];
                            if (items?.Responsible_x0020_Team?.length > 0) {
                                items?.Responsible_x0020_Team?.map((mem: any) => {
                                    items.ResTeam.push(mem?.Id)
                                })
                            }
                            items.teamMember = [];
                            if (items?.Team_x0020_Members?.length > 0) {
                                items?.Team_x0020_Members?.map((mem: any) => {
                                    items.teamMember.push(mem?.Id)
                                })
                            }
                            if (items?.ComponentId?.length > 0) {
                                items['Portfoliotype'] = 'Component';
                                items['parentPortfolioid'] = items.ComponentId[0]

                            } else if (items?.ServicesId?.length > 0) {
                                items['Portfoliotype'] = 'Service';
                                items['parentPortfolioid'] = items.ServicesId[0]
                            } else if (items?.EventsId?.length > 0) {
                                items['Portfoliotype'] = 'Event';
                                items['parentPortfolioid'] = items.EventsId[0]

                            }

                            if (items?.Priority_x0020_Rank != undefined) {
                                items.PriorityRank = items?.Priority_x0020_Rank
                            }
                            AllTask.push(items);

                        });

                    }
                    let setCount = siteConfig?.length
                    if (arraycount === setCount) {


                        setAllTasks(sortOnCreated(AllTask))
                        console.log(AllTask, 'before loop');
                        setPageLoader(false)
                    }

                });
                await Promise.all(fetchPromises)
                console.log(fetchPromises)
                console.log(AllTask, 'After Loop')
            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Site Config Length less than 0')
        }
    };
    const sortOnCreated = (Array: any) => {
        Array.sort((a: any, b: any) => new Date(b.Created).getTime() - new Date(a.Created).getTime());
        return Array;
    }
    const closeMeetingPopupFunction = () => {
        setshowMeetingPopup(false);
      }
    const updateItems = async (totalItems: any[]) => {

        try {
            var siteName = 'KathaBeck';
            console.log(siteName);
            let itemsToUpdate: any = [];
            let ActId = 1;
            let activities = AllTasks?.filter((item: any) => item?.TaskType?.Title == 'Activities');
            activities?.map((item: any, index: any) => {
          
                item.TaskLevel = ActId;
                item.Shareweb_x0020_ID = 'A' + ActId;
                item.Childs = AllTasks?.filter((child: any) => child?.ParentTask?.Id == item.Id)
                let workId = 1;
                item?.Childs?.map((child: any, index: any) => {
                    if(child?.TaskType?.Title == 'Workstream'){
                        child.TaskLevel = workId;
                        child.Shareweb_x0020_ID = `${item.Shareweb_x0020_ID}-W${workId}`
                        itemsToUpdate.push(child)
                        workId++;
                    }
                })
                itemsToUpdate.push(item)
                ActId++;
            })
            console.log(itemsToUpdate)
            //let itemsToUpdate: any = AllTasks;
            //  let itemsToUpdate: any = AllTasks?.filter((item: any) => item?.ComponentLink?.Url != item?.component_x0020_link?.Url && item?.siteType == siteName && item?.component_x0020_link?.Url != undefined && item?.component_x0020_link?.Url != null);
            // let itemsToUpdate = MasterListData;
            if (itemsToUpdate.length > 0) {
                const batchSize = 150; // Adjust the batch size as needed
                const batches = Math.ceil(itemsToUpdate.length / batchSize);

                for (let i = 0; i < batches; i++) {
                    const batchItems = itemsToUpdate.slice(i * batchSize, (i + 1) * batchSize);
                    await batchUpdateTasks(batchItems);
                    //await batchUpdateMasterList(batchItems);
                }

                console.log("Batch update completed successfully.");
            } else {
                console.log("No items to update.");
            }
        } catch (error) {
            console.error("Error updating items:", error);
        }
    }
    const batchUpdateTasks = async (itemsToUpdate: any[]): Promise<void> => {
        const web = new Web(AllListId?.siteUrl);
        const batch = sp.createBatch();

        itemsToUpdate.forEach((item: any) => {
            console.log('Updating ', item?.Shareweb_x0020_ID)
            let postdata: any = {
                TaskID: item?.Shareweb_x0020_ID,
                TaskLevel: item?.TaskLevel
                // PriorityRank: item?.PriorityRank,
                // TaskTypeId: item?.taskType,
                // TeamMembersId: { "results": item?.teamMember },
                // ResponsibleTeamId: { "results": item?.ResTeam },
                // TaskCategoriesId: { "results": item?.TaskCategories },
                // TaskLevel: item?.TaskLevel,
                // PortfolioId: item?.parentPortfolioid
            }
            if (item?.component_x0020_link?.Url != undefined) {
                // postdata.ComponentLink = {
                //     __metadata: { 'type': 'SP.FieldUrlValue' },
                //     Description: item?.component_x0020_link?.Url,
                //     Url: item?.component_x0020_link?.Url,
                // }
            }
            web.lists.getById(item?.listId).items.getById(item?.Id).inBatch(batch).update(postdata);
        });
        await batch.execute();
    }
    const batchUpdateMasterList = async (itemsToUpdate: any[]): Promise<void> => {
        const web = new Web(AllListId?.siteUrl);
        const batch = sp.createBatch();

        itemsToUpdate.forEach((item: any) => {
            let postdata = {
                // PriorityRank: item?.PriorityRank,
                PortfolioTypeId: 1,
                // ComponentLink: item?.ComponentLink,
                // HelpInformation: item?.Help_x0020_Information,
                // DeliverableSynonyms: item?.Deliverable_x002d_Synonyms,
                // AdminNotes: item?.Admin_x0020_Notes,
                // TeamMembersId: { "results": item?.teamMember },
                // ResponsibleTeamId: { "results": item?.ResTeam },
                // TaskCategoriesId: { "results": item?.TaskCategories },
                // PortfoliosId: { "results": item?.taggedPortfolios }
                //StructureID:item?.PortfolioStructureID,
                //PortfolioStructureID: item?.StructureID
            }
            console.log('Updating ', item?.StructureID, ' > ', postdata)
            try {
                web.lists.getById(AllListId?.MasterTaskListID).items.getById(item?.Id).inBatch(batch).update(postdata);
            } catch (error) {
                console.log(error)
            }
        });
        await batch.execute();
    }
    const loadAllComponent = async () => {
        setPageLoader(true)
        MasterListData = []
        let web = new Web(AllListId?.siteUrl);
        await web.lists
            .getById(AllListId?.MasterTaskListID)
            .items.select("ComponentCategory/Id", "Responsible_x0020_Team/Title", "StructureID", "Responsible_x0020_Team/Id", "Priority_x0020_Rank", "PortfolioLevel", "ComponentCategory/Title", "DueDate", "Events/Id", "Events/Title", "SiteCompositionSettings", "PortfolioStructureID", "Parent/PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "Deliverable_x002d_Synonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "Admin_x0020_Notes", "AdminStatus", "Background", "Help_x0020_Information", "SharewebCategories/Id", "SharewebCategories/Title", "Priority_x0020_Rank", "Reference_x0020_Item_x0020_Json", "Team_x0020_Members/Title", "Team_x0020_Members/Name", "Component/Id", "Services/Id", "Services/Title", "Services/ItemType", "Component/Title", "Component/ItemType", "Team_x0020_Members/Id", "Item_x002d_Image", "component_x0020_link", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("ClientCategory", "ComponentCategory", "AssignedTo", "Component", "Services", "Events", "AttachmentFiles", "Author", "Editor", "Team_x0020_Members", "Responsible_x0020_Team", "SharewebCategories", "Parent")
            .top(4999)
            .get().then((data: any) => {

                let ComponentsData: any = [];
                ComponentsData = data;
                // ComponentsData=data?.filter((item:any)=>item?.Item_x0020_Type=='Component')
                // ComponentsData=data?.filter((item:any)=>item?.Item_x0020_Type=='SubComponent')
                // ComponentsData=data?.filter((item:any)=>item?.Item_x0020_Type=='Feature')
                ComponentsData?.map((item: any, index: any) => {

                    item.StructureID = item?.PortfolioStructureID?.replace(/C(\d)/, 'C00$1')
                    // let FeatureId = ItemIds[ItemIds?.length-1];
                    // item.StructureID=  item?.Parent?.PortfolioStructureID+'-'+FeatureId

                    // let newId = index + 1;
                    // if (newId >= 1 && newId <= 9) {
                    //     item.StructureID = 'T00' + newId
                    // } else if (newId >= 10 && newId <= 99) {
                    //     item.StructureID = 'T0' + newId
                    // } else if (newId >= 100 && newId <= 999) {
                    //     item.StructureID = 'T' + newId
                    // }

                })
                // data?.map((item: any) => {
                //     item.teamMember = [];
                //     item.ResTeam = [];
                //     item.TaskCategories = [];
                //     item.taggedPortfolios = [];
                //     if (item?.SharewebCategories?.length > 0) {
                //         item?.SharewebCategories?.map((cat: any) => {
                //             item.TaskCategories.push(cat?.Id)
                //         })
                //     }

                //     if (item?.Responsible_x0020_Team?.length > 0) {
                //         item?.Responsible_x0020_Team?.map((mem: any) => {
                //             item.ResTeam.push(mem?.Id)
                //         })
                //     }
                //     if (item?.Team_x0020_Members?.length > 0) {
                //         item?.Team_x0020_Members?.map((mem: any) => {
                //             item.teamMember.push(mem?.Id)
                //         })
                //     }
                //     if (item?.Component?.length > 0) {
                //         item?.Component?.map((port: any) => {
                //             item.taggedPortfolios.push(port.Id)
                //         })
                //     } else if (item?.Services?.length > 0) {
                //         item?.Services?.map((port: any) => {
                //             item.taggedPortfolios.push(port.Id)
                //         })
                //     } else if (item?.Events?.length > 0) {
                //         item?.Events?.map((port: any) => {
                //             item.taggedPortfolios.push(port.Id)
                //         })
                //     }
                //     if (item?.component_x0020_link?.Url != undefined) {
                //         item.ComponentLink = {
                //             __metadata: { 'type': 'SP.FieldUrlValue' },
                //             Description: item?.component_x0020_link?.Url,
                //             Url: item?.component_x0020_link?.Url,
                //         }
                //     }
                //     if (item?.Priority_x0020_Rank != undefined) {
                //         item.PriorityRank = item?.Priority_x0020_Rank
                //     }
                // })
                MasterListData = ComponentsData;
                console.log(MasterListData)
                setPageLoader(false)
            })


    }

    return (
        <>
            <mycontextValue.Provider value={{ ...mycontextValue, AllListId: AllListId, Context: props?.props?.Context,  currentUser: currentUser, taskUsers: AllTaskUsers }}>
                <div>
                    <div className="col-sm-12 pad0 smart">
                        <div className="section-event project-overview-Table">

                            <div className='header-section justify-content-between row'>
                                <div className="col-sm-8">
                                    <h2 style={{ color: "#000066", fontWeight: "600" }}>Meeting Overview</h2>
                                </div>
                                <div className="col-sm-4 text-end">
                                    <AddMeeting CallBack={CallBack} AllListId={AllListId} />
                                    {/* {showTeamMemberOnCheck === true ? <span><a className="teamIcon" onClick={() => ShowTeamFunc()}><span title="Create Teams Group" className="svg__iconbox svg__icon--team teamIcon"></span></a></span> : ''} */}
                                </div>
                            </div>
                            <>
                                <div className="Alltable">
                                    <GlobalCommanTable AllListId={AllListId} headerOptions={headerOptions} paginatedTable={false} columns={column2} data={AllMeetings} callBackData={callBackData} pageName={"ProjectOverview"} TaskUsers={AllTaskUser} showHeader={true} />
                                </div>
                            </>
                        </div>
                        <div className="">
                            <a className='text-end' onClick={() => { updateItems(AllTasks) }}>Update Batch </a>
                        </div>
                        
                    </div>
                    {pageLoaderActive ? <PageLoader /> : ''}
                    {showMeetingPopup ? <MeetingPopupComponent Items={OverviewMeeting} AllListIdData={props.props} isShow={showMeetingPopup} closePopup={closeMeetingPopupFunction} /> : null}
                </div>
            </mycontextValue.Provider>
        </>
        
    )
}
export default MeetingOverviewMain;
export { mycontextValue }