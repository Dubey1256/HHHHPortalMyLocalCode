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
                ChildArray?.forEach((ele:any)=>{
                    if(ele.ApproverData != undefined && ele.ApproverData.length > 0){
                   ele.ApproverData?.forEach((ba:any)=>{
                       if(ba.isShowLight == 'Reject'){
                        ba.Status = 'Rejected by'
                       }
                       if(ba.isShowLight == 'Approve'){
                           ba.Status = 'Approved by '
                       }
                       if(ba.isShowLight == 'Maybe'){
                           ba.Status = 'For discussion with'
                       }
                       
           
                   })
                 }
                   })
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
    }, [])
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
        callBack(tempArray, currentArrayIndex);
        setSubCommentsData(tempArray);
    }
    function handleChangeChild(e: any) {
        const id = parseInt(e.currentTarget.dataset.id, 10);
        const { name, type, checked, value } = e.target;
        let updatedValue = type === "checkbox" ? checked : value;

        if (name === "SeeAbove") {
            // Handle the 'See Above' checkbox
            let newTitle = UpdatedFeedBackChildArray[id].Title;
            const seeText = ` (See ${SubTextItemsArray.index + 1}.${id})`;

            if (updatedValue) {
                if (!newTitle.includes(seeText)) {
                    // Append only if not already included
                    newTitle += seeText;
                }
            } else {
                // Remove the text if unchecked
                newTitle = newTitle.replace(seeText, "").trim();
            }

            UpdatedFeedBackChildArray[id].Title = newTitle;
            UpdatedFeedBackChildArray[id].SeeAbove = updatedValue;
        } else if (type === "textarea") {
            // Handle changes in textarea
            UpdatedFeedBackChildArray[id].Title = updatedValue;
        } else if (type === "checkbox") {
            // Handle other checkbox types
            UpdatedFeedBackChildArray[id][name] = updatedValue;
        }

        // Update subCommentsData to trigger re-render
        const updatedSubCommentsData = subCommentsData.map((item, idx) => {
            if (idx === id) {
                return {
                    ...item,
                    Title: UpdatedFeedBackChildArray[id].Title,
                    [name]: updatedValue
                };
            }
            return item;
        });
        setSubCommentsData(updatedSubCommentsData);

        callBack(updatedSubCommentsData, currentArrayIndex);
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
        UpdatedFeedBackChildArray[index].isShowLight = value;
        UpdatedFeedBackChildArray[index].ApproverData.push(temObject);
        let tempApproverData: any = UpdatedFeedBackChildArray[index].ApproverData
        UpdatedFeedBackChildArray?.forEach((ele: any) => {
            if (ele.ApproverData != undefined && ele.ApproverData.length > 0) {
                ele.ApproverData?.forEach((ba: any) => {
                    if (ba.isShowLight == 'Reject') {
                        ba.Status = 'Rejected by'
                    }
                    if (ba.isShowLight == 'Approve') {
                        ba.Status = 'Approved by '
                    }
                    if (ba.isShowLight == 'Maybe') {
                        ba.Status = 'For discussion with'
                    }


                })
            }
        })
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

    const ApprovalPopupOpenHandle = (index: any, data: any) => {
        setApprovalPointCurrentIndex(index);
        setApprovalPointHistoryStatus(true);
        setApprovalPointUserData(data);
    }

    const ApprovalHistoryPopupCallBack = useCallback(() => {
        setApprovalPointHistoryStatus(false)
    }, [])

    function handleTextAreaChange(e: any, index: any) {
        const updatedValue = e.target.value;
        const updatedSubCommentsData = subCommentsData.map((item, idx) => {
            if (idx === index) {
                return {...item, Title: updatedValue};
            }
            return item;
        });
        setSubCommentsData(updatedSubCommentsData);
    }

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
                                                <>
                                                   
                                                            <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => ApprovalPopupOpenHandle(index, obj)}>
                                                            {obj.ApproverData[obj?.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={obj.ApproverData[obj.ApproverData?.length - 1]?.Title}><span><a href={`${Context.pageContext.web.absoluteUrl}/SitePages/TaskDashboard.aspx?UserId=${obj.ApproverData[obj?.ApproverData?.length - 1]?.Id}&Name=${obj.ApproverData[obj?.ApproverData?.length - 1]?.Title}`} target="_blank" data-interception="off" title={obj?.ApproverData[obj.ApproverData?.length - 1]?.Title}> <img className='imgAuthor' src={obj.ApproverData[obj.ApproverData?.length - 1]?.ImageUrl} /></a></span></a></span>
                                                      
                                                </> :
                                                null
                                            }
                                            </div>
                                        </div>
                                        <div>
                                            {index > 0 ? <><span className="mx-1">
                                                
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={index}
                                                    name="SeeAbove"
                                                    checked={obj.SeeAbove}
                                                />
                                                <label className="commentSectionLabel ms-1">See Above</label>
                                            </span>
                                                <span> | </span> </> : null}
                                            <span className="mx-1">
                                               
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={index}
                                                    name="Phone"
                                                    checked={obj.Phone}
                                                />
                                                <label className="commentSectionLabel ms-1">Phone</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1" >
                                               
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={index}
                                                    name="LowImportance"
                                                    checked={obj.LowImportance}
                                                />
                                                <label className="commentSectionLabel ms-1">Low Importance</label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                               
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={index}
                                                    name="HighImportance"
                                                    checked={obj.HighImportance}
                                                />
                                                <label className="commentSectionLabel ms-1">High Importance </label>
                                            </span>
                                            <span> | </span>
                                            <span className="mx-1">
                                               
                                                <input className="form-check-input mt--3"
                                                    type="checkbox"
                                                    data-id={index}
                                                    name="Completed"
                                                    checked={obj.Completed}
                                                />
                                                <label className="commentSectionLabel ms-1">Mark As Completed</label>
                                            </span>
                                            <span> | </span>
                                            <span className="hreflink siteColor mx-1 commentSectionLabel">
                                                <span onClick={() => postBtnHandle(index)}> Add Comment </span>
                                            </span>
                                            <span> | </span>
                                            <span className="">
                                                <a className="ps-1 hreflink"
                                                    target="_blank"
                                                    onClick={() => RemoveSubtexTItem(obj, index)}
                                                ><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                                    </svg>
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="d-flex" title={obj.isShowLight}>
                                           
                                            <textarea
                                                style={{ width: "100%" }}
                                                className={`form-control SubTestLeftBorder`}
                                                value={obj.Title || ''}
                                                onChange={(e) => handleTextAreaChange(e, index)}
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
                                            SmartLightStatus={obj?.isShowLight}
                                            isCurrentUserApprover={isCurrentUserApprover}
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
