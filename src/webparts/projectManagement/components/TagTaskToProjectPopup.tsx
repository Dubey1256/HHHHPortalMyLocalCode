
import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
//import '../components/TagTaskToProjectPopup.css';
import Button from 'react-bootstrap/Button';
import { Panel, PanelType } from "office-ui-fabric-react";
import { useEffect, useState } from 'react';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
import * as globalCommon from "../../../globalComponents/globalCommon"
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import InlineEditingcolumns from '../../../globalComponents/inlineEditingcolumns';
import { ColumnDef } from '@tanstack/react-table';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import PageLoader from '../../../globalComponents/pageLoader';
import Tooltip from '../../../globalComponents/Tooltip';
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
    const [pageLoaderActive, setPageLoader] = React.useState(false)

    const TaskUser = async () => {
        let web = new Web(props?.AllListId?.siteUrl);
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
        let web = new Web(props?.AllListId?.siteUrl);
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

   

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {
        let MultiSelectedData: any = [];
        if (elem?.length > 0) {
            elem.map((item: any) => MultiSelectedData?.push(item?.original))
        }
        setSelectedTasks(MultiSelectedData)
    }, []);
    const LoadAllSiteTasks = async () => {

      try {
        var AllTask: any = []
        setPageLoader(true)
        AllTask = await globalCommon?.loadAllSiteTasks(props?.AllListId)
        AllTask.map((items: any) => {
            items.TitleNew = items.Title;
            items.AllTeamMember = [];
            items.HierarchyData = [];
            items.descriptionsSearch = '';
            items.bodys = items.Body != null && items.Body.split('<p><br></p>').join('');
            if (items?.Body != undefined && items?.Body != null) {
                items.descriptionsSearch = items?.Body.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '');
            }
            items.commentsSearch = items?.Comments != null && items?.Comments != undefined ? items.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';

           
            items.DisplayDueDate =
                items.DueDate != null
                    ? moment(items.DueDate).format("DD/MM/YYYY")
                    : "";
            items.DisplayCreateDate =
                items.Created != null
                    ? moment(items.Created).format("DD/MM/YYYY")
                    : "";

            items.portfolio = {};
            if (items?.TaskCategories?.length > 0) {
                items.TaskTypeValue = items?.TaskCategories?.map((val: any) => val.Title).join(",")
                items.Categories = items.TaskTypeValue;
            } else {
                items.TaskTypeValue = '';
                items.Categories = '';
            }
            if (items?.Portfolio?.Id != undefined) {
                items.portfolio = items?.Portfolio;
                items.PortfolioTitle = items?.Portfolio?.Title;
                // items["Portfoliotype"] = "Component";
            }

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

            items.TaskID = globalCommon.GetTaskId(items);
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
        });
        setAllTasks(sortOnCreated(AllTask))
        setPageLoader(false)
      } catch (error) {
        setPageLoader(false)
      }

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
    
        try {
            setPageLoader(true)
            if (props?.meetingPages) {
                // let confirmation = confirm('Are you sure you want to tagTask')
                // if(confirmation){
                props.callBack(selectedTasks);
                handleClose()
                // }
    
            } else {
                let tasksWithTaggedProjects: any = [];
                let tasksWithNoProjects: any = [];
                selectedTasks?.map(async (item: any, index: any) => {
                    if (index == 0) {
                        selectedTaskId = selectedTaskId + '(' + item?.siteType + ') ' + item?.TaskID
                    } else {
                        selectedTaskId = selectedTaskId + ',' + '(' + item?.siteType + ') ' + item?.TaskID
                    }
                    if (item?.Project?.Id != undefined) {
                        tasksWithTaggedProjects.push(item)
                    } else {
                        tasksWithNoProjects.push(item)
                    }
                })
    
                let confirmation = confirm('Are you sure you want to tag ' + selectedTaskId + ' to this project ?')
                if (confirmation == true) {
                    if (tasksWithTaggedProjects?.length > 0) {
                        let projectTagedTasks: any = ''
                        tasksWithTaggedProjects?.map(async (item: any, index: any) => {
                            if (index == 0) {
                                projectTagedTasks = projectTagedTasks + '(' + item?.siteType + ') ' + item?.TaskID
                            } else {
                                projectTagedTasks = projectTagedTasks + ',' + '(' + item?.siteType + ') ' + item?.TaskID
                            }
                        })
                        let taggedProjectConfirmation = confirm('These Tasks ' + projectTagedTasks + ' are already tagged to some other Projects, Do you want to over ride there project ?')
                        if (taggedProjectConfirmation) {
                            updateSelectedTask(selectedTasks);
                        } else {
                            updateSelectedTask(tasksWithNoProjects)
                        }
                    } else {
                        updateSelectedTask(selectedTasks)
                    }
                    handleClose()
                }
    
            }
    
            setPageLoader(false)
        } catch (error) {
            setPageLoader(false)
        }
    }

    const updateSelectedTask = (selectedTasksArray: any) => {
        selectedTasksArray?.map(async (item: any, index: any) => {
            const web = new Web(item?.siteUrl);
            await web.lists.getById(item?.listId).items.getById(item?.Id).update({
                ProjectId: props?.projectId != undefined ? props?.projectId : ''
            }).then((e: any) => {
                if (index == selectedTasksArray?.length - 1) {
                    props.callBack();
                }
            })
                .catch((err: { message: any; }) => {
                    console.log(err.message);
                });
        })
    }

    const handleClose = () => {
        setPageLoader(false)
        setLgShow(false);
    }

const onRenderCustomHeaderMain = (type: any) => {
        return (
            <>
                <div className='subheading'>
                        {`Add Existing Tasks - ${props?.projectItem?.MeetingId ? props?.projectItem?.MeetingId : props?.projectItem?.PortfolioStructureID} ${props?.projectTitle}`}
                </div>
                <Tooltip ComponentId="8902" />
            </>
        )
    }
    const onRenderCustomFooterMain = () => {
        return (


            <footer className='text-end p-2'>
                <button className="btn btn-primary mx-2"
                    onClick={() => { tagSelectedTasks() }}>
                    Tag Tasks
                </button>
                <button type="button" className="btn btn-default me-4" onClick={handleClose}>
                    Cancel
                </button>


                {/* <Button type="button" className="me-2" variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button type="button" variant="primary" disabled={selectedTasks?.length > 0 ? false : true} onClick={() => tagSelectedTasks()}>Tag</Button> */}
            </footer>


        )
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
            // {
            //     accessorKey: "TaskID",
            //     placeholder: "Task Id",
            //     header: "",
            //     resetColumnFilters: false,
            //     resetSorting: false,
            //     size: 130,
            //     cell: ({ row, getValue }) => (
            //         <>
            //             <span className="d-flex">
            //                 {row?.original?.TaskID}
            //             </span>
            //         </>
            //     ),
            // },
            {
                accessorKey: "TaskID",
                placeholder: "Task Id",
                id: 'TaskID',
                size: 130,
                cell: ({ row, getValue }) => (
                    <div>
                        {/* {row?.original?.TitleNew != "Tasks" ?
                            <ReactPopperTooltip CMSToolId={getValue()} row={row} AllListId={props?.AllListId} />
                            : ''} */}
                        {row?.original?.TitleNew != "Tasks" ?
                            <ReactPopperTooltipSingleLevel AllListId={props?.AllListId} CMSToolId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={props?.masterTaskData} AllSitesTaskData={AllTasks} />
                            : ''}
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <>
                        <span>
                            <a className="hreflink"
                                href={`${props?.AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>
                            {row?.original?.FeedBack !== null && row?.original?.FeedBack != undefined ? <span className='alignIcon'> <InfoIconsToolTip Discription={row?.original?.FeedBack} row={row?.original} /> </span> : ''}
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
                accessorFn: (row) => row?.siteType,
                cell: ({ row }) => (
                    <span>
                        <img className='circularImage rounded-circle' src={row?.original?.SiteIcon} />
                    </span>
                ),
                id: "siteType",
                placeholder: "Site",
                header: "",
                resetSorting: false,
                resetColumnFilters: false,
                size: 50
            },
            {
                accessorFn: (row) => row?.PortfolioTitle,
                cell: ({ row }) => (
                    <span>
                        <a className="hreflink"
                            data-interception="off"
                            target="blank"
                            href={`${props?.AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
                        >
                            {row?.original?.portfolio?.Title}
                        </a>
                    </span>
                ),
                id: "PortfolioTitle",
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
                id: 'PriorityRank',
                header: "",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if(( row?.original?.PriorityRank?.toString().charAt(0) == filterValue.toString().charAt(0) )
                    &&(row?.original?.PriorityRank.toString())?.includes(filterValue)){
                        return true
                    }else{
                        return false
                    }
                   
                },
                resetColumnFilters: false,
                resetSorting: false,
                size: 75
            },
            {
                accessorFn: (row) => row?.TaskTypeValue,
                cell: ({ row }) => (
                    <>
                        <span>
                            <InlineEditingcolumns
                                AllListId={AllListId}
                                callBack={inlineCallBack}
                                columnName='TaskCategories'
                                item={row?.original}
                                TaskUsers={AllUser}
                                pageName={'ProjectManagment'}
                            />
                        </span>
                    </>
                ),
                placeholder: "Task Type",
                header: "",
                resetColumnFilters: false,
                size: 120,
                id: "TaskTypeValue",
            },

            {
                accessorFn: (row) => row?.DisplayDueDate,
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
                id: 'DisplayDueDate',
                resetColumnFilters: false,
                resetSorting: false,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.DisplayDueDate?.includes(filterValue)) {
                      return true
                    } else {
                      return false
                    }
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
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PercentComplete == filterValue
                },
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
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                      return true
                    } else {
                      return false
                    }
                },  
                header: "",
                size: 125
            }
        ],
        [AllTasks]
    );

    return (
        <>

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
                  <GlobalCommanTable AllListId={props?.AllListId} showPagination={true} headerOptions={headerOptions} columns={column2} data={AllTasks} callBackData={callBackData} TaskUsers={AllTaskUser} showHeader={true} multiSelect={true} />
                {pageLoaderActive ? <PageLoader /> : ''}
            </Panel>



        </>
    )
}
export default TagTaskToProjectPopup
