import * as React from 'react'

import './index.css'

import {
  ColumnDef,
} from '@tanstack/react-table';

import { Link, PrimaryButton } from '@fluentui/react';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';

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
function TableTaskGroups(props: ITableTaskUsersProps) {
  const [data, setData] = React.useState<ITaskGroup[]>(() => props.TaskUsers);
  const refreshData = () => setData(props.TaskUsers);
  React.useEffect(()=>refreshData(), [props.TaskUsers]);

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
        header: null,
        cell: (info)=>(<div className='pull-right alignCenter'>
          <span onClick={()=>props.EditTask(info.getValue())} className='svg__iconbox svg__icon--edit' title='Edit'></span>
          <span onClick={()=>props.DeleteTask(info.getValue())} className='svg__iconbox svg__icon--trash' title='Trash'></span>
        </div>),
        enableColumnFilter: false,
        enableSorting: false,
        Size:60
      }
    ],
    [data]
  )

  const callBackData = React.useCallback((elem: any, ShowingData: any) => {
       
  }, []);

  return (
    <div className="border Alltable ms-Grid">
          <div className='tbl-button'>
        <button type='button' className='btn btn-primary position-relative' style={{zIndex:'9999'}} onClick={()=>props.AddTask()}>Add Team Group</button>
      </div>
      <div className='wrapper'>
      { <GlobalCommanTable columns={columns} showPagination={true} data={data} callBackData={callBackData} excelDatas={data} showHeader={true} />}
      </div></div>
  )
}
export default TableTaskGroups;