import * as React from "react";
import { useState, useEffect } from 'react';
import Tooltip from '../Tooltip';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import * as $ from "jquery";
import * as Moment from 'moment';
import * as globalCommon from "../globalCommon";
import GlobalCommonTable from "../GroupByReactTableComponents/GlobalCommanTable";
import { ColumnDef } from "@tanstack/react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import HighlightableCell from "../GroupByReactTableComponents/highlight";
import ShowClintCategory from "../ShowClintCatogory";
import ReactPopperTooltip from "../Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import { FaCompressArrowsAlt } from "react-icons/fa";
import InfoIconsToolTip from "../InfoIconsToolTip/InfoIconsToolTip";
import ClientCategoryPopup from "./SCClientCategoryPopup";
import SmartTotalTime from '../EditTaskPopup/SmartTimeTotal';
import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import ShowSiteComposition from "./ShowSiteComposition";
import VersionHistory from "../VersionHistroy/VersionHistory";
import PageLoader from "../pageLoader";
import moment from "moment";

let AllSiteDataBackup: any = [];
let AllClientCategoryDataBackup: any = [];
let ComponentChildData: any = [];
let GlobalAllSiteData: any = [];
let GlobalAllMasterListData: any = [];
let SelectedChildItems: any = [];
let GlobalCount: any = 0;
let GlobalAllTaskUsersData: any = [];
let FlatViewTableData: any = [];
let BackupFlatViewTableData: any = [];
let GroupByTableData: any = [];
let BackupGroupByTableData: any = [];

let taskTypeData: any = [];
let PortfolioItemColor: any = "";

const CentralizedSiteComposition = (Props: any) => {
    const PropsData: any = Props;
    const usedFor: string = PropsData?.usedFor;
    const ItemDetails: any = PropsData?.ItemDetails;
    const SelectedItemName: any = ItemDetails?.Title;
    const SiteType: string = ItemDetails.siteType;
    const RequiredListIds: any = PropsData.RequiredListIds;
    const siteUrl: string = ItemDetails?.siteUrl;
    const closePopupCallBack: any = PropsData?.closePopupCallBack;
    let AllClientCategoryBucket: any = [];

    let TotalPercent: any = 0;
    let CCTableCount: any = 0;
    let web = new Web(siteUrl);
    const [IsModelOpen, setIsModelOpen] = useState(true);
    const [IsMakeSCProtected, setIsMakeSCProtected] = useState(false);
    const [flatView, setFlatView] = React.useState(false);
    let [AllSiteData, setAllSiteData] = useState<any>([]);
    const [AllClientCategories, setAllClientCategories] = useState<any>([]);
    const [TaggedSiteCompositionCount, setTaggedSiteCompositionCount] = useState<any>(0);
    const [SelectedItemDetailsFormCall, setSelectedItemDetailsFormCall] = useState<any>({});
    const [IsSCProtected, setIsSCProtected] = useState(false);
    const [IsSCProportional, setIsSCProportional] = useState(false);
    const [IsSCManual, setIsSCManual] = useState(false);
    const [SiteCompositionSettings, setSiteCompositionSettings] = useState<any>([]);
    const [TaskTotalTime, setTaskTotalTime] = useState(Props.SmartTotalTimeData);
    const [SummarizationTool, setSummarizationTool] = useState(true);
    const [SiteCompositionTool, setSiteCompositionTool] = useState(true);


    // This is used for CLient Category Related States 
    const [SelectedSiteName, setSelectedSiteName] = useState<any>("");
    const [IsClientCategoryPopupOpen, setIsClientCategoryPopupOpen] = useState(false);
    const [SelectedClientCategory, setSelectedClientCategory] = useState([]);
    const [SearchedClientCategoryData, setSearchedClientCategoryData] = useState([]);
    const [searchedKey, setSearchedKey] = useState('');


    // These are used for Global Common Table Component 
    const [data, setData] = React.useState([])
    const [loaded, setLoaded] = React.useState(false);
    const [AllTaskUserData, setAllTaskUserData] = useState(false);
    const [IsShowTableContent, setIsShowTableContent] = useState(true);
    const childRef = React.useRef<any>();

    let [SiteSettingJSON, setSiteSettingJSON] = useState([
        { Name: "Manual", IsSelected: true, Type: "radio", Descriptions: "Manual Site Composition Allocation : Users have the ability to input their preferred allocation on chosen sites manually.", BtnName: "SiteSettingRadio" },
        { Name: "Proportional", IsSelected: false, Type: "radio", Descriptions: "Proportional Site Composition Allocation: The distribution will be evenly divided, summing up to 100%, across the chosen sites.", BtnName: "SiteSettingRadio" },
        { Name: "Deluxe", IsSelected: false, Type: "radio", Descriptions: "Site composition based on configuration: Predefined in the cockpit, these compositions are dynamic. Any additions or updates to existing ones will automatically update all components wherever this site composition is applied. Deluxe Site composition: EI: 50%, EPS : 50%", BtnName: "SiteSettingRadio" },
        { Name: "Standard", IsSelected: false, Type: "radio", Descriptions: "Site composition based on configuration: Predefined in the cockpit, these compositions are dynamic. Any additions or updates to existing ones will automatically update all components wherever this site composition is applied. Standard Site Composition: EI: 60%, EPS: 30%, Education: 5%, Migration: 5%", BtnName: "SiteSettingRadio" }
    ])

    const StandardSiteCompositionJSON: any =
        [
            {
                ClienTimeDescription: "60",
                Title: "EI",
                localSiteComposition: true,
                SiteImages: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png",
                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
            },
            {
                ClienTimeDescription: "30",
                Title: "EPS",
                localSiteComposition: true,
                SiteImages: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png",
                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
            },
            {
                ClienTimeDescription: "5",
                Title: "Migration",
                localSiteComposition: true,
                SiteImages: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png",
                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
            },
            {
                ClienTimeDescription: "5",
                Title: "Education",
                localSiteComposition: true,
                SiteImages: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_education.png",
                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
            }
        ]
    const DeluxeSiteCompositionJSON: any = [
        {
            ClienTimeDescription: "50",
            Title: "EI",
            localSiteComposition: true,
            SiteImages: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png",
            Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
        },
        {
            ClienTimeDescription: "50",
            Title: "EPS",
            localSiteComposition: true,
            SiteImages: "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png",
            Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
        },
    ]

    useEffect(() => {
        setIsModelOpen(true);
        getSmartMetaDataListAllItems();
        getTaskType();
        loadAllTaskUsers();
        if (PropsData?.ColorCode != undefined) {
            PortfolioItemColor = PropsData?.ColorCode;
            let targetDiv: any =
                document?.querySelector(".ms-Panel-main");
            setTimeout(() => {
                if (targetDiv) {
                    $(".ms-Panel-main").css(
                        "--SiteBlue",
                        PropsData?.ColorCode
                    );
                }
            }, 1000);
        }

    }, [])

    useEffect(() => {
        setTimeout(() => {
            const panelMain: any = document.querySelector(".ms-Panel-main");
            if (panelMain && PortfolioItemColor != "") {
                $(".ms-Panel-main").css("--SiteBlue", PortfolioItemColor); // Set the desired color value here
            }
        }, 1000);
    }, [IsClientCategoryPopupOpen])

    const getTaskType = async () => {
        let taskTypeData1: any = [];
        let typeData: any = [];
        taskTypeData1 = await web.lists
            .getById(RequiredListIds?.TaskTypeID)
            .items.select(
                'Id',
                'Level',
                'Title',
                'SortOrder',
            )
            .get();
        taskTypeData = taskTypeData.concat(taskTypeData1)
    };

    const getSmartMetaDataListAllItems = async () => {
        let AllSmartDataListData: any = [];
        let TempAllSiteData: any = [];
        let TempAllClientCategories: any = [];
        try {
            AllSmartDataListData = await web.lists
                .getById(RequiredListIds?.SmartMetadataListID)
                .items.select(
                    "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,Color_x0020_Tag,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail,Parent/Id,Parent/Title"
                )
                .expand("Author,Editor,IsSendAttentionEmail,Parent")
                .getAll();
            if (AllSmartDataListData?.length > 0) {
                TempAllSiteData = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Sites");
                TempAllClientCategories = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Client Category");
                let TempArray: any = [];
                TempAllClientCategories?.map((AllCCItem: any) => {
                    if (AllCCItem.TaxType == "Client Category") {
                        if (AllCCItem.Title == "e+i") {
                            AllCCItem.Title = "EI"
                        }
                        if (AllCCItem.Title == "PSE") {
                            AllCCItem.Title = "EPS"
                        }
                        TempArray.push(AllCCItem);
                    }
                })
                if (TempArray?.length > 0) {
                    // buildClientCategoryAllDataArray(TempArray);
                }
                if (TempAllClientCategories?.length > 0) {
                    setAllClientCategories(TempAllClientCategories);
                    AllClientCategoryDataBackup = TempAllClientCategories;
                }
                if (TempAllSiteData?.length > 0) {
                    setAllSiteData(TempAllSiteData);
                    AllSiteDataBackup = TempAllSiteData;
                    if (ItemDetails?.SiteIcon == undefined || ItemDetails?.SiteIcon == null) {
                        TempAllSiteData?.map((AllSiteData: any) => {
                            if (AllSiteData.Title == ItemDetails.SiteType) {
                                if (AllSiteData?.Item_x005F_x0020_Cover?.Url?.length > 0) {
                                    ItemDetails.SiteIcon = AllSiteData?.Item_x005F_x0020_Cover?.Url;
                                } else {
                                    ItemDetails.SiteIcon = "https://hhhhteams.sharepoint.com/_layouts/15/images/ittask.png?rev=47";
                                }
                            }
                        })
                    }

                }
                GetSelectedItemDetails();
            }
            console.log("Get Smart Meta Data Call");
        } catch (error) {
            console.log("Error :", error.message);
        }
    }

    const buildClientCategoryAllDataArray = (dataItem: any) => {
        const finalArray: any = buildClientCategoryAllDataArrayRecursive(dataItem);
        let FinalArrayForAutoSuggestions: any = [];
        if (finalArray?.length > 0) {
            let TempCCItems: any = [];
            finalArray?.map((CCItems: any) => {
                if (CCItems.Title == SelectedSiteName) {
                    if (CCItems.Child?.length > 0) {
                        TempCCItems = CCItems.Child;
                    }
                }
            })
            if (TempCCItems?.length > 0) {
                // setSelectedSiteClientCategoryData(TempCCItems);
                FinalArrayForAutoSuggestions = buildDataStructureForAutoSuggestions(TempCCItems);
            }
        }
        console.log("Get buildClientCategoryAllDataArray Call");
        // AllClientCategoriesForAutoSuggestion = FinalArrayForAutoSuggestions;
        return FinalArrayForAutoSuggestions;
    };

    const buildClientCategoryAllDataArrayRecursive = (dataItem: any, parentId: number = 0) => {
        const result: any = [];
        console.log("Get buildClientCategoryAllDataArrayRecursive Call");

        dataItem.forEach((item: any) => {
            if (item.ParentID === parentId) {
                const newItem = { ...item, Child: [] };
                newItem.siteName = item.siteName;
                newItem.Child = buildClientCategoryAllDataArrayRecursive(dataItem, item.Id);
                result.push(newItem);
            }
        });
        return result;

    };

    const buildDataStructureForAutoSuggestions = (dataItem: any) => {
        console.log("Get buildDataStructureForAutoSuggestions Call");

        const finalData: any = [];
        const processItemRecursively = (item: any, prefix: any) => {
            item.newLabel = prefix + ">" + item.Title;
            finalData.push(item);
            if (item.Child && item.Child.length > 0) {
                item.Child.forEach((child: any) => {
                    processItemRecursively(child, item.newLabel);
                });
            }
        };
        (dataItem || []).forEach((ccItemData: any) => {
            processItemRecursively(ccItemData, SelectedSiteName);
        });
        return finalData;
    };

    // This is used for getting selected Item Details form Backend 

    const GetSelectedItemDetails = async () => {
        let SelectedItemDetails: any = {};
        let SiteCompositionTemp: any = [];
        let SiteSettingTemp: any = [];
        let ClientCategoryTemp: any = [];
        try {
            if (usedFor == "CSF") {
                SelectedItemDetails = await web.lists
                    .getById(ItemDetails?.listId)
                    .items.getById(ItemDetails?.Id).select(
                        "SiteCompositionSettings,Sitestagging,ClientCategory/Id,ClientCategory/Title,Item_x0020_Type,PortfolioType/Color"
                    )
                    .expand("ClientCategory,PortfolioType").get();
            }
            if (usedFor == "AWT") {
                SelectedItemDetails = await web.lists
                    .getById(ItemDetails?.listId)
                    .items.getById(ItemDetails?.Id).select(
                        "SiteCompositionSettings,Sitestagging,ClientCategory/Id,ClientCategory/Title,TaskType/Id,TaskType/Title,Portfolio/Id,Portfolio/Title"
                    )
                    .expand("ClientCategory,TaskType,Portfolio").get();
            }
            if (SelectedItemDetails.SiteCompositionSettings?.length > 0) {
                SiteSettingTemp = JSON.parse(SelectedItemDetails.SiteCompositionSettings);
                let SelectedSiteSetting: any = siteCompositionType(SelectedItemDetails.SiteCompositionSettings);
                let TempData: any = [];
                SiteSettingJSON?.map((SSItemData: any) => {
                    if (SSItemData.Name == SelectedSiteSetting) {
                        SSItemData.IsSelected = true;
                    }
                    TempData.push(SSItemData);
                })
                setSiteSettingJSON([...TempData])
                if (SiteSettingTemp[0].Proportional == true) {
                    setIsSCProportional(true);
                } else {
                    setIsSCProportional(false);
                }
                if (SiteSettingTemp[0].Manual == true) {
                    setIsSCManual(true);
                } else {
                    setIsSCManual(false);
                }
                if (SiteSettingTemp[0].Deluxe == true || SiteSettingTemp[0].Standard == true) {
                    setIsSCProtected(true);
                } else {
                    setIsSCProtected(false);
                }
                if (SiteSettingTemp[0].Protected == true) {
                    setIsMakeSCProtected(true);
                } else {
                    setIsMakeSCProtected(false);
                }
                setSiteCompositionSettings([...SiteSettingTemp]);
                SelectedItemDetails.SiteSettingBackup = SiteSettingTemp;
            } else {
                let tempSiteSetting: any = [{ Proportional: false, Manual: true, Protected: false, Deluxe: false, Standard: false }]
                setSiteCompositionSettings(tempSiteSetting);
                setIsSCManual(true);
                setSiteSettingJSON([...SiteSettingJSON])
            }
            if (SelectedItemDetails.PortfolioType?.Color) {
                PortfolioItemColor = SelectedItemDetails?.PortfolioType?.Color;
                let targetDiv: any =
                    document?.querySelector(".ms-Panel-main");
                setTimeout(() => {
                    if (targetDiv) {
                        $(".ms-Panel-main").css(
                            "--SiteBlue",
                            SelectedItemDetails?.PortfolioType?.Color
                        );
                    }
                }, 1000);
            }

            if (SelectedItemDetails.ClientCategory?.length > 0) {
                let TempCCItems: any = [];
                AllClientCategoryDataBackup?.map((AllCCItem: any) => {
                    SelectedItemDetails.ClientCategory?.map((SelectedCCItem: any) => {
                        if (SelectedCCItem?.Id == AllCCItem?.Id) {
                            TempCCItems.push(AllCCItem);
                            AllCCItem.checked = true;
                            AllClientCategoryBucket.push(AllCCItem);
                        }
                    })
                })
                ClientCategoryTemp = TempCCItems;
            }

            if (SelectedItemDetails.Sitestagging?.length > 0) {
                SiteCompositionTemp = JSON.parse(SelectedItemDetails.Sitestagging);
                // setSiteCompositionJSON(SiteCompositionTemp);
                SelectedItemDetails.SiteCompositionJSONBackup = SiteCompositionTemp;
                SiteCompositionTemp = SiteCompositionTemp;
                setTaggedSiteCompositionCount(SiteCompositionTemp?.length)
                GlobalCount = SiteCompositionTemp?.length
            } else {
                let SCDummyJSON: any = {
                    ClienTimeDescription: "100",
                    Title: ItemDetails?.siteType,
                    localSiteComposition: true,
                    SiteImages: ItemDetails?.SiteIcon,
                    Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
                }
                SiteCompositionTemp = [SCDummyJSON];
                setTaggedSiteCompositionCount(1);
                GlobalCount = 1;
            }

            let TempArraySC: any = [];
            SiteCompositionTemp?.map((SCItemsData: any) => {
                ClientCategoryTemp?.map((TaggedCCData: any) => {
                    if (SCItemsData.Title == TaggedCCData.siteName) {
                        SCItemsData.TaggedCCTitle = TaggedCCData.Title;
                        TempArraySC.push(SCItemsData);
                    }
                })
            })



            if (SiteCompositionTemp?.length > 0) {
                AllSiteDataBackup?.map((SiteData: any) => {
                    SiteCompositionTemp?.map((SelectedSC: any) => {
                        if (SiteData?.siteName !== null && SiteData?.siteName == SelectedSC?.Title) {
                            SiteData.BtnStatus = true;
                            SiteData.ClienTimeDescription = SelectedSC.ClienTimeDescription;
                            SiteData.Date = SelectedSC.Date;
                            SiteData.TaggedCCTitle = SelectedSC.TaggedCCTitle;

                        }
                    })
                })
                setAllSiteData([...AllSiteDataBackup])
            }
            SelectedItemDetails.Id = ItemDetails?.Id;
            SelectedItemDetails.listId = ItemDetails?.listId;
            SelectedItemDetails.siteType = ItemDetails?.siteType;
            SelectedItemDetails.SiteIcon = ItemDetails?.SiteIcon;
            if (usedFor == "CSF") {
                loadAllSitesData("All-Sites");
                if (SelectedItemDetails?.Item_x0020_Type !== "Feature") {
                    loadAllMasterListData();
                }
            }
            if (SelectedItemDetails?.TaskType?.Title !== "Task" && usedFor == "AWT") {
                loadAllSitesData("Individual-Site");
            } else {
                if (SelectedItemDetails?.TaskType?.Title == "Task") {
                    setLoaded(true);
                    setIsShowTableContent(false);
                    FilterAllClientCategories();
                }
            }
            setSelectedItemDetailsFormCall(SelectedItemDetails);

        } catch (error) {
            console.log("Error :", error.message);
        }
    }

    const loadAllMasterListData = async () => {
        let PropsObject: any = {
            MasterTaskListID: RequiredListIds?.MasterTaskListID,
            siteUrl: RequiredListIds?.siteUrl,
            TaskUserListId: RequiredListIds?.TaskUsertListID,
            usedFor: "Site-Composition"
        }
        let componentDetails: any = [];
        let groupedComponentData: any = [];
        setLoaded(false);
        let results = await globalCommon.GetServiceAndComponentAllData(PropsObject)
        if (results?.AllData?.length > 0) {
            componentDetails = results?.AllData;
            GlobalAllMasterListData = results?.AllData;
            groupedComponentData = results?.GroupByData;
            ComponentChildData = findSelectedComponentChildInMasterList(groupedComponentData, ItemDetails?.Id)
            // setLoaded(true);
        }
        console.log("Get loadAllMasterListData Call");
    }


    const loadAllSitesData = async (usedForLoad: any) => {
        setLoaded(false);
        if (usedForLoad == "Individual-Site") {
            GlobalAllSiteData = await GetIndividualSiteAllData();
        }
        if (usedForLoad == "All-Sites") {
            GlobalAllSiteData = await globalCommon?.loadAllSiteTasks(RequiredListIds, undefined);
        }
        let AllTaggedComponent: any = [];
        ComponentChildData?.map((TaggedCSF: any) => {
            AllTaggedComponent.push(TaggedCSF);
            if (TaggedCSF.subRows?.length > 0) {
                TaggedCSF.subRows?.map((ChildArray: any) => {
                    AllTaggedComponent.push(ChildArray);
                })
            }
        })
        let FlatViewData: any = AllTaggedComponent.concat(GlobalAllSiteData);
        let FlatViewDataParsedData: any[] = [];
        if (FlatViewData?.length > 0) {
            FlatViewDataParsedData = JSON.parse(JSON.stringify(FlatViewData))
        }
        FlatViewTableData = FlatViewDataParsedData;
        if (usedFor == "CSF") {
            componentGrouping();
        }
        if (usedFor == "AWT") {
            let AllGroupingData: any = await AWTGrouping(ItemDetails, "AWT");
            if (AllGroupingData?.length > 0) {
                let DeepCopyData: any = JSON.parse(JSON.stringify(AllGroupingData));
                GroupByTableData = AllGroupingData;
                BackupGroupByTableData = DeepCopyData;
                setData(AllGroupingData);
            }
            FilterAllClientCategories();
            setLoaded(true);
        }
    }

    function siteCompositionType(jsonStr: any) {
        var data = JSON.parse(jsonStr);
        try {
            data = data[0];
            for (var key in data) {
                if (data?.hasOwnProperty(key) && data[key] === true) {
                    return key;
                }
            }
            return '';
        } catch (error) {
            console.log(error)
            return '';
        }
    }

    const GetIndividualSiteAllData = async () => {
        let query: any = "Id,Title,FeedBack,PriorityRank,Remark,Project/PriorityRank,ParentTask/Id,ParentTask/Title,ParentTask/TaskID,TaskID,SmartInformation/Id,SmartInformation/Title,Project/Id,Project/Title,Project/PortfolioStructureID,workingThisWeek,SiteCompositionSettings,Sitestagging,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title&$expand=AssignedTo,Project,ParentTask,SmartInformation,Author,Portfolio,TaskType,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory"
        try {
            const data = await web.lists.getById(ItemDetails?.listId).items.select(query).getAll();
            data?.map((task: any) => {
                task.siteType = ItemDetails?.siteType;
                task.listId = ItemDetails?.listId;
                task.siteUrl = ItemDetails?.siteUrl;
                task.SiteIcon = ItemDetails?.SiteIcon;
                if (task?.Portfolio?.Id != undefined) {
                    task.portfolio = task?.Portfolio;
                    task.PortfolioTitle = task?.Portfolio?.Title;
                }
                if (task.PercentComplete != undefined) {
                    task.PercentComplete = (task.PercentComplete * 100).toFixed(0);
                }
                let checkIsSCProtected: any = false;
                task.TaskID = globalCommon.GetTaskId(task);
                if (task.Project) {
                    task.ProjectTitle = task?.Project?.Title;
                    task.ProjectId = task?.Project?.Id;
                    task.projectStructerId =
                        task?.Project?.PortfolioStructureID;
                    const title = task?.Project?.Title || "";
                    const dueDate = task?.DueDate;
                    task.joinedData = [];
                    if (title) task.joinedData.push(`Title: ${title}`);
                    if (dueDate) task.joinedData.push(`Due Date: ${dueDate}`);
                }
                task.DisplayCreateDate = moment(task.Created).format("DD/MM/YYYY");
                task.descriptionsSearch = globalCommon.descriptionSearchData(task);
                if (task?.SiteCompositionSettings != undefined) {
                    let TempSCSettingsData: any = JSON.parse(task?.SiteCompositionSettings);
                    if (TempSCSettingsData?.length > 0) {
                        checkIsSCProtected = TempSCSettingsData[0].Protected;
                    }
                    task.compositionType = siteCompositionType(task?.SiteCompositionSettings);
                } else {
                    task.compositionType = '';
                }
                if (checkIsSCProtected) {
                    task.IsSCProtected = true;
                    task.IsSCProtectedStatus = "Protected";
                } else {
                    task.IsSCProtected = false;
                    task.IsSCProtectedStatus = "";
                }
            })
            return data;
        } catch (error) {
            console.log("Get Idividual Site All Data Function", error.message);
        }
    }

    const componentGrouping = () => {
        console.log("this is the componentGrouping function")
        let FinalComponent: any = []
        let AllProtFolioData = FlatViewTableData?.filter(
            (comp: any) =>
                comp?.Parent?.Id === ItemDetails?.Id && comp.TaskType === undefined
        );
        AllProtFolioData?.map((masterTask: any) => {
            masterTask.subRows = [];
            if (masterTask?.ClientCategory?.length > 0) {
                AllClientCategoryBucket = AllClientCategoryBucket.concat(masterTask?.ClientCategory);
            }
            componentActivity(masterTask);
            let subComFeat = AllProtFolioData?.filter((comp: any) => comp?.Parent?.Id === masterTask?.Id)
            masterTask.subRows = masterTask?.subRows?.concat(subComFeat);
            subComFeat?.forEach((subComp: any) => {
                subComp.subRows = [];
                if (subComp?.ClientCategory?.length > 0) {
                    AllClientCategoryBucket = AllClientCategoryBucket.concat(subComp?.ClientCategory);
                }
                componentActivity(subComp);
                let allFeatureData = AllProtFolioData?.filter((elem: any) => elem?.Parent?.Id === subComp?.Id);
                subComp.subRows = subComp?.subRows?.concat(allFeatureData);
                allFeatureData?.forEach((subFeat: any) => {
                    if (subFeat?.ClientCategory?.length > 0) {
                        AllClientCategoryBucket = AllClientCategoryBucket.concat(subFeat?.ClientCategory);
                    }
                    subFeat.subRows = [];
                    componentActivity(subFeat);
                })
            })
            FinalComponent.push(masterTask);
        })
        let FinalGroupingData: any = [];
        let directChildAW = FlatViewTableData?.filter((elem: any) => elem.Portfolio?.Id === ItemDetails?.Id);
        let directChildT = FlatViewTableData?.filter((elem: any) => elem.Portfolio?.Id === ItemDetails?.Id && elem?.TaskType?.Title == "Task" && (elem?.ParentTask?.Title == undefined || elem?.ParentTask?.Title == null));
        if (directChildAW?.length > 0) {
            directChildAW?.map((OtherItem: any) => {
                OtherItem.subRows = []
                AWTGroupingForCSF(OtherItem, directChildAW);
            })
        }
        let FindAllDirectAWT: any = directChildAW?.filter((elem: any) => (elem?.ParentTask?.Title == undefined || elem?.ParentTask?.Title == null) && elem?.TaskType?.Title !== "Task")
        FinalGroupingData = FinalComponent?.concat(FindAllDirectAWT);
        let OtherTaskJSON: any = {
            Title: "Others",
            TaskID: "",
            subRows: [],
            PercentComplete: "",
            ItemRank: "",
            Project: "",
            ClientCategorySearch: "",
            Created: null,
            DisplayCreateDate: null,
            DisplayDueDate: null,
            AllTeamName: "",
            DueDate: "",
            descriptionsSearch: "",
            ProjectTitle: "",
            Status: "",
            Author: ""
        }
        if (directChildT?.length > 0) {
            OtherTaskJSON.subRows = directChildT;
        }
        if (OtherTaskJSON?.subRows?.length > 0) {
            FinalGroupingData.push(OtherTaskJSON);
        }
        setData(FinalGroupingData);
        GroupByTableData = FinalGroupingData;
        let DeepCopyData: any = JSON.parse(JSON.stringify(FinalGroupingData));
        BackupGroupByTableData = DeepCopyData;
        FilterAllClientCategories();
        setLoaded(true);
    }


    const FilterAllClientCategories = () => {
        let uniqueIds: any = {};
        let uniqueCCIds: any = {};
        let FinalAllTaggedCCData: any = [];
        const UniqueCCItems: any = AllClientCategoryBucket?.filter((obj: any) => {
            if (!uniqueIds[obj.Id]) {
                uniqueIds[obj.Id] = true;
                return true;
            }
            return false;
        });

        UniqueCCItems?.map((PrevSelectedCC: any) => {
            AllClientCategoryDataBackup?.map((AllCCItem: any) => {
                if (AllCCItem.Id == PrevSelectedCC.Id) {
                    FinalAllTaggedCCData.push(AllCCItem)
                }
            })
        })

        const UniqueCCItemsForCC: any = FinalAllTaggedCCData?.filter((obj: any) => {
            if (!uniqueCCIds[obj.Id]) {
                uniqueCCIds[obj.Id] = true;
                return true;
            }
            return false;
        });

        if (AllSiteDataBackup?.length > 0) {
            AllSiteDataBackup?.map((ItemData: any) => {
                ItemData.ClientCategories = UniqueCCItemsForCC?.filter((selectedCC: any) => selectedCC?.siteName == ItemData?.Title);
                if (ItemData.ClientCategories?.length > 0) {
                    // ItemData.ClientCategories[0].checked = true;
                }
            })
        }
        setAllSiteData([...AllSiteDataBackup])
        setLoaded(true);
    }

    const componentActivity = (items: any) => {
        console.log("Create Activity function call")
        let findActivity = FlatViewTableData?.filter((elem: any) => elem?.Portfolio?.Id === items?.Id);
        findActivity?.forEach((act: any) => {
            act.subRows = [];
            if (act?.ClientCategory?.length > 0) {
                AllClientCategoryBucket = AllClientCategoryBucket.concat(act?.ClientCategory);
            }
            let workStreamAndTask = FlatViewTableData?.filter((taskData: any) => taskData?.ParentTask?.Id === act?.Id && taskData?.siteType === act?.siteType)
            if (workStreamAndTask.length > 0) {
                act.subRows = act?.subRows?.concat(workStreamAndTask);
            }
            workStreamAndTask?.forEach((wrkst: any) => {
                if (wrkst?.ClientCategory?.length > 0) {
                    AllClientCategoryBucket = AllClientCategoryBucket.concat(wrkst?.ClientCategory);
                }
                wrkst.subRows = wrkst.subRows === undefined ? [] : wrkst.subRows;
                let allTasksData = FlatViewTableData?.filter((elem: any) => elem?.ParentTask?.Id === wrkst?.Id && elem?.siteType === wrkst?.siteType);
                if (allTasksData.length > 0) {
                    let TempAllCC = FlatViewTableData?.filter((elem: any) => { if (elem.ClientCategory?.length > 0) return elem.ClientCategory });
                    AllClientCategoryBucket = AllClientCategoryBucket.concat(TempAllCC);
                    wrkst.subRows = wrkst?.subRows?.concat(allTasksData);
                }
            })
        })
        items.subRows = items?.subRows?.concat(findActivity)
    }

    // This function is used for AWT Grouping for the CSF


    const AWTGroupingForCSF = (items: any, AllAWT: any) => {
        let findActivityCSF = AllAWT?.filter((elem: any) => elem?.ParentTask?.Id === items?.Id && elem?.TaskType?.Id == 3);
        let findDirectTaskAWT = AllAWT?.filter((elem: any) => elem?.ParentTask?.Id === items?.Id && elem?.TaskType?.Id == 2);
        findActivityCSF?.forEach((act: any) => {
            act.subRows = [];
            if (act?.ClientCategory?.length > 0) {
                AllClientCategoryBucket = AllClientCategoryBucket.concat(act?.ClientCategory);
            }
            let workStreamAndTask = AllAWT?.filter((taskData: any) => taskData?.ParentTask?.Id === act?.Id && taskData?.siteType === act?.siteType)
            if (workStreamAndTask.length > 0) {
                act.subRows = act?.subRows?.concat(workStreamAndTask);
                workStreamAndTask?.map((wst: any) => {
                    if (wst?.ClientCategory?.length > 0) {
                        AllClientCategoryBucket = AllClientCategoryBucket.concat(wst?.ClientCategory);
                    }
                })
            }
        })
        findDirectTaskAWT?.map((DT: any) => {
            if (DT?.ClientCategory?.length > 0) {
                AllClientCategoryBucket = AllClientCategoryBucket.concat(DT?.ClientCategory);
            }
        })
        items.subRows = items?.subRows?.concat(findActivityCSF);
        items.subRows = items?.subRows?.concat(findDirectTaskAWT);
        return items;
    }

    // This function is used for Direct AWT Grouping for the CSF

    const AWTGrouping = (items: any, FnUsedFor: any) => {
        console.log("this is the AWTGrouping function")
        let FinalAWTData: any = [];
        let findActivity: any = FlatViewTableData?.filter((elem: any) => elem?.ParentTask?.Id === items?.Id && elem?.TaskType?.Id == 3);
        let findDirectTask: any = FlatViewTableData?.filter((elem: any) => elem?.ParentTask?.Id === items?.Id && elem?.TaskType?.Id == 2);
        findActivity?.forEach((act: any) => {
            act.subRows = [];
            if (act?.ClientCategory?.length > 0) {
                AllClientCategoryBucket = AllClientCategoryBucket.concat(act?.ClientCategory);
            }
            let workStreamAndTask = FlatViewTableData?.filter((taskData: any) => taskData?.ParentTask?.Id === act?.Id && taskData?.siteType === act?.siteType)
            if (workStreamAndTask.length > 0) {
                act.subRows = act?.subRows?.concat(workStreamAndTask);
                workStreamAndTask?.map((wst: any) => {
                    if (wst?.ClientCategory?.length > 0) {
                        AllClientCategoryBucket = AllClientCategoryBucket.concat(wst?.ClientCategory);
                    }
                })
            }
        })
        findDirectTask?.map((DT: any) => {
            if (DT?.ClientCategory?.length > 0) {
                AllClientCategoryBucket = AllClientCategoryBucket.concat(DT?.ClientCategory);
            }
        })
        items.subRows = items?.subRows?.concat(findActivity);
        FinalAWTData = findActivity?.concat(findDirectTask);
        if (FnUsedFor == "AWT") {
            return FinalAWTData;
        }
    }

    const findSelectedComponentChildInMasterList = (groupByData: any, itemId: any) => {
        console.log("Get findSelectedComponentChildInMasterList Call");
        const findChild = (items: any) => {
            for (const item of items) {
                if (item.Id === itemId && item.subRows?.length > 0) {
                    componentChildData = item.subRows;
                } else if (item.subRows?.length > 0) {
                    findChild(item.subRows);
                }
            }
        };
        let componentChildData: any = [];
        findChild(groupByData);
        return componentChildData;
    };

    const loadAllTaskUsers = async () => {
        GlobalAllTaskUsersData = await globalCommon.loadAllTaskUsers(RequiredListIds);
    }

    // Common Function for filtering the Data According to Tax Type
    const getSmartMetadataItemsByTaxType = function (
        metadataItems: any,
        taxType: any
    ) {
        console.log("Get getSmartMetadataItemsByTaxType   Call");

        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType) Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    };




    // This is the custom header for main panel 

    const CustomHeader = () => {
        return (
            <div className="alignCenter full-width" >
                <div className="subheading siteColor">
                    <span>Update Site Composition -</span>
                    <span>
                        <ReactPopperTooltip
                            CMSToolId={ItemDetails?.TaskID}
                            row={ItemDetails}
                            singleLevel={true}
                            masterTaskData={GlobalAllMasterListData}
                            AllSitesTaskData={GlobalAllSiteData}
                            AllListId={RequiredListIds}
                        />
                    </span>
                    <span>- {SelectedItemName}</span>

                </div>
                <div className="alignCenter mb-3 me-1">
                    <div className="alignCenter">
                        <label className="switch me-2 siteColor" htmlFor="checkbox-Protected">
                            <input
                                checked={IsMakeSCProtected}
                                onChange={() => setIsMakeSCProtected(!IsMakeSCProtected)}
                                type="checkbox"
                                id="checkbox-Protected"
                                name="Protected-view"
                            />
                            {IsMakeSCProtected === true ? <div style={{ backgroundColor: `${PortfolioItemColor}`, borderColor: `${PortfolioItemColor}` }} className="slider round" title='Switch to Un-Protected View'></div> : <div title='Switch to Protected-View' className="slider round"></div>}
                        </label>
                        <span className='ms-1 siteColor'>Protected</span>
                        <span className="hover-text alignIcon">
                            <span className="svg__iconbox svg__icon--info dark"></span>
                            <span className="tooltip-text pop-left">
                                <span>This button enables you to toggle between Protected and Unprotected modes for validation.</span>
                                <p className="mb-1"><b>Validation Cases:</b> </p>
                                <b>1. </b>When the toggle is enabled, it protected both the parent item and extends protection to the selected items (CSF/AWT) from the Tagged Child Item Table.<br />
                                <b>2. </b>When the toggle is disabled, it unprotected the parent item only.
                            </span>
                        </span>
                    </div>
                    <Tooltip ComponentId="1268" isServiceTask={false} />
                </div>
            </div>
        )
    }

    // This is the custom footer for main panel 

    const CustomFooter = () => {
        return (
            <footer className="bg-f4 alignCenter fixed-bottom justify-content-between p-3">
                <div>
                    {ItemDetails?.Id != undefined ?
                        <VersionHistory
                            usedFor="Site-Composition"
                            taskId={ItemDetails?.Id}
                            listId={ItemDetails?.listId}
                            RequiredListIds={RequiredListIds}
                            siteUrls={siteUrl}
                        />
                        : ""}
                </div>
                <div>
                    <a className="me-2 siteColor" target="_blank" data-interception="off"
                        href={usedFor == "CSF" ? `${siteUrl}/Lists/Master%20Tasks/EditForm.aspx?ID=${ItemDetails?.Id}&?#Sitestagging` : `${siteUrl}/Lists/${ItemDetails?.siteType}/EditForm.aspx?ID=${ItemDetails?.Id}&?#Sitestagging`}
                    >
                        Open-Out-Of-The-Box
                    </a>
                    <button className="btn ms-1 btn-primary px-4"
                        onClick={PrepareTheDataForUpdatingOnBackendSide}
                    >
                        Save
                    </button>
                    <button className="btn btn-default ms-1 px-3" onClick={() => ClosePanelFunction("Close")}>Cancel</button>
                </div>
            </footer>
        )
    }


    // this is used for un protect and  Protect the Items Into The table 
    const toggleProtectionRecursively = (item: any, selectedItem: any) => {
        if (item.Title === selectedItem.Title && item.Id === selectedItem.Id) {
            item.IsSCProtected = !item.IsSCProtected;
        }

        if (item.subRows && item.subRows.length > 0) {
            item.subRows.forEach((subItem: any) => {
                toggleProtectionRecursively(subItem, selectedItem);
            });
        }
    };

    const UnProtectSelectedItemRecursive = (SelectedItem: any) => {
        if (flatView) {
            let FlatViewDataItems = JSON.parse(JSON.stringify(data));
            FlatViewDataItems?.forEach((AllItem: any) => {
                toggleProtectionRecursively(AllItem, SelectedItem);
            });
            setData(FlatViewDataItems);
        } else {
            let GroupByViewDataItems = JSON.parse(JSON.stringify(data));
            GroupByViewDataItems?.forEach((AllItemData: any) => {
                toggleProtectionRecursively(AllItemData, SelectedItem);
            });
            setData(GroupByViewDataItems);
        }
    };


    // this is panel close function 

    const ClosePanelFunction = (usedFor: any) => {
        setIsModelOpen(false);
        closePopupCallBack(usedFor);
        FlatViewTableData = [];
        BackupFlatViewTableData = [];
        GroupByTableData = [];
        BackupGroupByTableData = [];
    }

    // For the user find the selected site setting

    const findUserByName = (name: any) => {
        const user = GlobalAllTaskUsersData?.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        let Image: any;
        if (user[0]?.Item_x0020_Cover != undefined) {
            Image = user[0].Item_x0020_Cover.Url;
        } else {
            Image =
                "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
        }
        return user ? Image : null;
    };
    /// Global Common Table Columns Defined here //////
    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                expendedTrue: true,
                size: 69,
                id: "Id"
            },
            {
                accessorFn: (row) => row?.portfolioItemsSearch,
                cell: ({ row, getValue }) => (
                    <div className="alignCenter">
                        {row?.original?.SiteIcon != undefined ? (
                            <div className="alignCenter" title="Show All Child">
                                <img title={row?.original?.TaskType?.Title} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 workmember ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 workmember ml20 me-1" :
                                    row?.original?.TaskType?.Title == "Workstream" ? "ml-48 workmember ml20 me-1" : row?.original?.TaskType?.Title == "Task" || row?.original?.Item_x0020_Type === "Task" && row?.original?.TaskType == undefined ? "ml-60 workmember ml20 me-1" : "workmember me-1"
                                }
                                    src={row?.original?.SiteIcon}>
                                </img>
                            </div>
                        ) : (
                            <>
                                {row?.original?.Title != "Others" ? (
                                    <div title={row?.original?.Item_x0020_Type} style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.TaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                                        row?.original?.TaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.TaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                                    }>
                                        {row?.original?.SiteIconTitle}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </>
                        )}
                    </div>
                ),
                id: "portfolioItemsSearch",
                placeholder: "Type",
                header: "",
                resetColumnFilters: false,
                size: 95,
            },
            {
                accessorFn: (row) => row?.TaskID,
                cell: ({ row, getValue }) => (
                    <div>
                        {/* <ReactPopperTooltip CMSToolId={getValue()} row={row} /> */}
                        <ReactPopperTooltip
                            CMSToolId={row?.original?.TaskID}
                            row={row?.original}
                            singleLevel={true}
                            masterTaskData={GlobalAllMasterListData}
                            AllSitesTaskData={GlobalAllSiteData}
                            AllListId={RequiredListIds}
                        />
                    </div>
                ),
                id: "TaskID",
                placeholder: "ID",
                header: "",
                resetColumnFilters: false,
                // isColumnDefultSortingAsc:true,
                size: 130
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, column, getValue }) => (
                    <div className="alignCenter">
                        <span className="columnFixedTitle">
                            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                    href={siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
                                    <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                                </a>
                            )}
                            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
                                <a className="text-content hreflink" title={row?.original?.Title} data-interception="off" target="_blank" style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}
                                    href={siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType} >
                                    <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : childRef?.current?.globalFilter} />
                                </a>
                            )}
                            {row?.original.Title === "Others" ? (
                                <span className="text-content" title={row?.original?.Title} style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }}>{row?.original?.Title}</span>
                            ) : (
                                ""
                            )}
                        </span>
                        {row?.original?.Categories == 'Draft' ?
                            <FaCompressArrowsAlt style={{ height: '11px', width: '20px', color: `${row?.original?.PortfolioType?.Color}` }} /> : ''}
                        {row?.original?.subRows?.length > 0 ?
                            <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
                        {row?.original?.descriptionsSearch != null && row?.original?.descriptionsSearch != '' && (
                            <InfoIconsToolTip Discription={row?.original?.descriptionsSearch} row={row?.original} />
                        )}
                    </div>
                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                header: "",
                size: 400,
            },
            {
                accessorFn: (row) => row?.projectStructerId + "." + row?.ProjectTitle,
                cell: ({ row }) => (
                    <>
                        {row?.original?.ProjectTitle != (null || undefined) ?
                            <span ><a style={row?.original?.fontColorTask != undefined ? { color: `${row?.original?.fontColorTask}` } : { color: `${row?.original?.PortfolioType?.Color}` }} data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={`${siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.ProjectId}`} >
                                <ReactPopperTooltip
                                    CMSToolId={row?.original?.projectStructerId}
                                    projectToolShow={true}
                                    row={row?.original}
                                    singleLevel={true}
                                    masterTaskData={GlobalAllMasterListData}
                                    AllSitesTaskData={GlobalAllSiteData}
                                    AllListId={RequiredListIds}
                                /></a></span>
                            : ""}
                    </>
                ),
                id: 'ProjectTitle',
                placeholder: "Project",
                resetColumnFilters: false,
                header: "",
                size: 70,
            },
            {
                accessorFn: (row) => row?.IsSCProtectedStatus,
                cell: ({ row, getValue }) => (
                    <div className="alignCenter" onClick={() => UnProtectSelectedItemRecursive(row.original)}>
                        <label className="switch me-2 siteColor" htmlFor="checkbox-Protected-Table">
                            <input
                                checked={row?.original?.IsSCProtected}
                                type="checkbox"
                                id="checkbox-Protected-Table"
                                name="Protected-view"
                            />
                            {row?.original?.IsSCProtected === true ? <div style={{ backgroundColor: `${PortfolioItemColor}`, borderColor: `${PortfolioItemColor}` }} className="slider round" title='Switch to Un-Protect this item'></div> : <div title='Switch to Protect this item' className="slider round"></div>}
                        </label>
                    </div>
                ),
                placeholder: "Protected",
                header: "",
                resetColumnFilters: false,
                size: 80,
                id: "IsSCProtectedStatus"
            },

            {
                accessorKey: "compositionType",
                placeholder: "Composition Type",
                header: "",
                resetColumnFilters: false,
                size: 80,
                id: "compositionType"
            },
            {
                accessorFn: (row) => row?.ClientCategorySearch,
                cell: ({ row }) => (
                    <>
                        <ShowClintCategory clintData={row?.original} AllMetadata={AllClientCategoryDataBackup} />
                    </>
                ),
                id: "ClientCategorySearch",
                placeholder: "Client Category",
                header: "",
                resetColumnFilters: false,
                size: 95,
            },
            {
                accessorFn: (row) => row?.Sitestagging + "." + row?.Sitestagging,
                cell: ({ row, column, getValue }) => (
                    <>
                        <ShowSiteComposition SitesTaggingData={row?.original?.Sitestagging} AllSitesData={AllSiteDataBackup} />
                    </>
                ),
                id: 'Sitestagging',
                placeholder: "Site Composition",
                resetColumnFilters: false,
                header: "",
                size: 95,
            },
            {
                accessorKey: "PercentComplete",
                placeholder: "Status",
                header: "",
                resetColumnFilters: false,
                size: 42,
                id: "PercentComplete"
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                                {row?.original?.Author != undefined ? (
                                    <>
                                        <a
                                            href={`${siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.Author?.Id)} />
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 125
            },
        ],
        [data]
    );

    const switchFlatViewData = (Type: any) => {
        if (Type == false) {
            setData(BackupFlatViewTableData)
            let groupedDataItems = JSON.parse(JSON.stringify(data));
            const flattenedData = flattenData(groupedDataItems);
            setData(flattenedData);
            setFlatView(true);
        } else {
            setData(BackupGroupByTableData);
            setFlatView(false);
        }
    }

    // this function is used for converting the Group by data into flat view 

    function flattenData(groupedDataItems: any) {
        const flattenedData: any = [];
        function flatten(item: any) {
            if (item.Title != "Others") {
                flattenedData.push(item);
            }
            if (item?.subRows) {
                item?.subRows.forEach((subItem: any) => flatten(subItem));
                item.subRows = []
            }
        }
        groupedDataItems?.forEach((item: any) => { flatten(item) });
        return flattenedData;
    }

    // Global Common Table Call Back Function // Selected Item Data for Table

    const GlobalTableCallBackData = React.useCallback((checkData: any) => {
        let TempArray: any = [];
        if (checkData?.length > 0) {
            checkData?.map((SelectedItem: any) => {
                let OriginalData: any = SelectedItem.original;
                if (OriginalData.TaskType?.Title == "Task" || OriginalData.TaskType?.Title == "Activities" || OriginalData.TaskType?.Title == "Workstream") {
                    AllSiteDataBackup?.map((AllSiteItem: any) => {
                        if (OriginalData.siteType == AllSiteItem.Title) {
                            // if (AllSiteItem?.ClientCategories?.length > 0) {
                            //     AllSiteItem?.ClientCategories?.map((ExistingCCItem: any) => {
                            //         if (ExistingCCItem.checked == true) {
                            //             OriginalData.ClientCategory = [ExistingCCItem];
                            //         }
                            //     })
                            // }
                        }
                        if (OriginalData.siteType == "Shareweb") {
                            let TempCCForTask: any = [];
                            // AllSiteDataBackup?.map((AllSiteItem: any) => {
                            //     if (AllSiteItem?.ClientCategories?.length > 0) {
                            //         AllSiteItem?.ClientCategories?.map((ExistingCCItem: any) => {
                            //             if (ExistingCCItem.checked == true) {
                            //                 TempCCForTask.push(ExistingCCItem);
                            //             }
                            //         })
                            //     }
                            // })
                            // OriginalData.ClientCategory = TempCCForTask;
                        }
                    })
                }
                if (OriginalData?.Item_x0020_Type == "SubComponent" || OriginalData?.Item_x0020_Type == "Feature" || OriginalData?.Item_x0020_Type == "Component") {
                    // let TempCCForCSF: any = [];
                    // AllSiteDataBackup?.map((AllSiteItem: any) => {
                    //     if (AllSiteItem?.ClientCategories?.length > 0) {
                    //         AllSiteItem?.ClientCategories?.map((ExistingCCItem: any) => {
                    //             if (ExistingCCItem.checked == true) {
                    //                 TempCCForCSF.push(ExistingCCItem);
                    //             }
                    //         })
                    //     }
                    // })
                    // OriginalData.ClientCategory = TempCCForCSF;
                }
                TempArray.push(OriginalData);

            })
        }
        console.log("Modified Data for Table Items ======", TempArray)
        SelectedChildItems = TempArray;
    }, []);


    // This is used for Client Category Popup related functionalities

    const openClientCategoryModel = (SelectedSite: string, SelectedCC: any) => {
        setSelectedSiteName(SelectedSite);
        setSelectedClientCategory(SelectedCC);
        setIsClientCategoryPopupOpen(true);
    }

    const ClosePopupCallback = React.useCallback((UsedFor: string) => {
        setIsClientCategoryPopupOpen(false);
    }, [])

    const saveClientCategory = React.useCallback((ClientCategories: any, siteName: string) => {
        let TempArray: any = [];
        AllSiteDataBackup?.map((AllCCItem: any) => {
            if (AllCCItem.Title == siteName) {
                AllCCItem.ClientCategories = ClientCategories;
            }
            TempArray.push(AllCCItem);
        })
        setAllSiteData([...TempArray]);
    }, [])

    const selectedParentClientCategory = (SelectedCCIndex: any, SiteName: any) => {
        let tempArray: any = [];
        AllSiteDataBackup?.map((ItemData: any,) => {
            if (ItemData.Title == SiteName) {
                if (SelectedCCIndex > -1) {
                    ItemData.ClientCategories?.map((CCItem: any, CCIndex: any) => {
                        if (CCIndex == SelectedCCIndex) {
                            CCItem.checked = true;
                            ItemData.TaggedCCTitle = CCItem.Title;
                        } else {
                            CCItem.checked = false
                        }
                    })
                }
            }
            tempArray.push(ItemData);
        })
        setAllSiteData([...tempArray]);
    }


    // this is used for Auto Suggestions on Main Panel 

    const CCAutoSuggestionsMain = async (Event: any, siteName: String) => {
        setSelectedSiteName(siteName);
        const searchedInputKey: string = Event.target.value;
        const tempArray: any = [];
        let CCDataForAutoSuggestions: any[] = await buildClientCategoryAllDataArray(AllClientCategoryDataBackup);

        if (searchedInputKey?.length > 0) {
            setSearchedKey(searchedInputKey);
            if (searchedInputKey?.length > 1) {
                if (CCDataForAutoSuggestions?.length > 0) {
                    CCDataForAutoSuggestions?.map((CCItem: any) => {
                        if (CCItem.newLabel?.toLowerCase().includes(searchedInputKey.toLowerCase())) {
                            tempArray.push(CCItem)
                        }
                    })
                    setSearchedClientCategoryData(tempArray);
                }
            }

        } else {
            setSearchedClientCategoryData(tempArray);
            setSearchedKey('')
        }
    }

    const filterDataRecursively = (data: any[], searchedKey: string, tempArray: any[]) => {
        data.forEach((item) => {
            if (
                item.newLabel?.toLowerCase().includes(searchedKey.toLowerCase()) ||
                item.Description1?.toLowerCase().includes(searchedKey.toLowerCase())
            ) {
                tempArray.push(item);
            }
            if (item.Child && item.Child.length > 0) {
                filterDataRecursively(item.Child, searchedKey, tempArray);
            }
        });
    };

    const SelectCCFromAutoSuggestion = (SelectedCC: any, siteName: string) => {
        setSearchedKey("");
        setSearchedClientCategoryData([]);
        let tempArray: any = [];
        AllSiteDataBackup?.map((ItemData: any,) => {
            if (ItemData.Title == siteName) {
                if (ItemData.ClientCategories?.length > 0) {
                    ItemData.ClientCategories = addObjectToArrayIfNotExists(ItemData.ClientCategories, SelectedCC)
                } else {
                    SelectedCC.checked = true;
                    ItemData.ClientCategories = [SelectedCC];
                }
            }
            tempArray.push(ItemData);
        })
        setAllSiteData([...tempArray])
    }

    const addObjectToArrayIfNotExists = (array: any, object: any) => {
        const exists = array.some((item: any) => item.Id === object.Id);
        if (!exists) {
            array.push(object);
        }
        return array;
    }

    // These function are used for Change Site Composition Settings Related function and validations

    const ChangeSiteCompositionSettings = (SettingType: any) => {
        SiteSettingJSON?.map((SSItem: any) => {
            if (SSItem.Name == SettingType) {
                SSItem.IsSelected = true;
            } else {
                SSItem.IsSelected = false;
            }
        })
        setSiteSettingJSON([...SiteSettingJSON])
        if (SettingType == "Proportional") {
            setIsSCProportional(true)
            setIsSCManual(false);
            setIsSCProtected(false)
            refreshSiteCompositionConfigurations();
            ChangeSiteCompositionInstant("Proportional");
        }
        if (SettingType == "Manual") {
            setIsSCManual(true);
            setIsSCProportional(false)
            setIsSCProtected(false)
            refreshSiteCompositionConfigurations();
            ChangeSiteCompositionInstant("Manual");
        }
        if (SettingType == "Deluxe") {
            setIsSCProtected(true)
            setIsSCManual(false);
            setIsSCProportional(false)
            refreshSiteCompositionConfigurations();
            ChangeSiteCompositionInstant("Deluxe");
        }
        if (SettingType == "Standard") {
            setIsSCManual(false);
            setIsSCProportional(false)
            setIsSCProtected(true)
            refreshSiteCompositionConfigurations();
            ChangeSiteCompositionInstant("Standard");
        }
    }


    // This is used for refreshing the All Site Data Also Site Composition JSON 
    const refreshSiteCompositionConfigurations = () => {
        let TempArray: any = [];
        AllSiteDataBackup?.map((ItemData: any) => {
            ItemData.ClienTimeDescription = "";
            ItemData.BtnStatus = false;
            ItemData.Date = '';
            ItemData.readOnly = false;
            TempArray.push(ItemData);
        })
        setAllSiteData([...TempArray])
    }


    // This functions used for updating Site Composition According to Site Composition Settings 

    const ChangeSiteCompositionInstant = (UsedFor: any) => {
        let TempSiteComposition: any = [];
        if (UsedFor == "Standard") {
            AllSiteDataBackup?.map((SiteData: any) => {
                StandardSiteCompositionJSON?.map((STItems: any) => {
                    if (SiteData.Title == STItems.Title || (SiteData.Title ==
                        "DA E+E" && STItems.Title == "ALAKDigital")) {
                        SiteData.ClienTimeDescription = STItems.ClienTimeDescription;
                        SiteData.BtnStatus = true;
                        SiteData.Date = STItems.Date;
                    }
                })
                TempSiteComposition.push(SiteData)
            })
            setTaggedSiteCompositionCount(StandardSiteCompositionJSON?.length)
            GlobalCount = StandardSiteCompositionJSON?.length
        }
        if (UsedFor == "Deluxe") {
            AllSiteDataBackup?.map((SiteData: any) => {
                DeluxeSiteCompositionJSON?.map((STItems: any) => {
                    if (SiteData.Title == STItems.Title || (SiteData.Title ==
                        "DA E+E" && STItems.Title == "ALAKDigital")) {
                        SiteData.ClienTimeDescription = STItems.ClienTimeDescription;
                        SiteData.BtnStatus = true;
                        SiteData.Date = STItems.Date;
                    }
                })
                TempSiteComposition.push(SiteData)
            })
            setTaggedSiteCompositionCount(DeluxeSiteCompositionJSON?.length)
            GlobalCount = DeluxeSiteCompositionJSON?.length;
        }
        if (UsedFor == "Proportional") {
            AllSiteDataBackup?.map((SiteData: any) => {
                SelectedItemDetailsFormCall?.SiteCompositionJSONBackup?.map((STItems: any) => {
                    if (SiteData.Title == STItems.Title || (SiteData.Title ==
                        "DA E+E" && STItems.Title == "ALAKDigital")) {
                        SiteData.BtnStatus = true;
                        SiteData.Date = STItems.Date;
                        SiteData.ClienTimeDescription = STItems.ClienTimeDescription;
                    }
                })
                TempSiteComposition.push(SiteData)
            })
            setTaggedSiteCompositionCount(SelectedItemDetailsFormCall?.SiteCompositionJSONBackup?.length)
            GlobalCount = SelectedItemDetailsFormCall?.SiteCompositionJSONBackup?.length;

        }
        if (UsedFor == "Manual") {
            AllSiteDataBackup?.map((SiteData: any) => {
                SelectedItemDetailsFormCall?.SiteCompositionJSONBackup?.map((STItems: any) => {
                    if (SiteData.Title == STItems.Title || (SiteData.Title ==
                        "DA E+E" && STItems.Title == "ALAKDigital")) {
                        SiteData.ClienTimeDescription = STItems.ClienTimeDescription;
                        SiteData.BtnStatus = true;
                        SiteData.Date = STItems.Date;
                    }
                })
                TempSiteComposition.push(SiteData);
            })
            setTaggedSiteCompositionCount(SelectedItemDetailsFormCall?.SiteCompositionJSONBackup?.length)
            GlobalCount = SelectedItemDetailsFormCall?.SiteCompositionJSONBackup?.length;
        }
        setAllSiteData([...TempSiteComposition]);
    }

    // This ise used for adding/ removing any site into Site Composition 

    const AddSiteCompositionFunction = (siteName: string) => {
        AllSiteDataBackup?.map((AllSiteItem: any) => {
            if (AllSiteItem.Title == siteName) {
                if (AllSiteItem.BtnStatus == true) {
                    AllSiteItem.BtnStatus = false;
                    AllSiteItem.ClienTimeDescription = 0;
                    GlobalCount--;
                    setTaggedSiteCompositionCount(TaggedSiteCompositionCount - 1)
                } else {
                    setTaggedSiteCompositionCount(TaggedSiteCompositionCount + 1)
                    GlobalCount++;
                    AllSiteItem.BtnStatus = true;
                    AllSiteItem.Date = Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY");
                }
            }
        })
        setAllSiteData([...AllSiteDataBackup])
    }

    // this is used for changing the Client Time description manually 

    const ChangeClientTimeDescriptionManually = (Event: any, siteName: string) => {
        AllSiteDataBackup?.map((AllSiteItem: any) => {
            if (AllSiteItem.Title == siteName) {
                AllSiteItem.ClienTimeDescription = Event.target.value;
            }
        })
        setAllSiteData([...AllSiteDataBackup])
    }


    // These functions are used for Updating the Data on Backend Side 

    const PrepareTheDataForUpdatingOnBackendSide = () => {
        let TaskShouldBeUpdate: any = true;
        let checkIsCCSelected: any = false;
        const PreparedUpdatedDataForValidation: any = filterUpdatedSiteCompositions();
        const selectedCC: any[] = PreparedUpdatedDataForValidation.ClientCategories;
        if (selectedCC?.length > 0) {
            checkIsCCSelected = true;
        } else {
            let conformationCCStatus = confirm("You don't have selected any Client Category if you still want to do it click on OK")
            if (conformationCCStatus) {
                checkIsCCSelected = true;
            } else {
                checkIsCCSelected = false;
            }
        }
        if (TotalPercent > 101) {
            TaskShouldBeUpdate = false;
            alert("site composition allocation should not be more than 100%");
        }
        if (TotalPercent.toFixed(0) < 99 && TotalPercent > 0) {
            let conformationSTatus = confirm("Site composition allocation should not be less than 100% if you still want to do it click on OK")
            if (conformationSTatus) {
                TaskShouldBeUpdate = true;
            } else {
                TaskShouldBeUpdate = false;
            }
        }
        if (TaskShouldBeUpdate && checkIsCCSelected) {
            let AllDataForUpdate: any = [SelectedItemDetailsFormCall].concat(SelectedChildItems);
            let DataUpdated: any = false;
            AllDataForUpdate?.map(async (FinalData: any) => {
                if (FinalData?.Item_x0020_Type == "SubComponent" || FinalData?.Item_x0020_Type == "Feature" || FinalData?.Item_x0020_Type == "Component") {
                    if (FinalData?.IsSCProtected == undefined || FinalData?.IsSCProtected == false) {
                        DataUpdated = UpdateOnBackendSide(FinalData, "CSF");
                    }
                }
                if (FinalData.TaskType?.Title == "Task" || FinalData.TaskType?.Title == "Activities" || FinalData.TaskType?.Title == "Workstream") {
                    UpdateOnBackendSide(FinalData, "AWT");
                    if (FinalData?.IsSCProtected == undefined || FinalData?.IsSCProtected == false) {
                        DataUpdated = UpdateOnBackendSide(FinalData, "CSF");
                    }
                }
            })
            if (DataUpdated) {
                ClosePanelFunction("Save");
                GlobalCount = 0;
            }
        }

    }

    const UpdateOnBackendSide = async (DataForUpdate: any, ItemType: string) => {
        const PreparedUpdatedData: any = filterUpdatedSiteCompositions();
        let UpdateStatus: any = false;
        let SiteCompositionJSON: any[] = [];
        let ClientCategoriesIds: any[] = [];
        let IsSCUpdatedInline: any = false;
        let IsCCUpdatedInline: any = false;
        let IsBothUpdatedInline: any = false;

        if (DataForUpdate.IsSCUpdatedInline == true) {
            IsSCUpdatedInline = true;
        } else {
            IsSCUpdatedInline = false;
        }
        if (DataForUpdate.IsCCUpdatedInline == true) {
            IsCCUpdatedInline = true;
        } else {
            IsCCUpdatedInline = false;
        }
        if (DataForUpdate.IsBothUpdatedInline == true) {
            IsBothUpdatedInline = true;
        } else {
            IsBothUpdatedInline = false;
        }

        let SiteSettings: any[] = PreparedUpdatedData?.siteSetting;
        if (ItemType == "CSF") {
            SiteCompositionJSON = PreparedUpdatedData.SiteTaggingData;
            PreparedUpdatedData.ClientCategories?.map((AllCCItem: any) => {
                ClientCategoriesIds.push(AllCCItem.Id)
            })
        }
        if (ItemType == "AWT") {
            if (DataForUpdate?.siteType?.toLocaleLowerCase() == "shareweb") {
                SiteCompositionJSON = PreparedUpdatedData.SiteTaggingData;
                PreparedUpdatedData.ClientCategories?.map((AllCCItem: any) => {
                    ClientCategoriesIds.push(AllCCItem.Id)
                })
            } else {
                if (usedFor == "AWT") {
                    SiteCompositionJSON = PreparedUpdatedData.SiteTaggingData;
                } else {
                    if (DataForUpdate?.siteType != undefined) {
                        let SCDummyJSON: any = {
                            ClienTimeDescription: "100",
                            Title: DataForUpdate?.siteType,
                            localSiteComposition: true,
                            SiteImages: DataForUpdate?.siteIcon,
                            Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
                        }
                        SiteCompositionJSON = [SCDummyJSON]
                    }
                }
                if (DataForUpdate?.siteType?.length > 0) {
                    PreparedUpdatedData.ClientCategories?.map((AllCC: any) => {
                        if (AllCC.siteName == DataForUpdate?.siteType) {
                            ClientCategoriesIds.push(AllCC.Id);
                        }
                    })
                }
            }
        }


        let FinalSitestagging: any[] = commonFunctionForRemoveDataRedundancy(SiteCompositionJSON);
        let MakeUpdateJSONDataObject: object = {};
        if (((!IsSCUpdatedInline || !IsCCUpdatedInline) && IsBothUpdatedInline) || (!IsSCUpdatedInline && !IsCCUpdatedInline && !IsBothUpdatedInline)) {
            MakeUpdateJSONDataObject = {
                Sitestagging: FinalSitestagging?.length > 0 ? JSON.stringify(FinalSitestagging) : null,
                ClientCategoryId: { "results": (ClientCategoriesIds?.length > 0) ? ClientCategoriesIds : [] },
                SiteCompositionSettings: (SiteSettings?.length > 0) ? JSON.stringify(SiteSettings) : null,
            }
        } else if (IsSCUpdatedInline) {
            MakeUpdateJSONDataObject = {
                Sitestagging: FinalSitestagging?.length > 0 ? JSON.stringify(FinalSitestagging) : null,
                SiteCompositionSettings: (SiteSettings?.length > 0) ? JSON.stringify(SiteSettings) : null,
            }
        } else if (IsCCUpdatedInline) {
            MakeUpdateJSONDataObject = {
                ClientCategoryId: { "results": (ClientCategoriesIds?.length > 0) ? ClientCategoriesIds : [] },
            }
        }
        console.log("final data to update in backend side object ======", MakeUpdateJSONDataObject);
        try {
            await Promise.all([
                web.lists.getById(DataForUpdate?.listId).items.getById(DataForUpdate?.Id).update(MakeUpdateJSONDataObject).then(() => {
                    console.log("Site Composition Related All Details Updated For Child Items");
                    UpdateStatus = true;
                })
            ]);
        } catch (error) {
            console.error("Error updating client category:", error);
        }
        return UpdateStatus;
    };


    // This is a common Function For Remove Data Redundancy on the basis of Title

    const commonFunctionForRemoveDataRedundancy = (Array: any) => {
        let uniqueIds: any = {};
        const UniqueCCItems: any = Array?.filter((obj: any) => {
            if (!uniqueIds[obj.Title]) {
                uniqueIds[obj.Title] = true;
                return true;
            }
            return false;
        });
        return UniqueCCItems;
    }


    const filterUpdatedSiteCompositions = () => {
        let GlobalSiteCompositionData: any = [];
        let GlobalTaggedClientCategories: any = [];
        let GlobalSiteSettingData: any = [{ Proportional: false, Manual: false, Standard: false, Deluxe: false, Protected: false }];
        // let SSObjectKeys: any = Object.keys(GlobalSiteSettingData[0]);
        AllSiteDataBackup?.map((SCDataItem: any) => {
            if (SCDataItem.BtnStatus == true) {
                let ClienTimeDescription: any = '';
                if (IsSCProportional) {
                    ClienTimeDescription = (100 / GlobalCount).toFixed(1);
                } else {
                    ClienTimeDescription = SCDataItem.ClienTimeDescription
                }
                let SCItemsJSON: object = {
                    ClienTimeDescription: ClienTimeDescription,
                    Title: SCDataItem.Title,
                    localSiteComposition: true,
                    SiteImages: SCDataItem.Item_x005F_x0020_Cover ? SCDataItem.Item_x005F_x0020_Cover.Url : "",
                    Date: SCDataItem?.Date
                }
                GlobalSiteCompositionData.push(SCItemsJSON);
            }
            if (SCDataItem?.ClientCategories?.length > 0) {
                SCDataItem?.ClientCategories?.map((CCItemData: any) => {
                    if (CCItemData.checked == true) {
                        GlobalTaggedClientCategories.push(CCItemData);
                    }
                })
            }
        })
        SiteSettingJSON?.map((SSItemData: any) => {
            let SelectedSS: any = '';
            if (SSItemData?.IsSelected == true) {
                SelectedSS = SSItemData.Name;
            }
            if (SelectedSS == "Proportional") {
                GlobalSiteSettingData[0].Proportional = true;
                GlobalSiteSettingData[0].Manual = false;
                GlobalSiteSettingData[0].Standard = false;
                GlobalSiteSettingData[0].Deluxe = false;
            }
            if (SelectedSS == "Manual") {
                GlobalSiteSettingData[0].Manual = true;
                GlobalSiteSettingData[0].Proportional = false;
                GlobalSiteSettingData[0].Standard = false;
                GlobalSiteSettingData[0].Deluxe = false;
            }
            if (SelectedSS == "Standard") {
                GlobalSiteSettingData[0].Manual = false;
                GlobalSiteSettingData[0].Proportional = false;
                GlobalSiteSettingData[0].Standard = true;
                GlobalSiteSettingData[0].Deluxe = false;
            }
            if (SelectedSS == "Deluxe") {
                GlobalSiteSettingData[0].Manual = false;
                GlobalSiteSettingData[0].Proportional = false;
                GlobalSiteSettingData[0].Standard = false;
                GlobalSiteSettingData[0].Deluxe = true;
            }
            if (IsMakeSCProtected == true) {
                GlobalSiteSettingData[0].Protected = true;
            }
        })

        const FinalPreparedData: object = {
            SiteTaggingData: GlobalSiteCompositionData,
            siteSetting: GlobalSiteSettingData,
            ClientCategories: GlobalTaggedClientCategories
        }
        return FinalPreparedData;
    }

    const SmartTotalTimeCallBack = React.useCallback((SmartTotalTime: any) => {
        setTaskTotalTime(SmartTotalTime);
    }, [])


    // This is used for update site composition 

    const UpdateSiteCompositionButtonFunction = () => {
        if (SelectedChildItems?.length > 0) {
            let FindPreparedData: any = filterUpdatedSiteCompositions();
            let SiteCompositionData: any = FindPreparedData?.SiteTaggingData;
            let siteSettingData: any = FindPreparedData?.siteSetting;
            let checkIsSCProtected: any = false;
            SelectedChildItems?.map((SelectedItem: any) => {
                if (SelectedItem.TaskType?.Title?.length > 1) {
                    if (SelectedItem?.siteType?.toLocaleLowerCase() !== "shareweb") {
                        if (SelectedItem?.siteType != undefined) {
                            let SCDummyJSON: any = {
                                ClienTimeDescription: "100",
                                Title: SelectedItem?.siteType,
                                localSiteComposition: true,
                                SiteImages: SelectedItem?.siteIcon,
                                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
                            }
                            SiteCompositionData = [SCDummyJSON]
                        }
                        let tempSiteSetting: any = [{ Proportional: false, Manual: true, Protected: false, Deluxe: false, Standard: false }]
                        siteSettingData = tempSiteSetting;
                    }
                }
                SelectedItem.Sitestagging = SiteCompositionData?.length > 0 ? JSON.stringify(SiteCompositionData) : "";
                SelectedItem.IsSCUpdatedInline = true;
                if (siteSettingData != undefined) {
                    if (siteSettingData?.length > 0) {
                        checkIsSCProtected = siteSettingData[0].Protected;
                    }
                    SelectedItem.compositionType = siteCompositionType(JSON.stringify(siteSettingData));
                } else {
                    SelectedItem.compositionType = '';
                }
                if (checkIsSCProtected) {
                    SelectedItem.IsSCProtected = true;
                    SelectedItem.IsSCProtectedStatus = "Protected";
                } else {
                    SelectedItem.IsSCProtected = false;
                    SelectedItem.IsSCProtectedStatus = "";
                }
            })
            setData([...data]);
        } else {
            alert("Before performing this operation, select a data item from the table")
        }
    }

    // This is used for update Client Categories 

    const UpdateClientCategoriesButtonFunction = () => {
        if (SelectedChildItems?.length > 0) {
            let FindPreparedData: any = filterUpdatedSiteCompositions();
            let ClientCategoryData: any = FindPreparedData?.ClientCategories;
            SelectedChildItems?.map((SelectedItem: any) => {
                let tempCCItem: any = [];
                ClientCategoryData?.map((CCItems: any) => {
                    if (SelectedItem.TaskType?.Title?.length > 1) {
                        if (SelectedItem?.siteType?.toLocaleLowerCase() !== "shareweb") {
                            if (CCItems.siteName == SelectedItem?.siteType) {
                                tempCCItem.push(CCItems);
                            }
                        }
                    }
                })

                if (SelectedItem?.siteType?.toLocaleLowerCase() !== "shareweb") {
                    SelectedItem.ClientCategory = tempCCItem;
                } else {
                    SelectedItem.ClientCategory = ClientCategoryData?.length > 0 ? ClientCategoryData : [];
                }

                SelectedItem.IsCCUpdatedInline = true;
            })
            setData([...data]);
        } else {
            alert("Before performing this operation, select a data item from the table")
        }
    }


    // This is used for update both site composition and Client Categories 

    const UpdateBothButtonFunction = () => {
        if (SelectedChildItems?.length > 0) {
            let FindPreparedData: any = filterUpdatedSiteCompositions();
            let SiteCompositionData: any = FindPreparedData?.SiteTaggingData;
            let siteSettingData: any = FindPreparedData?.siteSetting;
            let ClientCategoryData: any = FindPreparedData?.ClientCategories;
            let checkIsSCProtected: any = false;
            SelectedChildItems?.map((SelectedItem: any) => {
                SelectedItem.IsBothUpdatedInline = true;
                // This is for the SC 
                if (SelectedItem.TaskType?.Title?.length > 1) {
                    if (SelectedItem?.siteType?.toLocaleLowerCase() !== "shareweb") {
                        if (SelectedItem?.siteType != undefined) {
                            let SCDummyJSON: any = {
                                ClienTimeDescription: "100",
                                Title: SelectedItem?.siteType,
                                localSiteComposition: true,
                                SiteImages: SelectedItem?.siteIcon,
                                Date: Moment(new Date()).tz("Europe/Berlin").format("DD/MM/YYYY")
                            }
                            SiteCompositionData = [SCDummyJSON]
                        }
                        let tempSiteSetting: any = [{ Proportional: false, Manual: true, Protected: false, Deluxe: false, Standard: false }]
                        siteSettingData = tempSiteSetting;
                    }
                }
                SelectedItem.Sitestagging = SiteCompositionData?.length > 0 ? JSON.stringify(SiteCompositionData) : "";

                // This is fir CC 
                let tempCCItem: any = [];
                ClientCategoryData?.map((CCItems: any) => {
                    if (SelectedItem.TaskType?.Title?.length > 1) {
                        if (SelectedItem?.siteType?.toLocaleLowerCase() !== "shareweb") {
                            if (CCItems.siteName == SelectedItem?.siteType) {
                                tempCCItem.push(CCItems);
                            }
                        }
                    }
                })

                if (SelectedItem?.siteType?.toLocaleLowerCase() !== "shareweb") {
                    SelectedItem.ClientCategory = tempCCItem;
                } else {
                    SelectedItem.ClientCategory = ClientCategoryData?.length > 0 ? ClientCategoryData : [];
                }
                if (siteSettingData != undefined) {
                    if (siteSettingData?.length > 0) {
                        checkIsSCProtected = siteSettingData[0].Protected;
                    }
                    SelectedItem.compositionType = siteCompositionType(JSON.stringify(siteSettingData));
                } else {
                    SelectedItem.compositionType = '';
                }
                if (checkIsSCProtected) {
                    SelectedItem.IsSCProtected = true;
                    SelectedItem.IsSCProtectedStatus = "Protected";
                } else {
                    SelectedItem.IsSCProtected = false;
                    SelectedItem.IsSCProtectedStatus = "";
                }
            })
            setData([...data]);
        } else {
            alert("Before performing this operation, select a data item from the table");
        }
    }



    // This is used for reset the pervious data 

    const ResetDataButtonFunction = (DataViewStatus: any) => {
        setFlatView(false);
        let DeepCopyData: any = JSON.parse(JSON.stringify(BackupGroupByTableData));
        if (DeepCopyData?.length > 0) {
            setData([...DeepCopyData]);
        }
        SelectedChildItems = [];
    }

    // END of Function Code 

    return (
        <section>
            <Panel
                onRenderHeader={CustomHeader}
                isOpen={IsModelOpen}
                isBlocking={false}
                onDismiss={() => ClosePanelFunction("Close")}
                onRenderFooter={CustomFooter}
                type={PanelType.custom}
                customWidth="1500px"
            >
                <section className="mb-5 modal-body">
                    <div className="Site-composition-and-client-category d-flex full-width">
                        <div className="site-settings-and-site-composition-distributions full-width">
                            <div className="siteColor border p-1 alignCenter">
                                <span className="me-2" onClick={() =>
                                    setSiteCompositionTool(SiteCompositionTool ? false : true)
                                }>
                                    {SiteCompositionTool ? (
                                        <SlArrowDown />
                                    ) : (
                                        <SlArrowRight />
                                    )}
                                </span>
                                Site Composition Settings & Distributions
                                <span className="hover-text alignIcon">
                                    <span className="svg__iconbox svg__icon--info dark"></span>
                                    <span className="tooltip-text pop-right">
                                        <b>Site Composition Settings :</b>
                                        {"The site composition Settings options include manual input by users for selected sites, equal distribution among selected sites totaling 100% (proportional allocation), and predefined dynamic configurations (Deluxe and Standard) in the cockpit."}
                                        <p></p>
                                        <b>Site Composition Distributions :</b>
                                        {"With the Site Composition Distribution Tool, users can both add and modify the Site Composition Distribution of CSF-AWT. Subsequently, the tool will generate the time spent on an AWT based on the specified Site Composition."}
                                    </span>
                                </span>

                            </div>
                            {SiteCompositionTool ?
                                <>
                                    <div className="alignCenter border p-1 pt-0 site-settings">
                                        {SiteSettingJSON?.map((SSItem: any) => {
                                            return (
                                                <div className="SpfxCheckRadio me-2">
                                                    <input
                                                        type={SSItem.Type}
                                                        id={SSItem.Name}
                                                        name={SSItem.BtnName}
                                                        defaultChecked={SSItem.IsSelected == true ? true : false}
                                                        checked={SSItem.IsSelected == true ? true : false}
                                                        className={SSItem.Type}
                                                        onClick={() => ChangeSiteCompositionSettings(SSItem.Name)}
                                                    />
                                                    {SSItem.Name}
                                                    <span className="hover-text alignIcon">
                                                        <span className="svg__iconbox svg__icon--info dark"></span>
                                                        <span className="tooltip-text pop-right">
                                                            {SSItem.Descriptions}
                                                        </span>
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <table
                                        className="table table-bordered mb-1"
                                    >
                                        {AllSiteData != undefined && AllSiteData.length > 0 ?
                                            <tbody>
                                                {AllSiteData?.map((siteData: any, index: any) => {
                                                    if (siteData.Title !== "Health" && siteData.Title !== "Offshore Tasks" && siteData.Title !== "Gender" && siteData.Title !== "Small Projects" && siteData.Title !== "SDC Sites" && siteData.Title !== "DRR" && siteData.Title !== "SP Online") {
                                                        if (siteData.ClienTimeDescription != undefined || siteData.ClienTimeDescription != null) {
                                                            let num: any = Number(siteData.ClienTimeDescription).toFixed(0);
                                                            TotalPercent = TotalPercent + Number(num);
                                                        }
                                                        return (
                                                            <tr
                                                                // className={siteData?.StartEndDateValidation ? "Disabled-Link border-1 bg-th" : 'hreflink border-1'}
                                                                className={'border-1 hreflink'}
                                                            >
                                                                <td
                                                                    scope="row"
                                                                    className={IsSCProtected == true ? "Disabled-Link m-0 p-1 align-middle opacity-75" : "m-0 p-1 align-middle"}
                                                                    style={{ width: "5%" }}
                                                                >
                                                                    <input
                                                                        className="form-check-input rounded-0 hreflink" type="checkbox"
                                                                        defaultChecked={siteData.BtnStatus}
                                                                        checked={siteData.BtnStatus ? true : false}
                                                                        onClick={(e) => AddSiteCompositionFunction(siteData.Title)}
                                                                    />
                                                                </td>
                                                                <td className="m-0 p-0 align-middle" style={{ width: "30%" }}>
                                                                    <div className="alignCenter">
                                                                        <img src={siteData.Item_x005F_x0020_Cover ? siteData.Item_x005F_x0020_Cover.Url : ""} className="mx-2 workmember" />
                                                                        {siteData.Title}
                                                                        <span></span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-1"
                                                                    style={{ width: "20%" }}
                                                                >
                                                                    <div className="input-group alignCenter">
                                                                        {siteData.BtnStatus ?
                                                                            <>
                                                                                {IsSCProportional ?
                                                                                    <input type="number" min="1"
                                                                                        style={{ cursor: "not-allowed", width: "100%" }}
                                                                                        defaultValue={siteData.BtnStatus ? (100 / TaggedSiteCompositionCount).toFixed(1) : ""}
                                                                                        value={siteData.BtnStatus ? (100 / TaggedSiteCompositionCount).toFixed(1) : ""}
                                                                                        className="form-control boldClable p-1" readOnly={true}
                                                                                    />
                                                                                    : ''
                                                                                }
                                                                                {IsSCProtected == true ?
                                                                                    <input
                                                                                        type="number" min="1" max="100"
                                                                                        className="boldClable form-control p-1"
                                                                                        readOnly={IsSCProtected}
                                                                                        style={IsSCProtected ? { cursor: "not-allowed", width: '100%' } : {}}
                                                                                        value={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(1) : null}
                                                                                        onChange={(e) => ChangeClientTimeDescriptionManually(e, siteData.Title)}
                                                                                    />
                                                                                    : ''
                                                                                }
                                                                                {IsSCManual == true ?
                                                                                    <input
                                                                                        type="number" min="1" max="100"
                                                                                        // value={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(1) : null}
                                                                                        className="form-control p-1 boldClable"
                                                                                        defaultValue={siteData.ClienTimeDescription ? Number(siteData.ClienTimeDescription).toFixed(1) : null}
                                                                                        onChange={(e) => ChangeClientTimeDescriptionManually(e, siteData.Title)}
                                                                                    />
                                                                                    : ''
                                                                                }
                                                                            </> :
                                                                            <input
                                                                                type="number"
                                                                                className="form-control"
                                                                                value={''}
                                                                                readOnly={true}
                                                                                style={{ cursor: "not-allowed", width: "100%" }}
                                                                            />
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="m-0 align-middle" style={{ width: "5%" }}>
                                                                    <span>{siteData.BtnStatus ? "%" : ''}</span>
                                                                </td>
                                                                {usedFor == "AWT" ?
                                                                    <td className="m-0 align-middle" style={{ width: "10%" }}>
                                                                        {IsSCProportional && !IsSCManual && !IsSCProtected ?
                                                                            <span>
                                                                                {siteData.BtnStatus && TaskTotalTime ? (TaskTotalTime / TaggedSiteCompositionCount).toFixed(2) + " h" : siteData.BtnStatus ? "0 h" : null}
                                                                            </span>
                                                                            :
                                                                            <span>
                                                                                {siteData.BtnStatus && TaskTotalTime ? (siteData.ClienTimeDescription ? (siteData.ClienTimeDescription * TaskTotalTime / 100).toFixed(2) + " h" : "0 h") : siteData.BtnStatus ? "0 h" : null}
                                                                            </span>
                                                                        }
                                                                    </td>
                                                                    :
                                                                    null
                                                                }
                                                                <td className="m-0 align-middle" style={{ width: "30%" }}>
                                                                    {siteData.TaggedCCTitle}
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                })}
                                            </tbody>
                                            : null}
                                    </table>
                                    <div className="alignCenter justify-content-end border mt-1 pe-1 py-1 siteColor">
                                        {usedFor == "CSF" ?
                                            <div className="alignCenter">
                                                <div className="alignCenter border px-3">
                                                    <span>SCD</span>
                                                    <span className="hover-text alignIcon">
                                                        <span className="svg__iconbox svg__icon--info dark"></span>
                                                        <span className="tooltip-text pop-right">
                                                            {"Site composition distribution percentage"}
                                                        </span>
                                                    </span>
                                                </div>
                                                <span className="border" style={{ padding: '5px 20px' }}>
                                                    {IsSCManual ? `${TotalPercent} %` : "100 %"}
                                                </span>
                                            </div> :
                                            <>
                                                <div className="alignCenter">
                                                    <div className="alignCenter border px-3">
                                                        <span>SCD</span>
                                                        <span className="hover-text alignIcon">
                                                            <span className="svg__iconbox svg__icon--info dark"></span>
                                                            <span className="tooltip-text pop-right">
                                                                {"Site composition distribution percentage"}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <span className="border" style={{ padding: '5px 20px' }}>
                                                        {IsSCManual ? `${TotalPercent} %` : "100%"}
                                                    </span>
                                                </div>
                                                <div className="alignCenter">
                                                    <div className="alignCenter border px-3">
                                                        <span>ST</span>
                                                        <span className="hover-text alignIcon">
                                                            <span className="svg__iconbox svg__icon--clock dark"></span>
                                                            <span className="tooltip-text pop-right">
                                                                {"Total time spent on this task"}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <span className="border" style={{ padding: '5px 20px' }}>
                                                        {TaskTotalTime > 0 ? Number(TaskTotalTime).toFixed(2) : 0} h
                                                    </span>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </>
                                : null}
                        </div>
                        <div className="summarize-cc full-width ps-1">
                            <div className="summarize-cc edit-site-composition-on-task-profile">
                                <div className="border p-1 siteColor alignCenter">
                                    <span className="me-2" onClick={() =>
                                        setSummarizationTool(SummarizationTool ? false : true)
                                    }>
                                        {SummarizationTool ? (
                                            <SlArrowDown />
                                        ) : (
                                            <SlArrowRight />
                                        )}
                                    </span>
                                    Client Category Identification Tool
                                    <span className="hover-text alignIcon">
                                        <span className="svg__iconbox svg__icon--info dark"></span>
                                        <span className="tooltip-text pop-right">
                                            <b>Client Category Identification Tool:</b><br />
                                            This tool efficiently consolidates client categories associated with selected items and their corresponding child Items (All Tagged CC in Selected Item CSF and AWT). The tool offers a streamlined view of client categories, filtering them based on their respective sites. The selected client categories seamlessly Inherited to the designated parent item and also inherited into selected items (CSF/AWT) from the Tagged Child Item Table.
                                            <p className="mb-1"><b>Validation Cases:</b> </p>
                                            <b>1. </b>If the selected item have tagged CCs, that CCs will be automatically set as the default selection<br />
                                            <b>2. </b>If no tagged CC is present in the selected item, only display the relevant child items CCs (all tagged CCs in the selected items CSF and AWT).
                                        </span>
                                    </span>
                                </div>
                                {SummarizationTool ?
                                    <div>
                                        <table className="table">
                                            <thead>
                                                <tr className="border-1">
                                                    <th scope="col">Sr.No.</th>
                                                    <th scope="col">Site Name</th>
                                                    <th scope="col">Client Categories</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {AllSiteData?.map((CCDetails: any) => {
                                                    if (CCDetails.Title == "EPS" || CCDetails.Title == "EI" || CCDetails.Title == "Migration" || CCDetails.Title == "Education" || CCDetails?.ClientCategories?.length > 0) {
                                                        CCTableCount++;
                                                        return (
                                                            <tr className="border-1">
                                                                <th className="m-0 p-1 ps-3 align-middle">{CCTableCount}</th>
                                                                <td className="m-0 p-1 align-middle w-25">{CCDetails.Title}</td>
                                                                <td className="m-0 p-1 align-middle w-75">
                                                                    <div className="input-group">
                                                                        <input type="text"
                                                                            className="border-end-0 form-control"
                                                                            placeholder={`Search ${CCDetails.Title} Client Categories Here`}
                                                                            value={CCDetails.Title == SelectedSiteName ? searchedKey : ""}
                                                                            onChange={(e: any) => CCAutoSuggestionsMain(e, CCDetails.Title)}
                                                                            defaultValue={CCDetails.Title == SelectedSiteName ? searchedKey : ""}
                                                                        />
                                                                        <span className="bg-white hreflink border"
                                                                            onClick={() => openClientCategoryModel(CCDetails.Title, CCDetails.ClientCategories)}
                                                                        >
                                                                            <span title="Edit Client Category" className="svg__iconbox svg__icon--editBox hreflink">
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                    {SearchedClientCategoryData?.length > 0 && CCDetails.Title == SelectedSiteName ? (
                                                                        <div className="SearchTableCategoryComponent">
                                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                {SearchedClientCategoryData.map((item: any) => {
                                                                                    return (
                                                                                        <li className="list-group-item rounded-0 list-group-item-action" key={item.id} onClick={() => SelectCCFromAutoSuggestion(item, CCDetails.Title)} >
                                                                                            <a>{item.newLabel}</a>
                                                                                        </li>
                                                                                    )
                                                                                }
                                                                                )}
                                                                            </ul>
                                                                        </div>) : null}
                                                                    {CCDetails.ClientCategories?.length > 0 ?
                                                                        <ul className="border list-group px-1 rounded-0 my-1">
                                                                            {CCDetails.ClientCategories?.map((CCItem: any, ChildIndex: any) => {
                                                                                return (
                                                                                    <li className="alignCenter SpfxCheckRadio border-0 list-group-item px-1 p-1">
                                                                                        <input
                                                                                            className="radio"
                                                                                            type="radio"
                                                                                            name={`Client-Category-${CCTableCount}`}
                                                                                            defaultChecked={CCItem.checked == true ? true : false}
                                                                                            checked={CCItem.checked == true ? true : false}
                                                                                            onClick={() => selectedParentClientCategory(ChildIndex, CCDetails.Title)}
                                                                                            id="firstRadio" />
                                                                                        <label className="form-check-label ms-2">{CCItem.Title}</label>
                                                                                    </li>
                                                                                )
                                                                            })}
                                                                        </ul>
                                                                        : null}
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                })}
                                            </tbody>
                                        </table>
                                    </div> :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                    {IsShowTableContent ?
                        <div className="tagged-child-items-container mt-2">
                            <div className="tagged-child-items-header alignCenter justify-content-between border p-2">
                                <div className="siteColor alignCenter">
                                    Tagged Child Items
                                    <span className="hover-text alignIcon">
                                        <span className="svg__iconbox svg__icon--info dark"></span>
                                        <span className="tooltip-text pop-right">
                                            {"These entries within the table are identified as child items associated with the selected CSF/AWT"}
                                        </span>
                                    </span>

                                </div>
                                <div>
                                    <button className="btn btn-primary px-3 " onClick={UpdateSiteCompositionButtonFunction}>Apply Site Composition</button>
                                    <button className="btn btn-primary px-3 mx-2" onClick={UpdateClientCategoriesButtonFunction}>Apply Client Categories</button>
                                    <button className="btn btn-primary px-3 me-2" onClick={UpdateBothButtonFunction}>Apply Both</button>
                                    <button className="btn btn-primary px-3 " onClick={() => ResetDataButtonFunction(flatView)}>Reset</button>
                                </div>
                                <div className="alignCenter">
                                    <label className="switch me-2 siteColor" htmlFor="checkbox-Flat">
                                        <input checked={flatView} onClick={() => switchFlatViewData(flatView)} type="checkbox" id="checkbox-Flat" name="Flat-view" />
                                        {flatView === true ? <div style={{ backgroundColor: `${PortfolioItemColor}`, borderColor: `${PortfolioItemColor}` }} className="slider round" title='Switch to GroupBy View'></div> : <div title='Switch to Flat-View' className="slider round"></div>}
                                    </label>
                                    <span className='me-1 siteColor'>Flat View</span>
                                    <span className="hover-text alignIcon">
                                        <span className="svg__iconbox svg__icon--info dark"></span>
                                        <span className="tooltip-text pop-left">
                                            {"This button enables you to toggle between GroupBy and Flat views for data visualization."}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className="tagged-child-items-table border">
                                <GlobalCommonTable
                                    setLoaded={setLoaded}
                                    AllListId={RequiredListIds}
                                    columns={columns}
                                    data={data}
                                    multiSelect={true}
                                    callBackData={GlobalTableCallBackData}
                                    showHeader={false}
                                    fixedWidth={true}
                                    expendedTrue={true}
                                />
                            </div>
                        </div> : null
                    }
                    <div className="client-category-panel">
                        {IsClientCategoryPopupOpen ?
                            <ClientCategoryPopup
                                ContextValue={RequiredListIds}
                                SelectedCC={SelectedClientCategory}
                                CurrentSiteName={SelectedSiteName}
                                ClosePopupCallback={ClosePopupCallback}
                                saveClientCategory={saveClientCategory}
                            /> : null}
                    </div>
                    {usedFor == "AWT" ?
                        <div className="smart-total-time" style={{ display: "None" }}>
                            <SmartTotalTime props={ItemDetails} callBack={SmartTotalTimeCallBack} />
                        </div>
                        : null
                    }
                </section>
                {!loaded ? <PageLoader /> : ""}
            </Panel>
        </section>
    )
}
export default CentralizedSiteComposition;