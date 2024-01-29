import * as React from "react";
import pnp, { Web } from "sp-pnp-js";
import * as GlobalCommon from './globalCommon';
import EmailNotificationMail from "./EditTaskPopup/EmailNotificationMail";
import * as Moment from "moment";
import EmailComponent from "./EmailComponents";

import { renderToStaticMarkup } from 'react-dom/server';

// this is used for getting page context 

export const pageContext = async () => {
    let result;
    try {
        result = (await pnp.sp.site.getContextInfo());
    }
    catch (error) {
        return Promise.reject(error);
    }
    return result;
}

// this is used for Getting All Task users data 

export const GetAllUsersData = (RequiredData: any): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
        const { ListId, ListSiteURL } = RequiredData || {};
        let AllTaskUsers = [];
        try {
            if (ListSiteURL && ListId) {
                const web = new Web(ListSiteURL);
                AllTaskUsers = await web.lists
                    .getById(ListId)
                    .items.select("Id,UserGroupId,TimeCategory,CategoriesItemsJson,IsActive,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name")
                    .filter("IsActive eq 1")
                    .expand("AssingedToUser,Approver")
                    .orderBy("SortOrder", true)
                    .orderBy("Title", true)
                    .getAll();

                resolve(AllTaskUsers);
            } else {
                let missingData = '';
                if (!ListSiteURL) {
                    missingData = 'List URL';
                }
                if (!ListId) {
                    missingData = missingData ? 'List ID & List URL' : 'List ID';
                }
                reject(`Please provide ${missingData} and try again.`);
            }
        } catch (error) {
            reject(error);
        }
    });
};



// this is used for getting the current Uer All Details from Task Uer List 

export const GetCurrentUserData = (RequiredData: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const currentUserId = RequiredData?.Context?.pageContext._legacyPageContext.userId;
            const allUsersData: any = await GetAllUsersData(RequiredData);
            let ApproversData: any = [];
            let CurrentUserData: object = {};
            if (allUsersData?.length > 0) {
                allUsersData?.map((UserItem: any) => {
                    if (UserItem.AssingedToUserId == currentUserId) {
                        UserItem.UserFromHHHHTeam = UserItem.UserGroupId === 7;
                        UserItem.serItemUserImage = UserItem.Item_x0020_Cover?.Url;
                        CurrentUserData = UserItem;
                        if (UserItem?.Approver?.length > 0) {
                            ApproversData = UserItem?.Approver;
                        }
                    }
                });
            }

            let UserDataObject = {
                CurrentUser: CurrentUserData,
                AllUsersData: allUsersData,
                CurrentUserId: currentUserId,
                ApproversData: ApproversData,
            };
            resolve(UserDataObject);
        } catch (error) {
            reject(error);
        }
    });
};



// this is used for Getting All Smart Meta Data

export const GetSmartMetaDataListAllItems = async (RequiredData: any) => {
    const { ListId, ListSiteURL, TaxType } = RequiredData || {};
    let AllSmartDataListData: any = [];
    try {
        const web = new Web(ListSiteURL);
        AllSmartDataListData = await web.lists
            .getById(ListId)
            .items.select(
                "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,Color_x0020_Tag,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail,Parent/Id,Parent/Title"
            )
            .expand("Author,Editor,IsSendAttentionEmail,Parent")
            .getAll();
        if (AllSmartDataListData?.length > 0) {
            if (TaxType?.length > 0) {
                for (const item of TaxType) {
                    let obj: any = {};
                    obj[item] = getSmartMetadataItemsByTaxType(AllSmartDataListData, item);
                    AllSmartDataListData.push(obj);
                }
            }
        }
    } catch (error) {
        console.log("Error :", error.message);
    }
}


// Common Function for filtering the Data According to Tax Type
const getSmartMetadataItemsByTaxType = function (
    metadataItems: any,
    taxType: any
) {
    var Items: any = [];
    metadataItems.map((taxItem: any) => {
        if (taxItem.TaxType === taxType) Items.push(taxItem);
    });
    Items.sort((a: any, b: any) => {
        return a.SortOrder - b.SortOrder;
    });
    return Items;
};


// this function is used for the updating the task Status and perform all the operations regarding status changed

export const UpdateTaskStatusFunction = async (RequiredData: any) => {
    const { ItemDetails, RequiredListIds, Status, Context } = RequiredData || {}
    let CheckImmediateCategoryTask = ItemDetails.TaskCategories?.some((category: any) => category.Title === "Email Notification");
    let CheckEmailCategoryTask = ItemDetails.TaskCategories?.some((category: any) => category.Title === "Immediate");
    let CheckDesignCategoryTask = ItemDetails.TaskCategories?.some((category: any) => category.Title === "Design");
    const GetTaskUsersData: any = await GetCurrentUserData({ ListId: RequiredListIds?.TaskUsertListID, ListSiteURL: RequiredListIds?.siteUrl, Context: Context })
    const AllTaskUsersData = GetTaskUsersData?.AllUsersData;
    const CurrentUserData = GetTaskUsersData?.CurrentUser;
    let UpdateDataJSON: any = { PercentComplete: Number(Status) / 100 };
    let TaskCategories: string = ItemDetails?.TaskCategories?.map((item: any) => item.Title).join(', ');
    let TaskCategoriesIds: any = ItemDetails?.TaskCategories?.map((person: any) => person.Id);
    let ApproverIds: any = GetTaskUsersData?.ApproversData?.map((person: any) => person.Id);
    let UniqueIds = TaskCategoriesIds.filter((number: any, index: any, array: any) => array.indexOf(number) === index);
    let ReceiveRejectedTaskUserId: any = [];

    if (ItemDetails?.Approvee?.length > 0) {
        ReceiveRejectedTaskUserId = ItemDetails?.Approvee?.Id;
    } else {
        ReceiveRejectedTaskUserId = ItemDetails?.Author?.Id;
    }
    if (Status == 1) {
        if (UniqueIds?.length > 0) {
            if (UniqueIds?.includes(227)) {
            } else {
                UniqueIds.push(227)
            }
        } else {
            UniqueIds = [227]
        }
        UpdateDataJSON.ApproveeId = GetTaskUsersData?.CurrentUserId;
        UpdateDataJSON.TaskCategoriesId = {
            results:
                UniqueIds?.length > 0 ? UniqueIds : []
        };
        UpdateDataJSON.TeamMembersId = {
            results:
                ApproverIds?.length > 0 ? ApproverIds : []
        };
        UpdateDataJSON.AssignedToId = {
            results:
                ApproverIds?.length > 0 ? ApproverIds : []
        };
        const sendEmailNotification = async () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const emailComponent = <EmailComponent
                        AllTaskUser={AllTaskUsersData}
                        CurrentUser={CurrentUserData}
                        CreatedApprovalTask={true}
                        items={ItemDetails}
                        Context={Context}
                        callBack={() => console.log("Dummy FUnction")}
                        statusUpdateMailSendStatus={false}
                        IsEmailCategoryTask={true}
                    />;
                    const emailHTML = renderToStaticMarkup(emailComponent);
                    resolve(emailHTML);
                } catch (error) {
                    console.log("Send Email Notification", error.message);
                    reject(error);
                }
            });
        };

        // Example usage
        sendEmailNotification()
            .then((emailHTML) => {
                console.log("Email HTML:", emailHTML);
            })
            .catch((error) => {
                console.error("Error sending email notification:", error);
            });
        // try {
        //     const emailComponent = <EmailComponent
        //         AllTaskUser={AllTaskUsersData}
        //         CurrentUser={CurrentUserData}
        //         CreatedApprovalTask={true}
        //         items={ItemDetails}
        //         Context={Context}
        //         callBack={() => console.log("Dummy FUnction")}
        //         statusUpdateMailSendStatus={false}
        //         IsEmailCategoryTask={true}
        //     />;
        //     const emailHTML = renderToStaticMarkup(emailComponent);
        //     return emailHTML;
        // } catch (error) {
        //     console.log("Send Email Notification", error.message);
        // }
    }
    if (Status == 2) {
        let FeedBackData: any = await UpdateFeedbackJSON({ ItemDetails: ItemDetails, SmartLightStatus: "Reject" });
        UpdateDataJSON.TeamMembersId = {
            results:
                ReceiveRejectedTaskUserId?.length > 0 ? ReceiveRejectedTaskUserId : []
        };
        UpdateDataJSON.AssignedToId = {
            results:
                ReceiveRejectedTaskUserId?.length > 0 ? ReceiveRejectedTaskUserId : []
        };
        UpdateDataJSON.FeedBack = FeedBackData?.length > 0 ? JSON.stringify(FeedBackData) : [];

        try {
            // const emailComponent = <EmailComponent
            //     AllTaskUser={AllTaskUsersData}
            //     CurrentUser={CurrentUserData}
            //     CreatedApprovalTask={false}
            //     items={ItemDetails}
            //     Context={Context}
            //     ApprovalTaskStatus={true}
            //     callBack={() => console.log("Dummy FUnction")}
            // />;
            // const emailHTML = renderToStaticMarkup(emailComponent);
            // return emailHTML;
        } catch (error) {
            console.log("Send Email Notification", error.message);
        }

    }
    if (Status == 3) {
        let FeedBackData: any = UpdateFeedbackJSON({ ItemDetails: ItemDetails, SmartLightStatus: "Approved" });

        UpdateDataJSON.AssignedToId = {
            results: []
        };
        UpdateDataJSON.FeedBack = FeedBackData?.length > 0 ? JSON.stringify(FeedBackData) : []

        // const emailComponent = <EmailComponent
        //     AllTaskUser={AllTaskUsersData}
        //     CurrentUser={CurrentUserData}
        //     CreatedApprovalTask={false}
        //     items={ItemDetails}
        //     Context={Context}
        //     ApprovalTaskStatus={true}
        //     callBack={() => console.log("Dummy FUnction")}
        // />;
        // const emailHTML = renderToStaticMarkup(emailComponent);
        // return emailHTML;
    }



    if (Status <= 5 && Status >= 90) {
        if (CheckImmediateCategoryTask || CheckEmailCategoryTask) {
            try {
                <EmailNotificationMail emailStatus={true} items={ItemDetails} statusValue={Status} Context={Context} />
            } catch (error) {
                console.log("Send Email Notification", error.message)
            }
        }
    }
    if (Status == 10) {
        UpdateDataJSON.IsTodaysTask = true;
        UpdateDataJSON.CompletedDate = undefined;
        if (ItemDetails.StartDate == undefined) {
            UpdateDataJSON.StartDate = Moment(new Date()).format("MM-DD-YYYY");
        }
    }
    if (Status == 70 || Status == 80) {
        let RequiredDataForCall: any = {
            TeamMembers: ItemDetails?.TeamMembers,
            AllTaskUsersData: AllTaskUsersData,
            StatusValue: Status,
        }
        let RequiredChangedData: any = await AssignedToWorkingMember(RequiredDataForCall);
        UpdateDataJSON.AssignedToId = {
            results:
                RequiredChangedData?.AssignedToUserIds?.length > 0 ? RequiredChangedData?.AssignedToUserIds : []
        };

        let SentMSTeamsData: any = {
            ReceiversEmails: RequiredChangedData?.ReceiversEmails,
            ReceiversName: RequiredChangedData?.ReceiversName,
            TaskCategories: TaskCategories,
            SendMSTeamMessage: RequiredChangedData?.SendMSTeamMessage,
            ItemDetails: ItemDetails,
            siteUrl: RequiredListIds?.siteUrl,
            Context: Context
        }
        SendMSTeamsNotification(SentMSTeamsData);
    }
    if (Status == 90) {
        UpdateDataJSON.IsTodaysTask = false;
        UpdateDataJSON.workingThisWeek = false;
        UpdateDataJSON.CompletedDate = undefined;
        UpdateDataJSON.CompletedDate = Moment(new Date()).format("MM-DD-YYYY");
        if (ItemDetails.siteType == "Offshore Tasks") {
            UpdateDataJSON.AssignedToId = {
                results: [36]
            };
        } else if (CheckDesignCategoryTask) {
            UpdateDataJSON.AssignedToId = {
                results: [301]
            };
        } else {
            UpdateDataJSON.AssignedToId = {
                results: [42]
            };
        }
    }
    if (Status == 93 || Status == 96 || Status == 99) {
        UpdateDataJSON.AssignedToId = {
            results: [32]
        };
        UpdateDataJSON.IsTodaysTask = false;
        UpdateDataJSON.workingThisWeek = false;
    }
    let DataForUpdate =
    {
        UpdateDataJSON: UpdateDataJSON,
        ListId: ItemDetails?.listId,
        ListSiteURL: RequiredListIds?.siteUrl,
        ItemId: ItemDetails?.Id,
        AllTaskUsersData: AllTaskUsersData
    }
    let UpdatedData: any = await UpdateItemDetails(DataForUpdate);
    return UpdatedData;
}

export const AssignedToWorkingMember = (RequiredData: any) => {
    const AssignedUser: any[] = RequiredData?.TeamMembers || [];
    const AllTaskUsersData: any[] = RequiredData?.AllTaskUsersData || [];
    const Status: any = RequiredData?.StatusValue;

    let SendUserName: any = '';
    let SendMSTeamMessage: any = '';
    let AssignedToIds: any[] = [];
    let sendUserEmails: any[] = [];
    let PrepareAllData: any[] = [];
    if (AssignedUser.length > 0) {
        const assignedUserIds: any = AssignedUser.map((user: any) => user.Id);
        const filteredUsers: any = AllTaskUsersData.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
        if (Status == 80) {
            PrepareAllData = filteredUsers.filter((userItem: any) => userItem.TimeCategory === "QA");
            SendMSTeamMessage = `Below task has been set to 80%, please review it.`
        } else if (Status == 70) {
            PrepareAllData = filteredUsers.filter((userItem: any) => userItem.TimeCategory !== "QA");
            SendMSTeamMessage = `Below task has been re-opened. Please review it and take necessary action on priority basis.`
        }
        PrepareAllData.forEach((filteredData: any) => {
            AssignedToIds.push(filteredData.AssingedToUserId);
            sendUserEmails.push(filteredData.Email);
            SendUserName = (SendUserName.length > 3) ? "Team" : filteredData.Title;
        });
    }

    const ReturnDataObj: any = {
        ReceiversName: SendUserName,
        ReceiversEmails: sendUserEmails,
        AssignedToUserIds: AssignedToIds,
        SendMSTeamMessage: SendMSTeamMessage,
        Status: Status
    };

    return ReturnDataObj;
};
export const SendMSTeamsNotification = async (RequiredData: any) => {
    const ReceiversEmails = RequiredData.ReceiversEmails;
    const ReceiversName = RequiredData.ReceiversName;
    const Context = RequiredData?.Context;
    const TaskCategories = RequiredData.TaskCategories;
    const SendMSTeamMessage = RequiredData.SendMSTeamMessage;
    const ItemDetailsJSON: any = RequiredData.ItemDetails;
    const siteUrl: string = RequiredData.siteUrl;
    try {
        let SendMessage: string = '';
        SendMessage = `<p><b>Hi ${ReceiversName},</b> </p></br><p>${SendMSTeamMessage}</p> </br> 
            <p>
            Task Link:  <a href=${siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + ItemDetailsJSON?.Id + "&Site=" + ItemDetailsJSON?.siteType}>
             ${ItemDetailsJSON?.TaskId}-${ItemDetailsJSON?.Title}
            </a>
            </br>
            Task Category: ${TaskCategories}</br>
            Smart Priority: <b>${ItemDetailsJSON?.SmartPriority}</b></br>
            </p>
            <p></p>
            <b>
            Thanks, </br>
            Task Management Team
            </b>
            `
        try {
            if (ReceiversEmails?.length > 0) {
                await GlobalCommon.SendTeamMessage(
                    ReceiversEmails,
                    SendMessage,
                    Context
                );
            }
        } catch (error) {
            console.log("Error", error.message);
        }
    } catch (error) {
        console.log("Error", error.message)
    }


}
// export const UpdateFeedbackJSON = async (RequiredData: any) => {
//     const { ItemDetails, SmartLightStatus } = RequiredData || {};
//     let feedback: any = []
//     if (ItemDetails.FeedBack?.length > 0) {
//         let FeedbackData: any = JSON.parse(ItemDetails.FeedBack);
//         feedback = FeedbackData;
//     }
//     feedback?.map((items: any) => {
//         if (items?.FeedBackDescriptions != undefined && items?.FeedBackDescriptions?.length > 0) {
//             items?.FeedBackDescriptions?.map((feedback: any) => {
//                 if (feedback?.Subtext != undefined) {
//                     feedback?.Subtext?.map((subtext: any) => {
//                         if (subtext?.isShowLight === "") {
//                             subtext.isShowLight = SmartLightStatus
//                         } else {
//                             subtext.isShowLight = SmartLightStatus
//                         }
//                     })
//                 }
//                 if (feedback.isShowLight === "") {
//                     feedback.isShowLight = SmartLightStatus
//                 } else {
//                     feedback.isShowLight = SmartLightStatus
//                 }
//             })
//         }
//     })
//     return feedback;
// };

export const UpdateFeedbackJSON = async (RequiredData: any) => {
    const { ItemDetails, SmartLightStatus } = RequiredData || {};
    let feedback = [];
    if (ItemDetails.FeedBack?.length > 0) {
        const feedbackData = JSON.parse(ItemDetails.FeedBack);
        feedback = feedbackData.map((items: any) => {
            if (items?.FeedBackDescriptions != undefined && items?.FeedBackDescriptions?.length > 0) {
                items.FeedBackDescriptions = items.FeedBackDescriptions.map((feedbackItem: any) => {
                    feedbackItem.Subtext = feedbackItem.Subtext?.map((subtext: any) => ({
                        ...subtext,
                        isShowLight: SmartLightStatus
                    }));
                    return {
                        ...feedbackItem,
                        isShowLight: SmartLightStatus
                    };
                });
            }
            return {
                ...items,
                isShowLight: SmartLightStatus
            };
        });
    }

    return feedback;
};


export const UpdateItemDetails = (RequiredData: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const { UpdateDataJSON, ListId, ListSiteURL, ItemId, AllTaskUsersData } = RequiredData || {};
        let assignedUserIds: any;
        let UpdatedData: any = null;
        let SendUpdatedData: any = {
            PercentComplete: "",
            TaskCategories: "",
            TeamMembers: "",
            AssignedTo: "",
            IsTodaysTask: "",
            CompletedDate: "",
            FeedBack: ""
        }
        let query = "Id,Title,FeedBack,PriorityRank,Remark,Project/PriorityRank,Project/PortfolioStructureID,ParentTask/Id,ParentTask/Title,ParentTask/TaskID,TaskID,SmartInformation/Id,SmartInformation/Title,Project/Id,Project/Title,workingThisWeek,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,Sitestagging,Priority,Status,ItemRank,IsTodaysTask,Body,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,TaskType/Level,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title&$expand=AssignedTo,Project,ParentTask,SmartInformation,Author,Portfolio,Editor,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory"
        try {
            const web = new Web(ListSiteURL);
            const updatedItem = await web.lists
                .getById(ListId)
                .items.getById(ItemId)
                .update(UpdateDataJSON);
            UpdatedData = await updatedItem.item.select(query).get();
            console.log(`Item Details Updated Successfully for ${ItemId}`);
            if (UpdatedData?.TeamMembers?.length > 0) {
                assignedUserIds = UpdatedData?.TeamMembers?.map((user: any) => user.Id);
                SendUpdatedData.TeamMembers = AllTaskUsersData.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
            }
            if (UpdatedData?.AssignedTo?.length > 0) {
                assignedUserIds = UpdatedData?.AssignedTo?.map((user: any) => user.Id);
                SendUpdatedData.AssignedTo = AllTaskUsersData.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
            }
            if (UpdatedData.PercentComplete != undefined && UpdatedData.PercentComplete != null) {
                SendUpdatedData.PercentComplete = UpdatedData.PercentComplete * 100;
            }
            SendUpdatedData.FeedBack = UpdatedData.FeedBack;
            SendUpdatedData.TaskCategories = UpdatedData.TaskCategories;
            SendUpdatedData.IsTodaysTask = UpdatedData.IsTodaysTask;
            SendUpdatedData.CompletedDate = UpdatedData.CompletedDate;
            resolve(SendUpdatedData);
        } catch (error) {
            console.log("Error in update Item Details Function", error.message);
            reject(error);
        }
    });
};



























{/***
  Status == 1% {
   1. Current User become Approve
   2. Tagged Task Category Approval 
   3. Email Send To Current User's approver also approver's approver
   4. Current User's Approver become AssignedTo and TeamMember 
  }
  Status == 2% {
    
  }
  Status == 3% {

  }
  Status == 5% {
    1. Email or Immediate category exist , send email notification to Creator
  }
  Status == 10% {
    1. working today == true
    2. start date ==  present date
    3. completed date == undefined
    3. Email or Immediate category exist , send email notification to Creator
  }
  Status == 70% {
    1. MS Team Notification and Assigned to Respective Developer from TeamMember columns
  }
  Status == 80% {
    1. MS Team Notification and Assigned to Respective QA from TeamMember columns
    2. Working Today == false
    3. working This week == false
    4. Email or Immediate category exist , send email notification to Creator
  }
  Status == 90% {
    1. If design category task is there, it should assigned to Kristina.
    2. When task category apart from design then the task should assign to Mattis (email notification also goes to Mattis).
    3. Offshore task should assign to deepak trivedi, if task status is 90%.
    4. if the task category is Immediate then the users whose task notification is ON will get the email notification.
  }
  

****/}




// Instructions for Using this Global Common Functions 

{ /**

1.  GetAllUsersData(RequiredData);
    RequiredData = {
       ListId : "XXXXXXXXXXXXXXXXX",
       ListSiteURL:"https....................."
    }

2.  GetCurrentUserData(RequiredData);
    RequiredData = {
       ListId : "XXXXXXXXXXXXXXXXX",
       ListSiteURL:"https....................."
    }

3.  GetSmartMetaDataListAllItems(RequiredData);
    RequiredData = {
       ListId : "XXXXXXXXXXXXXXXXX",
       ListSiteURL:"https.....................",
       TaxType : ["TaxType-1", "TaxType-2", ........]
    }

**/}
