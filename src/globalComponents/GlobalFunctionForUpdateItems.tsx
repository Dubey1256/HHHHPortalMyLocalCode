import * as React from "react";
import pnp, { Web } from "sp-pnp-js";
import * as GlobalCommon from './globalCommon';
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from "moment";
import ReactDOM from "react-dom";
import { Title } from "@material-ui/icons";


// this is used for getting page context 

// export const pageContext = async () => {
//     let result;
//     try {
//         result = (await pnp.sp.site.getContextInfo());
//     }
//     catch (error) {
//         return Promise.reject(error);
//     }
//     return result;
// }

// this is used for Getting All Task users data 

export const GetAllUsersData = (RequiredData: any): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
        const { ListId, ListSiteURL } = RequiredData || {};
        let AllTaskUsers: any = [];
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
                        UserItem.ItemCover = UserItem.Item_x0020_Cover?.Url;
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

export const GetSmartMetaDataListAllItems = (RequiredData: any) => {
    return new Promise(async (resolve, reject) => {
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

            if (AllSmartDataListData?.length > 0 && TaxType?.length > 0) {
                const itemsByTaxType = TaxType.map((type: any) => ({
                    [type]: getSmartMetadataItemsByTaxType(AllSmartDataListData, type)
                }));
                resolve(itemsByTaxType);
            } else {
                resolve(AllSmartDataListData);
            }
        } catch (error) {
            console.error("Error:", error.message);
            reject(error);
        }
    });
};

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

//  This is used for bulk updating item property like task status and task categories both with single function 

export const BulkUpdateTaskInfo = async (RequiredData: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { ItemDetails, RequiredListIds, UpdatedData, Context, AllTaskUsers } = RequiredData || {};
            const GetTaskUsersData: any = await GetCurrentUserData({ ListId: RequiredListIds?.TaskUsertListID, ListSiteURL: RequiredListIds?.siteUrl, Context: Context });
            const AllTaskUsersData = GetTaskUsersData?.AllUsersData;
            let StatusUpdatedJSON: any = {};
            let TaskCategoryUpdatedJSON: any = {};

            if (UpdatedData?.PercentComplete != undefined && UpdatedData?.PercentComplete >= 0 || (UpdatedData?.TaskCategories != undefined && UpdatedData?.TaskCategories?.length > 0)) {
                if (UpdatedData?.PercentComplete != undefined && UpdatedData?.PercentComplete >= 0) {
                    let RequiredData: any = {
                        ItemDetails: ItemDetails,
                        RequiredListIds: RequiredListIds,
                        Status: UpdatedData?.PercentComplete,
                        Context: Context,
                        usedFor: "BulkUpdate"
                    };
                    try {
                        StatusUpdatedJSON = await UpdateTaskStatusFunction(RequiredData);
                        console.log("UpdateTaskStatusFunction result:", StatusUpdatedJSON);
                    } catch (error) {
                        console.error("Error in UpdateTaskStatusFunction:", error);
                        reject(error);
                    }
                }

                if (UpdatedData?.TaskCategories != undefined && UpdatedData?.TaskCategories?.length > 0) {
                    let RequiredData: any = {
                        ItemDetails: ItemDetails,
                        RequiredListIds: RequiredListIds,
                        TaskCategories: UpdatedData?.TaskCategories,
                        Context: Context,
                        usedFor: "BulkUpdate"
                    };
                    try {
                        TaskCategoryUpdatedJSON = await UpdateTaskCategoryFunction(RequiredData);
                    } catch (error) {
                        console.error("Error in UpdateTaskCategoryFunction:", error);
                        reject(error);
                    }
                }

                let finalUpdateJSON: any = { ...StatusUpdatedJSON, ...TaskCategoryUpdatedJSON };

                for (const key in StatusUpdatedJSON) {
                    if (TaskCategoryUpdatedJSON.hasOwnProperty(key)) {
                        delete finalUpdateJSON[key];
                    }
                }

                let DataForUpdate =
                {
                    UpdateDataJSON: finalUpdateJSON,
                    ListId: ItemDetails?.listId,
                    ListSiteURL: RequiredListIds?.siteUrl,
                    ItemId: ItemDetails?.Id,
                    AllTaskUsersData: AllTaskUsersData,
                    ItemDetails: ItemDetails
                };

                try {
                    let UpdatedDataJSON: any = await UpdateItemDetails(DataForUpdate);
                    resolve(UpdatedDataJSON);
                } catch (error) {
                    console.error("Error in UpdateItemDetails:", error);
                    reject(error);
                }
            } else {
                resolve(ItemDetails);
            }
        } catch (error) {
            console.error("Error in BulkUpdateTaskInfo:", error);
            reject(error);
        }
    });
};

// This is used for updating only Task status and perform all the function related to status changed 

export const UpdateTaskStatusFunction = async (RequiredData: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { ItemDetails, RequiredListIds, Status, Context, usedFor } = RequiredData || {};
            let CheckEmailCategoryTask = ItemDetails.TaskCategories?.some((category: any) => category.Title === "Email Notification");
            let CheckImmediateCategoryTask = ItemDetails.TaskCategories?.some((category: any) => category.Title === "Immediate");
            let CheckDesignCategoryTask = ItemDetails.TaskCategories?.some((category: any) => category.Title === "Design");
            const GetTaskUsersData: any = await GetCurrentUserData({ ListId: RequiredListIds?.TaskUsertListID, ListSiteURL: RequiredListIds?.siteUrl, Context: Context })
            const AllTaskUsersData = GetTaskUsersData?.AllUsersData;
            const CurrentUserData = GetTaskUsersData?.CurrentUser;
            const ApproversData = GetTaskUsersData?.ApproversData;
            let UpdateDataJSON: any = { PercentComplete: Number(Status) / 100 };
            let TaskCategories: string = ItemDetails?.TaskCategories?.map((item: any) => item.Title).join(', ');
            let TaskCategoriesIds: any = ItemDetails?.TaskCategories?.map((Item: any) => Item.Id);
            let ApproverIds: any = GetTaskUsersData?.ApproversData?.map((Item: any) => Item.Id);
            let UniqueIds = TaskCategoriesIds.filter((number: any, index: any, array: any) => array.indexOf(number) === index);
            let ReceiveRejectedTaskUserId: any = [];
            let ReceiverEmail: any = [];

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
                UpdateDataJSON.Status = "For Approval";
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
                let TempEmailArray: any = [];
                if (ApproversData?.length > 0) {
                    AllTaskUsersData?.map((AllUserData: any) => {
                        ApproversData?.map((ApproverItem: any) => {
                            if (AllUserData.AssingedToUserId === ApproverItem.Id) {
                                TempEmailArray.push(AllUserData.Email);
                                if (AllUserData?.Approver?.length > 0) {
                                    AllUserData?.Approver?.map((AAItem: any) => {
                                        TempEmailArray.push(AAItem.Email);
                                    })
                                }
                            }
                        })
                    })
                }
                ReceiverEmail = TempEmailArray;
                let EmailRequiredData: any = {
                    ItemDetails: ItemDetails,
                    AskForApproval: true,
                    TaskIsApproved: undefined,
                    CurrentUser: [CurrentUserData],
                    Context: Context,
                    ReceiverEmail: ReceiverEmail,
                    usedFor: "Approval"
                }
                SendApprovalEmailNotificationComponent(EmailRequiredData)
                    .then((data) => {
                        // Handle success
                        console.log("Email sent successfully!", data);
                    })
                    .catch((error) => {
                        // Handle error
                        console.error("Error sending email:", error);
                    });

            }
            if (Status == 2) {
                let FeedBackData: any = await UpdateFeedbackJSON({ ItemDetails: ItemDetails, SmartLightStatus: "Reject" });
                UpdateDataJSON.Status = "Follow Up";
                UpdateDataJSON.TeamMembersId = {
                    results:
                        ReceiveRejectedTaskUserId?.length > 0 ? ReceiveRejectedTaskUserId : []
                };
                UpdateDataJSON.AssignedToId = {
                    results:
                        ReceiveRejectedTaskUserId?.length > 0 ? ReceiveRejectedTaskUserId : []
                };
                UpdateDataJSON.FeedBack = FeedBackData?.length > 0 ? JSON.stringify(FeedBackData) : [];
                if (ApproversData?.length > 0) {
                    AllTaskUsersData?.map((AllUserData: any) => {
                        if (ItemDetails?.Approvee?.AssingedToUserId !== undefined) {
                            if (AllUserData.AssingedToUserId === ItemDetails?.Approvee?.AssingedToUserId) {
                                ReceiverEmail = [AllUserData.Email];
                            }
                        } else {
                            if (AllUserData.AssingedToUserId === ItemDetails?.Author?.Id) {
                                ReceiverEmail = [AllUserData.Email];
                            }
                        }

                    })
                }
                try {
                    let EmailRequiredData: any = {
                        ItemDetails: ItemDetails,
                        AskForApproval: undefined,
                        TaskIsApproved: false,
                        CurrentUser: [CurrentUserData],
                        Context: Context,
                        ReceiverEmail: ReceiverEmail,
                        usedFor: "Approval"
                    }
                    SendApprovalEmailNotificationComponent(EmailRequiredData)
                        .then((data) => {
                            console.log("Email sent successfully!", data);
                        })
                        .catch((error) => {
                            console.error("Error sending email:", error);
                        });
                } catch (error) {
                    console.log("Send Email Notification", error.message);
                }

            }
            if (Status == 3) {
                if (ApproversData?.length > 0) {
                    AllTaskUsersData?.map((AllUserData: any) => {
                        if (ItemDetails?.Approvee?.AssingedToUserId !== undefined) {
                            if (AllUserData.AssingedToUserId === ItemDetails?.Approvee?.AssingedToUserId) {
                                ReceiverEmail = [AllUserData.Email];
                            }
                        } else {
                            if (AllUserData.AssingedToUserId === ItemDetails?.Author?.Id) {
                                ReceiverEmail = [AllUserData.Email];
                            }
                        }

                    })
                }
                let FeedBackData: any = UpdateFeedbackJSON({ ItemDetails: ItemDetails, SmartLightStatus: "Approved" });
                UpdateDataJSON.Status = "Approved";
                UpdateDataJSON.AssignedToId = {
                    results: []
                };
                UpdateDataJSON.FeedBack = FeedBackData?.length > 0 ? JSON.stringify(FeedBackData) : [];
                try {
                    let EmailRequiredData: any = {
                        ItemDetails: ItemDetails,
                        AskForApproval: undefined,
                        TaskIsApproved: true,
                        CurrentUser: [CurrentUserData],
                        Context: Context,
                        ReceiverEmail: ReceiverEmail,
                        usedFor: "Approval"
                    }
                    SendApprovalEmailNotificationComponent(EmailRequiredData)
                        .then((data) => {
                            console.log("Email sent successfully!", data);
                        })
                        .catch((error) => {
                            console.error("Error sending email:", error);
                        });
                } catch (error) {
                    console.log("Send Email Notification", error.message);
                }
            }

            if (Status == 5) {
                UpdateDataJSON.Status = "Acknowledged";
            }


            if (Status >= 5 && Status <= 90) {
                if (CheckImmediateCategoryTask || CheckEmailCategoryTask) {
                    try {
                        if (ApproversData?.length > 0) {
                            AllTaskUsersData?.map((AllUserData: any) => {
                                if (AllUserData.AssingedToUserId === ItemDetails?.Author?.Id) {
                                    ReceiverEmail = [AllUserData.Email];
                                }
                            })
                        }
                        try {
                            let EmailRequiredData: any = {
                                ItemDetails: ItemDetails,
                                AskForApproval: undefined,
                                TaskIsApproved: false,
                                CurrentUser: [CurrentUserData],
                                Context: Context,
                                ReceiverEmail: ReceiverEmail,
                                usedFor: "Immediate"
                            }
                            SendApprovalEmailNotificationComponent(EmailRequiredData)
                                .then((data) => {
                                    console.log("Email sent successfully!", data);
                                })
                                .catch((error) => {
                                    console.error("Error sending email:", error);
                                });
                        } catch (error) {
                            console.log("Send Email Notification", error.message);
                        }

                    } catch (error) {
                        console.log("Send Email Notification", error.message)
                    }
                }
            }
            if (Status == 10) {
                UpdateDataJSON.IsTodaysTask = true;
                UpdateDataJSON.CompletedDate = undefined;
                UpdateDataJSON.Status = "working on it";

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
                UpdateDataJSON.Status = `${Status == 70 ? "Re-Open" : "In QA Review"}`;
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
                    Context: Context,
                    usedFor: "Status"
                }
                SendMSTeamsNotification(SentMSTeamsData);
            }
            if (Status == 90) {
                UpdateDataJSON.IsTodaysTask = false;
                UpdateDataJSON.workingThisWeek = false;
                UpdateDataJSON.CompletedDate = undefined;
                UpdateDataJSON.Status = "Task completed";
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
                let StatusMsg: any = '';
                if (Status == 93) {
                    StatusMsg = "For Review"
                }
                if (Status == 96) {
                    StatusMsg = "Follow-up later"
                }
                if (Status == 99) {
                    StatusMsg = "Completed"
                }
                UpdateDataJSON.Status = StatusMsg;
                UpdateDataJSON.AssignedToId = {
                    results: [32]
                };
                UpdateDataJSON.IsTodaysTask = false;
                UpdateDataJSON.workingThisWeek = false;
            }
            if (Status == 100) {
                UpdateDataJSON.Status = "Closed";
            }
            if (usedFor !== "BulkUpdate") {
                let DataForUpdate = {
                    UpdateDataJSON: UpdateDataJSON,
                    ListId: ItemDetails?.listId,
                    ListSiteURL: RequiredListIds?.siteUrl,
                    ItemId: ItemDetails?.Id,
                    AllTaskUsersData: AllTaskUsersData
                };
                let UpdatedData: any = await UpdateItemDetails(DataForUpdate);
                resolve(UpdatedData);
            } else {
                resolve(UpdateDataJSON);
            }
        } catch (error) {
            console.error("Error in UpdateTaskStatusFunction:", error);
            reject(error);
        }
    });
};

// This is used for updating only Task Categories and perform all the function related to status changed 


export const UpdateTaskCategoryFunction = async (RequiredData: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { ItemDetails, RequiredListIds, TaskCategories, Context, usedFor } = RequiredData || {};
            let uniqueIds: any = {};
            let FinalTaskCategory: any = [];
            let UpdatedData: any;
            let CheckEmailCategoryTask = TaskCategories?.some((category: any) => category.Title === "Email Notification");
            let CheckImmediateCategoryTask = TaskCategories?.some((category: any) => category.Title === "Immediate");
            let CheckBugCategoryTask = TaskCategories?.some((category: any) => category.Title === "Bug");
            let CheckApprovalCategoryTask = TaskCategories?.some((category: any) => category.Title === "Approval");
            let CheckBottleneckCategoryTask = TaskCategories?.some((category: any) => category.Title === "Bottleneck");
            let CheckAttentionCategoryTask = TaskCategories?.some((category: any) => category?.IsSendAttentionEmail?.Id !== undefined);
            const GetTaskUsersData: any = await GetCurrentUserData({ ListId: RequiredListIds?.TaskUsertListID, ListSiteURL: RequiredListIds?.siteUrl, Context: Context })
            const AllTaskUsersData = GetTaskUsersData?.AllUsersData;
            let ReceiverEmail: any = [];
            if (ItemDetails.TaskCategories?.length > 0) {
                let TaggedData: any = ItemDetails.TaskCategories;
                FinalTaskCategory = TaggedData.concat(TaskCategories);
            } else {
                FinalTaskCategory = TaskCategories;
            }
            const result: any = FinalTaskCategory.filter((item: any) => {
                if (!uniqueIds[item.Id]) {
                    uniqueIds[item.Id] = true;
                    return true;
                }
                return false;
            });
            FinalTaskCategory = result;
            let TaskCategoriesIds: any = FinalTaskCategory?.map((Item: any) => Item.Id);
            let TaskCategoriesTitles: string = FinalTaskCategory?.map((item: any) => item.Title).join(', ');
            let UpdateDataJSON: any = { TaskCategoriesId: { results: TaskCategoriesIds?.length > 0 ? TaskCategoriesIds : [] } };
            let TaskStatusValue: any = ItemDetails?.PercentComplete !== undefined && ItemDetails?.PercentComplete !== null ? Number(ItemDetails?.PercentComplete) * 100 : 0;

            if ((CheckImmediateCategoryTask || CheckEmailCategoryTask) && (TaskStatusValue <= 5 && TaskStatusValue >= 90)) {
                AllTaskUsersData?.map((AllUserData: any) => {
                    if (AllUserData.AssingedToUserId === ItemDetails?.Author?.Id) {
                        ReceiverEmail = [AllUserData.Email];
                    }
                })
                let EmailRequiredData: any = {
                    ItemDetails: ItemDetails,
                    Context: Context,
                    ReceiverEmail: ReceiverEmail,
                    usedFor: "Immediate"
                }
                SendApprovalEmailNotificationComponent(EmailRequiredData)
                    .then((data) => {
                        console.log("Email sent successfully!", data);
                    })
                    .catch((error) => {
                        console.error("Error sending email:", error);
                    });
            }

            if (CheckBugCategoryTask || CheckEmailCategoryTask || CheckImmediateCategoryTask) {
                UpdateDataJSON.DueDate = Moment(new Date()).format("MM-DD-YYYY");
                UpdateDataJSON.PriorityRank = "10";
                UpdateDataJSON.Priority = "(1) High";
            }

            if (CheckApprovalCategoryTask) {
                let RequiredData: any = { ItemDetails: ItemDetails, RequiredListIds: RequiredListIds, Status: 1, Context: Context, usedFor: usedFor }
                try {
                    UpdatedData = await UpdateTaskStatusFunction(RequiredData);
                    if (usedFor === "BulkUpdate") {
                        UpdateDataJSON = UpdatedData;
                    }
                } catch (error) {
                    console.log("Error", error.message);
                }
            }
            if (CheckAttentionCategoryTask) {
                let SentMSTeamsData: any = {
                    ReceiversEmails: [],
                    ReceiversName: "",
                    TaskCategories: TaskCategoriesTitles,
                    SendMSTeamMessage: "You have been tagged as Attention in the below task. Please review it and take necessary action on priority basis.",
                    ItemDetails: ItemDetails,
                    siteUrl: RequiredListIds?.siteUrl,
                    Context: Context,
                    usedFor: "TaskCategories"
                }

                if (TaskCategories?.length > 0) {
                    TaskCategories?.map((CategoryItem: any) => {
                        if (CategoryItem?.IsSendAttentionEmail?.EMail) {
                            SentMSTeamsData?.ReceiversEmails?.push(CategoryItem?.IsSendAttentionEmail?.EMail);
                            if (SentMSTeamsData.ReceiversName?.length > 0) {
                                SentMSTeamsData.ReceiversName = "Team"
                            } else {
                                SentMSTeamsData.ReceiversName = CategoryItem?.IsSendAttentionEmail?.Title
                            }
                        }
                    })
                }
                await SendMSTeamsNotification(SentMSTeamsData);
            }
            if (CheckBottleneckCategoryTask) {
                let SentMSTeamsData: any = {
                    ReceiversEmails: [],
                    ReceiversName: "",
                    TaskCategories: TaskCategoriesTitles,
                    SendMSTeamMessage: "You have been tagged as Bottleneck in the below task. Please review it and take necessary action on priority basis.",
                    ItemDetails: ItemDetails,
                    siteUrl: RequiredListIds?.siteUrl,
                    Context: Context,
                    usedFor: "TaskCategories"
                }

                if (ItemDetails?.AssignedTo?.length > 0) {
                    const assignedUserIds: any = ItemDetails?.AssignedTo?.map((user: any) => user.Id);
                    const filteredUsers: any = AllTaskUsersData?.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
                    filteredUsers?.map((UserItem: any) => {
                        SentMSTeamsData?.ReceiversEmails?.push(UserItem?.Email);
                        if (SentMSTeamsData.ReceiversName?.length > 0) {
                            SentMSTeamsData.ReceiversName = "Team";
                        } else {
                            SentMSTeamsData.ReceiversName = UserItem?.Title;
                        }
                    })
                }
                SendMSTeamsNotification(SentMSTeamsData);
            }
            if (usedFor !== "BulkUpdate") {
                let DataForUpdate = {
                    UpdateDataJSON: UpdateDataJSON,
                    ListId: ItemDetails?.listId,
                    ListSiteURL: RequiredListIds?.siteUrl,
                    ItemId: ItemDetails?.Id,
                    AllTaskUsersData: AllTaskUsersData
                };
                UpdatedData = await UpdateItemDetails(DataForUpdate);
                resolve(UpdatedData);
            } else {
                resolve(UpdateDataJSON);
            }
        } catch (error) {
            console.error("Error in UpdateTaskCategoryFunction:", error);
            reject(error);
        }
    });
};


// this is used for assigned use for different-different cases 

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


// This is used for send notifications on MS Teams 

export const SendMSTeamsNotification = async (RequiredData: any) => {
    const { ReceiversEmails, ReceiversName, Context, TaskCategories, SendMSTeamMessage, ItemDetails, siteUrl, usedFor } = RequiredData || {};
    try {
        let SendMessage: string = '';
        if (usedFor === "Status") {
            SendMessage = `<p><b>Hi ${ReceiversName},</b> </p></br><p>${SendMSTeamMessage}</p> </br> 
            <p>
            Task Link:  <a href=${siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + ItemDetails?.Id + "&Site=" + ItemDetails?.siteType}>
             ${ItemDetails?.TaskId}-${ItemDetails?.Title}
            </a>
            </br>
            Task Category: ${TaskCategories}</br>
            Smart Priority: <b>${ItemDetails?.SmartPriority}</b></br>
            </p>
            <p></p>
            <b>
            Thanks, </br>
            ${usedFor === "Status" ? `Task Management Team` : ""}
            </b>
            `
        }
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


// this is used for updating feedback JSON according to Task Approved and reject 

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


// This is used for updating the data on Backend Side 

export const UpdateItemDetails = (RequiredData: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const { UpdateDataJSON, ListId, ListSiteURL, ItemId, AllTaskUsersData, ItemDetails } = RequiredData || {};
        let assignedUserIds: any;
        let UpdatedData: any = null;
        let SendUpdatedData: any = {
            PercentComplete: "",
            TaskCategories: "",
            TeamMembers: "",
            AssignedTo: "",
            IsTodaysTask: "",
            CompletedDate: "",
            FeedBack: "",
            Status: ""
        }
        let query = "Id,Title,FeedBack,PriorityRank,Remark,Project/PriorityRank,Project/PortfolioStructureID,ParentTask/Id,ParentTask/Title,ParentTask/TaskID,TaskID,SmartInformation/Id,SmartInformation/Title,Project/Id,Project/Title,workingThisWeek,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,SiteCompositionSettings,Sitestagging,Priority,Status,ItemRank,IsTodaysTask,Body,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,TaskType/Level,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title&$expand=AssignedTo,Project,ParentTask,SmartInformation,Author,Portfolio,Editor,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory"
        try {
            const web = new Web(ListSiteURL);
            const updatedItem: any = await web.lists
                .getById(ListId)
                .items.getById(ItemId)
                .update(UpdateDataJSON);
            UpdatedData = await updatedItem.item.select(query).get();
            console.log(`Item Details Updated Successfully for ${ItemId}`);
            ItemDetails.TeamLeaderUser = [];
            ItemDetails.AllTeamName = "";
            if (UpdatedData?.TeamMembers?.length > 0) {
                assignedUserIds = UpdatedData?.TeamMembers?.map((user: any) => user.Id);
                SendUpdatedData.TeamMembers = AllTaskUsersData.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
                ItemDetails.TeamMembers = AllTaskUsersData.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
                ItemDetails.TeamLeaderUser = ItemDetails.TeamLeaderUser.concat(ItemDetails?.TeamMembers)
            }
            if (UpdatedData?.AssignedTo?.length > 0) {
                assignedUserIds = UpdatedData?.AssignedTo?.map((user: any) => user.Id);
                SendUpdatedData.AssignedTo = AllTaskUsersData.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
                ItemDetails.AssignedTo = AllTaskUsersData.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
                ItemDetails.TeamLeaderUser = ItemDetails.TeamLeaderUser.concat(ItemDetails?.AssignedTo);
            }
            if (UpdatedData?.ResponsibleTeam?.length > 0) {
                assignedUserIds = UpdatedData?.ResponsibleTeam?.map((user: any) => user.Id);
                SendUpdatedData.ResponsibleTeam = AllTaskUsersData.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
                ItemDetails.ResponsibleTeam = AllTaskUsersData.filter((userItem: any) => assignedUserIds?.includes(userItem.AssingedToUserId));
                ItemDetails.TeamLeaderUser = ItemDetails.TeamLeaderUser.concat(ItemDetails?.ResponsibleTeam);
            }
            if (ItemDetails?.TeamLeaderUser?.length > 0) {
                ItemDetails?.TeamLeaderUser?.map((users: any) => {
                    ItemDetails.AllTeamName += users.Title + ";";
                });
            }
            if (UpdatedData.PercentComplete != undefined && UpdatedData.PercentComplete != null) {
                SendUpdatedData.PercentComplete = UpdatedData.PercentComplete * 100;
                ItemDetails.PercentComplete = UpdatedData.PercentComplete * 100;
            }
            ItemDetails.descriptionsSearch = GlobalCommon.descriptionSearchData(UpdatedData);
            ItemDetails.FeedBack = UpdatedData.FeedBack;
            ItemDetails.TaskCategories = UpdatedData.TaskCategories;
            ItemDetails.IsTodaysTask = UpdatedData.IsTodaysTask;
            ItemDetails.CompletedDate = UpdatedData.CompletedDate;
            ItemDetails.Status = UpdatedData.Status;
            ItemDetails.TaskTypeValue = UpdatedData?.TaskCategories?.map((val: any) => val.Title).join(",");
            resolve(ItemDetails);
        } catch (error) {
            console.log("Error in update Item Details Function", error.message);
            reject(error);
        }
    });
};


// this is used for sending Email Notification for Approval Category Task on the basis of Status change 

export const SendApprovalEmailNotificationComponent = (props: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let TaskStatus = '';
            const { ItemDetails, AskForApproval, TaskIsApproved, CurrentUser, Context, ReceiverEmail, usedFor } = props || {};
            if (usedFor == "Approval") {
                if (props?.AskForApproval === true) {
                    TaskStatus = "Approval"
                } else if (props?.TaskIsApproved === true) {
                    TaskStatus = "Approved"
                } else if (props?.AskForApproval === false) {
                    TaskStatus = "Rejected"
                }
            } else {
                TaskStatus = `Task Status Is Updated ${ItemDetails.PercentComplete} for `
            }
            if (ItemDetails?.FeedBack?.length > 0) {
                let FeedItemData: any = JSON.parse(ItemDetails?.FeedBack);
                ItemDetails.FeedBackJSON = FeedItemData;
            }
            let EmailMessage: any = '';
            if (usedFor == "Approval") {
                EmailMessage = SendApprovalEmailNotificationBodyContent({ items: ItemDetails, AskForApproval, TaskIsApproved, CurrentUser });
            } else {
                EmailMessage = SendEmailAndImmediateTaskNotificationBodyContent(ItemDetails);
            }
            const containerDiv = document.createElement('div');
            const reactElement = React.createElement(EmailMessage?.type, EmailMessage?.props);
            ReactDOM.render(reactElement, containerDiv);
            const FinalMSG = "<style>p>br {display: none;}</style>" + containerDiv.innerHTML;
            const EmailProps = {
                To: ReceiverEmail,
                Subject: "[ " + ItemDetails?.siteType + " - " + TaskStatus + " ]" + ItemDetails?.Title,
                Body: ItemDetails?.Title
            };
            if (ReceiverEmail?.length > 0) {
                const sp = spfi().using(spSPFx(Context));
                const data = sp.utility.sendEmail({
                    Body: FinalMSG,
                    Subject: EmailProps.Subject,
                    To: EmailProps.To,
                    AdditionalHeaders: {
                        "content-type": "text/html"
                    },
                }).then((res: any) => {
                    console.log("Email Sent!");
                    console.log(data);
                }).catch((error: any) => {
                    console.log("Error", error.message)
                })
                resolve(data);
            } else {
                reject("Receiver email not provided");
            }
        } catch (error) {
            reject(error); // Reject the promise if any error occurs
        }
    });
};

const joinObjectValues = (arr: any) => {
    let val = '';
    arr.forEach((element: any) => {
        val += element.Title + ';'
    });
    return val;
}

// This function is used for generating the required HTML structure to handle different scenarios, such as sending email notifications for tasks that are created, approved, or rejected

export const SendApprovalEmailNotificationBodyContent = (props: any) => {

    return (
        <div id='htmlMailBodyEmail' style={{ display: 'none' }}>
            <div style={{ marginTop: "2pt" }}>
                {props.AskForApproval != undefined && props.AskForApproval === true ?
                    <div>
                        {props?.items?.Approvee != undefined && props?.items?.Approvee?.Title != props?.items?.Author?.Title ?
                            <>
                                {props?.items?.Author?.Title} has created a Task but {props?.CurrentUser[0]?.Title}  has sent you for approval. Please take your time and review:
                                Please note that you still have 1 tasks left to approve.<br /> You can find all pending approval tasks on your task dashboard or the approval page.
                            </> : <>{props?.items?.Author?.Title} has created a Task which requires your Approval. Please take your time and review:
                                Please note that you still have 1 tasks left to approve.<br /> You can find all pending approval tasks on your task dashboard or the approval page.
                            </>}
                        <p>
                            <div style={{ marginTop: "5pt" }}>Have a nice day, Thank You!</div>
                            <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props.items.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props.items["Title"]}</a>&nbsp;&nbsp;
                            <a href={`${props.items["siteUrl"]}/SitePages/TaskDashboard.aspx`} target="_blank" data-interception="off">Your Task Dashboard</a>
                            <a style={{ marginLeft: "20px" }} href={`${props.items["siteUrl"]}/SitePages/TaskManagement.aspx?SmartfavoriteId=101&smartfavorite=All%20Approval%20Tasks`} target="_blank" data-interception="off">Your Approval Page</a>
                        </p>
                    </div>
                    :
                    null
                }
                {props.TaskIsApproved != undefined && (props.TaskIsApproved == true || props.TaskIsApproved == false) ?
                    <div style={{ marginTop: "11.25pt" }}>
                        <div style={{ marginTop: "2pt" }}>Hi,</div>
                        <div style={{ marginTop: "5pt" }}>your task has been {props?.TaskIsApproved == true ? "approved" : "rejected"} by {props.CurrentUser[0]?.Title}, Please follow the below task link to have look..</div>
                        <div style={{ marginTop: "5pt" }}>Have a nice day, Thank You!.</div>
                        <div style={{ marginTop: "10pt" }}>
                            <a href={`${props.items["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${props.items.Id}&Site=${props?.items?.siteType}`} target="_blank" data-interception="off">{props.items["Title"]}</a><u></u><u></u>
                        </div>
                    </div>
                    : null
                }
            </div>
            <table cellPadding="0" width="100%" style={{ width: "100.0%" }}>
                <tbody>
                    <tr>
                        <td width="70%" valign="top" style={{ width: '70.0%', padding: '4px' }}>
                            <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: "4px" }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Task Id:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{props.items?.TaskId}</span><u></u><u></u></p>
                                        </td>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Component:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p>{props.items["Component"] != null &&
                                                props.items["Component"].length > 0 &&
                                                <span style={{ fontSize: '10.0pt', color: '#333' }}>
                                                    {joinObjectValues(props.items["Component"])}
                                                </span>
                                            }
                                                <span style={{ color: "black" }}> </span><u></u><u></u></p>
                                        </td>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Priority:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{props.items["Priority"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Start Date:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{props.items["StartDate"] != null && props.items["StartDate"] != undefined ? Moment(props.items["StartDate"]).format("DD-MMMM-YYYY") : ""}</span><u></u><u></u></p>
                                        </td>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Completion Date:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{props.items["CompletedDate"] != null && props.items["CompletedDate"] != undefined ? Moment(props.items["CompletedDate"]).format("DD-MMMM-YYYY") : ""}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                                        </td>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Due Date:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{props.items["DueDate"] != null && props.items["DueDate"] != undefined ? Moment(props.items["DueDate"]).format("DD-MMMM-YYYY") : ''}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Team Members:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p>{props.items["TeamMembers"] != null &&
                                                props.items["TeamMembers"].length > 0 &&
                                                <span style={{ fontSize: '10.0pt', color: '#333' }}>
                                                    {joinObjectValues(props.items["TeamMembers"])}
                                                </span>
                                            }
                                                <span style={{ color: "black" }}> </span><u></u><u></u></p>
                                        </td>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Created:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{Moment(props.items["Created"]).format("DD-MMMM-YYYY")}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                                        </td>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Created By:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{props.items["Author"] != null && props.items["Author"] != undefined && props.items["Author"].Title}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Categories:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{props.items["Categories"]}</span><u></u><u></u></p>
                                        </td>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>Status:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            {props.statusUpdateMailSendStatus != undefined && props.statusUpdateMailSendStatus == false ?
                                                <>
                                                    {props.CreatedApprovalTask ?
                                                        <p><span style={{ fontSize: '10.0pt', color: '#333' }}>For Approval</span><span style={{ color: "black" }}> </span><u></u><u></u></p> :
                                                        <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{props.ApprovalTaskStatus ? "Approved" : "Follow up"}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                                                    }
                                                </> : <p><span style={{ fontSize: '10.0pt', color: '#333' }}>Acknowledged</span><span style={{ color: "black" }}> </span><u></u><u></u></p>}

                                        </td>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>% Complete:</span></b><u></u><u></u></p>
                                        </td>
                                        <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            {props.statusUpdateMailSendStatus != undefined && props.statusUpdateMailSendStatus == false ?
                                                <>
                                                    {props.CreatedApprovalTask ?
                                                        <p><span style={{ fontSize: '10.0pt', color: '#333' }}>1%</span><span style={{ color: "black" }}> </span><u></u><u></u></p> :
                                                        <p><span style={{ fontSize: '10.0pt', color: '#333' }}>{props.ApprovalTaskStatus ? 3 : 2}%</span><span style={{ color: "black" }}> </span><u></u><u></u></p>}
                                                </> : <p><span style={{ fontSize: '10.0pt', color: '#333' }}>5%</span><span style={{ color: "black" }}> </span><u></u><u></u></p>}

                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '4px' }}>
                                            <p><b><span style={{ fontSize: '10.0pt', color: '#333' }}>URL:</span></b><span style={{ color: "black" }}> </span><u></u><u></u></p>
                                        </td>
                                        <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '4px' }}>
                                            <p><span style={{ fontSize: '10.0pt', color: '#333' }}>
                                                {props.items["ComponentLink"] != null &&
                                                    <a href={props.items["ComponentLink"].Url} target="_blank">{props.items["ComponentLink"].Url}</a>
                                                }</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                                        </td>
                                        <td style={{ padding: '4px' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '4px' }}></td>
                                        <td style={{ padding: '4px' }}></td>
                                        <td style={{ padding: '4px' }}></td>
                                        <td style={{ padding: '4px' }}></td>
                                        <td style={{ padding: '4px' }}></td>
                                        <td style={{ padding: '4px' }}></td>
                                        <td style={{ padding: '4px' }}></td>
                                        <td style={{ padding: '4px' }}></td>
                                        <td style={{ padding: '4px' }}></td>
                                    </tr>
                                    <tr>
                                        <td width="91" style={{ border: "none" }}></td>
                                        <td width="46" style={{ border: "none" }}></td>
                                        <td width="46" style={{ border: "none" }}></td>
                                        <td width="100" style={{ border: "none" }}></td>
                                        <td width="53" style={{ border: "none" }}></td>
                                        <td width="51" style={{ border: "none" }}></td>
                                        <td width="74" style={{ border: "none" }}></td>
                                        <td width="32" style={{ border: "none" }}></td>
                                        <td width="33" style={{ border: "none" }}></td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellPadding="0" width="100%" style={{ width: "100.0%" }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '4px' }}></td>
                                    </tr>
                                    {props.items["FeedBackJSON"] != null &&
                                        props.items["FeedBackJSON"][0]?.FeedBackDescriptions?.length > 0 &&
                                        props.items["FeedBackJSON"][0]?.FeedBackDescriptions[0].Title != '' &&
                                        props.items["FeedBackJSON"][0]?.FeedBackDescriptions.map((fbData: any, i: any) => {
                                            return <>
                                                <tr>
                                                    <td width="30px" align="center" style={{ border: "1px solid rgb(204, 204, 204)" }}>
                                                        <span style={{ fontSize: "10pt", color: "rgb(111, 111, 111)" }}>
                                                            <span>{i + 1}</span> <br />
                                                            <span>
                                                                {fbData?.isShowLight === "Maybe" || fbData?.isShowLight === "Reject" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />
                                                                </svg> : null
                                                                }
                                                                {fbData?.isShowLight === "Approve" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                                                </svg> : null
                                                                }
                                                            </span>
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "0px 2px 0px 10px", border: "1px solid #ccc" }}><span dangerouslySetInnerHTML={{ __html: fbData['Title'] }}></span>
                                                        {fbData['Comments'] != null && fbData['Comments'].length > 0 && fbData['Comments'].map((fbComment: any) => {
                                                            return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                                                <div style={{ marginBottom: '3.75pt' }}>
                                                                    <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span>{fbComment.AuthorName} - {fbComment.Created}<u></u><u></u></span></p>
                                                                </div>
                                                                <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span><span dangerouslySetInnerHTML={{ __html: fbComment['Title'] }}></span><u></u><u></u></span></p>
                                                            </div>
                                                        })}
                                                    </td>
                                                </tr>
                                                {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext'].map((fbSubData: any, j: any) => {
                                                    return <>
                                                        <tr>
                                                            <td width="30px" align="center" style={{ border: "1px solid rgb(204, 204, 204)" }}>
                                                                <span style={{ fontSize: "10pt", color: "rgb(111, 111, 111)" }}>
                                                                    <span>{i + 1}.{j + 1}</span> <br />
                                                                    <span>
                                                                        {fbSubData?.isShowLight === "Maybe" || fbSubData?.isShowLight === "Reject" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" fill="none">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M23.2312 6.9798C19.3953 10.8187 16.1662 13.9596 16.0553 13.9596C15.9445 13.9596 12.7598 10.8632 8.9783 7.0787C5.1967 3.2942 1.96283 0.19785 1.79199 0.19785C1.40405 0.19785 0.20673 1.41088 0.20673 1.80398C0.20673 1.96394 3.3017 5.1902 7.0844 8.9734C10.8672 12.7567 13.9621 15.9419 13.9621 16.0516C13.9621 16.1612 10.8207 19.3951 6.9812 23.2374L0 30.2237L0.90447 31.1119L1.80893 32L8.8822 24.9255L15.9556 17.851L22.9838 24.8802C26.8495 28.7464 30.1055 31.9096 30.2198 31.9096C30.4742 31.9096 31.9039 30.4689 31.9039 30.2126C31.9039 30.1111 28.7428 26.8607 24.8791 22.9897L17.8543 15.9512L24.9271 8.8731L32 1.79501L31.1029 0.8975L30.2056 0L23.2312 6.9798Z" fill="#DC0018" />
                                                                        </svg> : null
                                                                        }
                                                                        {fbSubData?.isShowLight === "Approve" ? <svg style={{ margin: "3px" }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 34 24" fill="none">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8306 10.1337L11.6035 20.2676L6.7671 15.4784C4.1069 12.8444 1.83537 10.6893 1.71894 10.6893C1.45515 10.6893 0 12.1487 0 12.4136C0 12.5205 2.58808 15.1712 5.7512 18.304L11.5023 24L22.7511 12.8526L34 1.7051L33.1233 0.8525C32.6411 0.3836 32.2041 0 32.1522 0C32.1003 0 27.4556 4.5601 21.8306 10.1337Z" fill="#3BAD06" />
                                                                        </svg> : null
                                                                        }
                                                                    </span>
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: "0px 2px 0px 10px", border: "1px solid #ccc" }}
                                                            ><span dangerouslySetInnerHTML={{ __html: fbSubData['Title'] }}></span>
                                                                {fbSubData['Comments'] != null && fbSubData['Comments']?.length > 0 && fbSubData['Comments']?.map((fbSubComment: any) => {
                                                                    return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                                                        <div style={{ marginBottom: '3.75pt' }}>
                                                                            <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: '#333' }}>{fbSubComment.AuthorName} - {fbSubComment.Created}<u></u><u></u></span></p>
                                                                        </div>
                                                                        <p style={{ marginLeft: '15px', background: '#fbfbfb' }}><span style={{ fontSize: '10.0pt', color: '#333' }}><span dangerouslySetInnerHTML={{ __html: fbSubComment['Title'] }}></span><u></u><u></u></span></p>
                                                                    </div>
                                                                })}
                                                            </td>
                                                        </tr>
                                                    </>
                                                })}
                                            </>
                                        })}
                                </tbody>
                            </table>
                        </td>
                        <td width="22%" style={{ width: '22.0%', padding: '4px' }}>
                            <table className='table table-striped ' cellPadding={0} width="100%" style={{ width: '100.0%', border: 'solid #dddddd 1.0pt', borderRadius: '4px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ border: 'none', borderBottom: 'solid #dddddd 1.0pt', background: 'whitesmoke', padding: '4px' }}>
                                            <p style={{ marginBottom: '1.25pt' }}><span>Comments:<u></u><u></u></span></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: 'none', padding: '4px' }}>
                                            {props?.items["Comments"] != undefined && props?.items["Comments"]?.length > 0 && props.items["Comments"]?.map((cmtData: any, i: any) => {
                                                return <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                                                    <div style={{ marginBottom: "3.75pt" }}>
                                                        <p style={{ marginBottom: '1.25pt' }}>
                                                            <span style={{ color: '#333', background: '#fbfbfb' }}>{cmtData.AuthorName} - {cmtData.Created}</span></p>
                                                    </div>
                                                    <p style={{ marginBottom: '1.25pt', background: '#fbfbfb' }}>
                                                        <span style={{ color: '#333' }}>{cmtData.Description}</span></p>
                                                </div>
                                            })}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

// This function is used for generating the required HTML structure to handle different scenarios, such as sending email notifications for Email Notification and Immediate Task Category

export const SendEmailAndImmediateTaskNotificationBodyContent = (props: any) => {
    return (
        <div id='htmlMailBodyEmail' style={{ display: 'none' }}>
            <div style={{ backgroundColor: "#FAFAFA" }}>
                <div style={{ width: "900px", backgroundColor: "#fff", padding: "0px 32px", margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", padding: "56px 0px" }}>
                        <img src={props?.siteIcon} style={{ width: "48px", height: "48px", borderRadius: "50%" }}></img>
                        <div style={{ color: "var(--black, #333)", textAlign: "center", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", marginLeft: "4px" }}></div>
                    </div>
                    <div style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
                        Hi {props?.Author?.Title},
                    </div>
                    <div style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
                        Task created from your end has been marked to {props?.PercentComplete}%. Please follow the below link to review it.
                    </div>
                    <div style={{ marginBottom: "32px", fontSize: "16px", fontWeight: "400", fontFamily: "Segoe UI" }}>
                        You can track your Task Status here:
                    </div>
                    <div style={{ marginBottom: "40px" }}>
                        <div style={{
                            display: "flex", padding: "8px", justifyContent: "center", alignItems: 'center', gap: "8px", flexShrink: "0", color: "#FFF", borderRadius: "4px",
                            background: " #2F5596", width: "260px", height: "40px", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", lineHeight: "normal"
                        }}> <a style={{ color: "#fff", textDecorationLine: "underline" }} data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                            href={`${props.siteUrl}/SitePages/Task-Profile.aspx?taskId=` + props?.items?.Id + '&Site=' + props?.items?.siteType}
                        >Track the Task Status</a>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", marginBottom: "56px" }}>
                        <div style={{ color: "var(--black, #333)", textAlign: "center", fontFamily: "Segoe UI", fontSize: "14px", fontStyle: "normal", fontWeight: "600", marginLeft: "4px" }}>Thanks</div>
                    </div>
                </div>
            </div>
        </div>
    )
}


// This is used for Perform all the changes when any one tag portfolio in Task 

export const onPortfolioTaggingAllChanges = (RequiredData: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { ItemDetails, RequiredListIds, TaskDetails } = RequiredData || {};
            const web = new Web(ItemDetails.siteUrl);
            let SmartMetaDataClientCategoryData: any = [];
            let ClientCategoryDBData: any = [];
            let SitesTaggingData: any = [];
            let ClientCategoryData: any = [];
            let IsCCTagged: Boolean = true;
            GetSmartMetaDataListAllItems({
                ListId: RequiredListIds?.SmartMetadataListID,
                ListSiteURL: ItemDetails.siteUrl,
                TaxType: ["Client Category"]
            }).then(async (ResData: any) => {
                SmartMetaDataClientCategoryData = ResData;
                ResData?.map((CategoryType: any) => {
                    if (CategoryType.hasOwnProperty("Client Category")) {
                        SmartMetaDataClientCategoryData = CategoryType["Client Category"];
                    }
                })
                await web.lists.getById(ItemDetails?.listId)
                    .items.getById(ItemDetails?.Id)
                    .select("SiteCompositionSettings,Sitestagging,ClientCategory/Id,ClientCategory/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,TeamMembers/Id,TeamMembers/Title")
                    .expand("ClientCategory, TeamMembers,ResponsibleTeam")
                    .get().then((responseData: any) => {
                        if (responseData?.Sitestagging?.length > 5) {
                            const SiteCompositionData = JSON.parse(responseData?.Sitestagging);
                            let SCDummyJSON: any = {
                                ClienTimeDescription: "100",
                                Title: TaskDetails?.siteType,
                                localSiteComposition: true,
                                SiteImages: TaskDetails?.SiteIcon,
                                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
                            }
                            if (TaskDetails?.siteType !== "shareweb") {
                                SitesTaggingData = [SCDummyJSON]
                            } else {
                                SitesTaggingData = SiteCompositionData;
                            }
                        }
                        if (SmartMetaDataClientCategoryData.length > 0) {
                            ClientCategoryDBData = SmartMetaDataClientCategoryData.filter((AllCCItem: any) =>
                                responseData?.ClientCategory?.some((TaggedCCItem: any) => TaggedCCItem.Id == AllCCItem.Id)
                            );
                            if (ClientCategoryDBData.length > 0) {
                                ClientCategoryData = (TaskDetails?.siteType !== "Shareweb") ?
                                    ClientCategoryDBData.filter((AllCCItem: any) => AllCCItem.siteName == TaskDetails?.siteType) :
                                    ClientCategoryDBData;
                            }
                        }
                        // Prepare the response data
                        const PreparedResponseData = {
                            Sitestagging: (SitesTaggingData?.length > 0) ? JSON.stringify(SitesTaggingData) : null,
                            SiteCompositionSettings: responseData?.SiteCompositionSettings,
                            ClientCategoryId: { results: getDataByKey(ClientCategoryData, "Id") },
                            ResponsibleTeamId: { results: getDataByKey(responseData?.ResponsibleTeam, "Id") },
                            TeamMembersId: { results: getDataByKey(responseData?.TeamMembers, "Id") },
                        };
                        resolve(PreparedResponseData);
                    }).catch((error) => {
                        console.log("error in call", error.message);
                        reject(error);
                    })
            }).catch((error) => {
                console.log("Error in Smart Meta Data Call", error.message)
            })

        } catch (error) {
            console.log("error in try block code", error.message);
            reject(error);
        }
    });
};

// This is used for the retrieve any property data from array of objects 

export const getDataByKey = (DataArray: any, keyName: any) => {
    if (DataArray?.length === 0 || DataArray === undefined) {
        return [];
    } else {
        return DataArray?.map((ItemData: any) => (keyName in ItemData ? ItemData[keyName] : undefined)).filter((value: any) => value !== undefined);
    }
}


// This is used for send MS Teams Notification for Bottleneck and Attention Category Tasks 

// export const SendMSTeamsNotificationForWorkingActions = (RequiredData: any) => {
//     return new Promise(async (resolve, reject) => {
//         const { ReceiverName, sendUserEmail, Context, ActionType, ReasonStatement, UpdatedDataObject } = RequiredData || {};
//         let TaskInformation: any = GenerateMSTeamsNotification(UpdatedDataObject);
//         const containerDiv = document.createElement('div');
//         const reactElement = React.createElement(TaskInformation?.type, TaskInformation?.props);
//         ReactDOM.render(reactElement, containerDiv);
//         let finalTaskInfo: any = containerDiv.innerHTML;
//         let TeamsMessage = `<b>Hi ${ReceiverName},</b> 
//         <p></p>
//         You have been tagged as <b>${ActionType}</b> in the below task.
//         <p>
//         <br/>
//          <span>${ReasonStatement ? "<b>" + ActionType + " Point : </b>" + ReasonStatement + " <p></p>" : ''}</span>
//         <b>Task Details : </b> <span>${finalTaskInfo}</span>
//         </br>
//         <p>
//         Task Link:  
//         <a href=${UpdatedDataObject?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + UpdatedDataObject.Id + "&Site=" + UpdatedDataObject.siteType}>
//          Click-Here
//         </a>
//         <p></p>
//         <b>
//         Thanks, </br>
//         Task Management Team
//         </b>`;

//         if (sendUserEmail?.length > 0) {
//             await GlobalCommon.SendTeamMessage(
//                 sendUserEmail,
//                 TeamsMessage,
//                 Context
//             );
//         }
//     })

// }

export const SendMSTeamsNotificationForWorkingActions = async (RequiredData: any) => {
    try {
        const { ReceiverName, sendUserEmail, Context, ActionType, ReasonStatement, UpdatedDataObject } = RequiredData || {};
        const TaskInformation = "Short_x0020_Description_x0020_On" in   RequiredData.UpdatedDataObject?GenerateMSTeamsNotificationPoprtfolioAndProject(UpdatedDataObject):GenerateMSTeamsNotification(UpdatedDataObject);
        const containerDiv = document.createElement('div');
        const reactElement = React.createElement(TaskInformation?.type, TaskInformation?.props);
        ReactDOM.render(reactElement, containerDiv);
        let finalTaskInfo: any = containerDiv.innerHTML;
        let NotificationTypeMessage: string = '';
        let isShowComment: any = false;

        if (ActionType == "Bottleneck" || ActionType == "Attention") {
            NotificationTypeMessage = `You have been tagged as <b>${ActionType}</b> in the below task.`;
            isShowComment = true;
        }
       else if (RequiredData?.UpdatedDataObject?.PercentComplete == 90) {
            NotificationTypeMessage = `This task has 90%. Kindly review it.`;
            isShowComment = false;
        }
        else if (RequiredData?.UpdatedDataObject?.PercentComplete == 0 && ActionType.indexOf('User Experience - UX') != -1) {
            NotificationTypeMessage = `Below task has been created by the UX team, please have a look.`;
            isShowComment = false;
        }
        else {
            NotificationTypeMessage = `Task created from your end as ${ActionType} category Task status has been set as ${UpdatedDataObject.PercentComplete + "%"}. Please take necessary action`;
            isShowComment = false;
        }


        
         const TeamsMessage = `
            <b>Hi ${ReceiverName},</b>
            <p></p>
           ${NotificationTypeMessage}
            <p><br/></p>
            ${isShowComment ? `<span><b>${ActionType} Comment </b>: <span style="background-color: yellow"; >${ReasonStatement}</span></span>` : ''}
            <p></p>
            <span>${finalTaskInfo}</span>
            <p></p>
            Task Link: <a href="${UpdatedDataObject?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${UpdatedDataObject.Id}&Site=${UpdatedDataObject.siteType}">Click here</a>
            <p></p>
            <b>Thanks,<br/>Task Management Team</b>
        `;
        
        if (sendUserEmail?.length > 0) {
            await GlobalCommon.SendTeamMessage(sendUserEmail, TeamsMessage, Context);
        }
        return 'Notification sent successfully';
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};


export const MSTeamsReminderMessage = (RequiredData: any) => {
    return new Promise(async (resolve, reject) => {
        const { ReceiverName, sendUserEmail, Context, ActionType, ReasonStatement, UpdatedDataObject } = RequiredData || {};
        let TeamsMessage = `<b>Hi ${ReceiverName},</b> 
        <p></p>
        This is a gentle reminder to address the below task promptly, as you've been marked as ${ActionType}:
        <p>
        <br/>
        <span><b>${ActionType} Comment </b>: <span style="background-color: yellow"; >${ReasonStatement? ReasonStatement:""}</span></span>
        </br>
        <p>
        Task Link:  
        <a href=${UpdatedDataObject?.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + UpdatedDataObject.Id + "&Site=" + UpdatedDataObject.siteType}>
         Click here
        </a>
        <p></p>
        <b>
        Regards, </br>
        Task Management Team
        </b>`
        if (sendUserEmail?.length > 0) {
            await GlobalCommon.SendTeamMessage(
                sendUserEmail,
                TeamsMessage,
                Context
            );
        }
    })
}

export const GenerateMSTeamsNotification = (RequiredData: any) => {
    try {
        if (RequiredData?.Title?.length > 0) {
            return (
                <div style={{backgroundColor:'#f5f5f5', display:'flex'}}>
                    
                    <div style={RequiredData?.CommentsArray?.length > 0?{width:'528px', marginRight:'8px'}:{ }}>
                        <div style={{fontSize:'16px', fontWeight:'600', marginBottom:'8px'}}>Task Details:</div>
                        <div style={{width:'100%', display:'flex', justifyContent: 'flex-start', marginBottom:'8px'}}>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Task Id:</span>
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}> 
                                <span style={{ fontSize: '10.0pt'}}>{RequiredData?.TaskId}</span>
                            </div>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Component:</span>
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                {RequiredData["Portfolio"] != null &&
                                    <span style={{ fontSize: '10.0pt'}}>
                                        {RequiredData["Portfolio"]?.Title}
                                    </span>
                                }     
                            </div>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Priority:</span>
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt' }}>{RequiredData["Priority"]}</span>
                            </div>
                        </div>
                        <div style={{width:'100%', display:'flex', marginBottom:'8px', justifyContent: 'flex-start'}}>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Start Date:</span>
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt' }}>{RequiredData["StartDate"] != null && RequiredData["StartDate"] != undefined && RequiredData["StartDate"] != "" ? Moment(RequiredData["StartDate"]).format("DD-MMMM-YYYY") : ""}</span>
                            </div>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Completion Date:</span>
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt'}}>{RequiredData["CompletedDate"] != null && RequiredData["CompletedDate"] != undefined && RequiredData["CompletedDate"] != "" ? Moment(RequiredData["CompletedDate"]).format("DD-MMMM-YYYY") : ""}</span>
                            </div>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Due Date:</span>
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt' }}>{RequiredData["DueDate"] != null && RequiredData["DueDate"] != undefined && RequiredData["DueDate"] != "" ? Moment(RequiredData["DueDate"]).format("DD-MMMM-YYYY") : ''}</span>
                            </div>
                        </div>
                        <div style={{width:'100%', display:'flex', marginBottom:'8px', justifyContent: 'flex-start'}}>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Team Members:</span>
                            </div>
                            <div style={{width:'120px', padding: '5px', display: 'flex', alignItems: 'center'}}>
                                <div style={{wordBreak: "break-all"}}>{RequiredData["TeamMembers"] != null &&
                                    RequiredData["TeamMembers"].length > 0 &&
                                    <span style={{ fontSize: '10.0pt' }}>
                                        {joinObjectValues(RequiredData["TeamMembers"])}
                                    </span>
                                }
                                    </div>
                            </div>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Created:</span>
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt' }}>{Moment(RequiredData["Created"]).format("DD-MMMM-YYYY")}</span>
                            </div>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Created By:</span>
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt'}}>{RequiredData["Author"] != null && RequiredData["Author"] != undefined && RequiredData["Author"].Title}</span>
                            </div>
                        </div>
                        <div style={{width:'100%', display:'flex', marginBottom:'8px', justifyContent: 'flex-start'}}>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Categories:</span>
                            </div>
                            <div style={{width:'120px', padding: '5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '10.0pt' }}>{RequiredData["Categories"]}</span>
                            </div>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Status:</span>
                            </div>
                            <div style={{width:'120px', padding: '5px', display: 'flex', alignItems: 'center' }}>
                                {RequiredData["Status"]}
                            </div>
                            <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>% Complete:</span>
                            </div>
                            <div style={{width:'120px', padding: '5px', display: 'flex', alignItems: 'center' }}>
                                {RequiredData["PercentComplete"]}
                            </div>
                        </div>
                        
                        <div style={{width:'100%', display:'flex', marginBottom:'8px', justifyContent: 'flex-start'}}>
                            <div style={RequiredData?.CommentsArray?.length > 0?{width:'86px', background: '#fff', padding:'5px', display: 'flex', alignItems: 'center'}:{ width:'120px',  background: '#fff', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Smart Priority:</span>
                            </div>
                            <div style={{padding: '5px', display: 'flex', alignItems: 'center'}}>
                                {RequiredData["SmartPriority"]}
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                &nbsp;
                            </div>
                            <div style={{padding: '5px', display: 'flex', alignItems: 'center'}}>
                                &nbsp;
                            </div>
                            <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                &nbsp;
                            </div>
                            <div style={{padding: '5px', display: 'flex', alignItems: 'center'}}>
                                 &nbsp;
                            </div>
                        </div>
                        <div style={{width:'100%', display:'flex', justifyContent: 'flex-start'}}>
                            <div style={{ background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>URL:</span>
                            </div>
                            <div style={{ wordBreak: "break-all", padding: '5px', display: 'flex', alignItems: 'center'}}>
                                <span style={{ fontSize: '10.0pt'}}>
                                {RequiredData["ComponentLink"] != null &&
                                    <a href={RequiredData["ComponentLink"].Url} target="_blank">{RequiredData["ComponentLink"].Url}</a>
                                }</span>
                            </div>
                        </div>

                        {RequiredData["FeedBack"] != null &&
                            RequiredData["FeedBack"][0]?.FeedBackDescriptions?.length > 0 &&
                            RequiredData["FeedBack"][0]?.FeedBackDescriptions[0].Title?.length > 8 ?
                            <div style={{ width: "100%" }}>
                                <div style={{fontSize:'16px', fontWeight:'600', marginBottom:'8px', marginTop:'24px'}}>Task Description:</div>
                                <div>
                                    {RequiredData["FeedBack"] != null &&
                                        RequiredData["FeedBack"][0]?.FeedBackDescriptions?.length > 0 &&
                                        RequiredData["FeedBack"][0]?.FeedBackDescriptions[0].Title != '' &&
                                        RequiredData["FeedBack"][0]?.FeedBackDescriptions.map((fbData: any, i: any) => {
                                            return (<>
                                                <div style={{width:'100%', display:'flex', marginBottom:'8px', padding:'16px 12px', backgroundColor:'#fff'}}>
                                                    {/* <div style={{width:'3%'}}>
                                                        <span style={{ fontSize: "10pt", color: "#333", marginRight:'5px' }}>
                                                            {i + 1}.
                                                        </span>
                                                    </div> */}
                                                    <div style={{width:'100%'}}>
                                                        <div style={{display:'flex'}}>
                                                            <span style={{ fontSize: "10pt", color: "#333", marginRight:'5px', fontWeight:'600' }}>
                                                            {i + 1}.
                                                        </span>
                                                        <span dangerouslySetInnerHTML={{ __html: fbData['Title'] }}></span></div>
                                                        
                                                        {fbData['Comments'] != null && fbData['Comments'].length > 0 && fbData['Comments'].map((fbComment: any) => {
                                                            return <div style={{ padding: '12px', backgroundColor:'#f5f5f5', marginTop:'8px', width:'100%' }}>
                                                                <div style={{ marginBottom: '8px' }}>
                                                                    <div style={{fontWeight:'600'}}>{fbComment.AuthorName} - {fbComment.Created}</div>
                                                                </div>
                                                                <div><span dangerouslySetInnerHTML={{ __html: fbComment['Title'] }}></span></div>
                                                            
                                                                {fbComment?. ReplyMessages?.length>0 && fbComment?.ReplyMessages?.map((replycom:any)=>{
                                                                return(
                                                                    <div style={{padding: '12px', backgroundColor: '#ffffff', width:'100%' }}>
                                                                        <div style={{ marginBottom: '8px' }}>
                                                                            <div style={{fontWeight:'600' }}><span>{replycom.AuthorName} - {replycom.Created}</span></div>
                                                                        </div>
                                                                        <div><span dangerouslySetInnerHTML={{ __html: replycom['Title'] }}></span></div>
                                                                    </div>   
                                                                )
                                                                })}
                                                            
                                                            </div>
                                                        })}
                                                    </div>
                                                </div>
                                                {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext'].map((fbSubData: any, j: any) => {
                                                    return <>
                                                        <div style={{width:'100%', display:'flex', marginBottom:'8px', padding:'16px 12px', backgroundColor:'#fff'}}>
                                                            {/* <div style={{width:'5%'}}>
                                                                <span style={{ fontSize: "10pt", color: "#333", marginRight:'5px' }}>{i + 1}.{j + 1}.</span> 
                                                            </div> */}
                                                            <div style={{width:'100%'}}>
                                                                <span style={{ fontSize: "10pt", color: "#333", marginRight:'5px', fontWeight:'600' }}>{i + 1}.{j + 1}.</span> 
                                                                <span dangerouslySetInnerHTML={{ __html: fbSubData['Title'] }}></span>
                                                                {fbSubData['Comments'] != null && fbSubData['Comments']?.length > 0 && fbSubData['Comments']?.map((fbSubComment: any) => {
                                                                    return <div style={{ padding: '12px', backgroundColor:'#f5f5f5', marginTop:'8px' }}>
                                                                        <div style={{ marginBottom: '8px'}}>
                                                                           <span style={{ fontSize: '10.0pt', fontWeight:'600' }}>{fbSubComment.AuthorName} - {fbSubComment.Created}</span>
                                                                        </div>
                                                                        <div><span dangerouslySetInnerHTML={{ __html: fbSubComment['Title'] }}></span></div>
                                                                {fbSubComment?. ReplyMessages?.length>0 && fbSubComment?.ReplyMessages?.map((replycom:any)=>{
                                                                return(
                                                                    <div style={{padding: '12px', backgroundColor:'#ffffff' }}>
                                                                        <div style={{ marginBottom: '8px' }}>
                                                                            <div style={{fontWeight:'600'}}>{replycom.AuthorName} - {replycom.Created}</div>
                                                                        </div>
                                                                        <div><span dangerouslySetInnerHTML={{ __html: replycom['Title'] }}></span></div>
                                                                    </div>   
                                                                )
                                                                })}
                                                                    </div>
                                                                })}
                                                            </div>
                                                        </div>
                                                    </>
                                                })}
                                            </>)
                                        })}
                                </div>
                            </div>
                            :
                            null
                        }
                    </div>
                    {RequiredData?.CommentsArray?.length > 0 ?
                        <div style={{ width: '232px' }}>
                            <div className="">
                                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                                    Comments ({RequiredData["CommentsArray"]?.length}):
                                </div>
                                <div style={{ width: '100%' }}>
                                    {RequiredData["CommentsArray"] != undefined && RequiredData["CommentsArray"]?.length > 0 && RequiredData["CommentsArray"]?.map((cmtData: any, i: any) => {
                                        if (i < 5) {
                                            return (
                                                <>
                                                    <div style={{ backgroundColor: '#fff', width: '100%', padding: '8px 12px', marginBottom: "8px" }}>
                                                        <div style={{ marginBottom: "8px", width: '100%' }}>
                                                            <div>
                                                                <span style={{ fontWeight: '600' }}>{cmtData.AuthorName}</span> - {cmtData.Created}
                                                            </div>
                                                            <div>
                                                                {cmtData.Description}
                                                            </div>
                                                        </div>
                                                        {cmtData?.ReplyMessages?.length > 0 && cmtData?.ReplyMessages?.map((replyData: any) => {
                                                            return (
                                                                <div style={{ backgroundColor: '#f5f5f5', padding: '8px 12px', width: '100%' }}>
                                                                    <div style={{ marginBottom: '8px' }}>
                                                                        <span style={{ fontWeight: '600' }}>{replyData.AuthorName}</span> - {replyData.Created}
                                                                    </div>
                                                                    <div>
                                                                        {replyData.Description}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}

                                                    </div>

                                                </>
                                            )
                                        }
                                    })}
                                </div>
                                {RequiredData?.CommentsArray?.length > 5 ? <span>For more go to Task: <a href={`${RequiredData?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${RequiredData?.ID}&Site=${RequiredData?.siteType}`}>
                                    Click-here</a> </span> : ""}
                            </div>
                        </div>
                        : null
                    }
                </div>
            )
        }
    } catch (error) {
        console.log("Error:", error.message)
    }

}
export const GenerateMSTeamsNotificationPoprtfolioAndProject = (RequiredData: any) => {
    try {
        if (RequiredData?.Title?.length > 0) {
            return (
                // <table cellPadding="0" width="100%" style={{ width: "100%" }}>
                //     <tbody>
                //         <tr>
                //             <td width="70%" valign="top" style={{ width: '70.0%', padding: '.75pt .75pt .75pt .75pt' }}>
                //                 <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                //                     <tbody>
                //                         <tr>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Id:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{RequiredData?.PortfolioStructureID}</span><u></u><u></u></p>
                //                             </td>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Parent:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p>{RequiredData["Parent"] != null &&
                //                                     <span style={{ fontSize: '10.0pt', color: 'black' }}>
                //                                         {RequiredData["Parent"]?.Title}
                //                                     </span>
                //                                 }
                //                                     <span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Priority:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{RequiredData["Priority"]}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                         </tr>
                //                         <tr>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Start Date:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{RequiredData["StartDate"] != null && RequiredData["StartDate"] != undefined && RequiredData["StartDate"] != "" ? Moment(RequiredData["StartDate"]).format("DD-MMMM-YYYY") : ""}</span><u></u><u></u></p>
                //                             </td>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Completion Date:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{RequiredData["CompletedDate"] != null && RequiredData["CompletedDate"] != undefined && RequiredData["CompletedDate"] != "" ? Moment(RequiredData["CompletedDate"]).format("DD-MMMM-YYYY") : ""}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Due Date:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{RequiredData["DueDate"] != null && RequiredData["DueDate"] != undefined && RequiredData["DueDate"] != "" ? Moment(RequiredData["DueDate"]).format("DD-MMMM-YYYY") : ''}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                         </tr>
                //                         <tr>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Team Members:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt', width:'130px' }}>
                //                                 <p style={{wordBreak: "break-all"}}>{RequiredData["TeamMembers"] != null &&
                //                                     RequiredData["TeamMembers"].length > 0 &&
                //                                     <span style={{ fontSize: '10.0pt', color: 'black' }}>
                //                                         {joinObjectValues(RequiredData["TeamMembers"])}
                //                                     </span>
                //                                 }
                //                                     <span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{Moment(RequiredData["Created"]).format("DD-MMMM-YYYY")}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Created By:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{RequiredData["Author"] != null && RequiredData["Author"] != undefined && RequiredData["Author"].Title}</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                         </tr>
                //                         <tr>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Categories:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><span style={{ fontSize: '10.0pt', color: 'black' }}>{RequiredData["Categories"]}</span><u></u><u></u></p>
                //                             </td>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Status:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 {RequiredData["PercentComplete"]}
                //                             </td>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Project:</span></b><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={2} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 {RequiredData["PercentComplete"]}
                //                             </td>
                //                         </tr>
                                        
                //                         <tr>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Feature Type:</span></b><span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 {RequiredData["SmartPriority"]}
                //                             </td>
                //                         </tr>
                //                     </tbody>
                //                 </table>
                //                 <table cellPadding="0" width="99%" style={{ width: "99.0%" }}>
                //                 <tr>
                //                             <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt', width:'100px' }}>
                //                                 <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>URL:</span></b><span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                             <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                 <p style={{ wordBreak: "break-all"}}><span style={{ fontSize: '10.0pt', color: 'black' }}>
                //                                     {RequiredData["ComponentLink"] != null &&
                //                                         <a href={RequiredData["ComponentLink"].Url} target="_blank">{RequiredData["ComponentLink"].Url}</a>
                //                                     }</span><span style={{ color: "black" }}> </span><u></u><u></u></p>
                //                             </td>
                //                         </tr>
                //                 </table>
                //                 {RequiredData["Short_x0020_Description_x0020_On"] != null ?
                //                             <table cellPadding="0" width="100%" style={{ width: "100.0%" }}>
                //                                 <tbody>
                //                                     <tr>
                //                                         <td style={{ border: 'solid #cccccc 1.0pt', background: '#f4f4f4', padding: '.75pt .75pt .75pt .75pt', width: '30%', verticalAlign: 'top' }}>
                //                                             <p><b><span style={{ fontSize: '10.0pt', color: 'black' }}>Short Description:</span></b></p>
                //                                         </td>
                //                                         <td colSpan={7} style={{ border: 'solid #cccccc 1.0pt', background: '#fafafa', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                             <p style={{ fontSize: '10.0pt', color: 'black', padding: '0px 2px 0px 10px', border: '1px solid #ccc', wordBreak: 'break-word' }}>
                //                                                 {RequiredData["Short_x0020_Description_x0020_On"]}
                //                                             </p>
                //                                         </td>
                //                                     </tr>
                //                                 </tbody>
                //                             </table>
                //                             :
                //                             null
                //                         }
                //             </td>
                //             {RequiredData?.CommentsArray?.length > 0 ?
                //                 <td width="22%" style={{ width: '22.0%', padding: '.75pt .75pt .75pt .75pt', background: 'whitesmoke' }}>
                //                     <table className='table table-striped ' cellPadding={0} width="100%" style={{ width: '100.0%', border: 'solid #dddddd 1.0pt', borderRadius: '4px', background: 'whitesmoke' }}>
                //                         <tbody>
                //                             <tr>
                //                                 <td style={{ border: 'none', borderBottom: 'solid #dddddd 1.0pt', background: '#fff', color: "#f333", padding: '.75pt .75pt .75pt .75pt' }}>
                //                                     <b style={{ marginBottom: '1.25pt' }}><span style={{ color: 'black' }}>Comments:<u></u><u></u></span></b>
                //                                 </td>
                //                             </tr>
                //                             <tr>
                //                                 <td style={{ border: 'none', padding: '.75pt .75pt .75pt .75pt' }}>
                //                                     {RequiredData["CommentsArray"] != undefined && RequiredData["CommentsArray"]?.length > 0 && RequiredData["CommentsArray"]?.map((cmtData: any, i: any) => {
                //                                         return (
                //                                             <>
                //                                                 <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt' }}>
                //                                                     <div style={{ marginBottom: "3.75pt" }}>
                //                                                         <p style={{ marginBottom: '1.25pt' }}>
                //                                                             <span style={{ color: 'black', background: '#fbfbfb' }}>{cmtData.AuthorName} - {cmtData.Created}</span></p>
                //                                                     </div>
                //                                                     <p style={{ marginBottom: '1.25pt', background: '#fbfbfb' }}>
                //                                                         <span style={{ color: 'black' }}>{cmtData.Description}</span></p>
                                                                
                //                                                 {cmtData?.ReplyMessages?.length > 0 && cmtData?.ReplyMessages?.map((replyData: any) => {
                //                                                     return (
                //                                                         <div style={{ border: 'solid #cccccc 1.0pt', padding: '7.0pt 7.0pt 7.0pt 7.0pt', marginTop: '3.75pt', marginLeft: '10pt' }}>
                //                                                             <div style={{ marginBottom: "3.75pt" }}>
                //                                                                 <p style={{ marginBottom: '1.25pt' }}>
                //                                                                     <span style={{ color: 'black', background: '#fbfbfb' }}>{replyData.AuthorName} - {replyData.Created}</span></p>
                //                                                             </div>
                //                                                             <p style={{ marginBottom: '1.25pt', background: '#fbfbfb' }}>
                //                                                                 <span style={{ color: 'black' }}>{replyData.Description}</span></p>
                //                                                         </div>
                //                                                     )
                //                                                 })}
                //                                                 </div>
                //                                             </>

                //                                         )

                //                                     })}
                //                                 </td>
                //                             </tr>
                //                         </tbody>
                //                     </table>
                //                 </td>
                //                 : null
                //             }
                //         </tr>
                //     </tbody>
                // </table>

<div style={{backgroundColor:'#f5f5f5', display:'flex'}}>
                    
<div style={RequiredData?.CommentsArray?.length > 0?{width:'528px'}:{ marginRight:'8px'}}>
    <div style={{fontSize:'16px', fontWeight:'600', marginBottom:'8px'}}>{"Short_x0020_Description_x0020_On" in   RequiredData.UpdatedDataObject&&RequiredData?.UpdatedDataObject?.Item_x0020_Type} Details:</div>
    <div style={{width:'100%', display:'flex', justifyContent: 'flex-start', marginBottom:'8px'}}>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Id:</span>
        </div>
        <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}> 
            <span style={{ fontSize: '10.0pt'}}>{RequiredData?.PortfolioStructureID}</span>
        </div>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Component:</span>
        </div>
        <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            {RequiredData["Portfolio"] != null &&
                <span style={{ fontSize: '10.0pt'}}>
                    {RequiredData["Portfolio"]?.Title}
                </span>
            }     
        </div>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Priority:</span>
        </div>
        <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt' }}>{RequiredData["Priority"]}</span>
        </div>
    </div>
    <div style={{width:'100%', display:'flex', marginBottom:'8px', justifyContent: 'flex-start'}}>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Start Date:</span>
        </div>
        <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt' }}>{RequiredData["StartDate"] != null && RequiredData["StartDate"] != undefined && RequiredData["StartDate"] != "" ? Moment(RequiredData["StartDate"]).format("DD-MMMM-YYYY") : ""}</span>
        </div>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Completion Date:</span>
        </div>
        <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt'}}>{RequiredData["CompletedDate"] != null && RequiredData["CompletedDate"] != undefined && RequiredData["CompletedDate"] != "" ? Moment(RequiredData["CompletedDate"]).format("DD-MMMM-YYYY") : ""}</span>
        </div>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Due Date:</span>
        </div>
        <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt' }}>{RequiredData["DueDate"] != null && RequiredData["DueDate"] != undefined && RequiredData["DueDate"] != "" ? Moment(RequiredData["DueDate"]).format("DD-MMMM-YYYY") : ''}</span>
        </div>
    </div>
    <div style={{width:'100%', display:'flex', marginBottom:'8px', justifyContent: 'flex-start'}}>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Team Members:</span>
        </div>
        <div style={{width:'120px', padding: '5px', display: 'flex', alignItems: 'center'}}>
            <div style={{wordBreak: "break-all"}}>{RequiredData["TeamMembers"] != null &&
                RequiredData["TeamMembers"].length > 0 &&
                <span style={{ fontSize: '10.0pt' }}>
                    {joinObjectValues(RequiredData["TeamMembers"])}
                </span>
            }
                </div>
        </div>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Created:</span>
        </div>
        <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt' }}>{Moment(RequiredData["Created"]).format("DD-MMMM-YYYY")}</span>
        </div>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Created By:</span>
        </div>
        <div style={{width:'120px', padding:'5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt'}}>{RequiredData["Author"] != null && RequiredData["Author"] != undefined && RequiredData["Author"].Title}</span>
        </div>
    </div>
    <div style={{width:'100%', display:'flex', marginBottom:'8px', justifyContent: 'flex-start'}}>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Categories:</span>
        </div>
        <div style={{width:'120px', padding: '5px', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '10.0pt' }}>{RequiredData["Categories"]}</span>
        </div>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>Status:</span>
        </div>
        <div style={{width:'120px', padding: '5px', display: 'flex', alignItems: 'center' }}>
            {RequiredData["Status"]}
        </div>
        <div style={{background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>% Complete:</span>
        </div>
        <div style={{width:'120px', padding: '5px', display: 'flex', alignItems: 'center' }}>
            {RequiredData["PercentComplete"]}
        </div>
    </div>
    <div style={{width:'100%', display:'flex', justifyContent: 'flex-start'}}>
        <div style={{ background: '#fff', width:'120px', padding:'5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt', fontWeight:'500' }}>URL:</span>
        </div>
        <div style={{ wordBreak: "break-all", padding: '5px', display: 'flex', alignItems: 'center'}}>
            <span style={{ fontSize: '10.0pt'}}>
            {RequiredData["ComponentLink"] != null &&
                <a href={RequiredData["ComponentLink"].Url} target="_blank">{RequiredData["ComponentLink"].Url}</a>
            }</span>
        </div>
    </div>

    {RequiredData?.UpdatedDataObject["Short_x0020_Description_x0020_On"] != null  ?
        <div style={{ width: "100%" }}>
            <div style={{fontSize:'16px', fontWeight:'600', marginBottom:'8px', marginTop:'24px'}}>Short Description:</div>
            <div>
                <div style={{width:'100%', display:'flex', marginBottom:'8px', padding:'16px 12px', backgroundColor:'#fff'}}><div style={{width:'100%'}}>
                                    <span dangerouslySetInnerHTML={{ __html: RequiredData.UpdatedDataObject["Short_x0020_Description_x0020_On"] }}></span>
                                </div>
                            </div></div></div>
        :
        null
    }
</div>
{RequiredData?.CommentsArray?.length > 0 ?
    <div style={{ width: '232px'}}>
            <div className="">
                <div style={{fontSize:'16px', fontWeight:'600', marginBottom:'8px'}}>
                    Comments:
                </div>
                <div style={{width:'100%'}}>
                    {RequiredData["CommentsArray"] != undefined && RequiredData["CommentsArray"]?.length > 0 && RequiredData["CommentsArray"]?.map((cmtData: any, i: any) => {
                        return (
                            <div style={{backgroundColor:'#fff', width:'100%', padding:'8px 12px', marginBottom: "8px"}}>
                                <div style={{marginBottom: "8px", width:'100%'}}>
                                    <div>
                                        <span style={{fontWeight:'600' }}>{cmtData.AuthorName}</span> - {cmtData.Created}
                                    </div>
                                    <div>
                                        {cmtData.Description}
                                    </div>
                                </div>
                                {cmtData?.ReplyMessages?.length > 0 && cmtData?.ReplyMessages?.map((replyData: any) => {
                                    return (
                                        <div style={{backgroundColor:'#f5f5f5', padding:'8px 12px', width:'100%' }}>
                                            <div style={{ marginBottom: '8px' }}>
                                                <span style={{fontWeight:'600' }}>{replyData.AuthorName}</span> - {replyData.Created}
                                            </div>
                                            <div>
                                                {replyData.Description}
                                            </div>
                                        </div>
                                    )
                                })}
                               
                            </div>

                        )

                    })}
                </div>
            </div>
    </div>
    : null
}
</div>
            )
        }
    } catch (error) {
        console.log("Error:", error.message)
    }

}


// This is used for Send Email Notification for the Information Request Category Tasks 

export const SendEmailNotificationForIRCTasksAndPriorityCheck = async (requiredData: any) => {
    try {
        const { ItemDetails, ReceiverEmail, Context, usedFor, ReceiverName } = requiredData || {};
        const emailMessage = GenerateMSTeamsNotification(ItemDetails);
        const containerDiv = document.createElement('div');
        const reactElement = React.createElement(emailMessage?.type, emailMessage?.props);
        ReactDOM.render(reactElement, containerDiv);

        let emailSubject = '';
        let messageContent = '';

        if (usedFor === "Information-Request") {
            emailSubject = `[Information Request - ${ItemDetails?.siteType} - ${ItemDetails.TaskId}- ${ItemDetails?.Title}] - Request is completed`;
            messageContent = 'Task created from your end for Information Request has been completed. Please take necessary action';
        }
        if (usedFor === "Priority-Check") {
            emailSubject = `[Task Priority Check - ${ItemDetails?.siteType} - ${ItemDetails.TaskId}- ${ItemDetails?.Title}]. Please have a look`;
            messageContent = 'Task created from your end has been set to 8%. Please take necessary action';
        }

        const emailBodyContent = `<p>Hi ${ReceiverName},</b></p>
            <p>${messageContent}</p>
            <b>Task Description:</b> ${containerDiv.innerHTML}
            <p>Task Link: <a href="${ItemDetails?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${ItemDetails?.Id}&Site=${ItemDetails?.siteType}">
            ${ItemDetails?.TaskId}-${ItemDetails?.Title}</a></p>
            <p><b>Thanks,</b></p>
            <p><b>Task Management Team</b></p>`;

        const emailProps = {
            To: ReceiverEmail,
            Subject: emailSubject,
            Body: emailBodyContent
        };

        if (ReceiverEmail?.length > 0) {
            const sp = spfi().using(spSPFx(Context));
            const data = await sp.utility.sendEmail({
                Body: emailProps.Body,
                Subject: emailProps.Subject,
                To: emailProps.To,
                AdditionalHeaders: {
                    "content-type": "text/html"
                },
            });
            console.log("Email Sent!");
            console.log(data);
            return data;
        } else {
            throw new Error("Receiver email not provided");
        }
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
};


// This is used for Prepare Data on The basis of sort order 

export const PrepareDataAccordingToSortOrder = (SourceArray: any, currentArray: any) => {
    try {
        currentArray?.forEach((currentArrayObject: any) => {
            let correspondingSourceArrayObject: any = SourceArray?.find((objA: any) => objA.Title === currentArrayObject.Title);
            if (correspondingSourceArrayObject) {
                currentArrayObject.SortOrder = correspondingSourceArrayObject?.SortOrder;
            }
        });
        console.log(currentArray);
        currentArray?.sort((a: any, b: any) => a.SortOrder - b.SortOrder);
        return currentArray;
    } catch (error) {
        console.log("Error in PrepareDataAccordingToSortOrder function:", error.message)
    }
}


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

4.  BulkUpdateTaskInfo(RequiredData);
    RequiredData = { 
        ItemDetails: Selected Item all Details as object,
        RequiredListIds: AllListIdData, 
        UpdateData: {PercentComplete : 5, TaskCategories:[{}.{}]}, 
        Context: Context 
    }

5.  UpdateTaskStatusFunction(RequiredData);
    RequiredData = { 
        ItemDetails: Selected Item all Details as object,
        RequiredListIds: AllListIdData, 
        Status: , 
        Context: Context 
    }

6.  UpdateTaskCategoryFunction(RequiredData);
    RequiredData = { 
        ItemDetails: Selected Item all Details as object,
        RequiredListIds: AllListIdData, 
        TaskCategories: [All Selected Categories with Id and Title], 
        Context: Context 
    }

7.  onPortfolioTaggingAllChanges(RequiredData);
    RequiredData = { 
        ItemDetails: Selected Portfolio Item all Details as object,
        RequiredListIds: AllListIdData, 
        TaskDetails: Selected Item all Details as object
    }


8.  SendApprovalEmailNotificationComponent(RequiredData);
    RequiredData = { 
        ItemDetails: Selected Portfolio Item all Details as object,
        AskForApproval: true || false || undefined,
        TaskIsApproved: true || false || undefined,
        CurrentUser: Current user data as an array,
        Context: Context,
        ReceiverEmail: ReceiverEmails as an array on email string,
        usedFor: "Approval" || "Immediate"
    }
**/}