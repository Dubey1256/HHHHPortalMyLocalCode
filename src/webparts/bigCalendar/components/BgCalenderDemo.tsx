// import * as React from 'react'
// import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar'
// import * as moment from 'moment';
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { Panel, PanelType } from 'office-ui-fabric-react';
// import { Web } from 'sp-pnp-js';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import 'bootstrap/dist/css/bootstrap.css';
// import 'moment-timezone';
// const EditData: any = {};

// const Timearray: any = [
//     { Title: 'AM', TimeValue: '08:00' },
//     { Title: 'PM', TimeValue: '08:30' },
//     { Title: '', TimeValue: '09:00' },
//     { Title: '', TimeValue: '09:30' },
//     { Title: '', TimeValue: '10:00' },
//     { Title: '', TimeValue: '10:30' },
//     { Title: '', TimeValue: '11:00' },
//     { Title: '', TimeValue: '11:30' },
//     { Title: '', TimeValue: '12:00' },
//     { Title: '', TimeValue: '12:30' },
//     { Title: '', TimeValue: '13:00' },
//     { Title: '', TimeValue: '13:30' },
//     { Title: '', TimeValue: '14:00' },
//     { Title: '', TimeValue: '14:30' },
//     { Title: '', TimeValue: '15:00' },
//     { Title: '', TimeValue: '15:30' },
//     { Title: '', TimeValue: '16:00' },
//     { Title: '', TimeValue: '16:30' },
//     { Title: '', TimeValue: '15:00' },

//     // { Title: '12 Pm', TimeValue: '' },
//     // { Title: '1 Pm', TimeValue: '' },
//     // { Title: '2 Pm', TimeValue: '' },
//     // { Title: '3 Pm', TimeValue: '' },
//     // { Title: '4 Pm', TimeValue: '' },
//     // { Title: '5 Pm', TimeValue: '' },
//     // { Title: '6 Pm', TimeValue: '' },
//     // { Title: '7 Pm', TimeValue: '' },
//     // { Title: '8 Pm', TimeValue: '' },
//     // { Title: '9 Pm', TimeValue: '' },
//     // { Title: '10 Pm', TimeValue: '' },
//     // { Title: '11 Pm', TimeValue: '' },
// ]
// const defaultDate =  new Date(2015, 3, 1);
// //const resourceMap: any = []
// //const events: any = []
// const views: any = ['day', 'work_week'];
// const events = [
//     {
//         id: 0,
//         title: 'All Day Event very long title',
//         allDay: true,
//         start: new Date(2015, 3, 0),
//         end: new Date(2015, 3, 1),
//       },
//       {
//         id: 1,
//         title: 'Long Event',
//         start: new Date(2015, 3, 7),
//         end: new Date(2015, 3, 10),
//       },
    
//       {
//         id: 2,
//         title: 'DTS STARTS',
//         start: new Date(2016, 2, 13, 0, 0, 0),
//         end: new Date(2016, 2, 20, 0, 0, 0),
//       },
    
//       {
//         id: 3,
//         title: 'DTS ENDS',
//         start: new Date(2016, 10, 6, 0, 0, 0),
//         end: new Date(2016, 10, 13, 0, 0, 0),
//       },
    
//       {
//         id: 4,
//         title: 'Some Event',
//         start: new Date(2015, 3, 9, 0, 0, 0),
//         end: new Date(2015, 3, 10, 0, 0, 0),
//       },
//       {
//         id: 5,
//         title: 'Conference',
//         start: new Date(2015, 3, 11),
//         end: new Date(2015, 3, 13),
//         desc: 'Big conference for important people',
//       },
//       {
//         id: 6,
//         title: 'Meeting',
//         start: new Date(2015, 3, 12, 10, 30, 0, 0),
//         end: new Date(2015, 3, 12, 12, 30, 0, 0),
//         desc: 'Pre-meeting meeting, to prepare for the meeting',
//       },
//       {
//         id: 7,
//         title: 'Lunch',
//         start: new Date(2015, 3, 12, 12, 0, 0, 0),
//         end: new Date(2015, 3, 12, 13, 0, 0, 0),
//         desc: 'Power lunch',
//       },
//       {
//         id: 8,
//         title: 'Meeting',
//         start: new Date(2015, 3, 12, 14, 0, 0, 0),
//         end: new Date(2015, 3, 12, 15, 0, 0, 0),
//       },
//       {
//         id: 9,
//         title: 'Happy Hour',
//         start: new Date(2015, 3, 12, 17, 0, 0, 0),
//         end: new Date(2015, 3, 12, 17, 30, 0, 0),
//         desc: 'Most important meal of the day',
//       },
//       {
//         id: 10,
//         title: 'Dinner',
//         start: new Date(2015, 3, 12, 20, 0, 0, 0),
//         end: new Date(2015, 3, 12, 21, 0, 0, 0),
//       },
//       {
//         id: 11,
//         title: 'Planning Meeting with Paige',
//         start: new Date(2015, 3, 13, 8, 0, 0),
//         end: new Date(2015, 3, 13, 10, 30, 0),
//       },
//       {
//         id: 11.1,
//         title: 'Inconvenient Conference Call',
//         start: new Date(2015, 3, 13, 9, 30, 0),
//         end: new Date(2015, 3, 13, 12, 0, 0),
//       },
//       {
//         id: 11.2,
//         title: "Project Kickoff - Lou's Shoes",
//         start: new Date(2015, 3, 13, 11, 30, 0),
//         end: new Date(2015, 3, 13, 14, 0, 0),
//       },
//       {
//         id: 11.3,
//         title: 'Quote Follow-up - Tea by Tina',
//         start: new Date(2015, 3, 13, 15, 30, 0),
//         end: new Date(2015, 3, 13, 16, 0, 0),
//       },
//       {
//         id: 12,
//         title: 'Late Night Event',
//         start: new Date(2015, 3, 17, 19, 30, 0),
//         end: new Date(2015, 3, 18, 2, 0, 0),
//       },
//       {
//         id: 12.5,
//         title: 'Late Same Night Event',
//         start: new Date(2015, 3, 17, 19, 30, 0),
//         end: new Date(2015, 3, 17, 23, 30, 0),
//       },
//       {
//         id: 13,
//         title: 'Multi-day Event',
//         start: new Date(2015, 3, 20, 19, 30, 0),
//         end: new Date(2015, 3, 22, 2, 0, 0),
//       },
//       {
//         id: 14,
//         title: 'Today',
//         start: new Date(new Date().setHours(new Date().getHours() - 3)),
//         end: new Date(new Date().setHours(new Date().getHours() + 3)),
//       },
     
//       {
//         id: 16,
//         title: 'Video Record',
//         start: new Date(2015, 3, 14, 15, 30, 0),
//         end: new Date(2015, 3, 14, 19, 0, 0),
//       },
//       {
//         id: 17,
//         title: 'Dutch Song Producing',
//         start: new Date(2015, 3, 14, 16, 30, 0),
//         end: new Date(2015, 3, 14, 20, 0, 0),
//       },
//       {
//         id: 18,
//         title: 'Itaewon Halloween Meeting',
//         start: new Date(2015, 3, 14, 16, 30, 0),
//         end: new Date(2015, 3, 14, 17, 30, 0),
//       },
//       {
//         id: 19,
//         title: 'Online Coding Test',
//         start: new Date(2015, 3, 14, 17, 30, 0),
//         end: new Date(2015, 3, 14, 20, 30, 0),
//       },
//       {
//         id: 20,
//         title: 'An overlapped Event',
//         start: new Date(2015, 3, 14, 17, 0, 0),
//         end: new Date(2015, 3, 14, 18, 30, 0),
//       },
//       {
//         id: 21,
//         title: 'Phone Interview',
//         start: new Date(2015, 3, 14, 17, 0, 0),
//         end: new Date(2015, 3, 14, 18, 30, 0),
//       },
//       {
//         id: 22,
//         title: 'Cooking Class',
//         start: new Date(2015, 3, 14, 17, 30, 0),
//         end: new Date(2015, 3, 14, 19, 0, 0),
//       },
//       {
//         id: 23,
//         title: 'Go to the gym',
//         start: new Date(2015, 3, 14, 18, 30, 0),
//         end: new Date(2015, 3, 14, 20, 0, 0),
//       },
//       {
//         id: 24,
//         title: 'DST ends on this day (Europe)',
//         start: new Date(2022, 9, 30, 0, 0, 0),
//         end: new Date(2022, 9, 30, 4, 30, 0),
//       },
//       {
//         id: 25,
//         title: 'DST ends on this day (America)',
//         start: new Date(2022, 10, 6, 0, 0, 0),
//         end: new Date(2022, 10, 6, 4, 30, 0),
//       },
//       {
//         id: 26,
//         title: 'DST starts on this day (America)',
//         start: new Date(2023, 2, 12, 0, 0, 0),
//         end: new Date(2023, 2, 12, 4, 30, 0),
//       },
//       {
//         id: 27,
//         title: 'DST starts on this day (Europe)',
//         start: new Date(2023, 2, 26, 0, 0, 0),
//         end: new Date(2023, 2, 26, 4, 30, 0),
//       },
//     ]
// // const events = [
// //     {
// //       id: 0,
// //       title: 'Board meeting',
// //       start: new Date(2018, 0, 29, 9, 0, 0),
// //       end: new Date(2018, 0, 29, 13, 0, 0),
// //       resourceId: 1,
// //     },
// //     {
// //       id: 1,
// //       title: 'MS training',
// //       allDay: true,
// //       start: new Date(2018, 0, 29, 14, 0, 0),
// //       end: new Date(2018, 0, 29, 16, 30, 0),
// //       resourceId: 2,
// //     },
// //     {
// //       id: 2,
// //       title: 'Team lead meeting',
// //       start: new Date(2018, 0, 29, 8, 30, 0),
// //       end: new Date(2018, 0, 29, 12, 30, 0),
// //       resourceId: 3,
// //     },
// //     {
// //       id: 11,
// //       title: 'Birthday Party',
// //       start: new Date(2018, 0, 30, 7, 0, 0),
// //       end: new Date(2018, 0, 30, 10, 30, 0),
// //       resourceId: 4,
// //     },
// //   ]
// const resourceMap = [
//     { resourceId: 1, resourceTitle: 'Board room' },
//     { resourceId: 2, resourceTitle: 'Training room' },
//     { resourceId: 3, resourceTitle: 'Meeting room 1' },
//     { resourceId: 4, resourceTitle: 'Meeting room 2' },
//   ]
// export default function Resource() {
//     const localizer = momentLocalizer(moment);
//     const [EditData, setEditData] = React.useState<any>({});
//     const [AllbookingtItems, setAllItems] = React.useState([]);
//     const [RoomLists, setRoomLists] = React.useState([]);
//     const [OpenAddPopup, setOpenAddPopup] = React.useState(false);
//     const [ExistingOpen, setExistingOpen] = React.useState(false);
//     const [startdate, setStartDate] = React.useState(new Date());
//     const [enddate, setendDate] = React.useState(new Date());



//     const CloseAddPopup = () => {
//         setOpenAddPopup(false)
//     };
//     const ExistingCloseCall = () => {
//         setExistingOpen(false)
//     };
//     const OpenEditPopup = () => {
//         setOpenAddPopup(true)
//         setExistingOpen(false)
//     };

//     const handleDateClick = (arg: any) => {
//         //  alert(arg.dateStr);
//         let finalstarttime = '';
//         EditData.StartAMPM = 'AM';
//         let time1 = arg.start.getHours();
//         let time12 = arg.start.getMinutes();
//         EditData.StartDate = arg.start//moment(arg.start).format('MM/DD/YYYY')
//         EditData.EndDate = arg.end//moment(arg.end).format('MM/DD/YYYY')
//         EditData.Description = '';
//         if (30 > time12 && arg.EndTime === undefined) {
//             let newtime = (time1 <= 9 ? '0' + time1 : time1) + ':00'
//             let newtime1 = (time1 < 9 ? '0' + time1 : time1) + ':30'
//             EditData.StartTime = newtime;
//             EditData.EndTime = newtime1;
//             // setStartTime(newtime);
//             // setEndTime(newtime1);
//         } else if (time12 >= 30 && arg.EndTime === undefined) {
//             let newtimenew: any = (time1 <= 9 ? '0' + time1 : time1) + ':30'
//             let newtime1new: any = (time1 < 9 ? '0' + (time1 + 1) : (time1 + 1)) + ':00'
//             // setStartTime(newtimenew);
//             // setEndTime(newtime1new);
//             EditData.StartTime = newtimenew;
//             EditData.EndTime = newtime1new;
//         }
//         else if (arg.EndTime != undefined) {
//             // setStartTime(arg.StartTime);
//             // setEndTime(arg.EndTime);
//             EditData.title = arg.Title;
//             EditData.Description = arg.Description;
//             EditData.StartDate = moment(arg.start).format('DD/MM/YYYY')
//             EditData.EndDate = moment(arg.end).format('DD/MM/YYYY')
//             EditData.StartTime = arg.StartTime;
//             EditData.EndTime = arg.EndTime;
//             EditData.id = arg.id;
//         }

//         // EditData.StartTime =
//         //     EditData.StartTime = moment(arg.start).format('hh');
//         // EditData.EndTime = moment(arg.end).format('hh');
//         EditData.title = arg.title != undefined ? arg.title : '';


//         setStartDate(arg.start);
//         setendDate(arg.end);

//         resourceMap.forEach((obj: any) => {
//             if (arg.resourceId == obj.resourceId)
//                 EditData.resourceTitle = obj.resourceTitle;

//         })
//         setEditData({ ...EditData })
//         if (arg.id != undefined)
//             setExistingOpen(true)
//         else
//             setOpenAddPopup(true);

//     };
//     const onSelectEventHandler = (arg: any) => {
//         alert('arg.dateStr');

//     }; const onSelectEventSlotHandler = (arg: any) => {
//         alert('arg.dateStr');

//     };
//     let id = 0;
//     // var ConvertLocalTOServerDate = function (LocalDateTime: any, dtformat: any) {
//     //     //if (dtformat == undefined || dtformat == '') dtformat = "DD/MM/YYYY";

//     //     // below logic works fine in all condition 
//     //     if (LocalDateTime != '') {
//     //         var serverDateTime;
//     //         var vLocalDateTime = new Date(LocalDateTime);
//     //         //var offsetObj = GetServerOffset();
//     //         //var IANATimeZoneName = GetIANATimeZoneName();
//     //         var mDateTime = moment(LocalDateTime);
//     //         serverDateTime = mDateTime.tz('Europe/Berlin').format(dtformat); // 5am PDT
//     //         serverDateTime = new Date(serverDateTime);  // 5am PDT
//     //         return serverDateTime;
//     //     }
//     //     return '';
//     // }
//     // const getbookingDetails = async () => {
//     //     let web = new Web('https://sysdatalytics.sharepoint.com/sites/TwigRoomBooking');
//     //     let bookingArraynew = [];
//     //     let bookingArray = [];
//     //     bookingArraynew = await web.lists
//     //         .getById('a647845b-85dc-4388-956f-1dffaeb377e7')
//     //         .items
//     //         .select('Id', 'Title')
//     //         .get();
//     //     if (bookingArraynew != undefined && bookingArraynew.length > 0) {
//     //         bookingArraynew.forEach((obj: any) => {
//     //             resourceMap.push({ 'resourceId': obj.Id, 'resourceTitle': obj.Title })
//     //         })

//     //     }
//     //     setRoomLists(resourceMap);
//     //     var filter = "IsDeleted eq false"
//     //     bookingArray = await web.lists
//     //         .getById('874DC657-1E90-45D4-B355-FF1A078062FB')
//     //         .items
//     //         .select('Id', 'Title', 'Startdate', 'EndDate', 'IsDeleted', 'Description', 'StartTime', 'EndTime', 'RoomList/Title', 'RoomList/Id')
//     //         .expand('RoomList')
//     //         .filter(filter)
//     //         .get();
//     //     if (bookingArray != undefined && bookingArray.length > 0) {
//     //         bookingArray.forEach((obj: any) => {
//     //             const d = new Date(obj.Startdate);
//     //             let year = d.getFullYear();
//     //             var timenew = obj.Startdate.split(year + ' ');

//     //             var dateTime = obj.Startdate.split('T');
//     //             const replaced = obj.StartTime + ':00Z';//(dateTime[1]).substring(3)
//     //             obj.Startdate = (dateTime[0] + 'T' + replaced);
//     //             obj.Startdate = (obj.Startdate);
//     //             var Enddate = obj.EndDate.split('T');
//     //             var time = parseInt(obj.EndTime) - (5.5);
//     //             const Endreplaced = obj.EndTime + ':00Z'// (Enddate[1]).substring(3)
//     //             obj.EndDate = (Enddate[0] + 'T' + Endreplaced);

//     //             obj.EndDate = ConvertLocalTOServerDate(obj.EndDate, '');
//     //             obj.Startdate = ConvertLocalTOServerDate(obj.Startdate, '');
//     //             obj.Startdate = moment(obj.Startdate)
//     //                 .add(-4, 'hours')
//     //             obj.EndDate = moment(obj.EndDate)
//     //                 .add(-4, 'hours')

//     //             if (obj.Description != undefined) {
//     //                 obj.Description = obj.Description.replace(/(<([^>]+)>)/ig, '');
//     //             }
//     //             events.push({ 'id': obj.Id, 'title': obj.Title, 'start': new Date(obj.Startdate), 'StartTime': obj.StartTime, 'EndTime': obj.EndTime, 'end': new Date(obj.EndDate), 'Description': obj.Description, 'resourceId': obj.RoomList != undefined ? obj.RoomList.Id : 0 });

//     //         })

//     //     }
//     //     setAllItems(bookingArray);
//     //     console.log(bookingArray);

//     // }
//     React.useEffect(() => {

//        // getbookingDetails();
//     }, [])
//     const deleteEntry = async (Type: any) => {
//         let web = new Web("https://sysdatalytics.sharepoint.com/sites/TwigRoomBooking");
//         await web.lists.getById('874DC657-1E90-45D4-B355-FF1A078062FB').items.getById(EditData.id).update({
//             IsDeleted: true,
//         }).then((res: any) => {
//             events.forEach((obj: any, index: any) => {
//                 if (EditData.id === obj.id) {
//                   //  events.splice(index, true)
//                 }
//             })
//             setAllItems(bookingArray => [events]);
//             setExistingOpen(false);
//         })
//     }
//     const createComponent = async (Type: any) => {
//         let date1 = moment(startdate);
//         let date2 = moment(enddate);
//         let RoomId = 0;
//         resourceMap.forEach((obj: any) => {
//             if (obj.resourceTitle == EditData.resourceTitle)
//                 RoomId = obj.resourceId;
//         })


//         let postdata = {
//             "Title": EditData.title,
//             "Startdate": (date1).format("MM-DD-YYYY"),
//             "EndDate": (date2).format("MM-DD-YYYY"),
//             "StartTime": EditData.StartTime,
//             "EndTime": EditData.EndTime,
//             "Description": EditData.Description,
//             "RoomListId": RoomId
//         }
//         if (EditData.id != undefined) {
//             let web = new Web("https://sysdatalytics.sharepoint.com/sites/TwigRoomBooking");
//             await web.lists.getById('874DC657-1E90-45D4-B355-FF1A078062FB').items.getById(EditData.id).update({
//                 "Title": EditData.title,
//                 "Startdate": (date1).format("MM-DD-YYYY"),
//                 "EndDate": (date2).format("MM-DD-YYYY"),
//                 "StartTime": EditData.StartTime,
//                 "EndTime": EditData.EndTime,
//                 "Description": EditData.Description,
//                 "RoomListId": RoomId
//             }).then((res: any) => {
//                 events.forEach((obj: any) => {
//                     if (EditData.id === obj.id) {
//                         obj.resourceTitle = EditData.resourceTitle;
//                         obj.title = EditData.title;
//                         obj.Description = EditData.Description;
//                         obj.StartTime = EditData.StartTime;
//                         obj.EndTime = EditData.EndTime;
//                         obj.resourceId = RoomId;
//                     }
//                 })
//                 setAllItems(bookingArray => [events]);
//                 setRoomLists(resourceMap => [resourceMap]);
//             })


//         } else {
//             let web = new Web("https://sysdatalytics.sharepoint.com/sites/TwigRoomBooking");
//             const i = await web.lists
//                 .getById("874DC657-1E90-45D4-B355-FF1A078062FB")
//                 .items
//                 .add(postdata);
//             //getbookingDetails();
//             console.log(i);
//             const d = new Date(i.data.Startdate);
//             let year = d.getFullYear();
//             let timenew = i.data.Startdate.split(year + ' ');

//             let dateTime = i.data.Startdate.split('T');
//             const replaced = i.data.StartTime + ':00Z';//(dateTime[1]).substring(3)
//             i.data.Startdate = (dateTime[0] + 'T' + replaced);
//            // i.data.Startdate = (i.data.Startdate);
//             let Enddate = i.data.EndDate.split('T');
//             let time = parseInt(i.data.EndTime) - (5.5);
//             const Endreplaced = i.data.EndTime + ':00Z'// (Enddate[1]).substring(3)
//             i.data.EndDate = (Enddate[0] + 'T' + Endreplaced);

//             // i.data.EndDate = ConvertLocalTOServerDate(i.data.EndDate, '');
//             // i.data.Startdate = ConvertLocalTOServerDate(i.data.Startdate, '');
//             i.data.Startdate = moment(i.data.Startdate)
//                 .add(-4, 'hours')
//             i.data.EndDate = moment(i.data.EndDate)
//                 .add(-4, 'hours')

//             if (i.data.Description != undefined) {
//                 i.data.Description = i.data.Description.replace(/(<([^>]+)>)/ig, '');
//             }
//          //   events.push({ 'id': i.data.Id, 'title': i.data.Title, 'start': new Date(i.data.Startdate), 'StartTime': i.data.StartTime, 'EndTime': i.data.EndTime, 'end': new Date(i.data.EndDate), 'Description': i.data.Description, 'resourceId': RoomId });
//             setAllItems(bookingArray => [events]);
//             setRoomLists(resourceMap => [resourceMap])
//         }
//         setOpenAddPopup(false)
//     }

//     return (
//         <div>
//             {/* <DemoLink fileName="resource" children={undefined} /> */}
//             {events.length >= 0 ?

//                 <div className="height600">
//                     <div><a onClick={handleDateClick}>Add Event</a></div>
//                     <Calendar
//                     //  defaultDate={defaultDate}
//                     //  events={events}
//                     //  localizer={localizer}
//                     //  popup
//                         popup
//                         selectable
//                         defaultDate={defaultDate}
//                         defaultView={Views.DAY}
//                         events={events}
//                         localizer={localizer}
//                         onDoubleClickEvent={handleDateClick}
//                         resourceIdAccessor="resourceId"
//                         resources={resourceMap}
//                         resourceTitleAccessor="resourceTitle"
//                         onSelectEvent={(slotInfo) => handleDateClick(slotInfo)}
//                         onSelectSlot={handleDateClick}
//                         step={15}
//                         min={moment().hour(8).minute(0).toDate()}
//                         max={moment().hour(17).minute(0).toDate()}
//                         views={views}
//                     />
//                 </div>
//                 : ''}
//             <Panel headerText={` Add new booking `} type={PanelType.medium} isOpen={OpenAddPopup} isBlocking={false} onDismiss={CloseAddPopup}>
//                 <div className='bg-light'>
//                     {OpenAddPopup ?
//                         <div>
//                             <form>
//                                 <div className="form-row">

//                                     <label htmlFor="inputEmail4">Title</label>
//                                     <input type="text" id="inputAddress2" placeholder="Title...." className="form-control" defaultValue={
//                                         EditData.title != undefined ? EditData.title : ""
//                                     }
//                                         onChange={(e) => (EditData.title = e.target.value)} ></input>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col">
//                                         <label htmlFor="inputPassword4">Start Date</label>
//                                         <DatePicker
//                                             className="form-control"
//                                             selected={startdate}
//                                             onChange={startdate => setStartDate(startdate)}
//                                             dateFormat="dd/MM/yyyy"
//                                         />
//                                     </div>
//                                     <div className="col">
//                                         <label htmlFor="inputPassword4">Start Time</label>
//                                         <select className="form-select" defaultValue={EditData.StartTime} onChange={(e) => (EditData.StartTime = e.target.value)}>
//                                             {Timearray.map(function (h: any, i: any) {
//                                                 return (
//                                                     <option key={i} selected={EditData.StartTime == h.TimeValue} value={h.TimeValue} >{h.TimeValue}</option>
//                                                 )
//                                             })}
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col">
//                                         <label htmlFor="inputPassword4">End Date</label>
//                                         <DatePicker
//                                             className="form-control"
//                                             selected={enddate}
//                                             onChange={enddate => setendDate(enddate)}
//                                             dateFormat="dd/MM/yyyy"
//                                         />
//                                     </div>
//                                     <div className="col">
//                                         <label htmlFor="inputPassword4">End Time</label>
//                                         <select className="form-select" defaultValue={EditData.EndTime} onChange={(e) => (EditData.EndTime = e.target.value)}>
//                                             {Timearray.map(function (h: any, i: any) {
//                                                 return (
//                                                     <option key={i} selected={EditData.EndTime == h.TimeValue} value={h.TimeValue} >{h.TimeValue}</option>
//                                                 )
//                                             })}
//                                         </select>
//                                     </div>
//                                 </div>
//                                 <div className="form-group">
//                                     <label htmlFor="inputAddress2">Room List</label>
//                                     <select className="form-select" defaultValue={EditData.resourceTitle} onChange={(e) => (EditData.resourceTitle = e.target.value)}>
//                                         {resourceMap.map(function (h: any, i: any) {
//                                             return (
//                                                 <option key={i} selected={EditData.resourceTitle == h.resourceTitle} value={h.resourceTitle} >{h.resourceTitle}</option>
//                                             )
//                                         })}
//                                     </select>
//                                 </div>
//                                 <div className="form-row">

//                                     <label htmlFor="inputCity">Description</label>
//                                     <textarea className='form-control' defaultValue={EditData.Description} onChange={(e) => (EditData.Description = e.target.value)} ></textarea>
//                                 </div>
//                             </form>
//                             <footer className="mt-2">
//                                 <div>
//                                     <button type="button" className="btn btn-primary " onClick={createComponent}>Save</button>
//                                     <button type="button" className="btn btn-default btn-default ms-1" onClick={CloseAddPopup}>Cancel</button>
//                                 </div>

//                             </footer>
//                         </div>
//                         : ''}</div>
//             </Panel>
//             <Panel headerText={` Exisiting booking `} type={PanelType.medium} isOpen={ExistingOpen} isBlocking={false} onDismiss={ExistingCloseCall}>
//                 <div className='bg-light'>
//                     {ExistingOpen ?
//                         <div>
//                             <table className="table table-bordered">
//                                 <tr>
//                                     <td>Title</td>
//                                     <td>{EditData.title}<span className='pull-right'> <a className="btn btn-primary  " type='button' onClick={OpenEditPopup}>Edit Entry</a></span></td>
//                                 </tr>
//                                 <tr>
//                                     <td>Start Date</td>
//                                     <td>
//                                         {EditData.StartDate}

//                                     </td>

//                                     <td> <div className="col-4 ps-0 mt-2">
//                                         <div className="input-group">
//                                             {EditData.StartTime}
//                                         </div>
//                                     </div></td>
//                                 </tr>
//                                 <tr>
//                                     <td>End Date</td>
//                                     <td>
//                                         {EditData.EndDate}
//                                     </td>
//                                     <td> <div className="col-4 ps-0 mt-2">
//                                         <div className="input-group">

//                                             {EditData.EndTime}
//                                         </div>
//                                     </div></td>
//                                 </tr>
//                                 <tr>
//                                     <td>Room List</td>
//                                     <td> <div className="col-4 ps-0 mt-2">
//                                         <div className="input-group">

//                                             {EditData.resourceTitle}
//                                         </div>
//                                     </div></td>
//                                 </tr>
//                                 <tr>
//                                     <td>Description</td>
//                                     <td>{EditData.Description
//                                     }</td>
//                                 </tr>
//                             </table>
//                             <footer className="mt-2">
//                                 <div>
//                                     <button type="button" className="btn btn-primary " onClick={deleteEntry}>Delete Entry</button>
//                                     <button type="button" className="btn btn-default btn-default ms-1" onClick={() => setExistingOpen(false)}>Cancel</button>
//                                 </div>

//                             </footer>
//                         </div>

//                         : ''}</div>

//             </Panel>
//         </div>
//     )
// }
// // Resource.propTypes = {
// //     localizer: PropTypes.instanceOf(DateLocalizer),
// // }