import * as React from 'react';
import {
    Button,
    Card,
    CardBody, CardFooter,
    CardHeader,
    CardTitle,
    Col, CustomInput,
    Pagination,
    PaginationItem,
    PaginationLink, Progress,
    Row,
    Table
} from "reactstrap";
import Chart from "react-apexcharts";
import TaskDetailsPanel from './TaskDetailsPanel';

const TeamLeaderPieChart = (Props: any) => {
    const TaskDetailsObject: any = [
        { usedFor: "Not Started", Count: 0, Data: [] },
        { usedFor: "In Progress", Count: 0, Data: [] },
        { usedFor: "Re-open", Count: 0, Data: [] },
        { usedFor: "In Review(QA)", Count: 0, Data: [] },
        { usedFor: "Completed", Count: 0, Data: [] },
    ]
    const [AllTaskFilteredData, setAllTaskFilteredData] = React.useState<any>([]);
    const [CurrentlySelectItemData, setCurrentlySelectItemData] = React.useState<any>([]);
    const [IsOpenTaskDetailsStatus, setIsOpenTaskDetailsStatus] = React.useState(false);
    let TotalNoOfNotStartedTasks = 0;
    let TotlaNoOfInProgressTasks = 0;
    let TotlaNoOfReOpenTasks = 0;
    let TotlaNoOfInQAReviewTasks = 0;
    let TotlaNoOfCompletedTasks = 0;
    const [teamTasksSummary, setTeamTasksSummary] = React.useState<any>();
    let AllTaskData: any = Props.allTaskData?.length > 0 ? Props.allTaskData?.length : [];
    React.useMemo(() => {
        if (Props.allTaskData?.length > 0) {
            Props.allTaskData?.map((AllItems: any) => {
                let PercentageStatus = AllItems.PercentComplete;
                if (PercentageStatus < 10) {
                    TotalNoOfNotStartedTasks = TotalNoOfNotStartedTasks + 1;
                    TaskDetailsObject[0].Count = TotalNoOfNotStartedTasks;
                    TaskDetailsObject[0].Data.push(AllItems);
                }
                if (PercentageStatus >= 10 && PercentageStatus < 70 || PercentageStatus > 70 && PercentageStatus < 80) {
                    TotlaNoOfInProgressTasks = TotlaNoOfInProgressTasks + 1;
                    TaskDetailsObject[1].Count = TotlaNoOfInProgressTasks;
                    TaskDetailsObject[1].Data.push(AllItems);
                }
                if (PercentageStatus == 70) {
                    TotlaNoOfReOpenTasks = TotlaNoOfReOpenTasks + 1;
                    TaskDetailsObject[2].Count = TotlaNoOfReOpenTasks;
                    TaskDetailsObject[2].Data.push(AllItems);
                }
                if (PercentageStatus == 80) {
                    TotlaNoOfInQAReviewTasks = TotlaNoOfInQAReviewTasks + 1;
                    TaskDetailsObject[3].Count = TotlaNoOfInQAReviewTasks;
                    TaskDetailsObject[3].Data.push(AllItems);
                }
                if (PercentageStatus > 80 && PercentageStatus < 100) {
                    TotlaNoOfCompletedTasks = TotlaNoOfCompletedTasks + 1;
                    TaskDetailsObject[4].Count = TotlaNoOfCompletedTasks;
                    TaskDetailsObject[4].Data.push(AllItems);
                }
                setAllTaskFilteredData(TaskDetailsObject);
            })
            let PiChartAllData = { Tasks: [`Not Started`, `In Progress`, `Re-open`, `In Review(QA)`, `Completed`], count: [TotalNoOfNotStartedTasks, TotlaNoOfInProgressTasks, TotlaNoOfReOpenTasks, TotlaNoOfInQAReviewTasks, TotlaNoOfCompletedTasks] }
            setTeamTasksSummary(PiChartAllData)
        }

    }, [AllTaskData])
    let type: any = "pie";
    let index = 0;
    let options: any = {
        labels: teamTasksSummary != undefined ? teamTasksSummary?.Tasks : ["Not Started", "In Progress", "Re-open", "In Review(QA)", "Completed"],
        colors: ['#ff455f', '#01e396', '#00FFFF', '#feb018', '#008080', '#b9c509', '#808009', '#FF00FF', '#0000FF', '#775dd0'],
        legend: {
            position: "left",
            horizontalAlign: "buttom",
        },
        noData: {
            text: "Loading...",
        },
        plotOptions: {
            pie: {
                size: 400,
            },
        },
        chart: {
            events: {
                click: function (event: any, chartContext: any, config: any) {
                    EditPiaChartFunction(event, chartContext, config);
                    // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
                }
            },
            id: index + 1
        },
    }


    const EditPiaChartFunction = (event: any, chartContext: any, config: any) => {
        let tempVariable = event.target.className.baseVal
        let SelectedIndex = tempVariable.slice(tempVariable.length - 1, tempVariable.length);
        console.log("Selected Chart Index =======", SelectedIndex);
        console.log("Selected Task All details =======", AllTaskFilteredData);
        if (AllTaskFilteredData?.length > 0) {
            AllTaskFilteredData.map((itemData: any, Index: any) => {
                if (Index == SelectedIndex) {
                    let TempObject = {
                        selectcategory: itemData.usedFor,
                        selectedTaskDetails: itemData.Data
                    }
                    setCurrentlySelectItemData(TempObject);
                    // console.log("Selected Chart Data for ", itemData.usedFor + "Count" + itemData.Data + "Length :" + itemData.Data.length)
                }
            })
        }
        setIsOpenTaskDetailsStatus(true);
    }
    return (
        <>
            {teamTasksSummary?.count ? <Row>
                {console.log("All CurrentlySelectItemData Data in Div ========", CurrentlySelectItemData)}
                <Col lg="6" className='mt-2'>
                    <Card>
                        <CardHeader className="d-flex justify-content-between p-0  border-bottom col-sm-12">
                            <div className="col-sm-8 p-0">
                                <CardTitle tag="h4" className='mx-2'>
                                    Team Tasks Summary
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody className="p-0">
                            <Chart
                                options={options}
                                width={481}
                                series={teamTasksSummary?.count}
                                type={type}
                                seriesIndex={teamTasksSummary?.count}
                                event={EditPiaChartFunction}

                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row> : null}
            {CurrentlySelectItemData != undefined && IsOpenTaskDetailsStatus ?
                <TaskDetailsPanel
                    OpenPopup={IsOpenTaskDetailsStatus}
                    setIsOpenPopup={setIsOpenTaskDetailsStatus}
                    particularTaskdetailModal={CurrentlySelectItemData}
                    taskUsers={Props.taskUsers}
                />
                : <>{() => alert("No Data Availbe in this category Tasks")}</>
            }
        </>
    )
}
export default TeamLeaderPieChart;