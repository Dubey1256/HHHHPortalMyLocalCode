import * as React from "react";
import { useState, useEffect } from 'react';

const SiteCompositionComponent = (Props: any) => {
    const SiteData = Props.SiteTypes;
    const ClientTime = Props.ClientTime;
    const siteUrls = Props.siteUrls;
    const [SiteTypes, setSiteTypes] = useState([]);
    const [selectedSiteCount, setSelectedSiteCount] = useState(0);
    const [ProportionalStatus, setProportionalStatus] = useState(true);
    const SiteCompositionSettings = JSON.parse(Props.SiteCompositionSettings);
    useEffect(() => {
        setSiteTypes(SiteData);
        // GetAllSitesData();
        // if (ClientTime != undefined && ClientTime.length > 0) {
        //     ClientTime?.map((ClientItem: any) => {
        //         if (SiteData != undefined && SiteData.length > 0) {
        //             SiteData.map((SiteItem: any) => {
        //                 if (SiteItem.Title !== "Health" && SiteItem.Title !== "Offshore Tasks" && SiteItem.Title !== "Gender" && SiteItem.Title !== "Small Projects") {
        //                     if (ClientItem.SiteName == SiteItem.Title) {
        //                         SiteItem.Checked = true
        //                         selectedSiteCount + 1;
        //                         SiteTypes.push(SiteItem);
        //                     } else {
        //                         SiteItem.Checked = false;
        //                         SiteTypes.push(SiteItem);
        //                     }
        //                 }
        //             })
        //         }
        //     })
        // }
        // if (SiteData != undefined && SiteData.length > 0) {
        //     SiteData.map((SiteItem: any) => {
        //         if (SiteItem.Title !== "Health" && SiteItem.Title !== "Offshore Tasks" && SiteItem.Title !== "Gender" && SiteItem.Title !== "Small Projects") {
        //             // if (ClientTime != undefined && ClientTime.length > 0) {
        //             //     ClientTime?.map((ClientItem: any) => {
        //             //         if (ClientItem.SiteName == SiteItem.Title) {
        //             //             SiteItem.Checked = true
        //             //             selectedSiteCount + 1;
        //             //         } else {
        //             //             SiteItem.Checked = false;
        //             //         }
        //             //     })
        //             // }
        //             tempData.push(SiteItem);
        //         }
        //     })

        //     if (tempData != undefined && tempData.length > 0) {
        //         tempData?.map((data: any) => {
        //             ClientTime?.map((ClientItem: any) => {
        //                 if (ClientItem.SiteName == data.Title) {
        //                     data.BtnStatus = true
        //                     selectedSiteCount + 1;
        //                 } else {
        //                     data.BtnStatus = false;
        //                 }

        //             })
        //             tempData2.push(data);
        //         })
        //     }
        //     setSiteTypes(tempData2);
        // }
        // if(tempData != undefined && tempData.length > 0){
        //     tempData?.map((data:any)=>{
        //         SiteTypes.push(data)
        //     })
        // }
    })

    // const GetAllSitesData = () => {
    //     let siteIndex: any = [];
    //     SiteData?.map((data: any, index: any) => {
    //         ClientTime?.map((ClientItem: any) => {
    //             if (ClientItem.SiteName == data.Title) {
    //                 siteIndex.push(index);
    //             }
    //         })

    //     })

    // }
    const selectSiteCompositionFunction = (e: any, Index: any) => {
        let TempArray: any = [];
        if (SiteTypes != undefined && SiteTypes.length > 0) {
            SiteTypes.map((DataItem: any, DataIndex: any) => {
                if (DataIndex == Index) {
                    if (DataItem.BtnStatus) {
                        DataItem.BtnStatus = false
                        setSelectedSiteCount(selectedSiteCount - 1);
                    } else {
                        DataItem.BtnStatus = true
                        setSelectedSiteCount(selectedSiteCount + 1)
                    }
                }
                TempArray.push(DataItem)
            })
        }
        setSiteTypes(TempArray);
    }

    // const getSmartMetaData = async () => {
    //     let web = new Web(Props.siteUrls);
    //     let MetaData: any = [];
    //     let siteConfig: any = [];
    //     let tempArray: any = [];
    //     MetaData = await web.lists
    //         .getByTitle('SmartMetadata')
    //         .items
    //         .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title")
    //         .top(4999)
    //         .expand('Author,Editor')
    //         .get()

    //     siteConfig = getSmartMetadataItemsByTaxType(MetaData, 'Sites');
    //     siteConfig?.map((site: any) => {
    //         if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== "Small Projects" && site.Title !== "SDC Sites" && site.Title !== "Gender" && site.Title !== "Health" && site.Title !== "Offshore Tasks") {
    //             site.BtnStatus = false;
    //             tempArray.push(site);
    //         }
    //     })
    //     setSiteTypes(tempArray);
    //     tempArray?.map((tempData: any) => {
    //         SiteTypeBackupArray.push(tempData);
    //     })

    // }
    // var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
    //     var Items: any = [];
    //     metadataItems.map((taxItem: any) => {
    //         if (taxItem.TaxType === taxType)
    //             Items.push(taxItem);
    //     });
    //     Items.sort((a: any, b: any) => {
    //         return a.SortOrder - b.SortOrder;
    //     });
    //     return Items;
    // }
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
                                                <input type="number"  min="1" style={ProportionalStatus && siteData.BtnStatus ? { cursor: "not-allowed" } : {}} defaultValue={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) : ""} className="form-control p-1" ng-change="TimeChange(site)" ng-disabled="site.flag ==false || EqualType=='Portfolio' || EqualType=='Proportional'" readOnly={ProportionalStatus && siteData.BtnStatus} />
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                <span ng-show="site.flag ==true" className="ng-binding ng-hide">{siteData.BtnStatus ? "%" : ''}</span>
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "12%" }}>
                                                <span ng-show="site.flag ==true" className="ng-binding ng-hide">{siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) + "h" : ''}</span>
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
                        <div className="">1.1h</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SiteCompositionComponent;