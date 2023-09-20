import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import ComponentPortPolioPopup from '../../EditPopupFiles/ComponentPortfolioSelection';
import Button from 'react-bootstrap/Button';
import LinkedComponent from '../../../globalComponents/EditTaskPopup/LinkedComponent';
import PortfolioTagging from './PortfolioTagging';
import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
let portfolioType = '';
let AllListId: any = {};
const AddProject = (props: any) => {
    const [title, settitle] = React.useState('')
    const [lgShow, setLgShow] = useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [ShareWebComponent, setShareWebComponent] = React.useState('');
    const [linkedComponentData, setLinkedComponentData] = React.useState([]);
    const [IsPortfolio, setIsPortfolio] = React.useState(false);
    const [save, setSave] = React.useState({ siteType: '', linkedServices: [], recentClick: undefined, Mileage: '', DueDate: undefined, dueDate: '', taskCategory: '', taskCategoryParent: '', rank: undefined, Time: '', taskName: '', taskUrl: undefined, portfolioType: 'Component', Component: [] })
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const OpenCreateTaskPopup = () => {
        setLgShow(true)
    }
    const addFunction = async () => {
        if (title?.length > 0) {
            let selectedComponent: any[] = [];
            if (smartComponentData !== undefined && smartComponentData.length > 0) {
                $.each(smartComponentData, function (index: any, smart: any) {
                    selectedComponent.push(smart?.Id);
                })
            }
          
            let web = new Web(props?.AllListId?.siteUrl);
            await web.lists.getById(props?.AllListId?.MasterTaskListID).items
                .select("Id,Title,PortfolioLevel,PortfolioStructureID").filter("Item_x0020_Type eq 'Project'")
                .top(1).orderBy('PortfolioLevel', false)
                .get().then(async (res: any) => {
                    let portfolioLevel = 1;
                    if (res?.length > 0) {
                        portfolioLevel = res[0].PortfolioLevel + 1
                    }
                    await web.lists.getById(props?.AllListId?.MasterTaskListID).items.add({
                        Title: `${title}`,
                        Item_x0020_Type: "Project",
                        PortfolioLevel: portfolioLevel,
                        PortfoliosId: { "results": (selectedComponent !== undefined && selectedComponent?.length > 0) ? selectedComponent : [] },
                        PortfolioStructureID: `P${portfolioLevel}`,
                    }).then((res: any) => {
                        closePopup()
                        props?.CallBack()

                    })

                })

        } else {
            alert("Please Enter Project Title")
        }

    }
    const closePopup = () => {
        settitle('')
        setLinkedComponentData([])
        setSmartComponentData([])
        setLgShow(false)

    }
    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
        if (functionType == 'close') {
            setIsComponent(false);
            setIsPortfolio(false);
        } else {
            if (DataItem?.length > 0) {
                setSmartComponentData(DataItem);
            }
            setIsPortfolio(false);
        }
    }, [])


    const unTagComponent = (array: any, index: any) => {
        array.splice(index, 1);
        setSmartComponentData(array)
        setIsComponent(!IsComponent);
    }
    const EditPortfolio = (item: any, type: any) => {
        if (type == "Component") {
            item.smartComponent = [];
            if (item.smartComponent != undefined) {
                smartComponentData?.map((com: any) => {
                    item.smartComponent.push({ Title: com?.Title, Id: com?.Id });
                });
            }
        }

        portfolioType = type;
        setIsPortfolio(true);
        setShareWebComponent(item);
    };
    const onRenderCustomHeader = (
    ) => {
        return (
            <div className="d-flex full-width pb-1" >
                <div className="subheading">
                    <span className="siteColor">
                        {`Create Project`}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <>
            <button type="button" className='btn btn-primary btnCol mb-2' onClick={() => OpenCreateTaskPopup()}>Create Project</button>

            <Panel
                onRenderHeader={onRenderCustomHeader}
                type={PanelType.medium}
                isOpen={lgShow}
                onDismiss={() => closePopup()}
                isBlocking={false}>

                <div className={IsComponent ? 'Create-Projectpoup border mb-2 mt-2 p-2' : 'Create-Projectpoup  border mb-2 mt-2 p-2'}>
                    <span >
                        <div>
                            <span>
                                <input type='text' className='form-control' placeholder='Enter Project Name' value={title} onChange={(e) => { settitle(e.target.value) }} />
                            </span>
                        </div>
                    </span>
                    <div className="row">
                        <div className="col-sm-12 input-group full-width">
                            <div className="input-group full-width">
                                <label className="form-label full-width">
                                    Portfolios
                                </label>
                                <input type="text"
                                    readOnly className="form-control" />
                                <span className="input-group-text">
                                    <span onClick={(e) => EditPortfolio(save, 'Component')} title="Edit Portfolios" className="svg__iconbox svg__icon--editBox"></span>
                                </span>
                            </div>
                            {smartComponentData?.length > 0 ?
                                <span className='full-width'>
                                    {
                                        smartComponentData?.map((com: any, index: any) => {
                                            return (
                                                <>
                                                    <span style={{ backgroundColor: com?.PortfolioType?.Color }} className="Component-container-edit-task mt-1 d-flex justify-content-between" >
                                                        <a className='light' target="_blank" href={`${props?.AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                        <a>
                                                            <span style={{ marginLeft: "6px" }} onClick={() => unTagComponent(smartComponentData, index)} className="bg-light svg__icon--cross svg__iconbox"></span>
                                                        </a>
                                                    </span>
                                                </>
                                            )
                                        })
                                    }
                                </span> : ''
                            }

                        </div>


                    </div>
                </div>
                <footer className='text-end'>
                    <Button type="button" variant="primary" className='me-1' onClick={() => addFunction()}>Create</Button>
                    <Button type="button" className="btn btn-default" variant="secondary" onClick={() => closePopup()}>Cancel</Button>

                </footer>
            </Panel>
            {IsPortfolio && (
                <ServiceComponentPortfolioPopup
                    props={ShareWebComponent}
                    Dynamic={props?.AllListId}
                    ComponentType={portfolioType}
                    Call={ComponentServicePopupCallBack}
                    selectionType={"Multi"}
                ></ServiceComponentPortfolioPopup>
            )}
            {/* {IsPortfolio && <PortfolioTagging props={ShareWebComponent} AllListId={props?.AllListId} type={portfolioType} Call={Call}></PortfolioTagging>} */}
        </>
    )
}

export default AddProject