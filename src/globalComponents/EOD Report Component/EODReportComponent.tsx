import * as React from "react";
import { useState, useEffect } from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../Tooltip";
import { BsXCircleFill, BsCheckCircleFill } from "react-icons/bs";
import { BiCommentDetail } from "react-icons/bi";
import { Web } from "sp-pnp-js";
var FeedBackArrayDataBackup: any = [];
const EODReportComponent = (TaskDetails: any) => {
    const [IsOpenEDOPopupStatus, setIsOpenEDOPopupStatus] = useState(true);
    const [AddRemarksPanelStatus, setAddRemarksPanelStatus] = useState(false);
    let FeedbackDataCopyArray: any = TaskDetails?.TaskDetails?.FeedBackBackup;
    const [RemarksText, setRemarksText] = useState('');
    const [updateRemarksIndex, setupdateRemarksIndex] = useState<any>();
    const Callback = TaskDetails.Callback;
    const siteUrl: any = TaskDetails.siteUrl;
    const selectedTaskDetails: any = TaskDetails?.TaskDetails;
    const [FeedBackArrayData, setFeedBackArrayData] = useState<any>([])
    const closeEODPanelPopupFunction = () => {
        setIsOpenEDOPopupStatus(false);
        Callback();
        FeedBackArrayDataBackup = []
    }

    useEffect(() => {
        let tempArray: any = [];
        if (selectedTaskDetails?.FeedBackArray?.length > 0) {
            TaskDetails?.TaskDetails?.FeedBackArray?.map((FeedBackData: any, Index: any) => {
                let UpdateParentIndex: any = Index + 1;
                FeedBackData.CommentIndex = UpdateParentIndex;
                tempArray.push(FeedBackData);
                FeedBackArrayDataBackup.push(FeedBackData);
                if (FeedBackData?.Subtext?.length > 0) {
                    FeedBackData?.Subtext?.map((SubComment: any, SubIndex: any) => {
                        let childIndex: any = SubIndex + 1;
                        SubComment.parentIndex = Index;
                        SubComment.CommentIndex = UpdateParentIndex + "." + childIndex;
                        tempArray.push(SubComment);
                        FeedBackArrayDataBackup.push(SubComment);
                    })
                }
            })
        }
        setFeedBackArrayData(tempArray);

    }, [])

    const onRenderCustomHeaderMain = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading siteColor">
                    Submit Your Report
                </div>
                <Tooltip ComponentId="6846" isServiceTask={false} />
            </div>
        )
    }

    const onRenderCustomFooterMain = () => {
        return (
            <footer className="text-end me-4">

                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveUpdatedFeedbackJSON} >
                    Save
                </button>
                <button type="button" className="btn btn-default px-3" onClick={closeEODPanelPopupFunction}>
                    Cancel
                </button>
            </footer>

        )
    }


    const updateFeedbackJSON = (PropertyName: any, Value: any, ParentIndex: any, Index: any) => {
        console.log(PropertyName, Value, ParentIndex, Index);
        if (PropertyName == "Completed") {
            FeedBackArrayDataBackup[ParentIndex].Completed = Value;
        }
        if (PropertyName == "Deployed") {
            FeedBackArrayDataBackup[ParentIndex].Deployed = Value;
        }
        if (PropertyName == "QAReview") {
            FeedBackArrayDataBackup[ParentIndex].QAReview = Value;
        }
        if (PropertyName == "InProgress") {
            FeedBackArrayDataBackup[ParentIndex].InProgress = Value;
        }
        if (PropertyName == "Remarks") {
            let remakText: any = FeedBackArrayDataBackup[ParentIndex]?.Remarks != undefined ? FeedBackArrayDataBackup[ParentIndex]?.Remarks : '';
            setRemarksText(remakText);
            setupdateRemarksIndex(ParentIndex);
            setAddRemarksPanelStatus(true)
        }
        setFeedBackArrayData([...FeedBackArrayDataBackup]);
    }

    const saveUpdatedFeedbackJSON = async () => {
        let FinalFeedbackJSON: any = []
        if (FeedBackArrayDataBackup?.length > 0) {
            let ParentComments: any = [];
            FeedBackArrayDataBackup?.map((ItemData: any) => {
                if (ItemData.parentIndex == undefined) {
                    ItemData.Child = []
                    ParentComments.push(ItemData);
                }
            })
            if (ParentComments?.length > 0) {
                FeedBackArrayDataBackup.map((childComment: any) => {
                    if (childComment.parentIndex != undefined) {
                        ParentComments[childComment.parentIndex].Child.push(childComment);
                    }
                })
            }
            ParentComments?.map((FinlData: any) => {
                if (FinlData?.Child?.length > 0) {
                    FinlData.Subtext = FinlData?.Child
                    delete FinlData.Child;
                    FinalFeedbackJSON.push(FinlData)
                } else {
                    FinalFeedbackJSON.push(FinlData)
                }
            })
            let UpdatedJSON: any = FeedbackDataCopyArray;
            UpdatedJSON[0].FeedBackDescriptions = FinalFeedbackJSON;
            const web = new Web(siteUrl)
            try {
                await web.lists.getById(selectedTaskDetails?.listId).items.getById(selectedTaskDetails.Id).update({
                    FeedBack: UpdatedJSON?.length > 0 ? JSON.stringify(UpdatedJSON) : null,
                }).then(async (res: any) => {
                    console.log("Feed Back Submited");
                    closeEODPanelPopupFunction();
                })
            } catch (error) {
                console.log("Error:", error.message)
            }
        }
    }


    const onRenderCustomHeader = () => {
        return (
            <div className="d-flex full-width pb-1" >
                <div className="subheading siteColor">
                    Remarks
                </div>
                <Tooltip ComponentId='6846' />
            </div>
        );
    }

    const closeRemarksPanelPopup = () => {
        setAddRemarksPanelStatus(false);
    }


    const UpdateRemarksCommentFunction = () => {
        FeedBackArrayDataBackup[updateRemarksIndex].Remarks = RemarksText;
        setFeedBackArrayData(FeedBackArrayDataBackup);
        closeRemarksPanelPopup();
    }

    return (
        <section>
            <Panel
                type={PanelType.custom}
                customWidth="1000px"
                isOpen={IsOpenEDOPopupStatus}
                onDismiss={closeEODPanelPopupFunction}
                onRenderHeader={onRenderCustomHeaderMain}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterMain}
            >
                <div className="modal-body mb-5 my-2">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <td scope="col">Sr.No.</td>
                                <td scope="col">Title</td>
                                <td scope="col">Completed</td>
                                <td scope="col">Deployed</td>
                                <td scope="col">QA Review</td>
                                <td scope="col">In Progress</td>
                                <td scope="col">Remarkss</td>
                            </tr>
                        </thead>
                        {FeedBackArrayData?.length > 0 ?
                            <tbody>
                                {FeedBackArrayData?.map((FeedbackItem: any, Index: any) => {
                                    return (
                                        <tr className="border-bottom">
                                            <td style={{ width: "10%" }} className="p-1 ps-3 fw-bold" scope="row">{FeedbackItem.CommentIndex}</td>
                                            <td style={{ width: "40%" }} className="p-1" dangerouslySetInnerHTML={{
                                                __html: FeedbackItem.Title?.replace(/<[^>]*>/g, '')
                                            }} ></td>
                                            <td
                                                style={{ width: "10%" }}
                                                className="text-center p-1"
                                                onClick={() => updateFeedbackJSON("Completed", FeedbackItem.Completed ? false : true, Index, FeedbackItem)}

                                            >
                                                {FeedbackItem.Completed != undefined ? FeedbackItem.Completed ? <span className="checkCircleFill"><BsCheckCircleFill /></span>
                                                    :
                                                    <span className="xCircleFill"><BsXCircleFill /></span>
                                                    :
                                                    <span className="xCircleFill"><BsXCircleFill /></span>
                                                }
                                            </td>
                                            <td
                                                style={{ width: "10%" }}
                                                className="text-center p-1"
                                                onClick={() => updateFeedbackJSON("Deployed", FeedbackItem.Deployed ? false : true, Index, FeedbackItem)}
                                            >
                                                {FeedbackItem.Deployed != undefined ? FeedbackItem.Deployed ?
                                                    <span className="checkCircleFill"><BsCheckCircleFill /></span>
                                                    : <span className="xCircleFill"><BsXCircleFill /></span>
                                                    : <span className="xCircleFill"><BsXCircleFill /></span>
                                                }
                                            </td>
                                            <td
                                                style={{ width: "10%" }}
                                                className="text-center p-1"
                                                onClick={() => updateFeedbackJSON("QAReview", FeedbackItem.QAReview ? false : true, Index, FeedbackItem)}
                                            >
                                                {FeedbackItem.QAReview != undefined ? FeedbackItem.QAReview ?
                                                    <span className="checkCircleFill"><BsCheckCircleFill /></span>
                                                    : <span className="xCircleFill"><BsXCircleFill /></span>
                                                    : <span className="xCircleFill"><BsXCircleFill /></span>}
                                            </td>
                                            <td
                                                style={{ width: "10%" }}
                                                className="text-center p-1"
                                                onClick={() => updateFeedbackJSON("InProgress", FeedbackItem.InProgress ? false : true, Index, FeedbackItem)}

                                            >
                                                {FeedbackItem.InProgress != undefined ? FeedbackItem.InProgress ?
                                                    <span className="checkCircleFill"><BsCheckCircleFill /></span>
                                                    : <span className="xCircleFill"><BsXCircleFill /></span>
                                                    : <span className="xCircleFill"><BsXCircleFill /></span>
                                                }</td>
                                            <td
                                                style={{ width: "10%" }}
                                                className="text-center p-1"
                                                onClick={() => updateFeedbackJSON("Remarks", FeedbackItem.Remarks ? false : true, Index, FeedbackItem)}
                                            >
                                                {FeedbackItem.Remarks != undefined ? FeedbackItem.Remarks?.length > 0 ?
                                                    <span className="hover-text alignIcon">
                                                        <span className="commentDetailFill-active"><BiCommentDetail /></span>
                                                        <span className="tooltip-text pop-left">
                                                            {FeedbackItem.Remarks != undefined ? FeedbackItem.Remarks : ''}
                                                        </span>
                                                    </span>
                                                    : <span className="commentDetailFill"><BiCommentDetail /></span>
                                                    : <span className="commentDetailFill"><BiCommentDetail /></span>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            : null}
                    </table>
                </div>
            </Panel>


            {/* this is used for add Remarkss for EOD Report  */}

            {AddRemarksPanelStatus ?
                <section className="Add-Remarks-section">
                    <Panel
                        onRenderHeader={onRenderCustomHeader}
                        isOpen={AddRemarksPanelStatus}
                        onDismiss={closeRemarksPanelPopup}
                        isBlocking={false}
                        type={PanelType.custom}
                        customWidth="500px"
                    >
                        <div>
                            <textarea
                                className="full-width"
                                id="txtUpdateComment"
                                rows={6}
                                defaultValue={RemarksText}
                                onChange={(e) => setRemarksText(e.target.value)}
                            >
                            </textarea>
                        </div>
                        <footer className="d-flex justify-content-between mt-1 float-end">
                            <div>
                                <button
                                    className="btn btnPrimary mx-1"
                                    onClick={UpdateRemarksCommentFunction}
                                >
                                    Save
                                </button>
                                <button
                                    className='btn btn-default'
                                    onClick={closeRemarksPanelPopup}
                                >
                                    Cancel
                                </button>
                            </div>
                        </footer>
                    </Panel>
                </section>
                : null}


        </section>
    )
}
export default EODReportComponent;