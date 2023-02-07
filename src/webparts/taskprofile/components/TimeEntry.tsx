import React, { useState } from "react";
import Button from "react-bootstrap/Button";

import TimeEntryPopup from "../../../globalComponents/EditTaskPopup/TimeEntryComponent";
import { arraysEqual, Modal, PanelType, Panel } from "office-ui-fabric-react";
function TimeEntry(props: any) {
  const [show, setShow] = useState(props.isopen);
  const handleClose = () => {
    setShow(false);
    props.CallBackTimesheet();
  };
  return (
    <>
      <Panel
        headerText={`All Time Entry -${props.props.Title}`}
        isOpen={props.isopen}
        onDismiss={handleClose}
        isBlocking={false}
        type={PanelType.large}
      >
        <div className="modal-body">
          <TimeEntryPopup props={props.props} />
        </div>
        <footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
          <Button variant="btn btn-default ms-2" onClick={handleClose}>
            Cancel
          </Button>
        </footer>
      </Panel>
    </>
  );
}
export default TimeEntry;
