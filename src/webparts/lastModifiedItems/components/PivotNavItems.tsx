import * as React from "react";
import { Pivot, PivotItem } from "@fluentui/react";

import styles from "./CommonControl.module.scss";

export interface INavPivotProps {
    Items: any[];
    SelectedKey: string;
    OnMenuClick: (item: PivotItem) => void;
}

const PivotNavItems: React.FunctionComponent<INavPivotProps> = (props) => {
    return (
        <div style={{display:'flex', paddingRight:'10px'}}>
            <Pivot selectedKey={props.SelectedKey} onLinkClick={props.OnMenuClick} aria-label="Pivot" className={styles.pivotControl}>
                {props.Items &&
                    props.Items.map( item => <PivotItem headerText={item.text} itemKey={item.key} />)
                }   
            </Pivot>
           
        </div>
    );
};

export default PivotNavItems;