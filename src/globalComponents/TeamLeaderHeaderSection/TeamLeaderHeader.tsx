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
const TeamLeaderHeader = (items: any) => {

    return (
        <>
            <div>
                {/* <Row>
                    <Col lg="12">
                        <Row>
                            <Col lg="12" md="12">
                                <Card className="card-chart">
                                    <CardHeader>
                                        <CardTitle>
                                            <CardTitle tag="h4">Team Summary : Thuresday 25 May 2023</CardTitle>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardBody>
                                        <div>
                                            <Col>
                                                <Row>
                                                    <Col md="2">
                                                        <Card className="text-white text-white rounded-3 text-center"
                                                            style={{ backgroundColor: '#243A4A', height: '83px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Immediate</p>
                                                                    <CardTitle className='text-white' tag="p">5</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col md="2">
                                                        <Card className="text-white text-white rounded-3 text-center"
                                                            style={{ backgroundColor: '#243A4A', height: '83px' }}>
                                                            <CardBody >
                                                                <div className="">
                                                                    <p className="card-category">Email Notification</p>
                                                                    <CardTitle className='text-white' tag="p">9</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col md="2">
                                                        <Card className="text-white text-white rounded-3 text-center"
                                                            style={{ backgroundColor: '#243A4A', height: '83px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">bottleneck</p>
                                                                    <CardTitle className='text-white' tag="p">3</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col md="2">
                                                        <Card className="text-white text-white rounded-3 text-center"
                                                            style={{ backgroundColor: '#243A4A', height: '83px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Working Today Tasks</p>
                                                                    <CardTitle className='text-white' tag="p">50</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col md="2">
                                                        <Card className="text-white text-white rounded-3 text-center"
                                                            style={{ backgroundColor: '#243A4A', height: '83px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Working This Week Tasks</p>
                                                                    <CardTitle className='text-white' tag="p">90</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                    <Col md="2">
                                                        <Card className="text-white text-white rounded-3 text-center"
                                                            style={{ backgroundColor: '#243A4A', height: '83px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">This Week Timeshits</p>
                                                                    <CardTitle className='text-white' tag="p">598</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                    </Col>
                </Row> */}

                <Row>
                    <Col lg="12" md="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <CardTitle>
                                    <CardTitle tag="h4">Team Summary : Thuresday 25 May 2023</CardTitle>
                                </CardTitle>
                            </CardHeader>
                            <Row className='mb-2 mt-1 p-1'>
                                <Col lg="2" md="2" >
                                    <Card className="card-chart rounded-3">
                                        <CardBody>
                                            <Col>
                                                <Row>
                                                    <Col md="12">
                                                        <Card className="text-white text-center"
                                                            style={{backgroundColor:'#0077d3',height: '83px',borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Immediate</p>
                                                                    <CardTitle className='text-white' tag="p">5</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="2" md="2">
                                    <Card className="card-chart rounded-3">
                                        <CardBody>
                                            <Col>
                                                <Row>
                                                    <Col md="12">
                                                        <Card className="text-white text-center"
                                                            style={{backgroundColor:'#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody >
                                                                <div className="">
                                                                    <p className="card-category">Email Notification</p>
                                                                    <CardTitle className='text-white' tag="p">9</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="2" md="2">
                                    <Card className="card-chart rounded-3">
                                        <CardBody>
                                            <Col>
                                                <Row>
                                                    <Col md="12">
                                                        <Card className="text-white text-center"
                                                            style={{backgroundColor:'#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Bottleneck</p>
                                                                    <CardTitle className='text-white' tag="p">3</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="2" md="2">
                                    <Card className="card-chart rounded-3"> 
                                        <CardBody>
                                            <Col>
                                                <Row>
                                                    <Col md="12">
                                                        <Card className="text-white text-center"
                                                            style={{backgroundColor:'#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Working Today Tasks</p>
                                                                    <CardTitle className='text-white' tag="p">50</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col> 
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="2" md="2">
                                    <Card className="card-chart rounded-3">
                                        <CardBody>
                                            <Col>
                                                <Row>
                                                    <Col md="12">
                                                        <Card className="text-white text-center"
                                                            style={{backgroundColor:'#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Working This Week Tasks</p>
                                                                    <CardTitle className='text-white' tag="p">90</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </CardBody>
                                    </Card>
                                </Col>
                                <Col lg="2" md="2">
                                    <Card className="card-chart rounded-3">
                                        <CardBody>
                                            <Col>
                                                <Row>
                                                    <Col md="12">
                                                        <Card className="text-white text-center"
                                                            style={{ backgroundColor:'#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">This Week Timeshits</p>
                                                                    <CardTitle className='text-white' tag="p">598</CardTitle>
                                                                </div>
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row> 
                                            </Col>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )

}
export default TeamLeaderHeader;
