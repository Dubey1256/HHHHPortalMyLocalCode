import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from "react";
import { Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { ColumnDef } from "@tanstack/react-table";
import moment from 'moment';
let portfolioLead: any;
let leaveInformations:any;
let AllTimeEntry:any;
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
                    let LeadportfolioData = masterValue?.filter((item: any) => item?.ResponsibleTeam?.some((leadInfo: any) => leadInfo?.Id == leads?.AssingedToUserId))
                    leads.portfolioTitle=LeadportfolioData?.map((tool: { Title: any; }) => tool.Title).join(', ')
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
            user?.Approver?.forEach((approver: any) => {
                  uniqueLeads.add(approver?.Id);
            });
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
            Leads.teamMembersOnLeave =  Leads.AllTeamMembers?.filter((leadMember: any) =>leaveInformations?.some((leaveMember: any) => leaveMember?.Employee?.Id == leadMember?.AssingedToUserId))
           

        })
        portfolioLead = leads
        getMasterTaskList()

        // return   leads;
    };
    // function getStartingDate(startDateOf: any) {
    //     const startingDate = new Date();
    //     let formattedDate = startingDate;
    //     if (startDateOf == 'This Week') {
    //         startingDate.setDate(startingDate?.getDate() - startingDate?.getDay());
    //         formattedDate = startingDate;
    //     } else if (startDateOf == 'Today') {
    //         formattedDate = startingDate;
    //     } else if (startDateOf == 'Yesterday') {
    //         startingDate.setDate(startingDate?.getDate() - 1);
    //         formattedDate = startingDate;
    //     } else if (startDateOf == 'This Month') {
    //         startingDate.setDate(1);
    //         formattedDate = startingDate;
    //     } else if (startDateOf == 'Last Month') {
    //         const lastMonth = new Date(startingDate?.getFullYear(), startingDate?.getMonth() - 1);
    //         const startingDateOfLastMonth = new Date(lastMonth?.getFullYear(), lastMonth?.getMonth(), 1);
    //         var change = (moment(startingDateOfLastMonth)?.add(22, 'days')?.format())
    //         var b = new Date(change)
    //         formattedDate = b;
    //     } else if (startDateOf == 'Last Week') {
    //         const lastWeek = new Date(startingDate?.getFullYear(), startingDate?.getMonth(), startingDate?.getDate() - 7);
    //         const startingDateOfLastWeek = new Date(lastWeek?.getFullYear(), lastWeek?.getMonth(), lastWeek?.getDate() - lastWeek?.getDay() + 1);
    //         formattedDate = startingDateOfLastWeek;
    //     }

    //     return formattedDate;
    // }
    // const toIST = (dateString: any, isEndDate: boolean, isFirstHalf: boolean, isSecondHalf: boolean) => {
    //     const date = new Date(dateString);
    //     if ((isFirstHalf !== undefined && isSecondHalf != undefined) && (isEndDate || isFirstHalf || isSecondHalf)) {
    //         date.setHours(date.getHours() - 5);
    //         date.setMinutes(date.getMinutes() - 30);
    //     }
    //     const formattedDate = date.toISOString().substring(0, 19).replace('T', ' ');
    //     return formattedDate;
    // };
    // const loadTodaysLeave = async () => {
        
    //         let startDate: any = getStartingDate('Today');
    //         startDate = new Date(startDate).setHours(0, 0, 0, 0)
    //         const web = new Web(props?.AllListId?.siteUrl);
    //            const results = await web.lists
    //                .getById("72ABA576-5272-4E30-B332-25D7E594AAA4")
    //             .items.select(
    //                 "RecurrenceData,Duration,Author/Title,Editor/Title,Name,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,HalfDay,HalfDayTwo"
    //             )
    //             .expand("Author,Editor,Employee")
    //             .top(5000)
    //             .getAll();
    //         results?.map((emp: any) => {
    //             emp.leaveStart = toIST(emp?.EventDate, false, emp?.HalfDay, emp?.HalfDayTwo)
    //             emp.leaveStart = new Date(emp?.leaveStart).setHours(0, 0, 0, 0)
    //             emp.leaveEnd = toIST(emp?.EndDate, true, emp?.HalfDay, emp?.HalfDayTwo);
    //             emp.leaveEnd = new Date(emp?.leaveEnd).setHours(0, 0, 0, 0)
    //             if ((startDate >= emp?.leaveStart && startDate <= emp?.leaveEnd) && (emp?.HalfDay !== null && emp?.HalfDayTwo !== null) && (emp?.HalfDay != true && emp?.HalfDayTwo != true)) {
    //                 leaveInformations.push(emp?.Employee?.Id);
    //             }
    //         })
    //         // setOnLeaveEmployees(AllLeaves)
    //         console.log(leaveInformations);
        
    // }

    const loadTodaysLeave = async () => {
       let AllLeaves:any;
       const startDate = new Date();
       startDate.setHours(0, 0, 0, 0); // Set to start of the day
        const endDate = new Date();
       endDate.setHours(23, 59, 59, 999); // Set to end of the day   
       const web = new Web(props?.AllListId?.siteUrl);
       const results = await web.lists
           .getById("72ABA576-5272-4E30-B332-25D7E594AAA4")
           .items.select(
               "RecurrenceData,Duration,Author/Title,Editor/Title,Name,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,HalfDay,HalfDayTwo"
           )
           .expand("Author,Editor,Employee")
           .filter(
            `(EventDate ge datetime'${startDate.toISOString()}' and EventDate le datetime'${endDate.toISOString()}') or ` +
            `(EndDate ge datetime'${startDate.toISOString()}' and EndDate le datetime'${endDate.toISOString()}')`
          ).top(5000)
           .getAll();
           console.log(results)
           console.log(results)
           leaveInformations=results
           getAllLeads(props?.AllUsers)
        console.log(AllLeaves);
        }
        const loadAllTimeEntry = async () => {
         if (props?.timesheetListConfig?.length > 0) {
                let timesheetLists: any = [];
                let currentDate:any = new Date();
                currentDate.setHours(0, 0, 0, 0);
                let previousDate = new Date(currentDate);
                // previousDate.setDate(previousDate.getDate() - 1);
                
                // Convert the previous date to an ISO string in the format YYYY-MM-DD
                let previousDateString = previousDate.toISOString().split('T')[0];
                let previousDateTime = `${previousDateString}T00:00:00.000Z`;
            
                timesheetLists = JSON.parse(props?.timesheetListConfig[0]?.Configurations)
    
                if (timesheetLists?.length > 0) {
                    const fetchPromises = timesheetLists.map(async (list: any) => {
                        let web = new Web(list?.siteUrl);
                        try {
                            let todayDateToCheck = new Date().setHours(0, 0, 0, 0,)
                             await web.lists
                                .getById(list?.listId)
                                .items.select(list?.query)
                            .filter(`Modified ge datetime'${previousDateTime}'`)
                         .getAll().then((data:any)=>{
                           let  TodayTimeEntry:any=[];
                           
                            data?.map((timeEntry:any)=>{
                                let TimeEntryParse:any=[]
                                if(timeEntry?. AdditionalTimeEntry!=undefined && timeEntry?. AdditionalTimeEntry!=null){
                                    TimeEntryParse  = JSON.parse(timeEntry?. AdditionalTimeEntry)
                                }
                            if(TimeEntryParse?.length>0){
                                TodayTimeEntry.push(TimeEntryParse)
                            }
                             
                            })
                            AllTimeEntry=TodayTimeEntry;
                            loadTodaysLeave()
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


    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        <span>{row.original.Title}</span>
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
                            {row?.original?.portfolioTitle}
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
                accessorFn: (row) => row?.shortageHours,
                cell: ({ row, column, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != (null || undefined) &&
                            <span>
                                test
                            </span>
                        }
                    </>
                ),
                id: 'shortageHours',
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