import * as moment from 'moment';
import * as React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Web } from 'sp-pnp-js';
// import { Container, Row } from 'react-bootstrap';


function EditContractPopup(item: any) {
  let callBack :any = item.call;
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [editState, setEditState] = React.useState({
    Title: item.props.Title,
    startDate: item.props.startDate,
  })

  const [Title, setTitle] = React.useState(item.props.Title)
  const [startDate, setStartDate] = React.useState(item.props.newDate)
  const [endDate, setEndDate] = React.useState(item.props.endDate)
  const [ContractSigned, setContractSigned] = React.useState(item.props.ContractSigned)
  const [ContractChanged, setContractChanged] = React.useState(item.props.ContractChanged)
  const [GrossSalary, setGrossSalary] = React.useState(item.props.GrossSalary)
  const [HolidayEntitlement, setHolidayEntitlement] = React.useState(item.props.HolidayEntitlement)
    // const [ContractId, setContractId] = React.useState(item.props.ContractId)
  const ContractId = item.props.ContractId;
  const typeOfContract = item.props.typeOfContract

   item.StartDate = moment(item.props.startDate).format("YYYY-MM-DD")
   item.EndDate = moment(item.props.endDate).format("YYYY-MM-DD")
   item.ContractChanged = moment(item.props.ContractChanged).format("YYYY-MM-DD")
   item.ContractSigned = moment(item.props.ContractSigned).format("YYYY-MM-DD")


  const UpdateData = async () => {
    
    const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
    await web.lists.getById('986680ce-5d69-47b4-947c-3998ddc3776c').items
    .getById(item.props.ID).update({
        ContractId: ContractId,
        Title: Title,
        startDate: startDate,
        endDate: endDate,
        ContractSigned: ContractSigned,
        ContractChanged: ContractChanged,
        GrossSalary: GrossSalary,
        typeOfContract: typeOfContract,
        HolidayEntitlement: HolidayEntitlement,
      })
      .then((Data:any)=>{
        alert('Updated Successfully')
      })
      .catch((err)=>{
        console.log(err.message);
      })
      callBack();
      handleClose();
    }

  return (
    <>
    <div style={{display:'flex'}}>
    <h1 style={{color:'blue'}}>Contract Management {item.props.contractNumber} - {item.props.Title}</h1>
    <Button onClick={handleShow}>
    <img src='https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif'/>
    </Button>
    </div>
    <Modal size='xl' show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Contract - {item.props.Title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-sm-12 row">
          <div className='col-sm-2 form-group'>
            <label>Contract ID:</label><br/>
             <input type={'text'} defaultValue={item.props.ContractId} readOnly/>
          </div>
          <div className='col-sm-4 form-group'>
            <label>Contract Title:</label><br/>
            <input type={'text'} defaultValue={item.props.Title} onChange={(e)=>setTitle(e.target.value)} value={Title}/>
          </div>
          <div className='col-sm-2 form-group'>
            <label>Start Date:</label>
            <input type={'date'} defaultValue={item.StartDate} onChange={(e)=>setStartDate(e.target.value)} value={startDate}/>
          </div>
          <div className='col-sm-2 form-group'>
            <label>End Date:</label>
            <input type={'date'} defaultValue={item.EndDate} onChange={(e)=>setEndDate(e.target.value)} value={endDate}/>
          </div>
          <div className='col-sm-2 form-group'>
            <label>Employee Name:</label> 
            <input type={'text'} defaultValue={item.props2.FullName} readOnly/>
          </div>
        </div>
        <div className='col-sm-12 row'>
            <div className='col-sm-2 form-group'>
              <label>Contract Signed:</label>
              <input type={'date'} defaultValue={item.ContractSigned} onChange={(e)=>setContractSigned(e.target.value)} value={ContractSigned}/>
            </div>
            <div className='col-sm-2 form-group'>
              <label>Contract Changed:</label>
              <input type={'date'} defaultValue={item.ContractChanged} onChange={(e)=>setContractChanged(e.target.value)} value={ContractChanged}/>
            </div>
            <div className='col-sm-2 form-group'>
              <label>Gross Salary:</label>
              <input type={'text'} defaultValue={item.props.GrossSalary} onChange={(e)=>setGrossSalary(e.target.value)} value={GrossSalary}/>
            </div>
           <div className='col-sm-2 form-group'>
            <label>Contract Type:</label>
            <input type={'text'} defaultValue={item.props.typeOfContract} readOnly/>
            </div>
            <div className='col-sm-2 form-group'>
              <label>Weekly Working Hours:</label>
              <input type={'text'} defaultValue={item.props.WorkingHours}/>
            </div>
            <div className='col-sm-2 form-group'>
              <label>Holiday Entitlement:</label>
              <input type={'number'} defaultValue={item.props.HolidayEntitlement} onChange={(e)=>setHolidayEntitlement(parseInt(e.target.value))} value={HolidayEntitlement}/>
            </div>
        </div>
        
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