import * as React from "react";
import '../../webparts/taskDashboard/components/TaskDashboard.scss';
import '../../webparts/taskDashboard/components/foundation.scss';
const { useState,useCallback } = React;
import { memo } from "react";


export default function FroalaCommnetBoxes() {

    // Initialise the state as an empty array
    const [state, setState] = useState([]);
    const [Texts, setTexts] = useState(false);

    const addRow = useCallback(() => {
        const object = { name: '', age: '', role: '' };
        setState([...state, object]);
        setTexts(!Texts);
      }, [state]);

   
    const RemoveItem = useCallback(()=>{
          
    },[])
 
    function handleChange(e: any) {

        // Check to see if the element that's changed
        // is an input
        if (e.target.matches('input')) {

            // Get the id from the div dataset
            const { id } = e.currentTarget.dataset;

            // Get the name and value from the changed element
            const { name, value } = e.target;

            // Copy the state
            const copy = [...state];

            // Create a new object using the object in state
            // at index === id, and update the correct property
            const obj = { ...state[id], [name]: value };

            // Add that object to the state copy
            copy[id] = obj;

            // Finally update the state
            setState(copy);
        }
    }

    // We now create some rows by mapping
    // over the data and returning an array
    // of components which have an id based
    // on their position in the state array, some
    // data contained in the object, and the handler
    function createRows(state: any[]) {
        return state.map((obj, i) => {
            return (
                <div
                //   data-id={id}
                className="row"
                onChange={handleChange}
            >
    
                <span> <span className="md2">
                    <input type="checkbox" id="" style={{ marginTop: "-1px" }}
                        name="chkCompleted" ng-model="item.Phone"
                        ng-click="checkCompleted(Completed,'Phone',item.Phone)" />
                </span>
                    <span>
                        Phone
                    </span>
                    <span>|</span>
                    <span className="md2">
                        <input type="checkbox" id="" style={{ marginTop: "-1px" }}
                            name="chkCompleted" ng-model="item.LowImportance"
                            ng-click="checkCompleted(Completed)" />
                    </span>
                    <span>
                        Low Importance
                    </span>
                    <span>|</span>
    
                    <span className="md2">
                        <input type="checkbox" id="" style={{ marginTop: "-1px" }}
                            name="chkCompleted" ng-model="item.HighImportance"
                            ng-click="checkCompleted(Completed)" />
                    </span>
                    <span>
                        High Importance
                    </span>
                    <span>|</span>
    
                    <span className="md2">
                        <input type="checkbox" id="" style={{ marginTop: "-1px" }}
                            name="chkCompleted" ng-model="item.Completed"
                            ng-click="checkCompleted(item.Completed,'markAsCompleted',item)" />
                    </span>
                    <span
                        ng-bind-html="GetColumnDetails('markAsCompleted') | trustedHTML">
                    </span>
                    <span>|</span>
                    <span className="">
                        <a className=" m-2" style={{ cursor: "pointer" }}
                            ng-click="showCommentBox(item)"
                            ng-bind-html="GetColumnDetails('addComment') | trustedHTML"></a>
    
                    </span>
                    <span ng-if="$index!=0">|</span>
    
    
        <span className="">
            <a className="m-2" ng-if="Item.siteType!='Offshore Tasks'"
                style={{ cursor: "pointer" }} target="_blank"
                ng-href="{{pageContext}}/SitePages/CreateTask.aspx"
                ng-click="opencreatetask($index)"
                ng-bind-html="GetColumnDetails('CreateTask') | trustedHTML">Task</a>
        </span>
        <span className="">
        <a className="m-2"
        //  ng-if="Item.siteType!='Offshore Tasks'"
            style={{ cursor: "pointer" }} target="_blank"
           onClick={RemoveItem}
            ><img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"/></a>
    </span>
    
    
                    <textarea
                        style={{ width: "111%" }}
                        className="form-control"
                        ng-model="item.Title"></textarea>
                         {/* <button onClick={addRow}>Add New Box</button> */}
                         
            {/* {state.length==1 || 2 || 3 ?<button className="btn btn-primary" onClick={addRow}>Add New Box</button>:""} */}
                         
               
                    {/* <button type="button" className="btn btn-primary" onClick={addRow} name="name">Add New Box</button> */}
    
    
                </span>
                {/* <label>Age
            <input name="age"
              value={age}
              />
          </label>
          <label>Role
            <input name="role" 
             value={role} 
            />
          </label> */}
            </div >
            );
        });
    }

    // Small function to show state when a
    // button is clicked

    // Check to see if state has length, and then
    // create the rows
    return (
        <div>
            {<button className="btn btn-primary" onClick={addRow}>Add New Box</button>}
            {/* <button onClick={showState}>Show state</button> */}
            {state.length ? createRows(state) : <div />}
        </div>
    );

}




// Row accepts and id, some data, and the handler
// id: any,
function Row( handleChange: any,addRow:any) {

    // Destructure the information from `data`
    //   const { name, age, role } = data;

    // Build the Row JSX. Note that we add the
    // id as a data attribute on the div element
    
    return (
        <div
            //   data-id={id}
            className="row"
            onChange={handleChange}
        >

            <span>
                <span className="pull-right">
                 <span className="md2">
                <input type="checkbox" id="" style={{ marginTop: "-1px" }}
                    name="chkCompleted" ng-model="item.Phone"
                    ng-click="checkCompleted(Completed,'Phone',item.Phone)" />
            </span>
                <span>
                    Phone
                </span>
                <span>|</span>
                <span className="md2">
                    <input type="checkbox" id="" style={{ marginTop: "-1px" }}
                        name="chkCompleted" ng-model="item.LowImportance"
                        ng-click="checkCompleted(Completed)" />
                </span>
                <span>
                    Low Importance
                </span>
                <span>|</span>

                <span className="md2">
                    <input type="checkbox" id="" style={{ marginTop: "-1px" }}
                        name="chkCompleted" ng-model="item.HighImportance"
                        ng-click="checkCompleted(Completed)" />
                </span>
                <span>
                    High Importance
                </span>
                <span>|</span>

                <span className="md2">
                    <input type="checkbox" id="" style={{ marginTop: "-1px" }}
                        name="chkCompleted" ng-model="item.Completed"
                        ng-click="checkCompleted(item.Completed,'markAsCompleted',item)" />
                </span>
                <span
                    ng-bind-html="GetColumnDetails('markAsCompleted') | trustedHTML">markAsCompleted
                </span>
                <span>|</span>
                <span className="">
                    <a className=" m-2" style={{ cursor: "pointer" }}
                        ng-click="showCommentBox(item)"
                        ng-bind-html="GetColumnDetails('addComment') | trustedHTML">addComment</a>

                </span>
                <span ng-if="$index!=0">|</span>


    <span className="">
        <a className="m-2" ng-if="Item.siteType!='Offshore Tasks'"
            style={{ cursor: "pointer" }} target="_blank"
            ng-href="{{pageContext}}/SitePages/CreateTask.aspx"
            ng-click="opencreatetask($index)"
            ng-bind-html="GetColumnDetails('CreateTask') | trustedHTML">CreateTask</a>
    </span>
    <span className="">
        <a className="m-2"
        //  ng-if="Item.siteType!='Offshore Tasks'"
            style={{ cursor: "pointer" }} target="_blank"
           
            ><img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif"/></a>
    </span>
    <span className="">
        <a className="m-2" ng-if="Item.siteType!='Offshore Tasks'"
            style={{ cursor: "pointer" }} target="_blank"
            ng-href="{{pageContext}}/SitePages/CreateTask.aspx"
            ng-click="opencreatetask($index)"
            ng-bind-html="GetColumnDetails('CreateTask') | trustedHTML">Add Sub Box</a>
    </span>
              </span>


                <textarea
                    style={{ width: "111%" }}
                    className="form-control"
                    ng-model="item.Title"></textarea>
                     <button onClick={addRow}>Add New Box</button>
                     
           
                {/* <button type="button" className="btn btn-primary" onClick={addRow} name="name">Add New Box</button> */}


            </span>
            {/* <label>Age
        <input name="age"
          value={age}
          />
      </label>
      <label>Role
        <input name="role" 
         value={role} 
        />
      </label> */}
        </div >
    );

}