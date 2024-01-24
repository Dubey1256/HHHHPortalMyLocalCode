import * as React from "react";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";


export default function SmartPriorityToolTip({ smartPriority, hoverFormula}: any) {
    const [controlledVisible, setControlledVisible] = React.useState(false);

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

   const handleSmartPriorityHover = () => {
    setControlledVisible(true)
   }
   
   const handleSmartPriorityLeave = () => {
    setControlledVisible(false)
   }

    return (
        <>
            <span
                ref={setTriggerRef}
                onMouseEnter={() => handleSmartPriorityHover()}
                onMouseLeave={() => handleSmartPriorityLeave()}
            >
                <span className="boldClable hreflink">{smartPriority}</span>
            </span>

            {visible && (
                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container" })}>
                    <span dangerouslySetInnerHTML={{ __html: hoverFormula, }}></span>
                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                </div>
            )}
        </>
    );
}
