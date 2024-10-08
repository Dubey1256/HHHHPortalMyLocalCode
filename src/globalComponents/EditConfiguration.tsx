import React, { useContext, useEffect, useState } from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import Tooltip from "./Tooltip";
import { deepCopy, myContextValue } from "./globalCommon";
import * as globalCommon from "./globalCommon";
import PageLoader from '../globalComponents/pageLoader';
import _ from "lodash";
import AddEditWebpartTemplate from "./AddEditWebpartTemplate";
import AddDashboardTemplate from "./AddDashboardTemplate";
import { GlobalConstants } from "./LocalCommon";
import { Label, makeStyles, mergeClasses, tokens, Tooltip as InfoToolTip, useId, } from "@fluentui/react-components";
import { Info16Regular, Add16Regular } from "@fluentui/react-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import * as Moment from "moment";
let DashTemp: any = [];
let ExistingWepartsBackup: any = [];
let TempBackup: any = [];
let ColumnDetails: any = [];
let UserName = ""
const useStyles = makeStyles({
    root: { display: "flex", columnGap: tokens.spacingVerticalS, },
    visible: { color: tokens.colorNeutralForeground2BrandSelected, },
});
let DraggedItem: any = {};
const EditConfiguration = (props: any) => {
    UserName = ' - {' + props?.props?.Context?._pageContext?._legacyPageContext.userDisplayName + '}';
    props.props.siteUrl = props?.props?.Context?._pageContext?._web?.absoluteUrl
    const [progressBar, setprogressBar] = useState(true)
    const params = new URLSearchParams(window.location.search);
    const rerender = React.useReducer(() => ({}), {})[1];
    let DashboardId: any = params.get('DashBoardId');
    if (DashboardId == undefined || DashboardId == '')
        DashboardId = 1;
    const ContextData: any = useContext(myContextValue);
    let defaultConfig = { "WebpartTitle": '', "TileName": '', "ShowWebpart": '', "WebpartPosition": { "Row": 1, "Column": 1 }, "GroupByView": '', "Id": 1, "AdditonalHeader": false, "smartFevId": '', "DataSource": "Tasks", "selectFilterType": "smartFav", "selectUserFilterType": "AssignedTo" }
    const [NewItem, setNewItem]: any = useState([defaultConfig]);
    const [Items, setItems]: any = useState<any>([defaultConfig]);
    const [SmartFav, setSmartFav] = useState<any>([]);
    const [DataSource, setDataSource] = useState<any>([]);
    const [DashboardTitle, setDashboardTitle] = useState<any>('');
    const [ExistingWeparts, setExistingWeparts] = useState([]);
    const [ExistingWepartsBakup, setExistingWepartsBakup] = useState([]);
    const [dragItem, setDragItem] = useState<any>();
    const [dragOverItem, setDragOverItem] = useState<any>();
    const [IsManageConfigPopup, setIsManageConfigPopup] = React.useState(false);
    const [SelectedItem, setSelectedItem]: any = React.useState({});
    const [type, setType] = useState<any>({});
    const [IsOpenPopup, setIsOpenPopup] = React.useState(false);
    const [IsDashboardPage, setIsDashboardPage] = React.useState(false);
    const [IsDashboardTemplate, setIsDashboardTemplate] = React.useState(false);
    const [DashboardTemplateItem, setDashboardTemplateItem]: any = React.useState({});
    const styles = useStyles();
    const contentId = useId("content");
    const [visible, setVisible] = useState(false);
    const [visibleRank, setVisibleRank] = useState(false);
    const [ItemRankval, setItemRankval] = useState<any>(null);
    const [serachValue, setserachValue] = useState<any>("");
    const [StatusArray, setStatusArray] = useState<any>([]);;
    const [ProjectStatusPopup, setProjectStatusPopup] = React.useState(false);
    const [ProjectDueDate, setProjectDueDate] = React.useState(false);
    const [WebpartTitle, setWebpartTitle] = React.useState<any>('');
    const [startDueDate, setStartDueDate] = useState<any>(null);
    const [endDueDate, setEndDueDate] = useState<any>(null);
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
        //e.preventDefault();
        e.dataTransfer.setData("Text", e.target.id);
        console.log(position);
        // dragItem.Current =position;
        $('#textDrag').css('cursor', 'grabbing');
        // TweenLite.set("#dragme",{cursor:"grabbing"});
        let dragStart = { Current: position, CurrentIndex: index }
        setDragItem(dragStart);

    }
    const dragEnd = (e: any, position: any, index: any) => {
        console.log(position);
        // dragItem.Current =position;
        let dragStartEnd = { Current: position, CurrentIndex: index }
        setDragOverItem(dragStartEnd);
    }
    const IsExistsItem = (array: any, Item: any) => {
        let isExists = false;
        for (let index = 0; index < array.length; index++) {
            let item = array[index];
            if (item.WebpartId === Item?.WebpartId) {
                isExists = true;
                //return false;
            }
        }
        return isExists;
    }

    const drop = (e: any, childindex: any, index: any, statusProperty: any) => {
        console.log(e);

        if (statusProperty === "sameArray") {
            const targetIndex = dragOverItem.Current;

            // Clone the NewItem array to avoid direct state mutation
            const updatedItems = [...NewItem];

            // Extract the item being dragged
            const draggedItemContent = updatedItems[index].ArrayValue[dragItem.Current];

            // Remove the dragged item from its original position


            if (updatedItems[dragItem.Current]?.ArrayValue.length === 0)
                updatedItems[dragItem.Current].ArrayValue.push(draggedItemContent)
            // Insert the dragged item at the new position
            //  updatedItems[index].ArrayValue.splice(targetIndex, 0, draggedItemContent);
            if (dragItem.CurrentIndex == 0 && updatedItems[index].ArrayValue?.length == 1) {
                updatedItems[index].ArrayValue = [];
            } else {
                updatedItems[index].ArrayValue.splice(dragItem.Current, 1);
            }
            if (!IsExistsItem(updatedItems[dragOverItem?.CurrentIndex].ArrayValue, draggedItemContent))
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

            updatedItems?.forEach((obj: any, index: any) => {
                obj.ColumnTitle = 'Column' + (index + 1);
                obj.ClassValues = "col-sm-" + 12 / updatedItems.length;
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
            let draggedItemContent = ExistingWeparts[dragItem.Current];
            if (draggedItemContent?.Key === "DashboardTemplate") {

                setDashboardTemplateItem(draggedItemContent);
                if (e?.DataSource != "Project") {
                    setIsDashboardTemplate(true);
                }
                else {
                    if (e?.IsDueDateFilter) {
                        DraggedItem = { ...e };
                        setProjectDueDate(true)
                    }
                    else {
                        DraggedItem = { ...e };
                        setProjectStatusPopup(true)
                    }
                }

                let data = e?.dataTransfer?.getData("Text");
                if (data != undefined) {
                    e.target.appendChild(document?.getElementById(data));
                    e.preventDefault();
                }
            }
            if (draggedItemContent?.Key != "DashboardTemplate" && draggedItemContent != undefined) {
                draggedItemContent.WebpartTitle = draggedItemContent.WebpartTitle === undefined ? draggedItemContent.Title : draggedItemContent.WebpartTitle;
                let obj: any = {};
                obj.Column = dragOverItem.Current;
                obj.Row = dragOverItem.CurrentIndex;
                draggedItemContent.WebpartPosition = obj;
                // Remove the dragged item from its original position
                if (draggedItemContent?.Configurations != undefined) {
                    let draggedItemContent123: any = JSON.parse(draggedItemContent?.Configurations);
                    draggedItemContent = _.cloneDeep(draggedItemContent123);
                }
                let filterGroups = [...ExistingWeparts];
                //   let ExistingWepartsNew = filterGroups.filter((obj: any) => obj.WebpartId != draggedItemContent.WebpartId)
                updatedItems[dragOverItem?.CurrentIndex].ArrayValue.splice(targetIndex, 0, draggedItemContent);
                // Clear the drag indices
                let itemsArray: any = [];
                updatedItems?.forEach((item: any, index: any) => {
                    item?.ArrayValue?.forEach((obj: any) => {
                        itemsArray.push(obj);
                    })
                    if (dragOverItem.CurrentIndex === index)
                        item?.ArrayValue?.forEach((subChild: any, indexChild: any) => {
                            if (subChild?.WebpartPosition != undefined) {
                                subChild.WebpartPosition.Row = indexChild + 1;
                                subChild.WebpartPosition.Column = (dragOverItem.CurrentIndex + 1);
                            }

                        })

                })
                setItems(itemsArray);
                console.log('ExistingWeparts before update:', ExistingWeparts);
                //  console.log('ExistingWepartsNew:', ExistingWepartsNew);
                //  setExistingWeparts(ExistingWepartsNew);
                setNewItem(updatedItems);
                //  rerender();
            }
            let data = e?.dataTransfer?.getData("Text");
            if (data != undefined) {
                e.target.appendChild(document.getElementById(data));
                e.preventDefault();
            }
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
            LoadExistingWebparts();
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
                    item.IsDefaultTile = false;
                    item.IsShowTile = false;
                    if (item?.selectFilterType == undefined)
                        item.selectFilterType = 'smartFav'
                    if (item.AdditonalHeader === true) {
                        item.IsDefaultTile = true;
                        //  setIsCheck(true)
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
                        // setDashboardTemplate(DashTemp);
                    }
                })
                TempBackup = _.cloneDeep(newArray);
                if (newArray?.length > 0) {
                    setItems(newArray);
                    setType(newArray[0]);
                }
                let arrayItem: any = [];
                let Count = 1;
                NewConfigarray(newArray, arrayItem, Count);
                arrayItem?.forEach((obj: any) => {
                    obj.ClassValues = "col-sm-" + 12 / arrayItem.length;
                })
                setNewItem(arrayItem);
                if (arrayItem?.length === 0)
                    AddColumn('FirstTime');
            }
            else {
                let arrayItem: any = [];
                let ColumnsValue: any = {};
                ColumnsValue.ColumnTitle = 'Column' + 1;
                ColumnsValue.ColumnValue = 1;
                ColumnsValue.ArrayValue = arrayItem;
                // arrayItem.push(ColumnsValue);
                setNewItem([ColumnsValue]);
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
        web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate' or Key eq 'DashboardTemplate'").getAll().then((data: any) => {
            //  ExistingWepartsBackup = data;


            let aaray: any = [];
            let backupaaray: any = [];
            data?.forEach((webpart: any) => {
                if (webpart?.Configurations != undefined) {
                    let ConfigItem: any = JSON.parse(webpart?.Configurations);
                    ConfigItem.UpdatedId = webpart.Id;
                    ConfigItem.Key = webpart?.Key;
                    ConfigItem.IsEditWebpart = ConfigItem.IsEditWebpart === false ? ConfigItem.IsEditWebpart : true;
                    backupaaray.push(ConfigItem);
                    //  let items = TempBackup?.filter((obj: any) => obj.WebpartId === ConfigItem.WebpartId);
                    // if (items?.length === 0) {
                    //     ConfigItem.Title = ConfigItem.WebpartTitle != undefined ? ConfigItem.WebpartTitle : ConfigItem.Title
                    //     aaray.push(ConfigItem)
                    // }
                }
            })

            ExistingWepartsBackup = _.cloneDeep(backupaaray);
            setExistingWeparts(backupaaray);
        }).catch((err: any) => {
            console.log(err);
        })
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
            if (props?.EditItem?.Id != undefined) {
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
            } else {

                await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").top(1).orderBy("Id", false).get().then(async (data: any) => {
                    await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: DashboardTitle, Key: "DashBoardConfigurationId", Value: data?.length != undefined ? (data[0].Value === undefined ? 1 : (parseInt(data[0].Value) + 1)).toString() : undefined, Configurations: JSON.stringify(arrayItems) })
                        .then(async (res: any) => {
                            setNewItem([]);
                            if (ContextData != undefined && ContextData?.callbackFunction != undefined)
                                ContextData?.callbackFunction('Add');
                            props?.CloseConfigPopup(true)
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
                    {props?.EditItem != undefined && props?.EditItem != '' ? <span>Edit Dashboard Configuration</span> : <span>Add Dashboard Configuration</span>}
                </div>
                {props?.EditItem != undefined && props?.EditItem != '' ? <Tooltip ComponentId={869} /> : <Tooltip ComponentId={1107} />}

            </>
        );
    };

    const SmartMetaDataListInformations = async () => {
        let AllSmartDataListData: any = [];
        let tempArray: any = [];
        let statusArray: any = [];
        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            AllSmartDataListData = await web.lists.getById(props?.props?.SmartMetadataListID)
                .items.select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail").expand("Author,Editor,IsSendAttentionEmail").orderBy('SortOrder', true).orderBy("Title", true).getAll();
            AllSmartDataListData?.map((SmartItemData: any, index: any) => {
                if (SmartItemData?.TaxType === "DataSource")
                    tempArray.push(SmartItemData);
                if (SmartItemData?.TaxType === 'Percent Complete' && SmartItemData?.Title != 'In Preparation (0-9)' && SmartItemData?.Title != 'Ongoing (10-89)' && SmartItemData?.Title != 'Completed (90-100)') {
                    statusArray.push(SmartItemData);
                }
            })
            statusArray = statusArray.sort((a: any, b: any) => { return a.SortOrder - b.SortOrder; });
            console.log(statusArray)
            setStatusArray(statusArray)
            setDataSource(tempArray);

            // ########## this is for All Site Data related validations ################

        } catch (error) {
            console.log("Error : ", error.message);
        }
    };

    useEffect(() => {
        loadColumnDetails();
        SmartMetaDataListInformations()
        LoadSmartFav();

    }, []);


    const OpenConfigPopup = (Config: any) => {
        setIsManageConfigPopup(true);
        let item = ExistingWepartsBackup?.filter((obj: any) => obj.WebpartId === Config.WebpartId);
        if (item?.length > 0)
            setSelectedItem(item[0]);
        else {
            setIsDashboardPage(true);
            setSelectedItem(Config);
        }
    }
    const CloseConfigPopup = async (itesm: any, newitem: any) => {

        if (itesm === true && SelectedItem?.UpdatedId != undefined) {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Id eq " + SelectedItem?.UpdatedId).top(1).orderBy("Id", false).get().then(async (data: any) => {
                const updatedItems = [...NewItem];
                updatedItems?.forEach((item: any, index: any) => {
                    item?.ArrayValue?.forEach((obj: any) => {
                        if (obj.UpdatedId === data[0].Id)
                            obj.WebpartTitle = data[0].Title
                    })

                })
            })
        }
        else if (itesm === true) {
            let iten = props.EditItem;
        }
        setIsDashboardPage(false);
        setIsManageConfigPopup(false);
        setSelectedItem('');
    }


    const CloseWebpartPopup = (array: any, Properties: any) => {
        if (array?.length > 0) {
            const arraynew: any = NewItem[0].ArrayValue = NewItem[0].ArrayValue.concat(array);
            setNewItem(arraynew);
        }
    }
    const AddColumn = (title: any) => {
        const copyListItems = [...NewItem];
        if (copyListItems?.length < 3) {
            let ColumnsValue: any = {};
            if (title === "FirstTime") {
                ColumnsValue.ColumnTitle = 'Column' + ((copyListItems.length === 1 || copyListItems[0].WebpartTitle === "") ? 1 : copyListItems.length + 1);
                ColumnsValue.ColumnValue = ((copyListItems.length === 1 || copyListItems[0].WebpartTitle === "") ? 1 : copyListItems.length + 1);
            } else {
                ColumnsValue.ColumnTitle = 'Column' + (copyListItems.length + 1);
                ColumnsValue.ColumnValue = (copyListItems.length + 1);
            }
            ColumnsValue.ArrayValue = [];
            copyListItems.push(ColumnsValue);
            copyListItems?.forEach((obj: any) => {
                obj.ClassValues = "col-sm-" + 12 / copyListItems.length;
            })
            setNewItem((prev: any) => [...prev, ColumnsValue]);

        }
    }
    const deleteExistingTemplate = async (itemValue: any, arrayIndex: number) => {
        const updatedItems = [...NewItem];
        updatedItems?.forEach((item: any, index: any) => {
            if (index === arrayIndex)
                item?.ArrayValue?.forEach((subChild: any, indexChild: any) => {
                    if (itemValue.WebpartId === subChild?.WebpartId) {
                        let findItem: any = [];
                        findItem = ExistingWepartsBackup?.filter((filt: any) => filt.WebpartId === subChild.WebpartId)
                        if (findItem?.length > 0) {
                            let arrayItems: any = [];
                            const ExistingItems = [...ExistingWeparts];
                            arrayItems = ExistingItems.concat(findItem[0]);
                            // setExistingWeparts(arrayItems);
                        }
                        item?.ArrayValue?.splice(indexChild, 1);
                    }
                })
        })
        let itemsArray: any = [];
        updatedItems?.forEach((item: any, index: any) => {
            item?.ArrayValue?.forEach((obj: any) => {
                itemsArray.push(obj);
            })
        })
        setItems(itemsArray);
        setNewItem(updatedItems);
    }
    const deleteColumn = async (itemValue: any, arrayIndex: number) => {
        const updatedItems = [...NewItem];
        let findSameItems = updatedItems?.filter((obj: any) => obj.ColumnTitle === itemValue?.ColumnTitle);
        let findItems = updatedItems?.filter((obj: any) => obj.ColumnTitle != itemValue?.ColumnTitle);
        const ExistingItems = [...ExistingWeparts];
        let arrayItems = ExistingItems.concat(findSameItems[0]);
        setExistingWeparts(arrayItems);
        let itemsArray: any = [];
        findItems?.forEach((item: any, index: any) => {
            item?.ArrayValue?.forEach((obj: any) => {
                itemsArray.push(obj);
            })
        })
        findItems?.forEach((obj: any, index: any) => {
            obj.ColumnTitle = 'Column' + (index + 1);
            obj.ClassValues = "col-sm-" + 12 / findItems.length;
        })
        setItems(itemsArray);
        setNewItem(findItems);
    }

    const CreateNewWebPart = () => {
        setIsOpenPopup(true);
    }
    const LoadCallbackExistingWebparts = () => {
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").top(1).orderBy("Id", false).get().then((data: any) => {
            let aaray: any = [];
            let backupaaray: any = [];
            data?.forEach((webpart: any) => {
                if (webpart?.Configurations != undefined) {
                    let ConfigItem: any = JSON.parse(webpart?.Configurations);
                    backupaaray.push(ConfigItem);
                    //  let items = TempBackup?.filter((obj: any) => obj.WebpartId === ConfigItem.WebpartId);
                    //  if (items?.length === 0) {
                    ConfigItem.Title = ConfigItem.WebpartTitle != undefined ? ConfigItem.WebpartTitle : ConfigItem.Title
                    aaray.push(ConfigItem)
                    // }
                }
            })
            let ExistingWepartsItems = [...ExistingWeparts];
            if (backupaaray?.length > 0)
                ExistingWepartsBackup.push(backupaaray[0]);
            ExistingWepartsItems = ExistingWepartsItems.concat(aaray);
            setExistingWeparts(ExistingWepartsItems);
        }).catch((err: any) => {
            console.log(err);
        })
    }

    const CloseIsConfigPopup = (Item: any) => {
        if (Item === true) {
            LoadExistingWebparts()
        }
        setIsOpenPopup(false);
    }
    const CloseDashboardTemplate = (Item: any) => {
        if (Item != undefined) {
            let DataItem = [...NewItem]
            DataItem[dragOverItem.CurrentIndex].ArrayValue = DataItem[dragOverItem.CurrentIndex].ArrayValue.concat(Item);
            setNewItem(DataItem);
        }
        setIsDashboardTemplate(false);
    }
    const formatId = (id: number): string => {
        const paddedId = '00' + id;
        return paddedId.slice(-3);
    }
    const CopyExistingWebpartTemplate = async (Item: any) => {
        let CreatedSmartFavId: any = "";
        let confirmation = confirm('Do you want to copy this item?')
        if (confirmation) {
            let ItemNew = deepCopy(Item);
            try {
                let result: any;
                let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
                web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Id eq '" + Item?.smartFevId + "'").orderBy("Id", false).get().then(async (data: any) => {

                    let WebpartGallaryItem = data[0];
                    let config = JSON.parse(WebpartGallaryItem?.Configurations)
                    const postData = {
                        Configurations: JSON.stringify(config),
                        Key: 'WebPartGallarySmartfavorites',
                        Title: 'WebPartGallarySmartfavorites'
                    };
                    await web.lists.getByTitle("AdminConfigurations").items.add(postData).then(async (result: any) => {
                        CreatedSmartFavId = result?.data?.Id;
                        await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").orderBy("Created", false).getAll().then(async (data: any) => {

                            if (data?.length && data[data.length - 1].Value != undefined && data[data.length - 1].Value != '') {
                                result = parseInt(data[data.length - 1].Value) + 1;
                            }
                            else {
                                result = data?.length + 1;
                            }
                            ItemNew.WebpartId = 'WP-' + formatId(result)
                            ItemNew.smartFevId = CreatedSmartFavId;
                            await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: Item?.WebpartTitle, Key: "WebpartTemplate", Value: result != undefined ? result.toString() : undefined, Configurations: JSON.stringify(ItemNew) })
                                .then(async (res: any) => {
                                    web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").top(1).orderBy("Id", false).get().then((data: any) => {
                                        ItemNew.UpdatedId = data[0].Id;
                                        ItemNew.WebpartTitle = Item?.WebpartTitle;
                                        const updatedItems = [...NewItem];
                                        const AllItems: any = [...Items];
                                        updatedItems?.forEach((item: any, index: any) => {
                                            let findSameItems = item?.ArrayValue?.filter((obj: any) => obj.Title === Item.Title);
                                            if (findSameItems?.length > 0) {
                                                item?.ArrayValue.push(ItemNew);
                                                AllItems.push(ItemNew)
                                                ExistingWepartsBackup.push(ItemNew);
                                            }
                                        })

                                        setItems(AllItems);
                                        setNewItem(updatedItems);
                                    })
                                }).catch((err: any) => {
                                    console.log(err);
                                })
                        })

                    })


                })





            } catch (error) {
                console.log(error);
            }
        }
    }
    window.addEventListener('drag', () => {
        document.body.style.cursor = 'grabbing';
    }, true)
    function allowDrop(ev: any) {
        ev.preventDefault();
    }
    const getColumnDetails = (name: string) => {
        let rank: any = ''
        if (!visibleRank) {
            const res = globalCommon.GetColumnDetails(name, ColumnDetails);
            if (res && res.Title) {
                setVisibleRank(true);
                rank =
                    <label className="alignCenter form-label full-width gap-1">
                        {res?.Title}
                        <div className={styles.root}>
                            <InfoToolTip
                                content={{
                                    children: <span dangerouslySetInnerHTML={{ __html: res?.Description }}></span>,
                                    id: contentId,
                                }}
                                withArrow
                                relationship="label"
                                onVisibleChange={(e: any, data: any) => setVisible(data?.visible)} >
                                <Info16Regular tabIndex={0} className={mergeClasses(visible && styles.visible)} />
                            </InfoToolTip>
                        </div>
                    </label>
                setItemRankval(rank)
            }
        }
        return rank;
    };
    const loadColumnDetails = async () => {
        let getvalue = await globalCommon.getsiteConfig();
        ColumnDetails = getvalue;
    };
    const handlewebpartTitle = (value: string) => {
        setWebpartTitle(value)
    };
    const SaveWebpart = () => {
        if (DraggedItem != undefined) {
            if (ProjectDueDate) {
                DraggedItem.StartDate = '';
                DraggedItem.EndDate = ''
                if (startDueDate) {
                    startDueDate.setHours(0, 0, 0, 0);
                    DraggedItem.StartDate = Moment(startDueDate).format('DD/MM/YYYY');
                }
                if (endDueDate) {
                    endDueDate.setHours(0, 0, 0, 0);
                    DraggedItem.EndDate = Moment(endDueDate).format('DD/MM/YYYY');
                }
            }
            let DataItem = [...NewItem]
            DataItem[dragOverItem.CurrentIndex].ArrayValue = DataItem[dragOverItem.CurrentIndex].ArrayValue.concat([DraggedItem]);
            setNewItem(DataItem);
        }
        setProjectDueDate(false)
        setProjectStatusPopup(false)
        setWebpartTitle('');
        DraggedItem = {};
    }
    const handleSelectedStatus = (event: any, item: any) => {
        if (DraggedItem) {
            DraggedItem.WebpartTitle = WebpartTitle;
            if (DraggedItem?.Status == undefined)
                DraggedItem.Status = [];
            if (event?.target?.checked) {
                DraggedItem?.Status?.push({ 'Id': item?.Id, "PercentComplete": item?.Description1 })
            }
            else if (!event?.target?.checked) {
                DraggedItem.Status = DraggedItem?.Status?.filter((Status: any) => Status?.Id != item?.Id);
            }
        }
    }
    const ExampleCustomInputStrat = React.forwardRef(
        ({ value, onClick }: any, ref: any) => (
            <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
                <input type="text" id="datepicker" data-input-type="StartDate" className="form-control date-picker ps-2" placeholder="DD/MM/YYYY" value={value} />
                <span style={{ position: "absolute", top: "50%", right: "7px", transform: "translateY(-50%)", cursor: "pointer", }}  >
                    <span className="svg__iconbox svg__icon--calendar"></span>
                </span>
            </div>
        )
    )
    const ExampleCustomInputEnd = React.forwardRef(
        ({ value, onClick }: any, ref: any) => (
            <div style={{ position: "relative" }} onClick={onClick} ref={ref}>
                <input type="text" id="datepicker" data-input-type="EndDate" className="form-control date-picker ps-2" placeholder="DD/MM/YYYY" value={value} />
                <span style={{ position: "absolute", top: "50%", right: "7px", transform: "translateY(-50%)", cursor: "pointer", }}   >
                    <span className="svg__iconbox svg__icon--calendar"></span>
                </span>
            </div>
        )
    )
    const onRenderCustomHeaderStatusPopup = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading siteColor">
                    Select Status
                </div>
                {/* <Tooltip ComponentId={2330} /> */}
            </div>
        );
    };
    const onRenderCustomFooterStatusPopup = () => {
        return (
            <footer className='text-end px-4 py-2'>
                <button className="btn btn-primary" disabled={WebpartTitle == undefined || WebpartTitle == ''} onClick={SaveWebpart}>Save</button>
            </footer>
        );
    };
    const onRenderCustomHeaderDuedatePopup = () => {
        return (
            <div className="d-flex full-width pb-1">
                <div className="subheading siteColor">
                    Select Due Date
                </div>
                {/* <Tooltip ComponentId={2330} /> */}
            </div>
        );
    };
    const onRenderCustomFooterDuedatePopup = () => {
        return (
            <footer className='text-end px-4 py-2'>
                <button className="btn btn-primary" disabled={WebpartTitle == undefined || WebpartTitle == ''} onClick={SaveWebpart}>Save</button>
            </footer>
        );
    };

    return (
        <>
            <Panel onRenderHeader={CustomHeaderConfiguration}
                isOpen={props?.IsOpenPopup}
                onDismiss={CloseConfiguationPopup}
                isBlocking={false}
                type={PanelType.large}>
                <div className='modal-body'>
                    {progressBar && <PageLoader />}
                    {props?.IsDashboardPage == true && <a data-interception="off" target="_blank" className="pull-right empCol hreflink" href={props?.props?.Context?._pageContext?._web?.absoluteUrl + "/SitePages/DashboardLandingPage.aspx"}>Go To All Dashboard</a>}
                    <div className="mb-2">
                        <label className='form-label full-width'>Dashboard Title <span className="ml-1 mr-1 text-danger">*</span></label>
                        <input className='form-control' type='text' placeholder="Dashboard Title" value={DashboardTitle} onChange={(e) => setDashboardTitle(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label className='form-label full-width fw-semibold'>Drag and drop tiles between columns in any vertical order.</label></div>
                    <div className="Metadatapannel border p-2 mb-2">
                        <div className="row">
                            <div className="col-sm-8 col-md-8 col-lg-9 pe-0" draggable>
                                <div className="row">
                                    {NewItem != undefined && NewItem?.length > 0 && NewItem.map((item: any, index: any) => {
                                        return (
                                            <>
                                                {/* <div className="row"> */}
                                                <div className={item.ClassValues}>
                                                    <div className="fw-semibold text-center mb-2 alignCenter justify-content-center" style={{ borderBottom: '1px solid var(--SiteBlue)' }}>{item.ColumnTitle}
                                                        {NewItem?.length > 1 && <span title="Delete" className="dark ml-12  svg__icon--cross svg__iconbox" onClick={(e) => deleteColumn(item, index)} ></span>}</div>
                                                    {item != undefined && item?.ArrayValue?.length > 0 ? item?.ArrayValue?.map((subitem: any, indexNew: any) => {
                                                        if (subitem?.IsDeleted != true) {
                                                            return (
                                                                <>
                                                                    <div className="alignCenter bg-siteColor justify-content-center mb-1 w-100 outer-box" style={{ height: '30px' }}
                                                                        onDragStart={(e) => dragStart(e, indexNew, index)}
                                                                        onDragEnter={(e) => dragEnd(e, indexNew, index)}
                                                                        onDragEnd={(e) => drop(e, indexNew, index, "sameArray")}
                                                                        key={index}
                                                                        onDragOver={(e) => allowDrop(e)}
                                                                        draggable
                                                                    >{subitem.WebpartTitle}

                                                                        {" "}
                                                                        {subitem?.IsEditWebpart != false && <span title="Edit" className="light ml-12 svg__icon--editBox svg__iconbox" onClick={(e) => OpenConfigPopup(subitem)} ></span>}
                                                                        <span title="Delete" className="light ml-12  svg__icon--cross svg__iconbox" onClick={(e) => deleteExistingTemplate(subitem, index)} ></span>
                                                                        <span title="Copy webpart" className="light ml-12  alignIcon svg__iconbox svg__icon--copy" onClick={(e) => CopyExistingWebpartTemplate(subitem)} ></span>
                                                                    </div>
                                                                    {(item?.ArrayValue?.length - 1) === indexNew && <div id="textDrag" className="alignCenter justify-content-center mb-2 w-100 outer-box" style={{ height: '100px', width: "100px", cursor: "grab" }}
                                                                        onDragStart={(e) => dragStart(e, indexNew, index)}
                                                                        onDragEnter={(e) => dragEnd(e, indexNew, index)}
                                                                        onDragEnd={(e) => drop(e, indexNew, index, "sameArray")}
                                                                        onDragOver={(e) => allowDrop(e)}
                                                                        key={index}
                                                                        draggable
                                                                    > </div>}
                                                                </>
                                                            )
                                                        }
                                                    }) : <div>
                                                        <div className="alignCenter justify-content-center mb-2 w-100 " style={{ height: '200px', width: "150px" }}
                                                            onDragStart={(e) => dragStart(e, 0, index)}
                                                            onDragEnter={(e) => dragEnd(e, 0, index)}
                                                            onDragEnd={(e) => drop(e, 0, index, "sameArray")}
                                                            key={index}
                                                            draggable
                                                            onDragOver={(e) => allowDrop(e)}
                                                        >
                                                            &nbsp;

                                                        </div>
                                                    </div>}
                                                </div >
                                                {/* </div> */}
                                            </>
                                        )
                                    })}</div ></div>
                            <div className="col-sm-4 col-md-4 col-lg-3 text-end">
                                <div className='form-label full-width mb-1 alignCenter' onClick={(e) => AddColumn('')}><a className="alignCenter hreflink ml-auto siteColor"><span className="svg__iconbox svg__icon--Plus mini"></span> Add Column</a></div>

                                <div className='addconnectbox boxshadow card scrollbar mb-2' >
                                    <div className="alignCenter border-bottom fw-semibold m-2 siteColor">
                                        {visibleRank ? ItemRankval : (getColumnDetails('BasicWebpart'))}
                                        <div className="flex-shrink-0 ml-auto" onClick={CreateNewWebPart}>Create new Webpart</div></div>
                                    <div className="card-body">
                                        <div className="mb-2 position-relative statusbox">
                                            <input type="text" placeholder="Basic Webpart Gallery" value={serachValue} className="form-control" onChange={(e) => setserachValue(e.target.value)}></input>
                                            {serachValue != "" && serachValue?.length > 0 && <span className="input-group-text" ><span onClick={(e) => setserachValue("")} className="svg__iconbox svg__icon--cross"></span></span>}
                                        </div>
                                        {ExistingWeparts?.length > 0 && ExistingWeparts?.map((item: any, index: any) => {
                                            if (item?.WebpartTitle?.includes(serachValue)) {
                                                return (
                                                    <>
                                                        <div className="alignCenter bg-siteColor newTiles mb-1 py-2 w-100" onDragStart={(e) => dragStart(e, index, index)}
                                                            onDragEnter={(e) => dragEnd(e, index, index)}
                                                            onDragEnd={(e) => drop(item, index, index, "DifferentArray")}
                                                            key={index}
                                                            draggable
                                                        ><div className="text-start"><span className="me-2">{item?.WebpartId}</span>
                                                                {item.WebpartTitle === undefined ? item.Title : item.WebpartTitle} <span>{item?.ShowTitleInHeader === true && <>{UserName}</>}</span>
                                                            </div>
                                                            {item?.IsEditWebpart === true && <span title="Edit" className="light ml-12 ml-auto svg__icon--editBox svg__iconbox" onClick={(e) => OpenConfigPopup(item)} ></span>}
                                                        </div>
                                                    </>
                                                )
                                            }
                                        })}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='modal-footer mt-2 pe-0'>
                    <button className="btn btn-primary ms-1" onClick={SaveConfigPopup} disabled={DashboardTitle == ''}>Save</button>
                    <button className='btn btn-default ms-1' onClick={CloseConfiguationPopup}>Cancel</button>
                </div>
            </Panel >
            <span>
                {IsManageConfigPopup && <AddEditWebpartTemplate props={props?.props} DashboardPage={IsDashboardPage} DashboardConfigBackUp={Items} SingleWebpart={true} EditItem={SelectedItem} IsOpenPopup={IsManageConfigPopup} CloseConfigPopup={CloseConfigPopup} />}
            </span>
            <span>
                {IsOpenPopup && <AddEditWebpartTemplate props={props?.props} SingleWebpart={true} EditItem={""} IsOpenPopup={IsOpenPopup} CloseConfigPopup={CloseIsConfigPopup} />}

            </span>
            <span>
                {IsDashboardTemplate && <AddDashboardTemplate props={props?.props} SingleWebpart={true} Item={DashboardTemplateItem} IsDashboardTemplate={IsDashboardTemplate} CloseDashboardTemplate={CloseDashboardTemplate} />}
            </span>
            <span>
                {/* ***************** this is status panel *********** */}
                <Panel onRenderHeader={onRenderCustomHeaderStatusPopup} onRenderFooter={onRenderCustomFooterStatusPopup} isOpen={ProjectStatusPopup} onDismiss={() => { setProjectStatusPopup(false); setWebpartTitle('') }} isBlocking={ProjectStatusPopup} isFooterAtBottom={true} >
                    <div className="mb-2">
                        <label className='form-label full-width'>Webpart Title <span className="ml-1 mr-1 text-danger">*</span></label>
                        <div className="col"><input className='form-control' type='text' placeholder="Webpart Title" value={WebpartTitle} onChange={(e) => handlewebpartTitle(e.target.value)} /></div>
                    </div>
                    <ul className="projectStatus_List">
                        {StatusArray?.map((item: any, index: any) => {
                            return (
                                <li key={index}>
                                    <div className="form-check">
                                        <input className="form-check-input" onClick={(e) => handleSelectedStatus(e, item)} type="checkbox" />
                                        <label className="form-check-label ms-2">{item.Title}</label>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </Panel>
                <Panel onRenderHeader={onRenderCustomHeaderDuedatePopup}
                    onRenderFooter={onRenderCustomFooterDuedatePopup}
                    type={PanelType.custom}
                    customWidth="490px"
                    isOpen={ProjectDueDate}
                    onDismiss={() => { setProjectDueDate(false); setWebpartTitle('') }}
                    isBlocking={ProjectDueDate}
                    isFooterAtBottom={true} >
                    <div className="row mb-2">
                        <label className='form-label full-width'>Webpart Title <span className="ml-1 mr-1 text-danger">*</span></label>
                        <div className="col"><input className='form-control' type='text' placeholder="Webpart Title" value={WebpartTitle} onChange={(e) => handlewebpartTitle(e.target.value)} /></div>
                    </div>
                    <div className="row date-range-picker">
                        <div className="col-12 pe-0">
                            <label className="full-width">Due Date Filter</label>
                        </div>
                        <div className="col-6 pe-0">
                            <div className="input-group">
                                <label className="full-width">Start Date</label>
                                <span>
                                    <DatePicker selected={startDueDate} onChange={(date: any) => setStartDueDate(date)} selectsStart startDate={startDueDate} endDate={endDueDate}
                                        dateFormat="dd/MM/yyyy" className="form-control date-picker p-1" popperPlacement="bottom-start" customInput={<ExampleCustomInputStrat />}
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="col-6 pe-0">
                            <div className="input-group">
                                <label className="full-width">End Date</label>
                                <span>
                                    <DatePicker selected={endDueDate} onChange={(date: any) => setEndDueDate(date)} minDate={startDueDate ?? undefined} selectsEnd startDate={startDueDate} endDate={endDueDate}
                                        dateFormat="dd/MM/yyyy" className="form-control date-picker p-1" popperPlacement="bottom-start" customInput={<ExampleCustomInputEnd />}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </Panel>
            </span>
        </>

    );
};
export default EditConfiguration;


