import * as React from "react";
// import { render } from 'react-dom';
// import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import * as moment from "moment";
// import './style.css';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment-timezone";

// import { Component } from 'react';
// import MyModal from "./MyModal";
import { Web } from "sp-pnp-js";
import {
  Panel,
  PanelType,
  TextField,
  DatePicker,
  PrimaryButton,
  Dropdown,
} from "office-ui-fabric-react";
import { useState } from "react";

import $ from "jquery";
// import { RichText } from 'office-ui-fabric-react';
// import { TextEditor } from '@microsoft/monaco-editor-react';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import 'froala-editor/css/froala_style.min.css';
// import FroalaEditorComponent from 'react-froala-wysiwyg';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
//import TimePicker from 'react-time-picker';
//import { format } from "date-fns";
//import { TimePicker } from "@fluentui/react";

const localizer = momentLocalizer(moment);
let createdBY:any,modofiedBy:any,localArray: any = [];
let startTime: any,
  //   startDateTime: any,
  eventPass: any = {},
  endTime: any,
  allDay: any = false;
// endDateTime: any;
//let dateTime:any,startDate:any,startTime:any,endtDate:any,endTime:any;
let maxD = new Date(8640000000000000);
let recVisible: any = false;
const App = () => {
  const [m, setm]: any = React.useState(false);
  const [events, setEvents]: any = React.useState([]);
  let compareData: any = [];
  // const [isOpen, setIsOpen]:any = React.useState(false);
  // const [name, setName]:any = React.useState('');
  const [startDate, setStartDate]: any = React.useState(null);
  const [endDate, setEndDate]: any = React.useState(null);
  // const [reason, setReason]:any = React.useState('');
  const [type, setType]: any = React.useState("");
  const [inputValueName, setInputValueName] = React.useState("");
  const [inputValueReason, setInputValueReason] = React.useState("");
  // const myButton = document.getElementById("myButton");
  const [disabl, setdisabl] = React.useState(false);
  const [disab, setdisab] = React.useState(false);
  //const [fakeEvent, setfakeEvent] = React.useState([]);
  const [selectedTime, setSelectedTime]: any = React.useState("10:00");
  const [selectedTimeEnd, setSelectedTimeEnd]: any = React.useState("19:00");
  const [location, setLocation]: any = React.useState();
  //const [saveE, setsaveE]:any = React.useState([]);
  //let saveE:any=[]
  const [isChecked, setIsChecked] = React.useState(false);
  const [disableTime, setDisableTime] = React.useState(false);
  //const [maxD, setMaxD] = React.useState(new Date(8640000000000000));

  //Radio Button
  const [buttonState, setButtonState] = React.useState<ButtonState>({
    selectedValue: "",
  });
  //to show recaurrance
  const [isCheckedRecaurance, setIsCheckedRecaurance] = React.useState(false);

  //Last date selection in recaurance
  const [selectedRadio, setSelectedRadio] = useState<string>("noEndDate");
  const [inputValueRadio, setInputValueRadio] = useState<string>("");
  const [dateValueEndRadio, setDateValueEndRadio] = useState<string>("");

  const today: Date = new Date();
  const minDate: Date = today;

  const leaveTypes = [
    { key: "Event", text: "Event" },
    { key: "Training", text: "Training " },
  ];

  interface ButtonState {
    selectedValue: string;
  }

  const openm = () => {
    setm(true);
  };
  const closem = () => {
    setm(false);
    setInputValueName("");
    setStartDate(null);
    setEndDate(null);
    setType("");
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
      // let partsDate = date.split("/");
      // let dateValue = partsDate[1] + "/" + partsDate[0] + "/" + partsDate[2];
      // const [hour, minute] = Time.split(":");
      // const [day, month, year] = date.split("/");
      // const dateObj = new Date(
      //   `${month}/${day}/${year} ${hour}:${minute}:00 GMT+0530`
      // );
      // const ISTDate = new Date(dateObj.getTime());
      // console.log(ISTDate);

      //date = new Date(date);

      // const formattedDater = date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
      // console.log(formattedDater);
      const dateString = date;
      const dateObj = moment(dateString, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
      const formattedDater = dateObj.format("ddd MMM DD YYYY");
      console.log(formattedDater);
      //if (Time != undefined && Time != '')
      // date.setHours(parseInt(Time.split(':')[0]), parseInt(Time.split(':')[1]), parseInt(Time.split(':')[2]))
      return formattedDater;
    } else return "";
  };
  // const ConvertLocalTOServerDateToSavestart = (date: any, Time: any) => {
  //   if (date != undefined && date != "") {
  //     let partsDate = date.split("/");
  //     let dateValue = partsDate[1] + "/" + partsDate[0] + "/" + partsDate[2];
  //     const [hour, minute] = Time.split(":");
  //     const [day, month, year] = date.split("/");
  //     const dateObj = new Date(
  //       `${month}/${day}/${year} ${hour}:${minute}:00 GMT+0530`
  //     );
  //     const ISTDate = new Date(dateObj.getTime() );
  //     console.log(ISTDate);

  //     date = new Date(dateValue);
  //     //if (Time != undefined && Time != '')
  //     // date.setHours(parseInt(Time.split(':')[0]), parseInt(Time.split(':')[1]), parseInt(Time.split(':')[2]))
  //     console.log(date.toDateString());
  //     return ISTDate;
  //   } else return "";
  // };

  // const ConvertLocalTOServerDate = (LocalDateTime:any, dtformat:any) =>{
  //   if (dtformat == undefined || dtformat == "") dtformat = "DD/MM/YYYY"; // below logic works fine in all condition

  //   if (LocalDateTime != "") {
  //     let serverDateTime;
  //     let vLocalDateTime = new Date(LocalDateTime);
  //     console.log(vLocalDateTime);
  //     //var offsetObj = GetServerOffset();
  //     //var IANATimeZoneName = GetIANATimeZoneName();
  //     let mDateTime = moment(LocalDateTime);
  //     serverDateTime = mDateTime.tz("Europe/Berlin").format(dtformat);
  //     // 5am PDT //serverDateTime = mDateTime.tz('America/Los_Angeles').format(dtformat);
  //     // 5am PDT
  //     return serverDateTime;
  //   }
  //   return "";
  // };

  //console.log("saveE",saveE);

  let offset: any;

  const getSPCurrentTimeOffset = (): Promise<void> => {
    return $.ajax({
      url:
        "https://hhhhteams.sharepoint.com/sites/HHHH/SP" +
        "/_api/web/RegionalSettings/TimeZone",
      method: "GET",
      headers: { Accept: "application/json; odata=verbose" },
    }).then((data) => {
      offset =
        -(
          data.d.Information.Bias +
          data.d.Information.StandardBias +
          data.d.Information.DaylightBias
        ) / 60.0;
      // if (GlobalConstants.SP_SITE_TYPE == 'gmbh' || GlobalConstants.SP_SITE_TYPE == '')
      offset = offset - 1;
    });
  };

  try {
    void getSPCurrentTimeOffset();
  } catch (e) {}

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

  // const getAllData =async () =>{
  //   const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
  //   await web.lists
  //     .getById("72ABA576-5272-4E30-B332-25D7E594AAA4")
  //     .items.select("Id","fAllDayEvent","Author/Title","Editor/Title").top(4999)
  //     .orderBy("Created", false).expand("Author","Editor")
  //     .get()
  //     .then((allD)=>{
  //       console.log(allD);
  //      ccmp=allD;
  //      console.log(ccmp);
  //     })
  //     .catch((error)=>{
  //       console.log(error);
  //     })
  // }

  const getData = async () => {
    let localcomp = [];
    let startdate: any, enddate: any;
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    await web.lists
      .getById("72ABA576-5272-4E30-B332-25D7E594AAA4")
      .items.select("*", "fAllDayEvent", "Author/Title", "Editor/Title")
      .top(4999)
      .orderBy("Created", false)
      .expand("Author", "Editor")
      .get()
      .then((dataaa) => {
        console.log("datata", dataaa);
        compareData = dataaa;
        // dataaa.EventDate
        
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

            enddate = new Date(item.EndDate);
            enddate.setHours(enddate.getHours() - 12);
            enddate.setMinutes(enddate.getMinutes() - 30);
            console.log("start", startdate, item.ID);
            console.log("end", enddate, item.iD);
          } else if (item.fAllDayEvent == true) {
            startdate = new Date(item.EventDate);
            startdate.setHours(startdate.getHours() - 5);
            startdate.setMinutes(startdate.getMinutes() - 30);

            enddate = new Date(item.EndDate);
            enddate.setHours(enddate.getHours() - 5);
            enddate.setMinutes(enddate.getMinutes() - 30);
          }
          const dataEvent = {
            iD: item.ID,
            title: item.Title,
            start: startdate,
            end: enddate,
            location: item.Location,
            desc: item.Description,
            alldayevent:item.fAllDayEvent,
            eventType:item.Event_x002d_Type,
            created:item.Author.Title,
            modify:item.Editor.Title,
          };
          // const create ={
          //   id:item.Id,
          //   created:item.Author.Title,
          //   modify:item.Editor.Title,
          // }
          // createdBY.push(create)
          localArray.push(dataEvent);
        });
        setEvents(localArray);
        console.log("dataevent",localArray)

      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  const deleteElement = async () => {
    console.log("eventPassindelete", eventPass);
    // console.log("fakeEventindelete", fakeEvent);
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");

    await web.lists
      .getById("72ABA576-5272-4E30-B332-25D7E594AAA4")
      .items.getById(eventPass.iD)
      .delete()

      .then((i) => {
        console.log(i);
        getData();
        closem();
        getData();
      });
  };

  const saveEvent = async () => {
    const newEvent = {
      title: inputValueName,
      start: startDate,
      end: endDate,
      reason: inputValueReason,
      type: type,
      loc: location,
    };
    console.log("postEvent", allDay);

    //  // const dateObjstart = new Date(newEvent.start);
    //   //const formattedDatestart = dateObjstart.toLocaleDateString("en-IN");
    //   //ConvertLocalTOServerDate(newEvent.start,'');
    //   const dateObjend = new Date(newEvent.end);
    //   const formattedDateend = dateObjend.toLocaleDateString("en-IN");
    if(selectedTime==undefined || selectedTimeEnd==undefined || newEvent.loc==undefined){
      setSelectedTime("10:00");
      setSelectedTimeEnd("19:00"); 
      newEvent.loc=("Noida");
    }

    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");

    await web.lists
      .getById("72ABA576-5272-4E30-B332-25D7E594AAA4")
      .items.add({
        Title: newEvent.title,

        Location: newEvent.loc,

        Event_x002d_Type: newEvent.type,

        Description: newEvent.reason,

        EndDate:ConvertLocalTOServerDateToSave(newEvent.end, selectedTimeEnd) +
          " " +
          (selectedTimeEnd + "" + ":00"),

        EventDate: ConvertLocalTOServerDateToSave(startDate, selectedTime) + " " + (selectedTime + "" + ":00"),

        fAllDayEvent: allDay,
      })
      .then((res: any) => {
        console.log(res);
        getData();
        closem();
        getData();
        setIsChecked(false);
        setSelectedTime(selectedTime);
        setSelectedTimeEnd(selectedTimeEnd);
      })
      .catch((error)=>{
        console.log(error);
      });
    // setEvents([...events, newEvent]);
    // setEvents([...events, saveE]);
    console.log(newEvent);
  };

  const updateElement = async () => {
    let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
    const newEvent = {
      title: inputValueName,
      start: startDate,
      end: endDate,
      reason: inputValueReason,
      type: type,
      loc: location,
    };
    await web.lists
      .getById("72ABA576-5272-4E30-B332-25D7E594AAA4")
      .items.getById(eventPass.iD)
      .update({
        Title: newEvent.title,

        Location: newEvent.loc,

        Event_x002d_Type: newEvent.type,

        Description: newEvent.reason,

        EndDate:ConvertLocalTOServerDateToSave(newEvent.end, selectedTimeEnd) +
          " " +
          (selectedTimeEnd + "" + ":00"),

        EventDate:
          ConvertLocalTOServerDateToSave(startDate, selectedTime) +
          " " +
          (selectedTime + "" + ":00"),

        fAllDayEvent: allDay,
      })
      .then((i) => {
        console.log(i);
        getData();
        closem();
        getData();
        setSelectedTime(startTime);
        setSelectedTimeEnd(endTime);
      });
  };

  const handleDateClick = (event: any) => {
    openm();
    localArray.map((item:any)=>{
      if(item.iD==event.iD){
        setdisab(true);
          eventPass = event;
          setInputValueName(item.title);
          setStartDate(item.start);
          setEndDate(item.end);
          setdisabl(false);
          setIsChecked(item.alldayevent);
          if(item.alldayevent==true){
            setDisableTime(true);
          }
          setLocation(item.location);
          createdBY=item.created;
          modofiedBy=item.modify;
          setType(item.eventType);
          setInputValueReason(item.desc);
      }
    })
    


  };

  const handleSelectSlot = (slotInfo: any) => {
    // myButton.removeAttribute("onclick");
    //saveE=slotInfo;
    const dateStr = slotInfo.start;
    const date = new Date(dateStr);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date.getTime() < today.getTime()) {
      alert("Cant add event in past");
    } else {
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
      
    }
  };
  const handleTimeChange = (time: any) => {
    time = time.target.value;
    startTime = time;
    setSelectedTime(time);
    console.log("time", time);
  };
  const handleTimeChangeEnd = (time: any) => {
    time = time.target.value;
    endTime = time;
    setSelectedTimeEnd(time);
    console.log("time", time);
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    console.log("check", isChecked);
    if (isChecked == false) {
      startTime = "10:00";
      endTime = "19:00";
      setSelectedTimeEnd("19:00");
      setSelectedTime("10:00");
      setEndDate(startDate);
      maxD = startDate;
      console.log(maxD);
      setDisableTime(true);
      allDay = true;
      console.log("allDay", allDay);
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

  // const endDateSetFunction = (date: any) => {
  //   if (isChecked == false || allDay == true) {
  //     setEndDate(startDate);
  //     maxD = startDate;
  //     console.log(maxD);
  //   } else {
  //     setEndDate(date);
  //   }
  // };

  const inputChangeEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueRadio(event.target.value);
  };

  const dateChangeEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateValueEndRadio(event.target.value);
  };

  const getRadio = (selectedRadio: any) => {
    switch (selectedRadio) {
      case "noEndDate":
        return "No end date";
        break;
      case "endDateInput":
        return (
          <>
            <label htmlFor="endDateInput">End date:</label>
            <input
              type="text"
              id="endDateInput"
              value={inputValueRadio}
              onChange={inputChangeEnd}
            />
          </>
        );
        break;
      case "endDatePicker":
        return (
          <>
            <label htmlFor="endDatePicker">End date:</label>
            <input
              type="date"
              id="endDatePicker"
              value={dateValueEndRadio}
              onChange={dateChangeEnd}
            />
          </>
        );
        break;
      default:
        return "";
    }
  };
  const radioChangeEnd = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadio(event.target.value);
    getRadio(event.target.value);
  };

  const checkboxRecaurance = (event: any) => {
    setIsCheckedRecaurance(event.target.checked);
    if (event.target.checked == true) {
      recVisible = true;
    } else {
      recVisible = false;
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setButtonState({ selectedValue: event.currentTarget.value });
  };

  const getDailyLabel = () => {
    return "Daily Label";
  };

  const getWeeklyLabel = () => {
    return "Weekly Label";
  };

  const getMonthlyLabel = () => {
    return "Monthly Label";
  };

  const getYearlyLabel = () => {
    return "Yearly Label";
  };

  const getSelectedOption = () => {
    switch (buttonState.selectedValue) {
      case "daily":
        return getDailyLabel();
      case "weekly":
        return getWeeklyLabel();
      case "monthly":
        return getMonthlyLabel();
      case "yearly":
        return getYearlyLabel();
      default:
        return "";
    }
  };

  React.useEffect(() => {
    void getSPCurrentTimeOffset();
    void getData();
  }, []);

  return (
    <div>
      <div style={{ height: "500pt" }}>
        <Calendar
          events={events}
          selectable
          onSelectSlot={handleSelectSlot}
          defaultView="month"
          startAccessor="start"
          endAccessor="end"
          defaultDate={moment().toDate()}
          // defaultView={Views.MONTH}
          views={{ month: true, week: false, day: false, agenda: false }}
          localizer={localizer}
          onSelectEvent={handleDateClick}
        />
      </div>

      <Panel
        headerText="Leave-S"
        isOpen={m}
        onDismiss={closem}
        // isFooterAtBottom={true}
        type={PanelType.medium}
        closeButtonAriaLabel="Close"
      >
        <form className="row g-3">
          <div className="col-md-12">
            <TextField
              label="Title"
              styles={{ root: { width: "70%" } }}
              value={inputValueName}
              onChange={handleInputChangeName}
            />
          </div>
          {!recVisible ? (
            <div className="col-md-6">
              <DatePicker
                label="Start Date"
                styles={{ root: { width: "70%" } }}
                minDate={minDate}
                value={startDate}
                onSelectDate={(date) => setStartDatefunction(date)}
              />
            </div>
          ) : (
            ""
          )}
          {!disableTime ? (
            <div className="col-md-6">
              <label htmlFor="1">Start Time:</label>
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
          {!recVisible ? (
            <div className="col-md-6">
              <DatePicker
                label="End Date"
                styles={{ root: { width: "70%" } }}
                value={endDate}
                minDate={startDate}
                maxDate={maxD}
                onSelectDate={(date) => setEndDate(date)}
              />
            </div>
          ) : (
            ""
          )}
          {!disableTime ? (
            <div className="col-md-6">
              <label htmlFor="2">End Time:</label>
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
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              All Day Event
            </label>
          </div>

          <label>
            <input
              type="checkbox"
              checked={isCheckedRecaurance}
              onChange={checkboxRecaurance}
            />
            Recurring Event !
          </label>

          {/* Recaurance event */}
          {recVisible ? (
            <div>
              <div className="col-md-12">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Frequency Options"
                >
                  <button
                    type="button"
                    className={`btn btn-secondary ${
                      buttonState.selectedValue === "daily" ? "active" : ""
                    }`}
                    value="daily"
                    onClick={handleButtonClick}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${
                      buttonState.selectedValue === "weekly" ? "active" : ""
                    }`}
                    value="weekly"
                    onClick={handleButtonClick}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${
                      buttonState.selectedValue === "monthly" ? "active" : ""
                    }`}
                    value="monthly"
                    onClick={handleButtonClick}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    className={`btn btn-secondary ${
                      buttonState.selectedValue === "yearly" ? "active" : ""
                    }`}
                    value="yearly"
                    onClick={handleButtonClick}
                  >
                    Yearly
                  </button>
                </div>
                <p>Selected option: {getSelectedOption()}</p>
              </div>
              {/* <div>
                <DatePicker
                  label="Start Date"
                  styles={{ root: { width: "70%" } }}
                  minDate={minDate}
                  value={startDate}
                  onSelectDate={(date) => setStartDatefunction(date)}
                />
              <div>
                <DatePicker
                  label="End Date"
                  styles={{ root: { width: "70%" } }}
                  value={endDate}
                  minDate={startDate}
                  maxDate={maxD}
                  onSelectDate={(date) => setEndDate(date)}
                />
                </div>
              </div> */}
              <div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="noEndDate"
                      checked={selectedRadio === "noEndDate"}
                      onChange={radioChangeEnd}
                    />
                    No end date
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="endDateInput"
                      checked={selectedRadio === "endDateInput"}
                      onChange={radioChangeEnd}
                    />
                    End date (input)
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="endDatePicker"
                      checked={selectedRadio === "endDatePicker"}
                      onChange={radioChangeEnd}
                    />
                    End date (date picker)
                  </label>
                </div>
                <div>{getRadio(radioChangeEnd)}</div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div>
            <TextField
              label="Location"
              styles={{ root: { width: "70%" } }}
              value={location}
              onChange={handleInputChangeLocation}
            />
          </div>
          <div className="col-md-12">
            <ReactQuill
              value={inputValueReason}
              onChange={handleInputChangeReason}
            />
          </div>
        </form>

        <Dropdown
          styles={{ root: { width: "70%" } }}
          label="Leave Type"
          options={leaveTypes}
          selectedKey={type}
          onChange={(e, option) => setType(option.key)}
        />
        <br />
        {!disabl ? (
          <PrimaryButton
            disabled={disabl}
            text="Delete"
            onClick={deleteElement}
          />
        ) : (
          ""
        )}

        {!disabl ? <PrimaryButton text="Update" onClick={updateElement} /> : ""}
        {!disabl ?<p>Created By: {createdBY}</p>  : ""}

        {!disabl ?<p>Modified By: {modofiedBy}</p>  : ""}

        <br />
        {!disab ? <PrimaryButton text="Submit" onClick={saveEvent} /> : ""}
        
      </Panel>
    </div>
  );
};

export default App;
