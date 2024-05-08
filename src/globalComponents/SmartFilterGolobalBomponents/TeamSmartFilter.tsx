import * as React from 'react';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import * as globalCommon from "../../globalComponents/globalCommon";
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiFillCheckSquare, AiFillMinusSquare, AiOutlineBorder, AiOutlineUp } from 'react-icons/ai';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import '../../globalComponents/SmartFilterGolobalBomponents/Style.css'
import Tooltip from '../Tooltip';
import ShowTaskTeamMembers from '../ShowTaskTeamMembers';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { ColumnDef } from '@tanstack/react-table';
import GlobalCommanTable from '../GroupByReactTableComponents/GlobalCommanTable';
import PreSetDatePikerPannel from './PreSetDatePiker';
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
// import TeamSmartFavorites from './Smart Favrorites/TeamSmartFavorites';
import TeamSmartFavoritesCopy from './Smart Favrorites/TeamSmartFavoritesCopy';
import { GlobalConstants } from '../LocalCommon';
import { myContextValue } from '../globalCommon';

let filterGroupsDataBackup: any = [];
let filterGroupData1: any = [];
let timeSheetConfig: any = {};
const TeamSmartFilter = (item: any) => {
    let MyContextdata: any = React.useContext(myContextValue);
    let web = new Web(item?.ContextValue?.Context?.pageContext?._web?.absoluteUrl + '/');
    let allMasterTasksData: any = item.AllMasterTasksData;
    let allTastsData: any = item.AllSiteTasksData;
    let AllSiteTasksDataLoadAll = item?.AllSiteTasksDataLoadAll;
    let smartFiltercallBackData = item.smartFiltercallBackData;
    let ContextValue = item?.ContextValue;
    let portfolioColor: any = item?.portfolioColor
    let AllProjectBackupArray: any = []
    try {
        AllProjectBackupArray = JSON.parse(JSON.stringify(item?.ProjectData));
    } catch (e) {
        console.log(e);
    }
    const [loadeAllData, setLoadeAllData] = React.useState(false)
    const [PreSetPanelIsOpen, setPreSetPanelIsOpen] = React.useState(false);
    const [TaskUsersData, setTaskUsersData] = React.useState([]);
    const [AllUsers, setTaskUser] = React.useState([]);
    const [smartmetaDataDetails, setSmartmetaDataDetails] = React.useState([])
    const [expanded, setExpanded] = React.useState([]);
    const [filterGroupsData, setFilterGroups] = React.useState([]);
    const [allStites, setAllStites] = React.useState([]);
    const [portfolioTypeHeadingValue, setPortfolioTypeHeading] = React.useState<any>([]);
    const [allFilterClintCatogryData, setFilterClintCatogryData] = React.useState([]);
    const [CategoriesandStatusInfo, setCategoriesandStatusInfo] = React.useState('');
    const [sitesCountInfo, setsitesCountInfo] = React.useState('');
    const [projectCountInfo, setprojectCountInfo] = React.useState('');
    const [clientCategoryCountInfo, setclientCategoryCountInfo] = React.useState('');
    const [teamMembersCountInfo, setteamMembersCountInfo] = React.useState('');
    const [dateCountInfo, setdateCountInfo] = React.useState('');
    const [isSmartFevShowHide, setIsSmartFevShowHide] = React.useState(false);
    const rerender = React.useReducer(() => ({}), {})[1]
    const [flatView, setFlatView] = React.useState(false);

    const [IsSmartfilter, setIsSmartfilter] = React.useState(false);
    const [isSitesExpendShow, setIsSitesExpendShow] = React.useState(false);
    const [isClientCategory, setIsClientCategory] = React.useState(false);
    const [isKeywordsExpendShow, setIsKeywordsExpendShow] = React.useState(false);
    const [isProjectExpendShow, setIsProjectExpendShow] = React.useState(false);
    const [iscategoriesAndStatusExpendShow, setIscategoriesAndStatusExpendShow] = React.useState(false);
    const [isTeamMembersExpendShow, setIsTeamMembersExpendShow] = React.useState(false);
    const [isDateExpendShow, setIsDateExpendShow] = React.useState(false);
    const [isEveryOneShow, setIsEveryOneShow] = React.useState(false);
    const [isOnlyMeShow, setIsOnlyMeShow] = React.useState(false);

    const [collapseAll, setcollapseAll] = React.useState(true);
    const [iconIndex, setIconIndex] = React.useState(0);

    const [siteConfig, setSiteConfig] = React.useState([]);
    const [finalArray, setFinalArray] = React.useState([])
    const [updatedSmartFilter, setUpdatedSmartFilter] = React.useState(false)
    const [firstTimecallFilterGroup, setFirstTimecallFilterGroup] = React.useState(false)
    const [hideTimeEntryButton, setHideTimeEntryButton] = React.useState(0);
    const [timeEntryDataLocalStorage, setTimeEntryDataLocalStorage] = React.useState<any>(localStorage.getItem('timeEntryIndex'));
    //*******************************************************Project Section********************************************************************/
    const [ProjectManagementPopup, setProjectManagementPopup] = React.useState(false);
    const [ProjectSearchKey, setProjectSearchKey] = React.useState('');
    let [selectedProject, setSelectedProject] = React.useState([]);
    const [SearchedProjectData, setSearchedProjectData] = React.useState([]);
    const [AllProjectData, SetAllProjectData] = React.useState([]);
    const [AllProjectSelectedData, setAllProjectSelectedData] = React.useState([]);
    //*******************************************************Project Section End********************************************************************/

    //*******************************************************Date Section********************************************************************/
    const [selectedFilter, setSelectedFilter] = React.useState("");
    const [startDate, setStartDate] = React.useState<any>(null);
    const [endDate, setEndDate] = React.useState<any>(null);
    const [isCreatedDateSelected, setIsCreatedDateSelected] = React.useState(false);
    const [isModifiedDateSelected, setIsModifiedDateSelected] = React.useState(false);
    const [isDueDateSelected, setIsDueDateSelected] = React.useState(false);
    // const [preSet, setPreSet] = React.useState(false);
    //*******************************************************Date Section End********************************************************************/

    //*******************************************************Teams Section********************************************************************/
    const [isCreatedBy, setIsCreatedBy] = React.useState(false);
    const [isModifiedby, setIsModifiedby] = React.useState(false);
    const [isAssignedto, setIsAssignedto] = React.useState(false);
    const [isTeamLead, setIsTeamLead] = React.useState(false);
    const [isTeamMember, setIsTeamMember] = React.useState(false);
    const [isTodaysTask, setIsTodaysTask] = React.useState(false);
    const [isSelectAll, setIsSelectAll] = React.useState(false);
    // const [isWorkingThisWeek, setIsWorkingThisWeek] = React.useState(false);
    //*******************************************************Teams Section End********************************************************************/

    //*******************************************************Key Word Section********************************************************************/
    const [selectedKeyWordFilter, setKeyWordSelected] = React.useState("Allwords");
    const [selectedKeyDefultTitle, setSelectedKeyDefultTitle] = React.useState("Title");
    const [keyWordSearchTearm, setKeyWordSearchTearm] = React.useState("");
    //*******************************************************Key Word Section End********************************************************************/
    //*************************************************** Portfolio Items & Task Items selected ***************************************************************** */
    const [isPortfolioItems, setIsPortfolioItems] = React.useState(true);
    const [isTaskItems, setIsTaskItems] = React.useState(true);
    const [controlledVisible, setControlledVisible] = React.useState(false);
    const [feedbackArray, setfeedbackArray] = React.useState([]);
    const [showHoverTitle, setshowHoverTitle] = React.useState<any>();
    const [action, setAction] = React.useState("");
    //*************************************************** Portfolio Items & Task Items End ***************************************************************** */
    const [selectedFilterPanelIsOpen, setSelectedFilterPanelIsOpen] = React.useState(false);
    const [selectedFilterPanelIsOpenUpdate, setSelectedFilterPanelIsOpenUpdate] = React.useState(false);
    const [EveryoneSmartFavorites, setEveryoneSmartFavorites] = React.useState<any[]>([]);
    const [CreateMeSmartFavorites, setCreateMeSmartFavorites] = React.useState<any[]>([]);
    const [SmartFavoritesItemsQueryStringBased, setSmartFavoritesItemsQueryStringBased] = React.useState<any[]>([]);
    const [SmartFavoritesItemsQueryStringBasedBackup, setSmartFavoritesItemsQueryStringBasedBackup] = React.useState<any[]>([]);
    const [itemsQueryBasedCall, setItemsQueryBasedCall] = React.useState(false);
    const [updatedEditData, setUpdatedEditData] = React.useState({});
    ///// Year Range Using Piker ////////
    const [years, setYear] = React.useState([])
    const [months, setMonths] = React.useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",])
    React.useEffect(() => {
        const currentYear = new Date().getFullYear();
        const year: any = [];
        for (let i = 1990; i <= currentYear; i++) {
            year.push(i);
        }
        setYear(year);
    }, [])
    ///// Year Range Using Piker end////////

    const getTaskUsers = async () => {
        let web = new Web(ContextValue?.siteUrl);
        let taskUsers = [];
        let results = await web.lists
            .getById(ContextValue.TaskUsertListID)
            .items
            .select('Id', 'Role', 'SortOrder', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'AssingedToUser/Title', 'AssingedToUser/Id', "AssingedToUser/Name", 'UserGroupId', 'UserGroup/Id', "ItemType")
            // .filter('IsActive eq 1')
            .expand('AssingedToUser', 'UserGroup')
            .get();
        // setTaskUsers(results);
        for (let index = 0; index < results.length; index++) {
            let element = results[index];
            element.value = element.Id;
            element.label = element.Title;
            if (element.UserGroupId == undefined && element.Title != "QA" && element.Title != "Design") {
                element.values = [],
                    element.checked = [],
                    element.checkedObj = [],
                    element.expanded = []
                getChilds(element, results);
                taskUsers.push(element);
            }
        }
        taskUsers = taskUsers?.sort((elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder);
        setTaskUser(results);
        setTaskUsersData(taskUsers);
    }
    const getChilds = (item: any, items: any) => {
        for (let index = 0; index < items.length; index++) {
            let childItem = items[index];
            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                childItem.value = childItem.Id;
                childItem.label = childItem.Title;
                item.values.push(childItem)
                getChilds(childItem, items);
            }
        }
    }

    const GetSmartmetadata = async () => {
        let siteConfigSites: any = []
        let web = new Web(ContextValue?.siteUrl);
        let smartmetaDetails = await web.lists
            .getById(ContextValue.SmartMetadataListID)
            .items
            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', "Configurations", 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(4999)
            .expand('Parent')
            .get();

        smartmetaDetails?.map((newtest: any) => {
            // if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
            if (newtest.Title == "SDC Sites" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
                newtest.DataLoadNew = false;
            else if (newtest.TaxType == 'Sites') {
                siteConfigSites.push(newtest)
            }
            if (newtest?.TaxType == 'timesheetListConfigrations') {
                timeSheetConfig = newtest;
            }
        })
        if (smartmetaDetails.length > 0) {
            const catogryValue: any = {
                Title: "Other",
                TaxType: 'Categories',
                ParentID: 0,
                Id: 0,
            };
            smartmetaDetails.push(catogryValue);
        }
        if (siteConfigSites?.length > 0) {
            setSiteConfig(siteConfigSites)
        }
        setSmartmetaDataDetails(smartmetaDetails);
        smartTimeUseLocalStorage();
    }

    const loadAdminConfigurationsId = async (itemId: any) => {
        try {
            let configurationData: any[] = [];
            const resultsArray = await Promise.all([
                await web.lists
                    .getById(item?.ContextValue?.AdminconfigrationID)
                    .items.getById(parseInt(itemId)).select('Id', 'Title', 'Value', 'Key', 'Description', 'DisplayTitle', 'Configurations').get()
            ]);
            resultsArray.forEach((smart: any) => {
                if (smart.Configurations !== undefined) {
                    configurationData = JSON.parse(smart.Configurations);
                    configurationData.map((elem) => {
                        elem.Id = smart.Id;
                        if (elem.startDate != null && elem.startDate != undefined && elem.startDate != "") {
                            elem.startDate = new Date(elem.startDate);
                        }
                        if (elem.endDate != null && elem.endDate != undefined && elem.endDate != "") {
                            elem.endDate = new Date(elem.endDate);
                        }
                    })
                }
            });
            let allMasterTaskDataFlatLoadeViewBackup = JSON.parse(JSON.stringify(configurationData));
            setSmartFavoritesItemsQueryStringBasedBackup(allMasterTaskDataFlatLoadeViewBackup);
            let SmartFavoritesItemsQueryStringBasedTableConfigValue = [];
            SmartFavoritesItemsQueryStringBasedTableConfigValue.push(configurationData[0]?.smartFabBasedColumnsSetting);
            item?.setSmartFabBasedColumnsSetting(SmartFavoritesItemsQueryStringBasedTableConfigValue)
            setSmartFavoritesItemsQueryStringBased(configurationData);
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        if (item?.IsSmartfavoriteId != "" && item?.IsSmartfavoriteId != undefined && item?.IsSmartfavoriteId != null) {
            setFlatView(true);
            setUpdatedSmartFilter(true);
            loadAdminConfigurationsId(item?.IsSmartfavoriteId);
        } else {
            getTaskUsers();
            GetSmartmetadata();
        }
    }, [])
    React.useEffect(() => {
        if (smartmetaDataDetails.length > 0) {
            GetfilterGroups();
        }
    }, [smartmetaDataDetails])

    React.useEffect(() => {
        if (filterGroupsData[0]?.checked?.length > 0 && firstTimecallFilterGroup === true) {
            headerCountData();
            FilterDataOnCheck();
        }
    }, [filterGroupsData && firstTimecallFilterGroup]);

    React.useEffect(() => {
        if (SmartFavoritesItemsQueryStringBased.length > 0) {
            setFilterGroups((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.filterGroupsData);
            setFilterClintCatogryData((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.allFilterClintCatogryData);
            setAllStites((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.allStites);
            setSelectedProject((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.selectedProject);
            setStartDate((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.startDate);
            setEndDate((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.endDate);
            setIsCreatedBy((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.isCreatedBy);
            setIsModifiedby((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.isModifiedby);
            setIsAssignedto((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.isAssignedto);
            setIsTeamLead((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.isTeamLead);
            setIsTeamMember((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.isTeamMember);
            setIsTodaysTask((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.isTodaysTask);
            setSelectedFilter((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.selectedFilter);
            setIsCreatedDateSelected((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.isCreatedDateSelected);
            setIsModifiedDateSelected((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.isModifiedDateSelected);
            setIsDueDateSelected((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.isDueDateSelected);
            setTaskUsersData((prev: any) => SmartFavoritesItemsQueryStringBased[0]?.TaskUsersData);
            setItemsQueryBasedCall(true);
        }
    }, [SmartFavoritesItemsQueryStringBased]);

    React.useEffect(() => {
        if (filterGroupsData[0]?.checked?.length > 0 && itemsQueryBasedCall === true) {
            if (item?.LoadAllSiteTasksAllData && loadeAllData === false) {
                let CheckSatusGTNinty: any = filterGroupsData.filter((stat) => stat.Title === "Status")
                const checkCallData: any = CheckSatusGTNinty[0]?.checkedObj?.some((elem: any) => {
                    if (elem.Title === '90% Task completed' || elem.Title === '93% For Review' || elem.Title === '96% Follow-up later' || elem.Title === '99% Completed' || elem.Title === '99% Completed') {
                        return true
                    }
                    return false
                })
                if (checkCallData === true) {
                    item?.setLoaded(false);
                    fetchAllDataAboveNinty();
                } else {
                    if (AllSiteTasksDataLoadAll?.length > 0) {
                        allTastsData = [];
                        allTastsData = allTastsData.concat(AllSiteTasksDataLoadAll);
                    }
                    FilterDataOnCheck();
                    headerCountData();
                }
            } else {
                if (AllSiteTasksDataLoadAll?.length > 0) {
                    allTastsData = [];
                    allTastsData = allTastsData.concat(AllSiteTasksDataLoadAll);
                }
                FilterDataOnCheck();
                headerCountData();
            }
        }
    }, [itemsQueryBasedCall, filterGroupsData])
    const fetchAllDataAboveNinty = async () => {
        const fetchAllData = await item?.LoadAllSiteTasksAllData();
        if (fetchAllData != undefined) {
            setLoadeAllData(true);
            if (fetchAllData?.length > 0) {
                allTastsData = [];
                allTastsData = allTastsData.concat(fetchAllData);
            }
            FilterDataOnCheck();
            headerCountData();
        }
    }


    let filterGroups: any = [{ Title: 'Type', values: [], checked: [], checkedObj: [], expanded: [], selectAllChecked: true, ValueLength: 0 },
    // {
    //     Title: 'Task Type', values: [], checked: [], checkedObj: [], expanded: []
    // },
    // {
    //     Title: 'Client Category', values: [], checked: [], checkedObj: [], expanded: []
    // }, 
    {
        Title: 'Status', values: [], checked: [], checkedObj: [], expanded: [], ValueLength: 0
    }, {
        Title: 'Priority', values: [], checked: [], checkedObj: [], expanded: [], selectAllChecked: true, ValueLength: 0
    }, {
        Title: 'Categories', values: [], checked: [], checkedObj: [], expanded: [], selectAllChecked: false, ValueLength: 0
    }
        // , {
        //     Title: 'Portfolio Type', values: [], checked: [], checkedObj: [], expanded: []
        // }
    ];
    let portfolioTypeHeading: any = [];
    let AllSites: any = [];
    const clintCatogryData: any = [];
    const SortOrderFunction = (filterGroups: any) => {
        filterGroups.forEach((elem: any) => {
            return elem?.values?.sort((a: any, b: any) => a.SortOrder - b.SortOrder);
        });
    };
    const GetfilterGroups = () => {
        let SitesData: any = [];
        let ClientCategory: any = [];
        let clintCategoryGroupedData: any = [];
        let PriorityData: any = [];
        let PortfolioData: any = [];
        let PrecentComplete: any = [];
        let Categories: any = [];
        let Type: any = [];
        let portfolioTypeHeadingData: any = [];
        smartmetaDataDetails.forEach((element: any) => {
            element.label = element.Title;
            element.value = element.Id;
            if (element.TaxType == 'Task Types') {
                portfolioTypeHeadingData.push(element)
            }
            if (element.TaxType == 'Type') {
                portfolioTypeHeadingData.push(element)
            }
            if (element.TaxType == 'Task Types') {
                Type.push(element)
            }
            if (element.TaxType == 'Type') {
                Type.push(element)
            }
            if (element.TaxType == 'Sites' || element.TaxType == 'Sites Old') {
                SitesData.push(element);
            }
            if (element?.TaxType == 'Client Category') {
                ClientCategory.push(element);
            }
            if (element.TaxType == "Priority") {
                PriorityData.push(element);
            }
            if (element.TaxType == 'Percent Complete') {
                PrecentComplete.push(element);
            }
            if (element.TaxType == 'Categories') {
                Categories.push(element);
            }
        });
        PriorityData = PriorityData?.sort((elem1: any, elem2: any) => parseInt(elem2.SortOrder) - parseInt(elem1.SortOrder));
        Type = Type?.sort((elem1: any, elem2: any) => parseInt(elem1.SortOrder) - parseInt(elem2.SortOrder));
        ClientCategory?.forEach((elem: any) => {
            if (elem?.Title != 'Master Tasks' && (elem?.ParentID == 0 || (elem?.Parent != undefined && elem?.Parent?.Id == undefined))) {
                elem.values = [],
                    elem.checked = [],
                    elem.checkedObj = [],
                    elem.expanded = []
                clintCategoryGroupedData.push(elem);
                getChildsBasedOn(elem, ClientCategory);
            }
        })

        if (clintCategoryGroupedData.length > 0) {
            clintCategoryGroupedData.map((e: any) => {
                const catogryValue: any = {
                    "Title": e.Title,
                    "checkedObj": [],
                    "expanded": [],
                    "values": [],
                    "ValueLength": 0,
                };
                if (e.children !== undefined && e.children.length > 0) {
                    catogryValue.values = e.children.filter((child: any) => child.Id !== undefined);
                }
                catogryValue.ValueLength = countNestedChildren(e.children); // Count all nested children
                clintCatogryData.push(catogryValue);
            })
        }
        function countNestedChildren(children: any) {
            let count = 0;
            children?.forEach((child: any) => {
                count += 1; // Increment for the current child
                if (child.children && child.children.length > 0) {
                    count += countNestedChildren(child.children); // Recursively count nested children
                }
            });
            return count;
        }

        if (clintCatogryData?.length > 0) {
            clintCatogryData.forEach((elem: any) => {
                if (elem.Title === "Other") {
                    const Blank: any = { Id: 0, Title: "Blank", value: 0, Parent: { Id: 576, Title: "Other" }, TaxType: "Client Category", ParentId: 576, ParentID: null, ID: 0, label: "Blank", checked: true };
                    elem.values.push(Blank);
                    elem.ValueLength = elem.ValueLength + 1;
                }
            });
        }

        SitesData?.forEach((element: any) => {
            if (element.Title != 'Master Tasks' && (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined))) {
                element.values = [],
                    element.checked = [],
                    element.checkedObj = [],
                    // element.selectAllChecked = true,
                    element.expanded = []
                AllSites.push(element);
                getChildsSites(element, SitesData);
            }
        })
        portfolioTypeHeadingData?.forEach((element: any) => {
            if (element.Title != 'Master Tasks' && (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined))) {
                element.values = [],
                    element.checked = [],
                    element.checkedObj = [],
                    element.expanded = []
                portfolioTypeHeading.push(element);
                getChildsSites(element, portfolioTypeHeadingData);
            }
        })
        PrecentComplete = PrecentComplete?.sort((elem1: any, elem2: any) => elem1.SortOrder - elem2.SortOrder);
        PrecentComplete?.forEach((element: any) => {
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                filterGroups[1].ValueLength = PrecentComplete?.length;
                getChildsBasedOn(element, PrecentComplete);
                filterGroups[1].values.push(element);
            }
        })
        Type?.forEach((element: any) => {
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                element.selectAllChecked = true;
                filterGroups[0].ValueLength = Type?.length;
                getChildsBasedOn(element, Type);
                filterGroups[0].values.push(element);
            }
        })
        PriorityData?.forEach((element: any) => {
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                filterGroups[2].ValueLength = PriorityData?.length;
                getChildsBasedOn(element, PriorityData);
                filterGroups[2].values.push(element);
            }
        })

        Categories?.forEach((element: any) => {
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                filterGroups[3].ValueLength = Categories?.length;
                getChildsBasedOn(element, Categories);
                filterGroups[3].values.push(element);
            }
        })
        filterGroups.forEach((element: any, index: any) => {
            element.checkedObj = GetCheckedObject(element.values, element.checked)
        });
        AllSites?.forEach((element: any, index: any) => {
            element.checkedObj = GetCheckedObject(element.values, element.checked)
        });
        portfolioTypeHeading?.forEach((element: any, index: any) => {
            element.checkedObj = GetCheckedObject(element.values, element.checked)
        });
        clintCatogryData?.forEach((element: any, index: any) => {
            element.checkedObj = GetCheckedObject(element.values, element.checked)
        });
        setFilterClintCatogryData(clintCatogryData)
        setAllStites(AllSites);
        setPortfolioTypeHeading(portfolioTypeHeading);
        SortOrderFunction(filterGroups);
        setFilterGroups(filterGroups);
        filterGroupsDataBackup = JSON.parse(JSON.stringify(filterGroups));
        filterGroupData1 = JSON.parse(JSON.stringify(filterGroups));
        rerender();
        // getFilterInfo();
        if (filterGroups[0]?.checked?.length > 0) {
            setFirstTimecallFilterGroup(true);
        }
    }


    const getChildsSites = (item: any, items: any) => {
        for (let index = 0; index < items.length; index++) {
            let childItem = items[index];
            if (childItem.Parent != undefined && childItem.Parent.Id != undefined && parseInt(childItem.Parent.Id) == item.ID) {
                item.values = item.values === undefined ? [] : item.values;
                childItem.value = childItem.Id;
                childItem.label = childItem.Title;
                item.values.push(childItem)
                if (item.TaxType == 'Sites' || item.TaxType == 'Sites Old') {
                    if (childItem.Title == "Shareweb Old" || childItem.Title == "DRR" || childItem.Title == "Small Projects" || childItem.Title == "Offshore Tasks" || childItem.Title == "Health" || childItem.Title == "Gender" || childItem.Title == "QA" || childItem.Title == "DE" || childItem.Title == "Completed" || childItem.Title == "90%" || childItem.Title == "93%" || childItem.Title == "96%" || childItem.Title == "100%") {
                    }
                    else {
                        item.checked.push(childItem.Id);
                    }
                } else {
                    item.checked.push(childItem.Id);
                }
                // item.checked.push(childItem?.Id)
                getChildsSites(childItem, items);
            }
        }
    }
    const getChildsBasedOn = (item: any, items: any) => {
        item.children = [];
        for (let index = 0; index < items.length; index++) {
            let childItem = items[index];
            if (childItem.Parent != undefined && childItem.Parent.Id != undefined && parseInt(childItem.Parent.Id) == item.ID) {
                childItem.value = childItem.Id;
                childItem.label = childItem.Title;
                item.children.push(childItem);
                getChildsBasedOn(childItem, items);
            }
        }
        if (item.children.length == 0) {
            delete item.children;
        }
        if (item.TaxType == 'Percent Complete') {
            if (item.Title == "Completed" || item.Title == "90% Task completed" || item.Title == "93% For Review" || item.Title == "96% Follow-up later" || item.Title == "100% Closed" || item.Title == "99% Completed") {
            }
            else {
                filterGroups[1].checked.push(item.Id);
            }
        }
        if (item.TaxType == 'Priority') {
            filterGroups[2].checked.push(item.Id)
        }
        if (item.TaxType == 'Categories') {
            if (item.Title == "Draft") {

            } else {
                filterGroups[3].checked.push(item.Id)
            }
        }
        if (item.TaxType == 'Task Types' || item.TaxType == "Type") {
            filterGroups[0].checked.push(item.Id)
        }
    }
    const headerCountData = (() => {
        let filterInfo = '';
        let CategoriesandStatus = "";
        let sitesCount = "";
        let projectCount = "";
        let clientCategoryCount = "";
        let teamMembersCount = "";
        let dateCount = "";
        let CategoriesandStatusInfo: any = [];
        let sitesCountInfo: any = [];
        let projectCountInfo: any = [];
        let clientCategoryCountInfo: any = [];
        let teamMembersCountInfo: any = [];
        let dateCountInfo: any = [];
        if (filterGroupsData?.length > 0) {
            filterGroupsData?.forEach((element: any) => {
                if (element?.checked?.length > 0) {
                    if (element?.selectAllChecked === true || element?.checked?.length === element?.ValueLength) {
                        CategoriesandStatusInfo.push(element.Title + ':(' + "all" + ')')
                    } else {
                        CategoriesandStatusInfo.push(element.Title + ':(' + element.checked.length + ')')
                    }
                }
            });
            CategoriesandStatus = CategoriesandStatusInfo.join(' | ');
        }
        if (allStites?.length > 0) {
            allStites?.forEach((element: any) => {
                if (element?.checked?.length > 0) {
                    if (element?.selectAllChecked === true) {
                        sitesCountInfo.push(element.Title + ':(' + "all" + ')')
                    } else {
                        sitesCountInfo.push(element.Title + ':(' + element.checked.length + ')')
                    }
                }
            });
            sitesCount = sitesCountInfo.join(' | ');
        }

        if (allFilterClintCatogryData?.length > 0) {
            allFilterClintCatogryData?.forEach((element: any) => {
                if (element?.checked?.length > 0) {
                    if (element?.selectAllChecked === true || element?.checked?.length === element?.ValueLength) {
                        clientCategoryCountInfo.push(element.Title + ':(' + "all" + ')')
                    } else {
                        clientCategoryCountInfo.push(element.Title + ':(' + element.checked.length + ')')
                    }
                }
            });
            clientCategoryCount = clientCategoryCountInfo.join(' | ');
        }
        if (selectedProject?.length > 0) {
            projectCountInfo.push("Project" + ':(' + selectedProject?.length + ')')
            projectCount = projectCountInfo.join(' | ');
        }
        if (TaskUsersData?.length > 0) {
            TaskUsersData?.forEach((element: any) => {
                if (element?.checked?.length > 0) {
                    if (element?.selectAllChecked === true) {
                        teamMembersCountInfo.push(element.Title + ':(' + "all" + ')')
                    } else {
                        teamMembersCountInfo.push(element.Title + ':(' + element.checked.length + ')')
                    }
                }
            });
            teamMembersCount = teamMembersCountInfo.join(' | ');
        }
        let trueCount = 0;
        if (isCreatedDateSelected) {
            trueCount++;
        }
        if (isModifiedDateSelected) {
            trueCount++;
        }
        if (isDueDateSelected) {
            trueCount++;
        }
        if (trueCount > 0) {
            dateCountInfo.push("Date" + ':(' + trueCount + ')')
            dateCount = dateCountInfo.join(' | ');
        }
        setCategoriesandStatusInfo(CategoriesandStatus)
        setsitesCountInfo(sitesCount)
        setprojectCountInfo(projectCount)
        setclientCategoryCountInfo(clientCategoryCount)
        setteamMembersCountInfo(teamMembersCount)
        setdateCountInfo(dateCount)
    })
    React.useEffect(() => {
        headerCountData()
    }, [selectedProject, isCreatedDateSelected, isModifiedDateSelected, isDueDateSelected])

    const onCheck = async (checked: any, index: any, event: any) => {
        if (event == "filterSites") {
            let filterGroups = allStites;
            filterGroups[index].checked = checked;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, checked)
            // //// demo////
            if (filterGroups[index]?.values.length > 0) {
                const childrenLength = filterGroups[index]?.values?.reduce((total: any, obj: any) => total + (obj?.children?.length || 0), 0) + (filterGroups[index]?.values?.length ? filterGroups[index]?.values?.length : 0);
                filterGroups[index].selectAllChecked = childrenLength === checked?.length;
            }
            // ///end///
            setAllStites(filterGroups);
            rerender();

        } else if (event == "FilterCategoriesAndStatus") {
            let filterGroups = filterGroupsData;
            filterGroups[index].checked = checked;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, checked)
            // //// demo////
            if (filterGroups[index]?.values.length > 0) {
                const childrenLength = filterGroups[index]?.values?.reduce((total: any, obj: any) => total + (obj?.children?.length || 0), 0) + (filterGroups[index]?.values?.length ? filterGroups[index]?.values?.length : 0);
                filterGroups[index].selectAllChecked = childrenLength === checked?.length;
            }
            if (item?.LoadAllSiteTasksAllData && loadeAllData === false) {
                const checkCallData: any = filterGroups[index].checkedObj.some((elem: any) => {
                    if (elem.Title === '90% Task completed' || elem.Title === '93% For Review' || elem.Title === '96% Follow-up later' || elem.Title === '99% Completed' || elem.Title === '99% Completed') {
                        return true
                    }
                    return false
                })
                if (checkCallData === true) {
                    item?.setLoaded(false);
                  const fetchData= await item?.LoadAllSiteTasksAllData();
                  if(fetchData?.length===0){
                    item?.setLoaded(true);
                  }
                    setLoadeAllData(true);
                }
            }
            // ///end///
            setFilterGroups(filterGroups);
            rerender();

        } else if (event == "FilterTeamMembers") {
            let filterGroups = TaskUsersData;
            filterGroups[index].checked = checked;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, checked)
            // //// demo////
            if (filterGroups[index]?.values.length > 0) {
                const childrenLength = filterGroups[index]?.values?.reduce((total: any, obj: any) => total + (obj?.children?.length || 0), 0) + (filterGroups[index]?.values?.length ? filterGroups[index]?.values?.length : 0);
                filterGroups[index].selectAllChecked = childrenLength === checked?.length;
            }
            // ///end///
            handleTeamsFilterCreatedModifiAssign(event);
            setTaskUsersData(filterGroups);
            rerender();

        } else if (event == "ClintCatogry") {
            let filterGroups = allFilterClintCatogryData;
            filterGroups[index].checked = checked;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, checked)
            // //// demo////
            if (filterGroups[index]?.values.length > 0) {
                const childrenLength = filterGroups[index]?.values?.reduce((total: any, obj: any) => total + (obj?.children?.length || 0), 0) + (filterGroups[index]?.values?.length ? filterGroups[index]?.values?.length : 0);
                filterGroups[index].selectAllChecked = childrenLength === checked?.length;
            }
            // ///end///
            setFilterClintCatogryData((prev: any) => filterGroups);
            rerender();
        }
        rerender()
        headerCountData();
    }
    const handleTeamsFilterCreatedModifiAssign = (event: any) => {
        if (
            !isCreatedBy &&
            !isModifiedby &&
            !isAssignedto
        ) {
            switch (event) {
                case "FilterTeamMembers":
                    setIsCreatedBy(true);
                    setIsModifiedby(true);
                    setIsAssignedto(true);
                    break;
                default:
                    setIsCreatedBy(false);
                    setIsModifiedby(false);
                    setIsAssignedto(false);
                    break;
            }
        }
    };
    const handleSelectAllChangeTeamSection = () => {
        setIsSelectAll(!isSelectAll);
        setIsCreatedBy(!isSelectAll);
        setIsModifiedby(!isSelectAll);
        setIsAssignedto(!isSelectAll);
        setIsTeamLead(!isSelectAll);
        setIsTeamMember(!isSelectAll);
        setIsTodaysTask(!isSelectAll);
    };

    const GetCheckedObject = (arr: any, checked: any) => {
        let checkObj: any = [];
        checked?.forEach((value: any) => {
            arr?.forEach((element: any) => {
                if (value == element.Id) {
                    checkObj.push({
                        Id: element.ItemType === "User" ? element?.AssingedToUser?.Id : element.Id,
                        Title: element.Title,
                        TaxType: element.TaxType ? element.TaxType : ''
                    })
                }
                if (element.children != undefined && element.children.length > 0) {
                    element.children.forEach((chElement: any) => {
                        if (value == chElement.Id) {
                            checkObj.push({
                                Id: chElement.ItemType === "User" ? chElement?.AssingedToUser?.Id : chElement.Id,
                                Title: chElement.Title,
                                TaxType: element.TaxType ? element.TaxType : ''
                            })
                        }
                    });
                }
            });
        });
        return checkObj;
    }
    const handleSelectAll = (index: any, selectAllChecked: any, event: any) => {
        if (event == "filterSites") {
            let filterGroups = [...allStites];
            filterGroups[index].selectAllChecked = selectAllChecked;
            let selectedId: any = [];
            filterGroups[index].values.forEach((item: any) => {
                item.checked = selectAllChecked;
                if (selectAllChecked) {
                    selectedId.push(item?.Id)
                }
                item?.children?.forEach((chElement: any) => {
                    if (selectAllChecked) {
                        selectedId.push(chElement?.Id)
                    }
                });
            });
            filterGroups[index].checked = selectedId;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, selectedId);
            setAllStites((prev: any) => filterGroups);
            rerender()
        } else if (event == "FilterCategoriesAndStatus") {
            let filterGroups = [...filterGroupsData];
            filterGroups[index].selectAllChecked = selectAllChecked;
            let selectedId: any = [];
            filterGroups[index].values.forEach((item: any) => {
                item.checked = selectAllChecked;
                if (selectAllChecked) {
                    selectedId.push(item?.Id)
                }
                item?.children?.forEach((chElement: any) => {
                    if (selectAllChecked) {
                        selectedId.push(chElement?.Id)
                    }
                });
            });
            filterGroups[index].checked = selectedId;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, selectedId);
            setFilterGroups((prev: any) => filterGroups);
            rerender()
        } else if (event == "FilterTeamMembers") {
            let filterGroups = [...TaskUsersData];
            filterGroups[index].selectAllChecked = selectAllChecked;
            let selectedId: any = [];
            filterGroups[index].values.forEach((item: any) => {
                item.checked = selectAllChecked;
                if (selectAllChecked) {
                    selectedId.push(item?.Id)
                }
                item?.children?.forEach((chElement: any) => {
                    if (selectAllChecked) {
                        selectedId.push(chElement?.Id)
                    }
                });
            });
            filterGroups[index].checked = selectedId;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, selectedId);
            setTaskUsersData((prev: any) => filterGroups);
            rerender()
        } else if (event == "ClintCatogry") {
            let filterGroups = [...allFilterClintCatogryData];
            filterGroups[index].selectAllChecked = selectAllChecked;
            let selectedId: any = [];
            filterGroups[index].values.forEach((item: any) => {
                item.checked = selectAllChecked;
                if (selectAllChecked) {
                    selectedId.push(item?.Id)
                }
                item?.children?.forEach((chElement: any) => {
                    if (selectAllChecked) {
                        selectedId.push(chElement?.Id)
                    }
                });
            });
            filterGroups[index].checked = selectedId;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, selectedId);
            setFilterClintCatogryData((prev: any) => filterGroups);
            rerender()
        }
        // else if (event === "ClintCatogry") {
        //     const filterGroups = [...allFilterClintCatogryData];
        //     const selectedIds: any[] = [];

        //     const processItem = (item: any) => {
        //         item.checked = selectAllChecked;
        //         if (selectAllChecked) {
        //             selectedIds.push(item?.Id);
        //         }
        //         item?.children?.forEach((chElement: any) => {
        //             processItem(chElement);
        //         });
        //     };

        //     filterGroups[index].selectAllChecked = selectAllChecked;
        //     filterGroups[index]?.values?.forEach((item: any) => {
        //         processItem(item);
        //     });
        //     filterGroups[index].checked = selectedIds;
        //     filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index]?.values, selectedIds);
        //     setFilterClintCatogryData(filterGroups);
        //     rerender();
        // }
        headerCountData();
    }
    const FilterDataOnCheck = function () {
        let portFolio: any[] = [];
        let site: any[] = [];
        let type: any[] = [];
        let teamMember: any[] = [];
        let priorityType: any[] = [];
        let percentComplete: any[] = [];
        let clientCategory: any[] = [];
        let Categories: any[] = [];
        filterGroupsData.forEach(function (filter) {
            if (filter.Title === 'Portfolio Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (port: any) { return portFolio.push(port); });
            }
            else if (filter.Title === 'Task Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (elem1: any) { return type.push(elem1); });
            }

            if (filter.Title === 'Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter?.checkedObj?.map((elem: any) => {
                    if (elem.TaxType === 'Task Types') {
                        portFolio.push(elem);
                    } else if (elem.TaxType === 'Type') {
                        type.push(elem);
                    }
                })
            }
            else if (filter.Title === 'Categories' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (elem2: any) { return Categories.push(elem2); });
            }
            else if (filter.Title === 'Priority' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (elem3: any) {
                    if (elem3.Title != '(1) High' && elem3.Title != '(2) Normal' && elem3.Title != '(3) Low') {
                        elem3.Title = parseInt(elem3.Title);
                    }
                    priorityType.push(elem3);
                });
            }
            else if (filter.Title === 'Status' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (elem4: any) {
                    if (elem4.Title) {
                        const match = elem4.Title.match(/(\d+)%/);
                        if (match) {
                            elem4.TaskStatus = parseInt(match[1]);
                        }
                    }
                    return percentComplete.push(elem4);
                });
            }
        });
        if (allFilterClintCatogryData.length > 0) {
            clientCategory = allFilterClintCatogryData.reduce((acc, item) => [...acc, ...item.checkedObj], []);
        }
        if (allStites.length > 0) {
            site = allStites.reduce((acc, item) => [...acc, ...item.checkedObj], []);
        }
        if (TaskUsersData.length > 0) {
            teamMember = TaskUsersData.reduce((acc, item) => [...acc, ...item.checkedObj], []);
            if (isCreatedBy === true) { teamMember.push(isCreatedBy) } else if (isModifiedby === true) { teamMember.push(isModifiedby) } else if (isAssignedto === true) { teamMember.push(isAssignedto) }
        }
        let filteredMasterTaskData: any = []
        if (portFolio.length > 0) {
            filteredMasterTaskData = allMasterTasksData.filter((data: any) =>
                updatedCheckMatch(data, 'Item_x0020_Type', 'Title', portFolio) &&
                // updatedCheckMatch(data, 'ClientCategory', 'Title', clientCategory) &&
                updatedCheckClintCategoryMatch(data, clientCategory) &&
                updatedCheckTeamMembers(data, teamMember) &&
                updatedKeyWordData(data, keyWordSearchTearm) &&
                updatedCheckDateSection(data, startDate, endDate)
            );
        }
        let filteredTaskData: any = [];
        if (type.length > 0) {
            filteredTaskData = allTastsData.filter((data: any) =>
                updatedCheckMatch(data, 'siteType', 'Title', site) &&
                updatedCheckTaskType(data, type) &&
                updatedCheckProjectMatch(data, selectedProject) &&
                updatedCheckMatch(data, 'percentCompleteValue', 'TaskStatus', percentComplete) &&
                // updatedCheckMatch(data, 'ClientCategory', 'Title', clientCategory) &&
                updatedCheckClintCategoryMatch(data, clientCategory) &&
                updatedCheckCategoryMatch(data, Categories) &&
                updatedCheckTeamMembers(data, teamMember) &&
                updatedKeyWordData(data, keyWordSearchTearm) &&
                updatedCheckDateSection(data, startDate, endDate) &&
                updatedCheckPriority(data, priorityType)
            );
        }
        let allFinalResult = filteredMasterTaskData.concat(filteredTaskData);
        if(allFinalResult?.length==0){
            item?.setLoaded(true)
        }
        setFinalArray(allFinalResult);
        setFirstTimecallFilterGroup(false);
        setItemsQueryBasedCall(false);
        console.log(filteredMasterTaskData);
        console.log(filteredTaskData);
    };
    const updatedCheckClintCategoryMatch = (data: any, clientCategory: any) => {
        try {
            if (clientCategory.length === 0) {
                return true;
            }
            if (data?.ClientCategory?.length > 0 && data?.ClientCategory != undefined && data?.ClientCategory != null) {
                let result = data?.ClientCategory?.some((item: any) => clientCategory.some((filter: any) => filter.Title === item.Title));
                if (result === true) {
                    return true;
                }
            } else {
                let result = clientCategory.some((filter: any) => filter.Title === "Blank" && data?.ClientCategory?.length == 0)
                if (result === true) {
                    return true;
                }
            }
            return false;
        } catch (error) {

        }
    };
    const updatedCheckMatch = (data: any, ItemProperty: any, FilterProperty: any, filterArray: any) => {
        try {
            if (filterArray.length === 0) {
                return true;
            }
            if (Array.isArray(data[ItemProperty])) {
                return data[ItemProperty]?.some((item: any) => filterArray.some((filter: any) => filter.Title === item.Title));
            } else {
                return filterArray.some((filter: any) => filter[FilterProperty] === data[ItemProperty]);
            }
        } catch (error) {

        }
    };

    const updatedCheckCategoryMatch = (data: any, Categories: any) => {
        try {
            if (Categories.length === 0) {
                return true;
            }
            if (data?.TaskCategories?.length > 0 && data?.TaskCategories != undefined && data?.TaskCategories != null) {
                let result = data?.TaskCategories?.some((item: any) => Categories.some((filter: any) => filter.Title === item.Title));
                if (result === true) {
                    return true;
                }
            } else {
                let result = Categories.some((filter: any) => filter.Title === "Other" && data?.Categories === null && data?.TaskCategories?.length == 0)
                if (result === true) {
                    return true;
                }
            }
            return false;
        } catch (error) {

        }
    };


    const updatedCheckProjectMatch = (data: any, selectedProject: any) => {
        try {
            if (selectedProject?.length === 0) {
                return true;
            }
            if (data?.Project) {
                return selectedProject.some((value: any) => data?.Project?.Id === value.Id);
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };
    const updatedCheckTeamMembers = (data: any, teamMembers: any) => {
        try {
            if (teamMembers.length === 0) {
                return true;
            }
            if (isCreatedBy === true) {
                let result = teamMembers.some((member: any) => member.Title === data?.Author?.Title?.replace(/\s+/g, ' '));
                if (result === true) {
                    return true;
                }
            }
            if (isModifiedby === true) {
                let result = teamMembers.some((member: any) => member.Title === data?.Editor?.Title?.replace(/\s+/g, ' '));
                if (result === true) {
                    return true;
                }
            }
            if (isAssignedto === true && isTodaysTask === false) {
                if (data?.AssignedTo.length > 0) {
                    // let result = data?.AssignedTo?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ')));
                    let result = data?.AssignedTo?.some((elem0: any) => teamMembers.some((filter: any) => filter?.Id === elem0?.Id));
                    if (result === true) {
                        return true;
                    }
                }

            }
            if (isTeamLead === true) {
                if (data?.ResponsibleTeam.length > 0) {
                    // let result = data?.ResponsibleTeam?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ')));
                    let result = data?.ResponsibleTeam?.some((elem: any) => teamMembers.some((filter: any) => filter?.Id === elem?.Id));

                    if (result === true) {
                        return true;
                    }
                }
            }
            if (isTeamMember === true) {
                if (data?.TeamMembers?.length > 0) {
                    // let result = data?.TeamMembers?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ')));
                    let result = data?.TeamMembers?.some((elem1: any) => teamMembers.some((filter: any) => filter?.Id === elem1?.Id));
                    if (result === true) {
                        return true;
                    }
                }
            }
            if (isTodaysTask === true && isAssignedto === true || isTodaysTask === true && isAssignedto === false) {
                if (data?.IsTodaysTask === true) {
                    // let result = data?.AssignedTo?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ') && data?.IsTodaysTask === true));
                    let result = data?.AssignedTo?.some((elem2: any) => teamMembers.some((filter: any) => filter?.Id === elem2?.Id && data?.IsTodaysTask === true));
                    if (result === true) {
                        return true;
                    }
                }
            }
            if (isCreatedBy === false && isModifiedby === false && isAssignedto === false && isTeamMember === false && isTeamLead === false && isTodaysTask === false) {
                let result = data?.TeamLeaderUser?.some((elem3: any) => teamMembers.some((filter: any) => filter?.Id === elem3?.Id));
                if (result === true) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const updatedCheckTaskType = (data: any, type: any) => {
        try {
            if (type?.length === 0) {
                return true;
            }
            if (data?.TaskType) {
                return type.some((value: any) => data?.TaskType?.Title === value.Title);
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };
    const updatedCheckPriority = (data: any, priorityType: any) => {
        try {
            if (priorityType?.length === 0) {
                return true;
            }
            if (data.Priority !== undefined && data.Priority !== '' && data.Priority !== null) {
                return priorityType.some((value: any) => value.Title === data.Priority || value.Title === data.PriorityRank);
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    const updatedKeyWordData = (data: any, keyWordSearchTearm: any) => {
        try {
            if (keyWordSearchTearm?.length === 0) {
                return true;
            }
            const cellValue: any = String(data.Title).toLowerCase();
            keyWordSearchTearm = keyWordSearchTearm.replace(/\s+/g, " ").trim().toLowerCase();
            if (selectedKeyWordFilter === "Allwords") {
                let found = true;
                let a = keyWordSearchTearm?.split(" ")
                for (let item of a) {
                    if (!cellValue.split(" ").some((elem: any) => elem === item)) {
                        found = false;
                    }
                }
                return found
            } else if (selectedKeyWordFilter === "Anywords") {
                for (let item of keyWordSearchTearm.split(" ")) {
                    if (cellValue.includes(item)) return true;
                }
                return false;
            } else if (selectedKeyWordFilter === "ExactPhrase") {
                return cellValue.includes(keyWordSearchTearm);
            }
        } catch (error) {

        }
    };
    const updatedCheckDateSection = (data: any, startDate: any, endDate: any) => {
        try {
            if (startDate === null && endDate === null) {
                return true;
            }
            startDate = startDate.setHours(0, 0, 0, 0);
            endDate = endDate.setHours(0, 0, 0, 0);
            if (isCreatedDateSelected === true) {
                let result = (data?.serverCreatedDate && data.serverCreatedDate >= startDate && data.serverCreatedDate <= endDate);
                if (result === true) {
                    return true;
                }
            }
            if (isModifiedDateSelected === true) {
                let result = (data?.serverModifiedDate && data.serverModifiedDate >= startDate && data.serverModifiedDate <= endDate);
                if (result === true) {
                    return true;
                }
            }
            if (isDueDateSelected === true) {
                if (data?.serverDueDate != undefined) {
                    let result = (data?.serverDueDate && data.serverDueDate >= startDate && data.serverDueDate <= endDate);
                    if (result === true) {
                        return true;
                    }
                }
            }
            if (isCreatedDateSelected === false && isModifiedDateSelected === false && isDueDateSelected === false) {
                if (data?.serverDueDate != undefined || data.serverModifiedDate != undefined || data.serverCreatedDate != undefined) {
                    let result = ((data?.serverDueDate && data.serverDueDate >= startDate && data.serverDueDate <= endDate) || (data?.serverModifiedDate && data.serverModifiedDate >= startDate && data.serverModifiedDate <= endDate)
                        || (data?.serverCreatedDate && data.serverCreatedDate >= startDate && data.serverCreatedDate <= endDate));
                    if (result === true) {
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const ClearFilter = function () {
        if (item?.IsSmartfavoriteId === "") {
            item?.setLoaded(false);
            if (TaskUsersData) {
                let userResetData = TaskUsersData.map((elem) => {
                    elem.checked = [];
                    elem.checkedObj = [];
                    return elem; // Return the modified element
                });
                setTaskUsersData(userResetData);
            }
            getTaskUsers();
            setSelectedProject([])
            setKeyWordSearchTearm("");
            setKeyWordSelected("Allwords");
            setIsCreatedBy(false)
            setIsModifiedby(false)
            setIsAssignedto(false)
            setSelectedFilter("")
            setStartDate(null)
            setEndDate(null)
            setIsCreatedDateSelected(false)
            setIsModifiedDateSelected(false)
            setIsDueDateSelected(false)
            GetfilterGroups();
            setUpdatedSmartFilter(false);
            setFinalArray([]);
            setFlatView(false);
            setIsTeamLead(false);
            setIsTeamMember(false);
            setIsTodaysTask(false);
            setcollapseAll(true);
            setIconIndex(0)
            setIsSitesExpendShow(false);
            setIsClientCategory(false)
            setIsProjectExpendShow(false);
            setIsKeywordsExpendShow(false)
            setIscategoriesAndStatusExpendShow(false);
            setIsTeamMembersExpendShow(false);
            setIsDateExpendShow(false);
            setIsSmartfilter(false);
            item?.setSmartFabBasedColumnsSetting([]);
            // setPreSet(false);
        } else {
            item?.setLoaded(false);
            setFlatView(true);
            setcollapseAll(true);
            setIconIndex(0)
            setIsSitesExpendShow(false);
            setIsClientCategory(false)
            setIsProjectExpendShow(false);
            setIsKeywordsExpendShow(false)
            setIscategoriesAndStatusExpendShow(false);
            setIsTeamMembersExpendShow(false);
            setIsDateExpendShow(false);
            setIsSmartfilter(false);
            // setItemsQueryBasedCall(false);
            loadAdminConfigurationsId(item?.IsSmartfavoriteId);
            item?.setSmartFabBasedColumnsSetting([])
            rerender();
        }
    };
    const UpdateFilterData = (event: any) => {
        if (event === "udateClickTrue") {
            if (AllSiteTasksDataLoadAll?.length > 0) {
                allTastsData = [];
                allTastsData = allTastsData.concat(AllSiteTasksDataLoadAll);
            }
            item?.setLoaded(false);
            setUpdatedSmartFilter(true);
            FilterDataOnCheck();
        } else if (event === "udateClickFalse" && updatedSmartFilter === true) {
            item?.setLoaded(false);
            setUpdatedSmartFilter(true);
            FilterDataOnCheck();
        } else if (event === "udateClickFalse" && updatedSmartFilter === false) {
            item?.setLoaded(false);
            FilterDataOnCheck();
        }
    };

    const showSmartFilter = (value: any) => {
        if (value == "isSitesExpendShow") {
            if (isSitesExpendShow == true) {
                setIsSitesExpendShow(false)

            } else {
                setIsSitesExpendShow(true)

            }
        }
        if (value === "isClientCategory") {
            if (isClientCategory == true) {
                setIsClientCategory(false)

            } else {
                setIsClientCategory(true)

            }
        }
        if (value == "isKeywordsExpendShow") {
            if (isKeywordsExpendShow == true) {
                setIsKeywordsExpendShow(false)

            } else {
                setIsKeywordsExpendShow(true)

            }
        }

        if (value == "isProjectExpendShow") {
            if (isProjectExpendShow == true) {
                setIsProjectExpendShow(false)

            } else {
                setIsProjectExpendShow(true)

            }
        }
        if (value == "iscategoriesAndStatusExpendShow") {
            if (iscategoriesAndStatusExpendShow == true) {
                setIscategoriesAndStatusExpendShow(false)

            } else {
                setIscategoriesAndStatusExpendShow(true)

            }
        }
        if (value == "isTeamMembersExpendShow") {
            if (isTeamMembersExpendShow == true) {
                setIsTeamMembersExpendShow(false)

            } else {
                setIsTeamMembersExpendShow(true)

            }

        }
        if (value == "isDateExpendShow") {
            if (isDateExpendShow == true) {
                setIsDateExpendShow(false)
            } else {
                setIsDateExpendShow(true)
            }
        }
        if (value == "isEveryOneShow") {
            if (isEveryOneShow == true) {
                setIsEveryOneShow(false)
            } else {
                setIsEveryOneShow(true)
            }
        }
        if (value == "isOnlyMeShow") {
            if (isOnlyMeShow == true) {
                setIsOnlyMeShow(false)
            } else {
                setIsOnlyMeShow(true)
            }
        }
    }
    const toggleAllExpendCloseUpDown = (iconIndex: any) => {
        if (iconIndex == 0) {
            setcollapseAll(false);
            setIsSitesExpendShow(false);
            setIsClientCategory(false)
            setIsProjectExpendShow(false)
            setIsKeywordsExpendShow(false)
            setIscategoriesAndStatusExpendShow(false);
            setIsTeamMembersExpendShow(false);
            setIsDateExpendShow(false);
            setIsSmartfilter(false);
        } else if (iconIndex == 1) {
            setcollapseAll(false);
            setIsSitesExpendShow(true);
            setIsClientCategory(true)
            setIsProjectExpendShow(true)
            setIsKeywordsExpendShow(true)
            setIscategoriesAndStatusExpendShow(true);
            setIsTeamMembersExpendShow(true);
            setIsDateExpendShow(true);
            setIsSmartfilter(true);
        } else if (iconIndex == 2) {
            setcollapseAll(false);
            setIsSitesExpendShow(false);
            setIsClientCategory(false)
            setIsProjectExpendShow(false)
            setIsKeywordsExpendShow(false)
            setIscategoriesAndStatusExpendShow(false);
            setIsTeamMembersExpendShow(false);
            setIsDateExpendShow(false);
            setIsSmartfilter(false);

        } else {
            setcollapseAll(true);
            setIsSitesExpendShow(false);
            setIsClientCategory(false)
            setIsProjectExpendShow(false);
            setIsKeywordsExpendShow(false)
            setIscategoriesAndStatusExpendShow(false);
            setIsTeamMembersExpendShow(false);
            setIsDateExpendShow(false);
            setIsSmartfilter(false);
        }
    };

    const toggleIcon = () => {
        setIconIndex((prevIndex) => (prevIndex + 1) % 4);
    };
    const icons = [
        <AiOutlineUp className='upSizeIcon' style={{ color: `${portfolioColor}`, width: '16px', height: "16px" }} />,
        <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />,
        <SlArrowDown style={{ color: `${portfolioColor}`, width: '12px' }} />,
        <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />,
    ];

    //*************************************************************smartTimeTotal*********************************************************************/
    const timeEntryIndex: any = {};
    const smartTimeTotal = async () => {
        item?.setLoaded(false);
        let AllTimeEntries = [];
        if (timeSheetConfig?.Id !== undefined) {
            AllTimeEntries = await globalCommon.loadAllTimeEntry(timeSheetConfig);
        }
        let allSites = smartmetaDataDetails.filter((e) => e.TaxType === "Sites")
        AllTimeEntries?.forEach((entry: any) => {
            allSites.forEach((site) => {
                const taskTitle = `Task${site.Title}`;
                const key = taskTitle + entry[taskTitle]?.Id
                if (entry.hasOwnProperty(taskTitle) && entry.AdditionalTimeEntry !== null && entry.AdditionalTimeEntry !== undefined) {
                    if (entry[taskTitle].Id === 168) {
                        console.log(entry[taskTitle].Id);
                    }
                    const additionalTimeEntry = JSON.parse(entry.AdditionalTimeEntry);
                    let totalTaskTime = additionalTimeEntry?.reduce((total: any, time: any) => total + parseFloat(time.TaskTime), 0);
                    let timeSheetsDescriptionSearch = additionalTimeEntry?.reduce((accumulator: any, entry: any) => `${accumulator} ${entry?.Description?.replace(/(<([^>]+)>|\n)/gi, "").trim()}`, "").trim();
                    if (timeEntryIndex.hasOwnProperty(key)) {
                        timeEntryIndex[key].TotalTaskTime += totalTaskTime;
                        timeEntryIndex[key].timeSheetsDescriptionSearch = (timeEntryIndex[key]?.timeSheetsDescriptionSearch || '') + ' ' + timeSheetsDescriptionSearch;
                    } else {
                        timeEntryIndex[`${taskTitle}${entry[taskTitle]?.Id}`] = {
                            ...entry[taskTitle],
                            TotalTaskTime: totalTaskTime,
                            siteType: site.Title,
                            timeSheetsDescriptionSearch: timeSheetsDescriptionSearch
                        };
                    }
                }
            });
        });
        allTastsData?.map((task: any) => {
            task.TotalTaskTime = 0;
            task.timeSheetsDescriptionSearch = "";
            const key = `Task${task?.siteType + task.Id}`;
            if (timeEntryIndex.hasOwnProperty(key) && timeEntryIndex[key]?.Id === task.Id && timeEntryIndex[key]?.siteType === task.siteType) {
                // task.TotalTaskTime = timeEntryIndex[key]?.TotalTaskTime;
                task.TotalTaskTime = timeEntryIndex[key]?.TotalTaskTime % 1 != 0 ? parseFloat(timeEntryIndex[key]?.TotalTaskTime?.toFixed(2)) : timeEntryIndex[key]?.TotalTaskTime;
                task.timeSheetsDescriptionSearch = timeEntryIndex[key]?.timeSheetsDescriptionSearch;
            }
        })
        if (timeEntryIndex) {
            const dataString = JSON.stringify(timeEntryIndex);
            localStorage.setItem('timeEntryIndex', dataString);
        }
        console.log("timeEntryIndex", timeEntryIndex)
        UpdateFilterData("udateClickFalse");
        return allTastsData;
    };

    const smartTimeUseLocalStorage = () => {
        if (timeEntryDataLocalStorage?.length > 0) {
            const timeEntryIndexLocalStorage = JSON.parse(timeEntryDataLocalStorage)
            allTastsData?.map((task: any) => {
                task.TotalTaskTime = 0;
                task.timeSheetsDescriptionSearch = "";
                const key = `Task${task?.siteType + task.Id}`;
                if (timeEntryIndexLocalStorage.hasOwnProperty(key) && timeEntryIndexLocalStorage[key]?.Id === task.Id && timeEntryIndexLocalStorage[key]?.siteType === task.siteType) {
                    // task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime;
                    task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime % 1 != 0 ? parseFloat(timeEntryIndexLocalStorage[key]?.TotalTaskTime?.toFixed(2)) : timeEntryIndexLocalStorage[key]?.TotalTaskTime;
                    task.timeSheetsDescriptionSearch = timeEntryIndexLocalStorage[key]?.timeSheetsDescriptionSearch;
                }
            })
            console.log("timeEntryIndexLocalStorage", timeEntryIndexLocalStorage)
            FilterDataOnCheck();
            return allTastsData;
        }
    };
    //*************************************************************smartTimeTotal End*********************************************************************/
    /// **************** CallBack Part *********************///
    React.useEffect(() => {
        if (updatedSmartFilter === true) {
            smartFiltercallBackData(finalArray, updatedSmartFilter, smartTimeTotal, flatView)
        } else if (updatedSmartFilter === false) {
            smartFiltercallBackData(finalArray, updatedSmartFilter, smartTimeTotal, flatView)
        }
    }, [finalArray])
    //*************************************************************Date Sections*********************************************************************/
    React.useEffect(() => {
        const currentDate: any = new Date();
        switch (selectedFilter) {
            case "today":
                setStartDate(currentDate);
                setEndDate(currentDate);
                break;
            case "yesterday":
                const yesterday = new Date(currentDate);
                yesterday.setDate(currentDate.getDate() - 1);
                setStartDate(yesterday);
                setEndDate(yesterday);
                break;
            case "thisweek":
                const dayOfWeek = currentDate.getDay(); // Get the current day of the week (0 for Sunday, 1 for Monday, etc.)
                const startDate = new Date(currentDate); // Create a copy of the current date
                // Calculate the number of days to subtract to reach the previous Monday
                const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                startDate.setDate(currentDate.getDate() - daysToSubtract);
                setStartDate(startDate);
                setEndDate(currentDate);
                break;
            case "last7days":
                const last7DaysStartDate = new Date(currentDate);
                last7DaysStartDate.setDate(currentDate.getDate() - 6);
                setStartDate(last7DaysStartDate);
                setEndDate(currentDate);
                break;
            case "thismonth":
                const monthStartDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    1
                );
                setStartDate(monthStartDate);
                setEndDate(currentDate);
                break;
            case "last30days":
                const last30DaysEndDate: any = new Date(currentDate);
                last30DaysEndDate.setDate(currentDate.getDate() - 1);
                const last30DaysStartDate = new Date(last30DaysEndDate);
                last30DaysStartDate.setDate(last30DaysEndDate.getDate() - 30);
                setStartDate(last30DaysStartDate);
                setEndDate(last30DaysEndDate);
                break;
                case "last3months":
                    const lastMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                    const last3MonthsStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1); 
                    setStartDate(last3MonthsStartDate);
                    setEndDate(lastMonthEndDate);
                    break;
            case "thisyear":
                const yearStartDate = new Date(currentDate.getFullYear(), 0, 1);
                setStartDate(yearStartDate);
                setEndDate(currentDate);
                break;
            case "lastyear":
                const lastYearStartDate = new Date(currentDate.getFullYear() - 1, 0, 1);
                const lastYearEndDate = new Date(currentDate.getFullYear() - 1, 11, 31);
                setStartDate(lastYearStartDate);
                setEndDate(lastYearEndDate);
                break;
            case "Pre-set":
                let storedDataStartDate: any
                let storedDataEndDate: any
                try {
                    storedDataStartDate = JSON.parse(localStorage.getItem('startDate'));
                    storedDataEndDate = JSON.parse(localStorage.getItem('endDate'))
                } catch (error) {

                }
                if (storedDataStartDate && storedDataStartDate != null && storedDataStartDate != "Invalid Date" && storedDataEndDate && storedDataEndDate != null && storedDataEndDate != "Invalid Date") {
                    setStartDate(new Date(storedDataStartDate));
                    setEndDate(new Date(storedDataEndDate));
                }
                break;
            default:
                setStartDate(null);
                setEndDate(null);
                break;
        }
    }, [selectedFilter]);

    const handleDateFilterChange = (event: any) => {
        setSelectedFilter(event.target.value);
        // setPreSet(false);
        // rerender();
        if (
            !isCreatedDateSelected &&
            !isModifiedDateSelected &&
            !isDueDateSelected
        ) {
            switch (event.target.value) {
                case "today": case "yesterday": case "thisweek": case "last7days":
                case "thismonth": case "last30days": case "last3months": case "thisyear": case "lastyear": case "Pre-set":
                    setIsCreatedDateSelected(true);
                    setIsModifiedDateSelected(true);
                    setIsDueDateSelected(true);
                    break;
                default:
                    setIsCreatedDateSelected(false);
                    setIsModifiedDateSelected(false);
                    setIsDueDateSelected(false);
                    break;
            }
        }
    };

    const clearDateFilters = () => {
        setSelectedFilter("");
        setStartDate(null);
        setEndDate(null);
        setIsCreatedDateSelected(false);
        setIsModifiedDateSelected(false);
        setIsDueDateSelected(false);
    };

    const ExampleCustomInput = React.forwardRef(({ value, onClick }: any, ref: any) => (
        <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
            <input
                type="text"
                id="datepicker"
                className="form-control date-picker ps-2"
                placeholder="DD/MM/YYYY"
                defaultValue={value}
            />
            <span
                style={{
                    position: "absolute",
                    top: "58%",
                    right: "8px",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                }}
            >
                <span className="svg__iconbox svg__icon--calendar dark"></span>
            </span>
        </div>
    ));
    //*************************************************************Date Sections End*********************************************************************/
    ///////project section ////////////
    const onRenderCustomProjectManagementHeader = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading">
                    <span>
                        Select Project
                    </span>
                </div>
                <Tooltip ComponentId="1608" />
            </div>
        )
    }
    const customFooterForProjectManagement = () => {
        return (
            <footer className="text-end me-4">
                <button type="button" className="btn btn-primary">
                    <a target="_blank" className="text-light" data-interception="off"
                        href={`${ContextValue?.siteUrl}/SitePages/PX-Overview.aspx`}>
                        <span className="text-light">Create New One</span>
                    </a>
                </button>
                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveSelectedProject} >
                    Save
                </button>
                <button type="button" className="btn btn-default px-3" onClick={closeProjectManagementPopup}>
                    Cancel
                </button>
            </footer>
        )
    }
    // ************** this is for Project Management Section Functions ************

    let selectedProjectData: any = []
    const SelectProjectFunction = (selectedData: any) => {
        let selectedTempArray: any = [];
        AllProjectBackupArray?.map((ProjectData: any) => {
            selectedData.map((item: any) => {
                if (ProjectData.Id == item.Id) {
                    ProjectData.Checked = true;
                    selectedTempArray.push(ProjectData);
                } else {
                    ProjectData.Checked = false;
                }
            })
        })
        setSelectedProject(selectedTempArray);
    }
    const saveSelectedProject = () => {
        SelectProjectFunction(AllProjectSelectedData);
        setProjectManagementPopup(false);
    }
    const autoSuggestionsForProject = (e: any) => {
        let allSuggestion: any = [];
        let searchedKey: any = e.target.value;
        setProjectSearchKey(e.target.value);
        if (searchedKey?.length > 0) {
            item?.ProjectData?.map((itemData: any) => {
                if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase())) {
                    allSuggestion.push(itemData);
                }
            })
            setSearchedProjectData(allSuggestion);
        } else {
            setSearchedProjectData([]);
        }

    }
    const closeProjectManagementPopup = () => {
        let TempArray: any = [];
        setProjectManagementPopup(false);
        AllProjectBackupArray?.map((ProjectData: any) => {
            ProjectData.Checked = false;
            TempArray.push(ProjectData);
        })
        SetAllProjectData(TempArray);
    }
    const SelectProjectFromAutoSuggestion = (data: any) => {
        setProjectSearchKey('');
        setSearchedProjectData([]);
        selectedProject.push(data)
        setSelectedProject([...selectedProject]);
    }
    const RemoveSelectedProject = (Index: any) => {
        let tempArray: any = [];
        selectedProject?.map((item: any, index: any) => {
            if (Index != index) {
                tempArray.push(item);
            }
        })
        setSelectedProject(tempArray)
    }
    const columns: any = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 45,
                id: 'Id',
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row }) => (
                    <span>
                        <a style={{ textDecoration: "none", color: "#000066" }} href={`${ContextValue?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.original?.Title}</a>
                    </span>
                ),
                placeholder: "Title",
                header: "",
                resetColumnFilters: false,
                id: "Title",
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row }) => (
                    <div className="text-center">{row?.original?.PercentComplete}</div>
                ),
                id: "PercentComplete",
                placeholder: "Status",
                resetColumnFilters: false,
                header: "",
                size: 42,
            },
            {
                accessorFn: (row) => row?.ItemRank,
                cell: ({ row }) => (
                    <div className="text-center">{row?.original?.ItemRank}</div>
                ),
                id: "ItemRank",
                placeholder: "Item Rank",
                resetColumnFilters: false,
                header: "",
                size: 42,
            },
            {
                accessorFn: (row) => row?.AllTeamName,
                cell: ({ row }) => (
                    <div className="alignCenter">
                        <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllUsers} Context={ContextValue} />
                    </div>
                ),
                id: "AllTeamName",
                placeholder: "Team",
                resetColumnFilters: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <span className='ms-1'>{row?.original?.DisplayDueDate} </span>

                ),
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.DisplayDueDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "DueDate",
                header: "",
                size: 91,
            },
        ],
        [item?.ProjectData]
    );

    const callBackData = React.useCallback((checkData: any) => {
        let MultiSelectedData: any = [];
        if (checkData != undefined) {
            checkData.map((item: any) => MultiSelectedData?.push(item?.original))
            setAllProjectSelectedData(MultiSelectedData);
            // SelectProjectFunction(MultiSelectedData);
        } else {
            setAllProjectSelectedData([]);
            MultiSelectedData = [];
        }
    }, []);

    const PreSetPikerCallBack = React.useCallback((preSetStartDate: any, preSetEndDate) => {
        if (preSetStartDate != undefined) {
            setStartDate(preSetStartDate);
        }
        if (preSetEndDate != undefined) {
            setEndDate(preSetEndDate);
        }
        setSelectedFilter("Pre-set");
        setPreSetPanelIsOpen(false)
    }, []);
    const handleSwitchToggle = () => {
        setFlatView(!flatView);
    };
    const preSetIconClick = () => {
        // setPreSet(true);
        setPreSetPanelIsOpen(true);
    }

    ///////////end/////////////////////
    //*******************************************************************Key Word Section ****************************/
    const handleInputChange = (e: any) => {
        const { value } = e.target;
        setKeyWordSearchTearm(value);
    };
    //*******************************************************************Key Word Section End****************************/
    const checkIcons =
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="0.5" y="0.5" width="15" height="15" fill="${portfolioColor}" stroke="${portfolioColor}"></rect>
      <path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M6.31338 9.13481L5.67412 8.53123L4.60713 7.5238C4.58515 7.50305 4.57416 7.49267 4.56468 7.48416C4.1695 7.12964 3.60074 7.17792 3.27097 7.59398C3.26305 7.60397 3.25397 7.61605 3.23581 7.64021L3.23579 7.64023C3.21764 7.66437 3.20856 7.67645 3.20111 7.68689C2.89114 8.12164 2.94516 8.75793 3.32397 9.1342C3.33307 9.14324 3.34406 9.15361 3.36604 9.17437L4.43303 10.1818L5.50002 11.1892C5.522 11.21 5.53299 11.2204 5.54248 11.2289C5.72498 11.3926 5.94451 11.4704 6.16042 11.4658C6.47041 11.5827 6.82848 11.514 7.09362 11.2512L9.79825 8.57051L12.5029 5.88984C12.8951 5.50105 12.9355 4.83465 12.593 4.40137L12.5727 4.37574L12.5525 4.3501C12.21 3.91683 11.6144 3.88076 11.2221 4.26954L8.51748 6.95022L6.31338 9.13481Z" fill="white" stroke="white" stroke-width="0.3" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`;

    const checkBoxIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="0.5" y="0.5" width="15" height="15" fill="white" stroke="#CCCCCC"/>
    </svg>
  `;
    const halfCheckBoxIcons = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="0.5" y="0.5" width="15" height="15" fill="${portfolioColor}" stroke="${portfolioColor}"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 8.25V8.25C4 8.94036 4.55964 9.5 5.25 9.5H8.375H11.5C12.1904 9.5 12.75 8.94036 12.75 8.25V8.25V8.25C12.75 7.55964 12.1904 7 11.5 7H8.375H5.25C4.55964 7 4 7.55964 4 8.25V8.25Z" fill="white"/>
    </svg>
    `;
    const checkBoxColor = () => {
        setTimeout(() => {
            const inputElement = document.getElementsByClassName('custom-checkbox-tree');
            if (inputElement) {
                for (let j = 0; j < inputElement.length; j++) {
                    const checkboxContainer = inputElement[j]
                    const childElements = checkboxContainer.getElementsByClassName('rct-text');
                    const childElements2 = checkboxContainer.getElementsByClassName('rct-title');
                    for (let i = 0; i < childElements.length; i++) {
                        const checkbox = childElements[i];
                        const lable: any = childElements2[i];
                        if (lable?.innerHTML === "Blank" || lable?.innerHTML === "Other" || lable?.innerHTML === "DA E+E") {
                            checkbox.classList.add('smartFilterAddedMargingClass');
                        }
                    }
                }
            }
        }, 200);
    }
    React.useEffect(() => {
        checkBoxColor();
    }, [iscategoriesAndStatusExpendShow, isClientCategory]);

    const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible, } = usePopperTooltip({ trigger: null, interactive: true, closeOnOutsideClick: false, placement: "auto", visible: controlledVisible, onVisibleChange: setControlledVisible, });
    const handlAction = (newAction: any) => {
        if (action === "click" && newAction === "hover") return;
        setAction(newAction); setControlledVisible(true);
    };
    const handleMouseLeave = () => { if (action === "click") return; setAction(""); setControlledVisible(!controlledVisible); };
    const handleCloseClick = () => { setAction(""); setControlledVisible(!controlledVisible); };
    const selectAllFromAbove = (selectedItem: any, event: any) => {
        let allSmartOptions = JSON.parse(JSON.stringify(filterGroupsData));
        allSmartOptions?.map((MainGroup: any, index: any) => {
            if (MainGroup?.Title == "Type") {
                MainGroup?.values?.map((Group: any) => {
                    if (Group.Id == selectedItem?.Id && event == false) {
                        Group.selectAllChecked = false;
                        MainGroup.checked = MainGroup.checked.filter((groupCheckId: any) => groupCheckId != Group.Id);
                        MainGroup.checked = MainGroup.checked.filter((groupCheckId: any) => {
                            return !Group.children?.some((elem: any) => elem.Id == groupCheckId);
                        });
                        MainGroup.checkedObj = MainGroup.checkedObj.filter((groupCheck: any) => groupCheck.Id != Group.Id);
                        MainGroup.checkedObj = MainGroup.checkedObj.filter((groupCheck: any) => {
                            return !Group.children?.some((elem: any) => elem.Id == groupCheck.Id);
                        });
                    } else if (Group.Id == selectedItem?.Id && event == true) {
                        Group.selectAllChecked = true;
                        MainGroup.checked.push(String(Group.Id));
                        MainGroup.checkedObj.push({
                            Id: String(Group.Id),
                            Title: Group.Title,
                            TaxType: Group.TaxType
                        });
                        if (Group.children && Array.isArray(Group.children)) {
                            Group.children.forEach((child: any) => {
                                MainGroup.checked.push(String(child.Id));
                                MainGroup.checkedObj.push({
                                    Id: String(child.Id),
                                    Title: child.Title,
                                    TaxType: child.TaxType
                                });
                            });
                        }
                    }

                })
            }
        })
        setFilterGroups((prev) => allSmartOptions)
        rerender()
    }
    const selectChild = (selectedItem: any) => {
        let allSmartOptions = JSON.parse(JSON.stringify(filterGroupsData));
        allSmartOptions?.map((MainGroup: any, index: any) => {
            if (MainGroup?.Title == "Type") {
                if (MainGroup?.checked?.some((groupCheckId: any) => groupCheckId == selectedItem?.Id)) {
                    MainGroup.checked = MainGroup?.checked?.filter((groupCheckId: any) => groupCheckId != selectedItem?.Id)
                } else {
                    if (MainGroup.checked != undefined) {
                        MainGroup.checked.push(selectedItem?.Id)
                    }
                }
                if (MainGroup?.checkedObj?.some((groupCheck: any) => groupCheck?.Id == selectedItem?.Id)) {
                    MainGroup.checkedObj = MainGroup?.checkedObj?.filter((groupCheck: any) => groupCheck?.Id != selectedItem?.Id)
                } else {
                    if (MainGroup.checkedObj != undefined) {
                        const selectedProperties = {
                            Id: selectedItem.Id,
                            Title: selectedItem.Title,
                            TaxType: selectedItem.TaxType,
                        };
                        MainGroup.checkedObj.push(selectedProperties);
                    }
                }
            }
        })

        setFilterGroups((prev) => allSmartOptions)
        rerender()
    }
    const selectedFilterCallBack = React.useCallback((item: any, updatedData: any) => {
        if (item != undefined && updatedData) {
            setSelectedFilterPanelIsOpen(false)
            setSelectedFilterPanelIsOpenUpdate(false);
            setUpdatedEditData({})
            setIsSmartFevShowHide(true);
            loadAdminConfigurations();
        } else {
            setSelectedFilterPanelIsOpen(false)
            setSelectedFilterPanelIsOpenUpdate(false);
        }
    }, []);

    const OpenSmartfavorites = (type: any) => {
        if (type === "goToSmartFilter") {
            setIsSmartFevShowHide(false)
        } else if (type === "goToSmartFavorites") {
            loadAdminConfigurations();
            setIsSmartFevShowHide(true);
        }
    }
    const loadAdminConfigurations = async () => {
        let copyCreateMeSmartFavorites: any = [];
        let copyEveryoneSmartFavorites: any = [];
        let filter = "Key eq 'Smartfavorites'";
        web.lists.getById(item?.ContextValue?.AdminconfigrationID)
            .items.select('Id', 'Title', 'Value', 'Key', 'Description', 'DisplayTitle', 'Configurations').filter(filter).get()
            .then((Results: any) => {
                Results?.map((smart: any) => {
                    if (smart.Configurations !== undefined) {
                        const Arrays = JSON.parse(smart.Configurations);
                        Arrays.map((config: any) => {
                            if (config.isShowEveryone === true) {
                                config.Id = smart.Id;
                                copyEveryoneSmartFavorites.push(config);
                            }
                            if (config.CurrentUserID !== undefined && config.CurrentUserID === item?.ContextValue?.Context?.pageContext?.legacyPageContext?.userId && config.isShowEveryone === false) {
                                config.Id = smart.Id;
                                if (config.startDate != null && config.startDate != undefined && config.startDate != "") {
                                    config.startDate = new Date(config.startDate);
                                }
                                if (config.endDate != null && config.endDate != undefined && config.endDate != "") {
                                    config.endDate = new Date(config.endDate);
                                }
                                copyCreateMeSmartFavorites.push(config);
                            }
                        })
                        setEveryoneSmartFavorites([...copyEveryoneSmartFavorites]);
                        setCreateMeSmartFavorites([...copyCreateMeSmartFavorites]);
                    }

                })
                console.log(copyEveryoneSmartFavorites);
            })
    }
    const handleOpenSamePage = (items: any, filterSmaePage: any) => {
        // if (items.Id && !filterSmaePage) {
        //     const newURL = `?SmartfavoriteId=${items?.Id}&smartfavorite=${items?.Title}`;
        //     const concatenatedURL = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/15/workbench.aspx" + newURL;
        //     window.open(concatenatedURL, '_blank');
        // }
        //  else {
        //     item?.setLoaded(false);
        //     setFlatView(true);
        //     setUpdatedSmartFilter(true);
        //     loadAdminConfigurationsId(items?.Id);
        // }
        if (items.Id && filterSmaePage) {
            if (AllSiteTasksDataLoadAll?.length > 0) {
                allTastsData = [];
                allTastsData = allTastsData.concat(AllSiteTasksDataLoadAll);
            }
            item?.setLoaded(false);
            setFlatView(true);
            setUpdatedSmartFilter(true);
            loadAdminConfigurationsId(items?.Id);
        }
    };

    const handleUpdateFaborites = (editData: any) => {
        setUpdatedEditData(editData)
        setSelectedFilterPanelIsOpenUpdate(true);
    }
    const deleteTask = async (itemId: any) => {
        let confirmDelete = confirm("Are you sure, you want to delete this?");
        if (confirmDelete) {
            await web.lists
                .getById(item?.ContextValue?.AdminconfigrationID)
                .items.getById(itemId.Id)
                .recycle()
                .then((i: any) => {
                    loadAdminConfigurations();
                    console.log(i, "deleted Favorites");
                });
        }
    };
    return (
        <>
            {/* {isSmartFevShowHide === true && <div className='row text-end' >
                <a onClick={() => OpenSmartfavorites('goToSmartFilter')}>All Filters</a>
            </div>} */}
            {/* {isSmartFevShowHide === false && <div className='row text-end' >
                <a onClick={() => OpenSmartfavorites('goToSmartFavorites')}>Add Smart Favorite</a>
            </div>} */}
            {/* <a className="mx-3" onClick={() => setSelectedFilterPanelIsOpen(true)}>Add Smart Favorite</a> */}
            <div className='justify-content-end d-flex'>
                {isSmartFevShowHide === true && <div>
                    <a className='hreflink' onClick={() => OpenSmartfavorites('goToSmartFilter')}>Go to Smart Filter</a>
                </div>}
                {isSmartFevShowHide === false && <div>
                    <a className='hreflink' onClick={() => OpenSmartfavorites('goToSmartFavorites')}>Go to Smart Favorites</a>
                </div>}
            </div>


            <section className='smartFilter bg-light border mb-2 col'>
                {isSmartFevShowHide === false && <>
                    <section className="p-0 smartFilterSection">
                        <div className="px-2 py-1">
                            <div className="togglebox">
                                <div className='alignCenter justify-content-between col-sm-12'>
                                    <div className='alignCenter col-sm-8' style={{ color: `${portfolioColor}` }} onClick={() => { toggleIcon(); toggleAllExpendCloseUpDown(iconIndex) }}>
                                        {icons[iconIndex]} <span className="f-16 fw-semibold hreflink ms-1 pe-1 allfilter">All Filters -</span>
                                        <div className="f-14" style={{ color: "#333333" }}>{sitesCountInfo + ' ' + projectCountInfo + ' ' + CategoriesandStatusInfo + ' ' + clientCategoryCountInfo + ' ' + teamMembersCountInfo + ' ' + dateCountInfo}</div>
                                    </div>
                                    <div className='alignCenter col-sm-4'>
                                        <div className='ml-auto alignCenter'>
                                            <div className="svg__iconbox svg__icon--setting hreflink me-2" style={{ backgroundColor: `${portfolioColor}` }} ref={setTriggerRef} onClick={() => handlAction("click")} onMouseEnter={() => handlAction("hover")} onMouseLeave={() => handleMouseLeave()}></div>
                                            {action === "click" && visible && (
                                                <div ref={setTooltipRef} {...getTooltipProps({ className: "tooltip-container m-0 p-0" })}>
                                                    {/* <button className="toolTipCross" onClick={handleCloseClick}><div className="popHoverCross">×</div></button> */}

                                                    <div className='d-flex settingTooltip'>
                                                        {filterGroupsData != null && filterGroupsData.length > 0 &&
                                                            filterGroupsData?.map((MainGroup: any, index: any) => {
                                                                if (MainGroup?.Title == "Type") {
                                                                    return (
                                                                        <>
                                                                            {MainGroup?.values?.map((Group: any) => {
                                                                                return (
                                                                                    <div className='dataSec'>
                                                                                        <div className="alignCenter dataSecParentSec">
                                                                                            <input className={"form-check-input cursor-pointer mt-0"}
                                                                                                style={Group?.values?.length === MainGroup?.checked?.length ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                                type="checkbox"
                                                                                                checked={MainGroup?.checked?.some((datachecked: any) => datachecked == Group?.Id && Group.selectAllChecked === true) || Group.children?.every((child: any) => MainGroup?.checked.includes(child.Id)) ? true : false}
                                                                                                onChange={(e: any) => selectAllFromAbove(Group, e.target.checked)}
                                                                                                ref={(input) => {
                                                                                                    if (input) {
                                                                                                        const isIndeterminate = !(MainGroup?.checked?.some((datachecked: any) => datachecked == Group?.Id)) && !Group.children?.every((child: any) => MainGroup?.checked.includes(child.Id));
                                                                                                        input.indeterminate = isIndeterminate;
                                                                                                        if (isIndeterminate) { input.style.backgroundColor = portfolioColor; input.style.borderColor = portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                            <div className="fw-semibold ms-8 f-16 text-dark">{Group.Title}</div>
                                                                                        </div>
                                                                                        <div className='dataSecChild'>
                                                                                            {Group?.values?.sort((a:any,b:any)=>a.SortOrder-b.SortOrder)?.map((insideCheckBox: any) => {
                                                                                                return (
                                                                                                    <label className='alignCenter f-16 dataSecChildSec'>
                                                                                                        <input type="checkbox" className={"form-check-input cursor-pointer mt-0"} checked={MainGroup?.checked?.some((datachecked: any) => datachecked == insideCheckBox?.Id)} onChange={() => selectChild(insideCheckBox)} />
                                                                                                        <div className='ms-8'>{insideCheckBox?.Title}</div>
                                                                                                    </label>
                                                                                                )
                                                                                            })}
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                        <div className='crossSec text-end'><span onClick={handleCloseClick} className='svg__iconbox svg__icon--cross ml-auto hreflink dark'></span></div>
                                                    </div>
                                                    <div {...getArrowProps({ className: "tooltip-arrow" })} />
                                                </div>
                                            )}
                                            <span style={{ color: `${portfolioColor}` }} className='me-1'>Flat View</span>
                                            <label className="switch me-2" htmlFor="checkbox">
                                                <input checked={flatView} onChange={handleSwitchToggle} type="checkbox" id="checkbox" />
                                                {flatView === true ? <div className="slider round" title='Switch to Groupby View' style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}` }}></div> : <div title='Switch to Flat-View' className="slider round"></div>}
                                            </label>
                                            <div className="ml-auto" ><a className="hreflink" onClick={() => setSelectedFilterPanelIsOpen(true)}>Add Smart Favorite</a></div>
                                            <div className="ms-1">
                                                <Tooltip ComponentId={1651} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {collapseAll == false ? <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className='full-width' style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isKeywordsExpendShow")}>
                                        <div className='alignCenter'>
                                            {isKeywordsExpendShow === true ?
                                                <SlArrowDown style={{ color: "#555555", width: '12px' }} /> : <SlArrowRight style={{ color: "#555555", width: '12px' }} />}
                                            <span style={{ color: "#333333" }} className='ms-2 f-15 fw-semibold'>Keywords</span>
                                        </div>

                                    </span>
                                </label>
                                {isKeywordsExpendShow === true ? <div className='mb-3 ms-20 mt-2 pt-2' style={{ borderTop: "1.5px solid #BDBDBD" }}>
                                    <div className='col-7 p-0'>
                                        <div className='input-group alignCenter'>
                                            <label className="full-width form-label"></label>
                                            <input className="form-control" placeholder='Keywords' type='text' value={keyWordSearchTearm} onChange={handleInputChange}></input>
                                        </div></div>
                                    <div className='alignCenter mt-1'>
                                        <label className='SpfxCheckRadio me-3'>
                                            <input className='radio' type='radio' value="Allwords" checked={selectedKeyWordFilter === "Allwords"} onChange={() => setKeyWordSelected("Allwords")} /> All words
                                        </label>
                                        <label className='SpfxCheckRadio me-3'>
                                            <input className='radio' type='radio' value="Anywords" checked={selectedKeyWordFilter === "Anywords"} onChange={() => setKeyWordSelected("Anywords")} /> Any words
                                        </label>
                                        <label className='SpfxCheckRadio'>
                                            <input className='radio' type='radio' value="ExactPhrase" checked={selectedKeyWordFilter === "ExactPhrase"} onChange={() => setKeyWordSelected("ExactPhrase")} /> Exact Phrase
                                        </label>
                                        <span className='mx-2'> | </span>
                                        <label className='SpfxCheckRadio m-0'>
                                            <input className='radio' type='radio' value="Title" checked={selectedKeyDefultTitle === "Title"} onChange={() => setSelectedKeyDefultTitle("Title")} />Title
                                        </label>
                                        {/* <span className='mx-2'>|</span>
                                        <input className='form-check-input me-1' type='checkbox' id='Component' value='Component' checked={isPortfolioItems} onChange={() => setIsPortfolioItems(!isPortfolioItems)} />Portfolio Items
                                        <span className='mx-2'>|</span>
                                        <input className='form-check-input me-1' type='checkbox' id='Task' value='Task' checked={isTaskItems} onChange={() => setIsTaskItems(!isTaskItems)} />Task Items */}

                                    </div>
                                </div> : ''}
                            </div>
                        </div >
                    </section> : ''}

                    {collapseAll == false ? <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className='full-width' style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isProjectExpendShow")}>
                                        <div className='alignCenter'>
                                            {isProjectExpendShow === true ?
                                                <SlArrowDown style={{ color: "#555555", width: '12px' }} /> : <SlArrowRight style={{ color: "#555555", width: '12px' }} />}
                                            <span style={{ color: "#333333" }} className='ms-2 f-15 fw-semibold'>Project</span> <div className="ms-2 f-14" style={{ color: "#333333" }}>{projectCountInfo ? '-' + projectCountInfo : ''}</div>
                                        </div>
                                    </span>
                                </label>
                                {isProjectExpendShow === true ? <div className='mb-3 ms-20 mt-2 pt-2' style={{ borderTop: "1.5px solid #BDBDBD" }}>
                                    <div className='d-flex justify-content-between'>
                                        <div className="col-12">
                                            <div className='d-flex'>
                                                <div className="col-7 p-0">
                                                    <div className="input-group alignCenter">
                                                        <label className="full-width form-label"></label>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder="Search Project Here"
                                                            value={ProjectSearchKey}
                                                            onChange={(e) => autoSuggestionsForProject(e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-5 p-0 mt-1" onClick={() => setProjectManagementPopup(true)} title="Project Items Popup" >
                                                    <div className='ms-2' role='button' style={{ color: `${portfolioColor}` }}>Select Project</div>
                                                </div>
                                            </div>


                                            {SearchedProjectData?.length > 0 ? (
                                                <div className="SmartTableOnTaskPopup col-sm-7">
                                                    <ul className="list-group">
                                                        {SearchedProjectData.map((item: any) => {
                                                            return (
                                                                <li className="hreflink list-group-item rounded-0 p-1 list-group-item-action" key={item.id} onClick={() => SelectProjectFromAutoSuggestion(item)} >
                                                                    <a>{item.Title}</a>
                                                                </li>
                                                            )
                                                        }
                                                        )}
                                                    </ul>
                                                </div>) : null}
                                            {selectedProject != undefined && selectedProject.length > 0 ?
                                                <div>
                                                    {selectedProject.map((ProjectData: any, index: any) => {
                                                        return (
                                                            <div className="block w-100">
                                                                <a className="hreflink wid90" target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/PX-Profile.aspx?ProjectId=${ProjectData.Id}`}>
                                                                    {ProjectData.Title}
                                                                </a>
                                                                <span onClick={() => RemoveSelectedProject(index)} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"></span>
                                                            </div>
                                                        )
                                                    })}
                                                </div> : null}
                                        </div>
                                    </div>
                                </div> : ''}
                            </div>
                        </div >
                    </section> : ''}

                    {collapseAll == false ? <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <span>
                                    <label className="toggler full_width active">
                                        <span className='full-width' style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isSitesExpendShow")}>
                                            <div className='alignCenter'>
                                                {isSitesExpendShow === true ?
                                                    <SlArrowDown style={{ color: "#555555", width: '12px' }} /> : <SlArrowRight style={{ color: "#555555", width: '12px' }} />}
                                                <span style={{ color: "#333333" }} className='ms-2 f-15 fw-semibold'>Sites</span><div className="ms-2 f-14" style={{ color: "#333333" }}>{sitesCountInfo ? '- ' + sitesCountInfo : ''}</div>
                                            </div>


                                        </span>
                                    </label>
                                    {isSitesExpendShow === true ? <div className="togglecontent mb-3 ms-20 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #BDBDBD" }}>
                                        <div className="col-sm-12 pad0">
                                            <div className="togglecontent">
                                                <table width="100%" className="indicator_search">
                                                    <tr className=''>
                                                        <td valign="top" className='parentFilterSec w-100'>
                                                            {allStites != null && allStites.length > 0 &&
                                                                allStites?.map((Group: any, index: any) => {
                                                                    return (
                                                                        <div className='filterContentSec'>
                                                                            <fieldset className='pe-3 smartFilterStyle'>
                                                                                <legend className='SmartFilterHead'>
                                                                                    <span className="mparent d-flex pb-1" style={{ borderBottom: "1.5px solid #BDBDBD", color: portfolioColor }}>
                                                                                        <input className={"form-check-input cursor-pointer"}
                                                                                            style={Group?.values?.length === Group?.checked?.length ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                            type="checkbox"
                                                                                            checked={Group?.values?.length === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                            onChange={(e) => handleSelectAll(index, e.target.checked, "filterSites")}
                                                                                            ref={(input) => {
                                                                                                if (input) {
                                                                                                    const isIndeterminate = Group?.checked?.length > 0 && Group?.checked?.length !== Group?.values?.length;
                                                                                                    input.indeterminate = isIndeterminate;
                                                                                                    if (isIndeterminate) { input.style.backgroundColor = portfolioColor; input.style.borderColor = portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                        <div className="fw-semibold fw-medium mx-1 text-dark">{Group.Title}</div>
                                                                                    </span>
                                                                                </legend>
                                                                                <div className="custom-checkbox-tree">
                                                                                    <CheckboxTree
                                                                                        nodes={Group.values}
                                                                                        checked={Group.checked}
                                                                                        expanded={expanded}
                                                                                        onCheck={checked => onCheck(checked, index, "filterSites")}
                                                                                        onExpand={expanded => setExpanded(expanded)}
                                                                                        nativeCheckboxes={false}
                                                                                        showNodeIcon={false}
                                                                                        checkModel={'all'}
                                                                                        icons={{
                                                                                            check: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkIcons }} />),
                                                                                            uncheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkBoxIcon }} />),
                                                                                            halfCheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: halfCheckBoxIcons }} />),
                                                                                            expandOpen: <SlArrowDown style={{ color: `#999999` }} />,
                                                                                            expandClose: <SlArrowRight style={{ color: `#999999` }} />,
                                                                                            parentClose: null,
                                                                                            parentOpen: null,
                                                                                            leaf: null,
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            </fieldset>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>

                                    </div> : ""}
                                </span>
                            </div>
                        </div >
                    </section> : ''}

                    {collapseAll == false ? <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className='full-width' style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("iscategoriesAndStatusExpendShow")}>
                                        <div className='alignCenter'>
                                            {iscategoriesAndStatusExpendShow === true ?
                                                <SlArrowDown style={{ color: "#555555", width: '12px' }} /> : <SlArrowRight style={{ color: "#555555", width: '12px' }} />}
                                            <span style={{ color: "#333333" }} className='ms-2 f-15 fw-semibold'>Categories and Status</span><div className="ms-2 f-14" style={{ color: "#333333" }}>{CategoriesandStatusInfo ? '- ' + CategoriesandStatusInfo : ''}</div>
                                        </div>

                                    </span>
                                </label>
                                {iscategoriesAndStatusExpendShow === true ? <div className="togglecontent mb-3 ms-20 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #BDBDBD" }}>
                                    <div className="col-sm-12 pad0">
                                        <div className="togglecontent">
                                            <table width="100%" className="indicator_search">
                                                <tr className=''>
                                                    <td valign="top" className='parentFilterSec w-100'>
                                                        {filterGroupsData != null && filterGroupsData.length > 0 &&
                                                            filterGroupsData?.map((Group: any, index: any) => {
                                                                return (
                                                                    <div className='filterContentSec'>
                                                                        <fieldset className='smartFilterStyle'>
                                                                            <legend className='SmartFilterHead'>
                                                                                <span className="mparent d-flex pb-1" style={{ borderBottom: "1.5px solid #BDBDBD", color: portfolioColor }}>
                                                                                    <input className={"form-check-input cursor-pointer"}
                                                                                        style={(Group.selectAllChecked == undefined || Group.selectAllChecked === false) && Group?.ValueLength === Group?.checked?.length ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                        type="checkbox"
                                                                                        checked={(Group.selectAllChecked == undefined || Group.selectAllChecked === false) && Group?.ValueLength === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                        onChange={(e) => handleSelectAll(index, e.target.checked, "FilterCategoriesAndStatus")}
                                                                                        ref={(input) => {
                                                                                            if (input) {
                                                                                                const isIndeterminate = Group?.checked?.length > 0 && Group?.checked?.length !== Group?.ValueLength;
                                                                                                input.indeterminate = isIndeterminate;
                                                                                                if (isIndeterminate) { input.style.backgroundColor = portfolioColor; input.style.borderColor = portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="fw-semibold fw-medium mx-1 text-dark">{Group.Title}</div>
                                                                                </span>
                                                                            </legend>
                                                                            <div className="custom-checkbox-tree">
                                                                                <CheckboxTree
                                                                                    nodes={Group.values}
                                                                                    checked={Group.checked}
                                                                                    expanded={expanded}
                                                                                    onCheck={checked => onCheck(checked, index, "FilterCategoriesAndStatus")}
                                                                                    onExpand={expanded => setExpanded(expanded)}
                                                                                    nativeCheckboxes={false}
                                                                                    showNodeIcon={false}
                                                                                    checkModel={'all'}
                                                                                    icons={{
                                                                                        check: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkIcons }} />),
                                                                                        uncheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkBoxIcon }} />),
                                                                                        halfCheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: halfCheckBoxIcons }} />),
                                                                                        expandOpen: <SlArrowDown style={{ color: `#999999` }} />,
                                                                                        expandClose: <SlArrowRight style={{ color: `#999999` }} />,
                                                                                        parentClose: null,
                                                                                        parentOpen: null,
                                                                                        leaf: null,
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </fieldset>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </div> : ""}
                            </div>
                        </div >
                    </section> : ''}

                    {collapseAll == false ? <section className="smartFilterSection p-0 mb-1" >
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className='full-width' style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isClientCategory")}>
                                        <div className='alignCenter'>
                                            {isClientCategory === true ?
                                                <SlArrowDown style={{ color: "#555555", width: '12px' }} /> : <SlArrowRight style={{ color: "#555555", width: '12px' }} />}
                                            <span style={{ color: "#333333" }} className='ms-2 f-15 fw-semibold'>Client Category</span><div className="ms-2 f-14" style={{ color: "#333333" }}>{clientCategoryCountInfo ? '- ' + clientCategoryCountInfo : ''}</div>
                                        </div>

                                    </span>
                                </label>
                                {isClientCategory === true ? <div className="togglecontent mb-3 ms-20 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #BDBDBD" }}>
                                    <div className="col-sm-12">
                                        <div className="togglecontent">
                                            <table width="100%" className="indicator_search">
                                                <tr>
                                                    <td valign="top" className='parentFilterSec w-100'>
                                                        {allFilterClintCatogryData != null && allFilterClintCatogryData.length > 0 &&
                                                            allFilterClintCatogryData?.map((Group: any, index: any) => {
                                                                return (

                                                                    <div className='filterContentSec'>
                                                                        <fieldset className='smartFilterStyle'>
                                                                            <legend className='SmartFilterHead'>
                                                                                <span className="mparent d-flex pb-1" style={{ borderBottom: "1.5px solid #BDBDBD", color: portfolioColor }}>
                                                                                    <input className={"form-check-input cursor-pointer"}
                                                                                        style={(Group.selectAllChecked == undefined || Group.selectAllChecked === false) && Group?.ValueLength === Group?.checked?.length ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                        type="checkbox"
                                                                                        checked={(Group.selectAllChecked == undefined || Group.selectAllChecked === false) && Group?.ValueLength === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                        onChange={(e) => handleSelectAll(index, e.target.checked, "ClintCatogry")}
                                                                                        ref={(input) => {
                                                                                            if (input) {
                                                                                                const isIndeterminate = Group?.checked?.length > 0 && Group?.checked?.length !== Group?.ValueLength;
                                                                                                input.indeterminate = isIndeterminate;
                                                                                                if (isIndeterminate) { input.style.backgroundColor = portfolioColor; input.style.borderColor = portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="fw-semibold fw-medium mx-1 text-dark">{Group.Title}</div>
                                                                                </span>
                                                                            </legend>
                                                                            <div className="custom-checkbox-tree">
                                                                                <CheckboxTree
                                                                                    nodes={Group.values}
                                                                                    checked={Group.checked}
                                                                                    expanded={expanded}
                                                                                    onCheck={checked => onCheck(checked, index, "ClintCatogry")}
                                                                                    onExpand={expanded => setExpanded(expanded)}
                                                                                    nativeCheckboxes={false}
                                                                                    showNodeIcon={false}
                                                                                    checkModel={'all'}
                                                                                    icons={{
                                                                                        check: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkIcons }} />),
                                                                                        uncheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkBoxIcon }} />),
                                                                                        halfCheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: halfCheckBoxIcons }} />),
                                                                                        expandOpen: <SlArrowDown style={{ color: `#999999`, height: "1em", width: "1em" }} />,
                                                                                        expandClose: <SlArrowRight style={{ color: `#999999`, height: "1em", width: "1em" }} />,
                                                                                        parentClose: null,
                                                                                        parentOpen: null,
                                                                                        leaf: null,
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </fieldset>
                                                                    </div>


                                                                )
                                                            })
                                                        }
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </div> : ""}
                            </div>

                        </div>
                    </section> : ''}

                    {collapseAll == false ? <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className='full_width' style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isTeamMembersExpendShow")}>
                                        <div className='alignCenter'>
                                            {isTeamMembersExpendShow === true ?
                                                <SlArrowDown style={{ color: "#555555", width: '12px' }} /> : <SlArrowRight style={{ color: "#555555", width: '12px' }} />}
                                            <span style={{ color: "#333333" }} className='ms-2 f-15 fw-semibold'>Team Members</span><div className="ms-2 f-14" style={{ color: "#333333" }}>{teamMembersCountInfo ? '- ' + teamMembersCountInfo : ''}</div>
                                        </div>

                                    </span>
                                </label>
                                {isTeamMembersExpendShow === true ? <div className="togglecontent mb-3 ms-20 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #BDBDBD" }}>
                                    <Col className='mb-2 '>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isSelectAll" checked={isSelectAll} onChange={handleSelectAllChangeTeamSection} /> Select All
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isCretaedBy" checked={isCreatedBy} onChange={() => setIsCreatedBy(!isCreatedBy)} /> Created by
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isModifiedBy" checked={isModifiedby} onChange={() => setIsModifiedby(!isModifiedby)} /> Modified by
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isAssignedBy" checked={isAssignedto} onChange={() => setIsAssignedto(!isAssignedto)} /> Working Member
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isTeamLead" checked={isTeamLead} onChange={() => setIsTeamLead(!isTeamLead)} /> Team Lead
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isTeamMember" checked={isTeamMember} onChange={() => setIsTeamMember(!isTeamMember)} /> Team Member
                                        </label>
                                        <label className='me-3'>
                                            <input className='form-check-input' type="checkbox" value="isTodaysTask" checked={isTodaysTask} onChange={() => setIsTodaysTask(!isTodaysTask)} /> Working Today
                                        </label>
                                    </Col>
                                    <div className="col-sm-12 pad0">
                                        <div className="togglecontent mt-1">
                                            <table width="100%" className="indicator_search">
                                                <tr className=''>
                                                    <td valign="top" className='parentFilterSec w-100'>
                                                        {TaskUsersData != null && TaskUsersData.length > 0 &&
                                                            TaskUsersData?.map((Group: any, index: any) => {
                                                                return (
                                                                    <div className='filterContentSec'>
                                                                        <fieldset className='smartFilterStyle'>
                                                                            <legend className='SmartFilterHead'>
                                                                                <span className="mparent d-flex pb-1" style={{ borderBottom: "1.5px solid #BDBDBD", color: portfolioColor }}>
                                                                                    <input className={"form-check-input cursor-pointer"}
                                                                                        style={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                        type="checkbox"
                                                                                        checked={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                        onChange={(e) => handleSelectAll(index, e.target.checked, "FilterTeamMembers")}
                                                                                        ref={(input) => {
                                                                                            if (input) {
                                                                                                const isIndeterminate = Group?.checked?.length > 0 && Group?.checked?.length !== Group?.values?.length;
                                                                                                input.indeterminate = isIndeterminate;
                                                                                                if (isIndeterminate) { input.style.backgroundColor = portfolioColor; input.style.borderColor = portfolioColor; } else { input.style.backgroundColor = ''; input.style.borderColor = ''; }
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="fw-semibold fw-medium mx-1 text-dark">{Group.Title}</div>
                                                                                </span>
                                                                            </legend>
                                                                            <div className="custom-checkbox-tree">
                                                                                <CheckboxTree
                                                                                    nodes={Group.values}
                                                                                    checked={Group.checked}
                                                                                    expanded={expanded}
                                                                                    onCheck={checked => onCheck(checked, index, 'FilterTeamMembers')}
                                                                                    onExpand={expanded => setExpanded(expanded)}
                                                                                    nativeCheckboxes={false}
                                                                                    showNodeIcon={false}
                                                                                    checkModel={'all'}
                                                                                    icons={{
                                                                                        check: (<div dangerouslySetInnerHTML={{ __html: checkIcons }} />),
                                                                                        uncheck: (<div dangerouslySetInnerHTML={{ __html: checkBoxIcon }} />),
                                                                                        halfCheck: (<div dangerouslySetInnerHTML={{ __html: halfCheckBoxIcons }} />),
                                                                                        // expandOpen: <SlArrowDown style={{ color: `${portfolioColor}` }} />,
                                                                                        // expandClose: <SlArrowRight style={{ color: `${portfolioColor}` }} />,
                                                                                        expandOpen: <SlArrowDown style={{ color: `#999999` }} />,
                                                                                        expandClose: <SlArrowRight style={{ color: `#999999` }} />,
                                                                                        parentClose: null,
                                                                                        parentOpen: null,
                                                                                        leaf: null,
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </fieldset>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </div> : ""}
                            </div>
                        </div >
                    </section> : ''}

                    {collapseAll == false ? <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className="full-width" style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isDateExpendShow")}>
                                        <div className='alignCenter'>
                                            {isDateExpendShow === true ?
                                                <SlArrowDown style={{ color: "#555555", width: '12px' }} /> : <SlArrowRight style={{ color: "#555555", width: '12px' }} />}
                                            <span style={{ color: "#333333" }} className='ms-2 f-15 fw-semibold'>Date</span><div className="ms-2 f-14" style={{ color: "#333333" }}>{dateCountInfo ? '- ' + dateCountInfo : ''}</div>
                                        </div>
                                    </span>
                                </label>
                                {isDateExpendShow === true ? <div className="togglecontent mb-3 ms-20 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #BDBDBD" }}>
                                    <div className="col-sm-12">
                                        <Col className='mb-2'>
                                            <label className="me-3">
                                                <input className="form-check-input" type="checkbox" value="isCretaedDate" checked={isCreatedDateSelected} onChange={() => setIsCreatedDateSelected(!isCreatedDateSelected)} />{" "}
                                                Created Date
                                            </label>
                                            <label className="me-3">
                                                <input
                                                    className="form-check-input" type="checkbox" value="isModifiedDate" checked={isModifiedDateSelected} onChange={() => setIsModifiedDateSelected(!isModifiedDateSelected)} />{" "}
                                                Modified Date
                                            </label>
                                            <label className="me-3">
                                                <input className="form-check-input" type="checkbox" value="isDueDate" checked={isDueDateSelected} onChange={() => setIsDueDateSelected(!isDueDateSelected)} />{" "}
                                                Due Date
                                            </label>
                                        </Col>
                                        <Col className='my-2'>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" className='radio' value="today" checked={selectedFilter === "today"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Today</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="yesterday" className='radio' checked={selectedFilter === "yesterday"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Yesterday</label>
                                            </span >
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="thisweek" className='radio' checked={selectedFilter === "thisweek"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>This Week</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="last7days" className='radio' checked={selectedFilter === "last7days"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Last 7 Days</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="thismonth" className='radio' checked={selectedFilter === "thismonth"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>This Month</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="last30days" className='radio' checked={selectedFilter === "last30days"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Last 30 Days</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="last3months" className='radio' checked={selectedFilter === "last3months"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Last 3 Months</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="thisyear" className='radio' checked={selectedFilter === "thisyear"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>This Year</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="lastyear" className='radio' checked={selectedFilter === "lastyear"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Last Year</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="custom" className='radio' onChange={handleDateFilterChange}
                                                    checked={selectedFilter === "custom" || (startDate !== null && endDate !== null && !selectedFilter)} />
                                                <label className='ms-1'>Custom</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-3'>
                                                <input type="radio" name="dateFilter" value="Pre-set" className='radio' onChange={handleDateFilterChange}
                                                    checked={selectedFilter === "Pre-set"} />
                                                <label className='ms-1'>Pre-set <span style={{ backgroundColor: `${portfolioColor}` }} onClick={() => preSetIconClick()} className="svg__iconbox svg__icon--editBox alignIcon hreflink"></span></label>
                                            </span>

                                        </Col>
                                        <div>
                                            <div className='alignCenter gap-4'>
                                                <div className="col-2 dateformate ps-0" style={{ width: "160px" }}>
                                                    <div className="input-group">
                                                        <label className='mb-1 form-label full-width'>Start Date</label>
                                                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                            className="form-control date-picker" popperPlacement="bottom-start" customInput={<ExampleCustomInput />}
                                                            maxDate={endDate}
                                                            renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled
                                                            }) => (<div style={{ margin: 10, display: "flex", justifyContent: "center" }}>
                                                                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{"<"}</button>
                                                                <select value={date.getFullYear()} onChange={({ target: { value } }: any) => changeYear(value)}>{years.map((option) => (<option key={option} value={option}>{option}</option>))}</select>
                                                                <select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>{months.map((option) => (<option key={option} value={option}>{option} </option>))}</select>
                                                                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{">"}</button>
                                                            </div>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-2 dateformate" style={{ width: "160px" }}>
                                                    <div className="input-group">
                                                        <label className='mb-1 form-label full-width'>End Date</label>
                                                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                            className="form-control date-picker" popperPlacement="bottom-start" customInput={<ExampleCustomInput />}
                                                            minDate={startDate}
                                                            renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled
                                                            }) => (<div style={{ margin: 10, display: "flex", justifyContent: "center" }}>
                                                                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>{"<"}</button>
                                                                <select value={date.getFullYear()} onChange={({ target: { value } }: any) => changeYear(value)}>{years.map((option) => (<option key={option} value={option}>{option}</option>))}</select>
                                                                <select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>{months.map((option) => (<option key={option} value={option}>{option} </option>))}</select>
                                                                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} >{">"}</button>
                                                            </div>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-2 mt-2 m-0 pull-left">
                                                    <label className="hreflink pt-3" title="Clear Date Filters" onClick={clearDateFilters} ><strong style={{ color: `${portfolioColor}` }} >Clear</strong></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> : ""}

                            </div>
                        </div >
                        <div className='full-width text-end full-width me-1 my-3 pe-2 text-end'><button className='btn btn-primary me-1 px-3 py-1' onClick={() => UpdateFilterData("udateClickTrue")}>Update Filter</button>
                            <button className='btn  btn-default px-3 py-1' onClick={ClearFilter}> Clear Filters</button></div>
                    </section> : ''}

                </>}

                {isSmartFevShowHide === true && <>
                    <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className="full-width" style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isEveryOneShow")}>
                                        <div className='alignCenter'>
                                            {isEveryOneShow === true ?
                                                <SlArrowDown style={{ color: "#555555", width: '12px' }} /> : <SlArrowRight style={{ color: "#555555", width: '12px' }} />}
                                            <span style={{ color: "#333333" }} className='ms-2 f-15 fw-semibold'>EveryOne</span>
                                            {/* <div className="ms-2 f-14" style={{ color: "#333333" }}>{dateCountInfo ? '- ' + dateCountInfo : ''}</div> */}
                                        </div>
                                    </span>
                                </label>
                                {isEveryOneShow === true ? <div className="togglecontent mb-3 ms-20 pt-1 mt-1" style={{ display: "block", borderTop: "1.5px solid #ccc" }}>
                                    <div className="col-sm-12">
                                        <div>{EveryoneSmartFavorites?.length > 0 && EveryoneSmartFavorites.map((item1: any) => {
                                            return (<>
                                                <div className='bg-ee my-1 p-1 w-100'>
                                                    <span className='d-flex'>
                                                        <a className='hreflink' onClick={() => handleOpenSamePage(item1, "filterSmaePage")}>{item1.Title}</a><span className='d-flex'><a className="hreflink" data-interception="off" target="_blank" style={{ color: `${portfolioColor}` }} href={`${ContextValue.siteUrl}/SitePages/Team-Portfolio.aspx${item.IsUpdated ? `?PortfolioType=${encodeURIComponent(item.IsUpdated)}` : ''}${item.IsUpdated ? '&' : '?'}SmartfavoriteId=${encodeURIComponent(item1.Id)}&smartfavorite=${encodeURIComponent(item1?.Title)}`}><span className="svg__iconbox svg__icon--openWeb"></span></a><span onClick={() => handleUpdateFaborites(item1)} className="svg__iconbox svg__icon--edit"></span> <span onClick={() => deleteTask(item1)} className="svg__icon--trash  svg__iconbox"></span></span>
                                                    </span>
                                                </div>
                                            </>)
                                        })}</div>
                                        <div>{EveryoneSmartFavorites?.length == 0 &&
                                            <div className='bg-ee my-1 p-1 w-100'>
                                                <span className='d-flex'>
                                                    No Items Available
                                                </span>
                                            </div>
                                        }</div>
                                    </div>
                                </div> : ''}
                            </div>
                        </div >
                    </section>
                    <section className="smartFilterSection p-0 mb-1">
                        <div className="px-2">
                            <div className="togglebox">
                                <label className="toggler full_width active">
                                    <span className="full-width" style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isOnlyMeShow")}>
                                        <div className='alignCenter'>
                                            {isOnlyMeShow === true ?
                                                <SlArrowDown style={{ color: "#555555", width: '12px' }} /> : <SlArrowRight style={{ color: "#555555", width: '12px' }} />}
                                            <span style={{ color: "#333333" }} className='ms-2 f-15 fw-semibold'>Only Me</span>
                                            {/* <div className="ms-2 f-14" style={{ color: "#333333" }}>{dateCountInfo ? '- ' + dateCountInfo : ''}</div> */}
                                        </div>
                                    </span>
                                </label>
                                {isOnlyMeShow === true ? <div className="togglecontent mb-3 ms-20 pt-1 mt-1" style={{ display: "block", borderTop: "1.5px solid #ccc" }}>
                                    <div className="col-sm-12">
                                        <div>{CreateMeSmartFavorites?.length > 0 && CreateMeSmartFavorites.map((item2: any) => {
                                            return (<>
                                                <div className='bg-ee my-1 p-1 w-100'>
                                                    <div>
                                                        <span className='d-flex'>
                                                            <a className='hreflink' onClick={() => handleOpenSamePage(item2, "filterSmaePage")}>{item2.Title}</a><span className='d-flex'><a className="hreflink" data-interception="off" target="_blank" style={{ color: `${portfolioColor}` }} href={`${ContextValue.siteUrl}/SitePages/Team-Portfolio.aspx${item.IsUpdated ? `?PortfolioType=${encodeURIComponent(item.IsUpdated)}` : ''}${item.IsUpdated ? '&' : '?'}SmartfavoriteId=${encodeURIComponent(item2.Id)}&smartfavorite=${encodeURIComponent(item2?.Title)}`}><span className="svg__iconbox svg__icon--openWeb"> </span></a><span onClick={() => handleUpdateFaborites(item2)} className="svg__iconbox svg__icon--edit"></span> <span onClick={() => deleteTask(item2)} className="svg__icon--trash  svg__iconbox"></span></span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </>)
                                        })}
                                        </div>
                                        <div>{CreateMeSmartFavorites?.length == 0 &&
                                            <div className='bg-ee my-1 p-1 w-100'>
                                                <span className='d-flex'>
                                                    No Items Available
                                                </span>
                                            </div>
                                        }</div>
                                    </div>
                                </div> : ''}
                            </div>
                        </div >
                    </section>
                </>}
            </section>
            {/* ********************* this is Project Management panel ****************** */}
            {item?.ProjectData != undefined && item?.ProjectData?.length > 0 ?
                <Panel
                    onRenderHeader={onRenderCustomProjectManagementHeader}
                    isOpen={ProjectManagementPopup}
                    onDismiss={closeProjectManagementPopup}
                    isBlocking={true}
                    type={PanelType.custom}
                    customWidth="1100px"
                    onRenderFooter={customFooterForProjectManagement}
                >
                    <div className="SelectProjectTable">
                        <div className="modal-body wrapper p-0 mt-2">
                            <GlobalCommanTable SmartTimeIconShow={true} columns={columns} data={item?.ProjectData} callBackData={callBackData} multiSelect={true} />
                        </div>

                    </div>
                </Panel>
                : null
            }
            <>{PreSetPanelIsOpen && <PreSetDatePikerPannel isOpen={PreSetPanelIsOpen} PreSetPikerCallBack={PreSetPikerCallBack} portfolioColor={portfolioColor} />}</>
            {selectedFilterPanelIsOpen && <TeamSmartFavoritesCopy openTableSettingPopup={item?.openTableSettingPopup} isOpen={selectedFilterPanelIsOpen} selectedFilterCallBack={selectedFilterCallBack}
                portfolioColor={portfolioColor}
                filterGroupsData={filterGroupsData}
                allFilterClintCatogryData={allFilterClintCatogryData}
                allStites={allStites}
                selectedProject={selectedProject}
                startDate={startDate}
                endDate={endDate}
                isCreatedBy={isCreatedBy}
                isModifiedby={isModifiedby}
                isAssignedto={isAssignedto}
                isTeamLead={isTeamLead}
                isTeamMember={isTeamMember}
                isTodaysTask={isTodaysTask}
                selectedFilter={selectedFilter}
                isCreatedDateSelected={isCreatedDateSelected}
                isModifiedDateSelected={isModifiedDateSelected}
                isDueDateSelected={isDueDateSelected}
                ProjectData={item?.ProjectData}
                ContextValue={ContextValue}
                AllUsers={AllUsers}
                TaskUsersData={TaskUsersData}
            />}
            {selectedFilterPanelIsOpenUpdate && updatedEditData && <TeamSmartFavoritesCopy openTableSettingPopup={item?.openTableSettingPopup} isOpen={selectedFilterPanelIsOpenUpdate} selectedFilterCallBack={selectedFilterCallBack}
                portfolioColor={portfolioColor}
                updatedSmartFilter={true}
                updatedEditData={updatedEditData}
                ProjectData={item?.ProjectData}
                ContextValue={ContextValue}
                AllUsers={AllUsers}
            />}
        </>
    )
}
export default TeamSmartFilter;