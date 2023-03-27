import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';
import {
  Button,
  Table,
  Row,
  Col,
  Pagination,
  PaginationLink,
  PaginationItem,
  Input,
} from "reactstrap";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaCaretDown,
  FaCaretRight,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  HeaderGroup,
} from "react-table";
import {
  Filter,
  DefaultColumnFilter,
} from "../../projectmanagementOverviewTool/components/filters";
import { FaAngleDown, FaAngleUp, FaHome } from "react-icons/fa";
import { Web } from "sp-pnp-js";
import EditProjectPopup from "../../projectmanagementOverviewTool/components/EditProjectPopup";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import * as Moment from "moment";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import axios, { AxiosResponse } from "axios";
import TagTaskToProjectPopup from "./TagTaskToProjectPopup";
import CreateTaskFromProject from "./CreateTaskFromProject";
import * as globalCommon from "../../../globalComponents/globalCommon";
import PortfolioTagging from "../../projectmanagementOverviewTool/components/PortfolioTagging";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import CommentCard from "../../../globalComponents/Comments/CommentCard";
import SmartInformation from "../../taskprofile/components/SmartInformation";
var QueryId: any = "";
let linkedComponentData: any = [];
let smartComponentData: any = [];
let portfolioType = "";
var AllUser: any = [];
var siteConfig: any = [];
var DataSiteIcon: any = [];
const ProjectManagementMain = (props: any) => {
  const [item, setItem] = React.useState({});
  const [ShareWebComponent, setShareWebComponent] = React.useState("");
  const [IsPortfolio, setIsPortfolio] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [AllTasks, setAllTasks] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
  const [Masterdata, setMasterdata] = React.useState<any>({});
  const [passdata, setpassdata] = React.useState("");
  const [projectTitle, setProjectTitle] = React.useState("");
  const [projectId, setProjectId] = React.useState(null);
  const [starIcon, setStarIcon]: any = React.useState(false);
  const [createTaskId, setCreateTaskId]=React.useState({});
  const [sidebarStatus, setSidebarStatus] = React.useState({
    sideBarFilter: false,
    dashboard: true,
    compoonents: true,
    services: true,
  });

  React.useEffect(() => {
    getQueryVariable((e: any) => e);
    GetMasterData();
    GetMetaData();
   try{
    var $myDiv = $("#spPageCanvasContent");
    $myDiv.css("max-width", "2400px");
   }catch(e){
    console.log(e);
   }
  }, []);
  var showProgressBar = () => {
    $(" #SpfxProgressbar").show();
  };
  var showProgressHide = () => {
    $(" #SpfxProgressbar").hide();
  };

  const getQueryVariable = async (variable: any) => {
    const params = new URLSearchParams(window.location.search);
    let query = params.get('ProjectId')
    QueryId = query;
    setProjectId(QueryId);
    console.log(query); //"app=article&act=news_content&aid=160990"
    return false;
  };

  const GetMasterData = async () => {
    AllUser = await globalCommon.loadTaskUsers();
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    let taskUsers: any = {};
    var AllUsers: any = [];
    taskUsers = await web.lists
      .getById("EC34B38F-0669-480A-910C-F84E92E58ADF")
      .items.select(
        "ComponentCategory/Id",
        "ComponentCategory/Title",
        "SiteCompositionSettings",
        "PortfolioStructureID",
        "ItemRank",
        "ShortDescriptionVerified",
        "Portfolio_x0020_Type",
        "BackgroundVerified",
        "descriptionVerified",
        "Synonyms",
        "BasicImageInfo",
        "Deliverable_x002d_Synonyms",
        "OffshoreComments",
        "OffshoreImageUrl",
        "HelpInformationVerified",
        "IdeaVerified",
        "TechnicalExplanationsVerified",
        "Deliverables",
        "DeliverablesVerified",
        "ValueAddedVerified",
        "CompletedDate",
        "Idea",
        "ValueAdded",
        "TechnicalExplanations",
        "Item_x0020_Type",
        "Sitestagging",
        "Package",
        "Parent/Id",
        "Parent/Title",
        "Short_x0020_Description_x0020_On",
        "Short_x0020_Description_x0020__x",
        "Short_x0020_description_x0020__x0",
        "Admin_x0020_Notes",
        "AdminStatus",
        "Background",
        "Help_x0020_Information",
        "SharewebComponent/Id",
        "SharewebCategories/Id",
        "SharewebCategories/Title",
        "Priority_x0020_Rank",
        "Reference_x0020_Item_x0020_Json",
        "Team_x0020_Members/Title",
        "Team_x0020_Members/Name",
        "Component/Id",
        "Services/Id",
        "Services/Title",
        "Services/ItemType",
        "Component/Title",
        "Component/ItemType",
        "Team_x0020_Members/Id",
        "Item_x002d_Image",
        "component_x0020_link",
        "IsTodaysTask",
        "AssignedTo/Title",
        "AssignedTo/Name",
        "AssignedTo/Id",
        "AttachmentFiles/FileName",
        "FileLeafRef",
        "FeedBack",
        "Title",
        "Id",
        "PercentComplete",
        "Company",
        "StartDate",
        "DueDate",
        "Comments",
        "Categories",
        "Status",
        "WebpartId",
        "Body",
        "Mileage",
        "PercentComplete",
        "Attachments",
        "Priority",
        "Created",
        "Modified",
        "Author/Id",
        "Author/Title",
        "Editor/Id",
        "Editor/Title",
        "ClientCategory/Id",
        "ClientCategory/Title"
      )
      .expand(
        "ClientCategory",
        "ComponentCategory",
        "AssignedTo",
        "Component",
        "Services",
        "AttachmentFiles",
        "Author",
        "Editor",
        "Team_x0020_Members",
        "SharewebComponent",
        "SharewebCategories",
        "Parent"
      )
      .getById(QueryId)
      .get();
    if ((taskUsers.PercentComplete = undefined))
      taskUsers.PercentComplete = (taskUsers?.PercentComplete * 100).toFixed(0);
    if (taskUsers.Body != undefined) {
      taskUsers.Body = taskUsers.Body.replace(/(<([^>]+)>)/gi, "");
    }
    let allPortfolios: any[] = [];
    allPortfolios = await globalCommon.getPortfolio("All");

    taskUsers.smartService = [];
    taskUsers?.ServicesId?.map((item: any) => {
      allPortfolios?.map((portfolio: any) => {
        if (portfolio?.Id == item) {
          portfolio.filterActive = false;
          taskUsers.smartService.push(portfolio);
        }
      });
    });
    taskUsers.smartComponent = [];
    taskUsers?.ComponentId?.map((item: any) => {
      allPortfolios?.map((portfolio: any) => {
        if (portfolio?.Id == item) {
          portfolio.filterActive = false;
          taskUsers.smartComponent.push(portfolio);
        }
      });
    });
    AllUsers.push(taskUsers);

    AllUsers?.map((items: any) => {
      items.AssignedUser = [];
      if (items.AssignedToId != undefined) {
        items.AssignedToId.map((taskUser: any) => {
          var newuserdata: any = {};

          AllUser?.map((user: any) => {
            if (user.AssingedToUserId == taskUser) {
              newuserdata["useimageurl"] = user.Item_x0020_Cover.Url;
              newuserdata["Suffix"] = user.Suffix;
              newuserdata["Title"] = user.Title;
              newuserdata["UserId"] = user.AssingedToUserId;
              items["Usertitlename"] = user.Title;
            }
          });
          items.AssignedUser.push(newuserdata);
        });
      }
    });
    if (AllUsers?.length > 0) {
      setProjectTitle(AllUsers[0].Title);
    }
    setMasterdata(AllUsers[0]);
  };

  const CallBack = React.useCallback(() => {
    setisOpenEditPopup(false);
  }, []);

  const GetMetaData = async () => {
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    let smartmeta = [];

    let TaxonomyItems = [];
    smartmeta = await web.lists
      .getById("01a34938-8c7e-4ea6-a003-cee649e8c67a")
      .items.select(
        "Id",
        "IsVisible",
        "ParentID",
        "Title",
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
        "Parent/Id",
        "Parent/Title"
      )
      .top(5000)
      .filter("TaxType eq 'Sites'")
      .expand("Parent")
      .get();
    siteConfig = smartmeta;
    LoadAllSiteTasks();
  };

  const EditPopup = React.useCallback((item: any) => {
    setisOpenEditPopup(true);
    setpassdata(item);
  }, []);
  const EditComponentPopup = (item: any) => {
    item["siteUrl"] = "https://hhhhteams.sharepoint.com/sites/HHHH/SP";
    item["listName"] = "Master Tasks";
    // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
    setIsComponent(true);
    setSharewebComponent(item);
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
  };
  const loadAdminConfigurations = function () {
    var CurrentSiteType = "";

    axios
      .get(
        "https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('e968902a-3021-4af2-a30a-174ea95cf8fa')/items?$select=Id,Title,Value,Key,Description,DisplayTitle,Configurations&$filter=Key eq 'TaskDashboardConfiguration'"
      )
      .then(
        (response: AxiosResponse) => {
          var SmartFavoritesConfig = [];
          $.each(response.data.value, function (index: any, smart: any) {
            if (smart.Configurations != undefined) {
              DataSiteIcon = JSON.parse(smart.Configurations);
            }
          });
        },
        function (error) { }
      );
  };
  const tagAndCreateCallBack = React.useCallback(() => {
    LoadAllSiteTasks();
  }, []);
  const LoadAllSiteTasks = function () {
    loadAdminConfigurations();
    var AllTask: any = [];
    var query =
      "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
    var Counter = 0;
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    var arraycount = 0;
    siteConfig.map(async (config: any) => {
      if (config.Title != "SDC Sites") {
        let smartmeta = [];
        smartmeta = await web.lists
          .getById(config.listId)
          .items.select(
            "Id,StartDate,DueDate,Title,SharewebCategories/Id,SharewebCategories/Title,PercentComplete,IsTodaysTask,Categories,Approver/Id,Approver/Title,Priority_x0020_Rank,Priority,ClientCategory/Id,SharewebTaskType/Id,SharewebTaskType/Title,ComponentId,ServicesId,ClientCategory/Title,Project/Id,Project/Title,Author/Id,Author/Title,Editor/Id,Editor/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,Component/Id,component_x0020_link,Component/Title,Services/Id,Services/Title"
          )
          .top(4999)
          .filter("ProjectId eq " + QueryId)
          .orderBy("Priority_x0020_Rank", false)
          .expand(
            "Project,SharewebCategories,AssignedTo,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,ClientCategory,Component,Services,SharewebTaskType,Approver"
          )
          .get();
        arraycount++;
        smartmeta.map((items: any) => {
          items.AllTeamMember = [];
          items.siteType = config.Title;
          items.listId = config.listId;
          items.siteUrl = config.siteUrl.Url;
          items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
          items.DisplayDueDate =
            items.DueDate != null
              ? Moment(items.DueDate).format("DD/MM/YYYY")
              : "";
          items.portfolio = {};
          if (items?.Component?.length > 0) {
            items.portfolio = items?.Component[0];
            items.PortfolioTitle = items?.Component[0]?.Title;
            items["Portfoliotype"] = "Component";
          }
          if (items?.Services?.length > 0) {
            items.portfolio = items?.Services[0];
            items.PortfolioTitle = items?.Services[0]?.Title;
            items["Portfoliotype"] = "Service";
          }
          if (DataSiteIcon != undefined) {
            DataSiteIcon.map((site: any) => {
              if (site.Site == items.siteType) {
                items["siteIcon"] = site.SiteIcon;
              }
            });
          }
          items.TeamMembersSearch = "";
          if (items.AssignedTo != undefined) {
            items?.AssignedTo?.map((taskUser: any) => {
              AllUser.map((user: any) => {
                if (user.AssingedToUserId == taskUser.Id) {
                  if (user?.Title != undefined) {
                    items.TeamMembersSearch =
                      items.TeamMembersSearch + " " + user?.Title;
                  }
                }
              });
            });
          }
          items.componentString =
            items.Component != undefined &&
              items.Component != undefined &&
              items.Component.length > 0
              ? getComponentasString(items.Component)
              : "";
          items.Shareweb_x0020_ID = globalCommon.getTaskId(items);
          if (items.Team_x0020_Members != undefined) {
            items.Team_x0020_Members.map((taskUser: any) => {
              var newuserdata: any = {};
              AllUser?.map((user: any) => {
                if (user.AssingedToUserId == taskUser.Id) {
                  newuserdata["useimageurl"] = user.Item_x0020_Cover.Url;
                  newuserdata["Suffix"] = user.Suffix;
                  newuserdata["Title"] = user.Title;
                  newuserdata["UserId"] = user.AssingedToUserId;
                  items["Usertitlename"] = user.Title;
                }
              });
              items.AllTeamMember.push(newuserdata);
            });
          }
          AllTask.push(items);
        });
        if (arraycount === 17) {
          setAllTasks(AllTask);
          setData(AllTask);
        }
      } else {
        arraycount++;
      }
    });
  };
  const getComponentasString = function (results: any) {
    var component = "";
    $.each(results, function (cmp: any) {
      component += cmp.Title + "; ";
    });
    return component;
  };

  React.useEffect(() => {
    if (Masterdata?.Id != undefined) {
      setItem(Masterdata);

      linkedComponentData = Masterdata?.smartService;
      smartComponentData = Masterdata?.smartComponent;
    }
  }, [Masterdata]);
  const EditPortfolio = (item: any, type: any) => {
    portfolioType = type;
    setIsPortfolio(true);
    setShareWebComponent(item);
  };
  const Call = (propsItems: any, type: any) => {
    setIsPortfolio(false);
    if (type === "Service") {
      if (propsItems?.smartService?.length > 0) {
        linkedComponentData = propsItems.smartService;
        TagPotfolioToProject();
      }
    }
    if (type === "Component") {
      if (propsItems?.smartComponent?.length > 0) {
        smartComponentData = propsItems.smartComponent;
        TagPotfolioToProject();
      }
    }
  };
  const TagPotfolioToProject = async () => {
    if (Masterdata?.Id != undefined) {
      let selectedComponent: any[] = [];
      if (smartComponentData !== undefined && smartComponentData.length > 0) {
        $.each(smartComponentData, function (index: any, smart: any) {
          selectedComponent.push(smart?.Id);
        });
      }
      let selectedService: any[] = [];
      if (linkedComponentData !== undefined && linkedComponentData.length > 0) {
        $.each(linkedComponentData, function (index: any, smart: any) {
          selectedService.push(smart?.Id);
        });
      }
      let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
      await web.lists
        .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
        .items.getById(Masterdata?.Id)
        .update({
          ComponentId: {
            results:
              selectedComponent !== undefined && selectedComponent?.length > 0
                ? selectedComponent
                : [],
          },
          ServicesId: {
            results:
              selectedService !== undefined && selectedService?.length > 0
                ? selectedService
                : [],
          },
        })
        .then((res: any) => {
          GetMasterData();
          console.log(res);
        });
    }
  };
  const toggleSideBar = () => {
    setSidebarStatus({ ...sidebarStatus, dashboard: !sidebarStatus.dashboard });
    if (sidebarStatus.dashboard == false) {
      $(".sidebar").attr("collapsed", "");
    } else {
      $(".sidebar").removeAttr("collapsed");
    }
  };
  const columns = React.useMemo(
    () => [
      {
        internalHeader: "Task Id",
        accessor: "Shareweb_x0020_ID",
        width: "75px",
        showSortIcon: false,
      },
      {
        internalHeader: "Title",
        accessor: "Title",
        showSortIcon: true,
        Cell: ({ row }: any) => (
          <span>
            <a
              style={{ textDecoration: "none", color: "#000066" }}
              href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
              data-interception="off"
              target="_blank"
            >
              {row?.values?.Title}
            </a>
          </span>
        ),
      },
      {
        internalHeader: "",
        id: "siteIcon", // 'id' is required
        isSorted: false,
        showSortIcon: false,
        width: "45px",
        Cell: ({ row }: any) => (
          <span>
            <img
              className="circularImage rounded-circle"
              src={row?.original?.siteIcon}
            />
          </span>
        ),
      },
      {
        internalHeader: "Portfolio",
        accessor: "PortfolioTitle",
        showSortIcon: true,
        Cell: ({ row }: any) => (
          <span>
            <a
              data-interception="off"
              target="blank"
              href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
            >
              {row?.original?.portfolio?.Title}
            </a>
          </span>
        ),
      },
      {
        internalHeader: "Priority",
        isSorted: true,
        isSortedDesc: true,
        accessor: "Priority_x0020_Rank",
        showSortIcon: true,
        Cell: ({ row }: any) => (
          // <span>
          //   {row?.original?.Priority_x0020_Rank}
          //   {
          //     row?.original?.Categories?.includes('Immediate') ?
          //       <a style={{ marginRight: '5px' }} title="Immediate"><img src={require("../../../Assets/ICON/alert.svg")} /> </a>
          //       :
          //       " "
          //   }

          // </span>
          <span>
            <InlineEditingcolumns type='Task' callBack={tagAndCreateCallBack} columnName='Priority' item={row?.original} />
          </span>
        ),
      },

      {
        internalHeader: "Due Date",
        showSortIcon: true,
        accessor: "DueDate",
        Cell: ({ row }: any) => <span>{row?.original?.DisplayDueDate}</span>,
      },

      {
        internalHeader: "Percent Complete",
        accessor: "PercentComplete",
        showSortIcon: true,
        Cell: ({ row }: any) => (
          // <span>
          //   {parseInt(row?.original?.PercentComplete) <= 5 &&
          //     parseInt(row?.original?.PercentComplete) >= 0 ? (
          //     <a title={row?.original?.PercentComplete}>
          //       <img

          //         onMouseEnter={row?.original?.PercentComplete}
          //         src={require("../../../Assets/ICON/Ellipse.svg")}
          //       />
          //     </a>
          //   ) : parseInt(row?.original?.PercentComplete) >= 6 &&
          //     parseInt(row?.original?.PercentComplete) <= 98 ? (
          //     <a title={row?.original?.PercentComplete}>
          //       <img

          //         onMouseEnter={row?.original?.PercentComplete}
          //         src={require("../../../Assets/ICON/Ellipse-haf.svg")}
          //       />
          //     </a>
          //   ) : (
          //     <a title={row?.original?.PercentComplete}>
          //       <img

          //         onMouseEnter={row?.original?.PercentComplete}
          //         src={require("../../../Assets/ICON/completed.svg")}
          //       />
          //     </a>
          //   )}
          //   {
          //     row?.original?.IsTodaysTask?<>
          //     {
          //       row?.original?.AssignedTo?.map((AssignedUser:any)=>{
          //         return(
          //           AllUser?.map((user:any)=>{
          //             if(AssignedUser.Id==user.AssingedToUserId){
          //               return(
          //                 <span className="user_Member_img">
          //               <a
          //                 href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${user.Id}&Name=${user.Title}`}
          //                 target="_blank"
          //                 data-interception="off"
          //                 title={user.Title}
          //               >
          //                 <img className="imgAuthor" src={user?.Item_x0020_Cover?.Url}></img>
          //               </a>
          //             </span>
          //               )
          //             }

          //           })
          //         )
          //       })
          //     }
          //     </>:''
          //   }
          // </span>
          <span>
            <InlineEditingcolumns callBack={tagAndCreateCallBack} columnName='PercentComplete' item={row?.original} />
          </span>
        ),
      },
      {
        internalHeader: "Team Members",
        accessor: "TeamMembersSearch",
        showSortIcon: true,
        Cell: ({ row }: any) => (
          <span>
            <ShowTaskTeamMembers
              props={row?.original}
              TaskUsers={AllUser}
            ></ShowTaskTeamMembers>
          </span>
        ),
      },

      {
        internalHeader: "",
        id: "Id", // 'id' is required
        isSorted: false,
        showSortIcon: false,
        Cell: ({ row }: any) => (
          <span
            title="Edit Task"
            onClick={() => EditPopup(row?.original)}
            className="svg__iconbox svg__icon--edit"
          ></span>
        ),
      },
    ],
    [AllTasks]
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
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: { pageIndex: 0, pageSize: 100000 },
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );
  const clearPortfolioFilter = () => {
    let projectData = Masterdata;
    projectData?.smartComponent?.map((item: any, index: any) => {
      item.filterActive = false;
    });
    projectData?.smartService?.map((item: any, index: any) => {
      item.filterActive = false;
    });
    setMasterdata(projectData);
    setData(AllTasks);
    setSidebarStatus({ ...sidebarStatus, sideBarFilter: false });
  };
  const filterPotfolioTasks = (
    portfolio: any,
    clickedIndex: any,
    type: any
  ) => {
    setCreateTaskId({portfolioData: portfolio , portfolioType : type})
    let projectData = Masterdata;
    let displayTasks = AllTasks;
    projectData?.smartComponent?.map((item: any, index: any) => {
      if (type == "Component" && clickedIndex == index) {
        item.filterActive = true;
        setSidebarStatus({ ...sidebarStatus, sideBarFilter: true });
        displayTasks = AllTasks.filter((items: any) => {
          if (
            items?.Component?.length > 0 &&
            items?.Component[0]?.Id == portfolio?.Id
          ) {
            return true;
          }
          return false;
        });
      } else {
        item.filterActive = false;
      }
    });
    projectData?.smartService?.map((item: any, index: any) => {
      if (type == "Service" && clickedIndex == index) {
        item.filterActive = true;
        setSidebarStatus({ ...sidebarStatus, sideBarFilter: true });
        displayTasks = AllTasks.filter((items: any) => {
          if (
            items?.Services?.length > 0 &&
            items?.Services[0]?.Id == portfolio?.Id
          ) {
            return true;
          }
          return false;
        });
      } else {
        item.filterActive = false;
      }
    });
    setMasterdata(projectData);
    setData(displayTasks);
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

  const onChangeInSelect = (event: any) => {
    setPageSize(Number(event.target.value));
  };

  const onChangeInInput = (event: any) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };
  return (
   
   <div>
    {
      QueryId != "" ?   <>
      <div className="row">
        <div
          className="d-flex justify-content-between p-0"
          ng-if="(Task.Item_x0020_Type=='Component Category')"
        >
          <ul className="spfxbreadcrumb mb-2 ms-2 p-0">
            <li>
              <a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management-Overview.aspx">
                Project Management
              </a>
            </li>
            <li>
              {" "}
              <a>{Masterdata.Title}</a>{" "}
            </li>
          </ul>
        </div>
      </div>
      <div className="Dashboardsecrtion">
        <div className="dashboard-colm">
          <aside className="sidebar">
            <button
              type="button"
              onClick={() => {
                toggleSideBar();
              }}
              className="collapse-toggle"
            ></button>
            <section className="sidebar__section sidebar__section--menu">
              <nav className="nav__item">
                <ul className="nav__list">
                  <li id="DefaultViewSelectId" className="nav__item ">
                    <a
                      ng-click="ChangeView('DefaultView','DefaultViewSelectId')"
                      className="nav__link border-bottom pb-1"
                    >
                      <span className="nav__icon nav__icon--home"></span>
                      <span className="nav__text">
                        Components{" "}
                        <span
                          className="float-end "
                          style={{ cursor: "pointer" }}
                          onClick={(e) =>
                            EditPortfolio(Masterdata, "Component")
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 48 48"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M22.8746 14.3436C22.8774 18.8722 22.8262 22.6308 22.7608 22.6962C22.6954 22.7616 18.9893 22.8128 14.525 22.8101C10.0606 22.8073 6.32545 22.8876 6.22467 22.9884C5.99582 23.2172 6.00541 24.6394 6.23742 24.8714C6.33182 24.9658 10.0617 25.0442 14.526 25.0455C18.9903 25.0469 22.6959 25.1009 22.7606 25.1657C22.8254 25.2304 22.8808 28.9921 22.8834 33.5248L22.8884 41.7663L23.9461 41.757L25.0039 41.7476L25.0012 33.3997L24.9986 25.0516L33.2932 25.0542C37.8555 25.0556 41.6431 25.0017 41.7105 24.9343C41.8606 24.7842 41.8537 23.0904 41.7024 22.9392C41.6425 22.8793 37.8594 22.8258 33.2955 22.8204L24.9975 22.8104L24.9925 14.4606L24.9874 6.11084L23.9285 6.11035L22.8695 6.10998L22.8746 14.3436Z"
                              fill="#fff"
                            />
                          </svg>
                        </span>
                      </span>
                    </a>
                  </li>
                  <li className="nav__item  pb-1 pt-0">
                    <div className="nav__text">
                      {Masterdata?.smartComponent?.length > 0 ? (
                        <ul className="nav__subList scrollbarCustom pt-1 ps-0">
                          {Masterdata?.smartComponent?.map(
                            (component: any, index: any) => {
                              return (
                                <li
                                  className={
                                    component?.filterActive
                                      ? "nav__item bg-ee"
                                      : "nav__item"
                                  }
                                >
                                  <span>
                                    <a
                                      className={
                                        component?.filterActive
                                          ? "hreflink "
                                          : "text-white hreflink"
                                      }
                                      data-interception="off"
                                      target="blank"
                                      onClick={() =>
                                        filterPotfolioTasks(
                                          component,
                                          index,
                                          "Component"
                                        )
                                      }
                                    >
                                      {component?.Title}
                                    </a>
                                  </span>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      ) : (
                        <div className="nontag mt-2 text-center">
                          No Tagged Component
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </nav>
            </section>
            <section className="sidebar__section sidebar__section--menu">
              <nav className="nav__item">
                <ul className="nav__list">
                  <li id="DefaultViewSelectId" className="nav__item  pt-0  ">
                    <a
                      ng-click="ChangeView('DefaultView','DefaultViewSelectId')"
                      className="nav__link border-bottom pb-1"
                    >
                      <span className="nav__icon nav__icon--home"></span>
                      <span className="nav__text">
                        Services{" "}
                        <span
                          className="float-end "
                          style={{ cursor: "pointer" }}
                          onClick={(e) => EditPortfolio(Masterdata, "Service")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 48 48"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M22.8746 14.3436C22.8774 18.8722 22.8262 22.6308 22.7608 22.6962C22.6954 22.7616 18.9893 22.8128 14.525 22.8101C10.0606 22.8073 6.32545 22.8876 6.22467 22.9884C5.99582 23.2172 6.00541 24.6394 6.23742 24.8714C6.33182 24.9658 10.0617 25.0442 14.526 25.0455C18.9903 25.0469 22.6959 25.1009 22.7606 25.1657C22.8254 25.2304 22.8808 28.9921 22.8834 33.5248L22.8884 41.7663L23.9461 41.757L25.0039 41.7476L25.0012 33.3997L24.9986 25.0516L33.2932 25.0542C37.8555 25.0556 41.6431 25.0017 41.7105 24.9343C41.8606 24.7842 41.8537 23.0904 41.7024 22.9392C41.6425 22.8793 37.8594 22.8258 33.2955 22.8204L24.9975 22.8104L24.9925 14.4606L24.9874 6.11084L23.9285 6.11035L22.8695 6.10998L22.8746 14.3436Z"
                              fill="#fff"
                            />
                          </svg>
                        </span>
                      </span>
                    </a>
                  </li>
                  <li id="DefaultViewSelectId" className="nav__item  pb-1 pt-0">
                    <div className="nav__text">
                      {Masterdata?.smartService?.length > 0 ? (
                        <ul className="nav__subList scrollbarCustom pt-1 ps-0">
                          {Masterdata?.smartService?.map(
                            (service: any, index: any) => {
                              return (
                                <li
                                  className={
                                    service?.filterActive
                                      ? "nav__item bg-ee"
                                      : "nav__item"
                                  }
                                >
                                  <span>
                                    <a
                                      className={
                                        service?.filterActive
                                          ? "hreflink "
                                          : "text-white hreflink"
                                      }
                                      data-interception="off"
                                      target="blank"
                                      onClick={() =>
                                        filterPotfolioTasks(
                                          service,
                                          index,
                                          "Service"
                                        )
                                      }
                                    >
                                      {service?.Title}
                                    </a>
                                  </span>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      ) : (
                        <div className="nontag mt-2 text-center">
                          No Tagged Service
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </nav>
            </section>
          </aside>
          <div className="dashboard-content ps-2 full-width">
            <article className="row">
              <div className="col-md-12">
                <section>
                  <div>
                    <div className="align-items-center d-flex justify-content-between">
                      <div className="align-items-center d-flex">
                        <h2 className="heading">
                          <img
                            className="circularImage rounded-circle "
                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Icon_Project.png"
                          />
                          <>

                            <a>{Masterdata?.Title} </a>
                          </>
                        </h2>
                        <span onClick={() => EditComponentPopup(Masterdata)}
                          className="mx-2 svg__iconbox svg__icon--edit"
                          title="Edit Project"
                        ></span>
                      </div>
                      <div>
                        <div className="d-flex">
                          {projectId && (
                            <CreateTaskFromProject
                              projectItem={Masterdata}
                              pageContext={props.pageContext}
                              projectId={projectId}
                              callBack={tagAndCreateCallBack}
                              createComponent= {createTaskId}
                            />
                          )}
                          {projectId && (
                            <TagTaskToProjectPopup
                              projectItem={Masterdata}
                              className="ms-2"
                              projectId={projectId}
                              callBack={tagAndCreateCallBack}
                              projectTitle={projectTitle}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section>
                  <div>
                    <div className="row">
                      <div className="col-md-12 bg-white">
                        <div className="team_member row  py-2">
                          <div className="col-md-6 p-0">
                            <dl>
                              <dt className="bg-fxdark">Due Date</dt>
                              <dd className="bg-light">
                                <span>
                                  <a>
                                    {Masterdata.DueDate != null
                                      ? Moment(Masterdata.Created).format(
                                        "DD/MM/YYYY"
                                      )
                                      : ""}
                                  </a>
                                </span>
                                <span
                                  className="pull-right"
                                  title="Edit Inline"
                                  ng-click="EditContents(Task,'editableDueDate')"
                                >
                                  <i
                                    className="fa fa-pencil siteColor"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </dd>
                            </dl>
                            <dl>
                              <dt className="bg-fxdark">Priority</dt>
                              <dd className="bg-light">
                                <a>
                                  {Masterdata.Priority != null
                                    ? Masterdata.Priority
                                    : ""}
                                </a>
                                <span
                                  className="hreflink pull-right"
                                  title="Edit Inline"
                                >
                                  <i
                                    className="fa fa-pencil siteColor"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </dd>
                            </dl>
                          </div>
                          <div className="col-md-6 p-0">
                            <dl>
                              <dt className="bg-fxdark">Assigned To</dt>
                              <dd className="bg-light">
                                {Masterdata?.AssignedUser?.map((image: any) => (
                                  <span className="headign" title={image.Title}>
                                    <img
                                      className="circularImage rounded-circle"
                                      src={image.useimageurl}
                                    />
                                  </span>
                                ))}
                              </dd>
                            </dl>
                            <dl>
                              <dt className="bg-fxdark">% Complete</dt>
                              <dd className="bg-light">
                                <a>
                                  {Masterdata.PercentComplete != null
                                    ? Masterdata.PercentComplete
                                    : ""}
                                </a>
                                <span className="pull-right">
                                  <span className="pencil_icon">
                                    <span
                                      ng-show="isOwner"
                                      className="hreflink"
                                      title="Edit Inline"
                                    >
                                      <i
                                        className="fa fa-pencil"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </span>
                                </span>
                              </dd>
                            </dl>
                          </div>
                          <div className="team_member row  py-2">
                            <div className="col-md-12 p-0">
                              <dl className="bg-light p-2">
                                <a>
                                  {Masterdata.Body != null
                                    ? Masterdata.Body
                                    : ""}
                                </a>
                                <span
                                  className="hreflink pull-right"
                                  title="Edit Inline"
                                >
                                  <i
                                    className="fa fa-pencil siteColor"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <div>
                  <div className="row">
                    <div className="section-event border-top">
                      <div className="wrapper">
                        {sidebarStatus.sideBarFilter ? (
                          <div className="text-end">
                            <a onClick={() => clearPortfolioFilter()}>
                              Clear Portfolio Filter
                            </a>
                          </div>
                        ) : (
                          ""
                        )}

                        {/* <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                                    <thead>
                                                        <tr>
                                                            <th></th>

                                                            <th style={{ width: "10%" }}>
                                                                <div> Portfolio</div>
                                                            </th>

                                                            <th style={{ width: "10%" }}>
                                                                <div> Task Id </div></th>

                                                            <th style={{ width: "25%" }}>
                                                                <div> Title </div></th>

                                                            <th style={{ width: "10%" }}>
                                                                <div> % Complete </div>
                                                            </th>

                                                            <th style={{ width: "13%" }}>
                                                                <div> Priority </div>
                                                            </th>

                                                            <th style={{ width: "15%" }}>
                                                                <div> Team </div>
                                                            </th>

                                                            <th style={{ width: "13%" }}>
                                                                <div> Due Date </div>
                                                            </th>

                                                            <th style={{ width: "2%" }}>
                                                            </th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        <div id="SpfxProgressbar" style={{ display: "none" }}>

                                                            <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />

                                                        </div>
                                                        {AllTasks.length > 0 && AllTasks && AllTasks.map(function (item, index) {


                                                            return (
                                                                <>
                                                                    <tr >
                                                                        <td>
                                                                            <img className="circularImage rounded-circle"
                                                                                src={item.siteIcon} />
                                                                        </td>
                                                                        <td>
                                                                            {item.Component != undefined &&
                                                                                <>
                                                                                    {item.Component.map((types: any) => {
                                                                                        return (
                                                                                            <>
                                                                                                <span><a data-interception="off" target='blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${types.Id}`}>{types.Title}</a></span>
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </>
                                                                            }
                                                                            {item.Component == undefined &&
                                                                                <>
                                                                                    {item.Services.map((types: any) => {
                                                                                        return (
                                                                                            <>
                                                                                                <span><a data-interception="off" target='blank' href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${types.Id}`}>{types.Title}</a></span>
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </>
                                                                            }
                                                                        </td>
                                                                        <td>{item.Shareweb_x0020_ID}</td>
                                                                        <td>
                                                                            <span><a data-interception="off" target="blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${item.Id}&Site=${item.siteType}`}>{item.Title}</a></span>
                                                                        </td>
                                                                        <td><span className="ml-2">{item.PercentComplete}</span></td>
                                                                        <td>{item.Priority_x0020_Rank}</td>
                                                                        <td><ShowTaskTeamMembers props={item} TaskUsers={AllUser}></ShowTaskTeamMembers></td>
                                                                        <td><span className="ml-2">{item?.DueDate != undefined ? Moment(item.DueDate).format('DD/MM/YYYY') : ''}</span></td>
                                                                        <td onClick={() => EditPopup(item)}><span className="svg__iconbox svg__icon--edit"></span></td>
                                                                    </tr>
                                                                </>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table> */}
                        <Table
                          className="SortingTable"
                          bordered
                          hover
                          {...getTableProps()}
                        >
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
                                        <td {...cell.getCellProps()}>
                                          {cell.render("Cell")}
                                        </td>
                                      );
                                    }
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                      {/* <nav>
                                                <Pagination>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => previousPage()} disabled={!canPreviousPage}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleLeft aria-hidden={true} />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink>
                                                            {pageIndex + 1}

                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink onClick={() => nextPage()} disabled={!canNextPage}>
                                                            <span aria-hidden={true}>
                                                                <FaAngleRight
                                                                    aria-hidden={true}

                                                                />
                                                            </span>
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <Col md={2}>
                                                        <Input
                                                            type='select'
                                                            value={pageSize}
                                                            onChange={onChangeInSelect}
                                                        >

                                                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                                                <option key={pageSize} value={pageSize}>
                                                                    Show {pageSize}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </Col>
                                                </Pagination>
                                            </nav> */}
                    </div>
                  </div>
                </div>
                <div id="SpfxProgressbar" style={{ display: "none" }}>
                  <img
                    id="sharewebprogressbar-image"
                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif"
                    alt="Loading..."
                  />
                </div>
                {isOpenEditPopup ? (
                  <EditTaskPopup Items={passdata} Call={CallBack} />
                ) : (
                  ""
                )}
                {IsComponent ? (
                  <EditProjectPopup
                    props={SharewebComponent}
                    Call={Call}
                    showProgressBar={showProgressBar}
                  >
                    {" "}
                  </EditProjectPopup>
                ) : (
                  ""
                )}
              </div>
            </article>
          </div>
          <div>
            <span>
              {QueryId && <CommentCard Context={props.Context} siteUrl={props.siteUrl} listName={"Master Tasks"} itemID={QueryId} />}
            </span>
            <span>
              {
                QueryId && <SmartInformation listName={"Master Tasks"} Context={props.Context.pageContext.web} siteurl={props.siteUrl} Id={QueryId} />
              }

            </span>
          </div>
        </div>
      </div>

      {IsPortfolio && (
        <PortfolioTagging
          props={ShareWebComponent}
          type={portfolioType}
          Call={Call}
        ></PortfolioTagging>
      )}
    </>    :   <div>Project not found</div>
    }
   </div>
  );
};
export default ProjectManagementMain;
