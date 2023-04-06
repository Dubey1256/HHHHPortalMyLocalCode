import * as React from "react";
import { Web } from "sp-pnp-js";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  useTable,
  useSortBy,
  // useFilters,
  useExpanded,
  usePagination,
  useFilters,
  // HeaderGroup,
} from "react-table";
import {
  // FaAngleDoubleLeft,
  // FaAngleDoubleRight,
  // FaAngleLeft,
  // FaAngleRight,
  // FaCaretDown,
  // FaCaretRight,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";

import {
  // Button,
  Table,
  // Row,
  // Col,
  // Pagination,
  // PaginationLink,
  // PaginationItem,
  // Input,
} from "reactstrap";
import * as Moment from "moment";
import { Filter, DefaultColumnFilter } from "./filters";

function Main() {
  let AllSitesConfig: any = [];
  const URLs: any = window.location.href.split("/_layouts/");
  const [data, setData]: any = React.useState([{ Title: "" }]);
  // const [ListNamee, setListNamee]: any = React.useState();

  let siteUrl: any;

  let lists: any = [];
  const loadAllSitesListsItems = (
    siteUrl: any,
    listId: any,
    ListName: any,
    count: any
  ) => {
    let web = new Web(siteUrl);
    web.lists
      .getById(listId)
      .items.select(
        "ID",
        "Title",
        "Editor/Title",
        "Author/Title",
        "Created",
        "Modified",
        "FileRef",
        "FileLeafRef"
      )
      .expand("Author", "Editor")

      .top(100)
      .filter(
        `((substringof('test', Title) or substringof('test', FileRef)) and Title ne null)`
      )

      .get()
      .then((data: any) => {
        data.map((item: any) => {
          item.listName = ListName;
          item.listId = listId;
        });
        console.log("datatatatata", data);
        lists.push(...data);
        if (count == AllSitesConfig.length) {
          lists.map((items: any) => {
            items.Createdd =
              items.Created != null
                ? Moment(items.Created).format("DD/MM/YYYY")
                : "";
            items.Modifiedd =
              items.Created != null
                ? Moment(items.Modified).format("DD/MM/YYYY")
                : "";
          });
          setData(lists);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const loadAllSitesItems = () => {
    let count = 0;

    AllSitesConfig?.map((site: any) => {
      site.ItemType = site.Title;
      siteUrl = site.MainUrl;
      count++;
      loadAllSitesListsItems(
        siteUrl,
        site.List_x0020_Id,
        site.List_x0020_Name,
        count
      );
    });
  };

  const getFunction = async () => {
    const URL = window.location.href.split("/_layouts/");

    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");

    await web.lists
      .getById("ce1d02af-03ec-473c-ad58-a52a2b97bb8d")
      .items.select(
        "Title",
        "List_x0020_Name",
        "List_x0020_Id",
        "Site_x0020_Name",
        "Query",
        "SortOrder",
        "SiteUrl",
        "Columns",
        "Backup",
        "Created",
        "Modified",
        "Author/Id",
        "Author/Title",
        "Editor/Id",
        "Editor"
      )
      .expand("Author", "Editor")
      .get()
      .then((res) => {
        // console.log(res);

        res.map((item: any) => {
          if (item.Columns != undefined && item.Backup == true) {
            item.MainUrl = URL[0];
            AllSitesConfig.push(item);
          }
        });
        loadAllSitesItems();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const generateSortingIndicator = (column: any) => {
    return column.isSorted ? (
      column.isSortedDesc ? (
        <FaSortDown />
      ) : (
        <FaSortUp />
      )
    ) : column.showSortIcon ? (
      <FaSort />
    ) : (
      ""
    );
  };

  //   const UpdateListItemByListId = (baseUrl:any, listId:any, data:any, itemId:any) => {
  //     let url = baseUrl + listEndPoint + "/getById('" + listId + "')/GetItemById(" + itemId + ")";
  //     return (data, url);
  // };

  // const SaveItem = (item:any) => {

  //     let NewListName = item.ListName;
  //     if (item.ListName === 'Master Tasks' || item.ListName === 'Small Projects') {
  //         NewListName = NewListName.replace(' ', '_x0020_');
  //     }
  //     else if (item.ListName === 'Offshore Tasks') {
  //         NewListName = 'SharewebQA';
  //     }
  //     else if (item.ListName === 'Images') {
  //         NewListName = 'PublishingImages';
  //         NewListName = "SP.Data." + NewListName + 'Item';
  //     }

  //     if (item.ListName !== undefined && item.ListName === 'Documents') {
  //         NewListName = "SP.Data." + NewListName + 'Item';
  //     }
  //     if (item.ListName != undefined && item.ListName != 'Images' && item.ListName != 'Documents'){
  //         NewListName = "SP.Data." + NewListName + 'ListItem';
  //     }

  //     let metadata = item.ListName === "News" ? "SP.Data.AnnouncementsListItem" : NewListName;
  //     let ItemListId = item.listID;
  //     const URL = window.location.href.split("/_layouts/");
  //     item.siteURL = URL;
  //     let itemsiteurl = item.siteURL;
  //     let postData = {
  //         __metadata: { 'type': metadata },
  //         DoNotAllow: true
  //     };
  //     UpdateListItemByListId(itemsiteurl, ItemListId, postData, item.Id)
  //         .then(function (response) {
  //             angular.forEach($scope.ListsData, function (project, index) {
  //                 if (project.Id == item.Id) {
  //                     $scope.ListsData.splice(index, 1);
  //                 }
  //             })
  //             angular.forEach($scope.AllListsData, function (proj, index) {
  //                 if (proj.Id == item.Id) {
  //                     $scope.AllListsData.splice(index, 1);
  //                 }
  //             })
  //         },
  //             function (error) {
  //                 SharewebCommonFactoryService.cancelPagePopup()
  //             });
  //     SharewebCommonFactoryService.hideProgressBar();
  // }
  // const MoveItems = (item:any)=> {
  //   let flag = confirm("Are you sure, Do not show this item further on this page?");
  //   if (flag)
  //       SaveItem(item);
  // }

  // const removeTask = (item: any) => {
  //   console.log(item);
  // };

  const removeTask = async (item: any) => {
    let confirmation = confirm(
      "Are You Sure To Remove This Task..."
    );
    if(confirmation){
      try {
        if (item.listId != undefined) {
          let web = new Web(URLs[0]);
          await web.lists
            .getById(item.listId)
            .items.getById(item.Id)
            .recycle()
            .then(() => {
              alert("Task Removed");
              void getFunction();
            })
            .catch((error) => {
              console.log("Error:", error.message);
            });
        }
        // else {
        //   let web = new Web(URLs[0]);
        //   await web.lists
        //     .getById(item.listName)
        //     .items.getById(item.Id)
        //     .recycle();
        // }
  
        console.log("Your post has been deleted successfully");
      } catch (error) {
        console.log("Error:", error.message);
      }

    }
    
  };

  const deleteTask = async (item: any) => {
    let confirmation = confirm(
      "Are You Sure To Delete This Task..."
    );
    if(confirmation){
      try {
        if (item.listId != undefined) {
          let web = new Web(URLs[0]);
          await web.lists
            .getById(item.listId)
            .items.getById(item.Id)
            .recycle()
            .then(() => {
              alert("Task Deleted");
              void getFunction();
            })
            .catch((error) => {
              console.log("Error:", error.message);
            });
        }
        // else {
        //   let web = new Web(URLs[0]);
        //   await web.lists
        //     .getById(item.listName)
        //     .items.getById(item.Id)
        //     .recycle();
        // }
  
        console.log("Your post has been deleted successfully");
      } catch (error) {
        console.log("Error:", error.message);
      }

    }
    
  };

  const columns = React.useMemo(
    () => [
      {
        internalHeader: "Title",
        accessor: "Title",
        width: "75px",
        showSortIcon: false,
      },
      {
        internalHeader: "List Name",
        accessor: "listName",
        width: "75px",
        showSortIcon: false,
      },
      {
        internalHeader: "Created",
        accessor: "Createdd",
        width: "75px",
        showSortIcon: false,
      },
      {
        internalHeader: "Modified",
        accessor: "Modifiedd",
        width: "75px",
        showSortIcon: false,
      },
      {
        internalHeader: "",
        id: "Id", // 'id' is required
        isSorted: false,
        showSortIcon: false,
        Cell: ({ row }: any) => (
          <span className="d-flex">
            <span
              title="Delete-Task"
              onClick={() => removeTask(row?.original)}
              className="svg__iconbox svg__icon--trash ms-2"
            ></span>
            <span
              title="Delete-Task"
              onClick={() => deleteTask(row?.original)}
              className="svg__iconbox svg__icon--cross"
            ></span>
          </span>
        ),
      },
    ],
    [data]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    // visibleColumns,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    // pageCount,
    // gotoPage,
    // nextPage,
    // previousPage,
    // setPageSize,
    state: { pageIndex, pageSize },
  }: any = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },

      initialState: { pageIndex: 0, pageSize: 100000 },
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  console.log(pageIndex, pageSize);
  React.useEffect(() => {
    void getFunction();
  }, []);

  return (
    <div>
      <h2>DataCleanupTool</h2>
      <div>
        <Table className="SortingTable" bordered hover {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th {...column.getHeaderProps()}>
                    <span
                      class="Table-SortingIcon"
                      style={{ marginTop: "-6px" }}
                      {...column.getSortByToggleProps()}
                    >
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </span>
                    <Filter column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(
                    (cell: {
                      getCellProps: () => JSX.IntrinsicAttributes &
                        React.ClassAttributes<HTMLTableDataCellElement> &
                        React.TdHTMLAttributes<HTMLTableDataCellElement>;
                      render: (
                        arg0: string
                      ) =>
                        | boolean
                        | React.ReactChild
                        | React.ReactFragment
                        | React.ReactPortal;
                    }) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    }
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* <div>
        <table>
          <thead>
          <tr><th>
            Title
          </th>
          </tr>
          </thead>
          <tbody>

            {data?.map((item:any)=>
            <tr>
            <td>
              {item.Id}
            </td>
            </tr>)}
          
          </tbody>
          
        </table>
       </div> */}
    </div>
  );
}

export default Main;
