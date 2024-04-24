import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import * as Moment from 'moment';
import ComponentPortPolioPopup from '../../EditPopupFiles/ComponentPortfolioSelection';
import Button from 'react-bootstrap/Button';
// import LinkedComponent from '../../../globalComponents/EditTaskPopup/LinkedComponent';
import PortfolioTagging from './PortfolioTagging';
import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
import * as globalCommon from "../../../globalComponents/globalCommon";
let portfolioType = '';
let AllListId: any = {};
let AllFlatProject: any = [];
let selectedProject: any = {};
const AddProject = (props: any) => {
    const [title, settitle] = React.useState('')
    const [lgShow, setLgShow] = useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [CMSToolComponent, setCMSToolComponent] = React.useState('');
    const [linkedComponentData, setLinkedComponentData] = React.useState([]);
    const [selectedItem, setSetSelectedItem]: any = React.useState(undefined);
    const [IsPortfolio, setIsPortfolio] = React.useState(false);
    const [save, setSave] = React.useState({ siteType: '', linkedServices: [], recentClick: undefined, Mileage: '', DueDate: undefined, dueDate: '', taskCategory: '', taskCategoryParent: '', rank: undefined, Time: '', taskName: '', taskUrl: undefined, portfolioType: 'Component', Component: [] })
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [projectData, setProjectData] = React.useState([]);
    const [searchedProjectKey, setSearchedProjectKey] = React.useState("");
    const OpenCreateTaskPopup = () => {
        setLgShow(true)
    }
    React.useEffect(() => {
        try {
            if (props?.items?.length == 1 && props?.items[0]?.original?.Item_x0020_Type == "Project") {
                setSetSelectedItem(props?.items[0]?.original)
                selectedProject = props?.items[0]?.original;
            } else if (props?.items?.Id != undefined && props?.items?.Item_x0020_Type == "Project") {
                setSetSelectedItem(props?.items)
                selectedProject = props?.items;
                props.items = [props?.items];
            } else if (props?.items?.length == 1 && props?.items[0]?.Item_x0020_Type == "Project") {
                setSetSelectedItem(props?.items[0])
                selectedProject = props?.items[0];
            } else if (props?.items?.length == 1 && props?.items[0][0]?.original?.Item_x0020_Type == "Project") {
                setSetSelectedItem(props?.items[0][0]?.original)
                selectedProject = props?.items[0][0]?.original;
            }
        } catch (e) {

        }
        GetMasterData();
    }, [props?.items?.length])
    const addFunction = async () => {
        if (title?.length > 0) {
            let selectedComponent: any[] = [];
            if (smartComponentData !== undefined && smartComponentData.length > 0) {
                $.each(smartComponentData, function (index: any, smart: any) {
                    selectedComponent.push(smart?.Id);
                })
            }
            let portfolioLevel = 1;
            let web = new Web(props?.AllListId?.siteUrl);
            if (props?.items?.length == 1 && selectedItem?.Id != undefined) {
                await web.lists.getById(props?.AllListId?.MasterTaskListID).items
                    .select("Id,Title,PortfolioLevel,PortfolioStructureID")
                    .filter(("Item_x0020_Type eq 'Sprint'") && ("Parent/Id eq '" + selectedItem?.Id + "'"))
                    .orderBy('PortfolioLevel', false)
                    .get().then(async (res: any) => {

                        if (res?.length > 0) {
                            portfolioLevel = res?.length + 1
                        }
                        let portfolioStructureId = ''
                        if (portfolioLevel >= 1) {
                            portfolioStructureId = `${selectedItem?.PortfolioStructureID}-X${portfolioLevel}`
                        }
                        await web.lists.getById(props?.AllListId?.MasterTaskListID).items.add({
                            Title: `${title}`,
                            Item_x0020_Type: "Sprint",
                            PortfolioLevel: portfolioLevel,
                            ParentId: selectedItem?.Id,
                            PortfoliosId: { "results": (selectedComponent !== undefined && selectedComponent?.length > 0) ? selectedComponent : [] },
                            PortfolioStructureID: portfolioStructureId,
                        }).then((res: any) => {
                            const newProjectId = res.data.Id;
                            let result: any = res.data;
                            try {
                                result.siteUrl = props?.AllListId?.siteUrl;
                                result["siteType"] = "Master Tasks";
                                result.AllTeamName = "";
                                result.portfolioItemsSearch = result?.Item_x0020_Type;
                                result.TeamLeaderUser = []
                                result.DisplayDueDate = Moment(result?.DueDate).format("DD/MM/YYYY");
                                result.DisplayCreateDate = Moment(result?.Created).format("DD/MM/YYYY");
                                result.DueDate = Moment(result?.DueDate).format('DD/MM/YYYY')
                                if (result.DueDate == 'Invalid date' || '') {
                                    result.DueDate = result?.DueDate?.replaceAll("Invalid date", "")
                                }
                                if (result.DisplayDueDate == "Invalid date" || "") {
                                    result.DisplayDueDate = result.DisplayDueDate.replaceAll(
                                        "Invalid date",
                                        ""
                                    );
                                }
                                if (result.DisplayCreateDate == "Invalid date" || "") {
                                    result.DisplayCreateDate = result.DisplayCreateDate.replaceAll(
                                        "Invalid date",
                                        ""
                                    );
                                }
                                if (result.PercentComplete != undefined)
                                    result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

                                if (result.Item_x0020_Type === "Project") {
                                    result.lableColor = "w-bg";
                                    result.ItemCat = "Project"
                                }
                                if (result.Item_x0020_Type === "Sprint") {
                                    result.ItemCat = "Project"
                                }
                                if (result?.Item_x0020_Type != undefined) {
                                    result.SiteIconTitle = result?.Item_x0020_Type?.charAt(0);
                                }

                                result.descriptionsSearch = '';

                                result.Id = result.Id != undefined ? result.Id : result.ID;
                                result["TaskID"] = result?.PortfolioStructureID;

                                if (result?.ClientCategory?.length > 0) {
                                    result.ClientCategorySearch = result?.ClientCategory?.map(
                                        (elem: any) => elem.Title
                                    ).join(" ");
                                } else {
                                    result.ClientCategorySearch = "";
                                }
                            } catch (e) {
                                console.log(e, 'Error Creating Data after Post')
                            }

                            if (props?.PageName == "ProjectOverview") {
                                window.open(`${props?.AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${newProjectId}`, "_blank");
                                props?.CallBack(result, "Save")
                            } else {
                                props?.CallBack(result, "Save")
                            }
                            closePopup()
                        })
                    })
            } else {
                await web.lists.getById(props?.AllListId?.MasterTaskListID).items
                    .select("Id,Title,PortfolioLevel,PortfolioStructureID").filter("Item_x0020_Type eq 'Project'")
                    .top(1).orderBy('PortfolioLevel', false)
                    .get().then(async (res: any) => {

                        if (res?.length > 0) {
                            portfolioLevel = res[0].PortfolioLevel + 1
                        }
                        let portfolioStructureId = ''
                        if (portfolioLevel >= 1 && portfolioLevel < 10) {
                            portfolioStructureId = `P00${portfolioLevel}`
                        } else if (portfolioLevel >= 10 && portfolioLevel < 100) {
                            portfolioStructureId = `P0${portfolioLevel}`
                        } else if (portfolioLevel >= 100) {
                            portfolioStructureId = `P${portfolioLevel}`
                        }

                        await web.lists.getById(props?.AllListId?.MasterTaskListID).items.add({
                            Title: `${title}`,
                            Item_x0020_Type: "Project",
                            PortfolioLevel: portfolioLevel,
                            PortfoliosId: { "results": (selectedComponent !== undefined && selectedComponent?.length > 0) ? selectedComponent : [] },
                            PortfolioStructureID: portfolioStructureId,
                        }).then((res: any) => {
                            const newProjectId = res.data.Id;
                            closePopup()
                            props?.CallBack(res.data, "Save")
                            window.open(`${props?.AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${newProjectId}`, "_blank");
                        })
                    })
            }

        } else {
            alert("Please Enter Project Title")
        }

    }
    const createItem = async (portfolioStructureId: any, selectedComponent: any, ItemType: any, portfolioLevel: any) => {
        let web = new Web(props?.AllListId?.siteUrl);
        await web.lists.getById(props?.AllListId?.MasterTaskListID).items.add({
            Title: `${title}`,
            Item_x0020_Type: ItemType,
            PortfolioLevel: portfolioLevel,
            PortfoliosId: { "results": (selectedComponent !== undefined && selectedComponent?.length > 0) ? selectedComponent : [] },
            PortfolioStructureID: portfolioStructureId,
        }).then((res: any) => {
            closePopup()
            props?.CallBack()

        })
    }
    const GetMasterData = async () => {
        let PropsObject: any = {
            MasterTaskListID: props?.AllListId.MasterTaskListID,
            siteUrl: props?.AllListId.siteUrl,
            TaskUserListId: props?.AllListId.TaskUsertListID,
        }
        let results = await globalCommon.GetServiceAndComponentAllData(PropsObject)
        if (results?.AllData?.length > 0) {
            AllFlatProject = results?.FlatProjectData
        }

    }
    const autoSuggestionsForProject = (e: any) => {
        let SearchedKeyWord: any = e.target.value;
        let TempArray: any = [];
        if (SearchedKeyWord.length > 0) {
            if (AllFlatProject != undefined && AllFlatProject?.length > 0) {
                AllFlatProject.map((AllDataItem: any) => {
                    if (AllDataItem?.Title?.toLowerCase()?.includes(SearchedKeyWord.toLowerCase())) {
                        TempArray.push(AllDataItem);
                    }
                });
            }
            if (TempArray != undefined && TempArray.length > 0) {
                setProjectData(TempArray);
                setSearchedProjectKey(SearchedKeyWord);
            }
            else {
                setProjectData([]);
            }

        } else {
            setProjectData([]);
            // setSearchedServiceCompnentKey("");
        }
        // let updatedInputData: any = [...backupInputData];
        // updatedInputData[index].SearchedComps = [...TempArray];
        // updatedInputData[index].searchText = SearchedKeyWord;
        // setInputData(updatedInputData);
    };

    const closePopup = () => {
        settitle('')
        setLinkedComponentData([])
        setSmartComponentData([])
        setProjectData([])
        setLgShow(false)
        props?.CallBack(undefined, "Save")

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
        setCMSToolComponent(item);
    };
    const onRenderCustomHeader = (
    ) => {
        return (
            <div className=" full-width pb-1" >
                {props?.items != undefined && props?.items?.length == 1 &&
                    <div>
                        <ul className="spfxbreadcrumb mb-2 ms-2 p-0">
                            <li><a data-interception="off" target="_blank" href={`${props?.AllListId?.siteUrl}/SitePages/PX-Overview.aspx`}>PX Management Overview</a></li>
                            <li>
                                {" "}
                                <a target='_blank' data-interception="off" href={`${props?.AllListId?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${selectedProject?.Id}`}>{selectedProject?.Title}</a>{" "}
                            </li>
                        </ul>
                    </div>
                }
                <div className="subheading">
                    <span className="siteColor">
                        {props?.items?.length == 1 ? 'Create Sprint' : 'Create Project'}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeader}
                type={PanelType.medium}
                isOpen={true}
                onDismiss={() => closePopup()}
                isBlocking={false}>

                <div className={IsComponent ? 'Create-Projectpoup border mb-2 mt-2 p-2' : 'Create-Projectpoup  border mb-2 mt-2 p-2'}>
                    <span >
                        <div>
                            <span>
                                <input type='text' className='form-control' placeholder='Enter Title' value={title} onChange={(e) => { settitle(e.target.value); autoSuggestionsForProject(e) }} />
                                {projectData?.length > 0 ? (
                                    <div>
                                        <ul className="list-group">
                                            {projectData?.map((Item: any) => {
                                                return (
                                                    <li
                                                        className="hreflink list-group-item rounded-0 list-group-item-action"
                                                        key={Item.id}
                                                        onClick={() => window.open(`${Item?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${Item?.Id}`, '_blank')}
                                                    >
                                                        <a>{Item.Title}</a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ) : null}
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
                    props={CMSToolComponent}
                    Dynamic={props?.AllListId}
                    ComponentType={portfolioType}
                    Call={ComponentServicePopupCallBack}
                    selectionType={"Multi"}
                ></ServiceComponentPortfolioPopup>
            )}
            {/* {IsPortfolio && <PortfolioTagging props={CMSToolComponent} AllListId={props?.AllListId} type={portfolioType} Call={Call}></PortfolioTagging>} */}
        </>
    )
}

export default AddProject