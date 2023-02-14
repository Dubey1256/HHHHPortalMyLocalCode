import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import AddCommentComponent from './AddCommentComponent'

export default function subCommentComponent(SubTextItemsArray: any) {
    const SubTextItems = SubTextItemsArray.SubTextItemsArray;
    const callBack = SubTextItemsArray.callBack
    const [Texts, setTexts] = useState(false);
    const [subCommentsData, setSubCommentsData] = useState([]);
    const [btnStatus, setBtnStatus] = useState(false);
    const [postBtnStatus, setPostBtnStatus] = useState(false);
    const [currentIndex, setCurrentIndex] = useState('');
    var Array: any = [];
    const addSubRow = () => {
        const object = {
            Completed: "",
            Title: "",
            text: "",
            Phone: "",
            LowImportance: "",
            HighImportance: ""
        };
        subCommentsData.push(object);
        setTexts(!Texts)
        Array.push(object)
        setBtnStatus(true);
    }

    useEffect(() => {
        if (SubTextItems != undefined && SubTextItems.length > 0) {
            setSubCommentsData(SubTextItems);
            SubTextItems.map((subItem: any) => {
                Array.push(subItem);
            })
            Array = SubTextItems
            setBtnStatus(true)
        } else {
            setBtnStatus(false)
        }
        if (Array?.length == 0) {
            setBtnStatus(false)
        }
    }, [])
    const RemoveSubtexTItem = (dltItem: any, Index: number) => {
        let tempArray: any = []
        subCommentsData.map((array: any, index: number) => {
            if (index != Index) {
                tempArray.push(array);

            }
        });
        tempArray?.map((tempData: any) => {
            Array.push(tempData);
        })
        setTimeout(() => {
            callBack(tempArray, SubTextItemsArray.commentId);
        }, 1000);
        setSubCommentsData(tempArray);
    }

    function handleChangeChild(e: any) {

        if (e.target.matches("textarea")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...subCommentsData];
            const obj = { ...subCommentsData[id], [name]: value };
            copy[id] = obj;
            setSubCommentsData(copy);
            Array = [];
            copy?.map((copyItem: any) => {
                Array.push(copyItem)
            })
        }
        if (e.target.matches("input")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...subCommentsData];
            const obj = { ...subCommentsData[id], [name]: value == "true" ? false : true };
            copy[id] = obj;
            setSubCommentsData(copy);
            Array = [];
            copy?.map((copyItem: any) => {
                Array.push(copyItem)
            })
        }
        setTimeout(() => {
            callBack(Array, SubTextItemsArray.commentId);
        }, 1000);
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
        Array[Index].Comments = dataPost;
        setTimeout(() => {
            callBack(Array, SubTextItemsArray.commentId);
        }, 1000);

    }, [])

    function createSubRows(state: any[]) {
        return (
            <div className="add-text-box">
                {state?.map((obj, index) => {
                    return (
                        <div className="row ms-1">
                            <div
                                data-id={index}
                                className="col"
                                onChange={handleChangeChild}
                            >
                                <div className="Task-panel d-flex  justify-content-end ">
                                    <span className="mx-1">
                                        <input className="form-check-input mx-1" type="checkbox"
                                            checked={obj.Phone}
                                            value={obj.Phone}
                                            name='Phone'
                                        />
                                        <label>Phone</label>
                                    </span>
                                    <span> | </span>
                                    <span className="mx-1" >
                                        <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input mx-1"
                                        />
                                        <label>Low Importance</label> 
                                    </span>
                                    <span> | </span>
                                    <span className="mx-1">
                                        <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                            value={obj.HighImportance} className="form-check-input mx-1"
                                        />
                                        <label>High Importance </label>
                                    </span> 
                                    <span> | </span>
                                    <span className="mx-1">
                                        <input type="checkbox" id="" className="form-check-input mx-1"
                                            name='Completed' checked={obj.Completed} value={obj.Completed} />
                                        <label>Mark As Completed</label>
                                    </span> 
                                    <span> | </span>
                                    <span className="hreflink mx-1" style={{ color: "#000066" }}>
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
                                <div>
                                    <div className="d-flex">
                                        <span className="border p-1 me-1">{`${SubTextItemsArray.index}.${index + 1}`}</span>
                                        <textarea
                                            style={{ width: "100%" }}
                                            className="form-control"
                                            defaultValue={obj.Title}
                                            name='Title'
                                        ></textarea>
                                    </div>
                                    {/* <button onClick={addRow}>Add New Box</button> */}
                                    {/* {subCommentsData.length==1 || 2 || 3 ?<button className="btn btn-primary" onClick={addRow}>Add New Box</button>:""} */}
                                </div>
                            </div >
                            <div>
                                <div>
                                    <AddCommentComponent
                                        Data={obj.Comments != null ? obj.Comments : []}
                                        allFbData={SubTextItems}
                                        index={currentIndex}
                                        postStatus={postBtnStatus}
                                        allUsers={SubTextItemsArray.allUsers}
                                        callBack={postBtnHandleCallBack}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
                {btnStatus ? <div className="float-end">
                    <button className="btn btn-primary my-1"
                        onClick={addSubRow}>Add Sub-Text Box
                    </button>
                </div>

                    : null}
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