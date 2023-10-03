import React, { useEffect } from "react";
import { Web } from "sp-pnp-js";
import { myContextValue } from "../../../globalComponents/globalCommon";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import { ColumnDef } from "@tanstack/react-table";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import EmployeePieChart from "./EmployeePieChart";

import ComingBirthday from "./comingBirthday";
import MyNotes from "./MyNotes";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import 'bootstrap/dist/css/bootstrap.min.css';
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
// import GlobalCommanTable from '../../../globalComponents/GlobalCommanTable';

const TaskStatusTbl = () => {
  const ContextData: any = React.useContext(myContextValue);
  const draftCatogary: any = ContextData?.AlltaskData.DraftCatogary;
  const todaysTask: any = ContextData?.AlltaskData.TodaysTask;
  const bottleneckTask: any = ContextData?.AlltaskData.BottleneckTask;
  
  const immediateTask: any = ContextData?.AlltaskData.ImmediateTask;
  const thisWeekTask :any = ContextData?.AlltaskData.ThisWeekTask;
  const approvalTask :any = ContextData?.AlltaskData.ApprovalTask;

  const [editPopup, setEditPopup]: any = React.useState(false);
  const [result, setResult]: any = React.useState(false);

  let AllListId: any = {
    TaskUsertListID: ContextData?.propsValue?.TaskUsertListID,
    SmartMetadataListID: ContextData?.propsValue?.SmartMetadataListID,
    siteUrl: ContextData.siteUrl,
  };

// useEffect(()=>{

// },[ContextData?.AlltaskData?.length > 0])


  const draftColumns: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
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
              width={"25px"}
              height={"25px"}
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
        accessorFn: (row: any) => row?.TaskID,
        cell: ({ row, getValue }: any) => (
          <>
            <ReactPopperTooltip ShareWebId={getValue()} row={row} AllListId={ContextData?.propsValue?.Context} />
          </>
        ),
        id: "TaskID",
        placeholder: "ID",
        header: "",
        resetColumnFilters: false,
        size: 195
      },
      {

        accessorFn: (row: any) => row?.Title,
        cell: ({ row, getValue }: any) => (
          <div>
            <a className="hreflink"
            target='_blank'
              style={{ textDecoration: 'none', cursor: 'pointer'}}
              href={`${ContextData.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.site}`}
              rel='noopener noreferrer'
              data-interception="off"
            >
              {row?.original?.Title}
            </a>
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
        placeholder: "&",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "percentage"
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
     
    ],
    [draftCatogary]
  );

  const aprovlColumn: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
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
              width={"25px"}
              height={"25px"}
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
        accessorFn: (row: any) => row?.TaskID,
        cell: ({ row, getValue }: any) => (
          <>
            <ReactPopperTooltip ShareWebId={getValue()} row={row} AllListId={ContextData?.propsValue?.Context} />
          </>
        ),
        id: "TaskID",
        placeholder: "ID",
        header: "",
        resetColumnFilters: false,
        size: 195
      },
      {

        accessorFn: (row: any) => row?.Title,
        cell: ({ row, getValue }: any) => (
          <div>
            <a className="hreflink"
            target='_blank'
              style={{ textDecoration: 'none', cursor: 'pointer'}}
              href={`${ContextData.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row.original.Id}&Site=${row.original.site}`}
              rel='noopener noreferrer'
              data-interception="off"
            >
              {row?.original?.Title}
            </a>
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
        placeholder: "&",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "percentage"
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
    ],
    [approvalTask]
  );

  const columnss: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
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
              width={"25px"}
              height={"25px"}
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
        accessorFn: (row: any) => row?.TaskID,
        cell: ({ row, getValue }: any) => (
          <>
            <ReactPopperTooltip ShareWebId={getValue()} row={row} AllListId={ContextData?.propsValue?.Context} />
          </>
        ),
        id: "TaskID",
        placeholder: "ID",
        header: "",
        resetColumnFilters: false,
        size: 195
      },
      {

        accessorFn: (row: any) => row?.Title,
        cell: ({ row, getValue }: any) => (
          <div>
            <a className="hreflink"
            target='_blank'
              style={{ textDecoration: 'none', cursor: 'pointer'}}
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
        placeholder: "&",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "percentage"
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
    ],
    [todaysTask]
  );

  const editPopFunc = (item: any) => {
    setEditPopup(true);
    setResult(item)
  }


  function CallBack() {
    setEditPopup(false);
  }


  const callBackData = React.useCallback((elem: any, ShowingData: any) => {},
  []);



  const sendAllWorkingTodayTasks = async (sharingTasks:any) => {
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
                        // setPageLoader(false);
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
      // setPageLoader(false);

  }).catch((err) => {
      // setPageLoader(false);
      console.log(err.message);
  });



}

  return (
    <div>
      <div className="row m-0 mt-3">
        <div className="bg-white col-7 ps-0 pt-3">
          <div className="d-flex mb-2 justify-content-between">
            <span className="fw-bold">
              Working on Today {`(${todaysTask.length})`}
            </span>
            <a className="text-primary" onClick={()=>sendAllWorkingTodayTasks(todaysTask)}>Share Ongoing Task</a>
          </div>
          <div className="d-flex mb-2 justify-content-between">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-filter"
                viewBox="0 0 16 16"
              >
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
              </svg>
              <span className="ms-1">Filter</span>
            </span>
            <a
              className="text-primary"
              target="_blank"
              href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx"
            >
              Create New Task
            </a>
          </div>
          {todaysTask && (
            <GlobalCommanTable
              showHeader={true}
              columns={columnss}
              data={todaysTask}
              callBackData={callBackData}
            />
          )}
        </div>
        <div className="bg-white col-5 pe-0 pt-2">
          <EmployeePieChart />
        </div>
      </div>
      <div className="row m-0 mt-2">
        <div className="bg-white col-7 ps-0 pt-3">
          <div className="d-flex mb-2 justify-content-between">
            <span className="fw-bold">
              My Draft Tasks {`(${draftCatogary.length})`}
            </span>
            <a className="text-primary" onClick={()=>sendAllWorkingTodayTasks(draftCatogary)} >Share Draft Task</a>
          </div>
          <div className="d-flex mb-2 justify-content-between">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-filter"
                viewBox="0 0 16 16"
              >
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
              </svg>
              <span className="ms-1">Filter</span>
            </span>
            <span>Approve</span>
          </div>
          {draftCatogary && (
            <GlobalCommanTable
              showHeader={true}
              columns={draftColumns}
              data={draftCatogary}
              callBackData={callBackData}
            />
          )}
        </div>
        <div className="bg-white col-5 pe-0 pt-2">
          <ul className="list-group">
            <li className="list-group-item">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-link"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                  <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                </svg>
                <a data-interception="off" target="_blank" href="https://smalsusinfolabs.sharepoint.com/sites/HHHH/HR/SitePages/Appraisal-Portal.aspx" className="ms-5">Appraisal Portal</a>
              </a>
            </li>
            <li className="list-group-item">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-link"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                  <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                </svg>
                <a data-interception="off" target="_blank" href="" className="ms-5">Reimbursement Portal</a>
              </a>
            </li>

            <li className="list-group-item">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-link"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                  <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                </svg>
                <a target="_blank" data-interception="off"  href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx" className="ms-5">Leave Calender</a>
              </a>
            </li>
            <li className="list-group-item">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-link"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
                  <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
                </svg>
                <a data-interception="off" target="_blank" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TimeReport.aspx" className="ms-5">Time Report</a>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="row m-0 mt-3">
        <div className="bg-white col-7 ps-0 pt-3">
          <div className="d-flex mb-2 justify-content-between">
            <span className="fw-bold">
              Waitnig for Approval {`(${draftCatogary.length})`}
            </span>
            <a className="text-primary" onClick={()=>sendAllWorkingTodayTasks(approvalTask)}>Share Approver Task</a>
          </div>
          <div className="d-flex mb-2 justify-content-between">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-filter"
                viewBox="0 0 16 16"
              >
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
              </svg>
              <span className="ms-1">Filter</span>
            </span>
            <span>Approve</span>
          </div>
          {approvalTask && (
            <GlobalCommanTable
              showHeader={true}
              columns={aprovlColumn}
              data={approvalTask}
              callBackData={callBackData}
            />
          )}
        </div>
        <div className="bg-white col-5 pe-0 pt-2">
          <ComingBirthday />
        </div>
      </div>
      <div className="row"><MyNotes/></div>
      <span>   
        {editPopup && <EditTaskPopup Items={result} context={ContextData?.propsValue?.Context} AllListId={AllListId} Call={() => { CallBack() }} />}

      </span>
    </div>
  );
};

export default TaskStatusTbl;
