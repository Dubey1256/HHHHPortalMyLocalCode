import React, { useEffect, useState } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from 'sp-pnp-js';
import Tooltip from '../../Tooltip';

const Smartmetadatapickerin = (props:any) => {
  const [opensmartmetapopup, setopensmartmetapopup] = useState(true);
  const [allsmartmetdata, setAllSmartMetadata] = useState([]);
  const [selectedItems, setSelectedItems] = useState(props?.props[0] != undefined ? props?.props[0] :undefined);
  useEffect(() => {
    getSmartmetadata();
  }, []);
 const Urls = props.AllListId.siteUrl;
  const getSmartmetadata = async () => {
    try {
      const web = new Web(props.AllListId.siteUrl);
      const smartmetaDetails = await web.lists
        .getById(props.AllListId.SmartMetadataListID)
        .items.select(
          'ID,Title,IsVisible,ParentID,Parent/Id,Parent/Title,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable'
        )
        .expand('Parent')
        .top(4999)
        .get();

      console.log(smartmetaDetails);

      const filteredSmartMetadata = smartmetaDetails.filter(
        (item:any) => item.TaxType === 'Feature Type'
      );
      setAllSmartMetadata(filteredSmartMetadata);
    } catch (error) {
      console.error('Error fetching smart metadata:', error);
    }
  };

  const customHeader = () => (
    <div>
      <div className="subheading siteColor">Select Feature Type</div>
      <Tooltip ComponentId="1741" />
    </div>
  );

  const closePopupSmartPopup = (item:any) => {
    setopensmartmetapopup(false)
    props.Call("Close");
}
const saveselectctedData = () =>{
    setopensmartmetapopup(false)
    props.Call(selectedItems);
}
const handleItemClick = (item:any) => {
    setSelectedItems([item]); // Reset selectedItems with the clicked item
  };

//    delete 
const deleteSelectedFeature = (val: any) => {
    const updatedSelectedItems = selectedItems.filter((valuee: any) => val.Id !== valuee.Id);
    setSelectedItems(updatedSelectedItems);
  };
  
  return (
    <Panel
      onRenderHeader={customHeader}
      isOpen={opensmartmetapopup}
      type={PanelType.custom}
      customWidth="850px"
      onDismiss={() => setopensmartmetapopup(false)}
      isBlocking={opensmartmetapopup}
    >
       {selectedItems?.length > 0 ? (
        <div className="full-width">
          {selectedItems?.map((val: any) => (
            <span className="block me-1" key={val?.Id}>
              <span>{val?.Title}</span>
              <span
                className="bg-light hreflink ms-2 svg__icon--cross svg__iconbox"
                onClick={() => deleteSelectedFeature(val)}
              ></span>
            </span>
          ))}
        </div>
      ) : null}

      {allsmartmetdata.map((item, index) => (
        <div key={index} onClick={() => handleItemClick(item)}>
          {item.Title}
        </div>
      ))}
         <footer className= "fixed-bottom bg-f4 p-3">
                        <div className="alignCenter justify-content-between">
                            <div className="">
                                <div id="addNewTermDescription">
                                    <p className="mb-1"> New items are added under the currently selected item.
                                        <span><a className="hreflink" target="_blank" data-interception="off" href={`${Urls}/SitePages/SmartMetadata.aspx`} > Add New Item </a></span>
                                    </p>
                                </div>
                                <div id="SendFeedbackTr">
                                    <p className="mb-1">Make a request or send feedback to the Term Set manager.
                                        <span><a className="hreflink"> Send Feedback </a></span>
                                    </p>
                                </div>

                            </div>
                            <div className="pull-right">
                                <span>
                                    <a className="siteColor mx-1" target="_blank" data-interception="off" href={`${Urls}/SitePages/SmartMetadata.aspx`} >Manage Smart Taxonomy</a>
                                </span>
                                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveselectctedData} >
                                    Save
                                </button>
                                <button type="button" className="btn btn-default mx-1" onClick={closePopupSmartPopup} >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </footer>
    </Panel>
  );
};

export default Smartmetadatapickerin;
