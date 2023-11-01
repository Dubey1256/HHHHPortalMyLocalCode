import * as React from 'react';
import { useEffect } from 'react';
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';

var data: any = []
const SendEmailEODReport = (props: any) => {

    useEffect(() => {
        SendEmail();
    }, [])
    const BindHtmlBody = () => {
        let body = document.getElementById('htmlMailBodyEmail')
        console.log(body.innerHTML);
        return "<style>p>br {display: none;}</style>" + body.innerHTML;
    }
    const SendEmail = () => {
        var To: any = []
        var from: any = undefined
        var ReportDate = new Date()
       var ReportDatetime =Moment(ReportDate).format('DD/MM/YYYY')
        To.push('prashant.kumar@hochhuth-consulting.de')
        var subject = `Todays working report: ${ReportDatetime}`
        var cc: any = []

        let sp = spfi().using(spSPFx(props.Context));
        sp.utility.sendEmail({
            Body: BindHtmlBody(),
            Subject: subject,
            To: To,
            CC: cc,
            AdditionalHeaders: {
                "content-type": "text/html"
            },
        }).then(() => {
            console.log("Email Sent!");
            console.log(data)
            alert('Email sent sucessfully');
            props.close()
        })
            .catch((err) => {
                console.log(err.message);
            });




    }


    return (
        <>

            {props != undefined &&
                <div id='htmlMailBodyEmail' style={{ display: 'none' }}>
                    <p>Hi there,</p> 
                    <p>Below is the today's report on which team has worked</p>
                    <table cellPadding="0" width="100%" style={{ width: "100.0%" }}>
                        <thead>
                            <tr style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>
                                <th>TaskID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Team</th>
                                <th>%</th>
                                <th>Point Description</th>
                                <th>Completed</th>
                                <th>Deployed</th>
                                <th>QA Reviews</th>
                                <th>In Progress</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props?.WorkingTask.map((val: any) => {
                                return (
                                    <>
                                   
                                     
                                        <tr>
                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.TaskID}</td>
                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}><a href={`${val?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${val?.Id}&Site=${val?.siteType}`} target="_blank" data-interception="off">{val?.Title}</a></td>
                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.Category}</td>
                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.TeamMember}</td>
                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.PercentComplete}</td>
                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subTitle?.replace(/<[^>]*>/g, ' ')}</td>
                                           
                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subCompleted != '' && val?.subCompleted != '' ? 'Y': ''}

                                                </td>

                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subDeployed != undefined && val?.subDeployed != '' ? 'Y': ''}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subQAReviews != undefined && val?.subQAReviews != '' ? 'Y': ''}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subInProgress != undefined && val?.subInProgress != '' ? 'Y': ''}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subRemarks}</td>
                                        </tr>
                                        {val?.subChilds?.map((ele:any)=>{
                                            return(
                                                <>
                                                <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                           <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subTitle}</td>
                                            
                                           <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subCompleted != '' && ele?.subCompleted != undefined ? 'Y': ''}</td>

                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subDeployed != undefined && ele?.subDeployed != '' ? 'Y': ''}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subQAReviews != undefined && ele?.subQAReviews != '' ? 'Y': ''}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subInProgress != undefined && ele?.subInProgress != '' ? 'Y': ''}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subRemarks}</td>
                                        </tr>
                                                </>
                                            )
                                        })}
                                        
                        
                                        
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            }

        </>
    )
}
export default SendEmailEODReport;


//    (this.approvalcallback() }}  Context={this.props.Context}  currentUser={this.currentUser} items={this.state.Result})


//    we have to pass the callback function and context and currentUser and all items
//    allItems will be an object form .
//    currentUser will be an Array.
//    context will be an object
//    approvalcallback will be a Function .  