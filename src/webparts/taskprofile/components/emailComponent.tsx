  import * as React from 'react';
  import  { useState } from 'react';
  import "@pnp/sp/sputilities";
   const EmailComponenet=( props:any)=>{
    const[emailBody,setemailBody]=useState(null)
    console.log(props);
   const sendEmail=()=>{
    // let emailprops = {
    //   To: mention_To,
    //   Subject: "[" + this.params1.get('Site') + " - Comment by " + this.props.Context.pageContext.user.displayName + "] " + this.state.Result["Title"],
    //   Body: this.state.Result["Title"]
    // }
    // console.log(emailprops);
     }
     return(
        <>
       {props.Approver!=undefined && props.currentUser!=undefined&&props.Approver.Title==props.currentUser.Title
        &&<span><button  onClick={sendEmail}>Approve</button><span><button onClick={sendEmail}>Reject</button></span></span>
        }
     </>
     )
 }
 export default EmailComponenet;