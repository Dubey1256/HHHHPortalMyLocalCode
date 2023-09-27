import * as React from "react";
import {
  FaAngleDown,
  FaAngleUp,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";
import { sp, Web } from "sp-pnp-js";
import * as $ from "jquery";
import { arraysEqual, Modal, Panel, PanelType } from "office-ui-fabric-react";
import * as Moment from "moment";
import { IFolderAddResult } from "@pnp/sp/folders";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import pnp, { PermissionKind } from "sp-pnp-js";
import { ColumnDef } from "@tanstack/react-table";
import { parseISO, format } from "date-fns";
import "@pnp/sp/lists";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import GlobalCommanTable from "../GroupByReactTableComponents/GlobalCommanTable";
import * as moment from "moment-timezone";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "../Tooltip";
import * as globalCommon from "../globalCommon";
import { truncate } from "@microsoft/sp-lodash-subset";
var AllTimeSpentDetails: any = [];
var CurntUserId = "";
var changeTime: any = 0;
var ParentId: any = "";
var Category: any = "";
var NewCategoryId: any = "";
var Eyd = "";
var changeEdited = "";
var CurrentUserTitle = "";
var CategoriesIdd = "";
var Categoryy = "";
var CategoryyID: any = "";
var timesheetMoveData: any = [];
var TaskCate: any = [];
var TimeSheetlistId = "";
var CategryTitle = "";
var siteUrl = "";
let Flatview: any = false;
var PortfolioType = "";
var listName = "";
var RelativeUrl: any = "";
var CurrentSiteUrl: any = "";
var AllTimeEntry: any = [];
var UserName: any = "";
var backupEdit: any = [];
var AllUsers: any = [];
var TimesheetConfiguration: any = [];
var isShowCate: any = "";
let expendedTrue: any = true;
var change: any = new Date();

const SP = spfi();

function TimeEntryPopup(item: any) {
  if (item?.props.siteUrl != undefined) {
    var Url = item?.props?.siteUrl.split("https://hhhhteams.sharepoint.com");
    RelativeUrl = Url[1];
    CurrentSiteUrl = item?.props?.siteUrl;
    PortfolioType = item.props.Portfolio_x0020_Type;
    CurntUserId = item.Context.pageContext._legacyPageContext.userId;
    CurrentUserTitle =
      item.Context.pageContext._legacyPageContext?.userDisplayName;
  } else {
    PortfolioType = item.props.Portfolio_x0020_Type;
    CurntUserId = item.Context.pageContext._legacyPageContext.userId;
    CurrentUserTitle =
      item.Context.pageContext._legacyPageContext?.userDisplayName;
    RelativeUrl = item.Context.pageContext.web.serverRelativeUrl;
    CurrentSiteUrl = item.Context.pageContext.web.absoluteUrl;
  }

  const [AllTimeSheetDataNew, setTimeSheet] = React.useState([]);
  const [date, setDate] = React.useState(undefined);
  const [showCat, setshowCat] = React.useState("");
  const [modalTimeIsOpen, setTimeModalIsOpen] = React.useState(false);
  // const [AllMetadata, setMetadata] = React.useState([]);
  const [EditTaskItemitle, setEditItem] = React.useState("");
  const [flatview, setFlatview] = React.useState<any>("");
  const [collapseItem, setcollapseItem] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch]: [string, (search: string) => void] =
    React.useState("");
  const [TaskStatuspopup, setTaskStatuspopup] = React.useState(false);
  const [Editcategory, setEditcategory] = React.useState(false);
  const [TaskStatuspopup2, setTaskStatuspopup2] = React.useState(false);
  const [CopyTaskpopup, setCopyTaskpopup] = React.useState(false);
  const [AddTaskTimepopup, setAddTaskTimepopup] = React.useState(false);
  const [TimeSheet, setTimeSheets] = React.useState([]);
  const [myDatee, setMyDatee] = React.useState<any>(new Date());
  const [backupData, setBackupData] = React.useState([]);
  const [count, setCount] = React.useState(1);
  const [month, setMonth] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [counts, setCounts] = React.useState(1);
  const [months, setMonths] = React.useState(1);
  const [saveEditTaskTime, setsaveEditTaskTime] = React.useState([]);
  const [demoState, setDemoState] = React.useState();
  const [postData, setPostData] = React.useState({
    Title: "",
    TaskDate: "",
    Description: "",
    TaskTime: ""
  });
  const [newData, setNewData] = React.useState({
    Title: "",
    TaskDate: "",
    Description: "",
    TimeSpentInMinute: "",
    TimeSpentInHours: "",
    TaskTime: ""
  });
  const [add, setAdd] = React.useState({
    Title: "",
    TaskDate: "",
    Description: "",
    TaskTime: ""
  });
  const [saveEditTaskTimeChild, setsaveEditTaskTimeChild] = React.useState([]);
  const [saveCopyTaskTimeChild, setsaveCopyTaskTimeChild] = React.useState([]);
  const [saveCopyTaskTime, setsaveCopyTaskTime] = React.useState([]);
  const [AllUser, setAllUser] = React.useState([]);
  const [checkCategories, setcheckCategories] = React.useState();
  const [updateData, setupdateData] = React.useState(0);
  const [updateData2, setupdateData2] = React.useState(0);
  const [editeddata, setediteddata] = React.useState<any>("");
  const [editTime, seteditTime] = React.useState("");
  const [year, setYear] = React.useState(1);
  const [years, setYears] = React.useState(1);
  const [TimeInHours, setTimeInHours] = React.useState(0);
  const [TimeInMinutes, setTimeInMinutes] = React.useState<any>(0);
  const [categoryData, setCategoryData] = React.useState([]);
  var smartTermName = "Task" + item.props.siteType;

  const GetTaskUsers = async () => {
    let web = new Web(`${CurrentSiteUrl}`);
    let taskUsers = [];
    taskUsers = await web.lists.getByTitle("Task Users").items.top(4999).get();
    AllUsers = taskUsers;
    // if(AllTimeEntry.length == 0){
    //     await getAllTime()
    // }

    EditData(item.props);
    //console.log(this.taskUsers);
  };
  const getAllTime = async () => {
    $.each(AllUsers, async function (index: any, taskUser: any) {
      if (taskUser.AssingedToUserId == CurntUserId) {
        UserName = taskUser.Title;
      }
    });
    var newItem: any = [];
    let web = new Web(`${CurrentSiteUrl}`);
    let taskUsers = [];
    taskUsers = await web.lists
      .getByTitle(listName)
      .items.filter(`Title eq '${UserName}'`)
      .getAll();
    AllTimeEntry = taskUsers;
  };
  // pnp.sp.web.currentUser.get().then(result => {
  //     CurntUserId = result.Id;
  //     console.log(CurntUserId)

  // });

  const changeDate = (val: any, Type: any) => {
    if (val === "Date") {
      setCount(count + 1);
      var dateeee = change != undefined && change != "" ? change : "";
      change = Moment(dateeee).add(1, "days").format();
      setMyDatee(change);
      var inputDate = new Date(change);
      setMyDatee(inputDate);

      if (Type == "EditTime") {
        changeEdited = Moment(editeddata).add(1, "days").format();
        var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy");
        var inputDate = new Date(editaskk);
        setediteddata(inputDate);
      }
    }
    if (val === "month") {
      setMonth(month + 1);
      change = Moment(change).add(1, "months").format();
      setMyDatee(change);
      //setMyDatee(change)
      var inputDate = new Date(change);
      setMyDatee(inputDate);

      if (Type == "EditTime") {
        changeEdited = Moment(editeddata).add(1, "months").format();
        var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy");
        //setediteddata(editaskk)
        var inputDate = new Date(editaskk);
        setediteddata(inputDate);
      }
    }

    if (val === "Year") {
      setYear(year + 1);
      change = Moment(change).add(1, "years").format();
      setMyDatee(change);
      var inputDate = new Date(change);
      setMyDatee(inputDate);
      // setMyDatee(change)

      if (Type == "EditTime") {
        changeEdited = Moment(editeddata).add(1, "years").format();
        var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy");
        // setediteddata(editaskk)
        var inputDate = new Date(editaskk);
        setediteddata(inputDate);
      }
    }
  };
  var showProgressBar = () => {
    $(" #SpfxProgressbar").show();
  };
  var showProgressHide = () => {
    $(" #SpfxProgressbar").hide();
  };
  const changeDateDec = (val: any, Type: any) => {
    if (val === "Date") {
      // setCount(count - 1)
      var dateeee = change != undefined && change != "" ? change : "";
      change = Moment(dateeee).add(-1, "days").format();
      setMyDatee(change);
      var inputDate = new Date(change);
      setMyDatee(inputDate);

      if (Type == "EditTime") {
        changeEdited = Moment(editeddata).add(-1, "days").format();
        var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy");
        var inputDate = new Date(editaskk);
        setediteddata(inputDate);
      }
    }
    if (val === "month") {
      // setMonth(month - 1)
      change = Moment(change).add(-1, "months").format();
      setMyDatee(change);
      var inputDate = new Date(change);
      setMyDatee(inputDate);

      if (Type == "EditTime") {
        changeEdited = Moment(editeddata).add(-1, "months").format();
        var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy");
        var inputDate = new Date(editaskk);
        setediteddata(inputDate);
      }
    }
    if (val === "year") {
      //setYear(year - 1)
      change = Moment(change).add(-1, "years").format();
      setMyDatee(change);
      var inputDate = new Date(change);
      setMyDatee(inputDate);

      if (Type == "EditTime") {
        changeEdited = Moment(editeddata).add(-1, "years").format();
        var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy");
        var inputDate = new Date(editaskk);
        setediteddata(inputDate);
      }
    }
  };
  var newTime: any = "";
  const changeTimesEdit = (val: any, time: any, type: any) => {
    changeTime = Number(changeTime);
    if (type === "EditTask" && val === "15") {
      if (TimeInMinutes != undefined) {
        time.TaskTimeInMin = Number(time.TaskTimeInMin);
        if (changeTime == 0) {
          changeTime = time.TaskTimeInMin + 15;
        } else {
          changeTime = changeTime + 15;
        }

        if (changeTime != undefined) {
          var TimeInHour: any = changeTime / 60;
          setTimeInHours(TimeInHour.toFixed(2));
        }
        setTimeInMinutes(changeTime);
      }
      if (TimeInMinutes == undefined) {
        changeTime = 0;
        if (changeTime == 0) {
          changeTime = changeTime + 15;
        } else {
          changeTime = changeTime + 15;
        }

        if (changeTime != undefined) {
          var TimeInHour: any = changeTime / 60;
          setTimeInHours(TimeInHour.toFixed(2));
        }
        setTimeInMinutes(changeTime);
      }
    }
    if (type === "EditTask" && val === "60") {
      changeTime = Number(changeTime);
      if (TimeInMinutes != undefined) {
        time.TaskTimeInMin = Number(time.TaskTimeInMin);
        if (changeTime == 0) {
          changeTime = time.TaskTimeInMin + 60;
        } else {
          changeTime = changeTime + 60;
        }

        if (changeTime != undefined) {
          var TimeInHour: any = changeTime / 60;
          setTimeInHours(TimeInHour.toFixed(2));
        }
        setTimeInMinutes(changeTime);
      }
      if (TimeInMinutes == undefined) {
        changeTime = 0;
        if (changeTime == 0) {
          changeTime = changeTime + 60;
        } else {
          changeTime = changeTime + 60;
        }

        if (changeTime != undefined) {
          var TimeInHour: any = changeTime / 60;
          setTimeInHours(TimeInHour.toFixed(2));
        }
        setTimeInMinutes(changeTime);
      }
    }
  };
  const changeTimesDecEdit = (val: any, time: any, type: any) => {
    if (type === "EditTask" && val === "15") {
      changeTime = Number(changeTime);
      if (changeTime == 0) {
        changeTime = time.TaskTimeInMin - 15;
      } else {
        changeTime = changeTime - 15;
      }

      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;
        setTimeInHours(TimeInHour.toFixed(2));
      }
      setTimeInMinutes(changeTime);
    }
    if (type === "EditTask" && val === "60") {
      changeTime = Number(changeTime);
      if (changeTime == 0) {
        changeTime = time.TaskTimeInMin - 60;
      } else {
        changeTime = changeTime - 60;
      }

      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;
        setTimeInHours(TimeInHour.toFixed(2));
      }
      setTimeInMinutes(changeTime);
    }
  };

  const changeTimes = (val: any, time: any, type: any) => {
    if (val === "15") {
      changeTime = Number(changeTime);

      changeTime = changeTime + 15;
      // changeTime = changeTime > 0

      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;

        setTimeInHours(TimeInHour.toFixed(2));
      }

      setTimeInMinutes(changeTime);
    }
    // if(type==='EditTask' && val === '15'){
    //     if(newTime == '' && newTime == undefined){
    //      newTime = time.TaskTimeInMin + 0.15
    //      setTimeInMinutes(newTime)
    //     }
    //     else{
    //         newTime = newTime + 0.15
    //      setTimeInMinutes(newTime)
    //     }

    // }

    if (val === "60") {
      changeTime = Number(changeTime);
      changeTime = changeTime + 60;
      // changeTime = changeTime > 0

      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;

        setTimeInHours(TimeInHour.toFixed(2));
      }

      setTimeInMinutes(changeTime);
    }
    // if(newTime == '' && newTime == undefined){
    //     newTime = time.TaskTimeInMin + 1.00
    //     setTimeInMinutes(newTime)
    //    }
    //    else{
    //        newTime = newTime + 1.00
    //     setTimeInMinutes(newTime)
    //    }
  };
  const openTaskStatusUpdatePoup = async () => {
    AllUsers.forEach((val: any) => {
      TimeSheet.forEach((time: any) => {
        if (val.AssingedToUserId == CurntUserId) {
          isShowCate = val.TimeCategory;
          if (val.TimeCategory == time.Title) {
            setshowCat(time.Title);
            setcheckCategories(time.Title);
          }
        }
      });
    });
    setTaskStatuspopup(true);
    await getAllTime();
  };
  const Editcategorypopup = (child: any) => {
    var array: any = [];
    Categoryy = child.Category.Title;
    CategoryyID = child.ID;
    CategoriesIdd = child.Category.Id;
    array.push(child);
    setCategoryData(array);
    setEditcategory(true);
  };

  const closeEditcategorypopup = (child: any) => {
    setNewData(undefined);
    setcheckCategories(undefined);
    setEditcategory(false);
  };

  const openCopyTaskpopup = (childitem: any) => {
    setPostData(undefined);
    setCopyTaskpopup(true);
    var dateValue = childitem.TaskDates.substring(4);
    var b = dateValue.trim();
    var dateValues = b.split("/");
    dp = dateValues[1] + "/" + dateValues[0] + "/" + dateValues[2];
    Dateet = new Date(dp);
    Eyd = Moment(Dateet).format("ddd, DD MMM yyyy");
    var inputDate: any = new Date(Eyd);
    setediteddata(inputDate);
    var Array: any = [];
    var Childitem: any = [];
    Array.push(childitem);
    Childitem.push(childitem);
    setsaveCopyTaskTime(Array);
    setsaveCopyTaskTimeChild(Childitem);
    console.log(item);
  };

  const openAddTasktimepopup = (val: any) => {
    setAddTaskTimepopup(true);
    setTimeInMinutes(0);
    setTimeInHours(0);
    setNewData(undefined);
    setediteddata(undefined);
    setCount(1);
    change = Moment().format();
    setMonth(1);
    setYear(1);
    changeTime = 0;
    setMyDatee(new Date());
    //setMyDatee(undefined)
    setPostData(undefined);
    ParentId = val;

    var CategoryTitle = val.Title;
  };
  let dateValue = "";
  var dp = "";
  var Dateet: any = "";
  const openTaskStatusUpdatePoup2 = (childitem: any, childinew: any) => {
    CategryTitle = "";
    setTaskStatuspopup(false);
    setediteddata(undefined);
    setNewData(undefined);
    setTimeInHours(0);
    setMyDatee(undefined);
    change = Moment().format();
    setTimeInMinutes(0);
    setCount(1);
    setMonth(1);
    setYear(1);
    changeTime = 0;
    setMyDatee(new Date());
    setediteddata(undefined);

    var dateValue = childinew.TaskDates.substring(4);
    var b = dateValue.trim();
    var dateValuess = b.split("/");
    var dp = dateValuess[1] + "/" + dateValuess[0] + "/" + dateValuess[2];
    Dateet = new Date(dp);
    Eyd = Moment(Dateet).format("ddd, DD MMM yyyy");
    var inputDate: any = new Date(Eyd);
    setediteddata(inputDate);
    //setediteddata(Eyd)
    var Array: any = [];
    var Childitem: any = [];
    setTaskStatuspopup2(true);
    // Array.push(childitem)
    setNewData(undefined);
    Childitem.push(childinew);
    backupEdit?.forEach((val: any) => {
      if (val.Id == childinew.MainParentId) {
        CategryTitle = val.Category.Title;
      }
    });
    // setsaveEditTaskTime(Array)
    setsaveEditTaskTimeChild(Childitem);
    console.log(item);
  };
  const closeTaskStatusUpdatePoup = () => {
    setTaskStatuspopup(false);
    setcheckCategories(undefined);
    setTimeInHours(0);
    setNewData(undefined);
    setTimeInMinutes(0);
    setMyDatee(undefined);
    setediteddata(undefined);
    changeTime = 0;
    setCount(1);
    change = Moment().format();
    setMonth(1);
    setYear(1);
    setMyDatee(new Date());
  };
  const closeCopyTaskpopup = () => {
    setCopyTaskpopup(false);
    setTimeInMinutes(0);
    setTimeInHours(0);
    setediteddata(undefined);
    setNewData(undefined);
    setCount(1);
    change = Moment().format();
    setMonth(1);
    setYear(1);
    changeTime = 0;
    //setMyDatee(undefined)
    setMyDatee(new Date());
    setPostData(undefined);
  };
  const closeAddTaskTimepopup = () => {
    setAddTaskTimepopup(false);
  };
  const closeTaskStatusUpdatePoup2 = () => {
    setTaskStatuspopup2(false);
  };
  const changeTimesDec = (items: any) => {
    if (items === "15") {
      changeTime = Number(changeTime);
      changeTime = changeTime - 15;

      if (changeTime < 0) {
        changeTime = 0;
      }
      setTimeInMinutes(changeTime);
      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;

        setTimeInHours(TimeInHour.toFixed(2));
      }
    }
    if (items === "60") {
      changeTime = Number(changeTime);
      changeTime = changeTime - 60;

      if (changeTime < 0) {
        changeTime = 0;
      }
      if (changeTime != undefined) {
        var TimeInHour: any = changeTime / 60;

        setTimeInHours(TimeInHour.toFixed(2));
      }
      // if(type=='EditTask'){
      //     var changeTimeEdi = time - 1
      //     setTimeInHours(changeTimeEdi)

      //  }
      setTimeInMinutes(changeTime);
    }
  };

  const GetTimeSheet = async () => {
    var TimeSheet: any = [];
    var newArray: any = [];
    const web = new Web(`${CurrentSiteUrl}`);

    const res = await web.lists
      .getByTitle("SmartMetadata")
      .items.select("Id,Title,TaxType,Parent/Id,Parent/Title")
      .expand("Parent")
      .top(4999)
      .get();
    console.log(res);
    res.map((item: any) => {
      if (item.TaxType === "TimesheetCategories") {
        TimeSheet.push(item);
      }
    });
    TimeSheet.forEach((val: any) => {
      if (
        (val.Title == "Design" ||
          val.Title == "Design" ||
          val.Title == "Development" ||
          val.Title == "Investigation" ||
          val.Title == "QA" ||
          val.Title == "Support" ||
          val.Title == "Verification" ||
          val.Title == "Coordination" ||
          val.Title == "Implementation" ||
          val.Title == "Conception" ||
          val.Title == "Preparation") &&
        val.Parent?.Title == "Components"
      ) {
        newArray.push(val);
      }

      setTimeSheets(newArray);
    });
  };
  const selectCategories = (e: any, Title: any) => {
    const target = e.target;
    if (target.checked) {
      setcheckCategories(Title);
      setshowCat(Title);
    }
  };
  React.useEffect(() => {
    GetTimeSheet();
    GetSmartMetadata();
  }, [updateData, updateData2]);

  // React.useEffect(() => {
  //     changeDate((e: any) => e);

  // }, [myDatee,TaskCate])

  var AllMetadata: [] = [];
  const GetSmartMetadata = async () => {
    let web = new Web(`${CurrentSiteUrl}`);
    let MetaData = [];
    MetaData = await web.lists
      .getByTitle("SmartMetadata")
      .items.top(4999)
      .get();
    AllMetadata = MetaData;
    AllMetadata.forEach((itemss: any) => {
      if (
        itemss?.Title?.toLowerCase() == item?.props?.siteType?.toLowerCase() &&
        itemss.TaxType == "Sites"
      ) {
        TimesheetConfiguration = JSON.parse(itemss.Configurations);
      }
    });
    TimesheetConfiguration?.forEach((val: any) => {
      TimeSheetlistId = val.TimesheetListId;
      siteUrl = val.siteUrl;
      listName = val.TimesheetListName;

      // else {
      //     MigrationListId = val.TimesheetListId;
      //     siteUrl = val.siteUrl
      //     listName = val.TimesheetListName
      // }
    });
    await GetTaskUsers();
  };

  var TaskTimeSheetCategoriesGrouping: any = [];
  var TaskTimeSheetCategories: any = [];

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
  const checkCategory = function (item: any, category: any) {
    $.each(
      TaskTimeSheetCategoriesGrouping,
      function (index: any, categoryTitle: any) {
        if (categoryTitle.Id === category) {
          // item.isShow = true;
          if (categoryTitle.subRows.length === 0) {
            categoryTitle.subRows = [];
          }
          if (!isItemExists(categoryTitle.subRows, item.Id)) {
            item.show = false;
            categoryTitle.subRows.push(item);
          }
        }
      }
    );
  };

  const getStructureData = function () {
    TaskCate = AllTimeSpentDetails;

    AllTimeSpentDetails.forEach((items: any) => {
      if (items.TimesheetTitle.Id === undefined) {
        items.Expanded = true;
        items.isAvailableToDelete = false;
        AllTimeSpentDetails.forEach((val: any) => {
          if (
            val.TimesheetTitle.Id != undefined &&
            val.TimesheetTitle.Id === items.Id
          ) {
            val.isShifted = true;
            val.show = false;
            val.subRows.forEach((value: any) => {
              value.ParentID = val.Id;
              value.siteListName = val.__metadata.type;
              value.MainParentId = items.Id;
              value.AuthorTitle = val.Author.Title;
              value.EditorTitle = val.Editor.Title;
              //value.AuthorImage = val.AuthorImage
              value.show = true;
              // value.TaskDate = true;
              if (val.Created != undefined) var date = new Date(val.Created);
              value.Created = Moment(date).format("DD/MM/YYYY");
              if (val.Modified != undefined)
                value.Modified = Moment(val.Modified).format("DD/MM/YYYY");

              if (!isItemExists(items.AdditionalTime, value.ID))
                items.AdditionalTime.push(value);
            });
            // $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
            //     if (items.Id == NewCategoryId) {
            //         items.subRows.push(val);
            //     }
            // });
            //  setAdditionalTime(item.AdditionalTime)
          }
        });
      }
    });
    AllTimeSpentDetails?.forEach((val: any) => {
      if (val.TimesheetTitle.Id == undefined) {
        val.subRows = [];
        AllTimeSpentDetails?.forEach((itemss: any) => {
          if (itemss.TimesheetTitle.Id == val.Id) {
            if (itemss.subRows != undefined) {
              itemss.subRows.forEach((item: any) => {
                val.subRows.push(item);
              });
            }
          }
        });
      }
    });

    AllTimeSpentDetails = $.grep(AllTimeSpentDetails, function (type: any) {
      return type.isShifted === false;
    });

    $.each(AllTimeSpentDetails, function (index: any, items: any) {
      items.show = false;
      items.AuthorName = "";
      items.TaskTime = "";
      items.TaskDate = "";
      items.Description = "";
      if (items.subRows.length === 0) {
        items.isAvailableToDelete = true;
      }
      if (items.subRows != undefined && items.subRows.length > 0) {
        $.each(items.subRows, function (index: any, type: any) {
          type.show = true;
          if (type.Id != undefined) type.Id = type.ID;
        });
      }
    });
    $.each(AllTimeSpentDetails, function (index: any, items: any) {
      if (items.subRows.length > 0) {
        items.subRows = items.subRows.reverse();
        $.each(items.subRows, function (index: any, val: any) {
          if (val.TaskDate != null) {
            var dateValues = val?.TaskDate?.split("/");
            var dp = dateValues[1] + "/" + dateValues[0] + "/" + dateValues[2];
            var NewDate = new Date(dp);
            val.TaskDates = Moment(NewDate).format("ddd, DD/MM/YYYY");
            try {
              getDateForTimeEntry(NewDate, val);
            } catch (e) { }
          }
        });
      }
    });

    $.each(AllTimeSpentDetails, function (index: any, items: any) {
      if (items.Category.Title === undefined) checkCategory(items, 319);
      else checkCategory(items, items.Category.Id);
    });
    var IsTimeSheetAvailable = false;
    $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
      if (items.subRows.length > 0) {
        IsTimeSheetAvailable = true;
      }
    });

    var newArray = [];
    let finalData: any = [];
    $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
      if (items.subRows != undefined && items.subRows.length > 0) {
        $.each(items.subRows, function (index: any, child: any) {
          finalData.push(child);
          if (child.TimesheetTitle.Id == undefined) {
            newArray = child.subRows.sort(datecomp);
            console.log(newArray);
            //child.AdditionalTime = child.AdditionalTime.reverse()
          }
        });
      }
    });
    console.log(TaskTimeSheetCategoriesGrouping);
    //item?.parentCallback(timesheetMoveData);
    backupEdit = finalData;
    setData(finalData);
    setBackupData(finalData);
    setTimeSheet(TaskTimeSheetCategoriesGrouping);
    // var mainArray: any = []
    // var sortedCars: any = []
    // TaskTimeSheetCategoriesGrouping.forEach((temp: any) => {

    //     if (temp.subRows != undefined && temp.subRows.length > 0) {
    //         $.each(temp.subRows, function (index: any, child: any) {
    //             child.AdditionalTimes = []
    //             if (child.AdditionalTime != undefined && child.AdditionalTime.length > 0) {
    //                 $.each(child.AdditionalTime, function (index: any, ch: any) {
    //                     mainArray.push(ch)
    //                 })
    //                 sortedCars = mainArray.sort(datecomp);

    //             }

    //         })

    //     }

    // })
    // const finalData = sortedCars.filter((val: any, id: any, array: any) => {
    //     return array.indexOf(val) == id;
    // })
    // TaskTimeSheetCategoriesGrouping.forEach((temp: any) => {

    //     if (temp.subRows != undefined && temp.subRows.length > 0) {

    //         $.each(temp.subRows, function (index: any, child: any) {
    //             child.AdditionalTime = []
    //             $.each(finalData, function (index: any, ch: any) {
    //                 if (child.Id == ch.MainParentId) {
    //                     child.AdditionalTimes.push(ch)
    //                 }
    //             })

    //         })

    //     }

    // })
    // TaskTimeSheetCategoriesGrouping.forEach((temp: any) => {

    //     if (temp.subRows != undefined && temp.subRows.length > 0) {

    //         $.each(temp.subRows, function (index: any, child: any) {
    //             $.each(child.AdditionalTimes, function (index: any, ch: any) {

    //                 child.AdditionalTime.push(ch)

    //             })

    //         })

    //     }

    // })
    // console.log(finalData)
    // console.log(mainArray)
    // setTimeSheet(TaskTimeSheetCategoriesGrouping);

    if (TaskStatuspopup == true) {
      setupdateData(updateData + 1);
      showProgressHide();
    }

    setModalIsTimeOpenToTrue();
  };

  const setModalIsTimeOpenToTrue = () => {
    setTimeModalIsOpen(true);
  };
  function TimeCallBack(callBack: any) {
    item.CallBackTimeEntry();
  }
  function datecomp(d1: any, d2: any) {
    if (d1.TaskDate != null && d2.TaskDate != null) {
      var a1 = d1.TaskDate.split("/");
      var a2 = d2.TaskDate.split("/");
      a1 = a1[2] + a1[1] + a1[0];
      a2 = a2[2] + a2[1] + a2[0];
      // a1 = a1[1] + a1[0] + a1[2];
      //a2 = a2[1] + a2[0] + a2[2];
      //var a1:any= new Date(d1.TaskDate)
      //var a2:any= new Date(d2.TaskDate)
      //var b1:any = Moment(a1).format()
      //var b2:any = Moment(a1).format()
      return a2 - a1;
    }
  }

  const callBackData = React.useCallback((elem: any, ShowingData: any) => { },
    []);
  function getDateForTimeEntry(newDate: any, items: any) {
    var LatestDate = [];
    var getMonth = "";
    var combinedDate = "";
    LatestDate = newDate.split("/");
    switch (LatestDate[1]) {
      case "01":
        getMonth = "January ";
        break;
      case "02":
        getMonth = "Febuary ";
        break;
      case "03":
        getMonth = "March ";
        break;
      case "04":
        getMonth = "April ";
        break;
      case "05":
        getMonth = "May ";
        break;
      case "06":
        getMonth = "June ";
        break;
      case "07":
        getMonth = "July ";
        break;
      case "08":
        getMonth = "August ";
        break;
      case "09":
        getMonth = "September";
        break;
      case "10":
        getMonth = "October ";
        break;
      case "11":
        getMonth = "November ";
        break;
      case "12":
        getMonth = "December ";
        break;
    }
    combinedDate = LatestDate[0] + " " + getMonth + " " + LatestDate[2];
    var dateE = new Date(combinedDate);
    items.NewestCreated = dateE.setDate(dateE.getDate());
  }
  const getStructurefTimesheetCategories = function () {
    $.each(TaskTimeSheetCategories, function (index: any, item: any) {
      $.each(TaskTimeSheetCategories, function (index: any, val: any) {
        if (item.ParentID === 0 && item.Id === val.ParentID) {
          val.ParentType = item.Title;
        }
      });
    });
    $.each(TaskTimeSheetCategoriesGrouping, function (index: any, item: any) {
      $.each(TaskTimeSheetCategoriesGrouping, function (index: any, val: any) {
        if (item.ParentID === 0 && item.Id === val.ParentID) {
          val.ParentType = item.Title;
        }
      });
    });
  };
  var getSmartMetadataItemsByTaxType = function (
    metadataItems: any,
    taxType: any
  ) {
    var Items: any = [];
    $.each(metadataItems, function (index: any, taxItem: any) {
      if (taxItem.TaxType === taxType) Items.push(taxItem);
    });
    return Items;
  };

  const EditData = async (items: any) => {
    AllTimeSpentDetails = [];

    TaskTimeSheetCategories = getSmartMetadataItemsByTaxType(
      AllMetadata,
      "TimesheetCategories"
    );
    TaskTimeSheetCategoriesGrouping = TaskTimeSheetCategoriesGrouping.concat(
      TaskTimeSheetCategories
    );
    TaskTimeSheetCategoriesGrouping.push({
      __metadata: {
        id: "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)",
        uri: "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)",
        etag: '"1"',
        type: "SP.Data.SmartMetadataListItem"
      },
      Id: 319,
      Title: "Others",
      siteName: null,
      siteUrl: null,
      listId: null,
      Description1: null,
      IsVisible: true,
      Item_x005F_x0020_Cover: null,
      SmartFilters: null,
      SortOrder: null,
      TaxType: "TimesheetCategories",
      Selectable: true,
      ParentID: "ParentID",
      SmartSuggestions: false,
      ID: 319
    });

    $.each(
      TaskTimeSheetCategoriesGrouping,
      function (index: any, categoryTitle: any) {
        categoryTitle.subRows = [];
        categoryTitle.Expanded = true;
        categoryTitle.flag = true;
        // categoryTitle.AdditionalTime = [];
        categoryTitle.isAlreadyExist = false;
        categoryTitle.AdditionalTimeEntry = undefined;
        categoryTitle.Author = {};
        categoryTitle.AuthorId = 0;
        categoryTitle.Category = {};
        categoryTitle.Created = undefined;
        categoryTitle.Editor = {};
        categoryTitle.Modified = undefined;
        categoryTitle.TaskDate = undefined;
        categoryTitle.TaskTime = undefined;
        categoryTitle.TimesheetTitle = [];
      }
    );

    getStructurefTimesheetCategories();
    setEditItem(items.Title);

    if (items.siteType == "Offshore Tasks") {
      var siteType = "OffshoreTasks";
      var filteres = "Task" + siteType + "/Id eq " + items.Id;
      var linkedSite = "Task" + siteType;
    } else {
      let siteTypes = items.siteType[0].toUpperCase() + items.siteType.slice(1);

      var filteres = "Task" + siteTypes + "/Id eq " + items.Id;
      var linkedSite = "Task" + siteTypes;
    }
    var select = `Id,Title,TaskDate,Created,Modified,TaskTime,${linkedSite}/Title,${linkedSite}/Id,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle,${linkedSite}&$filter= ${filteres}`;
    var count = 0;

    if (items.siteType == "Migration" || items.siteType == "ALAKDigital") {
      //var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('9ed5c649-3b4e-42db-a186-778ba43c5c93')/items?$select=" + select + "" }]
      var allurls = [
        {
          Url: `${CurrentSiteUrl}/_api/web/lists/getById('${TimeSheetlistId}')/items?$select=${select}`
        }
      ];
    } else {
      //var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },
      var allurls = [
        {
          Url: `${CurrentSiteUrl}/_api/web/lists/getById('${TimeSheetlistId}')/items?$select=${select}`
        }
      ];
    }
    $.each(allurls, async function (index: any, item: any) {
      await $.ajax({
        url: item.Url,

        method: "GET",

        headers: {
          Accept: "application/json; odata=verbose"
        },

        success: function (data: { d: { results: string | any[] } }) {
          count++;
          if (data.d.results != undefined && data.d.results.length > 0) {
            AllTimeSpentDetails = AllTimeSpentDetails.concat(data.d.results);
          }

          if (allurls.length === count) {
            let TotalPercentage = 0;
            let TotalHours = 0;
            let totletimeparentcount = 0;
            //  let totletimeparentcount = 0;
            let AllAvailableTitle = [];
            AllTimeSpentDetails.forEach((items: any) => {
              timesheetMoveData.push(items);
            });
            $.each(AllTimeSpentDetails, async function (index: any, item: any) {
              item.IsVisible = false;
              item.Item_x005F_x0020_Cover = undefined;
              item.Parent = {};
              item.subRows = [];
              item.ParentID = 0;
              item.ParentId = 0;
              item.ParentType = undefined;
              item.Selectable = undefined;
              item.SmartFilters = undefined;
              item.SmartSuggestions = undefined;
              item.isAlreadyExist = false;
              item.listId = null;
              item.siteName = null;
              item.siteUrl = null;
              if (NewParentId == item.Id) {
                var UpdatedData: any = {};
                AllUsers.forEach((taskUser: any) => {
                  if (taskUser.AssingedToUserId == CurntUserId) {
                    UpdatedData["AuthorName"] = taskUser.Title;
                    UpdatedData["Company"] = taskUser.Company;
                    UpdatedData["AuthorImage"] =
                      taskUser.Item_x0020_Cover != undefined &&
                        taskUser.Item_x0020_Cover.Url != undefined
                        ? taskUser.Item_x0020_Cover.Url
                        : "";
                  }
                });
                var Datee: any = new Date(myDatee);
                if (Datee == "Invalid Date") {
                  Datee = Moment().format();
                }
                var TimeInH: any = TimeInMinutes / 60;
                TimeInH = TimeInH.toFixed(2);
                item.TimesheetTitle.Title = NewParentTitle;
                item.TimesheetTitle.Id = mainParentId;
                item.AdditionalTime = [];
                var update: any = {};
                update["AuthorName"] = UpdatedData.AuthorName;
                update["AuthorId"] = CurntUserId;
                update["AuthorImage"] = UpdatedData.AuthorImage;
                update["ID"] = 0;
                update["MainParentId"] = mainParentId;
                update["ParentID"] = NewParentId;
                update["TaskTime"] = TimeInH;
                update["TaskTimeInMin"] = TimeInMinutes;
                update["TaskDate"] = Moment(Datee).format("DD/MM/YYYY");
                update["Description"] = newData.Description;
                item.AdditionalTime.push(update);
                let web = new Web(`${CurrentSiteUrl}`);

                if (
                  items.siteType == "Migration" ||
                  items.siteType == "ALAKDigital"
                ) {
                  var ListId = TimeSheetlistId;
                } else {
                  var ListId = TimeSheetlistId;
                }

                await web.lists
                  .getById(ListId)
                  .items.getById(NewParentId)
                  .update({
                    AdditionalTimeEntry: JSON.stringify(item.AdditionalTime),
                    TimesheetTitleId: mainParentId
                  })
                  .then((res: any) => {
                    console.log(res);
                  });
              }

              if (item.TimesheetTitle.Id != undefined) {
                if (
                  item.AdditionalTimeEntry != undefined &&
                  item.AdditionalTimeEntry != ""
                ) {
                  try {
                    item.AdditionalTime = JSON.parse(item.AdditionalTimeEntry);
                    item.subRows = JSON.parse(item.AdditionalTimeEntry);
                    if (item.subRows.length > 0) {
                      $.each(
                        item.subRows,
                        function (index: any, additionalTime: any) {
                          var time = parseFloat(additionalTime.TaskTime);
                          if (!isNaN(time)) {
                            totletimeparentcount += time;
                            // $scope.totletimeparentcount += time;;
                          }
                        }
                      );
                    }
                  } catch (e) {
                    console.log(e);
                  }
                }
                setAllUser(AllUsers);

                $.each(AllUsers, function (index: any, taskUser: any) {
                  if (taskUser.AssingedToUserId === item.AuthorId) {
                    item.AuthorName = taskUser.Title;
                    item.AuthorImage =
                      taskUser.Item_x0020_Cover != undefined &&
                        taskUser.Item_x0020_Cover.Url != undefined
                        ? taskUser.Item_x0020_Cover.Url
                        : "";
                  }
                });
                if (item.TaskTime != undefined) {
                  var TimeInHours = item.TaskTime / 60;
                  // item.IntegerTaskTime = item.TaskTime / 60;
                  item.TaskTime = TimeInHours;
                }
              } else {
                AllAvailableTitle.push(item);
              }

              if (item.AdditionalTime === undefined) {
                item.AdditionalTime = [];
              }
              // item.ServerTaskDate = angular.copy(item.TaskDate);
              // item.TaskDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.TaskDate, 'DD/MM/YYYY');
              item.isShifted = false;
            });

            getStructureData();
          }
        }
      });
    });
    // setAllTimeSpentDetails(AllTimeSpentDetails)
  };
  // error: function (error) {
  //     count++;
  //     if (allurls.length === count)
  //         getStructureData();
  // }

  const setModalTimmeIsOpenToFalse = () => {
    TimeCallBack(false);
    setTimeModalIsOpen(false);
  };
  const openexpendTime = () => {
    setcollapseItem(true);
  };
  const collapseTime = () => {
    setcollapseItem(false);
  };
  let handleChange = (e: { target: { value: string } }, titleName: any) => {
    if (titleName == "Date" || titleName == "Time") {
      setSearch(e.target.value);
    } else {
      setSearch(e.target.value.toLowerCase());
      var Title = titleName;
    }
  };
  const handleTimeOpen = (item: any) => {
    item.show = item.show = item.show === true ? false : true;
    setTimeSheet((TaskTimeSheetCategoriesGrouping) => [
      ...TaskTimeSheetCategoriesGrouping
    ]);
    // setData(data => ([...data]));
  };
  const sortBy = (Type: any) => {
    var copy: any = [];
    AllTimeSpentDetails?.forEach((val: any) => {
      val?.AdditionalTime.forEach((item: any) => {
        copy.push(item);
      });
    });

    copy.sort((a: any, b: any) => (a.Type > b.Type ? 1 : -1));
    AllTimeSpentDetails?.forEach((val: any) => {
      val.AdditionalTime = [];
      copy.forEach((item: any) => {
        val.AdditionalTime.push(item);
      });
    });

    setTimeSheet((TaskTimeSheetCategoriesGrouping) => [
      ...TaskTimeSheetCategoriesGrouping
    ]);
  };
  const sortByDng = (Type: any) => {
    var copy: any = [];
    AllTimeSpentDetails?.forEach((val: any) => {
      val?.AdditionalTime.forEach((item: any) => {
        copy.push(item);
      });
    });

    copy.sort((a: any, b: any) => (a.Type < b.Type ? 1 : -1));
    AllTimeSpentDetails?.forEach((val: any) => {
      val.AdditionalTime = [];
      copy.forEach((item: any) => {
        val.AdditionalTime.push(item);
      });
    });

    setTimeSheet((TaskTimeSheetCategoriesGrouping) => [
      ...TaskTimeSheetCategoriesGrouping
    ]);
  };

  // const deleteTaskTime = async (childinew: any) => {
  //     var UpdatedData: any = []
  //     var deleteConfirmation = confirm("Are you sure, you want to delete this?")
  //     if (deleteConfirmation) {

  //         $.each(TaskCate, function (index: any, subItem: any) {
  //             if (subItem.Id == childinew.ParentID) {
  //                 if (subItem.AdditionalTime.length > 0 && subItem.AdditionalTime != undefined) {
  //                     $.each(subItem.AdditionalTime, async function (index: any, NewsubItem: any) {
  //                         if (NewsubItem.ParentID == childinew.ParentID) {
  //                             if (NewsubItem.ID === childinew.ID)
  //                                 subItem.AdditionalTime.splice(index, 1)

  //                         }

  //                     })
  //                     UpdatedData = subItem.AdditionalTime

  //                 }
  //             }

  //         })

  //         if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {

  //             var ListId = '9ed5c649-3b4e-42db-a186-778ba43c5c93'

  //         }
  //         else {
  //             var ListId = '464fb776-e4b3-404c-8261-7d3c50ff343f'
  //         }
  //         let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

  //         await web.lists.getById(ListId).items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar").getById(childinew.ParentID).update({

  //             AdditionalTimeEntry: JSON.stringify(UpdatedData),

  //         }).then((res: any) => {

  //             console.log(res);

  //         })
  //         setupdateData(updateData + 5)
  //     }
  //     else {
  //         console.log("Select Item")
  //     }

  // }

  const deleteTaskTime = async (childinew: any) => {
    var UpdatedData: any = [];
    var deleteConfirmation = confirm("Are you sure, you want to delete this?");
    if (deleteConfirmation) {
      $.each(TaskCate, function (index: any, subItem: any) {
        if (subItem.Id == childinew.ParentID) {
          if (
            subItem.AdditionalTime.length > 0 &&
            subItem.AdditionalTime != undefined
          ) {
            $.each(
              subItem.AdditionalTime,
              async function (index: any, NewsubItem: any) {
                if (NewsubItem?.ID === childinew?.ID)
                  subItem.AdditionalTime.splice(index, 1);
              }
            );
            UpdatedData = subItem.AdditionalTime;
          }
        }
      });

      if (
        item.props.siteType == "Migration" ||
        item.props.siteType == "ALAKDigital"
      ) {
        var ListId = TimeSheetlistId;
      } else {
        var ListId = TimeSheetlistId;
      }
      let web = new Web(`${CurrentSiteUrl}`);

      await web.lists
        .getById(ListId)
        .items.getById(childinew.ParentID)
        .update({
          AdditionalTimeEntry: JSON.stringify(UpdatedData)
        })
        .then((res: any) => {
          console.log(res);
          setupdateData(updateData + 1);
        });
    }
  };

  var isTimes = false;
  const UpdateAdditionaltime = async (child: any) => {
    var Dateee = "";

    if (editeddata != undefined) {
      var a = Moment(editeddata).format();
      Dateee = Moment(a).format("DD/MM/YYYY");
    } else {
      Dateee = Moment(changeEdited).format("DD/MM/YYYY");
    }

    var DateFormate = new Date(Eyd);
    var UpdatedData: any = [];
    $.each(TaskCate, function (index: any, update: any) {
      if (update.Id === child.ParentID && update.AuthorId == CurntUserId) {
        $.each(update.AdditionalTime, function (index: any, updateitem: any) {
          isTimes = true;

          if (updateitem.ID === child.ID) {
            updateitem.Id = child.ID;
            updateitem.TaskTime =
              TimeInHours != undefined && TimeInHours != 0
                ? TimeInHours
                : child.TaskTime;
            updateitem.TaskTimeInMin =
              TimeInMinutes != undefined && TimeInMinutes != 0
                ? TimeInMinutes
                : child.TaskTimeInMin;
            updateitem.TaskDate =
              Dateee != "Invalid date"
                ? Dateee
                : Moment(DateFormate).format("DD/MM/YYYY");

            updateitem.Description =
              postData != undefined &&
                postData.Description != undefined &&
                postData.Description != ""
                ? postData.Description
                : child.Description;
            UpdatedData.push(updateitem);
          } else {
            UpdatedData.push(updateitem);
          }
        });
      }
    });
    UpdatedData?.forEach((val: any) => {
      delete val.TaskDates;
    });
    setTaskStatuspopup2(false);
    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var ListId = TimeSheetlistId;
    } else {
      var ListId = TimeSheetlistId;
    }
    let web = new Web(`${siteUrl}`);
    if (isTimes == true) {
      await web.lists
        .getById(ListId)
        .items.getById(child.ParentID)
        .update({
          AdditionalTimeEntry: JSON.stringify(UpdatedData)
        })
        .then((res: any) => {
          console.log(res);

          closeTaskStatusUpdatePoup2();
          setupdateData(updateData + 1);
        });
    }
  };
  var NewParentId: any = "";
  var NewParentTitle: any = "";
  var smartTermId = "";
  var mainParentId: any = "";
  var mainParentTitle: any = "";
  var LetestFolderID: any = "";
  function getItemTypeForListName(name: any) {
    return (
      "SP.Data." +
      name.charAt(0).toUpperCase() +
      name.split(" ").join("").slice(1) +
      "ListItem"
    );
  }
  const GetOrCreateFolder = async (
    folderName: any,
    UpdatedData: any,
    SiteUrl: any,
    ListId: any
  ) => {
    const list = sp.web.lists.getByTitle(ListId);
    const folderNames = `${UpdatedData.Company}/${folderName}`;
    await list.items
      .add({
        FileSystemObjectType: 1,
        ContentTypeId: "0x0120"
      })
      .then(async (res) => {
        const lists = sp.web.lists.getByTitle(ListId);
        await lists.items
          .getById(res.data.Id)
          .update({
            Title: folderName,
            FileLeafRef: folderNames
          })
          .then((res) => {
            console.log(res);
          });
      });
    var TimeInHours: any = changeTime / 60;
    TimeInHours = TimeInHours.toFixed(2);

    if (AllTimeSpentDetails == undefined) {
      var AllTimeSpentDetails: any = [];
    }

    TimeSheet.map((items: any) => {
      if (items.Title == checkCategories) {
        Category = items.Id;
      }
    });

    let web = new Web(`${CurrentSiteUrl}`);

    //-------------Post Method------------------------------------------------------------

    //let folderUri: string = '/Smalsus'

    let folderUri: string = `/${UpdatedData.Company}`;
    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var listNames = listName;
      var listUri: string = `${RelativeUrl}/Lists/${listNames}`;
    } else {
      var listNames = listName;
      var listUri: string = `${RelativeUrl}/Lists/${listNames}`;
    }
    let itemMetadataAdded = {
      Title:
        newData != undefined &&
          newData.Title != undefined &&
          newData.Title != ""
          ? newData.Title
          : checkCategories,
      [smartTermId]: item.props.Id,
      CategoryId: Category
      // 'Path': `${RelativeUrl}/Lists/${listName}/${UpdatedData.Company}`
    };

    let newdata = await web.lists
      .getByTitle(listNames)
      .items.add({ ...itemMetadataAdded });
    console.log(newdata);

    let movedata = await web
      .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
      .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
    console.log(movedata);
    mainParentId = newdata.data.Id;
    mainParentTitle = newdata.data.Title;
    createItemforNewUser(LetestFolderID);
  };
  const saveOldUserTask = async (UpdatedData: any) => {
    var Available = false;
    var TimeInHours: any = changeTime / 60;
    TimeInHours = TimeInHours.toFixed(2);

    if (AllTimeSpentDetails == undefined) {
      var AllTimeSpentDetails: any = [];
    }

    TimeSheet.map((items: any) => {
      if (items.Title == checkCategories) {
        Category = items.Id;
      }
    });

    let web = new Web(`${CurrentSiteUrl}`);

    if (AllTimeEntry != undefined && AllTimeEntry.length > 0) {
      AllTimeEntry.forEach(async (ite: any) => {
        if (ite.Title == UpdatedData.AuthorName) {
          Available = true;
          let folderUri: string = `/${UpdatedData.Company}`;
          if (
            item.props.siteType == "Migration" ||
            item.props.siteType == "ALAKDigital"
          ) {
            var listNames = listName;
            var listUri: string = `${RelativeUrl}/Lists/${listNames}`;
          } else {
            var listNames = listName;
            var listUri: string = `${RelativeUrl}/Lists/${listNames}`;
          }
          let itemMetadataAdded = {
            Title:
              newData != undefined &&
                newData.Title != undefined &&
                newData.Title != ""
                ? newData.Title
                : checkCategories,
            [smartTermId]: item.props.Id,
            CategoryId: Category
            // 'Path': `${RelativeUrl}/Lists/${listName}/${UpdatedData.Company}`
          };

          let newdata = await web.lists
            .getByTitle(listNames)
            .items.add({ ...itemMetadataAdded });
          console.log(newdata);

          let movedata = await web
            .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
            .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
          console.log(movedata);
          mainParentId = newdata.data.Id;
          mainParentTitle = newdata.data.Title;
          createItemMainList();
        }
      });
    }
    if (AllTimeEntry.length == 0 && Available == false) {
      GetOrCreateFolder(
        CurrentUserTitle,
        UpdatedData,
        CurrentSiteUrl,
        listName
      );
    }
  };

  const CreateTaskUser = async () => {
    var TimeInHours: any = changeTime / 60;
    TimeInHours = TimeInHours.toFixed(2);

    if (AllTimeSpentDetails == undefined) {
      var AllTimeSpentDetails: any = [];
    }

    TimeSheet.map((items: any) => {
      if (items.Title == checkCategories) {
        Category = items.Id;
      }
    });
    // GetOrCreateFolder(CurrentUserTitle, 'Santosh Kumar', CurrentSiteUrl, listName)

    // let web = new Web(`${CurrentSiteUrl}`);
    // await web.lists.getByTitle('Task Users').items.add({
    //     Title: CurrentUserTitle,
    //     AssingedToUserId: CurntUserId
    // })
    //     .then(async (res: any) => {

    //         var folderName = `${CurrentSiteUrl}/Lists/${listName}`

    //     })
  };

  const saveTimeSpent = async () => {
    var UpdatedData: any = {};
    if (item.props.siteType == "Offshore Tasks") {
      var siteType = "OffshoreTasks";
      smartTermId = "Task" + siteType + "Id";
    } else {
      smartTermId = "Task" + item.props.siteType + "Id";
    }

    showProgressBar();

    var AddedData: any = [];

    if (checkCategories == undefined && checkCategories == undefined) {
      alert("please select category or Title");
      return false;
    } else {
      closeTaskStatusUpdatePoup();
      var count: any = 0;
      $.each(AllUsers, async function (index: any, taskUser: any) {
        count++;
        if (
          taskUser.AssingedToUserId != null &&
          taskUser.AssingedToUserId == CurntUserId
        ) {
          UpdatedData["AuthorName"] = taskUser.Title;
          UpdatedData["Company"] = taskUser.Company;
          UpdatedData["UserImage"] =
            taskUser.Item_x0020_Cover != undefined &&
              taskUser.Item_x0020_Cover.Url != undefined
              ? taskUser.Item_x0020_Cover.Url
              : "";
          await saveOldUserTask(UpdatedData);
        }
      });
      if (
        UpdatedData.AuthorName == undefined &&
        UpdatedData.AuthorName == null
      ) {
        alert("Please Add user on Task User Management");
      }
    }

    //--------------------------------End Post----------------------------------------------------------------
  };
  const createItemMainList = async () => {
    var UpdatedData: any = {};
    $.each(AllUsers, function (index: any, taskUser: any) {
      if (taskUser.AssingedToUserId == CurntUserId) {
        UpdatedData["AuthorName"] = taskUser.Title;
        UpdatedData["Company"] = taskUser.Company;
        UpdatedData["UserImage"] =
          taskUser.Item_x0020_Cover != undefined &&
            taskUser.Item_x0020_Cover.Url != undefined
            ? taskUser.Item_x0020_Cover.Url
            : "";
      }
    });
    let web = new Web(`${CurrentSiteUrl}`);
    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var listUri: string = `${RelativeUrl}/Lists/${listName}`;
    } else {
      var listUri: string = `${RelativeUrl}/Lists/${listName}`;
    }

    let folderUri: string = `/${UpdatedData.Company}/${UpdatedData.AuthorName}`;

    let itemMetadataAdded = {
      Title:
        newData != undefined &&
          newData.Title != undefined &&
          newData.Title != ""
          ? newData.Title
          : checkCategories,
      [smartTermId]: item.props.Id,
      CategoryId: Category
    };
    //First Add item on top
    let newdata = await web.lists
      .getByTitle(listName)
      .items.add({ ...itemMetadataAdded });
    console.log(newdata);

    let movedata = await web
      .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
      .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
    console.log(movedata);
    NewParentId = newdata.data.Id;
    NewParentTitle = newdata.data.Title;
    NewCategoryId = newdata.data.CategoryId;
    AllTimeEntry = [];
    EditData(item.props);
  };
  const createItemforNewUser = async (LetestFolderID: any) => {
    let web = new Web(`${CurrentSiteUrl}`);
    let taskUsers = [];
    taskUsers = await web.lists.getByTitle("Task Users").items.top(4999).get();

    var UpdatedData: any = {};
    $.each(taskUsers, function (index: any, taskUser: any) {
      if (taskUser.AssingedToUserId == CurntUserId) {
        UpdatedData["AuthorName"] = taskUser.Title;
        UpdatedData["Company"] = taskUser.Company;
        UpdatedData["UserImage"] =
          taskUser.Item_x0020_Cover != undefined &&
            taskUser.Item_x0020_Cover.Url != undefined
            ? taskUser.Item_x0020_Cover.Url
            : "";
      }
    });

    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var listUri: string = `${RelativeUrl}/Lists/${listName}`;
    } else {
      var listUri: string = `${RelativeUrl}/Lists/${listName}`;
    }

    let folderUri: string = `/${UpdatedData.Company}/${UpdatedData.AuthorName}`;

    let itemMetadataAdded = {
      Title:
        newData != undefined &&
          newData.Title != undefined &&
          newData.Title != ""
          ? newData.Title
          : checkCategories,
      [smartTermId]: item.props.Id,
      CategoryId: Category
    };
    //First Add item on top
    let newdata = await web.lists
      .getByTitle(listName)
      .items.add({ ...itemMetadataAdded });
    console.log(newdata);
    let movedata = await web
      .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
      .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
    console.log(movedata);
    NewParentId = newdata.data.Id;
    NewParentTitle = newdata.data.Title;
    NewCategoryId = newdata.data.CategoryId;
    EditData(item.props);
  };

  const AddTaskTime = async () => {
    var UpdatedData: any = [];
    var CurrentUser: any = {};
    var update: any = {};
    var CurrentAddData: any = [];
    var CurrentUserData: any = [];
    var AllData: any = [];
    var count = 0;
    var LetestId = "";
    var MyData: any = [];
    var countss = 0;
    var AddMainParentId: any = "";
    var isTrueTime: Boolean = false;
    var AddParentId: any = "";
    let web = new Web(`${CurrentSiteUrl}`);
    var TimeInMinute: any = changeTime / 60;
    $.each(AllUsers, function (index: any, taskUser: any) {
      if (taskUser.AssingedToUserId === CurntUserId) {
        CurrentUser["AuthorName"] = taskUser.Title;
        CurrentUser["Company"] = taskUser.Company;
        CurrentUser["AuthorImage"] =
          taskUser.Item_x0020_Cover != undefined &&
            taskUser.Item_x0020_Cover.Url != undefined
            ? taskUser.Item_x0020_Cover.Url
            : "";
      }
    });
    if (item.props.siteType == "Offshore Tasks") {
      var siteType = "OffshoreTasks";
      var filteres = "Task" + siteType + "/Id eq " + item.props.Id;
      var linkedSite = "Task" + siteType;
    } else {
      var filteres = "Task" + item.props.siteType + "/Id eq " + item.props.Id;
      var linkedSite = "Task" + item.props.siteType;
    }
    CurrentAddData = await web.lists
      .getByTitle(listName)
      .items.select(
        `Id,Title,TaskDate,Created,Modified,TaskTime,${linkedSite}/Title,${linkedSite}/Id,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title`
      )
      .expand(`Editor,Author,Category,TimesheetTitle,${linkedSite}`)
      .filter(
        `AuthorId eq '${CurntUserId}'` &&
        `TimesheetTitle/Id eq '${ParentId.Id}'`
      )
      .getAll();
    CurrentUserData = CurrentAddData;
    CurrentUserData?.forEach((time: any) => {
      countss++;
      if (time.AuthorId == CurntUserId) {
        if (
          time.AdditionalTimeEntry != null &&
          time.AdditionalTimeEntry != undefined
        ) {
          time.AdditionalTime = JSON.parse(time.AdditionalTimeEntry);
          AllData.push(time);
        }
      }
    });
    if (AllData != undefined && AllData.length > 0) {
      var timeSpentId: any = "";
      AllData?.forEach((itemms: any) => {
        timeSpentId = itemms.AdditionalTime[itemms.AdditionalTime.length - 1];
        LetestId = itemms.Id;
        itemms?.AdditionalTime.forEach((val: any) => {
          isTrueTime = true;
          count++;
          AddParentId = val.ParentID;

          AddMainParentId = val.MainParentId;
          MyData.push(val);
        });
      });

      if (MyData != undefined && MyData.length > 0) {
        update["AuthorName"] = CurrentUser.AuthorName;
        update["AuthorId"] = CurntUserId;
        update["AuthorImage"] = CurrentUser.AuthorImage;
        update["ID"] = timeSpentId.ID + 1;
        update["Id"] = timeSpentId.ID + 1;
        update["MainParentId"] = AddMainParentId;
        update["ParentID"] = AddParentId;
        update["TaskTime"] = TimeInHours;
        update["TaskTimeInMin"] = TimeInMinutes;
        update["TaskDate"] = Moment(myDatee).format("DD/MM/YYYY");
        update["Description"] = postData.Description;
        MyData.push(update);
        UpdatedData = MyData;
      } else {
        update["AuthorName"] = CurrentUser.AuthorName;
        update["AuthorImage"] = CurrentUser.AuthorImage;
        update["AuthorId"] = CurntUserId;
        update["ID"] = 0;
        update["Id"] = 0;
        update["MainParentId"] = ParentId.Id;
        update["ParentID"] = LetestId;
        update["TaskTime"] = TimeInHours;
        update["TaskTimeInMin"] = TimeInMinutes;
        update["TaskDate"] = Moment(myDatee).format("DD/MM/YYYY");
        update["Description"] = postData.Description;
        AllData[0].AdditionalTime.push(update);
        UpdatedData = AllData[0].AdditionalTime;
      }
    }
    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var ListId = TimeSheetlistId;
    } else {
      var ListId = TimeSheetlistId;
    }

    const finalData = UpdatedData.filter((val: any, id: any, array: any) => {
      return array.indexOf(val) == id;
    });
    if (isTrueTime == true) {
      await web.lists
        .getById(ListId)
        .items.getById(AddParentId)
        .update({
          AdditionalTimeEntry: JSON.stringify(finalData)
        })
        .then((res: any) => {
          console.log(res);

          setupdateData(updateData + 1);
        });
    }

    closeAddTaskTimepopup();
    // $.each(TaskCate, async function (index: any, items: any) {
    //     countss++
    //     if (items.TimesheetTitle.Id != undefined && items.TimesheetTitle.Id == ParentId.Id) {
    //         if (items.AdditionalTime.length > 0 && items.AdditionalTime != undefined) {
    //             var timeSpentId = items.AdditionalTime[items.AdditionalTime.length - 1];
    //             $.each(items.AdditionalTime, async function (index: any, NewsubItem: any) {
    //                 if (NewsubItem.AuthorId == CurntUserId && items.Id == NewsubItem.ParentID) {

    //                     isTrueTime = true;
    //                     count++
    //                     AddParentId = NewsubItem.ParentID

    //                     AddMainParentId = NewsubItem.MainParentId
    //                     CurrentAddData.push(NewsubItem)
    //                 }

    //             })

    //             update['AuthorName'] = CurrentUser.AuthorName;
    //             update['AuthorId'] = CurntUserId;
    //             update['AuthorImage'] = CurrentUser.AuthorImage;
    //             update['ID'] = timeSpentId.ID + 1;
    //             update['Id'] = timeSpentId.ID + 1;
    //             update['MainParentId'] = AddMainParentId;
    //             update['ParentID'] = AddParentId;
    //             update['TaskTime'] = TimeInHours;
    //             update['TaskTimeInMin'] = TimeInMinutes;
    //             update['TaskDate'] = Moment(myDatee).format('DD/MM/YYYY');
    //             update['Description'] = postData.Description
    //             CurrentAddData.push(update)
    //             UpdatedData = CurrentAddData

    //             if (items.AdditionalTime.length == 0) {
    //                 AddParentId = items.Id;
    //                 update['AuthorName'] = CurrentUser.AuthorName;
    //                 update['AuthorImage'] = CurrentUser.AuthorImage;
    //                 update['AuthorId'] = CurntUserId
    //                 update['ID'] = 0;
    //                 update['Id'] = 0;
    //                 update['MainParentId'] = items.TimesheetTitle.Id;
    //                 update['ParentID'] = items.Id;
    //                 update['TaskTime'] = TimeInHours;
    //                 update['TaskTimeInMin'] = TimeInMinutes;
    //                 update['TaskDate'] = Moment(myDatee).format('DD/MM/YYYY');
    //                 update['Description'] = postData.Description
    //                 items.AdditionalTime.push(update)
    //                 UpdatedData = items.AdditionalTime

    //             }

    //             if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {

    //                 var ListId = TimeSheetlistId

    //             }
    //             else {
    //                 var ListId = TimeSheetlistId
    //             }

    //             if(isTrueTime == true){
    //                 const finalData = UpdatedData.filter((val: any, id: any, array: any) => {
    //                     return array.indexOf(val) == id;
    //                 })

    //             await web.lists.getById(ListId)
    //                 .items.getById(AddParentId)
    //                 .update({

    //                     AdditionalTimeEntry: JSON.stringify(finalData),

    //                 }).then((res: any) => {
    //                     console.log(res);

    //                     setupdateData(updateData + 1)

    //                 })
    //             }
    //         }

    //     }

    // })

    if (CurrentUserData.length == countss && isTrueTime == false) {
      saveJsonDataAnotherCat(CurrentUser, ParentId);
    }
  };
  const saveJsonDataAnotherCat = async (CurrentUser: any, items: any) => {
    var update: any = {};
    var UpdatedData: any = [];
    let web = new Web(`${CurrentSiteUrl}`);
    if (item.props.siteType == "Offshore Tasks") {
      var siteType = "OffshoreTasks";
      smartTermId = "Task" + siteType + "Id";
    } else {
      smartTermId = "Task" + item.props.siteType + "Id";
    }

    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var listUri: string = `${RelativeUrl}/Lists/${listName}`;
    } else {
      var listUri: string = `${RelativeUrl}/Lists/${listName}`;
    }

    let folderUri: string = `/${CurrentUser.Company}/${CurrentUser.AuthorName}`;

    let itemMetadataAdded = {
      Title:
        items != undefined && items.Title != undefined && items.Title != ""
          ? items.Title
          : "",
      [smartTermId]: item.props.Id,
      CategoryId: items.Category.Id
    };
    //First Add item on top
    let newdata = await web.lists
      .getByTitle(listName)
      .items.add({ ...itemMetadataAdded });
    console.log(newdata);

    let movedata = await web
      .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
      .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
    console.log(movedata);
    NewParentId = newdata.data.Id;
    NewParentTitle = newdata.data.Title;
    NewCategoryId = newdata.data.CategoryId;

    var AddParentId = items.Id;
    update["AuthorName"] = CurrentUser.AuthorName;
    update["AuthorImage"] = CurrentUser.AuthorImage;
    update["AuthorId"] = CurntUserId;
    update["ID"] = 0;
    update["Id"] = 0;
    update["MainParentId"] = items.Id;
    update["ParentID"] = NewParentId;
    update["TaskTime"] = TimeInHours;
    update["TaskTimeInMin"] = TimeInMinutes;
    update["TaskDate"] = Moment(myDatee).format("DD/MM/YYYY");
    update["Description"] = postData.Description;
    UpdatedData.push(update);

    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var ListId = TimeSheetlistId;
    } else {
      var ListId = TimeSheetlistId;
    }

    await web.lists
      .getById(ListId)
      .items.getById(NewParentId)
      .update({
        AdditionalTimeEntry: JSON.stringify(UpdatedData),
        TimesheetTitleId: items.Id
      })
      .then((res: any) => {
        console.log(res);

        closeAddTaskTimepopup();
        setupdateData(updateData + 1);
        //setAdditionalTime({ ...AdditionalTime })
      });
  };
  const saveJsonDataAnotherCopy = async (
    CurrentUser: any,
    items: any,
    child: any
  ) => {
    var update: any = {};
    var UpdatedData: any = [];
    let web = new Web(`${CurrentSiteUrl}`);
    var Dateee = "";
    if (editeddata != undefined) {
      var a = Moment(editeddata).format();
      Dateee = Moment(a).format("DD/MM/YYYY");
    } else {
      Dateee = Moment(changeEdited).format("DD/MM/YYYY");
    }
    var DateFormate = new Date(Eyd);

    if (item.props.siteType == "Offshore Tasks") {
      var siteType = "OffshoreTasks";
      smartTermId = "Task" + siteType + "Id";
    } else {
      smartTermId = "Task" + item.props.siteType + "Id";
    }

    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var listUri: string = `${RelativeUrl}/Lists/${listName}`;
    } else {
      var listUri: string = `${RelativeUrl}/Lists/${listName}`;
    }

    let folderUri: string = `/${CurrentUser.Company}/${CurrentUser.AuthorName}`;

    let itemMetadataAdded = {
      Title:
        items != undefined && items.Title != undefined && items.Title != ""
          ? items.Title
          : "",
      [smartTermId]: item.props.Id,
      CategoryId: items.Category.Id
    };
    //First Add item on top
    let newdata = await web.lists
      .getByTitle(listName)
      .items.add({ ...itemMetadataAdded });
    console.log(newdata);

    let movedata = await web
      .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
      .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
    console.log(movedata);
    NewParentId = newdata.data.Id;
    NewParentTitle = newdata.data.Title;
    NewCategoryId = newdata.data.CategoryId;

    var AddParentId = items.Id;
    child.AuthorName = CurrentUser.AuthorName;
    child.AuthorImage = CurrentUser.AuthorImage;
    child.AuthorId = CurntUserId;
    child.ID = child.ID + 1;
    child.Id = child.Id + 1;
    child.ParentID = NewParentId;
    child.MainParentId = items.TimesheetTitle.Id;
    child.TaskTime =
      TimeInHours != undefined && TimeInHours != 0
        ? TimeInHours
        : child.TaskTime;
    child.TaskTimeInMin =
      TimeInMinutes != undefined && TimeInMinutes != 0
        ? TimeInMinutes
        : child.TaskTimeInMin;
    child.TaskDate =
      Dateee != "Invalid date"
        ? Dateee
        : Moment(DateFormate).format("DD/MM/YYYY");
    child.Description =
      postData != undefined &&
        postData.Description != undefined &&
        postData.Description != ""
        ? postData.Description
        : child.Description;

    UpdatedData.push(child);

    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var ListId = TimeSheetlistId;
    } else {
      var ListId = TimeSheetlistId;
    }

    await web.lists
      .getById(ListId)
      .items.getById(NewParentId)
      .update({
        AdditionalTimeEntry: JSON.stringify(UpdatedData),
        TimesheetTitleId: items.TimesheetTitle.Id
      })
      .then((res: any) => {
        console.log(res);

        closeAddTaskTimepopup();
        setupdateData(updateData + 1);
        //setAdditionalTime({ ...AdditionalTime })
      });
  };

  const deleteCategory = async (val: any) => {
    var deleteConfirmation = confirm("Are you sure, you want to delete this?");
    var ListId = TimeSheetlistId;
    if (deleteConfirmation) {
      let web = new Web(`${CurrentSiteUrl}`);
      await web.lists.getById(ListId).items.getById(val.Id).delete();
      TaskCate?.forEach(async (item: any) => {
        if (item.TimesheetTitle.Id == val.Id) {
          await web.lists.getById(ListId).items.getById(item.Id).delete();
          setupdateData(updateData + 1);
        }
      });
    }
  };

  var isTrue = false;
  const SaveCopytime = async (child: any) => {
    var CurrentUser: any = {};

    var counts = 0;
    var update: any = {};
    var TimeInMinute: any = changeTime / 60;
    var UpdatedData: any = [];
    var AddParent: any = "";
    var AddMainParent: any = "";
    $.each(AllUsers, function (index: any, taskUser: any) {
      if (taskUser.AssingedToUserId === CurntUserId) {
        CurrentUser["AuthorName"] = taskUser.Title;
        CurrentUser["Company"] = taskUser.Company;
        CurrentUser["AuthorImage"] =
          taskUser.Item_x0020_Cover != undefined &&
            taskUser.Item_x0020_Cover.Url != undefined
            ? taskUser.Item_x0020_Cover.Url
            : "";
      }
    });
    var Dateee = "";
    if (editeddata != undefined) {
      var a = Moment(editeddata).format();
      Dateee = Moment(a).format("DD/MM/YYYY");
    } else {
      Dateee = Moment(changeEdited).format("DD/MM/YYYY");
    }
    var DateFormate = new Date(Eyd);

    $.each(TaskCate, function (index: any, subItem: any) {
      counts++;
      if (
        subItem.TimesheetTitle.Id == child.MainParentId &&
        subItem.AuthorId == CurntUserId
      ) {
        if (
          subItem.AdditionalTime.length > 0 &&
          subItem.AdditionalTime != undefined
        ) {
          var timeSpentId =
            subItem.AdditionalTime[subItem.AdditionalTime.length - 1];
          $.each(
            subItem.AdditionalTime,
            async function (index: any, NewsubItem: any) {
              if (NewsubItem.AuthorId == CurntUserId) {
                AddParent = NewsubItem.ParentID;
                AddMainParent = NewsubItem.MainParentId;
                isTrue = true;
              }
            }
          );

          update["AuthorName"] = CurrentUser.AuthorName;
          update["AuthorImage"] = CurrentUser.AuthorImage;
          update["ID"] = timeSpentId.ID + 1;
          update["AuthorId"] = CurntUserId;
          update["MainParentId"] = AddMainParent;
          update["ParentID"] = AddParent;
          update["TaskTime"] =
            TimeInHours != undefined && TimeInHours != 0
              ? TimeInHours
              : child.TaskTime;
          update["TaskTimeInMin"] =
            TimeInMinutes != undefined && TimeInMinutes != 0
              ? TimeInMinutes
              : child.TaskTimeInMin;
          update["TaskDate"] =
            Dateee != "Invalid date"
              ? Dateee
              : Moment(DateFormate).format("DD/MM/YYYY");
          update["Description"] =
            postData != undefined &&
              postData.Description != undefined &&
              postData.Description != ""
              ? postData.Description
              : child.Description;
          subItem.AdditionalTime.push(update);
          UpdatedData = subItem.AdditionalTime;
        }
      }
    });
    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var ListId = TimeSheetlistId;
    } else {
      var ListId = TimeSheetlistId;
    }
    setCopyTaskpopup(false);
    let web = new Web(`${CurrentSiteUrl}`);
    if (isTrue == true) {
      await web.lists
        .getById(ListId)
        .items.getById(AddParent)
        .update({
          // TaskDate:postData.TaskDate,
          AdditionalTimeEntry: JSON.stringify(UpdatedData)
        })
        .then((res: any) => {
          console.log(res);

          closeCopyTaskpopup();
          setupdateData(updateData + 1);
        });
    }

    if (TaskCate.length == counts && isTrue == false) {
      TaskCate?.forEach((items: any) => {
        if (items.Id == child.ParentID) {
          saveJsonDataAnotherCopy(CurrentUser, items, child);
        }
      });
    }
  };
  const DateFormat = (itemL: any) => {
    let Newh = Moment().add("days");
    //console.log(Newh)
    let serverDateTime;
    let mDateTime = Moment(itemL);
    serverDateTime = mDateTime.format(itemL);
    return serverDateTime;
  };
  const updateCategory = async () => {
    TimeSheet.map((items: any) => {
      if (items.Title == checkCategories) {
        Category = items.Id;
      }
    });
    let web = new Web(`${CurrentSiteUrl}`);
    if (
      item.props.siteType == "Migration" ||
      item.props.siteType == "ALAKDigital"
    ) {
      var ListId = TimeSheetlistId;
    } else {
      var ListId = TimeSheetlistId;
    }

    await web.lists
      .getById(ListId)
      .items.getById(CategoryyID)
      .update({
        Title: newData != undefined ? newData.Title : checkCategories,
        CategoryId:
          Category != undefined && Category != "" ? Category : CategoriesIdd
      })
      .then((res: any) => {
        console.log(res);

        closeEditcategorypopup((e: any) => e);
        setupdateData(updateData + 1);
      });
  };
  const onRenderCustomHeaderAddTaskTime = () => {
    return (
      <>
        <div
          className="ps-4 siteColor"
          style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}
        >
          Add Task Time
        </div>
        <Tooltip ComponentId="1753" />
      </>
    );
  };
  const onRenderCustomHeaderEditTaskTime = () => {
    return (
      <>
        <div
          className="ps-4 siteColor"
          style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}
        >
          Edit Task Time
        </div>
        <Tooltip ComponentId="1753" />
      </>
    );
  };
  const onRenderCustomHeaderCopyTaskTime = () => {
    return (
      <>
        <div
          className="ps-4 siteColor"
          style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}
        >
          Copy Task Time
        </div>
        <Tooltip ComponentId="1753" />
      </>
    );
  };
  const onRenderCustomHeaderEditCategory = () => {
    return (
      <>
        <div
          className="ps-4 siteColor"
          style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}
        >
          Edit Category
        </div>
        <Tooltip ComponentId="1753" />
      </>
    );
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

  const changeDatetodayQuickly = (date: any, type: any, Popup: any) => {
    if (Popup == "Edit") {
      if (type == "firstdate") {
        var a1 = date.split("/");
        a1[0] = "01";
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        //setMyDatee(finalDate)
        setediteddata(change);
      }
      if (type == "15thdate") {
        var a1 = date.split("/");
        a1[0] = "15";
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        // setMyDatee(finalDate)
        setediteddata(change);
      }
      if (type == "1Jandate") {
        var a1 = date.split("/");
        a1[1] = "01";
        a1[0] = "01";
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        //setMyDatee(finalDate)
        setediteddata(change);
      }
      if (type == "Today") {
        var newStartDate: any = Moment().format("DD/MM/YYYY");
        var a1 = newStartDate.split("/");
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        //setMyDatee(finalDate)
        setediteddata(change);
      }
    }
    if (Popup == "Add") {
      if (type == "firstdate") {
        var newStartDate: any = Moment(date).format("DD/MM/YYYY");
        var a1 = newStartDate.split("/");
        a1[0] = "01";
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        // setMyDatee(finalDate)
        //setediteddata(finalDate)
        // var inputDate = new Date(a1)
        setMyDatee(change);
      }
      if (type == "15thdate") {
        var newStartDate: any = Moment(date).format("DD/MM/YYYY");
        var a1 = newStartDate.split("/");
        a1[0] = "15";
        a1 = a1[2] + a1[1] + a1[0];
        let finalDate: any = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        // setMyDatee(finalDate)
        // setediteddata(finalDate)
        // var inputDate = new Date(a1)
        setMyDatee(change);
      }
      if (type == "1Jandate") {
        var newStartDate: any = Moment(date).format("DD/MM/YYYY");
        var a1 = newStartDate.split("/");
        a1[1] = "01";
        a1[0] = "01";
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        //setMyDatee(finalDate)
        //setediteddata(finalDate)
        // var inputDate = new Date(a1)
        setMyDatee(change);
      }
      if (type == "Today") {
        var newStartDate: any = Moment().format("DD/MM/YYYY");
        var a1 = newStartDate.split("/");
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        //setMyDatee(finalDate)
        //setediteddata(finalDate)
        //var inputDate = new Date(a1)
        setMyDatee(change);
      }
    }
  };
  function convert(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  const handleDatedue = (date: any) => {
    change = new window.Date(date);
    var NewDate: any = new window.Date(date);
    // var FinalDate = moment(NewDate).format("ddd, DD MMM yyyy")
    setMyDatee(NewDate);
    //setMyDatee(NewDate)
    setediteddata(NewDate);
  };
  const handleOnBlur = (event: any) => {
    setNewData({ ...newData, TaskDate: event.target.value });
  };

  const flatviewOpen = (e: any) => {
    var newArray: any = [];
    var sortedData: any = [];
    Flatview = e.target.checked;
    if (Flatview == false) {
      setData(backupData);
    } else {
      data?.forEach((item: any) => {
        item.subRows?.forEach((val: any) => {
          newArray.push(val);
        });
      });
      sortedData = newArray.sort(datecomp);
      setData(sortedData);
    }

    // setFlatview((flatview: any) => ([...flatview]))
  };

  const column = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCustomExpanded: true,
        hasExpanded: true,
        size: 20,
        margin:0,
        id: "Id"

      },

      {
        accessorFn: (row) => row?.AuthorName,
        id: "AuthorName",
        placeholder: "AuthorName",
        header: "",
        size: 340,
        cell: ({ row }) => (
          <>
            <span>
              <div className="d-flex">
                <>
                  {row?.original?.show === true ? (
                    <span>
                      {row?.original?.AuthorImage != "" &&
                        row?.original.AuthorImage != null ? (
                          <img
                            className="AssignUserPhoto1 bdrbox m-0 wid29"
                            title={row?.original.AuthorName}
                            data-toggle="popover"
                            data-trigger="hover"
                            src={row?.original.AuthorImage}
                          ></img>
                      ) : (
                        <>
                          {" "}
                          <img
                            className="AssignUserPhoto1 bdrbox m-0 wid29"
                            title={row?.original.AuthorName}
                            data-toggle="popover"
                            data-trigger="hover"
                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                          ></img>
                        </>
                      )}
                      <span className="mx-1">{row?.original?.AuthorName}</span>
                    </span>
                  ) : (
                    <>
                      <span className="mx-1">
                        {row?.original?.Category?.Title} -{" "}
                        {row?.original?.Title}
                      </span>
                      <span
                        className="svg__iconbox svg__icon--edit"
                        onClick={() => Editcategorypopup(row.original)}
                      ></span>
                      <span
                        className="svg__iconbox svg__icon--trash hreflink"
                        onClick={() => deleteCategory(row.original)}
                      ></span>
                    </>
                  )}
                </>
              </div>
            </span>
          </>
        )
      },

      {
        accessorKey: "TaskDates",
        placeholder: "TaskDate",
        header: "",
        size: 115
      },
      {
        accessorKey: "TaskTime",
        placeholder: "TaskTime",
        header: "",
        size: 95
      },
      {
        accessorKey: "Description",
        placeholder: "Description",
        header: ""
      },
      {
        id: "ff",
        accessorKey: "",
        size: 75,
        canSort: false,
        placeholder: "",
        cell: ({ row }) => (
          <div className="alignCenter gap-1 pull-right">
            {row?.original?.show === false ? (
              <span style={{ width: "7.7%" }}>
                <button
                  type="button"
                  className="btn btn-primary me-1 d-flex "
                  onClick={() => openAddTasktimepopup(row.original)}
                >
                  Add Time{" "}
                  <span className="bg-light m-0  ms-1 p-0 svg__icon--Plus svg__iconbox"></span>
                </button>
              </span>
            ) : (
              <>
                {" "}
                <img title="Copy" className="hreflink"
                  src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_copy.png"
                  onClick={() => openCopyTaskpopup(row.original)}
                ></img>


                {" "}
                <span className="svg__iconbox svg__icon--edit hreflink" onClick={() =>
                  openTaskStatusUpdatePoup2(
                    row?.getParentRow()?.original,
                    row.original
                  )
                } >
                </span>
                {" "}
                <span title="Delete"
                  className="svg__icon--trash hreflink  svg__iconbox"
                  onClick={() => deleteTaskTime(row.original)}
                ></span>
              </>
            )}
          </div>
        )
      }
    ],
    [data]
  );
  return (
    <div className={PortfolioType == "Service" ? "serviepannelgreena" : ""}>
      <div>
        <div className="col-sm-12 p-0">
          <span></span>
          <div className="col-sm-12 p-0 mt-10">
            <div className="col-sm-12 ps-0 pr-5 TimeTabBox mt-2">
              <a
                className="hreflink pull-right mt-1 mr-0"
                onClick={openTaskStatusUpdatePoup}
              >
                + Add Time in New Structure
              </a>
              <div>
                <input
                  type="checkbox"
                  className="form-check-input pull-Left mt-1 me-1"
                  onClick={(e: any) => flatviewOpen(e)}
                />
                FlatView
              </div>
            </div>
          </div>
        </div>
      </div>

      {collapseItem && (
        <div className="togglecontent clearfix">
          <div id="forShowTask" className="pt-0">
            <div className="Alltable">
              <div className="col-sm-12 p-0 smart">
                <div>
                  <div className="wrapper AllTime">
                    {data && (
                      <GlobalCommanTable
                        columns={column}
                        data={data}
                        callBackData={callBackData}
                        expendedTrue={expendedTrue}
                      />
                    )}

                    {TaskCate.length === 0 && (
                      <div className="text-center pb-3">
                        No Timesheet Available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Panel
        onRenderHeader={onRenderCustomHeaderAddTaskTime}
        type={PanelType.custom}
        customWidth="850px"
        isOpen={TaskStatuspopup}
        onDismiss={closeTaskStatusUpdatePoup}
        isBlocking={false}
      >
        <div
          className={
            PortfolioType == "Service"
              ? "modal-body border px-3 py-1 serviepannelgreena"
              : "modal-body border px-3 py-1"
          }
        >
          <div className="row">
            <div className="col-sm-9 border-end">
              <div className="mb-1">
                <div className="input-group">
                  <label className="form-label full-width">Selected Category</label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    name="CategoriesTitle"
                    disabled={true}
                    value={checkCategories}
                  />
                </div>
              </div>
              <div className="mb-1">
                <div className="input-group" key={checkCategories}>
                  <label className="form-label full-width">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="TimeTitle"
                    defaultValue={checkCategories}
                    onChange={(e) =>
                      setNewData({ ...newData, Title: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mb-1">
                <div className="form-group">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="date-div">
                        <div className="Date-Div-BAR d-flex">
                          <span
                            className="href"
                            id="selectedYear"
                            onClick={() =>
                              changeDatetodayQuickly(
                                myDatee,
                                "firstdate",
                                "Add"
                              )
                            }
                          >
                            1st
                          </span>
                          |{" "}
                          <span
                            className="href"
                            id="selectedYear"
                            onClick={() =>
                              changeDatetodayQuickly(myDatee, "15thdate", "Add")
                            }
                          >
                            15th
                          </span>
                          |{" "}
                          <span
                            className="href"
                            id="selectedYear"
                            onClick={() =>
                              changeDatetodayQuickly(myDatee, "1Jandate", "Add")
                            }
                          >
                            1 Jan
                          </span>
                          |
                          <span
                            className="href"
                            id="selectedToday"
                            onClick={() =>
                              changeDatetodayQuickly(myDatee, "Today", "Add")
                            }
                          >
                            Today
                          </span>
                        </div>
                        <div className="input-group mt-1">
                        <label className="form-label full-width">Date</label>

                        <DatePicker
                          className="form-control"
                          selected={myDatee}
                          onChange={handleDatedue}
                          dateFormat="EEE, dd MMM yyyy"
                        /></div>
                      </div>
                    </div>

                    <div className="col-sm-6  session-control-buttons">
                      <div className="row">
                        <div className="col-sm-4 ">
                          <button
                            id="DayPlus"
                            className="top-container plus-button plus-minus"
                            onClick={() => changeDate("Date", "AddCategory")}
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </button>
                          <span className="min-input">Day</span>
                          <button
                            id="DayMinus"
                            className="top-container minus-button plus-minus"
                            onClick={() => changeDateDec("Date", "AddCategory")}
                          >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                          </button>
                        </div>

                        <div className="col-sm-4 ">
                          <button
                            id="MonthPlus"
                            className="top-container plus-button plus-minus"
                            onClick={() => changeDate("month", "AddCategory")}
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </button>
                          <span className="min-input">Month</span>
                          <button
                            id="MonthMinus"
                            className="top-container minus-button plus-minus"
                            onClick={() =>
                              changeDateDec("month", "AddCategory")
                            }
                          >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                          </button>
                        </div>

                        <div className="col-sm-4 ">
                          <button
                            id="YearPlus"
                            className="top-container plus-button plus-minus"
                            onClick={() => changeDate("Year", "AddCategory")}
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </button>
                          <span className="min-input">Year</span>
                          <button
                            id="YearMinus"
                            className="top-container minus-button plus-minus"
                            onClick={() => changeDateDec("year", "AddCategory")}
                          >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 pe-0">
                      <label className="form-label full-width"></label>
                      <input
                        type="text" className="form-control"
                        value={TimeInMinutes > 0 ? TimeInMinutes : 0}
                        onChange={(e) => changeTimeFunction(e, "Add")}
                      />
                    </div>
                    <div className="col-sm-3 ps-0">
                      <label className="form-label full-width"></label>
                      <input
                        className="form-control bg-e9"
                        type="text"
                        value={`${TimeInHours > 0 ? TimeInHours : 0}  Hours`}
                      />
                    </div>
                    <div className="col-sm-6  Time-control-buttons">
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
                        <span> 15min </span>
                        <button
                          className="btn btn-primary"
                          title="Increase by 15 Min"
                          onClick={() =>
                            changeTimes("15", "add", "AddNewStructure")
                          }
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
                        <span> 60min </span>
                        <button
                          className="btn btn-primary"
                          title="Increase by 60 Min"
                          onClick={() =>
                            changeTimes("60", "add", "AddNewStructure")
                          }
                        >
                          <i className="fa fa-plus" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label full-width">Short Description</label>
                    <textarea
                      className="full-width"
                      id="AdditionalshortDescription"
                      cols={15}
                      rows={4}
                      defaultValue={item.Description}
                      onChange={(e) =>
                        setNewData({ ...newData, Description: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="col mb-2">
                <div className="mb-1">
                  <a
                    target="_blank"
                    href="{{pageContext}}/SitePages/SmartMetadata.aspx?TabName=Timesheet"
                  >
                    Manage Categories
                  </a>
                </div>
                {TimeSheet.map((Items: any) => {
                  return (
                    <>
                      <div
                        className="SpfxCheckRadio "
                        id="subcategorytasksPriority{{item.Id}}"
                      >
                        <input
                          type="radio"
                          className="radio"
                          checked={showCat == Items.Title ? true : false}
                          // checked={selectCategories === Items.Title ? true : false}
                          onChange={(e) => selectCategories(e, Items.Title)}
                          name="taskcategory"
                        />
                        <label>{Items.Title}</label>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            PortfolioType == "Service"
              ? "modal-footer mt-2 serviepannelgreena"
              : "modal-footer mt-2"
          }
        >
          <button
            type="button"
            className="btn btn-primary"
            disabled={TimeInMinutes <= 0 ? true : false}
            onClick={saveTimeSpent}
          >
            Submit
          </button>
        </div>
      </Panel>

      {/* ---------------------------------------------------------------------EditTime--------------------------------------------------------------------------------------------------------------------------- */}

      <Panel
        onRenderHeader={onRenderCustomHeaderEditTaskTime}
        type={PanelType.custom}
        customWidth="850px"
        isOpen={TaskStatuspopup2}
        onDismiss={closeTaskStatusUpdatePoup2}
        isBlocking={false}
      >
        {saveEditTaskTimeChild.map((child: any, index: any) => {
          return (
            <>
              <div
                className={
                  PortfolioType == "Service"
                    ? "modal-body border p-3 serviepannelgreena"
                    : "modal-body border p-3"
                }
              >
                <div className="col">
                  <div className="input-group mb-2">
                    <label className="form-label full-width">Title</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      name="TimeTitle"
                      defaultValue={CategryTitle}
                      onChange={(e) =>
                        setPostData({ ...postData, Title: e.target.value })
                      }
                    />
                  </div>
                  <div className="col">
                    <div className="row">
                      <div className="col-sm-6 ">
                        <div className="date-div">
                          <div className="Date-Div-BAR d-flex">
                            <span
                              className="href"
                              id="selectedYear"
                              onClick={() =>
                                changeDatetodayQuickly(
                                  child.TaskDate,
                                  "firstdate",
                                  "Edit"
                                )
                              }
                            >
                              1st
                            </span>
                            |{" "}
                            <span
                              className="href"
                              id="selectedYear"
                              onClick={() =>
                                changeDatetodayQuickly(
                                  child.TaskDate,
                                  "15thdate",
                                  "Edit"
                                )
                              }
                            >
                              15th
                            </span>
                            |{" "}
                            <span
                              className="href"
                              id="selectedYear"
                              onClick={() =>
                                changeDatetodayQuickly(
                                  child.TaskDate,
                                  "1Jandate",
                                  "Edit"
                                )
                              }
                            >
                              1 Jan
                            </span>
                            |
                            <span
                              className="href"
                              id="selectedToday"
                              onClick={() =>
                                changeDatetodayQuickly(
                                  child.TaskDate,
                                  "Today",
                                  "Edit"
                                )
                              }
                            >
                              Today
                            </span>
                          </div>
                          <div className="input-group mt-1">
                          <label className="form-label full-width">Date</label>

                          <DatePicker
                            className="form-control"
                            selected={editeddata}
                            onChange={handleDatedue}
                            dateFormat="EEE, dd MMM yyyy"
                          /></div>
                        </div>
                      </div>

                      <div className="col-sm-6 session-control-buttons">
                        <div className="row">
                          <div className="col-sm-4">
                            <button id="DayPlus"
                              className="top-container plus-button plus-minus"
                              onClick={() => changeDate("Date", "EditTime")}>
                              <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                            <span className="min-input">Day</span>
                            <button
                              id="DayMinus"
                              className="top-container minus-button plus-minus"
                              onClick={() => changeDateDec("Date", "EditTime")}
                            >
                              <i className="fa fa-minus" aria-hidden="true"></i>
                            </button>
                          </div>

                          <div className="col-sm-4">
                            <button
                              id="MonthPlus"
                              className="top-container plus-button plus-minus"
                              onClick={() => changeDate("month", "EditTime")}
                            >
                              <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                            <span className="min-input">Month</span>
                            <button
                              id="MonthMinus"
                              className="top-container minus-button plus-minus"
                              onClick={() => changeDateDec("month", "EditTime")}
                            >
                              <i className="fa fa-minus" aria-hidden="true"></i>
                            </button>
                          </div>

                          <div className="col-sm-4">
                            <button
                              id="YearPlus"
                              className="top-container plus-button plus-minus"
                              onClick={() => changeDate("Year", "EditTime")}
                            >
                              <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                            <span className="min-input">Year</span>
                            <button
                              id="YearMinus"
                              className="top-container minus-button plus-minus"
                              onClick={() => changeDateDec("year", "EditTime")}
                            >
                              <i className="fa fa-minus" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-sm-3 pe-0">
                        <label className="form-label full-width"></label>
                        <input
                          type="text"
                          className="form-control"
                          value={
                            TimeInMinutes > 0 || TimeInMinutes == undefined
                              ? TimeInMinutes
                              : child.TaskTimeInMin
                          }
                          onChange={(e) => changeTimeFunction(e, "Edit")}
                        />
                      </div>
                      <div className="col-sm-3 ps-0">
                        <label className="form-label full-width"></label>
                        <input
                          className="form-control bg-e9"
                          type="text"
                          value={`${TimeInHours > 0 || TimeInMinutes == undefined
                            ? TimeInHours
                            : child.TaskTime
                            } Hours`}
                        />
                      </div>
                      <div className="col-sm-6 d-flex justify-content-between align-items-center">
                        <div className="Quaterly-Time">
                          <label className="full_width"></label>
                          <button
                            className="btn btn-primary"
                            title="Decrease by 15 Min"
                            onClick={() =>
                              changeTimesDecEdit("15", child, "EditTask")
                            }
                          >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                          </button>
                          <span> 15min </span>
                          <button
                            className="btn btn-primary"
                            title="Increase by 15 Min"
                            onClick={() =>
                              changeTimesEdit("15", child, "EditTask")
                            }
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </button>
                        </div>
                        <div className="pe-0 Full-Time">
                          <label className="full_width"></label>
                          <button
                            className="btn btn-primary"
                            title="Decrease by 60 Min"
                            onClick={() =>
                              changeTimesDecEdit("60", child, "EditTask")
                            }
                          >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                          </button>
                          <span> 60min </span>
                          <button
                            className="btn btn-primary"
                            title="Increase by 60 Min"
                            onClick={() =>
                              changeTimesEdit("60", child, "EditTask")
                            }
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-sm-12">
                      <label className="form-label full-width">Short Description</label>
                      <textarea
                        className="full_width"
                        id="AdditionalshortDescription"
                        cols={15}
                        rows={4}
                        defaultValue={child.Description}
                        onChange={(e) =>
                          setPostData({
                            ...postData,
                            Description: e.target.value
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                  <footer>
                    <div className="row">
                      <div className="col-sm-6 ">
                        <div className="text-left">
                          Created
                          <span>{child.TaskTimeCreatedDate}</span>
                          by{" "}
                          <span className="siteColor">{child.EditorTitle}</span>
                        </div>
                        <div className="text-left">
                          Last modified
                          <span>{child.TaskTimeModifiedDate}</span>
                          by{" "}
                          <span className="siteColor">{child.EditorTitle}</span>
                        </div>
                      </div>
                      <div className="col-sm-6 text-end">
                        <a
                          target="_blank"
                          href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=${child.ParentID}`}
                        >
                          Open out-of-the-box form
                        </a>
                        <button
                          type="button"
                          className="btn btn-primary ms-2"
                          onClick={(e) => UpdateAdditionaltime(child)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </>
          );
        })}
      </Panel>

      {/* ----------------------------------------------------------------------------Copy Task------------------------------------------------------------------------------------------------------------ */}

      <Panel
        onRenderHeader={onRenderCustomHeaderCopyTaskTime}
        type={PanelType.custom}
        customWidth="850px"
        isOpen={CopyTaskpopup}
        onDismiss={closeCopyTaskpopup}
        isBlocking={false}
      >
        {saveCopyTaskTime.map((item: any) => {
          return (
            <>
              <div
                className={
                  PortfolioType == "Service"
                    ? "modal-body border p-3 serviepannelgreena"
                    : "modal-body border p-3"
                }
              >
                <div className="col">
                  {/* <div className="form-group mb-2">
                                        <label>Title</label>
                                        <input type="text" autoComplete="off"
                                            className="form-control" name="TimeTitle"
                                            defaultValue={item.Title}
                                            onChange={(e) => setPostData({ ...postData, Title: e.target.value })} />

                                    </div> */}
                  {saveCopyTaskTimeChild.map((child: any, index: any) => {
                    return (
                      <>
                        <div className="col">
                          <div className="row">
                            <div className="col-sm-6 ">
                              <div className="date-div">
                                <div className="Date-Div-BAR d-flex">
                                  <span
                                    className="href"
                                    id="selectedYear"
                                    onClick={() =>
                                      changeDatetodayQuickly(
                                        child.TaskDate,
                                        "firstdate",
                                        "Edit"
                                      )
                                    }
                                  >
                                    1st
                                  </span>
                                  |{" "}
                                  <span
                                    className="href"
                                    id="selectedYear"
                                    onClick={() =>
                                      changeDatetodayQuickly(
                                        child.TaskDate,
                                        "15thdate",
                                        "Edit"
                                      )
                                    }
                                  >
                                    15th
                                  </span>
                                  |{" "}
                                  <span
                                    className="href"
                                    id="selectedYear"
                                    onClick={() =>
                                      changeDatetodayQuickly(
                                        child.TaskDate,
                                        "1Jandate",
                                        "Edit"
                                      )
                                    }
                                  >
                                    1 Jan
                                  </span>
                                  |
                                  <span
                                    className="href"
                                    id="selectedToday"
                                    onClick={() =>
                                      changeDatetodayQuickly(
                                        child.TaskDate,
                                        "Today",
                                        "Edit"
                                      )
                                    }
                                  >
                                    Today
                                  </span>
                                </div>
                                <div className="input-group mt-1">
                                <label className="form-label full-width">Date</label>

                                <DatePicker
                                  className="form-control"
                                  selected={editeddata}
                                  onChange={handleDatedue}
                                  dateFormat="EEE, dd MMM yyyy"
                                /></div>
                              </div>
                            </div>

                            <div className="col-sm-6 session-control-buttons">
                              <div className="row">
                                <div className="col-sm-4">
                                  <button
                                    id="DayPlus"
                                    className="top-container plus-button plus-minus"
                                    onClick={() =>
                                      changeDate("Date", "EditTime")
                                    }
                                  >
                                    <i
                                      className="fa fa-plus"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                  <span className="min-input">Day</span>
                                  <button
                                    id="DayMinus"
                                    className="top-container minus-button plus-minus"
                                    onClick={() =>
                                      changeDateDec("Date", "EditTime")
                                    }
                                  >
                                    <i
                                      className="fa fa-minus"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                </div>

                                <div className="col-sm-4">
                                  <button
                                    id="MonthPlus"
                                    className="top-container plus-button plus-minus"
                                    onClick={() =>
                                      changeDate("month", "EditTime")
                                    }
                                  >
                                    <i
                                      className="fa fa-plus"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                  <span className="min-input">Month</span>
                                  <button
                                    id="MonthMinus"
                                    className="top-container minus-button plus-minus"
                                    onClick={() =>
                                      changeDateDec("month", "EditTime")
                                    }
                                  >
                                    <i
                                      className="fa fa-minus"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                </div>

                                <div className="col-sm-4  ">
                                  <button
                                    id="YearPlus"
                                    className="top-container plus-button plus-minus"
                                    onClick={() =>
                                      changeDate("Year", "EditTime")
                                    }
                                  >
                                    <i
                                      className="fa fa-plus"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                  <span className="min-input">Year</span>
                                  <button
                                    id="YearMinus"
                                    className="top-container minus-button plus-minus"
                                    onClick={() =>
                                      changeDateDec("year", "EditTime")
                                    }
                                  >
                                    <i
                                      className="fa fa-minus"
                                      aria-hidden="true"
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-sm-3 pe-0">
                              <label className="form-label full-width"></label>
                              <input
                                type="text"
                                className="form-control"
                                name="timeSpent"
                                value={
                                  TimeInMinutes > 0 ||
                                    TimeInMinutes == undefined
                                    ? TimeInMinutes
                                    : child.TaskTimeInMin
                                }
                                onChange={(e) => changeTimeFunction(e, "Edit")}
                              />
                            </div>
                            <div className="col-sm-3 ps-0">
                              <label className="form-label full-width"></label>
                              <input
                                className="form-control bg-e9"
                                type="text"
                                value={`${TimeInHours != 0
                                  ? TimeInHours
                                  : child.TaskTime
                                  } Hours`}
                                onChange={(e) =>
                                  setPostData({
                                    ...postData,
                                    TaskTime: e.target.value
                                  })
                                }
                              />
                            </div>
                            <div className="col-sm-6 d-flex justify-content-between align-items-center">
                              <div className="Quaterly-Time">
                                <label className="full_width"></label>
                                <button
                                  className="btn btn-primary"
                                  title="Decrease by 15 Min"
                                  onClick={() =>
                                    changeTimesDecEdit("15", child, "EditTask")
                                  }
                                >
                                  <i
                                    className="fa fa-minus"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                                <span> 15min </span>
                                <button
                                  className="btn btn-primary"
                                  title="Increase by 15 Min"
                                  onClick={() =>
                                    changeTimesEdit("15", child, "EditTask")
                                  }
                                >
                                  <i
                                    className="fa fa-plus"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </div>
                              <div className="pe-0 Full-Time">
                                <label className="full_width"></label>
                                <button
                                  className="btn btn-primary"
                                  title="Decrease by 60 Min"
                                  onClick={() =>
                                    changeTimesDecEdit("60", child, "EditTask")
                                  }
                                >
                                  <i
                                    className="fa fa-minus"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                                <span> 60min </span>
                                <button
                                  className="btn btn-primary"
                                  title="Increase by 60 Min"
                                  onClick={() =>
                                    changeTimesEdit("60", child, "EditTask")
                                  }
                                >
                                  <i
                                    className="fa fa-plus"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-12">
                            <label className="form-label full-width">Short Description</label>
                            <textarea
                              className="full_width"
                              id="AdditionalshortDescription"
                              cols={15}
                              rows={4}
                              defaultValue={child.Description}
                              onChange={(e) =>
                                setPostData({
                                  ...postData,
                                  Description: e.target.value
                                })
                              }
                            ></textarea>
                          </div>
                        </div>
                        <footer>
                          <div className="row mt-2">
                            <div className="col-sm-6 ">
                              <div className="text-left">
                                Created
                                <span>{child.TaskTimeCreatedDate}</span>
                                by{" "}
                                <span className="siteColor">
                                  {child.EditorTitle}
                                </span>
                              </div>
                              <div className="text-left">
                                Last modified
                                <span>{child.TaskTimeModifiedDate}</span>
                                by{" "}
                                <span className="siteColor">
                                  {child.EditorTitle}
                                </span>
                              </div>
                            </div>
                            <div className="col-sm-6 text-end">
                              <a
                                target="_blank"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=${child.ParentID}`}
                              >
                                Open out-of-the-box form
                              </a>
                              <button
                                type="button"
                                className="btn btn-primary ms-2"
                                onClick={() => SaveCopytime(child)}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </footer>
                      </>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })}
      </Panel>

      {/* ----------------------------------------Add Time Popup------------------------------------------------------------------------------------------------------------------------------------- */}

      <Panel
        onRenderHeader={onRenderCustomHeaderAddTaskTime}
        type={PanelType.custom}
        customWidth="850px"
        isOpen={AddTaskTimepopup}
        onDismiss={closeAddTaskTimepopup}
        isBlocking={false}
      >
        <div
          className={
            PortfolioType == "Service"
              ? "modal-body border p-3 serviepannelgreena"
              : "modal-body border p-3"
          }
        >
          <div className="col-sm-12">
            <div className="col-sm-12 p-0 form-group">
              <div className="row">
                <div className="col-sm-6">
                  <div className="date-div">
                    <div className="Date-Div-BAR d-flex">
                      <span
                        className="href"
                        id="selectedYear"
                        onClick={() =>
                          changeDatetodayQuickly(myDatee, "firstdate", "Add")
                        }
                      >
                        1st
                      </span>
                      |{" "}
                      <span
                        className="href"
                        id="selectedYear"
                        onClick={() =>
                          changeDatetodayQuickly(myDatee, "15thdate", "Add")
                        }
                      >
                        15th
                      </span>
                      |{" "}
                      <span
                        className="href"
                        id="selectedYear"
                        onClick={() =>
                          changeDatetodayQuickly(myDatee, "1Jandate", "Add")
                        }
                      >
                        1 Jan
                      </span>
                      |
                      <span
                        className="href"
                        id="selectedToday"
                        onClick={() =>
                          changeDatetodayQuickly(myDatee, "Today", "Add")
                        }
                      >
                        Today
                      </span>
                    </div>
                    <div className="input-group mt-1">
                      <label className="form-label full-width">Date</label>

                      <DatePicker
                        className="form-control"
                        selected={myDatee}
                        onChange={handleDatedue}
                        dateFormat="EEE, dd MMM yyyy"
                      /></div>
                  </div>
                </div>

                <div className="col-sm-6 session-control-buttons">
                  <div className="row">
                    <div className="col-sm-4 ">
                      <button
                        id="DayPlus"
                        className="top-container plus-button plus-minus"
                        onClick={() => changeDate("Date", "AddTime")}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </button>
                      <span className="min-input">Day</span>
                      <button
                        id="DayMinus"
                        className="top-container minus-button plus-minus"
                        onClick={() => changeDateDec("Date", "AddTime")}
                      >
                        <i className="fa fa-minus" aria-hidden="true"></i>
                      </button>
                    </div>

                    <div className="col-sm-4 ">
                      <button
                        id="MonthPlus"
                        className="top-container plus-button plus-minus"
                        onClick={() => changeDate("month", "AddTime")}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </button>
                      <span className="min-input">Month</span>
                      <button
                        id="MonthMinus"
                        className="top-container minus-button plus-minus"
                        onClick={() => changeDateDec("month", "AddTime")}
                      >
                        <i className="fa fa-minus" aria-hidden="true"></i>
                      </button>
                    </div>

                    <div className="col-sm-4">
                      <button
                        id="YearPlus"
                        className="top-container plus-button plus-minus"
                        onClick={() => changeDate("Year", "AddTime")}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </button>
                      <span className="min-input">Year</span>
                      <button
                        id="YearMinus"
                        className="top-container minus-button plus-minus"
                        onClick={() => changeDateDec("year", "AddTime")}
                      >
                        <i className="fa fa-minus" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-3 pe-0">
                  <label className="form-label full-width"></label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    value={TimeInMinutes > 0 ? TimeInMinutes : 0}
                    onChange={(e) => changeTimeFunction(e, "Add")}
                  />
                </div>
                <div className="col-sm-3 ps-0">
                  <label className="form-label full-width"></label>
                  <input
                    className="form-control bg-e9"
                    type="text"
                    value={`${TimeInHours} Hours`}
                  />
                </div>
                <div className="col-sm-6 Time-control-buttons">
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
                    <span> 15min </span>
                    <button
                      className="btn btn-primary"
                      title="Increase by 15 Min"
                      onClick={() => changeTimes("15", "add", "AddTime")}
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
                    <span> 60min </span>
                    <button
                      className="btn btn-primary"
                      title="Increase by 60 Min"
                      onClick={() => changeTimes("60", "add", "AddTime")}
                    >
                      <i className="fa fa-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-sm-12 p-0">
                <label className="form-label full-width">Short Description</label>
                <textarea
                  className="full_width"
                  id="AdditionalshortDescription"
                  cols={15}
                  rows={4}
                  onChange={(e) =>
                    setPostData({ ...postData, Description: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
            <footer>
              <div className="row">
                {/* <div className="col-sm-6 ">
                <div className="text-left">
                    Created
                    <span></span>
                    by <span
                        className="siteColor"></span>
                </div>
                <div className="text-left">
                    Last modified
                    <span></span>
                    by <span
                        className="siteColor"></span>
                </div>
            </div> */}
                <div className="col-sm-12 text-end">
                  <button
                    disabled={TimeInMinutes <= 0 ? true : false}
                    type="button"
                    className="btn btn-primary ms-2"
                    onClick={AddTaskTime}
                  >
                    Save
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </Panel>

      {/* --------------------------------------------------------------------------Start EDit Category------------------------------------------------------------------------------------------- */}

      <Panel
        onRenderHeader={onRenderCustomHeaderEditCategory}
        type={PanelType.custom}
        customWidth="850px"
        isOpen={Editcategory}
        onDismiss={closeEditcategorypopup}
        isBlocking={false}
      >
        <div
          className={
            PortfolioType == "Service"
              ? "modal-body border p-1 serviepannelgreena"
              : "modal-body border p-1"
          }
        >
          <div className="row">
            {categoryData?.map((item) => {
              return (
                <div className="col-sm-9 border-end">
                  <div className="mb-3">
                    <div className=" form-group">
                      <label>Selected Category</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        name="CategoriesTitle"
                        value={
                          checkCategories != undefined
                            ? checkCategories
                            : item.Category.Title
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className=" form-group" key={checkCategories}>
                      <label>Title</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        name="TimeTitle"
                        defaultValue={
                          checkCategories != undefined
                            ? checkCategories
                            : item.Title
                        }
                        onChange={(e) =>
                          setNewData({ ...newData, Title: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="col-sm-3">
              <div className="col mb-2">
                <div className="mb-1">
                  <a className="hreflink" target="_blank">
                    Manage Categories
                  </a>
                </div>
                {TimeSheet.map((Items: any) => {
                  return (
                    <>
                      <div
                        className="SpfxCheckRadio"
                        id="subcategorytasksPriority{{item.Id}}"
                      >
                        <input
                          type="radio"
                          className="redio"
                          value={Items.Title}
                          defaultChecked={Items.Title == Categoryy}
                          onChange={() => setcheckCategories(Items.Title)}
                          name="taskcategory"
                        />
                        <label>{Items.Title}</label>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            PortfolioType == "Service"
              ? "modal-footer mt-2 serviepannelgreena"
              : "modal-footer mt-2"
          }
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={updateCategory}
          >
            Submit
          </button>
        </div>
      </Panel>
    </div>
  );
}

export default TimeEntryPopup;

function myDatee(arg0: any): any {
  throw new Error("Function not implemented.");
}
