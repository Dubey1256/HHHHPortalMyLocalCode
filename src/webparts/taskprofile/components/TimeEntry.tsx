
import React, { useState,useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TimeEntryPopup from '../../../globalComponents/EditTaskPopup/TimeEntryComponent';



function TimeEntry(props:any) {
    const [show, setShow] = useState(props.isopen);
     const [ smartTime,setSmartTime]=useState("");
    const handleClose = () => {
      setShow(false);
     props. CallBackTimesheet();

    }
    console.log(smartTime);
    const callaback=useCallback((item)=>{
      setSmartTime(item);
    },[])
  
    return (
      <>
       <Modal
        size="lg"
          show={props.isopen}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>All Time Entry -{props.props.Title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
       <TimeEntryPopup props={props.props}callaback={callaback}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" >
            OK
            </Button>
            <Button variant="secondary"onClick={handleClose}> Cancel</Button>
          </Modal.Footer>
        </Modal>
      </>
    )
}
export default TimeEntry;