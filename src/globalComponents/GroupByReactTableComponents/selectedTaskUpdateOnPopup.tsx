import * as React from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import GlobalCommanTable from "./GlobalCommanTable";
import { Web } from "sp-pnp-js";
import moment from "moment";
import Loader from "react-loader";
import HighlightableCell from "./highlight";
import ShowTaskTeamMembers from "../ShowTaskTeamMembers";
import ShowClintCatogory from "../ShowClintCatogory";
import { ColumnDef } from "@tanstack/react-table";
import ReactPopperTooltipSingleLevel from "../Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import ReactPopperTooltip from "../Hierarchy-Popper-tooltip";
import InfoIconsToolTip from "../InfoIconsToolTip/InfoIconsToolTip";
import { FaCompressArrowsAlt } from "react-icons/fa";
let childRefdata: any;
const SelectedTaskUpdateOnPopup = (item: any) => {
    const childRef: any = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };
    }
    const [loaded, setLoaded] = React.useState(true);
    const [popupData, setPopupData] = React.useState([])
    const handleChangeDateAndDataCallBack = async () => {
        setLoaded(false);
        console.log(item?.save)
        const filteredValues: Record<string, any> = {};
        for (const key in item?.save) {
            if (Object.prototype?.hasOwnProperty?.call(item?.save, key)) {
                const value = item?.save[key];
                if (value !== undefined && value !== '' && !isEmptyObject(value)) {
                    filteredValues[key] = value;
                }
            }
        }
        function isEmptyObject(obj: Record<string, any>): boolean {
            return Object.keys(obj)?.length === 0 && obj?.constructor === Object;
        }
        let updateData: any = {}
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
                    updateData.Priority = priority,
                        updateData.PriorityRank = priorityRank
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
                updateData.DueDate = dueDate
            }
        }
        if (filteredValues?.PercentComplete && filteredValues?.PercentComplete != undefined) {
            let TaskStatus;
            if (filteredValues?.PercentComplete) {
                const match = filteredValues?.PercentComplete?.match(/(\d+)%\s*(.+)/);
                if (match) {
                    TaskStatus = parseInt(match[1]) / 100;
                }
            }
            updateData.PercentComplete = TaskStatus
        }
        if (filteredValues?.Project && filteredValues?.Project != undefined) {
            updateData.ProjectId = filteredValues?.Project?.Id
        }
        const slectedPopupData = childRef?.current?.table?.getSelectedRowModel()?.flatRows
        const updatePromises: Promise<any>[] = [];
        if (slectedPopupData?.length > 0) {
            slectedPopupData?.forEach((elem: any) => {
                const web = new Web(elem?.original?.siteUrl);
                const updatePromise = web.lists.getById(elem?.original?.listId).items.getById(elem?.original?.Id).update(updateData);
                updatePromises.push(updatePromise);
            });
        }
        try {
            const results = await Promise.all(updatePromises);
            console.log("All projects updated successfully!", results);
            let allData = JSON.parse(JSON.stringify(item?.data))
            let checkBoolian: any = null;
            if (item?.updatedSmartFilterFlatView != true && item?.clickFlatView != true) {
                if (slectedPopupData?.length > 0) {
                    slectedPopupData?.forEach((value: any) => {
                        if (updateData?.Priority) {
                            value.original.Priority = updateData?.Priority;
                        }
                        if (updateData?.PriorityRank) {
                            value.original.PriorityRank = updateData?.PriorityRank;
                        }
                        if (updateData?.DueDate) {
                            value.original.DueDate = updateData?.DueDate;
                        }
                        if (updateData?.PercentComplete) {
                            value.original.PercentComplete = (updateData?.PercentComplete * 100).toFixed(0);
                        }
                        if (filteredValues?.Project) {
                            const makeProjectData = { Id: filteredValues?.Project?.Id, PortfolioStructureID: filteredValues?.Project?.PortfolioStructureID, PriorityRank: filteredValues?.Project?.PriorityRank, Title: filteredValues?.Project?.Title }
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
                        }
                        value.original.DisplayDueDate = moment(value?.original?.DueDate).format("DD/MM/YYYY");
                        if (value?.original?.DisplayDueDate == "Invalid date" || "") {
                            value.original.DisplayDueDate = value?.original?.DisplayDueDate.replaceAll("Invalid date", "");
                        }
                        if (value?.original?.DueDate != null && value?.original?.DueDate != undefined) {
                            value.original.serverDueDate = new Date(value?.original?.DueDate).setHours(0, 0, 0, 0)
                        }
                        checkBoolian = addedCreatedDataFromAWT(allData, value?.original);
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
                            if (updateData?.Priority) {
                                value.original.Priority = updateData?.Priority;
                            }
                            if (updateData?.PriorityRank) {
                                value.original.PriorityRank = updateData?.PriorityRank;
                            }
                            if (updateData?.DueDate) {
                                value.original.DueDate = updateData?.DueDate;
                            }
                            if (updateData?.PercentComplete) {
                                value.original.PercentComplete = (updateData?.PercentComplete * 100).toFixed(0);
                            }
                            if (filteredValues?.Project) {
                                const makeProjectData = { Id: filteredValues?.Project?.Id, PortfolioStructureID: filteredValues?.Project?.PortfolioStructureID, PriorityRank: filteredValues?.Project?.PriorityRank, Title: filteredValues?.Project?.Title }
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
                            }
                            value.original.DisplayDueDate = moment(value?.original?.DueDate).format("DD/MM/YYYY");
                            if (value?.original?.DisplayDueDate == "Invalid date" || "") {
                                value.original.DisplayDueDate = value?.original?.DisplayDueDate.replaceAll("Invalid date", "");
                            }
                            if (value?.original?.DueDate != null && value?.original?.DueDate != undefined) {
                                value.original.serverDueDate = new Date(value?.original?.DueDate).setHours(0, 0, 0, 0)
                            }
                            return value?.original;
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
        console.log(filteredValues);
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

    const handleClosePopup = () => {
        item?.bulkEditingSetting('close');
    };

    const onRenderCustomHeader = () => {
        return (
            <>
                <div className="alignCenter subheading"><span className="siteColor">Bulk Editing for Multiple Items</span></div>
            </>
        );
    };

    React.useEffect(() => {
        if (item?.selectedData?.length > 0) {
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
            let showUpdateData: any = {};
            if (filteredValues?.priority) {
                let priorityRank = 4;
                if (filteredValues?.PriorityRank && filteredValues?.PriorityRank != null) {
                    priorityRank = parseInt(filteredValues?.priority)
                }
                if (priorityRank) {
                    showUpdateData.PriorityRank = priorityRank
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
                    showUpdateData.DueDate = moment(dueDate).format("DD/MM/YYYY");
                }
            }
            if (filteredValues?.PercentComplete && filteredValues?.PercentComplete != undefined) {
                let TaskStatus;
                if (filteredValues?.PercentComplete) {
                    const match = filteredValues?.PercentComplete?.match(/(\d+)%\s*(.+)/);
                    if (match) {
                        TaskStatus = parseInt(match[1]);
                    }
                }
                showUpdateData.PercentComplete = TaskStatus
            }
            if (filteredValues?.Project && filteredValues?.Project != undefined) {
                showUpdateData.PortfolioStructureID = filteredValues?.Project?.PortfolioStructureID
            }
            let selectedDataPropsCopy: any = []
            try {
                selectedDataPropsCopy = JSON.parse(JSON.stringify(item?.selectedData))
            } catch (error) {
                console.log(error)
            }
            let selecteDataValue: any = []
            selectedDataPropsCopy?.map((elem: any) => {
                if (elem.original.subRows?.length > 0) {
                    elem.original.updatedPortfolioStructureID = showUpdateData?.PortfolioStructureID
                    elem.original.updatedDisplayDueDate = showUpdateData?.DueDate
                    elem.original.updatedPercentComplete = showUpdateData?.PercentComplete
                    elem.original.updatedPriorityRank = showUpdateData?.PriorityRank
                    selecteDataValue.push(elem.original);
                } else {
                    elem.original.updatedPortfolioStructureID = showUpdateData?.PortfolioStructureID
                    elem.original.updatedDisplayDueDate = showUpdateData?.DueDate
                    elem.original.updatedPercentComplete = showUpdateData?.PercentComplete
                    elem.original.updatedPriorityRank = showUpdateData?.PriorityRank
                    selecteDataValue.push(elem.original);
                }
            });
            setPopupData(selecteDataValue);
        }
    }, [item?.selectedData?.length > 0])
    const callBackData = React.useCallback((checkData: any) => {
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
                        <ReactPopperTooltipSingleLevel ShareWebId={getValue()} row={row?.original} AllListId={item?.ContextValue} singleLevel={true} masterTaskData={item?.masterTaskData} AllSitesTaskData={popupData} />
                    </>
                ),
                id: "TaskID",
                placeholder: "ID",
                header: "",
                resetColumnFilters: false,
                isColumnDefultSortingAsc: true,
                size: 190,
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
                            <div className="alignCenter"><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${item?.ContextValue?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.ProjectId}`} >
                                <ReactPopperTooltip ShareWebId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={item?.ContextValue} /></a><div className="ms-2" style={{ background: 'yellow' }}>{row?.original?.updatedPortfolioStructureID}</div></div>
                            : ""}
                    </>
                ),
                id: 'ProjectTitle',
                placeholder: "Project",
                resetColumnFilters: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row }) => (
                    <div className="alignCenter">{row?.original?.PercentComplete} <div className="ms-2" style={{ background: 'yellow' }}>{row?.original?.updatedPercentComplete}</div></div>
                ),
                id: "PercentComplete",
                placeholder: "Status",
                resetColumnFilters: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (
                    <div className="alignCenter">{row?.original?.PriorityRank}  <div className="ms-2" style={{ background: 'yellow' }}>{row?.original?.updatedPriorityRank}</div></div>
                ),
                id: "PriorityRank",
                placeholder: "Priority",
                resetColumnFilters: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row, column, getValue }) => (
                    <div className="alignCenter">{row?.original?.DisplayDueDate}<div className="ms-2" style={{ background: 'yellow' }}>{row?.original?.updatedDisplayDueDate}</div></div>
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
                size: 120,
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
                                        <Loader loaded={loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1}
                                            color="#000069"
                                            speed={2}
                                            trail={60}
                                            shadow={false}
                                            hwaccel={false}
                                            className="spinner"
                                            zIndex={2e9}
                                            top="28%"
                                            left="50%"
                                            scale={1.0}
                                            loadedClassName="loadedContent"
                                        />
                                        <div>
                                            <GlobalCommanTable columns={columns} data={popupData} callBackData={callBackData} showHeader={true} fixedWidth={true} ref={childRef} />
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
            </Panel>
        </>
    )
}
export default SelectedTaskUpdateOnPopup;