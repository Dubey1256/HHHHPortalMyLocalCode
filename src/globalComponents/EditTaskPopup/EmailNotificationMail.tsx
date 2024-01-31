import * as React from 'react';
import {useEffect } from 'react';
import "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';


const EmailNotificationMail = (props: any) => {
  useEffect(() => {
    sendEmail(props.emailStatus);
  }, [])
  const sendEmail = async (send: any) => {
    let mention_To: any = [];
    mention_To.push(props?.items.TaskCreatorData[0].Email);
    if (mention_To.length > 0) {
      let EmailProps = {
        To: mention_To,
        Subject: `[${props.ValueStatu == '90'?'Your Task has been completed':''} ${props.items.TaskId} -  ${props.items.Title}]`,
        Body: props.items.Title
      }
      console.log(EmailProps);
      await SendEmailFinal(EmailProps);
    }
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
      <div id='htmlMailBodyEmail' style={{ display: 'none' }}>
        <div style={{ backgroundColor: "#FAFAFA" }}>
          <div style={{ width: "900px", backgroundColor: "#fff", padding: "0px 32px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "56px 0px" }}>
              <img src={props?.items?.siteIcon} style={{ width: "48px", height: "48px", borderRadius: "50%" }}></img>
                <div style={{ color: "var(--black, #333)", textAlign: "center", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", marginLeft: "4px" }}></div>
            </div>
            <div style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
              Hi {props?.items.TaskCreatorData[0].Title},
            </div>
            <div style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
              Task created from your end has been marked to {props?.statusValue}%. Please follow the below link to review it.
            </div>
            <div style={{ marginBottom: "32px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
              You can track your Task Status here:
            </div>
            <div style={{ marginBottom: "40px" }}>
              <div style={{
                display: "flex", padding: "8px", justifyContent: "center", alignItems: 'center', gap: "8px", flexShrink: "0", color: "#FFF", borderRadius: "4px",
                background: " #2F5596", width: "260px", height: "40px", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", lineHeight: "normal"
              }}> <a  style={{ color: "#fff", textDecorationLine: "underline" }} data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + props?.items?.Id + '&Site=' + props?.items?.siteType}
              >Track the Task Status</a></div>
            </div>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "56px" }}>
              <div style={{ color: "var(--black, #333)", textAlign: "center", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", marginLeft: "4px" }}>Thanks</div>
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