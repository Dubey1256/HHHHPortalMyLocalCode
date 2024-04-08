import React, { useState, useEffect, useMemo, useRef, useCallback, useContext } from 'react';
import { Web } from 'sp-pnp-js';
import { ColumnDef } from '@tanstack/react-table';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { Panel, PanelType } from 'office-ui-fabric-react';
import SmartMetadataEditPopup from "./SmartMetadataEditPopup";
import DeleteSmartMetadata from "./DeleteSmartMetadata";
import CreateMetadataItem from './CreateMetadataItem';
import CompareSmartMetaData from './CompareSmartmetadata';
import RestructureSmartMetaData from './RestructureSmartMetaData';
import { myContextValue } from '../../../globalComponents/globalCommon';
let SmartmetadataItems: any = [];
let TabSelected: string;
let compareSeletected: any = [];
let childRefdata: any;
let ParentMetaDataItems: any = [];
let TabsData: any = [];
let SelectedMetadataItem: any = [];
let CopySmartmetadata: any = []
let UrlTabName: any = ""
export default function ManageSmartMetadata(selectedProps: any) {
    const MyContextValue: any = useContext(myContextValue)
    const [SmartmetadataAdd, setSmartmetadataAdd] = useState(false);
    const [SmartmetadataCompare, setSmartmetadataCompare] = useState(false);
    const [SmartmetadataRestructure, setSmartmetadataRestructure] = useState(false);
    const [SmartmetadataCompareButton, setSmartmetadataCompareButton] = useState(false);
    const [SmartmetadataRestructureButton, setSmartmetadataRestructureButton] = useState(false);
    const [categoriesTabName, setCategoriesTabName]: any = useState([]);
    const [setName]: any = useState('');
    const [AllCombinedJSON, setAllCombinedJSON] = useState(JSON);
    const [isVisible, setIsVisible] = useState(false);
    const [Smartmetadata, setSmartmetadata]: any = useState([]);
    const [RestructureIcon, setRestructureIcon]: any = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [SmartMetadataEditPopupOpen, setSmartMetadataEditPopupOpen]: any = useState(false);
    const [SmartMetadataDeletePopupOpen, setSmartMetadataDeletePopupOpen]: any = useState(false);
    const [SelectedSmartMetadataItem, setSelectedSmartMetadataItem]: any = useState({});
    const [SelectedItem, setSelectedItem] = useState<any>({});
    const [smartMetadataCount, setSmartMetadataCount] = useState<any>()
    const [Tabs, setTabs] = useState([]);
    var [TabsFilter]: any = useState([]);
    const childRef = React.useRef<any>();
    if (childRef != null) {
        childRefdata = { ...childRef };

    }
    const params = new URLSearchParams(window.location.search);
    UrlTabName = params.get('TabName');
    console.log(params.get('TabName'));
    //...........................................................Start Filter SmartMetadata Items counts....................................................

    const getFilterMetadataItems = (Metadata: any) => {
        var Count: any = 0
        Metadata.filter((item: any) => {
            if (item?.flag === true) {
                Count++
            }
            if (item?.subRows?.length > 0) {
                item?.subRows.filter((child: any) => {
                    if (child?.flag === true) {
                        Count++
                    }
                    if (child?.subRows?.length > 0) {
                        child?.subRows.filter((subchild: any) => {
                            if (subchild?.flag === true) {
                                Count++
                            }
                            if (subchild?.subRows?.length > 0) {
                                subchild?.subRows.filter((subSubchild: any) => {
                                    if (subSubchild?.flag === true) {
                                        Count++
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        setSmartMetadataCount(Count);
    }
    //...........................................................End Filter SmartMetadata Items counts....................................................
    const GetAdminConfig = async () => {
        try {
            let web = new Web(selectedProps.AllList.SPSitesListUrl);
            const Config = await web.lists.getById(selectedProps.AllList.SPSiteConfigListID).items.select("ID,Title,OrderBy,WebpartId,DisplayColumns,Columns,QueryType,FilterItems&$filter=WebpartId eq 'AllManageSmartMetadataPortfolioTabs'").getAll();
            if (Config) {
                TabsData = JSON.parse(Config[0].DisplayColumns);
                setTabs(JSON.parse(Config[0].DisplayColumns));
                console.log(Tabs);
            }
            LoadSmartMetadata();
        } catch (error) {
            console.error(error);
        }
    };
    const LoadSmartMetadata = async () => {
        try {
            let web = new Web(selectedProps?.AllList?.SPSitesListUrl);
            const AllMetaDataItems = await web.lists.getById(selectedProps?.AllList?.SmartMetadataListID).items.select("*,Author/Title,Editor/Title,Parent/Id,Parent/Title&$expand=Parent,Author,Editor&$orderby=Title&$filter=isDeleted ne 1").getAll();
            SmartmetadataItems = SmartmetadataItems.concat(AllMetaDataItems)
            if (TabsData.length > 0) {
                TabsData.filter((item: any) => {
                    if (UrlTabName !== null) {
                        ShowingTabsData(UrlTabName)
                    } else {
                        ShowingTabsData("Categories");
                    }
                })
            }
        } catch (error) {
            console.error(error);
        }
    };
    const isItemExists = (arr: any, Id: any) => {
        var isExists = false;
        arr.forEach((item: any) => { if (item.Id == Id) { isExists = true; return false; } });
        return isExists;
    }
    const GroupByItems = function (item: any, AllMetaItems: any) {
        AllMetaItems.filter((child: any) => {
            child['flag'] = true;
            if (child?.ParentId === item?.Id) {
                if (item['subRows'] === undefined)
                    item['subRows'] = []
                if (!isItemExists(item['subRows'], child.Id)) {
                    item['subRows'].push(child)
                }
                GroupByItems(child, AllMetaItems);
            }
        });
    }
    const ShowingTabsData = async (Tab: any) => {
        TabsFilter = [];
        TabSelected = Tab;
        setCategoriesTabName({});
        if (ParentMetaDataItems.length > 0)
            ParentMetaDataItems = [];
        SmartmetadataItems?.filter((comp: any) => {
            if (comp?.TaxType === Tab && comp?.ParentID === 0) {
                comp['flag'] = true;
                ParentMetaDataItems.push(comp)
            }
        });
        ParentMetaDataItems.filter((item: any) => {
            GroupByItems(item, SmartmetadataItems);
        })
        ParentMetaDataItems.filter((item: any) => {
            if (item.TaxType && item.TaxType === Tab) {
                TabsFilter.push(item);
                getFilterMetadataItems(TabsFilter);
            }
        });
        if (TabSelected === 'Categories') {
            ShowingCategoriesTabsData(TabsFilter[0])
        } else {
            CopySmartmetadata = TabsFilter;
            setSmartmetadata(TabsFilter);
            childRefdata?.current?.setRowSelection({});
        }
    };
    const ShowingCategoriesTabsData = (tabData: any) => {
        TabsFilter = [];
        setCategoriesTabName(tabData);
        ParentMetaDataItems.filter((item: any) => {
            if (item.TaxType && item.Title === tabData.Title) {
                if (item?.subRows.length > 0) {
                    item?.subRows.filter((item2: any) => {
                        TabsFilter.push(item2);
                    });
                }
                getFilterMetadataItems(TabsFilter);
            }
        });
        CopySmartmetadata = TabsFilter;
        setSmartmetadata(TabsFilter);
        childRefdata?.current?.setRowSelection({});
    }
    const EditSmartMetadataPopup = (item: any) => {
        setSelectedSmartMetadataItem(item);
        setSmartMetadataEditPopupOpen(true);
    };
    const DeleteSmartMetadataOpenPopup = (item: any) => {
        setSelectedSmartMetadataItem(item);
        setSmartMetadataDeletePopupOpen(true);
    };
    useEffect(() => {
        GetAdminConfig();
    }, [0]);
    const columns = useMemo<ColumnDef<any, unknown>[]>(() => [
        {
            accessorKey: "",
            placeholder: "",
            hasCheckbox: true,
            hasCustomExpanded: true,
            hasExpanded: true,
            size: 10,
            id: 'Id',
        },
        {
            accessorKey: 'Title',
            placeholder: 'Title',
            header: '',
            id: 'Title',
            cell: ({ row }) => (
                <>
                    <div className='alignCenter'>
                        {row?.original?.Title != undefined &&
                            row?.original?.Title != null &&
                            row?.original?.Title != '' ? (
                            <a>
                                {row?.original?.Title}
                                {(row?.original?.Description1 !== null && row?.original?.Description1 !== undefined) && <div className='hover-text'>
                                    <span className="alignIcon svg__iconbox svg__icon--info"></span>
                                    <span className='tooltip-text pop-right'>{row?.original?.Description1} </span>
                                </div>}
                            </a>
                        ) : null}
                    </div>
                </>
            ),
        },
        {
            accessorKey: 'SmartFilters',
            placeholder: 'SmartFilters',
            id: 'SmartFilters',
            header: '',
            size: 400,
            cell: ({ row }) => (
                <>
                    <div className='alignCenter'>
                        {row?.original?.SmartFilters != undefined &&
                            row?.original?.SmartFilters != null &&
                            row?.original?.SmartFilters != '' ? (
                            <a>{row?.original?.SmartFilters}</a>
                        ) : null}
                    </div>
                </>
            ),
        },
        {
            accessorKey: 'Status',
            placeholder: 'Status',
            id: 'Status',
            header: '',
            size: 90,
            cell: ({ row }) => (
                <>
                    <div className='alignCenter'>
                        {row?.original?.Status != undefined &&
                            row?.original?.Status != null &&
                            row?.original?.Status != '' ? (
                            <a>{row?.original?.Status}</a>
                        ) : null}
                    </div>
                </>
            ),
        },
        {
            accessorKey: 'SortOrder',
            placeholder: 'SortOrder',
            id: 'SortOrder',
            header: '',
            size: 55,
            cell: ({ row }) => (
                <>
                    <div className='alignCenter'>
                        {row?.original?.SortOrder != undefined &&
                            row?.original?.SortOrder != null &&
                            row?.original?.SortOrder != '' ? (
                            <a>{row?.original?.SortOrder}</a>
                        ) : null}
                    </div>
                </>
            ),
        },
        {
            cell: ({ row }) => (
                <>
                    <div className='text-end'>
                        <span onClick={() => EditSmartMetadataPopup(row?.original)} title="Edit" className=" alignIcon svg__iconbox svg__icon--edit"></span>
                    </div>
                </>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        },
        {
            cell: ({ row }) => (
                <>
                    <div className='text-end'>
                        <span onClick={() => DeleteSmartMetadataOpenPopup(row?.original)} title="Edit" className="  alignIcon svg__iconbox svg__icon--trash"></span>
                    </div>
                </>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 10,
        },
        {
            header: ({ table }: any) => (
                <>
                    {
                        RestructureIcon ?
                            <span style={{ backgroundColor: `${'portfolioColor'}` }} title="Restructure" className="Dyicons mb-1 mx-1 p-1" onClick={() => OpenTopRestructureIcon()}>
                                <span className="svg__iconbox svg__icon--re-structure"></span>
                            </span>
                            : ''
                    }
                </>
            ),
            cell: ({ row, getValue }) => (
                <>
                    {row?.original?.isRestructureActive && (
                        <span className="Dyicons p-1" title="Restructure" style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} onClick={() => callChildFunction(row?.original)}>
                            <span className="alignIcon svg__iconbox svg__icon--re-structure"> </span>
                        </span>
                    )}
                    {getValue()}
                </>
            ),
            id: "row?.original.Id",
            canSort: false,
            placeholder: "",
            size: 10,
        },
    ],
        [Smartmetadata]);
    const closeCreateSmartMetadataPopup = () => {
        setSmartmetadataAdd(false);
        childRefdata?.current?.setRowSelection({});
    }
    const CloseEditSmartMetaPopup = () => {
        setSmartMetadataEditPopupOpen(false);
        childRefdata?.current?.setRowSelection({});
    };
    const CloseDeleteSmartMetaPopup = () => {
        setSmartMetadataDeletePopupOpen(false);
        childRefdata?.current?.setRowSelection({});
    };
    //-------------------------------------------------- RESTRUCTURING FUNCTION start---------------------------------------------------------------

    const callBackSmartMetaData = useCallback((Array: any, unSelectTrue: any, Taxtype: any, checkData: any) => {
        if (childRef?.current?.table?.getSelectedRowModel()?.flatRows.length > 0) {
            childRef?.current?.table?.getSelectedRowModel()?.flatRows.filter((item: any) => {
                if (item.original !== undefined) {
                    if (!isItemExists(SelectedMetadataItem, item.original.Id))
                        SelectedMetadataItem.push(item.original);
                }
            })
            if (SelectedMetadataItem.length === 1) {
                setSmartmetadataRestructureButton(true)
                setSmartmetadataCompareButton(false);
            } else if (SelectedMetadataItem.length === 2) {
                setSmartmetadataRestructureButton(false)
                setSmartmetadataCompareButton(true);
            } else {
                if (SelectedMetadataItem.length > 0)
                    SelectedMetadataItem = [];
                setSmartmetadataCompareButton(false);
                setSmartmetadataRestructureButton(false);
            }

        } else {
            SelectedMetadataItem = [];
            setRestructureIcon(false)
            if (CopySmartmetadata !== undefined && CopySmartmetadata.length !== 0) {
                let array = CopySmartmetadata;
                array?.map((obj: any) => {
                    obj.isRestructureActive = false;
                    if (obj?.subRows?.length > 0 && obj?.subRows != undefined) {
                        obj?.subRows?.map((Item: any) => {
                            Item.isRestructureActive = false;
                            if (Item?.subRows?.length > 0 && Item?.subRows != undefined) {
                                Item?.subRows?.map((Item1: any) => {
                                    Item1.isRestructureActive = false;
                                    if (Item1?.subRows?.length > 0 && Item1?.subRows != undefined) {
                                        Item1?.subRows?.map((Item2: any) => {
                                            Item2.isRestructureActive = false;
                                            if (Item2?.subRows?.length > 0 && Item2?.subRows != undefined) {
                                                Item2?.subRows?.map((Item3: any) => {
                                                    Item3.isRestructureActive = false;
                                                    if (Item3?.subRows?.length > 0 && Item3?.subRows != undefined) {
                                                        Item3?.subRows?.map((Item4: any) => {
                                                            Item4.isRestructureActive = false;
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
                if (array.length !== 0)
                    setSmartmetadata(array);
                setSmartmetadataCompareButton(false);
                setSmartmetadataRestructureButton(false);

            }
        }
        if (unSelectTrue === true) {
            setRestructureIcon(true);
        }
        if (Taxtype) {
            SmartmetadataItems = [];
            Array = {};
            setRestructureIcon(false)
            setSelectedItem({});
            LoadSmartMetadata();
        }
    }, []);
    const callChildFunction = (items: any) => {
        if (MyContextValue) {
            MyContextValue?.OpenModal(items, false);
        }
    };
    const OpenTopRestructureIcon = () => {
        if (MyContextValue) {
            MyContextValue?.OpenModal(categoriesTabName, true);
        }
    }
    const SmartrestructureFunct = (restr: any) => {
        setRestructureIcon(restr)
        //setSmartmetadataRestructure(restr);
        setSmartmetadata((prev: any) => [...prev])
    }
    //-------------------------------------------------- RESTRUCTURING FUNCTION end---------------------------------------------------------------
    //-------------------------------------------------- COPY GENERATE JSON FUNCTION start---------------------------------------------------------------
    async function copyTextToClipboard(JSONdata: any) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(JSONdata);
        }
    }
    const CopyJSON = async () => {
        copyTextToClipboard(AllCombinedJSON)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    //-------------------------------------------------- COPY GENERATE JSON FUNCTION end---------------------------------------------------------------
    //-------------------------------------------------- GENERATE JSON FUNCTION start---------------------------------------------------------------
    const onRenderCustomHeaderDocuments = () => {
        return (
            <>
                <div className='subheading siteColor'>
                    Generate JSON
                </div>
            </>
        );
    };
    const generateJSONOfTaskLists = () => {
        const taskListsItems: any = SmartmetadataItems?.filter((type: any) => type.TaxType === "Sites");
        const newAllCombinedJSON: any = [];
        taskListsItems.forEach((item: any) => {
            if (item?.Configurations !== null) {
                const configuration: any = JSON.parse(item.Configurations);
                configuration.forEach((JSONObj: any) => {
                    newAllCombinedJSON.push(JSONObj);
                });
            }
        });
        const JsonData: any = JSON.stringify(newAllCombinedJSON);
        setAllCombinedJSON(JsonData);
        setIsVisible(true);
    };
    const CloseGenerateJSONpopup = () => {
        setIsVisible(false);
    }
    const OpenCreateSmartMetadataPopup = () => {
        setSmartmetadataAdd(true);
    }
    const openComparePopup = () => {
        setSmartmetadataCompare(true);
    }
    const buttonRestructureCheck = () => {
        setSmartmetadataRestructure(true);
    }
    const closeCompareAndRestructuepopup = () => {
        setSmartmetadataCompare(false);
        setSmartmetadataRestructure(false);
        childRefdata?.current?.setRowSelection({});
    }
    const customTableHeaderButtons = (
        <div>
            <button type="button" title="Add" onClick={OpenCreateSmartMetadataPopup} className="btnCol btn btn-primary">Add +</button>
            {SmartmetadataCompareButton
                ? <button type="button" title="Compare" onClick={openComparePopup} className='btnCol btn btn-primary'>Compare</button> : <button type="button" title="Compare" disabled={true} onClick={openComparePopup} className='btnCol btn btn-primary'>Compare</button>
            }
            {SmartmetadataRestructureButton
                ? <button type="button" title="Restructure" className="btnCol btn btn-primary" onClick={buttonRestructureCheck}>Restructure</button> : <button type="button" title="Restructure" className="btnCol btn btn-primary" disabled={true}>Restructure</button>
            }
        </div>
    )
    //-------------------------------------------------- GENERATE JSON FUNCTION end---------------------------------------------------------------
    return (
        <>
            <div className='TableContentSection'>
                <section className='col-sm-12 clearfix'>
                    <div className='d-flex justify-content-between align-items-center siteColor  serviceColor_Active mb-2'>
                        <h3 className="heading">ManageSmartMetaData
                        </h3>
                        <span><a data-interception="off" target="_blank" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/managesmartmetadata-old.aspx">Old ManageSmartMetadata</a></span>
                    </div>
                    <div>
                        <span>
                            {
                                SmartmetadataAdd === true ?
                                    <CreateMetadataItem AddButton={SmartmetadataAdd} childRefdata={childRefdata} AllList={selectedProps.AllList} addItemCallBack={callBackSmartMetaData} CloseEditSmartMetaPopup={CloseEditSmartMetaPopup} closeCreateSmartMetadataPopup={closeCreateSmartMetadataPopup} SelectedItem={SelectedMetadataItem} setName={setName} ParentItem={Smartmetadata} TabSelected={TabSelected} categoriesTabName={categoriesTabName}></CreateMetadataItem>
                                    : ''
                            }
                        </span>
                        <span>
                            {
                                SmartmetadataCompare === true ?
                                    <CompareSmartMetaData closeComparepopup={closeCompareAndRestructuepopup} CompareButton={SmartmetadataCompare} childRefdata={childRefdata} AllList={selectedProps.AllList} compareSeletected={SelectedMetadataItem} ref={childRef} SelectedItem={SelectedMetadataItem} setName={setName} ParentItem={Smartmetadata} TabSelected={TabSelected}></CompareSmartMetaData>
                                    : ''
                            }
                        </span>
                        <span>
                            {
                                SmartmetadataRestructure === true ?
                                    <RestructureSmartMetaData
                                        closeRestructurepopup={closeCompareAndRestructuepopup}
                                        RestructureButton={SmartmetadataRestructure} childRefdata={childRefdata} AllList={selectedProps.AllList} ref={childRef} AllMetaData={Smartmetadata} restructureItemCallBack={callBackSmartMetaData} restructureItem={SelectedMetadataItem} SmartrestructureFunct={SmartrestructureFunct} TabSelected={TabSelected} />
                                    : ''
                            }
                        </span>
                    </div>
                </section>
                <ul className="nav nav-tabs" role="tablist">
                    {Tabs?.map((item: any, index: any) => (
                        <button className={
                            index === 0
                                ? "nav-link active"
                                : "nav-link"
                        } onClick={() => ShowingTabsData(item.Title)} key={index} data-bs-toggle="tab" data-bs-target="#URLTasks" type="button" role="tab" aria-controls="URLTasks" aria-selected="true">
                            {item.Title}
                        </button>
                    ))}
                    <span className='ml-auto'>
                        <a className='text-end hyperlink' onClick={() => generateJSONOfTaskLists()}>Generate JSON </a>
                    </span>
                </ul>
                <div className="border border-top-0 clearfix p-2 tab-content " id="myTabContent">
                    {TabSelected === 'Categories' &&
                        <ul className="nav nav-tabs" role="tablist">
                            {ParentMetaDataItems.map((Parent: any, index: any) => (
                                <button className={
                                    index === 0
                                        ? "nav-link active"
                                        : "nav-link"
                                } onClick={() => ShowingCategoriesTabsData(Parent)} key={index} data-bs-toggle="tab" data-bs-target="#URLTasks" type="button" role="tab" aria-controls="URLTasks" aria-selected="true">
                                    {Parent.Title}
                                </button>
                            ))}
                        </ul>
                    }
                    <div className="tab-pane  show active" id="URLTasks" role="tabpanel" aria-labelledby="URLTasks">
                        <div className='TableSection'>
                            <div className='Alltable'>
                                <div className='col-md-12 p-0 smart'>
                                    <div className='wrapper'>
                                        {
                                            Smartmetadata &&
                                            <GlobalCommanTable customHeaderButtonAvailable={true} customTableHeaderButtons={customTableHeaderButtons} smartMetadataCount={smartMetadataCount} Tabs={Tabs} compareSeletected={compareSeletected} CloseEditSmartMetaPopup={CloseEditSmartMetaPopup} SelectedItem={SelectedItem} setName={setName} ParentItem={Smartmetadata} AllList={selectedProps.AllList} data={Smartmetadata} TabSelected={TabSelected} ref={childRef} childRefdata={childRefdata} callChildFunction={callChildFunction} callBackSmartMetaData={callBackSmartMetaData} columns={columns} showHeader={true} expandIcon={true} showPagination={true} callBackData={callBackSmartMetaData} categoriesTabName={categoriesTabName} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isVisible && (<div>
                    <Panel
                        title="popup-title"
                        isOpen={true}
                        onDismiss={CloseGenerateJSONpopup}
                        type={PanelType.custom}
                        isBlocking={false}
                        onRenderHeader={onRenderCustomHeaderDocuments}
                        customWidth="750px"
                    >
                        <div className="modal-body">
                            <div className="col-sm-12 tab-content bdrbox">
                                <div className="divPanelBody mt-10 mb-10  col-sm-12 padL-0 PadR0" id="#CopyJSON">
                                    {AllCombinedJSON}
                                </div>
                            </div>
                        </div>
                        <div className='applyLeavePopup'>
                            <div className="modal-footer border-0 px-0">
                                <button className='btnCol btn btn-primary mx-2 mt-0' onClick={CopyJSON}>
                                    <span>{isCopied ? 'Copied!' : 'CopyJSON'}</span>
                                </button>
                                <button className='btn btn-default m-0' onClick={() => CloseGenerateJSONpopup()}> Cancel</button>
                            </div>
                        </div>
                    </Panel>
                </div>)}
                {SmartMetadataEditPopupOpen ? <SmartMetadataEditPopup AllList={selectedProps.AllList} CloseEditSmartMetaPopup={CloseEditSmartMetaPopup} EditItemCallBack={callBackSmartMetaData} AllMetadata={Smartmetadata} MetadataItems={SmartmetadataItems} modalInstance={SelectedSmartMetadataItem} TabSelected={TabSelected} ParentMetaDataItems={ParentMetaDataItems} childRefdata={childRefdata} /> : ''}
                {SmartMetadataDeletePopupOpen ? <DeleteSmartMetadata AllList={selectedProps.AllList} CloseDeleteSmartMetaPopup={CloseDeleteSmartMetaPopup} DeleteItemCallBack={callBackSmartMetaData} AllMetadata={Smartmetadata} modalInstance={SelectedSmartMetadataItem} childRefdata={childRefdata} /> : ''}
            </div>
        </>
    );
}


