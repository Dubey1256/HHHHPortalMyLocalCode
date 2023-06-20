import * as React from "react";
import { useState, useEffect } from "react";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";

// import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
// import { Web } from 'sp-pnp-js';
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import { BorderBottomSharp } from "@material-ui/icons";
import { sendEmail } from "../../../globalComponents/globalCommon";
const EmailComponenet = (props: any) => {
  // const BindHtmlBody() {
  //     let body = document.getElementById('htmlMailBody')
  //     console.log(body?.innerHTML);
  //     return "<style>p>br {display: none;}</style>" + body?.innerHTML;
  //   }
// const [red,setRed]:any=useState(false);
// props?.data?.map((item:any)=>{
//   if(item.eventType == "Un-Planned"){
//     setRed(true);
//     SendEmail();
//   }      else{
//     setRed(false);
//     SendEmail();
//   }
// })

 React.useEffect(() => {
    //void getSPCurrentTimeOffset();
    // P_UP();
    SendEmail()
  }, []);

  // const P_UP =()=>{
  //   props.data?.map((item:any)=>{
  //     if(item.eventType == "Un-Planned"){
  //       setRed(true);
  //       SendEmail();
  //     }      else{
  //       setRed(false);
  //       SendEmail();
  //     }
  //   })
  // }
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB");

  const SendEmail = () => {
    let sp = spfi().using(spSPFx(props.Context));
    sp.utility
      .sendEmail({
        //Body of Email
        //   Body: this.BindHtmlBody(),
        Body: BindHtmlBody(),
        //Subject of Email
        //   Subject: emailprops.Subject,
        Subject: "Leave and Attendance- "+formattedDate ,
        //Array of string for To of Email
        //   To: emailprops.To,
        To: ["Ranu.trivedi@hochhuth-consulting.de"],
        AdditionalHeaders: {
          "content-type": "text/html",
        },
      })
      .then(() => {
        console.log("Email Sent!");
        alert("Email Sent!");
      })
      .catch((error) => {
        alert("error");
      });
  };

  const BindHtmlBody = () => {
    let body = document.getElementById("htmlMailBodyemail");
    console.log(body.innerHTML);
    return "<style>p>br {display: none;}</style>" + body.innerHTML;
  };
 

  return (
    <div>
      <div id="htmlMailBodyemail" style={{ display: "none" }}>
        <div style={{ marginTop: "2pt" }}>Hello sir,</div>
        <div style={{ marginTop: "2pt" }}>
          Below is the today's leave report.
        </div>
      

      <div>
        <table data-border="1" cellSpacing={0}>
          <thead>
            <tr style={{textAlign:"center", padding:"5px",background:"#c5d9f1"}}>
                <th style={{border:"1px solid #000"}} colSpan={5} >{formattedDate}</th>
            </tr>
            <tr style={{textAlign:"center", padding:"5px",background:"#fcd5b4"}}>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>S No.</th>
                <th style={{borderBottom:"1px solid #000"}}>Name</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>Designation</th>
                <th style={{borderBottom:"1px solid #000"}}>Attendance</th>
                <th style={{border:"1px solid #000",borderTop:"0px"}}>Reason</th>
            </tr>
            {props.data?.map((item:any,index:any)=>{
                return(
                    <tr style={{textAlign:"center", padding:"5px",background:"#fff"}}>
                        <td style={{border:"1px solid #000",borderTop:"0px"}}>
                            {index+1}
                        </td>
                        <td style={{borderBottom:"1px solid #000"}}>
                            {item.title}
                        </td>
                        <td style={{border:"1px solid #000",borderTop:"0px"}}>
                            {item.iD}
                        </td>
                        
                        
                          <td style={item.eventType=="Un-Planned"?{border:"1px solid #000",background:"#f00"}:{borderBottom:"1px solid #000",background:"#0ac55f"}}>
                          {item.eventType}
                      </td>
                      
                        
                        <td style={{border:"1px solid #000",borderTop:"0px"}} dangerouslySetInnerHTML={{__html: item.desc}}></td>
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
