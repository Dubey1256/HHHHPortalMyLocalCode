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
import * as React from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getExpandedRowModel, flexRender, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { FaSearch, FaSort, FaSortDown, FaSortUp, FaChevronRight, FaChevronLeft, FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";
import saveAs from "file-saver";
import { RiFileExcel2Fill } from 'react-icons/ri';
import ShowTeamMembers from '../ShowTeamMember';
import Tooltip from '../Tooltip';
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
    var initialValue = _a.value, onChange = _a.onChange, _b = _a.debounce, debounce = _b === void 0 ? 500 : _b, props = __rest(_a, ["value", "onChange", "debounce"]);
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
                React.createElement(FaSearch, null)),
            React.createElement("input", __assign({ type: "search", id: "search" }, props, { value: value, onChange: function (e) { return setValue(e.target.value); } })))));
}
export function Filter(_a) {
    var column = _a.column, table = _a.table, placeholder = _a.placeholder;
    var columnFilterValue = column.getFilterValue();
    // style={{ width: placeholder?.size }}
    return (React.createElement("input", { style: { width: "100%" }, className: "me-1 mb-1 mx-1 on-search-cross", 
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
    return (React.createElement("input", __assign({ type: "checkbox", ref: ref, className: className + " cursor-pointer form-check-input " }, rest)));
}
// ReactTable Part end/////
var GlobalCommanTable = function (items) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var expendedTrue = items === null || items === void 0 ? void 0 : items.expendedTrue;
    var data = items === null || items === void 0 ? void 0 : items.data;
    var columns = items === null || items === void 0 ? void 0 : items.columns;
    var callBackData = items === null || items === void 0 ? void 0 : items.callBackData;
    var callBackDataToolTip = items === null || items === void 0 ? void 0 : items.callBackDataToolTip;
    var pageName = items === null || items === void 0 ? void 0 : items.pageName;
    var siteUrl = '';
    var showHeader = items === null || items === void 0 ? void 0 : items.showHeader;
    var showDateTime = items === null || items === void 0 ? void 0 : items.showDateTime;
    var showPagination = items === null || items === void 0 ? void 0 : items.showPagination;
    var usedFor = items === null || items === void 0 ? void 0 : items.usedFor;
    var _p = React.useState([]), columnFilters = _p[0], setColumnFilters = _p[1];
    var _q = React.useState([]), sorting = _q[0], setSorting = _q[1];
    var _r = React.useState({}), expanded = _r[0], setExpanded = _r[1];
    var _s = React.useState({}), rowSelection = _s[0], setRowSelection = _s[1];
    var _t = React.useState(""), globalFilter = _t[0], setGlobalFilter = _t[1];
    var _u = React.useState(false), ShowTeamPopup = _u[0], setShowTeamPopup = _u[1];
    var _v = React.useState(false), showTeamMemberOnCheck = _v[0], setShowTeamMemberOnCheck = _v[1];
    var table = useReactTable({
        data: data,
        columns: columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            globalFilter: globalFilter,
            columnFilters: columnFilters,
            expanded: expanded,
            sorting: sorting,
            rowSelection: rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onExpandedChange: setExpanded,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
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
    React.useEffect(function () {
        CheckDataPrepre();
    }, [(_a = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _a === void 0 ? void 0 : _a.flatRows.length]);
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
    }, [(_c = table === null || table === void 0 ? void 0 : table.getRowModel()) === null || _c === void 0 ? void 0 : _c.rows]);
    var CheckDataPrepre = function () {
        var _a, _b, _c, _d;
        if (usedFor == "SiteComposition") {
            var finalData = (_a = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _a === void 0 ? void 0 : _a.flatRows;
            callBackData(finalData);
        }
        else {
            if (((_b = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _b === void 0 ? void 0 : _b.flatRows.length) > 0) {
                (_d = (_c = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _c === void 0 ? void 0 : _c.flatRows) === null || _d === void 0 ? void 0 : _d.map(function (elem) {
                    elem.original.Id = elem.original.ID;
                    item = elem.original;
                });
                callBackData(item);
            }
            else {
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
    React.useEffect(function () {
        if (expendedTrue === false) {
            if (table.getState().columnFilters.length) {
                setExpanded(true);
            }
            else {
                setExpanded({});
            }
        }
    }, [table.getState().columnFilters]);
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
        var _loop_1 = function (R) {
            var _loop_2 = function (C) {
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
                _loop_2(C);
            }
        };
        for (var R = sheetRange.s.r; R <= sheetRange.e.r; ++R) {
            _loop_1(R);
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
        if (typeof saveAs === "function") {
            saveAs(excelData, "table.xlsx");
        }
        else {
            var downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(excelData);
            downloadLink.download = "table.xlsx";
            downloadLink.click();
        }
    };
    ////Export to excel end/////
    return (React.createElement(React.Fragment, null,
        showHeader === true && React.createElement("div", { className: 'tbl-headings justify-content-between mb-1' },
            React.createElement("span", { className: 'leftsec' },
                React.createElement("span", { className: 'Header-Showing-Items' }, "Showing ".concat((_e = (_d = table === null || table === void 0 ? void 0 : table.getFilteredRowModel()) === null || _d === void 0 ? void 0 : _d.rows) === null || _e === void 0 ? void 0 : _e.length, " out of ").concat(data === null || data === void 0 ? void 0 : data.length)),
                showDateTime &&
                    React.createElement("span", { className: 'Header-Showing-Items' }, showDateTime),
                React.createElement(DebouncedInput, { value: globalFilter !== null && globalFilter !== void 0 ? globalFilter : "", onChange: function (value) { return setGlobalFilter(String(value)); }, placeholder: "Search All..." })),
            React.createElement("span", { className: "toolbox" },
                showTeamMemberOnCheck === true ? React.createElement("span", null,
                    React.createElement("a", { className: "teamIcon", onClick: function () { return ShowTeamFunc(); } },
                        React.createElement("span", { title: "Create Teams Group", className: "svg__iconbox svg__icon--team teamIcon" }))) : React.createElement("span", null,
                    React.createElement("a", { className: "teamIcon" },
                        React.createElement("span", { title: "Create Teams Group", style: { backgroundColor: "gray" }, className: "svg__iconbox svg__icon--team teamIcon" }))),
                ((_g = (_f = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _f === void 0 ? void 0 : _f.rows) === null || _g === void 0 ? void 0 : _g.length) > 0 ? React.createElement("span", null,
                    React.createElement("a", { onClick: function () { return openTaskAndPortfolioMulti(); }, className: "openWebIcon", title: 'Web Page' },
                        React.createElement("span", { className: "svg__iconbox svg__icon--openWeb" }))) : React.createElement("span", null,
                    React.createElement("a", { className: "openWebIcon" },
                        React.createElement("span", { className: "svg__iconbox svg__icon--openWeb", style: { backgroundColor: "gray" } }))),
                React.createElement("a", { className: 'excal', title: 'Export To Excel', onClick: function () { return exportToExcel(); } },
                    React.createElement(RiFileExcel2Fill, null)),
                React.createElement("a", { className: 'brush', title: "Clear All" },
                    React.createElement("i", { className: "fa fa-paint-brush hreflink", "aria-hidden": "true", title: "Clear All", onClick: function () { setGlobalFilter(''); setColumnFilters([]); } })),
                React.createElement("a", { className: 'Prints', title: "Print", onClick: function () { return downloadPdf(); } },
                    React.createElement("i", { className: "fa fa-print", "aria-hidden": "true", title: "Print" })),
                React.createElement("a", null,
                    React.createElement(Tooltip, { ComponentId: "5756" })))),
        React.createElement("table", { className: "SortingTable table table-hover mb-0", id: 'my-table', style: { width: "100%" } },
            React.createElement("thead", { className: 'fixed-Header top-0' }, table.getHeaderGroups().map(function (headerGroup) { return (React.createElement("tr", { key: headerGroup.id }, headerGroup.headers.map(function (header) {
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
                        ? (_a = { asc: React.createElement(FaSortDown, null), desc: React.createElement(FaSortUp, null) }[header.column.getIsSorted()]) !== null && _a !== void 0 ? _a : null
                        : React.createElement(FaSort, null)) : ""))));
            }))); })),
            React.createElement("tbody", null, (_j = (_h = table === null || table === void 0 ? void 0 : table.getRowModel()) === null || _h === void 0 ? void 0 : _h.rows) === null || _j === void 0 ? void 0 : _j.map(function (row) {
                var _a, _b;
                return (React.createElement("tr", { className: pageName == 'ProjectOverviewGrouped' ? (row.original.Item_x0020_Type == "tasks" ? "a-bg" : "") : ((row === null || row === void 0 ? void 0 : row.getIsExpanded()) == true && row.original.Item_x0020_Type == "Component" ? "c-bg" : ((row === null || row === void 0 ? void 0 : row.getIsExpanded()) == true && row.original.Item_x0020_Type == "SubComponent" ? "s-bg" : ((row === null || row === void 0 ? void 0 : row.getIsExpanded()) == true && row.original.Item_x0020_Type == "Feature" ? "f-bg" : ((row === null || row === void 0 ? void 0 : row.getIsExpanded()) == true && ((_a = row.original.SharewebTaskType) === null || _a === void 0 ? void 0 : _a.Title) == "Activities" ? "a-bg" : ((row === null || row === void 0 ? void 0 : row.getIsExpanded()) == true && ((_b = row.original.SharewebTaskType) === null || _b === void 0 ? void 0 : _b.Title) == "Workstream" ? "w-bg" : ""))))), key: row.id }, row.getVisibleCells().map(function (cell) {
                    return (React.createElement("td", { key: cell.id }, flexRender(cell.column.columnDef.cell, cell.getContext())));
                })));
            }))),
        showPagination === true && ((_l = (_k = table === null || table === void 0 ? void 0 : table.getFilteredRowModel()) === null || _k === void 0 ? void 0 : _k.rows) === null || _l === void 0 ? void 0 : _l.length) > table.getState().pagination.pageSize ? React.createElement("div", { className: "d-flex gap-2 items-center mb-3 mx-2" },
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
                pageSize)); }))) : '',
        ShowTeamPopup === true && ((_m = items === null || items === void 0 ? void 0 : items.TaskUsers) === null || _m === void 0 ? void 0 : _m.length) > 0 ? React.createElement(ShowTeamMembers, { props: (_o = table === null || table === void 0 ? void 0 : table.getSelectedRowModel()) === null || _o === void 0 ? void 0 : _o.flatRows, callBack: showTaskTeamCAllBack, TaskUsers: items === null || items === void 0 ? void 0 : items.TaskUsers }) : ''));
};
export default GlobalCommanTable;
//# sourceMappingURL=GlobalCommanTable.js.map