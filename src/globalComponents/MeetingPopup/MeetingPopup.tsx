import * as React from "react";
import { useState, useEffect } from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../Tooltip";
import CommentCard from "../../globalComponents/Comments/CommentCard";
import ImageUploading, { ImageListType } from "react-images-uploading";
import FlorarImageUploadComponent from "../FlorarComponents/FlorarImageUploadComponent";
import CommentBoxComponent from "../EditTaskPopup/CommentBoxComponent";
import Example from '../EditTaskPopup/FroalaCommnetBoxes';
import * as globalCommon from "../globalCommon";
import * as Moment from 'moment';
import { Web } from "sp-pnp-js";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Modal } from '@fluentui/react';
import { TbReplace } from 'react-icons/tb';
import { FaExpandAlt } from 'react-icons/fa';
import TeamConfigurationCard from "../TeamConfiguration/TeamConfiguration";
import { mycontextValue } from '../../webparts/meetingOverViewPage/components/MeetingProfile';
var updateFeedbackArray: any = [];
var FeedBackBackupArray: any = [];
var CommentBoxData: any = [];
var SubCommentBoxData: any = [];
var AddImageDescriptionsIndex: any;
var currentUserBackupArray: any = [];
var ReplaceImageIndex: any;
var ReplaceImageData: any;

const MeetingPopupComponent = (Props: any) => {
    const contextdata: any = React.useContext(mycontextValue)
    const [IsOpenMeetingPopup, setIsOpenMeetingPopup] = useState(Props.isShow);
    const [MeetingData, setMeetingData] = useState<any>({})
    const [TaskImages, setTaskImages] = React.useState([]);
    const [UploadBtnStatus, setUploadBtnStatus] = React.useState(false);
    const [HoverImageData, setHoverImageData] = React.useState([]);
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [hoverImageModal, setHoverImageModal] = React.useState('None');
    const AllTaskUsersData: any = contextdata?.taskUsers;
    const AllListIdData = contextdata?.AllListId;
    const Context: any = contextdata?.Context;
    const CurrentUserData: any = contextdata?.currentUser;
    currentUserBackupArray = contextdata?.currentUser;
    const [replaceImagePopup, setReplaceImagePopup] = React.useState(false);
    const [AddImageDescriptions, setAddImageDescriptions] = React.useState(false);
    const [AddImageDescriptionsDetails, setAddImageDescriptionsDetails] = React.useState<any>('');


    //  ************** This is used for handeling Site Url for Diffrent Cases ******************** 

    var siteUrls: any;
    if (Props != undefined && Props.Items.siteUrl != undefined && Props.Items.siteUrl.length < 20) {
        if (Props.Items.siteType != undefined) {
            siteUrls = `https://hhhhteams.sharepoint.com/sites/${Props.Items.siteType}${Props.Items.siteUrl}`
        } else {
            siteUrls = AllListIdData.siteUrl;
        }
    } else {
        if (Props.Items.siteUrl != undefined && Props.Items.siteUrl.length > 15) {
            siteUrls = Props.Items?.siteUrl;
        } else {
            siteUrls = AllListIdData?.siteUrl
        }
    }
    useEffect(() => {
        GetSelectedTaskDetails();
    }, [])


    // this used for getting meeting all data from backend side 

    const GetSelectedTaskDetails = async () => {
        try {
            let web = new Web(siteUrls);
            let smartMeta: any;
            smartMeta = await web.lists
                .getById(AllListIdData?.MasterTaskListID)
                .items
                .select("Id", "Title", "DueDate", "AssignedTo/Id", "Attachments", "FeedBack", "Created", "Modified", "PortfolioStructureID", "AssignedTo/Title", "ResponsibleTeam/Title", "ResponsibleTeam/Id", 'AttachmentFiles', "ShortDescriptionVerified", "TaskType/Title", "BasicImageInfo", 'Author/Id', 'Author/Title', "Editor/Title", "Editor/Id", "OffshoreComments", "OffshoreImageUrl", "TeamMembers/Id", "TeamMembers/Title")
                .top(5000)
                .filter(`Id eq ${Props.Items.Id}`).expand("AssignedTo", 'ResponsibleTeam', "AttachmentFiles", "Author", 'TaskType', "Editor", "TeamMembers").get();

            let statusValue: any
            smartMeta?.map((item: any) => {
                let saveImage = []
                if (item.Body != undefined) {
                    item.Body = item.Body.replace(/(<([^>]+)>)/ig, '');
                }
                if (item.BasicImageInfo != null && item.Attachments) {
                    saveImage.push(JSON.parse(item.BasicImageInfo))
                }
                item.TaskId = globalCommon.getTaskId(item);
                item.siteUrl = siteUrls;
                item.siteType = Props.Items?.listName;
                item.listId = Props.Items?.listId;
                let AssignedUsers: any = [];
                AllTaskUsersData?.map((userData: any) => {
                    item.AssignedTo?.map((AssignedUser: any) => {
                        if (userData?.AssingedToUser?.Id == AssignedUser.Id) {
                            AssignedUsers.push(userData);
                        }
                    })
                })
                item.TaskAssignedUsers = AssignedUsers;
                setTaskAssignedTo(item.AssignedTo ? item.AssignedTo : []);
                setTaskResponsibleTeam(item.ResponsibleTeam ? item.ResponsibleTeam : []);
                setTaskTeamMembers(item.TeamMembers ? item.TeamMembers : []);
                if (item.ComponentLink != null) {
                    item.Relevant_Url = item.ComponentLink.Url
                }
                if (item.BasicImageInfo != null && item.Attachments) {
                    saveImage.push(JSON.parse(item.BasicImageInfo))
                }
                if (item.Attachments) {
                    let tempData = []
                    tempData = saveImage[0];
                    item.UploadedImage = saveImage ? saveImage[0] : '';
                    onUploadImageFunction(tempData, tempData?.length);
                }
                if (item.FeedBack != null) {
                    let message = JSON.parse(item.FeedBack);
                    item.FeedBackBackup = message;
                    updateFeedbackArray = message;
                    let Count: any = 0;
                    let feedbackArray = message[0]?.FeedBackDescriptions
                    if (feedbackArray != undefined && feedbackArray.length > 0) {
                        let CommentBoxText = feedbackArray[0].Title?.replace(/(<([^>]+)>)/ig, '');
                        item.CommentBoxText = CommentBoxText;
                        feedbackArray.map((FeedBackData: any) => {
                            if (FeedBackData.isShowLight == "Approve" || FeedBackData.isShowLight == "Maybe" || FeedBackData.isShowLight == "Reject") {
                                Count++;
                            } if (FeedBackData.Subtext != undefined && FeedBackData.Subtext.length > 0) {
                                FeedBackData.Subtext.map((ChildItem: any) => {
                                    if (ChildItem.isShowLight == "Approve" || ChildItem.isShowLight == "Maybe" || ChildItem.isShowLight == "Reject") {
                                        Count++;
                                    }
                                })
                            }
                        })
                    } else {
                        item.CommentBoxText = "<p></p>"
                    }

                    item.FeedBackArray = feedbackArray;
                    FeedBackBackupArray = JSON.stringify(feedbackArray);
                } else {
                    let param: any = Moment(new Date().toLocaleString())
                    var FeedBackItem: any = {};
                    FeedBackItem['Title'] = "FeedBackPicture" + param;
                    FeedBackItem['FeedBackDescriptions'] = [
                        {
                            Title: "\n<p></p>",
                            Completed: false,
                        }
                    ];
                    FeedBackItem['ImageDate'] = "" + param;
                    FeedBackItem['Completed'] = '';
                    updateFeedbackArray = [FeedBackItem]
                    let tempArray: any = [FeedBackItem]
                    item.FeedBack = JSON.stringify(tempArray);
                    item.FeedBackArray = tempArray[0].FeedBackDescriptions;
                    item.FeedBackBackupArray = JSON.stringify(tempArray);
                }
                setMeetingData(item)
                console.log("Task All Details form backend  ==================", item)
            })
        } catch (error) {
            console.log("Error :", error.message);
        }
    }

    const CommentSectionCallBack = React.useCallback((EditorData: any) => {
        CommentBoxData = EditorData

    }, [])
    const SubCommentSectionCallBack = React.useCallback((feedBackData: any) => {
        SubCommentBoxData = feedBackData;
    }, [])


    const UpdateMeetingDetailsFunction = async () => {
        let AssignedToIds: any = [];
        let TeamMemberIds: any = [];
        let ResponsibleTeamIds: any = [];
        if (CommentBoxData?.length > 0 || SubCommentBoxData?.length > 0) {
            if (CommentBoxData?.length == 0 && SubCommentBoxData?.length > 0) {
                let message = JSON.parse(MeetingData.FeedBack);
                let feedbackArray: any = [];
                if (message != null) {
                    feedbackArray = message[0]?.FeedBackDescriptions
                }
                let tempArray: any = [];
                if (feedbackArray[0] != undefined) {
                    tempArray.push(feedbackArray[0])
                } else {
                    let tempObject: any =
                    {
                        "Title": '<p> </p>',
                        "Completed": false,
                        "isAddComment": false,
                        "isShowComment": false,
                        "isPageType": '',
                    }
                    tempArray.push(tempObject);
                }

                CommentBoxData = tempArray;
                let result: any = [];
                if (SubCommentBoxData == "delete") {
                    result = tempArray
                } else {
                    result = tempArray.concat(SubCommentBoxData);
                }
                updateFeedbackArray[0].FeedBackDescriptions = result;
            }

            if (CommentBoxData?.length > 0 && SubCommentBoxData?.length == 0) {
                let result: any = [];
                if (SubCommentBoxData == "delete") {
                    result = CommentBoxData;
                } else {
                    let message = JSON.parse(MeetingData.FeedBack);
                    if (message != null) {
                        let feedbackArray = message[0]?.FeedBackDescriptions;
                        feedbackArray?.map((array: any, index: number) => {
                            if (index > 0) {
                                SubCommentBoxData.push(array);
                            }
                        })
                        result = CommentBoxData.concat(SubCommentBoxData);
                    } else {
                        result = CommentBoxData;
                    }
                }
                updateFeedbackArray[0].FeedBackDescriptions = result;
            }
            if (CommentBoxData?.length > 0 && SubCommentBoxData?.length > 0) {
                let result: any = [];
                if (SubCommentBoxData == "delete") {
                    result = CommentBoxData
                } else {
                    result = CommentBoxData.concat(SubCommentBoxData)
                }
                updateFeedbackArray[0].FeedBackDescriptions = result;
            }
        } else {
            updateFeedbackArray = JSON.parse(MeetingData.FeedBack);
        }

        if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
            TaskAssignedTo?.map((taskInfo) => {
                AssignedToIds.push(taskInfo.Id);
            })
        }

        if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
            TaskTeamMembers?.map((taskInfo) => {
                TeamMemberIds.push(taskInfo.Id);
            })
        }

        if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
            TaskResponsibleTeam?.map((taskInfo) => {
                ResponsibleTeamIds.push(taskInfo.Id);
            })
        }

        try {
            let web = new Web(siteUrls);
            await web.lists.getById(AllListIdData?.MasterTaskListID).items.getById(Props.Items.Id).update({
                Title: MeetingData.Title,
                DueDate: MeetingData.DueDate ? Moment(MeetingData.DueDate).format("MM-DD-YYYY") : null,
                FeedBack: updateFeedbackArray?.length > 0 ? JSON.stringify(updateFeedbackArray) : null,
                AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds.length > 0) ? AssignedToIds : [] },
                Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds.length > 0) ? ResponsibleTeamIds : [] },
                Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds.length > 0) ? TeamMemberIds : [] }
            }).then(async (res: any) => {
                console.log("Updated Succesfully !!!!!!", res);
                closeMeetingPopupFunction();
            })

        } catch (error) {
            console.log("Error:", error.message);
        }
    }



    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span className="siteColor ms-1">
                        {`${MeetingData.PortfolioStructureID != undefined || MeetingData.PortfolioStructureID != null ? MeetingData.PortfolioStructureID : ""} ${MeetingData.Title != undefined || MeetingData.Title != null ? MeetingData.Title : ""}`}
                    </span>
                </div>
                <Tooltip ComponentId="1683" isServiceTask={true} />
            </div>
        )
    }

    const closeMeetingPopupFunction = () => {
        setIsOpenMeetingPopup(false);
        Props.closePopup();
    }


    // const onUploadImageFunction = (item: any) => {
    //     console.log("item data")
    // }


    // Upload Image section all function 
    //***************** This is for Image Upload Section  Functions *****************

    const FlorarImageUploadComponentCallBack = (dt: any) => {
        setUploadBtnStatus(false);
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg"
        }
        let arrayIndex: any = TaskImages?.length
        TaskImages.push(DataObject)
        if (dt.length > 0) {
            onUploadImageFunction(TaskImages, [arrayIndex]);
        }
    }
    const onUploadImageFunction = async (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined) => {
        let lastindexArray = imageList[imageList.length - 1];
        let fileName: any = '';
        let tempArray: any = [];
        let SiteUrl = siteUrls;
        imageList?.map(async (imgItem: any, index: number) => {
            if (imgItem.data_url != undefined && imgItem.file != undefined) {
                let date = new Date()
                let timeStamp = date.getTime();
                let imageIndex = index + 1
                fileName = 'Image' + imageIndex + "-" + MeetingData.Title + " " + MeetingData.Title + timeStamp + ".jpg";
                let currentUserDataObject: any;
                if (currentUserBackupArray != null && currentUserBackupArray.length > 0) {
                    currentUserDataObject = currentUserBackupArray[0];
                }
                let ImgArray = {
                    ImageName: fileName,
                    UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
                    imageDataUrl: SiteUrl + '/Lists/' + "Master Tasks" + '/Attachments/' + MeetingData?.Id + '/' + fileName,
                    ImageUrl: imgItem.data_url,
                    UserImage: currentUserDataObject != undefined && currentUserDataObject.Title?.length > 0 ? currentUserDataObject?.userImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                    UserName: currentUserDataObject != undefined && currentUserDataObject.Title?.length > 0 ? currentUserDataObject.Title : Context?.pageContext._user.displayName,
                    Description: imgItem.Description != undefined ? imgItem.Description : ''
                };
                tempArray.push(ImgArray);
            } else {
                imgItem.Description = imgItem.Description != undefined ? imgItem.Description : '';
                tempArray.push(imgItem);
            }
        })
        tempArray?.map((tempItem: any) => {
            tempItem.Checked = false
        })
        setTaskImages(tempArray);
        // UploadImageFunction(lastindexArray, fileName);
        if (addUpdateIndex != undefined) {
            let updateIndex: any = addUpdateIndex[0]
            let updateImage: any = imageList[updateIndex];
            if (updateIndex + 1 >= imageList.length) {
                UploadImageFunction(lastindexArray, fileName, tempArray);

            }
            else {
                if (updateIndex < imageList.length) {
                    ReplaceImageFunction(updateImage, updateIndex);
                }
            }
        }
    };
    const UploadImageFunction = (Data: any, imageName: any, DataJson: any) => {
        let listId = AllListIdData.MasterTaskListID;
        // let listName = Items.Items.listName;
        let Id = MeetingData?.Id
        var src = Data.data_url?.split(",")[1];
        var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
            return c.charCodeAt(0);
        }));
        const data: any = byteArray
        var fileData = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }
        setTimeout(() => {
            if (AllListIdData.MasterTaskListID != undefined) {
                (async () => {
                    let web = new Web(siteUrls);
                    let item = web.lists.getById(listId).items.getById(Id);
                    item.attachmentFiles.add(imageName, data).then(() => {
                        console.log("Attachment added");
                        UpdateBasicImageInfoJSON(DataJson);
                    });
                    setUploadBtnStatus(false);
                })().catch(console.log)
            }
        }, 2500);
    }


    const UpdateBasicImageInfoJSON = async (JsonData: any) => {
        var UploadImageArray: any = []
        if (JsonData != undefined && JsonData.length > 0) {
            JsonData?.map((imgItem: any) => {
                if (imgItem.ImageName != undefined && imgItem.ImageName != null) {
                    if (imgItem.imageDataUrl != undefined && imgItem.imageDataUrl != null) {
                        let tempObject: any = {
                            ImageName: imgItem.ImageName,
                            ImageUrl: imgItem.imageDataUrl,
                            UploadeDate: imgItem.UploadeDate,
                            UserName: imgItem.UserName,
                            UserImage: imgItem.UserImage,
                            Description: imgItem.Description != undefined ? imgItem.Description : ''
                        }
                        UploadImageArray.push(tempObject)
                    } else {
                        imgItem.Description = imgItem.Description != undefined ? imgItem.Description : '';
                        UploadImageArray.push(imgItem);
                    }
                }
            })
        }
        if (UploadImageArray != undefined && UploadImageArray.length > 0) {
            try {
                let web = new Web(siteUrls);
                await web.lists.getById(AllListIdData.MasterTaskListID).items.getById(MeetingData?.Id).update({ BasicImageInfo: JSON.stringify(UploadImageArray) }).then((res: any) => { console.log("Image JSON Updated !!"); AddImageDescriptionsIndex = undefined })
            } catch (error) {
                console.log("Error Message :", error);
            }
        }
    }


    // ****************** This is used for Delete Task Functions **********************
    const deleteTaskFunction = async (TaskID: number) => {
        let deletePost = confirm("Do you really want to delete this Task?")
        if (deletePost) {
            deleteItemFunction(TaskID);
        } else {
            console.log("Your Task has not been deleted");
        }
    }
    const deleteItemFunction = async (itemId: any) => {
        try {
            if (Props?.Items?.listId != undefined) {
                let web = new Web(siteUrls);
                await web.lists.getById(Props?.Items?.listId).items.getById(itemId).recycle();

            } else {
                let web = new Web(siteUrls);
                await web.lists.getById(Props?.Items?.listId).items.getById(itemId).recycle();
            }

        } catch (error) {
            console.log("Error:", error.message);
        }

    }


    const RemoveImageFunction = (imageIndex: number, imageName: any, FunctionType: any) => {
        let tempArray: any = [];
        if (FunctionType == "Remove") {
            TaskImages?.map((imageData: any, index: number) => {
                if (index != imageIndex) {
                    tempArray.push(imageData)
                }
            })
            setTaskImages(tempArray);
        }
        if (AllListIdData.MasterTaskListID != undefined) {
            (async () => {
                let web = new Web(siteUrls);
                let item = web.lists.getById(AllListIdData.MasterTaskListID).items.getById(MeetingData?.Id);
                item.attachmentFiles.getByName(imageName).recycle();
                UpdateBasicImageInfoJSON(tempArray);
                console.log("Attachment deleted");

            })().catch(console.log)
        }
    }

    const ReplaceImageFunction = (Data: any, ImageIndex: any) => {
        let ImageName = MeetingData?.UploadedImage[ImageIndex].ImageName
        var src = Data?.data_url?.split(",")[1];
        var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
            return c.charCodeAt(0);
        }));
        const data: any = byteArray
        var fileData = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }
        if (siteUrls != undefined) {
            (async () => {
                let web = new Web(siteUrls);
                let item = web.lists.getById(AllListIdData.MasterTaskListID).items.getById(MeetingData?.Id);
                item.attachmentFiles.getByName(ImageName).setContent(data);
                console.log("Attachment Updated");
            })().catch(console.log)
        }
        setTaskImages(MeetingData.UploadedImage);
    }


    const openReplaceImagePopup = (index: any) => {
        setReplaceImagePopup(true);
        ReplaceImageIndex = index;
    }
    // *************** this is used for adding description for images functions ******************

    const openAddImageDescriptionFunction = (Index: any, Data: any, type: any) => {
        setAddImageDescriptions(true);
        setAddImageDescriptionsDetails(Data.Description != undefined ? Data.Description : '');
        AddImageDescriptionsIndex = Index;
    }
    const closeAddImageDescriptionFunction = () => {
        setAddImageDescriptions(false);
        AddImageDescriptionsIndex = undefined;
    }

    const UpdateImageDescription = (e: any) => {
        TaskImages[AddImageDescriptionsIndex].Description = e.target.value;
        setAddImageDescriptionsDetails(e.target.value);
    }

    const SaveImageDescription = () => {
        UpdateBasicImageInfoJSON(TaskImages);
        closeAddImageDescriptionFunction();
    }

    const UpdateImage = () => {
        if (ReplaceImageData != undefined && ReplaceImageIndex != undefined) {
            ReplaceImageFunction(ReplaceImageData, ReplaceImageIndex);
            const copy = [...TaskImages];
            const ImageUrl = TaskImages[ReplaceImageIndex].ImageUrl;
            const obj = { ...TaskImages[ReplaceImageIndex], ImageUrl: ReplaceImageData.data_url, imageDataUrl: ImageUrl };
            copy[ReplaceImageIndex] = obj;
            setTaskImages(copy);
            setReplaceImagePopup(false);
        }
    }

    const MouseHoverImageFunction = (e: any, HoverImageData: any) => {
        e.preventDefault();
        setHoverImageModal("Block");
        setHoverImageData([HoverImageData]);
    }
    const MouseOutImageFunction = (e: any) => {
        e.preventDefault();
        setHoverImageModal("None");
    }


    const DDComponentCallBack = (dt: any) => {
        console.log("Team Config Callback", dt);
        if (dt?.AssignedTo?.length > 0) {
            let tempArray: any = [];
            dt.AssignedTo?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskAssignedTo(tempArray);
            MeetingData.AssignedTo = tempArray;
        } else {
            setTaskAssignedTo([]);
            MeetingData.AssignedTo = [];
        }
        if (dt?.TeamMemberUsers?.length > 0) {
            let tempArray: any = [];
            dt.TeamMemberUsers?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskTeamMembers(tempArray);
            MeetingData.TeamMembers = tempArray;
        } else {
            setTaskTeamMembers([]);
            MeetingData.TeamMembers = [];
        }
        if (dt?.ResponsibleTeam?.length > 0) {
            let tempArray: any = [];
            dt.ResponsibleTeam?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskResponsibleTeam(tempArray);
            MeetingData.ResponsibleTeam = tempArray;
        } else {
            setTaskResponsibleTeam([]);
            MeetingData.ResponsibleTeam = [];
        }
    }

    const shareThisTaskFunction = (EmailData: any) => {
        var link = "mailTo:"
            + "?cc:"
            + "&subject=" + " [" + "HHHH" + "-Meeting ] " + EmailData.Title
            + "&body=" + `${siteUrls}/SitePages/Meeting-Profile.aspx?taskId=${EmailData.ID}`;
        window.location.href = link;
    }

    const FlorarImageReplaceComponentCallBack = (dt: any) => {
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg"
        }
        ReplaceImageData = DataObject;

    }



    const onRenderCustomFooterMain = () => {
        return (
            // <footer className={ServicesTaskCheck ? "serviepannelgreena bg-f4 fixed-bottom" : "bg-f4 fixed-bottom"}>
            <footer className="bg-f4 fixed-bottom">
                <div className="align-items-center d-flex justify-content-between me-3 ps-4 py-2">
                    <div>
                        <div className="">
                            Created <span className="font-weight-normal siteColor">
                                {MeetingData.Created ? Moment(MeetingData.Created).format("DD/MM/YYYY") : ""}
                            </span>
                            By <span className="font-weight-normal siteColor">
                                {MeetingData.Author?.Title ? MeetingData.Author?.Title : ''}
                            </span>
                        </div>
                        <div>
                            Last modified <span className="font-weight-normal siteColor">
                                {MeetingData.Modified ? Moment(MeetingData.Modified).format("DD/MM/YYYY") : ''}
                            </span> By <span className="font-weight-normal siteColor">
                                {MeetingData.Editor?.Title ? MeetingData.Editor.Title : ''}
                            </span>
                        </div>
                        <div>
                            <a className="hreflink siteColor">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" style={{ marginLeft: "-5px" }} fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                </svg>
                                {/* <RiDeleteBin6Line /> */}
                                <span
                                    onClick={() => deleteTaskFunction(MeetingData.ID)}
                                >Delete This Item</span>
                            </a>
                            {/* | */}
                            {/* <span>
                                {MeetingData.ID ?
                                    <VersionHistory taskId={MeetingData.Id} listId={Items.Items.listId} siteUrls={siteUrls} /> : null}
                            </span> */}
                        </div>
                    </div>
                    <div>
                        <div className="footer-right">
                            <span className="hreflink siteColor f-mailicons mx-2"
                                onClick={() => shareThisTaskFunction(MeetingData)}
                            >
                                <span title="Edit Task" className="svg__iconbox svg__icon--mail"></span>
                                Share This Meeting
                            </span> ||

                            {/* {Items.Items.siteType == "Offshore Tasks" ? 
                            <a target="_blank" className="mx-2" data-interception="off"
                                // href={`${siteUrls}/Lists/SharewebQA/EditForm.aspx?ID=${MeetingData.ID}`}
                                >
                                Open Out-Of-The-Box Form
                            </a> : */}
                            <a target="_blank" className="mx-2" data-interception="off"
                                href={`${siteUrls}/Lists/Master%20Tasks/EditForm.aspx?ID=${MeetingData.ID}`}
                            >
                                Open Out-Of-The-Box Form
                            </a>
                            {/* } */}
                            <span>
                                <button className="btn btn-primary px-4 mx-1"
                                    onClick={UpdateMeetingDetailsFunction}
                                >
                                    Save
                                </button>
                                <button type="button" className="btn btn-default"
                                    onClick={closeMeetingPopupFunction}
                                >
                                    Cancel
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }

    const onRenderCustomReplaceImageHeader = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span>
                        Replace Image
                    </span>
                </div>
                <Tooltip ComponentId="756" isServiceTask={false} />
            </div>
        )
    }

    const closeReplaceImagePopup = () => {
        setReplaceImagePopup(false)
    }

    return (
        <div>
            <Panel
                type={PanelType.large}
                isOpen={IsOpenMeetingPopup}
                onDismiss={closeMeetingPopupFunction}
                onRenderHeader={onRenderCustomHeaderMain}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterMain}
            >
                <div className="modal-body mb-5 my-2">
                    <div className="d-flex justify-content-between">
                        <div className="col-md-8 d-flex justify-content-between">
                            <div className="col-4">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" placeholder="Task Name"
                                    defaultValue={MeetingData.Title}
                                    onChange={(e) => setMeetingData({ ...MeetingData, Title: e.target.value })}
                                />
                            </div>
                            <div className="col-4 mx-2">
                                <label className="form-label full-width">Meeting Date
                                </label>
                                <input type="date" className="form-control" placeholder="Enter Due Date" max="9999-12-31"
                                    min={MeetingData.Created ? Moment(MeetingData.Created).format("YYYY-MM-DD") : ""}
                                    defaultValue={MeetingData.DueDate ? Moment(MeetingData.DueDate).format("YYYY-MM-DD") : ''}
                                    onChange={(e) => setMeetingData({
                                        ...MeetingData, DueDate: e.target.value
                                    })}
                                />
                            </div>
                            <div className="col-3">
                                <div className="input-group">
                                    <label className="form-label full-width mx-2 mb-1">
                                        {MeetingData.TaskAssignedUsers?.length > 0 ? 'Working Member' : ""}
                                    </label>
                                    {MeetingData.TaskAssignedUsers?.map((userDtl: any, index: any) => {
                                        return (
                                            <div className="TaskUsers ms-2" key={index}>
                                                <a
                                                    target="_blank"
                                                    data-interception="off"
                                                    href={`${siteUrls}/SitePages/TaskDashboard.aspx?UserId=${userDtl.AssingedToUserId}&Name=${userDtl.Title}`} >
                                                    <img className="ProirityAssignedUserPhoto" data-bs-placement="bottom" title={userDtl.Title ? userDtl.Title : ''}

                                                        src={userDtl.Item_x0020_Cover ? userDtl.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                    />
                                                </a>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="full_width ">
                                {MeetingData?.Id != undefined ?
                                    <CommentCard
                                        siteUrl={siteUrls}
                                        itemID={MeetingData?.Id}
                                        AllListId={AllListIdData}
                                        Context={Context}
                                    /> : null}
                            </div>

                        </div>
                    </div>
                    <div>
                        {MeetingData.Id != undefined ?
                            <TeamConfigurationCard ItemInfo={MeetingData} parentCallback={DDComponentCallBack} AllListId={AllListIdData}>
                            </TeamConfigurationCard>
                            :
                            null}
                    </div>
                    <div className="image-and-feedback-section full-width">
                        <div className="d-flex py-3 mb-4 full-width">
                            {/* <div className={IsShowFullViewImage != true ?
                                'col-sm-3 padL-0 DashboardTaskPopup-Editor above' :
                                'col-sm-6  padL-0 DashboardTaskPopup-Editor above'}> */}
                            <div className='col-3 padL-0 DashboardTaskPopup-Editor above mt-3'>
                                <div className="image-upload">
                                    <ImageUploading
                                        multiple
                                        value={TaskImages}
                                        onChange={onUploadImageFunction}
                                        dataURLKey="data_url"
                                    >
                                        {({
                                            imageList,
                                            onImageUpload,
                                            onImageRemoveAll,
                                            onImageUpdate,
                                            onImageRemove,
                                            isDragging,
                                            dragProps,
                                        }) => (
                                            <div className="upload__image-wrapper">

                                                {imageList.map((ImageDtl, index) => (
                                                    <div key={index} className="image-item">
                                                        <div className="my-1">
                                                            <div>
                                                                {/* <input type="checkbox" className="form-check-input"
                                                                    checked={ImageDtl.Checked}
                                                                // onClick={() => ImageCompareFunction(ImageDtl, index)}
                                                                /> */}
                                                                <span className="mx-1">{ImageDtl.ImageName ? ImageDtl.ImageName.slice(0, 24) : ''}</span>
                                                            </div>
                                                            <a href={ImageDtl.ImageUrl} target="_blank" data-interception="off">
                                                                <img src={ImageDtl.ImageUrl ? ImageDtl.ImageUrl : ''}
                                                                    onMouseOver={(e) => MouseHoverImageFunction(e, ImageDtl)}
                                                                    onMouseOut={(e) => MouseOutImageFunction(e)}
                                                                    className="card-img-top" />
                                                            </a>

                                                            <div className="card-footer d-flex justify-content-between p-1 px-2">
                                                                <div>
                                                                    <span className="fw-semibold">{ImageDtl.UploadeDate ? ImageDtl.UploadeDate : ''}</span>
                                                                    <span className="mx-1">
                                                                        <img className="imgAuthor" title={ImageDtl.UserName} src={ImageDtl.UserImage ? ImageDtl.UserImage : ''} />
                                                                    </span>
                                                                </div>
                                                                <div>

                                                                    <span
                                                                        onClick={() => openReplaceImagePopup(index)}
                                                                        title="Replace image"><TbReplace /> </span>
                                                                    <span className="mx-1" title="Delete"
                                                                        onClick={() => RemoveImageFunction(index, ImageDtl.ImageName, "Remove")}
                                                                    > | <RiDeleteBin6Line /> | </span>
                                                                    {/* <span title="Customize the width of page"
                                                                    // onClick={() => ImageCustomizeFunction(index)}
                                                                    >
                                                                        <FaExpandAlt /> |
                                                                    </span> */}
                                                                    <span title={ImageDtl.Description != undefined && ImageDtl.Description?.length > 1 ? ImageDtl.Description : "Add Image Description"} className="mx-1 img-info"
                                                                        onClick={() => openAddImageDescriptionFunction(index, ImageDtl, "Opne-Model")}
                                                                    >
                                                                        <span className="svg__iconbox svg__icon--info "></span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="d-flex justify-content-between py-1 border-top ">
                                                    {/* <span className="siteColor"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => alert("We are working on it. This Feature will be live soon ..")}>
                                                        Upload Item-Images
                                                    </span> */}

                                                    {TaskImages?.length != 0 ?
                                                        <span className="siteColor"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => setUploadBtnStatus(UploadBtnStatus ? false : true)}
                                                        >
                                                            Add New Image
                                                        </span>
                                                        : null}
                                                </div>
                                                {UploadBtnStatus ?
                                                    <div>
                                                        <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} />
                                                    </div>
                                                    : null}
                                                {TaskImages?.length == 0 ? <div>

                                                    <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} />

                                                </div> : null}
                                            </div>
                                        )}
                                    </ImageUploading>
                                </div>
                            </div>
                            <div className='col-sm-9 mx-2 toggle-task'>
                                {MeetingData.Id != null ? <>
                                    <CommentBoxComponent
                                        data={MeetingData.FeedBackArray}
                                        callBack={CommentSectionCallBack}
                                        allUsers={AllTaskUsersData}
                                        ApprovalStatus={false}
                                        SmartLightStatus={false}
                                        SmartLightPercentStatus={false}
                                        Context={Props.Items?.context}
                                    />
                                    <Example
                                        textItems={MeetingData.FeedBackArray}
                                        callBack={SubCommentSectionCallBack}
                                        allUsers={AllTaskUsersData}
                                        ItemId={0}
                                        SiteUrl={siteUrls}
                                        ApprovalStatus={false}
                                        SmartLightStatus={false}
                                        SmartLightPercentStatus={false}
                                        Context={Props.Items.context}
                                    />
                                </>
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
            </Panel >
            {/* ********************* this is Replace Image panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomReplaceImageHeader}
                isOpen={replaceImagePopup}
                onDismiss={closeReplaceImagePopup}
                isBlocking={true}
                type={PanelType.custom}
                customWidth="500px"
            >
                <div>
                    <div className="modal-body">
                        <FlorarImageUploadComponent callBack={FlorarImageReplaceComponentCallBack} />
                    </div>
                    <footer className="float-end mt-1">
                        <button type="button" className="btn btn-primary px-3 mx-1" onClick={UpdateImage} >
                            Update
                        </button>
                        <button type="button" className="btn btn-default px-3" onClick={closeReplaceImagePopup}>
                            Cancel
                        </button>
                    </footer>
                </div>
            </Panel>

            {/* ********************** This in Add Image Description Model ****************** */}
            <Modal isOpen={AddImageDescriptions} isBlocking={AddImageDescriptions} containerClassName="custommodalpopup p-2">
                <div className="modal-header mb-1">
                    <h5 className="modal-title">Add Image Description</h5>
                    <span className='mx-1'> <Tooltip ComponentId='5669' isServiceTask={false} /></span>
                    <button type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={closeAddImageDescriptionFunction}
                    ></button>
                </div>
                <div className="modal-body">
                    <div className='col mx-2'><textarea id="txtUpdateComment" rows={6}
                        value={AddImageDescriptionsDetails != undefined ? AddImageDescriptionsDetails : ''}
                        className="full-width"
                        onChange={(e) => UpdateImageDescription(e)}></textarea></div>
                </div>
                <footer className='text-end mt-2 mx-2'>
                    <button className="btn btnPrimary " onClick={SaveImageDescription}>Save</button>
                    <button className='btn btn-default ms-1' onClick={closeAddImageDescriptionFunction}>Cancel</button>
                </footer>
            </Modal>

            {/* ********************** this in hover image modal ****************** */}
            <div className="hoverImageModal" style={{ display: hoverImageModal }}>
                <div className="hoverImageModal-popup">
                    <div className="hoverImageModal-container">
                        <span style={{ color: 'white' }}>{HoverImageData[0]?.ImageName}</span>
                        <img className="img-fluid" style={{ width: '100%', height: "450px" }} src={HoverImageData[0]?.ImageUrl}></img>
                    </div>
                    {HoverImageData[0]?.Description != undefined && HoverImageData[0]?.Description.length > 0 ? <div className="bg-Ff mx-2 p-2 text-start">
                        <span>{HoverImageData[0]?.Description ? HoverImageData[0]?.Description : ''}</span>
                    </div> : null}
                    <footer className="justify-content-between d-flex py-2 mx-2" style={{ color: "white" }}>
                        <span className="mx-1"> Uploaded By :
                            <span className="mx-1">
                                <img style={{ width: "25px", borderRadius: "25px" }} src={HoverImageData[0]?.UserImage ? HoverImageData[0]?.UserImage : ''} />
                            </span>
                            {HoverImageData[0]?.UserName ? HoverImageData[0]?.UserName : ''}
                        </span>
                        <span className="fw-semibold">
                            Uploaded Date : {HoverImageData[0]?.UploadeDate ? HoverImageData[0]?.UploadeDate : ''}
                        </span>
                    </footer>
                </div>
            </div>

        </div >
    )
}
export default MeetingPopupComponent;