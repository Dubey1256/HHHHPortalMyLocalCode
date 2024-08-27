import * as React from "react";
import {
  makeStyles,
  mergeClasses,
  tokens,
  Tooltip,
  useId,
} from "@fluentui/react-components";
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

export const TooltipComponent = (props: any) => {
  const styles = useStyles();
  const contentId = useId("content");
  const [visible, setVisible] = React.useState(false);

  return (
    <div aria-owns={visible ? contentId : undefined} className={`${styles.root} InfoTooltip `}>
      <Tooltip
        content={{
          children: props?.FullData,
          className: 'maXh-400 scrollbar',
          id: contentId,
        }}
        withArrow
        positioning='below'
        relationship="label"
        onVisibleChange={(e: any, data: any) => setVisible(data?.visible)}
      >
   
        {props?.usedFor === 'Add' ? <Add16Regular
          tabIndex={0}
          className={mergeClasses(visible && styles.visible)}
        /> : 
        props?.usedFor === 'Draft' ? <span className='svg__iconbox svg__icon--noshow me-1'></span> :
        props?.usedFor === 'Ready to Publish' ? <span className='svg__iconbox svg__icon--readytopublish me-1'></span>:props?.usedFor === 'Published' ? null : <Info16Regular
          tabIndex={0}
          className={mergeClasses(visible && styles.visible)}
        />}
      </Tooltip>
    </div>
  );
};
