import moment from "moment";
import * as React from "react";
import pnp, { sp, Web } from "sp-pnp-js";
import ServiceComponentPortfolioPopup from "../EditTaskPopup/ServiceComponentPortfolioPopup";
import SelectedTaskUpdateOnPopup from "./selectedTaskUpdateOnPopup";
import Picker from "../EditTaskPopup/SmartMetaDataPicker";


export const addedCreatedDataFromAWT = (itemData: any, dataToPush: any) => {
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


export function CategoriesUpdate(taskValue: any) {
    const [categoriesPopup, setCategoriesPopup] = React.useState(false);
    const [selectedCategoryData, setSelectedCategoryData] = React.useState([]);
    const handleDrop = (item: any, event: any) => {
        if (event === 'categories' && taskValue?.activeCategory?.length > 0) {
            let postCatItem: any = []
            taskValue?.activeCategory.map((elem: any) => {
                postCatItem.push(elem.Id);
            })
            UpdateBulkTaskUpdate(taskValue, postCatItem, '');
        } else if (item && event === 'categories') {
            let postCatItem: any = []
            postCatItem.push(item.Id);
            UpdateBulkTaskUpdate(taskValue, postCatItem, item);
        }
    }
    const UpdateBulkTaskUpdate = async (task: any, postCatItem: any, item: any) => {
        const updatePromises: Promise<any>[] = [];
        if (taskValue?.selectedData?.length > 0) {
            taskValue?.selectedData?.forEach((elem: any) => {
                const web = new Web(elem?.original?.siteUrl);
                const updatePromise = web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update({
                    TaskCategoriesId: { results: postCatItem }
                });
                updatePromises.push(updatePromise);
            });
        } else {
            const web = new Web(task?.taskValue?.siteUrl);
            const updatePromise = web.lists.getById(task?.taskValue?.listId).items.getById(task?.taskValue?.Id).update({
                TaskCategoriesId: { results: postCatItem }
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
                        if (taskValue?.activeCategory?.length > 0) {
                            value.original.TaskCategories = taskValue?.activeCategory;
                        } else {
                            value.original.TaskCategories = [];
                            value.original.TaskCategories.push({ Id: item.Id, Title: item.Title });
                        }
                        if (value?.original?.TaskCategories?.length > 0) {
                            value.original.TaskTypeValue = value?.original?.TaskCategories?.map((val: any) => val.Title).join(",")
                        }
                        checkBoolian = addedCreatedDataFromAWT(allData, value?.original);
                    });
                } else {
                    if (taskValue?.activeCategory?.length > 0) {
                        task.taskValue.TaskCategories = taskValue?.activeCategory;
                    } else {
                        task.taskValue.TaskCategories = [];
                        task.taskValue.TaskCategories.push({ Id: item.Id, Title: item.Title });
                    }
                    if (task?.taskValue?.TaskCategories?.length > 0) {
                        task.taskValue.TaskTypeValue = task?.taskValue?.TaskCategories?.map((val: any) => val.Title).join(",")
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
                            if (taskValue?.activeCategory?.length > 0) {
                                match.original.TaskCategories = taskValue?.activeCategory;
                            } else {
                                match.original.TaskCategories = [];
                                match.original.TaskCategories.push({ Id: item.Id, Title: item.Title });
                            }
                            if (match?.original?.TaskCategories?.length > 0) {
                                match.original.TaskTypeValue = match?.original?.TaskCategories?.map((val: any) => val.Title).join(",")
                            }
                            return match?.original;
                        } return elem;
                    });
                } else {
                    updatedAllData = taskValue.data.map((elem: any) => {
                        if (task?.taskValue?.Id === elem?.Id && task?.taskValue?.siteType === elem?.siteType) {
                            if (taskValue?.activeCategory?.length > 0) {
                                task.taskValue.TaskCategories = taskValue?.activeCategory;
                            } else {
                                task.taskValue.TaskCategories = [];
                                task.taskValue.TaskCategories.push({ Id: item.Id, Title: item.Title })
                            }
                            if (task?.taskValue?.TaskCategories?.length > 0) {
                                task.taskValue.TaskTypeValue = task?.taskValue?.TaskCategories?.map((val: any) => val.Title).join(",")
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

    const smartCategoryPopup = React.useCallback(() => {
        setCategoriesPopup(false);
    }, []);
    const SelectCategoryCallBack = React.useCallback((selectCategoryDataCallBack: any) => {
        setSelectedCategoryData(selectCategoryDataCallBack);
        setCategoriesPopup(false);
    }, []);

    return (
        <>
            <div className='clearfix px-1 my-3'>
                <div className="prioritySec d-flex alignCenter">
                    <span style={{ width: "125px" }} className="">Categories</span>
                    {taskValue?.categoriesTiles?.length > 0 ? (
                        taskValue?.categoriesTiles?.map((cat: any) => {
                            return (
                                <div style={taskValue?.activeCategory?.some((elem: any) => elem.Id === cat?.Id) ? { border: '1px solid #000066' } : {}} className='priorityTile' onClick={() => taskValue?.selectSubTaskCategory(cat?.Id, cat.Title)} key={cat.Id} onDrop={(e: any) => handleDrop(cat, 'categories')} onDragOver={(e: any) => e.preventDefault()}>
                                    <a className={taskValue?.activeCategory?.some((elem: any) => elem.Id === cat?.Id) ? "alignCenter isActives justify-content-around subcategoryTask border-0" : "alignCenter justify-content-around subcategoryTask border-0"} title={cat?.Title}>{cat?.Title}</a>
                                </div>
                            )
                        })
                    ) : (
                        <>{selectedCategoryData?.length === 0 && <div className="mx-auto text-center">Please click setting to select categories</div>}</>
                    )}
                    {selectedCategoryData?.map((item: any) => {
                        return (
                            <div style={taskValue?.activeCategory?.some((elem: any) => elem.Id === item?.Id) ? { border: '1px solid #000066' } : {}} className='priorityTile' onClick={() => taskValue?.selectSubTaskCategory(item?.Id, item.Title)} key={item.Id} onDrop={(e: any) => handleDrop(item, 'categories')} onDragOver={(e: any) => e.preventDefault()}>
                                <a className={taskValue?.activeCategory?.some((elem: any) => elem.Id === item?.Id) ? "alignCenter isActives justify-content-around subcategoryTask border-0" : "alignCenter justify-content-around subcategoryTask border-0"} title={item?.Title}>{item.Title}</a>
                            </div>
                        )
                    })}
                    <span onClick={() => setCategoriesPopup(true)} title="Categories Items Popup" className="svg__iconbox svg__icon--setting hreflink"></span>
                </div>
            </div>
            {categoriesPopup && <Picker selectedCategoryData={selectedCategoryData} usedFor="Task-Popup" AllListId={taskValue?.ContextValue} CallBack={SelectCategoryCallBack} closePopupCallBack={smartCategoryPopup} />}
        </>
    )
}
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
                    <div style={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'Today' ? { border: '1px solid #000066' } : {}} className="dueDateTile" ><a className={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'Today' ? 'subcategoryTask isActives border-0' : 'subcategoryTask border-0'} onClick={() => taskValue?.setActiveTile('Today', "DueDate")} onDrop={(e: any) => handleDrop('Today', 'DueDate')} onDragOver={(e: any) => e.preventDefault()}>Today&nbsp;{moment(new Date()).format('DD/MM/YYYY')}</a></div>
                    <div style={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'Tomorrow' ? { border: '1px solid #000066' } : {}} className="dueDateTile" ><a className={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'Tomorrow' ? 'subcategoryTask isActives border-0' : 'subcategoryTask border-0'} onClick={() => taskValue?.setActiveTile('Tomorrow', "DueDate")} onDrop={(e: any) => handleDrop('Tomorrow', 'DueDate')} onDragOver={(e: any) => e.preventDefault()} id="Tomorrow">Tomorrow</a></div>
                    <div style={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'ThisWeek' ? { border: '1px solid #000066' } : {}} className="dueDateTile" ><a className={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'ThisWeek' ? 'subcategoryTask isActives border-0' : 'subcategoryTask border-0'} onClick={() => taskValue?.setActiveTile('ThisWeek', "DueDate")} onDrop={(e: any) => handleDrop('ThisWeek', 'DueDate')} onDragOver={(e: any) => e.preventDefault()} id="ThisWeek">This Week</a></div>
                    <div style={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'NextWeek' ? { border: '1px solid #000066' } : {}} className="dueDateTile" ><a className={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'NextWeek' ? 'subcategoryTask isActives border-0' : 'subcategoryTask border-0'} onClick={() => taskValue?.setActiveTile('NextWeek', "DueDate")} onDrop={(e: any) => handleDrop('NextWeek', 'DueDate')} onDragOver={(e: any) => e.preventDefault()} id="NextWeek">Next Week</a></div>
                    <div style={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'ThisMonth' ? { border: '1px solid #000066' } : {}} className="dueDateTile" ><a className={taskValue?.isActive?.DueDate && taskValue?.save?.DueDate === 'ThisMonth' ? 'subcategoryTask isActives border-0' : 'subcategoryTask border-0'} onClick={() => taskValue?.setActiveTile('ThisMonth', "DueDate")} onDrop={(e: any) => handleDrop('ThisMonth', 'DueDate')} onDragOver={(e: any) => e.preventDefault()} id="ThisMonth">This Month</a></div>
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
                            <div style={taskValue?.isActive?.PercentComplete && taskValue?.save?.PercentComplete === item?.Title ? { border: '1px solid #000066' } : {}} className='percentTile' onClick={() => taskValue?.setActiveTile(item?.Title, 'PercentComplete')} onDrop={(e: any) => handleDrop(item?.Title, 'precentComplete')} onDragOver={(e: any) => e.preventDefault()}>
                                <a className={taskValue?.isActive?.PercentComplete && taskValue?.save?.PercentComplete === item?.Title ? 'alignCenter justify-content-around subcategoryTask isActives border-0' : 'alignCenter justify-content-around subcategoryTask border-0'}>{item?.Title}</a>
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
                                <div style={taskValue?.isActive?.Project && taskValue?.save?.Project?.Title === item?.original?.Project?.Title ? { border: '1px solid #000066' } : {}} key={item?.Title} className='priorityTile' onClick={() => taskValue?.setActiveTile(item?.original?.Project, 'Project')} onDrop={(e: any) => handleDrop(item?.original?.Project, 'procetSection')} onDragOver={(e: any) => e.preventDefault()}>
                                    <a className={taskValue?.isActive?.Project && taskValue?.save?.Project?.Title === item?.original?.Project?.Title ? 'alignCenter justify-content-around subcategoryTask isActives border-0' : 'alignCenter justify-content-around subcategoryTask border-0'} title={item?.original?.Project?.Title}>{item?.original?.Project?.PortfolioStructureID}</a>
                                </div>
                            ) : null
                        ))
                    ) : (
                        <>{ProjectData?.length === 0 && <div className="mx-auto text-center">Please click setting to select project</div>}</>
                    )}
                    {ProjectData?.map((item: any) => {
                        return (
                            <div style={taskValue?.isActive?.Project && taskValue?.save?.Project?.Title === item?.Title ? { border: '1px solid #000066' } : {}} className='priorityTile' onClick={() => taskValue?.setActiveTile(item, 'Project')} onDrop={(e: any) => handleDrop(item, 'procetSection')} onDragOver={(e: any) => e.preventDefault()}>
                                <a className={taskValue?.isActive?.Project && taskValue?.save?.Project?.Title === item?.Title ? 'alignCenter justify-content-around subcategoryTask isActives border-0' : 'alignCenter justify-content-around subcategoryTask border-0'} title={item?.Title}>{item.PortfolioStructureID}</a>
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
    const [isActive, setIsActive] = React.useState({ priority: false, DueDate: false, PercentComplete: false, Project: false, });
    const [save, setSave] = React.useState<any>({ priority: undefined, DueDate: '', PercentComplete: undefined, Project: {} })
    const [activeCategory, setActiveCategory] = React.useState([]);
    const [bulkEditingSettingPopup, setBulkEditingSettingPopup] = React.useState(false);

    const selectSubTaskCategory = (Id: any, Title: any) => {
        let catId: any = [...activeCategory];
        const index = catId.findIndex((item: any) => item.Id === Id);

        if (index === -1) {
            catId = [...catId, { Id: Id, Title: Title }];
        } else {
            catId = catId.filter((item: any) => item.Id !== Id);
        }
        setActiveCategory(catId);
    };


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
    const bulkEditingSetting = React.useCallback((eventSetting: any) => {
        if (eventSetting != 'close') {
            const isActiveDataBackup = { priority: false, DueDate: false, PercentComplete: false, Project: false, }
            const saveBackup: any = { priority: undefined, DueDate: '', PercentComplete: undefined, Project: {} }
            setActiveCategory([]);
            setSave(saveBackup);
            setIsActive(isActiveDataBackup)
            setBulkEditingSettingPopup(false);
        } else {
            setBulkEditingSettingPopup(false);
        }
    }, []);
    const bulkEditingSettingPopupEvent = () => {
        if (props?.selectedData.length > 0 && (isActive.priority != true && isActive.DueDate != true && isActive.PercentComplete != true && isActive.Project != true)) {
            alert("No Tiles are selected")
        } else if (props?.selectedData.length <= 0 && (isActive.priority === true || isActive.DueDate === true || isActive.PercentComplete === true || isActive.Project === true)) {
            alert("No items are selected")
        } else if (props?.selectedData.length <= 0 && (isActive.priority != true && isActive.DueDate != true && isActive.PercentComplete != true && isActive.Project != true)) {
            alert("No items are selected")
        } else if (props?.selectedData.length > 0 && (isActive.priority === true || isActive.DueDate === true || isActive.PercentComplete === true || isActive.Project === true)) {
            setBulkEditingSettingPopup(true);
        }
    }

    const setActiveTile = (item: any, title: any) => {
        if (title === 'priority') {
            setIsActive({ ...isActive, priority: !isActive.priority });
            setSave((prevSave: any) => ({
                ...prevSave,
                priority: !isActive.priority ? item : undefined,
            }));
        } else if (title === 'DueDate') {
            setIsActive({ ...isActive, DueDate: !isActive.DueDate });
            setSave((prevSave: any) => ({
                ...prevSave,
                DueDate: !isActive.DueDate ? item : '',
            }));
        } else if (title === 'PercentComplete') {
            setIsActive({ ...isActive, PercentComplete: !isActive.PercentComplete });
            setSave((prevSave: any) => ({
                ...prevSave,
                PercentComplete: !isActive.PercentComplete ? item : undefined,
            }));
        } else if (title === 'Project') {
            setIsActive({ ...isActive, Project: !isActive.Project });
            setSave((prevSave: any) => ({
                ...prevSave,
                Project: !isActive.Project ? item : {},
            }));
        }
    };

    return (
        <>
            {props?.bulkEditingCongration?.priority && <div className='clearfix col px-1 my-3'>
                <div className="prioritySec alignCenter justify-content-lg-between taskcatgoryPannel">
                    <span style={{ width: "100px" }}>Priority Rank</span>
                    {props?.priorityRank?.map((item: any) => {
                        return (
                            <div style={isActive.priority && save.priority === item.Title ? { border: '1px solid #000066' } : {}} onDrop={(e: any) => handleDrop(item?.Title, 'priority')} className='priorityTile' onClick={() => setActiveTile(item.Title, "priority")} onDragOver={(e: any) => e.preventDefault()}>
                                <a className={isActive.priority && save.priority === item.Title ? 'subcategoryTask isActives border-0' : 'subcategoryTask border-0'}>{item?.Title}</a>
                            </div>
                        )
                    })}
                </div>
            </div>}

            {props?.bulkEditingCongration?.dueDate && <div>
                <DueDateTaskUpdate taskValue={props?.dragedTask?.task} setActiveTile={setActiveTile} save={save} isActive={isActive} selectedData={props?.selectedData} data={props?.data} updatedSmartFilterFlatView={props?.updatedSmartFilterFlatView} clickFlatView={props?.clickFlatView} setData={props?.setData} ContextValue={props?.ContextValue} />
            </div>}
            {props?.bulkEditingCongration?.status && <div>
                <PrecentCompleteUpdate taskValue={props?.dragedTask?.task} setActiveTile={setActiveTile} save={save} isActive={isActive} precentComplete={props?.precentComplete} selectedData={props?.selectedData} data={props?.data} updatedSmartFilterFlatView={props?.updatedSmartFilterFlatView} clickFlatView={props?.clickFlatView} setData={props?.setData} ContextValue={props?.ContextValue} />
            </div>}

            {props?.bulkEditingCongration?.Project && <div>
                <ProjectTaskUpdate taskValue={props?.dragedTask?.task} data={props?.data} save={save} setActiveTile={setActiveTile} isActive={isActive} updatedSmartFilterFlatView={props?.updatedSmartFilterFlatView} clickFlatView={props?.clickFlatView} setData={props?.setData} selectedData={props?.selectedData} ContextValue={props?.ContextValue} projectTiles={props?.projectTiles} />
            </div>}
            {props?.bulkEditingCongration?.categories && <div>
                <CategoriesUpdate activeCategory={activeCategory} selectSubTaskCategory={selectSubTaskCategory} taskValue={props?.dragedTask?.task} data={props?.data} save={save} setActiveTile={setActiveTile} isActive={isActive} updatedSmartFilterFlatView={props?.updatedSmartFilterFlatView} clickFlatView={props?.clickFlatView} setData={props?.setData} selectedData={props?.selectedData} ContextValue={props?.ContextValue} categoriesTiles={props?.categoriesTiles} />
            </div>}
            {bulkEditingSettingPopup && <SelectedTaskUpdateOnPopup activeCategory={activeCategory} precentComplete={props?.precentComplete} priorityRank={props?.priorityRank} AllTaskUser={props?.AllTaskUser} save={save} selectedData={props?.selectedData} isOpen={bulkEditingSettingPopup} bulkEditingSetting={bulkEditingSetting} columns={props?.columns} data={props?.data} setData={props?.setData} updatedSmartFilterFlatView={props?.updatedSmartFilterFlatView} clickFlatView={props?.clickFlatView} ContextValue={props?.ContextValue} masterTaskData={props?.masterTaskData} />}
            {/* {(props?.bulkEditingCongration?.priority || props?.bulkEditingCongration?.dueDate || props?.bulkEditingCongration?.status || props?.bulkEditingCongration?.Project) && <div onClick={(e) => bulkEditingSettingPopupEvent()}><span className="svg__iconbox svg__icon--edit"></span></div>} */}
            <div className='d-flex justify-content-end mx-2 mb-2'>{(props?.bulkEditingCongration?.priority || props?.bulkEditingCongration?.dueDate || props?.bulkEditingCongration?.status || props?.bulkEditingCongration?.Project) && <button onClick={(e) => bulkEditingSettingPopupEvent()} className='btn btn-primary'>Bulk Update</button>}</div>
        </>
    )
}
export default BulkEditingFeature;