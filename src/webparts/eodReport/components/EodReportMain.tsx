import * as React from 'react';
import { Web } from "sp-pnp-js";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
// import '../../../index.css'

import { ColumnDef } from "@tanstack/react-table";
import Moment from 'moment-timezone';
import HighlightableCell from "../../../globalComponents/GroupByReactTableComponents/highlight";

import { Panel, PanelType } from "office-ui-fabric-react";
import { Avatar } from "@fluentui/react-components";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import PortfolioLeadEOD from './PortFolioLeadEOD';

let forceAllAditionalTaskCall: any = [];
let copyAllAditionalTaskData: any = [];
let forceAllTodayModifiedTaskCall = [];
let AllProtFolioTeamMembers: any;
let loginUserInfo: any;
var AllListId: any;
let timesheetListConfig: any = [];
let AllTaskTimeEntries: any = [];
let todayAllTaskData: any = [];
let todayAllEODTaskData: any = [];
let body1: any = [];
let body: any = '';
let finalBody: any = [];
let allUsers: any

export const EodReportMain = (props: any) => {
    const [allTodayModifiedTask, setAllTodayModifiedTask]: any = React.useState([])
    const refreshData = () => setallAditionalTask(() => forceAllAditionalTaskCall);
    const [allAditionalTask, setallAditionalTask]: any = React.useState([])
    copyAllAditionalTaskData = allAditionalTask;
    const [loaded, setLoaded] = React.useState(false);
    let childRefdata: any;
    let nextUniqueId = 1;

    const childRef = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };

    }
    const [editableCells, setEditableCells] = React.useState<{ [key: string]: boolean }>({});
    const [achievedValue, setAchievedValue] = React.useState<{ [key: string]: string }>({});
    const [pendingValue, setPendingValue] = React.useState<{ [key: string]: string }>({});
    const [selectedTasks, setSelectedTasks]: any = React.useState([]);
    const [selectedTasksData, setSelectedTasksData]: any = React.useState([]);
    const currentUserData: any = props.props?.context?.pageContext?._legacyPageContext?.userId;
    const siteURL: any = props.props.context?._pageContext?.web?.absoluteUrl
    const [currentPageEoDReport, setCurrentPageEoDReport] = React.useState(1);
    const [currentPageAdditionalTask, setCurrentPageAdditionalTask] = React.useState(1);
    const [itemsPerPage] = React.useState(10);
    const [showPanel, setShowpanel] = React.useState(false)
    const [panelAchivedComment, setPanelAchivedComment] = React.useState('')
    const [panelPendingComment, setPanelPendingComment] = React.useState('')
    const [panelTitle, setPanelTitle] = React.useState('')
    const [loginUserData, setLoginUserData] = React.useState([])
    const [selectedPanelTask, setSelectedPanelTask]: any = React.useState()
    const [selectedTaskForEod, setSelectedTaskForEod]: any = React.useState([])
    const [teamMembers, setTeamMembers]: any = React.useState([])
    const [editPanelType, setEditPanelType]: any = React.useState();
    // console.log(currentUserData, "currentUserDatacurrentUserData");
    AllListId = {
        MasterTaskListID: props.props.MasterTaskId,
        TaskUserListID: props.props.TaskUserListID,
        SmartMetadataListID: props.props.SmartMetadataListID,
        siteUrl: props.props.context?._pageContext?.web?.absoluteUrl,
        Context: props.props.context,
    }

    const handleEdit = (task: any, type: number) => {
        console.log(task, "taskId");
        setShowpanel(true)
        setPanelAchivedComment(task?.Achieved)
        setPanelPendingComment(task?.Pending)
        setPanelTitle(task?.Title)
        setSelectedPanelTask(task)
        setEditPanelType(type)

        // setEditableCells({ ...editableCells, [taskId]: true });
    };

    const handleDelete = (task: any) => {
        console.log(task, "taskId");
        console.log(task, "taskId");
        onDeletepress(task)
    }

    const handleUpdate = (taskId: string) => {
        setEditableCells({ ...editableCells, [taskId]: false });
    };

    const handleChangeAchieved = (taskId: string, value: string) => {
        setAchievedValue({ ...achievedValue, [taskId]: value });
    };

    const handleChangePending = (taskId: string, value: string) => {
        setPendingValue({ ...pendingValue, [taskId]: value });
    };
    // const handleDelete = (task: any) => {
    //     setEditableCells({ ...editableCells, [taskId]: true });
    // };
    function getPreviousDateFormatted() {
        // Get the current date
        let currentDate = new Date();

        // Subtract one day
        currentDate.setDate(currentDate.getDate() - 1);

        // Format the date in the desired format
        let formattedDate = currentDate.toISOString();

        return formattedDate;
    }

    const handleTaskSelection = (taskId: any, isChecked: boolean, task: any) => {
        if (isChecked) {
            setSelectedTasks([...selectedTasks, taskId]);
            setSelectedTasksData([...selectedTasksData, task])

        } else {
            setSelectedTasks(selectedTasks.filter((id: any) => id !== taskId));
            setSelectedTasksData(selectedTasksData.filter((t: any) => t.ID !== task.ID));
        }
    };

    // Function to handle page change
    const handlePageChangeAdditionalTable = (pageNumber: any) => {
        setCurrentPageAdditionalTask(pageNumber);
    };

    const handlePageChange = (pageNumber: any) => {
        setCurrentPageEoDReport(pageNumber);
    };

    const findAndUpdateOffshoreComments = (objectToUpdate: any, newOffshoreComments: any,alloffshoreComment:any) => {
        allTodayModifiedTask.map((item: any) => {
            if (item.ID === objectToUpdate.ID) {
                item.OffshoreComments = [...alloffshoreComment];
                item.Achieved = newOffshoreComments?.Achieved;
                item.Pending = newOffshoreComments?.Pending;
              
            }
        });

        copyAllAditionalTaskData.map((item: any) => {
            if (item.ID === objectToUpdate.ID) {
                item.OffshoreComments =[...alloffshoreComment];
                item.Achieved = newOffshoreComments?.Achieved;
                item.Pending = newOffshoreComments?.Pending;
                
            }
        });
        setAllTodayModifiedTask(allTodayModifiedTask);
        if (copyAllAditionalTaskData?.length > 0) {
            forceAllAditionalTaskCall = [];
            forceAllAditionalTaskCall = forceAllAditionalTaskCall.concat(copyAllAditionalTaskData);
            refreshData();
        }
    };



    const onDeletepress = (selectedTaskForEod: any) => {

        if (!selectedTaskForEod || !selectedTaskForEod.OffshoreComments) {
            console.error('Invalid selectedTaskForEod object');
            return;
        }
        let OffshoreCommentsArray: any[] = [];
        if (typeof selectedTaskForEod.OffshoreComments === 'string') {
            try {
                OffshoreCommentsArray = JSON.parse(selectedTaskForEod.OffshoreComments);
            } catch (error) {
                console.error('Error parsing OffshoreComments:', error);
            }
        } else {
            OffshoreCommentsArray = selectedTaskForEod.OffshoreComments;
        }
            if(selectedTaskForEod.CommentUniqueID!=undefined&& selectedTaskForEod.CommentUniqueID==""){
                selectedTaskForEod.CommentUniqueID= getCommentUniqueID(selectedTaskForEod.OffshoreComments)
            }


        const updatedOffshoreComments:any = OffshoreCommentsArray.map((comment) => {
            if (selectedTaskForEod.CommentUniqueID == comment.ID) {
                return {
                    ...comment,
                    isEodTask: false
                };
            }
            return comment;
        });

        const updateValue = updatedOffshoreComments.find((comment: any) => comment.ID == selectedTaskForEod.CommentUniqueID) || {};
        const updatedTask = {
            ...selectedTaskForEod,
            OffshoreComments: updatedOffshoreComments
        };
        const combinedArray = [...copyAllAditionalTaskData, updatedTask];
        const removeFromAdditionalArray = allTodayModifiedTask.filter((item: { ID: any; }) => item.ID !== updatedTask.ID);
        setallAditionalTask(combinedArray)
        setAllTodayModifiedTask(removeFromAdditionalArray)
        setSelectedTaskForEod([])

        // combinedArray.map((item: any) => {
        updateCommentFunctionForAddToEoD(updateValue, "OffshoreComments", selectedTaskForEod?.oldOffshoreComments, selectedTaskForEod);
        // })
    };

    // const onEmailSend = () => {
    //     console.log(allAditionalTask, "allAditionalTask");
    //     let text = '';

    //     allAditionalTask.map((item: any) => {
    //         text = `<tr>
    //         <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"><p style="margin:0px; color:#333;"><a style="text-decoration: none;" href =${"https://hhhhteams.sharepoint.com/sites/HHHH/SP"}/SitePages/PX-Profile.aspx?ProjectId=${item.ProjectId}> ${item?.ProjectTitle ?? ''} </a></p></td>
    //         <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"><p style="margin:0px; color:#333;"><a style="text-decoration: none;" href =${"https://hhhhteams.sharepoint.com/sites/HHHH/SP"}/SitePages/Task-Profile.aspx?taskId=${item?.Id}&Site=${item?.siteType}> ${item?.Title ?? ''} </a></p></td>
    //         <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.Achived ?? 'This is test Data to check sdbsdsd dgdg dd s gd d'} </td>
    //         <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.Pending ?? 'This is test Data to check sdbsdsd dgdg dd s gd d'} </td>
    //         <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.Lead ?? ''} </td>
    //         </tr>`
    //         body1.push(text);
    //     })
    //     if (body1?.length > 0) {
    //         body =
    //             ` <table cellpadding="0" cellspacing="0" align="left" width="100%" border="1" style=" border-color: #444;margin-bottom:10px">
    //         <thead>
    //         <tr>
    //         <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Project</th>
    //         <th width="400" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Title</th>
    //         <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Completed Task</th>
    //         <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Pending Task</th>
    //         <th width="70" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px" >Lead</th>
    //         </tr>
    //         </thead>
    //         <tbody>
    //         ${body1}
    //         </tbody>
    //         </table>`
    //         body = body.replaceAll('>,<', '><').replaceAll(',', '')
    //     }
    //     console.log(body, "body1")
    //     finalBody.push(body)

    //     let sendAllTasks: any =
    //         '<span style="font-size: 18px;margin-bottom: 10px;">'
    //         + 'Hi there, <br><br>'
    //         + "Below is the today's EOD Report :"
    //         + '</span>'
    //         + body
    //         + '<h3>'
    //         + 'Thanks.'
    //         + '</h3>'
    //         + '<h3>'
    //         + props?.props.userDisplayName
    //         + '</h3>'
    //     let subject = `[EOD Report] ${Moment(new Date()).format('YYYY-MM-DD')} - ${allAditionalTask?.length ?? 0} Tasks`
    //     SendEmailFinal(["vansh.raj@hochhuth-consulting.de", "prashant.kumar@hochhuth-consulting.de"], subject, sendAllTasks.replaceAll(",", "  "));


    // }
    const onEmailSend = () => {
        console.log(allAditionalTask, "allAditionalTask");
        let body1: string[] = [];
        // Group tasks by ProjectTitle
        let groupedTasks = allTodayModifiedTask.reduce((acc: { [x: string]: any[]; }, item: { ProjectTitle: string; }) => {
            let title = item?.ProjectTitle ?? "Others";
            if (!acc[title]) {
                acc[title] = [];
            }
            acc[title].push(item);
            return acc;
        }, {});
        Object.keys(groupedTasks).forEach(projectTitle => {
            let tasks = groupedTasks[projectTitle];
            let firstTask = true;
            let lastTask = false
            tasks.forEach((item: { Id: any; siteType: any; Title: any; Achieved: any; Pending: any; Lead: any;ProjectId:any }, index: any) => {
                let projectTitleCell = `<tr>
                    <td height="48" align="left" width="180" valign="middle" style="background: #fff;color: #333;width:180px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-left: 1px solid #EEE; text-align: left; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                                            ${''}
                                        </td>`
                if (firstTask) {
                    projectTitleCell = ` <tr>
                    <td height="48" align="left" width="180" valign="middle" style="background: #fff;color: #333;width:180px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border-left: 1px solid #EEE; text-align: left; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                      <a style="color: #2F5596;" href="${siteURL}/SitePages/PX-Profile.aspx?ProjectId==${item?.ProjectId}">
                            ${projectTitle ?? ''}
                        </a>    
                   
                                        </td>`;
                    firstTask = false;
                }
                if (tasks?.length - 1 == 0) {
                    lastTask = true
                }

                let taskRow = ` 
                    ${projectTitleCell}
                    <td height="48"  width="240" valign="middle" style="background: #fff;color: #2F5596;width:220px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px; text-align: left; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                        <a style="color: #2F5596;" href="${siteURL}/SitePages/Task-Profile.aspx?taskId=${item?.Id}&Site=${item?.siteType}">
                            ${item?.Title ?? ''}
                        </a>
                    </td>
                    <td height="48"  width="400" align="left" valign="middle" style="background: #fff;color: #333;width:350px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;text-align: left; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                        ${item.Achieved ?? 'No data available'}
                    </td>
                    <td height="48"  width="400" align="left" valign="middle" style="background: #fff;color: #333;width:350px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;text-align: left; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                        ${item.Pending ?? 'No data available'}
                    </td>
                    <td height="48"  width="130" valign="middle" style="background: #fff;color: #333;width:130px;height:48px;font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;text-align: center; border-right: 1px solid #EEE;border-bottom: 1px solid #EEE;">
                        ${item.Lead ?? ''}
                    </td>
                </tr>
               
                `;
                body1.push(taskRow);
            });
        });

        let body = '';
        if (body1?.length > 0) {
            body = `<table width="100%" bgcolor="#FAFAFA" style="background-color:#FAFAFA;margin:-18px -10px;" align="center">
                <tr>
                    <td width="100%">
                        <table width="900px" align="center" bgcolor="#fff" style="width:1350px;padding:0px 32px;background-color:#fff;">
                            <tr>
                                <td width="100%">
                                    <div style="padding-top: 56px;" width="100%">
                                        <table style="height: 50px;border-collapse: collapse;" border="0" align="left">
                                            <tr>
                                                <td width="48px" height="48px"><img width="100%" height="100%" src="https://hochhuth-consulting.de/images/icon_small_hhhh.png" style="width: 48px;height: 48px;border-radius: 50%;" alt="Site Icon"></td>
                                                <td><div style="color: var(--black, #333);margin-left:4px;text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;">EOD Report</div></td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div width="100%">
                                        <table style="height: 56px;border-collapse: collapse;" border="0" width="100%" height="56px">
                                            <tr>
                                                <td width="100%" height="56px">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        
                <tr>
                <td>
                    <div>
                        <table width="100%" style="border-collapse: collapse;">
                            <tr>
                                <td>
                                    <div style="font-family: Segoe UI;color:#2F5596;font-weight:600;font-size:24px;margin-bottom:10px;">EOD Report ${Moment(new Date()).format('YYYY-MM-DD')}</div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <table width="100%" style="border-collapse: collapse;">
                            <tr>
                                <td width="180" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">Project</td>
                                <td width="220" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">Task Title</td>
                                <td width="350" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">Work Completed</td>
                                <td width="350" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">Work  Pending</td>
                                <td width="130" height="48" align="center" valign="middle" bgcolor="#FAFAFA" style="font-family: Segoe UI;font-size: 14px;font-style: normal;font-weight: 600;padding: 0px 8px;border: 1px solid #EEE; background: #FAFAFA;text-align: center;">Portfolio Lead</td>
                            </tr>
                    
                            <tbody>
                                ${body1.join('')}
                            </tbody>
                        </table>
                    </div>
                </td>
                </tr>
                <tr>
                    <td>
                        <table>
                            <tr>
                                <td width="100%" height="32px">&nbsp;</td>
                            </tr>
                            <tr>
                                <td width="260px" height="40px" align="center" style="background: #2F5596;display: flex;justify-content: center;align-items: center;gap: 8px;flex-shrink: 0;border-radius: 4px;
                                    font-family: Segoe UI;width:260px;height:40px;font-size: 14px;font-style: normal;font-weight: 600;line-height: normal;">
                                    <a width="260px" height="40px" style="color:#fff;text-decoration: none;" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/EodReport.aspx">
                                        See EOD Tool Online
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" height="88px">&nbsp;</td>
                            </tr>
                        </table>
                        <table style="height: 50px;border-collapse: collapse;" border="0" align="left">
                            <tr>
                                <td width="56px" height="48px"><img src="https://hochhuth-consulting.de/images/logo_small2.png" style="width: 56px;height: 48px;" alt="Site Icon"></td>
                                <td style="margin-left:4px;"><div style="color: var(--black, #333);text-align: center;font-family: Segoe UI;font-size: 14px;font-style: normal; font-weight: 600;margin-left: 4px;">Hochhuth Consulting GmbH</div></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                    </td>
                </tr>
            </table>
            
            `;
        }

        console.log(body, "body1");
        finalBody.push(body);

        let sendAllTasks = `
            
            ${body}
            
        `;

        let subject = `[EOD Report] ${Moment(new Date()).format('YYYY-MM-DD')} - ${allTodayModifiedTask?.length ?? 0} Tasks`;
        SendEmailFinal(
            ["prashant.kumar@hochhuth-consulting.de"],
            subject,
            sendAllTasks.replace(/,/g, "  ")
        );
    };



    const SendEmailFinal = async (to: any, subject: any, body: any) => {
        let sp = spfi().using(spSPFx(AllListId?.Context));
        sp.utility.sendEmail({
            //Body of Email  
            Body: body,
            //Subject of Email  
            Subject: subject,
            //Array of string for To of Email  
            To: to,
            AdditionalHeaders: {
                "content-type": "text/html",
                'Reply-To': 'abhishek.tiwari@smalsus.com'
            },
        }).then(() => {
            console.log("Email Sent!");
            alert("Successfully sent")

        }).catch((err: { message: any; }) => {
            console.log(err.message);
            alert("Error")

        });



    }
    // const onAddpress = () => {
    //     const filterarrray = selectedTaskForEod.map((item: any) => {
    //         let OffshoreCommentsArray;
    //         if (typeof item.original.OffshoreComments === 'string') {
    //             OffshoreCommentsArray = JSON.parse(item.original.OffshoreComments);

    //         }
    //         else {
    //             OffshoreCommentsArray = [item.original.OffshoreComments];
    //         }
    //         try {
    //         } catch (error) {
    //             console.error('Error parsing OffshoreComments:', error);
    //             // Handle the error appropriately, e.g., provide a default value or log the error
    //         }
    //         const updatedOffshoreComments = OffshoreCommentsArray?.map((comment: any) => {
    //             if (comment.hasOwnProperty('isEodTask')) {
    //                 return {
    //                     ...comment,
    //                     isEodTask: true
    //                 };
    //             }
    //             return {
    //                 ...comment,
    //                 isEodTask: true
    //             };
    //         });

    //         return {
    //             ...item.original,
    //             OffshoreComments: updatedOffshoreComments,
    //             oldOffshoreComments: updatedOffshoreComments

    //         };
    //     });
    //     const combinedArray = [...allTodayModifiedTask, ...filterarrray];
    //     const removeFromAdditionalArray = allAditionalTask.filter((item1: { ID: any; }) => !filterarrray.some((item2: { ID: any; }) => item1.ID === item2.ID));
    //     setallAditionalTask(removeFromAdditionalArray)
    //     setAllTodayModifiedTask(combinedArray)
    //     setSelectedTaskForEod([])

    //     combinedArray.map((item: any) => {
    //         updateCommentFunctionForAddToEoD(item?.OffshoreComments[0], "OffshoreComments", item?.oldOffshoreComments, item);
    //     })
    //     childRef?.current?.setRowSelection({});
    // }


    const onAddpress = () => {
        let isPendingEmpty:any=false
        let isAcheviedEmpty:any =false
        let bothEmpty:any =false  
        selectedTaskForEod.map((items:any)=>{
            let checkEmptyComment:any; 
            if(items?.original?.OffshoreComments!=undefined){
               if(typeof items.original.OffshoreComments === 'string'){
                try {
                    checkEmptyComment = JSON.parse(items?.original?.OffshoreComments)
                } catch (error) {
                    console.error('Error parsing OffshoreComments:', error);
                }
               }else{
                checkEmptyComment=items.original.OffshoreComments
               }
                let EodRoprtAvialble = checkEmptyComment?.some((comment: any) => {
                    if (comment?.Type=="EODReport") {
                        return true;
                    } 
                })
               if(EodRoprtAvialble!=undefined && EodRoprtAvialble==true){
                checkEmptyComment.map((comment:any)=>{
                    if(comment.Type=="EODReport"){
                     if(comment?.Achieved==null||comment?.Achieved ==undefined || comment?.Achieved ==''){
                        isAcheviedEmpty=true
                     }
                     else if(comment?.Pending==null||comment?.Pending ==undefined || comment?.Pending ==''){
                         isPendingEmpty=true
                     }
                    }
                 })
               }else{
                bothEmpty=true
               }
                
            } else{
                bothEmpty=true
            }
        })
        if( isPendingEmpty == false && isAcheviedEmpty==false && bothEmpty==false){
            const filterarrray = selectedTaskForEod?.map((item: any) => {
                let OffshoreCommentsArray;
                if (typeof item.original.OffshoreComments === 'string') {
                    OffshoreCommentsArray = JSON.parse(item.original.OffshoreComments);
                }
                else {
                    OffshoreCommentsArray = item.original.OffshoreComments;
                }
                try {
                } catch (error) {
                    console.error('Error parsing OffshoreComments:', error);
                    // Handle the error appropriately, e.g., provide a default value or log the error
                }
                const updatedOffshoreComments = OffshoreCommentsArray?.map((comment: any) => {
                    if (comment.hasOwnProperty('isEodTask')) {
                        return {
                            ...comment,
                            isEodTask: true
                        };
                    }
                    return {
                        ...comment,
                        isEodTask: true
                    };
                });
    
                return {
                    ...item.original,
                    OffshoreComments: updatedOffshoreComments,
                    oldOffshoreComments: updatedOffshoreComments
    
                };
            });
            const combinedArray = [...allTodayModifiedTask, ...filterarrray];
            const removeFromAdditionalArray = allAditionalTask.filter((item1: { ID: any; }) => !filterarrray.some((item2: { ID: any; }) => item1.ID === item2.ID));
            setallAditionalTask(removeFromAdditionalArray)
            setAllTodayModifiedTask(combinedArray)
            setSelectedTaskForEod([])
    
            combinedArray.map((item: any) => {
                updateCommentFunctionForAddToEoD(item?.OffshoreComments, "OffshoreComments", item?.oldOffshoreComments, item);
            })
            childRef?.current?.setRowSelection({});

        }else{
         if(isPendingEmpty == true){
            alert("Please fill the pending Comment")
         }  else if(isAcheviedEmpty== true){
            alert("Please fill the achived Comment")
         } else if(bothEmpty == true){
            alert("Please fill the achived and pending Comments")
         }
        }

    }
    // Pagination EOD Report
    const indexOfLastItem = currentPageEoDReport * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allTodayModifiedTask.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination AdditionalTask
    const indexOfLastItemAdditionalTable = currentPageAdditionalTask * itemsPerPage;
    const indexOfFirstItemAdditionalTable = indexOfLastItemAdditionalTable - itemsPerPage;
    const currentItemsAdditionalTable = allAditionalTask.slice(indexOfFirstItemAdditionalTable, indexOfLastItemAdditionalTable);
    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 5,
                id: 'Id',
            },

            {
                accessorFn: (row) => row?.ProjectTitle,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != (null || undefined) &&
                            <span className=""><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${siteURL}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.ProjectId}`} >
                                {row?.original?.ProjectTitle}</a></span>
                        }
                    </>
                ),
                id: "ProjectTitle",
                placeholder: "ProjectTitle",
                header: "",
                resetColumnFilters: false,
                size: 60,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>

                        {row?.original?.Title != (null || undefined) &&
                            <span className=""><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${siteURL}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`} >
                                {row?.original?.Title}</a></span>
                        }
                    </>),
                id: "Title",
                placeholder: "Title",
                header: "",
            
                resetColumnFilters: false,
                isColumnVisible: true
            }
            , {
                accessorFn: (row) => row?.TaskCategories,
                cell: ({ row, getValue }) => (
                    <div>
                        {row?.original?.TaskCategories}
                    </div>
                ),
                id: "TaskCategories",
                placeholder: "TaskCategories",
                header: "",
                resetColumnFilters: false,
                size: 140,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Achieved,
                cell: ({ row, getValue }) => (
                    <div className="columnFixedTitle">
                        <span title={row?.original?.Achieved} className="text-content hreflink">
                            {row?.original?.Achieved}
                        </span>
                    </div>
                ),
                id: "Achieved",
                placeholder: "Achieved",
                header: "",
                resetColumnFilters: false,
                size: 330,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Pending,
                cell: ({ row, getValue }) => (
                    <div className="columnFixedTitle">
                        <span title={row?.original?.Pending} className="text-content hreflink">
                            {row?.original?.Pending}
                        </span>
                    </div>
                ),
                id: "Pending",
                placeholder: "Pending",
                header: "",
                resetColumnFilters: false,
                size: 330,
                isColumnVisible: true
            },

            {
                accessorFn: (row) => row?.Lead,
                cell: ({ row, getValue }) => (
                    <div>
                        {row?.original?.Lead}
                    </div>
                ),
                id: "Lead",
                placeholder: "Lead",
                header: "",
                resetColumnFilters: false,
                size: 130,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row, column }) => (
                    <div className="alignCenter">
                        {row?.original?.Created == null ? ("") : (
                            <>
                                <div style={{ width: "75px" }} className="me-1"><HighlightableCell value={row?.original?.DisplayCreateDate} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} /></div>
                                {row?.original?.Author != undefined &&
                                    <>

                                        <a href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank" data-interception="off">
                                            {row?.original?.Author?.autherImage || row?.original?.Author?.suffix ? <Avatar
                                                className="UserImage"
                                                title={row?.original?.Author?.Title}
                                                name={row?.original?.Author?.Title}
                                                image={{ src: row?.original?.Author?.autherImage }}
                                                initials={row?.original?.Author?.autherImage == undefined ? row.original?.Author?.suffix : undefined}

                                            /> :
                                                <Avatar title={row?.original?.Author?.Title}
                                                    name={row?.original?.Author?.Title} className="UserImage" />}
                                        </a>
                                    </>
                                }
                            </>
                        )}
                    </div>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                isColumnVisible: true,
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 100,
                fixedColumnWidth: true
            },
            {
                cell: ({ row, getValue }) => (
                    <>
                        <span onClick={() => handleEdit(row?.original, 2)} className="svg__iconbox svg__icon--edit"></span>

                    </>
                ),
                id: "editIcon",
                canSort: false,
                placeholder: "",
                header: "",
                size: 40,
                isColumnVisible: true
            },
        ],
        [allAditionalTask]
    );
    const columns1: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 20,
                id: 'Id',
            },
            {
                accessorFn: (row) => row?.projectStructerId,
                cell: ({ row, getValue }) => (
                    <> {row?.original?.projectStructerId != (null || undefined) &&
                        <span className="">
                            {row?.original?.projectStructerId}</span>
                    }
                    </>
                ),
                id: "projectStructerId",
                placeholder: "projectStructerId",
                header: "",
                resetColumnFilters: false,
                size: 100,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.ProjectTitle,
                cell: ({ row, getValue }) => (
                    <> {row?.original?.ProjectTitle != (null || undefined) &&
                        <span className=""><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${siteURL}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.ProjectId}`} >
                            {row?.original?.ProjectTitle}</a></span>
                    }
                    </>
                ),
                id: "ProjectTitle",
                placeholder: "ProjectTitle",
                header: "",
                resetColumnFilters: false,
                size: 100,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.Title != (null || undefined) &&
                            <span className=""><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${siteURL}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`} >
                                {row?.original?.Title}</a></span>
                        }
                    </>),
                id: "Title",
                placeholder: "Title",
                header: "",
                size: 100,
                resetColumnFilters: false,
                isColumnVisible: true
            },

            {
                accessorFn: (row) => row?.Achieved,
                cell: ({ row, getValue }) => (
                    <div className="columnFixedTitle">
                        <span title={row?.original?.Achieved} className="text-content hreflink">
                            {row?.original?.Achieved}
                        </span>
                    </div>
                ),
                id: "Achieved",
                placeholder: "Achieved",
                header: "",
                resetColumnFilters: false,
                size: 120,
                isColumnVisible: true
            },
            {
                accessorFn: (row) => row?.Pending,
                cell: ({ row, getValue }) => (
                    <div className="columnFixedTitle">
                        <span title={row?.original?.Pending} className="text-content hreflink">
                            {row?.original?.Pending}
                        </span>
                    </div>
                ),
                id: "Pending",
                placeholder: "Pending",
                header: "",
                resetColumnFilters: false,
                size: 120,
                isColumnVisible: true
            },

            {
                accessorFn: (row) => row?.Lead,
                cell: ({ row, getValue }) => (
                    <div>
                        {row?.original?.Lead}
                    </div>
                ),
                id: "Lead",
                placeholder: "Lead",
                header: "",
                resetColumnFilters: false,
                size: 80,
                isColumnVisible: true
            },

            {
                cell: ({ row, getValue }) => (
                    <>

                        <div className="alignCenter">
                            <span onClick={() => handleEdit(row?.original, 1)} className="svg__iconbox svg__icon--edit"></span>


                            <span onClick={() => handleDelete(row?.original)} className="svg__icon--trash  svg__iconbox"></span>
                        </div>
                    </>
                ),
                id: "editIcon",
                canSort: false,
                placeholder: "",
                header: "",
                size: 40,
                isColumnVisible: true
            },
        ],
        [allTodayModifiedTask]
    );





    // const loadAllMasterTaskData = async () => {
    //     let data = [];
    //     console.log(props?.props.userDisplayName, "props")

    //     try {
    //         let web = new Web(siteURL);
    //         data = await web.lists
    //             .getById(AllListId?.MasterTaskId).items
    //             .select("ID", "Id", "Title", "PortfolioLevel", "PortfolioStructureID", "Comments", "ItemRank", "Portfolio_x0020_Type", "Parent/Id", "Parent/Title", "HelpInformationVerifiedJson", "HelpInformationVerified",
    //                 "DueDate", "Body", "Item_x0020_Type", "Categories", "Short_x0020_Description_x0020_On", "PriorityRank", "Priority",
    //                 "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title", "PercentComplete",
    //                 "ResponsibleTeam/Id", "ResponsibleTeam/Title", "PortfolioType/Id", "PortfolioType/Color", "PortfolioType/IdRange", "PortfolioType/Title", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
    //                 "Created", "Modified", "Deliverables", "TechnicalExplanations", "Help_x0020_Information", "AdminNotes", "Background", "Idea", "ValueAdded", "Sitestagging", "FeatureType/Title", "FeatureType/Id"
    //             )
    //             .expand(
    //                 "Parent", "PortfolioType", "AssignedTo", "ClientCategory", "TeamMembers", "ResponsibleTeam", "Editor", "Author", "FeatureType"
    //             )
    //             .top(4999)
    //             .get();
    //         const filterData = data?.filter((metadata: any) => metadata?.Item_x0020_Type == 'Project' || metadata?.Item_x0020_Type == 'Sprint');



    //     }
    //     catch (error) {
    //         return Promise.reject(error);
    //     }

    // }

    const loadLoginUserData = async () => {
        let data = [];
        const filterString = 'AssingedToUser/Id eq ' + currentUserData;
        console.log(filterString, "filterString")
        try {
            let web = new Web(siteURL);
            data = await web.lists
                .getById(AllListId?.TaskUserListID).items
                .select(
                    "Id,UserGroupId,TimeCategory,CategoriesItemsJson,IsActive,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,UserGroup/Id,UserGroup/Title,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name"
                )
                .filter("IsActive eq 1")
                .expand("AssingedToUser,Approver,UserGroup")
                .orderBy("SortOrder", true)
                .orderBy("Title", true)
                .filter(filterString)
                .getAll();
            console.log(data, "data")
            setLoginUserData(data)
            loginUserInfo = data;
        }
        catch (error) {
            return Promise.reject(error);
        }

    }
    const loadAllUser = async () => {
        let data = [];
        try {
            let web = new Web(siteURL);
            data = await web.lists
                .getById(AllListId?.TaskUserListID).items
                .select(
                    "Id,UserGroupId,TimeCategory,CategoriesItemsJson,IsActive,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,UserGroup/Id,UserGroup/Title,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name"
                )
                .filter("IsActive eq 1")
                .expand("AssingedToUser,Approver,UserGroup")
                .orderBy("SortOrder", true)
                .orderBy("Title", true)
                .getAll();
            allUsers = data
            const teamMember = findDataByApproverId(data, currentUserData)
            AllProtFolioTeamMembers = teamMember
            setTeamMembers(teamMember)
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    const findDataByApproverId = (data: any[], searchId: number) => {
        let allMembers: any[] = [];
        for (const item of data) {
            if (item.Approver && Array.isArray(item.Approver)) {
                if (item.Approver.some((approver: { Id: number }) => approver.Id === searchId)) {
                    allMembers.push(item);
                }
            }
        }

        if (allMembers.length > 0) {
            return allMembers;
        } else {
            return null;
        }
    };
    function getStartingDate(relativeDay: string) {
        const now = new Date();
        const startOfDay = new Date(now.setDate(now.getDate() - (relativeDay === 'yesterday' ? 1 : 0)));
        startOfDay.setHours(0, 0, 0, 0); // Set to the start of the day
        return startOfDay;
    }

    const AddEODComment = () => {
        console.log(selectedPanelTask, "selectedPanelTask");
        if(selectedPanelTask.CommentUniqueID!=undefined&& selectedPanelTask.CommentUniqueID==""){
            selectedPanelTask.CommentUniqueID= getCommentUniqueID(selectedPanelTask.OffshoreComments)
        }
        let offshoreComments: any = [];
        let newId = 1;
        if (typeof selectedPanelTask.OffshoreComments === 'string') {
            try {
                offshoreComments = JSON.parse(selectedPanelTask.OffshoreComments);
            } catch (error) {
                console.error('Error parsing OffshoreComments:', error);
            }
        } else {
            offshoreComments = selectedPanelTask.OffshoreComments;
        } 
        console.log("Newly generated ID:", newId);
        if (offshoreComments == undefined || offshoreComments == null || offshoreComments == "[null]") {
            newId = 1;
            let CommentJSON = {
                AuthorId: currentUserData,
                Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                AuthorImage: loginUserData[0]?.Item_x0020_Cover?.Url ?? '',
                AuthorName: loginUserData[0]?.Title != undefined ? loginUserData[0]?.Title : props.props.context?.pageContext?._user.displayName,
                Type: "EODReport",
                Title: selectedPanelTask?.Title ?? '',
                ProjectID: selectedPanelTask?.Project?.Id ?? '',
                ProjectName: selectedPanelTask?.Project?.Title ?? '',
                Achieved: panelAchivedComment,
                Pending: panelPendingComment,
                ID: newId,
                isEodTask: false,
            }

            addCommentFunction(selectedPanelTask, [CommentJSON], "OffshoreComments", selectedPanelTask?.oldOffshoreComments);
        } else {

            if (panelPendingComment != '' || panelAchivedComment != '') {
                let CommentJSON ={}
                if(selectedPanelTask?.CommentUniqueID!=undefined &&selectedPanelTask?.CommentUniqueID!=''){
                    offshoreComments.map((comments:any)=>{
                        if(comments?.ID==selectedPanelTask?.CommentUniqueID){
                             CommentJSON = {
                                    AuthorId: currentUserData,
                                    Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                                    AuthorImage: loginUserData[0]?.Item_x0020_Cover?.Url ?? '',
                                    AuthorName: loginUserData[0]?.Title != undefined ? loginUserData[0]?.Title : props.props.context?.pageContext?._user.displayName,
                                    Type: "EODReport",
                                    Title: selectedPanelTask?.Title ?? '',
                                    ProjectID: selectedPanelTask?.Project?.Id ?? '',
                                    ProjectName: selectedPanelTask?.Project?.Title ?? '',
                                    Achieved: panelAchivedComment,
                                    Pending: panelPendingComment,
                                    ID: comments?.ID ?? newId,
                                    isEodTask: editPanelType == 1 ? true : false,
                                }
                        }
                    })
                }else{
                     CommentJSON = {
                        AuthorId: currentUserData,
                        Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                        AuthorImage: loginUserData[0]?.Item_x0020_Cover?.Url ?? '',
                        AuthorName: loginUserData[0]?.Title != undefined ? loginUserData[0]?.Title : props.props.context?.pageContext?._user.displayName,
                        Type: "EODReport",
                        Title: selectedPanelTask?.Title ?? '',
                        ProjectID: selectedPanelTask?.Project?.Id ?? '',
                        ProjectName: selectedPanelTask?.Project?.Title ?? '',
                        Achieved: panelAchivedComment,
                        Pending: panelPendingComment,
                        ID: generateUniqueId(offshoreComments) ?? newId,
                        isEodTask: editPanelType == 1 ? true : false,
                    }
                }
                // 
                updateCommentFunction(CommentJSON, "OffshoreComments", selectedPanelTask?.oldOffshoreComments, selectedPanelTask);

                console.log(CommentJSON, "CommentJSON")

            }
            else {
                newId = addUniqueIdToArray(offshoreComments);
                let CommentJSON = {
                    AuthorId: currentUserData,
                    Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                    AuthorImage: loginUserData[0]?.Item_x0020_Cover?.Url ?? '',
                    AuthorName: loginUserData[0]?.Title != undefined ? loginUserData[0]?.Title : props.props.context?.pageContext?._user.displayName,
                    Type: "EODReport",
                    Title: selectedPanelTask?.Title ?? '',
                    ProjectID: selectedPanelTask?.Project?.Id ?? '',
                    ProjectName: selectedPanelTask?.Project?.Title ?? '',
                    Achieved: panelAchivedComment,
                    Pending: panelPendingComment,
                    ID: newId,
                    isEodTask: offshoreComments?.isEodTask ?? false,

                }
                console.log(CommentJSON, "CommentJSON")

            }

        }
    }

    const addCommentFunction = async (task: any, UpdateData: any, columnName: any, offshoreComments: any) => {
        try {
            let web = new Web(siteURL);
            let tempObject: any = {}
            if (columnName == "OffshoreComments") {
                tempObject = {
                    OffshoreComments: UpdateData != undefined && UpdateData.length > 0 ? JSON.stringify(UpdateData) : null
                }

            }
            await web.lists.getById(selectedPanelTask?.listId).items.getById(selectedPanelTask?.ID).update(tempObject).then(() => {
                findAndUpdateOffshoreComments(task, UpdateData[0],UpdateData)
                alert("Successfully Submitted")
                closePanel()
                console.log("Background Comment Updated !!!")
            })
        } catch (error) {
            console.log("Error : ", error.message)
        }
    }
    const updateCommentFunction = async (UpdateData: any, columnName: any, oldoffshoreComments: any, task: any) => {
        let oldoffshoreComment: any = [];
        try {
            let web = new Web(siteURL);
            if (typeof oldoffshoreComments === 'string') {
                try {
                    oldoffshoreComment = JSON.parse(oldoffshoreComments)
                } catch (error) {
                    console.error('Error parsing OffshoreComments:', error);
                }
            } else {
                oldoffshoreComment =oldoffshoreComments;
            } 
            let updatedComments = [...oldoffshoreComment];
            if (oldoffshoreComment.length > 0) {
                if (UpdateData.ID !=undefined) {
                    const index = oldoffshoreComment.findIndex((comment: any) => comment.ID === UpdateData.ID);
                    if (index !== -1) {
                        updatedComments[index] = UpdateData;
                    } else {
                        updatedComments.push(UpdateData);
                    }
                }
            } else {
                updatedComments.push(UpdateData);
            }

            let tempObject: any = {}
            if (columnName == "OffshoreComments") {
                tempObject = {
                    OffshoreComments: updatedComments.length > 0 ? JSON.stringify(updatedComments) : null
                }
            }
            try {
                await web.lists.getById(selectedPanelTask?.listId).items.getById(selectedPanelTask?.ID).update(tempObject).then(() => {
                    findAndUpdateOffshoreComments(task, UpdateData,updatedComments)

                    alert("Successfully Submitted")
                    closePanel()
                    console.log("Background Comment Updated !!!")
                })
            } catch (error) {

                console.log("Error : ", error.message)

            }

        } catch (error) {
            console.log("Error : ", error.message);
            return oldoffshoreComment;
        }
    }

    const updateCommentFunctionForAddToEoD = async (UpdateData: any, columnName: any, oldoffshoreComments: any, task: any) => {
        let oldoffshoreComment: any = [];

        if (typeof oldoffshoreComments === 'string') {
            oldoffshoreComment = JSON.parse(oldoffshoreComments);
        }
        else {
            oldoffshoreComment = oldoffshoreComments;
        }



        try {
            let web = new Web(siteURL);

            
            let updatedComments = [...oldoffshoreComment];
            if (oldoffshoreComment.length > 0) {
                if (UpdateData?.ID!=undefined) {
                    const index = oldoffshoreComment.findIndex((comment: any) => comment.ID === UpdateData.ID);
                    if (index !== -1) {
                        updatedComments[index] = UpdateData;
                    } else {
                        updatedComments.push(UpdateData);
                    }
                }
            } else {
                updatedComments.push(...UpdateData);
            }

            let tempObject: any = {}
            if (columnName == "OffshoreComments") {
                tempObject = {
                    OffshoreComments: updatedComments.length > 0 ? JSON.stringify(updatedComments) : null
                }
            }
            try {
                await web.lists.getById(task?.listId).items.getById(task?.ID).update(tempObject).then(() => {
                    // alert("Successfully Submitted")
                    closePanel()
                    console.log("Background Comment Updated !!!")
                })
            } catch (error) {

                console.log("Error : ", error.message)

            }
        } catch (error) {
            console.log("Error : ", error.message);
            return oldoffshoreComment;
        }
    }

    const checkTimeEntrySite = (timeEntry: any, AllTasks: any) => {
        let result = ''
        result = AllTasks?.filter((task: any) => {
            let site = '';
            if (task?.siteType == 'Offshore Tasks') {
                site = 'OffshoreTasks'
            } else {
                site = task?.siteType;
            }
            if (timeEntry[`Task${site}`] != undefined && task?.Id == timeEntry[`Task${site}`]?.Id) {
                // task.Lead=getPortfolioLead(timeEntry)
                return task;
            }
        });
        return result;
    }

    //  Code by Udbahv
    //  const getPortfolioLead=(timeEntry:any)=>{
    //     let lead=''
    
    //     allUsers.map((user:any)=>{
    //         if(timeEntry?.AuthorId==user?.AssingedToUser?.Id){
           
    //            return lead= user?.Approver?.map((teamMember: { Title: any; }) => teamMember.Title).join(', ');
    //         }
    //     })
    //     return lead
    //  }
    const findUserByName = (name: any) => {
        const user = allUsers.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        let authImg: any = { Image: "", Suffix: "" }
        if (user[0]?.Item_x0020_Cover != undefined) {
            authImg.Image = user[0]?.Item_x0020_Cover.Url;
        } else { authImg.Suffix = user[0]?.Suffix }
        return user ? authImg : null;
    };
    const getAllLeads=(alluser:any)=>{
        let leads:any=[]
        alluser?.map((user:any)=>{
           if(user.app){

           } 
        }
            
        )

    }
    const getAllTodayModifiedTask = async (siteconfig: any[]) => {
        let filteredData: any = []
        console.log(timesheetListConfig, "timesheetListConfig")
        const startDate = getStartingDate('yesterday').toISOString();
        const filterString = `Modified ge '${startDate}'`;

        try {
            let allTaskDataArray: any[] = [];
            let allAdditionalTaskDataArray: any[] = [];
            const listIds = siteconfig.map((item: any) => item);
            await Promise.all(listIds.map(async (listIds: any) => {
                try {
                    const web = new Web(siteURL);
                    const res: any = await web.lists.getById(listIds?.listId)
                        .items.select("ParentTask/Title", "ParentTask/Id", "ItemRank", "TaskLevel", "OffshoreComments", "TeamMembers/Id", "ClientCategory/Id", "ClientCategory/Title",
                            "TaskID", "ResponsibleTeam/Id", "ResponsibleTeam/Title", "ParentTask/TaskID", "TaskType/Level", "PriorityRank", "TeamMembers/Title", "FeedBack", "Title", "Id", "ID", "DueDate", "Comments", "Categories", "Status", "Body",
                            "PercentComplete", "ClientCategory", "Priority", "TaskType/Id", "TaskType/Title", "Portfolio/Id", "Portfolio/ItemType", "Portfolio/PortfolioStructureID", "Portfolio/Title",
                            "TaskCategories/Id", "TaskCategories/Title", "TeamMembers/Name", "Project/Id", "Project/PortfolioStructureID", "Project/Title", "Project/PriorityRank", "AssignedTo/Id", "AssignedTo/Title", "AssignedToId", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title",
                            "Created", "Modified", "IsTodaysTask", "workingThisWeek", "WorkingAction",
                        )
                        .expand(
                            "ParentTask", "Portfolio", "TaskType", "ClientCategory", "TeamMembers", "ResponsibleTeam", "AssignedTo", "Editor", "Author",
                            "TaskCategories", "Project",
                        )
                        .filter(filterString)
                        .orderBy("orderby", false).getAll(4999);

                    console.log(res, "getAllTaskListData");

                    if (loginUserInfo[0]?.UserGroup?.Title == "Smalsus Lead Team") {
                        filteredData = res;
                    }
                    else if (loginUserInfo[0]?.UserGroup?.Title == "HHHH Team") {
                        filteredData = res;
                    }
                    else if (loginUserInfo[0]?.UserGroup?.Title == "Junior Task Management") {
                        filteredData = res;
                    }
                    else if (loginUserInfo[0]?.UserGroup?.Title == "QA Team") {
                        filteredData = res;
                    }
                    else if (loginUserInfo[0]?.AssingedToUserId=='328') {
                        filteredData = res;
                    }
                    else if (loginUserInfo[0]?.UserGroup?.Title == "Portfolio Lead Team" || loginUserInfo[0]?.UserGroup?.Title == "Design Team") {
                        let filterIdsUserIds = AllProtFolioTeamMembers?.map((item: { AssingedToUserId: any; }) => item.AssingedToUserId);
                        filterIdsUserIds.push(currentUserData)
                        // Filter DATA based on AssignedTo array
                        filteredData = res?.filter((item: { AssignedTo: any[]; }) => {
                            // Check if any AssignedTo Id matches any filterIds AssingedToUserId
                            return item?.AssignedTo?.some((assignee: { Id: any; }) => filterIdsUserIds?.includes(assignee?.Id));
                        });
                    }
                    else if (loginUserInfo[0]?.UserGroup?.Title == "Mobile Team") {
                        filteredData = res;
                    }
                    else {
                        filteredData = [];
                    }
                    filteredData.forEach((item: any) => {
                        if (item.Project) {

                            item.ProjectTitle = item?.Project?.Title;
                            item.ProjectId = item?.Project?.Id;
                            item.projectStructerId = item?.Project?.PortfolioStructureID
                            const title = item?.Project?.Title || '';
                            const formattedDueDate = Moment(item?.DueDate, 'DD/MM/YYYY').format('YYYY-MM');
                            item.joinedData = [];
                            if (item?.projectStructerId && title || formattedDueDate) {
                                item.joinedData.push(`Project ${item?.projectStructerId} - ${title}  ${formattedDueDate == "Invalid date" ? '' : formattedDueDate}`)
                            }
                        }
                        item.ID = item?.ID;
                        item.listId = listIds?.listId;
                        item.siteType = listIds?.Title;

                        item.Achieved = getTodayAchievedOrPending(item?.OffshoreComments, 1)
                        item.Pending = getTodayAchievedOrPending(item?.OffshoreComments, 2)
                        item.CommentUniqueID=getCommentUniqueID(item?.OffshoreComments)
                        // item.Lead = item.ResponsibleTeam?.[0]?.Title
                        item.Lead = item.ResponsibleTeam?.map((teamMember: { Title: any; }) => teamMember.Title).join(', ');
                        item.TaskCategories = item?.TaskCategories?.map((categories: { Title: any; }) => categories?.Title).join(', ')
                        item.DisplayCreateDate = Moment(item?.Created).format("DD/MM/YYYY");
                        if (item.Author) {
                            let authImg = findUserByName(item.Author?.Id);
                            if (authImg.Image != undefined && authImg.Image != "") {
                                item.Author.autherImage = authImg.Image
                            } else {
                                item.Author.suffix = authImg.Suffix
                            }
                        }
                        item.ProjectId = item?.Project?.Id
                        item.oldOffshoreComments = item?.OffshoreComments

                        if (item?.OffshoreComments != null) {
                            const offshoreCommentsArray = JSON.parse(item.OffshoreComments);
                            const filteredComments = offshoreCommentsArray?.filter((comment: { Type: string, isEodTask: boolean ,Created:any}) => comment?.Type === "EODReport" && comment?.isEodTask && isTodayCreated(comment?.Created) );
                            console.log(filteredComments, "filteredComments");
                            if (filteredComments.length > 0) {
                                todayAllEODTaskData.push(item);
                            }
                            else {
                                todayAllTaskData.push(item)

                            }
                        }
                        else {
                            todayAllTaskData.push(item)
                        }
                    });

                } catch (error) {
                    console.error(`Error fetching data for listId}:`, error);
                    throw error;
                }
            }));
            // setAllTodayModifiedTask(allTaskDataArray)
            console.log(allTaskDataArray, "allTaskDataArray");
            // setallAditionalTask(allAdditionalTaskDataArray)

        } catch (error) {
            console.error('Error processing list ids:', error);
            throw error;
        }
    };

    const loadSmartMetaDataList = async () => {
        let data = [];
        let siteConfigSites: any = [];
        var Priority: any = [];
        let Categories: any = [];

        try {
            let web = new Web(siteURL);
            data = await web.lists
                .getById(AllListId?.SmartMetadataListID).items
                .select("Id", "Title", "IsVisible", "ParentID", "SmartSuggestions", "TaxType", "Configurations", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", 'Color_x0020_Tag', "Parent/Id", "Parent/Title")
                .top(4999).expand("Parent").get();
            data?.map((newtest: any) => {
                if (newtest.Title == "SDC Sites" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
                    newtest.DataLoadNew = false;
                else if (newtest.TaxType == 'Sites') {
                    siteConfigSites.push(newtest)
                }
                if (newtest?.TaxType == 'Priority Rank') {
                    Priority?.push(newtest)
                }
                if (newtest.TaxType == 'Categories') {
                    Categories.push(newtest);
                }
                if (newtest.TaxType == 'timesheetListConfigrations') {
                    timesheetListConfig.push(newtest);
                }
            })
            await getAllTodayModifiedTask(siteConfigSites)
            await fetchTodayTimesheet()

            // console.log(data, "loadSmartMetaDataList");

        }
        catch (error) {
            return Promise.reject(error);
        }

    }

    React.useEffect(() => {
        // Define an async function inside the effect
        const fetchData = async () => {
            await loadAllUser();
            await loadLoginUserData();
            await loadSmartMetaDataList();
            // await loadAllMasterTaskData();
        };
        // Call the async function
        fetchData();
    }, []);

    function isTodayCreated(createdDate: string): boolean {
        const today = new Date();
        const created = new Date(createdDate);
        return today.getFullYear() === created.getFullYear() &&
            today.getMonth() === created.getMonth() &&
            today.getDate() === created.getDate();
    }
    function generateUniqueId(OffshoreComments: any) {
        let newId = nextUniqueId++;
        while (OffshoreComments.some((comment: { ID: number; }) => comment.ID === newId)) {
            newId = nextUniqueId++;
        }
        return newId;
    }
    // Function to add unique ID to each object in OffshoreComments and return the generated ID
    function addUniqueIdToArray(arr: any[]) {
        let newId = generateUniqueId(arr);
        arr.forEach((obj: { id: number; }) => {
            if (!obj.id) {
                obj.id = newId++; // Add a new property 'id' with a unique ID
            }
        });
        return newId + 1; // Return the last generated unique ID
    }

    const fetchTodayTimesheet = async () => {
        if (timesheetListConfig?.length > 0) {
            let timesheetLists: any = [];
            const startDate = getStartingDate('yesterday').toISOString();

            // let startDate = '2024-07-28T23:50:00.000Z';
            timesheetLists = JSON.parse(timesheetListConfig[0]?.Configurations)
            if (timesheetLists?.length > 0) {
                const fetchPromises = timesheetLists.map(async (list: any) => {
                    let web = new Web(list?.siteUrl);
                    try {
                        let todayDateToCheck = new Date().setHours(0, 0, 0, 0,)
                        const data = await web.lists
                            .getById(list?.listId)
                            .items.select(list?.query)
                            .filter(`(Modified ge datetime'${startDate}')`)
                            .getAll();

                        console.log(data, "data");
                        console.log(data, "data");

                        data?.forEach((item: any) => {
                            let entryDate = new Date(item?.Modified).setHours(0, 0, 0, 0)
                            if (entryDate == todayDateToCheck) {
                                AllTaskTimeEntries?.push(item);
                            }

                            // AllTaskTimeEntries.push(item);
                        });
                        // currentUserTimeEntry('This Week');
                        console.log(AllTaskTimeEntries, "AllTaskTimeEntries")

                    } catch (error) {
                        // setPageLoader(false)
                        console.log(error, 'HHHH Time');
                    }
                });
                await Promise.all(fetchPromises)
                // const filterTimesheetTask = AllTaskTimeEntries.map((item: any) =>
                //     checkTimeEntrySite(item, todayAllTaskData)
                // ).flat();


                const filterTimesheetTask = AllTaskTimeEntries.flatMap((item: any) =>
                    checkTimeEntrySite(item, todayAllTaskData)
                );
                 todayAllEODTaskData = AllTaskTimeEntries.flatMap((item: any) =>
                    checkTimeEntrySite(item, todayAllEODTaskData)
                );
                const uniqueTasks = filterTimesheetTask.reduce((acc: { find: (arg0: (item: any) => boolean) => any; concat: (arg0: any[]) => any; }, current: { ID: any; siteType: any }) => {
                    // Check if the ID is already in the accumulator
                    const x = acc.find((item: { ID: any; siteType: any }) => item.ID === current.ID && item.siteType === current.siteType);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
                const uniqueTasks2 = todayAllEODTaskData.reduce((acc: { find: (arg0: (item: any) => boolean) => any; concat: (arg0: any[]) => any; }, current: { ID: any; siteType: any }) => {
                    // Check if the ID is already in the accumulator
                    const x = acc.find((item: { ID: any; siteType: any }) => item.ID === current.ID && item.siteType === current.siteType);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
                // console.log(uniqueFilterTimesheetTask)
                setallAditionalTask(uniqueTasks)
                
                setAllTodayModifiedTask(uniqueTasks2)
            }
        }
    }

   const getCommentUniqueID=(offShoreComment:any)=>{
  let uniqueCommentId=''
    if (offShoreComment == null) {
        return uniqueCommentId;
    }else{
        let commentsArray:any=[]
        if (typeof offShoreComment === 'string') {
            try {
                commentsArray = JSON.parse(offShoreComment);
            } catch (error) {
                console.error('Error parsing OffshoreComments:', error);
            }
        } else {
            commentsArray = offShoreComment;
        }
        commentsArray.map((comment:any)=>{
            if( isTodayCreated(comment?.Created)){
                uniqueCommentId=comment.ID
                return  uniqueCommentId
            }
        })
    }
    return uniqueCommentId

   }


    function getTodayAchievedOrPending(offshoreComments: any | null | undefined, type: number): string {
        if (offshoreComments == null) {
            return '';
        }

        const commentsArray = JSON.parse(offshoreComments);
        console.log(commentsArray, "commentsArray");

        // Filter comments based on type and creation date
        const filteredComments = commentsArray?.filter((comment: { Type: string; Achieved: string; Pending: string; Created: string; ProjectName: string; ID: string }) => {
            if (comment?.Type === "EODReport") {
                if (type === 1 && comment?.Achieved && isTodayCreated(comment?.Created)) {
                    return true;
                } else if (type === 2 && comment?.Pending && isTodayCreated(comment?.Created)) {
                    return true;
                } else if (type === 3 && comment?.ProjectName && isTodayCreated(comment?.Created)) {
                    return true;
                }
            } else if (type === 4 && comment?.ID && isTodayCreated(comment?.Created)) {
                return true;
            }
            return false;
        });

        // Map filtered comments to the desired values
        const results = filteredComments?.map((comment: { Achieved: string; Pending: string; ProjectName: string; ID: string }) => {
            if (type === 1) {
                return comment?.Achieved || '';
            } else if (type === 2) {
                return comment?.Pending || '';
            } else if (type === 3) {
                return comment?.ProjectName || '';
            } else if (type === 4) {
                return comment?.ID || '';
            }
            return ''; // Default return if type is not 1, 2, 3, or 4
        });

        // Join results into a single string
        return results?.join(', ') || ''; // You can choose a different delimiter if needed
    }


    const callBackData = React.useCallback((checkData: any) => {
        console.log(checkData, "checkData");
        if (checkData !== undefined) {
            setSelectedTaskForEod(checkData)
        } else {
            setSelectedTaskForEod([])
            // Reset selectedTaskForEod to an empty array if checkData is undefined
        }
    }, [selectedTaskForEod]);

    const customTableHeaderButtons = (
        < button type="button" disabled={selectedTaskForEod.length > 0 ? false : true} className="btn btn-primary" title='Compare'

            onClick={() => onAddpress()}>Move To EOD Report</button>
    )
    // disabled={allTodayModifiedTask.length > 0 ? false : true}
    const customTableHeaderButtonsForEmail = (
        < button type="button" className="btn btn-primary" title='Compare'

            onClick={() => onEmailSend()}>Send Email</button>
    )

    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span className="siteColor">{`Update EOD`}</span>
                </div>
                {/* <Tooltip ComponentId={1746} /> */}
            </div>
        );
    };

    const onPanelSaveButtonClick = () => {
        AddEODComment()
    }

    const closePanel = () => {
        setShowpanel(false)
    }
    return (
        <div>
            {/* <h2>All Portfolio Lead</h2>

            <section className="Tabl1eContentSection row taskprofilepagegreen">
                <div className="container-fluid p-0">
                    <section className="TableSection">
                        <div className="container p-0">
                            <div className="Alltable mt-2 ">
                                <div className="col-sm-12 p-0 smart">
                                    <div>
                                        <div>{ allUsers?.length>0 &&  < PortfolioLeadEOD AllUsers={allUsers} AllListId={AllListId}/>}
                                      
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section> */}

            <h2>EOD Report</h2>
            <section className="Tabl1eContentSection row taskprofilepagegreen">
                <div className="container-fluid p-0">
                    <section className="TableSection">
                        <div className="container p-0">
                            <div className="Alltable mt-2 ">
                                <div className="col-sm-12 p-0 smart">
                                    <div>
                                        <div>
                                            <GlobalCommanTable
                                                showHeader={true}
                                                setData={setAllTodayModifiedTask} setLoaded={setLoaded}
                                                ref={childRef}
                                                AllListId={AllListId} columns={columns1} data={allTodayModifiedTask}
                                                callBackData={callBackData}
                                                fixedWidth={true}
                                                tableId="EodReport"
                                                multiSelect={true}
                                                customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtonsForEmail}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
            <h2>Additional Report</h2>
            <section className="Tabl1eContentSection row taskprofilepagegreen">
                <div className="container-fluid p-0">
                    <section className="TableSection">
                        <div className="container p-0">
                            <div className="Alltable mt-2 ">
                                <div className="col-sm-12 p-0 smart">
                                    <div>
                                        <div>
                                            <GlobalCommanTable
                                                showHeader={true}
                                                setData={setallAditionalTask} setLoaded={setLoaded}
                                                ref={childRef}
                                                AllListId={AllListId} columns={columns} data={allAditionalTask}
                                                callBackData={callBackData}
                                                fixedWidth={true}
                                                tableId="EodReportAdditional"
                                                customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons}
                                                multiSelect={true}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>

            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                type={PanelType.custom}
                customWidth="620px"
                isOpen={showPanel}
                onDismiss={closePanel}
                isBlocking={false}
            >
                <td>{panelTitle}</td>
                <div className="parentDiv p-0 pt-1">
                    <div
                    >
                        <h4>Achived Comment</h4>

                        <textarea className="full-width"
                            id="txtUpdateComment"
                            rows={6}
                            defaultValue={panelAchivedComment}
                            onChange={(e) => setPanelAchivedComment(e.target.value)}
                        >
                        </textarea>
                    </div>
                    <div
                    >
                        <h4>Pending Comment</h4>
                        <textarea className="full-width"
                            id="txtUpdateComment"
                            rows={6}
                            defaultValue={panelPendingComment}
                            onChange={(e) => setPanelPendingComment(e.target.value)}
                        >
                        </textarea>
                    </div>
                    <footer className="d-flex justify-content-between ms-3 float-end">
                        <div>
                            <button onClick={() => onPanelSaveButtonClick()} className="btn btnPrimary mx-1">
                                Save
                            </button>
                            <button className='btn btn-default' onClick={closePanel}>
                                Cancel
                            </button>

                        </div>
                    </footer>
                </div>
            </Panel>

        </div>
    )
}

