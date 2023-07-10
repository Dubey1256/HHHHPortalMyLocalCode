import * as React from "react";

import "./index.css";

import {
  Column,
  Table,
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  //getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  FilterFn,
  SortingFn,
  sortingFns,
} from "@tanstack/react-table";

import {
    RankingInfo,
    rankItem,
    compareItems,
  } from '@tanstack/match-sorter-utils'
import { Button, Image } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { FaSort, FaSortDown, FaSortUp, FaAngleDown, FaAngleRight, } from "react-icons/fa";
import { ISmartMetadataItem } from "../ISmartMetadataItem";

declare module '@tanstack/table-core' {
    interface FilterFns {
      fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
      itemRank: RankingInfo
    }
  }
  
  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
  
    // Store the itemRank info
    addMeta({
      itemRank,
    })
  
    // Return if the item should be filtered in/out
    return itemRank.passed
  }
  
  const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0
  
    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
      dir = compareItems(
        rowA.columnFiltersMeta[columnId]?.itemRank!,
        rowB.columnFiltersMeta[columnId]?.itemRank!
      )
    }
  
    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
  }
  console.log(fuzzySort);

export default function TableSmartmetadata(props: any) {

  //const rerender = React.useReducer(() => ({}), {})[1];

  const [data, setData] = React.useState<ISmartMetadataItem[]>(() => props.Items);
  const refreshData = () => setData(props.Items);
  React.useEffect(() => refreshData(), [props.Items]);
  const [enableRestructure, setEnableRestructure] = React.useState(false);

  const columns = React.useMemo<ColumnDef<ISmartMetadataItem>[]>(
    () => [
      {
        accessorKey: "Title",
        placeholder: "Title",
        minSize: 300,
        header: ({ table }) => (
          <>                      
            <a
              {...{
                onClick: table.getToggleAllRowsExpandedHandler(),
              }}
            >
              {table.getIsAllRowsExpanded() ? <FaAngleDown /> : <FaAngleRight />}
            </a>{" "}
          </>
        ),
        cell: ({ row, getValue }) => (
          <div
            style={{
              // Since rows are flattened by default,
              // we can use the row.depth property
              // and paddingLeft to visually indicate the depth
              // of the row
              paddingLeft: `${row.depth * 2}rem`,
            }}
          >
            <>
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />{" "}
              {row.getCanExpand() ? (
                <a
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? <FaAngleDown /> : <FaAngleRight />}
                </a>
              ) : (
                ""
              )}{" "}
              {getValue()}
            </>
          </div>
        ),
      },
      {
        accessorKey: "SmartFilters",
        placeholder: "Smart Filters",
        cell: (info) => <div>{info.getValue()}</div>,
        header: ""
      },
      {
        accessorKey: "Status",
        placeholder: "Status",
        cell: (info) => info.getValue(),
        header: ""
      },
      {
        accessorKey: "SortOrder",
        placeholder: "Sort Order",
        id: "sortOrder",
        cell: (info) => info.getValue(),
        header: ""
      },
      {
        header: "",
        placeholder: "",
        id: "Restructure",
        accessorKey: "",
        cell: (info) => {
          if(enableRestructure && table.getSelectedRowModel().flatRows.map(i=>i.original.ID).indexOf(info.row.original.ID)==-1) {
            return <Icon.Tools color="#000066" size={18} className="align-center" title="Restructure" onClick={()=>props.ShowModalRestructureSmartMetadata(info.row.original,table.getSelectedRowModel().flatRows.map(item=>item.original))} />
          }
          return null;
        },
        enableGlobalFilter: false,
        enableMultiSort: false
      },
      {
        header: "",
        placeholder: "",
        id: "Edit",
        accessorKey: "",
        cell: (info) =><span  onClick={()=>props.ShowModalEditSmartMetadata(info.row.original,info.row.getParentRows().map(parentRow=>parentRow.original))} title="edit" className="svg__iconbox svg__icon--edit"></span>,
        enableColumnFilter: false,
        enableSorting: false
      },
      {
        header: "",
        placeholder: "",
        id: "Delete",
        accessorKey: "",
        cell: (info) =><span onClick={()=>props.ShowModalDeleteSmartMetadata(info.row.original,info.row.getParentRows().map(parentRow=>parentRow.original))} title="Delete" className="svg__iconbox svg__icon--trash"></span>,
        enableColumnFilter: false,
        enableSorting: false
      }      
    ],
    [data, enableRestructure]
  );

  
  //const refreshData = () => setData(() => makeData(10, 1, 1, 1, 1));

  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    filterFns: {
        fuzzy: fuzzyFilter,
    },
    state: {
      expanded,
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    globalFilterFn: fuzzyFilter,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    
    //getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    enableSubRowSelection: false
  });

  return (
    <div className="Alltable">
      {/* <div className="h-2" /> */}
      <div className="justify-content-between tbl-headings">         
        <span className="leftsec">
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            className="p-2 font-lg shadow border border-block"
            placeholder="Search all columns..."
          />
        </span>
        <span className="toolbox">          
          <Button 
            variant="primary"
            disabled={table.getSelectedRowModel().flatRows.length>1}
            onClick={()=>props.ShowModalAddSmartMetadata(table.getSelectedRowModel().flatRows.map(row=>row.original))} 
            style={{margin:"2px"}}
          >
            Add
            <Icon.Plus size={96} className="align-center" title="Add" />            
          </Button>
          <Button 
            variant="primary" 
            style={{margin:"2px"}} 
            disabled={table.getSelectedRowModel().flatRows.length!=2}
            onClick={()=>props.ShowModalCompareSmartMetadata(table.getSelectedRowModel().flatRows.map(row=>row.original))}
          >
            Compare
            <Image 
              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/CompareComponentIcon.png" 
              height={21}
              style={{padding:"2px"}}
            />         
          </Button>
          <Button 
            variant="primary" 
            style={{height:"34px",margin:"2px"}} 
            disabled={table.getSelectedRowModel().flatRows.length==0}
            onClick={()=>setEnableRestructure(true)}
          >
            Restructure           
          </Button>
        </span>
      </div>
      <div className="wrapper">
      <table className="SortingTable searchCrossIcon groupTable  table table-hover matadatatable" width={"100%"}>
        <thead className="fixed-Header">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan} style={{border:"none"}}>
                    {header.isPlaceholder ? null : (
                      <div className="position-relative" style={{ display: "flex" }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                     
                            <Filter
                              column={header.column}
                              table={table}
                              placeholder={header.column.columnDef}
                         
                            />
                       
                        ) : null}
                        {
                          (header.column.id=="Edit" || header.column.id=="Delete" || header.column.id=="Restructure") ? null :
                          (<div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer shorticon select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {header.column.getIsSorted()
                              ? { asc: <FaSortDown />, desc: <FaSortUp /> }[
                                  header.column.getIsSorted() as string
                                ] ?? null
                              : <FaSort />}
                          </div>)
                        }
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row: any) => {
            return (
              <>
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell: any) => {
                    return (
                      <>
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      </>
                    );
                  })}
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function Filter({
  column,
  table,
  placeholder,
}: {
  column: Column<any, any>;
  table: Table<any>;
  placeholder: any;
}) {
  const columnFilterValue = column.getFilterValue();
  console.log("column", placeholder.placeholder);
  return (
    <input
      style={placeholder.style}
      type="search" className="full-width me-1 mb-1"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`${placeholder.placeholder}`}
    />
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
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
      className={className + " cursor-pointer form-check-input"}
      {...rest}
    />
  );
}

// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)
  
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    React.useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)
  
      return () => clearTimeout(timeout)
    }, [value])
  
    return (
      <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
  }



