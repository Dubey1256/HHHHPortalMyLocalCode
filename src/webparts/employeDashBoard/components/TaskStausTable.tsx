import React, { useEffect } from "react";
import { myContextValue } from "../../../globalComponents/globalCommon";
import * as globalCommon from '../../../globalComponents/globalCommon';
import ComingBirthday from "./comingBirthday";
import MyNotes from "./MyNotes";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import EmailComponenet from "../../taskprofile/components/emailComponent";
import ManageConfigPopup from "../../../globalComponents/ManageConfigPopup";
import { Web } from "sp-pnp-js";
let Count = 0;
let DashboardConfig: any = [];
let DashboardConfigCopy: any = [];
let AllapprovalTask: any = [];
let flagApproval: boolean = false;
let approveItem: any;
let emailStatus: any = "";
let IsShowConfigBtn = false;
let dragItem: any;
const TaskStatusTbl = (Tile: any) => {
  const ContextData: any = React.useContext(myContextValue);
  const AllTaskUser: any = ContextData?.AlltaskData?.AllTaskUser;
  const AllMasterTasks: any = ContextData?.AllMasterTasks;
  const [editPopup, setEditPopup]: any = React.useState(false);
  const [result, setResult]: any = React.useState(false);
  const [ActiveTile, setActiveTile] = React.useState(Tile?.activeTile);
  if (ContextData != undefined && ContextData?.DashboardConfig != undefined && ContextData?.DashboardConfig?.length > 0) {
    AllapprovalTask = ContextData.DashboardConfig.filter((item: any) => item.Id == 6)[0];
    if (AllapprovalTask != undefined && AllapprovalTask.length > 0)
      AllapprovalTask = AllapprovalTask[0].Tasks;
    else
      AllapprovalTask = []
  }
  let [approvalTask, setapprovalTask]: any = React.useState([]);
  const [sendMail, setsendMail]: any = React.useState(false);
  const [IsManageConfigPopup, setIsManageConfigPopup] = React.useState(false);
  const [SelectedItem, setSelectedItem]: any = React.useState({});
  if (ContextData != undefined && ContextData != '') {
    ContextData.ShowHideSettingIcon = (Value: any) => {
      IsShowConfigBtn = Value;
    };
  }
  let AllListId: any = {
    TaskUsertListID: ContextData?.propsValue?.TaskUsertListID,
    SmartMetadataListID: ContextData?.propsValue?.SmartMetadataListID,
    MasterTaskListID: ContextData?.propsValue?.MasterTaskListID,
    siteUrl: ContextData?.siteUrl,
    TaskTimeSheetListID: ContextData?.propsValue?.TaskTimeSheetListID,
    isShowTimeEntry: true,
    isShowSiteCompostion: true
  };
  if (AllapprovalTask && AllapprovalTask.length > 0 && flagApproval != true) {
    flagApproval = true
    setapprovalTask(AllapprovalTask)
  }
  useEffect(() => {
    Count += 1
    if (ContextData?.DashboardConfig != undefined && ContextData?.DashboardConfig?.length > 0) {
      DashboardConfig = ContextData?.DashboardConfig;
      DashboardConfigCopy = [...DashboardConfig]
    }
  }, []);
  const startDrag = (e: any, Item: any, ItemId: any, draggedItem: any) => {
    dragItem = draggedItem;
    e.dataTransfer.setData("DataId", JSON.stringify(Item))
    console.log('Drag successfuly');
  }
  const onDropUser = (e: any, User: any) => {
    let TeamMemberIds = [];
    let AssignedToIds = [];
    let Item = globalCommon.parseJSON(e.dataTransfer.getData("DataId"))
    if (Item?.TeamMembers != undefined && Item?.TeamMembers?.length > 0) {
      Item?.TeamMembers?.map((teamMember: any) => {
        TeamMemberIds.push(teamMember.Id);
      });
    }
    TeamMemberIds.push(User?.AssingedToUserId);
    Item?.TeamMembers.push({ "Id": User?.AssingedToUserId, "Title": User?.Title })
    if (Item?.AssignedTo != undefined && Item?.AssignedTo?.length > 0) {
      Item?.AssignedTo?.map((assignMember: any) => {
        AssignedToIds.push(assignMember.Id);
      });
    }
    AssignedToIds.push(User?.AssingedToUserId);
    Item?.AssignedTo.push({ "Id": User?.AssingedToUserId, "Title": User?.Title })
    if (Item != undefined && Item != '') {
      let web = new Web(ContextData?.propsValue?.siteUrl);
      web.lists.getById(Item.listId).items.getById(Item?.Id).update({
        AssignedToId: { results: AssignedToIds != undefined && AssignedToIds.length > 0 ? AssignedToIds : [], },
        TeamMembersId: { results: TeamMemberIds != undefined && TeamMemberIds.length > 0 ? TeamMemberIds : [], },
      }).then((res: any) => {
        console.log('Drop successfuly');
        DashboardConfig?.map((item: any) => {
          if (item?.WebpartTitle != undefined && dragItem?.WebpartTitle != undefined && item?.WebpartTitle == dragItem?.WebpartTitle) {
            item?.Tasks.map((task: any) => {
              if (task?.Id == Item.Id) {
                task.AssignedTo = Item?.AssignedTo;
                task.TeamMembers = Item?.TeamMembers;
              }
            });
          }
        });
        setActiveTile(Tile?.activeTile)
      }).catch((err: any) => {
        console.log(err);
      })
    }

  }
  const generateDynamicColumns = (item: any) => {
    return [{
      accessorKey: "",
      placeholder: "",
      hasCheckbox: true,
      hasCustomExpanded: item?.GroupByView,
      hasExpanded: item?.GroupByView,
      size: 50,
      id: "Id"
    },
    {
      cell: ({ row, getValue }: any) => (
        <div>
          <img width={"20px"} height={"20px"} className="rounded-circle" src={row?.original?.SiteIcon} />
        </div>
      ),
      accessorKey: "",
      id: "row?.original.Id",
      canSort: false,
      placeholder: "",
      size: 80
    },
    {
      accessorKey: "TaskID",
      placeholder: "ID",
      id: 'TaskID',
      size: 180,
      cell: ({ row, getValue }: any) => (
        <span className="d-flex">
          <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={AllMasterTasks} AllSitesTaskData={item?.Tasks} AllListId={ContextData?.propsValue?.Context} />
        </span>
      ),
    },
    {
      accessorFn: (row: any) => row?.Title,
      cell: ({ row, getValue }: any) => (
        <div>
          <a className="hreflink" draggable onDragOver={(e) => e.preventDefault()} onDragStart={(e) => startDrag(e, row?.original, row?.original?.TaskID, item)} target='_blank' style={{ textDecoration: 'none', cursor: 'pointer' }} href={`${ContextData.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.site}`}
            rel='noopener noreferrer' data-interception="off" > {row?.original?.Title}
          </a>
          {row?.original?.descriptionsSearch != null && row?.original?.descriptionsSearch != "" && (
            <span className="alignIcon"> <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} /></span>
          )}
        </div>
      ),
      id: "Title",
      placeholder: "Title",
      resetColumnFilters: false,
      header: "",
      size: 460
    },
    {
      accessorFn: (row: any) => row?.SmartPriority,
      cell: ({ row }: any) => (
        <div className="text-center boldClable" title={row?.original?.showFormulaOnHover}>{row?.original?.SmartPriority != 0 ? row?.original?.SmartPriority : null}</div>
      ),
      filterFn: (row: any, columnName: any, filterValue: any) => {
        if (row?.original?.SmartPriority?.includes(filterValue)) {
          return true
        } else {
          return false
        }
      },
      id: "SmartPriority",
      placeholder: "SmartPriority",
      resetColumnFilters: false,
      header: "",
      size: 190,
    },
    {
      accessorKey: "percentage",
      placeholder: "% Complete",
      header: "",
      resetColumnFilters: false,
      size: 140,
      id: "percentage"
    },
    {
      accessorFn: (row: any) => row?.Created,
      cell: ({ row, column }: any) => (
        <div className="alignCenter">
          {row?.original?.Created == null ? ("") : (
            <>
              <div className='ms-1'>{row?.original?.DisplayCreateDate} </div>
              {row?.original?.Author != undefined &&
                <>
                  <a href={`${ContextData?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`} target="_blank" data-interception="off">
                    <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.Author?.autherImage} />
                  </a>
                </>
              }
            </>
          )}
        </div>
      ),
      id: 'Created',
      isColumnDefultSortingDesc: true,
      resetColumnFilters: false,
      resetSorting: false,
      placeholder: "Created",
      filterFn: (row: any, columnName: any, filterValue: any) => {
        if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
          return true
        } else {
          return false
        }
      },
      header: "",
      size: 100
    },
    {
      cell: ({ row, getValue }: any) => (
        <span title="Edit Task" className="alignIcon svg__iconbox svg__icon--edit hreflink ms-1" onClick={() => editPopFunc(row.original)} ></span>

      ),
      id: 'Id',
      canSort: false,
      placeholder: "",
      header: "",
      resetColumnFilters: false,
      resetSorting: false,
      size: 45,
    },]
  }
  if (Tile.activeTile != undefined && DashboardConfigCopy != undefined && DashboardConfigCopy?.length > 0)
    DashboardConfig = DashboardConfigCopy.filter((config: any) => config?.TileName == '' || config?.TileName == Tile.activeTile);
  const updatedDashboardConfig = DashboardConfig?.map((item: any) => {
    let columnss: any = [];
    columnss = generateDynamicColumns(item);
    return { ...item, column: columnss };
  });
  DashboardConfig = updatedDashboardConfig;
  const editPopFunc = (item: any) => {
    setEditPopup(true);
    setResult(item)
  }
  function CallBack() {
    setEditPopup(false);
  }
  const callBackData = React.useCallback((elem: any, ShowingData: any) => {
    if (elem != undefined)
      approveItem = elem;
    else
      approveItem = undefined
  }, []);
  const sendEmail = () => {
    approveItem.PercentComplete = 3
    approveItem.listName = approveItem.site;
    approveItem.FeedBack = approveItem?.FeedBack != null ? JSON.parse(approveItem?.FeedBack) : null;
    setsendMail(true)
    emailStatus = "Approved"
  }
  const approvalcallback = () => {
    setsendMail(false)
    emailStatus = ""
    const data: any = AllapprovalTask.filter((i: any) => { return i.Id != approveItem.Id })
    setapprovalTask(data);
  }
  const sendAllWorkingTodayTasks = async (sharingTasks: any) => {
    let to: any = [ContextData.approverEmail];
    let body: any = '';
    let confirmation = confirm("Are you sure you want to share the working today task of all team members?")
    if (confirmation) {
      var subject = "Today's Working Tasks Under Projects";
      let tasksCopy: any = [];
      let text = '';
      tasksCopy = sharingTasks;
      if (tasksCopy?.length > 0) {
        let taskCount = 0;
        tasksCopy?.map(async (item: any) => {
          try {
            item.smartTime = 0;
            item.showDesc = '';
            let memberOnLeave = false;
            if (!memberOnLeave) {
              taskCount++;
              text +=
                `<tr>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${item?.site} </td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.TaskID} </td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"><p style="margin:0px; color:#333;"><a style="text-decoration: none;" href =${ContextData?.siteUrl}/SitePages/Task-Profile.aspx?taskId= ${item?.Id}&Site=${item?.site}> ${item?.Title} </a></p></td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.Categories} </td>
                  <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.percentage} </td>
                  </tr>`;
            }
          } catch (error) {
            console.log(error)
          }
        })
        if (taskCount > 0) {
          body += `<table cellpadding="0" cellspacing="0" align="left" width="100%" border="1" style=" border-color: #444;margin-bottom:10px">
                        <thead>
                        <tr>
                        <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Site</th>
                        <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;x">Task ID</th>
                        <th width="500" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Title</th>
                        <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Category</th>
                        <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">% </th>
                        </tr>
                        </thead>
                        <tbody>
                        ${text}
                        </tbody>
                        </table>`
        }
      }
      let sendAllTasks = `<span style="font-size: 18px;margin-bottom: 10px;">
            Hi there, <br><br>
            Below is the working today task of all the team members <strong>(Project Wise):</strong>
            <p><a href =${ContextData?.siteUrl}/SitePages/Project-Management-Overview.aspx>Click here for flat overview of the today's tasks</a></p>
            </span>
            ${body}
            <h3>
            Thanks.
            </h3>`
      SendEmailFinal(to, subject, sendAllTasks);
    }
  }
  const SendEmailFinal = async (to: any, subject: any, body: any) => {
    let sp = spfi().using(spSPFx(ContextData?.propsValue?.Context));
    sp.utility.sendEmail({
      Body: body,
      Subject: subject,
      To: to,
      AdditionalHeaders: {
        "content-type": "text/html",
        'Reply-To': 'abhishek.tiwari@smalsus.com'
      },
    }).then(() => {
      console.log("Email Sent!");
    }).catch((err) => {
      console.log(err.message);
    });
  }
  const OpenConfigPopup = (Config: any) => {
    setIsManageConfigPopup(true);
    setSelectedItem(Config)
  }
  const CloseOpenConfigPopup = () => {
    setIsManageConfigPopup(false);
    setSelectedItem('')
  }
  const generateDashboard = () => {
    const rows: any = [];
    let currentRow: any = [];
    DashboardConfig.forEach((config: any, index: any) => {
      if (Tile.activeTile === config?.TileName || config?.TileName === "") {
        const box = (
          <div className={`col-${12 / config.highestColumn} px-1 mb-2 `} key={index}>
            {config?.ShowWebpart == true && config?.GroupByView != undefined && <section>
              {config?.DataSource == 'Tasks' && <div className="workingSec empAllSec clearfix">
                <div className="alignCenter mb-2 justify-content-between">
                  <span className="fw-bold">
                    {`${config?.WebpartTitle}`}  {config?.Tasks != undefined && `(${config?.Tasks?.length})`}
                  </span>
                  <span className="alignCenter">
                    {IsShowConfigBtn && <span className="svg__iconbox svg__icon--setting hreflink" title="Manage Configuration" onClick={(e) => OpenConfigPopup(config)}></span>}
                    {config?.WebpartTitle != 'Draft Tasks' && config?.WebpartTitle != 'Waiting for Approval' && <a className="empCol hreflink me-2"
                      target="_blank" data-interception="off" title="Create New Task" href="/sites/HHHH/SP/SitePages/CreateTask.aspx">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none">
                        <path d="M27.9601 22.2H26.0401V26.0399H22.2002V27.9599H26.0401V31.8H27.9601V27.9599H31.8002V26.0399H27.9601V22.2Z" fill="#057BD0" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3996 9.60001H9.59961V32.4H15.5996V38.4H38.3996V15.6H15.5996V31.2968H10.7028V10.7032H31.2964V15.4839H32.3996V9.60001ZM16.7028 16.7032H37.2964V37.2968H16.7028V16.7032Z" fill="#057BD0" />
                        <path d="M9.59956 9.59999V9.29999H9.29956V9.59999H9.59956ZM32.3996 9.59999H32.6996V9.29999H32.3996V9.59999ZM9.59956 32.4H9.29956V32.7H9.59956V32.4ZM15.5996 32.4H15.8996V32.1H15.5996V32.4ZM15.5996 38.4H15.2996V38.7H15.5996V38.4ZM38.3996 38.4V38.7H38.6996V38.4H38.3996ZM38.3996 15.6H38.6996V15.3H38.3996V15.6ZM15.5996 15.6V15.3H15.2996V15.6H15.5996ZM15.5996 31.2968V31.5968H15.8996V31.2968H15.5996ZM10.7028 31.2968H10.4028V31.5968H10.7028V31.2968ZM10.7028 10.7032V10.4032H10.4028V10.7032H10.7028ZM31.2964 10.7032H31.5963V10.4032H31.2964V10.7032ZM31.2964 15.4839H30.9964V15.7839H31.2964V15.4839ZM32.3996 15.4839V15.7839H32.6996V15.4839H32.3996ZM37.2963 16.7032H37.5964V16.4032H37.2963V16.7032ZM16.7028 16.7032V16.4032H16.4028V16.7032H16.7028ZM37.2963 37.2968V37.5968H37.5964V37.2968H37.2963ZM16.7028 37.2968H16.4028V37.5968H16.7028V37.2968ZM9.59956 9.89999H32.3996V9.29999H9.59956V9.89999ZM9.89956 32.4V9.59999H9.29956V32.4H9.89956ZM15.5996 32.1H9.59956V32.7H15.5996V32.1ZM15.2996 32.4V38.4H15.8996V32.4H15.2996ZM15.5996 38.7H38.3996V38.1H15.5996V38.7ZM38.6996 38.4V15.6H38.0996V38.4H38.6996ZM38.3996 15.3H15.5996V15.9H38.3996V15.3ZM15.2996 15.6V31.2968H15.8996V15.6H15.2996ZM10.7028 31.5968H15.5996V30.9968H10.7028V31.5968ZM10.4028 10.7032V31.2968H11.0028V10.7032H10.4028ZM31.2964 10.4032H10.7028V11.0032H31.2964V10.4032ZM31.5963 15.4839V10.7032H30.9964V15.4839H31.5963ZM32.3996 15.1839H31.2964V15.7839H32.3996V15.1839ZM32.0996 9.59999V15.4839H32.6996V9.59999H32.0996ZM37.2963 16.4032H16.7028V17.0032H37.2963V16.4032ZM37.5964 37.2968V16.7032H36.9963V37.2968H37.5964ZM16.7028 37.5968H37.2963V36.9968H16.7028V37.5968ZM16.4028 16.7032V37.2968H17.0028V16.7032H16.4028Z" fill="#057BD0" />
                      </svg>
                    </a>}
                    {config?.WebpartTitle == 'Draft Tasks' && <a className="empCol hreflink me-3">Approve</a>}
                    {config?.WebpartTitle == 'Waiting for Approval' && <span className="empCol me-3 hreflink" onClick={sendEmail}>Approve</span>}
                    {<span title={`Share ${config?.WebpartTitle}`} onClick={() => sendAllWorkingTodayTasks(config?.Tasks)} className="hreflink svg__iconbox svg__icon--share empBg"></span>}
                  </span>
                </div>
                <div className="Alltable maXh-300" style={{ height: "300px" }}>
                  {config?.Tasks != undefined && (
                    <GlobalCommanTable wrapperHeight="87%" showHeader={true} TaskUsers={AllTaskUser} portfolioColor={'#000066'} columns={config.column} data={config?.Tasks} callBackData={callBackData} />
                  )}
                  {config?.WebpartTitle == 'Waiting for Approval' && <span>
                    {sendMail && emailStatus != "" && approveItem && <EmailComponenet approvalcallback={approvalcallback} Context={ContextData.Context} emailStatus={"Approved"} items={approveItem} />}
                  </span>}
                </div>
              </div>}
              {config?.DataSource == 'TaskUsers' &&
                <>
                  <div className="alignCenter mb-2 justify-content-between">
                    <span className="fw-bold">
                      {`${config?.WebpartTitle}`}  {config?.Tasks != undefined && `(${config?.Tasks?.length})`}
                    </span>
                  </div>
                  <div className="dashbord-teamBox">
                    {config?.Tasks != null && config?.Tasks?.length > 0 && config.Tasks.map((user: any, index: number) => {
                      return <div ui-on-drop="onDropRemoveTeam($event,$data,taskUsers)" className="top-assign ng-scope">
                        {user.childs.length > 0 &&
                          <div className="team ng-scope">
                            <label className="BdrBtm">
                              {user.Title}
                            </label>
                            <div className='d-flex'>
                              {user.childs.map((item: any, i: number) => {
                                return <div className="marginR41 ng-scope">
                                  {item.Item_x0020_Cover != undefined && item.AssingedToUser != undefined &&
                                    <span>
                                      <img draggable onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropUser(e, item)} className="large_teamsimg" src={item.Item_x0020_Cover.Url} title={item.AssingedToUser.Title} />
                                    </span>
                                  }
                                </div>
                              })}
                            </div>
                          </div>
                        }
                      </div>
                    })
                    }
                  </div>
                </>
              }
            </section>}
            {config.IsMyNotes == true && config?.ShowWebpart == true && config?.GroupByView == undefined &&
              <div className="empAllSec notesSec shadow-sm clearfix">
                <MyNotes config={config} IsShowConfigBtn={IsShowConfigBtn} />
              </div>
            }
            {config.IsUpcomingBday == true && config?.ShowWebpart == true && config?.GroupByView == undefined &&
              <div className="empAllSec birthSec shadow-sm clearfix">
                <ComingBirthday config={config} IsShowConfigBtn={IsShowConfigBtn} />
              </div>
            }
          </div>
        );
        currentRow.push(box);
        if (currentRow.length === config.highestColumn || index === DashboardConfig.length - 1) {
          const row = (
            <div className="row m-0 empMainSec" key={`row_${index}`}>
              {currentRow}
            </div>
          );
          rows.push(row);
          currentRow = [];
        }
      }
    });
    return rows;
  };
  return (
    <div>
      {ActiveTile != undefined && generateDashboard()}
      <span>
        {editPopup && <EditTaskPopup Items={result} context={ContextData?.propsValue?.Context} AllListId={AllListId} Call={() => { CallBack() }} />}
      </span>
      <span>
        {IsManageConfigPopup && <ManageConfigPopup DashboardConfigBackUp={ContextData?.DashboardConfigBackUp} props={ContextData?.propsValue} SelectedItem={SelectedItem} IsManageConfigPopup={IsManageConfigPopup} CloseOpenConfigPopup={CloseOpenConfigPopup} />}
      </span>
    </div>
  );
};
export default TaskStatusTbl;