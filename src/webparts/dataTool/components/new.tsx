// import * as React from "react";
// import { Web } from "sp-pnp-js";
// import {
//   useTable,
//   useSortBy,
//   useFilters,
//   useExpanded,
//   // usePagination,
//   // HeaderGroup,
// } from "react-table";
// import {
//   //Button,
//   Table,
//  // Row,
//  // Col,
//  // Pagination,
//  // PaginationLink,
//  // PaginationItem,
//  // Input,
// } from "reactstrap";



// function Main() {
//   let AllSitesConfig: any = [];
// const [data, setData]:any=React.useState([{Title:""}]);
// const [ListNamee, setListNamee]:any=React.useState();

// let siteUrl:any;

  

//   const loadAllSitesListsItems = (siteUrl:any, listId:any, ListName:any) => {
//     setListNamee(ListName);
//     console.log(ListNamee);
//     let web = new Web(siteUrl);
//      web.lists
//       .getById(listId)
//       .items.select(
//         "ID",
//         "Title",
//         "Editor/Title",
//         "Author/Title",
//         "Created",
//         "Modified",
//         "FileRef",
//         "FileLeafRef"
//       )
//       .expand("Author", "Editor")
//       // .filter(`Created eq '${todaynew}'`)
//       //.filter("Created eq '2023-03-30'")
//       //.filter(`substringof('${myDate}', Created)`)
//       //.filter(`substringof('2023-03-30', Created)`)
//       //.filter(`substringof('${todaynew}', Created)`)
//       // .filter(`Created eq ${StartWeekday}`)
//       //.filter(`(${condition1} or ${condition2})`)
//       .top(100)
//       .filter(`(substringof('test', Title) or substringof('test', FileRef))`)
//       // )
//       //.filter(`substringof('test', Title)`)
//       //   .filter("Title eq 'test' or FileRef eq 'test'")
      
//       //.orderBy("Created", false)
//       //.filter(filterString)
//       .get()
//       .then((data: any) => {
//         console.log("datatatatata", data);
//         setData(data);
//         // data.map((items:any, index:any) => {todaynew
//         //     index;
//         //     const dateField = new Date(items.Created);
//         //     const formattedDate = dateField.toLocaleDateString("en-GB");

//         //     if(formattedDateToday==formattedDate){
//         //         createdToday.push(items)
//         //     }

//         // });
//         // console.log("todays_data",createdToday);

//         //
//         //
//         // console.log(formattedDate);
//       })
//       .catch((error: any) => {
//         console.log(error);
//       });
//   };

//   const loadAllSitesItems = () => {
    

//     AllSitesConfig?.map((site: any) => {
//       site.ItemType = site.Title;
//       siteUrl = site.MainUrl;
//      loadAllSitesListsItems(siteUrl, site.List_x0020_Id, site.List_x0020_Name)
//     });
  
//   };

//   const getFunction = async () => {
//     const URL = window.location.href.split("/_layouts/");

//     let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");

//     await web.lists
//       .getById("ce1d02af-03ec-473c-ad58-a52a2b97bb8d")
//       .items.select(
//         "Title",
//         "List_x0020_Name",
//         "List_x0020_Id",
//         "Site_x0020_Name",
//         "Query",
//         "SortOrder",
//         "SiteUrl",
//         "Columns",
//         "Backup",
//         "Created",
//         "Modified",
//         "Author/Id",
//         "Author/Title",
//         "Editor/Id",
//         "Editor"
//       )
//       .expand("Author", "Editor")
//       .get()
//       .then((res) => {
//         // console.log(res);

//         res.map((item: any) => {
//           if (item.Columns != undefined && item.Backup == true) {
//             item.MainUrl = URL[0];
//             AllSitesConfig.push(item);
//           }
//         });
//         loadAllSitesItems();
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };


//   const columns = React.useMemo(
//     () => [
//       {
//         internalHeader: "Title",
//         accessor: "Title",
//         width: "75px",
//         showSortIcon: false,
       
//       },
     
//       // {
//       //   internalHeader: "ListName",
//       //   accessor: "ListName",
//       //   width: "75px",
//       //   showSortIcon: false,
       
//       // },
//       // {
//       //   internalHeader: "Modified",
//       //   accessor: "Shareweb_x0020_ID",
//       //   width: "75px",
//       //   showSortIcon: false,
       
//       // },
//       // {
//       //   internalHeader: "Title",
//       //   accessor: "Shareweb_x0020_ID",
//       //   width: "75px",
//       //   showSortIcon: false,
       
//       // },
//       // {
//       //   internalHeader: "Title",
//       //   accessor: "Shareweb_x0020_ID",
//       //   width: "75px",
//       //   showSortIcon: false,
       
//       // },
     
//     ],
//     [data]
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     //page,
//     prepareRow
//     // gotoPage,
//     // setPageSize,
   
//   }: any = useTable(
//     {
//       columns,
//       data,
      
      
//     },
//     useFilters,
//     useSortBy,
//     useExpanded,
   
//   );
//   React.useEffect(() => {
//     void getFunction();
//     }, []);

//   return (
//     <div>
//       <h1>hahahaha
//         <div>
//         <Table
//                           className="SortingTable"
//                           bordered
//                           hover
//                           {...getTableProps()}
//                         >
//                           <thead>
//                             {headerGroups.map((headerGroup: any) => (
//                               <tr {...headerGroup.getHeaderGroupProps()}>
//                                 {headerGroup.headers.map((column: any) => (
//                                   <th {...column.getHeaderProps()}>
//                                     <span
//                                       className="Table-SortingIcon"
//                                       // style={{ marginTop: "-6px" }}
//                                       {...column.getSortByToggleProps()}
//                                     >
//                                       {column.render("Header")}
//                                       {/* {generateSortingIndicator(column)} */}
//                                     </span>
//                                     {/* <Filter column={column} /> */}
//                                   </th>
//                                 ))}
//                               </tr>
//                             ))}
//                           </thead>

//                           <tbody {...getTableBodyProps()}>
//                             {data?.map((row: any) => {
//                               prepareRow(row);
//                               return (
//                                 <tr {...row.getRowProps()}>
//                                   {row.cells.map(
//                                     (cell: {
//                                       getCellProps: () => JSX.IntrinsicAttributes &
//                                         React.ClassAttributes<HTMLTableDataCellElement> &
//                                         React.TdHTMLAttributes<HTMLTableDataCellElement>;
//                                       render: (
//                                         arg0: string
//                                       ) =>
//                                         | boolean
//                                         | React.ReactChild
//                                         | React.ReactFragment
//                                         | React.ReactPortal;
//                                     }) => {
//                                       return (
//                                         <td {...cell.getCellProps()}>
//                                           {cell.render("Cell")}
//                                         </td>
//                                       );
//                                     }
//                                   )}
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </Table>
//         </div>
//       </h1>
//     </div>
//   );
// }

// export default Main;
