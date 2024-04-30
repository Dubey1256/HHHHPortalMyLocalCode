import * as React from 'react';
import { useState, useEffect } from 'react';
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import { Web } from 'sp-pnp-js';
import moment from 'moment';
import * as Moment from 'moment';
let percentage = 1;
const EmailComponenet = (props: any) => {
  const [Status, setStatus] = useState('')
  const [percent, setPercent] = useState(1)
  const [taskpermission, settaskpermission] = useState(props?.emailStatus != undefined ? props?.emailStatus : null);
  if (props.items != undefined && (props?.items?.TaskID == undefined || props?.items?.TaskID == ''))
    props.items.TaskID = props.items?.TaskId
  useEffect(() => {

    sendEmail(props.emailStatus);
  }, [])
  console.log(props);


  const updateData = async (permission: any) => {
    const feedback: any = props?.items?.FeedBack != null ? props.items?.FeedBack : null;
    feedback?.map((items: any) => {
      var approvalDataHistory = {
        ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Id: props?.currentUser[0].Id,
        ImageUrl: props?.currentUser[0].userImage,
        Title: props?.currentUser[0].Title,
        isShowLight: permission,
        Status: permission == "Approve" ? 'Approved by' : "Rejected by"
      }
      if (items?.FeedBackDescriptions != undefined && items?.FeedBackDescriptions?.length > 0) {
        items?.FeedBackDescriptions?.map((feedback: any) => {
          if (feedback?.Subtext != undefined) {
            feedback?.Subtext?.map((subtext: any) => {
              if (subtext?.isShowLight === "") {
                if (props?.items["PercentComplete"] == 1) {
                  if (subtext.ApproverData != undefined) {
                    subtext.ApproverData.push(approvalDataHistory)
                  } else {
                    subtext.ApproverData = [];
                    subtext.ApproverData.push(approvalDataHistory);
                  }
                }
                subtext.isShowLight = permission
              } else {

                subtext.isShowLight = permission
              }
            })
          }
          if (props?.items["PercentComplete"] == 1) {
            if (feedback.ApproverData != undefined) {
              feedback.ApproverData.push(approvalDataHistory)
            } else {
              feedback.ApproverData = [];
              feedback.ApproverData.push(approvalDataHistory);
            }
          }

          if (feedback.isShowLight === "") {

            feedback.isShowLight = permission
          } else {

            feedback.isShowLight = permission
          }
        })
      }
    })
    console.log(feedback);
  };

  const sendEmail = async (send: any) => {

    if (send == "Approved") {
      await updateData("Approve");
    }
    else if (send == "Rejected") {
      await updateData("Reject");
    }
    let percentageComplete;
    let taskStatus = "";
    if (send == "Approve" || send == "Approved") {
      settaskpermission("Approve");
      percentageComplete = 0.03;
      percentage = 3;
      taskStatus = "Approved"
      setStatus(taskStatus)
      setPercent(percentage)
    }
    if (send == "Rejected" || send == "Maybe" || send == "Reject") {
      settaskpermission("Reject");
      percentageComplete = 0.02;
      taskStatus = "Follow Up"
      percentage = 2;
      setStatus(taskStatus);
      setPercent(percentage);
    }
    if (send == "Approved" || send == "Rejected") {
      const feedback: any = props.items?.FeedBack != null ? props.items?.FeedBack : null;
      const web = new Web(props?.items?.siteUrl);
      await web.lists.getByTitle(props.items.listName)
        // await web.lists.getById(props.SiteTaskListID)
        .items.getById(props?.items?.Id).update({
          PercentComplete: percentageComplete,
          Status: taskStatus,
          FeedBack: feedback?.length > 0 ? JSON.stringify(feedback) : null
        }).then((res: any) => {
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err.message);
        });
    }
    let mention_To: any = [];
    mention_To.push(props?.items?.Approvee != undefined ? props?.items?.Approvee?.Email : props?.items?.Author[0]?.Name?.replace('{', '').replace('}', '').trim());
    console.log(mention_To);
    if (mention_To.length > 0) {
      let emailprops = {
        To: mention_To,
        Subject: "[Approval" + " - " + props.items.siteType + " - " + props.items?.TaskID + " " + props.items.Title + "] Task " + send,

        Body: props.items.Title
      }
      console.log(emailprops);
      await SendEmailFinal(emailprops);
    }
  }
  const BindHtmlBody = () => {
    let body = document.getElementById('htmlMailBodyemail')
    console.log(body.innerHTML);
    return "<style>p>br {display: none;}</style>" + body.innerHTML;
  }

  const SendEmailFinal = async (emailprops: any) => {
    let sp = spfi().using(spSPFx(props.Context));
    let data = await sp.utility.sendEmail({
      Body: BindHtmlBody(),
      Subject: emailprops.Subject,
      To: emailprops.To,
      AdditionalHeaders: {
        "content-type": "text/html"
      },
    })
    console.log("Email Sent!");
    console.log(data);
    props?.approvalcallback();
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


      {props.items != null && props?.items?.Approver != undefined &&
        <div id='htmlMailBodyemail' style={{ display: 'none' }}>
          <div style={{ marginTop: "2pt" }}>Hi {props?.items?.Approvee != undefined ? props?.items?.Approvee?.Title : ''},</div>
          {taskpermission != null && taskpermission == "Approve" && <div style={{ marginTop: "2pt" }}>Your task has been Approved by {props.items?.Approver?.Title},team will process it further.Please refer to the Approved Comments.</div>}
          {taskpermission != null && taskpermission == "Reject" && <div style={{ marginTop: "2pt" }}>Your task has been Rejected by {props?.items?.Approver?.Title},team will process it further. Please refer to the  Rejected Comments.</div>}

          {/* <div style={{ marginTop: "11.25pt" }}>
            <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props?.items?.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props?.items["Title"]}</a><u></u><u></u>
            </div> */}
          <br />
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
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["StartDate"] != null && props?.items["StartDate"] != undefined && props?.items["StartDate"] != "" ? props?.items["StartDate"] : ""}</span><u></u><u></u></p>
                        </td>
                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Completion Date:</span></b><u></u><u></u></p>
                        </td>
                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["CompletedDate"] != null && props?.items["CompletedDate"] != undefined && props?.items["CompletedDate"] != "" ? props?.items["CompletedDate"] : ""}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                        </td>
                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Due Date:</span></b><u></u><u></u></p>
                        </td>
                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["DueDate"] != null && props?.items["DueDate"] != undefined && props?.items["DueDate"] != "" ? props?.items["DueDate"] : ''}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
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
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items["Author"] != null && props?.items["Author"][0] != undefined && props?.items["Author"][0].Title}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
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
                          {Status}
                        </td>
                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>% Complete:</span></b><u></u><u></u></p>
                        </td>
                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          {percent}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>URL:</span></b><span style={{ color: "black" }}> </span><u></u><u></u></p>
                        </td>
                        <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>
                            {props?.items["component_url"] != null &&
                              <a href={props?.items["component_url"].Url} target="_blank">{props?.items["component_url"].Url}</a>
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
                {props?.items?.Comments?.length > 0 ?
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
                            {props?.items["Comments"] != undefined && props?.items["Comments"]?.length > 0 && props?.items["Comments"]?.map((cmtData: any, i: any) => {
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

        </div>
      }
    </>
  )
}
export default EmailComponenet;
//(this.approvalcallback() }}  Context={this.props.Context}  currentUser={this.currentUser} items={props.items})


//  we have to pass the callback function and context and currentUser and all items
//    allItems will be an object form .
//currentUser will be an Array.
// context will be an object
//  approvalcallback will be a Function .