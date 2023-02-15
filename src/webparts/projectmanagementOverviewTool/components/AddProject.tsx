import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import ComponentPortPolioPopup from '../../EditPopupFiles/ComponentPortfolioSelection';
import Button from 'react-bootstrap/Button';
import LinkedComponent from '../../../globalComponents/EditTaskPopup/LinkedComponent';
   
const AddProject = (props: any) => {
    const [title, settitle] = React.useState('')
    const [lgShow, setLgShow] = useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [ShareWebComponent, setShareWebComponent] = React.useState('');
    const [linkedComponentData, setLinkedComponentData] = React.useState([]);
    const [IsServices, setIsServices] = React.useState(false);
    const [save, setSave] = React.useState({ siteType: '', linkedServices: [], recentClick: undefined, Mileage: '', DueDate: undefined, dueDate: '', taskCategory: '', taskCategoryParent: '', rank: undefined, Time: '', taskName: '', taskUrl: undefined, portfolioType: 'Component', Component: [] })
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const OpenCreateTaskPopup = () => {
        setLgShow(true)
    }
    const addFunction = async () => {
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        await web.lists.getById('EC34B38F-0669-480A-910C-F84E92E58ADF').items.add({
            Title: `${title}`,
            Item_x0020_Type: "Project",
        }).then((res: any) => {
            props?.CallBack
            setLgShow(false)
            console.log(res);
        })
    }
    const Call = (propsItems: any, type: any) => {
        setIsComponent(false);
        if (type === "LinkedComponent") {
            if (propsItems?.linkedComponent?.length > 0) {
                setLinkedComponentData(propsItems.linkedComponent);
            }
        }
        if (type === "SmartComponent") {
            if (propsItems?.smartComponent?.length > 0) {
                setSmartComponentData(propsItems.smartComponent);
            }
        }

    };
    const selectPortfolioType = (item: any) => {
        if (item === 'Component') {
            setSave({ ...save, portfolioType: 'Component' })
            setSmartComponentData([])
        }
        if (item === 'Service') {
            setSave({ ...save, portfolioType: 'Service' })
            setLinkedComponentData([])
        }

    }
    const EditLinkedServices = (item: any, title: any) => {
        setIsServices(true);
        setShareWebComponent(item);
    }
    const EditComponent = (item: any, title: any) => {
        setIsComponent(true);
        setShareWebComponent(item);
    }
    const onRenderCustomFooterMain = () => {
        return (


            <footer className='text-end'>
                <Button type="button" className="me-2" variant="secondary" onClick={() => setLgShow(false)}>Cancel</Button>
                <Button type="button" variant="primary" onClick={() => addFunction()}>Create</Button>
            </footer>


        )
    }
    return (
        <>

            <Button type="button" variant="primary" className='pull-right' onClick={() => OpenCreateTaskPopup()}>Create Project</Button>

            <Panel
                headerText={`Create Project`}
                type={PanelType.medium}
                isOpen={lgShow}
                onDismiss={() => setLgShow(false)}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterMain}>

                <div className='card-body'>
                    <span >
                        <div>
                            <span>
                                <input type='text' className='form-control' placeholder='Enter Task Name' value={title} onChange={(e) => { settitle(e.target.value) }} />
                                {/* <input type='text' className='form-control' placeholder='Enter Task Name' defaultValue={title} onChange={(e) => { (e: any) => settitle(e.target.value) }} /> */}
                            </span>
                        </div>
                    </span>
                    <div className="row">
                    <div className='col-sm-3 p-0 mt-2'>
                            <input
                                type="radio" className="form-check-input radio  me-1" defaultChecked={save.portfolioType === 'Component'}
                                name="taskcategory" onChange={() => selectPortfolioType('Component')} />
                            <label className='form-check-label me-2'>Component</label><br/>
                            <input type="radio" className="form-check-input radio  me-1"
                                name="taskcategory" onChange={() => selectPortfolioType('Service')} />
                            <label className='form-check-label'>Service</label>
                        </div>

                        <div className='col-sm-9 pe-0'>{
                            save.portfolioType === 'Component' ?
                                <div className="input-group">
                                    <label className="form-label full-width">Component Portfolio</label>
                                    {smartComponentData?.length > 0 ? null :
                                        <>
                                            <input type="text" readOnly
                                                className="form-control"
                                                id="{{PortfoliosID}}" autoComplete="off"
                                            />
                                        </>
                                    }
                                    {smartComponentData ? smartComponentData?.map((com: any) => {
                                        return (
                                            <>
                                                <div className="d-flex Component-container-edit-task" style={{ width: "89%" }}>
                                                    <a style={{ color: "#fff !important" }} target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                    <a>
                                                        <img className="mx-2" src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setSmartComponentData([])} />
                                                    </a>
                                                </div>
                                            </>
                                        )
                                    }) : null}

                                    <span className="input-group-text">
                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                            onClick={(e) => EditComponent(save, 'Component')} />
                                    </span>
                                </div> : ''
                        }
                            {
                                save.portfolioType === 'Service' ? <div className="input-group">
                                    <label className="form-label full-width">
                                        Service Portfolio
                                    </label>
                                    {
                                        linkedComponentData?.length > 0 ? <div>
                                            {linkedComponentData?.map((com: any) => {
                                                return (
                                                    <>
                                                        <div className="d-flex Component-container-edit-task">
                                                            <div>
                                                                <a className="hreflink " target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                                    {com.Title}
                                                                </a>
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/_layouts/images/delete.gif" onClick={() => setLinkedComponentData([])} />
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </div> :
                                            <input type="text" readOnly
                                                className="form-control"
                                            />
                                    }
                                    <span className="input-group-text">
                                        <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                            onClick={(e) => EditLinkedServices(save, 'Component')} />
                                    </span>
                                </div> : ''
                            }
                        </div>
                    </div>
                </div>
            </Panel>
            {IsComponent && <ComponentPortPolioPopup props={ShareWebComponent} Call={Call}></ComponentPortPolioPopup>}
            {IsServices && <LinkedComponent props={ShareWebComponent} Call={Call}></LinkedComponent>}
        </>
    )
}

export default AddProject