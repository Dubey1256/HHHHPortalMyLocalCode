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

import { mycontextValue } from './MeetingProfile';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import ReactPopperTooltip from '../../../globalComponents/Hierarchy-Popper-tooltip';
import HighlightableCell from '../../../globalComponents/GroupByReactTableComponents/highlight';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';

let globalFilterHighlited: any;
 const MettingTable=(props:any)=>{
    const contextdata: any = React.useContext(mycontextValue)
    const [data,setData]=React.useState<any>()
    const [IsTask, setIsTask] = React.useState(false);
    const [SharewebTask, setSharewebTask] = React.useState("");
    React.useMemo(()=>{

        setData(props?.data)
    },[props.data])

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


  const EditItemTaskPopup = (item: any) => {
    setIsTask(true);
    setSharewebTask(item);
};
const Call = (res: any) => {
    if(res == "Close"){
        setIsTask(false);
        }else{
       setIsTask(false);
   
}
    
}
const column2: any = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
        {
            accessorKey: "",
            placeholder: "",
            hasCheckbox: true,
            hasCustomExpanded: true,
            hasExpanded: true,
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
                    <ReactPopperTooltip ShareWebId={getValue()} row={row} />
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
                        <span ><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${contextdata?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.ProjectId}`} >
                            <ReactPopperTooltip ShareWebId={row?.original?.projectStructerId} projectToolShow={true} row={row} AllListId={props?.AllListId} /></a></span>
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
      const callBackData=()=>{
        console.log("test")
      }
    return(
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
                    Items={SharewebTask}
                    Call={Call}
                    AllListId={props?.AllListId}
                    context={contextdata?.Context}
                ></EditTaskPopup>
            )}
        </>
    )
 }
export default MettingTable;

