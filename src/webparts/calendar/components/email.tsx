import * as React from "react";
import { useState, useEffect } from "react";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { Web } from "sp-pnp-js";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import { BorderBottomSharp } from "@material-ui/icons";
import 'core-js/es/object/values';
import moment from "moment";

let matchedData:any;
let days_difference:any;
interface NameIdData {
  [key: number]: {
    NameId: any;
    TotalLeaved: any;
  };
}
let message:any;
let count:any=1;
let counts = 0;
let Juniordevavailabel=0;
let smalsusleadavailabel=0; 
let hhhhteamavailabel = 0;
let seniordevavailabel = 0;
let qateamavailabel = 0;
let designteamavailabel = 0;
let Allteamoforganization = 0;
const EmailComponenet = (props: any) => {
  const [AllTaskuser, setAllTaskuser] = React.useState([]);
  const [leaveData, setleaveData] = React.useState([]);
  const [nameidTotals, setNameidTotals] = useState<NameIdData>({});


  // const BindHtmlBody() {
  //     let body = document.getElementById('htmlMailBody')
  //     console.log(body?.innerHTML);
  //     return "<style>p>br {display: none;}</style>" + body?.innerHTML;
  //   }
// const [red,setRed]:any=useState(false);
// props?.data?.map((item:any)=>{
//   if(item.eventType == "Un-Planned"){
//     setRed(true);
//     SendEmail();
//   }      else{
//     setRed(false);
//     SendEmail();
//   }
// })
const loadleave = async () =>  {
  const web = new Web(props.Listdata.siteUrl);
  const results =  await web.lists
          .getById(props.Listdata.SmalsusLeaveCalendar)
          .items.select(
            "RecurrenceData,Duration,Author/Title,Editor/Title,NameId,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type"
          )
          .expand("Author,Editor,Employee")
          .top(500)
          .getAll();

          setleaveData(results);
  
          getTaskUser()
}


 React.useEffect(() => {
    loadleave()
    if(Object.keys(nameidTotals).length !== 0){
    SendEmail()
    }else if(hhhhteamavailabel >0){
      SendEmail()
    }    
    
  }, [count]);

  
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB");

  const SendEmail = () => {
    let sp = spfi().using(spSPFx(props.Context));
    let totalteammemberonleave=AllTaskuser?.length-Object?.keys(nameidTotals)?.length ;
     message = Object?.keys(nameidTotals)?.length === 0 ? `The ${formattedDate} is a great Day! All ${Allteamoforganization} are in Office today!`  : `${formattedDate}: ${Object?.keys(nameidTotals)?.length} are on leave, ${Allteamoforganization-Object?.keys(nameidTotals)?.length} are working`;

    sp.utility
      .sendEmail({
        Body: BindHtmlBody(),
        Subject: "HHHH - Team Attendance " + formattedDate + " " + Allteamoforganization + " available - " + Object?.keys(nameidTotals)?.length + " on leave",
        To: ["abhishek.tiwari@hochhuth-consulting.de"],
        // ,"prashant.kumar@hochhuth-consulting.de","ranu.trivedi@hochhuth-consulting.de","jyoti.prasad@hochhuth-consulting.de"
        AdditionalHeaders: {
          "content-type": "text/html",
        },
      })
      .then(() => {
        console.log("Email Sent!");
        alert("Email Sent!");
        props.call();
      })
      .catch((error) => {
        alert("error");
      });
  };

  // ,"juli.kumari@hochhuth-consulting.de","juli.kumari@smalsus.com","anubhav@smalsus.com","ranu.trivedi@hochhuth-consulting.de"
  //  LoadAll the task User
  const getTaskUser = async () => {
    let web = new Web(props.Listdata.siteUrl);
    await web.lists
      .getById(props.Listdata.TaskUsertListID)
      .items.orderBy("Created", true)
      .filter("UserGroupId ne 295")
      .get()
      .then((Data: any[]) => {
        console.log(Data);
        const mydata = Data.filter((item)=>item.UserGroupId != null && item?.UserGroupId != 131 && item?.UserGroupId != 147 && item.AssingedToUserId != 9)
        setAllTaskuser(mydata);
      })
      .catch((err:any) => {
        console.log(err.message);
      });
  };

  const BindHtmlBody = () => {
    let body = document.getElementById("htmlMailBodyemail");
    console.log(body.innerHTML);
    return "<style>p>br {display: none;}</style>" + body.innerHTML;
  };
  let arr:any=[];
  // Count all the leave of the user
  let year =  new Date().getFullYear();
  let yeardata = leaveData.filter((item) =>item?.EventDate?.substring(0, 4) === `${year}`)
 



  //   const currentYear = new Date().getFullYear();
  
  //   return matchedData.reduce((total: any, item: any) => {
  //     const endDate: any = new Date(item.EndDate);
  //     const eventDate: any = new Date(item.EventDate);
  
  //     // Filter data based on the event date being in the current year
  //     if (eventDate.getFullYear() === currentYear) {
  //       // Adjust the end date to the last day of the current year
  //       const endOfYearDate = new Date(currentYear, 11, 31);
  
  //       const adjustedEndDate = endDate < endOfYearDate ? endDate : endOfYearDate;
  
  //       const timeDifferenceMs = adjustedEndDate - eventDate;
  //       const totalDays = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24));
  
  //       if (timeDifferenceMs <= 9 * 60 * 60 * 1000) {
  //         return total + 1; // Consider difference less than or equal to 9 hours as one day
  //       }
  
  //       let workingDays = 0;
  
  //       while (eventDate < adjustedEndDate) {
  //         const dayOfWeek = eventDate.getDay();
  //         if (dayOfWeek !== 0 && dayOfWeek !== 6) {
  //           // Exclude Sunday (0) and Saturday (6)
  //           workingDays++;
  //         }
  //         eventDate.setDate(eventDate.getDate() + 1); // Move to the next day
  //       }
  
  //       // Adjust total days by subtracting weekends within the period
  //       const totalDaysExcludingWeekends = totalDays - 2 * Math.floor(totalDays / 7);
  //       // Subtract two days for each full weekend
  //       return total + Math.max(totalDaysExcludingWeekends, workingDays);
  //     }
  
  //     return total;
  //   }, 0);
  // };
  
  const calculateTotalWorkingDays = (matchedData:any) => {
    const currentYear = new Date().getFullYear();
  
    return matchedData.reduce((total:any, item:any) => {
      const endDate = new Date(item.EndDate);
      const eventDate:any = new Date(item.EventDate);
  
      // Filter data based on the event date being in the current year
      if (eventDate.getFullYear() === currentYear) {
        // Adjust the end date to the last day of the current year
        const endOfYearDate = new Date(currentYear, 11, 31);
        const adjustedEndDate= endDate < endOfYearDate ? endDate : endOfYearDate;
  
        const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  
        let workingDays = 0;
        let currentDate = new Date(eventDate);
  
        while (currentDate <= adjustedEndDate) {
          const dayOfWeek = currentDate.getDay();
  
          if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isWeekend(currentDate, adjustedEndDate)) {
            // Exclude Sunday (0) and Saturday (6), and the event date and end date if they're both on a weekend
            if (item.HalfDay) {
              workingDays += 0.5; // Consider half-day
            } else {
              workingDays++;
            }
          }
  
          currentDate.setTime(currentDate.getTime() + oneDay); // Move to the next day
        }
  
        return total + workingDays;
      }
  
      return total;
    }, 0);
  };
  
  // Function to check if a date falls on a weekend
  const isWeekend = (startDate:any, endDate:any) => {
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();
  
    return (startDay === 0 || startDay === 6) && (endDay === 0 || endDay === 6);
  };
  



React.useEffect(() => {
  // Assuming 'yeardata' is available from somewhere (prop, state, or elsewhere)
  // const yeardata = ...;

  const userId = props.data.filter((item:any) => item?.NameId != null);

  const nameidData:any = {};

  userId.forEach((username:any) => {
    const matchedData:any = yeardata.filter((member) => member.Employee?.Id === username.NameId);

    if (matchedData.length !== 0) {
      
      const totalDays = calculateTotalWorkingDays(matchedData);
      nameidData[username.NameId] = {
        NameId: username.NameId,
        TotalLeaved: totalDays,
      };
    }
  });
  count++;
  setNameidTotals(nameidData);
}, [props.data]);


console.log(nameidTotals)




  // arr.map((item:any)=>{})
 
// For prepare the property
const data = props.data;
{data?.map((item:any,index:any)=>{
  let condate = new Date(item.end);
  // item.enddate = moment(condate, 'MM/DD/YYYY').format('DD/MM/YYYY');
  item.enddate = moment(condate, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').format('DD/MM/YYYY');

  // For the Team of leave
  item.Juniordev = AllTaskuser.filter((Junior:any)=>(Junior?.UserGroupId===8 && Junior?.AssingedToUserId===item?.NameId))
  item.smalsuslead = AllTaskuser.filter((smallead:any)=>(smallead?.UserGroupId===216 && smallead?.AssingedToUserId===item?.NameId))
  item.hhhhteam = AllTaskuser.filter((hhhteam:any)=>(hhhteam.UserGroupId === 7  && hhhteam?.AssingedToUserId===item?.NameId))
  item.seniordev = AllTaskuser.filter((seniodev:any)=>(seniodev?.UserGroupId===9 && seniodev?.AssingedToUserId===item?.NameId))
  item.qateam = AllTaskuser.filter((qaleave:any)=>(qaleave?.UserGroupId===11 && qaleave?.AssingedToUserId===item?.NameId))
  item.designteam = AllTaskuser.filter((designt:any)=>(designt?.UserGroupId===10 && designt?.AssingedToUserId===item?.NameId))

  {Object.keys(nameidTotals).map((key) => {
    const data = nameidTotals[parseInt(key)];
    if(data.NameId === item.NameId){
      item.TotalLeave = data.TotalLeaved;
      
    }
  })}
   
  }

)
  }

  const juniortotal =  AllTaskuser.filter((Junior:any)=>(Junior?.UserGroupId===8));
  const smalleadtotal =  AllTaskuser.filter((smallead:any)=>(smallead?.UserGroupId===216));
  // const hhhteamtotal =  AllTaskuser.filter((hhhteam:any)=>(hhhteam?.UserGroupId===7 && hhhteam?.AssingedToUserId != 9));
  const seniodevtotal =  AllTaskuser.filter((seniodev:any)=>(seniodev?.UserGroupId===9));
  const qaleavetotal =  AllTaskuser.filter((qaleave:any)=>(qaleave?.UserGroupId===11));
  const designttotal =  AllTaskuser.filter((designt:any)=>(designt?.UserGroupId===10));
   
  Allteamoforganization = juniortotal.length+smalleadtotal.length+seniodevtotal.length + qaleavetotal.length+designttotal.length+2;



  
  const juniordevleave = data.filter((item:any)=> item.Juniordev.length != 0);
  Juniordevavailabel = juniortotal.length - juniordevleave.length;
  const smalleadleave = data.filter((item:any)=> item.smalsuslead.length != 0);
  smalsusleadavailabel = smalleadtotal.length - smalleadleave.length;
  // const hhhhteamleave = data.filter((item:any)=> item.hhhhteam.length != 0);
  // hhhhteamavailabel = hhhteamtotal.length - hhhhteamleave.length;
  const seniordevleave = data.filter((item:any)=> item.seniordev.length != 0);
  seniordevavailabel = seniodevtotal.length - seniordevleave.length;
  const qateamleave = data.filter((item:any)=> item.qateam.length != 0);
  qateamavailabel = qaleavetotal.length - qateamleave.length;
  const designteamleave = data.filter((item:any)=> item.designteam.length != 0);
  designteamavailabel = designttotal.length - designteamleave.length;

  const returnEmailHtml = (): any => {
    let structure = `
    <div id="htmlMailBodyemail" style=" display:none;">
    <div style="background-color:#FAFAFA;margin:-18px -10px;">
        <div style="width:900px;margin:0 auto; padding:0px 32px;background-color:#ffff;">
            <div style="display: flex;align-items: center;padding: 56px 0px;">
                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png" style="width: 48px;height: 48px;border-radius: 50%;" alt="Site Icon">
                <div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;margin-left: 4px;">Attendance Report</div>
            </div>
            <div style="margin-bottom: 40px;font-size: 32px;font-weight: 600;line-height: 40px;color: #2F5596;font-family: Segoe UI;">
                ${Object?.keys(nameidTotals)?.length === 0 ? `The ${formattedDate} is a great Day! All ${Allteamoforganization} are in Office today!` : `${formattedDate}: ${Object?.keys(nameidTotals)?.length} are on leave, ${Allteamoforganization - Object?.keys(nameidTotals)?.length} are working`}
            </div>
        `;

        let tableBody = `
        <div style="margin-bottom: 32px;">
        <table style="height: 88px;border-collapse: collapse;">
            <tr>
                <td style="color: #333;width:158px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE;background: #FAFAFA;">Smalsus Lead Team</td>
                <td style="color: #333;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Senoir Developer Team</td>
                <td style="color: #333;width:185px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Junior Developer Team</td>
                <td style="color: #333;width:103px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Design Team</td>
                <td style="color: #333;width:104px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">QA Team</td>
                <td style="color: #333;width:96px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;">HR</td>
            </tr>
            <tr>
                <td style="color: #333;width:158px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;border-left: 1px solid #EEE;padding: 0px 8px;">${smalsusleadavailabel}</td>
                <td style="color: #333;width:190px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${seniordevavailabel}</td>
                <td style="color: #333;width:185px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${Juniordevavailabel}</td>
                <td style="color: #333;width:103px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${designteamavailabel}</td>
                <td style="color: #333;width:104px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${qateamavailabel}</td>
                <td style="color: #333;width:96px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${1}</td>
            </tr>
        </table>
    </div>
    <div style="margin-bottom: 48px;">
    <table style="border-collapse: collapse;">
        <tr>
            <td style="color: #333;height:48px;width:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;">No.</td>
            <td style="color: #333;height:48px;width:136px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Name</td>
            <td style="color: #333;height:48px;width:112px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Attendance</td>
            <td style="color: #333;height:48px;width:104px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Reason</td>
            <td style="color: #333;height:48px;width:144px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Expected leave end</td>
            <td style="color: #333;height:48px;width:156px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Team</td>
            <td style="color: #333;height:48px;width:144px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Total leave this year</td>
        </tr>
       `
      let innerTableRow:any='';
      data?.map((item:any,index:any)=>{
        innerTableRow+=    
         `<tr>
             <td style="color: #333;height:40px;width:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;border-left: 1px solid #EEE;padding: 8px;">${index+1}</td>
             <td style="color: #333;height:40px;width:136px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;text-decoration-line: underline;color: #2F5596;"><a href='${props.Listdata.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${item?.NameId}&Name=${item?.Name}'> ${item?.Name}</a></td>
             <td style="color: #333;height:40px;width:112px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;${item.eventType === "Un-Planned"?"background: #FFEAEA;color: #A10101;" :"background: #DCECDE;color: #008314;"}"> ${item.eventType}</td>
             <td style="color: #333;height:40px;width:104px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;">${item?.shortD}</td>
             <td style="color: #333;height:40px;width:144px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;text-decoration-line: underline;color: #2F5596;"><a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx">
                 <span>${item?.enddate}</span></td>
             <td style="color: #333;height:40px;width:156px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;" >${item.Designation}</td>
             <td style="color: #333;height:40px;width:144px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;">${item?.TotalLeave}</td>
         </tr>`
        
     })

     tableBody+= innerTableRow + ` </table></div>`

     let CompleteEmployeeBody = ` <div style="width: 264px;height: 264px;flex-shrink: 0;border-radius: 264px;background: #EEF4FF;margin-bottom: 40px;padding: 32px;display: flex; align-items: center;justify-content: space-around; margin: 0 auto;">
    <div style="width: 200px;height: 200px;flex-shrink: 0;background: url(<path-to-image>), lightgray 50% / cover no-repeat;"></div>
</div>
<div style="margin-bottom: 88px;">
    <div style="display: flex;justify-content: center;align-items: center;gap: 8px;flex-shrink: 0;color: #FFF;border-radius: 4px;
    background: #2F5596;width: 260px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;line-height: normal;">See Full Leave Report Online</div>
</div>
<div style="display: flex;align-items: center;padding-bottom: 88px;">
    <img src="" style="height: 48px;" alt="Site Icon">
    <div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;margin-left: 4px;">Hochhuth Consulting GmbH</div>
</div>`

    let allEmpPresent = false;
    Object?.keys(nameidTotals)?.length != 0 ? (allEmpPresent = false) : (allEmpPresent = true);

    if (allEmpPresent) {
        structure += CompleteEmployeeBody + `</div></div></div></div></div>`;
    } else {
        structure += tableBody + `
            <div style="margin-bottom: 88px;">
                <div style="display: flex;justify-content: center;align-items: center;flex-shrink: 0;color: #FFF;border-radius: 4px;
                background: #2F5596;width: 260px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;line-height: normal;">
                    <a style="text-decoration: none;color: white;" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx">See Full Leave Report Online</a>
                </div>
            </div>
            <div style="display: flex;align-items: center;padding-bottom: 88px;">
                <img src="https://www.hochhuth-consulting.de/images/logo.png" style="height: 48px;" alt="Site Icon">
                <div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;margin-left: 4px;">Hochhuth Consulting GmbH</div>
            </div>
        </div></div></div></div></div></div>`;
    }

    return structure;
};



// const returnEmailHtml=():any=>{
//   let structure=`
  
//   <div style="background-color:#FAFAFA;">
//       <div id="htmlMailBodyemail" style="width:900px;margin:0 auto; padding:0px 32px;background-color:#ffff; display:none;">
//       <div style="display: flex;align-items: center;margin: 56px 0px;">
//       <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png" style="width: 48px;height: 48px;border-radius: 50%;" alt="Site Icon">
//       <div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;margin-left: 4px;">Attendance Report</div>
//   </div>
//   <div style="margin-bottom: 40px;font-size: 32px;font-weight: 600;line-height: 40px;color: #2F5596;font-family: Segoe UI;">
//              ${Object?.keys(nameidTotals)?.length === 0 ? `The ${formattedDate} is a great Day! All ${Allteamoforganization} are in Office today!`  : `${formattedDate}: ${Object?.keys(nameidTotals)?.length} are on leave, ${Allteamoforganization-Object?.keys(nameidTotals)?.length} are working`}
//         </div>
//         `
//         let tableBody = `
//         <div style="margin-bottom: 32px;">
//         <table style="width: 836px;height: 88px;border-collapse: collapse;">
//             <tr>
//                 <td style="color: #333;width:158px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE;background: #FAFAFA;">Smalsus Lead Team</td>
//                 <td style="color: #333;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Senoir Developer Team</td>
//                 <td style="color: #333;width:185px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Junior Developer Team</td>
//                 <td style="color: #333;width:103px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Design Team</td>
//                 <td style="color: #333;width:104px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">QA Team</td>
//                 <td style="color: #333;width:96px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;">HR</td>
//             </tr>
//             <tr>
//                 <td style="color: #333;width:158px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;border-left: 1px solid #EEE;padding: 0px 8px;">${smalsusleadavailabel}</td>
//                 <td style="color: #333;width:190px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${seniordevavailabel}</td>
//                 <td style="color: #333;width:185px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${Juniordevavailabel}</td>
//                 <td style="color: #333;width:103px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${designteamavailabel}</td>
//                 <td style="color: #333;width:104px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${qateamavailabel}</td>
//                 <td style="color: #333;width:96px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 0px 8px;">${1}</td>
//             </tr>
//         </table>
//     </div>
//     <div style="margin-bottom: 48px;">
//     <table style="width: 836px;border-collapse: collapse;">
//         <tr>
//             <td style="color: #333;height:48px;width:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;">No.</td>
//             <td style="color: #333;height:48px;width:136px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Name</td>
//             <td style="color: #333;height:48px;width:105px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Attendance</td>
//             <td style="color: #333;height:48px;width:100px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Reason</td>
//             <td style="color: #333;height:48px;width:160px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Expected leave end</td>
//             <td style="color: #333;height:48px;width:155px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Team</td>
//             <td style="color: #333;height:48px;width:180px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Total leave this year</td>
//         </tr>
//        `
//       let innerTableRow:any='';
//       data?.map((item:any,index:any)=>{
//         innerTableRow+=    
//          `<tr>
//              <td style="color: #333;height:40px;width:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;border-left: 1px solid #EEE;padding: 8px;">${index+1}</td>
//              <td style="color: #333;height:40px;width:136px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;text-decoration-line: underline;color: #2F5596;"><a href='${props.Listdata.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${item?.NameId}&Name=${item?.Name}'> ${item?.Name}</a></td>
//              <td style="color: #333;height:40px;width:105px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;${item.eventType === "Un-Planned"?"background: #FFEAEA;color: #A10101;" :"background: #DCECDE;color: #008314;"}"> ${item.eventType}</td>
//              <td style="color: #333;height:40px;width:100px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;">${item?.shortD}</td>
//              <td style="color: #333;height:40px;width:160px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;text-decoration-line: underline;color: #2F5596;"><a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx">
//                  <span>${item?.enddate}</span></td>
//              <td style="color: #333;height:40px;width:155px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;" >${item.Designation}</td>
//              <td style="color: #333;height:40px;width:180px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;padding: 8px;">${item?.TotalLeave}</td>
//          </tr>`
        
//      })

//      tableBody+= innerTableRow + ` </table></div>`
//      let CompleteEmployeeBody = ` <div style="width: 264px;height: 264px;flex-shrink: 0;border-radius: 264px;background: #EEF4FF;margin-bottom: 40px;padding: 32px;display: flex; align-items: center;justify-content: space-around; margin: 0 auto;">
//      <div style="width: 200px;height: 200px;flex-shrink: 0;background: url(<path-to-image>), lightgray 50% / cover no-repeat;"></div>
//  </div>
//  <div style="margin-bottom: 88px;">
//      <div style="display: flex;padding: 8px;justify-content: center;align-items: center;gap: 8px;flex-shrink: 0;color: #FFF;border-radius: 4px;
//      background: #2F5596;width: 260px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;line-height: normal;">See Full Leave Report Online</div>
//  </div>
//  <div style="display: flex;align-items: center;margin-bottom: 88px;">
//      <img src="" style="height: 48px;" alt="Site Icon">
//      <div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;margin-left: 4px;">Hochhuth Consulting GmbH</div>
//  </div>`
// let allEmpPresent=false;
//         Object?.keys(nameidTotals)?.length != 0 ? allEmpPresent=false:allEmpPresent=true;

//     if(allEmpPresent){
//      return structure+=CompleteEmployeeBody+`</div></div></div></div>`
//     }else {
//       return structure+=tableBody+`<div style="margin-bottom: 88px;">
//       <div style="display: flex;padding: 8px;justify-content: center;align-items: center;gap: 8px;flex-shrink: 0;color: #FFF;border-radius: 4px;
//       background: #2F5596;width: 260px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;line-height: normal;"><a  style="text-decoration: none;color: white;" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx">See Full Leave Report Online</a></div>
//   </div>
//   <div style="display: flex;align-items: center;margin-bottom: 88px;">
//       <img src="https://www.hochhuth-consulting.de/images/logo.png" style="height: 48px;" alt="Site Icon">
//       <div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;margin-left: 4px;">Hochhuth Consulting GmbH</div>
//   </div></div></div></div></div>`
//     }
      
  
// }

  return (
    
    <div style={{width:'900px',margin:'0px 32px'}}>
    <div dangerouslySetInnerHTML={{ __html: returnEmailHtml() }}></div>
    </div>
   
    
    
  );
};
export default EmailComponenet;