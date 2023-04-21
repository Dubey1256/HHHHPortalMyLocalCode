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
  getPaginationRowModel,
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

interface ITaskGroup {
  Title: string;
  SortOrder: string;
  TaskId: number;
}

interface ITableTaskUsersProps {
  TaskUsers: ITaskGroup[];
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

function TableTaskGroups(props: ITableTaskUsersProps) {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columns = React.useMemo<ColumnDef<ITaskGroup, any>[]>(
    () => [      
      {
        accessorKey: 'Title',
        id: "Title",
        header: "",
        placeholder: "Title",
        sortDescFirst: false
      },
      {
        accessorKey: "SortOrder",
        header: "",
        placeholder: "Sort Order"
      },
      {
        accessorKey: "TaskId",
        header: ()=><div>Edit/Delete</div>,
        cell: (info)=>(<div>
          <Link href="#" onClick={()=>props.EditTask(info.getValue())}><Icon iconName="Edit" style={{color:"blue", paddingLeft:"10px"}} /></Link>
          <Link href="#" onClick={()=>props.DeleteTask(info.getValue())}><Icon iconName="Delete" style={{color:"red", paddingLeft:"10px"}} /></Link>
        </div>),
        enableColumnFilter: false,
        enableSorting: false
      }
    ],
    []
  )

  const [data, setData] = React.useState<ITaskGroup[]>(() => props.TaskUsers);
  const refreshData = () => setData(props.TaskUsers);

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
    getPaginationRowModel: getPaginationRowModel(),
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
    <div className="p-2">
      <div style={{display:"flex"}}>
        <div style={{display:"inline",width:"50%"}}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            className="p-2 font-lg shadow border border-block"
            placeholder="Search all columns..."
          />
        </div>
        <div style={{display:"inline",width:"50%"}}>
          <PrimaryButton text="Add Team Group" onClick={()=>props.AddTask()} style={{float:"right"}} />
        </div>        
      </div>
      <br />
      <div className="h-2"></div>
      <BTable striped bordered hover responsive size="lg">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div style={{ display: "flex" }}>
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
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
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
                    </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </BTable>
      <div className="h-2" />
      <div className="flex items-center gap-2">
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
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      {
        false &&
      <><div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(table.getState(), null, 2)}</pre></>
      }
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
          // type="text"
          type="search"
          value={(columnFilterValue ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`${placeholder?.placeholder}`}
      // className="w-36 border shadow rounded"
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

export default TableTaskGroups;