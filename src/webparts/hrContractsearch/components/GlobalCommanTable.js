var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from 'react';
import * as $ from "jquery";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getExpandedRowModel, flexRender, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { FaSort, FaSortDown, FaSortUp, FaChevronRight, FaChevronLeft, FaAngleDoubleRight, FaAngleDoubleLeft, FaPlus, FaMinus } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";
// import ShowTeamMembers from '../ShowTeamMember';
// import SelectFilterPanel from './selectFilterPannel';
// import ExpndTable from '../ExpandTable/Expandtable';
// import RestructuringCom from '../Restructuring/RestructuringCom';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
// import Loader from "react-loader";
// import PageLoader from '../pageLoader';
import { BsSearch } from 'react-icons/bs';
var fuzzyFilter = function (row, columnId, value, addMeta) {
    // Rank the item
    var itemRank = rankItem(row.getValue(columnId), value);
    // Store the itemRank info
    addMeta({
        itemRank: itemRank
    });
    // Return if the item should be filtered in/out
    return itemRank.passed;
};
///Global Filter Parts//////
// A debounced input react component
function DebouncedInput(_a) {
    var initialValue = _a.value, onChange = _a.onChange, _b = _a.debounce, debounce = _b === void 0 ? 500 : _b, portfolioColor = _a.portfolioColor, props = __rest(_a, ["value", "onChange", "debounce", "portfolioColor"]);
    var _c = React.useState(initialValue), value = _c[0], setValue = _c[1];
    React.useEffect(function () {
        setValue(initialValue);
    }, [initialValue]);
    React.useEffect(function () {
        var timeout = setTimeout(function () {
            onChange(value);
        }, debounce);
        return function () { return clearTimeout(timeout); };
    }, [value]);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "container-2 mx-1" },
            React.createElement("span", { className: "icon" },
                React.createElement(BsSearch, { style: { color: "".concat(portfolioColor) } })),
            React.createElement("input", __assign({ type: "search", id: "search" }, props, { value: value, onChange: function (e) { return setValue(e.target.value); } })))));
}
export function Filter(_a) {
    var column = _a.column, table = _a.table, placeholder = _a.placeholder;
    var columnFilterValue = column.getFilterValue();
    // style={{ width: placeholder?.size }}
    return (React.createElement("input", { style: { width: "100%" }, className: "me-1 my-1 mx-1 on-search-cross", 
        // type="text"
        title: placeholder === null || placeholder === void 0 ? void 0 : placeholder.placeholder, type: "search", value: (columnFilterValue !== null && columnFilterValue !== void 0 ? columnFilterValue : ""), onChange: function (e) { return column.setFilterValue(e.target.value); }, placeholder: "".concat(placeholder === null || placeholder === void 0 ? void 0 : placeholder.placeholder) }));
}
export function IndeterminateCheckbox(_a) {
    var indeterminate = _a.indeterminate, _b = _a.className, className = _b === void 0 ? "" : _b, rest = __rest(_a, ["indeterminate", "className"]);
    var ref = React.useRef(null);
    React.useEffect(function () {
        if (typeof indeterminate === "boolean") {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);
    return (React.createElement("input", __assign({ type: "checkbox", ref: ref, className: className + "form-check-input cursor-pointer" }, rest)));
}
// ********************* function with globlize Expended And Checkbox*******************
var forceExpanded = [];
var getFirstColHeader = function (_a) {
    var hasCheckbox = _a.hasCheckbox, hasExpanded = _a.hasExpanded, isHeaderNotAvlable = _a.isHeaderNotAvlable, portfolioColor = _a.portfolioColor;
    return function (_a) {
        var table = _a.table;
        return (React.createElement(React.Fragment, null,
            hasExpanded && isHeaderNotAvlable != true && (React.createElement(React.Fragment, null,
                React.createElement("span", __assign({ className: "border-0 bg-Ff ms-1" }, { onClick: table.getToggleAllRowsExpandedHandler(), }), table.getIsAllRowsExpanded() ? (React.createElement(SlArrowDown, { style: { color: portfolioColor, width: '12px' }, title: 'Tap to collapse the childs' })) : (React.createElement(SlArrowRight, { style: { color: portfolioColor, width: '12px' }, title: 'Tap to expand the childs' }))),
                " ")),
            hasCheckbox && (React.createElement("span", { style: hasExpanded ? { marginLeft: '7px', marginBottom: '5px' } : {} },
                React.createElement(IndeterminateCheckbox, __assign({ className: "mx-1 " }, { checked: table.getIsAllRowsSelected(), indeterminate: table.getIsSomeRowsSelected(), onChange: table.getToggleAllRowsSelectedHandler(), })),
                " "))));
    };
};
var getFirstColCell = function (_a) {
    var setExpanded = _a.setExpanded, hasCheckbox = _a.hasCheckbox, hasCustomExpanded = _a.hasCustomExpanded, hasExpanded = _a.hasExpanded;
    return function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var row = _a.row, getValue = _a.getValue, table = _a.table;
        return (React.createElement("div", { className: "alignCenter" },
            hasExpanded && row.getCanExpand() && (React.createElement("div", __assign({ className: "border-0 alignCenter" }, { onClick: row.getToggleExpandedHandler(), style: { cursor: "pointer" }, }), row.getIsExpanded() ? React.createElement(SlArrowDown, { title: 'collapse ' + "".concat(row.original.Title) + ' childs', style: { color: "".concat((_c = (_b = row === null || row === void 0 ? void 0 : row.original) === null || _b === void 0 ? void 0 : _b.PortfolioType) === null || _c === void 0 ? void 0 : _c.Color), width: '12px' } }) : React.createElement(SlArrowRight, { title: 'Expand' + "".concat(row.original.Title) + 'childs', style: { color: "".concat((_e = (_d = row === null || row === void 0 ? void 0 : row.original) === null || _d === void 0 ? void 0 : _d.PortfolioType) === null || _e === void 0 ? void 0 : _e.Color), width: '12px' } }))),
            " ",
            hasCheckbox && (React.createElement("span", { style: { marginLeft: hasExpanded && row.getCanExpand() ? '11px' : hasExpanded !== true ? '0px' : '23px' } },
                " ",
                React.createElement(IndeterminateCheckbox, __assign({}, { checked: row.getIsSelected(), indeterminate: row.getIsSomeSelected(), onChange: row.getToggleSelectedHandler(), })),
                " ")),
            hasCustomExpanded && React.createElement("div", null,
                ((row.getCanExpand() &&
                    ((_f = row.subRows) === null || _f === void 0 ? void 0 : _f.length) !== ((_g = row.original.subRows) === null || _g === void 0 ? void 0 : _g.length)) ||
                    !row.getCanExpand() ||
                    forceExpanded.includes(row.id)) &&
                    ((_h = row.original.subRows) === null || _h === void 0 ? void 0 : _h.length) ? (React.createElement("div", __assign({ className: "mx-1 alignCenter" }, {
                    onClick: function () {
                        if (!forceExpanded.includes(row.id)) {
                            var coreIds = table.getCoreRowModel().rowsById;
                            row.subRows = coreIds[row.id].subRows;
                            var rowModel_1 = table.getRowModel();
                            var updateRowModelRecursively_1 = function (item) {
                                var _a;
                                (_a = item.subRows) === null || _a === void 0 ? void 0 : _a.forEach(function (elem) {
                                    var _a;
                                    if (!rowModel_1.rowsById[elem.id]) {
                                        rowModel_1.flatRows.push(elem);
                                        rowModel_1.rowsById[elem.id] = elem;
                                    }
                                    ((_a = elem === null || elem === void 0 ? void 0 : elem.subRows) === null || _a === void 0 ? void 0 : _a.length) &&
                                        updateRowModelRecursively_1(elem);
                                });
                            };
                            updateRowModelRecursively_1(row);
                            var temp = Object.keys(coreIds).filter(function (item) {
                                return item === row.id ||
                                    item.startsWith(row.id + ".");
                            });
                            forceExpanded = __spreadArray(__spreadArray([], forceExpanded, true), temp, true);
                            setExpanded(function (prev) {
                                var _a;
                                return (__assign(__assign({}, prev), (_a = {}, _a[row.id] = true, _a)));
                            });
                        }
                        else {
                            row.getToggleExpandedHandler()();
                        }
                    },
                    style: { cursor: "pointer" },
                }), !row.getCanExpand() ||
                    (row.getCanExpand() &&
                        ((_j = row.subRows) === null || _j === void 0 ? void 0 : _j.length) !== ((_k = row.original.subRows) === null || _k === void 0 ? void 0 : _k.length))
                    ? React.createElement(FaPlus, { style: { fontSize: '10px', color: "".concat((_m = (_l = row === null || row === void 0 ? void 0 : row.original) === null || _l === void 0 ? void 0 : _l.PortfolioType) === null || _m === void 0 ? void 0 : _m.Color) } })
                    : row.getIsExpanded()
                        ? React.createElement(FaMinus, { style: { color: "".concat((_p = (_o = row === null || row === void 0 ? void 0 : row.original) === null || _o === void 0 ? void 0 : _o.PortfolioType) === null || _p === void 0 ? void 0 : _p.Color) } })
                        : React.createElement(FaPlus, { style: { fontSize: '10px', color: "".concat((_r = (_q = row === null || row === void 0 ? void 0 : row.original) === null || _q === void 0 ? void 0 : _q.PortfolioType) === null || _r === void 0 ? void 0 : _r.Color) } }))) : (""),
                " "),
            getValue()));
    };
};
// ********************* function with globlize Expended And Checkbox*******************
// ReactTable Part end/////
var isShowingDataAll = false;
var GlobalCommanTable = function (items, ref) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
    var childRefdata;
    var childRef = React.useRef();
    if (childRef != null) {
        childRefdata = __assign({}, childRef);
    }
    var expendedTrue = items === null || items === void 0 ? void 0 : items.expendedTrue;
    var data = items === null || items === void 0 ? void 0 : items.data;
    var columns = items === null || items === void 0 ? void 0 : items.columns;
    var callBackData = items === null || items === void 0 ? void 0 : items.callBackData;
    var callBackDataToolTip = items === null || items === void 0 ? void 0 : items.callBackDataToolTip;
    var pageName = items === null || items === void 0 ? void 0 : items.pageName;
    var siteUrl = '';
    var showHeader = items === null || items === void 0 ? void 0 : items.showHeader;
    var showPagination = items === null || items === void 0 ? void 0 : items.showPagination;
    var usedFor = items === null || items === void 0 ? void 0 : items.usedFor;
    var portfolioColor = items === null || items === void 0 ? void 0 : items.portfolioColor;
    var expandIcon = items === null || items === void 0 ? void 0 : items.expandIcon;
    var fixedWidth = items === null || items === void 0 ? void 0 : items.fixedWidth;
    var portfolioTypeData = items === null || items === void 0 ? void 0 : items.portfolioTypeData;
    var showingAllPortFolioCount = items === null || items === void 0 ? void 0 : items.showingAllPortFolioCount;
    var _16 = React.useState([]), columnFilters = _16[0], setColumnFilters = _16[1];
    var _17 = React.useState([]), sorting = _17[0], setSorting = _17[1];
    var _18 = React.useState({}), expanded = _18[0], setExpanded = _18[1];
    var _19 = React.useState({}), rowSelection = _19[0], setRowSelection = _19[1];
    var _20 = React.useState(""), globalFilter = _20[0], setGlobalFilter = _20[1];
    var _21 = React.useState(false), ShowTeamPopup = _21[0], setShowTeamPopup = _21[1];
    var _22 = React.useState(false), showTeamMemberOnCheck = _22[0], setShowTeamMemberOnCheck = _22[1];
    var _23 = React.useState("ALL"), globalSearchType = _23[0], setGlobalSearchType = _23[1];
    var _24 = React.useState(false), selectedFilterPanelIsOpen = _24[0], setSelectedFilterPanelIsOpen = _24[1];
    var _25 = React.useState("hundred"), tablecontiner = _25[0], settablecontiner = _25[1];
    var _26 = React.useState(false), trueRestructuring = _26[0], setTrueRestructuring = _26[1];
    var _27 = React.useState({ descriptionsSearch: false, commentsSearch: false }), columnVisibility = _27[0], setColumnVisibility = _27[1];
    var _28 = React.useState({
        Title: { Title: 'Title', Selected: true },
        commentsSearch: { commentsSearch: 'commentsSearch', Selected: true },
        descriptionsSearch: { descriptionsSearch: 'descriptionsSearch', Selected: true },
    }), selectedFilterPannelData = _28[0], setSelectedFilterPannelData = _28[1];
    React.useEffect(function () {
        if (fixedWidth === true) {
            try {
                $('#spPageCanvasContent').removeClass();
                $('#spPageCanvasContent').addClass('sixtyHundred');
                $('#workbenchPageContent').removeClass();
                $('#workbenchPageContent').addClass('sixtyHundred');
            }
            catch (e) {
                console.log(e);
            }
        }
    }, [fixedWidth === true]);
    var customGlobalSearch = function (row, id, query) {
        var _a, _b, _c, _d, _e, _f;
        query = query.replace(/\s+/g, " ").trim().toLowerCase();
        if (String(query).trim() === "")
            return true;
        if ((((_a = selectedFilterPannelData === null || selectedFilterPannelData === void 0 ? void 0 : selectedFilterPannelData.Title) === null || _a === void 0 ? void 0 : _a.Title) === id && ((_b = selectedFilterPannelData === null || selectedFilterPannelData === void 0 ? void 0 : selectedFilterPannelData.Title) === null || _b === void 0 ? void 0 : _b.Selected) === true) || (((_c = selectedFilterPannelData === null || selectedFilterPannelData === void 0 ? void 0 : selectedFilterPannelData.commentsSearch) === null || _c === void 0 ? void 0 : _c.commentsSearch) === id && ((_d = selectedFilterPannelData === null || selectedFilterPannelData === void 0 ? void 0 : selectedFilterPannelData.commentsSearch) === null || _d === void 0 ? void 0 : _d.Selected) === true) ||
            (((_e = selectedFilterPannelData === null || selectedFilterPannelData === void 0 ? void 0 : selectedFilterPannelData.descriptionsSearch) === null || _e === void 0 ? void 0 : _e.descriptionsSearch) === id && ((_f = selectedFilterPannelData === null || selectedFilterPannelData === void 0 ? void 0 : selectedFilterPannelData.descriptionsSearch) === null || _f === void 0 ? void 0 : _f.Selected) === true)) {
            var cellValue = String(row.getValue(id)).toLowerCase();
            if (globalSearchType === "ALL") {
                var found = true;
                var a = query === null || query === void 0 ? void 0 : query.split(" ");
                var _loop_1 = function (item_1) {
                    if (!cellValue.split(" ").some(function (elem) { return elem === item_1; })) {
                        found = false;
                    }
                };
                for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
                    var item_1 = a_1[_i];
                    _loop_1(item_1);
                }
                return found;
            }
            else if (globalSearchType === "ANY") {
                for (var _g = 0, _h = query.split(" "); _g < _h.length; _g++) {
                    var item_2 = _h[_g];
                    if (cellValue.includes(item_2))
                        return true;
                }
                return false;
            }
            else if (globalSearchType === "EXACT") {
                return cellValue.includes(query);
            }
        }
        ;
    };
    // ***************** coustmize Global Expende And Check Box *********************
    var modColumns = React.useMemo(function () {
        return columns.map(function (elem, index) {
            elem.header = elem.header || "";
            if (index === 0) {
                elem = __assign(__assign({}, elem), { header: getFirstColHeader({
                        hasCheckbox: elem.hasCheckbox,
                        hasExpanded: elem.hasExpanded,
                        isHeaderNotAvlable: elem.isHeaderNotAvlable,
                        portfolioColor: portfolioColor,
                    }), cell: getFirstColCell({
                        setExpanded: setExpanded,
                        hasExpanded: elem.hasExpanded,
                        hasCheckbox: elem.hasCheckbox,
                        hasCustomExpanded: elem.hasCustomExpanded,
                    }) });
            }
            return elem;
        });
    }, [columns]);
    // ***************** coustmize Global Expende And Check Box End *****************
    var selectedFilterCallBack = React.useCallback(function (item) {
        if (item != undefined) {
            setSelectedFilterPannelData(item);
        }
        setSelectedFilterPanelIsOpen(false);
    }, []);
    var table = useReactTable({
        data: data,
        columns: modColumns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            globalFilter: globalFilter,
            columnFilters: columnFilters,
            expanded: expanded,
            sorting: sorting,
            rowSelection: rowSelection,
            columnVisibility: columnVisibility,
        },
        onSortingChange: setSorting,
        enableMultiRowSelection: (items === null || items === void 0 ? void 0 : items.multiSelect) === false ? items === null || items === void 0 ? void 0 : items.multiSelect : true,
        onColumnFiltersChange: setColumnFilters,
        onExpandedChange: setExpanded,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: customGlobalSearch,
        getSubRows: function (row) { return row === null || row === void 0 ? void 0 : row.subRows; },
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
    /****************** defult sorting  part *******************/
    React.useEffect(function () {
        if ((columns === null || columns === void 0 ? void 0 : columns.length) > 0 && columns != undefined) {
            var sortingDescData_1 = [];
            columns.map(function (sortDec) {
                if (sortDec.isColumnDefultSortingDesc === true) {
                    var obj = { 'id': sortDec.id, desc: true };
                    sortingDescData_1.push(obj);
                }
                else if (sortDec.isColumnDefultSortingAsc === true) {
                    var obj = { 'id': sortDec.id, desc: false };
                    sortingDescData_1.push(obj);
                }
            });
            if (sortingDescData_1.length > 0) {
                setSorting(sortingDescData_1);
            }
        }
    }, []);
    React.useEffect(function () {
        var _a, _b;
        if (((_a = table === null || table === void 0 ? void 0 : table.getRowModel()) === null || _a === void 0 ? void 0 : _a.rows.length) > 0) {
            (_b = table === null || table === void 0 ? void 0 : table.getRowModel()) === null || _b === void 0 ? void 0 : _b.rows.map(function (elem) {
                var _a;
                var _b;
                if (((_b = elem === null || elem === void 0 ? void 0 : elem.original) === null || _b === void 0 ? void 0 : _b.Title) === "Others") {
                    var newExpandedState = (_a = {}, _a[elem.id] = true, _a);
                    setExpanded(newExpandedState);
                }
            });
        }
    }, [data]);
    /****************** defult sorting  part end *******************/
    React.useEffect(function () {
        CheckDataPrepre();
    }, [(_a = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _a === void 0 ? void 0 : _a.flatRows]);
    React.useEffect(function () {
        if ((items === null || items === void 0 ? void 0 : items.pageSize) != undefined) {
            table.setPageSize(items === null || items === void 0 ? void 0 : items.pageSize);
        }
        else {
            table.setPageSize(100);
        }
        table.setPageSize(100);
    }, []);
    var item;
    var ComponentCopy = 0;
    var SubComponentCopy = 0;
    var FeatureCopy = 0;
    var FilterShowhideShwingData = false;
    var AfterSearch = (_b = table === null || table === void 0 ? void 0 : table.getRowModel()) === null || _b === void 0 ? void 0 : _b.rows;
    React.useEffect(function () {
        if (columnFilters.length > 0 || globalFilter.length > 0) {
            if (AfterSearch != undefined && AfterSearch.length > 0) {
                AfterSearch === null || AfterSearch === void 0 ? void 0 : AfterSearch.map(function (Comp) {
                    var _a, _b, _c;
                    if (Comp.columnFilters.Title == true || Comp.columnFilters.PortfolioStructureID == true || Comp.columnFilters.ClientCategory == true || Comp.columnFilters.TeamLeaderUser == true || Comp.columnFilters.PercentComplete == true || Comp.columnFilters.ItemRank == true || Comp.columnFilters.DueDate == true) {
                        FilterShowhideShwingData = true;
                    }
                    if (Comp.original != undefined) {
                        if (((_a = Comp === null || Comp === void 0 ? void 0 : Comp.original) === null || _a === void 0 ? void 0 : _a.Item_x0020_Type) == "Component") {
                            ComponentCopy = ComponentCopy + 1;
                        }
                        if (((_b = Comp === null || Comp === void 0 ? void 0 : Comp.original) === null || _b === void 0 ? void 0 : _b.Item_x0020_Type) == "SubComponent") {
                            SubComponentCopy = SubComponentCopy + 1;
                        }
                        if (((_c = Comp === null || Comp === void 0 ? void 0 : Comp.original) === null || _c === void 0 ? void 0 : _c.Item_x0020_Type) == "Feature") {
                            FeatureCopy = FeatureCopy + 1;
                        }
                    }
                });
            }
            var ShowingData = { ComponentCopy: ComponentCopy, SubComponentCopy: SubComponentCopy, FeatureCopy: FeatureCopy, FilterShowhideShwingData: FilterShowhideShwingData };
            callBackData(item, ShowingData);
        }
    }, [(_c = table === null || table === void 0 ? void 0 : table.getRowModel()) === null || _c === void 0 ? void 0 : _c.rows]);
    React.useEffect(function () {
        var _a, _b;
        if (AfterSearch != undefined && AfterSearch.length > 0) {
            portfolioTypeData === null || portfolioTypeData === void 0 ? void 0 : portfolioTypeData.filter(function (count) { count[count.Title + 'numberCopy'] = 0; });
            (_a = items === null || items === void 0 ? void 0 : items.taskTypeDataItem) === null || _a === void 0 ? void 0 : _a.filter(function (taskLevelcount) { taskLevelcount[taskLevelcount.Title + 'numberCopy'] = 0; });
            AfterSearch === null || AfterSearch === void 0 ? void 0 : AfterSearch.map(function (Comp) {
                var _a, _b;
                if (columnFilters.length > 0 || globalFilter.length > 0) {
                    isShowingDataAll = true;
                    portfolioTypeData === null || portfolioTypeData === void 0 ? void 0 : portfolioTypeData.map(function (type) {
                        var _a;
                        if (((_a = Comp === null || Comp === void 0 ? void 0 : Comp.original) === null || _a === void 0 ? void 0 : _a.Item_x0020_Type) === type.Title) {
                            type[type.Title + 'numberCopy'] += 1;
                            type.FilterShowhideShwingData = true;
                        }
                    });
                    (_a = items === null || items === void 0 ? void 0 : items.taskTypeDataItem) === null || _a === void 0 ? void 0 : _a.map(function (taskLevel) {
                        var _a, _b;
                        if (((_b = (_a = Comp === null || Comp === void 0 ? void 0 : Comp.original) === null || _a === void 0 ? void 0 : _a.TaskType) === null || _b === void 0 ? void 0 : _b.Title) === taskLevel.Title) {
                            taskLevel[taskLevel.Title + 'numberCopy'] += 1;
                            taskLevel.FilterShowhideShwingData = true;
                        }
                    });
                }
                else {
                    isShowingDataAll = false;
                    portfolioTypeData === null || portfolioTypeData === void 0 ? void 0 : portfolioTypeData.map(function (type) {
                        if (type.Title + 'numberCopy' != undefined) {
                            type[type.Title + 'numberCopy'] = 0;
                            type.FilterShowhideShwingData = false;
                        }
                    });
                    (_b = items === null || items === void 0 ? void 0 : items.taskTypeDataItem) === null || _b === void 0 ? void 0 : _b.map(function (taskLevel) {
                        if (taskLevel.Title + 'numberCopy' != undefined) {
                            taskLevel[taskLevel.Title + 'numberCopy'] = 0;
                            taskLevel.FilterShowhideShwingData = false;
                        }
                    });
                }
            });
        }
        else {
            portfolioTypeData === null || portfolioTypeData === void 0 ? void 0 : portfolioTypeData.filter(function (count) { count[count.Title + 'numberCopy'] = 0; });
            (_b = items === null || items === void 0 ? void 0 : items.taskTypeDataItem) === null || _b === void 0 ? void 0 : _b.filter(function (taskLevelcount) { taskLevelcount[taskLevelcount.Title + 'numberCopy'] = 0; });
            isShowingDataAll = true;
        }
    }, [(_d = table === null || table === void 0 ? void 0 : table.getRowModel()) === null || _d === void 0 ? void 0 : _d.rows]);
    var CheckDataPrepre = function () {
        var _a, _b, _c, _d;
        var itrm;
        var parentData;
        var parentDataCopy;
        if (usedFor == "SiteComposition" || (items === null || items === void 0 ? void 0 : items.multiSelect) === true) {
            var finalData = (_a = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _a === void 0 ? void 0 : _a.flatRows;
            callBackData(finalData);
        }
        else {
            if (((_b = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _b === void 0 ? void 0 : _b.flatRows.length) > 0) {
                restructureFunct(true);
                (_d = (_c = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _c === void 0 ? void 0 : _c.flatRows) === null || _d === void 0 ? void 0 : _d.map(function (elem) {
                    var _a;
                    if ((elem === null || elem === void 0 ? void 0 : elem.getParentRows()) != undefined) {
                        // parentData = elem?.parentRow;
                        // parentDataCopy = elem?.parentRow?.original
                        parentDataCopy = (_a = elem === null || elem === void 0 ? void 0 : elem.getParentRows()[0]) === null || _a === void 0 ? void 0 : _a.original;
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
                        elem.original.parentDataId = parentDataCopy;
                    }
                    elem.original.Id = elem.original.ID;
                    item = elem.original;
                });
                callBackData(item);
            }
            else {
                restructureFunct(false);
                callBackData(item);
            }
            console.log("itrm", item);
        }
    };
    var ShowTeamFunc = function () {
        setShowTeamPopup(true);
    };
    var showTaskTeamCAllBack = React.useCallback(function () {
        setShowTeamPopup(false);
    }, []);
    var openTaskAndPortfolioMulti = function () {
        var _a, _b;
        (_b = (_a = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _a === void 0 ? void 0 : _a.flatRows) === null || _b === void 0 ? void 0 : _b.map(function (item) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var siteUrl = '';
            if (((_a = item === null || item === void 0 ? void 0 : item.original) === null || _a === void 0 ? void 0 : _a.siteUrl) != undefined) {
                siteUrl = (_b = item === null || item === void 0 ? void 0 : item.original) === null || _b === void 0 ? void 0 : _b.siteUrl;
            }
            else {
                siteUrl = (_c = items === null || items === void 0 ? void 0 : items.AllListId) === null || _c === void 0 ? void 0 : _c.siteUrl;
            }
            if (((_d = item === null || item === void 0 ? void 0 : item.original) === null || _d === void 0 ? void 0 : _d.siteType) === "Master Tasks") {
                window.open("".concat(siteUrl, "/SitePages/Portfolio-Profile.aspx?taskId=").concat((_e = item === null || item === void 0 ? void 0 : item.original) === null || _e === void 0 ? void 0 : _e.Id), '_blank');
            }
            else if (((_f = item === null || item === void 0 ? void 0 : item.original) === null || _f === void 0 ? void 0 : _f.siteType) === "Project") {
                window.open("".concat(siteUrl, "/SitePages/Project-Management.aspx?taskId=").concat((_g = item === null || item === void 0 ? void 0 : item.original) === null || _g === void 0 ? void 0 : _g.Id), '_blank');
            }
            else {
                window.open("".concat(siteUrl, "/SitePages/Task-Profile.aspx?taskId=").concat((_h = item === null || item === void 0 ? void 0 : item.original) === null || _h === void 0 ? void 0 : _h.Id, "&Site=").concat((_j = item === null || item === void 0 ? void 0 : item.original) === null || _j === void 0 ? void 0 : _j.siteType), '_blank');
            }
        });
    };
    // React.useEffect(() => {
    //     if (expendedTrue != true) {
    //         if (table.getState().columnFilters.length || table.getState()?.globalFilter?.length > 0) {
    //             setExpanded(true);
    //         } else {
    //             setExpanded({});
    //         }
    //     }
    // }, [table.getState().columnFilters, table.getState().globalFilter]);
    React.useEffect(function () {
        var _a, _b;
        if (expendedTrue != true) {
            if (table.getState().columnFilters.length || ((_b = (_a = table.getState()) === null || _a === void 0 ? void 0 : _a.globalFilter) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                var allKeys = Object.keys(table.getFilteredRowModel().rowsById).reduce(function (acc, cur) {
                    var _a;
                    if ((_a = table.getFilteredRowModel().rowsById[cur].subRows) === null || _a === void 0 ? void 0 : _a.length) {
                        acc[cur] = true;
                    }
                    return acc;
                }, {});
                setExpanded(allKeys);
            }
            else {
                setExpanded({});
            }
            forceExpanded = [];
        }
    }, [table.getState().columnFilters, table.getState().globalFilter]);
    React.useEffect(function () {
        if (expendedTrue === true) {
            setExpanded(true);
        }
        else {
            setExpanded({});
        }
    }, []);
    React.useEffect(function () {
        if (pageName === 'hierarchyPopperToolTip') {
            callBackDataToolTip(expanded);
        }
    }, [expanded]);
    // Print ANd Xls Parts//////
    var downloadPdf = function () {
        var doc = new jsPDF({ orientation: 'landscape' });
        autoTable(doc, {
            html: '#my-table'
        });
        doc.save('Data PrintOut');
    };
    // Export To Excel////////
    var exportToExcel = function () {
        var flattenedData = [];
        var flattenRowData = function (row) {
            var flattenedRow = {};
            columns.forEach(function (column) {
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
        var worksheet = XLSX.utils.aoa_to_sheet([]);
        XLSX.utils.sheet_add_json(worksheet, flattenedData, {
            skipHeader: false,
            origin: "A1",
        });
        var maxLength = 32767;
        var sheetRange = XLSX.utils.decode_range(worksheet["!ref"]);
        var _loop_2 = function (R) {
            var _loop_3 = function (C) {
                var cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                var cell = worksheet[cellAddress];
                if (cell && cell.t === "s" && cell.v.length > maxLength) {
                    var chunks_1 = [];
                    var text = cell.v;
                    while (text.length > maxLength) {
                        chunks_1.push(text.slice(0, maxLength));
                        text = text.slice(maxLength);
                    }
                    chunks_1.push(text);
                    cell.v = chunks_1.shift();
                    chunks_1.forEach(function (chunk) {
                        var newCellAddress = XLSX.utils.encode_cell({
                            r: R + chunks_1.length,
                            c: C,
                        });
                        worksheet[newCellAddress] = { t: "s", v: chunk };
                    });
                }
            };
            for (var C = sheetRange.s.c; C <= sheetRange.e.c; ++C) {
                _loop_3(C);
            }
        };
        for (var R = sheetRange.s.r; R <= sheetRange.e.r; ++R) {
            _loop_2(R);
        }
        var workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        var excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        var excelData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        // if (typeof saveAs === "function") {
        //     saveAs(excelData, "table.xlsx");
        // } else {
        //     const downloadLink = document.createElement("a");
        //     downloadLink.href = URL.createObjectURL(excelData);
        //     downloadLink.download = "table.xlsx";
        //     downloadLink.click();
        // }
    };
    ////Export to excel end/////
    var expndpopup = function (e) {
        settablecontiner(e);
    };
    var openCreationAllStructure = function (eventValue) {
        if (eventValue === "Add Structure") {
            items === null || items === void 0 ? void 0 : items.OpenAddStructureModal();
        }
        else if (eventValue === "Add Activity-Task") {
            items === null || items === void 0 ? void 0 : items.addActivity();
        }
        else if (eventValue === "Add Workstream-Task") {
            items === null || items === void 0 ? void 0 : items.AddWorkstreamTask();
        }
    };
    ///////////////// code with neha /////////////////////
    var callChildFunction = function (items) {
        if (childRef.current) {
            childRef.current.OpenModal(items);
        }
    };
    var trueTopIcon = function (items) {
        if (childRef.current) {
            childRef.current.trueTopIcon(items);
        }
    };
    React.useImperativeHandle(ref, function () { return ({
        callChildFunction: callChildFunction,
        trueTopIcon: trueTopIcon,
        setRowSelection: setRowSelection,
        globalFilter: globalFilter
    }); });
    var restructureFunct = function (items) {
        setTrueRestructuring(items);
    };
    ////////////////  end /////////////////
    return (React.createElement(React.Fragment, null,
        showHeader === true && React.createElement("div", { className: 'tbl-headings justify-content-between mb-1 fixed-Header top-0', style: { background: '#e9e9e9' } },
            React.createElement("span", { className: 'leftsec' },
                showingAllPortFolioCount === true ? React.createElement("div", { className: 'mb-1' },
                    React.createElement("label", { style: { color: "".concat(portfolioColor) } }, "Showing"),
                    portfolioTypeData.map(function (type, index) {
                        return (React.createElement(React.Fragment, null, isShowingDataAll === true ? React.createElement(React.Fragment, null,
                            React.createElement("label", { className: 'ms-1', style: { color: "".concat(portfolioColor) } }, " ".concat(type[type.Title + 'numberCopy'], " "),
                                " of ",
                                " ",
                                " "),
                            " ",
                            React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-0' }, " ".concat(type[type.Title + 'number'], " ")),
                            React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-1' },
                                " ",
                                " ",
                                type.Title),
                            index < type.length - 1 && React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: "ms-1" }, " | ")) :
                            React.createElement(React.Fragment, null,
                                React.createElement("label", { className: 'ms-1', style: { color: "".concat(portfolioColor) } }, " ".concat(type[type.Title + 'filterNumber'], " "),
                                    " of ",
                                    " ",
                                    " "),
                                " ",
                                React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-0' }, " ".concat(type[type.Title + 'number'], " ")),
                                React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-1' },
                                    " ",
                                    " ",
                                    type.Title),
                                index < type.length - 1 && React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: "ms-1" }, " | "))));
                    }),
                    React.createElement("span", { className: "popover__wrapper ms-1", style: { position: "unset" }, "data-bs-toggle": "tooltip", "data-bs-placement": "auto" },
                        React.createElement("span", { className: 'svg__iconbox svg__icon--info alignIcon dark' }),
                        React.createElement("span", { className: "popover__content mt-3 m-3 mx-3", style: { zIndex: 100 } },
                            React.createElement("label", { style: { color: "".concat(portfolioColor) } }, "Showing"),
                            portfolioTypeData.map(function (type, index) {
                                return (React.createElement(React.Fragment, null, isShowingDataAll === true ? React.createElement(React.Fragment, null,
                                    React.createElement("label", { className: 'ms-1', style: { color: "".concat(portfolioColor) } }, " ".concat(type[type.Title + 'numberCopy'], " "),
                                        " of ",
                                        " ",
                                        " "),
                                    " ",
                                    React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-0' }, " ".concat(type[type.Title + 'number'], " ")),
                                    React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-1' },
                                        " ",
                                        " ",
                                        type.Title),
                                    React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: "ms-1" }, " | ")) :
                                    React.createElement(React.Fragment, null,
                                        React.createElement("label", { className: 'ms-1', style: { color: "".concat(portfolioColor) } }, " ".concat(type[type.Title + 'filterNumber'], " "),
                                            " of ",
                                            " ",
                                            " "),
                                        " ",
                                        React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-0' }, " ".concat(type[type.Title + 'number'], " ")),
                                        React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-1' },
                                            " ",
                                            " ",
                                            type.Title),
                                        React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: "ms-1" }, " | "))));
                            }), (_e = items === null || items === void 0 ? void 0 : items.taskTypeDataItem) === null || _e === void 0 ? void 0 :
                            _e.map(function (type, index) {
                                var _a, _b;
                                return (React.createElement(React.Fragment, null, isShowingDataAll === true ? React.createElement(React.Fragment, null,
                                    React.createElement("label", { className: 'ms-1', style: { color: "".concat(portfolioColor) } }, " ".concat(type[type.Title + 'numberCopy'], " "),
                                        " of ",
                                        " ",
                                        " "),
                                    " ",
                                    React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-0' }, " ".concat(type[type.Title + 'number'], " ")),
                                    React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-1' },
                                        " ",
                                        " ",
                                        type.Title),
                                    index < ((_a = items === null || items === void 0 ? void 0 : items.taskTypeDataItem) === null || _a === void 0 ? void 0 : _a.length) - 1 && React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: "ms-1" }, " | ")) :
                                    React.createElement(React.Fragment, null,
                                        React.createElement("label", { className: 'ms-1', style: { color: "".concat(portfolioColor) } }, " ".concat(type[type.Title + 'filterNumber'], " "),
                                            " of ",
                                            " ",
                                            " "),
                                        " ",
                                        React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-0' }, " ".concat(type[type.Title + 'number'], " ")),
                                        React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: 'ms-1' },
                                            " ",
                                            " ",
                                            type.Title),
                                        index < ((_b = items === null || items === void 0 ? void 0 : items.taskTypeDataItem) === null || _b === void 0 ? void 0 : _b.length) - 1 && React.createElement("label", { style: { color: "".concat(portfolioColor) }, className: "ms-1" }, " | "))));
                            })))) :
                    React.createElement("span", { style: { color: "".concat(portfolioColor) }, className: 'Header-Showing-Items' }, "Showing ".concat((_g = (_f = table === null || table === void 0 ? void 0 : table.getFilteredRowModel()) === null || _f === void 0 ? void 0 : _f.rows) === null || _g === void 0 ? void 0 : _g.length, " of ").concat(data === null || data === void 0 ? void 0 : data.length)),
                React.createElement(DebouncedInput, { value: globalFilter !== null && globalFilter !== void 0 ? globalFilter : "", onChange: function (value) { return setGlobalFilter(String(value)); }, placeholder: "Search All...", portfolioColor: portfolioColor }),
                React.createElement("span", { className: "svg__iconbox svg__icon--setting", style: { backgroundColor: "".concat(portfolioColor) }, onClick: function () { return setSelectedFilterPanelIsOpen(true); } }),
                React.createElement("span", { className: 'ms-1' },
                    React.createElement("select", { style: { height: "30px", color: "".concat(portfolioColor) }, className: "w80", "aria-label": "Default select example", value: globalSearchType, onChange: function (e) {
                            setGlobalSearchType(e.target.value);
                            setGlobalFilter("");
                        } },
                        React.createElement("option", { value: "ALL" }, "All Words"),
                        React.createElement("option", { value: "ANY" }, "Any Words"),
                        React.createElement("option", { value: "EXACT" }, "Exact Phrase")))),
            React.createElement("span", { className: "toolbox" },
                items.taskProfile != true && (items === null || items === void 0 ? void 0 : items.showCreationAllButton) === true && React.createElement(React.Fragment, null,
                    ((_j = (_h = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _h === void 0 ? void 0 : _h.flatRows) === null || _j === void 0 ? void 0 : _j.length) === 1 && ((_m = (_l = (_k = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _k === void 0 ? void 0 : _k.flatRows[0]) === null || _l === void 0 ? void 0 : _l.original) === null || _m === void 0 ? void 0 : _m.Item_x0020_Type) != "Feature" &&
                        ((_r = (_q = (_p = (_o = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _o === void 0 ? void 0 : _o.flatRows[0]) === null || _p === void 0 ? void 0 : _p.original) === null || _q === void 0 ? void 0 : _q.SharewebTaskType) === null || _r === void 0 ? void 0 : _r.Title) != "Activities" && ((_v = (_u = (_t = (_s = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _s === void 0 ? void 0 : _s.flatRows[0]) === null || _t === void 0 ? void 0 : _t.original) === null || _u === void 0 ? void 0 : _u.SharewebTaskType) === null || _v === void 0 ? void 0 : _v.Title) != "Workstream" &&
                        ((_z = (_y = (_x = (_w = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _w === void 0 ? void 0 : _w.flatRows[0]) === null || _x === void 0 ? void 0 : _x.original) === null || _y === void 0 ? void 0 : _y.SharewebTaskType) === null || _z === void 0 ? void 0 : _z.Title) != "Task" || ((_1 = (_0 = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _0 === void 0 ? void 0 : _0.flatRows) === null || _1 === void 0 ? void 0 : _1.length) === 0 ? (React.createElement("button", { type: "button", className: "btn btn-primary", style: { backgroundColor: "".concat(portfolioColor), borderColor: "".concat(portfolioColor), color: '#fff' }, title: " Add Structure", onClick: function () { return openCreationAllStructure("Add Structure"); } }, " Add Structure ")) : (React.createElement("button", { type: "button", disabled: true, className: "btn btn-primary", style: { backgroundColor: "".concat(portfolioColor), borderColor: "".concat(portfolioColor), color: '#fff' }, title: " Add Structure" }, " Add Structure ")),
                    (items === null || items === void 0 ? void 0 : items.protfolioProfileButton) != true && React.createElement(React.Fragment, null, ((_2 = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _2 === void 0 ? void 0 : _2.flatRows.length) === 1 ? React.createElement("button", { type: "button", className: "btn btn-primary", title: 'Add Activity', style: { backgroundColor: "".concat(portfolioColor), borderColor: "".concat(portfolioColor), color: '#fff' }, onClick: function () { return openCreationAllStructure("Add Activity-Task"); } }, "Add Activity-Task") :
                        React.createElement("button", { type: "button", className: "btn btn-primary", style: { backgroundColor: "".concat(portfolioColor), borderColor: "".concat(portfolioColor), color: '#fff' }, disabled: true }, " Add Activity-Task")),
                    (items === null || items === void 0 ? void 0 : items.protfolioProfileButton) === true && React.createElement(React.Fragment, null, (items === null || items === void 0 ? void 0 : items.protfolioProfileButton) === true && ((_6 = (_5 = (_4 = (_3 = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _3 === void 0 ? void 0 : _3.flatRows[0]) === null || _4 === void 0 ? void 0 : _4.original) === null || _5 === void 0 ? void 0 : _5.SharewebTaskType) === null || _6 === void 0 ? void 0 : _6.Title) != "Task" ? React.createElement("button", { type: "button", className: "btn btn-primary", title: 'Add Activity', style: { backgroundColor: "".concat(portfolioColor), borderColor: "".concat(portfolioColor), color: '#fff' }, onClick: function () { return openCreationAllStructure("Add Activity-Task"); } }, "Add Activity-Task") :
                        React.createElement("button", { type: "button", className: "btn btn-primary", style: { backgroundColor: "".concat(portfolioColor), borderColor: "".concat(portfolioColor), color: '#fff' }, disabled: true }, " Add Activity-Task"))),
                items.taskProfile === true && (items === null || items === void 0 ? void 0 : items.showCreationAllButton) === true && React.createElement(React.Fragment, null, ((_7 = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _7 === void 0 ? void 0 : _7.flatRows.length) < 2 ? React.createElement("button", { type: "button", className: "btn btn-primary", title: 'Add Activity', style: { backgroundColor: "".concat(portfolioColor), borderColor: "".concat(portfolioColor), color: '#fff' }, onClick: function () { return openCreationAllStructure("Add Workstream-Task"); } }, "Add Workstream-Task") :
                    React.createElement("button", { type: "button", className: "btn btn-primary", style: { backgroundColor: "".concat(portfolioColor), borderColor: "".concat(portfolioColor), color: '#fff' }, disabled: true }, " Add Workstream-Task")),
                ((_9 = (_8 = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _8 === void 0 ? void 0 : _8.flatRows) === null || _9 === void 0 ? void 0 : _9.length) > 0 ? React.createElement("a", { className: "teamIcon", onClick: function () { return ShowTeamFunc(); } },
                    React.createElement("span", { title: "Create Teams Group", style: { color: "".concat(portfolioColor), backgroundColor: "".concat(portfolioColor) }, className: "svg__iconbox svg__icon--team" }))
                    : React.createElement("a", { className: "teamIcon" },
                        React.createElement("span", { title: "Create Teams Group", style: { backgroundColor: "gray" }, className: "svg__iconbox svg__icon--team" })),
                ((_11 = (_10 = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _10 === void 0 ? void 0 : _10.flatRows) === null || _11 === void 0 ? void 0 : _11.length) > 0 ?
                    React.createElement("a", { onClick: function () { return openTaskAndPortfolioMulti(); }, title: 'Open in new tab', className: "openWebIcon p-0" },
                        React.createElement("span", { style: { color: "".concat(portfolioColor), backgroundColor: "".concat(portfolioColor) }, className: "svg__iconbox svg__icon--openWeb" }))
                    : React.createElement("a", { className: "openWebIcon p-0", title: 'Open in new tab' },
                        React.createElement("span", { className: "svg__iconbox svg__icon--openWeb", style: { backgroundColor: "gray" } })),
                React.createElement("a", { className: 'brush' },
                    React.createElement("i", { className: "fa fa-paint-brush hreflink", style: { color: "".concat(portfolioColor) }, "aria-hidden": "true", title: "Clear All", onClick: function () { setGlobalFilter(''); setColumnFilters([]); } })),
                React.createElement("a", { className: 'Prints', onClick: function () { return downloadPdf(); } },
                    React.createElement("i", { className: "fa fa-print", "aria-hidden": "true", style: { color: "".concat(portfolioColor) }, title: "Print" })),
                expandIcon === true && React.createElement("a", { className: "expand", title: "Expand table section", style: { color: "".concat(portfolioColor) } }))),
        React.createElement("table", { className: "SortingTable table table-hover mb-0", id: 'my-table', style: { width: "100%" } },
            React.createElement("thead", { className: showHeader === true ? 'fixedSmart-Header top-0' : 'fixed-Header top-0' }, table.getHeaderGroups().map(function (headerGroup) { return (React.createElement("tr", { key: headerGroup.id }, headerGroup.headers.map(function (header) {
                var _a;
                return (React.createElement("th", { key: header.id, colSpan: header.colSpan, style: header.column.columnDef.size != undefined && header.column.columnDef.size != 150 ? { width: header.column.columnDef.size + "px" } : {} }, header.isPlaceholder ? null : (React.createElement("div", { className: 'position-relative', style: { display: "flex" } },
                    flexRender(header.column.columnDef.header, header.getContext()),
                    header.column.getCanFilter() ? (
                    // <span>
                    React.createElement(Filter, { column: header.column, table: table, placeholder: header.column.columnDef })
                    // </span>
                    ) : null,
                    header.column.getCanSort() ? React.createElement("div", __assign({}, {
                        className: header.column.getCanSort()
                            ? "cursor-pointer select-none shorticon"
                            : "",
                        onClick: header.column.getToggleSortingHandler(),
                    }), header.column.getIsSorted()
                        ? (_a = { asc: React.createElement(FaSortDown, { style: { color: "".concat(portfolioColor) } }), desc: React.createElement(FaSortUp, { style: { color: "".concat(portfolioColor) } }) }[header.column.getIsSorted()]) !== null && _a !== void 0 ? _a : null
                        : React.createElement(FaSort, { style: { color: "gray" } })) : ""))));
            }))); })),
            React.createElement("tbody", null, (_13 = (_12 = table === null || table === void 0 ? void 0 : table.getRowModel()) === null || _12 === void 0 ? void 0 : _12.rows) === null || _13 === void 0 ? void 0 : _13.map(function (row) {
                var _a;
                return (React.createElement("tr", { className: (_a = row === null || row === void 0 ? void 0 : row.original) === null || _a === void 0 ? void 0 : _a.lableColor, key: row.id }, row.getVisibleCells().map(function (cell) {
                    var _a, _b, _c, _d, _e;
                    return (React.createElement("td", { className: (_a = row === null || row === void 0 ? void 0 : row.original) === null || _a === void 0 ? void 0 : _a.boldRow, key: cell.id, style: ((_b = row === null || row === void 0 ? void 0 : row.original) === null || _b === void 0 ? void 0 : _b.fontColorTask) != undefined ? { color: "".concat((_c = row === null || row === void 0 ? void 0 : row.original) === null || _c === void 0 ? void 0 : _c.fontColorTask) } : { color: "".concat((_e = (_d = row === null || row === void 0 ? void 0 : row.original) === null || _d === void 0 ? void 0 : _d.PortfolioType) === null || _e === void 0 ? void 0 : _e.Color) } }, flexRender(cell.column.columnDef.cell, cell.getContext())));
                })));
            }))),
        showPagination === true && ((_15 = (_14 = table === null || table === void 0 ? void 0 : table.getFilteredRowModel()) === null || _14 === void 0 ? void 0 : _14.rows) === null || _15 === void 0 ? void 0 : _15.length) > table.getState().pagination.pageSize ? React.createElement("div", { className: "d-flex gap-2 items-center mb-3 mx-2" },
            React.createElement("button", { className: "border rounded p-1", onClick: function () { return table.setPageIndex(0); }, disabled: !table.getCanPreviousPage() },
                React.createElement(FaAngleDoubleLeft, null)),
            React.createElement("button", { className: "border rounded p-1", onClick: function () { return table.previousPage(); }, disabled: !table.getCanPreviousPage() },
                React.createElement(FaChevronLeft, null)),
            React.createElement("span", { className: "flex items-center gap-1" },
                React.createElement("div", null, "Page"),
                React.createElement("strong", null,
                    table.getState().pagination.pageIndex + 1,
                    " of",
                    ' ',
                    table.getPageCount())),
            React.createElement("button", { className: "border rounded p-1", onClick: function () { return table.nextPage(); }, disabled: !table.getCanNextPage() },
                React.createElement(FaChevronRight, null)),
            React.createElement("button", { className: "border rounded p-1", onClick: function () { return table.setPageIndex(table.getPageCount() - 1); }, disabled: !table.getCanNextPage() },
                React.createElement(FaAngleDoubleRight, null)),
            React.createElement("select", { className: 'w-25', value: table.getState().pagination.pageSize, onChange: function (e) {
                    table.setPageSize(Number(e.target.value));
                } }, [20, 30, 40, 50, 60, 100, 150, 200].map(function (pageSize) { return (React.createElement("option", { key: pageSize, value: pageSize },
                "Show ",
                pageSize)); }))) : ''));
};
export default React.forwardRef(GlobalCommanTable);
//# sourceMappingURL=GlobalCommanTable.js.map