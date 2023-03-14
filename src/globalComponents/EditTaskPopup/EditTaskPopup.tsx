import * as React from "react";
import * as $ from 'jquery';
import * as Moment from 'moment';
import { Web } from "sp-pnp-js";
import pnp from 'sp-pnp-js';
import Picker from "./SmartMetaDataPicker";
import Example from "./FroalaCommnetBoxes";
import * as globalCommon from "../globalCommon";
import ImageUploading, { ImageListType } from "react-images-uploading";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import ComponentPortPolioPopup from "../../webparts/EditPopupFiles/ComponentPortfolioSelection";
import axios, { AxiosResponse } from 'axios';
import "bootstrap/js/dist/tab.js";
import "bootstrap/js/dist/carousel.js";
import CommentCard from "../../globalComponents/Comments/CommentCard";
import LinkedComponent from './LinkedComponent';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { FaExpandAlt } from 'react-icons/fa'
import { RiDeleteBin6Line, RiH6 } from 'react-icons/ri'
import { TbReplace } from 'react-icons/tb'
import NewTameSheetComponent from "./NewTimeSheet";
import CommentBoxComponent from "./CommentBoxComponent";
import TimeEntryPopup from './TimeEntryComponent';
import VersionHistory from "../VersionHistroy/VersionHistory";
import Tooltip from "../Tooltip";
import FlorarImageUploadComponent from '../FlorarComponents/FlorarImageUploadComponent';

var AllMetaData: any = []
var taskUsers: any = []
var IsShowFullViewImage = false;
var CommentBoxData: any = [];
var SubCommentBoxData: any = [];
var updateFeedbackArray: any = [];
var tempShareWebTypeData: any = [];
var tempCategoryData: any;
var SiteTypeBackupArray: any = [];
var currentUserBackupArray: any = [];
let AutoCompleteItemsArray: any = [];
var FeedBackBackupArray: any = [];
var ChangeTaskUserStatus: any = false;
let ApprovalStatusGlobal: any = true;
var ApproverBackupArray: any = [];
var ReplaceImageIndex: any;
var ReplaceImageData: any;
const EditTaskPopup = (Items: any) => {
    const [TaskImages, setTaskImages] = React.useState([]);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [IsServices, setIsServices] = React.useState(false);
    const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [smartServicesData, setSmartServicesData] = React.useState([]);
    const [CategoriesData, setCategoriesData] = React.useState('');
    const [ShareWebTypeData, setShareWebTypeData] = React.useState([]);
    const [AllCategoryData, setAllCategoryData] = React.useState([]);
    const [SearchedCategoryData, setSearchedCategoryData] = React.useState([]);
    const [linkedComponentData, setLinkedComponentData] = React.useState([]);
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const maxNumber = 69;
    const [UpdateTaskInfo, setUpdateTaskInfo] = React.useState(
        {
            Title: '', PercentCompleteStatus: '', ComponentLink: ''
        }
    )
    const [EditData, setEditData] = React.useState<any>({});
    const [ShareWebComponent, setShareWebComponent] = React.useState('');
    const [modalIsOpen, setModalIsOpen] = React.useState(true);
    const [TaskStatusPopup, setTaskStatusPopup] = React.useState(false);
    const [TimeSheetPopup, setTimeSheetPopup] = React.useState(false);
    const [hoverImageModal, setHoverImageModal] = React.useState('None');
    const [ImageComparePopup, setImageComparePopup] = React.useState(false);
    const [CopyAndMoveTaskPopup, setCopyAndMoveTaskPopup] = React.useState(false);
    const [ImageCustomizePopup, setImageCustomizePopup] = React.useState(false);
    const [replaceImagePopup, setReplaceImagePopup] = React.useState(false);
    const [ProjectManagementPopup, setProjectManagementPopup] = React.useState(false);
    const [compareImageArray, setCompareImageArray] = React.useState([]);
    const [composition, setComposition] = React.useState(false);
    const [PercentCompleteStatus, setPercentCompleteStatus] = React.useState('');
    const [taskStatus, setTaskStatus] = React.useState('');
    const [PercentCompleteCheck, setPercentCompleteCheck] = React.useState(true)
    const [itemRank, setItemRank] = React.useState('');
    const [PriorityStatus, setPriorityStatus] = React.useState();
    const [PhoneStatus, setPhoneStatus] = React.useState(false);
    const [EmailStatus, setEmailStatus] = React.useState(false);
    const [DesignStatus, setDesignStatus] = React.useState(false);
    const [OnlyCompletedStatus, setOnlyCompletedStatus] = React.useState(false);
    const [ImmediateStatus, setImmediateStatus] = React.useState(false);
    const [ApprovalStatus, setApprovalStatus] = React.useState(false);
    const [SmartLightStatus, setSmartLightStatus] = React.useState(false);
    const [SmartLightPercentStatus, setSmartLightPercentStatus] = React.useState(false);
    const [ShowTaskDetailsStatus, setShowTaskDetailsStatus] = React.useState(false);
    const [currentUserData, setCurrentUserData] = React.useState([]);
    const [UploadBtnStatus, setUploadBtnStatus] = React.useState(false);
    const [InputFieldDisable, setInputFieldDisable] = React.useState(false);
    const [HoverImageData, setHoverImageData] = React.useState([]);
    const [SiteTypes, setSiteTypes] = React.useState([]);
    const [categorySearchKey, setCategorySearchKey] = React.useState('');
    const [ServicesTaskCheck, setServicesTaskCheck] = React.useState(false);
    const [ComponentTaskCheck, setComponentTaskCheck] = React.useState(false);
    const [ServicePopupType, setServicePopupType] = React.useState('');
    const [AllProjectData, SetAllProjectData] = React.useState([]);
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

    React.useEffect(() => {
        loadTaskUsers();
        getCurrentUserDetails();
        GetEditData();
        getCurrentUserDetails();
        getSmartMetaData();
        loadAllCategoryData();
        GetMasterData();
        // getInformationForSmartLight();
        // Descriptions();
    }, [])

    const Call = React.useCallback((PopupItemData: any, type: any) => {
        setIsServices(false)
        setIsComponent(false);
        setIsComponentPicker(false);
        if (type == "SmartComponent") {
            if (PopupItemData?.smartComponent?.length > 0) {
                Items.Items.smartComponent = PopupItemData.smartComponent;
                setSmartComponentData(PopupItemData.smartComponent);
                setSmartServicesData([])
                console.log("Popup component smartComponent ", PopupItemData.smartComponent)
            }
        }
        if (type == "Category") {
            if (PopupItemData?.categories != "" && PopupItemData?.categories != undefined) {
                Items.Items.Categories = PopupItemData.categories;
                let category: any = tempCategoryData ? tempCategoryData + ";" + PopupItemData.categories[0]?.Title : PopupItemData.categories[0]?.Title;
                setCategoriesData(category);
                tempShareWebTypeData.push(PopupItemData.categories[0]);
                setShareWebTypeData(tempShareWebTypeData);
                let phoneCheck = category.search("Phone");
                let emailCheck = category.search("Email");
                let ImmediateCheck = category.search("Immediate");
                let ApprovalCheck = category.search("Approval");
                let OnlyCompletedCheck = category.search("Only Completed");
                let DesignCheck = category.search("Design")
                if (phoneCheck >= 0) {
                    setPhoneStatus(true)
                } else {
                    setPhoneStatus(false)
                }
                if (emailCheck >= 0) {
                    setEmailStatus(true)
                } else {
                    setEmailStatus(false)
                }
                if (ImmediateCheck >= 0) {
                    setImmediateStatus(true)
                } else {
                    setImmediateStatus(false)
                }
                if (ApprovalCheck >= 0) {
                    setApprovalStatus(true)
                } else {
                    setApprovalStatus(false)
                }
                if (OnlyCompletedCheck >= 0) {
                    setOnlyCompletedStatus(true);
                } else {
                    setOnlyCompletedStatus(false);
                }
                if (DesignCheck >= 0) {
                    setDesignStatus(true);
                } else {
                    setDesignStatus(false);
                }
            }
        }
        if (type == "LinkedServices") {
            if (PopupItemData?.linkedComponent?.length > 0) {
                Items.Items.linkedComponent = PopupItemData.linkedComponent;
                setLinkedComponentData(PopupItemData.linkedComponent);
                setSmartServicesData(PopupItemData.linkedComponent);
                setSmartComponentData([]);
                console.log("Popup component linkedComponent", PopupItemData.linkedComponent)
            }
        }

    }, []);

    // ********** this is for smart category Related all function and callBack function for Picker Component Popup ********
    var SmartTaxonomyName = "Categories";
    var AutoCompleteItems: any = [];
    const loadAllCategoryData = function () {
        var AllTaskusers = []
        var AllMetaData: any = []
        var TaxonomyItems: any = []
        var url = ("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('01a34938-8c7e-4ea6-a003-cee649e8c67a')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '" + SmartTaxonomyName + "'")
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                AllTaskusers = data.d.results;
                $.each(AllTaskusers, function (index: any, item: any) {
                    if (item.Title.toLowerCase() == 'pse' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EPS';
                    }
                    else if (item.Title.toLowerCase() == 'e+i' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EI';
                    }
                    else if (item.Title.toLowerCase() == 'education' && item.TaxType == 'Client Category') {
                        item.newTitle = 'Education';
                    }
                    else {
                        item.newTitle = item.Title;
                    }
                    AllMetaData.push(item);
                })
                TaxonomyItems = loadSmartTaxonomyPortfolioPopup(AllMetaData);
                setAllCategoryData(TaxonomyItems)
            },
            error: function (error: any) {
                console.log('Error:', error)
            }
        })
    };
    var loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any) => {
        var TaxonomyItems: any = [];
        var uniqueNames: any = [];
        $.each(AllTaxonomyItems, function (index: any, item: any) {
            if (item.ParentID == 0 && SmartTaxonomyName == item.TaxType) {
                TaxonomyItems.push(item);
                getChilds(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item)
                }
                uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
                    return array.indexOf(val) == id;
                });

            }
        });
        return uniqueNames;
    }
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (childItem.ParentID != undefined && parseInt(childItem.ParentID) == item.ID) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        });
    }

    if (AllCategoryData?.length > 0) {
        AllCategoryData?.map((item: any) => {
            if (item.newTitle != undefined) {
                item['Newlabel'] = item.newTitle;
                AutoCompleteItems.push(item)
                if (item.childs != null && item.childs != undefined && item.childs.length > 0) {
                    item.childs.map((childitem: any) => {
                        if (childitem.newTitle != undefined) {
                            childitem['Newlabel'] = item['Newlabel'] + ' > ' + childitem.Title;
                            AutoCompleteItems.push(childitem)
                        }
                        if (childitem.childs.length > 0) {
                            childitem.childs.map((subchilditem: any) => {
                                if (subchilditem.newTitle != undefined) {
                                    subchilditem['Newlabel'] = childitem['Newlabel'] + ' > ' + subchilditem.Title;
                                    AutoCompleteItems.push(subchilditem)
                                }
                            })
                        }
                    })
                }
            }
        })
    }

    AutoCompleteItemsArray = AutoCompleteItems.reduce(function (previous: any, current: any) {
        var alredyExists = previous.filter(function (item: any) {
            return item.Title === current.Title
        }).length > 0
        if (!alredyExists) {
            previous.push(current)
        }
        return previous
    }, [])
    const SelectCategoryCallBack = React.useCallback((selectCategoryDataCallBack: any) => {
        setSelectedCategoryData(selectCategoryDataCallBack);
    }, [])

    const setSelectedCategoryData = (selectCategoryData: any) => {
        setIsComponentPicker(false);
        selectCategoryData.map((existingData: any) => {
            let elementFound: any = false;
            tempShareWebTypeData.map((currentData: any) => {
                if (existingData.Title == currentData.Title) {
                    elementFound = true
                }
            })
            if (!elementFound) {
                let category: any = tempCategoryData ? tempCategoryData + ";" + selectCategoryData[0]?.Title : selectCategoryData[0]?.Title;
                setCategoriesData(category);
                tempShareWebTypeData.push(selectCategoryData[0]);
                setShareWebTypeData(tempShareWebTypeData);
                let phoneCheck = category.search("Phone");
                let emailCheck = category.search("Email");
                let ImmediateCheck = category.search("Immediate");
                let ApprovalCheck = category.search("Approval");
                let OnlyCompletedCheck = category.search("Only Completed");
                if (phoneCheck >= 0) {
                    setPhoneStatus(true)
                } else {
                    setPhoneStatus(false)
                }
                if (emailCheck >= 0) {
                    setEmailStatus(true)
                } else {
                    setEmailStatus(false)
                }
                if (ImmediateCheck >= 0) {
                    setImmediateStatus(true)
                } else {
                    setImmediateStatus(false)
                }
                if (ApprovalCheck >= 0) {
                    setApprovalStatus(true)
                } else {
                    setApprovalStatus(false)
                }
                if (OnlyCompletedCheck >= 0) {
                    setOnlyCompletedStatus(true);
                } else {
                    setOnlyCompletedStatus(false);
                }
            }
        })
        setSearchedCategoryData([])
        setCategorySearchKey("");
    }

    const smartCategoryPopup = React.useCallback(() => {
        setIsComponentPicker(false);
    }, [])

    const autoSuggestionsForCategory = (e: any) => {
        let searchedKey: any = e.target.value;
        setCategorySearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AutoCompleteItemsArray?.map((itemData: any) => {
                if (itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())) {
                    tempArray.push(itemData);
                }
            })
            setSearchedCategoryData(tempArray);
        } else {
            setSearchedCategoryData([]);
        }
    }

    // *********** End Smart Category Function **********

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
        setServicePopupType(title);
    }

    const setPriority = function (val: any) {
        setPriorityStatus(val)
    }

    const getSmartMetaData = async () => {
        let web = new Web(Items.Items.siteUrl);
        let MetaData: any = [];
        let siteConfig: any = [];
        let tempArray: any = [];
        MetaData = await web.lists
            .getByTitle('SmartMetadata')
            .items
            .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title")
            .top(4999)
            .expand('Author,Editor')
            .get()

        siteConfig = getSmartMetadataItemsByTaxType(MetaData, 'Sites');
        siteConfig?.map((site: any) => {
            if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== "QA" && site.Title !== "SDC Sites") {
                site.BtnStatus = false;
                tempArray.push(site);
            }
        })
        setSiteTypes(tempArray);
        tempArray?.map((tempData: any) => {
            SiteTypeBackupArray.push(tempData);
        })
        // if (smartCategory.length > 0 && smartCategory != undefined) {
        //     smartCategory.map((item: any) => {
        //         if (item.Title != undefined) {
        //             item['Newlabel'] = item.newTitle;
        //             AutoCompleteItems.push(item)
        //             if (item.childs != null && item.childs != undefined && item.childs.length > 0) {
        //                 item.childs.map((childitem: any) => {
        //                     if (childitem.newTitle != undefined) {
        //                         childitem['Newlabel'] = item['Newlabel'] + ' > ' + childitem.Title;
        //                         AutoCompleteItems.push(childitem)
        //                     }
        //                     if (childitem.childs.length > 0) {
        //                         childitem.childs.map((subchilditem: any) => {
        //                             if (subchilditem.newTitle != undefined) {
        //                                 subchilditem['Newlabel'] = childitem['Newlabel'] + ' > ' + subchilditem.Title;
        //                                 AutoCompleteItems.push(subchilditem)
        //                             }
        //                         })
        //                     }
        //                 })
        //             }
        //         }
        //     })
        // }
        // AutoCompleteItemsArray = AutoCompleteItems.reduce(function (previous: any, current: any) {
        //     var alredyExists = previous.filter(function (item: any) {
        //         return item.Title === current.Title
        //     }).length > 0
        //     if (!alredyExists) {
        //         previous.push(current)
        //     }
        //     return previous
        // }, [])
        // console.log("Final Smart Category Array 1 =======", smartCategory);
        // console.log("Final Smart Category Array =======", AutoCompleteItems);
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }


    const getCurrentUserDetails = async () => {
        let currentUserId: number;
        await pnp.sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });
        if (currentUserId != undefined) {
            if (taskUsers != null && taskUsers?.length > 0) {
                taskUsers?.map((userData: any) => {
                    if (userData.AssingedToUserId == currentUserId) {
                        let temp: any = [];
                        temp.push(userData)
                        setCurrentUserData(temp);
                        currentUserBackupArray.push(userData);
                    }
                })
            }
        }
    }

    const openTaskStatusUpdatePopup = (itemData: any) => {
        setTaskStatusPopup(true);
    }
    const ExpandSiteComposition = () => {
        setComposition(!composition)
    }
    var count = 0;
    const loadTaskUsers = async () => {
        var AllTaskUsers: any = []
        axios.get("https://hhhhteams.sharepoint.com/sites/HHHH/sp/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$select=Id,UserGroupId,TimeCategory,Suffix,Title,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType,Approver/Id,Approver/Title,Approver/Name&$expand=AssingedToUser,Approver&$orderby=SortOrder asc,Title asc")
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


        // try {
        //     taskUsers = await globalCommon.loadTaskUsers;
        //     $.each(taskUsers, function (index: any, user: any) {
        //         var ApproverUserItem = '';
        //         var UserApproverMail: any = []
        //         if (user.Title != undefined && user.IsShowTeamLeader === true) {
        //             if (user.Approver != undefined) {
        //                 $.each(user.Approver.results, function (ApproverUser: any, index) {
        //                     ApproverUserItem += ApproverUser.Title + (index === user.Approver.results?.length - 1 ? '' : ',');
        //                     UserApproverMail.push(ApproverUser.Name.split('|')[2]);
        //                 })
        //                 user['UserManagerName'] = ApproverUserItem;
        //                 user['UserManagerMail'] = UserApproverMail;
        //             }
        //             AllTaskUsers.push(user);
        //         }

        //     });
        //     if (AllMetaData != undefined && AllMetaData?.length > 0) {
        //         GetEditData();
        //     }
        // } catch (error) {
        //     console.log("Error:", error.message);
        // }
    }

    const GetEditData = async () => {
        try {
            let web = new Web(Items.Items.siteUrl);
            let smartMeta;
            if (Items.Items.listId != undefined) {
                smartMeta = await web.lists
                    .getById(Items.Items.listId)
                    .items
                    .select("Id,Title,Priority_x0020_Rank,BasicImageInfo,Attachments,AttachmentFiles,Priority,Mileage,EstimatedTime,CompletedDate,EstimatedTimeDescription,FeedBack,Status,ItemRank,IsTodaysTask,Body,Component/Id,component_x0020_link,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
                    .top(5000)
                    .filter(`Id eq ${Items.Items.ID}`)
                    .expand('AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,RelevantPortfolio')
                    .get();
            }
            else {
                smartMeta = await web.lists
                    .getByTitle(Items.Items.listName)
                    .items
                    .select("Id,Title,Priority_x0020_Rank,BasicImageInfo,Attachments,AttachmentFiles,Priority,Mileage,EstimatedTime,CompletedDate,EstimatedTimeDescription,FeedBack,Status,ItemRank,IsTodaysTask,Body,Component/Id,component_x0020_link,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,Services/Id,Services/Title,Events/Id,PercentComplete,ComponentId,Categories,SharewebTaskLevel1No,SharewebTaskLevel2No,ServicesId,ClientActivity,ClientActivityJson,EventsId,StartDate,Priority_x0020_Rank,DueDate,SharewebTaskType/Id,SharewebTaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,ClientCategory/Id,ClientCategory/Title")
                    .top(5000)
                    .filter(`Id eq ${Items.Items.ID}`)
                    .expand('AssignedTo,Author,Editor,Component,Services,Events,SharewebTaskType,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories,ClientCategory,RelevantPortfolio')
                    .get();
            }
            let statusValue: any
            smartMeta?.map((item: any) => {
                let saveImage = []
                if (item.Categories != null) {
                    setCategoriesData(item.Categories);
                    tempCategoryData = item.Categories;
                    let phoneCheck = item.Categories.search("Phone");
                    let emailCheck = item.Categories.search("Email");
                    let ImmediateCheck = item.Categories.search("Immediate");
                    let ApprovalCheck = item.Categories.search("Approval");
                    let OnlyCompletedCheck = item.Categories.search("Only Completed");
                    let DesignCheck = item.Categories.search("Design")
                    if (phoneCheck >= 0) {
                        setPhoneStatus(true)
                    } else {
                        setPhoneStatus(false)
                    }
                    if (emailCheck >= 0) {
                        setEmailStatus(true)
                    } else {
                        setEmailStatus(false)
                    }
                    if (ImmediateCheck >= 0) {
                        setImmediateStatus(true)
                    } else {
                        setImmediateStatus(false)
                    }
                    if (ApprovalCheck >= 0) {
                        setApprovalStatus(true)
                        ApprovalStatusGlobal = true
                    } else {
                        setApprovalStatus(false)
                        ApprovalStatusGlobal = false
                    }
                    if (OnlyCompletedCheck >= 0) {
                        setOnlyCompletedStatus(true);
                    } else {
                        setOnlyCompletedStatus(false);
                    }
                    if (DesignCheck >= 0) {
                        setDesignStatus(true);
                    } else {
                        setDesignStatus(false);
                    }

                }
                if (item.PercentComplete != undefined) {
                    statusValue = item.PercentComplete * 100;
                    item.PercentComplete = statusValue;
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
                    if (statusValue <= 3 && ApprovalStatusGlobal) {
                        ChangeTaskUserStatus = false;
                    } else {
                        ChangeTaskUserStatus = true;
                    }
                }
                if (item.Body != undefined) {
                    item.Body = item.Body.replace(/(<([^>]+)>)/ig, '');
                }
                if (item.BasicImageInfo != null && item.Attachments) {
                    saveImage.push(JSON.parse(item.BasicImageInfo))
                }
                // if (item.Priority_x0020_Rank != undefined) {
                //     if (currentUsers != undefined) {
                //         currentUsers?.map((rank: any) => {
                //             if (rank.rank == item.Priority_x0020_Rank) {
                //                 item.Priority_x0020_Rank = rank.rank;
                //             }
                //         })
                //     }
                // }
                item.TaskId = globalCommon.getTaskId(item);
                let AssignedUsers: any = [];
                let ApproverData: any = [];
                if (item.Author != undefined && item.Author != null) {
                    taskUsers.map((userData: any) => {
                        if (item.Author.Id == userData?.AssingedToUserId) {
                            userData.Approver?.map((AData: any) => {
                                ApproverData.push(AData);
                                ApproverBackupArray.push(AData);
                            })
                        }
                    })
                    if ((statusValue == 1 || statusValue == 2) && ApprovalStatusGlobal) {
                        if (ApproverData?.length > 0) {
                            taskUsers.map((userData1: any) => {
                                ApproverData?.map((itemData: any) => {
                                    if (itemData.Id == userData1?.AssingedToUserId) {
                                        AssignedUsers.push(userData1);
                                    }
                                })
                            })
                        }
                    } else {
                        taskUsers?.map((userData: any) => {
                            item.AssignedTo?.map((AssignedUser: any) => {
                                if (userData?.AssingedToUserId == AssignedUser.Id) {
                                    AssignedUsers.push(userData);
                                }
                            })
                        })
                    }
                }
                if (ApproverData?.length > 0) {
                    ApproverData?.map((Approver: any) => {
                        currentUserBackupArray?.map((current: any) => {
                            if (Approver.Id == current.AssingedToUserId) {
                                setSmartLightStatus(true);
                            }
                        })
                    })
                }
                if (item.component_x0020_link != null) {
                    item.Relevant_Url = item.component_x0020_link.Url
                }

                setTaskAssignedTo(item.AssignedTo ? item.AssignedTo : []);
                setTaskResponsibleTeam(item.Responsible_x0020_Team ? item.Responsible_x0020_Team : []);
                setTaskTeamMembers(item.Team_x0020_Members ? item.Team_x0020_Members : []);

                item.TaskAssignedUsers = AssignedUsers;
                item.TaskApprovers = ApproverData;
                if (item.Attachments) {
                    let tempData = []
                    tempData = saveImage[0];
                    item.UploadedImage = saveImage ? saveImage[0] : '';
                    onUploadImageFunction(tempData, tempData?.length);
                }

                if (item.SharewebCategories != undefined && item.SharewebCategories?.length > 0) {
                    let tempArray: any = [];
                    tempArray = item.SharewebCategories;
                    setShareWebTypeData(item.SharewebCategories);
                    tempArray?.map((tempData: any) => {
                        tempShareWebTypeData.push(tempData);
                    })
                }

                if (item.RelevantPortfolio?.length > 0) {
                    setLinkedComponentData(item.RelevantPortfolio)
                }
                if (item.FeedBack != null) {
                    let message = JSON.parse(item.FeedBack);
                    updateFeedbackArray = message;
                    let feedbackArray = message[0]?.FeedBackDescriptions
                    if (feedbackArray != undefined && feedbackArray.length > 0) {
                        let CommentBoxText = feedbackArray[0].Title?.replace(/(<([^>]+)>)/ig, '');
                        item.CommentBoxText = CommentBoxText;
                    } else {
                        item.CommentBoxText = "<p></p>"
                    }
                    item.FeedBackArray = feedbackArray;
                    FeedBackBackupArray = JSON.stringify(feedbackArray);
                } else {
                    let param: any = Moment(new Date().toLocaleString())
                    var FeedBackItem: any = {};
                    FeedBackItem['Title'] = "FeedBackPicture" + param;
                    FeedBackItem['FeedBackDescriptions'] = [];
                    FeedBackItem['ImageDate'] = "" + param;
                    FeedBackItem['Completed'] = '';
                    updateFeedbackArray = [FeedBackItem]
                    let tempArray: any = [FeedBackItem]
                    item.FeedBack = JSON.stringify(tempArray);
                    FeedBackBackupArray = JSON.stringify(tempArray);
                }
                if (item.Component?.length > 0) {
                    setComponentTaskCheck(true)
                    setSmartComponentData(item.Component);
                } else {
                    setComponentTaskCheck(false)
                }
                if (item.Services?.length > 0) {
                    setServicesTaskCheck(true)
                    setSmartServicesData(item.Services);
                } else {
                    setServicesTaskCheck(false)
                }
                setEditData(item)
                setPriorityStatus(item.Priority)
                console.log("Task All Details ==================", item)
            })
        } catch (error) {
            console.log("Error :", error.message);
        }
    }

    const GetMasterData = async () => {
        try {
            let web = new Web(Items.Items.siteUrl);
            let AllTask: any = [];
            AllTask = await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF')
                .items
                .select("Deliverables,TechnicalExplanations,ValueAdded,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,ServicePortfolio/Title")
                .expand("ComponentPortfolio,ServicePortfolio,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebCategories,Parent")
                .top(4999)
                .filter("Item_x0020_Type eq 'Project'")
                .getAll();
            SetAllProjectData(AllTask);
            console.log("All Project Data ======", AllTask);
        } catch (error) {
            console.log("Error:", error.message)
        }

    }

    // const getInformationForSmartLight = () => {
    //     if (EditData.TaskApprovers?.length > 0 && EditData.TaskApprovers != undefined) {
    //         EditData.TaskApprovers?.map((Approver: any) => {
    //             currentUserBackupArray?.map((current: any) => {
    //                 if (Approver.Id == current.Id) {
    //                     setSmartLightStatus(true);
    //                 }
    //             })
    //         })
    //     }
    // }

    //    *********** This is for status section Functions **************
    const StatusAutoSuggestion = (e: any) => {
        let StatusInput = e.target.value;
        if (StatusInput == 0) {
            setTaskStatus('');
            setPercentCompleteStatus('');
            setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: '0' })
        }

        if (StatusInput < 70 && StatusInput > 20) {
            setTaskStatus("In Progress");
            setPercentCompleteStatus(`${StatusInput}% In Progress`);
            setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusInput })
        } else {
            StatusArray.map((percentStatus: any, index: number) => {
                if (percentStatus.value == StatusInput) {
                    setTaskStatus(percentStatus.taskStatusComment);
                    setPercentCompleteStatus(percentStatus.status);
                    setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusInput })
                }
            })
        }

        if (StatusInput == 80) {
            // let tempArray: any = [];
            if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
                setWorkingMemberFromTeam(EditData.Team_x0020_Members, "QA", 143);
            } else {
                setWorkingMember(143);
            }
            EditData.IsTodaysTask = false;
            EditData.CompletedDate = undefined;
            StatusArray?.map((item: any) => {
                if (StatusInput == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }
        if (StatusInput == 5) {
            // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
            // } else if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.Team_x0020_Members, "Development", 156);

            // } else {
            //     setWorkingMember(156);
            // }
            EditData.CompletedDate = undefined;
            EditData.IsTodaysTask = false;
            StatusArray?.map((item: any) => {
                if (StatusInput == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }
        if (StatusInput == 10) {
            EditData.CompletedDate = undefined;
            if (EditData.StartDate == undefined) {
                EditData.StartDate = Moment(new Date()).format("MM-DD-YYYY")
            }
            EditData.IsTodaysTask = true;
            StatusArray?.map((item: any) => {
                if (StatusInput == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
            // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
            // } else {
            //     setWorkingMember(156);
            // }
        }
        if (StatusInput == 93 || StatusInput == 96 || StatusInput == 99) {
            setWorkingMember(9);
            StatusArray?.map((item: any) => {
                if (StatusInput == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }
        if (StatusInput == 90) {
            if (EditData.siteType == 'Offshore Tasks') {
                setWorkingMember(36);
            } else if (DesignStatus) {
                setWorkingMember(172);
            } else {
                setWorkingMember(42);
            }
            EditData.CompletedDate = Moment(new Date()).format("MM-DD-YYYY")
            StatusArray?.map((item: any) => {
                if (StatusInput == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }

        if (StatusInput == 2) {
            setInputFieldDisable(true)
            StatusArray.map((percentStatus: any, index: number) => {
                if (percentStatus.value == StatusInput) {
                    setTaskStatus(percentStatus.taskStatusComment);
                    setPercentCompleteStatus(percentStatus.status);
                    setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusInput })
                }
            })
        }
        if (StatusInput != 2) {
            setInputFieldDisable(false)
        }
        if (StatusInput <= 3 && ApprovalStatusGlobal) {
            ChangeTaskUserStatus = false;
        } else {
            ChangeTaskUserStatus = true;

        }
        if (StatusInput == 1) {
            let tempArray: any = [];
            if (ApproverBackupArray?.length > 0) {
                ApproverBackupArray.map((dataItem: any) => {
                    tempArray.push(dataItem);
                })
            }
            setTaskAssignedTo(tempArray);
            setTaskTeamMembers(tempArray);
        }
        // value: 5, status: "05% Acknowledged", taskStatusComment: "Acknowledged"
    }

    const PercentCompleted = (StatusData: any) => {
        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusData.value })
        setPercentCompleteStatus(StatusData.status);
        setTaskStatus(StatusData.taskStatusComment);
        setPercentCompleteCheck(false);
        if (StatusData.value == 1) {
            let tempArray: any = [];
            if (ApproverBackupArray?.length > 0) {
                ApproverBackupArray.map((dataItem: any) => {
                    tempArray.push(dataItem);
                })
            }
            setTaskAssignedTo(tempArray);
            setTaskTeamMembers(tempArray);
        }
        if (StatusData.value == 2) {
            setInputFieldDisable(true)
        }
        if (StatusData.value != 2) {
            setInputFieldDisable(false)
        }

        if (StatusData.value == 80) {
            // let tempArray: any = [];
            if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
                setWorkingMemberFromTeam(EditData.Team_x0020_Members, "QA", 143);
            } else {
                setWorkingMember(143);
            }
            EditData.IsTodaysTask = false;
            EditData.CompletedDate = undefined;
        }

        if (StatusData.value == 5) {
            // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
            // } else if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.Team_x0020_Members, "Development", 156);

            // } else {
            //     setWorkingMember(156);
            // }
            EditData.CompletedDate = undefined;
            EditData.IsTodaysTask = false;
        }
        if (StatusData.value == 10) {
            EditData.CompletedDate = undefined;
            if (EditData.StartDate == undefined) {
                EditData.StartDate = Moment(new Date()).format("MM-DD-YYYY")
            }
            EditData.IsTodaysTask = true;
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
            if (EditData.siteType == 'Offshore Tasks') {
                setWorkingMember(36);
            } else if (DesignStatus) {
                setWorkingMember(172);
            } else {
                setWorkingMember(42);
            }
            EditData.CompletedDate = Moment(new Date()).format("MM-DD-YYYY")
            StatusArray?.map((item: any) => {
                if (StatusData.value == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }
    }

    const setWorkingMember = (statusId: any) => {
        taskUsers.map((dataTask: any) => {
            if (dataTask.AssingedToUserId == statusId) {
                let tempArray: any = [];
                tempArray.push(dataTask)
                EditData.TaskAssignedUsers = tempArray;
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
                        EditData.TaskAssignedUsers = tempArray;
                        let updateUserArray1: any = [];
                        updateUserArray1.push(tempArray[0].AssingedToUser)
                        setTaskAssignedTo(updateUserArray1);
                    }
                    else {
                        if (tempArray?.length == 0) {
                            setWorkingMember(156);
                        }
                    }
                }
            })
        })
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
    var CategoryTypeID: any = [];
    var SmartServicesId: any = [];
    const UpdateTaskInfoFunction = async (typeFunction: any) => {
        var UploadImageArray: any = []
        if (TaskImages != undefined && TaskImages?.length > 0) {
            TaskImages?.map((imgItem: any) => {
                if (imgItem.imageDataUrl != undefined && imgItem.imageDataUrl != null) {
                    let tempObject: any = {
                        ImageName: imgItem.ImageName,
                        ImageUrl: imgItem.imageDataUrl,
                        UploadeDate: imgItem.UploadeDate,
                        UserName: imgItem.UserName,
                        UserImage: imgItem.UserImage
                    }
                    UploadImageArray.push(tempObject)
                } else {
                    UploadImageArray.push(imgItem);
                }

            })
        }
        // images?.map((imgDtl: any) => {
        //     if (imgDtl.dataURL != undefined) {
        //         var imgUrl = Items.Items.siteUrl + '/Lists/' + EditData.siteType + '/Attachments/' + EditData.Id + '/' + imgDtl.file.name;
        //     }
        //     // else {
        //     //     imgUrl = EditData.Item_x002d_Image != undefined ? EditData.Item_x002d_Image.Url : null;
        //     // }
        //     if (imgDtl.file != undefined) {
        //         item['ImageName'] = imgDtl.file.name
        //         item['ImageUrl'] = imgUrl
        //         item['UploadeDate'] = EditData.Created
        //         item['UserImage'] = EditData.Author?.Title
        //         item['UserName'] = EditData.Author?.Title
        //     }
        //     UploadImage.push(item)
        // })

        if (CommentBoxData?.length > 0 || SubCommentBoxData?.length > 0) {
            if (CommentBoxData?.length == 0 && SubCommentBoxData?.length > 0) {
                let message = JSON.parse(EditData.FeedBack);
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
                    let message = JSON.parse(EditData.FeedBack);
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
            updateFeedbackArray = JSON.parse(EditData.FeedBack);
        }
        FeedBackBackupArray = [];
        if (ShareWebTypeData != undefined && ShareWebTypeData?.length > 0) {
            ShareWebTypeData.map((typeData: any) => {
                CategoryTypeID.push(typeData.Id)
            })
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
        if (smartServicesData != undefined && smartServicesData?.length > 0) {
            smartServicesData?.map((com: any) => {
                if (smartServicesData != undefined && smartServicesData?.length >= 0) {
                    $.each(smartServicesData, function (index: any, smart: any) {
                        SmartServicesId.push(smart.Id);
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
        }
        // else {
        //     if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
        //         EditData.AssignedTo?.map((taskInfo: any) => {
        //             AssignedToIds.push(taskInfo.Id);
        //         })
        //     }
        // }
        if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
            TaskTeamMembers?.map((taskInfo) => {
                TeamMemberIds.push(taskInfo.Id);
            })
        }

        // (3) Low
        // (2) Normal

        let Priority: any;
        if (EditData.Priority_x0020_Rank) {
            let rank = EditData.Priority_x0020_Rank
            if (rank <= 10 && rank >= 8) {
                Priority = "(1) High"
            }
            if (rank <= 7 && rank >= 4) {
                Priority = "(2) Normal"
            }

            if (rank <= 3 && rank >= 0) {
                Priority = "(3) Low"
            }

        }
        // else {
        //     if (EditData.Team_x0020_Members != undefined && EditData.Team_x0020_Members?.length > 0) {
        //         EditData.Team_x0020_Members?.map((taskInfo: any) => {
        //             TeamMemberIds.push(taskInfo.Id);
        //         })
        //     }
        // }
        if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
            TaskResponsibleTeam?.map((taskInfo) => {
                ResponsibleTeamIds.push(taskInfo.Id);
            })
        }

        // else {
        //     if (EditData.Responsible_x0020_Team != undefined && EditData.Responsible_x0020_Team?.length > 0) {
        //         EditData.Responsible_x0020_Team?.map((taskInfo: any) => {
        //             ResponsibleTeamIds.push(taskInfo.Id);
        //         })
        //     }
        // }
        try {
            let web = new Web(Items.Items.siteUrl);
            await web.lists.getById(Items.Items.listId).items.getById(Items.Items.ID).update({
                IsTodaysTask: (EditData.IsTodaysTask ? EditData.IsTodaysTask : null),
                Priority_x0020_Rank: EditData.Priority_x0020_Rank,
                ItemRank: EditData.ItemRank,
                Title: UpdateTaskInfo.Title ? UpdateTaskInfo.Title : EditData.Title,
                Priority: Priority,
                StartDate: EditData.StartDate ? Moment(EditData.StartDate).format("MM-DD-YYYY") : null,
                PercentComplete: UpdateTaskInfo.PercentCompleteStatus ? (Number(UpdateTaskInfo.PercentCompleteStatus) / 100) : (EditData.PercentComplete ? (EditData.PercentComplete / 100) : null),
                ComponentId: { "results": (smartComponentsIds != undefined && smartComponentsIds?.length > 0) ? smartComponentsIds : [] },
                Categories: CategoriesData ? CategoriesData : null,
                // RelevantPortfolioId: { "results": (RelevantPortfolioIds != undefined && RelevantPortfolioIds?.length > 0) ? RelevantPortfolioIds : [] },
                SharewebCategoriesId: { "results": (CategoryTypeID != undefined && CategoryTypeID?.length > 0) ? CategoryTypeID : [] },
                DueDate: EditData.DueDate ? Moment(EditData.DueDate).format("MM-DD-YYYY") : null,
                CompletedDate: EditData.CompletedDate ? Moment(EditData.CompletedDate).format("MM-DD-YYYY") : null,
                Status: taskStatus ? taskStatus : (EditData.Status ? EditData.Status : null),
                Mileage: (EditData.Mileage ? EditData.Mileage : ''),
                ServicesId: { "results": (SmartServicesId != undefined && SmartServicesId?.length > 0) ? SmartServicesId : [] },
                AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds?.length > 0) ? AssignedToIds : [] },
                Responsible_x0020_TeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0) ? ResponsibleTeamIds : [] },
                Team_x0020_MembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds?.length > 0) ? TeamMemberIds : [] },
                FeedBack: updateFeedbackArray?.length > 0 ? JSON.stringify(updateFeedbackArray) : null,
                component_x0020_link: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: EditData.Relevant_Url ? EditData.Relevant_Url : '',
                    Url: EditData.Relevant_Url ? EditData.Relevant_Url : ''
                },
                BasicImageInfo: JSON.stringify(UploadImageArray)
            }).then((res: any) => {
                tempShareWebTypeData = [];
                AllMetaData = []
                taskUsers = []
                CommentBoxData = []
                SubCommentBoxData = []
                updateFeedbackArray = []
                tempShareWebTypeData = []
                tempCategoryData = []
                SiteTypeBackupArray = []
                currentUserBackupArray = []
                AutoCompleteItemsArray = []
                FeedBackBackupArray = []
                ApproverBackupArray = []
                if (typeFunction != "TimeSheetPopup") {
                    Items.Call();
                }
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
    //    ************* this is team configuration call Back function **************
    const getTeamConfigData = React.useCallback((teamConfigData: any) => {
        if (ChangeTaskUserStatus) {
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
                EditData.AssignedTo = tempArray;
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
                EditData.Team_x0020_Members = tempArray;
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
                EditData.Responsible_x0020_Team = tempArray;
            }
        }
    }, [])


    // *************** this is footer section share this task function ***************

    const shareThisTaskFunction = (EmailData: any) => {
        var link = "mailTo:"
            + "?cc:"
            + "&subject=" + " [" + Items.Items.siteType + "-Task ] " + EmailData.Title
            + "&body=" + `${Items.Items.siteUrl}/SitePages/Task-Profile-spfx.aspx?taskId=${EmailData.ID}` + "&" + `Site=${Items.Items.siteType}`;
        window.location.href = link;
    }
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
            if (Items.Items.listId != undefined) {
                let web = new Web(Items.Items.siteUrl);
                await web.lists.getById(Items.Items.listId).items.getById(itemId).delete();
            } else {
                let web = new Web(Items.Items.siteUrl);
                await web.lists.getById(Items.Items.listName).items.getById(itemId).delete();
            }
            Items.Call();
            console.log("Your post has been deleted successfully");
        } catch (error) {
            console.log("Error:", error.message);
        }
    }

    // ************* this is for FeedBack Comment Section Functions ************

    const CommentSectionCallBack = React.useCallback((EditorData: any) => {
        CommentBoxData = EditorData
        BuildFeedBackArray();

    }, [])
    const SubCommentSectionCallBack = React.useCallback((feedBackData: any) => {
        SubCommentBoxData = feedBackData;
        BuildFeedBackArray();
    }, [])

    const BuildFeedBackArray = () => {
        let TempFeedBackArray: any = [];
        if (CommentBoxData?.length > 0 && SubCommentBoxData?.length > 0) {
            TempFeedBackArray = CommentBoxData.concat(SubCommentBoxData)
        }
        if (CommentBoxData?.length == 0 && SubCommentBoxData?.length > 0) {
            let message = JSON.parse(FeedBackBackupArray);
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
                    "isShowLight": ""
                }
                tempArray.push(tempObject);
            }
            CommentBoxData = tempArray;
            TempFeedBackArray = tempArray.concat(SubCommentBoxData);
        }
        if (CommentBoxData?.length > 0 && SubCommentBoxData?.length == 0) {
            let message = JSON.parse(FeedBackBackupArray);
            if (message != null) {
                let feedbackArray = message[0]?.FeedBackDescriptions;
                feedbackArray?.map((array: any, index: number) => {
                    if (index > 0) {
                        SubCommentBoxData.push(array);
                    }
                })
                TempFeedBackArray = CommentBoxData.concat(SubCommentBoxData);
            } else {
                TempFeedBackArray = CommentBoxData;
            }
        }
        let ApprovedStatusCount: any = 0;
        if (TempFeedBackArray?.length > 0) {
            TempFeedBackArray?.map((item: any) => {
                if (item.isShowLight == "Approve") {
                    ApprovedStatusCount++;
                    if (EditData.PercentComplete <= 3) {
                        let StatusInput: any = 3;
                        if (StatusInput == 3) {
                            setInputFieldDisable(false)
                            setStatusOnChangeSmartLight(3);
                            // setTaskAssignedTo([]);
                            // EditData.TaskAssignedUsers = [];
                            // setTaskTeamMembers([]);
                            // EditData.Team_x0020_Members = [];
                        }
                    }
                }
                if (item.Phone) {
                    // CategoryChange("Phone", 199);
                    CategoryChangeUpdateFunction("false", "Phone", 199)
                }
                if (item.Subtext?.length > 0) {
                    item.Subtext.map((subItem: any) => {
                        if (subItem.isShowLight == "Approve") {
                            ApprovedStatusCount++;
                            if (EditData.PercentComplete <= 3) {
                                let StatusInput: any = 3;
                                if (StatusInput == 3) {
                                    setInputFieldDisable(false)
                                    setStatusOnChangeSmartLight(3);
                                    // setTaskAssignedTo([]);
                                    // EditData.TaskAssignedUsers = [];
                                    // setTaskTeamMembers([]);
                                    // EditData.Team_x0020_Members = [];
                                }
                            }
                        }
                        if (item.Phone) {
                            CategoryChangeUpdateFunction("false", "Phone", 199)
                        }
                    })
                }
            })
            TempFeedBackArray?.map((item: any) => {
                if (item.isShowLight == "Reject" || item.isShowLight == "Maybe") {
                    if (ApprovedStatusCount == 0) {
                        if (EditData.PercentComplete >= 2) {
                            let StatusInput: any = 2;
                            if (StatusInput <= 2) {
                                setInputFieldDisable(true)
                                setStatusOnChangeSmartLight(2);
                            }
                        }
                    }
                }
                if (item.Subtext?.length > 0) {
                    item.Subtext.map((subItem: any) => {
                        if (subItem.isShowLight == "Reject" || subItem.isShowLight == "Maybe") {
                            if (ApprovedStatusCount == 0) {
                                if (EditData.PercentComplete <= 2) {
                                    let StatusInput: any = 2;
                                    if (StatusInput == 2) {
                                        setInputFieldDisable(true)
                                        setStatusOnChangeSmartLight(2);
                                    }
                                }
                            }
                        }
                    })
                }
            })
        }
    }

    const setStatusOnChangeSmartLight = (StatusInput: any) => {
        StatusArray.map((percentStatus: any, index: number) => {
            if (percentStatus.value == StatusInput) {
                setTaskStatus(percentStatus.taskStatusComment);
                setPercentCompleteStatus(percentStatus.status);
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusInput })
            }
        })
    }

    // **************** this is for category change and remove function functions ******************

    const removeCategoryItem = (TypeCategory: any, TypeId: any) => {
        let tempString: any = [];
        CategoriesData.split(";")?.map((type: any, index: number) => {
            if (type != TypeCategory) {
                tempString.push(type);
            }
        })
        setCategoriesData(tempString.join(";"));
        tempCategoryData = tempString.join(";");
        let tempArray2: any = [];
        tempShareWebTypeData = [];
        ShareWebTypeData?.map((dataType: any) => {
            if (dataType.Id != TypeId) {
                tempArray2.push(dataType)
                tempShareWebTypeData.push(dataType);
            }
        })
        setShareWebTypeData(tempArray2);
    }
    const CategoryChange = (e: any, typeValue: any, IdValue: any) => {
        let statusValue: any = e.target.value;
        let type: any = typeValue;
        let Id: any = IdValue;
        CategoryChangeUpdateFunction(statusValue, type, Id)
    }

    const CategoryChangeUpdateFunction = (Status: any, type: any, Id: any) => {
        if (Status == "true") {
            removeCategoryItem(type, Id);
            if (type == "Phone") {
                setPhoneStatus(false)
            }
            if (type == "Email") {
                setEmailStatus(false)
            }
            if (type == "Immediate") {
                setImmediateStatus(false)
            }
            if (type == "Approval") {
                setApprovalStatus(false)
            }
            if (type == "Only Completed") {
                setOnlyCompletedStatus(false)
            }


        } else {
            let category: any = tempCategoryData + ";" + type;
            setCategoriesData(category);
            tempCategoryData = category;
            let tempObject = {
                Title: type,
                Id: Id
            }
            ShareWebTypeData.push(tempObject);
            tempShareWebTypeData.push(tempObject);
            if (type == "Phone") {
                setPhoneStatus(true)
            }
            if (type == "Email") {
                setEmailStatus(true)
            }
            if (type == "Immediate") {
                setImmediateStatus(true)
            }
            if (type == "Approval") {
                setApprovalStatus(true)
            }
            if (type == "Only Completed") {
                setOnlyCompletedStatus(true)
            }
        }
    }

    // ********** ========= End ============== category change and remove function ******************

    // ************ this is for Save And Add Time sheet function *************

    const SaveAndAddTimeSheet = () => {
        UpdateTaskInfoFunction("TimeSheetPopup");
        setTimeSheetPopup(true);
        setModalIsOpen(false);
    }
    const closeTimeSheetPopup = () => {
        setTimeSheetPopup(false);
        setModalIsOpenToFalse();
    }

    // ************ ======= END ===== of Save And Add Time sheet function *************



    // ************** this is for the Approver Related All Functions section *****************

    const removeApproverFunction = (Title: any, Id: any) => {
        let tempArray: any = [];
        if (EditData.TaskApprovers != null && EditData.TaskApprovers?.length > 0) {
            EditData.TaskApprovers?.map((item: any) => {
                if (item.Id == Id) {
                    tempArray.push(item);
                }
            })
        }
        EditData.TaskApprovers = tempArray;

    }

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
        let SiteUrl = Items.Items.siteUrl;
        imageList?.map(async (imgItem: any, index: number) => {
            if (imgItem.data_url != undefined && imgItem.file != undefined) {
                let date = new Date()
                let timeStamp = date.getTime();
                let imageIndex = index + 1
                fileName = 'Image' + imageIndex + "-" + EditData.Title + " " + EditData.Title + timeStamp + ".jpg"
                let ImgArray = {
                    ImageName: fileName,
                    UploadeDate: Moment(new Date()).format("DD/MM/YYYY"),
                    imageDataUrl: SiteUrl + '/Lists/' + Items.Items.siteType + '/Attachments/' + EditData?.Id + '/' + fileName,
                    ImageUrl: imgItem.data_url,
                    UserImage: currentUserData != null && currentUserData.length > 0 ? currentUserData[0].Item_x0020_Cover?.Url : "",
                    UserName: currentUserData != null && currentUserData.length > 0 ? currentUserData[0].Title : "",
                };
                tempArray.push(ImgArray);
            } else {
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
                UploadImageFunction(lastindexArray, fileName);
            }
            else {
                if (updateIndex < imageList.length) {
                    ReplaceImageFunction(updateImage, updateIndex);
                }
            }
        }
    };
    const UploadImageFunction = (Data: any, imageName: any) => {
        let listId = Items.Items.listId;
        let listName = Items.Items.listName;
        let Id = Items.Items.Id
        var src = Data.data_url?.split(",")[1];
        var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
            return c.charCodeAt(0);
        }));
        const data: any = byteArray
        var fileData = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }
        if (Items.Items.listId != undefined) {
            (async () => {
                let web = new Web(Items.Items.siteUrl);
                let item = web.lists.getById(listId).items.getById(Id);
                item.attachmentFiles.add(imageName, data);
                console.log("Attachment added");
                setUploadBtnStatus(false);
            })().catch(console.log)
        } else {
            (async () => {
                let web = new Web(Items.Items.siteUrl);
                let item = web.lists.getByTitle(listName).items.getById(Id);
                item.attachmentFiles.add(imageName, data);
                console.log("Attachment added");
                setUploadBtnStatus(false);
            })().catch(console.log)
        }
    }
    const RemoveImageFunction = (imageIndex: number, imageName: any, FunctionType: any) => {
        if (FunctionType == "Remove") {
            let tempArray: any = [];
            TaskImages?.map((imageData: any, index: number) => {
                if (index != imageIndex) {
                    tempArray.push(imageData)
                }
            })
            setTaskImages(tempArray);
        }

        if (Items.Items.listId != undefined) {
            (async () => {
                let web = new Web(Items.Items.siteUrl);
                let item = web.lists.getById(Items.Items.listId).items.getById(Items.Items.Id);
                item.attachmentFiles.getByName(imageName).delete();
                console.log("Attachment deleted");
            })().catch(console.log)
        } else {
            (async () => {
                let web = new Web(Items.Items.siteUrl);
                let item = web.lists.getByTitle(Items.Items.listName).items.getById(Items.Items.Id);
                item.attachmentFiles.getByName(imageName).delete();
                console.log("Attachment deleted");
            })().catch(console.log)
        }
    }
    const ReplaceImageFunction = (Data: any, ImageIndex: any) => {
        let ImageName = EditData.UploadedImage[ImageIndex].ImageName
        var src = Data?.data_url?.split(",")[1];
        var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
            return c.charCodeAt(0);
        }));
        const data: any = byteArray
        var fileData = '';
        for (var i = 0; i < byteArray.byteLength; i++) {
            fileData += String.fromCharCode(byteArray[i]);
        }
        if (Items.Items.siteUrl != undefined) {
            (async () => {
                let web = new Web(Items.Items.siteUrl);
                let item = web.lists.getById(Items.Items.listId).items.getById(Items.Items.Id);
                item.attachmentFiles.getByName(ImageName).setContent(data);
                console.log("Attachment Updated");
            })().catch(console.log)
        } else {
            (async () => {
                let web = new Web(Items.Items.siteUrl);
                let item = web.lists.getById(Items.Items.listName).items.getById(Items.Items.Id);
                item.attachmentFiles.getByName(ImageName).setContent(data);
                console.log("Attachment Updated");
            })().catch(console.log)
        }
        setTaskImages(EditData.UploadedImage);
    }

    const MouseHoverImageFunction = (e: any, HoverImageData: any) => {
        e.preventDefault();
        setHoverImageModal("Block");
        // let tempArray:any =[];
        // tempArray.push(HoverImageData)
        setHoverImageData([HoverImageData]);
    }
    const MouseOutImageFunction = (e: any) => {
        e.preventDefault();
        setHoverImageModal("None");
    }

    const ImageCompareFunction = (imageData: any, index: any) => {
        TaskImages[index].Checked = true;
        // // if(TaskImages[index].Checked){
        // //     TaskImages[index].Checked = false;
        // // }else{
        // //     TaskImages[index].Checked = true;
        // // }

        // if(compareImageArray.length >= 1){
        //     if(compareImageArray[0].Title != imageData.Title){
        //         compareImageArray.push(imageData)
        //     }
        // }else{
        //     compareImageArray.push(imageData);
        // }
        compareImageArray.push(imageData)
        if (compareImageArray.length == 2) {
            setImageComparePopup(true);
        }
    }
    const ImageCompareFunctionClosePopup = () => {
        setImageComparePopup(false);
        setCompareImageArray([]);
        let tempArray: any = [];
        TaskImages?.map((dataItem: any) => {
            dataItem.Checked = false
            tempArray.push(dataItem);
        })
        setTaskImages(tempArray);

    }
    const ImageCustomizeFunction = (currentImagIndex: any) => {
        setImageCustomizePopup(true)
    }
    const ImageCustomizeFunctionClosePopup = () => {
        setImageCustomizePopup(false)
    }

    const CommonClosePopupFunction = () => {
        ImageCompareFunctionClosePopup();
        ImageCustomizeFunctionClosePopup();
    }

    const openReplaceImagePopup = (index: any) => {
        setReplaceImagePopup(true);
        ReplaceImageIndex = index;
    }

    const FlorarImageReplaceComponentCallBack = (dt: any) => {
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg"
        }
        ReplaceImageData = DataObject;
        console.log("Replace Image Data ======", DataObject)
        // let arrayIndex: any = TaskImages?.length
        // TaskImages.push(DataObject)
        // if (dt.length > 0) {
        //     onUploadImageFunction(TaskImages, [arrayIndex]);
        // }
    }
    const UpdateImage = () => {
        if (ReplaceImageData != undefined && ReplaceImageIndex != undefined) {
            ReplaceImageFunction(ReplaceImageData, ReplaceImageIndex);
            setReplaceImagePopup(false);
            GetEditData();
        }
    }
    const closeReplaceImagePopup = () => {
        setReplaceImagePopup(false)
    }


    // ***************** this is for the Copy and Move Task Functions ***************

    const CopyAndMovePopupFunction = () => {
        setCopyAndMoveTaskPopup(true)
    }

    const closeCopyAndMovePopup = () => {
        setCopyAndMoveTaskPopup(false)
    }

    const selectSiteTypeFunction = (siteData: any) => {
        let tempArray: any = [];
        SiteTypeBackupArray?.map((siteItem: any) => {
            if (siteItem.Id == siteData.Id) {
                siteItem.BtnStatus = true;
                tempArray.push(siteItem);
            } else {
                siteItem.BtnStatus = false;
                tempArray.push(siteItem);
            }
        })
        setSiteTypes(tempArray);
    }

    const copyAndMoveTaskFunction = (FunctionsType: string) => {
        if (FunctionsType == "Move Task") {

        }
        if (FunctionsType == "Move Task") {

        }
    }


    // ******* this is for Change Task Component And Service Component ************

    const ChangeComponentStatus = (e: any, Type: any) => {
        if (Type == "Component") {
            setServicesTaskCheck(false);
            setComponentTaskCheck(true);
        }
        if (Type == "Service") {
            setServicesTaskCheck(true);
            setComponentTaskCheck(false);
        }
    }

    // ************** this is for Project Management Section Functions ************

    const closeProjectManagementPopup = () => {
        setProjectManagementPopup(false);
    }

    // ************** this is custom header and custom Footers section functions for panel *************

    const onRenderCustomHeaderMain = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <img className="imgWid29 pe-1 " src={Items.Items.SiteIcon} />
                    <span className="siteColor">
                        {`${EditData.TaskId} ${EditData.Title}`}
                    </span>
                </div>
                <Tooltip ComponentId="1683" />
            </div>
        );
    };

    const onRenderCustomHeaderCopyAndMoveTaskPanel = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <img className="imgWid29 pe-1 " src={Items.Items.SiteIcon} />
                    <span className="siteColor">
                        Select Site
                    </span>
                </div>
                <Tooltip ComponentId="1683" />
            </div>
        );
    };


    const onRenderCustomReplaceImageHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span className="siteColor">
                        Replace Image
                    </span>
                </div>
                <Tooltip ComponentId="1683" />
            </div>
        )
    }
    const onRenderCustomProjectManagementHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span className="siteColor">
                        Select Project
                    </span>
                </div>
                <Tooltip ComponentId="1683" />
            </div>
        )
    }

    const onRenderCustomFooterMain = () => {
        return (
            <footer className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
                <div className="d-flex justify-content-between px-4 py-2 me-3">
                    <div>
                        <div className="">
                            Created <span className="font-weight-normal siteColor">  {EditData.Created ? Moment(EditData.Created).format("DD/MM/YYYY") : ""}  </span> By <span className="font-weight-normal siteColor">
                                {EditData.Author?.Title ? EditData.Author?.Title : ''}
                            </span>
                        </div>
                        <div>
                            Last modified <span className="font-weight-normal siteColor"> {EditData.Modified ? Moment(EditData.Modified).format("DD/MM/YYYY") : ''}
                            </span> By <span className="font-weight-normal siteColor">
                                {EditData.Editor?.Title ? EditData.Editor.Title : ''}
                            </span>
                        </div>
                        <div>
                            <a className="hreflink">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" style={{ marginLeft: "-5px" }} fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                </svg>
                                <span onClick={() => deleteTaskFunction(EditData.ID)}>Delete This Item</span>
                            </a>
                            <span> | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}>
                                Copy
                                Task
                            </a>
                            <span > | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}> Move Task</a> |
                            <span>
                                {EditData.ID ?
                                    <VersionHistory taskId={EditData.Id} listId={Items.Items.listId} /> : null}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>
                                <a className="mx-2" target="_blank" data-interception="off"
                                    href={`${Items.Items.siteUrl}/SitePages/Task-Profile.aspx?taskId=${EditData.ID}&Site=${Items.Items.siteType}`}>
                                    Go To Profile Page
                                </a>
                            </span> ||
                            <span>
                                <a className="mx-2 hreflink" onClick={SaveAndAddTimeSheet} >
                                    Save & Add Time-Sheet
                                </a>
                            </span> ||

                            <span className="hreflink siteColor" onClick={() => shareThisTaskFunction(EditData)} >
                                <img className="mail-width mx-2"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_maill.png" />
                                Share This Task
                            </span> ||
                            <a target="_blank" className="mx-2" data-interception="off"
                                href={`${Items.Items.siteUrl}/Lists/${Items.Items.siteType}/EditForm.aspx?ID=${EditData.ID}`}>
                                Open Out-Of-The-Box Form
                            </a>
                            <span >
                                <button className="btn btn-primary px-3"
                                    onClick={UpdateTaskInfoFunction}>
                                    Save
                                </button>
                                <button type="button" className="btn btn-default ms-1 px-3" onClick={Items.Call}>
                                    Cancel
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
    const onRenderCustomFooterOther = () => {
        return (
            <footer className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
                <div className="me-3 d-flex justify-content-between px-4 py-2">
                    <div>
                        <div className="">
                            Created <span className="font-weight-normal siteColor">  {EditData.Created ? Moment(EditData.Created).format("DD/MM/YYYY") : ""}  </span> By <span className="font-weight-normal siteColor">
                                {EditData.Author?.Title ? EditData.Author?.Title : ''}
                            </span>
                        </div>
                        <div>
                            Last modified <span className="font-weight-normal siteColor"> {EditData.Modified ? Moment(EditData.Modified).format("DD/MM/YYYY") : ''}
                            </span> By <span className="font-weight-normal siteColor">
                                {EditData.Editor?.Title ? EditData.Editor.Title : ''}
                            </span>
                        </div>
                        <div>
                            <a className="hreflink">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" style={{ marginLeft: "-5px" }} fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                </svg>
                                <span onClick={() => deleteTaskFunction(EditData.ID)}>Delete This Item</span>
                            </a>
                            <span> | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}>
                                Copy
                                Task
                            </a>
                            <span > | </span>
                            <a className="hreflink" onClick={CopyAndMovePopupFunction}> Move Task</a> |
                            <span>
                                {EditData.ID ?
                                    <VersionHistory taskId={EditData.Id} listId={Items.Items.listId} /> : null}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>
                                <a className="mx-2" target="_blank" data-interception="off"
                                    href={`${Items.Items.siteType}/SitePages/Task-Profile.aspx?taskId=${EditData.ID}&Site=${Items.Items.siteType}`}>
                                    Go To Profile Page
                                </a>
                            </span> ||
                            <span>
                                <a className="mx-2 hreflink" onClick={SaveAndAddTimeSheet} >
                                    Save & Add Time-Sheet
                                </a>
                            </span> ||

                            <span className="hreflink siteColor" onClick={() => shareThisTaskFunction(EditData)} >
                                <img className="mail-width mx-2"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_maill.png" />
                                Share This Task
                            </span> ||
                            <a target="_blank" className="mx-2" data-interception="off"
                                href={`${Items.Items.siteType}/Lists/${Items.Items.siteType}/EditForm.aspx?ID=${EditData.ID}`}>
                                Open Out-Of-The-Box Form
                            </a>
                            <span >
                                <button type="button" className="btn btn-default ms-1 px-3" onClick={CommonClosePopupFunction}>
                                    Cancel
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
    return (
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
            {/* ***************** this is status panel *********** */}
            <Panel
                headerText={`Update Task Status`}
                isOpen={TaskStatusPopup}
                onDismiss={closeTaskStatusUpdatePopup}
                isBlocking={false}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
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
            {/* ***************** this is Save And Time Sheet panel *********** */}
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                isOpen={TimeSheetPopup}
                type={PanelType.custom}
                customWidth="850px"
                onDismiss={closeTimeSheetPopup}
                isBlocking={false}
            >
                <div className={ServicesTaskCheck ? "modal-body serviepannelgreena" : "modal-body"}>
                    <TimeEntryPopup props={Items.Items} />
                </div>
            </Panel>
            {/* ***************** this is Main Panel *********** */}
            <Panel
                type={PanelType.large}
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                onRenderHeader={onRenderCustomHeaderMain}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterMain}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
                    <div className="modal-body">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <button className="nav-link active" id="BASIC-INFORMATION" data-bs-toggle="tab" data-bs-target="#BASICINFORMATION" type="button" role="tab" aria-controls="BASICINFORMATION" aria-selected="true">
                                BASIC INFORMATION
                            </button>
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
                                                        <input className="form-check-input rounded-0" type="checkbox"
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
                                                        <input type="checkbox" className="form-check-input rounded-0 ms-2"
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
                                                    <select className="form-select" defaultValue={EditData.ItemRank} onChange={(e) => setEditData({ ...EditData, ItemRank: e.target.value })}>
                                                        {currentUsers.map(function (h: any, i: any) {
                                                            return (
                                                                <option key={i} selected={EditData.ItemRank == h.rank} value={h.rank} >{h.rankTitle}</option>
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
                                                                name="Portfolios" checked={ComponentTaskCheck}
                                                                onClick={(e) => ChangeComponentStatus(e, "Component")}
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
                                                                checked={ServicesTaskCheck}
                                                                onClick={(e) => ChangeComponentStatus(e, "Service")}
                                                                className="form-check-input" />
                                                            <label className="form-check-label mb-0">Services</label>
                                                        </span>
                                                    </label>
                                                    {smartComponentData?.length > 0 && ComponentTaskCheck || smartServicesData?.length > 0 && ServicesTaskCheck ? null :
                                                        <>
                                                            <input type="text" ng-model="SearchService"
                                                                className="form-control"
                                                                id="{{PortfoliosID}}" autoComplete="off"
                                                            />
                                                        </>
                                                    }
                                                    {smartComponentData.length > 0 && ComponentTaskCheck ? smartComponentData?.map((com: any) => {
                                                        return (
                                                            <>
                                                                <div className="d-flex block px-2 py-1" style={{ width: "85%" }}>
                                                                    <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                    <a>
                                                                        <img className="mx-2" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />
                                                                    </a>
                                                                </div>
                                                            </>
                                                        )
                                                    }) : null}
                                                    {
                                                        smartServicesData?.length > 0 && ServicesTaskCheck ? smartServicesData?.map((com: any) => {
                                                            return (
                                                                <>
                                                                    <div className="d-flex block px-2 py-1" style={{ width: "85%" }}>
                                                                        <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                        <a>
                                                                            <img className="mx-2" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />
                                                                        </a>
                                                                    </div>
                                                                </>
                                                            )
                                                        }) : null
                                                    }

                                                    <span className="input-group-text">
                                                        {ComponentTaskCheck ? <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                            onClick={(e) => EditComponent(EditData, 'Component')} /> : null}
                                                        {ServicesTaskCheck ? <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                            onClick={(e) => EditLinkedServices(EditData, 'Services')} /> : null}
                                                        {ComponentTaskCheck == false && ServicesTaskCheck == false ? <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                            onClick={(e) => alert("Please select anyone from Portfolio/Services")} /> : null}

                                                    </span>
                                                </div>
                                                <div className="input-group mb-2">
                                                    <label className="form-label full-width">
                                                        Categories
                                                    </label>
                                                    <input type="text" className="form-control"
                                                        id="txtCategories" value={categorySearchKey} onChange={(e) => autoSuggestionsForCategory(e)} />
                                                    <span className="input-group-text">
                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                            onClick={(e) => EditComponentPicker(EditData, 'Categories')} />
                                                    </span>
                                                </div>
                                                {SearchedCategoryData?.length > 0 ? (
                                                    <div className="SmartTableOnTaskPopup">
                                                        <ul className="list-group">
                                                            {SearchedCategoryData.map((item: any) => {
                                                                return (
                                                                    <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item])} >
                                                                        <a>{item.Newlabel}</a>
                                                                    </li>
                                                                )
                                                            }
                                                            )}
                                                        </ul>
                                                    </div>) : null}
                                                <div className="col">
                                                    <div className="col">
                                                        <div
                                                            className="form-check">
                                                            <input className="form-check-input rounded-0"
                                                                name="Phone"
                                                                type="checkbox" checked={PhoneStatus}
                                                                value={`${PhoneStatus}`}
                                                                onClick={(e) => CategoryChange(e, "Phone", 199)}
                                                            />
                                                            <label className="form-check-label">Phone</label>
                                                        </div>
                                                        <div
                                                            className="form-check">
                                                            <input className="form-check-input rounded-0"
                                                                type="checkbox"
                                                                checked={EmailStatus}
                                                                value={`${EmailStatus}`}
                                                                onClick={(e) => CategoryChange(e, "Email", 276)}
                                                            />
                                                            <label>Email Notification</label>
                                                            <div className="form-check ms-2">
                                                                <input className="form-check-input rounded-0"
                                                                    type="checkbox"
                                                                    checked={OnlyCompletedStatus}
                                                                    value={`${OnlyCompletedStatus}`}
                                                                    onClick={(e) => CategoryChange(e, "Only Completed", 565)}
                                                                />
                                                                <label>Only Completed</label>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="form-check">
                                                            <input className="form-check-input rounded-0"
                                                                type="checkbox"
                                                                checked={ImmediateStatus}
                                                                value={`${ImmediateStatus}`}
                                                                onClick={(e) => CategoryChange(e, "Immediate", 228)} />
                                                            <label>Immediate</label>
                                                        </div>
                                                        {ShareWebTypeData != undefined && ShareWebTypeData?.length > 0 ?
                                                            <div>
                                                                {ShareWebTypeData?.map((type: any, index: number) => {
                                                                    if (type.Title != "Phone" && type.Title != "Email Notification" && type.Title != "Immediate" && type.Title != "Approval" && type.Title != "Email" && type.Title != "Only Completed") {
                                                                        return (
                                                                            <div className="block px-2 py-1 d-flex my-1 justify-content-between">
                                                                                <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?${EditData.Id}`}>
                                                                                    {type.Title}
                                                                                </a>
                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => removeCategoryItem(type.Title, type.Id)} className="p-1" />
                                                                            </div>
                                                                        )
                                                                    }

                                                                })}
                                                            </div> : null
                                                        }
                                                    </div>
                                                    <div className="form-check ">
                                                        <label className="full-width">Approval</label>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input rounded-0"
                                                            name="Approval"
                                                            checked={ApprovalStatus}
                                                            value={`${ApprovalStatus}`}
                                                            onClick={(e) => CategoryChange(e, "Approval", 227)}

                                                        />
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
                                                    {ApprovalStatus ?
                                                        <div>
                                                            {EditData.TaskApprovers?.map((Approver: any, index: number) => {
                                                                return (
                                                                    <div className="block px-2 py-1 d-flex my-1 justify-content-between">
                                                                        {/* href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?${EditData.Id}`} */}
                                                                        <div>
                                                                            <a style={{ color: "#fff !important" }} target="_blank" data-interception="off">
                                                                                {Approver.Title}
                                                                            </a>
                                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"
                                                                                onClick={() => removeApproverFunction(Approver.Title, Approver.Id)} className="p-1"
                                                                            />
                                                                        </div>
                                                                        {index == 0 ? <span className="float-end ">
                                                                            <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                                onClick={() => alert("We are working on It. This feature will be live soon...")} />
                                                                        </span> : null}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div> : null
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-6 ps-0 pe-0 pt-4">
                                                <div>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control"
                                                            placeholder="Priority"
                                                            defaultValue={EditData.Priority_x0020_Rank ? EditData.Priority_x0020_Rank : ''}
                                                            onChange={(e) => setEditData({ ...EditData, Priority_x0020_Rank: e.target.value })}
                                                        />
                                                    </div>
                                                    <ul className="p-0 mt-1">
                                                        <li className="form-check">
                                                            <input className="form-check-input"
                                                                name="radioPriority" type="radio"
                                                                checked={EditData.Priority_x0020_Rank <= 10 && EditData.Priority_x0020_Rank >= 8}
                                                                onChange={() => setEditData({ ...EditData, Priority_x0020_Rank: 8 })}
                                                            />
                                                            <label className="form-check-label">High</label>
                                                        </li>
                                                        <li className="form-check">
                                                            <input className="form-check-input" name="radioPriority"
                                                                type="radio" checked={EditData.Priority_x0020_Rank <= 7 && EditData.Priority_x0020_Rank >= 4}
                                                                onChange={() => setEditData({ ...EditData, Priority_x0020_Rank: 4 })}
                                                            />
                                                            <label className="form-check-label">Normal</label>
                                                        </li>
                                                        <li className="form-check">
                                                            <input className="form-check-input" name="radioPriority"
                                                                type="radio" checked={EditData.Priority_x0020_Rank <= 3 && EditData.Priority_x0020_Rank >= 0}
                                                                onChange={() => setEditData({ ...EditData, Priority_x0020_Rank: 1 })}
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
                                                <div className="col-12" title="Relevant Portfolio Items">
                                                    <div className="input-group">
                                                        <label className="form-label full-width "> Linked Component Task </label>
                                                        <input type="text" readOnly
                                                            className="form-control "
                                                        />
                                                        <span className="input-group-text">
                                                            <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                onClick={(e) => alert("We are working on It. This Feature Will Be Live Soon...")} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12 mb-2">
                                                    {ComponentTaskCheck ?
                                                        <div >
                                                            <div className="input-group">
                                                                <label className="form-label full-width">
                                                                    Linked Service
                                                                </label>
                                                                <input type="text"
                                                                    className="form-control "
                                                                />
                                                                <span className="input-group-text">
                                                                    <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                        onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")} />
                                                                </span>
                                                            </div>
                                                            {
                                                                smartServicesData?.length > 0 ?
                                                                    <div>
                                                                        {smartServicesData?.map((com: any) => {
                                                                            return (
                                                                                <div>
                                                                                    <div className="d-flex block px-2 py-1">
                                                                                        <div>
                                                                                            <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                                {com.Title}
                                                                                            </a>
                                                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartServicesData([])} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div> :
                                                                    null
                                                            }

                                                        </div> : null}
                                                    {ServicesTaskCheck ? <div >
                                                        <div className="input-group">
                                                            <label className="form-label full-width">
                                                                Linked Component
                                                            </label>
                                                            <input type="text"
                                                                className="form-control "
                                                            />
                                                            <span className="input-group-text">
                                                                <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                    onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")} />
                                                            </span>
                                                        </div>

                                                        {
                                                            smartComponentData?.length > 0 ? <div>
                                                                {smartComponentData?.map((com: any) => {
                                                                    return (
                                                                        <div>
                                                                            <div className="d-flex block px-2 py-1">
                                                                                <div>
                                                                                    <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                        {com.Title}
                                                                                    </a>
                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div> :
                                                                null
                                                        }

                                                    </div> : null}

                                                </div>
                                                <div className="col-12">
                                                    <div className="input-group">
                                                        <label className="form-label full-width">
                                                            Project
                                                        </label>
                                                        <input type="text"
                                                            className="form-control "
                                                        />
                                                        <span className="input-group-text">
                                                            <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                onClick={() => setProjectManagementPopup(true)} title="Project Items Popup" />
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-12 mb-2">
                                            <div className="input-group">
                                                <label className="form-label full-width ">Relevant URL</label>
                                                <input type="text" className="form-control" defaultValue={EditData.component_x0020_link != null ? EditData.Relevant_Url : ''} placeholder="Url" onChange={(e) => setEditData({ ...EditData, Relevant_Url: e.target.value })}
                                                />
                                                <span className={EditData.component_x0020_link != null ? "input-group-text" : "input-group-text Disabled-Link"}>
                                                    <a target="_blank" href={EditData.component_x0020_link != null ? EditData.component_x0020_link.Url : ''} data-interception="off"
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

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="input-group">
                                                <label className="form-label full-width">Status</label>
                                                <input type="text" placeholder="% Complete" disabled={InputFieldDisable} className="form-control px-2"
                                                    defaultValue={PercentCompleteCheck ? (EditData.PercentComplete != undefined ? EditData.PercentComplete : null) : (UpdateTaskInfo.PercentCompleteStatus ? UpdateTaskInfo.PercentCompleteStatus : null)}

                                                    onChange={(e) => StatusAutoSuggestion(e)} />
                                                <span className="input-group-text" onClick={() => openTaskStatusUpdatePopup(EditData)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 48 48" fill="none">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                                    </svg>
                                                </span>

                                                {PercentCompleteStatus?.length > 0 ?
                                                    <span className="full-width">
                                                        <input type='radio' className="form-check-input my-2" checked />
                                                        <label className="ps-2 pt-1">
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
                                                                    href={`${Items.Items.siteType}/SitePages/TeamLeader-Dashboard.aspx?UserId=${userDtl.AssingedToUserId}&Name=${userDtl.Title}`} >
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
                                    <div className={IsShowFullViewImage != true ?
                                        'col-sm-3 padL-0 DashboardTaskPopup-Editor above' :
                                        'col-sm-6  padL-0 DashboardTaskPopup-Editor above'}>
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
                                                                        <input type="checkbox" className="rounded-0" checked={ImageDtl.Checked} onClick={() => ImageCompareFunction(ImageDtl, index)} />
                                                                        <span className="mx-1">{ImageDtl.ImageName ? ImageDtl.ImageName.slice(0, 24) : ''}</span>
                                                                    </div>
                                                                    <a href={ImageDtl.ImageUrl} target="_blank" data-interception="off">
                                                                        <img src={ImageDtl.ImageUrl ? ImageDtl.ImageUrl : ''} onMouseOver={(e) => MouseHoverImageFunction(e, ImageDtl)}
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

                                                                            <span onClick={() => openReplaceImagePopup(index)} title="Replace image"><TbReplace /> </span>
                                                                            <span className="mx-1" title="Delete" onClick={() => RemoveImageFunction(index, ImageDtl.ImageName, "Remove")}> | <RiDeleteBin6Line /> | </span>
                                                                            <span title="Customize the width of page" onClick={() => ImageCustomizeFunction(index)}>
                                                                                <FaExpandAlt />
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
                                                                    onClick={() => setUploadBtnStatus(UploadBtnStatus ? false : true)}>
                                                                    Add New Image
                                                                </span>
                                                                : null}
                                                        </div>
                                                        {UploadBtnStatus ?
                                                            <div>
                                                                {/* <div className="drag-upload-image mt-1"
                                                                    style={isDragging ? { border: '1px solid red' } : undefined}
                                                                    onClick={onImageUpload}
                                                                    {...dragProps}
                                                                >
                                                                    Drop here Or <span className="siteColor" style={{ cursor: "pointer" }} >Click Here To Upload</span>
                                                                </div> */}
                                                                <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} />

                                                            </div> : null}
                                                        {TaskImages?.length == 0 ? <div>
                                                            {/* <div className="drag-upload-image mt-1"
                                                                style={isDragging ? { border: '1px solid red' } : undefined}
                                                                onClick={onImageUpload}
                                                                {...dragProps}
                                                            >
                                                                Drop here Or <span className="siteColor" style={{ cursor: "pointer" }} >Click Here To Upload</span>
                                                            </div> */}
                                                            <FlorarImageUploadComponent callBack={FlorarImageUploadComponentCallBack} />

                                                        </div> : null}
                                                        {/* <div>
                                                            <FlorarImageUploadComponent />
                                                        </div> */}

                                                        {/* <button onClick={onImageRemoveAll}>Upload item-images</button> */}

                                                    </div>

                                                )}
                                            </ImageUploading>
                                        </div>
                                    </div>
                                    <div className={IsShowFullViewImage != true ? 'col-sm-9 toggle-task' : 'col-sm-6 editsectionscroll toggle-task'}>
                                        {EditData.Id != null ? <>
                                            <CommentBoxComponent
                                                data={EditData.FeedBackArray}
                                                callBack={CommentSectionCallBack}
                                                allUsers={taskUsers}
                                                ApprovalStatus={ApprovalStatus}
                                                SmartLightStatus={SmartLightStatus}
                                                SmartLightPercentStatus={SmartLightPercentStatus}
                                            />
                                            <Example
                                                textItems={EditData.FeedBackArray}
                                                callBack={SubCommentSectionCallBack}
                                                allUsers={taskUsers}
                                                ItemId={EditData.Id}
                                                SiteUrl={EditData.component_x0020_link}
                                                ApprovalStatus={ApprovalStatus}
                                                SmartLightStatus={SmartLightStatus}
                                                SmartLightPercentStatus={SmartLightPercentStatus}

                                            />
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

                    {IsComponent && <ComponentPortPolioPopup props={ShareWebComponent} Call={Call}>
                    </ComponentPortPolioPopup>}
                    {IsComponentPicker && <Picker props={ShareWebComponent} usedFor="Task-Popup" CallBack={SelectCategoryCallBack} closePopupCallBack={smartCategoryPopup}></Picker>}
                    {IsServices && <LinkedComponent props={ShareWebComponent} Call={Call} PopupType={ServicePopupType}></LinkedComponent>}
                </div>
            </Panel>
            {/* ***************** this is Image compare panel *********** */}
            <Panel
                isOpen={ImageComparePopup}
                type={PanelType.custom}
                customWidth="100%"
                onRenderHeader={onRenderCustomHeaderMain}
                onDismiss={ImageCompareFunctionClosePopup}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterOther}
            >
                <div className="modal-body">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <button className="nav-link active" id="IMAGE-INFORMATION" data-bs-toggle="tab" data-bs-target="#IMAGEINFORMATION" type="button" role="tab" aria-controls="IMAGEINFORMATION" aria-selected="true">
                            BASIC INFORMATION
                        </button>
                        <button className="nav-link" id="IMAGE-TIME-SHEET" data-bs-toggle="tab" data-bs-target="#IMAGETIMESHEET" type="button" role="tab" aria-controls="IMAGETIMESHEET" aria-selected="false">TIMESHEET</button>
                    </ul>
                    <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                        <div className="tab-pane show active" id="IMAGEINFORMATION" role="tabpanel" aria-labelledby="IMAGEINFORMATION">
                            <div className="image-section row">
                                <div className="single-image-section col-sm-6 p-2" style={{
                                    border: "2px solid #ccc"
                                }}>
                                    <img src={compareImageArray?.length > 0 ? compareImageArray[0]?.ImageUrl : ""} className='img-fluid card-img-top' />
                                    <div className="card-footer d-flex justify-content-between p-1 px-2">
                                        <div>
                                            <span className="mx-1">{compareImageArray[0]?.ImageName ? compareImageArray[0]?.ImageName.slice(0, 6) : ''}</span>
                                            <span className="fw-semibold">{compareImageArray[0]?.UploadeDate ? compareImageArray[0]?.UploadeDate : ''}</span>
                                            <span className="mx-1">
                                                <img style={{ width: "25px" }} src={compareImageArray[0]?.UserImage ? compareImageArray[0]?.UserImage : ''} />
                                            </span>
                                        </div>
                                        <div>
                                            <span className="mx-1"> <TbReplace /> |</span>
                                            <span><RiDeleteBin6Line /></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="slider-image-section col-sm-6 p-2" style={{
                                    border: "2px solid #ccc"
                                }}>
                                    <div id="carouselExampleControls" className="carousel slide" data-bs-interval="false">
                                        <div className="carousel-inner">
                                            {TaskImages?.map((imgData: any, index: any) => {
                                                return (
                                                    <div className={index == 0 ? "carousel-item active" : "carousel-item"}>
                                                        <img src={imgData.ImageUrl} className="d-block w-100" alt="..." />
                                                        <div className="card-footer d-flex justify-content-between p-1 px-2">
                                                            <div>
                                                                <span className="mx-1">{imgData.ImageName ? imgData.ImageName.slice(0, 6) : ''}</span>
                                                                <span className="fw-semibold">{imgData.UploadeDate ? imgData.UploadeDate : ''}</span>
                                                                <span className="mx-1">
                                                                    <img style={{ width: "25px" }} src={imgData.UserImage ? imgData.UserImage : ''} />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="mx-1"> <TbReplace /> |</span>
                                                                <span><RiDeleteBin6Line /></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev" data-bs-interval="false">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next" data-bs-interval="false">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => alert("we are working on it. This feature will be live soon..")}>Upload Image</h6>
                                    <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => alert("we are working on it. This feature will be live soon..")}>Add New Image</h6>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane " id="IMAGETIMESHEET" role="tabpanel" aria-labelledby="IMAGETIMESHEET">
                            <div>
                                <NewTameSheetComponent props={Items}
                                    TeamConfigDataCallBack={getTeamConfigData}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </Panel>
            {/* ***************** this is Image customize panel *********** */}
            <Panel
                onRenderHeader={onRenderCustomHeaderMain}
                isOpen={ImageCustomizePopup}
                type={PanelType.custom}
                customWidth="100%"
                onDismiss={ImageCustomizeFunctionClosePopup}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterOther}
            >
                <div className={ServicesTaskCheck ? "modal-body serviepannelgreena" : "modal-body"}>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <button className="nav-link active" id="IMAGE-INFORMATION" data-bs-toggle="tab" data-bs-target="#IMAGEINFORMATION" type="button" role="tab" aria-controls="IMAGEINFORMATION" aria-selected="true">
                            BASIC INFORMATION
                        </button>
                        <button className="nav-link" id="IMAGE-TIME-SHEET" data-bs-toggle="tab" data-bs-target="#IMAGETIMESHEET" type="button" role="tab" aria-controls="IMAGETIMESHEET" aria-selected="false">TIMESHEET</button>
                    </ul>
                    <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                        <div className="tab-pane show active" id="IMAGEINFORMATION" role="tabpanel" aria-labelledby="IMAGEINFORMATION">
                            <div className="image-section row">
                                {ShowTaskDetailsStatus ?
                                    <div>
                                        <h6 className="siteColor mb-3" style={{ cursor: "pointer" }} onClick={() => setShowTaskDetailsStatus(ShowTaskDetailsStatus ? false : true)}>
                                            Show task details -
                                        </h6>
                                        <div>
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <div className="col-12 ">
                                                        <div className="input-group">
                                                            <label className="d-flex justify-content-between align-items-center mb-0  full-width">Title
                                                                <span className="form-check">
                                                                    <input className="form-check-input rounded-0" type="checkbox"
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
                                                                    <input type="checkbox" className="form-check-input rounded-0 ms-2"
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
                                                                <select className="form-select" defaultValue={EditData.ItemRank} onChange={(e) => setItemRank(e.target.value)}>
                                                                    {currentUsers.map(function (h: any, i: any) {
                                                                        return (
                                                                            <option key={i} selected={EditData.ItemRank == h.rank} value={h.rank} >{h.rankTitle}</option>
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
                                                                            name="Portfolios" checked={ComponentTaskCheck}
                                                                            title="Component"
                                                                            ng-model="PortfolioTypes"
                                                                            ng-click="getPortfoliosData()"
                                                                            className="form-check-input " />
                                                                        <label className="form-check-label mb-0">Component</label>
                                                                    </span>
                                                                    <span className="form-check form-check-inline mb-0">
                                                                        <input type="radio" id="Services"
                                                                            name="Portfolios" value="Services"
                                                                            title="Services"
                                                                            checked={ServicesTaskCheck}
                                                                            className="form-check-input" />
                                                                        <label className="form-check-label mb-0">Services</label>
                                                                    </span>
                                                                </label>
                                                                {smartComponentData?.length > 0 || smartServicesData?.length > 0 ? null :
                                                                    <>
                                                                        <input type="text" ng-model="SearchService"
                                                                            className="form-control"
                                                                            id="{{PortfoliosID}}" autoComplete="off"
                                                                        />
                                                                    </>
                                                                }
                                                                {smartComponentData.length > 0 && ComponentTaskCheck ? smartComponentData?.map((com: any) => {
                                                                    return (
                                                                        <>
                                                                            <div className="d-flex block px-2 py-1" style={{ width: "85%" }}>
                                                                                <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                                <a>
                                                                                    <img className="mx-2" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />
                                                                                </a>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                }) : <>
                                                                    <input type="text" ng-model="SearchService"
                                                                        className="form-control"
                                                                        id="{{PortfoliosID}}" autoComplete="off"
                                                                    />
                                                                </>}
                                                                {
                                                                    smartServicesData?.length > 0 && ServicesTaskCheck ? smartServicesData?.map((com: any) => {
                                                                        return (
                                                                            <>
                                                                                <div className="d-flex block px-2 py-1" style={{ width: "85%" }}>
                                                                                    <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                                                    <a>
                                                                                        <img className="mx-2" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />
                                                                                    </a>
                                                                                </div>
                                                                            </>
                                                                        )
                                                                    }) : <>
                                                                        <input type="text" ng-model="SearchService"
                                                                            className="form-control"
                                                                            id="{{PortfoliosID}}" autoComplete="off"
                                                                        />
                                                                    </>
                                                                }

                                                                <span className="input-group-text">
                                                                    {ComponentTaskCheck ? <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                        onClick={(e) => EditComponent(EditData, 'Component')} /> : null}
                                                                    {ServicesTaskCheck ? <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                        onClick={(e) => EditLinkedServices(EditData, 'Services')} /> : null}
                                                                    {ComponentTaskCheck == false && ServicesTaskCheck == false ? <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                        onClick={(e) => alert("Please select anyone from Portfolio/Services")} /> : null}

                                                                </span>
                                                            </div>
                                                            <div className="input-group mb-2">
                                                                <label className="form-label full-width">
                                                                    Categories
                                                                </label>
                                                                <input type="text" className="form-control"
                                                                    id="txtCategories" value={categorySearchKey} onChange={(e) => autoSuggestionsForCategory(e)} />
                                                                <span className="input-group-text">
                                                                    <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                        onClick={(e) => EditComponentPicker(EditData, 'Categories')} />
                                                                </span>
                                                            </div>
                                                            {SearchedCategoryData?.length > 0 ? (
                                                                <div className="SmartTableOnTaskPopup">
                                                                    <ul className="list-group">
                                                                        {SearchedCategoryData.map((item: any) => {
                                                                            return (
                                                                                <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => setSelectedCategoryData([item])} >
                                                                                    <a>{item.Newlabel}</a>
                                                                                </li>
                                                                            )
                                                                        }
                                                                        )}
                                                                    </ul>
                                                                </div>) : null}
                                                            <div className="col">
                                                                <div className="col">
                                                                    <div
                                                                        className="form-check">
                                                                        <input className="form-check-input rounded-0"
                                                                            name="Phone"
                                                                            type="checkbox" checked={PhoneStatus}
                                                                            value={`${PhoneStatus}`}
                                                                            onClick={(e) => CategoryChange(e, "Phone", 199)}
                                                                        />
                                                                        <label className="form-check-label">Phone</label>
                                                                    </div>
                                                                    <div
                                                                        className="form-check">
                                                                        <input className="form-check-input rounded-0"
                                                                            type="checkbox"
                                                                            checked={EmailStatus}
                                                                            value={`${EmailStatus}`}
                                                                            onClick={(e) => CategoryChange(e, "Email", 276)}
                                                                        />
                                                                        <label>Email Notification</label>
                                                                        <div className="form-check ms-2">
                                                                            <input className="form-check-input rounded-0"
                                                                                type="checkbox"
                                                                                checked={OnlyCompletedStatus}
                                                                                value={`${OnlyCompletedStatus}`}
                                                                                onClick={(e) => CategoryChange(e, "Only Completed", 565)}
                                                                            />
                                                                            <label>Only Completed</label>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="form-check">
                                                                        <input className="form-check-input rounded-0"
                                                                            type="checkbox"
                                                                            checked={ImmediateStatus}
                                                                            value={`${ImmediateStatus}`}
                                                                            onClick={(e) => CategoryChange(e, "Immediate", 228)} />
                                                                        <label>Immediate</label>
                                                                    </div>
                                                                    {ShareWebTypeData != undefined && ShareWebTypeData?.length > 0 ?
                                                                        <div>
                                                                            {ShareWebTypeData?.map((type: any, index: number) => {
                                                                                if (type.Title != "Phone" && type.Title != "Email Notification" && type.Title != "Immediate" && type.Title != "Approval" && type.Title != "Email" && type.Title != "Only Completed") {
                                                                                    return (
                                                                                        <div className="block px-2 py-1 d-flex my-1 justify-content-between">
                                                                                            <a style={{ color: "#fff !important" }} target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?${EditData.Id}`}>
                                                                                                {type.Title}
                                                                                            </a>
                                                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => removeCategoryItem(type.Title, type.Id)} className="p-1" />
                                                                                        </div>
                                                                                    )
                                                                                }

                                                                            })}
                                                                        </div> : null
                                                                    }
                                                                </div>
                                                                <div className="form-check ">
                                                                    <label className="full-width">Approval</label>
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input rounded-0"
                                                                        name="Approval"
                                                                        checked={ApprovalStatus}
                                                                        value={`${ApprovalStatus}`}
                                                                        onClick={(e) => CategoryChange(e, "Approval", 227)}

                                                                    />
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
                                                                            className="form-check-input " />
                                                                    </div>
                                                                </div>

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
                                                                {ComponentTaskCheck ?
                                                                    <div className="input-group">
                                                                        <label className="form-label full-width">
                                                                            Linked Service
                                                                        </label>
                                                                        {
                                                                            smartServicesData?.length > 0 ? <div>
                                                                                {smartServicesData?.map((com: any) => {
                                                                                    return (
                                                                                        <>
                                                                                            <div className="d-flex block px-2 py-1">

                                                                                                <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                                    {com.Title}
                                                                                                </a>
                                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartServicesData([])} />

                                                                                            </div>
                                                                                        </>
                                                                                    )
                                                                                })}
                                                                            </div> :
                                                                                <input type="text"
                                                                                    className="form-control"
                                                                                />
                                                                        }
                                                                        <span className="input-group-text">
                                                                            <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                                onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")} />
                                                                        </span>
                                                                    </div> : null}
                                                                {ServicesTaskCheck ? <div className="input-group">
                                                                    <label className="form-label full-width">
                                                                        Linked Component
                                                                    </label>
                                                                    {
                                                                        smartComponentData?.length > 0 ? <div>
                                                                            {smartComponentData?.map((com: any) => {
                                                                                return (
                                                                                    <>
                                                                                        <div className="d-flex block px-2 py-1">

                                                                                            <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                                {com.Title}
                                                                                            </a>
                                                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />

                                                                                        </div>
                                                                                    </>
                                                                                )
                                                                            })}
                                                                        </div> :
                                                                            <input type="text"
                                                                                className="form-control"
                                                                            />
                                                                    }
                                                                    <span className="input-group-text">
                                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                            onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")} />
                                                                    </span>
                                                                </div> : null}

                                                            </div>

                                                            <div className="col-12" title="Relevant Portfolio Items">
                                                                <div className="input-group">
                                                                    <label className="form-label full-width "> Linked Component Task </label>
                                                                    <input type="text"
                                                                        className="form-control "
                                                                        readOnly
                                                                        autoComplete="off" />
                                                                    <span className="input-group-text">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mb-2">
                                                                {ComponentTaskCheck ?
                                                                    <div >
                                                                        <div className="input-group">
                                                                            <label className="form-label full-width">
                                                                                Linked Service
                                                                            </label>
                                                                            <input type="text"
                                                                                className="form-control "
                                                                            />
                                                                            <span className="input-group-text">
                                                                                <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                                    onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")} />
                                                                            </span>
                                                                        </div>
                                                                        {
                                                                            smartServicesData?.length > 0 ?
                                                                                <div>
                                                                                    {smartServicesData?.map((com: any) => {
                                                                                        return (
                                                                                            <div>
                                                                                                <div className="d-flex block px-2 py-1">

                                                                                                    <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                                        {com.Title}
                                                                                                    </a>
                                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartServicesData([])} />

                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div> :
                                                                                null
                                                                        }

                                                                    </div> : null}
                                                                {ServicesTaskCheck ? <div >
                                                                    <div className="input-group">
                                                                        <label className="form-label full-width">
                                                                            Linked Component
                                                                        </label>
                                                                        <input type="text"
                                                                            className="form-control "
                                                                        />
                                                                        <span className="input-group-text">
                                                                            <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                                onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")} />
                                                                        </span>
                                                                    </div>

                                                                    {
                                                                        smartComponentData?.length > 0 ? <div>
                                                                            {smartComponentData?.map((com: any) => {
                                                                                return (
                                                                                    <div>
                                                                                        <div className="d-flex block px-2 py-1">

                                                                                            <a className="hreflink " target="_blank" data-interception="off" href={`${Items.Items.siteType}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                                                {com.Title}
                                                                                            </a>
                                                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />

                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div> :
                                                                            null
                                                                    }

                                                                </div> : null}

                                                            </div>
                                                            <div className="col-12">
                                                                <div className="input-group">
                                                                    <label className="form-label full-width">
                                                                        Project
                                                                    </label>
                                                                    <input type="text"
                                                                        className="form-control "
                                                                    />
                                                                    <span className="input-group-text">
                                                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                                                            onClick={(e) => alert("We Are Working On This Feature. It Will Be Live Soon...")} title="Project Items Popup" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 mb-2">
                                                        <div className="input-group">
                                                            <label className="form-label full-width ">Relevant URL</label>
                                                            <input type="text" className="form-control" defaultValue={EditData.component_x0020_link != null ? EditData.Relevant_Url : ''} placeholder="Url" onChange={(e) => setEditData({ ...EditData, Relevant_Url: e.target.value })}
                                                            />
                                                            <span className={EditData.component_x0020_link != null ? "input-group-text " : "input-group-text Disabled-Link"}>
                                                                <a target="_blank" href={EditData.component_x0020_link != null ? EditData.component_x0020_link.Url : ''} data-interception="off"
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

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="input-group">
                                                            <label className="form-label full-width">Status</label>
                                                            <input type="text" placeholder="% Complete" className="form-control px-2" disabled={InputFieldDisable}
                                                                defaultValue={PercentCompleteCheck ? (EditData.PercentComplete != undefined ? EditData.PercentComplete : null) : (UpdateTaskInfo.PercentCompleteStatus ? UpdateTaskInfo.PercentCompleteStatus : null)}

                                                                onChange={(e) => StatusAutoSuggestion(e)} />
                                                            <span className="input-group-text" onClick={() => openTaskStatusUpdatePopup(EditData)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 48 48" fill="none">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                                                </svg>
                                                            </span>

                                                            {PercentCompleteStatus?.length > 0 ?
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
                                                                                href={`${Items.Items.siteType}/SitePages/TeamLeader-Dashboard.aspx?UserId=${userDtl.AssingedToUserId}&Name=${userDtl.Title}`} >
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
                                        </div>
                                    </div> : null
                                }
                                <div className="slider-image-section col-sm-6 p-2" style={{
                                    border: "2px solid #ccc"
                                }}>
                                    {
                                        ShowTaskDetailsStatus ? null : <div className="mb-3">
                                            <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => setShowTaskDetailsStatus(ShowTaskDetailsStatus ? false : true)}>
                                                Show task details +
                                            </h6>
                                        </div>
                                    }

                                    <div id="carouselExampleControls" className="carousel slide" data-bs-interval="false">
                                        <div className="carousel-inner">
                                            {TaskImages?.map((imgData: any, index: any) => {
                                                return (
                                                    <div className={index == 0 ? "carousel-item active" : "carousel-item"}>
                                                        <img src={imgData.ImageUrl} className="d-block w-100" alt="..." />
                                                        <div className="card-footer d-flex justify-content-between p-1 px-2">
                                                            <div>
                                                                <span className="mx-1">{imgData.ImageName ? imgData.ImageName.slice(0, 6) : ''}</span>
                                                                <span className="fw-semibold">{imgData.UploadeDate ? imgData.UploadeDate : ''}</span>
                                                                <span className="mx-1">
                                                                    <img style={{ width: "25px" }} src={imgData.UserImage ? imgData.UserImage : ''} />
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="mx-1"><TbReplace /> |</span>
                                                                <span><RiDeleteBin6Line /></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev" data-bs-interval="false">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next" data-bs-interval="false">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => alert("we are working on it. This feature will be live soon..")}>Upload Image</h6>
                                        <h6 className="siteColor" style={{ cursor: "pointer" }} onClick={() => alert("we are working on it. This feature will be live soon..")}>Add New Image</h6>
                                    </div>
                                </div>
                                <div className="comment-section col-sm-6 p-2" style={{
                                    overflowY: "auto",
                                    height: "600px",
                                    overflowX: "hidden",
                                    border: "2px solid #ccc"
                                }}>
                                    <div>
                                        {EditData.Title != null ? <>
                                            <CommentBoxComponent
                                                data={EditData.FeedBackArray}
                                                callBack={CommentSectionCallBack}
                                                allUsers={taskUsers}
                                                ApprovalStatus={ApprovalStatus}
                                                SmartLightStatus={SmartLightStatus}
                                            />
                                            <Example textItems={EditData.FeedBackArray}
                                                callBack={SubCommentSectionCallBack}
                                                allUsers={taskUsers}
                                                ItemId={EditData.Id}
                                                SiteUrl={EditData.component_x0020_link}
                                                ApprovalStatus={ApprovalStatus}
                                                SmartLightStatus={SmartLightStatus}
                                            />
                                        </>
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane " id="IMAGETIMESHEET" role="tabpanel" aria-labelledby="IMAGETIMESHEET">
                            <div>
                                <NewTameSheetComponent props={Items}
                                    TeamConfigDataCallBack={getTeamConfigData}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </Panel>

            {/* ********************** this in hover image modal ****************** */}
            <div className={ServicesTaskCheck ? "hoverImageModal serviepannelgreena" : "hoverImageModal"} style={{ display: hoverImageModal }}>
                <div className="hoverImageModal-popup">
                    <div className="hoverImageModal-container">
                        <span style={{ color: 'white' }}>{HoverImageData[0]?.ImageName}</span>
                        <img className="img-fluid" style={{ width: '100%', height: "450px" }} src={HoverImageData[0]?.ImageUrl}></img>
                    </div>
                    <footer className="justify-content-between d-flex pb-1 mx-2" style={{ color: "white" }}>
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

            {/* ********************* this is Copy Task And Move Task panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomHeaderCopyAndMoveTaskPanel}
                isOpen={CopyAndMoveTaskPopup}
                type={PanelType.custom}
                customWidth="700px"
                onDismiss={closeCopyAndMovePopup}
                isBlocking={false}
            >
                <div className="modal-body">
                    <div className={ServicesTaskCheck ? " serviepannelgreena" : ""} >
                        <div className="col-md-12 p-3 select-sites-section">
                            <div className="card rounded-0 mb-10">
                                <div className="card-header">
                                    <h6>Sites</h6>
                                </div>
                                <div className="card-body">
                                    <ul className="quick-actions">
                                        {SiteTypes?.map((siteData: any, index: number) => {
                                            return (
                                                <li key={siteData.Id} className={`mx-1 p-2 position-relative  text-center  mb-2 ${siteData.BtnStatus ? "selectedSite" : "bg-siteColor"}`}>
                                                    <a className="text-white text-decoration-none" onClick={() => selectSiteTypeFunction(siteData)} style={{ fontSize: "12px" }}>
                                                        <span className="icon-sites">
                                                            <img className="icon-sites" src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} />
                                                        </span> {siteData.Title}
                                                    </a>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-primary px-3 float-end" onClick={() => alert("We are working on it. This feature will be live soon .....")}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-default me-1 float-end px-3"
                                        onClick={closeCopyAndMovePopup}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>

            {/* ********************* this is Replace Image panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomReplaceImageHeader}
                isOpen={replaceImagePopup}
                onDismiss={closeReplaceImagePopup}
                isBlocking={false}
                type={PanelType.custom}
                customWidth="500px"

            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
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

            {/* ********************* this is Replace Image panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomProjectManagementHeader}
                isOpen={ProjectManagementPopup}
                onDismiss={closeProjectManagementPopup}
                isBlocking={false}
                type={PanelType.custom}
                customWidth="1100px"
            >
                <h6>We are working on it. This feature will be live soon .....</h6>
            </Panel>

        </div>
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
