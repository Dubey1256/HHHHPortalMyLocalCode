import * as React from 'react';
import { Panel, PanelType } from '@fluentui/react';

const ShowImagesOOTB = (props:any) => {
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  const openPanel = () => {
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
    <span className='d-flex float-end'>
      <span className='svg__iconbox svg__icon--folder mx-1'></span>
      <a onClick={openPanel}>Find in SP picture library</a>
      </span>
      <Panel 
        isOpen={isPanelOpen}
        type={PanelType.custom}
        customWidth="750px"
        onDismiss={closePanel}
        headerText="Images"
      >
        <div className='panel-body'>
        <iframe className='w-100' style={{height:"700px"}}
          title="Images"
          src={`${props?.Context?._pageContext?.web?.serverRelativeUrl}/PublishingImages/Forms/Thumbnails.aspx`}
        /></div>
      </Panel>
    </>
  );
};

export default ShowImagesOOTB;
