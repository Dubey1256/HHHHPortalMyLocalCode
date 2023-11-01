import * as React from 'react'
import { Web } from 'sp-pnp-js'
import { Panel, PanelType } from '@fluentui/react'
import * as globalcommon from './globalCommon'
import { myContextValue } from './globalCommon'
var MyContextdata: any
var backupInputData: any = [];
var AllListId: any = {}
let groupedComponentData: any = [];
const CallNotes = (props: any) => {
    MyContextdata = React.useContext(myContextValue)
    const [IsOpenPortfolio, setIsOpenPortfolio] = React.useState(false);
    const [ShareWebComponent, setShareWebComponent] = React.useState('');
    const [masterTasks, setMasterTasks] = React.useState<any>([])
    const [SearchedServiceCompnentKey, setSearchedServiceCompnentKey] = React.useState<any>('');
    const [SearchedServiceCompnentData, setSearchedServiceCompnentData] = React.useState<any>([]);
    let [inputData, setInputData] = React.useState<any>([{ Title: '', PortfolioId: null, Portfolio: [], URL: '', SearchedComps: [], searchText: '', ShortDescriptionOn: '', Site: '', saveItem: false, IsUpdateItemId: undefined, IsUpdatelistId: undefined, IsUpdatesiteUrl: undefined }])
    const [siteData, setSiteData] = React.useState([])

    const closePanel = () => {
        MyContextdata.createNotesCallback()
        resetForm()
    }

    const autoSuggestionsForServiceAndComponent = (e: any, index: any) => {
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
        let updatedInputData: any = [...inputData]
        updatedInputData[index].SearchedComps = [...TempArray]
        updatedInputData[index].searchText = SearchedKeyWord
        setInputData(updatedInputData)
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
        loadComponents();
    }, [])

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



    const loadSmartMetaData = () => {
        web.lists.getById("01a34938-8c7e-4ea6-a003-cee649e8c67a").items.select('Id,Title,Configurations,listId,TaxType,siteName,siteUrl,Parent/Id,Parent/Title').expand('Parent').top(4999).get().then((item: any) => {
            let allSites: any = item.filter((smartdata: any) => {
                return smartdata.TaxType == 'Sites' && smartdata?.listId != undefined
            })
            allSites.map((site: any) => {
                site.ConfigurationDetails = JSON.parse(site.Configurations)
            })
            setSiteData(allSites)
        }).catch((error: any) => {
            console.log(error)
        })
    }

    React.useEffect(() => {
        loadSmartMetaData();
    }, [])

    const ComponentServicePopupCallBack = React.useCallback((DataItem: any, dataArray: any, functionType: any, index: any) => {
        let allTasks = backupInputData;
        // let saveItem = save;
        if (functionType == "Close") {
            setIsOpenPortfolio(false)
        } else {
            if (DataItem != undefined && DataItem.length > 0) {
                allTasks[index].Portfolio = [...DataItem]
                allTasks[index].PortfolioId = DataItem[0]?.Id
                allTasks[index].SearchedComps = [];
                allTasks[index].searchText = ''
                backupInputData = allTasks;
                setInputData(allTasks)
                // selectPortfolioType('Component');
                console.log("Popup component component ", DataItem)
            }
            setIsOpenPortfolio(false)
        }
        // setSave(saveItem);
    }, [])

    const addNewTextField = () => {
        let updatedData: any = [...inputData]
        let lastItem = updatedData[inputData?.length - 1];
        if (lastItem?.Title == '') {
            alert('Please Enter Title')
        } else if (lastItem?.listId == '') {
            alert('Please select Site')
        } else {
            const addValue = {
                Body: '<div><p>' + lastItem.ShortDescriptionOn + '</p></div>',
                Title: lastItem.Title,
                Categories: 'Draft',
                ComponentLink: {
                    'Description': lastItem.URL != undefined ? lastItem.URL : null,
                    'Url': lastItem.URL != undefined ? lastItem.URL : null,
                },
                FeedBack: JSON.stringify(lastItem?.FeedBack),
                PortfolioId: lastItem?.PortfolioId,
                TaskCategoriesId: { results: [286] },
                TaskTypeId: 2,
            };
            web.lists.getById(lastItem?.listId)
                .items.add(addValue)
                .then((response: any) => {
                    console.log('Task created Successfully');
                    lastItem.taskCreated = true;
                    lastItem.taskId = response.data.Id;
                    updatedData[inputData?.length - 1] = lastItem;
                    updatedData.push({
                        Title: '',
                        PortfolioId: null,
                        Portfolio: [],
                        searchText: '',
                        URL: '',
                        ShortDescriptionOn: '',
                        SearchedComps: [],
                        Site: '',
                        taskCreated: false,
                        listId: undefined,
                        siteUrl: undefined,
                        FeedBack: []
                    })
                    setInputData((prevInput: any) => updatedData);

                })
                .catch((error: any) => {
                    console.log('Error adding task:', error);
                });

        }
    }
    const selectTaskSite = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        let selectedSite = siteData?.filter((site: any) => site?.Title == event.target.value)
        if (selectedSite?.length > 0) {
            let input: any = [...inputData];
            input[index]['Site'] = event.target.value;
            input[index]['listId'] = selectedSite[0]?.listId;
            input[index]['siteUrl'] = selectedSite[0]?.siteUrl?.Url;
            setInputData(input);
            backupInputData = input;
        }
    }
    const changeTaskUrl = (Url: any, index: any) => {
        let input: any = [...inputData];
        input[index]['URL'] = Url;
        backupInputData = input;
        setInputData(input);
    }
    const changeTaskDescription = (Desc: any, index: any) => {
        let input: any = [...inputData];
        let feedback = [{ "Title": "FeedBackPicture16019", "FeedBackDescriptions": [{ "Title": Desc, "Completed": false, "isShowComment": true, "Id": "11185" }], "ImageDate": "16019" }]
        input[index]['ShortDescription'] = Desc;
        input[index]['FeedBack'] = feedback;
        backupInputData = input;
        setInputData(input);
    }


    const addOrUpdateMultipleTasks = () => {
        inputData.map((task: any) => {

            const addValue = {
                Body: '<div><p>' + task.ShortDescription + '</p></div>',
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
                FeedBack: JSON.stringify(task?.FeedBack),
                PortfolioId: task?.PortfolioId,
                SharewebCategoriesId: { results: [286] },
                TaskCategoriesId: { results: [286] },
                TaskTypeId: 2,
            };
            if (task.taskCreated == true) {

                web.lists.getById(task.listId)
                    .items.getById(task.taskId)
                    .update(addValue)
                    .then((response: any) => {
                        console.log('Task Updated Successfully');
                    })
                    .catch((error: any) => {
                        console.log('Error Updating task:', error);
                    });

            } else {
                web.lists.getById(task.listId)
                    .items.add(addValue)
                    .then((response: any) => {
                        console.log('Task Added Successfully');
                        task.taskCreated = true;
                        task.taskId = response.data.Id;
                        closePanel()
                    })
                    .catch((error: any) => {
                        console.log('Error adding task:', error);
                    });
            }

        });
    };

    const resetForm = () => {
        setInputData([{ Title: '', Portfolio: null, searchText: '', SearchedComps: null, URL: '', ShortDescriptionOn: '', Site: '', saveItem: false }]);

    };

    const setTaskTitle = (value: any, index: any) => {
        let input: any = [...inputData]
        input[index]['Title'] = value
        backupInputData = input;
        setInputData(input)
    }

    const EditPortfolio = (item: any, Type: any) => {
        setIsOpenPortfolio(true);
        setShareWebComponent(item);
    }

    const removePortfolioAndActivateInput = (index: any) => {
        let input: any = [...inputData]
        input[index]['Portfolio'] = [];
        input[index]['PortfolioId'] = null;
        backupInputData = input;
        setInputData(input)
    };


    const onRenderCustomHeader = (
    ) => {
        return (
            <div className="d-flex full-width pb-1" >
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <span className="siteColor">
                        {`Create Call Notes`}
                    </span>
                </div>
                {/* <Tooltip ComponentId="1138" /> */}
            </div>
        );
    };

    return (
        <>
            <Panel type={PanelType.medium}
                isOpen={true}
                onDismiss={() => { closePanel() }}
                onRenderHeader={onRenderCustomHeader}
                closeButtonAriaLabel='Close'
            >
                {inputData.map((items: any, index: any) => {
                    return (
                        <form action=''>
                            <div className='row'>
                                <div className='col'>
                                    <div className='input-group mb-1'>
                                        <label className='full-width'>Task Name </label>
                                        <input className='form-control' type='text' placeholder='Enter Task Name' value={items?.Title} onChange={e => setTaskTitle(e.target.value, index)} />
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className="input-group autosuggest-container">
                                        <label className="full-width">Portfolio Item</label>
                                        {items?.Portfolio?.length > 0 ? null :
                                            <><div className='input-group'>
                                                <input type="text" key={index} onChange={(e) => autoSuggestionsForServiceAndComponent(e, index)}
                                                    className="form-control"
                                                    id="{{PortfoliosID}}" autoComplete="off"
                                                /></div>
                                            </>
                                        }{items?.Portfolio?.length == 0 && items?.SearchedComps.length > 0 ? (
                                            <ul className="autosuggest-list maXh-200 scrollbar">
                                                {items?.SearchedComps.map((Item: any) => {
                                                    return (
                                                        <li key={Item.id} onClick={() => ComponentServicePopupCallBack([Item], inputData, undefined, index)} >
                                                            <a>{Item.Path}</a>
                                                        </li>
                                                    )
                                                }
                                                )}
                                            </ul>) : null}
                                        {items?.Portfolio?.length > 0 ? (
                                            <>
                                                <div className="block d-flex justify-content-between pt-1 px-2" style={{ width: "95%" }}>
                                                    <a style={{ color: "#fff !important" }} data-interception="off" target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${items.Portfolio[0]?.ID}`}>{items.Portfolio[0]?.Title}</a>
                                                    <a>
                                                        <span title="Remove Component" onClick={() => { removePortfolioAndActivateInput(index); }}
                                                            style={{ backgroundColor: 'white' }} className="svg__iconbox svg__icon--cross hreflink mx-2"></span>
                                                    </a>
                                                </div>
                                            </>
                                        ) : null}
                                        <span className="input-group-text">
                                            <span style={{ backgroundColor: 'white' }} className="svg__iconbox svg__icon--edit"></span>
                                            {/* <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                        onClick={(e) => EditComponent(save, 'Component')} /> */}
                                        </span>
                                    </div>
                                </div>
                                <div className='col'>
                                    <div className='input-group mb-1'>
                                        <label className='full-width'>Site</label>
                                        <select className='form-control' placeholder='Select Site' value={inputData[index]?.Site} onChange={e => selectTaskSite(e, index)} disabled={items.taskCreated == true}>
                                            <option value=''>Select Site</option>
                                            {siteData.length > 0 && siteData?.map((site: any, index: any) => (
                                                <option key={index} value={site?.Title}>
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
                                        <input className='form-control' type='text' placeholder='Enter Url' value={items?.URL} onChange={e => changeTaskUrl(e.target.value, index)} />
                                    </div>
                                    <div className='input-group mb-1'>
                                        <label className='full-width'>Description </label>
                                        <textarea className='form-control' value={items?.ShortDescription} onChange={e => changeTaskDescription(e.target.value, index)} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    )
                })}
                <div className='text-end mt-2'>
                    <button className='btn btnCol btn-primary pull-left' onClick={() => { addNewTextField(); }}>
                        Add More Items
                    </button>
                    <button className='me-2 btn btnCol btn-primary' onClick={() => { addOrUpdateMultipleTasks() }}>
                        Save
                    </button>
                    <button className='btn btn-default' onClick={() => { closePanel() }}>
                        Cancel
                    </button>
                </div>
            </Panel>
            {/* {IsOpenPortfolio &&
        <ServiceComponentPortfolioPopup
          props={ShareWebComponent}
          Dynamic={AllListId}
          Call={ComponentServicePopupCallBack}
          groupedData={groupedComponentData}
        />
      } */}
        </>
    )
}
export default CallNotes