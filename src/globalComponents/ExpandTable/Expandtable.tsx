import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Tooltip from '../Tooltip';
const ExpndTable = (props: any) => {
  //  Must include id in the table section
  if (props !=undefined && props.prop1 != undefined) {
    $('#spPageCanvasContent').removeClass();
    $('#spPageCanvasContent').addClass(props.prop1)
  }
  // $('#spPageCanvasContent').addClass('test3')

  const showExpended = function (prope: any) {
    $('#spPageCanvasContent').removeClass();
    $('#spPageCanvasContent').addClass(prope)       
    props.prop(prope)
  }

  return (
    <>
      <svg data-bs-toggle="modal" data-bs-target="#exampleModal"
        width="15"
        height="15"
        viewBox="0 0 49 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M28.7008 8.11474C28.6373 8.17769 28.5854 8.68085 28.5854 9.23285V10.2362H32.1885C34.1703 10.2362 35.8467 10.2909 35.9139 10.3579C36.0353 10.4786 10.629 35.8669 10.3865 35.8669C10.3168 35.8669 10.2388 34.2221 10.2132 32.2115L10.1665 28.5562H9.12883H8.09114L8.04566 34.2782L8 40L13.6665 39.9548L19.3327 39.9093V38.8205V37.7318L15.8447 37.7517C13.3782 37.7658 12.3204 37.7135 12.2334 37.5733C12.1172 37.3864 37.3188 12.1284 37.6215 12.1284C37.6931 12.1284 37.7517 13.754 37.7517 15.7408V19.3532H38.8758H40V13.6766V8H34.4081C31.3324 8 28.7641 8.05161 28.7008 8.11474Z"
          fill="#333333"
        />
      </svg>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title"
                id="exampleModalLabel"
              >
                Expand Search Result
              </h1>
              <span><Tooltip ComponentId='3299'/></span>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body bg-f5f5" >
              <div className="row d-flex justify-content-center py-2 expandedpopup">
                <div
                  data-bs-dismiss="modal"
                  role={"button"}
                  onClick={() => showExpended("fifty")}
                  // props.prop("fifty")}
                  className={props.prop1 == "fifty"?" block p-5 text-light fw-bold  m-2  expandtiles  rounded-0 d-flex align-items-center justify-content-center BoxShadow":" block p-5 text-light fw-bold  m-2  expandtiles  rounded-0 d-flex align-items-center justify-content-center"}
                  id={props.prop1 == "fifty" ? "boxtrue " : "boxfalse"}
                >
                  50%
                </div>
                <div
                  data-bs-dismiss="modal"
                  role={"button"}
                  onClick={() => showExpended("sixty")}
                  className={props.prop1 == "sixty"?" block p-5 text-light fw-bold  m-2  expandtiles  rounded-0 d-flex align-items-center justify-content-center BoxShadow":" block p-5 text-light fw-bold  m-2  expandtiles  rounded-0 d-flex align-items-center justify-content-center"}
                   id={props.prop1 == "sixty" ? "boxtrue " : "boxfalse"}
                >
                  60%
                </div>
                <div
                  data-bs-dismiss="modal"
                  role={"button"}
                  onClick={() => showExpended("seventyfive")}
                  // props.prop("seventyfive")}
                  className={props.prop1 == "seventyfive"?" block p-5 text-light fw-bold  m-2  expandtiles  rounded-0 d-flex align-items-center justify-content-center BoxShadow":" block p-5 text-light fw-bold  m-2  expandtiles  rounded-0 d-flex align-items-center justify-content-center"}
                  id={props.prop1 == "seventyfive" ? "boxtrue " : "boxfalse"}
                >
                  75%
                </div>
                <div
                  data-bs-dismiss="modal"
                  role={"button"}
                  onClick={() => showExpended("hundred")}
                  // props.prop("hundred")}
                  className={props.prop1 == "hundred"?" block p-5 text-light fw-bold  m-2  expandtiles  rounded-0 d-flex align-items-center justify-content-center BoxShadow":" block p-5 text-light fw-bold  m-2  expandtiles  rounded-0 d-flex align-items-center justify-content-center"}
                  id={props.prop1 == "hundred" ? "boxtrue " : "boxfalse"}
                >
                  100%
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button  type="button" className="btn btn-default"  data-bs-dismiss="modal" >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ExpndTable;