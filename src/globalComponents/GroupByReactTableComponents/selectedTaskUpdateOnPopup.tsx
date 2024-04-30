import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import GlobalCommanTable from "./GlobalCommanTable";
import { Web } from "sp-pnp-js";
import moment from "moment";
import HighlightableCell from "./highlight";
import { ColumnDef } from "@tanstack/react-table";
import ReactPopperTooltipSingleLevel from "../Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import ReactPopperTooltip from "../Hierarchy-Popper-tooltip";
import InfoIconsToolTip from "../InfoIconsToolTip/InfoIconsToolTip";
import { FaCompressArrowsAlt } from "react-icons/fa";
import * as globalCommon from "../globalCommon";
import PageLoader from "../pageLoader";
import InlineBulkEditingTask from "./InlineBulkEditingTask";
import * as GlobalFunctionForUpdateItem from '../GlobalFunctionForUpdateItems';
import Tooltip from "../Tooltip";
let childRefdata: any;
const SelectedTaskUpdateOnPopup = (item: any) => {
    const childRef: any = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };
    }
    const [loaded, setLoaded] = React.useState(true);
    const [popupData, setPopupData] = React.useState([])
    const [defultSelectedRows, setDefultSelectedRows] = React.useState([])
    const handleChangeDateAndDataCallBack = async () => {
        if (childRef?.current?.table?.getSelectedRowModel()?.flatRows?.length > 0) {
            setLoaded(false);
            const slectedPopupData = childRef?.current?.table?.getSelectedRowModel()?.flatRows
            const updatePromises: Promise<any>[] = [];
            if (slectedPopupData?.length > 0) {
                for (const elem of slectedPopupData || []) {
                    const web = new Web(elem?.original?.siteUrl);
                    const updateData: { [key: string]: any } = {};
                    const updateMasterTaskData: { [key: string]: any } = {};
                    const updateStatusAndCat: { [key: string]: any } = {};
                    if (elem?.original?.siteType != "Master Tasks") {
                        if (elem?.original?.postPriorityRankValue !== undefined && elem?.original?.postPriorityValue !== undefined) {
                            updateData.PriorityRank = elem?.original?.postPriorityRankValue;
                            updateData.Priority = elem?.original?.postPriorityValue;
                        }
                        if (elem?.original?.postDueDateValue !== undefined) {
                            updateData.DueDate = elem?.original?.postDueDateValue ? moment(elem?.original?.postDueDateValue).format("MM-DD-YYYY") : null
                        }
                        if (elem?.original?.postProjectValue !== undefined) {
                            updateData.ProjectId = elem?.original?.postProjectValue?.Id;
                        }
                        if (elem?.original?.postTaskCategoriesId !== undefined) {
                            updateStatusAndCat.TaskCategoriesId = { results: elem?.original?.postTaskCategoriesId }
                        }
                        if (elem?.original?.postStatusValue !== undefined) {
                            updateStatusAndCat.PercentComplete = elem?.original?.postStatusValue;
                        }
                    } else {
                        if (elem?.original?.postFeatureType !== undefined) {
                            updateMasterTaskData.FeatureTypeId = elem?.original?.postFeatureType?.Id;
                        }
                    }
                    let updatePromise: any = [];
                    if (Object.keys(updateMasterTaskData)?.length > 0 && elem?.original?.siteType === "Master Tasks") {
                        updatePromise = web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update(updateMasterTaskData);
                        updatePromises.push(updatePromise);
                    } else if (Object.keys(updateData)?.length > 0) {
                        let RequiredData: any = {
                            ItemDetails: elem?.original,
                            RequiredListIds: item?.ContextValue,
                            UpdatedData: { PercentComplete: elem?.original?.postStatusValue * 100, TaskCategories: elem?.original?.updatedTaskCatData },
                            Context: item?.ContextValue?.Context,
                        }
                        let UpdatedDataItem: any;
                        await GlobalFunctionForUpdateItem.BulkUpdateTaskInfo(RequiredData).then((resolve: any) => {
                            UpdatedDataItem = resolve;
                            console.log("Res my data", resolve);
                            const updatePromise = web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update(updateData);
                            updatePromises.push(updatePromise);
                            return updatePromise;
                        }).catch((error: any) => {
                            console.error("Error in BulkUpdateTaskInfo:", error);
                        });
                        // updatePromise = web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update(updateData);
                        // updatePromises.push(updatePromise);
                    }
                };
            }
            try {
                const results = await Promise.all(updatePromises);
                console.log("All projects updated successfully!", results);
                let allData: any = []
                try {
                    allData = globalCommon.deepCopy(item?.data);
                } catch (error) {
                    console.log(error)
                }
                let checkBoolian: any = null;
                if (item?.updatedSmartFilterFlatView != true && item?.clickFlatView != true) {
                    if (slectedPopupData?.length > 0) {
                        slectedPopupData?.forEach((value: any) => {
                            if (value?.original?.siteType != "Master Tasks") {
                                if (value?.original?.postPriorityValue) {
                                    value.original.Priority = value?.original?.postPriorityValue;
                                }
                                if (value?.original?.postPriorityRankValue) {
                                    value.original.PriorityRank = value?.original?.postPriorityRankValue;
                                }
                                if (value?.original?.postDueDateValue) {
                                    value.original.DueDate = value?.original?.postDueDateValue;
                                }
                                if (value?.original?.postStatusValue) {
                                    value.original.PercentComplete = (value?.original?.postStatusValue * 100).toFixed(0);
                                }
                                if (value?.original?.postTaskCategoriesId != undefined) {
                                    value.original.TaskCategories = value?.original?.updatedTaskCatData;
                                    value.original.TaskTypeValue = value?.original?.TaskCategories?.map((val: any) => val.Title).join(",");
                                }
                                if (value.original?.postProjectValue && value?.original?.postProjectValue?.Title != "Untagged project") {
                                    const makeProjectData = { Id: value.original?.postProjectValue?.Id, PortfolioStructureID: value.original?.postProjectValue?.PortfolioStructureID, PriorityRank: value.original?.postProjectValue?.PriorityRank, Title: value.original?.postProjectValue?.Title }
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
                                } else {
                                    value.original.Project = {}
                                    value.original.projectStructerId = "";
                                    value.original.ProjectTitle = ""
                                    value.original.ProjectId = ""
                                    value.original.joinedData = [];
                                }
                                value.original.DisplayDueDate = moment(value?.original?.DueDate).format("DD/MM/YYYY");
                                if (value?.original?.DisplayDueDate == "Invalid date" || "") {
                                    value.original.DisplayDueDate = value?.original?.DisplayDueDate.replaceAll("Invalid date", "");
                                }
                                if (value?.original?.DueDate != null && value?.original?.DueDate != undefined) {
                                    value.original.serverDueDate = new Date(value?.original?.DueDate).setHours(0, 0, 0, 0)
                                }
                                checkBoolian = addedCreatedDataFromAWT(allData, value?.original);
                            } else {
                                if (value?.original?.postFeatureType != undefined) {
                                    value.original.FeatureTypeTitle = "";
                                    value.original.FeatureType = {}
                                    value.original.FeatureType = value?.original?.postFeatureType;
                                    value.original.FeatureTypeTitle = value?.original?.postFeatureType?.Title;
                                }
                                checkBoolian = updatedDataDataFromPortfolios(allData, value?.original);
                            }
                        });
                    }
                    item?.setData(allData);
                    setLoaded(true);
                    item?.bulkEditingSetting();
                } else if (item?.updatedSmartFilterFlatView === true || item?.clickFlatView === true) {
                    let updatedAllData: any = []
                    if (slectedPopupData?.length > 0) {
                        updatedAllData = item?.data?.map((elem: any) => {
                            const value = slectedPopupData?.find((match: any) => match?.original?.Id === elem?.Id && match?.original?.siteType === elem?.siteType);
                            if (value) {
                                if (value?.original?.siteType != "Master Tasks") {
                                    if (value?.original?.postPriorityValue) {
                                        value.original.Priority = value?.original?.postPriorityValue;
                                    }
                                    if (value?.original?.postPriorityRankValue) {
                                        value.original.PriorityRank = value?.original?.postPriorityRankValue;
                                    }
                                    if (value?.original?.postDueDateValue) {
                                        value.original.DueDate = value?.original?.postDueDateValue;
                                    }
                                    if (value?.original?.postStatusValue) {
                                        value.original.PercentComplete = (value?.original?.postStatusValue * 100).toFixed(0);
                                    }
                                    if (value?.original?.postTaskCategoriesId != undefined) {
                                        value.original.TaskCategories = value?.original?.updatedTaskCatData;
                                        value.original.TaskTypeValue = value?.original?.TaskCategories?.map((val: any) => val.Title).join(",");
                                    }
                                    if (value.original?.postProjectValue && value.original?.postProjectValue?.Title != "Untagged project") {
                                        const makeProjectData = { Id: value.original?.postProjectValue?.Id, PortfolioStructureID: value.original?.postProjectValue?.PortfolioStructureID, PriorityRank: value.original?.postProjectValue?.PriorityRank, Title: value.original?.postProjectValue?.Title }
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
                                    } else {
                                        value.original.Project = {}
                                        value.original.projectStructerId = "";
                                        value.original.ProjectTitle = ""
                                        value.original.ProjectId = ""
                                        value.original.joinedData = [];
                                    }
                                    value.original.DisplayDueDate = moment(value?.original?.DueDate).format("DD/MM/YYYY");
                                    if (value?.original?.DisplayDueDate == "Invalid date" || "") {
                                        value.original.DisplayDueDate = value?.original?.DisplayDueDate.replaceAll("Invalid date", "");
                                    }
                                    if (value?.original?.DueDate != null && value?.original?.DueDate != undefined) {
                                        value.original.serverDueDate = new Date(value?.original?.DueDate).setHours(0, 0, 0, 0)
                                    }
                                } else {
                                    if (value?.original?.postFeatureType != undefined) {
                                        value.original.FeatureTypeTitle = "";
                                        value.original.FeatureType = {}
                                        value.original.FeatureType = value?.original?.postFeatureType;
                                        value.original.FeatureTypeTitle = value?.original?.postFeatureType?.Title;
                                    }
                                }
                                const curentElement = { ...value?.original }
                                let dataToPush = { ...curentElement }
                                delete dataToPush?.updatedDisplayDueDate,
                                    delete dataToPush?.postDueDateValue,
                                    delete dataToPush?.postStatusValue,
                                    delete dataToPush?.updatedPercentComplete,
                                    delete dataToPush?.postPriorityRankValue,
                                    delete dataToPush?.postPriorityValue,
                                    delete dataToPush?.updatedPriorityRank,
                                    delete dataToPush?.updatedPortfolioStructureID,
                                    delete dataToPush?.postProjectValue,
                                    delete dataToPush?.postTaskCategoriesId,
                                    delete dataToPush?.updatedTaskTypeValue,
                                    delete dataToPush?.updatedTaskCatData,
                                    delete dataToPush?.postFeatureType,
                                    delete dataToPush?.updatedFeatureTypeTitle
                                return dataToPush;
                            } return elem;
                        });
                    }
                    item?.setData((prev: any) => updatedAllData);
                    setLoaded(true);
                    item?.bulkEditingSetting();
                }
            } catch (error) {
                console.error("Error updating projects:", error);
            }
        } else {
            alert('Please select any items');
        }
    };
    const addedCreatedDataFromAWT = (itemData: any, taskObj: any) => {
        let dataToPush = { ...taskObj }
        delete dataToPush.updatedDisplayDueDate,
            delete dataToPush.postDueDateValue,
            delete dataToPush.postStatusValue,
            delete dataToPush.updatedPercentComplete,
            delete dataToPush.postPriorityRankValue,
            delete dataToPush.postPriorityValue,
            delete dataToPush.updatedPriorityRank,
            delete dataToPush.updatedPortfolioStructureID,
            delete dataToPush.postProjectValue,
            delete dataToPush.postTaskCategoriesId,
            delete dataToPush.updatedTaskTypeValue,
            delete dataToPush.updatedTaskCatData,
            delete dataToPush?.postFeatureType,
            delete dataToPush?.updatedFeatureTypeTitle
        for (let val of itemData) {
            if (dataToPush?.Portfolio?.Id === val.Id && (val?.ParentTask?.Id === 0 || val?.ParentTask?.Id === undefined) && (val.Title != 'Others')) {
                const existingIndex = val.subRows?.findIndex((subRow: any) => subRow?.Id === dataToPush?.Id && (dataToPush?.siteType === subRow?.siteType));
                if (existingIndex !== -1 && existingIndex != undefined) {
                    val.subRows[existingIndex] = dataToPush;
                    return true;
                }
            } else if (dataToPush?.ParentTask?.Id === val.Id && dataToPush?.siteType === val?.siteType && (val.Title != 'Others')) {
                const existingIndex = val.subRows?.findIndex((subRow: any) => subRow?.Id === dataToPush?.Id && dataToPush?.siteType === subRow?.siteType);
                if (existingIndex !== -1 && existingIndex != undefined) {
                    val.subRows[existingIndex] = dataToPush;
                    return true;
                }
            } else if (val?.Title === 'Others') {
                const existingIndex = val.subRows?.findIndex((subRow: any) => subRow?.Id === dataToPush?.Id && (dataToPush?.siteType === subRow?.siteType));
                if (existingIndex !== -1 && existingIndex != undefined) {
                    val.subRows[existingIndex] = dataToPush;
                    return true;
                }
            } else if (val?.subRows) {
                if (addedCreatedDataFromAWT(val.subRows, dataToPush)) {
                    return true;
                }
            }
        }
        return false;
    };
    const updatedDataDataFromPortfolios = (copyDtaArray: any, dataToUpdate: any) => {
        let dataToPush = { ...dataToUpdate }
        delete dataToPush?.postFeatureType,
            delete dataToPush?.updatedFeatureTypeTitle
        for (let i = 0; i < copyDtaArray.length; i++) {
            if ((dataToPush?.Portfolio?.Id === copyDtaArray[i]?.Portfolio?.Id && dataToPush?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToPush?.siteType) || (dataToPush?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToPush?.siteType)) {
                copyDtaArray[i] = { ...copyDtaArray[i], ...dataToPush };
                return true;
            } else if (copyDtaArray[i].subRows) {
                if (updatedDataDataFromPortfolios(copyDtaArray[i].subRows, dataToPush)) {
                    return true;
                }
            }
        }
        return false;
    };

    const handleClosePopup = () => {
        item?.bulkEditingSetting('close');
    };

    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading">
                    <span className="siteColor">Bulk Editing for Multiple Items</span>
                </div>
                <Tooltip ComponentId={6797} />
            </>
        );
    };

    const makePostDataMake = (value: any, useFor: any) => {
        const filteredValues: Record<string, any> = {};
        const isEmptyObject = (obj: Record<string, any>): boolean => {
            return Object.keys(obj)?.length === 0 && obj?.constructor === Object;
        }
        for (const key in item?.save) {
            if (Object.prototype?.hasOwnProperty?.call(item?.save, key)) {
                const value = item?.save[key];
                if (value !== undefined && value !== '' && !isEmptyObject(value)) {
                    filteredValues[key] = value;
                }
            }
        }
        if (useFor != "Master Tasks") {
            if (filteredValues) {
                if (filteredValues?.priority) {
                    let priority: any;
                    let priorityRank = 4;
                    if (parseInt(filteredValues?.priority) <= 0 && filteredValues?.priority != undefined && filteredValues?.priority != null) {
                        priorityRank = 4;
                        priority = "(2) Normal";
                    } else {
                        priorityRank = parseInt(filteredValues?.priority);
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
                    if (priority && priorityRank) {
                        value.original.updatedPriorityRank = priorityRank
                        value.original.postPriorityRankValue = priorityRank;
                        value.original.postPriorityValue = priority;
                    }
                }
            }
            if (filteredValues?.DueDate && filteredValues?.DueDate != undefined) {
                let date = new Date();
                let dueDate: string | number;
                if (filteredValues?.DueDate === "Today") {
                    dueDate = date.toISOString();
                }
                if (filteredValues?.DueDate === "Tomorrow") {
                    dueDate = date.setDate(date.getDate() + 1);
                    dueDate = date.toISOString();
                }
                if (filteredValues?.DueDate === "ThisWeek") {
                    date.setDate(date.getDate());
                    var getdayitem = date.getDay();
                    var dayscount = 7 - getdayitem
                    date.setDate(date.getDate() + dayscount);
                    dueDate = date.toISOString();
                }
                if (filteredValues?.DueDate === "NextWeek") {
                    date.setDate(date.getDate() + 7);
                    var getdayitem = date.getDay();
                    var dayscount = 7 - getdayitem
                    date.setDate(date.getDate() + dayscount);
                    dueDate = date.toISOString();
                }
                if (filteredValues?.DueDate === "ThisMonth") {
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var lastday = new Date(year, month + 1, 0);
                    dueDate = lastday.toISOString();
                }
                if (dueDate) {
                    value.original.updatedDisplayDueDate = moment(dueDate).format("DD/MM/YYYY")
                    value.original.postDueDateValue = dueDate;
                }
            }
            if (filteredValues?.PercentComplete && filteredValues?.PercentComplete != undefined) {
                let TaskStatus;
                if (filteredValues?.PercentComplete) {
                    const match = filteredValues?.PercentComplete?.match(/(\d+)%\s*(.+)/);
                    if (match) {
                        TaskStatus = parseInt(match[1]) / 100;
                        value.original.postStatusValue = TaskStatus;
                        value.original.updatedPercentComplete = parseInt(match[1]);
                    }
                }
            }
            if (filteredValues?.Project && filteredValues?.Project != undefined && filteredValues?.Project?.Title != "Untagged project") {
                value.original.postProjectValue = filteredValues?.Project
                value.original.updatedPortfolioStructureID = filteredValues?.Project?.PortfolioStructureID
            } else {
                value.original.postProjectValue = filteredValues?.Project
                value.original.updatedPortfolioStructureID = filteredValues?.Project?.Title ? "" : ""
            }
            if (item?.activeCategory?.length > 0) {
                value.original.updatedTaskCatData = [];
                value.original.postTaskCategoriesId = []
                item?.activeCategory.map((elem: any) => {
                    value.original.postTaskCategoriesId.push(elem.Id);
                    value.original.updatedTaskCatData.push(elem);
                })
                value.original.updatedTaskTypeValue = item?.activeCategory?.map((val: any) => val.Title).join(",");
            }
        } else {
            if (filteredValues?.FeatureType && filteredValues?.FeatureType != undefined) {
                value.original.postFeatureType = { Id: filteredValues?.FeatureType?.Id, Title: filteredValues?.FeatureType?.Title };
                value.original.updatedFeatureTypeTitle = filteredValues?.FeatureType?.Title;
            }
        }

    }

    React.useEffect(() => {
        if (item?.selectedData?.length > 0) {
            let selectedDataPropsCopy: any = []
            try {
                selectedDataPropsCopy = globalCommon.deepCopy(item?.selectedData);
            } catch (error) {
                console.log(error)
            }
            let selecteDataValue: any = []
            selectedDataPropsCopy?.map((elem: any) => {
                if (elem.original?.subRows?.length > 0) {
                    if (elem?.original?.siteType === "Master Tasks") {
                        makePostDataMake(elem, "Master Tasks");
                        selecteDataValue.push(elem.original);
                    } else {
                        makePostDataMake(elem, '');
                        selecteDataValue.push(elem.original);
                    }
                } else {
                    if (elem?.original?.siteType === "Master Tasks") {
                        makePostDataMake(elem, 'Master Tasks');
                        selecteDataValue.push(elem.original);
                    } else {
                        makePostDataMake(elem, '');
                        selecteDataValue.push(elem.original);
                    }

                }
            });
            setDefultSelectedRows(selectedDataPropsCopy);
            setPopupData(selecteDataValue);
        }
    }, [item?.selectedData?.length > 0])
    const callBackData = React.useCallback((checkData: any) => {
    }, []);
    const inlineEditingCallBack = React.useCallback((updatedData: any) => {
        setPopupData(updatedData);
    }, []);
    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 55,
                id: 'Id',
            },
            {
                accessorFn: (row) => row?.portfolioItemsSearch,
                cell: ({ row, getValue }) => (
                    <div className="alignCenter">
                        {row?.original?.SiteIcon != undefined ? (
                            <div className="alignCenter" title="Show All Child">
                                <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
                                    row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember me-1"
                                }
                                    src={row?.original?.SiteIcon}>
                                </img>
                            </div>
                        ) : (
                            <>
                                {row?.original?.Title != "Others" ? (
                                    <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                                        row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                                    }>
                                        {row?.original?.SiteIconTitle}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </>
                        )}
                    </div>
                ),
                id: "portfolioItemsSearch",
                placeholder: "Type",
                header: "",
                resetColumnFilters: false,
                size: 95,
            },
            {
                accessorFn: (row) => row?.TaskID,
                cell: ({ row, getValue }) => (
                    <>
                        <ReactPopperTooltipSingleLevel CMSToolId={getValue()} row={row?.original} AllListId={item?.ContextValue} singleLevel={true} masterTaskData={item?.masterTaskData} AllSitesTaskData={popupData} />
                    </>
                ),
                id: "TaskID",
                placeholder: "ID",
                header: "",
                resetColumnFilters: false,
                isColumnDefultSortingAsc: true,
                size: 110,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <div className="alignCenter">
                        <span className="columnFixedTitle">
                            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                    href={item?.ContextValue?.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
                                    <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                                </a>
                            )}
                            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                    href={item?.ContextValue?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType} >
                                    <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                                </a>
                            )}
                            {row?.original.Title === "Others" ? (
                                <span className="text-content" title={row?.original?.Title} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>{row?.original?.Title}</span>
                            ) : (
                                ""
                            )}
                        </span>
                        {row?.original?.Categories == 'Draft' ?
                            <FaCompressArrowsAlt style={{ height: '11px', width: '20px', color: `${row?.original?.PortfolioType?.Color}` }} /> : ''}
                        {row?.original?.subRows?.length > 0 ?
                            <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
                        {row?.original?.descriptionsSearch != null && row?.original?.descriptionsSearch != '' && (
                            <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />
                        )}
                    </div>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 500,
            },
            {
                accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,
                cell: ({ row, column, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != (null || undefined) ?
                            <div className="d-flex"><span style={{ width: '44%' }}><a style={row?.original?.updatedPortfolioStructureID ? { color: "#5b5b5be0" } : row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${item?.ContextValue?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.ProjectId}`} >
                                <ReactPopperTooltip CMSToolId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={item?.ContextValue} /></a></span> <span className="px-1" style={{ width: '10%', textAlign: 'center' }}>{row?.original?.updatedPortfolioStructureID ? " | " : ''}</span> <span style={{ fontWeight: 600, textAlign: 'right', width: '44%' }}>
                                    <InlineBulkEditingTask columnName="Project" item={row?.original} ContextValue={item?.ContextValue} popupData={popupData} setPopupData={setPopupData} value={row?.original?.updatedPortfolioStructureID} inlineEditingCallBack={inlineEditingCallBack} />
                                </span></div>
                            : <div className="d-flex"><span style={{ width: '44%' }}>&nbsp;</span><span className="px-1" style={{ width: '10%', textAlign: 'center' }}>{row?.original?.updatedPortfolioStructureID ? " | " : ''}</span><span style={{ fontWeight: 600, textAlign: 'right', width: '44%' }}>

                                <InlineBulkEditingTask columnName="Project" item={row?.original} ContextValue={item?.ContextValue} popupData={popupData} setPopupData={setPopupData} value={row?.original?.updatedPortfolioStructureID} inlineEditingCallBack={inlineEditingCallBack} />
                            </span></div>}
                    </>
                ),
                id: 'ProjectTitle',
                placeholder: "Project",
                resetColumnFilters: false,
                header: "",
                size: 110,
            },
            {
                accessorFn: (row) => row?.TaskTypeValue,
                cell: ({ row, column, getValue }) => (
                    <>
                        {row?.original?.TaskTypeValue != (null || "") ? <div className="d-flex">
                            <span className="columnFixedTaskCate" style={{ width: '44%' }}><span style={row?.original?.updatedTaskTypeValue ? { color: "#5b5b5be0" } : {}} title={row?.original?.TaskTypeValue} className="text-content">{row?.original?.TaskTypeValue}</span></span>
                            <span className="px-1" style={{ width: '10%', textAlign: 'center' }}>{row?.original?.updatedTaskTypeValue ? " | " : ''}</span>
                            <span className="columnFixedTaskCate" style={{ fontWeight: 600, width: '44%' }}>
                                <InlineBulkEditingTask className="text-content" activeCategory={item?.activeCategory} ContextValue={item?.ContextValue} columnName="categories" item={row?.original} popupData={popupData} setPopupData={setPopupData} value={row?.original?.updatedTaskTypeValue} inlineEditingCallBack={inlineEditingCallBack} />
                            </span>
                        </div> :
                            <div className="d-flex">
                                <span style={{ width: '41%' }}>&nbsp;</span>
                                <span className="px-1" style={{ width: '10%', textAlign: 'center' }}>{row?.original?.updatedTaskTypeValue ? " | " : ''}</span>
                                <span className="columnFixedTaskCate" style={{ fontWeight: 600, width: '44%' }}>
                                    <InlineBulkEditingTask className="text-content" activeCategory={item?.activeCategory} ContextValue={item?.ContextValue} columnName="categories" item={row?.original} popupData={popupData} setPopupData={setPopupData} value={row?.original?.updatedTaskTypeValue} inlineEditingCallBack={inlineEditingCallBack} />
                                </span>
                            </div>
                        }
                    </>
                ),
                placeholder: "Task Type",
                header: "",
                resetColumnFilters: false,
                size: 180,
                id: "TaskTypeValue",
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row }) => (
                    <div className="d-flex"><span style={row?.original?.updatedPercentComplete ? { color: "#5b5b5be0", width: '44%' } : { width: '44%' }}>{row?.original?.PercentComplete}</span> <span className="px-1" style={{ width: '10%', textAlign: 'center' }}>{row?.original?.updatedPercentComplete ? " | " : ''}</span><span style={{ fontWeight: 600, textAlign: 'right', width: '44%' }}>
                        <InlineBulkEditingTask columnName="PercentComplete" precentComplete={item?.precentComplete} item={row?.original} popupData={popupData} setPopupData={setPopupData} value={row?.original?.updatedPercentComplete} inlineEditingCallBack={inlineEditingCallBack} />
                    </span></div>
                ),
                id: "PercentComplete",
                placeholder: "Status",
                resetColumnFilters: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (
                    <div className="d-flex"><span style={row?.original?.updatedPriorityRank ? { color: "#5b5b5be0", width: '44%' } : { width: '44%' }}>{row?.original?.PriorityRank}</span>  <span className="px-1" style={{ width: '10%', textAlign: 'center' }}>{row?.original?.updatedPriorityRank ? " | " : ''}</span><span style={{ fontWeight: 600, textAlign: 'right', width: '44%' }}>
                        <InlineBulkEditingTask columnName="Priority" priorityRank={item?.priorityRank} item={row?.original} popupData={popupData} setPopupData={setPopupData} value={row?.original?.updatedPriorityRank} inlineEditingCallBack={inlineEditingCallBack} />
                    </span></div>
                ),
                id: "PriorityRank",
                placeholder: "Priority",
                resetColumnFilters: false,
                header: "",
                size: 42,
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row, column, getValue }) => (
                    <>
                        <div className="d-flex"><span style={row?.original?.updatedDisplayDueDate ? { color: "#5b5b5be0", width: '44%' } : { width: '44%' }} >{row?.original?.DisplayDueDate}</span> <span className="px-1" style={{ width: '10%', textAlign: 'center' }}>{row?.original?.updatedDisplayDueDate ? " | " : ''}</span><span style={{ fontWeight: 600, textAlign: 'right', width: '44%' }}>
                            <InlineBulkEditingTask columnName="DueDate" item={row?.original} popupData={popupData} setPopupData={setPopupData} value={row?.original?.updatedDisplayDueDate} inlineEditingCallBack={inlineEditingCallBack} />
                        </span></div>
                    </>
                ),
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.DisplayDueDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "DueDate",
                header: "",
                size: 130,
            },
            {
                accessorFn: (row) => row?.FeatureTypeTitle,
                cell: ({ row }) => (
                    <div className="d-flex">
                        <span style={{ display: "flex", alignItems: "center", maxWidth: '100px', width: '44%' }}><span style={row?.original?.updatedFeatureTypeTitle ? { color: "#5b5b5be0", flexGrow: 1, overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: 'nowrap' } : { flexGrow: 1, overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: 'nowrap' }} title={row?.original?.FeatureTypeTitle} >{row?.original?.FeatureTypeTitle}</span></span>
                        <span className="px-1" style={{ width: '10%', textAlign: 'center' }}>{row?.original?.updatedFeatureTypeTitle ? " | " : ''}</span>
                        <span style={{ display: "flex", alignItems: "center", maxWidth: '100px', fontWeight: 600, textAlign: 'right', width: '44%' }}>
                            <InlineBulkEditingTask style={{ flexGrow: 1, overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: 'nowrap' }} columnName="FeatureType" item={row?.original} ContextValue={item?.ContextValue} popupData={popupData} setPopupData={setPopupData} value={row?.original?.updatedFeatureTypeTitle} inlineEditingCallBack={inlineEditingCallBack} />
                        </span></div>
                ),
                id: "FeatureTypeTitle",
                placeholder: "Feature Type",
                resetColumnFilters: false,
                header: "",
                size: 140,
            },
        ],
        [popupData]
    );
    return (
        <>
            <Panel
                type={PanelType.custom}
                customWidth="1600px"
                isOpen={item?.isOpen}
                onDismiss={handleClosePopup}
                onRenderHeader={onRenderCustomHeader}
                isBlocking={false}
            >
                <section className="Tabl1eContentSection row taskprofilepagegreen">
                    <div className="container-fluid p-0">
                        <section className="TableSection">
                            <div className="container p-0">
                                <div className="Alltable mt-2 ">
                                    <div className="col-sm-12 p-0 smart">
                                        <div>
                                            <GlobalCommanTable columns={columns} data={popupData} callBackData={callBackData} showHeader={true} fixedWidth={true} ref={childRef} defultSelectedRows={defultSelectedRows} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>

                <footer>
                    <button type="button" className="btn btn-default pull-right" onClick={() => handleClosePopup()}>Cancel</button>
                    <button type="button" className="btn btn-primary mx-1 pull-right" onClick={handleChangeDateAndDataCallBack}>Update</button>
                </footer>
                {!loaded && <PageLoader />}
            </Panel>
        </>
    )
}
export default SelectedTaskUpdateOnPopup;