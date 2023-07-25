import * as React from "react";
import { useState, useEffect } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { ImPriceTags } from 'react-icons/im';
import Tooltip from "../Tooltip";
import { Web } from "sp-pnp-js";

var AutoCompleteItemsArray: any = [];
var SelectedClientCategoryBackupArray: any = [];
var BackupSiteTypeData: any = [];

const SiteCompositionComponent = (Props: any) => {
    const SiteData = Props.SiteTypes;
    var ClientTime = Props.ClientTime != undefined ? Props.ClientTime : [];
    var SitesTaggingData: any = Props.SitesTaggingData
    const isPortfolioConncted = Props.isPortfolioConncted;
    const AllListIdData: any = Props.AllListId
    const siteUrls = Props.siteUrls;
    const TotalTime = Props.SmartTotalTimeData;
    const callBack = Props.callBack;
    const ListId = Props.ListId;
    const currentListName = Props.currentListName;
    const usedFor = Props.usedFor;
    const ItemId = Props.ItemId;
    const ServicesTaskCheck = Props.isServiceTask;
    const SiteCompositionSettings = (Props.SiteCompositionSettings != undefined ? JSON.parse(Props.SiteCompositionSettings) : [{ Proportional: true, Manual: false, Portfolio: false, localSiteComposition: false }]);
    const SelectedClientCategoryFromProps = Props.SelectedClientCategory;
    const [SiteTypes, setSiteTypes] = useState([]);
    const [selectedSiteCount, setSelectedSiteCount] = useState(Props.ClientTime.length);
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
    // const [SitesTaggingData, setSitesTaggingData] = useState([]);
    const [isPortfolioComposition, setIsPortfolioComposition] = useState(false);
    const [checkBoxStatus, setCheckBoxStatus] = useState(false)
    const closePopupCallBack = Props.closePopupCallBack;
    const SiteCompositionObject: any = {
        ClientTime: [],
        selectedClientCategory: [],
        SiteCompositionSettings: []
    }
    useEffect(() => {
        setSiteTypes(SiteData);
        let tempData: any = [];
        let tempData2: any = [];
        BackupSiteTypeData = []
        setClientTimeData(ClientTime);
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
                            data.BtnStatus = true
                        }
                    })
                    tempData2.push(data);
                    BackupSiteTypeData.push(data);
                })
            }
            setSiteTypes(tempData2);
        }

        // if (isPortfolioConncted && SiteCompositionSettings != undefined && SiteCompositionSettings.length > 0) {
        //     const object = { ...SiteCompositionSettings[0], Proportional: false, Manual: false, Portfolio: true }
        //     SiteCompositionSettings[0] = object;
        //     setCheckBoxStatus(true);
        // }

        if (SiteCompositionSettings != undefined && SiteCompositionSettings.length > 0) {
            if (SiteCompositionSettings[0].Proportional) {
                setProportionalStatus(true);
            }
            if (SiteCompositionSettings[0].Manual) {
                setProportionalStatus(false);
            }
            if (SiteCompositionSettings[0].Portfolio) {
                setIsPortfolioComposition(true);
                setCheckBoxStatus(true)
            }
        }

        // if (Props.SitesTaggingData != undefined && Props.SitesTaggingData.length > 0) {
        //     setSitesTaggingData(Props.SitesTaggingData);
        // }
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
                        if (ClientTimeData != undefined && ClientTimeData.length > 0) {
                            ClientTimeData.map((Data: any) => {
                                if (Data.SiteName != DataItem.Title) {
                                    TempArray.push(Data)
                                }
                            })
                        }
                        let tempDataForRemove: any = [];
                        TempArray?.map((dataItem: any) => {
                            dataItem.ClienTimeDescription = (100 / (selectedSiteCount - 1)).toFixed(1);
                            tempDataForRemove.push(dataItem);
                        })
                        setClientTimeData(tempDataForRemove);
                        SiteCompositionObject.ClientTime = tempDataForRemove;
                        SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
                        ClientTime = tempDataForRemove;
                        if (tempDataForRemove?.length > 0) {
                            callBack(SiteCompositionObject, "dataExits");
                        } else {
                            callBack(SiteCompositionObject, "dataDeleted")
                        }

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
                        SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
                        callBack(SiteCompositionObject, "dataExits");
                    }
                }
                TempArray.push(DataItem)
            })
        }
        setSiteTypes(TempArray);
    }
    const ChangeSiteCompositionSettings = (Type: any) => {
        // if (!isPortfolioConncted) {
        //     alert("There are No Tagged Component/Services")
        // } else {
        if (Type == "Proportional") {
            const object = { ...SiteCompositionSettings[0], Proportional: true, Manual: false, Portfolio: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(true);
            let tempData: any = [];
            ClientTime?.map((TimeData: any) => {
                TimeData.ClienTimeDescription = (100 / (selectedSiteCount)).toFixed(1);
                tempData.push(TimeData);
            })
            SiteCompositionObject.ClientTime = tempData;
            callBack(SiteCompositionObject, "dataExits");
            setIsPortfolioComposition(false);
            setCheckBoxStatus(false);
        }
        if (Type == "Manual") {
            const object = { ...SiteCompositionSettings[0], Proportional: false, Manual: true, Portfolio: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(false);
            setIsPortfolioComposition(false);
            setCheckBoxStatus(false);
        }
        if (Type == "Portfolio") {
            const object = { ...SiteCompositionSettings[0], Proportional: false, Manual: false, Portfolio: true }
            SiteCompositionSettings[0] = object;
            if (SitesTaggingData != undefined && SitesTaggingData.length > 0 || ClientTime != undefined && ClientTime.length > 0) {
                ClientTimeData = SitesTaggingData != undefined ? SitesTaggingData : ClientTime;
                setIsPortfolioComposition(true);
                setProportionalStatus(true);
                setCheckBoxStatus(true);
                onChangeCompositionSetting()
            } else {
                setIsPortfolioComposition(false);
                setCheckBoxStatus(false);
                setClientTimeData([])
            }
            // if (ClientTime != undefined && ClientTime.length > 0) {
            //     setIsPortfolioComposition(true);
            //     setProportionalStatus(true);
            //     setCheckBoxStatus(true);
            // } else {
            //     setIsPortfolioComposition(false);
            //     setCheckBoxStatus(false);
            // }
            // setCheckBoxStatus(true);
        }
        if (Type == "Overridden") {
            let object: any;
            if (SiteCompositionSettings[0].localSiteComposition == true) {
                object = { ...SiteCompositionSettings[0], localSiteComposition: false }
            } else {
                object = { ...SiteCompositionSettings[0], localSiteComposition: true }
            }
            SiteCompositionSettings[0] = object;
        }
        SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
        SiteCompositionObject.ClientTime = ClientTimeData;
        callBack(SiteCompositionObject, "dataExits");
        // }

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
            setSelectedSiteCount(ClientTimeData?.length)
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
            EPSClientCategory[0] = selectedCategory;
        }
        if (ClientCategoryPopupSiteName == "EI") {
            EIClientCategory[0] = selectedCategory;
        }
        if (ClientCategoryPopupSiteName == "Education") {
            EducationClientCategory[0] = selectedCategory;
        }
        if (ClientCategoryPopupSiteName == "Migration") {
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
            SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
            SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
        }
        callBack(SiteCompositionObject, "dataExits");
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

        if (ClientTimeData.length > 0) {
            SitesTaggingData = ClientTimeData;
        } else {
            SitesTaggingData = ClientTime;
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

        if (ClientTimeData != undefined && ClientTimeData.length > 0) {
            let SiteIconStatus: any = false
            ClientTimeData?.map((ClientTimeItems: any) => {
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
                    ClientTime: SiteTaggingJSON?.length > 0 ? JSON.stringify(SiteTaggingJSON) : JSON.stringify(ClientTimeData),
                    ClientCategoryId: { "results": (ClientCategoryIDs != undefined && ClientCategoryIDs.length > 0) ? ClientCategoryIDs : [] },
                    SiteCompositionSettings: (SiteCompositionSettingData != undefined && SiteCompositionSettingData.length > 0) ? JSON.stringify(SiteCompositionSettingData) : JSON.stringify(SiteCompositionSettings),
                }).then(() => {
                    console.log("Site Composition Updated !!!");
                    alert("save successfully !!!");
                    ClientTimeData = [];
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

    //    ************* this is Custom Header For Client Category Popup *****************

    const onRenderCustomClientCategoryHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"} >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        Select Client Category
                    </span>
                </div>
                <Tooltip ComponentId="1626" />
            </div>
        )
    }
    const onRenderFooter = () => {
        return (
            <footer
                className={ServicesTaskCheck ? "serviepannelgreena bg-f4 pe-2 py-2 text-end" : "bg-f4 pe-2 py-2 text-end"}
                style={{ position: "absolute", width: "100%", bottom: "0" }}
            >
                <span>
                    <a className="siteColor mx-1" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/SmartMetadata.aspx`} >
                        Manage Smart Taxonomy
                    </a>
                </span>
                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveSelectedClientCategoryData} >
                    Save
                </button>
            </footer>
        )
    }

    let TotalPercent: any = 0;
    return (
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
            <div className="col-sm-12 ps-3">
                <span className="l-radio">
                <input
                    type="radio"
                    id="Proportional"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0]?.Proportional : false}
                    onChange={() => ChangeSiteCompositionSettings("Proportional")}
                    name="SiteCompositions"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0]?.Proportional : false}
                    title="add Proportional Time"
                    className="me-1  mt-0"
                />
                  Proportional
                </span>
                <span className="l-radio">
                <input
                    type="radio"
                    id="Manual"
                    name="SiteCompositions"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0]?.Manual : false}
                    title="add manual Time"
                    className="mx-1  mt-0"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0]?.Manual : false}
                    onChange={() => ChangeSiteCompositionSettings("Manual")}
                />
                <label>Manual</label>
                </span>
                <span className="l-radio">
                <input
                    type="radio"
                    id="Portfolio"
                    name="SiteCompositions"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0]?.Portfolio : false}
                    title="Portfolio"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0]?.Portfolio : false}
                    onChange={() => ChangeSiteCompositionSettings("Portfolio")}
                    className="mx-1 mt-0" />
                <label>
                    Portfolio
                </label>
                </span>
               <span> <img className="mt-0 siteColor mx-1" onClick={() => alert("We are working on it. This feature will be live soon..")} title="Click here to edit tagged portfolio site composition." src="/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" /></span>
                <span className="d-flex justify-content-center pull-right overrid">
                    <input
                        type="checkbox"
                        className="form-check-input mb-0 ms-2 mx-1 rounded-0"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0]?.localSiteComposition : false}
                        onChange={() => ChangeSiteCompositionSettings("Overridden")}
                    />
                    <label data-toggle="tooltip" data-placement="bottom" >
                        Overridden
                        <span className="svg__iconbox svg__icon--info " title="If this is checked then it should consider site allocations in Time Entry from Task otherwise from tagged component."></span>
                    </label>
                </span>
            </div>
            <div className="my-2 ps-3">
                <table className="table table-bordered mb-1">
                    {SiteTypes != undefined && SiteTypes.length > 0 ?
                        <tbody>
                            {SiteTypes?.map((siteData: any, index: any) => {
                                if (siteData.Title !== "Health" && siteData.Title !== "Offshore Tasks" && siteData.Title !== "Gender" && siteData.Title !== "Small Projects") {
                                    if (siteData?.ClienTimeDescription != undefined || siteData?.ClienTimeDescription != null) {
                                        let num: any = Number(siteData.ClienTimeDescription).toFixed(0);
                                        TotalPercent = TotalPercent + Number(num);
                                    }
                                    return (
                                        <tr>
                                            <th scope="row" className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                {checkBoxStatus ? <input
                                                    className="form-check-input rounded-0" type="checkbox"
                                                    checked={siteData.BtnStatus}
                                                    value={siteData.BtnStatus}
                                                    disabled={checkBoxStatus ? true : false}
                                                    style={checkBoxStatus ? { cursor: "not-allowed" } : {}}
                                                    onChange={(e) => selectSiteCompositionFunction(e, index)}
                                                /> : <input
                                                    className="form-check-input rounded-0" type="checkbox"
                                                    checked={siteData.BtnStatus}
                                                    value={siteData.BtnStatus}
                                                    onChange={(e) => selectSiteCompositionFunction(e, index)}
                                                />}

                                            </th>
                                            <td className="m-0 p-0 align-middle" style={{ width: "30%" }}>
                                                <img src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} style={{ width: '25px' }} className="mx-2" />
                                                {siteData.Title}
                                            </td>
                                            <td className="m-0 p-1" style={{ width: "12%" }}>
                                                {ProportionalStatus ?
                                                    <>{isPortfolioComposition ? <input
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
                                                        /> : <input type="number" readOnly={true} style={{ cursor: "not-allowed", width: "100%" }}
                                                        />}</>
                                                }
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                <span>{siteData.BtnStatus ? "%" : ''}</span>
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "12%" }}>
                                                {ProportionalStatus ? <span>{siteData.BtnStatus && TotalTime ? (TotalTime / selectedSiteCount).toFixed(2) + " h" : siteData.BtnStatus ? "0 h" : null}</span> : <span>{siteData.BtnStatus && TotalTime ? (siteData.ClienTimeDescription ? (siteData.ClienTimeDescription * TotalTime / 100).toFixed(2) + " h" : "0 h") : siteData.BtnStatus ? "0 h" : null}</span>}
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "36%" }}>
                                                {siteData.Title == "EI" ?
                                                    <>
                                                        <div className="input-group block justify-content-between">
                                                            {EIClientCategory != undefined && EIClientCategory.length > 0 ?
                                                                <> {EIClientCategory?.map((dataItem: any) => {
                                                                    if (dataItem.siteName == siteData.Title) {
                                                                        return (
                                                                            <div className="bg-69 p-1 ps-2"> {dataItem.Title ? dataItem.Title : null}
                                                                                <a className=""
                                                                                    onClick={() => removeSelectedClientCategory("EI")}
                                                                                >
                                                                                    <img src={require('../../Assets/ICON/cross.svg')} width="20" className="bg-e9 border mb-1 mx-1 p-1 rounded-5" />
                                                                                </a>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <input type="text" value={SearchedKeyForEI} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EI", 340)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />
                                                                        )
                                                                    }
                                                                })}
                                                                </> : <input type="text" value={SearchedKeyForEI} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EI", 340)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />}
                                                            {
                                                                siteData.BtnStatus ?
                                                                    <a className="bg-white border border-secondary"
                                                                        onClick={() => openClientCategoryModel(340, 'EI')}
                                                                    >
                                                                     <span title="Edit Task" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                    </a>
                                                                    : null
                                                            }
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
                                                        <div className="input-group block justify-content-between Compositionfild">
                                                            {EPSClientCategory != undefined && EPSClientCategory.length > 0 ?
                                                                <> {EPSClientCategory?.map((dataItem: any) => {
                                                                    if (dataItem.siteName == siteData.Title) {
                                                                        return (
                                                                            <div className="bg-69 p-1 ps-2"> {dataItem.Title ? dataItem.Title : null}
                                                                                <a className=""
                                                                                    onClick={() => removeSelectedClientCategory("EPS")}
                                                                                >
                                                                                    <img src={require('../../Assets/ICON/cross.svg')} width="20" className="bg-e9 border mb-1 mx-1 p-1 rounded-5" />
                                                                                </a>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <input type="text" value={SearchedKeyForEPS} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EPS", 341)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />
                                                                        )
                                                                    }
                                                                })}
                                                                </> : <input type="text" value={SearchedKeyForEPS} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EPS", 341)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />}
                                                            {
                                                                siteData.BtnStatus ?
                                                                    <a className="bg-white border border-secondary pancilicons"
                                                                        onClick={() => openClientCategoryModel(341, "EPS")}
                                                                    >
                                                                         <span title="Edit Task" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                        {/* <img src={require('../../Assets/ICON/edit_page.svg')} width="25" /> */}
                                                                    </a>
                                                                    : null
                                                            }
                                                        </div>
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
                                                        <div className="input-group block justify-content-between Compositionfild">
                                                            {EducationClientCategory != undefined && EducationClientCategory.length > 0 ?
                                                                <> {EducationClientCategory?.map((dataItem: any) => {
                                                                    if (dataItem.siteName == siteData.Title) {
                                                                        return (
                                                                            <div className="bg-69 p-1 ps-2"> {dataItem.Title ? dataItem.Title : null}
                                                                                <a className=""
                                                                                    onClick={() => removeSelectedClientCategory("Education")}
                                                                                >
                                                                                    <img src={require('../../Assets/ICON/cross.svg')} width="20" className="bg-e9 border mb-1 mx-1 p-1 rounded-5" />
                                                                                </a>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <input type="text" value={SearchedKeyForEducation} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Education", 344)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />
                                                                        )
                                                                    }
                                                                })}
                                                                </> : <input type="text" value={SearchedKeyForEducation} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Education", 344)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />}

                                                            {
                                                                siteData.BtnStatus ?
                                                                    <a className="bg-white border border-secondary pancilicons"
                                                                        onClick={() => openClientCategoryModel(344, "Education")}
                                                                    >
                                                                          <span title="Edit Task" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                        {/* <img src={require('../../Assets/ICON/edit_page.svg')} width="25" /> */}
                                                                    </a>
                                                                    : null
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
                                                        <div className="input-group block justify-content-between Compositionfild">
                                                            {MigrationClientCategory != undefined && MigrationClientCategory.length > 0 ?
                                                                <> {MigrationClientCategory?.map((dataItem: any) => {
                                                                    if (dataItem.siteName == siteData.Title) {
                                                                        return (
                                                                            <div className="bg-69 p-1 ps-2"> {dataItem.Title ? dataItem.Title : null}
                                                                                <a className=""
                                                                                    onClick={() => removeSelectedClientCategory("Migration")}
                                                                                >
                                                                                    <img src={require('../../Assets/ICON/cross.svg')} width="20" className="bg-e9 border mb-1 mx-1 p-1 rounded-5" />
                                                                                </a>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <input type="text" value={SearchedKeyForMigration} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Migration", 569)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />
                                                                        )
                                                                    }
                                                                })}
                                                                </> : <input type="text" value={SearchedKeyForMigration} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Migration", 569)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true} />}

                                                            {
                                                                siteData.BtnStatus ?
                                                                    <a className="bg-white border border-secondary pancilicons"
                                                                        onClick={() => openClientCategoryModel(569, 'Migration')}
                                                                    >
                                                                          <span title="Edit Task" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                        {/* <img src={require('../../Assets/ICON/edit_page.svg')} width="25" /> */}
                                                                    </a>
                                                                    : null
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
                <div className="bg-secondary d-flex justify-content-between p-1 shadow-lg">
                    <div>
                        <button className="btn btn-primary px-4 ms-2" onClick={UpdateSiteTaggingAndClientCategory} style={usedFor == 'Task-Profile' ? { display: 'block' } : { display: 'none' }}>
                            Save
                        </button>
                    </div>
                    <div className="d-flex justify-content-end full-width">
                        <div className="bg-body col-sm-2 p-1">
                            <div className="">{isPortfolioComposition == true || ProportionalStatus == false ? `${TotalPercent} %` : "100%"}</div>
                        </div>
                        <div className="bg-body col-sm-2 p-1 mx-2">
                            <div className="">{TotalTime ? TotalTime : 0}</div>
                        </div>
                    </div>

                </div>
            </div>
            {/* ********************* this Client Category panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomClientCategoryHeader}
                isOpen={ClientCategoryPopupStatus}
                onDismiss={closeClientCategoryPopup}
                isBlocking={ClientCategoryPopupStatus}
                type={PanelType.custom}
                customWidth="850px"
                onRenderFooter={onRenderFooter}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
                    <div className="">
                        <div className="row">
                            <div className="d-flex text-muted pt-3 showCateg">
                                <ImPriceTags />
                                <div className="pb-3 mb-0">
                                    <div id="addNewTermDescription">
                                        <p className="mb-1"> New items are added under the currently selected item.
                                            <span><a className="hreflink" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/SmartMetadata.aspx`} > Add New Item </a></span>
                                        </p>
                                    </div>
                                    <div id="SendFeedbackTr">
                                        <p className="mb-1">Make a request or send feedback to the Term Set manager.
                                            <span><a className="hreflink"> Send Feedback </a></span>
                                        </p>
                                    </div>

                                </div>
                                <div className="d-end">
                                    <button type="button" className="btn btn-primary" onClick={saveSelectedClientCategoryData}>
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
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

                            <div className="border full-width my-2 p-2 pb-1 ActivityBox">
                                {ClientCategoryPopupSiteName == "EPS" ?
                                    <>
                                        {EPSClientCategory != undefined && EPSClientCategory.length > 0 ?
                                            <span className="bg-69 p-1 ps-2">
                                                {EPSClientCategory != undefined && EPSClientCategory.length > 0 ? EPSClientCategory[0].Title : null}
                                                <a className=""
                                                    onClick={() => removeSelectedClientCategory("EPS")}
                                                >
                                                    <img src={require('../../Assets/ICON/cross.svg')} width="20" className="bg-e9 border mb-1 mx-1 p-1 rounded-5" />
                                                </a>
                                            </span>
                                            : null}
                                    </>
                                    : null}
                                {ClientCategoryPopupSiteName == "EI" ?
                                    <>
                                        {EIClientCategory != undefined && EIClientCategory.length > 0 ?
                                            <span className="bg-69 p-1 ps-2">
                                                {EIClientCategory[0].Title}
                                                <a className=""
                                                    onClick={() => removeSelectedClientCategory("EI")}
                                                >
                                                    <img src={require('../../Assets/ICON/cross.svg')} width="20" className="bg-e9 border mb-1 mx-1 p-1 rounded-5" />
                                                </a>
                                            </span>
                                            : null}
                                    </>
                                    : null}
                                {ClientCategoryPopupSiteName == "Education" ?
                                    <>
                                        {EducationClientCategory != undefined && EducationClientCategory.length > 0 ?
                                            <span className="bg-69 p-1 ps-2">
                                                {EducationClientCategory[0].Title}
                                                <a className=""
                                                    onClick={() => removeSelectedClientCategory("Education")}
                                                >
                                                    <img src={require('../../Assets/ICON/cross.svg')} width="20" className="bg-e9 border mb-1 mx-1 p-1 rounded-5" />
                                                </a>
                                            </span>
                                            : null}
                                    </>
                                    : null}
                                {ClientCategoryPopupSiteName == "Migration" ?
                                    <>
                                        {MigrationClientCategory != undefined && MigrationClientCategory.length > 0 ?
                                            <span className="bg-69 p-1 ps-2">

                                                {MigrationClientCategory[0].Title}
                                                <a className=""
                                                    onClick={() => removeSelectedClientCategory("Migration")}
                                                >
                                                    <img src={require('../../Assets/ICON/cross.svg')} width="20" className="bg-e9 border mb-1 mx-1 p-1 rounded-5" />
                                                </a>

                                            </span> : null}
                                    </>
                                    : null}

                            </div>
                            {SelectedSiteClientCategoryData != undefined && SelectedSiteClientCategoryData.length > 0 ?
                                <ul className="categories-menu p-0">
                                    {SelectedSiteClientCategoryData.map(function (item: any) {
                                        return (
                                            <>
                                                <li>
                                                    <p className='mb-0 hreflink' onClick={() => SelectedClientCategoryFromDataList(item, "Popup")} >
                                                        <a>
                                                            {item.Title}
                                                            {item.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                <div className="popover__content">
                                                                    <span>{item.Description1}</span>
                                                                </div>
                                                            </div> : null}
                                                        </a>
                                                    </p>
                                                    <ul className="sub-menu clr">
                                                        {item.Child?.map(function (child1: any) {
                                                            return (
                                                                <>
                                                                    {child1.Title != null ?
                                                                        <li>
                                                                            <p className='mb-0 hreflink' onClick={() => SelectedClientCategoryFromDataList(child1, "Popup")}>
                                                                                <a>
                                                                                    {child1.Item_x0020_Cover ?
                                                                                        <img className="flag_icon"
                                                                                            style={{ height: "20px", borderRadius: "10px", border: "1px solid #000069" }}
                                                                                            src={child1.Item_x0020_Cover ? child1.Item_x0020_Cover.Url : ''}
                                                                                        /> :
                                                                                        null}
                                                                                    {child1.Title}
                                                                                    {child1.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                        <div className="popover__content">
                                                                                            <span>{child1.Description1}</span>
                                                                                        </div>
                                                                                    </div> : null}
                                                                                </a>
                                                                            </p>
                                                                            <ul className="sub-menu clr">
                                                                                {child1.Child?.map(function (child2: any) {
                                                                                    return (
                                                                                        <>
                                                                                            {child2.Title != null ?
                                                                                                <li>
                                                                                                    <p className='mb-0 hreflink' onClick={() => SelectedClientCategoryFromDataList(child2, "Popup")}>
                                                                                                        <a>
                                                                                                            {child2.Item_x0020_Cover ?
                                                                                                                <img className="flag_icon"
                                                                                                                    style={{ height: "20px", borderRadius: "10px", border: "1px solid #000069" }}
                                                                                                                    src={child2.Item_x0020_Cover ? child2.Item_x0020_Cover.Url : ''}
                                                                                                                /> :
                                                                                                                null}
                                                                                                            {child2.Title}
                                                                                                            {child2.Description1 ? <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                <div className="popover__content">
                                                                                                                    <span>{child2.Description1}</span>
                                                                                                                </div>
                                                                                                            </div> : null}
                                                                                                        </a>
                                                                                                    </p>
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
    )
}
export default SiteCompositionComponent;