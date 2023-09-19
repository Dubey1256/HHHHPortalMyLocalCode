import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { TiMessage } from 'react-icons/ti'
import { useState, useEffect } from 'react';


const ApprovalHistoryPopup = (ApprovalData: any) => {
    const [ApprovalPointUserData, setApprovalPointUserData] = useState<any>([]);
    const [ApprovalPointCurrentIndex, setApprovalPointCurrentIndex] = useState('');
    const [ApprovalPointHistoryStatus, setApprovalPointHistoryStatus] = useState(true);
    useEffect(() => {
        if (ApprovalData != undefined) {
            if (ApprovalData.ApprovalPointUserData != undefined) {
                setApprovalPointUserData(ApprovalData.ApprovalPointUserData)
            }
            if (ApprovalData.ApprovalPointCurrentIndex != undefined) {
                setApprovalPointCurrentIndex(ApprovalData.ApprovalPointCurrentIndex);
            }
            if (ApprovalData.ApprovalPointHistoryStatus != undefined) {
                setApprovalPointHistoryStatus(ApprovalData.ApprovalPointHistoryStatus);
            }
        }
    }, [])
    const ApprovalPointPopupClose = () => {
        setApprovalPointHistoryStatus(false)
        ApprovalData.callBack();
    }
    return (
        <div>
            <Panel
                headerText={`Approval History For Point - ${ApprovalData.currentArrayIndex != undefined || ApprovalData.currentArrayIndex != null ? ApprovalData.currentArrayIndex + 1 + "." : ''} ${ApprovalPointCurrentIndex + 1}`}
                isOpen={ApprovalPointHistoryStatus}
                onDismiss={ApprovalPointPopupClose}
                isBlocking={ApprovalPointHistoryStatus}
                type={PanelType.custom}
                customWidth="500px"
            >
                <div>
                    {ApprovalPointUserData != undefined || ApprovalPointUserData != null ?
                        <div className="modal-body py-2">
                            <div className="d-flex">
                                <span className="SubTestBorder p-1 me-1">{ApprovalPointCurrentIndex + 1}</span>
                                <div className="full-width border p-1">
                                    <div>
                                        {ApprovalPointUserData.ApproverData != undefined && ApprovalPointUserData.ApproverData.length > 0 ? ApprovalPointUserData.ApproverData.reverse().map((UserData: any, Index: any) => {
                                            return (
                                                <>
                                                    {UserData.isShowLight == "Approve" ?
                                                        <div className="d-flex full-width justify-content-between">
                                                            <div className="d-flex">
                                                                <span className="circlelight green br_green mx-1 mt-1"></span> Approved by-
                                                                <h6 className="siteColor">{UserData.Title != undefined ? UserData.Title : ""}</h6>
                                                            </div>
                                                            <div>
                                                                <span>{UserData.ApprovalDate != undefined ? UserData.ApprovalDate : ""}</span>
                                                                <span className="mx-1" style={{ fontSize: "15px", color: 'grey' }}><TiMessage style={{ color: 'grey' }} /></span>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                    {UserData.isShowLight == "Maybe" ?
                                                        <div className="d-flex full-width justify-content-between">
                                                            <div className="d-flex">
                                                                <span className="circlelight yellow br_yellow mx-1 mt-1"></span> Set to Maybe by-
                                                                <h6 className="siteColor">{UserData.Title != undefined ? UserData.Title : ""}</h6>
                                                            </div>
                                                            <div>
                                                                <span>{UserData.ApprovalDate != undefined ? UserData.ApprovalDate : ""}</span>
                                                                <span className="mx-1" style={{ fontSize: "15px", color: 'grey' }}><TiMessage style={{ color: 'grey' }} /></span>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                    {UserData.isShowLight == "Reject" ?
                                                        <div className="d-flex full-width justify-content-between">
                                                            <div className="d-flex">
                                                                <span className="circlelight red br_red mx-1 mt-1"></span> Rejected by-
                                                                <h6 className="siteColor">{UserData.Title != undefined ? UserData.Title : ""}</h6>
                                                            </div>
                                                            <div>
                                                                <span>{UserData.ApprovalDate != undefined ? UserData.ApprovalDate : ""}</span>
                                                                <span className="mx-1" style={{ fontSize: "15px", color: 'grey' }}><TiMessage style={{ color: 'grey' }} /></span>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                </>
                                            )
                                        }) : null}
                                    </div>
                                    <div>
                                        <div className="full-width">{ApprovalPointUserData.Comments != undefined && ApprovalPointUserData.Comments.length > 0 ? ApprovalPointUserData.Comments.map((CommentData: any, Index: any) => {
                                            return (
                                                <>
                                                    {CommentData.isShowLight == "Approve" ?
                                                        <div className="full-width FeedBack-comment">
                                                            <div className="d-flex full-width justify-content-between">
                                                                <div className="d-flex">
                                                                    <span className="circlelight green br_green mx-1 mt-1"></span> Approved by-
                                                                    <h6 className="siteColor">
                                                                        {CommentData.ApproverData != undefined  && CommentData.ApproverData.length > 0 ? CommentData.ApproverData[CommentData.ApproverData.length - 1].Title : ""}</h6>
                                                                </div>
                                                                <div>
                                                                    <span>{CommentData.ApproverData != undefined  && CommentData.ApproverData.length > 0 ? CommentData.ApproverData[CommentData.ApproverData.length - 1].ApproverData : ""}</span>
                                                                    <span className="mx-1" style={{ fontSize: "15px" }}><TiMessage /></span>
                                                                </div>
                                                            </div>

                                                            <div className={`d-flex ${CommentData.isShowLight}`} title={CommentData.isShowLight}>
                                                                <div className="">
                                                                    <img style={{ width: "40px", borderRadius: "50%", height: "40px", margin: "5px" }} src={CommentData.AuthorImage != undefined && CommentData.AuthorImage != '' ?
                                                                        CommentData.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                </div>
                                                                <div className="full-width" >
                                                                    <div className='d-flex justify-content-between align-items-center'>
                                                                        <span className="font-weight-normal">
                                                                            {CommentData.AuthorName} - {CommentData.Created}
                                                                        </span>
                                                                        <span>
                                                                            {/* onClick={() => clearComment(true, index, 0)} */}
                                                                            {/* <a className="ps-1" onClick={() => openEditModal(CommentData.Title, index, 0, false)}><img src={require('../../Assets/ICON/edit_page.svg')} width="25" /></a> */}
                                                                            {/* <a className="pe-2"><img src={require('../../Assets/ICON/cross.svg')} width="18"></img></a> */}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span dangerouslySetInnerHTML={{ __html: CommentData.Title }}></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                    {CommentData.isShowLight == "Maybe" ?
                                                        <div className="full-width FeedBack-comment">
                                                            <div className="d-flex full-width justify-content-between">
                                                                <div className="d-flex">
                                                                    <span className="circlelight yellow br_yellow mx-1 mt-1"></span> Set to Maybe by-
                                                                    <h6 className="siteColor">{CommentData.ApproverData[CommentData.ApproverData.length - 1].Title}</h6>
                                                                </div>
                                                                <div>
                                                                    <span>{CommentData.ApproverData[CommentData.ApproverData.length - 1].ApprovalDate}</span>
                                                                    <span className="mx-1" style={{ fontSize: "15px" }}><TiMessage /></span>
                                                                </div>
                                                            </div>

                                                            <div className={`d-flex ${CommentData.isShowLight}`} title={CommentData.isShowLight}>
                                                                <div className="">
                                                                    <img style={{ width: "40px", borderRadius: "50%", height: "40px", margin: "5px" }} src={CommentData.AuthorImage != undefined && CommentData.AuthorImage != '' ?
                                                                        CommentData.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                </div>
                                                                <div className="full-width" >
                                                                    <div className='d-flex justify-content-between align-items-center'>
                                                                        <span className="font-weight-normal">
                                                                            {CommentData.AuthorName} - {CommentData.Created}
                                                                        </span>
                                                                        <span>
                                                                            {/* onClick={() => clearComment(true, index, 0)} */}
                                                                            {/* <a className="ps-1" onClick={() => openEditModal(CommentData.Title, index, 0, false)}><img src={require('../../Assets/ICON/edit_page.svg')} width="25" /></a> */}
                                                                            {/* <a className="pe-2"><img src={require('../../Assets/ICON/cross.svg')} width="18"></img></a> */}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span dangerouslySetInnerHTML={{ __html: CommentData.Title }}></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                    {CommentData.isShowLight == "Reject" ?
                                                        <div className="full-width FeedBack-comment">
                                                            <div className="d-flex full-width justify-content-between">
                                                                <div className="d-flex">
                                                                    <span className="circlelight red br_red mx-1 mt-1"></span> Rejected by-
                                                                    <h6 className="siteColor">{CommentData.ApproverData[CommentData.ApproverData.length - 1].Title}</h6>
                                                                </div>
                                                                <div>
                                                                    <span>{CommentData.ApproverData[CommentData.ApproverData.length - 1].ApprovalDate}</span>
                                                                    <span className="mx-1" style={{ fontSize: "15px" }}><TiMessage /></span>
                                                                </div>
                                                            </div>

                                                            <div className={`d-flex ${CommentData.isShowLight}`} title={CommentData.isShowLight}>
                                                                <div className="">
                                                                    <img style={{ width: "40px", borderRadius: "50%", height: "40px", margin: "5px" }} src={CommentData.AuthorImage != undefined && CommentData.AuthorImage != '' ?
                                                                        CommentData.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                                                </div>
                                                                <div className="full-width" >
                                                                    <div className='d-flex justify-content-between align-items-center'>
                                                                        <span className="font-weight-normal">
                                                                            {CommentData.AuthorName} - {CommentData.Created}
                                                                        </span>
                                                                        <span>
                                                                            {/* onClick={() => clearComment(true, index, 0)} */}
                                                                            {/* <a className="ps-1" onClick={() => openEditModal(CommentData.Title, index, 0, false)}><img src={require('../../Assets/ICON/edit_page.svg')} width="25" /></a> */}
                                                                            {/* <a className="pe-2"><img src={require('../../Assets/ICON/cross.svg')} width="18"></img></a> */}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span dangerouslySetInnerHTML={{ __html: CommentData.Title }}></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                </>
                                            )
                                        }) : null}
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div> : null
                    }

                    <footer className="float-end mt-1">

                        <button type="button" className="btn btn-default px-3" onClick={ApprovalPointPopupClose}>
                            Close
                        </button>
                    </footer>
                </div>
            </Panel>
        </div>

    )
}
export default ApprovalHistoryPopup;