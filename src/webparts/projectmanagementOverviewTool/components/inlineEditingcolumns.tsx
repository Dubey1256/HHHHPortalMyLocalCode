import { Panel } from 'office-ui-fabric-react'
import { Web } from "sp-pnp-js";
import React from 'react'
import * as Moment from 'moment';
import * as globalCommon from "../../../globalComponents/globalCommon";
var ChangeTaskUserStatus: any = true;
let ApprovalStatusGlobal: any = false;
let taskUsers: any = [];
var AssignedToIds: any = [];
var ResponsibleTeamIds: any = [];
var TeamMemberIds: any = [];
var ApproverIds: any = [];
let AllMetadata: any = [];
let TaskCreatorApproverBackupArray: any = [];
let TaskApproverBackupArray: any = [];
const inlineEditingcolumns = (props: any) => {
    const [TaskStatusPopup, setTaskStatusPopup] = React.useState(false);
    const [TaskPriorityPopup, setTaskPriorityPopup] = React.useState(false);
    const [PercentCompleteStatus, setPercentCompleteStatus] = React.useState('');
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const [ApprovalStatus, setApprovalStatus] = React.useState(false);
    const [ApproverData, setApproverData] = React.useState([]);
    const [InputFieldDisable, setInputFieldDisable] = React.useState(false);
    const [priorityRank, setpriorityRank] = React.useState([])
    const [UpdateTaskInfo, setUpdateTaskInfo] = React.useState(
        {
            Title: '', PercentCompleteStatus: '', ComponentLink: ''
        }
    )
    const [impTaskCategoryType, setImpTaskCategoryType] = React.useState([]);
    const [taskCategoryType, setTaskCategoryType] = React.useState([])
    const [taskStatus, setTaskStatus] = React.useState('');
    const [taskPriority, setTaskPriority] = React.useState('');
    const [ServicesTaskCheck, setServicesTaskCheck] = React.useState(false);
    const [PercentCompleteCheck, setPercentCompleteCheck] = React.useState(true)
    const [selectedCatId, setSelectedCatId]: any[] = React.useState([]);
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

    React.useEffect(() => {
        if (props?.item?.Services?.length > 0) {
            setServicesTaskCheck(true)
        } else {
            setServicesTaskCheck(false)
        }

        let selectedCategoryId: any = [];
        props?.item?.SharewebCategories?.map((category: any) => {
            selectedCategoryId.push(category.Id);
        })
        setSelectedCatId(selectedCategoryId);
        setTaskPriority(props?.item?.Priority_x0020_Rank);
        loadTaskUsers();
        GetSmartMetadata();
    }, [])
    const getPercentCompleteTitle = (percent: any) => {
        let result = '';
        StatusArray?.map((status: any) => {
            if (status?.value == percent) {
                result = status?.status;
            }
        })
        if (result.length <= 0) {
            result = percent + "% Completed"
        }
        return result
    }
    const GetSmartMetadata = async () => {
        var TaskTypes: any = []
        var Priority: any = []
        var Timing: any = []
        var Task: any = []
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let MetaData = [];
        MetaData = await web.lists
            .getByTitle('SmartMetadata')
            .items
            .select("Id,Title,listId,siteUrl,siteName,spfxIconName,Item_x005F_x0020_Cover,ProfileType,ParentID,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title")
            .top(4999)
            .expand('Author,Editor')
            .get();
        AllMetadata = MetaData;
        let impSharewebCategories: any = [];
        let SharewebtaskCategories: any = []
        AllMetadata?.map((metadata: any) => {
            if (metadata.TaxType == 'Categories' && metadata.ParentID == 145 && metadata.ProfileType == "Feature Type1") {
                impSharewebCategories.push(metadata);
            }
            if (metadata.Title == 'Immediate') {
                impSharewebCategories.push(metadata);
            }
            if (metadata.TaxType == 'Categories' ) {
                SharewebtaskCategories.push(metadata);
            }

        })
        setTaskCategoryType(SharewebtaskCategories);
        setImpTaskCategoryType(impSharewebCategories);
        Priority = getSmartMetadataItemsByTaxType(AllMetadata, 'Priority Rank');
        setpriorityRank(Priority)


    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems?.map((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });

        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }
    const loadTaskUsers = async () => {
        taskUsers = await globalCommon.loadTaskUsers()
    }
    const openTaskStatusUpdatePopup = async () => {

        let statusValue: any
        let AssignedUsers: any = [];
        let TeamMemberTemp: any = [];
        if (props?.item?.Approver?.length > 0) {
            TaskApproverBackupArray = props?.item?.Approver;
        }

        if (props?.item?.Author != undefined && props?.item?.Author != null) {
            taskUsers?.map((userData: any) => {
                if (props?.item?.Author.Id == userData?.AssingedToUserId) {
                    userData.Approver?.map((AData: any) => {
                        // ApproverDataTemp.push(AData);
                        TaskCreatorApproverBackupArray.push(AData);
                    })
                }
            })
            if ((statusValue <= 2) && ApprovalStatusGlobal) {
                if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
                    taskUsers?.map((userData1: any) => {
                        TaskApproverBackupArray.map((itemData: any) => {
                            if (itemData.Id == userData1?.AssingedToUserId) {
                                AssignedUsers.push(userData1);
                                TeamMemberTemp.push(userData1);
                            }
                        })
                    })
                } else {
                    if (TaskCreatorApproverBackupArray?.length > 0) {
                        taskUsers?.map((userData1: any) => {
                            TaskCreatorApproverBackupArray?.map((itemData: any) => {
                                if (itemData.Id == userData1?.AssingedToUserId) {
                                    AssignedUsers.push(userData1);
                                    TeamMemberTemp.push(userData1);
                                }
                            })
                        })
                    }
                }
            } else {
                taskUsers?.map((userData: any) => {
                    props?.item?.AssignedTo?.map((AssignedUser: any) => {
                        if (userData?.AssingedToUserId == AssignedUser.Id) {
                            AssignedUsers.push(userData);
                        }
                    })
                })
            }
        }
        if (props?.item.PercentComplete != undefined) {
            statusValue = props?.item.PercentComplete;
            props.item.PercentComplete = statusValue;
            if (statusValue < 70 && statusValue > 20) {
                setTaskStatus("In Progress");
                setPercentCompleteStatus(`${statusValue}% In Progress`);
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: `${statusValue}` })
            } else {
                StatusArray?.map((item: any) => {
                    if (statusValue == item.value) {
                        setPercentCompleteStatus(item.status);
                        setTaskStatus(item.taskStatusComment);
                    }
                })
            }

            if (statusValue == 0) {
                setTaskStatus('Not Started');
                setPercentCompleteStatus('Not Started');
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: '0' })
            }

            if (statusValue <= 3 && ApprovalStatusGlobal) {
                ChangeTaskUserStatus = false;
            } else {
                ChangeTaskUserStatus = true;
            }
        }
        setTaskStatusPopup(true);
    }
    const UpdateTaskStatus = async () => {
        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: (props?.item?.PercentComplete ? props?.item?.PercentComplete : null) })
        if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
            TaskAssignedTo?.map((taskInfo) => {
                AssignedToIds.push(taskInfo.Id);
            })
        }

        if (ApproverData != undefined && ApproverData?.length > 0) {
            ApproverData?.map((ApproverInfo) => {
                ApproverIds.push(ApproverInfo.Id);
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
        StatusArray?.map((array: any) => {
            if (props?.item?.PercentComplete == array.value) {
                setPercentCompleteStatus(array.status);
                setTaskStatus(array.taskStatusComment);
            }
        })
        let priority: any;
        let priorityRank = 4;
        if (taskPriority === undefined || parseInt(taskPriority) <= 0) {
            priorityRank = 4;
            priority = '(2) Normal';
        }
        else {
            priorityRank = parseInt(taskPriority);
            if (priorityRank >= 8 && priorityRank <= 10) {
                priority = '(1) High';
            }
            if (priorityRank >= 4 && priorityRank <= 7) {
                priority = '(2) Normal';
            }
            if (priorityRank >= 1 && priorityRank <= 3) {
                priority = '(3) Low';
            }
        }
        let CategoryTitle: any;
        selectedCatId?.map((category: any) => {
            taskCategoryType?.map((item: any) => {
                if (category === item.Id) {
                    if (CategoryTitle === undefined) {
                        CategoryTitle = item.Title + ';';
                    } else {
                        CategoryTitle += item.Title + ';';
                    }
                }
            })

        })

        setPercentCompleteCheck(false);
        let web = new Web(props?.item?.siteUrl);
        await web.lists.getById(props?.item?.listId).items.getById(props?.item?.Id).update({
            PercentComplete: UpdateTaskInfo.PercentCompleteStatus ? (Number(UpdateTaskInfo.PercentCompleteStatus) / 100) : (props?.item?.PercentComplete ? (props?.item?.PercentComplete / 100) : null),
            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds.length > 0) ? AssignedToIds : [] },
            Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds.length > 0) ? ResponsibleTeamIds : [] },
            Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds.length > 0) ? TeamMemberIds : [] },
            ApproverId: { "results": (ApproverIds != undefined && ApproverIds.length > 0) ? ApproverIds : [] },
            "Priority": priority,
            "Categories": CategoryTitle,
            "Priority_x0020_Rank": priorityRank,
            SharewebCategoriesId: { "results": selectedCatId },
        })
            .then((res: any) => {
                console.log(res);
                props?.callBack();
                setTaskStatusPopup(false);
                setTaskPriorityPopup(false);
            })

    }
    const setWorkingMember = (statusId: any) => {
        taskUsers?.map((dataTask: any) => {
            if (dataTask.AssingedToUserId == statusId) {
                let tempArray: any = [];
                tempArray.push(dataTask)
                props.item.TaskAssignedUsers = tempArray;
                let updateUserArray: any = [];
                updateUserArray.push(tempArray[0].AssingedToUser)
                setTaskAssignedTo(updateUserArray);
            }
        })
    }
    const setWorkingMemberFromTeam = (filterArray: any, filterType: any, StatusID: any) => {
        let tempArray: any = [];
        filterArray.map((TeamItems: any) => {
            taskUsers?.map((TaskUserData: any) => {
                if (TeamItems.Id == TaskUserData.AssingedToUserId) {
                    if (TaskUserData.TimeCategory == filterType) {
                        tempArray.push(TaskUserData)
                        props.item.TaskAssignedUsers = tempArray;
                        let updateUserArray1: any = [];
                        updateUserArray1.push(tempArray[0].AssingedToUser)
                        setTaskAssignedTo(updateUserArray1);
                    }
                    else {
                        if (tempArray?.length == 0) {
                            setWorkingMember(143);
                        }
                    }
                }
            })
        })
    }
    const isItemExistID = (item: any, array: any) => {
        let result = false;
        array?.map((arrayItem: any) => {
            if (arrayItem?.Id == item.Id || arrayItem?.ID == item.Id || arrayItem?.Id == item.ID || arrayItem?.ID == item.ID) {
                result = true;
            }
        })
        return result;
    }
    const isItemExistTitle = (item: any, array: any) => {
        let result = false;
        array?.map((arrayItem: any) => {
            if (arrayItem?.Title == item) {
                result = true;
            }
        })
        return result;
    }
    const PercentCompleted = (StatusData: any) => {

        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusData.value })
        setPercentCompleteStatus(StatusData.status);
        setTaskStatus(StatusData.taskStatusComment);
        setPercentCompleteCheck(false);
        if (StatusData.value == 1) {
            let tempArray: any = [];
            if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
                TaskApproverBackupArray.map((dataItem: any) => {
                    tempArray.push(dataItem);
                })
            } else if (TaskCreatorApproverBackupArray != undefined && TaskCreatorApproverBackupArray.length > 0) {
                TaskCreatorApproverBackupArray.map((dataItem: any) => {
                    tempArray.push(dataItem);
                })
            }
            setTaskAssignedTo(tempArray);
            setTaskTeamMembers(tempArray);
            setApproverData(tempArray);
        }
        if (StatusData.value == 2) {
            setInputFieldDisable(true)
        }
        if (StatusData.value != 2) {
            setInputFieldDisable(false)
        }

        if (StatusData.value == 80) {
            // let tempArray: any = [];
            if (props?.item?.Team_x0020_Members != undefined && props?.item?.Team_x0020_Members?.length > 0) {
                setWorkingMemberFromTeam(props?.item?.Team_x0020_Members, "QA", 143);
            } else {
                setWorkingMember(143);
            }
            props.item.IsTodaysTask = false;
            props.item.CompletedDate = undefined;
        }

        if (StatusData.value == 5) {
            // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
            // } else if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.Team_x0020_Members, "Development", 156);

            // } else {
            //     setWorkingMember(156);
            // }
            props.item.CompletedDate = undefined;
            props.item.IsTodaysTask = false;
        }
        if (StatusData.value == 10) {
            props.item.CompletedDate = undefined;
            if (props?.item?.StartDate == undefined) {
                props.item.StartDate = Moment(new Date()).format("MM-DD-YYYY")
            }
            props.item.IsTodaysTask = true;
            // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
            // } else {
            //     setWorkingMember(156);
            // }
        }
        // if (StatusData.value == 70) {
        // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
        //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
        // } else if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
        //     setWorkingMemberFromTeam(EditData.Team_x0020_Members, "Development", 156);
        // } else {
        //     setWorkingMember(156);
        // }
        // }

        if (StatusData.value == 93 || StatusData.value == 96 || StatusData.value == 99) {
            setWorkingMember(9);
            StatusArray?.map((item: any) => {
                if (StatusData.value == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }
        if (StatusData.value == 90) {
            let DesignStatus = false;
            if (props?.item?.SharewebCategories?.length > 0) {
                DesignStatus = isItemExistTitle('Design', props?.item?.SharewebCategories?.length)
            }
            if (props?.item?.siteType == 'Offshore Tasks') {
                setWorkingMember(36);
            }
            else if (DesignStatus) {
                setWorkingMember(172);
            }
            else {
                setWorkingMember(42);
            }
            props.item.CompletedDate = Moment(new Date()).format("MM-DD-YYYY")
            StatusArray?.map((item: any) => {
                if (StatusData.value == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }
    }
    const closeTaskStatusUpdatePopup = () => {
        setTaskStatusPopup(false)
    }
    const openPriotiyEdit = () => {
        if (props?.type != undefined && props?.type == 'Task') {
            setTaskPriorityPopup(true)
        }
    }
    const handleCategoryChange = (event: any, CategoryId: any) => {
        if (event.target.checked) {
            setSelectedCatId([...selectedCatId, CategoryId]);
          } else {
            setSelectedCatId(selectedCatId.filter((val:any) => val !== CategoryId));
          }
       

    }
    return (
        <>
            {
                props?.columnName == 'Priority' ?
                    <>
                        <span style={{ display: "block", width: "100%" }} onClick={() => openPriotiyEdit()} >
                            &nbsp;
                            {props?.item?.Priority_x0020_Rank}
                            <span className='ms-1'>
                            {
                                props?.item?.SharewebCategories?.map((category: any) => {
                                    if (category?.Title == 'Immediate') {
                                        return (
                                            <a title="Immediate"><img className=' imgAuthor' src={require("../../../Assets/ICON/urgent.svg")} /> </a>
                                        )
                                    }
                                    if (category?.Title == 'Bottleneck') {
                                        return (
                                            <a title="Bottleneck"><img className=' imgAuthor' src={require("../../../Assets/ICON/bottleneck.svg")} /> </a>
                                        )
                                    }
                                    if (category?.Title == 'Favorite') {
                                        return (
                                            <a title="Favorite"><img className=' imgAuthor' src={require("../../../Assets/ICON/favouriteselected.svg")} /> </a>
                                        )
                                    }
                                })
                            }
                            </span>
                        </span>
                    </>
                    : ''
            }
            {
                props?.columnName == 'PercentComplete' ?
                    <>

                        <span style={{ display: "block", width: "100%" }} onClick={() => openTaskStatusUpdatePopup()}>
                            {/* {props?.item?.PercentComplete} */}
                            {parseInt(props?.item?.PercentComplete) <= 5 &&
                                parseInt(props?.item?.PercentComplete) >= 0 ? (
                                <a title={getPercentCompleteTitle(props?.item?.PercentComplete)}>
                                   
                                    <span className='svg__iconbox svg__icon--Ellipse'></span>
                                </a>
                            ) : parseInt(props?.item?.PercentComplete) >= 6 &&
                                parseInt(props?.item?.PercentComplete) <= 98 ? (
                                <a title={getPercentCompleteTitle(props?.item?.PercentComplete)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
<circle cx="15" cy="15" r="14" fill="white" stroke="#414141" stroke-width="2"/>
<path d="M30 15C30 16.9698 29.612 18.9204 28.8582 20.7403C28.1044 22.5601 26.9995 24.2137 25.6066 25.6066C24.2137 26.9995 22.5601 28.1044 20.7403 28.8582C18.9204 29.612 16.9698 30 15 30C13.0302 30 11.0796 29.612 9.25975 28.8582C7.43986 28.1044 5.78628 26.9995 4.3934 25.6066C3.00052 24.2137 1.89563 22.5601 1.14181 20.7403C0.387986 18.9204 -1.72208e-07 16.9698 0 15L15 15L30 15Z" fill="#414141"/>
</svg>
                                </a>
                            ) : (
                                <a title={getPercentCompleteTitle(props?.item?.PercentComplete)}>
                                    
                                    <span className='svg__iconbox svg__icon--completed'></span>
                                </a>
                            )}
                            {
                                props?.item?.IsTodaysTask ? <>
                                    {
                                        props?.item?.AssignedTo?.map((AssignedUser: any) => {
                                            return (
                                                taskUsers?.map((user: any) => {
                                                    if (AssignedUser.Id == user.AssingedToUserId) {
                                                        return (
                                                            <span className="user_Member_img">
                                                                <a
                                                                    href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TeamLeader-Dashboard.aspx?UserId=${user.Id}&Name=${user.Title}`}
                                                                    target="_blank"
                                                                    data-interception="off"
                                                                    title={user.Title}
                                                                >
                                                                    <img className="imgAuthor" src={user?.Item_x0020_Cover?.Url}></img>
                                                                </a>
                                                            </span>
                                                        )
                                                    }

                                                })
                                            )
                                        })
                                    }
                                </> : ''
                            }
                            {/* {props?.item?.Categories?.includes('Immediate') ?
        <a style={{ marginRight: '5px' }} title="Immediate"><img src={require("../../../Assets/ICON/alert.svg")} /> </a> : " "} */}
                        </span>
                    </>
                    : ''
            }
            {/* Pannel To select Status */}
            <Panel
                headerText={`Update Status`}
                isOpen={TaskStatusPopup}
                onDismiss={closeTaskStatusUpdatePopup}
                isBlocking={TaskStatusPopup}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
                    <div className="modal-body">
                        <table className="table table-hover" style={{ marginBottom: "0rem !important" }}>
                            <tbody>
                                {StatusArray?.map((item: any, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="form-check l-radio">
                                                    <input className="form-check-input"
                                                        type="radio" checked={(PercentCompleteCheck ? props?.item?.PercentComplete : UpdateTaskInfo.PercentCompleteStatus) == item.value}
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
                        <button type="button" className="btn btn-primary px-3" onClick={() => UpdateTaskStatus()}>
                            OK
                        </button>
                    </footer>
                </div>
            </Panel>
            {/* Pannel To select Priority */}
            <Panel
                headerText={`Update Task Priority`}
                isOpen={TaskPriorityPopup}
                onDismiss={() => setTaskPriorityPopup(false)}
                isBlocking={TaskStatusPopup}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
                    <div className="modal-body">
                        <table className="table table-hover" style={{ marginBottom: "0rem !important" }}>
                            <tbody>
                                {priorityRank?.map((item: any, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="form-check l-radio">
                                                    <input className="form-check-input"
                                                        type="radio" checked={taskPriority == item.Title}
                                                        onClick={() => setTaskPriority(item.Title)} />
                                                    <label className="form-check-label mx-2">{item.Title}</label>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {impTaskCategoryType?.map((option) => (
                        <div key={option.Id}>
                            <input
                                type="checkbox"
                                id={option.Id}
                                value={option.Id}
                                checked={selectedCatId?.includes(option.Id)}
                                onChange={(event) => handleCategoryChange(event, option.Id)}
                            />
                             <a title={option.Title}><img className=' imgAuthor' src={require(`../../../Assets/ICON/${option.spfxIconName}`)} /> </a>
                            <label htmlFor={option.Id}>{option.Title}</label>
                        </div>
                    ))}
                    <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3" onClick={() => UpdateTaskStatus()}>
                            OK
                        </button>
                    </footer>
                </div>
            </Panel>
        </>
    )
}
export default inlineEditingcolumns