import React, { useEffect, useState } from 'react';
import { Web } from 'sp-pnp-js';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { Modal, Button, Form } from 'react-bootstrap';

let allReportData: any = [];
export const MonthlyLeaveReport = (props: any) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectendDate, setselectendDate] = useState('');
  const [AllTaskuser, setAllTaskuser] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [opendate, setopendate] = useState(true);
  const getTaskUser = async () => {
    let web = new Web(props.props.siteUrl);
    try {
      const Data: any[] = await web.lists
        .getById(props.props.TaskUsertListID)
        .items.orderBy("Created", true)
        .filter("UserGroupId ne 295")
        .get();

      const mydata = Data.filter((item) => item.UserGroupId != null && item.UserGroupId !== 131 && item.UserGroupId !== 147 && item.UserGroupId !== 7 && item.AssingedToUserId !== 9);
      setAllTaskuser(mydata);
    } catch (err) {
      console.log(err.message);
    }
  };

  const loadleave = async () => {
    const web = new Web(props.props.siteUrl);
    try {
      const results: any = await web.lists.getById(props.props.SmalsusLeaveCalendar).items.select(
        "RecurrenceData,Duration,Author/Title,Editor/Title,NameId,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,Created,EventType,UID,fRecurrence,HalfDay,HalfDayTwo,Event_x002d_Type"
      ).expand("Author,Editor,Employee").getAll();
      setLeaveData(results);
      getTaskUser();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadleave();
  }, []);
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allReportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'SmalsusMonthlyLeaveReport.xlsx');
  };
  const downloadExcelCompleteMonth = () => {
    const worksheet = XLSX.utils.json_to_sheet(CurrentMonthData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'SmalsusMonthlyLeaveReportofMonth.xlsx');
  };
  const downloadPDF = () => {
    const element = document.getElementById('contentToConvert');

    html2pdf(element, {
      margin: 10,
      filename: 'SmalsusMonthlyLeaveReport.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    });
  };

  const calculateTotalHalfday = (matchedData: any, leaveType: string) => {
    const today = new Date();

    return matchedData.reduce((total: any, item: any) => {
      const endDate = new Date(item.EndDate);
      const eventDate = new Date(item.EventDate);
      const timezoneOffset = endDate.getTimezoneOffset();
      const timezoneOffsetInHours = timezoneOffset / 60;
      const adjustedEndDate = new Date(endDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000);
      const adjustedEventDate: any = new Date(eventDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000);
      
      if (
        adjustedEventDate.getFullYear() === today.getFullYear() &&
        (leaveType === "HalfDay" || leaveType === "HalfDayTwo")
      ) {
        const adjustedEndDateToToday = today < adjustedEndDate ? today : adjustedEndDate;
        adjustedEndDateToToday.setHours(0);
        let workingDays = 0;
        let currentDate = new Date(adjustedEventDate);
        currentDate.setHours(0);

        while (currentDate <= adjustedEndDateToToday) {
          const dayOfWeek = currentDate.getDay();

          if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isWeekend(currentDate, adjustedEndDateToToday)) {
            if (item?.Event_x002d_Type !== "Work From Home") {
              console.log(`Checking for ${leaveType} on ${currentDate}: HalfDay - ${item?.HalfDay}, HalfDayTwo - ${item?.HalfDayTwo}`);
              
              if ((leaveType === "HalfDay" || leaveType === "HalfDayTwo" )&&( item?.HalfDay === true || item?.HalfDayTwo === true)) {
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
      const adjustedEndDate = new Date(endDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000);
      const adjustedEventDate: any = new Date(eventDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000);

      if (adjustedEventDate.getFullYear() === today.getFullYear()) {
        const adjustedEndDateToToday = today < adjustedEndDate ? today : adjustedEndDate;
        adjustedEndDateToToday.setHours(0);
        let workingDays = 0;
        let currentDate = new Date(adjustedEventDate);
        currentDate.setHours(0);

        while (currentDate <= adjustedEndDateToToday) {
          const dayOfWeek = currentDate.getDay();

          if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isWeekend(currentDate, adjustedEndDateToToday)) {
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
      const adjustedEndDate = new Date(endDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000);
      const adjustedEventDate: any = new Date(eventDate.getTime() + timezoneOffsetInHours * 60 * 60 * 1000);

      if (adjustedEventDate.getFullYear() === today.getFullYear()) {
        const adjustedEndDateToToday = today < adjustedEndDate ? today : adjustedEndDate;
        adjustedEndDateToToday.setHours(0);
        let workingDays = 0;
        let currentDate = new Date(adjustedEventDate);
        currentDate.setHours(0);

        while (currentDate <= adjustedEndDateToToday) {
          const dayOfWeek = currentDate.getDay();

          if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isWeekend(currentDate, adjustedEndDateToToday)) {
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

  const isWeekend = (startDate: any, endDate: any) => {
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();

    return (startDay === 0 || startDay === 6) && (endDay === 0 || endDay === 6);
  };
  let year = new Date().getFullYear();
  let month = new Date(selectedDate).getMonth() + 1; // Actual month
  let formattedMonth = month < 10 ? `0${month}` : `${month}`;
  let CurrentMonthData = leaveData.filter((item: any) => {
    let itemDate = new Date(item?.EventDate);
    itemDate.setHours(0, 0, 0, 0);
    let startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(selectendDate);
    endDate.setHours(0, 0, 0, 0);

    return (
      itemDate >= startDate &&
      itemDate <= endDate
    );
  });


  AllTaskuser.forEach((users: any, Index: any) => {
    let user: any = {};
    const matchedData: any = CurrentMonthData.filter((member) => member.Employee?.Id === users.AssingedToUserId);
    user.Number = Index + 1;
    user.Title = users.Title;
    // let leaveType:any 
    // if(user.HalfDay){
    //   leaveType = "HalfDay"
    // }
    // else if(user.HalfDayTwo){
    //   leaveType = "HalfDayTwo"
    // }
    user.Plannedleave = calculatePlannedLeave(matchedData, "Planned Leave");
    user.unplannedleave = calculatePlannedLeave(matchedData, "Un-Planned");
    user.Halfdayleave = calculateTotalHalfday(matchedData, "HalfDay" || "HalfDayTwo");
    user.TotalLeave = calculateTotalWorkingDays(matchedData);

    allReportData.push(user)
  });

  const handleDateChange = (event: any) => {
    setSelectedDate(event.target.value);
  };
  const handleEndDateChange = (event: any) => {
    setselectendDate(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Handle the date submission or any other logic here
    console.log('Selected Date:', selectedDate, 'Selected End Date:', selectendDate);
    // Close the modal
    allReportData = []
    setopendate(false);
  };
  const handleclose = () => {
    setopendate(false)
    allReportData = []

    props.settrue(false)
  }
  useEffect(() => {
    if (props.trueval) {
      setopendate(true)
    }
  }, [])

  return (

    <div>
      <Modal show={opendate} onHide={() => handleclose()}>
        <Modal.Header closeButton>
          <Modal.Title>Select a Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formDate">
              <Form.Label>Date:</Form.Label>
              <Form.Control
                type="date"
                placeholder="Select Start date"
                value={selectedDate}
                onChange={handleDateChange}
              />
              <Form.Control
                type="date"
                placeholder="Select End date"
                value={selectendDate}
                onChange={handleEndDateChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {allReportData?.length > 0 &&
        <div id="contentToConvert">
          <h1>Monthly Report of Leave</h1>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Planned</th>
                <th>Unplanned</th>
                <th>Hlaf-Day</th>
                <th>TotalLeave</th>
              </tr>
            </thead>
            <tbody>
              {allReportData.map((entry: any, index: any) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.Title}</td>
                  <td>{entry.Plannedleave}</td>
                  <td>{entry.unplannedleave}</td>
                  <td>{entry.Halfdayleave}</td>
                  <td>{entry.TotalLeave}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      <button onClick={downloadExcel}>Download Excel</button>
      <button onClick={downloadExcelCompleteMonth}>Download Month Excel</button>

    </div>

  );
};