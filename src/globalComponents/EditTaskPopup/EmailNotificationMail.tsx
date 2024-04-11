import * as React from 'react';
import { useEffect } from 'react';
import "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';

let count = 0;
const EmailNotificationMail = (props: any) => {
  count = 0;
  useEffect(() => {
    sendEmail(props.emailStatus);
  }, [])
  const sendEmail = async (send: any) => {
    count++
    let mention_To: any = [];
    let Subjects = ''
    mention_To.push(props?.items.TaskCreatorData[0].Email);
    if (mention_To.length > 0) {
      
      if (props.items.Categories.indexOf('Email Notification') != -1) {
        Subjects = `[Email Notification - ${props.items.siteType} - ${props.items.TaskId} ${props.items.Title}] Task Completed`
      }
      if (props.items.Categories.indexOf('Immediate') != -1 && props.statusValue == '90') {
        Subjects = `[Immediate - ${props.items.siteType} - ${props.items.TaskId} ${props.items.Title}] Immediate  Task Completed`
      }
      if (props.items.Categories.indexOf('Immediate') != -1 && props.statusValue == '0') {
        Subjects = `[Immediate - ${props.items.siteType} - ${props.items.TaskId} ${props.items.Title}] New Immediate  Task Created`
      }
      if (props.items.Categories.indexOf('Immediate') != -1 && props.statusValue == '5') {
        Subjects = `[Immediate - ${props.items.siteType} - ${props.items.TaskId} ${props.items.Title}] Immediate Task acknowledged`
      }
      if (props.items.Categories.indexOf('Immediate') != -1 && props.statusValue == '10') {
        Subjects = `[Immediate - ${props.items.siteType} - ${props.items.TaskId} ${props.items.Title}] Immediate Task is worked on`
      }
      if (props.items.Categories.indexOf('Immediate') != -1 && props.statusValue == '80') {
        Subjects = `[Immediate - ${props.items.siteType} - ${props.items.TaskId} ${props.items.Title}] Immediate Task only QA pending`
      }
      if (props.items.Categories.indexOf('Design') != -1 && props.statusValue == '90') {
        Subjects = `[Design - ${props.items.siteType} - ${props.items.TaskId} ${props.items.Title}] Design Task awaiting QA`
      }
      let category = joinObjectValues(props.items?.TaskCategories)
      let EmailProps = {
        To: mention_To,
        Subject: Subjects,
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
  const removeTags = (htmlString:any) => {
    return htmlString.replace(/<\/?p>/g, '');
  };
  return (
    <>
      <div id='htmlMailBodyEmail' style={{ display: 'none' }}>
        {/* <div style={{ backgroundColor: "#FAFAFA" }}>
          <div style={{ width: "900px", backgroundColor: "#fff", padding: "0px 32px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "56px 0px" }}>
              <img src={props?.items?.siteIcon} style={{ width: "48px", height: "48px", borderRadius: "50%" }}></img>
                <div style={{ color: "var(--black, #333)", textAlign: "center", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", marginLeft: "4px" }}></div>
            </div>
            <div style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
              Hi {props?.items?.TaskCreatorData[0]?.Title},
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
         </div> */}


        <div style={{ marginTop: "11.25pt" }}>
          <div style={{ marginTop: "2pt" }}>Hello {props?.items?.CreatorTitle},</div>
          <div style={{ marginTop: "5pt" }}>Your task has been set to  {props?.statusValue}%  by {props.CurrentUser[0]?.Title},  {props.statusValue != '90' && 'team will process it further.'}</div>
          <div style={{ marginTop: "5pt" }}>Have a nice day !</div>
          <div style={{ marginTop: "5pt" }}>Regards,</div>
          <div style={{ marginTop: "5pt" }}>Task Management Team,</div>
          <div style={{ margin: "10pt 0pt" }}>
            <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props.items.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props.items["Title"]}</a><u></u><u></u>
          </div>
        </div>

        {/* <div style={{ marginTop: "11.25pt" }}>
            <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props?.items?.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props?.items["Title"]}</a><u></u><u></u>
          </div> */}

        <table cellPadding="0" width="100%" style={{ width: "100.0%" }}>
          <tbody>
            <tr>
              <td width="70%" valign="top" style={{ width: '70.0%' }}>
                <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                  <tbody>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '90pt' }} >
                        <b style={{ fontSize: '10pt', color: 'black' }}>Task Id:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.items?.TaskId}</span>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '100pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Portfolio:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        {props.items["Portfolio"] != undefined &&
                          <span style={{ fontSize: '10.0pt', color: 'black' }}>
                            {(props.items.Portfolio?.Title)}
                          </span>
                        }
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '80pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Priority:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Priority"]}</span><span style={{ color: "black" }}> </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '90pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Start Date:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["StartDate"] != null && props.items["StartDate"] != undefined ? Moment(props.items["StartDate"]).format("DD-MM-YYYY") : ""}</span>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '`100pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Completion Date:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["CompletedDate"] != null && props.items["CompletedDate"] != undefined ? Moment(props.items["CompletedDate"]).format("DD-MM-YYYY") : ""}</span>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '80pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Due Date:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["DueDate"] != null && props.items["DueDate"] != undefined ? Moment(props.items["DueDate"]).format("DD-MM-YYYY") : ''}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '90pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Team Members:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        {props.items["TeamMembers"] != null &&
                          props.items["TeamMembers"].length > 0 &&
                          <span style={{ fontSize: '10.0pt', color: 'black' }}>
                            {joinObjectValues(props.items["TeamMembers"])}
                          </span>
                        }
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '100pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Created:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Created"] != null && props.items["Created"] != undefined ? Moment(props.items["Created"]).format("DD-MM-YYYY") : ''}</span>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '80pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Created By:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Author"] != null && props.items["Author"] != undefined && props.items["Author"].Title}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '90pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Categories:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>{joinObjectValues(props.items["TaskCategories"])}</span>
                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '100pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>Status:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        {props.statusUpdateMailSendStatus != undefined && props.statusUpdateMailSendStatus == false ?
                          <>
                            {props.CreatedApprovalTask ?
                              <span style={{ fontSize: '10.0pt', color: 'black' }}>For Approval</span> :
                              <span style={{ fontSize: '10.0pt', color: 'black' }}>{props.ApprovalTaskStatus ? "Approved" : "Follow up"}</span>
                            }
                          </> : <span style={{ fontSize: '10.0pt', color: 'black' }}>Acknowledged</span>}

                      </td>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '80pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>% Complete:</b>
                      </td>
                      <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>{props?.statusValue}%</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '5pt', width: '90pt' }}>
                        <b style={{ fontSize: '10.0pt', color: 'black' }}>URL:</b>
                      </td>
                      <td colSpan={8} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '5pt' }}>
                        <span style={{ fontSize: '10.0pt', color: 'black' }}>
                          {props.items["ComponentLink"] != null &&
                            <a href={props.items["ComponentLink"].Url} target="_blank">{props.items["ComponentLink"].Url}</a>
                          }</span>
                      </td>
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
                  </tbody>
                </table>
                <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '10pt' }}></td>
                    </tr>
                    <tr>
                    {(props.items.Categories.indexOf('Design') != -1 && props.statusValue == '90' && props.items?.ImageData.length > 0) &&
                      <td width='200pt' valign="top">
                        <table>
                            <>
                              {props.items?.ImageData?.map((val: any, index: any) => {
                                return (
                                  <>
                                    <tr className='BasicimagesInfo_group'>
                                      <td>
                                        <a href={val?.ImageUrl} target='_blank' data-interception="off"><img src={val.ImageUrl} alt="" width='200' height='200px' /></a>
                                        <div>Image - {index + 1}</div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <div>&nbsp;</div>
                                      </td>
                                    </tr>
                                  </>
                                )
                              })}
                            </>
                        </table>
                      </td>}
                      <td valign="top">
                        <table width="100%">
                          {props.items["FeedBack"] != null &&
                            props.items["FeedBack"][0]?.FeedBackDescriptions.length > 0 &&
                            props.items["FeedBack"][0]?.FeedBackDescriptions[0].Title != '' &&
                            props.items["FeedBack"][0]?.FeedBackDescriptions.map((fbData: any, i: any) => {
                              return <>
                                <tr>
                                  <td width="30px" style={{ border: "1px solid rgb(204, 204, 204)", padding: "5pt" }}>
                                    <span style={{ fontSize: "10pt", color: "rgb(111, 111, 111)" }}>
                                      <span>{i + 1}</span> <br />
                                      <span>
                                        {fbData?.isShowLight === "Maybe" || fbData?.isShowLight === "Reject" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">
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
                                  <td style={{ padding: "5pt", border: "1px solid #ccc" }}><span dangerouslySetInnerHTML={{ __html: fbData['Title'] }}></span>
                                    {fbData['Comments'] != null && fbData['Comments'].length > 0 && fbData['Comments'].map((fbComment: any) => {
                                      return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                        <div style={{ marginBottom: '3.75pt' }}>
                                          <div style={{ marginLeft: '15px', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{fbComment.AuthorName} - {fbComment.Created}</span></div>
                                        </div>
                                        <div style={{ marginLeft: '15px', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: 'black' }} dangerouslySetInnerHTML={{ __html: fbComment['Title'] }}></span>
                                        </div>
                                        {fbComment?. ReplyMessages?.length>0 && fbComment?.ReplyMessages?.map((replycom:any)=>{
                                                                        return(
                                                                            <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                                                            <div style={{ marginBottom: '3.75pt' }}>
                                                                                <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span>{replycom.AuthorName} - {replycom.Created}<u></u><u></u></span></p>
                                                                            </div>
                                                                            <p style={{ marginLeft: '15px'}}><span><span  dangerouslySetInnerHTML={{ __html: replycom['Title'] }}></span><u></u><u></u></span></p>
                                                                            </div>   
                                                                        )
                                                                       })}
                                      </div>
                                    })}
                                  </td>
                                </tr>
                                {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext'].map((fbSubData: any, j: any) => {
                                  return <>
                                    <tr>
                                      <td width="30px" style={{ border: "1px solid rgb(204, 204, 204)", padding: "5pt" }}>
                                        <span style={{ fontSize: "10pt", color: "rgb(111, 111, 111)" }}>
                                          <span>{i + 1}.{j + 1}</span> <br />
                                          <span>
                                            {fbSubData?.isShowLight === "Maybe" || fbSubData?.isShowLight === "Reject" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">
                                              <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />
                                            </svg> : null
                                            }
                                            {fbSubData?.isShowLight === "Approve" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
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
                                            <div style={{ marginLeft: '15px', background: '#fbfbfb', marginBottom: '3.75pt' }}>
                                              <span style={{ fontSize: '10.0pt', color: 'black' }}>{fbSubComment.AuthorName} - {fbSubComment.Created}</span>
                                            </div>
                                            <div style={{ marginLeft: '15px', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: 'black' }} dangerouslySetInnerHTML={{ __html: fbSubComment['Title'] }}></span></div>
                                            {fbSubComment?. ReplyMessages?.length>0 && fbSubComment?.ReplyMessages?.map((replycom:any)=>{
                                                                        return(
                                                                            <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                                                            <div style={{ marginBottom: '3.75pt' }}>
                                                                                <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span>{replycom.AuthorName} - {replycom.Created}<u></u><u></u></span></p>
                                                                            </div>
                                                                            <p style={{ marginLeft: '15px'}}><span><span dangerouslySetInnerHTML={{ __html: replycom['Title'] }}></span><u></u><u></u></span></p>
                                                                            </div>   
                                                                        )
                                                                       })}
                                          </div>
                                        })}
                                      </td>
                                    </tr>
                                  </>
                                })}
                              </>
                            })}
                        </table>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </td>
              <td valign="top" width="22%" style={{ width: '22.0%' }}>
                {props?.items["Comments"]?.length > 0 &&
                  <table className='table table-striped ' cellPadding={0} width="100%" style={{ width: '100.0%', border: 'solid #cccccc 1.0pt' }}>
                    <tbody>
                      <tr>
                        <td style={{ border: 'none', borderBottom: 'solid #cccccc 1.0pt', background: 'whitesmoke', padding: '5pt' }}>
                          <b style={{ fontSize: '10.0pt', color: 'black' }}>Comments:</b>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: 'none', padding: '5pt' }}>
                          {props?.items["Comments"] != undefined && props?.items["Comments"]?.length > 0 && props.items["Comments"]?.map((cmtData: any, i: any) => {
                            return <div style={{ border: 'solid #cccccc 1.0pt', padding: '5pt', marginTop: '3.75pt' }}>
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
                                                                                <span style={{ color: 'black' }}>{removeTags(replyData.Description)}</span></p>
                                                                        </div>
                                                                    )
                                                                })}
                            </div>
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>}

              </td>
            </tr>
          </tbody>
        </table>


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