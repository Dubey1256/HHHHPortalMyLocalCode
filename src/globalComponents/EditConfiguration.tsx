import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import { Col, Row } from "react-bootstrap";
import Tooltip from "./Tooltip";
import { myContextValue } from "./globalCommon";
import Picker from "./EditTaskPopup/SmartMetaDataPicker";
import PageLoader from '../globalComponents/pageLoader';
import AddConfiguration from "./AddConfiguration";
// import WebPartDisplay from "./DisplayDashBoardWebpart";
let portfolioColor: any = '#057BD0';
let AutoCompleteItemsArray: any = [];
var AllSitesData: any = [];
let DashTemp: any = [];
var tempCategoryData: any = "";
let BackupTaskCategoriesData: any = [];
let PrevSelectedSmartFav: any = '';
let SelectedDashboard: any;
let autoSuggestItem: any;
const EditConfiguration = (props: any) => {
    props.props.siteUrl = props?.props?.Context?._pageContext?._web?.absoluteUrl
    const [progressBar, setprogressBar] = useState(true)
    const params = new URLSearchParams(window.location.search);
    const rerender = React.useReducer(() => ({}), {})[1];
    let DashboardId: any = params.get('DashBoardId');
    if (DashboardId == undefined || DashboardId == '')
        DashboardId = 1;
    const ContextData: any = useContext(myContextValue);
    const [IsComponentPicker, setIsComponentPicker] = useState<any>(false);
    const [SelectedCategory, setSelectedCategory] = useState<any>([]);
    const [selectedSmartFav, setselectedSmartFav] = useState<any>(undefined);
    const [SiteTypes, setSiteTypes] = useState<any>([]);
    const [SmartMetaDataAllItems, setSmartMetaDataAllItems] = useState<any>([]);
    let defaultConfig = { "WebpartTitle": '', "TileName": '', "ShowWebpart": '', "WebpartPosition": { "Row": 0, "Column": 0 }, "GroupByView": '', "Id": 1, "AdditonalHeader": false, "smartFevId": '', "DataSource": "Tasks", "selectFilterType": "smartFav", "selectUserFilterType": "AssignedTo" }
    const [NewItem, setNewItem]: any = useState<any>([defaultConfig]);
    const [Items, setItems]: any = useState<any>([defaultConfig]);
    const [SmartFav, setSmartFav] = useState<any>([]);
    const [AllTaskUsers, setAllTaskUsers] = useState<any>([]);
    const [DashboardTemplate, setDashboardTemplate] = useState<any>([]);
    const [DataSource, setDataSource] = useState<any>([]);
    const [DashboardTitle, setDashboardTitle] = useState<any>('');
    const [IsCheck, setIsCheck] = useState<any>(false);
    const [categorySearchKey, setCategorySearchKey] = useState<any>("");
    const [SmatFavSearchKey, setSmatFavSearchKey] = useState<any>("");
    const [AllCategoryData, setAllCategoryData] = useState<any>([]);
    const [SearchedCategoryData, setSearchedCategoryData] = useState<any>([]);
    const [SearchedSmartFavData, setSearchedSmartFavData] = useState<any>([]);
    const [TaskCategoriesData, setTaskCategoriesData] = useState<any>([]);
    const [SmartFavData, setSmartFavData] = useState<any>([]);
    const [UserOptions, setUserOptions] = useState<any>([]);
    const [ExistingWeparts, setExistingWeparts] = useState<any>([]);
    const [PopupSmartFav, setPopupSmartFav] = React.useState(false);
    const [dragItem, setDragItem] = useState({ Current: null, CurrentIndex: null });
    const [dragOverItem, setDragOverItem] = useState({ Current: null, CurrentIndex: null });
    const [IsManageConfigPopup, setIsManageConfigPopup] = React.useState(false);
    const [SelectedItem, setSelectedItem]: any = React.useState({});
    const [IsWebPartPopup, setIsWebPartPopup] = React.useState(false);
    const [type, setType] = useState<any>({});
    const [tabClassActive, setTabbClassActive] = React.useState("");

    let [StatusOptions, setStatusOptions] = useState([{ value: 0, status: "0% Not Started", }, { value: 1, status: "1% For Approval", }, { value: 2, status: "2% Follow Up", }, { value: 3, status: "3% Approved", },
    { value: 4, status: "4% Checking", }, { value: 5, status: "5% Acknowledged", }, { value: 9, status: "9% Ready To Go", }, { value: 10, status: "10% working on it", },
    { value: 70, status: "70% Re-Open", }, { value: 75, status: "75% Deployment Pending", }, { value: 80, status: "80% In QA Review", }, { value: 90, status: "90% Task completed", },
    { value: 100, status: "100% Closed", },]);
    let [ActionsOptions, setActionsOptions] = useState([{ value: "Bottleneck", status: "Bottleneck", }, { value: "Phone", status: "Phone", }, { value: "Attention", status: "Attention", }, { value: "Approval", status: "Approval", },])
    let [PriorityOptions, setPriorityOptions] = useState([{ value: 1, status: "1", }, { value: 2, status: "2", }, { value: 3, status: "3", }, { value: 4, status: "4", }, { value: 5, status: "5", }, { value: 6, status: "6", }, { value: 7, status: "7", },
    { value: 8, status: "8", }, { value: 9, status: "9", }, { value: 10, status: "10", },])

    let [CustomUserFilter, setCutomUserFilter] = useState([{ value: 'Approver', status: "Me As Approver", }, { value: 'TeamLeader', status: "Me As Team Lead", }]);

    const NewConfigarray = (newArray: any, arrayItem: any, Count: any) => {

        const array = newArray.filter((a: any) => a.WebpartPosition.Column === Count)
        if (array?.length > 0) {
            let ColumnsValue: any = {};
            ColumnsValue.ColumnTitle = 'Column' + Count;
            ColumnsValue.ColumnValue = Count;
            ColumnsValue.ArrayValue = array;
            arrayItem.push(ColumnsValue);
            Count++;
            NewConfigarray(newArray, arrayItem, Count);
        }
    }

    const dragStart = (e: any, position: any, index: any) => {
        console.log(position);
        // dragItem.Current =position;
        setDragItem(prevState => ({
            ...prevState,
            Current: position,
            CurrentIndex: index
        }));

    }
    const dragEnd = (e: any, position: any, index: any) => {
        console.log(position);
        // dragItem.Current =position;
        setDragOverItem(prevState => ({
            ...prevState,
            Current: position,
            CurrentIndex: index
        }));

    }
    const drop = (e: any, index: any, statusProperty: any) => {
        console.log(e);
        if (statusProperty === "sameArray") {
            const targetIndex = dragOverItem.Current;

            // Clone the NewItem array to avoid direct state mutation
            const updatedItems = [...NewItem];

            // Extract the item being dragged
            const draggedItemContent = updatedItems[index].ArrayValue[dragItem.Current];

            // Remove the dragged item from its original position
            updatedItems[index].ArrayValue.splice(dragItem.Current, 1);

            if(updatedItems[dragItem.Current].length ===0)
            updatedItems[dragItem.Current].ArrayValue.push(draggedItemContent)
            // Insert the dragged item at the new position
            //  updatedItems[index].ArrayValue.splice(targetIndex, 0, draggedItemContent);
            updatedItems[dragOverItem?.CurrentIndex].ArrayValue.splice(targetIndex, 0, draggedItemContent);
            // Clear the drag indices
            updatedItems?.forEach((item: any, index: any) => {
                if (dragOverItem.CurrentIndex === index)
                    item?.ArrayValue?.forEach((subChild: any, indexChild: any) => {
                        if (subChild?.WebpartPosition != undefined) {
                            subChild.WebpartPosition.Row = indexChild + 1;
                            subChild.WebpartPosition.Column = (dragOverItem.CurrentIndex + 1);
                        }
                    })
            })
            updatedItems?.forEach((item: any, Itemindex: any) => {
                if (item?.ArrayValue?.length === 0)
                    updatedItems.splice(Itemindex, 1);
            })

            dragItem.Current = null;
            dragOverItem.Current = null;

            // Update the state with the new items array
            setNewItem(updatedItems);
        }
        else if (statusProperty === "DifferentArray") {
            const targetIndex = dragOverItem.Current;

            // Clone the NewItem array to avoid direct state mutation
            const updatedItems = [...NewItem];

            // Extract the item being dragged
            const draggedItemContent = ExistingWeparts[dragItem.Current];
            draggedItemContent.WebpartTitle = draggedItemContent.Title;
            let obj: any = {};
            obj.Column = dragOverItem.Current;
            obj.Row = dragOverItem.CurrentIndex;
            draggedItemContent.WebpartPosition = obj;
            // Remove the dragged item from its original position
            ExistingWeparts.splice(index, 1);
            setExistingWeparts(ExistingWeparts);

            // Insert the dragged item at the new position
            //  updatedItems[index].ArrayValue.splice(targetIndex, 0, draggedItemContent);
            updatedItems[dragOverItem?.CurrentIndex].ArrayValue.splice(targetIndex, 0, draggedItemContent);
            // Clear the drag indices

            updatedItems?.forEach((item: any, index: any) => {
                if (dragOverItem.CurrentIndex === index)
                    item?.ArrayValue?.forEach((subChild: any, indexChild: any) => {
                        if (subChild?.WebpartPosition != undefined) {
                            subChild.WebpartPosition.Row = indexChild + 1;
                            subChild.WebpartPosition.Column = (dragOverItem.CurrentIndex + 1);
                        }

                    })

            })
            dragItem.Current = null;
            dragOverItem.Current = null;
            // Update the state with the new items array
            setNewItem(updatedItems);
        }

    }

    const LoadSmartFav = () => {

        let SmartFavData: any = []

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
                setItems(newArray);
                setType(newArray[0]);
                let arrayItem: any = [];
                let Count = 1;
                NewConfigarray(newArray, arrayItem, Count);
                arrayItem?.forEach((obj: any) => {
                    obj.ClassValues = "col-sm-" + 12 / arrayItem.length;
                })
                setNewItem(arrayItem);
            }
            else {
                setNewItem([defaultConfig])
                setItems(defaultConfig);
            }
            setprogressBar(false)
            setSmartFav(SmartFavData)
        }).catch((err: any) => {
            console.log(err);
        })
    }
    const LoadExistingWebparts = () => {
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").getAll().then((data: any) => {
            setExistingWeparts(data);
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
            let arrayItems: any = [];
            NewItem?.forEach((config: any) => {
                arrayItems = arrayItems.concat(config.ArrayValue);
            })
            arrayItems?.forEach((filter: any) => {
                filter.selectedSmartFav = {};
            })
            await web.lists.getById(props?.props.AdminConfigurationListId).items.getById(props?.EditItem?.Id).update({ Title: DashboardTitle, Configurations: JSON.stringify(arrayItems) })
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

        } catch (error) {
            console.log(error);
        }

    }
    const CustomHeaderConfiguration = () => {
        return (
            <>
                <div className='siteColor subheading'>
                    {props?.EditItem != undefined && props?.EditItem != '' ? <span>Edit Dashboard Configuration</span> : <span>Edit Dashboard Configuration</span>}
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
        if (NewItem?.length === 1)
            defaultConfig.Id = NewItem?.length + 1;
        else
            defaultConfig.Id = NewItem?.length;
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
        let tempArray: any = [];
        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            AllSmartDataListData = await web.lists.getById(props?.props?.SmartMetadataListID)
                .items.select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail").expand("Author,Editor,IsSendAttentionEmail").getAll();
            AllSmartDataListData?.map((SmartItemData: any, index: any) => {
                if (SmartItemData?.TaxType === "DataSource")
                    tempArray.push(SmartItemData);
            })
            setDataSource(tempArray);

            // ########## this is for All Site Data related validations ################

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
        tempCategoryData = tempString;
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
        PrevSelectedSmartFav = { ...selectedSmartFav }
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
        setSmatFavSearchKey(e.target.value);
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
        setSmatFavSearchKey("");
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
                alert('This webpart already exist')
            }
            else {
                delete items?.IsDefaultTile;
                delete items?.selectedSmartFav;
                delete items?.SmatFavSearchKey;
                await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: items?.WebpartTitle != undefined && items?.WebpartTitle != '' ? items?.WebpartTitle : '', Key: "WebpartTemplate", Value: props?.EditItem?.Id != undefined ? props?.EditItem?.Id.toString() + items?.Id : undefined, Configurations: items != undefined ? JSON.stringify(items) : '' })
                    .then(async (res: any) => {
                        console.log(items)
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
        LoadExistingWebparts();
        // LoadDashboardTemplate();
        //  loadTaskUsers();
    }, []);


    const OpenConfigPopup = (Config: any) => {
        setIsManageConfigPopup(true);
        setSelectedItem(Config);
    }
    const CloseConfigPopup = () => {
        setIsManageConfigPopup(false);
        setSelectedItem('');
    }

    const AddWebpartPopup = () => {

        setIsWebPartPopup(true);
    }
    const CloseWebpartPopup = (array: any, Properties: any) => {
        if (array?.length > 0) {
            const arraynew: any = NewItem[0].ArrayValue = NewItem[0].ArrayValue.concat(array);
            setNewItem(arraynew);
        }
        setIsWebPartPopup(false);
    }
    const AddColumn = () => {
        const copyListItems = [...NewItem];
        if (copyListItems?.length < 3) {
            let ColumnsValue: any = {};
            ColumnsValue.ColumnTitle = 'Column' + (copyListItems.length + 1);
            ColumnsValue.ColumnValue = copyListItems.length + 1;
            ColumnsValue.ArrayValue = [];
            copyListItems.push(ColumnsValue);
            copyListItems?.forEach((obj: any) => {
                obj.ClassValues = "col-sm-" + 12 / copyListItems.length;
            })
            setNewItem(copyListItems);
        }
    }
    const deleteExistingTemplate = async (itemValue: any, arrayIndex: number) => {
        const updatedItems = [...NewItem];
        // Remove the dragged item from its original position
        updatedItems?.forEach((item: any, index: any) => {
            if (index === arrayIndex)
                item?.ArrayValue?.forEach((subChild: any, indexChild: any) => {
                    if (itemValue.Id === subChild?.Id) {
                        item?.ArrayValue?.splice(indexChild, 1);
                    }
                })
        })
        setNewItem(updatedItems);
    }
    return (
        <>
            <Panel onRenderHeader={CustomHeaderConfiguration}
                isOpen={props?.IsOpenPopup}
                onDismiss={CloseConfiguationPopup}
                isBlocking={false}
                type={PanelType.large}>
                <div className='modal-body'>
                    {progressBar && <PageLoader />}
                    <div className="mb-2">
                        <label className='form-label full-width fw-semibold'>Drag and drop tiles between columns in any vertical order.</label></div>
                    <div className="Metadatapannel border p-2 mb-2">
                        <div className="row">
                            <div className="col-sm-10 pe-0">
                                <div className="row">
                                    {NewItem != undefined && NewItem?.length > 0 && NewItem.map((item: any, index: any) => {
                                        return (
                                            <>
                                                {/* <div className="row"> */}
                                                <div className={item.ClassValues}>
                                                    <div className="fw-semibold text-center mb-2" style={{ borderBottom: '1px solid var(--SiteBlue)' }}>{item.ColumnTitle}</div>
                                                    {item != undefined && item?.ArrayValue?.length > 0 && item?.ArrayValue?.map((subitem: any, indexNew: any) => {
                                                        return (
                                                            <>
                                                                <div className="alignCenter bg-siteColor justify-content-center mb-2 w-100" style={{ height: '50px' }} onDragStart={(e) => dragStart(e, indexNew, index)}
                                                                    onDragEnter={(e) => dragEnd(e, indexNew, index)}
                                                                    onDragEnd={(e) => drop(e, index, "sameArray")}
                                                                    key={indexNew}
                                                                    draggable
                                                                >{subitem.WebpartTitle}

                                                                    {" "}
                                                                    <span title="Edit" className="light ml-12 svg__icon--editBox svg__iconbox" onClick={(e) => OpenConfigPopup(subitem)} ></span>
                                                                    <span title="Edit" className="light ml-12  svg__icon--cross svg__iconbox" onClick={(e) => deleteExistingTemplate(subitem ,index)} ></span>
                                                                </div>
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                                {/* </div> */}
                                            </>
                                        )
                                    })}</div></div>
                            <div className="col-sm-2 text-end">
                                <div className='form-label full-width mb-1 alignCenter' onClick={(e) => AddColumn()}><a className="alignCenter hreflink ml-auto siteColor"><span className="svg__iconbox svg__icon--Plus mini"></span> Add Column</a></div>
                                <div className='form-label full-width alignCenter' onClick={(e) => AddWebpartPopup()}><a className="alignCenter hreflink ml-auto siteColor"> <span className="svg__iconbox svg__icon--Plus mini"></span> Add WebPart</a></div>
                                {IsWebPartPopup && <div className='form-label full-width' >

                                    {IsWebPartPopup && ExistingWeparts?.length > 0 && ExistingWeparts?.map((item: any, index: any) => {
                                        return (
                                            <>
                                                <div className="alignCenter bg-siteColor justify-content-center mb-2 w-100" style={{ height: '50px' }} onDragStart={(e) => dragStart(e, index, index)}
                                                    onDragEnter={(e) => dragEnd(e, index, index)}
                                                    onDragEnd={(e) => drop(e, index, "DifferentArray")}
                                                    key={index}
                                                    draggable
                                                >{item.Title}
                                                </div>
                                            </>
                                        )
                                    })}
                                </div>}

                            </div>

                        </div>
                    </div>
                    <div className="Metadatapannel lastmodify mb-2">
                        <>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                {
                                    Items?.length && Items.map((siteValue: any) =>
                                        <>
                                            <button onClick={() => { setType(siteValue) }} className={`nav-link ${siteValue.Id == Items[0].Id ? 'active' : ''}`} id={`nav-${siteValue.Id}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${siteValue.Id}`} type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                                                <div className={`${siteValue.Id}` + "text-capitalize"}  >{siteValue.WebpartTitle}</div></button>
                                        </>
                                    )
                                }
                                {/* <button style={{ position: 'relative', left: '180px', }} onClick={() => multipleDeleteFunction(multipleDelete)}><span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span></button> */}
                            </div>

                            <div className={Items?.some((e: any) => e.Id === type?.Id ? " tab-pane fade active show border mt-2 p-2" : " tab-pane fade border mt-2 p-2")} id={`nav-${type?.Id}`} role="tabpanel" aria-labelledby={`nav-${type.Id}-tab`}>
                                <div className="border p-2 mt-2">
                                    <label className='form-label full-width fw-semibold'>Data Source</label>
                                    {DataSource &&
                                        <>
                                            {
                                                DataSource?.length && DataSource.map((item: any) =>
                                                    <>
                                                        <div className="SpfxCheckRadio">
                                                            <input className="radio" name="ApprovalLevel" type="radio" checked={type.DataSource === item.Title ? true : false} onChange={() => setType({ ...type, DataSource: item.Title })} />
                                                            {item.Title}
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </>

                                    }
                                </div>
                                <div className="Metadatapannel my-2">
                                    <>
                                        <div className="border p-2">
                                            <label className='form-label fw-semibold full-width'>Select Filter</label>
                                            <div className="row">
                                                {
                                                    SmartFav?.length && SmartFav.map((item: any) =>
                                                        <div className="col-sm-6 pl-0">
                                                            <label className="SpfxCheckRadio">
                                                                <input className="radio" name="ApprovalLevelnew" type="radio" checked={type?.selectedSmartFav?.Title === item?.Title ? true : false} onChange={() => setType({ ...type, selectedSmartFav: item })} />  {item.Title}
                                                            </label>
                                                        </div>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </>
                                </div>
                            </div>
                        </>

                    </div>

                </div>
                {/* {props?.SingleWebpart != true && <div className='mb-5'><a className="pull-right empCol hreflink" onClick={(e) => AddMorewebpart()}> +Add More </a></div>} */}
                <div className='modal-footer mt-2 pe-0'>
                    {/* || IsCheck == false */}
                    <button className="btn btn-primary ms-1" onClick={SaveConfigPopup} disabled={DashboardTitle == ''}>Save</button>
                    <button className='btn btn-default ms-1' onClick={CloseConfiguationPopup}>Cancel</button>
                </div>
            </Panel >
            <span>
                {IsManageConfigPopup && <AddConfiguration DashboardConfigBackUp={props.props} SingleWebpart={true} props={props.props} EditItem={SelectedItem} IsOpenPopup={SelectedItem} CloseConfigPopup={CloseConfigPopup} />}
            </span>
            <span>

                {/* {IsWebPartPopup && <WebPartDisplay DashboardConfigBackUp={props.props} props={props.props} IsWebPartPopup={IsWebPartPopup} CloseWebpartPopup={CloseWebpartPopup} />} */}
            </span>
            {/* {IsComponentPicker && (
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
            </Panel > */}
        </>

    );
};
export default EditConfiguration;