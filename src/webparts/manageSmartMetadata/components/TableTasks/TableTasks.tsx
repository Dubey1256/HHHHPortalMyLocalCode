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
  flexRender
} from '@tanstack/react-table';

import { Table as BTable, Button } from 'react-bootstrap';

import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils';

import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import ITask from './ITask';

interface ITableTaskProps {
  Tasks: ITask[];
  RemoveCategories: (selectedTasks: ITask[]) => void;
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

function TableTasks(props: ITableTaskProps) {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')

  const [data, setData] = React.useState<ITask[]>(() => props.Tasks);
  const refreshData = () => setData(props.Tasks);
  React.useEffect(()=>refreshData(), [props.Tasks]);

  const columns = React.useMemo<ColumnDef<ITask>[]>(
    () => [
      {
        accessorKey: 'Site',
        id: "Site",
        placeholder: "Site",
        sortDescFirst: false,
        header: "",
        cell: ({ row, getValue }) => (
            <div
              style={{
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
                {getValue()}
              </>
            </div>
          ),
      },      
      {
        accessorKey: 'Title',
        id: "Title",
        header: "",
        placeholder: "Title",
        sortDescFirst: false
      },
      {
        accessorKey: "PercentComplete",
        header: "",
        placeholder: "Percentage"
      },
      {
        accessorKey: "Created",
        header: "",
        placeholder: "Created Date"
      },
      {
        accessorKey: "Modified",
        header: "",
        placeholder: "Modified Date"
      },
      {
        accessorKey: "DueDate",
        header: "",
        placeholder: "Due Date"
      }
    ],
    [data]
  )
  
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
    enableRowSelection: true,
    enableMultiRowSelection: true
  })

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'Title') {
      if (table.getState().sorting[0]?.id !== 'Title') {
        table.setSorting([{ id: 'Title', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  return (
    <div>
    <div style={{display:"inline",width:"50%"}}>
        <Button 
          className='m-2' 
          variant="primary" 
          onClick={()=>props.RemoveCategories(table.getSelectedRowModel().rows.map(i=>i.original))}
          disabled={table.getSelectedRowModel().rows.length==0} 
          style={{float:"right"}} 
        >
          Remove Categories
        </Button>
    </div>
    <div className="border ms-Grid">      
          
      <div className="Alltable mt-10">
        <div className="col-sm-12 p-0 smart">
          <div className="wrapper">
          <BTable striped bordered hover responsive size="lg">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div className='position-relative' style={{ display: "flex" }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanFilter() ? (
                        <div className='full-width'> 
                          <Filter
                          
                            column={header.column}
                            table={table}
                            placeholder={header.column.columnDef}
                          />
                        </div>
                      ) : null}
                      {                        
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
          </div>
        </div>
      </div>     
    </div>
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
          type="search" className='full-width'
          value={(columnFilterValue ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`${placeholder?.placeholder}`}
      // className="w-36 border shadow rounded"
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
        className={className + " cursor-pointer"}
        {...rest}
      />
    );
  }

export default TableTasks;