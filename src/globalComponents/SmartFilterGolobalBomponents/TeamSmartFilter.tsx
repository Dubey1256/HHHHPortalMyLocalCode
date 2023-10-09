import * as React from 'react';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import * as globalCommon from "../../globalComponents/globalCommon";
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
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
let filterGroupsDataBackup: any = [];
let filterGroupData1: any = [];
let timeSheetConfig: any = {};
const TeamSmartFilter = (item: any) => {
    let allMasterTasksData: any = item.AllMasterTasksData;
    let allTastsData: any = item.AllSiteTasksData;
    let smartFiltercallBackData = item.smartFiltercallBackData;
    let ContextValue = item?.ContextValue;
    let portfolioColor: any = item?.portfolioColor
    let AllProjectBackupArray = JSON.parse(JSON.stringify(item?.ProjectData));

    const [TaskUsersData, setTaskUsersData] = React.useState([]);
    const [AllUsers, setTaskUser] = React.useState([]);
    const [smartmetaDataDetails, setSmartmetaDataDetails] = React.useState([])
    const [expanded, setExpanded] = React.useState([]);
    const [filterGroupsData, setFilterGroups] = React.useState([]);
    const [allStites, setAllStites] = React.useState([]);
    const [filterInfo, setFilterInfo] = React.useState('');
    const rerender = React.useReducer(() => ({}), {})[1]

    const [IsSmartfilter, setIsSmartfilter] = React.useState(false);
    const [isSitesExpendShow, setIsSitesExpendShow] = React.useState(false);
    const [isProjectExpendShow, setIsProjectExpendShow] = React.useState(false);
    const [iscategoriesAndStatusExpendShow, setIscategoriesAndStatusExpendShow] = React.useState(false);
    const [isTeamMembersExpendShow, setIsTeamMembersExpendShow] = React.useState(false);
    const [isDateExpendShow, setIsDateExpendShow] = React.useState(false);
    const [collapseAll, setcollapseAll] = React.useState(false);
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
    //*******************************************************Date Section End********************************************************************/

    //*******************************************************Teams Section********************************************************************/
    const [isCreatedBy, setIsCreatedBy] = React.useState(false);
    const [isModifiedby, setIsModifiedby] = React.useState(false);
    const [isAssignedto, setIsAssignedto] = React.useState(false);
    //*******************************************************Teams Section End********************************************************************/

    //*******************************************************Key Word Section********************************************************************/
    const [selectedKeyWordFilter, setKeyWordSelected] = React.useState("Allwords");
    const [selectedKeyDefultTitle, setSelectedKeyDefultTitle] = React.useState("Title");
    const [keyWordSearchTearm, setKeyWordSearchTearm] = React.useState("");
    //*******************************************************Key Word Section End********************************************************************/



    let finalArrayData: any = [];
    let SetAllData: any = [];
    let filt: any = "";



    const getTaskUsers = async () => {
        let web = new Web(ContextValue?.siteUrl);
        let taskUsers = [];
        let results = await web.lists
            .getById(ContextValue.TaskUsertListID)
            .items
            .select('Id', 'Role', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'AssingedToUser/Title', 'AssingedToUser/Id', "AssingedToUser/Name", 'UserGroupId', 'UserGroup/Id', "ItemType")
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
        setTaskUser(results);
        setTaskUsersData(taskUsers)
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
            if (newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
                newtest.DataLoadNew = false;
            else if (newtest.TaxType == 'Sites') {
                siteConfigSites.push(newtest)
            }
            if (newtest?.TaxType == 'timesheetListConfigrations') {
                timeSheetConfig = newtest;
            }
        })
        if (siteConfigSites?.length > 0) {
            setSiteConfig(siteConfigSites)
        }
        setSmartmetaDataDetails(smartmetaDetails);
        smartTimeUseLocalStorage();
    }

    React.useEffect(() => {
        getTaskUsers();
        GetSmartmetadata();
    }, [])
    React.useEffect(() => {
        GetfilterGroups();
    }, [smartmetaDataDetails])

    React.useEffect(() => {
        if (filterGroupsData[0]?.checked?.length > 0 && firstTimecallFilterGroup === true) {
            headerCountData();
            FilterDataOnCheck();
        }
    }, [filterGroupsData && firstTimecallFilterGroup]);




    let filterGroups: any = [{ Title: 'Portfolio', values: [], checked: [], checkedObj: [], expanded: [] },
    {
        Title: 'Type', values: [], checked: [], checkedObj: [], expanded: []
    },
    {
        Title: 'Client Category', values: [], checked: [], checkedObj: [], expanded: []
    }, {
        Title: 'Status', values: [], checked: [], checkedObj: [], expanded: []
    }, {
        Title: 'Priority', values: [], checked: [], checkedObj: [], expanded: []
    }, {
        Title: 'Categories', values: [], checked: [], checkedObj: [], expanded: []
    }
        // , {
        //     Title: 'Portfolio Type', values: [], checked: [], checkedObj: [], expanded: []
        // }
    ];
    let AllSites: any = [];
    const SortOrderFunction = (filterGroups: any) => {
        filterGroups.forEach((elem: any) => {
            return elem?.values?.sort((a: any, b: any) => a.SortOrder - b.SortOrder);
        });
    };

    const GetfilterGroups = () => {
        let SitesData: any = [];
        let ClientCategory: any = [];
        let PriorityData: any = [];
        let PortfolioData: any = [];
        let PrecentComplete: any = [];
        let Categories: any = [];
        let Type: any = [];
        smartmetaDataDetails.forEach((element: any) => {
            element.label = element.Title;
            element.value = element.Id;
            if (element.TaxType == 'Task Types') {
                filterGroups[0].values.push(element);
                filterGroups[0].checked.push(element.Id)
            }
            if (element.TaxType == 'Type') {
                filterGroups[1].values.push(element);
                filterGroups[1].checked.push(element.Id)
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
        SitesData?.forEach((element: any) => {
            if (element.Title != 'Master Tasks' && (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined))) {
                element.values = [],
                    element.checked = [],
                    element.checkedObj = [],
                    element.expanded = []
                AllSites.push(element);
                getChildsSites(element, SitesData);
            }
        })


        PrecentComplete?.forEach((element: any) => {
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                getChildsBasedOn(element, PrecentComplete);
                filterGroups[3].values.push(element);
            }
        })


        ClientCategory?.forEach((element: any) => {
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                getChildsBasedOn(element, ClientCategory);
                filterGroups[2].values.push(element);
            }
        })


        PriorityData?.forEach((element: any) => {
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                getChildsBasedOn(element, PriorityData);
                filterGroups[4].values.push(element);
            }
        })

        Categories?.forEach((element: any) => {
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                getChildsBasedOn(element, Categories);
                filterGroups[5].values.push(element);
            }
        })
        // item?.portfolioTypeData?.forEach((element: any) => {
        //     element.value = element.Id;
        //     element.label = element.Title;
        //     filterGroups[6].checked.push(element.Id)
        //     filterGroups[6].values.push(element);
        // })



        filterGroups.forEach((element: any, index: any) => {
            element.checkedObj = GetCheckedObject(element.values, element.checked)
        });
        AllSites?.forEach((element: any, index: any) => {
            element.checkedObj = GetCheckedObject(element.values, element.checked)
        });
        setAllStites(AllSites);
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
                childItem.value = childItem.Id;
                childItem.label = childItem.Title;
                item.values.push(childItem)
                if (item.TaxType == 'Sites' || item.TaxType == 'Sites Old') {
                    if (childItem.Title == "Shareweb Old" || childItem.Title == "DRR" || childItem.Title == "Small Projects" || childItem.Title == "Offshore Tasks" || childItem.Title == "Health" || childItem.Title == "Gender" || childItem.Title == "QA" || childItem.Title == "DE" || childItem.Title == "Completed" || childItem.Title == "90%" || childItem.Title == "93%" || childItem.Title == "96%" || childItem.Title == "100%") {
                    }
                    else {
                        item.checked.push(childItem.Id);
                    }
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
                filterGroups[3].checked.push(item.Id);
            }
        }

    }
    // const getFilterInfo = () => {
    //     let filterInfo = '';
    //     let tempFilterInfo: any = []
    //     filterGroups.forEach((element: any) => {
    //         if (element.checked.length > 0)
    //             tempFilterInfo.push(element.Title + ' : (' + element.checked.length + ')')
    //     });
    //     filterInfo = tempFilterInfo.join(' | ');
    //     setFilterInfo(filterInfo)
    // }

    const headerCountData = (() => {
        let filterInfo = '';
        let tempFilterInfo: any = []
        if (filterGroupsData?.length > 0) {
            filterGroupsData?.forEach((element: any) => {
                if (element.checked.length > 0)
                    tempFilterInfo.push(element.Title + ' : (' + element.checked.length + ')')
            });
            filterInfo = tempFilterInfo.join(' | ');
        }
        if (allStites?.length > 0) {
            allStites?.forEach((element: any) => {
                if (element.checked.length > 0)
                    tempFilterInfo.push(element.Title + ' : (' + element.checked.length + ')')
            });
            filterInfo = tempFilterInfo.join(' | ');
        }
        if (selectedProject?.length > 0) {
            tempFilterInfo.push("Project" + ' : (' + selectedProject?.length + ')')
            filterInfo = tempFilterInfo.join(' | ');
        }
        if (TaskUsersData?.length > 0) {
            TaskUsersData?.forEach((element: any) => {
                if (element.checked.length > 0)
                    tempFilterInfo.push(element.Title + ' : (' + element.checked.length + ')')
            });
            filterInfo = tempFilterInfo.join(' | ');
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
            tempFilterInfo.push("Date" + ' : (' + trueCount + ')')
            filterInfo = tempFilterInfo.join(' | ');
        }
        setFilterInfo(filterInfo)
    })
    React.useEffect(() => {
        headerCountData()
    }, [selectedProject, isCreatedDateSelected, isModifiedDateSelected, isDueDateSelected])

    const onCheck = (checked: any, index: any, event: any) => {
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
            // checkBoxColor();
        } else if (event == "FilterCategoriesAndStatus") {
            let filterGroups = filterGroupsData;
            filterGroups[index].checked = checked;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, checked)
            // //// demo////
            if (filterGroups[index]?.values.length > 0) {
                const childrenLength = filterGroups[index]?.values?.reduce((total: any, obj: any) => total + (obj?.children?.length || 0), 0) + (filterGroups[index]?.values?.length ? filterGroups[index]?.values?.length : 0);
                filterGroups[index].selectAllChecked = childrenLength === checked?.length;
            }
            // ///end///
            setFilterGroups(filterGroups);
            rerender();
            // checkBoxColor();
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
            // checkBoxColor();
        }
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
    const GetCheckedObject = (arr: any, checked: any) => {
        let checkObj: any = [];
        checked?.forEach((value: any) => {
            arr?.forEach((element: any) => {
                if (value == element.Id) {
                    checkObj.push({
                        Id: element.Id,
                        Title: element.Title
                    })
                }
                if (element.children != undefined && element.children.length > 0) {
                    element.children.forEach((chElement: any) => {
                        if (value == chElement.Id) {
                            checkObj.push({
                                Id: chElement.Id,
                                Title: chElement.Title
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
        }
        headerCountData();
    }

    // const FilterDataOnCheck = function () {
    //     let portFolio: any[] = [];
    //     let site: any[] = [];
    //     let type: any[] = [];
    //     let teamMember: any[] = [];
    //     let priorityType: any[] = [];
    //     let percentComplete: any[] = [];
    //     let updateArray: any[] = [];
    //     let finalUpdateArray: any[] = [];
    //     let clientCategory: any[] = [];
    //     let Categories: any[] = [];
    //     // let PortfolioType:any[]=[];
    //     filterGroupsData.forEach(function (filter) {
    //         if (filter.Title === 'Portfolio' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
    //             filter.checkedObj.map(function (port: any) { return portFolio.push(port); });
    //         }
    //         else if (filter.Title === 'Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
    //             filter.checkedObj.map(function (elem1: any) { return type.push(elem1); });
    //         }
    //         else if (filter.Title === 'Client Category' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
    //             filter.checkedObj.map(function (elem: any) { return clientCategory.push(elem); });
    //         }
    //         else if (filter.Title === 'Categories' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
    //             filter.checkedObj.map(function (elem2: any) { return Categories.push(elem2); });
    //         }
    //         else if (filter.Title === 'Priority' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
    //             filter.checkedObj.map(function (elem3: any) {
    //                 if (elem3.Title != '(1) High' && elem3.Title != '(2) Normal' && elem3.Title != '(3) Low') {
    //                     elem3.Title = parseInt(elem3.Title);
    //                 }
    //                 priorityType.push(elem3);
    //             });
    //         }
    //         else if (filter.Title === 'Status' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
    //             filter.checkedObj.map(function (elem4: any) {
    //                 if (elem4.Title) {
    //                     const match = elem4.Title.match(/(\d+)%/);
    //                     if (match) {
    //                         elem4.TaskStatus = parseInt(match[1]);
    //                     }
    //                 }
    //                 return percentComplete.push(elem4);
    //             });
    //         }
    //         // else if(filter.Title === 'Portfolio Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
    //         //     filter.checkedObj.map(function (portType: any) { return PortfolioType.push(portType); });
    //         // }
    //     });
    //     if (allStites.length > 0) {
    //         site = allStites.reduce((acc, item) => [...acc, ...item.checkedObj], []);
    //     }
    //     if (TaskUsersData.length > 0) {
    //         teamMember = TaskUsersData.reduce((acc, item) => [...acc, ...item.checkedObj], []);
    //         if (isCreatedBy === true) { teamMember.push(isCreatedBy) } else if (isModifiedby === true) { teamMember.push(isModifiedby) } else if (isAssignedto === true) { teamMember.push(isAssignedto) }
    //     }
    //     allMasterTasksData?.map((data: any) => {
    //         if (checkPortfolioMatch(data, portFolio)) {
    //             updateArray.push(data);
    //         }
    //     });
    //     /// old code///
    //     allTastsData?.map((data: any) => {
    //         if (checkSiteMatch(data, site) && checkTypeMatch(data, type)) {
    //             if (percentCompleteMatch(data, percentComplete)) {
    //                 data.TotalTaskTime = data?.TotalTaskTime;
    //                 updateArray.push(data);
    //             }
    //         }
    //     });

    //     let updateArrayCopyData: any[] = [];
    //     let updateFinalData: any[] = [];
    //     if (updateArray.length > 0) {
    //         updateArray.map((filData) => {
    //             filData.TeamLeaderUser?.map((TeamData: any) => {
    //                 if (checkTeamMember(TeamData, teamMember)) {
    //                     updateArrayCopyData.push(filData);
    //                 }
    //             });
    //         });
    //     }
    //     if (updateArrayCopyData.length > 0) {
    //         updateArrayCopyData.map((priorityData) => {
    //             if (checkPriority(priorityData, priorityType)) {
    //                 updateFinalData.push(priorityData);
    //             }
    //         });
    //     }

    //     if (updateFinalData.length > 0) {
    //         setFinalArray(updateFinalData);
    //         finalArrayData = updateFinalData;
    //     } else if (updateArrayCopyData.length > 0) {
    //         setFinalArray(updateArrayCopyData);
    //         finalArrayData = updateArrayCopyData;
    //     } else {
    //         setFinalArray(updateArray);
    //         finalArrayData = updateArray;
    //     }
    //     console.log('finalArrayDatafinalArrayData', finalArrayData)
    //     setFirstTimecallFilterGroup(false);
    // };
    // const checkPortfolioMatch = (data: any, portfolioFilter: any): boolean => {
    //     if (portfolioFilter.length === 0) {
    //         return false;
    //     } else {
    //         return portfolioFilter.some((filter: any) => filter.Title === data.Item_x0020_Type);
    //     }
    // };

    // const checkSiteMatch = (data: any, siteFilter: any): boolean => {
    //     if (siteFilter.length === 0) {
    //         return false;
    //     } else {
    //         return siteFilter.some((fil: any) => fil.Title === data.siteType);
    //     }
    // };

    // const checkTypeMatch = (data: any, typeSite: any): boolean => {
    //     if (typeSite.length === 0) {
    //         return false;
    //     } else {
    //         return typeSite.some((value: any) => data?.TaskType?.Title === value.Title);
    //     }
    // };

    // const checkTeamMember = (data: any, teamMember: any): boolean => {
    //     if (teamMember.length === 0) {
    //         return false;
    //     } else {
    //         return teamMember.some((value: any) => value.Title === data.Title);
    //     }
    // };

    // const checkPriority = (data: any, checkPriority: any): boolean => {
    //     if (checkPriority.length === 0) {
    //         return false;
    //     } else {
    //         if (data.Priority !== undefined && data.Priority !== '' && data.Priority !== null) {
    //             return checkPriority.some((value: any) => value.Title === data.Priority || value.Title === data.PriorityRank);
    //         }
    //     }
    //     return false;
    // };
    // const percentCompleteMatch = (percentData: any, percentComplete: any): boolean => {
    //     if (percentComplete.length === 0) {
    //         return false;
    //     } else {
    //         if (percentData.PercentComplete !== undefined && percentData.PercentComplete !== '' && percentData.PercentComplete !== null) {
    //             const percentCompleteValue = parseInt(percentData?.PercentComplete);
    //             return percentComplete.some((value: any) => percentCompleteValue === value?.TaskStatus);
    //         }
    //     }
    //     return false;
    // };


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
            if (filter.Title === 'Portfolio' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (port: any) { return portFolio.push(port); });
            }
            else if (filter.Title === 'Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (elem1: any) { return type.push(elem1); });
            }
            else if (filter.Title === 'Client Category' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (elem: any) { return clientCategory.push(elem); });
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
        if (allStites.length > 0) {
            site = allStites.reduce((acc, item) => [...acc, ...item.checkedObj], []);
        }
        if (TaskUsersData.length > 0) {
            teamMember = TaskUsersData.reduce((acc, item) => [...acc, ...item.checkedObj], []);
            if (isCreatedBy === true) { teamMember.push(isCreatedBy) } else if (isModifiedby === true) { teamMember.push(isModifiedby) } else if (isAssignedto === true) { teamMember.push(isAssignedto) }
        }
        const filteredMasterTaskData = allMasterTasksData.filter((data: any) =>
            updatedCheckMatch(data, 'Item_x0020_Type', 'Title', portFolio) &&
            updatedCheckMatch(data, 'ClientCategory', 'Title', clientCategory) &&
            updatedCheckTeamMembers(data, teamMember) &&
            updatedKeyWordData(data, keyWordSearchTearm) &&
            updatedCheckDateSection(data, startDate, endDate)
        );
        const filteredTaskData = allTastsData.filter((data: any) =>
            updatedCheckMatch(data, 'siteType', 'Title', site) &&
            updatedCheckTaskType(data, type) &&
            updatedCheckProjectMatch(data, selectedProject) &&
            updatedCheckMatch(data, 'percentCompleteValue', 'TaskStatus', percentComplete) &&
            updatedCheckMatch(data, 'ClientCategory', 'Title', clientCategory) &&
            updatedCheckMatch(data, 'TaskCategories', 'Title', Categories) &&
            updatedCheckTeamMembers(data, teamMember) &&
            updatedKeyWordData(data, keyWordSearchTearm) &&
            updatedCheckDateSection(data, startDate, endDate) &&
            updatedCheckPriority(data, priorityType)
        );
        let allFinalResult = filteredMasterTaskData.concat(filteredTaskData);
        setFinalArray(allFinalResult);
        setFirstTimecallFilterGroup(false);
        console.log(filteredMasterTaskData);
        console.log(filteredTaskData);
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
            if (isAssignedto === true) {
                if (data?.AssignedTo.length > 0) {
                    let result = data?.AssignedTo?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ')));
                    if (result === true) {
                        return true;
                    }
                }

            }
            if (isCreatedBy === false && isModifiedby === false && isAssignedto === false) {
                let result = data?.TeamLeaderUser?.some((item: any) => teamMembers.some((filter: any) => filter?.Title === item?.Title?.replace(/\s+/g, ' ')));
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
    };
    const UpdateFilterData = () => {
        item?.setLoaded(false);
        setUpdatedSmartFilter(true);
        FilterDataOnCheck();
    };

    const showSmartFilter = (value: any) => {
        if (value == "isSitesExpendShow") {
            if (isSitesExpendShow == true) {
                setIsSitesExpendShow(false)
                // checkBoxColor();
            } else {
                setIsSitesExpendShow(true)
                // checkBoxColor();
            }
        }
        if (value == "isProjectExpendShow") {
            if (isProjectExpendShow == true) {
                setIsProjectExpendShow(false)
                // checkBoxColor();
            } else {
                setIsProjectExpendShow(true)
                // checkBoxColor();
            }
        }
        if (value == "iscategoriesAndStatusExpendShow") {
            if (iscategoriesAndStatusExpendShow == true) {
                setIscategoriesAndStatusExpendShow(false)
                // checkBoxColor();
            } else {
                setIscategoriesAndStatusExpendShow(true)
                // checkBoxColor();
            }
        }
        if (value == "isTeamMembersExpendShow") {
            if (isTeamMembersExpendShow == true) {
                setIsTeamMembersExpendShow(false)
                // checkBoxColor();
            } else {
                setIsTeamMembersExpendShow(true)
                // checkBoxColor();
            }

        }
        if (value == "isDateExpendShow") {
            if (isDateExpendShow == true) {
                setIsDateExpendShow(false)
                // checkBoxColor();
            } else {
                setIsDateExpendShow(true)
                // checkBoxColor();
            }

        }
    }
    const toggleAllExpendCloseUpDown = (iconIndex: any) => {
        if (iconIndex == 0) {
            setcollapseAll(false);
            setIsSitesExpendShow(true);
            setIsProjectExpendShow(true)
            setIscategoriesAndStatusExpendShow(true);
            setIsTeamMembersExpendShow(true);
            setIsDateExpendShow(true);
            setIsSmartfilter(true);
            // checkBoxColor();

        } else if (iconIndex == 1) {
            setcollapseAll(false);
            setIsSitesExpendShow(false);
            setIsProjectExpendShow(false)
            setIscategoriesAndStatusExpendShow(false);
            setIsTeamMembersExpendShow(false);
            setIsDateExpendShow(false);
            setIsSmartfilter(false);
            // checkBoxColor();
        } else if (iconIndex == 2) {
            setcollapseAll(true);
            setIsSitesExpendShow(false);
            setIsProjectExpendShow(false)
            setIscategoriesAndStatusExpendShow(false);
            setIsTeamMembersExpendShow(false);
            setIsDateExpendShow(false);
            setIsSmartfilter(false);
            // checkBoxColor();
        } else {
            setcollapseAll(false);
            setIsSitesExpendShow(false);
            setIsProjectExpendShow(false);
            setIscategoriesAndStatusExpendShow(false);
            setIsTeamMembersExpendShow(false);
            setIsDateExpendShow(false);
            setIsSmartfilter(false);
            // checkBoxColor();
        }
    };
    const toggleIcon = () => {
        setIconIndex((prevIndex) => (prevIndex + 1) % 4);
    };
    const icons = [
        <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />,
        <SlArrowDown style={{ color: `${portfolioColor}`, width: '12px' }} />,
        <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />,
        <AiOutlineUp style={{ color: `${portfolioColor}`, width: '12px' }} />,
    ];


    // const checkBoxColor = () => {
    //     setTimeout(() => {
    //         const inputElement = document.getElementsByClassName('custom-checkbox-tree');
    //         if (inputElement) {
    //             for (let j = 0; j < inputElement.length; j++) {
    //                 const checkboxContainer = inputElement[j]
    //                 const childElements = checkboxContainer.getElementsByTagName('input');
    //                 const childElements2 = checkboxContainer.getElementsByClassName('rct-title');
    //                 for (let i = 0; i < childElements.length; i++) {
    //                     const checkbox = childElements[i];
    //                     const lable: any = childElements2[i];
    //                     if (lable?.style) {
    //                         lable.style.color = portfolioColor;
    //                     }
    //                     checkbox.classList.add('form-check-input', 'cursor-pointer');
    //                     if (checkbox.checked) {
    //                         checkbox.style.borderColor = portfolioColor;
    //                         checkbox.style.backgroundColor = portfolioColor;
    //                     } else {
    //                         checkbox.style.borderColor = '';
    //                         checkbox.style.backgroundColor = '';
    //                     }
    //                     if (lable?.innerHTML === "QA" || lable?.innerHTML === "Design") {
    //                         // checkbox.style.marginLeft = "14px !important;"
    //                         checkbox.classList.add('smartFilterAlignMarginQD');
    //                     }
    //                 }
    //             }
    //         }
    //     }, 200);
    // }
    // React.useEffect(() => {
    //     // checkBoxColor();
    // }, [expanded]);



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

                    if (timeEntryIndex.hasOwnProperty(key)) {
                        timeEntryIndex[key].TotalTaskTime += totalTaskTime
                    } else {
                        timeEntryIndex[`${taskTitle}${entry[taskTitle]?.Id}`] = {
                            ...entry[taskTitle],
                            TotalTaskTime: totalTaskTime,
                            siteType: site.Title,
                        };
                    }
                }
            });
        });
        allTastsData?.map((task: any) => {
            task.TotalTaskTime = 0;
            const key = `Task${task?.siteType + task.Id}`;
            if (timeEntryIndex.hasOwnProperty(key) && timeEntryIndex[key]?.Id === task.Id && timeEntryIndex[key]?.siteType === task.siteType) {
                task.TotalTaskTime = timeEntryIndex[key]?.TotalTaskTime;
            }
        })
        if (timeEntryIndex) {
            const dataString = JSON.stringify(timeEntryIndex);
            localStorage.setItem('timeEntryIndex', dataString);
        }
        console.log("timeEntryIndex", timeEntryIndex)
        UpdateFilterData();
        return allTastsData;
    };

    const smartTimeUseLocalStorage = () => {
        if (timeEntryDataLocalStorage?.length > 0) {
            const timeEntryIndexLocalStorage = JSON.parse(timeEntryDataLocalStorage)
            allTastsData?.map((task: any) => {
                task.TotalTaskTime = 0;
                const key = `Task${task?.siteType + task.Id}`;
                if (timeEntryIndexLocalStorage.hasOwnProperty(key) && timeEntryIndexLocalStorage[key]?.Id === task.Id && timeEntryIndexLocalStorage[key]?.siteType === task.siteType) {
                    task.TotalTaskTime = timeEntryIndexLocalStorage[key]?.TotalTaskTime;
                }
            })
            console.log("timeEntryIndexLocalStorage", timeEntryIndexLocalStorage)
            UpdateFilterData();
            return allTastsData;
        }
    };



    //*************************************************************smartTimeTotal End*********************************************************************/


    /// **************** CallBack Part *********************///
    React.useEffect(() => {
        if (updatedSmartFilter === true) {
            smartFiltercallBackData(finalArray, updatedSmartFilter, smartTimeTotal)
        } else if (updatedSmartFilter === false) {
            smartFiltercallBackData(finalArray, updatedSmartFilter, smartTimeTotal)
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
                const last30DaysStartDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    31
                );
                const last30DaysEndDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    30
                );
                setStartDate(last30DaysStartDate);
                setEndDate(last30DaysEndDate);
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
            default:
                setStartDate(null);
                setEndDate(null);
                break;
        }
    }, [selectedFilter]);

    const handleDateFilterChange = (event: any) => {
        setSelectedFilter(event.target.value);
        if (
            !isCreatedDateSelected &&
            !isModifiedDateSelected &&
            !isDueDateSelected
        ) {
            switch (event.target.value) {
                case "today": case "yesterday": case "thisweek": case "last7days":
                case "thismonth": case "last30days": case "thisyear": case "lastyear":
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
                className="form-control date-picker"
                placeholder="DD/MM/YYYY"
                defaultValue={value}
            />
            <span
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "0px",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                }}
            >
                <span className="svg__iconbox svg__icon--calendar"></span>
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
                        href={`${ContextValue?.siteUrl}/SitePages/Project-Management-Overview.aspx`}>
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
                        <a style={{ textDecoration: "none", color: "#000066" }} href={`${ContextValue?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.original?.Title}</a>
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
                accessorKey: "DueDate",
                placeholder: "Due Date",
                header: "",
                resetColumnFilters: false,
                size: 91,
                id: "DueDate",
            }
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



    ///////////end/////////////////////
    //*******************************************************************Key Word Section ****************************/
    // React.useEffect(() => {
    //     switch (selectedKeyWordFilter) {
    //         case "Allwords":
    //         setKeyWordSelected('Allwords')
    //             break;
    //         case "Anywords":
    //             setKeyWordSelected('Anywords')
    //             break;
    //         case "ExactPhrase":
    //             setKeyWordSelected('ExactPhrase')
    //             break;
    //         default:
    //             setKeyWordSelected('Allwords')
    //             break;
    //     }
    // }, [selectedKeyWordFilter]);
    const handleInputChange = (e: any) => {
        const { value } = e.target;
        setKeyWordSearchTearm(value);
    };
    //*******************************************************************Key Word Section End****************************/
    return (
        <>
            <section className="ContentSection smartFilterSection row mb-1">
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <div className="togglebox">
                            <div>
                                <div className='d-flex justify-content-between'>
                                    <span>
                                        <span className="ml20" style={{ color: `${portfolioColor}` }} >{filterInfo}</span>
                                    </span>
                                    <div>
                                        <button className='btn btn-primary me-1' onClick={UpdateFilterData}>Update Filter</button>
                                        <button className='btn  btn-default' onClick={ClearFilter}> Clear Filters</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div >
            </section>
            <section className="ContentSection smartFilterSection row mb-1">
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <div className="togglebox">
                            <label className="toggler full_width mb-10 active">
                                <span style={{ color: `${portfolioColor}` }}
                                    onClick={() => { toggleIcon(); toggleAllExpendCloseUpDown(iconIndex) }}>
                                    {icons[iconIndex]}
                                    {/* <span className='mx-1'>Sites</span> */}
                                    {/* <span className="ml20" style={{ color: `${portfolioColor}` }} >{filterInfo}</span> */}
                                </span>
                            </label>
                            {collapseAll == false ? <div>
                                <div className='d-flex justify-content-between'>
                                    <div className='col-md-12'><input className='full-width' placeholder='Keywords' type='text' value={keyWordSearchTearm} onChange={handleInputChange}></input> </div>
                                    {/* <div>
                                        <button className='btn btn-primary me-1' onClick={UpdateFilterData}>Update Filter</button>
                                        <button className='btn  btn-default' onClick={ClearFilter}> Clear Filters</button>
                                    </div> */}
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <div className='mt-2'>
                                        <label className='SpfxCheckRadio  me-2'>
                                            <input className='radio' type='radio' value="Allwords" checked={selectedKeyWordFilter === "Allwords"} onChange={() => setKeyWordSelected("Allwords")} /> All words
                                        </label>
                                        <label className='SpfxCheckRadio   me-2'>
                                            <input className='radio' type='radio' value="Anywords" checked={selectedKeyWordFilter === "Anywords"} onChange={() => setKeyWordSelected("Anywords")} /> Any words
                                        </label>
                                        <label className='SpfxCheckRadio  me-2'>
                                            <input className='radio' type='radio' value="ExactPhrase" checked={selectedKeyWordFilter === "ExactPhrase"} onChange={() => setKeyWordSelected("ExactPhrase")} /> Exact Phrase
                                        </label>
                                        <span className='m-2'> | </span>
                                        <label className='SpfxCheckRadio  me-2 '>
                                            <input className='radio' type='radio' value="Title" checked={selectedKeyDefultTitle === "Title"} onChange={() => setSelectedKeyDefultTitle("Title")} /> Title
                                        </label>
                                        {/* <label className='SpfxCheckRadio '>
                                            <input className='radio' type='radio' value="Allfields" /> All fields
                                        </label> */}
                                        <span className='m-2'>|</span>
                                        <label className='SpfxCheckRadio  me-2 '>
                                            <input className='form-check-input' type='checkbox' id='Component' value='Component' /> Portfolio Items
                                        </label>
                                        <span className='m-2'>|</span>
                                        <label className='SpfxCheckRadio '>
                                            <input className='form-check-input' type='checkbox' id='Task' value='Task' /> Task Items
                                        </label>
                                    </div>
                                </div>
                            </div> : ''}
                        </div>

                    </div>
                </div >
            </section>


            {collapseAll == false ? <section className="ContentSection smartFilterSection row mb-1">
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <div className="togglebox">
                            <span>
                                <label className="toggler full_width mb-10 active">
                                    <span style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isProjectExpendShow")}>
                                        {isProjectExpendShow === true ?
                                            <SlArrowDown style={{ color: `${portfolioColor}`, width: '12px' }} /> : <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />}
                                        <span className='mx-1'>Project</span>
                                    </span>
                                </label>
                                {isProjectExpendShow === true ? <div>
                                    <div className='d-flex justify-content-between'>
                                        <div className="col-12">
                                            <div className="input-group">
                                                <label className="full-width form-label"></label>
                                                <input type="text"
                                                    className="form-control"
                                                    placeholder="Search Project Here"
                                                    value={ProjectSearchKey}
                                                    onChange={(e) => autoSuggestionsForProject(e)}
                                                />

                                                <span className="input-group-text mt--10" onClick={() => setProjectManagementPopup(true)} title="Project Items Popup" >
                                                    <span className="svg__iconbox svg__icon--editBox mt--10"></span>
                                                </span>
                                            </div>
                                            {SearchedProjectData?.length > 0 ? (
                                                <div className="SmartTableOnTaskPopup">
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
                                                                <a className="hreflink wid90" target="_blank" data-interception="off" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Project-Management.aspx?ProjectId=${ProjectData.Id}`}>
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
                            </span>
                        </div>

                    </div>
                </div >
            </section> : ''}




            {collapseAll == false ? <section className="ContentSection smartFilterSection row mb-1">
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <div className="togglebox">
                            <span>
                                <label className="toggler full_width mb-10 active">
                                    <span style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isSitesExpendShow")}>
                                        {isSitesExpendShow === true ?
                                            <SlArrowDown style={{ color: `${portfolioColor}`, width: '12px' }} /> : <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />}
                                        <span className='mx-1'>Sites</span>
                                    </span>
                                </label>
                                {isSitesExpendShow === true ? <div className="togglecontent" style={{ display: "block" }}>
                                    <div className="col-sm-12 pad0">
                                        <div className="togglecontent mt-1">
                                            <table width="100%" className="indicator_search">
                                                <tr className=''>
                                                    {allStites != null && allStites.length > 0 &&
                                                        allStites?.map((Group: any, index: any) => {
                                                            return (
                                                                <td valign="top" style={{ width: '33.3%' }}>
                                                                    <fieldset className='smartFilterStyle ps-2'>
                                                                        <legend className='SmartFilterHead'>
                                                                            <span className="mparent d-flex" style={{ borderBottom: "1.5px solid" + portfolioColor, color: portfolioColor }}>
                                                                                <input className={"form-check-input cursor-pointer"}
                                                                                    style={Group?.values?.length === Group?.checked?.length ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                    type="checkbox"
                                                                                    checked={Group?.values?.length === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                    onChange={(e) => handleSelectAll(index, e.target.checked, "filterSites")}
                                                                                />
                                                                                <div className="mx-1">{Group.Title}</div>
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
                                                                                    check: (<AiFillCheckSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                    uncheck: (<AiOutlineBorder style={{ height: "18px", color: "rgba(0,0,0,.29)", width: "18px" }} />),
                                                                                    halfCheck: (<AiFillMinusSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                    expandOpen: <SlArrowDown style={{ color: `${portfolioColor}` }} />,
                                                                                    expandClose: <SlArrowRight style={{ color: `${portfolioColor}` }} />,
                                                                                    parentClose: null,
                                                                                    parentOpen: null,
                                                                                    leaf: null,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </fieldset>
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </div> : ""}
                            </span>
                        </div>

                    </div>
                </div >
            </section> : ''}

            {collapseAll == false ? <section className="ContentSection smartFilterSection row mb-1">
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <div className="togglebox">
                            <span>
                                <label className="toggler full_width mb-10 active">
                                    <span style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("iscategoriesAndStatusExpendShow")}>
                                        {iscategoriesAndStatusExpendShow === true ?
                                            <SlArrowDown style={{ color: `${portfolioColor}`, width: '12px' }} /> : <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />}
                                        <span className='mx-1'>Categories and Status</span>
                                    </span>
                                </label>
                                {iscategoriesAndStatusExpendShow === true ? <div className="togglecontent" style={{ display: "block" }}>
                                    <div className="col-sm-12 pad0">
                                        <div className="togglecontent mt-1">
                                            <table width="100%" className="indicator_search">
                                                <tr className=''>
                                                    {filterGroupsData != null && filterGroupsData.length > 0 &&
                                                        filterGroupsData?.map((Group: any, index: any) => {
                                                            return (
                                                                <td valign="top" style={{ width: '14.2%' }}>
                                                                    <fieldset className='smartFilterStyle ps-2'>
                                                                        <legend className='SmartFilterHead'>
                                                                            <span className="mparent d-flex" style={{ borderBottom: "1.5px solid" + portfolioColor, color: portfolioColor }}>
                                                                                <input className={"form-check-input cursor-pointer"}
                                                                                    style={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                    type="checkbox"
                                                                                    checked={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                    onChange={(e) => handleSelectAll(index, e.target.checked, "FilterCategoriesAndStatus")}
                                                                                />
                                                                                <div className="mx-1">{Group.Title}</div>
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
                                                                                    check: (<AiFillCheckSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                    uncheck: (<AiOutlineBorder style={{ height: "18px", color: "rgba(0,0,0,.29)", width: "18px" }} />),
                                                                                    halfCheck: (<AiFillMinusSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                    expandOpen: <SlArrowDown style={{ color: `${portfolioColor}` }} />,
                                                                                    expandClose: <SlArrowRight style={{ color: `${portfolioColor}` }} />,
                                                                                    parentClose: null,
                                                                                    parentOpen: null,
                                                                                    leaf: null,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </fieldset>
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </div> : ""}
                            </span>
                        </div>

                    </div>
                </div >
            </section> : ''}



            {collapseAll == false ? <section className="ContentSection smartFilterSection row mb-1">
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <div className="togglebox">
                            <span>
                                <label className="toggler full_width mb-10 active">
                                    <span style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isTeamMembersExpendShow")}>
                                        {isTeamMembersExpendShow === true ?
                                            <SlArrowDown style={{ color: `${portfolioColor}`, width: '12px' }} /> : <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />}
                                        <span className='mx-1'>Team Members</span>
                                    </span>
                                </label>
                                {isTeamMembersExpendShow === true ? <div className="togglecontent" style={{ display: "block" }}>
                                    <Col className='mb-2 '>
                                        <label className='me-2'>
                                            <input className='form-check-input' type="checkbox" value="isCretaedBy" checked={isCreatedBy} onChange={() => setIsCreatedBy(!isCreatedBy)} /> Created by
                                        </label>
                                        <label className='me-2'>
                                            <input className='form-check-input' type="checkbox" value="isModifiedBy" checked={isModifiedby} onChange={() => setIsModifiedby(!isModifiedby)} /> Modified by
                                        </label>
                                        <label className='me-2'>
                                            <input className='form-check-input' type="checkbox" value="isAssignedBy" checked={isAssignedto} onChange={() => setIsAssignedto(!isAssignedto)} /> Assigned to
                                        </label>
                                    </Col>
                                    <div className="col-sm-12 pad0">
                                        <div className="togglecontent mt-1">
                                            <table width="100%" className="indicator_search">
                                                <tr className=''>
                                                    {TaskUsersData != null && TaskUsersData.length > 0 &&
                                                        TaskUsersData?.map((Group: any, index: any) => {
                                                            return (
                                                                <td valign="top" style={{ width: '12.5%' }}>
                                                                    <fieldset className='smartFilterStyle ps-2'>
                                                                        <legend className='SmartFilterHead'>
                                                                            <span className="mparent d-flex" style={{ borderBottom: "1.5px solid" + portfolioColor, color: portfolioColor }}>
                                                                                <input className={"form-check-input cursor-pointer"}
                                                                                    style={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                    type="checkbox"
                                                                                    checked={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                    onChange={(e) => handleSelectAll(index, e.target.checked, "FilterTeamMembers")}
                                                                                />
                                                                                <div className="mx-1">{Group.Title}</div>
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
                                                                                    check: (<AiFillCheckSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                    uncheck: (<AiOutlineBorder style={{ height: "18px", color: "rgba(0,0,0,.29)", width: "18px" }} />),
                                                                                    halfCheck: (<AiFillMinusSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                    expandOpen: <SlArrowDown style={{ color: `${portfolioColor}` }} />,
                                                                                    expandClose: <SlArrowRight style={{ color: `${portfolioColor}` }} />,
                                                                                    parentClose: null,
                                                                                    parentOpen: null,
                                                                                    leaf: null,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </fieldset>
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </div> : ""}
                            </span>
                        </div>

                    </div>
                </div >
            </section> : ''}




            {collapseAll == false ? <section className="ContentSection smartFilterSection row">
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <div className="togglebox">
                            <span>
                                <label className="toggler full_width mb-10 active">
                                    <span style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter("isDateExpendShow")}>
                                        {isDateExpendShow === true ?
                                            <SlArrowDown style={{ color: `${portfolioColor}`, width: '12px' }} /> : <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />}
                                        <span className='mx-1'>Date</span>
                                    </span>
                                </label>
                                {isDateExpendShow === true ? <div className="togglecontent" style={{ display: "block" }}>
                                    <div className="col-sm-12 pad0 pad0">
                                        <Col className='mb-2 '>
                                            <label className="me-2">
                                                <input className="form-check-input" type="checkbox" value="isCretaedDate" checked={isCreatedDateSelected} onChange={() => setIsCreatedDateSelected(!isCreatedDateSelected)} />{" "}
                                                Created Date
                                            </label>
                                            <label className="me-2">
                                                <input
                                                    className="form-check-input" type="checkbox" value="isModifiedDate" checked={isModifiedDateSelected} onChange={() => setIsModifiedDateSelected(!isModifiedDateSelected)} />{" "}
                                                Modified Date
                                            </label>
                                            <label className="me-2">
                                                <input className="form-check-input" type="checkbox" value="isDueDate" checked={isDueDateSelected} onChange={() => setIsDueDateSelected(!isDueDateSelected)} />{" "}
                                                Due Date
                                            </label>
                                        </Col>
                                        <Col>
                                            <span className='SpfxCheckRadio  me-2'>
                                                <input type="radio" name="dateFilter" value="today" checked={selectedFilter === "today"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Today</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-2'>
                                                <input type="radio" name="dateFilter" value="yesterday" checked={selectedFilter === "yesterday"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Yesterday</label>
                                            </span >
                                            <span className='SpfxCheckRadio  me-2'>
                                                <input type="radio" name="dateFilter" value="thisweek" checked={selectedFilter === "thisweek"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>This Week</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-2'>
                                                <input type="radio" name="dateFilter" value="last7days" checked={selectedFilter === "last7days"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Last 7 Days</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-2'>
                                                <input type="radio" name="dateFilter" value="thismonth" checked={selectedFilter === "thismonth"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>This Month</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-2'>
                                                <input type="radio" name="dateFilter" value="last30days" checked={selectedFilter === "last30days"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Last 30 Days</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-2'>
                                                <input type="radio" name="dateFilter" value="thisyear" checked={selectedFilter === "thisyear"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>This Year</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-2'>
                                                <input type="radio" name="dateFilter" value="lastyear" checked={selectedFilter === "lastyear"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Last Year</label>
                                            </span>
                                            <span className='SpfxCheckRadio  me-2'>
                                                <input type="radio" name="dateFilter" value="custom" checked={selectedFilter === "custom"} onChange={handleDateFilterChange} />
                                                <label className='ms-1'>Custom</label>
                                            </span>
                                        </Col>
                                        <div className="container">
                                            <Row className="mt-2">
                                                <div className="col-sm-5 dateformate p-0">
                                                    <label>Start Date</label>
                                                    <div className="input-group">
                                                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                            className="form-control date-picker" popperPlacement="bottom-start" customInput={<ExampleCustomInput />} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-5 dateformate">
                                                    <label>End Date</label>
                                                    <div className="input-group">
                                                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                            className="form-control date-picker" popperPlacement="bottom-start" customInput={<ExampleCustomInput />} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-2">
                                                    <label className="hreflink pt-4" title="Clear Date Filters" onClick={clearDateFilters} ><strong>Clear</strong></label>
                                                </div>
                                            </Row>
                                        </div>
                                    </div>
                                </div> : ""}
                            </span>
                        </div>

                    </div>
                </div >
            </section> : ''}




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
        </>
    )

}
export default TeamSmartFilter;

