import * as React from 'react';
import { mycontext } from './TeamDashboard'
import GlobalCommanTable, { IndeterminateCheckbox } from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTeamMember';
import { Web } from 'sp-pnp-js';
let headerOptions: any = {
    openTab: true,
    teamsIcon: true
  }
const TaskDistribution = (props: any) => {
    var childId: any = [];
    // var TeamMember:any=[];
   
    let MyContext: any = React.useContext(mycontext)
    let AllTasks:any=MyContext?.AllTasks;
    // console.log(props?.AllTeamLeadersGroup)
    const [taskdistributionArray, setTaskdistributionArray] = React.useState(props?.TaskDistributionArray)
    const [taskdistributionTable, setTaskdistributionTable] = React.useState([])
    const [teamMember, setTeamMember] = React.useState([])

    React.useMemo(() => {
        var tableData: any = [];
        let TeamMember:any=[];
       let tasktableData:any=[];
        MyContext?.currentUserId.childs?.map((items: any) => {
            TeamMember.push(items)
            childId.push(items?.AssingedToUserId)
        })
        setTeamMember(TeamMember)
        let TaskDistributionArraybackup:any=AllTasks.filter((items:any)=>items?.ResponsibleTeamMember?.find((id:any)=>id== MyContext?.currentUserId?.AssingedToUserId))
        console.log(TaskDistributionArraybackup)
        taskdistributionArray?.map((data:any)=>{
             let isTaskdistribution:any= data.TaskDistribution.filter((item: any) => childId?.includes(item))
             if(isTaskdistribution.length==0){
              tasktableData.push(data) ;
             }
            })
           if(tasktableData!=undefined && tasktableData.length>0){
                tableData=tableData.concat(tasktableData);
            }
          
        console.log(taskdistributionArray)
        console.log(tableData)
        setTaskdistributionTable(tableData)
    },[taskdistributionArray])
   
// =================table code ===========
    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
          {
            // header: ({ table }: any) => (
            //   <>
            //     <IndeterminateCheckbox className=" "
            //       {...{
            //         checked: table.getIsAllRowsSelected(),
            //         indeterminate: table.getIsSomeRowsSelected(),
            //         onChange: table.getToggleAllRowsSelectedHandler(),
            //       }}
            //     />{" "}
            //   </>
            // ),
            cell: ({ row, getValue }) => (
              <>
                {/* <span className="d-flex">
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
                </span> */}
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
                <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={MyContext?.taskUsers} />
              </span>
            ),
            id: 'TeamMembers',
            resetColumnFilters: false,
            resetSorting: false,
            placeholder: "TeamMembers",
            header: "",
            size: 110
          },
         
    
          {
            accessorFn: (row) => row?.Created,
            cell: ({ row }) => (
              <span>
                {row?.original?.Services?.length >= 1 ? (
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
          
        ],
        [taskdistributionTable]
      );
       //============ grop function && data prepare or assign task to team member ==================
    const handleDrop=async(e:any,TeamMember:any)=>{
      console.log(TeamMember)
      e.preventDefault();
      const rowData = JSON.parse(e.dataTransfer.getData('text/plain'))
      console.log(rowData)
      // var datataskdistributionTable=taskdistributionTable;
      var data:any=taskdistributionTable.filter((item:any)=>item.Id!=rowData?.Id)
      setTaskdistributionTable(data);
     await UpdateTheTaskMember(rowData,TeamMember)
      .then((data:any)=>{
         console.log(data)
      }).catch((error)=>{
        console.log(error)
      })

      
    }
   const  UpdateTheTaskMember=(taskDetails:any,TeamMember:any)=>{
    let  teammember:any=[];
    let assignMember:any=[];

    return new Promise((resolve, reject) => {
      if(taskDetails?.TeamMembersId!=undefined && taskDetails?.TeamMembersId?.length>0){
        let teammember:any=taskDetails?.TeamMembersId
        teammember.push(TeamMember?.AssingedToUserId)
      }
      if(taskDetails.TeamMembersId?.length==0){
     
       teammember.push(TeamMember?.AssingedToUserId)
      }
      if(taskDetails?.AssignedTo?.length>0){
        assignMember=taskDetails?.AssignedToIds
        assignMember.push(TeamMember?.AssingedToUserId)
      }
      if(taskDetails?.AssignedTo?.length==0){
        assignMember.push(TeamMember?.AssingedToUserId)
      }
    
      let web = new Web(taskDetails.siteUrl);
        web.lists
        .getById(taskDetails?.listId)
        .items
        .getById(taskDetails.Id)
        .update( {Team_x0020_MembersId:{ "results": teammember },
        AssignedToId:{"results": assignMember}})
        .then((items:any)=>{
          console.log(items)
          resolve(items);

        }).catch((error:any)=>{
          console.log(error)
        reject(error);
        });

    })
    }
      //=======table callback==========================
      const callBackData = () => {
        console.log()
      }
    return (
        <>
           {taskdistributionTable.length>0&&<div className='card m-2 col-sm-12'>
                <div className='card-header'>
                    <div className='card-title siteColor'>
                        Tasks Distribution
                    </div>
                </div>
                <div className='row'>
            <section className='col-sm-10'>
          {taskdistributionTable?.length > 0 && 
                   <GlobalCommanTable AllListId={MyContext?.AllListId}
                    headerOptions={headerOptions} 
                    columns={column2} data={taskdistributionTable}
                     callBackData={callBackData} TaskUsers={MyContext.taskUsers}
                      showHeader={false} />
                           
          }
                        
                </section>
                <div className='col-sm-2 mt-5'>

                
                {teamMember.length>0&&    teamMember?.map((teammember:any)=>{
                   return(
                      <div id={`${teammember.Title}Div`} className='border text-xxl-center'style={{height: '60px'}} onDrop={(e: any) =>{handleDrop(e,teammember)}}
                      onDragOver={(e: any) => e.preventDefault()}>
                      {teammember.Title}
                </div>
                   )
                })}</div></div>

            </div>}


        </>
    )
}
export default TaskDistribution;