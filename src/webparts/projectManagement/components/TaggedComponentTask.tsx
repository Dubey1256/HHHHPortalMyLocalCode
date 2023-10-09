import { Panel, PanelType } from "office-ui-fabric-react";
import * as React from "react";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { ColumnDef } from "@tanstack/react-table";
import { data } from "jquery";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import { Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import * as Moment from "moment";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import Loader from "react-loader";
import { BsTag, BsTagFill } from "react-icons/bs";
import CreateTaskFromProject from "./CreateTaskFromProject";
let headerOptions: any = { openTab: true, teamsIcon: true }
var siteConfig: any = [];
var allSmartInfo: any = [];
let portfolioColor: any = '';
const TaggedComponentTask = (props: any) => {
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [passdata, setpassdata] = React.useState("");
    const [AllSiteTasks, setAllSiteTasks] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [isOpenCreateTask, setisOpenCreateTask] = React.useState(false);
    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span className="siteColor">
                        Portfolio Task Tagging - {props?.SelectedItem?.Title}
                    </span>
                </div>
            </div>
        );
    };
    const callBackData = React.useCallback((elem: any, ShowingData: any) => {


    }, []);
    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            // {
            //     accessorKey: "",
            //     placeholder: "",
            //     hasCheckbox: true,
            //     size: 20,
            //     id: 'Id',
            // },
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
                            <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={props?.MasterListData} AllSitesTaskData={props?.AllSitesTaskData} />
                        </span>
                    </>
                ),
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <>
                        <span>
                            <a
                                className="hreflink"
                                href={`${props?.AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>
                            {row?.original?.Body !== null &&
                                row?.original?.Body != undefined ? (
                                <span className="alignIcon">
                                    {" "}
                                    <InfoIconsToolTip
                                        Discription={row?.original?.bodys}
                                        row={row?.original}
                                    />{" "}
                                </span>
                            ) : (
                                ""
                            )}
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
                accessorFn: (row) => row?.TaskTypeValue,
                cell: ({ row }) => (
                    <>
                        <span className="columnFixedTaskCate"><span title={row?.original?.TaskTypeValue} className="text-content">{row?.original?.TaskTypeValue}</span></span>
                    </>
                ),
                placeholder: "Task Type",
                header: "",
                resetColumnFilters: false,
                size: 120,
                id: "TaskTypeValue",
            },
            {
                accessorFn: (row) => row?.Site,
                cell: ({ row }) => (
                    <span>
                        <img className='circularImage rounded-circle' src={row?.original?.SiteIcon} />
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
                accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,
                cell: ({ row }) => (
                    <>
                        {row?.original?.ProjectTitle != (null || undefined) ?
                            <span ><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${props?.AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.ProjectId}`} >
                                <ReactPopperTooltip ShareWebId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={props?.AllListId} /></a></span>
                            : ""}
                    </>
                ),
                id: 'ProjectTitle',
                placeholder: "Project",
                resetColumnFilters: false,
                header: "",
                size: 70,
            },
            {
                accessorFn: (row) => row?.Portfolio,
                cell: ({ row }) => (
                    <a
                        className="hreflink"
                        data-interception="off"
                        target="blank"
                        href={`${props?.AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
                    >
                        {row?.original?.portfolio?.Title}
                    </a>
                ),
                id: "Portfolio",
                placeholder: "Portfolio",
                resetColumnFilters: false,
                resetSorting: false,
                header: ""
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                placeholder: "Priority",
                id: 'Priority',
                header: "",
                resetColumnFilters: false,
                isColumnDefultSortingDesc: true,
                resetSorting: false,
                size: 75
            },
            {
                accessorFn: (row) => row?.DueDate,
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                cell: ({ row }) => (
                    <span className="d-flex">
                        {row?.original?.DisplayDueDate}
                    </span>
                ),
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.DisplayDueDate?.includes(filterValue)
                },
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
                id: 'PercentComplete',
                placeholder: "% Complete",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 55
            },
            {
                accessorFn: (row) => row?.TeamMembers?.map((elem: any) => elem.Title).join('-'),
                id: 'TeamMembers',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "TeamMembers",
                cell: ({ row }) => (
                    <span className="d-flex">
                        <ShowTaskTeamMembers props={row?.original} TaskUsers={props?.AllUser} />
                    </span>
                ),
                header: "",
                size: 110
            },
            {
                accessorFn: (row) => row?.SmartInformation[0]?.Title,
                id: 'SmartInformation',
                resetSorting: false,
                resetColumnFilters: false,
                placeholder: "Remarks",
                header: '',
                size: 125
            },

            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span className="d-flex">
                        <span>{row?.original?.DisplayCreateDate} </span>

                        {row?.original?.createdImg != undefined ? (
                            <>
                                <a
                                    href={`${props?.AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                    target="_blank"
                                    data-interception="off"
                                >
                                    <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
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
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 105
            },
            {
                cell: ({ row }) => (
                    <>
                        {row?.original?.Project?.Id == undefined ? <span title="Tag Task" className="text-end f-19 alignIcon hreflink">
                            <BsTag onClick={() => TagTask(row?.original)}></BsTag>

                        </span> : <span title="Already Tagged" className="alignIcon f-19"><BsTagFill></BsTagFill></span>}</>
                ),
                id: 'Actions',
                accessorKey: "",
                canSort: false,
                resetSorting: false,
                resetColumnFilters: false,
                placeholder: "",
                size: 30
            }
        ],
        [data]
    );
    const EditPopup = React.useCallback((item: any) => {
        setisOpenEditPopup(true);
        setpassdata(item);
    }, []);
    const CallBack = React.useCallback((item: any) => {
        setisOpenEditPopup(false);
    }, []);
    const callBack = () => {
        props?.callBack()
    }
    const LoadAllSiteAllTasks = async function () {
        let AllSiteTasks: any = [];
        let Counter = 0;
        let web = new Web(props?.AllListId?.siteUrl);
        let arraycount = 0;
        try {
            if (siteConfig?.length > 0) {
                siteConfig.map(async (config: any) => {
                    if (config.Title != "SDC Sites") {
                        let smartmeta = [];
                        await web.lists
                            .getById(config.listId)
                            .items.select("Id,Title,FeedBack,PriorityRank,Remark,Project/PriorityRank,ParentTask/Id,ParentTask/Title,ParentTask/TaskID,TaskID,SmartInformation/Id,SmartInformation/Title,Project/Id,Project/Title,Project/PortfolioStructureID,workingThisWeek,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title")
                            .expand('AssignedTo,Project,ParentTask,SmartInformation,Author,Portfolio,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory').filter("Status ne 'Completed' and Portfolio/Id eq '" + props?.SelectedItem?.Id + "'&$orderby=Created desc")
                            .getAll().then((data: any) => {
                                smartmeta = data;
                                smartmeta.map((items: any) => {
                                    if (items?.SmartInformation?.length > 0) {
                                        allSmartInfo?.map((smart: any) => {
                                            if (smart?.Id == items?.SmartInformation[0]?.Id) {
                                                // var smartdata=[]
                                                // smartdata.push(smart)
                                                items.SmartInformation = [smart]
                                            }

                                        })
                                    }
                                    if (items?.TaskCategories?.length > 0) {
                                        items.TaskTypeValue = items?.TaskCategories?.map((val: any) => val.Title).join(",")
                                    }
                                    items.AllTeamMember = [];
                                    items.fontColorTask = "#000"
                                    items.HierarchyData = [];
                                    items.descriptionsSearch = '';
                                    items.siteType = config.Title;
                                    items.bodys = items.Body != null && items.Body.split('<p><br></p>').join('');
                                    if (items?.Body != undefined && items?.Body != null) {
                                        items.descriptionsSearch = items?.Body.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
                                    }
                                    items.commentsSearch = items?.Comments != null && items?.Comments != undefined ? items.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
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
                                    if (items?.Portfolio?.Id != undefined) {
                                        items.portfolio = items?.Portfolio;
                                        items.PortfolioTitle = items?.Portfolio?.Title;
                                    }
                                    items["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;

                                    items.TeamMembersSearch = "";
                                    if (items.AssignedTo != undefined) {
                                        items?.AssignedTo?.map((taskUser: any) => {
                                            props?.AllUser.map((user: any) => {
                                                if (user.AssingedToUserId == taskUser.Id) {
                                                    if (user?.Title != undefined) {
                                                        items.TeamMembersSearch =
                                                            items.TeamMembersSearch + " " + user?.Title;
                                                    }
                                                }
                                            });
                                        });
                                    }
                                    items.TaskID = globalCommon.GetTaskId(items);
                                    if (items.Project) {
                                        items.ProjectTitle = items?.Project?.Title;
                                        items.ProjectId = items?.Project?.Id;
                                        items.projectStructerId = items?.Project?.PortfolioStructureID
                                        const title = items?.Project?.Title || '';
                                        const formattedDueDate = Moment(items?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                                        items.joinedData = [];
                                        if (items?.projectStructerId && title || formattedDueDate) {
                                            items.joinedData.push(`Project ${items?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                                        }
                                    }
                                    props?.AllUser?.map((user: any) => {
                                        if (user.AssingedToUserId == items.Author.Id) {
                                            items.createdImg = user?.Item_x0020_Cover?.Url;
                                        }
                                        if (items.TeamMembers != undefined) {
                                            items.TeamMembers.map((taskUser: any) => {
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
                                    AllSiteTasks.push(items);
                                });
                                arraycount++;
                            });
                        let currentCount = siteConfig?.length;
                        if (arraycount === currentCount) {
                            setLoaded(true)
                            setAllSiteTasks(AllSiteTasks);
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
        siteConfig = []
        if (props?.AllListId?.SmartMetadataListID != undefined) {
            try {
                let web = new Web(props?.AllListId.siteUrl);
                let smartmeta = [];
                let TaxonomyItems = [];
                smartmeta = await web.lists
                    .getById(props?.AllListId?.SmartMetadataListID)
                    .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                    .top(5000)
                    .filter("TaxType eq 'Sites'")
                    .expand("Parent")
                    .get();
                if (smartmeta.length > 0) {
                    smartmeta?.map((site: any) => {
                        if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.IsVisible == true) {
                            siteConfig.push(site)
                        }
                    })

                } else {
                    siteConfig = smartmeta;
                }
                LoadAllSiteAllTasks()
            } catch (error) {
                console.log(error)
            }
        } else {
            alert('Smart Metadata List Id not present')
            siteConfig = [];
        }
    };

    const TagTask = async (item: any) => {
        let confirmation = confirm(
            "Are you sure you want to tag " + `${item?.TaskID} - ${item?.Title}` + " from this project ?"
        );
        if (confirmation == true) {
            const web = new Web(item?.siteUrl);
            await web.lists
                .getById(item?.listId)
                .items.getById(item?.Id)
                .update({
                    ProjectId: parseInt(props?.projectItem.Id),
                })
                .then((e: any) => {
                    LoadAllSiteAllTasks();
                    alert('Task has been tagged successfully')
                })
                .catch((err: { message: any }) => {
                    console.log(err.message);
                });
        }
    };
    const CreateTask = React.useCallback(() => {
        setisOpenCreateTask(false)
    }, []);
    React.useEffect(() => {
        try {
            setLoaded(false)
            GetMetaData()

        } catch (e) {
            console.log(e);
        }
    }, []);
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.large}
                isOpen={true}
                onDismiss={() => callBack()}
                isBlocking={false}>
              
                <CreateTaskFromProject
                    projectItem={props?.projectItem}
                    SelectedProp={props?.SelectedProp}
                    pageContext={props?.context?._pageContext}
                    projectId={props?.projectItem?.Id}
                    callBack={CreateTask}
                    createComponent={props?.createComponent}
                />     
                 <div className="Alltable">
                {AllSiteTasks && <GlobalCommanTable AllListId={props?.AllListId} headerOptions={headerOptions} columns={column2} data={AllSiteTasks} callBackData={callBackData} TaskUsers={props?.AllUser} showHeader={true} />}
                <Loader loaded={loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1} color={portfolioColor ? portfolioColor : "#000066"}
                    speed={2} trail={60} shadow={false} hwaccel={false} className="spinner" zIndex={2e9} top="28%" left="50%" scale={1.0} loadedClassName="loadedContent" />
                    </div>
                <div className="text-end mt-3">
                    <button className="btn btn-default" onClick={() => callBack()}>Cancel</button>
                </div>
            </Panel>
            {isOpenEditPopup ? (
                <EditTaskPopup AllListId={props?.AllListId} Items={passdata} context={props?.props?.Context} pageName="ProjectProfile" Call={CallBack} />) : ("")}
        </>
    )
};
export default TaggedComponentTask; 