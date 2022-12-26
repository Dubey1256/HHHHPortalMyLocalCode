import * as React from "react";
import "./ContractSearch.module.scss";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useCallback, useEffect } from "react";
import { Web } from "sp-pnp-js";
import './createcontact.css'
import Table from 'react-bootstrap/Table';
import * as moment from 'moment';
import CreateContract from './CreateContract';
import ReactToPrint from "react-to-print";


const ContractData = () => {
  const componentLongRef = React.useRef();

  const [AllContacts, setAllContacts] = useState([]);
  const [AllContactsData, setAllContactsData] = useState([]);
  const [FilterLength, setFilterLength] = useState(0);

  const [AllContactsLength, setAllContactsLength] = useState(0);
  const [openCreateContract, setopenCreateContract] = useState(false);
  const [filterkey, setFilterkey] = useState({ searchAll: "", contractId: "", searchTitle: "", Employee: "", ContractType: "", StartDate: "", EndDate: "", contractStatus: "", ContractSigned: "", ContractChanged: "" })
  useEffect(() => {
    loadEmployeesDetails();

  }, [])

  const loadEmployeesDetails = async () => {
    var date = new Date();
    var currentdate = moment(date).format("DD/MM/YYYY");
    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
    await web.lists.getById('986680CE-5D69-47B4-947C-3998DDC3776C').items
      .select("Id,Title,ContractChanged,ContractId,ContractSigned,endDate,PersonnelNumber,contractNumber,typeOfContract,HolidayEntitlement,WorkingHours,GrossSalary,HHHHStaff/Title,HHHHStaff/FullName,HHHHStaff/Id,startDate,Attachments,Title,Created,Modified,typeOfContract,Editor/Name,Editor/Title,EmployeeID/Id,EmployeeID/Title,EmployeeID/Name,Author/Id,Author/Title,Author/Name,HHHHContactId").expand("Editor,Author,HHHHStaff,EmployeeID").top(4999).orderBy("Created", false)
      .get().then((Data: any[]) => {

        Data.map((item: any, index: number) => {
          // item["HHHHStaffTitle"]=item.HHHHStaff.Title;
          // console.log(item);
          if (item.HHHHStaff != undefined || item.HHHHStaff != "") {
            try {
              item.HHHHStaffTitle = item.HHHHStaff.FullName != undefined ? item.HHHHStaff.FullName : '';
            } catch (error) {
              console.log(error)
            }
          };
          if (item.startDate != null || item.startDate != undefined) {
            item.StartDate = moment(item.startDate).format("DD/MM/YYYY");
          };
          if (item.endDate != null || item.endDate != undefined) {
            item.EndDate = moment(item.endDate).format("DD/MM/YYYY");
          };
          if (item.StartDate != undefined && item.StartDate != null || item.EndDate != undefined && item.EndDate != null || item.EndDate == undefined && item.EndDate == null) {

            if (item.StartDate < item.EndDate && item.EndDate > currentdate) {
              item.contractStatus = "Active";
            }
            else if (item.EndDate == undefined && item.EndDate == null) {
              item.contractStatus = "";
            }
            else {
              item.contractStatus = " non active";
            }
          };
          setAllContactsLength(Data.length);
          setFilterLength(Data.length);
        });
        setAllContactsData(Data);
        setAllContacts(Data)
        console.log(AllContacts);
        console.log(Data[0].HHHHStaff.Title);

      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const filterData = (e: any, item: any) => {
    var key = e.target.value.toLowerCase();

    if (item == "searchAll" && key.length != 0) {
      setFilterkey({ ...filterkey, searchAll: key });
      const filterAll: any = AllContacts.filter((items: any) =>
        items.Title?.toLowerCase().includes(key)
      )
      setFilterLength(filterAll.length);
      setAllContacts(filterAll);
    } else if (key.length == 0 && item == "searchAll") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, searchAll: "" });
    }
    else if (item == "contractId" && key.length != 0) {
      setFilterkey({ ...filterkey, contractId: key });
      const filtercontractId: any = AllContacts.filter((items: any) =>
        items.ContractId?.toLowerCase().includes(key)
      )
      setFilterLength(filtercontractId.length);
      setAllContacts(filtercontractId);
    } else if (key.length == 0 && item == "contractId") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, contractId: "" });
    }
    else if (item == "searchTitle" && key.length != 0) {
      setFilterkey({ ...filterkey, searchTitle: key });
      const filterAll: any = AllContacts.filter((items: any) =>
        items.Title?.toLowerCase().includes(key)
      )
      setFilterLength(filterAll.length);
      setAllContacts(filterAll);
    } else if (key.length == 0 && item == "searchTitle") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, searchTitle: "" });
    }
    else if (item == "Employee" && key.length != 0) {
      setFilterkey({ ...filterkey, Employee: key });
      const filterEmployee: any = AllContacts.filter((items: any) =>
        items.HHHHStaffTitle?.toLowerCase().includes(key)
      )
      setFilterLength(filterEmployee.length);
      setAllContacts(filterEmployee);
    } else if (key.length == 0 && item == "Employee") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, Employee: "" });
    }
    else if (item == "ContractType" && key.length != 0) {
      setFilterkey({ ...filterkey, ContractType: key });
      const filtercontractType: any = AllContacts.filter((items: any) =>
        items.typeOfContract?.toLowerCase().includes(key)
      )
      setFilterLength(filtercontractType.length);
      setAllContacts(filtercontractType);
    } else if (key.length == 0 && item == "ContractType") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, ContractType: "" });
    }
    else if (item == "StartDate" && key.length != 0) {
      setFilterkey({ ...filterkey, StartDate: key });
      const filterStartDate: any = AllContacts.filter((items: any) =>
        items.StartDate?.toLowerCase().includes(key)
      )
      setFilterLength(filterStartDate.length);
      setAllContacts(filterStartDate);
    } else if (key.length == 0 && item == "StartDate") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, StartDate: "" });
    }
    else if (item == "EndDate" && key.length != 0) {
      setFilterkey({ ...filterkey, EndDate: key });
      const filterEndDate: any = AllContacts.filter((items: any) =>
        items.EndDate?.toLowerCase().includes(key)
      )
      setFilterLength(filterEndDate.length);
      setAllContacts(filterEndDate);
    } else if (key.length == 0 && item == "EndDate") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, EndDate: "" });
    }
    else if (item == "contractStatus" && key.length != 0) {
      setFilterkey({ ...filterkey, contractStatus: key });
      const filtercontractStatus: any = AllContacts.filter((items: any) =>
        items.contractStatus?.toLowerCase().includes(key)
      )
      setFilterLength(filtercontractStatus.length);
      setAllContacts(filtercontractStatus);
    } else if (key.length == 0 && item == "contractStatus") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, contractStatus: "" });
    }
    else if (item == "ContractSigned" && key.length != 0) {
      setFilterkey({ ...filterkey, ContractSigned: key });
      const filterContractSigned: any = AllContacts.filter((items: any) =>
        items.ContractSigned?.toLowerCase().includes(key)
      )
      setFilterLength(filterContractSigned.length);
      setAllContacts(filterContractSigned);
    } else if (key.length == 0 && item == "ContractSigned") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, ContractSigned: "" });
    }
    else if (item == "ContractChanged" && key.length != 0) {
      setFilterkey({ ...filterkey, ContractChanged: key });
      const filterContractChanged: any = AllContacts.filter((items: any) =>
        items.ContractChanged?.toLowerCase().includes(key)
      )
      setFilterLength(filterContractChanged.length);
      setAllContacts(filterContractChanged);
    } else if (key.length == 0 && item == "ContractChanged") {
      setAllContacts(AllContactsData);
      setFilterLength(AllContactsLength);
      setFilterkey({ ...filterkey, ContractChanged: "" });
    }


  }
  const openPopup = () => {
    setopenCreateContract(true);
  }
  const Callback = useCallback(() => {
    loadEmployeesDetails();
    setopenCreateContract(false);
  }, [openCreateContract]);
  const clearAll = () => {
    setFilterkey({ ...filterkey, searchAll: "", contractId: "", searchTitle: "", Employee: "", ContractType: "", StartDate: "", EndDate: "", contractStatus: "", ContractSigned: "", ContractChanged: "" });
    // loadEmployeesDetails();
    setAllContacts(AllContactsData);
    console.log(filterkey);
  }





  return (
    <div >
      <div
        id="PageInformation"
        ng-if="PageInformation!=undefined"
        className="ng-scope">

        <div className="col-sm-12 padL-0 PadR0">
          <h2 className="alignmentitle ng-binding">
            Contracts-Search
            <span className="icontype display_hide padLR">
              <a
                className="hreflink"
                title="Contracts-Search"
                data-toggle="modal"
                ng-click="Openeditpagepopup(PageInformation)"
              >
                <img
                  className="img-focus"
                  src="/_layouts/images/edititem.gif"
                  data-themekey="#"
                ></img>
              </a>
            </span>
          </h2>
        </div>
      </div>
      <Table striped bordered hover size="sm">
        <thead className="headertable3" >
          <tr >
            <th style={{ width: "10%" }}> <label>Showing {FilterLength} of {AllContactsLength}
              Contracts</label>
            </th>
            <th colSpan={6} style={{ width: "9%" }}> <input type="text" value={filterkey.searchAll} placeholder=" Search All" onChange={(e) => filterData(e, "searchAll")} /></th>
            {/* <th  style={{width:"10%"}}></th>
            <th style={{width:"10%"}}></th>
            <th style={{width:"10%"}}></th> */}
            <th colSpan={3} style={{ width: "12%" }}>
              <button type="button" className="btn btn-primary btn-sm" ng-click="editContractItem(item,'add')" onClick={openPopup}>
                Create Contract
              </button>&nbsp;
              <span><button type="button" onClick={clearAll}> clear all</button></span>&nbsp;
              <span><a><img src="https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/small_excel.png"></img></a>
                
              </span>&nbsp;
              <ReactToPrint
                trigger={() => <span><button type="button" > print</button></span>}
                content={() => componentLongRef.current}
              />
              <span><button type="button"> customize</button></span>
            </th>
          </tr>

        </thead>
        
        <thead>
          <tr>
            <th style={{ width: "10%" }}><input type="text" placeholder="Contract ID" value={filterkey.contractId} onChange={(e) => filterData(e, "contractId")}></input></th>
            <th style={{ width: "10%" }}><input type="text" placeholder="Title" value={filterkey.searchTitle} onChange={(e) => filterData(e, "searchTitle")}></input></th>
            <th style={{ width: "10%" }}><input type="text" placeholder="Employee" value={filterkey.Employee} onChange={(e) => filterData(e, "Employee")}></input></th>
            <th style={{ width: "10%" }}><input type="text" placeholder="Contract type" value={filterkey.ContractType} onChange={(e) => filterData(e, "ContractType")}></input></th>
            <th style={{ width: "10%" }}><input type="text" placeholder="StartDate" value={filterkey.StartDate} onChange={(e) => filterData(e, "StartDate")}></input></th>
            <th style={{ width: "10%" }}><input type="text" placeholder="EndDate" value={filterkey.EndDate} onChange={(e) => filterData(e, "EndDate")}></input></th>
            <th style={{ width: "10%" }}><input type="text" placeholder="Contract Status" value={filterkey.contractStatus} onChange={(e) => filterData(e, "contractStatus")}></input></th>
            <th style={{ width: "10%" }}><input type="text" placeholder="Contract Signed" value={filterkey.ContractSigned} onChange={(e) => filterData(e, "ContractSigned")}></input></th>
            <th style={{ width: "10%" }}><input type="text" placeholder="Contract Changed" value={filterkey.ContractChanged} onChange={(e) => filterData(e, "ContractChanged")}></input></th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody ref={componentLongRef}>
          {
            AllContacts.map((item: any, index: any) => {
              return (
                <tr key={index}>
                  <td>{item.ContractId}</td>
                  <td><a href={`https://hhhhteams.sharepoint.com/sites/HHHH/HR/SitePages/Contract-Profile.aspx?contractId=${item.Id}`} target="_blank">{item.Title}</a></td>
                  <td>{item.HHHHStaffTitle}</td>
                  <td>{item.typeOfContract}</td>
                  <td>{item.startDate != null ? moment(item.startDate).format("DD/MM/YYYY") : ""}</td>
                  <td>{item.endDate != null ? moment(item.endDate).format("DD/MM/YYYY") : ""}</td>
                  <td>{item.contractStatus}</td>
                  <td>{item.ContractSigned != null ? moment(item.ContractSigned).format("DD/MM/YYYY") : ""}</td>
                  <td>{item.ContractChanged != null ? moment(item.ContractChanged).format("DD/MM/YYYY") : ""}</td>
                  <td>
                  <a ><img src="/_layouts/images/edititem.gif"/></a>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
      {openCreateContract == true ? <CreateContract openCreateContract={openCreateContract} callback={Callback} prop={true} /> : null}
    </div>
  );
};
export default ContractData;
