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
  var siteType = "https://hhhhteams.sharepoint.com/sites/HHHH/SP";
  let listId = props.listId
  var itemId = props.taskId;
  var url = `${siteType}/_layouts/15/Versions.aspx?list=` + listId + "&ID=" + itemId; //list=${listId}&ID=${itemId}
  //------------------------jquery call--------------------------------
  const GetItemsVersionHistory = async () => {
   
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
        <img className="mx-1" title="Version History"
          src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Version_HG.png"
        />
      </span>
      <Panel
        onRenderHeader={onRenderCustomHeader}
        isOpen={show}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClose}>
        <div dangerouslySetInnerHTML={{ __html: data }}></div>
      <div className='float-end'>
        <span className='mx-4'><a href= {url}  target="_blank" data-interception="off"> Out of the box </a></span>
      <button className="float-end mb-2 btn btn-default" onClick={handleClose}>  Cancel </button>
      </div>
        
        
      </Panel>

    </>
  );
}