import * as React from 'react'
import { Web } from 'sp-pnp-js'
import Tooltip from './Tooltip'
import { Panel, PanelType } from '@fluentui/react'
import * as globalcommon from './globalCommon'
import ServiceComponentPortfolioPopup from './EditTaskPopup/ServiceComponentPortfolioPopup'
var countFor = 1
var isCompleted = false
let TaskstoAddOrUpdate: any = []
let allSites: any = []
let listId: any
var AllListId: any = {}
let groupedComponentData: any = [];
const AllComponentsData: any = { StructuredData: [], OriginalLoadedData: [], ServiceStructuredData: [], EventStructuredData: [] };
export default function CallNotes({ callback }: any) {
    const [IsOpenPortfolio, setIsOpenPortfolio] = React.useState(false);
    const [ShareWebComponent, setShareWebComponent] = React.useState('');
    const [masterTasks, setMasterTasks] = React.useState<any>([])
    const [smartComponentData, setSmartComponentData] = React.useState([]);
    const [smartMetaData, setSmartMetaData] = React.useState<any>([])
    const [panel, setPanel] = React.useState<any>(false)
    const [SearchedServiceCompnentKey, setSearchedServiceCompnentKey] = React.useState<any>('');
    const [SearchedServiceCompnentData, setSearchedServiceCompnentData] = React.useState<any>([]);
    const [header, setHeader] = React.useState('')
    const [data, setData] = React.useState<any>({ Title: '', URL: '', ShortDescriptionOn: '', Site: '', count: countFor, saveItem: false, IsUpdateItemId: undefined, IsUpdatelistId: undefined, IsUpdatesiteUrl: undefined, IsUpdatemetadatainfo: undefined })
    // const [otherTasks, setOtherTasks] = React.useState<any>([])

    const closePanel = () => {
        callback();
    }

    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP')

    React.useEffect(() => {
        AllListId = {
            siteUrl: 'https://hhhhteams.sharepoint.com/sites/HHHH/SP',
            MasterTaskListID: 'ec34b38f-0669-480a-910c-f84e92e58adf',
            TaskUsertListID: 'b318ba84-e21d-4876-8851-88b94b9dc300',
            SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a',
            SmartInformationListID: 'edf0a6fb-f80e-4772-ab1e-666af03f7ccd',
            DocumentsListID: 'd0f88b8f-d96d-4e12-b612-2706ba40fb08',
            TaskTimeSheetListID: '464fb776-e4b3-404c-8261-7d3c50ff343f',
            AdminConfigrationListID: 'e968902a-3021-4af2-a30a-174ea95cf8fa',
            TimeEntry: false,
            SiteCompostion: false,
        }
    }, [])

    const handlePortfolioChange = (e: any) => {
        const selectedPortfolioId = parseInt(e.target.value);
        let selectedPortfolio: any
        masterTasks.forEach((task: any) => {
            if (task.Id == selectedPortfolioId) {
                selectedPortfolio = task;
            }
        });

        if (selectedPortfolio) {
            setData({ ...data, PortfolioId: selectedPortfolioId });
        }
    }
    const handleFirstTitle = (e: any) => {
        let saveVal = data;
        saveVal.Title = e.target.value;
        setData((prev: any) => saveVal);
    }
    const autoSuggestionsForServiceAndComponent = (e: any) => {
        let SearchedKeyWord: any = e.target.value;
        let TempArray: any = [];
        if (SearchedKeyWord.length > 0) {
            if (masterTasks != undefined && masterTasks?.length > 0) {
                masterTasks.map((AllDataItem: any) => {
                    if ((AllDataItem.Path?.toLowerCase())?.includes(SearchedKeyWord.toLowerCase())) {
                        TempArray.push(AllDataItem);
                    }
                })
            }
            if (TempArray != undefined && TempArray.length > 0) {
                setSearchedServiceCompnentData(TempArray);
                setSearchedServiceCompnentKey(SearchedKeyWord);
            }
        } else {
            setSearchedServiceCompnentData([]);
            setSearchedServiceCompnentKey("");
        }
    }
    const handleSiteChange = (e: any) => {
        let saveVal = data;
        saveVal.Site = e.target.value;
        setData((prev: any) => saveVal);
    }

    const loadComponents = async () => {
        let PropsObject: any = {
            MasterTaskListID: 'ec34b38f-0669-480a-910c-f84e92e58adf',
            siteUrl: 'https://hhhhteams.sharepoint.com/sites/HHHH/SP',
            TaskUserListId: 'b318ba84-e21d-4876-8851-88b94b9dc300',
        }
        let componentDetails: any = [];
        let results = await globalcommon.GetServiceAndComponentAllData(PropsObject)
        if (results?.AllData?.length > 0) {
            componentDetails = results?.AllData;
            groupedComponentData = results?.GroupByData;
        }
        setMasterTasks(componentDetails);
    }

    React.useEffect(() => {
        loadComponents();
    }, [])

    const loadSmartMetaData = () => {
        web.lists.getById('01a34938-8c7e-4ea6-a003-cee649e8c67a').items.select('Id,Title,listId,TaxType,siteName,siteUrl,Parent/Id,Parent/Title').filter("TaxType eq 'Sites'").expand('Parent').top(4999).get().then((data: any) => {
            setSmartMetaData(data)
        }).catch((error: any) => {
            console.log(error)
        })
    }

    React.useEffect(() => {
        loadSmartMetaData();
    }, [])
    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
        // let saveItem = save;
        if (functionType == "Close") {
            setIsOpenPortfolio(false)
        } else {
            if (DataItem != undefined && DataItem.length > 0) {
                setData({ ...data, PortfolioId: DataItem[0]?.Id })
                setSmartComponentData(DataItem);
                setSearchedServiceCompnentData([]);
                setSearchedServiceCompnentKey('');
                // selectPortfolioType('Component');
                console.log("Popup component component ", DataItem)
            }
            setIsOpenPortfolio(false)
        }
        // setSave(saveItem);
    }, [])

    const addNewTextField = (itm: any) => {
        let feedbackDetails: any = []
        let firstTask: any = []
        const newTask: any = { Title: '', URL: '', ShortDescriptionOn: '', Site: '', count: countFor, saveItem: false, IsUpdateItemId: undefined, IsUpdatelistId: undefined, IsUpdatesiteUrl: undefined, IsUpdatemetadatainfo: undefined }
        firstTask.push(itm)
        listId = itm.Site
        firstTask.map((i: any, index: any) => {
            if (i.count == countFor && i.saveItem == false) {
                if (!firstTask[index].Title || !firstTask[index].Site) {
                    alert("Enter Task Name and Select Site");
                }
                else {
                    countFor++;
                    TaskstoAddOrUpdate.push(newTask)
                    if (i.saveItem == false) {
                        addTasksFromFeedBack(i);
                    }
                }
            }
            else {
                if (i.saveItem == true) {
                    var date = new Date();
                    let addDescription: any = []
                    var obj = { Title: '' }
                    var param = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
                    i.ShortDescription = i.ShortDescriptionOn.replace(/\n/gi, "<br/>");
                    obj.Title = '<div><p>' + i.ShortDescriptionOn + '</p></div>';
                    var FeedBackItem: any = {};
                    FeedBackItem.Title = "FeedBackPicture" + param;
                    FeedBackItem.FeedBackDescriptions = addDescription;
                    FeedBackItem.ImageDate = param;
                    FeedBackItem.Completed = isCompleted;
                    feedbackDetails.push(FeedBackItem);
                    let portfolioID = i.PortfolioId
                    const updateValue = {
                        Body: '<div><p>' + i.ShortDescriptionOn + '</p></div>',
                        Title: i.Title,
                        Categories: 'Draft',
                        ComponentLink: {
                            Description: i.URL != undefined ? i.URL : null,
                            Url: i.URL != undefined ? i.URL : null
                        },
                        component_x0020_link:
                        {
                            Description: i.URL != undefined ? i.URL : null,
                            Url: i.URL != undefined ? i.URL : null
                        },
                        FeedBack: JSON.stringify(feedbackDetails),
                        PortfolioId: portfolioID,
                        SharewebCategoriesId: { results: [286] },
                        TaskCategoriesId: { results: [286] },
                        TaskTypeId: 2,
                    };

                    web.lists.getById(i.IsUpdatelistId).items.getById(i.IsUpdateItemId).update(updateValue).then((response: any) => {
                    }).catch((error: any) => {
                        console.log('Error Updating task:', error);
                    });
                }
            }
        })
    }

    const addTasksFromFeedBack = (val: any) => {
        let feedbackDetails: any = []
        let existingTask: any = []
        existingTask.push(val)
        listId = val.Site
        existingTask.map((values: any) => {
            if (values.saveItem == false) {
                if (values.Site == undefined && values.Site == '') {
                    alert('Select Site')
                    var date = new Date();
                    let addDescription: any = []
                    var obj = { Title: '' }
                    var param = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
                    values.ShortDescription = values.ShortDescriptionOn.replace(/\n/gi, "<br/>");
                    obj.Title = '<div><p>' + values.ShortDescriptionOn + '</p></div>';
                    var FeedBackItem: any = {};
                    FeedBackItem['Title'] = "FeedBackPicture" + param;
                    FeedBackItem['FeedBackDescriptions'] = addDescription;
                    FeedBackItem['ImageDate'] = param;
                    FeedBackItem['Completed'] = isCompleted;
                    feedbackDetails.push(FeedBackItem);
                    let portfolioID = values.PortfolioId
                    const addValue = {
                        Body: '<div><p>' + values.ShortDescriptionOn + '</p></div>',
                        Title: values.Title,
                        Categories: 'Draft',
                        ComponentLink: {
                            'Description': values.URL != undefined ? values.URL : null,
                            'Url': values.URL != undefined ? values.URL : null
                        },
                        component_x0020_link:
                        {
                            'Description': values.URL != undefined ? values.URL : null,
                            'Url': values.URL != undefined ? values.URL : null
                        },
                        FeedBack: JSON.stringify(feedbackDetails),
                        PortfolioId: portfolioID,
                        SharewebCategoriesId: { results: [286] },
                        TaskCategoriesId: { results: [286] },
                        TaskTypeId: 2,
                    };

                    web.lists.getById(listId).items.add(addValue).then((response: any) => {
                        alert('Task Added Successfully');
                        values.saveItem = true;
                        values.IsUpdateItemId = response.data.Id;
                        values.IsUpdatelistId = listId
                        values.IsUpdatesiteUrl = AllListId?.siteUrl;
                    }).catch((error: any) => {
                        console.log('Error adding task:', error);
                    });
                }
            }
        })
    }

    const addOrUpdateMultipleTasks = () => {
        let feedbackDetails: any = [];
        let allCreatedTasks: any = []
        allCreatedTasks.push(data)
        listId = data.Site
        allCreatedTasks.map((task: any) => {
            if (!task.Title || task.Title.trim() === '' || !task.Site || task.Site.trim() === '') {
                alert('Task is missing Title or Site. Please fill in all required fields.');
            } else {
                var date = new Date();
                let addDescription: any = [];
                var obj = { Title: '' };
                var param = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
                task.ShortDescription = task.ShortDescriptionOn.replace(/\n/gi, "<br/>");
                obj.Title = '<div><p>' + task.ShortDescriptionOn + '</p></div>';
                var FeedBackItem: any = {};
                FeedBackItem['Title'] = "FeedBackPicture" + param;
                FeedBackItem['FeedBackDescriptions'] = addDescription;
                FeedBackItem['ImageDate'] = param;
                FeedBackItem['Completed'] = isCompleted;
                feedbackDetails.push(FeedBackItem);
                let portfolioID = task.PortfolioId;

                if (task.saveItem == true) {
                    const updateValue = {
                        Body: '<div><p>' + task.ShortDescriptionOn + '</p></div>',
                        Title: task.Title,
                        Categories: 'Draft',
                        ComponentLink: {
                            'Description': task.URL != undefined ? task.URL : null,
                            'Url': task.URL != undefined ? task.URL : null,
                        },
                        component_x0020_link: {
                            'Description': task.URL != undefined ? task.URL : null,
                            'Url': task.URL != undefined ? task.URL : null,
                        },
                        FeedBack: JSON.stringify(feedbackDetails),
                        PortfolioId: portfolioID,
                        SharewebCategoriesId: { results: [286] },
                        TaskCategoriesId: { results: [286] },
                        TaskTypeId: 2,
                    };
                    web.lists.getById(listId)
                        .items.getById(task.IsUpdateItemId)
                        .update(updateValue)
                        .then((response: any) => {
                            alert('Task Updated Successfully');
                        })
                        .catch((error: any) => {
                            console.log('Error Updating task:', error);
                        });

                } else {
                    const addValue = {
                        Body: '<div><p>' + task.ShortDescriptionOn + '</p></div>',
                        Title: task.Title,
                        Categories: 'Draft',
                        ComponentLink: {
                            'Description': task.URL != undefined ? task.URL : null,
                            'Url': task.URL != undefined ? task.URL : null,
                        },
                        component_x0020_link: {
                            'Description': task.URL != undefined ? task.URL : null,
                            'Url': task.URL != undefined ? task.URL : null,
                        },
                        FeedBack: JSON.stringify(feedbackDetails),
                        PortfolioId: portfolioID,
                        SharewebCategoriesId: { results: [286] },
                        TaskCategoriesId: { results: [286] },
                        TaskTypeId: 2,
                    };
                    web.lists.getById(listId)
                        .items.add(addValue)
                        .then((response: any) => {
                            task.saveItem = true;
                            task.IsUpdateItemId = response.data.Id;
                            task.IsUpdatelistId = listId
                            task.IsUpdatesiteUrl = AllListId?.siteUrl;
                            isCompleted = true
                            closePanel(); resetForm();
                        })
                        .catch((error: any) => {
                            console.log('Error Creating task:', error);
                        });
                }
            }
        });
    };

    const resetForm = () => {
        TaskstoAddOrUpdate = []
        setData({ Title: '', URL: '', ShortDescriptionOn: '', Site: '', count: countFor, saveItem: false });
        countFor = 1
    };
    // const EditPortfolio = (item: any, Type: any) => {
    //     setIsOpenPortfolio(true);
    //     setShareWebComponent(item);
    // }
    const onRenderCustomHeader = (
    ) => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span className="siteColor">
                        {`Create Call Notes`}
                    </span>
                </div>
                <Tooltip ComponentId="1138" />
            </div>
        );
    };
    return (
        <>
            <Panel type={PanelType.medium}
                isOpen={true}
                onDismiss={() => { closePanel(); resetForm(); }}
                onRenderHeader={onRenderCustomHeader}
                closeButtonAriaLabel='Close'
            >
                <form action=''>
                    <div className='row'>
                        <div className='col'>
                            <div className='input-group mb-1'>
                                <label className='full-width'>Task Name </label>
                                <input className='form-control' type='text' placeholder='Enter Task Name' onChange={e => handleFirstTitle(e)} />
                            </div>
                        </div>
                        <div className='col'>
                            <div className="input-group autosuggest-container">
                                <label className="full-width">Portfolio Item</label>
                                {smartComponentData?.length > 0 ? null :
                                    <><div className='input-group'>
                                        <input type="text" onChange={(e) => autoSuggestionsForServiceAndComponent(e)}
                                            className="form-control"
                                            id="{{PortfoliosID}}" autoComplete="off"
                                        /></div>
                                    </>
                                }{SearchedServiceCompnentData?.length > 0 ? (

                                    <ul className="autosuggest-list maXh-200 scrollbar">
                                        {SearchedServiceCompnentData.map((Item: any) => {
                                            return (
                                                <li key={Item.id} onClick={() => ComponentServicePopupCallBack([Item], undefined, undefined)} >
                                                    <a>{Item.Path}</a>
                                                </li>
                                            )
                                        }
                                        )}
                                    </ul>) : null}
                                {smartComponentData?.length > 0 ? smartComponentData?.map((com: any) => {
                                    return (
                                        <>
                                            <div className="block d-flex justify-content-between pt-1 px-2" style={{ width: "100%" }}>
                                                <a style={{ color: "#fff !important" }} data-interception="off" target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                                                <a>
                                                    <span title="Remove Component" onClick={() => { setSmartComponentData([]), setData({ ...data, PortfolioId: null }); }}
                                                        style={{ backgroundColor: 'white' }} className="svg__iconbox svg__icon--cross hreflink mx-2"></span>
                                                </a>
                                            </div>
                                        </>
                                    )
                                }) : null}
                                {/* <span className="input-group-text">
                                    <span onClick={(e) => EditPortfolio(data, 'Component')} style={{ backgroundColor: 'white' }} className="svg__iconbox svg__icon--edit"></span>
                                    <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                        onClick={(e) => EditComponent(save, 'Component')} />
                                </span> */}
                            </div>
                        </div>
                        <div className='col'>
                            <div className='input-group mb-1'>
                                <label className='full-width'>Site</label>
                                <select className='form-control' placeholder='Select Site' onChange={(e) => { handleSiteChange(e) }}>
                                    <option value=''>Select Site</option>
                                    {smartMetaData.map((site: any, index: any) => (
                                        <option key={index} value={site?.listId}>
                                            {site?.Title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div>
                            <div className='input-group mb-1'>
                                <label className='full-width'>Url </label>
                                <input className='form-control' type='text' placeholder='Enter Url' onChange={e => setData({ ...data, URL: e.target.value })} />
                            </div>
                            <div className='input-group mb-1'>
                                <label className='full-width'>Description </label>
                                <textarea className='form-control' onChange={e => setData({ ...data, ShortDescriptionOn: e.target.value })} />
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                    {TaskstoAddOrUpdate.map((index: any) => (
                        <form action='' key={index}>
                            <div className='row'>
                                <div className='col'>
                                    <div className='input-group mb-1'>
                                        <label className='full-width'>Task Name </label>
                                        <input className='form-control' type='text' placeholder='Enter Task Name' onChange={e => setData({ ...data, Title: e.target.value })} />
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='input-group mb-1'>
                                        <label className='full-width'>Portfolio Item</label>
                                        <select className='form-control' placeholder='Select Portfolio' onChange={handlePortfolioChange}>
                                            <option value=''>Select Portfolio</option>
                                            {AllComponentsData?.StructuredData.map((task: any) => (
                                                <option key={task.Id} value={task.Id}>
                                                    {task.Title}
                                                </option>
                                            ))}
                                        </select>
                                        {/* <span className="input-group-text" title="Status Popup"><span title="Edit Task" className="svg__iconbox svg__icon--editBox"></span></span> */}
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='input-group mb-1'>
                                        <label className='full-width'>Site</label>
                                        <select className='form-control' placeholder='Select Site' onChange={handleSiteChange}>
                                            <option value=''>Select Site</option>
                                            {allSites.map((site: any, index: any) => (
                                                <option key={index} value={site.listId}>
                                                    {site.Title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>

                                <div>
                                    <div className='input-group mb-1'>
                                        <label className='full-width'>Url </label>
                                        <input className='form-control' type='text' placeholder='Enter Url' onChange={e => setData({ ...data, URL: e.target.value })} />
                                    </div>
                                    <div className='input-group mb-1'>
                                        <label className='full-width'>Description </label>
                                        <textarea className='form-control' onChange={e => setData({ ...data, ShortDescriptionOn: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                </div>
                            </div>
                        </form>
                    ))}
                </form>
                <div className='text-end mt-2'>
                    <button className='btn btnCol btn-primary pull-left' disabled={true} onClick={() => { addNewTextField(data) }}>
                        Add More Items
                    </button>
                    <button className='me-2 btn btnCol btn-primary' onClick={() => { addOrUpdateMultipleTasks(); }}>
                        Save
                    </button>
                    <button className='btn btn-default' onClick={() => { closePanel(); resetForm(); }}>
                        Cancel
                    </button>
                </div>
            </Panel>
            {IsOpenPortfolio &&
                <ServiceComponentPortfolioPopup
                    props={ShareWebComponent}
                    Dynamic={AllListId}
                    Call={ComponentServicePopupCallBack}
                    groupedData={groupedComponentData}
                />
            }
        </>
    )

}