import * as React from 'react'
import {Web} from 'sp-pnp-js'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import EditContractPopup from './EditContractPopup';
import Moment from 'react-moment';
import './ContractProfileTable.css';

export default function ContractProfileTable() {
    var HHHHStaffId:any;
    const [state, setState]:any = React.useState("")
    const [state2, setState2]:any = React.useState("")
    const [status ,setStatus]:any = React.useState(false);
    

    // ContractDatabase List Data
    const ContractDatabaseData = async () => {
        const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
        await web.lists.getById('986680ce-5d69-47b4-947c-3998ddc3776c').items.getById(230)
        .select("Title", "Id","ContractId", "startDate", "endDate","contractNumber", "ContractSigned", "ContractChanged", "typeOfContract", "GrossSalary", "HolidayEntitlement", "WorkingHours", "HHHHStaff/Id")
        .expand("HHHHStaff")
        .get()
        .then((res: any)=>{
            setState(res);
            HHHHStaffId=res.HHHHStaff.Id;
            let currentDate = new Date();
            if(currentDate >= new Date(res.startDate)  && currentDate <= new Date(res.endDate)){
                setStatus(true);
             } else{
                setStatus(false);
             }
            if(HHHHStaffId!=undefined && HHHHStaffId!=""){
                EmployeeDetailsData();
            }
        })
        .catch((err)=>{
            console.log(err.message);
        });

    }
    
   
    // EmployeeDetails List Data
    const EmployeeDetailsData = async () => {

        const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
        await web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.getById(HHHHStaffId)
        .get()
        .then((res : any)=>{
            setState2(res);
        })
        .catch((err)=>{
            console.log(err.message);
        });

    }

    //const DOB = state2.dateOfBirth;
    React.useEffect(()=> {
        ContractDatabaseData();
    },[]);

  return (
    <>
    <EditContractPopup props={state} props2 ={state2} call={ContractDatabaseData}/>
    <Container>
        <Row>
            <Col> 
                <Table bordered >
                    <tbody>
                        <tr>
                            <th>Employee Name</th>
                            <td>{state2.FullName}</td>
                        </tr>
                        <tr>
                            <th>Staff Id</th>
                            <td>{state2.StaffID}</td>
                        </tr>
                        <tr>
                            <th>DOB</th>
                            <td><Moment format='DD/MM/YYYY'>{state2.dateOfBirth}</Moment></td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{state2.WorkAddress}</td>
                        </tr>
                        <tr>
                            <th>City</th>
                            <td>{state2.WorkCity}</td>
                        </tr>
                        <tr>
                            <th>ZIP Code</th>
                            <td>{state2.ZIP_x0020_Code}</td>
                        </tr>
                        <tr>
                            <th>Fedral State</th>
                            <td>{state2.Fedral_State}</td>
                        </tr>
                        <tr>
                            <th>Country</th>
                            <td>{state2.Country}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <Col>
                <Table bordered >
                    <tbody>
                        <tr>
                            <th>Contract Id</th>
                            <td>{state.ContractId}</td>
                        </tr>
                        <tr>
                            <th>Start Date</th>
                            <td><Moment format='DD/MM/YYYY'>{state.startDate}</Moment></td>
                        </tr>
                        <tr>
                            <th>End Date</th>
                            <td><Moment format='DD/MM/YYYY'>{state.endDate}</Moment></td>
                        </tr>
                        <tr>
                            <th>Contract Signed</th>
                            <td><Moment format='DD/MM/YYYY'>{state.ContractSigned}</Moment></td>
                        </tr>
                        <tr>
                            <th>Contract Changed</th>
                            <td><Moment format='DD/MM/YYYY'>{state.ContractChanged}</Moment></td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>{status?'Active':'Non active'}</td>
                        </tr>
                        <tr>
                            <th>Contract Type</th>
                            <td>{state.typeOfContract}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
            <Col>
                <Table bordered >
                    <tr>
                        <th>Gross Salary</th>
                        <td>{state.GrossSalary}</td>
                    </tr>
                    <tr>
                        <th>Holiday Entitlement</th>
                        <td>{state.HolidayEntitlement}</td>
                    </tr>
                    <tr>
                        <th>Working Hours</th>
                        <td>{state.WorkingHours}</td>
                    </tr>
                </Table>
            </Col>
        </Row>
    </Container>
    </>
  )
}


