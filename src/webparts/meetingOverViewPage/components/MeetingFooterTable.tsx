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


import { mycontextValue } from './MeetingProfile';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';


 const MettingTable=(props:any)=>{
    const contextdata: any = React.useContext(mycontextValue)
    const [data,setData]=React.useState<any>()
    React.useMemo(()=>{
        setData(props.data)
    },[props.data])
    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
      () => [
          {
              accessorKey: "",
              placeholder: "",
              hasCheckbox: true,
              // hasCustomExpanded: true,
              // hasExpanded: true,
              size: 30,
              id: 'Id',
          },
          {
              accessorKey: "TaskID",
              placeholder: "Task Id",
              header: "",
              resetColumnFilters: false,
              resetSorting: false,
              size: 130,
              cell: ({ row, getValue }) => (
                  <>
                      <span className="d-flex">
                          {row?.original?.TaskID}
                      </span>
                  </>
              ),
          },
          {
              accessorFn: (row) => row?.Title,
              cell: ({ row, column, getValue }) => (
                  <>
                      <span className='d-flex'>
                          {row?.original?.Services?.length >= 1 ? (
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
              accessorFn: (row) => row?.Site,
              cell: ({ row }) => (
                  <span>
                      <img className='circularImage rounded-circle' src={row?.original?.SiteIcon} />
                  </span>
              ),
              id: "Site",
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
                      {row?.original?.Services?.length >= 1 ? (
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
              accessorFn: (row) => row?.PriorityRank,
              cell: ({ row }) => (
                  <span>
                      {row?.original?.PriorityRank}
                  </span>
              ),
              placeholder: "Priority",
              id: 'Priority',
              header: "",
              resetColumnFilters: false,
              resetSorting: false,
              size: 75
          }
         
      
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
        </>
    )
 }
export default MettingTable;