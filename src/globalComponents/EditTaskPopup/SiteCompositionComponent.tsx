import * as React from "react";
import { useState, useEffect } from 'react';

const SiteCompositionComponent = (Props: any) => {
    const SiteData = Props.SiteTypes;
    const ClientTime = Props.ClientTime;
    const siteUrls = Props.siteUrls;
    const TotalTime = Props.SmartTotalTimeData;
    const callBack = Props.callBack;
    const [SiteTypes, setSiteTypes] = useState([]);
    const [selectedSiteCount, setSelectedSiteCount] = useState(Props.ClientTime.length);
    const [ProportionalStatus, setProportionalStatus] = useState(true);
    const [ClientTimeData, setClientTimeData] = useState([]);
    const SiteCompositionSettings = JSON.parse(Props.SiteCompositionSettings);

    useEffect(() => {
        setSiteTypes(SiteData);
        let tempData: any = [];
        let tempData2: any = [];
        setClientTimeData(ClientTime);
        // GetAllSitesData();
        if (SiteData != undefined && SiteData.length > 0) {
            SiteData.map((SiteItem: any) => {
                if (SiteItem.Title !== "Health" && SiteItem.Title !== "Offshore Tasks" && SiteItem.Title !== "Gender" && SiteItem.Title !== "Small Projects") {
                    tempData.push(SiteItem);
                }
            })
            if (tempData != undefined && tempData.length > 0) {
                tempData?.map((data: any) => {
                    ClientTime?.map((ClientItem: any) => {
                        if (ClientItem.SiteName == data.Title || (ClientItem.SiteName ==
                            "DA E+E" && data.Title == "ALAKDigital")) {
                            data.BtnStatus = true
                        }
                    })
                    tempData2.push(data);
                })
            }
            setSiteTypes(tempData2);
        }
    }, [])
    const selectSiteCompositionFunction = (e: any, Index: any) => {
        let TempArray: any = [];
        if (SiteTypes != undefined && SiteTypes.length > 0) {
            SiteTypes.map((DataItem: any, DataIndex: any) => {
                if (DataIndex == Index) {
                    if (DataItem.BtnStatus) {
                        DataItem.BtnStatus = false
                        setSelectedSiteCount(selectedSiteCount - 1);
                        let TempArray: any = [];
                        ClientTime.map((Data: any) => {
                            if (Data.Title != DataItem) {
                                TempArray.push(Data)
                            }
                        })
                        setClientTimeData(TempArray);
                        callBack(TempArray);
                    } else {
                        DataItem.BtnStatus = true
                        setSelectedSiteCount(selectedSiteCount + 1);
                        const object = {
                            SiteName: DataItem.Title,
                            ClienTimeDescription: (100 / selectedSiteCount+1).toFixed(1),
                            localSiteComposition: true,
                            siteIcons: DataItem.Item_x005F_x0020_Cover
                        }
                        ClientTime.push(object);
                        setClientTimeData(ClientTime);
                        callBack(ClientTime);
                    }
                }
                TempArray.push(DataItem)
            })
        }
        setSiteTypes(TempArray);
    }

    const ChangeSiteCompositionSettings = (Type: any) => {
        if (Type == "Proportional") {
            const object = { ...SiteCompositionSettings[0], Proportional: true, Manual: false, Portfolio: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(true);
        }
        if (Type == "Manual") {
            const object = { ...SiteCompositionSettings[0], Proportional: false, Manual: true, Portfolio: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(false);
        }
        if (Type == "Portfolio") {
            const object = { ...SiteCompositionSettings[0], Proportional: false, Manual: false, Portfolio: true }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(true);
        }

    }
    return (
        <div>
            <div className="row">
                <a target="_blank " className="text-end siteColor" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/TaskUser-Management.aspx">
                    Task User Management
                </a>
            </div>
            {console.log("Site Type All in Div ========", SiteTypes)}
            <div className="col-sm-12 ps-3">
                <input
                    type="radio"
                    id="Proportional"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                    onChange={() => ChangeSiteCompositionSettings("Proportional")}
                    name="SiteCompositions"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                    title="add Proportional Time"
                    className="mx-1"
                />
                <label>Proportional</label>
                <input
                    type="radio"
                    id="Manual"
                    name="SiteCompositions"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Manual : false}
                    title="add manual Time"
                    className="mx-1"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0].Manual : false}
                    onChange={() => ChangeSiteCompositionSettings("Manual")}
                />
                <label>Manual</label>
                <input
                    type="radio"
                    id="Portfolio"
                    name="SiteCompositions"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Portfolio : false}
                    title="Portfolio"
                    ng-model="EqualType"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0].Portfolio : false}
                    onChange={() => ChangeSiteCompositionSettings("Portfolio")}
                    className="mx-1" />
                <label>
                    Portfolio
                </label>
                <img className="mt-0 siteColor mx-1" title="Click here to edit tagged portfolio site composition." ng-click="OpenPortfolioPopup()" ng-src="/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" src="/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" />
                <span className="pull-right">
                    <input type="checkbox" ng-model="checkCompositionType" ng-click="inheritSiteComposition(checkCompositionType)" className="form-check-input mb-0 ms-2 mt-1 mx-1 rounded-0" />
                    <label>
                        Overridden
                    </label>
                </span>
            </div>

            <div className="my-2 ps-3">
                <table className="table table-bordered mb-1">
                    {SiteTypes != undefined && SiteTypes.length > 0 ?
                        <tbody>
                            {SiteTypes?.map((siteData: any, index: any) => {
                                if (siteData.Title !== "Health" && siteData.Title !== "Offshore Tasks" && siteData.Title !== "Gender" && siteData.Title !== "Small Projects") {
                                    return (
                                        // <div key={siteData.Id} className="DashboardPublicationItem d-flex justify-content-between">
                                        //     <div>
                                        //         <input type="checkbox" className="form-check-input rounded-0 ms-2" />
                                        //         <img src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} style={{ width: '25px' }} className="mx-2" />
                                        //         {siteData.Title}
                                        //     </div>
                                        //     <div className="SitePercent my-1">
                                        //         <input type="text" className="form-control p-1" ng-change="TimeChange(site)" ng-disabled="site.flag ==false || EqualType=='Portfolio' || EqualType=='Proportional'" />
                                        //     </div>
                                        //     <div ng-show="site.flag==true" className="col-sm-1">
                                        //         %
                                        //     </div>
                                        //     <div className="col-sm-1">
                                        //         <span ng-show="site.flag ==true" className="ng-binding ng-hide">0.07h</span>
                                        //     </div>
                                        //     <div className="col-md-4">
                                        //         text comment
                                        //     </div>
                                        // </div>

                                        <tr>
                                            <th scope="row" className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                <input
                                                    className="form-check-input rounded-0" type="checkbox"
                                                    defaultChecked={siteData.BtnStatus}
                                                    value={siteData.BtnStatus}
                                                    onChange={(e) => selectSiteCompositionFunction(e, index)}
                                                />
                                            </th>
                                            <td className="m-0 p-0 align-middle" style={{ width: "30%" }}>
                                                <img src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} style={{ width: '25px' }} className="mx-2" />
                                                {siteData.Title}
                                            </td>
                                            <td className="m-0 p-1" style={{ width: "12%" }}>
                                                <input type="number" min="1" style={ProportionalStatus && siteData.BtnStatus ? { cursor: "not-allowed" } : {}} defaultValue={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) : ""} value={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) : ""} className="form-control p-1" ng-change="TimeChange(site)" ng-disabled="site.flag ==false || EqualType=='Portfolio' || EqualType=='Proportional'" readOnly={ProportionalStatus}
                                                />
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                <span ng-show="site.flag ==true" className="ng-binding ng-hide">{siteData.BtnStatus ? "%" : ''}</span>
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "12%" }}>
                                                <span ng-show="site.flag ==true" className="ng-binding ng-hide">{siteData.BtnStatus ? (TotalTime / selectedSiteCount).toFixed(2) + " h" : ''}</span>
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "36%" }}>
                                                <span ng-show="site.flag ==true" className="ng-binding ng-hide"></span>
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                        : null}
                </table>
                <div className="bg-secondary d-flex justify-content-end p-1 shadow-lg">
                    <div className="bg-body col-sm-2 p-1">
                        <div className="">100%</div>
                    </div>
                    <div className="bg-body col-sm-2 p-1 mx-2">
                        <div className="">{TotalTime}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SiteCompositionComponent;