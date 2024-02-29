import React, { useEffect, useState } from 'react';
import { Web } from 'sp-pnp-js';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import { Modal, Button, Form, Row } from 'react-bootstrap';
import { setMonth } from 'office-ui-fabric-react';

let allReportData: any = [];
let index: any = [];
export const MonthlyLeaveReport = (props: any) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectendDate, setselectendDate] = useState('');
  const [AllTaskuser, setAllTaskuser] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [opendate, setopendate] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [leaveset, setleaveset] = useState(false);
  const [disabled, setdisabled] = useState(false);
  const [disabl, setdisabl] = useState(false);
  useEffect(() => {
    if (selectedDate || selectendDate) {
      setdisabled(true)
    }
  }, [selectedDate, selectendDate])
  useEffect(() => {
    if (selectedMonth || selectedYear || selectedUserId) {
      setdisabl(true)
    }
  }, [selectedMonth, selectedYear, selectedUserId])

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
        currentDate.setHours(0, 0, 0, 0);
        while (currentDate <= adjustedEndDateToToday) {
          const dayOfWeek = currentDate.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isWeekend(currentDate, adjustedEndDateToToday)) {
            if (item?.Event_x002d_Type !== "Work From Home") {

              if ((leaveType === "HalfDay" || leaveType === "HalfDayTwo") && (item?.HalfDay === true || item?.HalfDayTwo === true)) {
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
        currentDate.setHours(0, 0, 0, 0);
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
        currentDate.setHours(0, 0, 0, 0);
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
  const isWeekend = (startDate: Date, endDate: Date) => {
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const isWeekend = (startDay === 0 || startDay === 6) || (endDay === 0 || endDay === 6);
    const targetMonth = startDate.getMonth();
    const targetYear = startDate.getFullYear();
    const isMatchingMonth = startMonth === targetMonth;
    const isMatchingYear = startYear === targetYear;
    return isWeekend && isMatchingMonth && isMatchingYear;
  };
  let Year = new Date().getFullYear();
  let month = new Date(selectedDate).getMonth() + 1; // Actual month
  let formattedMonth = month < 10 ? `0${month}` : `${month}`;
  let CurrentMonthData = leaveData.filter((item: any) => {
    let itemDate = new Date(item?.EventDate);
    itemDate.setHours(0, 0, 0, 0);
    let startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(selectendDate);
    endDate.setHours(0, 0, 0, 0);
    console.log('Item Date:', itemDate);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    return (
    itemDate >= startDate && itemDate <= endDate
    );
  });
  let selectedmonthdata = leaveData.filter((item: any) => {
    let itemDate = item?.EventDate
    let yearName = selectedYear
    let monthName = selectedMonth
    var isoDateString = itemDate;
    var dateObject = new Date(isoDateString);
    var year = '' + dateObject.getFullYear();

    var month = '' + (dateObject.getMonth() + 1);

    return (
      yearName == year && monthName == month
    );

  });
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years: number[] = [];

  for (let year = 2020; year <= currentYear; year++) {
    years.push(year);
  }
  console.log(years);
  const filteredData: any = selectedmonthdata.filter((member) => member.Employee?.Id === parseInt(selectedUserId, 10));
  //const filteredData = CurrentMonthData.filter((member) => member.Employee?.Id === selectedUserId);
  AllTaskuser.forEach((users: any, Index: any) => {
    let user: any = {};

    const matchedData: any = CurrentMonthData.filter((member) => member.Employee?.Id === users.AssingedToUserId);
    user.Number = Index + 1;
    user.Title = users.Title;
    user.Id = users.Id;
    user.Plannedleave = calculatePlannedLeave(matchedData, "Planned Leave");
    user.unplannedleave = calculatePlannedLeave(matchedData, "Un-Planned");
    user.Halfdayleave = calculateTotalHalfday(matchedData, "HalfDay" || "HalfDayTwo");
    user.TotalLeave = calculateTotalWorkingDays(matchedData);
    if (selectedDate && selectendDate) {
      allReportData.push(user)
    }
  });

  let filtereduser = AllTaskuser.filter((item: any) => {
    return item.AssingedToUserId == parseInt(selectedUserId, 10)
  })

  filtereduser.forEach((users: any, Index: any) => {
    let user: any = {};
    user.Number = Index + 1;
    user.Title = users.Title;
    user.Id = users.Id;
    user.Plannedleave = calculatePlannedLeave(filteredData, "Planned Leave");
    user.unplannedleave = calculatePlannedLeave(filteredData, "Un-Planned");
    user.Halfdayleave = calculateTotalHalfday(filteredData, "HalfDay" || "HalfDayTwo");
    user.TotalLeave = calculateTotalWorkingDays(filteredData);
    allReportData.push(user)
  });
  const handleDateChange = (event: any) => {
    setSelectedDate(event.target.value);
  };
  const handleEndDateChange = (event: any) => {
    setselectendDate(event.target.value);
  };
  const handleUserChange = (event: any) => {
    setSelectedUserId(event.target.value);
    allReportData = []
  };
  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value);
    allReportData = []
  };

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value);
    allReportData = []
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('Selected Date:', selectedDate, 'Selected End Date:', selectendDate);
    allReportData = []
    // setopendate(false);
    setleaveset(true)
  };
  const handleclose = () => {
    setopendate(false)
    setleaveset(false)
    allReportData = []
    props.callback();

    props.settrue(false)
  }

  useEffect(() => {
    if (props.trueval) {
      setopendate(true)
    }
  }, [])
  return (
    <div>
      <Modal className='rounded-0 monthlyLeaveReport' show={opendate} onHide={() => handleclose()} >
        <Modal.Header closeButton>
          <Modal.Title>Select a Date</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2">
          <Form onSubmit={handleSubmit}>

            <Row>
              <Form.Group className='col-sm-4' controlId="formMonth">
                <Form.Label className='fw-semibold'>Select a month:</Form.Label>
                <Form.Control disabled={disabled} as="select" onChange={handleMonthChange} value={selectedMonth}>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className='col-sm-4' controlId="formYear">
                <Form.Label className='fw-semibold'>Select a year:</Form.Label>
                <Form.Control disabled={disabled} as="select" onChange={handleYearChange} value={selectedYear}>
                  {years.map((year: any) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className='col-sm-4' controlId="formEmployee">
                <Form.Label className='fw-semibold'>Select an employee:</Form.Label>
                <Form.Control disabled={disabled} as="select" onChange={handleUserChange} value={selectedUserId}>
                  <option value={null}>Select an employee</option>
                  {AllTaskuser.map((user, index) => (
                    <option key={index} value={user.AssingedToUserId}>
                      {user.Title}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formDate" className='col-sm-6' >
                <Form.Label className='my-2 fw-semibold' > Start Date:</Form.Label>
                <Form.Control disabled={disabl}
                  type="date"
                  // placeholder="Select Start date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </Form.Group>
              <Form.Group className='col-sm-6'>
                <Form.Label className='my-2 fw-semibold'> End Date:</Form.Label>
                <Form.Control disabled={disabl}
                  type="date"
                  value={selectendDate}
                  onChange={handleEndDateChange}
                />
              </Form.Group>
            </Row>
            <div className="mt-2 text-end modal-footer">
              <Button onSubmit={handleSubmit} variant="primary" className="btn btn-primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
          {(allReportData?.length > 0 && leaveset) &&
            <div id="contentToConvert">
              <div className='alignCenter'>
                <h2 className="heading my-3">Monthly Report of Leave</h2>
                <div className='text-end ml-auto'>
                  <button className='btnCol btn btn-primary mx-1' onClick={downloadExcel}>Download Excel</button>
                  <button className='btnCol btn btn-primary' onClick={downloadExcelCompleteMonth}>Download Month Excel</button>
                </div>
              </div>
              <div className='maXh-500 scrollbar'>
                <table className="w-100">
                  <thead>
                    <tr>
                      <th className='py-2 border-bottom'>No.</th>
                      <th className='py-2 border-bottom'>Name</th>
                      <th className='py-2 border-bottom'>Planned</th>
                      <th className='py-2 border-bottom'>Unplanned</th>
                      <th className='py-2 border-bottom'>Half-Day</th>
                      <th className='py-2 border-bottom'>TotalLeave</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allReportData.map((entry: any, index: any) => (
                      <tr key={index}>
                        <td className='py-2'>{index + 1}</td>
                        <td className='py-2'>{entry.Title}</td>
                        <td className='py-2'>{entry.Plannedleave}</td>
                        <td className='py-2'>{entry.unplannedleave}</td>
                        <td className='py-2'>{entry.Halfdayleave}</td>
                        <td className='py-2'>{entry.TotalLeave}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          }

        </Modal.Body>
      </Modal>


    </div>
  );
};