import React, { useState, useEffect } from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";
import ReactApexChart from 'react-apexcharts';
import * as Moment from "moment";
let formattedTotalTimeByDay: any;
const GraphData = (data: any) => {
  const [totalTimeByDaynew, setTotalTimeByDay] = useState([]);
  let totalTimeByDay :any =[];
  // const [formattedTotalTimeByDay, setFormattedTotalTimeByDay] = useState([]);

  useEffect(() => {
    if (data && data.data) {
      const mydata = data.data.sort(datecomp);
      totalTimeByDay = calculateTotalTimeByDay(mydata);
     // setTotalTimeByDay(calculatedData);
      manageSantosh();
    }
  }, [data]);

  const calculateTotalTimeByDay = (data: any) => {
    const totalTimeByDay: any = {};
    data.forEach((entry: any) => {
      const { NewTimeEntryDate, TaskTime, Site } = entry;
      const dayName = Moment(NewTimeEntryDate).format("DD/MM/YYYY");
      if (!totalTimeByDay[dayName]) {
        totalTimeByDay[dayName] = { total: 0 };
      }
      if (!totalTimeByDay[dayName][Site]) {
        totalTimeByDay[dayName][Site] = 0;
      }
      totalTimeByDay[dayName][Site] += parseFloat(TaskTime);
      totalTimeByDay[dayName].total += parseFloat(TaskTime);
    });

    const chartData = Object.keys(totalTimeByDay).map(day => {
      const { total, ...sites } = totalTimeByDay[day];
      const siteData = Object.keys(sites).map(site => ({
        Site: site,
        Time: sites[site]
      }));
      return { Day: day, Time: total, SiteData: siteData };
    });

    return chartData;
  };
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
  function fillMissingDates(data: any) {
    const result = [];

    // Extract the first and last dates from the array
    // Moment(data[0].Day).format("DD/MM/YYYY")
    let lastdateLength = (data.length - 1);


    const datePartsStart = data[0].Day?.split('/');
    const yearStart = parseInt(datePartsStart[2], 10);
    const monthStart = parseInt(datePartsStart[1], 10) - 1; // Months are 0 indexed
    const dayStart = parseInt(datePartsStart[0], 10);

    //const startDate: any = new Date(Moment(data[0].Day).format("DD/MM/YYYY"));
    const currentDate = new Date(yearStart, monthStart, dayStart);
    const dateParts = data[lastdateLength].Day?.split('/');
    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0 indexed
    const day = parseInt(dateParts[0], 10);

    const endDate = new Date(year, month, day)
    // const endDate:any = new Date(Moment().format("DD/MM/YYYY"));

    // Iterate over the dates from the start date to the end date
    //let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toLocaleDateString('en-GB'); // Format the date as 'dd/mm/yyyy'

      // Check if the current date exists in the data array
      const existingDate = data.find((item: any) => item.Day === formattedDate);

      // If the current date is missing, add it to the result array
      if (existingDate?.SiteData?.length > 0)
        result.push(existingDate);


      // If the current date is equal to the end date, break the loop
      if (currentDate.setHours(0, 0, 0, 0) === endDate.setHours(0, 0, 0, 0)) {
        return result;
      }
      // Move to the next date
      currentDate.setDate(currentDate.getDate() + 1);
    }


  }
  const manageSantosh = () => {
    const startDate = totalTimeByDay[0].Day;
    const numDays = totalTimeByDay.length;
    let dummyData = new Date(totalTimeByDay[totalTimeByDay.length - 1].Day)
    const dateRange = generateDateRange(startDate, numDays)
    const formattedDateRange = dateRange?.map((date: any) => {
      const [day, month, year] = date.split('/');
      return `${day}/${month}/${year}`;
    });

    formattedDateRange.forEach(date => {
      const found = totalTimeByDay?.some((item: any) => item.Day === date);
      if (!found) {
        totalTimeByDay.push({ Day: date, SiteData: [], Time: 0 });
      }
    });

    totalTimeByDay.sort((a: any, b: any) => {
      const dateA: any = new Date(a.Day.split('/').reverse().join('-'));
      const dateB: any = new Date(b.Day.split('/').reverse().join('-'));
      return dateA - dateB;
    });
    const checkData = fillMissingDates(totalTimeByDay);
    console.log(checkData)

    checkData?.forEach((obj: any) => {
      obj.SiteData = [];
      data?.data?.forEach((dat: any) => {
        const startDate: any = Moment(dat.TimeEntrykDateNew).format("DD/MM/YYYY");
        if (obj?.Day === startDate) {
          dat.Time = dat.TaskTime;
          obj.SiteData = dat.subRows;
        }
      })
    })
    totalTimeByDay = checkData;
   // setTotalTimeByDay(checkData);
    formattedTotalTimeByDay = totalTimeByDay?.map((entry: any) => {
      const [day, month] = entry.Day.split('/'); // Split the day and month components
      entry.Day = `${day}/${month}`; // Reassign the Day property in the desired format
      return entry;
    });
    setTotalTimeByDay(totalTimeByDay);
    console.log(data);
  }
  const datecomp = (d1: any, d2: any) => {
    if (d1.TaskDate != null && d2.TaskDate != null) {
      var a1 = d1.TaskDate.split("/");
      var a2 = d2.TaskDate.split("/");
      a1 = a1[2] + a1[1] + a1[0];
      a2 = a2[2] + a2[1] + a2[0];
      return a1 - a2;
    }
  }

  const setModalIsOpenToFalse = () => {
    data.Call();
  };

  const handleDataPointMouseEnter = (event: any, chartContext: any, config: any) => {
    const dayData = formattedTotalTimeByDay[config?.dataPointIndex];
    const siteData = dayData?.SiteData?.map((site: any) => `${site.Site}: ${site.Time} hours`).join('<br>');
    chartContext.w.globals.tooltipTitle = siteData;
  };

  const chartData = {
    options: {
      chart: {
        id: 'basic-bar'
      },
      xaxis: {
        categories: formattedTotalTimeByDay?.map((entry: any) => entry.Day)
      },
      tooltip: {
        custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
          const dayData = formattedTotalTimeByDay[dataPointIndex];
          const siteData = dayData?.SiteData?.map((site: any) => `${site.Time.toFixed(2)} h - ${site.Site}`).join('<br>');
          return '<div class="custom-tooltip" style="border: 1px solid #aeabab;padding: 4px; min-width:200px">' +
            '<div>' + siteData + '</div>' +
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
      data: formattedTotalTimeByDay?.map((entry: any) => ({
        x: entry.Day,
        y: entry.Time
      }))
    }]
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
        {data.DateType}
      </div>
    );
  };

  return (
    <div>
      {totalTimeByDaynew?.length > 0 &&
        <Panel
          isOpen={data?.IsOpenTimeSheetPopup}
          type={PanelType.large}
          onDismiss={setModalIsOpenToFalse}
          onRenderHeader={onRenderCustomHeaderMain}
          isBlocking={false}
          onRenderFooter={onRenderCustomFooterMain}
        >
          <div id="bar-chart border">
            <ReactApexChart options={chartData?.options} series={chartData?.series} type="bar" height={350} />
          </div>
        </Panel>
      }
    </div>
  );
};

export default GraphData;