import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import Tooltip from "./Tooltip";
import { myContextValue } from "./globalCommon";
import PageLoader from '../globalComponents/pageLoader';
import AddConfiguration from "./AddConfiguration";
import _ from "lodash";

let DashTemp: any = [];
let ExistingWepartsBackup: any = [];
const EditConfiguration = (props: any) => {
    props.props.siteUrl = props?.props?.Context?._pageContext?._web?.absoluteUrl
    const [progressBar, setprogressBar] = useState(true)
    const params = new URLSearchParams(window.location.search);
    const rerender = React.useReducer(() => ({}), {})[1];
    let DashboardId: any = params.get('DashBoardId');
    if (DashboardId == undefined || DashboardId == '')
        DashboardId = 1;
    const ContextData: any = useContext(myContextValue);
    let defaultConfig = { "WebpartTitle": '', "TileName": '', "ShowWebpart": '', "IsDashboardFav": false, "WebpartPosition": { "Row": 0, "Column": 0 }, "GroupByView": '', "Id": 1, "AdditonalHeader": false, "smartFevId": '', "DataSource": "Tasks", "selectFilterType": "smartFav", "selectUserFilterType": "AssignedTo" }
    const [NewItem, setNewItem]: any = useState<any>([defaultConfig]);
    const [Items, setItems]: any = useState<any>([defaultConfig]);
    const [SmartFav, setSmartFav] = useState<any>([]);
    const [DataSource, setDataSource] = useState<any>([]);
    const [DashboardTitle, setDashboardTitle] = useState<any>('');
    const [ExistingWeparts, setExistingWeparts] = useState<any>([]);
    const [dragItem, setDragItem] = useState({ Current: null, CurrentIndex: null });
    const [dragOverItem, setDragOverItem] = useState({ Current: null, CurrentIndex: null });
    const [IsManageConfigPopup, setIsManageConfigPopup] = React.useState(false);
    const [SelectedItem, setSelectedItem]: any = React.useState({});
    const [IsWebPartPopup, setIsWebPartPopup] = React.useState(false);
    const [type, setType] = useState<any>({});


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
            draggedItemContent.WebpartTitle = draggedItemContent.Title;
            let obj: any = {};
            obj.Column = dragOverItem.Current;
            obj.Row = dragOverItem.CurrentIndex;
            draggedItemContent.WebpartPosition = obj;
            // Remove the dragged item from its original position
            if (draggedItemContent?.Configurations != undefined) {
                let draggedItemContent123: any = JSON.parse(draggedItemContent?.Configurations);
                draggedItemContent = _.cloneDeep(draggedItemContent123);
            }
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
        web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'Smartfavorites' or Key eq 'WebPartGallarySmartfavorites'").getAll().then((data: any) => {
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
                    // if (item?.FilterType == 'Categories')
                    //     setTaskCategoriesData(item?.Status)
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
            //  ExistingWepartsBackup = data;

            setExistingWeparts(data);
            ExistingWepartsBackup = _.cloneDeep(data);
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
                if (type?.Id === filter?.Id) {
                    filter.DataSource = type.DataSource;
                    filter.smartFevId = type.smartFevId === undefined ? "" : type.smartFevId;
                }
                // if(filter?.Configurations !=undefined) {
                //    let item = JSON.parse(filter?.Configurations);
                //    filter
                // }
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
        LoadExistingWebparts();
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
            setNewItem((prev: any) => [...prev, ColumnsValue]);

        }
    }
    const deleteExistingTemplate = async (itemValue: any, arrayIndex: number) => {
        const updatedItems = [...NewItem];
        // Remove the dragged item from its original position
        updatedItems?.forEach((item: any, index: any) => {
            if (index === arrayIndex)
                item?.ArrayValue?.forEach((subChild: any, indexChild: any) => {
                    if (itemValue.Id === subChild?.Id) {
                        const findItem = ExistingWepartsBackup?.filter((filt: any) => filt.Id === subChild.Id)
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
    // const updateDataSource = (Selecteditem: any) => {
    //     const updatedItems = [...NewItem];
    //     // Remove the dragged item from its original position
    //     updatedItems?.forEach((item: any) => {
    //         item?.ArrayValue?.forEach((subChild: any) => {
    //             if (Selecteditem.Id === subChild?.Id) {
    //                 subChild.DataSource = Selecteditem.DataSource;
    //             }
    //         })
    //     })
    //     setType(Selecteditem);
    //     setNewItem(updatedItems);

    // }
    // const updateSmartFev = (Selecteditem: any) => {
    //     const updatedItems = [...NewItem];
    //     // Remove the dragged item from its original position
    //     updatedItems?.forEach((item: any) => {
    //         item?.ArrayValue?.forEach((subChild: any) => {
    //             if (Selecteditem.Id === subChild?.Id) {
    //                 subChild.smartFevId = Selecteditem.UpdatedId;
    //             }
    //         })
    //     })
    //     setNewItem(updatedItems);
    //     const updatedAllItems = [...Items];
    //     Items?.forEach((subChild: any) => {
    //         if (Selecteditem.Id === subChild?.Id) {
    //             subChild.smartFevId = Selecteditem.UpdatedId;
    //         }
    //     })
    //     setType(Selecteditem);
    //     setItems(updatedAllItems);
    // }
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
                            <div className="col-sm-9 pe-0">
                                <div className="row">
                                    {NewItem != undefined && NewItem?.length > 0 && NewItem.map((item: any, index: any) => {
                                        return (
                                            <>
                                                {/* <div className="row"> */}
                                                <div className={item.ClassValues}>
                                                    <div className="fw-semibold text-center mb-2" style={{ borderBottom: '1px solid var(--SiteBlue)' }}>{item.ColumnTitle}</div>
                                                    {item != undefined && item?.ArrayValue?.length > 0 ? item?.ArrayValue?.map((subitem: any, indexNew: any) => {
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
                                                                    <span title="Edit" className="light ml-12  svg__icon--cross svg__iconbox" onClick={(e) => deleteExistingTemplate(subitem, index)} ></span>
                                                                </div>
                                                            </>
                                                        )
                                                    }) : <div>
                                                        <div className="alignCenter justify-content-center mb-2 w-100" style={{ height: '50px', width: "150px" }}
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
                                <div className='form-label full-width mb-1 alignCenter' onClick={(e) => AddColumn()}><a className="alignCenter hreflink ml-auto siteColor"><span className="svg__iconbox svg__icon--Plus mini"></span> Add Column</a></div>
                                <div className='form-label full-width alignCenter' onClick={(e) => AddWebpartPopup()}><a className="alignCenter hreflink ml-auto siteColor"> <span className="svg__iconbox svg__icon--Plus mini"></span> Add WebPart</a></div>
                                {IsWebPartPopup && <div className='my-2 card addconnect boxshadow' >
                                    <div className="alignCenter border-bottom f-15 fw-semibold m-2 siteColor">Existing Webparts</div>
                                    <div className="card-body">
                                        {IsWebPartPopup && ExistingWeparts?.length > 0 && ExistingWeparts?.map((item: any, index: any) => {
                                            return (
                                                <>
                                                    <div className="alignCenter bg-siteColor justify-content-center mb-2 w-100" style={{ height: '50px' }} onDragStart={(e) => dragStart(e, index, index)}
                                                        onDragEnter={(e) => dragEnd(e, index, index)}
                                                        onDragEnd={(e) => drop(item, index, index, "DifferentArray")}
                                                        key={index}
                                                        draggable
                                                    >{item.Title}
                                                    </div>
                                                </>
                                            )
                                        })}</div>
                                </div>}

                            </div>

                        </div>
                    </div>
                    <div className="Metadatapannel lastmodify mb-2">
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

        </>

    );
};
export default EditConfiguration;