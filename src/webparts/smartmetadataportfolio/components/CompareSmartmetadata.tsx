import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
export default function CompareSmartMetaData(Props: any) {
    const [isShowCompare, setIsShowCompare]: any = React.useState(false);
    const closeComparepopup = () => {
        setIsShowCompare(false);
    }
    const onRenderCustomHeaderDocuments = () => {
        return (
            <>
                <div className='subheading siteColor'>
                    Compare SmartMetadata
                </div>
            </>
        );
    };
    return (
        <>
            <div>
                <button type="button" title="Compare" className="btn btn-primary">Compare</button>
            </div>
            {isShowCompare ? (<div>
                <Panel
                    title="popup-title"
                    isOpen={true}
                    onDismiss={closeComparepopup}
                    type={PanelType.custom}
                    isBlocking={false}
                    onRenderHeader={onRenderCustomHeaderDocuments}
                    customWidth="750px"
                >
                    <div className="modal-body">
                        <div className="col-sm-12 tab-content bdrbox">
                            <div className="divPanelBody mt-10 mb-10  col-sm-12 padL-0 PadR0" id="#CopyJSON">
                            </div>
                        </div>
                    </div>
                    <div className='applyLeavePopup'>
                        <div className="modal-footer border-0 px-0">
                            <button className='btnCol btn btn-primary mx-2 mt-0' >
                            </button>
                            <button className='btn btn-default m-0' onClick={() => closeComparepopup()}> Cancel</button>
                        </div>
                    </div>
                </Panel>
            </div>) : ''}
        </>
    );
}