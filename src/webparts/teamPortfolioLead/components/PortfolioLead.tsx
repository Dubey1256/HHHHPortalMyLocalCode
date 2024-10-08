import * as React from "react";
import { Panel, PanelType } from "office-ui-fabric-react";
import { FaCompressArrowsAlt, FaFilter, } from "react-icons/fa";
import pnp, { Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import CreateAllStructureComponent from "../../../globalComponents/CreateAllStructure";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row } from '@tanstack/react-table';
import Tooltip from "../../../globalComponents/Tooltip";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import { ColumnDef } from "@tanstack/react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightableCell from "../../../globalComponents/GroupByReactTableComponents/highlight";
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import PageLoader from "../../../globalComponents/pageLoader";
import CompareTool from "../../../globalComponents/CompareTool/CompareTool";
import InlineEditingcolumns from "../../../globalComponents/inlineEditingcolumns";

import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import TrafficLightComponent from "../../../globalComponents/TrafficLightVerification/TrafficLightComponent";
// import { FluentAccordion, FluentAccordionItem } from '@fluentui/react-components';
var filt: any = "";
var ContextValue: any = {};
let backupAllMaster: any = [];
let childRefdata: any;
let copyDtaArray: any = [];
let portfolioColor: any = '';
let isUpdated: any = "";
let simpleArray: any = "";
let groupedData: any = [];
let allMasterTaskDataFlatLoadeViewBackup: any = [];
let renderData: any = [];
type MyRowData = {
  Items: string | null;
  original: {
    Items: string | null;
  };
};
const GroupByDashboard = (SelectedProp: any) => {
  const childRef = React.useRef<any>();
  if (childRef != null) {
    childRefdata = { ...childRef };

  }
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
  ContextValue = SelectedProp;
  const refreshData = () => setData(() => renderData);
  const [data, setData]: any = React.useState([]);
  copyDtaArray = data;
  const [AllUsers, setTaskUser] = React.useState([]);
  const [AllMetadata, setMetadata] = React.useState([])
  const [loaded, setLoaded] = React.useState(false);

  const [RestrucPopup, SetRestrucPopup] = React.useState(false);
  const [AllClientCategory, setAllClientCategory] = React.useState([])
  const [IsUpdated, setIsUpdated] = React.useState("");
  const [RestructredItem, SetRestructredItem] = React.useState<any>({});
  const [checkedList, setCheckedList] = React.useState<any>({});
  const [AllMasterTasksData, setAllMasterTasks] = React.useState([]);
  const [portfolioTypeData, setPortfolioTypeData] = React.useState([])
  const [FlatarrayData, setFlatarrayData] = React.useState([]);
  const [taskTypeData, setTaskTypeData] = React.useState([])
  const [portfolioTypeDataItem, setPortFolioTypeIcon] = React.useState([]);
  const [taskTypeDataItem, setTaskTypeDataItem] = React.useState([]);
  const [selecteditems, setselecteditems] = React.useState([]);
  const [restructureLead, setRestructureLead] = React.useState<any>({});

  const [OpenAddStructurePopup, setOpenAddStructurePopup] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [SharewebTask, setSharewebTask] = React.useState("");
  const [checkedList1, setCheckedList1] = React.useState([]);
  const [projectArrayMasterTask, setprojectArrayMasterTask]: any = React.useState([]);
  const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
  const [precentComplete, setPrecentComplete] = React.useState([])
  const [openCompareToolPopup, setOpenCompareToolPopup] = React.useState(false);
  const rerender = React.useReducer(() => ({}), {})[1];
  const [portfolioTypeConfrigration, setPortfolioTypeConfrigration] = React.useState<any>([{ Title: 'Component', Suffix: 'C', Level: 1 }, { Title: 'SubComponent', Suffix: 'S', Level: 2 }, { Title: 'Feature', Suffix: 'F', Level: 3 }]);
  let Response: any = [];
  let TaskUsers: any = [];
  type GroupedDataItem = {
    AssignedTo: string;
    Items: any[];
    TeamMembers: any[];
  };
  let props = undefined;


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
        "Approver/Title",
        "Approver/Id",
        "AssingedToUser/EMail",
        "AssingedToUser/Id",
        "AssingedToUser/Name",
        "UserGroup/Id",
        "UserGroup/Title",
        "ItemType"
      )
      .expand("AssingedToUser", "UserGroup", "Approver")
      .get();
    Response = taskUsers;
    TaskUsers = Response;
    setTaskUser(Response);
    console.log(Response);
  };

  const getPortFolioType = async () => {
    let web = new Web(ContextValue.siteUrl);
    let PortFolioType = [];
    PortFolioType = await web.lists
      .getById(ContextValue.PortFolioTypeID)
      .items.select(
        "Id",
        "Title",
        "Color",
        "IdRange"
      )
      .get();
    setPortfolioTypeData(PortFolioType);
  };
  const onRenderCustomCalculateSCmulti = () => {
    return (
      <>
        <div className="subheading siteColor">Restucturing Tool</div>

        {/* <div>
          <Tooltip ComponentId="454" />
        </div> */}
      </>
    );
  };
  const getTaskType = async () => {
    let web = new Web(ContextValue.siteUrl);
    let taskTypeData = [];
    let typeData: any = [];
    taskTypeData = await web.lists
      .getById(ContextValue.TaskTypeID)
      .items.select(
        'Id',
        'Level',
        'Title',
        'SortOrder',
      )
      .get();
    setTaskTypeData(taskTypeData);
    if (taskTypeData?.length > 0 && taskTypeData != undefined) {
      taskTypeData?.forEach((obj: any) => {
        if (obj != undefined) {
          let Item: any = {};
          Item.Title = obj.Title;
          Item.SortOrder = obj.SortOrder;
          Item[obj.Title + 'number'] = 0;
          Item[obj.Title + 'filterNumber'] = 0;
          Item[obj.Title + 'numberCopy'] = 0;
          typeData.push(Item);
        }
      })
      console.log("Task Type retrieved:", typeData);
      typeData = typeData.sort((elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder);
      setTaskTypeDataItem(typeData);
    }
  };

  const GetSmartmetadata = async () => {
    let siteConfigSites: any = []
    var Priority: any = []
    let PrecentComplete: any = [];
    let Categories: any = [];
    let web = new Web(ContextValue.siteUrl);
    let smartmetaDetails: any = [];
    smartmetaDetails = await web.lists
      .getById(ContextValue.SmartMetadataListID)
      .items.select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Configurations", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
      .top(4999).expand("Parent").get();
    setAllClientCategory(smartmetaDetails?.filter((metadata: any) => metadata?.TaxType == 'Client Category'));
    smartmetaDetails?.map((newtest: any) => {
      // if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
      if (newtest.Title == "SDC Sites" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
        newtest.DataLoadNew = false;
      else if (newtest.TaxType == 'Sites') {
        siteConfigSites.push(newtest)
      }
      if (newtest?.TaxType == 'Priority Rank') {
        Priority?.push(newtest)
      }
      if (newtest?.TaxType === 'Percent Complete' && newtest?.Title != 'In Preparation (0-9)' && newtest?.Title != 'Ongoing (10-89)' && newtest?.Title != 'Completed (90-100)') {
        PrecentComplete.push(newtest);
      }
      if (newtest.TaxType == 'Categories') {
        Categories.push(newtest);
      }
    })
    setMetadata(smartmetaDetails);
  };
  const findPortFolioIconsAndPortfolio = async () => {
    try {
      let newarray: any = [];
      const ItemTypeColumn = "Item Type";
      console.log("Fetching portfolio icons...");
      const field = await new Web(ContextValue.siteUrl)
        .lists.getById(ContextValue?.MasterTaskListID)
        .fields.getByTitle(ItemTypeColumn)
        .get();
      console.log("Data fetched successfully:", field?.Choices);

      if (field?.Choices?.length > 0 && field?.Choices != undefined) {
        field?.Choices?.forEach((obj: any) => {
          if (obj != undefined) {
            let Item: any = {};
            Item.Title = obj;
            Item[obj + 'number'] = 0;
            Item[obj + 'filterNumber'] = 0;
            Item[obj + 'numberCopy'] = 0;
            newarray.push(Item);
          }
        })
        if (newarray.length > 0) {
          newarray = newarray.filter((findShowPort: any) => {
            let match = portfolioTypeConfrigration.find((config: any) => findShowPort.Title === config.Title);
            if (match) {
              findShowPort.Level = match?.Level;
              findShowPort.Suffix = match?.Suffix;
              return true
            }
            return false
          });
        }
        console.log("Portfolio icons retrieved:", newarray);
        setPortFolioTypeIcon(newarray);
      }
    } catch (error) {
      console.error("Error fetching portfolio icons:", error);
    }
  };
  const GetComponents = async () => {
    let filt = "";
    if (portfolioTypeData?.length > 0) {
      portfolioTypeData.forEach((elem: any) => {
        if (isUpdated === "") {
          filt = "";
        } else if (isUpdated === elem.Title || isUpdated?.toLowerCase() === elem?.Title?.toLowerCase()) {
          filt = "(PortfolioType/Title eq '" + elem.Title + "')";
        }
      });
    }

    let componentDetails: any = [];
    componentDetails = await globalCommon.GetServiceAndComponentAllData(SelectedProp);
    console.log(componentDetails);

    componentDetails?.AllData?.forEach((result: any) => {
      if (result.HelpInformationVerified == null || result.HelpInformationVerified == undefined)
        result.HelpInformationVerified = false;
      portfolioTypeDataItem?.map((type: any) => {
        if (result?.Item_x0020_Type === type.Title && result.PortfolioType != undefined) {
          type[type.Title + 'number'] += 1;
          type[type.Title + 'filterNumber'] += 1;
        }
      })
    });

    try {
      allMasterTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(componentDetails?.GetAllMasterTaskData));
    } catch (error) {
      console.log("backup Json parse error Page Loade master task Data");
    }

    const groupedData = groupByAssignedTo(componentDetails?.GetAllMasterTaskData, AllUsers);
    let copySiticonedata = componentDetails?.GetAllMasterTaskData;
    const projectArrayMasterTask = copySiticonedata.filter((item: any) => item.Item_x0020_Type === 'Project');
    copySiticonedata = copySiticonedata.filter((item: any) => item.Item_x0020_Type !== 'Project');
    console.log(projectArrayMasterTask);

    copySiticonedata?.map((item: any) => {
      item.Project = [];
      projectArrayMasterTask.map((data: any) => {
        if (data.Portfolios.length > 0)
          data.Portfolios.map((portfolioitem: any) => {
            if (item.Id === portfolioitem.Id) {

              item.Project.push(data);

            }

          })


      })

    })

    copySiticonedata?.map((item: any) => {
      if (item.Item_x0020_Type != undefined) {
        item.SiteIconTitle = item.Item_x0020_Type?.charAt(0);
      }

    });

    setAllMasterTasks(copySiticonedata);
    backupAllMaster = componentDetails?.GetAllMasterTaskData;
    backupAllMaster = backupAllMaster.filter((item: any) => item.Item_x0020_Type !== 'Project');

    let groupedDatacopy = sortGroupedData(groupedData);
    groupedDatacopy?.map((item: any) => {
      AllUsers?.map((data: any) => {
        if (data?.Approver && data.Approver[0]?.Title) {
          if (data.Approver[0].Title === 'Sameer  Gupta') {
            data.Approver[0].Title = 'Sameer Gupta';
          }
          if (data.Approver[0].Title === 'Anshu  Mishra') {
            data.Approver[0].Title = 'Anshu Mishra';
          }
          if (data.Approver[0].Title == 'Vivek Anand') {
            data.Approver[0].Title = 'Vivekanand';
          }
        }

        if (data?.Approver?.length > 0 && item?.AssignedTo === data?.Approver[0].Title) {
          if (!item.TeamMembers) {
            item.TeamMembers = [];
          }
          if (!item.TeamMembers.some((member: any) => member.ID === data.ID)) {
            item.TeamMembers.push(data);
          }
        }
      });
    });



    setData(groupedDatacopy); // Set the grouped data
    setLoaded(true);
  };

  const closePanel = () => {
    SetRestrucPopup(false);



  };
  const sortGroupedData = (groupedData: GroupedDataItem[]): GroupedDataItem[] => {
    return groupedData.sort((a, b) => {
      const assignedToA = a.AssignedTo.toLowerCase();
      const assignedToB = b.AssignedTo.toLowerCase();

      if (assignedToA < assignedToB) {
        return -1;
      }
      if (assignedToA > assignedToB) {
        return 1;
      }
      return 0;
    });
  };

  const groupByAssignedTo = (data: any[], allUsers: any[]) => {
    let groupedData: any[] = [];
    const filteredUsers = allUsers.filter(user => user.UserGroup && user.UserGroup.Title === 'Portfolio Lead Team');
    filteredUsers.forEach(user => {
      groupedData.push({
        AssignedToId: user.AssingedToUser.Id,
        AssignedTo: user.Title,
        Items: [],
        TeamMembers: []
      });
    });

    data?.forEach(item => {
      if (item?.AssignedTo && item?.Item_x0020_Type !== 'Project') {
        item?.AssignedTo?.forEach((user: { Title: string }) => {
          for (let i = 0; i < groupedData.length; i++) {
            if (user.Title == 'Sameer  Gupta') {
              user.Title = 'Sameer Gupta';
            }
            if (user.Title == 'Anshu  Mishra') {
              user.Title = 'Anshu Mishra';
            }
            if (user.Title == 'Vivek Anand') {
              user.Title = 'Vivekanand';
            }
            if (groupedData[i].AssignedTo == user.Title) {
              groupedData[i].Items.push(item);
              break;
            }
          }
        });
      }
    });

    groupedData = groupedData.filter(group => group.Items.length > 0);
    groupedData.forEach(item => {
      if (item.AssignedTo) {
        item.subRows = getFlattenedSubRows(item.Items);
        item.Items = item.AssignedTo;
      }
    });

    return groupedData;
  };


  // Function to recursively get all items from nested subRows
  const getFlattenedSubRows = (items: any[]): any[] => {
    let flattened: any[] = [];

    items.forEach(item => {
      if (item.subRows && item.subRows.length > 0) {
        flattened = flattened.concat(getFlattenedSubRows(item.subRows));
      }
      flattened.push(item);
    });

    return flattened;
  };







  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let query = params.get("PortfolioType");
    if (query) {
      setIsUpdated(query);
      isUpdated = query;
    }
  }, [])
  React.useEffect(() => {
    setLoaded(false);
    findPortFolioIconsAndPortfolio();
    GetSmartmetadata();
    getTaskUsers();
    getPortFolioType();
    getTaskType();
  }, [])
  React.useEffect(() => {
    if (AllMetadata.length > 0 && portfolioTypeData.length > 0) {
      GetComponents();
    }
  }, [AllMetadata.length > 0 && portfolioTypeData.length > 0])

  // const findUserByName = (name: any) => {
  //   const user = AllUsers.filter(
  //     (itm: any) => itm?.ID === name
  //   );
  //   let Image: any;
  //   if (user[0]?.Item_x0020_Cover != undefined) {
  //     Image = user[0].Item_x0020_Cover.Url;
  //   } else { Image = "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"; }
  //   return user ? Image : null;
  // };
  const findUserByName = (name: any) => {
    const users = AllUsers.filter((itm: any) => itm?.ID === name || itm?.AssingedToUser?.Id == name);
    let Image: any;

    if (users.length > 0 && users[0]?.Item_x0020_Cover) {
      Image = users[0].Item_x0020_Cover.Url;
    } else {
      Image = "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
    }

    return users.length > 0 ? Image : null;
  };
  const OpenRestPopup = (item: any) => {
    SetRestrucPopup(true);
    setRestructureLead(item);
    console.log(checkedList1)

  }

  const mySortType = (
    rowA: Row<MyRowData>,
    rowB: Row<MyRowData>,
    columnId: string
  ) => {
    const a = rowA.original?.Items ?? "";
    const b = rowB.original?.Items ?? "";
    return a.localeCompare(b);
  };
  const Restructurebutton = (
    <button type="button" className="btn btn-primary" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}`, color: '#fff' }} onClick={() => RestructureCsf(selecteditems)}>Restructure</button>


  )
  const inlineCallBack = React.useCallback((item: any) => {
    let ComponentsData: any = [];
    let AllMasterItem = backupAllMaster;
    AllMasterItem = AllMasterItem?.map((result: any) => {
      if (result?.Id == item?.Id) {
        return { ...result, ...item };
      }
      return result;
    })

    AllMasterItem?.map((result: any) => {
      if (result?.Item_x0020_Type == 'Component') {
        const groupedResult = globalCommon?.componentGrouping(result, AllMasterItem)
        ComponentsData.push(groupedResult?.comp);
      }
    })
    setAllMasterTasks(AllMasterItem)

    setData(ComponentsData)


  }, []);

  const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: true,
        hasExpanded: true,
        isHeaderNotAvlable: false,
        size: 55,
        id: 'Id',
      },

      {
        accessorFn: (row) => row?.Items,
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.Items && (
              <span className='text-content'>
                {row?.original?.Items}
              </span>
            )}
          </>
        ),
        id: "Items",
        placeholder: "Portfolio Leads",

        resetColumnFilters: false,
        size: 100,
        isColumnVisible: true
      },
      {
        accessorFn: (row) => row?.portfolioItemsSearch,
        cell: ({ row, getValue }) => (
          <div className="alignCenter">
            {row?.original?.SiteIcon != undefined ? (
              <div className="alignCenter" title="Show All Child">
                <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
                  row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember me-1"
                }
                  src={row?.original?.SiteIcon}>
                </img>
              </div>
            ) : (
              <>
                {/* <div className={
  row?.original?.subRows?.some((subRow: any) => subRow?.Item_x0020_Type === "SubComponent") ? "ml-12 Dyicons" :
  row?.original?.subRows?.some((subRow: any) => subRow?.Item_x0020_Type === "Feature") ? "ml-24 Dyicons" :
  row?.original?.subRows?.some((subRow: any) => subRow?.TaskType?.Title === "Task") ? "ml-60 Dyicons" :
  "Dyicons"
}>
  {row?.original?.subRows?.find((iteam: any) => iteam?.SiteIconTitle)?.SiteIconTitle || row?.original?.SiteIconTitle}
</div> */}
                {row?.original?.Title != "Others" ? (
                  <div
                    title={row?.original?.Item_x0020_Type}
                    className={
                      row?.original?.SiteIconTitle === undefined ? '' : (
                        row?.original?.Item_x0020_Type === "SubComponent" ? "ml-12 Dyicons" :
                          row?.original?.Item_x0020_Type === "Feature" ? "ml-24 Dyicons" :
                            row?.original?.TaskType?.Title === "Activities" ? "ml-36 Dyicons" :
                              row?.original?.TaskType?.Title === "Workstream" ? "ml-48 Dyicons" :
                                row?.original?.TaskType?.Title === "Task" ? "ml-60 Dyicons" :
                                  "Dyicons"
                      )
                    }
                  >
                    {row?.original?.SiteIconTitle}
                  </div>
                ) : (
                  ""
                )}


              </>
            )}
          </div>
        ),
        id: "portfolioItemsSearch",
        placeholder: "Type",
        header: "",
        resetColumnFilters: false,
        size: 30,
        isColumnVisible: true
      },

      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <div className="alignCenter">
            <span className="columnFixedTitle">
              {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                  href={ContextValue.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
                  <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                </a>
              )}
              {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                  href={ContextValue.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
                  <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                </a>
              )}
              {row?.original.Title === "Others" ? (
                <span className="text-content" title={row?.original?.Title} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>{row?.original?.Title}</span>
              ) : (
                ""
              )}
            </span>
            {row?.original?.Categories == 'Draft' ?
              <FaCompressArrowsAlt style={{ height: '11px', width: '20px', color: `${row?.original?.PortfolioType?.Color}` }} /> : ''}

          </div>
        ),
        id: "Title",
        placeholder: "Title",
        header: "",
        resetColumnFilters: false,
        size: 250,
        isColumnVisible: true
      },
      {
        accessorFn: (row) => row?.Project?.map((subRow: any) => subRow).join(", ") || '',
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.Project?.map((subRow: any, index: number) => (
              <span key={index} className='text-content'>
                <a
                  className="text-content hreflink"
                  data-interception="off"
                  target="_blank"
                  style={row?.original?.fontColorTask
                    ? { color: row.original.fontColorTask }
                    : { color: row.original?.PortfolioType?.Color }}
                  href={`${ContextValue.siteUrl}/SitePages//PX-Profile.aspx?ProjectId=${subRow.ID}`}
                >
                  {subRow.PortfolioStructureID}
                </a>
              </span>
            )) || null}
          </>
        ),
        id: "Items",
        placeholder: "Projects",
        resetColumnFilters: false,
        size: 180,
        isColumnVisible: true
      },



      {
        accessorFn: (row) => row?.TeamMembers,
        cell: ({ row, column }) => (
          <div className="alignCenter">
            {row?.original?.TeamMembers == null ? ("") : (
              Array.isArray(row?.original?.TeamMembers) && row?.original?.TeamMembers.length > 0 && (
                row?.original?.TeamMembers.map((user: { Id: React.Key; Title: string; }) => (
                  <a
                    key={user?.Id}
                    className="alignCenter"
                    href={`${ContextValue?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${user?.Id}&Name=${user?.Title}`}
                    target="_blank"
                    data-interception="off"
                  >
                    <img
                      title={user?.Title}
                      className="workmember ms-1"
                      src={findUserByName(user?.Id)}
                    />
                  </a>
                ))
              )
            )}
          </div>
        ),
        id: 'teamMembers',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Team members",
        isColumnVisible: true,
        filterFn: (row, columnName, filterValue) => {
          if (row?.original?.TeamMembers?.some((user: { Title: { toLowerCase: () => { (): any; new(): any; includes: { (arg0: any): any; new(): any; }; }; }; }) => user?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()))) {
            return true;
          } else {
            return false;
          }
        },
        header: "",
        size: 125
      },

      {
        cell: ({ row }) => (
          <>
            {row.original.Item_x0020_Type !== undefined && (
              <a
                href="#"
                data-bs-toggle="tooltip"
                data-bs-placement="auto"
                title={'Edit ' + `${row.original.Title}`}
              >
                <span
                  className="alignIcon svg__iconbox svg__icon--edit"
                  onClick={(e) => EditComponentPopup(row?.original)}
                ></span>
              </a>
            )}
          </>
        ),
        id: "editIcon",
        canSort: false,
        placeholder: "",
        header: "",
        size: 30,
        isColumnVisible: true
      },
      {
        cell: ({ row }) => (
          <>
            {row.original.restructureIcon == true && (
              <a

                onClick={(e) => OpenRestPopup(row?.original)}

              >
                <img
                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png"
                  alt="Restructuring Tool"
                  style={{ width: '30px', height: '30px' }}
                />
              </a>
            )}
          </>
        ),
        id: "restructure",
        placeholder: "",
        header: "",
        size: 30,
        isColumnVisible: true
      }





    ],
    [ContextValue, allMasterTaskDataFlatLoadeViewBackup, SelectedProp, portfolioTypeData, isUpdated, setAllMasterTasks]
  );


  function deletedDataFromPortfolios(dataArray: any, idToDelete: any, siteName: any) {
    let updatedArray = [];
    let itemDeleted = false;
    for (let item of dataArray) {
      if (item.Id === idToDelete && item.siteType === siteName) {
        itemDeleted = true;
        continue;
      }
      let newItem = { ...item };
      if (newItem.subRows && newItem.subRows.length > 0) {
        newItem.subRows = deletedDataFromPortfolios(newItem.subRows, idToDelete, siteName);
      }
      updatedArray.push(newItem);
      if (itemDeleted) {
        return updatedArray;
      }
    }
    return updatedArray;
  }
  const updatedDataDataFromPortfolios = (copyDtaArray: any, dataToUpdate: any) => {
    for (let i = 0; i < copyDtaArray.length; i++) {
      if ((dataToUpdate?.Portfolio?.Id === copyDtaArray[i]?.Portfolio?.Id && dataToUpdate?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToUpdate?.siteType) || (dataToUpdate?.Id === copyDtaArray[i]?.Id && copyDtaArray[i]?.siteType === dataToUpdate?.siteType)) {
        copyDtaArray[i] = { ...copyDtaArray[i], ...dataToUpdate };
        return true;
      } else if (copyDtaArray[i].subRows) {
        if (updatedDataDataFromPortfolios(copyDtaArray[i].subRows, dataToUpdate)) {
          return true;
        }
      }
    }
    return false;
  };
  const addedCreatedDataFromAWT = (arr: any, dataToPush: any) => {
    for (let val of arr) {
      if (dataToPush?.PortfolioId === val.Id && dataToPush?.ParentTask?.Id === undefined) {
        val.subRows = val.subRows || [];
        val?.subRows?.push(dataToPush);
        return true;
      } else if (dataToPush?.ParentTask?.Id === val.Id && dataToPush?.siteType === val?.siteType) {
        val.subRows = val.subRows || [];
        val?.subRows?.push(dataToPush);
        return true;
      } else if (val?.subRows) {
        if (addedCreatedDataFromAWT(val.subRows, dataToPush)) {
          return true;
        }
      }
    }
    return false;
  };
  const Call = (res: any, UpdatedData: any) => {
    if (res === "Close") {
      setIsComponent(false);
    } else if (res?.data && res?.data?.ItmesDelete != true && !UpdatedData) {
      childRef?.current?.setRowSelection({});
      setIsComponent(false);
      if (addedCreatedDataFromAWT(copyDtaArray, res.data)) {
        renderData = [];
        renderData = renderData.concat(copyDtaArray)
        refreshData();
      }
    } else if (res?.data?.ItmesDelete === true && res?.data?.Id && (res?.data?.siteName || res?.data?.siteType) && !UpdatedData) {
      setIsComponent(false);
      if (res?.data?.siteName) {
        copyDtaArray = deletedDataFromPortfolios(copyDtaArray, res.data.Id, res.data.siteName);
      } else {
        copyDtaArray = deletedDataFromPortfolios(copyDtaArray, res.data.Id, res.data.siteType);
      }
      renderData = [];
      renderData = renderData.concat(copyDtaArray)
      refreshData();
    } else if (res?.data?.ItmesDelete != true && res?.data?.Id && res?.data?.siteType && UpdatedData) {
      setIsComponent(false);
      const updated = updatedDataDataFromPortfolios(copyDtaArray, res?.data);
      if (updated) {
        renderData = [];
        renderData = renderData.concat(copyDtaArray)
        refreshData();
      } else {
        console.log("Data with the specified PortfolioId was not found.");
      }

    }
  }

  const callBackData = React.useCallback((checkData: any) => {
    checkedList1.push(checkData);
    setCheckedList1(checkedList1)
  }, []);


  const callBackData1 = React.useCallback((getData: any, topCompoIcon: any) => {
    renderData = [];
    renderData = renderData.concat(getData);
    refreshData();
    setTopCompoIcon(topCompoIcon);
  }, []);


  //  Function to call the child component's function
  const callChildFunction = (items: any) => {
    if (childRef.current) {
      childRef.current.callChildFunction(items);
    }
  };

  const trueTopIcon = (items: any) => {
    if (childRef.current) {
      childRef.current.trueTopIcon(items);
    }
  };
  //-------------------------------------------------- restructuring function end---------------------------------------------------------------
  //// popup Edit Task And Component///
  const EditComponentPopup = (item: any) => {
    item["siteUrl"] = ContextValue.siteUrl;
    item["listName"] = "Master Tasks";
    setIsComponent(true);
    setSharewebComponent(item);
  };
  ///////////////////////////////////

  const OpenAddStructureModal = () => {
    setOpenAddStructurePopup(true);
  };
  const openCompareTool = () => {
    setOpenCompareToolPopup(true);
  }
  const compareToolCallBack = React.useCallback((compareData) => {
    if (compareData != "close") {
      setOpenCompareToolPopup(false);
    } else {
      setOpenCompareToolPopup(false);
    }
  }, []);
  const CreateOpenCall = React.useCallback((item) => { }, []);
  let isOpenPopup = false;
  const AddStructureCallBackCall = React.useCallback((item) => {
    childRef?.current?.setRowSelection({});

    if (!isOpenPopup && item.CreatedItem != undefined) {
      item.CreatedItem.forEach((obj: any) => {
        obj.data.childs = [];
        obj.data.subRows = [];
        obj.data.flag = true;
        obj.data.TitleNew = obj.data.Title;
        obj.data.siteType = "Master Tasks";
        // obj.data.SiteIconTitle = obj?.data?.Item_x0020_Type?.charAt(0);
        obj.data["TaskID"] = obj.data.PortfolioStructureID;
        obj.data.Author = { Id: obj.data.AuthorId }
        obj.data.Parent = { Id: obj?.data?.ParentId }
        if (
          item.props != undefined &&
          item.props.SelectedItem != undefined &&
          item.props.SelectedItem.subRows != undefined
        ) {
          item.props.SelectedItem.subRows =
            item.props.SelectedItem.subRows == undefined
              ? []
              : item.props.SelectedItem.subRows;
          item.props.SelectedItem.subRows.unshift(obj.data);
        }
      });
      if (copyDtaArray != undefined && copyDtaArray.length > 0) {
        copyDtaArray.forEach((compnew: any, index: any) => {
          if (compnew.subRows != undefined && compnew.subRows.length > 0) {
            item.props.SelectedItem.downArrowIcon = compnew.downArrowIcon;
            item.props.SelectedItem.RightArrowIcon = compnew.RightArrowIcon;
            return false;
          }
        });
        copyDtaArray.forEach((comp: any, index: any) => {
          if (
            comp.Id != undefined &&
            item.props.SelectedItem != undefined &&
            comp.Id === item.props.SelectedItem.Id
          ) {
            comp.childsLength = item.props.SelectedItem.subRows.length;
            comp.show = comp.show == undefined ? false : comp.show;
            comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
            comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;

            comp.subRows = item.props.SelectedItem.subRows;
          }
          if (comp.subRows != undefined && comp.subRows.length > 0) {
            comp.subRows.forEach((subcomp: any, index: any) => {
              if (
                subcomp.Id != undefined &&
                item.props.SelectedItem != undefined &&
                subcomp.Id === item.props.SelectedItem.Id
              ) {
                subcomp.childsLength = item.props.SelectedItem.subRows.length;
                subcomp.show = subcomp.show == undefined ? false : subcomp.show;
                subcomp.childs = item.props.SelectedItem.childs;
                subcomp.subRows = item.props.SelectedItem.subRows;
                comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
              }
            });
          }
        });
        // }
      }
      if (item?.CreateOpenType === 'CreatePopup') {
        const openEditItem = (item?.CreatedItem != undefined ? item.CreatedItem[0]?.data : item.data);
        setSharewebComponent(openEditItem);
        setIsComponent(true);
      }
      renderData = [];
      renderData = renderData.concat(copyDtaArray)
      refreshData();

    }
    if (!isOpenPopup && item.data != undefined) {
      item.data.subRows = [];
      item.data.flag = true;
      item.data.TitleNew = item.data.Title;
      item.data.Author = { Id: item.data.AuthorId }
      item.data.siteType = "Master Tasks";
      if (portfolioTypeData != undefined && portfolioTypeData.length > 0) {
        portfolioTypeData.forEach((obj: any) => {
          if (item.data?.PortfolioTypeId != undefined)
            item.data.PortfolioType = obj;
        })
      }

      item.data["TaskID"] = item.data.PortfolioStructureID;
      copyDtaArray.unshift(item.data);
      renderData = [];
      renderData = renderData.concat(copyDtaArray)
      if (item?.CreateOpenType === 'CreatePopup') {
        const openEditItem = (item?.CreatedItem != undefined ? item.CreatedItem[0]?.data : item.data);
        setSharewebComponent(openEditItem);
        setIsComponent(true);
      }
      refreshData();
    }
    setOpenAddStructurePopup(false);
  }, []);

  const RestructureCsf = (items: any) => {
    const updatedData = data.map((item: any) => {
      if (item.Item_x0020_Type === undefined) {
        return { ...item, restructureIcon: true };
      }
      return item;
    });
  
    setData(updatedData);
  };
  const Saverestruc = () => {
    const web = new Web(ContextValue.siteUrl);
    const ListId = 'ec34b38f-0669-480a-910c-f84e92e58adf';

    checkedList1?.map((item: any) => {
      if (item?.AssignedTo != undefined) {
        item?.AssignedTo?.map((user: any) => {
          user.Title = restructureLead?.AssignedTo;
          user.Id = restructureLead?.AssignedToId
        })
      }
      var postData: any = {

        AssignedToId: {
          results:
            restructureLead?.AssignedToId != undefined
              ? [restructureLead?.AssignedToId]
              : [],
        },
      }
      if (item?.Id != undefined) {
        web.lists.getById(ListId).items.getById(item?.Id).update(postData)
          .then((result: any) => {
            console.log(result);
            SetRestrucPopup(false);
         //   refreshData();
           
           
            
            

          })
          .catch((err: any) => {
            console.log(err)
          })
      }
    })
  }



  const Cancelrestruc = () => {

  }
  return (
    <>
      <div>
        <section className="row p-0">
          <div className="col-sm-12 clearfix p-0">
            <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active heading ">
              <div>Portfolio Lead - Dashboard</div>
            </h2>
          </div>
        </section>
        <section className="Tabl1eContentSection row taskprofilepagegreen">
          <div className="container-fluid p-0">
            <section className="TableSection">
              <div className="container p-0">
                <div className="Alltable mt-2 ">
                  <div className="col-sm-12 p-0 smart">
                    <div>
                      <div>

                        <GlobalCommanTable hideAddActivityBtn={true} hideShowingTaskCountToolTip={true}
                          masterTaskData={allMasterTaskDataFlatLoadeViewBackup} precentComplete={precentComplete} AllMasterTasksData={AllMasterTasksData}
                          ref={childRef} callChildFunction={callChildFunction} columns={columns}
                          data={data} callBackData={callBackData} TaskUsers={AllUsers} showHeader={true} portfolioColor={portfolioColor} portfolioTypeData={portfolioTypeDataItem}
                          fixedWidth={true} portfolioTypeConfrigration={portfolioTypeConfrigration} showingAllPortFolioCount={true}
                          customTableHeaderButtons={Restructurebutton} customHeaderButtonAvailable={true}
                          setData={setData} setLoaded={setLoaded} AllListId={ContextValue} tableId="leadDashBoard"
                        />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>

      {RestrucPopup === true ? (
        <Panel isOpen={RestrucPopup} onRenderHeader={onRenderCustomCalculateSCmulti} isBlocking={false}
          type={PanelType.medium}
          onDismiss={closePanel} >
          <div className="mt-2">
            These all Porfolios will restructuring inside {restructureLead.AssignedTo}.
            <div>
              {/* <table className="my-2 border" style={{ width: "100%" }}>
                <tr className="bg-ee border">
                  <th className="p-1" style={{ width: "25px" }}></th>
                  <th className="p-1" style={{ width: "40px" }}>Icon</th>
                  <th className="p-1" style={{ width: "120px" }}>Id</th>
                  <th className="p-1">Title</th>
                </tr>
              </table> */}
            </div>
          </div>
          <footer className="mt-2 text-end">
            <button
              className="me-2 btn btn-primary" onClick={() => Saverestruc()} > Save </button>
            <button className="me-2 btn btn-default" onClick={() => Cancelrestruc()}>Cancel</button>
          </footer>
        </Panel>
      ) : (
        ""
      )}
      {IsComponent && (
        <EditInstituton item={SharewebComponent} Calls={Call} SelectD={SelectedProp} portfolioTypeData={portfolioTypeData}></EditInstituton>
      )}
      {!loaded && <PageLoader />}
    </>
  )
}
export default GroupByDashboard;