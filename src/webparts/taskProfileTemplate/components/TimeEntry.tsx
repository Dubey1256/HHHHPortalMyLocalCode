import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Tooltip from '../../../globalComponents/Tooltip'
import TimeEntryPopup from "../../../globalComponents/EditTaskPopup/TimeEntryComponent";
import { arraysEqual, Modal, PanelType, Panel } from "office-ui-fabric-react";
function TimeEntry(props: any) {
  const [show, setShow] = useState(props.isopen);
  const handleClose = () => {
    setShow(false);
    props.CallBackTimesheet();

  };
  const onRenderCustomHeaderTimeEntry = () => {
    return (
      <>

        <div className='subheading siteColor' >
        {`All Time Entry -${props.data.Title}`}
        </div>
        <Tooltip ComponentId='1753' />
      </>
    );
  };
  return (
    <>
      <Panel
        onRenderHeader={onRenderCustomHeaderTimeEntry}
        isOpen={props.isopen}
        onDismiss={handleClose}
        isBlocking={false}
        type={PanelType.large}
      >
        <div className="modal-body">
          <TimeEntryPopup props={props.data} Context={props.context}context={props.context} />
        </div>
        <footer className="mt-3 text-end">
          <Button className="me-2" variant="primary" onClick={handleClose}>
              OK
            </Button>
          <Button variant="btn btn-default " onClick={handleClose}>
              Cancel
            </Button>
        </footer>
      </Panel>
    </>
  );
}
export default TimeEntry;
