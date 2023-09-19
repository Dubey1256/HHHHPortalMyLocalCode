import * as React from 'react'
import './VersionHistory.scss'
import * as  $ from 'jquery';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../Tooltip';

export default function VersionHistoryPopup(props: any) {
  const [propdata, setpropData] = React.useState(props);
  const [show, setShow] = React.useState(false);
  const [data, setData]: any = React.useState([])
  var tableCode
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //------------------------jquery call--------------------------------
  const GetItemsVersionHistory = async () => {
    var siteTypeUrl = props.siteUrls;
    let listId = props.listId
    var itemId = props.taskId;
    var url = `${siteTypeUrl}/_layouts/15/Versions.aspx?list=` + listId + "&ID=" + itemId; //list=${listId}&ID=${itemId}
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

  const onRenderCustomHeader = () => {
    return (
      <>
        <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '15px' }}>
          Version History
        </div>
        <Tooltip />
      </>
    );
  };

  return (
    <>
      <span className='siteColor mx-1' onClick={handleShow}>
        Version History
      </span>
      <Panel
        onRenderHeader={onRenderCustomHeader}
        isOpen={show}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClose}>
        <div dangerouslySetInnerHTML={{ __html: data }}></div>
        <button className="float-end mb-2 btn btn-default" onClick={handleClose}>
          Cancel
        </button>
      </Panel>

    </>
  );
}