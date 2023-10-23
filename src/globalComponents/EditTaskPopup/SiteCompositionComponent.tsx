import * as React from "react";
import { useState, useEffect } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import EditComponentProtfolio from '../../webparts/EditPopupFiles/EditComponent';
import Tooltip from "../Tooltip";
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';

var AutoCompleteItemsArray: any = [];
var SelectedClientCategoryBackupArray: any = [];
var BackupSiteTypeData: any = [];
var SiteTaggingFinalData: any = [];
let ClientTimeDataBackup: any = [];

const SiteCompositionComponent = (Props: any) => {
    const SiteData = Props.SiteTypes;
    const SelectedTaskDetails: any = Props?.SelectedItemDetails;
    var ClientTime = SelectedTaskDetails?.ClientTime != undefined && SelectedTaskDetails?.ClientTime != false ? SelectedTaskDetails?.ClientTime : [];
    // var SitesTaggingData: any = SelectedTaskDetails.Portfolio?.length > 0 ? SelectedTaskDetails.Portfolio[0] : [] ;
    const isPortfolioConncted = Props.isPortfolioConncted;
    const AllListIdData: any = Props.AllListId
    const siteUrls = Props.siteUrls;
    const TotalTime = Props.SmartTotalTimeData;
    const callBack = Props.callBack;
    const ListId = SelectedTaskDetails?.listId;
    const currentListName = SelectedTaskDetails?.siteType;
    const usedFor = Props.usedFor;
    const ItemId = SelectedTaskDetails?.Id;
    const ServicesTaskCheck = Props.isServiceTask;
    const [SiteCompositionSettings, setSiteCompositionSettings] = useState<any>(SelectedTaskDetails?.SiteCompositionSettings != undefined ? JSON.parse(SelectedTaskDetails?.SiteCompositionSettings) : [{ Proportional: false, Manual: true, Portfolio: false, localSiteComposition: false, Delux: false, Standard: false }]);
    const SelectedClientCategoryFromProps = SelectedTaskDetails?.ClientCategory;
    const [SiteTypes, setSiteTypes] = useState([]);
    const [selectedSiteCount, setSelectedSiteCount] = useState(Props.ClientTime != undefined || Props.ClientTime != null ? Props.ClientTime?.length : 0);
    const [ProportionalStatus, setProportionalStatus] = useState(true);
    let [ClientTimeData, setClientTimeData] = useState<any>([]);
    const [ClientCategoryPopupStatus, setClientCategoryPopupStatus] = useState(false);
    const [AllClientCategoryData, setAllClientCategoryData] = useState([]);
    const [SelectedSiteClientCategoryData, setSelectedSiteClientCategoryData] = useState([]);
    const [searchedKey, setSearchedKey] = useState('');
    const [SearchedKeyForEPS, setSearchedKeyForEPS] = useState('');
    const [SearchedKeyForEI, setSearchedKeyForEI] = useState('');
    const [SearchedKeyForEducation, setSearchedKeyForEducation] = useState('');
    const [SearchedKeyForMigration, setSearchedKeyForMigration] = useState('');
    const [SearchWithDescriptionStatus, setSearchWithDescriptionStatus] = useState(true);
    const [SearchedClientCategoryData, setSearchedClientCategoryData] = useState([]);
    const [SearchedClientCategoryDataForInput, setSearchedClientCategoryDataForInput] = useState([]);
    const [selectedClientCategory, setSelectedClientCategory] = useState([]);
    const [ClientCategoryPopupSiteName, setClientCategoryPopupSiteName] = useState('');
    const [EPSClientCategory, setEPSClientCategory] = useState([]);
    const [EIClientCategory, setEIClientCategory] = useState([]);
    const [EducationClientCategory, setEducationClientCategory] = useState([]);
    const [MigrationClientCategory, setMigrationClientCategory] = useState([]);
    const [isPortfolioComposition, setIsPortfolioComposition] = useState(false);
    const [IsProtectedSiteComposition, setIsProtectedSiteComposition] = useState(false);
    const [EditComponentPanelStaus, setEditComponentPanelStaus] = useState(false);
    const [checkBoxStatus, setCheckBoxStatus] = useState(false);
    const [selectedComponentData, setSelectedComponentData] = useState<any>([]);
    const closePopupCallBack = Props.closePopupCallBack;
    const SiteCompositionObject: any = {
        ClientTime: [],
        selectedClientCategory: [],
        SiteCompositionSettings: []
    }

    const StandardComposition =
        [
            {
                ClienTimeDescription: "40",
                SiteName: "EI",
                localSiteComposition: true,
                siteIcons: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png",
                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
            },
            {
                ClienTimeDescription: "30",
                SiteName: "EPS",
                localSiteComposition: true,
                siteIcons: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png",
                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
            },
            {
                ClienTimeDescription: "15",
                SiteName: "Migration",
                localSiteComposition: true,
                siteIcons: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png",
                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
            },
            {
                ClienTimeDescription: "15",
                SiteName: "Education",
                localSiteComposition: true,
                siteIcons: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_education.png",
                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
            }
        ]

    const DeluxComposition = [
        {
            ClienTimeDescription: "50",
            SiteName: "EI",
            localSiteComposition: true,
            siteIcons: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png",
            Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
        },
        {
            ClienTimeDescription: "50",
            SiteName: "EPS",
            localSiteComposition: true,
            siteIcons: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png",
            Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
        },
    ]

    useEffect(() => {
        setSiteTypes(SiteData);
        ClientTimeDataBackup = ClientTime != undefined ? JSON.parse(JSON.stringify(ClientTime)) : [];
        let tempData: any = [];
        let tempData2: any = [];
        BackupSiteTypeData = []
        if (ClientTime == null || ClientTime == false || ClientTime == undefined || ClientTime?.length == 0) {
            const CompositionObject: any = {
                SiteName: SelectedTaskDetails?.siteType,
                ClienTimeDescription: 100,
                localSiteComposition: true,
                siteIcons: SelectedTaskDetails?.SiteIcon
            }
            setClientTimeData([CompositionObject]);
            ClientTime = [CompositionObject];
            SiteTaggingFinalData = [CompositionObject];
            setSelectedSiteCount(1)
        } else {
            setClientTimeData(ClientTime);
            setSelectedSiteCount(ClientTime?.length);
        }
        loadAllCategoryData();
        if (SelectedClientCategoryFromProps != undefined && SelectedClientCategoryFromProps.length > 0) {
            setSelectedClientCategory(SelectedClientCategoryFromProps);
            SelectedClientCategoryFromProps?.map((dataItem: any) => {
                if (dataItem.siteName == "EPS") {
                    // setEPSClientCategory([dataItem])
                    EPSClientCategory.push(dataItem);
                }
                if (dataItem.siteName == "EI") {
                    // setEIClientCategory([dataItem])
                    EIClientCategory.push(dataItem);
                }
                if (dataItem.siteName == "Education") {
                    // setEducationClientCategory([dataItem])
                    EducationClientCategory.push(dataItem);
                }
                if (dataItem.siteName == "Migration") {
                    // setMigrationClientCategory([dataItem])
                    MigrationClientCategory.push(dataItem);
                }
                // SelectedClientCategoryBackupArray.push(dataItem);
            })
            SelectedClientCategoryBackupArray = SelectedClientCategoryFromProps;
        }
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
                            data.ClienTimeDescription = ClientItem.ClienTimeDescription;
                            data.BtnStatus = true;
                        }
                    })
                    tempData2.push(data);
                    BackupSiteTypeData.push(data);
                })
            }
            setSiteTypes(tempData2);
        }

        if (SiteCompositionSettings != undefined && SiteCompositionSettings.length > 0) {
            if (SiteCompositionSettings[0].Proportional) {
                setProportionalStatus(true);
            }
            if (SiteCompositionSettings[0].Manual || SiteCompositionSettings[0].Delux || SiteCompositionSettings[0].Standard) {
                if (SiteCompositionSettings[0].Delux || SiteCompositionSettings[0].Standard) {
                    setIsPortfolioComposition(true);
                    setIsProtectedSiteComposition(true);
                    setProportionalStatus(true);
                }
                setProportionalStatus(false);
            }
            if (SiteCompositionSettings[0].Portfolio) {
                setIsPortfolioComposition(true);
                setCheckBoxStatus(true)
            }
            if (SiteCompositionSettings[0].Protected) {
                setIsProtectedSiteComposition(true);

            }
        }

        if (SelectedTaskDetails.Portfolio?.length > 0) {
            setSelectedComponentData(SelectedTaskDetails.Portfolio);

        } else {
            setSelectedComponentData([]);
        }
    }, [])

    const selectSiteCompositionFunction = (e: any, Index: any) => {
        let TempArray: any = [];
        if (SiteTypes != undefined && SiteTypes.length > 0) {
            SiteTypes.map((DataItem: any, DataIndex: any) => {
                if (DataIndex == Index) {
                    if (DataItem.BtnStatus) {
                        DataItem.BtnStatus = false;
                        DataItem.ClienTimeDescription = 0;
                        setSelectedSiteCount(selectedSiteCount - 1);
                        let TempArray: any = [];
                        if (ClientTimeData != undefined && ClientTimeData.length > 0) {
                            ClientTimeData.map((Data: any) => {
                                if (Data.SiteName != DataItem.Title) {
                                    TempArray.push(Data)
                                }
                            })
                        }
                        let tempDataForRemove: any = [];
                        if (ProportionalStatus) {
                            TempArray?.map((dataItem: any) => {
                                dataItem.ClienTimeDescription = (100 / (selectedSiteCount - 1)).toFixed(1);
                                tempDataForRemove.push(dataItem);
                            })
                        }

                        setClientTimeData(tempDataForRemove);
                        SiteCompositionObject.ClientTime = tempDataForRemove;
                        SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
                        ClientTime = tempDataForRemove;
                        SiteTaggingFinalData = tempDataForRemove;
                        // if (tempDataForRemove?.length > 0) {
                        //     callBack(SiteCompositionObject, "dataExits");
                        // } else {
                        //     callBack(SiteCompositionObject, "dataDeleted")
                        // }

                    } else {
                        if (DataItem.StartEndDateValidation) {
                            alert("This site has an end date so you cannot add it to Site Composition.")
                        } else {
                            DataItem.BtnStatus = true
                            setSelectedSiteCount(selectedSiteCount + 1);
                            const object = {
                                SiteName: DataItem.Title,
                                ClienTimeDescription: (100 / (selectedSiteCount + 1)).toFixed(1),
                                localSiteComposition: true,
                                siteIcons: DataItem.Item_x005F_x0020_Cover
                            }
                            ClientTimeData.push(object);
                            let tempData: any = [];
                            ClientTimeData?.map((TimeData: any) => {
                                TimeData.ClienTimeDescription = (100 / (selectedSiteCount + 1)).toFixed(1);
                                tempData.push(TimeData);
                            })
                            setClientTimeData(tempData);
                            SiteCompositionObject.ClientTime = tempData;
                            SiteTaggingFinalData = tempData;
                            SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
                            // callBack(SiteCompositionObject, "dataExits");
                        }
                    }
                }
                TempArray.push(DataItem)
            })
        }
        setSiteTypes([...TempArray]);
    }
    const ChangeSiteCompositionSettings = (Type: any) => {
        if (Type == "Proportional") {
            SiteCompositionSettings[0].Delux = false;
            SiteCompositionSettings[0].Standard = false;
            SiteCompositionSettings[0].Proportional = true;
            SiteCompositionSettings[0].Manual = false;
            SiteCompositionSettings[0].Portfolio = false;
            setProportionalStatus(true);
            let tempData: any = [];
            ClientTime?.map((TimeData: any) => {
                TimeData.ClienTimeDescription = (100 / (selectedSiteCount)).toFixed(1);
                tempData.push(TimeData);
            })
            SiteCompositionObject.ClientTime = tempData;
            SiteTaggingFinalData = tempData;
            callBack(SiteCompositionObject, "dataExits");
            setIsPortfolioComposition(false);
            setCheckBoxStatus(false);
           
            refreshSiteCompositionConfigurations();
            ChangeSiteCompositionInstant("Proportional");
            if(IsProtectedSiteComposition){
                setIsProtectedSiteComposition(true);
            }else{
                setIsProtectedSiteComposition(false);
            }
        }
        if (Type == "Manual") {
            SiteCompositionSettings[0].Delux = false;
            SiteCompositionSettings[0].Standard = false;
            SiteCompositionSettings[0].Proportional = false;
            SiteCompositionSettings[0].Manual = true;
            SiteCompositionSettings[0].Portfolio = false;
            setProportionalStatus(false);
            setIsPortfolioComposition(false);
            setCheckBoxStatus(false);
            setIsProtectedSiteComposition(false);
            SiteTaggingFinalData = ClientTimeDataBackup;
            refreshSiteCompositionConfigurations();
            ChangeSiteCompositionInstant("Manual");
            setSelectedSiteCount(ClientTimeDataBackup?.length > 0 ? ClientTimeDataBackup?.length : 0);
            if(IsProtectedSiteComposition){
                setIsProtectedSiteComposition(true);
            }else{
                setIsProtectedSiteComposition(false);
            }
        }
        if (Type == "Portfolio") {
            SiteCompositionSettings[0].Delux = false;
            SiteCompositionSettings[0].Standard = false;
            SiteCompositionSettings[0].Proportional = false;
            SiteCompositionSettings[0].Manual = false;
            SiteCompositionSettings[0].Portfolio = true;
            refreshSiteCompositionConfigurations();
            if (selectedComponentData?.Id != undefined) {
                // if (SitesTaggingData != undefined && SitesTaggingData.length > 0 || ClientTime != undefined && ClientTime.length > 0) {
                //     ClientTimeData = SitesTaggingData != undefined ? SitesTaggingData : ClientTime;
                //     SiteTaggingFinalData = SitesTaggingData != undefined ? SitesTaggingData : ClientTime;
                //     setIsPortfolioComposition(true);
                //     setProportionalStatus(true);
                //     setCheckBoxStatus(true);
                //     onChangeCompositionSetting()
                // } else {
                //     setIsPortfolioComposition(false);
                //     setCheckBoxStatus(false);
                //     setClientTimeData([])
                // }
            } else {
                alert("There are No Tagged Portfolio Item");
            }
        }
        // if (Type == "Overridden") {
        //     let object: any;
        //     if (SiteCompositionSettings[0].localSiteComposition == true) {
        //         SiteCompositionSettings[0].localSiteComposition = false;
        //     } else {
        //         SiteCompositionSettings[0].localSiteComposition = true;
        //     }
        //     SiteCompositionSettings[0] = object;
        // }
        if (Type == "Protected") {
            if (SiteCompositionSettings[0]?.Protected == true) {
                if (SiteCompositionSettings[0].Delux == true || SiteCompositionSettings[0].Standard == true) {
                    setIsProtectedSiteComposition(true);
                } else {
                    SiteCompositionSettings[0].Protected = false;
                    setIsProtectedSiteComposition(false);
                }

            } else {
                SiteCompositionSettings[0].Protected = true;
                SiteTaggingFinalData = ClientTimeData;
                setIsProtectedSiteComposition(true);
            }
        }

        if (Type == "Delux") {
            if (SiteCompositionSettings[0]?.Delux == true) {
                SiteCompositionSettings[0].Delux = false;
                setIsProtectedSiteComposition(false);
            } else {
                SiteCompositionSettings[0].Delux = true;
                SiteCompositionSettings[0].Standard = false;
                SiteCompositionSettings[0].Proportional = false;
                SiteCompositionSettings[0].Manual = false;
                SiteCompositionSettings[0].Portfolio = false;
                refreshSiteCompositionConfigurations();
                ChangeSiteCompositionInstant("Delux");
                SiteTaggingFinalData = DeluxComposition;
                setProportionalStatus(true);
                setIsPortfolioComposition(true);
                setIsProtectedSiteComposition(true);
            }
        }
        if (Type == "Standard") {
            if (SiteCompositionSettings[0]?.Standard == true) {
                SiteCompositionSettings[0].Standard = false;
                setIsProtectedSiteComposition(false);
            } else {
                SiteCompositionSettings[0].Delux = false;
                SiteCompositionSettings[0].Standard = true;
                SiteCompositionSettings[0].Proportional = false;
                SiteCompositionSettings[0].Manual = false;
                SiteCompositionSettings[0].Portfolio = false;
                refreshSiteCompositionConfigurations();
                ChangeSiteCompositionInstant("Standard");
                SiteTaggingFinalData = StandardComposition;
                setProportionalStatus(true);
                setIsPortfolioComposition(true);
                setIsProtectedSiteComposition(true);
            }
        }
        SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
        SiteCompositionObject.ClientTime = ClientTimeData;

        // callBack(SiteCompositionObject, "dataExits");
        // }
    }

    const refreshSiteCompositionConfigurations = () => {
        let TempArray: any = [];
        SiteTypes?.map((ItemData: any) => {
            ItemData.ClienTimeDescription = "";
            ItemData.BtnStatus = false;
            ItemData.Date = '';
            ItemData.readOnly = false;
            TempArray.push(ItemData);
        })
        setSiteTypes([...TempArray])
    }

    const ChangeSiteCompositionInstant = (UsedFor: any) => {
        let TempSiteCompsotion: any = [];
        if (UsedFor == "Standard") {
            SiteTypes?.map((SiteData: any) => {
                StandardComposition?.map((STItems: any) => {
                    if (SiteData.Title == STItems.SiteName || (STItems.SiteName ==
                        "DA E+E" && STItems.SiteName == "ALAKDigital")) {
                        SiteData.ClienTimeDescription = STItems.ClienTimeDescription;
                        SiteData.BtnStatus = true;
                        SiteData.Date = STItems.Date;
                    }
                })
                TempSiteCompsotion.push(SiteData)
            })
        }
        if (UsedFor == "Delux") {
            SiteTypes?.map((SiteData: any) => {
                DeluxComposition?.map((STItems: any) => {
                    if (SiteData.Title == STItems.SiteName || (STItems.SiteName ==
                        "DA E+E" && STItems.SiteName == "ALAKDigital")) {
                        SiteData.ClienTimeDescription = STItems.ClienTimeDescription;
                        SiteData.BtnStatus = true;
                        SiteData.Date = STItems.Date;
                    }
                })
                TempSiteCompsotion.push(SiteData)
            })
        }
        if (UsedFor == "Proportional") {
            SiteTypes?.map((SiteData: any) => {
                ClientTimeDataBackup?.map((STItems: any) => {
                    if (SiteData.Title == STItems.SiteName || (STItems.SiteName ==
                        "DA E+E" && STItems.SiteName == "ALAKDigital")) {
                        SiteData.ClienTimeDescription = (100 / (ClientTimeDataBackup?.length)).toFixed(1);
                        SiteData.BtnStatus = true;
                        SiteData.Date = STItems.Date;
                    }
                })
                TempSiteCompsotion.push(SiteData)
            })
        }
        if (UsedFor == "Manual") {
            SiteTypes?.map((SiteData: any) => {
                ClientTimeDataBackup?.map((STItems: any) => {
                    if (SiteData.Title == STItems.SiteName || (STItems.SiteName ==
                        "DA E+E" && STItems.SiteName == "ALAKDigital")) {
                        SiteData.ClienTimeDescription = STItems.ClienTimeDescription;
                        SiteData.BtnStatus = true;
                        SiteData.Date = STItems.Date;
                    }
                })
                TempSiteCompsotion.push(SiteData)
            })
        }
        setSiteTypes([...TempSiteCompsotion]);
    }

    const onChangeCompositionSetting = () => {
        let TempArray: any = [];
        if (BackupSiteTypeData != undefined && BackupSiteTypeData.length > 0) {
            BackupSiteTypeData?.map((data: any) => {
                ClientTimeData?.map((ClientItem: any) => {
                    if (ClientItem.SiteName == data.Title || (ClientItem.SiteName ==
                        "DA E+E" && data.Title == "ALAKDigital")) {
                        data.ClienTimeDescription = ClientItem.ClienTimeDescription;
                        data.BtnStatus = true
                    }
                })
                TempArray.push(data);
            })
            setSiteTypes(TempArray)
            // setSelectedSiteCount(ClientTimeData?.length)
        }
    }

    //    ************** this is for Client Category Popup Functions **************


    //    ********** this is for Client Category Related all function and callBack function for Picker Component Popup ********
    var SmartTaxonomyName = "Client Category";
    const loadAllCategoryData = function () {
        var AllTaskUsers = []
        var AllMetaData: any = []
        var url = (`${siteUrls}/_api/web/lists/getbyid('${AllListIdData.SmartMetadataListID}')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail&$expand=IsSendAttentionEmail&$orderby=SortOrder&$top=4999&$filter=TaxType eq '` + SmartTaxonomyName + "'")
        $.ajax({
            url: url,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                AllTaskUsers = data.d.results;
                $.each(AllTaskUsers, function (index: any, item: any) {
                    if (item.Title.toLowerCase() == 'pse' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EPS';
                    }
                    else if (item.Title.toLowerCase() == 'e+i' && item.TaxType == 'Client Category') {
                        item.newTitle = 'EI';
                    }
                    else if (item.Title.toLowerCase() == 'education' && item.TaxType == 'Client Category') {
                        item.newTitle = 'Education';
                    }
                    else {
                        item.newTitle = item.Title;
                    }
                    AllMetaData.push(item);
                })
                setAllClientCategoryData(AllMetaData)
            },
            error: function (error: any) {
                console.log('Error:', error)
            }
        })
    };

    const openClientCategoryModel = (SiteParentId: any, SiteName: any) => {
        setClientCategoryPopupSiteName(SiteName);
        // setSelectedClientCategory([]);
        setSearchedKey('');
        setClientCategoryPopupStatus(true);
        BuildIndividualAllDataArray(SiteParentId, SiteName);
    }

    const BuildIndividualAllDataArray = (SiteParentId: any, SiteName: any) => {
        let ParentArray: any = [];
        AutoCompleteItemsArray = [];
        if (AllClientCategoryData != undefined && AllClientCategoryData.length > 0) {
            AllClientCategoryData?.map((ArrayData: any) => {
                if (ArrayData.ParentId == SiteParentId) {
                    ArrayData.Child = [];
                    if (ArrayData?.siteName == null || ArrayData?.siteName) {
                        ArrayData.newLabel = SiteName + " > " + ArrayData.Title;
                        ArrayData.siteName = SiteName
                    } else {
                        ArrayData.newLabel = ArrayData.siteName + " > " + ArrayData.Title;
                    }
                    ParentArray.push(ArrayData)
                    AutoCompleteItemsArray.push(ArrayData);
                }
            })
        }
        if (ParentArray != undefined && ParentArray.length > 0) {
            ParentArray.map((parentArray: any) => {
                parentArray.Child = [];
                AllClientCategoryData.map((AllData: any) => {
                    if (parentArray.Id == AllData.ParentId) {
                        AllData.newLabel = parentArray.newLabel + " > " + AllData.Title
                        if (AllData?.siteName == null || AllData?.siteName == undefined) {
                            AllData.siteName = SiteName;
                        }
                        parentArray.Child.push(AllData);
                        AutoCompleteItemsArray.push(AllData);
                    }
                })
            })
        }
        if (ParentArray != undefined && ParentArray.length > 0) {
            ParentArray.map((parentArray: any) => {
                if (parentArray.Child?.length > 0) {
                    parentArray.Child?.map((childData: any) => {
                        childData.Child = []
                        AllClientCategoryData.map((AllData: any) => {
                            if (childData.Id == AllData.ParentId) {
                                AllData.newLabel = childData.newLabel + " > " + AllData.Title
                                if (AllData?.siteName == null || AllData?.siteName == undefined) {
                                    AllData.siteName = SiteName;
                                }
                                childData.Child.push(AllData);
                                AutoCompleteItemsArray.push(AllData);
                            }
                        })
                    })
                }
            })
        }
        setSelectedSiteClientCategoryData(ParentArray);
    }

    // const AddSiteNameInSmartMetaData = async (CatgeoryData: any) => {
    //     try {
    //         let web = new Web(siteUrls);
    //         await web.lists.getById(`${AllListIdData.SmartMetadataListID}`).items.getById(CatgeoryData.Id).update({
    //             siteName: CatgeoryData.siteName
    //         }).then(() => {
    //             console.log("Site Name Updated");
    //         })
    //     } catch (error) {
    //     }
    // }

    const AutoSuggestionForClientCategory = (e: any, usedFor: any) => {
        let SearchedKey: any = e.target.value;
        if (usedFor == "Popup") {
            setSearchedKey(SearchedKey);
        }
        let TempArray: any = [];
        if (SearchedKey.length > 0) {
            if (SearchWithDescriptionStatus) {
                if (AutoCompleteItemsArray != undefined && AutoCompleteItemsArray.length > 0) {
                    AutoCompleteItemsArray?.map((AllData: any) => {
                        if (AllData.newLabel?.toLowerCase().includes(SearchedKey.toLowerCase()) || AllData.Description1?.toLowerCase().includes(SearchedKey.toLowerCase())) {
                            TempArray.push(AllData);
                        }
                        if (AllData.Child != undefined && AllData.Child.length > 0) {
                            AllData.Child?.map((ChildData: any) => {
                                if (ChildData.newLabel?.toLowerCase().includes(SearchedKey.toLowerCase()) || AllData.Description1?.toLowerCase().includes(SearchedKey.toLowerCase())) {
                                    TempArray.push(ChildData)
                                }
                            })
                        }
                    })
                    const finalData = TempArray.filter((val: any, id: any, array: any) => {
                        return array.indexOf(val) == id;
                    })
                    if (usedFor == "Popup") {
                        setSearchedClientCategoryData(finalData)
                    } else {
                        setSearchedClientCategoryDataForInput(finalData)
                    }
                }
            } else {
                if (AutoCompleteItemsArray != undefined && AutoCompleteItemsArray.length > 0) {
                    AutoCompleteItemsArray?.map((AllData: any) => {
                        if (AllData.newLabel.toLowerCase().includes(SearchedKey.toLowerCase())) {
                            TempArray.push(AllData);
                        }
                        if (AllData.Child != undefined && AllData.Child.length > 0) {
                            AllData.Child?.map((ChildData: any) => {
                                if (ChildData.newLabel.toLowerCase().includes(SearchedKey.toLowerCase())) {
                                    TempArray.push(ChildData)
                                }
                            })
                        }
                    })
                    const finalData = TempArray.filter((val: any, id: any, array: any) => {
                        return array.indexOf(val) == id;
                    })
                    if (usedFor == "Popup") {
                        setSearchedClientCategoryData(finalData)
                    } else {
                        setSearchedClientCategoryDataForInput(finalData)
                    }
                }
            }
        } else {
            setSearchedClientCategoryData([]);
            setSearchedClientCategoryDataForInput([]);
        }
    }

    const SelectClientCategoryFromAutoSuggestion = (selectedCategory: any, Type: any) => {
        setSearchedKey('');
        setSearchedKeyForEPS("")
        setSearchedKeyForEI("")
        setSearchedKeyForEducation("")
        setSearchedKeyForMigration("")
        setSearchedClientCategoryData([]);
        setSearchedClientCategoryDataForInput([]);
        SelectedClientCategoryFromDataList(selectedCategory, Type);
    }

    const SelectedClientCategoryFromDataList = (selectedCategory: any, Type: any) => {
        if (ClientCategoryPopupSiteName == "EPS") {
            // if (EPSClientCategory?.length > 0) {
            //     let checkDataExistInList: any = checkDataExist(EPSClientCategory, selectedCategory);
            //     if (checkDataExistInList) {
            //         EPSClientCategory.push(selectedCategory);
            //     }
            // } else {
            //     EPSClientCategory.push(selectedCategory);
            // }
            EPSClientCategory[0] = selectedCategory;
        }
        if (ClientCategoryPopupSiteName == "EI") {
            // if (EIClientCategory?.length > 0) {
            //     let checkDataExistInList: any = checkDataExist(EIClientCategory, selectedCategory);
            //     if (checkDataExistInList) {
            //         EIClientCategory.push(selectedCategory);
            //     }
            // } else {
            //     EIClientCategory.push(selectedCategory);
            // }
            EIClientCategory[0] = selectedCategory
        }
        if (ClientCategoryPopupSiteName == "Education") {
            // if (EducationClientCategory?.length > 0) {
            //     let checkDataExistInList: any = checkDataExist(EducationClientCategory, selectedCategory);
            //     if (checkDataExistInList) {
            //         EducationClientCategory.push(selectedCategory);
            //     }
            // } else {
            //     EducationClientCategory.push(selectedCategory);
            // }
            EducationClientCategory[0] = selectedCategory;
        }

        if (ClientCategoryPopupSiteName == "Migration") {
            // if (MigrationClientCategory?.length > 0) {
            //     let checkDataExistInList: any = checkDataExist(MigrationClientCategory, selectedCategory);
            //     if (checkDataExistInList) {
            //         MigrationClientCategory.push(selectedCategory);
            //     }
            // } else {
            //     MigrationClientCategory.push(selectedCategory);
            // }
            MigrationClientCategory[0] = selectedCategory;
        }

        // SelectedClientCategoryBackupArray
        setSearchedKey('');
        setSearchedClientCategoryData([]);
        if (Type == "Main") {
            saveSelectedClientCategoryData();
        }
        // setSelectedClientCategory(selectedClientCategory);
    }

    // const checkDataExist = (DataArray: any, ForCheck: any) => {
    //     let checkItem: any = 0;
    //     DataArray?.map((PrevData: any) => {
    //         if (PrevData?.Title == ForCheck?.Title) {
    //             checkItem++;
    //         }
    //     })
    //     return checkItem;
    // }

    const saveSelectedClientCategoryData = () => {
        let isCategorySelected: any = false;
        let TempArray: any = [];
        if (EPSClientCategory != undefined && EPSClientCategory.length > 0) {
            EPSClientCategory?.map((EPSData: any) => {
                TempArray.push(EPSData);
            })
        }
        if (EIClientCategory != undefined && EIClientCategory.length > 0) {
            EIClientCategory?.map((EIData: any) => {
                TempArray.push(EIData);
            })
        }
        if (EducationClientCategory != undefined && EducationClientCategory.length > 0) {
            EducationClientCategory?.map((EducationData: any) => {
                TempArray.push(EducationData);
            })
        }
        if (MigrationClientCategory != undefined && MigrationClientCategory.length > 0) {
            MigrationClientCategory?.map((MigrationData: any) => {
                TempArray.push(MigrationData);
            })
        }
        if (TempArray != undefined && TempArray.length > 0) {
            SiteCompositionObject.selectedClientCategory = TempArray;
            isCategorySelected = true;
        }
        callBack(SiteCompositionObject, "dataExits");
        AutoCompleteItemsArray = [];
        SelectedClientCategoryBackupArray = TempArray;
        setClientCategoryPopupStatus(false);
    }

    const removeSelectedClientCategory = (SiteType: any) => {
        if (SiteType == "EPS") {
            setEPSClientCategory([])
            EPSClientCategory.pop();
        }
        if (SiteType == "EI") {
            setEIClientCategory([])
            EIClientCategory.pop();
        }
        if (SiteType == "Education") {
            setEducationClientCategory([])
            EducationClientCategory.pop();
        }
        if (SiteType == "Migration") {
            setMigrationClientCategory([])
            MigrationClientCategory.pop();
        }
        saveSelectedClientCategoryData();
    }

    const closeClientCategoryPopup = () => {
        setClientCategoryPopupStatus(false)
        setSelectedClientCategory(SelectedClientCategoryBackupArray);
    }

    const ChangeTimeManuallyFunction = (e: any, SiteName: any) => {
        let TempArray: any = [];
        if (BackupSiteTypeData != undefined && BackupSiteTypeData) {
            BackupSiteTypeData?.map((SiteData: any) => {
                if (SiteData.Title == SiteName) {
                    SiteData.ClienTimeDescription = e.target.value;
                    TempArray.push(SiteData);
                } else {
                    TempArray.push(SiteData);
                }

            })
        }
        setSiteTypes(TempArray);
        let ClientTimeTemp: any = [];
        if (TempArray != undefined && TempArray.length > 0) {
            TempArray?.map((TempData: any) => {
                if (TempData.BtnStatus) {
                    const object = {
                        SiteName: TempData.Title,
                        ClienTimeDescription: TempData.ClienTimeDescription,
                        localSiteComposition: true,
                        siteIcons: TempData.Item_x005F_x0020_Cover
                    }
                    ClientTimeTemp.push(object)
                }
            })
            SiteCompositionObject.ClientTime = ClientTimeTemp;
            SiteTaggingFinalData = ClientTimeTemp;
            SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
            SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
        }
        // callBack(SiteCompositionObject, "dataExits");
    }

    // ************************ this is for the auto Suggestion fuction for all Client Category ******************

    const autoSuggestionsForClientCategoryIdividual = (e: any, siteType: any, SiteId: any) => {
        let SearchedKey: any = e.target.value;
        setClientCategoryPopupSiteName(siteType);
        setSearchWithDescriptionStatus(false);

        if (siteType == "EPS") {
            BuildIndividualAllDataArray(SiteId, siteType);
            AutoSuggestionForClientCategory(e, "For-Input");
            setSearchedKeyForEPS(SearchedKey);
        }
        if (siteType == "EI") {
            BuildIndividualAllDataArray(SiteId, siteType);
            AutoSuggestionForClientCategory(e, "For-Input");
            setSearchedKeyForEI(SearchedKey);
        }
        if (siteType == "Education") {
            BuildIndividualAllDataArray(SiteId, siteType);
            AutoSuggestionForClientCategory(e, "For-Input");
            setSearchedKeyForEducation(SearchedKey);
        }
        if (siteType == "Migration") {
            BuildIndividualAllDataArray(SiteId, siteType);
            AutoSuggestionForClientCategory(e, "For-Input");
            setSearchedKeyForMigration(SearchedKey);
        }


    }

    // ************************* This is used for updating Site COmposition on Backend Side *******************

    const UpdateSiteTaggingAndClientCategory = async () => {
        let SitesTaggingData: any = [];
        let ClientCategoryIDs: any = [];
        let ClientCategoryData: any = [];
        let SiteCompositionSettingData: any = [];
        let SiteTaggingJSON: any = [];
        let TotalPercentageCount: any = 0;
        let TaskShuoldBeUpdate: any = true;

        if (SiteTaggingFinalData.length > 0) {
            SitesTaggingData = SiteTaggingFinalData;
        } else {
            SitesTaggingData = ClientTimeDataBackup;
        }
        if (SelectedClientCategoryBackupArray?.length > 0) {
            ClientCategoryData = SelectedClientCategoryBackupArray;
        } else {
            ClientCategoryData = SelectedClientCategoryFromProps;
        }
        if (SiteCompositionSettings.length > 0) {
            SiteCompositionSettingData = SiteCompositionSettings;
        } else {
            SiteCompositionSettingData = SiteCompositionSettings;
        }
        if (ClientCategoryData?.length > 0) {
            ClientCategoryData.map((dataItem: any) => {
                ClientCategoryIDs.push(dataItem.Id);
            })
        } else {
            ClientCategoryIDs = [];
        }

        if (SitesTaggingData != undefined && SitesTaggingData.length > 0) {
            let SiteIconStatus: any = false
            SitesTaggingData?.map((ClientTimeItems: any) => {
                if (ClientTimeItems.siteIcons != undefined) {
                    if (ClientTimeItems.siteIcons?.length > 0 || ClientTimeItems.siteIcons?.Url?.length > 0) {
                        SiteIconStatus = true;
                    }
                }
                if (ClientTimeItems.ClientCategory != undefined || SiteIconStatus) {
                    let newObject: any = {
                        SiteName: ClientTimeItems.SiteName != undefined ? ClientTimeItems.SiteName : ClientTimeItems.Title,
                        ClienTimeDescription: ClientTimeItems.ClienTimeDescription,
                        Available: true,
                        siteIcons: ClientTimeItems.siteIcons
                    }
                    SiteTaggingJSON.push(newObject);
                } else {
                    SiteTaggingJSON.push(ClientTimeItems);
                }
            })

        }

        if (SiteTaggingJSON?.length > 0) {
            SiteTaggingJSON.map((itemData: any) => {
                TotalPercentageCount = TotalPercentageCount + Number(itemData.ClienTimeDescription);
            })
        }

        if (TotalPercentageCount > 101) {
            TaskShuoldBeUpdate = false;
            TotalPercentageCount = 0
            alert("site composition allocation should not be more than 100%");
        }
        if (TotalPercentageCount.toFixed(0) < 99 && TotalPercentageCount > 0) {
            TotalPercentageCount = 0
            let conformationSTatus = confirm("Site composition should not be less than 100% if you still want to do it click on OK")
            if (conformationSTatus) {
                TaskShuoldBeUpdate = true;
            } else {
                TaskShuoldBeUpdate = false;
            }
        }
        if (TaskShuoldBeUpdate) {
            try {
                let web = new Web(AllListIdData.siteUrl);
                await web.lists.getById(ListId).items.getById(ItemId).update({
                    ClientTime: SiteTaggingJSON?.length > 0 ? JSON.stringify(SiteTaggingJSON) : JSON.stringify(ClientTimeDataBackup),
                    ClientCategoryId: { "results": (ClientCategoryIDs != undefined && ClientCategoryIDs.length > 0) ? ClientCategoryIDs : [] },
                    SiteCompositionSettings: (SiteCompositionSettingData != undefined && SiteCompositionSettingData.length > 0) ? JSON.stringify(SiteCompositionSettingData) : SiteCompositionSettings,
                }).then(() => {
                    console.log("Site Composition Updated !!!");
                    alert("save successfully !!!");
                    ClientTimeData = [];
                    ClientTimeDataBackup = [];
                    closePopupCallBack();
                })
            } catch (error) {
                console.log("Error : ", error.message)
            }
        }
        if (usedFor == "Component-Profile") {
            // closePopupCallBack()
        }

    }

    const editComponentCallback = React.useCallback(() => {
        setEditComponentPanelStaus(false);
    }, [])

    const openEditComponentPanelFunction = () => {
        if (selectedComponentData?.Id != undefined) {
            setEditComponentPanelStaus(true);
        } else {
            alert("There are No Tagged Portfolio Item");
        }

    }


    //    ************* this is Custom Header For Client Category Popup *****************

    const onRenderCustomClientCategoryHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"} >
                <div className="subheading siteColor">
                    Select Client Category
                </div>
                <Tooltip ComponentId="1626" isServiceTask={ServicesTaskCheck} />
            </div>
        )
    }
    const onRenderFooter = () => {
        return (
            <footer
                className={ServicesTaskCheck ? "serviepannelgreena bg-f4 p-3" : "bg-f4 p-3"}
                style={{ position: "absolute", width: "100%", bottom: "0" }}
            >
                <div className="alignCenter justify-content-between">
                    <div>
                        <div id="addNewTermDescription">
                            <p className="mb-1"> New items are added under the currently selected item.
                                <span><a className="hreflink" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/SmartMetadata.aspx`} > Add New Item </a></span>
                            </p>
                        </div>
                        <div id="SendFeedbackTr">
                            <p className="mb-1">Make a request or send feedback to the Term Set manager.
                                <span><a className="hreflink" onClick={() => alert("We are working on it. This feature will be live soon..")}> Send Feedback </a></span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <span>
                            <a className="siteColor mx-1" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/SmartMetadata.aspx`} >
                                Manage Smart Taxonomy
                            </a>
                        </span>
                        <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveSelectedClientCategoryData} >
                            Save
                        </button>
                    </div>

                </div>
            </footer>
        )
    }

    let TotalPercent: any = 0;
    return (
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
            <div className="col-sm-12">
                <span className="SpfxCheckRadio">
                    <input
                        type="radio"
                        id="Manual"
                        name="SiteCompositions"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0]?.Manual : false}
                        title="add manual Time"
                        className="radio"
                        value={SiteCompositionSettings ? SiteCompositionSettings[0]?.Manual : false}
                        onChange={() => ChangeSiteCompositionSettings("Manual")}
                    />
                    <label> Manual </label>
                </span>
                <span className="SpfxCheckRadio">
                    <input
                        type="radio"
                        id="Proportional"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0]?.Proportional : false}
                        onChange={() => ChangeSiteCompositionSettings("Proportional")}
                        name="SiteCompositions"
                        value={SiteCompositionSettings ? SiteCompositionSettings[0]?.Proportional : false}
                        title="add Proportional Time"
                        className="radio"
                    />
                    Proportional
                </span>


                <label className="SpfxCheckRadio me-2">
                    <input
                        type="radio"
                        id="Delux"
                        name="SiteCompositions"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0]?.Delux : false}
                        title="add Delux Time"
                        className="radio"
                        value={SiteCompositionSettings ? SiteCompositionSettings[0]?.Delux : false}
                        onChange={() => ChangeSiteCompositionSettings("Delux")}
                    />
                    Delux</label>
                <label className="SpfxCheckRadio">
                    <input
                        type="radio"
                        id="Standard"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Standard : false}
                        onChange={() => ChangeSiteCompositionSettings("Standard")}
                        name="SiteCompositions"
                        value={SiteCompositionSettings ? SiteCompositionSettings[0].Standard : false}
                        title="add Standard Time"
                        className="radio"
                    />
                    Standard</label>
                {/* <span className="SpfxCheckRadio">
                    <input
                        type="radio"
                        id="Portfolio"
                        name="SiteCompositions"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0]?.Portfolio : false}
                        title="Portfolio"
                        value={SiteCompositionSettings ? SiteCompositionSettings[0]?.Portfolio : false}
                        // onChange={() => ChangeSiteCompositionSettings("Portfolio")}
                        onChange={() => alert("We are working on it. This feature will be live soon..")}
                        className="radio" />
                    <label>
                        Portfolio
                    </label>
                </span>
                <span className="alignIcon"><span className="svg__iconbox svg__icon--editBox" onClick={openEditComponentPanelFunction} title="Click here to edit tagged portfolio site composition."></span></span> */}
                <span className="alignCenter justify-content-center pull-right">
                    <input type="checkbox" className="form-check-input mx-1"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0]?.Protected : false}
                        onChange={() => ChangeSiteCompositionSettings("Protected")}
                    />
                    <label className="alignCenter">
                        Protected
                        {/* <span className="hover-text alignIcon">
                            <span className="svg__iconbox svg__icon--info dark"></span>
                            <span className="tooltip-text pop-left">
                                If this is checked then it should consider site allocations in Time Entry from Task otherwise from tagged component.
                            </span>
                        </span> */}
                    </label>
                </span>
            </div>
            <div className="my-2">
                <table
                    className={"table table-bordered mb-1"}
                >
                    {SiteTypes != undefined && SiteTypes.length > 0 ?
                        <tbody>
                            {SiteTypes?.map((siteData: any, index: any) => {
                                if (siteData.Title !== "Health" && siteData.Title !== "Offshore Tasks" && siteData.Title !== "Gender" && siteData.Title !== "Small Projects") {
                                    if (siteData?.ClienTimeDescription != undefined || siteData?.ClienTimeDescription != null) {
                                        let num: any = Number(siteData.ClienTimeDescription).toFixed(0);
                                        TotalPercent = TotalPercent + Number(num);
                                    }
                                    return (
                                        <tr
                                        // className={siteData?.StartEndDateValidation ? "Disabled-Link bg-th" : 'hreflink border-1'}
                                        className="hreflink border-1"
                                        >
                                            <th
                                                scope="row"
                                                className={IsProtectedSiteComposition == true ? "Disabled-Link opacity-75 m-0 p-1 align-middle" : "m-0 p-1 align-middle"}
                                                style={{ width: "3%" }}
                                            >
                                                <div className="m-0 p-1 align-middle">
                                                    {checkBoxStatus ? <input
                                                        className="form-check-input" type="checkbox"
                                                        checked={siteData.BtnStatus}
                                                        value={siteData.BtnStatus}
                                                        disabled={checkBoxStatus ? true : false}
                                                        style={checkBoxStatus ? { cursor: "not-allowed" } : {}}
                                                        onChange={(e) => selectSiteCompositionFunction(e, index)}
                                                    /> : <input
                                                        className="form-check-input" type="checkbox"
                                                        checked={siteData.BtnStatus}
                                                        value={siteData.BtnStatus}
                                                        onChange={(e) => selectSiteCompositionFunction(e, index)}
                                                    />}
                                                </div>
                                            </th>
                                            <td
                                                className={IsProtectedSiteComposition == true ? "Disabled-Link m-0 p-1 align-middle opacity-75" : "m-0 p-1 align-middle"}
                                                // className="m-0 p-1 align-middle" 
                                                style={{ width: "30%" }}>
                                                <div className="alignCenter">
                                                    <img src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} style={{ width: '25px' }} className="mx-2" />
                                                    {siteData.Title}
                                                </div>
                                            </td>
                                            <td
                                                style={{ width: "12%" }}
                                                className={IsProtectedSiteComposition == true ? "Disabled-Link opacity-75 m-0 p-1 align-middle" : "m-0 p-1 align-middle"}
                                            >
                                                <div className="alignCenter">
                                                    {ProportionalStatus ?
                                                        <>{isPortfolioComposition && siteData.BtnStatus ? <input
                                                            type="number" min="1" max='100'
                                                            value={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(2) : null}
                                                            className="form-control p-1" readOnly={true} style={{ cursor: "not-allowed" }}
                                                            onChange={(e) => ChangeTimeManuallyFunction(e, siteData.Title)}
                                                        /> : <input type="number" min="1" max='100'
                                                            style={ProportionalStatus && siteData.BtnStatus ? { cursor: "not-allowed" } : {}}
                                                            defaultValue={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) : ""}
                                                            value={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) : ""}
                                                            className="form-control p-1" readOnly={ProportionalStatus}
                                                        />}  </>
                                                        : <> {siteData.BtnStatus ?
                                                            <input
                                                                type="number" min="1" max='100'
                                                                defaultValue={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(2) : null}
                                                                className="form-control p-1" style={{ width: "100%" }}
                                                                onChange={(e) => ChangeTimeManuallyFunction(e, siteData.Title)}
                                                            /> : <input type="number" className="form-control" value={''} readOnly={true} style={{ cursor: "not-allowed", width: "100%" }}
                                                            />}</>
                                                    }
                                                </div>
                                            </td>
                                            <td style={{ width: "3%" }}>
                                                <div className="alignCenter">{siteData.BtnStatus ? "%" : ''}</div>
                                            </td>
                                            <td style={{ width: "12%" }}>
                                                <div className="alignCenter">{ProportionalStatus ? <span>{siteData.BtnStatus && TotalTime ? (TotalTime / selectedSiteCount).toFixed(2) + " h" : siteData.BtnStatus ? "0 h" : null}</span> : <span>{siteData.BtnStatus && TotalTime ? (siteData.ClienTimeDescription ? (siteData.ClienTimeDescription * TotalTime / 100).toFixed(2) + " h" : "0 h") : siteData.BtnStatus ? "0 h" : null}</span>}</div>
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "36%" }}>
                                                {siteData.Title == "EI" ?
                                                    <>
                                                        <div className="input-group">
                                                            {EIClientCategory != undefined && EIClientCategory.length > 0 ?
                                                                <> {EIClientCategory?.map((dataItem: any) => {
                                                                    if (dataItem.siteName == siteData.Title) {
                                                                        return (
                                                                            <div className="block w-100 justify-content-between" title={dataItem.Title ? dataItem.Title : null}>
                                                                                {dataItem.Title ? dataItem.Title : null}

                                                                                <span onClick={() => removeSelectedClientCategory("EI")} className="bg-light svg__icon--cross svg__iconbox"></span>

                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <div className="input-group">
                                                                                <input type="text"
                                                                                    value={SearchedKeyForEI}
                                                                                    onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EI", 340)}
                                                                                    style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                                    className="form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />
                                                                                {
                                                                                    siteData.BtnStatus ?
                                                                                        <span className="input-group-text"
                                                                                            onClick={() => openClientCategoryModel(340, 'EI')}
                                                                                        >
                                                                                            <span title="Client Category Popup" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                                        </span>
                                                                                        : null
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                })}
                                                                </> :
                                                                <div className="input-group">
                                                                    <input type="text" value={SearchedKeyForEI} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EI", 340)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />
                                                                    {
                                                                        siteData.BtnStatus ?
                                                                            <span className="input-group-text"
                                                                                onClick={() => openClientCategoryModel(340, 'EI')}
                                                                            >
                                                                                <span title="Client Category Popup" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                            </span>
                                                                            : null
                                                                    }
                                                                </div>}

                                                        </div>
                                                        {SearchedClientCategoryDataForInput?.length > 0 && ClientCategoryPopupSiteName == "EI" ? (
                                                            <div className="SearchTableClientCategoryComponent">
                                                                <ul className="list-group">
                                                                    {SearchedClientCategoryDataForInput.map((item: any) => {
                                                                        return (
                                                                            <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item, "Main")} >
                                                                                <a>{item.newLabel}</a>
                                                                            </li>
                                                                        )
                                                                    }
                                                                    )}
                                                                </ul>
                                                            </div>) : null}
                                                    </>
                                                    : null}
                                                {siteData.Title == "EPS" ?
                                                    <>


                                                        {EPSClientCategory != undefined && EPSClientCategory.length > 0 ?
                                                            <> {EPSClientCategory?.map((dataItem: any) => {
                                                                if (dataItem.siteName == siteData.Title) {
                                                                    return (
                                                                        <div className="block w-100 justify-content-between" title={dataItem.Title ? dataItem.Title : null}>
                                                                            {dataItem.Title ? dataItem.Title : null}
                                                                            <span onClick={() => removeSelectedClientCategory("EPS")} className="bg-light hreflink svg__icon--cross svg__iconbox ms-2"></span>

                                                                        </div>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <div className="input-group">
                                                                            <input type="text" value={SearchedKeyForEPS} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EPS", 341)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />
                                                                            {
                                                                                siteData.BtnStatus ?
                                                                                    <span className="input-group-text"
                                                                                        onClick={() => openClientCategoryModel(341, "EPS")}>
                                                                                        <span title="Client Category Popup" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                                    </span>
                                                                                    : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                }
                                                            })}
                                                            </> : <div className="input-group">
                                                                <input type="text" value={SearchedKeyForEPS} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EPS", 341)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />
                                                                {
                                                                    siteData.BtnStatus ?
                                                                        <span className="input-group-text"
                                                                            onClick={() => openClientCategoryModel(341, "EPS")}
                                                                        >
                                                                            <span title="Client Category Popup" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                        </span>
                                                                        : null
                                                                }
                                                            </div>

                                                        }
                                                        {SearchedClientCategoryDataForInput?.length > 0 && ClientCategoryPopupSiteName == "EPS" ? (
                                                            <div className="SearchTableClientCategoryComponent">
                                                                <ul className="list-group">
                                                                    {SearchedClientCategoryDataForInput.map((item: any) => {
                                                                        return (
                                                                            <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item, "Main")} >
                                                                                <a>{item.newLabel}</a>
                                                                            </li>
                                                                        )
                                                                    }
                                                                    )}
                                                                </ul>
                                                            </div>) : null}
                                                    </>
                                                    : null}
                                                {siteData.Title == "Education" ?
                                                    <>
                                                        <div className="input-group justify-content-between">
                                                            {EducationClientCategory != undefined && EducationClientCategory.length > 0 ?
                                                                <> {EducationClientCategory?.map((dataItem: any) => {
                                                                    if (dataItem.siteName == siteData.Title) {
                                                                        return (
                                                                            <div className="block justify-content-between w-100" title={dataItem.Title ? dataItem.Title : null}>
                                                                                {dataItem.Title ? dataItem.Title : null}
                                                                                <span onClick={() => removeSelectedClientCategory("Education")} className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <div className="input-group">
                                                                                <input type="text" value={SearchedKeyForEducation} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Education", 344)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />
                                                                                {
                                                                                    siteData.BtnStatus ?
                                                                                        <span className="input-group-text"
                                                                                            onClick={() => openClientCategoryModel(344, "Education")}
                                                                                        >
                                                                                            <span title="Client Category Popup" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                                        </span>
                                                                                        : null
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                })}
                                                                </> :
                                                                <div className="input-group">
                                                                    <input type="text"
                                                                        value={SearchedKeyForEducation}
                                                                        onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Education", 344)}
                                                                        style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                        className="form-control"
                                                                        placeholder="Search Client Category Here!"
                                                                        readOnly={siteData.BtnStatus ? false : true} />
                                                                    {
                                                                        siteData.BtnStatus ?
                                                                            <span className="input-group-text"
                                                                                onClick={() => openClientCategoryModel(344, "Education")}
                                                                            >
                                                                                <span title="Client Category Popup" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                            </span>
                                                                            : null
                                                                    }
                                                                </div>
                                                            }
                                                        </div>
                                                        {SearchedClientCategoryDataForInput?.length > 0 && ClientCategoryPopupSiteName == "Education" ? (
                                                            <div className="SearchTableClientCategoryComponent">
                                                                <ul className="list-group">
                                                                    {SearchedClientCategoryDataForInput.map((item: any) => {
                                                                        return (
                                                                            <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item, "Main")} >
                                                                                <a>{item.newLabel}</a>
                                                                            </li>
                                                                        )
                                                                    }
                                                                    )}
                                                                </ul>
                                                            </div>) : null}
                                                    </>
                                                    : null}
                                                {siteData.Title == "Migration" ?
                                                    <>
                                                        <div className="input-group justify-content-between">
                                                            {MigrationClientCategory != undefined && MigrationClientCategory.length > 0 ?
                                                                <> {MigrationClientCategory?.map((dataItem: any) => {
                                                                    if (dataItem.siteName == siteData.Title) {
                                                                        return (
                                                                            <div className="block justify-content-between w-100" title={dataItem.Title ? dataItem.Title : null}>
                                                                                {dataItem.Title ? dataItem.Title : null}
                                                                                <span onClick={() => removeSelectedClientCategory("Migration")} className="bg-light svg__icon--cross svg__iconbox"></span>

                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <div className="input-group">
                                                                                <input type="text"
                                                                                    value={SearchedKeyForMigration}
                                                                                    onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Migration", 569)}
                                                                                    style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                                    className="form-control"
                                                                                    placeholder="Search Client Category Here!"
                                                                                    readOnly={siteData.BtnStatus ? false : true}
                                                                                />
                                                                                {
                                                                                    siteData.BtnStatus ?
                                                                                        <span className="input-group-text"
                                                                                            onClick={() => openClientCategoryModel(569, 'Migration')}
                                                                                        >
                                                                                            <span title="Client Category Popup" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                                        </span>
                                                                                        : null
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                })}
                                                                </> :
                                                                <div className="input-group">
                                                                    <input type="text"
                                                                        value={SearchedKeyForMigration}
                                                                        onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Migration", 569)}
                                                                        style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                        className="form-control"
                                                                        placeholder="Search Client Category Here!"
                                                                        readOnly={siteData.BtnStatus ? false : true}
                                                                    />
                                                                    {
                                                                        siteData.BtnStatus ?
                                                                            <span className="input-group-text"
                                                                                onClick={() => openClientCategoryModel(569, 'Migration')}
                                                                            >
                                                                                <span title="Client Category Popup" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                            </span>
                                                                            : null
                                                                    }
                                                                </div>
                                                            }
                                                        </div>
                                                        {SearchedClientCategoryDataForInput?.length > 0 && ClientCategoryPopupSiteName == "Migration" ? (
                                                            <div className="SearchTableClientCategoryComponent">
                                                                <ul className="list-group">
                                                                    {SearchedClientCategoryDataForInput.map((item: any) => {
                                                                        return (
                                                                            <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item, "Main")} >
                                                                                <a>{item.newLabel}</a>
                                                                            </li>
                                                                        )
                                                                    }
                                                                    )}
                                                                </ul>
                                                            </div>) : null}
                                                    </>
                                                    : null}
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                        : null}
                </table>

                <footer className="bg-e9 alignCenter justify-content-between p-1">
                    <div className="col-sm-6">
                        <a className="hreflink ms-2" target="_blank" data-interception="off" href={`${siteUrls}/Lists/${currentListName}/EditForm.aspx?ID=${ItemId}&?#ClientTime`}>
                            Open-Out-Of-The-Box
                        </a>
                    </div>
                    <div className="d-flex justify-content-end col-sm-6">
                        <div className="bg-body col-sm-2 p-1 alignCenter">
                            <div className="">{isPortfolioComposition == true || ProportionalStatus == false ? `${TotalPercent} %` : "100%"}</div>
                        </div>
                        <div className="bg-body col-sm-2 mx-1 p-1 alignCenter">
                            <div className="">{TotalTime ? TotalTime.toFixed(0) : 0}</div>
                        </div>
                        <div className="me-1">
                            <button className="btn btn-primary px-4 " onClick={UpdateSiteTaggingAndClientCategory} style={usedFor == 'Task-Profile' ? { display: 'block' } : { display: 'none' }}>
                                Save
                            </button>
                        </div>
                    </div>
                </footer>
                {/* ********************* this Client Category panel ****************** */}
                <Panel
                    onRenderHeader={onRenderCustomClientCategoryHeader}
                    isOpen={ClientCategoryPopupStatus}
                    onDismiss={closeClientCategoryPopup}
                    isBlocking={false}
                    type={PanelType.custom}
                    customWidth="850px"
                    onRenderFooter={onRenderFooter}
                >
                    <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
                        <div className="">
                            <div className='col-sm-12'>
                                <input type="checkbox" className="form-check-input me-1 rounded-0" defaultChecked={SearchWithDescriptionStatus} onChange={() => setSearchWithDescriptionStatus(SearchWithDescriptionStatus ? false : true)} /> <label>Include description (info-icons) in search</label>
                                <input className="form-control my-2" type='text' placeholder={`Search ${ClientCategoryPopupSiteName} Client Category`} value={searchedKey} onChange={(e) => AutoSuggestionForClientCategory(e, "Popup")} />
                                {SearchedClientCategoryData?.length > 0 ? (
                                    <div className="SearchTableCategoryComponent">
                                        <ul className="list-group">
                                            {SearchedClientCategoryData.map((item: any) => {
                                                return (
                                                    <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item, "Popup")} >
                                                        <a>{item.newLabel}</a>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    </div>) : null}
                                { }
                                <div className="border full-width ActivityBox">
                                    {ClientCategoryPopupSiteName == "EPS" ?
                                        <>
                                            {EPSClientCategory != undefined && EPSClientCategory.length > 0 ?
                                                <span className="block me-1">
                                                    <span>
                                                        {EPSClientCategory != undefined && EPSClientCategory.length > 0 ? EPSClientCategory[0].Title : null}
                                                    </span>
                                                    <span onClick={() => removeSelectedClientCategory("EPS")} className="bg-light hreflink svg__icon--cross svg__iconbox ms-2">
                                                    </span>
                                                </span>
                                                : null}
                                        </>
                                        : null}
                                    {ClientCategoryPopupSiteName == "EI" ?
                                        <>
                                            {EIClientCategory != undefined && EIClientCategory.length > 0 ?
                                                <span className="block me-1">
                                                    <span>{EIClientCategory[0].Title}</span>
                                                    <span onClick={() => removeSelectedClientCategory("EI")} className="hreflink bg-light svg__icon--cross svg__iconbox"></span>
                                                </span>
                                                : null}
                                        </>
                                        : null}
                                    {ClientCategoryPopupSiteName == "Education" ?
                                        <>
                                            {EducationClientCategory != undefined && EducationClientCategory.length > 0 ?
                                                <span className="block me-1">
                                                    <span>{EducationClientCategory[0].Title}</span>
                                                    <span onClick={() => removeSelectedClientCategory("Education")} className="bg-light hreflink ms-2 svg__icon--cross svg__iconbox"></span>
                                                </span>
                                                : null}
                                        </>
                                        : null}
                                    {ClientCategoryPopupSiteName == "Migration" ?
                                        <>
                                            {MigrationClientCategory != undefined && MigrationClientCategory.length > 0 ?
                                                <span className="block me-1">
                                                    <span>{MigrationClientCategory[0].Title}</span>
                                                    <span onClick={() => removeSelectedClientCategory("Migration")} className="bg-light hreflink svg__icon--cross svg__iconbox ms-2"></span>
                                                </span> : null}
                                        </>
                                        : null}
                                </div>
                                {SelectedSiteClientCategoryData != undefined && SelectedSiteClientCategoryData.length > 0 ?
                                    <ul className="categories-menu p-0">
                                        {SelectedSiteClientCategoryData.map(function (item: any) {
                                            return (
                                                <>
                                                    <li className="clientlist">
                                                        <a className='mb-0 hreflink' onClick={() => SelectedClientCategoryFromDataList(item, "Popup")} >
                                                            {item.Title}
                                                            {item.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                <span title="Edit" className="svg__iconbox svg__icon--info"></span>
                                                                <div className="popover__content">
                                                                    <span>{item.Description1}</span>
                                                                </div>
                                                            </div> : null}
                                                        </a>
                                                        <ul className="sub-menu clr">
                                                            {item.Child?.map(function (child1: any) {
                                                                return (
                                                                    <>
                                                                        {child1.Title != null ?
                                                                            <li className="clientlist">

                                                                                <a className='mb-0 hreflink' onClick={() => SelectedClientCategoryFromDataList(child1, "Popup")}>
                                                                                    {child1.Item_x0020_Cover ?
                                                                                        <img className="flag_icon"
                                                                                            style={{ height: "20px", borderRadius: "10px", border: "1px solid #000069" }}
                                                                                            src={child1.Item_x0020_Cover ? child1.Item_x0020_Cover.Url : ''}
                                                                                        /> :
                                                                                        null}
                                                                                    {child1.Title}
                                                                                    {child1.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                        <span title="Edit" className="svg__iconbox svg__icon--info"></span>
                                                                                        <div className="popover__content">
                                                                                            <span>{child1.Description1}</span>
                                                                                        </div>
                                                                                    </div> : null}
                                                                                </a>
                                                                                <ul className="sub-menu clr">
                                                                                    {child1.Child?.map(function (child2: any) {
                                                                                        return (
                                                                                            <>
                                                                                                {child2.Title != null ?
                                                                                                    <li>

                                                                                                        <a className='mb-0 hreflink' onClick={() => SelectedClientCategoryFromDataList(child2, "Popup")}>
                                                                                                            {child2.Item_x0020_Cover ?
                                                                                                                <img className="flag_icon"
                                                                                                                    style={{ height: "20px", borderRadius: "10px", border: "1px solid #000069" }}
                                                                                                                    src={child2.Item_x0020_Cover ? child2.Item_x0020_Cover.Url : ''}
                                                                                                                /> :
                                                                                                                null}
                                                                                                            {child2.Title}
                                                                                                            {child2.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                <span title="Edit" className="svg__iconbox svg__icon--info"></span>
                                                                                                                <div className="popover__content">
                                                                                                                    <span>{child2.Description1}</span>
                                                                                                                </div>
                                                                                                            </div> : null}
                                                                                                        </a>

                                                                                                    </li> : null
                                                                                                }
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </ul>
                                                                            </li> : null
                                                                        }
                                                                    </>
                                                                )
                                                            })}
                                                        </ul>
                                                    </li>
                                                </>
                                            )
                                        })}
                                    </ul>
                                    : null}
                            </div>
                        </div>
                    </div>
                </Panel>
            </div >
            {EditComponentPanelStaus ?
                <EditComponentProtfolio item={selectedComponentData} SelectD={AllListIdData} usedFor="Task-Popup" Calls={editComponentCallback} />
                : null
            }
        </div >
    )
}
export default SiteCompositionComponent; 