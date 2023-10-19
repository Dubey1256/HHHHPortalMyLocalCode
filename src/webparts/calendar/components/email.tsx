import * as React from "react";
import { useState, useEffect } from "react";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { Web } from "sp-pnp-js";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import { BorderBottomSharp } from "@material-ui/icons";
//import { sendEmail } from "../../../globalComponents/globalCommon";
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
let counts = 0;
let Juniordevavailabel=0;
let smalsusleadavailabel=0; 
let hhhhteamavailabel = 0;
let seniordevavailabel = 0;
let qateamavailabel = 0;
let designteamavailabel = 0;
const EmailComponenet = (props: any) => {
  const [AllTaskuser, setAllTaskuser] = React.useState([]);
  const [leaveData, setleaveData] = React.useState([]);
  const [nameidTotals, setNameidTotals] = useState<NameIdData>({});


 
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
        Subject: "HHHH - Team Attendance "+formattedDate+" "+totalteammemberonleave +" available - "+Object?.keys(nameidTotals)?.length+" on leave" ,
        To: ["abhishek.tiwari@hochhuth-consulting.de","prashant.kumar@hochhuth-consulting.de","ranu.trivedi@hochhuth-consulting.de"],
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
        const mydata = Data.filter((item)=>item.UserGroupId != null && item?.UserGroupId != 131 && item?.UserGroupId != 147)
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
  const userId = props.data.filter((item:any) => item?.NameId != null);

  const nameidData:any = {};

  userId.forEach((username:any) => {
    const matchedData:any = yeardata.filter((member) => member.Employee?.Id === username.NameId);

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

  const juniortotal =  AllTaskuser.filter((Junior:any)=>(Junior?.UserGroupId===8));
  const smalleadtotal =  AllTaskuser.filter((smallead:any)=>(smallead?.UserGroupId===216));
  const hhhteamtotal =  AllTaskuser.filter((hhhteam:any)=>(hhhteam?.UserGroupId===7 && hhhteam?.AssingedToUserId != 9));
  const seniodevtotal =  AllTaskuser.filter((seniodev:any)=>(seniodev?.UserGroupId===9));
  const qaleavetotal =  AllTaskuser.filter((qaleave:any)=>(qaleave?.UserGroupId===11));
  const designttotal =  AllTaskuser.filter((designt:any)=>(designt?.UserGroupId===10));



  
  const juniordevleave = data.filter((item:any)=> item.Juniordev.length != 0);
  Juniordevavailabel = juniortotal.length - juniordevleave.length;
  const smalleadleave = data.filter((item:any)=> item.smalsuslead.length != 0);
  smalsusleadavailabel = smalleadtotal.length - smalleadleave.length;
  const hhhhteamleave = data.filter((item:any)=> item.hhhhteam.length != 0);
  hhhhteamavailabel = hhhteamtotal.length - hhhhteamleave.length;
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
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>HHHH Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>Smalsus Lead Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>Senior Developer Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>Junior Developer Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>Design Team</th>
      <th style={{border: "1px solid #dddddd", textAlign: "center"}}>QA Team</th>
    </tr>
  </thead>
  <tbody>
    
    <tr style={{backgroundColor: "#f2f2f2"}}>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{hhhhteamavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{smalsusleadavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{seniordevavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{Juniordevavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{designteamavailabel}</td>
      <td style={{border: "1px solid #dddddd", textAlign: "center"}}>{qateamavailabel}</td>
    </tr>
  </tbody>
</table>
        <table data-border="1" cellSpacing={0} style={{width: "100%",marginTop: "10px"}}>
          <thead>
            <tr style={{textAlign:"center",background:"#fcd5b4"}}>
                <th style={{border:"1px solid #CCC",borderTop:"0px"}}>S No.</th>
                <th style={{borderBottom:"1px solid #CCC"}}>Name</th>
                {/* <th style={{border:"1px solid #CCC",borderTop:"0px"}}>Designation</th> */}
                <th style={{borderBottom:"1px solid #CCC"}}>Attendance</th>
                <th style={{border:"1px solid #CCC",borderTop:"0px"}}>Reason</th>
                <th style={{border:"1px solid #CCC",borderTop:"0px"}}>Expected leave End</th>
                <th style={{border:"1px solid #CCC",borderTop:"0px"}}>Team</th>
                <th style={{border:"1px solid #CCC",borderTop:"0px"}}> Total leave this year</th>
            </tr>
            {data?.map((item:any,index:any)=>{
                return(
                    <tr style={{textAlign:"center",background:"#fff"}}>
                        <td style={{border:"1px solid #CCC",borderTop:"0px"}}>
                            {index+1}
                        </td>
                        <td style={{borderBottom:"1px solid #CCC"}}>
                           <a href={`${props.Listdata.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${item?.NameId}&Name=${item?.Name}`}> {item?.Name}</a>
                        </td>
                          <td style={item.eventType=="Un-Planned"?{border:"1px solid #CCC",background:"#f00"}:{borderBottom:"1px solid #CCC",background:"#0ac55f"}}>
                          {item.eventType}
                      </td>
                        <td style={{border:"1px solid #CCC",borderTop:"0px"}} >{item?.shortD}</td>
                        <td style={{border:"1px solid #CCC",borderTop:"0px"}} ><a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx">
                          <span>{item.enddate.toLocaleString() }</span>
                          </a></td>
                        <td style={{border:"1px solid #CCC",borderTop:"0px"}} dangerouslySetInnerHTML={{__html: item.Designation}}></td>
                        <td style={{border:"1px solid #CCC",borderTop:"0px"}} >{item?.TotalLeave}</td>
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

