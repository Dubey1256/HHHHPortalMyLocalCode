import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from "react";
import { Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { ColumnDef } from "@tanstack/react-table";
import moment from 'moment';
let portfolioLead: any;
let leaveInformations:any=[];
let AllTimeEntry:any=[];
const PortfolioLeadEOD = (props: any) => {
    const [data, setData]: any = useState([])
        useEffect(() => {
            loadAllTimeEntry();
         
    
    }, [])
    const getMasterTaskList = () => {
        var web = new Web(props?.AllListId?.siteUrl);
        try {
            web.lists.getById(props?.AllListId?.MasterTaskListID).items.select("Id,Title,Item_x0020_Type,PortfolioStructureID,ResponsibleTeam/Id,ResponsibleTeam/Title,TeamMembers/Id, TeamMembers/Title").expand('ResponsibleTeam,TeamMembers').filter("Item_x0020_Type ne 'Project' and Item_x0020_Type ne 'Sprint'").getAll().then((masterValue: any) => {
                console.log(masterValue)
                portfolioLead.map((leads: any) => {
                    leads.totalTeamTime=(1+(leads?.AllTeamMembers?.length-leads?.teamMembersOnLeave?.length) )*8
                    let LeadportfolioData = masterValue?.filter((item: any) => item?.ResponsibleTeam?.some((leadInfo: any) => leadInfo?.Id == leads?.AssingedToUserId))
                    leads.portfolioTitle=LeadportfolioData?.map((tool: { Title: any; }) => tool.Title).join(', ')
                    
                    leads.timeFill=0;
                    AllTimeEntry.map((timeEntry:any)=>{
                        if(timeEntry?.AuthorId==leads?.AssingedToUserId || leads?.AllTeamMembers?.some((childs:any)=>childs?.AssingedToUserId==timeEntry?.AuthorId) ){
                           leads.timeFill=leads?.timeFill + Number(timeEntry?.TaskTime)   
                        }   
                    })
                    leads.shortageTime = leads?.totalTeamTime-leads?.timeFill;
                   
                    console.log(LeadportfolioData)
                })
                


                setData(portfolioLead)
            });
        } catch (error) {
            console.error(error)
        }
    }
    const getAllLeads = (allUsers: any[]) => {
        const uniqueLeads = new Set<string>();
        const leads: any = [];
        allUsers?.forEach((user: any) => {
            if (user.UserGroup?.Title == "Portfolio Lead Team") {
                uniqueLeads.add(user?.AssingedToUserId);
            }
            if(user.UserGroup?.Title == "Design Team" || user.UserGroup?.Title == "QA Team"){
                user?.Approver?.forEach((approver: any) => {
                    uniqueLeads.add(approver?.Id);
              });
            }
        });
        allUsers?.forEach((user: any) => {
            if (uniqueLeads.has(user?.AssingedToUserId)) {
                leads.push(user);
            }
        });
        leads.map((Leads: any) => {
            Leads.AllTeamMembers = []
            Leads.teamMembersOnLeave=[];
            allUsers.map((user: any) => {
                user?.Approver?.forEach((approver: any) => {
                    if (Leads.AssingedToUserId == approver.Id) {
                        Leads.AllTeamMembers.push(user)
                    }
                });
            })
            let test=leaveInformations?.find((leave:any)=>{
                
               if(leave?.Employee?.Id == Leads?.AssingedToUserId) {
                return Leads
               }
            
            })
            Leads.teamMembersOnLeave =  Leads.AllTeamMembers?.filter((leadMember: any) =>leaveInformations?.some((leaveMember: any) => leaveMember?.Employee?.Id == leadMember?.AssingedToUserId))
            if(test!=undefined){
                Leads.teamMembersOnLeave.push(test)
            }
           
        })
        portfolioLead = leads
        getMasterTaskList()

    };

    const toIST = (dateString: any, isEndDate: boolean, isFirstHalf: boolean, isSecondHalf: boolean) => {
        const date = new Date(dateString);
        if ((isFirstHalf !== undefined && isSecondHalf != undefined) && (isEndDate || isFirstHalf || isSecondHalf)) {
            date.setHours(date.getHours() - 5);
            date.setMinutes(date.getMinutes() - 30);
        }
        const formattedDate = date.toISOString().substring(0, 19).replace('T', ' ');
        return formattedDate;
    };
    

    const loadTodaysLeave = async () => {
       let AllLeaves:any;
       const startDate = new Date();
       startDate.setHours(0, 0, 0, 0);  
       const web = new Web(props?.AllListId?.siteUrl);
       const results = await web.lists
           .getById("72ABA576-5272-4E30-B332-25D7E594AAA4")
           .items.select(
               "RecurrenceData,Duration,Author/Title,Editor/Title,Name,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,HalfDay,HalfDayTwo"
           )
           .expand("Author,Editor,Employee")
          .top(5000)
           .getAll();
           results?.map((emp: any) => {
                        emp.leaveStart = toIST(emp?.EventDate, false, emp?.HalfDay, emp?.HalfDayTwo)
                        emp.leaveStart = new Date(emp?.leaveStart).setHours(0, 0, 0, 0)
                        emp.leaveEnd = toIST(emp?.EndDate, true, emp?.HalfDay, emp?.HalfDayTwo);
                        emp.leaveEnd = new Date(emp?.leaveEnd).setHours(0, 0, 0, 0)
                        if ((startDate >= emp?.leaveStart && startDate <= emp?.leaveEnd) && (emp?.HalfDay !== null && emp?.HalfDayTwo !== null) && (emp?.HalfDay != true && emp?.HalfDayTwo != true)) {
                            leaveInformations?.push(emp);
                        }
                    })
        
        //    leaveInformations=results
           getAllLeads(props?.AllUsers)
        console.log(AllLeaves);
        }
        const loadAllTimeEntry = async () => {
            let  TodayTimeEntry:any=[];
            AllTimeEntry=[];
         if (props?.timesheetListConfig?.length > 0) {
                let timesheetLists: any = []; 
                const previousDate = new Date();
                previousDate.setUTCHours(0, 0, 0, 0);
            const isoPreviousDate = previousDate.toISOString();
                timesheetLists = JSON.parse(props?.timesheetListConfig[0]?.Configurations)
    
                if (timesheetLists?.length > 0) {
                    const fetchPromises = timesheetLists.map(async (list: any,index:any) => {
                        let web = new Web(list?.siteUrl);
                        try {
                            let todayDateToCheck = new Date().setHours(0, 0, 0, 0,)
                             await web.lists
                                .getById(list?.listId)
                                .items.select(list?.query)
                            .filter(`Modified ge datetime'${isoPreviousDate}'`)
                         .getAll().then((data:any)=>{   
                            data?.map((timeEntry:any)=>{
                                let TimeEntryParse:any=[]
                                if(timeEntry?. AdditionalTimeEntry!=undefined && timeEntry?. AdditionalTimeEntry!=null){
                                    TimeEntryParse  = JSON.parse(timeEntry?. AdditionalTimeEntry)
                                }
                            if(TimeEntryParse?.length>0){
                                TodayTimeEntry.push(...TimeEntryParse)
                                // TodayTimeEntry=TimeEntryParse
                            }
                             
                            })
                            let chekDate=moment(new Date()).format('DD/MM/YYYY');
                             let timeValue:any=TodayTimeEntry.filter((item:any)=>item?.TaskDate===chekDate);                  
                            // AllTimeEntry=TodayTimeEntry.filter((item:any)=>item?.TaskDate===chekDate);
                            AllTimeEntry.push(...timeValue)
                            if(timesheetLists?.length-1==index){
                                loadTodaysLeave()
                            }
                            
                            console.log(data,"time entrt data ")
                              }).catch((error:any)=>{
                                loadTodaysLeave()
                                    console.log(error)
                                });
    
                          
                        } catch (error) {
                            // setPageLoader(false)
                            loadTodaysLeave()
                            console.log(error, 'HHHH Time');
                        }
                    });
         
                }
            }
        }

    const callBackData = React.useCallback((checkData: any) => {
        console.log(checkData, "checkData");

    }, []);

   useEffect(()=>{
     let body1:any=[];
     if(data?.length>0){
        data?.forEach((item:any, index: any) => {
            let taskRow = ` 
                    <tr>
                    <td height="48"  width="240" valign="middle" style="background: #fff;color: #2F5596;width:220px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px; text-align: left; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                        <a style="color: #2F5596;" href=${props?.AllListId?.siteUrl}/SitePages/Dashboard.aspx?DashBoardId=5">
                            ${item?.Title ?? ''}
                        </a>
                    </td>
                    <td height="48"  width="400" align="left" valign="middle" style="background: #fff;color: #333;width:350px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;text-align: left; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                        ${item?.portfolioTitle.slice(0, 22) + '...' ?? 'No data available'}
                    </td>
                    <td height="48"  width="400" align="left" valign="middle" style="background: #fff;color: #333;width:350px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;text-align: left; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                        ${item?.AllTeamMembers?.length ?? 'No data available'}
                    </td>
                    <td height="48"  width="130" valign="middle" style="background: #fff;color: #333;width:130px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                        ${item?.teamMembersOnLeave?.length ?? ''}
                    </td>
                     <td height="48"  width="130" valign="middle" style="background: #fff;color: #333;width:130px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                        ${item?.shortageTime ?? ''}
                    </td>
                </tr>
               
                `;
                body1.push(taskRow);
            });
        
    
        let body = '';
        if (body1?.length > 0) {
            body = `<table width="100%" bgcolor="#FAFAFA" style="background-color:#FAFAFA;margin:-18px -10px;" align="center">
                <tr>
                    <td width="100%">
                        <table width="900px" align="center" bgcolor="#fff" style="width:1350px;padding:0px 32px;background-color:#fff;">
                            <tr>
                                <td width="100%">
                                    <div style="padding-top: 56px;" width="100%">
                                        <table style="height: 50px;border-collapse: collapse;" border="0" align="left">
                                            <tr>
                                                <td width="48px" height="48px"><img width="100%" height="100%" src="https://hochhuth-consulting.de/images/icon_small_hhhh.png" style="width: 48px;height: 48px;border-radius: 50%;" alt="Site Icon"></td>
                                                <td><div style="color: var(--black, #333);margin-left:4px;text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;">All Portfolio Lead</div></td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div width="100%">
                                        <table style="height: 56px;border-collapse: collapse;" border="0" width="100%" height="56px">
                                            <tr>
                                                <td width="100%" height="56px">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        
                <tr>
                <td>
                  
                    <div>
                        <table width="100%" style="border-collapse: collapse;">
                            <tr>
                                <td width="180" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">LeadName</td>
                                <td width="220" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">LeadTitle</td>
                                <td width="350" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">Total Team-Member Available</td>
                                <td width="350" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">Not Available team-Member</td>
                                <td width="130" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">shortageHours</td>
                            </tr>
                    
                            <tbody>
                                ${body1.join('')}
                            </tbody>
                        </table>
                    </div>
                </td>
                </tr>
                </td>
                </tr>
            </table>
            
            `;
        }
        props?.callbackPortfolioLeadEOD(body)
        console.log(body, "body1");
     }
      
 },[data]) 
    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                      <a target="_blank" data-interception="off" href={`${props?.AllListId?.siteUrl}/SitePages/Dashboard.aspx?DashBoardId=5'`} >  <span>{row.original.Title}</span></a>
                    </>

                ),
                id: "Title",
                placeholder: "LeadName",
                header: "",
                resetColumnFilters: false,
                size: 95,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.portfolioTitle,
                cell: ({ row, getValue }) => (
                    <div className="columnFixedTitle">
                    <span title={row?.original?.portfolioTitle} className="text-content hreflink">
                    <a  target="_blank" data-interception="off" href={`${props?.AllListId?.siteUrl}/SitePages/PortfolioLead.aspx?web=1'`}>
                            {row?.original?.portfolioTitle}
                            </a>
                        </span>
                    </div>
                    
                ),
                id: "portfolioTitle",
                placeholder: "LeadTitle",
                header: "",
                resetColumnFilters: false,
                // isColumnDefultSortingAsc: isColumnDefultSortingAsc,
                // isColumnDefultSortingAsc:true,
                size: 120,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.AllTeamMembers,
                cell: ({ row, column, getValue }) => (
                    <>
                    {row?.original?.AllTeamMembers?.length}
                    </>
                ),
                id: "AllTeamMembers",
                placeholder: "Total Team-Member Available",
                resetColumnFilters: false,
                header: "",
                size: 500,
                isColumnVisible: true,
                isAdvanceSearchVisible: true
            },
            {
                accessorFn: (row) => row?.teamMembersOnLeave,
                cell: ({ row, column, getValue }) => (
                    <>
                 {row?.original?.teamMembersOnLeave?.length}
                    </>
                ),
                id: "teamMembersOnLeave",
                placeholder: "Not Available team-Member",
                resetColumnFilters: false,
                header: "",
                size: 500,
                isColumnVisible: true,
                isAdvanceSearchVisible: true
            },
            {
                accessorFn: (row) => row?.shortageTime,
                cell: ({ row, column, getValue }) => (
                    <>
                       <span>
                       {row?.original?.shortageTime                   
                        }
                       </span>
                      
                    </>
                ),
                id: 'shortageTime',
                placeholder: "shortageHours",
                resetColumnFilters: false,
                header: "",
                size: 70,
                isColumnVisible: true,
                isAdvanceSearchVisible: true
            },
        ],
        [data]
    );
    return (
        <>
            <GlobalCommanTable
                showHeader={true}
                AllListId={props?.AllListId} columns={columns} data={data}
                callBackData={callBackData}
                fixedWidth={true}
                tableId="EodReport"
                multiSelect={true}
                customHeaderButtonAvailable={true}

            />
        </>
    )
}
export default PortfolioLeadEOD;