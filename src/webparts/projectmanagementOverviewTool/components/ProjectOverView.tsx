import * as React from 'react';
import PageLoader from '../../../globalComponents/pageLoader';
import "bootstrap/dist/css/bootstrap.min.css"; import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
    ColumnDef,
} from "@tanstack/react-table";

import { FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import HighlightableCell from "../../../globalComponents/GroupByReactTableComponents/highlight";
import {
    useTable,
    useSortBy,
    useFilters,
    useExpanded,
    usePagination,
    HeaderGroup,

} from 'react-table';
import { Filter, DefaultColumnFilter } from './filters';
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import AddProject from './AddProject'
import EditProjectPopup from './EditProjectPopup';
import InlineEditingcolumns from './inlineEditingcolumns';
import * as globalCommon from "../../../globalComponents/globalCommon";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
var siteConfig: any = []
var DataSiteIcon: any = [];
var AllTaskUsers: any = []
var Idd: number;
var allSitesTasks: any = [];
var AllListId: any = {};
var isShowTimeEntry: any = "";
var isShowSiteCompostion: any = "";
export default function ProjectOverview(props: any) {
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [listIsVisible, setListIsVisible] = React.useState(false);
    const [GroupedDisplayTable, setDisplayGroupedTable] = React.useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [searchedNameData, setSearchedDataName] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [AllTasks, setAllTasks]: any = React.useState([]);
    const [passdata, setpassdata] = React.useState("");
    const [AllSiteTasks, setAllSiteTasks]: any = React.useState([]);
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    React.useEffect(() => {
        try {
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
        TaskUser()
        GetMetaData()

    }, [])

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
                .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name")
                .top(5000)
                .expand("AssingedToUser,Approver")
                .get();
            setAllTaskUser(taskUser);
            AllTaskUsers = taskUser;
        } else {
            alert('Task User List Id not available')
        }
        // console.log("all task user =====", taskUser)
    }
    const editTaskCallBack = React.useCallback((item: any) => {
        setisOpenEditPopup(false);
    }, []);

    const GetMetaData = async () => {
        if (AllListId?.SmartMetadataListID != undefined) {
            try {
                let web = new Web(AllListId?.siteUrl);
                let smartmeta = [];
                let TaxonomyItems = [];
                smartmeta = await web.lists
                    .getById(AllListId?.SmartMetadataListID)
                    .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
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
                accessorKey: "Title",
                placeholder: "Title",
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
                        style={row.getCanExpand() ? {
                            paddingLeft: `${row.depth * 5}px`,
                        } : {
                            paddingLeft: "18px",
                        }}
                    >
                        <>
                            {row.getCanExpand() ? (
                                <span className=' border-0'
                                    {...{
                                        onClick: row.getToggleExpandedHandler(),
                                        style: { cursor: "pointer" },
                                    }}
                                >
                                    {row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            ) : (
                                ""
                            )}{" "}
                            {row?.original?.siteType === "Master Tasks" ? <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.original?.Title}</a> : ''}
                            {row?.original?.siteType !== "Master Tasks" ? <span>
                                <a className='hreflink'
                                    href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                    data-interception="off"
                                    target="_blank"
                                >
                                    {row?.original?.Title}
                                </a>


                            </span> : ''}

                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row.original} pageName={'ProjectOverView'} />
                    </span>

                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                size: 4,
            },
            {
                accessorFn: (row) => row?.Priority_x0020_Rank,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row.original} pageName={'ProjectOverView'} />

                    </span>
                ),
                id: 'Priority_x0020_Rank',
                placeholder: "Priority",
                header: "",
                size: 4,
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
                header: "",
                size: 11,
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
                size: 8,
            },
            {
                accessorFn: (row) => row?.Id,
                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Master Tasks" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                        {row?.original?.siteType !== "Master Tasks" ? <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                size: 3,
            }
        ],
        [data]
    );
    const reactColumns = React.useMemo(
        () => [
            {
                internalHeader: 'Title',
                accessor: 'Title',
                showSortIcon: true,
                Cell: ({ row }: any) => (
                    <span>
                        <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.values?.Title}</a>
                    </span>
                )
            },
            {
                internalHeader: '% Complete',
                accessor: 'PercentComplete',
                showSortIcon: true,
                style: { width: '100px' },
                Cell: ({ row }: any) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row.original} pageName={'ProjectOverView'} />
                    </span>
                ),
            },
            {
                internalHeader: 'Priority',
                accessor: 'Priority_x0020_Rank',
                showSortIcon: true,
                style: { width: '100px' },
                Cell: ({ row }: any) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row.original} pageName={'ProjectOverView'} />

                    </span>
                ),
            },
            {
                internalHeader: 'Team Members',
                accessor: 'TeamMembersSearch',
                showSortIcon: true,
                style: { width: '150px' },
                Cell: ({ row }: any) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Team' item={row?.original} TaskUsers={AllTaskUser} pageName={'ProjectOverView'} />
                        {/* <ShowTaskTeamMembers  props={row?.original} TaskUsers={AllTaskUser}></ShowTaskTeamMembers> */}
                    </span>
                )
            },
            {
                internalHeader: 'Due Date',
                showSortIcon: true,
                accessor: 'DisplayDueDate',
                style: { width: '100px' },
                Cell: ({ row }: any) => <InlineEditingcolumns
                    AllListId={AllListId}
                    callBack={CallBack}
                    columnName="DueDate"
                    item={row?.original}
                    TaskUsers={AllTaskUser}
                />,
            },
            {
                internalHeader: '',
                id: 'Id', // 'id' is required
                isSorted: false,
                showSortIcon: false,
                style: { width: '30px' },
                Cell: ({ row }: any) => (
                    <>
                        {row?.original?.siteType === "Master Tasks" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                    </>
                ),
            },
        ],
        [data]
    );



    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize },
    }: any = useTable(
        {
            columns: reactColumns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 150000 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );
    //Inline Editing Callback
    const inlineEditingCall = (item: any) => {
        page?.map((tasks: any) => {
            if (tasks.Id == item.Id) {
                tasks = item;
            }
        })
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
                items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                items.siteUrl = AllListId?.siteUrl;
                items.listId = AllListId?.MasterTaskListID;
                items.AssignedUser = []
                items.siteType = "Master Tasks"
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
                items['subRows'] = [];
                allSitesTasks?.map((task: any) => {
                    if (task?.IsTodaysTask == true && task?.Project?.Id == items?.Id) {
                        items['subRows'].push(task);
                    }
                })
                items.DisplayDueDate = items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : ""
            })
            // })
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
    const callBackData = React.useCallback((elem: any, ShowingData: any) => {

        if (ShowingData != undefined) {
            setShowingData([ShowingData])
        }
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
    const loadAdminConfigurations = async () => {
        if (AllListId?.AdminConfigrationListID != undefined) {
            var CurrentSiteType = "";
            let web = new Web(AllListId?.siteUrl);
            await web.lists
                .getById(AllListId.AdminConfigrationListID)
                .items.select(
                    "Id,Title,Value,Key,Description,DisplayTitle,Configurations&$filter=Key eq 'TaskDashboardConfiguration'"
                )
                .top(4999)
                .get()
                .then(
                    (response) => {
                        var SmartFavoritesConfig = [];
                        $.each(response, function (index: any, smart: any) {
                            if (smart.Configurations != undefined) {
                                DataSiteIcon = JSON.parse(smart.Configurations);
                            }
                        });
                    },
                    function (error) { }
                );
        } else {
            alert('Admin Configration List Id not present')
            DataSiteIcon = [];
        }
    };
    const LoadAllSiteTasks = function () {
        loadAdminConfigurations();
        if (siteConfig?.length > 0) {
            try {
                var AllTask: any = [];
                let web = new Web(AllListId?.siteUrl);
                var arraycount = 0;
                siteConfig.map(async (config: any) => {

                    let smartmeta = [];
                    smartmeta = await web.lists
                        .getById(config.listId)
                        .items.select(
                            "Id,StartDate,DueDate,Title,SharewebCategories/Id,SharewebCategories/Title,PercentComplete,Created,Body,IsTodaysTask,Categories,Priority_x0020_Rank,Priority,ClientCategory/Id,SharewebTaskType/Id,SharewebTaskType/Title,ComponentId,ServicesId,ClientCategory/Title,Project/Id,Project/Title,Author/Id,Author/Title,Editor/Id,Editor/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,Component/Id,component_x0020_link,Component/Title,Services/Id,Services/Title,Remark"
                        ).filter("IsTodaysTask eq 1")
                        .top(4999)
                        .orderBy("Priority_x0020_Rank", false)
                        .expand(
                            "Project,SharewebCategories,AssignedTo,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,ClientCategory,Component,Services,SharewebTaskType"
                        )
                        .get();
                    arraycount++;
                    smartmeta.map((items: any) => {

                        items.AllTeamMember = [];
                        items.siteType = config.Title;
                        items.bodys = items.Body != null && items.Body.split('<p><br></p>').join('');
                        items.listId = config.listId;
                        items.siteUrl = config.siteUrl.Url;
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
                        if (DataSiteIcon != undefined) {
                            DataSiteIcon.map((site: any) => {
                                if (site.Site?.toLowerCase() == items.siteType?.toLowerCase()) {
                                    items["siteIcon"] = site.SiteIcon;
                                }
                            });
                        }
                       

                        items.TeamMembersSearch = "";
                        if (items.AssignedTo != undefined) {
                            items?.AssignedTo?.map((taskUser: any) => {
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
                                    }
                                    items.AllTeamMember.push(newuserdata);
                                });
                            }
                        });
                        AllTask.push(items);
                    });
                    let setCount = siteConfig?.length
                    if (arraycount === setCount) {
                        setAllSiteTasks(AllTask);
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
    console.log(AllTasks);
    return (
        <>
        <div>
            <div className="col-sm-12 pad0 smart">
                <div className="section-event">
                    <div >
                        <div className='header-section justify-content-between'>
                            <h2 style={{ color: "#000066", fontWeight: "600" }}>Project Management Overview</h2>
                            <div className="text-end">
                                {GroupedDisplayTable ? <a className="hreflink" onClick={() => { setDisplayGroupedTable(false) }}>Hide Working Today's Task</a> : <a className="hreflink" onClick={() => { setDisplayGroupedTable(true) }}>Show Working Today's Task</a>}  <AddProject CallBack={CallBack} AllListId={AllListId} />
                            </div>
                        </div>

                        {GroupedDisplayTable ?
                            <div className="Alltable p-2">
                                <GlobalCommanTable columns={columns} data={data} callBackData={callBackData}  pageName={"ProjectOverview"}/>
                            </div>
                            : ""}


                        <div>
                            {!GroupedDisplayTable ? <Table className="SortingTable" bordered hover {...getTableProps()}>
                                <thead className="fixed-Header">
                                    {headerGroups.map((headerGroup: any) => (
                                        <tr  {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column: any) => (
                                                <th  {...column.getHeaderProps()} style={column?.style}>
                                                    <span class="Table-SortingIcon" style={{ marginTop: '-6px' }} {...column.getSortByToggleProps()} >
                                                        {column.render('Header')}
                                                        {generateSortingIndicator(column)}
                                                    </span>
                                                    <Filter column={column} />
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>

                                <tbody {...getTableBodyProps()}>
                                    {page?.map((row: any) => {
                                        prepareRow(row)
                                        return (
                                            <tr {...row.getRowProps()}  >
                                                {row.cells.map((cell: { getCellProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>; render: (arg0: string) => boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
                                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                })}
                                            </tr>
                                        )

                                    })}
                                </tbody>
                            </Table> : ''}
                        </div>
                    </div>
                </div>
            </div>
            {isOpenEditPopup ? (
                <EditTaskPopup AllListId={AllListId} context={props?.props?.Context} Items={passdata} pageName="TaskDashBoard" Call={editTaskCallBack} />
            ) : (
                ""
            )}
            {IsComponent && <EditProjectPopup props={SharewebComponent} AllListId={AllListId} Call={Call} showProgressBar={showProgressBar}> </EditProjectPopup>}

        </div>
      
        </>
    )
}