import * as React from "react";
import { Component } from "react";
import * as $ from "jquery";
import * as Moment from "moment";
//import '../../cssFolder/foundation.scss';
import { Modal, Panel, PanelType } from "office-ui-fabric-react";
//import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaPrint,
  FaFileExcel,
  FaPaintBrush,
  FaSearch,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaInfoCircle,
  FaChevronRight,
  FaChevronDown,
  FaMinus,
  FaPlus,
  FaCompressArrowsAlt,
} from "react-icons/fa";
import { CSVLink } from "react-csv";
import pnp, { Web, SearchQuery, SearchResults, UrlException } from "sp-pnp-js";
//import SmartFilter from './SmartFilter';
//import '../../cssFolder/foundation.scss';
import { map } from "jquery";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import ExpndTable from "../../../globalComponents/ExpandTable/Expandtable";
import { GlobalConstants } from "../../../globalComponents/LocalCommon";
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import { PortfolioStructureCreationCard } from "../../../globalComponents/tableControls/PortfolioStructureCreation";
import CreateActivity from "../../servicePortfolio/components/CreateActivity";
import CreateWS from "../../servicePortfolio/components/CreateWS";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "../../../globalComponents/Tooltip";
import {
  Column, Table,
  ExpandedState, useReactTable, getCoreRowModel, getFilteredRowModel, getExpandedRowModel, ColumnDef, flexRender, getSortedRowModel, SortingState,
  ColumnFiltersState, FilterFn, getFacetedUniqueValues, getFacetedRowModel
} from "@tanstack/react-table";
import { RankingInfo, rankItem, compareItems } from "@tanstack/match-sorter-utils";
import "bootstrap/dist/css/bootstrap.min.css";
import { HTMLProps } from "react";
import HighlightableCell from "../../componentPortfolio/components/highlight";
import Loader from "react-loader";
import ShowTeamMembers from "../../../globalComponents/ShowTeamMember";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
// import GlobalCommanTable from "../../../globalComponents/GlobalCommanTable";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import * as XLSX from "xlsx";
import saveAs from "file-saver";
var filt: any = "";
var siteConfig: any = [];
var ComponentsDataCopy: any = [];
var SubComponentsDataCopy: any = [];
var FeatureDataCopy: any = [];
var array: any = [];
var childsData: any = [];
let ChengedTitle: any = "";
var ContextValue: any = {};
let AllActivitysData: any = [];
let AllWorkStreamData: any = [];
let globalFilterHighlited: any;
let showPopHover: any;
let popHoverDataGroup: any = []
let Renderarray: any = [];
let AllDataRender: any = [];
let forceExpanded: any = [];
let activity = 0;
let workstrim = 0;
let task = 0;
// ReactTable Part/////
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

///Global Filter Parts//////
// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <>
      <div className="container-2 mx-1">
        <span className="icon"><FaSearch /></span>
        <input type="search" id="search" {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)} />
      </div>
    </>
  );
}


function Filter({
  column,
  table,
  placeholder,
}: {
  column: Column<any, any>;
  table: Table<any>;
  placeholder: any;
}): any {
  const columnFilterValue = column.getFilterValue();
  // style={{ width: placeholder?.size }}
  return (
    <input
      className="me-1 mb-1 on-search-cross form-control "
      // type="text"
      title={placeholder?.placeholder}
      type="search"
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
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
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
      className={className + "  cursor-pointer form-check-input rounded-0"}
      {...rest}
    />
  );
}

// ReactTable Part end/////

function ComponentTable(SelectedProp: any) {
  try {
    if (SelectedProp?.SelectedProp != undefined) {
      SelectedProp.SelectedProp.isShowTimeEntry = JSON.parse(
        SelectedProp?.SelectedProp?.TimeEntry
      );

      SelectedProp.SelectedProp.isShowSiteCompostion = JSON.parse(
        SelectedProp?.SelectedProp?.SiteCompostion
      );
    }
  } catch (e) {
    console.log(e);
  }
  // const [selectedSearchDuration, setSelectedSearchDuration] = React.useState("All Words");
  const [Display, setDisplay] = React.useState("none");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const refreshData = () => setData(() => array);
  const rerender = React.useReducer(() => ({}), {})[1];
  const [loaded, setLoaded] = React.useState(true);
  const [color, setColor] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [popHoverData, setPopHoverData] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState("");
  globalFilterHighlited = globalFilter;
  const [checkData, setcheckData] = React.useState([])
  const [showTeamMemberOnCheck, setShowTeamMemberOnCheck] = React.useState(false)
  const [ShowTeamPopup, setShowTeamPopup] = React.useState(false);
  const [checkCounter, setCheckCounter] = React.useState(true)
  const [createTaskId, setCreateTaskId] = React.useState({});
  const [isOpenCreateTask, setisOpenCreateTask] = React.useState(false);

  const [maidataBackup, setmaidataBackup] = React.useState([]);
  const [search, setSearch]: [string, (search: string) => void] = React.useState("");
  const [data, setData] = React.useState([]);
  Renderarray = data;
  const refreshDataTaskLable = () => setData(() => Renderarray);
  const [Title, setTitle] = React.useState();
  const [ComponentsData, setComponentsData] = React.useState([]);
  const [SubComponentsData, setSubComponentsData] = React.useState([]);
  const [TotalTask, setTotalTask] = React.useState([]);
  //const [childsData, setchildsData] = React.useState<any>([])
  const [ActivityDisable, setActivityDisable] = React.useState(true);
  // const [checkedList, setMeetingItems] = React.useState<any>([])
  const [ActivityPopup, setActivityPopup] = React.useState(false);
  const [TaggedAllTask, setTaggedAllTask] = React.useState([]);
  const [FeatureData, setFeatureData] = React.useState([]);
  const [MeetingPopup, setMeetingPopup] = React.useState(false);
  // const [table, setTable] = React.useState(data);
  const [WSPopup, setWSPopup] = React.useState(false);
  const [AllUsers, setTaskUser] = React.useState([]);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [filterGroups, setFilterGroups] = React.useState([]);
  const [filterItems, setfilterItems] = React.useState([]);
  const [AllMetadata, setMetadata] = React.useState([])
  const [AllClientCategory, setAllClientCategory] = React.useState([])
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [IsTask, setIsTask] = React.useState(false);
  const [SharewebTask, setSharewebTask] = React.useState("");
  const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  const [ShowSelectdSmartfilter, setShowSelectdSmartfilter] = React.useState(
    []
  );

  const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
  const [checked, setchecked] = React.useState([]);
  const [IsUpdated, setIsUpdated] = React.useState("");
  const [tablecontiner, settablecontiner]: any = React.useState("hundred");
  const [Isshow, setIsshow] = React.useState(false);
  const [checkedList, setCheckedList] = React.useState([]);
  const [TotalArrayBackup, setTotalArrayBackup] = React.useState([]);
  const [IsSmartfilter, setIsSmartfilter] = React.useState(false);
  const [AllTasksData, setAllTasks] = React.useState([]);
  const [AllMasterTasks, setAllMasterTasks] = React.useState([]);
  const [AllCountItems, setAllCountItems] = React.useState({
    AllComponentItems: [],
    AllSubComponentItems: [],
    AllFeaturesItems: [],
    AfterSearchComponentItems: [],
    AfterSearchSubComponentItems: [],
    AfterSearchFeaturesItems: [],
  });
  const [OldArrayBackup, setOldArrayBackup] = React.useState([]);
  const [NewArrayBackup, setNewArrayBackup] = React.useState([]);
  const [ResturuningOpen, setResturuningOpen] = React.useState(false);
  const [RestructureChecked, setRestructureChecked] = React.useState([]);
  const [ChengedItemTitl, setChengedItemTitle] = React.useState("");
  const [checkSubChilds, setCheckSubChilds]: any = React.useState([]);
  const [componentRestruct, setComponentRestruct]: any = React.useState(false);
  const [restructuredItemarray, setRestructuredItemarray]: any = React.useState([]);
  const [newItemBackUp, setNewItemBackUp]: any = React.useState([]);
  const [taskTypeId, setTaskTypeId]: any = React.useState([]);



  //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------

  var IsExitSmartfilter = function (array: any, Item: any) {
    var isExists = false;
    var count = 0;
    Item.MultipleTitle = "";
    map(array, (item) => {
      if (
        item.TaxType != undefined &&
        Item.Title != undefined &&
        item.TaxType == Item.Title
      ) {
        isExists = true;
        count++;
        Item.MultipleTitle += item.Title + ", ";
        return false;
      }
    });
    if (Item.MultipleTitle != "")
      Item.MultipleTitle = Item.MultipleTitle.substring(
        0,
        Item.MultipleTitle.length - 2
      );
    Item.count = count;
    return isExists;
  };

  var issmartExists = function (array: any, title: any) {
    var isExists = false;
    map(array, (item) => {
      if (item.Title == title.Title) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
  const closeTaskStatusUpdatePoup2 = () => {
    checkedList?.forEach((val: any): any => {
      val.chekBox = false;
    });
    setActivityPopup(false);
  };
  const openActivity = () => {
    if (checkedList.length > 1) {
      alert(
        "More than 1 Parents selected, Select only 1 Parent to create a child item"
      );
    } else {
      if (checkedList[0] != undefined) {
        if (checkedList[0].TaskType != undefined) {
          if (checkedList[0].TaskType.Title === "Activities") {
            setWSPopup(true);
          }
        }
        if (
          checkedList != undefined &&
          checkedList[0].TaskType?.Title === "Workstream"
        ) {
          setActivityPopup(true);
        }
        if (
          checkedList[0].Portfolio_x0020_Type === "Service" &&
          checkedList[0].TaskType === undefined
          // &&
          // checkedList[0] === undefined
        ) {
          checkedList[0]["NoteCall"] = "Activities";
          setActivityPopup(true);
        }
        if (
          checkedList[0].Portfolio_x0020_Type === "Component" &&
          checkedList[0].TaskType === undefined
          // &&
          // checkedList[0] == undefined
        ) {
          setActivityPopup(true);
        }
      }
    }

    if (
      checkedList[0] != undefined &&
      checkedList[0].TaskType != undefined
    ) {
      if (checkedList[0].TaskType.Title == "Activities") {
        setWSPopup(true);
        // checkedList.push(checkedList[0]);
        //setMeetingItems(childsData)
      }
    }

    if (
      checkedList[0] != undefined &&
      checkedList[0].TaskType.Title == "Workstream"
    ) {
      setActivityPopup(true);
      // checkedList.push(checkedList[0]);
    }
  };
  const ShowSelectedfiltersItems = () => {
    var ArrayItem: any = [];
    var arrayselect: any = [];
    $.each(filterItems, function (index: any, newite: any) {
      if (newite.Selected === true) {
        arrayselect.push(newite);
      }
      if (newite.childs != undefined && newite.childs.length > 0) {
        newite.childs.forEach((obj: any) => {
          if (obj.Selected === true) {
            arrayselect.push(obj);
          }
        });
      }
    });
    if (arrayselect != undefined) {
      map(arrayselect, (smart) => {
        var smartfilterItems: any = {};
        smartfilterItems.Title = smart.TaxType;
        if (IsExitSmartfilter(arrayselect, smartfilterItems)) {
          if (smartfilterItems.count >= 3) {
            smartfilterItems.selectTitle =
              " : (" + smartfilterItems.count + ")";
          } else
            smartfilterItems.selectTitle =
              " : " + smartfilterItems.MultipleTitle;
        }
        if (!issmartExists(ArrayItem, smartfilterItems))
          ArrayItem.push(smartfilterItems);
      });
    }
    setShowSelectdSmartfilter((ShowSelectdSmartfilter) => [...ArrayItem]);
  };

  const SingleLookDatatest = (e: any, item: any, value: any) => {
    const { checked } = e.target;
    if (checked) {
      item.Selected = true;
      if (item.childs != undefined && item.childs.length > 0) {
        map(item.childs, (child) => {
          child.Selected = true;
        });
      }
    } else {
      $.each(filterItems, function (index: any, newite: any) {
        if (newite.Title == item.Title) {
          newite.Selected = false;
        }
        if (newite.childs != undefined && newite.childs.length > 0) {
          newite.childs.forEach((obj: any) => {
            if (obj.Title == item.Title) {
              obj.Selected = false;
            }
          });
        }
      });
    }
    setfilterItems((filterItems) => [...filterItems]);
    ShowSelectedfiltersItems();
    // setState(state)
  };
  const Clearitem = () => {
    maidataBackup.forEach(function (val: any) {
      val.show = false;
      if (val.childs != undefined) {
        val.childs.forEach(function (i: any) {
          i.show = false;
          if (i.childs != undefined) {
            i.childs.forEach(function (subc: any) {
              subc.show = false;
              if (subc.childs != undefined) {
                subc.childs.forEach(function (last: any) {
                  last.show = false;
                });
              }
            });
          }
        });
      }
    });
    filterItems.forEach(function (itemm: any) {
      itemm.Selected = false;
    });

    setSubComponentsData(SubComponentsDataCopy);
    setFeatureData(FeatureDataCopy);
    setmaidataBackup(ComponentsDataCopy);
    setShowSelectdSmartfilter([]);

    setState([]);

    setData(maidataBackup);
    // const { checked } = e.target;
  };
  const getCommonItems = function (arr1: any, arr2: any) {
    var commonItems: any = [];
    arr1.forEach((item1: any) => {
      arr2.forEach((item2: any) => {
        if (item1.Id === item2.Id && item1.siteType == item2.siteType) {
          commonItems.push(item2);
          return false;
        }
      });
    });
    return commonItems;
  };

  const Updateitem = function () {
    var selectedFilters: any = [];
    $.each(filterItems, function (index: any, newite: any) {
      if (newite.Selected === true) {
        selectedFilters.push(newite);
      }
      if (newite.childs != undefined && newite.childs.length > 0) {
        newite.childs.forEach((obj: any) => {
          if (obj.Selected === true) {
            selectedFilters.push(obj);
          }
        });
      }
    });

    if (selectedFilters.length > 0) {
      var PortfolioItems: any = [];
      var PriorityItems: any = [];
      var TypeItems = [];
      var ResponsibilityItems: any = [];
      var ItemRankItems: any = [];
      var PercentCompleteItems: any = [];
      var DueDateItems: any = [];
      var isDueDateSelected = false;
      var SitesItems: any = [];
      var isSitesSelected = false;
      var isPortfolioSelected = false;
      var isPrioritySelected = false;
      var isItemRankSelected = false;
      var isTypeSelected = false;
      var isResponsibilitySelected = false;
      var isPercentCompleteSelected = false;
      var AllData: any = [];
      AllTasksData.forEach((item: any) => {
        AllData.push(item);
      });
      AllMasterTasks.forEach((item: any) => {
        AllData.push(item);
      });
      AllData.forEach((item: any) => {
        selectedFilters.forEach((filterItem: any) => {
          if (filterItem.Selected)
            switch (filterItem.TaxType) {
              case "Portfolio":
                if (item.Item_x0020_Type != undefined) {
                  if (
                    item.Item_x0020_Type != undefined &&
                    item.Item_x0020_Type == filterItem.Title &&
                    !isItemExistsNew(PortfolioItems, item)
                  ) {
                    PortfolioItems.push(item);
                    return false;
                  }
                }
                isPortfolioSelected = true;
                break;
              case "Priority":
                if (item.Priority != undefined) {
                  if (
                    item.Priority != undefined &&
                    item.Priority == filterItem.Title &&
                    !isItemExistsNew(PriorityItems, item)
                  ) {
                    PriorityItems.push(item);
                    return false;
                  }
                }
                isPrioritySelected = true;
                break;
              case "ItemRank":
                if (item.ItemRank != undefined) {
                  if (
                    item.ItemRank != undefined &&
                    item.ItemRank == filterItem.Title &&
                    !isItemExistsNew(ItemRankItems, item)
                  ) {
                    ItemRankItems.push(item);
                    return false;
                  }
                }
                isItemRankSelected = true;
                break;
              // case 'Sites':
              //     if (item.ItemRank != undefined) {
              //         if (item.siteType != undefined && item.siteType == filterItem.Title && !isItemExistsNew(SitesItems, item)) {
              //             SitesItems.push(item);
              //             return false;
              //         }
              //     }
              //     isSitesSelected = true;
              //     break;
              case "PercentComplete":
                if (item.PercentComplete != undefined) {
                  if (
                    item.PercentComplete != undefined &&
                    item.PercentComplete == filterItem.Title &&
                    !isItemExistsNew(PercentCompleteItems, item)
                  ) {
                    PercentCompleteItems.push(item);
                    return false;
                  }
                }
                isPercentCompleteSelected = true;
                break;
              case "Team Members":
                if (item.AllTeamName != undefined) {
                  if (
                    item.AllTeamName != undefined &&
                    item.AllTeamName.toLowerCase().indexOf(
                      filterItem.Title.toLowerCase()
                    ) > -1 &&
                    !isItemExistsNew(ResponsibilityItems, item)
                  ) {
                    ResponsibilityItems.push(item);
                    return false;
                  }
                }
                isResponsibilitySelected = true;
                break;
            }
        });
      });
      var commonItems: any = [];
      if (isPortfolioSelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, PortfolioItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...PortfolioItems];
      }
      if (isResponsibilitySelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, ResponsibilityItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...ResponsibilityItems];
      }
      if (isPrioritySelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, PriorityItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...PriorityItems];
      }
      if (isItemRankSelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, ItemRankItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...ItemRankItems];
      }
      if (isSitesSelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, SitesItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...SitesItems];
      }
      if (isPercentCompleteSelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, PercentCompleteItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...PercentCompleteItems];
      }
      let arrayItem = [...TotalArrayBackup];
      arrayItem.forEach((item: any, pareIndex: any) => {
        item.flag = false;
        if (item.childs != undefined && item.childs.length > 0) {
          item.childs.forEach((child: any, parentIndex: any) => {
            child.flag = false;
            if (child.childs != undefined && child.childs.length > 0) {
              child.childs.forEach((subchild: any, index: any) => {
                subchild.flag = false;
                if (
                  subchild.childs != undefined &&
                  subchild.childs.length > 0
                ) {
                  subchild.childs.forEach((subchilds: any, index: any) => {
                    subchilds.flag = false;
                    if (
                      subchilds.childs != undefined &&
                      subchilds.childs.length > 0
                    ) {
                      subchilds.childs.forEach(
                        (Lastsubchilds: any, index: any) => {
                          Lastsubchilds.flag = false;
                        }
                      );
                    }
                  });
                }
              });
            }
          });
        }
      });

      let Subcomponnet = commonItems.filter(
        (sub: { Item_x0020_Type: string }) =>
          sub.Item_x0020_Type === "SubComponent"
      );
      var Componnet = commonItems.filter(
        (sub: { Item_x0020_Type: string }) =>
          sub.Item_x0020_Type === "Component"
      );
      var Features = commonItems.filter(
        (sub: { Item_x0020_Type: string }) => sub.Item_x0020_Type === "Feature"
      );
      setAllCountItems({
        ...AllCountItems,
        AfterSearchComponentItems: Subcomponnet,
        AfterSearchSubComponentItems: Componnet,
        AfterSearchFeaturesItems: Features,
      });
      // var Subcomponnet = commonItems.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'SubComponent'));
      commonItems.forEach((filterItem: any) => {
        arrayItem.forEach((item: any, pareIndex: any) => {
          if (
            item.Id == filterItem.Id &&
            item.siteType.toLowerCase() == filterItem.siteType.toLowerCase()
          ) {
            item.flag = true;
            item.show = true;
          }
          if (item.childs != undefined && item.childs.length > 0) {
            item.childs.forEach((child: any, parentIndex: any) => {
              //  child.flag = false;
              if (
                child.Id == filterItem.Id &&
                child.siteType.toLowerCase() ==
                filterItem.siteType.toLowerCase()
              ) {
                item.childs[parentIndex].flag = true;
                arrayItem[pareIndex].flag = true;
                child.flag = true;
                item.childs[parentIndex].show = true;
                arrayItem[pareIndex].show = true;
              }
              if (child.childs != undefined && child.childs.length > 0) {
                child.childs.forEach((subchild: any, index: any) => {
                  //  subchild.flag = false;
                  if (
                    subchild.Id == filterItem.Id &&
                    subchild.siteType.toLowerCase() ==
                    filterItem.siteType.toLowerCase()
                  ) {
                    item.childs[parentIndex].flag = true;
                    child.flag = true;
                    child.childs[index].flag = true;
                    arrayItem[pareIndex].flag = true;
                    subchild.flag = true;
                    child.childs[index].show = true;
                    arrayItem[pareIndex].show = true;
                    subchild.show = true;
                  }
                  if (
                    subchild.childs != undefined &&
                    subchild.childs.length > 0
                  ) {
                    subchild.childs.forEach(
                      (subchilds: any, childindex: any) => {
                        //  subchilds.flag = false;
                        if (
                          subchilds.Id == filterItem.Id &&
                          subchilds.siteType.toLowerCase() ==
                          filterItem.siteType.toLowerCase()
                        ) {
                          subchilds.flag = true;
                          item.childs[parentIndex].flag = true;
                          subchild.flag = true;
                          subchild.childs[childindex].flag = true;
                          arrayItem[pareIndex].flag = true;
                          item.childs[parentIndex].show = true;
                          subchild.show = true;
                          subchild.childs[childindex].show = true;
                          arrayItem[pareIndex].show = true;
                        }
                        if (
                          subchild.childs != undefined &&
                          subchild.childs.length > 0
                        ) {
                          subchilds.childs.forEach(
                            (Lastsubchilds: any, subchildindex: any) => {
                              //   Lastsubchilds.flag = false;
                              if (
                                Lastsubchilds.Id == filterItem.Id &&
                                Lastsubchilds.siteType.toLowerCase() ==
                                filterItem.siteType.toLowerCase()
                              ) {
                                Lastsubchilds.flag = true;
                                item.childs[parentIndex].flag = true;
                                child.childs[index].flag = true;
                                subchilds.flag = true;
                                subchilds.childs[subchildindex].flag = true;
                                arrayItem[pareIndex].flag = true;

                                item.childs[parentIndex].show = true;
                                child.childs[index].show = true;
                                subchilds.show = true;
                                subchilds.childs[subchildindex].show = true;
                                arrayItem[pareIndex].show = true;
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      });
      setData((arrayItem) => [...arrayItem]);
    } else {
      setData((data) => [...TotalArrayBackup]);
    }
  };

  const CreateMeetingPopups = (item: any) => {
    setActivityPopup(false);
    setMeetingPopup(true);
    checkedList[0]["NoteCall"] = item;
  };


  const taskTypes = async () => {
    let web = new Web(ContextValue.siteUrl);
    await web.lists.getById(ContextValue.TaskTypeID)
      .items.
      select("Title", "Id", "Prefix", "Level").
      getAll().then((data: any) => {
        setTaskTypeId(data);
      }).catch((err: any) => {
        console.log(err);
      })
  }

  const LoadAllSiteTasks = function () {
    var Response: any = [];
    var Counter = 0;
    if (siteConfig != undefined && siteConfig.length > 0) {
      map(siteConfig, async (config: any) => {
        let web = new Web(ContextValue.siteUrl);
        let AllTasksMatches = [];
        AllTasksMatches = await web.lists
          .getById(config.listId)
          .items.select(
            "ParentTask/Title",
            "ParentTask/Id",
            "Services/Title",
            "ClientTime",
            "Services/Id",
            "Events/Id",
            "Events/Title",
            "ItemRank",
            "Portfolio_x0020_Type",
            "SiteCompositionSettings",
            "TaskLevel",
            "TaskLevel",
            "TimeSpent",
            "BasicImageInfo",
            "OffshoreComments",
            "OffshoreImageUrl",
            "CompletedDate",
            "TaskID",
            "ResponsibleTeam/Id",
            "ResponsibleTeam/Title",
            "TaskCategories/Id",
            "TaskCategories/Title",
            "ParentTask/TaskID",
            "TaskType/Id",
            "TaskType/Title",
            "TaskType/Level",
            "PriorityRank",
            "TeamMembers/Title",
            "TeamMembers/Name",
            "Component/Id",
            "Component/Title",
            "Component/ItemType",
            "TeamMembers/Id",
            "ComponentLink",
            "IsTodaysTask",
            "AssignedTo/Title",
            "AssignedTo/Name",
            "AssignedTo/Id",
            "ClientCategory/Id",
            "ClientCategory/Title",
            "FileLeafRef",
            "FeedBack",
            "Title",
            "Id",
            "ID",
            "PercentComplete",
            "StartDate",
            "DueDate",
            "Comments",
            "Categories",
            "Status",
            "Body",
            "Mileage",
            "PercentComplete",
            "ClientCategory",
            "Priority",
            "Created",
            "Modified",
            "Author/Id",
            "Author/Title",
            "Editor/Id",
            "Editor/Title"
          )
          .expand(
            "ParentTask",
            "Events",
            "Services",
            "TaskType",
            "AssignedTo",
            "Component",
            "ClientCategory",
            "Author",
            "Editor",
            "TeamMembers",
            "ResponsibleTeam",
            "TaskCategories"
          )
          .filter("Status ne 'Completed'")
          .orderBy("orderby", false)
          .getAll(4000);

        console.log(AllTasksMatches);
        Counter++;
        console.log(AllTasksMatches.length);
        if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
          $.each(AllTasksMatches, function (index: any, item: any) {
            item.isDrafted = false;
            item.flag = true;
            item.TitleNew = item.Title;
            // item.HierarchyData = globalCommon.hierarchyData(item, usePopHoverDataSend)
            item.siteType = config.Title;
            item.childs = [];
            item.listId = config.listId;
            item.siteUrl = ContextValue.siteUrl;
            if (item.TaskCategories.results != undefined) {
              if (item.TaskCategories.results.length > 0) {
                $.each(
                  item.TaskCategories.results,
                  function (ind: any, value: any) {
                    if (value.Title.toLowerCase() == "draft") {
                      item.isDrafted = true;
                    }
                  }
                );
              }
            }
          });
          AllTasks = AllTasks.concat(AllTasksMatches);
          AllTasks = $.grep(AllTasks, function (type: any) {
            return type.isDrafted == false;
          });
          if (Counter == siteConfig.length) {
            map(AllTasks, (result: any) => {
              result.Id = result.Id != undefined ? result.Id : result.ID;
              result.TeamLeaderUser = [];
              result.AllTeamName =
                result.AllTeamName === undefined ? "" : result.AllTeamName;
              result.chekbox = false;
              result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");

              if (result.DueDate == "Invalid date" || "") {
                result.DueDate = result.DueDate.replaceAll("Invalid date", "");
              }
              result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
              result.Restructuring =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
              result.chekbox = false;
              if (result.Body != undefined) {
                result.Short_x0020_Description_x0020_On = result.Body.replace(/(<([^>]+)>)/gi, "");
              }

              if (
                result.AssignedTo != undefined &&
                result.AssignedTo.length > 0
              ) {
                map(result.AssignedTo, (Assig: any) => {
                  if (Assig.Id != undefined) {
                    map(TaskUsers, (users: any) => {
                      if (
                        Assig.Id != undefined &&
                        users.AssingedToUser != undefined &&
                        Assig.Id == users.AssingedToUser.Id
                      ) {
                        users.ItemCover = users.Item_x0020_Cover;
                        result.TeamLeaderUser.push(users);
                        result.AllTeamName += users.Title + ";";
                      }
                    });
                  }
                });
              }
              if (
                result.ResponsibleTeam != undefined &&
                result.ResponsibleTeam.length > 0
              ) {
                map(result.ResponsibleTeam, (Assig: any) => {
                  if (Assig.Id != undefined) {
                    map(TaskUsers, (users: any) => {
                      if (
                        Assig.Id != undefined &&
                        users.AssingedToUser != undefined &&
                        Assig.Id == users.AssingedToUser.Id
                      ) {
                        users.ItemCover = users.Item_x0020_Cover;
                        result.TeamLeaderUser.push(users);
                        result.AllTeamName += users.Title + ";";
                      }
                    });
                  }
                });
              }
              if (
                result.TeamMembers != undefined &&
                result.TeamMembers.length > 0
              ) {
                map(result.TeamMembers, (Assig: any) => {
                  if (Assig.Id != undefined) {
                    map(TaskUsers, (users: any) => {
                      if (
                        Assig.Id != undefined &&
                        users.AssingedToUser != undefined &&
                        Assig.Id == users.AssingedToUser.Id
                      ) {
                        users.ItemCover = users.Item_x0020_Cover;
                        result.TeamLeaderUser.push(users);
                        result.AllTeamName += users.Title + ";";
                      }
                    });
                  }
                });
              }
              if (result?.ClientCategory?.length > 0) {
                result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
              } else {
                result.ClientCategorySearch = ''
              }
              result["SiteIcon"] = GetIconImageUrl(result.siteType, ContextValue.siteUrl, undefined);
              // result["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url
              // if (
              //   result.ClientCategory != undefined &&
              //   result.ClientCategory.length > 0
              // ) {
              //   map(result.TeamMembers, (catego: any) => {
              //     result.ClientCategory.push(catego);
              //   });
              // }
              if (result.Id === 1441) console.log(result);
              result["TaskID"] = globalCommon.getTaskId(result);
              if (result["TaskID"] == undefined) {
                result["TaskID"] = "";
              }
              result["Item_x0020_Type"] = "Task";
              TasksItem.push(result);
            });

            AllActivitysData = AllTasks?.filter(
              (elem: any) => elem?.TaskType?.Title == "Activities"
            );
            AllWorkStreamData = AllTasks?.filter(
              (elem: any) => elem?.TaskType?.Title == "Workstream"
            );

            AllActivitysData?.forEach((elem: any) => {
              elem.childs = [];
              elem.subRows = [];
              AllTasks?.forEach((task: any) => {
                if (elem.Id === task.Id && elem?.siteType === task?.siteType) {
                  task.isTagged = false;
                }
                if (elem?.ID == task?.ParentTask?.Id && elem?.siteType === task?.siteType) {
                  task.isTagged = false;
                  elem.childs.push(task);
                  elem.subRows.push(task);
                }
              });
            });
            AllActivitysData?.forEach((elem: any) => {
              elem?.subRows?.forEach((val: any) => {
                val.childs = val.childs === undefined ? [] : val.childs;
                val.subRows = val.subRows === undefined ? [] : val.subRows;
                AllTasks?.forEach((task: any) => {
                  if (val.Id === task.Id && val?.siteType === task?.siteType) {
                    task.isTagged = false;
                  }
                  if (val?.ID == task?.ParentTask?.Id && val?.siteType === task?.siteType) {
                    task.isTagged = false;
                    val.childs.push(task);
                    val.subRows.push(task);
                  }
                });
              });
            });

            AllTasks?.forEach((value: any) => {
              if (value.isTagged != false) {
                value.childs = [];
                value.subRows = [];
                AllActivitysData.push(value);
              }
            });

            console.log("taskssssssssssssss", AllActivitysData);
            console.log("AllActivitysData", AllActivitysData);
            TasksItem = AllActivitysData;
            console.log(Response);
            map(TasksItem, (task: any) => {
              if (!isItemExistsNew(CopyTaskData, task)) {
                CopyTaskData.push(task);
              }
            });
            setAllTasks(CopyTaskData);
            filterDataBasedOnList();
          }
        } else {
          if (Counter == siteConfig.length) {
            filterDataBasedOnList();
            showProgressHide();
          }
        }
      });
    } else showProgressHide();
  };
  const handleOpen2 = (item: any) => {
    item.show = item.showItem = item.show == true ? false : true;
    setfilterItems((filterItems) => [...filterItems]);
  };
  const addModal = () => {
    setAddModalOpen(true);
  };
  var AllComponetsData: any = [];
  var TaskUsers: any = [];
  var MetaData: any = [];
  var showProgressBar = () => {
    setLoaded(false);
    $(" #SpfxProgressbar").show();
  };

  var showProgressHide = () => {
    setLoaded(true);
    $(" #SpfxProgressbar").hide();
  };
  var Response: any = [];
  const getTaskUsers = async () => {
    let web = new Web(ContextValue.siteUrl);
    let taskUsers = [];
    taskUsers = await web.lists
      .getById(ContextValue.TaskUsertListID)
      .items.select(
        "Id",
        "Email",
        "Suffix",
        "Title",
        "Item_x0020_Cover",
        "AssingedToUser/Title",
        "AssingedToUser/Id",
        "AssingedToUser/Name",
        "UserGroup/Id",
        "ItemType"
      )
      .expand("AssingedToUser", "UserGroup")
      .get();
    Response = taskUsers;
    TaskUsers = Response;
    setTaskUser(Response);
    console.log(Response);
  };
  const GetSmartmetadata = async () => {
    var metadatItem: any = [];
    let web = new Web(ContextValue.siteUrl);
    let smartmetaDetails: any = [];
    smartmetaDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getById(ContextValue.SmartMetadataListID)
      .items//.getById(this.state.itemID)
      .select(
        "Id",
        "Title",
        "IsVisible",
        "ParentID",
        "SmartSuggestions",
        "TaxType",
        "Description1",
        "Item_x005F_x0020_Cover",
        "listId",
        "siteName",
        "siteUrl",
        "SortOrder",
        "SmartFilters",
        "Selectable",
        'Color_x0020_Tag',
        "Parent/Id",
        "Parent/Title"
      )
      .top(4999)
      // .filter("TaxType eq 'Client Category'")
      .expand("Parent")
      .get();
    setAllClientCategory(smartmetaDetails?.filter((metadata: any) => metadata?.TaxType == 'Client Category'));
    console.log(smartmetaDetails);
    setMetadata(smartmetaDetails);

    map(smartmetaDetails, (newtest) => {
      newtest.Id = newtest.ID;
      if (
        newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Offshore Tasks" ||
        newtest.Title == "Health" ||
        newtest.Title == "Shareweb Old" ||
        newtest.Title == "Master Tasks"
      )
        newtest.DataLoadNew = false;
      else if (newtest.TaxType == "Sites") siteConfig.push(newtest);
    });
    map(smartmetaDetails, (item) => {
      if (
        item.TaxType != "Status" &&
        item.TaxType != "Admin Status" &&
        item.TaxType != "Task Type" &&
        item.TaxType != "Time" &&
        item.Id != 300 &&
        item.TaxType != "Portfolio Type" &&
        item.TaxType != "Task Types"
      ) {
        if (item.TaxType == "Sites") {
          item.DataLoad = false;
          /*-- Code for default Load Task Data---*/
          if (
            item.Title == "DRR" ||
            item.Title == "Small Projects" ||
            item.Title == "Offshore Tasks" ||
            item.Title == "Health"
          ) {
            item.Selected = false;
          } else {
            item.Selected = true;
          }
        } else if (item.TaxType == "Sites Old") {
          /*-- Code for default Load Task Data---*/
          item.Selected = true;
        }
        metadatItem.push(item);
        //setFilterGroups(metadatItem)
      }
    });
    if (siteConfig.length > 0) LoadAllSiteTasks();
    //  else filterDataBasedOnList()

    map(Response, (user: any) => {
      user.TaxType = "Team Members";
      user.SmartFilters = {};
      user.SmartFilters = [];
      user.SmartFilters.push("Portfolio");
      if (user.UserGroup == undefined) user.ParentID = 0;
      if (user.UserGroup != undefined && user.UserGroup.Id != undefined)
        user.ParentID = user.UserGroup.Id;
      metadatItem.push(user);
    });
    map(metadatItem, (item) => {
      if (item.Title == "Shareweb Old") {
        item.TaxType = "Sites";
      }
    });

    map(metadatItem, (filterItem) => {
      if (
        filterItem.SmartFilters != undefined &&
        filterItem.SmartFilters != undefined &&
        filterItem.SmartFilters.indexOf("Portfolio") > -1
      ) {
        var item: any = [];
        item.ID = item.Id = filterItem.Id;
        item.Title = filterItem.Title;
        item.Group = filterItem.TaxType;
        item.TaxType = filterItem.TaxType;
        if (
          item.Title == "Activities" ||
          item.Title == "Workstream" ||
          item.Title == "Task"
        ) {
          item.Selected = true;
        }

        if (
          filterItem.ParentID == 0 ||
          (filterItem.Parent != undefined && filterItem.Parent.Id == undefined)
        ) {
          if (item.TaxType == "Team Members") {
            getChildsBasedonId(item, Response);
          } else {
            getChildsBasedOn(item, smartmetaDetails);
          }
          filterItems.push(item);
          if (
            filterItem.TaxType != "Type" &&
            filterItem.TaxType != "Sites Old" &&
            (filterGroups.length == 0 ||
              filterGroups.indexOf(filterItem.TaxType) == -1)
          ) {
            filterGroups.push(filterItem.TaxType);
          }

          setFilterGroups(filterGroups);
        }
      }
    });
    var ArrayItem: any = [];

    filterItems.push(
      {
        Group: "Portfolio",
        TaxType: "Portfolio",
        Title: "Component",
        Selected: true,
        value: 1000,
        label: "Component",
        childs: [],
      },
      {
        Group: "Portfolio",
        TaxType: "Portfolio",
        Title: "SubComponent",
        Selected: true,
        value: 10000,
        label: "SubComponent",
        childs: [],
      },
      {
        Group: "Portfolio",
        TaxType: "Portfolio",
        Title: "Feature",
        Selected: true,
        value: 100000000,
        label: "Feature",
        childs: [],
      },
      {
        Group: "Portfolio",
        TaxType: "Portfolio",
        Title: "Task",
        Selected: true,
        value: 100000000,
        label: "Feature",
        childs: [],
      }
    );
    map(filterItems, (item) => {
      if (
        (item.TaxType == "Sites" && item.Title == "SDC Sites") ||
        item.Title == "Tasks"
      ) {
        item.Selected = true;
      }
    });
    setfilterItems((filterItems) => [...filterItems]);
    // setfilterItems(filterItems)
    ShowSelectedfiltersItems();
    setShowSelectdSmartfilter((ShowSelectdSmartfilter) => [...ArrayItem]);
    function getChildsBasedonId(
      item: {
        RightArrowIcon: string;
        downArrowIcon: string;
        childs: any[];
        subRows: any[];
        Id: any;
      },
      items: any
    ) {
      item.childs = [];
      item.subRows = [];
      map(metadatItem, (childItem) => {
        if (
          childItem.UserGroup != undefined &&
          childItem.UserGroup.Id != undefined &&
          childItem.UserGroup.Id == item.Id
        ) {
          childItem.value = childItem.Id;
          childItem.label = childItem.Title;

          item.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          item.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
          item.childs.push(childItem);
          item.subRows.push(childItem);
          getChildsBasedonId(childItem, items);
        }
      });
    }
    function getChildsBasedOn(
      item: {
        RightArrowIcon: string;
        downArrowIcon: string;
        childs: any[];
        subRows: any[];
        ID: number;
      },
      items: any
    ) {
      item.childs = [];
      item.subRows = [];
      map(metadatItem, (childItem) => {
        if (
          childItem.Parent != undefined &&
          childItem.Parent.Id != undefined &&
          parseInt(childItem.Parent.Id) == item.ID
        ) {
          childItem.value = childItem.Id;
          childItem.label = childItem.Title;
          item.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          item.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
          item.childs.push(childItem);
          item.subRows.push(childItem);
          getChildsBasedOn(childItem, items);
        }
      });
    }
  };
  var WebpartItem: any = [];
  const GetComponents = async () => {
    filt =
      "(Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature') and ((Portfolio_x0020_Type eq 'Service'))";
    if (
      IsUpdated != undefined &&
      IsUpdated.toLowerCase().indexOf("service") > -1
    )
      filt =
        "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Service'))";
    if (
      IsUpdated != undefined &&
      IsUpdated.toLowerCase().indexOf("events") > -1
    )
      filt =
        "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Events'))";
    if (
      IsUpdated != undefined &&
      IsUpdated.toLowerCase().indexOf("component") > -1
    )
      filt =
        "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Component'))";
    let web = new Web(ContextValue.siteUrl);
    let componentDetails = [];
    componentDetails = await web.lists
      .getById(ContextValue.MasterTaskListID)
      //.getByTitle('Master Tasks')
      .items//.getById(this.state.itemID)
      .select(
        "ID",
        "Id",
        "Title",
        "Mileage",
        "TaskListId",
        "TaskListName",
        "WorkspaceType",
        "PortfolioLevel",
        "PortfolioStructureID",
        "PortfolioStructureID",
        "ComponentLink",
        "Package",
        "Comments",
        "DueDate",
        "Sitestagging",
        "Body",
        "Deliverables",
        "SiteCompositionSettings",
        "StartDate",
        "Created",
        "Item_x0020_Type",
        "Help_x0020_Information",
        "Background",
        "Categories",
        "Short_x0020_Description_x0020_On",
        "TechnicalExplanations",
        "Idea",
        "ValueAdded",
        "CategoryItem",
        "PriorityRank",
        "Priority",
        "TaskDueDate",
        "PercentComplete",
        "Modified",
        "CompletedDate",
        "ItemRank",
        "Portfolio_x0020_Type",
        "Services/Title",
        "ClientTime",
        "Services/Id",
        "Events/Id",
        "Events/Title",
        "Parent/Id",
        "Parent/Title",
        "Component/Id",
        "Component/Title",
        "Component/ItemType",
        "Services/Id",
        "Services/Title",
        "Services/ItemType",
        "Events/Id",
        "Author/Title",
        "Editor/Title",
        "Events/Title",
        "Events/ItemType",
        "TaskCategories/Id",
        "TaskType/Title",
        "TaskCategories/Title",
        "AssignedTo/Id",
        "AssignedTo/Title",
        "TeamMembers/Id",
        "TeamMembers/Title",
        "ClientCategory/Id",
        "ClientCategory/Title",
        // 'ClientCategory/Color_x0020_Tag',
        "ResponsibleTeam/Id",
        "ResponsibleTeam/Title"
      )
      .expand(
        "Parent",
        "Events",
        "Services",
        "TaskType",
        "AssignedTo",
        "Component",
        "ClientCategory",
        "Author",
        "Editor",
        "TeamMembers",
        "ResponsibleTeam",
        "TaskCategories"
      )
      .top(4999)
      .filter(filt)
      .get();

    console.log(componentDetails);
    componentDetails.forEach((result: any) => {
      result.AllTeamName = "";
      if (result.Item_x0020_Type === 'Component') {
        result.boldRow = 'boldClable'
        result.lableColor = 'f-bg';
      }
      if (result.Item_x0020_Type === 'SubComponent') {
        result.lableColor = 'a-bg';
      }
      if (result.Item_x0020_Type === 'Feature') {
        result.lableColor = 'w-bg';
      }



      result.Id = result.Id != undefined ? result.Id : result.ID;
      if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
        $.each(result.AssignedTo, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(Response, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.ResponsibleTeam != undefined &&
        result.ResponsibleTeam.length > 0
      ) {
        map(result.ResponsibleTeam, (Assig: any) => {
          if (Assig.Id != undefined) {
            map(TaskUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.TeamMembers != undefined &&
        result.TeamMembers.length > 0
      ) {
        $.each(result.TeamMembers, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(TaskUsers, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (result?.ClientCategory?.length > 0) {
        result.ClientCategorySearch = result?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
      } else {
        result.ClientCategorySearch = ''
      }
    });
    AllComponetsData = componentDetails;
    ComponetsData["allComponets"] = componentDetails;
    if (siteConfig.length === 0) filterDataBasedOnList();

    setAllMasterTasks(AllComponetsData);
  };

  if (IsUpdated == "") {
    setIsUpdated("Service Portfolio");
  } else if (IsUpdated != SelectedProp?.SelectedProp.dropdownvalue) {
    setIsUpdated(SelectedProp?.SelectedProp.dropdownvalue);
  }

  let props = undefined;
  React.useEffect(() => {
    showProgressBar();
    ContextValue = SelectedProp?.SelectedProp;
    setmaidataBackup((maidataBackup) => [...[]]);
    setmaidataBackup((maidataBackup) => [...[]]);
    GetComponents();
    setData((data) => [...[]]);
    if (filterGroups != undefined && filterGroups.indexOf("Sites") === -1) {
      filterGroups.push("Portfolio");
      filterGroups.push("Sites");
      filterGroups.push("Type");
      filterGroups.push("Team Members");
      getTaskUsers();
      GetSmartmetadata();
    } else {
      map(filterItems, (filte) => {
        if (filte != undefined && filte.childs) {
          filte.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          filte.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
        }
      });
      LoadAllSiteTasks();

    }
  }, [IsUpdated]);
  // common services
  var parseJSON = function (jsonItem: any) {
    var json = [];
    try {
      json = JSON.parse(jsonItem);
    } catch (err) {
      console.log(err);
    }
    return json;
  };

  var GetIconImageUrl = function (listName: any, listUrl: any, Item: any) {
    var IconUrl = "";
    if (listName != undefined) {
      let TaskListsConfiguration = parseJSON(
        GlobalConstants.LIST_CONFIGURATIONS_TASKS
      );
      let TaskListItem = TaskListsConfiguration.filter(function (
        filterItem: any
      ) {
        let SiteRelativeUrl = filterItem.siteUrl;
        return (
          filterItem.Title.toLowerCase() == listName.toLowerCase() &&
          SiteRelativeUrl.toLowerCase() == listUrl.toLowerCase()
        );
      });
      if (TaskListItem.length > 0) {
        if (Item == undefined) {
          IconUrl = TaskListItem[0].ImageUrl;
        } else if (TaskListItem[0].ImageInformation != undefined) {
          var IconUrlItem = TaskListItem[0].ImageInformation.filter(function (
            index: any,
            filterItem: any
          ) {
            return (
              filterItem.ItemType == Item.Item_x0020_Type &&
              filterItem.PortfolioType == Item.Portfolio_x0020_Type
            );
          });
          if (IconUrlItem != undefined && IconUrlItem.length > 0) {
            IconUrl = IconUrlItem[0].ImageUrl;
          }
        }
      }
    }
    return IconUrl;
  };

  var AllTasks: any = [];
  var CopyTaskData: any = [];
  var isItemExistsNew = function (array: any, items: any) {
    var isExists = false;
    $.each(array, function (index: any, item: any) {
      if (item.Id === items.Id && items.siteType === item.siteType) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
  const findTaggedComponents = function (task: any) {
    task.Portfolio_x0020_Type = "Component";
    task.isService = false;
    if (IsUpdated === "Service Portfolio") {
      $.each(task["Services"], function (index: any, componentItem: any) {
        if (ComponetsData["allComponets"]?.length != undefined && ComponetsData != undefined) {

          for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
            let crntItem = ComponetsData["allComponets"][i];
            if (componentItem?.Id == crntItem?.Id) {
              if (
                crntItem.PortfolioStructureID != undefined &&
                crntItem.PortfolioStructureID != ""
              ) {
                task.PortfolioStructureID = crntItem.PortfolioStructureID;
                task.ShowTooltipSharewebId = crntItem.PortfolioStructureID + "-" + task.TaskID;
              }
              if (crntItem.Portfolio_x0020_Type == "Service") {
                task.isService = true;
                task.Portfolio_x0020_Type = "Service";
              }
              if (ComponetsData["allComponets"][i]["childs"] === undefined) {
                ComponetsData["allComponets"][i]["childs"] = [];
                ComponetsData["allComponets"][i]["subRows"] = [];
              }
              if (
                !isItemExistsNew(ComponetsData["allComponets"][i]["childs"], task)
              ) {
                ComponetsData["allComponets"][i].downArrowIcon =
                  IsUpdated != undefined && IsUpdated == "Service Portfolio"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                ComponetsData["allComponets"][i].RightArrowIcon =
                  IsUpdated != undefined && IsUpdated == "Service Portfolio"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
                ComponetsData["allComponets"][i]["childs"].push(task);
                ComponetsData["allComponets"][i]["subRows"].push(task);
                if (ComponetsData["allComponets"][i].Id === 413)
                  console.log(ComponetsData["allComponets"][i]["childs"].length);
              }
              break;
            }
          }

        }
      });
    }
    if (IsUpdated === "Events Portfolio") {
      $.each(task["Events"], function (index: any, componentItem: any) {
        for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
          let crntItem = ComponetsData["allComponets"][i];
          if (componentItem?.Id == crntItem?.Id) {
            if (
              crntItem.PortfolioStructureID != undefined &&
              crntItem.PortfolioStructureID != ""
            ) {
              task.PortfolioStructureID = crntItem.PortfolioStructureID;
              task.ShowTooltipSharewebId =
                crntItem.PortfolioStructureID + "-" + task.TaskID;
            }
            if (crntItem.Portfolio_x0020_Type == "Events") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Events";
            }
            if (ComponetsData["allComponets"][i]["childs"] == undefined) {
              ComponetsData["allComponets"][i]["childs"] = [];
              ComponetsData["allComponets"][i]["subRows"] = [];
            }
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["childs"], task)
            ) {
              ComponetsData["allComponets"][i].downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Events Portfolio"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png";
              ComponetsData["allComponets"][i].RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Events Portfolio"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png";

              ComponetsData["allComponets"][i]["childs"].push(task);
              ComponetsData["allComponets"][i]["subRows"].push(task);
            }
            break;
          }
        }
      });
    }
    if (IsUpdated === "Component Portfolio") {
      $.each(task["Component"], function (index: any, componentItem: any) {
        for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
          let crntItem = ComponetsData["allComponets"][i];
          if (componentItem?.Id == crntItem?.Id) {
            if (
              crntItem.PortfolioStructureID != undefined &&
              crntItem.PortfolioStructureID != ""
            ) {
              task.PortfolioStructureID = crntItem.PortfolioStructureID;
              task.ShowTooltipSharewebId =
                crntItem.PortfolioStructureID + "-" + task.TaskID;
            }
            if (crntItem.Portfolio_x0020_Type == "Component") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Component";
            }
            if (ComponetsData["allComponets"][i]["childs"] == undefined) {
              ComponetsData["allComponets"][i]["childs"] = [];
              ComponetsData["allComponets"][i]["subRows"] = [];
            }
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["childs"], task)
            ) {
              ComponetsData["allComponets"][i].downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Component Portfolio"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png";
              ComponetsData["allComponets"][i].RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Component Portfolio"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png";
              ComponetsData["allComponets"][i]["childs"].push(task);
              ComponetsData["allComponets"][i]["subRows"].push(task);
            }
            break;
          }
        }
      });
    }
  };
  //var pageType = 'Service-Portfolio';
  var ComponetsData: any = {};
  ComponetsData.allUntaggedTasks = [];

  const DynamicSort = function (items: any, column: any) {
    items?.sort(function (a: any, b: any) {
      // return   a[column] - b[column];
      var aID = a[column];
      var bID = b[column];
      return aID == bID ? 0 : aID > bID ? 1 : -1;
    });
  };
  const bindData = function () {
    var RootComponentsData: any[] = [];

    $.each(ComponetsData["allComponets"], function (index: any, result: any) {
      result.show = false;
      result.checkBox = false;
      if (result.childs != undefined) {
        result.childs.forEach(function (i: any) {
          i.show = [];
          i.checkBox = false;
          if (i.childs != undefined) {
            i.childs.forEach(function (subc: any) {
              subc.show = [];
              subc.checkBox = false;
              if (subc.childs != undefined) {
                subc.childs.forEach(function (last: any) {
                  last.show = [];
                  last.checkBox = false;
                });
              }
            });
          }
        });
      }
      result.TeamLeaderUser =
        result.TeamLeaderUser === undefined ? [] : result.TeamLeaderUser;
      result.Restructuring =
        IsUpdated != undefined && IsUpdated == "Service Portfolio"
          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png"
          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png";
      result.AllTeamName = "";
      result.TitleNew = result.Title;
      //  getWebpartId(result);
      result.childsLength = 0;
      result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");
      result.flag = true;
      if (result.DueDate == "Invalid date" || "") {
        result.DueDate = result.DueDate.replaceAll("Invalid date", "");
      }
      result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

      if (result.Short_x0020_Description_x0020_On != undefined) {
        result.Short_x0020_Description_x0020_On =
          result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/gi, "");
      }
      result["siteType"] = "Master Tasks";
      // result['SiteIcon'] = GetIconImageUrl(result.siteType, ContextValue.siteUrl, undefined);
      if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
        $.each(result.AssignedTo, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(Response, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.TeamMembers != undefined &&
        result.TeamMembers.length > 0
      ) {
        $.each(result.TeamMembers, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(TaskUsers, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.ResponsibleTeam != undefined &&
        result.ResponsibleTeam.length > 0
      ) {
        $.each(
          result.ResponsibleTeam,
          function (index: any, Assig: any) {
            if (Assig.Id != undefined) {
              $.each(TaskUsers, function (index: any, users: any) {
                if (
                  Assig.Id != undefined &&
                  users.AssingedToUser != undefined &&
                  Assig.Id == users.AssingedToUser.Id
                ) {
                  users.ItemCover = users.Item_x0020_Cover;
                  result.TeamLeaderUser.push(users);
                  result.AllTeamName += users.Title + ";";
                }
              });
            }
          }
        );
      }
      if (
        result.PortfolioStructureID != null &&
        result.PortfolioStructureID != undefined
      ) {
        result["TaskID"] = result.PortfolioStructureID;
      } else {
        result["TaskID"] = "";
      }
      if (result.Item_x0020_Type == "Root Component") {
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        RootComponentsData.push(result);
      }
      if (result.Item_x0020_Type == "Component") {
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        result.SiteIconTitle = "C"; //IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';
        ComponentsData.push(result);
      }

      if (result.Item_x0020_Type == "SubComponent") {
        result.SiteIconTitle = "S"; //IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        SubComponentsData.push(result);
        SubComponentsDataCopy.push(result);
      }
      if (result.Item_x0020_Type == "Feature") {
        result.SiteIconTitle = "F"; //IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        FeatureData.push(result);
        FeatureDataCopy.push(result);
      }
      if (result.Title == "Others") {
        result.childsLength = result.childs.length;
        ComponentsData.push(result);
        ComponentsDataCopy.push(result);
      }
    });

    $.each(SubComponentsData, function (index: any, subcomp: any) {
      if (subcomp.Title != undefined) {
        $.each(FeatureData, function (index: any, featurecomp: any) {
          if (
            featurecomp.Parent != undefined &&
            subcomp.Id == featurecomp.Parent.Id
          ) {
            subcomp.downArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            subcomp.RightArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            subcomp.childsLength++;
            subcomp["childs"].push(featurecomp);
            subcomp["subRows"].push(featurecomp);
          }
        });
        DynamicSort(subcomp.childs, "PortfolioLevel");
        DynamicSort(subcomp.subRows, "PortfolioLevel");
      }
    });

    $.each(ComponentsData, function (index: any, subcomp: any) {
      if (subcomp.Title != undefined) {
        $.each(SubComponentsData, function (index: any, featurecomp: any) {
          if (
            featurecomp.Parent != undefined &&
            subcomp.Id == featurecomp.Parent.Id
          ) {
            subcomp.downArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            subcomp.RightArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            subcomp.childsLength++;
            subcomp["childs"].push(featurecomp);
            subcomp["subRows"].push(featurecomp);
          }
        });
        DynamicSort(subcomp.childs, "PortfolioLevel");
        DynamicSort(subcomp.subRows, "PortfolioLevel");
      }
    });

    map(ComponentsData, (comp, index) => {
      if (comp.Title != undefined) {
        map(FeatureData, (featurecomp) => {
          if (
            featurecomp.Parent != undefined &&
            comp.Id === featurecomp.Parent.Id
          ) {
            comp.downArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            comp.RightArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            comp.childsLength++;
            comp["childs"].push(featurecomp);
            comp["subRows"].push(featurecomp);
          }
        });
        DynamicSort(comp.childs, "PortfolioLevel");
        DynamicSort(comp.subRows, "PortfolioLevel");
      }
    });

    map(ComponentsData, (comp, index) => {
      if (comp.childs != undefined && comp.childs.length > 0) {
        var Subcomponnet = comp.childs.filter(
          (sub: { Item_x0020_Type: string }) =>
            sub.Item_x0020_Type === "SubComponent"
        );
        DynamicSort(Subcomponnet, "PortfolioLevel");
        var SubTasks = comp.childs.filter(
          (sub: { Item_x0020_Type: string }) => sub.Item_x0020_Type === "Task"
        );
        var SubFeatures = comp.childs.filter(
          (sub: { Item_x0020_Type: string }) =>
            sub.Item_x0020_Type === "Feature"
        );
        DynamicSort(SubFeatures, "PortfolioLevel");
        SubFeatures = SubFeatures.concat(SubTasks);
        Subcomponnet = Subcomponnet.concat(SubFeatures);
        comp["childs"] = Subcomponnet;
        comp["subRows"] = Subcomponnet;
        array.push(comp);

        if (Subcomponnet != undefined && Subcomponnet.length > 0) {
          //  if (comp.childs != undefined && comp.childs.length > 0) {
          map(Subcomponnet, (subcomp, index) => {
            if (subcomp.childs != undefined && subcomp.childs.length > 0) {
              var Subchildcomponnet = subcomp.childs.filter(
                (sub: any) => sub.Item_x0020_Type === "Feature"
              );
              DynamicSort(SubFeatures, "PortfolioLevel");
              var SubchildTasks = subcomp.childs.filter(
                (sub: any) => sub.Item_x0020_Type === "Task"
              );
              Subchildcomponnet = Subchildcomponnet.concat(SubchildTasks);
              subcomp["childs"] = Subchildcomponnet;
              subcomp["subRows"] = Subchildcomponnet;
            }
          });
        }
      } else array.push(comp);
    });

    setSubComponentsData(SubComponentsData);
    setFeatureData(FeatureData);
    setComponentsData(array);
    setmaidataBackup(array);
    setTotalArrayBackup(array);
    setData(array);
    setAllCountItems({
      ...AllCountItems,
      AfterSearchComponentItems: array,
      AfterSearchSubComponentItems: SubComponentsData,
      AfterSearchFeaturesItems: FeatureData,
      AllComponentItems: array,
      AllSubComponentItems: SubComponentsData,
      AllFeaturesItems: FeatureData,
    });
    showProgressHide();
  };

  var makeFinalgrouping = function () {
    var AllTaskData1: any = [];
    ComponetsData["allUntaggedTasks"] = [];
    var SelectedLevel: any = [];
    filterItems.forEach((item) => {
      if (
        item.Selected &&
        (item.Title == "Activities" ||
          item.Title == "Workstream" ||
          item.Title == "Task")
      ) {
        SelectedLevel.push(item);
      }
    });

    if (SelectedLevel.length > 0) {
      var AllTaggedTask: any = [];
      SelectedLevel.forEach((item: any) => {
        TasksItem.forEach((task: any) => {
          // if (
          //   task.TaskType != undefined &&
          //   task.TaskType.Title != undefined &&
          //   item.Title == task.TaskType.Title
          // ) {
          AllTaggedTask.push(task);
          // }
        });
      });
      // AllTaskData1 = AllTaskData1.concat(TasksItem);
      setTaggedAllTask(AllTaggedTask);
      $.each(AllTaggedTask, function (index: any, task: any) {
        if (
          task.ID === 1473 ||
          task.ID === 2297 ||
          task.ID === 2338 ||
          task.ID === 2392
        )
          var test = "test";
        task.Portfolio_x0020_Type = "Component";
        if (IsUpdated === "Service Portfolio") {
          if (task["Services"] != undefined && task["Services"].length > 0) {
            task.Portfolio_x0020_Type = "Service";
            findTaggedComponents(task);
          } else if (
            task["Component"] != undefined &&
            task["Component"].length === 0 &&
            task["Events"] != undefined &&
            task["Events"].length === 0
          ) {
            // if (task.TaskType != undefined && task.TaskType.Title && (task.TaskType.Title == "Activities" || task.TaskType.Title == "Workstream" || task.TaskType.Title == "Task"))
            ComponetsData["allUntaggedTasks"].push(task);
          }
        }
        if (IsUpdated === "Events Portfolio") {
          if (task["Events"] != undefined && task["Events"].length > 0) {
            task.Portfolio_x0020_Type = "Events";
            findTaggedComponents(task);
          } else if (
            task["Component"] != undefined &&
            task["Component"].length == 0 &&
            task["Services"] != undefined &&
            task["Services"].length == 0
          ) {
            // if (task.TaskType != undefined && task.TaskType.Title && (task.TaskType.Title == "Activities" || task.TaskType.Title == "Workstream" || task.TaskType.Title == "Task"))
            ComponetsData["allUntaggedTasks"].push(task);
          }
        }
        if (IsUpdated === "Component Portfolio") {
          if (task["Component"] != undefined && task["Component"].length > 0) {
            task.Portfolio_x0020_Type = "Component";
            findTaggedComponents(task);
          } else if (
            task["Services"] != undefined &&
            task["Services"].length == 0 &&
            task["Events"] != undefined &&
            task["Events"].length == 0
          ) {
            // if (task.TaskType != undefined && task.TaskType.Title && (task.TaskType.Title == "Activities" || task.TaskType.Title == "Workstream" || task.TaskType.Title == "Task"))
            ComponetsData["allUntaggedTasks"].push(task);
          }
        }
      });
    }
    var temp: any = {};
    temp.Title = "Others";
    temp.TitleNew = "Others";
    temp.childs = [];
    temp.childsLength = 0;
    temp.flag = true;
    temp.PercentComplete = "";
    temp.ItemRank = "";
    temp.DueDate = "";
    // ComponetsData['allComponets'][i]['childs']
    map(ComponetsData["allUntaggedTasks"], (task: any) => {
      if (task.Title != undefined) {
        temp.downArrowIcon =
          IsUpdated != undefined && IsUpdated == "Service Portfolio"
            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
        temp.RightArrowIcon =
          IsUpdated != undefined && IsUpdated == "Service Portfolio"
            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

        temp.childs.push(task);
      }
    });
    if (temp?.childs?.length > 0) {
      temp.childs = temp?.childs?.filter((ele: any, ind: any) => ind === temp?.childs?.findIndex((elem: any) => elem.ID === ele.ID));
    }
    ComponetsData["allComponets"].push(temp);
    bindData();
  };
  const filterDataBasedOnList = function () {
    //$scope.AllTaskData = angular.copy($scope.CopyTaskData);
    //$scope.AllTaskData = JSON.parse(JSON.stringify($scope.CopyTas kData));

    //$scope.AllTaskData = $scope.CopyTaskData.map(function (value) { value = Object.create(value); return value });
    //$scope.AllTaskData = angular.copy($scope.CopyTaskData);
    //$scope.AllTaskData = JSON.parse(JSON.stringify($scope.CopyTaskData));

    //$scope.AllTaskData = $scope.CopyTaskData.map(function (value) { value = Object.create(value); return value });
    var AllTaskData1: any = [];
    AllTaskData1 = AllTaskData1.concat(CopyTaskData);
    // CountOfAWTStructuredData();
    var SelectedList: any = [];
    $.each(filterItems, function (index: any, config: any) {
      if (config.Selected && config.TaxType == "Sites") {
        SelectedList.push(config);
      }
      if (config.Title == "Foundation" || config.Title == "SDC Sites") {
        config.show = true;
        config.showItem = true;
      }
      if (config.childs != undefined && config.childs.length > 0) {
        $.each(config.childs, function (index: any, child: any) {
          if (child.Selected && child.TaxType == "Sites") {
            SelectedList.push(child);
          }
        });
      }
    });

    var AllTaggedTask: any = [];
    $.each(SelectedList, function (index: any, item: any) {
      $.each(AllTaskData1, function (index: any, task: any) {
        if (item.Title.toLowerCase() == task.siteType.toLowerCase()) {
          AllTaggedTask.push(task);
        }
      });
    });
    if (AllTaggedTask != undefined) {
      AllTaskData1 = AllTaggedTask;
    }
    makeFinalgrouping();
  };
  var TasksItem: any = [];


  const Prints = () => {
    window.print();
  };
  // ---------------------Export to Excel-------------------------------------------------------------------------------------

  // const getCsvData = () => {
  //   const csvData = [["Title"]];
  //   let i;
  //   for (i = 0; i < data.length; i += 1) {
  //     csvData.push([`${data[i].Title}`]);
  //   }
  //   return csvData;
  // };


  const expndpopup = (e: any) => {
    settablecontiner(e);
  };

  //------------------Edit Data----------------------------------------------------------------------------------------------------------------------------

  const EditData = (e: any, item: any) => {
    setSharewebTimeComponent(item);
  };
  const EditDataTimeEntryData = (e: any, item: any) => {
    setIsTimeEntry(true);
    setSharewebTimeComponent(item);
  };

  const Call = React.useCallback((childItem: any) => {
    AllDataRender = []
    setRowSelection({});
    closeTaskStatusUpdatePoup2();
    setIsComponent(false);
    setIsTask(false);
    setMeetingPopup(false);
    setWSPopup(false);

    var MainId: any = "";
    let ParentTaskId: any = "";
    if (childItem != undefined) {
      childItem.data.Services = [];
      childItem.data.Component = [];
      childItem.data["flag"] = true;
      childItem.data["TitleNew"] = childItem?.data?.Title;
      if (childItem?.data?.ServicesId[0] != undefined) {
        childItem.data.Services.push({ Id: childItem?.data?.ServicesId[0] });
      }
      if (childItem?.data?.ComponentId[0] != undefined) {
        childItem.data.Component.push({ Id: childItem?.data?.ComponentId[0] });

      }
      if (
        childItem?.data?.ServicesId != undefined &&
        childItem?.data?.ServicesId?.length > 0
      ) {
        MainId = childItem.data.ServicesId[0];
      }
      if (
        childItem.data.ComponentId != undefined &&
        childItem.data.ComponentId.length > 0
      ) {
        MainId = childItem.data.ComponentId[0];
      }
      if (
        childItem.data.ParentTaskId != undefined &&
        childItem.data.ParentTaskId != ""
      ) {
        ParentTaskId = childItem.data.ParentTaskId;
      }
      if (
        childItem?.data?.DueDate != undefined &&
        childItem?.data?.DueDate != "" &&
        childItem?.data?.DueDate != "Invalid date"
      ) {
        childItem.data.DueDate = childItem.data.DueDate
          ? Moment(childItem?.data?.DueDate).format("MM-DD-YYYY")
          : null;
      }
      if (array != undefined) {
        array?.map((comp: any) => {
          comp.flag = true;
          comp.show = false;
          if (comp.Id == MainId || comp.ID == MainId) {
            comp.childs.push(childItem.data);
            comp.subRows.push(childItem.data);
            comp.subRows = comp?.subRows?.filter((ele: any, ind: any) => ind === comp?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));

          }

          if (comp.subRows != undefined && comp.subRows.length > 0) {
            comp?.subRows?.map((subComp: any) => {
              subComp.flag = true;
              subComp.show = false;
              if (subComp.Id == MainId || subComp.ID == MainId) {
                subComp.childs.push(childItem.data);
                subComp.subRows.push(childItem.data);
                subComp.subRows = subComp?.subRows?.filter((ele: any, ind: any) => ind === subComp?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));

              }

              if (subComp.subRows != undefined && subComp.subRows.length > 0) {
                subComp?.subRows?.map((Feat: any) => {
                  if (
                    Feat?.DueDate?.length > 0 &&
                    Feat?.DueDate != "Invalid date"
                  ) {
                    Feat.DueDate = Feat?.DueDate
                      ? Moment(Feat?.DueDate).format("MM-DD-YYYY")
                      : null;
                  } else {
                    Feat.DueDate = "";
                  }
                  Feat.flag = true;
                  Feat.show = false;
                  if (Feat.Id == ParentTaskId || Feat.ID == ParentTaskId) {
                    Feat.childs = Feat.childs == undefined ? [] : Feat.childs;
                    Feat.subRows =
                      Feat.subRows == undefined ? [] : Feat.subRows;
                    Feat.childs.push(childItem.data);
                    Feat.subRows.push(childItem.data);
                    Feat.subRows = Feat?.subRows?.filter((ele: any, ind: any) => ind === Feat?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
                  }

                  if (Feat.subRows != undefined && Feat.subRows.length > 0) {
                    Feat?.subRows?.map((Activity: any) => {
                      if (
                        Activity?.DueDate?.length > 0 &&
                        Activity?.DueDate != "Invalid date"
                      ) {
                        Activity.DueDate = Activity?.DueDate
                          ? Moment(Activity?.DueDate).format("MM-DD-YYYY")
                          : null;
                      } else {
                        Activity.DueDate = "";
                      }
                      Activity.flag = true;
                      Activity.show = false;
                      if (
                        Activity.Id == ParentTaskId ||
                        Activity.ID == ParentTaskId
                      ) {
                        Activity.childs =
                          Activity.childs == undefined ? [] : Activity.childs;
                        Activity.subRows =
                          Activity.subRows == undefined ? [] : Activity.subRows;
                        Activity.childs.push(childItem.data);
                        Activity.subRows.push(childItem.data);
                        // Activity.subRows = Activity?.subRows.filter((val: any, id: any, array: any) => {
                        //     return array.indexOf(val) == id;
                        // })
                        // Activity.subRows = Activity?.subRows?.filter((ele: any, ind: any) => ind === Activity?.subRows?.findIndex((elem: { ID: any }) => elem.ID === ele.ID));
                        Activity.subRows = Activity?.subRows?.filter((ele: any, ind: any) => ind === Activity?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
                      }

                      if (
                        Activity.subRows != undefined &&
                        Activity.subRows.length > 0
                      ) {
                        Activity?.subRows?.map((workst: any) => {
                          if (
                            workst?.DueDate?.length > 0 &&
                            workst?.DueDate != "Invalid date"
                          ) {
                            workst.DueDate = workst?.DueDate
                              ? Moment(workst?.DueDate).format("MM-DD-YYYY")
                              : null;
                          } else {
                            workst.DueDate = "";
                          }
                          workst.flag = true;
                          workst.show = false;
                          if (
                            workst.Id == ParentTaskId ||
                            workst.ID == ParentTaskId
                          ) {
                            workst.childs =
                              workst.childs == undefined ? [] : workst.childs;
                            workst.subRows =
                              workst.subRows == undefined ? [] : workst.subRows;
                            workst.childs.push(childItem.data);
                            workst.subRows.push(childItem.data);
                            // workst.subRows = workst?.subRows?.filter((ele: any, ind: any) => ind === workst?.subRows?.findIndex((elem: { ID: any }) => elem.ID === ele.ID));
                            workst.subRows = workst?.subRows?.filter((ele: any, ind: any) => ind === workst?.subRows?.findIndex((elem: any) => elem.ID === ele.ID));
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
        AllDataRender = AllDataRender?.concat(array);
        Renderarray = [];
        Renderarray = Renderarray.concat(AllDataRender);
        // setData((array) => array);
        refreshDataTaskLable();
        // rerender();
      }
    }
  }, []);

  const TimeEntryCallBack = React.useCallback((item1) => {
    setIsTimeEntry(false);
  }, []);
  const EditComponentPopup = (item: any) => {
    item["siteUrl"] = ContextValue.siteUrl;
    item["listName"] = "Master Tasks";
    setIsComponent(true);
    setSharewebComponent(item);
  };
  const EditItemTaskPopup = (item: any) => {
    setIsTask(true);
    setSharewebTask(item);
  };




  let isOpenPopup = false;
  const CloseCall = React.useCallback((item) => {
    setRowSelection({});
    if (!isOpenPopup && item.CreatedItem != undefined) {
      item.CreatedItem.forEach((obj: any) => {
        obj.data.childs = [];
        obj.data.subRows = [];
        obj.data.flag = true;
        obj.data.TitleNew = obj.data.Title;
        obj.data.siteType = "Master Tasks";
        if (
          obj.data.Item_x0020_Type != undefined &&
          obj.data.Item_x0020_Type === "Component"
        )
          obj.data.SiteIconTitle = "C"; // obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

        if (
          obj.data.Item_x0020_Type != undefined &&
          obj.data.Item_x0020_Type === "SubComponent"
        )
          obj.data.SiteIconTitle = "S"; // obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
        if (
          obj.data.Item_x0020_Type != undefined &&
          obj.data.Item_x0020_Type === "Feature"
        )
          obj.data.SiteIconTitle = "F"; // obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
        obj.data["TaskID"] = obj.data.PortfolioStructureID;
        if (
          item.props != undefined &&
          item.props.SelectedItem != undefined &&
          item.props.SelectedItem.childs != undefined
        ) {
          item.props.SelectedItem.childs =
            item.props.SelectedItem.childs == undefined
              ? []
              : item.props.SelectedItem.childs;
          item.props.SelectedItem.childs.unshift(obj.data);
        }
      });
      if (array != undefined && array.length > 0) {
        array.forEach((compnew: any, index: any) => {
          if (compnew.childs != undefined && compnew.childs.length > 0) {
            item.props.SelectedItem.downArrowIcon = compnew.downArrowIcon;
            item.props.SelectedItem.RightArrowIcon = compnew.RightArrowIcon;
            return false;
          }
        });
        array.forEach((comp: any, index: any) => {
          if (
            comp.Id != undefined &&
            item.props.SelectedItem != undefined &&
            comp.Id === item.props.SelectedItem.Id
          ) {
            comp.childsLength = item.props.SelectedItem.childs.length;
            comp.show = comp.show == undefined ? false : comp.show;
            comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
            comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;

            comp.childs = item.props.SelectedItem.childs;
            comp.subRows = item.props.SelectedItem.childs;
          }
          if (comp.childs != undefined && comp.childs.length > 0) {
            comp.childs.forEach((subcomp: any, index: any) => {
              if (
                subcomp.Id != undefined &&
                item.props.SelectedItem != undefined &&
                subcomp.Id === item.props.SelectedItem.Id
              ) {
                subcomp.childsLength = item.props.SelectedItem.childs.length;
                subcomp.show = subcomp.show == undefined ? false : subcomp.show;
                subcomp.childs = item.props.SelectedItem.childs;
                subcomp.subRows = item.props.SelectedItem.childs;
                comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
              }
            });
          }
        });
        // }
      }
      setData((array) => [...array]);
      if (
        item.CreateOpenType != undefined &&
        item.CreateOpenType === "CreatePopup"
      ) {
        setSharewebComponent(item.CreatedItem[0].data);
        setIsComponent(true);
      }
      refreshData();
      rerender();
    }
    if (!isOpenPopup && item.data != undefined) {
      item.data.childs = [];
      item.data.flag = true;
      item.data.TitleNew = item.data.Title;
      item.data.siteType = "Master Tasks";
      item.data.childsLength = 0;
      if (
        item.data.Item_x0020_Type != undefined &&
        item.data.Item_x0020_Type === "Component"
      )
        item.data.SiteIconTitle = "C"; // item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

      if (
        item.data.Item_x0020_Type != undefined &&
        item.data.Item_x0020_Type === "SubComponent"
      )
        item.data.SiteIconTitle = "S"; // item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
      if (
        item.data.Item_x0020_Type != undefined &&
        item.data.Item_x0020_Type === "Feature"
      )
        item.data.SiteIconTitle = "F"; // item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';

      // item.data['SiteIcon'] = GetIconImageUrl(item.data.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
      item.data["TaskID"] = item.data.PortfolioStructureID;

      array.unshift(item.data);
      setData((array) => [...array]);
      refreshData();
      rerender();
    }
    setAddModalOpen(false);
  }, []);

  const CreateOpenCall = React.useCallback((item) => {
    setRowSelection({});
    isOpenPopup = true;
    item.data.childs = [];
    item.data.flag = true;
    item.data.siteType = "Master Tasks";
    item.data.TitleNew = item.data.Title;
    item.data.childsLength = 0;
    if (
      item.data.Item_x0020_Type != undefined &&
      item.data.Item_x0020_Type === "Component"
    )
      item.data.SiteIconTitle = "C"; //item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

    if (
      item.data.Item_x0020_Type != undefined &&
      item.data.Item_x0020_Type === "SubComponent"
    )
      item.data.SiteIconTitle = "S"; //item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
    if (
      item.data.Item_x0020_Type != undefined &&
      item.data.Item_x0020_Type === "Feature"
    )
      item.data.SiteIconTitle = "F"; // item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
    item.data["TaskID"] = item.data.PortfolioStructureID;
    if (checkedList != undefined && checkedList.length > 0)
      checkedList[0].childs.unshift(item.data);
    else array.unshift(item.data);

    setSharewebComponent(item.data);
    setIsComponent(true);
    setData((array) => [...array]);
    refreshData();
    rerender();
  }, []);




  // --------------------------restructure button function, after click restructure icon will show (buttonRestructuring)----------------------------------------------------


  const buttonRestructuring = () => {
    AllDataRender = [];
    var ArrayTest: any = [];
    if (
      checkedList.length > 0 &&
      checkedList[0].childs != undefined &&
      checkedList[0].childs.length > 0 &&
      checkedList[0].Item_x0020_Type === "Component"
    )
      alert("You are not allowed to Restructure this item.");

    if (checkedList.length > 0) {
      checkedList.map((items: any) => {
        if (items.childs != undefined &&
          items.childs.length === 0 &&
          items.Item_x0020_Type === "Component") {
          let newObj: any = {};
          let newarrays: any = [];
          maidataBackup.forEach((obj) => {
            if (items?.Id !== obj.Id && obj.TaskType?.Title !== "Task" && obj.TaskType?.Title !== "Activities") {
              newarrays.push(obj);
              setCheckSubChilds(obj);
              setRestructuredItemarray(newarrays);
              obj.isRestructureActive = true;
            } else {
              newObj = { Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle };
              ArrayTest.push(newObj)
              setRestructureChecked(ArrayTest);
            }
            if (obj.childs != undefined && obj.childs.length > 0) {
              obj.childs.forEach((sub: any) => {
                if (sub.Item_x0020_Type === "SubComponent" && sub.TaskType?.Title !== "Task" && sub.TaskType?.Title !== "Activities") {
                  sub.isRestructureActive = true;
                }
              });
            }
          });
        } else if (items.Item_x0020_Type === "SubComponent") {
          let newObj: any = {}
          maidataBackup.forEach((obj) => {
            if (obj.TaskType?.Title !== "Task" && obj.TaskType?.Title !== "Activities") {
              obj.isRestructureActive = true;
            }
            if (obj.childs != undefined && obj.childs.length > 0) {
              let newChildarray: any = [];
              let newarrays: any = [];
              obj.childs.forEach((sub: any) => {
                if (sub.Id === items?.Id && sub.Item_x0020_Type === "SubComponent") {
                  newarrays.push(obj);
                  setCheckSubChilds(sub);
                  setRestructuredItemarray(newarrays);
                  setComponentRestruct(true);
                  newObj = {
                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle, TaskType: obj.TaskType,
                    newChild: { Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle, TaskType: sub.TaskType, }
                  };
                  newChildarray.push(newObj.newChild)
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj);
                } else {

                  if (items?.Item_x0020_Type === "SubComponent" && items?.childs[0]?.Item_x0020_Type !== "Feature" && sub?.Item_x0020_Type === "SubComponent") {
                    sub.isRestructureActive = true;
                  }

                }
              });
            }
          });
        } else if (items.Item_x0020_Type === "Feature") {
          let newObj: any = {}
          maidataBackup.forEach((obj) => {
            if (obj.TaskType?.Title !== "Task" && obj.TaskType?.Title !== "Activities") {
              obj.isRestructureActive = true;
            }

            if (obj.childs != undefined && obj.childs.length > 0) {
              let newarrays: any = [];
              let newChildarray: any = [];
              obj.childs.forEach((sub: any) => {
                setComponentRestruct(true);
                if (sub.Item_x0020_Type === "SubComponent") {
                  sub.isRestructureActive = true;
                }
                if (sub.Id === items?.Id) {
                  newarrays.push(obj);
                  setCheckSubChilds(sub);
                  sub.isRestructureActive = false;
                  setRestructuredItemarray(newarrays);
                  newObj = {
                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle, TaskType: obj.TaskType,
                    newChild: {
                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle, TaskType: sub.TaskType,
                    }
                  };
                  setComponentRestruct(true);
                  newChildarray.push(newObj.newChild)
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj);
                }
                if (sub.childs != undefined && sub.childs.length > 0) {

                  sub.childs.forEach((newsub: any) => {
                    if (newsub.Id === items?.Id) {
                      newarrays.push(obj);
                      setCheckSubChilds(newsub);
                      sub.isRestructureActive = false;
                      setRestructuredItemarray(newarrays);
                      newObj = {
                        Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle, TaskType: obj.TaskType,
                        newChild: {
                          Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle, TaskType: sub.TaskType,
                          newFchild: { Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle, TaskType: newsub.TaskType, }
                        }
                      };
                      setComponentRestruct(true);
                      newChildarray.push(newObj.newChild.newFchild)
                      setRestructureChecked(newChildarray);
                      ArrayTest.push(newObj);
                    }
                  });
                }
              });
            }
          });
        } else if (items.TaskType?.Title === "Activities" && items.Item_x0020_Type === "Task") {
          let newObj: any = {}
          maidataBackup.forEach((obj) => {
            let newChildarray: any = [];
            let newarrays: any = [];
            if (obj.TaskType?.Title !== "Task" && obj?.Id == items?.Id && obj?.TaskID == items?.TaskID && obj?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
              newObj = {
                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, TaskType: obj.TaskType,
              }
              newarrays.push(obj);
              setRestructuredItemarray(newarrays);
              newChildarray.push(newObj);
              setRestructureChecked(newChildarray);
              ArrayTest.push(newObj);
            }
            if (obj.TaskType?.Title !== "Task" && obj?.TaskID !== items?.TaskID && obj?.Id !== items?.Id) {
              obj.isRestructureActive = true
            }
            if ((obj.TaskType?.Title == "Activities" || obj.TaskType?.Title == "Workstream") && obj?.siteType !== items?.siteType) {
              obj.isRestructureActive = false;
            }
            if (obj?.childs != undefined && obj?.childs?.length > 0) {
              obj.childs.forEach((sub: any) => {
                let newChildarray: any = [];
                let newarrays: any = [];
                if (sub.TaskType?.Title !== "Task" && sub?.Id == items?.Id && sub?.TaskID == items?.TaskID && sub?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                  newObj = {
                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                    newChild: {
                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, TaskType: sub.TaskType,
                    }
                  }
                  newarrays.push(obj);
                  setRestructuredItemarray(newarrays);
                  newChildarray.push(newObj?.newChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj);
                }
                if (sub.TaskType?.Title !== "Task" && sub?.TaskID !== items?.TaskID && sub?.Id !== items?.Id) {
                  sub.isRestructureActive = true
                }
                if ((sub.TaskType?.Title == "Activities" || sub.TaskType?.Title == "Workstream") && sub?.siteType !== items?.siteType) {
                  sub.isRestructureActive = false;
                }
                if (sub.childs != undefined && sub.childs.length > 0) {
                  sub.childs.forEach((newsub: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    setComponentRestruct(true);
                    if (newsub.TaskType?.Title !== "Task" && newsub?.Id == items?.Id && newsub?.TaskID == items?.TaskID && newsub?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                      newarrays.push(obj);
                      setRestructuredItemarray(newarrays);
                      newObj = {
                        Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                        newChild: {
                          Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, TaskType: sub.TaskType,
                          newFchild: {
                            Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, TaskType: newsub.TaskType,
                          }
                        }
                      }
                      newChildarray.push(newObj?.newChild?.newFchild)
                      setRestructureChecked(newChildarray);
                      ArrayTest.push(newObj);
                    }
                    if (newsub.TaskType?.Title !== "Task" && newsub?.TaskID !== items?.TaskID && newsub?.Id !== items?.Id) {

                      newsub.isRestructureActive = true
                    }
                    if ((newsub.TaskType?.Title == "Activities" || newsub.TaskType?.Title == "Workstream") && newsub?.siteType !== items?.siteType) {
                      newsub.isRestructureActive = false;
                    }
                    if (newsub.childs != undefined && newsub.childs.length > 0) {
                      let newChildarray: any = [];
                      let newarrays: any = [];
                      newsub.childs.forEach((activity: any) => {
                        if (activity.TaskType?.Title !== "Task" && activity?.Id == items?.Id && activity?.TaskID == items?.TaskID && activity?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                          newarrays.push(obj);
                          setRestructuredItemarray(newarrays);
                          activity.isRestructureActive = false;
                          newsub.isRestructureActive = false;
                          newObj = {
                            Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle, TaskType: obj.TaskType,
                            newChild: {
                              Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle, TaskType: sub.TaskType,
                              newFchild: {
                                Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle, TaskType: newsub.TaskType,
                                newActChild: { Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, TaskType: activity.TaskType }
                              }
                            }
                          };
                          newChildarray.push(newObj?.newChild?.newFchild?.newActChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj);
                        } else {
                          if (activity.TaskType?.Title !== "Task" && activity?.siteType == items?.siteType) {
                            activity.isRestructureActive = true;
                          }
                        }
                        if (activity?.childs != undefined && activity?.childs?.length > 0) {
                          activity?.childs?.forEach((wrkstrm: any) => {
                            if (wrkstrm.TaskType?.Title !== "Task" && wrkstrm?.siteType == items?.siteType) {
                              wrkstrm.isRestructureActive = true;
                            }
                          })
                        }
                      })
                    }
                  });
                }
              });
            }
          });
        } else if (items.TaskType?.Title === "Workstream" && items.Item_x0020_Type === "Task") {
          let newObj: any = {}
          maidataBackup.forEach((obj) => {
            let newChildarray: any = [];
            let newarrays: any = [];
            if (obj.TaskType?.Title !== "Task" && obj?.Id == items?.Id && obj?.TaskID == items?.TaskID && obj?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
              newObj = {
                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, TaskType: obj.TaskType,
              }
              newarrays.push(obj);
              setRestructuredItemarray(newarrays);
              newChildarray.push(newObj);
              setRestructureChecked(newChildarray);
              ArrayTest.push(newObj);
            }
            if (obj.TaskType?.Title !== "Task" && obj?.TaskID !== items?.TaskID && obj?.Id !== items?.Id) {
              obj.isRestructureActive = true;
            }
            if ((obj.TaskType?.Title == "Activities" || obj.TaskType?.Title == "Workstream") && obj?.siteType !== items?.siteType) {
              obj.isRestructureActive = false;
            }
            if (obj?.childs != undefined && obj?.childs?.length > 0) {
              obj.childs.forEach((sub: any) => {
                let newChildarray: any = [];
                let newarrays: any = [];
                if (sub.TaskType?.Title !== "Task" && sub?.Id == items?.Id && sub?.TaskID == items?.TaskID && sub?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                  newObj = {
                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                    newChild: {
                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, TaskType: sub.TaskType,
                    }
                  }
                  newarrays.push(obj);
                  setRestructuredItemarray(newarrays);
                  newChildarray.push(newObj?.newChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj);
                }
                if (sub.TaskType?.Title !== "Task" && sub?.TaskID !== items?.TaskID && sub?.Id !== items?.Id) {
                  sub.isRestructureActive = true;
                }
                if ((sub.TaskType?.Title == "Activities" || sub.TaskType?.Title == "Workstream") && sub?.siteType !== items?.siteType) {
                  sub.isRestructureActive = false;
                }
                if (sub.childs != undefined && sub.childs.length > 0) {
                  sub.childs.forEach((newsub: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    if (newsub.TaskType?.Title !== "Task" && newsub?.Id == items?.Id && newsub?.TaskID == items?.TaskID && newsub?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                      newarrays.push(obj);
                      setRestructuredItemarray(newarrays);
                      newObj = {
                        Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                        newChild: {
                          Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, TaskType: sub.TaskType,
                          newFchild: {
                            Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, TaskType: newsub.TaskType,
                          }
                        }
                      }
                      newChildarray.push(newObj?.newChild?.newFchild)
                      setRestructureChecked(newChildarray);
                      ArrayTest.push(newObj);
                    }
                    if (newsub.TaskType?.Title !== "Task" && newsub?.TaskID !== items?.TaskID && newsub?.Id !== items?.Id) {
                      newsub.isRestructureActive = true;
                    }
                    if ((newsub.TaskType?.Title == "Activities" || newsub.TaskType?.Title == "Workstream") && newsub?.siteType !== items?.siteType) {
                      newsub.isRestructureActive = false;
                    }
                    if (newsub.childs != undefined && newsub.childs.length > 0) {
                      let newChildarray: any = [];
                      let newarrays: any = [];
                      newsub.childs.forEach((activity: any) => {
                        if (activity.TaskType?.Title !== "Task" && activity?.Id == items?.Id && activity?.TaskID == items?.TaskID && activity?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                          newarrays.push(obj);
                          setRestructuredItemarray(newarrays);
                          activity.isRestructureActive = false;
                          newsub.isRestructureActive = false;
                          newObj = {
                            Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                            newChild: {
                              Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, TaskType: sub.TaskType,
                              newFchild: {
                                Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle, TaskType: newsub.TaskType,
                                newActChild: { Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, TaskType: activity.TaskType }
                              }
                            }
                          };
                          newChildarray.push(newObj?.newChild?.newFchild?.newActChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj);
                        }
                        if (activity.TaskType?.Title !== "Task" && activity?.TaskID !== items?.TaskID && activity?.Id !== items?.Id) {
                          activity.isRestructureActive = true;
                        }
                        if ((activity.TaskType?.Title == "Activities" || activity.TaskType?.Title == "Workstream") && activity?.siteType !== items?.siteType) {
                          activity.isRestructureActive = false;
                        }
                        setComponentRestruct(true);
                        if (activity?.childs != undefined && activity?.childs?.length > 0) {
                          activity?.childs?.forEach((wrkstrm: any) => {
                            if (wrkstrm.TaskType?.Title !== "Task" && wrkstrm?.Id == items?.Id && wrkstrm?.TaskID == items?.TaskID && wrkstrm?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                              newarrays.push(obj);
                              setRestructuredItemarray(newarrays);
                              wrkstrm.isRestructureActive = false;
                              newObj = {
                                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle, TaskType: obj.TaskType,
                                newChild: {
                                  Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle, TaskType: sub.TaskType,
                                  newFchild: {
                                    Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle, TaskType: newsub.TaskType,
                                    newActChild: {
                                      Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, TaskType: activity.TaskType,
                                      newWrkChild: { Title: wrkstrm.Title, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, TaskType: wrkstrm.TaskType, }
                                    }
                                  }
                                }
                              };

                              newChildarray.push(newObj?.newChild?.newFchild?.newActChild?.newWrkChild)
                              setRestructureChecked(newChildarray);
                              ArrayTest.push(newObj);
                            } else {
                              if (wrkstrm.TaskType?.Title !== "Task" && wrkstrm?.siteType == items?.siteType) {
                                wrkstrm.isRestructureActive = true;
                              }
                            }


                          })
                        }
                      })
                    }
                  });
                }
              });
            }
          });
        } else if (items.TaskType?.Title === "Task" && items.Item_x0020_Type === "Task") {
          let newObj: any = {}
          maidataBackup.forEach((obj) => {

            let newChildarray: any = [];
            let newarrays: any = [];
            if (obj.TaskType?.Title == "Task" && obj?.Id == items?.Id && obj?.TaskID == items?.TaskID && obj?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
              newObj = {
                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, TaskType: obj.TaskType,
              }
              newarrays.push(obj);
              setRestructuredItemarray(newarrays);
              newChildarray.push(newObj);
              setRestructureChecked(newChildarray);
              ArrayTest.push(newObj);
            }
            if (obj.TaskType?.Title !== "Task") {
              obj.isRestructureActive = true;
            }
            if ((obj.TaskType?.Title == "Activities" || obj.TaskType?.Title == "Workstream") && obj?.siteType !== items?.siteType) {
              obj.isRestructureActive = false;
            }
            if (obj?.childs != undefined && obj?.childs?.length > 0) {
              obj.childs.forEach((sub: any) => {

                let newChildarray: any = [];
                let newarrays: any = [];
                if (sub.TaskType?.Title == "Task" && sub?.Id == items?.Id && sub?.TaskID == items?.TaskID && sub?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                  newObj = {
                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                    newChild: {
                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, TaskType: sub.TaskType,
                    }
                  }
                  newarrays.push(obj);
                  setRestructuredItemarray(newarrays);
                  newChildarray.push(newObj?.newChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj);
                }

                if (sub.TaskType?.Title !== "Task") {
                  sub.isRestructureActive = true;
                }
                if ((sub.TaskType?.Title == "Activities" || sub.TaskType?.Title == "Workstream") && sub?.siteType !== items?.siteType) {
                  sub.isRestructureActive = false;
                }
                if (sub.childs != undefined && sub.childs.length > 0) {
                  sub.childs.forEach((newsub: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    if (newsub.TaskType?.Title == "Task" && newsub?.Id == items?.Id && newsub?.TaskID == items?.TaskID && newsub?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                      newarrays.push(obj);
                      setRestructuredItemarray(newarrays);
                      newObj = {
                        Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                        newChild: {
                          Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, TaskType: sub.TaskType,
                          newFchild: {
                            Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, TaskType: newsub.TaskType,
                          }
                        }
                      }
                      newChildarray.push(newObj?.newChild?.newFchild)
                      setRestructureChecked(newChildarray);
                      ArrayTest.push(newObj);
                    }

                    if (newsub.TaskType?.Title !== "Task") {
                      newsub.isRestructureActive = true;
                    }
                    if ((newsub.TaskType?.Title == "Activities" || newsub.TaskType?.Title == "Workstream") && newsub?.siteType !== items?.siteType) {
                      newsub.isRestructureActive = false;
                    }
                    if (newsub.childs != undefined && newsub.childs.length > 0) {
                      let newChildarray: any = [];
                      let newarrays: any = [];
                      newsub.childs.forEach((activity: any) => {

                        if (activity.TaskType?.Title == "Task" && activity?.Id == items?.Id && activity?.TaskID == items?.TaskID && activity?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                          newarrays.push(obj);
                          setRestructuredItemarray(newarrays);
                          activity.isRestructureActive = false;
                          newsub.isRestructureActive = false;
                          newObj = {
                            Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                            newChild: {
                              Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, TaskType: sub.TaskType,
                              newFchild: {
                                Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle, TaskType: newsub.TaskType,
                                newActChild: { Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, TaskType: activity.TaskType }
                              }
                            }
                          };
                          newChildarray.push(newObj?.newChild?.newFchild?.newActChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj);
                        }
                        if (activity.TaskType?.Title !== "Task") {
                          activity.isRestructureActive = true;
                        }
                        if ((activity.TaskType?.Title == "Activities" || activity.TaskType?.Title == "Workstream") && activity?.siteType !== items?.siteType) {
                          activity.isRestructureActive = false;
                        }
                        setComponentRestruct(true);
                        if (activity?.childs != undefined && activity?.childs?.length > 0) {
                          activity?.childs?.forEach((wrkstrm: any) => {
                            if (wrkstrm.TaskType?.Title == "Task" && wrkstrm?.Id == items?.Id && wrkstrm?.TaskID == items?.TaskID && wrkstrm?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                              newarrays.push(obj);
                              setRestructuredItemarray(newarrays);
                              wrkstrm.isRestructureActive = false;
                              newObj = {
                                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                                newChild: {
                                  Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, TaskType: sub.TaskType,
                                  newFchild: {
                                    Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle, TaskType: newsub.TaskType,
                                    newActChild: {
                                      Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, TaskType: activity.TaskType,
                                      newWrkChild: { Title: wrkstrm.Title, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, TaskType: wrkstrm.TaskType, }
                                    }
                                  }
                                }
                              };

                              newChildarray.push(newObj?.newChild?.newFchild?.newActChild?.newWrkChild)
                              setRestructureChecked(newChildarray);
                              ArrayTest.push(newObj);
                            }
                            if (wrkstrm?.childs != undefined && wrkstrm?.childs?.length > 0) {
                              wrkstrm?.childs?.forEach((task: any) => {
                                if (task.TaskType?.Title == "Task" && task?.Id == items?.Id && task?.TaskID == items?.TaskID && task?.ShowTooltipSharewebId == items?.ShowTooltipSharewebId) {
                                  newarrays.push(obj);
                                  setRestructuredItemarray(newarrays);
                                  wrkstrm.isRestructureActive = false;
                                  task.isRestructureActive = false;
                                  newObj = {
                                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle, TaskType: obj.TaskType,
                                    newChild: {
                                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle, TaskType: sub.TaskType,
                                      newFchild: {
                                        Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle, TaskType: newsub.TaskType,
                                        newActChild: {
                                          Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, TaskType: activity.TaskType,
                                          newWrkChild: {
                                            Title: wrkstrm.Title, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, TaskType: wrkstrm.TaskType,
                                            newTskChild: { Title: task.Title, Item_x0020_Type: task.Item_x0020_Type, Id: task.Id, siteIcon: task.SiteIcon, TaskType: task.TaskType, }
                                          }
                                        }
                                      }
                                    }
                                  };
                                  newChildarray.push(newObj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild)
                                  setRestructureChecked(newChildarray);
                                  ArrayTest.push(newObj);
                                } else {
                                  if (wrkstrm.TaskType?.Title !== "Task" && wrkstrm?.siteType == items?.siteType) {
                                    task.isRestructureActive = false;
                                  }
                                }
                              })
                            }

                          })
                        }
                      })
                    }
                  });
                }
              });
            }
          });
        }
      });
    };
    setOldArrayBackup(ArrayTest);
    AllDataRender = AllDataRender?.concat(maidataBackup);
    Renderarray = [];
    Renderarray = Renderarray.concat(AllDataRender);
    refreshDataTaskLable();
  };



  // ---------------------------(RestruringCloseCall) this function using for hide the restructure icons--------------------------------------------------

  const RestruringCloseCall = () => {
    setResturuningOpen(false);
  };

  const topRestructureClose = () => {
    setComponentRestruct(false);
    setTopCompoIcon(false)
  }

  // ------------------------(OpenModal) this function using for new hierarchy of restructuring--------------------------------------------------------------------------------

  const OpenModal = (item: any) => {
    var TestArray: any = [];
    setResturuningOpen(true);
    setNewItemBackUp(item);
    maidataBackup.forEach((obj) => {
      let object: any = {};
      if (obj.ShowTooltipSharewebId === item.ShowTooltipSharewebId && obj.TaskID === item.TaskID && obj.Id === item.Id && obj.TaskType?.Title === item.TaskType?.Title) {
        object = { Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle }
        TestArray.push(object);
      }
      if (obj.childs != undefined && obj.childs.length > 0) {
        obj.childs.forEach((sub: any) => {
          if (sub.ShowTooltipSharewebId === item.ShowTooltipSharewebId && sub.TaskID === item.TaskID && sub.Id === item.Id && sub.TaskType?.Title === item.TaskType?.Title) {
            object = {
              Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
              newChild: { Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle }
            }
            TestArray.push(object)
          }
          if (sub.childs != undefined && sub.childs.length > 0) {
            sub.childs.forEach((newsub: any) => {
              if (newsub.ShowTooltipSharewebId === item.ShowTooltipSharewebId && newsub.TaskID === item.TaskID && newsub.Id === item.Id && newsub.TaskType?.Title === item.TaskType?.Title) {
                object = {
                  Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                  newChild: {
                    Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                    newFchild: { Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle }
                  }
                }
                TestArray.push(object)
              }
              if (newsub.childs != undefined && newsub.childs.length > 0) {
                newsub.childs.forEach((activity: any) => {
                  if (activity.ShowTooltipSharewebId === item.ShowTooltipSharewebId && activity.TaskID === item.TaskID && activity.Id === item.Id && activity.TaskType?.Title === item.TaskType?.Title) {
                    object = {
                      Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                      newChild: {
                        Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                        newFchild: {
                          Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle,
                          newActChild: { Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, }
                        }
                      }
                    }
                    TestArray.push(object)
                  }
                  if (newsub.childs != undefined && newsub.childs.length > 0) {
                    activity.childs.forEach((wrkstrm: any) => {
                      if (wrkstrm.ShowTooltipSharewebId === item.ShowTooltipSharewebId && wrkstrm.TaskID === item.TaskID && wrkstrm.Id === item.Id) {
                        object = {
                          Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIconTitle === undefined ? obj.SiteIcon : obj.SiteIconTitle,
                          newChild: {
                            Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIconTitle === undefined ? sub.SiteIcon : sub.SiteIconTitle,
                            newFchild: {
                              Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIconTitle === undefined ? newsub.SiteIcon : newsub.SiteIconTitle,
                              newActChild: {
                                Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon,
                                newWrkChild: { Title: wrkstrm.Title, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, }
                              }
                            }
                          }
                        };
                        TestArray.push(object)
                      }
                    })
                  }

                })
              }

            })
          }

        })
      }
    })
    setNewArrayBackup(TestArray);
  };



  // --------------------(setRestructure) this function for radio button to convert tasks into( workstream , task, subcomponent, feature)-----------------------------------


  const setRestructure = (item: any, title: any) => {
    let array: any = [];
    let data: any = []
    item?.map((items: any) => {
      if (items != undefined && title === "SubComponent") {
        data.push({ Id: items.Id, Item_x0020_Type: "SubComponent", TaskType: items.TaskType, Title: items.Title, siteIcon: "S" })
      }
      if (items != undefined && title === "Feature") {
        data.push({ Id: items.Id, Item_x0020_Type: "Feature", TaskType: items.TaskType, Title: items.Title, siteIcon: "F" })
      }
      if (items != undefined && title === "Workstream") {
        data.push({ Id: items.Id, Item_x0020_Type: "Task", TaskType: { Title: "Workstream", Id: items.TaskType.Id }, Title: items.Title, siteIcon: items.siteIcon })
      }
      if (items != undefined && title === "Task") {
        data.push({ Id: items.Id, Item_x0020_Type: "Task", TaskType: { Title: "Task", Id: items.TaskType.Id }, Title: items.Title, siteIcon: items.siteIcon })
      }
    })
    array.push(...data);
    setRestructureChecked(array)
  };



  // -----------------------------------------(makeTopComp)this function for restructure tasks to component---------------------------------------------



  const makeTopComp = async () => {
    let PortfolioStructureIDs: any = "";
    let ItemTitle: any = '';
    let ChengedItemTitle: any = "";
    let siteIcon: any = '';
    let PortfolioLevelNum: any = 0;
    let TaskLevel: number = 0;
    let TaskID: any;

    AllDataRender = [];


    if (RestructureChecked != undefined && RestructureChecked?.length > 0 && (RestructureChecked[0].Item_x0020_Type == "SubComponent" || RestructureChecked[0].Item_x0020_Type == "Feature")) {
      ChengedItemTitle = "Component";
      siteIcon = "C";

    }

    if (RestructureChecked != undefined && RestructureChecked?.length > 0 && (RestructureChecked[0].TaskType?.Title == "Workstream" || RestructureChecked[0].TaskType?.Title == "Task")) {
      ChengedItemTitle = "Activities";
    }

    if (RestructureChecked != undefined && RestructureChecked?.length > 0 && (RestructureChecked[0].Item_x0020_Type == "SubComponent" || RestructureChecked[0].Item_x0020_Type == "Feature")) {
      maidataBackup.map((obj: any) => {
        if (obj.Item_x0020_Type === "Component") {
          if (PortfolioLevelNum <= obj.PortfolioLevel) {
            PortfolioLevelNum = obj.PortfolioLevel + 1;
            PortfolioStructureIDs = "C" + PortfolioLevelNum;
          }
        }
      })
    }

    if (RestructureChecked != undefined && RestructureChecked?.length > 0 && (RestructureChecked[0].TaskType?.Title == "Workstream" || RestructureChecked[0].TaskType?.Title == "Task")) {
      maidataBackup.map((obj: any) => {
        if (obj.childs.length > 0 && obj.childs != undefined) {
          obj.childs.map((sub: any) => {
            if (checkedList[0].ParentTask?.Id === sub.Id) {
              if (TaskLevel <= sub.TaskLevel) {
                TaskLevel = sub.TaskLevel + 1;
                PortfolioStructureIDs = sub.PortfolioStructureID;
                TaskID = 'SA' + TaskLevel;
              }
            }
            if (sub.childs.length > 0 && sub.childs != undefined) {
              sub.childs.map((newsub: any) => {
                if (checkedList[0].ParentTask?.Id === newsub.Id) {
                  if (TaskLevel <= newsub.TaskLevel) {
                    TaskLevel = newsub.TaskLevel + 1;
                    PortfolioStructureIDs = newsub.PortfolioStructureID;
                    TaskID = 'SA' + TaskLevel;
                  }

                }

                if (newsub.childs.length > 0 && newsub.childs != undefined) {
                  newsub.childs.map((feature: any) => {
                    if (checkedList[0].ParentTask?.Id === feature.Id) {
                      if (TaskLevel <= feature.TaskLevel) {
                        TaskLevel = feature.TaskLevel + 1;
                        PortfolioStructureIDs = feature.PortfolioStructureID;
                        TaskID = 'SA' + TaskLevel;
                      }

                    }
                  })
                }

              })
            }
          })
        }
      })
    }



    if (ChengedItemTitle != undefined && ChengedItemTitle != "" && (RestructureChecked[0].Item_x0020_Type == "SubComponent" || RestructureChecked[0].Item_x0020_Type == "Feature")) {
      let web = new Web(ContextValue.siteUrl);
      var postData: any = {
        Item_x0020_Type: ChengedItemTitle,
        PortfolioStructureID: PortfolioStructureIDs,
        PortfolioLevel: PortfolioLevelNum,
        TaskID: PortfolioStructureIDs,
        ParentId: null

      };

      await web.lists
        .getById(ContextValue.MasterTaskListID)
        .items.getById(checkedList[0].Id)
        .update(postData)
        .then(async (res: any) => {


          let checkUpdate: number = 1;
          let array: any = [...maidataBackup];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          let count: number = 0;
          checkedList.map((items: any) => {
            latestCheckedList.push({ ...items })
            backupCheckedList.push({ ...items })
          })

          latestCheckedList?.map((items: any) => {
            items.PortfolioLevel = postData.PortfolioLevel,
              items.PortfolioStructureID = postData.PortfolioStructureID,
              items.Item_x0020_Type = postData.Item_x0020_Type
            items.TaskID = postData.PortfolioStructureID,
              items.SiteIconTitle = siteIcon,
              items.Parent = { Id: null, Title: null }
          })


          array.map((obj: any, index: any) => {
            obj.isRestructureActive = false;

            if (count == 0) {
              array.splice(array.length - 1, 0, ...latestCheckedList);
              count = 1;
            }

            if (obj?.subRows != undefined && obj?.subRows.length > 0) {
              obj?.subRows?.map((sub: any, subIndex: any) => {
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate == 1) {
                  array[index]?.subRows.splice(subIndex, 1);
                  array[index]?.childs.splice(subIndex, 1);
                  checkUpdate = 2;
                }
                if (sub?.subRows != undefined && sub?.subRows.length > 0) {
                  sub?.subRows?.map((newsub: any, newsubIndex: any) => {
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate == 1) {
                      array[index]?.subRows[subIndex]?.subRows.splice(newsubIndex, 1);
                      array[index]?.childs[subIndex]?.childs.splice(newsubIndex, 1);
                      checkUpdate = 2;
                    }
                  })
                }

              })
            }

          })

          setmaidataBackup(array);
          setComponentRestruct(false);
          setTopCompoIcon(false)
          setRestructureChecked([]);
          setNewArrayBackup([]);
          setOldArrayBackup([]);
          setRowSelection({});
          RestruringCloseCall();
          setCheckedList([]);
          AllDataRender = AllDataRender?.concat(array);
          Renderarray = [];
          Renderarray = Renderarray.concat(AllDataRender);
          refreshDataTaskLable();
          console.log(Renderarray);


        });
    }

    if (ChengedItemTitle != undefined && ChengedItemTitle != "" && (RestructureChecked[0].TaskType?.Title == "Workstream" || RestructureChecked[0].TaskType?.Title == "Task")) {
      let web = new Web(ContextValue.siteUrl);
      var postData: any = {
        SharewebTaskTypeId: taskTypeId[0].Id,
        TaskLevel: TaskLevel,
        TaskID: TaskID,
        ParentTaskId: null
      };

      await web.lists
        .getById(checkedList[0].listId)
        .items.getById(checkedList[0].Id)
        .update(postData)
        .then(async (res: any) => {


          let checkUpdate: number = 1;
          let count: number = 0
          let array: any = [...maidataBackup];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          checkedList.map((items: any) => {
            latestCheckedList.push({ ...items })
            backupCheckedList.push({ ...items })
          })

          latestCheckedList?.map((items: any) => {
            items.PortfolioStructureID = postData.PortfolioStructureID,
              items.TaskID = postData.TaskID,
              items.ParentTask = { Id: null, Title: null, TaskID: null },
              items.TaskLevel = postData.TaskLevel,
              items.TaskType = { Id: taskTypeId[0].Id, Level: taskTypeId[0].Level, Title: taskTypeId[0].Title }
          })



          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
              obj.subRows.push(...latestCheckedList);
              obj.childs.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj.subRows != undefined && obj.subRows.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                  sub.subRows.push(...latestCheckedList);
                  sub.childs.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);
                  array[index]?.childs.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                      newsub.subRows.push(...latestCheckedList);
                      newsub.childs.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                      array[index]?.childs[indexsub]?.childs.splice(lastIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }

                    if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                      newsub.subRows.forEach((activity: any, activityIndex: any) => {
                        activity.isRestructureActive = false;
                        if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                          activity.subRows.push(...latestCheckedList);
                          activity.childs.push(...latestCheckedList);
                          checkUpdate = checkUpdate + 1;
                        }
                        if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                          array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                          array[index]?.childs[indexsub]?.childs[lastIndex].childs.splice(activityIndex, 1);
                          checkUpdate = checkUpdate + 1;
                        }

                        if (activity.subRows != undefined && activity.subRows.length > 0) {
                          activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                            workstream.isRestructureActive = false;
                            if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                              workstream.subRows.push(...latestCheckedList);
                              workstream.childs.push(...latestCheckedList);
                              checkUpdate = checkUpdate + 1;
                            }
                            if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                              array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                              array[index]?.childs[indexsub]?.childs[lastIndex].childs[activityIndex]?.childs.splice(workstreamIndex, 1);
                              checkUpdate = checkUpdate + 1;
                            }

                            if (activity.subRows != undefined && activity.subRows.length > 0) {
                              activity.subRows.forEach((task: any, taskIndex: any) => {
                                task.isRestructureActive = false;
                                if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                  task.subRows.push(...latestCheckedList);
                                  task.childs.push(...latestCheckedList);
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                  array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex]?.subRows.splice(taskIndex, 1);
                                  array[index]?.childs[indexsub]?.childs[lastIndex].childs[activityIndex]?.childs[workstreamIndex].childs?.splice(taskIndex, 1);
                                  checkUpdate = checkUpdate + 1;
                                }
                              })
                            }


                          })
                        }


                      })
                    }
                  })
                }
              })
            }

          })

          setmaidataBackup(array);
          setComponentRestruct(false);
          setTopCompoIcon(false)
          setRestructureChecked([]);
          setNewArrayBackup([]);
          setOldArrayBackup([]);
          setRowSelection({});
          RestruringCloseCall();
          setCheckedList([]);
          AllDataRender = AllDataRender?.concat(array);
          Renderarray = [];
          Renderarray = Renderarray.concat(AllDataRender);
          refreshDataTaskLable();


        });
    }


  }





  // -----------------------------------------(UpdateTaskRestructure)this function for restructure Activity, workstream and task only---------------------------------------------


  const UpdateTaskRestructure = async function () {

    AllDataRender = [];
    var Ids: any = [];
    Ids = newItemBackUp.Id;
    let Title: any = newItemBackUp.Title;
    let PortfolioStructureID = newItemBackUp.PortfolioStructureID;
    let ServicesId: any ;
    let TaskType: any = RestructureChecked[0].TaskType?.Title;
    let Item_x0020_Type = RestructureChecked[0].Item_x0020_Type;
    let TaskID: any;
    let ShowTooltipSharewebId: any;
    let siteIcon: any = RestructureChecked[0].Item_x0020_Type;
    ServicesId = (newItemBackUp?.Services[0]?.length > 0 ? "Service" : (newItemBackUp?.Component[0]?.length > 0 ? "Component" : newItemBackUp?.Portfolio_x0020_Type));





    if (newItemBackUp?.TaskType?.Title !== "Activities" && newItemBackUp?.TaskType?.Title !== "Workstream") {
      let numbers: any;

      if (newItemBackUp.childs.length > 0) {
        newItemBackUp.childs.map((items: any) => {
          if (items?.TaskType?.Title == "Activities") {
            numbers = items?.TaskLevel + 1;
          } else {
            numbers = 1;
          }
        })
      }

      if (newItemBackUp.childs.length == 0) {
        numbers = 1;
      }


      TaskID = `SA${numbers}`
      ShowTooltipSharewebId = newItemBackUp?.PortfolioStructureID + "-" + TaskID;

      let web = new Web(ContextValue.siteUrl);
      await web.lists
        .getById(checkedList[0].listId)
        .items.getById(checkedList[0].Id)
        .update({
          ServicesId:
          ServicesId === "Service"
              ? { results: [Ids] }
              : { results: [] },
          ComponentId:
          ServicesId === "Component"
              ? { results: [Ids] }
              : { results: [] },
          ParentTaskId: null,
          SharewebTaskTypeId: taskTypeId[0].Id,
          TaskLevel: numbers,
          TaskID: TaskID,
        })
        .then((res: any) => {


          let checkUpdate: number = 1;
          let array: any = [...maidataBackup];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          checkedList.map((items: any) => {
            latestCheckedList.push({ ...items })
            backupCheckedList.push({ ...items })
          })

          latestCheckedList?.map((items: any) => {
            checkedList[0].Services?.length > 0 ? items.Services = { Id: Ids, Title: Title } : items.Component = { Id: Ids, Title: Title },
              items.Parent = null,
              items.TaskLevel = numbers,
              items.TaskID = TaskID,
              items.TaskType = { Id: taskTypeId[0].Id, Level: taskTypeId[0].Level, Title: taskTypeId[0].Title },
              items.SiteIconTitle = siteIcon,
              items.PortfolioStructureID = PortfolioStructureID,
              items.Item_x0020_Type = Item_x0020_Type

          })

          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
              obj.subRows.push(...latestCheckedList);
              obj.childs.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj.subRows != undefined && obj.subRows.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                  sub.subRows.push(...latestCheckedList);
                  sub.childs.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);
                  array[index]?.childs.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                      newsub.subRows.push(...latestCheckedList);
                      newsub.childs.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                      array[index]?.childs[indexsub]?.childs.splice(lastIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }

                    if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                      newsub.subRows.forEach((activity: any, activityIndex: any) => {
                        activity.isRestructureActive = false;
                        if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                          activity.subRows.push(...latestCheckedList);
                          activity.childs.push(...latestCheckedList);
                          checkUpdate = checkUpdate + 1;
                        }
                        if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                          array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                          array[index]?.childs[indexsub]?.childs[lastIndex].childs.splice(activityIndex, 1);
                          checkUpdate = checkUpdate + 1;
                        }

                        if (activity.subRows != undefined && activity.subRows.length > 0) {
                          activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                            workstream.isRestructureActive = false;
                            if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                              workstream.subRows.push(...latestCheckedList);
                              workstream.childs.push(...latestCheckedList);
                              checkUpdate = checkUpdate + 1;
                            }
                            if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                              array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                              array[index]?.childs[indexsub]?.childs[lastIndex].childs[activityIndex]?.childs.splice(workstreamIndex, 1);
                              checkUpdate = checkUpdate + 1;
                            }

                            if (activity.subRows != undefined && activity.subRows.length > 0) {
                              activity.subRows.forEach((task: any, taskIndex: any) => {
                                task.isRestructureActive = false;
                                if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                  task.subRows.push(...latestCheckedList);
                                  task.childs.push(...latestCheckedList);
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                  array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex]?.subRows.splice(taskIndex, 1);
                                  array[index]?.childs[indexsub]?.childs[lastIndex].childs[activityIndex]?.childs[workstreamIndex].childs?.splice(taskIndex, 1);
                                  checkUpdate = checkUpdate + 1;
                                }
                              })
                            }


                          })
                        }


                      })
                    }
                  })
                }
              })
            }

          })

          setmaidataBackup(array);
          setComponentRestruct(false);
          setTopCompoIcon(false)
          setRestructureChecked([]);
          setNewArrayBackup([]);
          setOldArrayBackup([]);
          setRowSelection({});
          RestruringCloseCall();
          setCheckedList([]);
          AllDataRender = AllDataRender?.concat(array);
          Renderarray = [];
          Renderarray = Renderarray.concat(AllDataRender);
          refreshDataTaskLable();
        });
    } else {

      let numbers: any;
      let numbers1: any;
      let SharewebTaskTypeId: any;

      if (newItemBackUp.childs.length > 0) {
        newItemBackUp.childs.map((items: any) => {

          if (newItemBackUp?.TaskType?.Title == "Activities") {
            if (RestructureChecked[0].TaskType?.Title === 'Activities') {
              if (items?.TaskType?.Title == "Workstream") {
                numbers1 = items?.TaskLevel + 1;

              } else {
                numbers1 = 1;
              }

            } else {
              if (RestructureChecked[0].TaskType?.Title === items?.TaskType?.Title) {
                numbers1 = items?.TaskLevel + 1;
              } else {
                numbers1 = 1;
              }
            }
          } else if (newItemBackUp?.TaskType?.Title == "Workstream") {
            if (items?.TaskType?.Title == "Task") {
              numbers1 = items?.TaskLevel + 1;
            }

          } else {
            numbers1 = 1;
          }
        })
      } else {
        numbers1 = 1;
      }


      if (TaskType === "Activities") {
        SharewebTaskTypeId = taskTypeId[2];
      } else {
        SharewebTaskTypeId = TaskType === "Task" ? taskTypeId[1] : taskTypeId[2];
      }

      numbers = newItemBackUp.TaskLevel;
      TaskID = newItemBackUp.TaskID + "-" + `W${numbers1}`
      // ShowTooltipSharewebId =newItemBackUp?.PortfolioStructureID + TaskID;


      let web = new Web(ContextValue.siteUrl);
      await web.lists
        .getById(checkedList[0].listId)
        .items.getById(checkedList[0].Id)
        .update({
          ServicesId:
          ServicesId === "Service"
              ? { results: [Ids] }
              : { results: [] },
          ComponentId:
          ServicesId === "Component"
              ? { results: [Ids] }
              : { results: [] },
          TaskID: TaskID,
          TaskLevel: numbers,
          //TaskLevel: numbers1,
          SharewebTaskTypeId: SharewebTaskTypeId.Id,
          ParentTaskId: Ids
        })
        .then((res: any) => {
          let checkUpdate: number = 1;
          let array: any = [...maidataBackup];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          checkedList.map((items: any) => {
            latestCheckedList.push({ ...items })
            backupCheckedList.push({ ...items })
          })

          latestCheckedList?.map((items: any) => {
            checkedList[0].Services?.length > 0 ? items.Services = { Id: Ids, Title: Title } : items.Component = { Id: Ids, Title: Title },
              items.Parent = { Id: Ids, TaskID: TaskID, Title: Title },
              items.TaskLevel = numbers,
              items.TaskID = TaskID,
              items.TaskLevel = numbers1,
              items.TaskType = { Id: SharewebTaskTypeId.Id, Level: SharewebTaskTypeId.Level, Title: SharewebTaskTypeId.Title },
              items.Item_x0020_Type = Item_x0020_Type
          })

          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
              obj.subRows.push(...latestCheckedList);
              obj.childs.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj.subRows != undefined && obj.subRows.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                  sub.subRows.push(...latestCheckedList);
                  sub.childs.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);
                  array[index]?.childs.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                      newsub.subRows.push(...latestCheckedList);
                      newsub.childs.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                      array[index]?.childs[indexsub]?.childs.splice(lastIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }

                    if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                      newsub.subRows.forEach((activity: any, activityIndex: any) => {
                        activity.isRestructureActive = false;
                        if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                          activity.subRows.push(...latestCheckedList);
                          activity.childs.push(...latestCheckedList);
                          checkUpdate = checkUpdate + 1;
                        }
                        if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                          array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                          array[index]?.childs[indexsub]?.childs[lastIndex].childs.splice(activityIndex, 1);
                          checkUpdate = checkUpdate + 1;
                        }

                        if (activity.subRows != undefined && activity.subRows.length > 0) {
                          activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                            workstream.isRestructureActive = false;
                            if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                              workstream.subRows.push(...latestCheckedList);
                              workstream.childs.push(...latestCheckedList);
                              checkUpdate = checkUpdate + 1;
                            }
                            if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                              array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                              array[index]?.childs[indexsub]?.childs[lastIndex].childs[activityIndex]?.childs.splice(workstreamIndex, 1);
                              checkUpdate = checkUpdate + 1;
                            }

                            if (activity.subRows != undefined && activity.subRows.length > 0) {
                              activity.subRows.forEach((task: any, taskIndex: any) => {
                                task.isRestructureActive = false;
                                if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.TaskType?.Title === newItemBackUp?.TaskType?.Title && checkUpdate != 3) {
                                  task.subRows.push(...latestCheckedList);
                                  task.childs.push(...latestCheckedList);
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.TaskType?.Title === backupCheckedList[0]?.TaskType?.Title && checkUpdate != 3) {
                                  array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex].subRows?.splice(taskIndex, 1);
                                  array[index]?.childs[indexsub]?.childs[lastIndex].childs[activityIndex]?.childs[workstreamIndex].childs?.splice(taskIndex, 1);
                                  checkUpdate = checkUpdate + 1;
                                }
                              })
                            }


                          })
                        }


                      })
                    }
                  })
                }
              })
            }

          })

          setmaidataBackup(array);
          setComponentRestruct(false);
          setTopCompoIcon(false)
          setRestructureChecked([]);
          setNewArrayBackup([]);
          setOldArrayBackup([]);
          setRowSelection({});
          RestruringCloseCall();
          setCheckedList([]);
          AllDataRender = AllDataRender?.concat(array);
          Renderarray = [];
          Renderarray = Renderarray.concat(AllDataRender);
          refreshDataTaskLable();

        });
    }

  };



  // -----------------------------------------(UpdateRestructure)this function for restructure component, subcompoent and  only---------------------------------------------


  const UpdateRestructure = async function () {
    let PortfolioStructureIDs: any = "";
    var ItemId: any = "";
    let ItemTitle: any = '';
    let flag: any = false;
    let count: any = 0;
    let newItem: any = "";
    let ChengedItemTitle: any = "";
    let siteIcon: any = '';
    let PortfolioLevelNum: any = 0;
    AllDataRender = [];


    if (RestructureChecked != undefined && RestructureChecked?.length > 0) {
      RestructureChecked?.map((items: any) => {
        if ((items.Item_x0020_Type == "Feature" || items.Item_x0020_Type == "SubComponent") && newItemBackUp?.Item_x0020_Type == "Component") {
          ChengedItemTitle = items?.Item_x0020_Type;
          siteIcon = items?.siteIcon;
        }
        else if (items.Item_x0020_Type == "Component" && newItemBackUp?.Item_x0020_Type == "Component") {
          ChengedItemTitle = "SubComponent";
          siteIcon = "S";
        }
        else if (newItemBackUp?.Item_x0020_Type == "SubComponent" && (items.Item_x0020_Type == "Feature" || items.Item_x0020_Type == "SubComponent" || items.Item_x0020_Type == "Component")) {
          ChengedItemTitle = "Feature";
          siteIcon = "F";
        }

      })
    }


    maidataBackup?.forEach((obj) => {
      if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj?.childs?.length == 0) {
        PortfolioLevelNum = 1;
        ItemId = obj.Id;
        ItemTitle = obj.Title;
        PortfolioStructureIDs = obj.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
      }


      if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj?.childs?.length > 0) {
        obj.childs.forEach((sub: any) => {
          if (sub.Item_x0020_Type === ChengedItemTitle) {
            PortfolioLevelNum = sub.PortfolioLevel + 1;
          } else {
            PortfolioLevelNum = 1;
          }
        });
        ItemId = obj.Id;
        ItemTitle = obj.Title;
        PortfolioStructureIDs = obj.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
      } else {
        obj.childs.forEach((sub: any) => {
          if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub?.childs?.length == 0) {
            PortfolioLevelNum = 1;
            ItemId = sub.Id;
            ItemTitle = sub.Title;
            PortfolioStructureIDs = sub.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
          }

          if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub?.childs?.length > 0) {
            sub.childs.forEach((newsub: any) => {
              if (newsub.Item_x0020_Type === ChengedItemTitle) {
                PortfolioLevelNum = newsub.PortfolioLevel + 1;
              } else {
                PortfolioLevelNum = 1;
              }
            });
            ItemId = sub.Id;
            ItemTitle = sub.Title;
            PortfolioStructureIDs = sub.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
          }
        });
      }
    });




    if (ChengedItemTitle != undefined && ChengedItemTitle != "") {
      let web = new Web(ContextValue.siteUrl);
      var postData: any = {
        ParentId: ItemId,
        PortfolioLevel: PortfolioLevelNum,
        PortfolioStructureID: PortfolioStructureIDs,
        Item_x0020_Type: ChengedItemTitle,
      };
      // Added by Ranu
      // if (NewArrayBackup[0].Item_x0020_Type === 'Component') {
      //   postData.ComponentId = newItemBackUp.Portfolio_x0020_Type === "Component" ? { results: [ItemId] } : { results: [] };
      //   postData.ServicesId = newItemBackUp.Portfolio_x0020_Type === "Service" ? { results: [ItemId] } : { results: [] };
      // }


      await web.lists
        .getById(ContextValue.MasterTaskListID)
        .items.getById(checkedList[0].Id)
        .update(postData)
        .then(async (res: any) => {


          let checkUpdate: number = 1;
          let array: any = [...maidataBackup];
          let backupCheckedList: any = [];
          let latestCheckedList: any = [];
          checkedList.map((items: any) => {
            latestCheckedList.push({ ...items })
            backupCheckedList.push({ ...items })
          })

          latestCheckedList?.map((items: any) => {
            items.Parent = { Id: postData.ParentId, Title: ItemTitle }
            items.PortfolioLevel = postData.PortfolioLevel,
              items.PortfolioStructureID = postData.PortfolioStructureID,
              items.Item_x0020_Type = postData.Item_x0020_Type
            items.TaskID = postData.PortfolioStructureID,
              items.SiteIconTitle = siteIcon
          })

          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && checkUpdate != 3) {
              obj.childs.push(...latestCheckedList);
              obj.subRows.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate != 3) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj.subRows != undefined && obj.subRows.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && checkUpdate != 3) {
                  sub.childs.push(...latestCheckedList);
                  sub.subRows.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);
                  array[index]?.childs.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && checkUpdate != 3) {
                      newsub.childs.push(...latestCheckedList);
                      newsub.subRows.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                      array[index]?.childs[indexsub]?.childs.splice(lastIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }
                  })
                }
              })
            }

          })

          setmaidataBackup(array);
          setComponentRestruct(false);
          setTopCompoIcon(false)
          setRestructureChecked([]);
          setNewArrayBackup([]);
          setOldArrayBackup([]);
          setRowSelection({});
          RestruringCloseCall();
          setCheckedList([]);
          AllDataRender = AllDataRender?.concat(array);
          Renderarray = [];
          Renderarray = Renderarray.concat(AllDataRender);
          refreshDataTaskLable();



        });
    }
  };








  const onRenderCustomHeaderMain1 = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div
          style={{
            marginRight: "auto",
            fontSize: "20px",
            fontWeight: "600",
            marginLeft: "20px",
          }}
        >
          <span>{`Create Component `}</span>
        </div>
        <Tooltip ComponentId={checkedList[0]?.Id} />
      </div>
    );
  };
  const onRenderCustomHeaderMain = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div
          style={{
            marginRight: "auto",
            fontSize: "20px",
            fontWeight: "600",
            marginLeft: "20px",
          }}
        >
          <span>{`Create ${checkedList[0]?.Portfolio_x0020_Type} item in ${checkedList[0]?.PortfolioStructureID}  ${checkedList[0]?.Title}`}</span>
        </div>
        <Tooltip ComponentId={checkedList[0]?.Id} />
      </div>
    );
  };

  ///react table start function//////
  /////////////////////Table Column Start///////////////////////////////
  const columns = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        size: 35,
        id: 'Id',
        header: ({ table }: any) => (
          <>
            <button
              className="border-0 bg-Ff"
              {...{
                onClick: table.getToggleAllRowsExpandedHandler(),
              }}
            >
              {table.getIsAllRowsExpanded() ? (
                <FaChevronDown />) : (<FaChevronRight />)}
            </button>
          </>
        ),
        cell: ({ row, getValue }) => (
          <div className="d-flex">
            <>
              {row.getCanExpand() ? (
                <span
                  className="border-0"
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              ) : (
                ""
              )}
              {getValue()}
            </>
          </div>
        ),
      },


      {
        header: ({ table }: any) => (
          <>
            <IndeterminateCheckbox className="mx-1 "
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </>
        ),
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">
              {row?.original?.Title != "Others" ? (
                <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />
              ) : (
                ""
              )}
              <span style={{ width: '18px' }}>
                {((row.getCanExpand() &&
                  row.subRows?.length !== row.original.subRows?.length) ||
                  !row.getCanExpand() ||
                  forceExpanded.includes(row.id)) &&
                  row.original.subRows?.length ? (
                  <span className="mx-1"
                    {...{
                      onClick: () => {
                        if (!forceExpanded.includes(row.id)) {
                          const coreIds = table.getCoreRowModel().rowsById;
                          row.subRows = coreIds[row.id].subRows;
                          const rowModel = table.getRowModel();
                          const updateRowModelRecursively = (item: any) => {
                            item.subRows?.forEach((elem: any) => {
                              if (!rowModel.rowsById[elem.id]) {
                                rowModel.flatRows.push(elem);
                                rowModel.rowsById[elem.id] = elem;
                              }
                              elem?.subRows?.length &&
                                updateRowModelRecursively(elem);
                            });
                          }
                          updateRowModelRecursively(row);
                          const temp = Object.keys(coreIds).filter(
                            (item: any) =>
                              item === row.id ||
                              item.startsWith(row.id + ".")
                          );
                          forceExpanded = [...forceExpanded, ...temp];
                          setExpanded((prev: any) => ({
                            ...prev,
                            [row.id]: true,
                          }));
                        } else {
                          row.getToggleExpandedHandler()();
                        }
                      },
                      style: { cursor: "pointer" },
                    }}
                  >
                    {!row.getCanExpand() ||
                      (row.getCanExpand() &&
                        row.subRows?.length !== row.original.subRows?.length)
                      ? <FaPlus style={{ fontSize: '10px' }} />
                      : row.getIsExpanded()
                        ? <FaMinus style={{ fontSize: '11px' }} />
                        : <FaPlus style={{ fontSize: '10px' }} />}
                  </span>
                ) : (
                  ""
                )}
              </span>
              {row?.original?.SiteIcon != undefined ? (
                <a className="hreflink" title="Show All Child" data-toggle="modal" >
                  <img className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 icon-sites-img ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 icon-sites-img ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 icon-sites-img ml20 me-1" :
                    row?.original?.TaskType?.Title == "Workstream" ? "ml-48 icon-sites-img ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 icon-sites-img ml20 me-1" : "icon-sites-img ml20 me-1"
                  }
                    src={row?.original?.SiteIcon}>
                  </img>
                </a>
              ) : (
                <>
                  {row?.original?.Title != "Others" ? (
                    <div className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                      row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                    }>
                      {row?.original?.SiteIconTitle}
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
              {getValue()}
            </span>
          </>
        ),
        accessorKey: "",
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 145,
      },
      {
        accessorFn: (row) => row?.TaskID,
        cell: ({ row, getValue }) => (
          <>
            <ReactPopperTooltip ShareWebId={getValue()} row={row} AllListId={ContextValue}/>
          </>
        ),
        id: "TaskID",
        placeholder: "ID",
        header: "",
        size: 130,
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
              <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : globalFilterHighlited} />
              </a>
            )}
            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
              <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" onClick={(e) => EditData(e, row?.original)}
                href={ContextValue.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType} >
                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : globalFilterHighlited} />
              </a>
            )}
            {row?.original.Title === "Others" ? (
              <span>{row?.original.Title}</span>
            ) : (
              ""
            )}
            {row?.original?.Categories == 'Draft' ?
              <FaCompressArrowsAlt style={{ height: '11px', width: '20px' }} /> : ''}
            {row?.original?.subRows?.length > 0 ?
              <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
            {/* {<span className='ms-1'>{'(' + row?.original?.ChlidLenghtVal + ')'}</span> : ''} */}

            {row?.original?.Short_x0020_Description_x0020_On != null && (
              // <span className="popover__wrapper ms-1" data-bs-toggle="tooltip" data-bs-placement="auto" >
              //   <span
              //     title="Edit"
              //     className="svg__iconbox svg__icon--info"
              //   ></span>
              //   <span
              //     className="popover__content"
              //     dangerouslySetInnerHTML={{
              //       __html: row?.original?.Short_x0020_Description_x0020_On,
              //     }}
              //   ></span>
              // </span>
              <InfoIconsToolTip Discription={row?.original?.Short_x0020_Description_x0020_On} row={row?.original} />
            )}
          </>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        header: "",
      },
      {
        accessorFn: (row) => row?.ClientCategorySearch,
        cell: ({ row }) => (
          <>
            <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
          </>
        ),
        id: "ClientCategorySearch",
        placeholder: "Client Category",
        header: "",
        resetColumnFilters: false,
        size: 100,
      },
      {
        accessorFn: (row) => row?.AllTeamName,
        cell: ({ row }) => (
          <div>
            <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllUsers} Context={SelectedProp?.SelectedProp} />
          </div>
        ),
        id: "AllTeamName",
        placeholder: "Team",
        resetColumnFilters: false,
        header: "",
        size: 131,
      },
      {
        accessorKey: "PercentComplete",
        placeholder: "Status",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: 'PercentComplete',
      },
      {
        accessorKey: "ItemRank",
        placeholder: "Item Rank",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: 'ItemRank',
      },
      {
        accessorKey: "DueDate",
        placeholder: "Due Date",
        header: "",
        resetColumnFilters: false,
        size: 100,
        id: 'DueDate',
      },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.siteType != "Master Tasks" && (
              <a
                onClick={(e) => EditDataTimeEntryData(e, row.original)}
                data-bs-toggle="tooltip"
                data-bs-placement="auto"
                title="Click To Edit Timesheet"
              >
                <span
                  className="svg__iconbox svg__icon--clock"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Click To Edit Timesheet"
                ></span>
              </a>
            )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 1,
      },
      {
        header: ({ table }: any) => (
          <>
            {
              componentRestruct ?
                <span onClick={() => setTopCompoIcon(true)}>
                  {
                    checkedList[0].Portfolio_x0020_Type === "Service" && checkedList[0].Item_x0020_Type !== "Task" ?
                      <img className="icon-sites-img" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png" /> :
                      (checkedList[0].Services.length > 0 && checkedList[0].TaskType?.Title === "Task" && checkedList[0].TaskType?.Title === "Workstream" ?
                        <img className="icon-sites-img" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png" /> :
                        (checkedList[0].TaskType?.Title !== "Activities" ? <img className="icon-sites-img" src='https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png' /> : "")
                      )
                  }
                </span>
                : <span></span>

            }

          </>
        ),
        cell: ({ row, getValue }) => (
          <>
            {
              row?.original?.Title !== "Others" &&
              row?.original?.isRestructureActive && (
                <a
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title="Edit"
                >
                  <img
                    className="icon-sites-img"
                    src={row?.original?.Restructuring}
                    onClick={(e) => OpenModal(row?.original)}
                  />
                </a>
              )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 1,
      },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.siteType === "Master Tasks" &&
              row?.original?.Title !== "Others" && (
                <a
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title="Edit"
                >

                  <span
                    title="Edit"
                    className="svg__iconbox svg__icon--edit"
                    onClick={(e) => EditComponentPopup(row?.original)}
                  ></span>
                </a>
              )}
            {row?.original?.siteType != "Master Tasks" &&
              row?.original?.Title !== "Others" && (
                <a
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title="Edit"
                >

                  <span
                    title="Edit"
                    className="svg__iconbox svg__icon--edit"
                    onClick={(e) => EditItemTaskPopup(row?.original)}
                  ></span>
                </a>
              )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 30,
      },
    ],
    [data]
  );

  /////////////////////Table Column End///////////////////////////////
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnFilters,
      globalFilter,
      expanded,
      sorting,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    filterFromLeafRows: true,
    enableSubRowSelection: false,
  });

  console.log(".........", table.getSelectedRowModel().flatRows);
  React.useEffect(() => {
    CheckDataPrepre();
  }, [table?.getSelectedRowModel()?.flatRows.length]);

  const CheckDataPrepre = () => {
    let itrm: any;
    let parentData: any;
    let parentDataCopy: any;
    if (table?.getSelectedRowModel()?.flatRows.length > 0) {
      table?.getSelectedRowModel()?.flatRows?.map((elem: any) => {
        if (elem?.getParentRows() != undefined) {
          // parentData = elem?.parentRow;
          // parentDataCopy = elem?.parentRow?.original
          parentDataCopy = elem?.getParentRows()[0]?.original;
          // if (parentData != undefined && parentData?.parentRow != undefined) {

          //   parentData = elem?.parentRow?.parentRow
          //   parentDataCopy = elem?.parentRow?.parentRow?.original

          //   if (parentData != undefined && parentData?.parentRow != undefined) {

          //     parentData = elem?.parentRow?.parentRow?.parentRow
          //     parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.original
          //   }
          //   if (parentData != undefined && parentData?.parentRow != undefined) {

          //     parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow
          //     parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.original
          //   }
          //   if (parentData != undefined && parentData?.parentRow != undefined) {

          //     parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow
          //     parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.original
          //   }
          //   if (parentData != undefined && parentData?.parentRow != undefined) {
          //     parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow
          //     parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.original
          //   }
          // }
        }
        elem.original.Id = elem.original.ID;
        itrm = elem.original;
        if (elem?.getCanSelect() == true) {
          if (itrm.TaskType == undefined) {
            setActivityDisable(false);
            itrm["siteUrl"] = ContextValue?.siteUrl;
            itrm["listName"] = "Master Tasks";
          }
          if (itrm.TaskType != undefined) {
            if (
              itrm?.TaskType?.Title == "Activities" || itrm.TaskType.Title == "Workstream") {
              setActivityDisable(false);
              itrm["siteUrl"] = ContextValue?.siteUrl;
              itrm["PortfolioId"] = parentDataCopy.Id ? parentDataCopy?.Id : 'parent';
            }
          }
          // if (itrm?.TaskType != undefined) {
          //   if (itrm?.TaskType?.Title == "Task") {
          //     setActivityDisable(true);
          //   }
          // }
        }
        if (elem?.getCanSelect() === true) {
          setcheckData(table?.getSelectedRowModel()?.flatRows)
          setShowTeamMemberOnCheck(true)
        }
        setCheckedList([itrm])
      });
    } else {
      maidataBackup?.forEach((obj, index) => {
        setComponentRestruct(false);
        obj.isRestructureActive = false;
        if (obj.childs != undefined && obj?.childs?.length > 0) {
          obj?.childs?.forEach((sub: any, indexsub: any) => {
            sub.isRestructureActive = false;
            setComponentRestruct(false);
            if (sub.childs != undefined && sub.childs.length > 0) {
              sub?.childs?.forEach((newsub: any, lastIndex: any) => {
                newsub.isRestructureActive = false;
                setComponentRestruct(false);
                if (newsub.childs != undefined && newsub.childs.length > 0) {
                  newsub?.childs?.forEach((activity: any, lastIndex: any) => {
                    activity.isRestructureActive = false;
                    setComponentRestruct(false);
                    if (activity.childs != undefined && activity.childs.length > 0) {
                      activity?.childs?.forEach((wrkstrm: any, lastIndex: any) => {
                        wrkstrm.isRestructureActive = false;
                        setComponentRestruct(false);
                        if (wrkstrm.childs != undefined && wrkstrm.childs.length > 0) {
                          wrkstrm?.childs?.forEach((task: any, lastIndex: any) => {
                            task.isRestructureActive = false;
                            setComponentRestruct(false);
                          })
                        }
                      })
                    }
                  })
                }
              });
            }
          });
        }
      });
      setcheckData([])
      setCheckedList([]);
      setShowTeamMemberOnCheck(false)
      setComponentRestruct(false);
      // Renderarray = [...maidataBackup];
      refreshDataTaskLable();
      setRowSelection({});
      setRestructureChecked([]);
      setNewArrayBackup([]);
      setOldArrayBackup([]);
      RestruringCloseCall();
    }
  };

  const openTaskAndPortfolioMulti = () => {
    checkData?.map((item: any) => {
      if (item?.original?.siteType === "Master Tasks") {
        window.open(`${ContextValue?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${item?.original?.Id}`, '_blank')
      } else {
        window.open(`${ContextValue?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.original?.Id}&Site=${item?.original?.siteType}`, '_blank')
      }
    })
  }
  function extractValueShareWebTaskId(str: any) {
    const regex = /T(\d+)/;
    const match = str.match(regex);

    if (match && match[0]) {
      return match[0];
    }

    return '';
  }


  React.useEffect(() => {
    FindAWTDataCount();
    taskTypes();
  }, [data])
  const FindAWTDataCount = () => {
    data?.map((Com) => {
      Com.toolTitle = Com.Title;
      Com.toolSharewebId = Com.PortfolioStructureID;
      Com?.subRows?.map((Sub: any) => {

        if (Sub?.Item_x0020_Type == "SubComponent") {
          Sub.toolTitle = Com.Title + ' > ' + Sub.Title;
          Sub.toolSharewebId = Sub.PortfolioStructureID;
        }
        if (Sub?.Item_x0020_Type == "Feature") {
          Sub.toolTitle = Com.Title + ' > ' + Sub.Title;
          Sub.toolSharewebId = Sub.PortfolioStructureID;
        }
        if (Sub?.TaskType?.Title === "Activities") {
          Sub.toolTitle = Com.Title + ' > ' + Sub.Title;
          Sub.toolSharewebId = Sub.ShowTooltipSharewebId;
          activity = activity + 1;
        }
        if (Sub?.TaskType?.Title == "Workstream") {
          Sub.toolTitle = Com.Title + ' > ' + Sub.Title;
          // Sub.toolSharewebId = Sub.PortfolioStructureID;
          Sub.toolSharewebId = Com.PortfolioStructureID + '-' + Sub?.TaskID;
          workstrim = workstrim + 1;
        }
        if (Sub?.TaskType?.Title == "Task") {
          Sub.toolTitle = Com.Title + ' > ' + Sub.Title;
          Sub.toolSharewebId = Com.PortfolioStructureID + '-' + Sub?.TaskID;
          task = task + 1;
        }

        Sub?.subRows?.map((feat: any) => {
          if (feat?.Item_x0020_Type == "SubComponent") {
            feat.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title;
            feat.toolSharewebId = feat.PortfolioStructureID;
          }
          if (feat?.Item_x0020_Type == "Feature") {
            feat.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title;
            feat.toolSharewebId = feat.PortfolioStructureID;
          }
          if (feat?.TaskType?.Title == "Activities") {
            feat.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title;
            feat.toolSharewebId = feat.ShowTooltipSharewebId;
            activity = activity + 1;
          }
          if (feat?.TaskType?.Title == "Workstream") {
            feat.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title;
            feat.toolSharewebId = Sub.toolSharewebId + '-' + feat?.TaskID?.slice(-2);
            workstrim = workstrim + 1;
          }
          if (feat?.TaskType?.Title == "Task") {
            feat.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title;
            feat.toolSharewebId = Sub.toolSharewebId + '-' + extractValueShareWebTaskId(feat?.TaskID);
            task = task + 1;
          }
          feat?.subRows?.map((acti: any) => {
            if (Sub?.Item_x0020_Type == "SubComponent") {
              acti.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title;
              acti.toolSharewebId = acti.PortfolioStructureID;

            }
            if (Sub?.Item_x0020_Type == "Feature") {
              acti.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title;
              acti.toolSharewebId = acti.PortfolioStructureID;

            }
            if (acti?.TaskType?.Title == "Activities") {
              acti.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title;
              acti.toolSharewebId = acti.ShowTooltipSharewebId;
              activity = activity + 1;
            }
            if (acti?.TaskType?.Title == "Workstream") {
              acti.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title;
              acti.toolSharewebId = feat.toolSharewebId + '-' + acti?.TaskID?.slice(-2);
              workstrim = workstrim + 1;
            }
            if (acti?.TaskType?.Title == "Task") {
              acti.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title;
              acti.toolSharewebId = feat.toolSharewebId + '-' + extractValueShareWebTaskId(acti?.TaskID)
              task = task + 1;
            }
            acti?.subRows?.map((works: any) => {
              if (Sub?.Item_x0020_Type == "SubComponent") {
                works.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title;
                works.toolSharewebId = works.PortfolioStructureID;
              }
              if (Sub?.Item_x0020_Type == "Feature") {
                works.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title;
                works.toolSharewebId = works.PortfolioStructureID;
              }
              if (works?.TaskType?.Title == "Activities") {
                works.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title;
                works.toolSharewebId = works.ShowTooltipSharewebId;
                activity = activity + 1;
              }
              if (works?.TaskType?.Title == "Workstream") {
                works.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title;
                works.toolSharewebId = acti.toolSharewebId + '-' + works?.TaskID?.slice(-2);
                workstrim = workstrim + 1;
              }
              if (works?.TaskType?.Title == "Task") {
                works.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title;
                works.toolSharewebId = acti.toolSharewebId + '-' + works?.TaskID;
                task = task + 1;
              }
              works?.subRows?.map((taskss: any) => {
                if (Sub?.Item_x0020_Type == "SubComponent") {
                  taskss.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title + ' > ' + taskss.Title;
                  taskss.toolSharewebId = taskss.PortfolioStructureID
                }
                if (Sub?.Item_x0020_Type == "Feature") {
                  taskss.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title + ' > ' + taskss.Title;
                  taskss.toolSharewebId = taskss.PortfolioStructureID
                }
                if (taskss?.TaskType?.Title == "Activities") {
                  taskss.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title + ' > ' + taskss.Title;
                  taskss.toolSharewebId = taskss.ShowTooltipSharewebId;
                  activity = activity + 1;
                }
                if (taskss?.TaskType?.Title == "Workstream") {
                  taskss.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title + ' > ' + taskss.Title;
                  taskss.toolSharewebId = works.toolSharewebId + '-' + taskss?.TaskID?.slice(-2);
                  workstrim = workstrim + 1;
                }
                if (taskss?.TaskType?.Title == "Task") {
                  taskss.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title + ' > ' + taskss.Title;
                  taskss.toolSharewebId = works.toolSharewebId + '-' + extractValueShareWebTaskId(taskss?.TaskID);
                  task = task + 1;
                }
              });
            });
          });
        });
      });
    });
  }

  let AfterSearch = table?.getRowModel()?.rows;
  let ComponentCopy = 0;
  let SubComponentCopy = 0;
  let FeatureCopy = 0;
  let FilterShowhideShwingData: any = false;
  let activityCopy = 0;
  let workstrimCopy = 0;
  let taskCopy = 0;
  if (AfterSearch != undefined && AfterSearch.length > 0) {
    AfterSearch?.map((Comp: any) => {
      if (
        Comp.columnFilters.Title == true ||
        Comp.columnFilters.TaskID == true ||
        Comp.columnFilters.ClientCategory == true ||
        Comp.columnFilters.TeamLeaderUser == true ||
        Comp.columnFilters.PercentComplete == true ||
        Comp.columnFilters.ItemRank == true ||
        Comp.columnFilters.DueDate == true
      ) {
        FilterShowhideShwingData = true;
      }
      else if (Comp?.columnFilters?.__global__ === true) {
        FilterShowhideShwingData = true;
      }
      if (Comp.original != undefined) {
        if (Comp?.original?.Item_x0020_Type == "Component") {
          ComponentCopy = ComponentCopy + 1;
        }
        if (Comp?.original?.Item_x0020_Type == "SubComponent") {
          SubComponentCopy = SubComponentCopy + 1;
        }
        if (Comp?.original?.Item_x0020_Type == "Feature") {
          FeatureCopy = FeatureCopy + 1;
        }
        if (Comp?.original?.TaskType?.Title == "Activities") {
          activityCopy = activityCopy + 1;
        }
        if (Comp?.original?.TaskType?.Title == "Workstream") {
          workstrimCopy = workstrimCopy + 1;
        }
        if (Comp?.original?.TaskType?.Title == "Task") {
          taskCopy = taskCopy + 1;
        }
      }
    });
  }



  React.useEffect(() => {
    if (table.getState().columnFilters.length || table.getState()?.globalFilter?.length > 0) {
      const allKeys = Object.keys(table.getFilteredRowModel().rowsById).reduce(
        (acc: any, cur: any) => {
          if (table.getFilteredRowModel().rowsById[cur].subRows?.length) {
            acc[cur] = true;
          }
          return acc;
        },
        {}
      );
      setExpanded(allKeys);
    } else {
      setExpanded({});
    }
    forceExpanded = [];
  }, [table.getState().columnFilters, table.getState().globalFilter]);

  const ShowTeamFunc = () => {
    setShowTeamPopup(true)
  }

  const showTaskTeamCAllBack = React.useCallback(() => {
    setShowTeamPopup(false)
    setRowSelection({});
  }, []);

  // Export To Excel////////

  const exportToExcel = () => {
    const flattenedData: any[] = [];
    const flattenRowData = (row: any) => {
      const flattenedRow: any = {};
      columns.forEach((column: any) => {
        if (column.placeholder != undefined && column.placeholder != '') {
          flattenedRow[column.id] = row.original[column.id];
        }
      });
      flattenedData.push(flattenedRow);
      if (row.getCanExpand()) {
        row.subRows.forEach(flattenRowData);
      }
    };
    table.getRowModel().rows.forEach(flattenRowData);
    const worksheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_json(worksheet, flattenedData, {
      skipHeader: false,
      origin: "A1",
    });
    const maxLength = 32767;
    const sheetRange = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = sheetRange.s.r; R <= sheetRange.e.r; ++R) {
      for (let C = sheetRange.s.c; C <= sheetRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (cell && cell.t === "s" && cell.v.length > maxLength) {
          const chunks = [];
          let text = cell.v;
          while (text.length > maxLength) {
            chunks.push(text.slice(0, maxLength));
            text = text.slice(maxLength);
          }
          chunks.push(text);
          cell.v = chunks.shift();
          chunks.forEach((chunk) => {
            const newCellAddress = XLSX.utils.encode_cell({
              r: R + chunks.length,
              c: C,
            });
            worksheet[newCellAddress] = { t: "s", v: chunk };
          });
        }
      }
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (typeof saveAs === "function") {
      saveAs(excelData, "table.xlsx");
    } else {
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(excelData);
      downloadLink.download = "table.xlsx";
      downloadLink.click();
    }
  };

  ////Export to excel end/////




  return (
    <div id="ExandTableIds" className={
      IsUpdated == "Events Portfolio"
        ? "app component clearfix eventpannelorange"
        : IsUpdated == "Service Portfolio"
          ? "app component clearfix serviepannelgreena"
          : "app component clearfix eventpanneblue"
    }
    >
      <section className="ContentSection">
        <div className="col-sm-12 clearfix">
          <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active">
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("service") > -1 && (
                <div>Service Portfolio</div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("service") > -1 && (
                <div className="text-end fs-6">
                  <a
                    data-interception="off"
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Service-Portfolio-Old.aspx"
                    }
                  >
                    Old Service Portfolio
                  </a>
                </div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("event") > -1 && (
                <div>Event Portfolio</div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("event") > -1 && (
                <div className="text-end fs-6">
                  <a
                    data-interception="off"
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Event-Portfolio-Old.aspx"
                    }
                  >
                    Old Event Portfolio
                  </a>
                </div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("component") > -1 && (
                <div>Component Portfolio</div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("component") > -1 && (
                <div className="text-end fs-6">
                  {(IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1) && <div className='text-end fs-6'>
                    {(ContextValue?.siteUrl?.toLowerCase().indexOf('ksl') > -1 || ContextValue?.siteUrl?.toLowerCase().indexOf('gmbh') > -1) ? (
                      <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Team-Portfolio-Old.aspx"} >Old Team Portfolio</a>
                    ) : <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Component-Portfolio-Old.aspx"} >Old Component Portfolio</a>
                    } </div>}
                </div>
              )}
          </h2>
        </div>
        <div className="bg-wihite border p-2">
          <div className="togglebox">
            <label className="toggler full_width mb-10">
              <span
                className=" siteColor"
                onClick={() =>
                  setIsSmartfilter(IsSmartfilter === true ? false : true)
                }
              >
                {/* <img className="hreflink wid22"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Filter-12-WF.png" /> */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="currentColor">
                                    <path d="M36 11H11V15.0625L20.6774 23.1875V32.9375L27.129 37V23.1875L36 15.0625V11Z" stroke="#333333" stroke-width="0" />
                                </svg> */}
                {IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("service") > -1 && (
                    <img
                      className="hreflink wid22"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Filter-12-WF.png"
                    />
                  )}
                {IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("event") > -1 && (
                    <img
                      className="hreflink wid22"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Event_Icons/Filter-12-WF.png"
                    />
                  )}
                {IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("component") > -1 && (
                    <img
                      className="hreflink wid22"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Filter-12-WF.png"
                    />
                  )}
                SmartSearch – Filters
              </span>
              <span className="ml-20 siteColor">
                {ShowSelectdSmartfilter != undefined &&
                  ShowSelectdSmartfilter.length > 0 && (
                    <>
                      {ShowSelectdSmartfilter?.map(function (obj, index) {
                        return (
                          <>
                            {obj.Title}
                            <span className="font-normal">
                              {obj.selectTitle}
                            </span>
                            {index != ShowSelectdSmartfilter.length - 1 && (
                              <span> | </span>
                            )}
                          </>
                        );
                      })}
                    </>
                  )}
              </span>
              <span className="pull-right bg-color">
                {IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("service") > -1 && (
                    <span>

                      <img
                        className="icon-sites-img  wid22 ml5"
                        title="Share SmartFilters selection"
                        onClick={() =>
                          setIsSmartfilter(
                            IsSmartfilter === true ? false : true
                          )
                        }
                        src={
                          IsSmartfilter === true
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/newsub_icon.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Add-New.png"
                        }
                      />
                      <img
                        className="icon-sites-img  wid22 ml5"
                        title="Share SmartFilters selection"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Green.png"
                      />
                    </span>
                  )}
                {((IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("component") > -1) ||
                  (IsUpdated != undefined &&
                    IsUpdated.toLowerCase().indexOf("event") > -1)) && (
                    <span>
                      <img
                        className="icon-sites-img  wid22 ml5"
                        title="Share SmartFilters selection"
                        onClick={() =>
                          setIsSmartfilter(IsSmartfilter === true ? false : true)
                        }
                        src={
                          IsSmartfilter === true
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/newsub_icon.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New.png"
                        }
                      />
                      <img
                        className="icon-sites-img  wid22 ml5"
                        title="Share SmartFilters selection"
                        ng-click="GenerateUrl()"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Blue.png"
                      />
                    </span>
                  )}
              </span>
            </label>
            {IsSmartfilter ? (
              <div className="togglecontent mt-1">
                <table width="100%" className="indicator_search">
                  <tr>
                    {filterGroups?.map(function (item) {
                      return (
                        <>
                          <td valign="top">
                            <fieldset>
                              {item != "teamSites" && (
                                <legend>
                                  <span className="mparent">{item}</span>
                                </legend>
                              )}
                              {item == "teamSites" && (
                                <legend>
                                  <span className="mparent">Sites</span>
                                </legend>
                              )}
                            </fieldset>
                            {filterItems?.map(function (ItemType, index) {
                              return (
                                <>
                                  {ItemType.Group == item && (
                                    <div style={{ display: "block" }}>
                                      <>
                                        {ItemType.TaxType != "Status" && (
                                          <div className="align-items-center d-flex">
                                            <span
                                              className="hreflink me-1 GByicon"
                                              onClick={() =>
                                                handleOpen2(ItemType)
                                              }
                                            >
                                              {ItemType.childs.length > 0 && (
                                                <a title="Tap to expand the childs">
                                                  {ItemType.showItem ? (
                                                    <img
                                                      src={
                                                        ItemType.downArrowIcon
                                                      }
                                                    />
                                                  ) : (
                                                    <img
                                                      src={
                                                        ItemType.RightArrowIcon
                                                      }
                                                    />
                                                  )}
                                                </a>
                                              )}
                                            </span>
                                            <input
                                              className="form-check-input me-1"
                                              defaultChecked={
                                                ItemType.Selected == true
                                              }
                                              type="checkbox"
                                              value={ItemType.Title}
                                              onChange={(e) =>
                                                SingleLookDatatest(
                                                  e,
                                                  ItemType,
                                                  index
                                                )
                                              }
                                            />
                                            <label className="form-check-label">
                                              {ItemType.Title}
                                            </label>
                                          </div>
                                        )}
                                        {ItemType.TaxType == "Status" && (
                                          <div className="align-items-center d-flex">
                                            <input
                                              className="form-check-input me-1"
                                              defaultChecked={
                                                ItemType.Selected == true
                                              }
                                              type="checkbox"
                                              value={ItemType.Title}
                                              onChange={(e) =>
                                                SingleLookDatatest(
                                                  e,
                                                  ItemType,
                                                  index
                                                )
                                              }
                                            />
                                            <label className="form-check-label">
                                              {ItemType.Title}
                                            </label>
                                          </div>
                                        )}
                                        <ul
                                          id="id_{ItemType.Id}"
                                          className="m-0 ps-3 pe-2"
                                        >
                                          <span>
                                            {ItemType.show && (
                                              <>
                                                {ItemType?.childs?.map(function (
                                                  child1: any,
                                                  index: any
                                                ) {
                                                  return (
                                                    <>
                                                      <div className="align-items-center d-flex">
                                                        {child1.childs.length >
                                                          0 &&
                                                          !child1.expanded && (
                                                            <span className="hreflink me-1 GByicon">
                                                              <span className="svg__iconbox svg__icon--GroupDown"></span>
                                                            </span>
                                                          )}
                                                        {child1.childs.length >
                                                          0 &&
                                                          child1.expanded && (
                                                            <span className="hreflink me-1 GByicon">
                                                              <span className="svg__iconbox svg__icon--GroupRight "></span>
                                                            </span>
                                                          )}
                                                        <input
                                                          type="checkbox"
                                                          defaultChecked={
                                                            child1.Selected ==
                                                            true
                                                          }
                                                          className="form-check-input me-1"
                                                          onChange={(e) =>
                                                            SingleLookDatatest(
                                                              e,
                                                              child1,
                                                              index
                                                            )
                                                          }
                                                        />
                                                        <label className="form-check-label">
                                                          {child1.Title}
                                                        </label>
                                                        <ul
                                                          id="id_{{child1.Id}}"
                                                          style={{
                                                            display: "none",
                                                          }}
                                                          className="m-0 ps-3 pe-2"
                                                        >
                                                          {child1?.childs?.map(
                                                            function (
                                                              child2: any
                                                            ) {
                                                              <li>
                                                                <div className="align-items-center d-flex">
                                                                  <input
                                                                    className="form-check-input me-1"
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                      child1.Selected ==
                                                                      true
                                                                    }
                                                                    ng-model="child2.Selected"
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      SingleLookDatatest(
                                                                        e,
                                                                        child1,
                                                                        index
                                                                      )
                                                                    }
                                                                  />
                                                                  <label className="form-check-label">
                                                                    {
                                                                      child2.Title
                                                                    }
                                                                  </label>
                                                                </div>
                                                              </li>;
                                                            }
                                                          )}
                                                        </ul>
                                                      </div>
                                                    </>
                                                  );
                                                })}
                                              </>
                                            )}
                                          </span>
                                        </ul>
                                      </>
                                    </div>
                                  )}
                                </>
                              );
                            })}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                </table>
                <div className="text-end mt-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    title="Smart Filter"
                    onClick={() => Updateitem()}
                  >
                    Update Filters
                  </button>
                  <button
                    type="button"
                    className="btn btn-grey ms-2"
                    title="Clear All"
                    onClick={() => Clearitem()}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>

      <section
        className="TableContentSection taskprofilepagegreen"
        id={tablecontiner}
      >
        <div className="container-fluid">
          <section className="TableSection">
            <div className="container p-0">
              <div className="Alltable mt-2">
                <div className="tbl-headings bg-white">
                  <span className="leftsec">
                    <label>
                      Showing {ComponentCopy} of {AllCountItems?.AllComponentItems?.length > 1 ? AllCountItems?.AllComponentItems?.length - 1 : AllCountItems?.AllComponentItems?.length} Components
                    </label>
                    <label className="ms-1 me-1"> | </label>
                    {FilterShowhideShwingData === true ? (
                      <label>
                        {SubComponentCopy} of {AllCountItems?.AllSubComponentItems?.length} SubComponents </label>
                    ) : (
                      <label>
                        {AllCountItems?.AllSubComponentItems?.length} of {AllCountItems?.AllSubComponentItems?.length} SubComponents </label>
                    )}
                    <label className="ms-1 me-1"> | </label>
                    {FilterShowhideShwingData === true ? (
                      <label>  {FeatureCopy} of {AllCountItems?.AllFeaturesItems?.length} Features </label>
                    ) : (
                      <label>
                        {AllCountItems?.AllFeaturesItems?.length} of {AllCountItems?.AllFeaturesItems?.length} Features
                      </label>
                    )}
                    <span
                      className="popover__wrapper ms-1"
                      style={{ position: "unset" }}
                      data-bs-toggle="tooltip"
                      data-bs-placement="auto"
                    >
                      <FaInfoCircle />

                      <span
                        className="popover__content mt-3 m-3 mx-3"
                        style={{ zIndex: 100 }}
                      >
                        <label>
                          Showing {ComponentCopy} of  {AllCountItems?.AllComponentItems?.length > 1 ? AllCountItems?.AllComponentItems?.length - 1 : AllCountItems?.AllComponentItems?.length} Components </label>
                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label> {SubComponentCopy} of {AllCountItems?.AllSubComponentItems?.length} SubComponents </label>
                        ) : (
                          <label>
                            {AllCountItems?.AllSubComponentItems?.length} of  {AllCountItems?.AllSubComponentItems?.length} SubComponents </label>
                        )}
                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label> {FeatureCopy} of {AllCountItems?.AllFeaturesItems?.length} Features</label>
                        ) : (
                          <label> {AllCountItems?.AllFeaturesItems?.length} of {AllCountItems?.AllFeaturesItems?.length} Features</label>
                        )}

                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label> {activityCopy} of {activity} Activities </label>
                        ) : (
                          <label> {activity} of {activity} Activities</label>
                        )}
                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label> {workstrimCopy} of {workstrim} Workstreams </label>
                        ) : (
                          <label> {workstrim} of {workstrim} Workstreams </label>
                        )}
                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label> {taskCopy} of {task} Tasks </label>
                        ) : (
                          <label> {task} of {task} Tasks </label>
                        )}
                      </span>
                    </span>
                    <span>
                      <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        placeholder="Search All..." />
                    </span>
                    {/* <span>
                      <span>
                        <select className="" style={{ height: '30px' }} aria-label="Default select example" value={selectedSearchDuration} onChange={(e) => setSelectedSearchDuration((e.target.value))}>
                          <option selected>All Words</option>
                          <option value="1">Any Words</option>
                          <option value="2">Exact Phrase</option>
                        </select>
                      </span>
                    </span> */}

                  </span>
                  <span className="toolbox mx-auto">
                    {table?.getSelectedRowModel()?.flatRows?.length === 1 &&
                      table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != "Feature" &&
                      table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Activities" &&
                      table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Workstream" &&
                      table?.getSelectedRowModel()?.flatRows[0]?.original?.TaskType?.Title != "Task" ||
                      table?.getSelectedRowModel()?.flatRows?.length === 0 ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addModal}
                        title=" Add Structure"
                      >
                        Add Structure
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={true}
                        className="btn btn-primary"
                        onClick={addModal}
                        title=" Add Structure"
                      >
                        Add Structure
                      </button>
                    )}

                    {table?.getSelectedRowModel()?.flatRows.length === 1 ? <button
                      type="button" title="Add Activity-Task"
                      className="btn btn-primary"
                      onClick={() => openActivity()}
                      disabled={ActivityDisable}
                    >
                      Add Activity-Task
                    </button> : <button 
                      type="button" title="Add Activity-Task"
                      className="btn btn-primary"
                      onClick={() => openActivity()}
                      disabled={true}
                    >
                      Add Activity-Task
                    </button>}
                    {table?.getSelectedRowModel()?.flatRows?.length === 1 && table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != "Component" ||
                      table?.getSelectedRowModel()?.flatRows?.length === 1 && table?.getSelectedRowModel()?.flatRows[0]?.original?.subRows?.length === 0 ? <button
                        type="button" title="Restructure"
                        className="btn btn-primary"
                        onClick={buttonRestructuring}
                      >
                      Restructure
                    </button> : <button
                      type="button" title="Restructure"
                      disabled={true}
                      className="btn btn-primary"
                      onClick={buttonRestructuring}
                    >
                      Restructure
                    </button>}

                    {table?.getSelectedRowModel()?.flatRows?.length > 0 ? <span>
                      <a title="Web Icon" onClick={() => openTaskAndPortfolioMulti()} className="openWebIcon"><span className="svg__iconbox svg__icon--openWeb"></span></a>
                    </span> : <span><a  title="Web Icon" className="openWebIcon"><span className="svg__iconbox svg__icon--openWeb" style={{ backgroundColor: "gray" }}></span></a></span>}

                    {showTeamMemberOnCheck === true ? <span><a className="teamIcon" onClick={() => ShowTeamFunc()}><span title="Create Teams Group" className="svg__iconbox svg__icon--team teamIcon"></span></a>
                    </span> : <span><a className="teamIcon"><span title="Create Teams Group" style={{ backgroundColor: "gray" }} className="svg__iconbox svg__icon--team teamIcon"></span></a></span>}

                    <a title="Clear All" className="brush" onClick={() => { setGlobalFilter(''); setColumnFilters([]); }}>
                      <FaPaintBrush />
                    </a>

                    <a title="Print" onClick={Prints} className="Prints">
                      <FaPrint />
                    </a>

                    {/* <CSVLink className="excal" data={getCsvData()}>
                      <FaFileExcel />
                    </CSVLink> */}

                    <a title="Export To Excel" className='excal' onClick={() => exportToExcel()}><FaFileExcel /></a>

                    <a className="expand" title="Expand">
                      <ExpndTable prop={expndpopup} prop1={tablecontiner} />
                    </a>
                  </span>
                </div>

                <div className="col-sm-12 p-0 smart">
                  <div className="">
                    <div className="wrapper">
                      <table
                        className="SortingTable searchCrossIcon groupTable  table table-hover"
                        style={{ width: "100%" }}
                      >
                        <thead className="fixed-Header top-0">
                          {table?.getHeaderGroups()?.map((headerGroup) => (
                            <tr key={headerGroup?.id}>
                              {headerGroup?.headers?.map((header) => {
                                return (
                                  <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={header.id != 'Title' ? {
                                      width: header.column.columnDef.size + "px",
                                    } : {}}
                                  >
                                    {header.isPlaceholder ? null : (
                                      <div
                                        className="position-relative"
                                        style={{ display: "flex" }}
                                      >
                                        {flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                        {header.column.getCanFilter() ? (
                                          // <span>
                                          <Filter
                                            column={header.column}
                                            table={table}
                                            placeholder={
                                              header.column.columnDef
                                            }
                                          />
                                        ) : // </span>
                                          null}
                                        {header.column.getCanSort() ? (
                                          <div
                                            {...{
                                              className:
                                                header.column.getCanSort()
                                                  ? "cursor-pointer select-none shorticon"
                                                  : "",
                                              onClick:
                                                header.column.getToggleSortingHandler(),
                                            }}
                                          >
                                            {header.column.getIsSorted() ? (
                                              {
                                                asc: <FaSortDown />,
                                                desc: <FaSortUp />,
                                              }[
                                              header.column.getIsSorted() as string
                                              ] ?? null
                                            ) : (
                                              <FaSort />
                                            )}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    )}
                                  </th>
                                );
                              })}
                            </tr>
                          ))}
                        </thead>
                        <tbody>
                          <Loader loaded={loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1}
                            color={
                              IsUpdated == "Events Portfolio"
                                ? "#f98b36"
                                : IsUpdated == "Service Portfolio"
                                  ? "#228b22"
                                  : "#000069"
                            }
                            speed={2}
                            trail={60}
                            shadow={false}
                            hwaccel={false}
                            className="spinner"
                            zIndex={2e9}
                            top="28%"
                            left="50%"
                            scale={1.0}
                            loadedClassName="loadedContent"
                          />

                          {table?.getRowModel()?.rows?.map((row: any) => {
                            return (
                              <tr className={row?.original?.lableColor} key={row.id} >
                                {row.getVisibleCells().map((cell: any) => {
                                  return (
                                    <td className={row?.original?.boldRow} key={cell.id}>
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
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {ShowTeamPopup === true ? <ShowTeamMembers props={checkData} callBack={showTaskTeamCAllBack} TaskUsers={AllUsers} /> : ''}

      {IsTask && (
        <EditTaskPopup
          Items={SharewebTask}
          Call={Call}
          AllListId={SelectedProp?.SelectedProp}
          context={SelectedProp?.SelectedProp.Context}
        ></EditTaskPopup>
      )}
      {IsComponent && (
        <EditInstituton
          item={SharewebComponent}
          Calls={Call}
          showProgressBar={showProgressBar}
          SelectD={SelectedProp}
        >

        </EditInstituton>
      )}
      {IsTimeEntry && (
        <TimeEntryPopup
          props={SharewebTimeComponent}
          CallBackTimeEntry={TimeEntryCallBack}
          Context={SelectedProp?.SelectedProp.Context}
        ></TimeEntryPopup>
      )}
      {MeetingPopup && (
        <CreateActivity
          props={checkedList[0]}
          Call={Call}
          TaskUsers={AllUsers}
          AllClientCategory={AllClientCategory}
          LoadAllSiteTasks={LoadAllSiteTasks}
          SelectedProp={SelectedProp}
        ></CreateActivity>
      )}
      {WSPopup && (
        <CreateWS
          props={checkedList[0]}
          Call={Call}
          TaskUsers={AllUsers}
          AllClientCategory={AllClientCategory}
          data={data}
          SelectedProp={SelectedProp}
        ></CreateWS>
      )}
      <Panel
        onRenderHeader={onRenderCustomHeaderMain1}
        type={PanelType.large}
        isOpen={addModalOpen}
        isBlocking={false}
        onDismiss={CloseCall}
      >
        <PortfolioStructureCreationCard
          CreatOpen={CreateOpenCall}
          Close={CloseCall}
          PortfolioType={IsUpdated}
          PropsValue={ContextValue}
          SelectedItem={
            checkedList != null && checkedList.length > 0
              ? checkedList[0]
              : props
          }
        />
      </Panel>

      <Panel
        onRenderHeader={onRenderCustomHeaderMain}
        type={PanelType.custom}
        customWidth="600px"
        isOpen={ActivityPopup}
        onDismiss={closeTaskStatusUpdatePoup2}
        isBlocking={false}
      >
        <div className="modal-body bg-f5f5 clearfix">
        <div
            className={
              checkedList[0]?.Portfolio_x0020_Type == "Events Portfolio"
                ? "app component clearfix eventpannelorange"
                : checkedList[0]?.Portfolio_x0020_Type == "Service"
                  ? "app component clearfix serviepannelgreena"
                  : "app component clearfix"
            }
          >
            <div id="portfolio" className=" pt-0">
              {checkedList[0]?.Portfolio_x0020_Type == "Service" ? (
                <ul className="quick-actions">

                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2 hreflink">
                    <div onClick={() => CreateMeetingPopups("Activities")}>
                      <span className="icon-sites"></span>
                      Activity
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2  hreflink">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites"></span>
                      Task
                    </div>
                  </li>
                </ul>
              ) : (
                <ul className="quick-actions">
                 <li className="d-grid w-100">
                  <ul className="d-flex justify-content-center p-0">
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2 hreflink">

                      <div onClick={() => CreateMeetingPopups("Activities")}>

                        <span className="icon-sites"></span>

                        Activity

                      </div>

                   </li>

                      <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2 hreflink">

                      <div onClick={() => CreateMeetingPopups("Task")}>

                        <span className="icon-sites"> </span>

                        Task

                      </div>

                      </li>
                  </ul>
                 </li>



                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2 hreflink">

                    <div onClick={() => CreateMeetingPopups("Activities")}>

                      <span className="icon-sites">

                        <img

                          className="icon-sites"

                          src=" https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png"

                        />

                      </span>

                      Development

                    </div>

                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2 hreflink">

                    <div onClick={() => CreateMeetingPopups("Improvement")}>

                      <span className="icon-sites"> <img

                        className="icon-sites"

                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png"

                      /></span>

                      Improvement

                    </div>

                  </li>

                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2 hreflink">

                    <div onClick={() => CreateMeetingPopups("Activities")}>

                      <span className="icon-sites"> <img

                        className="icon-sites"

                        src=" https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png"

                      /></span>

                      Implementation

                    </div>

                  </li>

                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2 hreflink">

                    <div onClick={() => CreateMeetingPopups("Bug")}>

                      <span className="icon-sites" > <img

                        className="icon-sites"

                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png"

                      /></span>

                      Feedback

                    </div>

                  </li>

                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2 hreflink">

                    <div onClick={() => CreateMeetingPopups("Feedback")}>

                      <span className="icon-sites"> <img

                        className="icon-sites"

                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png"

                      /></span>

                      Design

                    </div>

                  </li>



                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2 hreflink">

                    <div onClick={() => CreateMeetingPopups("Design")}>

                      <span className="icon-sites"> <img

                        className="icon-sites"

                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png"

                      /></span>

                      Bug

                    </div>

                  </li>



                </ul>

              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-default btn-default ms-1 pull-right"
            onClick={closeTaskStatusUpdatePoup2}
          >
            Cancel
          </button>
        </div>
      </Panel>



      {/* ------------------------------------------Start Restructuring From here----------------------------------------------------------------------------------------------------- */}



      <Panel

        type={PanelType.medium}
        isOpen={ResturuningOpen}
        isBlocking={false}
        onDismiss={RestruringCloseCall}
      >
        <div>


          {/* ----------------------------------------------------------top msg on popup--------------------------------------------------------------------------------------------- */}

          {ResturuningOpen ? (
            <div className="bg-ee p-2 restructurebox">

              {NewArrayBackup != undefined && NewArrayBackup.length > 0 && newItemBackUp.Item_x0020_Type != "Task" ? (
                <div className="d-flex flex-column"> <span>
                  All below selected items will become child of
                  <div className="Dyicons m-0 ms-1 me-1">
                    {NewArrayBackup[0].siteIcon}
                  </div>
                  <a
                    data-interception="off"
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Portfolio-Profile.aspx?taskId=" +
                      NewArrayBackup[0]?.Id
                    }
                  >
                    <span className="ms-1 me-1">{NewArrayBackup[0].Title}</span><span>{newItemBackUp?.Item_x0020_Type == "SubComponent" && RestructureChecked[0]?.Item_x0020_Type == "SubComponent" ||
                      RestructureChecked[0]?.Item_x0020_Type == "Component" || RestructureChecked[0]?.Item_x0020_Type == "Feature" ? "As a Feature" : ""}</span>
                  </a></span>
                  <span className="ms-1">please click Submit to continue.</span> </div>


              ) : (
                ""
              )}
              {
                newItemBackUp?.TaskType?.Title == "Activities" && newItemBackUp?.Item_x0020_Type == "Task" && (checkedList[0]?.TaskType?.Title == "Activities" || checkedList[0]?.TaskType?.Title == "Workstream" || checkedList[0]?.TaskType?.Title == "Task") ?
                  <div className="d-flex flex-column"> <span>
                    {
                      RestructureChecked[0]?.TaskType?.Title === "Activities"
                        && RestructureChecked[0]?.Item_x0020_Type === "Task" ? <span>All below selected items will be added as Workstream inside</span> :
                        <span>All below selected items will be added as <span className="me-1">{RestructureChecked[0]?.TaskType?.Title}</span>
                          inside </span>
                    }

                    <div className="Dyicons m-0 ms-1 me-1">
                      {NewArrayBackup[0]?.siteIcon}
                    </div>
                    <a
                      data-interception="off"
                      target="_blank"
                      className="hreflink serviceColor_Active"
                      href={
                        ContextValue.siteUrl +
                        "/SitePages/Portfolio-Profile.aspx?taskId=" +
                        NewArrayBackup[0]?.Id
                      }
                    >
                      <span className="ms-1 me-1">{NewArrayBackup[0]?.Title}</span><span>{newItemBackUp?.Item_x0020_Type == "SubComponent" && RestructureChecked[0]?.Item_x0020_Type == "SubComponent" ||
                        RestructureChecked[0]?.Item_x0020_Type == "Component" || RestructureChecked[0]?.Item_x0020_Type == "Feature" ? "As a Feature" : ""}</span>
                    </a></span>
                    <span className="ms-1">please click Submit to continue.</span> </div> : (

                    newItemBackUp?.TaskType?.Title == "Workstream" && checkedList[0]?.TaskType?.Title == "Activities" ?
                      <div className="d-flex flex-column"> <span>
                        All below selected items will be added as Task inside
                        <div className="Dyicons m-0 ms-1 me-1">
                          {NewArrayBackup[0]?.siteIcon}
                        </div>
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active"
                          href={
                            ContextValue.siteUrl +
                            "/SitePages/Portfolio-Profile.aspx?taskId=" +
                            NewArrayBackup[0]?.Id
                          }
                        >
                          <span className="ms-1 me-1">{NewArrayBackup[0]?.Title}</span><span>{newItemBackUp?.Item_x0020_Type == "SubComponent" && RestructureChecked[0]?.Item_x0020_Type == "SubComponent" ||
                            RestructureChecked[0]?.Item_x0020_Type == "Component" || RestructureChecked[0]?.Item_x0020_Type == "Feature" ? "As a Feature" : ""}</span>
                        </a></span>
                        <span className="ms-1">please click Submit to continue.</span> </div>

                      : " "
                  )
              }


              {/* -------------------------------------------------------old restructure hierarchy---------------------------------------------------------------------------------------- */}


              <div>
                <span> Old: </span>
                {OldArrayBackup?.map(function (obj: any, index) {
                  return (
                    <span>
                      <span className="Dyicons ">{obj.siteIcon}</span>
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          ContextValue.siteUrl +
                          "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          obj?.Id
                        }
                      >
                        <span>{obj?.Title} </span>
                      </a>
                      {/* {OldArrayBackup.length - 1 < index ? ">" : ""} */}
                      <span>{obj?.newChild ? <span> {'>'} <span >{obj?.newChild?.siteIcon === "S" || obj?.newChild?.siteIcon === "F" ? <span className="Dyicons ">{obj?.newChild?.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={obj?.newChild?.siteIcon} /></span>}</span> {obj?.newChild?.Title}</span> : ''}</span>
                      <span>{obj?.newChild?.newFchild ? <span> {'>'} <span >{obj?.newChild?.newFchild?.siteIcon === "F" ? <span className="Dyicons ">{obj?.newChild?.newFchild?.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.siteIcon} /></span>}</span> {obj?.newChild?.newFchild?.Title}</span> : ''}</span>
                      <span>{obj?.newChild?.newFchild?.newActChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.newActChild?.siteIcon} /></span> {obj?.newChild?.newFchild?.newActChild?.Title}</span> : ''}</span>
                      <span>{obj?.newChild?.newFchild?.newActChild?.newWrkChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.newActChild?.newWrkChild?.siteIcon} /> </span> {obj?.newChild?.newFchild?.newActChild?.newWrkChild?.Title}</span> : ''}</span>
                      <span>{obj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild ? <span> {'>'} <span className=""> <img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild?.siteIcon} /> </span> {obj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild?.Title}</span> : ''}</span>

                    </span>
                  );
                })}
              </div>


              {/*---------------------------------------------------- New Restructure hierarchy----------------------------------------------------------------------------- */}

              <div>
                <span> New: </span>
                {NewArrayBackup?.map(function (newobj: any, indexnew) {
                  return (
                    <>
                      <span>
                        <div className="Dyicons ">{newobj?.siteIcon}</div>
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active"
                          href={
                            ContextValue.siteUrl +
                            "/SitePages/Portfolio-Profile.aspx?taskId=" +
                            newobj.Id
                          }
                        >
                          <span>{newobj.Title} </span>
                        </a>
                        {/* {NewArrayBackup.length - 1 < indexnew ? ">" : ""} */}
                        <span>{newobj?.newChild ? <span> {'>'} <span >{newobj?.newChild?.siteIcon === "S" || newobj?.newChild?.siteIcon === "F" ? <span className="Dyicons ">{newobj?.newChild?.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={newobj?.newChild?.siteIcon} /></span>}</span> {newobj?.newChild?.Title}</span> : ''}</span>
                        <span>{newobj?.newChild?.newFchild ? <span> {'>'} <span >{newobj?.newChild?.newFchild?.siteIcon === "F" ? <span className="Dyicons ">{newobj?.newChild?.newFchild?.siteIcon}</span> : <span><img width={"25px"} height={"25px"} src={newobj?.newChild?.newFchild?.siteIcon} /></span>}</span> {newobj?.newChild?.newFchild?.Title}</span> : ''}</span>
                        <span>{newobj?.newChild?.newFchild?.newActChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={newobj?.newChild?.newFchild?.newActChild?.siteIcon} /> </span> {newobj?.newChild?.newFchild?.newActChild?.Title}</span> : ''}</span>
                        <span>{newobj?.newChild?.newFchild?.newActChild?.newWrkChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={newobj?.newChild?.newFchild?.newActChild?.newWrkChild?.siteIcon} /> </span> {newobj?.newChild?.newFchild?.newActChild?.newWrkChild?.Title}</span> : ''}</span>
                        <span>{newobj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={newobj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild?.siteIcon} /> </span> {newobj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild?.Title}</span> : ''}</span>
                      </span>
                    </>
                  );
                })}

                {
                  RestructureChecked?.map((items: any) =>
                    <span> {">"}
                      {
                        items?.Item_x0020_Type === "Component" ? <div className="Dyicons">
                          S
                        </div> : (items?.Item_x0020_Type === "Task" ? <span><img width={"25px"} height={"25px"} src={items?.siteIcon} /></span> : <div className="Dyicons">{items?.siteIcon}</div>)
                      }
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          ContextValue.siteUrl +
                          "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          items?.Id
                        }
                      >
                        <span className="ms-1 me-1" >{items?.Title} </span>
                      </a>
                    </span>
                  )
                }

              </div>



              {/* ---------------------------------------------------------------------------radio button for Subcomponnet and feature--------------------------------------------------------- */}

              {checkedList != undefined &&
                checkedList?.length > 0 &&
                checkedList[0]?.Item_x0020_Type != "Task" && (checkSubChilds?.childs[0]?.Item_x0020_Type !== "Feature") ? (
                <div>
                  {
                    newItemBackUp?.Item_x0020_Type == "SubComponent" ? " " :
                      <span>
                        <span>

                          {"Select Component Type :"}
                          <input
                            type="radio"
                            name="fav_language"
                            value="SubComponent"
                            checked={
                              RestructureChecked[0]?.Item_x0020_Type == "SubComponent"
                                ? true
                                : RestructureChecked[0]?.Item_x0020_Type == "Component" ? true : false
                            }
                            onChange={(e) =>
                              setRestructure(RestructureChecked, "SubComponent")
                            }
                          />
                          <label className="ms-1"> {"SubComponent"} </label>
                        </span>
                        <span>

                          <input
                            type="radio"
                            name="fav_language"
                            value="SubComponent"
                            checked={
                              RestructureChecked[0]?.Item_x0020_Type === "Feature"
                                ? true
                                : false
                            }
                            onChange={(e) =>
                              setRestructure(RestructureChecked, "Feature")
                            }
                          />
                          <label className="ms-1"> {"Feature"} </label>
                        </span>
                      </span>

                  }

                </div>
              ) : (
                ""
              )}


              {/* --------------------------------------------------radio button for workstream and task---------------------------------------------------------------------------- */}

              {
                checkedList != undefined &&
                  checkedList?.length > 0 &&
                  checkedList[0]?.Item_x0020_Type === "Task" &&
                  newItemBackUp?.TaskType?.Title == "Activities" && newItemBackUp?.Item_x0020_Type == "Task" &&
                  (checkedList[0]?.TaskType?.Title == "Activities" || checkedList[0]?.TaskType?.Title == "Workstream" || checkedList[0]?.TaskType?.Title == "Task") ?
                  <span>
                    <span>

                      {"Select Component Type :"}
                      <input
                        type="radio"
                        name="fav_language"
                        value="Workstream"
                        checked={
                          RestructureChecked[0]?.TaskType?.Title == "Workstream"
                            ? true
                            : (RestructureChecked[0]?.TaskType?.Title == "Activities" ? true : false)
                        }
                        onChange={(e) =>
                          setRestructure(RestructureChecked, "Workstream")
                        }
                      />
                      <label className="ms-1"> {"Workstream"} </label>
                    </span>
                    <span>

                      <input
                        type="radio"
                        name="fav_language"
                        value="SubComponent"
                        checked={
                          RestructureChecked[0]?.TaskType?.Title === "Task"
                            ? true
                            : false
                        }
                        onChange={(e) =>
                          setRestructure(RestructureChecked, "Task")
                        }
                      />
                      <label className="ms-1"> {"Task"} </label>
                    </span>
                  </span> : " "
              }


            </div>
          ) : (
            ""
          )}




        </div>
        {/* ------------------------------------------------------save and cancel buttons--------------------------------------------------------------------- */}
        <footer className="mt-2 text-end">
          {checkedList != undefined &&
            checkedList.length > 0 &&
            checkedList[0]?.Item_x0020_Type === "Task" ? (
            <button
              type="button"
              className="btn btn-primary "
              onClick={(e) => UpdateTaskRestructure()}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary "
              onClick={(e) => UpdateRestructure()}
            >
              Save
            </button>
          )}
          <button
            type="button"
            className="btn btn-default btn-default ms-1"
            onClick={RestruringCloseCall}
          >
            Cancel
          </button>
        </footer>
      </Panel>

      {/* ------------------------------------------------------Top component Popup----------------------------------------------------------------------------------------------- */}
      <span>
        <Panel
          isOpen={topCompoIcon}
          isBlocking={false}
          onDismiss={() => setTopCompoIcon(false)}
        >
          <div>
            {RestructureChecked?.map((item: any) => <span>
              {
                item?.Item_x0020_Type === 'SubComponent' && item?.TaskType == undefined ? <span>
                  {
                    restructuredItemarray != undefined && restructuredItemarray.length > 0 && restructuredItemarray?.map((obj: any) => <span>
                      {
                        obj?.childs?.length > 0 ? obj?.childs?.map((sub: any) => <span>{
                          sub?.childs?.length > 0 ? sub?.childs?.map((feat: any) => <span> {
                            sub.childs[0].Item_x0020_Type === 'Feature' && sub.childs?.length > 0 && sub?.Id == item?.Id ? <span>
                              After restructuring selected SubComponent becomes Component and Features stay Features under the new Component.
                            </span> : (
                              sub.Id == item.Id && (sub.childs?.length == 0 || sub.childs[0]?.Item_x0020_Type === 'Task') ? <div><span>All below selected items will be upgraded as Component please click Submit to continue.</span>
                                <span className="Dyicons">{sub?.SiteIconTitle}</span>   <span>{sub?.Title}</span>
                              </div> : ""
                            )
                          } </span>
                          ) : (
                            sub?.Id == item?.Id ? <div><span>All below selected items will be upgraded as Component please click Submit to continue.</span>
                              <span className="Dyicons">{sub?.SiteIconTitle}</span>   <span>{sub?.Title}</span>
                            </div> : ""
                          )

                        } </span>

                        ) : " "
                      }
                    </span>)
                  }
                </span> : (
                  item?.Item_x0020_Type === 'Feature' && item?.TaskType == undefined ? <span>
                    After restructuring selected Features becomes Component
                  </span> : (
                    item?.Item_x0020_Type === 'Task' && item?.TaskType?.Title == "Activities" ? <span>
                      <span>All below selected items will be upgraded as Activities please click Submit to continue.</span>
                      <span className=""><img width={"25px"} height={"25px"} src={item?.siteIcon} /></span>   <span>{item?.Title}</span>
                    </span> :
                      (item?.Item_x0020_Type === 'Task' && item?.TaskType?.Title == "Workstream" ? <span>
                        <span>All below selected items will be upgraded as Activities please click Submit to continue.</span>
                        <span className=""><img width={"25px"} height={"25px"} src={item?.siteIcon} /></span>   <span>{item?.Title}</span>
                      </span> :
                        (item?.Item_x0020_Type === 'Task' && item?.TaskType?.Title == "Task" ? <span>
                          <span>All below selected items will be upgraded as Activities please click Submit to continue.</span>
                          <span className=""><img width={"25px"} height={"25px"} src={item?.siteIcon} /></span>   <span>{item?.Title}</span>
                        </span> : ""))
                  )
                )
              }
            </span>)}
            <div className="mt-5 d-flex justify-content-end">
              <button className="me-2 btn border-primary" onClick={topRestructureClose}>Cancel</button>
              <button className="me-2 btn btn-primary" onClick={makeTopComp} >Save</button>
            </div>
          </div>
        </Panel>
        {/* --------------------------------------------------------Restructuring End---------------------------------------------------------------------------------------------------- */}
      </span>
    </div>
  );
}
export default ComponentTable;