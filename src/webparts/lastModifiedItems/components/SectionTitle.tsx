import * as React from "react";
import styles from "./CommonControl.module.scss";

export interface ISectionTitleProps {
    Title: string;
}

const SectionTitle = (props: ISectionTitleProps) => {
    return (
        <div className="heading d-flex ps-0 justify-content-between align-items-center " >
            <span>{props.Title}</span>
            <span className="text-end fs-6"><a href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/LastModifiedItems.aspx" target="_blank"> Old Last Modified Views</a> </span>
        </div>
    );
};

export default SectionTitle;