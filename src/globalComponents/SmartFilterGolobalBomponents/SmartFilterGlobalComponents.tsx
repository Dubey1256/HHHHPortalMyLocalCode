import * as React from 'react';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import * as globalCommon from "../../globalComponents/globalCommon";
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
let filterGroupsDataBackup: any = [];
let filterGroupData1: any = [];
let timeSheetConfig: any = {};
const SmartFilterSearchGlobal = (item: any) => {
    let allMasterTasksData: any = item.AllMasterTasksData;
    let allTastsData: any = item.AllSiteTasksData;
    let smartFiltercallBackData = item.smartFiltercallBackData;
    let ContextValue = item?.ContextValue;
    let portfolioColor: any = item?.portfolioColor

    const [TaskUsersData, setTaskUsersData] = React.useState([])
    const [smartmetaDataDetails, setSmartmetaDataDetails] = React.useState([])
    const [expanded, setExpanded] = React.useState([])
    const [filterGroupsData, setFilterGroups] = React.useState([])
    const [filterInfo, setFilterInfo] = React.useState('')
    const rerender = React.useReducer(() => ({}), {})[1]
    const [IsSmartfilter, setIsSmartfilter] = React.useState(false);
    const [siteConfig, setSiteConfig] = React.useState([]);
    const [finalArray, setFinalArray] = React.useState([])
    const [updatedSmartFilter, setUpdatedSmartFilter] = React.useState(false)
    const [firstTimecallFilterGroup, setFirstTimecallFilterGroup] = React.useState(false)
    const [hideTimeEntryButton, setHideTimeEntryButton] = React.useState(0);
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
            if (element.UserGroupId == undefined) {
                getChilds(element, results);
                taskUsers.push(element);
            }
        }
        setTaskUsersData(taskUsers)
    }
    const getChilds = (item: any, items: any) => {
        item.children = [];
        for (let index = 0; index < items.length; index++) {
            let childItem = items[index];
            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                childItem.value = childItem.Id;
                childItem.label = childItem.Title;
                item.children.push(childItem);
                getChilds(childItem, items);
            }
        }
        if (item.children.length == 0) {
            delete item.children;
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
            FilterDataOnCheck();
        }
    }, [filterGroupsData && firstTimecallFilterGroup]);

    React.useEffect(() => {
        if (finalArray.length > 0 && updatedSmartFilter === true) {
            smartFiltercallBackData(finalArray, updatedSmartFilter)
        } else if (finalArray.length > 0 && updatedSmartFilter === false) {
            smartFiltercallBackData(finalArray, updatedSmartFilter)
        }
    }, [finalArray])

    let filterGroups: any = [{ Title: 'Portfolio', values: [], checked: [], checkedObj: [], expanded: [] },
    {
        Title: 'Type', values: [], checked: [], checkedObj: [], expanded: []
    },
    {
        Title: 'Sites', values: [], checked: [], checkedObj: [], expanded: []
    }, {
        Title: 'Status', values: [], checked: [], checkedObj: [], expanded: []
    }, {
        Title: 'Priority', values: [], checked: [], checkedObj: [], expanded: []
    }, {
        Title: 'TeamMember', values: [], checked: [], checkedObj: [], expanded: []
    }];

    const SortOrderFunction = (filterGroups: any) => {
        filterGroups.forEach((elem: any) => {
            return elem?.values?.sort((a: any, b: any) => a.SortOrder - b.SortOrder);
        });
    };

    const GetfilterGroups = () => {
        let SitesData: any = [];
        let PriorityData: any = [];
        let PortfolioData: any = [];
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
            if (element.TaxType == "Priority") {
                PriorityData.push(element);
            }
            if (element.TaxType == 'Percent Complete') {
                filterGroups[3].values.push(element);
                if (element.Title != "Completed (90-100)") {
                    filterGroups[3].checked.push(element.Id)
                }
            }
        });
        SitesData.forEach((element: any) => {
            if (element.Title != 'Master Tasks' && (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined))) {
                element.value = element.Id;
                element.label = element.Title;
                getChildsBasedOn(element, SitesData);
                filterGroups[2].values.push(element);
                if (element.Title != 'Shareweb Old')
                    filterGroups[2].expanded.push(element.Id);
            }
        })
        PriorityData.forEach((element: any) => {
            if (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined)) {
                element.value = element.Id;
                element.label = element.Title;
                getChildsBasedOn(element, PriorityData);
                filterGroups[4].values.push(element);
            }
        })
        TaskUsersData.forEach((element: any) => {
            filterGroups[5].values.push(element);
        });
        filterGroups.forEach((element: any, index: any) => {
            element.checkedObj = GetCheckedObject(element.values, element.checked)
        });
        SortOrderFunction(filterGroups);
        setFilterGroups(filterGroups);
        filterGroupsDataBackup = JSON.parse(JSON.stringify(filterGroups));
        filterGroupData1 = JSON.parse(JSON.stringify(filterGroups));
        rerender();
        getFilterInfo();
        if (filterGroups[0]?.checked?.length > 0) {
            setFirstTimecallFilterGroup(true);
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
        if (item.TaxType == 'Sites' || item.TaxType == 'Sites Old') {
            if (item.Title == "Shareweb Old" || item.Title == "DRR" || item.Title == "Small Projects" || item.Title == "Offshore Tasks" || item.Title == "Health" || item.Title == "Gender" || item.Title == "QA" || item.Title == "DE") {

            }
            else {
                filterGroups[2].checked.push(item.Id);
            }
        }

    }
    const getFilterInfo = () => {
        let filterInfo = '';
        let tempFilterInfo: any = []
        filterGroups.forEach((element: any) => {
            if (element.checked.length > 0)
                tempFilterInfo.push(element.Title + ' : (' + element.checked.length + ')')
        });
        filterInfo = tempFilterInfo.join(' | ');
        setFilterInfo(filterInfo)
    }
    const onCheck = (checked: any, index: any) => {
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
        checkBoxColor();

    }
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
    const handleSelectAll = (index: any, selectAllChecked: any) => {
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
    }

    const FilterDataOnCheck = function () {
        let portFolio: any[] = [];
        let site: any[] = [];
        let type: any[] = [];
        let teamMember: any[] = [];
        let priorityType: any[] = [];
        let percentComplete: any[] = [];
        let updateArray: any[] = [];
        let finalUpdateArray: any[] = [];
        filterGroupsData.forEach(function (filter) {
            if (filter.Title === 'Portfolio' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (port: any) { return portFolio.push(port); });
            }
            else if (filter.Title === 'Sites' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (elem: any) { return site.push(elem); });
            }
            else if (filter.Title === 'Type' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (elem1: any) { return type.push(elem1); });
            }
            else if (filter.Title === 'TeamMember' && filter.checked.length > 0 && filter.checkedObj.length > 0) {
                filter.checkedObj.map(function (elem2: any) { return teamMember.push(elem2); });
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
                        const match = elem4.Title.match(/\((\d+)\s*-\s*(\d+)\)/)
                        if (match) {
                            elem4.lowerBound = parseInt(match[1]);
                            elem4.upperBound = parseInt(match[2]);
                        }
                    }
                    return percentComplete.push(elem4);
                });
            }
        });
        allMasterTasksData?.map((data: any) => {
            if (checkPortfolioMatch(data, portFolio)) {
                updateArray.push(data);
            }
        });
        /// old code///
        allTastsData?.map((data: any) => {
            if (checkSiteMatch(data, site) && checkTypeMatch(data, type)) {
                if (percentCompleteMatch(data, percentComplete)) {
                    data.TotalTaskTime = data.TotalTaskTime
                    updateArray.push(data);
                }
            }
        });

        let updateArrayCopyData: any[] = [];
        let updateFinalData: any[] = [];
        if (updateArray.length > 0) {
            updateArray.map((filData) => {
                filData.TeamLeaderUser?.map((TeamData: any) => {
                    if (checkTeamMember(TeamData, teamMember)) {
                        updateArrayCopyData.push(filData);
                    }
                });
            });
        }

        if (updateArrayCopyData.length > 0) {
            updateArrayCopyData.map((priorityData) => {
                if (checkPriority(priorityData, priorityType)) {
                    updateFinalData.push(priorityData);
                }
            });
        }

        if (updateFinalData.length > 0) {
            setFinalArray(updateFinalData);
            finalArrayData = updateFinalData;
        } else if (updateArrayCopyData.length > 0) {
            setFinalArray(updateArrayCopyData);
            finalArrayData = updateArrayCopyData;
        } else {
            setFinalArray(updateArray);
            finalArrayData = updateArray;
        }
        console.log('finalArrayDatafinalArrayData', finalArrayData)
        setFirstTimecallFilterGroup(false);
    };
    const checkPortfolioMatch = (data: any, portfolioFilter: any): boolean => {
        if (portfolioFilter.length === 0) {
            return false;
        } else {
            return portfolioFilter.some((filter: any) => filter.Title === data.Item_x0020_Type);
        }
    };

    const checkSiteMatch = (data: any, siteFilter: any): boolean => {
        if (siteFilter.length === 0) {
            return false;
        } else {
            return siteFilter.some((fil: any) => fil.Title === data.siteType);
        }
    };

    const checkTypeMatch = (data: any, typeSite: any): boolean => {
        if (typeSite.length === 0) {
            return false;
        } else {
            return typeSite.some((value: any) => data?.TaskType?.Title === value.Title);
        }
    };

    const checkTeamMember = (data: any, teamMember: any): boolean => {
        if (teamMember.length === 0) {
            return false;
        } else {
            return teamMember.some((value: any) => value.Title === data.Title);
        }
    };

    const checkPriority = (data: any, checkPriority: any): boolean => {
        if (checkPriority.length === 0) {
            return false;
        } else {
            if (data.Priority !== undefined && data.Priority !== '' && data.Priority !== null) {
                return checkPriority.some((value: any) => value.Title === data.Priority || value.Title === data.Priority_x0020_Rank);
            }
        }
        return false;
    };
    const percentCompleteMatch = (percentData: any, percentComplete: any): boolean => {
        if (percentComplete.length === 0) {
            return false;
        } else {
            if (percentData.PercentComplete !== undefined && percentData.PercentComplete !== '' && percentData.PercentComplete !== null) {
                const percentCompleteValue = parseInt(percentData?.PercentComplete);
                return percentComplete.some((value: any) => percentCompleteValue >= value.lowerBound && percentCompleteValue <= value.upperBound);
            }
        }
        return false;
    };
    const ClearFilter = function () {
        item?.setLoaded(false);
        GetfilterGroups();
        setUpdatedSmartFilter(false);
        setFinalArray([]);
    };
    const UpdateFilterData = () => {
        item?.setLoaded(false);
        setUpdatedSmartFilter(true);
        FilterDataOnCheck();
    };

    const showSmartFilter = () => {
        if (IsSmartfilter == true) {
            setIsSmartfilter(false);
            checkBoxColor();
        } else {
            setIsSmartfilter(true);
            checkBoxColor();
        }
    }
    const checkBoxColor = () => {
        setTimeout(() => {
            const inputElement = document.getElementsByClassName('custom-checkbox-tree');
            if (inputElement) {
                for (let j = 0; j < inputElement.length; j++) {
                    const checkboxContainer = inputElement[j]
                    const childElements = checkboxContainer.getElementsByTagName('input');
                    const childElements2 = checkboxContainer.getElementsByClassName('rct-title');
                    for (let i = 0; i < childElements.length; i++) {
                        const checkbox = childElements[i];
                        const lable: any = childElements2[i];
                        if (lable?.style) {
                            lable.style.color = portfolioColor;
                        }
                        checkbox.classList.add('form-check-input', 'cursor-pointer');
                        if (checkbox.checked) {
                            checkbox.style.borderColor = portfolioColor;
                            checkbox.style.backgroundColor = portfolioColor;
                        } else {
                            checkbox.style.borderColor = '';
                            checkbox.style.backgroundColor = '';
                        }
                        if (lable?.innerHTML === "QA" || lable?.innerHTML === "Design") {
                            // checkbox.style.marginLeft = "14px !important;"
                            checkbox.classList.add('smartFilterAlignMarginQD');
                        }
                    }
                }
            }
        }, 200);
    }
    React.useEffect(() => {
        checkBoxColor();
    }, [expanded]);



    //*************************************************************smartTimeTotal*********************************************************************/
    const timeEntryIndex: any = {};
    const smartTimeTotal = async () => {
        item?.setLoaded(false);
        // setHideTimeEntryButton(1);
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
                    if(entry[taskTitle].Id === 168){
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
        console.log("timeEntryIndex", timeEntryIndex)
        UpdateFilterData();
        return allTastsData;
    };
    //*************************************************************smartTimeTotal End*********************************************************************/

    return (
        <>
            <section className="ContentSection smartFilterSection row">
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <div className="togglebox">
                            <span>
                                <label className="toggler full_width mb-10 active">
                                    <span style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter()}>
                                        {IsSmartfilter === true ?
                                            <SlArrowDown style={{ color: `${portfolioColor}`, width: '12px' }} /> : <SlArrowRight style={{ color: `${portfolioColor}`, width: '12px' }} />}
                                        <span className='mx-1'>SmartSearch – Filters</span>
                                    </span>
                                    <span className="ml20" style={{ color: `${portfolioColor}` }} >{filterInfo}</span>
                                    <span className="pull-right bg-color">
                                        {IsSmartfilter === true ? <span className='svg__iconbox svg__icon--share ' style={{ backgroundColor: `${portfolioColor}` }}> </span> : ''}
                                    </span>
                                </label>
                                {IsSmartfilter === true ? <div className="togglecontent" style={{ display: "block" }}>
                                    <div className="col-sm-12 pad0">
                                        <div className="togglecontent mt-1">
                                            <table width="100%" className="indicator_search">
                                                <tr className=''>
                                                    {filterGroupsData != null && filterGroupsData.length > 0 &&
                                                        filterGroupsData?.map((Group: any, index: any) => {
                                                            return (
                                                                <td valign="top" style={{ width: '16.67%' }}>
                                                                    <fieldset className='smartFilterStyle ps-2'>
                                                                        <legend className='SmartFilterHead'>
                                                                            <span className="mparent d-flex" style={{ borderBottom: "1.5px solid" + portfolioColor, color: portfolioColor }}>
                                                                                <input className={"form-check-input cursor-pointer"}
                                                                                    style={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : Group?.selectAllChecked === true ? { backgroundColor: portfolioColor, borderColor: portfolioColor } : { backgroundColor: '', borderColor: '' }}
                                                                                    type="checkbox"
                                                                                    checked={Group.selectAllChecked == undefined && Group?.values?.length === Group?.checked?.length ? true : Group.selectAllChecked}
                                                                                    onChange={(e) => handleSelectAll(index, e.target.checked)}
                                                                                />
                                                                                <div className="mx-1">{Group.Title}</div>
                                                                            </span>
                                                                        </legend>
                                                                        <div className="custom-checkbox-tree">
                                                                            <CheckboxTree
                                                                                nodes={Group.values}
                                                                                checked={Group.checked}
                                                                                expanded={expanded}
                                                                                onCheck={checked => onCheck(checked, index)}
                                                                                onExpand={expanded => setExpanded(expanded)}
                                                                                nativeCheckboxes={true}
                                                                                showNodeIcon={false}
                                                                                checkModel={'all'}
                                                                                icons={{
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
                                            <div className="col-md-12 pad0 text-end w-100 my-3 mb-5">
                                                <button type="button" style={{ color: `${portfolioColor}`, borderColor: ` ${portfolioColor}` }} className="btn btn-default ml5 pull-right mx-2" title="Clear All" onClick={ClearFilter}>
                                                    Clear Filter
                                                </button>
                                                <button type="button" style={{ backgroundColor: `${portfolioColor}`, borderColor: ` ${portfolioColor}` }} className="btn pull-right  btn-primary" title="Smart Filter" onClick={UpdateFilterData}>
                                                    Update Filter
                                                </button>
                                                <button type="button" disabled={hideTimeEntryButton === 1 ? true : false} style={{ backgroundColor: `${portfolioColor}`, borderColor: ` ${portfolioColor}` }} className="btn pull-right  btn-primary mx-2" title="Smart Filter" onClick={smartTimeTotal}>
                                                    Load Smart-Time
                                                </button>
                                                {/* <button type="button" disabled={hideTimeEntryButton === 1 ? true : false} style={{ backgroundColor: `${portfolioColor}`, borderColor: ` ${portfolioColor}` }} className="btn pull-right  btn-primary mx-2" title="Smart Filter" onClick={smartTimeTotal1}>
                                                    Load Smart-Time1
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>

                                </div> : ""}
                            </span>
                        </div>

                    </div>
                </div >
            </section>
        </>
    )

}
export default SmartFilterSearchGlobal;