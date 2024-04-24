import { Panel, PanelType } from "office-ui-fabric-react";
import { Web } from "sp-pnp-js";
import React, { useState } from "react";
import * as Moment from "moment";
import Smartmetadatapickerin from "./Smartmetadatapickerindependent/SmartmetadatapickerSingleORMulti";
import * as globalCommon from "./globalCommon";
import ShowTaskTeamMembers from "./ShowTaskTeamMembers";
import TeamConfigurationCard from "./TeamConfiguration/TeamConfiguration";
import TeamConfigurationCards from "../webparts/EditPopupFiles/TeamConfigurationPortfolio";
import { OverlayTrigger, Popover } from "react-bootstrap";
import OnHoldCommentCard from "./Comments/OnHoldCommentCard";
import Picker from "./EditTaskPopup/SmartMetaDataPicker";
import Tooltip from "./Tooltip";
import { IoHandRightOutline } from "react-icons/io5";

var ChangeTaskUserStatus: any = true;
let ApprovalStatusGlobal: any = false;
let taskUsers: any = [];
var AssignedToIds: any = [];
var ResponsibleTeamIds: any = [];
var TeamMemberIds: any = [];
var ApproverIds: any = [];
let selectedFeateureItem: any;
let selectedCatTitleVal: any = []
let AutoCompleteItemsArray: any = [];
var changeTime: any = 0;
let siteUrl: any = "";
let smartMetadataListId: any = "";
let AllMetadata: any = [];
let TaskCreatorApproverBackupArray: any = [];
let TaskApproverBackupArray: any = [];
let StatusValue: any
let onHoldCategory: any = []
let TempArrya: any = [];
const inlineEditingcolumns = (props: any) => {
  const [EditData, setEditData] = React.useState(props?.item)
  const [TimeInHours, setTimeInHours] = React.useState(0);
  const [taskStatusInNumber, setTaskStatusInNumber] = React.useState(0);
  const [TimeInMinutes, setTimeInMinutes] = React.useState(0);
  const [selectedFeatureTypeData, setSelectedFeatureTypeData]: any = React.useState({});
  const [categorySearchKey, setCategorySearchKey] = React.useState("");
  const [CategoriesData, setCategoriesData] = React.useState<any>([]);
  const [SearchedCategoryData, setSearchedCategoryData] = React.useState([]);
  const [TeamConfig, setTeamConfig] = React.useState();
  const [onHoldComment, setOnHoldComment]: any = React.useState(false);
  const [UpdateFeatureType, setUpdateFeatureType] = React.useState(false)
  const [teamMembersPopup, setTeamMembersPopup] = React.useState(false);
  const [showEditPencil, setShowEditPencil] = React.useState(false);
  const [TaskStatusPopup, setTaskStatusPopup] = React.useState(false);
  const [taskCategoriesPopup, setTaskCategoriesPopup] = React.useState(false);
  const [TaskCat, setTaskCat] = React.useState("");
  const [instantCategories, setInstantCategories] = React.useState([]);
  const [TaskPriorityPopup, setTaskPriorityPopup] = React.useState(false);
  const [PercentCompleteStatus, setPercentCompleteStatus] = React.useState("");
  const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
  const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
  const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
  const [AllTaskUser, setAllTaskUser] = React.useState([]);
  const [ApproverData, setApproverData] = React.useState([]);
  const [InputFieldDisable, setInputFieldDisable] = React.useState(false);
  const [priorityRank, setpriorityRank] = React.useState([]);
  const [editDate, setEditDate]: any = React.useState(undefined);
  const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
  const [dueDate, setDueDate] = useState({
    editDate: props?.item?.DueDate != undefined ? props?.item?.DueDate : null,
    editPopup: false,
    selectDateName: ""
  });
  const [UpdateTaskInfo, setUpdateTaskInfo] = React.useState({
    Title: "",
    PercentCompleteStatus: "",
    ComponentLink: ""
  });
  const [remark, setRemark]: any = useState(false);
  const [impTaskCategoryType, setImpTaskCategoryType] = React.useState([]);
  const [taskCategoryType, setTaskCategoryType] = React.useState([]);
  const [taskStatus, setTaskStatus] = React.useState("");
  const [taskPriority, setTaskPriority] = React.useState("");
  const [ServicesTaskCheck, setServicesTaskCheck] = React.useState(false);
  const [UpdateEstimatedTime, setUpdateEstimatedTime] = React.useState(false);
  const [PercentCompleteCheck, setPercentCompleteCheck] = React.useState(true);
  const [selectedCatId, setSelectedCatId]: any[] = React.useState([]);
  const [feedback, setFeedback] = useState("");
  const [comments, setComments] = useState([])
  const [onHoldPanel, setOnHoldPanel] = useState(false)
  const [DesignStatus, setDesignStatus] = useState(false);
  const StatusArray = [
    { value: 0, status: "0% Not Started", taskStatusComment: "Not Started" },
    { value: 1, status: "1% For Approval", taskStatusComment: "For Approval" },
    { value: 2, status: "2% Follow Up", taskStatusComment: "Follow Up" },
    { value: 3, status: "3% Approved", taskStatusComment: "Approved" },
    { value: 4, status: "4% Checking", taskStatusComment: "Checking" },
    { value: 5, status: "5% Acknowledged", taskStatusComment: "Acknowledged" },
    { value: 8, status: "8% Priority Check", taskStatusComment: "Priority Check" },
    { value: 9, status: "9% Ready To Go", taskStatusComment: "Ready To Go" },
    { value: 10, status: "10% working on it", taskStatusComment: "working on it" },
    { value: 70, status: "70% Re-Open", taskStatusComment: "Re-Open" },
    { value: 75, status: "75% Deployment Pending", taskStatusComment: "Deployment Pending" },
    { value: 80, status: "80% In QA Review", taskStatusComment: "In QA Review" },
    { value: 90, status: "90% Task completed", taskStatusComment: "Task completed" },
    { value: 100, status: "100% Closed", taskStatusComment: "Closed" },
  ];

  React.useEffect(() => {
    updateItemValues();
  }, [dueDate.editPopup, UpdateFeatureType ,TaskStatusPopup,remark,teamMembersPopup, UpdateEstimatedTime,TaskPriorityPopup,taskCategoriesPopup,props?.item?.TaskCategories?.results]);
  
  React.useEffect(() => {
    updateTaskComments();
  }, [])

  const updateItemValues = () => {
    selectedCatTitleVal = [];
    try {
      setpriorityRank(JSON.parse(localStorage.getItem("Priority")));
      setImpTaskCategoryType(JSON.parse(
        localStorage.getItem("impTaskCategoryType")
      ));
    } catch (e) {
      console.error("Priority and impTaskCategoryType")
    }
    try {

      if (props?.pageName === "portfolioprofile" || props?.pageName === 'ProjectManagmentMaster') {
        setShowEditPencil(true)
      }
      if (props?.item?.metaDataListId != undefined) {
        smartMetadataListId = props?.item?.metaDataListId;
      } else {
        smartMetadataListId = props?.AllListId?.SmartMetadataListID;
      }
      if (props?.item?.FeatureType?.Id != undefined) {
        setSelectedFeatureTypeData(props?.item?.FeatureType)
        selectedFeateureItem = props?.item?.FeatureType;
      }
      if (props?.item?.siteUrl != undefined) {
        siteUrl = props?.item?.siteUrl;
      } else {
        siteUrl = props?.AllListId?.siteUrl;
      }
      if (props?.item?.TaskCategories?.length > 0) {
        if (props?.item?.TaskCategories?.length > 0) {
          props?.item?.TaskCategories?.map((cat: any) => {
            cat.ActiveTile = true;
          });
          setDesignStatus(props?.item?.TaskCategories?.some((category: any) => category.Title === "Design"));
        }
        setCategoriesData(props?.item?.TaskCategories);
      } else if (props?.item?.TaskCategories?.results?.length > 0) {
        if (props?.item?.TaskCategories?.results?.length > 0) {
          props?.item?.TaskCategories?.results?.map((cat: any) => {
            cat.ActiveTile = true;
          });
        }
        setCategoriesData(props?.item?.TaskCategories?.results);
      } else if ((props?.item?.TaskCategories?.length == 0 || props?.item?.TaskCategories?.results?.length == 0) && props?.item?.Categories?.length > 0) {
        selectedCatTitleVal = [];
        selectedCatTitleVal = props?.item?.Categories?.split(";")

      }
      loadTaskUsers();
      if (props?.item?.DueDate != undefined) {
        setEditDate(props?.item?.DueDate);
      }
      let selectedCategoryId: any = [];
      if (props?.item?.TaskCategories?.results?.length > 0) {
        props?.item?.TaskCategories?.results?.map((category: any) => {
          selectedCategoryId.push(category.Id);
        });
      } else if (props?.item?.TaskCategories?.length > 0) {
        props?.item?.TaskCategories?.map((category: any) => {
          selectedCategoryId.push(category.Id);
        });
      }

      setTaskAssignedTo(props?.item?.AssignedTo);
      setTaskTeamMembers(props?.item?.TeamMembers);
      setTaskResponsibleTeam(props?.item?.ResponsibleTeam);
      setSelectedCatId(selectedCategoryId);
      setTaskPriority(props?.item?.PriorityRank);
      setFeedback(props?.item?.Remark);
      setEstimatedTimeProps();
      if (props?.item?.PercentComplete != undefined) {
        props.item.PercentComplete = parseInt(props?.item?.PercentComplete);
        setTaskStatusInNumber(props.item.PercentComplete);
      }
      GetSmartMetadata();
    } catch (e) { console.log }
  }

  const updateTaskComments = () => {
    try {
      let allComments: any = JSON.parse(props?.item?.Comments)
      setComments(allComments)
    }
    catch {
      console.log('JSON cannot be parsed')
    }
  }
  const getPercentCompleteTitle = (percent: any) => {
    let result = "";
    StatusArray?.map((status: any) => {
      if (status?.value == percent) {
        result = status?.status;
      }
    });
    if (result.length <= 0) {
      result = percent + "% Completed";
    }
    return result;
  };
  const setEstimatedTimeProps = () => {
    if (
      props?.item?.EstimatedTime != undefined &&
      props?.item?.EstimatedTime > 0
    ) {
      changeTime = props?.item?.EstimatedTime * 60;
      setTimeInHours(props?.item?.EstimatedTime);
      setTimeInMinutes(changeTime);
    } else {
      setTimeInHours(0);
      setTimeInMinutes(0);
      changeTime = 0;
    }
  };
  const GetSmartMetadata = async () => {
    let impTaskCategories: any = [];
    let CMSTaskCategories: any = [];
    let instantCat: any = [];
    var Priority: any = [];
    let cateFromTitle: any[] = [];
    try {
      impTaskCategories = JSON.parse(
        localStorage.getItem("impTaskCategoryType")
      );
      // instantCat = JSON.parse(localStorage.getItem("instantCategories"));
      CMSTaskCategories = JSON.parse(
        localStorage.getItem("taskCategoryType")
      );
      Priority = JSON.parse(localStorage.getItem("Priority"));
      let site = JSON.parse(localStorage.getItem("siteUrl"));
      let DataLoaded = JSON.parse(localStorage.getItem("inlineMetaDataLoaded"));
      if (
        (impTaskCategories == null ||
          CMSTaskCategories == null ||
          Priority == null ||
          site == null ||
          instantCat == null ||
          site != siteUrl) &&
        !DataLoaded
      ) {
        impTaskCategories = [];
        CMSTaskCategories = [];
        Priority = [];

        var TaskTypes: any = [];
        var Timing: any = [];
        var Task: any = [];
        let web = new Web(siteUrl);
        let MetaData = [];
        localStorage.setItem("inlineMetaDataLoaded", JSON.stringify(true));
        MetaData = await web.lists
          .getById(smartMetadataListId)
          .items.select(
            "Id",
            "IsVisible",
            "ProfileType",
            "ParentID",
            "Title",
            "SmartSuggestions",
            "TaxType",
            "Description1",
            "Item_x005F_x0020_Cover",
            "listId",
            "siteName",
            "siteUrl",
            "SortOrder",
            "SmartFilters",
            "Selectable",
            "Parent/Id",
            "Parent/Title"
          )
          .top(5000)
          .expand("Parent")
          .get();
        AllMetadata = MetaData;

        instantCat = [];

        AllMetadata?.map((metadata: any) => {
          if (selectedCatTitleVal?.some((catTitle: any) => { catTitle == metadata?.Title && metadata.TaxType == "Categories" })) {
            cateFromTitle.push(metadata)
          }
          if (
            metadata.Title == "Immediate" ||
            metadata.Title == "Favorite"
            // metadata.Title == "Bottleneck" ||

          ) {
            impTaskCategories.push(metadata);
          }

          if (metadata.TaxType == "Categories") {
            CMSTaskCategories.push(metadata);
          }
        })

        CMSTaskCategories?.map((cat: any) => {
          getChilds(cat, TaskTypes);
        });
        let uniqueArray: any = [];
        AutoCompleteItemsArray.map((currentObject: any) => {
          if (!uniqueArray.find((obj: any) => obj.Id === currentObject.Id)) {
            uniqueArray.push(currentObject);
          }
        });
        localStorage.setItem(
          "taskCategoryType",
          JSON.stringify(CMSTaskCategories)
        );
        localStorage.setItem(
          "Priority",
          JSON.stringify(
            getSmartMetadataItemsByTaxType(AllMetadata, "Priority Rank")
          )
        );
        localStorage.setItem(
          "impTaskCategoryType",
          JSON.stringify(impTaskCategories)
        );
        localStorage.setItem("siteUrl", JSON.stringify(siteUrl));
        localStorage.setItem("instantCategories", JSON.stringify(instantCat));
        Priority = getSmartMetadataItemsByTaxType(AllMetadata, "Priority Rank");
        setTaskCategoryType(CMSTaskCategories);
        setImpTaskCategoryType(impTaskCategories)
        setpriorityRank(Priority);
        setInstantCategories(instantCat);
        if (cateFromTitle?.length > 0) {
          setCategoriesData(cateFromTitle);
        }
      }
      if (instantCat == null) {
        instantCat = [];
      }
      if (selectedCatTitleVal?.length == 0) {
        cateFromTitle = CategoriesData;
      }

      CMSTaskCategories?.map((cat: any) => {
        selectedCatTitleVal?.map((catTitle: any) => {
          if (catTitle == cat?.Title) {
            cateFromTitle.push(cat)
          }
        })
        if (cateFromTitle?.some(
          (selectedCat: any) => selectedCat?.Id == cat?.Id
        )) {
          cat.ActiveTile = true;
        } else {
          cat.ActiveTile = false;
        }
        getChilds(cat, TaskTypes);
        if (
          cat?.Title == "Phone" ||
          cat?.Title == "Email Notification" ||
          cat?.Title == "Immediate" ||
          cat?.Title == "Approval"
        ) {
          instantCat.push(cat);
        }
      });
      let uniqueArray: any = [];
      AutoCompleteItemsArray.map((currentObject: any) => {
        if (!uniqueArray.find((obj: any) => obj.Id === currentObject.Id)) {
          uniqueArray.push(currentObject);
        }
      });
      AutoCompleteItemsArray = uniqueArray;
      setTaskCategoryType(CMSTaskCategories);
      setImpTaskCategoryType(impTaskCategories);
      setpriorityRank(Priority);
      setInstantCategories(instantCat);
      if (cateFromTitle?.length > 0) {
        setCategoriesData(cateFromTitle);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getChilds = (item: any, items: any) => {
    try {


      let parent = JSON.parse(JSON.stringify(item));
      parent.Newlabel = `${parent?.Title}`;
      AutoCompleteItemsArray.push(parent);
      parent.childs = [];
      items?.map((childItem: any) => {
        if (
          childItem?.Parent?.Id !== undefined &&
          parseInt(childItem?.Parent?.Id) === parent.ID
        ) {
          let child = JSON.parse(JSON.stringify(childItem));
          parent.childs.push(child);
          child.Newlabel = `${parent?.Newlabel} > ${child?.Title}`;
          AutoCompleteItemsArray.push(child);
          getChilds(child, items);
        }
      });
    } catch (e) { console.log(e) }
  };
  var getSmartMetadataItemsByTaxType = function (
    metadataItems: any,
    taxType: any
  ) {
    var Items: any = [];
    metadataItems?.map((taxItem: any) => {
      if (taxItem.TaxType === taxType) Items.push(taxItem);
    });

    Items.sort((a: any, b: any) => {
      return a.SortOrder - b.SortOrder;
    });
    return Items;
  };
  const loadTaskUsers = async () => {
    if (props?.TaskUsers?.length > 0) {
      taskUsers = props?.TaskUsers;
    } else {
      taskUsers = [];
    }

    setAllTaskUser(taskUsers);
  };
  const openTaskStatusUpdatePopup = async () => {
    StatusValue = props.item.PercentComplete
    setTaskStatusPopup(true);
  };
  function isValidDate(dateString: any): boolean {
    const date = Moment(dateString, "YYYY-MM-DD", true);
    return date.isValid();
  }
  const UpdateTaskStatus = async () => {
    if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
      TaskAssignedTo?.map((taskInfo) => {
        AssignedToIds.push(taskInfo.Id);
      });
    }

    if (ApproverData != undefined && ApproverData?.length > 0) {
      ApproverData?.map((ApproverInfo) => {
        ApproverIds.push(ApproverInfo.Id);
      });
    }
    if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
      TaskTeamMembers?.map((taskInfo) => {
        TeamMemberIds.push(taskInfo.Id);
      });
    }
    if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
      TaskResponsibleTeam?.map((taskInfo) => {
        ResponsibleTeamIds.push(taskInfo.Id);
      });
    }
    let priority: any;
    let priorityRank = 4;
    if (taskPriority === undefined || parseInt(taskPriority) <= 0) {
      priorityRank = 4;
      priority = "(2) Normal";
    } else {
      priorityRank = parseInt(taskPriority);
      if (priorityRank >= 8 && priorityRank <= 10) {
        priority = "(1) High";
      }
      if (priorityRank >= 4 && priorityRank <= 7) {
        priority = "(2) Normal";
      }
      if (priorityRank >= 1 && priorityRank <= 3) {
        priority = "(3) Low";
      }
    }
    let CategoryTitle: any = "";
    let selectedCategoriesId = selectedCatId?.length > 0 ? selectedCatId : [];

    if (selectedCategoriesId != undefined) {
      selectedCategoriesId?.map((category: any) => {
        taskCategoryType?.map((item: any) => {
          if (category === item.Id) {
            if (CategoryTitle?.length == 0) {
              CategoryTitle = item.Title + ";";
            } else {
              CategoryTitle += item.Title + ";";
            }
          }
        });
      });
    }

    if (CategoriesData != undefined) {
      CategoriesData?.map((item: any) => {
        if (!selectedCategoriesId?.some((cat: any) => cat == item?.Id)) {
          selectedCategoriesId.push(item?.Id);
          if (CategoryTitle?.length == 0) {
            CategoryTitle = item.Title + ";";
          } else {
            CategoryTitle += item.Title + ";";
          }
        }
      });
    }

    setPercentCompleteCheck(false);
    let newDueDate: any = new Date(editDate);
    if (editDate == null || editDate == "" || editDate == undefined) {
      newDueDate = null;
    } else {
      if (!isValidDate(newDueDate)) {
        newDueDate = "";
      }
    }
    let postData: any = {};

    switch (props?.columnName) {
      case 'TaskCategories':
        postData.Categories = CategoryTitle;
        postData.TaskCategoriesId = { results: selectedCategoriesId ? selectedCategoriesId : [] };
        break;

      case 'Team':
        postData.AssignedToId = { results: AssignedToIds ?? [] };
        postData.ResponsibleTeamId = { results: ResponsibleTeamIds ?? [] };
        postData.TeamMembersId = { results: TeamMemberIds ?? [] };
        break;

      case 'Priority':
        postData.Priority = priority;
        postData.PriorityRank = priorityRank;
        if (props?.mypriority != true) {
          postData.Categories = CategoryTitle;
          postData.TaskCategoriesId = { results: selectedCategoriesId ? selectedCategoriesId : [] };
        }
        break;

      case 'Remark':
        postData.Remark = feedback;
        break;

      case 'EstimatedTime':
        postData.EstimatedTime = TimeInHours;
        break;

      case 'PercentComplete':
        postData.PercentComplete = StatusValue / 100;
        postData.IsTodaysTask = EditData?.IsTodaysTask
        postData.workingThisWeek = EditData?.workingThisWeek
        postData.AssignedToId = { results: AssignedToIds ?? [] };
        postData.StartDate = EditData?.StartDate
        postData.CompletedDate = EditData?.CompletedDate
        break;

      case 'DueDate':
        postData.DueDate = newDueDate;
        break;

      case 'FeatureType':
        postData.FeatureTypeId = selectedFeateureItem?.Id;
        break;

      default:
        break;
    }
    let web = new Web(props?.item?.siteUrl);
    await web.lists
      .getById(props?.item?.listId)
      .items.getById(props?.item?.Id)
      .update(postData)
      .then((res: any) => {
        web.lists
          .getById(props?.item?.listId)
          .items.select(
            "Id,Title,FeedBack,PriorityRank,Remark,Project/PriorityRank,ParentTask/Id,ParentTask/Title,ParentTask/TaskID,TaskID,SmartInformation/Id,SmartInformation/Title,Project/Id,Project/Title,workingThisWeek,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,Comments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title"
          )
          .expand(
            "AssignedTo,Project,ParentTask,SmartInformation,Author,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory"
          )
          .getById(props?.item?.Id)
          .get()
          .then((task) => {
            task.AllTeamMember = [];
            task.siteType = props?.item?.siteType;
            task.listId = props?.item?.listId;
            task.siteUrl = props?.item?.siteUrl;
            task.AssignedTo = TaskAssignedTo;
            if (props?.columnName == 'FeatureType') {
              task.FeatureType = selectedFeateureItem;
            }
            task.ResponsibleTeam = TaskResponsibleTeam;
            task.TeamMembers = TaskTeamMembers;
            task.PercentComplete = (task.PercentComplete * 100).toFixed(0);
            task.DisplayDueDate =
              task.DueDate != null
                ? Moment(task.DueDate).format("DD/MM/YYYY")
                : "";
            task.TeamMembersSearch = "";
            task.ApproverIds = [];
            task.Categories = CategoryTitle;
            task?.Approver?.map((approverUser: any) => {
              task.ApproverIds.push(approverUser?.Id);
            });

            task.TaskCategories = CategoriesData;

            task.TaskID = props?.item?.TaskID;

            props.item = task;
            clearEstimations();
            closeTaskDueDate();
            props?.callBack(task);
          });
        setCategoriesData(CategoriesData);
        setSelectedCatId(selectedCategoriesId);
        setTaskCategoriesPopup(false);
        setTaskStatusPopup(false);
        setTaskPriorityPopup(false);
        setTeamMembersPopup(false);
        clearEstimations();
        setRemark(false);
        closeTaskDueDate();
      });
  };
  const removeFeatureType = () => {
    selectedFeateureItem = { Id: null }
    setSelectedFeatureTypeData({});
    UpdateTaskStatus();
  }
  const setWorkingMember = (statusId: any) => {
    AllTaskUser?.map((dataTask: any) => {
      if (dataTask.AssingedToUserId == statusId) {
        let tempArray: any = [];
        tempArray.push(dataTask);
        props.item.TaskAssignedUsers = tempArray;
        let updateUserArray: any = [];
        updateUserArray.push(tempArray[0].AssingedToUser);
        setTaskAssignedTo(updateUserArray);
      }
    });
  };

  const CategoryCallBack = React.useCallback((item1: any, type: any) => {
    setIsComponentPicker(false)
    setTaskCategoriesPopup(true)
    let uniqueIds: any = {};
    TempArrya = CategoriesData
    if (type == "Category-Task-Footertable") {
      if (item1?.length > 0) {
        item1?.map((cat: any) => {
          cat.ActiveTile = true;
          if (cat.Title == "On-Hold") {
            onHoldCategory.push(cat)
            setOnHoldPanel(true)
          }
          else {
            TempArrya.push(cat)
          }
        });
      }
    }
    const result: any = TempArrya.filter((item: any) => {
      if (!uniqueIds[item.Id]) {
        uniqueIds[item.Id] = true;
        return true;
      }
      return false;
    });
    TempArrya = result;
    setCategoriesData(result)
  }, [])

  const smartCategoryPopup = React.useCallback(() => {
    setIsComponentPicker(false);
    setTaskCategoriesPopup(true);
  }, []);

  const inlineCategoryCallBack = React.useCallback((usedFor: any) => {
    setOnHoldPanel(false);
    setTaskCategoriesPopup(true);
    if (usedFor == "Save") {
      let uniqueIds: any = {}
      TempArrya.push(onHoldCategory[0]);
      const result: any = TempArrya.filter((item: any) => {
        if (!uniqueIds[item.Id]) {
          uniqueIds[item.Id] = true;
          return true;
        }
        return false;
      });
      setCategoriesData(result);
    }
    onHoldCategory = [];
  }, []);
  const DDComponentCallBack = (dt: any) => {
    setTeamConfig(dt);

    if (dt?.AssignedTo?.length > 0) {
      let tempAssigned: any = [];
      dt.AssignedTo?.map((arrayData: any) => {
        if (arrayData.AssingedToUser != null) {
          tempAssigned.push(arrayData.AssingedToUser);
        } else {
          tempAssigned.push(arrayData);
        }
      });
      setTaskAssignedTo(tempAssigned);
    }
    if (dt?.TeamMemberUsers?.length > 0) {
      let tempTeam: any = [];
      dt.TeamMemberUsers?.map((arrayData: any) => {
        if (arrayData.AssingedToUser != null) {
          tempTeam.push(arrayData.AssingedToUser);
        } else {
          tempTeam.push(arrayData);
        }
      });
      setTaskTeamMembers(tempTeam);
    }
    if (dt?.ResponsibleTeam?.length > 0) {
      let tempResponsible: any = [];
      dt.ResponsibleTeam?.map((arrayData: any) => {
        if (arrayData.AssingedToUser != null) {
          tempResponsible.push(arrayData.AssingedToUser);
        } else {
          tempResponsible.push(arrayData);
        }
      });
      setTaskResponsibleTeam(tempResponsible);
    }
  };

  const EditComponentPicker = (item: any) => {
    setIsComponentPicker(true);
    setTaskCat(item);
    setTaskCategoriesPopup(true)
  };

  const selectSubTaskCategory = (title: any, Id: any, item: any) => {
    setCategorySearchKey("");
    setSearchedCategoryData([]);
    let TaskCategories: any[] = CategoriesData
    if (item.ActiveTile) {
      item.ActiveTile = !item.ActiveTile;
      TaskCategories = TaskCategories.filter(
        (category: any) => category?.Id !== Id
      );
      let IdsCat = selectedCatId;
      IdsCat = IdsCat.filter((category: any) => category !== Id);
      setSelectedCatId(IdsCat);
    } else if (!item.ActiveTile) {
      item.ActiveTile = !item.ActiveTile;
      if (item.Title == "On-Hold") {
        setOnHoldPanel(true)
        onHoldCategory.push(item)
      }
      else {
        TaskCategories.push(item)
      }
    }
    setInstantCategories((CategoriesData: any) =>
      CategoriesData?.map((selectCAT: any) => {
        if (selectCAT?.Id === item?.Id) {
          return item;
        }
        return selectCAT; // Return the original value if no change is needed
      })
    );
    TempArrya = TaskCategories
    setCategoriesData(TaskCategories);
  };

  const clearEstimations = () => {
    setTimeInHours(0);
    setTimeInMinutes(0);
    changeTime = 0;
    setUpdateEstimatedTime(false);
  };
  const setWorkingMemberFromTeam = (
    filterArray: any,
    filterType: any,
    StatusID: any
  ) => {
    let tempArray: any = [];
    filterArray.map((TeamItems: any) => {
      AllTaskUser?.map((TaskUserData: any) => {
        if (TeamItems.Id == TaskUserData.AssingedToUserId) {
          if (TaskUserData.TimeCategory == filterType) {
            tempArray.push(TaskUserData);
            props.item.TaskAssignedUsers = tempArray;
            let updateUserArray1: any = [];
            updateUserArray1.push(tempArray[0].AssingedToUser);
            setTaskAssignedTo(updateUserArray1);
          } else {
            if (tempArray?.length == 0) {
              setWorkingMember(143);
            }
          }
        }
      });
    });
  };
  const isItemExistID = (item: any, array: any) => {
    let result = false;
    array?.map((arrayItem: any) => {
      if (
        arrayItem?.Id == item.Id ||
        arrayItem?.ID == item.Id ||
        arrayItem?.Id == item.ID ||
        arrayItem?.ID == item.ID
      ) {
        result = true;
      }
    });
    return result;
  };
  const isItemExistTitle = (item: any, array: any) => {
    let result = false;
    array?.map((arrayItem: any) => {
      if (arrayItem?.Title == item) {
        result = true;
      }
    });
    return result;
  };
  const autoSuggestionsForCategory = async (e: any) => {
    let searchedKey: any = e.target.value;
    setCategorySearchKey(e.target.value);
    let tempArray: any = [];
    if (searchedKey?.length > 0) {
      AutoCompleteItemsArray?.map((itemData: any) => {
        if (
          itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
        ) {
          tempArray.push(itemData);
        }
      });
      setSearchedCategoryData(tempArray);
    } else {
      setSearchedCategoryData([]);
    }
  };

  const PercentCompleted = (StatusData: any) => {
    setUpdateTaskInfo({
      ...UpdateTaskInfo,
      PercentCompleteStatus: StatusData.value,
    });
    setPercentCompleteStatus(StatusData.status);
    setTaskStatus(StatusData.taskStatusComment);
    setPercentCompleteCheck(false);
    StatusValue = StatusData.value
    if (StatusData.value == 1) {
      let tempArray: any = [];
      if (
        TaskApproverBackupArray != undefined &&
        TaskApproverBackupArray.length > 0
      ) {
        TaskApproverBackupArray.map((dataItem: any) => {
          tempArray.push(dataItem);
        });
      } else if (
        TaskCreatorApproverBackupArray != undefined &&
        TaskCreatorApproverBackupArray.length > 0
      ) {
        TaskCreatorApproverBackupArray.map((dataItem: any) => {
          tempArray.push(dataItem);
        });
      }
      const finalData = tempArray.filter((val: any, id: any, array: any) => {
        return array.indexOf(val) == id;
      });
      setTaskAssignedTo(finalData);
      setTaskTeamMembers(finalData);
      setApproverData(finalData);
      var e: any = "false";
      props.item.TaskApprovers = finalData;
    }
    if (StatusData.value == 2) {
      setInputFieldDisable(true);
    }
    if (StatusData.value != 2) {
      setInputFieldDisable(false);
    }

    if (StatusData.value == 80) {
      setEditData((prevState: any) => ({
        ...prevState,
        IsTodaysTask: false,
        workingThisWeek: false
      }));
      if (
        EditData.TeamMembers != undefined &&
        EditData.TeamMembers?.length > 0
      ) {
        setWorkingMemberFromTeam(EditData.TeamMembers, "QA", 143);
      } else {
        setWorkingMember(143);
      }
      setEditData((prevState: any) => ({
        ...prevState,
        IsTodaysTask: false,
        CompletedDate: undefined
      }));
    }
    if (StatusData.value == 70) {
      if (
        EditData.TeamMembers != undefined &&
        EditData.TeamMembers?.length > 0
      ) {
        setWorkingMemberFromTeam(EditData.TeamMembers, "Development", 0);
      } else {
        setWorkingMember(0);
      }
    }

    if (StatusData.value == 5) {
      EditData.CompletedDate = undefined;
      EditData.IsTodaysTask = false;
    }

    if (StatusData.value == 10) {
      EditData.CompletedDate = undefined;
      if (EditData.StartDate == undefined) {
        EditData.StartDate = Moment(new Date()).format("MM-DD-YYYY");
      }
      setEditData((prevState: any) => ({
        ...prevState,
        IsTodaysTask: true
      }));
    }
    if (
      StatusData.value == 93 ||
      StatusData.value == 96 ||
      StatusData.value == 99
    ) {
      setEditData((prevState: any) => ({
        ...prevState,
        IsTodaysTask: false,
        workingThisWeek: false
      }));
      setWorkingMember(32);
      StatusArray?.map((item: any) => {
        if (StatusData.value == item.value) {
          setPercentCompleteStatus(item.status);
          setTaskStatus(item.taskStatusComment);
        }
      });
  }
  if (StatusData.value == 90) {
    setEditData((prevState: any) => ({
      ...prevState,
      IsTodaysTask: false,
      workingThisWeek: false
    }));
      if (EditData.siteType == "Offshore%20Tasks") {
          setWorkingMember(36);
      } else if (DesignStatus) {
        setWorkingMember(301);
      } else {
        setWorkingMember(42);
      }
      setEditData((prevState: any) => ({
        ...prevState,
        CompletedDate: Moment(new Date()).format("MM-DD-YYYY")
      }));
      StatusArray?.map((item: any) => {
        if (StatusData.value == item.value) {
          setPercentCompleteStatus(item.status);
          setTaskStatus(item.taskStatusComment);
        }
      });
    }
  };
  const closeTaskStatusUpdatePopup = () => {
    setTaskStatusPopup(false);
  };
  const handleCategoryChange = (event: any, CategoryId: any, Category: any) => {
    if (event.target.checked) {
      setSelectedCatId((prevSelectedCatId: any) => [...prevSelectedCatId, CategoryId]);
      setCategoriesData((prevCategoriesData: any) => [...prevCategoriesData, Category]);
    } else {
      setSelectedCatId((prevSelectedCatId: any) => prevSelectedCatId.filter((val: any) => val !== CategoryId));
      setCategoriesData((prevCategoriesData: any) => prevCategoriesData.filter((itm: any) => itm?.Id !== CategoryId));
    }
  };
  const closeTaskDueDate = () => {
    setEditDate(undefined);
    setDueDate({ editPopup: false, editDate: undefined, selectDateName: "" });
  };

  const duedatechange = (item: any) => {
    let dates = new Date();

    if (item === "Today") {
      setDueDate({ ...dueDate, editDate: dates, selectDateName: item });
      setEditDate(dates);
    }
    if (item === "Tommorow") {
      setEditDate(dates.setDate(dates.getDate() + 1));
      setDueDate({
        ...dueDate,
        editDate: dates.setDate(dates.getDate() + 1),
        selectDateName: item
      });
    }
    if (item === "This Week") {
      setEditDate(
        new Date(dates.setDate(dates.getDate() - dates.getDay() + 7))
      );
      setDueDate({
        ...dueDate,
        editDate: new Date(dates.setDate(dates.getDate() - dates.getDay() + 7)),
        selectDateName: item
      });
    }
    if (item === "Next Week") {
      let nextweek = new Date(
        dates.setDate(dates.getDate() - (dates.getDay() - 1) + 6)
      );
      setEditDate(
        nextweek.setDate(nextweek.getDate() - (nextweek.getDay() - 1) + 6)
      );
      setDueDate({
        ...dueDate,
        editDate: nextweek.setDate(
          nextweek.getDate() - (nextweek.getDay() - 1) + 6
        ),
        selectDateName: item
      });
    }
    if (item === "This Month") {
      let lastDay = new Date(dates.getFullYear(), dates.getMonth() + 1, 0);
      setEditDate(lastDay);
      setDueDate({ ...dueDate, editDate: lastDay, selectDateName: item });
    }
  };
  const changeTimes = (val: any, time: any, type: any) => {
    if (val === "15") {
      changeTime = Number(TimeInMinutes);
      changeTime = changeTime + 15;
      // changeTime = changeTime > 0
      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;
        setTimeInHours(TimeInHour.toFixed(2));
      }
      setTimeInMinutes(changeTime);
    }
    if (val === "60") {
      changeTime = Number(TimeInMinutes);
      changeTime = changeTime + 60;
      // changeTime = changeTime > 0
      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;
        setTimeInHours(TimeInHour.toFixed(2));
      }
      setTimeInMinutes(changeTime);
    }
  };
  const changeTimesDec = (items: any) => {
    if (items === "15") {
      changeTime = Number(TimeInMinutes);
      changeTime = changeTime - 15;
      setTimeInMinutes(changeTime);
      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;

        setTimeInHours(TimeInHour.toFixed(2));
      }
    }
    if (items === "60") {
      changeTime = Number(TimeInMinutes);
      changeTime = changeTime - 60;
      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;

        setTimeInHours(TimeInHour.toFixed(2));
      }
      setTimeInMinutes(changeTime);
    }
  };
  const changeTimeFunction = (e: any, type: any) => {
    if (type == "Add") {
      changeTime = e.target.value;
      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;
        setTimeInHours(TimeInHour.toFixed(2));
      }
      setTimeInMinutes(changeTime);
    }
    if (type == "Edit") {
      if (e.target.value > 0) {
        changeTime = e.target.value;
        if (changeTime != undefined) {
          var TimeInHour: any = changeTime / 60;
          setTimeInHours(TimeInHour.toFixed(2));
        }
        setTimeInMinutes(changeTime);
      } else {
        setTimeInMinutes(undefined);
        setTimeInHours(0);
      }
    }
  };

  const onRenderCustomHeader = (columnName: any) => {
    return (
      <div
        className={
          ServicesTaskCheck
            ? "d-flex full-width pb-1 serviepannelgreena"
            : "d-flex full-width pb-1"
        }
      >
        <div className="subheading ">
          {props?.item?.SiteIcon != null && <img className="imgWid29 pe-1 mt-1 " src={props?.item?.SiteIcon} />}
          <span className="siteColor">
            {`Update ${columnName} - ${props?.item?.TaskID != undefined ? props?.item?.TaskID : ''} ${props?.item?.Title}`}
          </span>
        </div>
        <Tooltip ComponentId={7801} />
      </div>
    );
  };

  const showOnHoldComment = () => {
    setOnHoldComment(true);
  };

  const hideOnHoldComment = () => {
    setOnHoldComment(false);
  };

  const Smartmetadatafeature = React.useCallback((data: any) => {
    if (data === "Close") {
      setUpdateFeatureType(false)
    } else {
      setUpdateFeatureType(false)
      selectedFeateureItem = data[0]
      setSelectedFeatureTypeData(data[0]);
      UpdateTaskStatus()
    }
  }, [])

  return (
    <>
      {props?.columnName == "Team" ? (
        <>
          <span
            style={{ display: "block", width: "100%", height: "100%" }}
            onClick={() => setTeamMembersPopup(true)}
            className="hreflink"
          >
            {" "}
            <span className="alignCenter">
              <ShowTaskTeamMembers
                props={props?.item}
                TaskUsers={props?.TaskUsers}
              />
              {showEditPencil && (
                <a className="pancil-icons">
                  <span className="svg__iconbox svg__icon--editBox alignIcon "></span>
                </a>
              )}
            </span>
          </span>

        </>
      ) : (
        ""
      )}
      {props?.columnName == "Priority" ? (
        <>
          <span
            className={
              ServicesTaskCheck && props?.pageName !== "ProjectOverView"
                ? "serviepannelgreena hreflink"
                : "hreflink"
            }
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              gap: "1px"
            }}
            onClick={() => setTaskPriorityPopup(true)}
          >

            {props?.mypriority === true && props?.item?.PriorityRank != null && props?.item?.PriorityRank != undefined ? `(${props?.item?.PriorityRank}) ${props?.item?.Priority?.slice(3)}` : props?.item?.PriorityRank}
            {props?.item?.TaskCategories?.map((items: any) =>
              items?.Title === "On-Hold" ? (
                <div className="hover-text">
                  <IoHandRightOutline
                    onMouseEnter={showOnHoldComment}
                    onMouseLeave={hideOnHoldComment}
                  />
                  {onHoldComment && <span className="tooltip-text pop-right">
                    {comments?.map((commentItem: any, index: any) =>
                      commentItem?.CommentFor !== undefined &&
                        commentItem?.CommentFor === "On-Hold" ? (
                        <div key={index}>
                          <span className="siteColor p-1 border-bottom">
                            Task On-Hold by{" "}
                            <span>{commentItem?.AuthorName}</span>{" "}
                            <span>{Moment(commentItem?.Created).format('DD/MM/YY')}</span>
                          </span>
                          {commentItem?.CommentFor !== undefined &&
                            commentItem?.CommentFor === "On-Hold" ? (
                            <div key={index}>{commentItem?.Description}</div>
                          ) : null}
                        </div>
                      ) : null
                    )}
                  </span>}
                </div>
              ) : null
            )}
            {props?.item?.TaskCategories?.map((category: any) => {
              if (category?.Title == "Immediate") {
                return (
                  <a title="Immediate">
                    <span className=" svg__iconbox svg__icon--alert alignIcon "></span>
                    {/* <img className=' imgAuthor' src={require("../../../Assets/ICON/urgent.svg")} />  */}
                  </a>
                );
              }
              // if (category?.Title == "Bottleneck") {
              //   return (
              //     <a title="Bottleneck">
              //       {/* <img className=' imgAuthor' src={require("../../../Assets/ICON/bottleneck.svg")} />  */}
              //       <span className=" svg__iconbox svg__icon--bottleneck alignIcon "></span>
              //     </a>
              //   );
              // }
              if (category?.Title == "Favorite") {
                return (
                  <a title="Favorite">
                    <span className=" svg__iconbox svg__icon--Star alignIcon "></span>
                    {/* <img className=' imgAuthor' src={require("../../../Assets/ICON/favouriteselected.svg")} />  */}
                  </a>
                );
              }
            })}
            &nbsp;
            {showEditPencil && (
              <a className="pancil-icons">
                <span className="svg__iconbox svg__icon--editBox alignIcon "></span>
              </a>
            )}
          </span>

        </>
      ) : (
        ""
      )}
      {props?.columnName == "Remark" ? (
        <>
          {" "}
          <span
            style={{ display: "block", width: "100%", height: "100%" }}
            className={
              ServicesTaskCheck && props?.pageName !== "ProjectOverView"
                ? "serviepannelgreena align-content-center d-flex gap-1"
                : "align-content-center d-flex gap-1"
            }
            onClick={() => setRemark(true)}
          >
            {props?.item?.Remark}&nbsp;
          </span>
        </>
      ) : (
        ""
      )}
      {props?.columnName == "EstimatedTime" ? (
        <>
          {" "}
          <span
            style={{ display: "block", width: "100%", height: "100%" }}
            className={
              ServicesTaskCheck && props?.pageName !== "ProjectOverView"
                ? "serviepannelgreena align-content-center d-flex gap-1"
                : "align-content-center d-flex gap-1"
            }
            onClick={() => setUpdateEstimatedTime(true)}
          >
            {props?.item?.EstimatedTime}&nbsp;
          </span>
        </>
      ) : (
        ""
      )}
      {props?.columnName == "FeatureType" ? (
        <>
          {" "}
          <span
            className={selectedFeatureTypeData?.Title != undefined ? "sdgergeg" : "hreffwefwlinkerg"}
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              gap: "1px"
            }}
          >

            {UpdateFeatureType != true ? <span style={{ overflow: 'hidden', display: 'inline-block', width: `${selectedFeatureTypeData?.Title != undefined ? '168px' : '185px'}`, textOverflow: 'ellipsis', whiteSpace: "nowrap" }} title={selectedFeatureTypeData?.Title} >{selectedFeatureTypeData?.Title}</span> : <span style={{ overflow: 'hidden', display: 'inline-block', width: `${selectedFeatureTypeData?.Title != undefined ? '168px' : '185px'}`, textOverflow: 'ellipsis', whiteSpace: "nowrap" }} title={selectedFeatureTypeData?.Title} >{selectedFeatureTypeData?.Title}</span>}&nbsp;
            {selectedFeatureTypeData?.Title != undefined ? <a className="pancil-icons hreflink" onClick={() => removeFeatureType()}>
              <span className="alignIcon svg__iconbox svg__icon--cross"></span>
            </a> : ''}

            <a className="pancil-icons hreflink" onClick={() => setUpdateFeatureType(true)}>
              <span className="alignIcon  svg__iconbox svg__icon--editBox"></span>
            </a>
          </span>
        </>
      ) : (
        ""
      )}

      {props?.columnName == "PercentComplete" ? (
        <>
          <span
            style={{ display: "block", width: "100%", height: "100%" }}
            className={
              ServicesTaskCheck
                ? "serviepannelgreena align-content-center d-flex gap-1 alignCenter"
                : "align-content-center d-flex gap-1 hreflink"
            }
            onClick={() => openTaskStatusUpdatePopup()}
          >

            {/* <span className="d-inline-block" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Disabled popover">
                                {props.item.PercentComplete}
                            </span> */}
            <span title={getPercentCompleteTitle(props?.item?.PercentComplete)}>
              {props?.item?.PercentComplete}{" "}
            </span>
            {props?.item?.IsTodaysTask ? (
              <>
                {props?.item?.AssignedTo?.map((AssignedUser: any) => {
                  return AllTaskUser?.map((user: any) => {
                    if (AssignedUser.Id == user.AssingedToUserId) {
                      return (
                        <a
                          target="_blank"
                          data-interception="off"
                          title={user.Title}
                        >
                          {user?.Item_x0020_Cover?.Url != undefined ? (
                            <img
                              className="workmember ms-1"
                              style={{ marginBottom: "1px" }}
                              title={user?.Title}
                              src={user?.Item_x0020_Cover?.Url}
                            ></img>
                          ) : (
                            <span
                              title={user?.Title}
                              className="alignIcon  svg__iconbox svg__icon--defaultUser grey ms-1 "
                            ></span>
                          )}
                        </a>
                      );
                    }
                  });
                })}
              </>
            ) : (
              ""
            )}
            &nbsp;
            {showEditPencil && (
              <a className="pancil-icons ml-auto">
                <span className="alignIcon svg__iconbox svg__icon--editBox"></span>
              </a>
            )}
          </span>

        </>
      ) : (
        ""
      )}
      {props?.columnName == "DueDate" ? (
        <span
          className={
            ServicesTaskCheck && props.pageName !== "ProjectOverView"
              ? "serviepannelgreena hreflink"
              : "hreflink"
          }
          style={{ display: "block", width: "100%", height: "100%" }}
          onClick={() => {
            setDueDate({ ...dueDate, editPopup: true });
            setEditDate(
              props?.item?.DueDate != undefined ? props?.item?.DueDate : null
            );
          }}
        >
          {props?.item?.DisplayDueDate != undefined ? props?.item?.DisplayDueDate : <>&nbsp;</>}
          {showEditPencil && (
            <a className="pancil-icons">
              <span className="alignIcon  svg__iconbox svg__icon--editBox"></span>
            </a>
          )}
        </span>
      ) : (
        ""
      )}

      {/* Panel to edit due-date */}

      <Panel
        onRenderHeader={() => onRenderCustomHeader("Due Date")}
        isOpen={dueDate.editPopup}
        type={PanelType.custom}
        customWidth="400px"
        onDismiss={closeTaskDueDate}
        isBlocking={dueDate.editPopup}
      >
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
          <div className="modal-body mt-3 mb-3 d-flex flex-column">
            <input
              className="form-check-input p-3 w-100"
              type="date"
              value={
                editDate != null
                  ? Moment(new Date(editDate)).format("YYYY-MM-DD")
                  : ""
              }
              onChange={(e: any) => setEditDate(e.target.value)}
            />

            <div className="d-flex flex-column mt-2 mb-2">
              <span className="SpfxCheckRadio">
                <input
                  className="radio"
                  type="radio"
                  value="Male"
                  name="dueDateRadio"
                  checked={dueDate.selectDateName == "Today"}
                  onClick={() => duedatechange("Today")}
                />{" "}
                Today
              </span>
              <span className="SpfxCheckRadio">
                <input
                  className="radio"
                  type="radio"
                  value="Female"
                  name="dueDateRadio"
                  checked={dueDate.selectDateName == "Tommorow"}
                  onClick={() => duedatechange("Tommorow")}
                />{" "}
                Tommorow
              </span>
              <span className="SpfxCheckRadio">
                <input
                  className="radio"
                  type="radio"
                  value="Other"
                  name="dueDateRadio"
                  checked={dueDate.selectDateName == "This Week"}
                  onClick={() => duedatechange("This Week")}
                />{" "}
                This Week
              </span>
              <span className="SpfxCheckRadio">
                <input
                  className="radio"
                  type="radio"
                  value="Female"
                  name="dueDateRadio"
                  checked={dueDate.selectDateName == "Next Week"}
                  onClick={() => duedatechange("Next Week")}
                />{" "}
                Next Week
              </span>
              <span className="SpfxCheckRadio">
                <input
                  className="radio"
                  type="radio"
                  value="Female"
                  name="dueDateRadio"
                  checked={dueDate.selectDateName == "This Month"}
                  onClick={() => duedatechange("This Month")}
                />{" "}
                This Month
              </span>
            </div>
          </div>
          <footer className="float-end">
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={UpdateTaskStatus}
            >
              Save
            </button>
          </footer>
        </div>
      </Panel>
      <Panel
        onRenderHeader={() => onRenderCustomHeader("Estimated Time")}
        isOpen={UpdateEstimatedTime}
        customWidth="500px"
        onDismiss={() => clearEstimations()}
        isBlocking={UpdateEstimatedTime}
      >
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
          <div className="row">
            <div className="col-sm-6 pe-0">
              <label ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
              <input
                type="text"
                ng-model="TimeSpentInMinutes"
                className="form-control"
                value={TimeInMinutes}
                onChange={(e) => changeTimeFunction(e, "Add")}
              />
            </div>
            <div className="col-sm-6 ps-0">
              <label></label>
              <input
                className="form-control bg-e9"
                type="text"
                value={`${TimeInHours > 0 ? TimeInHours : 0}  Hours`}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 Time-control-buttons">
              <div className="pe-0 Quaterly-Time">
                <label className="full_width"></label>
                <button
                  className="btn btn-primary"
                  title="Decrease by 15 Min"
                  disabled={TimeInMinutes <= 0 ? true : false}
                  onClick={() => changeTimesDec("15")}
                >
                  <i className="fa fa-minus" aria-hidden="true"></i>
                </button>
                <span> 15 min </span>
                <button
                  className="btn btn-primary"
                  title="Increase by 15 Min"
                  onClick={() => changeTimes("15", "add", "AddNewStructure")}
                >
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
              </div>
              <div className="pe-0 Full-Time">
                <label className="full_width"></label>
                <button
                  className="btn btn-primary"
                  title="Decrease by 60 Min"
                  disabled={TimeInMinutes <= 0 ? true : false}
                  onClick={() => changeTimesDec("60")}
                >
                  <i className="fa fa-minus" aria-hidden="true"></i>
                </button>
                <span> 60 min </span>
                <button
                  className="btn btn-primary"
                  title="Increase by 60 Min"
                  onClick={() => changeTimes("60", "add", "AddNewStructure")}
                >
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
          <footer className="float-end">
            <button
              type="button"
              className="btn btn-primary px-3 mt-4"
              onClick={UpdateTaskStatus}
            >
              Update
            </button>
          </footer>
        </div>
      </Panel>

      {/* Pannel To select Status */}
      <Panel
        onRenderHeader={() => onRenderCustomHeader("Status")}
        isOpen={TaskStatusPopup}
        customWidth="500px"
        onDismiss={closeTaskStatusUpdatePopup}
        isBlocking={TaskStatusPopup}
      >
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
          <div className="modal-body">
            <div>
              <ul className="list-none">
                {StatusArray?.map((item: any, index) => {
                  return (
                    <li key={index}>
                      <div className="SpfxCheckRadio">
                        <input
                          className="radio"
                          type="radio"
                          checked={StatusValue == item?.value}
                          onClick={() => PercentCompleted(item)}
                        />
                        <label className="form-check-label">
                          {item?.status}
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <footer className="float-end">
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={() => UpdateTaskStatus()}
            >
              Save
            </button>
          </footer>
        </div>
      </Panel>
      {/* Pannel To select Priority */}
      <Panel
        onRenderHeader={() => onRenderCustomHeader("Priority")}
        isOpen={TaskPriorityPopup}
        customWidth="500px"
        onDismiss={() => setTaskPriorityPopup(false)}
        isBlocking={TaskPriorityPopup}
      >
        <div
          className={
            ServicesTaskCheck
              ? "serviepannelgreena inline-update-priority"
              : "inline-update-priority"
          }
        >
          <div className="modal-body">
            <div>
              <ul className="list-none">
                {priorityRank?.map((item: any, index) => {
                  return (
                    <li key={index}>
                      <div className="SpfxCheckRadio">
                        <input
                          className="radio"
                          type="radio"
                          checked={taskPriority == item.Title}
                          onClick={() => setTaskPriority(item.Title)}
                        />
                        <label className="form-check-label mx-2">
                          {item?.Title}
                        </label>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {props?.mypriority != true &&
            <>
              {impTaskCategoryType?.map((option) => (
                option.Title !== 'Bottleneck' && (
                  <div
                    className={
                      ServicesTaskCheck ? "serviepannelgreena d-flex" : "d-flex"
                    }
                    key={option.Id}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={option.Id}
                      value={option.Id}
                      checked={selectedCatId?.includes(option.Id)}
                      onChange={(event) => handleCategoryChange(event, option.Id, option)}
                    />
                    <a className="alignCenter" title={option.Title}>
                      {option.Title == "Immediate" ? (
                        <span className="workmember svg__iconbox svg__icon--alert "></span>
                      ) : (
                        ""
                      )}
                      {/* {option.Title == "Bottleneck" ? (
                      <span className="workmember svg__iconbox svg__icon--bottleneck "></span>
                    ) : (
                      ""
                    )} */}
                      {option.Title == "Favorite" ? (
                        <span className="workmember svg__iconbox svg__icon--Star "></span>
                      ) : (
                        ""
                      )}
                    </a>
                    <label htmlFor={option.Id} className="ms-2">
                      {option.Title}
                    </label>
                  </div>)
              ))}
            </>
          }
          <footer className="float-end">
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={() => UpdateTaskStatus()}
            >
              Save
            </button>
          </footer>
        </div>
      </Panel>
      <Panel
        onRenderHeader={() => onRenderCustomHeader("Team Members")}
        isOpen={teamMembersPopup}
        onDismiss={() => setTeamMembersPopup(false)}
        isBlocking={teamMembersPopup}
        type={PanelType.medium}
      >
        <div>
          {props.pageName !== "portfolioprofile" ?
            <TeamConfigurationCard
              AllListId={props?.AllListId}
              ItemInfo={props?.item}
              parentCallback={DDComponentCallBack}
            ></TeamConfigurationCard>
            :
            <TeamConfigurationCards
              ItemInfo={props?.item}
              AllListId={props?.AllListId}
              parentCallback={DDComponentCallBack}
            ></TeamConfigurationCards>
          }
          <footer className="float-end">
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={() => UpdateTaskStatus()}
            >
              Save
            </button>
          </footer>
        </div>
      </Panel>
      <Panel
        onRenderHeader={() => onRenderCustomHeader("Remarks")}
        isOpen={remark}
        customWidth="500px"
        onDismiss={() => setRemark(false)}
        isBlocking={remark}
      >
        <div>
          <textarea
            value={feedback}
            className="full-width"
            onChange={(e: any) => setFeedback(e.target.value)}
          />
          <footer className="float-end">
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={() => UpdateTaskStatus()}
            >
              Save
            </button>
          </footer>
        </div>
      </Panel>
      {props?.columnName == "TaskCategories" ? (
        <span
          className="hreflink text-content"
          title={props?.item?.Categories}
          onClick={() => setTaskCategoriesPopup(true)}
          style={{ display: "block", width: "100%", height: "100%" }}
        >
          {" "}
          {props?.item?.Categories}{" "}  &nbsp;
          {showEditPencil && (
            <a className="pancil-icons">
              <span className="svg__iconbox svg__icon--editBox"></span>
            </a>
          )}
        </span>
      ) : (
        ""
      )}
      <Panel
        onRenderHeader={() => onRenderCustomHeader("Categories")}
        isOpen={taskCategoriesPopup}
        customWidth="400px"
        type={PanelType?.custom}
        onDismiss={() => setTaskCategoriesPopup(false)}
        isBlocking={true}
      >
        <div>
          <div className="col-sm-12">
            <div className="col-sm-12 padding-0 input-group">
              <label className="full_width">Categories</label>
              <input
                type="text"
                className="ui-autocomplete-input form-control"
                id="txtCategories"
                value={categorySearchKey}
                onChange={(e) => autoSuggestionsForCategory(e)}
              />
              <span className="input-group-text">
                <span
                  onClick={() => EditComponentPicker(props?.item)}
                  title="Edit Categories"
                  className="hreflink svg__iconbox svg__icon--editBox"
                ></span>
              </span>
              <div className="col-sm-12 p-0">
                {SearchedCategoryData?.length > 0 ? (
                  <div className="SmartTableOnTaskPopup p-0 position-static">
                    <ul className="list-group">
                      {SearchedCategoryData.map((item: any) => {
                        return (
                          <li
                            className="hreflink list-group-item p-1 rounded-0 list-group-item-action"
                            key={item.id}
                            onClick={
                              () =>
                                selectSubTaskCategory(item?.Title, item?.Id, item)
                              // setSelectedCategoryData([item], "For-Auto-Search")
                            }
                          >
                            <a>{item.Newlabel}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>


            {instantCategories?.map((item: any) => {
              return (
                <div className="form-check">
                  <input
                    className="form-check-input rounded-0"
                    type="checkbox"
                    checked={CategoriesData?.some(
                      (selectedCat: any) => selectedCat?.Id == item?.Id
                    )}
                    onClick={() =>
                      selectSubTaskCategory(item?.Title, item?.Id, item)
                    }
                  />
                  <label>{item?.Title}</label>
                </div>
              );
            })}
          </div>
          {CategoriesData != undefined ? (
            <div>
              {CategoriesData?.map((type: any, index: number) => {
                return (
                  <>
                    {!instantCategories?.some(
                      (selectedCat: any) => selectedCat?.Title == type?.Title
                    ) && (
                        <div className="block alignCenter">
                          <a
                            className="wid90"
                            style={{ color: "#fff !important" }}
                            target="_blank"
                            data-interception="off"
                          >
                            {type.Title}
                          </a>
                          <span
                            className="bg-light ml-auto svg__iconbox svg__icon--cross"
                            onClick={() =>
                              selectSubTaskCategory(type?.Title, type?.Id, type)
                            }
                          ></span>
                          {/* <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => deleteCategories(type?.Id)} className="p-1" /> */}
                        </div>
                      )}
                  </>
                );
              })}
            </div>
          ) : null}
          <footer className="float-end">
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={() => UpdateTaskStatus()}
            >
              Save
            </button>
          </footer>
        </div>
      </Panel>
      {IsComponentPicker && (
        <Picker
          props={TaskCat}
          selectedCategoryData={CategoriesData}
          usedFor="Task-Profile"
          AllListId={props?.AllListId}
          Call={CategoryCallBack}
          closePopupCallBack={smartCategoryPopup}
        ></Picker>
      )}
      {UpdateFeatureType && (
        <Smartmetadatapickerin
          Call={Smartmetadatafeature}
          selectedFeaturedata={selectedFeatureTypeData?.Id != undefined ? [selectedFeatureTypeData] : []}
          AllListId={props?.AllListId}
          TaxType='Feature Type'
          usedFor="Single"
        ></Smartmetadatapickerin>
      )}
      {onHoldPanel && (
        <OnHoldCommentCard
          siteUrl={props?.item?.siteUrl}
          ItemId={props?.item?.Id}
          AllListIds={props?.AllListId}
          Context={props?.Context}
          callback={inlineCategoryCallBack}
          usedFor="Task-Profile"
          CommentFor={"On-Hold"}
        />
      )}
    </>
  );
};
export default inlineEditingcolumns;