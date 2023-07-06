import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css"; import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaFilter, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  ColumnDef,
} from "@tanstack/react-table";

import PageLoader from '../../../globalComponents/pageLoader';
import ShowClintCatogory from '../../../globalComponents/ShowClintCatogory';
import { Web, config } from "sp-pnp-js";
import { useTable, useSortBy, useFilters, useExpanded, usePagination, HeaderGroup, } from "react-table";
import { Filter, DefaultColumnFilter, } from "../../projectmanagementOverviewTool/components/filters";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';
import EditInstituton from "../../EditPopupFiles/EditComponent";
import InlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';
import * as globalCommon from "../../../globalComponents/globalCommon";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import ShowTeamMembers from '../../../globalComponents/ShowTeamMember';
import { FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import DisplayTimeEntry from '../../../globalComponents/TimeEntry/TimeEntryComponent';
import inlineEditingcolumns from '../../projectmanagementOverviewTool/components/inlineEditingcolumns';

var AllListId: any = {};
let headerOptions: any = {
  openTab: true,
  teamsIcon: false
}
let allLists: any = [];
var dashboardConfig: any = [];
var isShowTimeEntry: any = "";
var allSitesTasks: any = [];
var AllMetadata: any = [];
var isShowSiteCompostion: any = "";
const RootLevelDashboard = (props: any) => {
  const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
  const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
  const [AllTasks, setAllTasks] = React.useState([]);
  const [dashboardConfigrations, setDashboardConfigrations] = React.useState([]);
  const [AllTasksBackup, setAllTasksBackup] = React.useState([]);
  const [selectedSiteFilter, setSelectedSiteFilter]: any = React.useState([]);
  const [passdata, setpassdata] = React.useState("");
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  React.useEffect(() => {
    try {
      $("#spPageCanvasContent").removeClass();
      $("#spPageCanvasContent").addClass("hundred");
      $("#workbenchPageContent").removeClass();
      $("#workbenchPageContent").addClass("hundred");
      isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
      isShowSiteCompostion = props?.props?.SiteCompostion != "" ? JSON.parse(props?.props?.SiteCompostion) : ""
    } catch (error: any) {
      console.log(error)
    }
    AllListId = {
      MasterTaskListID: props?.props?.MasterTaskListID,
      TaskUsertListID: props?.props?.TaskUsertListID,
      SmartMetadataListID: props?.props?.SmartMetadataListID,
      //SiteTaskListID:this.props?.props?.SiteTaskListID,
      TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
      DocumentsListID: props?.props?.DocumentsListID,
      SmartInformationListID: props?.props?.SmartInformationListID,
      AdminConfigrationListID: props?.props?.AdminConfigrationListID,
      siteUrl: props?.props?.siteUrl,
      isShowTimeEntry: isShowTimeEntry,
      isShowSiteCompostion: isShowSiteCompostion
    }
    GetRootMetaData()

  }, [])
  const EditPopupCallBack = React.useCallback((item: any) => {
    setisOpenEditPopup(false);
  }, []);
  const EditDataTimeEntryData = (e: any, item: any) => {
    setIsTimeEntry(true);
    setSharewebTimeComponent(item);
  };
  const EditPopup = React.useCallback((item: any) => {
    setisOpenEditPopup(true);
    setpassdata(item);
  }, []);
  {
    isOpenEditPopup ? (
      <EditTaskPopup AllListId={AllListId} Items={passdata} context={props?.props?.Context} pageName="ProjectProfile" Call={EditPopupCallBack} />
    ) : (
      ""
    )
  }
  const GetRootMetaData = async () => {
    if (AllListId?.SmartMetadataListID != undefined) {
      try {
        let web = new Web(AllListId?.siteUrl);
        let smartmeta = [];
        let TaxonomyItems = [];
        smartmeta = await web.lists
          .getById(AllListId?.SmartMetadataListID)
          .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "TaxType", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Configurations", "Parent/Id", "Parent/Title")
          .top(5000)
          .expand("Parent")
          .get();
        smartmeta?.map((item: any) => {
          if (item?.Title == 'RootDashboardConfig') {
            dashboardConfig = JSON.parse(item?.Configurations);
            if(dashboardConfig?.length>0){
              setDashboardConfigrations(dashboardConfig)
            }
            dashboardConfig?.map(async (config: any) => {
              await GetSitesMetaData(config)
            })
          }
        })

      } catch (error) {
        console.log(error)

      }
    } else {
      alert('Smart Metadata List Id not present')
    }
  };
  const TimeEntryCallBack = React.useCallback((item1) => {
    setIsTimeEntry(false);
  }, []);

  const GetSitesMetaData = async (config: any) => {
    if (AllListId?.SmartMetadataListID != undefined) {
      try {
        let web = new Web(config?.siteUrl);
        let smartmeta = [];
        let TaxonomyItems = [];
        let siteConfig: any = [];
        smartmeta = await web.lists
          .getById(config?.metadataListId)
          .items.select("Id", "IsVisible", "ParentID", "Color_x0020_Tag", "Title", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
          .top(5000)
          .expand("Parent")
          .get();
        if (smartmeta.length > 0) {
          smartmeta?.map((site: any) => {
            if (site?.TaxType == 'Sites' && site?.Title != "Master Tasks" && site?.listId != undefined && site?.listId != null) {
              siteConfig.push(site)
            }
          })
          allLists = [...allLists, ...siteConfig]
        } else {
          siteConfig = smartmeta;
        }
        AllMetadata = smartmeta;
        await LoadAllSiteTasks(siteConfig, config);

      } catch (error) {
        console.log(error)

      }
    } else {
      alert('Smart Metadata List Id not present')
    }
  };
  const LoadAllSiteTasks = async (siteConfig: any, metaDataConfig: any) => {

    if (siteConfig?.length > 0) {
      try {
        var AllTask: any = [];
        let web = new Web(metaDataConfig?.siteUrl);
        var arraycount = 0;
        siteConfig.map(async (config: any) => {
          let smartmeta = [];
          smartmeta = await web.lists
            .getById(config?.listId)
            .items
            .select("Id,Title,Priority_x0020_Rank,Project/Priority_x0020_Rank,Project/Id,Project/Title,Events/Id,EventsId,workingThisWeek,EstimatedTime,SharewebTaskLevel1No,SharewebTaskLevel2No,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,SiteCompositionSettings,IsTodaysTask,Body,Component/Id,Component/Title,Services/Id,Services/Title,PercentComplete,ComponentId,Categories,ServicesId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
            .expand('AssignedTo,Events,Project,Author,Editor,Component,Services,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory')
            .top(4999)
            .get();
          arraycount++;
          smartmeta.map((items: any) => {

            items.Item_x0020_Type = 'tasks';
            items.ShowTeamsIcon = false
            items.AllTeamMember = [];
            items.siteType = config.Title;
            items.metaDataListId = metaDataConfig?.metadataListId;
            items.bodys = items.Body != null && items.Body.split('<p><br></p>').join('');
            items.listId = config.listId;
            items.siteUrl = config.siteUrl.Url;
            items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
            items.DisplayDueDate =
              items.DueDate != null
                ? Moment(items.DueDate).format("DD/MM/YYYY")
                : "";
            items.DisplayCreateDate =
              items.Created != null
                ? Moment(items.Created).format("DD/MM/YYYY")
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
            items["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
            if (items?.Project?.Title != undefined) {
              items["ProjectTitle"] = items?.Project?.Title;
              items["ProjectPriority"] = items?.Project?.Priority_x0020_Rank;
            } else {
              items["ProjectTitle"] = '';
              items["ProjectPriority"] = 0;
            }


            items.TeamMembersSearch = "";
            items.AssignedToIds = [];
            // if (items.AssignedTo != undefined) {
            //     items?.AssignedTo?.map((taskUser: any) => {
            //         items.AssignedToIds.push(taskUser?.Id)
            //         AllTaskUsers.map((user: any) => {
            //             if (user.AssingedToUserId == taskUser.Id) {
            //                 if (user?.Title != undefined) {
            //                     items.TeamMembersSearch =
            //                         items.TeamMembersSearch + " " + user?.Title;
            //                 }
            //             }
            //         });
            //     });
            // }
            if (items?.ClientCategory?.length > 0) {
              items.ClientCategorySearch = items?.ClientCategory?.map((elem: any) => elem.Title).join(" ")
            } else {
              items.ClientCategorySearch = ''
            }
            // items.componentString =
            //     items.Component != undefined &&
            //         items.Component != undefined &&
            //         items.Component.length > 0
            //         ? getComponentasString(items.Component)
            //         : "";
            items.Shareweb_x0020_ID = globalCommon.getTaskId(items);
            // AllTaskUsers?.map((user: any) => {
            //     if (user.AssingedToUserId == items.Author.Id) {
            //         items.createdImg = user?.Item_x0020_Cover?.Url;
            //     }
            //     if (items.Team_x0020_Members != undefined) {
            //         items.Team_x0020_Members.map((taskUser: any) => {
            //             var newuserdata: any = {};
            //             if (user.AssingedToUserId == taskUser.Id) {
            //                 newuserdata["useimageurl"] = user?.Item_x0020_Cover?.Url;
            //                 newuserdata["Suffix"] = user?.Suffix;
            //                 newuserdata["Title"] = user?.Title;
            //                 newuserdata["UserId"] = user?.AssingedToUserId;
            //                 items["Usertitlename"] = user?.Title;
            //                 items.AllTeamMember.push(newuserdata);
            //             }

            //         });
            //     }
            // });
            allSitesTasks.push(items);
          });
          let setCount = siteConfig?.length
          if (arraycount === setCount) {
            AllTask.sort((a: any, b: any) => {
              return b?.Priority_x0020_Rank - a?.Priority_x0020_Rank;
            })
            const mergedArray = [...AllTasks, ...allSitesTasks]
            setAllTasks(sortOnCreated(mergedArray));
            setAllTasksBackup(sortOnCreated(mergedArray));
            console.log(allSitesTasks);
          }

        });
      } catch (error) {
        console.log(error)

      }
    } else {
      alert('Site Config Length less than 0')
    }
  };
  const getComponentasString = function (results: any) {
    var component = "";
    $.each(results, function (cmp: any) {
      component += cmp.Title + "; ";
    });
    return component;
  };
  function IndeterminateCheckbox({
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
        className={className + "  cursor-pointer form-check-input rounded-0"}
        {...rest}
      />
    );
  }

  const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        header: ({ table }: any) => (
          <>
            <IndeterminateCheckbox className=" "
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

              {getValue()}
            </span>
          </>
        ),
        accessorKey: "",
        id: "row?.original.Id",
        resetColumnFilters: false,
        resetSorting: false,
        canSort: false,
        placeholder: "",
        size: 35
      },
      {
        accessorKey: 'siteType',
        // header: ({ table }: any) => (
        //   <>
        //   <span className='Site-Filter'>
        //   <span className='me-1'>
        //           <div className='popover__wrapper me-1' data-bs-toggle='tooltip' data-bs-placement='auto'>
        //           <FaFilter />
        //             <div className='popover__content'>
        //             <div className="dropdown-menu p-2 ">
        //                                 <li><span><input type='checkbox'  value={'idType'} /> <label>Select All</label> </span></li>
        //                                <ul className='dropitem'>
        //                                     {allLists?.map((item: any) => <li><span><input type='checkbox'  value={item.Title} /> <label>{item.Title}</label> </span></li>)}
        //                                          </ul>
        //                                          <li><a className="btn btn-primary" >Filter</a> <a className="btn btn-default ms-1" >Clear</a></li>
        //                           </div>
        //             </div>
        //           </div>
        //         </span>
        //   </span>
        //   </>
        // ),
        cell: ({ row }) => (
          <span>
            <img className='circularImage rounded-circle' src={row?.original?.SiteIcon} />
          </span>
        ),
        id: "Site",
        header: "",
        placeholder: "Site",
        resetSorting: false,
        resetColumnFilters: false,
        size: 70
      },

      {
        accessorKey: "Shareweb_x0020_ID",
        placeholder: "Task Id",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 140,
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">
              <div className='tooltipSec popover__wrapper me-1' data-bs-toggle='tooltip' data-bs-placement='auto'>
                {row.original.Services.length >= 1 ? (
                  <span className='text-success'>{row?.original?.Shareweb_x0020_ID}</span>
                ) : (
                  <span>{row?.original?.Shareweb_x0020_ID}</span>
                )}
              </div>
            </span>
          </>
        ),
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
            <span className='d-flex'>
              {row.original.Services.length >= 1 ? (
                <a
                  className="hreflink text-success"
                  href={`${row?.original?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                  data-interception="off"
                  target="_blank"
                >
                  {row?.original?.Title}
                </a>
              ) : (
                <a
                  className="hreflink"
                  href={`${row?.original?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                  data-interception="off"
                  target="_blank"
                >
                  {row?.original?.Title}
                </a>
              )}

              {row?.original?.Body !== null && (
                <span className='me-1'>
                  <div className='popover__wrapper me-1' data-bs-toggle='tooltip' data-bs-placement='auto'>
                    <span className='svg__iconbox svg__icon--info'></span>
                    <div className='popover__content'>
                      <span>
                        <p dangerouslySetInnerHTML={{ __html: row?.original?.bodys }}></p>
                      </span>
                    </div>
                  </div>
                </span>
              )}
            </span>
          </>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
      },
      {
        accessorFn: (row) => row?.Portfolio,
        cell: ({ row }) => (
          <span>
            {row.original.Services.length >= 1 ? (
              <a
                className="hreflink text-success"
                data-interception="off"
                target="blank"
                href={`${row?.original?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
              >
                {row?.original?.portfolio?.Title}
              </a>
            ) : (
              <a
                className="hreflink"
                data-interception="off"
                target="blank"
                href={`${row?.original?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
              >
                {row?.original?.portfolio?.Title}
              </a>
            )}
          </span>
        ),
        id: "Portfolio",
        placeholder: "Portfolio",
        resetColumnFilters: false,
        resetSorting: false,
        header: ""
      },

      {
        accessorFn: (row) => row?.Priority_x0020_Rank,
        cell: ({ row }) => (
          <span>
            <InlineEditingcolumns
              type='Task'
              callBack={inlineCallBack}
              columnName='Priority'
              item={row?.original}
              pageName={'ProjectManagment'}
            />
            {/* {row?.original?.Priority_x0020_Rank} */}
          </span>
        ),
        placeholder: "Priority",
        id: 'Priority',
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 100
      },
      {
        accessorFn: (row) => row?.DueDate,
        cell: ({ row }) => (
          <>
            <InlineEditingcolumns
              callBack={inlineCallBack}
              columnName='DueDate'
              item={row?.original}
              pageName={'ProjectManagment'}
            />
            {/* <span>{row?.original?.DisplayDueDate}</span> */}

          </>
        ),
        id: 'DueDate',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Due Date",
        header: "",
        size: 80
      },
      {
        accessorFn: (row) => row?.PercentComplete,
        cell: ({ row }) => (
          <span>
            {/* {row?.original?.PercentComplete} */}
            <InlineEditingcolumns
              callBack={inlineCallBack}
              columnName='PercentComplete'
              item={row?.original}
              pageName={'ProjectManagment'}
            />
          </span>
        ),
        id: 'PercentComplete',
        placeholder: "% Complete",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
        size: 80
      },

      {
        accessorFn: (row) => row?.Created,
        cell: ({ row }) => (
          <span>
            {row.original.Services.length >= 1 ? (
              <span className='ms-1 text-success'>{row?.original?.DisplayCreateDate} </span>
            ) : (
              <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>
            )}

            {row?.original?.createdImg != undefined ? (
              <>
                <a
                  href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                  target="_blank"
                  data-interception="off"
                >
                  <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
                </a>
              </>
            ) : (
              <span className='svg__iconbox svg__icon--defaultUser' title={row?.original?.Author?.Title}></span>
            )}
          </span>
        ),
        id: 'Created',
        canSort: false,
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Created",
        header: "",
        size: 125
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
        cell: ({ row }) => (
          <span className='d-flex'>
            {/* <span
                  title='Edit Task'
                  onClick={() => EditPopup(row?.original)}
                  className='svg__iconbox svg__icon--edit hreflink'
                ></span> */}
          </span>
        ),
        id: 'Actions',
        accessorKey: "",
        canSort: false,
        resetSorting: false,
        resetColumnFilters: false,
        placeholder: "",
        size: 35
      },
    ],
    [allSitesTasks]
  );
  const callBackData = React.useCallback((elem: any, ShowingData: any) => {


  }, []);
  const inlineCallBack = React.useCallback((task: any) => {
    setAllTasks(prevState => {
      return prevState.map(item => {
        if (item?.Id === task?.Id && task?.siteType === item?.siteType) {
          return {
            ...item,
            ...task
          };
        } else {
          return item;
        }
      });
    });
    

  }, []);
  const sortOnCreated = (Array: any) => {
    Array.sort((a: any, b: any) => new Date(b.Created).getTime() - new Date(a.Created).getTime());
    return Array;
  }
  const clearSiteFilter = () => {
    setSelectedSiteFilter([])
    setAllTasks(AllTasksBackup);
  }
  const siteFilter = (item: any) => {
    let selectedSites:any=[];
    selectedSites=selectedSiteFilter;
    if(!selectedSites?.includes(item?.siteUrl)){
      selectedSites.push(item?.siteUrl);
    }else{
      var indexToRemove = selectedSites.indexOf(item?.siteUrl);
      selectedSites?.splice(indexToRemove, 1)
    }
    setSelectedSiteFilter(selectedSites);
    filterData();
  }
  const filterData =()=>{
    if(selectedSiteFilter?.length>0){
      setAllTasks(prevState => {
        return AllTasksBackup?.filter(item => {
          if(selectedSiteFilter?.includes(item?.siteUrl)){
            return item
          }
        });
      });
    }else{
      setAllTasks(AllTasksBackup);
    }
  }
  return (
    <>
      <div className='AllTaskSiteRadio d-flex justify-content-between'>
        <dl className='alignCenter gap-2 mb-0'>
          {dashboardConfigrations?.map((list: any) => {
            return (
              <dt className='form-check l-radio'>
                <input className='form-check-input' type="checkbox" value={list?.siteUrl} name="date" checked={selectedSiteFilter?.includes(list?.siteUrl)} onClick={() => siteFilter(list)} /> {list?.siteName}
              </dt>
            )
          })}

        </dl>
        <div className="text-end">
          <a className="hreflink" onClick={() => { clearSiteFilter() }}>Clear Site Filter</a>
        </div>
      </div>
      <div className="Alltable">
      <GlobalCommanTable AllListId={AllListId} headerOptions={headerOptions} columns={column2} data={AllTasks} pageSize={100} callBackData={callBackData} showPagination={true} showHeader={true} />
      </div>
      {IsTimeEntry && (
        <DisplayTimeEntry
          props={SharewebTimeComponent}
          CallBackTimeEntry={TimeEntryCallBack}
          Context={props?.props?.Context}
        ></DisplayTimeEntry>
      )}
    </>
  )
}
export default RootLevelDashboard;