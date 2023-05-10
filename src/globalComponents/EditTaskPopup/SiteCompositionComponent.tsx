import * as React from "react";
import { useState, useEffect } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { ImPriceTags } from 'react-icons/im';
import Tooltip from "../Tooltip";
import { Suggest } from "@pnp/sp/search";

var AutoCompleteItemsArray: any = [];
var SelectedClientCategoryBackupArray: any = [];
var BackupSiteTypeData: any = [];
const SiteCompositionComponent = (Props: any) => {
    const SiteData = Props.SiteTypes;
    var ClientTime = Props.ClientTime;
    var SitesTaggingData: any = Props.SitesTaggingData
    const isPortfolioConncted = Props.isPortfolioConncted;
    const AllListIdData: any = Props.AllListId
    const siteUrls = Props.siteUrls;
    const TotalTime = Props.SmartTotalTimeData;
    const callBack = Props.callBack;
    const currentListName = Props.currentListName;
    const ServicesTaskCheck = Props.isServiceTask;
    const SiteCompositionSettings = (Props.SiteCompositionSettings != undefined ? JSON.parse(Props.SiteCompositionSettings) : [{ Proportional: false, Manual: false, Portfolio: false, localSiteComposition: false }]);
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
    const [SearchWithDescriptionStatus, setSearchWithDescriptionStatus] = useState(false);
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
                        ClientTime = tempDataForRemove;
                        callBack(SiteCompositionObject);
                    } else {
                        DataItem.BtnStatus = true
                        setSelectedSiteCount(selectedSiteCount + 1);
                        const object = {
                            SiteName: DataItem.Title,
                            ClienTimeDescription: (100 / (selectedSiteCount + 1)).toFixed(1),
                            localSiteComposition: true,
                            siteIcons: DataItem.Item_x005F_x0020_Cover
                        }
                        ClientTime.push(object);
                        let tempData: any = [];
                        ClientTime?.map((TimeData: any) => {
                            TimeData.ClienTimeDescription = (100 / (selectedSiteCount + 1)).toFixed(1);
                            tempData.push(TimeData);
                        })
                        setClientTimeData(tempData);
                        SiteCompositionObject.ClientTime = tempData;
                        callBack(SiteCompositionObject);
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
            callBack(SiteCompositionObject);
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
            let object:any;
            if(SiteCompositionSettings[0].localSiteComposition == true){
                object = { ...SiteCompositionSettings[0],localSiteComposition: false }
            }else{
                object = { ...SiteCompositionSettings[0],localSiteComposition: true }
            }
            SiteCompositionSettings[0] = object;
           
        }
        SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
        SiteCompositionObject.ClientTime = ClientTimeData;
        callBack(SiteCompositionObject);
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
        BuildIndividualAllDataArray(SiteParentId);
    }

    const BuildIndividualAllDataArray = (SiteParentId: any) => {
        let ParentArray: any = [];
        AutoCompleteItemsArray = [];
        if (AllClientCategoryData != undefined && AllClientCategoryData.length > 0) {
            AllClientCategoryData?.map((ArrayData: any) => {
                if (ArrayData.ParentId == SiteParentId) {
                    ArrayData.Child = [];
                    ArrayData.newLabel = ArrayData.siteName + " > " + ArrayData.Title;
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
                    if (usedFor == "Popup") {
                        setSearchedClientCategoryData(TempArray)
                    } else {
                        setSearchedClientCategoryDataForInput(TempArray)
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
                    if (usedFor == "Popup") {
                        setSearchedClientCategoryData(TempArray)
                    } else {
                        setSearchedClientCategoryDataForInput(TempArray)
                    }
                }
            }
        } else {
            setSearchedClientCategoryData([]);
            setSearchedClientCategoryDataForInput([]);
        }
    }

    const SelectClientCategoryFromAutoSuggestion = (selectedCategory: any) => {
        setSearchedKey('');
        setSearchedKeyForEPS("")
        setSearchedKeyForEI("")
        setSearchedKeyForEducation("")
        setSearchedKeyForMigration("")
        setSearchedClientCategoryData([]);
        setSearchedClientCategoryDataForInput([]);
        SelectedClientCategoryFromDataList(selectedCategory);

    }

    const SelectedClientCategoryFromDataList = (selectedCategory: any) => {
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
        saveSelectedClientCategoryData();
        // setSelectedClientCategory(selectedClientCategory);
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
        }
        callBack(SiteCompositionObject);
        AutoCompleteItemsArray = [];
        SelectedClientCategoryBackupArray = [];
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
        }
        callBack(SiteCompositionObject);
    }

    // ************************ this is for the auto Suggestion fuction for all Client Category ******************

    const autoSuggestionsForClientCategoryIdividual = (e: any, siteType: any, SiteId: any) => {
        let SearchedKey: any = e.target.value;
        setClientCategoryPopupSiteName(siteType);
        if (siteType == "EPS") {
            BuildIndividualAllDataArray(SiteId);
            AutoSuggestionForClientCategory(e, "For-Input");
            setSearchedKeyForEPS(SearchedKey);
        }
        if (siteType == "EI") {
            BuildIndividualAllDataArray(SiteId);
            AutoSuggestionForClientCategory(e, "For-Input");
            setSearchedKeyForEI(SearchedKey);
        }
        if (siteType == "Education") {
            BuildIndividualAllDataArray(SiteId);
            AutoSuggestionForClientCategory(e, "For-Input");
            setSearchedKeyForEducation(SearchedKey);
        }
        if (siteType == "Migration") {
            BuildIndividualAllDataArray(SiteId);
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

    return (
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
            {console.log("All Category Data in Div ======", AllClientCategoryData)}
            <div className="row">
                <a target="_blank " className="text-end siteColor" href={`${siteUrls}/SitePages/TaskUser-Management.aspx`} data-interception="off">
                    Task User Management
                </a>
            </div>
            <div className="col-sm-12 ps-3">
                <input
                    type="radio"
                    id="Proportional"
                    defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                    onChange={() => ChangeSiteCompositionSettings("Proportional")}
                    name="SiteCompositions"
                    value={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                    title="add Proportional Time"
                    className="me-1"
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
                    value={SiteCompositionSettings ? SiteCompositionSettings[0].Portfolio : false}
                    onChange={() => ChangeSiteCompositionSettings("Portfolio")}
                    className="mx-1" />
                <label>
                    Portfolio
                </label>
                <img className="mt-0 siteColor mx-1" onClick={()=>alert("We are working on it. This feature will be live soon..")} title="Click here to edit tagged portfolio site composition." src="/sites/HHHH/SiteCollectionImages/ICONS/32/icon_inline.png" />
                <span className="pull-right">
                    <input
                        type="checkbox"
                        className="form-check-input mb-0 ms-2 mt-1 mx-1 rounded-0"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].localSiteComposition : false}
                        onChange={() => ChangeSiteCompositionSettings("Overridden")}
                    />
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
                                                        type="number" min="1"
                                                        value={siteData.ClienTimeDescription ?  Number(siteData.ClienTimeDescription).toFixed(2) : null}
                                                        className="form-control p-1" readOnly={true} style={{ cursor: "not-allowed" }}
                                                        onChange={(e) => ChangeTimeManuallyFunction(e, siteData.Title)}
                                                    /> : <input type="number" min="1"
                                                        style={ProportionalStatus && siteData.BtnStatus ? { cursor: "not-allowed" } : {}}
                                                        defaultValue={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) : ""}
                                                        value={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(2) : ""}
                                                        className="form-control p-1" readOnly={ProportionalStatus}
                                                    />}  </>
                                                    : <> {siteData.BtnStatus ?
                                                        <input
                                                            type="number" min="1"
                                                            defaultValue={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(2) : null}
                                                            className="form-control p-1"
                                                            onChange={(e) => ChangeTimeManuallyFunction(e, siteData.Title)}
                                                        /> : <input type="number" readOnly={true} style={{ cursor: "not-allowed" }}
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
                                                {siteData.Title == "EI" && (currentListName?.toLowerCase() == "ei" || currentListName?.toLowerCase() == "shareweb") ?
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
                                                                            <input type="text" value={SearchedKeyForEI} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EI", 340)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />
                                                                        )
                                                                    }
                                                                })}
                                                                </> : <input type="text" value={SearchedKeyForEI} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EI", 340)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />}
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
                                                                            <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item)} >
                                                                                <a>{item.newLabel}</a>
                                                                            </li>
                                                                        )
                                                                    }
                                                                    )}
                                                                </ul>
                                                            </div>) : null}
                                                    </>
                                                    : null}
                                                {siteData.Title == "EPS" && (currentListName?.toLowerCase() == "eps" || currentListName?.toLowerCase() == "shareweb") ?
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
                                                                            <input type="text" value={SearchedKeyForEPS} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EPS", 341)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />
                                                                        )
                                                                    }
                                                                })}
                                                                </> : <input type="text" value={SearchedKeyForEPS} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EPS", 341)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />}
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
                                                                            <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item)} >
                                                                                <a>{item.newLabel}</a>
                                                                            </li>
                                                                        )
                                                                    }
                                                                    )}
                                                                </ul>
                                                            </div>) : null}
                                                    </>
                                                    : null}
                                                {siteData.Title == "Education" && (currentListName?.toLowerCase() == "education" || currentListName?.toLowerCase() == "shareweb") ?
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
                                                                            <input type="text" value={SearchedKeyForEducation} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Education", 344)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />
                                                                        )
                                                                    }
                                                                })}
                                                                </> : <input type="text" value={SearchedKeyForEducation} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Education", 344)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />}

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
                                                                            <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item)} >
                                                                                <a>{item.newLabel}</a>
                                                                            </li>
                                                                        )
                                                                    }
                                                                    )}
                                                                </ul>
                                                            </div>) : null}
                                                    </>
                                                    : null}
                                                {siteData.Title == "Migration" && (currentListName?.toLowerCase() == "migration" || currentListName?.toLowerCase() == "shareweb") ?
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
                                                                            <input type="text" value={SearchedKeyForMigration} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Migration", 569)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />
                                                                        )
                                                                    }
                                                                })}
                                                                </> : <input type="text" value={SearchedKeyForMigration} onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Migration", 569)} style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }} className="border-secondary form-control" placeholder="Client Category" readOnly={siteData.BtnStatus ? false : true} />}

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
                                                                            <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item)} >
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
                        <div className="">100%</div>
                    </div>
                    <div className="bg-body col-sm-2 p-1 mx-2">
                        <div className="">{TotalTime ? TotalTime : 0}</div>
                    </div>
                </div>
            </div>
            {/* ********************* this Client Category panel ****************** */}
            <Panel
                onRenderHeader={onRenderCustomClientCategoryHeader}
                isOpen={ClientCategoryPopupStatus}
                onDismiss={closeClientCategoryPopup}
                isBlocking={ClientCategoryPopupStatus}
                type={PanelType.medium}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
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
                        <div className='col-sm-12 categScroll' style={{ height: "auto" }}>
                            <input type="checkbox" className="form-check-input me-1 rounded-0" defaultChecked={SearchWithDescriptionStatus} onChange={() => setSearchWithDescriptionStatus(SearchWithDescriptionStatus ? false : true)} /> <label> Search With Description (Info Icons)</label>
                            <input className="form-control my-2" type='text' placeholder="Search Name Here!" value={searchedKey} onChange={(e) => AutoSuggestionForClientCategory(e, "Popup")} />
                            {SearchedClientCategoryData?.length > 0 ? (
                                <div className="SearchTableCategoryComponent">
                                    <ul className="list-group">
                                        {SearchedClientCategoryData.map((item: any) => {
                                            return (
                                                <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectClientCategoryFromAutoSuggestion(item)} >
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
                                                    <p className='mb-0 hreflink' onClick={() => SelectedClientCategoryFromDataList(item)} >
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
                                                                            <p className='mb-0 hreflink' onClick={() => SelectedClientCategoryFromDataList(child1)}>
                                                                                <a>
                                                                                    {child1.Item_x0020_Cover ? <img className="flag_icon"
                                                                                        style={{ height: "20px", borderRadius: "10px", border: "1px solid #000069" }}
                                                                                        src={child1.Item_x0020_Cover ? child1.Item_x0020_Cover.Url : ''} /> :
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
                    <footer className="float-end mt-1">
                        <span>
                            <a className="siteColor mx-1" target="_blank" data-interception="off" href={`${siteUrls}/SitePages/SmartMetadata.aspx`} >Manage Smart Taxonomy</a>
                        </span>
                        <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveSelectedClientCategoryData} >
                            Save
                        </button>
                    </footer>
                </div>
            </Panel>
        </div >
    )
}
export default SiteCompositionComponent;