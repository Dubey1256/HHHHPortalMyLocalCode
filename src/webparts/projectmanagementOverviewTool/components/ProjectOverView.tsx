import * as React from 'react';
import PageLoader from '../../../globalComponents/pageLoader';
import "bootstrap/dist/css/bootstrap.min.css"; import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
    ColumnDef,
} from "@tanstack/react-table";
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import { FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import HighlightableCell from "../../../globalComponents/GroupByReactTableComponents/highlight";
import { Web } from "sp-pnp-js";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';
import AddProject from './AddProject'
import EditProjectPopup from './EditProjectPopup';
import InlineEditingcolumns from './inlineEditingcolumns';
import * as globalCommon from "../../../globalComponents/globalCommon";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import ShowTeamMembers from '../../../globalComponents/ShowTeamMember';
import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryPopup';
var siteConfig: any = []
var AllTaskUsers: any = [];
let MyAllData: any = []
var Idd: number;
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
var isShowSiteCompostion: any = "";
export default function ProjectOverview(props: any) {
    const [TableProperty, setTableProperty] = React.useState([]);
    const [openTimeEntryPopup, setOpenTimeEntryPopup] = React.useState(false);
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    const [CheckBoxData, setCheckBoxData] = React.useState([]);
    const [ShowTeamPopup, setShowTeamPopup] = React.useState(false);
    const [checkData, setcheckData] = React.useState([])
    const [showTeamMemberOnCheck, setShowTeamMemberOnCheck] = React.useState(false)
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [listIsVisible, setListIsVisible] = React.useState(false);
    const [GroupedDisplayTable, setDisplayGroupedTable] = React.useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [categoryGroup, setCategoryGroup] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [flatData, setFlatData] = React.useState([]);
    const [AllTasks, setAllTasks]: any = React.useState([]);
    const [passdata, setpassdata] = React.useState("");
    const [selectedView, setSelectedView] = React.useState("Projects");
    const [AllSiteTasks, setAllSiteTasks]: any = React.useState([]);
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [taskTimeDetails, setTaskTimeDetails] = React.useState([]);
    React.useEffect(() => {
        try {
            $("#spPageCanvasContent").removeClass();
            $("#spPageCanvasContent").addClass("hundred");
            $("#workbenchPageContent").removeClass();
            $("#workbenchPageContent").addClass("hundred");
            isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
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
            isShowSiteCompostion: isShowSiteCompostion
        }
        setPageLoader(true);
        LoadAllSiteAllTasks()
        TaskUser()
        GetMetaData()

    }, [])
    const TimeEntryCallBack = React.useCallback((item1) => {
        setOpenTimeEntryPopup(false);
    }, []);
    const EditDataTimeEntry = (e: any, item: any) => {

        setTaskTimeDetails(item);
        setOpenTimeEntryPopup(true);
    };

    const Call = React.useCallback((item1) => {
        GetMasterData();
        setIsComponent(false);
        showProgressHide();
    }, []);
    var showProgressBar = () => {
        $(' #SpfxProgressbar').show();
    }

    var showProgressHide = () => {
        $(' #SpfxProgressbar').hide();
    }
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

    const editTaskCallBack = React.useCallback((item: any) => {
        setisOpenEditPopup(false);
    }, []);
    const loadAllComponent = async () => {
        let MasterListData: any = [];
        let web = new Web(AllListId?.siteUrl);
        MasterListData = await web.lists
            .getById(AllListId?.MasterTaskListID)
            .items.select("ComponentCategory/Id", "ComponentCategory/Title", "DueDate", "SiteCompositionSettings", "PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "Deliverable_x002d_Synonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "Admin_x0020_Notes", "AdminStatus", "Background", "Help_x0020_Information", "SharewebComponent/Id", "SharewebCategories/Id", "SharewebCategories/Title", "Priority_x0020_Rank", "Reference_x0020_Item_x0020_Json", "Team_x0020_Members/Title", "Team_x0020_Members/Name", "Component/Id", "Services/Id", "Services/Title", "Services/ItemType", "Component/Title", "Component/ItemType", "Team_x0020_Members/Id", "Item_x002d_Image", "component_x0020_link", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("ClientCategory", "ComponentCategory", "AssignedTo", "Component", "Services", "AttachmentFiles", "Author", "Editor", "Team_x0020_Members", "SharewebComponent", "SharewebCategories", "Parent")
            .top(4999)
            .get().then((data) => {
                console.log(data)
                data?.forEach((val: any) => {
                    MyAllData.push(val)
                })


            }).catch((error) => {
                console.log(error)
            })


    }
    const LoadAllSiteAllTasks = async function () {
        await loadAllComponent()
        let AllSiteTasks: any = [];
        let approverTask: any = [];
        let SharewebTask: any = [];
        let AllImmediates: any = [];
        let AllEmails: any = [];
        let AllBottleNeckTasks: any = [];
        let AllPriority: any = [];
        let query =
            "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        let Counter = 0;
        let web = new Web(AllListId?.siteUrl);
        let arraycount = 0;
        try {
            if (siteConfig?.length > 0) {

                siteConfig.map(async (config: any) => {
                    if (config.Title != "SDC Sites") {
                        let smartmeta = [];
                        await web.lists
                            .getById(config.listId)
                            .items.select("ID", "Title", "ClientCategory/Id", "ClientCategory/Title", 'ClientCategory', "Comments", "DueDate", "ClientActivityJson", "EstimatedTime", "EstimatedTimeDescription", "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/Title", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "SharewebTaskLevel1No", "SharewebTaskLevel2No", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "SharewebCategories/Id", "SharewebCategories/Title", "Status", "StartDate", "CompletedDate", "Team_x0020_Members/Title", "Team_x0020_Members/Id", "ItemRank", "PercentComplete", "Priority", "Body", "Priority_x0020_Rank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "component_x0020_link", "FeedBack", "Responsible_x0020_Team/Title", "Responsible_x0020_Team/Id", "SharewebTaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Services/ItemType", "Modified")
                            .expand("Team_x0020_Members", "Approver", "ParentTask", "ClientCategory", "AssignedTo", "SharewebCategories", "Author", "Responsible_x0020_Team", "SharewebTaskType", "Component", "Services")
                            .getAll().then((data: any) => {
                                smartmeta = data;
                                smartmeta.map((task: any) => {
                                    task.AllTeamMember = [];
                                    task.HierarchyData = [];
                                    task.siteType = config.Title;
                                    task.bodys = task.Body != null && task.Body.split('<p><br></p>').join('');
                                    task.listId = config.listId;
                                    task.siteUrl = config.siteUrl.Url;
                                    task.PercentComplete = (task.PercentComplete * 100).toFixed(0);
                                    task.DisplayDueDate =
                                        task.DueDate != null
                                            ? Moment(task.DueDate).format("DD/MM/YYYY")
                                            : "";
                                    task.portfolio = {};
                                    if (task?.Component?.length > 0) {
                                        task.portfolio = task?.Component[0];
                                        task.PortfolioTitle = task?.Component[0]?.Title;
                                        task["Portfoliotype"] = "Component";
                                    }
                                    if (task?.Services?.length > 0) {
                                        task.portfolio = task?.Services[0];
                                        task.PortfolioTitle = task?.Services[0]?.Title;
                                        task["Portfoliotype"] = "Service";
                                    }
                                    task["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                                    task.TeamMembersSearch = "";
                                    task.componentString =
                                        task.Component != undefined &&
                                            task.Component != undefined &&
                                            task.Component.length > 0
                                            ? getComponentasString(task.Component)
                                            : "";
                                    task.Shareweb_x0020_ID = globalCommon.getTaskId(task);


                                    AllSiteTasks.push(task)
                                });
                                arraycount++;
                            });
                        let currentCount = siteConfig?.length;
                        if (arraycount === currentCount) {
                            AllSitesAllTasks = AllSiteTasks;

                        }
                    } else {
                        arraycount++;
                    }
                });
            }
        } catch (e) {
            console.log(e)
        }
    };
    const GetMetaData = async () => {
        if (AllListId?.SmartMetadataListID != undefined) {
            try {
                let web = new Web(AllListId?.siteUrl);
                let smartmeta = [];
                let TaxonomyItems = [];
                smartmeta = await web.lists
                    .getById(AllListId?.SmartMetadataListID)
                    .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "Configurations", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                    .top(5000)
                    .filter("TaxType eq 'Sites'")
                    .expand("Parent")
                    .get();
                if (smartmeta.length > 0) {
                    smartmeta?.map((site: any) => {
                        if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites") {
                            siteConfig.push(site)
                        }
                    })
                } else {
                    siteConfig = smartmeta;
                }
                LoadAllSiteTasks();
            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Smart Metadata List Id not present')
            siteConfig = [];
        }
    };
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "Shareweb_x0020_ID",
                placeholder: "Id",
                resetColumnFilters: false,
                resetSorting: false,
                size: 80,
                header: ({ table }: any) => (
                    <>
                        <button className='border-0 bg-Ff'
                            {...{
                                onClick: table.getToggleAllRowsExpandedHandler(),
                            }}
                        >
                            {table.getIsAllRowsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                        </button>{" "}

                    </>
                ),
                cell: ({ row, getValue }) => (
                    <div
                        style={row?.getCanExpand() ? {
                            paddingLeft: `${row?.depth * 5}px`,
                        } : {
                            paddingLeft: "18px",
                        }}
                    >
                        <>
                            {row?.getCanExpand() ? (
                                <span className=' border-0'
                                    {...{
                                        onClick: row?.getToggleExpandedHandler(),
                                        style: { cursor: "pointer" },
                                    }}
                                >
                                    {row?.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            ) : (
                                ""
                            )}{" "}
                            {row?.original?.siteType != "Project" ? <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.Shareweb_x0020_ID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} /> : <span>{row?.original?.Shareweb_x0020_ID}</span>}

                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.siteType !== "Master Tasks" ?
                            <span>
                                {row?.original?.SiteIcon != undefined ?
                                    <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                            </span> : ''
                    }</>
                ),
                id: "siteType",
                placeholder: "Site",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.siteType === "Project" ? <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.original?.Title}</a> : ''}
                        {row?.original?.Item_x0020_Type === "tasks" ? <span>
                            <a className='hreflink'
                                href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>


                        </span> : ''}
                    </>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (

                    <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />


                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 55,
            },
            {
                accessorFn: (row) => row?.Priority_x0020_Rank,
                cell: ({ row }) => (

                    <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />


                ),
                id: 'Priority_x0020_Rank',
                placeholder: "Priority",
                resetColumnFilters: false,
                sortDescFirst: true,
                resetSorting: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }) => (
                    <div >
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Team' item={row?.original} TaskUsers={AllTaskUser} pageName={'ProjectOverView'} />
                    </div>


                ),
                id: 'TeamMembersSearch',
                placeholder: "Team",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 155,
            },
            {
                accessorFn: (row) => row?.DisplayDueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName="DueDate"
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                    />
                ),
                id: 'DisplayDueDate',
                placeholder: "Due Date",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.EstimatedTime,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.Item_x0020_Type === "tasks" ?
                            <InlineEditingcolumns
                                AllListId={AllListId}
                                callBack={CallBack}
                                columnName="EstimatedTime"
                                item={row?.original}
                                TaskUsers={AllTaskUser} /> : ''
                    }</>
                ),
                id: "EstimatedTime",
                placeholder: "Estimated Time",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.smartTime,
                cell: ({ row, getValue }) => (
                    <span>  {row?.original?.smartTime}</span>
                ),
                id: "smartTime",
                placeholder: "Smart Time Total",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {

                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Project" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                        {row?.original?.Item_x0020_Type === "tasks" ? <>
                            <span onClick={(e) => EditDataTimeEntry(e, row.original)}
                                className="svg__iconbox svg__icon--clock"
                                title="Click To Edit Timesheet"  ></span>
                            <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span>
                        </> : ''}
                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 50,
            }
        ],
        [data]
    );
    const groupedUsers = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "Shareweb_x0020_ID",
                placeholder: "Id",
                resetColumnFilters: false,
                resetSorting: false,
                size: 120,
                header: ({ table }: any) => (
                    <>
                        <button className='border-0 bg-Ff'
                            {...{
                                onClick: table.getToggleAllRowsExpandedHandler(),
                            }}
                        >
                            {table.getIsAllRowsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                        </button>{" "}
                        <IndeterminateCheckbox className=" "
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />{" "}

                    </>
                ),
                cell: ({ row, getValue }) => (
                    <div
                        style={row?.getCanExpand() ? {
                            paddingLeft: `${row?.depth * 5}px`,
                        } : {
                        }}
                    >
                        <>
                            {row?.getCanExpand() ? (
                                <span className=' border-0'
                                    {...{
                                        onClick: row?.getToggleExpandedHandler(),
                                        style: { cursor: "pointer" },
                                    }}
                                >
                                    {row?.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            ) : (
                                ""
                            )}{" "}
                            {row?.original?.Item_x0020_Type == "tasks" ? <IndeterminateCheckbox
                                {...{
                                    checked: row?.getIsSelected(),
                                    indeterminate: row?.getIsSomeSelected(),
                                    onChange: row?.getToggleSelectedHandler(),
                                }}
                            /> : ''}
                            <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.Shareweb_x0020_ID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} />

                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.siteType !== "Master Tasks" ?
                            <span>
                                {row?.original?.SiteIcon != undefined ?
                                    <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                            </span> : ''
                    }</>
                ),
                id: "siteType",
                placeholder: "Site",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.type == 'Category' && row?.original?.Title != undefined ? row?.original?.Title : ''}
                        {row?.original?.Item_x0020_Type == "tasks" ?
                            <span>
                                <a className='hreflink'
                                    href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                    data-interception="off"
                                    target="_blank"
                                >
                                    {row?.original?.Title}
                                </a>
                            </span> : ''}
                    </>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.ProjectTitle,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != undefined ? <span>
                            <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Project?.Id}`} data-interception="off" target="_blank">
                                {row?.original?.ProjectTitle}
                            </a>


                        </span> : ''}
                    </>

                ),
                id: "Project Title",
                placeholder: "Project Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.ProjectPriority,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.ProjectPriority != 0 ? row?.original?.ProjectPriority : ''}
                    </span>
                ),
                id: 'projectPriority_x0020_Rank',
                placeholder: "Project Priority",
                resetColumnFilters: false,
                enableMultiSort: true,
                sortDescFirst: true,
                defaultSortDirection: 'desc',
                resetSorting: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />
                    </span>

                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 55,
            },
            {
                accessorFn: (row) => row?.Priority_x0020_Rank,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />

                    </span>
                ),
                id: 'Priority_x0020_Rank',
                placeholder: "Priority",
                resetColumnFilters: false,
                sortDescFirst: true,
                resetSorting: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Team' item={row?.original} TaskUsers={AllTaskUser} pageName={'ProjectOverView'} />
                        {/* <ShowTaskTeamMembers  props={row?.original} TaskUsers={AllTaskUser}></ShowTaskTeamMembers> */}
                    </span>
                ),
                id: 'TeamMembersSearch',
                placeholder: "Team",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 155,
            },
            {
                accessorFn: (row) => row?.DisplayDueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName="DueDate"
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                    />
                ),
                id: 'DisplayDueDate',
                placeholder: "Due Date",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.EstimatedTime,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.Item_x0020_Type === "tasks" ?
                            <InlineEditingcolumns
                                AllListId={AllListId}
                                callBack={CallBack}
                                columnName="EstimatedTime"
                                item={row?.original}
                                TaskUsers={AllTaskUser} /> : ''
                    }</>
                ),
                id: "EstimatedTime",
                placeholder: "Estimated Time",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.smartTime,
                cell: ({ row, getValue }) => (
                    <span>  {row?.original?.smartTime}</span>
                ),
                id: "smartTime",
                placeholder: "Smart Time Total",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {

                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Project" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                        {row?.original?.Item_x0020_Type === "tasks" ? <>
                            <span onClick={(e) => EditDataTimeEntry(e, row.original)}
                                className="svg__iconbox svg__icon--clock"
                                title="Click To Edit Timesheet"  ></span>
                            <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span>
                        </> : ''}
                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 50,
            }
        ],
        [data]
    );

    function IndeterminateCheckbox({
        indeterminate,
        className = "",
        ...rest
    }: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
        const ref = React.useRef<HTMLInputElement>(null!);
        React.useEffect(() => {
            if (typeof indeterminate === "boolean") {
                ref.current.indeterminate = !rest.checked && indeterminate;
            }
        }, [ref, indeterminate]);
        return (
            <input
                type="checkbox"
                ref={ref}
                className={className + "  cursor-pointer form-check-input rounded-0"}
                {...rest}
            />
        );
    }

    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                header: ({ table }: any) => (
                    <>
                        <IndeterminateCheckbox className=" "
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />{" "}
                    </>
                ),
                cell: ({ row, getValue }) => (
                    <>
                        <span className="d-flex">
                            {row?.original?.Title != "Others" ? (
                                <IndeterminateCheckbox
                                    {...{
                                        checked: row?.getIsSelected(),
                                        indeterminate: row?.getIsSomeSelected(),
                                        onChange: row?.getToggleSelectedHandler(),
                                    }}
                                />
                            ) : (
                                ""
                            )}

                            {getValue()}
                        </span>
                    </>
                ),
                accessorKey: "",
                id: "row?.original.Id",
                resetColumnFilters: false,
                resetSorting: false,
                canSort: false,
                placeholder: "",
                size: 35,

            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.original?.Title}</a>
                    </>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                Cell: ({ row }: any) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />
                    </span>
                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetSorting: false,
                resetColumnFilters: false,
                size: 55,
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
                placeholder: "Due Date",
                header: "",
                size: 100,
            },

            {

                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Project" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}

                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 35,
            }
        ],
        [data]
    );

    const flatView = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "Shareweb_x0020_ID",
                placeholder: "Id",
                resetColumnFilters: false,
                resetSorting: false,
                size: 120,
                header: ({ table }: any) => (
                    <>
                        <IndeterminateCheckbox className=" "
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange: table.getToggleAllRowsSelectedHandler(),
                            }}
                        />{" "}
                    </>
                ),
                cell: ({ row, getValue }) => (
                    <div
                        style={row?.getCanExpand() ? {
                            paddingLeft: `${row?.depth * 5}px`,
                        } : {
                        }}
                    >
                        <>
                            {row?.getCanExpand() ? (
                                <span className=' border-0'
                                    {...{
                                        onClick: row?.getToggleExpandedHandler(),
                                        style: { cursor: "pointer" },
                                    }}
                                >
                                    {row?.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            ) : (
                                ""
                            )}{" "}
                            <IndeterminateCheckbox
                                {...{
                                    checked: row?.getIsSelected(),
                                    indeterminate: row?.getIsSomeSelected(),
                                    onChange: row?.getToggleSelectedHandler(),
                                }}
                            />
                            <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.Shareweb_x0020_ID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} />

                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.siteType !== "Master Tasks" ?
                            <span>
                                {row?.original?.SiteIcon != undefined ?
                                    <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                            </span> : ''
                    }</>
                ),
                id: "siteType",
                placeholder: "Site",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        <span>
                            <a className='hreflink'
                                href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>


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
                accessorFn: (row) => row?.ProjectTitle,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != undefined ? <span>
                            <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Project?.Id}`} data-interception="off" target="_blank">
                                {row?.original?.ProjectTitle}
                            </a>


                        </span> : ''}
                    </>

                ),
                id: "Project Title",
                placeholder: "Project Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.ProjectPriority,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.ProjectPriority != 0 ? row?.original?.ProjectPriority : ''}
                    </span>
                ),
                id: 'projectPriority_x0020_Rank',
                placeholder: "Project Priority",
                resetColumnFilters: false,
                enableMultiSort: true,
                sortDescFirst: true,
                defaultSortDirection: 'desc',
                resetSorting: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />
                    </span>

                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 55,
            },
            {
                accessorFn: (row) => row?.Priority_x0020_Rank,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />

                    </span>
                ),
                id: 'Priority_x0020_Rank',
                placeholder: "Priority",
                resetColumnFilters: false,
                resetSorting: false,
                enableMultiSort: true,
                defaultSortDirection: 'desc',
                sortDescFirst: true,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Team' item={row?.original} TaskUsers={AllTaskUser} pageName={'ProjectOverView'} />
                        {/* <ShowTaskTeamMembers  props={row?.original} TaskUsers={AllTaskUser}></ShowTaskTeamMembers> */}
                    </span>
                ),
                id: 'TeamMembersSearch',
                placeholder: "Team",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 155,
            },
            {
                accessorFn: (row) => row?.DisplayDueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName="DueDate"
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                    />
                ),
                id: 'DisplayDueDate',
                placeholder: "Due Date",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.EstimatedTime,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.Item_x0020_Type === "tasks" ?
                            <InlineEditingcolumns
                                AllListId={AllListId}
                                callBack={CallBack}
                                columnName="EstimatedTime"
                                item={row?.original}
                                TaskUsers={AllTaskUser} /> : ''
                    }</>
                ),
                id: "EstimatedTime",
                placeholder: "Estimated Time",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.smartTime,
                cell: ({ row, getValue }) => (
                    <span>  {row?.original?.smartTime}</span>
                ),
                id: "smartTime",
                placeholder: "Smart Time Total",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {

                cell: ({ row }) => (
                    <>
                        <span onClick={(e) => EditDataTimeEntry(e, row.original)}
                            className="svg__iconbox svg__icon--clock"
                            title="Click To Edit Timesheet"  ></span>
                        <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span>
                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 50,
            }
        ],
        [data]
    );





    const sendAllWorkingTodayTasks = () => {


        let text = '';
        let to: any = ["ranu.trivedi@hochhuth-consulting.de", "prashant.kumar@hochhuth-consulting.de", "abhishek.tiwari@hochhuth-consulting.de"];
        let finalBody: any = [];
        let userApprover = '';
        let groupedData = data;
        let confirmation = confirm("Are you sure you want to share the working today task of all team members?")
        if (confirmation) {
            var subject = "Today's Working Tasks Under Projects";
            groupedData?.map((group: any) => {
                let teamsTaskBody: any = [];
                let body: any = '';
                let body1: any = [];
                let tasksCopy: any = [];
                tasksCopy = group?.subRows
                if (tasksCopy?.length > 0) {
                    tasksCopy?.map((item: any) => {
                        let teamUsers: any = [];
                        item?.AssignedTo?.map((item1: any) => {
                            teamUsers.push(item1?.Title)
                        });
                        if (item.DueDate != undefined) {
                            item.TaskDueDatenew = Moment(item.DueDate).format("DD/MM/YYYY");
                        }
                        if (item.TaskDueDatenew == undefined || item.TaskDueDatenew == '')
                            item.TaskDueDatenew = '';
                        if (item.Categories == undefined || item.Categories == '')
                            item.Categories = '';
                        if (item.EstimatedTimeDescription != undefined && item.EstimatedTimeDescription != '') {
                            item['DescriptionaAndCategory'] = JSON.parse(item.EstimatedTimeDescription)
                            item['shortDescription'] = item.DescriptionaAndCategory[0].shortDescription;
                        }
                        if (item.EstimatedTime == undefined || item.EstimatedTime == '' || item.EstimatedTime == null) {
                            item.EstimatedTime = ''
                        }


                        text =
                            '<tr>' +
                            '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.siteType + '</td>'
                            + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Shareweb_x0020_ID + '</td>'
                            + '<td style="line-height:24px;font-size:13px;padding:15px;">' + '<p style="margin-top:0px; margin-bottom:2px;font-size:14px; color:#333;">' + '<a href =' + item.siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + item.Id + '&Site=' + item.siteType + '><span style="font-size:13px; font-weight:600">' + item.Title + '</span></a>' + '</p>' + '</td>'
                            + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Categories + '</td>'
                            + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.PercentComplete + '</td>'
                            + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.Priority_x0020_Rank + '</td>'
                            + '<td style="line-height:24px;font-size:13px;padding:15px;">' + teamUsers + '</td>'
                            + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.TaskDueDatenew + '</td>'
                            + '<td style="line-height:24px;font-size:13px;padding:15px;">' + item.EstimatedTime + '</td>'
                        body1.push(text);
                    })
                    body =
                        '<h3 style="background: #ffff00;">'
                        + group?.Title
                        + '</h3>'
                        + '<table style="border: 1px solid #ccc;" border="1" cellspacing="0" cellpadding="0" width="100%">'
                        + '<thead>'
                        + '<tr>'
                        + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Site' + '</th>'
                        + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Task ID' + '</th>'
                        + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Title' + '</th>'
                        + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Category' + '</th>'
                        + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + '% Complete' + '</th>'
                        + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Priority' + '</th>'
                        + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Team' + '</th>'
                        + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Duedate' + '</th>'
                        + '<th style="line-height:24px;font-size:15px;padding:10px;" bgcolor="#f5f5f5">' + 'Estimated Time (In Hrs)' + '</th>'
                        + '</tr>'
                        + '</thead>'
                        + '<tbody>'
                        + body1
                        + '</tbody>'
                        + '</table>'
                    body = body.replaceAll('>,<', '><').replaceAll(',', '')
                }



                teamsTaskBody.push(body);


                finalBody.push(teamsTaskBody)

            })
            let sendAllTasks =
                '<span style="font-size: 18px;margin-bottom: 10px;">'
                + 'Hi there, <br><br>'
                + 'Below is the working today task of all the team members <strong style="background: #ffff00;">(Project Wise):</strong>'
                + '</span>'
                + finalBody
                + '<h3>'
                + 'Thanks.'
                + '</h3>'
                + '<h3>'
                // + currentUserData?.Title
                + '</h3>'
            SendEmailFinal(to, subject, sendAllTasks);

        }


    }

    const SendEmailFinal = async (to: any, subject: any, body: any) => {
        let sp = spfi().using(spSPFx(props?.props?.Context));
        sp.utility.sendEmail({
            //Body of Email  
            Body: body,
            //Subject of Email  
            Subject: subject,
            //Array of string for To of Email  
            To: to,
            AdditionalHeaders: {
                "content-type": "text/html",
                'Reply-To': 'abhishek.tiwari@smalsus.com'
            },
        }).then(() => {
            console.log("Email Sent!");

        }).catch((err) => {
            console.log(err.message);
        });



    }


    //Inline Editing Callback
    const inlineEditingCall = (item: any) => {
        // page?.map((tasks: any) => {
        //     if (tasks.Id == item.Id) {
        //         tasks = item;
        //     }
        // })
    }
    const EditPopup = React.useCallback((item: any) => {
        setisOpenEditPopup(true);
        setpassdata(item);
    }, []);
    const generateSortingIndicator = (column: any) => {
        return column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : (column.showSortIcon ? <FaSort /> : '');
    };

    const EditComponentPopup = (item: any) => {
        item['siteUrl'] = `${props?.props?.siteUrl}`;
        item['siteUrl'] = `${AllListId?.siteUrl}`;
        item['listName'] = 'Master Tasks';
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const GetMasterData = async () => {
        if (AllListId?.MasterTaskListID != undefined) {
            let web = new Web(`${AllListId?.siteUrl}`);
            let taskUsers: any = [];
            let Alltask: any = [];
            // var AllUsers: any = []
            Alltask = await web.lists.getById(AllListId?.MasterTaskListID).items
                .select("Deliverables,TechnicalExplanations,ValueAdded,Categories,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title").expand("ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent").top(4999).filter("Item_x0020_Type eq 'Project'").getAll();

            // if(taskUsers.ItemType=="Project"){
            // taskUsers.map((item: any) => {
            //     if (item.Item_x0020_Type != null && item.Item_x0020_Type == "Project") {
            //         Alltask.push(item)
            //     }

            Alltask.map((items: any) => {
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
                items['Shareweb_x0020_ID'] = 'P' + items.Id
                items['subRows'] = [];
                allSitesTasks?.map((task: any) => {
                    if (task?.IsTodaysTask == true && task?.Project?.Id == items?.Id) {
                        items['subRows'].push(task);
                    }
                })
                items.DisplayDueDate = items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : ""
            })
            setFlatData([...Alltask])
            Alltask.map((items: any) => {
                items['subRows'] = [];
                allSitesTasks?.map((task: any) => {
                    if (task?.IsTodaysTask == true && task?.Project?.Id == items?.Id) {
                        items['subRows'].push(task);
                    }
                })
            })
            // })
            Alltask = sortOnPriority(Alltask)
            setAllTasks(Alltask);
            setPageLoader(false);
            setData(Alltask);
        } else {
            alert('Master Task List Id Not Available')
        }

    }
    //    Save data in master task list
    const [title, settitle] = React.useState('')
    const tableStyle = {
        display: "block",
        height: "600px",
        overflow: "auto"
    };
    //Just Check 
    // AssignedUser: '',

    // const page = React.useMemo(() => data, [data]);
    const [ShowingAllData, setShowingData] = React.useState([])

    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        if (elem != undefined) {
            setCheckBoxData([elem])
            setTableProperty(getSelectedRowModel?.getSelectedRowModel()?.flatRows)
        } else {
            setCheckBoxData([])
            setTableProperty([])
        }
        if (ShowingData != undefined) {
            setShowingData([ShowingData])
        }
    }, []);

    React.useEffect(() => {
        if (CheckBoxData.length > 0) {
            setcheckData(TableProperty)
            setShowTeamMemberOnCheck(true)
        } else {
            setcheckData([])
            setShowTeamMemberOnCheck(false)
        }
    }, [CheckBoxData])

    const ShowTeamFunc = () => {
        setShowTeamPopup(true)
    }

    const showTaskTeamCAllBack = React.useCallback(() => {
        setShowTeamPopup(false)

    }, []);



    const CallBack = React.useCallback(() => {
        GetMasterData()
    }, [])
    const getComponentasString = function (results: any) {
        var component = "";
        $.each(results, function (cmp: any) {
            component += cmp.Title + "; ";
        });
        return component;
    };

    const LoadAllSiteTasks = function () {
        if (siteConfig?.length > 0) {
            try {
                var AllTask: any = [];
                let web = new Web(AllListId?.siteUrl);
                var arraycount = 0;
                siteConfig.map(async (config: any) => {

                    let smartmeta = [];
                    smartmeta = await web.lists
                        .getById(config.listId)
                        .items
                        .select("Id,Title,Priority_x0020_Rank,EstimatedTime,Project/Priority_x0020_Rank,Project/Id,Project/Title,Events/Id,EventsId,workingThisWeek,EstimatedTime,SharewebTaskLevel1No,SharewebTaskLevel2No,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,Component/Id,Component/Title,Services/Id,Services/Title,PercentComplete,ComponentId,Categories,ServicesId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
                        .expand('AssignedTo,Events,Project,Author,Editor,Component,Services,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory')
                        .filter("IsTodaysTask eq 1")
                        .top(4999)
                        .get();
                    arraycount++;
                    smartmeta.map((items: any) => {
                        items.Item_x0020_Type = 'tasks';
                        items.ShowTeamsIcon = false

                        items.AllTeamMember = [];
                        items.siteType = config.Title;
                        items.siteUrl = config.siteUrl.Url;
                        SmartTimeData(items)
                            .then((returnresult: any) => {
                                items.smartTime = String(returnresult)
                                // console.log("Final Total Time:", returnresult);
                            })
                            .catch((error: any) => {
                                console.error("Error:", error);
                            });
                        items.bodys = items.Body != null && items.Body.split('<p><br></p>').join('');
                        items.listId = config.listId;

                        items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                        items.DisplayDueDate =
                            items.DueDate != null
                                ? Moment(items.DueDate).format("DD/MM/YYYY")
                                : "";
                        items.DisplayCreateDate =
                            items.Created != null
                                ? Moment(items.Created).format("DD/MM/YYYY")
                                : "";
                        items.portfolio = {};
                        if (items?.Component?.length > 0) {
                            items.portfolio = items?.Component[0];
                            items.PortfolioTitle = items?.Component[0]?.Title;
                            items["Portfoliotype"] = "Component";
                        }
                        if (items?.Services?.length > 0) {
                            items.portfolio = items?.Services[0];
                            items.PortfolioTitle = items?.Services[0]?.Title;
                            items["Portfoliotype"] = "Service";
                        }
                        items["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                        if (items?.Project?.Title != undefined) {
                            items["ProjectTitle"] = items?.Project?.Title;
                            items["ProjectPriority"] = items?.Project?.Priority_x0020_Rank;
                        } else {
                            items["ProjectTitle"] = '';
                            items["ProjectPriority"] = 0;
                        }



                        items.TeamMembersSearch = "";
                        items.AssignedToIds = [];
                        if (items.AssignedTo != undefined) {
                            items?.AssignedTo?.map((taskUser: any) => {
                                items.AssignedToIds.push(taskUser?.Id)
                                AllTaskUsers.map((user: any) => {
                                    if (user.AssingedToUserId == taskUser.Id) {
                                        if (user?.Title != undefined) {
                                            items.TeamMembersSearch =
                                                items.TeamMembersSearch + " " + user?.Title;
                                        }
                                    }
                                });
                            });
                        }
                        items.componentString =
                            items.Component != undefined &&
                                items.Component != undefined &&
                                items.Component.length > 0
                                ? getComponentasString(items.Component)
                                : "";
                        items.Shareweb_x0020_ID = globalCommon.getTaskId(items);
                        AllTaskUsers?.map((user: any) => {
                            if (user.AssingedToUserId == items.Author.Id) {
                                items.createdImg = user?.Item_x0020_Cover?.Url;
                            }
                            if (items.Team_x0020_Members != undefined) {
                                items.Team_x0020_Members.map((taskUser: any) => {
                                    var newuserdata: any = {};
                                    if (user.AssingedToUserId == taskUser.Id) {
                                        newuserdata["useimageurl"] = user?.Item_x0020_Cover?.Url;
                                        newuserdata["Suffix"] = user?.Suffix;
                                        newuserdata["Title"] = user?.Title;
                                        newuserdata["UserId"] = user?.AssingedToUserId;
                                        items["Usertitlename"] = user?.Title;
                                        items.AllTeamMember.push(newuserdata);
                                    }

                                });
                            }
                        });
                        AllTask.push(items);
                    });
                    let setCount = siteConfig?.length
                    if (arraycount === setCount) {
                        AllTask.sort((a: any, b: any) => {
                            return b?.Priority_x0020_Rank - a?.Priority_x0020_Rank;
                        })
                        AllTask.sort((a: any, b: any) => {
                            return b?.ProjectPriority - a?.ProjectPriority;
                        })
                        setAllSiteTasks(AllTask);
                        const categorizedUsers: any = [];

                        // Iterate over the users
                        for (const user of AllTaskUsers) {
                            const category = user?.technicalGroup;
                            let categoryObject = categorizedUsers?.find((obj: any) => obj?.Title === category);
                            // If the category doesn't exist, create a new category object
                            if (!categoryObject) {
                                categoryObject = { Title: category, users: [], subRows: [], type: 'Category' };
                                categorizedUsers.push(categoryObject);
                            }
                            // const userTasks = AllTask?.filter((task:any) => 
                            // if(){
                            //     task?.AssignedTo?.filter((assigned:any)=>assigned?.Id=== user?.AssingedToUserId)
                            // });
                            const userTasks = AllTask?.filter((task: any) => task?.AssignedToIds?.includes(user?.AssingedToUserId));
                            categoryObject.users.push({ user, tasks: userTasks });
                        }
                        console.log(categorizedUsers);
                        for (const category of categorizedUsers) {
                            category?.users?.map((teamMember: any) => {
                                category.subRows = [...category?.subRows, ...teamMember?.tasks]
                            })
                        }

                        setCategoryGroup(categorizedUsers?.filter((item: any) => item?.Title != undefined))
                        console.log(categorizedUsers);
                        allSitesTasks = AllTask;
                        GetMasterData();
                    }

                });
            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Site Config Length less than 0')
        }
    };
    const sortOnPriority = (Array: any) => {
        return Array.sort((a: any, b: any) => {
            return b?.Priority_x0020_Rank - a?.Priority_x0020_Rank;
        })
    }
    const SmartTimeData = async (items: any) => {
        let FinalTotalTime: any = 0;
        try {
            let AllTimeSpentDetails: any = [];
            let filteres: string;
            let TimeSheetlistId: any;
            let siteUrl: any;
            let listName: any;
            // Get the list Name
            let TimesheetConfiguration: any = [];
            if (siteConfig?.length > 0) {
                siteConfig.forEach((itemss: any) => {
                    if (itemss.Title == items.siteType && itemss.TaxType == 'Sites') {
                        TimesheetConfiguration = JSON.parse(itemss.Configurations)
                    }
                })
                TimesheetConfiguration?.forEach((val: any) => {
                    TimeSheetlistId = val.TimesheetListId;
                    siteUrl = val.siteUrl
                    listName = val.TimesheetListName
                })
            }
            if (items.siteType === "Offshore Tasks") {
                const siteType = "OffshoreTasks";
                filteres = `Task${siteType}/Id eq ${items.Id}`;
            } else {
                filteres = `Task${items.siteType}/Id eq ${items.Id}`;
            }
            const select = "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,Author/Id,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + filteres;
            let count = 0;
            let allurls: { Url: string }[];
            if (items.siteType === "Migration" || items.siteType === "ALAKDigital") {
                allurls = [
                    { Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('9ed5c649-3b4e-42db-a186-778ba43c5c93')/items?$select=" + select }
                ];
            } else if (items.siteType === "SH") {
                allurls = [
                    { Url: `${items.siteUrl}/_api/web/lists/getbyTitle('TaskTimesheet')/items?$select=${select}` }
                ];
            } else {
                if (listName != undefined) {
                    allurls = [
                        { Url: `${items.siteUrl}/_api/web/lists/getbyTitle('${listName}')/items?$select=${select}` }
                    ];
                }
            }
            for (const item of allurls) {

                const response = await $.ajax({
                    url: item.Url,
                    method: "GET",
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    }
                });
                count++;
                let tempArray: any = [];
                if (response.d.results !== undefined && response.d.results.length > 0) {
                    AllTimeSpentDetails = AllTimeSpentDetails.concat(response.d.results);
                    AllTimeSpentDetails.forEach((item: any) => {
                        if (item.AdditionalTimeEntry !== null) {
                            const data = JSON.parse(item.AdditionalTimeEntry);

                            if (data !== undefined && data.length > 0) {
                                data.forEach((timeData: any) => {
                                    tempArray.push(timeData);
                                });
                            }
                        }
                    });
                }
                let TotalTimeData: number = 0;
                if (tempArray.length > 0) {
                    tempArray.forEach((tempItem: any) => {
                        if (typeof tempItem.TaskTimeInMin === 'string') {
                            const timeValue = Number(tempItem.TaskTimeInMin);

                            if (timeValue > 0) {
                                TotalTimeData += timeValue;
                            }
                        } else {
                            if (tempItem.TaskTimeInMin > 0) {
                                TotalTimeData += tempItem.TaskTimeInMin;
                            }
                        }
                    });
                }
                if (TotalTimeData > 0) {
                    FinalTotalTime = TotalTimeData / 60;
                }

            }
        } catch (error) {
            // console.error("Error:", error);
        }
        // console.log(FinalTotalTime);
        return FinalTotalTime;
    };
    return (
        <>
            <div>
                <div className="col-sm-12 pad0 smart">
                    <div className="section-event project-overview-Table">
                        <div >
                            <div className='header-section justify-content-between row'>
                                <div className="col-sm-8">
                                    <h2 style={{ color: "#000066", fontWeight: "600" }}>Project Management Overview</h2>
                                </div>
                                <div className="col-sm-4 text-end">
                                    <AddProject CallBack={CallBack} AllListId={AllListId} />
                                    {/* {showTeamMemberOnCheck === true ? <span><a className="teamIcon" onClick={() => ShowTeamFunc()}><span title="Create Teams Group" className="svg__iconbox svg__icon--team teamIcon"></span></a></span> : ''} */}
                                </div>
                            </div>
                            <>
                                <div className='ProjectOverViewRadioFlat  d-flex justify-content-between'>
                                    <dl className='alignCenter gap-2 mb-0'>
                                        <dt className='form-check l-radio'>
                                            <input className='form-check-input' type="radio" value="Projects" name="date" checked={selectedView == 'Projects'} onClick={() => setSelectedView('Projects')} /> Projects
                                        </dt>
                                        <dt className='form-check l-radio'>
                                            <input className='form-check-input' type="radio" value="flat" name="date" checked={selectedView == 'flat'} onClick={() => setSelectedView('flat')} /> Today's Tasks
                                        </dt>
                                        <dt className='form-check l-radio'>
                                            <input className='form-check-input' type="radio" value="grouped" name="date" checked={selectedView == 'grouped'} onClick={() => setSelectedView('grouped')} /> Grouped View
                                        </dt>
                                        <dt className='form-check l-radio'>
                                            <input className='form-check-input' type="radio" value="teamWise" name="date" checked={selectedView == 'teamWise'} onClick={() => setSelectedView('teamWise')} /> Team View
                                        </dt>

                                    </dl>
                                    <div className="text-end">
                                        {currentUserData?.Title == "Ranu Trivedi" || currentUserData?.Title == "Abhishek Tiwari" || currentUserData?.Title == "Prashant Kumar" ?
                                            <a className="hreflink" onClick={() => { sendAllWorkingTodayTasks() }}>Share Working Todays's Task</a>
                                            : ''}
                                    </div>
                                </div>
                                <div className="Alltable">
                                    {selectedView == 'grouped' ? <GlobalCommanTable headerOptions={headerOptions} AllListId={AllListId} columns={columns} data={data} paginatedTable={false} callBackData={callBackData} pageName={"ProjectOverviewGrouped"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                    {selectedView == 'flat' ? <GlobalCommanTable headerOptions={headerOptions} AllListId={AllListId} columns={flatView} paginatedTable={true} data={AllSiteTasks} callBackData={callBackData} pageName={"ProjectOverview"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                    {selectedView == 'teamWise' ? <GlobalCommanTable headerOptions={headerOptions} AllListId={AllListId} columns={groupedUsers} paginatedTable={true} data={categoryGroup} callBackData={callBackData} pageName={"ProjectOverviewGrouped"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                    {selectedView == 'Projects' ? <GlobalCommanTable AllListId={AllListId} headerOptions={headerOptions} paginatedTable={false} columns={column2} data={flatData} callBackData={callBackData} pageName={"ProjectOverview"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                </div>
                            </>
                        </div>
                    </div>
                </div>
                {isOpenEditPopup ? (
                    <EditTaskPopup AllListId={AllListId} context={props?.props?.Context} Items={passdata} pageName="TaskDashBoard" Call={editTaskCallBack} />
                ) : (
                    ""
                )}
                {IsComponent && <EditProjectPopup props={SharewebComponent} AllListId={AllListId} Call={Call} showProgressBar={showProgressBar}> </EditProjectPopup>}
                {ShowTeamPopup === true ? <ShowTeamMembers props={checkData} callBack={showTaskTeamCAllBack} TaskUsers={AllTaskUser} /> : ''}
                {openTimeEntryPopup && (<TimeEntryPopup props={taskTimeDetails} CallBackTimeEntry={TimeEntryCallBack} Context={props?.props?.Context} />)}
            </div>

        </>
    )
}