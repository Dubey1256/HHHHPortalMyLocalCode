import * as React from "react";
// import { render } from 'react-dom';
// import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import { Calendar, momentLocalizer } from "react-big-calendar";
// import * as moment from "moment";
import moment from 'moment';
// import './style.css';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment-timezone";
import { v4 as uuidv4 } from "uuid";
import EmailComponenet from "./email";
import { SPHttpClient } from "@microsoft/sp-http";
import { FaPaperPlane } from "react-icons/fa";
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
  Toggle
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

import {
  PeoplePicker,
  PrincipalType
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import  {MonthlyLeaveReport } from "./MonthlyLeaveReport";
import { Download } from "react-bootstrap-icons";

interface IPeoplePickerComponentProps {
  context: any; // Your SPFx context
  listId: string; // ID of the SharePoint list
  itemId: number; // ID of the item you want to update
  columnName: string; // Name of the people and group column
}

interface IEventData {
  [x: string]: any;
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
// endDateTime: any;
//let dateTime:any,startDate:any,startTime:any,endtDate:any,endTime:any;
let maxD = new Date(8640000000000000);

const App = (props: any) => {
  React.useEffect(() => {
    try {
      $("#spPageCanvasContent").removeClass();
      $("#spPageCanvasContent").addClass("Calendarcl");
      $("#workbenchPageContent").removeClass();
      $("#workbenchPageContent").addClass("Calendarcl");
    } catch (e) {
      console.log(e);
    }
  }, []);

  const [m, setm]: any = React.useState(false);
  const [events, setEvents]: any = React.useState([]);
  let compareData: any = [];
  // const [isOpsetIsOpen]:any = React.useState(false);
  // const [name, setName]:any = React.useState('');
  
  const [leaveReport, setleaveReport] = React.useState(false);
  const [startDate, setStartDate]: any = React.useState(null);
  const [endDate, setEndDate]: any = React.useState(null);
  const [chkName, setChkName]: any = React.useState("");
  const [type, setType]: any = React.useState("");
  const [dType, sedType]: any = React.useState("");
  const [isFirstHalfDChecked, setIsFirstHalfDChecked] = React.useState(false);
  const [isSecondtHalfDChecked, setisSecondtHalfDChecked] = React.useState(false);
  const [inputValueName, setInputValueName] = React.useState("");
  const [inputValueReason, setInputValueReason] = React.useState("");
  // const myButton = document.getElementById("myButton");
  const [vId, setVId] = React.useState();
  const [disabl, setdisabl] = React.useState(false);
  const [disab, setdisab] = React.useState(false);
  const [dt, setDt] = React.useState();
  const [selectedTime, setSelectedTime]: any = React.useState();
  const [selectedTimeEnd, setSelectedTimeEnd]: any = React.useState();
  const [location, setLocation]: any = React.useState();
  //const [saveE, setsaveE]:any = React.useState([]);
  //let saveE:any=[]
  const [email, setEmail]: any = React.useState(false);
  const [todayEvent, setTodayEvent]: any = React.useState(false);
  // Change here array
  const [peopleName, setPeopleName]: any = React.useState();
  const [isChecked, setIsChecked] = React.useState(false);
  const [disableTime, setDisableTime] = React.useState(false);
  //const [maxD, setMaxD] = React.useState(new Date(8640000000000000));
  const [selectedPeople, setSelectedPeople] = React.useState([]);
  const [showRecurrence, setshowRecurrence] = React.useState(false);
  const [showRecurrenceSeriesInfo, setShowRecurrenceSeriesInfo] =
    React.useState(false);
  const [peoplePickerShow, setPeoplePickerShow] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const [showM, setShowM] = React.useState([]);
  const [IsDisableField, setIsDisableField] = React.useState(false);
  const [newRecurrenceEvent, setNewRecurrenceEvent] = React.useState(false);
  const [editRecurrenceEvent, setEditRecurrenceEvent] = React.useState(false);
  const [returnedRecurrenceInfo, setReturnedRecurrenceInfo] =
    React.useState(null);
  const [recurrenceData, setRecurrenceData] = React.useState(null);
  const [selectedKey, setselectedKey] = React.useState('daily');
  // People picker function start
  const [selectedUsers, setSelectedUsers] = React.useState([]);


  const handlePeoplePickerChange = (items: any[]): void => {
    setSelectedUsers(items);
  };

  //  People Picker Function clos
  const returnRecurrenceInfo = (startDate: Date, endDate: Date, recurrenceData: string) => {
    const returnedRecurrenceInfo = {
      recurrenceData: recurrenceData,
      eventDate: startDate,
      endDate: endDate,
      //  endDate: moment().add(20, "years").toDate()
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
          "RecurrenceData,Duration,Author/Title,Editor/Title,NameId,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type,HalfDay,HalfDayTwo,Color"
        )
        .expand("Author,Editor,Employee")
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
            // let mytitle =
            // event.Description + "-" + event.EventType + "-" + event.title;
            events.push({
              Id: event.ID,
              ID: event.ID,
              NameId: event?.Employee?.Id,
              EventType: event.EventType,
              // Title:mytitle
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
              HalfDay: event.HalfDay,
              HalfDayTwo: event.HalfDayTwo,
              Color: event.Color
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
        "UID",
        "HalfDay",
        "HalfDayTwo",
        "Color"
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
      MasterSeriesItemID: event.MasterSeriesItemID
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
  const openm = () => {
    setm(true);
  };
  const closem = (e: any) => {
    if (e != undefined && e?.type === 'mousedown')
      setm(true);
    else
      setm(false);
    setInputValueName("");
    setStartDate(null);
    setEndDate(null);
    // setType("");
    sedType("");
    setInputValueReason("");
    setIsDisableField(false);
    allDay = "false";
    HalfDaye = "false";
    HalfDayT = "false";

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
      NameId: event.NameId,
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
      HalfDay: event.HalfDay,
      HalfDayTwo: event.HalfDayTwo,
      Color: event.Color
    }));
    console.log(eventsFormatted, "dadd");
    let localcomp = [];
    let startdate: any, enddate: any, createdAt: any, modifyAt: any;
    const web = new Web(props.props.siteUrl);
    await web.lists
      .getById(props.props.SmalsusLeaveCalendar)
      .items.select("*", "fAllDayEvent", "Author/Title", "Editor/Title", "Employee/Id", "Employee/Title", "HalfDay", "HalfDayTwo", "Color")
      .top(4999)
      .orderBy("Created", false)
      .expand("Author", "Editor", "Employee")
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
            end: convertDateTimeOffset(item.EndDate)
          };
          let a = new Date(comp.start);
          let b = new Date(comp.end);
          console.log("start", a, comp.iD);
          console.log("end", b, comp.iD);
          localcomp.push(comp);
        });
        compareData.map((item: any) => {
          item.clickable = true;
          if (item?.Event_x002d_Type == 'Company Holiday' || item?.Event_x002d_Type == 'National Holiday')
            item.clickable = false;
          if (item.fAllDayEvent === false) {
            startdate = new Date(item.EventDate);
            startdate.setHours(startdate.getHours() - 13);
            startdate.setMinutes(startdate.getMinutes() - 30);
            createdAt = new Date(item.Created);
            modifyAt = new Date(item.Modified);
            enddate = new Date(item.EndDate);
            enddate.setHours(enddate.getHours() - 13);
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
          let a = item.Title;

          // if (item?.Employee?.Title != undefined && item.Event_x002d_Type != undefined) {
          //   a = item?.Employee?.Title + "-" + item.Event_x002d_Type + "-" + item.Title;
          // } else {
          //   a = item.Title;
          // }

          const dataEvent = {
            shortD: item.Title,
            iD: item.ID,
            NameId: item?.Employee?.Id,
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
            Name: item.Employee?.Title,
            Designation: item.Designation,
            HalfDay: item.HalfDay,
            HalfDayTwo: item.HalfDayTwo,
            clickable: item?.clickable,
            Color: item.Color
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
          void getData();
          closem(undefined);
          closeModal();
          void getData();
        });
    }
  };
  const [details, setDetails]: any = React.useState([]);
  const saveEvent = async () => {
    if (inputValueName?.length > 0 && (dType?.length > 0 || type == "National Holiday" || type == "Company Holiday")) {
      const chkstartDate = new Date(startDate);
      const chkendDate = new Date(endDate);
      if (chkstartDate > chkendDate) {
        alert("End Date cant fall behind start date");
      } else if (chkstartDate <= chkendDate) {
        {
          if (newRecurrenceEvent) {
            await saveRecurrenceEvent();
            void getData();
            closem(undefined);
            setIsChecked(false);
            setIsFirstHalfDChecked(false);
            setisSecondtHalfDChecked(false);
            setSelectedTime(selectedTime);
            setSelectedTimeEnd(selectedTimeEnd);
            return;
          }
          if (
            peopleName === props.props.context._pageContext._user.displayName
          ) {
            // If the condition is true, update the peopleName to match the display name
            setPeopleName(props.props.context._pageContext._user.displayName);
          } else {
            // If the condition is false, set the peopleName to the default value (title_people)
            setPeopleName(title_people);
          }
          // if (
          //   peopleName == props.props.context._pageContext._user.displayName
          // ) {
          //   setPeopleName(props.props.context._pageContext._user.displayName);
          // } else {
          //   setPeopleName(title_people);
          // }
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
          if (newEvent != undefined && (newEvent?.type == "National Holiday" || newEvent?.type == "Company Holiday"))
            mytitle = newEvent.type + "-" + newEvent.title;
          let mycolors = (HalfDaye === true || HalfDayT === true) ? "#6d36c5" : newEvent.type === "Work From Home" ? "#e0a209" : (newEvent.type === "Company Holiday" || newEvent.type === "National Holiday") ? "#228B22" : "";

          let eventData = {
            Title: mytitle,

            // Name: newEvent.name,
            EmployeeId: newEvent.nameId,

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

            HalfDay: HalfDaye,
            HalfDayTwo: HalfDayT,
            Designation: newEvent.Designation,
            Color: mycolors
          };

          let web = new Web(props.props.siteUrl);

          await web.lists
            .getById(props.props.SmalsusLeaveCalendar)
            .items.add(eventData)
            .then((res: any) => {
              //console.log(res);
              void getData();
              closem(undefined);
              setIsChecked(false);
              setIsFirstHalfDChecked(false);
              setisSecondtHalfDChecked(false);
              setSelectedTime(selectedTime);
              setSelectedTimeEnd(selectedTimeEnd);
              allDay = "false";
              HalfDaye = "false";
              HalfDayT = "false";
            });
        }
      }
    } else {
      alert("Please Fill the short description and Team and Leave Type");
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
      let mytitle =
        peopleName + "-" + type + "-" + inputValueName;
      let mycolors = (HalfDaye === true || HalfDayT === true) ? "#6d36c5" : type === "Work From Home" ? "#e0a209" : (type === "Company Holiday" || type === "National Holiday") ? "#228B22" : "";
      const newEventData: IEventData = {

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
      let mytitle =
        peopleName + "-" + type + "-" + inputValueName;
      let mycolors = (HalfDaye === true || HalfDayT === true) ? "#6d36c5" : type === "Work From Home" ? "#e0a209" : (type === "Company Holiday" || type === "National Holiday") ? "#228B22" : "";
      const editEventData: IEventData = {
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
        reason: inputValueReason,
        EndDate: new Date(end),
        fAllDayEvent: allDay,
        fRecurrence: true,
        RecurrenceData: returnedRecurrenceInfo.recurrenceData,
        UID: uuidv4()
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
      "♦": "&diams;"
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

      let mycolors = (HalfDaye === true || HalfDayT === true) ? "#6d36c5" : newEvent.Event_x002d_Type === "Work From Home" ? "#e0a209" : (newEvent.Event_x002d_Type === "Company Holiday" || newEvent.Event_x002d_Type === "National Holiday") ? "#228B22" : "";
      const addEventItem = {
        Title: newEvent.Title,
        Description: newEvent.Description,
        EventDate: await getUtcTime(newEvent.EventDate),
        Event_x002d_Type: newEvent.Event_x002d_Type,
        EndDate: await getUtcTime(newEvent.EndDate),
        Location: newEvent.Location,
        Designation: newEvent.Designation,
        fAllDayEvent: newEvent.fAllDayEvent,
        fRecurrence: newEvent.fRecurrence,
        EventType: newEvent.EventType,
        Color: mycolors,
        UID: newEvent.UID,
        HalfDay: HalfDaye,
        HalfDayTwo: HalfDayT,
        RecurrenceData: newEvent.RecurrenceData
          ? await deCodeHtmlEntities(newEvent.RecurrenceData)
          : "",
        MasterSeriesItemID: newEvent.MasterSeriesItemID,
        RecurrenceID: newEvent.RecurrenceID ? newEvent.RecurrenceID : undefined
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
      let mytitle =
        editEvent.name + "-" + editEvent.type + "-" + editEvent.title;
      let mycolors = (HalfDaye === true || HalfDayT === true) ? "#6d36c5" : editEvent.Event_x002d_Type === "Work From Home" ? "#e0a209" : (editEvent.Event_x002d_Type === "Company Holiday" || editEvent.Event_x002d_Type === "National Holiday") ? "#228B22" : "";

      const editEventItem = {
        Title: mytitle,
        Description: editEvent.Description,
        Event_x002d_Type: editEvent.Event_x002d_Type,
        EventDate: await getUtcTime(editEvent.EventDate),
        EndDate: await getUtcTime(editEvent.EndDate),
        Location: editEvent.Location,
        Designation: editEvent.Designation,
        fAllDayEvent: editEvent.fAllDayEvent,
        fRecurrence: editEvent.fRecurrence,
        EventType: editEvent.EventType,
        UID: editEvent.UID,
        HalfDay: editEvent.HalfDay,
        HalfDayTwo: editEvent.HalfDayTwo,
        Color: mycolors,
        RecurrenceData: editEvent.RecurrenceData
          ? await deCodeHtmlEntities(editEvent.RecurrenceData)
          : "",
        MasterSeriesItemID: editEvent.MasterSeriesItemID,
        RecurrenceID: editEvent.RecurrenceID
          ? editEvent.RecurrenceID
          : undefined
      };
      // if (!HalfDaye && !HalfDayT) {
      //   editEventItem.Event_x002d_Type = editEvent.Event_x002d_Type;
      // }
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
      closem(undefined);
      setIsFirstHalfDChecked(false)
      setisSecondtHalfDChecked(false)
      setIsChecked(false);
      setSelectedTime(selectedTime);
      setSelectedTimeEnd(selectedTimeEnd);
      return;
    }
    let web = new Web(props.props.siteUrl);
    const newEvent = {
      title: inputValueName,
      name: peopleName,
      // nameId:title_Id,
      start: startDate,
      end: endDate,
      reason: inputValueReason,
      type: type,
      // isChecked ? type : HalfDaye ? "HalfDay" : HalfDayT ? "HalfDay" :
      Designation: dType,
      loc: location,
      halfdayevent: isFirstHalfDChecked,
      halfdayeventT: isSecondtHalfDChecked,
      fulldayevent: isChecked
    };

    if (
      selectedTime == undefined ||
      selectedTimeEnd == undefined ||
      newEvent.loc == undefined
    ) {
      const date = moment(startDate);
      date.tz("Asia/Kolkata");
      const time = date.format();

      const dateend = moment(endDate);
      dateend.tz("Asia/Kolkata");
      const timeend = date.format();
      setSelectedTime(time);
      setSelectedTimeEnd(timeend);
      newEvent.loc = "";
    }
    newEvent.title = newEvent.title.replace("Un-Planned", newEvent.type);
    newEvent.title = newEvent.title.replace("Sick", newEvent.type);
    newEvent.title = newEvent.title.replace("Planned Leave", newEvent.type);
    newEvent.title = newEvent.title.replace(
      "Restricted Holiday",
      newEvent.type
    );
    newEvent.title = newEvent.title.replace(
      "Work From Home",
      newEvent.type
    );
    newEvent.title = newEvent.title.replace(
      "Half Day",
      newEvent.type
    );


    newEvent.title = newEvent.title.replace(
      "fulldayevent",
      newEvent.type
    );
    newEvent.title = newEvent.title.replace("LWP", newEvent.type);

    let mycolors = (newEvent.halfdayevent === true || newEvent.halfdayeventT === true) ? "#6d36c5" : newEvent.type === "Work From Home" ? "#e0a209" : (newEvent.type === "Company Holiday" || newEvent.type === "National Holiday") ? "#228B22" : "";

    await web.lists
      .getById(props.props.SmalsusLeaveCalendar)
      .items.getById(eventPass.iD)
      .update({
        Title: newEvent.title,
        // Name: newEvent.name,
        // EmployeeId:newEvent.nameId,
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
        HalfDay: newEvent.halfdayevent,
        HalfDayTwo: newEvent.halfdayeventT,
        Color: mycolors,
        fAllDayEvent: newEvent.fulldayevent
      })
      .then((i: any) => {
        //console.log(i);
        void getData();
        closem(undefined);
        setSelectedTime(startTime);
        setSelectedTimeEnd(endTime);
        allDay = "false";
        HalfDaye = "false";
      });
  };

  const handleDateClick = async (event: any) => {
    console.log(event);
    setInputValueName(event.shortD);
    setshowRecurrence(false);
    setPeoplePickerShow(false);
    setShowRecurrenceSeriesInfo(false);
    setEditRecurrenceEvent(false);
    if (event?.eventType == "Company Holiday" || event?.eventType == "National Holiday")
      setIsDisableField(true)
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
      setIsFirstHalfDChecked(event.HalfDay)
      setisSecondtHalfDChecked(event.HalfDayTwo)
      if (event.alldayevent == true) {
        setDisableTime(true);
      }
      if (event.HalfDay == true) {
        setDisableTime(true);
      }
      if (event.HalfDayTwo == true) {
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
        setVId(item.iD);
        eventPass = event;
        setInputValueName(item.shortD);
        setStartDate(item.start);
        setEndDate(item.end);
        setdisabl(false);
        setIsChecked(item.alldayevent);
        setIsFirstHalfDChecked(item.HalfDay)
        setisSecondtHalfDChecked(item.HalfDayTwo)
        if (item.alldayevent == true) {
          setDisableTime(true);
        }
        if (item.HalfDay == true) {
          setDisableTime(true);
        }
        if (item.HalfDayTwo == true) {
          setDisableTime(true);
        }
        setLocation(item.location);
        createdBY = item.created;
        modofiedBy = item.modify;
        MDate = moment(item.mTime).format("DD-MM-YYYY");
        MTime = moment(item.mTime).tz("Asia/Kolkata").format("HH:mm")
        CDate = moment(item.cTime).format("DD-MM-YYYY");
        CTime = moment(item.cTime).tz("Asia/Kolkata").format("HH:mm")
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

  console.log(CTime, MTime, "faees");

  const handleSelectSlot = (slotInfo: any) => {
    let yname;
    people(yname);
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
    // if (date.getTime() < today.getTime()) {
    //   alert("Cant add event in past");
    // }
    // else
    let IsOpenAddPopup = true;
    const { start, end } = slotInfo;
    const eventsInSlot = events.filter((event: any) => event.start >= start && event.end <= end);
    if (eventsInSlot != undefined && eventsInSlot?.length > 0) {
      for (let index = 0; index < eventsInSlot.length; index++) {
        let item = eventsInSlot[index];
        if (item.clickable == false) {
          IsOpenAddPopup = false;
          break;
        }
      }
    }
    console.log('Events in selected slot:', eventsInSlot);
    eventsInSlot?.forEach((event: any) => {

    })
    if (IsOpenAddPopup == true)
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
      HalfDaye = false;
      HalfDayT = false;
      setIsFirstHalfDChecked(HalfDaye)
      setisSecondtHalfDChecked(HalfDayT)
      //console.log("allDay", allDay);
    } else {
      maxD = new Date(8640000000000000);
      setDisableTime(false);
      allDay = false;
      console.log("allDay", allDay);
    }
  };
  const handleHalfDayCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFirstHalfDChecked(event.target.checked);
    // console.log("check", isChecked);
    if (isFirstHalfDChecked == false) {
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
      setisSecondtHalfDChecked(HalfDayT)
      setIsChecked(allDay);
      //console.log("allDay", allDay);
    } else {
      maxD = new Date(8640000000000000);
      setDisableTime(false);
      HalfDaye = false;
      console.log("HalfDay", HalfDaye);
    }
  };
  const handleHalfDayCheckboxChangeSecond = (event: React.ChangeEvent<HTMLInputElement>) => {
    setisSecondtHalfDChecked(event.target.checked);
    if (isSecondtHalfDChecked == false) {
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
      setIsFirstHalfDChecked(HalfDaye)

      setIsChecked(allDay);
      //console.log("allDay", allDay);
    } else {
      maxD = new Date(8640000000000000);
      setDisableTime(false);
      HalfDayT = false;
      console.log("HalfDayTwo", HalfDayT);
    }
  }
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
    //const formattedDate = new Date().toLocaleDateString("en-GB");

    // const currentDayEvents = chkName.filter(
    //   (event: { start: moment.MomentInput }) =>
    //     moment(event.start).isSame(currentDate, "day")
    // );

    chkName.map((item: any) => {
      if (item.start.setHours(0, 0, 0, 0) <= currentDate.setHours(0, 0, 0, 0) && currentDate.setHours(0, 0, 0, 0) <= item.end.setHours(0, 0, 0, 0)) {
        currentDayEvents.push(item);
      }
    });


    console.log(currentDayEvents);
    setTodayEvent(currentDayEvents);
    setEmail(true);
  };
 const DownloadLeaveReport = () =>{
    setleaveReport(true);
 }

  // var a:any=false
  // if(a==true){
  //   getData();
  // }
  React.useEffect(() => {
    //void getSPCurrentTimeOffset();
    void getData();
  }, [m]);

  // for the new color for the new 

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
  const HandledLeaveType = (option: any) => {
    if (option == "Company Holiday" || option == "National Holiday") {
      //setInputValueName(option);
      setIsChecked(true);
      allDay = true
      setIsDisableField(true)
      setShowRecurrenceSeriesInfo(false);
      setNewRecurrenceEvent(false);
      // if (option == "National Holiday") {
      //   setShowRecurrenceSeriesInfo(true);
      //   setNewRecurrenceEvent(true);
      //   setselectedKey('yearly')
      // }
    }
    else {
      // setInputValueName('');
      setIsChecked(false);
      allDay = false
      setIsDisableField(false)
      // setShowRecurrenceSeriesInfo(false);
      // setNewRecurrenceEvent(false);
      // setRecurrenceData(null)
      // setselectedKey('daily')
    }
    setType(option)
  }

  //  If type === work from home 


  return (
    <div>
      <div className="w-100 text-end">
        <a
          target="_blank"
          data-interception="off"
          href={`${props.props.siteUrl}/SitePages/SmalsusLeaveCalendar-old.aspx`}
        >
          {" "}
          Old Leave Calendar
        </a>
      </div>
      <div className="w-100 text-end">
      {props.props.context._pageContext._user.email === ('anubhav.shukla@hochhuth-consulting.de'|| "deepak@hochhuth-consulting.de" ||"prashant.kumar@hochhuth-consulting.de" || "prashant@hochhuth-consulting.de") && <a  href="#" onClick={DownloadLeaveReport}>
           <span>Generate Monthly Report</span>
        </a> }
        |
        <a
          target="_blank"
          data-interception="off"
          href={`${props.props.siteUrl}/Lists/SmalsusLeaveCalendar/calendar.aspx`}
        >
          {" "}
          Add to Outlook Calendar
        </a>
      </div>
      <div style={{ height: "500pt" }}>
     {props.props.context._pageContext._user.email === ('anubhav.shukla@hochhuth-consulting.de'||"prashant@hochhuth-consulting.de"|| "deepak@hochhuth-consulting.de" ||"prashant.kumar@hochhuth-consulting.de")&&
        <a className="mailBtn me-4" href="#" onClick={emailComp}>
          <FaPaperPlane></FaPaperPlane> <span>Send Leave Summary</span>
        </a>
        }
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
          defaultDate={moment().toDate()}
          // defaultView={Views.MONTH}
          onShowMore={handleShowMore}
          views={{ month: true, week: true, day: true, agenda: true }}
          localizer={localizer}
          onSelectEvent={handleDateClick}
          eventPropGetter={eventStyleGetter}
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
                  returnRecurrenceData={returnRecurrenceInfo}
                  selectedKey={selectedKey}
                  selectedRecurrenceRule={selectedKey}
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
                href={`${props.props.siteUrl}/Lists/SmalsusLeaveCalendar/EditForm.aspx?ID=${vId}`}
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

      {leaveReport ? <MonthlyLeaveReport props={props.props} Context={props.props.context} trueval ={ leaveReport} settrue={setleaveReport}/>:""}
    </div>
  );
};

export default App;