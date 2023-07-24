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
// import SelectedClientCategoryPupup1 from "../../../globalComponents/SelectedClientCategorypopup";
// import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";

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
// import HighlightableCell from '../../componentPortfolio/components/highlight'
import Loader from "react-loader";
import ShowTeamMembers from "../../../globalComponents/ShowTeamMember";
import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
// import HighlightableCell from "../../../globalComponents/highlight";
import HighlightableCell from "../../componentPortfolio/components/highlight";


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
let SmartMetaData:any=[];
// let selectedClientCategoryPopup:any=false;
let activity = 0;
let workstrim = 0;
let task = 0;
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
  // const[selectedClientCategory,setSelectedClientCategory]=React.useState([]);
  // const[selectedClientCategoryPopup,setSelectedClientCategoryPopup]=React.useState(false);



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

  // SmartTotalTime

  // Popover start 

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



  const SmartTimeData = async (items: any) => {
    let FinalTotalTime: any = 0;
    let AllTimeSpentDetails: any = [];
    let filteres: string;
    let TimeSheetlistId: any;
    let siteUrl: any;
    let listName: any;

    // Get the list Name
    let TimesheetConfiguration: any = [];
    if (SmartMetaData.length > 0) {


      SmartMetaData.forEach((itemss: any) => {

        if (itemss.Title == items.siteType && itemss.TaxType == 'Sites') {

          TimesheetConfiguration = JSON.parse(itemss.Configurations)




        }

      })

      TimesheetConfiguration?.forEach((val: any) => {




        TimeSheetlistId = val.TimesheetListId;

        siteUrl = val.siteUrl

        listName = val.TimesheetListName
      })
    }


    if (items.siteType === "Offshore Tasks") {
      const siteType = "OffshoreTasks";
      filteres = `Task${siteType}/Id eq ${items.Id}`;
    } else {
      filteres = `Task${items.siteType}/Id eq ${items.Id}`;
    }

    const select = "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,Author/Id,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + filteres;
    let count = 0;

    let allurls: { Url: string }[];

    if (items.siteType === "Migration" || items.siteType === "ALAKDigital") {
      allurls = [
        { Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('9ed5c649-3b4e-42db-a186-778ba43c5c93')/items?$select=" + select }
      ];
    } else if (items.siteType === "SH") {
      allurls = [
        { Url: `${items.siteUrl}/_api/web/lists/getbyTitle('TaskTimesheet')/items?$select=${select}` }
      ];
    } else {
      if(listName != undefined){
        allurls = [
          { Url: `${items.siteUrl}/_api/web/lists/getbyTitle('${listName}')/items?$select=${select}` }
        ];
      }
     
    }



    for (const item of allurls) {
      try {
        const response = await $.ajax({
          url: item.Url,
          method: "GET",
          headers: {
            "Accept": "application/json; odata=verbose"
          }
        });

        count++;
        let tempArray: any = [];

        if (response.d.results !== undefined && response.d.results.length > 0) {
          AllTimeSpentDetails = AllTimeSpentDetails.concat(response.d.results);

          AllTimeSpentDetails.forEach((item: any) => {
            if (item.AdditionalTimeEntry !== null) {
              const data = JSON.parse(item.AdditionalTimeEntry);

              if (data !== undefined && data.length > 0) {
                data.forEach((timeData: any) => {
                  tempArray.push(timeData);
                });
              }
            }
          });
        }

        let TotalTimeData: number = 0;

        if (tempArray.length > 0) {
          tempArray.forEach((tempItem: any) => {
            if (typeof tempItem.TaskTimeInMin === 'string') {
              const timeValue = Number(tempItem.TaskTimeInMin);

              if (timeValue > 0) {
                TotalTimeData += timeValue;
              }
            } else {
              if (tempItem.TaskTimeInMin > 0) {
                TotalTimeData += tempItem.TaskTimeInMin;
              }
            }
          });
        }

        if (TotalTimeData > 0) {
          FinalTotalTime = TotalTimeData / 60;
        }
      } catch (error) {
        // console.error("Error:", error);
      }
    }

    // console.log(FinalTotalTime);
    return FinalTotalTime;
  };


  // End of SmartTotalTime


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
        <Tooltip ComponentId={1272} />
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
        <Tooltip ComponentId="1746" />
      </div>
    );
  };

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

  const Clearitem = () => {
    // setData(maini...[maidataBackup])
    setData(maidataBackup);
    // const { checked } = e.target;
  };

  const groupbyTasks = function (TaskArray: any, item: any) {
    item.subRows = item.subRows != undefined ? item.subRows : [];
    // TaskArray.forEach((activ: any) => {
    //  if (activ.ParentTask?.Id != undefined) {
    let Allworkstream = $.grep(AllTasks, function (type: any) {
      return type.ParentTask?.Id == item?.Id;
    });
    if (Allworkstream != undefined && Allworkstream.length > 0) {
      Allworkstream.forEach((activ: any) => {
        if (activ.ParentTask?.Id != undefined) {
          activ.tagged = true;
          activ.show = true;
          item.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          item.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service"
              ? GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : GlobalConstants.MAIN_SITE_URL +
              "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

          item.subRows.push(activ);
          activ.subRows = activ.subRows != undefined ? activ.subRows : [];
          let Allworkstream = $.grep(AllTasks, function (type: any) {
            return type.ParentTask?.Id == activ?.Id;
          });
          {
            if (Allworkstream != undefined && Allworkstream.length > 0) {
              Allworkstream.forEach((subactiv: any) => {
                subactiv.tagged = true;
                activ.downArrowIcon =
                  IsUpdated != undefined && IsUpdated == "Service"
                    ? GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                    : GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                activ.RightArrowIcon =
                  IsUpdated != undefined && IsUpdated == "Service"
                    ? GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                    : GlobalConstants.MAIN_SITE_URL +
                    "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

                activ.subRows.push(subactiv);
              });
            }
          }
        } else {
          activ.tagged = true;
          item.subRows.push(activ);
        }
      });
    }
    // }

    // })
  };

  const LoadAllSiteTasks = function (filterarray: any) {
    var Response: any = [];
    var Counter = 0;
    filterarray.forEach((filter: any) => {
      map(siteConfig, async (config: any) => {
        if (config.Title != "Master Tasks" && config.Title != "SDC Sites") {
          try {
            let AllTasksMatches = [];
            var select =
              "SharewebTaskLevel2No,SiteCompositionSettings,ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,SharewebTaskLevel1No,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,TimeSpent,BasicImageInfo,CompletedDate,Shareweb_x0020_ID, Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level, Priority_x0020_Rank, Team_x0020_Members/Title, Team_x0020_Members/Name, Component/Id,Component/Title,Component/ItemType, Team_x0020_Members/Id,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,  ClientCategory/Id, ClientCategory/Title, FileLeafRef, FeedBack, Title, Id, PercentComplete,StartDate, DueDate, Comments, Categories, Status, Body, Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories&$filter=" +
              filter +
              "";
            AllTasksMatches = await globalCommon.getData(
              NextProp.siteUrl,
              config.listId,
              select
            );
            console.log(AllTasksMatches);
            Counter++;
            console.log(AllTasksMatches.length);
            if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
              $.each(AllTasksMatches, function (index: any, item: any) {
                item.isDrafted = false;
                item.flag = true;
                item.siteType = config.Title;
                item.subRows = [];
                item.TitleNew = item.Title;
                item.listId = config.listId;
                // item.Item_x0020_Type = 'Task';
                item.siteUrl = GlobalConstants.SP_SITE_URL;
                if (item.SharewebCategories != undefined) {
                  if (item.SharewebCategories.length > 0) {
                    $.each(
                      item.SharewebCategories,
                      function (ind: any, value: any) {
                        if (value.Title.toLowerCase() == "draft") {
                          item.isDrafted = true;
                        }
                      }
                    );
                  }
                }
              });
            }
            AllTasks = AllTasks.concat(AllTasksMatches);
            AllTasks = $.grep(AllTasks, function (type: any) {
              return type.isDrafted == false;
            });

            if (
              Counter ===
              (filterarray.length === 1
                ? siteConfig.length
                : siteConfig.length * filterarray.length)
            ) {
              map(AllTasks, (result: any) => {
                //   result.TeamLeader = []
                result.CreatedDateImg = [];
                result.TeamLeaderUserTitle = "";
                //  result.AllTeamMembers = []
                result.Display = "none";
                // result.Created = Moment(result.Created).format("DD/MM/YYYY");
                // result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");

                // if (result.DueDate == "Invalid date" || result.Created == "Invalid date"|| "") {
                //   result.DueDate = result.DueDate.replaceAll(
                //     "Invalid date",
                //     ""
                //   );
                //   result.Created = result.Created.replaceAll(
                //     "Invalid date",
                //     ""
                //   );
                // }
                SmartTimeData(result)
                  .then((returnresult) => {
                    result.smartTime = String(returnresult)
                    // console.log("Final Total Time:", returnresult);
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
                result.PercentComplete = (result.PercentComplete * 100).toFixed(
                  0
                );

                if (result.Short_x0020_Description_x0020_On != undefined) {
                  result.Short_x0020_Description_x0020_On =
                    result.Short_x0020_Description_x0020_On.replace(
                      /(<([^>]+)>)/gi,
                      ""
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
                result["SiteIcon"] = globalCommon.GetIconImageUrl(
                  result.siteType,
                  GlobalConstants.MAIN_SITE_URL + "/SP",
                  undefined
                );
                // if (
                //   result.ClientCategory != undefined &&
                //   result.ClientCategory.length > 0
                // ) {
                //   map(result.Team_x0020_Members, (catego: any) => {
                //     result.ClientCategory.push(catego);
                //   });
                // }
                if (result?.Id === 498 || result?.Id === 104) console.log(result);
                result["Shareweb_x0020_ID"] = globalCommon.getTaskId(result);
                if (result["Shareweb_x0020_ID"] == undefined) {
                  result["Shareweb_x0020_ID"] = "";
                }
                result["Item_x0020_Type"] = "Task";

                result.Portfolio_x0020_Type = "Component";
                TasksItem.push(result);
              });
              let AllAcivities = $.grep(AllTasks, function (type: any) {
                return type.SharewebTaskType?.Title == "Activities";
              });
              if (AllAcivities != undefined && AllAcivities.length > 0) {
                AllAcivities.forEach((activ: any) => {
                  if (activ?.Id != undefined) {
                    groupbyTasks(AllTasks, activ);
                    AllTasks.forEach((obj: any) => {
                      if (obj?.Id === activ?.Id) {
                        obj.show = false;
                        obj.subRows = activ.subRows;
                        obj.childsLength = activ.subRows.length;
                      }
                    });
                  }
                });
              }
              AllTasks = $.grep(AllTasks, function (type: any) {
                return type.tagged != true;
              });
              TasksItem = AllTasks;
              console.log(Response);
              map(TasksItem, (task: any) => {
                if (!isItemExistsNew(CopyTaskData, task)) {
                  CopyTaskData.push(task);
                }
              });

              // bindData();
              makeFinalgrouping();
            }
          } catch (error) {
            console.log(error);
          }
        } else Counter++;
      });
    });
  };

  const handleOpen = (item: any) => {
    item.show = item.show = item.show == true ? false : true;
    setData((maidataBackup) => [...maidataBackup]);
  };

  const handleOpenAll = () => {
    var Isshow1: any = Isshow == true ? false : true;
    map(data, (obj) => {
      obj.show = Isshow1;
      if (obj.subRows != undefined && obj.subRows.length > 0) {
        map(obj.subRows, (subchild) => {
          subchild.show = Isshow1;
          if (subchild.subRows != undefined && subchild.subRows.length > 0) {
            map(subchild.subRows, (child) => {
              child.show = Isshow1;
            });
          }
        });
      }
    });
    setIsshow(Isshow1);
    setData((data) => [...data]);
  };

  const addModal = () => {
    setAddModalOpen(true);
  };
  const setModalIsOpenToTrue = () => {
    setModalIsOpen(true);
  };

  // const sortBy = () => {
  //   const copy = data;

  //   copy.sort((a, b) => (a.Title > b.Title ? 1 : -1));

  //   setTable(copy);
  // };
  // const sortByDng = () => {
  //   const copy = data;

  //   copy.sort((a, b) => (a.Title > b.Title ? -1 : 1));

  //   setTable(copy);
  // };

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
  let handleChange1 = (e: { target: { value: string } }, titleName: any) => {
    setSearch(e.target.value.toLowerCase());
    var Title = titleName;

    var AllFilteredTagNews = [];
    var filterglobal = e.target.value.toLowerCase();
    if (filterglobal != undefined && filterglobal.length >= 1) {
      var searchTerms = stringToArray(filterglobal);
      $.each(data, function (pareIndex: any, item: any) {
        item.flag = false;
        item.isSearch = true;
        item.show = false;
        item.flag = getSearchTermAvialable1(searchTerms, item, Title);
        if (item.subRows != undefined && item.subRows.length > 0) {
          $.each(item.subRows, function (parentIndex: any, child1: any) {
            child1.flag = false;
            child1.isSearch = true;
            child1.flag = getSearchTermAvialable1(searchTerms, child1, Title);
            if (child1.flag) {
              item.subRows[parentIndex].flag = true;
              data[pareIndex].flag = true;
              item.subRows[parentIndex].show = true;
              data[pareIndex].show = true;
            }
            if (child1.subRows != undefined && child1.subRows.length > 0) {
              $.each(child1.subRows, function (index: any, subchild: any) {
                subchild.flag = false;
                subchild.flag = getSearchTermAvialable1(
                  searchTerms,
                  subchild,
                  Title
                );
                if (subchild.flag) {
                  item.subRows[parentIndex].flag = true;
                  child1.flag = true;
                  child1.subRows[index].flag = true;
                  child1.subRows[index].show = true;
                  item.subRows[parentIndex].show = true;
                  data[pareIndex].flag = true;
                  data[pareIndex].show = true;
                }
                if (
                  subchild.subRows != undefined &&
                  subchild.subRows.length > 0
                ) {
                  $.each(
                    subchild.subRows,
                    function (childindex: any, subchilds: any) {
                      subchilds.flag = false;
                      // subchilds.Title = subchilds.newTitle;
                      subchilds.flag = getSearchTermAvialable1(
                        searchTerms,
                        subchilds,
                        Title
                      );
                      if (subchilds.flag) {
                        item.subRows[parentIndex].flag = true;
                        child1.flag = true;
                        subchild.flag = true;
                        subchild.subRows[childindex].flag = true;
                        child1.subRows[index].flag = true;
                        child1.subRows[index].show = true;
                        item.subRows[parentIndex].show = true;
                        data[pareIndex].flag = true;
                        data[pareIndex].show = true;
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
      //   getFilterLength();
    } else {
      //  ungetFilterLength();
      // setData(data => ([...maidataBackup]));
      setData(maidataBackup);
      //setData(ComponentsData)= SharewebCommonFactoryService.ArrayCopy($scope.CopyData);
    }
    // console.log($scope.ComponetsData['allComponentItemWithStructure']);
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
    console.log(Response);
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

    LoadAllSiteTasks(Itmes);
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

  var ArrayCopy = function (array: any) {
    let MainArray = [];
    if (array != undefined && array.length != undefined) {
      MainArray = parseJSON(JSON.stringify(array));
    }
    return MainArray;
  };
  var stringToArray1 = function (input: any) {
    if (input) {
      return input.split(">");
    } else {
      return [];
    }
  };
  var getRegexPattern = function (keywordArray: any) {
    var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
    return new RegExp(pattern, "gi");
  };

  const getTeamLeadersName = function (Items: any, Item: any) {
    if (Items != undefined) {
      map(Items.results, (index: any, user: any) => {
        $.each(AllUsers, function (index: any, item: any) {
          $.each(AllUsers, function (index: any, item: any) {
            if (user?.Id === item.AssingedToUser?.Id) {
              Item.AllTeamName = Item.AllTeamName + item.Title + " ";
            }
          });
        });
      });
    }
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
    AllItems = ComponentsData[0].subRows.filter(
      (sub: any) => sub.Item_x0020_Type != "Task" || sub.subRows.length > 0
    );
    var activities = temp.subRows.filter(
      (sub: any) => sub?.SharewebTaskType?.Title === "Activities"
    );
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

  function Buttonclick(e: any) {
    e.preventDefault();
    this.setState({ callchildcomponent: true });
  }
  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };

  const closeModal = () => {
    setAddModalOpen(false);
  };

  const Prints = () => {
    window.print();
  };
  // ---------------------Export to Excel-------------------------------------------------------------------------------------

  const getCsvData = () => {
    const csvData = [["Title"]];
    let i;
    for (i = 0; i < data.length; i += 1) {
      csvData.push([`${data[i].Title}`]);
    }
    return csvData;
  };
  const clearSearch = () => {
    setSearch("");
  };

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
      MeetingItems=[]
      childsData=[]
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

  // const onChangeHandler = (itrm: any, child: any, e: any) => {
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
  var TaskTimeSheetCategories: any = [];
  var AllTimeSpentDetails: any = [];
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
  const checkCategory = function (item: any, category: any) {
    $.each(
      TaskTimeSheetCategoriesGrouping,
      function (index: any, categoryTitle: any) {
        if (categoryTitle?.Id == category) {
          // item.isShow = true;
          if (categoryTitle.Childs.length == 0) {
            categoryTitle.Childs = [];
          }
          if (!isItemExists(categoryTitle.Childs, item?.Id)) {
            item.show = true;
            categoryTitle.Childs.push(item);
          }
        }
      }
    );
  };

  const EditData = (e: any, item: any) => {
    setIsTimeEntry(true);
    setSharewebTimeComponent(item);
  };

  const handleTitle = (e: any) => {
    setTitle(e.target.value);
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
  function AddItem() { }

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

  // const Call = React.useCallback((childItem: any) => {
  //   table.setRowSelection({})
  //   // MeetingItems?.forEach((val: any): any => {
  //   //   val.chekBox = false;
  //   // });
  //   closeTaskStatusUpdatePoup2();
  //   setIsComponent(false);
  //   setIsTask(false);
  //   setMeetingPopup(false);
  //   setWSPopup(false);
  //   var MainId: any = ''
  //   let ParentTaskId: any = ''
  //   if (childItem != undefined) {
  //     childItem.data.Services = []
  //     childItem.data.Component = []
  //     childItem.data['flag'] = true;
  //     childItem.data['TitleNew'] = childItem?.data?.Title;
  //     if (childItem?.data?.ServicesId[0] != undefined) {
  //       childItem.data.Services.push({ Id: childItem?.data?.ServicesId[0] });
  //     }
  //     if (childItem?.data?.ComponentId[0] != undefined) {
  //       childItem.data.Component.push({ Id: childItem?.data?.ComponentId[0] });
  //     }
  //     if (childItem?.data?.ServicesId != undefined && childItem?.data?.ServicesId?.length > 0) {
  //       MainId = childItem.data.ServicesId[0]
  //     }
  //     if (childItem.data.ComponentId != undefined && childItem.data.ComponentId.length > 0) {
  //       MainId = childItem.data.ComponentId[0]
  //     }
  //     if (childItem.data.ParentTaskId != undefined && childItem.data.ParentTaskId != "") {
  //       ParentTaskId = childItem.data.ParentTaskId
  //     }
  //     if (childItem?.data?.DueDate != undefined && childItem?.data?.DueDate != "" && childItem?.data?.DueDate != "Invalid date") {
  //       childItem.data.DueDate = childItem.data.DueDate ? Moment(childItem?.data?.DueDate).format("MM-DD-YYYY") : null
  //     }

  //     if (AllItems != undefined) {
  //       AllItems.forEach((val: any) => {
  //         val.flag = true;
  //         val.show = false;
  //         if ( val?.Id == MainId ||(val.subRows != undefined && val.subRows.length > 0)) {
  //           if (val?.Id == MainId) {
  //             val.subRows.push(childItem.data);
  //           }
  //           if (val.subRows != undefined && val.subRows.length > 0) {
  //             val.subRows.forEach((type: any) => {
  //               if (type?.Id == MainId) {
  //                 val.flag = true;
  //                 type.subRows.push(childItem.data);
  //               } else {
  //                 AllItems.push(childItem.data);
  //               }
  //             });
  //           }
  //         } else {
  //           AllItems.push(childItem.data);
  //         }
  //       });
  //       AllItems = AllItems.filter((val: any, id: any, array: any) => {
  //         return array.indexOf(val) == id;
  //       });
  //       setData(AllItems => ([...AllItems]))
  //       refreshData();
  //       rerender();
  //     }
  //   }
  // }, []);


  const TimeEntryCallBack = React.useCallback((item1) => {
    setIsTimeEntry(false);
  }, []);
  let isOpenPopup = false;
  const onPopUpdata = function (item: any) {
    isOpenPopup = true;
    item.data.subRows = [];
    item.data.flag = true;
    item.data.siteType = "Master Tasks";
    item.data.TitleNew = item.data.Title;
    item.data.childsLength = 0;
    item.data["Shareweb_x0020_ID"] = item.data.PortfolioStructureID;
    if (checkedList != undefined && checkedList.length > 0)
      checkedList[0].subRows.unshift(item.data);
    else AllItems.unshift(item.data);

    setSharewebComponent(item.data);
    setIsComponent(true);
    setData((data) => [...AllItems]);
  };
  // const CloseCall = React.useCallback((item) => {
  //   if (item.CreateOpenType === "CreatePopup") {
  //     onPopUpdata(item.CreatedItem[0]);
  //   } else if (!isOpenPopup && item.CreatedItem != undefined) {
  //     item.CreatedItem.forEach((obj: any) => {
  //       obj.data.subRows = [];
  //       obj.data.flag = true;
  //       obj.data.TitleNew = obj.data.Title;
  //       // obj.data.Team_x0020_Members=item.TeamMembersIds;
  //       // obj.AssignedTo =item.AssignedIds;
  //       obj.data.siteType = "Master Tasks";
  //       obj.data["Shareweb_x0020_ID"] = obj.data.PortfolioStructureID;
  //       if (item.props != undefined && item.props.SelectedItem != undefined) {
  //         item.props.SelectedItem.subRows =
  //           item.props.SelectedItem.subRows == undefined
  //             ? []
  //             : item.props.SelectedItem.subRows;
  //         if (item.props.SelectedItem.subRows.length === 0) {
  //           item.props.SelectedItem.downArrowIcon =
  //             IsUpdated != undefined && IsUpdated == "Service"
  //               ? GlobalConstants.MAIN_SITE_URL +
  //               "/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
  //               : GlobalConstants.MAIN_SITE_URL +
  //               "/SP/SiteCollectionImages/ICONS/24/list-icon.png";
  //           item.props.SelectedItem.RightArrowIcon =
  //             IsUpdated != undefined && IsUpdated == "Service"
  //               ? GlobalConstants.MAIN_SITE_URL +
  //               "/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
  //               : GlobalConstants.MAIN_SITE_URL +
  //               "/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
  //         }
  //         item.props.SelectedItem.subRows.unshift(obj.data);
  //       }
  //     });
  //     if (AllItems != undefined && AllItems.length > 0) {
  //       AllItems.forEach((comp: any, index: any) => {
  //         if (
  //           comp?.Id != undefined &&
  //           item.props.SelectedItem != undefined &&
  //           comp?.Id === item.props.SelectedItem?.Id
  //         ) {
  //           comp.childsLength = item.props.SelectedItem.subRows.length;
  //           comp.show = comp.show == undefined ? false : comp.show;
  //           if (comp.subRows.length === 0) {
  //             comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
  //             comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
  //           }
  //           comp.subRows = item.props.SelectedItem.subRows;
  //         }
  //         if (comp.subRows != undefined && comp.subRows.length > 0) {
  //           comp.subRows.forEach((subcomp: any, index: any) => {
  //             if (
  //               subcomp?.Id != undefined &&
  //               item.props.SelectedItem != undefined &&
  //               subcomp?.Id === item.props.SelectedItem?.Id
  //             ) {
  //               subcomp.childsLength = item.props.SelectedItem.subRows.length;
  //               subcomp.show = subcomp.show == undefined ? false : subcomp.show;
  //               if (comp.subRows.length === 0) {
  //                 subcomp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
  //                 subcomp.RightArrowIcon =
  //                   item.props.SelectedItem.RightArrowIcon;
  //               }
  //               subcomp.subRows = item.props.SelectedItem.subRows;
  //             }
  //           });
  //         }
  //       });
  //       // }
  //     }
  //     setData((AllItems) => [...AllItems]);
  //     refreshData()
  //     rerender()
  //   }
  //   if (!isOpenPopup && item.data != undefined) {
  //     item.data.subRows = [];
  //     item.data.flag = true;
  //     item.data.TitleNew = item.data.Title;
  //     item.data.siteType = "Master Tasks";
  //     item.data.childsLength = 0;
  //     item.data["Shareweb_x0020_ID"] = item.data.PortfolioStructureID;
  //     AllItems.unshift(item.data);
  //     // setData((data) => [...AllItems]);
  //     setData((AllItems) => [...AllItems]);
  //     refreshData()
  //     rerender()
  //   }
  //   setAddModalOpen(false);
  // }, []);


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
    if (props.ClientCategory.results.length != 0) {
      props.ClientCategory.results.map((terms: any) => {

        myarray2.push(terms);
      });
    }

  }
  const [lgShow, setLgShow] = React.useState(false);
  function handleClose() {
    selectedCategory = [];
    setLgShow(false);
  }
  const [lgNextShow, setLgNextShow] = React.useState(false);
  const handleCloseNext = () => setLgNextShow(false);
  const [CreateacShow, setCreateacShow] = React.useState(false);
  const handleCreateac = () => setCreateacShow(false);

  const handleSuffixHover = (item: any) => {
    item.Display = "block";
    setData((data) => [...data]);
  };

  const handleuffixLeave = (item: any) => {
    item.Display = "none";
    setData((data) => [...data]);
  };
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
        let parentcat:any=[];
          // if(MeetingItems[0]?.ClientCategory!=undefined && (MeetingItems[0]?.ClientCategory?.results?.length>0||MeetingItems[0]?.ClientCategory?.length>0)){
          //   if(MeetingItems[0]?.ClientCategory?.results?.length>0){
          //     MeetingItems[0]?.ClientCategory?.results?.map((items:any)=>{
          //       parentcat.push(items)
          //     })
          //   }else{
          //     MeetingItems[0]?.ClientCategory?.map((items:any)=>{
          //       parentcat.push(items)
          //     })
          //   }
           
          //   setSelectedClientCategory(parentcat)
          //   selectedClientCategoryPopup=true
          // }
        if (items != undefined && items.length > 0) {
          MeetingItems[0].ClientCategory = [];
          items.forEach((val: any) => {
            MeetingItems[0].ClientCategory.push(val);
          });
        }
        if (MeetingItems[0].SharewebTaskType != undefined) {
          
          if (MeetingItems[0].SharewebTaskType.Title == "Activities") {
            // selectedClientCategoryPopup=true
            // if(selectedClientCategoryPopup==false){
              
            //   setWSPopup(true);
             
            // }
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
      let parentcat:any=[];
      // if( childsData[0]?.ClientCategory!=undefined &&  childsData[0]?.ClientCategory?.length>0){
      //   childsData[0]?.ClientCategory?.map((items:any)=>{
      //     parentcat.push(items)
      //   })
      //   setSelectedClientCategory(parentcat)
      //   selectedClientCategoryPopup=true
      // }
      MeetingItems.push(childsData[0]);
      if (childsData[0].SharewebTaskType.Title == "Activities") {
        // if(selectedClientCategoryPopup==false){
        // setWSPopup(true);
        // }
        setWSPopup(true);
        //setMeetingItems(childsData)
      }
      if (
        childsData[0] != undefined &&
        childsData[0].SharewebTaskType.Title == "Workstream"
      ) {
        childsData[0].ClientTime=JSON.parse(childsData[0].ClientTime)
        MeetingItems.push(childsData[0]);
        //setActivityPopup(true)
       
          childsData[0].NoteCall = "Task";
          setMeetingPopup(true);
         
       
       
      }
    }
  };
  const buttonRestructuring = () => {
    var ArrayTest: any = [];
    //  if (checkedList != undefined && checkedList.length === 1) {
      setComponentRestruct(true);
    if (
      checkedList.length > 0 &&
      checkedList[0].subRows != undefined &&
      checkedList[0].subRows.length > 0 &&
      checkedList[0].Item_x0020_Type === "Component"
    )
      alert("You are not allowed to Restructure this item.");
    if (
      checkedList.length > 0 &&
      checkedList[0].subRows != undefined &&
      checkedList[0].subRows.length === 0 &&
      checkedList[0].Item_x0020_Type === "Component"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj?.Id === checkedList[0]?.Id) obj.isRestructureActive = false;
        ArrayTest.push(...[obj]);
        if (obj.subRows != undefined && obj.subRows.length > 0) {
          obj.subRows.forEach((sub: any) => {
            if (sub.Item_x0020_Type === "SubComponent") {
              sub.isRestructureActive = true;
              // ArrayTest.push(sub)
            }
          });
        }
      });
    }
    if (
      checkedList.length > 0 &&
      checkedList[0].Item_x0020_Type === "SubComponent"
    ) {
      maidataBackup.forEach((obj) => {
          obj.isRestructureActive = true;
        if (obj?.Id === checkedList[0]?.Id && obj.Item_x0020_Type != 'Task') {
          obj.isRestructureActive = false;
          ArrayTest.push(...[obj]);
        }
        if (obj.subRows != undefined && obj.subRows.length > 0) {
          obj.subRows.forEach((sub: any) => {
            if (sub?.Id === checkedList[0]?.Id && sub.Item_x0020_Type != 'Task') {
              obj.isRestructureActive = false;
              ArrayTest.push(...[obj]);
              ArrayTest.push(...[sub]);
              // ArrayTest.push(sub)
            }
          });
        }
      });
    }
    if (
      checkedList.length > 0 &&
      checkedList[0].Item_x0020_Type === "Feature"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj?.Id === checkedList[0]?.Id && obj.Item_x0020_Type != 'Task') {
          obj.isRestructureActive = false;
        }

        if (obj.subRows != undefined && obj.subRows.length > 0) {
          obj.subRows.forEach((sub: any) => {
            sub.isRestructureActive = true;
            if (sub?.Id === checkedList[0]?.Id && sub.Item_x0020_Type != 'Task') {
              sub.isRestructureActive = false;
              obj.isRestructureActive = false;
              ArrayTest.push(...[obj]);
              ArrayTest.push(...[sub]);
            }
            if (sub.subRows != undefined && sub.subRows.length > 0) {
              sub.subRows.forEach((newsub: any) => {
                if (newsub?.Id === checkedList[0]?.Id && newsub.Item_x0020_Type != 'Task') {
                  ArrayTest.push(...[obj]);
                  ArrayTest.push(...[sub]);
                  ArrayTest.push(...[newsub]);
                }
              });
            }
          });
        }
      });
    } else if (
      checkedList.length > 0 &&
      checkedList[0].Item_x0020_Type === "Task"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj?.Id === checkedList[0]?.Id) {
          ArrayTest.push(...[obj]);
        }
        if (obj.subRows != undefined && obj.subRows.length > 0) {
          obj.subRows.forEach((sub: any) => {
            if (
              sub.Item_x0020_Type === "SubComponent" ||
              sub.Item_x0020_Type === "Feature"
            )
              sub.isRestructureActive = true;
            if (sub?.Id === checkedList[0]?.Id) {
              ArrayTest.push(...[obj]);
              ArrayTest.push(...[sub]);
              // ArrayTest.push(sub)
            }
            if (sub.subRows != undefined && sub.subRows.length > 0) {
              sub.subRows.forEach((subchild: any) => {
                if (
                  subchild.Item_x0020_Type === "SubComponent" ||
                  subchild.Item_x0020_Type === "Feature"
                )
                  subchild.isRestructureActive = true;
                if (subchild?.Id === checkedList[0]?.Id) {
                  ArrayTest.push(...[obj]);
                  ArrayTest.push(...[sub]);
                  ArrayTest.push(...[subchild]);
                  // ArrayTest.push(sub)
                }
                if (
                  subchild.subRows != undefined &&
                  subchild.subRows.length > 0
                ) {
                  subchild.subRows.forEach((listsubchild: any) => {
                    if (listsubchild?.Id === checkedList[0]?.Id) {
                      ArrayTest.push(...[obj]);
                      ArrayTest.push(...[sub]);
                      ArrayTest.push(...[subchild]);
                      ArrayTest.push(...[listsubchild]);
                    }
                  });
                }
                if (
                  subchild.subRows != undefined &&
                  subchild.subRows.length > 0
                ) {
                  subchild.subRows.forEach((listsubchild: any) => {
                    if (listsubchild?.Id === checkedList[0]?.Id) {
                      ArrayTest.push(...[obj]);
                      ArrayTest.push(...[sub]);
                      ArrayTest.push(...[subchild]);
                      ArrayTest.push(...[listsubchild]);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    if (props.Item_x0020_Type !== "SubComponent") IsShowRestru = true;
    maidataBackup.forEach((obj) => {
      if (obj.isRestructureActive === false) {
        if (obj.subRows != undefined && obj.subRows.length > 0) {
          obj.subRows.forEach((sub: any) => {
            sub.isRestructureActive = false;
            if (sub.subRows != undefined && sub.subRows.length > 0) {
              sub.subRows.forEach((newsub: any) => {
                newsub.isRestructureActive = false;
              });
            }
          });
        }
      }
    });
    setOldArrayBackup(ArrayTest);
    setData((data) => [...maidataBackup]);

    //  }
    // setAddModalOpen(true)
  };

  const RestruringCloseCall = () => {
    setResturuningOpen(false);
  };
  const OpenModal = (item: any) => {
    var TestArray: any = [];
    setResturuningOpen(true);
    maidataBackup.forEach((obj) => {
      if (obj?.Id === item?.Id)
        TestArray.push(obj);
      if (obj.subRows != undefined && obj.subRows.length > 0) {
        obj.subRows.forEach((sub: any) => {
          sub.isRestructureActive = true;
          if (sub?.Id === item?.Id && sub.Item_x0020_Type != 'Task') {
            //TestArray.push(obj)
            TestArray.push(...[obj]);
            TestArray.push(...[sub]);
          }
          if (sub.subRows != undefined && sub.subRows.length > 0) {
            sub.subRows.forEach((newsub: any) => {
              if (newsub?.Id === item?.Id && newsub.Item_x0020_Type != 'Task') {
                TestArray.push(...[obj]);
                TestArray.push(...[sub]);
                TestArray.push(...[newsub]);
              }
            });
          }
        });
      }
    });
    setChengedItemTitle(checkedList[0].Item_x0020_Type);
    ChengedTitle =
      checkedList[0].Item_x0020_Type === "Feature"
        ? "SubComponent"
        : checkedList[0].Item_x0020_Type === "SubComponent"
          ? "Component"
          : checkedList[0].Item_x0020_Type;
    let Items: any = [];
    if (OldArrayBackup.length > 1)
      Items.push(OldArrayBackup[OldArrayBackup.length - 1]);
    else Items = checkedList;
    setRestructureChecked(Items);
    if (TestArray.length === 0) {
      OldArrayBackup.unshift(props);
      TestArray.push(props);
    }else OldArrayBackup.unshift(props);
    //     setNewArrayBackup(NewArrayBackup => ([...props]));
    //    else
    setNewArrayBackup((NewArrayBackup) => [...TestArray]);
  };
  var PortfolioLevelNum: any = 0;
  const setRestructure = (item: any, title: any) => {
    let array: any = [];
    item.Item_x0020_Type = title;
    if (item != undefined && title === "SubComponent") {
      item.SiteIcon =
        IsUpdated != undefined && IsUpdated == "Service"
          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png"
          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png";

      ChengedTitle = "Component";
    }
    if (item != undefined && title === "Feature") {
      item.SiteIcon =
        IsUpdated != undefined && IsUpdated == "Service"
          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"
          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png";
      ChengedTitle = "SubComponent";
    }
    setChengedItemTitle(title);
    array.push(item);
    setRestructureChecked((RestructureChecked: any) => [...array]);
    maidataBackup.forEach((obj) => {
      if (obj?.Id === item?.Id) {
        PortfolioLevelNum = obj.subRows.length + 1;
      }
      if (obj.subRows != undefined && obj.subRows.length > 0) {
        obj.subRows.forEach((sub: any) => {
          if (sub?.Id === item?.Id) {
            PortfolioLevelNum = sub.subRows.length + 1;
          }
          if (sub.subRows != undefined && sub.subRows.length > 0) {
            sub.subRows.forEach((newsub: any) => {
              if (newsub?.Id === item?.Id) {
                PortfolioLevelNum = newsub.subRows.length + 1;
              }
            });
          }
        });
      }
    });
    // setRestructureChecked(item);
  };
  let changetoTaxType: any = "";
  const UpdateTaskRestructure = async function () {
    var Ids: any = [];
    if (NewArrayBackup != undefined && NewArrayBackup.length > 0) {
      NewArrayBackup.forEach((obj, index) => {
        if (NewArrayBackup.length - 1 === index) Ids.push(obj?.Id);
      });
    }

    let web = new Web(NextProp?.siteUrl);
    await web.lists
      .getById(checkedList[0].listId)
      .items.getById(checkedList[0]?.Id)
      .update({
        // EventsId: checkedList[0].Portfolio_x0020_Type === 'Event' ? { "results": Ids } : [],
        //    '__metadata': { 'type': 'SP.Data.'+checkedList[0].siteType+'ListItem' },
        ComponentId:
          checkedList[0].Portfolio_x0020_Type === "Component"
            ? { results: Ids }
            : { results: [] },
        ServicesId:
          checkedList[0].Portfolio_x0020_Type === "Service"
            ? { results: Ids }
            : { results: [] },
      })
      .then((res: any) => {
        maidataBackup.forEach((obj, index) => {
          obj.isRestructureActive = false;
          if (obj?.Id === checkedList[0]?.Id) {
            maidataBackup.splice(index, 1);
            if (obj.subRows.length === 0) {
              obj.downArrowIcon = "";
              obj.RightArrowIcon = "";
            }
          }
          if (obj.subRows != undefined && obj.subRows.length > 0) {
            obj.subRows.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub?.Id === checkedList[0]?.Id) {
                obj.subRows.splice(indexsub, 1);
                if (sub.subRows.length === 0) {
                  sub.downArrowIcon = "";
                  sub.RightArrowIcon = "";
                }
              }
              if (sub.subRows != undefined && sub.subRows.length > 0) {
                sub.subRows.forEach((newsub: any, lastIndex: any) => {
                  newsub.isRestructureActive = false;
                  if (newsub?.Id === checkedList[0]?.Id) {
                    sub.subRows.splice(lastIndex, 1);
                    if (newsub.subRows.length === 0) {
                      newsub.downArrowIcon = "";
                      newsub.RightArrowIcon = "";
                    }
                  }
                  if (newsub.subRows != undefined && newsub.subRows.length > 0) {
                    newsub.subRows.forEach((newsub1: any, lastIndex: any) => {
                      newsub1.isRestructureActive = false;
                      if (newsub1?.Id === checkedList[0]?.Id) {
                        newsub1.subRows.splice(lastIndex, 1);
                        if (newsub1.subRows.length === 0) {
                          newsub1.downArrowIcon = "";
                          newsub1.RightArrowIcon = "";
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        });
        let flag = true;
        maidataBackup.forEach((obj, index) => {
          if (obj?.Id === Ids[0]) {
            obj.flag = true;
            obj.show = true;
            obj.downArrowIcon =
              obj.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            obj.RightArrowIcon =
              obj.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            flag = false;
            obj.subRows.push(checkedList[0]);
            obj.childsLength = obj.subRows.length;
          }
          if (obj.subRows != undefined && obj.subRows.length > 0) {
            obj.subRows.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub?.Id === Ids[0]) {
                sub.flag = true;
                sub.show = true;
                sub.downArrowIcon =
                  sub.Portfolio_x0020_Type == "Service"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                sub.RightArrowIcon =
                  sub.Portfolio_x0020_Type == "Service"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
                flag = false;
                sub.subRows.push(checkedList[0]);
                sub.childsLength = sub.subRows.length;
              }
              if (sub.subRows != undefined && sub.subRows.length > 0) {
                sub.subRows.forEach((newsub: any, lastIndex: any) => {
                  if (newsub?.Id === Ids[0]) {
                    newsub.flag = true;
                    newsub.show = true;
                    newsub.downArrowIcon =
                      newsub.Portfolio_x0020_Type == "Service"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                    newsub.RightArrowIcon =
                      newsub.Portfolio_x0020_Type == "Service"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
                    flag = false;
                    newsub.subRows.push(checkedList[0]);
                    newsub.childsLength = newsub.subRows.length;
                  }
                });
              }
            });
          }
        });
        if (flag) maidataBackup.push(checkedList[0]);
        setData((data) => [...maidataBackup]);
        RestruringCloseCall();
      });
  };
  const UpdateRestructure = async function () {
    let PortfolioStructureIDs: any = "";
    var Item: any = "";
    let flag: any = true;
    let ChengedItemTitle: any = "";
    // if (ChengedItemTitle === '' && RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].Item_x0020_Type == 'Component') {
    //     ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
    // }
    if (
      RestructureChecked != undefined &&
      RestructureChecked.length > 0 &&
      RestructureChecked[0].Item_x0020_Type == "Feature"
    ) {
      ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
    } else if (
      RestructureChecked != undefined &&
      RestructureChecked.length > 0 &&
      RestructureChecked[0].Item_x0020_Type == "SubComponent"
    ) {
      ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
    }
    // else if (ChengedItemTitl !== '' && RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].Item_x0020_Type == 'Feature') {
    //     ChengedItemTitle = 'SubComponent';
    //     flag = true;
    // }
    // else if (ChengedItemTitle !== '' && RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].Item_x0020_Type == 'SubComponent') {
    //     ChengedItemTitle = 'Component';
    //     flag = true;
    // }
    let count: any = 0;
    let newItem: any = "";
    if (NewArrayBackup.length === 1) newItem = NewArrayBackup[0];
    else {
      // if (flag) {
      NewArrayBackup.forEach((newe: any) => {
        if (ChengedTitle != "" && newe.Item_x0020_Type === ChengedTitle)
          newItem = newe;
        else if (newe.Item_x0020_Type === ChengedItemTitle) newItem = newe;
      });
      // }
      // if (!flag) {
      //     NewArrayBackup.forEach((newe1: any) => {
      //         if (newe1.Item_x0020_Type !== ChengedItemTitle)
      //             newItem = newe1;
      //     })
      // }
    }
    maidataBackup.forEach((obj) => {
      if (obj?.Id === newItem?.Id) {
        PortfolioLevelNum = obj.subRows.length + 1;
        flag = false;
      }
      if (obj.subRows != undefined && obj.subRows.length > 0) {
        obj.subRows.forEach((sub: any) => {
          if (sub?.Id === newItem?.Id) {
            obj.subRows.forEach((leng: any) => {
              if (leng.Item_x0020_Type === newItem.Item_x0020_Type) count++;
            });
            PortfolioLevelNum = count + 1;
            flag = false;
          }
          if (sub.subRows != undefined && sub.subRows.length > 0) {
            sub.subRows.forEach((newsub: any) => {
              if (newsub?.Id === newItem?.Id) {
                sub.subRows.forEach((subleng: any) => {
                  if (subleng.Item_x0020_Type === newItem.Item_x0020_Type)
                    count++;
                });
                PortfolioLevelNum = count + 1;
                flag = false;
              }
            });
          }
        });
      }
    });
    if (NewArrayBackup != undefined && NewArrayBackup.length > 0) {
      NewArrayBackup.forEach((newobj: any) => {
        if (ChengedTitle != "" && newobj.Item_x0020_Type === ChengedTitle)
          Item = newobj;
        else if (
          ChengedTitle === "" &&
          ChengedItemTitle === newobj.Item_x0020_Type
        )
          Item = newobj;
      });
    }
    if (Item === "") Item = NewArrayBackup[0];
    if (
      Item !== undefined &&
      Item.PortfolioStructureID != undefined &&
      ChengedItemTitle != undefined
    ) {
      PortfolioStructureIDs =
        Item.PortfolioStructureID +
        "-" +
        ChengedItemTitle.slice(0, 1) +
        PortfolioLevelNum;
      // if (Item != undefined)
      //     PortfolioStructureIDs = Item.PortfolioStructureID + '-' + ChengedItemTitle.slice(0, 1) + PortfolioLevelNum;
    }
    if (flag === true) {
      let findItem = maidataBackup.filter((obj: any) => obj.Item_x0020_Type === checkedList[0]?.Item_x0020_Type)
      var result = findItem[findItem.length - 1];
      PortfolioLevelNum = result.PortfolioLevel + 1
      PortfolioStructureIDs = Item.PortfolioStructureID + "-" + ChengedItemTitle.slice(0, 1) + PortfolioLevelNum;

    }
    var UploadImage: any = [];

    var item: any = {};
    if (ChengedItemTitl === undefined) {
      let web = new Web(NextProp?.siteUrl);
      await web.lists
        .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
        .items.getById(checkedList[0]?.Id)
        .update({
          ParentId: Item?.Id,
          PortfolioLevel: PortfolioLevelNum,
          PortfolioStructureID: PortfolioStructureIDs,
        })
        .then((res: any) => {
          if (ChengedItemTitl === undefined) {
            checkedList[0].Shareweb_x0020_ID = PortfolioStructureIDs;
            checkedList[0].PortfolioStructureID = PortfolioStructureIDs;
            checkedList[0].PortfolioLevel = PortfolioLevelNum;
            if (Item.subRows != undefined) {
              Item.subRows.push(checkedList[0]);
            } else {
              Item.subRows = [];
              Item.subRows.push(checkedList[0]);
            }
          }
          console.log(res);
          setData((data) => [...maidataBackup]);
          RestruringCloseCall();
          //setModalIsOpenToFalse();
        });
    }
    setComponentRestruct(false);
    if (ChengedItemTitl != undefined && ChengedItemTitl != "") {
      let web = new Web(NextProp?.siteUrl);
      await web.lists
        .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
        .items.getById(checkedList[0]?.Id)
        .update({
          ParentId: Item?.Id,
          PortfolioLevel: PortfolioLevelNum,
          PortfolioStructureID: PortfolioStructureIDs,
          Item_x0020_Type: ChengedItemTitl,
        })
        .then((res: any) => {
          console.log(res);
          maidataBackup.forEach((obj, index) => {
            obj.isRestructureActive = false;
            if (obj?.Id === checkedList[0]?.Id) {
              //  maidataBackup[index].subRows.splice(index, 1)
              checkedList[0].downArrowIcon = obj.downArrowIcon;
              checkedList[0].RightArrowIcon = obj.RightArrowIcon;
            }
            if (obj.subRows != undefined && obj.subRows.length > 0) {
              obj.subRows.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub?.Id === checkedList[0]?.Id) {
                  obj.subRows.splice(indexsub, 1);
                  checkedList[0].downArrowIcon = obj.downArrowIcon;
                  checkedList[0].RightArrowIcon = obj.RightArrowIcon;
                }
                if (sub.subRows != undefined && sub.subRows.length > 0) {
                  sub.subRows.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub?.Id === checkedList[0]?.Id) {
                      sub.subRows.splice(lastIndex, 1);

                      checkedList[0].downArrowIcon = obj.downArrowIcon;
                      checkedList[0].RightArrowIcon = obj.RightArrowIcon;
                    }
                  });
                }
              });
            }
          });
          checkedList[0].PortfolioStructureID = PortfolioStructureIDs;
          checkedList[0].Shareweb_x0020_ID = PortfolioStructureIDs;
          checkedList[0].PortfolioLevel = PortfolioLevelNum;
          checkedList[0].IsNew = true;
          checkedList[0].Item_x0020_Type = ChengedItemTitl;
          if (Item.subRows != undefined) {
            checkedList[0].downArrowIcon =
              Item.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            checkedList[0].RightArrowIcon =
              Item.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

            Item.subRows.push(checkedList[0]);
          } else {
            Item.subRows = [];
            Item.show = true;
            Item.downArrowIcon = checkedList[0].downArrowIcon;
            Item.RightArrowIcon = checkedList[0].RightArrowIcon;
            // Item.show = Item.show == undefined ? false : Item.show
            // Item.downArrowIcon = item.props.SelectedItem.downArrowIcon;
            // Item.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
            Item.subRows.push(checkedList[0]);
          }
          setCheckedList((checkedList) => [...[]]);
          setData((data) => [...maidataBackup]);
          RestruringCloseCall();
        });
    }
    // setResturuningOpen(true)
  };

  var SomeMetaData1 = [
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 15,
      Title: "MileStone",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      SmartFilters: {
        __metadata: { type: "Collection(Edm.String)" },
        results: [],
      },
      SortOrder: 2,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 24,
      SmartSuggestions: null,
      ID: 15,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)",
        etag: '"4"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 105,
      Title: "Development",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png",
      },
      SmartFilters: null,
      SortOrder: 3,
      TaxType: "Category",
      Selectable: true,
      ParentID: 0,
      SmartSuggestions: null,
      ID: 105,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)",
        etag: '"1"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 282,
      Title: "Implementation",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1:
        "This should be tagged if a task is for applying an already developed component/subcomponent/feature.",
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description: "/SiteCollectionImages/ICONS/Shareweb/Implementation.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png",
      },
      SmartFilters: null,
      SortOrder: 4,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 24,
      SmartSuggestions: false,
      ID: 282,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 11,
      Title: "Bug",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png",
      },
      SmartFilters: {
        __metadata: { type: "Collection(Edm.String)" },
        results: ["MetaSearch", "Dashboard"],
      },
      SortOrder: 2,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 24,
      SmartSuggestions: null,
      ID: 11,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)",
        etag: '"5"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 96,
      Title: "Feedback",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png",
      },
      SmartFilters: null,
      SortOrder: 2,
      TaxType: null,
      Selectable: true,
      ParentID: 0,
      SmartSuggestions: false,
      ID: 96,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)",
        etag: '"3"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 191,
      Title: "Improvement",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1:
        "Use this task category for any improvements of EXISTING features",
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png",
      },
      SmartFilters: null,
      SortOrder: 12,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 24,
      SmartSuggestions: false,
      ID: 191,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 12,
      Title: "Design",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: {
        __metadata: { type: "SP.FieldUrlValue" },
        Description:
          "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png",
        Url: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png",
      },
      SmartFilters: {
        __metadata: { type: "Collection(Edm.String)" },
        results: ["MetaSearch", "Dashboard"],
      },
      SortOrder: 4,
      TaxType: "Categories",
      Selectable: true,
      ParentID: 165,
      SmartSuggestions: null,
      ID: 12,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 100,
      Title: "Activity",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: null,
      SmartFilters: null,
      SortOrder: 4,
      TaxType: null,
      Selectable: true,
      ParentID: null,
      SmartSuggestions: null,
      ID: 100,
    },
    {
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists;(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)",
        etag: '"13"',
        type: "SP.Data.SmartMetadataListItem",
      },
      Id: 281,
      Title: "Task",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: null,
      SmartFilters: null,
      SortOrder: 4,
      TaxType: null,
      Selectable: true,
      ParentID: null,
      SmartSuggestions: null,
      ID: 281,
    },
  ] as unknown as {
    siteName: any;
    siteUrl: any;
    listId: any;
    Description1: any;
    results: any[];
    SmartSuggestions: any;
    SmartFilters: any;
  }[];
  console.log(siteConfig);
  console.log(siteConfig);

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
            </button>{" "}
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
              )}{" "}
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
            />{" "}
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
              )}{" "}
              {row?.original?.SiteIcon != undefined ? (
                <a className="hreflink" title="Show All Child" data-toggle="modal" >
                  <img className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 icon-sites-img ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 icon-sites-img ml20 me-1" : row?.original?.SharewebTaskType?.Title == "Activities" ? "ml-36 icon-sites-img ml20 me-1" :
                    row?.original?.SharewebTaskType?.Title == "Workstream" ? "ml-48 icon-sites-img ml20 me-1" : row?.original?.SharewebTaskType?.Title == "Task" || row?.original?.Item_x0020_Type ==="Task" && row?.original?.SharewebTaskType == undefined ? "ml-60 icon-sites-img ml20 me-1" : "icon-sites-img ml20 me-1"
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
            <ReactPopperTooltip ShareWebId={getValue()} row={row} />
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
                )}{" "}

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
      {
        accessorFn: (row) => row?.smartTime,
        cell: ({ row }) => (
          <>
            {row?.original?.Item_x0020_Type == "Task" && row?.original?.siteType != "Master Tasks" && (

              <>
                <span>{row?.original?.smartTime}</span>
              </>

            )}
          </>
        ),
        id: "smartTime",
        placeholder: "SmartTime",
        header: "",
        size: 56,
      },
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
        cell: ({ row, getValue }) => (
          <>

            {row?.original?.siteType === "Master Tasks" && row?.original?.isRestructureActive && (
              <a href="#" data-bs-toggle="tooltip" data-bs-placement="auto" title="Edit">
                <img className="icon-sites-img" src={row?.original?.Restructuring} onClick={(e) => OpenModal(row?.original)} />
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
                <span onClick={() => OpenModal(props)}>
                  <img
                    className="icon-sites-img"
                    src={IsUpdated == "Service" ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png'}

                  />
                </span>
                : ''
            }

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

  // const table = useReactTable({
  //   data,
  //   columns,
  //   state: {
  //     columnFilters,
  //     expanded,
  //     sorting,
  //     rowSelection,
  //   },
  //   onColumnFiltersChange: setColumnFilters,
  //   onSortingChange: setSorting,
  //   onExpandedChange: setExpanded,
  //   getSubRows: (row) => row.subRows,
  //   onRowSelectionChange: setRowSelection,
  //   getCoreRowModel: getCoreRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getExpandedRowModel: getExpandedRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   debugTable: true,
  //   filterFromLeafRows: true,
  //   enableSubRowSelection: false,
  //   filterFns: undefined
  // });/

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
      childsData=[]
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

 
  // const parentClientCat = React.useCallback((items:any) => {

  //   console.log(items)
  
  //   if(items!=undefined ){
  // console.log(selectedClientCategory)
  //  MeetingItemsParentcat[0]=items
  
  //   }
  //  selectedClientCategoryPopup=false;
  //  if(items?.SharewebTaskType?.Title == "Workstream"){
  //       items.NoteCall="Task"
  //       setMeetingPopup(true);
  //     }
      
  //     if(items?.SharewebTaskType?.Title == "Activities"){
  //       setWSPopup(true);
         
  //     }
      
  // if(items?.SharewebTaskType==undefined){
  //   setActivityPopup(true);
  // }
  
     
  
     
  
  //     // setSelectedClientCategory(items)
  
     
  
  // }, [])

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

            {/* {(selectedCategory != undefined && selectedCategory.length > 0) ?
                        <button type="button" onClick={() => setLgShow(true)}
                            disabled={ActivityDisable} className="btn btn-primary" title=" Add Activity-Task">
                            Add Activity-Task
                        </button>
                        :*/}
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
              className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
              disabled={true}
            >
              Compare
            </button> */}
            <a className="expand">
              <ExpndTable prop={expndpopup} prop1={tablecontiner} />
            </a>
            <a>
              <Tooltip ComponentId="1263" />
            </a>
          </span>

        </div>
        <div className="col-sm-12 p-0 smart mt-1 ">
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
      {/* {selectedClientCategoryPopup&&selectedClientCategory.length>0? <SelectedClientCategoryPupup1 items={MeetingItems[0]} callback={parentClientCat} />:""} */}
      {/* {popupStatus ? <EditInstitution props={itemData} /> : null} */}
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
        {/* <div className="modal-header  mt-1 px-3">
                            <h5 className="modal-title" id="exampleModalLabel"> Select Client Category</h5>
                            <button onClick={closeTaskStatusUpdatePoup2} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div> */}

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
              {/* {
                                    
                                    MeetingItems.SharewebTaskType == undefined  &&
                                        <ul className="quick-actions">

                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={(e) => CreateMeetingPopups('Implementation')}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png" />

                                                    </span>
                                                    Implmentation
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Development')}>
                                                    <span className="icon-sites">
                                                        <img className="icon-sites"
                                                            src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png" />

                                                    </span>
                                                    Development
                                                </div>
                                            </li>
                                            <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                                                <div onClick={() => CreateMeetingPopups('Activities')}>
                                                    <span className="icon-sites">
                                                    </span>
                                                    Activity
                                                </div>
                                            </li>
                                        </ul>
                                         
                                    } */}
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
                    All below selected items will become child of{" "}
                    <img
                      className="icon-sites-img me-1 "
                      src={NewArrayBackup[0].SiteIcon}
                    ></img>{" "}
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
                    </a>{" "}
                    please click Submit to continue.
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div>
                <span> Old: </span>
                {OldArrayBackup.map(function (obj: any, index) {
                  return (
                    <span>
                      {" "}
                      <img
                        className="icon-sites-img me-1 ml20"
                        src={obj.SiteIcon}
                      ></img>
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          NextProp.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          obj?.Id
                        }
                      >
                        <span>{obj.Title} </span>
                      </a>
                      {OldArrayBackup.length - 1 < index ? ">" : ""}{" "}
                    </span>
                  );
                })}
              </div>
              <div>
                <span> New: </span>{" "}
                {NewArrayBackup.map(function (newobj: any, indexnew) {
                  return (
                    <>
                      <span>
                        {" "}
                        <img
                          className="icon-sites-img me-1 ml20"
                          src={newobj.SiteIcon}
                        ></img>
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active"
                          href={
                            NextProp.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" +
                            newobj?.Id
                          }
                        >
                          <span>{newobj.Title} </span>
                        </a>
                        {NewArrayBackup.length - 1 < indexnew ? ">" : ""}
                      </span>
                    </>
                  );
                })}
                <span>
                  {" "}
                  {RestructureChecked != undefined && RestructureChecked.length > 0 && RestructureChecked[0].SiteIcon != undefined &&    <img
                    className="icon-sites-img me-1 ml20"
                    src={RestructureChecked[0].SiteIcon}
                  ></img>}
                  <a
                    data-interception="off"
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      NextProp.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" +
                      RestructureChecked[0]?.Id
                    }
                  >
                    <span>{RestructureChecked[0].Title} </span>
                  </a>
                </span>
              </div>
              {console.log(
                "restructure functio test in div==================================="
              )}
              {checkedList != undefined &&
                checkedList.length > 0 &&
                checkedList[0].Item_x0020_Type != "Task" ? (
                <div>
                  <span>
                    {" "}
                    {"Select Component Type :"}
                    <input
                      type="radio"
                      name="fav_language"
                      value="SubComponent"
                      checked={
                        RestructureChecked[0].Item_x0020_Type == "SubComponent"
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setRestructure(RestructureChecked[0], "SubComponent")
                      }
                    />
                    <label className="ms-1"> {"SubComponent"} </label>
                  </span>
                  <span>
                    {" "}
                    <input
                      type="radio"
                      name="fav_language"
                      value="SubComponent"
                      checked={
                        RestructureChecked[0].Item_x0020_Type === "Feature"
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setRestructure(RestructureChecked[0], "Feature")
                      }
                    />{" "}
                    <label className="ms-1"> {"Feature"} </label>{" "}
                  </span>
                </div>
              ) : (
                ""
              )}
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
      
    </div>
  
  );
}