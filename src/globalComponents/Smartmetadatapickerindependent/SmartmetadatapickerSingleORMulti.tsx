import React, { useEffect, useState } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from 'sp-pnp-js';
import Tooltip from '../Tooltip';
// Usedfor "Single"  "Multi"

const Smartmetadatapickerin = (props: any) => {
  let usedfor = props?.usedFor;
  const [opensmartmetapopup, setopensmartmetapopup] = useState(true);
  const [allsmartmetdata, setAllSmartMetadata] = useState([]);
  const [selectedItems, setSelectedItems] = useState(props?.selectedFeaturedata != undefined && props?.selectedFeaturedata?.length > 0 ? props.selectedFeaturedata : []);
  useEffect(() => {
    getSmartmetadata();
  }, []);
  const Urls = props?.AllListId?.siteUrl;
  const getSmartmetadata = async () => {
    try {
      const web = new Web(Urls);
      const smartmetaDetails = await web.lists
        .getById(props?.AllListId?.SmartMetadataListID)
        .items.select(
          'ID,Title,IsVisible,ParentID,Parent/Id,Parent/Title,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable'
        )
        .expand('Parent')
        .top(4999)
        .get();

      console.log(smartmetaDetails);

      const filteredSmartMetadata = smartmetaDetails.filter(
        (item: any) => item.TaxType === props.TaxType
      );
      setAllSmartMetadata(filteredSmartMetadata);
    } catch (error) {
      console.error('Error fetching smart metadata:', error);
    }
  };

  const customHeader = () => (
    <>
      <div className="subheading">Select Feature Type</div>
      <Tooltip ComponentId="1741" />
    </>
  );

  const closePopupSmartPopup = () => {
    setopensmartmetapopup(false)
    props.Call("Close");
  }
  const saveselectctedData = () => {
    setopensmartmetapopup(false)
    props.Call(selectedItems);
  }
  const handleItemClick = (item: any) => {
    if (usedfor === "Single") {
      setSelectedItems([item]);
    }
    if (usedfor === "Multi") {
      setSelectedItems((prevSelectedItems: any) => [...prevSelectedItems, item]);
    }

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
      customWidth="375px"
      onDismiss={closePopupSmartPopup}
      isBlocking={false}
    >
      <div className='modal-body'>
        {selectedItems?.length > 0 ? (
          <div className="full-width">
            {selectedItems?.map((val: any) => (
              <>
                {val != undefined && val != '' && val?.Title != undefined && val?.Title != '' && <span className="block me-1" key={val?.Id}>
                  <span>{val?.Title}</span>
                  <span
                    className="bg-light hreflink ms-2 svg__icon--cross svg__iconbox"
                    onClick={() => deleteSelectedFeature(val)}
                  >
                  </span>
                </span>}</>
            ))}
          </div>
        ) : null}
        <div className='mt-3'>
          <ul className='categories-menu p-0  w-100'>
            {allsmartmetdata.map((item, index) => (
              <li key={index} onClick={() => handleItemClick(item)}>
                {item.Title}
              </li>
            ))}
          </ul></div></div>
      <footer className="fixed-bottom bg-f4 p-3 text-end">

        <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveselectctedData} >
          Save
        </button>
        <button type="button" className="btn btn-default" onClick={closePopupSmartPopup} >
          Cancel
        </button>
      </footer>
    </Panel>
  );
};

export default Smartmetadatapickerin;
