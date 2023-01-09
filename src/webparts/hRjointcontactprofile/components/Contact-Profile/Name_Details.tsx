import * as React from "react";
import {useState, useCallback} from 'react'
import HHHHEditComponent from "../../../hRjointcontactserach/components/contact-search/popup-components/HHHHEditcontact";

const Name_Details = (props: any) => {
  console.log("props data ====", props)
  const [editPopupStatus, setEditPopupStatus] = useState(false);
  const [contactData, setContactData]= useState();
  const editProfilePopupFunction=(e:any)=>{
    setEditPopupStatus(true)
    console.log("edit popup=====", props.data);
    setContactData(props.data.Id);
  }
  const closePopup = useCallback(()=>{
    setEditPopupStatus(false);
  },[])
  return (
    <div>
      <section className="mt-2">
        <div className="d-flex w-100 h-100">
          <div style={{ backgroundColor: "#EFEFEF", width: "15%", marginTop:"10px" }}>
            <img
              src={props.data.Item_x0020_Cover.Url}
              className="img-fluid w-100 h-100"
              alt="contact image"
            />
          </div>
          <div
            className="container-fluid text-start"
            style={{ width: "85%" }}
          >
            <div className="d-flex w-100 mb-2 p-1 justify-content-between">
              <h5>{props.data.FullName}</h5>
              <button type="button" className="btn btn-secondary" onClick={(e)=>editProfilePopupFunction(e)}><img src='https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif' /> Edit</button>
            </div>

            <div className="d-flex w-100">
              <div
                className="w-25 ms-1 mt-1 me-1 p-2"
                style={{ backgroundColor: "#EFEFEF" }}
              >
                <h6>Organization</h6>
              </div>
              <div className="w-75 mt-1 p-2" style={{ backgroundColor: "#EFEFEF" }}>
                {props.data.hasOwnProperty("Institution")
                  ? props.data.Institution.Title
                  : null}
              </div>
            </div>
            <div className="d-flex w-100">
              <div
                className="w-25 ms-1 me-1 mt-1 p-2"
                style={{ backgroundColor: "#EFEFEF" }}
              >
                <h6>Department</h6>
              </div>
              <div className="w-75 p-2 mt-1 " style={{ backgroundColor: "#EFEFEF" }}>
                {props.data.Department}
              </div>
            </div>
            <div className="d-flex w-100">
              <div
                className="w-25 ms-1 me-1 mt-1  p-2"
                style={{ backgroundColor: "#EFEFEF" }}
              >
                <h6>Job Title</h6>
              </div>
              <div className="w-75 p-2 mt-1" style={{ backgroundColor: "#EFEFEF" }}>
                {props.data.JobTitle}
              </div>
            </div>
          </div>
        </div>
        <hr className="w-100" />
      </section>
      {editPopupStatus? <HHHHEditComponent props={contactData} callBack={closePopup}/> : null}
    </div>
  );
};
export default Name_Details;