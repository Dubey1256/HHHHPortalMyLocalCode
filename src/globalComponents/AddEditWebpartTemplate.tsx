import React, { useCallback, useContext, useEffect, useState } from "react";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import { Col, Row } from "react-bootstrap";
import Tooltip from "./Tooltip";
import { myContextValue } from "./globalCommon";
import TeamSmartFilter from "./SmartFilterGolobalBomponents/TeamSmartFilter";
let portfolioColor: any = '#2F5596';
let CreatedSmartFavId: any;
let SmartFavDashboardTitle: any = undefined;
let UpdatedItem: any = [];
const AddEditWebpartTemplate = (props: any) => {
    props.props.siteUrl = props?.props?.Context?._pageContext?._web?.absoluteUrl;
    props.props.AdminconfigrationID = props?.props?.AdminConfigurationListId;
    const params = new URLSearchParams(window.location.search);
    let DashboardId: any = params.get('DashBoardId');
    if (DashboardId == undefined || DashboardId == '')
        DashboardId = 1;
    const ContextData: any = useContext(myContextValue);
    let defaultConfig = { "WebpartTitle": '', "TileName": '', "ShowWebpart": true, "IsDashboardFav": false, "WebpartPosition": { "Row": 0, "Column": 0 }, "GroupByView": '', "Id": 1, "AdditonalHeader": false, "smartFevId": '', "DataSource": "Tasks", "selectFilterType": "smartFav", "selectUserFilterType": "AssignedTo" }
    const [NewItem, setNewItem]: any = useState<any>([defaultConfig]);
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
                    newArray?.forEach((item: any, Itemindex: any) => {
                        item.WebpartTitle = SmartFavDashboardTitle;
                        if (item?.IsShowTile === true)
                            item.TileName = item.WebpartTitle.replaceAll(" ", "")
                        else if (item?.IsShowTile != true)
                            item.TileName = '';
                        delete item.IsShowTile;
                        if (props?.EditItem == undefined || props?.EditItem == '') {
                            item.WebpartId = 'WP-' + formatId(result)
                        }
                        if (CreatedSmartFavId)
                            item.smartFevId = CreatedSmartFavId;
                    })
                    setNewItem(newArray);
                    if (props?.EditItem != undefined && props?.EditItem != '') {
                        await web.lists.getById(props?.props.AdminConfigurationListId).items.getById(props?.EditItem?.UpdatedId).update({ Title: SmartFavDashboardTitle, Configurations: JSON.stringify(NewItem[0]) })
                            .then(async (res: any) => {
                                setNewItem([]);
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
                        await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: SmartFavDashboardTitle, Key: "WebpartTemplate", Value: result != undefined ? result.toString() : undefined, Configurations: JSON.stringify(NewItem[0]) })
                            .then(async (res: any) => {
                                CreatedSmartFavId = undefined;
                                SmartFavDashboardTitle = undefined;
                                setNewItem([]);
                                props?.CloseConfigPopup(true, 'Add')
                            }).catch((err: any) => {
                                console.log(err);
                            })
                    }

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
                                        if (key == 'smartFevId') {
                                            if (CreatedSmartFavId && item?.IsDashboardFav != true) {
                                                item[key] = CreatedSmartFavId;
                                                item['IsDashboardFav'] = true;
                                                item['WebpartTitle'] = SmartFavDashboardTitle
                                            }
                                        }
                                    }
                                });
                            }
                            delete item?.UpdatedId
                        });
                    }
                    await web.lists.getById(props?.props.AdminConfigurationListId).items.getById(FilteredData?.Id).update({ Title: FilteredData?.Title, Configurations: JSON.stringify(props?.DashboardConfigBackUp) })
                        .then(async (res: any) => {
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
                    {props?.EditItem != undefined && props?.EditItem != '' ? <span>Edit Webpart </span> : <span>Add Webpart</span>}
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
    useEffect(() => {
        if (props?.EditItem != undefined && props?.EditItem != '') {
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
                if (item.TileName != undefined && item.TileName != '')
                    item.IsShowTile = true
                if (item?.smartFevId != undefined && item?.smartFevId != '')
                    item.smartFevId = parseInt(item?.smartFevId)
            })
            setNewItem(newArray);
            UpdatedItem = JSON.parse(JSON.stringify(newArray));
        }
        else {
            setNewItem([defaultConfig])
        }
    }, [props?.EditItem]);
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
            </Panel >
        </>
    );
};
export default AddEditWebpartTemplate;