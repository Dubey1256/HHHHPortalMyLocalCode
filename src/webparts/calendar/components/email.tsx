import * as React from "react";
import { useState, useEffect } from "react";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { Web } from "sp-pnp-js";
// import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
// import { Web } from 'sp-pnp-js';
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import { BorderBottomSharp } from "@material-ui/icons";
import { sendEmail } from "../../../globalComponents/globalCommon";
import 'core-js/es/object/values';

let matchedData:any;
let days_difference:any;
interface NameIdData {
  [key: number]: {
    NameId: any;
    TotalLeaved: any;
  };
}

let count:any=1;
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
            "RecurrenceData,Duration,Author/Title,Editor/Title,Name,NameId,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type"
          )
          .expand("Author,Editor")
          .top(500)
          .getAll();

          setleaveData(results);
  
          getTaskUser()
}


 React.useEffect(() => {
    //void getSPCurrentTimeOffset();
    // P_UP();
    loadleave()
    if(Object.keys(nameidTotals).length !== 0){
    SendEmail()

    }    
    
  }, [count]);

  // const P_UP =()=>{
  //   props.data?.map((item:any)=>{
  //     if(item.eventType == "Un-Planned"){
  //       setRed(true);
  //       SendEmail();
  //     }      else{
  //       setRed(false);
  //       SendEmail();
  //     }
  //   })
  // }
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB");

  const SendEmail = () => {
    let sp = spfi().using(spSPFx(props.Context));
    let totalteammemberonleave=AllTaskuser?.length-Object?.keys(nameidTotals)?.length ;
       
    sp.utility
      .sendEmail({
        //Body of Email
        //   Body: this.BindHtmlBody(),
        Body: BindHtmlBody(),
        //Subject of Email
        //   Subject: emailprops.Subject,
        Subject: "HHHH - Team Attendance- "+formattedDate +"-"+ totalteammemberonleave+" - "+Object?.keys(nameidTotals)?.length ,
        //Array of string for To of Email
        //   To: emailprops.To,
        To: ["abhishek.tiwari@hochhuth-consulting.de","ranu.trivedi@hochhuth-consulting.de"],
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

        setAllTaskuser(Data);
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
  let yeardata = leaveData.filter((item) =>item.EventDate.substring(0, 4) === `${year}`)
 




// For Calculate all the day of leave


// const calculateTotalDays = (matchedData:any) => {
//   return matchedData.reduce((total:any, item:any) => {
//     const EndDate:any = new Date(item.EndDate);
//     const EventDate:any = new Date(item.EventDate);
//     const time_difference_ms = EndDate - EventDate;
//     const totalDays = Math.floor(time_difference_ms / (1000 * 60 * 60 * 24));
//     return total + totalDays;
//   }, 0);
// };

const calculateTotalDays = (matchedData:any) => {
  return matchedData.reduce((total:any, item:any) => {
    const EndDate:any = new Date(item.EndDate);
    const EventDate:any = new Date(item.EventDate);
    const time_difference_ms = EndDate - EventDate;
    const totalDays = Math.ceil(time_difference_ms / (1000 * 60 * 60 * 24));

    // Consider the special case where the difference is less than or equal to 9 hours as one day.
    if (time_difference_ms <= 9 * 60 * 60 * 1000) {
      return total + 1;
    }

    return total + totalDays;
  }, 0);
};


React.useEffect(() => {
  // Assuming 'yeardata' is available from somewhere (prop, state, or elsewhere)
  // const yeardata = ...;

  const userId = props.data.filter((item:any) => item.NameId != null);

  const nameidData:any = {};

  userId.forEach((username:any) => {
    const matchedData:any = yeardata.filter((member) => member.NameId === username.NameId);

    if (matchedData.length !== 0) {
      
      const totalDays = calculateTotalDays(matchedData);
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
  item.enddate = condate.toLocaleDateString()
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


  return (
    
    <div>
      <div id="htmlMailBodyemail" style={{ display: "none" }}>
        <div style={{ marginTop: "2pt" }}>Hello sir,</div>
        <div style={{ marginTop: "2pt" }}>
          Below is the today's leave report.
        </div>
      

      <div>
      <table data-border="1" cellSpacing={0}>
          <thead>
            <tr style={{textAlign:"center", padding:"5px",background:"#c5d9f1"}}>
                <th style={{border:"1px solid #000"}} colSpan={8} >{formattedDate}</th>
            </tr>
            <tr style={{textAlign:"center", padding:"5px",background:"#fcd5b4"}}>
                
                <th style={{borderBottom:"1px solid #000"}}>HHHH Team</th>
                {/* <th style={{border:"1px solid #000",borderTop:"0px"}}>Designation</th> */}
                <th style={{borderBottom:"1px solid #000"}}>Smalsus Lead Team</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>Senior Developer Team</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>Junior Developer Team</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>Design Team</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>QA Team</th>

               
            </tr>
            {data?.map((item:any,index:any)=>{
                return(
                    <tr style={{textAlign:"center", padding:"5px",background:"#fff"}}>
                        
                        <td style={{borderBottom:"1px solid #000",borderTop:"0px"}}>{item?.hhhhteam != null?item?.hhhhteam.map((hhhte:any)=>{
                          return hhhte.Title;
                        }):""}</td>
                        <td style={{border:"1px solid #000",borderTop:"0px"}}>{item?.smalsuslead != (null || undefined)?item?.smalsuslead.map((smalslead:any)=>{
                          return smalslead.Title;
                        }):""}</td>
                        <td style={{border:"1px solid #000",borderTop:"0px"}} >{item?.seniordev != (null || undefined)?item?.seniordev.map((seniord:any)=>{
                          return seniord.Title;}):""}</td>
                        <td style={{borderBottom:"1px solid #000",borderTop:"0px"}}>{item?.Juniordev != (null || undefined)?item?.Juniordev.map((juniiord:any)=>{
                          return juniiord.Title;
                        }):""}</td>
                        <td style={{border:"1px solid #000",borderTop:"0px"}}>{item?.designteam != (null || undefined)?item?.designteam.map((designord:any)=>{
                          return designord.Title;
                        }):""}</td>
                        <td style={{border:"1px solid #000",borderTop:"0px"}} >{item?.qateam != (null || undefined)?item?.qateam.map((qaord:any)=>{
                          return qaord.Title;
                        }):""}</td>
                        
                    </tr>
                )})}
                
          </thead>
        </table>
        <table data-border="1" cellSpacing={0}>
          <thead>
            <tr style={{textAlign:"center", padding:"5px",background:"#c5d9f1"}}>
                <th style={{border:"1px solid #000"}} colSpan={8} >{formattedDate}</th>
            </tr>
            <tr style={{textAlign:"center", padding:"5px",background:"#fcd5b4"}}>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>S No.</th>
                <th style={{borderBottom:"1px solid #000"}}>Name</th>
                {/* <th style={{border:"1px solid #000",borderTop:"0px"}}>Designation</th> */}
                <th style={{borderBottom:"1px solid #000"}}>Attendance</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>Reason</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>Expected leave end</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>Team</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}> Total leave this year</th>
 
               
            </tr>
            {data?.map((item:any,index:any)=>{
                return(
                    <tr style={{textAlign:"center", padding:"5px",background:"#fff"}}>
                        <td style={{border:"1px solid #000",borderTop:"0px"}}>
                            {index+1}
                        </td>
                        <td style={{borderBottom:"1px solid #000"}}>
                           <a href={`${props.Listdata.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${item.NameId}&Name=${item.Name}`}> {item.Name}</a>
                        </td>
                        {/* <td style={{border:"1px solid #000",borderTop:"0px"}}>
                            {item.Designation}
                        </td>
                        
                         */}
                          <td style={item.eventType=="Un-Planned"?{border:"1px solid #000",background:"#f00"}:{borderBottom:"1px solid #000",background:"#0ac55f"}}>
                          {item.eventType}
                      </td>
                      
                        
                        <td style={{border:"1px solid #000",borderTop:"0px"}} dangerouslySetInnerHTML={{__html: item.desc}}></td>
                        <td style={{border:"1px solid #000",borderTop:"0px"}} ><a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx">
                          <span>{item.enddate.toLocaleString() }</span>
                          {/* Today Date */}
                          </a></td>
                        <td style={{border:"1px solid #000",borderTop:"0px"}} dangerouslySetInnerHTML={{__html: item.Designation}}></td>
                        <td style={{border:"1px solid #000",borderTop:"0px"}} >{item?.TotalLeave}</td>
                        
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

