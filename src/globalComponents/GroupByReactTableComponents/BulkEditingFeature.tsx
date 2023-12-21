import moment from "moment";
import * as React from "react";
import pnp, { sp, Web } from "sp-pnp-js";
import ServiceComponentPortfolioPopup from "../EditTaskPopup/ServiceComponentPortfolioPopup";


export function DueDateTaskUpdate(taskValue: any) {
    const handleDrop = (destination: any, event: any) => {
        let date = new Date();
        let dueDate;
        if (event === "DueDate" && destination != undefined) {
            if (destination === "Today") {
                dueDate = date.toISOString();
            }
            if (destination === "Tomorrow") {
                dueDate = date.setDate(date.getDate() + 1);
                dueDate = date.toISOString();
            }
            if (destination === "ThisWeek") {
                date.setDate(date.getDate());
                var getdayitem = date.getDay();
                var dayscount = 7 - getdayitem
                date.setDate(date.getDate() + dayscount);
                dueDate = date.toISOString();
            }
            if (destination === "NextWeek") {

                date.setDate(date.getDate() + 7);
                var getdayitem = date.getDay();
                var dayscount = 7 - getdayitem
                date.setDate(date.getDate() + dayscount);
                dueDate = date.toISOString();
            }
            if (destination === "ThisMonth") {

                var year = date.getFullYear();
                var month = date.getMonth();
                var lastday = new Date(year, month + 1, 0);
                dueDate = lastday.toISOString();
            }

        }
        if (dueDate) {
            UpdateTaskStatus(taskValue, dueDate)
        }
    }
    //Update Task After Drop
    const UpdateTaskStatus = async (task: any, dueDate: any) => {
        let web = new Web(task?.taskValue?.siteUrl);
        await web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
            DueDate: dueDate,
        }).then((res: any) => {
            alert('Your DueDate being updated successfully!')
            console.log("Drop Updated", res);
        })

    }

    return (
        <>
            <div className='clearfix col px-1'>
                <div className="taskcatgoryPannel dueDateSec alignCenter justify-content-lg-between" >
                    <div className="align-items-center d-flex" style={{ width: "100px" }}>Due Date</div>
                    <div className="dueDateTile"><a className='subcategoryTask' onDrop={(e: any) => handleDrop('Today', 'DueDate')} onDragOver={(e: any) => e.preventDefault()}>Today&nbsp;{moment(new Date()).format('DD/MM/YYYY')}</a></div>
                    <div className="dueDateTile"><a className='subcategoryTask' onDrop={(e: any) => handleDrop('Tomorrow', 'DueDate')} onDragOver={(e: any) => e.preventDefault()} id="Tomorrow">Tomorrow</a></div>
                    <div className="dueDateTile"><a className='subcategoryTask' onDrop={(e: any) => handleDrop('ThisWeek', 'DueDate')} onDragOver={(e: any) => e.preventDefault()} id="ThisWeek">This Week</a></div>
                    <div className="dueDateTile"><a className='subcategoryTask' onDrop={(e: any) => handleDrop('NextWeek', 'DueDate')} onDragOver={(e: any) => e.preventDefault()} id="NextWeek">Next Week</a></div>
                    <div className="dueDateTile"><a className='subcategoryTask' onDrop={(e: any) => handleDrop('ThisMonth', 'DueDate')} onDragOver={(e: any) => e.preventDefault()} id="ThisMonth">This Month</a></div>
                </div>
            </div>
        </>
    )
}


export function PrecentCompleteUpdate(taskValue: any) {
    const handleDrop = (destination: any, event: any) => {
        if (event === 'precentComplete' && destination != undefined) {
            let TaskStatus;
            let TaskApproval;
            if (destination) {
                const match = destination?.match(/(\d+)%\s*(.+)/);
                if (match) {
                    TaskStatus = parseInt(match[1]) / 100;
                    TaskApproval = match[2].trim();
                }
                UpdateTaskStatus(taskValue, TaskStatus, TaskApproval)
            }
        }

    }
    //Update Task After Drop
    const UpdateTaskStatus = async (task: any, TaskStatus: any, TaskApproval: any) => {
        let web = new Web(task?.taskValue?.siteUrl);
        await web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
            PercentComplete: TaskStatus,

        }).then((res: any) => {
            alert('Your PrecentComplete being updated successfully!')
            console.log("Drop Updated", res);
        })

    }

    return (
        <>
            <div className='clearfix px-1 my-3'>
                <div className="percentSec  dueDateSec d-flex justify-content-lg-between">
                    <span style={{ width: "125px" }}>Percent Complete</span>
                    {taskValue?.precentComplete?.map((item: any) => {
                        return (
                            <div className="percentTile" onDrop={(e: any) => handleDrop(item?.Title, 'precentComplete')} onDragOver={(e: any) => e.preventDefault()}>
                                <a className='alignCenter justify-content-around subcategoryTask'>{item?.Title}</a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export function ProjectTaskUpdate(taskValue: any) {
    const [ProjectManagementPopup, setProjectManagementPopup] = React.useState(false);
    const [ProjectData, setProjectData] = React.useState([]);
    const handleDrop = (destination: any, event: any) => {
        if (event === 'procetSection' && destination.Id != undefined) {
            UpdateTaskStatus(taskValue, destination)
        }
    }
    const UpdateTaskStatus = async (task: any, project: any) => {
        let web = new Web(task?.taskValue?.siteUrl);
        await web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
            ProjectId: project?.Id,
        }).then((res: any) => {
            alert('Your Project being updated successfully!')
            console.log("Drop Updated", res);
        })

    }
    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
        if (functionType == "Close") {
            setProjectManagementPopup(false)
            setProjectData([])
        } else {
            if (DataItem != undefined && DataItem?.length > 0) {
                if (taskValue?.selectedData?.length > 0) {
                    let checkDuplicateProject = taskValue?.selectedData.filter((elem: any) => DataItem?.filter((elem1: any) => elem?.original?.Project?.Id != elem1.Id))
                    setProjectData(checkDuplicateProject);
                } else {
                    setProjectData(DataItem);
                }
                setProjectManagementPopup(false)
            }
        }
    }, []);


    return (
        <>
            <div className='clearfix px-1 my-3'>
                <div className="prioritySec d-flex alignCenter">
                    <span style={{ width: "125px" }} className="">Project</span>
                    {taskValue?.selectedData && !taskValue?.selectedData.every((item: any) => !item?.original?.Project) ? (
                        taskValue?.selectedData.map((item: any) => (
                            item?.original?.Project ? (
                                <div key={item?.Title} className="priorityTile" onDrop={(e: any) => handleDrop(item?.original?.Project, 'procetSection')} onDragOver={(e: any) => e.preventDefault()}>
                                    <a className='alignCenter justify-content-around subcategoryTask' title={item?.original?.Project?.Title}>{item?.original?.Project?.PortfolioStructureID}</a>
                                </div>
                            ) : null
                        ))
                    ) : (
                        <>{ProjectData?.length === 0 && <div className="mx-auto text-center">Please click setting to select project</div>}</>
                    )}
                    {ProjectData?.map((item: any) => {
                        return (
                            <div className="priorityTile" onDrop={(e: any) => handleDrop(item, 'procetSection')} onDragOver={(e: any) => e.preventDefault()}>
                                <a className='alignCenter justify-content-around subcategoryTask' title={item?.Title}>{item.PortfolioStructureID}</a>
                            </div>
                        )
                    })}
                    <span onClick={() => setProjectManagementPopup(true)} title="Project Items Popup" className="svg__iconbox svg__icon--setting hreflink"></span>
                </div>

            </div>
            {ProjectManagementPopup && <ServiceComponentPortfolioPopup Dynamic={taskValue?.ContextValue} ComponentType={"Component"} Call={ComponentServicePopupCallBack} selectionType={"Multi"} showProject={ProjectManagementPopup} />}
        </>
    )
}



const BulkEditingFeature = (props: any) => {
    const handleDrop = (destination: any, priority: any) => {
        console.log("dragedTaskdragedTask", props?.dragedTask)
        console.log("destinationdestinationdestination", destination)
        if (priority === 'priority') {
            let priority: any;
            let priorityRank = 4;
            if (parseInt(destination) <= 0 && destination != undefined && destination != null) {
                priorityRank = 4;
                priority = "(2) Normal";
            } else {
                priorityRank = parseInt(destination);
                if (priorityRank >= 8 && priorityRank <= 10) {
                    priority = "(1) High";
                }
                if (priorityRank >= 4 && priorityRank <= 7) {
                    priority = "(2) Normal";
                }
                if (priorityRank >= 1 && priorityRank <= 3) {
                    priority = "(3) Low";
                }
            }
            UpdateTaskStatus(props?.dragedTask, priority, priorityRank);
        }

    }
    //Update Task After Drop
    const UpdateTaskStatus = async (task: any, priority: any, priorityRank: any) => {
        let web = new Web(task?.task?.siteUrl);
        await web.lists.getById(task?.task?.listId).items.getById(task?.task?.Id).update({
            Priority: priority,
            PriorityRank: priorityRank,
        }).then((res: any) => {
            alert('Your priority being updated successfully!')
            console.log("Drop Updated", res);
        })

    }
    //ends
    return (
        <>
            {props?.bulkEditingCongration?.priority && <div className='clearfix col px-1 my-3'>
                <div className="prioritySec alignCenter justify-content-lg-between taskcatgoryPannel">
                    <span style={{ width: "100px" }}>Priority Rank</span>
                    {props?.priorityRank?.map((item: any) => {
                        return (
                            <div className="priorityTile" onDrop={(e: any) => handleDrop(item?.Title, 'priority')} onDragOver={(e: any) => e.preventDefault()}>
                                <a className='subcategoryTask'>{item?.Title}</a>
                            </div>
                        )
                    })}
                </div>
            </div>}

            {props?.bulkEditingCongration?.dueDate && <div>
                <DueDateTaskUpdate taskValue={props?.dragedTask?.task} />
            </div>}
            {props?.bulkEditingCongration?.status && <div>
                <PrecentCompleteUpdate taskValue={props?.dragedTask?.task} precentComplete={props?.precentComplete} />
            </div>}

            {props?.bulkEditingCongration?.Project && <div>
                <ProjectTaskUpdate taskValue={props?.dragedTask?.task} selectedData={props?.selectedData} ContextValue={props?.ContextValue} />
            </div>}


        </>
    )
}
export default BulkEditingFeature;