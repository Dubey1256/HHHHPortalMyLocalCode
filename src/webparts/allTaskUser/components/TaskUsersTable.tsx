
import * as React from 'react'

import './index.css'

import {
  Column,
  Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  flexRender,
  //FilterFns,
} from '@tanstack/react-table';

import { Table as BTable } from 'react-bootstrap';

import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils';
import { Icon, Link, PrimaryButton } from '@fluentui/react';

import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';

interface ITaskUser {
  Title: string;
  Group: string;
  Category: string;
  Role: string;
  Company: string;
  Approver: string;
  TaskId: number;
}

interface ITableTaskUsersProps {
  TaskUsers: ITaskUser[];
  GetUser: (userName: string, taskId: number) => JSX.Element;
  AddTask: () => void;
  EditTask: (taskId: number) => void;
  DeleteTask: (taskId: number) => void;
}

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

function TableTaskUsers(props: ITableTaskUsersProps) {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [excelData, setExcelData] :any= React.useState([]);
  const [data, setData] = React.useState<ITaskUser[]>(() => props.TaskUsers);
  const refreshData = () => setData(props.TaskUsers);
  React.useEffect(() => refreshData(), [props.TaskUsers]);

 
  // const Columns = React.useMemo<ColumnDef<any, unknown>[]>(
  //   () => [
  //     {
  //       accessorKey: "",
  //       size: 7,
  //       canSort: true,
  //       placeholder: "",
  //       id: 'Id',
  //       cell: ({ row}) => (
  //         <div>
         
  //         {row?.original?.Item_x0020_Cover == undefined &&
  //             <div className="text-center title2_taskuser contact ng-binding"
  //                 title={row?.original?.Title}
  //                 ui-draggable="true"
  //                 on-drop-success="dropSuccessHandler($event, $index, group.childs">
  //                 {row?.original?.Suffix}
  //             </div>
  //         }
  //         {row?.original?.Item_x0020_Cover != undefined &&
  //             <img style={{ width: "28px" }}
  //                 title={row?.original?.Title} src={row?.original?.Item_x0020_Cover} />
  //         }
  //         </div>
  //       ),
  //     },
  //     {
  //       cell: ({ row }) => (
  //         <>
  //           <span className="hreflink">{row?.original?.Title}</span>
  //                  {row?.original?.Suffix != undefined &&
  //                      <span>({row?.original?.Suffix})</span>
  //                  }
  //         </>
  //       ),
  //       accessorKey: "Title",
  //       id: "Title",
  //       canSort: true,
  //       placeholder: "Search Name",
  //       header: "",
  //       size: 15,
  //     },
  //     {
  //       cell: ({ row }) => (
  //         <>
  //           <span >{row?.original?.usertitle}</span>
  //         </>
  //       ),
  //       accessorKey: "usertitle",
  //       id: "usertitle",
  //       canSort: true,
  //       placeholder: "Search",
  //       header: "",
  //       size: 5,
  //     },
  //     {
  //       cell: ({ row }) => (
  //         <>
  //           <span >{row?.original?.TimeCategory}</span>
  //         </>
  //       ),
  //       accessorKey: "TimeCategory",
  //       id: "TimeCategory",
  //       canSort: true,
  //       placeholder: "Search Category",
  //       header: "",
  //       size: 5,
  //     },
  //     {
  //       cell: ({ row }) => (
  //         <>
  //           <span >{row?.original?.SortOrder}</span>
  //         </>
  //       ),
  //       accessorKey: "SortOrder",
  //       id: "SortOrder",
  //       canSort: true,
  //       placeholder: "Sort",
  //       header: "",
  //       size: 5,
  //     },
  //     {
  //       cell: ({ row }) => (
  //         <>
  //           <span >{row?.original?.Userrole}</span>
  //         </>
  //       ),
  //       accessorKey: "Userrole",
  //       id: "Userrole",
  //       canSort: true,
  //       placeholder: "Search Roles",
  //       header: "",
  //       size: 5,
  //     },
  //     {
        
      
     

  //       cell: ({ row }) => (
  //         <>
  //           <span >{row?.original?.Company}</span>
  //         </>
  //       ),
  //       accessorKey: "Company",
  //       id: "Company",
  //       canSort: true,
  //       placeholder: "Company",
  //       header: "",
  //       size: 5,
  //     },
  //     {
  //       cell: ({ row }) => (
  //         <>
  //           <span >{row?.original?.UserManagerName}</span>
  //         </>
  //       ),
  //       accessorKey: "UserManagerName",
  //       id: "UserManagerName",
  //       canSort: true,
  //       placeholder: "Approver",
  //       header: "",
  //       size: 5,
  //     },
  //     {
  //       cell: ({ row }) => (
  //         <>
  //           <span ><a onClick={(e) => EditData(e, row?.original?.Id)}><FaEdit /></a></span>
  //         </>
  //       ),
       
  //       id: "Id",
  //       canSort: true,
  //       placeholder: "",
  //       header: "",
  //       size: 5,
  //     },
  //     {
  //       cell: ({ row }) => (
  //         <>
  //           <span ><a><FiDelete /></a></span>
  //         </>
  //       ),
       
  //       id: "Id",
  //       canSort: true,
  //       placeholder: "",
  //       header: "",
  //       size: 5,
  //     },
      
  //   ],
  //   [taskUser]
  // );
 
 
 
 
 
 
 
 
  const columns = React.useMemo<ColumnDef<ITaskUser, any>[]>(
    () => [
      {
        accessorKey: 'Title',
        header: "",
        placeholder: "Title",
        id: "Title",
        cell: info => props.GetUser(info.row.original.Title, info.row.original.TaskId),
        sortDescFirst: false
               
      },
      {
        
        accessorKey: "Group",
        header: "",
        id: "Group",
        placeholder: "Group"
      },
      {
        accessorKey: "Category",
        header: "",
        id:"Category",
        placeholder: "Category",
      },
      {
        accessorKey: "Role",
        header: "",
        id:"Role",
        placeholder: "Role",
      },
      {
        accessorKey: "Company",
        header: "",
        id:"Company",
        placeholder: "Company",
      },
      {
        accessorKey: "Approver",
        header: "",
        id:'Approver',
        placeholder: "Approver"
      },
      {
        id: "TaskId",
        accessorKey: "TaskId",
        header: null,
        cell: (info) => (<div style={{ width: "60px" }}>
          <Link href="#" onClick={() => props.EditTask(info.getValue())}><span className='svg__iconbox svg__icon--edit' title='Edit'></span></Link>
          <Link href="#" onClick={() => props.DeleteTask(info.getValue())}><span className='svg__iconbox svg__icon--trash' title='Trash'></span></Link>
        </div>),
        enableColumnFilter: false,
        enableSorting: false,
        minSize: 60
      }
    ],
    [data]
  )

  const callBackData = React.useCallback((elem: any, ShowingData: any) => {
       
  }, []);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'Title') {
      if (table.getState().sorting[0]?.id !== 'Title') {
        table.setSorting([{ id: 'Title', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  return (
 
    <div className="border ms-Grid">
      {/* <div style={{ display: "inline", width: "50%" }}>
        <PrimaryButton className='mb-1' text="Add Team Member" onClick={() => props.AddTask()} style={{ float: "right" }} />
      </div>
      <br />
      <div className="h-2"></div> */}
      <div className='tbl-button'>
     
        <span><PrimaryButton  text="Add Team Member" onClick={() => props.AddTask()} /></span>
      </div>


      { <GlobalCommanTable columns={columns} data={data} callBackData={callBackData}  showHeader={true}  />}

      {/* <div className="Alltable mt-10">
        <div className="col-sm-12 p-0 smart">
          <div className="wrapper">
            <table className="SortingTable table table-hover" style={{ width: "100%" }}>
              <thead className='fixed-Header top-0'>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <div className='position-relative mx-1 my-1' style={{ display: "flex"}}>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanFilter() ? (
                                <div>
                                  <Filter
                                    column={header.column}
                                    table={table}
                                    placeholder={header.column.columnDef}
                                  />
                                </div>
                              ) : null}
                              {
                                header.column.id == "TaskId" ? null :
                                  <div
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
                                  </div>
                              }
                            </div>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>

                {table?.getRowModel()?.rows?.map((row: any) => {
                  return (
                    <tr className={row?.getIsExpanded() == true && row.original.Item_x0020_Type == "Component" ? "c-bg" : (row?.getIsExpanded() == true && row.original.Item_x0020_Type == "SubComponent" ? "s-bg" : (row?.getIsExpanded() == true && row.original.Item_x0020_Type == "Feature" ? "f-bg" : (row?.getIsExpanded() == true && row.original.TaskType?.Title == "Activities" ? "a-bg" : (row?.getIsExpanded() == true && row.original.TaskType?.Title == "Workstream" ? "w-bg" : ""))))}
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
          </div>
        </div>
      </div> */}

      <div className="h-2" />
      {/* {data.length>10 && <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      } */}
      {/* <div>{table.getPrePaginationRowModel().rows.length} Rows</div> */}
      {/* {false && <><div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div> */}
      {/* <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div> */}
      {/* <pre>{JSON.stringify(table.getState(), null, 2)}</pre></>} */}
      {/* <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[ 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
    </div>
  
  )
}

function Filter({
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
    <input
      type="search"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`${placeholder?.placeholder}`}
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

export default TableTaskUsers;






