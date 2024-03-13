
import * as React from "react";
import { sp, Web } from "sp-pnp-js";
import * as $ from "jquery";
import { Modal, Panel, PanelType } from "office-ui-fabric-react";
import * as Moment from "moment";
import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { ColumnDef } from "@tanstack/react-table";
import "@pnp/sp/lists";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import GlobalCommanTable from "../GroupByReactTableComponents/GlobalCommanTable";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomAlert from "../TimeEntry/CustomAlert";
import Tooltip from "../Tooltip";
import * as globalCommon from "../globalCommon";
import HighlightableCell from "../highlight";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

let AllTimeSpentDetails: any = [];
let CurntUserId = "";
let changeTime: any = 0;
let ParentId: any = "";
let Category: any = "";
let NewCategoryId: any = "";
let Eyd = "";
let changeEdited = "";
let CurrentUserTitle = "";
let CategoriesIdd = "";
let Categoryy = "";
let timesheetMoveData: any = [];
let TaskCate: any = [];
let TimeSheetlistId = "";
let CategryTitle = "";
let CategoryyID: any = "";
let siteUrl = "";
let Flatview: any = false;
let PortfolioType = "";
let listName = "";
let RelativeUrl: any = "";
let CurrentSiteUrl: any = "";
let AllTimeEntry: any = [];
let UserName: any = "";
let backupEdit: any = [];
let AllUsers: any = [];
let TimesheetConfiguration: any = [];
let isShowCate: any = "";
let expendedTrue: any = true;
var change: any = new Date();
var PopupType: any = "";
var PopupTypeCat: any = false;
const SP = spfi();
let AllMetadata: [] = [];

const TimeEntryPopup = (item: any) => {
  if (item?.props?.siteUrl != undefined) {
    //var Url = item?.props?.siteUrl.split("https://hhhhteams.sharepoint.com");
    let index = item?.props?.siteUrl.indexOf('/', 'https://'.length);

    // Extract the substring after the domain
    RelativeUrl = item?.props?.siteUrl.substring(index);
    //RelativeUrl = extractedUrl[1];
    CurrentSiteUrl = item?.props?.siteUrl;
    PortfolioType = item?.props?.Portfolio_x0020_Type;
    CurntUserId = item?.Context?.pageContext?._legacyPageContext.userId;
    CurrentUserTitle =
      item?.Context?.pageContext?._legacyPageContext?.userDisplayName;
  } else {
    PortfolioType = item?.props?.Portfolio_x0020_Type;
    CurntUserId = item?.Context?.pageContext?._legacyPageContext.userId;
    CurrentUserTitle =
      item.Context.pageContext?._legacyPageContext?.userDisplayName;
    RelativeUrl = item?.Context?.pageContext?.web?.serverRelativeUrl;
    CurrentSiteUrl = item?.Context?.pageContext?.web?.absoluteUrl;
  }


  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const [AllTimeSheetDataNew, setTimeSheet] = React.useState([]);
  const [date, setDate] = React.useState(undefined);
  const [showCat, setshowCat] = React.useState([]);
  const [modalTimeIsOpen, setTimeModalIsOpen] = React.useState(false);
  // const [AllMetadata, setMetadata] = React.useState([]);
  const [week, SetWeek] = React.useState(1);
  const [EditTaskItemitle, setEditItem] = React.useState("");
  const [flatview, setFlatview] = React.useState<any>("");
  const [collapseItem, setcollapseItem] = React.useState(true);
  const [search, setSearch]: [string, (search: string) => void] =
    React.useState("");
  const [TaskStatuspopup, setTaskStatuspopup] = React.useState(false);
  const [buttonDisable, setbuttonDisable] = React.useState(false);
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
  const [demoState, setDemoState] = React.useState();
  const [finalData1, setFinalData1] = React.useState([]);
  const [postData, setPostData] = React.useState({
    Title: "",
    TaskDate: "",
    Description: "",
    TaskTime: "",
  });
  const [newData, setNewData] = React.useState({
    Title: "",
    TaskDate: "",
    Description: "",
    TimeSpentInMinute: "",
    TimeSpentInHours: "",
    TaskTime: "",
  });
  const [saveEditTaskTimeChild, setsaveEditTaskTimeChild] = React.useState<any>(
    {}
  );
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
  const toggleDialog = () => setIsAlertVisible(false);
  let smartTermName = "Task" + item.props.siteType;

  // -------------------Load TaskUse------------------------------------------------------------------------------------------

  const GetTaskUsers = async () => {
    let web = new Web(`${CurrentSiteUrl}`);
    let taskUsers = [];
    taskUsers = await web.lists.getByTitle("Task Users").items.top(4999).get();
    AllUsers = taskUsers;
    EditData(item.props);
  };

  //-------------------------check folder of user----------------------------------------------------------------------------------------------

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

  //---------------------------------------Change Date function--------------------------------------------------------------------------------
  const changeDate = (val: any, Type: any) => {
    if (val === "Date") {
      setCount(count + 1);
      var dateeee = change != undefined && change != "" ? change : "";
      change = Moment(dateeee).add(1, "days").format();
      setMyDatee(change);
      var inputDate = new Date(change);
      setMyDatee(inputDate);

      if (Type == "EditTime" || Type == "CopyTime") {
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

      if (Type == "EditTime" || Type == "CopyTime") {
        changeEdited = Moment(editeddata).add(1, "months").format();
        var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy");
        //setediteddata(editaskk)
        var inputDate = new Date(editaskk);
        setediteddata(inputDate);
      }
    }
    if (val === "week") {
      SetWeek(week + 1);
      change = Moment(change).add(1, "week").format();
      setMyDatee(change);
      //setMyDatee(change)
      var inputDate = new Date(change);
      setMyDatee(inputDate);

      if (Type == "EditTime" || Type == "CopyTime") {
        changeEdited = Moment(editeddata).add(1, "week").format();
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

      if (Type == "EditTime" || Type == "CopyTime") {
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

  // -----------------------------------------Decrease Date function-----------------------------------------------------------------------------

  const changeDateDec = (val: any, Type: any) => {
    if (val === "Date") {
      // setCount(count - 1)
      var dateeee = change != undefined && change != "" ? change : "";
      change = Moment(dateeee).add(-1, "days").format();
      setMyDatee(change);
      var inputDate = new Date(change);
      setMyDatee(inputDate);

      if (Type == "EditTime" || Type == "CopyTime") {
        changeEdited = Moment(editeddata).add(-1, "days").format();
        var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy");
        var inputDate = new Date(editaskk);
        setediteddata(inputDate);
      }
    }
    if (val === "week") {
      // setCount(count - 1)
      var dateeee = change != undefined && change != "" ? change : "";
      change = Moment(dateeee).add(-1, "week").format();
      setMyDatee(change);
      var inputDate = new Date(change);
      setMyDatee(inputDate);

      if (Type == "EditTime" || Type == "CopyTime") {
        changeEdited = Moment(editeddata).add(-1, "week").format();
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

      if (Type == "EditTime" || Type == "CopyTime") {
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

      if (Type == "EditTime" || Type == "CopyTime") {
        changeEdited = Moment(editeddata).add(-1, "years").format();
        var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy");
        var inputDate = new Date(editaskk);
        setediteddata(inputDate);
      }
    }
  };

  const changeTimes = (val: any, time: any, type: any) => {
    if (type == "AddTime" || type == "AddTime Category") {
      if (val === "15") {
        changeTime = Number(changeTime);

        changeTime = changeTime + 15;

        if (changeTime != undefined) {
          var TimeInHour: any = changeTime / 60;

          setTimeInHours(TimeInHour.toFixed(2));
        }

        setTimeInMinutes(changeTime);
      }

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
    }
    if ((type == "EditTime" || type == "CopyTime") && val == "15") {
      if (time.TaskTimeInMin != undefined) {
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
      if (time.TaskTimeInMin == undefined) {
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
    if ((type == "EditTime" || type == "CopyTime") && val == "60") {
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
  //-----------------------Edit Category function-----------------------------------------------------------------------------------------------
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

  //----------------------------------Open Main Centralize popup------------------------=====------------------------------------------------------------------

  const openAddTasktimepopup = async (childitem: any, Type: any) => {
    setbuttonDisable(false);
    if (Type == "AddTime") {
      PopupType = "AddTime";
      CategryTitle = "";
      setAddTaskTimepopup(true);
      setTimeInMinutes(0);
      setTimeInHours(0);
      setNewData(undefined);
      SetWeek(1);
      setediteddata(undefined);
      setCount(1);
      change = Moment().format();
      setMonth(1);
      setYear(1);
      changeTime = 0;
      setMyDatee(new Date());
      //setMyDatee(undefined)
      setPostData(undefined);
      ParentId = childitem;

      CategryTitle = childitem.Title;
    }

    if (Type == "EditTime" || Type == "CopyTime") {
      PopupType = Type;
      CategryTitle = "";
      setediteddata(undefined);
      setNewData(undefined);
      setTimeInHours(0);
      setMyDatee(undefined);
      change = Moment().format();
      setTimeInMinutes(0);
      setCount(1);
      setMonth(1);
      SetWeek(1);
      setYear(1);
      changeTime = 0;
      setMyDatee(new Date());
      var dateValue = childitem?.TaskDates?.substring(4);
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
      setAddTaskTimepopup(true);
      // Array.push(childitem)
      setNewData(undefined);
      Childitem.push(childitem);
      backupEdit?.forEach((val: any) => {
        if (val.Id == childitem.MainParentId) {
          CategryTitle = val.Category.Title;
        }
      });
      // setsaveEditTaskTime(Array)
      setsaveEditTaskTimeChild(childitem);
    }
    if (Type == "AddTime Category") {
      setTaskStatuspopup(true);
      await getAllTime();
      PopupType = Type;
      PopupTypeCat = true;
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
      setAddTaskTimepopup(true);
    }
  };
  let dateValue = "";
  var dp = "";
  var Dateet: any = "";

  const closeAddTaskTimepopup = () => {
    setTaskStatuspopup(false);
    PopupTypeCat = false;
    change = Moment().format();
    setMonth(1);
    setYear(1);
    changeTime = 0;
    //setMyDatee(undefined)
    setMyDatee(new Date());
    setPostData(undefined);
    setAddTaskTimepopup(false);
    setcheckCategories(undefined);
    setTimeInHours(0);
    setNewData(undefined);
    setTimeInMinutes(0);
    SetWeek(1);
    setediteddata(undefined);
    setCount(1);
    change = Moment().format();
    setMyDatee(new Date());
    setsaveEditTaskTimeChild({});
  };
  // const closeTaskStatusUpdatePoup = () => {
  //   setTaskStatuspopup(false);
  // };
  const changeTimesDec = (items: any, time: any, type: any) => {
    if (type == "CopyTime") {
      type = "EditTime";
    }
    if (type == "AddTime Category") {
      type = "AddTime";
    }
    if (type == "AddTime") {
      if (items === "15") {
        changeTime = Number(changeTime);
        changeTime = changeTime - 15;

        if (changeTime < 0) {
          alert(
            "The value you entered is negative, and negative entries are not allowed"
          );
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
          alert(
            "The value you entered is negative, and negative entries are not allowed"
          );
          changeTime = 0;
        }
        if (changeTime != undefined) {
          var TimeInHour: any = changeTime / 60;

          setTimeInHours(TimeInHour.toFixed(2));
        }

        setTimeInMinutes(changeTime);
      }
    }
    if (type == "EditTime") {
      changeTime = Number(changeTime);
      if (type === "EditTime" && items === "15") {
        changeTime = Number(changeTime);
        if (changeTime == 0) {
          changeTime = time.TaskTimeInMin - 15;
        } else {
          changeTime = changeTime - 15;
        }

        if (changeTime != undefined) {
          if (changeTime <= 0) {
            alert(
              "The value you entered is negative so the filled time will be set to default beforehand"
            );
            changeTime = 0;
          }
          var TimeInHour: any = changeTime / 60;
          setTimeInHours(TimeInHour.toFixed(2));
        }
        setTimeInMinutes(changeTime);
      }
      if (type === "EditTime" && items === "60") {
        changeTime = Number(changeTime);
        if (changeTime == 0) {
          //alert('The value you entered is negative so the filled time will be set to default beforehand')
          changeTime = time.TaskTimeInMin - 60;
        } else {
          changeTime = changeTime - 60;
        }

        if (changeTime != undefined) {
          if (changeTime <= 0) {
            alert(
              "The value you entered is negative so the filled time will be set to default beforehand"
            );
            changeTime = 0;
          }
          var TimeInHour: any = changeTime / 60;
          setTimeInHours(TimeInHour.toFixed(2));
        }
        setTimeInMinutes(changeTime);
      }
    }
  };

  //----------------------------------Show All Category function---------------------------------------------------------------------------------------

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
    console.log("Result", res);
    res.map((item: any) => {
      if (item.TaxType === "TimesheetCategories") {
        TimeSheet.push(item);
      }
    });

    TimeSheet.forEach((val: any) => {
      if (val.Parent?.Title == "Components") {
        newArray.push(val);
      }

      setTimeSheets(newArray);
      console.log("TTTTTT", TimeSheet);
    });
  };
  const selectCategories = (e: any, Title: any) => {
    const target = e.target;
    if (target.checked) {
      setcheckCategories(Title);
      setshowCat(Title);
    }
  };
  // const selectCategories = (e: any, Title: any) => {
  //   const target = e.target;
  //   if (target.checked) {

  //     if (!checkCategories.includes(Title)) {
  //       setcheckCategories([...checkCategories, Title]);
  //     }
  //     setshowCat(Title);
  //   }
  // };
  React.useEffect(() => {
    GetTimeSheet();
    GetSmartMetadata();
  }, [updateData, updateData2]);

  //----------------------------------------Load Dynamic Lists----------------------------------------------------------------------------------------

  const GetSmartMetadata = async () => {
    let web = new Web(`${CurrentSiteUrl}`);
    let MetaData = [];
    MetaData = await web.lists
      .getByTitle("SmartMetadata")
      .items.top(4999)
      .get();
    AllMetadata = MetaData;
    MetaData.forEach((itemss: any) => {
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

  //------------------------------------*** Bind data function ***--------------------------------------------------------------------------------------------------

  const getStructureData = function () {
    TaskCate = AllTimeSpentDetails;

    AllTimeSpentDetails?.map((item: any) => {
      if (item?.subRows != undefined && item?.subRows?.length > 0) {
        item?.subRows.map((value: any) => {
          if (value?.Status != undefined) {
            if (value?.Status == "Draft") {
              value.lableColor = "yellowForTimeSheet"
            }
            else if (value?.Status == "Rejected") {
              value.lableColor = "redForTimeSheet"
            }
            else if (value?.Status == "Approved") {
              value.lableColor = 'greenForTimeSheet'
            }
            else if (value?.Status == "For Approval") {
              value.lableColor = "blueForTimeSheet"
            }
          }
        })
      }
    })

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
            val.sortTaskDate = NewDate;
            val.TaskDates = Moment(NewDate).format("ddd, DD/MM/YYYY");
            if (
              (val.TaskTimeInMin == 0 || val?.TaskTimeInMin == undefined) &&
              val?.TaskTime != undefined
            ) {
              val.TaskTimeInMin = val?.TaskTime * 60;
            }
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

    let finalData: any = {};

    $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
      if (items.subRows != undefined && items.subRows.length > 0) {
        $.each(items.subRows, function (index: any, child: any) {
          const title = child.Title;
          if (!finalData[title]) {
            finalData[title] = [child];
          } else {
            const existingEntry = finalData[title][0];

            if (compareEntries(existingEntry, child)) {
              existingEntry.subRows.push(...child.subRows);
            } else {
              finalData[title].push(child);
            }
          }
        });
      }
    });

    const mergedFinalData: any[] = [];
    for (const key in finalData) {
      if (finalData.hasOwnProperty(key)) {
        mergedFinalData.push(...finalData[key]);
      }
    }

    function compareEntries(entry1: any, entry2: any): boolean {
      // Customize this function to compare entries based on your data structure
      return entry1.Title === entry2.Title;
    }

    console.log("mergedFinalData", mergedFinalData);
    console.log(
      "TaskTimeSheetCategoriesGrouping",
      TaskTimeSheetCategoriesGrouping
    );

    backupEdit = mergedFinalData;
    setData(mergedFinalData);
    console.log("finalData", finalData);
    setBackupData(mergedFinalData);
    setTimeSheet(TaskTimeSheetCategoriesGrouping);

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

  // ---------------------------------------------------- Changing Task Status------------------------------------------------------------------------------


  const sendForApproval = async (child: any) => {
    var UpdatedData: any = [];
    if (child.AuthorId == CurntUserId) {


      $.each(TaskCate, function (index: any, update: any) {
        if (update.Id === child.ParentID && update.AuthorId == CurntUserId) {
          $.each(update.AdditionalTime, function (index: any, updateitem: any) {
            isTimes = true;
            if (updateitem.ID === child.ID) {
              updateitem.Id = child.ID;
              updateitem.TaskTime = child.TaskTime;
              updateitem.TaskTimeInMin = child.TaskTimeInMin;
              updateitem.TaskDate = child.TaskDate;
              updateitem.Description = child?.Description;
              updateitem.Status = 'For Approval';
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

      await web.lists
        .getById(ListId)
        .items.getById(child.ParentID)
        .update({
          AdditionalTimeEntry: JSON.stringify(UpdatedData),
        })
        .then((res: any) => {
          console.log(res);

          closeAddTaskTimepopup();
          setupdateData(updateData + 1);
        });
    }
    else {
      alert('You are only permitted to submit your own timesheet for approval. Please ensure to send your timesheet for approval')
    }

  }
  // -------------------------------------------------------CHANGE STATUS COLOR FUNCTION ------------------------------------------------------------
  const getStatusClassName = (status: any) => {
    switch (status) {
      case "Draft":
        return "svg__iconbox svg__icon--forApproval hreflink";
      case "Rejected":
        return "svg__iconbox svg__icon--forApproval hreflink";
      default:
        return "svg__iconbox svg__icon--forApproval Disabled-Link";
    }
  };


  //------------------------------------------------------Load Timesheet Data-----------------------------------------------------------------------------
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
        type: "SP.Data.SmartMetadataListItem",
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
      ID: 319,
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

    if (items.siteType == "Offshore Tasks" || items.siteType == "SharewebQA") {
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
          Url: `${CurrentSiteUrl}/_api/web/lists/getById('${TimeSheetlistId}')/items?$select=${select}`,
        },
      ];
    } else {
      //var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },
      var allurls = [
        {
          Url: `${CurrentSiteUrl}/_api/web/lists/getById('${TimeSheetlistId}')/items?$select=${select}`,
        },
      ];
    }
    $.each(allurls, async function (index: any, item: any) {
      await $.ajax({
        url: item.Url,

        method: "GET",

        headers: {
          Accept: "application/json; odata=verbose",
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
                    if (taskUser?.ApproverId?.length > 0) {
                      UpdatedData["IsApprover"] = true;
                    } else {
                      UpdatedData["IsApprover"] = false;
                    }
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
                let TimeSheetStatus: string = '';
                if (UpdatedData.IsApprover) {
                  TimeSheetStatus = "Draft"
                } else {
                  TimeSheetStatus = ""
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
                update["Status"] = TimeSheetStatus;
                update["ID"] = 0;
                update["MainParentId"] = mainParentId;
                update["ParentID"] = NewParentId;
                update["TaskTime"] = TimeInH;
                update["TaskTimeInMin"] = TimeInMinutes;
                update["TaskDate"] = Moment(Datee).format("DD/MM/YYYY");
                update["Description"] = postData?.Description;
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
                    TimesheetTitleId: mainParentId,
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

              item.isShifted = false;
            });

            getStructureData();
          }
        },
      });
    });
  };

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
      ...TaskTimeSheetCategoriesGrouping,
    ]);
  };

  //-----------------------------------------Delete Timesheet function----------------------------------------------------------------------------------

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
          AdditionalTimeEntry: JSON.stringify(UpdatedData),
        })
        .then((res: any) => {
          console.log(res);
          setupdateData(updateData + 1);
        });
    }
  };

  var isTimes = false;
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

  // ------------------------------------Create Folder of user-----------------------------------------------------------------------------
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
        ContentTypeId: "0x0120",
      })
      .then(async (res) => {
        const lists = sp.web.lists.getByTitle(ListId);
        await lists.items
          .getById(res.data.Id)
          .update({
            Title: folderName,
            FileLeafRef: folderNames,
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
      CategoryId: Category,
      // 'Path': `${RelativeUrl}/Lists/${listName}/${UpdatedData.Company}`
    };

    let newdata = await web.lists
      .getByTitle(listNames)
      .items.add({ ...itemMetadataAdded });
    console.log("New Data", newdata);

    let movedata = await web
      .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
      .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
    console.log(movedata);
    mainParentId = newdata.data.Id;
    mainParentTitle = newdata.data.Title;
    createItemforNewUser(LetestFolderID);
  };

  // ----------------------------------------------------------Save Timesheet for old user----------------------------------------------------------------------

  const saveOldUserTask = async (UpdatedData: any) => {
    var Available = false;
    var TimeInHours: any = changeTime / 60;
    TimeInHours = TimeInHours.toFixed(2);

    if (AllTimeSpentDetails == undefined) {
      var AllTimeSpentDetails: any = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    TimeSheet.map((items: any) => {
      if (items.Title == checkCategories) {
        Category = items.Id;
      }
    });

    function findCategoryById(data: any, categoryId: any): any | null {
      let foundCategoryId: any = null;

      data.forEach((categoryData: { Id: any; Category: { Id: any } }) => {
        if (categoryData.Category.Id === categoryId) {
          foundCategoryId = categoryData.Id;
        }
      });

      return foundCategoryId;
    }

    const foundCategory = findCategoryById(data, Category);
    console.log(foundCategory, "foundCategory");
    console.log("UP DATA", UpdatedData);
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
          if (foundCategory) {
            mainParentId = foundCategory;
            mainParentTitle = checkCategories;
            createItemMainList();
          } else {
            let itemMetadataAdded = {
              Title:
                newData != undefined &&
                  newData.Title != undefined &&
                  newData.Title != ""
                  ? newData.Title
                  : checkCategories,

              [smartTermId]: item.props.Id,
              CategoryId: Category,
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
            if (movedata != undefined) {
              mainParentId = newdata.data.Id;
              mainParentTitle = newdata.data.Title;
              createItemMainList();
            }
          }
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

  //---------------------------------------------------------------Save Timesheet Main function----------------------------------------------------------------------
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
      closeAddTaskTimepopup();
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
        setIsAlertVisible(true);
      }
    }

    //--------------------------------End Post----------------------------------------------------------------
  };

  //-------------------------------------------------Create Timesheet in folder----------------------------------------------------------------------------------
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
      CategoryId: Category,
    };
    //First Add item on top
    let newdata = await web.lists
      .getByTitle(listName)
      .items.add({ ...itemMetadataAdded });
    console.log("New Data", newdata);

    let movedata = await web
      .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
      .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
    console.log(movedata);

    if (movedata != undefined) {
      NewParentId = newdata.data.Id;
      NewParentTitle = newdata.data.Title;
      NewCategoryId = newdata.data.CategoryId;
      AllTimeEntry = [];
      EditData(item.props);
    }
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
      CategoryId: Category,
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

  //-----------------------------------------------Create Add Timesheet--------------------------------------------------------------------------------------
  const AddTaskTime = async (child: any, Type: any) => {
    setbuttonDisable(true);

    if (Type == "EditTime") {
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

              updateitem.Description = child?.Description;
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
            AdditionalTimeEntry: JSON.stringify(UpdatedData),
          })
          .then((res: any) => {
            console.log(res);

            closeAddTaskTimepopup();
            setupdateData(updateData + 1);
          });
      }
    }
    if (Type == "CopyTime") {
      var CurrentUser: any = {};

      var counts = 0;
      var update: any = {};
      var TimeInMinute: any = changeTime / 60;
      var UpdatedData: any = [];
      var AddParent: any = "";
      var AddMainParent: any = "";
      $.each(AllUsers, function (index: any, taskUser: any) {
        if (taskUser.AssingedToUserId === CurntUserId) {
          if (taskUser?.ApproverId?.length > 0) {
            CurrentUser["IsApprover"] = true;
          } else {
            CurrentUser["IsApprover"] = false;
          }
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
            let TimeSheetStatus: string = '';
            if (CurrentUser?.IsApprover) {
              TimeSheetStatus = "Draft"
            } else {
              TimeSheetStatus = "";
            }
            update["AuthorName"] = CurrentUser.AuthorName;
            update["AuthorImage"] = CurrentUser.AuthorImage;
            update["ID"] = timeSpentId.ID + 1;
            update["AuthorId"] = CurntUserId;
            update["MainParentId"] = AddMainParent;
            update["ParentID"] = AddParent;
            update["Status"] = TimeSheetStatus;
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
            update["Description"] = child?.Description;
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
            AdditionalTimeEntry: JSON.stringify(UpdatedData),
          })
          .then((res: any) => {
            console.log(res);

            closeAddTaskTimepopup();
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
    }
    if (Type == "AddTime") {
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
          if (taskUser?.ApproverId?.length > 0) {
            CurrentUser["IsApprover"] = true;
          } else {
            CurrentUser["IsApprover"] = false;
          }
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
          let TimeSheetStatus: string = '';
          if (CurrentUser?.IsApprover) {
            TimeSheetStatus = "Draft"
          } else {
            TimeSheetStatus = "";
          }
          update["AuthorName"] = CurrentUser.AuthorName;
          update["AuthorId"] = CurntUserId;
          update["Status"] = TimeSheetStatus;
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
          update["Status"] = "Draft";
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
            AdditionalTimeEntry: JSON.stringify(finalData),
          })
          .then((res: any) => {
            console.log(res);

            setupdateData(updateData + 1);
          });
      }

      closeAddTaskTimepopup();

      if (CurrentUserData?.length == countss && isTrueTime == false) {
        saveJsonDataAnotherCat(CurrentUser, ParentId);
      }
    }
  };

  //-------------------------------------------------Add JSON Data in Another category--------------------------------------------------------------------------
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
      CategoryId: items.Category.Id,
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
    update["Status"] = "Draft";
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
        TimesheetTitleId: items.Id,
      })
      .then((res: any) => {
        console.log(res);

        closeAddTaskTimepopup();
        setupdateData(updateData + 1);
        //setAdditionalTime({ ...AdditionalTime })
      });
  };

  //-----------------------------------------------Copy Data function-------------------------------------------------------------------------------------------
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
      CategoryId: items.Category.Id,
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
        TimesheetTitleId: items.TimesheetTitle.Id,
      })
      .then((res: any) => {
        console.log(res);

        closeAddTaskTimepopup();
        setupdateData(updateData + 1);
        //setAdditionalTime({ ...AdditionalTime })
      });
  };

  //---------------------------------------------------Delete category------------------------------------------------------------------------------------------
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
          Category != undefined && Category != "" ? Category : CategoriesIdd,
      })
      .then((res: any) => {
        console.log(res);

        closeEditcategorypopup((e: any) => e);
        setupdateData(updateData + 1);
      });
  };

  //-----------------------------header of Main popup-----------------------------------------------------------------------------------------------------
  const onRenderCustomHeaderAddTaskTime = () => {
    return (
      <>
        <div className="subheading">
          {PopupType} - {item?.props?.Title}
        </div>
        <Tooltip ComponentId="1753" />
      </>
    );
  };

  //----------------------------------------------Header of Edit category popup------------------------------------------------------------------------------
  const onRenderCustomHeaderEditCategory = () => {
    return (
      <>
        <div className="subheading">Edit Category</div>
        <Tooltip ComponentId="1753" />
      </>
    );
  };

  //--------------------------------------Change time by custom button-----------------------------------------------------------------------------
  const changeTimeFunction = (e: any, type: any) => {
    let changeTime: any = e.target.value;

    if (type === "Add") {
      if (changeTime !== undefined) {
        const timeInHour: any = changeTime / 60;
        setTimeInHours(timeInHour.toFixed(2));
      }

      setTimeInMinutes(changeTime);
    }

    if (type === "Edit") {
      if (changeTime > 0) {
        if (changeTime !== undefined) {
          const timeInHour: any = changeTime / 60;
          setTimeInHours(timeInHour.toFixed(2));
        }
        setTimeInMinutes(changeTime);
      } else {
        setTimeInMinutes(undefined);
        setTimeInHours(0);
      }
    }
  };

  //--------------------------------------------Change Date by custom button--------------------------------------------------------------------------------
  const changeDatetodayQuickly = (date: any, type: any, Popup: any) => {
    if (Popup == "EditTime" || Popup == "CopyTime") {
      var newDate: any = Moment(date).format("DD/MM/YYYY");
      if (type == "firstdate") {
        var a1 = newDate.split("/");
        a1[0] = "01";
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        //setMyDatee(finalDate)
        setediteddata(change);
      }
      if (type == "15thdate") {
        var a1 = newDate.split("/");
        a1[0] = "15";
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        // setMyDatee(finalDate)
        setediteddata(change);
      }
      if (type == "1Jandate") {
        var a1 = newDate.split("/");
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
      if (type == "1Jul") {
        var a1 = newDate.split("/");
        a1[1] = "07";
        a1[0] = "01";
        a1 = a1[2] + a1[1] + a1[0];
        var finalDate = Moment(a1).format("ddd, DD MMM yyyy");
        change = new window.Date(finalDate);
        //setMyDatee(finalDate)
        setediteddata(change);
      }
    }
    if (Popup == "AddTime" || Popup == "AddTime Category") {
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
      if (type == "1Jul") {
        var newStartDate: any = Moment(date).format("DD/MM/YYYY");
        var a1 = newStartDate.split("/");
        a1[1] = "07";
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

  const handleDatedue = (date: any) => {
    change = new window.Date(date);
    var NewDate: any = new window.Date(date);
    // var FinalDate = moment(NewDate).format("ddd, DD MMM yyyy")
    setMyDatee(NewDate);
    //setMyDatee(NewDate)
    setediteddata(NewDate);
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
  // -------------------------------------------------------CHANGE STATUS COLOR FUNCTION ------------------------------------------------------------
  // const getStatusClassName = (status:any) => {
  //   switch (status) {
  //     case "Draft":
  //       return "svg__iconbox svg__icon--forApproval hreflink"; 
  //     case "Rejected":
  //       return "svg__iconbox svg__icon--forApproval hreflink"; 
  //     default:
  //       return "svg__iconbox svg__icon--forApproval Disabled-Link"; 
  //   }
  // };

  //------------------------------------------------------------Define columns-----------------------------------------------------------------------------
  const column = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        hasCustomExpanded: true,
        hasExpanded: true,
        size: 20,
        margin: 0,
        id: "Id",
      },

      {
        accessorFn: (row) => row?.AuthorName,
        id: "AuthorName",
        placeholder: "AuthorName",
        header: "",
        size: 340,
        cell: ({ row }) => (
          <>
            <span  >
              <div className="d-flex" >
                <>
                  {row?.original?.show === true ? (
                    <span>
                      {row?.original?.AuthorImage != "" &&
                        row?.original.AuthorImage != null ? (
                        <span>
                          <a
                            href={`${CurrentSiteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.AuthorId}&Name=${row?.original?.AuthorTitle}`}
                            target="_blank"
                            data-interception="off"
                            title={row?.original?.AuthorTitle}
                          >
                            <img
                              className="AssignUserPhoto1 bdrbox m-0 wid29"
                              title={row?.original.AuthorName}
                              data-toggle="popover"
                              data-trigger="hover"
                              src={row?.original?.AuthorImage}
                            ></img>
                          </a>
                        </span>
                      ) : (
                        <>
                          {" "}
                          <span>
                            <a
                              href={`${CurrentSiteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original.AuthorId}&Name=${row?.original.AuthorTitle}`}
                              target="_blank"
                              data-interception="off"
                              title={row?.original.AuthorTitle}
                            >
                              <img
                                className="AssignUserPhoto1 bdrbox m-0 wid29"
                                title={row?.original.AuthorName}
                                data-toggle="popover"
                                data-trigger="hover"
                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"
                              ></img>
                            </a>
                          </span>
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
                        title="Edit"
                        className="svg__iconbox svg__icon--edit"
                        onClick={() => Editcategorypopup(row.original)}
                      ></span>
                      <span
                        title="Delete"
                        className="svg__iconbox svg__icon--trash hreflink"
                        onClick={() => deleteCategory(row.original)}
                      ></span>
                    </>
                  )}
                </>
              </div>
            </span>
          </>
        ),
      },

      {
        accessorFn: (row) => row?.sortTaskDate,
        cell: ({ row, column }) => (
          <div className="alignCenter"  >
            {row?.original?.Created == null ? (
              ""
            ) : (
              <>
                <HighlightableCell
                  value={row?.original?.TaskDates}
                  searchTerm={
                    column.getFilterValue() != undefined
                      ? column.getFilterValue()
                      : null
                  }
                />
              </>
            )}
          </div>
        ),
        id: "Created",
        resetColumnFilters: false,
        resetSorting: false,
        placeholder: "Created",
        filterFn: (row: any, columnName: any, filterValue: any) => {
          if (row?.original?.TaskDates?.toLowerCase()?.includes(filterValue)) {
            return true;
          } else {
            return false;
          }
        },
        header: "",
        size: 125,
      },
      {
        accessorFn: (row) => row?.TaskTime,
        cell: ({ row }) => (
          <>
            <div className="text-center">{row?.original?.TaskTime}</div>
          </>
        ),
        id: "TaskTime",
        resetColumnFilters: false,
        placeholder: "TaskTime",
        header: "",
        size: 95,
      },

      {
        accessorKey: "Description",
        placeholder: "Description",
        header: "",

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
                  onClick={() => openAddTasktimepopup(row.original, "AddTime")}
                >
                  Add Time{" "}
                  <span className="bg-light m-0  ms-1 p-0 svg__icon--Plus svg__iconbox"></span>
                </button>
              </span>
            ) : (

              <>
                {row?.original?.Status == undefined || row?.original?.Status == '' ?
                  <>
                    <span title="Copy"
                      className="svg__iconbox svg__icon--copy"
                      onClick={() => openAddTasktimepopup(row.original, "CopyTime")}
                    ></span>
                    <span
                      title="Edit"
                      className="svg__iconbox svg__icon--edit hreflink"
                      onClick={() =>
                        openAddTasktimepopup(row?.original, "EditTime")
                      }
                    ></span>
                    <span
                      title="Delete"
                      className="svg__icon--trash hreflink  svg__iconbox"
                      onClick={() => deleteTaskTime(row.original)}
                    ></span>
                  </>
                  :
                  <>
                    {row?.original?.Status === "Draft" ||
                      row?.original?.Status === "Rejected" ?
                      <>
                        <span
                          title="Send For Approval"
                          className="svg__iconbox svg__icon--forApproval hreflink"
                          onClick={() =>
                            sendForApproval(row?.original)
                          }
                        ></span>
                        <span title="Copy"
                          className="svg__iconbox svg__icon--copy"
                          onClick={() => openAddTasktimepopup(row.original, "CopyTime")}
                        ></span>
                      </>
                      : null}
                    {" "}


                    {row?.original?.Status === "Approved" || row?.original?.Status === "For Approval" || row?.original?.Status === ""
                      ? null :
                      <> <span
                        title="Edit"
                        className="svg__iconbox svg__icon--edit hreflink"
                        onClick={() =>
                          openAddTasktimepopup(row?.original, "EditTime")
                        }
                      ></span>
                        <span
                          title="Delete"
                          className="svg__icon--trash hreflink  svg__iconbox"
                          onClick={() => deleteTaskTime(row.original)}
                        ></span> </>}
                  </>
                }
              </>
            )}
          </div>
        ),
      },
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    onClick={(e: any) => flatviewOpen(e)}
                  />
                  FlatView
                </div>
                <a
                  className="mr-0 btn  btn-default"
                  onClick={() =>
                    openAddTasktimepopup("MyData", "AddTime Category")
                  }
                >
                  + Add New Structure
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------Show Table of Timesheet------------------------------------------------------------------------------- */}
      {collapseItem && (
        <div className="togglecontent clearfix mb-2">
          <div id="forShowTask" className="pt-0">
            <div className="Alltable">
              <div className="col-sm-12 p-0 smart">
                <div>
                  <div className="AllTime timentrytb">
                    {data && (
                      <GlobalCommanTable
                        columns={column}
                        data={data}
                        callBackData={callBackData}
                        expendedTrue={expendedTrue}
                      />
                    )}

                    {/* {TaskCate.length === 0 && (
                      <div className="text-center pb-3">
                        No Timesheet Available
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------Add Time Popup------------------------------------------------------------------------------------------------------------------------------------- */}

      <Panel
        onRenderHeader={onRenderCustomHeaderAddTaskTime}
        type={PanelType.custom}
        customWidth={PopupTypeCat == true ? "700px" : "550px"}
        isOpen={AddTaskTimepopup}
        onDismiss={closeAddTaskTimepopup}
        isBlocking={false}
      >
        <div
          className={
            PortfolioType == "Service"
              ? "modal-body  p-1 serviepannelgreena"
              : "modal-body  p-1"
          }
        >
          <div className="row">
            <div className={PopupTypeCat == true ? "col-sm-9" : "col-sm-12"}>
              <div className="col-sm-12 p-0 form-group">
                {PopupTypeCat == true ? (
                  <>
                    <div className="mb-1">
                      <div className="input-group">
                        <label className="form-label full-width">
                          Selected Category
                        </label>
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
                  </>
                ) : (
                  <div className="input-group mb-2">
                    <label className="full-width">Title</label>
                    <input
                      className="form-control"
                      type="title"
                      placeholder="Add Title"
                      disabled={true}
                      defaultValue={CategryTitle}
                    />
                  </div>
                )}

                <div className="row mb-2">
                  <div className="col-sm-12">
                    <div className="date-div">
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="date-div">
                            <label className="form-label full-width mb-2">
                              Select date
                            </label>
                            <div className="Date-Div-BAR d-flex mb-2">
                              <span
                                className="href"
                                id="selectedToday"
                                onClick={() =>
                                  changeDatetodayQuickly(
                                    PopupType == "EditTime" ||
                                      PopupType == "CopyTime"
                                      ? editeddata != undefined
                                        ? editeddata
                                        : myDatee
                                      : myDatee,
                                    "1Jul",
                                    PopupType
                                  )
                                }
                              >
                                1 Jul
                              </span>
                              |
                              <span
                                className="href"
                                id="selectedYear"
                                onClick={() =>
                                  changeDatetodayQuickly(
                                    PopupType == "EditTime" ||
                                      PopupType == "CopyTime"
                                      ? editeddata != undefined
                                        ? editeddata
                                        : myDatee
                                      : myDatee,
                                    "firstdate",
                                    PopupType
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
                                    PopupType == "EditTime" ||
                                      PopupType == "CopyTime"
                                      ? editeddata != undefined
                                        ? editeddata
                                        : myDatee
                                      : myDatee,
                                    "15thdate",
                                    PopupType
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
                                    PopupType == "EditTime" ||
                                      PopupType == "CopyTime"
                                      ? editeddata != undefined
                                        ? editeddata
                                        : myDatee
                                      : myDatee,
                                    "1Jandate",
                                    PopupType
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
                                    PopupType == "EditTime" ||
                                      PopupType == "CopyTime"
                                      ? editeddata != undefined
                                        ? editeddata
                                        : myDatee
                                      : myDatee,
                                    "Today",
                                    PopupType
                                  )
                                }
                              >
                                Today
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* <div className="col-sm-6  session-control-buttons">
                          <div className="row">
                            <div className="col-sm-4 ">
                              <button
                                id="DayPlus"
                                className="top-container plus-button plus-minus"
                                onClick={() => changeDate("Date", PopupType)}
                              >
                                <i className="fa fa-plus" aria-hidden="true"></i>
                              </button>
                              <span className="min-input">Day</span>
                              <button
                                id="DayMinus"
                                className="top-container minus-button plus-minus"
                                onClick={() => changeDateDec("Date", PopupType)}
                              >
                                <i className="fa fa-minus" aria-hidden="true"></i>
                              </button>
                            </div>

                            <div className="col-sm-4 ">
                              <button
                                id="MonthPlus"
                                className="top-container plus-button plus-minus"
                                onClick={() => changeDate("month", PopupType)}
                              >
                                <i className="fa fa-plus" aria-hidden="true"></i>
                              </button>
                              <span className="min-input">Month</span>
                              <button
                                id="MonthMinus"
                                className="top-container minus-button plus-minus"
                                onClick={() =>
                                  changeDateDec("month", PopupType)
                                }
                              >
                                <i className="fa fa-minus" aria-hidden="true"></i>
                              </button>
                            </div>

                            <div className="col-sm-4 ">
                              <button
                                id="YearPlus"
                                className="top-container plus-button plus-minus"
                                onClick={() => changeDate("Year", PopupType)}
                              >
                                <i className="fa fa-plus" aria-hidden="true"></i>
                              </button>
                              <span className="min-input">Year</span>
                              <button
                                id="YearMinus"
                                className="top-container minus-button plus-minus"
                                onClick={() => changeDateDec("year", PopupType)}
                              >
                                <i className="fa fa-minus" aria-hidden="true"></i>
                              </button>
                            </div>
                          </div>
                        </div> */}
                      </div>
                      <div className="input-group">
                        <div className="d-flex w-100 mb-1">
                          <button
                            className="btnCol btn-primary px-2"
                            title="Minus one month"
                            onClick={() => changeDateDec("month", PopupType)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="58"
                              height="32"
                              viewBox="0 0 65 37"
                              fill="#fff"
                            >
                              <line
                                x1="35.0975"
                                y1="19.9826"
                                x2="52.7924"
                                y2="2.29386"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="52.9436"
                                y1="34.5654"
                                x2="35.2546"
                                y2="16.8708"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="18.7682"
                                y1="19.9826"
                                x2="36.4631"
                                y2="2.29386"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="36.6143"
                                y1="34.5654"
                                x2="18.9252"
                                y2="16.8708"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="2.43884"
                                y1="19.9826"
                                x2="20.1337"
                                y2="2.29386"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="20.2849"
                                y1="34.5654"
                                x2="2.5959"
                                y2="16.8708"
                                stroke="#fff"
                                stroke-width="5"
                              />
                            </svg>
                          </button>
                          <button
                            className="btnCol btn-primary mx-1"
                            title="Minus one week"
                            onClick={() => changeDateDec("week", PopupType)}
                          >
                            <MdKeyboardDoubleArrowLeft></MdKeyboardDoubleArrowLeft>
                          </button>
                          <button
                            className="btnCol btn-primary mx-1"
                            title="Minus one day"
                            onClick={() => changeDateDec("Date", PopupType)}
                          >
                            <MdKeyboardArrowLeft></MdKeyboardArrowLeft>
                          </button>
                          <DatePicker
                            className="form-control"
                            selected={
                              PopupType == "EditTime" || PopupType == "CopyTime"
                                ? editeddata != undefined
                                  ? editeddata
                                  : myDatee
                                : myDatee
                            }
                            onChange={handleDatedue}
                            dateFormat="EEE, dd MMM yyyy"
                          />
                          <button
                            onClick={() => changeDate("Date", PopupType)}
                            title="Plus one day"
                            className="btnCol btn-primary mx-1"
                          >
                            <MdKeyboardArrowRight></MdKeyboardArrowRight>
                          </button>
                          <button
                            className="btnCol btn-primary mx-1"
                            title="Plus one week"
                            onClick={() => changeDate("week", PopupType)}
                          >
                            <MdKeyboardDoubleArrowRight></MdKeyboardDoubleArrowRight>
                          </button>
                          <button
                            className="btnCol btn-primary px-2"
                            title="Plus one month"
                            onClick={() => changeDate("month", PopupType)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="58"
                              height="32"
                              viewBox="0 0 65 37"
                              fill="#fff"
                            >
                              <line
                                x1="23.0121"
                                y1="16.6118"
                                x2="5.31719"
                                y2="34.3006"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="5.16599"
                                y1="2.02901"
                                x2="22.855"
                                y2="19.7236"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="39.3414"
                                y1="16.6118"
                                x2="21.6465"
                                y2="34.3006"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="21.4953"
                                y1="2.02901"
                                x2="39.1844"
                                y2="19.7236"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="55.6708"
                                y1="16.6118"
                                x2="37.9759"
                                y2="34.3006"
                                stroke="#fff"
                                stroke-width="5"
                              />
                              <line
                                x1="37.8247"
                                y1="2.02901"
                                x2="55.5137"
                                y2="19.7236"
                                stroke="#fff"
                                stroke-width="5"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-3">
                    <label className="form-label full-width">
                      Add task time
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      value={
                        TimeInMinutes > 0
                          ? TimeInMinutes
                          : saveEditTaskTimeChild?.TaskTimeInMin != undefined
                            ? saveEditTaskTimeChild.TaskTimeInMin
                            : 0
                      }
                      onChange={(e) => changeTimeFunction(e, PopupType)}
                    />
                  </div>
                  <div className="col-sm-3">
                    <label className="form-label full-width"></label>
                    <input
                      className="form-control bg-e9"
                      type="text"
                      value={`${TimeInHours > 0
                        ? TimeInHours
                        : saveEditTaskTimeChild?.TaskTime != undefined
                          ? saveEditTaskTimeChild?.TaskTime
                          : 0
                        } Hours`}
                    />
                  </div>
                  <div className="col-sm-6 Time-control-buttons">
                    <div className="pe-0 Quaterly-Time">
                      <label className="full_width"></label>
                      <button
                        className="btn btn-primary"
                        title="Decrease by 15 Min"
                        disabled={
                          PopupType == "AddTime" && TimeInMinutes <= 0
                            ? true
                            : false
                        }
                        onClick={() =>
                          changeTimesDec("15", saveEditTaskTimeChild, PopupType)
                        }
                      >
                        <i className="fa fa-minus" aria-hidden="true"></i>
                      </button>
                      <span> 15min </span>
                      <button
                        className="btn btn-primary"
                        title="Increase by 15 Min"
                        onClick={() =>
                          changeTimes("15", saveEditTaskTimeChild, PopupType)
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
                        disabled={
                          PopupType == "AddTime" && TimeInMinutes <= 0
                            ? true
                            : false
                        }
                        onClick={() =>
                          changeTimesDec("60", saveEditTaskTimeChild, PopupType)
                        }
                      >
                        <i className="fa fa-minus" aria-hidden="true"></i>
                      </button>
                      <span> 60min </span>
                      <button
                        className="btn btn-primary"
                        title="Increase by 60 Min"
                        onClick={() =>
                          changeTimes("60", saveEditTaskTimeChild, PopupType)
                        }
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 p-0">
                  <label className="form-label full-width">
                    Short Description
                  </label>
                  <textarea
                    className="full_width"
                    id="AdditionalshortDescription"
                    defaultValue={
                      saveEditTaskTimeChild?.Description != undefined
                        ? saveEditTaskTimeChild?.Description
                        : ""
                    }
                    cols={17}
                    rows={6}
                    onChange={(e) =>
                      PopupType == "EditTime" || PopupType == "CopyTime"
                        ? (saveEditTaskTimeChild.Description = e.target.value)
                        : setPostData({
                          ...postData,
                          Description: e.target.value,
                        })
                    }
                  ></textarea>
                </div>
              </div>
            </div>
            {PopupTypeCat == true && (
              <>
                <div className="col-sm-3">
                  <div className="      col mb-2">
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
              </>
            )}
            <footer>
              <div className="row">
                <div className="col-sm-6">
                  {PopupType == "EditTime" || PopupType == "CopyTime" ? (
                    <>
                      <div className="text-left">
                        Created
                        <span>
                          {saveEditTaskTimeChild?.TaskTimeCreatedDate}
                        </span>
                        by{" "}
                        <span className="siteColor">
                          {saveEditTaskTimeChild?.EditorTitle}
                        </span>
                      </div>
                      <div className="text-left">
                        Last modified
                        <span>
                          {saveEditTaskTimeChild?.TaskTimeModifiedDate}
                        </span>
                        by{" "}
                        <span className="siteColor">
                          {saveEditTaskTimeChild?.EditorTitle}
                        </span>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-sm-6 text-end">
                  {PopupType == "EditTime" || PopupType == "CopyTime" ? (
                    <>
                      <a
                        target="_blank"
                        className="hreflink"
                        data-interception="off"
                        href={`${CurrentSiteUrl}/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=${saveEditTaskTimeChild?.ParentID}`}
                      >
                        Open out-of-the-box form
                      </a>
                    </>
                  ) : (
                    ""
                  )}
                  {PopupTypeCat == true ? (
                    <button
                      disabled={
                        (PopupType == "AddTime" ||
                          PopupType == "AddTime Category") &&
                          TimeInMinutes <= 0
                          ? true
                          : false
                      }
                      type="button"
                      className="btn btn-primary ms-2"
                      onClick={() => saveTimeSpent()}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      disabled={
                        (PopupType == "AddTime" ||
                          PopupType == "AddTime Category") &&
                          TimeInMinutes <= 0
                          ? true
                          : false || buttonDisable == true
                      }
                      type="button"
                      className="btn btn-primary ms-2"
                      onClick={() =>
                        AddTaskTime(saveEditTaskTimeChild, PopupType)
                      }
                    >
                      Save
                    </button>
                  )}
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
      {isAlertVisible ?
        <CustomAlert
          hidden={!isAlertVisible}
          toggleDialog={toggleDialog}
          message="You are not part of Team members of this site. Please click here to add yourself or contact the site administrator."
          linkText="Please Click Here!"
          linkUrl="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskUser-Management.aspx"
        /> : null

      }


    </div>
  );
};

export default TimeEntryPopup;

function myDatee(arg0: any): any {
  throw new Error("Function not implemented.");
}