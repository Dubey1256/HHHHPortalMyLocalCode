import * as React from 'react';
import { Web } from "sp-pnp-js";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import '../SmartFilterGolobalBomponents/Style.css'
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
let filterGroupsDataBackup: any = [];
let filterGroupData1: any = [];
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
            .select('Id', 'Title', 'IsVisible', 'ParentID', 'SmartSuggestions', 'TaxType', 'Description1', 'Item_x005F_x0020_Cover', 'listId', 'siteName', 'siteUrl', 'SortOrder', 'SmartFilters', 'Selectable', 'Parent/Id', 'Parent/Title')
            .top(4999)
            .expand('Parent')
            .get();

        smartmetaDetails?.map((newtest: any) => {
            if (newtest.Title == "SDC Sites" || newtest.Title == "Tasks" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Shareweb Old" || newtest.Title == "Master Tasks")
                newtest.DataLoadNew = false;
            else if (newtest.TaxType == 'Sites')
                siteConfigSites.push(newtest)
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
        if (filterGroupsData[0]?.checked?.length > 0) {
            FilterDataOnCheck();
        }
    }, [filterGroupsData])
    React.useEffect(() => {
        if (finalArray.length > 0 && updatedSmartFilter === true) {
            smartFiltercallBackData(finalArray, updatedSmartFilter)
        } else if (finalArray.length > 0 && updatedSmartFilter === false) {
            smartFiltercallBackData(finalArray, updatedSmartFilter)
        }
    }, [finalArray])
    // React.useEffect(() => {
    //     if (filterGroupData1.length > 0) {

    //     }
    // }, [])

    let filterGroups: any = [{ Title: 'Portfolio', values: [], checked: [], checkedObj: [], expanded: [] },
    {
        Title: 'Sites', values: [], checked: [], checkedObj: [], expanded: []
    }, {
        Title: 'Type', values: [], checked: [], checkedObj: [], expanded: []
    }, {
        Title: 'TeamMember', values: [], checked: [], checkedObj: [], expanded: []
    }, {
        Title: 'Priority', values: [], checked: [], checkedObj: [], expanded: []
    }];

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
            if (element.TaxType == 'Sites' || element.TaxType == 'Sites Old') {
                SitesData.push(element);
            }
            if (element.TaxType == 'Type') {
                filterGroups[2].values.push(element);
                filterGroups[2].checked.push(element.Id)
            }
            if (element.TaxType == "Priority") {
                PriorityData.push(element);
            }
        });
        SitesData.forEach((element: any) => {
            if (element.Title != 'Master Tasks' && (element.ParentID == 0 || (element.Parent != undefined && element.Parent.Id == undefined))) {
                element.value = element.Id;
                element.label = element.Title;
                getChildsBasedOn(element, SitesData);
                filterGroups[1].values.push(element);
                if (element.Title != 'Shareweb Old')
                    filterGroups[1].expanded.push(element.Id);
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
            filterGroups[3].values.push(element);
        });
        filterGroups.forEach((element: any, index: any) => {
            element.checkedObj = GetCheckedObject(element.values, element.checked)
        });
        setFilterGroups(filterGroups);
        filterGroupsDataBackup = JSON.parse(JSON.stringify(filterGroups));
        filterGroupData1 = JSON.parse(JSON.stringify(filterGroups));
        rerender()
        getFilterInfo();
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
            if (item.Title == "Shareweb Old" || item.Title == "DRR" || item.Title == "Small Projects" || item.Title == "Offshore Tasks" || item.Title == "Health") {

            }
            else {
                filterGroups[1].checked.push(item.Id);
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
        filterInfo = tempFilterInfo.join('| ');
        setFilterInfo(filterInfo)
    }



    const onCheck = (checked: any, index: any) => {
        let filterGroups = filterGroupsData;
        filterGroups[index].checked = checked;
        filterGroups[index].checkedObj = GetCheckedObject(filterGroups[index].values, checked)
        setFilterGroups(filterGroups)
        rerender()
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
    const FilterDataOnCheck = function () {
        let portFolio: any[] = [];
        let site: any[] = [];
        let type: any[] = [];
        let teamMember: any[] = [];
        let priorityType: any[] = [];
        let updateArray: any[] = [];
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
        });
        allMasterTasksData?.map((data: any) => {
            if (checkPortfolioMatch(data, portFolio)) {
                updateArray.push(data);
            }
        });

        allTastsData?.map((data: any) => {
            if (checkSiteMatch(data, site) && checkTypeMatch(data, type)) {
                updateArray.push(data);
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
            return typeSite.some((value: any) => value.Title === data?.TaskType?.Title);
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
    const ClearFilter = function () {
        // setFilterGroups((prevFile: any) => {
        //     return filterGroupsDataBackup;
        // });
        // // setFilterGroups(filterGroupsDataBackup);
        // console.log("filterGroupData1", filterGroupData1);
        GetfilterGroups();
        setUpdatedSmartFilter(false);
        setFinalArray([]);
        // FilterDataOnCheck();
    };
    const UpdateFilterData = () => {
        setUpdatedSmartFilter(true);
        FilterDataOnCheck();
    };

    const showSmartFilter = () => {
        if (IsSmartfilter == true) {
            setIsSmartfilter(false)
        } else {
            setIsSmartfilter(true)
        }
    }

    return (
        <>
            <section className="ContentSection">
                <div className="bg-wihite border p-2">
                    <div className="togglebox">
                        <div className="togglebox">
                            <span>
                                <label className="toggler full_width mb-10 active">
                                    <span style={{ color: `${portfolioColor}` }} onClick={() => showSmartFilter()}>
                                        {IsSmartfilter === true ?
                                            <SlArrowDown style={{ color: `${portfolioColor}` }} /> : <SlArrowRight style={{ color: `${portfolioColor}` }} />}
                                        <span>SmartSearch – Filters</span>
                                    </span>
                                    <span className="ml20" style={{ color: `${portfolioColor}` }} >{filterInfo}</span>
                                    <span className="pull-right bg-color">
                                        <span className='svg__iconbox svg__icon--share ' style={{ backgroundColor: `${portfolioColor}` }}> </span>
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
                                                                <td valign="top">
                                                                    <fieldset>
                                                                        <legend>
                                                                            <span className="mparent">{Group.Title}</span>
                                                                        </legend>
                                                                    </fieldset>
                                                                    <div className="custom-checkbox-container">
                                                                        <CheckboxTree
                                                                            nodes={Group.values}
                                                                            checked={Group.checked}
                                                                            expanded={expanded}
                                                                            onCheck={checked => onCheck(checked, index)}
                                                                            onExpand={expanded => setExpanded(expanded)}
                                                                            nativeCheckboxes={true}
                                                                            showNodeIcon={false}
                                                                            checkModel={'all'}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            )
                                                        })

                                                    }
                                                </tr>
                                            </table>
                                            <div className="col-md-12 pad0 text-end w-100 my-3 mb-5">
                                                <button type="button" style={{ backgroundColor: `${portfolioColor}`, borderColor: ` ${portfolioColor}` }} className="btn pull-right  btn-primary mx-2" title="Smart Filter" onClick={UpdateFilterData}>
                                                    Update Filter
                                                </button>
                                                <button type="button" style={{ color: `${portfolioColor}`, borderColor: ` ${portfolioColor}` }} className="btn btn-default ml5 pull-right " title="Clear All" onClick={ClearFilter}>
                                                    Clear Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div> : ""}
                            </span>
                        </div>

                    </div>
                </div >
            </section >
        </>
    )

}
export default SmartFilterSearchGlobal;