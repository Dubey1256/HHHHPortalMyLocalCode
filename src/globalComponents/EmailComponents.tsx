import * as React from 'react';
import { useState, useEffect } from 'react';
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';


const EmailComponent = (props: any) => {
  useEffect(() => {
    sendEmail(props.emailStatus);
  }, [])
  console.log(props);

  const sendEmail = async (send: any) => {
    let mention_To: any = [];
    const sendMailToTaskCreatore = () => {
      if(props?.items.Approvee != undefined){
        props?.AllTaskUser.filter((ele:any)=>{
          if(ele?.AssingedToUser?.Id == props?.items?.Approvee?.Id){
            mention_To.push(ele?.Email);
          }
        })
       
      }
      else{
        mention_To.push(props?.items.TaskCreatorData[0].Email);
      }
     
    }
    const sendMailToTaskApprover = () => {
      if (props?.items.TaskApprovers != undefined && props?.items.TaskApprovers.length > 0) {
        props?.items.TaskApprovers.map((ApproverData: any) => {
          if(ApproverData.Company == undefined){
            let tempEmail = ApproverData.Name;
            mention_To.push(tempEmail?.substring(18, tempEmail.length))
          }
          else{
            let tempEmail = ApproverData?.Email;
            mention_To.push(tempEmail)
          }
          
        })
      }
    }
    let TaskStatus: any = ''
    if (props.CreatedApprovalTask != undefined && props.CreatedApprovalTask == true) {
      TaskStatus = "Approval";
      sendMailToTaskApprover()
    } else {
      if (props.ApprovalTaskStatus != undefined && props.ApprovalTaskStatus == true) {
        TaskStatus = "Approved";
        sendMailToTaskCreatore();
      } else {
        TaskStatus = "Rejected";
        sendMailToTaskCreatore();
      }
    }

    console.log(mention_To);

    if (props?.IsEmailCategoryTask != undefined && props?.IsEmailCategoryTask == true) {
      TaskStatus = "Email-Notification (5%)";
    }
    if (props.statusUpdateMailSendStatus != undefined && props.statusUpdateMailSendStatus == true) {
      if (props?.IsEmailCategoryTask != undefined && props?.IsEmailCategoryTask == true) {
        TaskStatus = "Immediate, Email-Notification (5%)";
      } else {
        TaskStatus = "Immediate (5%)";
      }

    }

    if (mention_To.length > 0) {
      let EmailProps = {
        To: mention_To,
        Subject: "[ " + props.items.siteType + " - " + TaskStatus + " ]" + props.items.Title,
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
        {props.statusUpdateMailSendStatus != undefined && props.statusUpdateMailSendStatus == false ?
         <div style={{ marginTop: "2pt" }}>
         {props?.items.TaskCreatorData[0].Title} has created a Task but {props?.CurrentUser[0]?.Title}  has sent you for approval. Please take your time and review:
         Please note that you still have 1 tasks left to approve.<br /> You can find all pending approval tasks on your task dashboard or the approval page.
         <p>
           <a href={`${props.items["siteUrl"]}/SitePages/TaskDashboard.aspx`} target="_blank" data-interception="off">Your Task Dashboard</a>
           <a style={{ marginLeft: "20px" }} href={`${props.items["siteUrl"]}/SitePages/TaskManagement.aspx?SmartfavoriteId=101&smartfavorite=All%20Approval%20Tasks`} target="_blank" data-interception="off">Your Approval Page</a>
         </p>
       </div>
          : <div style={{ marginTop: "11.25pt" }}>
            <div style={{ marginTop: "2pt" }}>Hi,</div>
            <div style={{ marginTop: "5pt" }}>your task has been Acknowledge by {props.CurrentUser[0]?.Title}, team will process it further.</div>
            <div style={{ marginTop: "5pt" }}>Have a nice day {props?.items.TaskCreatorData[0].Title}.</div>
            <div style={{ marginTop: "10pt" }}>
              <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props.items.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props.items["Title"]}</a><u></u><u></u>
            </div>
          </div>
        }
        {/* <div style={{ marginTop: "11.25pt" }}>
            <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props?.items?.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props?.items["Title"]}</a><u></u><u></u>
          </div> */}
        <table cellPadding="0" width="100%" style={{ width: "100.0%" }}>
          <tbody>
            <tr>
              <td width="70%" valign="top" style={{ width: '70.0%', padding: '.75pt .75pt .75pt .75pt' }}>
                <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: ".75pt .75pt .75pt .75pt" }}></td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Task Id:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Id"]}</span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Component:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p>{props.items["Component"] != null &&
                          props.items["Component"].length > 0 &&
                          <span style={{ fontSize: '10.0pt', color: 'black' }}>
                            {joinObjectValues(props.items["Component"])}
                          </span>
                        }
                          <span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Priority:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Priority"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Start Date:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["StartDate"] != null && props.items["StartDate"] != undefined ? Moment(props.items["StartDate"]).format("DD-MMMM-YYYY") : ""}</span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Completion Date:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["CompletedDate"] != null && props.items["CompletedDate"] != undefined ? Moment(props.items["CompletedDate"]).format("DD-MMMM-YYYY") : ""}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Due Date:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["DueDate"] != null && props.items["DueDate"] != undefined ? Moment(props.items["DueDate"]).format("DD-MMMM-YYYY") : ''}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Team Members:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p>{props.items["TeamMembers"] != null &&
                          props.items["TeamMembers"].length > 0 &&
                          <span style={{ fontSize: '10.0pt', color: 'black' }}>
                            {joinObjectValues(props.items["TeamMembers"])}
                          </span>
                        }
                          <span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{Moment(props.items["Created"]).format("DD-MMMM-YYYY")}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created By:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Author"] != null && props.items["Author"] != undefined && props.items["Author"].Title}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Categories:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Categories"]}</span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Status:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        {props.statusUpdateMailSendStatus != undefined && props.statusUpdateMailSendStatus == false ?
                          <>
                            {props.CreatedApprovalTask ?
                              <p><span style={{ fontSize: '10.0pt', color: 'black' }}>For Approval</span><span style={{ color: "black" }}> </span><u></u><u></u></p> :
                              <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.ApprovalTaskStatus ? "Approved" : "Follow up"}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                            }
                          </> : <p><span style={{ fontSize: '10.0pt', color: 'black' }}>Acknowledged</span><span style={{ color: "black" }}> </span><u></u><u></u></p>}

                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>% Complete:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        {props.statusUpdateMailSendStatus != undefined && props.statusUpdateMailSendStatus == false ?
                          <>
                            {props.CreatedApprovalTask ?
                              <p><span style={{ fontSize: '10.0pt', color: 'black' }}>1%</span><span style={{ color: "black" }}> </span><u></u><u></u></p> :
                              <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.ApprovalTaskStatus ? 3 : 2}%</span><span style={{ color: "black" }}> </span><u></u><u></u></p>}
                          </> : <p><span style={{ fontSize: '10.0pt', color: 'black' }}>5%</span><span style={{ color: "black" }}> </span><u></u><u></u></p>}

                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>URL:</span></b><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>
                          {props.items["ComponentLink"] != null &&
                            <a href={props.items["ComponentLink"].Url} target="_blank">{props.items["ComponentLink"].Url}</a>
                          }</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                    </tr>
                    <tr>
                      <td width="91" style={{ border: "none" }}></td>
                      <td width="46" style={{ border: "none" }}></td>
                      <td width="46" style={{ border: "none" }}></td>
                      <td width="100" style={{ border: "none" }}></td>
                      <td width="53" style={{ border: "none" }}></td>
                      <td width="51" style={{ border: "none" }}></td>
                      <td width="74" style={{ border: "none" }}></td>
                      <td width="32" style={{ border: "none" }}></td>
                      <td width="33" style={{ border: "none" }}></td>
                    </tr>
                  </tbody>
                </table>
                <table cellPadding="0" width="100%" style={{ width: "100.0%" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '.75pt .75pt .75pt .75pt' }}></td>
                    </tr>
                    {props.items["FeedBack"] != null &&
                      props.items["FeedBack"][0]?.FeedBackDescriptions.length > 0 &&
                      props.items["FeedBack"][0]?.FeedBackDescriptions[0].Title != '' &&
                      props.items["FeedBack"][0]?.FeedBackDescriptions.map((fbData: any, i: any) => {
                        return <>
                          <tr>
                            <td width="30px" align="center" style={{ border: "1px solid rgb(204, 204, 204)" }}>
                              <span style={{ fontSize: "10pt", color: "rgb(111, 111, 111)" }}>
                                <span>{i + 1}</span> <br />
                                <span>
                                  {fbData?.isShowLight === "Maybe" || fbData?.isShowLight === "Reject"  ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />
                                  </svg> : null
                                  }
                                  {fbData?.isShowLight === "Approve" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                  </svg> : null
                                  }
                                </span>
                              </span>
                            </td>
                            <td style={{ padding: "0px 2px 0px 10px", border: "1px solid #ccc" }}><span dangerouslySetInnerHTML={{ __html: fbData['Title'] }}></span>
                              {fbData['Comments'] != null && fbData['Comments'].length > 0 && fbData['Comments'].map((fbComment: any) => {
                                return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                  <div style={{ marginBottom: '3.75pt' }}>
                                    <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span>{fbComment.AuthorName} - {fbComment.Created}<u></u><u></u></span></p>
                                  </div>
                                  <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span><span dangerouslySetInnerHTML={{ __html: fbComment['Title'] }}></span><u></u><u></u></span></p>
                                </div>
                              })}
                            </td>
                          </tr>
                          {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext'].map((fbSubData: any, j: any) => {
                            return <>
                              <tr>
                                <td width="30px" align="center" style={{ border: "1px solid rgb(204, 204, 204)" }}>
                                  <span style={{ fontSize: "10pt", color: "rgb(111, 111, 111)" }}>
                                    <span>{i + 1}.{j + 1}</span> <br />
                                    <span>
                                      {fbSubData?.isShowLight === "Maybe" || fbSubData?.isShowLight === "Reject" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />
                                      </svg> : null
                                      }
                                      { fbSubData?.isShowLight === "Approve" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                      </svg> : null
                                      }
                                    </span>
                                  </span>
                                </td>
                                <td style={{ padding: "0px 2px 0px 10px", border: "1px solid #ccc" }}
                                ><span dangerouslySetInnerHTML={{ __html: fbSubData['Title'] }}></span>
                                  {fbSubData['Comments'] != null && fbSubData['Comments']?.length > 0 && fbSubData['Comments']?.map((fbSubComment: any) => {
                                    return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                      <div style={{ marginBottom: '3.75pt' }}>
                                        <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{fbSubComment.AuthorName} - {fbSubComment.Created}<u></u><u></u></span></p>
                                      </div>
                                      <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: 'black' }}><span dangerouslySetInnerHTML={{ __html: fbSubComment['Title'] }}></span><u></u><u></u></span></p>
                                    </div>
                                  })}
                                </td>
                              </tr>
                            </>
                          })}
                        </>
                      })}
                  </tbody>
                </table>
              </td>
              <td width="22%" style={{ width: '22.0%', padding: '.75pt .75pt .75pt .75pt' }}>
                <table className='table table-striped ' cellPadding={0} width="100%" style={{ width: '100.0%', border: 'solid #dddddd 1.0pt', borderRadius: '4px' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: 'none', borderBottom: 'solid #dddddd 1.0pt', background: 'whitesmoke', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p style={{ marginBottom: '1.25pt' }}><span>Comments:<u></u><u></u></span></p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'none', padding: '.75pt .75pt .75pt .75pt' }}>
                        {props?.items["Comments"] != undefined && props?.items["Comments"]?.length > 0 && props.items["Comments"]?.map((cmtData: any, i: any) => {
                          return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                            <div style={{ marginBottom: "3.75pt" }}>
                              <p style={{ marginBottom: '1.25pt' }}>
                                <span style={{ color: 'black', background: '#fbfbfb' }}>{cmtData.AuthorName} - {cmtData.Created}</span></p>
                            </div>
                            <p style={{ marginBottom: '1.25pt', background: '#fbfbfb' }}>
                              <span style={{ color: 'black' }}>{cmtData.Description}</span></p>
                          </div>
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </>
  )
}
export default EmailComponent;


//    (this.approvalcallback() }}  Context={this.props.Context}  currentUser={this.currentUser} items={this.state.Result})


//    we have to pass the callback function and context and currentUser and all items
//    allItems will be an object form .
//    currentUser will be an Array.
//    context will be an object
//    approvalcallback will be a Function .  