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
            "RecurrenceData,Duration,Author/Title,Editor/Title,NameId,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,HalfDay,Event_x002d_Type"
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
       
    sp.utility
      .sendEmail({
        Body: BindHtmlBody(),
        Subject: "HHHH - Team Attendance "+formattedDate+" "+Allteamoforganization +" available - "+Object?.keys(nameidTotals)?.length+" on leave" ,
        To: ["abhishek.tiwari@hochhuth-consulting.de","prashant.kumar@hochhuth-consulting.de","ranu.trivedi@hochhuth-consulting.de","jyoti.prasad@hochhuth-consulting.de"],
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
 



  // const calculateTotalWorkingDays = (matchedData: any) => {
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
        const adjustedEndDate = endDate < endOfYearDate ? endDate : endOfYearDate;
  
        const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  
        let workingDays = 0;
        let currentDate = new Date(eventDate);
  
        while (currentDate <= adjustedEndDate) {
          const dayOfWeek = currentDate.getDay();
  
          if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isWeekend(eventDate, adjustedEndDate)) {
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
  
  // Function to check if both the event date and end date fall on a weekend
  const isWeekend = (startDate:any, endDate:any) => {
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();
  
    return (startDay === 0 || startDay === 6) && (endDay === 0 || endDay === 6);
  };
  

// const calculateTotalWorkingDays = (matchedData:any) => {
//   return matchedData.reduce((total:any, item:any) => {
//     const EndDate:any = new Date(item.EndDate);
//     const EventDate:any = new Date(item.EventDate);
    
//     const time_difference_ms = EndDate - EventDate;
//     const totalDays = Math.ceil(time_difference_ms / (1000 * 60 * 60 * 24));

//     if (time_difference_ms <= 9 * 60 * 60 * 1000) {
//       return total + 1; // Consider difference less than or equal to 9 hours as one day
//     }

//     let workingDays = 0;

//     while (EventDate < EndDate) {
//       const dayOfWeek = EventDate.getDay();
//       if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
//         workingDays++;
//       }
//       EventDate.setDate(EventDate.getDate() + 1); // Move to the next day
//     }

//     // Adjust total days by subtracting weekends within the period
//     const totalDaysExcludingWeekends = totalDays - 2 * Math.floor(totalDays / 7); // Subtract two days for each full weekend

//     return total + Math.max(totalDaysExcludingWeekends, workingDays);
//   }, 0);
// };



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



  return (
    
    <div>
      <div id="htmlMailBodyemail" style={{ display: "none" }}>
        <div style={{ marginTop: "2pt" }}>
          Below is the today's leave report.
        </div>
      

      <div>
      <table style={{borderCollapse: "collapse", width: "100%"}}>
  <thead>
    <tr>
      <th colSpan={8} style={{backgroundColor: "#fcd5b4",borderBottom: "1px solid #CCC", textAlign: "center"}}>{formattedDate}</th>
    </tr>
    <tr>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>Smalsus Lead Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>Senior Developer Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>Junior Developer Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>Design Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>QA Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>HR</th>
    </tr>
  </thead>
  <tbody>
    
    <tr style={{backgroundColor: "#f2f2f2"}}>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{smalsusleadavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{seniordevavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{Juniordevavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{designteamavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{qateamavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{1}</td>
    </tr>
  </tbody>
</table>

<table data-border="1" cellSpacing={0} style={{width: "100%",marginTop: "10px"}}>
          <thead>
            
           
            <tr style={{textAlign:"center", padding:"8px",background:"#fcd5b4"}}>
                <th style={{border:"1px solid #CCC",padding:"8px",borderTop:"0px"}}>S No.</th>
                <th style={{borderBottom:"1px solid #CCC"}}>Name</th>
                {/* <th style={{border:"1px solid #CCC",borderTop:"0px"}}>Designation</th> */}
                <th style={{borderBottom:"1px solid #CCC",padding:"8px"}}>Attendance</th>
                <th style={{border:"1px solid #CCC",borderTop:"0px",padding:"8px"}}>Reason</th>
                <th style={{border:"1px solid #CCC",padding:"8px",borderTop:"0px"}}>Expected leave End</th>
                <th style={{border:"1px solid #CCC",padding:"8px",borderTop:"0px"}}>Team</th>
                <th style={{border:"1px solid #CCC",padding:"8px",borderTop:"0px"}}> Total leave this year</th>
 
               
            </tr>
            {data?.map((item:any,index:any)=>{
                return(
                    <tr style={{textAlign:"center", padding:"8px",background:"#fff"}}>
                        <td style={{border:"1px solid #CCC",borderTop:"0px"}}>
                            {index+1}
                        </td>
                        <td style={{borderBottom:"1px solid #CCC", padding:"8px"}}>
                           <a href={`${props.Listdata.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${item?.NameId}&Name=${item?.Name}`}> {item?.Name}</a>
                        </td>
                        {/* <td style={{border:"1px solid #CCC",borderTop:"0px"}}>
                            {item.Designation}
                        </td>
                        
                         */}
                          <td style={item.eventType=="Un-Planned"?{border:"1px solid #CCC",background:"#f00"}:{borderBottom:"1px solid #CCC",background:"#0ac55f", padding:"8px"}}>
                          {item.eventType}
                      </td>
                      
                        
                        <td style={{border:"1px solid #CCC",borderTop:"0px", padding:"8px"}} >{item?.shortD}</td>
                        <td style={{border:"1px solid #CCC",borderTop:"0px", padding:"8px"}} ><a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx">
                          <span>{item?.enddate}</span>
                          {/* Today Date */}
                          </a></td>
                        <td style={{border:"1px solid #CCC",borderTop:"0px", padding:"8px"}} dangerouslySetInnerHTML={{__html: item.Designation}}></td>
                        <td style={{border:"1px solid #CCC",borderTop:"0px", padding:"8px"}} >{item?.TotalLeave}</td>
                        
                    </tr>
                )
            })}
          </thead> 
        </table>
      </div>
      </div>
    </div>
    
    
    
  );
};
export default EmailComponenet;