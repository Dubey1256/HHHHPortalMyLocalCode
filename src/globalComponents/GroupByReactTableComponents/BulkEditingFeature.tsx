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
            UpdateBulkTaskUpdate(taskValue, dueDate)
        }
    }
    //Update Task After Drop
    const UpdateBulkTaskUpdate = async (task: any, dueDate: any) => {
        // if (taskValue?.selectedData?.length > 0) {
        //     taskValue?.selectedData?.map(async (elem: any) => {
        //         let web = new Web(elem?.original?.siteUrl);
        //         await web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update({
        //             DueDate: dueDate,
        //         }).then((res: any) => {
        //             console.log("Drop Updated!", res);
        //         })
        //     })
        // } else {
        //     let web = new Web(task?.taskValue?.siteUrl);
        //     await web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
        //         DueDate: dueDate,
        //     }).then((res: any) => {
        //         console.log("Drop Updated!", res);
        //     })
        // }
        const updatePromises: Promise<any>[] = [];
        if (taskValue?.selectedData?.length > 0) {
            taskValue?.selectedData?.forEach((elem: any) => {
                const web = new Web(elem?.original?.siteUrl);
                const updatePromise = web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update({
                    DueDate: dueDate,
                });
                updatePromises.push(updatePromise);
            });
        } else {
            const web = new Web(task?.taskValue?.siteUrl);
            const updatePromise = web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
                DueDate: dueDate,
            });
            updatePromises.push(updatePromise);
        }
        try {
            const results = await Promise.all(updatePromises);
            console.log("All projects updated successfully!", results);
            let allData = JSON.parse(JSON.stringify(taskValue?.data))
            let checkBoolian: any = null;
            if (taskValue?.updatedSmartFilterFlatView != true && taskValue?.clickFlatView != true) {
                if (taskValue?.selectedData?.length > 0) {
                    taskValue?.selectedData?.forEach((value: any) => {
                        value.original.DueDate = dueDate;
                        value.original.DisplayDueDate = moment(value?.original?.DueDate).format("DD/MM/YYYY");
                        if (value?.original?.DisplayDueDate == "Invalid date" || "") {
                            value.original.DisplayDueDate = value?.original?.DisplayDueDate.replaceAll("Invalid date", "");
                        }
                        if (value?.original?.DueDate != null && value?.original?.DueDate != undefined) {
                            value.original.serverDueDate = new Date(value?.original?.DueDate).setHours(0, 0, 0, 0)
                        }
                        checkBoolian = addedCreatedDataFromAWT(allData, value?.original);
                    });
                } else {
                    task.taskValue.DueDate = dueDate;
                    task.taskValue.DisplayDueDate = moment(task.taskValue?.DueDate).format("DD/MM/YYYY");
                    if (task?.taskValue?.DisplayDueDate == "Invalid date" || "") {
                        task.taskValue.DisplayDueDate = task?.taskValue?.DisplayDueDate.replaceAll("Invalid date", "");
                    }
                    if (task?.taskValue?.DueDate != null && task?.taskValue?.DueDate != undefined) {
                        task.taskValue.serverDueDate = new Date(task?.taskValue?.DueDate).setHours(0, 0, 0, 0)
                    }
                    checkBoolian = addedCreatedDataFromAWT(allData, task?.taskValue);
                }
                if (checkBoolian) {
                    taskValue.setData(allData);
                }
            } else if (taskValue?.updatedSmartFilterFlatView === true || taskValue?.clickFlatView === true) {
                let updatedAllData: any = []
                if (taskValue?.selectedData?.length > 0) {
                    updatedAllData = taskValue?.data?.map((elem: any) => {
                        const match = taskValue?.selectedData?.find((match: any) => match?.original?.Id === elem?.Id && match?.original?.siteType === elem?.siteType);
                        if (match) {
                            match.original.DueDate = dueDate;
                            match.original.DisplayDueDate = moment(match?.original?.DueDate).format("DD/MM/YYYY");
                            if (match?.original?.DisplayDueDate == "Invalid date" || "") {
                                match.original.DisplayDueDate = match?.original?.DisplayDueDate.replaceAll("Invalid date", "");
                            }
                            if (match?.original?.DueDate != null && match?.original?.DueDate != undefined) {
                                match.original.serverDueDate = new Date(match?.original?.DueDate).setHours(0, 0, 0, 0)
                            }
                            return match?.original;
                        } return elem;
                    });
                } else {
                    updatedAllData = taskValue.data.map((elem: any) => {
                        if (task?.taskValue?.Id === elem?.Id && task?.taskValue?.siteType === elem?.siteType) {
                            task.taskValue.DueDate = dueDate;
                            task.taskValue.DisplayDueDate = moment(task.taskValue?.DueDate).format("DD/MM/YYYY");
                            if (task?.taskValue?.DisplayDueDate == "Invalid date" || "") {
                                task.taskValue.DisplayDueDate = task?.taskValue?.DisplayDueDate.replaceAll("Invalid date", "");
                            }
                            if (task?.taskValue?.DueDate != null && task?.taskValue?.DueDate != undefined) {
                                task.taskValue.serverDueDate = new Date(task?.taskValue?.DueDate).setHours(0, 0, 0, 0)
                            }
                            return task?.taskValue;
                        } return elem;
                    });
                }
                taskValue.setData((prev: any) => updatedAllData);
            }
        } catch (error) {
            console.error("Error updating projects:", error);
        }

    }
    const addedCreatedDataFromAWT = (itemData: any, dataToPush: any) => {
        for (let val of itemData) {
            if (dataToPush?.Portfolio?.Id === val.Id && dataToPush?.ParentTask?.Id === undefined) {
                const existingIndex = val.subRows?.findIndex((subRow: any) => subRow?.Id === dataToPush?.Id);
                if (existingIndex !== -1) {
                    val.subRows[existingIndex] = dataToPush;
                } else {
                    val.subRows = val.subRows || [];
                    val?.subRows?.push(dataToPush);
                }
            } else if (dataToPush?.ParentTask?.Id === val.Id && dataToPush?.siteType === val?.siteType) {
                const existingIndex = val.subRows?.findIndex((subRow: any) => subRow?.Id === dataToPush?.Id && dataToPush?.siteType === subRow?.siteType);
                if (existingIndex !== -1) {
                    val.subRows[existingIndex] = dataToPush;
                } else {
                    val.subRows = val.subRows || [];
                    val?.subRows?.push(dataToPush);
                }
                return true;
            } else if (val?.subRows) {
                if (addedCreatedDataFromAWT(val.subRows, dataToPush)) {
                    return true;
                }
            }
        }
        return false;
    };
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
                UpdateBulkTaskUpdate(taskValue, TaskStatus, TaskApproval)
            }
        }

    }
    //Update Task After Drop
    const UpdateBulkTaskUpdate = async (task: any, TaskStatus: any, TaskApproval: any) => {
        // if (taskValue?.selectedData?.length > 0) {
        //     taskValue?.selectedData?.map(async (elem: any) => {
        //         let web = new Web(elem?.original?.siteUrl);
        //         await web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update({
        //             PercentComplete: TaskStatus,
        //         }).then((res: any) => {
        //             console.log("Drop Updated!", res);
        //         })
        //     })
        // } else {
        //     let web = new Web(task?.taskValue?.siteUrl);
        //     await web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
        //         PercentComplete: TaskStatus,
        //     }).then((res: any) => {
        //         console.log("Drop Updated!", res);
        //     })
        // }
        const updatePromises: Promise<any>[] = [];
        if (taskValue?.selectedData?.length > 0) {
            taskValue?.selectedData?.forEach((elem: any) => {
                const web = new Web(elem?.original?.siteUrl);
                const updatePromise = web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update({
                    PercentComplete: TaskStatus,
                });
                updatePromises.push(updatePromise);
            });
        } else {
            const web = new Web(task?.taskValue?.siteUrl);
            const updatePromise = web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
                PercentComplete: TaskStatus,
            });
            updatePromises.push(updatePromise);
        }
        try {
            const results = await Promise.all(updatePromises);
            console.log("All projects updated successfully!", results);
            let allData = JSON.parse(JSON.stringify(taskValue?.data))
            let checkBoolian: any = null;
            if (taskValue?.updatedSmartFilterFlatView != true && taskValue?.clickFlatView != true) {
                if (taskValue?.selectedData?.length > 0) {
                    taskValue?.selectedData?.forEach((value: any) => {
                        value.original.PercentComplete = TaskStatus;
                        checkBoolian = addedCreatedDataFromAWT(allData, value?.original);
                    });
                } else {
                    task.taskValue.PercentComplete = TaskStatus;
                    checkBoolian = addedCreatedDataFromAWT(allData, task?.taskValue);
                }
                if (checkBoolian) {
                    taskValue.setData(allData);
                }
            } else if (taskValue?.updatedSmartFilterFlatView === true || taskValue?.clickFlatView === true) {
                let updatedAllData: any = []
                if (taskValue?.selectedData?.length > 0) {
                    updatedAllData = taskValue?.data?.map((elem: any) => {
                        const match = taskValue?.selectedData?.find((match: any) => match?.original?.Id === elem?.Id && match?.original?.siteType === elem?.siteType);
                        if (match) {
                            match.original.PercentComplete = TaskStatus;
                            return match?.original;
                        } return elem;
                    });
                } else {
                    updatedAllData = taskValue.data.map((elem: any) => {
                        if (task?.taskValue?.Id === elem?.Id && task?.taskValue?.siteType === elem?.siteType) {
                            task.taskValue.PercentComplete = TaskStatus;
                            return task?.taskValue;
                        } return elem;
                    });
                }
                taskValue.setData((prev: any) => updatedAllData);
            }
        } catch (error) {
            console.error("Error updating projects:", error);
        }
    }
    const addedCreatedDataFromAWT = (itemData: any, dataToPush: any) => {
        for (let val of itemData) {
            if (dataToPush?.Portfolio?.Id === val.Id && dataToPush?.ParentTask?.Id === undefined) {
                const existingIndex = val.subRows?.findIndex((subRow: any) => subRow?.Id === dataToPush?.Id);
                if (existingIndex !== -1) {
                    val.subRows[existingIndex] = dataToPush;
                } else {
                    val.subRows = val.subRows || [];
                    val?.subRows?.push(dataToPush);
                }
            } else if (dataToPush?.ParentTask?.Id === val.Id && dataToPush?.siteType === val?.siteType) {
                const existingIndex = val.subRows?.findIndex((subRow: any) => subRow?.Id === dataToPush?.Id && dataToPush?.siteType === subRow?.siteType);
                if (existingIndex !== -1) {
                    val.subRows[existingIndex] = dataToPush;
                } else {
                    val.subRows = val.subRows || [];
                    val?.subRows?.push(dataToPush);
                }
                return true;
            } else if (val?.subRows) {
                if (addedCreatedDataFromAWT(val.subRows, dataToPush)) {
                    return true;
                }
            }
        }
        return false;
    };


    return (
        <>
            <div className='clearfix px-1 my-3'>
                <div className="percentSec  dueDateSec d-flex justify-content-lg-between">
                    <span className="alignCenter" style={{ width: "110px" }}>Percent Complete</span>
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
            UpdateBulkTaskUpdate(taskValue, destination)
        }
    }
    // const UpdateBulkTaskUpdate = async (task: any, project: any) => {
    //     if (taskValue?.selectedData?.length > 0) {
    //         taskValue?.selectedData?.map(async (elem: any) => {
    //             let web = new Web(elem?.original?.siteUrl);
    //             await web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update({
    //                 ProjectId: project?.Id,
    //             }).then((res: any) => {
    //                 console.log("Your Project being updated successfully!", res);
    //             })
    //         })
    //     } else {
    //         let web = new Web(task?.taskValue?.siteUrl);
    //         await web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
    //             ProjectId: project?.Id,
    //         }).then((res: any) => {
    //             console.log("Your Project being updated successfully!", res);
    //         })
    //     }
    // }
    const UpdateBulkTaskUpdate = async (task: any, project: any) => {
        const updatePromises: Promise<any>[] = [];
        if (taskValue?.selectedData?.length > 0) {
            taskValue?.selectedData?.forEach((elem: any) => {
                const web = new Web(elem?.original?.siteUrl);
                const updatePromise = web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update({
                    ProjectId: project?.Id,
                });
                updatePromises.push(updatePromise);
            });
        } else {
            const web = new Web(task?.taskValue?.siteUrl);
            const updatePromise = web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
                ProjectId: project?.Id,
            });
            updatePromises.push(updatePromise);
        }

        try {
            const results = await Promise.all(updatePromises);
            console.log("All projects updated successfully!", results);
            let allData = JSON.parse(JSON.stringify(taskValue?.data))
            let checkBoolian: any = null;
            const makeProjectData = { Id: project?.Id, PortfolioStructureID: project?.PortfolioStructureID, PriorityRank: project?.PriorityRank, Title: project?.Title }
            if (taskValue?.updatedSmartFilterFlatView != true && taskValue?.clickFlatView != true) {
                if (taskValue?.selectedData?.length > 0) {
                    taskValue?.selectedData?.forEach((value: any) => {
                        value.original.Project = makeProjectData
                        value.original.projectStructerId = makeProjectData.PortfolioStructureID;
                        value.original.ProjectTitle = makeProjectData.Title
                        value.original.ProjectId = makeProjectData.Id
                        const title = makeProjectData?.Title || '';
                        const formattedDueDate = moment(value?.original?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                        value.original.joinedData = [];
                        if (value?.original?.projectStructerId && title || formattedDueDate) {
                            value.original.joinedData.push(`Project ${value.original?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                        }
                        checkBoolian = addedCreatedDataFromAWT(allData, value?.original);
                    });
                } else {
                    task.taskValue.Project = makeProjectData
                    task.taskValue.projectStructerId = makeProjectData.PortfolioStructureID;
                    task.taskValue.ProjectTitle = makeProjectData.Title
                    task.taskValue.ProjectId = makeProjectData.Id
                    const title = makeProjectData.Title || '';
                    const formattedDueDate = moment(task?.taskValue?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                    task.taskValue.joinedData = [];
                    if (task?.taskValue?.projectStructerId && title || formattedDueDate) {
                        task.taskValue.joinedData.push(`Project ${task?.taskValue?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                    }
                    checkBoolian = addedCreatedDataFromAWT(allData, task?.taskValue);
                }
                if (checkBoolian) {
                    taskValue.setData(allData);
                }
            } else if (taskValue?.updatedSmartFilterFlatView === true || taskValue?.clickFlatView === true) {
                let updatedAllData: any = []
                if (taskValue?.selectedData?.length > 0) {
                    updatedAllData = taskValue?.data?.map((elem: any) => {
                        const match = taskValue?.selectedData?.find((match: any) => match?.original?.Id === elem?.Id && match?.original?.siteType === elem?.siteType);
                        if (match) {
                            match.original.Project = makeProjectData;
                            match.original.projectStructerId = makeProjectData.PortfolioStructureID;
                            match.original.ProjectTitle = makeProjectData.Title
                            match.original.ProjectId = makeProjectData.Id
                            const title = makeProjectData?.Title || '';
                            const formattedDueDate = moment(match?.original?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                            match.original.joinedData = [];
                            if (match?.original?.projectStructerId && title || formattedDueDate) {
                                match.original.joinedData.push(`Project ${match.original?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                            }
                            return match?.original;
                        } return elem;
                    });
                } else {
                    updatedAllData = taskValue.data.map((elem: any) => {
                        if (task?.taskValue?.Id === elem?.Id && task?.taskValue?.siteType === elem?.siteType) {
                            task.taskValue.Project = makeProjectData
                            task.taskValue.projectStructerId = makeProjectData.PortfolioStructureID;
                            task.taskValue.ProjectTitle = makeProjectData.Title
                            task.taskValue.ProjectId = makeProjectData.Id
                            const title = makeProjectData.Title || '';
                            const formattedDueDate = moment(task?.taskValue?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                            task.taskValue.joinedData = [];
                            if (task?.taskValue?.projectStructerId && title || formattedDueDate) {
                                task.taskValue.joinedData.push(`Project ${task?.taskValue?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                            }
                            return task?.taskValue;
                        } return elem;
                    });
                }
                taskValue.setData((prev: any) => updatedAllData);
            }
        } catch (error) {
            console.error("Error updating projects:", error);
        }
    };
    const addedCreatedDataFromAWT = (itemData: any, dataToPush: any) => {
        for (let val of itemData) {
            if (dataToPush?.Portfolio?.Id === val.Id && dataToPush?.ParentTask?.Id === undefined) {
                const existingIndex = val.subRows?.findIndex((subRow: any) => subRow?.Id === dataToPush?.Id);
                if (existingIndex !== -1) {
                    val.subRows[existingIndex] = dataToPush;
                } else {
                    val.subRows = val.subRows || [];
                    val?.subRows?.push(dataToPush);
                }
            } else if (dataToPush?.ParentTask?.Id === val.Id && dataToPush?.siteType === val?.siteType) {
                const existingIndex = val.subRows?.findIndex((subRow: any) => subRow?.Id === dataToPush?.Id && dataToPush?.siteType === subRow?.siteType);
                if (existingIndex !== -1) {
                    val.subRows[existingIndex] = dataToPush;
                } else {
                    val.subRows = val.subRows || [];
                    val?.subRows?.push(dataToPush);
                }
                return true;
            } else if (val?.subRows) {
                if (addedCreatedDataFromAWT(val.subRows, dataToPush)) {
                    return true;
                }
            }
        }
        return false;
    };
    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
        if (functionType == "Close") {
            setProjectManagementPopup(false)
            setProjectData([])
        } else {
            if (DataItem != undefined && DataItem?.length > 0) {
                if (taskValue?.projectTiles?.length > 0) {
                    let checkDuplicateProject = taskValue?.projectTiles.filter((elem: any) => DataItem?.filter((elem1: any) => elem?.original?.Project?.Id != elem1.Id))
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
                    {taskValue?.projectTiles && !taskValue?.projectTiles?.every((item: any) => !item?.original?.Project) ? (
                        taskValue?.projectTiles.map((item: any) => (
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
            UpdateBulkTaskUpdate(props?.dragedTask, priority, priorityRank);
        }

    }
    //Update Task After Drop
    const UpdateBulkTaskUpdate = async (task: any, priority: any, priorityRank: any) => {
        if (props?.selectedData?.length > 0) {
            props?.selectedData?.map(async (elem: any) => {
                let web = new Web(elem?.original?.siteUrl);
                await web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update({
                    Priority: priority,
                    PriorityRank: priorityRank,
                }).then((res: any) => {
                    console.log("Drop Updated!", res);
                })
            })
        } else {
            let web = new Web(task?.task?.siteUrl);
            await web.lists.getById(task?.task?.listId).items.getById(task?.task?.Id).update({
                Priority: priority,
                PriorityRank: priorityRank,
            }).then((res: any) => {
                console.log("Drop Updated", res);
            })
        }

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
                <DueDateTaskUpdate taskValue={props?.dragedTask?.task} selectedData={props?.selectedData} data={props?.data} updatedSmartFilterFlatView={props?.updatedSmartFilterFlatView} clickFlatView={props?.clickFlatView} setData={props?.setData} ContextValue={props?.ContextValue} />
            </div>}
            {props?.bulkEditingCongration?.status && <div>
                <PrecentCompleteUpdate taskValue={props?.dragedTask?.task} precentComplete={props?.precentComplete} selectedData={props?.selectedData} data={props?.data} updatedSmartFilterFlatView={props?.updatedSmartFilterFlatView} clickFlatView={props?.clickFlatView} setData={props?.setData} ContextValue={props?.ContextValue} />
            </div>}

            {props?.bulkEditingCongration?.Project && <div>
                <ProjectTaskUpdate taskValue={props?.dragedTask?.task} data={props?.data} updatedSmartFilterFlatView={props?.updatedSmartFilterFlatView} clickFlatView={props?.clickFlatView} setData={props?.setData} selectedData={props?.selectedData} ContextValue={props?.ContextValue} projectTiles={props?.projectTiles} />
            </div>}


        </>
    )
}
export default BulkEditingFeature;