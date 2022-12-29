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

  // const [editState, setEditState] = React.useState({

  // })

  const [Title, setTitle] = React.useState(item.props.Title)
  const [startDate, setStartDate] = React.useState(item.props.newDate)
  const [endDate, setEndDate] = React.useState(item.props.endDate)
  const [ContractSigned, setContractSigned] = React.useState(item.props.ContractSigned)
  const [ContractChanged, setContractChanged] = React.useState(item.props.ContractChanged)
  const [GrossSalary, setGrossSalary] = React.useState(item.props.GrossSalary)
  const [HolidayEntitlement, setHolidayEntitlement] = React.useState(item.props.HolidayEntitlement)
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
        Data;
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
      <h2 style={{color:'blue'}}>Contract Management {item.props.contractNumber} - {item.props.Title}</h2>
      <div role={'button'} onClick={handleShow}>
      <img src='https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif'/>
      </div>
    </div>
    <Modal size='xl' show={show} onHide={handleClose}>
      <Modal.Header>
        
        <Modal.Title>Edit Contract - {item.props.Title}</Modal.Title>
        <div role={'button'} onClick={handleClose}>X</div>
      </Modal.Header>
      <Modal.Body>
        <div className="row d-flex">
          <div className='col form-group'>
            <label className='form-label'>Contract ID:</label><br/>
             <input className='form-control' type={'text'} defaultValue={item.props.ContractId} readOnly/>
          </div>
          <div className='col form-group'>
            <label className='form-label'>Contract Title:</label><br/>
            <input className='form-control' type={'text'} defaultValue={item.props.Title} onChange={(e)=>setTitle(e.target.value)} value={Title}/>
          </div>
          <div className='col form-group'>
            <label className='form-label'>Start Date:</label>
            <input className='form-control' type={'date'} defaultValue={item.StartDate} onChange={(e)=>setStartDate(e.target.value)} value={startDate}/>
          </div> 
          <div className='col form-group'>
            <label className='form-label'>End Date:</label>
            <input className='form-control' type={'date'} defaultValue={item.EndDate} onChange={(e)=>setEndDate(e.target.value)} value={endDate}/>
          </div>
          <div className='col form-group'>
            <label className='form-label'>Employee Name:</label> 
            <input className='form-control' type={'text'} defaultValue={item.props2.FullName} readOnly/>
          </div>
        </div>
        <div className='row'>
            <div className='col form-group'>
              <label className='form-label'>Contract Signed:</label>
              <input className='form-control' type={'date'} defaultValue={item.ContractSigned} onChange={(e)=>setContractSigned(e.target.value)} value={ContractSigned}/>
            </div>
            <div className='col form-group'>
              <label className='form-label'>Contract Changed:</label>
              <input className='form-control' type={'date'} defaultValue={item.ContractChanged} onChange={(e)=>setContractChanged(e.target.value)} value={ContractChanged}/>
            </div>
            <div className='col form-group'>
              <label className='form-label'>Gross Salary:</label>
              <input className='form-control' type={'text'} defaultValue={item.props.GrossSalary} onChange={(e)=>setGrossSalary(e.target.value)} value={GrossSalary}/>
            </div>
           <div className='col form-group'>
            <label className='form-label'>Contract Type:</label>
            <input className='form-control' type={'text'} defaultValue={item.props.typeOfContract} readOnly/>
            </div>
            <div className='col col-md-3 form-group'>
              <label className='form-label'>Weekly Working Hours:</label>
              <input className='form-control' type={'text'} defaultValue={item.props.WorkingHours}/>
            </div>
            <div className='col form-group'>
              <label className='form-label'>Holiday Entitlement:</label>
              <input  className='form-control' type={'number'} defaultValue={item.props.HolidayEntitlement} onChange={(e)=>setHolidayEntitlement(parseInt(e.target.value))} value={HolidayEntitlement}/>
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