import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import Button from 'react-bootstrap/Button';
import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
let portfolioType = '';
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
            let selectedService: any[] = [];
            if (linkedComponentData !== undefined && linkedComponentData.length > 0) {
                $.each(linkedComponentData, function (index: any, smart: any) {
                    selectedService.push(smart?.Id);
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
                        ComponentId: { "results": (selectedComponent !== undefined && selectedComponent?.length > 0) ? selectedComponent : [] },
                        PortfolioStructureID: `P${portfolioLevel}`,
                        ServicesId: { "results": (selectedService !== undefined && selectedService?.length > 0) ? selectedService : [] },
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
            if (Type === "Service") {
                if (DataItem?.length > 0) {
                    setLinkedComponentData(DataItem);
                }
            }
            if (Type === "Component") {
                if (DataItem?.length > 0) {
                    setSmartComponentData(DataItem);
                }
            }
            setIsPortfolio(false);
        }
    }, [])
    const Call = (propsItems: any, type: any) => {
        setIsPortfolio(false);
        if (type === "Service") {
            if (propsItems?.smartService?.length > 0) {
                setLinkedComponentData(propsItems.smartService);
            }
        }
        if (type === "Component") {
            if (propsItems?.smartComponent?.length > 0) {
                setSmartComponentData(propsItems.smartComponent);
            }
        }

    };
    const unTagService = (array: any, index: any) => {
        array.splice(index, 1);
        setLinkedComponentData(array)
        setIsComponent(!IsComponent);
    }
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
        } else if (type == "Service") {
            item.smartComponent = [];
            if (item.smartComponent != undefined) {
                linkedComponentData?.map((com: any) => {
                    item.smartComponent.push({ Title: com?.Title, Id: com?.Id });
                });
            }
        }

        portfolioType = type;
        setIsPortfolio(true);
        setShareWebComponent(item);
    };
    const EditPortfolio1 = (item: any, type: any) => {
        if (type == 'Component') {
            item.smartComponent = [];
            if (item.smartComponent != undefined) {
                smartComponentData?.map((com: any) => {
                    item.smartComponent.push({ 'Title': com?.Title, 'Id': com?.Id });
                })
            }

        } else if (type == 'Service') {
            item.smartService = [];
            if (item.smartService != undefined) {
                linkedComponentData?.map((com: any) => {
                    item.smartService.push({ 'Title': com?.Title, 'Id': com?.Id });
                })
            }

        }
        portfolioType = type
        setIsPortfolio(true);
        setShareWebComponent(item);
    }

    return (
        <>
            <button type="button" className='btn btn-primary mb-2' onClick={() => OpenCreateTaskPopup()}>Create Project</button>

            <Panel
                headerText={`Create Project`}
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
                                    Component Portfolio
                                </label>
                                <input type="text"
                                    readOnly className="form-control" />
                                <span className="input-group-text">
                                    <svg onClick={(e) => EditPortfolio(save, 'Component')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                    </svg>
                                </span>
                            </div>
                            {smartComponentData?.length > 0 ?
                                <span className='full-width'>
                                    {
                                        smartComponentData?.map((com: any, index: any) => {
                                            return (
                                                <>
                                                    <span className="Component-container-edit-task block d-flex justify-content-between" >
                                                        <a style={{ color: "#fff !important" }} target="_blank" href={`${props?.AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
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


                        <div className="col-sm-12 full-width input-group">
                            <div className="input-group full-width">
                                <label className="form-label full-width">
                                    Service Portfolio
                                </label>
                                <input type="text" readOnly
                                    className="form-control" />
                                <span className="input-group-text">
                                    <svg onClick={(e) => EditPortfolio(save, 'Service')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">

                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" />
                                    </svg>
                                </span>
                            </div>
                            {
                                linkedComponentData?.length > 0 ?
                                    <div className="full-width serviepannelgreena">
                                        {linkedComponentData?.map((com: any, index: any) => {
                                            return (
                                                <>
                                                    <span className="Component-container-edit-task block d-flex justify-content-between " >

                                                        <a className="hreflink " target="_blank" href={`${props?.AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>
                                                            {com.Title}
                                                        </a>
                                                        <span style={{ marginLeft: "6px" }} onClick={() => unTagService(linkedComponentData, index)} className="bg-light svg__icon--cross svg__iconbox"></span>

                                                    </span>
                                                </>
                                            )
                                        })}
                                    </div> : ""
                            }

                        </div>
                    </div>
                </div>
                <footer className='text-end'>
                <Button type="button" className="btn btn-default" variant="secondary" onClick={() => closePopup()}>Cancel</Button>
                    <Button type="button" variant="primary" className='ms-1' onClick={() => addFunction()}>Create</Button>
                   

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