import * as React from "react";
import { Label, makeStyles, mergeClasses, tokens, Tooltip, useId, } from "@fluentui/react-components";
import { Info16Regular, Add16Regular } from "@fluentui/react-icons";
const useStyles = makeStyles({
  root: {
    display: "flex",
    columnGap: tokens.spacingVerticalS,

  },
  visible: {
    color: tokens.colorNeutralForeground2BrandSelected,
  },
});
export const CustomToolTip = (props: any) => {
  const styles = useStyles();
  const contentId = useId("content");
  const [visible, setVisible] = React.useState(false);

  return (
    <div aria-owns={visible ? contentId : undefined} className={`${styles.root} InfoTooltip`}>
      <Tooltip
        content={{
          children:
            <span>
              {props?.CustomHtml}
            </span>, id: contentId,
        }} withArrow relationship="label" onVisibleChange={(e: any, data: any) => setVisible(data?.visible)}  >
        <Info16Regular tabIndex={0} className={mergeClasses(visible && styles.visible)} />
      </Tooltip>
    </div>
  );
};
