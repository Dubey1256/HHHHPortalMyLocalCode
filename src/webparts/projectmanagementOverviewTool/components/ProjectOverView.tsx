import * as React from 'react';
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
// import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
// import {
//     useTable,
//     useSortBy,
//     useFilters,
//     useExpanded,
//     usePagination,
//     HeaderGroup,
// } from 'react-table';
// import { Filter, DefaultColumnFilter, SelectColumnFilter } from './filters';
// import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
// import { Web } from "sp-pnp-js";
// import * as Moment from 'moment';
// import { Modal } from 'office-ui-fabric-react';
// import AddProject from './AddProject'
// import EditProjectPopup from './EditProjectPopup';
// import TableDataTSX from './TableDataTSX';
// var siteConfig: any = []
// var AllTaskUsers: any = []
// var Idd: number;
// export default function ProjectOverview() {
//     const [listIsVisible, setListIsVisible] = React.useState(false);
//     const [IsComponent, setIsComponent] = React.useState(false);
//     const [AllTaskUser, setAllTaskUser] = React.useState([]);
//     const [AssignedTaskUser, SetAssignedTaskUser] = React.useState({ Title: '' });
//     const [SharewebComponent, setSharewebComponent] = React.useState('');
//     const [searchedNameData, setSearchedDataName] = React.useState([]);
//     const [data, setData] = React.useState([]);
//     const [AllTasks, setAllTasks]:any = React.useState([]);
//     const [inputStatus, setInputStatus] = React.useState(false);
//     const [EditmodalIsOpen, setEditmodalIsOpen] = React.useState(false);
//     const [AddmodalIsOpen, setAddmodalIsOpen] = React.useState(false);
//     // const [Masterdata,setMasterdata] = React.useState([])
//     //const [QueryId, setQueryId] = React.useState()
//     React.useEffect(() => {
//         TaskUser()
//         GetMasterData();
//     }, [])
//     const Call = React.useCallback((item1) => {
//         setIsComponent(false);
//         showProgressHide();
//     }, []);
//     var showProgressBar = () => {
//         $(' #SpfxProgressbar').show();
//     }

//     var showProgressHide = () => {
//         $(' #SpfxProgressbar').hide();
//     }
//     const TaskUser = async () => {
//         let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
//         let taskUser = [];
//         taskUser = await web.lists
//             .getById('b318ba84-e21d-4876-8851-88b94b9dc300')
//             .items
//             .select("Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name")
//             .top(5000)
//             .expand("AssingedToUser,Approver")
//             .get();
//         setAllTaskUser(taskUser);
//         AllTaskUsers = taskUser;
//         // console.log("all task user =====", taskUser)
//         setSearchedDataName(taskUser)
//     }
//     const columns = React.useMemo(
//         () => [
//             {
//                 internalHeader: 'Title',
//                 accessor: 'Title',
//                 showSortIcon:true,
//                 Cell: ({ row }: any) => (
//                     <span>
//                         <a style={{ textDecoration: "none", color: "#000066" }} href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${row?.Id}`} data-interception="off" target="_blank">{row.values.Title}</a>
//                     </span>
//                 )
//             },
//             {
//                 internalHeader: 'Percent Complete',
//                 accessor: 'PercentComplete',
//                 showSortIcon:true,
//             },
//             {
//                 internalHeader: 'Priority',
//                 accessor: 'Priority_x0020_Rank',
//                 showSortIcon:true,
//             },
//             {
//                 internalHeader: 'Team Members',
//                 accessor: 'TeamMembers',
//                 showSortIcon:true,
//                 Cell: ({ row }: any) => (
//                     <span>
//                        <ShowTaskTeamMembers props={row?.original} TaskUsers={AllTaskUser}></ShowTaskTeamMembers>
//                     </span>
//                 )
//             },
//             {
//                 internalHeader: 'Due Date',
//                 showSortIcon:true,
//                 accessor: 'DisplayDueDate',
//             },
//             {   internalHeader:'',
//                 id: 'Id', // 'id' is required
//                 isSorted:false,
//                 showSortIcon:false,
//                 Cell: ({ row }: any) => (
//                     <span>
//                       <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"  onClick={(e) => EditComponentPopup(row?.original)}></img>
//                     </span>
//                 ),
//             },
//         ],
//         [data]
//     );



//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         page,
//         prepareRow,
//         visibleColumns,
//         canPreviousPage,
//         canNextPage,
//         pageOptions,
//         pageCount,
//         gotoPage,
//         nextPage,
//         previousPage,
//         setPageSize,
//         state: { pageIndex, pageSize },
//     }: any = useTable(
//         {
//             columns,
//             data,
//             defaultColumn: { Filter: DefaultColumnFilter },
//             initialState: { pageIndex: 0, pageSize: 10 }
//         },
//         useFilters,
//         useSortBy,
//         useExpanded,
//         usePagination
//     );
//     const generateSortingIndicator = (column: any) => {
//         return column.isSorted ? (column.isSortedDesc ? <FaSortDown style={{marginTop:'-6px'}} /> : <FaSortUp style={{marginTop:'-6px'}} />) : (column.showSortIcon?<FaSort style={{marginTop:'-6px'}}/> :'');
//     };

//     const onChangeInSelect = (event: any) => {
//         setPageSize(Number(event.target.value));
//     };

//     const onChangeInInput = (event: any) => {
//         const page = event.target.value ? Number(event.target.value) - 1 : 0;
//         gotoPage(page);
//     };

//     const EditComponentPopup = (item: any) => {
//         item['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
//         item['listName'] = 'Master Tasks';
//         // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
//         setIsComponent(true);
//         setSharewebComponent(item);
//         // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
//     }
//     const GetMasterData = async () => {
//         let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
//         let taskUsers:any = [];
//         let Alltask: any = [];
//         // var AllUsers: any = []
//         Alltask = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items
//             .select("Deliverables,TechnicalExplanations,ValueAdded,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title").expand("ComponentPortfolio,ServicePortfolio,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent").top(4999).filter("Item_x0020_Type eq 'Project'").getAll();           
//              Alltask.PercentComplete = (taskUsers.PercentComplete * 100).toFixed(0);
//         // if(taskUsers.ItemType=="Project"){
//         // taskUsers.map((item: any) => {
//         //     if (item.Item_x0020_Type != null && item.Item_x0020_Type == "Project") {
//         //         Alltask.push(item)
//         //     }
//             Alltask.map((items: any) => {
//                 items.AssignedUser = []
//                 items.TeamMembersSearch='';
//                 if (items.AssignedTo != undefined) {
//                     items.AssignedTo.map((taskUser: any) => {
//                         AllTaskUsers.map((user: any) => {
//                             if (user.AssingedToUserId == taskUser.Id) {
//                              if(user?.Title!=undefined){
//                                 items.TeamMembersSearch= items.TeamMembersSearch+' '+user?.Title
//                              }
//                             }
//                         })
//                     })
//                 }
//                 items.DisplayDueDate=items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : ""
//             })
//         // })
//         setAllTasks(Alltask);
//         setData(Alltask);
//     }
//     //    Save data in master task list
//     const [title, settitle] = React.useState('')
//     const addFunction = async () => {
//         let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
//         await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items.add({
//             Title: `${title}`,
//             Item_x0020_Type: "Project",
//         }).then((res: any) => {
//             setAddmodalIsOpenToFalse();
//             GetMasterData();
//             console.log(res);
//         })
//     }
//     //Just Check 
//     // AssignedUser: '',
//     const [UpdateData, setUpdateData] = React.useState({
//         Title: '',
//         DueDate: '',
//         Body: '',
//         PercentComplete: '',
//         Priority: ''
//     })
//     const updateDetails = async () => {
//         try {
//             let AssignedUsersArray = [];
//             // AssignedUsersArray.push(UpdateData.AssignedUser)
//             // let AssingedUser = {
//             //     "results": AssignedUsersArray
//             // }
//             let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
//             if (Idd != undefined) {
//                 await web.lists.getByTitle("Master%20Tasks").items.getById(Idd).update({
//                     Title: `${UpdateData.Title}`,
//                     // AssignedUser: AssingedUser,
//                     DueDate: `${UpdateData.DueDate}`,
//                     Body: `${UpdateData.Body}`,
//                     PercentComplete: `${UpdateData.PercentComplete}`,
//                     Priority: `${UpdateData.Priority}`
//                 }).then(i => {
//                     GetMasterData()
//                     setEditmodalIsOpenToFalse();
//                     console.log("Update Success");
//                 })
//             }
//         } catch (error) {
//             console.log("Error:", error.message);
//         }
//     }
//     // Delete Project
//     const deleteUserDtl = async () => {
//         try {
//             let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
//             await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items.getById(Idd).delete();
//             GetMasterData();
//         } catch (error) {
//             console.log("Error:", error.message);
//         }
//     }
//     const setEditmodalIsOpenToTrue = (Id: any) => {
//         setEditmodalIsOpen(true)
//         Idd = Id;
//     }
//     const setEditmodalIsOpenToFalse = () => {
//         setEditmodalIsOpen(false)
//     }
//     const setAddmodalIsOpenToTrue = () => {
//         setAddmodalIsOpen(true)
//     }
//     const setAddmodalIsOpenToFalse = () => {
//         setAddmodalIsOpen(false)
//     }
//     const searchedName = async (e: any) => {
//         setListIsVisible(true);
//         let Key: any = e.target.value.toLowerCase();
//         const data: any = {
//             nodes: AllTaskUser.filter((items: any) =>
//                 items.Title?.toLowerCase().includes(Key)
//             ),
//         };
//         setSearchedDataName(data.nodes);
//         if (Key.length == 0) {
//             setSearchedDataName(AllTaskUser);
//             setListIsVisible(false);
//         }
//     }
//     const cancelButtonFunction = () => {
//         SetAssignedTaskUser({ ...AssignedTaskUser, Title: "" })
//         setInputStatus(false);
//     }
//     const CallBack = React.useCallback(() => {
//      GetMasterData()
//     }, [])
//     console.log(AllTasks);
//     return (
//         <div>
//             <div className="col-sm-12 pad0 smart">
//                 <div className="section-event">
//                     <div className="wrapper">
//                         <div className='header-section d-flex justify-content-between'>
//                             <h2 style={{ color: "#000066", fontWeight: "600" }}>Project Management Overview</h2>
//                           <AddProject CallBack={CallBack} />
//                         </div>
//                         {/* <table className="table table-hover my-3 py-3" id="EmpTable" style={{ width: "100%" }}>
//                             <thead>
//                                 <tr>
//                                     <th style={{ width: "40%" }}>
//                                         <div className="smart-relative">
//                                             <input type="search" placeholder="Title" className="full_width form-control searchbox_height" />
//                                         </div>
//                                     </th>
//                                     <th style={{ width: "15%" }}>
//                                         <div className="smart-relative">
//                                             <input type="search" placeholder="% Complete" className="full_width form-control searchbox_height" />
//                                         </div>
//                                     </th>
//                                     <th style={{ width: "15%" }}>
//                                         <div className="smart-relative">
//                                             <input id="searchClientCategory" type="search" placeholder="Priority"
//                                                 title="Client Category" className="full_width searchbox_height form-control" />
//                                         </div>
//                                     </th>
//                                     <th style={{ width: "15%" }}>
//                                         <div className="smart-relative">
//                                             <input id="searchClientCategory" type="search" placeholder="Team"
//                                                 title="Client Category" className="full_width form-control searchbox_height" />
//                                         </div>
//                                     </th>
//                                     <th style={{ width: "13%" }}>
//                                         <div className="smart-relative">
//                                             <input id="searchClientCategory" type="search" placeholder="Due Date"
//                                                 title="Client Category" className="full_width form-control searchbox_height"
//                                             />
//                                         </div>
//                                     </th>
//                                     <th style={{ width: "2%" }}>
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                             <div id="SpfxProgressbar" style={{ display: "none" }}>
//                                     <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
//                                 </div>
//                                 {AllTasks.length > 0 && AllTasks && AllTasks.map(function (item, index) {
//                                     return (
//                                         <>
//                                             <tr >
//                                                 <td>
//                                                     <span><a style={{ textDecoration: "none", color: "#000066" }} href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${item.Id}`}  data-interception="off" target="_blank">{item.Title}</a></span>
//                                                 </td>
//                                                 <td><span className="ml-2">{item.PercentComplete}</span></td>
//                                                 <td>{item.Priority}</td>
//                                                 <td>
//                                                     {item.AssignedUser != undefined &&
//                                                         item.AssignedUser.map((Userda: any) => {
//                                                             return (
//                                                                 <span className="headign">
//                                                                     <img className='circularImage rounded-circle ' src={Userda.useimageurl} title={Userda.Title} />
//                                                                 </span>
//                                                             )
//                                                         })
//                                                     }
//                                                 </td>
//                                                 <td><span className="ml-2">{item.DueDate != null ? Moment(item.DueDate).format('DD/MM/YYYY') : ""}</span></td>
//                                                 <td><img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"  onClick={(e) => EditComponentPopup(item)}></img></td>
//                                             </tr>
//                                         </>
//                                     )
//                                 })}
//                             </tbody>
//                         </table> */}

//                        <div>
//                 <Table bordered hover {...getTableProps()}>
//                     <thead>
//                         {headerGroups.map((headerGroup: any) => (
//                             <tr  {...headerGroup.getHeaderGroupProps()}>
//                                 {headerGroup.headers.map((column: any) => (
//                                     <th  {...column.getHeaderProps()}>
//                                         <div {...column.getSortByToggleProps()}>
//                                             {column.render('Header')}
//                                             {generateSortingIndicator(column)}
//                                         </div>
//                                         <Filter column={column}  />
//                                     </th>
//                                 ))}
//                             </tr>
//                         ))}
//                     </thead>

//                     <tbody {...getTableBodyProps()}>
//                         {page.map((row: any) => {
//                             prepareRow(row)
//                             return (
//                                 <tr {...row.getRowProps()}  >
//                                     {row.cells.map((cell: { getCellProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>; render: (arg0: string) => boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
//                                         return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//                                     })}
//                                 </tr>
//                             )

//                         })}
//                     </tbody>
//                 </Table>
//                 <nav>
//                     <Pagination>
//                         <PaginationItem>
//                             <PaginationLink onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
//                                 <span aria-hidden={true}>
//                                     {/* <i
//                                     aria-hidden={true}
//                                     className="tim-icons icon-double-left"
//                                 /> */}
//                                     <FaAngleDoubleLeft aria-hidden={true} />
//                                 </span>
//                             </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                             <PaginationLink onClick={() => previousPage()} disabled={!canPreviousPage}>
//                                 <span aria-hidden={true}>
//                                     <FaAngleLeft aria-hidden={true} />
//                                 </span>
//                             </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                             <PaginationLink>
//                                 {pageIndex + 1}

//                             </PaginationLink>
//                         </PaginationItem>
//                         <PaginationItem>
//                             <PaginationLink onClick={() => nextPage()} disabled={!canNextPage}>
//                                 <span aria-hidden={true}>
//                                     <FaAngleRight
//                                         aria-hidden={true}

//                                     />
//                                 </span>
//                             </PaginationLink>
//                         </PaginationItem>

//                         <PaginationItem>
//                             <PaginationLink onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
//                                 <span aria-hidden={true}>
//                                     {/* <i
//                                     aria-hidden={true}
//                                     className="tim-icons icon-double-right"
//                                 /> */}
//                                     <FaAngleDoubleRight aria-hidden={true} />
//                                 </span>
//                             </PaginationLink>
//                             {' '}
//                         </PaginationItem>
//                         <Col md={2}>
//                             <Input
//                                 type='select'
//                                 value={pageSize}
//                                 onChange={onChangeInSelect}
//                             >

//                                 {[10, 20, 30, 40, 50].map((pageSize) => (
//                                     <option key={pageSize} value={pageSize}>
//                                         Show {pageSize}
//                                     </option>
//                                 ))}
//                             </Input>
//                         </Col>
//                     </Pagination>
//                 </nav>
//             </div>
//                     </div>
//                 </div>
//             </div>
//          {IsComponent && <EditProjectPopup props={SharewebComponent} Call={Call} showProgressBar={showProgressBar}> </EditProjectPopup>}

//         </div>
//     )
// }