import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp, FaFilter, FaPaintBrush } from "react-icons/fa";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useExpanded,
  usePagination,
  HeaderGroup,

} from 'react-table';
// import styles from './CreatedByTables.module.scss';
// import './Style.css';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Filter, DefaultColumnFilter } from './filters';
import { Web } from "sp-pnp-js";
// import * as Moment from 'moment';
import moment from 'moment';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import ExpandTable from '../../../globalComponents/ExpandTable/Expandtable';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import { RiFileExcel2Fill } from 'react-icons/ri';
import "bootstrap/dist/css/bootstrap.min.css";
import PageLoad from '../../../globalComponents/pageLoader';
import * as globalCommon from "../../../globalComponents/globalCommon";
import "bootstrap/dist/js/bootstrap.min.js";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import HighlightableCell from '../../../globalComponents/GroupByReactTableComponents/highlight';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';


let TaskUserBackup: any = []
const Tabless = (props: any) => {
  let UserId: any = ''
  let count: any = 0;
  let AllListId: any = {
    MasterTaskListID: props?.Items?.MasterTaskListID,
    TaskUserListID: props?.Items?.TaskUserListID,
    SmartMetadataListID: props?.Items?.SmartMetadataListID,
    //SiteTaskListID:this.props?.props?.SiteTaskListID,
    TaskTimeSheetListID: props?.Items?.TaskTimeSheetListID,
    DocumentsListID: props?.Items?.DocumentsListID,
    TaskListId: props?.Items?.TaskListId,
    SmartInformationListID: props?.Items?.SmartInformationListID,
    siteUrl: props?.Items?.siteUrl,
    AdminConfigrationListID: props?.Items?.AdminConfigrationListID,
    isShowTimeEntry: props?.Items?.isShowTimeEntry,
    isShowSiteCompostion: props?.Items?.isShowSiteCompostion,
  };
  let allData: any = [];
  let userlists: any = [];
  let masterTasks: any = [];
  // let QueryId: any;
  let CreatedByQueryId: any;
  let AssignedToQueryId: any;
  let CategoriesQueryId: any;
  let PortfolioQueryId: any;
  let SiteQueryId: any;
  let PriorityQueryId: any;
  let CompletedQueryId: any;
  let dataLength: any = [];
  let priorAndPercen: any = [];
  const [priorPercenChecked, setPriorPercenChecked]: any = React.useState([]);
  const [checkPercentage, setPercentagess]: any = React.useState([]);
  const [checkPriority, setPriorityss]: any = React.useState([]);
  let filteringColumn: any = { idType: true, due: true, modify: true, created: true, priority: true, percentage: true, catogries: true, teamMembers: true };
  let excelSelct: any = [{ item: 'Task ID', value: 'siteType' }, { item: 'Category Item', value: 'Categories' }, { item: 'Priority', value: 'priority' }, { item: "Modified", value: 'newModified' }, { item: "Usertitle", value: 'Editorss' }, { item: "Title", value: 'Title' }, { item: "Percent Complete", value: 'percentage' }, { item: "Due Date", value: "newDueDate" }, { item: "Created", value: 'newCreated' }, { item: "URL", value: 'Urlss' }]
  const [result, setResult]: any = React.useState(false);
  const [editPopup, setEditPopup]: any = React.useState(false);
  const [queryId, setQueryId]: any = React.useState([]);
  const [data, setData]: any = React.useState([]);
  const [selectExcelData, setSelectExcelData]: any = React.useState([]);
  const [taskUser, setTaskUser]: any = React.useState([]);
  const [catogries, setCatogries]: any = React.useState([]);
  const [filterCatogries, setFilterCatogries]: any = React.useState([]);
  const [allLists, setAllLists]: any = React.useState([]);
  const [checkPercentages, setCheckPercentage]: any = React.useState([]);
  const [checkTeamMembers, setCheckTeamMembers]: any = React.useState([]);
  const [checkPrioritys, setCheckPriority]: any = React.useState([]);
  const [checkedValues, setCheckedValues]: any = React.useState([]);
  const [masterTaskData, setmasterTaskData] = React.useState([]);
  const [copyData, setCopyData]: any = React.useState([]);
  const [date, setDate]: any = React.useState({ due: null, modify: null, created: null });
  const [loading, setloading] = React.useState(false);
  const [priorAndPerc, setPriorAndPerc]: any = React.useState({ priority: true, percentage: true })
  const [selectAllChecks, setSelectAllChecks]: any = React.useState({ idType: false, priority: false, percentage: false, catogries: false, teamMembers: false });
  const [radio, setRadio]: any = React.useState({ due: true, modify: true, created: true, priority: true, percentage: true });
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const childRef = React.useRef<any>();





  const deleteItemFunction = async (item: any) => {
    let confirmation = confirm("Are you sure you want to delete this task ?");
    if (confirmation) {
      try {
        if (item.listId != undefined) {
          let web = new Web(props.Items.siteUrl);
          await web.lists
            .getById(item.listId)
            .items.getById(item.ID)
            .recycle();
        }
        getTaskUserData();
        console.log("Your post has been deleted successfully");
      } catch (error) {
        console.log("Error:", error.message);
      }
    }
  };


  const editPopFunc = (item: any) => {
    setEditPopup(true);
    setResult(item)
  }


  const getTaskUserData = async () => {
    const web = new Web(props.Items.siteUrl);
    await web.lists
      .getById(props.Items.TaskUserListID)
      .items.select(
        "AssingedToUser/Title",
        "AssingedToUser/Id",
        "Item_x0020_Cover",
        "Title",
        "Id",
        "Email",
        "Suffix",
        "UserGroup/Id"
      )
      .expand("AssingedToUser", "UserGroup")
      .getAll()
      .then((data) => {
        userlists = data;
        setTaskUser(data);
        TaskUserBackup = data
        setPercentagess([0, 5, 10, 70, 80, 90, 93, 96, 99, 100]);
        setPriorityss([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        getQueryVariable();
        smartMetaData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const smartMetaData = async () => {
    let categories: any = [];
    let sites: any = [];
    let filter: any;
    if (SiteQueryId != null) {
      filter = `TaxType eq 'Sites' or TaxType eq 'Categories' and siteName eq '${SiteQueryId}'`
    } else {
      filter = `TaxType eq 'Sites' or TaxType eq 'Categories'`
    }
    const web = new Web(props?.Items?.siteUrl);
    await web.lists
      .getById(props?.Items?.SmartMetadataListID)
      .items.select("Configurations", "ID", "Title", "TaxType", "listId", "siteName")
      .filter(filter)
      .getAll()
      .then((data) => {
        data?.map((item: any) => {
          if (item.TaxType == "Sites") {
            sites.push(item);
            if (item.Title != "DRR" && item.Title != "Master Tasks" && item.Title != "SDC Sites" && item.Configurations != null) {
              let a: any = JSON.parse(item.Configurations);
              a?.map((newitem: any) => {
                newitem.currentSiteUrl = props?.Items?.siteUrl
                dataLength.push(newitem);
                getAllData(newitem);
                // b.push(newitem);
              });
            }
          }
          if (item.TaxType == "Categories") {
            categories.push(item.Title);
          }
        });
        setCatogries(categories);
        setAllLists(sites);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function CallBack() {
    setEditPopup(false);
    getTaskUserData();
  }


  const getQueryVariable = () => {
    const params = new URLSearchParams(window.location.search);
    let CreatedBy = params.get("CreatedBy");
    if (CreatedBy == null) {
      params.set('CreatedBy', props?.Items?.userDisplayName.split(" ")[0]);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, '', newUrl);
      CreatedBy = params.get("CreatedBy");
    }
    CreatedByQueryId = CreatedBy;
    let AssignedTo = params.get("AssignedTo");
    AssignedToQueryId = AssignedTo;
    let Categories = params.get("Categories");
    CategoriesQueryId = Categories;
    let Portfolio = params.get("Portfolio");
    PortfolioQueryId = Portfolio;
    let Site = params.get("Site");
    SiteQueryId = Site;
    let Priority = params.get("Priority");
    PriorityQueryId = Priority;
    let Completed = params.get("Completed");
    CompletedQueryId = Completed;

    setQueryId(CreatedBy);
    console.log(CreatedBy);
    if (TaskUserBackup != undefined && TaskUserBackup.length > 0) {
      TaskUserBackup.map((val: any) => {
        if (val.Title.indexOf(CreatedByQueryId) !== -1 && val.AssingedToUser !== undefined) {
          UserId = val.AssingedToUser.Id
        }
      })

    }
  };


  const getMasterTask = async () => {
    let web = new Web(props.Items.siteUrl);
    await web.lists
      .getById(props.Items.MasterTaskListID)
      .items
      .select("ID", "Id", "Title", "PortfolioLevel", "PortfolioStructureID", "Comments", "ItemRank", "Portfolio_x0020_Type", "Parent/Id", "Parent/Title",
        "DueDate", "Body", "Item_x0020_Type", "FeedBack", "Categories", "Short_x0020_Description_x0020_On", "PriorityRank", "Priority",
        "AssignedTo/Title", "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title", "PercentComplete",
        "ResponsibleTeam/Id", "ResponsibleTeam/Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange", "PortfolioType/Title", "AssignedTo/Id",
      )
      .expand(
        "Parent", "PortfolioType", "AssignedTo", "ClientCategory", "TeamMembers", "ResponsibleTeam"
      )
      .top(4999)
      .get().then((data: any) => {
        masterTasks = data;
        setmasterTaskData(data);
        setloading(true);
        getTaskUserData();
      }).catch((err: any) => {
        console.log(err);
      })
  }


  const getAllData = async (items: any) => {
    let filter: any;
    if (UserId != null) {
      filter = `(Author/Id eq '${UserId}') and PercentComplete le 0.91`
    } else if (PriorityQueryId != null) {
      filter = `Priority_x0020_Rank eq ${PriorityQueryId} and PercentComplete le 0.91`
    } else if (CategoriesQueryId != null) {
      filter = `substringof('${CategoriesQueryId}', Categories) and PercentComplete le 0.91`
    } else if (AssignedToQueryId != null) {
      filter = `substringof('${AssignedToQueryId}', AssignedTo/Id) or substringof('${AssignedToQueryId}', ResponsibleTeam/Title) or substringof('${AssignedToQueryId}', TeamMembers/Title) and PercentComplete le 0.91`
    } else {
      filter = `PercentComplete le 0.91`
    }
    const web = new Web(items.currentSiteUrl);
    await web.lists
      .getById(items.listId)
      .items.select("Title", "PercentComplete", "TaskLevel", "TeamMembers/Id", "TaskID", "ParentTask/Title", "ParentTask/Id", "TeamMembers/Title", "ResponsibleTeam/Id", "ResponsibleTeam/Title", 'EstimatedTimeDescription', "EstimatedTime", "FeedBack", "TaskType/Id", "TaskType/Title", "TaskType/Level", "Portfolio/Id", "Portfolio/ItemType", "Portfolio/Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange", "PortfolioType/Title", "Categories", "Priority_x0020_Rank", "DueDate", "Created", "Modified", "Team_x0020_Members/Id", "Team_x0020_Members/Title", "ID", "Responsible_x0020_Team/Id", "Responsible_x0020_Team/Title", "Editor/Title", "Editor/Id", "Author/Title", "Author/Id", "AssignedTo/Id", "AssignedTo/Title")
      .expand("Team_x0020_Members", "ResponsibleTeam", "TeamMembers", "ParentTask", "Author", "PortfolioType", "Portfolio", "TaskType",  "Editor", "Responsible_x0020_Team", "AssignedTo")
      .filter(`${filter}`).top(5000)
      .getAll()
      .then((data: any) => {
        const filteredItems = data.filter((item: any) => !item?.Categories?.includes('Draft'));

        filteredItems?.map((dataItem: any) => {
          dataItem.AllTeamName = '';
          dataItem.allTeamMember = [];
          const jsonObject = JSON.parse(dataItem?.EstimatedTimeDescription);
          userlists?.map((userItem: any) => {
            dataItem.percentage = dataItem.PercentComplete * 100 + "%";
            if ((dataItem.TaskType == undefined ? null : dataItem.TaskType.Title) === "Activities") {
              dataItem.idType = "A" + dataItem.Id;
            } else if ((dataItem.TaskType == undefined ? null : dataItem.TaskType.Title) === "MileStone") {
              dataItem.idType = "M" + dataItem.Id;
            } else if ((dataItem.TaskType == undefined ? null : dataItem.TaskType.Title) === "Project") {
              dataItem.idType = "P" + dataItem.Id;
            } else if ((dataItem.TaskType == undefined ? null : dataItem.TaskType.Title) === "Step") {
              dataItem.idType = "S" + dataItem.Id;
            } else if ((dataItem.TaskType == undefined ? null : dataItem.TaskType.Title) === "Task") {
              dataItem.idType = "T" + dataItem.Id;
            } else if ((dataItem.TaskType == undefined ? null : dataItem.TaskType.Title) === "Workstream") {
              dataItem.idType = "W" + dataItem.Id;
            } else {
              dataItem.idType = "T" + dataItem.Id;
            }

            dataItem["newCreated"] = dataItem.Created != null ? moment(dataItem.Created).format('DD/MM/YYYY') + '' : "";
            dataItem["newModified"] = dataItem.Modified != null ? moment(dataItem.Modified).format('DD/MM/YYYY') + '' : "";
            dataItem["newDueDate"] = dataItem.DueDate != null ? moment(dataItem.DueDate).format('DD/MM/YYYY') + '' : "";

            if (userItem.AssingedToUser != undefined && userItem.AssingedToUser.Id == dataItem.Author.Id) {
              dataItem.AuthorImg = userItem?.Item_x0020_Cover?.Url;
              dataItem.AuthorSuffix = userItem?.Suffix;
            }

            if (dataItem?.FeedBack != undefined) {
              dataItem.descriptionsSearch = globalCommon.descriptionSearchData(dataItem)
            } else {
              dataItem.descriptionsSearch = '';
            }
            if (userItem.AssingedToUser != undefined && userItem.AssingedToUser.Id == dataItem.Editor.Id
            ) {
              dataItem.EditorImg = userItem?.Item_x0020_Cover?.Url;
              dataItem.EditorSuffix = userItem?.Suffix;
            }

          });


          // Ensure dataItem.allTeamMember is initialized as an empty string
       
          if (dataItem?.ResponsibleTeam?.length > 0) {
            dataItem.allTeamMember = dataItem?.allTeamMember?.concat(dataItem.ResponsibleTeam)
          }
          if (dataItem?.TeamMembers?.length > 0) {
            dataItem.allTeamMember = dataItem?.allTeamMember.concat(dataItem.TeamMembers)
          }
          if (dataItem?.AssignedTo?.length > 0) {
            dataItem.allTeamMember = dataItem?.allTeamMember.concat(dataItem.AssignedTo)
          }

          if(dataItem?.allTeamMember?.length>0){
            dataItem.AllTeamName = dataItem?.allTeamMember?.map((val:any)=> val.Title).join(" ");
          }
          
          const matchingTask = masterTasks?.find((task: any) => dataItem?.Portfolio?.Id === task?.Id);
          if (matchingTask) {
            dataItem.PortfolioType = matchingTask.PortfolioType;
          }

          allData.push({
            ...dataItem,
            idType: dataItem.idType,
            Categories: dataItem.Categories,
            percentage: dataItem.percentage,
            newDueDate: dataItem.newDueDate,
            FeedBack: dataItem.FeedBack,
            newModified: dataItem.newModified,
            newCreated: dataItem.newCreated,
            editorImg: dataItem.EditorImg,
            EditorSuffix: dataItem.EditorSuffix,
            AuthorSuffix: dataItem.AuthorSuffix,
            authorImg: dataItem.AuthorImg,
            SiteIcon: items.Title == "Migration" ? "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png" : items.ImageUrl,
            siteUrl: items.siteUrl,
            EstimatedTime: (jsonObject != null && jsonObject != undefined && jsonObject[0]?.EstimatedTime != undefined && jsonObject[0]?.EstimatedTime != null ? jsonObject[0]?.EstimatedTime : ''),
            priority: dataItem.Priority_x0020_Rank,
            Author: dataItem.Author,
            Editor: dataItem.Editor,
            Editorss: dataItem.Editor.Title,
            Team_x0020_Members: dataItem.Team_x0020_Members,
            Responsible_x0020_Team: dataItem.Responsible_x0020_Team,
            AllTeamName: dataItem.AllTeamName,
            ResponsibleTeam: dataItem.ResponsibleTeam,
            TeamMembers: dataItem.TeamMembers,
            AssignedTo: dataItem.AssignedTo,
            created: dataItem.Created,
            modified: dataItem.Modified,
            dueDate: dataItem.DueDate,
            PortfolioType: dataItem.PortfolioType,
            listId: items.listId,
            site: items.Title,
            siteType: items.Title,
            Urlss: `${items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${dataItem.Id}&Site=${items.Title}`
          });

        });
        count++;

        if (count == dataLength.length) {
          setData(allData);
          setloading(false);
          setCopyData(allData);

        }
      })
      .catch((err: any) => {
        console.log("then catch error", err);
      });
  };


  const filterCom = (e: any) => {
    let data1: any = copyData;

    priorAndPercen = priorPercenChecked;
    let { checked, value } = e.target;
    if (checked) {
      priorAndPercen.push(value);
    } else {
      priorAndPercen = priorAndPercen.filter((val: any) => val !== value)
    }

    if (checked) {
      setPriorPercenChecked([...priorPercenChecked, value]);
    } else {
      setPriorPercenChecked(
        priorPercenChecked.filter((val: any) => val !== value)
      );
    }


    if (priorAndPercen.includes('Component') && priorAndPercen.includes('Service')) {
      let array: any = [];
      data1?.map((item: any) => {
        if (item?.PortfolioType?.Title == "Component" || item?.PortfolioType?.Title == "Service") {
          array.push(item);
        }
      });
      setData(array);
    } else if (priorAndPercen.includes('Component')) {
      let array: any = [];
      data1?.map((item: any) => {
        if (item?.PortfolioType?.Title == "Component") {
          array.push(item);
        }
      });
      setData(array);
    } else if (priorAndPercen.includes('Service')) {
      let array: any = [];
      data1?.map((item: any) => {

        if (item?.PortfolioType?.Title == "Service") {
          array.push(item);
        }
      });
      setData(array);
    } else {
      setData(data1);
    }


  };

  const columns = React.useMemo(
    () => [
      {
        accessorFn: (row: any) => <img className="workmember" src={row?.SiteIcon}></img>,
        id: "SiteIcon",
        placeholder: "",
        header: "",
        resetColumnFilters: false,
        size: 40,
      },
      {
        accessorFn: (row: any) => row?.idType,
        cell: ({ row, getValue }: any) => (

          <>   <ReactPopperTooltipSingleLevel CMSToolId={row?.original?.idType} row={row?.original} AllListId={AllListId} singleLevel={true} masterTaskData={masterTaskData} AllSitesTaskData={data} /></>

        ),
        id: "idType",
        placeholder: "Task ID",
        header: "",
        resetColumnFilters: false,
        size: 40,
      },
      {

        accessorFn: (row: any) => row?.Title,
        cell: ({ row, getValue }: any) => (
          <div>
            <a
              target='_blank'
              style={{ textDecoration: 'none', cursor: 'pointer', color: `${row?.original?.PortfolioType?.Color}` }}
              href={`${props.Items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.site}`}
              rel='noopener noreferrer'
              data-interception="off"
            >
              {row?.original?.Title}
            </a>
            {row?.original?.FeedBack?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} /></span>}
          </div>
        ),
        id: "Title",
        placeholder: "Task Title",
        header: "",
        resetColumnFilters: false,
      },
      {
        accessorFn: (row: any) => row?.Categories,
        cell: ({ row, getValue }: any) => (
          <>{row?.original?.Categories}</>
        ),
        id: "Categories",
        placeholder: "Categories",
        header: "",
        resetColumnFilters: false,
        size: 80,
      },
      {
        accessorFn: (row: any) => row?.percentage,
        cell: ({ row, getValue }: any) => (
          <>{row?.original?.percentage}</>
        ),
        id: "percentage",
        placeholder: "%",
        header: "",
        resetColumnFilters: false,
        size: 50,
      },
      {
        accessorFn: (row: any) => row?.priority,
        cell: ({ row, getValue }: any) => (
          <>
            {row?.original?.priority}
          </>
        ),
        id: "Priority",
        placeholder: "Priority",
        header: "",
        resetColumnFilters: false,
        filterFn: (row: any, columnId: any, filterValue: any) => {
          return row?.original?.priority == filterValue
        },
        size: 50,
      },
      {
        accessorFn: (row: any) => row?.EstimatedTime,
        cell: ({ row, getValue }: any) => (
          <>{row?.original?.EstimatedTime}
          </>
        ),
        id: "EstimatedTime",
        placeholder: "EstimatedTime",
        header: "",
        resetColumnFilters: false,
        size: 50,
      },
      {
        accessorFn: (row: any) => row?.dueDate,
        cell: ({ row, column, getValue }: any) => (
          <HighlightableCell value={row?.original?.newDueDate} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
        ),
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.newDueDate?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        id: "dueDate",
        placeholder: "Due Date",
        header: "",
        resetColumnFilters: false,
        size: 75,
      },

      {
        accessorFn: (row: any) => row?.modified,
        cell: ({ row, column, getValue }: any) => (
          <HighlightableCell value={row?.original?.newModified} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
        ),
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.newModified?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        id: "modified",
        placeholder: "Modified",
        header: "",
        resetColumnFilters: false,
        size: 120,
      },
      {
        accessorFn: (row: any) => row?.created,
        cell: ({ row, column, getValue }: any) => (
          <HighlightableCell value={row?.original?.newCreated} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
        ),
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.newCreated?.includes(filterValue)) {
            return true
          } else {
            return false
          }
        },
        id: "created",
        placeholder: "Created",
        header: "",
        isColumnDefultSortingDesc: true,
        resetColumnFilters: false,
        size: 120,
      },

      {
        accessorFn: (row: any) => row?.AllTeamName,
        cell: ({ row, getValue }: any) => (
          <span>
            <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={taskUser} Context={props?.Items} />
          </span>
        ),
        id: "AllTeamName",
        placeholder: "Team Members",
        header: "",
        resetColumnFilters: false,
        size: 75,
      },
      {
        cell: ({ row, getValue }: any) => (
          <div className='alignCenter float-end'>
            <span title="Edit Task" className="svg__iconbox svg__icon--edit hreflink" onClick={() => editPopFunc(row.original)} ></span>
            <span title="Delete Task" className="svg__iconbox svg__icon--trash hreflink " onClick={() => deleteItemFunction(row.original)} ></span>
          </div>
        ),
        id: "ID",
        placeholder: "",
        header: "",
        resetColumnFilters: false,
        size: 60,
      },
    ],
    [data]
  );

  React.useEffect(() => {
    getMasterTask();
  }, []);


  const callBackData = React.useCallback((elem: any, ShowingData: any) => {


  }, []);
  return (

    <div className='createdBy mt-2'>

      <section className='ContentSection'><div className='row'>
        {
          queryId != null && <h2 className='col heading siteColor'>Created By - {queryId}</h2>
        }
        <div className='col alignCenter justify-content-end'>
          <input className='form-check-input me-1 mt-0' type="checkbox" value={'Component'} onChange={(e: any) => filterCom(e)} /> Component
          <input className='form-check-input me-1 mt-0 ms-2' type="checkbox" value={'Service'} onChange={(e: any) => filterCom(e)} /> Service
          {/* <a
            target='_blank'
            href={`${props.Items.siteUrl}/SitePages/Tasks%20View.aspx?CreatedBy=${queryId}`}
            rel='noopener noreferrer'
            data-interception="off"
            className="siteColor list-unstyled fw-bold ms-2"
          >
            Old Task View
          </a> */}

        </div></div>
      </section>

      <section className="TableContentSection">
        <div className='Alltable'>
          <GlobalCommanTable expandIcon={true} showHeader={true} showPagination={true} columns={columns} data={data} callBackData={callBackData} />
        </div>

      </section>
      <span>
        {editPopup && <EditTaskPopup Items={result} context={props.Items.Context} AllListId={AllListId} Call={() => { CallBack() }} />}

      </span>
      {loading && <PageLoad />}
    </div>
  )
}

export default Tabless;