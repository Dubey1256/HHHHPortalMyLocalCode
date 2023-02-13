import * as React from 'react'
import { Button, Modal, Table } from 'react-bootstrap';
import './VersionHistoryPopup.css'
import * as  $ from 'jquery';
import { FontSizes, Panel, PanelType } from 'office-ui-fabric-react';

export default function VersionHistoryPopup(props: any) {
  const [propdata, setpropData] = React.useState(props);
  const [show, setShow] = React.useState(false);
  const [data, setData]: any = React.useState([])
  var tableCode
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //------------------------jquery call--------------------------------
  const GetItemsVersionHistory = async () => {
    var siteType = "https://hhhhteams.sharepoint.com/sites/HHHH/SP";
    let listId = props.listId
    var itemId = props.taskId;
    var url = `${siteType}/_layouts/15/Versions.aspx?list=` + listId + "&ID=" + itemId; //list=${listId}&ID=${itemId}
    await $.ajax({
      url: url,
      method: "GET",
      headers: { "Accept": "application/json; odata=verbose" },
      success: function (res) {
        var tableHtml: any = $(res).find("table.ms-settingsframe")[0]?.outerHTML;
        setData(tableHtml)
      },
      error: function (error) {
        console.log(JSON.stringify(error));
      }
    });
  }
  //---------------------------------------------------------------------

  React.useEffect(() => {
    GetItemsVersionHistory()
  }, [show]);

  return (
    <>
     <span>Version History</span> <a style={{ color: 'blue', fontSize: 13, cursor: 'pointer' }} onClick={handleShow}>
        <img className="hreflink" title="Version History"
          src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Version_HG.png"
        />
      </a>

      <Panel headerText="Version History" 
        isOpen={show}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClose}>
          <div  dangerouslySetInnerHTML={{ __html: data }}></div>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
      </Panel>
          {/* <Modal size='lg' show={show} onHide={handleClose}>
          <Modal.Header >
            <Modal.Title className='modal-title'>Version History</Modal.Title>
            <div role={'button'} onClick={handleClose}>&#10006;</div>
          </Modal.Header>
          <Modal.Body>
            <div className="table_scroll" dangerouslySetInnerHTML={{ __html: data}}></div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal> */}
      </>
  );
}