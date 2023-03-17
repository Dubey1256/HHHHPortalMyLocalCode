import * as React from 'react';
import  { useState,useEffect } from 'react';
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
 import { Web } from 'sp-pnp-js';
 let count=0;
 let percentage=1;
 const EmailComponenet=( props:any)=>{
  // const [taskdetails,setTaskDetails]=useState(null);
   const [taskpermission,settaskpermission]=useState(null);
   const [show, setshow]=useState(true);
   useEffect(()=>{
    // getResult();
   },[])
    console.log(props);
    percentage= props.items["PercentComplete"]
  // const getResult= async()=>{
  //   let web = new Web(props.siteUrl);
  //   let taskDetails = [];
  //   taskDetails = await web.lists
  //     .getByTitle(props.items.listName)
  //     .items
  //     .getById(props.items.Id)
  //     .select("ID", "Title", "Comments","DueDate","Approver/Id","Approver/Title","SmartInformation/Id","AssignedTo/Id","SharewebTaskLevel1No","SharewebTaskLevel2No","OffshoreComments","AssignedTo/Title","OffshoreImageUrl","SharewebCategories/Id","SharewebCategories/Title", "ClientCategory/Id","ClientCategory/Title", "Status", "StartDate", "CompletedDate", "Team_x0020_Members/Title", "Team_x0020_Members/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "component_x0020_link", "FeedBack", "Responsible_x0020_Team/Title", "Responsible_x0020_Team/Id", "SharewebTaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
  //   .expand("Team_x0020_Members","Approver","SmartInformation","AssignedTo","SharewebCategories", "Author", "ClientCategory","Responsible_x0020_Team", "SharewebTaskType", "Component", "Services", "Editor", "AttachmentFiles")
  //   .get()
  //     console.log(taskDetails);
  //     setTaskDetails(taskDetails)
  // }
  if( props?.items?.FeedBack!=null||props?.items?.FeedBack!=undefined){
    let isShowLight=0;
    let NotisShowLight=0
    props.items.FeedBack.map((item:any)=>{
      if(item.FeedBackDescriptions!=undefined){
        item.FeedBackDescriptions.map((feedback:any)=>{
          if(feedback.subtext!=undefined&&feedback.subtext.length>0){
            feedback?.subtext.map((subtextitem:any)=>{
              if(subtextitem.isShowLight!=""&&subtextitem.isShowLight!=undefined ){
                // count=1
                isShowLight=isShowLight+1;
            
              }
              
              else{
                // count=0;
                NotisShowLight=0;
              }
            })
            
          }
          if(feedback.isShowLight!=""&&feedback.isShowLight!=undefined ){
            // count=1
            isShowLight=isShowLight+1;
        
          }
          
          else{
            // count=0;
            NotisShowLight=0;
          }
        })
      }
    })

    if(isShowLight>NotisShowLight){
      count=1;
    }
  }

  const updateData=async( permission:any)=>{
    settaskpermission(permission)
    const web = new Web(props.items?.siteUrl );
      const feedback:any=props.items?.FeedBack!=null?props.items.FeedBack:null;
      feedback?.map((items:any)=>{
       if( items.FeedBackDescriptions!=undefined&&items.FeedBackDescriptions.length>0){
        items.FeedBackDescriptions.map((feedback:any)=>{
          if(feedback.Subtext!=undefined){
            feedback.Subtext.map((subtext:any)=>{
              if(subtext.isShowLight===""){
            
                subtext.isShowLight=permission
              }else{
               
                subtext.isShowLight=permission
              }
            })
          }
          if(feedback.isShowLight===""){
            
            feedback.isShowLight=permission
          }else{
           
            feedback.isShowLight=permission
          }
         })
       }
      })
      console.log(feedback);
      let percentageComplete;
      if(permission=="Approve"){
        percentageComplete=0.03;
      }
      else{
        percentageComplete=0.02;
      }
      await web.lists.getByTitle(props.items.listName).items.getById(props.items.Id).update({
        PercentComplete: percentageComplete,
        FeedBack: feedback?.length > 0 ? JSON.stringify(feedback) : null
      }).then((res:any)=>{
       console.log(res);
       props.approvalcallback();
       
     })
     .catch((err) => {
       console.log(err.message);
    });
   };
  
 const sendEmail=async(send:any)=>{
  
  if(send=="Approved"){
   await updateData("Approve");
  }
  else if(send=="Rejected"){
    await updateData("Reject");
  }
  
  console.log(props);
  let mention_To: any = [];
  mention_To.push(props?.items?.Author[0]?.Name.replace('{', '').replace('}', '').trim());
  console.log(mention_To);
  if (mention_To.length > 0) {
    let emailprops = {
      To: mention_To,
      Subject: "["+props?.items?.siteType+"-"+send+"]"+props?.items?.Title,
      Body: props.items.Title
    }
    console.log(emailprops);

    SendEmailFinal(emailprops);
    }
 
   }
   const BindHtmlBody=()=> {
    let body = document.getElementById('htmlMailBodyemail')
    console.log(body.innerHTML);
    return "<style>p>br {display: none;}</style>" + body.innerHTML;
  }
  
  const SendEmailFinal=async(emailprops: any)=> {
 let sp= spfi().using(spSPFx(props.Context));
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
      count=1;
    }) .catch((err) => {
      console.log(err.message);
  });
  }
  const  joinObjectValues=(arr: any)=> {
    let val = '';
    arr.forEach((element: any) => {
      val += element.Title + ';'
    });
    return val;
  }
   return(
      <>
     {props?.items?.Approver!=undefined &&props?.items?.Categories?.includes("Approval")&& props?.currentUser!=undefined && props?.items?.Approver?.Title==props.currentUser[0]?.Title&&count==0
      &&<span><button  onClick={()=>sendEmail("Approved")}className="btn btn-success ms-3 mx-2">Approve</button><span><button className="btn btn-danger"onClick={()=>sendEmail("Rejected")}>Reject</button></span></span>
     }
   
   {props.items != null  &&props.Approver!=undefined&&
        <div id='htmlMailBodyemail' style={{ display: 'none' }}>
          <div style={{marginTop:"2pt"}}>Hi,</div>
        {taskpermission!=null&&taskpermission=="Approve"&&<div style={{marginTop:"2pt"}}>Your task has been {taskpermission} by {props.items?.Approver?.Title}, team will process it further. Refer {taskpermission} Comments.</div>}
        {taskpermission!=null&&taskpermission=="Reject"&&<div style={{marginTop:"2pt"}}>Your task has been {taskpermission} by {props?.items?.Approver?.Title}. Refer {taskpermission} Comments.</div>}
         
          <div style={{ marginTop: "11.25pt" }}>
            <a href={props.items["TaskUrl"]} target="_blank">{props.items["Title"]}</a><u></u><u></u></div>
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
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["ID"]}</span><u></u><u></u></p>
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
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["StartDate"]}</span><u></u><u></u></p>
                        </td>
                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Completion Date:</span></b><u></u><u></u></p>
                        </td>
                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["CompletedDate"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                        </td>
                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Due Date:</span></b><u></u><u></u></p>
                        </td>
                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["DueDate"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
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
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created By:</span></b><u></u><u></u></p>
                        </td>
                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["StartDate"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                        </td>
                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created:</span></b><u></u><u></u></p>
                        </td>
                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Author"] != null && props.items["Author"].length > 0 && props.items["Author"][0].Title}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
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
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{props.items["Status"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                        </td>
                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>% Complete:</span></b><u></u><u></u></p>
                        </td>
                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{percentage}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>URL:</span></b><span style={{ color: "black" }}> </span><u></u><u></u></p>
                        </td>
                        <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p><span style={{ fontSize: '10.0pt', color: 'black' }}>
                            {props.items["component_url"] != null &&
                              <a href={props.items["component_url"].Url} target="_blank">{props.items["component_url"].Url}</a>
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
                  <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
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
                              <td>
                                <p><span style={{ fontSize: '10.0pt', color: '#6f6f6f' }}>{i + 1}.<u></u><u></u></span></p>
                              </td>
                              <td><span dangerouslySetInnerHTML={{ __html: fbData['Title'] }}></span>
                                {fbData['Comments'] != null && fbData['Comments'].length > 0 && fbData['Comments'].map((fbComment: any) => {
                                  return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                    <div style={{ marginBottom: '3.75pt' }}>
                                      <p style={{ marginLeft: '1.5pt', background: '#fbfbfb' }}><span>{fbComment.AuthorName} - {fbComment.Created}<u></u><u></u></span></p>
                                    </div>
                                    <p style={{ marginLeft: '1.5pt', background: '#fbfbfb' }}><span><span dangerouslySetInnerHTML={{ __html: fbComment['Title'] }}></span><u></u><u></u></span></p>
                                  </div>

                                })}
                              </td>
                            </tr>
                            {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext'].map((fbSubData: any, j: any) => {
                              return <>
                                <tr>
                                  <td>
                                    <p><span style={{ fontSize: '10.0pt', color: '#6f6f6f' }}>{i + 1}.{j + 1}.<u></u><u></u></span></p>
                                  </td>
                                  <td><span dangerouslySetInnerHTML={{ __html: fbSubData['Title'] }}></span>
                                    {fbSubData['Comments'] != null && fbSubData['Comments']?.length > 0 && fbSubData['Comments']?.map((fbSubComment: any) => {
                                      return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                        <div style={{ marginBottom: '3.75pt' }}>
                                          <p style={{ marginLeft: '1.5pt', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: 'black' }}>{fbSubComment.AuthorName} - {fbSubComment.Created}<u></u><u></u></span></p>
                                        </div>
                                        <p style={{ marginLeft: '1.5pt', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: 'black' }}><span dangerouslySetInnerHTML={{ __html: fbSubComment['Title'] }}></span><u></u><u></u></span></p>
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
                  <table cellPadding={0} width="100%" style={{ width: '100.0%', border: 'solid #dddddd 1.0pt', borderRadius: '4px' }}>
                    <tbody>
                      <tr>
                        <td style={{ border: 'none', borderBottom: 'solid #dddddd 1.0pt', background: 'whitesmoke', padding: '.75pt .75pt .75pt .75pt' }}>
                          <p style={{ marginBottom: '1.25pt' }}><span style={{ color: "#333333" }}>Comments:<u></u><u></u></span></p>
                        </td>
                      </tr>
                      <tr>
                      
                        <td style={{ border: 'none', padding: '.75pt .75pt .75pt .75pt' }}>
                        {props?.items["Comments"]!=undefined && props?.items["Comments"]?.length>0&&props.items["Comments"]?.map((cmtData: any, i: any) => {
                            return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                              <div style={{ marginBottom: "3.75pt" }}>
                                <p style={{ marginBottom: '1.25pt', background: '#fbfbfb' }}>
                                  <span style={{ color: 'black' }}>{cmtData.AuthorName} - {cmtData.Created}</span></p>
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
      }
   </>
   )
}
export default EmailComponenet;