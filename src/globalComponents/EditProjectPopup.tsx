import * as React from "react";
import * as Moment from 'moment';
import {
  arraysEqual,
  Modal,
  Panel,
  PanelType,
  TextField,
} from "office-ui-fabric-react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/dist/modal.js";
import "bootstrap/js/dist/tab.js";
import * as moment from "moment";
import { Web } from "sp-pnp-js";
import CommentCard from "./Comments/CommentCard";
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { map } from "lodash";
import DatePicker from "react-datepicker";
import { ClickAwayListener } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import Picker from "./EditTaskPopup/SmartMetaDataPicker";
import { EditorState } from "draft-js";
import HtmlEditorCard from "./HtmlEditor/HtmlEditor";
import TeamConfigurationCard from "./TeamConfiguration/TeamConfiguration";
import Tooltip from "./Tooltip";
// import ImagesC from "./Image";
import { AllOut } from "@material-ui/icons";
import VersionHistoryPopup from "./VersionHistroy/VersionHistory";
// import PortfolioTagging from "./PortfolioTagging"; // replace
import ServiceComponentPortfolioPopup from "./EditTaskPopup/ServiceComponentPortfolioPopup";

// % complete save on the project popup
let smartmetaDetails: any = []
interface EditableFieldProps {
  listName: string;
  itemId: number;
  fieldName: string;
  value: any;
  onChange: (value: string) => void;
  type: string;
  web: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  listName,
  itemId,
  fieldName,
  value,
  onChange,
  type,
  web,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(value);

  const handleCancel = () => {
    setEditing(false);
    setFieldValue(value);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.value);
  };
  if (fieldName == "PercentComplete") {
    const handleSave = async () => {
      try {
        setFieldValue(parseInt(fieldValue));
        // if(type == "Number"){
        //   setFieldValue(fieldValue/100);
        // }
        let valpercent = parseInt(fieldValue);
        let webs = new Web(web);
        await webs.lists
          .getByTitle(listName)
          .items.getById(itemId)
          .update({
            [fieldName]: valpercent / 100,
          });

        setEditing(false);
        onChange(fieldValue);
      } catch (error) {
        console.log(error);
      }
    };

    if (editing) {
      return (
        <div className="editcolumn ">
          <span>
            {" "}
            <input
              type={type}
              value={fieldValue}
              onChange={handleInputChange}
            />
          </span>
          <span>
            <a onClick={handleSave}>
              <span
                title="save"
                className="svg__iconbox svg__icon--Save "
              ></span>
            </a>
            <a onClick={handleCancel}>
              <span
                title="cancel"
                className="svg__iconbox svg__icon--cross"
              ></span>
            </a>
          </span>
        </div>
      );
    }

    return (
      <div className="input-group position-relative">
        <span className="input-group-text ">
          <input
            type={type}
            disabled={true}
            value={fieldValue}
            onChange={handleInputChange}
            className="border-0 border-end"
          />
          <svg
            className="ms-1"
            onClick={handleEdit}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z"
              fill="#333333"
            />
          </svg>
        </span>
      </div>
    );
  }
};

// % End of the project popup

var PostTechnicalExplanations = "";
var PostDeliverables = "";
var PostShort_x0020_Description_x0020_On = "";
var PostBody = "";
var AllListId: any = {};
var AllUsers: any = [];
var Assin: any = [];
var AssignedToIds: any = [];
var ResponsibleTeamIds: any = [];
var TeamMemberIds: any = [];
var Backupdata: any = [];
var BackupCat: any = [];
let portfolioType = "";
var CheckCategory: any = [];
var backcatss: any = [];
let postedData: any = {};
var TaggedPortfolios: any = [];
function EditProjectPopup(item: any) {
  // Id:any
  const [IsPortfolio, setIsPortfolio] = React.useState(false);
  const [CompoenetItem, setComponent] = React.useState([]);
  const [update, setUpdate] = React.useState(0);
  const [EditData, setEditData] = React.useState<any>({});
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [CMSItemRank, setCMSItemRank] = React.useState([]);
  const [isOpenPicker, setIsOpenPicker] = React.useState(false);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [TaskStatusPopup, setTaskStatusPopup] = React.useState(false);
  const [CMSToolComponent, setCMSToolComponent] = React.useState("");
  const [TaskCat, setTaskCat] = React.useState("");
  const [CollapseExpend, setCollapseExpend] = React.useState(true);
  const [CategoriesData, setCategoriesData] = React.useState([]);
  const TeamConfigInfo = item.props;
  const [projectTaggedPortfolios, setProjectTaggedPortfolios] = React.useState([]);
  const [TeamConfig, setTeamConfig] = React.useState();
  const [date, setDate] = React.useState(undefined);
  const [siteDetails, setsiteDetails] = React.useState([]);
  const [checkedCat, setcheckedCat] = React.useState(false);
  const [linkedComponentData, setLinkedComponentData] = React.useState([]);
  const [Startdate, setStartdate] = React.useState(undefined);
  const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
  const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
  const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
  const [Completiondate, setCompletiondate] = React.useState(undefined);
  const [AssignUser, setAssignUser] = React.useState(undefined);
  const [IsComponentPicker, setIsComponentPicker] = React.useState(false);
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const [activePicker, setActivePicker] = React.useState(null);
  const [PercentCompleteStatus, setPercentCompleteStatus] = React.useState('');
  const [datepicker, setdatepicker] = React.useState(false);
  // Save % complete
  const [Items, setItem] = React.useState("");
  const handleFieldChange = (fieldName: any) => (e: any) => {
    const updatedItem = { ...EditData[0], [fieldName]: e.target.value };
    setItem(updatedItem);
  };

  // Date picker closer
  const handlePickerFocus = (pickerName: any) => {
    setActivePicker(pickerName);
  };

  const StatusArray = [
    { value: 1, status: "1% For Approval", taskStatusComment: "For Approval" },
    { value: 2, status: "2% Follow Up", taskStatusComment: "Follow Up" },
    { value: 3, status: "3% Approved", taskStatusComment: "Approved" },
    { value: 5, status: "5% Acknowledged", taskStatusComment: "Acknowledged" },
    { value: 10, status: "10% working on it", taskStatusComment: "working on it" },
    { value: 70, status: "70% Re-Open", taskStatusComment: "Re-Open" },
    { value: 80, status: "80% In QA Review", taskStatusComment: "In QA Review" },
    { value: 90, status: "90% Project completed", taskStatusComment: "Task completed" },
    { value: 93, status: "93% For Review", taskStatusComment: "For Review" },
    { value: 96, status: "96% Follow-up later", taskStatusComment: "Follow-up later" },
    { value: 99, status: "99% Completed", taskStatusComment: "Completed" },
    { value: 100, status: "100% Closed", taskStatusComment: "Closed" }
  ]
  const handlePickerBlur = () => {
    setActivePicker(null);
  };
  // $('.ms-Dialog-main .main-153').hide();
  const setModalIsOpenToTrue = (e: any) => {
    // e.preventDefault()
    setModalIsOpen(true);
  };
  const onEditorStateChange = React.useCallback(
    (rawcontent) => {
      setEditorState(rawcontent.blocks[0].text);
    },
    [editorState]
  );
  const setModalIsOpenToFalse = () => {

    EditComponentCallback();
    setModalIsOpen(false);
  };
  // const handleDate = (date: any) => {
  //   EditData.CompletedDate = date;
  //   setCompletiondate(date);
  //   setComponent((EditData) => [...EditData]);
  // };
  // const handleDatestart = (date: any) => {
  //   EditData.StartDate = date;
  //   setStartdate(date);
  //   setComponent((EditData) => [...EditData]);
  // };
  // const handleDatedue = (date: any) => {
  //   EditData.DueDate = date;
  //   setDate(date);
  //   setComponent((EditData) => [...EditData]);
  // };
  const Call = React.useCallback((item: any, type: any) => {
    setIsPortfolio(false);

    if (type == "Category") {
      if (item != undefined && item?.Categories != "") {
        var title: any = {};
        title.Title = item?.categories;
        item?.categories?.map((itenn: any) => {
          if (!isItemExists(CategoriesData, itenn.Id)) {
            CategoriesData.push(itenn);
          }
        });
        item?.TaskCategories.map((itenn: any) => {
          CategoriesData.push(itenn);
        });
        setCategoriesData(CategoriesData);
      }
    }

    if (CategoriesData != undefined) {
      CategoriesData.forEach(function (type: any) {
        CheckCategory.forEach(function (val: any) {
          if (type.Id == val.Id) {
            BackupCat.push(type.Id);
            setcheckedCat(true);
          }
        });
      });
      setUpdate(update + 2);
    }
    setIsComponentPicker(false);
    setIsComponent(false);
    // setComponent(CompoenetItem => ([...CompoenetItem]));
  }, []);

  const ComponentServicePopupCallBack = React.useCallback(
    (DataItem: any, Type: any, functionType: any) => {
      if (functionType == "close") {
        setIsComponent(false);
        setIsPortfolio(false);
      } else {
        if (DataItem?.length > 0) {
          DataItem.map((selectedData: any) => {
            TaggedPortfolios.push(selectedData);
          });
        }
        setProjectTaggedPortfolios(TaggedPortfolios);
        setIsPortfolio(false);
      }
    },
    []
  );

  var isItemExists = function (arr: any, Id: any) {
    var isExists = false;
    $.each(arr, function (index: any, items: any) {
      if (items.ID === Id) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
  const GetTaskUsers = async () => {
    let web = new Web(AllListId?.siteUrl);
    let taskUsers = [];
    taskUsers = await web.lists
      .getById(AllListId?.TaskUsertListID)
      .items.top(4999)
      .get();
    AllUsers = taskUsers;
    var UpdatedData: any = {};
    AllUsers.forEach(function (taskUser: any) {
      // item.props.AssignedTo.forEach(function(assign:any){
      //     if (taskUser.AssingedToUserId == assign.Id) {
      //         UpdatedData['AuthorName'] = taskUser.Title;
      //         UpdatedData['Company'] = taskUser.Company;
      //         UpdatedData['AuthorImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
      //     }
      //     Assin.push(UpdatedData)
      // })
      setAssignUser(Assin);
    });
  };
  // var ConvertLocalTOServerDate = function (LocalDateTime: any, dtformat: any) {
  //     if (dtformat == undefined || dtformat == '') dtformat = "MM-DD-YYYY";

  //     // below logic works fine in all condition
  //     if (LocalDateTime != '') {
  //         var serverDateTime;
  //         var vLocalDateTime = new Date(LocalDateTime);
  //         //var offsetObj = GetServerOffset();
  //         //var IANATimeZoneName = GetIANATimeZoneName();
  //         var mDateTime = moment(LocalDateTime);
  //         // serverDateTime = mDateTime.tz('Europe/Berlin').format(dtformat); // 5am PDT
  //         //serverDateTime = mDateTime.tz('America/Los_Angeles').format(dtformat);  // 5am PDT
  //         return serverDateTime;
  //     }
  //     return '';
  // }
  var getMultiUserValues = function (item: any) {
    var users = "";
    var isuserexists = false;
    var userarray = [];
    if (item.AssignedTo != undefined && item.AssignedTo.results != undefined)
      userarray = item.AssignedTo.results;
    for (var i = 0; i < userarray.length; i++) {
      users += userarray[i].Title + ", ";
    }
    if (users.length > 0) users = users.slice(0, -2);
    return users;
  };
  var parseJSON = function (jsonItem: any) {
    var json = [];
    try {
      json = JSON.parse(jsonItem);
    } catch (err) {
      console.log(err);
    }
    return json;
  };
  const GetSiteIcon = (listName: string) => {

    if (listName != undefined) {
      let siteicon = '';
      smartmetaDetails?.map((icondata: any) => {
        if (icondata.Title != undefined) {
          if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x0020_Cover != undefined) {
            siteicon = icondata.Item_x0020_Cover.Url
          }
          if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x005F_x0020_Cover != undefined) {
            siteicon = icondata.Item_x005F_x0020_Cover.Url
          }
        }
      })

      return siteicon;
    }

  }


  const getpriority = function (item: any) {
    if (item.PriorityRank >= 0 && item.PriorityRank <= 3) {
      item.Priority = "(3) Low";
    }
    if (item.PriorityRank >= 4 && item.PriorityRank <= 7) {
      item.Priority = "(2) Normal";
    }
    if (item.PriorityRank >= 8) {
      item.Priority = "(1) High";
    }
  };

  var getMasterTaskListTasks = async function () {

    let web = new Web(AllListId?.siteUrl);
    let componentDetails = [];
    componentDetails = await web.lists.getById(AllListId?.MasterTaskListID)
      .items.select(
        "ComponentCategory/Id",
        "ComponentCategory/Title",
        "SiteCompositionSettings",
        "PortfolioStructureID",
        "ItemRank",
        "ShortDescriptionVerified",
        "Portfolio_x0020_Type",
        "BackgroundVerified",
        "descriptionVerified",
        "Synonyms",
        "BasicImageInfo",
        "DeliverableSynonyms",
        "OffshoreComments",
        "OffshoreImageUrl",
        "HelpInformationVerified",
        "IdeaVerified",
        "TechnicalExplanationsVerified",
        "Deliverables",
        "DeliverablesVerified",
        "ValueAddedVerified",
        "CompletedDate",
        "Idea",
        "ValueAdded",
        "TechnicalExplanations",
        "Item_x0020_Type",
        "Sitestagging",
        "Package",
        "Parent/Id",
        "Parent/Title",
        "Short_x0020_Description_x0020_On",
        "Short_x0020_Description_x0020__x",
        "Short_x0020_description_x0020__x0",
        "AdminNotes",
        "AdminStatus",
        "Background",
        "Help_x0020_Information",
        "TaskCategories/Id",
        "TaskCategories/Title",
        "PriorityRank",
        "Reference_x0020_Item_x0020_Json",
        "TeamMembers/Title",
        "TeamMembers/Name",
        "Portfolios/Id",
        "Portfolios/Title",
        "TeamMembers/Id",
        "Item_x002d_Image",
        "ComponentLink",
        "IsTodaysTask",
        "AssignedTo/Title",
        "AssignedTo/Name",
        "AssignedTo/Id",
        "AttachmentFiles/FileName",
        "FileLeafRef",
        "FeedBack",
        "Title",
        "Id",
        "PercentComplete",
        "Company",
        "StartDate",
        "DueDate",
        "Comments",
        "Categories",
        "Status",
        "WebpartId",
        "Body",
        "Mileage",
        "PercentComplete",
        "Attachments",
        "Priority",
        "Created",
        "Modified",
        "Author/Id",
        "Author/Title",
        "Editor/Id",
        "ResponsibleTeam/Id", "ResponsibleTeam/Title",
        "Editor/Title",
        "ClientCategory/Id",
        "ClientCategory/Title"
      )
      .expand(
        "ClientCategory",
        "ComponentCategory",
        "AssignedTo",
        "Portfolios",
        "AttachmentFiles",
        "Author",
        "Editor",
        "ResponsibleTeam",
        "TeamMembers",
        "TaskCategories",
        "Parent"
      )
      .filter("Id eq " + item.props.Id + "")
      .get();
    console.log(componentDetails);

    var Tasks = componentDetails;
    $.each(Tasks, function (index: any, item: any) {
      StatusAutoSuggestion(item?.PercentComplete != undefined ? item?.PercentComplete * 100 : null)
      item.DateTaskDueDate = new Date(item.DueDate);
      if (item.DueDate != null)
        item.TaskDueDate = moment(item.DueDate).format("MM-DD-YYYY");
      // item.TaskDueDate = ConvertLocalTOServerDate(item.DueDate, 'DD/MM/YYYY');
      item.FilteredModifiedDate = item.Modified;
      item.DateModified = new Date(item.Modified);
      item.DateCreatedNew = new Date(item.Created);

      item.DateCreated = item.CreatedDate = moment(item.Created).format(
        "MM-DD-YYYY"
      ); // ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY');
      item.Creatednewdate = moment(item.Created).format("MM-DD-YYYY"); //ConvertLocalTOServerDate(item.Created, 'DD/MM/YYYY HH:mm');
      // item.Modified = moment(item.Modified).format('DD/MM/YYYY');
      //ConvertLocalTOServerDate(item.Modified, 'DD/MM/YYYY HH:mm');
      if (item.PriorityRank == undefined && item.Priority != undefined) {
        switch (item.Priority) {
          case "(1) High":
            item.PriorityRank = 8;
            break;
          case "(2) Normal":
            item.PriorityRank = 4;
            break;
          case "(3) Low":
            item.PriorityRank = 1;
            break;
        }
      }
      getpriority(item);
      item.showdes = true;
      item.assigned = getMultiUserValues(item);
      if (item.ItemRank != undefined)
        item.ItemRankTitle = TaskItemRank[0].filter(
          (option: { rank: any }) => option.rank == item.ItemRank
        )[0].rankTitle;
      item.PercentComplete =
        item.PercentComplete <= 1
          ? item.PercentComplete * 100
          : item.PercentComplete;
      if (item.PercentComplete != undefined) {
        item.PercentComplete = parseInt(item.PercentComplete.toFixed(0));
      }
      item.smartPortfoliosData = [];
      item.smartCategories = [];

      if (item.Sitestagging != undefined && item.Sitestagging != null) {
        item.Sitestagging = JSON.parse(item.Sitestagging);
        item.Sitestagging.forEach(function (site: any) {
          siteDetail.forEach(function (siteDetail: any) {
            siteDetail.isEditableSiteDate = false;
            if (siteDetail.Title == site.Title) {
              siteDetail.Date = site.Date;
              siteDetail.ClienTimeDescription = site.ClienTimeDescription;
              siteDetail.Selected = true;
              siteDetail.flag = true;
            }
          });
        });
      }

      item.AssignedUsers = [];
      AllUsers?.map((userData: any) => {
        item.AssignedTo?.map((AssignedUser: any) => {
          if (userData?.AssingedToUserId == AssignedUser.Id) {
            item.AssignedUsers.push(userData);
          }
        });
      });
      if (item.TaskCategories != undefined) {
        if (item.TaskCategories.results != undefined) {
          map(item.TaskCategories.results, (bj) => {
            if (bj.Title != undefined)
              item.smartCategories.push({ Title: bj.Title, Id: bj.Id });
          });
        }
      }
      item.siteType = "Master Tasks";
      item.taskLeader = "None";
      if (item?.AssignedTo?.length > 0) {
        setTaskAssignedTo(item?.AssignedTo);
      }
      if (item?.ResponsibleTeam?.length > 0) {
        setTaskResponsibleTeam(item?.ResponsibleTeam);
      }
      if (item?.TeamMembers?.length > 0) {
        setTaskTeamMembers(item?.TeamMembers);
      }
      item.taskLeader = getMultiUserValues(item);
      if (item.Task_x0020_Type == undefined)
        item.Task_x0020_Type = "Activity Tasks";
      if (item.DueDate != undefined) {
        item.DueDate = moment(item.DueDate).format("MM-DD-YYYY");
        // setDate(item.DueDate);
      }
      if (item.TaskCategories != null) {
        setCategoriesData(item.TaskCategories);
      }
      if (item.TaskCategories != null) {
        item.TaskCategories.forEach(function (type: any) {
          CheckCategory.forEach(function (val: any) {
            if (type.Id == val.Id) {
              val.isChecked = true;
              // BackupCat.push(type.Id);
              // setcheckedCat(true);
            }
          });
        });
      }
      if (item?.Portfolios?.length > 0) {
        setProjectTaggedPortfolios(item.Portfolios);
        TaggedPortfolios = item.Portfolios;
      }

      var Rr: any = [];
      if (item.ServicePortfolio != undefined) {
        Rr.push(item.ServicePortfolio);
        setLinkedComponentData(Rr);
      }
      if (item.ComponentLink != null) {
        item.ComponentLink = item.ComponentLink.Url;
        //setStartdate(item.StartDate);
      }
      if (item.CompletedDate != undefined) {
        item.CompletedDate = moment(item.CompletedDate).format("MM-DD-YYYY");
      }
      item.SmartCountries = [];

      item.siteUrl = AllListId?.siteUrl;
      item["SiteIcon"] =
        item.siteType == "Master Tasks"
          ? GetSiteIcon(item.siteType)
          : GetSiteIcon(item.siteType);
      if (item.Synonyms != undefined && item.Synonyms.length > 0) {
        item.Synonyms = JSON.parse(item.Synonyms);
      }
    });
    //  deferred.resolve(Tasks);
    setComponent(Tasks);
    backcatss = BackupCat.filter((val: any, id: any, array: any) => {
      return array.indexOf(val) == id;
    });
    //CheckCategory.forEach((val:any)=>{})

    setEditData(Tasks[0]);

    setModalIsOpenToTrue(true);

    //  setModalIsOpenToTrue();
  };

  var ListId: any = "";
  var CurrentSiteUrl: any = "";
  //var CMSItemRank: any = '';
  const [state, setState] = React.useState("state");


  var Item: any = "";
  const TaskItemRank: any = [];
  const site: any = [];
  const siteDetail: any = [];
  const GetSmartmetadata = async () => {
    let web = new Web(AllListId?.siteUrl);
    smartmetaDetails = [];
    let categoryhh: any = [];
    smartmetaDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getById(AllListId?.SmartMetadataListID)
      .items //.getById(this.state.itemID)
      .select(
        "ID,Title,IsVisible,ParentID,Parent/Id,Parent/Title,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable"
      )
      .expand("Parent")
      .top(4999)
      .get();

    console.log(smartmetaDetails);
    if (smartmetaDetails != undefined) {
      smartmetaDetails.forEach(function (val: any) {
        if (val.TaxType == "Sites") {
          site.push(val);
        }
        if (
          val.TaxType == "Categories" &&
          (val.Title == "Phone" ||
            val.Title == "Email Notification" ||
            val.Title == "Approval" ||
            val.Title == "Immediate")
        ) {
          categoryhh.push(val);
        }
      });
      CheckCategory = categoryhh.filter((val: any, id: any, array: any) => {
        return array.indexOf(val) == id;
      });
      site.forEach(function (val: any) {
        if (
          val.listId != undefined &&
          val.Title != "Master Tasks" &&
          val.Title != "Small Projects" &&
          val.Title != "Foundation" &&
          val.Title != "Offshore Tasks" &&
          val.Title != "DRR" &&
          val.Title != "Health" &&
          val.Title != "Gender"
        ) {
          siteDetail.push(val);
        }
      });
    }
    setsiteDetails(siteDetail);
    getMasterTaskListTasks();
  };

  React.useEffect(() => {
    AllListId = item?.AllListId;
    GetTaskUsers();
    var initLoading = function () {
      if (item.props != undefined) {
        var Item = item.props;
        if (Item.siteType == "HTTPS:") {
          Item.siteType = "HHHH";
        }
        GetSmartmetadata();

        ListId = AllListId?.MasterTaskListID;
        CurrentSiteUrl = AllListId?.siteUrl;
        TaskItemRank.push([
          { rankTitle: "Select Item Rank", rank: null },
          { rankTitle: "(8) Top Highlights", rank: 8 },
          { rankTitle: "(7) Featured Item", rank: 7 },
          { rankTitle: "(6) Key Item", rank: 6 },
          { rankTitle: "(5) Relevant Item", rank: 5 },
          { rankTitle: "(4) Background Item", rank: 4 },
          { rankTitle: "(2) to be verified", rank: 2 },
          { rankTitle: "(1) Archive", rank: 1 },
          { rankTitle: "(0) No Show", rank: 0 },
        ]);
        setCMSItemRank(TaskItemRank[0]);
        // if (useeffectdata == false)
        //     setuseeffectdata(true);
        // else setuseeffectdata(false);
        //loadColumnDetails();
      }
    };
    initLoading();
  }, []);
  const EditComponent = (items: any, title: any) => {
    // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
    setIsComponent(true);
    setCMSToolComponent(items);
    // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
  };
  const GetComponents = async () => {
    let web = new Web(AllListId?.siteUrl);
    let componentDetails = [];
    componentDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getById(AllListId?.MasterTaskListID)
      .items //.getById(this.state.itemID)
      .select(
        "ID",
        "Title",
        "DueDate",
        "Status",
        "ItemRank",
        "Item_x0020_Type",
        "Parent/Id",
        "Author/Id",
        "Author/Title",
        "Parent/Title",
        "TaskCategories/Id",
        "TaskCategories/Title",
        "AssignedTo/Id",
        "AssignedTo/Title",
        "TeamMembers/Id",
        "TeamMembers/Title",
        "ClientCategory/Id",
        "ClientCategory/Title"
      )
      .expand(
        "TeamMembers",
        "Author",
        "ClientCategory",
        "Parent",
        "TaskCategories",
        "AssignedTo"
      )
      .top(4999)
      .filter("Item_x0020_Type eq Component")
      .get();

    console.log(componentDetails);
  };
  function EditComponentCallback() {
    if (postedData?.Id == undefined && postedData?.ID == undefined) {
      postedData = {
        ...postedData, ...EditData
      }
      postedData = {
        ...postedData,
        ComponentLink: {
          Url: EditData?.ComponentLink != undefined ? EditData?.ComponentLink : ''
        },
      }
    }
    item.Call(postedData, "EditPopup");
  }
  let mentionUsers: any = [];
  //  mentionUsers = this.taskUsers.map((i:any)=>{
  //     return({id : i.Title,display: i.Title})
  // });

  var generateHierarchichalData = function (item: any, items: any) {
    var autoCompleteItem: any = {};
    autoCompleteItem["value"] = item.Title;
    autoCompleteItem["Id"] = item.Id;
    autoCompleteItem["description"] = item.Description1;
    autoCompleteItem["TaxType"] = item.TaxType;
    if (item.SiteType != undefined)
      autoCompleteItem["SiteType"] = item.SiteType;
    autoCompleteItem["label"] = item.Title;
    map(items, (parentItem) => {
      if (item.ParentID == parentItem.Id) {
        autoCompleteItem["label"] = parentItem.Title + " > " + item.Title;
        if (parentItem.ParentID > 0) {
          map(items, (gParentItem) => {
            if (parentItem.ParentID == gParentItem.Id) {
              autoCompleteItem["label"] =
                gParentItem.Title + " > " + autoCompleteItem.label;
              if (gParentItem.ParentID > 0) {
                map(items, (mParentItem) => {
                  if (gParentItem.ParentID == mParentItem.Id) {
                    autoCompleteItem["label"] =
                      mParentItem.Title + " > " + autoCompleteItem.label;

                    return false;
                  }
                });
              }
            }
          });
        }

        return false;
      }
    });

    return autoCompleteItem;
  };

  const StatusAutoSuggestion = (percentValue: any) => {
    setTaskStatusPopup(false)
    let StatusInput = percentValue;
    let TaskStatus = '';
    let PercentCompleteStatus = '';
    let value = Number(percentValue)
    if (value <= 100) {
      if (StatusInput > 0) {
        if (StatusInput == 0) {
          TaskStatus = 'Not Started'
          PercentCompleteStatus = 'Not Started';

        }
        if (StatusInput < 70 && StatusInput > 10 || StatusInput < 80 && StatusInput > 70) {
          TaskStatus = "In Progress";
          PercentCompleteStatus = `${Number(StatusInput).toFixed(0)}% In Progress`;
        } else {
          StatusArray.map((percentStatus: any, index: number) => {
            if (percentStatus.value == StatusInput) {
              TaskStatus = percentStatus.taskStatusComment;
              PercentCompleteStatus = percentStatus.status;
            }
          })
          if (StatusInput == 10) {
            EditData.CompletedDate = undefined;
            if (EditData.StartDate == undefined) {
              EditData.StartDate = Moment(new Date()).format("MM-DD-YYYY")
            }
          }
        }
        setPercentCompleteStatus(PercentCompleteStatus);
        setEditData({ ...EditData, PercentComplete: value, Status: TaskStatus })
      } else {
        TaskStatus = '';
        PercentCompleteStatus = '';
        setPercentCompleteStatus(PercentCompleteStatus);
      }
    } else {
      alert("Status not should be greater than 100");
      setEditData({ ...EditData, PriorityRank: 0 })
    }


    // value: 5, status: "05% Acknowledged", taskStatusComment: "Acknowledged"
  }
  const setPriority = function (item: any, val: number) {
    item.PriorityRank = val;
    getpriority(item);

    setComponent((EditData) => [...EditData]);
  };
  const EditPortfolio = (item: any, type: any) => {
    if (type == "Portfolios") {
      if (item.Component != undefined) {
        item.smartPortfoliosData = [];
        if (item.smartPortfoliosData != undefined) {
          projectTaggedPortfolios?.map((com: any) => {
            item.smartPortfoliosData.push({ Title: com?.Title, Id: com?.Id });
          });
        }
      }
    }

    portfolioType = type;
    setIsPortfolio(true);
    setCMSToolComponent(item);
  };
  const setPriorityNew = function (e: any, item: any) {
    item.PriorityRank = e.target.value;
    if (item.PriorityRank <= 10) {
      if (
        item.PriorityRank == 8 ||
        item.PriorityRank == 9 ||
        item.PriorityRank == 10
      ) {
        item.Priority = "(1) High";
      }
      if (
        item.PriorityRank == 4 ||
        item.PriorityRank == 5 ||
        item.PriorityRank == 6 ||
        item.PriorityRank == 7
      ) {
        item.Priority = "(2) Normal";
      }
      if (
        item.PriorityRank == 1 ||
        item.PriorityRank == 2 ||
        item.PriorityRank == 3 ||
        item.PriorityRank == 0
      ) {
        item.Priority = "(3) Low";
      }
    } else {
      item.PriorityRank = "";
      alert("Please Enter priority between 0 to 10");
    }
    // getpriority(item);
    setComponent((EditData) => [...EditData]);
  };
  const setTime = function (item: any, val: any) {
    item.Mileage = val;
    setComponent((EditData) => [...EditData]);
  };
  const setStatus = function (item: any, val: any) {
    item.AdminStatus = val;
    setComponent((EditData) => [...EditData]);
  };
  const expendcollapsAccordion = (item: any, title: any) => {
    item[title] = item[title] = item[title] == true ? false : true;
    setComponent((EditData) => [...EditData]);
  };

  const SaveData = async () => {
    var UploadImage: any = [];

    var item: any = {};
    var smartComponentsIds: any[] = [];
    var RelevantPortfolioIds = "";
    var Items = EditData;

    CheckCategory?.forEach((itemm: any, index: any) => {
      CategoriesData.map((catId, index) => {
        if (itemm.Id == catId.Id) {
          CategoriesData.splice(index, 1);
        }
      });
      if (itemm.isChecked == true || itemm.isselected == true) {
        array2.push(itemm);
      }
    });

    if (array2 != undefined && array2.length > 0) {
      array2.map((item: any) => {
        if (item.isselected == true || item.isChecked == true) {
          NewArray.push(item);
        }
      });
      //  NewArray = array2
    }

    if (NewArray != undefined && NewArray.length > 0) {
      CheckCategory = [];
      NewArray.map((NeitemA: any) => {
        CategoriesData.push(NeitemA);
      });
    } else {
      CheckCategory = [];
    }
    var CategoryID: any = [];
    var categoriesItem = "";
    CategoriesData?.map((category: any) => {
      if (category.Title != undefined) {
        categoriesItem =
          categoriesItem == ""
            ? category.Title
            : categoriesItem + ";" + category.Title;
      }
      if (category.Id != undefined) {
        CategoryID.push(category.Id);
      }
    });


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
    let selectedPortfoliosData: any[] = [];
    if (projectTaggedPortfolios !== undefined && projectTaggedPortfolios.length > 0) {
      $.each(projectTaggedPortfolios, function (index: any, smart: any) {
        selectedPortfoliosData.push(smart?.Id);
      });
    }
    let selectedService: any[] = [];
    if (linkedComponentData !== undefined && linkedComponentData.length > 0) {
      $.each(linkedComponentData, function (index: any, smart: any) {
        selectedService.push(smart?.Id);
      });
    }

    if (
      Items.ItemRankTitle != undefined &&
      Items.ItemRankTitle != "Select Item Rank"
    )
      var ItemRank = CMSItemRank.filter(
        (option: { rankTitle: any }) => option.rankTitle == Items.ItemRankTitle
      )[0].rank;
    let web = new Web(AllListId?.siteUrl);
    let postData: any = {
      Title: Items.Title,
      ItemRank: ItemRank,
      PriorityRank: Items.PriorityRank,
      PortfoliosId: {
        results:
          selectedPortfoliosData !== undefined && selectedPortfoliosData?.length > 0
            ? selectedPortfoliosData
            : [],
      },
      DeliverableSynonyms: Items.DeliverableSynonyms,
      StartDate: EditData.StartDate
        ? moment(EditData.StartDate).format("MM-DD-YYYY")
        : null,
      DueDate: EditData.DueDate
        ? moment(EditData.DueDate).format("MM-DD-YYYY")
        : null,
      CompletedDate: EditData.CompletedDate
        ? moment(EditData.CompletedDate).format("MM-DD-YYYY")
        : null,
      // Categories:EditData.smartCategories != undefined && EditData.smartCategories != ''?EditData.smartCategories[0].Title:EditData.Categories,
      Categories: categoriesItem ? categoriesItem : null,
      TaskCategoriesId: { results: CategoryID },
      // ClientCategoryId: { "results": RelevantPortfolioIds },
      ServicePortfolioId:
        RelevantPortfolioIds != "" ? RelevantPortfolioIds : null,
      // Synonyms: JSON.stringify(Items["Synonyms"]),
      Package: Items.Package,
      AdminStatus: Items.AdminStatus,
      Priority: Items.Priority,
      Mileage: Items.Mileage,
      PercentComplete: Items?.PercentComplete ? (Items?.PercentComplete / 100) : null,
      Status: Items?.Status ? Items?.Status : null,
      ValueAdded: Items.ValueAdded,
      Idea: Items.Idea,
      Background: Items.Background,
      AdminNotes: Items.AdminNotes,
      ComponentLink: {
        Description:
          Items.ComponentLink != undefined
            ? Items.ComponentLink
            : null,
        Url:
          Items.ComponentLink != undefined
            ? Items.ComponentLink
            : null,
      },
      TechnicalExplanations:
        PostTechnicalExplanations != undefined &&
          PostTechnicalExplanations != ""
          ? PostTechnicalExplanations
          : EditData.TechnicalExplanations,
      Deliverables:
        PostDeliverables != undefined && PostDeliverables != ""
          ? PostDeliverables
          : EditData.Deliverables,
      Short_x0020_Description_x0020_On:
        PostShort_x0020_Description_x0020_On != undefined &&
          PostShort_x0020_Description_x0020_On != ""
          ? PostShort_x0020_Description_x0020_On
          : EditData.Short_x0020_Description_x0020_On,
      Body:
        PostBody != undefined && PostBody != "" ? PostBody : EditData.Body,
      AssignedToId: {
        results:
          AssignedToIds != undefined && AssignedToIds?.length > 0
            ? AssignedToIds
            : [],
      },
      ResponsibleTeamId: {
        results:
          ResponsibleTeamIds != undefined && ResponsibleTeamIds?.length > 0
            ? ResponsibleTeamIds
            : [],
      },
      TeamMembersId: {
        results:
          TeamMemberIds != undefined && TeamMemberIds?.length > 0
            ? TeamMemberIds
            : [],
      }
    }
    await web.lists
      .getById(AllListId?.MasterTaskListID)
      .items.getById(Items.ID)
      .update(postData)
      .then((res: any) => {
        postData.DisplayDueDate = Moment(postData?.DueDate).format("DD/MM/YYYY");
        postData.DisplayCreateDate = Moment(postData?.Created).format("DD/MM/YYYY");
        if (postData.DueDate == 'Invalid date' || '') {
          postData.DueDate = postData?.DueDate?.replaceAll("Invalid date", "")
        }
        if (postData.DisplayDueDate == "Invalid date" || "") {
          postData.DisplayDueDate = postData.DisplayDueDate.replaceAll(
            "Invalid date",
            ""
          );
        }
        if (postData.DisplayCreateDate == "Invalid date" || "") {
          postData.DisplayCreateDate = postData.DisplayCreateDate.replaceAll(
            "Invalid date",
            ""
          );
        }
        postData["TaskID"] = postData?.PortfolioStructureID;
        postedData = {
          ...postData,
          TaskCategories: CategoriesData,
          AssignedTo: TaskAssignedTo,
          ResponsibleTeam: TaskResponsibleTeam,
          TeamMembers: TaskTeamMembers,
          Item_x0020_Type: EditData?.Item_x0020_Type,
          ComponentLink: {
            Url: Items?.ComponentLink != undefined ? Items?.ComponentLink : ''
          },
          Body: EditData.Body,
          taggedPortfolios: projectTaggedPortfolios

        }
        console.log(res);
        TaggedPortfolios = [];
        setModalIsOpenToFalse();
      });
  };
  const EditComponentPicker = (item: any, title: any) => {
    setIsComponentPicker(true);
    setTaskCat(item);
  };

  const ChangeStatus = (e: any, item: any) => {
    item.AdminStatus = e.target.value;
    setComponent((EditData) => [...EditData]);
  };
  const HtmlEditorCallBack = React.useCallback((Editorvalue: any) => {
    let message: any = Editorvalue;
    EditData.Body = message;
    PostBody = EditData.Body;
    console.log("Editor Data call back ====", Editorvalue);
  }, []);

  const DeliverablesHtmlEditorCallBack = React.useCallback(
    (Editorvalue: any) => {
      let message: any = Editorvalue;
      EditData.Deliverables = message;
      PostDeliverables = EditData.Deliverables;
      console.log("Editor Data call back ====", Editorvalue);
    },
    []
  );
  const shareThisTaskFunction = () => {
    var link =
      "mailTo:" +
      "?cc:" +
      "&subject=" +
      EditData?.Title +
      "&body=" +
      `${AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${EditData?.Id}`;
    window.location.href = link;
  };
  const DDComponentCallBack = (dt: any) => {
    setTeamConfig(dt);
    console.log(TeamConfig);
    //  Changes
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
      EditData.AssignedTo = tempArray;
    } else {
      setTaskAssignedTo([]);
      EditData.AssignedTo = [];
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
      EditData.TeamMembers = tempArray;
    } else {
      setTaskTeamMembers([]);
      EditData.TeamMembers = [];
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
      EditData.ResponsibleTeam = tempArray;
    } else {
      setTaskResponsibleTeam([]);
      EditData.ResponsibleTeam = [];
    }


    // ChangesEnd

  };
  const deleteCategories = (id: any) => {
    CategoriesData.map((catId, index) => {
      if (id == catId.Id) {
        CategoriesData.splice(index, 1);
      }
    });
    setCategoriesData((CategoriesData) => [...CategoriesData]);
  };


  const onRenderCustomHeader = () => {
    return (
      <>
        <div className="align-items-center d-flex full-width justify-content-between">
          <div className="ps-4">
            {" "}
            <ul className=" m-0 p-0 spfxbreadcrumb">
              <li>
                {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}

                <a
                  target="_blank"
                  data-interception="off"
                  href={`${AllListId?.siteUrl}/SitePages/PX-Overview.aspx`}
                >
                  Project
                </a>
              </li>
              {EditData?.Item_x0020_Type != "Project" && EditData?.Parent?.Title ?
                <li>
                  {" "}
                  <a data-interception="off" href={`${AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${EditData?.Parent?.Id}`}>{EditData?.Parent?.Title}</a>{" "}
                </li> : ''}
              <li>
                <a>{EditData.Title}</a>
              </li>
            </ul>
          </div>
          
          <div className="feedbkicon">
            {" "}
            <Tooltip ComponentId='6490' />{" "}
          </div>
        </div>
      </>
    );
  };

  const deleteTask = async () => {
    var confirmDelete = confirm("Are you sure, you want to delete this?");
    if (confirmDelete) {
      let web = new Web(AllListId?.siteUrl);
      await web.lists
        .getById(AllListId?.MasterTaskListID)
        .items.getById(item.props.Id)
        .recycle()
        .then((i) => {
          console.log(i);
          setComponent((EditData) => [...EditData]);
          setModalIsOpenToFalse();
          item.showProgressBar();
        });
    }
  };
  var NewArray: any = [];
  var array2: any = [];
  const checkCat = (type: any, e: any) => {
    const { checked } = e.target;
    if (checked == true) {
      type.isselected = true;
      array2.push(type);
    } else {
      type.isselected = false;
      CheckCategory?.forEach((itemm: any, index: any) => {
        if (itemm.Id == type.Id) {
          itemm.isChecked = false;
        }
      });

    }

  };



  const RemoveSelectedServiceComponent = (DataId: any, ComponentType: any) => {
    let BackupArray: any = [];
    let TempArray: any = [];

    if (ComponentType == "Portfolios") {
      BackupArray = TaggedPortfolios;
    }
    if (BackupArray != undefined && BackupArray.length > 0) {
      BackupArray.map((componentData: any) => {
        if (DataId != componentData.Id) {
          TempArray.push(componentData);
        }
      });
    }
    if (TempArray != undefined && TempArray.length >= 0) {
      if (ComponentType == "Portfolios") {
        TaggedPortfolios = TempArray;
        setProjectTaggedPortfolios(TempArray);
      }
    }
  };
  return (
    <>
      {console.log("Done")}
      <Panel
        headerText={`  Service-Portfolio > ${EditData.Title}`}
        isOpen={modalIsOpen}
        onDismiss={setModalIsOpenToFalse}
        onRenderHeader={onRenderCustomHeader}
        isBlocking={false}
        type={PanelType.large}
      >
        {EditData != undefined && EditData.Title != undefined && (
          <>
          <div className="subheading alignCenter ms-0">
            <span className="siteColor">
              <label className='ms-1 Dyicons hover-text'>{EditData?.Item_x0020_Type !== "Sprint" ? `${EditData?.Item_x0020_Type?.charAt(0)}` : "X"} <span className='tooltip-text pop-right'>{EditData?.Title}</span></label>
              {`${EditData?.PortfolioStructureID} - ${EditData?.Title}`}
            </span>
          </div>
          <div id="EditGrueneContactSearch">
            <div className="modal-body mb-5">
              <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home"
                    type="button"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    BASIC INFORMATION
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="cncept-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#concept"
                    type="button"
                    role="tab"
                    aria-controls="concept"
                    aria-selected="false"
                  >
                    CONCEPT
                  </button>
                </li>
              </ul>
              <div
                className="tab-content border border-top-0 clearfix "
                id="myTabContent"
              >
                <div
                  className="tab-pane  show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <div
                    className="tab-pane  show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <div className="row  px-3 py-2">
                      <div className="col-sm-5 ">
                        <div className="col-12">
                          <div className="input-group">
                            <label className="form-label  full-width">
                              Title
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={
                                EditData.Title != undefined
                                  ? EditData.Title
                                  : ""
                              }
                              onChange={(e) =>
                                (EditData.Title = e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="mx-0 row ">
                          <div className="col-sm-12 mt-2 p-0">
                            <div className="input-group">
                              <label className="form-label full-width">
                                Item Rank
                              </label>
                              <select
                                className="full_width searchbox_height"
                                defaultValue={EditData.ItemRankTitle}
                                onChange={(e) =>
                                  (EditData.ItemRankTitle = e.target.value)
                                }
                              >
                                <option>
                                  {EditData.ItemRankTitle == undefined
                                    ? "select Item Rank"
                                    : EditData.ItemRankTitle}
                                </option>
                                {CMSItemRank &&
                                  CMSItemRank.map(function (
                                    h: any,
                                    i: any
                                  ) {
                                    return (
                                      <option
                                        key={i}
                                        defaultValue={EditData.ItemRankTitle}
                                      >
                                        {EditData.ItemRankTitle == h.rankTitle
                                          ? EditData.ItemRankTitle
                                          : h.rankTitle}
                                      </option>
                                    );
                                  })}
                              </select>
                            </div>
                          </div>

                          <div className="col-sm-12 mt-2 p-0">
                            <div className="row">
                              <div className="col-sm-6">
                                <div className="input-group">
                                  <label className="form-label full-width">Status</label>
                                  <input type="text" maxLength={3} placeholder="% Complete" className="form-control px-2"
                                    defaultValue={EditData?.PercentComplete != undefined ? Number(EditData?.PercentComplete).toFixed(0) : null}
                                    value={EditData?.PercentComplete != undefined ? Number(EditData?.PercentComplete).toFixed(0) : null}
                                    onChange={(e) => StatusAutoSuggestion(e.target.value)} />
                                  <span className="input-group-text" title="Status Popup" onClick={() => setTaskStatusPopup(true)}>
                                    <span title="Edit Task" className="svg__iconbox svg__icon--editBox"></span>
                                  </span>
                                </div>

                                {PercentCompleteStatus?.length > 0 ?
                                  <span className="full-width SpfxCheckRadio">
                                    <input type='radio' className="radio" checked />
                                    <label className="pt-1">
                                      {PercentCompleteStatus}
                                    </label>
                                  </span> : null}

                              </div>
                              <div className="col-sm-6">
                                <div className="input-group">
                                  <label className="form-label full-width  mx-2">
                                    Working Member
                                  </label>
                                  {EditData?.AssignedUsers?.map(
                                    (userDtl: any, index: any) => {
                                      return (
                                        <div className="TaskUsers">
                                          <a target="_blank"
                                          >
                                            <img className="ProirityAssignedUserPhoto ms-2" src={
                                              userDtl?.Item_x0020_Cover?.Url
                                                ? userDtl?.Item_x0020_Cover?.Url
                                                : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                                            }
                                            />
                                          </a>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                        <div className="mx-0 row mt-2">
                          <div className="col-sm-4 ps-0 ">
                            <div className="input-group">
                              <label className="form-label  full-width">
                                Start Date
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                max="9999-12-31"
                                defaultValue={
                                  EditData.StartDate
                                    ? moment(EditData.StartDate).format(
                                      "YYYY-MM-DD"
                                    )
                                    : ""
                                }
                                onChange={(e) =>
                                  setEditData({
                                    ...EditData,
                                    StartDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-sm-4 ps-0">
                            <div className="input-group">
                              <label className="form-label  full-width">
                                Due Date
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                max="9999-12-31"
                                defaultValue={
                                  EditData.DueDate
                                    ? moment(EditData.DueDate).format(
                                      "YYYY-MM-DD"
                                    )
                                    : ""
                                }
                                onChange={(e) =>
                                  setEditData({
                                    ...EditData,
                                    DueDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-sm-4 p-0">
                            <div className="input-group">
                              <label className="form-label  full-width">
                                {" "}
                                Completion Date{" "}
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                max="9999-12-31"
                                defaultValue={
                                  EditData.CompletedDate
                                    ? moment(EditData.CompletedDate).format(
                                      "YYYY-MM-DD"
                                    )
                                    : ""
                                }
                                onChange={(e) =>
                                  setEditData({
                                    ...EditData,
                                    CompletedDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mx-0 row mt-2 ">
                          {/* <div className="col-sm-6 ps-0 time-status">
                            <div className="input-group mb-2">
                              <label className="form-label  full-width">
                                Status
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={EditData.AdminStatus}
                                onChange={(e) => ChangeStatus(e, EditData)}
                              />
                            </div>
                            <ul className="p-0 mt-1 mb-0">

                              <li className="form-check">
                                <label className="SpfxCheckRadio">
                                  <input
                                    className="radio"
                                    name="NotStarted"
                                    type="radio"
                                    value="Not Started"
                                    checked={
                                      EditData.AdminStatus === "Not Started"
                                        ? true
                                        : false
                                    }
                                    onChange={(e) =>
                                      setStatus(EditData, "Not Started")
                                    }
                                  ></input>
                                  Not Started{" "}
                                </label>

                              </li>
                              <li className="form-check">
                                <label className="SpfxCheckRadio">
                                  <input
                                    className="radio"
                                    name="NotStarted"
                                    type="radio"
                                    value="In Preparation"
                                    onChange={(e) =>
                                      setStatus(EditData, "In Preparation")
                                    }
                                    checked={
                                      EditData.AdminStatus === "In Preparation"
                                        ? true
                                        : false
                                    }
                                  ></input>
                                  In Preparation
                                </label>
                              </li>
                              <li className="form-check">
                                <label className="SpfxCheckRadio">
                                  <input
                                    className="radio"
                                    name="NotStarted"
                                    type="radio"
                                    value="In Development"
                                    onChange={(e) =>
                                      setStatus(EditData, "In Development")
                                    }
                                    checked={
                                      EditData.AdminStatus === "In Development"
                                        ? true
                                        : false
                                    }
                                  ></input>
                                  In Development{" "}
                                </label>
                              </li>
                              <li className="form-check">
                                <label className="SpfxCheckRadio">
                                  <input
                                    className="radio"
                                    name="NotStarted"
                                    type="radio"
                                    value="Active"
                                    onChange={(e) => setStatus(EditData, "Active")}
                                    checked={
                                      EditData.AdminStatus === "Active"
                                        ? true
                                        : false
                                    }
                                  ></input>
                                  Active</label>
                              </li>
                              <li className="form-check">
                                <label className="SpfxCheckRadio">
                                  <input
                                    className="radio"
                                    name="NotStarted"
                                    type="radio"
                                    value="Archived"
                                    onChange={(e) =>
                                      setStatus(EditData, "Archived")
                                    }
                                    checked={
                                      EditData.AdminStatus === "Archived"
                                        ? true
                                        : false
                                    }
                                  ></input>

                                  Archived{" "}
                                </label>
                              </li>
                              <li className="form-check">
                                <label className="SpfxCheckRadio">
                                  <input
                                    className="radio"
                                    name="NotStarted"
                                    type="radio"
                                    value="Completed"
                                    onChange={(e) =>
                                      setStatus(EditData, "Completed")
                                    }
                                    checked={
                                      EditData.AdminStatus === "Completed"
                                        ? true
                                        : false
                                    }
                                  ></input>

                                  Completed{" "}
                                </label>
                                </li>
                            </ul>
                          </div> */}
                          <div className="col-sm-6 p-0">
                            <div className="input-group position-relative mb-2">
                              <label className="form-label  full-width">
                                Categories{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={
                                  EditData.Facebook != null
                                    ? EditData.Facebook.Description
                                    : ""
                                }
                              />

                              <span className="input-group-text">
                                <svg
                                  onClick={(e) =>
                                    EditComponentPicker(EditData, "Categories")
                                  }
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 48 48"
                                  fill="none"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </span>
                            </div>

                            <div className="col">
                              <div className="col">
                                {CheckCategory.map((type: any) => {
                                  return (
                                    <>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          defaultChecked={type.isChecked}
                                          type="checkbox"
                                          onClick={(e: any) =>
                                            checkCat(type, e)
                                          }
                                        />
                                        <label className="form-check-label">
                                          {type.Title}
                                        </label>
                                      </div>
                                    </>
                                  );
                                })}

                                {CategoriesData != undefined ? (
                                  <div>
                                    {CategoriesData?.map(
                                      (type: any, index: number) => {
                                        return (
                                          <>
                                            {type.Title != "Phone" &&
                                              type.Title !=
                                              "Email Notification" &&
                                              type.Title != "Approval" &&
                                              type.Title != "Immediate" && (
                                                <div className="block d-flex justify-content-between my-1 p-1">
                                                  <a
                                                    style={{
                                                      color: "#fff !important",
                                                    }}
                                                    target="_blank"
                                                    data-interception="off"
                                                  >
                                                    {type.Title}
                                                  </a>
                                                  <img
                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"
                                                    onClick={() =>
                                                      deleteCategories(type.Id)
                                                    }
                                                    className="p-1"
                                                  />
                                                </div>
                                              )}
                                          </>
                                        );
                                      }
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                      <div className="col-sm-3 ">
                        <div className="col time-status">
                          <div className="input-group mb-2">
                            <label className="form-label  full-width">
                              Priority
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={EditData.PriorityRank}
                              onChange={(e) => setPriorityNew(e, EditData)}
                              maxLength={2}
                            />
                          </div>
                          <ul className="p-0 mt-1 mb-0">
                            <li className="form-check">
                              <label className="SpfxCheckRadio">
                                <input
                                  className="radio"
                                  name="radioPriority"
                                  type="radio"
                                  value="(1) High"
                                  onChange={(e) => setPriority(EditData, 8)}
                                  checked={
                                    EditData.Priority === "(1) High" ? true : false
                                  }
                                ></input>
                                High</label>
                            </li>
                            <li className="form-check">
                              <label className="SpfxCheckRadio">
                                <input
                                  className="radio"
                                  name="radioPriority"
                                  type="radio"
                                  value="(2) Normal"
                                  onChange={(e) => setPriority(EditData, 4)}
                                  checked={
                                    EditData.Priority === "(2) Normal"
                                      ? true
                                      : false
                                  }
                                ></input>
                                Normal</label>
                            </li>
                            <li className="form-check">
                              <label className="SpfxCheckRadio">
                                <input
                                  className="radio"
                                  name="radioPriority"
                                  type="radio"
                                  value="(3) Low"
                                  onChange={(e) => setPriority(EditData, 1)}
                                  checked={
                                    EditData.Priority === "(3) Low" ? true : false
                                  }
                                ></input>
                                Low</label>
                            </li>
                          </ul>
                          <div className="col mt-2">
                            <div className="input-group full-width">
                              <label className="form-label full-width">
                                Portfolio Items
                              </label>
                              <input
                                type="text"
                                className="form-control"
                              />
                              <span className="input-group-text">
                                <span onClick={(e) => EditPortfolio(EditData, "Portfolios")} title="Edit Portfolios" className="svg__iconbox svg__icon--editBox"></span>
                              </span>
                            </div>

                            <div className="  inner-tabb">
                              {projectTaggedPortfolios?.length > 0 ?
                                <span className='full-width'>
                                  {
                                    projectTaggedPortfolios?.map((com: any, index: any) => {
                                      return (
                                        <>
                                          <span style={{ backgroundColor: com?.PortfolioType?.Color }} className="block w-100" >
                                            <a className='hreflink wid90' target="_blank" href={`${AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                            <span onClick={() => RemoveSelectedServiceComponent(com.Id, "Portfolios")} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"></span>

                                          </span>
                                        </>
                                      )
                                    })
                                  }
                                </span> : ''
                              }



                            </div>

                          </div>
                          <div className="col mt-2">
                            <div className="input-group">

                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4  ">
                        <CommentCard
                          siteUrl={EditData?.siteUrl}
                          userDisplayName={EditData.userDisplayName}
                          listName={EditData.siteType}
                          itemID={EditData.Id}
                          AllListId={item?.AllListId}
                        ></CommentCard>
                      </div>
                      <div className="col-sm-12">
                        <div className="input-group mb-2">
                          <label className="form-label  full-width">Relevant URL</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={
                              EditData.ComponentLink != null
                                ? EditData.ComponentLink
                                : ""
                            }
                            onChange={(e) =>
                              (EditData.ComponentLink = e.target.value)
                            }
                            placeholder="Url"
                          ></input>
                        </div>
                        <div className="card shadow-none  mb-2">
                          <div
                            className="accordion-item border-0"
                            id="t_draggable1"
                          >
                            <div
                              className="card-header p-0 border-bottom-0 "
                              onClick={() =>
                                expendcollapsAccordion(EditData, "showdes")
                              }
                            >
                              <button
                                className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                data-bs-toggle="collapse"
                              >
                                <span className="fw-medium font-sans-serif text-900">
                                  <span className="sign">
                                    {EditData.showdes ? (
                                      <SlArrowDown />
                                    ) : (
                                      <SlArrowRight />
                                    )}
                                  </span>{" "}
                                  Description
                                </span>
                              </button>
                            </div>
                            <div className="accordion-collapse collapse show">
                              {EditData.showdes && (
                                <div
                                  className="accordion-body pt-1"
                                  id="testDiv1"
                                >
                                  <span className="text-end pull-right">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      defaultChecked={
                                        EditData.descriptionVerified === true
                                      }
                                    ></input>
                                    <span className="ps-1">Verified</span>
                                  </span>

                                  <HtmlEditorCard
                                    editorValue={
                                      EditData.Body != undefined
                                        ? EditData.Body
                                        : ""
                                    }
                                    HtmlEditorStateChange={HtmlEditorCallBack}
                                  ></HtmlEditorCard>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="tab-pane"
                  id="concept"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="row">
                        <TeamConfigurationCard
                          AllListId={AllListId}
                          ItemInfo={item?.props}
                          parentCallback={DDComponentCallBack}
                        ></TeamConfigurationCard>
                      </div>
                      <div className="row">
                        <section className="accordionbox mt-2">
                          <div className="accordion p-0  overflow-hidden">
                            <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() =>
                                    expendcollapsAccordion(EditData, "showl")
                                  }
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {EditData.showl ? (
                                        <SlArrowDown />
                                      ) : (
                                        <SlArrowRight />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Background
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {EditData.showl && (
                                    <div
                                      className="accordion-body pt-1 p-1"
                                      id="testDiv1"
                                    >
                                      <span className="pull-right">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          defaultChecked={
                                            EditData.BackgroundVerified === true
                                          }
                                          onChange={(e) =>
                                          (EditData.BackgroundVerified =
                                            e.target.value)
                                          }
                                        ></input>
                                        <span className="ps-1">Verified</span>
                                      </span>
                                      <textarea
                                        className="full_width"
                                        defaultValue={EditData.Background}
                                        onChange={(e) =>
                                          (EditData.Background = e.target.value)
                                        }
                                      ></textarea>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() =>
                                    expendcollapsAccordion(EditData, "shows")
                                  }
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {EditData.shows ? (
                                        <SlArrowDown />
                                      ) : (
                                        <SlArrowRight />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Idea
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {EditData.shows && (
                                    <div
                                      className="accordion-body pt-1 p-1"
                                      id="testDiv1"
                                    >
                                      <span className="pull-right">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          defaultChecked={
                                            EditData.IdeaVerified === true
                                          }
                                          onChange={(e) =>
                                          (EditData.BackgroundVerified =
                                            e.target.value)
                                          }
                                        ></input>
                                        <span className="ps-1">Verified</span>
                                      </span>
                                      <textarea
                                        className="full_width"
                                        defaultValue={EditData.Idea}
                                        onChange={(e) =>
                                          (EditData.Idea = e.target.value)
                                        }
                                      ></textarea>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() =>
                                    expendcollapsAccordion(EditData, "showm")
                                  }
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {EditData.showm ? (
                                        <SlArrowDown />
                                      ) : (
                                        <SlArrowRight />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Deliverables
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {EditData.showm && (
                                    <div
                                      className="accordion-body pt-1 p-1"
                                      id="testDiv1"
                                    >
                                      <span className="pull-right">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          defaultChecked={
                                            EditData.DeliverablesVerified ===
                                            true
                                          }
                                        ></input>
                                        <span className="ps-1">Verified</span>
                                      </span>
                                      <HtmlEditorCard
                                        editorValue={
                                          EditData.Deliverables != undefined
                                            ? EditData.Deliverables
                                            : ""
                                        }
                                        HtmlEditorStateChange={
                                          DeliverablesHtmlEditorCallBack
                                        }
                                      ></HtmlEditorCard>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                    {/* <div className="col-sm-5"></div> */}
                  </div>
                </div>
              </div>
            </div>

            <footer className="bg-f4" style={{ position: "absolute", bottom: "0", width: "100%", zIndex: "9", left: "0px" }}>
              <div className="align-items-center d-flex justify-content-between px-4 py-2">
                <div>
                  <div>
                    Created{" "}
                    <span className="font-weight-normal siteColor" >
                      {" "}
                      {EditData.Created != null
                        ? moment(EditData.Created).format("DD/MM/YYYY")
                        : ""}
                    </span>{" "}
                    by
                    <span className="font-weight-normal siteColor">
                      {EditData.Author?.Title != undefined
                        ? EditData.Author?.Title
                        : ""}
                    </span>
                  </div>
                  <div>
                    Last modified{" "}
                    <span className="font-weight-normal siteColor">
                      {EditData.Modified != null
                        ? moment(EditData.Modified).format("DD/MM/YYYY")
                        : ""}
                    </span>{" "}
                    by{" "}
                    <span className="font-weight-normal siteColor">
                      {EditData.Editor.Title != undefined
                        ? EditData.Editor.Title
                        : ""}
                    </span>
                  </div>
                  <div>
                    <a className="hreflink siteColor" onClick={() => deleteTask()}>
                      <span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span>
                      {" "}
                      <span> Delete this PX</span>
                    </a>
                    <span>
                      {" "}
                      {EditData.ID ? (
                        <VersionHistoryPopup
                          siteUrls={AllListId?.siteUrl}
                          taskId={EditData.ID}
                          listId={AllListId?.MasterTaskListID}
                        />
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="footer-right">
                    <span>
                      <a className="mx-2 siteColor"
                        target="_blank"
                        data-interception="off"
                        href={`${AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${EditData.Id}`}                     >
                        Go to Landing Page
                      </a>
                      ||

                      <a className="siteColor hreflink"
                        onClick={() => shareThisTaskFunction()}
                      >
                        {" "}
                        Share this PX ||
                      </a>
                    </span>
                    <a
                      data-interception="off"
                      className="p-1"
                      href={`${AllListId?.siteUrl}/Lists/Master%20Tasks/EditForm.aspx?ID=${EditData.Id}`}
                      target="_blank"
                    >
                      Open out-of-the-box form
                    </a>
                    <button
                      type="button"
                      className="btn btn-primary me-2
                      "
                      onClick={(e) => SaveData()}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-default btn-default mx-1"
                      onClick={setModalIsOpenToFalse}
                    >
                      Cancel
                    </button>


                  </div>
                </div>
              </div>
            </footer>

            {IsPortfolio && (
              <ServiceComponentPortfolioPopup
                props={projectTaggedPortfolios}
                Dynamic={AllListId}
                ComponentType={portfolioType}
                Call={ComponentServicePopupCallBack}
                selectionType={"Multi"}
              ></ServiceComponentPortfolioPopup>
            )}
            {IsComponentPicker && (
              <Picker
                props={TaskCat}
                AllListId={AllListId}
                Call={Call}
              ></Picker>
            )}
          </div>
          </>
          
        )}
      </Panel>
      {/* ***************** this is status panel *********** */}
      <Panel
        headerText={`Update Task Status`}
        isOpen={TaskStatusPopup}
        onDismiss={() => { setTaskStatusPopup(false) }}
        isBlocking={TaskStatusPopup}
      >
        <div>
          <div className="modal-body">
            <table className="table table-hover" style={{ marginBottom: "0rem !important" }}>
              <tbody>
                {StatusArray?.map((item: any, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="form-check l-radio">
                          <input className="form-check-input"
                            type="radio" checked={EditData.PercentComplete == item.value}
                            onClick={() => StatusAutoSuggestion(item.value)} />
                          <label className="form-check-label mx-2">{item.status}</label>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>
      </Panel>
    </>
  );
}
export default EditProjectPopup;