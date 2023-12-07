import * as React from 'react';
import { useState, useEffect } from 'react';
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';


const EmailNotificationMail = (props: any) => {
  useEffect(() => {
    sendEmail(props.emailStatus);
  }, [])
  console.log(props);

  const sendEmail = async (send: any) => {
    let mention_To: any = [];
    mention_To.push(props?.items.TaskCreatorData[0].Email);
    if (mention_To.length > 0) {
      let EmailProps = {
        To: mention_To,
        Subject: `[${props.ValueStatu == '90'?'Your Task has been completed':''} " ${props.items.TaskId} -  ${props.items.Title}]`,
        Body: props.items.Title
      }
      console.log(EmailProps);
      await SendEmailFinal(EmailProps);
    }
    //   props?.items.TaskApprovers.map((ApproverData: any) => {
    //     props?.AllTaskUser.forEach((val: any) => {
    //       if (ApproverData.Id == val?.AssingedToUserId) {
    //         let tempEmail = val?.Approver[0].Name;
    //         mention_To.push(tempEmail?.substring(18, tempEmail.length))
    //       }

    //     })

    // })



    const sendMailToTaskCreatore = () => {
      if (props?.items.Approvee != undefined) {
        props?.AllTaskUser.filter((ele: any) => {
          if (ele?.AssingedToUser?.Id == props?.items?.Approvee?.Id) {
            mention_To.push(ele?.Email);
          }
        })

      }
      else {
        mention_To.push(props?.items.TaskCreatorData[0].Email);
      }

    }
    const sendMailToTaskApprover = () => {
      if (props?.items.TaskApprovers != undefined && props?.items.TaskApprovers.length > 0) {
        props?.items.TaskApprovers.map((ApproverData: any) => {

          if (ApproverData.Company == undefined) {
            let tempEmail = ApproverData.Name;
            mention_To.push(tempEmail?.substring(18, tempEmail.length))
          }
          else {
            let tempEmail = ApproverData?.Email;
            mention_To.push(tempEmail)
          }

        })
      }
    }
    // let TaskStatus: any = ''
    // if (props.CreatedApprovalTask != undefined && props.CreatedApprovalTask == true) {
    //   TaskStatus = "Approval";
    //   sendMailToTaskApprover()
    // } else {
    //   if (props.ApprovalTaskStatus != undefined && props.ApprovalTaskStatus == true) {
    //     TaskStatus = "Approved";
    //     sendMailToTaskCreatore();
    //   } else {
    //     TaskStatus = "Rejected";
    //     sendMailToTaskCreatore();
    //   }
    // }

    // console.log(mention_To);

    // if (props?.IsEmailCategoryTask != undefined && props?.IsEmailCategoryTask == true) {
    //   TaskStatus = "Email-Notification (5%)";
    // }
    // if (props.statusUpdateMailSendStatus != undefined && props.statusUpdateMailSendStatus == true) {
    //   if (props?.IsEmailCategoryTask != undefined && props?.IsEmailCategoryTask == true) {
    //     TaskStatus = "Immediate, Email-Notification (5%)";
    //   } else {
    //     TaskStatus = "Immediate (5%)";
    //   }

    // }


  }
  const BindHtmlBody = () => {
    let body = document.getElementById('htmlMailBodyEmail')
    console.log(body.innerHTML);
    return "<style>p>br {display: none;}</style>" + body.innerHTML;
  }

  const SendEmailFinal = async (EmailProps: any) => {
    let sp = spfi().using(spSPFx(props.Context));
    await sp.utility.sendEmail({
      Body: BindHtmlBody(),
      Subject: EmailProps.Subject,
      To: EmailProps.To,
      AdditionalHeaders: {
        "content-type": "text/html"
      },
    }).then((data: any) => {
      console.log("Email Sent!");
      console.log(data);
      props.callBack();
    }).catch((err) => {
      console.log(err.message);
    });
  }
  const joinObjectValues = (arr: any) => {
    let val = '';
    arr.forEach((element: any) => {
      val += element.Title + ';'
    });
    return val;
  }
  return (
    <>

      {/* <div id='htmlMailBodyEmail' style={{ display: 'none' }}>
    <img className="imgWid29 pe-1 mb-1 " src={props?.items?.SiteIcon} />
        <div><h4>Your Task - {props?.items?.Title} has been completed </h4></div>
        <div className='emailContent'>
          <p>Hi {props?.items.TaskCreatorData[0].Title},</p>
          <p>Task created from your end has been marked to 90%. Please follow the below link to review it.</p><br></br>
            <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId="+ props?.items?.Id + '&Site=' + props?.items?.siteType}
                        ><button type='submit' className='btn btn-primary'>Track the Task Status</button></a><br></br>
          <p>if you want to see all your Tasks of all SharewebTasks click here <a href='https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskDashboard.aspx'>Task Dashboard</a></p>
          <p>Thanks</p>
        </div>
    </div> */}
      <div id='htmlMailBodyEmail' style={{ display: 'none' }}>
        <div style={{ backgroundColor: "#FAFAFA" }}>
          <div style={{ width: "900px", backgroundColor: "#fff", padding: "0px 32px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", margin: "56px 0px" }}>
              <img src={props?.items?.siteIcon} style={{ width: "48px", height: "48px", borderRadius: "50%;" }}></img>
                <div style={{ color: "var(--black, #333)", textAlign: "center", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", marginLeft: "4px" }}>- Task Management</div>
            </div>
            <div style={{ marginBottom: "40px", fontSize: "32px", fontWeight: "400", color: "#2F5596", fontFamily: "Segoe UI;"}}>
              Thank you for your Feedback!
            </div>
            <div style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
              Dear {props?.items.TaskCreatorData[0].Title},
            </div>
            <div style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
              Task created from your end has been marked to {props?.statusValue}%. Please follow the below link to review it.
            </div>
            <div style={{ marginBottom: "32px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
              You can track your Task Status here:
            </div>
            <div style={{ marginBottom: "40px;" }}>
              <div style={{
                display: "flex", padding: "8px", justifyContent: "center", alignItems: 'center', gap: "8px", flexShrink: "0", color: "#FFF", borderRadius: "4px",
                background: " #2F5596", width: "260px", height: "40px", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", lineHeight: "normal"
              }}> <a  style={{ color: "#2F5596", textDecorationLine: "underline" }} data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + props?.items?.Id + '&Site=' + props?.items?.siteType}
              ></a>Track the Task Status</div>
            </div>
            {/* <div style={{ marginBottom: " 24px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
              Task URL: <a  style={{ color: "#2F5596", textDecorationLine: "underline" }} data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + props?.items?.Id + '&Site=' + props?.items?.siteType}
              ></a>
            </div> */}
            <div style={{ marginBottom: "88px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
              Thanks,<br></br>
              Your HHHH Support Team
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "56px" }}>
              <img src="https://www.hochhuth-consulting.de/images/logo.png" style={{ width: "48px", height: "48px" }}></img>
              <div style={{ color: "var(--black, #333)", textAlign: "center", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", marginLeft: "4px" }}>Hochhuth Consulting GmbH</div>
            </div>
          </div>
         </div>
         

      </div>
    </>
  )
}
export default EmailNotificationMail;


//    (this.approvalcallback() }}  Context={this.props.Context}  currentUser={this.currentUser} items={this.state.Result})


//    we have to pass the callback function and context and currentUser and all items
//    allItems will be an object form .
//    currentUser will be an Array.
//    context will be an object
//    approvalcallback will be a Function .  