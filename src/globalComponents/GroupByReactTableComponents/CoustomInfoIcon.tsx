import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";

export default function CoustomInfoIcon(props: any) {
    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [action, setAction] = React.useState("");
    const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible, } = usePopperTooltip({ trigger: null, interactive: true, closeOnOutsideClick: false, placement: "auto", visible: controlledVisible, onVisibleChange: setControlledVisible, });
    const handlAction = (newAction: any) => {
        if (action === "click" && newAction === "hover") return;
        setAction(newAction); setControlledVisible(true);
    };
    const handleMouseLeave = () => { if (action === "click") return; setAction(""); setControlledVisible(!controlledVisible); };

    return (
        <>
            <span ref={setTriggerRef} onMouseEnter={() => handlAction("hover")} onMouseLeave={() => handleMouseLeave()} className="svg__iconbox svg__icon--info dark"></span>
            {action === "hover" && visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
                    <span>{props.Discription}</span>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
        </>
    );
}