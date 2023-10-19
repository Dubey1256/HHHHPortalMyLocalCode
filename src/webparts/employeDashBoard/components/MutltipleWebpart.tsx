import React, { useEffect } from "react";
import { myContextValue } from "../../../globalComponents/globalCommon";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import { ColumnDef } from "@tanstack/react-table";
import ComingBirthday from "./comingBirthday";
import MyNotes from "./MyNotes";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
// import GlobalCommanTable from '../../../globalComponents/GlobalCommanTable';

const MultipleWebpart = (Tile: any) => {
  const ContextData: any = React.useContext(myContextValue);
  const draftCatogary: any = ContextData?.AlltaskData.DraftCatogary;
  const todaysTask: any = ContextData?.AlltaskData.TodaysTask;
  const bottleneckTask: any = ContextData?.AlltaskData.BottleneckTask;
  const immediateTask: any = ContextData?.AlltaskData.ImmediateTask;
  const thisWeekTask: any = ContextData?.AlltaskData.ThisWeekTask;
  const approvalTask: any = ContextData?.AlltaskData.ApprovalTask;
  const [editPopup, setEditPopup]: any = React.useState(false);
  const [result, setResult]: any = React.useState(false);

  let AllListId: any = {
    TaskUsertListID: ContextData?.propsValue?.TaskUsertListID,
    SmartMetadataListID: ContextData?.propsValue?.SmartMetadataListID,
    MasterTaskListID: ContextData?.propsValue?.MasterTaskListID,
    siteUrl: ContextData?.siteUrl,
    TaskTimeSheetListID: ContextData?.propsValue?.TaskTimeSheetListID,
    isShowTimeEntry: true,
    isShowSiteCompostion: true
  };
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
              style={{ textDecoration: 'none', cursor: 'pointer' }}
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
  const editPopFunc = (item: any) => {
    setEditPopup(true);
    setResult(item)
  }
  function CallBack() {
    setEditPopup(false);
  }


  const callBackData = React.useCallback((elem: any, ShowingData: any) => { },
    []);
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
      <div className="row m-0 mb-3 empMainSec">
      <div className="col-7 p-0">
          <div className="empAllSec approvalSec clearfix">
            <div className="d-flex mb-2 justify-content-between">
              <span className="fw-bold">
                Waiting for Approval {`(${draftCatogary.length})`}
              </span>
              <a className="empCol" onClick={() => sendAllWorkingTodayTasks(approvalTask)}>Share Approver Task</a>
            </div>
            <div className="d-flex mb-2 justify-content-between">             
              <span>Approve</span>
            </div>
            <div className="Alltable maXh-300 scrollbar">
              {approvalTask && (
                <GlobalCommanTable
                  showHeader={true}
                  columns={aprovlColumn}
                  data={approvalTask}
                  callBackData={callBackData}
                />
              )}
            </div>
          </div>
        </div>
        <div className="col-5 pe-0">
          <div className="empAllSec linkSec clearfix">
            <div className="alignCenter mb-2 justify-content-between"><span className="fw-bold">Relevant Links</span></div>
            <div className="py-2 border-bottom">
              <a className="alignCenter">
                <span className="svg__iconbox svg__icon--link empBg"></span>
                <span className="ms-2 empCol hreflink ">Appraisal Portal</span>
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
                <span className="ms-2 empCol hreflink">Time Report</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="row m-0 mb-3 empMainSec">
      <div className="col-7 p-0">
          <div className="empAllSec notesSec clearfix">
            <MyNotes />
          </div>
        </div>
        <div className="col-5 pe-0">
          <div className="empAllSec birthSec clearfix">
            <ComingBirthday />
          </div>
        </div>
      </div>  
      <span>
        {editPopup && <EditTaskPopup Items={result} context={ContextData?.propsValue?.Context} AllListId={AllListId} Call={() => { CallBack() }} />}
      </span>
    </div>
  );
};
export default MultipleWebpart