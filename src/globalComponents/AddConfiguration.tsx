import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import { Col, Row } from "react-bootstrap";
import Tooltip from "./Tooltip";
import { myContextValue } from "./globalCommon";
import Picker from "./EditTaskPopup/SmartMetaDataPicker";
import PageLoader from '../globalComponents/pageLoader';
let portfolioColor: any = '#057BD0';
let AutoCompleteItemsArray: any = [];
var AllSitesData: any = [];
let DashTemp: any = [];
let BackupTaskCategoriesData: any = [];
let PrevSelectedSmartFav: any = '';
let SelectedDashboard: any;
let autoSuggestItem: any;
const AddConfiguration = (props: any) => {
    props.props.siteUrl = props?.props?.Context?._pageContext?._web?.absoluteUrl
    const [progressBar, setprogressBar] = useState(true)
    const params = new URLSearchParams(window.location.search);
    let DashboardId: any = params.get('DashBoardId');
    if (DashboardId == undefined || DashboardId == '')
        DashboardId = 1;
    const ContextData: any = useContext(myContextValue);
    const [IsComponentPicker, setIsComponentPicker] = useState<any>(false);
    const [selectedSmartFav, setselectedSmartFav] = useState<any>(undefined);
    const [SiteTypes, setSiteTypes] = useState<any>([]);
    let defaultConfig = { "WebpartTitle": '', "TileName": '', "ShowWebpart": true, "WebpartPosition": { "Row": 0, "Column": 0 }, "GroupByView": '', "Id": 1, "AdditonalHeader": false, "smartFevId": '', "DataSource": "Tasks", "selectFilterType": "smartFav", "selectUserFilterType": "AssignedTo" }
    const [NewItem, setNewItem]: any = useState<any>([defaultConfig]);
    const [SmartFav, setSmartFav] = useState<any>([]);
    const [AllTaskUsers, setAllTaskUsers] = useState<any>([]);
    const [DashboardTemplate, setDashboardTemplate] = useState<any>([]);
    const [DataSource, setDataSource] = useState<any>([]);
    const [DashboardTitle, setDashboardTitle] = useState<any>('');
    const [IsCheck, setIsCheck] = useState<any>(false);
    const [categorySearchKey, setCategorySearchKey] = useState<any>("");
    const [SearchedCategoryData, setSearchedCategoryData] = useState<any>([]);
    const [SearchedSmartFavData, setSearchedSmartFavData] = useState<any>([]);
    const [TaskCategoriesData, setTaskCategoriesData] = useState<any>([]);
    const [UserOptions, setUserOptions] = useState<any>([]);
    const [PopupSmartFav, setPopupSmartFav] = React.useState(false);
    let [StatusOptions, setStatusOptions] = useState([]);
    let [ActionsOptions, setActionsOptions] = useState([])
    let [PriorityOptions, setPriorityOptions] = useState([])
    let [CustomUserFilter, setCutomUserFilter] = useState([]);
    const LoadSmartFav = () => {
        let SmartFavData: any = []
        if (props?.SingleWebpart != undefined && props?.SingleWebpart == true)
            setIsCheck(true);
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'Smartfavorites'").getAll().then((data: any) => {
            data.forEach((config: any) => {
                config.configurationData = JSON.parse(config?.Configurations);
                config?.configurationData?.forEach((elem: any) => {
                    elem.UpdatedId = config.Id;
                    if (elem.isShowEveryone == true)
                        SmartFavData.push(elem)
                    else if (elem.isShowEveryone == false && elem?.CurrentUserID == props?.props?.Context?._pageContext?._legacyPageContext.userId) {
                        SmartFavData.push(elem)
                    }
                })
            })
            if (props?.EditItem != undefined && props?.EditItem != '') {
                let newArray: any = []
                setDashboardTitle(props?.EditItem?.Title)
                if (props?.SingleWebpart == true)
                    newArray.push(props?.EditItem)
                else
                    newArray = JSON.parse(JSON.stringify(props?.EditItem?.Configurations));
                newArray?.forEach((item: any, Itemindex: any) => {
                    item.selectedSmartFav = {}
                    if (SmartFavData != undefined && SmartFavData?.length) {
                        SmartFavData?.forEach((smartfav: any) => {
                            if (item?.selectFilterType == 'smartFav' && item?.DataSource == "Tasks" && item.smartFevId && smartfav?.UpdatedId == item.smartFevId) {
                                item.selectedSmartFav = smartfav;
                            }
                        })
                    }
                    if (item?.FilterType == 'Categories')
                        setTaskCategoriesData(item?.Status)
                    item.IsDefaultTile = false;
                    item.IsShowTile = false;
                    if (item?.selectFilterType == undefined)
                        item.selectFilterType = 'smartFav'
                    if (item.AdditonalHeader === true) {
                        item.IsDefaultTile = true;
                        setIsCheck(true)
                    }
                    if (item.TileName != undefined && item.TileName != '')
                        item.IsShowTile = true
                    if (item?.smartFevId != undefined && item?.smartFevId != '')
                        item.smartFevId = parseInt(item?.smartFevId)
                    if (DashTemp != undefined && DashTemp?.length) {
                        DashTemp?.forEach((Template: any) => {
                            if (Template?.WebpartTitle == item?.WebpartTitle && item?.IsEditable == false) {
                                Template.IsSelectedTemp = item?.IsSelectedTemp
                            }
                        })
                        setDashboardTemplate(DashTemp);
                    }
                })
                setNewItem(newArray);
            }
            else {
                setNewItem([defaultConfig])
            }
            setSmartFav(SmartFavData)
        }).catch((err: any) => {
            console.log(err);
        })
    }
    const LoadDashboardTemplate = () => {
        DashTemp = []
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashboardTemplate'").getAll().then((data: any) => {
            data.forEach((config: any) => {
                if (config?.Configurations != undefined && config?.Configurations != '')
                    DashTemp.push(JSON.parse(config?.Configurations)[0]);
            })
            DashTemp.forEach((temp: any) => {
                temp.IsSelectedTemp = false;
            })
            setDashboardTemplate(DashTemp);
        }).catch((err: any) => {
            console.log(err);
        })
    }
    const getChilds = (item: any, items: any) => {
        item.childs = [];
        for (let index = 0; index < items.length; index++) {
            let childItem = items[index];
            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                item.childs.push(childItem);
                getChilds(childItem, items);
            }
        }
    }
    const loadTaskUsers = async () => {
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        let taskUsers: any = [];
        let results = await web.lists
            .getById(props?.props?.TaskUserListId).items.select('Id', 'IsActive', 'UserGroupId', 'Suffix', 'Title', 'Email', 'SortOrder', 'Role', 'Company', 'ParentID1', 'TaskStatusNotification', 'Status', 'Item_x0020_Cover', 'AssingedToUserId', 'isDeleted', 'AssingedToUser/Title', 'AssingedToUser/Id', 'AssingedToUser/EMail', 'ItemType')
            .filter('IsActive eq 1').expand('AssingedToUser').orderBy('SortOrder', true).orderBy("Title", true).get();
        results.forEach((item: any) => {
            item.value = item.AssingedToUserId
            item.status = item.Title
            if (item.UserGroupId == undefined) {
                getChilds(item, results);
                taskUsers.push(item);
            }
        });
        setUserOptions(results?.filter((User: any) => User?.AssingedToUserId != undefined && User?.AssingedToUserId != '' && User?.ItemType == 'User'))
        if (taskUsers != undefined && taskUsers.length > 0) {
            taskUsers?.map((User: any) => {
                if (User.childs != undefined && User.childs.length > 0) {
                    User.childs.map((ChildUser: any) => {
                        if (ChildUser.Item_x0020_Cover == null || ChildUser.Item_x0020_Cover == undefined) {
                            let tempObject: any = {
                                Description: '/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg',
                                Url: '/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'
                            }
                            ChildUser.Item_x0020_Cover = tempObject;
                        }
                    })
                }
            })
        }
        console.log(taskUsers);
        setAllTaskUsers(taskUsers)
    }
    const CloseConfiguationPopup = () => {
        setNewItem([]);
        props?.CloseConfigPopup(false)
    }
    const SaveConfigPopup = async () => {
        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").orderBy("orderby", true).getAll().then(async (data: any) => {
                let result: any;
                if (data?.length && data[0].Value != undefined && data[0].Value != '') {
                    result = parseInt(data[0].Value) + 1;
                }
                else {
                    result = data?.length + 1;
                }
                if (props?.SingleWebpart == true) {
                    let FilteredData = data?.filter((config: any) => config?.Value == DashboardId)[0];
                    if (props?.DashboardConfigBackUp && NewItem[0]?.Id !== undefined) {
                        props.DashboardConfigBackUp.forEach((item: any) => {
                            if (item?.Id !== undefined && item.Id === NewItem[0].Id) {
                                Object.keys(NewItem[0]).forEach((key) => {
                                    if (key in item) {
                                        item[key] = NewItem[0][key];
                                        if (item?.FilterType == 'Categories') {
                                            let extractedData = TaskCategoriesData.map((item: any) => {
                                                return { ID: item.Id, Id: item.Id, Title: item.Title };
                                            });
                                            item.Status = extractedData != undefined && extractedData?.length > 0 ? extractedData : []
                                        }
                                    }
                                });
                            }
                        });
                    }
                    await web.lists.getById(props?.props.AdminConfigurationListId).items.getById(FilteredData.Id).update({ Title: FilteredData?.Title, Configurations: JSON.stringify(props?.DashboardConfigBackUp) })
                        .then(async (res: any) => {
                            setNewItem([]);
                            props?.CloseConfigPopup(true)
                            if (ContextData != undefined && ContextData?.callbackFunction != undefined)
                                ContextData?.callbackFunction(false);
                        }).catch((err: any) => {
                            console.log(err);
                        })
                }
                else {
                    let newArray = [...NewItem];
                    newArray?.forEach((item: any, Itemindex: any) => {
                        delete item.IsDefaultTile;
                        delete item.selectedSmartFav;
                        delete item?.SmatFavSearchKey
                        if (item?.IsShowTile === true)
                            item.TileName = item.WebpartTitle.replaceAll(" ", "")
                        else if (item?.IsShowTile != true)
                            item.TileName = '';
                        delete item.IsShowTile;
                        if (item?.FilterType == 'Categories') {
                            let extractedData = TaskCategoriesData.map((item: any) => {
                                return { ID: item.Id, Id: item.Id, Title: item.Title };
                            });
                            item.Status = extractedData != undefined && extractedData?.length > 0 ? extractedData : []
                        }
                    })
                    setNewItem(newArray);
                    if (props?.EditItem != undefined && props?.EditItem != '') {
                        await web.lists.getById(props?.props.AdminConfigurationListId).items.getById(props?.EditItem?.Id).update({ Title: DashboardTitle, Configurations: JSON.stringify(NewItem) })
                            .then(async (res: any) => {
                                setNewItem([]);
                                props?.CloseConfigPopup(true)
                                if (props?.SingleWebpart == true) {
                                    if (ContextData != undefined && ContextData?.callbackFunction != undefined)
                                        ContextData?.callbackFunction(false);
                                }

                            }).catch((err: any) => {
                                console.log(err);
                            })
                    }
                    else {
                        await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: DashboardTitle, Key: "DashBoardConfigurationId", Value: result != undefined ? result.toString() : undefined, Configurations: JSON.stringify(NewItem) })
                            .then(async (res: any) => {
                                setNewItem([]);
                                props?.CloseConfigPopup(true)
                            }).catch((err: any) => {
                                console.log(err);
                            })
                    }
                }

            }).catch((err: any) => {
                console.log(err);
            })

        } catch (error) {
            console.log(error);
        }

    }
    const CustomHeaderConfiguration = () => {
        return (
            <>
                <div className='siteColor subheading'>
                    {props?.EditItem != undefined && props?.EditItem != '' ? <span>Edit Dashboard Configuration</span> : <span>Add Dashboard Configuration</span>}
                </div>
                {props?.EditItem != undefined && props?.EditItem != '' ? <Tooltip ComponentId={869} /> : <Tooltip ComponentId={1107} />}

            </>
        );
    };
    const handleSelectFilterChange = (event: any, index: any, items: any) => {
        const updatedItems = [...NewItem];
        updatedItems[index] = { ...items, smartFevId: event, Status: '', selectUserFilterType: '' };
        setNewItem(updatedItems);
    };
    const handleCustomFilterChange = (event: any, index: any, items: any) => {
        const updatedItems = [...NewItem];
        updatedItems[index] = { ...items, Status: event, smartFevId: '' };
        setNewItem(updatedItems);
    };
    const handleCustomUserFilterChange = (event: any, index: any, items: any) => {
        const updatedItems = [...NewItem];
        updatedItems[index] = { ...items, Status: event, smartFevId: '', selectUserFilterType: '' };
        setNewItem(updatedItems);
    };
    const handleCustomUserChange = (event: any, SelectedUserTitle: any, index: any, items: any) => {
        const updatedItems = [...NewItem];
        updatedItems[index] = { ...items, UserId: event, UserTitle: SelectedUserTitle, smartFevId: '', selectUserFilterType: '' };
        setNewItem(updatedItems);
    };
    const handleDataSourceChange = (event: any, index: any, items: any) => {
        const updatedItems = [...NewItem]; updatedItems[index] = { ...items, DataSource: event, };
        setNewItem(updatedItems);
    };
    const AddMorewebpart = () => {
        //if (NewItem?.length === 1)
        //  defaultConfig.Id = NewItem?.length + 1;
        // else
        defaultConfig.Id = NewItem?.length + 1;
        const newArray: any = [...NewItem, defaultConfig];
        setNewItem(newArray);
    }
    const RemoveWebpart = (items: any, Itemindex: any) => {
        let newArray = [...NewItem];
        newArray = newArray.filter((data: any, index: any) => index !== Itemindex);
        setNewItem(newArray);
    }
    const SelectedTile = (check: any, items: any, index: any) => {
        setIsCheck(check)
        let newArray = [...NewItem];
        newArray?.forEach((item: any, Itemindex: any) => {
            if (Itemindex == index && check == true) {
                item.TileName = item.WebpartTitle.replaceAll(" ", "")
                item.AdditonalHeader = true;
                item.IsDefaultTile = true;
            }
            else {
                item.TileName = ''
                item.AdditonalHeader = false
                item.IsDefaultTile = false;
            }
        })
        setNewItem(newArray);
    }
    const SelectedTemplate = (check: any, items: any, index: any) => {
        setIsCheck(check)
        let newArray = [...NewItem];
        let Template = [...DashboardTemplate];
        let IsExecuteElse = true
        Template?.forEach((item: any, Itemindex: any) => {
            if (Itemindex == index && check == true) {
                item.IsSelectedTemp = true;
                item.Id += Itemindex
                if (newArray?.length == 1 && (newArray[0]?.WebpartTitle == undefined || newArray[0]?.WebpartTitle == '')) {
                    newArray = [];
                    newArray.push(item)
                }
                else {
                    newArray.push(item)
                }
                IsExecuteElse = false;
            }
            else if (Itemindex == index && check == false) {
                item.IsSelectedTemp = false;
                newArray = newArray.filter((item: any) => item?.WebpartTitle != items?.WebpartTitle && item?.IsTemplate == true)
                IsExecuteElse = false;
                if (newArray != undefined && newArray?.length == 0)
                    IsExecuteElse = true;
            }
        })
        if (IsExecuteElse == true) {
            Template?.forEach((item: any, Itemindex: any) => {
                item.IsSelectedTemp = false;
                newArray = newArray.filter((item: any) => item?.TileName != items?.TileName && item?.IsTemplate != true)
                if (newArray?.length == 0)
                    newArray.push(defaultConfig)
            })
        }
        setDashboardTemplate(Template);

        setNewItem(newArray);
    }
    const handleFilterChange = (event: any, index: any, items: any) => {
        const updatedItems = [...NewItem];
        updatedItems[index] = { ...items, selectFilterType: event.target.value, };
        setNewItem(updatedItems);
    };
    const handleUserFilterChange = (event: any, index: any, items: any) => {
        const updatedItems = [...NewItem];
        updatedItems[index] = { ...items, selectUserFilterType: event.target.value, smartFevId: '' };
        setNewItem(updatedItems);
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
    const EditComponentPicker = (item: any, usedFor: any) => {
        setIsComponentPicker(true);
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
    const SmartMetaDataListInformations = async () => {
        let AllSmartDataListData: any = [];
        let AllCategoriesData: any = [];
        let CategoriesGroupByData: any = [];
        let PriorityRank: any = [];
        let PercentComplete: any = [];
        let Actions: any = [];
        let DataSource: any = [];
        let TimeSheetFilter: any = [];
        let tempArray: any = [];
        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            AllSmartDataListData = await web.lists.getById(props?.props?.SmartMetadataListID)
                .items.select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail").expand("Author,Editor,IsSendAttentionEmail").getAll();
            AllCategoriesData = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Categories");
            AllSitesData = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Sites");
            PriorityRank = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Priority Rank");
            PriorityRank = PriorityRank.toReversed()
            PercentComplete = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Percent Complete");
            PercentComplete = PercentComplete.filter((percentComplete: any) => percentComplete?.ParentId != undefined && percentComplete?.ParentId != '');
            PercentComplete = PercentComplete.sort((a: any, b: any) => { return a.SortOrder - b.SortOrder; });
            Actions = getSmartMetadataItemsByTaxType(AllSmartDataListData, "Actions");
            Actions = Actions.sort((a: any, b: any) => { return a.SortOrder - b.SortOrder; });
            DataSource = getSmartMetadataItemsByTaxType(AllSmartDataListData, "DataSource");
            DataSource = DataSource.sort((a: any, b: any) => { return a.SortOrder - b.SortOrder; });
            TimeSheetFilter = getSmartMetadataItemsByTaxType(AllSmartDataListData, "TimesheetFilter");
            TimeSheetFilter = TimeSheetFilter.sort((a: any, b: any) => { return a.SortOrder - b.SortOrder; });
            AllSmartDataListData?.map((SmartItemData: any, index: any) => {
                SmartItemData.newTitle = SmartItemData.Title;
            })
            AllSitesData?.map((site: any) => {
                if (site.Title !== undefined && site.Title !== "Foundation" && site.Title !== "Master Tasks" && site.Title !== "DRR" && site.Title !== "SDC Sites" && site.Title !== "SP Online") {
                    site.BtnStatus = false;
                    site.value = site?.Title;
                    site.status = site?.Title;
                    site.isSelected = false;
                    tempArray.push(site);
                }
            });
            setSiteTypes(tempArray);
            PriorityRank?.map((priorityrank: any) => {
                priorityrank.value = parseInt(priorityrank?.Title)
                priorityrank.status = priorityrank?.Title
            });
            setPriorityOptions(PriorityRank)
            PercentComplete?.map((percentComplete: any) => {
                percentComplete.value = parseFloat(percentComplete?.Title?.split('%')[0])
                percentComplete.status = percentComplete?.Title
            });
            setStatusOptions(PercentComplete)
            Actions?.map((action: any) => {
                action.value = action?.Title
                action.status = action?.Title
            });
            setActionsOptions(Actions)
            DataSource?.map((dataSource: any) => {
                dataSource.value = dataSource?.Title
                dataSource.status = dataSource?.Title
            });
            setDataSource(DataSource)
            TimeSheetFilter?.map((timesheetFilter: any) => {
                timesheetFilter.value = timesheetFilter?.Title?.split('&')[1]
                timesheetFilter.status = timesheetFilter?.Title?.split('&')[0]
            });
            setCutomUserFilter(TimeSheetFilter)

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
            setprogressBar(false)
        } catch (error) {
            console.log("Error : ", error.message);
        }
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
    };
    const removeSmartFavItem = (selectCategoryData: any, index: any, items: any) => {
        const updatedItems = [...NewItem];
        updatedItems[index] = { ...items, smartFevId: '', selectedSmartFav: {}, Status: '', selectUserFilterType: '' };
        setNewItem(updatedItems);
        setselectedSmartFav(undefined)
    };
    const openSmartFav = (items: any, index: any) => {
        SelectedDashboard = {};
        SelectedDashboard.items = items;
        SelectedDashboard.index = index;
        setselectedSmartFav(SelectedDashboard?.items?.selectedSmartFav)
        PrevSelectedSmartFav = { ...SelectedDashboard?.items?.selectedSmartFav }
        setPopupSmartFav(true)
    }
    const saveSelectSmartFav = () => {
        const updatedItems = [...NewItem];
        updatedItems[SelectedDashboard?.index] = { ...SelectedDashboard?.items, selectedSmartFav: selectedSmartFav, smartFevId: selectedSmartFav?.UpdatedId, Status: '', selectUserFilterType: '' };
        setNewItem(updatedItems);
        setPopupSmartFav(false)
    }
    const cancelSelectSmartFav = () => {
        setselectedSmartFav(PrevSelectedSmartFav)
        const updatedItems = [...NewItem];
        updatedItems[SelectedDashboard?.index] = { ...SelectedDashboard?.items, selectedSmartFav: PrevSelectedSmartFav, smartFevId: PrevSelectedSmartFav?.UpdatedId, Status: '', selectUserFilterType: '' };
        setNewItem(updatedItems);
        setPopupSmartFav(false)
        SelectedDashboard = undefined
    }
    const customHeader = () => {
        return (
            <>
                <div className="subheading">
                    Select Smart Favorite
                </div>
            </>
        )
    }
    const selectPickerData = (item: any) => {
        setselectedSmartFav(item)
        const updatedItems = [...NewItem];
        updatedItems[SelectedDashboard?.index] = { ...SelectedDashboard?.items, selectedSmartFav: SelectedDashboard, smartFevId: SelectedDashboard?.UpdatedId, Status: '', selectUserFilterType: '' };
        setNewItem(updatedItems);
    }
    const autoSuggestionsSmartFav = (e: any, SuggestionItem: any, Id: any) => {
        autoSuggestItem = SuggestionItem
        SuggestionItem.SmatFavSearchKey = e.target.value;
        let searchedKey: any = e.target.value;
        let tempArray: any = [];
        if (searchedKey?.length > 0) {
            SmartFav?.map((itemData: any) => {
                if (itemData.Title.toLowerCase().includes(searchedKey.toLowerCase())) {
                    tempArray.push(itemData);
                }
            });
            setSearchedSmartFavData(tempArray);
        } else {
            autoSuggestItem = '';
            setSearchedSmartFavData([]);
        }
        (document.getElementById(Id) as HTMLInputElement).value = '';
    };
    const setSelectedSmartFavData = (selectCategoryData: any, index: any, items: any, Id: any) => {
        const updatedItems = [...NewItem];
        updatedItems[index] = { ...items, selectedSmartFav: selectCategoryData, SmatFavSearchKey: '', smartFevId: selectCategoryData?.UpdatedId, Status: '', selectUserFilterType: '' };
        setNewItem(updatedItems);
        setSearchedSmartFavData([]);
        items.SmatFavSearchKey = '';
        setselectedSmartFav(selectCategoryData);
        $("#" + Id).val('')
    };
    const deleteSelectedSmartFav = () => {
        setselectedSmartFav(undefined)
        const updatedItems = [...NewItem];
        updatedItems[SelectedDashboard?.index] = { ...SelectedDashboard?.items, selectedSmartFav: {}, smartFevId: '', Status: '', selectUserFilterType: '' };
    }
    const AddWebpartToGallery = async (items: any, index: any) => {
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate' and Value eq '" + props?.EditItem?.Id.toString() + items?.Id + "' ").getAll().then(async (data: any) => {
            if (data?.length) {
                alert('This webpart is already exist')
            }
            else {
                delete items?.IsDefaultTile;
                delete items?.selectedSmartFav;
                delete items?.SmatFavSearchKey;
                await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: items?.WebpartTitle != undefined && items?.WebpartTitle != '' ? items?.WebpartTitle : '', Key: "WebpartTemplate", Value: props?.EditItem?.Id != undefined ? props?.EditItem?.Id.toString() + items?.Id : undefined, Configurations: items != undefined ? JSON.stringify(items) : '' })
                    .then(async (res: any) => {
                        console.log(items)
                        alert('Webpart Added Successfully')
                    }).catch((err: any) => {
                        console.log(err);
                    })
            }
        }).catch((err: any) => {
            console.log(err);
        })
    }
    useEffect(() => {
        SmartMetaDataListInformations()
        LoadSmartFav();
        LoadDashboardTemplate();
        loadTaskUsers();
    }, []);
    return (
        <>
            <Panel onRenderHeader={CustomHeaderConfiguration}
                isOpen={props?.IsOpenPopup}
                onDismiss={CloseConfiguationPopup}
                isBlocking={false}
                type={PanelType.medium}>
                <div className='border container modal-body p-1 mb-1'>
                    {progressBar && <PageLoader />}
                    {props?.SingleWebpart != true && <Row className="Metadatapannel p-2 mb-2">
                        <Col sm="6" md="6" lg="6">
                            <div className="input-group">
                                <label className='form-label full-width'>Dashboard Title</label>
                                <input className='form-control' type='text' placeholder="Dashboard Title" value={DashboardTitle} onChange={(e) => setDashboardTitle(e.target.value)} />
                            </div>
                        </Col>
                        <Col sm="6" md="6" lg="6">
                            <label className='form-label full-width'>Templates</label>
                            {DashboardTemplate != undefined && DashboardTemplate?.length > 0 && DashboardTemplate.map((items: any, index: any) => {
                                return (
                                    <>
                                        <div >
                                            <input type="checkbox" checked={items?.IsSelectedTemp} className="form-check-input me-1" onClick={(e: any) => SelectedTemplate(e.target.checked, items, index)} />
                                            <label className="form-check-label">{items?.WebpartTitle}</label>
                                        </div>
                                    </>
                                )
                            })}

                        </Col>
                    </Row>}
                    <Row className="Metadatapannel p-2 mb-2">
                        <Col sm="12" md="12" lg="12">
                            <label className='form-label full-width'>Webpart Configuartion</label>
                            {NewItem != undefined && NewItem?.length > 0 && NewItem.map((items: any, index: any) => {
                                return (
                                    <>
                                        {/* is-disabled */}
                                        <div key={index} className={`${items?.IsEditable != false ? 'border p-2 mb-2' : 'border p-2 mb-2'}`}>
                                            <Row className="Metadatapannel mb-2">
                                                <Col sm="4" md="4" lg="4">
                                                    <div className="input-group">
                                                        <label className='form-label full-width'>WebPart Title</label>
                                                        <input className='form-control' type='text' placeholder="Name"
                                                            value={items?.WebpartTitle} onChange={(e) => {
                                                                const updatedItems = [...NewItem]; updatedItems[index] = { ...items, WebpartTitle: e.target.value };
                                                                setNewItem(updatedItems);
                                                            }} />
                                                    </div>
                                                </Col>
                                                <Col sm="3" md="3" lg="3">
                                                    {items?.IsTemplate != true && <><div> Show WebPart</div>
                                                        <label className="switch me-2" htmlFor={`ShowWebpartCheckbox${index}`}>
                                                            <input checked={items?.ShowWebpart} onChange={(e: any) => {
                                                                const isChecked = e.target.checked;
                                                                const updatedItems = [...NewItem]; updatedItems[index] = { ...items, ShowWebpart: isChecked };
                                                                setNewItem(updatedItems);
                                                                if (!isChecked) { alert('Webpart will not be shown when toggle is active!'); }
                                                            }} type="checkbox" id={`ShowWebpartCheckbox${index}`} />
                                                            {items?.ShowWebpart === true ? <div className="slider round" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}` }}></div> : <div className="slider round"></div>}
                                                        </label></>}
                                                </Col>
                                                <Col sm="4" md="4" lg="4">
                                                    {/* {props?.EditItem != undefined && props?.EditItem != '' ? <a className="pull-right hreflink" title="Add To Webpart Gallery" onClick={(e) => AddWebpartToGallery(items, index)}>Add To Webpart Gallery</a> : ''} */}
                                                    {items?.IsTemplate != true && <> <div> Group By View</div>
                                                        <label className="switch me-2" htmlFor={`GroupByViewCheckbox${index}`}>
                                                            <input checked={items?.GroupByView} onChange={(e: any) => {
                                                                const updatedItems = [...NewItem]; updatedItems[index] = { ...items, GroupByView: e.target.checked, };
                                                                setNewItem(updatedItems);
                                                            }}

                                                                type="checkbox" id={`GroupByViewCheckbox${index}`} />
                                                            {items?.GroupByView === true ? <div className="slider round" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}` }}></div> : <div className="slider round"></div>}
                                                        </label></>}
                                                </Col>
                                                <Col sm="1" md="1" lg="1">
                                                    {index != 0 && <a className="pull-right hreflink" title="Remove webpart" onClick={(e) => RemoveWebpart(items, index)}><span className="svg__iconbox svg__icon--cross "></span></a>}
                                                </Col>
                                            </Row>
                                            <Row className="Metadatapannel mb-2">
                                                <Col sm="12" md="12" lg="12">
                                                    <label className='form-label full-width'>Webpart Position</label>
                                                </Col>
                                                <Col sm="6" md="6" lg="6">
                                                    <div className="input-group">
                                                        <label className='form-label full-width'>Row Position</label>
                                                        <input className='form-control' type='text' placeholder="Row" value={items?.WebpartPosition?.Row}
                                                            onChange={(e) => {
                                                                const updatedItems = [...NewItem]; updatedItems[index] = { ...items, WebpartPosition: { ...items.WebpartPosition, Row: e.target.value.trim() === '' ? '' : parseInt(e.target.value) } };
                                                                setNewItem(updatedItems);
                                                            }} />
                                                    </div>
                                                </Col>
                                                <Col sm="6" md="6" lg="6">
                                                    <div className="input-group">
                                                        <label className='form-label full-width'>Column Position</label>
                                                        <input className='form-control' type='text' placeholder="Column" value={items?.WebpartPosition?.Column}
                                                            onChange={(e) => {
                                                                const updatedItems = [...NewItem];
                                                                updatedItems[index] = { ...items, WebpartPosition: { ...items.WebpartPosition, Column: e.target.value.trim() === '' ? '' : parseInt(e.target.value) } };
                                                                setNewItem(updatedItems);
                                                            }} />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="Metadatapannel">
                                                {items?.IsTemplate != true && <><Col sm="4" md="4" lg="4"><label className='form-label full-width'>Data Source</label>
                                                    <Dropdown id="DataSource" options={[{ key: '', text: '' }, ...(DataSource?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.DataSource}
                                                        onChange={(e, option) => handleDataSourceChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }}
                                                    /> </Col></>}
                                                {items?.IsTemplate != true && <> <Col sm="4" md="4" lg="4">
                                                    <div className="form-check form-check-inline m-4">
                                                        <input type="checkbox" checked={items?.IsDefaultTile} className="form-check-input me-1" onClick={(e: any) => SelectedTile(e.target.checked, items, index)} />
                                                        <label className="form-check-label">Default Tile</label>
                                                    </div>
                                                </Col>
                                                    <Col sm="4" md="4" lg="4">
                                                        <div className="form-check form-check-inline m-4">
                                                            <input type="checkbox" checked={items?.IsShowTile} className="form-check-input me-1" onChange={(e: any) => {
                                                                const updatedItems = [...NewItem]; updatedItems[index] = { ...items, IsShowTile: e.target.checked, };
                                                                setNewItem(updatedItems);
                                                            }} />
                                                            <label className="form-check-label">Show Tile</label>
                                                        </div>
                                                    </Col>
                                                </>}
                                            </Row>
                                            <Row className="Metadatapannel">
                                                {items.DataSource != 'TimeSheet' &&
                                                    <Col sm="12" md="12" lg="12">
                                                        {/* {items?.selectUserFilterType != undefined && items?.selectUserFilterType != '' && */}
                                                        <label className='form-label full-width SpfxCheckRadio mb-1'>
                                                            <input type="radio" className='radio' value="custom" checked={items?.selectFilterType === 'custom'} onChange={(e) => handleFilterChange(e, index, items)} />
                                                            Custom Filter
                                                            <input type="radio" className='radio ms-3' value="smartFav" checked={items?.selectFilterType === 'smartFav'} onChange={(e) => handleFilterChange(e, index, items)} />
                                                            SmartFav Filter
                                                        </label>
                                                        {/* } */}
                                                    </Col>}
                                                {(items?.DataSource == "Tasks" || items?.DataSource == "Project") && items?.selectFilterType == 'custom' &&
                                                    <span>
                                                        {items?.selectUserFilterType != undefined && items?.selectUserFilterType != '' && <Col sm="4" md="4" lg="4">
                                                            <><label className='form-label full-width'>My Role</label>
                                                                <label className='form-label full-width SpfxCheckRadio'>
                                                                    <input type="radio" className='radio' value="ResponsibleTeam" checked={items?.selectUserFilterType === 'ResponsibleTeam'} onChange={(e) => handleUserFilterChange(e, index, items)} />
                                                                    Task Lead
                                                                </label>
                                                                <label className='form-label full-width SpfxCheckRadio'>
                                                                    <input type="radio" className='radio' value="TeamMembers" checked={items?.selectUserFilterType === 'TeamMembers'} onChange={(e) => handleUserFilterChange(e, index, items)} />
                                                                    Task Member
                                                                </label>
                                                                <label className='form-label full-width SpfxCheckRadio'>
                                                                    <input type="radio" className='radio' value="AssignedTo" checked={items?.selectUserFilterType === 'AssignedTo'} onChange={(e) => handleUserFilterChange(e, index, items)} />
                                                                    Working User
                                                                </label>
                                                            </>
                                                        </Col>}
                                                    </span>
                                                }
                                                <Col sm="6" md="6" lg="6">
                                                    {(items.DataSource == "Tasks" || items.DataSource == "Project") && items?.selectFilterType == 'smartFav' &&
                                                        <>
                                                            <div className="input-group mb-2">
                                                                <label className="form-label full-width">
                                                                    Select Filter
                                                                </label>
                                                                <>
                                                                    <input key={index} type="text" className="form-control" id={`txtSmartFav${items?.Id}`} placeholder="Search SmartFav Here"
                                                                        value={items?.SmatFavSearchKey} onChange={(e) => autoSuggestionsSmartFav(e, items, "txtSmartFav" + items?.Id)} />
                                                                    {SearchedSmartFavData?.length > 0 && autoSuggestItem?.Id == items?.Id ? (
                                                                        <div className="SmartTableOnTaskPopup">
                                                                            <ul className="autosuggest-list maXh-200 scrollbar list-group">
                                                                                {SearchedSmartFavData.map((item: any) => {
                                                                                    return (
                                                                                        <li
                                                                                            className="hreflink list-group-item rounded-0 p-1 list-group-item-action"
                                                                                            key={item.id}
                                                                                            onClick={() => setSelectedSmartFavData(item, index, items, "txtSmartFav" + items?.Id)}  >
                                                                                            <a>{item.Title}</a>
                                                                                        </li>
                                                                                    );
                                                                                })}
                                                                            </ul>
                                                                        </div>
                                                                    ) : null}
                                                                    {items?.selectedSmartFav != undefined && items?.selectedSmartFav?.Title != undefined && <div className="block w-100">
                                                                        <a style={{ color: "#fff !important" }} className="textDotted"   >
                                                                            {items?.selectedSmartFav?.Title}
                                                                        </a>
                                                                        <span onClick={() => removeSmartFavItem(selectedSmartFav, index, items)} className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"  ></span>
                                                                    </div>}

                                                                </>
                                                                <span className="input-group-text" title="Smart Fav Popup" onClick={(e) => openSmartFav(items, index)}  >
                                                                    <span className="svg__iconbox svg__icon--editBox"></span>
                                                                </span>
                                                            </div>
                                                            {/* <Dropdown id="FiltesSmartFav" options={[{ key: '', text: '' }, ...(SmartFav?.map((item: any) => ({ key: item?.UpdatedId, text: item?.Title })) || [])]} selectedKey={items?.smartFevId}
                                                                onChange={(e, option) => handleSelectFilterChange(option?.key, index, items)}
                                                                styles={{ dropdown: { width: '100%' } }} /> */}
                                                        </>
                                                    }
                                                    {(items.DataSource == "Tasks" || items.DataSource == "Project") && items?.selectFilterType == 'custom' && !items.FilterType && <><label className='form-label full-width'>Status</label> <Dropdown id="FiltersCustom" options={[{ key: '', text: '' }, ...(StatusOptions?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.Status}
                                                        onChange={(e, option) => handleCustomFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == "Tasks" && items.FilterType == "Actions" && items?.selectFilterType == 'custom' && <><label className='form-label full-width'>Actions</label> <Dropdown id="FiltersAction" options={[{ key: '', text: '' }, ...(ActionsOptions?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.Status}
                                                        onChange={(e, option) => handleCustomFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == "Tasks" && items.FilterType == "Priority" && items?.selectFilterType == 'custom' && <><label className='form-label full-width'>Priority</label> <Dropdown id="FiltersPriority" options={[{ key: '', text: '' }, ...(PriorityOptions?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.Status}
                                                        onChange={(e, option) => handleCustomFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == "Tasks" && items.FilterType == "Sites" && items?.selectFilterType == 'custom' && <><label className='form-label full-width'>Sites</label> <Dropdown id="FiltersSiteTypes" options={[{ key: '', text: '' }, ...(SiteTypes?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.Status}
                                                        onChange={(e, option) => handleCustomFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == "Tasks" && items.FilterType == "Categories" && items?.selectFilterType == 'custom' &&
                                                        <>
                                                            <div className="input-group mb-2">
                                                                <label className="form-label full-width">
                                                                    Categories
                                                                </label>
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
                                                                    <span className="svg__iconbox svg__icon--editBox"></span>
                                                                </span>
                                                            </div>
                                                        </>
                                                    }
                                                    {items.DataSource == "TaskUsers" && items?.selectFilterType == 'smartFav' && <><label className='form-label full-width'>Select Filter</label><Dropdown id="FiltesTaskUser" options={[{ key: '', text: '' }, ...(AllTaskUsers?.map((item: any) => ({ key: item?.Id, text: item?.Title })) || [])]} selectedKey={items?.smartFevId}
                                                        onChange={(e, option) => handleSelectFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == "TaskUsers" && items?.selectFilterType == 'custom' && <><label className='form-label full-width'>Select Filter</label><Dropdown id="FiltesCustomTaskUser" options={[{ key: '', text: '' }, ...(CustomUserFilter?.filter(item => item.value !== "My TimSheet").map(item => ({ key: item.value, text: item.status })) || [])
                                                    ]} selectedKey={items?.Status}
                                                        onChange={(e, option) => handleCustomUserFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == 'TimeSheet' && <><label className='form-label full-width'>Select Filter</label><Dropdown id="FiltesCustomTaskUser" options={[{ key: '', text: '' }, ...(CustomUserFilter?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.Status}
                                                        onChange={(e, option) => handleCustomUserFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                </Col>
                                                <Col sm="4" md="4" lg="4">
                                                    {items.DataSource == "Tasks" && items.FilterType == "Actions" && items?.selectFilterType == 'custom' && <><label className='form-label full-width'>User</label> <Dropdown id="FiltersAction" options={[{ key: '', text: '' }, ...(UserOptions?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.UserId}
                                                        onChange={(e, option) => handleCustomUserChange(option?.key, option?.text, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                </Col>
                                            </Row>
                                        </div >
                                    </>
                                )
                            })}
                        </Col>
                    </Row>
                </div>
                {props?.SingleWebpart != true && <div className='mb-5'><a className="pull-right empCol hreflink" onClick={(e) => AddMorewebpart()}> +Add More </a></div>}
                <div className='modal-footer mt-2'>
                    {/* || IsCheck == false */}
                    <button className="btn btn-primary ms-1" onClick={SaveConfigPopup} disabled={DashboardTitle == ''}>Save</button>
                    <button className='btn btn-default ms-1' onClick={CloseConfiguationPopup}>Cancel</button>
                </div>
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
            <Panel
                onRenderHeader={customHeader}
                isOpen={PopupSmartFav} type={PanelType.custom} customWidth="800px" onDismiss={cancelSelectSmartFav} isBlocking={false}  >
                <div id="SmartFavoritePopup">
                    <div className={"modal-body"}>
                        <div className="mb-2">
                            {selectedSmartFav != undefined && selectedSmartFav?.Title != undefined ?
                                <div className="full-width">
                                    <span className="block me-1">
                                        <span>{selectedSmartFav?.Title}</span>
                                        <span className="bg-light hreflink ms-2 svg__icon--cross svg__iconbox" onClick={() => deleteSelectedSmartFav()}></span>
                                    </span>
                                </div> : null}
                        </div>
                        <div className='col-sm-12 mt-16'>
                            <ul className="categories-menu p-0 maXh-300 overflow-auto p-0">
                                {SmartFav.map(function (item: any) {
                                    return (
                                        <>
                                            <li key={item.Id}>
                                                <div onClick={() => selectPickerData(item)} className='alignCenter hreflink justify-content-between'>
                                                    <span >
                                                        {item.Title}
                                                    </span>
                                                </div>
                                            </li>
                                        </>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <footer className={"fixed-bottom bg-f4 p-3"}>
                        <div className="alignCenter justify-content-between">
                            <div className="">
                            </div>
                            <div className="pull-right">
                                <button type="button" className="btn btn-primary px-3 mx-1" onClick={saveSelectSmartFav} >
                                    Save
                                </button>
                                <button type="button" className="btn btn-default mx-1" onClick={cancelSelectSmartFav} >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </footer>
                </div>
            </Panel >
        </>
    );
};
export default AddConfiguration;