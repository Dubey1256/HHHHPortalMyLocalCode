import moment from 'moment';
import * as React from 'react';
import { Web } from "sp-pnp-js";
import * as globalCommon from '../../../globalComponents/globalCommon'
import {
    mergeStyleSets,
    FocusTrapCallout,
    FocusZone,
    FocusZoneTabbableElements,
    FontWeights,
    Stack,
    Text,
} from '@fluentui/react';
import GlobalTooltip from '../../../globalComponents/Tooltip';
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
let countemailbutton: number;
var changespercentage = false;
var buttonId: any;
const TaskDescriptions = (props: any) => {
    const propsvalue = props?.Item;
    const [Result, setResult] = React.useState<any>({});
    const [TaskFeedbackData, setTaskFeedbackData] = React.useState<any>([]);
    const [ApprovalCommentcheckbox, setApprovalCommentcheckbox] = React.useState(false);
    const [showcomment_subtext, setshowcomment_subtext] = React.useState('none');
    const [subchildcomment, setsubchildcomment] = React.useState(null)
    const [showhideCommentBoxIndex, setshowhideCommentBoxIndex] = React.useState(null)
    const [showcomment, setshowcomment] = React.useState('none')
    const [updatedComment, setupdateComment] = React.useState(false);
    const [updateCommentText, setupdateCommentText]:any = React.useState({})
    const [CommenttoPost, setCommenttoPost] = React.useState('')
    const [CommenttoUpdate, setCommenttoUpdate] = React.useState('')
    const [emailcomponentopen, setemailcomponentopen] = React.useState(false);
    const [isEditModalOpen, setisEditModalOpen] = React.useState(false);
    const [updateReplyCommentText, setupdateReplyCommentText]: any = React.useState({})
    const [isEditReplyModalOpen, setisEditReplyModalOpen] = React.useState(false);
    const [currentDataIndex, setcurrentDataIndex] = React.useState<any>(0);
    const [replyTextComment, setreplyTextComment] = React.useState('');
    const [subchildParentIndex, setsubchildParentIndex] = React.useState(null);
    const [sendMail, setsendMail] = React.useState(false);
    const [emailStatus, setemailStatus] = React.useState('');
    const [emailComponentstatus, setemailComponentstatus] = React.useState('')
    const [ApprovalHistoryPopup, setApprovalHistoryPopup] = React.useState(true);
    const [ApprovalPointUserData, setApprovalPointUserData] = React.useState(null);
    const [ApprovalPointCurrentParentIndex, setApprovalPointCurrentParentIndex] = React.useState(null);
    const [currentArraySubTextIndex, setcurrentArraySubTextIndex] = React.useState(null);
    const [isCalloutVisible, setisCalloutVisible] = React.useState(false);
    const [imageInfo, setimageInfo] = React.useState({})
    const [isModalOpen, setisModalOpen] = React.useState(false);
    const [showPopup,setshowPopup] = React.useState('none')

    React.useEffect(() => {
        buttonId = `callout-button`;   
        if (propsvalue) {            
            setResult(propsvalue)
            setTaskFeedbackData(propsvalue?.FeedBack?.[0]?.FeedBackDescriptions)
        }
    }, [propsvalue])


    //===============traffic light function ==================
    const changeTrafficLigth = async (index: any, item: any) => {
        console.log(index);
        console.log(item);
        if ((Result?.Approver?.AssingedToUser?.Id == props?.currentUser[0]?.Id) || (Result?.Approver?.Approver[0]?.Id == props?.currentUser[0]?.Id)) {
            let tempData: any = TaskFeedbackData[index];
            var approvalDataHistory = {
                ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Id: props?.currentUser[0].Id,
                ImageUrl: props?.currentUser[0].userImage,
                Title: props?.currentUser[0].Title,
                isShowLight: item
            }
            tempData.isShowLight = item;
            if (tempData.ApproverData != undefined && tempData.ApproverData.length > 0) {

                tempData.ApproverData.push(approvalDataHistory);
            } else {
                tempData.ApproverData = [];
                tempData.ApproverData.push(approvalDataHistory)
            }

            var data: any = Result;

            if (tempData?.ApproverData != undefined && tempData?.ApproverData?.length > 0) {
                tempData?.ApproverData?.forEach((ba: any) => {
                    if (ba.isShowLight == 'Reject') {
                        ba.Status = 'Rejected by'
                    }
                    if (ba.isShowLight == 'Approve') {
                        ba.Status = 'Approved by'

                    }
                    if (ba.isShowLight == 'Maybe') {
                        ba.Status = 'For discussion with'
                    }
                })
            }

            console.log(tempData);
            console.log(TaskFeedbackData);
            await onPost();
            if (Result?.FeedBack != undefined) {
                await checkforMail(Result?.FeedBack[0].FeedBackDescriptions, item, tempData);

            }
        }
    }

    const changeTrafficLigthsubtext = async (parentindex: any, subchileindex: any, status: any) => {
        console.log(parentindex);
        console.log(subchileindex);
        console.log(status);
        if ((Result?.Approver?.AssingedToUser?.Id == props?.currentUser[0]?.Id) || (Result?.Approver?.Approver[0]?.Id == props?.currentUser[0]?.Id)) {
            let tempData: any = TaskFeedbackData[parentindex];
            var approvalDataHistory = {
                ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Id: props?.currentUser[0].Id,
                ImageUrl: props?.currentUser[0].userImage,
                Title: props?.currentUser[0].Title,
                isShowLight: status
            }
            tempData.Subtext[subchileindex].isShowLight = status;
            if (tempData?.Subtext[subchileindex]?.ApproverData != undefined && tempData?.Subtext[subchileindex]?.ApproverData?.length > 0) {

                tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory);
            } else {
                tempData.Subtext[subchileindex].ApproverData = [];
                tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory)
            }
            // var data: any = propsvalue;
            if (tempData?.Subtext[subchileindex] != undefined && tempData?.Subtext[subchileindex]?.ApproverData != undefined) {
                tempData?.Subtext[subchileindex]?.ApproverData?.forEach((ba: any) => {
                    if (ba.isShowLight == 'Reject') {
                        ba.Status = 'Rejected by'
                    }
                    if (ba.isShowLight == 'Approve') {
                        ba.Status = 'Approved by '
                    }
                    if (ba.isShowLight == 'Maybe') {
                        ba.Status = 'For discussion with'
                    }

                })
            }

            console.log(tempData);
            console.log(TaskFeedbackData);
            console.log(emailcomponentopen)
            await onPost();

            if (Result?.FeedBack != undefined) {
                await checkforMail(TaskFeedbackData, status, tempData?.Subtext[subchileindex]);
            }
        }
    }
    //===============traffic light function End ==================
    const onPost = async () => {
        let web = new Web(props?.siteUrl);
        const i = await web.lists
            .getByTitle(props?.listName)
            .items
            .getById(props?.itemID)
            .update({
                FeedBack: JSON.stringify(Result?.FeedBack),

            });       
        setupdateComment(true)
    }
    //================================ taskfeedbackcard===============
    const showhideCommentBox = (index: any) => {
        if (showcomment == 'none') {          
            setshowcomment('block')
        }
        else {
            setshowcomment('none')
        }
        setshowcomment_subtext('none')
        setsubchildcomment(null)
        setshowhideCommentBoxIndex(index);
    }
    const handleInputChange = (e: any) => {        
        setCommenttoPost(e.target.value)
    }
    const PostButtonClick = (fbData: any, i: any) => {

        let txtComment = CommenttoPost
        if (txtComment != '') {

            var temp: any = {
                AuthorImage: props?.currentUser != null && props?.currentUser?.length > 0 ? props?.currentUser[0]['userImage'] : "",
                AuthorName: props?.currentUser != null && props?.currentUser?.length > 0 ? props?.currentUser[0]['Title'] : "",

                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,

            };
            if (ApprovalCommentcheckbox) {
                temp.isApprovalComment = ApprovalCommentcheckbox
                temp.isShowLight = fbData?.isShowLight ? fbData?.isShowLight : "";
                var approvalDataHistory = {
                    ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                    Id: props?.currentUser[0].Id,
                    ImageUrl: props?.currentUser[0].userImage,
                    Title: props?.currentUser[0].Title,
                    isShowLight: fbData?.isShowLight ? fbData?.isShowLight : ""
                }

                if (temp.ApproverData != undefined) {
                    temp.ApproverData.push(approvalDataHistory)
                } else {
                    temp.ApproverData = [];
                    temp.ApproverData.push(approvalDataHistory);
                }
            }
            //Add object in feedback

            if (fbData["Comments"] != undefined) {
                fbData["Comments"].unshift(temp);
            }
            else {
                fbData["Comments"] = [temp];
            }
            (document.getElementById('txtComment') as HTMLTextAreaElement).value = '';
            // setState({
            //     ...state,
            //     showcomment: 'none',
            //     CommenttoPost: '',
            // });           
            setCommenttoPost('')
            setshowcomment('none')
            setApprovalCommentcheckbox(false)
            setshowhideCommentBoxIndex(null);
            onPost();
        } else {
            alert('Please input some text.')
        }

    }
    const openEditModal = (comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, parentIndex: any) => {       
        setupdateCommentText({
            'comment': comment?.Title,
            'indexOfUpdateElement': indexOfUpdateElement,
            'indexOfSubtext': indexOfSubtext,
            'isSubtextComment': isSubtextComment,
            "data": comment,
            "parentIndexOpeneditModal": parentIndex
        })
        setisEditModalOpen(true);
        setCommenttoUpdate(comment?.Title)
    }

    const clearComment = (isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any, parentindex: any) => {     
        if (confirm("Are you sure you want to delete this comment?")) {
            let updatedFeedbackData = [...TaskFeedbackData]; 
            if (isSubtextComment) {
                updatedFeedbackData[parentindex]["Subtext"][indexOfSubtext]?.Comments?.splice(indexOfDeleteElement, 1);
            } else {
                updatedFeedbackData[parentindex]["Comments"]?.splice(indexOfDeleteElement, 1);
            }

            setTaskFeedbackData(updatedFeedbackData);
            onPost();
        }

    }
    const handleUpdateComment = (e: any) => {      
        setCommenttoUpdate(e.target.value)
    }
    const updateComment = () => {
        let txtComment = CommenttoUpdate

        if (txtComment != '') {
            let temp: any = {
                AuthorImage: props?.currentUser != null && props?.currentUser.length > 0 ? props?.currentUser[0]['userImage'] : "",
                AuthorName: props?.currentUser != null && props?.currentUser.length > 0 ? props?.currentUser[0]['Title'] : "",
                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment
            };

            if (isEditReplyModalOpen) {
                var EditReplyData = updateReplyCommentText;
                if (EditReplyData?.isSubtextComment) {
                    let feedback = TaskFeedbackData[EditReplyData?.parentIndexOpeneditModal].Subtext[EditReplyData?.indexOfSubtext].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
                    feedback.Title = CommenttoUpdate;
                } else {
                    let feedback = TaskFeedbackData[EditReplyData?.parentIndexOpeneditModal].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
                    feedback.Title = CommenttoUpdate;
                }
            } else {
                if (updateCommentText?.data?.isApprovalComment) {
                    temp.isApprovalComment = updateCommentText?.data?.isApprovalComment;
                    temp.isShowLight = updateCommentText?.data?.isShowLight
                    temp.ApproverData = updateCommentText?.data?.ApproverData;
                }
                if (updateCommentText?.isSubtextComment) {

                    Result.FeedBack[0].FeedBackDescriptions[updateCommentText?.parentIndexOpeneditModal].Subtext[updateCommentText['indexOfSubtext']]['Comments'][updateCommentText['indexOfUpdateElement']].Title = temp.Title

                }
                else {

                    Result.FeedBack[0].FeedBackDescriptions[updateCommentText?.parentIndexOpeneditModal]["Comments"][updateCommentText['indexOfUpdateElement']].Title = temp.Title
                }
            }
            onPost();
        }       
        setreplyTextComment('')
        setcurrentDataIndex(0)
        setisEditReplyModalOpen(false);
        setupdateReplyCommentText({})
        setisEditModalOpen(false);
        setupdateCommentText({})
        setCommenttoUpdate('');
    }

    const SubtextPostButtonClick = (j: any, parentIndex: any) => {
        let txtComment = CommenttoPost
        if (txtComment != '') {
            let temp: any = {
                AuthorImage: props?.currentUser != null && props?.currentUser.length > 0 ? props?.currentUser[0]['userImage'] : "",
                AuthorName: props?.currentUser != null && props?.currentUser.length > 0 ? props?.currentUser[0]['Title'] : "",

                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,

            };
            if (ApprovalCommentcheckbox) {
                temp.isApprovalComment = ApprovalCommentcheckbox
                temp.isShowLight = TaskFeedbackData[parentIndex]?.Subtext[j].isShowLight != undefined ? TaskFeedbackData[parentIndex]?.Subtext[j].isShowLight : ""
                var approvalDataHistory = {
                    ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                    Id: props?.currentUser[0].Id,
                    ImageUrl: props?.currentUser[0].userImage,
                    Title: props?.currentUser[0].Title,
                    isShowLight: TaskFeedbackData[parentIndex]?.Subtext[j].isShowLight != undefined ? TaskFeedbackData[parentIndex]?.Subtext[j].isShowLight : ""
                }

                if (temp.ApproverData != undefined) {
                    temp.ApproverData.push(approvalDataHistory)
                } else {
                    temp.ApproverData = [];
                    temp.ApproverData.push(approvalDataHistory);
                }

            }
            //Add object in feedback

            if (TaskFeedbackData[parentIndex]["Subtext"][j].Comments != undefined) {
                Result.FeedBack[0].FeedBackDescriptions[parentIndex]["Subtext"][j].Comments.unshift(temp);
            }
            else {
                Result.FeedBack[0].FeedBackDescriptions[parentIndex]["Subtext"][j]['Comments'] = [temp];
            }
            (document.getElementById('txtCommentSubtext') as HTMLTextAreaElement).value = '';
            // setState({
            //     ...state,
            //     showcomment_subtext: 'none',
            //     CommenttoPost: '',
            // });                      
            setshowcomment_subtext('none')
            setsubchildcomment(null)           
            setApprovalCommentcheckbox(false)
            setCommenttoPost('')
            setsubchildParentIndex(null)
            onPost();
        } else {
            alert('Please input some text.')
        }

    }
    const showhideCommentBoxOfSubText = (j: any, parentIndex: any) => {
        if (showcomment_subtext == 'none') {                             
            setshowcomment_subtext('none')
        }
        else {           
            setshowcomment_subtext('block')
        }
        setsubchildParentIndex(parentIndex)
        setshowhideCommentBoxIndex(null);
        setsubchildcomment(j)
        setshowcomment('none')
    }
    //================================ taskfeedbackcard End===============
    //========================= mail functionality==============
    const sendEmail = (item: any) => {
        var data = Result;
        if (item == "Approved") {           
            let TeamMembers: any = []
            TeamMembers.push(Result?.TeamMembers[0]?.Id)
            let changeData: any = {
                TeamMembers: TeamMembers,
                AssignedTo: []
            }
            ChangeApprovalMember(changeData).then((data: any) => {
                var data = Result;
            }).catch((error) => {
                console.log(error)
            });
        }
        else {

            let TeamMembers: any = []
            TeamMembers.push(Result?.TeamMembers[0]?.Id)
            TeamMembers.push(Result?.Approvee != undefined ? Result?.Approvee?.AssingedToUser?.Id : Result?.Author[0]?.Id)
            let changeData: any = {

                TeamMembers: TeamMembers,
                AssignedTo: [Result?.Approvee != undefined ? Result?.Approvee?.AssingedToUser?.Id : Result?.Author[0]?.Id]
            }


            ChangeApprovalMember(changeData).then((data: any) => {
                var data = Result;
            }).catch((error) => {
                console.log(error)
            });
        }

        // setState((prevState: any) => ({
        //     ...prevState,
        //     Result: data,            
        // }))
        setResult(data)
        setemailStatus(item);
        setsendMail(true);

    }

    const checkforMail = async (allfeedback: any, item: any, tempData: any) => {
        var countApprove = 0;
        var countreject = 0;
        console.log(allfeedback);
        if (allfeedback != null && allfeedback != undefined) {
            var isShowLight = 0;
            let ApproveCount = 0;
            let RejectCount = 0;
            var NotisShowLight = 0
            if (allfeedback != undefined) {
                allfeedback?.map((items: any) => {

                    if (items?.isShowLight != undefined && items?.isShowLight != "") {
                        isShowLight = isShowLight + 1;
                        if (items.isShowLight == "Approve") {
                            ApproveCount += 1;
                            changespercentage = true;
                            countApprove = countApprove + 1;
                        }
                        else {
                            countreject = countreject + 1;
                        }
                        if (items?.isShowLight == "Reject") {
                            RejectCount += 1;
                        }

                    }
                    if (items?.Subtext != undefined && items?.Subtext?.length > 0) {
                        items?.Subtext?.map((subtextItems: any) => {
                            if (subtextItems?.isShowLight != undefined && subtextItems?.isShowLight != "") {
                                isShowLight = isShowLight + 1;
                                if (subtextItems?.isShowLight == "Approve") {
                                    ApproveCount += 1;
                                    changespercentage = true;
                                    countApprove = countApprove + 1;
                                } else {
                                    countreject = countreject + 1;
                                }
                                if (subtextItems?.isShowLight == "Reject") {
                                    RejectCount += 1;
                                }

                            }
                        })
                    }
                })
            }
            if (Result?.PercentComplete < 5) {
                await changepercentageStatus(item, tempData, countApprove,);
            }

            if (isShowLight > NotisShowLight) {
                if (RejectCount == 1 && item == "Reject") {
                    countemailbutton = 0;                    
                    setemailcomponentopen(true);
                    setemailComponentstatus(item);
                }
                if (countApprove == 0) {
                    let TeamMembers: any = []
                    TeamMembers.push(Result?.TeamMembers[0]?.Id)
                    TeamMembers.push(Result?.Approvee != undefined ? Result?.Approvee?.AssingedToUser?.Id : Result?.Author[0]?.Id)
                    let changeData: any = {

                        TeamMembers: TeamMembers,
                        AssignedTo: [Result?.Approvee != undefined ? Result?.Approvee?.AssingedToUser?.Id : Result?.Author[0]?.Id]
                    }
                    ChangeApprovalMember(changeData);


                }
                if (countApprove == 1) {
                    let TeamMembers: any = []
                    TeamMembers.push(props?.currentUser?.[0]?.Id)

                    let changeData: any = {

                        TeamMembers: TeamMembers,
                        AssignedTo: []
                    }
                    ChangeApprovalMember(changeData).then((data: any) => {
                        props?.call();
                    }).catch((error: any) => {
                        console.log(error)
                    });


                }
                if (ApproveCount == 1 && item == "Approve") {
                    countemailbutton = 0;                   
                    setemailcomponentopen(true)
                    setemailComponentstatus(item)
                } else {
                    countemailbutton = 1;                   
                    setemailcomponentopen(false)

                }

            }
        }
    }

    const ChangeApprovalMember = (changeData: any) => {
        return new Promise<void>((resolve, reject) => {
            const web = new Web(Result?.siteUrl);
            web.lists.getByTitle(Result?.listName)

                .items.getById(Result?.Id).update({
                    TeamMembersId: {
                        results: changeData?.TeamMembers

                    },
                    AssignedToId: {
                        results: changeData?.AssignedTo

                    },

                }).then((res: any) => {
                    resolve(res)
                    console.log("team membersetsucessfully", res);
                })
                .catch((err: any) => {
                    reject(err)
                    console.log(err.message);
                });
        })


    }

    //========================= mail functionality End ==============


    //================percentage changes ==========================
    const changepercentageStatus = async (percentageStatus: any, pervious: any, countApprove: any) => {       
        console.log(percentageStatus)
        console.log(pervious)
        console.log(countApprove)
        let percentageComplete;
        let changespercentage1;
        if ((countApprove == 1 && percentageStatus == "Approve" && (pervious?.isShowLight == "Approve" || pervious?.isShowLight != undefined))) {
            changespercentage = true;
        }
        if ((countApprove == 0 && (percentageStatus == "Reject" || percentageStatus == "Maybe") && (pervious?.isShowLight == "Reject" && pervious?.isShowLight != undefined))) {
            changespercentage = false;
        }
        if ((countApprove == 0 && percentageStatus == "Approve" && (pervious.isShowLight == "Reject" || pervious.isShowLight == "Maybe") && pervious.isShowLight != undefined)) {
            changespercentage = true;
        }
        if ((countApprove == 0 && percentageStatus == "Maybe" && (pervious?.isShowLight == "Reject" || pervious?.isShowLight == "Maybe") && pervious.isShowLight != undefined)) {
            changespercentage = false;
        }

        let taskStatus = "";
        if (changespercentage == true) {
            percentageComplete = 0.03;
            changespercentage1 = 3
            taskStatus = "Approved"

        }
        if (changespercentage == false) {
            percentageComplete = 0.02;
            changespercentage1 = 2
            taskStatus = "Follow Up"
        }
        // updateresult.PercentComplete = changespercentage1
        // updateresult.Status = taskStatus
        // setResult(updateresult);
        const web = new Web(props?.siteUrl);
        await web.lists.getByTitle(Result?.listName)
            .items.getById(Result?.Id).update({
                PercentComplete: percentageComplete,
                Status: taskStatus,
            }).then((res: any) => {
                console.log(res);    
                props?.call()
            })
            .catch((err: any) => {
                console.log(err.message);
            });
    }
    //================percentage changes End ==========================

    // ========approval history popup and callback =================
    const ShowApprovalHistory = (items: any, parentIndex: any, subChildIndex: any) => {
        console.log("currentUser is a Approval function cxall ", items)       
        setApprovalHistoryPopup(true);
        setApprovalPointUserData(items);
        setApprovalPointCurrentParentIndex(parentIndex + 1)
        setcurrentArraySubTextIndex(subChildIndex != null ? subChildIndex + 1 : null)

    }
    const ApprovalHistoryPopupCallBack = () => {       
        setApprovalHistoryPopup(false);
        setApprovalPointUserData('');
        setApprovalPointCurrentParentIndex(null)
        setcurrentArraySubTextIndex(null)
    }
    // ========approval history popup and callback End =================

    const cleanHTML = (html: any, folora: any, index: any) => {
        if (html != undefined) {
            html = globalCommon?.replaceURLsWithAnchorTags(html)
            const div = document.createElement('div');
            div.innerHTML = html;
            const paragraphs = div.querySelectorAll('p');
            // Filter out empty <p> tags
            paragraphs.forEach((p) => {
                if (p.innerText.trim() === '') {
                    p.parentNode.removeChild(p); // Remove empty <p> tags
                }
            });
            div.innerHTML = div.innerHTML.replace(/\n/g, '<br>')  // Convert newlines to <br> tags first
            div.innerHTML = div.innerHTML.replace(/(?:<br\s*\/?>\s*)+(?=<\/?[a-z][^>]*>)/gi, '');


            return div.innerHTML;
        }

    };

    /// ==============reply comment function ====================
    const updateReplyMessagesFunction = (e: any) => {       
        setreplyTextComment(e.target.value)

    }
    const openReplycommentPopup = (i: any, k: any) => {        
        const temp = i + "" + k
        setcurrentDataIndex(temp)
        setisCalloutVisible(true)
    }
    const openReplySubcommentPopup = (i: any, j: any, k: any) => {      
        const temp1 = +i + '' + j + k;
        setisCalloutVisible(true)
        setcurrentDataIndex(temp1)
    }

    ///// ==========save reeply comment=======================
    const SaveReplyMessageFunction = () => {
        let txt: any = replyTextComment;
        console.log(currentDataIndex)
        let txtComment: any = replyTextComment;
        if (txtComment != '') {

            var temp: any =
            {
                AuthorImage: props?.currentUser != null && props?.currentUser?.length > 0 ? props?.currentUser[0]['userImage'] : "",
                AuthorName: props?.currentUser != null && props?.currentUser.length > 0 ? props?.currentUser[0]['Title'] : "",
                Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Title: txtComment,

            };
            let index: any = currentDataIndex.split('');

            if (index.length == 2) {
                let parentIndex = parseInt(index[0])
                let commentIndex = parseInt(index[1])
                let feedback = TaskFeedbackData[parentIndex].Comments[commentIndex];

                if (feedback.ReplyMessages == undefined) {
                    feedback.ReplyMessages = []
                    feedback.ReplyMessages.push(temp)
                } else {
                    feedback.ReplyMessages.push(temp)
                }

            }
            if (index.length == 3) {
                let parentIndex = parseInt(index[0])
                let subcomentIndex = parseInt(index[1])
                let commentIndex = parseInt(index[2])
                let feedback = TaskFeedbackData[parentIndex].Subtext[subcomentIndex].Comments[commentIndex];

                if (feedback.ReplyMessages == undefined) {
                    feedback.ReplyMessages = []
                    feedback.ReplyMessages.push(temp)
                } else {
                    feedback.ReplyMessages.push(temp)
                }

            }
            console.log(temp)
            onPost();            
            setisCalloutVisible(false)
            setreplyTextComment('');
            setcurrentDataIndex(0);

        } else {
            alert('Please input some text.')
        }

    }
    // =========clearReplycomment===========
    const clearReplycomment = (isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any, parentindex: any, replyIndex: any) => {       
        if (confirm("Are you sure, you want to delete this comment?")) {
            let updatedFeedbackData = [...TaskFeedbackData]; 
            if (isSubtextComment) {
                updatedFeedbackData[parentindex]["Subtext"][indexOfSubtext]?.Comments[indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1)
            } else {
                updatedFeedbackData[parentindex]["Comments"][indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1);
            }         
            setTaskFeedbackData(updatedFeedbackData);
            onPost();
        }

    }

    //===========EditReplyComment===============

    const EditReplyComment = (comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, parentIndex: any, replyIndex: any) => {        
        setisEditReplyModalOpen(true)
        setCommenttoUpdate(comment?.Title)
        setupdateReplyCommentText({
            'comment': comment?.Title,
            'indexOfUpdateElement': indexOfUpdateElement,
            'indexOfSubtext': indexOfSubtext,
            'isSubtextComment': isSubtextComment,
            'replyIndex': replyIndex,
            "data": comment,
            "parentIndexOpeneditModal": parentIndex
        })
    }

    const Closecommentpopup = () => {
        setisModalOpen(false)
        setisEditModalOpen(false)
        setisEditReplyModalOpen(false)
        setimageInfo({})
        setshowPopup('none')
    }
    const onRenderCustomHeadereditcomment = () => {
        return (
            <>
                <div className='subheading' >
                    Update Comment
                </div>
                <GlobalTooltip ComponentId='1683' />
            </>
        );
    };


    return (
        <>
            <div className={Result?.BasicImageInfo != null && Result?.BasicImageInfo?.length > 0 ? "col-sm-8 pe-0 mt-2" : "col-sm-12 p-0 mt-2"}>
                {Result?.TaskTypeTitle != null && (Result?.TaskTypeTitle == '' ||
                    Result?.TaskTypeTitle == 'Task' || Result?.TaskTypeTitle == "Workstream" || Result?.TaskTypeTitle == "Activities") &&
                    TaskFeedbackData?.length > 0 &&
                    TaskFeedbackData[0]?.Title != '' &&
                    <div className={"Addcomment boxshadow " + " manage_gap"}>
                        <label className='form-label full-width fw-semibold titleheading'>Task description</label>
                        {TaskFeedbackData?.map((fbData: any, i: any) => {
                            if (typeof fbData == "object") {
                                let userdisplay: any = [];
                                userdisplay.push({ Title: Result?.userDisplayName })


                                if (fbData != null && fbData != undefined && fbData?.Title != "") {

                                    try {
                                        if (fbData?.Title != undefined) {
                                            fbData.Title = fbData?.Title?.replace(/\n/g, '<br>');

                                        }
                                    } catch (e) {
                                    }
                                    return (
                                        <>
                                            <div className='bg-white p-2 rounded-1'>
                                                <div className="col mb-2">
                                                    <div className='justify-content-between d-flex'>
                                                        <div className="alignCenter m-0">
                                                            {props?.ApprovalStatus ?
                                                                <span className="alignCenter">
                                                                    <span title="Rejected"
                                                                        onClick={() => changeTrafficLigth(i, "Reject")}
                                                                        className={fbData['isShowLight'] == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                                    >
                                                                    </span>
                                                                    <span
                                                                        onClick={() => changeTrafficLigth(i, "Maybe")}
                                                                        title="Maybe" className={fbData['isShowLight'] == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                                    </span>
                                                                    <span title="Approved"
                                                                        onClick={() => changeTrafficLigth(i, "Approve")}
                                                                        className={fbData['isShowLight'] == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                                                                    </span>
                                                                    {fbData["ApproverData"] != undefined && fbData.ApproverData?.length > 0 &&
                                                                        <>
                                                                            <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ShowApprovalHistory(fbData, i, null)}>
                                                                                {fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={fbData.ApproverData[fbData.ApproverData.length - 1]?.Title}><span><a onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.Id,)} target="_blank" data-interception="off" title={fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.Title}>
                                                                                    <img className='imgAuthor hreflink ' src={fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.ImageUrl} />
                                                                                </a>
                                                                                </span></a></span>
                                                                        </>

                                                                    }
                                                                </span>
                                                                : null
                                                            }
                                                        </div>
                                                        <div className='m-0'>
                                                            <span className="d-block">
                                                                <a className="siteColor" style={{ cursor: 'pointer' }} onClick={(e) => showhideCommentBox(i)}>Add Comment</a>
                                                            </span>
                                                        </div>
                                                    </div>


                                                    <div className="d-flex p-0 FeedBack-comment ">
                                                        <div className="border p-1 me-1">
                                                            <span>{i + 1}.</span>
                                                            <ul className='list-none'>
                                                                <li>
                                                                    {fbData['Completed'] != null && fbData['Completed'] &&

                                                                        <span className="svg__iconbox svg__icon--tick"></span>
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {fbData['HighImportance'] != null && fbData['HighImportance'] &&
                                                                        <span className="svg__iconbox svg__icon--taskHighPriority"></span>
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {fbData['LowImportance'] != null && fbData['LowImportance'] &&
                                                                        <span className="svg__iconbox svg__icon--lowPriority"></span>
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {fbData['Phone'] != null && fbData['Phone'] &&
                                                                        <span className="svg__iconbox svg__icon--phone"></span>
                                                                    }
                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <div className="border p-2 full-width text-break"

                                                        >

                                                            <span dangerouslySetInnerHTML={{ __html: cleanHTML(fbData?.Title, "folora", i) }}></span>
                                                            <div className="col">
                                                                {fbData['Comments'] != null && fbData['Comments']?.length > 0 && fbData['Comments']?.map((fbComment: any, k: any) => {
                                                                    return <div className={fbComment.isShowLight != undefined && fbComment.isApprovalComment ? `col add_cmnt my-1 ${fbComment.isShowLight}` : "col add_cmnt my-1"} title={fbComment.isShowLight != undefined ? fbComment.isShowLight : ""}>
                                                                        <div className="">
                                                                            <div className="d-flex p-0">
                                                                                <div className="col-1 p-0 wid30">
                                                                                    {fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)}
                                                                                        src={fbComment.AuthorImage} /> :
                                                                                        <span onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)} title={fbComment?.AuthorName != undefined ? fbComment?.AuthorName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>}
                                                                                </div>
                                                                                <div className="col-11 pe-0" >
                                                                                    <div className='d-flex justify-content-between align-items-center'>
                                                                                        {fbComment?.AuthorName} - {fbComment?.Created}
                                                                                        <span className='d-flex'>
                                                                                            <a className="ps-1" title="Comment Reply" >
                                                                                                <div data-toggle="tooltip" id={buttonId + "-" + i + k}
                                                                                                    onClick={() => openReplycommentPopup(i, k)}
                                                                                                    data-placement="bottom"
                                                                                                >
                                                                                                    <span className="svg__iconbox svg__icon--reply"></span>
                                                                                                </div>
                                                                                            </a>
                                                                                            <a title='Edit'
                                                                                                onClick={() => openEditModal(fbComment, k, 0, false, i)}
                                                                                            >
                                                                                                <span className='svg__iconbox svg__icon--edit'></span>
                                                                                            </a>
                                                                                            <a title='Delete'
                                                                                                onClick={() => clearComment(false, k, 0, i)}
                                                                                            >
                                                                                                <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                        </span>
                                                                                    </div>
                                                                                    <div><span dangerouslySetInnerHTML={{ __html: cleanHTML(fbComment?.Title, null, i) }}></span></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 ps-3 pe-0 mt-1">
                                                                                {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, index: any) => {
                                                                                    return (
                                                                                        <div className="d-flex border ms-3 p-2  mb-1">
                                                                                            <div className="col-1 p-0 wid30">
                                                                                                {replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, replymessage?.AuthorName, props?.taskUsers)}
                                                                                                    src={replymessage?.AuthorImage} /> : <span title={replymessage?.AuthorName != undefined ? replymessage?.AuthorName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser" ></span>}
                                                                                            </div>
                                                                                            <div className="col-11 pe-0" >
                                                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                                                    {replymessage?.AuthorName} - {replymessage?.Created}
                                                                                                    <span className='d-flex'>
                                                                                                        <a title='Edit'
                                                                                                            onClick={() => EditReplyComment(replymessage, k, 0, false, i, index)
                                                                                                            }
                                                                                                        >
                                                                                                            <span className='svg__iconbox svg__icon--edit'></span>
                                                                                                        </a>
                                                                                                        <a title='Delete'
                                                                                                            onClick={() => clearReplycomment(false, k, 0, i, index)
                                                                                                            }
                                                                                                        >
                                                                                                            <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div><span dangerouslySetInnerHTML={{ __html: cleanHTML(replymessage?.Title, null, i) }}></span></div>
                                                                                            </div>
                                                                                        </div>

                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </div>


                                                                    </div>


                                                                })}
                                                            </div>

                                                        </div>
                                                    </div>
                                                    {showhideCommentBoxIndex == i && <div className='SpfxCheckRadio'>
                                                        <div className="col-sm-12 mt-2 p-0" style={{ display: showcomment }} >
                                                            {Result?.Approver != "" && Result?.Approver != undefined && (Result?.Approver?.AssingedToUser?.Id == props?.currentUser?.[0]?.Id || (Result?.Approver?.Approver?.length > 0 && Result?.Approver?.Approver[0]?.Id == props?.currentUser?.[0]?.Id)) && <label className='label--checkbox'><input type='checkbox' className='form-check-input me-1' name='approval' checked={ApprovalCommentcheckbox} onChange={(e) => setApprovalCommentcheckbox(e.target.checked)} />
                                                                Mark as Approval Comment</label>}
                                                        </div>
                                                        <div className="align-items-center d-flex"
                                                            style={{ display: showcomment }}
                                                        >  <textarea id="txtComment" onChange={(e) => handleInputChange(e)} className="form-control full-width"></textarea>
                                                            <button type="button" className={Result?.Approver != undefined && Result?.Approver != "" && (Result?.Approver?.AssingedToUser?.Id == props?.currentUser?.[0]?.Id || (Result?.Approver?.Approver?.length > 0 && Result?.Approver?.Approver?.[0]?.Id == props?.currentUser[0]?.Id)) ? "btn-primary btn ms-2" : "btn-primary btn ms-2"} onClick={() => PostButtonClick(fbData, i)}>Post</button>
                                                        </div>
                                                    </div>}

                                                </div>

                                                {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext']?.map((fbSubData: any, j: any) => {
                                                    return <div className="col-sm-12 p-0 mb-2" style={{ width: '100%' }}>
                                                        <div className='justify-content-between d-flex'>
                                                            <div className='alignCenter m-0'>
                                                                {props?.ApprovalStatus ?
                                                                    <span className="alignCenter">
                                                                        <span title="Rejected"
                                                                            onClick={() => changeTrafficLigthsubtext(i, j, "Reject")}
                                                                            className={fbSubData.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                                        >
                                                                        </span>
                                                                        <span title="Maybe"
                                                                            onClick={() => changeTrafficLigthsubtext(i, j, "Maybe")}
                                                                            className={fbSubData?.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                                        </span>
                                                                        <span title="Approved"
                                                                            onClick={() => changeTrafficLigthsubtext(i, j, "Approve")}
                                                                            className={fbSubData?.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                                                                        </span>
                                                                        {fbSubData?.ApproverData?.length > 0 &&
                                                                            <>
                                                                                <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ShowApprovalHistory(fbSubData, i, j)}>
                                                                                    {fbSubData?.ApproverData[fbSubData?.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.Title}><span><a onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, fbSubData?.ApproverData[fbSubData?.ApproverData?.length - 1]?.Id,)} target="_blank" data-interception="off" title={fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.Title}> <img className='imgAuthor hreflink ' src={fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.ImageUrl} /></a></span></a></span>
                                                                            </>}


                                                                    </span>
                                                                    : null
                                                                }
                                                            </div>
                                                            <div className='m-0'>
                                                                <a className="d-block text-end">
                                                                    <a className='siteColor' style={{ cursor: 'pointer' }}
                                                                        onClick={(e) => showhideCommentBoxOfSubText(j, i)}
                                                                    >Add Comment</a>
                                                                </a>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex pe-0 FeedBack-comment">
                                                            <div className="border p-1 me-1">
                                                                <span >{i + 1}.{j + 1}</span>
                                                                <ul className="list-none">
                                                                    <li>
                                                                        {fbSubData?.Completed != null && fbSubData?.Completed &&
                                                                            <span className="svg__iconbox svg__icon--tick"></span>
                                                                        }
                                                                    </li>
                                                                    <li>
                                                                        {fbSubData?.HighImportance != null && fbSubData?.HighImportance &&
                                                                            <span className="svg__iconbox svg__icon--taskHighPriority"></span>
                                                                        }
                                                                    </li>
                                                                    <li>
                                                                        {fbSubData?.LowImportance != null && fbSubData?.LowImportance &&
                                                                            <span className="svg__iconbox svg__icon--lowPriority"></span>
                                                                        }
                                                                    </li>
                                                                    <li>
                                                                        {fbSubData?.Phone != null && fbSubData?.Phone &&
                                                                            <span className="svg__iconbox svg__icon--phone"></span>
                                                                        }
                                                                    </li>
                                                                </ul>
                                                            </div>

                                                            <div className="border p-2 full-width text-break"

                                                            >
                                                                <span ><span dangerouslySetInnerHTML={{ __html: cleanHTML(fbSubData?.Title, null, j) }}></span></span>
                                                                <div className="feedbackcomment col-sm-12 PadR0 mt-10">
                                                                    {fbSubData?.Comments != null && fbSubData.Comments.length > 0 && fbSubData?.Comments?.map((fbComment: any, k: any) => {
                                                                        return <div className={fbComment?.isShowLight != undefined && fbComment.isApprovalComment ? `col-sm-12  mb-2 add_cmnt my-1 ${fbComment?.isShowLight}` : "col-sm-12  mb-2 add_cmnt my-1 "} title={fbComment?.isShowLight != undefined ? fbComment?.isShowLight : ""}>
                                                                            <div className="">
                                                                                <div className="d-flex p-0">
                                                                                    <div className="col-1 p-0 wid30">
                                                                                        {fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)}
                                                                                            src={fbComment.AuthorImage} /> : <span onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, fbComment?.AuthorName, props?.taskUsers)} title={fbComment?.AuthorName != undefined ? fbComment?.AuthorName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="col-11 pad0" key={k}>
                                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                                            {fbComment?.AuthorName} - {fbComment?.Created}
                                                                                            <span className='d-flex'>
                                                                                                <a className="ps-1" title="Comment Reply" >
                                                                                                    <div data-toggle="tooltip" id={buttonId + "-" + i + j + k}
                                                                                                        onClick={() => openReplySubcommentPopup(i, j, k)}
                                                                                                        data-placement="bottom"
                                                                                                    >
                                                                                                        <span className="svg__iconbox svg__icon--reply"></span>
                                                                                                    </div>
                                                                                                </a>
                                                                                                <a title="Edit"
                                                                                                    onClick={() => openEditModal(fbComment, k, j, true, i)}
                                                                                                >

                                                                                                    <span className='svg__iconbox svg__icon--edit'></span>
                                                                                                </a>
                                                                                                <a title='Delete'
                                                                                                    onClick={() => clearComment(true, k, j, i)}
                                                                                                ><span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                            </span>
                                                                                        </div>
                                                                                        <div ><span dangerouslySetInnerHTML={{ __html: cleanHTML(fbComment?.Title, null, j) }}></span></div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-12 ps-3 pe-0 mt-1">
                                                                                    {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, ReplyIndex: any) => {
                                                                                        return (
                                                                                            <div className="d-flex border ms-3 p-2  mb-1">
                                                                                                <div className="col-1 p-0 wid30">
                                                                                                    {replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, undefined, replymessage?.AuthorName, props?.taskUsers)}
                                                                                                        src={replymessage.AuthorImage} /> : <span title={replymessage?.AuthorName != undefined ? replymessage?.AuthorName : "Default user icons"} className="alignIcon hreflink  svg__iconbox svg__icon--defaultUser"></span>}
                                                                                                </div>
                                                                                                <div className="col-11 pe-0" >
                                                                                                    <div className='d-flex justify-content-between align-items-center'>
                                                                                                        {replymessage?.AuthorName} - {replymessage?.Created}
                                                                                                        <span className='d-flex'>
                                                                                                            <a title='Edit'

                                                                                                                onClick={() => EditReplyComment(replymessage, k, 0, true, i, ReplyIndex)
                                                                                                                }
                                                                                                            >
                                                                                                                <span className='svg__iconbox svg__icon--edit'></span>
                                                                                                            </a>
                                                                                                            <a title='Delete'
                                                                                                                onClick={() => clearReplycomment(true, k, j, i, ReplyIndex)}

                                                                                                            >
                                                                                                                <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                                                        </span>
                                                                                                    </div>
                                                                                                    <div><span dangerouslySetInnerHTML={{ __html: cleanHTML(replymessage?.Title, null, j) }}></span></div>
                                                                                                </div>
                                                                                            </div>

                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {subchildcomment == j && subchildParentIndex == i ? <div className='SpfxCheckRadio' >
                                                            <div className="col-sm-12 mt-2 p-0  ">
                                                                {Result?.Approver != "" && Result?.Approver != undefined && (Result?.Approver?.AssingedToUser?.Id == props?.currentUser[0]?.Id || (Result?.Approver?.Approver[0]?.Id == props?.currentUser[0]?.Id)) && <label className='label--checkbox'><input type='checkbox' className='form-check-input me-1' checked={ApprovalCommentcheckbox} onChange={(e) => setApprovalCommentcheckbox(e.target?.checked)} />Mark as Approval Comment</label>}

                                                            </div>

                                                            <div className="align-items-center d-flex"

                                                            >  <textarea id="txtCommentSubtext" onChange={(e) => handleInputChange(e)} className="form-control full-width" ></textarea>
                                                                <button type="button" className={Result?.Approver != undefined && Result?.Approver != "" && (Result?.Approver?.AssingedToUser?.Id == props?.currentUser[0]?.Id || (Result?.Approver?.Approver[0]?.Id == props?.currentUser[0]?.Id)) ? "btn-primary btn ms-2" : "btn-primary btn ms-2"} onClick={() => SubtextPostButtonClick(j, i)}>Post</button>
                                                            </div>
                                                        </div> : null}

                                                    </div>
                                                })}



                                            </div>


                                        </>
                                    )
                                }
                            }
                        })}
                    </div>
                }

            </div>
            {isCalloutVisible ? (

                <FocusTrapCallout
                    className='p-2 replyTooltip'
                    role="alertdialog"

                    gapSpace={0}
                    target={`#${buttonId}-${currentDataIndex}`}
                    onDismiss={() => setisCalloutVisible(false)}
                    setInitialFocus
                >
                    <Text block variant="xLarge" className='subheading m-0 f-15'>
                        Comment Reply
                    </Text>
                    <Text block variant="small">
                        <div className="d-flex my-2">
                            <textarea className="form-control" value={replyTextComment}
                                onChange={(e) => updateReplyMessagesFunction(e)}
                            ></textarea>
                        </div>

                    </Text>
                    <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                        <Stack
                            className='modal-footer'
                            gap={8} horizontal>

                            <button className='btn btn-default'
                                onClick={() => setisCalloutVisible(false)}
                            >Cancel</button>
                            <button className='btn btn-primary'
                                onClick={SaveReplyMessageFunction}
                            >Save</button>
                        </Stack>
                    </FocusZone>
                </FocusTrapCallout>

            ) : null
            }
            {(CommenttoUpdate != undefined) && <Panel
                onRenderHeader={onRenderCustomHeadereditcomment}
                isOpen={isEditModalOpen ? isEditModalOpen : isEditReplyModalOpen}
                onDismiss={Closecommentpopup}
                isBlocking={isEditModalOpen ? !isEditModalOpen : !isEditReplyModalOpen}
            >
                <div className="modal-body">
                    <div className='col'>
                        <textarea id="txtUpdateComment" rows={6} className="full-width" onChange={(e) => handleUpdateComment(e)}  >{CommenttoUpdate}</textarea>
                    </div>
                </div>
                <footer className='modal-footer mt-2'>
                    <button className="btn btn-primary ms-1"  disabled={CommenttoUpdate?.length===0?true:false} onClick={(e) => updateComment()}>Save</button>
                    <button className='btn btn-default ms-1' onClick={Closecommentpopup}>Cancel</button>
                </footer>
            </Panel>}
        </>
    )
}

export default TaskDescriptions;

