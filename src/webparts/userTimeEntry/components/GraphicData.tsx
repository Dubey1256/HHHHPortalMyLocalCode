import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";
import ReactApexChart from 'react-apexcharts';

const GraphData = ( data: any ) => {
  const mydata =  data.data.sort(datecomp);
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
    const totalTimeByDay = calculateTotalTimeByDay(mydata);
    console.log(totalTimeByDay)

   //--------------------------------------Add Weekend dates----------------------------------------------------------------------------

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
 
  const startDate = totalTimeByDay[0].Day; 
  const numDays = totalTimeByDay.length;   
  
  const dateRange = generateDateRange(startDate, numDays)
  const formattedDateRange = dateRange.map(date => {
    const [day, month, year] = date.split('/'); 
    return `${day}/${month}/${year}`; 
  });

  formattedDateRange.forEach(date => {
    const found = totalTimeByDay?.some((item:any) => item.Day === date);
    if (!found) {
      totalTimeByDay.push({ Day: date, SiteData: [], Time: 0 }); 
    }
  });
  
  totalTimeByDay.sort((a:any, b:any) => {
    const dateA:any = new Date(a.Day.split('/').reverse().join('-'));
    const dateB:any = new Date(b.Day.split('/').reverse().join('-'));
    return dateA - dateB;
  });
  const formattedTotalTimeByDay = totalTimeByDay.map(entry => {
    const [day, month] = entry.Day.split('/'); // Split the day and month components
    entry.Day = `${day}/${month}`; // Reassign the Day property in the desired format
    return entry;
});
  console.log(data);

   //---------------------------------------End------------------------------------------------------------------------------------------

    const handleDataPointMouseEnter = (event:any, chartContext:any, config:any) => {
      const dayData = formattedTotalTimeByDay[config.dataPointIndex];
      const siteData = dayData.SiteData.map(site => `${site.Site}: ${site.Time} hours`).join('<br>');
      chartContext.w.globals.tooltipTitle = siteData;
  };
const chartData = {
  options: {
      chart: {
          id: 'basic-bar'
      },
      xaxis: {
          categories: formattedTotalTimeByDay.map((entry: any) => entry.Day)
      },
      tooltip: {
        custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
          const dayData = formattedTotalTimeByDay[dataPointIndex]; 
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
      data: formattedTotalTimeByDay.map((entry: any) => ({
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

    return  a1 - a2 ;
  }
}
 
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