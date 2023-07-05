import * as moment from 'moment';
import * as React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Web } from 'sp-pnp-js';
import { useEffect, useState } from 'react';
// import { Container, Row } from 'react-bootstrap';


const EditContractPopup= (props:any)=> {
  console.log("contravtId========",props)
  const [show, setShow] = React.useState(false);
  const [ContractData, setContractData] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [formData, setFormData] = useState({  Title:'',  startDate:'',  endDate:'',  ContractSigned:'',
   ContractChanged:'',   GrossSalary:'',   HolidayEntitlement:'',   ContractId:'',   typeOfContract:''
})
  // let callBack :any = item.call;
  const LoadContract = async () => {
    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
    await web.lists.getById('986680CE-5D69-47B4-947C-3998DDC3776C').items.select("Id,Title,WorkingHours,Author/Id,Author/Title,ContractChanged,ContractSigned,endDate,ContractId,PersonnelNumber,HHHHStaff/Title,HHHHStaff/Id,contractNumber,typeOfContract,HolidayEntitlement,GrossSalary,startDate,Attachments,Title,Created,Modified,Editor/Name,Editor/Title,EmployeeID/Id").expand("HHHHStaff,Author,Editor,EmployeeID").filter("Id eq " + props.props).get()
        .then((data:any) => {
            console.log(data);
            setContractData(data[0]);
            setFormData(data[0])
        })
        .catch((err) => {
            console.log(err.message);
        });
}

useEffect(() => {
  LoadContract();
}, []);

  const UpdateData = async () => {
    
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
    await web.lists.getById('986680ce-5d69-47b4-947c-3998ddc3776c').items
    .getById(props.props).update({
        ContractId:formData.ContractId,
        Title:formData.Title,
        startDate:formData.startDate,
        endDate:formData.endDate,
        ContractSigned:formData.ContractSigned,
        ContractChanged:formData.ContractChanged,
        GrossSalary:formData.GrossSalary,
        typeOfContract:formData.typeOfContract,
        HolidayEntitlement:formData.HolidayEntitlement,
      })
      .then((Data:any)=>{
        Data;
      })
      .catch((err)=>{
        console.log(err.message);
      })
      handleClose();
    }

    const handleChange=(e: any, name: any) => {
      setFormData({
          ...formData,
          [name]: e.target.value
      })
  }

  return (
    <>
    <div style={{display:'flex'}}>
      <div role={'button'} onClick={handleShow}>
      <img src='https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif'/>
      </div>
    </div>
    <Modal size='xl' show={show} onHide={handleClose}>
      <Modal.Header>
        
       {ContractData&& <Modal.Title>Edit Contract - {ContractData.Title}</Modal.Title>}
        <div role={'button'} onClick={handleClose}>X</div>
      </Modal.Header>
      <Modal.Body>
     {ContractData&&<><div className="row d-flex">
            <div className='col form-group'>
              <label className='form-label'>Contract ID:</label><br />
              <input className='form-control' type={'text'} defaultValue={ContractData.ContractId} readOnly />
            </div>
            <div className='col form-group'>
              <label className='form-label'>Contract Title:</label><br />
              <input className='form-control' type={'text'} defaultValue={ContractData.Title} onChange={(e) => handleChange(e, 'Title')} />
            </div>
            <div className='col form-group'>
              <label className='form-label'>Start Date:</label>
              <input className='form-control' type={'date'} defaultValue={ContractData.startDate} onChange={(e) => handleChange(e, 'startDate')} />
            </div>
            <div className='col form-group'>
              <label className='form-label'>End Date:</label>
              <input className='form-control' type={'date'} defaultValue={ContractData.endDate} onChange={(e) => handleChange(e, 'endDate')} />
            </div>
            <div className='col form-group'>
              <label className='form-label'>Employee Name:</label>
              <input className='form-control' type={'text'} defaultValue={ContractData.FullName} readOnly />
            </div>
          </div><div className='row'>
              <div className='col form-group'>
                <label className='form-label'>Contract Signed:</label>
                <input className='form-control' type={'date'} defaultValue={ContractData.ContractSigned} onChange={(e) => handleChange(e, 'ContractSigned')} />
              </div>
              <div className='col form-group'>
                <label className='form-label'>Contract Changed:</label>
                <input className='form-control' type={'date'} defaultValue={ContractData.ContractChanged} onChange={(e) => handleChange(e, 'ContractChanged')} />
              </div>
              <div className='col form-group'>
                <label className='form-label'>Gross Salary:</label>
                <input className='form-control' type={'text'} defaultValue={ContractData.GrossSalary} onChange={(e) => handleChange(e, 'GrossSalary')} />
              </div>
              <div className='col form-group'>
                <label className='form-label'>Contract Type:</label>
                <input className='form-control' type={'text'} defaultValue={ContractData.typeOfContract} readOnly />
              </div>
              <div className='col col-md-3 form-group'>
                <label className='form-label'>Weekly Working Hours:</label>
                <input className='form-control' type={'text'} defaultValue={ContractData.WorkingHours} onChange={(e) => handleChange(e, 'WorkingHours')} />
              </div>
              <div className='col form-group'>
                <label className='form-label'>Holiday Entitlement:</label>
                <input className='form-control' type={'number'} defaultValue={ContractData.HolidayEntitlement} onChange={(e) => handleChange(e, 'HolidayEntitlement')} />
              </div>
            </div></>}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={UpdateData}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default EditContractPopup;