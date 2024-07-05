import * as React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import ShowTaskTeamMembers from '../../ShowTaskTeamMembers';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { ColumnDef } from '@tanstack/react-table';
import GlobalCommanTable from '../../GroupByReactTableComponents/GlobalCommanTable';
import PreSetDatePikerPannel from '../PreSetDatePiker';
import { GlobalConstants } from '../../LocalCommon';
import { Web } from 'sp-pnp-js';
import Tooltip from '../../Tooltip';
import { myContextValue } from '../../globalCommon';
import ServiceComponentPortfolioPopup from '../../EditTaskPopup/ServiceComponentPortfolioPopup';
const TeamSmartFavoritesCopy = (item: any) => {
    let MyContextdata: any = React.useContext(myContextValue);
    let ContextValue = item?.ContextValue;
    let portfolioColor: any = item?.portfolioColor
    let AllProjectBackupArray: any = []
    try {
        AllProjectBackupArray = JSON.parse(JSON.stringify(item?.ProjectData));
    } catch (e) {
        console.log(e);
    }
    const [PreSetPanelIsOpen, setPreSetPanelIsOpen] = React.useState(false);
    const [AllUsers, setTaskUser] = React.useState(item?.AllUsers);
    const [TaskUsersData, setTaskUsersData] = React.useState([]);
    const [expanded, setExpanded] = React.useState([]);
    const [filterGroupsData, setFilterGroups] = React.useState([]);
    const [allStites, setAllStites] = React.useState([]);
    const [allFilterClintCatogryData, setFilterClintCatogryData] = React.useState([]);
    const [FavoriteFieldvalue, setFavoriteFieldvalue] = React.useState('SmartFilterBased');
    let web = new Web(item?.ContextValue?.Context?.pageContext?._web?.absoluteUrl + '/');
    const [isShowEveryone, setisShowEveryone] = React.useState(false);
    const [SmartFavoriteUrl, setSmartFavoriteUrl] = React.useState('');
    const [smartTitle, setsmartTitle] = React.useState('');


    const rerender = React.useReducer(() => ({}), {})[1]
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

    //*******************************************************Working Action Section********************************************************************/
    const [selectedFilterWorkingAction, setSelectedFilterWorkingAction] = React.useState("");
    const [startDateWorkingAction, setStartDateWorkingAction] = React.useState<any>(null);
    const [endDateWorkingAction, setEndDateWorkingAction] = React.useState<any>(null);
    const [isWorkingDate, setIsWorkingDate] = React.useState(false);
    //*******************************************************Working Action Section End********************************************************************/
    //*******************************************************Date Section End********************************************************************/

    //*******************************************************Teams Section********************************************************************/
    const [isCreatedBy, setIsCreatedBy] = React.useState(false);
    const [isModifiedby, setIsModifiedby] = React.useState(false);
    const [isAssignedto, setIsAssignedto] = React.useState(false);
    const [isTeamLead, setIsTeamLead] = React.useState(false);
    const [isTeamMember, setIsTeamMember] = React.useState(false);
    const [isTodaysTask, setIsTodaysTask] = React.useState(false);
    const [isSelectAll, setIsSelectAll] = React.useState(false);
    const [isPhone, setIsPhone] = React.useState(false);
    const [isBottleneck, setIsBottleneck] = React.useState(false);
    const [isAttention, setIsAttention] = React.useState(false);
    // const [isWorkingThisWeek, setIsWorkingThisWeek] = React.useState(false);
    //*******************************************************Teams Section End********************************************************************/
    ///// Year Range Using Piker ////////
    const [years, setYear] = React.useState([])
    const [months, setMonths] = React.useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",])
    // const [selectedValue, setSelectedValue] = React.useState("Modified");
    // const [tablePageSize, setTablePageSize] = React.useState(null);
    const [count, setCount] = React.useState(true);
    React.useEffect(() => {
        const currentYear = new Date().getFullYear();
        const year: any = [];
        for (let i = 1990; i <= currentYear; i++) {
            year.push(i);
        }
        setYear(year);
    }, [])
    React.useEffect(() => {
        if (item?.updatedSmartFilter != true && !item?.updatedEditData) {
            setFilterGroups(item?.filterGroupsData);
            setFilterClintCatogryData(item?.allFilterClintCatogryData);
            setAllStites(item?.allStites);
            setSelectedProject(item?.selectedProject);
            setStartDate(item?.startDate);
            setEndDate(item?.endDate);
            setStartDateWorkingAction(item?.startDateWorkingAction);
            setEndDateWorkingAction(item?.endDateWorkingAction);
            setIsCreatedBy(item?.isCreatedBy);
            setIsModifiedby(item?.isModifiedby);
            setIsAssignedto(item?.isAssignedto);
            setIsTeamLead(item?.isTeamLead);
            setIsTeamMember(item?.isTeamMember);
            setIsTodaysTask(item?.isTodaysTask);

            setIsPhone(item?.isPhone);
            setIsBottleneck(item?.isBottleneck);
            setIsAttention(item?.isAttention);
            setIsWorkingDate(item?.isWorkingDate);

            setSelectedFilter(item?.selectedFilter);
            setSelectedFilterWorkingAction(item?.selectedFilterWorkingAction)
            setIsCreatedDateSelected(item?.isCreatedDateSelected);
            setIsModifiedDateSelected(item?.isModifiedDateSelected);
            setIsDueDateSelected(item?.isDueDateSelected);
            setTaskUsersData(item?.TaskUsersData);
            setCount(false);
        } else if (item?.updatedSmartFilter === true && item?.updatedEditData) {
            setsmartTitle(item?.updatedEditData?.Title)
            setisShowEveryone(item?.updatedEditData?.isShowEveryone)
            setFilterGroups((prev: any) => item?.updatedEditData?.filterGroupsData);
            setFilterClintCatogryData((prev: any) => item?.updatedEditData?.allFilterClintCatogryData);
            setAllStites((prev: any) => item?.updatedEditData?.allStites);
            setSelectedProject((prev: any) => item?.updatedEditData?.selectedProject);
            setStartDate((prev: any) => item?.updatedEditData?.startDate);
            setEndDate((prev: any) => item?.updatedEditData?.endDate);
            setStartDateWorkingAction((prev: any) => item?.updatedEditData?.startDateWorkingAction);
            setEndDateWorkingAction((prev: any) => item?.updatedEditData?.endDateWorkingAction);
            setIsCreatedBy((prev: any) => item?.updatedEditData?.isCreatedBy);
            setIsModifiedby((prev: any) => item?.updatedEditData?.isModifiedby);
            setIsAssignedto((prev: any) => item?.updatedEditData?.isAssignedto);
            setIsTeamLead((prev: any) => item?.updatedEditData?.isTeamLead);
            setIsTeamMember((prev: any) => item?.updatedEditData?.isTeamMember);
            setIsPhone((prev: any) => item?.updatedEditData?.isPhone);
            setIsBottleneck((prev: any) => item?.updatedEditData?.isBottleneck);
            setIsAttention((prev: any) => item?.updatedEditData?.isAttention);
            setIsWorkingDate((prev: any) => item?.updatedEditData?.isWorkingDate);
            setIsTodaysTask((prev: any) => item?.updatedEditData?.isTodaysTask);
            setSelectedFilter((prev: any) => item?.updatedEditData?.selectedFilter);
            setSelectedFilterWorkingAction((prev: any) => item?.updatedEditData?.selectedFilterWorkingAction);
            setIsCreatedDateSelected((prev: any) => item?.updatedEditData?.isCreatedDateSelected);
            setIsModifiedDateSelected((prev: any) => item?.updatedEditData?.isModifiedDateSelected);
            setIsDueDateSelected((prev: any) => item?.updatedEditData?.isDueDateSelected);
            setTaskUsersData((prev: any) => item?.updatedEditData?.TaskUsersData);
            // setSelectedValue((prev: any) => item?.updatedEditData?.showPageSizeSetting?.selectedTopValue);
            // setTablePageSize((prev: any) => item?.updatedEditData?.showPageSizeSetting?.tablePageSize);
            setCount(false);
        }
    }, [item])
    ///// Year Range Using Piker end////////
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
            // handleTeamsFilterCreatedModifiAssign(event);
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
    }
    // const handleTeamsFilterCreatedModifiAssign = (event: any) => {
    //     if (
    //         !isCreatedBy &&
    //         !isModifiedby &&
    //         !isAssignedto
    //     ) {
    //         switch (event) {
    //             case "FilterTeamMembers":
    //                 setIsCreatedBy(true);
    //                 setIsModifiedby(true);
    //                 setIsAssignedto(true);
    //                 break;
    //             default:
    //                 setIsCreatedBy(false);
    //                 setIsModifiedby(false);
    //                 setIsAssignedto(false);
    //                 break;
    //         }
    //     }
    // };
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
            const selectedIds: any[] = [];

            const processItem = (item: any) => {
                item.checked = selectAllChecked;
                if (selectAllChecked) {
                    selectedIds.push(item?.Id);
                }
                item?.children?.forEach((chElement: any) => {
                    processItem(chElement);
                });
            };
            filterGroups[index].selectAllChecked = selectAllChecked;
            filterGroups[index]?.values?.forEach((item: any) => {
                processItem(item);
            });
            filterGroups[index].checked = selectedIds;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, selectedIds);
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
        else if (event == "ClintCatogry") {
            const filterGroups = [...allFilterClintCatogryData];
            const selectedIds: any[] = [];

            const processItem = (item: any) => {
                item.checked = selectAllChecked;
                if (selectAllChecked) {
                    selectedIds.push(item?.Id);
                }
                item?.children?.forEach((chElement: any) => {
                    processItem(chElement);
                });
            };

            filterGroups[index].selectAllChecked = selectAllChecked;
            filterGroups[index]?.values?.forEach((item: any) => {
                processItem(item);
            });
            filterGroups[index].checked = selectedIds;
            filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index]?.values, selectedIds);
            setFilterClintCatogryData(filterGroups);
            rerender();
        }
    }
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
                if (count === true && item?.updatedSmartFilter === true && item?.updatedEditData) {
                    setStartDate((prev: any) => item?.updatedEditData?.startDate);
                    setEndDate((prev: any) => item?.updatedEditData?.endDate);
                } else if (item?.updatedSmartFilter != true && !item?.updatedEditData && count === true) {
                    setStartDate(item?.startDate);
                    setEndDate(item?.endDate);
                } else {
                    setStartDate(null);
                    setEndDate(null);
                }
                break;
        }
    }, [selectedFilter]);

    React.useEffect(() => {
        setTimeout(() => {
            const panelMain: any = document.querySelector('.ms-Panel-main');
            if (panelMain && item?.portfolioColor) {
                $('.ms-Panel-main').css('--SiteBlue', item?.portfolioColor); // Set the desired color value here
            }
        }, 1000)
    }, [PreSetPanelIsOpen, ProjectManagementPopup]);

    const handleDateFilterChange = (event: any) => {
        setSelectedFilter(event.target.value);
        // // setPreSet(false);
        // // rerender();
        // if (
        //     !isCreatedDateSelected &&
        //     !isModifiedDateSelected &&
        //     !isDueDateSelected
        // ) {
        //     switch (event.target.value) {
        //         case "today": case "yesterday": case "thisweek": case "last7days":
        //         case "thismonth": case "last30days": case "last3months": case "thisyear": case "lastyear": case "Pre-set":
        //             setIsCreatedDateSelected(true);
        //             setIsModifiedDateSelected(true);
        //             setIsDueDateSelected(true);
        //             break;
        //         default:
        //             setIsCreatedDateSelected(false);
        //             setIsModifiedDateSelected(false);
        //             setIsDueDateSelected(false);
        //             break;
        //     }
        // }
    };
    const clearDateFilters = () => {
        setSelectedFilter("");
        setStartDate(null);
        setEndDate(null);
        setIsCreatedDateSelected(false);
        setIsModifiedDateSelected(false);
        setIsDueDateSelected(false);
    };

    React.useEffect(() => {
        const currentDate: any = new Date();
        switch (selectedFilterWorkingAction) {
            case "today":
                setStartDateWorkingAction(currentDate);
                setEndDateWorkingAction(currentDate);
                break;
            case "tomorrow":
                const tomorrow = new Date(currentDate);
                tomorrow.setDate(currentDate.getDate() + 1);
                setStartDateWorkingAction(tomorrow);
                setEndDateWorkingAction(tomorrow);
                break;
            case "thisweek":
                const dayOfWeek: any = currentDate.getDay();
                const startOfWeek: any = new Date(currentDate);
                const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                startOfWeek.setDate(currentDate.getDate() - daysToSubtract);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                setStartDateWorkingAction(startOfWeek);
                setEndDateWorkingAction(endOfWeek);
                break;
            case "nextweek":
                const dayOfWeeks: any = currentDate.getDay();
                const startOfNextWeek: any = new Date(currentDate);
                startOfNextWeek.setDate(currentDate.getDate() + (7 - dayOfWeeks + 1));
                const endOfNextWeek = new Date(startOfNextWeek);
                endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
                setStartDateWorkingAction(startOfNextWeek);
                setEndDateWorkingAction(endOfNextWeek);
                break;
            case "thismonth":
                const monthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const monthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                setStartDateWorkingAction(monthStartDate);
                setEndDateWorkingAction(monthEndDate);
                break;
            case "nextmonth":
                const nextMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
                const nextMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
                setStartDateWorkingAction(nextMonthStartDate);
                setEndDateWorkingAction(nextMonthEndDate);
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
                    setStartDateWorkingAction(new Date(storedDataStartDate));
                    setEndDateWorkingAction(new Date(storedDataEndDate));
                }
                break;
            default:
                setStartDateWorkingAction(null);
                setEndDateWorkingAction(null);
                break;
        }
    }, [selectedFilterWorkingAction]);
    const handleDateFilterChangeWorkingAction = (event: any) => {
        setSelectedFilterWorkingAction(event.target.value);
    };
    const clearDateFiltersWorkingAction = () => {
        setSelectedFilterWorkingAction("");
        setStartDateWorkingAction(null);
        setEndDateWorkingAction(null);
        setIsWorkingDate(false);
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
                {/* <Tooltip ComponentId="1608" /> */}
            </div>
        )
    }

    // ************** this is for Project Management Section Functions ************
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

    const callBackData = React.useCallback((checkData: any, Type: any, functionType: any) => {
        let MultiSelectedData: any = [];
        if (checkData?.length > 0 && functionType == "Save") {
            checkData.map((item: any) => MultiSelectedData?.push(item))
            SelectProjectFunction(MultiSelectedData);
            setProjectManagementPopup(false);
        } else {

            setProjectManagementPopup(false);
        }
    }, []);

    const PreSetPikerCallBack = React.useCallback((preSetStartDate: any, preSetEndDate) => {
        if (preSetStartDate != undefined) {
            setStartDate(preSetStartDate);
        }
        if (preSetEndDate != undefined) {
            setEndDate(preSetEndDate);
        }
        if(preSetStartDate!=undefined ||preSetEndDate != undefined ){
            setSelectedFilter("Pre-set");
        }
       
        setPreSetPanelIsOpen(false)
    }, []);
    const preSetIconClick = () => {
        // setPreSet(true);
        setPreSetPanelIsOpen(true);
    }
    ///////////end/////////////////////
    //*******************************************************************Key Word Section ****************************/
    //*******************************************************************Key Word Section End****************************/
    const checkIcons = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="0.5" y="0.5" width="15" height="15" fill="${portfolioColor}" stroke="${portfolioColor}"/>
    <path d="M5 8L7 10L11 6" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
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
    const onRenderCustomHeader = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="alignCenter subheading">
                    <span className="siteColor">Smart Favorite</span>
                </div>
                <span style={{ marginTop: '2.3px' }}><Tooltip ComponentId={1636} /></span>
            </div>
        );
    };
    const setModalIsOpenToFalse = (res: any, updatedData: any) => {
        if (res && updatedData) {
            item?.selectedFilterCallBack(res, updatedData);
        } else {
            item?.selectedFilterCallBack();
        }
    };
    const AddSmartfaviratesfilter = async () => {
        let Favorite: any = {};
        let AddnewItem: any = [];
        if (FavoriteFieldvalue === 'SmartFilterBased') {
            Favorite = {
                Title: smartTitle,
                SmartFavoriteType: FavoriteFieldvalue,
                CurrentUserID: item?.ContextValue?.Context?.pageContext?.legacyPageContext?.userId,
                isShowEveryone: isShowEveryone,
                filterGroupsData: filterGroupsData,
                allFilterClintCatogryData: allFilterClintCatogryData,
                allStites: allStites,
                selectedProject: selectedProject,
                startDate: startDate,
                endDate: endDate,
                startDateWorkingAction: startDateWorkingAction,
                endDateWorkingAction: endDateWorkingAction,
                isCreatedBy: isCreatedBy,
                isModifiedby: isModifiedby,
                isAssignedto: isAssignedto,
                isTeamLead: isTeamLead,
                isTeamMember: isTeamMember,
                isPhone: isPhone,
                isBottleneck: isBottleneck,
                isAttention: isAttention,
                isWorkingDate: isWorkingDate,
                isTodaysTask: isTodaysTask,
                selectedFilter: selectedFilter,
                selectedFilterWorkingAction: selectedFilterWorkingAction,
                isCreatedDateSelected: isCreatedDateSelected,
                isModifiedDateSelected: isModifiedDateSelected,
                isDueDateSelected: isDueDateSelected,
                TaskUsersData: TaskUsersData,
                smartFabBasedColumnsSetting: MyContextdata?.allContextValueData?.smartFabBasedColumnsSetting ? MyContextdata?.allContextValueData?.smartFabBasedColumnsSetting : {},
                // Createmodified: props?.Createmodified
            }
        }
        // if (tablePageSize > 0) {
        //     Favorite.showPageSizeSetting = {
        //         tablePageSize: parseInt(tablePageSize),
        //         showPagination: true,
        //         selectedTopValue: selectedValue
        //     };
        // }
        console.log("++++++++++++fab col setting val", MyContextdata?.allContextValueData?.smartFabBasedColumnsSetting);
        // else {
        //     var SmartFavorites = (SmartFavoriteUrl.split('SitePages/')[1]).split('.aspx')[0];
        //     SelectedFavorites.push({
        //         "Title": SmartFavorites,
        //         "TaxType": "Url",
        //         "Group": "Url",
        //         "Selected": true,
        //         "Url": SmartFavoriteUrl
        //     });
        // }
        if (item?.updatedSmartFilter != true) {
            AddnewItem.push(Favorite);
            const postData = {
                Configurations: JSON.stringify(AddnewItem),
                Key: 'Smartfavorites',
                Title: 'Smartfavorites',
            };
            await web.lists.getByTitle("AdminConfigurations").items.add(postData).then((result: any) => {
                console.log("Successfully Added SmartFavorite");
                setModalIsOpenToFalse("", "");
                MyContextdata.allContextValueData.smartFabBasedColumnsSetting = {}
            })
        }
        else if (item?.updatedSmartFilter === true) {
            AddnewItem.push(Favorite);
            await web.lists.getByTitle("AdminConfigurations").items.getById(item?.updatedEditData?.Id)
                .update({
                    Configurations: JSON.stringify(AddnewItem),
                    Key: 'Smartfavorites',
                    Title: 'Smartfavorites'
                }).then((res: any) => {
                    console.log("Successfully Added SmartFavorite");
                    console.log('res', res)
                    setModalIsOpenToFalse(res, "updatedData");
                });
        }
    }
    const FavoriteField = (event: any) => {
        const fieldvalue = event.target.value;
        setFavoriteFieldvalue(fieldvalue);
    }
    const isShowEveryOneCheck = (e: any) => {
        if (isShowEveryone)
            setisShowEveryone(false);
        else
            setisShowEveryone(true);
    }
    const ChangeTitle = (e: any) => {
        const Title = e.target.value;
        setsmartTitle(Title);
    }
    const ChangeUrl = (event: any) => {
        const Url = event.target.value;
        setSmartFavoriteUrl(Url);
    }
    // const handleChange = (event: any) => {
    //     setSelectedValue(event.target.value);
    // };
    return (
        <>
            <Panel
                type={PanelType.custom}
                customWidth="1300px"
                isOpen={item?.isOpen}
                onDismiss={() => setModalIsOpenToFalse("", "")}
                onRenderHeader={onRenderCustomHeader}
                isBlocking={false}
            >
                <div className="modal-body p-0 mb-3">
                    <section className='smartFilter bg-light border mb-2 col'>
                        <section className='mt-2 px-2'>
                            <div className='justify-content-between'>
                                <label className='SpfxCheckRadio'>
                                    <input className='radio' type='radio' value="SmartFilterBased" checked={FavoriteFieldvalue === "SmartFilterBased"} onChange={(event) => FavoriteField(event)} /> SmartFilter Based
                                </label>
                                <label className='SpfxCheckRadio'><input className='radio' type='radio' value="UrlBased" checked={FavoriteFieldvalue === "UrlBased"} onChange={(event) => FavoriteField(event)} /> Url Based</label>
                                <label className='SpfxCheckRadio hreflink siteColor' onClick={() => item?.openTableSettingPopup("favBased")}>Table Confrigrations</label>
                            </div>
                            {FavoriteFieldvalue === "SmartFilterBased" &&
                                <div className='row'>
                                    <div className='mb-2 col-7 pe-0'>
                                        <div className='input-group mt-3'>
                                            <label className='d-flex form-label full-width justify-content-between'>Title <span><input type="checkbox" className='form-check-input' checked={isShowEveryone} onChange={(e) => isShowEveryOneCheck(e)} /> For EveryOne</span></label>
                                            <input type="text" className='form-control' value={smartTitle} onChange={(e) => ChangeTitle(e)} />
                                        </div>
                                    </div>
                                    {/* <div className='mb-2 col-3'>
                                        <div className='input-group mt-3'>
                                            <label className='d-flex form-label full-width justify-content-between'>Table Page Size
                                                <span>
                                                    <label className='SpfxCheckRadio'><input className='radio' type='radio' value="Created" checked={selectedValue === "Created"} onChange={handleChange} /> Created</label>
                                                    <label className='SpfxCheckRadio'><input className='radio' type='radio' value="DueDate" checked={selectedValue === "DueDate"} onChange={handleChange} /> Due Date</label>
                                                    <label className='SpfxCheckRadio'><input className='radio' type='radio' value="Modified" checked={selectedValue === "Modified"} onChange={handleChange} /> Modified</label>
                                                </span>
                                            </label>
                                            <input type="number" className='form-control' value={tablePageSize} onChange={(e) => setTablePageSize(e.target.value)} />
                                        </div>
                                    </div> */}
                                </div>

                            }
                            {FavoriteFieldvalue == "UrlBased" && <div className='mb-2 col-7 p-0'>
                                <div className='input-group mt-3'>
                                    <label className='d-flex form-label full-width justify-content-between'>Title <span><input type="checkbox" className='form-check-input' checked={isShowEveryone} onChange={(e) => isShowEveryOneCheck(e)} /> For EveryOne</span></label>
                                    <input type="text" className='form-control' value={smartTitle} onChange={(e) => ChangeTitle(e)} />
                                </div>

                                <div className='input-group mt-3'>
                                    <label className='form-label full-width'> Url </label>
                                    <input type="text" className='form-control' value={SmartFavoriteUrl} onChange={(e) => ChangeUrl(e)} />
                                </div>
                            </div>}
                        </section>


                        {FavoriteFieldvalue === "SmartFilterBased" && <>
                            <section className="smartFilterSection p-0 mb-1">
                                <div className="px-2">
                                    <div className="togglebox">
                                        <label className="toggler full_width active">
                                            <span className='full-width'>
                                                <div className='alignCenter'>
                                                    <span className='f-15 fw-semibold'>Project</span>
                                                </div>
                                            </span>
                                        </label>
                                        <div className='mb-3 mt-2 pt-2' style={{ borderTop: "1.5px solid #bdbdbd" }}>
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
                                                            {/* <span className="svg__iconbox svg__icon--editBox mt--10"></span> */}
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
                                        </div>
                                    </div>
                                </div >
                            </section>

                            <section className="smartFilterSection p-0 mb-1">
                                <div className="px-2">
                                    <div className="togglebox">
                                        <span>
                                            <label className="toggler full_width active">
                                                <span className='full-width'>
                                                    <div className='alignCenter'>
                                                        <span className='f-15 fw-semibold'>Sites</span>
                                                    </div>
                                                </span>
                                            </label>
                                            <div className="togglecontent mb-3 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #bdbdbd" }}>
                                                <div className="col-sm-12 pad0">
                                                    <div className="togglecontent">
                                                        <table width="100%" className="indicator_search">
                                                            <tr className=''>
                                                                {allStites != null && allStites.length > 0 &&
                                                                    allStites?.map((Group: any, index: any) => {
                                                                        return (
                                                                            <td valign="top" style={{ width: '33.3%' }}>
                                                                                <fieldset className='pe-3 smartFilterStyle'>
                                                                                    <legend className='SmartFilterHead'>
                                                                                        <span className="mparent d-flex pb-1" style={{ borderBottom: "1.5px solid #D9D9D9", color: portfolioColor }}>
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
                                            </div>
                                        </span>
                                    </div>
                                </div >
                            </section>

                            <section className="smartFilterSection p-0 mb-1">
                                <div className="px-2">
                                    <div className="togglebox">
                                        <label className="toggler full_width active">
                                            <span className='full-width'>
                                                <div className='alignCenter'>
                                                    <span className='f-15 fw-semibold'>Categories and Status</span>
                                                </div>
                                            </span>
                                        </label>
                                        <div className="togglecontent mb-3 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #D9D9D9" }}>
                                            <div className="col-sm-12 pad0">
                                                <div className="togglecontent">
                                                    <table width="100%" className="indicator_search">
                                                        <tr className=''>
                                                            {filterGroupsData != null && filterGroupsData.length > 0 &&
                                                                filterGroupsData?.map((Group: any, index: any) => {
                                                                    return (
                                                                        <td valign="top" style={{ width: '14.2%' }}>
                                                                            <fieldset className='smartFilterStyle pe-3'>
                                                                                <legend className='SmartFilterHead'>
                                                                                    <span className="mparent d-flex pb-1" style={{ borderBottom: "1.5px solid #D9D9D9", color: portfolioColor }}>
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

                                                                                            // check: (<AiFillCheckSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                            // uncheck: (<AiOutlineBorder style={{ height: "18px", color: "rgba(0,0,0,.29)", width: "18px" }} />),
                                                                                            // halfCheck: (<AiFillMinusSquare style={{ color: `${portfolioColor}`, height: "18px", width: "18px" }} />),
                                                                                            check: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkIcons }} />),
                                                                                            uncheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: checkBoxIcon }} />),
                                                                                            halfCheck: (<div className='checkBoxIcons' dangerouslySetInnerHTML={{ __html: halfCheckBoxIcons }} />),
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

                                        </div>
                                    </div>
                                </div >
                            </section>

                            <section className="smartFilterSection p-0 mb-1" >
                                <div className="px-2">
                                    <div className="togglebox">
                                        <label className="toggler full_width active">
                                            <span className='full-width'>
                                                <div className='alignCenter'>
                                                    <span className='f-15 fw-semibold'>Client Category</span>
                                                </div>
                                            </span>
                                        </label>
                                        <div className="togglecontent mb-3 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #bdbdbd" }}>
                                            <div className="col-sm-12">
                                                <div className="togglecontent">
                                                    <table width="100%" className="indicator_search">
                                                        <tr className=''>
                                                            <td valign="top" className='row'>
                                                                {allFilterClintCatogryData != null && allFilterClintCatogryData.length > 0 &&
                                                                    allFilterClintCatogryData?.map((Group: any, index: any) => {
                                                                        return (
                                                                            <div className='col-sm-4 mb-3 ps-2'>
                                                                                <fieldset className='ps-lg-1 smartFilterStyle'>
                                                                                    <legend className='SmartFilterHead'>
                                                                                        <span className="mparent d-flex pb-1" style={{ borderBottom: "1.5px solid #D9D9D9", color: portfolioColor }}>
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
                                                                                                expandOpen: <SlArrowDown style={{ color: `${portfolioColor}`, height: "1em", width: "1em" }} />,
                                                                                                expandClose: <SlArrowRight style={{ color: `${portfolioColor}`, height: "1em", width: "1em" }} />,
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
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="smartFilterSection p-0 mb-1">
                                <div className="px-2">
                                    <div className="togglebox">
                                        <label className="toggler full_width active">
                                            <span className='full_width'>
                                                <div className='alignCenter'>
                                                    <span className='f-15 fw-semibold'>Team Members</span>
                                                </div>
                                            </span>
                                        </label>
                                        <div className="togglecontent mb-3 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #bdbdbd" }}>
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
                                                            <td valign="top" className='row'>
                                                                {TaskUsersData != null && TaskUsersData.length > 0 &&
                                                                    TaskUsersData?.map((Group: any, index: any) => {
                                                                        return (
                                                                            <div className='col-sm-3 mb-3 ps-2'>
                                                                                <fieldset className='ps-lg-1 smartFilterStyle'>
                                                                                    <legend className='SmartFilterHead'>
                                                                                        <span className="mparent d-flex pb-1" style={{ borderBottom: "1.5px solid #D9D9D9", color: portfolioColor }}>
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
                                                                                                expandOpen: <SlArrowDown style={{ color: `${portfolioColor}` }} />,
                                                                                                expandClose: <SlArrowRight style={{ color: `${portfolioColor}` }} />,
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
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="smartFilterSection p-0 mb-1">
                                <div className="px-2">
                                    <div className="togglebox">
                                        <label className="toggler full_width active">
                                            <span className='full_width'>
                                                <div className='alignCenter'>
                                                    <span className='f-15 fw-semibold'>Actions</span>
                                                </div>

                                            </span>
                                        </label>
                                        <div className="togglecontent mb-3 ms-20 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #BDBDBD" }}>
                                            <Col className='mb-2 '>
                                                <div>
                                                    <label className='me-3'>
                                                        <input className='form-check-input' type="checkbox" value="isPhone" checked={isPhone} onChange={() => setIsPhone(!isPhone)} /> Phone
                                                    </label>
                                                    <label className='me-3'>
                                                        <input className='form-check-input' type="checkbox" value="isBottleneck" checked={isBottleneck} onChange={() => setIsBottleneck(!isBottleneck)} /> Bottleneck
                                                    </label>
                                                    <label className='me-3'>
                                                        <input className='form-check-input' type="checkbox" value="isAttention" checked={isAttention} onChange={() => setIsAttention(!isAttention)} /> Attention
                                                    </label>
                                                </div>
                                            </Col>
                                        </div>
                                    </div>
                                </div >
                            </section>

                            <section className="smartFilterSection p-0 mb-1">
                                <div className="px-2">
                                    <div className="togglebox">
                                        <label className="toggler full_width active">
                                            <span className="full-width">
                                                <div className='alignCenter'>
                                                    <span className='f-15 fw-semibold'>Working Actions</span>
                                                </div>
                                            </span>
                                        </label>
                                        <div className="togglecontent mb-3 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #BDBDBD" }}>
                                            <div className="col-sm-12">
                                                <Col className='mb-2'>
                                                    <label className="me-3">
                                                        <input className="form-check-input" type="checkbox" value="isWorkingDate" checked={isWorkingDate} onChange={() => setIsWorkingDate(!isWorkingDate)} />{" "}
                                                        Working Date
                                                    </label>
                                                </Col>
                                                <Col className='my-2'>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFiltertt" className='radio' value="today" checked={selectedFilterWorkingAction === "today"} onChange={handleDateFilterChangeWorkingAction} />
                                                        <label className='ms-1'>Today</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFiltereee" value="tomorrow" className='radio' checked={selectedFilterWorkingAction === "tomorrow"} onChange={handleDateFilterChangeWorkingAction} />
                                                        <label className='ms-1'>Tomorrow</label>
                                                    </span >
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilterrrr" value="thisweek" className='radio' checked={selectedFilterWorkingAction === "thisweek"} onChange={handleDateFilterChangeWorkingAction} />
                                                        <label className='ms-1'>This Week</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFiltertyu" value="nextweek" className='radio' checked={selectedFilterWorkingAction === "nextweek"} onChange={handleDateFilterChangeWorkingAction} />
                                                        <label className='ms-1'>Next week</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilteriop" value="thismonth" className='radio' checked={selectedFilterWorkingAction === "thismonth"} onChange={handleDateFilterChangeWorkingAction} />
                                                        <label className='ms-1'>This Month</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilteroiuy" value="nextmonth" className='radio' checked={selectedFilterWorkingAction === "nextmonth"} onChange={handleDateFilterChangeWorkingAction} />
                                                        <label className='ms-1'> Next month</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFiltertrew" value="custom" className='radio' onChange={handleDateFilterChangeWorkingAction}
                                                            checked={selectedFilterWorkingAction === "custom" || (startDateWorkingAction !== null && endDateWorkingAction !== null && !selectedFilterWorkingAction)} />
                                                        <label className='ms-1'>Custom</label>
                                                    </span>
                                                </Col>
                                                <div>
                                                    <div className='alignCenter gap-4'>
                                                        <div className="col-2 dateformate ps-0" style={{ width: "160px" }}>
                                                            <div className="input-group">
                                                                <label className='mb-1 form-label full-width'>Start Date</label>
                                                                <DatePicker selected={startDateWorkingAction} onChange={(date) => setStartDateWorkingAction(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                                    className="form-control date-picker" popperPlacement="bottom-start" customInput={<ExampleCustomInput />}
                                                                    maxDate={endDateWorkingAction}
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
                                                                <DatePicker selected={endDateWorkingAction} onChange={(date) => setEndDateWorkingAction(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                                    className="form-control date-picker" popperPlacement="bottom-start" customInput={<ExampleCustomInput />}
                                                                    minDate={startDateWorkingAction}
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
                                                            <label className="hreflink pt-3" title="Clear Date Filters" onClick={clearDateFiltersWorkingAction} ><strong style={{ color: `${portfolioColor}` }} >Clear</strong></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div >
                            </section>

                            <section className="smartFilterSection p-0 mb-1">
                                <div className="px-2">
                                    <div className="togglebox">
                                        <label className="toggler full_width active">
                                            <span className="full-width">
                                                <div className='alignCenter'>
                                                    <span className='f-15 fw-semibold'>Date</span>
                                                </div>
                                            </span>
                                        </label>
                                        <div className="togglecontent mb-3 mt-2 pt-2" style={{ display: "block", borderTop: "1.5px solid #bdbdbd" }}>
                                            <div className="col-sm-12">
                                                <Col className='mb-2 mt-2'>
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
                                                <Col className='my-3'>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter11" className='radio' value="today" checked={selectedFilter === "today"} onChange={handleDateFilterChange} />
                                                        <label className='ms-1'>Today</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter111" value="yesterday" className='radio' checked={selectedFilter === "yesterday"} onChange={handleDateFilterChange} />
                                                        <label className='ms-1'>Yesterday</label>
                                                    </span >
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter1111" value="thisweek" className='radio' checked={selectedFilter === "thisweek"} onChange={handleDateFilterChange} />
                                                        <label className='ms-1'>This Week</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter11111" value="last7days" className='radio' checked={selectedFilter === "last7days"} onChange={handleDateFilterChange} />
                                                        <label className='ms-1'>Last 7 Days</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter1121" value="thismonth" className='radio' checked={selectedFilter === "thismonth"} onChange={handleDateFilterChange} />
                                                        <label className='ms-1'>This Month</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter12121" value="last30days" className='radio' checked={selectedFilter === "last30days"} onChange={handleDateFilterChange} />
                                                        <label className='ms-1'>Last 30 Days</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter12345" value="last3months" className='radio' checked={selectedFilter === "last3months"} onChange={handleDateFilterChange} />
                                                        <label className='ms-1'>Last 3 Months</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter24567" value="thisyear" className='radio' checked={selectedFilter === "thisyear"} onChange={handleDateFilterChange} />
                                                        <label className='ms-1'>This Year</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter54356" value="lastyear" className='radio' checked={selectedFilter === "lastyear"} onChange={handleDateFilterChange} />
                                                        <label className='ms-1'>Last Year</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter45686" value="custom" className='radio' onChange={handleDateFilterChange}
                                                            checked={selectedFilter === "custom" || (startDate !== null && endDate !== null && !selectedFilter)} />
                                                        <label className='ms-1'>Custom</label>
                                                    </span>
                                                    <span className='SpfxCheckRadio  me-3'>
                                                        <input type="radio" name="dateFilter98695" value="Pre-set" className='radio' onChange={handleDateFilterChange}
                                                            checked={selectedFilter === "Pre-set"} />
                                                        <label className='ms-1'>Pre-set <span style={{ backgroundColor: `${portfolioColor}` }} onClick={() => preSetIconClick()} className="svg__iconbox svg__icon--editBox alignIcon hreflink"></span></label>
                                                    </span>
                                                </Col>
                                                <div className="px-2">
                                                    <Row>
                                                        <div className="col-2 dateformate p-0" style={{ width: "160px" }}>
                                                            <div className="input-group ps-1">
                                                                <label className='mb-1 form-label full-width'>Start Date</label>
                                                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                                    className="form-control date-picker" popperPlacement="bottom-start" customInput={<ExampleCustomInput />}
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
                                                        <div className="col-2 dateformate pe-0" style={{ width: "160px" }}>
                                                            <div className="input-group">
                                                                <label className='mb-1 form-label full-width'>End Date</label>
                                                                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                                    className="form-control date-picker" popperPlacement="bottom-start" customInput={<ExampleCustomInput />}
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
                                                        <div className="col-2 mt-2 pull-left m-0">
                                                            <label className="hreflink pt-4" title="Clear Date Filters" onClick={clearDateFilters} ><strong style={{ color: `${portfolioColor}` }} >Clear</strong></label>
                                                        </div>
                                                    </Row>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div >
                            </section>
                        </>}
                    </section>
                    {item?.ProjectData != undefined && item?.ProjectData?.length > 0 && ProjectManagementPopup ?
                        <ServiceComponentPortfolioPopup
                            Dynamic={item?.ContextValue}
                            Call={(DataItem: any, Type: any, functionType: any) => { callBackData(DataItem, Type, functionType) }}
                            showProject={ProjectManagementPopup}
                            selectionType='Multi'
                        />

                        : null
                    }
                    <>{PreSetPanelIsOpen && <PreSetDatePikerPannel isOpen={PreSetPanelIsOpen} PreSetPikerCallBack={PreSetPikerCallBack} portfolioColor={portfolioColor} />}</>
                </div>


                <footer className='bg-f4 fixed-bottom'>
                    <div className='align-items-center d-flex justify-content-between px-4 py-2'>
                        <div></div>
                        <div className='footer-right'>
                            <button type="button" className="btn btn-default pull-right" onClick={() => setModalIsOpenToFalse("", "")}>
                                Cancel
                            </button>
                            <>
                                {(item?.updatedSmartFilter !== true && !item?.updatedEditData) ? (
                                    <>
                                        {smartTitle !== "" ? (
                                            <button type="button" className="btn btn-primary mx-1 pull-right" onClick={AddSmartfaviratesfilter}>Add SmartFavorite</button>
                                        ) : (
                                            <button type="button" disabled={true} className="btn btn-primary mx-1 pull-right" onClick={AddSmartfaviratesfilter}>Add SmartFavorite</button>
                                        )}
                                    </>
                                ) : (
                                    <button type="button" className="btn btn-primary mx-1 pull-right" onClick={AddSmartfaviratesfilter}>Update Smart Favorite</button>
                                )}
                            </>
                        </div>
                    </div>
                </footer>
            </Panel>
        </>
    )
}
export default TeamSmartFavoritesCopy;
