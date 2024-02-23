import * as React from "react";
import { useState, useEffect } from "react";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { Web } from "sp-pnp-js";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import { BorderBottomSharp } from "@material-ui/icons";
import 'core-js/es/object/values';
import moment from "moment";

let matchedData: any;
let days_difference: any;
interface NameIdData {
  [key: number]: {
    NameId: any;
    TotalLeaved: any;
  };
}
let message: any;
let count: any = 1;
let counts = 0;
let membersWorkfromHome = []
let Juniordevavailabel = 0;
let smalsusleadavailabel = 0;
let hhhhteamavailabel = 0;
let seniordevavailabel = 0;
let qateamavailabel = 0;
let designteamavailabel = 0;
let Allteamoforganization = 0;
const EmailComponenet = (props: any) => {
  const [AllTaskuser, setAllTaskuser] = React.useState([]);
  const [leaveData, setleaveData] = React.useState([]);
  const [nameidTotals, setNameidTotals] = useState<NameIdData>({});
  const loadleave = () => {
    const web = new Web(props.Listdata.siteUrl);
    web.lists.getById(props.Listdata.SmalsusLeaveCalendar).items.select(
      "RecurrenceData,Duration,Author/Title,Editor/Title,NameId,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,HalfDay,HalfDayTwo,Event_x002d_Type"
    ).expand("Author,Editor,Employee").top(500).getAll()
      .then((results: any) => {
        setleaveData(results);
      })
      .catch((err: any) => {
        console.log(err);
      })
    getTaskUser()
  }


  React.useEffect(() => {
    loadleave()
    if (Object.keys(nameidTotals).length !== 0) {
      SendEmail()
    } else if (hhhhteamavailabel > 0) {
      SendEmail()
    }

  }, [count]);


  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB");

  const SendEmail = () => {
    let sp = spfi().using(spSPFx(props.Context));
    let totalteammemberonleave = AllTaskuser?.length - Object?.keys(nameidTotals)?.length;
    props?.data.filter((items: any) => {
      if (items?.eventType == 'Work From Home') {
        membersWorkfromHome.push(items)
      }
    })
    let SendEmailMessage =
      sp.utility
        .sendEmail({
          Body: BindHtmlBody(),
          Subject: "HHHH - Team Attendance " + formattedDate + " " + Allteamoforganization + " available - " + (Object?.keys(nameidTotals)?.length - membersWorkfromHome?.length) + " on leave",
          To: ["deepak@hochhuth-consulting.de","stefan.hochhuth@hochhuth-consulting.de","robert.ungethuem@hochhuth-consulting.de","prashant.kumar@hochhuth-consulting.de","anubhav.shukla@hochhuth-consulting.de"],
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
        const mydata = Data.filter((item) => item.UserGroupId != null && item?.UserGroupId != 131 && item?.UserGroupId != 147 && item.AssingedToUserId != 9)
        setAllTaskuser(mydata);
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };

  const BindHtmlBody = () => {
    let body = document.getElementById("htmlMailBodyemail");
    console.log(body.innerHTML);
    return "<style>p>br {display: none;}</style>" + body.innerHTML;
  };
  let arr: any = [];
  // Count all the leave of the user
  let year = new Date().getFullYear();
  let yeardata = leaveData.filter((item: any) => item?.EventDate?.substring(0, 4) === `${year}`)

  const calculateTotalWorkingDays = (matchedData: any) => {
    const today = new Date();

    return matchedData.reduce((total: any, item: any) => {
      const endDate = new Date(item.EndDate);
      const eventDate = new Date(item.EventDate);
      const timezoneOffset = endDate.getTimezoneOffset();
      const timezoneOffsetInHours = timezoneOffset / 60;
      const adjustedEndDate = new Date(endDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000);
      const adjustedEventDate: any = new Date(eventDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000);

      // Filter data based on the event date being in the current year
      if (adjustedEventDate.getFullYear() === today.getFullYear()) {
        const adjustedEndDateToToday = today < adjustedEndDate ? today : adjustedEndDate;

        // Set hours to 0 for accurate date comparisons
        adjustedEndDateToToday.setHours(0);
        let workingDays = 0;
        let currentDate = new Date(adjustedEventDate);
        currentDate.setHours(0);

        while (currentDate <= adjustedEndDateToToday) {
          const dayOfWeek = currentDate.getDay();

          if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isWeekend(currentDate, adjustedEndDateToToday)) {
            // Exclude Sunday (0) and Saturday (6), and the event date and end date if they're both on a weekend
            if (item?.Event_x002d_Type !== "Work From Home") {
              if (
                (item?.HalfDay === true) ||
                (item?.HalfDayTwo === true)
              ) {
                workingDays += 0.5; // Consider half-day
              } else {
                workingDays++;
              }
            }
          }

          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }

        return total + workingDays;
      }

      return total;
    }, 0);
  };






  // Function to check if a date falls on a weekend
  const isWeekend = (startDate: any, endDate: any) => {
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();

    return (startDay === 0 || startDay === 6) && (endDay === 0 || endDay === 6);
  };




  React.useEffect(() => {
    // Assuming 'yeardata' is available from somewhere (prop, state, or elsewhere)
    // const yeardata = ...;

    const userId = props.data.filter((item: any) => item?.NameId != null);

    const nameidData: any = {};

    userId.forEach((username: any) => {
      const matchedData: any = yeardata.filter((member) => member.Employee?.Id === username.NameId);

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
  {
    data?.map((item: any, index: any) => {
      let condate = new Date(item.end);
      let updatereason = item?.shortD?.split('-');
      if (updatereason.length > 2) {
        // Getting the text after the last dash
        item.reason = updatereason.slice(-1)[0].trim();
      }
      // item.enddate = moment(condate, 'MM/DD/YYYY').format('DD/MM/YYYY');
      item.enddate = moment(condate, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').format('DD/MM/YYYY');

      // For the Team of leave
      item.Juniordev = AllTaskuser.filter((Junior: any) => (Junior?.UserGroupId === 8 && Junior?.AssingedToUserId === item?.NameId))
      item.smalsuslead = AllTaskuser.filter((smallead: any) => (smallead?.UserGroupId === 216 && smallead?.AssingedToUserId === item?.NameId))
      item.hhhhteam = AllTaskuser.filter((hhhteam: any) => (hhhteam.UserGroupId === 7 && hhhteam?.AssingedToUserId === item?.NameId))
      item.seniordev = AllTaskuser.filter((seniodev: any) => (seniodev?.UserGroupId === 9 && seniodev?.AssingedToUserId === item?.NameId))
      item.qateam = AllTaskuser.filter((qaleave: any) => (qaleave?.UserGroupId === 11 && qaleave?.AssingedToUserId === item?.NameId))
      item.designteam = AllTaskuser.filter((designt: any) => (designt?.UserGroupId === 10 && designt?.AssingedToUserId === item?.NameId))
     
    
      {
        Object.keys(nameidTotals).map((key) => {
          const data = nameidTotals[parseInt(key)];
          if (data.NameId === item.NameId) {
            item.TotalLeave = data.TotalLeaved;

          }
        })
      }

    }

    )
  }

  const juniortotal = AllTaskuser.filter((Junior: any) => (Junior?.UserGroupId === 8));
  const smalleadtotal = AllTaskuser.filter((smallead: any) => (smallead?.UserGroupId === 216));
  // const hhhteamtotal =  AllTaskuser.filter((hhhteam:any)=>(hhhteam?.UserGroupId===7 && hhhteam?.AssingedToUserId != 9));
  const seniodevtotal = AllTaskuser.filter((seniodev: any) => (seniodev?.UserGroupId === 9));
  const qaleavetotal = AllTaskuser.filter((qaleave: any) => (qaleave?.UserGroupId === 11));
  const designttotal = AllTaskuser.filter((designt: any) => (designt?.UserGroupId === 10));
 



  Allteamoforganization = juniortotal.length + smalleadtotal.length + seniodevtotal.length + qaleavetotal.length + designttotal.length + 2;



const SPfxtotal = AllTaskuser.filter((Junior: any) => (Junior?.UserGroupId != 10 && (Junior?.Group === "SPFx" || Junior?.Team === "SPFx")));
  const Mobiletotal = AllTaskuser.filter((Junior: any) => (Junior?.UserGroupId === 388  && Junior?.Team === "Mobile" ));
  const Managementtotal = AllTaskuser.filter((smallead: any) => (smallead?.UserGroupId === 216 && smallead?.Team === "Management"));
  // const hhhteamtotal =  AllTaskuser.filter((hhhteam:any)=>(hhhteam?.UserGroupId===7 && hhhteam?.AssingedToUserId != 9));
  const Sharewebtotal = AllTaskuser.filter((seniodev: any) => ( seniodev?.Group == "Shareweb" && seniodev?.Team === "Shareweb"));
  const qatotal = AllTaskuser.filter((qaleave: any) => (qaleave?.Group == "QA" && qaleave?.Team === "QA"));
  const designtotal = AllTaskuser.filter((designt: any) => (designt?.Group == "Design" && designt?.Team === "Design"));
  const HRtotal = AllTaskuser.filter((designt: any) => (designt?.Group == "HR" && designt?.Team === "HR"));
  const JTMTotal = AllTaskuser.filter((Junior) => ( Junior?.Team === "Junior Task Manager"))

  const SPFxTrainee = AllTaskuser.filter((Junior) => (Junior?.UserGroupId === 10 && (Junior?.Team === "SPFx" || Junior?.Team === "SPFX")))
  const ManagementTrainee = AllTaskuser.filter((Junior) => (Junior?.UserGroupId === 10 && Junior?.Team === "Management"))
  const MobileTrainee = AllTaskuser.filter((Junior) => (Junior?.UserGroupId === 10 && Junior?.Team === "Mobile"))
  const SharewebTrainee = AllTaskuser.filter((Junior) => (Junior?.UserGroupId === 10 && Junior?.Team === "Shareweb"))
  const DesignTrainee = AllTaskuser.filter((Junior) => (Junior?.UserGroupId === 10 && Junior?.Team === "Design"))
  const QATrainee = AllTaskuser.filter((Junior) => (Junior?.UserGroupId === 10 && Junior?.Team === "QA"))
  const HRTrainee = AllTaskuser.filter((Junior) => (Junior?.UserGroupId === 10 && Junior?.Team === "HR"))
  const JTMTrainee = AllTaskuser.filter((Junior) => (Junior?.UserGroupId === 10 && Junior?.Team === "Junior Task Manager"))

  const SPfxtotalLeave = SPfxtotal.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const MobiletotalLeave =  Mobiletotal.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const ManagementtotalLeave = Managementtotal.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  // const hhhteamtotal =  AllTaskuser.filter((hhhteam:any)=>(hhhteam?.UserGroupId===7 && hhhteam?.AssingedToUserId != 9));
  const SharewebtotalLeave = Sharewebtotal.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const qatotalLeave = qatotal.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const designtotalLeave = designtotal.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const HRtotalLeave = HRtotal.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const JTMTotalLeave = JTMTotal.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});

  const SPFxTraineeLeave =  SPFxTrainee.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const ManagementTraineeLeave =  ManagementTrainee.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const MobileTraineeLeave =  MobileTrainee.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const SharewebTraineeLeave =  SharewebTrainee.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const DesignTraineeLeave =  DesignTrainee.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const QATraineeLeave =  QATrainee.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const HRTraineeLeave =  HRTrainee.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});
  const JTMTraineeLeave =  JTMTrainee.filter((Junior: any) => {return data.some((item: any) => item.NameId === Junior?.AssingedToUserId);});

  // const JTMTrainee = AllTaskuser.filter((Junior) => (Junior?.UserGroupId === 10 && Junior?.Team === "Junior Task Manager"))


  const juniordevleave = data.filter((item: any) => item.Juniordev.length != 0 && item.eventType != 'Work From Home');
  Juniordevavailabel = juniortotal.length - juniordevleave.length;
  const smalleadleave = data.filter((item: any) => item.smalsuslead.length != 0 && item.eventType != 'Work From Home');
  smalsusleadavailabel = smalleadtotal.length - smalleadleave.length;
  // const hhhhteamleave = data.filter((item:any)=> item.hhhhteam.length != 0);
  // hhhhteamavailabel = hhhteamtotal.length - hhhhteamleave.length;
  const seniordevleave = data.filter((item: any) => item.seniordev.length != 0 && item.eventType != 'Work From Home');
  seniordevavailabel = seniodevtotal.length - seniordevleave.length;
  const qateamleave = data.filter((item: any) => item.qateam.length != 0 && item.eventType != 'Work From Home');
  qateamavailabel = qaleavetotal.length - qateamleave.length;
  const designteamleave = data.filter((item: any) => item.designteam.length != 0 && item.eventType != 'Work From Home');
  designteamavailabel = designttotal.length - designteamleave.length;
  // // <div style="margin-bottom: 40px;font-size: 32px;font-weight: 600;line-height: 40px;color: #2F5596;font-family: Segoe UI;">

  //     ${Object?.keys(nameidTotals)?.length === 0 ? `The ${formattedDate} is a great Day! All ${Allteamoforganization} are in Office today!` : `${formattedDate}: ${(Object?.keys(nameidTotals)?.length - WorkfromHomeEmp?.length)} are on leave, ${Allteamoforganization - (Object?.keys(nameidTotals)?.length - WorkfromHomeEmp?.length)} are working`}
  // </div>

  const AllStaff = SPfxtotal?.length +Mobiletotal?.length +Managementtotal?.length +Sharewebtotal?.length +qatotal?.length +designtotal?.length +HRtotal?.length +JTMTotal?.length  ;
  const AllStaffLeave = SPfxtotalLeave?.length +MobiletotalLeave?.length +ManagementtotalLeave?.length +SharewebtotalLeave?.length +qatotalLeave?.length +designtotalLeave?.length +HRtotalLeave?.length +JTMTotalLeave?.length  ;
  const AllTrainees = SPFxTrainee?.length +ManagementTrainee?.length +MobileTrainee?.length +SharewebTrainee?.length +DesignTrainee?.length +QATrainee?.length +HRTrainee?.length +JTMTrainee?.length  ;
  const AllTraineesLeave = SPFxTraineeLeave?.length +ManagementTraineeLeave?.length +MobileTraineeLeave?.length +SharewebTraineeLeave?.length +DesignTraineeLeave?.length +QATraineeLeave?.length +JTMTraineeLeave?.length +HRTraineeLeave?.length  ;
  const CompleteTeam = AllStaff + AllTrainees;
  const returnEmailHtml = (): any => {
    let WorkfromHomeEmp: any = []
    props?.data.filter((items: any) => {
      if (items?.eventType == 'Work From Home') {
        WorkfromHomeEmp.push(items)
      }
    })
    let structure = `    
    <div id="htmlMailBodyemail" style=" display:none;">
    <table width="100%" bgcolor="#FAFAFA" style="background-color:#FAFAFA;margin:-18px -10px;" align="center">
    <tr>
    <td width="100%">
        <table width="900px" align="center" bgcolor="#fff" style="width:900px;padding:0px 32px;background-color:#fff;">
        <tr><td width="100%">
            <div style="padding-top: 56px;" width="100%">
              <table style="height: 50px;border-collapse: collapse;" border="0" align="left">
                <tr>
                  <td width="48px" height="48px"><img width="100%" height="100%" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png" style="width: 48px;height: 48px;border-radius: 50%;" alt="Site Icon"></td>
                  <td style="margin-left:4px;"><div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;">Attendance Report</div></td>
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
            
        `;

    let tableBody = `
    <div>
    <table style="height: 88px;border-collapse: collapse;">
        <tbody><tr>
            <td width="70px" height="48px" style="background: #2F5596;color: #ffffff;width:70px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Team (${CompleteTeam})</td>
            <td width="100px" height="48px" style="background: #2F5596;color: #ffffff;width:100px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Available (${CompleteTeam-(Object?.keys(nameidTotals)?.length - membersWorkfromHome?.length)})</td>
            <td width="100px" height="48px" style="background: #2F5596;color: #ffffff;width:100px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">On Leave (${(Object?.keys(nameidTotals)?.length - membersWorkfromHome?.length)})</td>
            </tr>
            <tr>
            <td width="70px" height="48px" style="background: #2F5596;color: #ffffff;width:70px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Staff</td>
             <td width="100px" height="48px" style="background: #ffff;color: #008314;width:100px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">${AllStaff}</td>
              <td width="100px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:100px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">${AllStaffLeave}</td>
            </tr>
            <tr >
            <td width="70px" height="48px" style="background: #2F5596;color: #ffffff;width:70px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Trainee</td>
               <td width="100px" height="48px" style="background: #ffff;color: #008314;width:100px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">${AllTrainees}</td>
                 <td width="100px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:100px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">${AllTraineesLeave}</td>
            
                 <tr><td>&nbsp;</td></tr></tbody></table>
    </div>
        <div>
        <table style="height: 88px;border-collapse: collapse;">
        <tbody>
           
           <tr>
            <td width="190px" height="48px" style="background: #2F5596;color: #ffffff;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Team </td>
            <td width="190px" height="48px" style="background: #2F5596;color: #ffffff;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Management (${Managementtotal?.length + ManagementTrainee?.length})</td>
            <td width="185px" height="48px" style="background: #2F5596;color: #ffffff;width:185px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">SPFX (${SPfxtotal?.length + SPFxTrainee?.length})</td>
            <td width="185px" height="48px" style="background: #2F5596;color: #ffffff;width:185px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Shareweb (${Sharewebtotal?.length + SharewebTrainee?.length})</td>
            <td width="185px" height="48px" style="background: #2F5596;color: #ffffff;width:185px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Mobile (${Mobiletotal?.length + MobileTrainee?.length})</td>
            <td width="185px" height="48px" style="background: #2F5596;color: #ffffff;width:185px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Design (${designtotal?.length + DesignTrainee?.length})</td>
            <td width="185px" height="48px" style="background: #2F5596;color: #ffffff;width:185px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">QA (${qatotal?.length + QATrainee?.length})</td>
            <td width="185px" height="48px" style="background: #2F5596;color: #ffffff;width:185px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">HR (${HRtotal?.length + HRTrainee?.length})</td>
            <td width="185px" height="48px" style="background: #2F5596;color: #ffffff;width:185px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">JTM (${JTMTotal?.length + JTMTrainee.length})</td>
            </tr>
            <tr>
            <td width="190px" height="48px" style="background: #2F5596;color: #ffffff;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Staff</td>
             <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${Managementtotal?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${ManagementtotalLeave?.length}</td>
               <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${SPfxtotal?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${SPfxtotalLeave?.length}</td>
               <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${Sharewebtotal?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${SharewebtotalLeave?.length}</td>
              <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${Mobiletotal?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${MobiletotalLeave?.length}</td>
              <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${designtotal?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${designtotalLeave?.length}</td>
              <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${qatotal?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${qatotalLeave?.length}</td>
              <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${HRtotal?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${HRtotalLeave?.length}</td>
              <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${JTMTotal?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${JTMTotalLeave?.length}</td>
            </tr>
            <tr >
            <td width="190px" height="48px" style="background: #2F5596;color: #ffffff;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" colspan="2">Trainee</td>
               <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${ManagementTrainee?.length}</td>
                 <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${ManagementTraineeLeave?.length}</td>
                  <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${SPFxTrainee?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${SPFxTraineeLeave?.length}</td>
               <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${SharewebTrainee?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${SharewebTraineeLeave?.length}</td>
               <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${MobileTrainee?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${MobileTraineeLeave?.length}</td>
               <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${DesignTrainee?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${DesignTraineeLeave?.length}</td>
               <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${QATrainee?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${QATraineeLeave?.length}</td>
               <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${HRTrainee?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${HRTraineeLeave?.length}</td>
               <td width="190px" height="48px" style="background: #ffff;color: #008314;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">${JTMTrainee?.length}</td>
              <td width="190px" height="48px" style="background: #FAFAFA;color: #AC1D1D;width:190px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE; text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;" >${JTMTraineeLeave?.length}</td>
            
            </tr>
            <tr><td>&nbsp;</td></tr>
          
        </table>
    </div>
    <div width="100%">
    <table style="height: 32px;border-collapse: collapse;" border="0" width="100%" height="32px">
      <tr>
        <td width="100%" height="32px">&nbsp;</td>
      </tr>
    </table>
  </div>
<div>
    <table style="border-collapse: collapse;">
        <tr height="56px">
            <td width="40px" height="48px" style="color: #333;height:48px;width:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">No.</td>
            <td width="136px" height="48px" style="color: #333;height:48px;width:136px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE;text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Name</td>
            <td width="112px" height="48px" style="color: #333;height:48px;width:112px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE;text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Attendance</td>
            <td width="184px" height="48px" style="color: #333;height:48px;width:104px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE;text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Reason</td>
            <td width="104px" height="48px" style="color: #333;height:48px;width:144px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE;text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Expected leave end</td>
            <td width="140px" height="48px" style="color: #333;height:48px;width:140px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE;text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Team</td>
            <td width="104px" height="48px" style="color: #333;height:48px;width:160px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-top: 1px solid #EEE;text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;background: #FAFAFA;">Total leave this year</td>
        </tr>
       `
    let innerTableRow: any = '';
    data?.map((item: any, index: any) => {
      innerTableRow +=
        `<tr>
             <td width="40px" height="40px" style="color: #333;height:40px;width:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;text-align: center;border-left: 1px solid #EEE;padding: 0px 8px;">${index + 1}</td>
             <td width="136px" height="40px" style="color: #333;height:40px;width:136px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;text-align: center;padding: 0px 8px;text-decoration-line: underline;color: #2F5596;"><a style="color: #2F5596;" href='${props.Listdata.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${item?.NameId}&Name=${item?.Name}'> ${item?.Name}</a></td>
             <td width="112px" height="40px" style="color: #333;height:40px;width:112px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;text-align: center;padding: 0px 8px;${item.eventType === "Un-Planned" ? "background: #FFEAEA;color: #A10101;" : "background: #FFF6E8;color: #AA6700;"}"> ${item.eventType}</td>
             <td width="104px" height="40px" style="color: #333;height:40px;width:104px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;text-align: center;padding: 0px 8px;">${item?.reason}</td>
             <td width="144px" height="40px" style="color: #333;height:40px;width:144px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;text-align: center;padding: 0px 8px;text-decoration-line: underline;color: #2F5596;"><a style="color: #2F5596;" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx">
                 <span style="color: #2F5596;">${item?.enddate}</span></td>
             <td width="140px" height="40px" style="color: #333;height:40px;width:140px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;text-align: center;padding: 0px 8px;" >${item.Designation}</td>
             <td width="160px" height="40px" style="color: #333;height:40px;width:160px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 400;border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;text-align: center;padding: 0px 8px;">${item?.TotalLeave}</td>
         </tr>`

    })

    tableBody += innerTableRow + ` </table></div>`

    let CompleteEmployeeBody = ` 
    <div width="100%">
              <table style="height: 48px;border-collapse: collapse;" border="0" width="100%" height="48px">
                <tr>
                  <td width="100%" height="48px">&nbsp;</td>
                </tr>
              </table>
            </div>
    <div width="264" height="264px" style="width: 264px;height: 264px;flex-shrink: 0;border-radius: 264px;background: #EEF4FF;margin-bottom: 40px;padding: 20px;display: flex; align-items: center;justify-content: space-around; margin: 0 auto;">
    <div width="200px" height="200px" style="width: 200px;height: 200px;flex-shrink: 0;">
    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/CalendarImages/image%2048.png">
    </div>
</div>
<div style="margin-bottom: 88px;">
    <div width="260px" height="40px" style="display: flex;justify-content: center;align-items: center;gap: 8px;flex-shrink: 0;color: #FFF;border-radius: 4px;
    background: #2F5596;width: 260px;height:40px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;line-height: normal;">See Full Leave Report Online</div>
     
    </div>
<div style="display: flex;align-items: center;padding-bottom: 56px;">
    <img width="48px" height="48px" src="https://www.hochhuth-consulting.de/images/logo.png" style="height: 48px;" alt="Site Icon">
    <div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;">Hochhuth Consulting GmbH</div>
</div>`

    let allEmpPresent = false;
    Object?.keys(nameidTotals)?.length != 0 ? (allEmpPresent = false) : (allEmpPresent = true);

    if (allEmpPresent) {
      structure += CompleteEmployeeBody + `</div></div></div></div></div>`;
    } else {
      structure += tableBody + `
            <div width="100%">
              <table style="height: 48px;border-collapse: collapse;" border="0" width="100%" height="48px">
                <tr>
                  <td width="100%" height="48px">&nbsp;</td>
                </tr>
              </table>
            </div>
            <div width="100%">
              <table align="left">
                <tr>
                  <td width="260px" height="40px" align="center" style="background: #2F5596;display: flex;justify-content: center;align-items: center;gap: 8px;flex-shrink: 0;border-radius: 4px;
                    font-family: Segoe UI;width:260px;height:40px;font-size: 14px;font-style: normal;font-weight: 600;line-height: normal;">
                    <a width="260px" height="40px" style="color:#fff;text-decoration: none;" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx">
                         See Full Leave Report Online
                    </a>
                  </td>
                </tr>
              </table>
            </div>
            <div width="100%">
              <table style="height: 88px;border-collapse: collapse;" border="0" width="100%" height="88px">
                <tr>
                  <td width="100%" height="88px">&nbsp;</td>
                </tr>
              </table>
            </div>
            <div width="100%">
                <table style="height: 50px;border-collapse: collapse;" border="0" align="left">
                  <tr>
                    <td width="48px" height="48px"><img src="https://www.hochhuth-consulting.de/images/logo.png" width="100%" height="100%" style="width: 48px;height: 48px;" alt="Site Icon"></td>
                    <td style="margin-left:4px;"><div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;margin-left: 4px;">Hochhuth Consulting GmbH</div></td>
                  </tr>
                </table>
            </div>
            <div width="100%">
              <table style="height: 56px;border-collapse: collapse;" border="0" width="100%" height="88px">
                <tr>
                  <td width="100%" height="56px">&nbsp;</td>
                </tr>
              </table>
            </div>
        </div></div></div></td></tr></table></td></tr></table></div>`;
    }

    return structure;
  };




  return (

    <div style={{ width: '900px', margin: '0px 32px' }}>
      <div dangerouslySetInnerHTML={{ __html: returnEmailHtml() }}>

      </div>
    </div>



  );
};
export default EmailComponenet;

