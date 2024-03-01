import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react";
import ReactApexChart from 'react-apexcharts';

const GraphData = ( data: any ) => {

    
    const calculateTotalTimeByDay = (data: any) => {
        const totalTimeByDay: { [key: string]: number } = {};
        const getDayName = (dateString: string): string => {
            const date = new Date(dateString);
            return date.getDate().toString(); 
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
      
        return totalTimeByDay;
      };
      

    const totalTimeByDay = calculateTotalTimeByDay(data.data);
    console.log(totalTimeByDay)
   
    const transformedArray = Object.keys(totalTimeByDay).map(day => ({
        TaskDate: day,
        Time: totalTimeByDay[day]
      }));

      console.log(transformedArray)
    const chartData = {
        options: {
          chart: {
            id: 'basic-bar'
          },
          xaxis: {
            categories: transformedArray.map((entry:any) => entry.TaskDate)
          }
        },
        series: [{
          name: 'Time',
          data: transformedArray.map((entry:any) => entry.Time)
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
        This Week's TimeSheet
      </div>
    );
  };

  return (
    <div>
      <Panel
        isOpen={data?.IsOpenTimeSheetPopup}
        type={PanelType.custom}
        customWidth="800px"
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