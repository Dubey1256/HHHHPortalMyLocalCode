import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { Web } from 'sp-pnp-js';
export default function DeleteSmartMetadataOpenPopup(props: any) {
    let DeleteItemCallBack: any = props.DeleteItemCallBack
    let smartMetadataItem: any = props.modalInstance;
    let AllMetadataChilds: any = props?.modalInstance?.subRows
    const closeDeleteSmartMetaPopup = () => {
        props.CloseDeleteSmartMetaPopup();
    }
    const deleteTypeSmartmetadta = (item: any) => {

    }
    const deleteSmartMetadata = async (item: any) => {
        var flag = confirm(`Are you sure, you want to delete this id?`)
        if (flag === true) {
            let web = new Web(props.AllList.SPSitesListUrl);
            web.lists.getById(props.AllList.SPSmartMetadataListID).items.getById(item.Id).recycle().then((response: any) => {
                console.log("delete successful")
                if (response) {
                    DeleteItemCallBack(props.AllMetadata, '', smartMetadataItem.TaxType);
                    closeDeleteSmartMetaPopup();
                }
            }).catch((error: any) => {
                console.error(error);
            });
        }
    }
    const onRenderCustomHeaderDocuments = () => {
        return (
            <>
                <div className='subheading siteColor'>
                    Delete SmartMetadata - {smartMetadataItem.Title}
                </div>
            </>
        );
    };
    return (
        <>
            <div>
                <Panel
                    title="popup-title"
                    isOpen={true}
                    onDismiss={closeDeleteSmartMetaPopup}
                    type={PanelType.custom}
                    isBlocking={false}
                    onRenderHeader={onRenderCustomHeaderDocuments}
                    customWidth="750px"
                >
                    <div className="modal-body bg-f5f5 bdrbox clearfix">
                        <div className="col-sm-12">
                            {AllMetadataChilds ? (
                                <div className="col-sm-12 padL-0">
                                    <h3 className="f-15 mt-5">Item tagged with {smartMetadataItem.Title}</h3>
                                </div>
                            ) : ''}
                            {AllMetadataChilds === undefined ? (
                                <div className="col-sm-12 padL-0">
                                    <h3 className="f-15 mt-0">No items tagged. Proceed with deleting.</h3>
                                </div>
                            ) : ''}
                            <div>
                                {AllMetadataChilds && (
                                    <div className="col-md-12 mb-10">
                                        <div className="panel panel-default">
                                            <div className="panel-heading backgrnd_clrwhite">
                                                <h3 className="panel-title">
                                                    <span> All Tagged Childs</span>
                                                </h3>
                                            </div>
                                            <div className="panel-body">
                                                <div className="form-group">
                                                    <div id="table-wrapper">
                                                        <div id="table-scroll">
                                                            <table className="table">
                                                                <tbody>
                                                                    {AllMetadataChilds.map((item: any) => (
                                                                        <tr>
                                                                            <td className="pad8">
                                                                                <span style={{ cursor: 'pointer' }}>{item.Title}</span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='applyLeavePopup'>
                        <div className="modal-footer border-0 px-0">
                            <button className='btnCol btn btn-primary mx-2 mt-0' onClick={() => deleteTypeSmartmetadta(smartMetadataItem)}> Archive and Delete </button>
                            <button className='btnCol btn btn-primary mx-2 mt-0' onClick={() => deleteSmartMetadata(smartMetadataItem)}> Delete </button>
                            <button className='btn btn-default m-0' onClick={() => closeDeleteSmartMetaPopup()}> Cancel</button>
                        </div>
                    </div>
                </Panel>
            </div>
        </>
    );
}