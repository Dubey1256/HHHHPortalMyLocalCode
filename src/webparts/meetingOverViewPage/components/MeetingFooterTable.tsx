import * as React from 'react';
import { Web } from 'sp-pnp-js';
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
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { FaCompressArrowsAlt } from 'react-icons/fa';
import * as moment from 'moment';
import { map } from "jquery";

import { mycontextValue } from './MeetingProfile';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import ReactPopperTooltip from '../../../globalComponents/Hierarchy-Popper-tooltip';
import HighlightableCell from '../../../globalComponents/GroupByReactTableComponents/highlight';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';

let globalFilterHighlited: any;
// let componentDetails = [];
let AllTasksMatches = [];
const MettingTable = (props: any) => {
  const web = new Web(props?.AllListId?.siteUrl)
  const contextdata: any = React.useContext(mycontextValue)
  const [data, setData] = React.useState<any>()
  const [IsTask, setIsTask] = React.useState(false);
  const [CMSTask, setCMSTask] = React.useState("");
  const [siteConfig, setSiteConfig] = React.useState([]);
  const [allSiteTasksData, setAllSiteTasksData] = React.useState([]);
  React.useMemo(() => {

    setData(props?.data)
  }, [props.data])

  const findUserByName = (name: any) => {
    const user = contextdata?.taskUsers.filter((user: any) => user?.AssingedToUser?.Id === name);
    let Image: any;
    if (user[0]?.Item_x0020_Cover != undefined) {
      Image = user[0].Item_x0020_Cover.Url;
    } else {
      Image =
        "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
    }
    return user ? Image : null;
  };

  const AllSiteTasksData = async () => {
    let Counter = 0;
    if (siteConfig != undefined && siteConfig.length > 0) {
      map(siteConfig, async (config: any) => {
        AllTasksMatches = await web.lists
          .getById(config.listId)
          .items.select("ParentTask/Title", "ParentTask/Id", "ItemRank", "TaskLevel", "OffshoreComments", "TeamMembers/Id", "ClientCategory/Id", "ClientCategory/Title",
            "TaskID", "ResponsibleTeam/Id", "ResponsibleTeam/Title", "ParentTask/TaskID", "TaskType/Level", "PriorityRank", "TeamMembers/Title", "FeedBack", "Title", "Id", "ID", "DueDate", "Comments", "Categories", "Status", "Body",
            "PercentComplete", "ClientCategory", "Priority", "TaskType/Id", "TaskType/Title", "Portfolio/Id", "Portfolio/ItemType", "Portfolio/PortfolioStructureID", "Portfolio/Title",
            "TaskCategories/Id", "TaskCategories/Title", "TeamMembers/Name", "Project/Id", "Project/PortfolioStructureID", "Project/Title", "Project/PriorityRank", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
            "Created", "Modified", "IsTodaysTask", "workingThisWeek"
          )
          .expand(
            "ParentTask", "Portfolio", "TaskType", "ClientCategory", "TeamMembers", "ResponsibleTeam", "AssignedTo", "Editor", "Author",
            "TaskCategories", "Project",
          ).orderBy("orderby", false).filter("(PercentComplete gt 0.89)").getAll(5000);

        console.log(AllTasksMatches);
        setAllSiteTasksData(AllTasksMatches)
      })
    }
  }

  const GetSmartmetadata = async () => {
    let siteConfigSites: any = []
    var Priority: any = []
    let web = new Web(props?.AllListId?.siteUrl);
    let smartmetaDetails: any = [];
    smartmetaDetails = await web.lists
      .getById(props?.AllListId?.SmartMetadataListID)
      .items.select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Configurations", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
      .top(4999).expand("Parent").get();
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
    })
    if (siteConfigSites?.length > 0) {
      setSiteConfig(siteConfigSites)
    }
  };

  React.useEffect(() => {
    GetSmartmetadata();
    AllSiteTasksData()
  }, [])

  const EditItemTaskPopup = (item: any) => {
    setIsTask(true);
    setCMSTask(item);
  };
  const Call = (res: any) => {
    if (res == "Close") {
      setIsTask(false);
    } else {
      setIsTask(false);

    }

  }
  const column2: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        // hasCustomExpanded: true,
        // hasExpanded: true,
        size: 55,
        id: 'Id',
      },
      {
        accessorKey: "",
        placeholder: "",
        id: 'icons',
        size: 90,
        cell: ({ row, getValue }) => (
          <div>
            {row?.original?.SiteIcon != undefined &&
              <a className="hreflink" title="Show All Child" data-toggle="modal">
                <img className="icon-sites-img ml20 me-1" src={row?.original?.SiteIcon}></img>
              </a>
            }
            {getValue()}
          </div>
        ),
      },
      {
        accessorFn: (row) => row?.TaskID,
        cell: ({ row, getValue }) => (
          <>
            {/* <ReactPopperTooltip CMSToolId={getValue()} row={row} /> */}
            <ReactPopperTooltipSingleLevel CMSToolId={getValue()} row={row?.original} AllListId={props?.AllListId} masterTaskData={props?.MasterTaskListData} AllSitesTaskData={allSiteTasksData}/>
          </>
        ),
        id: "TaskID",
        placeholder: "ID",
        header: "",
        resetColumnFilters: false,
        // isColumnDefultSortingAsc:true,
        size: 195,
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <div className="alignCenter">
            <span className="column-description2">

              {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                  href={props?.AllListId?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType} >
                  <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : globalFilterHighlited} />
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
            {row?.original?.subRows?.length > 0 ?
              <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
            {row?.original?.descriptionsSearch != null && row?.original?.descriptionsSearch != '' && (
              <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />
            )}
          </div>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        header: "",
        size: 480,
      },
      {
        accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,
        cell: ({ row }) => (
          <>
            {row?.original?.ProjectTitle != (null || undefined) ?
              <span ><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${contextdata?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.ProjectId}`} >
                <ReactPopperTooltip CMSToolId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={props?.AllListId} /></a></span>
              : ""}
          </>
        ),
        id: 'ProjectTitle',
        placeholder: "Project",
        resetColumnFilters: false,
        header: "",
        size: 126,
      },
      {
        accessorFn: (row) => row?.ClientCategorySearch,
        cell: ({ row }) => (
          <>
            {/* <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} /> */}
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
          <div className="alignCenter">
            <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={contextdata?.taskUsers} Context={contextdata?.Context} />
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
        id: "PercentComplete",
      },
      {
        accessorKey: "ItemRank",
        placeholder: "Item Rank",
        header: "",
        resetColumnFilters: false,
        size: 92,
        id: "ItemRank",
      },

      {
        accessorFn: (row) => row?.DueDate,
        cell: ({ row }) => (
          <>
            {row?.original?.DueDate == null ? (""
            ) : (
              <>
                <span>{moment(row?.original?.DueDate).format("DD/MM/YYYY")}</span>
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
        accessorFn: (row) =>
          row?.Created ? moment(row?.Created).format("DD/MM/YYYY") : "",
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.Created == null ? (
              ""
            ) : (
              <>
                {row?.original?.Author != undefined ? (
                  <>
                    <span>
                      {moment(row?.original?.Created).format("DD/MM/YYYY")}{" "}
                    </span>
                    <img
                      className="workmember"
                      title={row?.original?.Author?.Title}
                      src={findUserByName(row?.original?.Author?.Id)}

                    />
                  </>
                ) : (
                  <img
                    className="workmember"
                    src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg"
                  />
                )}
              </>
            )}
          </>
        ),
        id: "Created",
        placeholder: "Created Date",
        header: "",
        size: 139,
      },
      {
        accessorKey: "descriptionsSearch",
        placeholder: "descriptionsSearch",
        header: "",
        resetColumnFilters: false,
        size: 100,
        id: "descriptionsSearch",
      },
      {
        accessorKey: "commentsSearch",
        placeholder: "commentsSearch",
        header: "",
        resetColumnFilters: false,
        size: 100,
        id: "commentsSearch",
      },


      {
        cell: ({ row, getValue }) => (
          <>

            {row?.original?.siteType != "Master Tasks" &&
              row?.original?.Title !== "Others" && (
                <a className="alignCenter"
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title={'Edit ' + `${row.original.Title}`}
                >
                  {" "}
                  <span
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
  const callBackData = () => {
    console.log("test")
  }
  return (
    <>
      <div className='border full-width'>
        <GlobalCommanTable
          //  ref={childRef}
          // callChildFunction={Call}
          AllListId={props?.AllListId}
          columns={column2}
          //  restructureCallBack={callBackData1} 
          data={data}
          callBackData={callBackData}
          TaskUsers={contextdata?.taskUsers}
          showHeader={true}
        // portfolioColor={portfolioColor} 
        // portfolioTypeData={portfolioTypeDataItem}
        //  taskTypeDataItem={taskTypeDataItem} 
        // portfolioTypeConfrigration={portfolioTypeConfrigration } 
        // showingAllPortFolioCount={false}
        // showCreationAllButton={true}
        // AddWorkstreamTask={openActivity}
        // taskProfile={true}
        // expandIcon={true}
        />
      </div>
      {IsTask && (
        <EditTaskPopup
          Items={CMSTask}
          Call={Call}
          AllListId={props?.AllListId}
          context={contextdata?.Context}
        ></EditTaskPopup>
      )}
    </>
  )
}
export default MettingTable;

