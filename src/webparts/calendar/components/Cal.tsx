import React, { useState, useEffect } from "react";
import { Calendar, View, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Web } from "sp-pnp-js";
import { parseString } from 'xml2js';
import { DatePicker, Dropdown, Panel, PanelType, TextField, Toggle } from "office-ui-fabric-react";
import ReactQuill from "react-quill";
import * as globalCommon from '../../../globalComponents/globalCommon'
import { EventRecurrenceInfo } from "../../calendar/components/EventRecurrenceControls/EventRecurrenceInfo/EventRecurrenceInfo";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import Tooltip from "../../../globalComponents/Tooltip";
import VersionHistoryPopup from "../../../globalComponents/VersionHistroy/VersionHistory";
import { v4 as uuidv4 } from "uuid";
import { SPHttpClient } from "@microsoft/sp-http";
import { MonthlyLeaveReport } from "../../calendar/components/MonthlyLeaveReport";
import "react-quill/dist/quill.snow.css";
import { FaPaperPlane } from "react-icons/fa";
import EmailComponenet from "../../calendar/components/email";
import moment from 'moment-timezone';
import "./style.css";
import 'core-js/es/object/values';
import "@pnp/sp/sputilities";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import * as GlobalCommon from '../../../globalComponents/globalCommon';
moment.locale("en-GB");
let createdBY: any,
  modofiedBy: any,
  CTime: any,
  CDate: any,
  MTime: any,
  MDate: any,
  HalfDaye: any = false,
  HalfDayT: any = false,
  localArr: any = [],

  vHistory: any = [];
let startTime: any,

  eventPass: any = {},
  endTime: any,
  allDay: any = false,
  title_people: any,
  title_Id: any;
let maxD = new Date(8640000000000000);

let events: any = [];
let userData: any = []
const localizer = momentLocalizer(moment);
const today: Date = new Date();
const minDate: Date = today;
let queryevent: any;
let userEmail: any;
let ApproveruserEmail: any;
let backuprecurringarr: any = [];
let leaveapproved = false;
let leaverejected = false;

const leaveTypes = [
  { key: "Sick", text: "Sick" },
  { key: "Planned Leave", text: "Planned" },
  { key: "Un-Planned", text: "Un-Planned" },
  { key: "Restricted Holiday", text: "Restricted Holiday" },
  { key: "LWP", text: "LWP" },
  { key: "Work From Home", text: "Work From Home" },
  { key: "Company Holiday", text: "Company Holiday" },
  { key: "National Holiday", text: "National Holiday" }


];
let AllTaskUser: any = []
const Designation = [
  { key: "SPFx", text: "SPFx" },
  { key: "Shareweb (Contact)", text: "Shareweb (Contact) " },
  { key: "Shareweb (ANC)", text: "Shareweb (ANC) " },
  { key: "Shareweb (Project)", text: "Shareweb (Project) " },
  { key: "QA", text: "QA " },
  { key: "Design", text: "Design" },
  { key: "HR", text: "HR" },
  { key: "Admin", text: "Admin" },
  { key: "Management", text: "Management" },
  { key: "Mobile", text: "Mobile" },
  { key: "JTM (Junior Task Manager)", text: "JTM (Junior Task Manager)" }
];
let newEvent: any
const Apps = (props: any) => {
  const [hasDeletePermission, setHasDeletePermission]: any = React.useState(false);
  const [leaveReport, setleaveReport] = React.useState(false);
  const [recurringEvents, setRecurringEvents] = useState([]);
  const [m, setm]: any = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showM, setShowM] = React.useState([]);
  const [startDate, setStartDate]: any = React.useState(null);
  const [endDate, setEndDate]: any = React.useState(null);
  const [chkName, setChkName]: any = React.useState("");
  const [type, setType]: any = React.useState("");
  const [dType, sedType]: any = React.useState("");
  const [isFirstHalfDChecked, setIsFirstHalfDChecked] = React.useState(false);
  const [isSecondtHalfDChecked, setisSecondtHalfDChecked] = React.useState(false);
  const [EmailReciptents, setEmailReciptents] = React.useState([]);
  const [ApplyEmailReciptents, setApplyEmailReciptents] = React.useState([]);
  const [inputValueName, setInputValueName] = React.useState("");
  const [inputValueReason, setInputValueReason] = React.useState("");
  const [vId, setVId] = React.useState();
  const [disabl, setdisabl] = React.useState(false);
  const [disab, setdisab] = React.useState(false);
  const [dt, setDt] = React.useState();
  const [selectedTime, setSelectedTime]: any = React.useState();
  const [selectedTimeEnd, setSelectedTimeEnd]: any = React.useState();
  const [location, setLocation]: any = React.useState();

  const [email, setEmail]: any = React.useState(false);
  const [todayEvent, setTodayEvent]: any = React.useState(false);
  const [peopleName, setPeopleName]: any = React.useState();
  const [peopleId, setPeopleId]: any = React.useState();
  const [isChecked, setIsChecked] = React.useState(false);
  const [disableTime, setDisableTime] = React.useState(false);
  const [selectedPeople, setSelectedPeople] = React.useState([]);
  const [showRecurrence, setshowRecurrence] = React.useState(false);
  const [peoplePickerShow, setPeoplePickerShow] = React.useState(true);
  const [IsDisableField, setIsDisableField] = React.useState(false);
  const [newRecurrenceEvent, setNewRecurrenceEvent] = React.useState(false);
  const [editRecurrenceEvent, setEditRecurrenceEvent] = React.useState(false);
  const [returnedRecurrenceInfo, setReturnedRecurrenceInfo] =
    React.useState(null);
  const [recurrenceData, setRecurrenceData] = React.useState(null);
  const [view, setview] = React.useState('month');

  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [details, setDetails]: any = React.useState([]);
  const [showRecurrenceSeriesInfo, setShowRecurrenceSeriesInfo] =
    React.useState(false);
  const [showTextarea, setShowTextarea] = useState(false);
  const [comment, setComment] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  // For get query data from the querystring 
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get('Id');


  // Generic funtion to send email
  const SendEmailMessage = (body: any, subject: any, to: any, Text: any) => {
    let sp = spfi().using(spSPFx(props?.props?.context));
    sp.utility
      .sendEmail({
        Body: body,
        Subject: subject,
        To: to,
        AdditionalHeaders: {
          "content-type": "text/html"
        },
      })
      .then(() => {
        console.log("Email Sent!");
        alert(`${Text} Sent Successfully!`);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Error sending email. Please try again.");
      });
  }
  // Generic funtion to send email is end here
  const deCodeHtmlEntities = async (string: string) => {
    const HtmlEntitiesMap = {
      "'": "&#39;",
      "<": "&lt;",
      ">": "&gt;",
      " ": "&nbsp;",
      "¡": "&iexcl;",
      "¢": "&cent;",
      "£": "&pound;",
      "¤": "&curren;",
      "¥": "&yen;",
      "¦": "&brvbar;",
      "§": "&sect;",
      "¨": "&uml;",
      "©": "&copy;",
      "ª": "&ordf;",
      "«": "&laquo;",
      "¬": "&not;",
      "®": "&reg;",
      "¯": "&macr;",
      "°": "&deg;",
      "±": "&plusmn;",
      "²": "&sup2;",
      "³": "&sup3;",
      "´": "&acute;",
      "µ": "&micro;",
      "¶": "&para;",
      "·": "&middot;",
      "¸": "&cedil;",
      "¹": "&sup1;",
      "º": "&ordm;",
      "»": "&raquo;",
      "¼": "&frac14;",
      "½": "&frac12;",
      "¾": "&frac34;",
      "¿": "&iquest;",
      "À": "&Agrave;",
      "Á": "&Aacute;",
      "Â": "&Acirc;",
      "Ã": "&Atilde;",
      "Ä": "&Auml;",
      "Å": "&Aring;",
      "Æ": "&AElig;",
      "Ç": "&Ccedil;",
      "È": "&Egrave;",
      "É": "&Eacute;",
      "Ê": "&Ecirc;",
      "Ë": "&Euml;",
      "Ì": "&Igrave;",
      "Í": "&Iacute;",
      "Î": "&Icirc;",
      "Ï": "&Iuml;",
      "Ð": "&ETH;",
      "Ñ": "&Ntilde;",
      "Ò": "&Ograve;",
      "Ó": "&Oacute;",
      "Ô": "&Ocirc;",
      "Õ": "&Otilde;",
      "Ö": "&Ouml;",
      "×": "&times;",
      "Ø": "&Oslash;",
      "Ù": "&Ugrave;",
      "Ú": "&Uacute;",
      "Û": "&Ucirc;",
      "Ü": "&Uuml;",
      "Ý": "&Yacute;",
      "Þ": "&THORN;",
      "ß": "&szlig;",
      "à": "&agrave;",
      "á": "&aacute;",
      "â": "&acirc;",
      "ã": "&atilde;",
      "ä": "&auml;",
      "å": "&aring;",
      "æ": "&aelig;",
      "ç": "&ccedil;",
      "è": "&egrave;",
      "é": "&eacute;",
      "ê": "&ecirc;",
      "ë": "&euml;",
      "ì": "&igrave;",
      "í": "&iacute;",
      "î": "&icirc;",
      "ï": "&iuml;",
      "ð": "&eth;",
      "ñ": "&ntilde;",
      "ò": "&ograve;",
      "ó": "&oacute;",
      "ô": "&ocirc;",
      "õ": "&otilde;",
      "ö": "&ouml;",
      "÷": "&divide;",
      "ø": "&oslash;",
      "ù": "&ugrave;",
      "ú": "&uacute;",
      "û": "&ucirc;",
      "ü": "&uuml;",
      "ý": "&yacute;",
      "þ": "&thorn;",
      "ÿ": "&yuml;",
      "Œ": "&OElig;",
      "œ": "&oelig;",
      "Š": "&Scaron;",
      "š": "&scaron;",
      "Ÿ": "&Yuml;",
      "ƒ": "&fnof;",
      "ˆ": "&circ;",
      "˜": "&tilde;",
      "Α": "&Alpha;",
      "Β": "&Beta;",
      "Γ": "&Gamma;",
      "Δ": "&Delta;",
      "Ε": "&Epsilon;",
      "Ζ": "&Zeta;",
      "Η": "&Eta;",
      "Θ": "&Theta;",
      "Ι": "&Iota;",
      "Κ": "&Kappa;",
      "Λ": "&Lambda;",
      "Μ": "&Mu;",
      "Ν": "&Nu;",
      "Ξ": "&Xi;",
      "Ο": "&Omicron;",
      "Π": "&Pi;",
      "Ρ": "&Rho;",
      "Σ": "&Sigma;",
      "Τ": "&Tau;",
      "Υ": "&Upsilon;",
      "Φ": "&Phi;",
      "Χ": "&Chi;",
      "Ψ": "&Psi;",
      "Ω": "&Omega;",
      "α": "&alpha;",
      "β": "&beta;",
      "γ": "&gamma;",
      "δ": "&delta;",
      "ε": "&epsilon;",
      "ζ": "&zeta;",
      "η": "&eta;",
      "θ": "&theta;",
      "ι": "&iota;",
      "κ": "&kappa;",
      "λ": "&lambda;",
      "μ": "&mu;",
      "ν": "&nu;",
      "ξ": "&xi;",
      "ο": "&omicron;",
      "π": "&pi;",
      "ρ": "&rho;",
      "ς": "&sigmaf;",
      "σ": "&sigma;",
      "τ": "&tau;",
      "υ": "&upsilon;",
      "φ": "&phi;",
      "χ": "&chi;",
      "ψ": "&psi;",
      "ω": "&omega;",
      "ϑ": "&thetasym;",
      "ϒ": "&Upsih;",
      "ϖ": "&piv;",
      "–": "&ndash;",
      "—": "&mdash;",
      "‘": "&lsquo;",
      "’": "&rsquo;",
      "‚": "&sbquo;",
      "“": "&ldquo;",
      "”": "&rdquo;",
      "„": "&bdquo;",
      "†": "&dagger;",
      "‡": "&Dagger;",
      "•": "&bull;",
      "…": "&hellip;",
      "‰": "&permil;",
      "′": "&prime;",
      "″": "&Prime;",
      "‹": "&lsaquo;",
      "›": "&rsaquo;",
      "‾": "&oline;",
      "⁄": "&frasl;",
      "€": "&euro;",
      "ℑ": "&image;",
      "℘": "&weierp;",
      "ℜ": "&real;",
      "™": "&trade;",
      "ℵ": "&alefsym;",
      "←": "&larr;",
      "↑": "&uarr;",
      "→": "&rarr;",
      "↓": "&darr;",
      "↔": "&harr;",
      "↵": "&crarr;",
      "⇐": "&lArr;",
      "⇑": "&UArr;",
      "⇒": "&rArr;",
      "⇓": "&dArr;",
      "⇔": "&hArr;",
      "∀": "&forall;",
      "∂": "&part;",
      "∃": "&exist;",
      "∅": "&empty;",
      "∇": "&nabla;",
      "∈": "&isin;",
      "∉": "&notin;",
      "∋": "&ni;",
      "∏": "&prod;",
      "∑": "&sum;",
      "−": "&minus;",
      "∗": "&lowast;",
      "√": "&radic;",
      "∝": "&prop;",
      "∞": "&infin;",
      "∠": "&ang;",
      "∧": "&and;",
      "∨": "&or;",
      "∩": "&cap;",
      "∪": "&cup;",
      "∫": "&int;",
      "∴": "&there4;",
      "∼": "&sim;",
      "≅": "&cong;",
      "≈": "&asymp;",
      "≠": "&ne;",
      "≡": "&equiv;",
      "≤": "&le;",
      "≥": "&ge;",
      "⊂": "&sub;",
      "⊃": "&sup;",
      "⊄": "&nsub;",
      "⊆": "&sube;",
      "⊇": "&supe;",
      "⊕": "&oplus;",
      "⊗": "&otimes;",
      "⊥": "&perp;",
      "⋅": "&sdot;",
      "⌈": "&lceil;",
      "⌉": "&rceil;",
      "⌊": "&lfloor;",
      "⌋": "&rfloor;",
      "⟨": "&lang;",
      "⟩": "&rang;",
      "◊": "&loz;",
      "♠": "&spades;",
      "♣": "&clubs;",
      "♥": "&hearts;",
      "♦": "&diams;"
    };

    const entityMap = HtmlEntitiesMap;

    for (const key in entityMap) {
      const entity = entityMap[key as keyof typeof entityMap];
      const regex = new RegExp(entity, "g");
      string = string.replace(regex, key);
    }
    string = string.replace(/&quot;/g, '"');
    string = string.replace(/&amp;/g, "&");
    return string;
  };
  const LoadAllNotificationConfigrations = async () => {
    let pageInfo = await globalCommon.pageContext()
    let permission = false;
    if (pageInfo?.WebFullUrl) {
      let web = new Web(pageInfo.WebFullUrl);

      web.lists.getByTitle('NotificationsConfigration').items.select('Id,ID,Modified,Created,Title,Author/Id,Author/Title,Editor/Id,Editor/Title,Recipients/Id,Recipients/Title,ConfigType,ConfigrationJSON,Subject,PortfolioType/Id,PortfolioType/Title').expand('Author,Editor,Recipients ,PortfolioType').get().then((result: any) => {
        //  let Notificationdata =  result?.filter((item:any)=>item?.Title == 'CalendarNotification' && item?.Title == 'ApplyLeaveNotification' )
        result?.map((data: any) => {
          data.showUsers = ""
          data.DisplayModifiedDate = moment(data.Modified).format("DD/MM/YYYY");
          if (data.DisplayModifiedDate == "Invalid date" || "") {
            data.DisplayModifiedDate = data.DisplayModifiedDate.replaceAll("Invalid date", "");
          }
          data.DisplayCreatedDate = moment(data.Created).format("DD/MM/YYYY");
          if (data.DisplayCreatedDate == "Invalid date" || "") {
            data.DisplayCreatedDate = data.DisplayCreatedDate.replaceAll("Invalid date", "");
          }
          if (data?.Recipients?.length > 0 && data?.Title == 'CalendarNotification') {
            let copyRecipients = AllTaskUser.filter((user: any) => data.Recipients.find((data2: any) => user.AssingedToUserId == data2.Id))
            setEmailReciptents(copyRecipients)
          } if (data?.Recipients?.length > 0 && data?.Title == 'ApplyLeaveNotification') {
            let copyRecipients = AllTaskUser.filter((user: any) => data.Recipients.find((data2: any) => user.AssingedToUserId == data2.Id))
            setApplyEmailReciptents(copyRecipients)
          }
        })

      })

    }
    return permission;
  }
  const getTaskUser = async () => {
    let web = new Web(props.props.siteUrl);
    await web.lists
      .getById(props.props.TaskUserListID)
      .items.orderBy("Created", true)
      .filter("UserGroupId ne 295")
      .get()
      .then((Data: any[]) => {
        console.log(Data);
        AllTaskUser = Data
        const mydata = Data.filter((item) => item.UserGroupId != null && item?.UserGroupId != 131 && item?.UserGroupId != 147 && item.AssingedToUserId != 9)

      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };
  useEffect(() => {
    getTaskUser()
    LoadAllNotificationConfigrations()
    getEvents();
  }, []);
  function parseRecurrence(recurrenceData: any) {
    const dates: any[] = [];
    const AllEvents: any = []
    try {
      parseString(recurrenceData?.RecurrenceData, (err: any, result: any) => {
        if (err || !result || !result.recurrence) {
          console.error('Error parsing XML:', err);
          return;
        }

        const { recurrence } = result;
        const rule = recurrence?.rule?.[0];
        const firstDayOfWeek = rule?.firstDayOfWeek || 'su';
        const startDate = new Date(recurrenceData?.EventDate);
        startDate.setDate(startDate.getDate() - 1);
        let repeatInstance = 0;

        if (rule?.repeatInstances && rule.repeatInstances[0] > 0) {
          repeatInstance = Number(rule.repeatInstances[0]);
        }
        let useCount = false
        if (recurrenceData?.RecurrenceData?.includes('daily')) {
          useCount = true
        }
        let count = 0;
        let windowEndDate: any;
        if (rule?.repeatForever && rule?.repeatForever[0] === 'FALSE') {
          if (rule?.windowEnd == undefined) {
            let createenddate = new Date(recurrenceData?.EndDate);
            createenddate.setHours(0, 0, 0, 0);
            createenddate.setDate(createenddate.getDate() + 1000);
            createenddate.setHours(0, 0, 0, 0);
            windowEndDate = createenddate;
          }
        } else if (repeatInstance && repeatInstance > 0) {
          let repeatInstanceEndDate =new Date(recurrenceData?.EventDate);
          repeatInstanceEndDate.setHours(0, 0, 0, 0);
          if(recurrenceData?.RecurrenceData?.includes('daily')){
          repeatInstanceEndDate.setDate(repeatInstanceEndDate.getDate() + repeatInstance);
          }
          repeatInstanceEndDate.setDate(repeatInstanceEndDate.getDate() + repeatInstance);
          repeatInstanceEndDate.setHours(0, 0, 0, 0);
          windowEndDate = repeatInstanceEndDate;
        }
        else {
          windowEndDate = rule.windowEnd ? new Date(rule.windowEnd[0]).setHours(0, 0, 0, 0) : new Date(recurrenceData?.EndDate).setHours(0, 0, 0, 0);
        }
        while (dates.length < repeatInstance || new Date(dates[dates.length - 1] || startDate).setHours(0, 0, 0, 0) < windowEndDate) {
          if ((repeatInstance != 0 ? count > repeatInstance : new Date(dates[dates.length - 1]).setHours(0, 0, 0, 0) > windowEndDate) && useCount == true) {
            break
          }
          count++;
          if (calculateNextDate(rule, firstDayOfWeek, new Date(dates[dates.length - 1] || startDate), dates, windowEndDate, AllEvents, recurrenceData) === 'break')
            break;
        }
        if (AllEvents?.length > 0) {
          const { repeat } = rule;
          const repeatType = Object.keys(repeat[0])[0];
          let currentDate: any = new Date(dates[0])
          let event: any = {};
          switch (repeatType) {

            case 'yearly':
              currentDate.setFullYear(currentDate.getFullYear() - 1);
              event = eventDataForBinding(recurrenceData, currentDate)
              AllEvents?.push(event)
              dates.push(new Date(currentDate));
              break;
            case 'monthly':
              let MonthToBeIncreased = currentDate.getMonth() - 1;
              currentDate = currentDate.setMonth(MonthToBeIncreased);
              event = eventDataForBinding(recurrenceData, currentDate);
              AllEvents?.push(event);
              dates.push(new Date(currentDate));
              break;


            default:
              return 'break';
          }
        }
      });
    } catch (error) {
      console.error("Parsing error", error);
    }

    return AllEvents;
  }
  function getKeyWithValueTrue(obj: { [key: string]: string }): [] | undefined {
    let results: any = []
    for (const key in obj) {
      if (obj[key] === "TRUE") {
        results?.push(key);
      }
    }
    return results;
  }
  const eventDataForBinding = (eventDetails: any, currentDate: any) => {
    let event: any = {};
    event = {
      ...eventDetails,
      EndDate: new Date(currentDate).toISOString(),
      EventDate: new Date(currentDate).toISOString(),
      title: eventDetails.Title,
      start: new Date(currentDate),
      end: new Date(currentDate)
    };
    return event;
  }


  function handleDailyRecurrence(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any, repeatInstance: any) {
    const dayFrequency = parseInt(frequency?.dayFrequency != undefined ? frequency?.dayFrequency : 1);
    let count = 0;

    if (frequency?.weekday === 'TRUE') {
      // Function to get the next weekday date
      const getNextWeekday = (date: any) => {
        let nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        while (nextDate.getDay() === 0 || nextDate.getDay() === 6) { // Skip Sunday (0) and Saturday (6)
          nextDate.setDate(nextDate.getDate() + 1);
        }
        return nextDate;
      };

      while (count < repeatInstance && new Date(currentDate).setHours(0, 0, 0, 0) < windowEndDate) {
        currentDate = getNextWeekday(currentDate);
        if (new Date(currentDate).setHours(0, 0, 0, 0) >= windowEndDate) break;

        const event = eventDataForBinding(eventDetails, currentDate);
        AllEvents.push(event);
        dates.push(new Date(currentDate));
        count++;
      }

      // Add the next date after windowEndDate
      let nextDate: any = currentDate;
      nextDate.setDate(nextDate.getDate() + dayFrequency);
      const event = eventDataForBinding(eventDetails, nextDate);
      AllEvents.push(event);
      dates.push(new Date(nextDate));
    } else {
      while (count < repeatInstance && new Date(currentDate).setHours(0, 0, 0, 0) < windowEndDate) {
        currentDate.setDate(currentDate.getDate() + dayFrequency);
        if (new Date(currentDate).setHours(0, 0, 0, 0) >= windowEndDate) break;

        const event = eventDataForBinding(eventDetails, currentDate);
        AllEvents.push(event);
        dates.push(new Date(currentDate));
        count++;
      }

      // Add the next date after windowEndDate
      let nextDate: any = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + dayFrequency);
      const event = eventDataForBinding(eventDetails, nextDate);
      AllEvents.push(event);
      dates.push(new Date(nextDate));
    }
    return '';
  }


  function getWeekDays(today: any) {
    const currentDay = today.getDay();
    const monday = new Date(today);
    const dates = [];

    if (currentDay >= 1 && currentDay <= 4) { // Monday to Thursday
      monday.setDate(today.getDate() - currentDay + 1);
    } else { // Friday to Sunday
      monday.setDate(today.getDate() + (8 - currentDay)); // Next Monday
    }

    for (let i = 0; i < 5; i++) {
      dates.push(new Date(monday.getTime() + i * 24 * 60 * 60 * 1000));
    }

    return dates;
  }

  function handleWeeklyRecurrence(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any) {
    const { weekFrequency } = frequency;
    const daysOfWeekIndex = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

    // Get the days of the week that are marked as TRUE
    const daysOfWeek = daysOfWeekIndex.filter(day => frequency[day] === "TRUE");

    while (true) {
      let added = false;
      for (const day of daysOfWeek) {
        let targetDayIndex = daysOfWeekIndex.indexOf(day);
        let daysToAdd = targetDayIndex - currentDate.getDay();
        if (daysToAdd < 0) daysToAdd += 7;

        let targetDate: any = new Date(currentDate);
        targetDate.setDate(currentDate.getDate() + daysToAdd);

        if (targetDate.setHours(0, 0, 0, 0) > windowEndDate) {
          if (!added) {
            dates.push(new Date(targetDate));
            added = true;
          }
          return;
        }

        const event = eventDataForBinding(eventDetails, targetDate);
        AllEvents.push(event);
        dates.push(new Date(targetDate));
      }

      currentDate.setDate(currentDate.getDate() + (weekFrequency * 7));
    }
  }
  function handleMonthlyByDay(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any) {
    const { monthFrequency, weekdayOfMonth } = frequency;
    const daysOfWeekIndex = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    const weekMap: any = { first: 1, second: 2, third: 3, fourth: 4, last: 5 };


    const monthFreq = parseInt(monthFrequency, 10);

    const processEvent = (dayIndexes: number[], isSpecificDay: boolean = false) => {
      while (true) {
        for (const dayIndex of dayIndexes) {
          const targetDate: any = isSpecificDay
            ? new Date(currentDate.getFullYear(), currentDate.getMonth(), weekMap[weekdayOfMonth])
            : getNthWeekdayOfMonth(currentDate.getFullYear(), currentDate.getMonth(), dayIndex, weekMap[weekdayOfMonth]);

          if (targetDate.setHours(0, 0, 0, 0) > windowEndDate) {
            dates.push(new Date(targetDate));
            return; // Exit the loop once window end date is exceeded
          }

          const event = eventDataForBinding(eventDetails, targetDate);
          AllEvents.push(event);
          dates.push(new Date(targetDate));
        }
        currentDate.setMonth(currentDate.getMonth() + monthFreq);
      }
    };
    if (frequency?.day === "TRUE") {
      // Process specific day based on weekdayOfMonth
      const targetDayIndexes = [weekMap[weekdayOfMonth]]; // Specific day of the month
      processEvent(targetDayIndexes, true);
    } else if (frequency?.weekday === "TRUE") {
      // Process weekdays (Monday to Friday)
      const targetDayIndexes = [1, 2, 3, 4, 5]; // Monday to Friday
      processEvent(targetDayIndexes);
    } else if (frequency?.weekend_day === "TRUE") {
      // Process weekends (Saturday and Sunday)
      const targetDayIndexes = [0, 6]; // Sunday and Saturday
      processEvent(targetDayIndexes);
    } else {
      // Process specific days of the week
      const keys: any = Object.keys(frequency);
      for (let i = 0; i < daysOfWeekIndex.length; i++) {
        const key = daysOfWeekIndex[i];
        if (keys.includes(key) && frequency[key] === "TRUE") {
          const targetDayIndex = i;
          processEvent([targetDayIndex]);
          break;
        }
      }
    }



  }

  // Helper function to get the nth weekday of a given month
  function getNthWeekdayOfMonth(year: number, month: number, dayOfWeek: number, nth: number): Date {
    let firstDay = new Date(year, month, 1).getDay();
    let day = (dayOfWeek - firstDay + 7) % 7 + 1;
    let date = day + (nth - 1) * 7;

    // If nth is 'last', adjust the date to the last occurrence of the day
    if (nth === 5) {
      let lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      while (date + 7 <= lastDayOfMonth) {
        date += 7;
      }
    }

    return new Date(year, month, date);
  }
  function handleYearlyByDay(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any) {
    const { yearFrequency, weekdayOfMonth, month } = frequency;
    const daysOfWeekIndex = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    const weekMap: any = { first: 1, second: 2, third: 3, fourth: 4, last: 5 };

    const yearFreq = parseInt(yearFrequency, 10);

    const processEvent = (dayIndexes: number[], isSpecificDay: boolean = false) => {
      while (true) {
        for (const dayIndex of dayIndexes) {
          const targetDate: any = isSpecificDay
            ? new Date(currentDate.getFullYear(), Number(month) - 1, weekMap[weekdayOfMonth])
            : getNthWeekdayOfMonth(currentDate.getFullYear(), Number(month) - 1, dayIndex, weekMap[weekdayOfMonth]);

          if (targetDate.setHours(0, 0, 0, 0) > windowEndDate) {
            dates.push(new Date(targetDate));
            return; // Exit the loop once window end date is exceeded
          }

          const event = eventDataForBinding(eventDetails, targetDate);
          AllEvents.push(event);
          dates.push(new Date(targetDate));
        }
        currentDate.setFullYear(currentDate.getFullYear() + yearFreq);
      }
    };

    if (frequency?.day === "TRUE") {
      // Process specific day based on weekdayOfMonth
      const targetDayIndexes = [weekMap[weekdayOfMonth]]; // Specific day of the month
      processEvent(targetDayIndexes, true);
    } else if (frequency?.weekday === "TRUE") {
      // Process weekdays (Monday to Friday)
      const targetDayIndexes = [1, 2, 3, 4, 5]; // Monday to Friday
      processEvent(targetDayIndexes);
    } else if (frequency?.weekend_day === "TRUE") {
      // Process weekends (Saturday and Sunday)
      const targetDayIndexes = [0, 6]; // Sunday and Saturday
      processEvent(targetDayIndexes);
    } else {
      // Process specific days of the week
      const keys: any = Object.keys(frequency);
      for (let i = 0; i < daysOfWeekIndex.length; i++) {
        const key = daysOfWeekIndex[i];
        if (keys.includes(key) && frequency[key] === "TRUE") {
          const targetDayIndex = i;
          processEvent([targetDayIndex]);
          break;
        }
      }
    }
  }

  function calculateNextDate(rule: any, firstDayOfWeek: string, currentDate: any, dates: Date[], endDate?: any, AllEvents?: any, eventDetails?: any): string {
    try {
      const { repeat } = rule;
      const repeatType = Object.keys(repeat[0])[0];
      const frequency = repeat[0][repeatType][0].$;
      let event: any = {};

      switch (repeatType) {
        case 'daily':
          if (handleDailyRecurrence(frequency, currentDate, dates, AllEvents, eventDetails, endDate, rule.repeatInstances ? parseInt(rule.repeatInstances[0]) : 1000) === 'break') {
            return 'break';
          }
          break;
        case 'weekly':
          handleWeeklyRecurrence(frequency, currentDate, dates, AllEvents, eventDetails, endDate);
          break;
        case 'monthly':
          let { monthFrequency, dayOfMonth } = frequency;
          if (dayOfMonth == undefined && frequency?.day != undefined) {
            dayOfMonth = frequency?.day;
          }
          currentDate.setDate(Number(dayOfMonth));
          currentDate = currentDate.setMonth(currentDate.getMonth() + Number(monthFrequency));

          event = eventDataForBinding(eventDetails, currentDate);
          AllEvents?.push(event);
          dates.push(new Date(currentDate));
          break;
        case 'monthlyByDay':
          handleMonthlyByDay(frequency, currentDate, dates, AllEvents, eventDetails, endDate);
          break;
        case 'yearlyByDay':
          handleYearlyByDay(frequency, currentDate, dates, AllEvents, eventDetails, endDate);
          break;

        case 'yearly':
          const { yearFrequency, month, day } = frequency;
          currentDate.setMonth(Number(month) - 1);
          currentDate.setDate(Number(day));
          currentDate.setFullYear(currentDate.getFullYear() + Number(yearFrequency));
          event = eventDataForBinding(eventDetails, currentDate)
          AllEvents?.push(event)
          dates.push(new Date(currentDate));
          break;
        default:
          return 'break';
      }
    } catch (error) {
      console.error("Date creation error", error);
    }
    return '';
  }


  // this prepare the property 


  function processDataArray(array: any[]) {
    return array.map((item: any) => {
      const dataEvent = {
        shortD: item.Title,
        iD: item.ID,
        NameId: item?.Employee?.Id,
        title: item.Title,
        start: item.start,
        end: item.end,
        location: item.Location,
        desc: item.Description,
        alldayevent: item.fAllDayEvent,
        eventType: item.Event_x002d_Type,
        created: item.Author.Title,
        modify: item.Editor.Title,
        cTime: item.Created,
        mTime: item.Modified,
        Name: item.Employee?.Title,
        Designation: item.Designation,
        HalfDay: item.HalfDay,
        HalfDayTwo: item.HalfDayTwo,
        clickable: item.clickable,
        Color: item.Color,
        Rejected:item.Rejected,
        Approved:item.Approved
      };

      return dataEvent;
    });
  }



  const getEvents = async () => {
    const web = new Web(props.props.siteUrl);
    const regionalSettings = await web.regionalSettings.get(); console.log(regionalSettings);
    const query =
      "RecurrenceData,Duration,Author/Title,Editor/Title,Employee/Id,Employee/Title,Category,Designation,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,HalfDay,HalfDayTwo,Color,Created,Modified,Approved,Rejected";
    try {
      const results = await web.lists
        .getById(props.props.SmalsusLeaveCalendar)
        .items.select(query)
        .expand("Author,Editor,Employee")
        .top(500)
        .getAll();
      if (results && results.length > 0) {
        const NonRecurrenceData = results.filter((item) => item?.RecurrenceData == null);
        const Recurrencedatas = results.filter((item) => item?.RecurrenceData != null && item?.RecurrenceData != 'Every 1 day(s)');
        events = []

        const eventsNonRecurrence = NonRecurrenceData.map(eventDetails => {
          let startdate, enddate;
          if (!eventDetails.fAllDayEvent) {
            startdate = new Date(eventDetails.EventDate);
            enddate = new Date(eventDetails.EndDate);
          } else {
            startdate = new Date(eventDetails.EventDate);
            startdate.setHours(startdate.getHours() + 4);
            startdate.setMinutes(startdate.getMinutes() + 30);
            enddate = new Date(eventDetails.EndDate);
            enddate.setHours(enddate.getHours() - 10);
            enddate.setMinutes(enddate.getMinutes() - 29);
          }
          return {
            ...eventDetails,
            title: eventDetails.Title,
            start: startdate,
            end: enddate
          };
        });


        events = events.concat(eventsNonRecurrence);
        for (const event of Recurrencedatas) {
          let allDates = parseRecurrence(event)
          if (allDates.length > 0) {
            events = events.concat(allDates)
          }
        }
        const currentDate = new Date(); // Get current date
        const currentMonth = currentDate.getMonth() + 1; // Get current month (January is 0, so add 1)
        const currentYear = currentDate.getFullYear(); // Get current year
        const filteredData = events.filter((event: any) => {
          const startDate = new Date(event.start); // Parse start date
          const endDate = new Date(event.end);
          const eventStartYear = startDate.getFullYear();
          const eventStartMonth = startDate.getMonth() + 1; // Months are zero-based
          const eventEndYear = endDate.getFullYear();
          const eventEndMonth = endDate.getMonth() + 1; // Months are zero-based

          return (
            (eventStartYear === currentYear && eventStartMonth === currentMonth) || // Event starts in current month
            (eventEndYear === currentYear && eventEndMonth === currentMonth) || // Event ends in current month
            (eventStartYear < currentYear && eventEndYear > currentYear) || // Event spans across multiple years
            (eventStartYear === currentYear && eventEndYear === currentYear && eventStartMonth < currentMonth && eventEndMonth > currentMonth) // Event spans across multiple months within the same year
          );
        });
        console.log(filteredData); // Display filtered data
        localArr = processDataArray(filteredData);
        setChkName(localArr)
        setRecurringEvents(filteredData);
        backuprecurringarr = filteredData;
        if (filteredData?.length > 0 && id != null) {
          queryevent = filteredData.find((item: any) => item?.Id == id);
          userEmail = AllTaskUser.find((Employee: any) => (Employee?.AssingedToUserId === queryevent?.Employee?.Id))
          ApproveruserEmail = AllTaskUser.find((item: any) => item?.AssingedToUserId == userEmail?.ApproverId[0]);

          leaveapproved = queryevent?.Approved;
          leaverejected = queryevent?.Rejected;
          handleDateClick(queryevent)

        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const allViews = [
    Views.MONTH,
    Views.WEEK,
    Views.WORK_WEEK,
    Views.DAY,
    Views.AGENDA
  ];

  const getLocalDateTime = async (date: string | Date): Promise<string> => {
    try {
      const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/GmBH");
      const localTime = await web.regionalSettings.timeZone.utcToLocalTime(
        date
      );
      return localTime;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getEvent = async (eventId: number) => {
    try {
      const web = new Web(props.props.siteUrl);
      const event = await web.lists
        .getById(props.props.SmalsusLeaveCalendar)
        .items.usingCaching()
        .getById(eventId)
        .select(
          "RecurrenceID",
          "Editor/Title",
          "MasterSeriesItemID",
          "Id",
          "ID",
          "ParticipantsPickerId",
          "EventType",
          "Title",
          "Description",
          "Designation",
          "EventDate",
          "EndDate",
          "Location",
          "Author/SipAddress",
          "Author/Title",
          "Geolocation",
          "fAllDayEvent",
          "fRecurrence",
          "RecurrenceData",
          "Duration",
          "Category",
          "UID",
          "Approved",
          "HalfDay",
          "HalfDayTwo",
          "Color",
          "Created",
          " Modified"
        )
        .expand("Author", "Editor")
        .get();

      const eventDate = await getLocalDateTime(event.EventDate);
      const endDate = await getLocalDateTime(event.EndDate);

      return {
        Id: event.ID,
        ID: event.ID,
        EventType: event.EventType,
        title: event.Title,
        Description: event.Description ? event.Description : "",
        EventDate: new Date(eventDate),
        EndDate: new Date(endDate),
        location: event.Location,
        fAllDayEvent: event.fAllDayEvent,
        Category: event.Category,
        Duration: event.Duration,
        UID: event.UID,
        Designation: event.Designation,
        fRecurrence: event.fRecurrence,
        RecurrenceID: event.RecurrenceID,
        MasterSeriesItemID: event.MasterSeriesItemID
      };
    } catch (error) {
      console.dir(error);
      throw error;
    }
  };
  // Recurrence 
  function getYearMonthFromDate(date: any) {
    const eventDate = new Date(date);
    const eventMonth = eventDate.getMonth() + 1; // Get month of the event
    const eventYear = eventDate.getFullYear(); // Get year of the event
    return { year: eventYear, month: eventMonth };
  }
  const handleNavigate = (newDate: any, newiew: any) => {
    setview(newiew || 'month')
    const { year: currentYear, month: currentMonth } = getYearMonthFromDate(newDate);
    const filteredData = events.filter((event: any) => {
      const startDate = getYearMonthFromDate(event.start);
      const endDate = getYearMonthFromDate(event.end);
      return (
        (startDate.year < currentYear || (startDate.year === currentYear && startDate.month <= currentMonth)) &&
        (endDate.year > currentYear || (endDate.year === currentYear && endDate.month >= currentMonth))
      );
    });
    localArr = processDataArray(filteredData);
    setRecurringEvents(filteredData);
  };


  // Handle Show More 
  const handleShowMore = (event: any, date: any) => {
    // console.log
    const dat = new Date(date);
    const formattedDate: any = dat.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    setDt(formattedDate);

    console.log("clicked", event, date);
    setShowM(event);
    openModal();
  };
  // Handle Select Slot
  const handleSelectSlot = (slotInfo: any) => {
    let yname; // Not sure what this variable is used for, you may need to initialize it with some value or remove it if not needed
    people(yname); // Unclear what this function does and what is expected here
    setLocation("");
    setType("Un-Planned");
    setPeoplePickerShow(true);
    setshowRecurrence(true);
    setRecurrenceData(null);
    setNewRecurrenceEvent(false);
    setShowRecurrenceSeriesInfo(false);
    setEditRecurrenceEvent(false);

    const dateStr = slotInfo.start;
    const date = new Date(dateStr);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let IsOpenAddPopup = true;
    const { start, end } = slotInfo;
    const eventsInSlot = events.filter((event: any) => event.start >= start && event.end <= end);
    if (eventsInSlot !== undefined && eventsInSlot?.length > 0) {
      for (let index = 0; index < eventsInSlot.length; index++) {
        let item = eventsInSlot[index];
        if (item.clickable === false) {
          IsOpenAddPopup = false;
          break;
        }
      }
    }
    console.log('Events in selected slot:', eventsInSlot);

    if (IsOpenAddPopup === true)
      openm();

    maxD = new Date(8640000000000000);
    setdisab(false);
    setdisabl(true);
    setStartDate(slotInfo.start);
    setEndDate(slotInfo.start);
    setSelectedTimeEnd("19:00");
    setSelectedTime("10:00");
    setIsChecked(false);
    setIsFirstHalfDChecked(false);
    setisSecondtHalfDChecked(false);
    setDisableTime(false);
    maxD = new Date(8640000000000000);
  };
  // Handle select Date Click
  const closeModal = () => {
    setIsOpen(false);
  };
  // Handle

  async function handleDateClick(event: any) {
    // queryevent = event;

    queryevent = backuprecurringarr.find((item: any) => item?.Id == event?.Id);
    userEmail = AllTaskUser.find((Employee: any) => (Employee?.AssingedToUserId === queryevent?.Employee?.Id))
    ApproveruserEmail = AllTaskUser.find((item: any) => item?.AssingedToUserId == userEmail?.ApproverId[0]);

    leaveapproved = queryevent?.Approved;
    leaverejected = queryevent?.Rejected;
    console.log(event);
    setInputValueName(event?.Title);
    setshowRecurrence(false);
    setPeoplePickerShow(false);
    setShowRecurrenceSeriesInfo(false);
    setEditRecurrenceEvent(false);
    setType(event?.Event_x002d_Type);

    if (event?.eventType === "Company Holiday" || event?.eventType === "National Holiday") {
      setIsDisableField(true);
    }

    openm();

    if (event.RecurrenceData) {
      setdisab(true);
      eventPass = event;
      setInputValueName(event.Title);
      setdisabl(false);
      setIsChecked(event.alldayevent);
      setIsFirstHalfDChecked(event.HalfDay);
      setisSecondtHalfDChecked(event.HalfDayTwo);

      if (event.alldayevent || event.HalfDay || event.HalfDayTwo) {
        setDisableTime(true);
      }

      setLocation(event.location);
      createdBY = event?.Author?.Title;
      modofiedBy = event?.Editor?.Title;
      setType(event.Event_x002d_Type);
      sedType(event.Designation);
      setInputValueReason(event.Description);
      setVId(event.Id);

      // const eventItem: any = await getEvent(event.Id);
      const startDate = new Date(event.EventDate);
      const endDate = new Date(event.EndDate);
      const startHour = moment(startDate).format("HH").toString();
      const startMin = moment(startDate).format("mm").toString();
      const endHour = moment(endDate).format("HH").toString();
      const endMin = moment(endDate).format("mm").toString();
      MDate = moment(event.Modified).format("DD-MM-YYYY");
      MTime = moment(event.Modified).tz("Asia/Kolkata").format("HH:mm");
      CDate = moment(event.Created).format("DD-MM-YYYY");
      CTime = moment(event.Created).tz("Asia/Kolkata").format("HH:mm");

      setStartDate(startDate);
      setSelectedTime(`${startHour}:${startMin}`);
      setEndDate(endDate);
      setSelectedTimeEnd(`${endHour}:${endMin}`);
      setRecurrenceData(event.RecurrenceData);
      setShowRecurrenceSeriesInfo(true);
      setEditRecurrenceEvent(true);

      return;
    }

    localArr.forEach((item: any) => {
      if (item.iD === event.Id) {
        const Mystartdate = new Date(item.start);
        const MyEnddate = new Date(item.end);
        setdisab(true);
        setVId(item.iD);
        eventPass = event;
        setInputValueName(item.shortD);
        setStartDate(Mystartdate);
        setEndDate(MyEnddate);
        setdisabl(false);
        setIsChecked(item.alldayevent);
        setIsFirstHalfDChecked(item.HalfDay);
        setisSecondtHalfDChecked(item.HalfDayTwo);

        if (item.alldayevent || item.HalfDay || item.HalfDayTwo) {
          setDisableTime(true);
        }

        setLocation(item.location);
        createdBY = item.created;
        modofiedBy = item.modify;
        MDate = moment(item.mTime).format("DD-MM-YYYY");
        MTime = moment(item.mTime).tz("Asia/Kolkata").format("HH:mm");
        CDate = moment(item.cTime).format("DD-MM-YYYY");
        CTime = moment(item.cTime).tz("Asia/Kolkata").format("HH:mm");

        MDate = moment(item.mTime).format("DD-MM-YYYY");
        MTime = moment(item.mTime).tz("Asia/Kolkata").format("HH:mm");
        CDate = moment(item.cTime).format("DD-MM-YYYY");
        CTime = moment(item.cTime).tz("Asia/Kolkata").format("HH:mm");

        setSelectedTime(moment(item.start).tz("Asia/Kolkata").format("HH:mm"));
        setSelectedTimeEnd(moment(item.end).tz("Asia/Kolkata").format("HH:mm"));
        if (item.alldayevent && (!item.HalfDay && !item.HalfDayTwo)) {
          setType(item.eventType);
        } else if (!item.alldayevent && (item.HalfDay || item.HalfDayTwo)) {
          setType('Half Day');
        }
        sedType(item.Designation);
        setInputValueReason(item.desc);
        setRecurrenceData(item.RecurrenceData);
        setEditRecurrenceEvent(false);
      }
    });
  };
  const openm = () => {
    setm(true);
  };

  const DownloadLeaveReport = () => {
    setleaveReport(true);
  }

  const deleteElement = async (eventids: any) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      let web = new Web(props.props.siteUrl);
      await web.lists
        .getById(props.props.SmalsusLeaveCalendar)
        .items.getById(eventids)
        .recycle()
        .then((i: any) => {
          setIsDisabled(false);
          closem(undefined);
          closeModal();
          void getEvents();
        });
    }
  };

  const onRenderCustomHeader = () => {
    return (
      <>
        <div
          style={{
            marginRight: "auto",
            fontSize: "20px",
            fontWeight: "600",
            marginLeft: "20px"

          }}
        >
          <span>
            {(props != undefined || props.props != undefined) && (
              <>
                <span>{props?.props?.description}</span>
              </>
            )}
          </span>
        </div>
        <Tooltip ComponentId={977} />
      </>
    );
  };

  const closem = (e: any) => {
    if (e != undefined && e?.type === 'mousedown')
      setm(true);
    else
      setm(false);
    setInputValueName("");
    setStartDate(null);
    setEndDate(null);
    setType("");
    sedType("");
    setInputValueReason("");
    setIsDisableField(false);
    allDay = "false";
    HalfDaye = "false";
    HalfDayT = "false";
    setIsDisabled(false);
  };
  const returnRecurrenceInfo = (startDate: Date, endDate: Date, recurrenceData: string) => {
    const returnedRecurrenceInfo = {
      recurrenceData: recurrenceData,
      eventDate: startDate,
      endDate: endDate,
    };
    setReturnedRecurrenceInfo(returnedRecurrenceInfo);
    console.log(returnedRecurrenceInfo);
  };

  const eventStyleGetter = (event: any, start: any, end: any, isSelecte: any) => {
    const style = {
      backgroundColor: event.Color, // Set the background color based on the color property in the event data
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block",
    };
    return {
      style,
    };
  };

  // Recurrence 
  const getUtcTime = async (date: string | Date): Promise<string> => {
    const web = new Web(props.props.siteUrl);
    try {
      const utcTime = await web.regionalSettings.timeZone.localTimeToUTC(date);
      return utcTime;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const addEvent = async (newEvent: any) => {
    try {
      const web = new Web(props.props.siteUrl);


      (newEvent.Event_x002d_Type === "Work From Home") ? "#e0a209" :
        ((newEvent.Event_x002d_Type === "Company Holiday") || (newEvent.Event_x002d_Type === "National Holiday")) ? "#228B22" : "";
      let mytitle = newEvent?.Title;
      if (newEvent != undefined && (newEvent?.type == "National Holiday" || newEvent?.type == "Company Holiday")) {
        mytitle = newEvent.type + "-" + newEvent.title;
      }
      const addEventItem = {
        Title: mytitle,
        Description: newEvent.Description,
        EventDate: await getUtcTime(newEvent.EventDate),
        Event_x002d_Type: newEvent.Event_x002d_Type,
        EndDate: await getUtcTime(newEvent.EndDate),
        Location: newEvent.Location,
        Designation: newEvent.Designation,
        fAllDayEvent: newEvent.fAllDayEvent,
        fRecurrence: newEvent.fRecurrence,
        EventType: newEvent.EventType,
        // Color: mycolors,
        UID: newEvent.UID,
        HalfDay: HalfDaye,
        HalfDayTwo: HalfDayT,
        RecurrenceData: newEvent.RecurrenceData ? await deCodeHtmlEntities(newEvent.RecurrenceData) : "",
        MasterSeriesItemID: newEvent.MasterSeriesItemID,
        RecurrenceID: newEvent.RecurrenceID || undefined
      };

      const results = await web.lists.getById(props.props.SmalsusLeaveCalendar).items.add(addEventItem);
      return results;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const editEvent = async (editedEvent: any) => {
    try {
      const web = new Web(props.props.siteUrl);
      // const mycolors = (HalfDaye || HalfDayT) ? "#6d36c5" :
      //   (editedEvent.Event_x002d_Type === "Work From Home") ? "#e0a209" :
      //     ((editedEvent.Event_x002d_Type === "Company Holiday") || (editedEvent.Event_x002d_Type === "National Holiday")) ? "#228B22" : "";

      const editedEventItem = {
        Title: editedEvent.Title,
        Description: editedEvent.Description,
        Event_x002d_Type: editedEvent.Event_x002d_Type,
        EventDate: await getUtcTime(editedEvent.EventDate),
        EndDate: await getUtcTime(editedEvent.EndDate),
        Location: editedEvent.Location,
        Designation: editedEvent.Designation,
        fAllDayEvent: editedEvent.fAllDayEvent,
        fRecurrence: editedEvent.fRecurrence,
        EventType: editedEvent.EventType,
        UID: editedEvent.UID,
        HalfDay: editedEvent.HalfDay,
        HalfDayTwo: editedEvent.HalfDayTwo,
        // Color: mycolors,
        Approved: leaveapproved,
        Rejected: leaverejected,
        RecurrenceData: editedEvent.RecurrenceData ? await deCodeHtmlEntities(editedEvent.RecurrenceData) : "",
        MasterSeriesItemID: editedEvent.MasterSeriesItemID,
        RecurrenceID: editedEvent.RecurrenceID ? editedEvent.RecurrenceID : undefined
      };

      const results = await web.lists.getById(props.props.SmalsusLeaveCalendar)
        .items.getById(eventPass.Id)
        .update(editedEventItem);
      return results;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const saveRecurrenceEvent = async () => {
    try {
      let _startDate: string = `${moment(returnedRecurrenceInfo.eventDate).format("YYYY/MM/DD")}`;
      let _endDate: string = `${moment(returnedRecurrenceInfo.endDate).format("YYYY/MM/DD")}`;

      // Start Date
      const startTime = selectedTime;
      const startDateTime = `${_startDate} ${startTime}`;
      const start = moment(startDateTime, "YYYY/MM/DD HH:mm").toLocaleString();

      // End Date
      const endTime = selectedTimeEnd;
      const endDateTime = `${_endDate} ${endTime}`;
      const end = moment(endDateTime, "YYYY/MM/DD HH:mm").toLocaleString();
      let mytitle = peopleName + "-" + type + "-" + inputValueName;
      let mycolors = (HalfDaye === true || HalfDayT === true) ? "#6d36c5" : type === "Work From Home" ? "#e0a209" : (type === "Company Holiday" || type === "National Holiday") ? "#228B22" : "";

      if (!editRecurrenceEvent) {
        const newEventData: any = {
          EventType: "1",
          EmployeeId: title_Id,
          Title: mytitle,
          Location: location,
          Event_x002d_Type: type,
          Designation: dType,
          Description: '',
          HalfDay: HalfDaye,
          HalfDayTwo: HalfDayT,
          Color: mycolors,
          EventDate: new Date(start),
          EndDate: new Date(end),
          fAllDayEvent: allDay,
          fRecurrence: true,
          RecurrenceData: returnedRecurrenceInfo.recurrenceData,
          UID: uuidv4()
        };
        await addEvent(newEventData);
      } else if (editRecurrenceEvent) {

        const editEventData: any = {
          EventType: "1",
          EmployeeId: title_Id,
          Title: updateAndReplaceType(inputValueName, type, isFirstHalfDChecked, isSecondtHalfDChecked, leaveapproved, leaverejected),
          EventDate: new Date(start),
          EndDate: new Date(end),
          fRecurrence: true,
          RecurrenceData: returnedRecurrenceInfo.recurrenceData,
          UID: uuidv4()
        };
        await editEvent(editEventData);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the recurring event. Please try again.");
    }
  };


  const handleRecurrenceCheck = (
    ev: React.FormEvent<HTMLElement | HTMLInputElement>,
    recurChecked: boolean
  ) => {
    ev.preventDefault();
    setShowRecurrenceSeriesInfo(recurChecked);
    setNewRecurrenceEvent(recurChecked);
  };
  const getUserInfo = async (userMails: string[]): Promise<any[]> => {
    const userInfoArray: any[] = [];
    const userEndPoint: string = `${props.props.context.pageContext.web.absoluteUrl}/_api/Web/EnsureUser`;

    try {
      const requests = userMails.map(async (userMail) => {
        const userData: string = JSON.stringify({ logonName: userMail });
        const userReqData = { body: userData };

        const resUserInfo: any = await props.props.context.spHttpClient.post(userEndPoint, SPHttpClient.configurations.v1, userReqData);

        if (!resUserInfo.ok) {
          throw new Error(`Failed to fetch user info for ${userMail}`);
        }

        const userInfo: any = await resUserInfo.json();
        return userInfo;
      });

      const userInfos = await Promise.all(requests);
      userInfoArray.push(...userInfos);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }

    return userInfoArray;
  };
  const people = async (people: any) => {
    let userId: any[] = [];
    let userTitle: any[] = [];
    let userMail: any[] = [];

    if (people?.length > 0) {
      people.forEach((item: any) => {
        if (item?.id !== undefined) {
          userMail.push(item.id.split("|")[2]);
        }
      });

      if (userMail?.length > 0) {
        let userInfo = await getUserInfo(userMail);
        userData = userInfo
        if (userInfo && userInfo.length > 0) {
          userInfo.forEach((item: any) => {
            if (item?.Title !== undefined) {
              userTitle.push(item.Title);
              userId.push(item.Id);
            }
          });
          setPeopleName(userTitle);
          setPeopleId(userId);
          title_people = userTitle;
          title_Id = userId;
        }
      }
    } else {
      let userInfo = await getUserInfo(
        props.props.context._pageContext._legacyPageContext.userPrincipalName
      );
      if (userInfo && userInfo.length > 0) {
        userInfo.forEach((item: any) => {
          userTitle.push(item.Title);
          userId.push(item.Id);
        });
        setPeopleName(userTitle);
        setPeopleId(userId);
        title_people = userTitle;
        title_Id = userId;
      }
    }
  };


  const ConvertLocalTOServerDateToSave = (date: any, Time: any) => {
    if (date != undefined && date != "") {
      const dateString = date;
      const dateObj = moment(dateString, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
      const formattedDater = dateObj.format("ddd MMM DD YYYY");
      return formattedDater;
    } else return "";
  };
  // for send Email

  const calculateTotalWorkingDays = (matchedData: any[]) => {
    // Function to reset the time of a date string to 00:00:00
    function resetTime(dateString: any) {
      let date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      return date; // Return the date object
    }

    // Today's date for comparison (reset to 00:00:00)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalWorkingDays = 0; // Initialize the counter for total working days

    matchedData.forEach((item) => {
      let endDate = resetTime(item.EndDate);
      let eventDate: any = resetTime(item.EventDate);
      if (eventDate.getFullYear() === today.getFullYear()) {
        let currentDate = new Date(eventDate);

        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay();

          // Exclude weekends (Saturday and Sunday)
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            // Check if the current date falls within the event range
            if (currentDate >= eventDate && currentDate <= endDate) {
              if (item.Event_x002d_Type !== "Work From Home") {
                if (item.HalfDay === true || item.HalfDayTwo === true) {
                  totalWorkingDays += 0.5; // Add half-day
                } else {
                  totalWorkingDays++; // Add full day
                }
              }
            }
          }

          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
      }
    });


    return totalWorkingDays;
  };

  const isWeekend = (startDate: any, endDate: any) => {
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();

    return (startDay === 0 || startDay === 6) && (endDay === 0 || endDay === 6);
  };

  const SendEmail = (EventData: any, MyEventData: any) => {
    const startDate = new Date(EventData?.start);
    const endDate = new Date(EventData?.end);

    let daysDifference = calculateTotalWorkingDays([MyEventData]);
    const formattedstartDate = startDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const formattedendDate = endDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    let sendAppliedEmail = ApplyEmailReciptents?.map((user: any) => { return user?.Email })
    sendAppliedEmail = sendAppliedEmail?.filter((user: any) => user != undefined)
    let sp = spfi().using(spSPFx(props?.props?.context));

    let BindHtmlBody = `<div>
  <div>
    Dear Prashant,<br><br>
    I am writing to request ${daysDifference} day of leave from ${formattedstartDate} to ${formattedendDate} due to ${EventData?.title}.<br><br>
    I have ensured that my tasks are up to date and arranged coverage during my absence. Your understanding and approval would be greatly appreciated.<br><br>
    Best regards,<br>
    ${EventData?.name} <br> <a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/SmalsusLeaveCalendar.aspx?Id=${EventData?.Id}"></a>
  </div>
</div>`;

    let Body = BindHtmlBody
    let Subject = "Leave Request - " + formattedstartDate + "-" + EventData?.Designation + "-" + EventData?.type + "-" + EventData?.title
    let To = sendAppliedEmail?.length > 0 ? sendAppliedEmail : ["anubhav.shukla@hochhuth-consulting.de"]
    SendEmailMessage(Body, Subject, To, "Email")
  };


  // Email End 

  const saveEvent = async () => {
    try {
      if (inputValueName?.length > 0 && (dType?.length > 0 || type == "National Holiday" || type == "Company Holiday")) {
        const chkstartDate = new Date(startDate);
        const chkendDate = new Date(endDate);
        if (chkstartDate > chkendDate) {
          alert("End Date cannot be before start date");
        } else {
          if (newRecurrenceEvent) {
            await saveRecurrenceEvent();
            void getEvents();
            closem(undefined);
            setIsChecked(false);
            setIsFirstHalfDChecked(false);
            setisSecondtHalfDChecked(false);
            setSelectedTime(selectedTime);
            setSelectedTimeEnd(selectedTimeEnd);
            return;
          }

          if (peopleName === props.props.context._pageContext._user.displayName) {
            setPeopleName(props.props.context._pageContext._user.displayName);
          } else {
            setPeopleName(title_people);
            setPeopleId(title_Id)
          }
          userData.map((item: any) => {
            newEvent = {
              name: item.Title,
              nameId: item.Id,
              title: inputValueName,
              start: startDate,
              end: endDate,
              reason: inputValueReason,
              type: HalfDaye == true ? "Half Day" : HalfDayT == true ? "Half Day" : type,
              loc: location,
              Designation: dType,
            };
            setDetails(newEvent);
            let mytitle = newEvent.name + "-" + newEvent.type + "-" + newEvent.title;
            if (newEvent != undefined && (newEvent?.type == "National Holiday" || newEvent?.type == "Company Holiday")) {
              mytitle = newEvent.type + "-" + newEvent.title;
            }

            let mycolors = (HalfDaye === true || HalfDayT === true) ? "#6d36c5" : newEvent.type === "Work From Home" ? "#e0a209" : (newEvent.type === "Company Holiday" || newEvent.type === "National Holiday") ? "#228B22" : "";

            let eventData = {
              Title: mytitle,
              EmployeeId: newEvent.nameId,
              Location: newEvent.loc,
              Event_x002d_Type: newEvent.type,
              Description: newEvent.reason,
              EndDate: ConvertLocalTOServerDateToSave(newEvent.end, selectedTimeEnd) + " " + (selectedTimeEnd + "" + ":00"),
              EventDate: ConvertLocalTOServerDateToSave(startDate, selectedTime) + " " + (selectedTime + "" + ":00"),
              fAllDayEvent: allDay,
              HalfDay: HalfDaye,
              HalfDayTwo: HalfDayT,
              Designation: newEvent.Designation,
              Color: mycolors
            };

            let web = new Web(props.props.siteUrl);
            web.lists
              .getById(props.props.SmalsusLeaveCalendar)
              .items.add(eventData)
              .then((response) => {
                const newItemId = response.data.Id; // Get the ID of the newly created item
                console.log("New item ID:", newItemId);
                newEvent.Id = response.data.Id;
                if (newEvent.type !== "Work From Home") {
                  SendEmail(newEvent, eventData);
                }
                getEvents();
              })
              .catch((error) => {
                console.error("Error adding item:", error);
                alert("Error adding item. Please try again.");
              });
          });
          closem(undefined);
          setIsChecked(false);
          setIsFirstHalfDChecked(false);
          setisSecondtHalfDChecked(false);
          setSelectedTime(selectedTime);
          setSelectedTimeEnd(selectedTimeEnd);
          allDay = "false";
          HalfDaye = "false";
          HalfDayT = "false";
        }
      } else {
        alert("Please fill in the short description and Team and Leave Type");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the event. Please try again.");
    }
  };
  const handleInputChangeName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValueName((event.target as HTMLInputElement).value);
  };

  const setStartDatefunction = (date: any) => {
    setStartDate(date);
    if (isChecked == true) {
      setEndDate(date);
      maxD = date;
    }
  };
  const handleInputChangeReason = (value: string) => {
    setInputValueReason(value);
  };
  
  const updateAndReplaceType = (input:any, newType:any, isFirstHalfDChecked:any, isSecondtHalfDChecked:any, leaveApproved:any, leaveRejected:any) => {
    const leaveTypes = [
      "Half Day Un-Planned",
      "Half Day Planned Leave",
      "Un-Planned",
      "Sick",
      "Planned Leave",
      "Restricted Holiday",
      "Work From Home",
      "fulldayevent",
      "LWP"
    ];
  
    const normalize = (text:any) => text.toLowerCase().replace(/[-\s]+/g, '');
  
    let result = input;
    let normalizedNewType = normalize(newType);
  
    // Determine if "Half Day" should be added
    const shouldAddHalfDay = isFirstHalfDChecked || isSecondtHalfDChecked;
  
    if (shouldAddHalfDay) {
      newType = "Half Day " + newType;
      normalizedNewType = normalize(newType);
    }
  
    const normalizedResult = normalize(result);
    const regex = new RegExp(leaveTypes.map(normalize).join("|"), "gi");
  
    result = result.replace((regex:any, matched:any) => {
      const normalizedMatched = normalize(matched);
      if (normalizedResult.includes(normalizedMatched)) {
        return newType;
      }
      return matched;
    });
  
    // Adjust "Half Day" prefix
    if (shouldAddHalfDay) {
      const halfDayRegex = /Half Day\s*/gi;
      const hyphenIndex = result.indexOf('-');
      result = result.replace(halfDayRegex, '').trim();
      if (hyphenIndex >= 0) {
        result = result.slice(0, hyphenIndex + 1) + " Half Day" + result.slice(hyphenIndex + 1);
      }
    } else {
      const halfDayRegex = /Half Day\s*/gi;
      result = result.replace(halfDayRegex, '').trim();
    }
  
    // Append approval or rejection status if not already present
    if (leaveApproved && !result.includes("Approved")) {
      result += " Approved";
    } else if (leaveRejected && !result.includes("Rejected")) {
      result += " Rejected";
    }
  
    // Handle non-"Half Day" newType and replacement
    if (!newType.includes("Half Day")) {
      const normalizedNewResult = normalize(result);
      const typeRegex = new RegExp(leaveTypes.map(normalize).join("|"), "gi");
  
      result = result.replace((typeRegex:any, matched:any) => {
        const normalizedMatched = normalize(matched);
        if (normalizedNewResult.includes(normalizedMatched)) {
          return newType;
        }
        return matched;
      });
  
      if (leaveApproved && !result.includes("Approved")) {
        result += " Approved";
      } else if (leaveRejected && !result.includes("Rejected")) {
        result += " Rejected";
      }
  
      return result;
    }
  
    return result;
  };
   
  
  const updateElement = async () => {
    if (editRecurrenceEvent) {
      await saveRecurrenceEvent();
      void getEvents();
      closem(undefined);
      setIsFirstHalfDChecked(false);
      setisSecondtHalfDChecked(false);
      setIsChecked(false);
      setSelectedTime(selectedTime);
      setSelectedTimeEnd(selectedTimeEnd);
      return;
    }
    const web = new Web(props.props.siteUrl);
    const newEvent = {
      title: updateAndReplaceType(inputValueName, type, isFirstHalfDChecked, isSecondtHalfDChecked, leaveapproved, leaverejected),
      name: peopleName,
      start: startDate,
      end: endDate,
      reason: inputValueReason,
      type: type,
      Designation: dType,
      loc: location,
      halfdayevent: isFirstHalfDChecked,
      halfdayeventT: isSecondtHalfDChecked,
      fulldayevent: isChecked
    };

    if (selectedTime === undefined || selectedTimeEnd === undefined || newEvent.loc === undefined) {
      const date = moment(startDate).tz("Asia/Kolkata");
      setSelectedTime(date.format());
      const dateend = moment(endDate).tz("Asia/Kolkata");
      setSelectedTimeEnd(dateend.format());
      newEvent.loc = "";
    }

    const mycolors = leaverejected ? "#fe2e2e" :
      (newEvent.halfdayevent || newEvent.halfdayeventT) ? "#6d36c5" :
        (newEvent.type === "Work From Home") ? "#e0a209" :
          ((newEvent.type === "Company Holiday") || (newEvent.type === "National Holiday")) ? "#228B22" :
            (leaveapproved && newEvent.type !== "Work From Home" && !newEvent.halfdayevent && !newEvent.halfdayeventT) ? "#178c1f" : "#fe2e2e";

    await web.lists.getById(props.props.SmalsusLeaveCalendar)
      .items.getById(eventPass.Id)
      .update({
        Title: newEvent.title,
        Location: newEvent.loc,
        Event_x002d_Type: newEvent.type,
        Description: newEvent.reason,
        Designation: newEvent.Designation,
        EndDate: ConvertLocalTOServerDateToSave(newEvent.end, selectedTimeEnd) + " " + (selectedTimeEnd + "" + ":00"),
        EventDate: ConvertLocalTOServerDateToSave(startDate, selectedTime) + " " + (selectedTime + "" + ":00"),
        HalfDay: newEvent.halfdayevent,
        HalfDayTwo: newEvent.halfdayeventT,
        Approved: leaveapproved,
        Rejected: leaverejected,
        Color: mycolors,
        fAllDayEvent: newEvent.fulldayevent
      })
      .then(() => {
        void getEvents();
        closem(undefined);
        setSelectedTime(startTime);
        setSelectedTimeEnd(endTime);
      });
  };


  const emailComp = () => {
    const currentDate = new Date();
    const currentDayEvents: any = [];
    chkName.map((item: any) => {
      if (item.start.setHours(0, 0, 0, 0) <= currentDate.setHours(0, 0, 0, 0) && currentDate.setHours(0, 0, 0, 0) <= item.end.setHours(0, 0, 0, 0)) {
        currentDayEvents.push(item);
      }
    });
    setTodayEvent(currentDayEvents);
    setEmail(true);
  };

  const emailCallback = React.useCallback(() => {
    getEvents();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    if (checked) {
      startTime = "10:00";
      endTime = "19:00";
      setSelectedTimeEnd("19:00");
      setSelectedTime("10:00");
      setEndDate(startDate);
      maxD = startDate;
      setDisableTime(true);
      allDay = true;
      HalfDaye = false;
      HalfDayT = false;
      setIsFirstHalfDChecked(false);
      setisSecondtHalfDChecked(false);
    } else {
      maxD = new Date(8640000000000000);
      setDisableTime(false);
      allDay = false;
      console.log("allDay", allDay);
    }
  };

  const handleHalfDayCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsFirstHalfDChecked(checked);
    if (checked) {
      startTime = "10:00";
      endTime = "19:00";
      setSelectedTimeEnd("14:30");
      setSelectedTime("10:00");
      setEndDate(startDate);
      maxD = startDate;
      setDisableTime(true);
      allDay = false;
      HalfDayT = false;
      HalfDaye = true;
      setisSecondtHalfDChecked(false)
      setType('Half Day')
      setIsChecked(false);
    } else {
      maxD = new Date(8640000000000000);
      setDisableTime(false);
      HalfDaye = false;
      console.log("HalfDay", HalfDaye);
    }
  };
  const handleHalfDayCheckboxChangeSecond = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setisSecondtHalfDChecked(checked);
    if (checked) {
      startTime = "10:00";
      endTime = "19:00";
      setSelectedTimeEnd("19:00");
      setSelectedTime("14:30");
      setEndDate(startDate);
      maxD = startDate;
      setDisableTime(true);
      allDay = false;
      HalfDaye = false;
      HalfDayT = true;
      setIsFirstHalfDChecked(false)
      setType('Half Day')
      setIsChecked(false);
    } else {
      maxD = new Date(8640000000000000);
      setDisableTime(false);
      HalfDayT = false;
      console.log("HalfDayTwo", HalfDayT);
    }
  }
  const HandledLeaveType = (option: any) => {
    if (option == "Company Holiday" || option == "National Holiday") {
      setIsChecked(true);
      allDay = true
      setIsDisableField(true)
      setShowRecurrenceSeriesInfo(false);
      setNewRecurrenceEvent(false);
    }
    else {
      setIsChecked(false);
      allDay = false
      setIsDisableField(false)
    }
    setType(option)
  }
  const openModal = () => {
    setIsOpen(true);
  };

  // Leave approve and Reject Functionality implemention 

  const sendLeaveNotification = async (type: any) => {
    const mention_To = [userEmail?.Email];
    const employeeName = queryevent?.Employee?.Title;
    const context = props?.props?.context;
    const allListId = props?.props;

    // Extracted function for date formatting
    const formatDate = (date: any) => {
      return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const startDate = new Date(queryevent?.start);
    const endDate = new Date(queryevent?.end);
    const eventDate = formatDate(startDate);
    const eventEndDate = formatDate(endDate);

    let subject, txtComment;
    if (type === "approve") {
      subject = "Leave Request approved";
      txtComment = `
        <div>
          <p>Hi ${employeeName},</p><br>
          <p>Your applied leave for ${eventDate} to ${eventEndDate} has been approved.</p><br>
          <p>Regards,<br>Manager</p>
        </div>
      `;
    } else if (type === "reject") {
      const comment = "Reason for rejection"; // Replace with actual comment source
      subject = "Leave Request rejected";
      txtComment = `
        <div>
          <p>Hi ${employeeName},</p><br>
          <p>Your applied leave for ${eventDate} to ${eventEndDate} has been rejected due to ${comment}.</p><br>
          <p>Regards,<br>Manager</p>
        </div>
      `;
    }

    try {
      // Send notification via MS Teams
      await GlobalCommon.SendTeamMessage(mention_To, txtComment, context, allListId);
      console.log("MS Teams Notification sent");

      // Send notification via Email
      const To = [userEmail?.Email, ApproveruserEmail?.Email, "deepak@hochhuth-consulting.de", "ranu.trivedi@hochhuth-consulting.de", "juli.kumari@hochhuth-consulting.de", "prashant.kumar@hochhuth-consulting.de"];
      const emailSubject = subject;
      SendEmailMessage(txtComment, emailSubject, To, "Notification");

      // Update logic based on approval or rejection
      if (type === "approve") {
        console.log("Your leave is approved");
        leaveapproved = true;
        updateElement(); // Assuming this function handles updating the UI or data
      } else if (type === "reject") {
        leaverejected = true;
        updateElement();
        console.log("Your leave is rejected");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      // Handle error appropriately, possibly notify admin or retry mechanism
    }
  };


  const LeaveApprove = async () => {
    await sendLeaveNotification("approve");
  };

  const LeaveReject = async () => {
    await sendLeaveNotification("reject");
  };


  const handleReject = () => {
    setShowTextarea(true);
    setIsDisabled(true); // Disable both buttons when reject is clicked
  };

  const handleSubmitReject = () => {
    LeaveReject();
    setShowTextarea(false); // Optionally hide textarea after submission
    setIsDisabled(true); // Disable both buttons after submission
  };

  const handleApprove = () => {
    LeaveApprove();
    setIsDisabled(true); // Disable both buttons after approval
  };

  const allowedUserIds = [242, 36, 234, 192];
  const userId = props?.props?.context?.pageContext?.legacyPageContext?.userId;
  const isAllowedUser = allowedUserIds.indexOf(userId) !== -1;

  const result = isAllowedUser && !disabl && !(leaveapproved || leaverejected);
  



  const deletePermission = async () => {
    let permission = await globalCommon.verifyComponentPermission("DeleteLeavePermissionCalendar")
    setHasDeletePermission(permission)
  }
  return (

    <div>
      {/* <div className="w-100 text-end">
        <a
          target="_blank"
          data-interception="off"
          href={`${props.props.siteUrl}/SitePages/TeamCalendar-Old.aspx`}
        >
          {" "}
          Old Leave Calendar
        </a>
      </div> */}
      <div className="w-100 text-end">
        <a href="#" onClick={DownloadLeaveReport}>
          <span>Generate Monthly Report  | </span>
        </a>
        <a
          target="_blank"
          data-interception="off"
          href={`${props.props.siteUrl}/Lists/Events/calendar.aspx`}
        >
          {" "}
          Add to Outlook Calendar
        </a>
      </div>
      <div style={{ height: "500pt" }}>
        {EmailReciptents.some((user: any) => user?.AssingedToUserId == props?.props?.context?.pageContext?.legacyPageContext?.userId) &&
          <a className="mailBtn me-4" href="#" onClick={emailComp}>
            <FaPaperPlane></FaPaperPlane> <span>Send Leave Summary</span>
          </a>}

        <Calendar
          events={recurringEvents}
          selectable
          onSelectSlot={handleSelectSlot}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          onShowMore={handleShowMore}
          views={{ month: true, week: true, day: true, agenda: true }}
          localizer={localizer}
          onSelectEvent={handleDateClick}
          eventPropGetter={eventStyleGetter}
          onView={(newView: View) => setview(newView)}
          onNavigate={handleNavigate}
          view={view as View}
        />
      </div>
      {email ? (
        <EmailComponenet
          Context={props.props.context}
          Listdata={props.props}
          data={todayEvent}
          EmailReciptents={EmailReciptents}
          data2={details}
          call={emailCallback}
        />
      ) : null}
      {isOpen && (
        <Panel
          headerText={`Leaves of ${dt}`}
          isOpen={isOpen}
          onDismiss={closeModal}
          type={PanelType.medium}
          closeButtonAriaLabel="Close"
        >
          <table className="styled-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>EndDate</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {showM?.map((item: any) => {
                return (
                  <tr>
                    <td>{item.title}</td>
                    <td>{moment(item.end).format("DD/MM/YYYY")}</td>
                    <td>
                      <a href="#" onClick={() => handleDateClick(item)}>
                        <span
                          title="Edit"
                          className="svg__iconbox svg__icon--edit"
                        ></span>
                      </a>
                    </td>
                    <td>
                      <a href="#" onClick={() => deleteElement(item?.Id)}>
                        <span className="svg__iconbox svg__icon--trash"></span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      )}
      <Panel
        onRenderHeader={onRenderCustomHeader}
        isOpen={m}
        onDismiss={(e: any) => closem(e)}
        type={PanelType.medium}
        closeButtonAriaLabel="Close"
      >
        <form className="row g-3">
          {peoplePickerShow ? (
            <div>
              <PeoplePicker
                context={props.props.context}
                principalTypes={[PrincipalType.User]}
                personSelectionLimit={10}
                titleText="Select People"
                resolveDelay={1000}
                onChange={people}
                showtooltip={true}
                required={true}
                disabled={IsDisableField}
              ></PeoplePicker>
            </div>
          ) : (
            ""
          )}
          <div className="col-md-12">
            <TextField
              label="Short Description"
              required
              value={inputValueName}
              onChange={handleInputChangeName}
            />
          </div>
          {showRecurrenceSeriesInfo != true && (
            <div className="col-md-6">
              <DatePicker
                label="Start Date"
                minDate={minDate}
                value={startDate}
                onSelectDate={(date) => setStartDatefunction(date)}
                hidden={showRecurrenceSeriesInfo}
                disabled={IsDisableField}
              />
            </div>
          )}
          {showRecurrenceSeriesInfo != true && (
            <>
              <div className="col-md-6">
                <DatePicker
                  label="End Date"
                  value={endDate}
                  minDate={startDate}
                  maxDate={maxD}
                  onSelectDate={(date) => setEndDate(date)}
                  disabled={IsDisableField}
                />
              </div>
              <div>
                <label className="SpfxCheckRadio alignCenter">
                  <input
                    type="checkbox"
                    className="me-1 mt-0 form-check-input"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    disabled={IsDisableField}
                  />
                  All Day Event
                </label>
              </div>
              <div>
                <label className="ms-Label root-251">
                  Select Half Day Event
                </label>
                <div className="alignCenter">
                  <label className="SpfxCheckRadio">
                    <input
                      type="checkbox"
                      className="me-1 form-check-input"
                      checked={isFirstHalfDChecked}
                      onChange={handleHalfDayCheckboxChange}
                      disabled={IsDisableField}
                    /> First HalfDay
                  </label>
                  <label className="SpfxCheckRadio">
                    <input
                      type="checkbox"
                      className="me-1 form-check-input"
                      checked={isSecondtHalfDChecked}
                      onChange={handleHalfDayCheckboxChangeSecond}
                      disabled={IsDisableField}
                    /> Second HalfDay
                  </label>
                </div>
              </div>
            </>
          )}

          {<div>
            {showRecurrence && (
              <div
                className="bdr-radius"
                style={{
                  display: "inline-block",
                  verticalAlign: "top",
                  width: "200px"
                }}
              >
                <Toggle
                  className="rounded-pill"
                  defaultChecked={false}
                  checked={showRecurrenceSeriesInfo}
                  inlineLabel
                  label="Recurrence ?"
                  onChange={handleRecurrenceCheck}
                  disabled={IsDisableField}
                />
              </div>
            )}
            {showRecurrenceSeriesInfo && (
              <EventRecurrenceInfo
                context={props.props.context}
                display={true}
                recurrenceData={recurrenceData}
                startDate={startDate}
                siteUrl={props.props.siteUrl}
                returnRecurrenceData={returnRecurrenceInfo} selectedKey={undefined} selectedRecurrenceRule={undefined}
              ></EventRecurrenceInfo>
            )}
          </div>
          }
          <Dropdown
            label="Leave Type"
            options={leaveTypes}
            selectedKey={type}
            onChange={(e, option) => HandledLeaveType(option.key)}
            required
            errorMessage={type ? "" : "Please select a leave type"}
          />
          <Dropdown
            label="Team"
            options={Designation}
            selectedKey={dType}
            onChange={(e, option) => sedType(option.key)}
            disabled={IsDisableField}
            required
          />
          <div className="col-md-12">
            <ReactQuill
              value={inputValueReason}
              onChange={handleInputChangeReason}
              readOnly={IsDisableField}
            />
          </div>
          {result &&
            <div className="container mt-4">
              <div className="row">
                <div className="col">
                  <button type="button" className="btn btn-success me-2" onClick={handleApprove} disabled={isDisabled}>Approve</button>
                  <button type="button" className="btn btn-danger" onClick={handleReject} disabled={isDisabled}>Reject </button>
                </div>
              </div>
              {showTextarea && (
                <div className="row mt-3">
                  <div className="col">
                    <textarea className="form-control" placeholder="Enter reason for rejection" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                    <button type="button" className="btn btn-primary mt-2" onClick={handleSubmitReject}>
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          }
        </form>
        <br />
        {!disabl ? (
          <footer>
            <div className="align-items-center d-flex justify-content-between">
              <div>
                <div className="">
                  Created {CDate} {CTime} by {createdBY}
                </div>
                <div>
                  Last Modified {MDate} {MTime} by {modofiedBy}
                </div>
                <div>
                {hasDeletePermission && (
                  <a href="#" onClick={() => deleteElement(vId)}>
                    <span className="svg__iconbox svg__icon--trash"></span>{" "}
                    Delete this Item
                  </a>
                )}
                  <VersionHistoryPopup
                    taskId={vId}
                    listId={props.props.SmalsusLeaveCalendar}
                    siteUrls={props.props.siteUrl}
                  />
                </div>
              </div>
              <a
                target="_blank"
                data-interception="off"
                href={`${props.props.siteUrl}/Lists/Events/EditForm.aspx?ID=${vId}`}
              >
                Open out-of-the-box form
              </a>
              <div>
                <button
                  type="button"
                  className="btn btn-default  px-3"
                  onClick={closem}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary ms-1 px-3"
                  onClick={updateElement}
                >
                  Save
                </button>
              </div>
            </div>
          </footer>
        ) : (
          ""
        )}

        {!disab ? (
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default  px-3"
              onClick={closem}

            >
              Cancel
            </button>
            <button className="btn btn-primary ms-1 px-3" onClick={saveEvent}>
              Save
            </button>
          </div>
        ) : (
          ""
        )}

      </Panel>

      {leaveReport ? <MonthlyLeaveReport props={props.props} Context={props.props.context} callback={() => setleaveReport(false)} /> : ""}
    </div>);
}

export default Apps;
