import * as React from 'react'
import { sp, Web } from "sp-pnp-js";
import * as $ from 'jquery';
import { mycontext } from './TeamDashboard'
import { SPHttpClient, SPHttpClientConfiguration, ISPHttpClientConfiguration, ODataVersion } from '@microsoft/sp-http';
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import {
    ColumnDef,
} from "@tanstack/react-table";
import { RequestDigest } from '@pnp/sp';
import { type, post } from 'jquery';
import * as moment from 'moment';
import { Modal, Panel, PanelType } from "office-ui-fabric-react";
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const batch = sp.web.createBatch();
var AllTaskTimeEntries: any = []
var Mon: any = []
var AllUsers: any = []
let startWeekDate: any = ''
let endWeekDate: any = ''
var CurrentUserId = ''
var CurrentUserTitle = ''
let taskUsers:any = [];
const TimeSummary = (props: any) => {
  let MyContext: any = React.useContext(mycontext)

  CurrentUserId = MyContext?.context?.pageContext._legacyPageContext?.userId
  CurrentUserTitle = MyContext?.context?.pageContext._legacyPageContext?.userDisplayName
  var formattedDate: any = ''
  const startingDate = new Date();
  const lastMonth = new Date(startingDate.getFullYear(), startingDate.getMonth() - 1);
  const startingDateOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
  formattedDate = startingDateOfLastMonth;
  var AllTasks: any = []
  const [openeditpopup, setOpeneditpopup] = React.useState(false)
  const [childData, setChildData] = React.useState([])
  const [data, setData] = React.useState([])
  const [weeklyTimeReport, setWeeklyTimeReport] = React.useState([])
  const [currentDate, setCurrentDate] = React.useState('');
  const [endWeekDate, setendWeekDate] = React.useState('');

  let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/sp');
  const list = ["HHHH", "Migration", "Shareweb", "EI", "EPS", "Education"]
  React.useEffect(() => {
    GetTaskUsers();
    startWeekDate = getCurrentWeekDates()
    setCurrentDate(startWeekDate.startDate.toDateString())
    setendWeekDate(startWeekDate.endDate.toDateString())
  }, [MyContext])


  function getCurrentWeekDates() {
    const today:any = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay); // Move to the start of the week

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - currentDay)); // Move to the end of the week

    return {
      startDate,
      endDate
    };
  }
  const GetTaskUsers = async () => {
    var a = new Date()
    let web = new Web(`https://hhhhteams.sharepoint.com/sites/HHHH/sp`);
   
    taskUsers = await web.lists
      .getByTitle('Task Users')
      .items
      .top(4999)
      .get();
    taskUsers;

    // taskUsers?.forEach((items: any) => {
    //     if (items?.TeamLeaderId == CurrentUserId) {
    //       AllUsers.push(items)
    //     }
       
    //   })
    loadAllTime(a);
   
    var selectedMember:any=MyContext?.currentUserId
    AllUsers=[]
    if(selectedMember?.childs?.length>0){
      AllUsers=AllUsers.concat(selectedMember?.childs)
    }else{
      AllUsers=AllUsers.concat(selectedMember);
    }

  }
  const loadAllTime = async (start: any) => {

    // if(AllUsers == undefined && AllUsers.length == 0){

    //   taskUsers?.forEach((items: any) => {
  
    //     if (items?.AssingedToUserId == CurrentUserId) {
  
    //       AllUsers.push(items)
  
    //     }

  
    //   })
  
   
  
    // }

    //var selectDate = getStartingDate(start).toISOString();
    var selectDate = getStartingDate(start);
    var final = selectDate.start.toISOString()

    await web.lists
      .getByTitle('TaskTimeSheetListNew')
      .items.select("Id,Title,TaskDate,TaskTime,TimesheetTitle/Id,AdditionalTimeEntry,Modified,Description,TaskOffshoreTasks/Id,TaskOffshoreTasks/Title,TaskKathaBeck/Id,TaskKathaBeck/Title,TaskDE/Title,TaskDE/Id,TaskEI/Title,TaskEI/Id,TaskEPS/Title,TaskEPS/Id,TaskEducation/Title,TaskEducation/Id,TaskHHHH/Title,TaskHHHH/Id,TaskQA/Title,TaskQA/Id,TaskGender/Title,TaskGender/Id,TaskShareweb/Title,TaskShareweb/Id,TaskGruene/Title,TaskGruene/Id")
      .expand("TimesheetTitle,TaskKathaBeck,TaskDE,TaskEI,TaskEPS,TaskEducation,TaskGender,TaskQA,TaskDE,TaskShareweb,TaskHHHH,TaskGruene,TaskOffshoreTasks")
      .filter(`Modified ge '${final}'`)
      .getAll().then((data: any) => {
        console.log(data)
        data?.forEach((val: any) => {
          if (val.AdditionalTimeEntry != undefined) {
            AllTaskTimeEntries.push(val)
          }
        })
        currentUserTimeEntry(start)

      });

  }

  const currentUserTimeEntry = (startingDateweek: any) => {
    let totalTime = 0;
    let startDate = getStartingDate(startingDateweek);
    //let endDate =  getStartingDate(startingDateweek);
    let endDate = startDate.endd
    startDate = new Date(startDate.start.setHours(0, 0, 0, 0));
    endDate = new Date(endDate.setHours(0, 0, 0, 0));
    let weekTimeEntries: any = [];
    AllTaskTimeEntries?.map((task: any) => {

      if (task?.AdditionalTimeEntry != undefined) {
        let AdditionalTime = JSON.parse(task?.AdditionalTimeEntry)
        AdditionalTime?.map((filledTime: any) => {
          let [day, month, year] = filledTime?.TaskDate?.split('/')
          const timeFillDate = new Date(+year, +month - 1, +day)


          if (timeFillDate >= startDate && timeFillDate <= endDate) {
            var data: any = {};

            if (task.TaskDE != undefined && task.TaskDE.Id != undefined) {
              data.Task = task.TaskDE.Title;
              data.TaskId = task.TaskDE.Id;

            }
            if (task.TaskEI != undefined && task.TaskEI.Id != undefined) {
              data.Task = task.TaskEI.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskEI.Title;
              data.TaskId = task.TaskEI.Id;
              data.siteType = 'EI'

            }
            if (task.TaskEPS != undefined && task.TaskEPS.Id != undefined) {
              data.Task = task.TaskEPS.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskEP.Title;
              data.TaskId = task.TaskEPS.Id;
              data.siteType = 'EPS'

            }
            if (task.TaskEducation != undefined && task.TaskEducation.Id != undefined) {
              data.Task = task.TaskEducation.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskEducation.Title;
              data.TaskId = task.TaskEducation.Id;
              data.siteType = 'Education'

            }
            if (task.TaskHHHH != undefined && task.TaskHHHH.Id != undefined) {
              data.Task = task.TaskHHHH.Title; // == undefined ? (task.Title == undefined ? '' : task.Title) : task.TaskHHHH.Title;
              data.TaskId = task.TaskHHHH.Id;
              data.siteType = 'HHHH'
              // HHHHSitee += '(Id eq ' + task.TaskHHHH.Id + ') or';
              // sheetDetails.siteType = 'HHHH'
            }
            if (task.TaskQA != undefined && task.TaskQA.Id != undefined) {
              data.Task = task.TaskQA.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskQA.Title;
              data.TaskId = task.TaskQA.Id;
              data.siteType = 'QA'
              // QASitee += '(Id eq ' + task.TaskQA.Id + ') or';
              // sheetDetails.siteType = 'QA'
            }
            if (task.TaskGender != undefined && task.TaskGender.Id != undefined) {
              data.Task = task.TaskGender.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskGender.Title;
              data.TaskId = task.TaskGender.Id;
              data.siteType = 'Gendar'
              // GenderSitee += '(Id eq ' + task.TaskGender.Id + ') or';
              //sheetDetails.siteType = 'Gender'
            }
            if (task.TaskShareweb != undefined && task.TaskShareweb.Id != undefined) {
              data.Task = task.TaskShareweb.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskShareweb.Title;
              data.TaskId = task.TaskShareweb.Id;
              data.siteType = 'Shareweb'
              // SharewebSitee += '(Id eq ' + task.TaskShareweb.Id + ') or';
              // sheetDetails.siteType = 'Shareweb'
            }
            if (task.TaskGruene != undefined && task.TaskGruene.Id != undefined) {
              data.Task = task.TaskGruene.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskGruene.Title;
              data.TaskId = task.TaskGruene.Id;
              data.siteType = 'Gruene'
              // GrueneSitee += '(Id eq ' + task.TaskGruene.Id + ') or';
              // sheetDetails.siteType = 'Gruene'
            }
            if (task.TaskOffshoreTasks != undefined && task.TaskOffshoreTasks.Id != undefined) {
              data.Task = task.TaskOffshoreTasks.Title; // == undefined ? (task.Title == undefined ? '' : task.Title)  : task.TaskOffshoreTasks.Title;
              data.TaskId = task.TaskOffshoreTasks.Id;
              data.siteType = 'Offshore%20Tasks'
              //OffshoreSitee += '(Id eq ' + task.TaskOffshoreTasks.Id + ') or';
              //sheetDetails.siteType = 'Offshore Tasks'
            }
            if (task.TaskHealth != undefined && task.TaskHealth.Id != undefined) {
              data.Task = task.TaskHealth.Title;
              data.TaskId = task.TaskHealth.Id;
              data.siteType = 'Health'
              //HealthSitee += '(Id eq ' + task.TaskHealth.Id + ') or';
              //sheetDetails.siteType = 'Health'
            }
            if (task.TaskKathaBeck != undefined && task.TaskKathaBeck.Id != undefined) {
              data.Task = task.TaskKathaBeck.Title;
              data.TaskId = task.TaskKathaBeck.Id;
              data.siteType = 'KathaBeck'
              // KathaBeckSitee += '(Id eq ' + task.TaskKathaBeck.Id + ') or';
              //sheetDetails.siteType = 'KathaBeck'
            }
            if (task.TaskMigration != undefined && task.TaskMigration.Id != undefined) {
              data.Task = task.TaskMigration.Title;
              data.TaskId = task.TaskMigration.Id;
              data.siteType = 'Migration'
              //MigrationSitee += '(Id eq ' + task.TaskMigration.Id + ') or';
              // sheetDetails.siteType = 'Migration'
            }
            if (task.TaskALAKDigital != undefined && task.TaskALAKDigital.Id != undefined) {
              data.Task = task.TaskALAKDigital.Title;
              data.TaskId = task.TaskALAKDigital.Id;
              data.siteType = 'ALAKDigital'
              // ALAKDigitalSitee += '(Id eq ' + task.TaskALAKDigital.Id + ') or';
              // sheetDetails.siteType = 'ALAKDigital'
            }


            data.totalTime += parseFloat(filledTime?.TaskTime);
            data.TaskTime = filledTime?.TaskTime;
            data.AuthorTitle = filledTime.AuthorName
            data.AuthorId = filledTime.AuthorId
            data.AuthorImage = filledTime?.AuthorImage
            data.TaskDates = filledTime?.TaskDate;
            data.Description = filledTime?.Description
            data.timeFillDate = timeFillDate;
            var dt = new Date(filledTime?.TaskDate).toLocaleDateString()
            data.dayName = getDayName(new Date(data.timeFillDate));
            // data.dayName = dt.getDay();
            weekTimeEntries.push(data);
          }
          // }


        })
      }
    })
    weekTimeEntries.sort((a: any, b: any) => {
      return b.timeFillDate - a.timeFillDate;
    });
    var data: any = {}

    weekTimeEntries?.forEach((ba: any) => {
      ba.totalTime = 0.00;
      AllUsers?.forEach((val: any) => {
        if (val.AssingedToUserId == ba.AuthorId) {
          ba.totalTime = 0.00;
          ba.AuthorName = ba?.AuthorTitle;
          Mon.push(ba)
        }
      })

    })
    data.totalTime = 0.00
    data.child = []

    let MyData: any = []
    //   const uniqueUsers = Mon?.reduce((acc:any, currentItem:any) => {

    //     const { TaskTime, AuthorId, AuthorTitle, AuthorImage, AuthorName, dayName, totalTime} = currentItem;

    //     if (!acc[AuthorId] && !acc[dayName]) {
    //         acc[AuthorId] = {
    //             AuthorId,
    //             AuthorTitle,
    //             AuthorImage,
    //             AuthorName,
    //             TaskTime,
    //             dayName,
    //             totalTime,
    //             child: []
    //         };

    //     }

    //     acc[AuthorId].child.push(currentItem);
    //     return acc;
    // }, {});

    //const resultArray = Object.values(uniqueUsers);

    //console.log(uniqueUsers);
    //MyData.push(uniqueUsers)
    const groupedTasks: any = {};
    var result:any=[]
    Mon.forEach((child: { AuthorId: any; dayName: any; TaskTime: any, AuthorName: any, totalTime: any }) => {
      const { AuthorId, dayName, TaskTime, AuthorName, totalTime } = child;

      if (!groupedTasks[AuthorId]) {
        groupedTasks[AuthorId] = {};
      }
      if (!groupedTasks[AuthorName]) {
        groupedTasks[AuthorName] = {};
      }
      if (!groupedTasks[totalTime]) {
        groupedTasks[totalTime] = {};
      }

      if (!groupedTasks[AuthorId][dayName]) {
        groupedTasks[AuthorId][dayName] = [];
      }

      groupedTasks[AuthorId][dayName].push(child);
    });

    const resultArray: React.SetStateAction<any[]> = [];

    for (const authorId in groupedTasks) {
      const days = groupedTasks[authorId];

      for (const day in days) {
        resultArray.push({
          AuthorId: Number(authorId),
          dayName: day,
          child: days[day]
        });
      }
    }

    console.log(resultArray);


    resultArray?.forEach((ele: any) => {
      ele.childs = []
      //const finalData = ele.child?.filter((item:any, TaskId:any) => ele.child?.indexOf(item) === TaskId);
      const uniqueItemsSet = new Set();

      const finalData = ele.child.filter((item: any) => {
        const jsonRepresentation = JSON.stringify(item);
        if (!uniqueItemsSet.has(jsonRepresentation)) {
          uniqueItemsSet.add(jsonRepresentation);
          return true;
        }
        return false;
      });
      // const finalData = ele.child.reduce((acc:any, item:any) => {
      //   if (!acc.includes(item.Title)) {
      //     acc.push(item);
      //   }
      //   return acc;
      // }, []); 

      finalData?.forEach((baaa: any) => {
        ele.childs.push(baaa)
      })

    })

    resultArray?.forEach((val: any) => {
      val.totalTime = 0.00;
      val.childs?.forEach((childd: any) => {
        if (val.AuthorId == childd.AuthorId) {
          val.totalTime = val.totalTime + parseFloat(childd.TaskTime)
          val.AuthorName = childd.AuthorName
        }

      })
    })
    Mon = []

    console.log(MyData)

    resultArray?.forEach((val:any)=>{
      if(val.dayName == 'Monday'){
        val.MondayTime = {'totalTime':val.totalTime,"childs":val.childs}
      }
     if(val.dayName == 'Tuesday'){
      val.TuesdayTime = {'totalTime':val.totalTime,"childs":val.childs}
     }
     if(val.dayName == 'Wednesday'){
      val.WedTime = {'totalTime':val.totalTime,"childs":val.childs}
     }
      
      //val.ThuTime = {'totalTime':val.totalTime,"childs":val.childs}
    })
    var Datat:any=[]
    const groupedData:any = {};

    resultArray.forEach((item:any) => {
  if (!groupedData[item.AuthorId]) {
    groupedData[item.AuthorId] = {
      AuthorId: item.AuthorId,
      AuthorName: item.AuthorName,
      [`${item.dayName}Time`]: {
        totalTime: item.totalTime,
        child: [...item.child],
        childs: [...item.childs],
      },
    };
  } else {
    groupedData[item.AuthorId][`${item.dayName}Time`] = {
      totalTime: item.totalTime,
      child: [...item.child],
      childs: [...item.childs],
    };
  }
});
{Object.keys(groupedData).map((key) => {

     var ss = groupedData[parseInt(key)];
     result.push(ss)

  })}
//const result = Object.values(groupedData);

    
   console.log(Datat)
    setWeeklyTimeReport(result)

  }

  function getDayName(date = new Date(), locale = 'en-US') {
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }
  const getStartingDate = (type: any) => {
    if (type != undefined) {
      var curr = new Date(type)
    }
    else {
      var curr = new Date;
    }
    // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(last)).toUTCString();
    var start = new Date(firstday)
    var endd = new Date(lastday)
    start;
    endd;
    return {
      start,
      endd
    };
    return formattedDate
  }
  const callBackData = React.useCallback((elem: any, ShowingData: any) => {


}, []);
  const openeditpopups = (items: any) => {
    var Data: any = []
    Data.push(items)
    setData(items)
    setChildData(items)
    setOpeneditpopup(true)
  }
  const closeeditpopup = () => {
    setOpeneditpopup(false)
  }
  const goToPreviousWeek = () => {
    setendWeekDate(currentDate)
    const previousWeek: any = new Date(currentDate);
    previousWeek.setDate(previousWeek.getDate() - 7);
    let Start = previousWeek;
    setCurrentDate(previousWeek.toDateString());
    loadAllTime(Start)
  };

  const goToNextWeek = () => {
    setCurrentDate(endWeekDate)
    const nextWeek: any = new Date(endWeekDate);
    let Start = endWeekDate;
    nextWeek.setDate(nextWeek.getDate() + 7);
    setendWeekDate(nextWeek.toDateString());
    loadAllTime(Start)
  };

  const column = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
        {
            header: '',
            accessorKey: 'AuthorName',
            placeholder: "AuthorName",


        },
        {

            accessorFn: (row) => row?.Task,
            cell: ({ row, getValue }) => (
                <>
                    <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                        href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile.aspx?taskId=" + row?.original?.TaskId + '&Site=' + row?.original?.siteType}
                    >
                        {getValue()}
                    </a>

                </>
            ),
            id: 'Task',
            header: '',
            placeholder: "Task",



        },
        
       
      
       
        {
            header: '',
            accessorKey: 'TaskTime',
            placeholder: "Time",


        },
        {
            header: '',
            accessorKey: 'TaskDates',
            placeholder: "Date",

        },
       

    ],
    [data]
);
  return (
    <>

     
      <h2 className='heading'>This Week Timesheet Summary</h2>
      
      <div>
        <div className="text-end">
        {currentDate} - {endWeekDate} 
        </div>
      
        <div className='mt-1 mb-3'>
          <span className="pull-right">
          <button  className="me-1" onClick={goToPreviousWeek}>Previous Week</button>
          <button onClick={goToNextWeek}>Next Week</button>
          </span>
          <span className='pull-left'>
          <div><b>Team Leader -</b>{CurrentUserTitle}</div>
          </span>
         
        </div>
        <div className='Alltable mt-1'>
        <table className="table table-striped">
          <thead className="thead-dark">
            <th scope="col">Emp</th>
            <th scope="col">Mon</th>
            <th scope="col">Tue</th>
            <th scope="col">Wed</th>
            <th scope="col">Thu</th>
            <th scope="col">Fri</th>
          </thead>
          <tbody>
            {
              weeklyTimeReport?.map((val: any) => {
                return (
                  <>
                    <tr>
                      <td scope="row">{val.AuthorName}</td>
                     
                       <td scope="row" onClick={()=>openeditpopups(val?.MondayTime?.childs)}> {val?.MondayTime?.totalTime}  </td>
                       <td scope="row" onClick={()=>openeditpopups(val?.TuesdayTime?.child)}> {val?.TuesdayTime?.totalTime}</td>

                        
                       <td onClick={()=>openeditpopups(val?.WednesdayTime?.childs)}> {val?.WednesdayTime?.totalTime}</td>

                        
                       <td scope="row" onClick={()=>openeditpopups(val?.ThursdayTime?.childs)}>{val?.ThursdayTime?.totalTime}</td>
                        
                       <td scope="row" onClick={()=>openeditpopups(val?.FridayTime?.childs)}>{val?.FridayTime?.totalTime}</td>
                     
                       
                    </tr>
                    {/* {
                      val.dayName == 'Wednesday' && <>

                        <tr>
                          <td scope="row">{val.AuthorName}</td>

                          <td scope="row" onClick={() => openeditpopups(val?.childs)}> {val.totalTime} </td>
                          <td scope="row" onClick={() => openeditpopups(val?.child)}>{val.totalTime}  </td>
                        </tr>
                      </>
                    }
                    {
                      val.dayName == 'Tuesday' && <>

                        <tr>
                          <td scope="row">{val.AuthorName}</td>

                          <td scope="row" onClick={() => openeditpopups(val?.childs)}> {val.totalTime} </td>
                          <td scope="row" onClick={() => openeditpopups(val?.child)}>{val.totalTime}  </td>

                        </tr>
                      </>
                    }
                     {
                      val.dayName == 'Monday' && <>

                        <tr>
                          <td scope="row">{val.AuthorName}</td>

                          <td scope="row" onClick={() => openeditpopups(val?.childs)}> {val.totalTime} </td>
                          <td scope="row" onClick={() => openeditpopups(val?.child)}>{val.totalTime}  </td>

                        </tr>
                      </>
                    } */}

                  </>
                )
              })
            }

          </tbody>
        </table>
        </div>
      </div>
      <Panel

        type={PanelType.custom}
        customWidth="700px"
        isOpen={openeditpopup}
        onDismiss={closeeditpopup}
        isBlocking={false}
      >
        {/* <table className="table">
          <thead>
            <th>TasID</th>
            <th>Task</th>
            <th>Time</th>
            <th>Date</th>

          </thead>
          <tbody>
            {
              childData?.map((val: any) => {
                return (
                  <>
                    <tr>
                      <td>{val?.TaskId}</td>
                      <td>{val?.Task}</td>
                      <td>{val?.TaskTime}</td>
                      <td>{val?.timeDate}</td>
                    </tr>
                  </>
                )
              })
            }

          </tbody>
        </table> */}
        <div className='Alltable mb-2'>
        <GlobalCommanTable columns={column} data={data} callBackData={callBackData} showHeader={false} /> 
        </div>

      </Panel>
    </>
  )
}
export default TimeSummary


