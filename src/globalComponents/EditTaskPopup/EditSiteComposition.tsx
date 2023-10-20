import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from "../Tooltip";
import SiteCompositionComponent from "./SiteCompositionComponent";
import { Web } from "sp-pnp-js";

const EditSiteComposition = (Props: any) => {
    const [EditSiteCompositionStatus, setEditSiteCompositionStatus] = useState(true);
    const [SiteTypes, setSiteTypes] = useState([]);
    const ServicesTaskCheck = Props.ServicesTaskCheck;
    const AllListIdData = Props.AllListId;
    const siteUrls = Props.AllListId.siteUrl;
    const callBack = Props.Call;
    const SmartTotalTimeData = Props.SmartTotalTimeData;
    const selectedClientCategory: any = [];
    const ComponentTaskCheck = Props.ComponentTaskCheck;
    const SitesTaggingData = Props.SitesTaggingData;
    const EditData = Props.EditData;

    React.useEffect(() => {
        getAllSitesData();
        if (EditData.ClientCategory?.length > 0) {
            EditData.ClientCategory?.map((itemData: any) => {
                if (itemData.siteName?.length > 2) {
                } else {
                    itemData.siteName = itemData.SiteName;
                }
                selectedClientCategory.push(itemData);
            })
        }

    }, [])

    //  ******************  This is All Site Details Get Data Call From Backend **************

    const getAllSitesData = async () => {
        try {
            let web = new Web(siteUrls);
            let MetaData: any = [];
            let siteConfig: any = [];
            let tempArray: any = [];
            let AllClientCategoryData: any = [];
            MetaData = await web.lists
                .getById(AllListIdData.SmartMetadataListID)
                .items
                .select("Id,Title,listId,siteUrl,siteName,Configurations,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title")
                .top(4999)
                .expand('Author,Editor')
                .get()

            siteConfig = getSmartMetadataItemsByTaxType(MetaData, 'Sites');
            AllClientCategoryData = getSmartMetadataItemsByTaxType(MetaData, 'Client Category');
            siteConfig?.map((site: any) => {
                if (site.Title !== undefined && site.Title !== 'Foundation' && site.Title !== 'Master Tasks' && site.Title !== 'DRR' && site.Title !== "SDC Sites") {
                    site.BtnStatus = false;
                    site.isSelected = false;
                    if (site.Configurations?.length > 5) {
                        site.ConfigurationsData = JSON.parse(site.Configurations);
                        let tempArray: any = JSON.parse(site.Configurations);
                        if (tempArray?.length > 0) {
                            tempArray?.map((SiteCompoData: any) => {
                                let TodayDate = new Date();
                                let StartDate = SiteCompoData.StartDate?.split('/').reverse().join('-');
                                let EndDate = SiteCompoData.EndDate?.split('/').reverse().join('-');
                                if (new Date(StartDate) >= TodayDate || new Date(EndDate) <= TodayDate) {
                                    site.StartEndDateValidation = true;
                                } else {
                                    site.StartEndDateValidation = false;
                                }
                            })
                        }
                    } else {
                        site.ConfigurationsData = []
                    }
                    tempArray.push(site);
                }
            })
            if (AllClientCategoryData?.length > 0) {
                AllClientCategoryData?.map((CatgeoryData: any) => {
                    if (EditData.ClientTime?.length > 0) {
                        EditData.ClientTime.map((selectedData: any) => {
                            if (selectedData.Title == CatgeoryData.Title) {
                                selectedData.siteName = CatgeoryData.siteName;
                            }
                        })
                    }
                })
            }
            setSiteTypes(tempArray);
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }

    const SiteCompositionCallBack = React.useCallback((Data: any, Type: any) => {
        if (Data.ClientTime != undefined && Data.ClientTime.length > 0) {
            // setEnableSiteCompositionValidation(true)
            let tempArray: any = [];
            Data.ClientTime?.map((ClientTimeItems: any) => {
                if (ClientTimeItems.ClientCategory != undefined || ClientTimeItems.siteIcons?.length > 0 || ClientTimeItems.siteIcons?.Url.length > 0) {
                    let newObject: any = {
                        SiteName: ClientTimeItems.SiteName,
                        ClienTimeDescription: ClientTimeItems.ClienTimeDescription,
                        localSiteComposition: true
                    }
                    tempArray.push(newObject);
                } else {
                    tempArray.push(ClientTimeItems);
                }
            })
            const finalData = tempArray.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
            // setClientTimeData(finalData);
        } else {
            if (Type == "dataDeleted") {
                // setClientTimeData([{}])
            }
        }
        if (Data.selectedClientCategory != undefined && Data.selectedClientCategory.length > 0) {
            // setSelectedClientCategory(Data.selectedClientCategory);
        } else {
            if (Type == "dataDeleted") {
                // setSelectedClientCategory([]);
            }
        }
        if (Data.SiteCompositionSettings != undefined && Data.SiteCompositionSettings.length > 0) {
            // setSiteCompositionSetting(Data.SiteCompositionSettings);
        }
        console.log("Site Composition final Call back Data =========", Data);
    }, [])
    const onRenderEditSCCustomHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"} >
                <div className="subheading siteColor">
                    Edit Site Composition
                </div>
                <Tooltip ComponentId="1268" />
            </div>
        )
    }

    const closeEditSiteCompositionModel = () => {
        setEditSiteCompositionStatus(false);
        callBack("Close");
    }

    const closePopupCallBack = React.useCallback(() => {
        setEditSiteCompositionStatus(false);
        callBack("Close");
    }, [])

    return (
        <div>
            <Panel
                onRenderHeader={onRenderEditSCCustomHeader}
                isOpen={EditSiteCompositionStatus}
                onDismiss={closeEditSiteCompositionModel}
                isBlocking={false}
                type={PanelType.custom}
                customWidth="900px"
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena pt-2 edit-site-composition-on-task-profile" : "pt-2 edit-site-composition-on-task-profile"}>
                    {SiteTypes?.length > 0 ?
                        <>
                            <SiteCompositionComponent
                                AllListId={AllListIdData}
                                siteUrls={siteUrls}
                                SiteTypes={SiteTypes}
                                SelectedItemDetails={EditData}
                                // ClientTime={EditData.ClientTime != false ? EditData.ClientTime : []}
                                // SiteCompositionSettings={EditData.SiteCompositionSettings}
                                SmartTotalTimeData={SmartTotalTimeData}
                                // currentListName={EditData.siteType}
                                callBack={SiteCompositionCallBack}
                                isServiceTask={ServicesTaskCheck}
                                // SelectedClientCategory={EditData.ClientCategory}
                                isPortfolioConncted={ComponentTaskCheck || ServicesTaskCheck ? true : false}
                                SitesTaggingData={SitesTaggingData}
                                usedFor={"Task-Profile"}
                                // ItemId={EditData.Id}
                                // ListId={EditData.listId}
                                closePopupCallBack={closePopupCallBack}
                            />
                        </>
                        : null
                    }
                </div>
            </Panel>
        </div>
    )
}
export default EditSiteComposition;