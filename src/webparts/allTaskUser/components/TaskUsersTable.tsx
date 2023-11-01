import * as React from 'react'
import './index.css'
import {
  ColumnDef,
} from '@tanstack/react-table';

import { Link, PrimaryButton } from '@fluentui/react';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';

interface ITaskUser {
  Sflag: boolean;
  Title: string;
  Group: string;
  Category: string;
  Suffix: string;
  Item_x0020_Cover: string;
  SortOrder: number;
  Role: string;
  Company: string;
  Approver: string;
  TaskId: number;
  Team:string;
}

interface ITableTaskUsersProps {
  TaskUsers: ITaskUser[];
  GetUser: (userName: string, taskId: number) => JSX.Element;
  AddTask: () => void;
  EditTask: (taskId: number) => void;
  DeleteTask: (taskId: number) => void;
}

function TableTaskUsers(props: ITableTaskUsersProps) {
  const [data, setData] = React.useState<ITaskUser[]>(() => props.TaskUsers);
  const refreshData = () => setData(props.TaskUsers);
  React.useEffect(() => refreshData(), [props.TaskUsers]);
  data.forEach((item) => {
    if (!item.Sflag) {
      item.Sflag = true;
      item.Title = item.Suffix ? item.Title + ' (' + item.Suffix + ')' : item.Title;
    }
  })
  const columns = React.useMemo<ColumnDef<ITaskUser, any>[]>(
    () => [{
      // cell: ({ row }: any) => (
      //   <>
      //     <img src={`${row.original.Item_x0020_Cover != null && row.original.Item_x0020_Cover.Url != null ? row.original.Item_x0020_Cover.Url : 'https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg'}`} className="workmember" />
      //   </>
      // ),
      accessorFn: '',
      canSort: false,
      placeholder: '',
      header: '',
      id: 'row.original',
      size: 10,
    },
    {
      accessorKey: 'Title',
      header: "",
      placeholder: "Search Name",
      id: "Title",
      cell: info => props.GetUser(info.row.original.Title, info.row.original.TaskId),
      sortDescFirst: false
    },
    {
      accessorKey: "Group",
      header: "",
      id: "Group",
      placeholder: "Search Group"
    },
    {
      accessorKey: "Category",
      header: "",
      id: "Category",
      placeholder: "Search Category",
      size: 80,
    },
    {
      accessorKey: "SortOrder",
      header: "",
      id: "SortOrder",
      placeholder: "SortOrder",
      size: 42,
    },
    {
      accessorKey: "Role",
      header: "",
      id: "Role",
      placeholder: "Roles",
    },
    {
      accessorKey: "Company",
      header: "",
      id: "Company",
      placeholder: "Company",
      size: 70,
    },
    {
      accessorKey: "Approver",
      header: "",
      id: 'Approver',
      placeholder: "Approver"
    },
    {
      accessorKey: "Team",
      header: "",
      id: 'Team',
      placeholder: "Team",
      size: 75,
    },
    {
      id: "TaskId",
      accessorKey: "TaskId",
      header: null,
      size: 50,
      cell: (info) => (<div className='pull-right alignCenter'>
        <span onClick={() => props.EditTask(info.getValue())} className='svg__iconbox svg__icon--edit' title='Edit'></span>
        <span onClick={() => props.DeleteTask(info.getValue())} className='svg__iconbox svg__icon--trash' title='Trash'></span>
      </div>),
      enableColumnFilter: false,
      enableSorting: false,
    }
    ],
    [data]
  )

  const callBackData = React.useCallback((elem: any, ShowingData: any) => {

  }, []);
  return (

    <div className="border Alltable p-0 ms-Grid">
      <div className='tbl-button'>
        <button className='btn btn-primary position-relative' style={{ zIndex: '9999' }} onClick={() => props.AddTask()}>Add Team Member</button>
      </div>
      <div className='wrapper'>
      <GlobalCommanTable columns={columns} data={data} callBackData={callBackData} showHeader={true} />
    </div>
    </div>

  )
}


export default TableTaskUsers;






