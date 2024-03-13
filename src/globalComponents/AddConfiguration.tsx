import React, { useEffect } from "react";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import { Col, Row } from "react-bootstrap";
import Tooltip from "./Tooltip";
import { myContextValue } from "./globalCommon";
let portfolioColor: any = '#057BD0';
let DashTemp: any = []
const AddConfiguration = (props: any) => {
    const params = new URLSearchParams(window.location.search);
    let DashboardId: any = params.get('DashBoardId');
    if (DashboardId == undefined || DashboardId == '')
        DashboardId = 1;
    const ContextData: any = React.useContext(myContextValue);
    let defaultConfig = { "WebpartTitle": '', "TileName": '', "ShowWebpart": '', "WebpartPosition": { "Row": 0, "Column": 0 }, "GroupByView": '', "Id": 1, "AdditonalHeader": false, "smartFevId": '', "DataSource": "Tasks", "selectFilterType": "smartFav", "selectUserFilterType": "AssignedTo" }
    const [NewItem, setNewItem]: any = React.useState<any>([defaultConfig]);
    const [SmartFav, setSmartFav] = React.useState<any>([]);
    const [AllTaskUsers, setAllTaskUsers] = React.useState<any>([]);
    const [DashboardTemplate, setDashboardTemplate] = React.useState<any>([]);
    const [DataSource, setDataSource] = React.useState<any>([{ "key": "Tasks", "text": "Tasks" }, { "key": "TaskUsers", "text": "TaskUsers" }, { "key": "TimeSheet", "text": "TimeSheet" },]);
    const [DashboardTitle, setDashboardTitle] = React.useState<any>('');
    const [IsCheck, setIsCheck] = React.useState<any>(false);
    let [StatusOptions, setStatusOptions] = React.useState([{ value: 0, status: "0% Not Started", }, { value: 1, status: "1% For Approval", }, { value: 2, status: "2% Follow Up", }, { value: 3, status: "3% Approved", },
    { value: 4, status: "4% Checking", }, { value: 5, status: "5% Acknowledged", }, { value: 9, status: "9% Ready To Go", }, { value: 10, status: "10% working on it", },
    { value: 70, status: "70% Re-Open", }, { value: 75, status: "75% Deployment Pending", }, { value: 80, status: "80% In QA Review", }, { value: 90, status: "90% Task completed", },
    { value: 100, status: "100% Closed", },]);
    let [CustomUserFilter, setCutomUserFilter] = React.useState([{ value: 'Approver', status: "Me As Approver", }, { value: 'TeamLeader', status: "Me As Team Lead", }]);
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
                let result = data?.length + 1;
                if (props?.SingleWebpart == true) {
                    let FilteredData = data?.filter((config: any) => config?.Value == DashboardId)[0];
                    if (props?.DashboardConfigBackUp && NewItem[0]?.Id !== undefined) {
                        props.DashboardConfigBackUp.forEach((item: any) => {
                            if (item?.Id !== undefined && item.Id === NewItem[0].Id) {
                                Object.keys(NewItem[0]).forEach((key) => {
                                    if (key in item) {
                                        item[key] = NewItem[0][key];
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

    useEffect(() => {
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
                                        <div key={index} className={`${items?.IsEditable != false ? 'border p-2 mb-2' : 'border p-2 mb-2 is-disabled'}`}>
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
                                                    <div className="input-group">
                                                        <label className='form-label full-width'>Row Position</label>
                                                        <input className='form-control' type='text' placeholder="Row" value={items?.WebpartPosition?.Row}
                                                            onChange={(e) => {
                                                                const updatedItems = [...NewItem]; updatedItems[index] = { ...items, WebpartPosition: { ...items.WebpartPosition, Row: parseInt(e.target.value) } };
                                                                setNewItem(updatedItems);
                                                            }} />
                                                    </div>
                                                </Col>
                                                <Col sm="6" md="6" lg="6">
                                                    <div className="input-group">
                                                        <label className='form-label full-width'>Column Position</label>
                                                        <input className='form-control' type='text' placeholder="Column" value={items?.WebpartPosition?.Column}
                                                            onChange={(e) => {
                                                                const updatedItems = [...NewItem]; updatedItems[index] = { ...items, WebpartPosition: { ...items.WebpartPosition, Column: parseInt(e.target.value) } };
                                                                setNewItem(updatedItems);
                                                            }} />
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
                                                {items.DataSource != 'TimeSheet' &&
                                                    <Col sm="12" md="12" lg="12">
                                                        <label className='form-label full-width SpfxCheckRadio mb-1'>
                                                            <input type="radio" className='radio' value="custom" checked={items?.selectFilterType === 'custom'} onChange={(e) => handleFilterChange(e, index, items)} />
                                                            Custom Filter
                                                            <input type="radio" className='radio ms-3' value="smartFav" checked={items?.selectFilterType === 'smartFav'} onChange={(e) => handleFilterChange(e, index, items)} />
                                                            SmartFav Filter
                                                        </label>
                                                    </Col>}
                                                {items.DataSource == "Tasks" && items?.selectFilterType == 'custom' &&
                                                    <Col sm="4" md="4" lg="4">
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
                                                                Working Task
                                                            </label>
                                                        </>
                                                    </Col>}
                                                <Col sm="4" md="4" lg="4">
                                                    {items.DataSource == "Tasks" && items?.selectFilterType == 'smartFav' && <><label className='form-label full-width'>Select Filter</label><Dropdown id="FiltesSmartFav" options={[{ key: '', text: '' }, ...(SmartFav?.map((item: any) => ({ key: item?.UpdatedId, text: item?.Title })) || [])]} selectedKey={items?.smartFevId}
                                                        onChange={(e, option) => handleSelectFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == "Tasks" && items?.selectFilterType == 'custom' && <><label className='form-label full-width'>Status</label> <Dropdown id="FiltersCustom" options={[{ key: '', text: '' }, ...(StatusOptions?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.Status}
                                                        onChange={(e, option) => handleCustomFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == "TaskUsers" && items?.selectFilterType == 'smartFav' && <><label className='form-label full-width'>Select Filter</label><Dropdown id="FiltesTaskUser" options={[{ key: '', text: '' }, ...(AllTaskUsers?.map((item: any) => ({ key: item?.Id, text: item?.Title })) || [])]} selectedKey={items?.smartFevId}
                                                        onChange={(e, option) => handleSelectFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == "TaskUsers" && items?.selectFilterType == 'custom' && <><label className='form-label full-width'>Select Filter</label><Dropdown id="FiltesCustomTaskUser" options={[{ key: '', text: '' }, ...(CustomUserFilter?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.Status}
                                                        onChange={(e, option) => handleCustomUserFilterChange(option?.key, index, items)}
                                                        styles={{ dropdown: { width: '100%' } }} /></>
                                                    }
                                                    {items.DataSource == 'TimeSheet' && <><label className='form-label full-width'>Select Filter</label><Dropdown id="FiltesCustomTaskUser" options={[{ key: '', text: '' }, ...(CustomUserFilter?.map((item: any) => ({ key: item?.value, text: item?.status })) || [])]} selectedKey={items?.Status}
                                                        onChange={(e, option) => handleCustomUserFilterChange(option?.key, index, items)}
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
                    <button className="btn btn-primary ms-1" onClick={SaveConfigPopup} disabled={DashboardTitle == '' || IsCheck == false}>Save</button>
                    <button className='btn btn-default ms-1' onClick={CloseConfiguationPopup}>Cancel</button>
                </div>
            </Panel >
        </>
    );
};
export default AddConfiguration;