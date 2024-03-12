import React, { useState, useEffect } from "react";
import { Calendar, View, Views, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Web } from "sp-pnp-js";
import { parseString } from 'xml2js';
import { DatePicker, Dropdown, Panel, PanelType, TextField, Toggle } from "office-ui-fabric-react";
import ReactQuill from "react-quill";
import { EventRecurrenceInfo } from "../EventRecurrenceControls/EventRecurrenceInfo/EventRecurrenceInfo";
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
  //   startDateTime: any,
  eventPass: any = {},
  endTime: any,
  allDay: any = false,
  title_people: any,
  title_Id: any;
let maxD = new Date(8640000000000000);

let events: any = [];
const localizer = momentLocalizer(moment);
const today: Date = new Date();
const minDate: Date = today;
const leaveTypes = [
  { key: "Sick", text: "Sick" },
  // { key: "Training", text: "Training " },
  { key: "Planned Leave", text: "Planned" },
  { key: "Un-Planned", text: "Un-Planned" },
  { key: "Restricted Holiday", text: "Restricted Holiday" },
  { key: "LWP", text: "LWP" },
  { key: "Work From Home", text: "Work From Home" },
  { key: "Company Holiday", text: "Company Holiday" },
  { key: "National Holiday", text: "National Holiday" }


];
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
  { key: "JTM (Junior Task Manager)", text: "JTM (Junior Task Manager)" }
];
const Apps = (props: any) => {
  const [leaveReport, setleaveReport] = React.useState(false);
  const [recurringEvents, setRecurringEvents] = useState([]);
  const [m, setm]: any = React.useState(false);
  const [MyDate, setMyDate] = useState([]);
  const [ShowMore, setShowMore] = useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showM, setShowM] = React.useState([]);
  const [startDate, setStartDate]: any = React.useState(null);
  const [endDate, setEndDate]: any = React.useState(null);
  const [chkName, setChkName]: any = React.useState("");
  const [type, setType]: any = React.useState("");
  const [dType, sedType]: any = React.useState("");
  const [isFirstHalfDChecked, setIsFirstHalfDChecked] = React.useState(false);
  const [isSecondtHalfDChecked, setisSecondtHalfDChecked] = React.useState(false);
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

  useEffect(() => {
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
        let repeatInstance = 0;

        if (rule?.repeatInstances && rule.repeatInstances[0] > 0) {
          repeatInstance = Number(rule.repeatInstances[0]);
        }
        const windowEndDate = rule.windowEnd ? new Date(rule.windowEnd[0]).setHours(0, 0, 0, 0) : new Date(recurrenceData?.EndDate).setHours(0, 0, 0, 0);
        while (dates.length < repeatInstance || new Date(dates[dates.length - 1] || startDate).setHours(0, 0, 0, 0) < windowEndDate) {
          if (calculateNextDate(rule, firstDayOfWeek, new Date(dates[dates.length - 1] || startDate), dates, windowEndDate, AllEvents, recurrenceData) === 'break') break;
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
  // function getDayOfCurrentWeek(dayAbbreviation: any) {
  //   let daysOfWeek = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  //   let currentDayOfWeek = (new Date()).getDay();
  //   let targetDayIndex = daysOfWeek.indexOf(dayAbbreviation);
  //   let daysToAdd = targetDayIndex - currentDayOfWeek;
  //   if (daysToAdd < 0) {
  //     daysToAdd += 7;
  //   }
  //   let targetDate = new Date();
  //   targetDate.setDate(targetDate.getDate() + daysToAdd);
  //   return targetDate
  // }
  function handleDailyRecurrence(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any, repeatInstance: any) {
    const dayFrequency = parseInt(frequency.dayFrequency);
    let count = 0;

    while (count < repeatInstance || new Date(currentDate).setHours(0, 0, 0, 0) < windowEndDate) {
      currentDate.setDate(currentDate.getDate() + dayFrequency);
      const event = eventDataForBinding(eventDetails, currentDate);
      AllEvents.push(event);
      dates.push(new Date(currentDate));
      count++;
    }
  }
  function handleWeeklyRecurrence(frequency: any, currentDate: any, dates: any, AllEvents: any, eventDetails: any, windowEndDate: any, repeatInstance: any)  {
    let { weekFrequency, days } = frequency;
    days = getKeyWithValueTrue(frequency);
    const daysOfWeek = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

    days?.forEach((day:any) => {
        const targetDayIndex = daysOfWeek.indexOf(day);
        let daysToAdd = targetDayIndex - currentDate.getDay();
        
        daysToAdd += 7;
        
        let targetDate :any= new Date(currentDate.getTime());
        targetDate.setDate(currentDate.getDate() + daysToAdd);
        currentDate = targetDate
        const event = eventDataForBinding(eventDetails, currentDate);
        AllEvents.push(event);
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + (weekFrequency * 7));
    });
}

  function calculateNextDate(rule: any, firstDayOfWeek: string, currentDate: any, dates: Date[], endDate?: any, AllEvents?: any, eventDetails?: any): string {
    try {
      const { repeat } = rule;
      const repeatType = Object.keys(repeat[0])[0];
      const frequency = repeat[0][repeatType][0].$;
      let event: any = {};
      switch (repeatType) {
        case 'daily':
          const { dayFrequency } = frequency;
          const repeatInstance = rule.repeatInstances ? parseInt(rule.repeatInstances[0]) : Infinity;
          handleDailyRecurrence(frequency, currentDate, dates, AllEvents, eventDetails, endDate, repeatInstance);
          break;
        case 'yearly':
          const { yearFrequency, month, day } = frequency;
          currentDate.setFullYear(currentDate.getFullYear() + Number(yearFrequency));
          currentDate.setMonth(Number(month) - 1);
          currentDate.setDate(Number(day));
          event = eventDataForBinding(eventDetails, currentDate)
          AllEvents?.push(event)
          dates.push(new Date(currentDate));
          break;
        case 'monthly':
          let { monthFrequency, dayOfMonth } = frequency;
          if (dayOfMonth == undefined && frequency?.day != undefined) {
            dayOfMonth = frequency?.day;
          }
          currentDate.setMonth(currentDate.getMonth() + Number(monthFrequency));
          currentDate.setDate(Number(dayOfMonth));
          dates.push(new Date(currentDate));
          event = eventDataForBinding(eventDetails, currentDate)
          AllEvents?.push(event)
          break;
        case 'weekly':
          // Handle weekly recurrence
          const { weekFrequency, days } = frequency;
          handleWeeklyRecurrence(frequency, currentDate, dates, AllEvents, eventDetails, endDate, weekFrequency);
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
        let startdate: Date, enddate: Date, createdAt: Date, modifyAt: Date;
        let localcomp: any[] = [];

        if (!item.alldayevent) {
            startdate = new Date(item.EventDate);
            createdAt = new Date(item.Created);
            modifyAt = new Date(item.Modified);
            enddate = new Date(item.EndDate);
        } else {
            startdate = new Date(item.EventDate);
            startdate.setHours(startdate.getHours() - 5);
            startdate.setMinutes(startdate.getMinutes() - 30);
            enddate = new Date(item.EndDate);
            enddate.setHours(enddate.getHours() - 5);
            enddate.setMinutes(enddate.getMinutes() - 30);
        }

        localcomp.push({
            iD: item.ID,
            title: item.Title,
            start: convertDateTimeOffset(startdate),
            end: convertDateTimeOffset(enddate)
        });

        item.clickable = !(item?.Event_x002d_Type === 'Company Holiday' || item?.Event_x002d_Type === 'National Holiday');

        const dataEvent = {
            shortD: item.Title,
            iD: item.ID,
            NameId: item?.Employee?.Id,
            title: item.Title,
            start: startdate,
            end: enddate,
            location: item.Location,
            desc: item.Description,
            alldayevent: item.fAllDayEvent,
            eventType: item.Event_x002d_Type,
            created: item.Author.Title,
            modify: item.Editor.Title,
            cTime: createdAt,
            mTime: modifyAt,
            Name: item.Employee?.Title,
            Designation: item.Designation,
            HalfDay: item.HalfDay,
            HalfDayTwo: item.HalfDayTwo,
            clickable: item.clickable,
            Color: item.Color
        };

        return dataEvent;
    });
}
let offset: any;
function convertDateTimeOffset(Date: any): string | undefined {
    let ConvertDateOffset: string | undefined;
    if (Date != undefined && Date != "" && offset != undefined)
        ConvertDateOffset = moment.utc(Date).utcOffset(offset).toDate().toISOString();
    return ConvertDateOffset;
}


  const getEvents = async () => {
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/GmBH");
    const query =
      "RecurrenceData,Duration,Author/Title,Editor/Title,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,HalfDay,HalfDayTwo,Color,Created,Modified";
    try {
      const results = await web.lists
        .getById("860a08d5-9711-4d8e-bd26-93fe09362bd4")
        .items.select(query)
        .expand("Author,Editor,Employee")
        .top(500)
        .getAll();
      if (results && results.length > 0) {
        const NonRecurrenceData = results.filter((item) => item?.RecurrenceData == null);
        const Recurrencedatas = results.filter((item) => item?.RecurrenceData != null && item?.RecurrenceData != 'Every 1 day(s)');
        events = []
        const eventsNonRecurrece = NonRecurrenceData.map(eventDetails => ({
          ...eventDetails,
          title: eventDetails.Title,
          start: new Date(eventDetails?.EventDate), // Convert currentDate to ISO string
          end: new Date(eventDetails?.EndDate) // Convert currentDate to ISO string
        }));
        events = events.concat(eventsNonRecurrece);
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
          const eventDate = new Date(event.start); // Assuming event has a 'date' property
          const eventMonth = eventDate.getMonth() + 1; // Get month of the event
          const eventYear = eventDate.getFullYear(); // Get year of the event
          return eventMonth === currentMonth && eventYear === currentYear; // Filter events for current month and year
        });

        console.log(filteredData); // Display filtered data
        localArr = processDataArray(filteredData);
        
        setRecurringEvents(filteredData);
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
      const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/GmBH");
      const event = await web.lists
        .getById("860a08d5-9711-4d8e-bd26-93fe09362bd4")
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
          "HalfDay",
          "HalfDayTwo",
          "Color",
          "Created",
          " Modified"
        )
        .expand("Author","Editor")
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
  const handleNavigate = (newDate: any) => {
    const { year: currentYear, month: currentMonth } = getYearMonthFromDate(newDate);

    const filteredData = events.filter((event: any) => {
      const { year, month } = getYearMonthFromDate(event.start);
      return month === currentMonth && year === currentYear;
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
    // handleSelectSlot(slotinfo2);

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

    // If you want to check if the selected date is in the past, you can uncomment this code
    // if (date.getTime() < today.getTime()) {
    //   alert("Cannot add event in the past");
    // }
    // else {
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
  const handleDateClick = async (event: any) => {
    console.log(event);
    setInputValueName(event.Title);
    setshowRecurrence(false);
    setPeoplePickerShow(false);
    setShowRecurrenceSeriesInfo(false);
    setEditRecurrenceEvent(false);

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
      createdBY = event.created;
      modofiedBy = event.modify;
      setType(event.Event_x002d_Type);
      sedType(event.Designation);
      setInputValueReason(event.Description);
      setVId(event.Id);

      const eventItem: any = await getEvent(event.Id);
      const startDate = new Date(eventItem.EventDate);
      const endDate = new Date(eventItem.EndDate);
      const startHour = moment(startDate).format("HH").toString();
      const startMin = moment(startDate).format("mm").toString();
      const endHour = moment(endDate).format("HH").toString();
      const endMin = moment(endDate).format("mm").toString();

      setStartDate(startDate);
      setSelectedTime(`${startHour}:${startMin}`);
      setEndDate(endDate);
      setSelectedTimeEnd(`${endHour}:${endMin}`);
      setRecurrenceData(eventItem.RecurrenceData);
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

        setType(item.eventType);
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
        .delete()

        .then((i: any) => {
          //console.log(i);
          // void getData();
          closem(undefined);
          closeModal();
          // void getData();
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
    sedType("");
    setInputValueReason("");
    setIsDisableField(false);
    allDay = "false";
    HalfDaye = "false";
    HalfDayT = "false";

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

      const mycolors = (HalfDaye || HalfDayT) ? "#6d36c5" :
        (newEvent.Event_x002d_Type === "Work From Home") ? "#e0a209" :
          ((newEvent.Event_x002d_Type === "Company Holiday") || (newEvent.Event_x002d_Type === "National Holiday")) ? "#228B22" : "";

      const addEventItem = {
        Title: newEvent.Title,
        Description: newEvent.Description,
        EventDate: await getUtcTime(newEvent.EventDate),
        // Event_x002d_Type: newEvent.Event_x002d_Type,
        EndDate: await getUtcTime(newEvent.EndDate),
        Location: newEvent.Location,
        // Designation: newEvent.Designation,
        fAllDayEvent: newEvent.fAllDayEvent,
        fRecurrence: newEvent.fRecurrence,
        EventType: newEvent.EventType,
        Color: mycolors,
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
      const mytitle = `${editedEvent.name}-${editedEvent.type}-${editedEvent.title}`;
      const mycolors = (HalfDaye || HalfDayT) ? "#6d36c5" :
        (editedEvent.Event_x002d_Type === "Work From Home") ? "#e0a209" :
          ((editedEvent.Event_x002d_Type === "Company Holiday") || (editedEvent.Event_x002d_Type === "National Holiday")) ? "#228B22" : "";

      const editedEventItem = {
        Title: mytitle,
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
        Color: mycolors,
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
          Title: mytitle,
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
  const getUserInfo = async (userMail: string) => {
    const userEndPoint: any = `${props.props.context.pageContext.web.absoluteUrl}/_api/Web/EnsureUser`;

    const userData: string = JSON.stringify({
      logonName: userMail
    });

    const userReqData = {
      body: userData
    };

    const resUserInfo = await props.props.context.spHttpClient.post(
      userEndPoint,
      SPHttpClient.configurations.v1,
      userReqData
    );
    const userInfo = await resUserInfo.json();

    return userInfo;
  };
  const people = async (people: any) => {
    let userId: number = undefined;
    let userTitle: any;
    let userSuffix: string = undefined;

    if (people?.length > 0) {
      let userMail = people[0].id.split("|")[2];
      let userInfo = await getUserInfo(userMail);
      userId = userInfo.Id;
      userTitle = userInfo.Title;
      userSuffix = userTitle
        .split(" ")
        .map((i: any) => i.charAt(0))
        .join("");
      title_Id = userId;
      title_people = userTitle;
      setPeopleName(userTitle);
    } else {
      let userInfo = await getUserInfo(
        props.props.context._pageContext._legacyPageContext.userPrincipalName
      );
      userId = userInfo.Id;
      userTitle = userInfo.Title;
      userSuffix = userTitle
        .split(" ")
        .map((i: any) => i.charAt(0))
        .join("");
      title_Id = userId;
      title_people = userTitle;
      setPeopleName(userTitle);
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
            // void getEvents();
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
          }

          const newEvent = {
            name: peopleName,
            nameId: title_Id,
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
            // Designation: newEvent.Designation,
            Color: mycolors
          };

          let web = new Web(props.props.siteUrl);

          await web.lists
            .getById(props.props.SmalsusLeaveCalendar)
            .items.add(eventData);

          // void getEvents();
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
  const updateElement = async () => {
    if (editRecurrenceEvent) {
      await saveRecurrenceEvent();
      // void getEvents();
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
      title: inputValueName.replace("Un-Planned", type)
                            .replace("Sick", type)
                            .replace("Planned Leave", type)
                            .replace("Restricted Holiday", type)
                            .replace("Work From Home", type)
                            .replace("Half Day", type)
                            .replace("fulldayevent", type)
                            .replace("LWP", type),
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
  
    const mycolors = (newEvent.halfdayevent || newEvent.halfdayeventT) ? "#6d36c5" :
                     (newEvent.type === "Work From Home") ? "#e0a209" :
                     ((newEvent.type === "Company Holiday") || (newEvent.type === "National Holiday")) ? "#228B22" : "";
  
    await web.lists.getById(props.props.SmalsusLeaveCalendar)
      .items.getById(eventPass.Id)
      .update({
        Title: newEvent.title,
        Location: newEvent.loc,
        Event_x002d_Type: newEvent.type,
        Description: newEvent.reason,
        // Designation: newEvent.Designation,
        EndDate: ConvertLocalTOServerDateToSave(newEvent.end, selectedTimeEnd) + " " + (selectedTimeEnd + "" + ":00"),
        EventDate: ConvertLocalTOServerDateToSave(startDate, selectedTime) + " " + (selectedTime + "" + ":00"),
        HalfDay: newEvent.halfdayevent,
        HalfDayTwo: newEvent.halfdayeventT,
        Color: mycolors,
        fAllDayEvent: newEvent.fulldayevent
      })
      .then(() => {
        // void getEvents();
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


    console.log(currentDayEvents);
    setTodayEvent(currentDayEvents);
    setEmail(true);
  };

  const emailCallback = React.useCallback(() => {
    getEvents();
  }, []);


  
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    // console.log("check", isChecked);
    if (checked) {
      startTime = "10:00";
      endTime = "19:00";
      setSelectedTimeEnd("19:00");
      setSelectedTime("10:00");
      setEndDate(startDate);
      maxD = startDate;
      //console.log(maxD);
      setDisableTime(true);
      allDay = true;
      HalfDaye = false;
      HalfDayT = false;
      setIsFirstHalfDChecked(false);
      setisSecondtHalfDChecked(false);
      //console.log("allDay", allDay);
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
    // console.log("check", isChecked);
    if (checked) {
      startTime = "10:00";
      endTime = "19:00";
      setSelectedTimeEnd("14:30");
      setSelectedTime("10:00");
      setEndDate(startDate);
      maxD = startDate;
      //console.log(maxD);
      setDisableTime(true);
      allDay = false;
      HalfDayT = false;
      HalfDaye = true;
      setisSecondtHalfDChecked(false)
      setIsChecked(false);
      //console.log("allDay", allDay);
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
      //console.log(maxD);
      setDisableTime(true);
      allDay = false;
      HalfDaye = false;
      HalfDayT = true;
      setIsFirstHalfDChecked(false)

      setIsChecked(false);
      //console.log("allDay", allDay);
    } else {
      maxD = new Date(8640000000000000);
      setDisableTime(false);
      HalfDayT = false;
      console.log("HalfDayTwo", HalfDayT);
    }
  }

  const handleInputChangeLocation = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocation((event.target as HTMLInputElement).value);
  };
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
  return (
   
    <div>
    <div className="w-100 text-end">
    <a
          target="_blank"
          data-interception="off"
          href={`${props.props.siteUrl}/SitePages/TeamCalendar.aspx`}
        >
          {" "}
          Old Leave Calendar
        </a>
    </div>
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
      <a className="mailBtn me-4" href="#" onClick={emailComp}>
        <FaPaperPlane></FaPaperPlane> <span>Send Leave Summary</span>
      </a>
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
        data2={details}
        call={emailCallback}
      />
    ) : null}
    {isOpen && (
      <Panel
        headerText={`Leaves of ${dt}`}
        isOpen={isOpen}
        onDismiss={closeModal}
        /// isFooterAtBottom={true}
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
                    <a href="#" onClick={() => deleteElement(item?.iD)}>
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
              personSelectionLimit={1}
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
        {/* {!disableTime ? (
          <div className="col-md-6  mt-4">
            <label htmlFor="1" className="w-100">
              Start Time:
            </label>
            <input
              id="1"
              type="time"
              name="Start-time"
              value={selectedTime}
              onChange={handleTimeChange}
            />
          </div>
        ) : (
          ""
        )} */}
        {showRecurrenceSeriesInfo != true && (
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
        )}
        {/* {!disableTime ? (
          <div className="col-md-6  mt-4">
            <label htmlFor="2" className="w-100">
              End Time:
            </label>
            <input
              id="2"
              type="time"
              name="End-time"
              value={selectedTimeEnd}
              onChange={handleTimeChangeEnd}
            />
          </div>
        ) : (
          ""
        )} */}
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
        {
          <div>
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
                returnRecurrenceData={returnRecurrenceInfo} selectedKey={undefined} selectedRecurrenceRule={undefined}                // selectedKey={selectedKey}
              // selectedRecurrenceRule={selectedKey}
              ></EventRecurrenceInfo>
            )}
          </div>
        }
        <div>
          <TextField
            label="Location"
            value={location}
            onChange={handleInputChangeLocation}
            disabled={IsDisableField}
          />
        </div>{" "}
        <Dropdown
          label="Leave Type"
          options={leaveTypes}
          selectedKey={type}
          // defaultSelectedKey="Un-Planned" // Set the defaultSelectedKey to the key of "Planned Leave"
          onChange={(e, option) => HandledLeaveType(option.key)}
          required // Add the "required" attribute
          errorMessage={type ? "" : "Please select a leave type"} // Display an error message if no type is selected
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
      </form>

      <br />
      {/* {!disabl ? (
        <PrimaryButton
          disabled={disabl}
          text="Delete"
          onClick={deleteElement}
        />
      ) : (
        ""
      )} */}
      {/* 
      {!disabl ? <><PrimaryButton text="Save" onClick={updateElement} />
      <PrimaryButton text="Cancel" onClick={closem}/>
      </>: ""}
      
      {!disabl ? (<>
        <div>
          Created {CDate} {CTime} by {createdBY}
        </div>
        <div>
          Last Modified {MDate} {MTime} by {modofiedBy}
        </div>
       
        <a href="#" onClick={deleteElement}>
        <span className="svg__iconbox svg__icon--trash"></span> Delete this Item
      </a>
        </>) : (
        ""
      )} */}

      {/* {!disabl ? (
        
      ) : (
        ""
      )} */}
      {/* <br />
      {!disab ? <><PrimaryButton text="Submit" onClick={saveEvent} />
      <PrimaryButton text="Cancel" onClick={closem}/>
      </> : ""} */}

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
                <a href="#" onClick={() => deleteElement(vId)}>
                  <span className="svg__iconbox svg__icon--trash"></span>{" "}
                  Delete this Item
                </a>
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
