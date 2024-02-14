import React, { useEffect } from "react";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import { Col, Row } from "react-bootstrap";
import Tooltip from "./Tooltip";
let portfolioColor: any = '#057BD0';
const AddConfiguration = (props: any) => {
    let defaultConfig = { "WebpartTitle": '', "TileName": '', "ShowWebpart": '', "WebpartPosition": { "Row": 0, "Column": 0 }, "GroupByView": '', "Id": 1, "AdditonalHeader": false, "smartFevId": '', "DataSource": "Tasks" }
    const [NewItem, setNewItem]: any = React.useState<any>([defaultConfig]);
    const [SmartFav, setSmartFav] = React.useState<any>([]);
    const [AllTaskUsers, setAllTaskUsers] = React.useState<any>([]);
    const [DataSource, setDataSource] = React.useState<any>([{ "key": "Tasks", "text": "Tasks" }, { "key": "TaskUsers", "text": "TaskUsers" }, { "key": "Portfolio Team Lead", "text": "Portfolio Team Lead" }]);
    const [DashboardTitle, setDashboardTitle] = React.useState<any>('');
    const [IsCheck, setIsCheck] = React.useState<any>(false);
    const [IsDisabledAddMoreAndFilter, setIsDisabledAddMoreAndFilter] = React.useState<any>(false);
    const LoadSmartFav = async () => {
        let SmartFavData: any = []
        const web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
        await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'Smartfavorites'").getAll().then(async (data: any) => {
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
                setDashboardTitle(props?.EditItem?.Title)
                let newArray = JSON.parse(JSON.stringify(props?.EditItem?.Configurations));
                newArray?.forEach((item: any, Itemindex: any) => {
                    item.IsDefaultTile = false;
                    item.IsShowTile = false
                    if (item.AdditonalHeader === true) {
                        item.IsDefaultTile = true;
                        setIsCheck(true)
                    }
                    if (item.TileName != undefined && item.TileName != '')
                        item.IsShowTile = true
                    if (item?.smartFevId != undefined && item?.smartFevId != '')
                        item.smartFevId = parseInt(item?.smartFevId)
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
        results.forEach(function (item: any) {
            if (item.UserGroupId == undefined) {
                getChilds(item, results);
                taskUsers.push(item);
            }
        });
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
            await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").getAll().then(async (data: any) => {
                let result = data?.length + 1
                let newArray = [...NewItem];
                newArray?.forEach((item: any, Itemindex: any) => {
                    delete item.IsDefaultTile;
                    if (item?.IsShowTile === true)
                        item.TileName = item.WebpartTitle.replaceAll(" ", "")
                    else if (item?.IsShowTile != true)
                        item.TileName = '';
                    delete item.IsShowTile;
                })
                setNewItem(newArray);
                if (props?.EditItem != undefined && props?.EditItem != '') {
                    await web.lists.getById(props?.props.AdminConfigurationListId).items.getById(props?.EditItem?.Id).update({ Title: DashboardTitle, Configurations: JSON.stringify(NewItem) })
                        .then(async (res: any) => {
                            setNewItem([]);
                            props?.CloseConfigPopup(true)
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
        updatedItems[index] = { ...items, smartFevId: event, };
        setNewItem(updatedItems);
    };
    const handleDataSourceChange = (event: any, index: any, items: any) => {
        setIsDisabledAddMoreAndFilter(false)
        if (event == 'Portfolio Team Lead')
            setIsDisabledAddMoreAndFilter(true)
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
    useEffect(() => {
        LoadSmartFav()
        loadTaskUsers()
    }, []);
    return (
        <>
            <Panel onRenderHeader={CustomHeaderConfiguration}
                isOpen={props?.IsOpenPopup}
                onDismiss={CloseConfiguationPopup}
                isBlocking={false}
                type={PanelType.medium}>
                <div className='border container modal-body p-1 mb-1'>
                    <Row className="Metadatapannel p-2 mb-2">
                        <Col sm="6" md="6" lg="6">
                            <label className='form-label full-width'>Dashboard Title</label>
                            <input className='form-control' type='text' placeholder="Dashboard Title" value={DashboardTitle} onChange={(e) => setDashboardTitle(e.target.value)} />
                        </Col>
                    </Row>
                    <Row className="Metadatapannel p-2 mb-2">
                        <Col sm="12" md="12" lg="12">
                            <label className='form-label full-width'>Webpart Configuartion</label>
                            {NewItem != undefined && NewItem?.length > 0 && NewItem.map((items: any, index: any) => {
                                return (
                                    <>
                                        <div key={index} className='border p-2 mb-2'>
                                            <Row className="Metadatapannel mb-2">
                                                <Col sm="4" md="4" lg="4">
                                                    <label className='form-label full-width'>WebPart Title</label>
                                                    <input className='form-control' type='text' placeholder="Name"
                                                        value={items?.WebpartTitle} onChange={(e) => {
                                                            const updatedItems = [...NewItem]; updatedItems[index] = { ...items, WebpartTitle: e.target.value };
                                                            setNewItem(updatedItems);
                                                        }} />
                                                </Col>
                                                <Col sm="3" md="3" lg="3">
                                                    <div> Show WebPart</div>

                                                    <label className="switch me-2" htmlFor={`ShowWebpartCheckbox${index}`}>
                                                        <input checked={items?.ShowWebpart} onChange={(e: any) => {
                                                            const isChecked = e.target.checked;
                                                            const updatedItems = [...NewItem]; updatedItems[index] = { ...items, ShowWebpart: isChecked };
                                                            setNewItem(updatedItems);
                                                            if (!isChecked) { alert('Webpart will not be shown when toggle is active!'); }
                                                        }} type="checkbox" id={`ShowWebpartCheckbox${index}`} />
                                                        {items?.ShowWebpart === true ? <div className="slider round" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}` }}></div> : <div className="slider round"></div>}
                                                    </label>
                                                </Col>
                                                <Col sm="3" md="3" lg="3">
                                                    <div> Group By View</div>
                                                    <label className="switch me-2" htmlFor={`GroupByViewCheckbox${index}`}>
                                                        <input checked={items?.GroupByView} onChange={(e: any) => {
                                                            const updatedItems = [...NewItem]; updatedItems[index] = { ...items, GroupByView: e.target.checked, };
                                                            setNewItem(updatedItems);
                                                        }}

                                                            type="checkbox" id={`GroupByViewCheckbox${index}`} />
                                                        {items?.GroupByView === true ? <div className="slider round" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}` }}></div> : <div className="slider round"></div>}
                                                    </label>
                                                </Col>
                                                <Col sm="2" md="2" lg="2">
                                                    {index != 0 && <a className="pull-right hreflink" title="Remove webpart" onClick={(e) => RemoveWebpart(items, index)}><span className="svg__iconbox svg__icon--cross "></span></a>}
                                                </Col>
                                            </Row>
                                            <Row className="Metadatapannel mb-2">
                                                <Col sm="12" md="12" lg="12">
                                                    <label className='form-label full-width'>Webpart Position</label>
                                                </Col>
                                                <Col sm="6" md="6" lg="6">
                                                    <label className='form-label full-width'>Row Position</label>
                                                    <input className='form-control' type='text' placeholder="Row" value={items?.WebpartPosition?.Row}
                                                        onChange={(e) => {
                                                            const updatedItems = [...NewItem]; updatedItems[index] = { ...items, WebpartPosition: { ...items.WebpartPosition, Row: parseInt(e.target.value) } };
                                                            setNewItem(updatedItems);
                                                        }} />
                                                </Col>
                                                <Col sm="6" md="6" lg="6">
                                                    <label className='form-label full-width'>Column Position</label>
                                                    <input className='form-control' type='text' placeholder="Column" value={items?.WebpartPosition?.Column}
                                                        onChange={(e) => {
                                                            const updatedItems = [...NewItem]; updatedItems[index] = { ...items, WebpartPosition: { ...items.WebpartPosition, Column: parseInt(e.target.value) } };
                                                            setNewItem(updatedItems);
                                                        }} />
                                                </Col>
                                            </Row>
                                            <Row className="Metadatapannel">
                                                <Col sm="4" md="4" lg="4">
                                                    {(items.DataSource == "Tasks" || items.DataSource == "TaskUsers") && < label className='form-label full-width'>Select Filter</label>}
                                                    {items.DataSource == "Tasks" && <Dropdown id="FiltesSmartFav" disabled={IsDisabledAddMoreAndFilter == true} options={[{ key: '', text: '' }, ...(SmartFav?.map((item: any) => ({ key: item?.UpdatedId, text: item?.Title })) || [])]} selectedKey={items?.smartFevId}
                                                        onChange={(e, option) => handleSelectFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }}
                                                    />
                                                    }
                                                    {items.DataSource == "TaskUsers" && <Dropdown disabled={IsDisabledAddMoreAndFilter == true} id="FiltesTaskUser" options={[{ key: '', text: '' }, ...(AllTaskUsers?.map((item: any) => ({ key: item?.Id, text: item?.Title })) || [])]} selectedKey={items?.smartFevId}
                                                        onChange={(e, option) => handleSelectFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }}
                                                    />
                                                    }
                                                </Col>
                                                <Col sm="4" md="4" lg="4">
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
                                            </Row>
                                            <Row className="Metadatapannel">
                                                <Col sm="4" md="4" lg="4">
                                                    <label className='form-label full-width'>Data Source</label>
                                                    <Dropdown id="DataSource" options={[{ key: '', text: '' }, ...(DataSource?.map((item: any) => ({ key: item?.key, text: item?.text })) || [])]} selectedKey={items?.DataSource}
                                                        onChange={(e, option) => handleDataSourceChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }}
                                                    />
                                                </Col>
                                                <Col sm="4" md="4" lg="4">

                                                </Col>
                                                <Col sm="4" md="4" lg="4">

                                                </Col>
                                            </Row>
                                        </div >
                                    </>
                                )
                            })}
                        </Col>
                    </Row>
                </div>
                {IsDisabledAddMoreAndFilter == false && <div className='mb-5'><a className="pull-right empCol hreflink" onClick={(e) => AddMorewebpart()}> +Add More </a></div>}
                <div className='modal-footer mt-2'>
                    <button className="btn btn-primary ms-1" onClick={SaveConfigPopup} disabled={DashboardTitle == '' || IsCheck == false}>Save</button>
                    <button className='btn btn-default ms-1' onClick={CloseConfiguationPopup}>Cancel</button>
                </div>
            </Panel >
        </>
    );
};
export default AddConfiguration;