import * as React from "react";
import { useEffect, useState } from "react";
import * as GlobalFunctionForUpdateItem from '../GlobalFunctionForUpdateItems';

const ShowSiteComposition = (Props: any) => {
    const SitesTaggingData: any = Props.SitesTaggingData;
    const AllSitesData: any = Props.AllSitesData;
    const [SiteTaggingData, setSiteTaggingData] = useState([]);

    useEffect(() => {
        if (SitesTaggingData?.length > 5) {
            try {
                let Data: any = JSON.parse(SitesTaggingData);
                Data = GlobalFunctionForUpdateItem.PrepareDataAccordingToSortOrder(AllSitesData, Data);
                if (Data?.length > 0) {
                    if (AllSitesData?.length > 0) {
                        AllSitesData?.map((AllSiteDataItem: any) => {
                            Data?.map((SCItem: any) => {
                                if (SCItem.Title == AllSiteDataItem.Title) {
                                    SCItem.ColorTag = AllSiteDataItem.Color_x0020_Tag;
                                }
                            })
                        })
                    }
                    setSiteTaggingData(Data)
                } else {
                    setSiteTaggingData([]);
                }
            } catch (error) {
                console.log("Error:", error.message)
            }
        }
    }, [])


    return (
        <>
            {SiteTaggingData?.length > 0 ?
                <div className="alignCenter">
                    {SiteTaggingData?.map((SCData: any) => {
                        return (
                            <span className="hover-text m-0" >
                                <span className="ClientCategory-Usericon" style={{ backgroundColor: `${SCData?.ColorTag}` }}>
                                    {SCData?.ClienTimeDescription != undefined ? Number(SCData?.ClienTimeDescription)?.toFixed(0) : 0}
                                </span>
                                <span className="tooltip-text pop-right">
                                    {SCData?.Title} : {SCData?.ClienTimeDescription != undefined ? Number(SCData?.ClienTimeDescription)?.toFixed(0) : 0} %
                                </span>
                            </span>
                        )
                    })}
                </div>
                : null}
        </>
    )
}

export default ShowSiteComposition;