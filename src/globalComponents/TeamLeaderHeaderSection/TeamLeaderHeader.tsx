
import * as React from 'react';
import moment from 'moment';

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
import TaskDetailsPanel from './TaskDetailsPanel';
let TotalImmediatecategory:any
let TotalEmailcategory:any
let TotalBottleneckcategory:any
let TotalIsTodaysTask:any
let TotalworkingThisWeek:any
const TeamLeaderHeader = (props: any) => {

 
    const d = new Date();
    let date = moment(d).format("dddd DD /MM /YYYY");
    const [CategoiesData, setCategoiesData] = React.useState({
        Immediate: 0, Email: 0, Bottleneck: 0, IsTodaysTask: 0, workingThisWeek: 0,
    })
    const [particularTaskdetailModal, setparticularTaskdetailModal] = React.useState({selectcategory:"",selectedTaskDetails:[]})
    const [isOpenPopup,setIsOpenPopup ] = React.useState(false)
    let allTaskData = props.allTaskData.length > 0 ? props.allTaskData : [];
    console.log(props.allTaskData)

   
    React.useMemo(() => {
        console.log("Use Effect Function ========")
        if (allTaskData?.length > 0) {
             TotalImmediatecategory = props?.allTaskData.filter((item: any) => item.SharewebCategories.find((cate: any) => cate.Title == "Immediate"))
             TotalEmailcategory= props?.allTaskData.filter((item: any) => item.SharewebCategories.find((cate: any) => cate.Title == "Email"))
             TotalBottleneckcategory = props?.allTaskData.filter((item: any) => item.SharewebCategories.find((cate: any) => cate.Title == "Bottleneck"))
             TotalIsTodaysTask= props?.allTaskData.filter((items: any) => items.IsTodaysTask)
            TotalworkingThisWeek = props?.allTaskData.filter((items: any) => items.workingThisWeek)
            setCategoiesData({
                ...CategoiesData, Immediate: TotalImmediatecategory.length, Email: TotalEmailcategory.length,
                Bottleneck: TotalBottleneckcategory.length,
                IsTodaysTask: TotalIsTodaysTask.length,
                workingThisWeek: TotalworkingThisWeek.length
            })
        }

    },[allTaskData])
   const openTaskDetailModel=(category:any)=>{
    switch(category) {
        case 'Immediate':
            setparticularTaskdetailModal({...particularTaskdetailModal,selectedTaskDetails:TotalImmediatecategory,selectcategory:category}) 
          break;
        case 'Email':
            setparticularTaskdetailModal({...particularTaskdetailModal,selectedTaskDetails:TotalEmailcategory,selectcategory:category}) 
          break;
          case 'Bottleneck':
            setparticularTaskdetailModal({...particularTaskdetailModal,selectedTaskDetails:TotalBottleneckcategory,selectcategory:category}) 
            break;
            case 'IsTodaysTask':
                setparticularTaskdetailModal({...particularTaskdetailModal,selectedTaskDetails:TotalIsTodaysTask,selectcategory:category}) 
                break;
                case 'workingThisWeek':
                    setparticularTaskdetailModal({...particularTaskdetailModal,selectedTaskDetails:TotalworkingThisWeek,selectcategory:category}) 
                break;
        default:
            
      }
      setIsOpenPopup(true)
   }
    return (

        <>
            {console.log("Use in div Function ========", CategoiesData)
            }
          {allTaskData.length>0 && <div>
                <Row>
                    <Col lg="12" md="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <CardTitle>
                                    <CardTitle tag="h4">{props?.selectedMember==undefined||null?'Team Summary :':props?.selectedMember.Title} {date}</CardTitle>
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
                                                            style={{ backgroundColor: '#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Immediate</p>
                                                                    <CardTitle className='text-white' tag="p"  onClick={()=>{openTaskDetailModel("Immediate")}}>{CategoiesData.Immediate}</CardTitle>
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
                                                            style={{ backgroundColor: '#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody >
                                                                <div className="">
                                                                    <p className="card-category">Email Notification</p>
                                                                    <CardTitle className='text-white' tag="p"onClick={()=>{openTaskDetailModel("Email")}}>{CategoiesData?.Email}</CardTitle>
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
                                                            style={{ backgroundColor: '#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Bottleneck</p>
                                                                    <CardTitle className='text-white' tag="p"onClick={()=>{openTaskDetailModel("Bottleneck")}}>{CategoiesData?.Bottleneck}</CardTitle>
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
                                                            style={{ backgroundColor: '#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Working Today Tasks</p>
                                                                    <CardTitle className='text-white' tag="p"onClick={()=>{openTaskDetailModel("IsTodaysTask")}}>{CategoiesData?.IsTodaysTask}</CardTitle>
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
                                                            style={{ backgroundColor: '#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">Working This Week Tasks</p>
                                                                    <CardTitle className='text-white' tag="p"onClick={()=>{openTaskDetailModel("workingThisWeek")}}>{CategoiesData?.workingThisWeek}</CardTitle>
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
                                                            style={{ backgroundColor: '#0077d3', height: '83px', borderRadius: '14px' }}>
                                                            <CardBody>
                                                                <div className="">
                                                                    <p className="card-category">This Week Timesheets</p>
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
            </div>}
            <TaskDetailsPanel OpenPopup={isOpenPopup}setIsOpenPopup={setIsOpenPopup}particularTaskdetailModal={particularTaskdetailModal}/>
        </>
    )

}
export default TeamLeaderHeader;
