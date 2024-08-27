import * as React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

export default function InfoIconTooltip(props: any) {
  const [controlledVisible, setControlledVisible] = React.useState(false);
  const [action, setAction] = React.useState("");
  const [showHoverTitle, setshowHoverTitle] = React.useState<any>();
  const [feedbackArray, setfeedbackArray] = React.useState([]);
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: null,
    interactive: true,
    closeOnOutsideClick: false,
    placement: "auto",
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
  });

  const handlAction = (newAction: any) => {
    if (action === "click" && newAction === "hover") return setAction("");
    let feedback: any = [];
    if (props?.FullData != undefined && newAction == 'click' || newAction == 'hover') {
      try {
        if (props?.FullData?.Title != undefined) {
          let hovertitle: any;
          if (newAction == "hover") {
            hovertitle = props?.FullData?.Title
            setshowHoverTitle(hovertitle)
            const obj = {
              Title: hovertitle,
              heading :props?.FullData?.Body,
          };
          feedback.push(obj);
          setfeedbackArray(feedback);
          }
        }
        else {
          if (props?.FullData?.Title == undefined) {
            let hovertitle: any;
            if (newAction == "hover") {
                hovertitle = "Title is not available in this. Please click to see other details"
              setshowHoverTitle(hovertitle)
            }
          }
          if (newAction == "hover") {
            setshowHoverTitle(hoverTitleShow?.Title)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    setAction(newAction);
    setControlledVisible(true);
  };

  const handleMouseLeave = () => {
    if (action === "Hover") return;
    setAction("");
    setControlledVisible(!controlledVisible);
  }

  const handleCloseClick = () => {
    setAction("");
    setControlledVisible(!controlledVisible);
  };

  return (
    <>
      <span ref={setTriggerRef}
        onClick={() => handlAction("click")}
        onMouseEnter={() => handlAction("hover")}
        onMouseLeave={() => handleMouseLeave()} className=" svg__iconbox svg__icon--info dark"></span>
      {action === "click" && visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container p-0 m-0" })}>

          <div>
            {props?.versionHistory != true ? <div className="tootltip-title">{props?.row?.TaskID != undefined ? props?.row?.TaskID : ""} :- {props?.row?.Title}</div> : <div className="tootltip-title">{props?.row?.TaskID != undefined ? props?.row?.TaskID : ""} :- {props?.row?.TaskTitle}</div>}
            <button className="toolTipCross" onClick={handleCloseClick} ><div className="popHoverCross">×</div></button>
          </div>
          <div className="toolsbox">
            {props?.FullData?.Title} 
          </div>
          <div {...getArrowProps({ className: "tooltip-arrow" })} />

        </div>
      )}
      {action === "hover" && visible && (
        <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
          <span className="tableTooltip" dangerouslySetInnerHTML={{ __html: showHoverTitle }}></span>
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
        </div>
      )}
    </>

  );
}