import { colors } from '@material-ui/core';
import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import {myContextValue}from '../../../globalComponents/globalCommon'
import { Web } from 'sp-pnp-js';
import moment from 'moment';
interface ApexChartProps {
  // Define any props your component needs here
}
const barChartColors = ['#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB'];
const barChartColorsXYaxis = ['#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000'];

var timesheetListConfig:any;


const EmployeePieChart= () => {
  var  barChartData:any 
  var weekDate:any=[]
  const contextdata:any=React.useContext(myContextValue)
  const [allTaskTimeEntries,setAllTaskTimeEntries]=React.useState([])
  const[data,setData]=React.useState<any>([])
  const[sumBarTime,setSumBarTime]=React.useState<any>([])

  if(contextdata.timesheetListConfig!=undefined){
    timesheetListConfig=contextdata.timesheetListConfig
  }
  // const currentDate:any = new Date();
  // const dayOfWeek :any= currentDate.getDay();
  React.useEffect(()=>{
    GetDate()
   
 
  },[timesheetListConfig])
  const GetDate=()=>{
   
      const today :any= new Date(); 
      const startOfWeek :any= new Date(today); 
      startOfWeek.setDate(today.getDate() - today.getDay()); 
       const dateArray = []; 
        for (let i :any= new Date(startOfWeek); i <= today; i.setDate(i.getDate() + 1)) {
          dateArray.push(new Date(i)); } 
        const dateStrings = dateArray.map(date => 
          date.toLocaleDateString()); 
         console.log(dateStrings);
        //  setWeekDate(dateStrings)

        
        weekDate=weekDate.concat(dateStrings);
        
         loadAllTimeEntry();

   
  }
  const loadAllTimeEntry = async () => {
    var AllTaskTimeEntries:any=[];
   
    let  weeklyData=[0,0,0,0,0,0,0];
    if (timesheetListConfig?.length > 0) {
        let timesheetLists: any = [];
        let startDate = getStartingDate('This Week').toISOString();
      //  let  startDate= new Date(weekDate[0])
        let taskLists: any = [];
        timesheetLists = JSON.parse(timesheetListConfig[0]?.Configurations)
        taskLists = JSON.parse(timesheetListConfig[0]?.Description!=undefined?timesheetListConfig[0]?.Description:null)

        if (timesheetLists?.length > 0) {
       
            const fetchPromises = timesheetLists.map(async (list: any) => {
                let web = new Web(contextdata?.siteUrl);
                try {
                    const data = await web.lists
                        .getById(list?.listId)
                        .items.select(list?.query)
                        .filter(`(Modified ge '${startDate}') and (TimesheetTitle/Id ne null)`).top(5000)
                        .getAll();
    
                    data?.forEach((item: any) => {
                      item.AdditionalTimeEntryArray=JSON.parse(item?.AdditionalTimeEntry)
                        // item.taskDetails = checkTimeEntrySite(item, taskLists);
                        AllTaskTimeEntries.push(item);
                    });
                  
            
                    
                 
                } catch (error) {
                    console.log(error, 'HHHH Time');
                }
            });
    
            await Promise.all(fetchPromises)
            setAllTaskTimeEntries(AllTaskTimeEntries)

            weekDate?.map((date:any,index:any)=>{
              let totalTime=0;
             let  [month, day,year] = date.split('/')
             let weekdate:any=new Date(+year, +month - 1, +day)
              AllTaskTimeEntries?.map((timeEntry:any)=>{
              timeEntry?.AdditionalTimeEntryArray?.map((addTime:any)=>{
                let  [day, month, year] = addTime.TaskDate.split('/')
                  let  reorderedDate:any = new Date(+year, +month - 1, +day);
                  // let timeEnteryDate=moment(reorderedDate).format('YYYY/MM/DD')
                if((addTime?.AuthorId==contextdata?.currentUserData?.AssingedToUser?.Id)
                  &&(weekdate.getTime()==reorderedDate.getTime())
                ){
               let parseTime= parseFloat(addTime.TaskTime)
                      totalTime=totalTime+parseTime
                  weeklyData[index]=totalTime
                  }
                })
              })
              weeklyData[index]=totalTime
            })
          
            let sum = 0;
            weeklyData.forEach( num => {
                 sum += num;
             })
             setSumBarTime(sum)
               weeklyData.push(weeklyData.shift())
            setData(weeklyData)
            // setChartFunction(weeklyData)
        }

    }
}

// const checkTimeEntrySite = (timeEntry: any, sitesArray: any) => {
//   let result = ''
//   sitesArray?.map((site: any) => {
//       if (timeEntry[site.Tasklist]?.Id != undefined) {
//           result = contextdata?.AlltaskData?.filter((task: any) => {
//               if (task?.Id == timeEntry[site.Tasklist]?.Id && task?.siteType.toLowerCase() == site.siteType.toLowerCase()) {
//                   return task;
//               }
//           });
//           //  = getTaskDetails(timeEntry[site.Tasklist].Id, site.siteType)
//       }
//   })
//   return result;
// }
function getStartingDate(startDateOf: any) {
  const startingDate = new Date();
  let formattedDate = startingDate;
  if (startDateOf == 'This Week') {
      startingDate.setDate(startingDate.getDate() - startingDate.getDay());
      formattedDate = startingDate;
  } 

  return formattedDate;
}
// const setChartFunction=(weeklyData:any)=>{
  barChartData = {
    series: [{
      data: data,
    }],
    options: {
      chart: {

        height: 350,
        type: 'bar',
        events: {
          click: function (chart: any, w: any, e: any) {
            // console.log(chart, w, e)
          },
        },
      },
      colors: barChartColors,
      plotOptions: {
        bar: {
          columnWidth: '25%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          ['Mon'],
          ['Tue'],
          ['Wed'],
          
          ['Thu'],
          ['Fri'],
          ['Sat'],
          ['Sun'],
        ],
        labels: {
          style: {
            colors: barChartColorsXYaxis,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
       
        labels: {
          show: true, // Set this to true to display Y-axis labels
          formatter: function (value: any) {
            // Increase the Y-axis labels by 2
            return (value).toString();
          },
          style: {
            colors: barChartColorsXYaxis,
            fontSize: '12px',
          },
        },
      },
    },
  };
// }


  return (
    <div className='border p-2'>
      <div id="bar-chart border">
        {console.log(contextdata)}
        <div className='alignCenter'>
          <div>
          <span>This Week's TimeSheet ({sumBarTime})</span>
          </div>
          <div className='ml-auto'>
          <span className="svg__iconbox svg__icon--refresh dark me-2" onClick={()=>GetDate()}></span>
            {/* <span className="svg__iconbox svg__icon--share dark"></span> */}
          </div>
         
        </div>
      <ReactApexChart options={barChartData?.options} series={barChartData?.series} type="bar" height={350} />
    
      </div>
      
    </div>
  );
};



export default EmployeePieChart;
