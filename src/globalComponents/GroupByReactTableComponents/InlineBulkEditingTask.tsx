import * as React from "react";
import { Panel, PanelType } from "office-ui-fabric-react";
import moment from "moment";
import ServiceComponentPortfolioPopup from "../EditTaskPopup/ServiceComponentPortfolioPopup";
import Picker from "../EditTaskPopup/SmartMetaDataPicker";
import Smartmetadatapickerin from "../Smartmetadatapickerindependent/SmartmetadatapickerSingleORMulti";

const InlineBulkEditingTask = (props: any) => {
    const [editDate, setEditDate]: any = React.useState(undefined);
    const [taskStatusInNumber, setTaskStatusInNumber] = React.useState('');
    const [taskPriority, setTaskPriority] = React.useState("");
    const [TaskPriorityPopup, setTaskPriorityPopup] = React.useState(false);
    const [TaskStatusPopup, setTaskStatusPopup] = React.useState(false);
    const [ProjectManagementPopup, setProjectManagementPopup] = React.useState(false);
    const [categoriesPopup, setCategoriesPopup] = React.useState(false);
    const [featureTypePopup, setFeatureTypePopup] = React.useState(false);
    const [selectedCategoryData, setSelectedCategoryData] = React.useState([]);
    const [selectedFeatureType, setSelectedFeatureType] = React.useState([]);
    // const [ProjectData, setProjectData] = React.useState([]);
    const [dueDate, setDueDate] = React.useState({
        editDate: props?.item?.DueDate != undefined ? props?.item?.DueDate : null,
        editPopup: false,
        selectDateName: ""
    });
    const duedatechange = (item: any) => {
        let dates = new Date();
        if (item === "Today") {
            setDueDate({ ...dueDate, editDate: dates, selectDateName: item });
            setEditDate(dates);
        }
        if (item === "Tommorow") {
            setEditDate(dates.setDate(dates.getDate() + 1));
            setDueDate({
                ...dueDate,
                editDate: dates.setDate(dates.getDate() + 1),
                selectDateName: item
            });
        }
        if (item === "This Week") {
            setEditDate(
                new Date(dates.setDate(dates.getDate() - dates.getDay() + 7))
            );
            setDueDate({
                ...dueDate,
                editDate: new Date(dates.setDate(dates.getDate() - dates.getDay() + 7)),
                selectDateName: item
            });
        }
        if (item === "Next Week") {
            let nextweek = new Date(
                dates.setDate(dates.getDate() - (dates.getDay() - 1) + 6)
            );
            setEditDate(
                nextweek.setDate(nextweek.getDate() - (nextweek.getDay() - 1) + 6)
            );
            setDueDate({
                ...dueDate,
                editDate: nextweek.setDate(
                    nextweek.getDate() - (nextweek.getDay() - 1) + 6
                ),
                selectDateName: item
            });
        }
        if (item === "This Month") {
            let lastDay = new Date(dates.getFullYear(), dates.getMonth() + 1, 0);
            setEditDate(lastDay);
            setDueDate({ ...dueDate, editDate: lastDay, selectDateName: item });
        }
    };
    const closeTaskDueDate = () => {
        setEditDate(undefined);
        setDueDate({ editPopup: false, editDate: undefined, selectDateName: "" });
    };
    const onRenderCustomHeader = (columnName: any) => {
        return (
            <div>
                <div className="subheading ">
                    {props?.item?.SiteIcon != null && <img className="imgWid29 pe-1 mt-1 " src={props?.item?.SiteIcon} />}
                    <span className="siteColor">
                        {`Update ${columnName} - ${props?.item?.TaskID != undefined ? props?.item?.TaskID : ''} ${props?.item?.Title}`}
                    </span>
                </div>
            </div>
        );
    };
    const updateTaskInlineEditing = (event: any, popupValue: any) => {
        let popupDataCopy = props?.popupData?.map((elem: any) => {
            if (props?.item?.Id === elem?.Id && props?.item?.siteType === elem?.siteType) {
                if (event === "updateDueDate") {
                    elem.updatedDisplayDueDate = editDate != null ? moment(editDate).format("DD/MM/YYYY") : "";
                    const inputDate = new Date(editDate);
                    elem.postDueDateValue = inputDate.toISOString();
                } else if (event === "precentComplete" && taskStatusInNumber && taskStatusInNumber !== "") {
                    const match = taskStatusInNumber?.match(/(\d+)%\s*(.+)/);
                    if (match) {
                        const TaskStatus = parseInt(match[1]);
                        elem.postStatusValue = TaskStatus / 100;
                        elem.updatedPercentComplete = TaskStatus;
                    }
                } else if (event === "Priority") {
                    let priorityRank = parseInt(taskPriority) || 4;
                    let priority;

                    if (priorityRank >= 8) {
                        priority = "(1) High";
                    } else if (priorityRank >= 4) {
                        priority = "(2) Normal";
                    } else {
                        priority = "(3) Low";
                    }
                    if (priority && priorityRank) {
                        elem.postPriorityRankValue = priorityRank;
                        elem.postPriorityValue = priority;
                        elem.updatedPriorityRank = priorityRank;
                    }
                } else if (popupValue?.length > 0 && event === 'Project') {
                    elem.postProjectValue = { ...popupValue[0] }
                    elem.updatedPortfolioStructureID = popupValue[0]?.PortfolioStructureID;
                } else if (popupValue?.length > 0 && event === 'categories') {
                    if (popupValue?.length > 0) {
                        elem.postTaskCategoriesId = []
                        popupValue?.map((elemValue: any) => {
                            const updatedTaskCatDatas = { Id: elemValue.Id, Title: elemValue.Title }
                            elem.updatedTaskCatData = []
                            elem.updatedTaskCatData.push(updatedTaskCatDatas);
                            elem.postTaskCategoriesId.push(elemValue.Id);
                        })
                        elem.updatedTaskTypeValue = popupValue?.map((val: any) => val.Title).join(",");
                    }
                } else if (popupValue?.length > 0 && event === 'FeatureType') {
                    elem.postFeatureType = { Id: popupValue[0]?.Id, Title: popupValue[0]?.Title }
                    elem.updatedFeatureTypeTitle = popupValue[0]?.Title;
                }
            }
            return elem;
        });
        if (event === "updateDueDate") {
            setDueDate({ ...dueDate, editPopup: false });
        } else if (event === "precentComplete") {
            setTaskStatusPopup(false);
        } else if (event === "Priority") {
            setTaskPriorityPopup(false);
        }
        props?.inlineEditingCallBack(popupDataCopy, event);
    }
    const closeTaskStatusUpdatePopup = () => {
        setTaskStatusPopup(false);
    };
    const openTaskStatusUpdatePopup = async () => {
        setTaskStatusPopup(true);
    };
    const PercentCompleted = (StatusData: any) => {
        setTaskStatusInNumber(StatusData?.Title);
    };
    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
        if (functionType == "Close") {
            setProjectManagementPopup(false)
            // setProjectData([]);
        } else {
            if (DataItem != undefined && DataItem?.length > 0) {
                // setProjectData(DataItem);
                updateTaskInlineEditing('Project', DataItem)
                setProjectManagementPopup(false)
            }
        }
    }, []);
    const smartCategoryPopup = React.useCallback(() => {
        setCategoriesPopup(false);
    }, []);
    const SelectCategoryCallBack = React.useCallback((selectCategoryDataCallBack: any) => {
        updateTaskInlineEditing('categories', selectCategoryDataCallBack)
        setSelectedCategoryData(selectCategoryDataCallBack);
        setCategoriesPopup(false);
    }, []);

    const Smartmetadatafeature = React.useCallback((data: any) => {
        if (data === "Close") {
            setFeatureTypePopup(false)
        } else {
            setFeatureTypePopup(false)
            updateTaskInlineEditing('FeatureType', data)
            setSelectedFeatureType(data)
        }
    }, [])
    return (
        <>
            <>
                {props?.columnName == "DueDate" ? (
                    <span style={{ display: "block", width: "100%", height: "100%" }} onClick={() => { setDueDate({ ...dueDate, editPopup: true }); setEditDate(props?.item?.DueDate != undefined ? props?.item?.DueDate : null); }}>
                        {props?.value != undefined ? props?.value : <>&nbsp;</>}
                    </span>
                ) : (
                    ""
                )}
                {props?.columnName == "PercentComplete" ? (
                    <>
                        <span style={{ display: "block", width: "100%", height: "100%" }} onClick={() => openTaskStatusUpdatePopup()} >
                            {props?.value != undefined ? props?.value : <>&nbsp;</>}
                        </span>

                    </>
                ) : (
                    ""
                )}

                {props?.columnName == "Priority" ? (
                    <>
                        <span style={{ display: "block", width: "100%", height: "100%", gap: "1px" }} onClick={() => setTaskPriorityPopup(true)}>
                            {props?.value != undefined ? props?.value : <>&nbsp;</>}
                        </span>

                    </>
                ) : (
                    ""
                )}

                {props?.columnName === "Project" &&
                    <div>
                        <span onClick={() => setProjectManagementPopup(true)} title="Project Items Popup" className="hreflink">{props?.value != undefined ? props?.value : <>&nbsp;</>}</span>
                    </div>
                }
                {ProjectManagementPopup && <ServiceComponentPortfolioPopup Dynamic={props?.ContextValue} ComponentType={"Component"} Call={ComponentServicePopupCallBack} selectionType={"Single"} showProject={ProjectManagementPopup} />}


                {props?.columnName === "categories" &&
                    <span onClick={() => setCategoriesPopup(true)} title={props?.value} className={props?.className ? props?.className + " hreflink" : "hreflink"}>{props?.value != undefined ? props?.value : <>&nbsp;</>}</span>
                }
                {categoriesPopup && <Picker selectedCategoryData={selectedCategoryData} usedFor="Task-Popup" AllListId={props?.ContextValue} CallBack={SelectCategoryCallBack} closePopupCallBack={smartCategoryPopup} />}

                {props?.columnName === "FeatureType" &&
                    <span onClick={() => setFeatureTypePopup(true)} title={props?.value} style={props?.style} className="hreflink">{props?.value != undefined ? props?.value : <>&nbsp;</>}</span>
                }
                {featureTypePopup && <Smartmetadatapickerin
                    Call={Smartmetadatafeature}
                    selectedFeaturedata={selectedFeatureType}
                    AllListId={props?.ContextValue}
                    TaxType='Feature Type'
                    usedFor="Single"
                ></Smartmetadatapickerin>}

            </>
            <Panel
                onRenderHeader={() => onRenderCustomHeader("Due Date")}
                isOpen={dueDate.editPopup}
                type={PanelType.custom}
                customWidth="600px"
                onDismiss={closeTaskDueDate}
                isBlocking={dueDate.editPopup}
            >
                <div>
                    <div className="modal-body mt-3 mb-3 d-flex flex-column">
                        <input className="form-check-input p-3 w-100" type="date" value={editDate != null ? moment(new Date(editDate)).format("YYYY-MM-DD") : ""} onChange={(e: any) => setEditDate(e.target.value)} />
                        <div className="d-flex flex-column mt-2 mb-2">
                            <span className="SpfxCheckRadio">
                                <input className="radio" type="radio" value="Today" name="dueDateRadio" checked={dueDate.selectDateName == "Today"} onClick={() => duedatechange("Today")} />{" "}Today
                            </span>
                            <span className="SpfxCheckRadio">
                                <input
                                    className="radio" type="radio" value="Tommorow" name="dueDateRadio" checked={dueDate.selectDateName == "Tommorow"} onClick={() => duedatechange("Tommorow")}
                                />{" "}
                                Tommorow
                            </span>
                            <span className="SpfxCheckRadio">
                                <input className="radio" type="radio" value="This Week" name="dueDateRadio" checked={dueDate.selectDateName == "This Week"} onClick={() => duedatechange("This Week")}
                                />{" "}
                                This Week
                            </span>
                            <span className="SpfxCheckRadio">
                                <input className="radio" type="radio" value="Next Week" name="dueDateRadio" checked={dueDate.selectDateName == "Next Week"} onClick={() => duedatechange("Next Week")} />{" "}
                                Next Week
                            </span>
                            <span className="SpfxCheckRadio">
                                <input className="radio" type="radio" value="This Month" name="dueDateRadio" checked={dueDate.selectDateName == "This Month"} onClick={() => duedatechange("This Month")} />{" "}
                                This Month
                            </span>
                        </div>
                    </div>
                    <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3" onClick={() => updateTaskInlineEditing('updateDueDate', '')}>Save</button>
                    </footer>
                </div>
            </Panel>

            <Panel
                onRenderHeader={() => onRenderCustomHeader("Status")}
                isOpen={TaskStatusPopup}
                customWidth="600px"
                onDismiss={closeTaskStatusUpdatePopup}
                isBlocking={TaskStatusPopup}
            >
                <div>
                    <div className="modal-body">
                        <div>
                            <ul className="list-none">
                                {props?.precentComplete?.map((item: any, index: any) => {
                                    return (
                                        <li key={index}>
                                            <div className="SpfxCheckRadio">
                                                <input
                                                    className="radio"
                                                    type="radio"
                                                    checked={taskStatusInNumber == item?.Title}
                                                    onClick={() => PercentCompleted(item)}
                                                />
                                                <label className="form-check-label">
                                                    {item?.Title}
                                                </label>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <footer className="float-end">
                        <button
                            type="button"
                            className="btn btn-primary px-3"
                            onClick={() => updateTaskInlineEditing('precentComplete', '')}
                        >
                            Save
                        </button>
                    </footer>
                </div>
            </Panel>
            <Panel
                onRenderHeader={() => onRenderCustomHeader("Priority")}
                isOpen={TaskPriorityPopup}
                customWidth="600px"
                onDismiss={() => setTaskPriorityPopup(false)}
                isBlocking={TaskPriorityPopup}
            >
                <div>
                    <div className="modal-body">
                        <div>
                            <ul className="list-none">
                                {props?.priorityRank?.map((item: any, index: any) => {
                                    return (
                                        <li key={index}>
                                            <div className="SpfxCheckRadio">
                                                <input
                                                    className="radio"
                                                    type="radio"
                                                    checked={taskPriority == item.Title}
                                                    onClick={() => setTaskPriority(item.Title)}
                                                />
                                                <label className="form-check-label mx-2">
                                                    {item?.Title}
                                                </label>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <footer className="float-end">
                        <button
                            type="button"
                            className="btn btn-primary px-3"
                            onClick={() => updateTaskInlineEditing('Priority', '')}
                        >
                            Save
                        </button>
                    </footer>
                </div>
            </Panel>
        </>
    )
}
export default InlineBulkEditingTask;