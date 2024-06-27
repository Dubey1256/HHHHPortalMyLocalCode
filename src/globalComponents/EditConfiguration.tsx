import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import Tooltip from "./Tooltip";
import { myContextValue } from "./globalCommon";
import PageLoader from '../globalComponents/pageLoader';
import AddConfiguration from "./AddConfiguration";
import _ from "lodash";
import AddEditWebpartTemplate from "./AddEditWebpartTemplate";

let DashTemp: any = [];
let ExistingWepartsBackup: any = [];
let TempBackup: any = [];
const EditConfiguration = (props: any) => {
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
    const [IsWebPartPopup, setIsWebPartPopup] = React.useState(false);
    const [type, setType] = useState<any>({});
    const [IsOpenPopup, setIsOpenPopup] = React.useState(false);

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
            let draggedItemContent: any = ExistingWeparts[dragItem.Current];
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
            let ExistingWepartsNew = filterGroups.filter((obj: any) => obj.WebpartTitle != draggedItemContent.WebpartTitle)
            //  ExistingWeparts.splice(index, 1);
            // rerender();

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
            console.log('ExistingWeparts before update:', ExistingWeparts);
            console.log('ExistingWepartsNew:', ExistingWepartsNew);
            setExistingWeparts(ExistingWepartsNew);
            setNewItem(updatedItems);
            //  rerender();
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
        web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'WebpartTemplate'").getAll().then((data: any) => {
            //  ExistingWepartsBackup = data;


            let aaray: any = [];
            let backupaaray: any = [];
            data?.forEach((webpart: any) => {
                if (webpart?.Configurations != undefined) {

                    let ConfigItem: any = JSON.parse(webpart?.Configurations);
                    ConfigItem.UpdatedId = webpart.Id;
                    backupaaray.push(ConfigItem);
                    let items = TempBackup?.filter((obj: any) => obj.WebpartId === ConfigItem.WebpartId);
                    if (items?.length === 0) {
                        ConfigItem.Title = ConfigItem.WebpartTitle != undefined ? ConfigItem.WebpartTitle : ConfigItem.Title
                        aaray.push(ConfigItem)
                    }
                }
            })

            ExistingWepartsBackup = _.cloneDeep(backupaaray);
            setExistingWeparts(aaray);
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

    useEffect(() => {
        SmartMetaDataListInformations()
        LoadSmartFav();

    }, []);


    const OpenConfigPopup = (Config: any) => {
        setIsManageConfigPopup(true);
        setSelectedItem(Config);
    }
    const CloseConfigPopup = (itesm: any, newitem: any) => {
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
        // Remove the dragged item from its original position
        updatedItems?.forEach((item: any, index: any) => {
            if (index === arrayIndex)
                item?.ArrayValue?.forEach((subChild: any, indexChild: any) => {
                    if (itemValue.WebpartTitle === subChild?.WebpartTitle) {
                        let findItem: any = [];
                        findItem = ExistingWepartsBackup?.filter((filt: any) => filt.WebpartTitle === subChild.WebpartTitle)
                        if (findItem?.length > 0) {
                            let arrayItems: any = [];
                            const ExistingItems = [...ExistingWeparts];
                            arrayItems = ExistingItems.concat(findItem[0]);
                            setExistingWeparts(arrayItems);
                        }
                        item?.ArrayValue?.splice(indexChild, 1);
                    }
                })
        })
        setNewItem(updatedItems);
    }
    const changetabs = (selectedtab: any) => {

        const updatedItems = [...NewItem];
        // Remove the dragged item from its original position
        updatedItems?.forEach((item: any) => {
            item?.ArrayValue?.forEach((subChild: any) => {
                if (type?.Id === subChild?.Id) {
                    subChild.DataSource = type?.DataSource;
                    subChild.smartFevId = type.smartFevId === undefined ? "" : type.smartFevId;
                }
            })
        })

        setNewItem(updatedItems);

        setType(selectedtab)

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
                    let items = TempBackup?.filter((obj: any) => obj.Id === ConfigItem.Id);
                    if (items?.length === 0) {
                        ConfigItem.Title = ConfigItem.WebpartTitle != undefined ? ConfigItem.WebpartTitle : ConfigItem.Title
                        aaray.push(ConfigItem)
                    }
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
            // ExistingWepartsBackup = [];
            LoadCallbackExistingWebparts()
        }
        setIsOpenPopup(false);
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
                        <label className='form-label full-width'>Dashboard Title</label>
                        <input className='form-control' type='text' placeholder="Dashboard Title" value={DashboardTitle} onChange={(e) => setDashboardTitle(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label className='form-label full-width fw-semibold'>Drag and drop tiles between columns in any vertical order.</label></div>
                    <div className="Metadatapannel border p-2 mb-2">
                        <div className="row">
                            <div className="col-sm-9 pe-0">
                                <div className="row">
                                    {NewItem != undefined && NewItem?.length > 0 && NewItem.map((item: any, index: any) => {
                                        return (
                                            <>
                                                {/* <div className="row"> */}
                                                <div className={item.ClassValues}>
                                                    <div className="fw-semibold text-center mb-2" style={{ borderBottom: '1px solid var(--SiteBlue)' }}>{item.ColumnTitle}</div>
                                                    {item != undefined && item?.ArrayValue?.length > 0 ? item?.ArrayValue?.map((subitem: any, indexNew: any) => {
                                                        const showDeleteIcon = ExistingWepartsBackup?.filter((obj: any) => obj.WebpartTitle === subitem.WebpartTitle);
                                                        return (
                                                            <>
                                                                <div className="alignCenter bg-siteColor justify-content-center mb-2 w-100" style={{ height: '50px' }}
                                                                    onDragStart={(e) => dragStart(e, indexNew, index)}
                                                                    onDragEnter={(e) => dragEnd(e, indexNew, index)}
                                                                    // onDragEnd={(e) => drop(e, index, "sameArray")}
                                                                    onDragEnd={(e) => drop(e, indexNew, index, "sameArray")}
                                                                    key={index}
                                                                    draggable
                                                                >{subitem.WebpartTitle}

                                                                    {" "}
                                                                    <span title="Edit" className="light ml-12 svg__icon--editBox svg__iconbox" onClick={(e) => OpenConfigPopup(subitem)} ></span>
                                                                    {showDeleteIcon?.length > 0 && <span title="Edit" className="light ml-12  svg__icon--cross svg__iconbox" onClick={(e) => deleteExistingTemplate(subitem, index)} ></span>}
                                                                </div>
                                                            </>
                                                        )
                                                    }) : <div>
                                                        <div className="alignCenter justify-content-center mb-2 w-100" style={{ height: '200px', width: "150px" }}
                                                            onDragStart={(e) => dragStart(e, 0, index)}
                                                            onDragEnter={(e) => dragEnd(e, 0, index)}
                                                            // onDragEnd={(e) => drop(e, index, "sameArray")}
                                                            onDragEnd={(e) => drop(e, 0, index, "sameArray")}
                                                            key={index}
                                                            draggable
                                                        >
                                                            &nbsp;

                                                        </div>
                                                    </div>}
                                                </div>
                                                {/* </div> */}
                                            </>
                                        )
                                    })}</div></div>
                            <div className="col-sm-3 text-end">
                                <div className='form-label full-width mb-1 alignCenter' onClick={(e) => AddColumn('')}><a className="alignCenter hreflink ml-auto siteColor"><span className="svg__iconbox svg__icon--Plus mini"></span> Add Column</a></div>
                                <div className='form-label full-width alignCenter' onClick={(e) => AddWebpartPopup()}><a className="alignCenter hreflink ml-auto siteColor"> <span className="svg__iconbox svg__icon--Plus mini"></span> Add WebPart</a></div>
                                {IsWebPartPopup && <div className='my-2 card addconnect boxshadow' >
                                    <div className="alignCenter border-bottom f-15 fw-semibold m-2 siteColor"><div>Existing Webparts</div><div className="ml-auto" onClick={CreateNewWebPart}>Create new Webpart</div></div>
                                    <div className="card-body">
                                        {IsWebPartPopup && ExistingWeparts?.length > 0 && ExistingWeparts?.map((item: any, index: any) => {
                                            return (
                                                <>
                                                    <div className="alignCenter bg-siteColor justify-content-center mb-2 w-100" style={{ height: '50px' }} onDragStart={(e) => dragStart(e, index, index)}
                                                        onDragEnter={(e) => dragEnd(e, index, index)}
                                                        onDragEnd={(e) => drop(item, index, index, "DifferentArray")}
                                                        key={index}
                                                        draggable
                                                    >{item.WebpartTitle === undefined ? item.Title : item.WebpartTitle}
                                                    </div>
                                                </>
                                            )
                                        })}</div>
                                </div>}

                            </div>

                        </div>
                    </div>
                    {/* <div className="Metadatapannel lastmodify mb-2">
                        <>
                            <div className="border nav nav-tabs" id="nav-tab" role="tablist" style={{ display: "inline-flex" }}>
                                {
                                    Items?.length && Items.map((siteValue: any) =>
                                        <>
                                            <button onClick={() => { changetabs(siteValue) }} className={`nav-link ${siteValue.Id == Items[0].Id ? 'active' : ''}`} id={`nav-${siteValue.Id}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${siteValue.Id}`} type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                                                <div className={`${siteValue.Id}` + "text-capitalize"}  >{siteValue.WebpartTitle}</div></button>
                                        </>
                                    )
                                }
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
                                                            <label className="SpfxCheckRadio">     <input className="radio" name="ApprovalLevelnew" type="radio" checked={type?.smartFevId === item?.UpdatedId ? true : false} onChange={() => setType({ ...type, smartFevId: item.UpdatedId })} />
                                                                {item.Title}
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

                    </div> */}

                </div>

                <div className='modal-footer mt-2 pe-0'>
                    <button className="btn btn-primary ms-1" onClick={SaveConfigPopup} disabled={DashboardTitle == ''}>Save</button>
                    <button className='btn btn-default ms-1' onClick={CloseConfiguationPopup}>Cancel</button>
                </div>
            </Panel >
            {/* <span>
                {IsManageConfigPopup && <AddConfiguration DashboardConfigBackUp={Items} SingleWebpart={true} props={props.props} EditItem={SelectedItem} IsOpenPopup={SelectedItem} CloseConfigPopup={CloseConfigPopup} />}
            </span> */}
            <span>
                {IsManageConfigPopup && <AddEditWebpartTemplate props={props?.props} SingleWebpart={true} EditItem={SelectedItem} IsOpenPopup={IsManageConfigPopup} CloseConfigPopup={CloseConfigPopup} />}
            </span>
            <span>
                {IsOpenPopup && <AddEditWebpartTemplate props={props?.props} SingleWebpart={true} EditItem={""} IsOpenPopup={IsOpenPopup} CloseConfigPopup={CloseIsConfigPopup} />}
                {/* {IsWebPartPopup && <WebPartDisplay DashboardConfigBackUp={props.props} props={props.props} IsWebPartPopup={IsWebPartPopup} CloseWebpartPopup={CloseWebpartPopup} />} */}
            </span>

        </>

    );
};
export default EditConfiguration;