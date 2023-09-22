import React, { useEffect } from "react";
import { Web } from "sp-pnp-js";
import { myContextValue } from "../../../globalComponents/globalCommon";
import ReactPopperTooltip from "../../../globalComponents/Hierarchy-Popper-tooltip";
import { ColumnDef } from "@tanstack/react-table";
import GlobalCommanTable from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import EmployeePieChart from "./EmployeePieChart";

import ComingBirthday from "./comingBirthday";
import MyNotes from "./MyNotes";
// import GlobalCommanTable from '../../../globalComponents/GlobalCommanTable';

const TaskStatusTbl = () => {
  const ContextData: any = React.useContext(myContextValue);
  const [draftCatogary, setDraftCatogary]: any = [
    ContextData?.AlltaskData.DraftCatogary
  ];
  const [todaysTask, setTodaysTask]: any = [
    ContextData?.AlltaskData.TodaysTask
  ];
  const [bottleneckTask, setBottleneckTask]: any = [
    ContextData?.AlltaskData.BottleneckTask
  ];
  const [immediateTask, setImmediateTask]: any = [
    ContextData?.AlltaskData.ImmediateTask
  ];
  const [thisWeekTask, setThisWeekTask]: any = [
    ContextData?.AlltaskData.ThisWeekTask
  ];
  const [approvalTask, setApprovalTask]: any = [
    ContextData?.AlltaskData.ApprovalTask
  ];
  const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: true,
        hasExpanded: true,
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
            <ReactPopperTooltip ShareWebId={getValue()} row={row} />
          </>
        ),
        id: "TaskID",
        placeholder: "ID",
        header: "",
        resetColumnFilters: false,
        size: 195
      },
      {
        accessorFn: (row) => row?.Title,
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        header: "",
        size: 480
      },
      {
        accessorKey: "Priority_x0020_Rank",
        placeholder: "Priority",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "Priority_x0020_Rank"
      },
      {
        accessorKey: "PercentComplete",
        placeholder: "&",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "PercentComplete"
      }
    ],
    [draftCatogary]
  );

  const columnss: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCheckbox: true,
        hasCustomExpanded: true,
        hasExpanded: true,
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
            <ReactPopperTooltip ShareWebId={getValue()} row={row} />
          </>
        ),
        id: "TaskID",
        placeholder: "ID",
        header: "",
        resetColumnFilters: false,
        size: 195
      },
      {
        accessorFn: (row) => row?.Title,
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        header: "",
        size: 480
      },
      {
        accessorKey: "Priority_x0020_Rank",
        placeholder: "Priority",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "Priority_x0020_Rank"
      },
      {
        accessorKey: "PercentComplete",
        placeholder: "&",
        header: "",
        resetColumnFilters: false,
        size: 42,
        id: "PercentComplete"
      }
    ],
    [todaysTask]
  );

  const callBackData = React.useCallback((elem: any, ShowingData: any) => {},
  []);

  return (
    <div>
      <div className="row m-0 mt-3">
        <div className="bg-white col-7 ps-0 pt-3">
          <div className="d-flex mb-2 justify-content-between">
            <span className="fw-bold">
              Working on Today {`(${todaysTask.length})`}
            </span>
            <a className="text-primary">Share Ongoing Task</a>
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
              columns={columns}
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
            <a className="text-primary">Share Draft Task</a>
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
              columns={columns}
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
                <span className="ms-5">Appraisal Portal</span>
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
                <span className="ms-5">Reimbursement Portal</span>
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
                <span className="ms-5">Leave Calender</span>
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
                <span className="ms-5">Time Report</span>
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
            <a className="text-primary">Share Approver Task</a>
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
              columns={columns}
              data={approvalTask}
              callBackData={callBackData}
            />
          )}
        </div>
        <div className="bg-white col-5 pe-0 pt-2">
          <ComingBirthday />
        </div>
      </div>
      <div className="row">{/* <MyNotes/> */}</div>
    </div>
  );
};

export default TaskStatusTbl;
