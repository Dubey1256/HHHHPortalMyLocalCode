import * as React from "react";
import { useState, useEffect } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { ImPriceTags } from 'react-icons/im';
import { SlCalender } from 'react-icons/sl'
import Tooltip from "../../globalComponents/Tooltip";
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import * as globalCommon from "../../globalComponents/globalCommon";
import {
    mergeStyleSets,
    FocusTrapCallout,
    FocusZone,
    FocusZoneTabbableElements,
    FontWeights,
    Stack,
    Text,
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { TooltipHost, ITooltipHostStyles } from '@fluentui/react/lib/Tooltip';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import GlobalCommanTable, { IndeterminateCheckbox } from "../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import HighlightableCell from "../../globalComponents/GroupByReactTableComponents/highlight";

var AutoCompleteItemsArray: any = [];
var SelectedClientCategoryBackupArray: any = [];
var BackupSiteTypeData: any = [];
var SiteTaggingFinalData: any = [];
var SiteSettingsFinalData: any = [];
var SiteClientCatgeoryFinalData: any = [];
var AllSiteDataGlobalArray: any = [];
let SelectedClieantCategoryGlobal: any = [];
let ClientCategoryPopupSiteNameGlobal: any = '';

var UpdateCCDetailsForTaskList: any;
let FinalAllDataList: any = [];
let MasterTaskListData: any = [];
let SiteTaskListData: any = [];
var MasterTaskListId: any;
const SiteCompositionComponent = (Props: any) => {
    const SiteData = Props.SiteTypes;
    var SitesTaggingData: any = Props.SitesTaggingData;
    var ItemId = Props.ItemId;
    const isPortfolioConncted = Props.isPortfolioConncted;
    const AllListIdData: any = Props.AllListId
    MasterTaskListId = AllListIdData.MasterTaskListID
    const siteUrls = Props.siteUrls;
    const TotalTime = Props.SmartTotalTimeData;
    const callBack = Props.callBack;
    const currentListName = Props.currentListName;
    const ServicesTaskCheck = Props.isServiceTask;
    const SiteCompositionSettings = (Props.SiteCompositionSettings != undefined ? JSON.parse(Props.SiteCompositionSettings) : [{ Proportional: true, Manual: false, Protected: false }]);
    const SelectedClientCategoryFromProps = Props.SelectedClientCategory;
    const [SiteTypes, setSiteTypes] = useState<any>([]);
    const [selectedSiteCount, setSelectedSiteCount] = useState(Props.ClientTime?.length ? Props.ClientTime.length : 0);
    const [ProportionalStatus, setProportionalStatus] = useState(true);
    let [ClientTimeData, setClientTimeData] = useState<any>(Props.ClientTime != undefined ? Props.ClientTime : []);
    const [ClientCategoryPopupStatus, setClientCategoryPopupStatus] = useState(false);
    const [ComponentChildrenPopupStatus, setComponentChildrenPopupStatus] = useState(false);
    const [ComponentTableVisibiltyStatus, setComponentTableVisibiltyStatus] = useState(false);
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
    const [ComponentChildrenData, setComponentChildrenData] = useState([]);
    const [IsOpenDateModal, setIsOpenDateModal] = useState<any>(false);
    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
    const [currentDataIndex, setCurrentDataIndex] = useState<any>(0);
    const buttonId = useId(`callout-button`);
    const calloutProps = { gapSpace: 0 };

    const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };


    // const [SelectedClieantCategoryGlobal, setSelectedClieantCategoryGlobal] = useState<any>([]);

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
        // setClientTimeData(ClientTime);
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
            let tempClientTimeJSON: any = [];
            SiteData.map((SiteItem: any) => {
                if (SiteItem.Title !== "Health" && SiteItem.Title !== "Offshore Tasks" && SiteItem.Title !== "Gender" && SiteItem.Title !== "Small Projects") {
                    tempData.push(SiteItem);
                }
            })
            if (tempData != undefined && tempData.length > 0) {
                tempData?.map((data: any) => {
                    if (ClientTimeData?.length > 0) {
                        ClientTimeData?.map((ClientItem: any) => {
                            if (ClientItem.Title == data.Title || (ClientItem.Title ==
                                "DA E+E" && data.Title == "ALAKDigital")) {
                                data.ClienTimeDescription = ClientItem.ClienTimeDescription;
                                // if (data.StartEndDateValidation) {
                                //     data.BtnStatus = false;
                                // } else {
                                //     data.BtnStatus = true;
                                // }
                                data.BtnStatus = true;
                                data.Date = ClientItem.Date;
                                data.readOnly = true;
                                tempClientTimeJSON.push(ClientItem);
                            }

                        })
                        tempData2.push(data);
                        BackupSiteTypeData.push(data);
                    } else {
                        data.ClienTimeDescription = 0;
                        data.BtnStatus = false;
                        data.Date = '';
                        data.readOnly = false;
                        tempData2.push(data);
                        BackupSiteTypeData.push(data);
                    }
                })
            }
            setClientTimeData(tempClientTimeJSON);
            setSelectedSiteCount(tempClientTimeJSON?.length > 0 ? tempClientTimeJSON.length : 0)
            setSiteTypes(tempData2);
        }
        if (SiteCompositionSettings != undefined && SiteCompositionSettings.length > 0) {
            if (SiteCompositionSettings[0].Proportional) {
                setProportionalStatus(true);
            }
            if (SiteCompositionSettings[0].Manual) {
                setProportionalStatus(false);
            }
            if (SiteCompositionSettings[0].Protected) {
                setIsPortfolioComposition(true);
                setCheckBoxStatus(true)
            }
        }
        getChildDataForSelectedTask()
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
                        SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
                        SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
                        SiteTaggingFinalData = tempDataForRemove;
                        if (tempDataForRemove?.length > 0) {
                            callBack(SiteCompositionObject, "dataExits");
                        } else {
                            callBack(SiteCompositionObject, "dataDeleted")
                        }

                    } else {
                        DataItem.BtnStatus = true
                        DataItem.Date = Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
                        DataItem.readOnly = true
                        setSelectedSiteCount(selectedSiteCount + 1);
                        const object = {
                            Title: DataItem.Title,
                            ClienTimeDescription: (100 / (selectedSiteCount + 1)).toFixed(1),
                            localSiteComposition: true,
                            SiteImages: DataItem.Item_x005F_x0020_Cover?.Url,
                            Date: DataItem.Date
                        }
                        ClientTimeData.push(object);
                        let tempData: any = [];
                        ClientTimeData?.map((TimeData: any) => {
                            TimeData.ClienTimeDescription = (100 / (selectedSiteCount + 1)).toFixed(1);
                            tempData.push(TimeData);
                        })
                        setClientTimeData(tempData);
                        SiteTaggingFinalData = tempData;
                        SiteCompositionObject.ClientTime = tempData;
                        SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
                        SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
                        callBack(SiteCompositionObject, "dataExits");
                        // callBack(SiteCompositionObject);
                    }
                }
                TempArray.push(DataItem)
            })
        }
        setSiteTypes(TempArray);
    }
    // ########### this is used for changing the Client Time Descriptions of slected Site Composition ######################
    const ChangeTimeManuallyFunction = (e: any, SiteName: any) => {
        let TempArray: any = [];
        if (SiteTypes != undefined && SiteTypes) {
            SiteTypes?.map((SiteData: any) => {
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
                        ClienTimeDescription: TempData.ClienTimeDescription,
                        Title: TempData.Title,
                        localSiteComposition: true,
                        SiteImages: TempData.Item_x005F_x0020_Cover?.Url,
                        Date: TempData.Date
                    }
                    ClientTimeTemp.push(object)
                }
            })
            SiteTaggingFinalData = ClientTimeTemp;
            SiteCompositionObject.ClientTime = ClientTimeTemp;
            SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
            SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
        }
        // callBack(SiteCompositionObject);
        callBack(SiteCompositionObject, "dataExits");
    }
    // ########### this is used for changing the Date of slected Site Composition ######################
    const ChangeDateManuallyFunction = (e: any, SiteName: any, Type: any, PropertyName: any) => {
        let TempArray: any = [];
        let TempSiteTaggingData: any = [];
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
                    if (Type == "ChangeDate" && PropertyName == "StartDate") {
                        SiteData.Date = Moment(e.target.value).format('DD/MM/YYYY');
                    }
                    if (Type == "ChangeDate" && PropertyName == "EndDate") {
                        SiteData.EndDate = Moment(e.target.value).format('DD/MM/YYYY');
                    }
                    TempArray.push(SiteData);
                } else {
                    TempArray.push(SiteData);
                }
            })
        }

        if (TempArray != undefined && TempArray.length > 0) {
            TempArray?.map((TempData: any) => {
                if (TempData.BtnStatus) {
                    const object = {
                        ClienTimeDescription: TempData.ClienTimeDescription,
                        Title: TempData.Title,
                        localSiteComposition: true,
                        SiteImages: TempData.Item_x005F_x0020_Cover?.Url,
                        Date: TempData.Date,
                        EndDate: TempData.EndDate
                    }
                    TempSiteTaggingData.push(object)
                }
            })
            SiteTaggingFinalData = TempSiteTaggingData;
            SiteCompositionObject.ClientTime = TempSiteTaggingData;
            SiteCompositionObject.selectedClientCategory = SelectedClientCategoryBackupArray;
            SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
        }
        setSiteTypes(TempArray);
        callBack(SiteCompositionObject, "dataExits");
    }



    const ChangeSiteCompositionSettings = (Type: any) => {

        if (Type == "Proportional") {
            const object = { ...SiteCompositionSettings[0], Proportional: true, Manual: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(true);
            let tempData: any = [];
            ClientTimeData?.map((TimeData: any) => {
                TimeData.ClienTimeDescription = (100 / (selectedSiteCount)).toFixed(1);
                tempData.push(TimeData);
            })
            SiteCompositionObject.ClientTime = tempData;
            SiteTaggingFinalData = tempData;
            // CallBack(SiteCompositionObject, "dataExits");
            setIsPortfolioComposition(false);
            setCheckBoxStatus(false);
        }
        if (Type == "Manual") {
            const object = { ...SiteCompositionSettings[0], Manual: true, Proportional: false }
            SiteCompositionSettings[0] = object;
            setProportionalStatus(false);
            setIsPortfolioComposition(false);
            setCheckBoxStatus(false);
        }

        if (Type == "Protected") {
            let object: any;
            if (SiteCompositionSettings[0].Protected == true) {
                object = { ...SiteCompositionSettings[0], Protected: false }
            } else {
                object = { ...SiteCompositionSettings[0], Protected: true }
            }
            SiteCompositionSettings[0] = object;
            setIsPortfolioComposition(true);
            setCheckBoxStatus(true)
        }
        SiteCompositionObject.SiteCompositionSettings = SiteCompositionSettings;
        SiteCompositionObject.ClientTime = ClientTimeData;
        SiteSettingsFinalData = SiteCompositionSettings;
        SiteTaggingFinalData = ClientTimeData;
        callBack(SiteCompositionObject, "dataExits");
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

    const openClientCategoryModel = async (SiteParentId: any, SiteName: any) => {
        setClientCategoryPopupSiteName(SiteName);
        ClientCategoryPopupSiteNameGlobal = SiteName;
        // setSelectedClientCategory([]);
        CommoneFunctionForGettingSiteData(SiteName);
        setSearchedKey('');
        setClientCategoryPopupStatus(true);
        BuildIndividualAllDataArray(SiteParentId, SiteName);
    }

    const CommoneFunctionForGettingSiteData = (SiteName: any) => {
        let CurrentSelectedSiteData: any;
        if (SiteTypes?.length > 0) {
            SiteTypes.map((siteData: any) => {
                if (siteData.Title == SiteName) {
                    CurrentSelectedSiteData = siteData;
                }
            })
        }
        if (CurrentSelectedSiteData != undefined) {
            getSlectedSiteAllData(CurrentSelectedSiteData);
        }
    }

    const getSlectedSiteAllData = async (SiteData: any) => {
        let tempArray: any = [];
        let AllListDataArray: any = [];
        let SiteUrl: any = SiteData.siteUrl.Url;
        let ListId: any = SiteData.listId;
        try {
            let web = new Web(SiteUrl);
            tempArray = await web.lists
                .getById(ListId)
                .items
                .select('Id,Title,SiteCompositionSettings,ClientTime,ParentTask/Title,ParentTask/Id,ComponentId,Component/Id,RelevantPortfolio/Title,RelevantPortfolio/Id,Component/Title,ServicesId,Services/Id,Services/Title,TaskType/Id,TaskType/Title,TaskCategories/Id,TaskCategories/Title,ClientCategory/Id,ClientCategory/Title')
                .expand('Component,Services,ClientCategory,RelevantPortfolio,ParentTask,TaskCategories,TaskType')
                .getAll();
            if (tempArray?.length > 0) {
                tempArray?.map((allSiteData: any) => {
                    allSiteData.SiteIcon = SiteData.Item_x005F_x0020_Cover?.Url;
                    allSiteData.PortfolioStructureID = "T" + allSiteData.Id;
                    if (allSiteData.ComponentId == null || allSiteData.ComponentId == undefined) {
                        allSiteData.ComponentId = 0;
                    } else {
                        allSiteData.ComponentId = allSiteData.ComponentId[0];
                    }
                    if (allSiteData.ServicesId == null || allSiteData.ServicesId == undefined) {
                        allSiteData.ServicesId = 0;
                    } else {
                        allSiteData.ServicesId = allSiteData.ServicesId[0];
                    }
                    AllListDataArray.push(allSiteData)
                })
                // setSelectedSiteAllData(AllListDataArray);
                AllSiteDataGlobalArray = AllListDataArray;
                getChildDataForSelectedTask();
            }
        } catch (error) {
            console.log("Error", error.message);
        }
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
        // setSelectedClieantCategoryGlobal(selectedCategory);
        SelectedClieantCategoryGlobal = selectedCategory;
        if (Type == "Main") {
            saveSelectedClientCategoryData("Main");
        }
        if (Type == "Popup") {
            if (ComponentTableVisibiltyStatus) {
                setComponentChildrenPopupStatus(true)
            } else {
                setComponentChildrenPopupStatus(false)
            }
        }

    }

    const saveSelectedClientCategoryData = (usedFor: any) => {
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
        callBack(SiteCompositionObject, "dataExits");
        AutoCompleteItemsArray = [];
        SelectedClientCategoryBackupArray = [];
        closeClientCategoryPopup();
        if (usedFor == "Popup") {
            if (ComponentTableVisibiltyStatus) {
                setComponentChildrenPopupStatus(true)
            } else {
                setComponentChildrenPopupStatus(false)
            }
        }
    }

    const UpdateSiteTaggingAndClientCategory = async () => {
        let SitesTaggingData: any = [];
        let ClientCategoryIDs: any = [];
        let ClientCategoryData: any = [];
        let SiteCompositionSettingData: any = [];
        let SiteTaggingJSON: any = [];
        let TotalPercentageCount: any = 0;
        let TaskShuoldBeUpdate: any = true;

        if (SiteTaggingFinalData?.length > 0) {
            SitesTaggingData = SiteTaggingFinalData
        } else {
            SitesTaggingData = ClientTimeData;
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

        } else {
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
                        EndDate: ClientTimeItems.EndDate,
                        Available: true,
                        SiteImages: ClientTimeItems.siteIcons
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
            let UpdateSiteInSMD: any = [];
            if (SiteTypes?.length > 0) {
                SiteTypes.map((siteData: any) => {
                    SiteTaggingJSON?.map((CompositionData: any) => {
                        if (siteData.Title == CompositionData.Title) {
                            if (CompositionData.EndDate != undefined || CompositionData.EndDate != null) {
                                siteData.ConfigurationsData[0].EndDate = CompositionData.EndDate;
                                UpdateSiteInSMD.push(siteData);
                                UpdateSmartMetaDataSiteEndDate(siteData);
                            }
                        }
                    })
                })
            }
            try {
                let web = new Web(AllListIdData.siteUrl);
                await web.lists.getById(AllListIdData.MasterTaskListID).items.getById(ItemId).update({
                    Sitestagging: SiteTaggingJSON?.length > 0 ? JSON.stringify(SiteTaggingJSON) : JSON.stringify(ClientTimeData),
                    ClientCategoryId: { "results": (ClientCategoryIDs != undefined && ClientCategoryIDs.length > 0) ? ClientCategoryIDs : [] },
                    SiteCompositionSettings: (SiteCompositionSettingData != undefined && SiteCompositionSettingData.length > 0) ? JSON.stringify(SiteCompositionSettingData) : JSON.stringify(SiteCompositionSettings),
                }).then(() => {
                    console.log("Site Composition Updated !!!");
                    alert("save successfully !!!");
                })
            } catch (error) {
                console.log("Error : ", error.message)
            }
        }

    }

    const UpdateSmartMetaDataSiteEndDate = async (siteData: any) => {
        console.log("Smart Data list all data ======", siteData)
        let web = new Web(siteData.siteUrl.Url);
        try {
            await Promise.all([
                web.lists.getById(AllListIdData?.SmartMetadataListID).items.getById(siteData.Id).update({
                    Configurations: JSON.stringify(siteData?.ConfigurationsData)
                }).then(() => {
                    console.log("Site End Date Updated in Smart Meta Data List")
                })
            ]);
        } catch (error) {
            console.error("Error updating client category:", error);
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
        saveSelectedClientCategoryData("Main");
    }

    const closeClientCategoryPopup = () => {
        setClientCategoryPopupStatus(false)
        setSelectedClientCategory(SelectedClientCategoryBackupArray);
    }

    // ************************ this is for the auto Suggestion fuction for all Client Category ******************
    const closeComponentChildrenPopup = () => {
        setComponentChildrenPopupStatus(false)
    }

    const autoSuggestionsForClientCategoryIdividual = (e: any, siteType: any, SiteId: any) => {
        let SearchedKey: any = e.target.value;
        CommoneFunctionForGettingSiteData(siteType);
        setClientCategoryPopupSiteName(siteType);
        ClientCategoryPopupSiteNameGlobal = siteType;
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

    // ******************* this is used for Childern Table section functions ****************
    const getChildDataForSelectedTask = async () => {
        let countFirst = 0;
        let countSecond = 0;
        let countThird = 0;
        let GroupByData: any = [];
        let ChildData: any = []
        let ParentChild: any = [];
        let PropsObject: any = {
            MasterTaskListID: AllListIdData.MasterTaskListID,
            siteUrl: AllListIdData.siteUrl,
            ComponentType: Props.isServiceTask ? "Service" : "Component",
            TaskUserListId: AllListIdData.TaskUsertListID
        }
        let CallBackData = await globalCommon.GetServiceAndComponentAllData(PropsObject);
        if (CallBackData.AllData != undefined && CallBackData.AllData.length > 0) {
            console.log("aal service groupby data ====", CallBackData.GroupByData)
            GroupByData = CallBackData.GroupByData
        }
        if (GroupByData?.length > 0) {
            GroupByData.map((dataItem: any) => {
                if (dataItem.Id == ItemId) {
                    ChildData.push(dataItem);
                    countFirst++;
                }
                if (dataItem.Child?.length > 0) {
                    dataItem.Child.map((subChildItem: any) => {
                        if (subChildItem.id == ItemId) {
                            ChildData.push(subChildItem);
                            countSecond++;
                        }
                        if (subChildItem.Child?.lrngth > 0) {
                            subChildItem.Child.map((lastChildData: any) => {
                                if (lastChildData.Id == ItemId) {
                                    ChildData.push(subChildItem);
                                    countThird++;
                                }
                            })
                        }
                    })
                }
            })
        }
        if (countFirst + countSecond + countThird == 0) {
            setComponentTableVisibiltyStatus(false);
        } else {
            setComponentTableVisibiltyStatus(true);
        }
        if (ChildData?.length > 0) {
            let subChildDataCollection: any = [];
            ChildData.map((parentData: any) => {
                if (parentData.Child?.length > 0) {
                    parentData.Child.map((ChildDataFirst: any) => {
                        if (AllSiteDataGlobalArray?.length > 0) {
                            AllSiteDataGlobalArray?.map((allSiteData: any) => {
                                if (allSiteData.ServicesId == ChildDataFirst.Id || allSiteData.ComponentId == ChildDataFirst.Id) {
                                    ChildDataFirst.Child.push(allSiteData);
                                    ChildDataFirst.subRows.push(allSiteData);
                                    countFirst++;
                                }
                                if (ChildDataFirst.Child?.length > 0) {
                                    ChildDataFirst.Child.map((subChildItem: any) => {
                                        if (subChildItem.Id == allSiteData.ComponentId || subChildItem.Id == allSiteData.ServicesId) {
                                            subChildItem.Child.push(allSiteData);
                                            subChildItem.subRows.push(allSiteData);
                                            countSecond++;
                                        }
                                        if (subChildItem.Child?.lrngth > 0) {
                                            subChildItem.Child.map((lastChildData: any) => {
                                                if (lastChildData.Id == allSiteData.ComponentId || lastChildData.Id == allSiteData.ServicesId) {
                                                    lastChildData.Child.push(allSiteData);
                                                    lastChildData.subRows.push(allSiteData);
                                                    countThird++;
                                                }
                                                if (lastChildData.Child?.length > 0) {
                                                    lastChildData.Child?.map((EndChild: any) => {
                                                        if (EndChild.Id == allSiteData.ComponentId || EndChild.Id == allSiteData.ServicesId) {
                                                            EndChild.Child.push(allSiteData);
                                                            EndChild.subRows.push(allSiteData);
                                                            countThird++;
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        ParentChild.push(ChildDataFirst);
                    });
                }
            })
        }
        const finalData = ParentChild.filter((val: any, id: any, array: any) => {
            return array.indexOf(val) == id;
        })
        let FinalTempData: any = finalData;
        if (AllSiteDataGlobalArray?.length > 0) {
            AllSiteDataGlobalArray?.map((allSiteDataItem: any) => {
                if (allSiteDataItem.ServicesId == ItemId || allSiteDataItem.ComponentId == ItemId) {
                    FinalTempData.push(allSiteDataItem)
                }
            })
        }
        setComponentChildrenData(FinalTempData);
    }
    const columns = React.useMemo(
        () => [
            {
                accessorKey: "PortfolioStructureID",
                placeholder: "ID",
                size: 15,
                header: ({ table }: any) => (
                    <>
                        <button className='border-0 bg-Ff'
                            {...{
                                onClick: table.getToggleAllRowsExpandedHandler(),
                            }}
                        >
                            {table.getIsAllRowsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                        </button>{" "}
                        <IndeterminateCheckbox {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }} />{" "}
                    </>
                ),
                cell: ({ row, getValue }: any) => (
                    <div
                        style={row.getCanExpand() ? {
                            paddingLeft: `${row.depth * 5}px`,
                        } : {
                            paddingLeft: "18px",
                        }}
                    >
                        <>
                            {row.getCanExpand() ? (
                                <span className=' border-0'
                                    {...{
                                        onClick: row.getToggleExpandedHandler(),
                                        style: { cursor: "pointer" },
                                    }}
                                >
                                    {row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                                </span>
                            ) : (
                                ""
                            )}{" "}
                            {row?.original.Title != 'Others' ? <IndeterminateCheckbox
                                {...{
                                    checked: row.getIsSelected(),
                                    indeterminate: row.getIsSomeSelected(),
                                    onChange: row.getToggleSelectedHandler(),

                                }}
                            /> : ""}{" "}
                            {row?.original?.SiteIcon != undefined ?
                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                    <img className="icon-sites-img ml20 me-1" src={row?.original?.SiteIcon}></img>
                                </a> : <>{row?.original?.Title != "Others" ? <div className='Dyicons'>{row?.original?.SiteIconTitle}</div> : ""}</>
                            }
                            {getValue()}
                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row: any) => row?.Title,
                cell: ({ row, column, getValue }: any) => (
                    <>
                        <a className="hreflink serviceColor_Active" target="_blank"
                        // href={Dynamic.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.Id}
                        >
                            <HighlightableCell value={getValue()} searchTerm={column.getFilterValue()} />
                        </a>

                        {row?.original?.Short_x0020_Description_x0020_On != null &&
                            <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                <span title="Edit" className="svg__iconbox svg__icon--info"></span>
                                <span className="popover__content">
                                    {row?.original?.Short_x0020_Description_x0020_On}
                                </span>
                            </span>}
                    </>
                ),
                id: "Title",
                placeholder: "Title",
                header: "",
                size: 27,
            },
            {
                accessorFn: (row: any) => row?.ClientCategory?.map((elem: any) => elem.Title).join("-"),
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.ClientCategory?.map((elem: any) => {
                            return (
                                <> <span title={elem?.Title} className="ClientCategory-Usericon">{elem?.Title?.slice(0, 2).toUpperCase()}</span></>
                            )
                        })}
                    </>
                ),
                id: 'ClientCategory',
                placeholder: "Client Category",
                header: "",
                size: 15,
            },
            {
                accessorKey: "DueDate",
                placeholder: "Due Date",
                header: "",
                size: 9,
            },
        ],
        [ComponentChildrenData]
    );

    const data = ComponentChildrenData;

    //    ************* this is Custom Header For Client Category Popup *****************
    const onRenderCustomClientCategoryHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"} >
                <div className="subheading">
                    <span>
                        Select Client Category
                    </span>
                </div>
                <Tooltip ComponentId="1626" />
            </div>
        )
    }

    const callBackData = React.useCallback((elem: any, ShowingData: any) => {
        console.log("Call Back Elem Data ================", elem);
        let AllChildData: any = [];
        if (elem?.length > 0) {
            elem?.map((itemData: any) => {
                AllChildData.push(itemData.original)
            })
        }
        if (AllChildData?.length > 0) {
            makeDataForUpdateClientCategory(AllChildData)
        }
    }, []);

    const makeDataForUpdateClientCategory = (AllChildDataList: any) => {
        let MasterTaskTempArray: any = []
        let SiteTaskTempArray: any = []
        if (BackupSiteTypeData?.length > 0) {
            BackupSiteTypeData.map((siteList: any) => {
                if (siteList.Title == ClientCategoryPopupSiteNameGlobal) {
                    UpdateCCDetailsForTaskList = siteList;
                }
            })
        }

        if (AllChildDataList?.length > 0) {
            AllChildDataList.map((allItems: any) => {
                if (allItems.ClientCategory?.length > 0 || allItems.ClientCategory != null) {
                    allItems.ClientCategory.push(SelectedClieantCategoryGlobal);
                } else {
                    allItems.ClientCategory = [SelectedClieantCategoryGlobal];
                }
                FinalAllDataList.push(allItems);
            })
        }
        if (FinalAllDataList?.length > 0) {
            FinalAllDataList?.map((finalItems: any) => {
                if (finalItems.Item_x0020_Type == "SubComponent" || finalItems.Item_x0020_Type == "Feature" || finalItems.Item_x0020_Type == "Component") {
                    finalItems.ListId = AllListIdData.MasterTaskListID;
                    MasterTaskTempArray.push(finalItems);
                }
                if (finalItems.TaskType?.Title == "Task" || finalItems.TaskType?.Title == "Activities" || finalItems.TaskType?.Title == "Workstream") {
                    finalItems.ListId = UpdateCCDetailsForTaskList.listId;
                    SiteTaskTempArray.push(finalItems);
                }
            })
        }
        if (MasterTaskTempArray?.length > 0) {
            MasterTaskListData = MasterTaskTempArray;
        }
        if (SiteTaskTempArray?.length > 0) {
            SiteTaskListData = SiteTaskTempArray;
        }
    }

    const SaveClientCategoryFunction = () => {
        if (MasterTaskListData?.length > 0) {
            CommonFunctionForUpdateCC(MasterTaskListData, "MasterTask")
        }
        if (SiteTaskListData?.length > 0) {
            CommonFunctionForUpdateCC(SiteTaskListData, "SiteTasks")
        }

    }

    const CommonFunctionForUpdateCC = (AllTaskListData: any, ListType: any) => {
        let web = AllListIdData.siteUrl;
        if (AllTaskListData?.length > 0) {
            AllTaskListData?.map(async (ItemData: any) => {
                let TempArray: any = [];
                let ClientCategoryIds: any = [];
                if (ItemData.ClientCategory?.length > 0) {
                    ItemData.ClientCategory?.map((CCItems: any) => {
                        TempArray.push(CCItems.Id);
                    })
                }
                ClientCategoryIds = TempArray.filter((val: any, id: any, array: any) => {
                    return array.indexOf(val) == id;
                })

                if (ClientCategoryIds?.length > 0) {
                    if (ListType == "MasterTask") {
                        UpdateOnBackendSide(web, ItemData.ListId, ClientCategoryIds, ItemData.Id, ListType);
                    } else {
                        UpdateOnBackendSide(web, ItemData.ListId, ClientCategoryIds, ItemData.Id, ListType);
                    }
                }
            })
        }
        closeComponentChildrenPopup();
    }

    // const UpdateOnBackendSide = async (siteUrl: any, ListId: any, ClientCategoryIds: any, ItemId: any, TaskType: any) => {
    //     let web = siteUrl;
    //     (async () => {
    //         await Promise.all(
    //             web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF')
    //                 .items.getById(ItemId)
    //                 .update({
    //                     ClientCategory: { "results": (ClientCategoryIds != undefined && ClientCategoryIds.length > 0) ? ClientCategoryIds : [] },
    //                 }).then(() => {
    //                     console.log("Client Catgeory Updated !!!!");
    //                 })
    //         );

    //     })();
    //     // await web.lists
    //     //     .getById('EC34B38F-0669-480A-910C-F84E92E58ADF')
    //     //     .items.getById(ItemId)
    //     //     .update({
    //     //         ClientCategory: { "results": (ClientCategoryIds != undefined && ClientCategoryIds.length > 0) ? ClientCategoryIds : [] },
    //     //     }).then(() => {
    //     //         console.log("Client Catgeory Updated !!!!");
    //     //     })
    // }

    const UpdateOnBackendSide = async (siteUrl: any, ListId: any, ClientCategoryIds: any, ItemId: any, TaskType: any) => {
        let web = new Web(siteUrl);
        try {
            await Promise.all([
                web.lists.getById(ListId).items.getById(ItemId).update({
                    ClientCategoryId: { "results": (ClientCategoryIds !== undefined && ClientCategoryIds.length > 0) ? ClientCategoryIds : [] }
                }).then(() => {
                    console.log("Client Category Updated!")

                })
            ]);
        } catch (error) {
            console.error("Error updating client category:", error);
        }
    };

    const onRenderComponentChildrenHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"} >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span>
                        Select Item
                    </span>
                </div>
                <Tooltip ComponentId="1263" />
            </div>
        )
    }
    const onRenderFooterComponentChildren = () => {
        return (
            <footer
                className={ServicesTaskCheck ? "serviepannelgreena bg-f4 pe-2 py-2 text-end" : "bg-f4 pe-2 py-2 text-end"}
                style={{ position: "absolute", width: "100%", bottom: "0" }}
            >
                <button type="button" className="btn btn-primary px-3 mx-1" onClick={SaveClientCategoryFunction}>
                    Save
                </button>
                <button type="button" className="btn btn-default px-3 mx-1" onClick={closeComponentChildrenPopup} >
                    Cancel
                </button>
            </footer>
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
                <button type="button" className="btn btn-primary px-3 mx-1" onClick={() => saveSelectedClientCategoryData("Popup")} >
                    Save
                </button>
            </footer>
        )
    }

    // this is used for Change Start and End Date model 

    const closeDateModelFunction = () => {
        setIsOpenDateModal(false);
    }

    const SaveDateButtonFunction = () => {
        setIsOpenDateModal(false);
    }

    const OpenCallOutFunction = (IndexData: any) => {
        setCurrentDataIndex(IndexData);
        toggleIsCalloutVisible();
    }
    const styles = mergeStyleSets({
        callout: {
            width: 320,
            padding: '20px 24px',
        },
        title: {
            marginBottom: 12,
            fontWeight: FontWeights.semilight,
        },
        buttons: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 20,
        },
    });

    let TotalPercent: any = 0;
    return (
        <div className={ServicesTaskCheck ? "serviepannelgreena" : ""}>
            <div className="align-items-center col-sm-12 d-flex">
                <label className="SpfxCheckRadio me-2">
                    <input
                        type="radio"
                        id="Manual"
                        name="SiteCompositions"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Manual : false}
                        title="add manual Time"
                        className="radio"
                        value={SiteCompositionSettings ? SiteCompositionSettings[0].Manual : false}
                        onChange={() => ChangeSiteCompositionSettings("Manual")}
                    />
                    Manual</label>
                <label className="SpfxCheckRadio">
                    <input
                        type="radio"
                        id="Proportional"
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                        onChange={() => ChangeSiteCompositionSettings("Proportional")}
                        name="SiteCompositions"
                        value={SiteCompositionSettings ? SiteCompositionSettings[0].Proportional : false}
                        title="add Proportional Time"
                        className="radio"
                    />
                    Proportional</label>
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
                        defaultChecked={SiteCompositionSettings ? SiteCompositionSettings[0].Protected : false}
                        onChange={() => ChangeSiteCompositionSettings("Protected")}
                    />
                    <label data-toggle="tooltip" data-placement="bottom">
                        Protected
                    </label>
                </span>
            </div>
            <div className="my-2">
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
                                        <tr
                                            className={siteData?.StartEndDateValidation ? "Disabled-Link bg-th" : 'hreflink'}
                                        >
                                            <td scope="row" className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                {checkBoxStatus ? <input
                                                    className="form-check-input rounded-0 hreflink" type="checkbox"
                                                    checked={siteData.BtnStatus}
                                                    value={siteData.BtnStatus}
                                                    disabled={checkBoxStatus ? true : false}
                                                    style={checkBoxStatus ? { cursor: "not-allowed" } : {}}
                                                    onChange={(e) => selectSiteCompositionFunction(e, index)}
                                                /> : <input
                                                    className="form-check-input rounded-0 hreflink" type="checkbox"
                                                    checked={siteData.BtnStatus}
                                                    value={siteData.BtnStatus}
                                                    onChange={(e) => selectSiteCompositionFunction(e, index)}
                                                />}

                                            </td>
                                            <td className="m-0 p-0 align-middle" style={{ width: "15%" }}>
                                                <img src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} style={{ width: '25px' }} className="mx-2" />
                                                {siteData.Title}
                                            </td>
                                            <td className="m-0 p-1" style={{ width: "10%" }}>
                                                {ProportionalStatus ?
                                                    <>{isPortfolioComposition ? <input
                                                        type="number" min="1"
                                                        value={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(1) : null}
                                                        className="form-control p-1" readOnly={true} style={{ cursor: "not-allowed", width: '100%' }}
                                                        onChange={(e) => ChangeTimeManuallyFunction(e, siteData.Title)}
                                                    /> : <input type="number" min="1"
                                                        style={ProportionalStatus && siteData.BtnStatus ? { cursor: "not-allowed", width: "100%" } : {}}
                                                        defaultValue={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(1) : ""}
                                                        value={siteData.BtnStatus ? (100 / selectedSiteCount).toFixed(1) : ""}
                                                        className="form-control p-1" readOnly={ProportionalStatus}
                                                    />}  </>
                                                    : <> {siteData.BtnStatus ?
                                                        <input
                                                            type="number" min="1" style={{ width: '100%' }}
                                                            defaultValue={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(2) : null}
                                                            className="form-control p-1"
                                                            onChange={(e) => ChangeTimeManuallyFunction(e, siteData.Title)}
                                                        /> : <input type="number" className="form-control" value={''} readOnly={true} style={{ cursor: "not-allowed", width: "100%" }}
                                                        />}</>
                                                }
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "3%" }}>
                                                <span>{siteData.BtnStatus ? "%" : ''}</span>
                                            </td>
                                            <td className="m-0 p-1 align-middle" style={checkBoxStatus ? { width: "35%", cursor: "not-allowed", pointerEvents: "none" } : { width: "35%" }}>
                                                <div>
                                                    {siteData?.StartEndDateValidation ?
                                                        <div>
                                                            {/* <span>{`${siteData?.ConfigurationsData[0]?.StartDate?.length > 3 ? siteData?.ConfigurationsData[0]?.StartDate : "NA"} To ${siteData?.ConfigurationsData[0]?.EndDate?.length > 3 ? siteData?.ConfigurationsData[0]?.EndDate : "NA"}`}</span> */}
                                                            <span>Start Date - {siteData?.ConfigurationsData[0]?.StartDate?.length > 3 ? siteData?.ConfigurationsData[0]?.StartDate : "NA"}</span>
                                                            <span className="mx-1"></span>
                                                            <span>End Date - {siteData?.ConfigurationsData[0]?.EndDate?.length > 3 ? siteData?.ConfigurationsData[0]?.EndDate : "NA"}</span>
                                                        </div> :
                                                        <>
                                                            {
                                                                siteData.BtnStatus ?
                                                                    <div className="d-flex">
                                                                        {/* <span>{`${siteData.Date?.length > 3 ? siteData.Date : "NA"} ${siteData.EndDate?.length > 3 ? siteData.EndDate : "NA"}`}</span> */}
                                                                        <span className="mt-1">
                                                                            <span>Start Date - {siteData.Date?.length > 3 ? siteData.Date : "NA"}</span>
                                                                            <span className="mx-1"></span>
                                                                            <span>End Date - {siteData.EndDate?.length > 3 ? siteData.EndDate : "NA"}</span>
                                                                        </span>
                                                                        <div data-toggle="tooltip" id={buttonId + "-" + index}
                                                                            onClick={() => OpenCallOutFunction(index)}
                                                                            data-placement="bottom"
                                                                            className="ms-2"
                                                                        >
                                                                            {/* <TooltipHost
                                                                            content={`Start Date : ${siteData.Date} |  End Date : ${siteData.EndDate != undefined ? siteData.EndDate : "NA"}`}
                                                                            id={buttonId + "-" + index}
                                                                            calloutProps={calloutProps}
                                                                            styles={hostStyles}
                                                                        > */}
                                                                            <span aria-describedby={buttonId + "-" + index}><SlCalender /></span>
                                                                            {/* </TooltipHost> */}
                                                                        </div>
                                                                    </div>
                                                                    : null
                                                            }
                                                        </>

                                                    }
                                                </div>

                                            </td>
                                            <td className="m-0 p-1 align-middle" style={{ width: "35%" }}>
                                                {siteData.Title == "EI" ?
                                                    <>
                                                        <div className="input-group block justify-content-between">
                                                            {EIClientCategory != undefined && EIClientCategory.length > 0 ?
                                                                <> {EIClientCategory?.map((dataItem: any) => {
                                                                    if (dataItem.siteName == siteData.Title) {
                                                                        return (
                                                                            <div className="bg-69 d-flex full-width justify-content-between p-1 ps-2" title={dataItem.Title ? dataItem.Title : null}>
                                                                                {dataItem.Title ? dataItem.Title : null}
                                                                                <a className=""
                                                                                    onClick={() => removeSelectedClientCategory("EI")}
                                                                                >
                                                                                    <span className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                                </a>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <>
                                                                                <input type="text"
                                                                                    value={SearchedKeyForEI}
                                                                                    onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EI", 340)}
                                                                                    style={siteData.BtnStatus ? {} : { cursor: "not-allowed"}}
                                                                                    className={siteData.BtnStatus?"border-secondary border-end-0 form-control":"border-secondary form-control"}
                                                                                    placeholder="Search Client Category Here!"
                                                                                    readOnly={siteData.BtnStatus ? false : true} />
                                                                                {
                                                                                    siteData.BtnStatus ?
                                                                                        <a className="bg-white border border-secondary"
                                                                                            onClick={() => openClientCategoryModel(340, 'EI')}
                                                                                        >
                                                                                            <span title="Edit Client Category" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                                        </a>
                                                                                        : null
                                                                                }
                                                                            </>
                                                                        )
                                                                    }
                                                                })}
                                                                </> :
                                                                <>
                                                                    <input type="text"
                                                                        value={SearchedKeyForEI}
                                                                        onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EI", 340)}
                                                                        style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                        className={siteData.BtnStatus ? "border-secondary border-end-0 form-control" : "border-secondary form-control"}
                                                                        placeholder="Search Client Category Here!"
                                                                        readOnly={siteData.BtnStatus ? false : true}
                                                                    />
                                                                    {
                                                                        siteData.BtnStatus ?
                                                                            <a className="bg-white border border-secondary"
                                                                                onClick={() => openClientCategoryModel(340, 'EI')}
                                                                            >
                                                                                <span title="Edit Client Category" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                            </a>
                                                                            : null
                                                                    }
                                                                </>}

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
                                                                            <div className="bg-69 d-flex full-width justify-content-between p-1 ps-2" title={dataItem.Title ? dataItem.Title : null}>
                                                                                {dataItem.Title ? dataItem.Title : null}
                                                                                <a className=""
                                                                                    onClick={() => removeSelectedClientCategory("EPS")}
                                                                                >
                                                                                    <span className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                                </a>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <>
                                                                                <input type="text"
                                                                                    value={SearchedKeyForEPS}
                                                                                    onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EPS", 341)}
                                                                                    style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                                    className={siteData.BtnStatus ? "border-secondary border-end-0 form-control" : "border-secondary form-control"}
                                                                                    placeholder="Search Client Category Here!"
                                                                                    readOnly={siteData.BtnStatus ? false : true}
                                                                                />
                                                                                {
                                                                                    siteData.BtnStatus ?
                                                                                        <a className="bg-white border border-secondary"
                                                                                            onClick={() => openClientCategoryModel(341, "EPS")}
                                                                                        >
                                                                                            <span title="Edit Client Category" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                                        </a>
                                                                                        : null
                                                                                }
                                                                            </>
                                                                        )
                                                                    }
                                                                })}
                                                                </> :
                                                                <>
                                                                    <input type="text"
                                                                        value={SearchedKeyForEPS}
                                                                        onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "EPS", 341)}
                                                                        style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                        className={siteData.BtnStatus ? "border-secondary border-end-0 form-control" : "border-secondary form-control"}
                                                                        placeholder="Search Client Category Here!"
                                                                        readOnly={siteData.BtnStatus ? false : true} />
                                                                    {
                                                                        siteData.BtnStatus ?
                                                                            <a className="bg-white border border-secondary"
                                                                                onClick={() => openClientCategoryModel(341, "EPS")}
                                                                            >
                                                                                <span title="Edit Client Category" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                            </a>
                                                                            : null
                                                                    }
                                                                </>
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
                                                                            <div className="bg-69 d-flex full-width justify-content-between p-1 ps-2" title={dataItem.Title ? dataItem.Title : null}>
                                                                                {dataItem.Title ? dataItem.Title : null}
                                                                                <a className=""
                                                                                    onClick={() => removeSelectedClientCategory("Education")}
                                                                                >
                                                                                    <span className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                                </a>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <>
                                                                                <input type="text"
                                                                                    value={SearchedKeyForEducation}
                                                                                    onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Education", 344)}
                                                                                    style={siteData.BtnStatus ? {} : { cursor: "not-allowed"}}
                                                                                    className={siteData.BtnStatus ? "border-secondary border-end-0 form-control" : "border-secondary form-control"}
                                                                                    placeholder="Search Client Category Here!"
                                                                                    readOnly={siteData.BtnStatus ? false : true}
                                                                                />
                                                                                {
                                                                                    siteData.BtnStatus ?
                                                                                        <a className="bg-white border border-secondary"
                                                                                            onClick={() => openClientCategoryModel(344, "Education")}
                                                                                        >
                                                                                            <span title="Edit Client Category" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                                        </a>
                                                                                        : null
                                                                                }
                                                                            </>
                                                                        )
                                                                    }
                                                                })}
                                                                </> :
                                                                <>
                                                                    <input type="text"
                                                                        value={SearchedKeyForEducation}
                                                                        onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Education", 344)}
                                                                        style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                        className={siteData.BtnStatus ? "border-secondary border-end-0 form-control" : "border-secondary form-control"}
                                                                        placeholder="Search Client Category Here!"
                                                                        readOnly={siteData.BtnStatus ? false : true}
                                                                    />
                                                                    {
                                                                        siteData.BtnStatus ?
                                                                            <a className="bg-white border border-secondary"
                                                                                onClick={() => openClientCategoryModel(344, "Education")}
                                                                            >
                                                                                <span title="Edit Client Category" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                            </a>
                                                                            : null
                                                                    }
                                                                </>
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
                                                                            <div className="bg-69 d-flex full-width justify-content-between p-1 ps-2" title={dataItem.Title ? dataItem.Title : null}>
                                                                                {dataItem.Title ? dataItem.Title : null}
                                                                                <a className=""
                                                                                    onClick={() => removeSelectedClientCategory("Migration")}
                                                                                >

                                                                                    <span className="bg-light svg__icon--cross svg__iconbox"></span>
                                                                                </a>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    value={SearchedKeyForMigration}
                                                                                    onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Migration", 569)}
                                                                                    style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                                    className={siteData.BtnStatus ? "border-secondary border-end-0 form-control" : "border-secondary form-control"}
                                                                                    placeholder="Search Client Category Here!"
                                                                                    readOnly={siteData.BtnStatus ? false : true}
                                                                                />
                                                                                {
                                                                                    siteData.BtnStatus ?
                                                                                        <a className="bg-white border border-secondary"
                                                                                            onClick={() => openClientCategoryModel(569, 'Migration')}
                                                                                        >
                                                                                            <span title="Edit Client Category" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                                        </a>
                                                                                        : null
                                                                                }
                                                                            </>
                                                                        )
                                                                    }
                                                                })}
                                                                </> :
                                                                <>
                                                                    <input type="text" value={SearchedKeyForMigration}
                                                                        onChange={(e) => autoSuggestionsForClientCategoryIdividual(e, "Migration", 569)}
                                                                        style={siteData.BtnStatus ? {} : { cursor: "not-allowed" }}
                                                                        className={siteData.BtnStatus ? "border-secondary border-end-0 form-control" : "border-secondary form-control"}
                                                                        placeholder="Search Client Category Here!" readOnly={siteData.BtnStatus ? false : true}
                                                                    />
                                                                    {
                                                                        siteData.BtnStatus ?
                                                                            <a className="bg-white border border-secondary"
                                                                                onClick={() => openClientCategoryModel(569, 'Migration')}
                                                                            >
                                                                                <span title="Edit Client Category" className="svg__iconbox svg__icon--editBox hreflink"></span>
                                                                            </a>
                                                                            : null
                                                                    }
                                                                </>
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
                <footer className="bg-e9 d-flex justify-content-end p-1">
                    <div className="bg-body col-sm-2 p-1">
                        <div className="">{isPortfolioComposition == true || ProportionalStatus == false ? `${TotalPercent} %` : "100%"}</div>
                    </div>
                    <button className="btn ms-1 btn-primary px-4" onClick={UpdateSiteTaggingAndClientCategory}>Save</button>
                </footer>
            </div>
            {/* ********************* this Client Category Popup panel ****************** */}
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
                                    <button type="button" className="btn btn-primary" onClick={() => saveSelectedClientCategoryData("Popup")}>
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
                                                    <span className="bg-light svg__icon--cross svg__iconbox"></span>
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
                                                    <span className="bg-light svg__icon--cross svg__iconbox"></span>
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
                                                    <span className="bg-light svg__icon--cross svg__iconbox"></span>
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
                                                    <span className="bg-light svg__icon--cross svg__iconbox"></span>

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
            {/* ********************* this Main Component Children Popup panel ****************** */}
            {ComponentChildrenData != undefined && ComponentChildrenData.length > 0 ?
                <Panel
                    onRenderHeader={onRenderComponentChildrenHeader}
                    isOpen={ComponentChildrenPopupStatus}
                    onDismiss={closeComponentChildrenPopup}
                    isBlocking={ComponentChildrenPopupStatus}
                    type={PanelType.custom}
                    customWidth="850px"
                    onRenderFooter={onRenderFooterComponentChildren}
                >
                    <div className={ServicesTaskCheck ? "serviepannelgreena SelectProjectTable " : 'SelectProjectTable '}>
                        <div className="modal-body wrapper p-0 mt-2">
                            <div className="wrapper">
                                <GlobalCommanTable columns={columns} data={ComponentChildrenData} usedFor={"SiteComposition"} callBackData={callBackData} />
                            </div>
                        </div>

                    </div>
                </Panel>
                : null
            }
           
            {isCalloutVisible ? (
                <FocusTrapCallout
                    role="alertdialog"
                    className={styles.callout}
                    gapSpace={0}
                    target={`#${buttonId}-${currentDataIndex}`}
                    onDismiss={toggleIsCalloutVisible}
                    setInitialFocus
                >
                    <Text block variant="xLarge" className={styles.title}>
                        <div className="d-flex justify-content-between">
                            <div>Edit Date</div>
                            <div onClick={toggleIsCalloutVisible}>
                                <span className="svg__icon--cross svg__iconbox"></span>
                            </div>
                        </div>
                    </Text>
                    <Text block variant="small">
                        <div className="full-width d-flex">
                            {SiteTypes?.length > 0 ? SiteTypes?.map((DataItem: any, DataIndex: any) => {
                                if (DataIndex == currentDataIndex) {
                                    return (
                                        <>
                                            <div className="me-2">
                                                <label className="form-label full-width">Start Date</label>
                                                <input type="date" className="border-secondary form-control p-1"
                                                    defaultValue={DataItem.Date != undefined ? DataItem.Date.split('/').reverse().join('-') : ""}
                                                    onChange={(e) => ChangeDateManuallyFunction(e, DataItem.Title, "ChangeDate", "StartDate")}
                                                />
                                            </div>
                                            <div>
                                                <label className="form-label full-width">End Date</label>
                                                <input type="date" className="border-secondary form-control p-1"
                                                    defaultValue={DataItem.EndDate != undefined ? DataItem.EndDate.split('/').reverse().join('-') : ""}
                                                    onChange={(e) => ChangeDateManuallyFunction(e, DataItem.Title, "ChangeDate", "EndDate")}
                                                />
                                            </div>
                                        </>
                                    )
                                }
                            }) : null}

                        </div>

                    </Text>
                    {/* <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                        <Stack className={styles.buttons} gap={8} horizontal>
                            <PrimaryButton onClick={toggleIsCalloutVisible}>Save</PrimaryButton>
                            <DefaultButton onClick={toggleIsCalloutVisible}>Cancel</DefaultButton>
                        </Stack>
                    </FocusZone> */}
                </FocusTrapCallout>
            ) : null
            }
        </div >
    )
}
export default SiteCompositionComponent;