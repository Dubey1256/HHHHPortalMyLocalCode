import * as React from "react";
// import { render } from 'react-dom';
// import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import * as moment from "moment";
// import './style.css';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment-timezone";
import { v4 as uuidv4 } from "uuid";
import EmailComponenet from "./email";
import { SPHttpClient } from "@microsoft/sp-http";
import { FaPaperPlane } from "react-icons/fa";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import "./style.css";
// import { Component } from 'react';
// import MyModal from "./MyModal";
import { Web } from "sp-pnp-js";
// import VersionHistoryPopup from "../";
import {
  Panel,
  PanelType,
  TextField,
  DatePicker,
  PrimaryButton,
  Dropdown,
  Toggle,
} from "office-ui-fabric-react";

//import $ from "jquery";
// import { RichText } from 'office-ui-fabric-react';
// import { TextEditor } from '@microsoft/monaco-editor-react';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import FroalaEditorComponent from 'react-froala-wysiwyg';
import * as ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { EventRecurrenceInfo } from "./EventRecurrenceControls/EventRecurrenceInfo/EventRecurrenceInfo";
import parseRecurrentEvent from "./EventRecurrenceControls/service/parseRecurrentEvent";
import Tooltip from "../../../globalComponents/Tooltip";
import VersionHistoryPopup from "../../../globalComponents/VersionHistroy/VersionHistory";
//import Modal from "react-bootstrap/Modal";
//import MoreSlot from "./Slots";
interface IEventData {
  Event_x002d_Type?: string;
  Location?: string;
  Title?: string;
  Id?: number;
  ID?: number;
  title?: string;
  Description?: any;
  location?: string;
  EventDate: Date | string;
  EndDate: Date | string;
  color?: string;
  ownerInitial?: string;
  ownerPhoto?: string;
  ownerEmail?: string;
  ownerName?: string;
  fAllDayEvent?: boolean;
  attendes?: number[];
  geolocation?: { Longitude: number; Latitude: number };
  Category?: string;
  Duration?: number;
  RecurrenceData?: string;
  fRecurrence?: string | boolean;
  EventType?: string;
  UID?: string;
  RecurrenceID?: Date;
  MasterSeriesItemID?: string;
  Author?: any;
  Editor?: any;

  iD?: number;
  start?: Date | String;
  end?: Date | String;
  desc?: any;
  alldayevent?: boolean;
  eventType?: string;
  created?: string;
  modify?: string;
}
//import TimePicker from 'react-time-picker';
//import { format } from "date-fns";
//import { TimePicker } from "@fluentui/react";

const localizer = momentLocalizer(moment);
let createdBY: any,
  modofiedBy: any,
  CTime: any,
  CDate: any,
  MTime: any,
  MDate: any,
  localArr: any = [],
  vHistory:any=[]
let startTime: any,
  //   startDateTime: any,
  eventPass: any = {},
  endTime: any,
  allDay: any = false,
  title_people: any;
// endDateTime: any;
//let dateTime:any,startDate:any,startTime:any,endtDate:any,endTime:any;
let maxD = new Date(8640000000000000);

const App = (props: any) => {
  const [m, setm]: any = React.useState(false);
  const [events, setEvents]: any = React.useState([]);
  let compareData: any = [];
  // const [isOpen, setIsOpen]:any = React.useState(false);
  // const [name, setName]:any = React.useState('');
  const [startDate, setStartDate]: any = React.useState(null);
  const [endDate, setEndDate]: any = React.useState(null);
  const [chkName, setChkName]: any = React.useState("");
  const [type, setType]: any = React.useState("");
  const [dType, sedType]: any = React.useState("");
  const [inputValueName, setInputValueName] = React.useState("");
  const [inputValueReason, setInputValueReason] = React.useState("");
  // const myButton = document.getElementById("myButton");
  const [vId,setVId]=React.useState()
  const [disabl, setdisabl] = React.useState(false);
  const [disab, setdisab] = React.useState(false);
  const [dt, setDt] = React.useState();
  const [selectedTime, setSelectedTime]: any = React.useState("10:00");
  const [selectedTimeEnd, setSelectedTimeEnd]: any = React.useState("19:00");
  const [location, setLocation]: any = React.useState();
  //const [saveE, setsaveE]:any = React.useState([]);
  //let saveE:any=[]
  const [email, setEmail]: any = React.useState(false);
  const [todayEvent, setTodayEvent]: any = React.useState(false);
  const [peopleName, setPeopleName]: any = React.useState([]);
  const [isChecked, setIsChecked] = React.useState(false);
  const [disableTime, setDisableTime] = React.useState(false);
  //const [maxD, setMaxD] = React.useState(new Date(8640000000000000));
  const [selectedPeople, setSelectedPeople] = React.useState([]);
  const [showRecurrence, setshowRecurrence] = React.useState(false);
  const [showRecurrenceSeriesInfo, setShowRecurrenceSeriesInfo] =
    React.useState(false);
  const [peoplePickerShow, setPeoplePickerShow] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showM, setShowM] = React.useState([]);

  const [newRecurrenceEvent, setNewRecurrenceEvent] = React.useState(false);
  const [editRecurrenceEvent, setEditRecurrenceEvent] = React.useState(false);
  const [returnedRecurrenceInfo, setReturnedRecurrenceInfo] =
    React.useState(null);
  const [recurrenceData, setRecurrenceData] = React.useState(null);
  const returnRecurrenceInfo = (startDate: Date, recurrenceData: string) => {
    const returnedRecurrenceInfo = {
      recurrenceData: recurrenceData,
      eventDate: startDate,
      endDate: moment().add(20, "years").toDate(),
    };
    setReturnedRecurrenceInfo(returnedRecurrenceInfo);
    console.log(returnedRecurrenceInfo);
  };
  const handleRecurrenceCheck = (
    ev: React.FormEvent<HTMLElement | HTMLInputElement>,
    recurChecked: boolean
  ) => {
    ev.preventDefault();
    setShowRecurrenceSeriesInfo(recurChecked);
    setNewRecurrenceEvent(recurChecked);
  };
  console.log("props", props);
  // CUstom header
  const onRenderCustomHeader = () => {
    return (
      <>
        <div
          style={{
            marginRight: "auto",
            fontSize: "20px",
            fontWeight: "600",
            marginLeft: "20px",
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

  const getEvents = async (): Promise<IEventData[]> => {
    let events: IEventData[] = [];

    try {
      const web = new Web(props.props.siteUrl);
      /*const results = await web.lists.getById(props.props.SmalsusLeaveCalendar).renderListDataAsStream(
        {
          DatesInUtc: true,
          ViewXml: `<View><ViewFields><FieldRef Name='RecurrenceData'/><FieldRef Name='Duration'/><FieldRef Name='Author'/><FieldRef Name='Editor'/><FieldRef Name='Category'/><FieldRef Name='Description'/><FieldRef Name='ParticipantsPicker'/><FieldRef Name='Geolocation'/><FieldRef Name='ID'/><FieldRef Name='EndDate'/><FieldRef Name='EventDate'/><FieldRef Name='ID'/><FieldRef Name='Location'/><FieldRef Name='Title'/><FieldRef Name='fAllDayEvent'/><FieldRef Name='EventType'/><FieldRef Name='UID' /><FieldRef Name='fRecurrence' /><FieldRef Name='Event_x002d_Type' /></ViewFields>          
          <RowLimit Paged=\"FALSE\">2000</RowLimit>
          </View>`
        }
      );*/

      const results = await web.lists
        .getById(props.props.SmalsusLeaveCalendar)
        .items.select(
          "RecurrenceData,Duration,Author/Title,Editor/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type"
        )
        .expand("Author,Editor")
        .top(500)
        .getAll();

      const timeZoneOffset: number = await getTimeZoneOffset();

      if (results && results.length > 0) {
        let event: any = "";
        const mapEvents = async (): Promise<boolean> => {
          for (event of results) {
            const eventDate = getLocalTime(event.EventDate, timeZoneOffset);
            const endDate = getLocalTime(event.EndDate, timeZoneOffset);

            const isAllDayEvent: boolean = event["fAllDayEvent.value"] === "1";

            events.push({
              Id: event.ID,
              ID: event.ID,
              EventType: event.EventType,
              title: event.Title ? await deCodeHtmlEntities(event.Title) : "",
              Description: event.Description,
              EventDate: isAllDayEvent
                ? new Date(event.EventDate.slice(0, -1))
                : new Date(eventDate),
              EndDate: isAllDayEvent
                ? new Date(event.EndDate.slice(0, -1))
                : new Date(endDate),
              location: event.Location,
              fAllDayEvent: isAllDayEvent,
              Duration: event.Duration,
              RecurrenceData: event.RecurrenceData
                ? await deCodeHtmlEntities(event.RecurrenceData)
                : "",
              fRecurrence: event.fRecurrence,
              RecurrenceID: event.RecurrenceID ? event.RecurrenceID : undefined,
              MasterSeriesItemID: event.MasterSeriesItemID,
              UID: event.UID ? event.UID.replace("{", "").replace("}", "") : "",
              Author: event.Author,
              Editor: event.Editor,
            });
          }

          return true;
        };
        //Checks to see if there are any results saved in local storage

        //await mapEvents();

        if (window.localStorage.getItem("eventResult")) {
          //if there is a local version - compares it to the current version
          if (
            window.localStorage.getItem("eventResult") ===
            JSON.stringify(results)
          ) {
            //No update needed use current savedEvents
            events = JSON.parse(
              window.localStorage.getItem("calendarEventsWithLocalTime")
            );
          } else {
            //update local storage
            window.localStorage.setItem("eventResult", JSON.stringify(results));
            //when they are not equal then we loop through the results and maps them to IEventData
            /* tslint:disable:no-unused-expression */
            (await mapEvents())
              ? window.localStorage.setItem(
                  "calendarEventsWithLocalTime",
                  JSON.stringify(events)
                )
              : null;
          }
        } else {
          //if there is no local storage of the events we create them
          //window.localStorage.setItem("eventResult", JSON.stringify(results));
          //we also needs to map through the events the first time and save the mapped version to local storage
          (await mapEvents())
            ? window.localStorage.setItem(
                "calendarEventsWithLocalTime",
                JSON.stringify(events)
              )
            : null;
        }
      }

      let parseEvt: parseRecurrentEvent = new parseRecurrentEvent();
      events = parseEvt.parseEvents(events, null, null, timeZoneOffset);

      // Return Data
      return events;
    } catch (error) {
      console.dir(error);
      return Promise.reject(error);
    }
  };

  const getEvent = async (eventId: number): Promise<IEventData> => {
    let returnEvent: any = undefined;

    const web = new Web(props.props.siteUrl);

    const event = await web.lists
      .getById(props.props.SmalsusLeaveCalendar)
      .items.usingCaching()
      .getById(eventId)
      .select(
        "RecurrenceID",
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
        "RecurrenceData",
        "Duration",
        "Category",
        "UID"
      )
      .expand("Author")
      .get();

    const eventDate = await getLocalDateTime(event.EventDate);
    const endDate = await getLocalDateTime(event.EndDate);

    returnEvent = {
      Id: event.ID,
      ID: event.ID,
      EventType: event.EventType,
      title: await deCodeHtmlEntities(event.Title),
      Description: event.Description ? event.Description : "",
      EventDate: new Date(eventDate),
      EndDate: new Date(endDate),
      location: event.Location,
      fAllDayEvent: event.fAllDayEvent,
      Category: event.Category,
      Duration: event.Duration,
      UID: event.UID,
      RecurrenceData: event.RecurrenceData
        ? await deCodeHtmlEntities(event.RecurrenceData)
        : "",
      fRecurrence: event.fRecurrence,
      RecurrenceID: event.RecurrenceID,
      MasterSeriesItemID: event.MasterSeriesItemID,
    };

    return returnEvent;
  };

  const today: Date = new Date();
  const minDate: Date = today;

  const leaveTypes = [
    { key: "Sick", text: "Sick" },
    // { key: "Training", text: "Training " },
    { key: "Planned Leave", text: "Planned" },
    { key: "Un-Planned", text: "Un-Planned" },
    { key: "Restricted Holiday", text: "Restricted Holiday" },
    { key: "LWP", text: "LWP" },
  ];
  const Designation = [
    { key: "SPFx", text: "SPFx" },
    { key: "Share-Web", text: "Share-Web " },
  ];

  const openm = () => {
    setm(true);
  };
  const closem = () => {
    setm(false);
    setInputValueName("");
    setStartDate(null);
    setEndDate(null);
    // setType("");
    sedType("");
    setInputValueReason("");
  };

  const handleInputChangeName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputValueName((event.target as HTMLInputElement).value);
  };

  const handleInputChangeLocation = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocation((event.target as HTMLInputElement).value);
  };

  const handleInputChangeReason = (value: string) => {
    setInputValueReason(value);
  };

  const ConvertLocalTOServerDateToSave = (date: any, Time: any) => {
    if (date != undefined && date != "") {
      const dateString = date;
      const dateObj = moment(dateString, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
      const formattedDater = dateObj.format("ddd MMM DD YYYY");
      //console.log(formattedDater);
      //if (Time != undefined && Time != '')
      // date.setHours(parseInt(Time.split(':')[0]), parseInt(Time.split(':')[1]), parseInt(Time.split(':')[2]))
      return formattedDater;
    } else return "";
  };

  let offset: any;

  const convertDateTimeOffset = (Date: any): string | undefined => {
    let ConvertDateOffset: string | undefined;
    if (Date != undefined && Date != "" && offset != undefined)
      ConvertDateOffset = moment
        .utc(Date)
        .utcOffset(offset)
        .toDate()
        .toISOString();
    return ConvertDateOffset;
  };

  const getData = async () => {
    const events = await getEvents();
    console.log(events);
    const eventsFormatted: any[] = events.map((event) => ({
      iD: event.ID,
      title: event.title,
      start: event.EventDate,
      end: event.EndDate,
      alldayevent: event.fAllDayEvent,
      desc: event.Description,
      eventType: event.Event_x002d_Type,
      created: event.Author.Title,
      modify: event.Editor.Title,
      MasterSeriesItemID: event.MasterSeriesItemID,
      RecurrenceData: event.RecurrenceData,
      RecurrenceID: event.RecurrenceID,
      UID: event.UID,
      fRecurrence: event.fRecurrence,
    }));
    // localArr = eventsFormatted;
    // setEvents(eventsFormatted);
    console.log(eventsFormatted, "dadd");
    // return;
    let localcomp = [];
    let startdate: any, enddate: any, createdAt: any, modifyAt: any;
    const web = new Web(props.props.siteUrl);
    await web.lists
      .getById(props.props.SmalsusLeaveCalendar)
      .items.select("*", "fAllDayEvent", "Author/Title", "Editor/Title")
      .top(4999)
      .orderBy("Created", false)
      .expand("Author", "Editor")
      .get()
      .then((dataaa: any[]) => {
        console.log("datata----", dataaa);

        compareData = dataaa;
        // dataaa.EventDate
        let localArray: any = [];
        //console.log("getdata", dataaa);
        dataaa.map((item: any) => {
          let comp = {
            iD: item.ID,
            title: item.Title,
            start: convertDateTimeOffset(item.EventDate),
            end: convertDateTimeOffset(item.EndDate),
          };
          let a = new Date(comp.start);
          let b = new Date(comp.end);
          console.log("start", a, comp.iD);
          console.log("end", b, comp.iD);
          localcomp.push(comp);
        });

        compareData.map((item: any) => {
          if (item.fAllDayEvent === false) {
            startdate = new Date(item.EventDate);
            startdate.setHours(startdate.getHours() - 12);
            startdate.setMinutes(startdate.getMinutes() - 30);

            createdAt = new Date(item.Created);
            modifyAt = new Date(item.Modified);

            enddate = new Date(item.EndDate);
            enddate.setHours(enddate.getHours() - 12);
            enddate.setMinutes(enddate.getMinutes() - 30);
            //console.log("start", startdate, item.ID);
            //console.log("end", enddate, item.iD);
          } else if (item.fAllDayEvent == true) {
            startdate = new Date(item.EventDate);
            startdate.setHours(startdate.getHours() - 5);
            startdate.setMinutes(startdate.getMinutes() - 30);

            enddate = new Date(item.EndDate);
            enddate.setHours(enddate.getHours() - 5);
            enddate.setMinutes(enddate.getMinutes() - 30);
          }
          let a;
          if (item.Name != undefined && item.Event_x002d_Type != undefined) {
            a = item.Name + "-" + item.Event_x002d_Type + "-" + item.Title;
          } else {
            a = item.Title;
          }

          const dataEvent = {
            shortD: item.Title,
            iD: item.ID,
            title: a,
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
            Name: item.Name,
            Designation: item.Designation,
          };
          // const create ={
          //   id:item.Id,
          //   created:item.Author.Title,
          //   modify:item.Editor.Title,
          // }
          // createdBY.push(create)
          localArray.push(dataEvent);
        });
        localArr = localArray;
        setEvents(localArray);
        setChkName(localArray);
      })
      .catch((error: any) => {
        //console.log(error);
      });
  };

  const deleteElement = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      let web = new Web(props.props.siteUrl);

      await web.lists
        .getById(props.props.SmalsusLeaveCalendar)
        .items.getById(eventPass.iD)
        .delete()

        .then((i: any) => {
          //console.log(i);
          void getData();
          closem();
          void getData();
        });
    }
  };
  const [details, setDetails]: any = React.useState([]);
  const saveEvent = async () => {
    if (inputValueName.length > 0) {
      const chkstartDate = new Date(startDate);
      const chkendDate = new Date(endDate);
      if (chkstartDate > chkendDate) {
        alert("End Date cant fall behind start date");
      } else if (chkstartDate <= chkendDate) {
        {
          if (newRecurrenceEvent) {
            await saveRecurrenceEvent();
            void getData();
            closem();
            setIsChecked(false);
            setSelectedTime(selectedTime);
            setSelectedTimeEnd(selectedTimeEnd);
            return;
          }

          if (
            peopleName == props.props.context._pageContext._user.displayName
          ) {
            setPeopleName(props.props.context._pageContext._user.displayName);
          } else {
            setPeopleName(title_people);
          }
          const newEvent = {
            name: peopleName,
            title: inputValueName,
            start: startDate,
            end: endDate,
            reason: inputValueReason,
            type: type,
            loc: location,
            Designation: dType,
          };

          setDetails(newEvent);

          let eventData = {
            Title: newEvent.title,

            Name: newEvent.name,

            Location: newEvent.loc,

            Event_x002d_Type: newEvent.type,

            Description: newEvent.reason,

            EndDate:
              ConvertLocalTOServerDateToSave(newEvent.end, selectedTimeEnd) +
              " " +
              (selectedTimeEnd + "" + ":00"),

            EventDate:
              ConvertLocalTOServerDateToSave(startDate, selectedTime) +
              " " +
              (selectedTime + "" + ":00"),

            fAllDayEvent: allDay,

            Designation: newEvent.Designation,
          };

          let web = new Web(props.props.siteUrl);

          await web.lists
            .getById(props.props.SmalsusLeaveCalendar)
            .items.add(eventData)
            .then((res: any) => {
              //console.log(res);
              void getData();
              closem();
              setIsChecked(false);
              setSelectedTime(selectedTime);
              setSelectedTimeEnd(selectedTimeEnd);
            });
        }
      }
    } else {
      alert("Please Input Event Title");
    }
    // setEvents([...events, newEvent]);
    // setEvents([...events, saveE]);
    // console.log(newEvent);
  };

  const saveRecurrenceEvent = async () => {
    let _startDate: string = `${moment(returnedRecurrenceInfo.eventDate).format(
      "YYYY/MM/DD"
    )}`;
    let _endDate: string = `${moment(returnedRecurrenceInfo.endDate).format(
      "YYYY/MM/DD"
    )}`;
    // Start Date
    const startTime = selectedTime;
    const startDateTime = `${_startDate} ${startTime}`;
    const start = moment(startDateTime, "YYYY/MM/DD HH:mm").toLocaleString();
    // End Date
    const endTime = selectedTimeEnd;
    const endDateTime = `${_endDate} ${endTime}`;
    const end = moment(endDateTime, "YYYY/MM/DD HH:mm").toLocaleString();

    if (!editRecurrenceEvent) {
      const newEventData: IEventData = {
        EventType: "1",
        Title: inputValueName,
        Location: location,
        Event_x002d_Type: type,
        Description: inputValueReason,
        EventDate: new Date(start),
        EndDate: new Date(end),
        fAllDayEvent: allDay,
        fRecurrence: true,
        RecurrenceData: returnedRecurrenceInfo.recurrenceData,
        UID: uuidv4(),
      };
      await addEvent(newEventData);
    } else if (editRecurrenceEvent) {
      const editEventData: IEventData = {
        EventType: "1",
        Title: inputValueName,
        Location: location,
        Event_x002d_Type: type,
        Description: inputValueReason,
        EventDate: new Date(start),
        EndDate: new Date(end),
        fAllDayEvent: allDay,
        fRecurrence: true,
        RecurrenceData: returnedRecurrenceInfo.recurrenceData,
        UID: uuidv4(),
      };
      await editEvent(editEventData);
    }
  };

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
      ª: "&ordf;",
      "«": "&laquo;",
      "¬": "&not;",
      "®": "&reg;",
      "¯": "&macr;",
      "°": "&deg;",
      "±": "&plusmn;",
      "²": "&sup2;",
      "³": "&sup3;",
      "´": "&acute;",
      µ: "&micro;",
      "¶": "&para;",
      "·": "&middot;",
      "¸": "&cedil;",
      "¹": "&sup1;",
      º: "&ordm;",
      "»": "&raquo;",
      "¼": "&frac14;",
      "½": "&frac12;",
      "¾": "&frac34;",
      "¿": "&iquest;",
      À: "&Agrave;",
      Á: "&Aacute;",
      Â: "&Acirc;",
      Ã: "&Atilde;",
      Ä: "&Auml;",
      Å: "&Aring;",
      Æ: "&AElig;",
      Ç: "&Ccedil;",
      È: "&Egrave;",
      É: "&Eacute;",
      Ê: "&Ecirc;",
      Ë: "&Euml;",
      Ì: "&Igrave;",
      Í: "&Iacute;",
      Î: "&Icirc;",
      Ï: "&Iuml;",
      Ð: "&ETH;",
      Ñ: "&Ntilde;",
      Ò: "&Ograve;",
      Ó: "&Oacute;",
      Ô: "&Ocirc;",
      Õ: "&Otilde;",
      Ö: "&Ouml;",
      "×": "&times;",
      Ø: "&Oslash;",
      Ù: "&Ugrave;",
      Ú: "&Uacute;",
      Û: "&Ucirc;",
      Ü: "&Uuml;",
      Ý: "&Yacute;",
      Þ: "&THORN;",
      ß: "&szlig;",
      à: "&agrave;",
      á: "&aacute;",
      â: "&acirc;",
      ã: "&atilde;",
      ä: "&auml;",
      å: "&aring;",
      æ: "&aelig;",
      ç: "&ccedil;",
      è: "&egrave;",
      é: "&eacute;",
      ê: "&ecirc;",
      ë: "&euml;",
      ì: "&igrave;",
      í: "&iacute;",
      î: "&icirc;",
      ï: "&iuml;",
      ð: "&eth;",
      ñ: "&ntilde;",
      ò: "&ograve;",
      ó: "&oacute;",
      ô: "&ocirc;",
      õ: "&otilde;",
      ö: "&ouml;",
      "÷": "&divide;",
      ø: "&oslash;",
      ù: "&ugrave;",
      ú: "&uacute;",
      û: "&ucirc;",
      ü: "&uuml;",
      ý: "&yacute;",
      þ: "&thorn;",
      ÿ: "&yuml;",
      Œ: "&OElig;",
      œ: "&oelig;",
      Š: "&Scaron;",
      š: "&scaron;",
      Ÿ: "&Yuml;",
      ƒ: "&fnof;",
      ˆ: "&circ;",
      "˜": "&tilde;",
      Α: "&Alpha;",
      Β: "&Beta;",
      Γ: "&Gamma;",
      Δ: "&Delta;",
      Ε: "&Epsilon;",
      Ζ: "&Zeta;",
      Η: "&Eta;",
      Θ: "&Theta;",
      Ι: "&Iota;",
      Κ: "&Kappa;",
      Λ: "&Lambda;",
      Μ: "&Mu;",
      Ν: "&Nu;",
      Ξ: "&Xi;",
      Ο: "&Omicron;",
      Π: "&Pi;",
      Ρ: "&Rho;",
      Σ: "&Sigma;",
      Τ: "&Tau;",
      Υ: "&Upsilon;",
      Φ: "&Phi;",
      Χ: "&Chi;",
      Ψ: "&Psi;",
      Ω: "&Omega;",
      α: "&alpha;",
      β: "&beta;",
      γ: "&gamma;",
      δ: "&delta;",
      ε: "&epsilon;",
      ζ: "&zeta;",
      η: "&eta;",
      θ: "&theta;",
      ι: "&iota;",
      κ: "&kappa;",
      λ: "&lambda;",
      μ: "&mu;",
      ν: "&nu;",
      ξ: "&xi;",
      ο: "&omicron;",
      π: "&pi;",
      ρ: "&rho;",
      ς: "&sigmaf;",
      σ: "&sigma;",
      τ: "&tau;",
      υ: "&upsilon;",
      φ: "&phi;",
      χ: "&chi;",
      ψ: "&psi;",
      ω: "&omega;",
      ϑ: "&thetasym;",
      ϒ: "&Upsih;",
      ϖ: "&piv;",
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
      ℑ: "&image;",
      "℘": "&weierp;",
      ℜ: "&real;",
      "™": "&trade;",
      ℵ: "&alefsym;",
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
      "♦": "&diams;",
    };

    var entityMap = HtmlEntitiesMap;

    for (var key in entityMap) {
      var entity = entityMap[key as keyof typeof entityMap];
      var regex = new RegExp(entity, "g");
      string = string.replace(regex, key);
    }
    string = string.replace(/&quot;/g, '"');
    string = string.replace(/&amp;/g, "&");
    return string;
  };

  const getUtcTime = async (date: string | Date): Promise<string> => {
    const web = new Web(props.props.siteUrl);
    try {
      const utcTime = await web.regionalSettings.timeZone.localTimeToUTC(date);
      return utcTime;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   *
   * @private
   * @returns {Promise<string>}
   * @memberof spservices
   */
  const getLocalTime = (date: string | Date, offset: number): string => {
    const localTime = moment.utc(date).utcOffset(offset);
    return localTime.format("LLL");
  };
  const getLocalDateTime = async (date: string | Date): Promise<string> => {
    try {
      const web = new Web(props.props.siteUrl);
      const localTime = await web.regionalSettings.timeZone.utcToLocalTime(
        date
      );
      return localTime;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getTimeZoneOffset = async (): Promise<number> => {
    const web = new Web(props.props.siteUrl);
    try {
      const timeZoneInfo = (
        await web.regionalSettings.timeZone.select("Information").get()
      ).Information;
      const timeZoneOffset =
        -(
          timeZoneInfo.Bias +
          timeZoneInfo.StandardBias +
          timeZoneInfo.DaylightBias
        ) / 60.0;
      return timeZoneOffset;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const addEvent = async (newEvent: IEventData) => {
    let results = null;
    try {
      const web = new Web(props.props.siteUrl);
      const addEventItem = {
        Title: newEvent.Title,
        Description: newEvent.Description,
        EventDate: await getUtcTime(newEvent.EventDate),
        EndDate: await getUtcTime(newEvent.EndDate),
        Location: newEvent.Location,
        fAllDayEvent: newEvent.fAllDayEvent,
        fRecurrence: newEvent.fRecurrence,
        EventType: newEvent.EventType,
        UID: newEvent.UID,
        RecurrenceData: newEvent.RecurrenceData
          ? await deCodeHtmlEntities(newEvent.RecurrenceData)
          : "",
        MasterSeriesItemID: newEvent.MasterSeriesItemID,
        RecurrenceID: newEvent.RecurrenceID ? newEvent.RecurrenceID : undefined,
      };
      results = await web.lists
        .getById(props.props.SmalsusLeaveCalendar)
        .items.add(addEventItem);
    } catch (error) {
      return Promise.reject(error);
    }
    return results;
  };

  const editEvent = async (editEvent: IEventData) => {
    let results = null;
    try {
      const web = new Web(props.props.siteUrl);
      const editEventItem = {
        Title: editEvent.Title,
        Description: editEvent.Description,
        EventDate: await getUtcTime(editEvent.EventDate),
        EndDate: await getUtcTime(editEvent.EndDate),
        Location: editEvent.Location,
        fAllDayEvent: editEvent.fAllDayEvent,
        fRecurrence: editEvent.fRecurrence,
        EventType: editEvent.EventType,
        UID: editEvent.UID,
        RecurrenceData: editEvent.RecurrenceData
          ? await deCodeHtmlEntities(editEvent.RecurrenceData)
          : "",
        MasterSeriesItemID: editEvent.MasterSeriesItemID,
        RecurrenceID: editEvent.RecurrenceID
          ? editEvent.RecurrenceID
          : undefined,
      };
      results = await web.lists
        .getById(props.props.SmalsusLeaveCalendar)
        .items.getById(eventPass.iD)
        .update(editEventItem);
    } catch (error) {
      return Promise.reject(error);
    }
    return results;
  };

  const updateElement = async () => {
    if (editRecurrenceEvent) {
      await saveRecurrenceEvent();
      void getData();
      closem();
      setIsChecked(false);
      setSelectedTime(selectedTime);
      setSelectedTimeEnd(selectedTimeEnd);
      return;
    }
    let web = new Web(props.props.siteUrl);
    const newEvent = {
      title: inputValueName,
      start: startDate,
      end: endDate,
      reason: inputValueReason,
      type: type,
      Designation: dType,
      loc: location,
    };
    if (
      selectedTime == undefined ||
      selectedTimeEnd == undefined ||
      newEvent.loc == undefined
    ) {
      setSelectedTime("10:00");
      setSelectedTimeEnd("19:00");
      newEvent.loc = "Noida";
    }
    await web.lists
      .getById(props.props.SmalsusLeaveCalendar)
      .items.getById(eventPass.iD)
      .update({
        Title: newEvent.title,

        Location: newEvent.loc,

        Event_x002d_Type: newEvent.type,

        Description: newEvent.reason,
        Designation: newEvent.Designation,

        EndDate:
          ConvertLocalTOServerDateToSave(newEvent.end, selectedTimeEnd) +
          " " +
          (selectedTimeEnd + "" + ":00"),

        EventDate:
          ConvertLocalTOServerDateToSave(startDate, selectedTime) +
          " " +
          (selectedTime + "" + ":00"),

        fAllDayEvent: allDay,
      })
      .then((i: any) => {
        //console.log(i);
        void getData();
        closem();
        setSelectedTime(startTime);
        setSelectedTimeEnd(endTime);
      });
  };

  const handleDateClick = async (event: any) => {
    console.log(event);
    setInputValueName(event.shortD);
    setshowRecurrence(false);
    setPeoplePickerShow(false);
    setShowRecurrenceSeriesInfo(false);
    setEditRecurrenceEvent(false);

    openm();
    if (event.RecurrenceData) {
      setdisab(true);
      eventPass = event;
      setInputValueName(event.shortD);
      // setInputValueName(event.title);
      //setStartDate(event.start);
      //setEndDate(event.end);
      setdisabl(false);
      setIsChecked(event.alldayevent);
      if (event.alldayevent == true) {
        setDisableTime(true);
      }
      setLocation(event.location);
      createdBY = event.created;
      modofiedBy = event.modify;
      setType(event.eventType);
      sedType(event.Designation);
      setInputValueReason(event.desc);

      const eventItem: any = await getEvent(event.iD);
      // Get hours of event
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
    localArr.map((item: any) => {
      
      if (item.iD == event.iD) {
        setdisab(true);
        setVId(item.iD)
        eventPass = event;
        setInputValueName(item.shortD);
        setStartDate(item.start);
        setEndDate(item.end);
        setdisabl(false);
        setIsChecked(item.alldayevent);
        if (item.alldayevent == true) {
          setDisableTime(true);
        }
        setLocation(item.location);
        createdBY = item.created;
        modofiedBy = item.modify;
        const date1 = moment(item.cTime);
        CTime = date1.format("HH:mm:ss");
        CDate = date1.format("DD/MM/YYYY");
        const date = moment(item.mTime);
        MTime = date.format("HH:mm:ss");
        MDate = date.format("DD/MM/YYYY");
        setType(item.eventType);
        sedType(item.Designation);
        setInputValueReason(item.desc);
        setRecurrenceData(item.RecurrenceData);
        setEditRecurrenceEvent(false);
      }
    });
  };

  console.log(CTime, MTime, "faees");

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedPeople(props.props.context._pageContext._user.loginName);
    setPeopleName(props.props.context._pageContext._user.displayName);
    setLocation("");
    setType("Un-Planned")
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
    // if (date.getTime() < today.getTime()) {
    //   alert("Cant add event in past");
    // }
    // else

    openm();
    maxD = new Date(8640000000000000);
    setdisab(false);
    setdisabl(true);
    setStartDate(slotInfo.start);
    setEndDate(slotInfo.start);
    setSelectedTime(selectedTime);
    setSelectedTimeEnd(selectedTimeEnd);
    setIsChecked(false);
    setDisableTime(false);
    maxD = new Date(8640000000000000);
  };
  const handleTimeChange = (time: any) => {
    time = time.target.value;
    startTime = time;
    setSelectedTime(time);
    // console.log("time", time);
  };
  const handleTimeChangeEnd = (time: any) => {
    time = time.target.value;
    endTime = time;
    setSelectedTimeEnd(time);
    // console.log("time", time);
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    // console.log("check", isChecked);
    if (isChecked == false) {
      startTime = "10:00";
      endTime = "19:00";
      setSelectedTimeEnd("19:00");
      setSelectedTime("10:00");
      setEndDate(startDate);
      maxD = startDate;
      //console.log(maxD);
      setDisableTime(true);
      allDay = true;
      //console.log("allDay", allDay);
    } else {
      maxD = new Date(8640000000000000);
      setDisableTime(false);
      allDay = false;
      console.log("allDay", allDay);
    }
  };
  const setStartDatefunction = (date: any) => {
    setStartDate(date);
    if (isChecked == true) {
      setEndDate(date);
      maxD = date;
    }
  };

  // const people = (people:any) => {
  //   console.log("people")
  // };

  const getUserInfo = async (userMail: string) => {
    const userEndPoint: any = `${props.props.context.pageContext.web.absoluteUrl}/_api/Web/EnsureUser`;

    const userData: string = JSON.stringify({
      logonName: userMail,
    });

    const userReqData = {
      body: userData,
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

    if (people.length > 0) {
      let userMail = people[0].id.split("|")[2];
      let userInfo = await getUserInfo(userMail);
      userId = userInfo.Id;
      userTitle = userInfo.Title;
      userSuffix = userTitle
        .split(" ")
        .map((i: any) => i.charAt(0))
        .join("");

      title_people = userTitle;
      setPeopleName(userTitle);
    }
  };

  const handleShowMore = (event: any, date: any) => {
    // console.log
    const dat = new Date(date);
    const formattedDate: any = dat.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setDt(formattedDate);
    // handleSelectSlot(slotinfo2);
    console.log("clicked", event, date);
    setShowM(event);
    openModal();
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const emailCallback = React.useCallback(() => {
    getData();
  }, []);
  const emailComp = () => {
    const currentDate = new Date();
    const currentDayEvents: any = [];

    // const currentDayEvents = chkName.filter(
    //   (event: { start: moment.MomentInput }) =>
    //     moment(event.start).isSame(currentDate, "day")
    // );

    chkName.map((item: any) => {
      if (item.start <= currentDate && currentDate <= item.end) {
        currentDayEvents.push(item);
      }
    });

    console.log(currentDayEvents);
    setTodayEvent(currentDayEvents);
    setEmail(true);
  };

  // var a:any=false
  // if(a==true){
  //   getData();
  // }
  React.useEffect(() => {
    //void getSPCurrentTimeOffset();
    void getData();
  }, []);

  return (
    <div>
      <div style={{ height: "500pt" }}>
        <a className="mailBtn" href="#" onClick={emailComp}>
          <FaPaperPlane></FaPaperPlane> <span>Send Leave Summary</span>
        </a>
        {/* <button type="button" className="mailBtn" >
          Email
        </button> */}
        <Calendar
          events={events}
          selectable
          onSelectSlot={handleSelectSlot}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          //components={components}
          // onShowMore={handleShowMore}
          //  onNavigate={handleNavigate}
          defaultDate={moment().toDate()}
          // defaultView={Views.MONTH}
          onShowMore={handleShowMore}
          views={{ month: true, week: false, day: false, agenda: true }}
          localizer={localizer}
          onSelectEvent={handleDateClick}
        />
      </div>

      {email ? (
        <EmailComponenet
          Context={props.props.context}
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
          // isFooterAtBottom={true}
          type={PanelType.medium}
          closeButtonAriaLabel="Close"
        >
          <table className="styled-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {showM?.map((item: any) => {
                return (
                  <tr>
                    <td>{item.title}</td>
                    <td>
                      <a href="#" onClick={() => handleDateClick(item)}>
                        <span
                          title="Edit"
                          className="svg__iconbox svg__icon--edit"
                        ></span>
                      </a>
                    </td>
                    <td>
                      <a href="#" onClick={deleteElement}>
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
        onDismiss={closem}
        // isFooterAtBottom={true}
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
                defaultSelectedUsers={selectedPeople}
              ></PeoplePicker>
            </div>
          ) : (
            ""
          )}
          <div className="col-md-12">
            <TextField
              label="Short Description"
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
              />
            </div>
          )}
          {!disableTime ? (
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
          )}
          {showRecurrenceSeriesInfo != true && (
            <div className="col-md-6">
              <DatePicker
                label="End Date"
                value={endDate}
                minDate={startDate}
                maxDate={maxD}
                onSelectDate={(date) => setEndDate(date)}
              />
            </div>
          )}
          {!disableTime ? (
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
          )}
          <div>
            <label>
              <input
                type="checkbox"
                className="me-1"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              All Day Event
            </label>
          </div>
          {
            <div>
              {showRecurrence && (
                <div
                  className="bdr-radius"
                  style={{
                    display: "inline-block",
                    verticalAlign: "top",
                    width: "200px",
                  }}
                >
                  <Toggle
                    className="rounded-pill"
                    defaultChecked={false}
                    checked={showRecurrenceSeriesInfo}
                    inlineLabel
                    label="Recurrence ?"
                    onChange={handleRecurrenceCheck}
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
                  returnRecurrenceData={returnRecurrenceInfo}
                ></EventRecurrenceInfo>
              )}
            </div>
          }
          <div>
            <TextField
              label="Location"
              value={location}
              onChange={handleInputChangeLocation}
            />
          </div>{" "}
          <Dropdown
            label="Leave Type"
            options={leaveTypes}
            selectedKey={type}
            // defaultSelectedKey="Un-Planned" // Set the defaultSelectedKey to the key of "Planned Leave"
            onChange={(e, option) => setType(option.key)}
          />
          <Dropdown
            label="Designation"
            options={Designation}
            selectedKey={dType}
            onChange={(e, option) => sedType(option.key)}
          />
          <div className="col-md-12">
            <ReactQuill
              value={inputValueReason}
              onChange={handleInputChangeReason}
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
                  Last Modified {MDate} {MTime} by {modofiedBy} <VersionHistoryPopup   taskId={vId}
                          listId={props.props.SmalsusLeaveCalendar}
                          siteUrls={props.props.siteUrl} />
                </div>
                <div>
                  <a href="#" onClick={deleteElement}>
                    <span className="svg__iconbox svg__icon--trash"></span>{" "}
                    Delete this Item
                  </a>
                </div>
                        
              </div>
              <a target='_blank' href ={`${props.props.siteUrl}/Lists/SmalsusLeaveCalendar/EditForm.aspx?ID=${vId}`}>Open out-of-the-box form</a>
              <div>
                <button
                  className="btn btn-primary px-3"
                  onClick={updateElement}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-default ms-1 px-3"
                  onClick={closem}
                >
                  Cancel
                </button>
              </div>
            </div>
          </footer>
        ) : (
          ""
        )}

        {!disab ? (
          <div className="modal-footer">
            <button className="btn btn-primary px-3" onClick={saveEvent}>
              Save
            </button>
            <button
              type="button"
              className="btn btn-default ms-1 px-3"
              onClick={closem}
            >
              Cancel
            </button>
          </div>
        ) : (
          ""
        )}
      </Panel>
    </div>
  );
};

export default App;
