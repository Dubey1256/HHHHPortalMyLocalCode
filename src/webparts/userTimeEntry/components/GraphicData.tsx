import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";
import ReactApexChart from 'react-apexcharts';

const GraphData = ( data: any ) => {
      
  const calculateTotalTimeByDay = (data: any) => {
    const totalTimeByDay: { [key: string]: { [key: string]: number } } = {}; // Object to store total time by day and site
       const getDayName = (dateString: string): string => {
            const date = new Date(dateString);
            const day = ('0' + date.getDate()).slice(-2); 
            const month = ('0' + (date.getMonth() + 1)).slice(-2); 
            return `${day}/${month}`; 
          };
    data.forEach((entry: any) => {
        // Extract the TaskDate, TaskTime, and Site
        const { NewTimeEntryDate, TaskTime, Site } = entry;
        const taskTimeNumber = parseFloat(TaskTime); // Parse TaskTime as a number

        const dayName = getDayName(NewTimeEntryDate);

        // If the day entry doesn't exist, initialize it
        if (!totalTimeByDay[dayName]) {
            totalTimeByDay[dayName] = {};
            totalTimeByDay[dayName].total = 0; // Initialize total time for the day
        }

        // If the site entry for the day doesn't exist, initialize it
        if (!totalTimeByDay[dayName][Site]) {
            totalTimeByDay[dayName][Site] = 0;
        }

        // Add the task time to the total time for the site on that day
        totalTimeByDay[dayName][Site] += taskTimeNumber;

        // Add the task time to the total time for the day
        totalTimeByDay[dayName].total += taskTimeNumber;
    });

    // Convert the accumulated data into chart data format
    const chartData = Object.keys(totalTimeByDay).map(day => {
        const { total, ...sites } = totalTimeByDay[day]; // Extract total time for the day
        const siteData = Object.keys(sites).map(site => ({
            Site: site,
            Time: sites[site]
        }));
        return { Day: day, Time: total, SiteData: siteData };
    });

    return chartData;
};
    const totalTimeByDay = calculateTotalTimeByDay(data.data);
    console.log(totalTimeByDay)
    console.log(totalTimeByDay)

    const handleDataPointMouseEnter = (event:any, chartContext:any, config:any) => {
      const dayData = totalTimeByDay[config.dataPointIndex];
      const siteData = dayData.SiteData.map(site => `${site.Site}: ${site.Time} hours`).join('<br>');
      chartContext.w.globals.tooltipTitle = siteData;
  };
const chartData = {
  options: {
      chart: {
          id: 'basic-bar'
      },
      xaxis: {
          categories: totalTimeByDay.map((entry: any) => entry.Day)
      },
      tooltip: {
        custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
          const dayData = totalTimeByDay[dataPointIndex]; 
          const siteData = dayData.SiteData.map(site => ` ${site.Time} h - ${site.Site}`).join('<br>'); 
          return '<div class="custom-tooltip" style="border: 1px solid #aeabab;padding: 4px; width:200px">' +
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
      data: totalTimeByDay.map((entry: any) => ({
          x: entry.Day, // Assuming entry.Day is the x-value
          y: entry.Time, // Assuming entry.Time is the y-value
          SiteData: entry.SiteData // Assuming entry.SiteData is the array of site data
      }))
  }]
};

 
  const setModalIsOpenToFalse = () => {
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
       {data.DateType}
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
         
            <ReactApexChart options={chartData?.options} series={chartData?.series}  type="bar" height={350} />
          
        </div>
      </Panel>
    </div>
  );
};

export default GraphData;