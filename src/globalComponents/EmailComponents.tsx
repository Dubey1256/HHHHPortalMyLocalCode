import * as React from 'react';
import { useState, useEffect } from 'react';
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';

let TaskStatus: any = ''
let count = 0;
const EmailComponent = (props: any) => {
  useEffect(() => {
    sendEmail(props.emailStatus);
  }, [])
  console.log(props);
  const sendEmail = async (send: any) => {
    let mention_To: any = [];
    count++
    if (props.CreatedApprovalTask != undefined && props.CreatedApprovalTask == true) {
      let Approver = '';
      props?.items.TaskApprovers.map((ApproverData: any) => {
        props?.AllTaskUser.forEach((val: any) => {
          if (ApproverData.Id == val?.AssingedToUserId) {
            let tempEmail = val?.Approver[0].Name;
            Approver += val.Title + ';';
            mention_To.push(tempEmail?.substring(18, tempEmail.length))
          }
        })      
      })
    }
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
        Subject: TaskStatus == "Approval" ? "[" + TaskStatus + " - " + props.items.siteType + " - " + props.items?.TaskID + " " + props.items.Title + "] New Approval Task" : "[ " + props.items.siteType + " - " + TaskStatus + " ]" + props.items.Title,
        Body: props.items.Title
      }
      console.log(EmailProps);
      if (count == 1) {
        await SendEmailFinal(EmailProps);
      }
    }
  }
  const BindHtmlBody = () => {
    let body = document.getElementById('htmlMailBodyEmail')
    console.log(body.innerHTML);
    return "<style>p>br {display: none;}</style>" + body.innerHTML;
  }

  const SendEmailFinal = async (EmailProps: any) => {
    let sp = spfi().using(spSPFx(props.Context));
    let data = await sp.utility.sendEmail({
      Body: BindHtmlBody(),
      Subject: EmailProps.Subject,
      To: EmailProps.To,
      AdditionalHeaders: {
        "content-type": "text/html"
      },
    })
    console.log("Email Sent!");
    console.log(data);
    props.callBack();

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
        {props.statusUpdateMailSendStatus != undefined && props.statusUpdateMailSendStatus == false && props.ApprovalTaskStatus == true || props.CreatedApprovalTask == true ?
          <>
            <b>Hi   {props?.items.TaskApprovers != null && props?.items.TaskApprovers?.length > 0 && props?.items.TaskApprovers?.map((Approver: any, index: any) => {
              return <span>
                {Approver?.Title}{(props?.items.TaskApprovers?.length - 1 < index && props?.items.TaskApprovers?.length > 1) ? <span>;</span> : ''}
              </span>
            })},</b><p></p><br />
            <div style={{ marginTop: "2pt" }}>
              {props?.items?.Approvee != undefined && props?.items?.Approvee?.Title != props?.items.TaskCreatorData[0].Title ?
                <>
                  {props?.items.TaskCreatorData[0].Title} has created a Task but {props?.CurrentUser[0]?.Title}  has sent you for approval. Please take your time and review:
                  Please note that you still have 1 tasks left to approve.<br /> You can find all pending approval tasks on your task dashboard or the approval page.
                </> : <>{props?.items.TaskCreatorData[0].Title} has created a Task which requires your Approval. Please take your time and review:
                  Please note that you still have 1 tasks left to approve.<br /> You can find all pending approval tasks on your task dashboard or the approval page.
                </>}
              <p>
                <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props.items.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props.items["Title"]}</a>&nbsp;&nbsp;
                <a href={`${props.items["siteUrl"]}/SitePages/TaskDashboard.aspx`} target="_blank" data-interception="off">Your Task Dashboard</a>
                <a style={{ marginLeft: "20px" }} href={`${props.items["siteUrl"]}/SitePages/TaskManagement.aspx?SmartfavoriteId=101&smartfavorite=All%20Approval%20Tasks`} target="_blank" data-interception="off">Your Approval Page</a>
              </p>
            </div>
          </>
          :
          <div style={{ marginTop: "11.25pt" }}>
            <div style={{ marginTop: "2pt" }}>Hi,</div>
            <div style={{ marginTop: "5pt" }}>your task has been Rejected by {props.CurrentUser[0]?.Title}, Please follow the below task link to have look..</div>
            <div style={{ marginTop: "5pt" }}>Have a nice day {props?.items?.Approvee?.Title}.</div>
            <div style={{ marginTop: "10pt" }}>
              <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props.items.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props.items["Title"]}</a><u></u><u></u>
            </div>
          </div>
        }
        {/* <div style={{ marginTop: "11.25pt" }}>
            <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props?.items?.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props?.items["Title"]}</a><u></u><u></u>
          </div> */}
        <b><span style={{ fontSize: '10.0pt', color: 'black' }}>Task Details : </span></b>
        <p></p>
        <table cellPadding="0" width="100%" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td width="70%" valign="top" style={{ width: '70.0%', padding: '.75pt .75pt .75pt .75pt' }}>
                <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                  <tbody>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Task Id:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items?.TaskId}</span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Component:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p>{props?.items["Portfolio"] != null &&
                          <span style={{ fontSize: '10.0pt', color: 'black' }}>
                            {props?.items["Portfolio"]?.Title}
                          </span>
                        }
                          <span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Priority:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["Priority"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Start Date:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["StartDate"] != null && props?.items["StartDate"] != undefined && props?.items["StartDate"] != "" ? Moment(props?.items["StartDate"]).format("DD-MMMM-YYYY") : ""}</span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Completion Date:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["CompletedDate"] != null && props?.items["CompletedDate"] != undefined && props?.items["CompletedDate"] != "" ? Moment(props?.items["CompletedDate"]).format("DD-MMMM-YYYY") : ""}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Due Date:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["DueDate"] != null && props?.items["DueDate"] != undefined && props?.items["DueDate"] != "" ? Moment(props?.items["DueDate"]).format("DD-MMMM-YYYY") : ''}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Team Members:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p>{props?.items["TeamMembers"] != null &&
                          props?.items["TeamMembers"].length > 0 &&
                          <span style={{ fontSize: '10.0pt', color: 'black' }}>
                            {joinObjectValues(props?.items["TeamMembers"])}
                          </span>
                        }
                          <span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{Moment(props?.items["Created"]).format("DD-MMMM-YYYY")}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created By:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["Author"] != null && props?.items["Author"] != undefined && props?.items["Author"].Title}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Categories:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["Categories"]}</span><u></u><u></u></p>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Status:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        {props?.items["Status"]}
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>% Complete:</span></b><u></u><u></u></p>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        {props?.items["PercentComplete"]}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>URL:</span></b><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><span style={{ fontSize: '10.0pt', color: 'black' }}>
                          {props?.items["ComponentLink"] != null &&
                            <a href={props?.items["ComponentLink"].Url} target="_blank">{props?.items["ComponentLink"].Url}</a>
                          }</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                        <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Smart Priority:</span></b><span style={{ color: "black" }}> </span><u></u><u></u></p>
                      </td>
                      <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                        {props?.items["SmartPriority"]}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {props?.items["FeedBack"] != null &&
                  props?.items["FeedBack"][0]?.FeedBackDescriptions?.length > 0 &&
                  props?.items["FeedBack"][0]?.FeedBackDescriptions[0].Title?.length > 8 ?
                  <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                    <tbody>
                      <td style={{ padding: '0.75pt', whiteSpace: 'nowrap' }}><b><span style={{ fontSize: '10pt', color: 'black' }}>Task Description:</span></b></td>
                      {props?.items["FeedBack"] != null &&
                        props?.items["FeedBack"][0]?.FeedBackDescriptions?.length > 0 &&
                        props?.items["FeedBack"][0]?.FeedBackDescriptions[0].Title != '' &&
                        props?.items["FeedBack"][0]?.FeedBackDescriptions.map((fbData: any, i: any) => {
                          return (<>
                            <tr>
                              <td width="50px" align="center" style={{ border: "1px solid rgb(204, 204, 204)" }}>
                                <span style={{ fontSize: "10pt", color: "rgb(111, 111, 111)" }}>
                                  <span>{i + 1}</span> <br />

                                </span>
                              </td>
                              <td height="40px" style={{ padding: "0px 2px 0px 10px", border: "1px solid #ccc" }}><span dangerouslySetInnerHTML={{ __html: fbData['Title'] }}></span>
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
                                  <td width="50px" align="center" style={{ border: "1px solid rgb(204, 204, 204)" }}>
                                    <span style={{ fontSize: "10pt", color: "rgb(111, 111, 111)" }}>
                                      <span>{i + 1}.{j + 1}</span> <br />

                                    </span>
                                  </td>
                                  <td height="40px" style={{ padding: "0px 2px 0px 10px", border: "1px solid #ccc" }}
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
                          </>)
                        })}
                    </tbody>
                  </table>
                  :
                  null
                }
              </td>
              {props?.items?.CommentsArray?.length > 0 ?
                <td width="22%" style={{ width: '22.0%', padding: '.75pt .75pt .75pt .75pt', verticalAlign: 'top' }}>
                  <table className='table table-striped ' cellPadding={0} width="100%" style={{ width: '100.0%', border: 'solid #dddddd 1.0pt', borderRadius: '4px', }}>
                    <tbody>
                      <tr>
                        <td style={{ border: 'none', borderBottom: 'solid #dddddd 1.0pt', background: '#fff', color: "#f333", padding: '.75pt .75pt .75pt .75pt' }}>
                          <b style={{ marginBottom: '1.25pt' }}><span style={{ fontSize: '10.0pt', color: 'black' }} >Comments:<u></u><u></u></span></b>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: 'none', padding: '.75pt .75pt .75pt .75pt' }}>
                          {props?.items["CommentsArray"] != undefined && props?.items["CommentsArray"]?.length > 0 && props?.items["CommentsArray"]?.map((cmtData: any, i: any) => {
                            return (
                              <>
                                <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                  <div style={{ marginBottom: "3.75pt" }}>
                                    <p style={{ marginBottom: '1.25pt' }}>
                                      <span style={{ color: 'black', background: '#fbfbfb' }}>{cmtData.AuthorName} - {cmtData.Created}</span></p>
                                  </div>
                                  <p style={{ marginBottom: '1.25pt', background: '#fbfbfb' }}>
                                    <span style={{ color: 'black' }}>{cmtData.Description}</span></p>

                                  {cmtData?.ReplyMessages?.length > 0 && cmtData?.ReplyMessages?.map((replyData: any) => {
                                    return (
                                      <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt', marginLeft: '10pt' }}>
                                        <div style={{ marginBottom: "3.75pt" }}>
                                          <p style={{ marginBottom: '1.25pt' }}>
                                            <span style={{ color: 'black', background: '#fbfbfb' }}>{replyData.AuthorName} - {replyData.Created}</span></p>
                                        </div>
                                        <p style={{ marginBottom: '1.25pt', background: '#fbfbfb' }}>
                                          <span style={{ color: 'black' }}>{replyData.Description}</span></p>
                                      </div>
                                    )
                                  })}
                                </div>
                              </>
                            )
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                : null
              }
            </tr>
          </tbody>
        </table>
        <p></p>
        <p style={{ fontSize: '10.0pt', color: 'black' }}>
          Task Link:
          <a target="_blank" data-interception="off" href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props.items.Id}&Site=${props?.items?.siteType}`}>Click here</a>
        </p>
        <p></p>
        <span style={{ fontSize: '10.0pt', color: 'black' }}><b>Thanks,<br />Task Management Team</b></span>
      </div >
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