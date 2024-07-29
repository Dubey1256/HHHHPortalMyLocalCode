import *as React from 'react'
import { useState, useEffect } from 'react';
import { Web } from 'sp-pnp-js';
import PageLoader from '../../../globalComponents/pageLoader';
import * as globalCommon from "../../../globalComponents/globalCommon";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import moment from 'moment';
let AllListId: any = {};
let allUser: any = []
const EmployeTasks = (props: any) => {
    const [data, setData] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [todayTasks, setTodayTasks] = useState([])
    const [weekTasks, setWeekTasks] = useState([]);
    const [loader, setLoader] = useState<any>(false);
    const childRef = React.useRef<any>();
    useEffect(() => {
        AllListId = {
            TaskUserListID: props.props.TaskUserListID,
            siteUrl: props?.props.context?._pageContext?.web?.absoluteUrl,
            SmartMetadataListID: props.props.SmartMetadataListID,
            context: props.props.context,
        }
        getUsers()
        EmployeeTasks()

    }, [])

    const getUsers = async () => {
        let web = new Web(AllListId.siteUrl);
        allUser = await web.lists.getById(props?.props?.TaskUserListID).items.select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver").get();
        setAllUsers(allUser)
    }
    const EmployeeTasks = async () => {
        let userUniqueID = props.props.context.pageContext?.legacyPageContext?.userId
        let AllTasks = await globalCommon.loadAllSiteTasks(AllListId)
        let userTasksInfo = AllTasks.filter((tasks: any) => {
            return tasks?.AssignedTo?.some((assignedtask: any) => assignedtask?.Id === userUniqueID);
        });
        userTasksInfo.map((task: any) => {
            task.userImage = ImageInformation(task.Author.Id)
                
            if (task?.userImage != null) {
                if (task.userImage.Image != null) {
                    task.createdImg = task.userImage.Image
                } else {
                    task.createdSuffix = task?.userImage.Suffix
                }
            }
        })

        FilterTasks("today",userTasksInfo)
        FilterTasks("Week",userTasksInfo)

        setData(userTasksInfo)
        setLoader(true);
    }


    const ImageInformation = (userID: any) => {
        const user = allUser.find(
            (user: any) => user?.AssingedToUser?.Id === userID
        );
        let authImg: any = { Image: "", Suffix: "" }
        if (user?.Item_x0020_Cover != undefined) {
            authImg.Image = user?.Item_x0020_Cover.Url;
        } else { authImg.Suffix = user?.Suffix }
        return user ? authImg : null;
    }

    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {

    }, []);

    const FilterTasks = (filterType: any,taskInformation:any) => {
        let currentDate: any = moment();
        if (filterType === "Week") {
            let weekDates: any = []
            let startWeekDay = currentDate.day()
            let conditionRun = 6 - startWeekDay;
            while (conditionRun > 0) {
                weekDates.push(currentDate.format('DD/MM/YYYY'))
                currentDate.add(1, 'day');
                conditionRun--;
            }
            const removeEmpty = taskInformation.filter((task: any) => { return task?.WorkingAction != undefined })
            const storeTask = removeEmpty.filter((task: any) =>
                JSON.parse(task.WorkingAction).some((workActions: any) =>
                    workActions.Title === "WorkingDetails" &&
                    workActions.InformationData.some((taskInfo: any) =>
                        weekDates.includes(taskInfo.WorkingDate)
                    )
                )
            );
            setWeekTasks(storeTask)
           
        }
        if (filterType === "today") {
            let todayFormat = currentDate?.format('DD/MM/YYYY')
            const removeEmpty = taskInformation.filter((task: any) => { return task?.WorkingAction != undefined })
            const storeTask = removeEmpty.filter((task: any) =>
                JSON.parse(task?.WorkingAction)?.some((workActions: any) =>
                    workActions.Title === "WorkingDetails" &&
                    workActions.InformationData.some((taskInfo: any) =>
                        taskInfo.WorkingDate == todayFormat
                    )
                )
            );
            setTodayTasks(storeTask)
        }
      

    }

    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 25,
                id: 'Id',
            },
            {
                accessorFn: (row) => row?.TaskID,
                cell: ({ row, getValue }) => (
                    <>
                        <img className='workmember me-1' src={`${row.original.SiteIcon}`}></img>
                        <ReactPopperTooltipSingleLevel CMSToolId={getValue()} row={row?.original} AllListId={AllListId} singleLevel={true} />
                    </>
                ),
                id: "TaskID",
                placeholder: "ID",
                header: "",
                resetColumnFilters: false,
                size: 90,
            },
            {
                accessorKey: "Title",
                cell: ({ row }) => (<>
                  <a  data-interception="off" target='_blank' href={`${AllListId.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.siteType}`}>
                    {row.original.Title}
                  </a>
                  {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} /></span>}
                  </>
                ),
                id: "Title",
                placeholder: "Title", header: "",
              },
            { accessorKey: "PortfolioTitle", placeholder: "Component", header: "", size: 140, },
            { accessorKey: "PercentComplete", placeholder: "%", header: "", size: 140, },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.DueDate == null ? (
                            ""
                        ) : (
                            <>
                                <span className='ms-1'>{row?.original?.DisplayDueDate} </span>

                            </>
                        )}
                    </span>
                ),
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "DueDate",
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 115
            },

            {
                accessorKey: "teamUserName", placeholder: "Team Member", header: "", size: 100, id: "teamUserName",
                cell: ({ row }) =>
                    <>
                        <ShowTaskTeamMembers props={row.original} TaskUsers={allUsers} />
                    </>
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                                {row?.original?.Author != undefined ? (
                                    <>
                                        <a
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >{row?.original?.createdImg != undefined ?
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} /> :
                                            <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                            }

                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 115
            },



        ],
        [data,weekTasks,todayTasks]);



    return (
        <>
            {/* <label >This Week</label>
            <input type="checkbox" checked={weekCheckbox} onChange={(e) => FilterTasks(e, "Week")} />
            <label >Today tasks</label>
            <input type="checkbox" checked={todayCheckBox} onChange={(e) => FilterTasks(e, "today")} />
            <GlobalCommanTable columns={columns} ref={childRef} data={data} showHeader={true} callBackData={callBackData} multiSelect={true} TaskUsers={allUsers} AllListId={AllListId} /> */}
            {!loader && <PageLoader />}
            <details open >
                <summary> Working Today Tasks    
                </summary>
                <div className='AccordionContent'>
                    {todayTasks.length>0 ?
                        <div className='Alltable border-0 dashboardTable'>
                            <>
                                <GlobalCommanTable  columns={columns} ref={childRef} data={todayTasks} showHeader={true} callBackData={callBackData} multiSelect={true} TaskUsers={allUsers} AllListId={AllListId} l wrapperHeight="100%" hideTeamIcon={true} />
                            </>
                        </div>
                        : <div className='text-center full-width'>
                            <span>No Working Today Tasks Available</span>
                        </div>}
                </div>
                </details>
                <details  >
                <summary> Working this Week Tasks    
                </summary>
                <div className='AccordionContent'>
                    {weekTasks.length>0 ?
                        <div className='Alltable border-0 dashboardTable'>
                            <>
                                <GlobalCommanTable  columns={columns} ref={childRef} data={weekTasks} showHeader={true} callBackData={callBackData} multiSelect={true} TaskUsers={allUsers} AllListId={AllListId} l wrapperHeight="100%" hideTeamIcon={true} />
                            </>
                        </div>
                        : <div className='text-center full-width'>
                            <span>No Working this Week Tasks Available</span>
                        </div>}
                </div>
            </details>
            <details  >
                <summary> Assigned To    
                </summary>
                <div className='AccordionContent'>
                    {data.length>0 ?
                        <div className='Alltable border-0 dashboardTable'>
                            <>
                                <GlobalCommanTable  columns={columns} ref={childRef} data={data} showHeader={true} callBackData={callBackData} multiSelect={true} TaskUsers={allUsers} AllListId={AllListId} l wrapperHeight="100%" hideTeamIcon={true} />
                            </>
                        </div>
                        : <div className='text-center full-width'>
                            <span>No Assigned Tasks Available</span>
                        </div>}
                </div>
            </details>
            </>

    )
}
export default EmployeTasks;