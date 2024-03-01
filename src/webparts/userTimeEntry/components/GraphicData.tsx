import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";
import ReactApexChart from 'react-apexcharts';

const GraphData = ( data: any ) => {

    
    const calculateTotalTimeByDay = (data: any) => {
        const totalTimeByDay: { [key: string]: number } = {};
        const getDayName = (dateString: string): string => {
            const date = new Date(dateString);
            const day = ('0' + date.getDate()).slice(-2); 
            const month = ('0' + (date.getMonth() + 1)).slice(-2); 
            return `${day}/${month}`; 
          };

        data.forEach((entry:any) => {
          // Extract the TaskDate and parse TaskTime as a number
          const { NewTimeEntryDate, TaskTime } = entry;
          const taskTimeNumber = parseFloat(TaskTime); // Parse TaskTime as a number
      
          const dayName = getDayName(NewTimeEntryDate);
    
          if (totalTimeByDay[dayName]) {
            totalTimeByDay[dayName] += taskTimeNumber;
          } else {
            // If it doesn't exist, initialize the total time for that day
            totalTimeByDay[dayName] = taskTimeNumber;
          }
        });
      
        const sortedDates = Object.keys(totalTimeByDay).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'));
    const dateB = new Date(b.split('/').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });

  // Create chart data from sorted dates
  const chartData = sortedDates.map(date => ({
    Day: date,
    Time: totalTimeByDay[date]
  }));

  return chartData;
    };
      

    const totalTimeByDay = calculateTotalTimeByDay(data.data);
    console.log(totalTimeByDay)

      console.log(totalTimeByDay)
    const chartData = {
        options: {
          chart: {
            id: 'basic-bar'
          },
          xaxis: {
            categories: totalTimeByDay.map((entry:any) => entry.Day)
          },
          tooltip: {
            enabled: true, // Enable tooltip
          },
          dataPointMouseEnter: function (event: any, chartContext: any, config: any) {
            const siteName = data.data[config.seriesIndex].Site; // Get the site name from the series name
            const time = config.w.config.series[config.seriesIndex].data[config.dataPointIndex]; // Get the time for the data point
            const siteData = data.data[config.seriesIndex]; // Get the site data from the original data array
            const siteProperty = siteData.Site; // Access the Site property from the site data
            chartContext.w.globals.tooltipTitle = `${siteProperty}: ${time} hours`; // Set tooltip content
          }
        },
        
        series: [{
          name: 'Time',
          data: totalTimeByDay.map((entry:any) => entry.Time)
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
         
            <ReactApexChart options={chartData?.options} series={chartData?.series} type="bar" height={350} />
          
        </div>
      </Panel>
    </div>
  );
};

export default GraphData;