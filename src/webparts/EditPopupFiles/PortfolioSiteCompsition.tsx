import * as React from "react";
import { useState, useEffect } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { ImPriceTags } from 'react-icons/im';
import Tooltip from "../../globalComponents/Tooltip";
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';

var AutoCompleteItemsArray: any = [];
var SelectedClientCategoryBackupArray: any = [];
var BackupSiteTypeData: any = [];
var SiteTaggingFinalData: any = [];
var SiteSettingsFinalData: any = [];
var SiteClientCatgeoryFinalData: any = [];
const SiteCompositionComponent = (Props: any) => {
    const SiteData = Props.SiteTypes;
    var ClientTime = Props.ClientTime != undefined ? Props.ClientTime : [];
    var SitesTaggingData: any = Props.SitesTaggingData;
    var ItemId = Props.ItemId;
    const isPortfolioConncted = Props.isPortfolioConncted;
    const AllListIdData: any = Props.AllListId
    const siteUrls = Props.siteUrls;
    const TotalTime = Props.SmartTotalTimeData;
    const callBack = Props.callBack;
    const currentListName = Props.currentListName;
    const ServicesTaskCheck = Props.isServiceTask;
    const SiteCompositionSettings = (Props.SiteCompositionSettings != undefined ? JSON.parse(Props.SiteCompositionSettings) : [{ Proportional: false, Manual: false, Protected: false }]);
    const SelectedClientCategoryFromProps = Props.SelectedClientCategory;
    const [SiteTypes, setSiteTypes] = useState([]);
    const [selectedSiteCount, setSelectedSiteCount] = useState(Props.ClientTime?.length);
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
                    setEPSClientCategory([dataItem])
                }
                if (dataItem.siteName == "EI") {
                    setEIClientCategory([dataItem])
                }
                if (dataItem.siteName == "Education") {
                    setEducationClientCategory([dataItem])
                }
                if (dataItem.siteName == "Migration") {
                    setMigrationClientCategory([dataItem])
                }
                SelectedClientCategoryBackupArray.push(dataItem);
            })
        }
        if (SiteData != undefined && SiteData.length > 0) {
            SiteData.map((SiteItem: any) => {
                if (SiteItem.Title !== "Health" && SiteItem.Title !== "Offshore Tasks" && SiteItem.Title !== "Gender" && SiteItem.Title !== "Small Projects") {
                    tempData.push(SiteItem);
                }
            })
            if (tempData != undefined && tempData.length > 0) {
                tempData?.map((data: any) => {
                    if (ClientTime?.length > 0) {
                        ClientTime?.map((ClientItem: any) => {
                            if (ClientItem.Title == data.Title || (ClientItem.Title ==
                                "DA E+E" && data.Title == "ALAKDigital")) {
                                data.ClienTimeDescription = ClientItem.ClienTimeDescription;
                                data.BtnStatus = true;
                                data.Date = ClientItem.Date;
                                data.readOnly = true;
                            }
                        })
                        tempData2.push(data);
                        BackupSiteTypeData.push(data);
                    }else{
                        data.ClienTimeDescription = 0;
                        data.BtnStatus = false;
                        data.Date = '';
                        data.readOnly = false;
                        tempData2.push(data);
                        BackupSiteTypeData.push(data);
                    }
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
                                if (Data.Title != DataItem.Title) {
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
                        SiteTaggingFinalData = tempDataForRemove;
                        ClientTime = tempDataForRemove;
                        // callBack(SiteCompositionObject);
                    } else {
                        DataItem.BtnStatus = true
                        DataItem.Date = Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
                        DataItem.readOnly = true
                        setSelectedSiteCount(selectedSiteCount + 1);
                        const object = {
                            SiteName: DataItem.Title,
                            ClienTimeDescription: (100 / (selectedSiteCount + 1)).toFixed(1),
                            localSiteComposition: true,
                            siteIcons: DataItem.Item_x005F_x0020_Cover?.Url,
                            Date: DataItem.Date
                        }
                        ClientTime.push(object);
                        let tempData: any = [];
                        ClientTime?.map((TimeData: any) => {
                            TimeData.ClienTimeDescription = (100 / (selectedSiteCount + 1)).toFixed(1);
                            tempData.push(TimeData);
                        })
                        setClientTimeData(tempData);
                        SiteCompositionObject.ClientTime = tempData;
                        SiteTaggingFinalData = tempData;
                        // callBack(SiteCompositionObject);
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
            const object = { ...SiteCompositionSettings[0], Proportional: true, Manual: false, Protected: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(true);
            let tempData: any = [];
            ClientTime?.map((TimeData: any) => {
                TimeData.ClienTimeDescription = (100 / (selectedSiteCount)).toFixed(1);
                tempData.push(TimeData);
            })
            SiteCompositionObject.ClientTime = tempData;
            SiteTaggingFinalData = tempData;
            // callBack(SiteCompositionObject);
            setIsPortfolioComposition(false);
            setCheckBoxStatus(false);
        }
        if (Type == "Manual") {
            const object = { ...SiteCompositionSettings[0], Proportional: false, Manual: true, Protected: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(false);
            setIsPortfolioComposition(false);
            setCheckBoxStatus(false);
        }
       
        if (Type == "Protected") {
            let object: any;
            if (SiteCompositionSettings[0].localSiteComposition == true) {
                object = { ...SiteCompositionSettings[0], Protected: false }
            } else {
                object = { ...SiteCompositionSettings[0], Protected: true }
            }
            SiteCompositionSettings[0] = object;

        }
        SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
        SiteCompositionObject.ClientTime = ClientTimeData;
        SiteSettingsFinalData = SiteCompositionSettings;
        SiteTaggingFinalData = ClientTimeData;

        // callBack(SiteCompositionObject);
        // }

    }

  
    //    ************** this is for Client Category Popup Functions **************


    //    ********** this is for Client Category Related all function and  function for Picker Component Popup ********
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
        setSelectedSiteClientCategoryData(ParentArray);
    }

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
        setSearchedKey('');
        setSearchedClientCategoryData([]);
        if (Type == "Main") {
            saveSelectedClientCategoryData();
        }
    }

    const saveSelectedClientCategoryData = () => {
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
            SiteClientCatgeoryFinalData = TempArray;
        }
        AutoCompleteItemsArray = [];
        SelectedClientCategoryBackupArray = [];
        closeClientCategoryPopup();
    }

    const UpdateSiteTaggingAndClientCategory = async () => {
        let SitesTaggingData: any = [];
        let ClientCategoryIDs: any = [];
        let ClientCategoryData: any = [];
        let SiteCompositionSettingData: any = [];
        let SiteTaggingJSON: any = []

        if (SiteTaggingFinalData?.length > 0) {
            SitesTaggingData = SiteTaggingFinalData
        } else {
            SitesTaggingData = ClientTime;
        }
        if (SiteClientCatgeoryFinalData?.length > 0) {
            ClientCategoryData = SiteClientCatgeoryFinalData
        } else {
            ClientCategoryData = SelectedClientCategoryFromProps;
        }
        if (SiteSettingsFinalData?.length > 0) {
            SiteCompositionSettingData = SiteSettingsFinalData
        } else {
            SiteCompositionSettingData = SiteCompositionSettings;
        }
        if (ClientCategoryData?.length > 0) {
            ClientCategoryData.map((dataItem: any) => {
                ClientCategoryIDs.push(dataItem.Id);
            })

        }else{
            ClientCategoryIDs = [];
        }

        if (SiteTaggingFinalData != undefined && SiteTaggingFinalData.length > 0) {
            let SiteIconStatus: any = false
            SiteTaggingFinalData?.map((ClientTimeItems: any) => {
                if (ClientTimeItems.siteIcons != undefined) {
                    if (ClientTimeItems.siteIcons?.length > 0 || ClientTimeItems.siteIcons?.Url?.length > 0) {
                        SiteIconStatus = true;
                    }
                }
                if (ClientTimeItems.ClientCategory != undefined || SiteIconStatus) {
                    let newObject: any = {
                        Title: ClientTimeItems.SiteName != undefined ? ClientTimeItems.SiteName : ClientTimeItems.Title,
                        ClienTimeDescription: ClientTimeItems.ClienTimeDescription,
                        Selected: true,
                        Date: ClientTimeItems.Date,
                        Available: true,
                        SiteImages:ClientTimeItems.siteIcons
                    }
                    SiteTaggingJSON.push(newObject);
                } else {
                    SiteTaggingJSON.push(ClientTimeItems);
                }
            })

        }

        try {
           
            let web = new Web(AllListIdData.siteUrl);
            await web.lists.getById(AllListIdData.MasterTaskListID).items.getById(ItemId).update({
                Sitestagging: JSON.stringify(SiteTaggingJSON),
                ClientCategoryId: { "results": (ClientCategoryIDs != undefined && ClientCategoryIDs.length > 0) ? ClientCategoryIDs : [] },
                SiteCompositionSettings: (SiteCompositionSettingData != undefined && SiteCompositionSettingData.length > 0) ? JSON.stringify(SiteCompositionSettingData) : SiteCompositionSettings,
            }).then(() => {
                console.log("Site Composition Updated !!!");
                alert("save successfully !!!");
            })
        } catch (error) {
            console.log("Error : ", error.message)
        }

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
                        siteIcons: TempData.Item_x005F_x0020_Cover,
                        Date: TempData.Date
                    }
                    ClientTimeTemp.push(object)
                }
            })
            SiteCompositionObject.ClientTime = ClientTimeTemp;
        }
        // callBack(SiteCompositionObject);
    }

    const ChangeDateManuallyFunction = (e: any, SiteName: any, Type: any) => {
        let TempArray: any = [];
        if (BackupSiteTypeData != undefined && BackupSiteTypeData) {
            BackupSiteTypeData?.map((SiteData: any) => {
                if (SiteData.Title == SiteName) {
                    if (Type == "readOnlyStatus") {
                        if (SiteData.readOnly == true) {
                            SiteData.readOnly = false;
                        } else {
                            SiteData.readOnly = true;
                        }
                    }
                    if (Type == "ChangeDate") {
                        SiteData.Date = Moment(e.target.value).format('DD/MM/YYYY');
                    }
                    TempArray.push(SiteData);
                } else {
                    TempArray.push(SiteData);
                }
            })
        }
        setSiteTypes(TempArray);
    }

    // ************************ this is for the auto Suggestion fuction for all Client Category ******************

    const autoSuggestionsForClientCategoryIdividual = (e: any, siteType: any, SiteId: any) => {
        let SearchedKey: any = e.target.value;
        setClientCategoryPopupSiteName(siteType);
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
            <div className="align-items-center col-sm-12 d-flex ps-3">
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
                    id="Proportional"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                    onChange={() => ChangeSiteCompositionSettings("Proportional")}
                    name="SiteCompositions"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                    title="add Proportional Time"
                    className="mx-1"
                />
                <label>Proportional</label>
                <span className="mx-1 ms-2 siteColor hreflink" onClick={() => alert("We are working on it, This feature will be live soon ...")} title="Click here to calculate allocation and start dates.">
                    Calculated
                </span>
                <label className="align-items-center d-flex hreflink mx-1 siteColor" onClick={() => alert("We are working on it, This feature will be live soon ...")}>
                    Clear  <span className="svg__icon--cross svg__iconbox"></span>
                </label>

                <span className="ml-auto pull-right">
                    <input
                        type="checkbox"
                        className="form-check-input mb-0 ms-2 mt-1 mx-1 rounded-0"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].localSiteComposition : false}
                        onChange={() => ChangeSiteCompositionSettings("Overridden")}
                    />
                    <label data-toggle="tooltip" data-placement="bottom">
                        Protected
                    </label>
                </span>
            </div>
            <div className="my-2 ps-3">
                <table className="table table-bordered mb-1">
                    {SiteTypes != undefined && SiteTypes.length > 0 ?
                        <tbody>
                            {SiteTypes?.map((siteData: any, index: any) => {
                                if (siteData.Title !== "Health" && siteData.Title !== "Offshore Tasks" && siteData.Title !== "Gender" && siteData.Title !== "Small Projects") {
                                    if (siteData.ClienTimeDescription != undefined || siteData.ClienTimeDescription != null) {
                                        let num: any = Number(siteData.ClienTimeDescription).toFixed(0);
                                        TotalPercent = TotalPercent + Number(num);
                                    }
                                    return (
                                        <tr>
                                            <td scope="row" className="m-0 p-1 align-middle" style={{ width: "3%" }}>
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

                                            </td>
                                            <td className="m-0 p-0 align-middle" style={{ width: "29%" }}>
                                                <img src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} style={{ width: '25px' }} className="mx-2" />
                                                {siteData.Title}
                                            </td>
                                            <td className="m-0 p-1" style={{ width: "20%" }}>
                                                {ProportionalStatus ?
                                                    <>{isPortfolioComposition ? <input
                                                        type="number" min="1"
                                                        value={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(1) : null}
                                                        className="form-control p-1" readOnly={true} style={{ cursor: "not-allowed" }}
                                                        onChange={(e) => ChangeTimeManuallyFunction(e, siteData.Title)}
                                                    /> : <input type="number" min="1"
                                                        style={ProportionalStatus && siteData.BtnStatus ? { cursor: "not-allowed" } : {}}
                                                        defaultValue={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(1) : ""}
                                                        value={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(1) : ""}
                                                        className="form-control p-1" readOnly={ProportionalStatus}
                                                    />}  </>
                                                    : <> {siteData.BtnStatus ?
                                                        <input
                                                            type="number" min="1"
                                                            defaultValue={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(2) : null}
                                                            className="form-control p-1"
                                                            onChange={(e) => ChangeTimeManuallyFunction(e, siteData.Title)}
                                                        /> : <input type="number" className="form-control" readOnly={true} style={{ cursor: "not-allowed", }}
                                                        />}</>
                                                }
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                <span>{siteData.BtnStatus ? "%" : ''}</span>
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "20%" }}>
                                                {siteData.BtnStatus ?
                                                    <div className="d-flex" style={{ width: "85%" }}>
                                                        {siteData.readOnly == false ? <input type="date" className="border-secondary form-control p-0 py-1"
                                                            defaultValue={siteData.Date != undefined ? Moment(siteData.Date).subtract(10, 'days').calendar() : ""} onChange={(e) => ChangeDateManuallyFunction(e, siteData.Title, "ChangeDate")} /> : <span className="form-control border-secondary p-0 px-2">{siteData.Date ? siteData.Date : ''}</span>}
                                                        <a className="bg-white border border-secondary" onClick={(e) => ChangeDateManuallyFunction(e, siteData.Title, "readOnlyStatus")}
                                                        >
                                                            {siteData.readOnly == true ? <span className="border svg__icon--editBox svg__iconbox"></span> : <span className="border svg__icon--cross svg__iconbox"></span>}
                                                        </a>
                                                    </div>
                                                    : null}
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "25%" }}>
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
                                                                        <img src={require('../../Assets/ICON/edit_page.svg')} width="25" />
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
                                                        <div className="input-group block justify-content-between">
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
                                                                    <a className="bg-white border border-secondary"
                                                                        onClick={() => openClientCategoryModel(341, "EPS")}
                                                                    >
                                                                        <img src={require('../../Assets/ICON/edit_page.svg')} width="25" />
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
                                                        <div className="input-group block justify-content-between">
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
                                                                    <a className="bg-white border border-secondary"
                                                                        onClick={() => openClientCategoryModel(344, "Education")}
                                                                    >
                                                                        <img src={require('../../Assets/ICON/edit_page.svg')} width="25" />
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
                                                        <div className="input-group block justify-content-between">
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
                                                                    <a className="bg-white border border-secondary"
                                                                        onClick={() => openClientCategoryModel(569, 'Migration')}
                                                                    >
                                                                        <img src={require('../../Assets/ICON/edit_page.svg')} width="25" />
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
                <div className="bg-secondary d-flex justify-content-end p-1 shadow-lg">
                    <div className="bg-body col-sm-2 p-1">
                        <div className="">{isPortfolioComposition == true || ProportionalStatus == false ? `${TotalPercent} %` : "100%"}</div>
                    </div>
                    <button className="btn ms-1 btn-primary px-4" onClick={UpdateSiteTaggingAndClientCategory}>Save</button>
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