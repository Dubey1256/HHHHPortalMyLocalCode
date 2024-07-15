import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import { Col, Row } from "react-bootstrap";
import Tooltip from "./Tooltip";
import { deepCopy, myContextValue } from "./globalCommon";
import TeamSmartFilter from "./SmartFilterGolobalBomponents/TeamSmartFilter";
import DynamicColumnSettingGallary from "../webparts/manageWebpartTemplate/components/DynamicColumnSettingGallary";
import Picker from "./EditTaskPopup/SmartMetaDataPicker";
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import * as Moment from "moment";
let portfolioColor: any = '#2F5596';
let CreatedSmartFavId: any;
let BackupTaskCategoriesData: any = [];
let SmartFavDashboardTitle: any = undefined;
let UpdatedItem: any = [];
let BackupNewItem: any = [];
let IsShowTileCopy: any = false;
let onDropAction: any = [];
let AutoCompleteItemsArray: any = [];
let settingConfrigrationData: any = [];
let WebPartGalleryColumnSettingData = {}
let tableIdsCopy = "";
let columns: any = [];
let AllTaskUsers: any = [];
const AddEditWebpartTemplate = (props: any) => {
    const [FilterColumn, setFilterColumn] = React.useState<any>([{ "Column0": "", "Id": 0, "DataSource": '' }]);
    const [SelectedColumn, setSelectedColumn] = React.useState<any>([{ "key": "Status", "text": "Status" }, { "key": "WorkingMember", "text": "WorkingMember" }, { "key": "TeamLeader", "text": "TeamLeader" }, { "key": "TeamMember", "text": "TeamMember" }, { "key": "Categories", "text": "Categories" },
    { "key": "WorkingDate", "text": "WorkingDate" }, { "key": "DueDate", "text": "DueDate" }, { "key": "Priority", "text": "Priority" }]);
    let [StatusOptions, setStatusOptions] = useState([]);
    let [PriorityOptions, setPriorityOptions] = useState([])
    const [categorySearchKey, setCategorySearchKey] = useState<any>("");
    const [SearchedCategoryData, setSearchedCategoryData] = useState<any>([]);
    const [TaskCategoriesData, setTaskCategoriesData] = useState<any>([]);
    const [IsComponentPicker, setIsComponentPicker] = useState<any>(false);
    props.props.siteUrl = props?.props?.Context?._pageContext?._web?.absoluteUrl;
    props.props.AdminconfigrationID = props?.props?.AdminConfigurationListId;
    try {
        columns = deepCopy(props?.columns);
    } catch (error) {
        console.log(error)
    }
    const params = new URLSearchParams(window.location.search);
    let DashboardId: any = params.get('DashBoardId');
    if (DashboardId == undefined || DashboardId == '')
        DashboardId = 1;
    const ContextData: any = useContext(myContextValue);
    let defaultConfig = { "WebpartTitle": '', "TileName": '', "ShowWebpart": true, "IsDashboardFav": false, "WebpartPosition": { "Row": 0, "Column": 0 }, "GroupByView": '', "Id": 1, "AdditonalHeader": false, "smartFevId": '', "DataSource": "Tasks", "selectFilterType": "smartFav", "selectUserFilterType": "AssignedTo" }
    const [NewItem, setNewItem]: any = useState<any>([defaultConfig]);


    const [columnSettingPopup, setColumnSettingPopup] = React.useState<any>(false);
    const [tableSettingPageSize, setTableSettingPageSize] = React.useState(0);
    const [wrapperHeight, setWrapperHeight] = React.useState("");
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [sorting, setSorting] = React.useState([]);
    const [showHeaderLocalStored, setShowHeaderLocalStored] = React.useState(false);
    const [tableId, setTableId] = React.useState("");
    const [columnVisibility, setColumnVisibility] = React.useState<any>({ descriptionsSearch: false, commentsSearch: false, timeSheetsDescriptionSearch: false });
    // const [settingConfrigrationData, setSettingConfrigrationData] = React.useState([]);

    const CloseConfiguationPopup = () => {
        setNewItem([]);
        props?.CloseConfigPopup(false, undefined)
    }
    const formatId = (id: number): string => {
        const paddedId = '00' + id;
        return paddedId.slice(-3);
    }
    const SaveConfigPopup = async () => {

        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            if (props?.DashboardPage !== true) {
                await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").orderBy("Created", false).getAll().then(async (data: any) => {
                    let result: any;
                    if (data?.length && data[data.length - 1].Value != undefined && data[data.length - 1].Value != '') {
                        result = parseInt(data[data.length - 1].Value) + 1;
                    }
                    else {
                        result = data?.length + 1;
                    }
                    let newArray = [...NewItem];
                    if (BackupNewItem?.length)
                        newArray = BackupNewItem;
                    newArray?.forEach((item: any, Itemindex: any) => {
                        item.WebpartTitle = SmartFavDashboardTitle;
                        item.IsShowTile = IsShowTileCopy;
                        if (item?.IsShowTile === true)
                            item.TileName = item.WebpartTitle.replaceAll(" ", "")
                        else if (item?.IsShowTile != true)
                            item.TileName = '';
                        if (props?.EditItem == undefined || props?.EditItem == '') {
                            item.WebpartId = 'WP-' + formatId(result)
                        }
                        if (CreatedSmartFavId)
                            item.smartFevId = CreatedSmartFavId;
                        delete item.IsShowTile;
                    })
                    if (onDropAction)
                        newArray[0].onDropAction = onDropAction;
                    newArray[0].WebPartGalleryColumnSettingData = WebPartGalleryColumnSettingData;
                    setNewItem(newArray);
                    if (props?.EditItem != undefined && props?.EditItem != '') {
                        await web.lists.getById(props?.props?.AdminConfigurationListId).items.getById(props?.EditItem?.UpdatedId).update({ Title: SmartFavDashboardTitle, Configurations: BackupNewItem != undefined && BackupNewItem?.length > 0 ? JSON.stringify(newArray[0]) : JSON.stringify(NewItem[0]) })
                            .then(async (res: any) => {
                                setNewItem([]);
                                onDropAction = [];
                                CreatedSmartFavId = undefined;
                                SmartFavDashboardTitle = undefined;
                                props?.CloseConfigPopup(true, 'Update')
                                if (props?.SingleWebpart == true) {
                                    if (ContextData != undefined && ContextData?.callbackFunction != undefined)
                                        ContextData?.callbackFunction(false);
                                }

                            }).catch((err: any) => {
                                console.log(err);
                            })
                    }
                    else {
                        await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: SmartFavDashboardTitle, Key: "WebpartTemplate", Value: result != undefined ? result.toString() : undefined, Configurations: newArray != undefined && newArray?.length > 0 ? JSON.stringify(newArray[0]) : JSON.stringify(NewItem[0]) })
                            .then(async (res: any) => {
                                onDropAction = [];
                                CreatedSmartFavId = undefined;
                                SmartFavDashboardTitle = undefined;
                                setNewItem([]);
                                props?.CloseConfigPopup(true, 'Add')
                            }).catch((err: any) => {
                                console.log(err);
                            })
                    }
                    BackupNewItem = [];
                }).catch((err: any) => {
                    console.log(err);
                })
            }
            else if (props?.DashboardPage === true) {
                await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").orderBy("Created", false).getAll().then(async (data: any) => {
                    let FilteredData = data?.filter((config: any) => config?.Value == DashboardId)[0];
                    if (props?.DashboardConfigBackUp && UpdatedItem[0]?.Id !== undefined) {
                        props.DashboardConfigBackUp.forEach((item: any) => {
                            if (item?.WebpartId !== undefined && item.WebpartId === UpdatedItem[0].WebpartId) {
                                Object.keys(UpdatedItem[0]).forEach((key) => {
                                    if (key in item) {
                                        item[key] = UpdatedItem[0][key];
                                        if (key == 'TileName') {
                                            if (IsShowTileCopy === true)
                                                item.TileName = item.WebpartTitle.replaceAll(" ", "")
                                            else if (IsShowTileCopy != true)
                                                item.TileName = '';
                                        }
                                        if (key == 'smartFevId') {
                                            if (CreatedSmartFavId && item?.IsDashboardFav != true) {
                                                item[key] = CreatedSmartFavId;
                                                item['IsDashboardFav'] = true;
                                            }
                                            item['WebpartTitle'] = SmartFavDashboardTitle
                                        }
                                        if (key == 'onDropAction')
                                            item['onDropAction'] = onDropAction
                                    }
                                });
                            }
                            delete item?.UpdatedId
                        });
                    }
                    await web.lists.getById(props?.props?.AdminConfigurationListId).items.getById(FilteredData?.Id).update({ Title: FilteredData?.Title, Configurations: JSON.stringify(props?.DashboardConfigBackUp) })
                        .then(async (res: any) => {
                            onDropAction = [];
                            CreatedSmartFavId = undefined
                            SmartFavDashboardTitle = undefined;
                            setNewItem([]);
                            props?.CloseConfigPopup(true)
                            if (ContextData != undefined && ContextData?.callbackFunction != undefined)
                                ContextData?.callbackFunction(false);
                        }).catch((err: any) => {
                            console.log(err);
                        })

                }).catch((err: any) => {
                    console.log(err);
                })
            }

        } catch (error) {
            console.log(error);
        }

    }
    const CustomHeaderConfiguration = () => {
        return (
            <>
                <div className='siteColor subheading'>
                    {props?.EditItem != undefined && props?.EditItem != '' ? <span>Edit Webpart - {props?.EditItem?.WebpartTitle} </span> : <span>Add Webpart</span>}
                </div>
                {props?.EditItem != undefined && props?.EditItem != '' ? <Tooltip ComponentId={11975} /> : <Tooltip ComponentId={1107} />}

            </>
        );
    };
    const handleDashTitle = (Value: any) => {
        SmartFavDashboardTitle = Value;
    }
    const getChildsCate = (item: any, items: any) => {
        item.childs = [];
        $.each(items, function (index: any, childItem: any) {
            if (
                childItem.ParentID != undefined &&
                parseInt(childItem.ParentID) == item.ID
            ) {
                childItem.isChild = true;
                item.childs.push(childItem);
                getChildsCate(childItem, items);
            }
        });
    };
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems.map((taxItem: any) => {
            if (taxItem.TaxType === taxType) Items.push(taxItem);
        });
        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    };
    var loadSmartTaxonomyPortfolioPopup = (AllTaxonomyItems: any, SmartTaxonomy: any) => {
        var TaxonomyItems: any = [];
        var uniqueNames: any = [];
        $.each(AllTaxonomyItems, function (index: any, item: any) {
            if (item.ParentID == 0 && SmartTaxonomy == item.TaxType) {
                TaxonomyItems.push(item);
                getChildsCate(item, AllTaxonomyItems);
                if (item.childs != undefined && item.childs.length > 0) {
                    TaxonomyItems.push(item);
                }
                uniqueNames = TaxonomyItems.filter((val: any, id: any, array: any) => {
                    return array?.indexOf(val) == id;
                });
            }
        });
        return uniqueNames;
    };
    const SmartMetaDataListInformations = async () => {
        let AllSmartDataListData: any = [];
        let AllCategoriesData: any = [];
        let CategoriesGroupByData: any = [];
        let PriorityRank: any = [];
        let PercentComplete: any = [];
        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            AllSmartDataListData = await web.lists.getById(props?.props?.SmartMetadataListID)
                .items.select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail").expand("Author,Editor,IsSendAttentionEmail").getAll();
            AllCategoriesData = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Categories");
            PercentComplete = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Percent Complete");
            PriorityRank = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Priority Rank");
            PriorityRank = PriorityRank.toReversed()
            PercentComplete = PercentComplete.filter((percentComplete: any) => percentComplete?.ParentId != undefined && percentComplete?.ParentId != '');
            PercentComplete = PercentComplete.sort((a: any, b: any) => { return a.SortOrder - b.SortOrder; });
            AllSmartDataListData?.map((SmartItemData: any, index: any) => {
                SmartItemData.newTitle = SmartItemData.Title;
            })
            PercentComplete?.map((percentComplete: any) => {
                percentComplete.value = parseFloat(percentComplete?.Title?.split('%')[0])
                percentComplete.status = percentComplete?.Title
            });
            setStatusOptions(PercentComplete)
            PriorityRank?.map((priorityrank: any) => {
                priorityrank.value = parseInt(priorityrank?.Title)
                priorityrank.status = priorityrank?.Title
            });
            setPriorityOptions(PriorityRank)
            if (AllCategoriesData?.length > 0) {
                CategoriesGroupByData = loadSmartTaxonomyPortfolioPopup(AllCategoriesData, "Categories");
                if (CategoriesGroupByData?.length > 0) {
                    CategoriesGroupByData?.map((item: any) => {
                        if (item.newTitle != undefined) {
                            item["Newlabel"] = item.newTitle;
                            AutoCompleteItemsArray.push(item);
                            if (
                                item.childs != null &&
                                item.childs != undefined &&
                                item.childs.length > 0
                            ) {
                                item.childs.map((childitem: any) => {
                                    if (childitem.newTitle != undefined) {
                                        childitem["Newlabel"] =
                                            item["Newlabel"] + " > " + childitem.Title;
                                        AutoCompleteItemsArray.push(childitem);
                                    }
                                    if (childitem.childs.length > 0) {
                                        childitem.childs.map((subchilditem: any) => {
                                            if (subchilditem.newTitle != undefined) {
                                                subchilditem["Newlabel"] =
                                                    childitem["Newlabel"] + " > " + subchilditem.Title;
                                                AutoCompleteItemsArray.push(subchilditem);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                if (AutoCompleteItemsArray?.length > 0) {
                    AutoCompleteItemsArray = AutoCompleteItemsArray.reduce(function (previous: any, current: any) {
                        var alredyExists =
                            previous.filter(function (item: any) { return item.Title === current.Title; }).length > 0;
                        if (!alredyExists) {
                            previous.push(current);
                        }
                        return previous;
                    },
                        []);
                }
            }
        } catch (error) {
            console.log("Error : ", error.message);
        }
    };
    const loadTaskUsers = async () => {
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        AllTaskUsers = await web.lists
            .getById(props?.props?.TaskUserListID).items.select('Id', 'IsActive', 'UserGroupId', 'Suffix', 'Title', 'Email', 'SortOrder', 'Role', 'Company', 'ParentID1', 'TaskStatusNotification', 'Status', 'Item_x0020_Cover', 'AssingedToUserId', 'isDeleted', 'AssingedToUser/Title', 'AssingedToUser/Id', 'AssingedToUser/EMail', 'ItemType')
            .filter('IsActive eq 1').expand('AssingedToUser').orderBy('SortOrder', true).orderBy("Title", true).get();
    }
    useEffect(() => {
        loadTaskUsers()
        SmartMetaDataListInformations()
        let filetrColumn: any = []
        if (props?.EditItem != undefined && props?.EditItem != '') {
            if (props?.EditItem?.onDropAction != undefined && props?.EditItem?.onDropAction?.length) {
                onDropAction = [...props?.EditItem?.onDropAction]
                props?.EditItem?.onDropAction?.map((filterColumn: any) => {
                    let obj: any = {}
                    obj["Column" + filterColumn?.Id] = '';
                    obj["Id"] = filterColumn?.Id;
                    obj["DataSource"] = filterColumn?.SelectedField;
                    obj["SelectedField"] = filterColumn?.SelectedField;
                    if (filterColumn?.SelectedField == 'WorkingDate' || filterColumn?.SelectedField == 'DueDate') {
                        let SplitDate: any = filterColumn?.SelectedValue.split('/')
                        let serverDate: any = Moment(SplitDate[1] + '/' + SplitDate[0] + '/' + SplitDate[2])
                        obj["SelectedValue"] = serverDate._d.setHours(0, 0, 0, 0);
                    }
                    else if (filterColumn?.SelectedField == 'TeamLeader' || filterColumn?.SelectedField == 'TeamMember' || filterColumn?.SelectedField == 'WorkingMember') {
                        let mail: any = [];
                        filterColumn?.SelectedValue?.map((User: any) => {
                            mail.push(User?.email)
                        })
                        obj["SelectedValue"] = mail;
                    }
                    else if (filterColumn?.SelectedField == "Categories") {
                        setTaskCategoriesData(filterColumn?.SelectedValue)
                    }
                    else {
                        obj["SelectedValue"] = filterColumn?.SelectedValue;
                    }
                    filetrColumn?.push(obj);

                });
                setFilterColumn(filetrColumn)
            }
            if (props?.EditItem?.WebpartTitle)
                SmartFavDashboardTitle = props?.EditItem?.WebpartTitle;
            let newArray: any = []
            if (props?.SingleWebpart == true)
                newArray.push(props?.EditItem)
            else
                newArray = JSON.parse(JSON.stringify(props?.EditItem?.Configurations));
            newArray?.forEach((item: any, Itemindex: any) => {
                item.IsDefaultTile = false;
                item.IsShowTile = false;
                if (item?.selectFilterType == undefined)
                    item.selectFilterType = 'smartFav'
                if (item.AdditonalHeader === true) {
                    item.IsDefaultTile = true;
                }
                if (item.TileName != undefined && item.TileName != '') {
                    item.IsShowTile = true;
                    IsShowTileCopy = true;
                }
                if (item?.smartFevId != undefined && item?.smartFevId != '') {
                    item.smartFevId = parseInt(item?.smartFevId)
                }
                tableIdsCopy = props?.EditItem?.WebPartGalleryColumnSettingData?.tableId
                settingConfrigrationData = [];
                settingConfrigrationData = settingConfrigrationData.concat(props?.EditItem?.WebPartGalleryColumnSettingData);
                defultColumnPrepare()
            });
            setNewItem(newArray);
            BackupNewItem = [...newArray];
            UpdatedItem = JSON.parse(JSON.stringify(newArray));
        }
        else {
            setNewItem([defaultConfig])
        }
    }, [props?.EditItem]);

    const defultColumnPrepare = () => {
        if (columns?.length > 0 && columns != undefined) {
            let sortingDescData: any = [];
            let columnVisibilityResult: any = {};
            let preSetColumnSettingVisibility: any = {};
            let updatedSelectedFilterPannelData: any = {};
            let preSetColumnOrdring: any = [];
            console.log(settingConfrigrationData);
            columns = columns?.map((updatedSortDec: any) => {
                try {
                    if (settingConfrigrationData?.length > 0 && settingConfrigrationData[0]?.tableId === tableIdsCopy) {
                        const preSetColumnsValue = settingConfrigrationData[0]
                        if (preSetColumnsValue?.tableId === tableIdsCopy) {
                            preSetColumnSettingVisibility = preSetColumnsValue?.columnSettingVisibility;
                            preSetColumnOrdring = preSetColumnsValue
                            setShowHeaderLocalStored(preSetColumnsValue?.showHeader)
                            if (preSetColumnSettingVisibility != undefined && preSetColumnSettingVisibility != '' && Object.keys(preSetColumnSettingVisibility)?.length) {
                                const columnId = updatedSortDec.id;
                                if (preSetColumnSettingVisibility[columnId] !== undefined) {
                                    updatedSortDec.isColumnVisible = preSetColumnSettingVisibility[columnId];
                                }
                            }
                        } else if (updatedSortDec?.isColumnVisible === false) {
                            columnVisibilityResult[updatedSortDec.id] = updatedSortDec.isColumnVisible;
                        }
                    } else if (updatedSortDec?.isColumnVisible === false) {
                        columnVisibilityResult[updatedSortDec.id] = updatedSortDec.isColumnVisible;
                    }
                    if (updatedSortDec.isColumnDefultSortingDesc === true) {
                        let obj = { 'id': updatedSortDec.id, desc: true };
                        sortingDescData.push(obj);
                    } else if (updatedSortDec.isColumnDefultSortingAsc === true) {
                        let obj = { 'id': updatedSortDec.id, desc: false };
                        sortingDescData.push(obj);
                    }
                    if (updatedSortDec.placeholder != "" && updatedSortDec.placeholder != undefined) {
                        updatedSelectedFilterPannelData[updatedSortDec.id] = {
                            [updatedSortDec.id]: updatedSortDec.id,
                            Selected: updatedSortDec.isColumnVisible,
                            lebel: updatedSortDec.placeholder
                        };
                    }
                    return updatedSortDec;
                } catch (error) {
                    console.log(error);
                }
            });
            if (preSetColumnOrdring?.columnOrderValue?.length > 0 && preSetColumnOrdring?.tableId === tableIdsCopy) {
                const colValue = preSetColumnOrdring?.columnOrderValue?.map((elem: any) => elem.id);
                setColumnOrder(colValue);
            } else if (tableIdsCopy) {
                const colValue = columns?.map((elem: any) => elem.id);
                setColumnOrder(colValue);
            }
            if (preSetColumnOrdring?.tableHeightValue?.length > 0 && preSetColumnOrdring?.tableHeightValue != "") {
                setWrapperHeight(preSetColumnOrdring?.tableHeightValue);
            } else {
                setWrapperHeight("");
            }
            try {
                if ((Object.keys(preSetColumnSettingVisibility) != null && Object.keys(preSetColumnSettingVisibility) != undefined) && Object.keys(preSetColumnSettingVisibility)?.length > 0 && preSetColumnOrdring?.tableId === tableIdsCopy) {
                    setColumnVisibility((prevCheckboxes: any) => ({ ...prevCheckboxes, ...preSetColumnSettingVisibility }));
                } else if (Object.keys(columnVisibilityResult)?.length > 0) {
                    setColumnVisibility((prevCheckboxes: any) => ({ ...prevCheckboxes, ...columnVisibilityResult }));
                }
            } catch (error) {
                console.log(error)
            }

            if (sortingDescData.length > 0) {
                setSorting(sortingDescData);
            } else {
                setSorting([]);
            }
            try {
                if (settingConfrigrationData?.length > 0 && settingConfrigrationData[0]?.tableId === tableIdsCopy) {
                    const preSetColumnsValue = settingConfrigrationData[0]
                    if (preSetColumnsValue?.tableId === tableIdsCopy) {
                        makeConfrigrationColumnsDefult()
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    const makeConfrigrationColumnsDefult = () => {
        try {
            if (settingConfrigrationData?.length > 0 && settingConfrigrationData[0]?.tableId === tableIdsCopy) {
                const eventSetting = settingConfrigrationData[0]
                if (eventSetting?.columanSize?.length > 0) {
                    columns?.map((elem1: any) => {
                        eventSetting?.columanSize?.map((colSize: any) => {
                            if (colSize?.id === elem1?.id) {
                                let sizeValue = { ...colSize }
                                elem1.size = parseInt(sizeValue?.size);
                            }
                        })
                        return elem1;
                    })
                }
                if (columns?.length > 0 && columns != undefined) {
                    let sortingDescData: any = [];
                    if (Object?.keys(eventSetting?.columnSorting)?.length > 0 || eventSetting?.columanSize?.length > 0) {
                        columns?.map((updatedSortDec: any) => {
                            let idMatch = updatedSortDec.id;
                            if (eventSetting?.columnSorting[idMatch]?.id === updatedSortDec.id) {
                                if (eventSetting?.columnSorting[idMatch]?.desc === true) {
                                    let obj = { 'id': updatedSortDec.id, desc: true }
                                    sortingDescData.push(obj);
                                }
                                if (eventSetting?.columnSorting[idMatch]?.asc === true) {
                                    let obj = { 'id': updatedSortDec.id, desc: false }
                                    sortingDescData.push(obj);
                                }
                            }
                            eventSetting?.columanSize?.map((elem: any) => {
                                if (elem?.id === updatedSortDec.id) {
                                    let sizeValue = { ...elem }
                                    updatedSortDec.size = parseInt(sizeValue?.size);
                                }
                            })
                            return updatedSortDec
                        });
                    }
                    if (sortingDescData.length > 0) {
                        setSorting(sortingDescData);
                    } else {
                        setSorting([]);
                    }
                }
                try {
                    if (Object?.keys(eventSetting?.showPageSizeSetting)?.length > 0 && eventSetting?.showPageSizeSetting != undefined) {
                        if (eventSetting?.showPageSizeSetting?.tablePageSize > 0) {
                            setTableSettingPageSize(eventSetting?.showPageSizeSetting?.tablePageSize)
                        } else {
                            setTableSettingPageSize(0);
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    const smartFiltercallBackData = React.useCallback(async (Favorite) => {
        let AddnewItem: any = [];
        Favorite.Title = SmartFavDashboardTitle;
        AddnewItem.push(Favorite);
        let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        if (props?.DashboardPage !== true) {
            if (props?.EditItem?.smartFevId == undefined || props?.EditItem?.smartFevId == '') {
                const postData = {
                    Configurations: JSON.stringify(AddnewItem),
                    Key: 'WebPartGallarySmartfavorites',
                    Title: 'WebPartGallarySmartfavorites'
                };
                await web.lists.getByTitle("AdminConfigurations").items.add(postData).then((result: any) => {
                    CreatedSmartFavId = result?.data?.Id;
                    console.log("Successfully Added SmartFavorite");
                    SaveConfigPopup()
                })
            }
            else if (props?.EditItem?.smartFevId != undefined && props?.EditItem?.smartFevId != '') {
                await web.lists.getByTitle("AdminConfigurations").items.getById(props?.EditItem?.smartFevId)
                    .update({
                        Configurations: JSON.stringify(AddnewItem),
                        Key: 'WebPartGallarySmartfavorites',
                        Title: 'WebPartGallarySmartfavorites'
                    }).then((res: any) => {
                        console.log("Successfully Added SmartFavorite");
                        SaveConfigPopup()
                        console.log('res', res)
                    });
            }
        }
        else if (props?.DashboardPage === true) {
            if (props?.EditItem?.IsDashboardFav != true) {
                const postData = {
                    Configurations: JSON.stringify(AddnewItem),
                    Key: 'WebPartGallarySmartfavorites',
                    Title: 'WebPartGallarySmartfavorites'
                };
                await web.lists.getByTitle("AdminConfigurations").items.add(postData).then((result: any) => {
                    CreatedSmartFavId = result?.data?.Id;
                    console.log("Successfully Added SmartFavorite");
                    SaveConfigPopup()
                })
            }
            else if (props?.EditItem?.IsDashboardFav == true) {
                await web.lists.getByTitle("AdminConfigurations").items.getById(props?.EditItem?.smartFevId)
                    .update({
                        Configurations: JSON.stringify(AddnewItem),
                        Key: 'WebPartGallarySmartfavorites',
                        Title: 'WebPartGallarySmartfavorites'
                    }).then((res: any) => {
                        console.log("Successfully Added SmartFavorite");
                        SaveConfigPopup()
                        console.log('res', res)
                    });
            }
        }

    }, []);
    function generateRandomString(length: any) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }
    const fetchSettingConfrigrationData = async (event: any) => {
        try {
            let sortingDescData: any = [];
            let columnVisibilityResult: any = {};
            setTableId(generateRandomString(10));
            columns?.map((updatedSortDec: any) => {
                if (updatedSortDec.isColumnDefultSortingDesc === true) {
                    let obj = { 'id': updatedSortDec.id, desc: true };
                    sortingDescData.push(obj);
                } else if (updatedSortDec.isColumnDefultSortingAsc === true) {
                    let obj = { 'id': updatedSortDec.id, desc: false };
                    sortingDescData.push(obj);
                }
                if (updatedSortDec?.isColumnVisible === false) {
                    columnVisibilityResult[updatedSortDec.id] = updatedSortDec.isColumnVisible;
                }
            })
            const colValue = columns?.map((elem: any) => elem.id);
            setColumnOrder(colValue);
            if (Object.keys(columnVisibilityResult)?.length > 0) {
                setColumnVisibility(columnVisibilityResult);
            }
            if (sortingDescData.length > 0) {
                setSorting(sortingDescData);
            } else {
                setSorting([]);
            }
        } catch (error) {
            console.log("backup Json parse error backGround Loade All Task Data")
        }
    };
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                if (props?.columns?.length > 0 && !props?.EditItem)
                    await fetchSettingConfrigrationData('');
            } catch (error) {
                console.error('Error:', error);
            }
        }; fetchData();
    }, [props?.columns]);

    const openTableSettingPopup = (event: any) => {
        if (event === "favBased") {
            setColumnSettingPopup(true);
        }
    }
    const columnSettingCallBack = React.useCallback(async (eventSetting: any) => {
        if (eventSetting != 'close') {
            WebPartGalleryColumnSettingData = { ...eventSetting }
            setColumnSettingPopup(false)
        } else {
            setColumnSettingPopup(false)
        }
    }, []);
    const handleDataSourceChange = (event: any, index: any, column: any) => {
        let isPush = true
        let object: any = {}
        object['SelectedField'] = event;
        object['SelectedValue'] = '';
        object['Id'] = index;
        if (onDropAction != undefined && onDropAction?.length) {
            onDropAction?.forEach((column: any) => {
                if (column?.Id == index) {
                    column['SelectedField'] = event;
                    column['SelectedValue'] = '';
                    isPush = false;
                }
            })
        }
        if (isPush)
            onDropAction.push(object)

        let updatedItems = [...FilterColumn]
        updatedItems[index] = { ...column, DataSource: event, SelectedField: event };
        setFilterColumn(updatedItems);
    };
    const StatusFilterChange = (event: any, index: any, column: any) => {
        let isPush = true
        let object: any = {}
        object['SelectedValue'] = event;
        object['Id'] = index;
        if (onDropAction != undefined && onDropAction?.length) {
            onDropAction?.forEach((column: any) => {
                if (column?.Id == index) {
                    column['SelectedValue'] = event;
                    isPush = false;
                }
            })
        }
        if (isPush)
            onDropAction.push(object)
        let updatedItems = [...FilterColumn]
        updatedItems[index] = { ...column, SelectedValue: event };
        setFilterColumn(updatedItems);
    };
    const PriorityFilterChange = (event: any, index: any, column: any) => {
        let isPush = true
        let object: any = {}
        object['SelectedValue'] = event;
        object['Id'] = index;
        if (onDropAction != undefined && onDropAction?.length) {
            onDropAction?.forEach((column: any) => {
                if (column?.Id == index) {
                    column['SelectedValue'] = event;
                    isPush = false;
                }
            })
        }
        if (isPush)
            onDropAction.push(object)
        let updatedItems = [...FilterColumn]
        updatedItems[index] = { ...column, SelectedValue: event };
        setFilterColumn(updatedItems);
    };

    const AddMoreFilter = (column: any) => {
        let updatedItems = [...FilterColumn]
        let obj: any = {};
        let Title = column?.Id + 1
        obj["Column" + Title] = '';
        obj["Id"] = column?.Id + 1;
        obj.SelectedColumn = SelectedColumn
        updatedItems.push(obj)
        setFilterColumn(updatedItems);
    };
    const RemoveFilter = (item: any) => {
        let updatedItems = [...FilterColumn];
        let array: any = []
        updatedItems?.forEach((obj: any) => {
            if (obj?.Id != item?.Id) {
                array.push(obj)
            }
        })
        //  updatedItems = updatedItems.filter((e: any) => e?.Id != item?.Id)
        setFilterColumn([...array]);
        onDropAction = onDropAction.filter((e: any) => e?.SelectedField != item?.SelectedField)
    };
    const autoSuggestionsForCategory = (e: any) => {
        let searchedKey: any = e.target.value;
        setCategorySearchKey(e.target.value);
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            AutoCompleteItemsArray?.map((itemData: any) => {
                if (
                    itemData.Newlabel.toLowerCase().includes(searchedKey.toLowerCase())
                ) {
                    tempArray.push(itemData);
                }
            });
            setSearchedCategoryData(tempArray);
        } else {
            setSearchedCategoryData([]);
        }
    };
    const removeCategoryItem = (TypeCategory: any) => {
        let tempString: any;
        let tempArray2: any = [];
        BackupTaskCategoriesData = [];
        TaskCategoriesData?.map((dataType: any) => {
            if (dataType.Title != TypeCategory) {
                tempArray2.push(dataType);
                BackupTaskCategoriesData.push(dataType);
            }
        });
        if (tempArray2 != undefined && tempArray2.length > 0) {
            tempArray2.map((itemData: any) => {
                tempString =
                    tempString != undefined
                        ? tempString + ";" + itemData.Title
                        : itemData.Title;
            });
        }
        setTaskCategoriesData(tempArray2);
        let SelectCategories: any = []
        BackupTaskCategoriesData?.map((cate: any) => {
            SelectCategories?.push({ Id: cate?.Id, Title: cate?.Title != undefined ? cate?.Title : cate?.newTitle })
        })
        if (onDropAction != undefined && onDropAction?.length) {
            onDropAction?.forEach((column: any) => {
                if (column?.SelectedField == 'Categories') {
                    column['SelectedValue'] = SelectCategories;
                }
            })
        }
    };
    const EditComponentPicker = (item: any, usedFor: any) => {
        setIsComponentPicker(true);
    };
    const setSelectedCategoryData = (selectCategoryData: any, usedFor: any) => {
        setIsComponentPicker(false);
        let uniqueIds: any = {};
        selectCategoryData.forEach((existingData: any) => {
            BackupTaskCategoriesData.push(existingData);
        });
        const result: any = BackupTaskCategoriesData.filter((item: any) => {
            if (!uniqueIds[item.Id]) {
                uniqueIds[item.Id] = true;
                return true;
            }
            return false;
        });
        BackupTaskCategoriesData = result;
        setTaskCategoriesData(result);
        setSearchedCategoryData([]);
        setCategorySearchKey("");
        let SelectCategories: any = []
        BackupTaskCategoriesData?.map((cate: any) => {
            SelectCategories?.push({ Id: cate?.Id, Title: cate?.Title != undefined ? cate?.Title : cate?.newTitle })
        })
        if (onDropAction != undefined && onDropAction?.length) {
            onDropAction?.forEach((column: any) => {
                if (column?.SelectedField == 'Categories') {
                    column['SelectedValue'] = SelectCategories;
                }
            })
        }
    };
    const SelectCategoryCallBack = useCallback(
        (selectCategoryDataCallBack: any) => {
            setSelectedCategoryData(selectCategoryDataCallBack, "For-Panel");
        },
        []
    );
    const smartCategoryPopup = useCallback(() => {
        setIsComponentPicker(false);
    }, []);
    const AssignedToUser = (item: any, columnFilter: any, columnIndex: any) => {
        let MailArray: any = []
        if (item.length > 0) {
            const email = item.length > 0 ? item[0].loginName.split('|').pop() : null;
            const member = AllTaskUsers.filter((elem: any) => elem?.AssingedToUser?.EMail === email)
            let SelectedUser: any = [];
            member?.map((user: any) => {
                SelectedUser?.push({ Id: user?.Id, Title: user?.Title, email: user?.AssingedToUser?.EMail, AssingedToUserId: user?.AssingedToUser?.Id })
                MailArray.push(user?.AssingedToUser?.EMail)
            })
            if (onDropAction != undefined && onDropAction?.length) {
                onDropAction?.forEach((column: any) => {
                    if (column?.SelectedField == columnFilter?.SelectedField) {
                        column['SelectedValue'] = SelectedUser;
                    }
                })
            }
        }
        else {
            if (onDropAction != undefined && onDropAction?.length) {
                onDropAction?.forEach((column: any) => {
                    if (column?.SelectedField == columnFilter?.SelectedField) {
                        column['SelectedValue'] = [];
                    }
                })
            }
        }
        let updatedItems = [...FilterColumn]
        updatedItems[columnIndex] = { ...columnFilter, SelectedValue: MailArray };
        setFilterColumn(updatedItems);
    }
    const TeamLeader = (item: any, columnFilter: any, columnIndex: any) => {
        let MailArray: any = []
        if (item.length > 0) {
            const email = item.length > 0 ? item[0].loginName.split('|').pop() : null;
            const member = AllTaskUsers.filter((elem: any) => elem?.AssingedToUser?.EMail === email)
            let SelectedUser: any = [];
            member?.map((user: any) => {
                SelectedUser?.push({ Id: user?.Id, Title: user?.Title, email: user?.AssingedToUser?.EMail, AssingedToUserId: user?.AssingedToUser?.Id })
                MailArray.push(user?.AssingedToUser?.EMail)
            })
            if (onDropAction != undefined && onDropAction?.length) {
                onDropAction?.forEach((column: any) => {
                    if (column?.SelectedField == columnFilter?.SelectedField) {
                        column['SelectedValue'] = SelectedUser;
                    }
                })
            }
        }
        else {
            if (onDropAction != undefined && onDropAction?.length) {
                onDropAction?.forEach((column: any) => {
                    if (column?.SelectedField == columnFilter?.SelectedField) {
                        column['SelectedValue'] = [];
                    }
                })
            }
        }
        let updatedItems = [...FilterColumn]
        updatedItems[columnIndex] = { ...columnFilter, SelectedValue: MailArray };
        setFilterColumn(updatedItems);
    }
    const TeamMember = (item: any, columnFilter: any, columnIndex: any) => {
        let MailArray: any = []
        if (item.length > 0) {
            const email = item.length > 0 ? item[0].loginName.split('|').pop() : null;
            const member = AllTaskUsers.filter((elem: any) => elem?.AssingedToUser?.EMail === email)
            let SelectedUser: any = [];
            member?.map((user: any) => {
                SelectedUser?.push({ Id: user?.Id, Title: user?.Title, email: user?.AssingedToUser?.EMail, AssingedToUserId: user?.AssingedToUser?.Id })
                MailArray.push(user?.AssingedToUser?.EMail)
            })
            if (onDropAction != undefined && onDropAction?.length) {
                onDropAction?.forEach((column: any) => {
                    if (column?.SelectedField == columnFilter?.SelectedField) {
                        column['SelectedValue'] = SelectedUser;
                    }
                })
            }
        }
        else {
            if (onDropAction != undefined && onDropAction?.length) {
                onDropAction?.forEach((column: any) => {
                    if (column?.SelectedField == columnFilter?.SelectedField) {
                        column['SelectedValue'] = [];
                    }
                })
            }
        }
        let updatedItems = [...FilterColumn]
        updatedItems[columnIndex] = { ...columnFilter, SelectedValue: MailArray };
        setFilterColumn(updatedItems);
    }
    const WorkingDate = (columnFilter: any, dt: any, ColumnIndex: any) => {
        let SelectedValue = Moment(dt).format("DD/MM/YYYY");
        if (onDropAction != undefined && onDropAction?.length) {
            onDropAction?.forEach((column: any) => {
                if (column?.SelectedField == columnFilter?.SelectedField) {
                    column['SelectedValue'] = SelectedValue;
                }
            })
        }
        let updatedItems = [...FilterColumn]
        updatedItems[ColumnIndex] = { ...columnFilter, SelectedValue: dt };
        setFilterColumn(updatedItems);
    }
    const ExampleCustomInputWorkingDate = React.forwardRef(
        ({ value, onClick }: any, ref: any) => (
            <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
                <input type="text" id="Startdatepicker" autoComplete="off" data-input-type="Working Date" className="form-control date-picker ps-2" placeholder="DD/MM/YYYY" value={value} />
                <span style={{ position: "absolute", top: "50%", right: "7px", transform: "translateY(-50%)", cursor: "pointer", }} >
                    <span className="svg__iconbox svg__icon--calendar"></span>
                </span>
            </div>
        )
    );
    const DueDate = (columnFilter: any, dt: any, ColumnIndex: any) => {
        let SelectedValue = Moment(dt).format("DD/MM/YYYY");
        if (onDropAction != undefined && onDropAction?.length) {
            onDropAction?.forEach((column: any) => {
                if (column?.SelectedField == columnFilter?.SelectedField) {
                    column['SelectedValue'] = SelectedValue;
                }
            })
        }
        let updatedItems = [...FilterColumn]
        updatedItems[ColumnIndex] = { ...columnFilter, SelectedValue: dt };
        setFilterColumn(updatedItems);
    }
    const ExampleCustomInputDueDate = React.forwardRef(
        ({ value, onClick }: any, ref: any) => (
            <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
                <input type="text" id="DueDatedatepicker" autoComplete="off" data-input-type="Due Date" className="form-control date-picker ps-2" placeholder="DD/MM/YYYY" value={value} />
                <span style={{ position: "absolute", top: "50%", right: "7px", transform: "translateY(-50%)", cursor: "pointer", }} >
                    <span className="svg__iconbox svg__icon--calendar"></span>
                </span>
            </div>
        )
    );

    return (
        <>
            <Panel onRenderHeader={CustomHeaderConfiguration}
                isOpen={props?.IsOpenPopup}
                onDismiss={CloseConfiguationPopup}
                isBlocking={false}
                customWidth="1300px"
                type={PanelType.custom}>
                <div className='border container modal-body p-1 mb-1'>
                    <Row className="Metadatapannel p-2 mb-2">
                        <Col sm="12" md="12" lg="12">
                            {NewItem != undefined && NewItem?.length > 0 && NewItem.map((items: any, index: any) => {
                                return (
                                    <>
                                        <div key={index} className={`${items?.IsEditable != false ? 'p-2 mb-2' : 'p-2 mb-2'}`}>
                                            <Row className="Metadatapannel mb-2">
                                                <Col sm="4" md="4" lg="4">
                                                    <div className="input-group">
                                                        <label className='form-label full-width'>WebPart Title</label>
                                                        <input className='form-control' type='text' placeholder="Name"
                                                            value={items?.WebpartTitle} onChange={(e) => {
                                                                const updatedItems = [...NewItem]; updatedItems[index] = { ...items, WebpartTitle: e.target.value };
                                                                setNewItem(updatedItems); handleDashTitle(e.target.value);
                                                            }} />
                                                    </div>
                                                </Col>
                                                <Col sm="4" md="4" lg="4">
                                                    <div className="form-check form-check-inline m-4">
                                                        <input type="checkbox" checked={items?.IsShowTile} className="form-check-input me-1" onChange={(e: any) => {
                                                            const updatedItems = [...NewItem]; IsShowTileCopy = e.target.checked; updatedItems[index] = { ...items, IsShowTile: e.target.checked, };
                                                            setNewItem(updatedItems);
                                                        }} />
                                                        <label className="form-check-label">Show Tile</label>
                                                    </div>
                                                </Col>
                                                <Col sm="4" md="4" lg="4">
                                                    <div className="form-check form-check-inline m-4">
                                                        <label className='SpfxCheckRadio hreflink siteColor' onClick={() => openTableSettingPopup("favBased")}>Table Configurations</label>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="Metadatapannel">
                                                <Col sm="12" md="12" lg="12">
                                                    <div className="togglecontent mt-1">
                                                        <label className='form-label full-width'>On-Drop Action</label>
                                                        <section className="border px-2 py-2">
                                                            <label className='form-label full-width'>Filter</label>
                                                            <section className="border px-2 py-2">
                                                                {FilterColumn != undefined && FilterColumn?.length > 0 && FilterColumn.map((column: any, ColumnIndex: any) => {
                                                                    return (
                                                                        <>
                                                                            <Row>
                                                                                <Col sm="4" md="4" lg="4">


                                                                                    <Dropdown id={`FiltersCustomdropdown`} className={ColumnIndex % 2 == 0 ? "mb-2 kkp" : "mb-2 lls"} options={[{ key: '', text: '' }, ...(SelectedColumn?.map((item: any) => ({ key: item?.key, text: item?.text })) || [])]} defaultSelectedKey={column?.SelectedField} selectedKey={column?.SelectedField}
                                                                                        onChange={(e, option) => handleDataSourceChange(option?.key, ColumnIndex, column)}
                                                                                        styles={{ dropdown: { width: '100%' } }}
                                                                                    />
                                                                                </Col>
                                                                                <Col sm="4" md="4" lg="4">
                                                                                    <>
                                                                                        {column?.DataSource == "Status" && <Dropdown id="FiltersCustom" options={[{ key: '', text: '' }, ...(StatusOptions?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={column?.SelectedValue}
                                                                                            onChange={(e, option) => StatusFilterChange(option?.key, ColumnIndex, column)}
                                                                                            styles={{ dropdown: { width: '100%' } }} />}

                                                                                        {column?.DataSource == "Priority" && < Dropdown id="FiltersPriority" options={[{ key: '', text: '' }, ...(PriorityOptions?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={column?.SelectedValue}
                                                                                            onChange={(e, option) => PriorityFilterChange(option?.key, ColumnIndex, column)}
                                                                                            styles={{ dropdown: { width: '100%' } }} />}
                                                                                        {column?.DataSource == "WorkingMember" && <>
                                                                                            <PeoplePicker context={props?.props?.Context} titleText="" personSelectionLimit={10} principalTypes={[PrincipalType.User]} resolveDelay={1000} onChange={(items) => AssignedToUser(items, column, ColumnIndex)}
                                                                                                defaultSelectedUsers={column?.SelectedValue ? column?.SelectedValue : []} />
                                                                                        </>}
                                                                                        {column?.DataSource == "TeamLeader" && <>
                                                                                            <PeoplePicker context={props?.props?.Context} titleText="" personSelectionLimit={10} principalTypes={[PrincipalType.User]} resolveDelay={1000} onChange={(items) => TeamLeader(items, column, ColumnIndex)}
                                                                                                defaultSelectedUsers={column?.SelectedValue ? column?.SelectedValue : []} />
                                                                                        </>}
                                                                                        {column?.DataSource == "TeamMember" && <>
                                                                                            <PeoplePicker context={props?.props?.Context} titleText="" personSelectionLimit={10} principalTypes={[PrincipalType.User]} resolveDelay={1000} onChange={(items) => TeamMember(items, column, ColumnIndex)}
                                                                                                defaultSelectedUsers={column?.SelectedValue ? column?.SelectedValue : []} />
                                                                                        </>}
                                                                                        {column?.DataSource == "Categories" && <>
                                                                                            <div className="input-group mb-2">
                                                                                                <>
                                                                                                    <input type="text" className="form-control" id="txtCategories" placeholder="Search Category Here"
                                                                                                        value={categorySearchKey} onChange={(e) => autoSuggestionsForCategory(e)}
                                                                                                    />
                                                                                                    {SearchedCategoryData?.length > 0 ? (
                                                                                                        <div className="SmartTableOnTaskPopup">
                                                                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                                                {SearchedCategoryData.map((item: any) => {
                                                                                                                    return (
                                                                                                                        <li
                                                                                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                                                            key={item.id}
                                                                                                                            onClick={() => setSelectedCategoryData([item], "For-Auto-Search")}  >
                                                                                                                            <a>{item.Newlabel}</a>
                                                                                                                        </li>
                                                                                                                    );
                                                                                                                })}
                                                                                                            </ul>
                                                                                                        </div>
                                                                                                    ) : null}
                                                                                                    {TaskCategoriesData?.map(
                                                                                                        (type: any, index: number) => {
                                                                                                            return (
                                                                                                                <div className="block w-100">
                                                                                                                    <a style={{ color: "#fff !important" }} className="textDotted"   >
                                                                                                                        {type.Title}
                                                                                                                    </a>
                                                                                                                    <span onClick={() => removeCategoryItem(type.Title)} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"  ></span>
                                                                                                                </div>
                                                                                                            );
                                                                                                        }
                                                                                                    )}
                                                                                                </>
                                                                                                <span
                                                                                                    className="input-group-text" title="Smart Category Popup" onClick={(e) => EditComponentPicker('', "Categories")}   >
                                                                                                    <span className="svg__iconbox svg__icon--editBox" style={{ marginTop: '-21px' }}></span>
                                                                                                </span>
                                                                                            </div>
                                                                                        </>}
                                                                                        {column?.DataSource == "WorkingDate" && <>
                                                                                            <DatePicker
                                                                                                selected={column?.SelectedValue} data-input-type="First" onChange={(date: any) => WorkingDate(column, date, ColumnIndex)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                                                                className="form-control date-picker p-1" popperPlacement="bottom-start" customInput={<ExampleCustomInputWorkingDate />}
                                                                                            />
                                                                                        </>}
                                                                                        {column?.DataSource == "DueDate" && <>
                                                                                            <DatePicker
                                                                                                selected={column?.SelectedValue} data-input-type="First" onChange={(date: any) => DueDate(column, date, ColumnIndex)} dateFormat="dd/MM/yyyy" // Format as DD/MM/YYYY
                                                                                                className="form-control date-picker p-1" popperPlacement="bottom-start" customInput={<ExampleCustomInputDueDate />}
                                                                                            />
                                                                                        </>}
                                                                                    </>
                                                                                </Col>
                                                                                <Col sm="1" md="1" lg="1">
                                                                                    {(FilterColumn?.length == ColumnIndex + 1 && ColumnIndex < SelectedColumn?.length - 1) && <a className="pull-right hreflink" title="Add More Filter" onClick={(e) => AddMoreFilter(column)}><h4>+</h4></a>}
                                                                                </Col>
                                                                                <Col sm="1" md="1" lg="1">
                                                                                    {ColumnIndex != 0 && <a className="pull-right hreflink" title="Remove Filter" onClick={(e) => RemoveFilter(column)}><span className="svg__iconbox svg__icon--cross mt-2"></span></a>}
                                                                                </Col>
                                                                            </Row>
                                                                        </>

                                                                    )
                                                                })}
                                                            </section>
                                                        </section>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="Metadatapannel">
                                                {items.DataSource != 'TimeSheet' &&
                                                    <Col sm="12" md="12" lg="12">
                                                        <div className="togglecontent mt-1">
                                                            <TeamSmartFilter portfolioColor={portfolioColor} ContextValue={props?.props} smartFiltercallBackData={smartFiltercallBackData} webPartTemplateSmartFilter={true} IsSmartfavoriteId={props?.EditItem?.smartFevId ? props?.EditItem?.smartFevId : ""} />
                                                        </div>
                                                    </Col>}
                                            </Row>
                                        </div >
                                    </>
                                )
                            })}
                        </Col>
                    </Row>
                </div>

                {columnSettingPopup && <DynamicColumnSettingGallary
                    settingConfrigrationData={settingConfrigrationData}
                    tableSettingPageSize={tableSettingPageSize}
                    tableHeight={wrapperHeight}
                    wrapperHeight={wrapperHeight}
                    columnOrder={columnOrder}
                    setSorting={setSorting}
                    sorting={sorting}
                    tableId={tableIdsCopy ? tableIdsCopy : tableId}
                    showHeader={showHeaderLocalStored}
                    isOpen={columnSettingPopup}
                    columnSettingCallBack={columnSettingCallBack}
                    columns={columns}
                    columnVisibilityData={columnVisibility}
                />}
            </Panel >
            {IsComponentPicker && (
                <Picker
                    props={{}}
                    selectedCategoryData={TaskCategoriesData}
                    usedFor="DashboardLandingPage"
                    siteUrls={props?.props?.Context?._pageContext?._web?.absoluteUrl}
                    AllListId={props?.props}
                    CallBack={SelectCategoryCallBack}
                    isServiceTask={false}
                    closePopupCallBack={smartCategoryPopup}
                />
            )}
        </>
    );
};
export default AddEditWebpartTemplate;