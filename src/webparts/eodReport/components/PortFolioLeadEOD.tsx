import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from "react";
import { Web } from "sp-pnp-js";
import * as globalCommon from "../../../globalComponents/globalCommon";
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { ColumnDef } from "@tanstack/react-table";
import moment from 'moment';
let portfolioLead: any;
let leaveInformations:any;
const PortfolioLeadEOD = (props: any) => {
    const [data, setData]: any = useState([])
    const [leadData, setleadData] = useState([])
    const [masterTasks, setMasterTasks] = useState([])
    useEffect(() => {
        loadTodaysLeave()
        getAllLeads(props?.AllUsers)
       
        // LoadAllMasterTaskData()
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
            Leads.teamembers = []
            allUsers.map((user: any) => {
                user?.Approver?.forEach((approver: any) => {
                    if (Leads.AssingedToUserId == approver.Id) {
                        Leads.teamembers.push(user)
                    }
                });
            })

        })
        portfolioLead = leads

        // setData(leads)
        setleadData(leads)
        getMasterTaskList()

        // return   leads;
    };
    function getStartingDate(startDateOf: any) {
        const startingDate = new Date();
        let formattedDate = startingDate;
        if (startDateOf == 'This Week') {
            startingDate.setDate(startingDate.getDate() - startingDate.getDay());
            formattedDate = startingDate;
        } else if (startDateOf == 'Today') {
            formattedDate = startingDate;
        } else if (startDateOf == 'Yesterday') {
            startingDate.setDate(startingDate.getDate() - 1);
            formattedDate = startingDate;
        } else if (startDateOf == 'This Month') {
            startingDate.setDate(1);
            formattedDate = startingDate;
        } else if (startDateOf == 'Last Month') {
            const lastMonth = new Date(startingDate.getFullYear(), startingDate.getMonth() - 1);
            const startingDateOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
            var change = (moment(startingDateOfLastMonth).add(22, 'days').format())
            var b = new Date(change)
            formattedDate = b;
        } else if (startDateOf == 'Last Week') {
            const lastWeek = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7);
            const startingDateOfLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay() + 1);
            formattedDate = startingDateOfLastWeek;
        }

        return formattedDate;
    }
    // const toIST = (dateString: any, isEndDate: boolean, isFirstHalf: boolean, isSecondHalf: boolean) => {
    //     const date = new Date(dateString);
    //     if ((isFirstHalf !== undefined && isSecondHalf != undefined) && (isEndDate || isFirstHalf || isSecondHalf)) {
    //         date.setHours(date.getHours() - 5);
    //         date.setMinutes(date.getMinutes() - 30);
    //     }
    //     const formattedDate = date.toISOString().substring(0, 19).replace('T', ' ');
    //     return formattedDate;
    // };
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
            // results?.map((emp: any) => {
            //     emp.leaveStart = toIST(emp?.EventDate, false, emp?.HalfDay, emp?.HalfDayTwo)
            //     emp.leaveStart = new Date(emp?.leaveStart).setHours(0, 0, 0, 0)
            //     emp.leaveEnd = toIST(emp?.EndDate, true, emp?.HalfDay, emp?.HalfDayTwo);
            //     emp.leaveEnd = new Date(emp?.leaveEnd).setHours(0, 0, 0, 0)
            //     if ((startDate >= emp?.leaveStart && startDate <= emp?.leaveEnd) && (emp?.HalfDay !== null && emp?.HalfDayTwo !== null) && (emp?.HalfDay != true && emp?.HalfDayTwo != true)) {
            //         AllLeaves.push(emp?.Employee?.Id);
            //     }
            // })
            
            console.log(AllLeaves);
        }
    

    const callBackData = React.useCallback((checkData: any) => {
        console.log(checkData, "checkData");

    }, []);


    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                // hasCustomExpanded: hasCustomExpanded,
                // hasExpanded: hasExpanded,
                // isHeaderNotAvlable: isHeaderNotAvlable,
                size: 55,
                id: 'Id',
            },
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
                accessorFn: (row) => row?.teamembers,
                cell: ({ row, column, getValue }) => (
                    <>
                    {row?.original?.teamembers?.length}
                    </>
                ),
                id: "teamembers",
                placeholder: "Total Team-Member Available",
                resetColumnFilters: false,
                header: "",
                size: 500,
                isColumnVisible: true,
                isAdvanceSearchVisible: true
            },
            {
                accessorFn: (row) => row?.teamembers,
                cell: ({ row, column, getValue }) => (
                    <>

                    </>
                ),
                id: "teamembers",
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