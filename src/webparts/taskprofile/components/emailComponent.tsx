import * as React from 'react';
import { useState, useEffect } from 'react';
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import { Web } from 'sp-pnp-js';
import moment from 'moment';

let percentage = 1;
const EmailComponenet = (props: any) => {

  const [taskpermission, settaskpermission] = useState(props?.emailStatus!=undefined?props?.emailStatus:null);
  useEffect(() => {
   
    sendEmail(props.emailStatus);
  }, [])
  console.log(props);


  const updateData = async (permission: any) => {
    const feedback: any = props?.items?.FeedBack != null ? props.items?.FeedBack : null;
    feedback?.map((items: any) => {
      if (items?.FeedBackDescriptions != undefined && items?.FeedBackDescriptions?.length > 0) {
        items?.FeedBackDescriptions?.map((feedback: any) => {
          if (feedback?.Subtext != undefined) {
            feedback?.Subtext?.map((subtext: any) => {
              if (subtext?.isShowLight === "") {

                subtext.isShowLight = permission
              } else {

                subtext.isShowLight = permission
              }
            })
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
    }
    if (send == "Rejected" || send == "Maybe" || send == "Reject") {
      settaskpermission("Reject");
      percentageComplete = 0.02;
      taskStatus = "Follow Up"
      percentage = 2;
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


    console.log(props);

    let mention_To: any = [];
    mention_To.push(props?.items?.Author[0]?.Name?.replace('{', '').replace('}', '').trim());
    console.log(mention_To);
    if (mention_To.length > 0) {
      let emailprops = {
        To: mention_To,
        Subject: "[" + props?.items?.siteType + "-" + send + "]" + props?.items?.Title,
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
    sp.utility.sendEmail({
      //Body of Email  
      Body: BindHtmlBody(),
      //Subject of Email  
      Subject: emailprops.Subject,
      //Array of string for To of Email  
      To: emailprops.To,
      AdditionalHeaders: {
        "content-type": "text/html"
      },
    }).then(() => {
      console.log("Email Sent!");
      props?.approvalcallback();

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


      {props.items != null && props?.items?.Approver != undefined &&
        <div id='htmlMailBodyemail' style={{ display: 'none' }}>
          <div style={{ marginTop: "2pt" }}>Hi,</div>
          {taskpermission != null && taskpermission == "Approve" && <div style={{ marginTop: "2pt" }}>Your task has been Approved by {props.items?.Approver?.Title},team will process it further.Please refer to the Approved Comments.</div>}
          {taskpermission != null && taskpermission == "Reject" && <div style={{ marginTop: "2pt" }}>Your task has been Rejected by {props?.items?.Approver?.Title},team will process it further. Please refer to the  Rejected Comments.</div>}

          <div style={{ marginTop: "11.25pt" }}>
            <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props?.items?.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props?.items["Title"]}</a><u></u><u></u></div>
         <table cellPadding={0} cellSpacing={0}  width="100%" style={{ width: "100.0%" }}>
              <tbody>
                <tr>
                  <td width="70%" valign="top" style={{ width: '70.0%', padding: '4pt' }}>
                    <table cellPadding={0} cellSpacing={0}  width="99%" style={{ width: "99.0%" }}>
                      <tbody>
                       
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Task Id:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p  style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["ID"]}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Component:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}>{props.items["Component"] != null &&
                              props.items["Component"].length > 0 &&
                              <span style={{ fontSize: '10.0pt', color: 'black' }}>
                                {joinObjectValues(props.items["Component"])}
                              </span>
                            }
                              </p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Priority:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items?.Priority}</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Start Date:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items?.StartDate}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Completion Date:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items?.CompletedDate}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Due Date:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items?.DueDate}</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Team Members:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}>{props.items["TeamMembers"] != null &&
                              props.items["TeamMembers"].length > 0 &&
                              <span style={{ fontSize: '10.0pt', color: 'black' }}>
                                {joinObjectValues(props.items?.TeamMembers)}
                              </span>
                            }
                              </p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created By:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["StartDate"]}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Author"] != null && props.items["Author"].length > 0 && props.items["Author"][0].Title}</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Categories:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Categories"]}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Status:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Status"]}</span></p>
                          </td>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>% Complete:</span></b></p>
                          </td>
                          <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["PercentComplete"]}</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><b><span style={{ fontSize: '10.0pt', color: 'black' }}>URL:</span></b></p>
                          </td>
                          <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4pt' }}>
                            <p style={{margin:'4pt 0pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}>
                              {props.items["component_url"] != null &&
                                <a href={props.items["component_url"].Url} target="_blank">{props.items["component_url"].Url}</a>
                              }</span></p>
                          </td>
                          <td style={{ padding: '4pt' }}></td>
                        </tr>
                   
                  
                      </tbody>
                    </table>
                    <table cellPadding={0} cellSpacing={0} width="99%" style={{ width: "99.0%" }}>
                      <tbody>
                        <tr>
                          <td style={{ padding: '2pt' }}></td>
                        </tr>


                        {props.items["FeedBack"] != null &&
                          props.items["FeedBack"][0]?.FeedBackDescriptions?.length > 0 &&
                          props.items["FeedBack"][0]?.FeedBackDescriptions[0]?.Title != '' &&
                          props.items["FeedBack"][0]?.FeedBackDescriptions?.map((fbData: any, i: any) => {
                            return <>
                              <tr >
                                <td width={"30px"} align='center' style={{border: "1px solid #ccc", }}>
                                  <p><span style={{ fontSize: '10.0pt', color: '#6f6f6f' }}>{i + 1}</span></p>
                                </td>
                                
                                <td style={(fbData?.isShowLight=="Reject")?({ background: "rgba(255, 0, 0, 0.09)",border: "1px solid #ccc", padding: "0px 2px 0px 10px"}):(fbData?.isShowLight=="Approve")?({ background: "#00800024",border: "1px solid #ccc", padding: "0px 2px 0px 10px" }):({ background: "#fbfbfb",border: "1px solid #ccc", padding: "0px 2px 0px 10px" })}><span dangerouslySetInnerHTML={{ __html: fbData['Title'] }}></span>
                                  {fbData['Comments'] != null && fbData['Comments'].length > 0 && fbData['Comments']?.map((fbComment: any) => {
                                    return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt', marginBottom:'5pt'}}>
                                      <div style={{ marginBottom: '3.75pt' }}>
                                        <p style={{ marginLeft: '1.5pt'}}>Comment by <span>{fbComment?.AuthorName} - {fbComment?.Created}</span></p>
                                      </div>
                                      <p style={{ marginLeft: '1.5pt'}}><span><span dangerouslySetInnerHTML={{ __html: fbComment['Title'] }}></span></span></p>
                                    </div>

                                  })}
                                </td>
                              </tr>
                              {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext']?.map((fbSubData: any, j: any) => {
                                return <>
                                  <tr >
                                    <td width={"30px"} style={{border: "1px solid #ccc"}} align='center'>
                                      <p><span style={{ fontSize: '10.0pt', color: '#6f6f6f' }}>{i + 1}.{j + 1}.</span></p>
                                    </td>
                                    <td style={fbSubData?.isShowLight=="Reject"?{ background: "rgba(255, 0, 0, 0.09)",border: "1px solid #ccc", padding: "0px 2px 0px 10px"}:(fbData?.isShowLight=="Approve")?({ background: "#00800024",border: "1px solid #ccc", padding: "0px 2px 0px 10px" }):{ background: "#fbfbfb",border: "1px solid #ccc", padding: "0px 2px 0px 10px" }}><span dangerouslySetInnerHTML={{ __html: fbSubData['Title'] }}></span>
                                      {fbSubData['Comments'] != null && fbSubData['Comments'].length > 0 && fbSubData['Comments']?.map((fbSubComment: any) => {
                                        return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt', marginBottom:'5pt' }}>
                                          <div style={{ marginBottom: '3.75pt' }}>
                                            <p style={{ marginLeft: '1.5pt'}}>Comment by<span style={{ fontSize: '10.0pt', color: 'black' }}>{fbSubComment?.AuthorName} - {fbSubComment?.Created}</span></p>
                                          </div>
                                          <p style={{ marginLeft: '1.5pt'}}><span style={{ fontSize: '10.0pt', color: 'black' }}><span dangerouslySetInnerHTML={{ __html: fbSubComment['Title'] }}></span></span></p>
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
                  <td width="22%" valign="top" style={{ width: '22.0%', padding: '4pt' }}>
                    <table cellPadding={0} cellSpacing={0} width="100%" style={{ width: '100.0%', border: 'solid #dddddd 1.0pt', borderRadius: '4px' }}>
                      <tbody>
                        <tr>
                          <td style={{ border: 'none', borderBottom: 'solid #dddddd 1.0pt', background: 'whitesmoke', padding: '4pt' }}>
                            <p style={{ margin: '4pt 0pt' }}><span style={{ color: "#333333" }}>Comments:</span></p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: 'none', padding: '4pt' }}>
                            {props.items["Comments"]!=""&&props.items["Comments"]!=null&&props.items["Comments"]?.map((cmtData: any, i: any) => {
                              return <div style={{ border: 'solid #cccccc 1.0pt', padding: '4pt', marginTop: '0pt', marginBottom:'4pt' }}>
                                <div style={{ marginBottom: "3.75pt" }}>
                                  <p style={{ margin: '0pt' }}>
                                    <span style={{ color: 'black' }}>{cmtData?.AuthorName} - {cmtData?.Created}</span></p>
                                </div>
                                <p style={{ marginBottom: '4pt' }}>
                                  <span style={{ color: 'black' }}>{cmtData?.Description}</span></p>
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