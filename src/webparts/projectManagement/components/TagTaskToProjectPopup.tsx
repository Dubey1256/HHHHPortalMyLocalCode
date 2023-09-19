
import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
// import '../components/TagTaskToProjectPopup.css';
import Button from 'react-bootstrap/Button';
<<<<<<< HEAD
import Modal from 'react-bootstrap/Modal';
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch } from 'react-icons/fa';
=======
import { Panel, PanelType } from "office-ui-fabric-react";
>>>>>>> cd1fd6d953a8eaf4b7bc60ba9d93f34dde41dfff
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
import * as globalCommon from "../../../globalComponents/globalCommon"
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';
import { ColumnDef } from '@tanstack/react-table';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
var AllUser: any = []
var siteConfig: any = []
var DataSiteIcon: any = []
let headerOptions: any = {
    openTab: true,
    teamsIcon: true
}
let AllListId = {};
const TagTaskToProjectPopup = (props: any) => {

    const [lgShow, setLgShow] = useState(false);
    const [AllTasks, setAllTasks] = React.useState([])
    const [selectedTasks, setSelectedTasks] = React.useState([])
    const [AllTaskUser, setAllTaskUser] = React.useState([])

    const TaskUser = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUser = [];
        taskUser = await web.lists
            .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
            .items
            .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name")
            .expand("AssingedToUser,Approver")
            .get();
        AllUser = taskUser;
        setAllTaskUser(taskUser)
    }
    const GetMetaData = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let smartmeta = [];

        let TaxonomyItems = [];
        smartmeta = await web.lists
            .getById('01a34938-8c7e-4ea6-a003-cee649e8c67a')
            .items
            .select('Id', 'IsVisible', 'ParentID', 'Title', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(5000)
            .filter("TaxType eq 'Sites'")
            .expand('Parent')
            .get();
        siteConfig = smartmeta;
        LoadAllSiteTasks();
    }

    const loadAdminConfigurations = function () {

        var CurrentSiteType = ''

        axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('e968902a-3021-4af2-a30a-174ea95cf8fa')/items?$select=Id,Title,Value,Key,Description,DisplayTitle,Configurations&$filter=Key eq 'TaskDashboardConfiguration'")
            .then((response: AxiosResponse) => {
                var SmartFavoritesConfig = [];
                $.each(response.data.value, function (index: any, smart: any) {
                    if (smart.Configurations != undefined) {
                        DataSiteIcon = JSON.parse(smart.Configurations);
                    }
                });

            },
                function (error) {

                });
    }

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {
        let MultiSelectedData: any = [];
        if (elem?.length > 0) {
            elem.map((item: any) => MultiSelectedData?.push(item?.original))
        }
        setSelectedTasks(MultiSelectedData)
    }, []);
    const LoadAllSiteTasks = function () {
        loadAdminConfigurations();
        var AllTask: any = []
        var query = "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        var Counter = 0;
        let web = new Web(props?.AllListId?.siteUrl);
        var arraycount = 0;
        siteConfig.map(async (config: any) => {
            if (config.Title != 'SDC Sites' && config.Title != 'Master Tasks') {

                let smartmeta = [];
                let TaxonomyItems = [];
                smartmeta = await web.lists
                    .getById(config?.listId)
                    .items
                    .select("Id,Title,PriorityRank,Remark,Project/PriorityRank,SmartInformation/Id,SmartInformation/Title,Project/Id,Project/Title,workingThisWeek,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,Portfolio/Id,Portfolio/Title,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title")
                    .expand('AssignedTo,Project,Portfolio,SmartInformation,Author,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory')
                    .top(4999)
                    // .filter("Project/Id ne " + props.projectId)
                    .get();
                arraycount++;
                smartmeta.map((items: any) => {
                    items.AllTeamMember = [];
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
                            ? moment(items.DueDate).format("DD/MM/YYYY")
                            : "";
                    items.DisplayCreateDate =
                        items.Created != null
                            ? moment(items.Created).format("DD/MM/YYYY")
                            : "";

                    items.portfolio = {};
                    if (items?.Portfolio?.Id != undefined) {
                        items.portfolio = items?.Portfolio;
                        items.PortfolioTitle = items?.Portfolio?.Title;
                        // items["Portfoliotype"] = "Component";
                    }
                    items["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;

                    items.TeamMembersSearch = "";
                    if (items.AssignedTo != undefined) {
                        items?.AssignedTo?.map((taskUser: any) => {
                            AllUser.map((user: any) => {
                                if (user.AssingedToUserId == taskUser.Id) {
                                    if (user?.Title != undefined) {
                                        items.TeamMembersSearch =
                                            items.TeamMembersSearch + " " + user?.Title;
                                    }
                                }
                            });
                        });
                    }
                  
                    items.TaskID = globalCommon.getTaskId(items);
                    AllUser?.map((user: any) => {
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
                    AllTask.push(items);
                });

                if (arraycount === 17) {
                    setAllTasks(sortOnCreated(AllTask))
                }

            } else {
                arraycount++
            }
        })
        console.log(AllTasks)
    }
    const sortOnCreated = (Array: any) => {
        Array.sort((a: any, b: any) => new Date(b.Created).getTime() - new Date(a.Created).getTime());
        return Array;
    }
   
    useEffect(() => {
        AllListId = props?.AllListId;
        TaskUser();
        GetMetaData();
    }, [props.projectId]);
    const OpenTaskPopupData = () => {
        TaskUser();
        GetMetaData();
        setLgShow(true)
    }

    const tagSelectedTasks = async () => {
        let selectedTaskId = ''
        if (props?.meetingPages) {
            // let confirmation = confirm('Are you sure you want to tagTask')
            // if(confirmation){
            props.callBack(selectedTasks);
            handleClose()
            // }

        } else {
            selectedTasks?.map(async (item: any, index: any) => {
                if (index == 0) {
                    selectedTaskId = selectedTaskId + '(' + item?.siteType + ') ' + item?.TaskID
                } else {
                    selectedTaskId = selectedTaskId + ',' + '(' + item?.siteType + ') ' + item?.TaskID
                }
            })

            let confirmation = confirm('Are you sure you want to tag ' + selectedTaskId + ' to this project ?')
            if (confirmation == true) {

                selectedTasks?.map(async (item: any, index: any) => {
                    const web = new Web(item?.siteUrl);
                    await web.lists.getById(item?.listId).items.getById(item?.Id).update({
                        ProjectId: props?.projectId != undefined ? props?.projectId : ''
                    }).then((e: any) => {
                        if (index == selectedTasks?.length - 1) {
                            props.callBack();

                        }
                    })
                        .catch((err: { message: any; }) => {
                            console.log(err.message);
                        });
                })

                handleClose()
            }

        }

    }

    const handleClose = () => {
        setLgShow(false);
    }

    const onRenderCustomHeaderMain = (type: any) => {
        return (
            <div className={"d-flex full-width pb-1"}>
                <div className='subheading'>
                    <span className="siteColor">
                        {`Add Existing Tasks - ${props.projectTitle}`}
                    </span>
                </div>
            </div>


        )

    }
    const onRenderCustomFooterMain = () => {
        return (


            <footer className='text-end p-2'>
                <button type="button" className="btn btn-default me-1 px-3" onClick={handleClose}>
                    Cancel
                </button>
                <button className="btn btn-primary px-3"
                    onClick={() => { tagSelectedTasks() }}>
                    Tag Tasks
                </button>

                {/* <Button type="button" className="me-2" variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button type="button" variant="primary" disabled={selectedTasks?.length > 0 ? false : true} onClick={() => tagSelectedTasks()}>Tag</Button> */}
            </footer>


        )
    }
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
    const inlineCallBack = React.useCallback((item: any) => {
        setAllTasks(prevTasks => {
            const updatedTasks = prevTasks.map((task: any) => {
                if (task.Id === item.Id && task.siteType === item.siteType) {
                    return { ...task, ...item };
                }
                return task;
            });
            return updatedTasks;
        });
    }, []);

    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                // hasCustomExpanded: true,
                // hasExpanded: true,
                size: 30,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                placeholder: "Task Id",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 130,
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
                            <a className="hreflink"
                                href={`${props?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>
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
                accessorFn: (row) => row?.Portfolio,
                cell: ({ row }) => (
                    <span>
                        <a className="hreflink"
                            data-interception="off"
                            target="blank"
                            href={`${props?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
                        >
                            {row?.original?.portfolio?.Title}
                        </a>
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
                            TaskUsers={AllTaskUser}
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
                        TaskUsers={AllTaskUser}
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
                            TaskUsers={AllTaskUser}
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
                accessorFn: (row) => row?.TeamMembers?.map((elem: any) => elem.Title).join('-'),
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns
                            AllListId={AllListId}
                            callBack={inlineCallBack}
                            columnName='Team'
                            item={row?.original}
                            TaskUsers={AllTaskUser}
                            pageName={'ProjectManagment'}
                        />
                    </span>
                ),
                id: 'TeamMembers',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "TeamMembers",
                header: "",
                size: 110
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span>
                        <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>
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
                isColumnDefultSortingDesc: true,
                placeholder: "Created",
                header: "",
                size: 125
            }
        ],
        [AllTasks]
    );

    return (
        <>
<<<<<<< HEAD
            <Button type="button" variant="secondary" className='pull-right me-2' onClick={() => OpenTaskPopupData()}>Tag Tasks</Button>
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <span className='modal-title' id="example-modal-sizes-title-lg">
                        <span><strong>Tag Tasks - {props.projectTitle}</strong></span>
                    </span>
                    <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </Modal.Header>
                <Modal.Body>
                    {
                        AllTasks?.length > 0 ? <div className=''>
                            <div className='col'>
                                <div className='Alltable'>
                                    <div className="tbl-headings">
                                        <span className="leftsec">
                                            <span className="g-search">
                                                <input className="searchbox_height full_width" type="text" value={searchText} onKeyDown={handleKeyDown} onChange={onSearchText} placeholder="Search" aria-label="Search" />
                                                    {searchText?.length > 0 ? <span className='g-searchclear' onClick={clearSearch} >×</span> : ''}
                                                    <span className="gsearch-btn" onClick={() => { searchTaskToTag() }}><i><FaSearch /></i></span>
                                            </span>
                                        </span>
                                    </div>
                                
                                    {SearchedAllTasks?.length > 0 ? <div className="col-sm-12 p-0 smart">
                                            <div className="section-event" style={{paddingTop : "35px"}}>
                                                <div className='Scrolling'>
                                                    <table className="table table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "2%" }}><div className='smart-relative'><input type="checkbox" id="isActive" checked={selectAll} defaultChecked={selectAll} onChange={() => selectAllFiltered(selectAll)} /></div></th>
                                                                <th style={{ width: "5%" }}><div className='smart-relative'>Site</div></th>
                                                                <th style={{ width: "10%" }}><div className='smart-relative'>Task Id</div></th>
                                                                <th style={{ width: "33%" }}><div className='smart-relative'> Task Title</div></th>
                                                                <th style={{ width: "18%" }}><div className='smart-relative'>Portfolio Type</div></th>
                                                                <th style={{ width: "10%" }}><div className='smart-relative'> % Complete</div></th>
                                                                <th style={{ width: "10%" }}><div className='smart-relative'>Priority</div></th>
                                                                <th style={{ width: "12%" }}><div className='smart-relative'>Created</div></th>
                                                                {/* <th>Edit</th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                                {
                                                                    SearchedAllTasks.map((item: any, index: any) => {
                                                                        return (
                                                                            <>
                                                                            <tr >
                                                                                <td className="p-0" colSpan={8}>
                                                                                    <table className="table table-hover m-0" style={{ width: "100%" }}>
                                                                                        <tr className="" key={index}>
                                                                                            <td style={{ width: "2%" }}><input type="checkbox" id="isActive" onClick={() => { selectRow(item, index) }} checked={item?.selected} /></td>
                                                                                            <td style={{ width: "5%" }}>
                                                                                                <img className="icon-sites-img"
                                                                                                title={item?.siteType} src={item?.siteIcon} />
                                                                                            </td >
                                                                                            <td style={{ width: "10%" }}>{item?.Shareweb_x0020_ID}</td>
                                                                                            <td style={{ width: "33%" }}>
                                                                                            <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-spfx.aspx?taskId=${item.Id}&Site=${item.siteType}`}>{item.Title}</a></span>
                                                                                            </td>
                                                                                            <td style={{ width: "18%" }}>
                                                                                                {item.Component != undefined &&
                                                                                                    <>
                                                                                                        {item.Component.map((types: any) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <span><a data-interception="off" target='blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${types.Id}`}>{types.Title}</a></span>
                                                                                                                </>
                                                                                                            )
                                                                                                        })}
                                                                                                    </>
                                                                                                }
                                                                                                {item.Component == undefined &&
                                                                                                    <>
                                                                                                        {item.Services.map((types: any) => {
                                                                                                            return (
                                                                                                                <>
                                                                                                                    <span><a data-interception="off" target='blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${types.Id}`}>{types.Title}</a></span>
                                                                                                                </>
                                                                                                            )
                                                                                                        })}
                                                                                                    </>
                                                                                                }
                                                                                            </td>
                                                                                            <td style={{ width: "10%" }}><span className="ml-2">{item.PercentComplete}</span></td>
                                                                                            <td style={{ width: "10%" }}>{item.Priority}</td>
                                                                                            <td style={{ width: "12%" }}>{item.CreatedDis}
                                                                                                {
                                                                                                    AllUser.map((user: any) => {
                                                                                                        if (user.AssingedToUserId == item.Author.Id) {
                                                                                                            return (
                                                                                                                <img className="AssignUserPhoto1" title={user.Title} src={user.Item_x0020_Cover.Url} alt={user.Title} />
                                                                                                            )

                                                                                                        }
                                                                                                    }) 
                                                                                                }
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                            
                                                    </table>
                                                </div>
                                            </div>
                                    </div> : ''}
                                </div>
                            </div>
                        </div> : 'Loading ...'
                    }
                </Modal.Body>
                <div className="modal-footer">
                    <Button type="button" variant="btn btn-primary" onClick={() => tagSelectedTasks()}>Tag</Button>
                    <Button type="button" className="btn btn-grey" variant="secondary" onClick={handleClose}>Cancel</Button>
                </div>
            </Modal>
=======

            {props.meetingPages ? <Button type="button" variant="secondary" className='pull-right ms-2' onClick={() => OpenTaskPopupData()}>Add Tasks To Meeting</Button>
                : <Button type="button" variant="secondary" className='pull-right ms-2' onClick={() => OpenTaskPopupData()}>Add Existing Tasks</Button>}
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.large}
                isOpen={lgShow}
                onDismiss={() => setLgShow(false)}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterMain}
            >
                {
                    AllTasks?.length > 0 ? <div className='Alltable'>
                        <GlobalCommanTable AllListId={props?.AllListId} showPagination={true} headerOptions={headerOptions} columns={column2} data={AllTasks} callBackData={callBackData} TaskUsers={AllTaskUser} showHeader={true} multiSelect={true} />
                    </div> : 'Loading ...'
                }
            </Panel>

>>>>>>> cd1fd6d953a8eaf4b7bc60ba9d93f34dde41dfff


        </>
    )
}
export default TagTaskToProjectPopup