import * as React from "react";
import { Web } from "sp-pnp-js";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import EditContractPopup from "./EditContractPopup";
import Moment from "react-moment";
import "./ContractProfileTable.css";

export default function ContractProfileTable() {
  var HHHHStaffId: any;
  var smartStateId: any;
  var smartCountriesId: any;
  const [state, setState]: any = React.useState("");
  const [state2, setState2]: any = React.useState("");
  const [smartState, setSmartState] : any = React.useState("");
  const [smartCountries, setSmartCountries] : any = React.useState("");
  const [status, setStatus]: any = React.useState(false);
  
  const searchParams = new URLSearchParams(window.location.search);
  const contractId = searchParams.get("SmartID");
  
  
  
  
  // ContractDatabase List Data
  const ContractDatabaseData = async () => {
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
    await web.lists
      .getById("986680ce-5d69-47b4-947c-3998ddc3776c")
      .items.getById(parseInt(contractId))
      .select(
        "Title",
        "Id",
        "ContractId",
        "startDate",
        "endDate",
        "contractNumber",
        "ContractSigned",
        "ContractChanged",
        "typeOfContract",
        "GrossSalary",
        "HolidayEntitlement",
        "WorkingHours",
        "HHHHStaff/Id"
      )
      .expand("HHHHStaff")
      .get()
      .then((res: any) => {
        setState(res);
        HHHHStaffId = res.HHHHStaff.Id;
        let currentDate = new Date();
        if (
          currentDate >= new Date(res.startDate) &&
          currentDate <= new Date(res.endDate)
        ) {
          setStatus(true);
        } else {
          setStatus(false);
        }
        if (HHHHStaffId != undefined && HHHHStaffId != "") {
          EmployeeDetailsData();
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // EmployeeDetails List Data
  const EmployeeDetailsData = async () => {
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
    await web.lists
      .getById("a7b80424-e5e1-47c6-80a1-0ee44a70f92c")
      .items.getById(HHHHStaffId)
      .select(
        "FullName",
        "StaffID",
        "dateOfBirth",
        "WorkAddress",
        "WorkAddress",
        "WorkCity",
        "WorkZip",
        "Fedral_State",
        "Country",
        "SmartStateId",
        "SmartCountriesId"
      )//.expand("SmartState","SmartCountries")
      .get()
      .then((res: any) => {
        setState2(res);
        if (res.SmartStateId != undefined && res.SmartStateId != "") {
          smartStateId = res.SmartStateId
          SmartState();
        }
        if (res.SmartCountriesId != undefined && res.SmartCountriesId !=""){
          smartCountriesId = res.SmartCountriesId;
          SmartCountries();
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const SmartState = async () =>{
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/");
    await web.lists
      .getById("d1c6d7c3-f36e-4f95-8715-8da9f33622e7")
      .items.getById(smartStateId)
      .select("Title")
      .get()
      .then((res: any) => {
        setSmartState(res)
      })
      .catch((err) => {
        console.log(err.message);
      });
      
  };

  const SmartCountries = async () =>{
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/");
    await web.lists
      .getById("d1c6d7c3-f36e-4f95-8715-8da9f33622e7")
      .items.getById(smartCountriesId)
      .select("Title")
      .get()
      .then((res: any) => {
        setSmartCountries(res)
      })
      .catch((err) => {
        console.log(err.message);
      });
      
  };

  //const DOB = state2.dateOfBirth;
  React.useEffect(() => {
    ContractDatabaseData();
  }, []);

  return (
    <>
      <EditContractPopup
        props={state}
        props2={state2}
        call={ContractDatabaseData}
      />
      <div className="row d-flex">
          <div className="col">
            <table className="table table-bordered table-striped">
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
                  <td>
                    <Moment format="DD/MM/YYYY">{state2.dateOfBirth}</Moment>
                  </td>
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
                  <td>{state2.WorkZip}</td>
                </tr>
                <tr>
                  <th>Fedral State</th>
                  <td>{smartState.Title}</td>
                </tr>
                <tr>
                  <th>Country</th>
                  <td>{smartCountries.Title}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table table-bordered table-striped col">
              <tbody>
                <tr>
                  <th>Contract Id</th>
                  <td>{state.ContractId}</td>
                </tr>
                <tr>
                  <th>Start Date</th>
                  <td>
                    <Moment format="DD/MM/YYYY">{state.startDate}</Moment>
                  </td>
                </tr>
                <tr>
                  <th>End Date</th>
                  <td>
                    <Moment format="DD/MM/YYYY">{state.endDate}</Moment>
                  </td>
                </tr>
                <tr>
                  <th>Contract Signed</th>
                  <td>
                    <Moment format="DD/MM/YYYY">{state.ContractSigned}</Moment>
                  </td>
                </tr>
                <tr>
                  <th>Contract Changed</th>
                  <td>
                    <Moment format="DD/MM/YYYY">{state.ContractChanged}</Moment>
                  </td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{status ? "Active" : "Non active"}</td>
                </tr>
                <tr>
                  <th>Contract Type</th>
                  <td>{state.typeOfContract}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col">
            <table className="table table-bordered table-striped">
              <tbody>
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
              </tbody>
            </table>
          </div>
        </div>
      
    </>
  );
}