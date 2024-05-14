import * as React from "react";
import { Web } from "sp-pnp-js";
import "bootstrap/dist/css/bootstrap.min.css";
import { arraysEqual, Modal, Panel, PanelType } from "office-ui-fabric-react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tooltip from "../../../globalComponents/Tooltip";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { ColumnDef } from "@tanstack/react-table";
import * as Moment from "moment";
import { data } from "jquery";
import VersionHistory from "../../../globalComponents/VersionHistroy/VersionHistory";
var ParentData: any = [];
var childData: any = [];
var newData: any = "";
var MydataSorted: any = [];
let CurrentSite = ''
let isSort:any= false;
const TopNavigation = (dynamicData: any) => {
  CurrentSite = dynamicData?.dynamicData?.Context?.pageContext?.web.title
  var ListId = dynamicData?.dynamicData?.TopNavigationListID;
  var AllListId = dynamicData?.dynamicData;
  const [root, setRoot] = React.useState([]);
  const [EditPopup, setEditPopup] = React.useState(false);
  const [sortedArray, setSortedArray] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [AddPopup, setAddPopup] = React.useState(false);
  const [sorting, setSorting] = React.useState(false);
  const [changeroot, setChangeroot] = React.useState(false);
  const [deletePopupData, setDeletePopupData] = React.useState([]);
  const [versionHistoryPopup, setVersionHistoryPopup] = React.useState(false);
  const [deletePopup, setDeletePopup] = React.useState(false);
  try {
    $("#spPageCanvasContent").removeClass();
    $("#spPageCanvasContent").addClass("hundred");
    $("#workbenchPageContent").removeClass();
    $("#workbenchPageContent").addClass("hundred");
  } catch (e) {
    console.log(e);
  }
  const [postData, setPostData] = React.useState<any>({
    Title: "",
    Url: "",
    Description: "",
    TaskTime: "",
    Id: "",
    ParentId: "",
  });
  const [popupData, setPopupData] = React.useState<any>([]);
  // var [ParentData, setParentData] = React.useState<any>([]);
  //var [childData, setchildData] = React.useState<any>([]);
  const [sortOrder, setSortOrder] = React.useState<any>();
  const [search, setSearch]: [string, (search: string) => void] =React.useState("");
  const [sortId, setSortId] = React.useState();
  const [value, setValue] = React.useState("");
  const [child, setChild] = React.useState("");
  const [subchild, setSubChild] = React.useState("");
  const [isVisible, setisVisible] = React.useState(false);
  const [isNoShow, setisNoShow] = React.useState(false);
  const [owner, setOwner] = React.useState(false);
  try {
    $("#spPageCanvasContent").removeClass();
    $("#spPageCanvasContent").addClass("hundred");
    $("#workbenchPageContent").removeClass();
    $("#workbenchPageContent").addClass("hundred");
  } catch (e) {
    console.log(e);
  }

  const [editableOrder, setEditableOrder] = React.useState(null);

  React.useEffect(() => {
    loadTopNavigation();
  }, []);
  let SearchedData = (e: { target: { value: string } }) => {
    setSearch(e.target.value.toLowerCase());
  };
  const clearSearch = () => {
    setSearch("");
  };
  const handleChange = (type: any, event: any) => {
    if (type == "Parent") {
      ParentData = [];
      setValue(event.target.value);
      root?.forEach((ba: any) => {
        if (ba.Title == event.target.value) {
          ParentData.push(ba);
        }
      });
    }
    if (type == "child") {
      childData = [];
      setChild(event.target.value);
      ParentData?.forEach((ba: any) => {
        ba?.childs.forEach((baa: any) => {
          if (baa.Title == event.target.value) {
            childData.push(baa);
          }
        });
      });
    }
    2;
    if (type == "subchild") {
      setSubChild(event.target.value);
    }
  };
  const loadTopNavigation = async () => {
    var TaskTypeItems: any = [];
    var Nodes: any = [];
    let web = new Web(dynamicData.dynamicData.siteUrl);

    TaskTypeItems = await web.lists
      .getById(ListId)
      .items.select(
        "ID",
        "Id",
        "Title",
        "href",
        "ParentID",
        "Order0",
        "SortOrder",
        "ownersonly",
        "IsVisible",
        "Modified",
        "Created",
        "Author/Id",
        "Author/Title",
        "Editor/Id",
        "Editor/Title"
      )
      .expand("Editor,Author")
      .top(4999)
      .get();
    console.log(TaskTypeItems);
    TaskTypeItems?.forEach((item: any) => {
      item.Title = item?.Title?.replace(/\b\w/g, (match:any) => match.toUpperCase());
      if (item.ownersonly == true) {
        item.image =`${dynamicData.dynamicData.siteUrl}/SiteCollectionImages/ICONS/24/Facilitators-do-not-disturb.png`;
      }
      if (item.IsVisible == false) {
        item.image =
        `${dynamicData.dynamicData.siteUrl}/SitecollectionImages/ICONS/24/do-not-disturb-rounded.png`;
      }
      if (item.ParentID == 0) {
        item.Id = item.ID;
        getChilds(item, TaskTypeItems);
        Nodes.push(item);
      }
    });
    console.log(Nodes);
    var AllData = Nodes.sort((a:any, b:any) => a.SortOrder - b.SortOrder);
    AllData.map((val:any)=>{
        val.childs =  val?.childs.sort((a:any, b:any) => a.SortOrder - b.SortOrder);
    })
    setRoot(AllData);
  };
  const getChilds = (item: any, items: any) => {
    item.childs = [];
    items?.forEach((childItem: any) => {
      if (
        childItem.ParentID != undefined &&
        parseInt(childItem.ParentID) == item.ID
      ) {
        if (childItem.ownersonly == true) {
          childItem.image =
          item.image =`${dynamicData.dynamicData.siteUrl}/SiteCollectionImages/ICONS/24/Facilitators-do-not-disturb.png`;

        }
        if (childItem.IsVisible == false) {
          childItem.image =
          `${dynamicData.dynamicData.siteUrl}/SitecollectionImages/ICONS/24/do-not-disturb-rounded.png`;
        }
        item.childs.push(childItem);
        getChilds(childItem, items);
      }
    });
  };
  const editPopup = (item: any,ParentData:any) => {
    var Data: any = [];
    item.CreatedDate = Moment(item.Created).format("DD/MM/YYYY");
    item.ModifiedDate = Moment(item.Modified).format("DD/MM/YYYY");
    setisVisible(item.IsVisible);
    item.ParentTitle = ParentData;
    Data.push(item);
    setPopupData(Data);
    setEditPopup(true);
  };

  const ClosePopup = () => {
    setEditPopup(false);
    setPostData(undefined);
  };
  const AddNewItem = (item: any) => {
    var Data: any = [];
    Data.push(item);
    setPopupData(Data);
    setAddPopup(true);
  };
  const CloseAddPopup = () => {
    ParentData = [];
    childData = [];
    setAddPopup(false);
    setPostData(undefined);
  };
  const ChangeParentItem = () => {
    if (value != undefined && value != "") {
      root?.forEach((item: any) => {
        if (item.Title == value) {
          postData.Title = value;
          postData.Id = item.Id;
          postData.ParentId = item.ParentId;
        }
      });
      setChangeroot(false);
    }
  };
  const onRenderCustomHeaderUpdate = () => {
    return (
      <>
        <div className="subheading siteColor">Update TopNavigation</div>
        <Tooltip ComponentId="1810" />
      </>
    );
  };
  const onRenderCustomHeaderAdd = () => {
    return (
      <>
        <div className="subheading siteColor">Add TopNavigation</div>
        <Tooltip ComponentId="1810" />
      </>
    );
  };
  const onRenderCustomHeaderSortOrder = () => {
    return (
      <>
        <div className="subheading siteColor">Update SortOrder</div>
        <Tooltip ComponentId="1810" />
      </>
    );
  };
  const onRenderCustomHeaderSelect = () => {
    return (
      <>
        <div className="subheading siteColor">Select Parent</div>
        <Tooltip ComponentId="1810" />
      </>
    );
  };
  const UpdateData = async (item: any) => {
    let web = new Web(dynamicData.dynamicData.siteUrl);
    await web.lists
      .getById(ListId)
      .items.getById(item.Id)
      .update({
        Title:
          postData?.Title != undefined && postData?.Title != ""
            ? postData?.Title
            : item?.Title,
        ParentID:
          postData?.ParentId != undefined && postData?.ParentId != ""
            ? postData?.ParentId
            : item?.ParentID,
        href: {
          __metadata: { type: "SP.FieldUrlValue" },
          Description:
          (postData != undefined && postData.Url != "" && postData.Url != undefined)
              ? postData?.Url
              : item?.href != null
              ? item?.href.Url
              : "",
          Url:
          (postData != undefined && postData.Url != "" && postData.Url != undefined)
              ? postData?.Url
              : item?.href != null
              ? item?.href.Url
              : "",
        },
        IsVisible: isVisible,
        ownersonly: owner,
      })
      .then((i) => {
        console.log(i);
        ClosePopup();
        loadTopNavigation();
      });
  };
  const uniqueBy = (arr: any, key: any) => {
    const seen = new Set();
    return arr.filter((item: any) => {
      const val = key ? item[key] : item;
      if (seen.has(val)) {
        return false;
      }
      seen.add(val);
      return true;
    });
  };
  const deleteDataFunction = async (item: any, type: any) => {
    if (item?.childs.length > 0 && type == 'single') {
      item?.childs?.map((items: any) => {
        items.value = items.Title
        items.label = items.Title
        items.children = items?.childs
        items.checked = true
      })
      const filteredData = uniqueBy(item?.childs, 'odata.id');
      if (filteredData != undefined) {
        filteredData?.map((items: any) => {
          items.children?.map((val: any) => {
            val.value = val.Title
            val.label = val.Title
            val.children = val?.childs
            val.checked = true;
          })

        })
      }
      ClosePopup();
      setDeletePopupData(filteredData)
      setDeletePopup(true)
    }
    else {
      var deleteConfirmation = confirm("Are you sure, you want to delete this?");
      if (deleteConfirmation) {
        let web = new Web(dynamicData.dynamicData.siteUrl);
        await web.lists
          .getById(ListId)
          .items.getById(item.Id)
          .delete()
          .then((i) => {
            console.log(i);
            ClosePopup();
            loadTopNavigation();
          });
      }
    }

  };

  const Additem = async () => {
    if (popupData[0] == "New") {
      popupData[0] = { ID: 0 };
    }
    let web = new Web(dynamicData.dynamicData.siteUrl);
    await web.lists
      .getById(ListId)
      .items.add({
        Title: postData.Title,
        ParentID:
          postData.Id != undefined && postData.Id != ""
            ? postData.Id
            : popupData[0]?.ID,
        href: {
          __metadata: { type: "SP.FieldUrlValue" },
          Description:
            postData.Url != undefined && postData.Url != ""
              ? postData.Url
              :popupData[0]?.href != undefined && popupData[0]?.href != null ? popupData[0]?.href.Url : '',
          Url:
            postData.Url != undefined && postData.Url != ""
              ? postData.Url
              : popupData[0]?.href != undefined && popupData[0]?.href != null ? popupData[0]?.href.Url : '',
        },
        IsVisible: isVisible,
        ownersonly: owner,
      })
      .then((res: any) => {
        console.log(res);
        CloseAddPopup();
        loadTopNavigation();
      });
  };
  const changeParent = () => {
    setChangeroot(true);
  };
  const ClosechangePopup = () => {
    setChangeroot(false);
  };
  const sortItem = (item: any) => {
    var neeArray: any = [];
    item?.map((val: any) => {
      val.SortOrder = val?.SortOrder?.toString();
    });
    neeArray = item.sort(customSort);
    setSortedArray(neeArray);
    setData(neeArray);
    setSorting(true);
  };
  function customSort(a: any, b: any) {
    if (a.SortOrder === undefined || a.SortOrder === null) return -1;
    if (b.SortOrder === undefined || b.SortOrder === null) return 1;

    return a.SortOrder - b.SortOrder;
  }

  const ClosesortItem = () => {
    setPostData(undefined);
    setSorting(false);
  };
  const sortBy = (type: any) => {
    const copy = [...data]; 
    if (type === "Title") {
      copy.sort((a: any, b: any) => (a.Title > b?.Title ? 1 : -1));
      copy.forEach((item, index) => {
        item.SortOrder = index + 1;
      });
    } else if (type === "SortOrder") {
      copy.forEach((val: any) => {
        if (val.SortOrder !== undefined) {
          val.SortOrder = parseInt(val?.SortOrder);
        }
      });
      copy.sort((a: any, b: any) => (a?.SortOrder > b?.SortOrder ? 1 : -1));
    }
    setData([...copy]);
  };
  const sortByDng = (type: any) => {
    const copy = [...data]; 
  if (type === "Title") {
    copy.sort((a: any, b: any) => (a?.Title > b?.Title ? -1 : 1));
    copy.forEach((item, index) => {
      item.SortOrder = index + 1;
    });
  } else if (type === "SortOrder") {
    copy.forEach((val: any) => {
      if (val.SortOrder !== undefined) {
        val.SortOrder = parseInt(val?.SortOrder);
      }
    });
    copy.sort((a: any, b: any) => (a?.SortOrder > b?.SortOrder ? -1 : 1));
  }
  setData([...copy]);
  };
  const updateSortOrder = async () => {
    console.log(sortId);
    console.log("abc",sortOrder);
    let web = new Web(dynamicData.dynamicData.siteUrl);

    await web.lists
      .getById(ListId)
      .items.getById(sortId)
      .update({
        SortOrder: sortOrder,
      })
      .then((res: any) => {
        console.log(res);
        ClosesortItem();
      });
  };
  const UpdateParentLevelData = () => {
    if (childData != undefined && childData.length > 0) {
      setPostData({ ...postData, ParentId: childData[0]?.Id });
    } else {
      if (ParentData != undefined && ParentData.length > 0) {
        setPostData({ ...postData, ParentId: ParentData[0]?.Id });
      }
    }

    ClosechangePopup();
  };
  const column = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        header: "",
        accessorKey: "Title",
        placeholder: "Title",
        size: 160,
      },
      {
        header: "",
        accessorKey: "SortOrder",
        placeholder: "SortOrder",
        size: 100,
      },
    ],
    [data]
  );
  const callBackData = React.useCallback((elem: any, ShowingData: any) => {},
  []);

  const SortedData = (newDatas: any, items: any) => {
    newData = newDatas;
    items["newSortOrder"] = newData;
    MydataSorted.push(items);
  };

  const inputSortOrder = async () => {
    let count: number = 0;
    const uniqueArray = data.filter(
      (item: any, index: any, self: any) =>
        index === self.findIndex((i: any) => i.Id === item.Id)
    );
       console.log("Unique Array",uniqueArray);
    if (uniqueArray?.length > 0 && uniqueArray != undefined) {
      uniqueArray?.map(async (items: any) => {
        let web = new Web(dynamicData.dynamicData.siteUrl);
        await web.lists
          .getById(ListId)
          .items.getById(items.Id)
          .update({
            SortOrder: parseInt(items.SortOrder),
          })
          .then((res: any) => {
            count = count + 1;
            if (count == uniqueArray?.length) {
              console.log(res);
              ClosesortItem();
              newData = "";
              MydataSorted = [];
              loadTopNavigation();
            }
          });
      });
    }
  };

  // const handleDragEnd = (result:any) => {
  //     if (!result.destination) {
  //       return;
  //     }

  //     const items : any = Array.from(data);
  //     const [reorderedItem]:any = items.splice(result.source.index, 1);
  //     items.splice(result.destination.index, 0, reorderedItem);

  //     // Update IDs based on the new order
  //     const updatedItems : any = items.map((item:any, index:any) => ({
  //       ...item,
  //       id: index + 1,
  //     }));

  //     setData(updatedItems);
  //   };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    // Use the spread operator to create a shallow copy of the array
    const items = [...data];

    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update IDs based on the new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      newSortOrder: index + 1,
      SortOrder: index + 1,
    }));

    MydataSorted = updatedItems;
    setData(updatedItems);
  };

  const handleOrderDoubleClick = (index: any) => {
    // Enable editing of the order column on double-click
    setEditableOrder(index);
  };
  const ClosedeletePopup = () => {
    setDeletePopup(false);
  };
  const handleOrderChange = (e: any, index: any) => {
    if (e.target.value != undefined) {
      const newOrder = parseInt(e.target.value, 10);
      setTimeout(() => {
        if (!isNaN(newOrder)) {
          const updatedItems = data.map((item, i) => ({
            ...item,
            SortOrder: i === index ? newOrder : item.SortOrder,
            newSortOrder: i === index ? newOrder : item.SortOrder,
          }));
          const updatedItems2: any = updatedItems.sort(
            (a, b) => a.SortOrder - b.SortOrder
          );
          MydataSorted=updatedItems2;
          setData(MydataSorted);
          setEditableOrder(null);
        }
      }, 1000);
    }
  };
  const deleteDataFromPopup = async (Id:any) => {
    var deleteConfirmation = confirm("Are you sure, you want to delete this?");
    if (deleteConfirmation) {
      let web = new Web(dynamicData.dynamicData.siteUrl);
      await web.lists
        .getById(ListId)
        .items.getById(Id)
        .delete()
        .then((i) => {
          console.log(i);
          ClosedeletePopup()
          ClosePopup();
          loadTopNavigation();
        });
    }
  }
  const headerforDelectitems = () => {
    return (
      <>
        <div className="subheading siteColor">Select items for delete</div>
        <Tooltip ComponentId="1810" />
      </>
    );
  };

  const handleRadioChange = (value:any) => {
    if (value === "visible") {
      setisVisible(true);
    } else if (value === "noShow") {
      setisVisible(false);
    }
  };
  return (
    <>
      <div className="row">
        <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active p-0">
          <div className="siteColor headign">Update TopNavigation - ({CurrentSite})</div>
          <div className="text-end fs-6">
          <span className="hyperlink me-3" onClick={() => sortItem(root)} >Change Sort Order</span>
              <a
                data-interception="off"
                target="_blank"
                href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/UpdateTopNavigation-old.aspx"
              >
                Old Update TopNavigation
              </a>
          </div>
          
          </h2>
   
      </div>
      <div className=" newupdatenav p-0 row"  id="TopNavRound">
        <ul className="top-navigate  p-0">
       
         {root.map((item) => {
            return (
              <>
                <li className="parent">
                  {item.image != undefined ? (
                    <span>
                      <img src={item?.image} className="workmember" />
                    </span>
                  ) : (
                    <span>
                      <img src={item?.image} />
                    </span>
                  )}

                  <span>
                    {" "}
                    <a data-interception="off" target="_blank" href={item.href?.Url}>{item.Title}</a>
                  </span>
                  <span className="float-end ms-2">
                    <span
                      className="alignIcon svg__iconbox svg__icon--editBox"
                      onClick={() => editPopup(item,'Parent')}
                    ></span>
                   
                    {/* <span
                      className="svg__iconbox svg__icon--trash"
                      onClick={() => deleteDataFunction(item)}
                    ></span> */}
                  </span>
                  <ul className="sub-menu">
                    <li onClick={() => AddNewItem(item)}>
                      <span className="alignIcon  svg__iconbox svg__icon--Plus"></span> Add Level{" "}
                    </li>
                    {item.childs?.map((child: any) => {
                      return (
                        <>
                          <li className="pre">
                            {child.image != undefined ? (
                              <span className="pe-1">
                                <img
                                  src={child?.image}
                                  className="workmember"
                                />
                              </span>
                            ) : (
                              <span>
                                <img src={child?.image} />
                              </span>
                            )}
                            <span>
                              <a data-interception="off" target="_blank" href={child.href?.Url}>{child.Title}</a>
                            </span>
                            <span className="float-end">
                              <span
                                className="alignIcon svg__iconbox svg__icon--editBox"
                                onClick={() => editPopup(child,item?.Title)}
                              ></span>
                              <span
                                className="alignIcon svg__iconbox svg__icon--Switcher"
                                onClick={() => sortItem(item.childs)}
                              ></span>
                              {/* <span
                                className="svg__iconbox svg__icon--trash"
                                onClick={() => deleteDataFunction(child)}
                              ></span> */}
                            </span>
                            <ul className="sub-menu">
                              <li onClick={() => AddNewItem(child)}>
                                <span className="alignIcon  svg__iconbox svg__icon--Plus"></span>{" "}
                                Add Level{" "}
                              </li>
                              {child.childs?.map((subchild: any) => {
                                return (
                                  <>
                                    <li className="pre">
                                      {subchild.image != undefined ? (
                                        <span className="pe-1">
                                          <img
                                            src={subchild?.image}
                                            className="workmember"
                                          />
                                        </span>
                                      ) : (
                                        <span>
                                          <img src={subchild?.image} />
                                        </span>
                                      )}
                                     
                                      <span>
                                        <a data-interception="off" target="_blank" href={subchild.href?.Url}>
                                          {subchild.Title}
                                        </a>
                                      </span>
                                      <span className="float-end">
                                        <span
                                          className="alignIcon svg__iconbox svg__icon--editBox"
                                          onClick={() => editPopup(subchild,child?.Title)}
                                        ></span>
                                        <span
                                          className="alignIcon svg__iconbox svg__icon--Switcher"
                                          onClick={() => sortItem(child.childs)}
                                        ></span>
                                        {/* <span
                                          className="svg__iconbox svg__icon--trash"
                                          onClick={() =>
                                            deleteDataFunction(subchild)
                                          }
                                        ></span> */}
                                      </span>

                                      <ul className="sub-menu">
                                        <li
                                          onClick={() => AddNewItem(subchild)}
                                        >
                                          <span
                                            className=" alignIcon  svg__iconbox svg__icon--Plus"
                                          ></span>{" "}
                                          Add Level{" "}
                                        </li>
                                        {subchild.childs?.map(
                                          (subchildLast: any) => {
                                            return (
                                              <>
                                                <li className="pre">
                                                  {subchildLast.image !=
                                                  undefined ? (
                                                    <span className="pe-1">
                                                      <img
                                                        src={
                                                          subchildLast?.image
                                                        }
                                                        className="workmember"
                                                      />
                                                    </span>
                                                  ) : (
                                                    <span>
                                                      <img
                                                        src={
                                                          subchildLast?.image
                                                        }
                                                      />
                                                    </span>
                                                  )}
                                                  
                                                  <span>
                                                    <a data-interception="off" target="_blank"
                                                      href={
                                                        subchildLast.href?.Url
                                                      }
                                                    >
                                                      {subchildLast.Title}
                                                    </a>
                                                  </span>
                                                  <span className="float-end">
                                                    <span
                                                      className="alignIcon svg__iconbox svg__icon--editBox"
                                                      onClick={() =>
                                                        editPopup(subchildLast,subchild?.Title)
                                                      }
                                                    ></span>
                                                    <span
                                                      className="alignIcon svg__iconbox svg__icon--Switcher"
                                                      onClick={() =>
                                                        sortItem(
                                                          subchild.childs
                                                        )
                                                      }
                                                    ></span>
                                                    {/* <span
                                                      className="svg__iconbox svg__icon--trash"
                                                      onClick={() =>
                                                        deleteDataFunction(
                                                          subchildLast
                                                        )
                                                      }
                                                    ></span> */}
                                                  </span>
                                                </li>
                                              </>
                                            );
                                          }
                                        )}
                                      </ul>
                                    </li>
                                  </>
                                );
                              })}
                            </ul>
                          </li>
                        </>
                      );
                    })}
                  </ul>
                </li>
              </>
            );
          })}
             <li className="parent" onClick={() => AddNewItem("New")}>
            <span className="alignIcon  svg__iconbox svg__icon--Plus bg-white"></span> Add Level{" "}
          </li>
        </ul>
      </div>

      <Panel
        onRenderHeader={onRenderCustomHeaderUpdate}
        headerText="Edit Category"
        type={PanelType.custom}
        customWidth="850px"
        isOpen={EditPopup}
        onDismiss={ClosePopup}
        isBlocking={false}
      >
        <div className="modal-body">
          <div className="row mt-2">
            <div className="col-sm-2">
              <div className="form-group">
                <label>
                  <b>Parent</b>
                </label>
              </div>
            </div>
            <div className="col-sm-5">
              <div className="form-group">
                <label>
                  {popupData[0]?.ParentTitle != undefined && popupData[0]?.ParentTitle != ""
                    ? popupData[0]?.ParentTitle
                    : "Root"}
                </label>
              </div>
            </div>
            <div className="col-sm-5">
              <div className="form-group">
                <label>Change Parent</label>
                <span
                  className="alignIcon ms-1 svg__iconbox svg__icon--editBox"
                  onClick={() => changeParent()}
                ></span>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-2">
              <div className="form-group">
                <label>
                  <b>Visibility</b>
                </label>
              </div>
            </div>
            {/* <div className="col-sm-5">
              <span className="col-sm-2">
                <label className="rediobutton">
                  <span className="SpfxCheckRadio">
                    <input
                      type="radio"
                      className="radio"
                      name="radio1"
                      checked={isVisible==true?isVisible:false}
                      onChange={(e) => setisVisible(true)}
                    />
                    Visible (All)
                  </span>
                </label>
              </span>
              <span className="col-sm-2">
                <label className="rediobutton">
                  <span className="SpfxCheckRadio">
                    <input
                      type="radio"
                      className="radio"
                      name="radio2"
                      checked={isVisible==false?isVisible:false}
                      onChange={(e) => setisVisible(true)}
                    />
                    No Show{" "}
                  </span>
                </label>
              </span>
            </div> */}
            <div className="col-sm-5">
  <span className="col-sm-2">
    <label className="rediobutton">
      <span className="SpfxCheckRadio">
        <input
          type="radio"
          className="radio"
          name="radio1"
          checked={isVisible === true}
          onChange={() => handleRadioChange("visible")}
        />
        Visible (All)
      </span>
    </label>
  </span>
  <span className="col-sm-2">
    <label className="rediobutton">
      <span className="SpfxCheckRadio">
        <input
          type="radio"
          className="radio"
          name="radio2"
          checked={isVisible === false}
          onChange={() => handleRadioChange("noShow")}
        />
        No Show
      </span>
    </label>
  </span>
</div>
            <div className="col-sm-5">
              <div className="form-group">
                <label>
                  <input
                    type="Checkbox"
                    className="form-check-input me-1"
                    onChange={() => setOwner(true)}
                  />
                  Facilitators Only
                </label>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-2">
              <div className="form-group">
                <label>
                  <b>Title</b>
                </label>
              </div>
            </div>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                defaultValue={popupData[0]?.Title}
                onChange={(e) =>
                  setPostData({ ...postData, Title: e.target.value })
                }
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-2">
              <div className="form-group">
                <label>
                  <b>Url</b>
                </label>
              </div>
            </div>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                defaultValue={popupData[0]?.href?.Url}
                onChange={(e) =>
                  setPostData({ ...postData, Url: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <footer
          className="bg-f4"
          style={{
            position: "absolute",
            width: "100%",
            bottom: "0px",
            zIndex: "9",
            left: "0px",
          }}
        >
          <div className="align-items-center d-flex justify-content-between me-3 px-4 py-2">
            <div className="col">
              <div className="text-left">
                Created
                <> {popupData[0]?.CreatedDate} </>
                by{" "}
                <span className="siteColor">
                  {" "}
                  {popupData[0]?.Author?.Title}{" "}
                </span>
              </div>
              <div className="text-left">
                Last modified
                <span>{popupData[0]?.ModifiedDate}</span>
                by{" "}
                <span className="siteColor">
                  {" "}
                  {popupData[0]?.Editor?.Title}{" "}
                </span>
              </div>
              <div className="text-left">
                Delete this item
                <span
                  className="alignIcon  svg__iconbox svg__icon--trash"
                  onClick={() => deleteDataFunction(popupData[0], 'single')}
                ></span>
                    <span className="text-left" onClick={()=>setVersionHistoryPopup(false)}>
                  {popupData[0]?.Id && <VersionHistory taskId={popupData[0]?.Id} listId={ListId} listName = "TopNavigation" siteUrls={dynamicData.dynamicData.siteUrl} RequiredListIds={AllListId} />}
              </span>
              </div>
         
                                
                               
            </div>
            <div className="col  text-end">
              <a
               
                data-interception="off"
                target="_blank"
                href={`${dynamicData.dynamicData.siteUrl}/Lists/TopNavigation/AllItems.aspx`}
              >
                Open out-of-the-box form
              </a>
              <button
            
                type="button"
                className="btn btn-primary ms-2"
                onClick={() => UpdateData(popupData[0])}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-default ms-2"
                onClick={() => ClosePopup()}
              >
                Cancel
              </button>
            </div>
          </div>
        </footer>
      </Panel>



      <Panel
        onRenderHeader={onRenderCustomHeaderAdd}
        headerText="Edit Category"
        type={PanelType.custom}
        customWidth="850px"
        isOpen={AddPopup}
        onDismiss={CloseAddPopup}
        isBlocking={false}
      >
        <div className="modal-body">
          <div className="row mt-2">
            <div className="col-sm-2">
              <div className="form-group">
                <label>
                  <b>Parent</b>
                </label>
              </div>
            </div>
            <div className="col-sm-5">
              <div className="form-group">
                <label>Root</label>
              </div>
            </div>
            <div className="col-sm-5">
              <div className="form-group">
                <label>Change Parent</label>
                <span
                  className="alignIcon ms-1 svg__iconbox svg__icon--editBox"
                  onClick={() => changeParent()}
                ></span>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-2">
              <div className="form-group">
                <label>
                  <b>Visibility</b>
                </label>
              </div>
            </div>
            <div className="col-sm-5">
              <span className="col-sm-2 padL-0 ">
                <label className="rediobutton">
                  <span className="SpfxCheckRadio">
                    <input
                      type="radio"
                      className="radio"
                      name="radio"
                      onChange={(e) => setisVisible(true)}
                    />
                    Visible (All)
                  </span>
                </label>
              </span>
              <span className="col-sm-2">
                <label className="rediobutton">
                  <span className="SpfxCheckRadio">
                    <input
                      type="radio"
                      className="radio"
                      name="radio"
                      onChange={(e) => setisVisible(false)}
                    />
                    No Show
                  </span>
                </label>
              </span>
            </div>
            <div className="col-sm-5">
              <div className="form-group">
                <label>
                  <input type="Checkbox" className="form-check-input me-1" />
                  Facilitators Only
                </label>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-2">
              <div className="form-group">
                <label>
                  <b>Title</b>
                </label>
              </div>
            </div>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                onChange={(e) =>
                  setPostData({ ...postData, Title: e.target.value })
                }
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-2">
              <div className="form-group">
                <label>
                  <b>Url</b>
                </label>
              </div>
            </div>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                onChange={(e) =>
                  setPostData({ ...postData, Url: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="modal-footer mt-3">
          <div className="row w-100">
            {/* <div className="col-sm-6 ps-0">
                            <div className="text-left">
                                Created
                                <span>12/12/2022</span>
                                by <span
                                    className="siteColor">Santosh</span>
                            </div>
                            <div className="text-left">
                                Last modified
                                <span>12/04/2023</span>
                                by <span
                                    className="siteColor">Santosh</span>
                            </div>
                        </div> */}
            <div className="text-end pe-0">
              {/* <a target="_blank"
                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=112`}>
                                Open out-of-the-box
                                form
                            </a> */}
              <button
                disabled={(postData != undefined && postData.Title != '')?false:true}
                type="button"
                className="btn btn-primary ms-2"
                onClick={() => Additem()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Panel>

      
      <Panel
        onRenderHeader={onRenderCustomHeaderSelect}
        headerText="Edit Category"
        type={PanelType.custom}
        customWidth="850px"
        isOpen={changeroot}
        onDismiss={ClosechangePopup}
        isBlocking={false}
      >
        <div className="modal-body border p-2" style={{ padding: "10px" }}>
          <div className="row mt-2">
            <div className="col-sm-2">
              <label>
                <b>Top Level</b>
              </label>
            </div>
            <div className="col-sm-10">
              <select
                className="full-width"
                value={value == "" ? "Select Item" : value}
                onChange={(e) => handleChange("Parent", e)}
              >
                <option value={""}>Root</option>
                {root?.map((item: any) => {
                  return (
                    <>
                      <option value={item.Title}>{item.Title}</option>
                    </>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-2">
              <label>
                <b>Second Level</b>
              </label>
            </div>
            <div className="col-sm-10">
              <select
                className="full-width"
                value={child == "" ? "Select Item" : child}
                onChange={(e) => handleChange("child", e)}
              >
                <option value={""}>Select</option>
                {ParentData?.map((item: any) => {
                  return (
                    <>
                      {item.childs?.map((child: any) => {
                        return (
                          <option value={child.Title}>{child.Title}</option>
                        );
                      })}
                    </>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-2">
              <label>
                <b>Third Level</b>
              </label>
            </div>
            <div className="col-sm-10">
              <select
                className="full-width"
                value={subchild}
                onChange={(e) => handleChange("subchild", e)}
              >
                <option value={""}>Select</option>

                {childData?.map((child: any) => {
                  return (
                    <>
                      {child.childs?.map((subchild: any) => {
                        return (
                          <>
                            <option value={subchild.Title}>
                              {subchild.Title}
                            </option>
                          </>
                        );
                      })}
                    </>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer mt-3">
          <div className="row w-100">
            <div className="text-end pe-0">
              <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={() => UpdateParentLevelData()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Panel>
      <Panel
        onRenderHeader={onRenderCustomHeaderSortOrder}
        headerText="Edit Category"
        type={PanelType.custom}
        customWidth="600px"
        isOpen={sorting}
        onDismiss={ClosesortItem}
        isBlocking={false}
      >
       <div className="mb-2">
        <b>NOTE :</b>
        <span className="ms-1">You can SortOrder by using Drag & Drop</span>
       </div>
         
        <div className="Alltable">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sortableTable">
              {(provided:any) => (
                <table
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="table table-hover mb-0"
                  id="EmpTable"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "80%" }}>
                        <div
                          style={{ width: "100%" }}
                          className="position-relative smart-relative p-1"
                        >
                          <input
                            id="searchClientCategory"
                            type="search"
                            placeholder="Title"
                            title="Client Category"
                            className="full_width searchbox_height bg-Ff"
                            onChange={SearchedData}
                            autoComplete="off"
                          />
                          <span className="sorticon" style={{ top: "5px" }}>
                            <span
                              className="up"
                              onClick={() => sortBy("Title")}
                            >
                              <FaAngleUp />
                            </span>
                            <span
                              className="down"
                              onClick={() => sortByDng("Title")}
                            >
                              <FaAngleDown />
                            </span>
                          </span>
                        </div>
                      </th>

                      <th style={{ width: "20%" }}>
                       
                        <div
                        style={{ width: "100%" }}
                        className="position-relative smart-relative  p-1"
                      >
                        <input
                          id="
                          "
                          type="search"
                          placeholder="SortOrder"
                          title="Client Category"
                          className="full_width searchbox_height bg-Ff"
                          onChange={SearchedData}
                          autoComplete="off"
                        />
                        <span className="sorticon" style={{ top: "5px" }}>
                          <span
                            className="up"
                            onClick={() => sortBy("SortOrder")}
                          >
                            <FaAngleUp />
                          </span>
                          <span
                            className="down"
                            onClick={() => sortByDng("SortOrder")}
                          >
                            <FaAngleDown />
                          </span>
                        </span>
                      </div>
                       
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map(function (item, index) {
                        if (
                          search == "" ||
                          item?.Title?.toLowerCase().includes(
                            search.toLowerCase()
                          ) ||
                          search == "" ||
                          item?.SortOrder?.toLowerCase().includes(
                            search.toLowerCase()
                          )
                        ) {
                          return (
                            <>
                              {" "}
                              <Draggable
                                key={item.Id}
                                draggableId={item.Id.toString()}
                                index={index}
                              >
                                {(provided:any) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="bold for-c0l"
                                  >
                                    <td className="px-1">{item?.Title}</td>
                                    <td
                                      className="px-1"
                                      onDoubleClick={() =>
                                        handleOrderDoubleClick(index)
                                      }
                                      onBlur={() => {
                                        // Check if the edited value is valid before disabling editing
                                        if (
                                          !isNaN(
                                            parseInt(data[index].order, 10)
                                          )
                                        ) {
                                          setEditableOrder(null);
                                        }
                                      }}
                                    >
                                      {editableOrder === index ? (
                                        <>
                                          <input
                                            type="text"
                                            id="searchClientCategory"
                                            title="Client Category"
                                            className="full_width searchbox_height bg-Ff"
                                            defaultValue={item?.SortOrder}
                                            onChange={(e) =>
                                              handleOrderChange(e, index)
                                            }
                                            onFocus={(e) => e.target.select()}
                                          />
                                          {/* <button onClick={handleButtonClick}>Edit</button> */}
                                        </>
                                      ) : (
                                        <input
                                          type="text"
                                          id="searchClientCategory"
                                          title="Client Category"
                                          className="full_width searchbox_height bg-Ff"
                                          defaultValue={item?.SortOrder}
                                          disabled
                                        />
                                      )}
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            </>
                          );
                        }
                      })}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="mt-3">
          <footer className="d-flex justify-content-between w-100">
            <div className="mt-2">
              <a
                data-interception="off"
                target="_blank"
                href={`${dynamicData.dynamicData.siteUrl}/Lists/TopNavigation/AllItems.aspx`}
              >
                Open out-of-the-box form
              </a>
            </div>
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={() => inputSortOrder()}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-default ms-2"
                onClick={() => ClosesortItem()}
              >
                Cancel
              </button>
            </div>
          </footer>
        </div>
      </Panel>
       {/* ---------------------------------------delete popup-------------------------------------------------------------------------------------- */}

       <Panel
        onRenderHeader={headerforDelectitems}
        headerText="Delete Item"
        type={PanelType.custom}
        customWidth="500px"
        isOpen={deletePopup}
        onDismiss={ClosedeletePopup}
        isBlocking={false}
      >
        <div className="modal-body border p-2 bg-f5f5 bdrbox clearfix" style={{ padding: "10px" }}>
          <div className='col-sm-12'><h3 className="f-15 mt-0">Item Tagged with {deletePopupData[0]?.Title}</h3></div>
          <div className='col-sm-12 mb-4' style={{color:'blue'}}><h3 className="panel-title"><span> All Tagged Childs</span></h3></div>
          <div className="custom-checkbox-tree">
            {deletePopupData?.map((val: any,index) => {
              return (
                <div>
                 <div style={{fontWeight:'600'}}><span>{index+1}. </span> <span>{val?.Title}</span></div>
                  {val.childs?.map((childs: any,number:any) => {
                    return (
                      <div style={{ marginLeft: '30px', marginBottom: "7px" }}>
                        <div style={{fontWeight:'400'}}><span>{index+1}.{number+1}. </span><span>{childs?.Title}</span></div>
                        {childs.childs?.map((subchilds: any,subNumber:any) => {
                          return (
                            <div style={{ marginLeft: '30px', marginBottom: "7px" }}>
                              <div style={{fontWeight:'400'}}><span>{index+1}.{number+1}.{subNumber+1}. </span><span>{subchilds?.Title}</span></div>
                            </div>

                          )

                        })}
                      </div>

                    )

                  })}
                </div>
              )
            })}


          </div>
        </div>

        <div className="modal-footer mt-3">
          <div className="row w-100">
            <div className="text-end pe-0">
              <button
                type="button"
                className="btn btn-primary ms-2"
                onClick={() => deleteDataFromPopup(deletePopupData[0].ParentID)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Panel >
    </>
  );
};
export default TopNavigation;
