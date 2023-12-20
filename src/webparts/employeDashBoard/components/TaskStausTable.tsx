import React, { useState, useEffect } from "react";
import { Web } from "sp-pnp-js";
import { myContextValue } from "../../../globalComponents/globalCommon";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import { ColumnDef } from "@tanstack/react-table";
import EmployeePieChart from "./EmployeePieChart";
import ComingBirthday from "./comingBirthday";
import MyNotes from "./MyNotes";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import EmailComponent from "../../../globalComponents/EmailComponents";
let IsshowTable = true;
let DashboardConfig: any = [];
let flagApproval: boolean = false;
let approveItem: any;
let emailStatus: any = "";
const TaskStatusTbl = (Tile: any) => {
  let portfolioColor: any = '#000066';
  const ContextData: any = React.useContext(myContextValue);
  const draftCatogary: any = ContextData?.AlltaskData.DraftCatogary;
  const todaysTask: any = ContextData?.AlltaskData.TodaysTask;
  const bottleneckTask: any = ContextData?.AlltaskData.BottleneckTask;
  const immediateTask: any = ContextData?.AlltaskData.ImmediateTask;
  const thisWeekTask: any = ContextData?.AlltaskData.ThisWeekTask;
  const allAssignedTask: any = ContextData?.AlltaskData?.AssignedTask;
  const AllTaskUser: any = ContextData?.AlltaskData?.AllTaskUser;
  const AllMasterTasks: any = ContextData?.AllMasterTasks;
  const [editPopup, setEditPopup]: any = React.useState(false);
  const [result, setResult]: any = React.useState(false);
  const AllapprovalTask: any = ContextData?.AlltaskData.ApprovalTask;
  let [approvalTask, setapprovalTask]: any = React.useState([]);
  const [sendMail, setsendMail]: any = React.useState(false);
  if (AllapprovalTask && AllapprovalTask.length > 0 && flagApproval != true) {
    flagApproval = true
    setapprovalTask(AllapprovalTask)
  }
  if (ContextData?.DashboardConfig != undefined && ContextData?.DashboardConfig?.length > 0)
    DashboardConfig = ContextData?.DashboardConfig;

  let AllListId: any = {
    TaskUsertListID: ContextData?.propsValue?.TaskUsertListID,
    SmartMetadataListID: ContextData?.propsValue?.SmartMetadataListID,
    MasterTaskListID: ContextData?.propsValue?.MasterTaskListID,
    siteUrl: ContextData?.siteUrl,
    TaskTimeSheetListID: ContextData?.propsValue?.TaskTimeSheetListID,
    isShowTimeEntry: true,
    isShowSiteCompostion: true
  };
  const generateDynamicColumns = () => {
    return [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: false,
        hasExpanded: false,
        size: 55,
        id: "Id"
      },
      {
        cell: ({ row, getValue }: any) => (
          <div>
            <img
              width={"20px"}
              height={"20px"}
              className="rounded-circle"
              src={row?.original?.siteIcon}
            />
          </div>
        ),
        accessorKey: "",
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 95
      },
      {
        accessorKey: "TaskID",
        placeholder: "ID",
        id: 'TaskID',
        size: 195,
        cell: ({ row, getValue }: any) => (
          <span className="d-flex">
            <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={AllMasterTasks} AllSitesTaskData={todaysTask} AllListId={ContextData?.propsValue?.Context} />
          </span>
        ),
      },
      {
        accessorFn: (row: any) => row?.Title,
        cell: ({ row, getValue }: any) => (
          <div>
            <a className="hreflink"
              target='_blank'
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              href={`${ContextData.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.site}`}
              rel='noopener noreferrer'
              data-interception="off"
            >
              {row?.original?.Title}
            </a>
            {row?.original?.descriptionsSearch != null &&
              row?.original?.descriptionsSearch != "" && (
                <InfoIconsToolTip
                  Discription={row?.original?.descriptionsSearch}
                  row={row?.original}
                />
              )}
          </div>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        header: "",
        size: 480
      },
      {
        accessorKey: "PriorityRank",
        placeholder: "Priority",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "PriorityRank"
      },
      {
        accessorKey: "percentage",
        placeholder: "% Complete",
        header: "",
        resetColumnFilters: false,
        size: 42,
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
                    <a href={`${ContextData?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                      target="_blank" data-interception="off">
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
        size: 125
      },
      {
        cell: ({ row, getValue }: any) => (
          <span>
            <span title="Edit Task" className="svg__iconbox svg__icon--edit hreflink ms-1" onClick={() => editPopFunc(row.original)} ></span>
          </span>
        ),
        id: 'Id',
        canSort: false,
        placeholder: "",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 50,
      },
    ]
  }
  const draftColumns: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => generateDynamicColumns(),
    [draftCatogary]
  );
  const columnss: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => generateDynamicColumns(),
    [todaysTask]
  );
  const ThisWeekcolumn: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => generateDynamicColumns(),
    [thisWeekTask]
  );
  const AssignedTask: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => generateDynamicColumns(),
    [allAssignedTask]
  );
  const Immcolumn: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => generateDynamicColumns(),
    [immediateTask]
  );
  const aprovlColumn: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => generateDynamicColumns(),
    [approvalTask]
  );
  const Bottlecolumn: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => generateDynamicColumns(),
    [bottleneckTask]
  );
  const editPopFunc = (item: any) => {
    setEditPopup(true);
    setResult(item)
  }
  function CallBack() {
    setEditPopup(false);
  }
  const callBackData = React.useCallback((elem: any, ShowingData: any) => {
    if (elem != undefined) {
      approveItem = elem;
    }
    else {
      approveItem = undefined
    }

  },
    []);
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
    const data: any = ContextData?.AlltaskData.ApprovalTask.filter((i: any) => { return i.Id != approveItem.Id })
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
                  </tr>`
                ;
            }
          } catch (error) {
            console.log(error)
          }
        })
        if (taskCount > 0) {
          body +=
            `<table cellpadding="0" cellspacing="0" align="left" width="100%" border="1" style=" border-color: #444;margin-bottom:10px">
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
      let sendAllTasks =
        `<span style="font-size: 18px;margin-bottom: 10px;">
            Hi there, <br><br>
            Below is the working today task of all the team members <strong>(Project Wise):</strong>
            <p><a href =${ContextData?.siteUrl}/SitePages/Project-Management-Overview.aspx>Click here for flat overview of the today's tasks</a></p>
            </span>
            ${body}
            <h3>
            Thanks.
            </h3>`
      // setPageLoader(false);
      SendEmailFinal(to, subject, sendAllTasks);
    }
  }
  const SendEmailFinal = async (to: any, subject: any, body: any) => {
    let sp = spfi().using(spSPFx(ContextData?.propsValue?.Context));
    sp.utility.sendEmail({
      //Body of Email  
      Body: body,
      //Subject of Email  
      Subject: subject,
      //Array of string for To of Email  
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

  return (
    <div>
      <div className="row m-0 mb-2 empMainSec">
        <div className="col-6 p-0">
          {Tile.activeTile == 'workingToday' && (
            <section>
              <div className="workingSec empAllSec clearfix">
                <div className="alignCenter mb-2 justify-content-between">
                  <span className="fw-bold">
                    Working Today {`(${todaysTask?.length})`}
                  </span>
                  <span className="alignCenter">
                    <a className="empCol hreflink me-2"
                      target="_blank" data-interception="off" title="Create New Task"
                      href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx">
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48" fill="none">
                        <path d="M27.9601 22.2H26.0401V26.0399H22.2002V27.9599H26.0401V31.8H27.9601V27.9599H31.8002V26.0399H27.9601V22.2Z" fill="#057BD0" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3996 9.60001H9.59961V32.4H15.5996V38.4H38.3996V15.6H15.5996V31.2968H10.7028V10.7032H31.2964V15.4839H32.3996V9.60001ZM16.7028 16.7032H37.2964V37.2968H16.7028V16.7032Z" fill="#057BD0" />
                        <path d="M9.59956 9.59999V9.29999H9.29956V9.59999H9.59956ZM32.3996 9.59999H32.6996V9.29999H32.3996V9.59999ZM9.59956 32.4H9.29956V32.7H9.59956V32.4ZM15.5996 32.4H15.8996V32.1H15.5996V32.4ZM15.5996 38.4H15.2996V38.7H15.5996V38.4ZM38.3996 38.4V38.7H38.6996V38.4H38.3996ZM38.3996 15.6H38.6996V15.3H38.3996V15.6ZM15.5996 15.6V15.3H15.2996V15.6H15.5996ZM15.5996 31.2968V31.5968H15.8996V31.2968H15.5996ZM10.7028 31.2968H10.4028V31.5968H10.7028V31.2968ZM10.7028 10.7032V10.4032H10.4028V10.7032H10.7028ZM31.2964 10.7032H31.5963V10.4032H31.2964V10.7032ZM31.2964 15.4839H30.9964V15.7839H31.2964V15.4839ZM32.3996 15.4839V15.7839H32.6996V15.4839H32.3996ZM37.2963 16.7032H37.5964V16.4032H37.2963V16.7032ZM16.7028 16.7032V16.4032H16.4028V16.7032H16.7028ZM37.2963 37.2968V37.5968H37.5964V37.2968H37.2963ZM16.7028 37.2968H16.4028V37.5968H16.7028V37.2968ZM9.59956 9.89999H32.3996V9.29999H9.59956V9.89999ZM9.89956 32.4V9.59999H9.29956V32.4H9.89956ZM15.5996 32.1H9.59956V32.7H15.5996V32.1ZM15.2996 32.4V38.4H15.8996V32.4H15.2996ZM15.5996 38.7H38.3996V38.1H15.5996V38.7ZM38.6996 38.4V15.6H38.0996V38.4H38.6996ZM38.3996 15.3H15.5996V15.9H38.3996V15.3ZM15.2996 15.6V31.2968H15.8996V15.6H15.2996ZM10.7028 31.5968H15.5996V30.9968H10.7028V31.5968ZM10.4028 10.7032V31.2968H11.0028V10.7032H10.4028ZM31.2964 10.4032H10.7028V11.0032H31.2964V10.4032ZM31.5963 15.4839V10.7032H30.9964V15.4839H31.5963ZM32.3996 15.1839H31.2964V15.7839H32.3996V15.1839ZM32.0996 9.59999V15.4839H32.6996V9.59999H32.0996ZM37.2963 16.4032H16.7028V17.0032H37.2963V16.4032ZM37.5964 37.2968V16.7032H36.9963V37.2968H37.5964ZM16.7028 37.5968H37.2963V36.9968H16.7028V37.5968ZM16.4028 16.7032V37.2968H17.0028V16.7032H16.4028Z" fill="#057BD0" />
                      </svg>
                    </a>
                    <span title="Share Ongoing Task" onClick={() => sendAllWorkingTodayTasks(todaysTask)} className="hreflink svg__iconbox svg__icon--share empBg"></span>
                  </span>
                </div>
                <div className="Alltable maXh-300" style={{ height: "300px" }}>
                  {todaysTask && (
                    <GlobalCommanTable
                      wrapperHeight="77%"
                      showHeader={true}
                      TaskUsers={AllTaskUser}
                      portfolioColor={portfolioColor}
                      columns={columnss}
                      data={todaysTask}
                      callBackData={callBackData} />
                  )}
                </div>
              </div>
            </section>
          )}
          {Tile.activeTile == 'workingThisWeek' && (
            <section>
              <div className="workingSec empAllSec clearfix">
                <div className="alignCenter mb-2 justify-content-between">
                  <span className="fw-bold">
                    Working This Week {`(${thisWeekTask?.length})`}
                  </span>
                  <span className="alignCenter">
                    <a className="empCol hreflink me-2"
                      target="_blank" data-interception="off" title="Create New Task"
                      href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx">
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48" fill="none">
                        <path d="M27.9601 22.2H26.0401V26.0399H22.2002V27.9599H26.0401V31.8H27.9601V27.9599H31.8002V26.0399H27.9601V22.2Z" fill="#057BD0" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3996 9.60001H9.59961V32.4H15.5996V38.4H38.3996V15.6H15.5996V31.2968H10.7028V10.7032H31.2964V15.4839H32.3996V9.60001ZM16.7028 16.7032H37.2964V37.2968H16.7028V16.7032Z" fill="#057BD0" />
                        <path d="M9.59956 9.59999V9.29999H9.29956V9.59999H9.59956ZM32.3996 9.59999H32.6996V9.29999H32.3996V9.59999ZM9.59956 32.4H9.29956V32.7H9.59956V32.4ZM15.5996 32.4H15.8996V32.1H15.5996V32.4ZM15.5996 38.4H15.2996V38.7H15.5996V38.4ZM38.3996 38.4V38.7H38.6996V38.4H38.3996ZM38.3996 15.6H38.6996V15.3H38.3996V15.6ZM15.5996 15.6V15.3H15.2996V15.6H15.5996ZM15.5996 31.2968V31.5968H15.8996V31.2968H15.5996ZM10.7028 31.2968H10.4028V31.5968H10.7028V31.2968ZM10.7028 10.7032V10.4032H10.4028V10.7032H10.7028ZM31.2964 10.7032H31.5963V10.4032H31.2964V10.7032ZM31.2964 15.4839H30.9964V15.7839H31.2964V15.4839ZM32.3996 15.4839V15.7839H32.6996V15.4839H32.3996ZM37.2963 16.7032H37.5964V16.4032H37.2963V16.7032ZM16.7028 16.7032V16.4032H16.4028V16.7032H16.7028ZM37.2963 37.2968V37.5968H37.5964V37.2968H37.2963ZM16.7028 37.2968H16.4028V37.5968H16.7028V37.2968ZM9.59956 9.89999H32.3996V9.29999H9.59956V9.89999ZM9.89956 32.4V9.59999H9.29956V32.4H9.89956ZM15.5996 32.1H9.59956V32.7H15.5996V32.1ZM15.2996 32.4V38.4H15.8996V32.4H15.2996ZM15.5996 38.7H38.3996V38.1H15.5996V38.7ZM38.6996 38.4V15.6H38.0996V38.4H38.6996ZM38.3996 15.3H15.5996V15.9H38.3996V15.3ZM15.2996 15.6V31.2968H15.8996V15.6H15.2996ZM10.7028 31.5968H15.5996V30.9968H10.7028V31.5968ZM10.4028 10.7032V31.2968H11.0028V10.7032H10.4028ZM31.2964 10.4032H10.7028V11.0032H31.2964V10.4032ZM31.5963 15.4839V10.7032H30.9964V15.4839H31.5963ZM32.3996 15.1839H31.2964V15.7839H32.3996V15.1839ZM32.0996 9.59999V15.4839H32.6996V9.59999H32.0996ZM37.2963 16.4032H16.7028V17.0032H37.2963V16.4032ZM37.5964 37.2968V16.7032H36.9963V37.2968H37.5964ZM16.7028 37.5968H37.2963V36.9968H16.7028V37.5968ZM16.4028 16.7032V37.2968H17.0028V16.7032H16.4028Z" fill="#057BD0" />
                      </svg>
                    </a>
                    <span title="Share Ongoing Task" onClick={() => sendAllWorkingTodayTasks(thisWeekTask)} className="hreflink svg__iconbox svg__icon--share empBg"></span>
                  </span>
                </div>
                <div className="Alltable maXh-300" style={{ height: "300px" }}>
                  {thisWeekTask && (
                    <GlobalCommanTable
                      wrapperHeight="77%"
                      showHeader={true}
                      TaskUsers={AllTaskUser}
                      portfolioColor={portfolioColor}
                      columns={ThisWeekcolumn}
                      data={thisWeekTask}
                      callBackData={callBackData} />
                  )}
                </div>
              </div>
            </section>
          )}
          {Tile.activeTile == 'assignedTask' && (
            <section>
              <div className="workingSec empAllSec clearfix">
                <div className="alignCenter mb-2 justify-content-between">
                  <span className="fw-bold">
                    Assigned Task {`(${allAssignedTask?.length})`}
                  </span>
                  <span className="alignCenter">
                    <a className="empCol hreflink me-2"
                      target="_blank" data-interception="off" title="Create New Task"
                      href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx">
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48" fill="none">
                        <path d="M27.9601 22.2H26.0401V26.0399H22.2002V27.9599H26.0401V31.8H27.9601V27.9599H31.8002V26.0399H27.9601V22.2Z" fill="#057BD0" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3996 9.60001H9.59961V32.4H15.5996V38.4H38.3996V15.6H15.5996V31.2968H10.7028V10.7032H31.2964V15.4839H32.3996V9.60001ZM16.7028 16.7032H37.2964V37.2968H16.7028V16.7032Z" fill="#057BD0" />
                        <path d="M9.59956 9.59999V9.29999H9.29956V9.59999H9.59956ZM32.3996 9.59999H32.6996V9.29999H32.3996V9.59999ZM9.59956 32.4H9.29956V32.7H9.59956V32.4ZM15.5996 32.4H15.8996V32.1H15.5996V32.4ZM15.5996 38.4H15.2996V38.7H15.5996V38.4ZM38.3996 38.4V38.7H38.6996V38.4H38.3996ZM38.3996 15.6H38.6996V15.3H38.3996V15.6ZM15.5996 15.6V15.3H15.2996V15.6H15.5996ZM15.5996 31.2968V31.5968H15.8996V31.2968H15.5996ZM10.7028 31.2968H10.4028V31.5968H10.7028V31.2968ZM10.7028 10.7032V10.4032H10.4028V10.7032H10.7028ZM31.2964 10.7032H31.5963V10.4032H31.2964V10.7032ZM31.2964 15.4839H30.9964V15.7839H31.2964V15.4839ZM32.3996 15.4839V15.7839H32.6996V15.4839H32.3996ZM37.2963 16.7032H37.5964V16.4032H37.2963V16.7032ZM16.7028 16.7032V16.4032H16.4028V16.7032H16.7028ZM37.2963 37.2968V37.5968H37.5964V37.2968H37.2963ZM16.7028 37.2968H16.4028V37.5968H16.7028V37.2968ZM9.59956 9.89999H32.3996V9.29999H9.59956V9.89999ZM9.89956 32.4V9.59999H9.29956V32.4H9.89956ZM15.5996 32.1H9.59956V32.7H15.5996V32.1ZM15.2996 32.4V38.4H15.8996V32.4H15.2996ZM15.5996 38.7H38.3996V38.1H15.5996V38.7ZM38.6996 38.4V15.6H38.0996V38.4H38.6996ZM38.3996 15.3H15.5996V15.9H38.3996V15.3ZM15.2996 15.6V31.2968H15.8996V15.6H15.2996ZM10.7028 31.5968H15.5996V30.9968H10.7028V31.5968ZM10.4028 10.7032V31.2968H11.0028V10.7032H10.4028ZM31.2964 10.4032H10.7028V11.0032H31.2964V10.4032ZM31.5963 15.4839V10.7032H30.9964V15.4839H31.5963ZM32.3996 15.1839H31.2964V15.7839H32.3996V15.1839ZM32.0996 9.59999V15.4839H32.6996V9.59999H32.0996ZM37.2963 16.4032H16.7028V17.0032H37.2963V16.4032ZM37.5964 37.2968V16.7032H36.9963V37.2968H37.5964ZM16.7028 37.5968H37.2963V36.9968H16.7028V37.5968ZM16.4028 16.7032V37.2968H17.0028V16.7032H16.4028Z" fill="#057BD0" />
                      </svg>
                    </a>
                    <span title="Share Ongoing Task" onClick={() => sendAllWorkingTodayTasks(allAssignedTask)} className="hreflink svg__iconbox svg__icon--share empBg"></span>
                  </span>
                </div>
                <div className="Alltable maXh-300" style={{height:"300px"}}>
                  {allAssignedTask?.length > 0 && (
                    <GlobalCommanTable
                      wrapperHeight="77%"
                      showHeader={true}
                      TaskUsers={AllTaskUser}
                      portfolioColor={portfolioColor}
                      columns={AssignedTask}
                      data={allAssignedTask}
                      callBackData={callBackData} />
                  )
                  }</div>
              </div>
            </section>
          )}
          {Tile.activeTile == 'draft' && (
            <section>
              <div className="chartSec empAllSec clearfix">
                <div className="alignCenter mb-2 justify-content-between">
                  <span className="fw-bold">
                    My Draft Tasks {`(${draftCatogary?.length})`}
                  </span>
                  <span className="alignCenter">
                    <a className="empCol hreflink me-3">Approve</a>
                    <span title="Share Draft Task" onClick={() => sendAllWorkingTodayTasks(draftCatogary)} className="svg__iconbox svg__icon--share empBg"></span>
                  </span>
                </div>
                <div className="Alltable maXh-300" style={{ height: "300px" }}>
                  {draftCatogary && (
                    <GlobalCommanTable
                      wrapperHeight="77%"
                      TaskUsers={AllTaskUser}
                      portfolioColor={portfolioColor}
                      showHeader={true}
                      columns={draftColumns}
                      data={draftCatogary}
                      callBackData={callBackData} />
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
        {/* className={Tile?.activeTile === 'TimeSheet' ? 'col-12 pe-0' : 'col-6 pe-0'} */}
        <div className="col-6 pe-0 ps-0'">
          {Tile?.activeTile && (
            <section>
              <div className="chartSec empAllSec clearfix">
                <div className="alignCenter mb-2 justify-content-between">
                  <span className="fw-bold">
                    Immediate Task {`(${immediateTask?.length})`}
                  </span>
                  <span className="alignCenter">
                    <a className="empCol hreflink me-2"
                      target="_blank" data-interception="off" title="Create New Task"
                      href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx">
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48" fill="none">
                        <path d="M27.9601 22.2H26.0401V26.0399H22.2002V27.9599H26.0401V31.8H27.9601V27.9599H31.8002V26.0399H27.9601V22.2Z" fill="#057BD0" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3996 9.60001H9.59961V32.4H15.5996V38.4H38.3996V15.6H15.5996V31.2968H10.7028V10.7032H31.2964V15.4839H32.3996V9.60001ZM16.7028 16.7032H37.2964V37.2968H16.7028V16.7032Z" fill="#057BD0" />
                        <path d="M9.59956 9.59999V9.29999H9.29956V9.59999H9.59956ZM32.3996 9.59999H32.6996V9.29999H32.3996V9.59999ZM9.59956 32.4H9.29956V32.7H9.59956V32.4ZM15.5996 32.4H15.8996V32.1H15.5996V32.4ZM15.5996 38.4H15.2996V38.7H15.5996V38.4ZM38.3996 38.4V38.7H38.6996V38.4H38.3996ZM38.3996 15.6H38.6996V15.3H38.3996V15.6ZM15.5996 15.6V15.3H15.2996V15.6H15.5996ZM15.5996 31.2968V31.5968H15.8996V31.2968H15.5996ZM10.7028 31.2968H10.4028V31.5968H10.7028V31.2968ZM10.7028 10.7032V10.4032H10.4028V10.7032H10.7028ZM31.2964 10.7032H31.5963V10.4032H31.2964V10.7032ZM31.2964 15.4839H30.9964V15.7839H31.2964V15.4839ZM32.3996 15.4839V15.7839H32.6996V15.4839H32.3996ZM37.2963 16.7032H37.5964V16.4032H37.2963V16.7032ZM16.7028 16.7032V16.4032H16.4028V16.7032H16.7028ZM37.2963 37.2968V37.5968H37.5964V37.2968H37.2963ZM16.7028 37.2968H16.4028V37.5968H16.7028V37.2968ZM9.59956 9.89999H32.3996V9.29999H9.59956V9.89999ZM9.89956 32.4V9.59999H9.29956V32.4H9.89956ZM15.5996 32.1H9.59956V32.7H15.5996V32.1ZM15.2996 32.4V38.4H15.8996V32.4H15.2996ZM15.5996 38.7H38.3996V38.1H15.5996V38.7ZM38.6996 38.4V15.6H38.0996V38.4H38.6996ZM38.3996 15.3H15.5996V15.9H38.3996V15.3ZM15.2996 15.6V31.2968H15.8996V15.6H15.2996ZM10.7028 31.5968H15.5996V30.9968H10.7028V31.5968ZM10.4028 10.7032V31.2968H11.0028V10.7032H10.4028ZM31.2964 10.4032H10.7028V11.0032H31.2964V10.4032ZM31.5963 15.4839V10.7032H30.9964V15.4839H31.5963ZM32.3996 15.1839H31.2964V15.7839H32.3996V15.1839ZM32.0996 9.59999V15.4839H32.6996V9.59999H32.0996ZM37.2963 16.4032H16.7028V17.0032H37.2963V16.4032ZM37.5964 37.2968V16.7032H36.9963V37.2968H37.5964ZM16.7028 37.5968H37.2963V36.9968H16.7028V37.5968ZM16.4028 16.7032V37.2968H17.0028V16.7032H16.4028Z" fill="#057BD0" />
                      </svg>
                    </a>
                    <span title="Share Ongoing Task" onClick={() => sendAllWorkingTodayTasks(immediateTask)} className="hreflink svg__iconbox svg__icon--share empBg"></span>
                  </span>
                </div>
                <div className="Alltable maXh-300" style={{ height: "300px" }}>
                  {immediateTask && (
                    <GlobalCommanTable
                      wrapperHeight="77%"
                      showHeader={true}
                      TaskUsers={AllTaskUser}
                      portfolioColor={portfolioColor}
                      columns={Immcolumn}
                      data={immediateTask}
                      callBackData={callBackData} />
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="row m-0 mb-3 empMainSec">
        <div className="col-6 p-0">
          {Tile?.activeTile && (
            <div className="chartSec empAllSec clearfix">
              <div className="alignCenter mb-2 justify-content-between">
                <span className="fw-bold">
                  Waiting for Approval {`(${approvalTask.length})`}
                </span>
                <span className="alignCenter">
                  <span className="empCol me-3 hreflink" onClick={sendEmail}>Approve</span>
                  <span title="Share Approver Task" onClick={() => sendAllWorkingTodayTasks(approvalTask)} className="svg__iconbox svg__icon--share empBg"></span>
                </span>
              </div>
              <div className="Alltable maXh-300" style={{ height: "300px" }}>
                {approvalTask && (
                  <GlobalCommanTable
                    wrapperHeight="77%"
                    showHeader={true}
                    columns={aprovlColumn}
                    TaskUsers={AllTaskUser}
                    portfolioColor={portfolioColor}
                    data={approvalTask}
                    callBackData={callBackData}
                  />
                )}
                {sendMail && emailStatus != "" && approveItem && <EmailComponent approvalcallback={approvalcallback} Context={ContextData.Context} emailStatus={"Approved"} items={approveItem} />}
              </div>
            </div>
          )}
        </div>
        <div className="col-6 pe-0">
          {Tile?.activeTile && (
            <section>
              <div className="workingSec empAllSec clearfix">
                <div className="alignCenter mb-2 justify-content-between">
                  <span className="fw-bold">
                    Bottleneck Task {`(${bottleneckTask?.length})`}
                  </span>
                  <span className="alignCenter">
                    <a
                      className="empCol hreflink me-2"
                      target="_blank" data-interception="off" title="Create New Task"
                      href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 48 48" fill="none">
                        <path d="M27.9601 22.2H26.0401V26.0399H22.2002V27.9599H26.0401V31.8H27.9601V27.9599H31.8002V26.0399H27.9601V22.2Z" fill="#057BD0" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3996 9.60001H9.59961V32.4H15.5996V38.4H38.3996V15.6H15.5996V31.2968H10.7028V10.7032H31.2964V15.4839H32.3996V9.60001ZM16.7028 16.7032H37.2964V37.2968H16.7028V16.7032Z" fill="#057BD0" />
                        <path d="M9.59956 9.59999V9.29999H9.29956V9.59999H9.59956ZM32.3996 9.59999H32.6996V9.29999H32.3996V9.59999ZM9.59956 32.4H9.29956V32.7H9.59956V32.4ZM15.5996 32.4H15.8996V32.1H15.5996V32.4ZM15.5996 38.4H15.2996V38.7H15.5996V38.4ZM38.3996 38.4V38.7H38.6996V38.4H38.3996ZM38.3996 15.6H38.6996V15.3H38.3996V15.6ZM15.5996 15.6V15.3H15.2996V15.6H15.5996ZM15.5996 31.2968V31.5968H15.8996V31.2968H15.5996ZM10.7028 31.2968H10.4028V31.5968H10.7028V31.2968ZM10.7028 10.7032V10.4032H10.4028V10.7032H10.7028ZM31.2964 10.7032H31.5963V10.4032H31.2964V10.7032ZM31.2964 15.4839H30.9964V15.7839H31.2964V15.4839ZM32.3996 15.4839V15.7839H32.6996V15.4839H32.3996ZM37.2963 16.7032H37.5964V16.4032H37.2963V16.7032ZM16.7028 16.7032V16.4032H16.4028V16.7032H16.7028ZM37.2963 37.2968V37.5968H37.5964V37.2968H37.2963ZM16.7028 37.2968H16.4028V37.5968H16.7028V37.2968ZM9.59956 9.89999H32.3996V9.29999H9.59956V9.89999ZM9.89956 32.4V9.59999H9.29956V32.4H9.89956ZM15.5996 32.1H9.59956V32.7H15.5996V32.1ZM15.2996 32.4V38.4H15.8996V32.4H15.2996ZM15.5996 38.7H38.3996V38.1H15.5996V38.7ZM38.6996 38.4V15.6H38.0996V38.4H38.6996ZM38.3996 15.3H15.5996V15.9H38.3996V15.3ZM15.2996 15.6V31.2968H15.8996V15.6H15.2996ZM10.7028 31.5968H15.5996V30.9968H10.7028V31.5968ZM10.4028 10.7032V31.2968H11.0028V10.7032H10.4028ZM31.2964 10.4032H10.7028V11.0032H31.2964V10.4032ZM31.5963 15.4839V10.7032H30.9964V15.4839H31.5963ZM32.3996 15.1839H31.2964V15.7839H32.3996V15.1839ZM32.0996 9.59999V15.4839H32.6996V9.59999H32.0996ZM37.2963 16.4032H16.7028V17.0032H37.2963V16.4032ZM37.5964 37.2968V16.7032H36.9963V37.2968H37.5964ZM16.7028 37.5968H37.2963V36.9968H16.7028V37.5968ZM16.4028 16.7032V37.2968H17.0028V16.7032H16.4028Z" fill="#057BD0" />
                      </svg>
                    </a>
                    <span title="Share Ongoing Task" onClick={() => sendAllWorkingTodayTasks(bottleneckTask)} className="hreflink svg__iconbox svg__icon--share empBg"></span>
                  </span>
                </div>
                <div className="Alltable maXh-300" style={{ height: "300px" }}>
                  {bottleneckTask && (
                    <GlobalCommanTable
                      wrapperHeight="77%"
                      showHeader={true}
                      TaskUsers={AllTaskUser}
                      portfolioColor={portfolioColor}
                      columns={Bottlecolumn}
                      data={bottleneckTask}
                      callBackData={callBackData} />
                  )}
                </div>
              </div>
            </section>
          )}
          {/* <div className="empAllSec linkSec clearfix">
            <div className="alignCenter mb-2 justify-content-between"><span className="fw-bold">Relevant Links</span></div>
            <div className="py-2 border-bottom">
              <a className="alignCenter">
                <span className="svg__iconbox svg__icon--link empBg"></span>
                <span className="ms-2 empCol hreflink">Appraisal Portal</span>
              </a>
            </div>
            <div className="py-2 border-bottom">
              <a className="alignCenter">
                <span className="svg__iconbox svg__icon--link empBg"></span>
                <span className="ms-2 empCol hreflink">Reimbursement Portal</span>
              </a>
            </div>
            <div className="py-2 border-bottom">
              <a className="alignCenter">
                <span className="svg__iconbox svg__icon--link empBg"></span>
                <span className="ms-2 empCol hreflink">Leave Calender</span>
              </a>
            </div>
            <div className="py-2">
              <a className="alignCenter">
                <span className="svg__iconbox svg__icon--link empBg"></span>
                <a className="ms-2 empCol hreflink" target="_blank" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TimeReport.aspx">Time Report</a>
              </a>
            </div>
          </div> */}
        </div>
      </div>
      <div className="row m-0 mb-3 empMainSec">
        {Tile?.activeTile && (
          <div className="col-6 p-0">
            <div className="empAllSec notesSec clearfix">
              <MyNotes />
            </div>
          </div>
        )}
        {Tile?.activeTile && (
          <div className="col-6 pe-0">
            <div className="empAllSec birthSec clearfix">
              <ComingBirthday />
            </div>
          </div>
        )}
      </div>
      <span>
        {editPopup && <EditTaskPopup Items={result} context={ContextData?.propsValue?.Context} AllListId={AllListId} Call={() => { CallBack() }} />}
      </span>
    </div>
  );
};
export default TaskStatusTbl;
