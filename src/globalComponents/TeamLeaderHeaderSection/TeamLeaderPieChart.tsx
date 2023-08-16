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

const TeamLeaderPieChart = (Props: any) => {
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
                }
                if (PercentageStatus >= 10 && PercentageStatus < 70 || PercentageStatus > 70 && PercentageStatus < 80) {
                    TotlaNoOfInProgressTasks = TotlaNoOfInProgressTasks + 1;
                }
                if (PercentageStatus == 70) {
                    TotlaNoOfReOpenTasks = TotlaNoOfReOpenTasks + 1;
                }
                if (PercentageStatus == 80) {
                    TotlaNoOfInQAReviewTasks = TotlaNoOfInQAReviewTasks + 1;
                }
                if (PercentageStatus > 80 && PercentageStatus < 100) {
                    TotlaNoOfCompletedTasks = TotlaNoOfCompletedTasks + 1;
                }
            })
            let PiChartAllData = { Tasks: [`Not Started - 0${TotalNoOfNotStartedTasks}`, `In Progress`, `Re-open`, `In Review(QA)`, `Completed`], count: [TotalNoOfNotStartedTasks, TotlaNoOfInProgressTasks, TotlaNoOfReOpenTasks, TotlaNoOfInQAReviewTasks, TotlaNoOfCompletedTasks] }
            setTeamTasksSummary(PiChartAllData)
        }

    }, [AllTaskData])
    let type: any = "pie";
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
        events: {
            click: function (event: any, chartContext: any, config: any) {
                EditPiaChartFunction(event, chartContext, config);
                // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
            }
        }

    }


    const EditPiaChartFunction = (event: any, chartContext: any, config: any) => {
        console.log("Event =======", event)
        console.log("chartContext =======", chartContext)
        console.log("config =======", config)
    }
    return (
        <>
            {teamTasksSummary?.count ? <Row>
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
                                event={EditPiaChartFunction}

                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row> : null}
        </>
    )
}
export default TeamLeaderPieChart;