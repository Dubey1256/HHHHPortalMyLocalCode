import React, { useState } from "react";
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Web } from "sp-pnp-js";
import { Col, Row } from "react-bootstrap";
import Tooltip from "./Tooltip";
import PageLoader from '../globalComponents/pageLoader';
const AddConfiguration = (props: any) => {
    props.props.siteUrl = props?.props?.Context?._pageContext?._web?.absoluteUrl
    const params = new URLSearchParams(window.location.search);
    let DashboardId: any = params.get('DashBoardId');
    if (DashboardId == undefined || DashboardId == '')
        DashboardId = 1;
    let defaultConfig = { "WebpartTitle": '', "TileName": '', "ShowWebpart": true, "IsDashboardFav": false, "WebpartPosition": { "Row": 0, "Column": 0 }, "GroupByView": '', "Id": 1, "AdditonalHeader": false, "smartFevId": '', "DataSource": "Tasks", "selectFilterType": "smartFav", "selectUserFilterType": "AssignedTo" }
    const [NewItem, setNewItem]: any = useState<any>([defaultConfig]);
    const [DashboardTitle, setDashboardTitle] = useState<any>('');
    const CloseConfiguationPopup = () => {
        setNewItem([]);
        props?.CloseConfigPopup(false)
    }
    const SaveConfigPopup = async () => {
        try {
            let web = new Web(props?.props?.Context?._pageContext?._web?.absoluteUrl);
            await web.lists.getById(props?.props?.AdminConfigurationListId).items.select("Title", "Id", "Value", "Key", "Configurations").filter("Key eq 'DashBoardConfigurationId'").orderBy("Created", false).getAll().then(async (data: any) => {
                let result: any;
                if (data?.length && data[data.length - 1].Value != undefined && data[data.length - 1].Value != '') {
                    result = parseInt(data[data.length - 1].Value) + 1;
                }
                else {
                    result = data?.length + 1;
                }
                let newArray = [...NewItem];
                setNewItem(newArray);
                await web.lists.getById(props?.props?.AdminConfigurationListId).items.add({ Title: DashboardTitle, Key: "DashBoardConfigurationId", Value: result != undefined ? result.toString() : undefined, Configurations: JSON.stringify(NewItem) })
                    .then(async (res: any) => {
                        setNewItem([]);
                        props?.CloseConfigPopup(true)
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
                    {props?.EditItem != undefined && props?.EditItem != '' ? <span>Edit Dashboard Configuration</span> : <span>Add Dashboard Configuration</span>}
                </div>
                {props?.EditItem != undefined && props?.EditItem != '' ? <Tooltip ComponentId={869} /> : <Tooltip ComponentId={1107} />}

            </>
        );
    };
    return (
        <>
            <Panel onRenderHeader={CustomHeaderConfiguration}
                isOpen={props?.IsOpenPopup}
                onDismiss={CloseConfiguationPopup}
                isBlocking={false}
                type={PanelType.medium}>
                <div className='border container modal-body p-1 mb-1'>                
                    {props?.SingleWebpart != true && <Row className="Metadatapannel p-2 mb-2">
                        <Col sm="8" md="8" lg="8">
                            <div className="input-group">
                                <label className='form-label full-width'>Dashboard Title</label>
                                <input className='form-control' type='text' placeholder="Dashboard Title" value={DashboardTitle} onChange={(e) => setDashboardTitle(e.target.value)} />
                            </div>
                        </Col>
                    </Row>}
                </div>
                <div className='modal-footer mt-2'>
                    <button className="btn btn-primary ms-1" onClick={SaveConfigPopup} disabled={DashboardTitle == ''}>Save</button>
                    <button className='btn btn-default ms-1' onClick={CloseConfiguationPopup}>Cancel</button>
                </div>
            </Panel >
        </>
    );
};
export default AddConfiguration;