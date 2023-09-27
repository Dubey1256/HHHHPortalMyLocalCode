import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import AddCommentComponent from './AddCommentComponent';
import pnp from 'sp-pnp-js';
import * as Moment from 'moment';
import ApprovalHistoryPopup from "./ApprovalHistoryPopup";

export default function subCommentComponent(SubTextItemsArray: any) {
    const SubTextItems = SubTextItemsArray.SubTextItemsArray;
    const callBack = SubTextItemsArray.callBack;
    const Context = SubTextItemsArray.Context;
    const [Texts, setTexts] = useState(false);
    const [subCommentsData, setSubCommentsData] = useState([]);
    const [UpdatedFeedBackChildArray, setUpdatedFeedBackChildArray] = useState([]);
    const [btnStatus, setBtnStatus] = useState(false);
    const [postBtnStatus, setPostBtnStatus] = useState(false);
    const [currentIndex, setCurrentIndex] = useState('');
    const [isCurrentUserApprover, setIsCurrentUserApprover] = useState(false);
    const [currentUserData, setCurrentUserData] = useState<any>([]);
    const [ApprovalPointHistoryStatus, setApprovalPointHistoryStatus] = useState(false);
    const [ApprovalPointUserData, setApprovalPointUserData] = useState<any>([]);
    const [ApprovalPointCurrentIndex, setApprovalPointCurrentIndex] = useState('');
    const currentArrayIndex = SubTextItemsArray.currentIndex;
    const isFirstComment = SubTextItemsArray.isFirstComment;
    let ApprovalStatus: any = SubTextItemsArray.ApprovalStatus;
    let SmartLightPercentStatus: any = SubTextItemsArray.SmartLightPercentStatus;
    let SmartLightStatus: any = SubTextItemsArray.SmartLightStatus;
    let ChildArray: any = [];

    useEffect(() => {
        if (SubTextItems != undefined && SubTextItems.length > 0) {
            SubTextItems.map((subItem: any) => {
                if (subItem.ApproverData == undefined) {
                    subItem.ApproverData = [];
                }
                ChildArray.push(subItem);
                UpdatedFeedBackChildArray.push(subItem);
                subCommentsData.push(subItem);
            })
            setBtnStatus(true)
        } else {
            setBtnStatus(false)
        }
        if (ChildArray?.length == 0) {
            setBtnStatus(false)
        }
        if (SmartLightStatus) {
            setIsCurrentUserApprover(true);
        }
        getCurrentUserDetails();
    }, [SubTextItemsArray.FeedbackCount])
    const getCurrentUserDetails = async () => {
        let currentUserId: number;
        await pnp.sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });
        if (currentUserId != undefined) {
            if (SubTextItemsArray.allUsers != null && SubTextItemsArray.allUsers?.length > 0) {
                SubTextItemsArray.allUsers?.map((userData: any) => {
                    if (userData.AssingedToUserId == currentUserId) {
                        let TempObject: any = {
                            Title: userData.Title,
                            Id: userData.AssingedToUserId,
                            ImageUrl: userData.Item_x0020_Cover?.Url,
                            ApprovalDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm')
                        }
                        setCurrentUserData(TempObject);
                    }
                })
            }
        }
    }
    const addSubRow = () => {
        const object = {
            Completed: "",
            Title: "",
            text: "",
            Phone: "",
            LowImportance: "",
            HighImportance: "",
            isShowLight: "",
            SeeAbove: ''
        };
        subCommentsData.push(object);
        setTexts(!Texts)
        UpdatedFeedBackChildArray.push(object)
        setBtnStatus(true);
    }

    const addSubRowInDiv = () => {
        const object = {
            Completed: "",
            Title: "",
            text: "",
            Phone: "",
            LowImportance: "",
            HighImportance: "",
            isShowLight: "",
            SeeAbove: '',
        };
        subCommentsData.push(object);
        setTexts(!Texts)
        UpdatedFeedBackChildArray.push(object)
        setBtnStatus(true);
    }
    const RemoveSubtexTItem = (dltItem: any, Index: number) => {
        let tempArray: any = []
        subCommentsData.map((array: any, index: number) => {
            if (index != Index) {
                tempArray.push(array);
            }
        });
        // tempArray?.map((tempData: any) => {
        //     ChildArray.push(tempData);
        // })
        callBack(tempArray, currentArrayIndex);
        setSubCommentsData(tempArray);
    }

    function handleChangeChild(e: any) {
        // let tempArray: any = [];
        if (e.target.matches("textarea")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...subCommentsData];
            const obj = { ...subCommentsData[id], [name]: value };
            copy[id] = obj;
            setSubCommentsData(copy);
            UpdatedFeedBackChildArray[id].Title = value;

        }
        if (e.target.matches("input")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...subCommentsData];
            const obj = { ...subCommentsData[id], [name]: value == "true" ? false : true };
            copy[id] = obj;
            setSubCommentsData(copy);
            if (name == "SeeAbove") {
                if (value == 'false') {
                    const { id } = e.currentTarget.dataset;
                    let Index = Number(id);
                    let NewTitle: any = "";
                    if (UpdatedFeedBackChildArray[id].Title != undefined && UpdatedFeedBackChildArray[id].Title.length > 0) {
                        NewTitle = UpdatedFeedBackChildArray[id].Title + " (See " + (SubTextItemsArray.index+1)+"."+ Index +")";
                    } else {
                        NewTitle = "See " + (SubTextItemsArray.index+1)+"."+ Index
                    }
                    UpdatedFeedBackChildArray[id].Title = NewTitle;
                    const copy = [...subCommentsData];
                    const obj = { ...subCommentsData[id], Title: NewTitle, SeeAbove:true };
                    copy[id] = obj;
                    setSubCommentsData(copy);
                } else {
                    const { id } = e.currentTarget.dataset;
                    let Index = Number(id);
                    let NewTitle: any = "";
                    if (UpdatedFeedBackChildArray[id].Title != undefined && UpdatedFeedBackChildArray[id].Title.length > 0) {
                        NewTitle = UpdatedFeedBackChildArray[id].Title.replace(`(See ${SubTextItemsArray.index + 1}.${Index})`, "");
                    } else {
                        NewTitle = "";
                    }
                    UpdatedFeedBackChildArray[id].Title = NewTitle;
                    const copy = [...subCommentsData];
                    const obj = { ...subCommentsData[id], Title: NewTitle, SeeAbove: false};
                    copy[id] = obj;
                    setSubCommentsData(copy);
                }
                UpdatedFeedBackChildArray[id].SeeAbove = (value == "true" ? false : true)
            }
            if (name == "Phone") {
                UpdatedFeedBackChildArray[id].Phone = (value == "true" ? false : true)
            }
            if (name == "LowImportance") {
                UpdatedFeedBackChildArray[id].LowImportance = (value == "true" ? false : true)
            }
            if (name == "HighImportance") {
                UpdatedFeedBackChildArray[id].HighImportance = (value == "true" ? false : true)
            }
            if (name == "Completed") {
                UpdatedFeedBackChildArray[id].Completed = (value == "true" ? false : true)
            }
        }
        callBack(UpdatedFeedBackChildArray, currentArrayIndex);
    }

    const postBtnHandle = (index: any) => {
        setCurrentIndex(index)
        if (postBtnStatus) {
            setPostBtnStatus(false)
        } else {
            setPostBtnStatus(true)
        }
    }
    const postBtnHandleCallBack = useCallback((status: any, dataPost: any, Index: any) => {
        if (status) {
            setPostBtnStatus(false)
        } else {
            setPostBtnStatus(true)
        }
        // const copy = [...subCommentsData];
        // const obj = { ...subCommentsData[Index], Comments: dataPost };
        // copy[Index] = obj;
        // setSubCommentsData(copy);
        UpdatedFeedBackChildArray[Index].Comments = dataPost;
        callBack(UpdatedFeedBackChildArray, currentArrayIndex);
    }, [])
    const SmartLightUpdateSubChildComment = (index: any, value: any) => {
        let temObject: any = {
            Title: currentUserData.Title != undefined ? currentUserData.Title : Context.pageContext._user.displayName,
            Id: currentUserData.Id,
            ImageUrl: currentUserData.ImageUrl != undefined ? currentUserData.ImageUrl : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
            ApprovalDate: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
            isShowLight: value
        }
        // currentUserData.isShowLight = value;
        UpdatedFeedBackChildArray[index].isShowLight = value;
        UpdatedFeedBackChildArray[index].ApproverData.push(temObject);
        let tempApproverData: any = UpdatedFeedBackChildArray[index].ApproverData
        callBack(UpdatedFeedBackChildArray, currentArrayIndex);
        const copy = [...subCommentsData];
        const obj = { ...subCommentsData[index], isShowLight: value, ApproverData: tempApproverData };
        copy[index] = obj;
        setSubCommentsData(copy);

    }
    const postBtnHandleCallBackCancel = useCallback((status: any) => {
        if (status) {
            setPostBtnStatus(false)
        } else {
            setPostBtnStatus(true)
        }
    }, [])

    // ********************* this is for the Approval Point History Popup ************************

    // const ApprovalPointPopupClose = () => {
    //     setApprovalPointHistoryStatus(false)
    // }

    const ApprovalPopupOpenHandle = (index: any, data: any) => {
        setApprovalPointCurrentIndex(index);
        setApprovalPointHistoryStatus(true);
        setApprovalPointUserData(data);
    }

    const ApprovalHistoryPopupCallBack = useCallback(() => {
        setApprovalPointHistoryStatus(false)
    }, [])

    function createSubRows(state: any[]) {
        return (
            <div>
                
                <div className="add-text-box my-1">
                    {state?.map((obj, index) => {
                        return (
                            <div className="FeedBack-comment row ms-1">
                                <div
                                    data-id={index}
                                    className="col"
                                    onChange={handleChangeChild}
                                >
                                    <div className="Task-panel alignCenter justify-content-between">
                                        <div className="alignCenter">
                                            <span className="me-1">{`${SubTextItemsArray.index + 1}.${index + 1}`}</span>
                                            <div className="d-flex">
                                                {ApprovalStatus ?
                                                    <div>
                                                        {/* {isCurrentUserApprover ? */}
                                                        <div className={isCurrentUserApprover ? "alignCenter mt-1" : "alignCenter Disabled-Link mt-1"} >
                                                            <span className="MR5 ng-scope" ng-disabled="Item.PercentComplete >= 80">
                                                                <span title="Rejected" onClick={() => SmartLightUpdateSubChildComment(index, "Reject")}
                                                                    className={obj.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                                >
                                                                </span>
                                                                <span title="Maybe" onClick={() => SmartLightUpdateSubChildComment(index, "Maybe")} className={obj.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                                </span>
                                                                <span title="Approved" onClick={() => SmartLightUpdateSubChildComment(index, "Approve")} className={obj.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        {/* : null} */}
                                                    </div>
                                                    : null
                                                }
                                                {obj.ApproverData != undefined && obj.ApproverData.length > 0 ?
                                                    <span className="siteColor hreflink ms-2" title="Approval-History Popup" onClick={() => ApprovalPopupOpenHandle(index, obj)}>
                                                        Pre-approved by - <span className="ms-1">
                                                            <a title={obj.ApproverData[obj.ApproverData.length - 1]?.Title}>
                                                                <img className='imgAuthor' src={obj.ApproverData[obj.ApproverData.length - 1]?.ImageUrl} />
                                                            </a>
                                                        </span>
                                                    </span>
                                                    : null
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            {index > 0 ? <><span className="mx-1">
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    checked={obj.SeeAbove != undefined && obj.SeeAbove == true ? true : false}
                                                    value={obj.SeeAbove != undefined && obj.SeeAbove == true ? "true" : "false"}
                                                    name='SeeAbove'
                                                />
                                                <label className="commentSectionLabel ms-1">See Above</label>
                                            </span>
                                                <span> | </span> </> : null}
                                            <span className="mx-1">
                                                <input className="form-check-input mt--3" type="checkbox"
                                                    checked={obj.Phone}
                                                    value={obj.Phone}
                                                    name='Phone'
                                                />
                                                <label className="commentSectionLabel ms-1">Phone</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1" >
                                                <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input mt--3"
                                                />
                                                <label className="commentSectionLabel ms-1">Low Importance</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                                    value={obj.HighImportance} className="form-check-input mt--3"
                                                />
                                                <label className="commentSectionLabel ms-1">High Importance </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                                <input type="checkbox" id="" className="form-check-input mt--3"
                                                    name='Completed' checked={obj.Completed} value={obj.Completed} />
                                                <label className="commentSectionLabel ms-1">Mark As Completed</label>
                                            </span>
                                            <span> | </span>
                                            <span className="hreflink siteColor mx-1 commentSectionLabel">
                                                <span onClick={() => postBtnHandle(index)}> Add Comment </span>
                                            </span>
                                            <span> | </span>
                                            <a className="alignIcon hreflink"
                                                target="_blank"
                                                onClick={() => RemoveSubtexTItem(obj, index)}>
                                                    <span className="svg__iconbox hreflink mini dark svg__icon--trash"></span>
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex" title={obj.isShowLight}>
                                            <textarea
                                                style={{ width: "100%" }}
                                                className={`form-control SubTestLeftBorder`}
                                                defaultValue={obj?.Title?.replace(/<[^>]*>/g, ' ')}
                                                name='Title'
                                            ></textarea>
                                        </div>
                                    </div>
                                </div >
                                <div>
                                    <div>
                                        <AddCommentComponent
                                            Data={obj.Comments != null ? obj.Comments : []}
                                            allFbData={SubTextItems}
                                            index={index}
                                            postStatus={index == Number(currentIndex) && postBtnStatus ? true : false}
                                            allUsers={SubTextItemsArray.allUsers}
                                            callBack={postBtnHandleCallBack}
                                            CancelCallback={postBtnHandleCallBackCancel}
                                            Context={Context}
                                            ApprovalStatus={ApprovalStatus}
                                            isCurrentUserApprover={isCurrentUserApprover}
                                            FeedbackCount = {SubTextItemsArray.FeedbackCount}
                                            SmartLightStatus = {obj.isShowLight}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {btnStatus ? <div className="float-end">
                        <button className="btn btn-primary my-1"
                            onClick={addSubRowInDiv}>Add Sub-Text Box
                        </button>
                    </div>
                        : null}
                </div>
                {/* ********************* this is Approval History panel ****************** */}
                {ApprovalPointHistoryStatus ?
                    <ApprovalHistoryPopup
                        ApprovalPointUserData={ApprovalPointUserData}
                        ApprovalPointCurrentIndex={ApprovalPointCurrentIndex}
                        currentArrayIndex={isFirstComment ? 0 : currentArrayIndex + 1}
                        ApprovalPointHistoryStatus={ApprovalPointHistoryStatus}
                        callBack={ApprovalHistoryPopupCallBack}
                    />
                    : null
                }
            </div>
        )
    }
    return (
        <div className="col ms-5">
            {subCommentsData.length ? null :
                <div className="float-end">
                    <button className="btn btn-primary my-1" onClick={addSubRow}>Add Sub-Text Box</button>
                </div>
            }
            {subCommentsData.length ? createSubRows(subCommentsData) : null}
        </div>
    );
}  
