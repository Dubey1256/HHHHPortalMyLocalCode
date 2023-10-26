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
                                           
                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subCompleted != '' && val?.subCompleted != '' ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                            </svg> : <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">

                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />

                                            </svg>}</td>

                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subDeployed != undefined && val?.subDeployed != '' ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                            </svg> : <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">

                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />

                                            </svg>}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subQAReviews != undefined && val?.subQAReviews != '' ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                            </svg> : <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">

                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />

                                            </svg>}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{val?.subInProgress != undefined && val?.subInProgress != '' ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                            </svg> : <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">

                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />

                                            </svg>}</td>

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
                                            
                                           <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subCompleted != '' && ele?.subCompleted != undefined ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                            </svg> : <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">

                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />

                                            </svg>}</td>

                                            <td  style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subDeployed != undefined && ele?.subDeployed != '' ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                            </svg> : <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">

                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />

                                            </svg>}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subQAReviews != undefined && ele?.subQAReviews != '' ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                            </svg> : <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">

                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />

                                            </svg>}</td>

                                            <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4pt' }}>{ele?.subInProgress != undefined && ele?.subInProgress != '' ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                            </svg> : <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">

                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />

                                            </svg>}</td>

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