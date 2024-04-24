import * as React from 'react';
import {
    Column,
    Table,
    ExpandedState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    flexRender,
    ColumnFiltersState,
    getSortedRowModel,
    SortingState,
    FilterFn,
    getPaginationRowModel,
    Row
} from "@tanstack/react-table";
import { useVirtualizer, notUndefined } from "@tanstack/react-virtual";
import { RankingInfo, rankItem, compareItems } from "@tanstack/match-sorter-utils";
import { FaSort, FaSortDown, FaSortUp, FaChevronRight, FaChevronLeft, FaAngleDoubleRight, FaAngleDoubleLeft, FaPlus, FaMinus, FaListAlt } from 'react-icons/fa';
import { HTMLProps } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";
import saveAs from "file-saver";
import { RiFileExcel2Fill, RiFilter3Fill, RiListSettingsFill } from 'react-icons/ri';
import ShowTeamMembers from '../ShowTeamMember';
import SelectFilterPanel from './selectFilterPannel';
import ExpndTable from '../ExpandTable/Expandtable';
import RestructuringCom from '../Restructuring/RestructuringCom';
import { SlArrowDown, SlArrowRight, SlArrowUp } from 'react-icons/sl';
import { BsClockHistory, BsList, BsSearch } from 'react-icons/bs';
import Tooltip from "../../globalComponents/Tooltip";
import { Alert } from 'react-bootstrap';
import DateColumnFilter from './DateColumnFilter';
import { AiFillSetting, AiOutlineMore } from 'react-icons/ai';
import { BiDotsVertical } from 'react-icons/bi';
import BulkEditingFeature from './BulkEditingFeature';
import BulkEditingConfrigation from './BulkEditingConfrigation';
import ColumnsSetting from './ColumnsSetting';
import HeaderButtonMenuPopup from './HeaderButtonMenuPopup';
import { Web } from 'sp-pnp-js';
import { TbChevronDown, TbChevronUp, TbSelector } from 'react-icons/tb';
import { myContextValue } from '../globalCommon';
import ProgressBar from 'react-bootstrap/ProgressBar';
import moment from 'moment';
// import TileBasedTasks from './TileBasedTasks';
// ReactTable Part/////
declare module "@tanstack/table-core" {
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }
    interface FilterMeta {
        itemRank: RankingInfo;
    }
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
        itemRank
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

///Global Filter Parts//////
// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    portfolioColor,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
    portfolioColor: any
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <>
            <div className="container-2 mx-1">
                <span className="icon"><BsSearch style={{ color: `${portfolioColor}` }} /></span>
                <input type="search" id="search" {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)} />
            </div>
        </>
    );
}



export function Filter({
    column,
    table,
    placeholder
}: {
    column: Column<any, any>;
    table: Table<any>;
    placeholder: any
}): any {
    const columnFilterValue = column.getFilterValue();
    return (
        <input style={{ width: "100%", paddingRight: "10px" }} className="m-1 on-search-cross" title={placeholder?.placeholder} type="search" value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)} placeholder={`${placeholder?.placeholder}`} />
    );
}

export function IndeterminateCheckbox(
    {
        indeterminate,
        className = "",
        ...rest
    }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
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
            className={className + "form-check-input cursor-pointer"}
            {...rest}
        />
    );
}

// ********************* function with globlize Expended And Checkbox*******************
let forceExpanded: any = [];
const getFirstColHeader = ({ hasCheckbox, hasExpanded, isHeaderNotAvlable, portfolioColor }: any) => {
    return ({ table }: any) => (
        <>
            {hasExpanded && isHeaderNotAvlable != true && (<>
                <span className="border-0 bg-Ff ms-1 mb-1" {...{ onClick: table.getToggleAllRowsExpandedHandler(), }}>
                    {table.getIsAllRowsExpanded() ? (
                        <SlArrowDown style={{ color: portfolioColor, width: '12px' }} title='Tap to collapse the childs' />) : (<SlArrowRight style={{ color: portfolioColor, width: '12px' }} title='Tap to expand the childs' />)}
                </span>{" "}
            </>)}
            {hasCheckbox && (
                <span style={hasExpanded ? { marginLeft: '7px', marginBottom: '0px' } : {}} ><IndeterminateCheckbox className="mx-1 " style={{ marginTop: "5px" }} {...{ checked: table.getIsAllRowsSelected(), indeterminate: table.getIsSomeRowsSelected(), onChange: table.getToggleAllRowsSelectedHandler(), }} />{" "}</span>
            )}

        </>
    );
};

const getFirstColCell = ({ setExpanded, hasCheckbox, hasCustomExpanded, hasExpanded }: any) => {
    return ({ row, getValue, table }: any) => (
        <div className="alignCenter">
            {hasExpanded && row.getCanExpand() && (
                <div className="border-0 alignCenter" {...{ onClick: row.getToggleExpandedHandler(), style: { cursor: "pointer" }, }}>
                    {row.getIsExpanded() ? <SlArrowDown title={'Collapse ' + `${row.original.Title}` + ' childs'} style={{ color: `${row?.original?.PortfolioType?.Color}`, width: '12px' }} /> : <SlArrowRight title={'Expand ' + `${row.original.Title}` + ' childs'} style={{ color: `${row?.original?.PortfolioType?.Color}`, width: '12px' }} />}
                </div>
            )}{" "}
            {hasCheckbox && row?.original?.Title != "Others" && (
                <span style={{ marginLeft: hasExpanded && row.getCanExpand() ? '11px' : hasExpanded !== true ? '0px' : '23px' }}> <IndeterminateCheckbox {...{ checked: row.getIsSelected(), indeterminate: row.getIsSomeSelected(), onChange: row.getToggleSelectedHandler(), }} />{" "}</span>
            )}
            {hasCustomExpanded && <div>
                {((row.getCanExpand() &&
                    row.subRows?.length !== row.original.subRows?.length) ||
                    !row.getCanExpand() ||
                    forceExpanded.includes(row.id)) &&
                    row.original.subRows?.length ? (
                    <div className="mx-1 alignCenter"
                        {...{
                            onClick: () => {
                                if (!forceExpanded.includes(row.id)) {
                                    const coreIds = table.getCoreRowModel().rowsById;
                                    row.subRows = coreIds[row.id].subRows;
                                    const rowModel = table.getRowModel();
                                    const updateRowModelRecursively = (item: any) => {
                                        item.subRows?.forEach((elem: any) => {
                                            if (!rowModel.rowsById[elem.id]) {
                                                rowModel.flatRows.push(elem);
                                                rowModel.rowsById[elem.id] = elem;
                                            }
                                            elem?.subRows?.length &&
                                                updateRowModelRecursively(elem);
                                        });
                                    }
                                    updateRowModelRecursively(row);
                                    const temp = Object.keys(coreIds).filter(
                                        (item: any) =>
                                            item === row.id ||
                                            item.startsWith(row.id + ".")
                                    );
                                    forceExpanded = [...forceExpanded, ...temp];
                                    setExpanded((prev: any) => ({
                                        ...prev,
                                        [row.id]: true,
                                    }));
                                } else {
                                    row.getToggleExpandedHandler()();
                                }
                            },
                            style: { cursor: "pointer" },
                        }}
                    >
                        {!row.getCanExpand() ||
                            (row.getCanExpand() &&
                                row.subRows?.length !== row.original.subRows?.length)
                            ? <FaPlus style={{ fontSize: '10px', color: `${row?.original?.PortfolioType?.Color}` }} />
                            : row.getIsExpanded()
                                ? <FaMinus style={{ color: `${row?.original?.PortfolioType?.Color}` }} />
                                : <FaPlus style={{ fontSize: '10px', color: `${row?.original?.PortfolioType?.Color}` }} />}
                    </div>
                ) : (
                    ""
                )}{" "}
            </div>}
            {getValue()}
        </div>
    );
};
// ********************* function with globlize Expended And Checkbox*******************


// ReactTable Part end/////
let isShowingDataAll: any = false;
let settingConfrigrationData: any = [];
const GlobalCommanTable = (items: any, ref: any) => {
    let childRefdata: any;
    const childRef = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };
    }
    let expendedTrue = items?.expendedTrue
    let data = items?.data;
    let columns = items?.columns;
    let callBackData = items?.callBackData;
    let callBackDataToolTip = items?.callBackDataToolTip;
    let pageName = items?.pageName;
    let siteUrl: any = '';
    let showHeader = items?.showHeader
    let showPopupHeader = items?.showPopupHeader
    // let showPagination: any = items?.showPagination;
    let usedFor: any = items?.usedFor;
    let portfolioColor = items?.portfolioColor != undefined ? items?.portfolioColor : "";
    let expandIcon = items?.expandIcon;
    let fixedWidth = items?.fixedWidth;
    let portfolioTypeData = items?.portfolioTypeData;
    let showingAllPortFolioCount = items?.showingAllPortFolioCount
    let columnVisibilityDataValue: any = {}
    let tableId = items?.tableId
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const rerender = React.useReducer(() => ({}), {})[1]
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [expanded, setExpanded] = React.useState<ExpandedState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [ShowTeamPopup, setShowTeamPopup] = React.useState(false);
    const [showTeamMemberOnCheck, setShowTeamMemberOnCheck] = React.useState(false)
    const [globalSearchType, setGlobalSearchType] = React.useState("ALL");
    const [selectedFilterPanelIsOpen, setSelectedFilterPanelIsOpen] = React.useState(false);
    const [dateColumnFilter, setDateColumnFilter] = React.useState(false);
    const [bulkEditingSettingPopup, setBulkEditingSettingPopup] = React.useState(false);
    const [dateColumnFilterData, setDateColumnFilterData] = React.useState({});
    const [tablecontiner, settablecontiner]: any = React.useState("hundred");
    const [trueRestructuring, setTrueRestructuring] = React.useState(false);
    // const [clickFlatView, setclickFlatView] = React.useState(false);
    const [columnVisibility, setColumnVisibility] = React.useState({ descriptionsSearch: false, commentsSearch: false, timeSheetsDescriptionSearch: items?.ShowTimeSheetsDescriptionSearch === true ? true : false });
    // const [columnVisibility, setColumnVisibility] = React.useState({});
    const [selectedFilterPannelData, setSelectedFilterPannelData] = React.useState<any>({
        Title: { Title: 'Title', Selected: true, lebel: 'Title' },
        commentsSearch: { commentsSearch: 'commentsSearch', Selected: true, lebel: 'Comments' },
        descriptionsSearch: { descriptionsSearch: 'descriptionsSearch', Selected: true, lebel: 'Descriptions' },
        timeSheetsDescriptionSearch: { timeSheetsDescriptionSearch: 'timeSheetsDescriptionSearch', Selected: true, lebel: 'Timesheet Data' },
    });
    const [selectedFilterCount, setSelectedFilterCount] = React.useState<any>({ selectedFilterCount: 'All content' })

    const [dragedTask, setDragedTask] = React.useState({ task: {}, taskId: '' });
    const [bulkEditingCongration, setBulkEditingCongration] = React.useState<any>({});
    const [columnSettingPopup, setColumnSettingPopup] = React.useState<any>(false);
    const [projectTiles, setProjectTiles] = React.useState<any>([]);
    const [categoriesTiles, setCategoriesTiles] = React.useState([]);
    const [coustomButtonMenuPopup, setCoustomButtonMenuPopup] = React.useState(false);
    const [showHeaderLocalStored, setShowHeaderLocalStored] = React.useState(items?.showHeader ? items?.showHeader : false);
    const [showTilesView, setShowTilesView] = React.useState<any>(false);
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [wrapperHeight, setWrapperHeight] = React.useState(items?.wrapperHeight?.length > 0 ? items?.wrapperHeight : "");
    const [showPagination, setShowPagination] = React.useState(items?.showPagination ? items?.showPagination : false);
    const [showPaginationSetting, setShowPaginationSetting] = React.useState(false);
    const [tableSettingPageSize, setTableSettingPageSize] = React.useState(items?.pageSize ? items?.pageSize : 0);
    const [smartFabBasedColumnsSettingToggle, setSmartFabBasedColumnsSettingToggle] = React.useState(false);
    const [smartFabBasedColumnsSetting, setSmartFabBasedColumnsSetting] = React.useState(items?.smartFavTableConfig != undefined && items?.smartFavTableConfig?.length > 0 ? items?.smartFavTableConfig : []);
    const [showProgress, setShowProgress] = React.useState(false);
    // const [settingConfrigrationData, setSettingConfrigrationData] = React.useState([]);
    let MyContextdata: any = React.useContext(myContextValue)
    React.useEffect(() => {
        if (fixedWidth === true) {
            try {
                $('#spPageCanvasContent').removeClass();
                $('#spPageCanvasContent').addClass('sixtyHundred')
                $('#workbenchPageContent').removeClass();
                $('#workbenchPageContent').addClass('sixtyHundred')
            } catch (e) {
                console.log(e);
            }
        }
    }, [fixedWidth === true])

    const customGlobalSearch = (row: any, id: any, query: any) => {
        query = query.replace(/\s+/g, " ").trim().toLowerCase();
        if (String(query).trim() === "") return true;
        for (const key in selectedFilterPannelData) {
            const filter = selectedFilterPannelData[key];
            if (filter[id] === id && filter.Selected === true) {
                const cellValueString: any = row.getValue(id);
                if (cellValueString === null || cellValueString === "" || cellValueString === undefined) {
                    return false;
                }
                const cellValue: any = String(row.getValue(id)).toLowerCase();
                if (isValidISODate(cellValue) === false) {
                    if (globalSearchType === "ALL") {
                        let found = true;
                        let a = query?.split(" ")
                        for (let item of a) {
                            if (!cellValue.split(" ").some((elem: any) => elem === item)) {
                                found = false;
                            }
                        }
                        return found
                    } else if (globalSearchType === "ANY") {
                        for (let item of query.split(" ")) {
                            if (cellValue.includes(item)) return true;
                        }
                        return false;
                    } else if (globalSearchType === "EXACT") {
                        return cellValue.includes(query);
                    }
                } else if (isValidISODate(cellValue) === true) {
                    const cellValueCopy: any = moment(cellValue).format("DD/MM/YYYY")
                    if (globalSearchType === "ALL") {
                        let found = true;
                        let a = query?.split(" ")
                        for (let item of a) {
                            if (!cellValueCopy.split(" ").some((elem: any) => elem === item)) {
                                found = false;
                            }
                        }
                        return found
                    } else if (globalSearchType === "ANY") {
                        for (let item of query.split(" ")) {
                            if (cellValueCopy.includes(item)) return true;
                        }
                        return false;
                    } else if (globalSearchType === "EXACT") {
                        return cellValueCopy.includes(query);
                    }
                }
            }
        }
    };
    const isValidISODate = (dateString: string): boolean => {
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/i;
        return isoDateRegex.test(dateString);
    };
    // ***************** coustmize Global Expende And Check Box *********************
    const modColumns = React.useMemo(() => {
        return columns.map((elem: any, index: any) => {
            elem.header = elem.header || "";
            if (index === 0) {
                elem = {
                    ...elem,
                    header: getFirstColHeader({
                        hasCheckbox: elem.hasCheckbox,
                        hasExpanded: elem.hasExpanded,
                        isHeaderNotAvlable: elem.isHeaderNotAvlable,
                        portfolioColor: portfolioColor,
                    }),
                    cell: getFirstColCell({
                        setExpanded,
                        hasExpanded: elem.hasExpanded,
                        hasCheckbox: elem.hasCheckbox,
                        hasCustomExpanded: elem.hasCustomExpanded,
                    }),
                };
            }
            return elem;
        });
    }, [columns]);
    // ***************** coustmize Global Expende And Check Box End *****************

    const selectedFilterCallBack = React.useCallback((item: any) => {
        if (item != undefined) {
            setSelectedFilterPannelData(item)
        }
        setSelectedFilterPanelIsOpen(false);
    }, []);

    /****************** defult sorting  part *******************/

    /****************** DateColumns Filter Part ***************/
    const selectedDateColumnFilter = React.useCallback((compareItemsValue: any) => {
        if (compareItemsValue != undefined && compareItemsValue != null) {
            setDateColumnFilterData(compareItemsValue);
            setDateColumnFilter(false);
        } else if (compareItemsValue === "clearFilter") {
            setDateColumnFilter(false);
            setDateColumnFilterData({});
        } else {
            setDateColumnFilter(false);
        }
    }, []);
    const coustomFilterColumns = (valueEvents: any, event: any) => {
        if (valueEvents === "DueDate") {
            setDateColumnFilter(true);
        }
    }

    const coustomButtonMenuToolBoxCallback = React.useCallback((compareItemsValue: any) => {

    }, []);
    const coustomButtonMenuToolBox = (valueEvents: any) => {
        if (valueEvents === "buttonMenu") {
            setCoustomButtonMenuPopup(true);
        }
    }
    /****************** DateColumns Filter End ***************/
    /// ******************* Bulk Editing Setting ******************/

    const bulkEditingSetting = React.useCallback((eventSetting: any) => {
        if (eventSetting != 'close') {
            if (eventSetting?.Project === false) {
                setProjectTiles([]);
            }
            if (eventSetting?.categories === false) {
                setCategoriesTiles([]);
            }
            setBulkEditingCongration(eventSetting);
            setBulkEditingSettingPopup(false);
        } else {
            setBulkEditingSettingPopup(false);
        }
    }, []);
    const bulkEditingSettingPopupEvent = () => {
        setBulkEditingSettingPopup(true);
    }


    ///******************** Bulk Editing Setting End************* */
    const fetchSettingConfrigrationData = async (event: any) => {
        try {
            settingConfrigrationData = [];
            if (smartFabBasedColumnsSetting?.length === 0) {
                let configurationData: any = [];
                settingConfrigrationData = [];
                const web = new Web(items?.AllListId?.siteUrl);
                const resultsArray = await web.lists.getByTitle('AdminConfigurations').items.select('Id', 'Title', 'Value', 'Key', 'Description', 'DisplayTitle', 'Configurations', "Author/Id", "Author/Title").expand("Author").filter(`Title eq '${tableId}' and Author/Id eq ${items?.AllListId?.Context?.pageContext?.legacyPageContext?.userId}`).get();
                configurationData = resultsArray?.map((smart: any) => JSON.parse(smart?.Configurations));
                if (configurationData?.length > 0) {
                    configurationData[0].ConfrigId = resultsArray[0]?.Id;
                }
                console.log(resultsArray);
                settingConfrigrationData = settingConfrigrationData.concat(configurationData);
            } else if (smartFabBasedColumnsSetting?.length > 0) {
                settingConfrigrationData = settingConfrigrationData.concat(smartFabBasedColumnsSetting);
            }
            if (event != true) {
                defultColumnPrepare();
            }
        } catch (error) {
            if (event != true) {
                defultColumnPrepare();
            }
            console.error(error)
        }
    };
    React.useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                await fetchSettingConfrigrationData('');
            } catch (error) {
                console.error('Error:', error);
            }
        }; fetchData();
    }, [columns]);

    const defultColumnPrepare = () => {
        if (columns?.length > 0 && columns != undefined) {
            let sortingDescData: any = [];
            let columnVisibilityResult: any = {};
            let preSetColumnSettingVisibility: any = {};
            let updatedSelectedFilterPannelData: any = {};
            let preSetColumnOrdring: any = [];
            console.log(settingConfrigrationData);
            columns = columns.map((updatedSortDec: any) => {
                try {
                    if (settingConfrigrationData?.length > 0 && settingConfrigrationData[0]?.tableId === tableId && (items?.columnSettingIcon === true)) {
                        const preSetColumnsValue = settingConfrigrationData[0]
                        if (preSetColumnsValue?.tableId === items?.tableId) {
                            preSetColumnSettingVisibility = preSetColumnsValue?.columnSettingVisibility;
                            preSetColumnOrdring = preSetColumnsValue
                            setShowHeaderLocalStored(preSetColumnsValue?.showHeader)
                            if (Object.keys(preSetColumnSettingVisibility)?.length) {
                                const columnId = updatedSortDec.id;
                                if (preSetColumnSettingVisibility[columnId] !== undefined) {
                                    updatedSortDec.isColumnVisible = preSetColumnSettingVisibility[columnId];
                                }
                            }
                        } else if (updatedSortDec?.isColumnVisible === false && items?.columnSettingIcon === true) {
                            columnVisibilityResult[updatedSortDec.id] = updatedSortDec.isColumnVisible;
                        }
                    } else if (updatedSortDec?.isColumnVisible === false && items?.columnSettingIcon === true) {
                        columnVisibilityResult[updatedSortDec.id] = updatedSortDec.isColumnVisible;
                    }
                    if (updatedSortDec.isColumnDefultSortingDesc === true) {
                        let obj = { 'id': updatedSortDec.id, desc: true };
                        sortingDescData.push(obj);
                    } else if (updatedSortDec.isColumnDefultSortingAsc === true) {
                        let obj = { 'id': updatedSortDec.id, desc: false };
                        sortingDescData.push(obj);
                    }
                    if (updatedSortDec.placeholder != "" && updatedSortDec.placeholder != undefined) {
                        updatedSelectedFilterPannelData[updatedSortDec.id] = {
                            [updatedSortDec.id]: updatedSortDec.id,
                            Selected: updatedSortDec.isColumnVisible,
                            lebel: updatedSortDec.placeholder
                        };
                    }
                    return updatedSortDec;
                } catch (error) {
                    console.log(error);
                    localStorage.removeItem(tableId);
                    location.reload();
                }
            });
            setSelectedFilterPannelData(updatedSelectedFilterPannelData);
            if (preSetColumnOrdring?.columnOrderValue?.length > 0 && preSetColumnOrdring?.tableId === items?.tableId) {
                const colValue = preSetColumnOrdring?.columnOrderValue?.map((elem: any) => elem.id);
                setColumnOrder(colValue);
            } else if (items?.columnSettingIcon === true && tableId) {
                const colValue = columns?.map((elem: any) => elem.id);
                setColumnOrder(colValue);
            }
            if (preSetColumnOrdring?.tableHeightValue?.length > 0 && preSetColumnOrdring?.tableHeightValue != "") {
                setWrapperHeight(preSetColumnOrdring?.tableHeightValue);
            } else {
                setWrapperHeight(items?.wrapperHeight);
            }
            if (preSetColumnOrdring?.showProgress === true) {
                setShowProgress(true)
            } else {
                setShowProgress(false)
            }
            try {
                if ((Object.keys(preSetColumnSettingVisibility) != null && Object.keys(preSetColumnSettingVisibility) != undefined) && Object.keys(preSetColumnSettingVisibility)?.length > 0 && preSetColumnOrdring?.tableId === items?.tableId) {
                    setColumnVisibility(preSetColumnSettingVisibility);
                } else if (Object.keys(columnVisibilityResult)?.length > 0) {
                    setColumnVisibility(columnVisibilityResult);
                    columnVisibilityDataValue = { ...columnVisibilityResult };
                }
            } catch (error) {
                console.log(error)
            }

            if (sortingDescData.length > 0) {
                setSorting(sortingDescData);
            } else {
                setSorting([]);
            }
            try {
                if (settingConfrigrationData?.length > 0 && settingConfrigrationData[0]?.tableId === tableId && (items?.columnSettingIcon === true)) {
                    const preSetColumnsValue = settingConfrigrationData[0]
                    if (preSetColumnsValue?.tableId === items?.tableId) {
                        makeConfrigrationColumnsDefult()
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    const makeConfrigrationColumnsDefult = () => {
        try {
            if (settingConfrigrationData?.length > 0 && settingConfrigrationData[0]?.tableId === tableId && (items?.columnSettingIcon === true)) {
                const eventSetting = settingConfrigrationData[0]
                if (eventSetting?.columanSize?.length > 0) {
                    table?.getHeaderGroups()?.map((elem: any) => {
                        elem?.headers?.map((elem1: any) => {
                            eventSetting?.columanSize?.map((colSize: any) => {
                                if (colSize?.id === elem1?.column?.id) {
                                    let sizeValue = { ...colSize }
                                    elem1.column.columnDef.size = parseInt(sizeValue?.size);
                                }
                            })
                        })
                    })
                }
                if (columns?.length > 0 && columns != undefined) {
                    let sortingDescData: any = [];
                    if (Object?.keys(eventSetting?.columnSorting)?.length > 0 || eventSetting?.columanSize?.length > 0) {
                        columns?.map((updatedSortDec: any) => {
                            let idMatch = updatedSortDec.id;
                            if (eventSetting?.columnSorting[idMatch]?.id === updatedSortDec.id) {
                                if (eventSetting?.columnSorting[idMatch]?.desc === true) {
                                    let obj = { 'id': updatedSortDec.id, desc: true }
                                    sortingDescData.push(obj);
                                }
                                if (eventSetting?.columnSorting[idMatch]?.asc === true) {
                                    let obj = { 'id': updatedSortDec.id, desc: false }
                                    sortingDescData.push(obj);
                                }
                            }
                            eventSetting?.columanSize?.map((elem: any) => {
                                if (elem?.id === updatedSortDec.id) {
                                    let sizeValue = { ...elem }
                                    updatedSortDec.size = parseInt(sizeValue?.size);
                                }
                            })
                        });
                    }
                    if (sortingDescData.length > 0) {
                        setSorting(sortingDescData);
                    } else {
                        setSorting([]);
                    }
                }
                try {
                    if (Object?.keys(eventSetting?.showPageSizeSetting)?.length > 0 && eventSetting?.showPageSizeSetting != undefined) {
                        if (eventSetting?.showPageSizeSetting?.tablePageSize > 0) {
                            table?.setPageSize(eventSetting?.showPageSizeSetting?.tablePageSize);
                            setShowPagination(true);
                            // setShowPaginationSetting(true);
                            setTableSettingPageSize(eventSetting?.showPageSizeSetting?.tablePageSize)
                        } else {
                            setShowPagination(false);
                            // setShowPaginationSetting(false);
                            setTableSettingPageSize(items?.pageSize ? items?.pageSize : 0);
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    /****************** defult Expend Other Section  part *******************/
    React.useEffect(() => {
        if (table?.getRowModel()?.rows.length > 0) {
            table?.getRowModel()?.rows.map((elem: any) => {
                if (elem?.original?.Title === "Others") {
                    const newExpandedState = { [elem.id]: true };
                    setExpanded(newExpandedState);
                }
            })
        }
    }, [])
    /****************** defult Expend Other Section end *******************/
    /****************** defult sorting  part end *******************/

    const table: any = useReactTable({
        data,
        columns: modColumns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            globalFilter,
            columnFilters,
            expanded,
            sorting,
            rowSelection,
            columnVisibility,
            columnOrder,
        },
        onSortingChange: setSorting,
        enableMultiRowSelection: items?.multiSelect === false ? items?.multiSelect : true,
        onColumnFiltersChange: setColumnFilters,
        onExpandedChange: setExpanded,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: customGlobalSearch,
        getSubRows: (row: any) => row?.subRows,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: showPagination === true ? getPaginationRowModel() : null,
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        filterFromLeafRows: true,
        enableSubRowSelection: false,
        // filterFns: undefined
    });
    React.useEffect(() => {
        CheckDataPrepre()
    }, [table?.getSelectedRowModel()?.flatRows])
    React.useEffect(() => {
        if (items?.pageSize != undefined) {
            table.setPageSize(items?.pageSize)
        } else {
            table.setPageSize(100);
        }
        table.setPageSize(100);
    }, [])
    let item: any;
    let ComponentCopy: any = 0;
    let SubComponentCopy: any = 0;
    let FeatureCopy: any = 0;
    let FilterShowhideShwingData: any = false;
    let AfterSearch = table?.getRowModel()?.rows;
    React.useEffect(() => {
        if (columnFilters.length > 0 || globalFilter.length > 0) {
            if (AfterSearch != undefined && AfterSearch.length > 0) {
                AfterSearch?.map((Comp: any) => {
                    if (Comp.columnFilters.Title == true || Comp.columnFilters.PortfolioStructureID == true || Comp.columnFilters.ClientCategory == true || Comp.columnFilters.TeamLeaderUser == true || Comp.columnFilters.PercentComplete == true || Comp.columnFilters.ItemRank == true || Comp.columnFilters.DueDate == true) {
                        FilterShowhideShwingData = true;
                    }
                    if (Comp.original != undefined) {
                        if (Comp?.original?.Item_x0020_Type == "Component") {
                            ComponentCopy = ComponentCopy + 1
                        }
                        if (Comp?.original?.Item_x0020_Type == "SubComponent") {
                            SubComponentCopy = SubComponentCopy + 1;
                        }
                        if (Comp?.original?.Item_x0020_Type == "Feature") {
                            FeatureCopy = FeatureCopy + 1;
                        }
                    }
                })
            }
            let ShowingData = { ComponentCopy: ComponentCopy, SubComponentCopy: SubComponentCopy, FeatureCopy: FeatureCopy, FilterShowhideShwingData: FilterShowhideShwingData }
            callBackData(item, ShowingData)
        }
    }, [table?.getRowModel()?.rows])

    React.useEffect(() => {
        if (AfterSearch != undefined && AfterSearch.length > 0) {
            portfolioTypeData?.filter((count: any) => { count[count.Title + 'numberCopy'] = 0 })
            items?.taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'numberCopy'] = 0 })
            AfterSearch?.map((Comp: any) => {
                if (columnFilters.length > 0 || globalFilter.length > 0) {
                    isShowingDataAll = true;
                    portfolioTypeData?.map((type: any) => {
                        if (Comp?.original?.Item_x0020_Type === type.Title) {
                            type[type.Title + 'numberCopy'] += 1;
                            type.FilterShowhideShwingData = true;
                        }
                    })
                    items?.taskTypeDataItem?.map((taskLevel: any) => {
                        if (Comp?.original?.TaskType?.Title === taskLevel.Title) {
                            taskLevel[taskLevel.Title + 'numberCopy'] += 1;
                            taskLevel.FilterShowhideShwingData = true;
                        }
                    })
                } else {
                    isShowingDataAll = false;
                    portfolioTypeData?.map((type: any) => {
                        if (type.Title + 'numberCopy' != undefined) {
                            type[type.Title + 'numberCopy'] = 0;
                            type.FilterShowhideShwingData = false;
                        }
                    })
                    items?.taskTypeDataItem?.map((taskLevel: any) => {
                        if (taskLevel.Title + 'numberCopy' != undefined) {
                            taskLevel[taskLevel.Title + 'numberCopy'] = 0;
                            taskLevel.FilterShowhideShwingData = false;
                        }
                    })
                }
            })
        } else {
            portfolioTypeData?.filter((count: any) => { count[count.Title + 'numberCopy'] = 0 })
            items?.taskTypeDataItem?.filter((taskLevelcount: any) => { taskLevelcount[taskLevelcount.Title + 'numberCopy'] = 0 })
            isShowingDataAll = true;
        }
    }, [table?.getRowModel()?.rows])

    const CheckDataPrepre = () => {
        let itrm: any;
        let parentData: any;
        let parentDataCopy: any;
        if (usedFor == "SiteComposition" || items?.multiSelect === true) {
            let finalData: any = table?.getSelectedRowModel()?.flatRows;
            callBackData(finalData);
            if (table?.getSelectedRowModel()?.flatRows.length > 0) {
                restructureFunct(true)
            };
        } else {
            if (table?.getSelectedRowModel()?.flatRows.length > 0) {
                restructureFunct(true)
                table?.getSelectedRowModel()?.flatRows?.map((elem: any) => {
                    if (elem?.getParentRows() != undefined) {
                        // parentData = elem?.parentRow;
                        // parentDataCopy = elem?.parentRow?.original
                        parentDataCopy = elem?.getParentRows()[0]?.original;
                        // if (parentData != undefined && parentData?.parentRow != undefined) {

                        //     parentData = elem?.parentRow?.parentRow
                        //     parentDataCopy = elem?.parentRow?.parentRow?.original

                        //     if (parentData != undefined && parentData?.parentRow != undefined) {

                        //         parentData = elem?.parentRow?.parentRow?.parentRow
                        //         parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.original
                        //     }
                        //     if (parentData != undefined && parentData?.parentRow != undefined) {

                        //         parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow
                        //         parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.original
                        //     }
                        //     if (parentData != undefined && parentData?.parentRow != undefined) {

                        //         parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow
                        //         parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.original
                        //     }
                        //     if (parentData != undefined && parentData?.parentRow != undefined) {
                        //         parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow
                        //         parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.original
                        //     }
                        // }
                    }
                    if (parentDataCopy) {
                        elem.original.parentDataId = parentDataCopy
                    }
                    elem.original.Id = elem.original.ID
                    item = elem.original;
                });
                callBackData(item)
            } else {
                // restructureFunct(false)
                callBackData(item)
            }
            console.log("itrm", item)
        }
    }
    const ShowTeamFunc = () => {
        setShowTeamPopup(true)
    }
    const showTaskTeamCAllBack = React.useCallback(() => {
        setShowTeamPopup(false)
    }, []);
    const openTaskAndPortfolioMulti = () => {
        table?.getSelectedRowModel()?.flatRows?.map((item: any) => {
            let siteUrl: any = ''
            if (item?.original?.siteUrl != undefined) {
                siteUrl = item?.original?.siteUrl;
            } else {
                siteUrl = items?.AllListId?.siteUrl;
            }
            if (item?.original?.ItemCat === "Project") {
                window.open(`${siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${item?.original?.Id}`, '_blank')
            }
            else {
                if (item?.original?.siteType === "Master Tasks") {
                    window.open(`${siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${item?.original?.Id}`, '_blank')
                } else if (item?.original?.siteType === "Project") {
                    window.open(`${siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${item?.original?.Id}`, '_blank')
                } else {
                    window.open(`${siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.original?.Id}&Site=${item?.original?.siteType}`, '_blank')
                }
            }
        })
    }
    React.useEffect(() => {
        if (expendedTrue != true) {
            if (table.getState().columnFilters.length || table.getState()?.globalFilter?.length > 0) {
                const allKeys = Object.keys(table.getFilteredRowModel().rowsById).reduce(
                    (acc: any, cur: any) => {
                        if (table.getFilteredRowModel().rowsById[cur].subRows?.length) {
                            acc[cur] = true;
                        }
                        return acc;
                    },
                    {}
                );
                setExpanded(allKeys);
            } else {
                setExpanded({});
            }
            forceExpanded = [];
        }
    }, [table.getState().columnFilters, table.getState().globalFilter]);


    React.useEffect(() => {
        if (expendedTrue === true) {
            setExpanded(true);
        } else {
            setExpanded({});
        }
    }, []);

    React.useEffect(() => {
        if (pageName === 'hierarchyPopperToolTip') {
            callBackDataToolTip(expanded);
        }
    }, [expanded])

    // Print ANd Xls Parts//////
    const downloadPdf = () => {
        let defaultFountsize = 20;
        let headerColoumns: any = [];
        let notVisbleColumns: any = Object.keys(columnVisibility);
        let allHeaderColoumns = columns.filter((column: any) => {
            return (!notVisbleColumns.includes(column.id) &&
                column.placeholder !== undefined &&
                column.placeholder !== '');
        });
        allHeaderColoumns.map((column: any) => {
            headerColoumns.push(column.placeholder)
        })
        let columnLength = headerColoumns?.length;
        defaultFountsize = defaultFountsize - columnLength;
        let rowDataShow: any = []
        table.getRowModel().rows.map((elt: any) => {
            var value: any = [];
            allHeaderColoumns.map((itemHeader: any) => {
                value.push(elt?.original?.[itemHeader?.id])
            })
            rowDataShow.push(value)
        })
        const doc: any = new jsPDF({ orientation: 'landscape' });
        const styles: any = {
            fontStyle: 'normal',
            fontSize: defaultFountsize,
        };
        autoTable(doc, {
            head: [headerColoumns],
            body: rowDataShow,
            styles: styles,

        })
        doc.save('Data PrintOut');
    }

    // Export To Excel////////
    const exportToExcel = () => {
        const flattenedData: any[] = [];
        const flattenRowData = (row: any) => {
            const flattenedRow: any = {};
            columns.forEach((column: any) => {
                if (column.placeholder != undefined && column.placeholder != '') {
                    flattenedRow[column.id] = row.original[column.id];
                }
            });
            flattenedData.push(flattenedRow);
            if (row.getCanExpand()) {
                row.subRows.forEach(flattenRowData);
            }
        };
        table.getRowModel().rows.forEach(flattenRowData);
        const worksheet = XLSX.utils.aoa_to_sheet([]);
        function removeDuplicates(arr: any) {
            const uniqueArray = [];
            const seen = new Set();
            for (const obj of arr) { const objString = JSON.stringify(obj); if (!seen.has(objString)) { uniqueArray.push(obj); seen.add(objString); } }
            return uniqueArray;
        }
        const uniqueArray: any = removeDuplicates(flattenedData);
        XLSX.utils.sheet_add_json(worksheet, uniqueArray, {
            skipHeader: false,
            origin: "A1",
        });
        const maxLength = 32767;
        const sheetRange = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let R = sheetRange.s.r; R <= sheetRange.e.r; ++R) {
            for (let C = sheetRange.s.c; C <= sheetRange.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellAddress];
                if (cell && cell.t === "s" && cell.v.length > maxLength) {
                    const chunks = [];
                    let text = cell.v;
                    while (text.length > maxLength) {
                        chunks.push(text.slice(0, maxLength));
                        text = text.slice(maxLength);
                    }
                    chunks.push(text);
                    cell.v = chunks.shift();
                    chunks.forEach((chunk) => {
                        const newCellAddress = XLSX.utils.encode_cell({
                            r: R + chunks.length,
                            c: C,
                        });
                        worksheet[newCellAddress] = { t: "s", v: chunk };
                    });
                }
            }
        }
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const excelData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        if (typeof saveAs === "function") {
            saveAs(excelData, "table.xlsx");
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(excelData);
            downloadLink.download = "table.xlsx";
            downloadLink.click();
        }
    };
    ////Export to excel end/////

    const expndpopup = (e: any) => {
        settablecontiner(e);
    };
    const openCreationAllStructure = (eventValue: any) => {
        if (eventValue === "Add Structure") {
            items?.OpenAddStructureModal();
        } else if (eventValue === "Add Activity-Task") {
            items?.addActivity();
        } else if (eventValue === "Add Workstream-Task") {
            items?.AddWorkstreamTask();
        } else if (eventValue === "Smart-Time") {
            items?.smartTimeTotalFunction();
        } else if (eventValue === "Flat-View") {
            items?.switchFlatViewData(data);
        } else if (eventValue === "Groupby-View") {
            items?.switchGroupbyData();
        } else if (eventValue === "sendEmail") {
            items?.mailSend();
        } else if (eventValue === "loadFilterTask") {
            items?.loadFilterTask();
        } else if (eventValue === "Add Site-Structure") {
            items?.addStructure();
        } else if (eventValue === "Compare") {
            items?.openCompareTool()
        }
    }
    ///////////////// code with neha /////////////////////
    const callChildFunction = (items: any) => {
        if (childRef.current) {
            childRef.current.OpenModal(items);
        }
    };

    const trueTopIcon = (items: any) => {
        if (childRef.current) {
            childRef.current.trueTopIcon(items);
        }
    };
    const projectTopIcon = (items: any) => {
        if (childRef.current) {
            childRef.current.projectTopIcon(items);
        }
    };
    React.useImperativeHandle(ref, () => ({
        callChildFunction, trueTopIcon, setRowSelection, globalFilter, projectTopIcon, setColumnFilters, setGlobalFilter, coustomFilterColumns, table, openTableSettingPopup, setSmartFabBasedColumnsSetting
    }));

    const restructureFunct = (items: any) => {
        setTrueRestructuring(items);
    }

    ////////////////  end /////////////////
    const customScrollToFn = (offset: number, options: any, instance: any) => {
        setTimeout(() => {
            instance._scrollToOffset(offset, options);
        }, 200); // Adjust the delay time (in milliseconds) as needed
    };
    
    //Virual rows
    const parentRef = React.useRef<HTMLDivElement>(null);
    const { rows } = table.getRowModel();
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        // estimateSize: () => 24,
        // overscan: 15,
        estimateSize: () => 200,
        scrollToFn: customScrollToFn, 
        overscan: 50,
    });

    const itemsVirtualizer: any = virtualizer.getVirtualItems();
    const [before, after] =
        itemsVirtualizer.length > 0
            ? [
                notUndefined(itemsVirtualizer[0]).start - virtualizer.options.scrollMargin,
                virtualizer.getTotalSize() -
                notUndefined(itemsVirtualizer[itemsVirtualizer.length - 1]).end,
            ]
            : [0, 0];

    const setTableHeight = () => {
        const screenHeight = window.innerHeight;
        const tableHeight = screenHeight * 0.8 - 5;
        parentRef.current.style.height = `${tableHeight}px`;
    };
    React.useEffect(() => {
        if (wrapperHeight) {
            parentRef.current.style.height = wrapperHeight;
        } else {
            setTableHeight();
            window.addEventListener('resize', setTableHeight);
            return () => {
                window.removeEventListener('resize', setTableHeight);
            };
        }
    }, [, wrapperHeight]);
    //Virtual rows
    /**************************************** Drag And Drop Functionality ***************************************/
    const startDrag = (task: any, taskId: any) => {
        if (items?.bulkEditIcon === true) {
            let taskDetails = {
                task: task,
                taskId: taskId
            }
            setDragedTask(taskDetails)
            console.log(task, origin);
        }
    }

    React.useEffect(() => {
        if (bulkEditingCongration?.Project === true && table?.getSelectedRowModel()?.flatRows?.length > 0 && projectTiles?.length === 0) {
            setProjectTiles(table?.getSelectedRowModel()?.flatRows)
        }
        if (bulkEditingCongration?.categories === true && table?.getSelectedRowModel()?.flatRows?.length > 0 && categoriesTiles?.length === 0) {
            let collectedData: any = [];
            let titlesSet = new Set();
            table?.getSelectedRowModel()?.flatRows?.forEach((elem: any) =>
                elem.original?.TaskCategories?.forEach((findElem: any) => {
                    if (!titlesSet.has(findElem.Title)) { titlesSet.add(findElem.Title); collectedData.push(findElem); }
                })
            );
            let uniqueDataArray = [...collectedData];
            setCategoriesTiles(uniqueDataArray);
        }
    }, [bulkEditingSettingPopup]);
    React.useEffect(() => {
        if (items?.defultSelectedRows?.length > 0) {
            let selectedRow: any = {}
            table?.getRowModel()?.rows?.map((elem: any) => {
                items?.defultSelectedRows?.map((selectedId: any) => {
                    if (elem?.original?.Id == selectedId?.original?.Id) {
                        selectedRow = { ...selectedRow, [elem.id]: true }
                    }
                })
            })
            setRowSelection(selectedRow);
        } else if (items?.defultSelectedPortFolio?.length > 0) {
            let selectedRow: any = {}
            table?.getRowModel()?.rows?.map((elem: any) => {
                items?.defultSelectedPortFolio?.map((selectedId: any) => {
                    if (elem?.original?.Id == selectedId?.Id) {
                        selectedRow = { ...selectedRow, [elem.id]: true }
                    }
                })
            })
            setRowSelection(selectedRow);
        }
    }, [items?.defultSelectedRows?.length > 0 || items?.defultSelectedPortFolio])

    const columnSettingCallBack = React.useCallback(async (eventSetting: any) => {
        if (eventSetting != 'close') {
            const callBack = true;
            setColumnSettingPopup(false)
            columnVisibilityDataValue = { ...eventSetting?.columnSettingVisibility }
            if (eventSetting?.columanSize?.length > 0) {
                table?.getHeaderGroups()?.map((elem: any) => {
                    elem?.headers?.map((elem1: any) => {
                        eventSetting?.columanSize?.map((colSize: any) => {
                            if (colSize?.id === elem1?.column?.id) {
                                let sizeValue = { ...colSize }
                                elem1.column.columnDef.size = parseInt(sizeValue?.size);
                            }
                        })
                    })
                })
            }
            if (eventSetting?.showProgress === true) {
                setShowProgress(true)
            } else {
                setShowProgress(false)
            }
            if (eventSetting?.columnOrderValue?.length > 0) {
                const colValue = eventSetting?.columnOrderValue?.map((elem: any) => elem.id);
                setColumnOrder(colValue);
            }
            if (eventSetting?.tableHeightValue?.length > 0 && eventSetting?.tableHeightValue != "") {
                setWrapperHeight(eventSetting?.tableHeightValue);
            } else {
                setWrapperHeight("");
            }
            if (Object.keys(eventSetting?.showPageSizeSetting)?.length > 0) {
                if (eventSetting?.showPageSizeSetting?.tablePageSize > 0) {
                    table?.setPageSize(eventSetting?.showPageSizeSetting?.tablePageSize);
                    setShowPagination(true);
                    // setShowPaginationSetting(true);
                    setTableSettingPageSize(eventSetting?.showPageSizeSetting?.tablePageSize)
                } else {
                    setShowPagination(false);
                    // setShowPaginationSetting(false);
                    setTableSettingPageSize(items?.pageSize ? items?.pageSize : 0)
                }
            }
            setColumnVisibility((prevCheckboxes: any) => ({ ...prevCheckboxes, ...eventSetting?.columnSettingVisibility }));
            setShowHeaderLocalStored(eventSetting?.showHeader);
            // setShowTilesView(eventSetting?.showTilesView);
            await fetchSettingConfrigrationData(callBack);
        } else {
            setColumnSettingPopup(false)
        }
    }, []);

    const openTableSettingPopup = (event: any) => {
        if (event === "tableBased") {
            setColumnSettingPopup(true);
        } else if (event === "favBased") {
            setSmartFabBasedColumnsSettingToggle(true);
            setColumnSettingPopup(true);
        }
    }
    /**************************************** Drag And Drop Functionality End ***************************************/
    return (
        <>
            {items?.bulkEditIcon === true && (bulkEditingCongration?.priority === true || bulkEditingCongration?.dueDate === true || bulkEditingCongration?.status === true || bulkEditingCongration?.Project === true || bulkEditingCongration?.categories === true || bulkEditingCongration?.FeatureType === true) && <span className="toolbox">
                <BulkEditingFeature categoriesTiles={categoriesTiles} masterTaskData={items?.masterTaskData} data={data} columns={items?.columns} setData={items?.setData} updatedSmartFilterFlatView={items?.updatedSmartFilterFlatView} clickFlatView={items?.clickFlatView} ContextValue={items?.AllListId}
                    setBulkEditingCongration={setBulkEditingCongration} dragedTask={dragedTask} bulkEditingCongration={bulkEditingCongration} selectedData={table?.getSelectedRowModel()?.flatRows} projectTiles={projectTiles} AllTaskUser={items.TaskUsers} />
            </span>}
            {showHeaderLocalStored === true && <div className='tbl-headings justify-content-between fixed-Header top-0' style={{ background: '#e9e9e9' }}>
                <span className='leftsec'>
                    {showingAllPortFolioCount === true ? <div className='alignCenter mt--2'>
                        <label className=''>
                            <label style={{ color: "#333333" }}>
                                Showing
                            </label>
                            {portfolioTypeData?.map((type: any, index: any) => {
                                return (
                                    <>
                                        {isShowingDataAll === true ? <label><label className='alignCenter'>
                                            <label style={{ color: "white", backgroundColor: `${portfolioColor}` }} className='ms-1 Dyicons hover-text'>{type.Title !== "Sprint" ? `${type?.Title?.charAt(0)}`: "X"} <span className='tooltip-text pop-right'>{type?.Title}</span></label>
                                            <label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'numberCopy']} `}/</label>
                                            <label style={{ color: "#333333" }} className='ms-1'>{` ${type[type.Title + 'number']} `}</label>
                                        </label></label> :
                                            <label><label className='alignCenter'>
                                                <label style={{ color: "white", backgroundColor: `${portfolioColor}` }} className='ms-1 Dyicons hover-text'>{type.Title !== "Sprint" ? `${type?.Title?.charAt(0)}`: "X"}<span className='tooltip-text pop-right'>{type?.Title}</span></label>
                                                <label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'filterNumber']} `}/</label>
                                                <label style={{ color: "#333333" }} className='ms-1'>{` ${type[type.Title + 'number']} `}</label>
                                            </label></label>}
                                    </>
                                )
                            })}
                            {items?.taskTypeDataItem?.map((type: any, index: any) => {
                                return (
                                    <>
                                        {isShowingDataAll === true ? <label><label className='alignCenter'>
                                            <label style={{ color: "white", backgroundColor: `${portfolioColor}` }} className='ms-1 Dyicons hover-text'>{`${type?.Title?.charAt(0)}`} <span className='tooltip-text pop-right'>{type?.Title}</span></label>
                                            <label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'numberCopy']} `}/</label>
                                            <label style={{ color: "#333333" }} className='ms-1'>{` ${type[type.Title + 'number']} `}</label>
                                        </label></label> :
                                            <label><label className='alignCenter'>
                                                <label style={{ color: "white", backgroundColor: `${portfolioColor}` }} className='ms-1 Dyicons hover-text'>{`${type?.Title?.charAt(0)}`} <span className='tooltip-text pop-right'>{type?.Title}</span></label>
                                                <label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'filterNumber']} `}/</label>
                                                <label style={{ color: "#333333" }} className='ms-1'>{` ${type[type.Title + 'number']} `}</label>
                                            </label></label>}
                                    </>
                                )
                            })}
                        </label>
                        {items?.hideShowingTaskCountToolTip != true ? <>
                            {!items?.pageName ? <span className="popover__wrapper teamPortfolioTooltip ms-1 mt--5" style={{ position: "unset" }} data-bs-toggle="tooltip" data-bs-placement="auto">
                                <span className='svg__iconbox svg__icon--info alignIcon dark mt--2'></span>
                                <span className="popover__content m-3" style={{ zIndex: 100 }}>
                                    <label className='ms-1' style={{ color: "#333333" }}>
                                        Showing
                                    </label>
                                    {portfolioTypeData?.map((type: any, index: any) => {
                                        return (
                                            <>
                                                {isShowingDataAll === true ? <div className='aligncenter'><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'numberCopy']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label></div> :
                                                    <div className='aligncenter'><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'filterNumber']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label></div>}
                                            </>
                                        )
                                    })}
                                    {items?.taskTypeDataItem?.map((type: any, index: any) => {
                                        return (
                                            <>
                                                {isShowingDataAll === true ? <div className='aligncenter'><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'numberCopy']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1}</div> :
                                                    <div className='aligncenter'><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'filterNumber']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1}</div>}
                                            </>
                                        )
                                    })}
                                </span>

                            </span> :
                                <>
                                    <div className='alignCenter mt--2'>
                                        {items?.taskTypeDataItem?.map((type: any, index: any) => {
                                            return (
                                                <>
                                                    {isShowingDataAll === true ? <div className='aligncenter'><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'numberCopy']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-1'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1}</div> :
                                                        <div className='aligncenter'><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'filterNumber']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-1'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1}</div>}
                                                </>
                                            )
                                        })}
                                    </div>
                                </>}
                        </> : ''}

                    </div> :
                        <span style={{ color: "#333333", flex: "none" }} className='Header-Showing-Items'>{`Showing ${table?.getFilteredRowModel()?.rows?.length} of ${items?.catogryDataLength ? items?.catogryDataLength : data?.length}`}</span>}
                    <span className="mx-1">{items?.showDateTime}</span>
                    <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        placeholder="Search All..."
                        portfolioColor={portfolioColor}
                    />
                    {selectedFilterCount?.selectedFilterCount == "No item is selected" ? <span className="svg__iconbox svg__icon--setting hreflink" style={{ backgroundColor: 'gray' }} title={selectedFilterCount?.selectedFilterCount} onClick={() => setSelectedFilterPanelIsOpen(true)}></span> :
                        <span className="svg__iconbox svg__icon--setting hreflink" style={selectedFilterCount?.selectedFilterCount == 'All content' ? { backgroundColor: `${portfolioColor}` } : { backgroundColor: 'rgb(68 114 199)' }} title={selectedFilterCount?.selectedFilterCount} onClick={() => setSelectedFilterPanelIsOpen(true)}></span>}
                    <span className='mx-1'>
                        <select style={{ height: "30px", paddingTop: "3px", color: `${portfolioColor}` }}
                            className="w-100"
                            aria-label="Default select example"
                            value={globalSearchType}
                            onChange={(e) => {
                                setGlobalSearchType(e.target.value);
                                setGlobalFilter("");
                            }}
                        >
                            <option title='text need to contain word1 and word2. (order not important)' value="ALL">All Words</option>
                            <option title=' text need to contain any word1 or word2 or Both.' value="ANY">Any Words</option>
                            <option title=' text must contain exact Phrase in same order.' value="EXACT">Exact Phrase</option>
                        </select>
                    </span>
                </span>
                <span className="toolbox">
                    {items.taskProfile != true && items?.showCreationAllButton === true && <>
                        {items?.PortfolioFeature === "Feature" && items?.hideRestructureBtn != true ? (
                            <button type="button" disabled className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: "#fff" }} title=" Add Structure"> {" "} Add Structure{" "}</button>
                        ) : (table?.getSelectedRowModel()?.flatRows?.length === 1 && table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != "Feature" && table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != "Sprint" && table?.getSelectedRowModel()?.flatRows[0]?.original
                            ?.TaskType?.Title != "Activities" && table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Workstream" && table?.getSelectedRowModel()?.flatRows[0]?.original
                                ?.TaskType?.Title != "Task") || table?.getSelectedRowModel()?.flatRows?.length === 0 ? (
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: "#fff" }} title=" Add Structure" onClick={() => openCreationAllStructure("Add Structure")}>
                                {" "} Add Structure{" "}</button>
                        ) : (
                            <button type="button" disabled className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: "#fff" }} title=" Add Structure"> {" "} Add Structure{" "}</button>
                        )}

                        {items?.protfolioProfileButton != true && items?.hideAddActivityBtn != true && <>{table?.getSelectedRowModel()?.flatRows.length === 1 && table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Task" ? <button type="button" className="btn btn-primary" title='Add Activity' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => openCreationAllStructure("Add Activity-Task")}>Add Activity-Task</button> :
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} disabled={true} > Add Activity-Task</button>}</>}

                        {items?.protfolioProfileButton === true && items?.hideAddActivityBtn != true && <>{items?.protfolioProfileButton === true && table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Task" && table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != "Sprint" ? <button type="button" className="btn btn-primary" title='Add Activity' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => openCreationAllStructure("Add Activity-Task")}>Add Activity-Task</button> :
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} disabled={true} > Add Activity-Task</button>}</>}

                        {items?.showRestructureButton === true && <>
                            {
                                trueRestructuring == true ?
                                    <RestructuringCom AllSitesTaskData={items?.AllSitesTaskData} AllMasterTasksData={items?.masterTaskData} projectmngmnt={items?.projectmngmnt} MasterdataItem={items?.MasterdataItem} queryItems={items.queryItems} restructureFunct={restructureFunct} ref={childRef} taskTypeId={items.TaskUsers} contextValue={items.AllListId} allData={data} restructureCallBack={items.restructureCallBack} restructureItem={table?.getSelectedRowModel()?.flatRows} />
                                    : <button type="button" title="Restructure" disabled={true} className="btn btn-primary">Restructure</button>
                            }
                        </>}

                        {items?.showCompareButton === true && <div> {
                            ((table?.getSelectedRowModel()?.flatRows?.length === 2) && (table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Activities" && table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Workstream" && table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Task")) ?
                                < button type="button" className="btn btn-primary" title='Add Activity' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => openCreationAllStructure("Compare")}>Compare</button> :
                                <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} disabled={true} >Compare</button>
                        }</div>}
                    </>
                    }
                    {items.taskProfile === true && items?.showCreationAllButton === true && items?.hideRestructureBtn != true && <>
                        {table?.getSelectedRowModel()?.flatRows.length < 2 ? <button type="button" className="btn btn-primary" title='Add Activity' onClick={() => openCreationAllStructure("Add Workstream-Task")}>{(table?.getSelectedRowModel()?.flatRows.length > 0 && table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType.Title == "Workstream") || (items?.queryItems?.TaskType?.Title == "Workstream") ? "Add Task" : "Add Workstream-Task"}</button> :
                            <button type="button" className="btn btn-primary" disabled={true} > Add Workstream-Task</button>}

                        {
                            trueRestructuring == true ?
                                <RestructuringCom AllSitesTaskData={items?.AllSitesTaskData} AllMasterTasksData={items?.masterTaskData} queryItems={items.queryItems} restructureFunct={restructureFunct} ref={childRef} taskTypeId={items.TaskUsers} contextValue={items.AllListId} allData={data} restructureCallBack={items.restructureCallBack} restructureItem={table?.getSelectedRowModel()?.flatRows} />
                                : <button type="button" title="Restructure" disabled={true} className="btn btn-primary"
                                >Restructure</button>
                        }
                    </>
                    }
                    {
                        items?.customHeaderButtonAvailable === true && items?.customTableHeaderButtons
                    }
                    {
                        items?.siteStructureCreation === true &&
                        <button type="button" className="btn btn-primary" title='Add Site-Structure' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => openCreationAllStructure("Add Site-Structure")}>Add +</button>
                    }


                    {items?.hideTeamIcon != true ? <>
                        {table?.getSelectedRowModel()?.flatRows?.length > 0 ? <a className="teamIcon hreflink hover-text m-0" onClick={() => ShowTeamFunc()}><span style={{ color: `${portfolioColor}`, backgroundColor: `${portfolioColor}` }} className="svg__iconbox svg__icon--team"></span> <span className='tooltip-text pop-left'>Create Teams Group</span></a>
                            : <a className="teamIcon hover-text m-0"><span style={{ backgroundColor: "gray" }} className="svg__iconbox svg__icon--team"></span> <span className='tooltip-text pop-left'>Create Teams Group</span></a>}
                    </> : ''}

                    {items?.showEmailIcon === true ? <>
                        <a className="teamIcon p-0 hreflink hover-text m-0" onClick={() => openCreationAllStructure("sendEmail")}><span style={{ color: `${portfolioColor}`, backgroundColor: `${portfolioColor}` }} className="svg__iconbox svg__icon--mail"></span> <span className='tooltip-text pop-left'>send email</span></a>
                    </> : ''}

                    {items?.hideOpenNewTableIcon != true ? <>
                        {table?.getSelectedRowModel()?.flatRows?.length > 0 ?
                            <a onClick={() => openTaskAndPortfolioMulti()} className="openWebIcon p-0 hover-text m-0"><span style={{ color: `${portfolioColor}`, backgroundColor: `${portfolioColor}` }} className="svg__iconbox svg__icon--openWeb"></span> <span className='tooltip-text pop-left'>Open in New Tab</span></a>
                            : <a className="openWebIcon p-0 hreflink hover-text m-0"><span className="svg__iconbox svg__icon--openWeb" style={{ backgroundColor: "gray" }}></span> <span className='tooltip-text pop-left'>Open In New Tab</span></a>}
                    </> : ''}

                    {items?.OpenAdjustedTimePopupCategory && items?.showCatIcon === true && <a onClick={items.OpenAdjustedTimePopupCategory} className='hover-text m-0'>
                        <i className="fa fa-cog brush hreflink" aria-hidden="true"></i>
                        <span className='tooltip-text pop-left'>Open Adjusted Time Popup</span>
                    </a>}

                    {items?.showCatIcon != true ? <><a className='excal hreflink hover-text m-0' onClick={() => exportToExcel()}><RiFileExcel2Fill /><span className='tooltip-text pop-left'>Export To Excel</span></a></> :
                        <><a className='excal hover-text m-0' onClick={items?.exportToExcelCategoryReport}><RiFileExcel2Fill /><span className='tooltip-text pop-left'>Export To Excel</span></a></>}

                    {items?.SmartTimeIconShow === true && items?.AllListId?.isShowTimeEntry === true && <a className='smartTotalTime hreflink hover-text m-0' title="Load SmartTime of AWT" onClick={() => openCreationAllStructure("Smart-Time")} > <BsClockHistory /> <span className='tooltip-text pop-left'>Load SmartTime of AWT</span></a>}

                    {items?.flatView === true && items?.updatedSmartFilterFlatView === false && <>{items?.clickFlatView === false ? <a className='smartTotalTime hreflink hover-text m-0' onClick={() => openCreationAllStructure("Flat-View")}><BsList /> <span className='tooltip-text pop-left'>Switch to Flat-View</span></a> :
                        <a className='smartTotalTime hover-text m-0' onClick={() => openCreationAllStructure("Groupby-View")}><FaListAlt /><span className='tooltip-text pop-left'>Switch to Groupby View</span></a>}</>}
                    {items?.flatView === true && items?.updatedSmartFilterFlatView === true && <a className='smartTotalTime hreflink hover-text m-0'><FaListAlt /> <span className='tooltip-text pop-left'>Deactivated To Groupby View</span></a>}

                    <a className='brush hover-text m-0'><i className="fa fa-paint-brush hreflink" aria-hidden="true" onClick={() => { setGlobalFilter(''); setColumnFilters([]); setRowSelection({}); }}></i> <span className='tooltip-text pop-left'>Clear All</span></a>

                    <a className='Prints hover-text m-0' onClick={() => downloadPdf()}>
                        <i className="fa fa-print" aria-hidden="true"></i>
                        <span className='tooltip-text pop-left'>Print</span>
                    </a>

                    {items?.bulkEditIcon === true && <a className='smartTotalTime hreflink hover-text m-0' onClick={() => bulkEditingSettingPopupEvent()} ><RiListSettingsFill /> <span className='tooltip-text pop-left'>Bulk Editing Setting</span></a>}

                    {expandIcon === true && <a className="expand hover-text m-0">
                        <ExpndTable prop={expndpopup} prop1={tablecontiner} />
                        <span className='tooltip-text pop-left'>Expand Table Section</span>
                    </a>}

                    {items?.showFilterIcon === true && <><a className='smartTotalTime hreflink hover-text m-0' onClick={() => openCreationAllStructure("loadFilterTask")}><RiFilter3Fill /><span className='tooltip-text pop-left'>Filter All Task</span></a></>}

                    {items?.columnSettingIcon === true && <><a className='smartTotalTime hreflink hover-text m-0' onClick={() => openTableSettingPopup("tableBased")}><AiFillSetting /> <span className='tooltip-text pop-left'>Column Setting</span></a></>}

                    <Tooltip ComponentId={5756} />
                </span>
            </div >}
            <div ref={parentRef} style={{ overflow: "auto" }}>
                <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
                    <table className="SortingTable table table-hover mb-0" id='my-table' style={{ width: "100%" }}>
                        <thead className={showHeaderLocalStored === true ? 'fixedSmart-Header top-0' : 'fixed-Header top-0'}>
                            {table.getHeaderGroups().map((headerGroup: any) => (
                                <tr key={headerGroup.id} >
                                    {headerGroup.headers.map((header: any, index: any) => {
                                        return (
                                            <th key={header.id} colSpan={header.colSpan} style={header.column.columnDef.size != undefined && header.column.columnDef.size != 150 ? { width: header.column.columnDef.size + "px", maxWidth: header.column.columnDef.size + "px", minWidth: header.column.columnDef.size + "px" } : {}}>
                                                {header.isPlaceholder ? null : (
                                                    <div className='position-relative' style={{ display: "flex" }}>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getCanFilter() ? (
                                                            <Filter column={header.column} table={table} placeholder={header.column.columnDef} />
                                                        ) : null}
                                                        {header.column.getCanSort() ? <div style={items?.clickFlatView === true && header?.column?.columnDef?.placeholder === 'DueDate' ? { position: 'absolute', top: '8px', right: '16px' } : {}}
                                                            {...{
                                                                className: header.column.getCanSort()
                                                                    ? "select-none defultSortingIcons"
                                                                    : "",
                                                                onClick: header.column.getToggleSortingHandler(),
                                                            }}
                                                        >
                                                            {header.column.getIsSorted()
                                                                ? { asc: <div className='upArrow'><SlArrowDown style={{ color: `${portfolioColor}` }} /></div>, desc: <div className='downArrow'><SlArrowUp style={{ color: `${portfolioColor}` }} /></div> }[
                                                                header.column.getIsSorted() as string
                                                                ] ?? null
                                                                : <><div className='downArrow'><SlArrowUp style={{ color: "#818181" }} /></div><div className='upArrow'><SlArrowDown style={{ color: "#818181" }} /></div></>}
                                                        </div> : ""}
                                                        {items?.clickFlatView === true && header?.column?.columnDef?.placeholder === 'DueDate' && <div className='dotFilterIcon' style={{ position: "absolute", top: "8px", right: "5px" }} ><BiDotsVertical style={Object?.keys(dateColumnFilterData)?.length ? { color: `${portfolioColor}`, height: '15px', width: '15px' } : { color: 'gray', height: '15px', width: '15px' }} onClick={(event) => coustomFilterColumns('DueDate', event)} /></div>}

                                                        {showHeaderLocalStored === false && (headerGroup?.headers?.length - 1 === index) && <div className='position-relative hreflink' style={{ display: "flex" }}>
                                                            <div className='dotFilterIcon'><BiDotsVertical style={{ color: 'gray', height: '25px', width: '25px' }} onClick={(event) => coustomButtonMenuToolBox('buttonMenu')} /></div>
                                                        </div>}
                                                        {header?.column?.columnDef?.id === "Id" && showHeaderLocalStored === false && <>
                                                            {showingAllPortFolioCount === true ? <>
                                                                {items?.hideShowingTaskCountToolTip != true ? <>
                                                                    {!items?.pageName ? <span className="popover__wrapper ms-1" style={{ position: "unset" }} data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                        <span className='svg__iconbox svg__icon--info alignIcon dark mt--2'></span>
                                                                        <span className="popover__content mt-3 m-3 mx-3" style={{ zIndex: 100 }}>
                                                                            <label style={{ color: "#333333" }}>
                                                                                Showing
                                                                            </label>
                                                                            {portfolioTypeData?.map((type: any, index: any) => {
                                                                                return (
                                                                                    <>
                                                                                        {isShowingDataAll === true ? <><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'numberCopy']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label><label style={{ color: "#333333" }} className="ms-1"> | </label></> :
                                                                                            <><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'filterNumber']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label><label style={{ color: "#333333" }} className="ms-1"> | </label></>}
                                                                                    </>
                                                                                )
                                                                            })}
                                                                            {items?.taskTypeDataItem?.map((type: any, index: any) => {
                                                                                return (
                                                                                    <>
                                                                                        {isShowingDataAll === true ? <><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'numberCopy']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1 && <label style={{ color: "#333333" }} className="ms-1"> | </label>}</> :
                                                                                            <><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'filterNumber']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-0'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1 && <label style={{ color: "#333333" }} className="ms-1"> | </label>}</>}
                                                                                    </>
                                                                                )
                                                                            })}
                                                                        </span>
                                                                    </span> :
                                                                        <>
                                                                            <div className='alignCenter mt--2'>
                                                                                {items?.taskTypeDataItem?.map((type: any, index: any) => {
                                                                                    return (
                                                                                        <>
                                                                                            {isShowingDataAll === true ? <><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'numberCopy']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-1'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1 && <label style={{ color: "#333333" }} className="ms-1"> | </label>}</> :
                                                                                                <><label className='ms-1' style={{ color: "#333333" }}>{` ${type[type.Title + 'filterNumber']} `} of {" "} </label> <label style={{ color: "#333333" }} className='ms-1'>{` ${type[type.Title + 'number']} `}</label><label style={{ color: "#333333" }} className='ms-1'>{" "} {type.Title}</label>{index < items?.taskTypeDataItem?.length - 1 && <label style={{ color: "#333333" }} className="ms-1"> | </label>}</>}
                                                                                        </>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </>}
                                                                </> : ''}
                                                            </> :
                                                                <span className="popover__wrapper ms-1" style={{ position: "unset" }} data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                    <span className='svg__iconbox svg__icon--info alignIcon dark mt--2'></span>
                                                                    <span className="popover__content mt-3 m-3 mx-3" style={{ zIndex: 100 }}>
                                                                        <span style={{ color: "#333333", flex: "none" }} className='Header-Showing-Items'>{`Showing ${table?.getFilteredRowModel()?.rows?.length} of ${items?.catogryDataLength ? items?.catogryDataLength : data?.length}`}</span>
                                                                        <span className="mx-1">{items?.showDateTime}</span>
                                                                    </span>
                                                                </span>
                                                            }

                                                        </>}
                                                    </div>
                                                )}
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {before > 0 && (
                                <tr>
                                    <td className="col-span-full" style={{ height: before }}></td>
                                </tr>
                            )}
                            {virtualizer.getVirtualItems().map((virtualRow: any, index: any) => {
                                const row = rows[virtualRow.index] as Row<any>;
                                return (
                                    <tr
                                        className={row?.original?.lableColor}
                                        key={row.id} data-index={virtualRow.index} ref={virtualizer.measureElement} onDragStart={(e) => startDrag(row?.original, row?.original?.TaskId)} onDragOver={(e) => e.preventDefault()}>
                                        {row.getVisibleCells().map((cell: any) => {
                                            if (cell.column.columnDef.id == "Id" && row?.original?.IsSCProtected == true) {
                                                return (
                                                    <td className={row?.original?.boldRow} key={cell.id} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>
                                                    </td>
                                                )
                                            } else {
                                                return (
                                                    <td className={row?.original?.boldRow} key={cell.id} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                );
                                            }
                                        })}
                                    </tr>
                                );
                            })}
                            {after > 0 && (
                                <tr>
                                    <td className="col-span-full" style={{ height: after }}></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {data?.length === 0 && <div className='mt-2'>
                        <div className='d-flex justify-content-center' style={{ height: "30px", color: portfolioColor ? `${portfolioColor}` : "#000069" }}>No data available</div>
                    </div>}
                </div>
            </div>
            {
                showPagination === true && showPaginationSetting === false && (table?.getFilteredRowModel()?.rows?.length > table.getState().pagination.pageSize) ? <div className="d-flex paginationnav gap-2 items-center mb-3 mx-2">
                    <button
                        className="border"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FaAngleDoubleLeft />
                    </button>
                    <button
                        className="border"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FaChevronLeft />
                    </button>
                    <span className="flex items-center gap-1 pt-1">
                        <div>Page <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </strong>
                        </div>
                    </span>
                    <button
                        className="border"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <FaChevronRight />
                    </button>
                    <button
                        className="border"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <FaAngleDoubleRight />
                    </button>
                    <select className='w-25'
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[20, 30, 40, 50, 60, 100, 150, 200].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div> : ''
            }
            {ShowTeamPopup === true && items?.TaskUsers?.length > 0 ? <ShowTeamMembers props={table?.getSelectedRowModel()?.flatRows} callBack={showTaskTeamCAllBack} TaskUsers={items?.TaskUsers} portfolioTypeData={items?.portfolioTypeData} context={items?.AllListId?.Context} /> : ''}
            {selectedFilterPanelIsOpen && <SelectFilterPanel columns={columns} isOpen={selectedFilterPanelIsOpen} selectedFilterCount={selectedFilterCount} setSelectedFilterCount={setSelectedFilterCount} selectedFilterCallBack={selectedFilterCallBack} setSelectedFilterPannelData={setSelectedFilterPannelData} selectedFilterPannelData={selectedFilterPannelData} portfolioColor={portfolioColor} />}
            {dateColumnFilter && <DateColumnFilter portfolioTypeDataItemBackup={items?.portfolioTypeDataItemBackup} taskTypeDataItemBackup={items?.taskTypeDataItemBackup} portfolioTypeData={portfolioTypeData} taskTypeDataItem={items?.taskTypeDataItem} dateColumnFilterData={dateColumnFilterData} flatViewDataAll={items?.flatViewDataAll} data={data} setData={items?.setData} setLoaded={items?.setLoaded} isOpen={dateColumnFilter} selectedDateColumnFilter={selectedDateColumnFilter} portfolioColor={portfolioColor} Lable='DueDate' />}
            {bulkEditingSettingPopup && <BulkEditingConfrigation isOpen={bulkEditingSettingPopup} bulkEditingSetting={bulkEditingSetting} bulkEditingCongration={bulkEditingCongration} />}
            {columnSettingPopup && <ColumnsSetting showProgres={showProgress} ContextValue={items?.AllListId} settingConfrigrationData={settingConfrigrationData} tableSettingPageSize={tableSettingPageSize} tableHeight={parentRef?.current?.style?.height} columnOrder={columnOrder} setSorting={setSorting} sorting={sorting} headerGroup={table?.getHeaderGroups()} tableId={items?.tableId} showHeader={showHeaderLocalStored} isOpen={columnSettingPopup} columnSettingCallBack={columnSettingCallBack} columns={columns} columnVisibilityData={columnVisibility}
                smartFabBasedColumnsSettingToggle={smartFabBasedColumnsSettingToggle} setSmartFabBasedColumnsSettingToggle={setSmartFabBasedColumnsSettingToggle} />}

            {coustomButtonMenuPopup && <HeaderButtonMenuPopup isOpen={coustomButtonMenuPopup} coustomButtonMenuToolBoxCallback={coustomButtonMenuToolBoxCallback} setCoustomButtonMenuPopup={setCoustomButtonMenuPopup}
                selectedRow={table?.getSelectedRowModel()?.flatRows} ShowTeamFunc={ShowTeamFunc} portfolioColor={portfolioColor}
                hideTeamIcon={items?.hideTeamIcon} showEmailIcon={items?.showEmailIcon} openCreationAllStructure={openCreationAllStructure}
                hideOpenNewTableIcon={items?.hideOpenNewTableIcon} openTaskAndPortfolioMulti={openTaskAndPortfolioMulti}
                exportToExcel={exportToExcel} SmartTimeIconShow={items?.SmartTimeIconShow} AllListId={items?.AllListId}
                flatView={items?.flatView} updatedSmartFilterFlatView={items?.updatedSmartFilterFlatView} clickFlatView={items?.clickFlatView}
                setGlobalFilter={setGlobalFilter} setColumnFilters={setColumnFilters} setRowSelection={setRowSelection}
                downloadPdf={downloadPdf}
                bulkEditIcon={items?.bulkEditIcon} bulkEditingSettingPopupEvent={bulkEditingSettingPopupEvent}
                expandIcon={items?.expandIcon} expndpopup={expndpopup} tablecontiner={tablecontiner}
                columnSettingIcon={items?.columnSettingIcon} setColumnSettingPopup={setColumnSettingPopup}
            />}
            {/* {showTilesView && <TileBasedTasks ContextValue={items?.AllListId} AllUsers={items?.TaskUsers} tableData={data} />} */}
        </>
    )
}
export default React.forwardRef(GlobalCommanTable);