import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import InlineEditingcolumns from '../../webparts/projectmanagementOverviewTool/components/inlineEditingcolumns';
import ReactPopperTooltipSingleLevel from '../Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import GlobalCommanTable, { IndeterminateCheckbox } from '../GroupByReactTableComponents/GlobalCommanTable';
import InfoIconsToolTip from '../InfoIconsToolTip/InfoIconsToolTip';
import ShowTaskTeamMembers from '../ShowTaskTeamMembers';
import { ColumnDef } from '@tanstack/react-table';
import EditTaskPopup from '../EditTaskPopup/EditTaskPopup'
import { mycontext } from '../../webparts/teamleaderDashboard/components/TeamDashboard'
let headerOptions: any = {
  openTab: true,
  teamsIcon: true
}
var data: any = [];
const TaskDetailsPanel = (props: any) => {
  const contextdata: any = React.useContext(mycontext)
  const [selectedEditData, setselectedEditData] = React.useState()
  const [openEditPopup, setopenEditPopup] = React.useState(false)
  // const[data,setData]=React.useState()
  data = props.particularTaskdetailModal.selectedTaskDetails
  console.log(props.particularTaskdetailModal)
  const onRenderCustomHeadersmartinfo = () => {
    return (
      <>

        <div className='ps-4' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
          {props?.particularTaskdetailModal?.selectcategory}Tasks Details
        </div>

      </>
    );
  };
  const handleClose = () => {
    props.setIsOpenPopup(false)
  }
  const editTaskPopup = (editItems: any) => {
    console.log(editItems);
    setselectedEditData(editItems)
    setopenEditPopup(true)
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
        accessorKey: "Shareweb_x0020_ID",
        placeholder: "Task Id",
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 70,
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">
              {row?.original?.Shareweb_x0020_ID}
              {/* <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.Shareweb_x0020_ID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} /> */}
            </span>
          </>
        ),
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
            <span >
              {row.original.Services.length >= 1 ? (
                <a
                  className="hreflink text-success"
                  href={`${props?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                  data-interception="off"
                  target="_blank"
                >
                  {row?.original?.Title}
                </a>
              ) : (
                <a
                  className="hreflink"
                  href={`${props?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                  data-interception="off"
                  target="_blank"
                >
                  {row?.original?.Title}
                </a>
              )}
              {row?.original?.Body !== null && row?.original?.Body != undefined ? <InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} /> : ''}
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
        accessorFn: (row) => row?.siteIcon,
        cell: ({ row }) => (
          <span>
            <img className='circularImage rounded-circle' src={row?.original?.siteIcon} />
          </span>
        ),
        id: "siteIcon",
        placeholder: "Site",
        header: "",
        resetSorting: false,
        resetColumnFilters: false,
        size: 50
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
                href={`${props?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
              >
                {row?.original?.portfolio?.Title}
              </a>
            ) : (
              <a
                className="hreflink"
                data-interception="off"
                target="blank"
                href={`${props?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${row?.original?.portfolio?.Id}`}
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

            {/* <InlineEditingcolumns
                  AllListId={AllListId}
                  type='Task'
                  callBack={inlineCallBack}
                  columnName='Priority'
                  item={row?.original}
                  TaskUsers={AllUser}
                  pageName={'ProjectManagment'}
                /> */}
            {row?.original?.Priority_x0020_Rank}
          </span>
        ),
        placeholder: "Priority",
        id: 'Priority',
        header: "",
        resetColumnFilters: false,
        resetSorting: false,
        size: 75
      },
      {
        accessorKey: "DisplayDueDate",
        id: 'DueDate',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Due Date",
        header: "",
        size: 80
      },
      //   {
      //     accessorKey: "descriptionsSearch",
      //     placeholder: "descriptionsSearch",
      //     header: "",
      //     resetColumnFilters: false,
      //     size: 100,
      //     id: "descriptionsSearch",
      // },
      // {
      //     accessorKey: "commentsSearch",
      //     placeholder: "commentsSearch",
      //     header: "",
      //     resetColumnFilters: false,
      //     size: 100,
      //     id: "commentsSearch",
      // },
      {
        accessorFn: (row) => row?.PercentComplete,
        cell: ({ row }) => (
          <span>
            {/* <InlineEditingcolumns
                  AllListId={AllListId}
                  callBack={inlineCallBack}
                  columnName='PercentComplete'
                  item={row?.original}
                  TaskUsers={AllUser}
                  pageName={'ProjectManagment'}
                /> */}
            {row?.original?.PercentComplete}
          </span>
        ),
        id: 'PercentComplete',
        placeholder: "% Complete",
        resetColumnFilters: false,
        resetSorting: false,
        header: "",
        size: 55
      },
      {
        accessorFn: (row) => row?.TeamMembers?.map((elem: any) => elem.Title).join('-'),
        cell: ({ row }) => (
          <span>
            {/* <InlineEditingcolumns
                  AllListId={AllListId}
                  callBack={inlineCallBack}
                  columnName='Team'
                  item={row?.original}
                  TaskUsers={AllUser}
                  pageName={'ProjectManagment'}
                /> */}
            <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={contextdata?.taskUsers} />
          </span>
        ),
        id: 'TeamMembers',
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "TeamMembers",
        header: "",
        size: 110
      },
      //   {
      //     accessorFn: (row) => row?.SmartInformation[0]?.Title,
      //     cell: ({ row }) => (
      //       <span style={{ display: "flex", width: "100%", height: "100%" }} className='d-flex'
      //     //    onClick={() => openRemark(row?.original)}
      //        >
      //         &nbsp; {row?.original?.SmartInformation[0]?.Title}
      //       </span>
      //     ),
      //     id: 'SmartInformation',
      //     resetSorting: false,
      //     resetColumnFilters: false,
      //     placeholder: "Remarks",
      //     header: '',
      //     size: 125
      //   },

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
                  href={`${props.AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                  target="_blank"
                  data-interception="off"
                >
                  <img title={row?.original?.Author?.Title} className="workmember ms-1" src={row?.original?.createdImg} />
                </a>
              </>
            ) : (
              <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
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
        cell: ({ row }) => (
          <span className='d-flex'>
            <span
              title='Edit Task'
              //   onClick={() => EditPopup(row?.original)}
              className='svg__iconbox svg__icon--edit hreflink'
              onClick={() => editTaskPopup(row.original)}></span>
            {/* <span
                  style={{ marginLeft: '6px' }}
                  title='Remove Task'
                //   onClick={() => untagTask(row?.original)}
                  className='svg__iconbox svg__icon--cross dark hreflink'
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
    [data]
  );
  const callBackData = () => {
    console.log()
  }
  const callbackEditpopup = React.useCallback(() => {
    setopenEditPopup(false)
  }, [])
  return (
    <>
      <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
        isOpen={props?.OpenPopup}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClose}
        isBlocking={false}
      >
        <div>
          <GlobalCommanTable AllListId={contextdata?.AllListId} headerOptions={headerOptions} columns={column2} data={data} callBackData={callBackData} TaskUsers={contextdata?.taskUsers} showHeader={true} />
        </div>
        {openEditPopup && <EditTaskPopup Items={selectedEditData} context={contextdata?.context} AllListId={contextdata?.AllListId} Call={callbackEditpopup} />}
      </Panel>

    </>

  )

}
export default TaskDetailsPanel;