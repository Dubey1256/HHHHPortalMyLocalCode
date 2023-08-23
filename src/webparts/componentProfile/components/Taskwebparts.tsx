import * as React from "react";
import * as $ from "jquery";
import * as Moment from "moment";
import { map } from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaChevronRight,
  FaChevronDown,
  FaSortDown,
  FaSortUp,
  FaSort,
  FaCompressArrowsAlt,
  FaSearch,
  FaPaintBrush,
} from "react-icons/fa";
import Tooltip from "../../../globalComponents/Tooltip";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import * as globalCommon from "../../../globalComponents/globalCommon";
import { GlobalConstants } from "../../../globalComponents/LocalCommon";
import pnp, { Web, SearchQuery, SearchResults, UrlException } from "sp-pnp-js";
import PortfolioStructureCreationCard from "../../../globalComponents/tableControls/PortfolioStructureCreation";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import ExpndTable from "../../../globalComponents/ExpandTable/Expandtable";
import { Panel, PanelType } from "office-ui-fabric-react";
import CreateActivity from "../../servicePortfolio/components/CreateActivity";
import CreateWS from "../../servicePortfolio/components/CreateWS";
import SelectedClientCategoryPupup1 from "../../../globalComponents/SelectedClientCategorypopup";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
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
  SortingState,
  ColumnFiltersState,
  getFacetedRowModel,
  getSortedRowModel,
  getFacetedUniqueValues,
  FilterFn
} from "@tanstack/react-table";
import HighlightableCell from '../../componentPortfolio/components/highlight'
import Loader from "react-loader";
import ShowTeamMembers from "../../../globalComponents/ShowTeamMember";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
// import HighlightableCell from "../../../globalComponents/highlight";
// import HighlightableCell from "../../componentPortfolio/components/highlight";


///TanstackTable filter And CheckBox 
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
      {/* <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    /> */}
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

function IndeterminateCheckbox(
  {
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


///Tanstack filter And Check Part End


var filt: any = "";
var siteConfig: any = [];
var IsUpdated: any = "";
let serachTitle: any = "";
var MeetingItems: any = [];
// let MeetingItemsParentcat:any=[];
var childsData: any = [];
var selectedCategory: any = [];
var AllItems: any = [];
let IsShowRestru: any = false;
let ChengedTitle: any = "";
let table: any = {};
let ParentDs: any;
let countaa = 0;
let Itemtypes: any;
let globalFilterHighlited: any;
let SmartMetaData: any = [];
// let selectedClientCategoryPopup:any=false;
let activity = 0;
let workstrim = 0;
let task = 0;
let AllActivitysData: any = [];
let AllWorkStreamData: any = [];
let TimesheetData:any=[];
export default function ComponentTable({ props, NextProp, Iconssc }: any) {
  if (countaa == 0) {
    ParentDs = props?.Id
    Itemtypes = props?.Item_x0020_Type
  }
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const rerender = React.useReducer(() => ({}), {})[1]
  const refreshData = () => setData(() => AllItems);
  const [loaded, setLoaded] = React.useState(true);
  const [color, setColor] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  globalFilterHighlited = globalFilter;
  const [showTeamMemberOnCheck, setShowTeamMemberOnCheck] = React.useState(false)
  const [checkCounter, setCheckCounter] = React.useState(true)
  const [checkData, setcheckData] = React.useState([])
  const [ShowTeamPopup, setShowTeamPopup] = React.useState(false);
  const [AllTasksData, setAllTasks] = React.useState([]);



  const [maidataBackup, setmaidataBackup] = React.useState([]);
  const [search, setSearch]: [string, (search: string) => void] =
    React.useState("");
  const [data, setData] = React.useState([]);
  const [Title, setTitle] = React.useState();
  const [ComponentsData, setComponentsData] = React.useState([]);
  const [SubComponentsData, setSubComponentsData] = React.useState([]);
  const [FeatureData, setFeatureData] = React.useState([]);
  // const [table, setTable] = React.useState(data);
  const [AllUsers, setTaskUser] = React.useState([]);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [filterGroups, setFilterGroups] = React.useState([]);
  const [filterItems, setfilterItems] = React.useState([]);
  const [AllMetadata, setMetadata] = React.useState([])
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [IsTask, setIsTask] = React.useState(false);
  const [SharewebTask, setSharewebTask] = React.useState("");
  const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  const [ShowSelectdSmartfilter, setShowSelectdSmartfilter] = React.useState(
    []
  );
  const [checked, setchecked] = React.useState([]);
  const [checkedList, setCheckedList] = React.useState([]);
  const [Isshow, setIsshow] = React.useState(false);
  const [tablecontiner, settablecontiner]: any = React.useState("hundred");
  const [MeetingPopup, setMeetingPopup] = React.useState(false);
  const [WSPopup, setWSPopup] = React.useState(false);
  const [ActivityPopup, setActivityPopup] = React.useState(false);
  const [ActivityDisable, setActivityDisable] = React.useState(false);
  const [OldArrayBackup, setOldArrayBackup] = React.useState([]);
  //  For selected client category
  const [items, setItems] = React.useState<any>([]);
  const [NewArrayBackup, setNewArrayBackup] = React.useState([]);
  const [ResturuningOpen, setResturuningOpen] = React.useState(false);
  const [RestructureChecked, setRestructureChecked] = React.useState([]);
  const [ChengedItemTitl, setChengedItemTitle] = React.useState("");
  const [componentRestruct, setComponentRestruct]: any = React.useState(false);
  const [newItemBackUp, setNewItemBackUp]: any = React.useState([]);
  const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
  const [taskTypeId, setTaskTypeId]: any = React.useState([]);

  const [comparetool, setcomparetool]: any = React.useState(false);
  // SmartTotalTime



  // Popover start 



  // Load TimeEntry Data
 
  // const GetTimeEntryData = async () => {
  //   let web = new Web(NextProp?.siteUrl);
  //   let Timesheet = [];
  //   Timesheet = await web.lists
  //     .getByTitle('TaskTimeSheetListNew')
  //     .items
  //     .select('Id,Title,TaskDate,TaskTime,AdditionalTimeEntry,Modified,Description,TaskOffshoreTasks/Id,TaskOffshoreTasks/Title,Author/Id,AuthorId,Author/Title,TaskKathaBeck/Id,TaskKathaBeck/Title,TaskDE/Title,TaskDE/Id,TaskEI/Title,TaskEI/Id,TaskEPS/Title,TaskEPS/Id,TaskEducation/Title,TaskEducation/Id,TaskHHHH/Title,TaskHHHH/Id,TaskQA/Title,TaskQA/Id,TaskGender/Title,TaskGender/Id,TaskShareweb/Title,TaskShareweb/Id,TaskGruene/Title,TaskGruene/Id')
  //     .expand('Author,TaskKathaBeck,TaskDE,TaskEI,TaskEPS,TaskEducation,TaskGender,TaskQA,TaskDE,TaskShareweb,TaskHHHH,TaskGruene,TaskOffshoreTasks')
  //     .getAll();
  //   let Timesheet2 = await web.lists
  //     .getByTitle('TasksTimesheet2')
  //     .items
  //     .select("Id,Title,TaskDate,AdditionalTimeEntry,Created,Modified,TaskTime,Modified,SortOrder,AdditionalTimeEntry,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title,TaskALAKDigital/Id,TaskALAKDigital/Title,TaskMigration/Id,TaskMigration/Title")
  //     .expand('Category,TimesheetTitle,TaskMigration,TaskALAKDigital')
  //     .top(4999)
  //     .getAll();
  //     TimesheetData= Timesheet.concat(Timesheet2);

  // }
// Calculate smarttime 
// function calculateTotalTimeForTask(Tasks:any) {
//   // Filter the data to find entries with matching TaskEI.Id
//   if(TimesheetData?.length != 0){
    
//     let tasktype = `Task${Tasks?.siteType}`;
    
//     let filtertaskdata = TimesheetData.filter((entry:any) => entry[tasktype]?.Id === Tasks?.Id);
//       // Calculate total time for matched entries
//   let totalTime = 0;
//   if(filtertaskdata?.length != 0){
    
//     filtertaskdata?.forEach((entry:any) => {
//     if(entry?.AdditionalTimeEntry != null){
      
//     const additionalTimeEntries = JSON.parse(entry.AdditionalTimeEntry);
//     const entryTotalTime = additionalTimeEntries.reduce(
//       (total:any, additionalEntry:any) => total + parseFloat(additionalEntry.TaskTime),
//       0
//     );
//     if(entryTotalTime > 0){
//       totalTime += entryTotalTime;
//  }
    
//   }
//   });
  
// }


//   return totalTime;
// }

// }





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


  const taskTypes = async () => {
    let web = new Web(NextProp.siteUrl);
    await web.lists.getById(NextProp.TaskTypeID)
      .items.
      select("Title", "Id", "Level").
      getAll().then((data: any) => {
        setTaskTypeId(data);
      }).catch((err: any) => {
        console.log(err);
      })
  }


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
        if (Sub?.SharewebTaskType?.Title === "Activities") {
          Sub.toolTitle = Com.Title + ' > ' + Sub.Title;
          Sub.toolSharewebId = Sub.ShowTooltipSharewebId;
          activity = activity + 1;
        }
        if (Sub?.SharewebTaskType?.Title == "Workstream") {
          Sub.toolTitle = Com.Title + ' > ' + Sub.Title;
          // Sub.toolSharewebId = Sub.PortfolioStructureID;
          Sub.toolSharewebId = Com.PortfolioStructureID + '-' + Sub?.Shareweb_x0020_ID;
          workstrim = workstrim + 1;
        }
        if (Sub?.SharewebTaskType?.Title == "Task") {
          Sub.toolTitle = Com.Title + ' > ' + Sub.Title;
          Sub.toolSharewebId = Com.PortfolioStructureID + '-' + Sub?.Shareweb_x0020_ID;
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
          if (feat?.SharewebTaskType?.Title == "Activities") {
            feat.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title;
            feat.toolSharewebId = feat.ShowTooltipSharewebId;
            activity = activity + 1;
          }
          if (feat?.SharewebTaskType?.Title == "Workstream") {
            feat.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title;
            feat.toolSharewebId = Sub.toolSharewebId + '-' + feat?.Shareweb_x0020_ID?.slice(-2);
            workstrim = workstrim + 1;
          }
          if (feat?.SharewebTaskType?.Title == "Task") {
            feat.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title;
            feat.toolSharewebId = Sub.toolSharewebId + '-' + extractValueShareWebTaskId(feat?.Shareweb_x0020_ID);
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
            if (acti?.SharewebTaskType?.Title == "Activities") {
              acti.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title;
              acti.toolSharewebId = acti.ShowTooltipSharewebId;
              activity = activity + 1;
            }
            if (acti?.SharewebTaskType?.Title == "Workstream") {
              acti.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title;
              acti.toolSharewebId = feat.toolSharewebId + '-' + acti?.Shareweb_x0020_ID?.slice(-2);
              workstrim = workstrim + 1;
            }
            if (acti?.SharewebTaskType?.Title == "Task") {
              acti.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title;
              acti.toolSharewebId = feat.toolSharewebId + '-' + extractValueShareWebTaskId(acti?.Shareweb_x0020_ID)
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
              if (works?.SharewebTaskType?.Title == "Activities") {
                works.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title;
                works.toolSharewebId = works.ShowTooltipSharewebId;
                activity = activity + 1;
              }
              if (works?.SharewebTaskType?.Title == "Workstream") {
                works.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title;
                works.toolSharewebId = acti.toolSharewebId + '-' + works?.Shareweb_x0020_ID?.slice(-2);
                workstrim = workstrim + 1;
              }
              if (works?.SharewebTaskType?.Title == "Task") {
                works.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title;
                works.toolSharewebId = acti.toolSharewebId + '-' + works?.Shareweb_x0020_ID;
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
                if (taskss?.SharewebTaskType?.Title == "Activities") {
                  taskss.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title + ' > ' + taskss.Title;
                  taskss.toolSharewebId = taskss.ShowTooltipSharewebId;
                  activity = activity + 1;
                }
                if (taskss?.SharewebTaskType?.Title == "Workstream") {
                  taskss.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title + ' > ' + taskss.Title;
                  taskss.toolSharewebId = works.toolSharewebId + '-' + taskss?.Shareweb_x0020_ID?.slice(-2);
                  workstrim = workstrim + 1;
                }
                if (taskss?.SharewebTaskType?.Title == "Task") {
                  taskss.toolTitle = Com.Title + ' > ' + Sub.Title + ' > ' + feat.Title + ' > ' + acti.Title + ' > ' + works.Title + ' > ' + taskss.Title;
                  taskss.toolSharewebId = works.toolSharewebId + '-' + extractValueShareWebTaskId(taskss?.Shareweb_x0020_ID);
                  task = task + 1;
                }
              });
            });
          });
        });
      });
    });
  }

  // Popover end 


  const SmartMetaDatas = async () => {
    var metadatItem: any = [];
    let smartmetaDetails: any = [];
    var select: any =
      "Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,Color_x0020_Tag,SortOrder,Configurations,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent";
    smartmetaDetails = await globalCommon.getData(
      NextProp.siteUrl,
      NextProp.SmartMetadataListID,
      select
    );



    SmartMetaData = smartmetaDetails;

  }

  React.useEffect(() => {
    
    SmartMetaDatas();
  }, [])


  // CustomHeader of the Add Structure

  const onRenderCustomHeader = () => {
    return (
      <div className={IsUpdated == "Service" ? 'd-flex full-width pb-1 serviepannelgreena' : 'd-flex full-width pb-1'} >

        <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
          <span>

            {(props != undefined || checkedList[0] != undefined) &&
              <>
                <a href={NextProp.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + checkedList[0]?.Id}><img className="icon-sites-img" src={checkedList[0]?.SiteIcon} />{(props != undefined && checkedList[0] === undefined) ? props.Title : checkedList[0].Title}- Create Child Item</a>
              </>
            }
          </span>
        </div>
        <Tooltip ComponentId={1272} IsServiceTask={IsUpdated == "Service" ? true : false} />
      </div>
    );
  };


  function closeaddstructure() {
    setAddModalOpen(false)
  }
  // CustomHeader of the Add Structure End

  function handleClick(item: any) {
    const index = items.indexOf(item);
    if (index !== -1) {
      // Item already exists, remove it
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    } else {
      // Item doesn't exist, add it
      items.Title = item.Title;
      items.Id = item?.Id;
      items.Title = item.Title;
      items.Id = item?.Id;
      setItems([...items, item]);
    }
  }

  //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------
  IsUpdated = props?.Portfolio_x0020_Type;
  // for smarttime

  //Open activity popup
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
          <span>{`Create  ${IsUpdated} item in ${MeetingItems[0]?.PortfolioStructureID} ${MeetingItems[0]?.Title}`}</span>
        </div>
        <Tooltip ComponentId="1746" IsServiceTask={IsUpdated == "Service" ? true : false} />
      </div>
    );
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

  const filterDataBasedOnList = function () {
    var AllTaskData1: any = [];
    AllTaskData1 = AllTaskData1.concat(CopyTaskData);
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




  const LoadAllSiteTasks = function () {
    var Response: any = [];
    var Counter = 0;
    if (siteConfig != undefined && siteConfig.length > 0) {
      map(siteConfig, async (config: any) => {
        let web = new Web(NextProp.siteUrl);
        let AllTasksMatches = [];
        AllTasksMatches = await web.lists
          .getById(config.listId)
          .items.select(
            "ParentTask/Title",
            "ParentTask/Id",
            "Project/Id",
            "Project/PortfolioStructureID",
            "Project/Title",
            "Services/Title",
            "ClientTime",
            "Services/Id",
            "Events/Id",
            "Events/Title",
            "ItemRank",
            "Portfolio_x0020_Type",
            "SiteCompositionSettings",
            "SharewebTaskLevel1No",
            "SharewebTaskLevel2No",
            "TimeSpent",
            "BasicImageInfo",
            "OffshoreComments",
            "OffshoreImageUrl",
            "CompletedDate",
            "Shareweb_x0020_ID",
            "Responsible_x0020_Team/Id",
            "Responsible_x0020_Team/Title",
            "SharewebCategories/Id",
            "SharewebCategories/Title",
            "ParentTask/Shareweb_x0020_ID",
            "SharewebTaskType/Id",
            "SharewebTaskType/Title",
            "SharewebTaskType/Level",
            "Priority_x0020_Rank",
            "Team_x0020_Members/Title",
            "Team_x0020_Members/Name",
            "Component/Id",
            "Component/Title",
            "Component/ItemType",
            "Team_x0020_Members/Id",
            "component_x0020_link",
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
            "Author/Title"
            // "Editor/Id",
            // "Editor/Title"
          )
          .expand(
            "ParentTask",
            "Project",
            "Events",
            "Services",
            "SharewebTaskType",
            "AssignedTo",
            "Component",
            "ClientCategory",
            "Author",
            // "Editor",
            "Team_x0020_Members",
            "Responsible_x0020_Team",
            "SharewebCategories"
          )
          .filter("Status ne 'Completed'")
          .orderBy("orderby", false)
          .getAll(4000);

        // console.log(AllTasksMatches);
        Counter++;
        // console.log(AllTasksMatches.length);
        if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
          $.each(AllTasksMatches, function (index: any, item: any) {
            item.isDrafted = false;
            item.flag = true;
            item.TitleNew = item.Title;
            // item.HierarchyData = globalCommon.hierarchyData(item, usePopHoverDataSend)
            item.siteType = config.Title;
            item.childs = [];
            item.listId = config.listId;
            item.siteUrl = NextProp.siteUrl;
            if (item.SharewebCategories.results != undefined) {
              if (item.SharewebCategories.results.length > 0) {
                $.each(
                  item.SharewebCategories.results,
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
              if (result.Project) {

                result.ProjectTitle = result?.Project?.Title;

                result.ProjectId = result?.Project?.Id;

                result.projectStructerId = result?.Project?.PortfolioStructureID

                const title = result?.Project?.Title || '';

                const dueDate = result?.DueDate;

                result.joinedData = [];

                if (title) result.joinedData.push(`Title: ${title}`);

                if (dueDate) result.joinedData.push(`Due Date: ${dueDate}`);

            }
              result.AllTeamName =
                result.AllTeamName === undefined ? "" : result.AllTeamName;
              result.chekbox = false;

              result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
              result.Restructuring =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png";
              result.chekbox = false;
              if (result.Short_x0020_Description_x0020_On != undefined) {
                result.Short_x0020_Description_x0020_On =
                  result.Short_x0020_Description_x0020_On.replace(
                    /(<([^>]+)>)/gi,
                    ""
                  );
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
                result.Responsible_x0020_Team != undefined &&
                result.Responsible_x0020_Team.length > 0
              ) {
                map(result.Responsible_x0020_Team, (Assig: any) => {
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
                result.Team_x0020_Members != undefined &&
                result.Team_x0020_Members.length > 0
              ) {
                map(result.Team_x0020_Members, (Assig: any) => {
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
              result["SiteIcon"] = GetIconImageUrl(result.siteType, NextProp.siteUrl, undefined);
              // result["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url
              // if (
              //   result.ClientCategory != undefined &&
              //   result.ClientCategory.length > 0
              // ) {
              //   map(result.Team_x0020_Members, (catego: any) => {
              //     result.ClientCategory.push(catego);
              //   });
              // }
              if (result.Id === 1441) console.log(result);
              result["Shareweb_x0020_ID"] = globalCommon.getTaskId(result);
              if (result["Shareweb_x0020_ID"] == undefined) {
                result["Shareweb_x0020_ID"] = "";
              }
              result["Item_x0020_Type"] = "Task";
              TasksItem.push(result);
            });

            AllActivitysData = AllTasks?.filter(
              (elem: any) => elem?.SharewebTaskType?.Title == "Activities"
            );
            AllWorkStreamData = AllTasks?.filter(
              (elem: any) => elem?.SharewebTaskType?.Title == "Workstream"
            );

            AllActivitysData?.forEach((elem: any) => {
              elem.childs = [];
              elem.subRows = [];
              AllTasks?.forEach((task: any) => {
                if (elem.Id === task.Id) {
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
                  if (val.Id === task.Id) {
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

            // console.log("taskssssssssssssss", AllActivitysData);
            // console.log("AllActivitysData", AllActivitysData);
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



  const addModal = () => {
    setAddModalOpen(true);
  };
  // Global Search
  var getRegexPattern = function (keywordArray: any) {
    var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
    return new RegExp(pattern, "gi");
  };
  var getHighlightdata = function (item: any, searchTerms: any) {
    var keywordList = [];
    if (serachTitle != undefined && serachTitle != "") {
      keywordList = stringToArray(serachTitle);
    } else {
      keywordList = stringToArray(serachTitle);
    }
    var pattern: any = getRegexPattern(keywordList);
    //let Title :any =(...item.Title)
    item.TitleNew = item.Title;
    item.TitleNew = item.Title.replace(
      pattern,
      '<span class="highlighted">$2</span>'
    );
    // item.Title = item.Title;
    keywordList = [];
    pattern = "";
  };
  var getSearchTermAvialable1 = function (
    searchTerms: any,
    item: any,
    Title: any
  ) {
    var isSearchTermAvailable = true;
    $.each(searchTerms, function (index: any, val: any) {
      if (
        isSearchTermAvailable &&
        item[Title] != undefined &&
        item[Title].toLowerCase().indexOf(val.toLowerCase()) > -1
      ) {
        isSearchTermAvailable = true;
        getHighlightdata(item, val.toLowerCase());
      } else isSearchTermAvailable = false;
    });
    return isSearchTermAvailable;
  };

  var stringToArray = function (input: any) {
    if (input) {
      return input.match(/\S+/g);
    } else {
      return [];
    }
  };

  var isItemExistsNew = function (array: any, items: any) {
    var isExists = false;
    $.each(array, function (index: any, item: any) {
      if (item?.Id === items?.Id && items.siteType === item.siteType) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };


  // var TaxonomyItems: any = [];
  var AllComponetsData: any = [];
  var TaskUsers: any = [];
  // var RootComponentsData: any = [];
  // var ComponentsData: any = [];
  // var SubComponentsData: any = []; var FeatureData: any = [];
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
    let taskUsers = (Response = TaskUsers = await globalCommon.loadTaskUsers());
    setTaskUser(Response);
    // console.log(Response);
  };
  const GetSmartmetadata = async () => {
    var metadatItem: any = [];
    let smartmetaDetails: any = [];
    var select: any =
      "Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,Color_x0020_Tag,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent";
    smartmetaDetails = await globalCommon.getData(
      NextProp.siteUrl,
      NextProp.SmartMetadataListID,
      select
    );



    console.log(smartmetaDetails);
    setMetadata(smartmetaDetails);
    map(smartmetaDetails, (newtest) => {
      newtest.Id = newtest.ID;
      // if (newtest.ParentID == 0 && newtest.TaxType == 'Client Category') {
      //     TaxonomyItems.push(newtest);
      // }
      if (
        newtest.TaxType == "Sites" &&
        newtest.Title != "Master Tasks" &&
        newtest.Title != "SDC Sites"
      ) {
        siteConfig.push(newtest);
      }
    });
    map(siteConfig, (newsite) => {
      if (
        newsite.Title == "SDC Sites" ||
        newsite.Title == "DRR" ||
        newsite.Title == "Small Projects" ||
        newsite.Title == "Offshore Tasks" ||
        newsite.Title == "Health" ||
        newsite.Title == "Shareweb Old" ||
        newsite.Title == "Master Tasks"
      )
        newsite.DataLoadNew = false;
      else newsite.DataLoadNew = true;
      /*-- Code for default Load Task Data---*/
      if (
        newsite.Title == "DRR" ||
        newsite.Title == "Small Projects" ||
        newsite.Title == "Gruene" ||
        newsite.Title == "Offshore Tasks" ||
        newsite.Title == "Health" ||
        newsite.Title == "Shareweb Old"
      ) {
        newsite.Selected = false;
      } else {
        newsite.Selected = true;
      }
    });
  };
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

    let componentDetails: any = [];
    let componentDetails1: any = [];
    var select =
      "ID,Id,Title,Mileage,TaskListId,TaskListName,PortfolioLevel,SiteCompositionSettings,PortfolioStructureID,PortfolioStructureID,component_x0020_link,Package,Comments,DueDate,Sitestagging,Body,Deliverables,StartDate,Created,Item_x0020_Type,Help_x0020_Information,Background,Categories,Short_x0020_Description_x0020_On,CategoryItem,Priority_x0020_Rank,Priority,TaskDueDate,PercentComplete,Modified,CompletedDate,ItemRank,Portfolio_x0020_Type,Services/Title, ClientTime,Services/Id,Events/Id,Events/Title,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Author/Title,Author/Id,Editor/Title,Events/Title,Events/ItemType,SharewebCategories/Id,SharewebTaskType/Title,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,ClientCategory/Id,ClientCategory/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title&$expand=Parent,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=" +
      filt +
      "";

    componentDetails = await globalCommon.getData(
      NextProp.siteUrl,
      NextProp.MasterTaskListID,
      select
    );
    console.log(componentDetails);
    componentDetails?.map((result: any) => {
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
    })
    var array: any = [];
    if (
      Itemtypes != undefined &&
      Itemtypes === "Component"
    ) {
      array = $.grep(componentDetails, function (compo: any) {
        return compo?.Id === ParentDs;
      });
      let temp: any = $.grep(componentDetails, function (compo: any) {
        return compo.Parent?.Id === ParentDs;
      });
      array = [...array, ...temp];
      temp.forEach((obj: any) => {
        if (obj?.Id != undefined) {
          var temp1: any = $.grep(componentDetails, function (compo: any) {
            return compo.Parent?.Id === obj?.Id;
          });
          if (temp1 != undefined && temp1.length > 0)
            array = [...array, ...temp1];
        }
      });
    }
    if (
      Itemtypes != undefined &&
      Itemtypes === "SubComponent"
    ) {
      array = $.grep(componentDetails, function (compo: any) {
        return compo?.Id === ParentDs;
      });
      let temp = $.grep(componentDetails, function (compo: any) {
        return compo.Parent?.Id === ParentDs;
      });
      if (temp != undefined && temp.length > 0) array = [...array, ...temp];
    }
    if (
      Itemtypes != undefined &&
      Itemtypes === "Feature"
    ) {
      array = $.grep(componentDetails, function (compo: any) {
        return compo?.Id === ParentDs;
      });
    }

    AllComponetsData = array;
    ComponetsData["allComponets"] = array;

    var arrayfilter: any = [];
    const Itmes: any = [];
    const chunkSize = 20;
    for (let i = 0; i < AllComponetsData.length; i += chunkSize) {
      const chunk = AllComponetsData.slice(i, i + chunkSize);
      if (chunk != undefined && chunk.length > 0) {
        var filter: any = "";
        if (IsUpdated === "Service" && chunk != undefined && chunk.length > 0) {
          chunk.forEach((obj: any, index: any) => {
            if (chunk.length - 1 === index)
              filter += "(Services/Id eq " + obj?.Id + " )";
            else filter += "(Services/Id eq " + obj?.Id + " ) or ";
          });
        }
        if (
          IsUpdated === "Component" &&
          chunk != undefined &&
          chunk.length > 0
        ) {
          chunk.forEach((obj: any, index: any) => {
            if (chunk.length - 1 === index)
              filter += "(Component/Id eq " + obj?.Id + " )";
            else filter += "(Component/Id eq " + obj?.Id + " ) or ";
          });
        }
        if (IsUpdated === "Events" && chunk != undefined && chunk.length > 0) {
          chunk.forEach((obj: any, index: any) => {
            if (chunk.length - 1 === index)
              filter += "(Events/Id eq " + obj?.Id + " )";
            else filter += "(Events/Id eq " + obj?.Id + " ) or ";
          });
        }

        Itmes.push(filter);
      }
      // do whatever
    }

    // await GetTimeEntryData();
    // await getProjectData();
    LoadAllSiteTasks();
  };
  //const [IsUpdated, setIsUpdated] = React.useState(SelectedProp.SelectedProp);
  React.useEffect(() => {
    //MainMeetingItems.push(props)
    showProgressBar();
    getTaskUsers();
    GetSmartmetadata();
    //LoadAllSiteTasks();
    GetComponents();
  }, []);
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

  var AllTasks: any = [];
  var CopyTaskData: any = [];
  var isItemExistsNew = function (array: any, items: any) {
    var isExists = false;
    $.each(array, function (index: any, item: any) {
      if (item?.Id === items?.Id && items.siteType === item.siteType) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
  // tagged component
  const findTaggedComponents = function (task: any) {
    task.Portfolio_x0020_Type = "Component";
    task.isService = false;
    if (IsUpdated === "Service") {
      $.each(task["Services"], function (index: any, componentItem: any) {
        for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
          let crntItem = ComponetsData["allComponets"][i];
          if (componentItem?.Id == crntItem?.Id) {
            if (
              crntItem.PortfolioStructureID != undefined &&
              crntItem.PortfolioStructureID != ""
            ) {
              task.PortfolioStructureID = crntItem.PortfolioStructureID;
              task.ShowTooltipSharewebId =
                crntItem.PortfolioStructureID + "-" + task.Shareweb_x0020_ID;
            }
            if (crntItem.Portfolio_x0020_Type == "Service") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Service";
            }
            if (ComponetsData["allComponets"][i]["subRows"] === undefined)
              ComponetsData["allComponets"][i]["subRows"] = [];
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["subRows"], task)
            ) {
              ComponetsData["allComponets"][i].downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
              ComponetsData["allComponets"][i].RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
              ComponetsData["allComponets"][i]["subRows"].push(task);
              if (ComponetsData["allComponets"][i]?.Id === 413)
                console.log(ComponetsData["allComponets"][i]["subRows"].length);
            }
            break;
          }
        }
      });
    }
    if (IsUpdated === "Events") {
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
                crntItem.PortfolioStructureID + "-" + task.Shareweb_x0020_ID;
            }
            if (crntItem.Portfolio_x0020_Type == "Events") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Events";
            }
            if (ComponetsData["allComponets"][i]["subRows"] == undefined)
              ComponetsData["allComponets"][i]["subRows"] = [];
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["subRows"], task)
            )
              ComponetsData["allComponets"][i]["subRows"].push(task);
            break;
          }
        }
      });
    }
    if (IsUpdated === "Component") {
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
                crntItem.PortfolioStructureID + "-" + task.Shareweb_x0020_ID;
            }
            if (crntItem.Portfolio_x0020_Type == "Component") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Component";
            }
            if (ComponetsData["allComponets"][i]["subRows"] == undefined)
              ComponetsData["allComponets"][i]["subRows"] = [];
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["subRows"], task)
            )
              ComponetsData["allComponets"][i]["subRows"].push(task);
            break;
          }
        }
      });
    }
  };
  //var pageType = 'Service-Portfolio';

  const DynamicSort = function (items: any, column: any) {
    items.sort(function (a: any, b: any) {
      // return   a[column] - b[column];
      var aID = a[column];
      var bID = b[column];
      return aID == bID ? 0 : aID > bID ? 1 : -1;
    });
  };
  var ComponetsData: any = {};
  ComponetsData.allUntaggedTasks = [];
  const bindData = function () {
    var RootComponentsData: any[] = [];
    var ComponentsData: any = [];
    var SubComponentsData: any = [];
    var FeatureData: any = [];

    $.each(ComponetsData["allComponets"], function (index: any, result: any) {
      result.TeamLeaderUser = result.TeamLeaderUser === undefined ? [] : result.TeamLeaderUser;
      // result.TeamLeader = result.TeamLeader != undefined ? result.TeamLeader : []
      result.CreatedDateImg = [];
      result.childsLength = 0;
      result.TitleNew = result.Title;
      // result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");
      result.flag = true;
      // if (result.DueDate == "Invalid date" || "") {
      //   result.DueDate = result.DueDate.replaceAll("Invalid date", "");
      // }

      // result.siteType = config.Title;
      result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

      if (result.Short_x0020_Description_x0020_On != undefined) {
        result.Short_x0020_Description_x0020_On =
          result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/gi, "");
      }
      result["siteType"] = "Master Tasks";
      result["SiteIcon"] = globalCommon.GetIconImageUrl(
        result.siteType,
        GlobalConstants.MAIN_SITE_URL + "/SP",
        undefined
      );

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
        result.Team_x0020_Members != undefined &&
        result.Team_x0020_Members.length > 0
      ) {
        $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
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
        result.Responsible_x0020_Team != undefined &&
        result.Responsible_x0020_Team.length > 0
      ) {
        $.each(
          result.Responsible_x0020_Team,
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


      if (result.Author != undefined) {
        if (result.Author?.Id != undefined) {
          $.each(TaskUsers, function (index: any, users: any) {
            if (
              result.Author?.Id != undefined &&
              users.AssingedToUser != undefined &&
              result.Author?.Id == users.AssingedToUser?.Id
            ) {
              users.ItemCover = users.Item_x0020_Cover.Url;
              result.CreatedDateImg.push(users);
            }
          });
        }
      }
      if (
        result.PortfolioStructureID != null &&
        result.PortfolioStructureID != undefined
      ) {
        result["Shareweb_x0020_ID"] = result.PortfolioStructureID;
      } else {
        result["Shareweb_x0020_ID"] = "";
      }
      // if (
      //   result.ClientCategory != undefined &&
      //   result.ClientCategory.length > 0
      // ) {
      //   $.each(result.Team_x0020_Members, function (index: any, catego: any) {
      //     result.ClientCategory.push(catego);
      //   });
      // }
      result.Restructuring =
        IsUpdated != undefined && IsUpdated == "Service"
          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png"
          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png";

      if (result.Item_x0020_Type == "Root Component") {
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        RootComponentsData.push(result);
      }
      if (result.Item_x0020_Type == "Component") {
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        result.SiteIcon =
          IsUpdated != undefined && IsUpdated == "Service"
            ? GlobalConstants.MAIN_SITE_URL +
            "/SP/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"
            : GlobalConstants.MAIN_SITE_URL +
            "/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png";
        ComponentsData.push(result);
      }

      if (result.Item_x0020_Type == "SubComponent") {
        result.SiteIcon =
          IsUpdated != undefined && IsUpdated == "Service"
            ? GlobalConstants.MAIN_SITE_URL +
            "/SP/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png"
            : GlobalConstants.MAIN_SITE_URL +
            "/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png";
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        if (result["subRows"].length > 0) {
          result.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          result.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
        }
        SubComponentsData.push(result);
      }
      if (result.Item_x0020_Type == "Feature") {
        result.SiteIcon =
          IsUpdated != undefined && IsUpdated == "Service"
            ? GlobalConstants.MAIN_SITE_URL +
            "/SP/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"
            : GlobalConstants.MAIN_SITE_URL +
            "/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png";
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        if (result["subRows"].length > 0) {
          result.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          result.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
          DynamicSort(result.subRows, "Shareweb_x0020_ID");
          //if (result.subRows != undefined && result.subRows.length > 0)
          result.childsLength = result.subRows.length;
        }
        FeatureData.push(result);
      }
      // if (result.Title == 'Others') {
      //     //result['subRows'] = result['subRows'] != undefined ? result['subRows'] : [];
      //     ComponentsData.push(result);
      // }
    });

    $.each(SubComponentsData, function (index: any, subcomp: any) {
      if (subcomp.Title != undefined) {
        if (subcomp["subRows"] != undefined && subcomp["subRows"].length > 0) {
          let Tasks = subcomp["subRows"].filter(
            (sub: { Item_x0020_Type: string }) => sub.Item_x0020_Type === "Task"
          );
          // Tasks.map((item: any) => {
          //   item.smartTime = calculateTotalTimeForTask(item);
              
          // })
          let Features = subcomp["subRows"].filter(
            (sub: { Item_x0020_Type: string }) =>
              sub.Item_x0020_Type === "Feature"
          );
          subcomp["subRows"] = [];
          DynamicSort(Tasks, "Shareweb_x0020_ID");
          subcomp["subRows"] = Features.concat(Tasks);
          subcomp.childsLength = Tasks.length;
        }
        $.each(FeatureData, function (index: any, featurecomp: any) {
          if (
            featurecomp.Parent != undefined &&
            subcomp?.Id == featurecomp.Parent?.Id
          ) {
            subcomp.downArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            subcomp.RightArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            subcomp.childsLength++;
            if (
              featurecomp["subRows"] != undefined &&
              featurecomp["subRows"].length > 0
            ) {
              let Tasks = featurecomp["subRows"].filter(
                (sub: { Item_x0020_Type: string }) =>
                  sub.Item_x0020_Type === "Task"
              );
              // Tasks.map((item: any) => {
              //   item.smartTime = calculateTotalTimeForTask(item);
            
              // })
              featurecomp["subRows"] = [];
              DynamicSort(Tasks, "Shareweb_x0020_ID");
              featurecomp["subRows"] = Tasks;
              featurecomp.childsLength = Tasks.length;
            }
            subcomp["subRows"].unshift(featurecomp);
          }
        });

        DynamicSort(subcomp.subRows, "PortfolioLevel");
      }
    });
    if (ComponentsData != undefined && ComponentsData.length > 0) {
      $.each(ComponentsData, function (index: any, subcomp: any) {
        if (subcomp.Title != undefined) {
          $.each(SubComponentsData, function (index: any, featurecomp: any) {
            if (
              featurecomp.Parent != undefined &&
              subcomp?.Id == featurecomp.Parent?.Id
            ) {
              subcomp.downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
              subcomp.RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
              subcomp.childsLength++;
              subcomp["subRows"].unshift(featurecomp);
            }
          });
          DynamicSort(subcomp.subRows, "PortfolioLevel");
        }
      });

      map(ComponentsData, (comp) => {
        if (comp.Title != undefined) {
          map(FeatureData, (featurecomp) => {
            if (
              featurecomp.Parent != undefined &&
              comp?.Id === featurecomp.Parent?.Id
            ) {
              comp.downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
              comp.RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Service"
                  ? GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                  : GlobalConstants.MAIN_SITE_URL +
                  "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
              comp.childsLength++;
              comp["subRows"].unshift(featurecomp);
            }
          });
        }
      });
    } else
      ComponentsData =
        SubComponentsData.length === 0 ? FeatureData : SubComponentsData;
    var array: any = [];
    map(ComponentsData, (comp, index) => {
      if (comp.subRows != undefined && comp.subRows.length > 0) {
        var Subcomponnet = comp.subRows.filter(
          (sub: { Item_x0020_Type: string }) =>
            sub.Item_x0020_Type === "SubComponent"
        );
        DynamicSort(Subcomponnet, "PortfolioLevel");
        var SubTasks = comp.subRows.filter(
          (sub: { Item_x0020_Type: string }) => sub.Item_x0020_Type === "Task"
        );
        // SubTasks.map((item: any) => {
        //   item.smartTime = calculateTotalTimeForTask(item);
        // })
        var SubFeatures = comp.subRows.filter(
          (sub: { Item_x0020_Type: string }) =>
            sub.Item_x0020_Type === "Feature"
        );
        DynamicSort(SubFeatures, "PortfolioLevel");
        SubFeatures = SubFeatures.concat(SubTasks);
        Subcomponnet = Subcomponnet.concat(SubFeatures);
        comp["subRows"] = Subcomponnet;
        array.push(comp);

        if (Subcomponnet != undefined && Subcomponnet.length > 0) {
          //  if (comp.subRows != undefined && comp.subRows.length > 0) {
          map(Subcomponnet, (subcomp, index) => {
            if (subcomp.subRows != undefined && subcomp.subRows.length > 0) {
              var Subchildcomponnet = subcomp.subRows.filter(
                (sub: any) => sub.Item_x0020_Type === "Feature"
              );
              DynamicSort(SubFeatures, "PortfolioLevel");
              var SubchildTasks = subcomp.subRows.filter(
                (sub: any) => sub.Item_x0020_Type === "Task"
              );

              // SubchildTasks.map((item: any) => {
              //   item.smartTime = calculateTotalTimeForTask(item);
            
              // })
              Subchildcomponnet = Subchildcomponnet.concat(SubchildTasks);
              subcomp["subRows"] = Subchildcomponnet;
              // var SubchildTasks = subcomp.subRows.filter((sub: any) => (sub.ItemType === 'SubComponnet'));
            }
          });
        }
      } else array.push(comp);
    });
    ComponentsData = array;
    var temp: any = {};
    temp.TitleNew = "Tasks";
    temp.subRows = [];
    //  temp.AllTeamMembers = [];
    //  temp.AllTeamMembers = [];
    temp.TeamLeader = [];
    temp.flag = true;
    temp.downArrowIcon =
      IsUpdated != undefined && IsUpdated == "Service"
        ? GlobalConstants.MAIN_SITE_URL +
        "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
        : GlobalConstants.MAIN_SITE_URL +
        "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
    temp.RightArrowIcon =
      IsUpdated != undefined && IsUpdated == "Service"
        ? GlobalConstants.MAIN_SITE_URL +
        "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
        : GlobalConstants.MAIN_SITE_URL +
        "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

    temp.show = true;
    ComponentsData.push(temp);
    temp.subRows = ComponentsData[0].subRows.filter(
      (sub: any) => sub.Item_x0020_Type === "Task" && sub.subRows.length == 0
    );
    // temp?.subRows?.map((item: any) => {
    //   item.smartTime = calculateTotalTimeForTask(item);
            
    // })
    AllItems = ComponentsData[0].subRows.filter(
      (sub: any) => sub.Item_x0020_Type != "Task" || sub.subRows.length > 0
    );
    // AllItems.map((item: any) => {
    //   item.smartTime = calculateTotalTimeForTask(item);
    // })
    var activities = temp.subRows.filter(
      (sub: any) => sub?.SharewebTaskType?.Title === "Activities"
    );
    // activities.map((item: any) => {
    //   item.smartTime = calculateTotalTimeForTask(item);
    // })
    if (activities != undefined && activities.length > 0) {
      AllItems = AllItems.concat(activities);
    }
    temp.subRows = temp.subRows.filter(
      (sub: any) => sub?.SharewebTaskType?.Title != "Activities"
    );
    temp.childsLength = temp.subRows.length;

    if (temp.subRows != undefined && temp.subRows.length > 0) AllItems.push(temp);
    setSubComponentsData(SubComponentsData);
    setFeatureData(FeatureData);
    setComponentsData(ComponentsData);
    setmaidataBackup(AllItems);
    setData(AllItems);
    showProgressHide();
  };

  var makeFinalgrouping = function () {
    var AllTaskData1: any = [];
    ComponetsData["allUntaggedTasks"] = [];
    AllTaskData1 = AllTaskData1.concat(TasksItem);

    $.each(AllTaskData1, function (index: any, task: any) {

      if (task?.Id === 3559 || task?.Id === 3677) console.log(task);
      task.Portfolio_x0020_Type = "Component";
      if (IsUpdated === "Service") {
        if (task["Services"] != undefined && task["Services"].length > 0) {
          task.Portfolio_x0020_Type = "Service";
          findTaggedComponents(task);
        }
      }
      if (IsUpdated === "Events") {
        if (task["Events"] != undefined && task["Events"].length > 0) {
          task.Portfolio_x0020_Type = "Events";
          findTaggedComponents(task);
        }
      }
      if (IsUpdated === "Component") {
        if (task["Component"] != undefined && task["Component"].length > 0) {
          task.Portfolio_x0020_Type = "Component";
          findTaggedComponents(task);
        }
      }
    });
    var temp: any = {};
    temp.TitleNew = "Tasks";
    temp.subRows = [];
    temp.flag = true;
    ComponetsData["allComponets"].push(temp);
    bindData();
  };

  var TasksItem: any = [];



  // Expand Table
  const expndpopup = (e: any) => {
    settablecontiner(e);
  };

  //------------------Edit Data----------------------------------------------------------------------------------------------------------------------------

  const onChangeHandler = (itrm: any, child: any, eTarget: any, getSelectedRowModel: any) => {
    if (eTarget == true) {
      setcheckData(getSelectedRowModel)
      setShowTeamMemberOnCheck(true)
    } else {
      setcheckData([])
      MeetingItems = []
      childsData = []
      setShowTeamMemberOnCheck(false)
    }
    console.log("itrm: any, child: any, eTarget: any", itrm, child, eTarget)
    var Arrays: any = []
    const checked = eTarget;
    if (checked == true) {
      // itrm.chekBox = true;
      if (itrm.SharewebTaskType == undefined) {
        setActivityDisable(false)
        itrm['siteUrl'] = NextProp?.siteUrl;
        itrm['listName'] = 'Master Tasks';
        MeetingItems.push(itrm)
        //setMeetingItems(itrm);

      }
      if (itrm.SharewebTaskType != undefined) {
        if (itrm?.SharewebTaskType?.Title == 'Activities' || itrm.SharewebTaskType.Title == "Workstream") {
          setActivityDisable(false)
          itrm['siteUrl'] = NextProp?.siteUrl;
          itrm['listName'] = 'Master Tasks';
          Arrays.push(itrm)
          itrm['PortfolioId'] = child?.Id;
          childsData.push(itrm)
        }
      }
      if (itrm?.SharewebTaskType != undefined) {
        if (itrm?.SharewebTaskType?.Title == 'Task') {
          setActivityDisable(true)

        }
      }
      if (props?.Item_x0020_Type == 'Feature' && checkedList.length >= 1) {
        setActivityDisable(false)
      }
    }
    if (checked == false) {
      // itrm.chekBox = false;
      MeetingItems?.forEach((val: any, index: any) => {
        MeetingItems = []
      })
      if (MeetingItems.length == 0) {
        setActivityDisable(true)
      }
      $('#ClientCategoryPopup').hide();
    }
    setComponentRestruct(false);
    // let list = [...checkedList];
    let list: any = [];
    var flag = true;
    list?.forEach((obj: any, index: any) => {
      if (obj?.Id != undefined && itrm?.Id != undefined && obj?.Id === itrm?.Id) {
        flag = false;
        // list.splice(index, 1);
        list = [];
      }
    })
    if (flag)
      list.push(itrm);
    maidataBackup?.forEach((obj, index) => {
      obj.isRestructureActive = false;
      if (obj.subRows != undefined && obj?.subRows?.length > 0) {
        obj?.subRows?.forEach((sub: any, indexsub: any) => {
          sub.isRestructureActive = false;
          if (sub.subRows != undefined && sub.subRows.length > 0) {
            sub?.subRows?.forEach((newsub: any, lastIndex: any) => {
              newsub.isRestructureActive = false;

            })
          }

        })
      }

    })
    setData(data => ([...maidataBackup]));
    setCheckedList(checkedList => ([...list]));
  };


  //   var Arrays: any = [];

  //   const { checked } = e.target;
  //   if (checked == true) {
  //     itrm.chekBox = true;
  //     if (itrm.ClientCategory != undefined && itrm.ClientCategory.length > 0) {
  //       itrm.ClientCategory.map((clientcategory: any) => {
  //         selectedCategory.push(clientcategory);
  //       });
  //     }

  //     if (itrm.SharewebTaskType == undefined) {
  //       setActivityDisable(false);
  //       itrm["siteUrl"] = NextProp?.siteUrl;
  //       itrm["listName"] = "Master Tasks";
  //       MeetingItems.push(itrm);
  //       //setMeetingItems(itrm);
  //     }
  //     if (itrm.SharewebTaskType != undefined) {
  //       if (
  //         itrm.SharewebTaskType.Title == "Activities" ||
  //         itrm.SharewebTaskType.Title == "Workstream"
  //       ) {
  //         setActivityDisable(false);
  //         // itrm['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
  //         // itrm['listName'] = 'Master Tasks';
  //         Arrays.push(itrm);
  //         itrm["PortfolioId"] = child?.Id;
  //         childsData.push(itrm);
  //       }
  //     }
  //     if (itrm.SharewebTaskType != undefined) {
  //       if (itrm.SharewebTaskType.Title == "Task") {
  //         setActivityDisable(true);
  //       }
  //     }
  //     if (itrm.SharewebTaskType != undefined) {
  //       if (itrm.SharewebTaskType.Title == "Task") {
  //         setActivityDisable(true);
  //       }
  //     }
  //   }
  //   if (checked == false) {
  //     itrm.chekBox = false;
  //     MeetingItems?.forEach((val: any, index: any) => {
  //       if (val?.Id == itrm?.Id) {
  //         MeetingItems.splice(index, 1);
  //       }
  //     });
  //     if (itrm.SharewebTaskType != undefined) {
  //       if (itrm.SharewebTaskType.Title == "Task") {
  //         setActivityDisable(false);
  //         if (itrm.SharewebTaskType != undefined) {
  //           if (itrm.SharewebTaskType.Title == "Task") {
  //             setActivityDisable(false);
  //           }
  //         }
  //       }
  //     }
  //   }

  //   const list = [...checkedList];
  //   var flag = true;
  //   list.forEach((obj: any, index: any) => {
  //     if (obj?.Id != undefined && itrm?.Id != undefined && obj?.Id === itrm?.Id) {
  //       flag = false;
  //       list.splice(index, 1);
  //     }
  //   });
  //   if (flag) list.push(itrm);
  //   maidataBackup.forEach((obj, index) => {
  //     obj.isRestructureActive = false;
  //     if (obj.subRows != undefined && obj.subRows.length > 0) {
  //       obj.subRows.forEach((sub: any, indexsub: any) => {
  //         sub.isRestructureActive = false;
  //         if (sub.subRows != undefined && sub.subRows.length > 0) {
  //           sub.subRows.forEach((newsub: any, lastIndex: any) => {
  //             newsub.isRestructureActive = false;
  //           });
  //         }
  //       });
  //     }
  //   });
  //   setData((data) => [...maidataBackup]);
  //   setCheckedList((checkedList) => [...list]);
  // };
  var TaskTimeSheetCategoriesGrouping: any = [];
  const isItemExists = function (arr: any, Id: any) {
    var isExists = false;
    $.each(arr, function (index: any, item: any) {
      if (item?.Id == Id) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };


  const EditData = (e: any, item: any) => {
    setIsTimeEntry(true);
    setSharewebTimeComponent(item);
  };


  const EditComponentPopup = (item: any) => {
    // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
    setIsComponent(true);
    setSharewebComponent(item);
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
  };
  const EditItemTaskPopup = (item: any) => {
    // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
    setIsTask(true);
    setSharewebTask(item);
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
  };

  const Call = React.useCallback((childItem: any) => {
    // if (MeetingItems.length > 0) {
    //   MeetingItems = [];
    // }
    setRowSelection({})
    // MeetingItems?.forEach((val: any): any => {
    //     val.chekBox = false;
    // })
    closeTaskStatusUpdatePoup2();
    setIsComponent(false);;
    setIsTask(false);
    setMeetingPopup(false);
    setWSPopup(false);

    var MainId: any = ''
    let CountArray = 0;
    let ParentTaskId: any = ''
    if (childItem != undefined) {
      childItem.data.Services = []
      childItem.data.Component = []
      childItem.data['flag'] = true;
      childItem.data['TitleNew'] = childItem?.data?.Title;
      if (childItem?.data?.ServicesId[0] != undefined) {
        childItem.data.Services.push({ Id: childItem?.data?.ServicesId[0] });
      }
      if (childItem?.data?.ComponentId[0] != undefined) {
        childItem.data.Component.push({ Id: childItem?.data?.ComponentId[0] });
      }
      if (childItem?.data?.ServicesId != undefined && childItem?.data?.ServicesId?.length > 0) {
        MainId = childItem.data.ServicesId[0]
      }
      if (childItem.data.ComponentId != undefined && childItem.data.ComponentId.length > 0) {
        MainId = childItem.data.ComponentId[0]
      }
      if (childItem.data.ParentTaskId != undefined && childItem.data.ParentTaskId != "") {
        ParentTaskId = childItem.data.ParentTaskId
      }
      if (childItem?.data?.DueDate != undefined && childItem?.data?.DueDate != "" && childItem?.data?.DueDate != "Invalid date") {
        childItem.data.DueDate = childItem.data.DueDate ? Moment(childItem?.data?.DueDate).format("MM-DD-YYYY") : null
      }

      if (AllItems != undefined) {
        AllItems?.map((comp: any) => {
          comp.flag = true;
          comp.show = false;
          if (comp?.Id == ParentTaskId || comp.ID == ParentTaskId) {
            comp.subRows = comp.subRows == undefined ? [] : comp.subRows
            // comp.childs.push(childItem.data)
            CountArray++;
            comp.subRows.push(childItem.data)
            comp.subRows = comp?.subRows?.filter((ele: any, ind: any) => ind === comp?.subRows?.findIndex((elem: { ID: any; }) => elem.ID === ele.ID))

          }
          if (comp.subRows != undefined && comp.subRows.length > 0) {
            comp?.subRows?.map((subComp: any) => {
              subComp.flag = true;
              subComp.show = false;
              if (subComp?.Id == ParentTaskId || subComp.ID == ParentTaskId) {
                subComp.subRows = subComp.subRows == undefined ? [] : subComp.subRows
                // subComp.childs.push(childItem.data)
                CountArray++;
                subComp.subRows.push(childItem.data)

                subComp.subRows = subComp?.subRows?.filter((ele: any, ind: any) => ind === subComp?.subRows?.findIndex((elem: { ID: any; }) => elem.ID === ele.ID))
              }


              if (subComp.subRows != undefined && subComp.subRows.length > 0) {
                subComp?.subRows?.map((Feat: any) => {
                  if (Feat?.DueDate?.length > 0 && Feat?.DueDate != "Invalid date") {
                    Feat.DueDate = Feat?.DueDate ? Moment(Feat?.DueDate).format("MM-DD-YYYY") : null
                  } else {
                    Feat.DueDate = ''
                  }
                  Feat.flag = true;
                  Feat.show = false;
                  if (Feat?.Id == ParentTaskId || Feat.ID == ParentTaskId) {
                    CountArray++;
                    // Feat.childs = Feat.childs == undefined ? [] : Feat.childs
                    Feat.subRows = Feat.subRows == undefined ? [] : Feat.subRows
                    // Feat.childs.push(childItem.data)
                    Feat.subRows.push(childItem.data)
                    Feat.subRows = Feat?.subRows?.filter((ele: any, ind: any) => ind === Feat?.subRows?.findIndex((elem: { ID: any; }) => elem.ID === ele.ID))
                  }


                  if (Feat.subRows != undefined && Feat.subRows.length > 0) {
                    Feat?.subRows?.map((Activity: any) => {
                      if (Activity?.DueDate?.length > 0 && Activity?.DueDate != "Invalid date") {
                        Activity.DueDate = Activity?.DueDate ? Moment(Activity?.DueDate).format("MM-DD-YYYY") : null
                      } else {
                        Activity.DueDate = ''
                      }
                      Activity.flag = true;
                      Activity.show = false;
                      if (Activity?.Id == ParentTaskId || Activity.ID == ParentTaskId) {
                        CountArray++;
                        // Activity.childs = Activity.childs == undefined ? [] : Activity.childs
                        Activity.subRows = Activity.subRows == undefined ? [] : Activity.subRows
                        // Activity.childs.push(childItem.data)
                        Activity.subRows.push(childItem.data)
                        // Activity.subRows = Activity?.subRows.filter((val: any, id: any, array: any) => {
                        //     return array.indexOf(val) == id;
                        // })
                        Activity.subRows = Activity?.subRows?.filter((ele: any, ind: any) => ind === Activity?.subRows?.findIndex((elem: { ID: any; }) => elem.ID === ele.ID))
                      }


                      if (Activity.subRows != undefined && Activity.subRows.length > 0) {
                        Activity?.subRows?.map((workst: any) => {
                          if (workst?.DueDate?.length > 0 && workst?.DueDate != "Invalid date") {
                            workst.DueDate = workst?.DueDate ? Moment(workst?.DueDate).format("MM-DD-YYYY") : null
                          } else {
                            workst.DueDate = ''
                          }
                          workst.flag = true;
                          workst.show = false;
                          if (workst?.Id == ParentTaskId || workst.ID == ParentTaskId) {
                            CountArray++;
                            // workst.childs = workst.childs == undefined ? [] : workst.childs
                            workst.subRows = workst.subRows == undefined ? [] : workst.subRows
                            // workst.childs.push(childItem.data)
                            workst.subRows.push(childItem.data)

                            workst.subRows = workst?.subRows?.filter((ele: any, ind: any) => ind === workst?.subRows?.findIndex((elem: { ID: any; }) => elem.ID === ele.ID))
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
        if (CountArray == 0) {
          AllItems.push(childItem.data)
        }
        // setData(AllItems => ([...AllItems]))
        refreshData();
        // rerender();
      }

    }
  }, []);



  const TimeEntryCallBack = React.useCallback((item1) => {
    setIsTimeEntry(false);
  }, []);
  let isOpenPopup = false;

  const CloseCall = React.useCallback((item) => {
    if (MeetingItems.length > 0) {
      MeetingItems = [];
    }
    setRowSelection({})
    let CountArray = 0;
    if (!isOpenPopup && item.CreatedItem != undefined) {
      item.CreatedItem.forEach((obj: any) => {
        obj.data.subRows = [];
        obj.data.flag = true;
        obj.data.TitleNew = obj.data.Title;
        // obj.data.Team_x0020_Members=item.TeamMembersIds; 
        // obj.AssignedTo =item.AssignedIds;
        obj.data.siteType = "Master Tasks"
        if (obj.data.Item_x0020_Type != undefined && obj.data.Item_x0020_Type === 'Component')
          obj.data.SiteIconTitle = 'C';// obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

        if (obj.data.Item_x0020_Type != undefined && obj.data.Item_x0020_Type === 'SubComponent')
          obj.data.SiteIconTitle = 'S';// obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
        if (obj.data.Item_x0020_Type != undefined && obj.data.Item_x0020_Type === 'Feature')
          obj.data.SiteIconTitle = 'F';// obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
        obj.data['Shareweb_x0020_ID'] = obj.data.PortfolioStructureID;
        if (item.props != undefined && item.props.SelectedItem != undefined && item.props.SelectedItem.subRows != undefined) {
          item.props.SelectedItem.subRows = item.props.SelectedItem.subRows == undefined ? [] : item.props.SelectedItem.subRows;
          item.props.SelectedItem.subRows.unshift(obj.data);
        }

      })
      if (AllItems != undefined && AllItems.length > 0) {
        AllItems.forEach((compnew: any, index: any) => {
          if (compnew.subRows != undefined && compnew.subRows.length > 0) {
            item.props.SelectedItem.downArrowIcon = compnew.downArrowIcon;
            item.props.SelectedItem.RightArrowIcon = compnew.RightArrowIcon;
            return false;
          }
        })
        AllItems.forEach((comp: any, index: any) => {
          // comp.downArrowIcon =comp.downArrowIcon;
          if (comp?.Id != undefined && item.props.SelectedItem != undefined && comp?.Id === item.props.SelectedItem?.Id) {
            comp.childsLength = item.props?.SelectedItem?.subRows?.length;
            comp.show = comp.show == undefined ? false : comp.show
            comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
            comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
            comp.subRows = item.props.SelectedItem.subRows;
            CountArray++;
          }
          if (comp.subRows != undefined && comp.subRows.length > 0) {
            comp.subRows.forEach((subcomp: any, index: any) => {
              if (subcomp?.Id != undefined && item.props.SelectedItem != undefined && subcomp?.Id === item.props.SelectedItem?.Id) {
                subcomp.childsLength = item?.props?.SelectedItem?.subRows?.length;
                subcomp.show = subcomp.show == undefined ? false : subcomp.show
                subcomp.subRows = item.props.SelectedItem.subRows;
                comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
                CountArray++;
              }
            })
          }

        })

        // }
      }
      setData((AllItems) => [...AllItems]);
      if (item.CreateOpenType != undefined && item.CreateOpenType === 'CreatePopup') {
        setSharewebComponent(item.CreatedItem[0].data)
        setIsComponent(true);
      }
      refreshData()
      rerender()
    }
    if (CountArray == 0) {
      item.CreatedItem[0].data.subRows = item?.CreatedItem[0]?.data?.subRows == undefined ? [] : item?.CreatedItem[0]?.data?.subRows
      item.CreatedItem[0].data.flag = true;
      item.CreatedItem[0].data.TitleNew = item?.CreatedItem[0]?.data?.Title;
      item.CreatedItem[0].data.siteType = "Master Tasks"
      item.CreatedItem[0].data.childsLength = 0;
      if (item?.CreatedItem[0]?.data?.Item_x0020_Type != undefined && item?.CreatedItem[0]?.data?.Item_x0020_Type === 'Component')
        item.CreatedItem[0].data.SiteIconTitle = 'C';// item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

      if (item?.CreatedItem[0]?.data?.Item_x0020_Type != undefined && item?.CreatedItem[0]?.data?.Item_x0020_Type === 'SubComponent')
        item.CreatedItem[0].data.SiteIconTitle = 'S';// item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
      if (item.CreatedItem[0].data.Item_x0020_Type != undefined && item.CreatedItem[0].data.Item_x0020_Type === 'Feature')
        item.CreatedItem[0].data.SiteIconTitle = 'F';// item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';

      // item.data['SiteIcon'] = GetIconImageUrl(item.data.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
      item.CreatedItem[0].data['Shareweb_x0020_ID'] = item?.CreatedItem[0]?.data?.PortfolioStructureID;

      // if (checkedList != undefined && checkedList.length > 0)
      //     checkedList[0].subRows.unshift(item.data);
      // else 
      AllItems.unshift(item.CreatedItem[0].data);
      setData((AllItems) => [...AllItems]);
      refreshData()
      rerender()

    }
    setAddModalOpen(false)
  }, []);





  const CreateOpenCall = React.useCallback((item) => {
    // setSharewebComponent(item);
  }, []);

  var myarray: any = [];
  var myarray1: any = [];
  var myarray2: any = [];
  if (props.Sitestagging != null) {
    myarray.push(JSON.parse(props.Sitestagging));
  }
  if (myarray.length != 0) {
    myarray[0].map((items: any) => {
      if (items.SiteImages != undefined && items.SiteImages != "") {
        items.SiteImages = items.SiteImages.replace(
          "https://www.hochhuth-consulting.de",
          GlobalConstants.MAIN_SITE_URL
        );
        myarray1.push(items);
      }

    });
    if (props?.ClientCategory?.results?.length != 0) {
      props?.ClientCategory?.results.map((terms: any) => {

        myarray2.push(terms);
      });
    }

  }

  // Add activity popup array
  const closeTaskStatusUpdatePoup2 = () => {
    setRowSelection({})
    setActivityPopup(false);
    // childsData =[]
    MeetingItems = [];
    childsData = [];

    // setMeetingItems([])
  };
  const CreateMeetingPopups = (item: any) => {
    setMeetingPopup(true);
    MeetingItems[0]["NoteCall"] = item;
  };
  const openActivity = () => {
    if (MeetingItems.length == 0 && childsData.length == 0) {
      MeetingItems.push(props);
    }
    if (MeetingItems.length > 1) {
      alert(
        "More than 1 Parents selected, Select only 1 Parent to create a child item"
      );
    } else {
      if (MeetingItems[0] != undefined) {
        let parentcat: any = [];

        if (items != undefined && items.length > 0) {
          MeetingItems[0].ClientCategory = [];
          items.forEach((val: any) => {
            MeetingItems[0].ClientCategory.push(val);
          });
        }
        if (MeetingItems[0].SharewebTaskType != undefined) {

          if (MeetingItems[0].SharewebTaskType.Title == "Activities") {
            setWSPopup(true);
          }
        }

        if (
          MeetingItems != undefined &&
          MeetingItems[0].SharewebTaskType?.Title == "Workstream"

        ) {
          setActivityPopup(true);
        }

        if (
          MeetingItems[0].SharewebTaskType == undefined &&
          childsData[0] == undefined
        ) {
          setActivityPopup(true);
        }
      }
    }

    if (
      childsData[0] != undefined &&
      childsData[0].SharewebTaskType != undefined
    ) {
      let parentcat: any = [];
      MeetingItems.push(childsData[0]);
      if (childsData[0].SharewebTaskType.Title == "Activities") {
        setWSPopup(true);
      }
      if (
        childsData[0] != undefined &&
        childsData[0].SharewebTaskType.Title == "Workstream"
      ) {
        childsData[0].ClientTime = JSON.parse(childsData[0].ClientTime)
        MeetingItems.push(childsData[0]);
        //setActivityPopup(true)

        childsData[0].NoteCall = "Task";
        setMeetingPopup(true);



      }
    }
  };

  const topRestructureClose = () => {
    setComponentRestruct(false);
    setTopCompoIcon(false)
  }


  const makeTopComp = async () => {
    let PortfolioStructureIDs: any = "";
    let ItemTitle: any = '';
    let ChengedItemTitle: any = "";
    let siteIcon: any = '';
    let PortfolioLevelNum: any = 0;
    let SharewebTaskLevel1No: number = 0;
    let Shareweb_x0020_ID: any;
    let parentId: any;
    AllItems = [];


    if (RestructureChecked[0]?.Item_x0020_Type !== "Task") {
      maidataBackup.map((obj: any) => {
        if (obj.Item_x0020_Type === RestructureChecked[0]?.Item_x0020_Type) {
          if (PortfolioLevelNum <= obj.PortfolioLevel) {
            PortfolioLevelNum = obj.PortfolioLevel + 1;
            siteIcon = RestructureChecked[0]?.siteIcon;
            parentId = Iconssc[0].Id;
            if (RestructureChecked[0]?.Item_x0020_Type === "SubComponent") {
              PortfolioStructureIDs = Iconssc[0]?.PortfolioStructureID + "-" + "S" + PortfolioLevelNum;
              ChengedItemTitle = "SubComponent";
            } else {
              PortfolioStructureIDs = Iconssc[0]?.PortfolioStructureID + "-" + "F" + PortfolioLevelNum;
              ChengedItemTitle = "Feature";
            }
          }
        } else {
          if (RestructureChecked[0]?.Item_x0020_Type === "SubComponent") {
            PortfolioLevelNum = 1;
            siteIcon = RestructureChecked[0]?.siteIcon;
            parentId = Iconssc[0].Id;
            PortfolioStructureIDs = Iconssc[0]?.PortfolioStructureID + "-" + "S" + PortfolioLevelNum;
            ChengedItemTitle = "SubComponent";
          } else {
            PortfolioLevelNum = 1;
            siteIcon = RestructureChecked[0]?.siteIcon;
            parentId = Iconssc[0].Id;
            PortfolioStructureIDs = Iconssc[0]?.PortfolioStructureID + "-" + "F" + PortfolioLevelNum;
            ChengedItemTitle = "Feature";
          }
        }
      })
    } else {
      maidataBackup.map((obj: any) => {
        if (obj.SharewebTaskType?.Title === "Activities") {
          if (SharewebTaskLevel1No <= obj.SharewebTaskLevel1No) {
            SharewebTaskLevel1No = obj.SharewebTaskLevel1No + 1;
            parentId = Iconssc[0].Id;
            PortfolioStructureIDs = obj.PortfolioStructureID;
            Shareweb_x0020_ID = 'SA' + SharewebTaskLevel1No;
          }
        }
      })
    }


    if (ChengedItemTitle != undefined && ChengedItemTitle != "" && (RestructureChecked[0].Item_x0020_Type == "SubComponent" || RestructureChecked[0].Item_x0020_Type == "Feature")) {
      let web = new Web(NextProp.siteUrl);
      var postData: any = {
        Item_x0020_Type: ChengedItemTitle,
        PortfolioStructureID: PortfolioStructureIDs,
        PortfolioLevel: PortfolioLevelNum,
        Shareweb_x0020_ID: PortfolioStructureIDs,
        ParentId: parentId

      };

      await web.lists
        .getById(NextProp.MasterTaskListID)
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
            items.Shareweb_x0020_ID = postData.PortfolioStructureID,
              items.SiteIconTitle = siteIcon,
              items.Parent = { Id: Iconssc[0].Id, Title: Iconssc[0].Title }
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
                  checkUpdate = 2;
                }
                if (sub?.subRows != undefined && sub?.subRows.length > 0) {
                  sub?.subRows?.map((newsub: any, newsubIndex: any) => {
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate == 1) {
                      array[index]?.subRows[subIndex]?.subRows.splice(newsubIndex, 1);
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
          setComponentRestruct(false);
          setTopCompoIcon(false)
          AllItems = AllItems?.concat(array);
          setData((AllItems) => [...AllItems]);
          refreshData();
          rerender();


        });
    }

    if (RestructureChecked[0].Item_x0020_Type === "Task") {
      let web = new Web(NextProp.siteUrl);
      var postData: any = {
        SharewebTaskTypeId: taskTypeId[0].Id,
        SharewebTaskLevel1No: SharewebTaskLevel1No,
        Shareweb_x0020_ID: Shareweb_x0020_ID,
        ServicesId: checkedList[0].Services?.length > 0
          ? { results: [parentId] }
          : { results: [] },
        ComponentId: checkedList[0].Component?.length > 0
          ? { results: [parentId] }
          : { results: [] },
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
              items.Shareweb_x0020_ID = postData.Shareweb_x0020_ID,
              items.ParentTask = { Id: null, Title: null, Shareweb_x0020_ID: null },
              items.SharewebTaskLevel1No = postData.SharewebTaskLevel1No
            items.SharewebTaskType = { Id: taskTypeId[0].Id, Level: taskTypeId[0].Level, Title: taskTypeId[0].Title }
          })



          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
              obj.subRows.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj.subRows != undefined && obj.subRows.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                  sub.subRows.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                      newsub.subRows.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }

                    if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                      newsub.subRows.forEach((activity: any, activityIndex: any) => {
                        activity.isRestructureActive = false;
                        if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                          activity.subRows.push(...latestCheckedList);
                          checkUpdate = checkUpdate + 1;
                        }
                        if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                          array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                          checkUpdate = checkUpdate + 1;
                        }

                        if (activity.subRows != undefined && activity.subRows.length > 0) {
                          activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                            workstream.isRestructureActive = false;
                            if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                              workstream.subRows.push(...latestCheckedList);
                              checkUpdate = checkUpdate + 1;
                            }
                            if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                              array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                              checkUpdate = checkUpdate + 1;
                            }

                            if (activity.subRows != undefined && activity.subRows.length > 0) {
                              activity.subRows.forEach((task: any, taskIndex: any) => {
                                task.isRestructureActive = false;
                                if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                                  task.subRows.push(...latestCheckedList);
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                                  array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex]?.subRows.splice(taskIndex, 1);
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
          setComponentRestruct(false);
          setTopCompoIcon(false)
          AllItems = AllItems?.concat(array);
          setData((AllItems) => [...AllItems]);
          refreshData();
          rerender();


        });
    }


  }


  const buttonRestructuring = () => {

    var ArrayTest: any = [];
    if (
      checkedList.length > 0 &&
      checkedList[0].subRows != undefined &&
      checkedList[0].subRows.length > 0 &&
      checkedList[0].Item_x0020_Type === "Component"
    )
      alert("You are not allowed to Restructure this item.");

    if (checkedList.length > 0) {
      checkedList.map((items: any) => {
        if (items.subRows != undefined &&
          items.subRows.length === 0 &&
          items.Item_x0020_Type === "Component") {
          let newObj: any = {};
          let newarrays: any = [];
          maidataBackup.forEach((obj) => {
            if (items?.Id !== obj.Id && obj.SharewebTaskType?.Title !== "Task" && obj.SharewebTaskType?.Title !== "Activities") {
              newarrays.push(obj);
              // setCheckSubsubRows(obj);
              // setRestructuredItemarray(newarrays);
              obj.isRestructureActive = true;
            } else {
              newObj = { Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon };
              ArrayTest.push(newObj)
              setRestructureChecked(ArrayTest);
            }
            if (obj.subRows != undefined && obj.subRows.length > 0) {
              obj.subRows.forEach((sub: any) => {
                if (sub.Item_x0020_Type === "SubComponent" && sub.SharewebTaskType?.Title !== "Task" && sub.SharewebTaskType?.Title !== "Activities") {
                  sub.isRestructureActive = true;
                }
              });
            }
          });
        } else if (items.Item_x0020_Type === "SubComponent") {
          let newObj: any = {}
          maidataBackup.forEach((obj) => {
            let newChildarray: any = [];
            let newarrays: any = [];
            if (obj.Id === items?.Id && obj.Item_x0020_Type === "SubComponent") {
              newarrays.push(obj);
              // setCheckSubsubRows(sub);
              // setRestructuredItemarray(newarrays);

              newObj = { Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType, };
              newChildarray.push(newObj)
              setRestructureChecked(newChildarray);
              ArrayTest.push(newObj);
              obj.isRestructureActive = false;
            } else {
              if (items?.Item_x0020_Type === "SubComponent" && items?.subRows[0]?.Item_x0020_Type !== "Feature" && obj?.Item_x0020_Type === "SubComponent" && obj.SharewebTaskType?.Title !== "Task" && obj.SharewebTaskType?.Title !== "Activities") {
                obj.isRestructureActive = true;
                setComponentRestruct(true);
              }
            }
          });
        } else if (items.Item_x0020_Type === "Feature") {
          let newObj: any = {}
          maidataBackup.forEach((obj) => {
            let newarrays: any = [];
            let newChildarray: any = [];
            if (obj.SharewebTaskType?.Title !== "Task" && obj.SharewebTaskType?.Title !== "Activities" && obj.Item_x0020_Type === "SubComponent") {
              obj.isRestructureActive = true;
            }
            setComponentRestruct(true);
            if (obj.Item_x0020_Type === "SubComponent") {
              obj.isRestructureActive = true;
            }
            if (obj.Id === items?.Id) {
              newarrays.push(obj);
              // setCheckSubsubRows(sub);
              obj.isRestructureActive = false;
              // setRestructuredItemarray(newarrays);
              newObj = { Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType, };
              setComponentRestruct(true);
              newChildarray.push(newObj)
              setRestructureChecked(newChildarray);
              ArrayTest.push(newObj);
            }

            if (obj.subRows != undefined && obj.subRows.length > 0) {
              let newarrays: any = [];
              let newChildarray: any = [];
              obj.subRows.forEach((sub: any) => {
                setComponentRestruct(true);
                if (sub.Item_x0020_Type === "SubComponent") {
                  sub.isRestructureActive = true;
                }
                if (sub.Id === items?.Id) {
                  newarrays.push(obj);
                  // setCheckSubsubRows(sub);
                  sub.isRestructureActive = false;
                  obj.isRestructureActive = false;
                  // setRestructuredItemarray(newarrays);
                  newObj = {
                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                    newChild: {
                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                    }
                  };
                  setComponentRestruct(true);
                  newChildarray.push(newObj.newChild)
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj);
                }
              });
            }
          });
        } else if (items.SharewebTaskType?.Title === "Activities" && items.Item_x0020_Type === "Task") {
          let newObj: any = {}
          maidataBackup.forEach((obj) => {
            let newChildarray: any = [];
            let newarrays: any = [];
            if (obj.SharewebTaskType?.Title !== "Task" && obj?.Id == items?.Id && obj?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
              newObj = {
                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
              }
              newarrays.push(obj);
              obj.isRestructureActive = false;
              // setRestructuredItemarray(newarrays);
              newChildarray.push(newObj);
              setRestructureChecked(newChildarray);
              ArrayTest.push(newObj);
            }
            if (obj.SharewebTaskType?.Title !== "Task" && obj?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && obj?.Id !== items?.Id) {
              obj.isRestructureActive = true
            }
            if ((obj.SharewebTaskType?.Title == "Activities" || obj.SharewebTaskType?.Title == "Workstream") && items?.subRows.length > 0) {
              obj.isRestructureActive = false;
            }
            if (obj.siteType != items?.siteType && (obj.SharewebTaskType?.Title == "Activities" || obj.SharewebTaskType?.Title == "Workstream")) {
              obj.isRestructureActive = false;
            }
            if (obj?.subRows != undefined && obj?.subRows?.length > 0) {
              obj.subRows.forEach((sub: any) => {
                let newChildarray: any = [];
                let newarrays: any = [];
                if (sub.SharewebTaskType?.Title !== "Task" && sub?.Id == items?.Id && sub?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                  newObj = {
                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                    newChild: {
                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                    }
                  }
                  newarrays.push(obj);
                  if (items?.subRows.length > 0) {
                    obj.isRestructureActive = false;
                  }

                  sub.isRestructureActive = false;
                  //  setRestructuredItemarray(newarrays);
                  newChildarray.push(newObj?.newChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj);
                }
                if (sub.SharewebTaskType?.Title !== "Task" && sub?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && sub?.Id !== items?.Id) {
                  sub.isRestructureActive = true
                }
                if ((sub.SharewebTaskType?.Title == "Activities" || sub.SharewebTaskType?.Title == "Workstream") && items?.subRows.length > 0) {
                  sub.isRestructureActive = false;
                }
                if (sub.siteType != items?.siteType && (sub.SharewebTaskType?.Title == "Activities" || sub.SharewebTaskType?.Title == "Workstream")) {
                  sub.isRestructureActive = false;
                }
                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    setComponentRestruct(true);
                    if (newsub.SharewebTaskType?.Title !== "Task" && newsub?.Id == items?.Id && newsub?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                      newarrays.push(obj);
                      // setRestructuredItemarray(newarrays);
                      newObj = {
                        Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                        newChild: {
                          Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                          newFchild: {
                            Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType,
                          }
                        }
                      }
                      if (items?.subRows.length > 0) {
                        sub.isRestructureActive = false;
                      }
                      newsub.isRestructureActive = false;
                      newChildarray.push(newObj?.newChild?.newFchild)
                      setRestructureChecked(newChildarray);
                      ArrayTest.push(newObj);
                    }
                    if (newsub.SharewebTaskType?.Title !== "Task" && newsub?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && newsub?.Id !== items?.Id) {
                      newsub.isRestructureActive = true
                    }
                    if ((newsub.SharewebTaskType?.Title == "Activities" || newsub.SharewebTaskType?.Title == "Workstream") && items?.subRows.length > 0) {
                      newsub.isRestructureActive = false;
                    }

                    if (newsub.siteType != items?.siteType && (newsub.SharewebTaskType?.Title == "Activities" || newsub.SharewebTaskType?.Title == "Workstream")) {
                      newsub.isRestructureActive = false;
                    }
                    if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                      let newChildarray: any = [];
                      let newarrays: any = [];
                      newsub.subRows.forEach((activity: any) => {
                        if (activity.SharewebTaskType?.Title !== "Task" && activity?.Id == items?.Id && activity?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                          newarrays.push(obj);
                          // setRestructuredItemarray(newarrays);
                          if (items?.subRows.length > 0) {
                            newsub.isRestructureActive = false;
                          }
                          activity.isRestructureActive = false;

                          newObj = {
                            Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                            newChild: {
                              Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                              newFchild: {
                                Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType,
                                newActChild: { Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, SharewebTaskType: activity.SharewebTaskType }
                              }
                            }
                          };
                          newChildarray.push(newObj?.newChild?.newFchild?.newActChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj);
                        }
                        if (activity.SharewebTaskType?.Title !== "Task" && activity.SharewebTaskType?.Title !== "Task" && activity?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && activity?.Id !== items?.Id) {
                          activity.isRestructureActive = true;
                        }

                        if ((activity.SharewebTaskType?.Title == "Activities" || activity.SharewebTaskType?.Title == "Workstream") && items?.subRows.length > 0) {
                          activity.isRestructureActive = false;
                        }
                        if (activity.siteType != items?.siteType && (activity.SharewebTaskType?.Title == "Activities" || activity.SharewebTaskType?.Title == "Workstream")) {
                          activity.isRestructureActive = false;
                        }
                      })
                    }
                  });
                }
              });
            }
          });
        } else if (items.SharewebTaskType?.Title === "Workstream" && items.Item_x0020_Type === "Task") {


          let newObj: any = {}
          maidataBackup.forEach((obj) => {
            let newChildarray: any = [];
            let newarrays: any = [];
            if (obj.SharewebTaskType?.Title !== "Task" && obj?.Id == items?.Id && obj?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
              newObj = {
                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
              }
              newarrays.push(obj);
              obj.isRestructureActive = false;
              // setRestructuredItemarray(newarrays);
              newChildarray.push(newObj);
              setRestructureChecked(newChildarray);
              ArrayTest.push(newObj);
            }
            if (obj.SharewebTaskType?.Title !== "Task" && obj?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && obj?.Id !== items?.Id) {
              obj.isRestructureActive = true
            }
            if (obj.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
              obj.isRestructureActive = false;
            }
            if (obj.siteType != items?.siteType && (obj.SharewebTaskType?.Title == "Activities" || obj.SharewebTaskType?.Title == "Workstream")) {
              obj.isRestructureActive = false;
            }
            if (obj?.subRows != undefined && obj?.subRows?.length > 0) {
              obj.subRows.forEach((sub: any) => {
                let newChildarray: any = [];
                let newarrays: any = [];
                if (sub.SharewebTaskType?.Title !== "Task" && sub?.Id == items?.Id && sub?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                  newObj = {
                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                    newChild: {
                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                    }
                  }
                  newarrays.push(obj);
                  if (items?.subRows.length > 0) {
                    obj.isRestructureActive = false;
                  }

                  sub.isRestructureActive = false;
                  //  setRestructuredItemarray(newarrays);
                  newChildarray.push(newObj?.newChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj);
                }
                if (sub.SharewebTaskType?.Title !== "Task" && sub?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && sub?.Id !== items?.Id) {
                  sub.isRestructureActive = true
                }
                if (sub.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
                  sub.isRestructureActive = false;
                }
                if (sub.siteType != items?.siteType && (sub.SharewebTaskType?.Title == "Activities" || sub.SharewebTaskType?.Title == "Workstream")) {
                  sub.isRestructureActive = false;
                }
                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    setComponentRestruct(true);
                    if (newsub.SharewebTaskType?.Title !== "Task" && newsub?.Id == items?.Id && newsub?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                      newarrays.push(obj);
                      // setRestructuredItemarray(newarrays);
                      newObj = {
                        Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                        newChild: {
                          Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                          newFchild: {
                            Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType,
                          }
                        }
                      }
                      if (items?.subRows.length > 0) {
                        sub.isRestructureActive = false;
                      }
                      newsub.isRestructureActive = false;
                      newChildarray.push(newObj?.newChild?.newFchild)
                      setRestructureChecked(newChildarray);
                      ArrayTest.push(newObj);
                    }
                    if (newsub.SharewebTaskType?.Title !== "Task" && newsub?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && newsub?.Id !== items?.Id) {
                      newsub.isRestructureActive = true
                    }
                    if (newsub.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
                      newsub.isRestructureActive = false;
                    }
                    if (newsub.siteType != items?.siteType && (newsub.SharewebTaskType?.Title == "Activities" || newsub.SharewebTaskType?.Title == "Workstream")) {
                      newsub.isRestructureActive = false;
                    }
                    if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                      let newChildarray: any = [];
                      let newarrays: any = [];
                      newsub.subRows.forEach((activity: any) => {
                        if (activity.SharewebTaskType?.Title !== "Task" && activity?.Id == items?.Id && activity?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                          newarrays.push(obj);
                          // setRestructuredItemarray(newarrays);
                          if (items?.subRows.length > 0) {
                            newsub.isRestructureActive = false;
                          }
                          activity.isRestructureActive = false;

                          newObj = {
                            Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                            newChild: {
                              Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                              newFchild: {
                                Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType,
                                newActChild: { Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, SharewebTaskType: activity.SharewebTaskType }
                              }
                            }
                          };
                          newChildarray.push(newObj?.newChild?.newFchild?.newActChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj);
                        }
                        if (activity.SharewebTaskType?.Title !== "Task" && activity.SharewebTaskType?.Title !== "Task" && activity?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && activity?.Id !== items?.Id) {
                          activity.isRestructureActive = true;
                        }

                        if (activity.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
                          activity.isRestructureActive = false;
                        }
                        if (activity.siteType != items?.siteType && (activity.SharewebTaskType?.Title == "Activities" || activity.SharewebTaskType?.Title == "Workstream")) {
                          activity.isRestructureActive = false;
                        }
                        if (activity.subRows != undefined && activity.subRows.length > 0) {
                          let newChildarray: any = [];
                          let newarrays: any = [];
                          activity.subRows.forEach((wrkstrm: any) => {
                            if (wrkstrm.SharewebTaskType?.Title !== "Task" && wrkstrm?.Id == items?.Id && wrkstrm?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                              newarrays.push(obj);
                              // setRestructuredItemarray(newarrays);
                              if (items?.subRows.length > 0) {
                                activity.isRestructureActive = false;
                              }
                              wrkstrm.isRestructureActive = false;

                              newObj = {
                                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                                newChild: {
                                  Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                                  newFchild: {
                                    Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType,
                                    newActChild: {
                                      Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, SharewebTaskType: activity.SharewebTaskType,
                                      newWrkChild: { Title: wrkstrm.Title, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, SharewebTaskType: wrkstrm.SharewebTaskType, }
                                    }
                                  }
                                }
                              };
                              newChildarray.push(newObj?.newChild?.newFchild?.newActChild?.newWrkChild);
                              setRestructureChecked(newChildarray);
                              ArrayTest.push(newObj);
                            }
                            if (wrkstrm.SharewebTaskType?.Title !== "Task" && wrkstrm.SharewebTaskType?.Title !== "Task" && wrkstrm?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && wrkstrm?.Id !== items?.Id) {
                              wrkstrm.isRestructureActive = true;
                            }

                            if (wrkstrm.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
                              wrkstrm.isRestructureActive = false;
                            }
                            if (wrkstrm.siteType != items?.siteType && (wrkstrm.SharewebTaskType?.Title == "Activities" || wrkstrm.SharewebTaskType?.Title == "Workstream")) {
                              wrkstrm.isRestructureActive = false;
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
        } else if (items.SharewebTaskType?.Title === "Task" && items.Item_x0020_Type === "Task") {


          let newObj: any = {}
          maidataBackup.forEach((obj) => {
            let newChildarray: any = [];
            let newarrays: any = [];
            if (obj.SharewebTaskType?.Title == "Task" && obj?.Id == items?.Id && obj?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
              newObj = {
                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
              }
              newarrays.push(obj);
              obj.isRestructureActive = false;
              // setRestructuredItemarray(newarrays);
              newChildarray.push(newObj);
              setRestructureChecked(newChildarray);
              ArrayTest.push(newObj);
            }
            if (obj.SharewebTaskType?.Title !== "Task" && obj?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && obj?.Id !== items?.Id) {
              obj.isRestructureActive = true
            }
            if (obj.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
              obj.isRestructureActive = false;
            }
            if (obj.siteType != items?.siteType && obj.SharewebTaskType?.Title == "Workstream") {
              obj.isRestructureActive = false;
            }
            if (obj?.subRows != undefined && obj?.subRows?.length > 0) {
              obj.subRows.forEach((sub: any) => {
                let newChildarray: any = [];
                let newarrays: any = [];
                if (sub.SharewebTaskType?.Title == "Task" && sub?.Id == items?.Id && sub?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                  newObj = {
                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                    newChild: {
                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                    }
                  }
                  newarrays.push(obj);
                  if (obj?.SharewebTaskType?.Title == "Workstream") {
                    obj.isRestructureActive = false;
                  }

                  sub.isRestructureActive = false;
                  //  setRestructuredItemarray(newarrays);
                  newChildarray.push(newObj?.newChild);
                  setRestructureChecked(newChildarray);
                  ArrayTest.push(newObj);
                }
                if (sub.SharewebTaskType?.Title !== "Task" && sub?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && sub?.Id !== items?.Id) {
                  sub.isRestructureActive = true
                }
                if (sub.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
                  sub.isRestructureActive = false;
                }
                if (sub.siteType != items?.siteType && sub.SharewebTaskType?.Title == "Workstream") {
                  sub.isRestructureActive = false;
                }
                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any) => {
                    let newChildarray: any = [];
                    let newarrays: any = [];
                    setComponentRestruct(true);
                    if (newsub.SharewebTaskType?.Title == "Task" && newsub?.Id == items?.Id && newsub?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                      newarrays.push(obj);
                      // setRestructuredItemarray(newarrays);
                      newObj = {
                        Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                        newChild: {
                          Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                          newFchild: {
                            Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType,
                          }
                        }
                      }
                      if (sub?.SharewebTaskType?.Title == "Workstream") {
                        sub.isRestructureActive = false;
                      }
                      newsub.isRestructureActive = false;
                      newChildarray.push(newObj?.newChild?.newFchild)
                      setRestructureChecked(newChildarray);
                      ArrayTest.push(newObj);
                    }
                    if (newsub.SharewebTaskType?.Title !== "Task" && newsub?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && newsub?.Id !== items?.Id) {
                      newsub.isRestructureActive = true
                    }
                    if (newsub.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
                      newsub.isRestructureActive = false;
                    }
                    if (newsub.siteType != items?.siteType && newsub.SharewebTaskType?.Title == "Workstream") {
                      newsub.isRestructureActive = false;
                    }
                    if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                      let newChildarray: any = [];
                      let newarrays: any = [];
                      newsub.subRows.forEach((activity: any) => {
                        if (activity.SharewebTaskType?.Title == "Task" && activity?.Id == items?.Id && activity?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                          newarrays.push(obj);
                          // setRestructuredItemarray(newarrays);
                          if (newsub?.SharewebTaskType?.Title == "Workstream") {
                            newsub.isRestructureActive = false;
                          }
                          activity.isRestructureActive = false;

                          newObj = {
                            Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                            newChild: {
                              Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                              newFchild: {
                                Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType,
                                newActChild: { Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, SharewebTaskType: activity.SharewebTaskType }
                              }
                            }
                          };
                          newChildarray.push(newObj?.newChild?.newFchild?.newActChild)
                          setRestructureChecked(newChildarray);
                          ArrayTest.push(newObj);
                        }
                        if (activity.SharewebTaskType?.Title !== "Task" && activity.SharewebTaskType?.Title !== "Task" && activity?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && activity?.Id !== items?.Id) {
                          activity.isRestructureActive = true;
                        }

                        if (activity.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
                          activity.isRestructureActive = false;
                        }
                        if (activity.siteType != items?.siteType && activity.SharewebTaskType?.Title == "Workstream") {
                          activity.isRestructureActive = false;
                        }
                        if (activity.subRows != undefined && activity.subRows.length > 0) {
                          let newChildarray: any = [];
                          let newarrays: any = [];
                          activity.subRows.forEach((wrkstrm: any) => {
                            if (wrkstrm.SharewebTaskType?.Title == "Task" && wrkstrm?.Id == items?.Id && wrkstrm?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                              newarrays.push(obj);
                              // setRestructuredItemarray(newarrays);
                              if (activity?.SharewebTaskType?.Title == "Workstream") {
                                activity.isRestructureActive = false;
                              }
                              wrkstrm.isRestructureActive = false;

                              newObj = {
                                Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                                newChild: {
                                  Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                                  newFchild: {
                                    Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType,
                                    newActChild: {
                                      Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, SharewebTaskType: activity.SharewebTaskType,
                                      newWrkChild: { Title: wrkstrm.Title, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, SharewebTaskType: wrkstrm.SharewebTaskType, }
                                    }
                                  }
                                }
                              };
                              newChildarray.push(newObj?.newChild?.newFchild?.newActChild?.newWrkChild);
                              setRestructureChecked(newChildarray);
                              ArrayTest.push(newObj);
                            }
                            if (wrkstrm.SharewebTaskType?.Title !== "Task" && wrkstrm.SharewebTaskType?.Title !== "Task" && wrkstrm?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && wrkstrm?.Id !== items?.Id) {
                              wrkstrm.isRestructureActive = true;
                            }

                            if (wrkstrm.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
                              wrkstrm.isRestructureActive = false;
                            }
                            if (wrkstrm.siteType != items?.siteType && wrkstrm.SharewebTaskType?.Title == "Workstream") {
                              wrkstrm.isRestructureActive = false;
                            }

                            if (wrkstrm.subRows != undefined && wrkstrm.subRows.length > 0) {
                              let newChildarray: any = [];
                              let newarrays: any = [];
                              wrkstrm.subRows.forEach((task: any) => {
                                if (task.SharewebTaskType?.Title == "Task" && task?.Id == items?.Id && task?.Shareweb_x0020_ID == items?.Shareweb_x0020_ID) {
                                  newarrays.push(obj);
                                  // setRestructuredItemarray(newarrays);
                                  if (wrkstrm.SharewebTaskType?.Title == "Workstream") {
                                    wrkstrm.isRestructureActive = false;
                                  }
                                  task.isRestructureActive = false;

                                  newObj = {
                                    Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType,
                                    newChild: {
                                      Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType,
                                      newFchild: {
                                        Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType,
                                        newActChild: {
                                          Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, SharewebTaskType: activity.SharewebTaskType,
                                          newWrkChild: {
                                            Title: wrkstrm.Title, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, SharewebTaskType: wrkstrm.SharewebTaskType,
                                            newTskChild: { Title: task.Title, Item_x0020_Type: task.Item_x0020_Type, Id: task.Id, siteIcon: task.SiteIcon, SharewebTaskType: task.SharewebTaskType, }
                                          }
                                        }
                                      }
                                    }
                                  };
                                  newChildarray.push(newObj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild);
                                  setRestructureChecked(newChildarray);
                                  ArrayTest.push(newObj);
                                }
                                if (task.SharewebTaskType?.Title !== "Task" && task.SharewebTaskType?.Title !== "Task" && task?.Shareweb_x0020_ID !== items?.Shareweb_x0020_ID && task?.Id !== items?.Id) {
                                  task.isRestructureActive = true;
                                }

                                if (task.SharewebTaskType?.Title == "Workstream" && items?.subRows.length > 0) {
                                  task.isRestructureActive = false;
                                }
                                if (task.siteType != items?.siteType && task.SharewebTaskType?.Title == "Workstream") {
                                  task.isRestructureActive = false;
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
    setData([...maidataBackup]);

    //  }
    // setAddModalOpen(true)
  };

  const RestruringCloseCall = () => {
    setResturuningOpen(false);
  };
  const OpenModal = (item: any) => {


    var TestArray: any = [];
    setResturuningOpen(true);
    setNewItemBackUp(item);
    maidataBackup.forEach((obj) => {
      let object: any = {};
      if (obj.Shareweb_x0020_ID === item.Shareweb_x0020_ID && obj.Id === item.Id && obj.SharewebTaskType?.Title === item.SharewebTaskType?.Title) {
        object = { Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType == undefined ? null : { Title: obj.SharewebTaskType.Title, Id: obj.SharewebTaskType.Id } };
        TestArray.push(object);
      }
      if (obj.subRows != undefined && obj.subRows.length > 0) {
        obj.subRows.forEach((sub: any) => {
          if (sub.Shareweb_x0020_ID === item.Shareweb_x0020_ID && sub.Id === item.Id && sub.SharewebTaskType?.Title === item.SharewebTaskType?.Title) {
            object = {
              Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType == undefined ? null : { Title: obj.SharewebTaskType.Title, Id: obj.SharewebTaskType.Id },
              newChild: { Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType == undefined ? null : { Title: sub.SharewebTaskType.Title, Id: sub.SharewebTaskType.Id }, }
            }
            TestArray.push(object)
          }
          if (sub.subRows != undefined && sub.subRows.length > 0) {
            sub.subRows.forEach((newsub: any) => {
              if (newsub.Shareweb_x0020_ID === item.Shareweb_x0020_ID && newsub.Id === item.Id && newsub.SharewebTaskType?.Title === item.SharewebTaskType?.Title) {
                object = {
                  Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType == undefined ? null : { Title: obj.SharewebTaskType.Title, Id: obj.SharewebTaskType.Id },
                  newChild: {
                    Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType == undefined ? null : { Title: sub.SharewebTaskType.Title, Id: sub.SharewebTaskType.Id },
                    newFchild: { Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType == undefined ? null : { Title: newsub.SharewebTaskType.Title, Id: newsub.SharewebTaskType.Id } }
                  }
                }
                TestArray.push(object)
              }
              if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                newsub.subRows.forEach((activity: any) => {
                  if (activity.Shareweb_x0020_ID === item.Shareweb_x0020_ID && activity.Id === item.Id && activity.SharewebTaskType?.Title === item.SharewebTaskType?.Title) {
                    object = {
                      Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType == undefined ? null : { Title: obj.SharewebTaskType.Title, Id: obj.SharewebTaskType.Id },
                      newChild: {
                        Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType == undefined ? null : { Title: sub.SharewebTaskType.Title, Id: sub.SharewebTaskType.Id },
                        newFchild: {
                          Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType == undefined ? null : { Title: newsub.SharewebTaskType.Title, Id: newsub.SharewebTaskType.Id },
                          newActChild: { Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, SharewebTaskType: activity.SharewebTaskType == undefined ? null : { Title: activity.SharewebTaskType.Title, Id: activity.SharewebTaskType.Id }, }
                        }
                      }
                    }
                    TestArray.push(object)
                  }
                  if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                    activity.subRows.forEach((wrkstrm: any) => {
                      if (wrkstrm.Shareweb_x0020_ID === item.Shareweb_x0020_ID && wrkstrm.Id === item.Id && wrkstrm.SharewebTaskType?.Title === item.SharewebTaskType?.Title) {
                        object = {
                          Title: obj.Title, Item_x0020_Type: obj.Item_x0020_Type, Id: obj.Id, siteIcon: obj.SiteIcon, SharewebTaskType: obj.SharewebTaskType == undefined ? null : { Title: obj.SharewebTaskType.Title, Id: obj.SharewebTaskType.Id },
                          newChild: {
                            Title: sub.Title, Item_x0020_Type: sub.Item_x0020_Type, Id: sub.Id, siteIcon: sub.SiteIcon, SharewebTaskType: sub.SharewebTaskType == undefined ? null : { Title: sub.SharewebTaskType.Title, Id: sub.SharewebTaskType.Id },
                            newFchild: {
                              Title: newsub.Title, Item_x0020_Type: newsub.Item_x0020_Type, Id: newsub.Id, siteIcon: newsub.SiteIcon, SharewebTaskType: newsub.SharewebTaskType == undefined ? null : { Title: newsub.SharewebTaskType.Title, Id: newsub.SharewebTaskType.Id },
                              newActChild: {
                                Title: activity.Title, Item_x0020_Type: activity.Item_x0020_Type, Id: activity.Id, siteIcon: activity.SiteIcon, SharewebTaskType: activity.SharewebTaskType == undefined ? null : { Title: activity.SharewebTaskType.Title, Id: activity.SharewebTaskType.Id },
                                newWrkChild: { Title: wrkstrm.Title, Item_x0020_Type: wrkstrm.Item_x0020_Type, Id: wrkstrm.Id, siteIcon: wrkstrm.SiteIcon, SharewebTaskType: wrkstrm.SharewebTaskType == undefined ? null : { Title: wrkstrm.SharewebTaskType.Title, Id: wrkstrm.SharewebTaskType.Id }, }
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




  var PortfolioLevelNum: any = 0;
  const setRestructure = (item: any, title: any) => {


    let array: any = [];
    let data: any = []
    item?.map((items: any) => {
      if (items != undefined && title === "SubComponent") {
        data.push({ Id: items.Id, Item_x0020_Type: "SubComponent", SharewebTaskType: items.SharewebTaskType, Title: items.Title, siteIcon: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png" })
      }
      if (items != undefined && title === "Feature") {
        data.push({ Id: items.Id, Item_x0020_Type: "Feature", SharewebTaskType: items.SharewebTaskType, Title: items.Title, siteIcon: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png" })
      }
      if (items != undefined && title === "Workstream") {
        data.push({ Id: items.Id, Item_x0020_Type: "Task", SharewebTaskType: { Title: "Workstream", Id: items.SharewebTaskType.Id }, Title: items.Title, siteIcon: items.siteIcon })
      }
      if (items != undefined && title === "Task") {
        data.push({ Id: items.Id, Item_x0020_Type: "Task", SharewebTaskType: { Title: "Task", Id: items.SharewebTaskType.Id }, Title: items.Title, siteIcon: items.siteIcon })
      }
    })
    array.push(...data);
    setRestructureChecked(array)
  };



  const UpdateTaskRestructure = async function () {

    AllItems = [];
    var Ids: any = [];
    Ids = newItemBackUp.Id;
    let Title: any = newItemBackUp.Title;
    let PortfolioStructureID = newItemBackUp.PortfolioStructureID;
    let ServicesId: any = newItemBackUp?.Services[0]?.Id;
    let SharewebTaskType: any = RestructureChecked[0].SharewebTaskType?.Title;
    let Item_x0020_Type = RestructureChecked[0].Item_x0020_Type;
    let Shareweb_x0020_ID: any;
    let ShowTooltipSharewebId: any;
    let siteIcon: any = RestructureChecked[0].Item_x0020_Type;



    if (newItemBackUp?.SharewebTaskType?.Title !== "Activities" && newItemBackUp?.SharewebTaskType?.Title !== "Workstream") {
      let numbers: any;

      if (newItemBackUp.subRows.length > 0) {
        newItemBackUp.subRows.map((items: any) => {
          if (items?.SharewebTaskType?.Title == "Activities") {
            numbers = items?.SharewebTaskLevel1No + 1;
          } else {
            numbers = 1;
          }
        })
      }

      if (newItemBackUp.subRows.length == 0) {
        numbers = 1;
      }


      Shareweb_x0020_ID = `SA${numbers}`
      ShowTooltipSharewebId = newItemBackUp?.PortfolioStructureID + "-" + Shareweb_x0020_ID;

      let web = new Web(NextProp.siteUrl);
      await web.lists
        .getById(checkedList[0].listId)
        .items.getById(checkedList[0].Id)
        .update({
          ServicesId:
            checkedList[0].Services?.length > 0
              ? { results: [Ids] }
              : { results: [] },
          ComponentId:
            checkedList[0].Component?.length > 0
              ? { results: [Ids] }
              : { results: [] },
          ParentTaskId: null,
          SharewebTaskTypeId: taskTypeId[0].Id,
          SharewebTaskLevel1No: numbers,
          Shareweb_x0020_ID: Shareweb_x0020_ID,
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
              items.SharewebTaskLevel1No = numbers,
              items.Shareweb_x0020_ID = Shareweb_x0020_ID,
              items.SharewebTaskType = { Id: taskTypeId[0].Id, Level: taskTypeId[0].Level, Title: taskTypeId[0].Title },
              items.SiteIconTitle = siteIcon,
              items.PortfolioStructureID = PortfolioStructureID,
              items.Item_x0020_Type = Item_x0020_Type

          })

          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
              obj.subRows.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj.subRows != undefined && obj.subRows.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                  sub.subRows.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                      newsub.subRows.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }

                    if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                      newsub.subRows.forEach((activity: any, activityIndex: any) => {
                        activity.isRestructureActive = false;
                        if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                          activity.subRows.push(...latestCheckedList);
                          checkUpdate = checkUpdate + 1;
                        }
                        if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                          array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                          checkUpdate = checkUpdate + 1;
                        }

                        if (activity.subRows != undefined && activity.subRows.length > 0) {
                          activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                            workstream.isRestructureActive = false;
                            if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                              workstream.subRows.push(...latestCheckedList);
                              checkUpdate = checkUpdate + 1;
                            }
                            if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                              array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                              checkUpdate = checkUpdate + 1;
                            }

                            if (activity.subRows != undefined && activity.subRows.length > 0) {
                              activity.subRows.forEach((task: any, taskIndex: any) => {
                                task.isRestructureActive = false;
                                if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                                  task.subRows.push(...latestCheckedList);
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                                  array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex]?.subRows.splice(taskIndex, 1);
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
          AllItems = AllItems?.concat(array);
          setData((AllItems) => [...AllItems]);
          refreshData();
          rerender();


        });
    } else {

      let numbers: any;
      let numbers1: any;
      let SharewebTaskTypeId: any;

      if (newItemBackUp.subRows.length > 0) {
        newItemBackUp.subRows.map((items: any) => {

          if (newItemBackUp?.SharewebTaskType?.Title == "Activities") {
            if (RestructureChecked[0].SharewebTaskType?.Title === 'Activities') {
              if (items?.SharewebTaskType?.Title == "Workstream") {
                numbers1 = items?.SharewebTaskLevel2No + 1;

              } else {
                numbers1 = 1;
              }

            } else {
              if (RestructureChecked[0].SharewebTaskType?.Title === items?.SharewebTaskType?.Title) {
                numbers1 = items?.SharewebTaskLevel2No + 1;
              } else {
                numbers1 = 1;
              }
            }
          } else if (newItemBackUp?.SharewebTaskType?.Title == "Workstream") {
            if (items?.SharewebTaskType?.Title == "Task") {
              numbers1 = items?.SharewebTaskLevel2No + 1;
            }

          } else {
            numbers1 = 1;
          }
        })
      } else {
        numbers1 = 1;
      }


      if (SharewebTaskType === "Activities") {
        SharewebTaskTypeId = taskTypeId[2];
      } else {
        SharewebTaskTypeId = SharewebTaskType === "Task" ? taskTypeId[1] : taskTypeId[2];
      }

      numbers = newItemBackUp.SharewebTaskLevel1No;
      Shareweb_x0020_ID = newItemBackUp.Shareweb_x0020_ID + "-" + `W${numbers1}`
      // ShowTooltipSharewebId =newItemBackUp?.PortfolioStructureID + Shareweb_x0020_ID;


      let web = new Web(NextProp.siteUrl);
      await web.lists
        .getById(checkedList[0].listId)
        .items.getById(checkedList[0].Id)
        .update({
          ServicesId:
            checkedList[0].Services?.length > 0
              ? { results: [Ids] }
              : { results: [] },
          ComponentId:
            checkedList[0].Component?.length > 0
              ? { results: [Ids] }
              : { results: [] },
          Shareweb_x0020_ID: Shareweb_x0020_ID,
          SharewebTaskLevel1No: numbers,
          SharewebTaskLevel2No: numbers1,
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
              items.Parent = { Id: Ids, Shareweb_x0020_ID: Shareweb_x0020_ID, Title: Title },
              items.SharewebTaskLevel1No = numbers,
              items.Shareweb_x0020_ID = Shareweb_x0020_ID,
              items.SharewebTaskLevel2No = numbers1,
              items.SharewebTaskType = { Id: SharewebTaskTypeId.Id, Level: SharewebTaskTypeId.Level, Title: SharewebTaskTypeId.Title },
              items.Item_x0020_Type = Item_x0020_Type
          })

          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
              obj.subRows.push(...latestCheckedList);
              checkUpdate = checkUpdate + 1;
            }
            if (obj.Id === backupCheckedList[0]?.Id && obj.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && obj.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
              array.splice(index, 1);
              checkUpdate = checkUpdate + 1;
            }

            if (obj.subRows != undefined && obj.subRows.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                  sub.subRows.push(...latestCheckedList);
                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && sub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);
                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && newsub.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                      newsub.subRows.push(...latestCheckedList);
                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && newsub.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);
                      checkUpdate = checkUpdate + 1;
                    }

                    if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                      newsub.subRows.forEach((activity: any, activityIndex: any) => {
                        activity.isRestructureActive = false;
                        if (activity.Id === newItemBackUp?.Id && activity.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && activity.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                          activity.subRows.push(...latestCheckedList);
                          checkUpdate = checkUpdate + 1;
                        }
                        if (activity.Id === backupCheckedList[0]?.Id && activity.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && activity.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                          array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows.splice(activityIndex, 1);
                          checkUpdate = checkUpdate + 1;
                        }

                        if (activity.subRows != undefined && activity.subRows.length > 0) {
                          activity.subRows.forEach((workstream: any, workstreamIndex: any) => {
                            workstream.isRestructureActive = false;
                            if (workstream.Id === newItemBackUp?.Id && workstream.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && workstream.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                              workstream.subRows.push(...latestCheckedList);
                              checkUpdate = checkUpdate + 1;
                            }
                            if (workstream.Id === backupCheckedList[0]?.Id && workstream.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && workstream.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                              array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows.splice(workstreamIndex, 1);
                              checkUpdate = checkUpdate + 1;
                            }

                            if (activity.subRows != undefined && activity.subRows.length > 0) {
                              activity.subRows.forEach((task: any, taskIndex: any) => {
                                task.isRestructureActive = false;
                                if (task.Id === newItemBackUp?.Id && task.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && task.SharewebTaskType?.Title === newItemBackUp?.SharewebTaskType?.Title && checkUpdate != 3) {
                                  task.subRows.push(...latestCheckedList);
                                  checkUpdate = checkUpdate + 1;
                                }
                                if (task.Id === backupCheckedList[0]?.Id && task.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && task.SharewebTaskType?.Title === backupCheckedList[0]?.SharewebTaskType?.Title && checkUpdate != 3) {
                                  array[index]?.subRows[indexsub]?.subRows[lastIndex].subRows[activityIndex]?.subRows[workstreamIndex].subRows?.splice(taskIndex, 1);
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
          AllItems = AllItems?.concat(array);
          setData((AllItems) => [...AllItems]);
          refreshData();
          rerender();



        });
    }
  };



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
    AllItems = [];


    ChengedItemTitle = "Feature";
    siteIcon = "F";


    maidataBackup?.forEach((obj) => {
      if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj?.subRows?.length == 0) {
        PortfolioLevelNum = 1;
        ItemId = obj.Id;
        ItemTitle = obj.Title;
        PortfolioStructureIDs = obj.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
      }


      if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && obj?.subRows?.length > 0) {
        obj.subRows.forEach((sub: any) => {
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
        obj.subRows.forEach((sub: any) => {
          if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub?.subRows?.length == 0) {
            PortfolioLevelNum = 1;
            ItemId = sub.Id;
            ItemTitle = sub.Title;
            PortfolioStructureIDs = sub.PortfolioStructureID + "-" + siteIcon + PortfolioLevelNum;
          }

          if (sub.Id === newItemBackUp?.Id && sub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && sub?.subRows?.length > 0) {
            sub.subRows.forEach((newsub: any) => {
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
      let web = new Web(NextProp.siteUrl);
      var postData: any = {
        ParentId: ItemId,
        PortfolioLevel: PortfolioLevelNum,
        PortfolioStructureID: PortfolioStructureIDs,
        Item_x0020_Type: ChengedItemTitle,
      };
      await web.lists
        .getById(NextProp.MasterTaskListID)
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
            items.Shareweb_x0020_ID = postData.PortfolioStructureID,
              items.SiteIconTitle = siteIcon
          })

          array?.map((obj: any, index: any) => {
            obj.isRestructureActive = false;
            if (obj.Id === newItemBackUp?.Id && obj.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && checkUpdate != 3) {
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
                  sub.subRows.push(...latestCheckedList);

                  checkUpdate = checkUpdate + 1;
                }
                if (sub.Id === backupCheckedList[0]?.Id && sub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate != 3) {
                  array[index]?.subRows.splice(indexsub, 1);

                  checkUpdate = checkUpdate + 1;
                }

                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === newItemBackUp?.Id && newsub.Item_x0020_Type === newItemBackUp?.Item_x0020_Type && checkUpdate != 3) {
                      newsub.subRows.push(...latestCheckedList);

                      checkUpdate = checkUpdate + 1;
                    }
                    if (newsub.Id === backupCheckedList[0]?.Id && newsub.Item_x0020_Type === backupCheckedList[0]?.Item_x0020_Type && checkUpdate != 3) {
                      array[index]?.subRows[indexsub]?.subRows.splice(lastIndex, 1);

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
          // AllDataRender = AllDataRender?.concat(array);
          // Renderarray = [];
          // Renderarray = Renderarray.concat(AllDataRender);
          // refreshDataTaskLable();
          AllItems = AllItems?.concat(array);
          setData((AllItems) => [...AllItems]);
          refreshData();
          rerender();



        });
    }
  };

  

  const findUserByName = (name: any) => {
    const user = AllUsers.filter((user: any) => user.AssingedToUserId === name);
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
      Image = user[0].Item_x0020_Cover.Url;
    } else {
      Image =
        "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
    }
    return user ? Image : null;
  };

  ///react table start function//////

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
              {row?.original?.TitleNew != "Tasks" ? (
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
              {row?.original?.SiteIcon != undefined ? (
                <a className="hreflink" title="Show All Child" data-toggle="modal" >
                  <img className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 icon-sites-img ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 icon-sites-img ml20 me-1" : row?.original?.SharewebTaskType?.Title == "Activities" ? "ml-36 icon-sites-img ml20 me-1" :
                    row?.original?.SharewebTaskType?.Title == "Workstream" ? "ml-48 icon-sites-img ml20 me-1" : row?.original?.SharewebTaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.SharewebTaskType == undefined ? "ml-60 icon-sites-img ml20 me-1" : "icon-sites-img ml20 me-1"
                  }
                    src={row?.original?.SiteIcon}>
                  </img>
                </a>
              ) : (
                <>
                  {row?.original?.TitleNew != "Tasks" ? (
                    <div className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.SharewebTaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                      row?.original?.SharewebTaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.SharewebTaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
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
        accessorFn: (row) => row?.Shareweb_x0020_ID,
        cell: ({ row, getValue }) => (
          <>
            <ReactPopperTooltip ShareWebId={getValue()} row={row} AllListId={NextProp}/>
          </>
        ),
        id: "Shareweb_x0020_ID",
        placeholder: "ID",
        header: "",
        size: 130,
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== 'Others' && <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
              href={NextProp.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID}
            >
              <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : globalFilterHighlited} />
            </a>}
            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== 'Others' &&
              <a className="hreflink serviceColor_Active" target="_blank" data-interception="off"
                href={NextProp.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType}
              >
                <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : globalFilterHighlited} />
              </a>}
            {row?.original.TitleNew === "Tasks" ? (
              <span>{row?.original.TitleNew}</span>
            ) : (
              ""
            )}
            {row?.original?.Categories == 'Draft' ?
              <FaCompressArrowsAlt style={{ height: '11px', width: '20px' }} /> : ''}
            {row?.original?.subRows?.length > 0 ?
              <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}

            {row?.original?.Short_x0020_Description_x0020_On != null &&
              <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                <span title="Edit" className="svg__iconbox svg__icon--info"></span>
                {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /> */}
                <span className="popover__content">
                  {row?.original?.Short_x0020_Description_x0020_On}
                </span>
              </span>}

          </>
        ),
        id: "Title",
        placeholder: "Title",
        header: "",
      },
      {

        accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,

        cell: ({ row }) => (

            <>

                {row?.original?.ProjectTitle != (null || undefined) ?

                    <span ><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${NextProp.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.ProjectId}`} >

                        <ReactPopperTooltip ShareWebId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={NextProp} /></a></span>

                    : ""}

            </>

        ),

        id: 'ProjectTitle',

        placeholder: "Project",

        header: "",

        size: 70,

    },
      {
        accessorFn: (row) => row?.ClientCategory?.map((elem: any) => elem.Title).join("-"),
        cell: ({ row }) => (
          <>
            <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} />
            {/* {row?.original?.ClientCategory?.map((elem: any) => {
              return (
                <> <span title={elem?.Title} className="ClientCategory-Usericon">{elem?.Title?.slice(0, 2).toUpperCase()}</span></>
              )
            })} */}
          </>
        ),
        id: 'ClientCategory',
        placeholder: "Client Category",
        header: "",
        size: 100,
      },
      {
        accessorFn: (row) => row?.TeamLeaderUser?.map((elem: any) => elem.Title).join("-"),
        cell: ({ row }) => (
          <div>
            <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllUsers} />
          </div>
        ),
        id: 'TeamLeaderUser',
        placeholder: "Team",
        header: "",
        size: 120,
      },
      {
        accessorKey: "PercentComplete",
        placeholder: "Status",
        header: "",
        size: 42,
      },
      {
        accessorKey: "ItemRank",
        placeholder: "Item Rank",
        header: "",
        size: 42,
      },
      {
        accessorFn: (row) => row?.DueDate ? Moment(row?.DueDate).format("DD/MM/YYYY") : "",
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.DueDate == null ? (""
            ) : (
              <>
                <span>{Moment(row?.original?.DueDate).format("DD/MM/YYYY")}</span>
              </>
            )
            }
          </>
        ),
        id: 'DueDate',
        placeholder: "Due Date",
        header: "",
        size: 100,
      },
      {
        accessorFn: (row) => row?.Created ? Moment(row?.Created).format("DD/MM/YYYY") : "",
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.Created == null ? (""
            ) : (
              <>
                {row?.original?.Author != undefined ? (
                  <>
                    <span>{Moment(row?.original?.Created).format("DD/MM/YYYY")} </span>
                    <img className="workmember" title={row?.original?.Author?.Title} src={findUserByName(row?.original?.Author?.Id)}
                    />

                  </>
                ) : (
                  <img
                    className="workmember"
                    src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"
                  />
                )}

              </>
            )
            }
          </>
        ),
        id: 'Created',
        placeholder: "Created Date",
        header: "",
        size: 127,
      },
      // {
      //   accessorFn: (row) => String(row?.smartTime),
      //   cell: ({ row }) => (
      //     <>
      //       {row?.original?.Item_x0020_Type == "Task" && row?.original?.siteType != "Master Tasks" && row?.original?.smartTime != undefined && (

      //         <>
      //           <span>{String(row?.original?.smartTime)}</span>
      //         </>

      //       )}
      //     </>
      //   ),
      //   id: "smartTime",
      //   placeholder: "SmartTime",
      //   header: "",
      //   size: 56,
      // },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.Item_x0020_Type == "Task" && row?.original?.siteType != "Master Tasks" && (
              <a onClick={(e) => EditData(e, row?.original)} >
                <span className="svg__iconbox svg__icon--clock"></span>
              </a>
            )}
            {getValue()}
          </>
        ),
        id: "row?.original?.Id",
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
                  <img
                    className="icon-sites-img"
                    src={IsUpdated == "Service" ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png'}

                  />
                </span>
                : ''
            }

          </>
        ),
        cell: ({ row, getValue }) => (
          <>

            {row?.original?.isRestructureActive && (
              <a href="#" data-bs-toggle="tooltip" data-bs-placement="auto" onClick={(e) => OpenModal(row?.original)} title="Edit">
                {
                  <img
                    className="icon-sites-img"
                    src={IsUpdated == "Service" ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png'}

                  />
                }

              </a>
            )}

            {getValue()}
          </>
        ),
        id: "row?.original?.Id",
        canSort: false,
        placeholder: "",
        size: 1,
      },
      {
        cell: ({ row, getValue }) => (
          <>

            <a> {row?.original?.siteType == "Master Tasks" && (
              <span className="mt-1 svg__iconbox svg__icon--edit" onClick={(e) => EditComponentPopup(row?.original)}> </span>)}

              {row?.original?.Item_x0020_Type == "Task" && row?.original?.siteType != "Master Tasks" && (
                <span onClick={(e) => EditItemTaskPopup(row?.original)} className="mt-1 svg__iconbox svg__icon--edit"></span>
              )}
            </a>

            {getValue()}
          </>
        ),
        id: "row?.original?.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 1,
      },
    ],
    [data]
  );


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
    CheckDataPrepre()
  }, [table?.getSelectedRowModel()?.flatRows.length])


  const CheckDataPrepre = () => {
    if (table?.getSelectedRowModel()?.flatRows.length) {
      let eTarget = false;
      let itrm: any;
      if (table?.getSelectedRowModel()?.flatRows.length > 0) {
        table?.getSelectedRowModel()?.flatRows?.map((value: any) => {
          value.original.Id = value.original.ID
          itrm = value.original;
          if (value?.getCanSelect() == true) {
            eTarget = true
          } else {
            eTarget = false
          }
        });
      }
      if (itrm?.Item_x0020_Type == "Component") {
        onChangeHandler(itrm, 'parent', eTarget, table?.getSelectedRowModel()?.flatRows);
      } else {
        onChangeHandler(itrm, props, eTarget, table?.getSelectedRowModel()?.flatRows);
      }
    } else {
      childsData = []
      MeetingItems = [];
      setcheckData([])
      setCheckedList([]);
      setShowTeamMemberOnCheck(false)
    }

  }


  const openTaskAndPortfolioMulti = () => {
    checkData?.map((item: any) => {
      if (item?.original?.siteType === "Master Tasks") {
        window.open(`${NextProp?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${item?.original?.Id}`, '_blank')
      } else {
        window.open(`${NextProp?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.original?.Id}&Site=${item?.original?.siteType}`, '_blank')
      }
    })
  }

  React.useEffect(() => {
    if (table.getState().columnFilters.length) {
      setExpanded(true);
    } else {
      setExpanded({});
    }
  }, [table.getState().columnFilters]);


  const ShowTeamFunc = () => {
    setShowTeamPopup(true)
  }

  const showTaskTeamCAllBack = React.useCallback(() => {
    setShowTeamPopup(false)
    setRowSelection({});
  }, []);

  // Change the footer table data


  function handleupdatedata(updated: any) {
    ParentDs = updated.Id
    Itemtypes = updated.ItemType
    // LoadAllSiteTasks();
    showProgressBar();
    getTaskUsers();
    GetSmartmetadata();
    //LoadAllSiteTasks();
    GetComponents();
    let ids;

    Iconssc.forEach((item: any) => {
      if (item.ItemType === Itemtypes) {
        item.nextIcon = undefined;
      }
    });
    if (updated?.ItemType == 'SubComponent') {
      Iconssc.map((items: any) => {
        if (items?.ItemType == 'Feature') {
          ids = items.Id;
        }
      }

      )
    }
    function spliceObjects(clickedId: any) {
      const index = Iconssc.findIndex((item: any) => item.Id === clickedId);
      if (index !== -1) {
        Iconssc.splice(0, index);
        Iconssc.splice(1);
      }
    }
    if (updated?.ItemType == 'Component') {

      spliceObjects(ParentDs);
    }

    function spliceById(arr: any, id: any) {
      const index = arr.findIndex((item: any) => item.Id === id);
      if (index !== -1) {
        return arr.splice(index, 1)[0];
      }
      return null; // ID not found
    }
    spliceById(Iconssc, ids)
    countaa++;
  }
  React.useEffect(() => {

  }, [Iconssc]);

  return (
    <div
      className={
        IsUpdated == "Events"
          ? "app component eventpannelorange"
          : IsUpdated == "Service"
            ? "app component serviepannelgreena"
            : "app component"
      }
    >
      <div className="Alltable mt-10">
        <div className="tbl-headings">
          <span className="leftsec">
            <span className="">
              {Iconssc.map((icon: any) => {
                return (
                  <>
                    <span className="Dyicons" title={icon?.Title} onClick={() => handleupdatedata(icon)}>{icon?.Icon}  </span> <span>{`${icon?.nextIcon != undefined ? icon?.nextIcon : ""}`}</span></>
                )
              })}

              <span>{Iconssc[Iconssc?.length - 1]?.Title}</span>

            </span>
            <span className="g-search">
              <span>
                <DebouncedInput
                  value={globalFilter ?? ""}
                  onChange={(value) => setGlobalFilter(String(value))}
                  placeholder="Search All..."
                />
              </span>
            </span>
          </span>
          <span className="toolbox mx-auto">
            {checkedList != undefined &&
              checkedList.length > 0 &&
              (checkedList[0].Item_x0020_Type === "Feature" ||
                checkedList[0].Item_x0020_Type === "Task") ? (
              <button
                type="button"
                disabled={true}
                className="btn btn-primary"
                onClick={addModal}
                title=" Add Structure"
              >
                Add Structure
              </button>
            ) : (
              <button
                type="button"
                disabled={checkedList.length >= 2 || props?.Item_x0020_Type == 'Feature'}
                className="btn btn-primary"
                onClick={addModal}
                title=" Add Structure"
              >
                Add Structure
              </button>
            )}

            
            <button
              type="button"
              onClick={() => openActivity()}
              disabled={ActivityDisable || checkedList.length >= 2}
              className="btn btn-primary"
              title=" Add Activity-Task"
            >
              Add Activity-Task
            </button>

            {(table?.getSelectedRowModel()?.flatRows.length === 1 && table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != "Component") ||
              (table?.getSelectedRowModel()?.flatRows.length === 1 && table?.getSelectedRowModel()?.flatRows[0]?.original?.subRows?.length === 0) ? <button
                type="button"
                className="btn btn-primary"
                onClick={buttonRestructuring}
              >
              Restructure
            </button> : <button
              type="button"
              disabled={true || checkedList.length >= 2}
              className="btn btn-primary"
              onClick={buttonRestructuring}
            >
              Restructure
            </button>}
            {table?.getSelectedRowModel()?.flatRows?.length > 0 ? <span>
              <a onClick={() => openTaskAndPortfolioMulti()} className="openWebIcon"><span className="svg__iconbox svg__icon--openWeb"></span></a>
            </span> : <span><a className="openWebIcon"><span className="svg__iconbox svg__icon--openWeb" style={{ backgroundColor: "gray" }}></span></a></span>}

            {showTeamMemberOnCheck === true ? <span><a className="teamIcon" onClick={() => ShowTeamFunc()}><span title="Create Teams Group" className="svg__iconbox svg__icon--team teamIcon"></span></a>
            </span> : <span><a className="teamIcon"><span title="Create Teams Group" style={{ backgroundColor: "gray" }} className="svg__iconbox svg__icon--team teamIcon"></span></a></span>}
            <a className="brush" onClick={() => { setGlobalFilter(''); setColumnFilters([]); }}>

              <FaPaintBrush />

            </a>
            {/* <button
              type="button"
               onClick={()=>setcomparetool(true)}
            >
              Compare
            </button> */}
            <a className="expand">
              <ExpndTable prop={expndpopup} prop1={tablecontiner} />
            </a>
            <a>
              <Tooltip ComponentId="5756" IsServiceTask={IsUpdated == "Service" ? true : false} />
            </a>
          </span>

        </div>
        <div className="col-sm-12 p-0 smart ">
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
      {ShowTeamPopup === true ? <ShowTeamMembers props={checkData} callBack={showTaskTeamCAllBack} TaskUsers={AllUsers} /> : ''}

      {IsTask && (
        <EditTaskPopup Items={SharewebTask} AllListId={NextProp} Call={Call} context={NextProp.Context}></EditTaskPopup>
      )}
      {IsComponent && (
        <EditInstituton item={SharewebComponent} SelectD={NextProp} Calls={Call}></EditInstituton>
      )}

      {IsTimeEntry && (
        <TimeEntryPopup
          props={SharewebTimeComponent}
          CallBackTimeEntry={TimeEntryCallBack}
          Context={NextProp.Context}
        ></TimeEntryPopup>
      )}
      {MeetingPopup && (
        <CreateActivity
          props={MeetingItems[0]}
          Call={Call}
          LoadAllSiteTasks={LoadAllSiteTasks}
          SelectedProp={NextProp}
        ></CreateActivity>
      )}
      {WSPopup && (
        <CreateWS props={MeetingItems[0]} SelectedProp={NextProp} Call={Call} data={data}></CreateWS>
      )}

      <Panel

        onRenderHeader={onRenderCustomHeader}
        type={PanelType.medium}
        isOpen={addModalOpen}
        isBlocking={false}
        onDismiss={closeaddstructure}
      >
        <PortfolioStructureCreationCard
          CreatOpen={CreateOpenCall}
          Close={CloseCall}
          PortfolioType={IsUpdated}
          PropsValue={NextProp}
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
              props?.Portfolio_x0020_Type == "Events Portfolio"
                ? "app component clearfix eventpannelorange"
                : props?.Portfolio_x0020_Type == "Service"
                  ? "app component clearfix serviepannelgreena"
                  : "app component clearfix"
            }
          >
            <div id="portfolio" className=" pt-0">
              {props != undefined && props.Portfolio_x0020_Type == "Service" ? (
                <ul className="quick-actions">

                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Activities")}>
                      <span className="icon-sites"></span>
                      Activity
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites"></span>
                      Task
                    </div>
                  </li>
                </ul>
              ) : (
                <ul className="quick-actions">
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">

                    <div onClick={() => CreateMeetingPopups("Activities")}>

                      <span className="icon-sites"></span>

                      Activity

                    </div>

                  </li>

                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">

                    <div onClick={() => CreateMeetingPopups("Task")}>

                      <span className="icon-sites"> </span>

                      Task

                    </div>

                  </li>



                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">

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
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">

                    <div onClick={() => CreateMeetingPopups("Improvement")}>

                      <span className="icon-sites"> <img

                        className="icon-sites"

                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png"

                      /></span>

                      Improvement

                    </div>

                  </li>

                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">

                    <div onClick={() => CreateMeetingPopups("Activities")}>

                      <span className="icon-sites"> <img

                        className="icon-sites"

                        src=" https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png"

                      /></span>

                      Implementation

                    </div>

                  </li>

                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">

                    <div onClick={() => CreateMeetingPopups("Bug")}>

                      <span className="icon-sites" > <img

                        className="icon-sites"

                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png"

                      /></span>

                      Feedback

                    </div>

                  </li>

                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">

                    <div onClick={() => CreateMeetingPopups("Feedback")}>

                      <span className="icon-sites"> <img

                        className="icon-sites"

                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png"

                      /></span>

                      Design

                    </div>

                  </li>



                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">

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

      {
        ResturuningOpen &&
        <Panel
          headerText={` Restructuring Tool `}
          type={PanelType.medium}
          isOpen={ResturuningOpen}
          isBlocking={false}
          onDismiss={RestruringCloseCall}
        >
          <div>
            {ResturuningOpen ? (
              <div className="bg-ee p-2 restructurebox">
                <div>
                  {NewArrayBackup != undefined && NewArrayBackup.length > 0 ? (
                    <span>
                      All below selected items will become child of
                      <img
                        className="icon-sites-img me-1 "
                        src={NewArrayBackup[0].siteIcon}
                      ></img>
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          NextProp.siteUrl + "/SitePages/Portfolio-Profile.aspxHH?taskId=" +
                          NewArrayBackup[0]?.Id
                        }
                      >
                        <span>{NewArrayBackup[0].Title}</span>
                      </a>
                      please click Submit to continue.
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <span> Old: </span>
                  {OldArrayBackup?.map(function (obj: any, index) {
                    return (
                      <span>
                        <span><img width={"25px"} height={"25px"} src={obj.siteIcon} /></span>
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active"
                          href={
                            NextProp.siteUrl +
                            "/SitePages/Portfolio-Profile.aspx?taskId=" +
                            obj?.Id
                          }
                        >
                          <span>{obj?.Title} </span>
                        </a>
                        {/* {OldArrayBackup.length - 1 < index ? ">" : ""} */}
                        <span>{obj?.newChild ? <span> {'>'} <span><img width={"25px"} height={"25px"} src={obj?.newChild?.siteIcon} /></span> {obj?.newChild?.Title}</span> : ''}</span>
                        <span>{obj?.newChild?.newFchild ? <span> {'>'}<span><img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.siteIcon} /></span>{obj?.newChild?.newFchild?.Title}</span> : ''}</span>
                        <span>{obj?.newChild?.newFchild?.newActChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.newActChild?.siteIcon} /></span> {obj?.newChild?.newFchild?.newActChild?.Title}</span> : ''}</span>
                        <span>{obj?.newChild?.newFchild?.newActChild?.newWrkChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.newActChild?.newWrkChild?.siteIcon} /> </span> {obj?.newChild?.newFchild?.newActChild?.newWrkChild?.Title}</span> : ''}</span>
                        <span>{obj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild ? <span> {'>'} <span className=""> <img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild?.siteIcon} /> </span> {obj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild?.Title}</span> : ''}</span>

                      </span>
                    );
                  })}
                </div>
                <div>
                  <span> New: </span>
                  {NewArrayBackup?.map(function (newobj: any, indexnew) {
                    return (
                      <>
                        <span>
                          <span><img width={"25px"} height={"25px"} src={newobj?.siteIcon} /></span>
                          <a
                            data-interception="off"
                            target="_blank"
                            className="hreflink serviceColor_Active"
                            href={
                              NextProp.siteUrl +
                              "/SitePages/Portfolio-Profile.aspx?taskId=" +
                              newobj.Id
                            }
                          >
                            <span>{newobj.Title} </span>
                          </a>
                          {/* {NewArrayBackup.length - 1 < indexnew ? ">" : ""} */}
                          <span>{newobj?.newChild ? <span> {'>'} <span><img width={"25px"} height={"25px"} src={newobj?.newChild?.siteIcon} /></span>{newobj?.newChild?.Title}</span> : ''}</span>
                          <span>{newobj?.newChild?.newFchild ? <span> {'>'}<span><img width={"25px"} height={"25px"} src={newobj?.newChild?.newFchild?.siteIcon} /></span> {newobj?.newChild?.newFchild?.Title}</span> : ''}</span>
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
                          items?.Item_x0020_Type === "SubComponent" ? <span>
                            <img width={"25px"} height={"25px"} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Feature_icon.png" />
                          </span> : <span><img width={"25px"} height={"25px"} src={items?.siteIcon} /></span>
                        }
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active"
                          href={
                            NextProp.siteUrl +
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
                {
                  (RestructureChecked[0]?.Item_x0020_Type === "Task" && (checkedList[0]?.subRows?.length == 0 || checkedList[0]?.subRows == undefined) && newItemBackUp?.SharewebTaskType?.Title == "Activities")
                    ?
                    <span>
                      <span>

                        {"Select Component Type :"}
                        <input
                          type="radio"
                          name="fav_language"
                          value="Workstream"
                          checked={
                            RestructureChecked[0]?.SharewebTaskType?.Title == "Workstream"
                              ? true
                              : (RestructureChecked[0]?.SharewebTaskType?.Title == "Activities" ? true : false)
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
                          value="Task"
                          checked={
                            RestructureChecked[0]?.SharewebTaskType?.Title === "Task"
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
          <footer className="mt-2 text-end">
            {checkedList != undefined &&
              checkedList.length > 0 &&
              checkedList[0].Item_x0020_Type === "Task" ? (
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
      }


      {
        topCompoIcon &&
        <Panel
          isOpen={topCompoIcon}
          isBlocking={false}
          onDismiss={() => setTopCompoIcon(false)}
        >
          <div>
            <span> Old: </span>
            {OldArrayBackup?.map(function (obj: any, index) {
              return (
                <span>
                  <span><img width={"25px"} height={"25px"} src={obj.siteIcon} /></span>
                  <a
                    data-interception="off"
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      NextProp.siteUrl +
                      "/SitePages/Portfolio-Profile.aspx?taskId=" +
                      obj?.Id
                    }
                  >
                    <span>{obj?.Title} </span>
                  </a>
                  {/* {OldArrayBackup.length - 1 < index ? ">" : ""} */}
                  <span>{obj?.newChild ? <span> {'>'} <span><img width={"25px"} height={"25px"} src={obj?.newChild?.siteIcon} /></span> {obj?.newChild?.Title}</span> : ''}</span>
                  <span>{obj?.newChild?.newFchild ? <span> {'>'}<span><img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.siteIcon} /></span>{obj?.newChild?.newFchild?.Title}</span> : ''}</span>
                  <span>{obj?.newChild?.newFchild?.newActChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.newActChild?.siteIcon} /></span> {obj?.newChild?.newFchild?.newActChild?.Title}</span> : ''}</span>
                  <span>{obj?.newChild?.newFchild?.newActChild?.newWrkChild ? <span> {'>'} <span className=""><img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.newActChild?.newWrkChild?.siteIcon} /> </span> {obj?.newChild?.newFchild?.newActChild?.newWrkChild?.Title}</span> : ''}</span>
                  <span>{obj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild ? <span> {'>'} <span className=""> <img width={"25px"} height={"25px"} src={obj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild?.siteIcon} /> </span> {obj?.newChild?.newFchild?.newActChild?.newWrkChild?.newTskChild?.Title}</span> : ''}</span>
                </span>

              );
            })}
            <div>
              <span> New: </span>
              {
                RestructureChecked?.map((items: any) =>
                  <span>
                    {
                      <span><img width={"25px"} height={"25px"} src={items?.siteIcon} /></span>
                    }
                    <a
                      data-interception="off"
                      target="_blank"
                      className="hreflink serviceColor_Active"
                      href={
                        NextProp.siteUrl +
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

            {
              (checkedList[0]?.Item_x0020_Type !== "Task" && checkedList != undefined && checkedList.length > 0)
                ?
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
                          : false
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
                      value="Feature"
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
                </span> : " "
            }
            <footer className="mt-2 text-end">
              <button
                type="button"
                className="btn btn-primary "
                onClick={(e) => makeTopComp()}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-default btn-default ms-1"
                onClick={topRestructureClose}
              >
                Cancel
              </button>
            </footer>
          </div>
        </Panel>
      }

    </div>

  );
}