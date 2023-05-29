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

const TeamLeaderPieChart = (items:any) => {
    const [teamTasksSummary, setTeamTasksSummary] = React.useState({ Tasks: ["Not Started", "In Progress", "Re-open", "In Review(QA)", "Completed"], count: [5, 6, 8, 3, 9] });

    let type: any = "pie";
    let options: any = {
        labels: teamTasksSummary["Tasks"],
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
        }
    };



    return (
        <>
            <Row>
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
                                series={teamTasksSummary["count"]}
                                type={type}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
export default TeamLeaderPieChart;