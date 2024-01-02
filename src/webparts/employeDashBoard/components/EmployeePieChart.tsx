import * as React from 'react';
import ReactApexChart from 'react-apexcharts';
import { myContextValue } from '../../../globalComponents/globalCommon'
import { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
const barChartColors = ['#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB', '#008FFB'];
const barChartColorsXYaxis = ['#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000'];
var timesheetListConfig: any;
const EmployeePieChart = (SelectedProps: any) => {
  var barChartData: any
  var weekDate: any = []
  const contextdata: any = React.useContext(myContextValue)
  const [data, setData] = React.useState<any>([])
  const [sumBarTime, setSumBarTime] = React.useState<any>([])
  const [IsShowPieChart, setIsShowPieChart] = React.useState<any>(false)
  if (contextdata.timesheetListConfig != undefined)
    timesheetListConfig = contextdata.timesheetListConfig
  React.useEffect(() => {
    GetDate()
  }, [timesheetListConfig])
  const GetDate = () => {
    weekDate = [];
    const today: any = new Date();
    const startOfWeek: any = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const dateArray = [];
    for (let i: any = new Date(startOfWeek); i <= today; i.setDate(i.getDate() + 1)) {
      dateArray.push(new Date(i));
    }
    const dateStrings = dateArray.map(date => date.toLocaleDateString());   
    weekDate = weekDate.concat(dateStrings);
    loadAllTimeEntry();
  }
  const loadAllTimeEntry = async () => {
    var AllTaskTimeEntries: any = [];
    let weeklyData = [0, 0, 0, 0, 0];
    if (timesheetListConfig?.length > 0) {
      let timesheetLists: any = [];
      let startDate = getStartingDate('This Week').toISOString();
      let taskLists: any = [];
      timesheetLists = JSON.parse(timesheetListConfig[0]?.Configurations)
      taskLists = JSON.parse(timesheetListConfig[0]?.Description != undefined ? timesheetListConfig[0]?.Description : null)
      if (timesheetLists?.length > 0) {
        const fetchPromises = timesheetLists.map(async (list: any) => {
          let web = new Web(contextdata?.siteUrl);
          try {
            const data = await web.lists.getById(list?.listId).items.select(list?.query).filter(`(Modified ge '${startDate}') and (TimesheetTitle/Id ne null)`).top(5000).getAll();
            data?.forEach((item: any) => {
              item.AdditionalTimeEntryArray = JSON.parse(item?.AdditionalTimeEntry)
              AllTaskTimeEntries.push(item);
            });
          } catch (error) {
            console.log(error);
          }
        });
        await Promise.all(fetchPromises)
        weekDate?.map((date: any, index: any) => {
          let totalTime = 0;
          let [month, day, year] = date.split('/')
          let weekdate: any = new Date(+year, +month - 1, +day)
          AllTaskTimeEntries?.map((timeEntry: any) => {
            timeEntry?.AdditionalTimeEntryArray?.map((addTime: any) => {
              let [day, month, year] = addTime.TaskDate.split('/')
              let reorderedDate: any = new Date(+year, +month - 1, +day);
              if ((addTime?.AuthorId == contextdata?.currentUserData?.AssingedToUser?.Id) && (weekdate.getTime() == reorderedDate.getTime())) {
                let parseTime = parseFloat(addTime.TaskTime)
                totalTime = totalTime + parseTime
                weeklyData[index] = totalTime
              }
            })
          })
          weeklyData[index] = totalTime
        })
        let sum = 0;
        weeklyData.forEach(num => {
          sum += num;
        })
        setSumBarTime(sum)
        weeklyData.push(weeklyData.shift())
        const hasNonZeroValues = weeklyData.some((value: number) => value > 0);
        setIsShowPieChart(hasNonZeroValues)
        setData(weeklyData)
      }
    }
  }
  function getStartingDate(startDateOf: any) {
    const startingDate = new Date();
    let formattedDate = startingDate;
    if (startDateOf == 'This Week') {
      startingDate.setDate(startingDate.getDate() - startingDate.getDay());
      formattedDate = startingDate;
    }
    return formattedDate;
  }
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
          },
        },
      },
      colors: barChartColors,
      plotOptions: {
        bar: {
          columnWidth: '50%',
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
  const setModalIsOpenToFalse = () => {
    SelectedProps?.Call();
  }
  const onRenderCustomHeaderMain = () => {
    return (
      <>
        <div className="subheading alignCenter">
          <span className="siteColor">
            This Week's TimeSheet ({sumBarTime})
          </span>
        </div>
      </>
    );
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
    )
  }
  return (
    <>
      <Panel type={PanelType.medium} isOpen={SelectedProps?.IsOpenTimeSheetPopup} onDismiss={setModalIsOpenToFalse} onRenderHeader={onRenderCustomHeaderMain} isBlocking={false} onRenderFooter={onRenderCustomFooterMain}>
        <div id="bar-chart border">         
          <div className='alignCenter'>
            <span className='fw-bold'>
            </span>
            {IsShowPieChart && <span title='Refresh TimeSheet ' className="ml-auto svg__iconbox svg__icon--refresh dark me-2" onClick={() => GetDate()}></span>}
          </div>
          {IsShowPieChart ? (
            <ReactApexChart options={barChartData?.options} series={barChartData?.series} type="bar" height={350} />
          ) : (
            <div className="d-flex justify-content-center">No data available</div>
          )}

        </div>
      </Panel>
    </>
  );
};
export default EmployeePieChart;
