import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";
import ReactApexChart from 'react-apexcharts';
import * as Moment from "moment";
import Tooltips from '../../../globalComponents/Tooltip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
let EndDate: any
let backup: any = []
let finaldata: any = []
let isWeekMonthDay = false;
let checkType = 'Day';
const GraphData = (data: any) => {
  let processedData: any = []
  let transformedData: any = [];
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
    const chartDatas = Object.keys(totalTimeByDay)?.map(day => {
      const { total, ...sites } = totalTimeByDay[day]; // Extract total time for the day
      const siteData = Object.keys(sites).map(site => ({
        Site: site,
        Time: sites[site]
      }));
      return { Day: day, Time: total, SiteData: siteData };
    });

    return chartDatas;
  };
  let totalTimeByDay: any = calculateTotalTimeByDay(mydata);

  totalTimeByDay.map((entry: any) => {
    entry.color = entry.Time === 0 ? '#FF0000' : '#4987f1'; // Red for zero time, green for others

  });
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
  const addWeekendProperty = (data: any) => {
    return data.map((item: any) => {
      let [day, month, year] = item.Day.split('/');
      let date = new Date(year, month - 1, day);
      let isWeekend = (date.getDay() === 6 || date.getDay() === 0); // 6 for Saturday, 0 for Sunday
      return { ...item, isWeekend };
    });
  };
  const generateDateRange = (startDate: string, endDate: string) => {
    const dates = [];
    let [startDay, startMonth, startYear] = startDate.split('/');
    let [endDay, endMonth, endYear] = endDate.split('/');

    let currentDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
    let endDateObj = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));

    while (currentDate <= endDateObj) {
      dates.push(currentDate.toLocaleDateString('en-GB'));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };


  if (isWeekMonthDay == false) {

    let dummyData = ''
    const startDate = totalTimeByDay[0]?.Day;
    const numDays = totalTimeByDay?.length - 1;
    if (totalTimeByDay[numDays]?.Day == 'aN/aN/NaN') {
      dummyData = totalTimeByDay[numDays - 1]?.Day
    }
    else {
      dummyData = totalTimeByDay[numDays]?.Day
    }

    const dateRange = generateDateRange(startDate, dummyData)
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

    const isValidDate = (dateStr: any) => {
      const [day, month, year] = dateStr.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      return !isNaN(date.getTime());
    };

    const filteredData = totalTimeByDay.filter((item: any) => isValidDate(item.Day));
    const updatedData = addWeekendProperty(filteredData);

    let copytotalTimeByDay = JSON.parse(JSON.stringify(updatedData))
    const checkData = fillMissingDates(copytotalTimeByDay);
    if (checkData?.length > 0) {
      console.log(checkData)
      totalTimeByDay = checkData;
    }


    updatedData?.sort((a: any, b: any) => {
      const dateA: any = new Date(a.Day.split('/').reverse().join('-'));
      const dateB: any = new Date(b.Day.split('/').reverse().join('-'));
      return dateA - dateB;
    });
    backup = updatedData.map((entry: any) => ({ ...entry }));
    const formattedTotalTimeByDay = updatedData?.map((entry: any) => {
      const [day, month] = entry.Day.split('/'); // Split the day and month components
      entry.Day = `${day}/${month}`; // Reassign the Day property in the desired format
      return entry;
    });
    console.log(data);
    finaldata = formattedTotalTimeByDay;

    finaldata.forEach((entry: any) => {
      let totalTime = 0;
      entry.SiteData.forEach((site: any) => {
        totalTime += site.Time;
      });
      entry.TotalTime = totalTime;
    });
    finaldata.map((entry: any) => {
      // entry.color = entry.Time === 0 ? '#FF0000' : '#4987f1'; // Red for zero time, green for others
      entry.SiteData = entry.SiteData.map((siteEntry: any) => ({
        ...siteEntry,
        color: (siteEntry.Site === 'HHHH') ? '#0d6efd' :
          (siteEntry.Site === 'Gruene') ? '#2e7d32' :
            (siteEntry.Site === 'Offshore Tasks') ? '#00FF00' :
              '#FFFF00' // Default color for other sites
      }));

    });

  }

  // Create series data
  let siteTimeData: any = {};

  // Iterate through the data array

  finaldata = finaldata.map((entry: any) => ({
    ...entry,
    finaldata: entry.Time !== 0
  }));
  finaldata?.forEach((entry: any) => {
    let dayData = entry.SiteData;
    dayData.forEach((siteEntry: any) => {
      let siteName = siteEntry.Site;
      let timeValue = siteEntry.Time || 0; // If Time is not present, default to 0

      if (siteTimeData[siteName]) {
        siteTimeData[siteName].push(timeValue);
      } else {
        siteTimeData[siteName] = [timeValue];
      }
    });
  });

  let siteNames: any = Object.keys(siteTimeData);
  let maxLength = Math.max(...siteNames.map((name: any) => siteTimeData[name].length));

  siteNames.forEach((name: any) => {
    let currentLength = siteTimeData[name].length;
    if (currentLength < maxLength) {
      let fillArray = [];
      for (let i = 0; i < maxLength - currentLength; i++) {
        fillArray.push(0);
      }
      siteTimeData[name] = siteTimeData[name].concat(fillArray);
    }
  });

  let formattedData: { name: string, data: number[], color: string }[] = Object.keys(siteTimeData).map(name => {
    let color = finaldata.find((entry: any) => entry.SiteData.some((site: any) => site.Site === name))?.SiteData.find((site: any) => site.Site === name)?.color || '#000000';
    let data = siteTimeData[name];

    // Ensure all data arrays are of equal length
    let maxLength = 0;
    for (let key in siteTimeData) {
      if (siteTimeData.hasOwnProperty(key)) {
        maxLength = Math.max(maxLength, siteTimeData[key].length);
      }
    }

    if (data.length < maxLength) {
      let fillArray = [];
      for (let i = 0; i < maxLength - data.length; i++) {
        fillArray.push(0);
      }
      data = data.concat(fillArray);
    }

    return { name: name, data: data, color: color };
  });
  formattedData = formattedData.filter(site => {
    return finaldata.some((entry: any) => {
      let dayData = entry.SiteData.find((siteEntry: any) => siteEntry.Site === site.name);
      return dayData && dayData.Time !== 0;
    });
  }).map(site => {
    return {
      name: site.name,
      data: finaldata.map((entry: any) => {
        let dayData = entry.SiteData.find((siteEntry: any) => siteEntry.Site === site.name);
        return dayData ? dayData.Time : 0;
      }),
      color: site.color
    };
  });

  // Log formattedData to console
  console.log(formattedData);

  const handleDataPointMouseEnter = (event: any, chartContext: any, config: any) => {
    const dayData = finaldata[config.dataPointIndex];
    const siteData = dayData.SiteData.map((site: any) => `${site.Site}: ${site.Time} hours`).join('<br>');
    chartContext.w.globals.tooltipTitle = siteData;
  };

  let filteredData = formattedData.map(site => ({
    name: site.name,
    data: site.data.filter((time: any) => time !== 0)
  }));


  finaldata?.forEach((entry: any) => {
    // Initialize an object to hold transformed data for each day
    let transformedEntry = {
      Day: entry.Day,
      Time: entry.Time,
      HHHH: 0,
      Gruene: 0,
      Education: 0,
      Migration: 0,
      EI: 0,
      EPS: 0,
      OffShoreTasks: 0,
      isWeekend: entry.isWeekend

    };

    // Loop through SiteData of the current entry
    entry.SiteData.forEach((site: any) => {
      if (site.Site === 'HHHH') {
        transformedEntry.HHHH = site.Time;
      } else if (site.Site === 'Gruene') {
        transformedEntry.Gruene = site.Time;
      }
      else if (site.Site === 'Education') {
        transformedEntry.Education = site.Time;
      }
      else if (site.Site === 'EI') {
        transformedEntry.EI = site.Time;
      }
      else if (site.Site === 'EPS') {
        transformedEntry.EPS = site.Time;
      }
      else if (site.Site === 'Migration') {
        transformedEntry.Migration = site.Time;
      }
      else {
        transformedEntry.OffShoreTasks = site.Time;
      }
    });

    // Push transformed entry to the transformedData array
    transformedData.push(transformedEntry);
  });
  // const chartData = {
  //   options: {
  //     chart: {
  //       id: 'stacked-bar',
  //       stacked: true
  //     },
  //     xaxis: {
  //       categories: finaldata.map((entry: any) => entry.Day),
  //       title: {
  //         text: `${checkType} Hours` // Add 'Hours' as the Y-axis title
  //       },
  //     },
  //     yaxis: {
  //       title: {
  //         text: 'Hours'
  //       }
  //     },
  //     tooltip: {
  //       custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
  //         const dayData = finaldata[dataPointIndex];
  //         const siteData = dayData.SiteData.map((site: any) => ` ${site.Time} h - ${site.Site}`).join('<br>');
  //         return '<div class="custom-tooltip" style="border: 1px solid #aeabab;padding: 4px; width:200px">' +
  //           '<div>' + siteData + '</div>' +
  //           '<div>' + dayData.Time + ' h - ' + 'Total' + '</div>' +
  //           '</div>';
  //       }
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
  //     events: {
  //       dataPointMouseEnter: handleDataPointMouseEnter
  //     },
  //     plotOptions: {
  //       bar: {
  //         distributed: true // Enable distributed mode to use individual colors for each bar
  //       }
  //     },
  //     colors: finaldata.flatMap((entry: any) =>
  //       entry.SiteData.map((siteEntry: any) => siteEntry.color)
  //     )
  //   },
  //    series : finaldata.map((entry:any) => ({
  //     name: entry.Day, // Day as series name
  //     data: entry.SiteData.map((site:any) => site.Time) // Time as data points for each site
  //   }))
  // };

  console.log(transformedData);


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
    checkType = 'Day'
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
      <>
      <div className="subheading">
        Project hours per day during - {data.DateType}
      </div>
       <div><Tooltips ComponentId="1716" /></div>
       </>
      
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
      checkType = 'Day'
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
        // Extract day and month from WeekStartDate and WeekEndDate
        const startDay = entry.WeekStartDate.split('/')[0];
        const startMonth = entry.WeekStartDate.split('/')[1];
        const endDay = entry.WeekEndDate.split('/')[0];
        const endMonth = entry.WeekEndDate.split('/')[1];

        // Format the Day property as "WeekStartDate-WeekEndDate"
        entry.Day = `${startDay}/${startMonth}-${endDay}/${endMonth}`;

        return entry;
      });
      console.log(formattedTotal);
      finaldata = formattedTotal;
      var siteTimeMap: { [key: string]: number } = {};
      finaldata.forEach((entry: any) => {
        siteTimeMap={}
        let totalTime = 0;
        entry.SiteData.forEach((site: any) => {
          if (siteTimeMap[site.Site]) {
            // If the site is already in the map, add the time
            siteTimeMap[site.Site] += site.Time;
          } else {
            // If the site is not in the map, add it with the current time
            siteTimeMap[site.Site] = site.Time;
          }
        });
      
        // Convert the map back to an array format for SiteData
        entry.SiteData = Object.keys(siteTimeMap).map(site => ({
          Site: site,
          Time: siteTimeMap[site]
    }));
        entry.TotalTime = totalTime;
      });
      console.log(finaldata)
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
      finaldata.forEach((entry: any) => {
        let totalTime = 0;
        entry.SiteData.forEach((site: any) => {
          totalTime += site.Time;
        });
        entry.TotalTime = totalTime;
      });
      setCount(count + 1);
    }
  };

  // const calculateWeekData = (weekStartDate: any, weekDays: any[]) => {
  //   let weekEndDate = new Date(weekStartDate);
  //   weekEndDate.setDate(weekEndDate.getDate() + 6);

  //   let weekData: any = {
  //     WeekStartDate: weekStartDate.toLocaleDateString('en-GB'), // Format "DD/MM/YYYY"
  //     WeekEndDate: weekEndDate.toLocaleDateString('en-GB'), // Format "DD/MM/YYYY"
  //     Time: 0, 
  //     SiteData: [],
  //     Day: Moment(weekStartDate).format("DD/MM/YYYY")
  //   };

  //   weekDays.forEach((entry: any) => {
  //     weekData.Time += entry.Time;
  //     weekData.SiteData.push(...entry.SiteData);
  //   });

  //   // Optionally, calculate total time for each site
  //   let siteTimeMap = new Map();
  //   weekData.SiteData.forEach((site: any) => {
  //     let siteName = site.Site;
  //     let siteTime = site.Time;
  //     siteTimeMap.set(siteName, (siteTimeMap.get(siteName) || 0) + siteTime);
  //   });

  //   let siteDataArray: any = [];
  //   siteTimeMap.forEach((value, key) => {
  //     siteDataArray.push({ Site: key, Time: value });
  //   });

  //   weekData.SiteData = siteDataArray;

  //   return weekData;
  // };

  const calculateWeekData = (weekStartDate: any, weekDays: Date[]) => {
    // Calculate end date of the week
    let weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    // Format start and end dates as "DD/MM/YYYY"
    let formattedStartDate = Moment(weekStartDate).format('DD/MM/YYYY');
    let formattedEndDate = Moment(weekEndDate).format('DD/MM/YYYY');

    // Prepare initial weekData object
    let weekData: any = {
      WeekStartDate: formattedStartDate,
      WeekEndDate: formattedEndDate,
      Time: 0,
      SiteData: [],
      Days: []
    };

    // Populate days array with formatted dates
    for (let date of weekDays) {
      weekData.Days.push(Moment(date).format('DD/MM/YYYY'));
    }

    // Calculate total time and merge site data
    weekDays.forEach((entry: any) => {
      weekData.Time += entry.Time;
      weekData.SiteData.push(...entry.SiteData);
    });

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
  const CustomTick = ({ x, y, payload }: any) => {
    const item = transformedData?.find((item: any) => item.Day === payload.value);
    const fill = item && item?.isWeekend == true ? 'red' : 'black';
  
    return (
      <text x={x} y={y + 10} textAnchor="middle" fill={fill}>
        {payload.value}
      </text>
    );
  };
  
  // const CustomTooltip = ({ active, payload, label }: any) => {
  //   if (active && payload && payload.length) {
  //     const data = payload[0].payload;
  //     const keysToDisplay = ['HHHH', 'Education', 'PSE', 'E+E', 'Migration', 'Gruene', 'OffShoreTasks'];
  //     const colorMap: any = {
  //       HHHH: '#2f5596',
  //       Education: '#990077',
  //       PSE: '#dc0018',
  //       'E+E': '#243a4a',
  //       Migration: '#1199bb',
  //       Gruene: '#008839',
  //       OffShoreTasks: '#c1722e'
  //     };
  
  //     const filteredData = keysToDisplay
  //       .filter(key => data[key] !== undefined && data[key] > 0)
  //       .map(key => ({ key, value: data[key], color: colorMap[key] }));
  
  //     if (filteredData.length === 0) {
  //       return null; // No data to display
  //     }
  
  //     return (
  //       <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
  //         <p className="label">{`${checkType}: ${label}`}</p>
  //         {filteredData.map((entry, index) => (
  //           <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
  //             <div
  //               style={{
  //                 width: '10px',
  //                 height: '10px',
  //                 borderRadius: '50%',
  //                 backgroundColor: entry.color,
  //                 marginRight: '10px',
  //               }}
  //             ></div>
  //             <p style={{ margin: 0 }}>{`${entry.key}: ${entry.value}`}</p>
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   }
  
  //   return null;
  // };
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const keysToDisplay = ['HHHH', 'Education', 'PSE', 'E+E', 'Migration', 'Gruene', 'OffShoreTasks'];
      const colorMap: any = {
        HHHH: '#2f5596',
        Education: '#990077',
        PSE: '#dc0018',
        'E+E': '#243a4a',
        Migration: '#1199bb',
        Gruene: '#008839',
        OffShoreTasks: '#c1722e'
      };
  
      const filteredData = keysToDisplay
        .filter(key => data[key] !== undefined && data[key] > 0)
        .map(key => ({ key, value: data[key], color: colorMap[key] }));
  
      // Calculate Total Time
      const totalTime = filteredData.reduce((total, item) => total + item.value, 0);
  
      if (filteredData.length === 0 && totalTime === 0) {
        return null; // No data to display
      }
  
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
          <p className="label">{`${checkType}: ${label}`}</p>
          {filteredData.map((entry, index) => (
            <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                  marginRight: '10px',
                }}
              ></div>
              <p style={{ margin: 0 }}>{`${entry.key}: ${entry.value}`}</p>
            </div>
          ))}
          {totalTime > 0 && (
            <div style={{ borderTop: '1px solid #ccc', marginTop: '10px', paddingTop: '5px' }}>
              <strong>Total hours: {totalTime}</strong>
            </div>
          )}
        </div>
      );
    }
  
    return null;
  };
  
  const CustomLegend = () => {
    return (
      <div style={{ textAlign: "center", marginTop: 10, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
          <div style={{ width: 20, height: 20, marginRight: 5, backgroundColor: "#2f5596" }} />
          <span>HHHH</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
          <div style={{ width: 20, height: 20, marginRight: 5, backgroundColor: "#dc0018" }} />
          <span>PSE</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
          <div style={{ width: 20, height: 20, marginRight: 5, backgroundColor: "#243a4a" }} />
          <span>E+E</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
          <div style={{ width: 20, height: 20, marginRight: 5, backgroundColor: "#1199bb" }} />
          <span>Migration</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
          <div style={{ width: 20, height: 20, marginRight: 5, backgroundColor: "#990077" }} />
          <span>Education</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
          <div style={{ width: 20, height: 20, marginRight: 5, backgroundColor: "#008839" }} />
          <span>Gruene</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginRight: 20 }}>
          <div style={{ width: 20, height: 20, marginRight: 5, backgroundColor: "#c1722e" }} />
          <span>OffShoreTasks</span>
        </div>
      </div>
    );
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
            <span className={`Week` === checkType ? 'siteBdrBottom' : ''} onClick={() => changeDateType('Week')} style={{marginLeft:'16px',marginRight:'16px'}}>Week</span>
            <span className={`Month` === checkType ? 'siteBdrBottom' : ''} onClick={() => changeDateType('Month')}>Month</span>
          </div>
  
          <div style={{ width: "100%", overflowX: 'auto' }}>
            <div style={{ width: (checkType !== 'Month' && checkType !== 'Week' && transformedData.length > 20) ? transformedData.length * 60 : '100%' }}>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={transformedData}
                  barGap={16}
                >
                  <CartesianGrid strokeDasharray="2 2" />
                  <XAxis
                    dataKey="Day"
                    tick={<CustomTick />}
                  />
                  <YAxis label={{ 
        value: 'Hours', 
        angle: -90, 
        position: 'insideLeft' ,
        style: {
          fontWeight: 'bold', // Make the label bold
          fontSize: 14, // Optional: Adjust font size if needed
        }
      }}/>
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="HHHH" stackId="a" fill="#2f5596" />
                  <Bar dataKey="PSE" stackId="a" fill="#dc0018" />
                  <Bar dataKey="E+E" stackId="a" fill="#243a4a" />
                  <Bar dataKey="Migration" stackId="a" fill="#1199bb" />
                  <Bar dataKey="Education" stackId="a" fill="#990077" />
                  <Bar dataKey="Gruene" stackId="a" fill="#008839" />
                  <Bar dataKey="OffShoreTasks" stackId="a" fill="#c1722e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <CustomLegend />
        </div>
      </Panel>
    </div>
  );
};

export default GraphData;

