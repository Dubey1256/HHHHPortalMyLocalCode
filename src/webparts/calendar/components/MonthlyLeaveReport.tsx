import React, { useEffect, useState } from "react";
import { Web } from "sp-pnp-js";
import DatePicker from "react-datepicker";
import CheckboxTree from "react-checkbox-tree";
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from "../../../globalComponents/Tooltip";
import PreSetDatePikerPannel from "../../../globalComponents/SmartFilterGolobalBomponents/PreSetDatePiker";
import InfoIconsToolTip from "../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip";
import { Avatar } from "@fluentui/react-components";
// @ts-ignore
import * as html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { setMonth, Panel, PanelType } from "office-ui-fabric-react";
import { end } from "@popperjs/core";
import moment from "moment";
import { Start } from "@mui/icons-material";
import { SlArrowDown, SlArrowRight } from "react-icons/sl";

let currentUser: any;
let allReportData: any = [];
let Short_x0020_Description_x0020_On: any = "";
let filteredData: any = [];
let index: any = [];
let expandedVal: any = ""
export const MonthlyLeaveReport = (props: any) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectendDate, setselectendDate] = useState("");
  const [PreSetPanelIsOpen, setPreSetPanelIsOpen] = React.useState(false);
  const [types, settypes] = React.useState("today");
  const [AllTaskuser, setAllTaskuser] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [opendate, setopendate] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [leaveset, setleaveset] = useState(false);
  const [disabled, setdisabled] = useState(false);
  const [disabl, setdisabl] = useState(false);
  const [ImageSelectedUsers, setImageSelectedUsers] = useState([]);
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [selectedType, setselectedType] = useState(false);
  const [selectgroupName, setSelectGroupName] = useState("");
  const [showingMonthlyPannelData, setshowingMonthlyPannelData] =
    useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedIndexLeave, setExpandedIndexLeave] = useState<number | null>(null);

  let dropSuccessHandler: any;

  useEffect(() => {
    if (selectedDate || selectendDate) {
      setdisabled(true);
    }
  }, [selectedDate, selectendDate]);
  useEffect(() => {
    if (selectedMonth || selectedYear || selectedUserId) {
      setdisabl(true);
    }
  }, [selectedMonth, selectedYear, selectedUserId]);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleExpandLeave = (value: string, index: number) => {
    expandedVal = value
    setExpandedIndexLeave((prev) => (prev === index ? null : index))
  }

  const getTaskUser = async () => {
    let web = new Web(props.props.siteUrl);
    // let taskUsers = [];
    try {
      const Data: any[] = await web.lists
        .getById(props.props.TaskUserListID)
        .items.select(
          "Id,Title,TimeCategory,Team,CategoriesItemsJson,Suffix,SortOrder,IsApprovalMail,Item_x0020_Cover,ItemType,Created,Company,Role,Modified,IsActive,IsTaskNotifications,DraftCategory,UserGroup/Title,UserGroup/Id,AssingedToUser/Title,AssingedToUser/Name,AssingedToUser/Id,Author/Name,Author/Title,Editor/Name,Approver/Id,Approver/Title,Approver/Name,Editor/Title,Email"
        )
        .expand("Author,Editor,AssingedToUser,UserGroup,Approver")
        .orderBy("Title", true)
        .get();

      let filteredData = Data.filter(
        (item: any) =>
          item.Title != "HHHH Team" &&
          item.Title != "External Staff" &&
          item.Title != "Ex Staff" &&
          item.Title != "Kristina Kovach" &&
          item.Title != "Alina Chyhasova"
      );
      // const mydata = Data.filter((item) => item.UserGroupId != null && item.UserGroupId !== 131 && item.UserGroupId !== 147 && item.UserGroupId !== 7 && item.AssingedToUserId !== 9);
      for (let index = 0; index < filteredData?.length; index++) {
        let element = filteredData[index];
        if (element?.ItemType == "Group") {
          getChilds(element, filteredData);
          // taskUsers.push(element);
        }
      }
      let currentUser = filteredData.filter(
        (itm: any) =>
          itm.Title == props?.props?.context?.pageContext?.user?.displayName
      );
      setImageSelectedUsers(currentUser);
      setAllTaskuser(filteredData);
    } catch (err) {
      console.log(err.message);
    }
  };

  const loadleave = async () => {
    const web = new Web(props?.props?.siteUrl);
    try {
      const results: any = await web.lists
        .getById(props.props.SmalsusLeaveCalendar)
        .items.select(
          "RecurrenceData,Duration,Author/Title,Editor/Title,NameId,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,Created,EventType,UID,fRecurrence,HalfDay,HalfDayTwo,Event_x002d_Type,Approved,Rejected"
        )
        .expand("Author,Editor,Employee")
        .getAll();
      results.map((item: any) => {
        if (item.Event_x002d_Type != "Un-Planned") {
          item.shortD = item.Title.split("-");
          item.shortD = item.shortD[2];
        } else if (item.Event_x002d_Type == "Un-Planned") {
          item.shortD = item.Title.split("-");
          item.shortD = item.shortD[3];
        }
        if (item.Title.includes("Approved")) {
          item.isApproved = "Approved";
        }
        if (item.Title.includes("Rejected")) {
          item.isApproved = "Rejected";
        }
      });
      const FilterRejectedData = results.filter(
        (item: any) => item.Rejected !== true
      );
      setLeaveData(FilterRejectedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadleave();

    getTaskUser();
  }, []);
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allReportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "SmalsusMonthlyLeaveReport.xlsx");
  };
  const downloadExcelCompleteMonth = () => {
    const worksheet = XLSX.utils.json_to_sheet(CurrentMonthData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "SmalsusMonthlyLeaveReportofMonth.xlsx");
  };
  const downloadPDF = () => {
    const element = document.getElementById("contentToConvert");

    html2pdf(element, {
      margin: 10,
      filename: "SmalsusMonthlyLeaveReport.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
  };

  const SelectAllGroupMember = (ev: any) => {
    let SelectGroupName = "";
    let select = ev.currentTarget.checked;
    let ImageSelectedUser = ImageSelectedUsers;
    if (select == true) {
      AllTaskuser.forEach((item: any) => {
        if (item?.childs != undefined && item?.childs?.length > 0) {
          item.SelectedGroup = select;
          for (let index = 0; index < item.childs.length; index++) {
            let child = item.childs[index];
            child.IsSelected = true;
            try {
              document
                .getElementById("UserImg" + child.Id)
                .classList.add("seclected-Image");
              if (
                child.Id != undefined &&
                !isItemExists(ImageSelectedUser, child.Id)
              )
                ImageSelectedUsers.push(child);
            } catch (error) {}
          }
        }
      });
    } else if (select == false) {
      AllTaskuser.forEach((item: any) => {
        if (item?.childs != undefined && item?.childs?.length > 0) {
          item.SelectedGroup = select;
          item?.childs.forEach((child: any) => {
            child.IsSelected = false;
            try {
              document
                .getElementById("UserImg" + child.Id)
                .classList.remove("seclected-Image");
              for (let k = 0; k < ImageSelectedUser.length; k++) {
                let el = ImageSelectedUser[k];
                if (el.Id == child.Id) ImageSelectedUser.splice(k, 1);
              }
            } catch (error) {}
          });
        }
      });
    }

    AllTaskuser.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.Title + " ,";
    });
    SelectGroupName = SelectGroupName.replace(/.$/, "");

    if (ImageSelectedUser?.length > 0) {
      ImageSelectedUser = ImageSelectedUser.reduce(function (
        previous: any,
        current: any
      ) {
        var alredyExists =
          previous.filter(function (item: any) {
            return item.Title === current.Title;
          }).length > 0;
        if (!alredyExists) {
          previous.push(current);
        }
        return previous;
      },
      []);
    }
    setImageSelectedUsers(ImageSelectedUser);
    setSelectGroupName(SelectGroupName);
    console.log(ImageSelectedUsers);
  };
  const SelectUserImagee = (ev: any, item: any) => {
    let ImageSelectedUser = ImageSelectedUsers.filter(
      (user: any) => user?.Id !== item?.Id
    );
    setImageSelectedUsers(ImageSelectedUser);
  };
  const SelectUserImage = (ev: any, item: any) => {
    let SelectGroupName = "";
    console.log(`The option ${ev.currentTarget.title}.`);
    console.log(item);
    //console.log(Parent);
    let ImageSelectedUser = ImageSelectedUsers;

    const collection = document.getElementsByClassName("AssignUserPhoto mr-5");
    for (let i = 0; i < collection.length; i++) {
      collection[i].classList.remove("seclected-Image");
    }
    if (ev.currentTarget.className.indexOf("seclected-Image") > -1) {
      ev.currentTarget.classList.remove("seclected-Image");
      item.IsSelected = false;
      ImageSelectedUser = ImageSelectedUser.filter(
        (user: any) => user.Id != item.Id
      );
    } else {
      ev.currentTarget.classList.add("seclected-Image"); // add element
      if (currentUser) {
        let userExists = false;

        currentUser.forEach((user: any) => {
          if (user.Id == item.Id) {
            userExists = true;
            currentUser = currentUser.filter((user: any) => user.Id != item.Id);
            item.IsSelected = false;
            ImageSelectedUser = ImageSelectedUser.filter(
              (sel: any) => sel.Id != item.Id
            );
          }
        });

        if (!userExists) {
          item.IsSelected = true;
          ImageSelectedUser.push(item);
        }
      } else {
        item.IsSelected = true;
        ImageSelectedUser.push(item);
      }
      if (ImageSelectedUser?.length > 0) {
        ImageSelectedUser = ImageSelectedUser.reduce(function (
          previous: any,
          current: any
        ) {
          var alredyExists =
            previous.filter(function (item: any) {
              return item.Title === current.Title;
            }).length > 0;
          if (!alredyExists) {
            previous.push(current);
          }
          return previous;
        },
        []);
      }
    }

    AllTaskuser.forEach((taskItem: any) => {
      if (taskItem.SelectedGroup === true) {
        SelectGroupName = SelectGroupName + taskItem.Title + " ,";
      }
    });
    SelectGroupName = SelectGroupName.replace(/.$/, "");
    setSelectGroupName(SelectGroupName);

    // Logging updated state will not reflect the immediate change due to state being asynchronous
    setImageSelectedUsers(ImageSelectedUser);
  };

  const SelectedGroup = (ev: any, user: any) => {
    let SelectGroupName = "";
    console.log(ev.currentTarget.checked);
    let ImageSelectedUser = ImageSelectedUsers;
    let selected = ev.currentTarget.checked;
    if (selected) {
      for (let index = 0; index < AllTaskuser.length; index++) {
        let item = AllTaskuser[index];
        if (
          item.Title == user.Title &&
          item?.childs != undefined &&
          item?.childs?.length > 0
        ) {
          item.SelectedGroup = selected;
          for (let j = 0; j < item.childs.length; j++) {
            let child = item.childs[j];
            child.IsSelected = true;
            document
              .getElementById("UserImg" + child.Id)
              .classList.add("seclected-Image");
            if (
              child.Id != undefined &&
              !isItemExists(ImageSelectedUser, child.Id)
            )
              ImageSelectedUser.push(child);
          }
        }
      }
    } else {
      for (let index = 0; index < AllTaskuser.length; index++) {
        let item = AllTaskuser[index];
        if (
          item.Title == user.Title &&
          item?.childs != undefined &&
          item?.childs.length > 0
        ) {
          item.SelectedGroup = selected;
          item?.childs.forEach((child: any) => {
            child.IsSelected = false;
            document
              .getElementById("UserImg" + child.Id)
              .classList.remove("seclected-Image");
            for (let k = 0; k < ImageSelectedUser.length; k++) {
              let el = ImageSelectedUser[k];
              if (el.Id == child.Id) ImageSelectedUser.splice(k, 1);
            }
          });
        }
      }
    }

    AllTaskuser.forEach((item: any) => {
      if (item.SelectedGroup == true)
        SelectGroupName = SelectGroupName + item.Title + " ,";
    });
    SelectGroupName = SelectGroupName.replace(/.$/, "");
    setSelectGroupName(SelectGroupName);
    let removeDuplicate = ImageSelectedUser.filter(
      (item, index) => ImageSelectedUser.indexOf(item) === index
    );
    setImageSelectedUsers(removeDuplicate);
    console.log(removeDuplicate);
  };
  const setStartDate = (dt: any) => {
    setstartDate(dt);
  };

  const setEndDate = (dt: any) => {
    setendDate(dt);
  };

  const selectDate = (types: string) => {
    let startdt = new Date(),
      enddt = new Date(),
      tempdt = new Date();
    let diff: number, lastday: number;
    switch (types) {
      case "Custom":
        settypes("Custom");
        break;

      case "today":
        settypes("today");
        break;

      case "yesterday":
        startdt.setDate(startdt.getDate() - 1);
        enddt.setDate(enddt.getDate() - 1);
        settypes("yesterday");
        break;

      case "ThisWeek":
        diff =
          startdt.getDate() -
          startdt.getDay() +
          (startdt.getDay() === 0 ? -6 : 1);
        startdt = new Date(startdt.setDate(diff));

        lastday = enddt.getDate() - (enddt.getDay() - 1) + 6;
        enddt = new Date(enddt.setDate(lastday));
        settypes("ThisWeek");
        break;

      case "LastWeek":
        tempdt = new Date();
        tempdt = new Date(
          tempdt.getFullYear(),
          tempdt.getMonth(),
          tempdt.getDate() - 7
        );

        diff =
          tempdt.getDate() - tempdt.getDay() + (tempdt.getDay() === 0 ? -6 : 1);
        startdt = new Date(tempdt.setDate(diff));

        lastday = tempdt.getDate() - (tempdt.getDay() - 1) + 6;
        enddt = new Date(tempdt.setDate(lastday));
        settypes("LastWeek");
        break;

      case "EntrieMonth":
        startdt = new Date(startdt.getFullYear(), startdt.getMonth(), 1);
        enddt = new Date(enddt.getFullYear(), enddt.getMonth() + 1, 0);
        settypes("EntrieMonth");
        break;

      case "LastMonth":
        startdt = new Date(startdt.getFullYear(), startdt.getMonth() - 1);
        enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
        settypes("LastMonth");
        break;

      case "Last3Month":
        startdt = new Date(startdt.getFullYear(), startdt.getMonth() - 3);
        enddt = new Date(enddt.getFullYear(), enddt.getMonth(), 0);
        settypes("Last3Month");
        break;

      case "EntrieYear":
        startdt = new Date(new Date().getFullYear(), 0, 1);
        enddt = new Date(new Date().getFullYear(), 11, 31);
        settypes("EntrieYear");
        break;

      case "LastYear":
        startdt = new Date(new Date().getFullYear() - 1, 0, 1);
        enddt = new Date(new Date().getFullYear() - 1, 11, 31);
        settypes("LastYear");
        break;

      case "AllTime":
        startdt = new Date("2017/01/01");
        enddt = new Date();
        settypes("AllTime");
        break;

      case "Pre-set":
        let storedDataStartDate: string | null =
          localStorage.getItem("startDate");
        let storedDataEndDate: string | null = localStorage.getItem("endDate");
        try {
          if (storedDataStartDate && storedDataEndDate) {
            const parsedStartDate = new Date(JSON.parse(storedDataStartDate));
            const parsedEndDate = new Date(JSON.parse(storedDataEndDate));

            if (
              !isNaN(parsedStartDate.getTime()) &&
              !isNaN(parsedEndDate.getTime())
            ) {
              startdt = parsedStartDate;
              enddt = parsedEndDate;
              settypes("Pre-set");
              break;
            }
          }
        } catch (error) {
          console.error("Failed to parse dates from localStorage", error);
        }
        // If parsing fails, fall through to the default case
        startdt = null;
        enddt = null;
        //settypes('Pre-set')
        break;
      default:
    }

    startdt.setHours(0, 0, 0, 0);
    enddt.setHours(0, 0, 0, 0);

    setstartDate(startdt);
    setendDate(enddt);
  };
  const getChilds = (item: any, items: any) => {
    item.childs = [];
    for (let index = 0; index < items.length; index++) {
      let childItem = items[index];
      if (
        childItem.UserGroup?.Id != undefined &&
        parseInt(childItem.UserGroup?.Id) == item.ID
      ) {
        childItem.IsSelected = false;
        //if (this.props.Context.pageContext.user. == childItem.AssingedToUserId)
        //childItem.IsSelected = true
        item.childs.push(childItem);
        getChilds(childItem, items);
      }
    }
  };
  const isItemExists = (array: any, items: any) => {
    let isExists = false;
    for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (item.TaskItemID == items.TaskItemID) {
        if (
          item.Effort != undefined &&
          items.Effort != undefined &&
          item.Effort == items.Effort
        ) {
          isExists = true;
          return false;
        }
      }
    }
    return isExists;
  };
  const calculateTotalHalfday = (matchedData: any, leaveType: string) => {
    const today = new Date();

    return matchedData.reduce((total: any, item: any) => {
      const timezoneOffset = item.EventDate.getTimezoneOffset();
      const timezoneOffsetInHours = timezoneOffset / 60;
      const adjustedEndDate = new Date(
        item.EndDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000
      );
      adjustedEndDate.setMinutes(adjustedEndDate.getMinutes() + 30);
      adjustedEndDate.setHours(0, 0, 0, 0);
      const adjustedEventDate: any = new Date(
        item.EventDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000
      );
      adjustedEventDate.setHours(adjustedEventDate.getHours() + 1);
      adjustedEventDate.setHours(0, 0, 0, 0);
      if (
        adjustedEventDate.getFullYear() === today.getFullYear() &&
        (leaveType === "HalfDay" || leaveType === "HalfDayTwo")
      ) {
        const adjustedEndDateToToday =
          today < adjustedEndDate ? today : adjustedEndDate;
        adjustedEndDateToToday.setHours(0, 0, 0, 0);
        let workingDays = 0;
        let currentDate = new Date(adjustedEventDate);
        currentDate.setHours(0, 0, 0, 0);
        while (currentDate <= adjustedEndDateToToday) {
          const dayOfWeek = currentDate.getDay();
          if (
            dayOfWeek !== 0 &&
            dayOfWeek !== 6 &&
            !isWeekend(currentDate, adjustedEndDateToToday)
          ) {
            if (item?.Event_x002d_Type !== "Work From Home") {
              if (
                (leaveType === "HalfDay" || leaveType === "HalfDayTwo") &&
                (item?.HalfDay === true || item?.HalfDayTwo === true)
              ) {
                workingDays += 0.5;
              }
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return total + workingDays;
      }
      return total;
    }, 0);
  };
  const calculateTotalWorkingDays = (matchedData: any) => {
    const today = new Date();
    return matchedData.reduce((total: any, item: any) => {
      const endDate = new Date(item.EndDate);
      const eventDate = new Date(item.EventDate);
      const timezoneOffset = endDate.getTimezoneOffset();
      const timezoneOffsetInHours = timezoneOffset / 60;
      const adjustedEndDate = new Date(
        endDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000
      );
      if (item.HalfDay === true || item.HalfDayTwo === true) {
        adjustedEndDate.setMinutes(adjustedEndDate.getMinutes() + 30);
        adjustedEndDate.setHours(0, 0, 0, 0);
      }
      const adjustedEventDate: any = new Date(
        eventDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000
      );
      if (item.HalfDay === true || item.HalfDayTwo === true) {
        adjustedEventDate.setHours(adjustedEventDate.getHours() + 1);
        adjustedEventDate.setHours(0, 0, 0, 0);
      }
      if (adjustedEventDate.getFullYear() === today.getFullYear()) {
        const adjustedEndDateToToday =
          today < adjustedEndDate ? today : adjustedEndDate;
        adjustedEndDateToToday.setHours(0);
        let workingDays = 0;
        let currentDate = new Date(adjustedEventDate);
        currentDate.setHours(0, 0, 0, 0);
        while (currentDate <= adjustedEndDateToToday) {
          const dayOfWeek = currentDate.getDay();
          if (
            dayOfWeek !== 0 &&
            dayOfWeek !== 6 &&
            !isWeekend(currentDate, adjustedEndDateToToday)
          ) {
            if (item?.Event_x002d_Type !== "Work From Home") {
              if (item?.HalfDay === true || item?.HalfDayTwo === true) {
                workingDays += 0.5;
              } else {
                workingDays++;
              }
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return total + workingDays;
      }
      return total;
    }, 0);
  };
  const calculatePlannedLeave = (matchedData: any, LeaveType: any) => {
    const today = new Date();
    return matchedData.reduce((total: any, item: any) => {
      const endDate = new Date(item.EndDate);
      const eventDate = new Date(item.EventDate);
      const timezoneOffset = endDate.getTimezoneOffset();
      const timezoneOffsetInHours = timezoneOffset / 60;
      const adjustedEndDate = new Date(
        endDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000
      );
      const adjustedEventDate: any = new Date(
        eventDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000
      );
      if (adjustedEventDate.getFullYear() === today.getFullYear()) {
        const adjustedEndDateToToday =
          today < adjustedEndDate ? today : adjustedEndDate;
        adjustedEndDateToToday.setHours(0);
        let workingDays = 0;
        let currentDate = new Date(adjustedEventDate);
        currentDate.setHours(0, 0, 0, 0);
        while (currentDate <= adjustedEndDateToToday) {
          const dayOfWeek = currentDate.getDay();
          if (
            dayOfWeek !== 0 &&
            dayOfWeek !== 6 &&
            !isWeekend(currentDate, adjustedEndDateToToday)
          ) {
            if (item?.Event_x002d_Type == LeaveType) {
              if (item?.HalfDay === true || item?.HalfDayTwo === true) {
                workingDays += 0.5;
              } else {
                workingDays++;
              }
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return total + workingDays;
      }
      return total;
    }, 0);
  };
  const PreSetPikerCallBack = React.useCallback(
    (preSetStartDate: any, preSetEndDate) => {
      if (preSetStartDate != undefined) {
        setStartDate(preSetStartDate);
      }
      if (preSetEndDate != undefined) {
        setEndDate(preSetEndDate);
      }
      if (preSetStartDate != undefined || preSetEndDate != undefined) {
        settypes("Pre-set");
      }
      // setselectedType(true)

      setPreSetPanelIsOpen(false);
    },
    []
  );
  const preSetIconClick = () => {
    // setPreSet(true);
    setPreSetPanelIsOpen(true);
  };

  const isWeekend = (startDate: Date, endDate: Date) => {
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const isWeekend =
      startDay === 0 || startDay === 6 || endDay === 0 || endDay === 6;
    const targetMonth = startDate.getMonth();
    const targetYear = startDate.getFullYear();
    const isMatchingMonth = startMonth === targetMonth;
    const isMatchingYear = startYear === targetYear;
    return isWeekend && isMatchingMonth && isMatchingYear;
  };
  let Year = new Date().getFullYear();
  // let month = new Date(startDate).getMonth() + 1; // Actual month
  // let formattedMonth = month < 10 ? `0${month}` : `${month}`;
  let CurrentMonthData = leaveData.filter((item: any) => {
    let itemDate = new Date(item?.EventDate);
    let selectedstartdate = startDate
      ?.toISOString()
      .substring(0, 19)
      .replace("T", " ");
    let selectedenddate = endDate
      ?.toISOString()
      .substring(0, 19)
      .replace("T", " ");
    itemDate.setHours(0, 0, 0, 0);
    let startdate = new Date(selectedstartdate);
    startdate.setHours(0, 0, 0, 0);
    let enddate = new Date(selectedenddate);
    enddate.setHours(0, 0, 0, 0);
    console.log("Item Date:", itemDate);
    console.log("Start Date:", startdate);
    console.log("End Date:", enddate);

    return itemDate >= startdate && itemDate <= enddate;
  });
  const handleDateChange = (event: any) => {
    setSelectedDate(event.target.value);
  };
  const handleEndDateChange = (event: any) => {
    setselectendDate(event.target.value);
  };
  const handleUserChange = (event: any) => {
    setSelectedUserId(event.target.value);
    allReportData = [];
  };
  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value);
    allReportData = [];
  };

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value);
    allReportData = [];
  };

  const handleSubmit = () => {
    setleaveset(false);
    if (ImageSelectedUsers != null && ImageSelectedUsers != undefined) {
      ImageSelectedUsers.forEach((users: any, Index: any) => {
        let user: any = {};
        let EventDateForLeave: any = {};

        const matchedData: any = CurrentMonthData.filter(
          (member) => member.Employee?.Id === users?.AssingedToUser?.Id
        );
        user.Number = Index + 1;
        user.Title = users.Title;
        user.Id = users.Id;
        const PlanedEventDates = matchedData
          .map((item: any) => {
            if (item.Event_x002d_Type === "Planned Leave") {
              let startDate = moment(item.EventDate, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              );
              let endDateFirst = moment(item.EndDate, "YYYY-MM-DD").startOf(
                "day"
              );
              // if (item.fAllDayEvent == false) {
              //   endDateFirst = endDateFirst.subtract(3, 'hours')
              //   item.EndDate = endDateFirst.utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
              // }
              let endDate = endDateFirst.format("DD/MM/YYYY");
              if (startDate !== endDate) {
                return `${startDate} - ${endDate}`;
              } else {
                return startDate;
              }
            }
          })
          .filter((date: any) => date);
        let leavediscriptionPlanned: any = [];
        matchedData.map((item: any) => {
          if (
            item.Event_x002d_Type === "Planned Leave" &&
            item.Title != undefined
          ) {
            let eventDateFormat: any = moment(
              item.EventDate,
              "YYYY-MM-DD"
            ).format("DD/MM/YYYY");
            let endDateFormat: any = moment(item.EndDate, "YYYY-MM-DD").format(
              "DD/MM/YYYY"
            );
            leavediscriptionPlanned.push({
              Short_x0020_Description_x0020_On: item.shortD,
              eventDate: eventDateFormat,
              endDate: endDateFormat,
            });
          }
        });
        let plannedLeaveString = `${PlanedEventDates.join(", ")}`;
        // let plannedDiscription = leavediscription
        const UnPlanedEventDates = matchedData
          .map((item: any) => {
            if (
              item.Event_x002d_Type === "Un-Planned" ||
              item.Event_x002d_Type === "Sick"
            ) {
              let startDate = moment(item.EventDate, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              );
              let endDateFirst = moment(item.EndDate, "YYYY-MM-DD").startOf(
                "day"
              );
              // if (item.fAllDayEvent == false) {
              //   endDateFirst = endDateFirst.subtract(3, 'hours')
              //   item.EndDate = endDateFirst.utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
              // }
              let endDate = endDateFirst.format("DD/MM/YYYY");

              if (startDate !== endDate) {
                return `${startDate}-${endDate}`;
              } else {
                return startDate;
              }
            }
          })
          .filter((date: any) => date);
        let leavediscriptionUnPlanned: any = [];
        matchedData.map((item: any) => {
          if (
            (item.Event_x002d_Type === "Un-Planned" ||
              item.Event_x002d_Type === "Sick") &&
            item.Title != undefined
          ) {
            let eventDateFormat: any = moment(
              item.EventDate,
              "YYYY-MM-DD"
            ).format("DD/MM/YYYY");
            let endDateFormat: any = moment(item.EndDate, "YYYY-MM-DD").format(
              "DD/MM/YYYY"
            );
            leavediscriptionUnPlanned.push({
              Short_x0020_Description_x0020_On: item.shortD,
              eventDate: eventDateFormat,
              endDate: endDateFormat,
            });
          }
        });
        let UnplannedLeaveString = `${UnPlanedEventDates.join(", ")}`;
        //let UnplannedDiscription = Short_x0020_Description_x0020_On
        const MyHalfdayData = matchedData.filter(
          (item: any) => item?.HalfDay === true || item?.HalfDayTwo === true
        );
        MyHalfdayData?.map((item: any) => {
          const endDate = new Date(item.EndDate);
          endDate.setHours(endDate.getHours() - 9);
          endDate.setMinutes(endDate.getMinutes() - 30);
          item.EndDate = endDate;
          const eventDate = new Date(item.EventDate);
          eventDate.setHours(eventDate.getHours() - 5);
          eventDate.setMinutes(eventDate.getMinutes() - 30);
          item.EventDate = eventDate;
        });
        const HalfdayEventDates = MyHalfdayData.map((item: any) => {
          if (item.HalfDay === true || item.HalfDayTwo === true) {
            return moment(item.EventDate).format("DD/MM/YYYY");
          }
        }).filter((date: any) => date);
        let leavediscriptionHalfday: any = [];
        matchedData.map((item: any) => {
          if (
            item?.HalfDay === true ||
            (item?.HalfDayTwo === true && item.Title != undefined)
          ) {
            let eventDateFormat: any = moment(
              item.EventDate,
              "YYYY-MM-DD"
            ).format("DD/MM/YYYY");
            leavediscriptionHalfday.push({
              Short_x0020_Description_x0020_On: item.shortD,
              eventDate: eventDateFormat,
            });
          }
        });
        let HalfplannedLeaveString = `${HalfdayEventDates.join(", ")}`;
        const MyRHdayData = matchedData
          .map((item: any) => {
            if (item.Event_x002d_Type === "Restricted Holiday") {
              let startDate = moment(item.EventDate, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              );
              // let endDateFirst = moment(item.EndDate, 'YYYY-MM-DD').startOf('day')
              // if (item.fAllDayEvent == false) {
              //   endDateFirst = endDateFirst.subtract(3, 'hours')
              //   item.EndDate = endDateFirst.utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
              // }
              let endDate = moment(item.EndDate, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              );

              if (startDate !== endDate) {
                return `${startDate}-${endDate}`;
              } else {
                return startDate;
              }
            }
          })
          .filter((date: any) => date);
        let leavediscriptionRh: any = [];
        matchedData.map((item: any) => {
          if (
            item.Event_x002d_Type === "Restricted Holiday" &&
            item.Title != undefined
          ) {
            let eventDateFormat: any = moment(
              item.EventDate,
              "YYYY-MM-DD"
            ).format("DD/MM/YYYY");
            leavediscriptionRh.push({
              Short_x0020_Description_x0020_On: item.shortD,
              eventDate: eventDateFormat,
              // eventType: item.Event_x002d_Type,
            });
          }
        });
        let RhplannedLeaveString = `${MyRHdayData.join(", ")}`;

        user.Plannedleave = calculatePlannedLeave(matchedData, "Planned Leave");
        user.Plannedleave = `${user.Plannedleave} ${
          plannedLeaveString.length != 0 ? ` ${plannedLeaveString} ` : ""
        } `;

        user.PlanedEventDates = PlanedEventDates;
        user.leavediscriptionPlanned =
          leavediscriptionPlanned != undefined ? leavediscriptionPlanned : "";

        user.unplannedleave = calculatePlannedLeave(matchedData, [
          "Un-Planned",
          "Sick",
        ]);
        // user.unplannedleave = [...unplannedLeave, ...sickLeave].map(item => `${item.Short_x0020_Description_x0020_On} (${item.eventDate})`).join(', ');
        //user.unplannedleave = user.unplannedleave.map((item:any) => `${item.Short_x0020_Description_x0020_On} (${item.eventDate})`).join(', ');
        user.unplannedleave = `${user.unplannedleave}${
          UnplannedLeaveString.length != 0 ? `[ ${UnplannedLeaveString} ]` : ""
        } `;
        user.UnPlanedEventDates = UnPlanedEventDates;
        user.leavediscriptionUnPlanned =
          leavediscriptionUnPlanned != undefined
            ? leavediscriptionUnPlanned
            : "";
        // user.Short_x0020_Description_x0020_On = UnplannedDiscription!=undefined ? ` ${UnplannedDiscription} ` : ''
        user.Halfdayleave = calculateTotalHalfday(
          MyHalfdayData,
          "HalfDay" || "HalfDayTwo"
        );
        user.Halfdayleave = `${user.Halfdayleave}${
          HalfplannedLeaveString.length != 0
            ? `[ ${HalfplannedLeaveString} ]`
            : ""
        } `;
        user.HalfdayEventDates = HalfdayEventDates;
        user.leavediscriptionHalfday =
          leavediscriptionHalfday != undefined ? leavediscriptionHalfday : "";
        user.RestrictedHoliday = calculatePlannedLeave(
          matchedData,
          "Restricted Holiday"
        );
        user.RestrictedHoliday = `${user.RestrictedHoliday}${
          RhplannedLeaveString.length != 0 ? `[ ${RhplannedLeaveString} ]` : ""
        } `;
        user.MyRHdayData = MyRHdayData;
        user.leavediscriptionRh =
          leavediscriptionRh != undefined ? leavediscriptionRh : "";
        user.TotalLeave = calculateTotalWorkingDays(matchedData);
        user.allLeaves = [
          ...user.leavediscriptionPlanned,
          ...user.leavediscriptionUnPlanned,
          ...user.leavediscriptionRh,
          ...user.leavediscriptionHalfday,
        ];
        if (startDate && endDate) {
          allReportData.push(user);
        }
      });
      if (allReportData?.length > 0) {
        allReportData = allReportData.reduce(function (
          previous: any,
          current: any
        ) {
          var alredyExists =
            previous.filter(function (item: any) {
              return item.Title === current.Title;
            }).length > 0;
          if (!alredyExists) {
            previous.push(current);
          }
          return previous;
        },
        []);
      }
      allReportData = allReportData.filter((item: any) =>
        ImageSelectedUsers.some((user: any) => item.Id === user.Id)
      );
    }
    setleaveset(false); // Ensure the flag is set to false before setting it to true
    setTimeout(() => {
      setleaveset(true); // Set the flag to true after a short delay
    }, 0);
  };
  const handleclose = () => {
    setopendate(false);
    setleaveset(false);
    allReportData = [];
    props.callback();

    props.settrue(false);
  };

  useEffect(() => {
    if (props.trueval) {
      setopendate(true);
    }
  }, []);

  const onRenderCustomHeader = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div className="subheading siteColor">Employee Leave Report</div>
        <Tooltip ComponentId="9802" />
      </div>
    );
  };

  return (
    <div>
      <Panel
        type={PanelType.custom}
        customWidth="1000px"
        max-wi
        isOpen={opendate}
        onDismiss={() => handleclose()}
        onRenderHeader={onRenderCustomHeader}
        isBlocking={false}
        // onRenderFooter={CustomFooter}
      >
        <div className="smartFilter bg-light border mb-3 col px-3 py-2">
          {showingMonthlyPannelData ? (
            <>
              <div className="p-0 m-0">
                <SlArrowDown className="mr-4"
                  onClick={() => setshowingMonthlyPannelData(false)}
                />
                All Filters -{" "}
                <a>
                  <span>Task User :</span>
                </a>
                {ImageSelectedUsers != null &&
                  ImageSelectedUsers.length > 0 &&
                  ImageSelectedUsers.map((user: any, i: number) => {
                    return (
                      <span>
                        <Avatar
                          className="AssignUserPhoto me-1 activeimg"
                          title={user?.AssingedToUser?.Title}
                          onClick={(e: any) => SelectUserImagee(e, user)}
                          image={{ src: user?.Item_x0020_Cover?.Url }}
                          initials={
                            user?.Item_x0020_Cover?.Url
                              ? undefined
                              : user?.AssingedToUser?.Suffix
                          }
                        />
                      </span>
                    );
                  })}
                <span className="">
                  <input
                    type="checkbox"
                    className="form-check-input mx-1"
                    onClick={(e) => SelectAllGroupMember(e)}
                  />
                  <label>Select All </label>
                </span>
              </div>

              <Col>
                <details open className="p-0">
                  <summary className="hyperlink">
                    Team members
                    <hr></hr>
                  </summary>

                  <div style={{ display: "block" }}>
                    <div className="taskTeamBox ps-30">
                      {AllTaskuser != null &&
                        AllTaskuser.length > 0 &&
                        AllTaskuser.map((users: any, i: number) => {
                          return (
                            users?.childs?.length > 0 && (
                              <div className="top-assign">
                                <div className="team ">
                                  <label className="BdrBtm">
                                    <input
                                      style={{ display: "none" }}
                                      className=""
                                      type="checkbox"
                                      onClick={(e) => SelectedGroup(e, users)}
                                    />
                                    {users?.ItemType == "Group" &&
                                      users.Title != "User Experience Team" && (
                                        <>{users.Title}</>
                                      )}
                                  </label>
                                  <div className="d-flex">
                                    {users?.childs?.length > 0 &&
                                      users?.childs.map(
                                        (item: any, i: number) => {
                                          return (
                                            <div className="alignCenter">
                                              {item.Item_x0020_Cover !=
                                              undefined ? (
                                                <Avatar
                                                  id={"UserImg" + item?.Id}
                                                  className={
                                                    ImageSelectedUsers.some(
                                                      (i) => i?.Id === item?.Id
                                                    )
                                                      ? "activeimg ProirityAssignedUserPhoto seclected-Image"
                                                      : "ProirityAssignedUserPhoto"
                                                  }
                                                  onClick={(e: any) =>
                                                    SelectUserImage(e, item)
                                                  }
                                                  draggable="true"
                                                  onDrop={(e: any) =>
                                                    dropSuccessHandler(
                                                      e,
                                                      item,
                                                      users.childs
                                                    )
                                                  }
                                                  title={item?.Title}
                                                  image={{
                                                    src: item?.Item_x0020_Cover
                                                      ?.Url,
                                                  }}
                                                />
                                              ) : (
                                                <Avatar
                                                  className={
                                                    item?.AssingedToUserId ==
                                                    users?.Id
                                                      ? "activeimg suffix_Usericon"
                                                      : "suffix_Usericon"
                                                  }
                                                  onClick={(e: any) =>
                                                    SelectUserImage(e, item)
                                                  }
                                                  draggable="true"
                                                  onDrop={(e) =>
                                                    dropSuccessHandler(
                                                      e,
                                                      item,
                                                      users.childs
                                                    )
                                                  }
                                                  title={item?.Title}
                                                  initials={item?.Suffix}
                                                />
                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                  </div>
                                </div>
                              </div>
                            )
                          );
                        })}
                    </div>
                  </div>
                </details>
                <details open>
                  <summary className="hyperlink">
                    Date
                    <hr></hr>
                  </summary>
                  <Row className="ps-30">
                      <div className="col-lg-12 TimeReportDays">
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            className="radio"
                            name="dateSelection"
                            id="rdCustom"
                            value="Custom"
                            ng-checked="unSelectToday=='Custom'"
                            onClick={() => selectDate("Custom")}
                            ng-model="radio"
                          />
                          <label>Custom</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            id="rdToday"
                            value="Today"
                            onClick={() => selectDate("today")}
                            checked={types === "today"}
                            className="radio"
                          />
                          <label>Today</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            id="rdYesterday"
                            value="Yesterday"
                            onClick={() => selectDate("yesterday")}
                            checked={types === "yesterday"}
                            className="radio"
                          />
                          <label> Yesterday </label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            defaultChecked={true}
                            id="rdThisWeek"
                            value="ThisWeek"
                            onClick={() => selectDate("ThisWeek")}
                            checked={types === "ThisWeek"}
                            className="radio"
                          />
                          <label> This Week</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            id="rdLastWeek"
                            value="LastWeek"
                            onClick={() => selectDate("LastWeek")}
                            checked={types === "LastWeek"}
                            className="radio"
                          />
                          <label> Last Week</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            id="rdThisMonth"
                            value="EntrieMonth"
                            onClick={() => selectDate("EntrieMonth")}
                            checked={types === "EntrieMonth"}
                            className="radio"
                          />
                          <label>This Month</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            id="rdLastMonth"
                            value="LastMonth"
                            onClick={() => selectDate("LastMonth")}
                            checked={types === "LastMonth"}
                            className="radio"
                          />
                          <label>Last Month</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            value="rdLast3Month"
                            onClick={() => selectDate("Last3Month")}
                            checked={types === "Last3Month"}
                            className="radio"
                          />
                          <label>Last 3 Months</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            value="rdEntrieYear"
                            onClick={() => selectDate("EntrieYear")}
                            checked={types === "EntrieYear"}
                            className="radio"
                          />
                          <label>This Year</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            value="rdLastYear"
                            onClick={() => selectDate("LastYear")}
                            checked={types === "LastYear"}
                            className="radio"
                          />
                          <label>Last Year</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            value="rdAllTime"
                            onClick={() => selectDate("AllTime")}
                            checked={types === "AllTime"}
                            className="radio"
                          />
                          <label>All Time</label>
                        </span>
                        <span className="SpfxCheckRadio">
                          <input
                            type="radio"
                            name="dateSelection"
                            value="Presettime"
                            onClick={() => selectDate("Pre-set")}
                            className="radio"
                            checked={types === "Pre-set"}
                          />
                          {/* <label>Pre-set</label>
                          <img className="hreflink " title="open" ng-click="OpenPresetDatePopup('Presettime')" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" /> */}
                          <label className="ms-1">
                            Pre-set{" "}
                            <span
                              onClick={() => preSetIconClick()}
                              className="svg__iconbox svg__icon--editBox alignIcon hreflink"
                            ></span>
                          </label>
                        </span>
                      </div>
                     
                  </Row>
                  <Row className="ps-30 mt-2">
                  <div className="col">
                      <label
                        ng-required="true"
                        className="full_width ng-binding"
                        ng-bind-html="GetColumnDetails('StartDate') | trustedHTML"
                      >
                        Start Date
                      </label>
                      <DatePicker
                        selected={startDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date: any) => setStartDate(date)}
                        className=" full-width searchbox_height ng-pristine ng-valid ng-touched ng-not-empty"
                      />
                    </div>
                    <div className="col">
                      <label
                        ng-required="true"
                        className="full_width ng-binding"
                        ng-bind-html="GetColumnDetails('EndDate') | trustedHTML"
                      >
                        End Date
                      </label>
                      <DatePicker
                        selected={endDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date: any) => setEndDate(date)}
                        className=" full-width searchbox_height  ng-pristine ng-valid ng-touched ng-not-empty"
                      />
                    </div>
                  </Row>
                </details>
              </Col>
            </>
          ) : (
            <>
              {" "}
              <div className="p-0 m-0">
                <SlArrowRight
                  onClick={() => setshowingMonthlyPannelData(true)}
                />
                All Filters -{" "}
                <a>
                  <span>Task User :</span>
                </a>
                {ImageSelectedUsers != null &&
                  ImageSelectedUsers.length > 0 &&
                  ImageSelectedUsers.map((user: any, i: number) => {
                    return (
                      <span>
                        <Avatar
                          className="AssignUserPhoto me-1 activeimg"
                          title={user?.AssingedToUser?.Title}
                          onClick={(e: any) => SelectUserImage(e, user)}
                          image={{ src: user?.Item_x0020_Cover?.Url }}
                          initials={
                            user?.Item_x0020_Cover?.Url
                              ? undefined
                              : user?.AssingedToUser?.Suffix
                          }
                        />
                      </span>
                    );
                  })}
                <span className="">
                  <input
                    type="checkbox"
                    className="form-check-input mx-1"
                    onClick={(e) => SelectAllGroupMember(e)}
                  />
                  <label>Select All </label>
                </span>
              </div>
            </>
          )}
          {/* <summary className='hyperlink'>All Filters - </summary>
            <a><span>Task User :</span></a>
            {ImageSelectedUsers != null && ImageSelectedUsers.length > 0 && ImageSelectedUsers.map((user: any, i: number) => {
              return (
                <span>
                  <Avatar
                    className="AssignUserPhoto me-1"
                    title={user?.AssingedToUser?.Title}
                    onClick={(e: any) => SelectUserImage(e, user)}
                    image={{ src: user?.Item_x0020_Cover?.Url }}
                    initials={user?.Item_x0020_Cover?.Url ? undefined : user?.AssingedToUser?.Suffix}
                  />
                </span>
              )
            })
            }
            <span className="">
              <input type="checkbox" className="form-check-input mx-1" onClick={(e) => SelectAllGroupMember(e)} />
              <label>Select All </label>
            </span> */}
        </div>

        <footer className="modal-footer">
          <Button
            onClick={() => handleSubmit()}
            variant="primary"
            className="btn btn-primary"
            type="submit"
          >
            Submit
          </Button>
        </footer>

        {allReportData?.length > 0 && leaveset && (
          <div id="contentToConvert">
            <div className="alignCenter">
              <h2 className="heading my-3">Monthly Report of Leave</h2>
              <div className="text-end ml-auto">
              <a className="btn btn-outline btn-primary d-inline-flex gap-1" onClick={downloadExcel}><span className="siteColor svg__icon--install svg__iconbox"></span>Download Excel</a>
                {/* <button
                  className="btnCol btn btn-primary mx-1"
                  onClick={downloadExcel}
                >
                  Download Excel
                </button> */}
                {/* <button
                  className="btnCol btn btn-primary"
                  onClick={downloadExcelCompleteMonth}
                >
                  Download Month Excel
                </button> */}
                <a className="btn btn-outline btn-primary d-inline-flex gap-1 ms-2" onClick={downloadExcelCompleteMonth}><span className="siteColor svg__icon--install svg__iconbox"></span>Download Month Excel</a>

              </div>
            </div>
            <div className="maXh-500 scrollbar border-0">
              <table className="MonthlyLeaveReport-Table">
                <thead>
                  <tr>
                    <th
                      className="py-2 border-bottom"
                      style={{ width: "2%" }}
                    ></th>
                    <th className="py-2 border-bottom" style={{ width: "30%" }}>
                      Name
                    </th>
                    <th className="py-2 border-bottom" style={{ width: "15%" }}>
                      Planned
                    </th>
                    <th className="py-2 border-bottom" style={{ width: "15%" }}>
                      Unplanned
                    </th>
                    <th className="py-2 border-bottom" style={{ width: "13%" }}>
                      RH
                    </th>
                    <th className="py-2 border-bottom" style={{ width: "15%" }}>
                      Half-Day
                    </th>
                    <th className="py-2 border-bottom" style={{ width: "10%" }}>
                      Total Leave
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allReportData.map((entry: any, index: any) => (
                    <>
                      <tr
                        className={
                          expandedIndex === index &&
                          "MonthlyLeaveReport-Table-activeTr"
                        }
                        key={index}
                      >
                        <td>
                          <span
                            className={
                              expandedIndex === index
                                ? "svg__iconbox svg__icon--arrowDown"
                                : "svg__iconbox svg__icon--arrowRight"
                            }
                            onClick={() => toggleExpand(index)}
                          ></span>
                        </td>
                        <td>{entry.Title}</td>
                        <td onClick={() => toggleExpandLeave("Planned", index)}>{entry?.leavediscriptionPlanned?.length}</td>
                        <td onClick={() => toggleExpandLeave("Un-Planned", index)}>{entry?.leavediscriptionUnPlanned?.length}</td>
                        <td onClick={() => toggleExpandLeave("RH", index)}>{entry?.leavediscriptionRh?.length}</td>
                        <td onClick={() => toggleExpandLeave("Halfday", index)}>{entry?.leavediscriptionHalfday?.length}</td>
                        <td onClick={() => toggleExpand(index)}>{entry?.TotalLeave}</td>
                      </tr>

                      {expandedIndex === index && (
                        <tr className="MonthlyLeaveReport-Table-InnerRow">
                          <td colSpan={7}>
                            <div className="maXh-400 scrollbar border-0">
                            <table className="table">
                              <tr>
                                {/* <td>{leave.eventType}</td>
                                  <td>{leave.eventDate}</td>
                                  <td>
                                    {leave.Short_x0020_Description_x0020_On}
                                  </td> */}
                                {(entry?.leavediscriptionPlanned.length > 0 || expandedVal == "Planned" || expandedIndexLeave === index) && (
                                  <fieldset className="LeaveType">
                                    <legend className="LeaveTypeName">
                                      Planned:&nbsp;{" "}
                                      {entry?.leavediscriptionPlanned.length}{" "}
                                    </legend>
                                    <>
                                      {entry?.leavediscriptionPlanned?.map(
                                        (leave: any) => (
                                          <div className="LeaveData-Row">
                                            <span className="LeaveDate">
                                              {leave.eventDate !== leave.endDate
                                                ? `${leave.eventDate} - ${leave.endDate}`
                                                : leave.eventDate}
                                            </span>
                                            <span className="LeaveShortDescription">
                                              {
                                                leave.Short_x0020_Description_x0020_On
                                              }
                                            </span>
                                            <span className="LeaveStatus">
                                              {leave.isApproved}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </>
                                  </fieldset>
                                )}
                                {(entry?.leavediscriptionUnPlanned.length >
                                  0 || expandedVal == "Un-Planned" || expandedIndexLeave === index)&& (
                                  <fieldset className="LeaveType">
                                    <legend className="LeaveTypeName">
                                      Un-planned:&nbsp;{" "}
                                      {entry?.leavediscriptionUnPlanned.length}{" "}
                                    </legend>
                                    <>
                                      {entry?.leavediscriptionUnPlanned?.map(
                                        (leave: any) => (
                                          <div className="LeaveData-Row">
                                            <span className="LeaveDate">
                                              {leave.eventDate !== leave.endDate
                                                ? `${leave.eventDate} - ${leave.endDate}`
                                                : leave.eventDate}
                                            </span>
                                            <span className="LeaveShortDescription">
                                              {
                                                leave.Short_x0020_Description_x0020_On
                                              }
                                            </span>
                                            <span className="LeaveStatus">
                                              {leave.isApproved}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </>
                                  </fieldset>
                                )}
                                {(entry?.leavediscriptionRh?.length > 0  || expandedVal =="RH" || expandedIndexLeave === index) && (
                                  <fieldset className="LeaveType">
                                    <legend className="LeaveTypeName">
                                      RH:&nbsp;{" "}
                                      {entry?.leavediscriptionRh?.length}{" "}
                                    </legend>
                                    <>
                                      {entry?.leavediscriptionRh?.map(
                                        (leave: any) => (
                                          <div className="LeaveData-Row">
                                            <span className="LeaveDate">
                                              {leave.eventDate}
                                            </span>
                                            <span className="LeaveShortDescription">
                                              {
                                                leave.Short_x0020_Description_x0020_On
                                              }
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </>
                                  </fieldset>
                                )}
                                {(entry?.leavediscriptionHalfday?.length > 0   || expandedVal =="Halfday" || expandedIndexLeave === index) && (
                                  <fieldset className="LeaveType">
                                    <legend className="LeaveTypeName">
                                      HalfDay:&nbsp;{" "}
                                      {entry?.leavediscriptionHalfday?.length}{" "}
                                    </legend>
                                    <>
                                      {entry?.leavediscriptionHalfday?.map(
                                        (leave: any) => (
                                          <div className="LeaveData-Row">
                                            <span className="LeaveDate">
                                              {leave.eventDate}
                                            </span>
                                            <span className="LeaveShortDescription">
                                              {
                                                leave.Short_x0020_Description_x0020_On
                                              }
                                            </span>
                                            <span className="LeaveShortDescription">
                                              {leave.isApproved}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </>
                                  </fieldset>
                                )}
                              </tr>
                            </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Panel>
      <>
        {PreSetPanelIsOpen && (
          <PreSetDatePikerPannel
            isOpen={PreSetPanelIsOpen}
            PreSetPikerCallBack={PreSetPikerCallBack}
            selectedType={selectedType}
          />
        )}
      </>
    </div>
  );
};