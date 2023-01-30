import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const { useState, useEffect, useCallback } = React;
import Example from "./SubCommentComponent";

export default function FroalaCommnetBoxes(textItems: any) {
    let TextItems = textItems.textItems;
    const callBack = textItems.callBack
    const [State, setState] = useState([]);
    const [Texts, setTexts] = useState(false);
    const [btnStatus, setBtnStatus] = useState(false);
    var Array: any = [];
    const addRow = () => {
        let testTaskIndex = State?.length + 1
        const object = {
            Completed: "",
            Title: "",
            text: "",
            taskIndex: testTaskIndex,
            SeeAbove: '',
            Phone: '',
            LowImportance: '',
            HighImportance: ''
        };
        State.push(object);
        Array.push(object);
        setTexts(!Texts);
        setBtnStatus(true);
    }


    useEffect(() => {
        if (TextItems != undefined && TextItems.length > 0) {
            setBtnStatus(true)
            TextItems.map((item: any, index: any) => {
                if (index > 0) {
                    item.taskIndex = index;
                    State.push(item);
                    setTexts(!Texts);
                    Array.push(item)
                }
            })
        } else {
            setBtnStatus(false)
        }
    }, [])
    const RemoveItem = (dltItem: any) => {
        let tempArray: any = []
        State.map((array: any) => {
            if (dltItem.taskIndex != array.taskIndex) {
                tempArray.push(array);
            }
        })
        setState(tempArray);
        Array = tempArray;
        if (tempArray?.length == 0) {
            setBtnStatus(false)
        }
    }

    function handleChange(e: any) {

        if (e.target.matches("textarea")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...State];
            const obj = { ...State[id], [name]: value };
            copy[id] = obj;
            setState(copy);
            Array = copy;
        }
        if (e.target.matches("input")) {
            const { id } = e.currentTarget.dataset;
            const { name, value } = e.target;
            const copy = [...State];
            const obj = { ...State[id], [name]: value == "true" ? false : true };
            copy[id] = obj;
            setState(copy);
            Array = copy
        }
        setTimeout(() => {
            callBack(Array);
        }, 1000);
    }

    const subTextCallBack = useCallback((subTextData: any, commentId: any) => {
        let arrayIndex:number;
        Array?.map((data: any, index:any) => {
            if (data.Id == commentId) {
                arrayIndex = index;
            }
        })
        if(arrayIndex != undefined){
            Array[arrayIndex].Subtext = subTextData;
        }
        setTimeout(() => {
            callBack(Array);
        }, 1000);
        console.log("Sub text array call back ====", Array);
    }, [])

    function createRows(state: any[]) {
        return (
            <div className="add-text-box">
                {state?.map((obj, i) => {
                    return (
                        <div className="row my-1">
                            <div
                                data-id={i}
                                className="col"
                                onChange={handleChange}
                            >
                                <div className="Task-panel d-flex justify-content-end ">
                                    <span>
                                        <input className="form-check-input mx-1" type="checkbox"
                                            checked={obj.SeeAbove}
                                            value={obj.SeeAbove}
                                            name='SeeAbove'
                                        />
                                        <label>See Above</label>
                                    </span>
                                    <span>
                                        <input className="form-check-input mx-1" type="checkbox"
                                            checked={obj.Phone}
                                            value={obj.Phone}
                                            name='Phone'
                                        />
                                        <label>Phone</label>
                                    </span>
                                    <span>
                                        <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input mx-1"
                                        />
                                        <label>
                                            Low Importance
                                        </label>
                                    </span>
                                    <span> |</span>
                                    <span>
                                        <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
                                            value={obj.HighImportance} className="form-check-input mx-1"
                                        />
                                        <label>
                                            High Importance
                                        </label>
                                    </span>
                                    <span> |</span>
                                    <span>
                                        <input type="checkbox" id="" className="form-check-input mx-1"
                                            name='Completed' checked={obj.Completed} value={obj.Completed} />
                                        <label>
                                            Mark As Completed
                                        </label>
                                    </span>
                                    <span> |</span>
                                    <span className="form-check">
                                        <a href="#"> Add Comment </a>
                                    </span>
                                    <span> |</span>
                                    <span className="">
                                        <a className="ps-2"
                                            style={{ cursor: "pointer" }} target="_blank"
                                            onClick={() => RemoveItem(obj)}
                                        ><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
                                            </svg>
                                        </a>
                                    </span>
                                </div>
                                <div>
                                    <div className="d-flex">
                                        <span className="border p-1 me-1">{obj.taskIndex + 1}</span>
                                        <textarea
                                            style={{ width: "100%" }}
                                            className="form-control"
                                            defaultValue={obj.Title}
                                            name='Title'
                                        ></textarea>
                                    </div>
                                    <div>
                                        <Example SubTextItemsArray={obj.Subtext ? obj.Subtext : []} index={obj.taskIndex + 1} commentId={obj.Id} callBack={subTextCallBack} />
                                    </div>
                                </div>
                            </div >
                        </div>
                    );
                })}
                {btnStatus ? <button className="btn btn-primary" onClick={addRow}>Add New Box</button> : null}
            </div>
        )
    }
    // Small function to show state when a
    // button is clicked
    // Check to see if state has length, and then
    // create the rows

    // function createSubRows(subComments: any[]) {
    //     return (
    //         <div className="add-text-box">
    //             {subComments?.map((obj, i) => {
    //                 return (
    //                     <div className="row">
    //                         <div
    //                             data-id={i}
    //                             className="col"
    //                             onChange={handleChangeSubComment}
    //                         >
    //                             <div className="Task-panel d-flex  justify-content-end ">
    //                                 <span>
    //                                     <input className="form-check-input mx-1" type="checkbox"
    //                                         checked={obj.SeeAbove}
    //                                         value={obj.SeeAbove}
    //                                         name='SeeAbove'
    //                                     />
    //                                     <label>See Above</label>
    //                                 </span>
    //                                 <span>
    //                                     <input className="form-check-input mx-1" type="checkbox"
    //                                         checked={obj.Phone}
    //                                         value={obj.Phone}
    //                                         name='Phone'
    //                                     />
    //                                     <label>Phone</label>
    //                                 </span>
    //                                 <span>
    //                                     <input type="checkbox" name='LowImportance' checked={obj.LowImportance} value={obj.LowImportance} className="form-check-input mx-1"
    //                                     />
    //                                     <label>
    //                                         Low Importance
    //                                     </label>
    //                                 </span>
    //                                 <span> |</span>
    //                                 <span>
    //                                     <input type="checkbox" name='HighImportance' checked={obj.HighImportance}
    //                                         value={obj.HighImportance} className="form-check-input mx-1"
    //                                     />
    //                                     <label>
    //                                         High Importance
    //                                     </label>
    //                                 </span>
    //                                 <span> |</span>
    //                                 <span>
    //                                     <input type="checkbox" id="" className="form-check-input mx-1"
    //                                         name='Completed' checked={obj.Completed} value={obj.Completed} />
    //                                     <label>
    //                                         Mark As Completed
    //                                     </label>
    //                                 </span>
    //                                 <span> |</span>
    //                                 <span className="form-check">
    //                                     <a href="#"> Add Comment </a>
    //                                 </span>
    //                                 <span> |</span>
    //                                 <span className="">
    //                                     <a className="ps-2"
    //                                         style={{ cursor: "pointer" }} target="_blank"
    //                                         onClick={() => RemoveItem(obj)}
    //                                     >   <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48" fill="none">
    //                                             <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3584 5.28375C18.4262 5.83254 18.1984 6.45859 18.1891 8.49582L18.1837 9.66172H13.5918H9V10.8591V12.0565H10.1612H11.3225L11.3551 26.3309L11.3878 40.6052L11.6525 41.1094C11.9859 41.7441 12.5764 42.3203 13.2857 42.7028L13.8367 43H23.9388C33.9989 43 34.0431 42.9989 34.6068 42.7306C35.478 42.316 36.1367 41.6314 36.4233 40.8428C36.6697 40.1649 36.6735 39.944 36.6735 26.1055V12.0565H37.8367H39V10.8591V9.66172H34.4082H29.8163L29.8134 8.49582C29.8118 7.85452 29.7618 7.11427 29.7024 6.85084C29.5542 6.19302 29.1114 5.56596 28.5773 5.2569C28.1503 5.00999 27.9409 4.99826 23.9833 5.00015C19.9184 5.0023 19.8273 5.00784 19.3584 5.28375ZM27.4898 8.46431V9.66172H24H20.5102V8.46431V7.26691H24H27.4898V8.46431ZM34.4409 25.9527C34.4055 40.9816 34.4409 40.2167 33.7662 40.5332C33.3348 40.7355 14.6335 40.7206 14.2007 40.5176C13.4996 40.1889 13.5306 40.8675 13.5306 25.8645V12.0565H24.0021H34.4736L34.4409 25.9527ZM18.1837 26.3624V35.8786H19.3469H20.5102V26.3624V16.8461H19.3469H18.1837V26.3624ZM22.8367 26.3624V35.8786H24H25.1633V26.3624V16.8461H24H22.8367V26.3624ZM27.4898 26.3624V35.8786H28.6531H29.8163V26.3624V16.8461H28.6531H27.4898V26.3624Z" fill="#333333" />
    //                                         </svg>
    //                                     </a>
    //                                 </span>
    //                             </div>
    //                             <div>
    //                                 <div>
    //                                     <span className="border p-1 me-1">{obj.taskIndex + 1}</span>
    //                                     <textarea
    //                                         style={{ width: "100%" }}
    //                                         className="form-control"
    //                                         defaultValue={obj.Title}
    //                                         name='Title'
    //                                     ></textarea>
    //                                 </div>

    //                                 {/* <button onClick={addRow}>Add New Box</button> */}
    //                                 {/* {state.length==1 || 2 || 3 ?<button className="btn btn-primary" onClick={addRow}>Add New Box</button>:""} */}
    //                             </div>
    //                         </div >
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //     )
    // }

    return (
        <div className="col mt-2">
            {btnStatus ? null : <button className="btn btn-primary" onClick={addRow}>Add New Box</button>}
            {/* <button onClick={showState}>Show state</button> */}
            {State.length ? createRows(State) : null}
        </div>
    );
}






// Row accepts and id, some data, and the handler
// id: any,
// function Row(handleChange: any, addRow: any, index: any) {
//     return (
//         <div
//             className="row"
//             onChange={handleChange}
//         >
//             <span>
//                 <span className="pull-right">
//                     <span className="md2">
//                         <input type="checkbox" id="" style={{ marginTop: "-1px" }}
//                             name="chkCompleted" ng-model="item.Phone"
//                             ng-click="checkCompleted(Completed,'Phone',item.Phone)" />
//                     </span>
//                     <span>
//                         Phone
//                     </span>
//                     <span>|</span>
//                     <span className="md2">
//                         <input type="checkbox" id="" style={{ marginTop: "-1px" }}
//                             name="chkCompleted" ng-model="item.LowImportance"
//                             ng-click="checkCompleted(Completed)" />
//                     </span>
//                     <span>
//                         Low Importance
//                     </span>
//                     <span>|</span>

//                     <span className="md2">
//                         <input type="checkbox" id="" style={{ marginTop: "-1px" }}
//                             name="chkCompleted" ng-model="item.HighImportance"
//                             ng-click="checkCompleted(Completed)" />
//                     </span>
//                     <span>
//                         High Importance
//                     </span>
//                     <span>|</span>
//                     <span className="md2">
//                         <input type="checkbox" id="" style={{ marginTop: "-1px" }}
//                             name="chkCompleted" ng-model="item.Completed"
//                             ng-click="checkCompleted(item.Completed,'markAsCompleted',item)" />
//                     </span>
//                     <span
//                         ng-bind-html="GetColumnDetails('markAsCompleted') | trustedHTML">markAsCompleted
//                     </span>
//                     <span>|</span>
//                     <span className="">
//                         <a className=" m-2" style={{ cursor: "pointer" }}
//                             ng-click="showCommentBox(item)"
//                             ng-bind-html="GetColumnDetails('addComment') | trustedHTML">addComment</a>
//                     </span>
//                     <span ng-if="$index!=0">|</span>
//                     <span className="">
//                         <a className="m-2" ng-if="Item.siteType!='Offshore Tasks'"
//                             style={{ cursor: "pointer" }} target="_blank"
//                             ng-href="{{pageContext}}/SitePages/CreateTask.aspx"
//                             ng-click="opencreatetask($index)"
//                             ng-bind-html="GetColumnDetails('CreateTask') | trustedHTML">CreateTask</a>
//                     </span>
//                     <span className="">
//                         <a className="m-2"
//                             //  ng-if="Item.siteType!='Offshore Tasks'"
//                             style={{ cursor: "pointer" }} target="_blank"

//                         >
//                             <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" />
//                         </a>
//                     </span>

//                 </span>
//                 <span className="border p-1 me-1">{index + 1 + ".1"}</span>
//                 <textarea className="form-control"
//                 ></textarea>
//                 <button type="button" onClick={addRow}>
//                     addRow
//                 </button>
//             </span>
//         </div >
//     );

// }