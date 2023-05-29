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
} from "@tanstack/react-table";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaSort, FaSortDown, FaSortUp, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { HTMLProps } from 'react';

// ReactTable Part/////
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

const GlobalCommanTable = ({ columns, data, callBackData }: any) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [expanded, setExpanded] = React.useState<ExpandedState>({});
    const [rowSelection, setRowSelection] = React.useState({});


    const table = useReactTable({
        data,
        columns,
        state: {
            expanded,
            sorting,
            rowSelection,
        },
        onSortingChange: setSorting,
        onExpandedChange: setExpanded,
        getSubRows: (row: any) => row.subRows,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
        filterFromLeafRows: true,
        enableSubRowSelection: false,
        filterFns: undefined
    });

    React.useEffect(() => {
        CheckDataPrepre()
    }, [table?.getSelectedRowModel()?.flatRows.length])
    let item: any;

    let ComponentCopy:any = 0;
    let SubComponentCopy :any = 0;
    let FeatureCopy:any = 0;
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
        let ShowingData={ComponentCopy:ComponentCopy,SubComponentCopy:SubComponentCopy,FeatureCopy:FeatureCopy,FilterShowhideShwingData:FilterShowhideShwingData}
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


    return (
        <>
            <table className="SortingTable table table-hover mb-0" style={{ width: "100%" }}>
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