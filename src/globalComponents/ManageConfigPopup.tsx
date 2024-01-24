import React, { useEffect } from "react";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import { myContextValue } from "./globalCommon";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import Tooltip from "./Tooltip";
let portfolioColor: any = '#057BD0';
const ManageConfigPopup = (props: any) => {
    const params = new URLSearchParams(window.location.search);
    let DashboardId: any = params.get('DashBoardId');
    const ContextData: any = React.useContext(myContextValue);
    const [EditItem, setEditItem]: any = React.useState({});
    const [SmartFav, setSmartFav] = React.useState<any>([]);
    const [SelectedFilter, setSelectedFilter] = React.useState<any>([]);
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
            setSmartFav(SmartFavData)
        }).catch((err: any) => {
            console.log(err);
        })
    }
    const CloseConfiguationPopup = () => {
        setEditItem('');
        props?.CloseOpenConfigPopup()
    }
    const SaveConfigPopup = async () => {
        try {
            if (DashboardId == undefined || DashboardId == '')
                DashboardId = 1;
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").getAll().then(async (data: any) => {
                data = data?.filter((config: any) => config?.Value == DashboardId)[0];
                if (props?.DashboardConfigBackUp && EditItem?.Id !== undefined) {
                    props.DashboardConfigBackUp.forEach((item: any) => {
                        if (item?.Id !== undefined && item.Id === EditItem.Id) {
                            Object.keys(EditItem).forEach((key) => {
                                if (key in item) {
                                    item[key] = EditItem[key];
                                }
                            });
                        }
                    });
                }
                await web.lists.getById(props?.props.AdminConfigurationListId).items.getById(data.Id).update({ Configurations: JSON.stringify(props?.DashboardConfigBackUp) })
                    .then(async (res: any) => {
                        setEditItem('');
                        CloseConfiguationPopup();
                        if (ContextData != undefined && ContextData?.callbackFunction != undefined)
                            ContextData?.callbackFunction();
                    }).catch((err: any) => {
                        console.log(err);
                    })
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
                    Manage Configuration
                </div>
                <Tooltip ComponentId={869} />
            </>
        );
    };
    const handleSelectFilterChange = (event: any) => {
        setSelectedFilter(event)
        setEditItem((prevState: any) => ({ ...prevState, smartFevId: event }));
    };
    useEffect(() => {
        if (props != undefined && props?.DashboardConfigBackUp != undefined && props?.DashboardConfigBackUp?.length > 0) {
            let EditData = props?.DashboardConfigBackUp.filter((item: any) => item?.WebpartTitle?.toLowerCase() == props?.SelectedItem?.WebpartTitle?.toLowerCase())[0];
            setEditItem(EditData);
            setSelectedFilter(EditData?.smartFevId)
        }
        LoadSmartFav()
    }, []);
    return (
        <>
            {EditItem && <Panel onRenderHeader={CustomHeaderConfiguration}
                isOpen={props?.IsManageConfigPopup}
                onDismiss={CloseConfiguationPopup}
                isBlocking={false}
                type={PanelType.medium}>
                <div className='modal-body'>
                    <Row className="Metadatapannel">
                        <Col sm="4" md="4" lg="4">
                            <label className='form-label full-width'>WebPart Title</label>
                            <input className='form-control' type='text' placeholder="Name" defaultValue={EditItem?.WebpartTitle} onChange={(e) => setEditItem({ ...EditItem, WebpartTitle: e.target.value, })} />
                        </Col>
                        <Col sm="4" md="4" lg="4">
                            <div> Show WebPart</div>
                            <label className="switch me-2" htmlFor="ShowWebpartCheckbox">
                                <input checked={EditItem?.ShowWebpart} onChange={(e: any) => {
                                    const isChecked = e.target.checked; setEditItem({ ...EditItem, ShowWebpart: isChecked });
                                    if (!isChecked) { alert('Webpart will not be shown when toggle is active!'); }
                                }} type="checkbox" id="ShowWebpartCheckbox" />
                                {EditItem?.ShowWebpart === true ? <div className="slider round" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}` }}></div> : <div className="slider round"></div>}
                            </label>
                        </Col>
                        {EditItem?.GroupByView != undefined && <Col sm="4" md="4" lg="4">
                            <div> Group By View</div>
                            <label className="switch me-2" htmlFor="GroupByViewCheckbox">
                                <input checked={EditItem?.GroupByView} onChange={(e: any) => setEditItem({ ...EditItem, GroupByView: e.target.checked, })} type="checkbox" id="GroupByViewCheckbox" />
                                {EditItem?.GroupByView === true ? <div className="slider round" style={{ backgroundColor: `${portfolioColor}`, borderColor: `${portfolioColor}` }}></div> : <div className="slider round"></div>}
                            </label>
                        </Col>}
                    </Row>
                    <Row className="Metadatapannel">
                        <Col sm="12" md="12" lg="12">
                            <label className='form-label full-width'>Webpart Position</label>
                        </Col>
                        <Col sm="6" md="6" lg="6">
                            <label className='form-label full-width'>Row Position</label>
                            <input className='form-control' type='text' placeholder="Row" defaultValue={EditItem?.WebpartPosition?.Row}
                                onChange={(e) => setEditItem({ ...EditItem, WebpartPosition: { ...EditItem.WebpartPosition, Row: parseInt(e.target.value) } })} />
                        </Col>
                        <Col sm="6" md="6" lg="6">
                            <label className='form-label full-width'>Column Position</label>
                            <input className='form-control' type='text' placeholder="Column" defaultValue={EditItem?.WebpartPosition?.Column}
                                onChange={(e) => setEditItem({ ...EditItem, WebpartPosition: { ...EditItem.WebpartPosition, Column: parseInt(e.target.value) } })} />
                        </Col>
                        {EditItem?.GroupByView != undefined && <Col sm="4" md="4" lg="4">
                            <label className='form-label full-width'>Select Filter</label>
                            <Dropdown id="Filtes" options={[{ key: '', text: '' }, ...(SmartFav?.map((item: any) => ({ key: item?.UpdatedId, text: item?.Title })) || [])]} selectedKey={SelectedFilter}
                                onChange={(e, option) => handleSelectFilterChange(option?.key)}
                                styles={{ dropdown: { width: '100%' } }}
                            />
                        </Col>}
                    </Row>
                </div>
                <div className='modal-footer mt-2'>
                    <button className="btn btn-primary ms-1" onClick={SaveConfigPopup}>Save</button>
                    <button className='btn btn-default ms-1' onClick={CloseConfiguationPopup}>Cancel</button>
                </div>
            </Panel>}
        </>
    );
};
export default ManageConfigPopup;