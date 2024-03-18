import * as React from 'react'
import $ from 'jquery';
import * as Moment from "moment";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";

let currentLoginUserId:any=''
let CurrentUserTitle:any=''
let AllData:any=[]
const ShareTimeSheet=(props:any)=>{
     currentLoginUserId = props?.Context.pageContext?._legacyPageContext.userId;
     CurrentUserTitle = props?.Context.pageContext?._legacyPageContext?.userDisplayName;
    const [weeklyTimeReport, setWeeklyTimeReport] = React.useState([]);
    const [timeEntryTotal, setTimeEntryTotal] = React.useState(0);


    React.useEffect(()=>{
        currentUserTimeEntry(props?.type)
        shareTaskInEmail('today time entries',props?.type)
    },[])
    // const checkTimeEntrySite = (timeEntry: any) => { 
    //     let result = ''
    //     result = props?.AllTask?.filter((task: any) => {
    //         let site = '';
    //         if (task?.siteType == 'Offshore Tasks') {
    //             site = 'OffshoreTasks'
    //         } else {
    //             site = task?.siteType;
    //         }
    //         if (timeEntry[`Task${site}`] != undefined && task?.Id == timeEntry[`Task${site}`]?.Id) {
    //             return task;
    //         }
    //     });
    //     return result;
    // }
    // const currentUserTimeEntryCalculation = () => {
    //     const timesheetDistribution = ['Today', 'This Week', 'This Month'];
    //     const allTimeCategoryTime = timesheetDistribution.reduce((totals, start) => {
    //         const startDate = getStartingDate(start);
    //         const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
    //         const endDate = getEndingDate(start);
    //         const endDateMidnight = new Date(endDate.setHours(0, 0, 0, 0));

    //         const total = props.AllTaskTimeEntries?.reduce((acc: any, timeEntry: any) => {
    //             if (timeEntry?.AdditionalTimeEntry) {
    //                 const AdditionalTime = JSON.parse(timeEntry.AdditionalTimeEntry);

    //                 const taskTime = AdditionalTime.reduce((taskAcc: any, filledTime: any) => {
    //                     const [day, month, year] = filledTime?.TaskDate?.split('/');
    //                     const timeFillDate = new Date(+year, +month - 1, +day);

    //                     if (
    //                         filledTime?.AuthorId == props.currentUserData.Id &&
    //                         timeFillDate >= startDateMidnight &&
    //                         timeFillDate <= endDateMidnight &&
    //                         timeEntry.taskDetails[0]
    //                     ) {
    //                         return taskAcc + parseFloat(filledTime.TaskTime);
    //                     }

    //                     return taskAcc;
    //                 }, 0);

    //                 return acc + taskTime;
    //             }

    //             return acc;
    //         }, 0);

    //         return { ...totals, [start.toLowerCase()]: total };
    //     }, {
    //         today: 0,
    //         thisWeek: 0,
    //         thisMonth: 0,
    //     });

    //     return allTimeCategoryTime;
    // };
    const currentUserTimeEntryCalculation = async() => {
        const timesheetDistribution = ['Today','Yesterday','This Week', 'This Month'];
        const allTimeCategoryTime = timesheetDistribution?.reduce((totals, start) => {
            const startDate = getStartingDate(start);
            const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
            const endDate = getEndingDate(start);
            const endDateMidnight = new Date(endDate.setHours(0, 0, 0, 0));

            const total = props?.AllTaskTimeEntries?.reduce((acc: any, timeEntry: any) => {

                if (timeEntry?.AdditionalTimeEntry) {
                    const AdditionalTime = JSON.parse(timeEntry.AdditionalTimeEntry);

                    const taskTime = AdditionalTime?.reduce((taskAcc: any, filledTime: any) => {
                        const [day, month, year] = filledTime?.TaskDate?.split('/');
                        const timeFillDate = new Date(+year, +month - 1, +day);

                        if (
                            filledTime?.AuthorId == currentLoginUserId &&
                            timeFillDate >= startDateMidnight &&
                            timeFillDate <= endDateMidnight 
                           
                        ) {
                            return taskAcc + parseFloat(filledTime.TaskTime);
                        }

                        return taskAcc;
                    }, 0);

                    return acc + taskTime;
                }

                return acc;
            }, 0);

            return { ...totals, [start.toLowerCase()]: total };
        }, {
            today: 0,
            yesterday:0,
            thisWeek: 0,
            thisMonth: 0,
        });

        return allTimeCategoryTime;
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
            var change = (Moment(startingDateOfLastMonth).add(17, 'days').format())
            var b = new Date(change)
            formattedDate = b;
        } else if (startDateOf == 'Last Week') {
            const lastWeek = new Date(startingDate.getFullYear(), startingDate.getMonth(), startingDate.getDate() - 7);
            const startingDateOfLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate() - lastWeek.getDay() + 1);
            formattedDate = startingDateOfLastWeek;
        }

        return formattedDate;
    }
    function getEndingDate(startDateOf: any): Date {
        const endingDate = new Date();
        let formattedDate = endingDate;

        if (startDateOf === 'This Week') {
            endingDate.setDate(endingDate.getDate() + (6 - endingDate.getDay()));
            formattedDate = endingDate;
        } else if (startDateOf === 'Today') {
            formattedDate = endingDate;
        } else if (startDateOf === 'Yesterday') {
            endingDate.setDate(endingDate.getDate() - 1);
            formattedDate = endingDate;
        } else if (startDateOf === 'This Month') {
            endingDate.setMonth(endingDate.getMonth() + 1, 0);
            formattedDate = endingDate;
        } else if (startDateOf === 'Last Month') {
            const lastMonth = new Date(endingDate.getFullYear(), endingDate.getMonth() - 1);
            endingDate.setDate(0);
            formattedDate = endingDate;
        } else if (startDateOf === 'Last Week') {
            const lastWeek = new Date(endingDate.getFullYear(), endingDate.getMonth(), endingDate.getDate() - 7);
            endingDate.setDate(lastWeek.getDate() - lastWeek.getDay() + 7);
            formattedDate = endingDate;
        }

        return formattedDate;
    }

    const currentUserTimeEntry = (start: any) => {
        const startDate = getStartingDate(start);
        const endDate = getEndingDate(start);
        const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
        const endDateMidnight = new Date(endDate.setHours(0, 0, 0, 0));
 
        var startDateMid = Moment(startDateMidnight).format("DD/MM/YYYY")
         var eventDateMid = Moment(endDateMidnight).format("DD/MM/YYYY")
            var NewStartDate = startDateMid.split("/")
            var NewEndDate = eventDateMid.split("/")

            var End = NewEndDate[2] + NewEndDate[1] + NewEndDate[0]
            var starts = NewStartDate[2] + NewStartDate[1] + NewStartDate[0]
            const { weekTimeEntries, totalTime } = props.AllTaskTimeEntries?.reduce(
            (acc: any, timeEntry: any) => {
                try {
                    if (timeEntry?.AdditionalTimeEntry) {
                        const AdditionalTime = JSON.parse(timeEntry?.AdditionalTimeEntry);

                        AdditionalTime?.forEach((filledTime: any) => {
                            const [day, month, year] = filledTime?.TaskDate?.split('/');
                            const timeFillDate = new Date(+year, +month - 1, +day);
                            var b = Moment(timeFillDate).format("DD/MM/YYYY")
                            var newDate = b.split("/")
                            var seleteddate = newDate[2] + newDate[1] + newDate[0]

                            if (
                                filledTime?.AuthorId == currentLoginUserId &&
                                seleteddate >= starts &&
                                seleteddate <= End && timeEntry?.taskDetails[0]
                                
                            ) {
                                const data = { ...timeEntry.taskDetails[0] } || {};
                                const taskTime = parseFloat(filledTime.TaskTime);

                                data.TaskTime = taskTime;
                                data.timeDate = filledTime.TaskDate;
                                data.Description = filledTime.Description;
                                data.timeFillDate = timeFillDate;

                                acc.weekTimeEntries.push(data);
                                acc.totalTime += taskTime;
                            }
                        });
                    }

                } catch (error) {
                    
                }
                return acc;
            },
            { weekTimeEntries: [], totalTime: 0 }
        );
        weekTimeEntries.sort((a: any, b: any) => {
            return b.timeFillDate - a.timeFillDate;
        });
        AllData = weekTimeEntries;
        setWeeklyTimeReport(weekTimeEntries);
        setTimeEntryTotal(totalTime);
      
    };
  

    const shareTaskInEmail = async (input: any,day:any) => {
        let currentDate = Moment(new Date()).format("DD/MM/YYYY")
        var today = new Date();
        const yesterdays = new Date(today.setDate(today.getDate() - 1))
        const yesterday = Moment(yesterdays).format("DD/MM/YYYY")
        let body: any = '';
        let text = '';
        let to: any = [];
        let body1: any = [];
        let userApprover:any = '';
        let email:any = [];
       
        props.taskUser?.map((user: any) => {
            user.UserManagerMail = [];
            user.UserManagerName = ''
            user?.Approver?.map((Approver: any, index: any) => {
                if (index == 0) {

                    user.UserManagerName = Approver?.Title;
                } else {
                    user.UserManagerName += ' ,' + Approver?.Title
                }
                let Mail = Approver?.Name?.split('|')[2]
                user.UserManagerMail.push(Mail)
            })
            if (user?.AssingedToUser?.Id == currentLoginUserId && user?.Title != undefined) {
                to = user?.UserManagerMail;
                userApprover = user?.UserManagerName;
                email.push(user?.UserManagerMail)
            }
        });
        
        let confirmation = confirm('Your' + ' ' + input + ' ' + 'will be automatically shared with your approver' + ' ' + '(' + userApprover + ')' + '.' + '\n' + 'Do you want to continue?')
        if (confirmation) {
            body = body.replaceAll('>,<', '><').replaceAll(',', '')
        }
        if (input == 'today time entries') {
            // var subject = currentLoginUser + `- ${selectedTimeReport} Time Entries`;
             let timeSheetData:any = await currentUserTimeEntryCalculation();
             var updatedCategoryTime:any = {};
             for (const key in timeSheetData) {
                 if (timeSheetData.hasOwnProperty(key)) {
                   let newKey = key;
               
                   // Replace 'this month' with 'thisMonth'
                   newKey = newKey.replace('this month', 'thisMonth');
                   
                   // Replace 'this week' with 'thisWeek'
                   newKey = newKey.replace('this week', 'thisWeek');
               
                   updatedCategoryTime[newKey] = timeSheetData[key];
                 }
               }
               
               if(day == 'Today'){
                var subject = "Daily Timesheet - " + CurrentUserTitle + ' - '+  currentDate  +  ' - ' + (updatedCategoryTime.today) + ' hours '
               }
               if(day == 'Yesterday'){
                var subject = "Daily Timesheet - " + CurrentUserTitle + ' - '+  yesterday  +  ' - ' + (updatedCategoryTime.yesterday) + ' hours '
               }
               AllData.map((item: any) => {
                item.ClientCategories = ''
                item.ClientCategory.forEach((val: any, index: number) => {
                    item.ClientCategories += val.Title;
            
                    // Add a comma only if it's not the last item
                    if (index < item.ClientCategory.length - 1) {
                        item.ClientCategories += '; ';
                    }
                });
                 
                     
                text =
                '<tr>' +
                '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:40px;text-align:center">' + item?.siteType + '</td>'
                + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:250px;text-align:center">' + '<p style="margin:0px;">'+ '<a style="text-decoration:none;" href =' + item.siteUrl + '/SitePages/PX-Profile.aspx?ProjectId=' + item.Project?.Id +'><span style="font-size:13px">'+  (item?.Project == undefined?'':item?.Project.Title) + '</span></a>' + '</p>' +  '</td>'
                + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:135px;text-align:center">' + '<p style="margin:0px;">' + '<a style="text-decoration:none;" href =' + item.siteUrl + '/SitePages/Portfolio-Profile.aspx?taskId=' + item?.Portfolio?.Id +'><span style="font-size:13px">'+ (item.Portfolio == undefined?'':item.Portfolio.Title) +'</span></a>' + '</p>' + '</td>'
                + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:250px;text-align:center">' + '<p style="margin:0px;">' + '<a style="text-decoration:none;" href =' + item.siteUrl + '/SitePages/Task-Profile.aspx?taskId=' + item.Id + '&Site=' + item.siteType + '><span style="font-size:13px">' + item.Title + '</span></a>' + '</p>' + '</td>'
                + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:40px;text-align:center">' + item?.TaskTime + '</td>'
                + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;text-align:center">' + item?.Description + '</td>'
                + '<td style="border:1px solid #ccc;border-right:0px;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:120px;text-align:center">' + (item?.SmartPriority !== undefined ? item?.SmartPriority : '')+ '</td>'
                + '<td style="border:1px solid #ccc;border-top:0px;line-height:24px;font-size:13px;padding:5px;width:130px;text-align:center">' + item.ClientCategories + '</td>'
               
            body1.push(text);
    
        });
             body =
                 `<table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
             <thead>
             <tr valign="middle" style="font-size:15px;"><td style="font-weight:600; padding: 5px 0px;width: 210px;">Username: </td><td style="padding: 5px 0px;"> <a style="text-decoration:none;" href='${props?.props?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${currentLoginUserId}'>${CurrentUserTitle}</a></td></tr>
             <tr valign="middle" style="font-size:15px;"><td style="font-weight:600; padding: 5px 0px;width: 210px;">Total hours ${day} :</td><td style="padding: 5px 0px;">${day=='Today'?updatedCategoryTime.today:updatedCategoryTime.yesterday} Hours</td></tr>
             <tr valign="middle" style="font-size:15px;"><td style="font-weight:600; padding: 5px 0px;width: 210px;">Total hours this week :</td><td style="padding: 5px 0px;">${updatedCategoryTime.thisWeek} Hours</td></tr>
             <tr valign="middle" style="font-size:15px;"><td style="font-weight:600;padding: 5px 0px;width: 210px;">Total hours this month :</td><td style="padding: 5px 0px;">${updatedCategoryTime.thisMonth} Hours</td></tr>
             <tr valign="middle" style="font-size:15px;"><td colspan="2" style="padding: 5px 0px;"><a style="text-decoration:none;" href ='${props?.props?.siteUrl}/SitePages/UserTimeEntry.aspx?userId=${currentLoginUserId}'>Click here to open Online-Timesheet</a></td></tr>
             </thead>
             </table> `
                 + '<table style="margin-top:20px;" cellspacing="0" cellpadding="0" width="100%" border="0">'
                 + '<thead>'
                 + '<tr>'
                     + '<th style="line-height:24px;font-size:15px;padding:5px;width:40px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Site' + '</th>'
                     + '<th style="line-height:24px;font-size:15px;padding:5px;width:250px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Project Title' + '</th>'
                     + '<th style="line-height:24px;font-size:15px;padding:5px;width:135px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Component' + '</th>'
                     + '<th style="line-height:24px;font-size:15px;padding:5px;width:250px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Task Name' + '</th>'
                     + '<th style="line-height:24px;font-size:15px;padding:5px;width:40px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Time' + '</th>'
                     + '<th style="line-height:24px;font-size:15px;padding:5px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Time Entry Description' + '</th>'
                     + '<th style="line-height:24px;font-size:15px;padding:5px;width:120px;border:1px solid #ccc;border-right:0px;" bgcolor="#f5f5f5">' + 'Smart Priority' + '</th>'
                     + '<th style="line-height:24px;font-size:15px;padding:5px;width:130px;border:1px solid #ccc;" bgcolor="#f5f5f5">' + 'Client Category' + '</th>'
                     + '</tr>'
                 + '</thead>'
                 + '<tbody>'
                 + '<tr>'
                 + body1
                 + '</tr>'
                 + '</tbody>'
                 + '</table>'
                 
             body = body.replaceAll('>,<', '><').replaceAll(',', '')
         }
    
    
    
    
        if (body1.length > 0 && body1 != undefined) {
            SendEmailFinal(to, subject, body);
        } else {
            alert("No entries available");
        }
    }
    const SendEmailFinal = async (to: any, subject: any, body: any) => {
        let sp = spfi().using(spSPFx(props?.props?.Context));
        sp.utility.sendEmail({
            //Body of Email  
            Body: body,
            //Subject of Email  
            Subject: subject,
            //Array of string for To of Email  
            To: to,
            AdditionalHeaders: {
                "content-type": "text/html",
                'Reply-To': 'santosh.kumar@smalsus.com'
            },
        }).then(() => {
            console.log("Email Sent!");
            alert('Email sent sucessfully');

        }).catch((err) => {
            console.log(err.message);
        });



    }

    return(
        <>
        </>
    )
}
export default ShareTimeSheet;

