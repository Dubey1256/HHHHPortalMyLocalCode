import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";
import ReactApexChart from 'react-apexcharts';
import * as Moment from "moment";
let EndDate: any
let backup: any = []
let finaldata: any = []
let isWeekMonthDay = false;
let checkType = 'Day';
const GraphData = (data: any) => {
  const [count, setCount] = React.useState(0)
  const mydata = data.data.sort(datecomp);
  const calculateTotalTimeByDay = (data: any) => {

    const totalTimeByDay: { [key: string]: { [key: string]: number } } = {};
    const getDayName = (dateString: string): string => {
      const date = new Date(dateString);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    data.forEach((entry: any) => {
      const { NewTimeEntryDate, TaskTime, Site } = entry;
      const taskTimeNumber = parseFloat(TaskTime); // Parse TaskTime as a number

      const dayName = getDayName(NewTimeEntryDate);

      if (!totalTimeByDay[dayName]) {
        totalTimeByDay[dayName] = {};
        totalTimeByDay[dayName].total = 0;
      }


      if (!totalTimeByDay[dayName][Site]) {
        totalTimeByDay[dayName][Site] = 0;
      }


      totalTimeByDay[dayName][Site] += taskTimeNumber;

      totalTimeByDay[dayName].total += taskTimeNumber;
    });

    // Convert the accumulated data into chart data format
    const chartData = Object.keys(totalTimeByDay)?.map(day => {
      const { total, ...sites } = totalTimeByDay[day]; // Extract total time for the day
      const siteData = Object.keys(sites).map(site => ({
        Site: site,
        Time: sites[site]
      }));
      return { Day: day, Time: total, SiteData: siteData };
    });

    return chartData;
  };
  let totalTimeByDay = calculateTotalTimeByDay(mydata);
  console.log(totalTimeByDay)

  //--------------------------------------Add Weekend dates----------------------------------------------------------------------------

  function fillMissingDates(data: any) {
    const result = [];
    let lastdateLength = (data.length - 1);
    const startDate: any = new Date(Moment(data[0].Day).format("DD/MM/YYYY"));
    const dateParts = data[lastdateLength].Day?.split('/');
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0 indexed
    const day = parseInt(dateParts[0], 10);

    const endDate = new Date(year, month, day)

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toLocaleDateString('en-GB'); // Format the date as 'dd/mm/yyyy'
      const existingDate = data.find((item: any) => item.Day === formattedDate);
      if (!existingDate) {
        let riBeoushed: any = {}
        riBeoushed.Day = formattedDate;
        riBeoushed.SiteData = [];
        riBeoushed.Time = 0;
        result.push(riBeoushed);
      } else {
        result.push(existingDate);
      }
      if (currentDate.setHours(0, 0, 0, 0) === endDate.setHours(0, 0, 0, 0)) {
        return result;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }


  }
  const generateDateRange = (startDate: string, numDays: number) => {
    const dates = [];
    let [day, month, year] = startDate.split('/');
    let currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    for (let i = 0; i < numDays; i++) {
      dates.push(currentDate.toLocaleDateString('en-GB'));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };


  if (isWeekMonthDay == false) {


    const startDate = totalTimeByDay[0]?.Day;
    const numDays = totalTimeByDay?.length;
    let dummyData = new Date(totalTimeByDay[totalTimeByDay?.length - 1].Day)
    const dateRange = generateDateRange(startDate, numDays)
    const formattedDateRange = dateRange.map(date => {
      const [day, month, year] = date.split('/');
      return `${day}/${month}/${year}`;
    });

    formattedDateRange.forEach(date => {
      const found = totalTimeByDay?.some((item: any) => item.Day === date);
      if (!found) {
        totalTimeByDay.push({ Day: date, SiteData: [], Time: 0 });
      }
    });

    totalTimeByDay?.sort((a: any, b: any) => {
      const dateA: any = new Date(a.Day.split('/').reverse().join('-'));
      const dateB: any = new Date(b.Day.split('/').reverse().join('-'));
      return dateA - dateB;
    });
    let copytotalTimeByDay = JSON.parse(JSON.stringify(totalTimeByDay))
    const checkData = fillMissingDates(copytotalTimeByDay);
    if (checkData?.length > 0) {
      console.log(checkData)
      totalTimeByDay = checkData;
    }

    backup = totalTimeByDay.map(entry => ({ ...entry }));
    const formattedTotalTimeByDay = totalTimeByDay?.map(entry => {
      const [day, month] = entry.Day.split('/'); // Split the day and month components
      entry.Day = `${day}/${month}`; // Reassign the Day property in the desired format
      return entry;
    });
    console.log(data);
    finaldata = formattedTotalTimeByDay;
    finaldata.forEach((entry:any) => {
      let totalTime = 0;
      entry.SiteData.forEach((site:any) => {
        totalTime += site.Time;
      });
      entry.TotalTime = totalTime;
    });
  }
  //---------------------------------------End------------------------------------------------------------------------------------------

  const handleDataPointMouseEnter = (event: any, chartContext: any, config: any) => {
    const dayData = finaldata[config.dataPointIndex];
    const siteData = dayData.SiteData.map((site: any) => `${site.Site}: ${site.Time} hours`).join('<br>');
    chartContext.w.globals.tooltipTitle = siteData;
  };
  const chartData = {
    options: {
      chart: {
        id: 'basic-bar'
      },
      xaxis: {
        categories: finaldata.map((entry: any) => entry.Day),
        title: {
          text: `${checkType}` // Add 'Hours' as the Y-axis title
        }
      },
      yaxis: {
        title: {
          text: 'Hours'
        }
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          const dayData = finaldata[dataPointIndex];
          const siteData = dayData.SiteData.map((site: any) => ` ${site.Time} h - ${site.Site}`).join('<br>');
          return '<div class="custom-tooltip" style="border: 1px solid #aeabab;padding: 4px; width:200px">' +
            '<div>' + siteData + '</div>' +
            '<div>'+ dayData.Time +' h - '+ 'Total'  + '</div>' +
            '</div>';
        }
      },
      dataLabels: {
        enabled: false
      },
      events: {
        dataPointMouseEnter: handleDataPointMouseEnter
      }
    },
    series: [{
      name: 'Time',
      data: finaldata.map((entry: any) => ({
        x: entry.Day,
        y: entry.Time,
        SiteData: entry.SiteData
      }))
    }]
  };
  function datecomp(d1: any, d2: any) {
    if (d1.TaskDate != null && d2.TaskDate != null) {
      var a1 = d1.TaskDate.split("/");
      var a2 = d2.TaskDate.split("/");
      a1 = a1[2] + a1[1] + a1[0];
      a2 = a2[2] + a2[1] + a2[0];

      return a1 - a2;
    }
  }

  const setModalIsOpenToFalse = () => {
    finaldata = []
    isWeekMonthDay = false;
    checkType='Day'
    data?.Call();
  };

  const onRenderCustomFooterMain = () => {
    return (
      <footer className="modal-footer mt-2">
        <div className="text-end me-2">
          <div>
            <span>
              <button type="button" className="btn btn-default px-3" onClick={setModalIsOpenToFalse}>
                Cancel
              </button>
            </span>
          </div>
        </div>
      </footer>
    );
  };

  const onRenderCustomHeaderMain = () => {
    return (
      <div className="subheading">
        Project hours per day during - {data.DateType}
      </div>
    );
  };
  // const changeDateType=(Type:any)=>{
  //    console.log(Type)
  //    if(Type == 'Week'){
  //      const dateString = backup[0].Day;
  //     const [day,month,year] = dateString.split('/');
  //     const weekStartDate:any = new Date(year, day, month - 1);
  //     //let weekStartDate = new Date(dateObject);
  //    let weekData = calculateWeekData(weekStartDate, backup);
  //     console.log(weekData);
  //    }
  // }
  // const calculateWeekData = (weekStartDate:any, totalTimeByDay:any)=> {
  //   let weekEndDate = new Date(weekStartDate);
  //   weekEndDate.setDate(weekEndDate.getDate() + 6);

  //   let weekData:any = {
  //       WeekStartDate: weekStartDate.toLocaleDateString(),
  //       WeekEndDate: weekEndDate.toLocaleDateString(),
  //       TotalTime: 0,
  //       SiteData: []
  //   };

  //   totalTimeByDay.forEach((entry:any) => {
  //     const dateString = entry.Day;
  //     const [day,month,year] = dateString.split('/');
  //     const weekStartDate:any = new Date(year, day,month - 1);
  //       let entryDate = new Date(weekStartDate);
  //       if (entryDate >= weekStartDate && entryDate <= weekEndDate) {
  //           weekData.TotalTime += entry.Time;
  //           weekData.SiteData.push(...entry.SiteData);
  //       }
  //   });

  //   // Optionally, calculate total time for each site
  //   // Assuming SiteData is an array of objects with Time property
  //   let siteTimeMap = new Map();
  //   weekData.SiteData.forEach((site:any) => {
  //       let siteName = site.Site; // Assuming there's a 'Name' property for the site
  //       let siteTime = site.Time; // Assuming there's a 'Time' property for the site
  //       siteTimeMap.set(siteName, (siteTimeMap.get(siteName) || 0) + siteTime);
  //   });

  //   //weekData.SiteData = Array.from(siteTimeMap.entries()).map(([site, time]) => ({ Site: site, Time: time }));
  //   let siteDataArray:any = [];
  // siteTimeMap.forEach((value, key) => {
  //     siteDataArray.push({ Site: key, Time: value });
  // });

  // weekData.SiteData = siteDataArray;
  // weekData.Day = weekStartDate;

  //   return weekData;
  // }
  const changeDateType = (Type: any) => {
    console.log(Type);
    if (Type == 'Day') {
      isWeekMonthDay = false;
      checkType='Day'
      setCount(count + 1)
    }
    if (Type === 'Week') {
      checkType = 'Week'
      finaldata = []
      isWeekMonthDay = true;
      let weekDataArray: any[] = [];
      for (let i = 0; i < backup.length; i += 7) {
        const dateString = backup[i].Day;
        const [day, month, year] = dateString.split('/');
        const week: any = new Date(year, month - 1, day)
        const weekStartDate = new Date(week);
        let weekData = calculateWeekData(weekStartDate, backup.slice(i, i + 7));
        weekDataArray.push(weekData);
      }

      console.log(weekDataArray);
      const formattedTotal = weekDataArray?.map(entry => {
        const [day, month] = entry.Day.split('/'); // Split the day and month components
        entry.Day = `${day}/${month}`; // Reassign the Day property in the desired format
        return entry;
      });
      console.log(formattedTotal);
      finaldata = formattedTotal;
      finaldata.forEach((entry:any) => {
        let totalTime = 0;
        entry.SiteData.forEach((site:any) => {
          totalTime += site.Time;
        });
        entry.TotalTime = totalTime;
      });
      setCount(count + 1)
    }

    if (Type === 'Month') {
      checkType = 'Month'
      finaldata = [];
      isWeekMonthDay = true; // Assuming you need this for month as well
      let monthDataArray: any[] = [];

      // Group data by month
      const monthMap: any = new Map();
      backup.forEach((entry: any) => {
        const dateString = entry.Day;
        const [day, month, year] = dateString.split('/');
        const monthKey = `${year}-${month.padStart(2, '0')}`; // Ensure month is in two-digit format
        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, []);
        }
        monthMap.get(monthKey).push(entry);
      });

      // Calculate data for each month
      monthMap.forEach((monthEntries: any, monthKey: any) => {
        const [year, month] = monthKey.split('-');
        const monthStartDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthEndDate = new Date(parseInt(year), parseInt(month), 0); // Last day of the month

        let monthData = calculateMonthData(monthStartDate, monthEndDate, monthEntries);
        monthDataArray.push(monthData);
      });

      console.log("Month Data Array:", monthDataArray);

      console.log(monthDataArray);
      finaldata = monthDataArray;
      finaldata.forEach((entry:any) => {
        let totalTime = 0;
        entry.SiteData.forEach((site:any) => {
          totalTime += site.Time;
        });
        entry.TotalTime = totalTime;
      });
      setCount(count + 1);
    }
  };

  const calculateWeekData = (weekStartDate: any, weekDays: any[]) => {
    let weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    let weekData: any = {
      WeekStartDate: weekStartDate.toLocaleDateString('en-GB'), // Format "DD/MM/YYYY"
      WeekEndDate: weekEndDate.toLocaleDateString('en-GB'), // Format "DD/MM/YYYY"
      Time: 0,
      SiteData: [],
      Day: Moment(weekStartDate).format("DD/MM/YYYY")
    };

    weekDays.forEach((entry: any) => {
      weekData.Time += entry.Time;
      weekData.SiteData.push(...entry.SiteData);
    });

    // Optionally, calculate total time for each site
    let siteTimeMap = new Map();
    weekData.SiteData.forEach((site: any) => {
      let siteName = site.Site;
      let siteTime = site.Time;
      siteTimeMap.set(siteName, (siteTimeMap.get(siteName) || 0) + siteTime);
    });

    let siteDataArray: any = [];
    siteTimeMap.forEach((value, key) => {
      siteDataArray.push({ Site: key, Time: value });
    });

    weekData.SiteData = siteDataArray;

    return weekData;
  };

  const calculateMonthData = (monthStartDate: any, monthEndDate: any, monthEntries: any[]) => {
    let monthData: any = {
      MonthStartDate: monthStartDate.toLocaleDateString('en-GB', { month: 'long' }), // Format "Month YYYY"
      MonthEndDate: monthEndDate.toLocaleDateString('en-GB', { month: 'long' }), // Format "Month YYYY"
      Time: 0,
      SiteData: [],
      // Day: weekStartDate.toLocaleDateString('en-GB', { month: 'long', day: '2-digit' }) // This line is optional
    };
    monthData.Day = monthData.MonthStartDate;
    monthEntries.forEach((entry: any) => {
      monthData.Time += entry.Time;
      monthData.SiteData.push(...entry.SiteData);
    });

    // Optionally, calculate total time for each site
    let siteTimeMap = new Map();
    monthData.SiteData.forEach((site: any) => {
      let siteName = site.Site;
      let siteTime = site.Time;
      siteTimeMap.set(siteName, (siteTimeMap.get(siteName) || 0) + siteTime);
    });

    let siteDataArray: any = [];
    siteTimeMap.forEach((value, key) => {
      siteDataArray.push({ Site: key, Time: value });
    });

    monthData.SiteData = siteDataArray;

    return monthData;
  };
  return (
    <div>
      <Panel
        isOpen={data?.IsOpenTimeSheetPopup}
        type={PanelType.large}
        onDismiss={setModalIsOpenToFalse}
        onRenderHeader={onRenderCustomHeaderMain}
        isBlocking={false}
        onRenderFooter={onRenderCustomFooterMain}
      >
        <div id="bar-chart border">
          <div className='alignCenter fw-bold gap-5 justify-content-center'>
            <span className={`Day` === checkType ? 'siteBdrBottom' : ''} onClick={() => changeDateType('Day')}>Day</span>
            <span className={`Week` === checkType ? 'siteBdrBottom' : ''} onClick={() => changeDateType('Week')}>Week</span>
            <span className={`Month` === checkType ? 'siteBdrBottom' : ''} onClick={() => changeDateType('Month')}>Month</span>
          </div>
          <ReactApexChart options={chartData?.options} series={chartData?.series} type="bar" height={350} />

        </div>
      </Panel>
    </div>
  );
};

export default GraphData;