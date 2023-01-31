import * as React from "react";
import * as $ from 'jquery';
import * as Moment from 'moment';
import { Web } from "sp-pnp-js";
import Picker from "./SmartMetaDataPicker";
import Example from "./FroalaCommnetBoxes";
import ImageUploading, { ImageListType } from "react-images-uploading";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import ComponentPortPolioPopup from "../../webparts/EditPopupFiles/ComponentPortfolioSelection";
import axios, { AxiosResponse } from 'axios';
import "bootstrap/js/dist/tab.js";
import CommentCard from "../../globalComponents/Comments/CommentCard";
import LinkedComponent from './LinkedComponent';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { AiOutlineFullscreen } from 'react-icons/ai'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { TbReplace } from 'react-icons/tb'
import NewTameSheetComponent from "./NewTimeSheet";
import CommentBoxComponent from "./CommentBoxComponent";

var AllMetaData: any = []
var taskUsers: any = []
var IsShowFullViewImage = false;
var CommentBoxData: any = [];
var SubCommentBoxData: any = [];
var updateFeedbackArray: any = [];
const EditTaskPopup = (Items: any) => {
    const [images, setImages] = React.useState([]);
    const [TaskImages, setTaskImages] = React.useState([]);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [IsServices, setIsServices] = React.useState(false);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [CategoriesData, setCategoriesData] = React.useState('');
    const [linkedComponentData, setLinkedComponentData] = React.useState([]);
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const maxNumber = 69;
    const [ImageSection, setImageSection] = React.useState([]);
    const [UpdateTaskInfo, setUpdateTaskInfo] = React.useState(
        {
            Title: '', PercentCompleteStatus: ''
        }
    )
    const [FeedBackDescription, setFeedBackDescription] = React.useState([]);
    const [EditData, setEditData] = React.useState<any>({});
    const [ShareWebComponent, setShareWebComponent] = React.useState('');
    const [modalIsOpen, setModalIsOpen] = React.useState(true);
    const [TaskStatusPopup, setTaskStatusPopup] = React.useState(false);
    const [composition, setComposition] = React.useState(false);
    const [FolderData, SetFolderData] = React.useState([]);
    const [PercentCompleteStatus, setPercentCompleteStatus] = React.useState('');
    const [taskStatus, setTaskStatus] = React.useState('');
    const [PercentCompleteCheck, setPercentCompleteCheck] = React.useState(true)
    const [itemRank, setItemRank] = React.useState('');
    const [PriorityStatus, setPriorityStatus] = React.useState();
    const StatusArray = [
        { value: 1, status: "01% For Approval", taskStatusComment: "For Approval" },
        { value: 2, status: "02% Follow Up", taskStatusComment: "Follow Up" },
        { value: 3, status: "03% Approved", taskStatusComment: "Approved" },
        { value: 5, status: "05% Acknowledged", taskStatusComment: "Acknowledged" },
        { value: 10, status: "10% working on it", taskStatusComment: "working on it" },
        { value: 70, status: "70% Re-Open", taskStatusComment: "Re-Open" },
        { value: 80, status: "80% In QA Review", taskStatusComment: "In QA Review" },
        { value: 90, status: "90% Task completed", taskStatusComment: "Task completed" },
        { value: 93, status: "93% For Review", taskStatusComment: "For Review" },
        { value: 96, status: "96% Follow-up later", taskStatusComment: "Follow-up later" },
        { value: 99, status: "99% Completed", taskStatusComment: "Completed" },
        { value: 100, status: "100% Closed", taskStatusComment: "Closed" }
    ]
    // const setModalIsOpenToTrue = () => {
    //     setModalIsOpen(true)
    // }
    const Call = React.useCallback((propsItems: any, type: any) => {
        setIsComponent(false);
        setIsComponentPicker(false);
        if (type == "SmartComponent") {
            if (propsItems?.smartComponent?.length > 0) {
                Items.Items.smartComponent = propsItems.smartComponent;
                // setEditData({ ...EditData, Component: propsItems.smartComponent })
                setSmartComponentData(propsItems.smartComponent);
                console.log("Popup component smartComponent ", propsItems.smartComponent)
            }
        }
        if (type == "Category") {
            if (propsItems?.categories != "" && propsItems?.categories != undefined) {
                Items.Items.Categories = propsItems.categories;
                // setEditData({ ...EditData, Categories: propsItems.Categories })
                setCategoriesData(CategoriesData + " " + propsItems.categories);
                console.log("Popup component Categories", propsItems.categories)
            }
        }
        if (type == "LinkedComponent") {
            if (propsItems?.linkedComponent?.length > 0) {
                Items.Items.linkedComponent = propsItems.linkedComponent;
                // setEditData({ ...EditData, RelevantPortfolio: propsItems.linkedComponent })
                setLinkedComponentData(propsItems.linkedComponent);
                console.log("Popup component linkedComponent", propsItems.linkedComponent)
            }
        }

    }, []);
    function EditComponentCallback() {
        Items.Items.Call();
    }
    const EditComponent = (item: any, title: any) => {
        setIsComponent(true);
        setShareWebComponent(item);
    }
    const EditComponentPicker = (item: any, title: any) => {
        setIsComponentPicker(true);
        setShareWebComponent(item);
    }
    const EditLinkedServices = (item: any, title: any) => {
        setIsServices(true);
        setShareWebComponent(item);
    }
    React.useEffect(() => {
        loadTaskUsers();
        GetEditData();
        // Descriptions();
    }, [])
    const setPriority = function (val: any) {
        setPriorityStatus(val)
    }
    const uploadImageFunction = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        imageList?.map((imgItem) => {
            if (imgItem.dataURL != undefined && imgItem.file != undefined) {
                let ImgArray = [{
                    ImageName: imgItem.file.name,
                    ImageUrl: EditData?.siteUrl + '/Lists/' + EditData?.siteType + '/Attachments/' + EditData?.Id + '/' + imgItem.file.name,
                    UploadeDate: new Date(),
                    UserImage: EditData.Author?.Title,
                    UserName: EditData.Author?.Title
                }];
                TaskImages.push(ImgArray);

            } else {
                TaskImages.push(imgItem);
            }
        })
        setImages(imageList as never[]);
    };
    const openTaskStatusUpdatePopup = (itemData: any) => {
        setTaskStatusPopup(true);
    }
    const ExpandSiteComposition = () => {
        setComposition(!composition)
    }

    var count = 0;
    const loadTaskUsers = () => {
        var AllTaskUsers: any = []
        axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$select=Id,UserGroupId,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver&$orderby=SortOrder asc,Title asc")
            .then((response: AxiosResponse) => {
                taskUsers = response.data.value;
                $.each(taskUsers, function (index: any, user: any) {
                    var ApproverUserItem = '';
                    var UserApproverMail: any = []
                    if (user.Title != undefined && user.IsShowTeamLeader === true) {
                        if (user.Approver != undefined) {
                            $.each(user.Approver.results, function (ApproverUser: any, index) {
                                ApproverUserItem += ApproverUser.Title + (index === user.Approver.results?.length - 1 ? '' : ',');
                                UserApproverMail.push(ApproverUser.Name.split('|')[2]);
                            })
                            user['UserManagerName'] = ApproverUserItem;
                            user['UserManagerMail'] = UserApproverMail;
                        }
                        AllTaskUsers.push(user);
                    }

                });
                if (AllMetaData != undefined && AllMetaData?.length > 0) {
                    GetEditData();
                }
            },
                function (data) {
                });
    }

    const GetEditData = async () => {
        try {
            let web = new Web(Items.Items.siteUrl);
            let smartMeta;
            if (Items.Items.listId != undefined) {
                smartMeta = await web.lists
                    .getById(Items.Items.listId)
                    .items
                    .select("Id,Title,Priority_x0020_Rank,BasicImageInfo,Attachments,Priority,Mileage,EstimatedTime,CompletedDate,EstimatedTimeDescription,FeedBack,Status,ItemRank,IsTodaysTask,Body,Component/Id,component_x0020_link,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
                    .top(5000)
                    .filter(`Id eq ${Items.Items.ID}`)
                    .expand('AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,RelevantPortfolio')
                    .get();
            }
            else {
                smartMeta = await web.lists
                    .getByTitle(Items.Items.listName)
                    .items
                    .select("Id,Title,Priority_x0020_Rank,BasicImageInfo,Attachments,Priority,Mileage,EstimatedTime,CompletedDate,EstimatedTimeDescription,FeedBack,Status,ItemRank,IsTodaysTask,Body,Component/Id,component_x0020_link,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
                    .top(5000)
                    .filter(`Id eq ${Items.Items.ID}`)
                    .expand('AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,RelevantPortfolio')
                    .get();
            }

            smartMeta?.map((item: any) => {
                let saveImage = []
                if (item.PercentComplete != undefined) {
                    let statusValue = item.PercentComplete * 100;
                    item.PercentComplete = statusValue;
                    StatusArray?.map((item: any) => {
                        if (statusValue == item.value) {
                            setPercentCompleteStatus(item.status);
                            setTaskStatus(item.taskStatusComment);
                        }
                    })
                }
                if (item.Body != undefined) {
                    item.Body = item.Body.replace(/(<([^>]+)>)/ig, '');
                }
                if (item.BasicImageInfo != null && item.Attachments) {
                    saveImage.push(JSON.parse(item.BasicImageInfo))
                }
                if (item.Priority_x0020_Rank != undefined) {
                    if (currentUsers != undefined) {
                        currentUsers?.map((rank: any) => {
                            if (rank.rank == item.Priority_x0020_Rank) {
                                item.Priority_x0020_Rank = rank.rank;
                            }
                        })
                    }

                }
                let AssignedUsers: any = [];
                if (taskUsers != undefined) {
                    taskUsers?.map((userData: any) => {
                        item.AssignedTo?.map((AssignedUser: any) => {
                            if (userData?.AssingedToUserId == AssignedUser.Id) {
                                AssignedUsers.push(userData);
                            }
                        })
                    })
                }

                if (item.Attachments) {
                    let tempData = []
                    tempData = saveImage[0];
                    item.UploadedImage = saveImage ? saveImage[0] : '';
                    uploadImageFunction(tempData, tempData?.length);
                }

                if (item.Categories != null) {
                    setCategoriesData(item.Categories);
                }
                if (item.Component?.length > 0) {
                    setSmartComponentData(item.Component);
                }
                if (item.RelevantPortfolio?.length > 0) {
                    setLinkedComponentData(item.RelevantPortfolio)
                }
                item.TaskAssignedUsers = AssignedUsers;
                if (item.FeedBack != null) {
                    let message = JSON.parse(item.FeedBack);
                    updateFeedbackArray = message;
                    let feedbackArray = message[0]?.FeedBackDescriptions
                    let CommentBoxText = feedbackArray[0].Title.replace(/(<([^>]+)>)/ig, '');
                    item.CommentBoxText = CommentBoxText;
                    item.FeedBackArray = feedbackArray;
                }
                setEditData(item)
                setPriorityStatus(item.Priority)
                console.log("Task All Data Info =====", item)
            })
        } catch (error) {
            console.log("Error :", error.message);
        }
    }
    const PercentCompleted = (StatusData: any) => {
        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusData.value })
        setPercentCompleteStatus(StatusData.status);
        setTaskStatus(StatusData.taskStatusComment);
        setPercentCompleteCheck(false);
    }
    const closeTaskStatusUpdatePopup = () => {
        setTaskStatusPopup(false)
        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: (EditData.PercentComplete ? EditData.PercentComplete : null) })
        StatusArray?.map((array: any) => {
            if (EditData.PercentComplete == array.value) {
                setPercentCompleteStatus(array.status);
                setTaskStatus(array.taskStatusComment);
            }
        })
        setPercentCompleteCheck(false);
    }
    const setModalIsOpenToFalse = () => {

        let callBack = Items.Call
        callBack();
    }
    let currentUsers = [
        { rankTitle: 'Select Item Rank', rank: null },
        { rankTitle: '(8) Top Highlights', rank: 8 },
        { rankTitle: '(7) Featured Item', rank: 7 },
        { rankTitle: '(6) Key Item', rank: 6 },
        { rankTitle: '(5) Relevant Item', rank: 5 },
        { rankTitle: '(4) Background Item', rank: 4 },
        { rankTitle: '(2) to be verified', rank: 2 },
        { rankTitle: '(1) Archive', rank: 1 },
        { rankTitle: '(0) No Show', rank: 0 }
    ]
    var smartComponentsIds: any = [];
    var RelevantPortfolioIds: any = [];
    var AssignedToIds: any = [];
    var ResponsibleTeamIds: any = [];
    var TeamMemberIds: any = [];
    const UpdateTaskInfoFunction = async (child: any) => {
        var UploadImage: any = []
        var item: any = {}
        images?.map((imgDtl: any) => {
            if (imgDtl.dataURL != undefined) {
                var imgUrl = Items.Items.siteUrl + '/Lists/' + EditData.siteType + '/Attachments/' + EditData.Id + '/' + imgDtl.file.name;
            }
            // else {
            //     imgUrl = EditData.Item_x002d_Image != undefined ? EditData.Item_x002d_Image.Url : null;
            // }
            if (imgDtl.file != undefined) {
                item['ImageName'] = imgDtl.file.name
                item['ImageUrl'] = imgUrl
                item['UploadeDate'] = EditData.Created
                item['UserImage'] = EditData.Author?.Title
                item['UserName'] = EditData.Author?.Title
            }
            UploadImage.push(item)
        })

        if (CommentBoxData?.length > 0 || SubCommentBoxData?.length > 0) {
            if (CommentBoxData?.length == 0 && SubCommentBoxData?.length > 0) {
                let message = JSON.parse(EditData.FeedBack);
                let feedbackArray = message[0]?.FeedBackDescriptions
                let tempArray:any =[];
                tempArray.push(feedbackArray[0])
                CommentBoxData = tempArray;
                let result = tempArray.concat(SubCommentBoxData);
                updateFeedbackArray[0].FeedBackDescriptions = result;

            }
            if (CommentBoxData?.length > 0 && SubCommentBoxData?.length == 0) {
                let message = JSON.parse(EditData.FeedBack);
                let feedbackArray = message[0]?.FeedBackDescriptions;
                feedbackArray?.map((array: any, index: number) => {
                    if (index > 0) {
                        SubCommentBoxData.push(array);
                    }
                })
                let result = CommentBoxData.concat(SubCommentBoxData);
                updateFeedbackArray[0].FeedBackDescriptions = result;

            }
            if (CommentBoxData?.length > 0 && SubCommentBoxData?.length > 0) {
                let result = CommentBoxData.concat(SubCommentBoxData);
                updateFeedbackArray[0].FeedBackDescriptions = result;
            }
        } else {
            updateFeedbackArray = JSON.parse(EditData.FeedBack);
        }



        if (smartComponentData != undefined && smartComponentData?.length > 0) {
            smartComponentData?.map((com: any) => {
                if (smartComponentData != undefined && smartComponentData?.length >= 0) {
                    $.each(smartComponentData, function (index: any, smart: any) {
                        smartComponentsIds.push(smart.Id);
                    })
                }
            })
        }
        if (linkedComponentData != undefined && linkedComponentData?.length > 0) {
            linkedComponentData?.map((com: any) => {
                if (linkedComponentData != undefined && linkedComponentData?.length >= 0) {
                    $.each(linkedComponentData, function (index: any, smart: any) {
                        RelevantPortfolioIds.push(smart.Id);
                    })
                }
            })
        }

        if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
            TaskAssignedTo?.map((taskInfo) => {
                AssignedToIds.push(taskInfo.Id);
            })
        } else {
            if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
                EditData.AssignedTo?.map((taskInfo: any) => {
                    AssignedToIds.push(taskInfo.Id);
                })
            }
        }
        if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
            TaskTeamMembers?.map((taskInfo) => {
                TeamMemberIds.push(taskInfo.Id);
            })
        } else {
            if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
                EditData.Team_x0020_Members?.map((taskInfo: any) => {
                    TeamMemberIds.push(taskInfo.Id);
                })
            }
        }
        if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
            TaskResponsibleTeam?.map((taskInfo) => {
                ResponsibleTeamIds.push(taskInfo.Id);
            })
        } else {
            if (EditData.Responsible_x0020_Team != undefined && EditData.Responsible_x0020_Team?.length > 0) {
                EditData.Responsible_x0020_Team?.map((taskInfo: any) => {
                    ResponsibleTeamIds.push(taskInfo.Id);
                })
            }
        }

        try {
            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
            await web.lists.getById(Items.Items.listId).items.getById(Items.Items.ID).update({
                IsTodaysTask: (EditData.IsTodaysTask ? EditData.IsTodaysTask : null),
                Priority_x0020_Rank: (itemRank != '' ? itemRank : EditData.Priority_x0020_Rank),
                ItemRank: (itemRank != '' ? itemRank : EditData.Priority_x0020_Rank),
                Title: UpdateTaskInfo.Title ? UpdateTaskInfo.Title : EditData.Title,
                Priority: PriorityStatus != undefined ? PriorityStatus : EditData.Priority,
                StartDate: EditData.StartDate ? Moment(EditData.StartDate).format("MM-DD-YYYY") : null,
                PercentComplete: UpdateTaskInfo.PercentCompleteStatus ? (Number(UpdateTaskInfo.PercentCompleteStatus) / 100) : (EditData.PercentComplete ? (EditData.PercentComplete / 100) : null),
                ComponentId: { "results": (smartComponentsIds != undefined && smartComponentsIds?.length > 0) ? smartComponentsIds : [] },
                Categories: CategoriesData ? CategoriesData : null,
                RelevantPortfolioId: { "results": (RelevantPortfolioIds != undefined && RelevantPortfolioIds?.length > 0) ? RelevantPortfolioIds : [] },
                DueDate: EditData.DueDate ? Moment(EditData.DueDate).format("MM-DD-YYYY") : null,
                CompletedDate: EditData.CompletedDate ? Moment(EditData.CompletedDate).format("MM-DD-YYYY") : null,
                Status: taskStatus ? taskStatus : (EditData.Status ? EditData.Status : null),
                // BasicImageInfo: JSON.stringify(UploadImage),
                Mileage: (EditData.Mileage ? EditData.Mileage : ''),
                AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
                Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
                Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] },
                // Body: FeedBackDescription != undefined ? FeedBackDescription : null
                FeedBack: updateFeedbackArray?.length > 0 ? JSON.stringify(updateFeedbackArray) : null,
               
            }).then((res: any) => {
                console.log(res);
                Items.Call();
            })
        } catch (error) {
            console.log("Error:", error.messages)
        }
    }
    const changeStatus = (e: any) => {
        if (e.target.value === 'true') {
            setEditData({ ...EditData, IsTodaysTask: false })
        } else {
            setEditData({ ...EditData, IsTodaysTask: true })
        }
    }

    const getTeamConfigData = React.useCallback((teamConfigData: any) => {
        if (teamConfigData?.AssignedTo?.length > 0) {
            let tempArray: any = [];
            teamConfigData.AssignedTo?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskAssignedTo(tempArray);
        }
        if (teamConfigData?.TeamMemberUsers?.length > 0) {
            let tempArray: any = [];
            teamConfigData.TeamMemberUsers?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskTeamMembers(tempArray);
        }
        if (teamConfigData?.ResponsibleTeam?.length > 0) {
            let tempArray: any = [];
            teamConfigData.ResponsibleTeam?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempArray.push(arrayData.AssingedToUser)
                } else {
                    tempArray.push(arrayData);
                }
            })
            setTaskResponsibleTeam(tempArray);
        }
    }, [])

    const shareThisTaskFunction = (EmailData: any) => {
        var link = "mailTo:"
            + "?cc:"
            + "&subject=" + " [" + Items.Items.siteType + "-Task ] " + EmailData.Title
            + "&body=" + `https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-spfx.aspx?taskId=${EmailData.ID}` + "&" + `Site=${Items.Items.siteType}`;
        window.location.href = link;
    }
    const deleteTaskFunction = async (TaskID: number) => {
        try {
            if (Items.Items.listId != undefined) {
                let web = new Web(Items.Items.siteUrl);
                await web.lists.getById(Items.Items.listId).items.getById(TaskID).delete();
            } else {
                let web = new Web(Items.Items.siteUrl);
                await web.lists.getById(Items.Items.listName).items.getById(TaskID).delete();
            }
            Items.Call();

        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    const CommentSectionCallBack = React.useCallback((EditorData: any) => {
        CommentBoxData = EditorData

        console.log("Editor Data call back HTML ====", EditorData)
    }, [])

    const SubCommentSectionCallBack = React.useCallback((feedBackData: any) => {
        SubCommentBoxData = feedBackData;
        console.log("Feedback Array in Edit Sub comp=====", feedBackData)
    }, [])
    return (
        <>
            <Panel
                headerText={`Update Task Status`}
                isOpen={TaskStatusPopup}
                onDismiss={closeTaskStatusUpdatePopup}
                isBlocking={false}
            >
                <div >
                    <div className="modal-body">

                        <table className="table table-hover" style={{ marginBottom: "0rem !important" }}>
                            <tbody>
                                {StatusArray?.map((item: any, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="form-check">
                                                    <input className="form-check-input"
                                                        type="radio" checked={(PercentCompleteCheck ? EditData.PercentComplete : UpdateTaskInfo.PercentCompleteStatus) == item.value}
                                                        onClick={() => PercentCompleted(item)} />
                                                    <label className="form-check-label mx-2">{item.status}</label>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3" onClick={() => setTaskStatusPopup(false)}>
                            OK
                        </button>
                    </footer>
                </div>
            </Panel>
            <Panel
                headerText={`T${EditData.Id} ${EditData.Title}`}
                type={PanelType.large}
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                isBlocking={false}
            >
                <div >

                    <div className="modal-body ">
                        {console.log("Feedback All  Array=====", FeedBackDescription)}
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <button className="nav-link active" id="BASIC-INFORMATION" data-bs-toggle="tab" data-bs-target="#BASICINFORMATION" type="button" role="tab" aria-controls="BASICINFORMATION" aria-selected="true">
                                BASIC INFORMATION
                            </button>
                            {/* <button className="nav-link" id="TIME-SHEET" data-bs-toggle="tab" data-bs-target="#TIMESHEET" type="button" role="tab" aria-controls="TIMESHEET" aria-selected="false">TIMESHEET</button> */}
                            <button className="nav-link" id="NEW-TIME-SHEET" data-bs-toggle="tab" data-bs-target="#NEWTIMESHEET" type="button" role="tab" aria-controls="NEWTIMESHEET" aria-selected="false">TIMESHEET</button>
                        </ul>
                        <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                            <div className="tab-pane  show active" id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="col-12 ">
                                            <div className="input-group">
                                                <label className="d-flex justify-content-between align-items-center mb-0  full-width">Title
                                                    <span className="form-check">
                                                        <input className="form-check-input" type="checkbox"
                                                            checked={EditData.IsTodaysTask}
                                                            value={EditData.IsTodaysTask}
                                                            onChange={(e) => changeStatus(e)} />
                                                        <label className="form-check-label">Working Today?</label>
                                                    </span>
                                                </label>
                                                <input type="text" className="form-control" placeholder="Task Name"
                                                    ng-required="true" defaultValue={EditData.Title} onChange={(e) => setUpdateTaskInfo({ ...UpdateTaskInfo, Title: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="mx-0 row  ">
                                            <div className="col-6 ps-0 mt-2">
                                                <div className="input-group ">
                                                    <label className="form-label full-width" >Start Date</label>
                                                    <input type="date" className="form-control"
                                                        defaultValue={EditData.StartDate ? Moment(EditData.StartDate).format("YYYY-MM-DD") : ''}
                                                        onChange={(e) => setEditData({
                                                            ...EditData, StartDate: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 pe-0 mt-2">
                                                <div className="input-group ">
                                                    <label className="form-label full-width">Due Date  <span title="Re-occurring Due Date">
                                                        <input type="checkbox" className="form-check-input ms-2"
                                                            ng-model="dueDatePopUp"
                                                            ng-click="OpenDueDatePopup()" />
                                                    </span></label>

                                                    <input type="date" className="form-control"
                                                        defaultValue={EditData.DueDate ? Moment(EditData.DueDate).format("YYYY-MM-DD") : ''}
                                                        onChange={(e) => setEditData({
                                                            ...EditData, DueDate: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 mt-2">
                                                <div className="input-group ">
                                                    <label className="form-label full-width"
                                                    >Completed Date</label>
                                                    <input type="date" className="form-control"
                                                        defaultValue={EditData.CompletedDate ? Moment(EditData.CompletedDate).format("YYYY-MM-DD") : ''}
                                                        onChange={(e) => setEditData({
                                                            ...EditData, CompletedDate: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 pe-0 mt-2">
                                                <div className="input-group">
                                                    <label className="form-label full-width">Item Rank</label>
                                                    <select className="form-select" defaultValue={EditData.Priority_x0020_Rank} onChange={(e) => setItemRank(e.target.value)}>
                                                        {currentUsers.map(function (h: any, i: any) {
                                                            return (
                                                                <option key={i} selected={EditData.Priority_x0020_Rank == h.rank} value={h.rank} >{h.rankTitle}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mx-0 row mt-2">
                                            <div className="col ps-0">
                                                <div className="input-group mb-2">
                                                    <label className="full-width" ng-show="Item.SharewebTaskType.Title!='Project' && Item.SharewebTaskType.Title!='Step' && Item.SharewebTaskType.Title!='MileStone'">
                                                        <span className="form-check form-check-inline mb-0">
                                                            <input type="radio" id="Components"
                                                                name="Portfolios" defaultChecked={true}
                                                                title="Component"
                                                                ng-model="PortfolioTypes"
                                                                ng-click="getPortfoliosData()"
                                                                className="form-check-input" />
                                                            <label className="form-check-label mb-0">Component</label>
                                                        </span>
                                                        <span className="form-check form-check-inline mb-0">
                                                            <input type="radio" id="Services"
                                                                name="Portfolios" value="Services"
                                                                title="Services"
                                                                className="form-check-input" />
                                                            <label className="form-check-label mb-0">Services</label>
                                                        </span>
                                                    </label>
                                                    {smartComponentData?.length > 0 ? null :
                                                        <>
                                                            <input type="text" ng-model="SearchService"
                                                                className="form-control"
                                                                id="{{PortfoliosID}}" autoComplete="off"
                                                            />
                                                        </>
                                                    }
                                                    {smartComponentData ? smartComponentData?.map((com: any) => {
                                                        return (
                                                            <>
                                                                <div className="d-flex Component-container-edit-task" style={{ width: "81%" }}>
                                                                    <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                    <a>
                                                                        <img className="mx-2" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />
                                                                    </a>
                                                                </div>
                                                            </>
                                                        )
                                                    }) : null}

                                                    <span className="input-group-text">
                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                            onClick={(e) => EditComponent(EditData, 'Component')} />
                                                    </span>
                                                </div>
                                                <div className="input-group mb-2">
                                                    <label className="form-label full-width">
                                                        Categories
                                                    </label>
                                                    <input type="text" className="form-control"
                                                        id="txtCategories" />
                                                    <span className="input-group-text">
                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                            onClick={(e) => EditComponentPicker(EditData, 'Categories')} />
                                                    </span>
                                                </div>
                                                <div className="col">
                                                    <div className="col">
                                                        <div
                                                            className="form-check">
                                                            <input className="form-check-input"
                                                                type="checkbox"
                                                            />
                                                            <label className="form-check-label">Phone</label>
                                                        </div>
                                                        <div
                                                            className="form-check">
                                                            <input className="form-check-input"
                                                                type="checkbox"
                                                            />
                                                            <label>Email Notification</label>
                                                            <div className="form-check ms-2">
                                                                <input className="form-check-input"
                                                                    type="radio"
                                                                />
                                                                <label>Only Completed</label>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="form-check">
                                                            <input className="form-check-input" type="checkbox" />
                                                            <label>Immediate</label>
                                                        </div>
                                                        {CategoriesData != "" ?
                                                            <div>
                                                                {(CategoriesData.split(";"))?.map((type: any, index: number) => {
                                                                    return (
                                                                        <div className="Component-container-edit-task d-flex my-1 justify-content-between">
                                                                            <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?${EditData.Id}`}>
                                                                                {type}
                                                                            </a>
                                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setCategoriesData('')} className="p-1" />
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div> : null
                                                        }
                                                    </div>
                                                    <div className="form-check ">
                                                        <label className="full-width">Approval</label>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input" />
                                                    </div>
                                                    <div className="col ps-4">
                                                        <div
                                                            className="form-check">
                                                            <label>Normal Approval</label>
                                                            <input
                                                                type="radio"
                                                                className="form-check-input" />
                                                        </div>
                                                        <div
                                                            className="form-check">
                                                            <label> Complex Approval</label>
                                                            <input
                                                                type="radio"
                                                                className="form-check-input" />
                                                        </div>
                                                        <div
                                                            className="form-check">
                                                            <label> Quick Approval</label>
                                                            <input
                                                                type="radio"
                                                                className="form-check-input" />
                                                        </div>
                                                    </div>
                                                    {/* <div className="col mb-2">
                                                        <div className="input-group">
                                                            {EditData.Approver?.length > 0 ? null :
                                                                <>
                                                                    <input type="text" ng-model="SearchService"
                                                                        className="form-control"
                                                                        id="{{PortfoliosID}}" autoComplete="off"
                                                                    />
                                                                </>
                                                            }
                                                            {smartComponentData ? smartComponentData?.map((com: any) => {
                                                                return (
                                                                    <>
                                                                        <div className="d-flex Component-container-edit-task" style={{ width: "81%" }}>
                                                                            <a style={{ color: "#fff !important" }} target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                            <a>
                                                                                <img className="mx-2" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />
                                                                            </a>
                                                                        </div>
                                                                    </>
                                                                )
                                                            }) : null}

                                                            <span className="input-group-text">
                                                                <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                    onClick={(e) => EditComponent(EditData, 'Component')} />
                                                            </span>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 pe-0 pt-4">
                                                <div>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control"
                                                            placeholder="Priority" defaultValue={PriorityStatus ? PriorityStatus : ''}
                                                        />
                                                    </div>
                                                    <ul className="p-0 mt-1">
                                                        <li className="form-check">
                                                            <input className="form-check-input"
                                                                name="radioPriority" type="radio"
                                                                value="(1) High" checked={PriorityStatus === "(1) High"}
                                                                onChange={(e: any) => setPriority("(1) High")}
                                                            />
                                                            <label className="form-check-label">High</label>
                                                        </li>
                                                        <li className="form-check">
                                                            <input className="form-check-input" name="radioPriority"
                                                                type="radio" value="(2) Normal" onChange={(e) => setPriority("(2) Normal")}
                                                                checked={PriorityStatus === "(2) Normal"}
                                                            />
                                                            <label className="form-check-label">Normal</label>
                                                        </li>
                                                        <li className="form-check">
                                                            <input className="form-check-input" name="radioPriority"
                                                                type="radio" value="(3) Low" onChange={(e) => setPriority("(3) Low")}
                                                                checked={PriorityStatus === "(3) Low"}
                                                            />
                                                            <label className="form-check-label">Low</label>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="col-12 mb-2">
                                                    <div className="input-group ">
                                                        <label className="form-label full-width">Client Activity</label>
                                                        <input type="text" className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 mb-2">
                                                    <div className="input-group">
                                                        <label className="form-label full-width">
                                                            Linked Service
                                                        </label>
                                                        {
                                                            linkedComponentData?.length > 0 ? <div>
                                                                {linkedComponentData?.map((com: any) => {
                                                                    return (
                                                                        <>
                                                                            <div className="d-flex Component-container-edit-task">
                                                                                <div>
                                                                                    <a className="hreflink " target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                        {com.Title}
                                                                                    </a>
                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setLinkedComponentData([])} />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                })}
                                                            </div> :
                                                                <input type="text" readOnly
                                                                    className="form-control"
                                                                />
                                                        }
                                                        <span className="input-group-text">
                                                            <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                onClick={(e) => EditLinkedServices(EditData, 'Component')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* <div className="col-12"
                                                            ng-repeat="item in AllRelevantTasks track by $index">
                                                            <div className="hhProcesscat">
                                                                <a className="hreflink" target="_blank"
                                                                    ng-href="{{pageContext}}/SitePages/Task-Profile.aspx?taskId={{item.Id}}&Site={{item.siteType}}"> item.Title </a>
                                                                <a className="hreflink"
                                                                    ng-click="removeAllRelevantTasks(item.Id)">
                                                                    <img ng-src="/_layouts/images/delete.gif" />
                                                                </a>
                                                            </div>
                                                        </div> */}
                                                <div className="col-12" title="Relevant Portfolio Items">
                                                    <div className="input-group">
                                                        <label className="form-label full-width "> Linked Component Task </label>
                                                        <input type="text"
                                                            className="form-control "
                                                            id="{{RelevantPortfolioName==='Linked Service'?'txtRelevantServiceShareWebComponent':'txtRelevantShareWebComponent'}}"
                                                            autoComplete="off" />
                                                        <span className="input-group-text">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12" title="Connect Service Tasks">
                                                    <div className="col-sm-11 pad0 taskprofilepagegreen text-right">
                                                    </div>
                                                    <div className="row taskprofilepagegreen">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-12 mb-2">
                                            <div className="input-group">
                                                <label className="form-label full-width ">Relevant URL</label>
                                                <input type="text" className="form-control" placeholder="Url"
                                                />
                                                <span className="input-group-text">
                                                    <a target="_blank" data-interception="off"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3677 13.2672C11.023 13.7134 9.87201 14.4471 8.99831 15.4154C6.25928 18.4508 6.34631 23.1488 9.19578 26.0801C10.6475 27.5735 12.4385 28.3466 14.4466 28.3466H15.4749V27.2499V26.1532H14.8471C12.6381 26.1532 10.4448 24.914 9.60203 23.1898C8.93003 21.8151 8.9251 19.6793 9.5906 18.3208C10.4149 16.6384 11.9076 15.488 13.646 15.1955C14.7953 15.0022 22.5955 14.9933 23.7189 15.184C26.5649 15.6671 28.5593 18.3872 28.258 21.3748C27.9869 24.0644 26.0094 25.839 22.9861 26.1059L21.9635 26.1961V27.2913V28.3866L23.2682 28.3075C27.0127 28.0805 29.7128 25.512 30.295 21.6234C30.8413 17.9725 28.3779 14.1694 24.8492 13.2166C24.1713 13.0335 23.0284 12.9942 18.5838 13.0006C13.785 13.0075 13.0561 13.0388 12.3677 13.2672ZM23.3224 19.8049C18.7512 20.9519 16.3624 26.253 18.4395 30.6405C19.3933 32.6554 20.9948 34.0425 23.1625 34.7311C23.9208 34.9721 24.5664 35 29.3689 35C34.1715 35 34.8171 34.9721 35.5754 34.7311C38.1439 33.9151 39.9013 32.1306 40.6772 29.5502C41 28.4774 41.035 28.1574 40.977 26.806C40.9152 25.3658 40.8763 25.203 40.3137 24.0261C39.0067 21.2919 36.834 19.8097 33.8475 19.6151L32.5427 19.53V20.6267V21.7236L33.5653 21.8132C35.9159 22.0195 37.6393 23.0705 38.4041 24.7641C39.8789 28.0293 38.2035 31.7542 34.8532 32.6588C33.8456 32.9309 25.4951 32.9788 24.1462 32.7205C22.4243 32.3904 21.0539 31.276 20.2416 29.5453C19.8211 28.6492 19.7822 28.448 19.783 27.1768C19.7837 26.0703 19.8454 25.6485 20.0853 25.1039C20.4635 24.2463 21.3756 23.2103 22.1868 22.7175C22.8985 22.2851 24.7121 21.7664 25.5124 21.7664H26.0541V20.6697V19.573L25.102 19.5851C24.5782 19.5919 23.7775 19.6909 23.3224 19.8049Z" fill="#333333" />
                                                        </svg>
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="">
                                            <div className="">
                                                <div className="panel panel-primary-head blocks"
                                                    id="t_draggable1">
                                                    <div className="panel-heading profileboxclr"
                                                    >
                                                        <h3 className="panel-title" style={{ textAlign: "inherit" }}>
                                                            <span className="lbltitleclr">Site
                                                                Composition</span>
                                                            <span className="pull-left">
                                                                <span
                                                                    style={{ backgroundColor: "#f5f5f5" }}
                                                                    onClick={() => ExpandSiteComposition()}>
                                                                    <img style={{ width: "10px" }}
                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />
                                                                </span>
                                                            </span>
                                                        </h3>
                                                    </div>
                                                    {/* {composition === true ?
                                                                            <div className='spxdropdown-menu'>
                                                    
                                                                            <ul>
                                                                                {  myarray1.map((item: any) =>
                    
                                                                                    <li className="dropdown-item">
                                                                                        <span>
                                                                                            <img style={{ width: "22px" }} src={item.SiteImages} data-themekey="#" />
                                                                                        </span>
                                                                                        <span >
                                                                                           
                                                                                            {(item.ClienTimeDescription != undefined) &&
                                                                                                <span className="ng-binding">
                                                                                                 
                    
                                                                                                    {parseInt(item.ClienTimeDescription)}%
                    
                                                                                                </span>
                                                                                            }
                                                                                        </span>
                                                                                        {item.Title == 'EPS' &&
                                                                                            <span>
                                                                                                {myarray2.length != 0 ? myarray2.map((client: any) => {
                                                                                                    return (
                                                                                                        <div className="Members-Item">
                    
                                                                                                            <div ng-show="client.siteName=='EPS'" className="user-Member-img"   ng-repeat="client in Task.ClientCategory.results">
                                                                                                                {(client.Title == "Kontakt Verwaltung" || client.Title == " Steuerungsbericht der Direktion" || client.Title == "Shareweb Maintenance" || client.Title == "Newsletter Einbindung" || client.Title == "PSE-Partnerschaften") &&
                                                                                                                    <span>
                    
                                                                                                                        {client.Title}
                    
                                                                                                                    </span>
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                }) : ""}
                                                                                            </span>
                                                                                        }
                                                                                        {item.Title == 'Education' &&
                                                                                            <span>
                                                                                                {myarray2.length != 0 ? myarray2.map((client: any) => {
                                                                                                    return (
                                                                                                        <div className="Members-Item">
                    
                                                                                                            <div className="user-Member-img" ng-repeat="client in Task.ClientCategory.results">
                                                                                                                {(client.Title == "Contact Management") &&
                                                                                                                    <span>
                    
                                                                                                                        {client.Title}
                    
                                                                                                                    </span>
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                }) : ""}
                                                                                            </span>
                                                                                        }
                                                                                        {item.Title == 'EI' &&
                                                                                            <span  ng-show="item.Title=='EI'" >
                                                                                                {myarray2.length != 0 ? myarray2.map((client: any) => {
                                                                                                    return (
                                                                                                        <div className="Members-Item">
                                                                                                            <div ng-show="client.siteName=='EI'" className="user-Member-img"
                                                                                                                ng-repeat="client in Task.ClientCategory.results">
                                                                                                                {(client.Title == "Nutzer Verwaltung" || client.Title == "Shareweb Maintenance" || client.Title == "EI fachspezifische Aufgaben" || client.Title == "EI Projekt-Übersicht" || client.Title == "Mithilfe Zugriffsrechte-Konzepts") &&
                                                                                                                    <span>
                    
                                                                                                                        {client.Title}
                                                                                                                    </span>
                                                                                                                }
                                                                                                            </div>
                    
                                                                                                        </div>
                                                                                                    )
                                                                                                }) : ""}
                                                                                            </span>
                                                                                        }
                                                                                    </li>
                                                                                ) }
                                                                            </ul>
                                                                            </div>
                                                                            : ""}  */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="input-group">
                                                <label className="form-label full-width">Status</label>
                                                <input type="text" placeholder="% Complete" className="form-control px-2"
                                                    defaultValue={PercentCompleteCheck ? (EditData.PercentComplete != undefined ? EditData.PercentComplete : null) : (UpdateTaskInfo.PercentCompleteStatus ? UpdateTaskInfo.PercentCompleteStatus : null)}
                                                    onChange={(e) => setEditData({ ...EditData, PercentComplete: e.target.value })} />
                                                <span className="input-group-text" onClick={() => openTaskStatusUpdatePopup(EditData)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 48 48" fill="none">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                                    </svg>
                                                </span>
                                                {/* {(EditData.PercentComplete?.Title)?.length > 0 ? <span style={
                                                            { width: '210px', color: "#fff", background: '#000066', padding: '5px' }
                                                        }> {EditData.PercentComplete ? EditData.PercentComplete.Title : ''}</span> : null} */}
                                                {EditData.PercentComplete != null ?
                                                    <span className="full-width">
                                                        <input type='radio' className="my-2" checked />
                                                        <label className="ps-2">
                                                            {PercentCompleteStatus}
                                                        </label>
                                                    </span> : null}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col mt-2 time-status">
                                                <div>
                                                    <div className="input-group">
                                                        <label className="form-label full-width ">Time</label>
                                                        <input type="text" className="form-control" placeholder="Time"
                                                            defaultValue={EditData.Mileage != null ? EditData.Mileage : ""} />
                                                    </div>
                                                    <ul className="p-0 mt-1">
                                                        <li className="form-check">
                                                            <input name="radioTime" className="form-check-input"
                                                                checked={EditData.Mileage === '15'} type="radio"
                                                                onChange={(e) => setEditData({ ...EditData, Mileage: '15' })}
                                                                defaultChecked={EditData.Mileage == "15" ? true : false}
                                                            />
                                                            <label className="form-check-label">Very Quick</label>
                                                        </li>
                                                        <li className="form-check">
                                                            <input name="radioTime" className="form-check-input"
                                                                checked={EditData.Mileage === '60'} type="radio"
                                                                onChange={(e) => setEditData({ ...EditData, Mileage: '60' })}
                                                                defaultChecked={EditData.Mileage == "60"}
                                                            />
                                                            <label className="form-check-label">Quick</label>
                                                        </li>
                                                        <li className="form-check">
                                                            <input name="radioTime" className="form-check-input"
                                                                checked={EditData.Mileage === '240'} type="radio"
                                                                onChange={(e) => setEditData({ ...EditData, Mileage: '240' })}
                                                                defaultChecked={EditData.Mileage == "240"}
                                                            />
                                                            <label className="form-check-label">Medium</label>
                                                        </li>
                                                        <li className="form-check">
                                                            <input name="radioTime" className="form-check-input"
                                                                checked={EditData.Mileage === '480'} type="radio"
                                                                onChange={(e) => setEditData({ ...EditData, Mileage: '480' })}
                                                                defaultChecked={EditData.Mileage == "480"}
                                                            />
                                                            <label className="form-check-label">Long</label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col mt-2">
                                                <div className="input-group">
                                                    <label className="form-label full-width  mx-2">Task Users</label>
                                                    {EditData.TaskAssignedUsers?.map((userDtl: any, index: any) => {
                                                        return (
                                                            <div className="TaskUsers" key={index}>
                                                                <a
                                                                    target="_blank"
                                                                    data-interception="off"
                                                                    href={userDtl.Item_x0020_Cover ? userDtl.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"} >
                                                                    <img ui-draggable="true" data-bs-toggle="tooltip" data-bs-placement="bottom" title={userDtl.Title ? userDtl.Title : ''}
                                                                        on-drop-success="dropSuccessHandler($event, $index, AssignedToUsers)"
                                                                        data-toggle="popover" data-trigger="hover" style={{ width: "35px", height: "35px", marginLeft: "10px", borderRadius: "50px" }}
                                                                        src={userDtl.Item_x0020_Cover ? userDtl.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"}
                                                                    />
                                                                </a>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="full_width ">
                                            <CommentCard siteUrl={Items.Items.siteUrl} userDisplayName={Items.Items.userDisplayName} listName={Items.Items.siteType} itemID={Items.Items.Id} />
                                        </div>
                                        <div className="pull-right">
                                        </div>
                                    </div>
                                </div>
                                <div className="row py-3">
                                    {/* {ImageSection.map(function (Image: any) {
                                        return (
                                            <div>
                                                <div className="col-sm-12  mt-5">
                                                    <span className="">
                                                        {Image.ImageName}
                                                        <a title="Delete" data-toggle="modal"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                            </svg>
                                                        </a>
                                                    </span>
                                                    <div className="img">
                                                        <a className="sit-preview hreflink preview" target="_blank"
                                                            rel="{{BasicImageUrl.Url}}" href="{{BasicImageUrl.Url}}">
                                                            <img id="sit-sharewebImagePopup-demo"
                                                                data-toggle="popover" data-trigger="hover"
                                                                data-content="{{attachedFile.FileLeafRef}}"
                                                            />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    } */}
                                    <div
                                        className={IsShowFullViewImage != true ? 'col-sm-3 padL-0 DashboardTaskPopup-Editor above' : 'col-sm-6  padL-0 DashboardTaskPopup-Editor above'}>
                                        <div className="image-upload">
                                            <ImageUploading
                                                multiple
                                                value={TaskImages}
                                                onChange={uploadImageFunction}
                                                maxNumber={maxNumber}
                                            >
                                                {({
                                                    imageList = TaskImages,
                                                    onImageUpload,
                                                    onImageRemoveAll,
                                                    onImageUpdate,
                                                    onImageRemove,
                                                    isDragging,
                                                    dragProps
                                                }: any) => (
                                                    <div className="upload__image-wrapper">
                                                        {imageList ?
                                                            <div>{imageList?.map((ImageDtl: any, index: any) => {
                                                                return (
                                                                    <div>
                                                                        <div className="my-1" style={{ width: "18rem" }}>
                                                                            <img src={ImageDtl.ImageUrl ? ImageDtl.ImageUrl : ''} className="card-img-top" />
                                                                            <div className="card-footer d-flex justify-content-between p-1 px-2">
                                                                                <div>
                                                                                    <input type="checkbox" />
                                                                                    <span className="mx-1">{ImageDtl.ImageName ? ImageDtl.ImageName.slice(0, 6) : ''}</span>
                                                                                    <span className="fw-semibold">{ImageDtl.UploadeDate ? ImageDtl.UploadeDate : ''}</span>
                                                                                    <span className="mx-1">
                                                                                        <img style={{ width: "25px" }} src={ImageDtl.UserImage ? ImageDtl.UserImage : ''} />
                                                                                    </span>
                                                                                </div>
                                                                                <div>
                                                                                    <span><AiOutlineFullscreen /></span>
                                                                                    <span className="mx-1" onClick={() => onImageUpdate(index)}>| <TbReplace /> |</span>
                                                                                    <span><RiDeleteBin6Line onClick={() => onImageRemove(index)} /></span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                            </div>
                                                            : null}
                                                        <div className="d-flex justify-content-between">
                                                            <a
                                                                style={isDragging ? { color: "red" } : { color: "darkblue" }}
                                                                onClick={onImageUpload}
                                                                {...dragProps}
                                                            >
                                                                Upload Image
                                                            </a>
                                                            &nbsp;
                                                            <a className="hreflink" onClick={onImageRemoveAll}> Remove all images</a>
                                                        </div>
                                                        {/* <span className="taskimage border mb-3">
                                                            {imageList.map((image: any, index: any) => (
                                                                <div key={index} className="image-item">
                                                                    <img src={image.dataURL} alt="" width="100%" className="ImageBox" />
                                                                    <div className="Footerimg d-flex align-items-center bg-fxdark  p-1 ">
                                                                        <a onClick={() => onImageUpdate(index)}><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.18178 9.10429C6.0131 9.21501 5.97742 11.8728 6.01191 21.808L6.05556 34.3718L17.2248 34.4167L28.3941 34.4615V33.629V32.7963L25.3363 29.6562C23.6546 27.9291 22.2786 26.435 22.2786 26.3356C22.2786 26.1056 24.8625 23.4561 25.0871 23.4561C25.1794 23.4561 26.6292 24.8708 28.3091 26.5998L31.3633 29.7435H32.1721H32.9807V28.9999C32.9807 28.2629 32.946 28.2206 29.1147 24.2843C26.9884 22.0998 25.1739 20.3124 25.0825 20.3124C24.9911 20.3124 23.9403 21.3137 22.7474 22.5373L20.5787 24.7622L16.0787 20.1383L11.5787 15.5143L10.0031 17.1274C9.13641 18.0148 8.36994 18.7406 8.29978 18.7406C8.22962 18.7406 8.19276 17.1097 8.21807 15.1166L8.26393 11.4926L21.7265 11.4479L35.1891 11.4032V18.3029V25.2026H36.2949H37.4008L37.3567 17.1251L37.3125 9.04753L21.8539 9.00596C13.3517 8.98325 6.29916 9.02744 6.18178 9.10429ZM31.1121 14.0251C30.9252 14.2172 30.7723 14.5708 30.7723 14.811C30.7723 15.3389 31.3217 15.9462 31.7992 15.9462C32.2112 15.9462 32.9807 15.2067 32.9807 14.811C32.9807 14.4152 32.2112 13.6758 31.7992 13.6758C31.6081 13.6758 31.2989 13.8329 31.1121 14.0251ZM24.487 32.0585C24.487 32.1319 20.8367 32.1717 16.3754 32.1467L8.26393 32.1013L8.21875 27.2169L8.17356 22.3326L9.91545 20.5355L11.6575 18.7383L18.0723 25.3317C21.6003 28.958 24.487 31.985 24.487 32.0585ZM35.3024 27.5896C35.24 27.6535 35.1891 28.7145 35.1891 29.9474V32.1887H32.9807H30.7723V33.3239V34.4591H32.9807H35.1891V36.7295V39H36.2932H37.3974V36.7346V34.4692L39.6483 34.4205L41.8991 34.3718L41.9496 33.2853L42 32.199L39.7412 32.1501L37.4824 32.1013L37.435 29.7872L37.3876 27.4731H36.4016C35.8592 27.4731 35.3645 27.5255 35.3024 27.5896Z" fill="#333333" />
                                                                        </svg></a>
                                                                        <a style={{ margin: "3px" }} onClick={() => onImageRemove(index)}><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                                        </svg></a>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </span> */}
                                                    </div>
                                                )}
                                            </ImageUploading>
                                        </div>
                                    </div>
                                    <div className={IsShowFullViewImage != true ? 'col-sm-9 toggle-task' : 'col-sm-6 editsectionscroll toggle-task'}>
                                        {EditData.Id ? <>
                                            <CommentBoxComponent data={EditData.FeedBackArray} callBack={CommentSectionCallBack} />
                                            <Example textItems={EditData.FeedBackArray} callBack={SubCommentSectionCallBack} />
                                        </>
                                            : null}
                                    </div>
                                    {/* <div className="form-group">
                                                    <div className="col-sm-6">
                                                        <div ng-if="attachments.length > 0"
                                                            ng-repeat="attachedFiles in attachments">
                                                            <div ng-show="ImageName != attachedFiles.FileName">
                                                                <div
                                                                    ng-if="attachedFiles.FileName.toLowerCase().indexOf('.txt'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.docx'.toLowerCase())> -1  || attachedFiles.FileName.toLowerCase().indexOf('.pdf'.toLowerCase())> -1  || attachedFiles.FileName.toLowerCase().indexOf('.doc'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.msg'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.pptx'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.xls'.toLowerCase())> -1 || attachedFiles.FileName.toLowerCase().indexOf('.xlsx'.toLowerCase())> -1">
                                                                    <a
                                                                        ng-href="{{CurrentSiteUrl}}/Lists/{{Item.siteType}}/Attachments/{{attachedItemId}}/{{attachedFiles.FileName}}?web=1">attachedFiles.FileName </a>
                                                                    <a style={{ cursor: "pointer" }} title="Delete" data-toggle="modal"
                                                                        ng-click="deleteFile(attachedFiles)">
                                                                        <img ng-src="/_layouts/images/delete.gif" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </div> */}
                                    {/* </div>
                                     </div> */}
                                </div>
                            </div>
                            {/* <div className="tab-pane " id="TIMESHEET" role="tabpanel" aria-labelledby="TIMESHEET">
                                <div>
                                    <TeamComposition props={Items} />
                                </div>
                            </div> */}
                            <div className="tab-pane " id="NEWTIMESHEET" role="tabpanel" aria-labelledby="NEWTIMESHEET">
                                <div>
                                    <NewTameSheetComponent props={Items}
                                        TeamConfigDataCallBack={getTeamConfigData}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* </>
                                    )
                                })} */}
                    </div>
                    <footer>
                        <div className="d-flex justify-content-between py-2">
                            <div>
                                <div className="">
                                    Created <span> <b> {EditData.Created ? Moment(EditData.Created).format("DD/MM/YYYY") : ""} </b> </span> by <span className="siteColor mx-1">
                                        <b>
                                            {EditData.Author?.Title ? EditData.Author?.Title : ''}
                                        </b>
                                    </span>
                                </div>
                                <div>
                                    Last modified <span> <b> {EditData.Modified ? Moment(EditData.Modified).format("DD/MM/YYYY") : ''} </b> </span>
                                    by
                                    <span className="siteColor">
                                        <b> {EditData.Editor?.Title ? EditData.Editor.Title : ''} </b>
                                    </span>
                                </div>
                                <div>
                                    <a className="hreflink">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                        </svg>
                                        <span onClick={() => deleteTaskFunction(EditData.ID)}>Delete this item</span>
                                    </a>
                                    <span> |</span>
                                    <a className="hreflink">
                                        Copy
                                        Task
                                    </a>
                                    <span > | </span>
                                    <a className="hreflink"> Move Task</a> |
                                    <span>
                                        <img className="hreflink" title="Version History"
                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Version_HG.png"
                                        />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <span>
                                        <a className="mx-2" target="_blank" data-interception="off"
                                            href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=${EditData.ID}&Site=${Items.Items.siteType}`}>
                                            Go to profile page
                                        </a>
                                    </span> ||
                                    <span>
                                        <a className="mx-2" >
                                            Save & Add Timesheet
                                        </a>
                                    </span> ||

                                    <span className="hreflink" onClick={() => shareThisTaskFunction(EditData)} >
                                        <img className="mail-width mx-2"
                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_maill.png" />
                                        Share this task
                                    </span> ||
                                    <a target="_blank" className="mx-2" data-interception="off"
                                        href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/HHHH/EditForm.aspx?ID=${EditData.ID}`}>
                                        Open out-of-the-box form
                                    </a>
                                    <span >
                                        <button className="btn btn-primary"
                                            onClick={UpdateTaskInfoFunction}>
                                            Save
                                        </button>
                                        <button type="button" className="btn btn-default mx-1" onClick={Items.Call}>
                                            Close
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </footer>
                    {IsComponent && <ComponentPortPolioPopup props={ShareWebComponent} Call={Call}>
                    </ComponentPortPolioPopup>}
                    {IsComponentPicker && <Picker props={ShareWebComponent} Call={Call}></Picker>}
                    {IsServices && <LinkedComponent props={ShareWebComponent} Call={Call}></LinkedComponent>}
                </div>
            </Panel>
        </>
    )
}
export default React.memo(EditTaskPopup);


// How to use this component and require parameters

// step-1 : import this component where you need to use
// step-2 : call this component and pass some parameters follow step:2A and step:2B

// step-2A :
// var Items = {
//     siteUrl:{Enter Site url here},
//     siteType: {Enter Site type here},
//     listId:{Enter Site listId here},
//     ***** OR *****
//     listName:{Enter Site listName here},
// }

// step-2B :
// <EditTaskPopup Items={Items} ></EditTaskPopup>