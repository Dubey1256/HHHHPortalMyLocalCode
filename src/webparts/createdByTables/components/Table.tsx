import * as React from 'react';
import pnp, { Web } from "sp-pnp-js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Filter, DefaultColumnFilter } from './filters';
import "bootstrap/dist/css/bootstrap.min.css"; 
// import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
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
import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  HeaderGroup,



} from 'react-table';
import { FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaSort, FaSortDown, FaSortUp, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
// import GlobalCommanTable, { Filter } from '../../../globalComponents/GlobalCommanTable';
import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
// import EditContractPopup from '../../hRcontractProfile/components/contractProfile/EditContractPopup';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import moment from 'moment';



const Table = (props:any) => {
    let count: any = 0;
   let AllListId:any = [];
    let allData: any = [];
    let userlists: any = [];
    let QueryId:any;
    let dataLength: any = [];
    const [newData, setNewData]: any = React.useState([]);
    const [taskUser, setTaskUser] :any = React.useState([]);



  //   const columns = React.useMemo<ColumnDef<any, unknown>[]>(
  //     () => [
  //         {
  //       accessorFn: (row) => row?.idType,
  //       cell: ({ row }) => (
  //           <div>
  //             <span><img style={{width:"25px", height:'25px', borderRadius:'20px'}}  src={row?.original?.siteIcon} /></span>
  //              <span>{row?.original?.idType}</span>
  //           </div>
  //       ),
  //       id: 'idType',
  //       placeholder: "Task ID",
  //       header: "",
  //       size: 10,
  //   },
  //     {
  //         accessorKey: "Title",
  //         placeholder: "Task Title",
  //         header: "",
  //         size: 7,
  //     },
  //     {
  //         accessorKey: "Categories",
  //         placeholder: "Categories",
  //         header: "",
  //         size: 9,
  //     },
  //         {
  //             accessorKey: "percentage",
  //             placeholder: "%",
  //             header: "",
  //             size: 7,
  //         },
  //         {
  //           accessorFn: (row) => row?.newDueDate,
  //           cell: ({ row }) => (
  //               <div>
  //                 <div>{row?.original?.newDueDate}</div>
  //                 {/* {new Date() < new Date(row?.original?.dueDate) ? <div style={{height:'12px', width:'12px', borderRadius:'50%', backgroundColor:'green'}}></div> :(new Date() > new Date(row?.original?.dueDate) ? <div style={{height:'12px', width:'12px', borderRadius:'50%', backgroundColor:'red'}}></div> : <div style={{height:'12px', width:'12px', borderRadius:'50%', backgroundColor:'yellow'}}></div>) }
  //                */}
  //               </div>
  //           ),
  //           id: 'newDueDate',
  //           placeholder: "DueDate Date",
  //           header: "",
  //           size: 10,
  //       },
  //         {
  //           accessorFn: (row) => row?.newModified,
  //           cell: ({ row }) => (
  //               <div>
  //                  <span>{row?.original?.newModified}</span>
  //               <span><img style={{width:"25px", height:'25px', borderRadius:'20px'}}  src={row?.original?.editorImg} /></span>
  //               </div>
  //           ),
  //           id: 'newModified',
  //           placeholder: "Modified Date",
  //           header: "",
  //           size: 10,
  //       },
  //         {
  //           accessorFn: (row) => row?.newCreated,
  //           cell: ({ row }) => (
  //               <div>
  //                  <span>{row?.original?.newCreated}</span>
  //               <span><img style={{width:"25px", height:'25px', borderRadius:'20px'}}  src={row?.original?.authorImg} /></span>
  //               </div>
  //           ),
  //           id: 'newCreated',
  //           placeholder: "Created Date",
  //           header: "",
  //           size: 10,
  //       },
  //       {
  //         accessorFn: (row) => row?.TeamMembersSearch,
  //         cell: ({ row }) => (
  //           <span>
  //           <ShowTaskTeamMembers props={row?.original} TaskUsers={taskUser} />
            
  //         </span>
  //         ),
  //         id: 'TeamMembersSearch',
  //         placeholder: "Team Members",
  //         header: "",
  //         size: 10,
  //     },
  //     {
  //       accessorFn: (row) => row?.TeamMembersSearch,
  //       cell: ({ row }) => (
  //         <span>
  //        <span title="Edit Task"  className="svg__iconbox svg__icon--edit hreflink ms-3" ></span>
  //        <span title="Edit Task"  className="svg__iconbox svg__icon--trash hreflink" ></span>
  //       </span>
  //       ),
  //       id: 'Id',
  //       placeholder: "",
  //       header: "",
  //       size: 10,
  //   },
  //     ],
  //     [newData]
  // );



  const columns = React.useMemo(
    () => [
        {
            internalHeader: 'Task ID',
            accessor: 'idType',
            showSortIcon: true,
            Cell: ({ row }: any) => (
              <div>
                          <span><img style={{width:"25px", height:'25px', borderRadius:'20px'}}  src={row?.original?.siteIcon} /></span>
                           <span>{row?.original?.idType}</span>
                        </div>
            )
        },
        {
            internalHeader: 'Task Title',
            accessor: 'Title',
            showSortIcon: true,
            style: { width: '100px' },
        },
        {
            internalHeader: 'Categories',
            accessor: 'Categories',
            showSortIcon: true,
            style: { width: '100px' },
        },
        {
          internalHeader: '%',
          showSortIcon: true,
          accessor: 'percentage',
          style: { width: '100px' },
      },
        {
            internalHeader: 'Due Date',
            accessor: 'newDueDate',
            showSortIcon: true,
            style: { width: '150px' },
            Cell: ({ row }: any) => (
              <div>
               <div>{row?.original?.newDueDate}</div>
               {/* {new Date() < new Date(row?.original?.dueDate) ? <div style={{height:'12px', width:'12px', borderRadius:'50%', backgroundColor:'green'}}></div> :(new Date() > new Date(row?.original?.dueDate) ? <div style={{height:'12px', width:'12px', borderRadius:'50%', backgroundColor:'red'}}></div> : <div style={{height:'12px', width:'12px', borderRadius:'50%', backgroundColor:'yellow'}}></div>) }
              */}
             </div>
            )
        },
      
        {
          internalHeader: 'Modified',
          accessor: 'newModified',
          showSortIcon: true,
          style: { width: '150px' },
          Cell: ({ row }: any) => (
            <div>
               <span>{row?.original?.newModified}</span>
           <span><img style={{width:"25px", height:'25px', borderRadius:'20px'}}  src={row?.original?.editorImg} /></span>
            </div>
          )
      },
      {
        internalHeader: 'Created',
        accessor: 'newCreated',
        showSortIcon: true,
        style: { width: '150px' },
        Cell: ({ row }: any) => (
          <div>
          <span>{row?.original?.newCreated}</span>
      <span><img style={{width:"25px", height:'25px', borderRadius:'20px'}}  src={row?.original?.authorImg} /></span>
       </div>
        )
    },
    {
      internalHeader: 'Team Members',
      accessor: 'TeamMembersSearch',
      showSortIcon: true,
      style: { width: '150px' },
      Cell: ({ row }: any) => (
        <span>
         <ShowTaskTeamMembers props={row?.original} TaskUsers={taskUser} />
                  
       </span>
      )
  },
  {
    internalHeader: '',
    accessor: 'ID',
    showSortIcon: true,
    style: { width: '150px' },
    Cell: ({ row }: any) => (
      <span>
           <span title="Edit Task"  className="svg__iconbox svg__icon--edit hreflink ms-3" ></span>
          <span title="Edit Task"  className="svg__iconbox svg__icon--trash hreflink" ></span>
         </span>
    )
},
    ],
    [newData]
  );



  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
}: any = useTable(
    {
      columns,
      newData,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 150000 },
      data: []
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
);




const generateSortingIndicator = (column: any) => {
  return column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : (column.showSortIcon ? <FaSort /> : '');
};
    const getTaskUserData = async () => {
      const web = new Web(props.Items.siteUrl);
      await web.lists
        .getById(props.Items.TaskUsertListID)
        .items.select(
          "AssingedToUser/Title",
          "AssingedToUser/Id",
          "Item_x0020_Cover",
          "Title",
          'Id', 
          'Email', 
          'Suffix', 
          'UserGroup/Id'
        )
        .expand("AssingedToUser",'UserGroup')
        .getAll()
        .then((data) => {
          userlists = data;
          setTaskUser(data);
          getQueryVariable();
          smartMetaData();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const smartMetaData = async () => {
      const web = new Web(props.Items.siteUrl);
      await web.lists
        .getById(props.Items.SmartMetadataListID)
        .items.select("Configurations", "ID", "Title", "TaxType", "listId")
        .filter("TaxType eq 'Sites'")
        .getAll()
        .then((data) => {
          data.map((item: any) => {
            if (item.Title != 'DRR' && item.Title != "Master Tasks" && item.Title != "SDC Sites" && item.Configurations != null) {
              let a: any = JSON.parse(item.Configurations);
              a?.map((newitem: any) => {
                                
                  dataLength.push(newitem.siteUrl);
                 
                  getAllData(newitem);
                  // b.push(newitem);
                
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getQueryVariable =  () => {
      const params = new URLSearchParams(window.location.search);
      let query = params.get("CreatedBy");
      QueryId = query;
      console.log(query); //"app=article&act=news_content&aid=160990"
    };
    const getAllData = async (items:any) => {
      const web = new Web(items.siteUrl);
      await web.lists
        .getById(items.listId)
        .items.select(
          "Title",
          "PercentComplete",
          "SharewebTaskType/Title",
          "SharewebTaskType/Id",
          "Categories",
          "Priority_x0020_Rank",
          "DueDate",
          "Created",
          "Modified",
          "Team_x0020_Members/Id",
          "Team_x0020_Members/Title",
          "ID",
          "Responsible_x0020_Team/Id",
          "Responsible_x0020_Team/Title",
          "Editor/Title",
          "Editor/Id",
          "Author/Title",
          "Author/Id",
          "AssignedTo/Id", 
          "AssignedTo/Title",
        )
        .expand(
          "Team_x0020_Members",
          "Author",
          "SharewebTaskType",
          "Editor",
          "Responsible_x0020_Team",
          "AssignedTo"
        )
        .filter(`Author/Id eq ${QueryId} and PercentComplete le 0.96`)
        .getAll()
        .then((data: any) => {
          data.map((dataItem: any) => {
            userlists.map((userItem: any) => {
              dataItem.percentage = dataItem.PercentComplete * 100 + "%";
              // dataItem.siteTitle = listDetails.Title;
              // dataItem.siteImg = listDetails.ImageUrl;
  
              if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Activities"
              ) {
                dataItem.idType = "A" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "MileStone"
              ) {
                dataItem.idType = "M" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Project"
              ) {
                dataItem.idType = "P" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Step"
              ) {
                dataItem.idType = "S" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Task"
              ) {
                dataItem.idType = "T" + dataItem.Id;
              } else if (
                (dataItem.SharewebTaskType == undefined
                  ? null
                  : dataItem.SharewebTaskType.Title) === "Workstream"
              ) {
                dataItem.idType = "W" + dataItem.Id;
              } else {
                dataItem.idType = "T" + dataItem.Id;
              }
  
              dataItem["newCreated"] = dataItem.Created != null ? moment(dataItem.Created).format('DD/MM/YYYY') : "";
  
              dataItem["newModified"] =dataItem.Modified != null ? moment(dataItem.Modified).format('DD/MM/YYYY') : "";
  
              dataItem["newDueDate"] =dataItem.DueDate != null ? moment(dataItem.DueDate).format('DD/MM/YYYY') : "";
  
              if (
                userItem.AssingedToUser != undefined &&
                userItem.AssingedToUser.Id == dataItem.Author.Id
              ) {
                dataItem.AuthorImg = userItem?.Item_x0020_Cover?.Url;
              }
              if (
                userItem.AssingedToUser != undefined &&
                userItem.AssingedToUser.Id == dataItem.Editor.Id
              ) {
                dataItem.EditorImg = userItem?.Item_x0020_Cover?.Url;
              }
            });
            
              allData.push({
                idType: dataItem.idType,
                Title: dataItem.Title,
                Categories: dataItem.Categories,
                percentage: dataItem.percentage,
                newDueDate: dataItem.newDueDate,
                newModified: dataItem.newModified,
                newCreated: dataItem.newCreated,
                editorImg: dataItem.EditorImg,
                authorImg:dataItem.AuthorImg,
                siteIcon : items.ImageUrl,
                siteUrl : items.siteUrl,
                Id : dataItem.Id,
                Author : dataItem.Author,
                Team_x0020_Members : dataItem.Team_x0020_Members,
                Responsible_x0020_Team : dataItem.Responsible_x0020_Team,
                AssignedTo: dataItem.AssignedTo,
                created : dataItem.Created,
                modified:dataItem.Modified,
                dueDate :dataItem.DueDate,
              });
           
          });
          count++;
  
          if (count == dataLength.length) {
            setNewData(allData);
          }
        })
        .catch((err: any) => {
          console.log("then catch error", err);
        });
    };
   
const callBack=()=>{
    console.log('calbacks');
}



    React.useEffect(() => {
      getTaskUserData();
      AllListId = {
        MasterTaskListID: props?.props?.MasterTaskListID,
        TaskUsertListID: props?.props?.TaskUsertListID,
        SmartMetadataListID: props?.props?.SmartMetadataListID,
        //SiteTaskListID:this.props?.props?.SiteTaskListID,
        TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
        DocumentsListID: props?.props?.DocumentsListID,
        SmartInformationListID: props?.props?.SmartInformationListID,
        siteUrl: props?.props?.siteUrl,
        AdminConfigrationListID: props?.props?.AdminConfigrationListID,
        isShowTimeEntry: props?.props?.isShowTimeEntry,
        isShowSiteCompostion: props?.props?.isShowSiteCompostion
      }
    }, []);
  return (
    <div>Table
      {/* <span><EditTaskPopup/></span> */}
        <span>
        <Table className="SortingTable" bordered hover {...getTableProps()}>
                                <thead className="fixed-Header">
                                    {headerGroups.map((headerGroup: any) => (
                                        <tr  {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column: any) => (
                                                <th  {...column.getHeaderProps()} style={column?.style}>
                                                    <span class="Table-SortingIcon" style={{ marginTop: '-6px' }} {...column.getSortByToggleProps()} >
                                                        {column.render('Header')}
                                                        {generateSortingIndicator(column)}
                                                    </span>
                                                    
                                                    <Filter column={column} />
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>



                                <tbody {...getTableBodyProps()}>
                                    {page?.map((row: any) => {
                                        prepareRow(row)
                                        return (
                                            <tr {...row.getRowProps()}  >
                                                {row.cells.map((cell: { getCellProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>; render: (arg0: string) => boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
                                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                })}
                                            </tr>
                                        )



                                    })}
                                </tbody>
                            </Table>
        </span>
    </div>
  )
}



export default Table




