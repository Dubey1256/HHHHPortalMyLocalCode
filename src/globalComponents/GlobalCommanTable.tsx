import * as React from 'react';
import {
    Column,
    Table,
    ExpandedState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    ColumnDef,
    flexRender,
    getSortedRowModel,
    SortingState,
    FilterFn,
} from "@tanstack/react-table";
import { RankingInfo, rankItem, compareItems } from "@tanstack/match-sorter-utils";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaSort, FaSortDown, FaSortUp, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { HTMLProps } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { RiFileExcel2Fill } from 'react-icons/ri';

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
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
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
                <span className="icon"><FaSearch /></span>
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
    // style={{ width: placeholder?.size }}
    return (
        <input style={{ width: "100%" }} className="me-1 mb-1 mx-1 on-search-cross"
            // type="text"
            title={placeholder?.placeholder}
            type="search"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`${placeholder?.placeholder}`}
        // className="w-36 border shadow rounded"
        />
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
            className={className + " cursor-pointer"}
            {...rest}
        />
    );
}

// ReactTable Part end/////

const GlobalCommanTable = (items: any) => {
    let data = items?.data;
    let columns = items?.columns;
    let callBackData = items?.callBackData;
    let pageName = items?.pageName;
    let excelDatas = items?.excelDatas;
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [expanded, setExpanded] = React.useState<ExpandedState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");


    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            globalFilter,
            expanded,
            sorting,
            rowSelection,
        },
        onSortingChange: setSorting,
        onExpandedChange: setExpanded,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getSubRows: (row: any) => row.subRows,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
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
    }, [table?.getSelectedRowModel()?.flatRows.length])
    let item: any;

    let ComponentCopy: any = 0;
    let SubComponentCopy: any = 0;
    let FeatureCopy: any = 0;
    let FilterShowhideShwingData: any = false;
    let AfterSearch = table?.getRowModel()?.rows;
    React.useEffect(() => {
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
    }, [table?.getRowModel()?.rows])

    const CheckDataPrepre = () => {
        if (table?.getSelectedRowModel()?.flatRows.length > 0) {
            table?.getSelectedRowModel()?.flatRows?.map((elem: any) => {
                elem.original.Id = elem.original.ID
                item = elem.original;
            });
            callBackData(item)
        } else {
            callBackData(item)
        }
        console.log("itrm", item)
    }

    React.useEffect(() => {
        if (table.getState().columnFilters.length) {
            setExpanded(true);
        } else {
            setExpanded({});
        }
    }, [table.getState().columnFilters]);

    // Print ANd Xls Parts//////
    const downloadPdf = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        autoTable(doc, {
            html: '#my-table'
        })
        doc.save('Data PrintOut');
    }
    const downloadExcel = (csvData: any, fileName: any) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };


    return (
        <>
            <div className='tbl-headings '>
                <span className='leftsec'>
                    <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        placeholder="Search All..." />
                </span>
                <span className="toolbox mx-auto">
                   <a className='excal' onClick={() => downloadExcel(excelDatas, "Task-User-Management")}><RiFileExcel2Fill /></a>
                    
                        <a className='brush'><i className="fa fa-paint-brush hreflink" aria-hidden="true" title="Clear All"></i></a>
                   
                    
                        <a className='Prints' onClick={() => downloadPdf()}>
                            <i className="fa fa-print mr-5" aria-hidden="true" title="Print"></i>
                        </a>
                  
                </span>
            </div>

            <table className="SortingTable table table-hover" id='my-table' style={{ width: "100%" }}>
                <thead className='fixed-Header top-0'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan} style={{ width: header.column.columnDef.size + "%" }}>
                                        {header.isPlaceholder ? null : (
                                            <div className='position-relative' style={{ display: "flex" }}>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanFilter() ? (
                                                    // <span>
                                                    <Filter column={header.column} table={table} placeholder={header.column.columnDef} />
                                                    // </span>
                                                ) : null}
                                                {header.column.getCanSort() ? <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? "cursor-pointer select-none shorticon"
                                                            : "",
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {header.column.getIsSorted()
                                                        ? { asc: <FaSortDown />, desc: <FaSortUp /> }[
                                                        header.column.getIsSorted() as string
                                                        ] ?? null
                                                        : <FaSort />}
                                                </div> : ""}
                                            </div>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table?.getRowModel()?.rows?.map((row: any) => {
                        return (
                            <tr className={row?.getIsExpanded() == true && row.original.Item_x0020_Type == "Component" ? "c-bg" : (row?.getIsExpanded() == true && row.original.Item_x0020_Type == "SubComponent" ? "s-bg" : (row?.getIsExpanded() == true && row.original.Item_x0020_Type == "Feature" ? "f-bg" : (row?.getIsExpanded() == true && row.original.SharewebTaskType?.Title == "Activities" ? "a-bg" : (row?.getIsExpanded() == true && row.original.SharewebTaskType?.Title == "Workstream" ? "w-bg" : ""))))}
                                key={row.id}>
                                {row.getVisibleCells().map((cell: any) => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}

                </tbody>
            </table>
        </>
    )
}
export default GlobalCommanTable;