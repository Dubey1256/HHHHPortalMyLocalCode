import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import { ColumnDef } from '@tanstack/react-table';
import GlobalCommanTable from './GlobalCommanTableSmartmetadata';
import { Panel, PanelType } from 'office-ui-fabric-react';
import SmartMetadataEditPopup from "./SmartMetadataEditPopup";
import DeleteSmartMetadata from "./DeleteSmartMetadata";
let ParentMetaDataItems: any = [];
let SmartmetadataItems: any = [];
let TabSelected: string;
let compareSeletected: any = [];
export default function ManageSmartMetadata(selectedProps: any) {
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
    const [Tabs, setTabs] = useState([]);
    var [TabsFilter]: any = useState([]);
    const childRef: any = useRef<any>();
    const GetAdminConfig = async () => {
        try {
            let web = new Web(selectedProps.AllList.SPSitesListUrl);
            const Config = await web.lists.getById(selectedProps.AllList.SPSiteConfigListID).items.select("ID,Title,OrderBy,WebpartId,DisplayColumns,Columns,QueryType,FilterItems&$filter=WebpartId eq 'AllManageSmartMetadataPortfolioTabs'").getAll();
            if (Config) {
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
            let web = new Web(selectedProps.AllList.SPSitesListUrl);
            const AllMetaDataItems = await web.lists.getById(selectedProps.AllList.SPSmartMetadataListID).items.select("*,Author/Title,Editor/Title,Parent/Id,Parent/Title&$expand=Parent,Author,Editor&$orderBy=SortOrder&$filter=isDeleted ne 1").getAll();
            SmartmetadataItems = SmartmetadataItems.concat(AllMetaDataItems)
            ShowingTabsData('Categories')
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
        ParentMetaDataItems = SmartmetadataItems?.filter((comp: any) => comp?.TaxType === Tab && comp?.ParentId === null);
        ParentMetaDataItems.filter((item: any) => {
            GroupByItems(item, SmartmetadataItems);
        })
        ParentMetaDataItems.filter((item: any) => {
            if (item.TaxType && item.TaxType === Tab) {
                TabsFilter.push(item);
            }
        });
        setSmartmetadata(TabsFilter);
    };
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
            size: 10,
            cell: ({ row }) => (
                <>
                    <div className='alignCenter'>
                        {row?.original?.Title != undefined &&
                            row?.original?.Title != null &&
                            row?.original?.Title != '' ? (
                            <a>
                                {row?.original?.Title}
                            </a>
                        ) : null}
                    </div>
                </>
            ),
        },
        {
            accessorKey: 'SmartFilters',
            placeholder: 'SmartFilters',
            header: '',
            size: 10,
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
            header: '',
            size: 10,
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
            header: '',
            size: 10,
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
                            <span style={{ backgroundColor: `${'portfolioColor'}` }} title="Restructure" className="Dyicons mb-1 mx-1 p-1" onClick={() => trueTopIcon(true)}>
                                <span className="alignIcon svg__iconbox svg__icon--re-structure"></span>
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
            size: 1,
        },
    ],
        [Smartmetadata]);

    const CloseEditSmartMetaPopup = () => {
        setSmartMetadataEditPopupOpen(false);
    };
    const CloseDeleteSmartMetaPopup = () => {
        setSmartMetadataDeletePopupOpen(false);
    };
    //-------------------------------------------------- RESTRUCTURING FUNCTION start---------------------------------------------------------------
    const callBackData = useCallback((checkData: any) => {
        let array: any = [];
        if (checkData != undefined) {
            compareSeletected.push(checkData);
            setSelectedItem(checkData);
            array.push(checkData);
        } else {
            setSelectedItem({});
            array = [];

            compareSeletected = [];
        }
        setSelectedItem(array);
    }, []);
    const callBackSmartMetaData = useCallback((Array: any, topCompoIcon: any, Taxtype: any) => {
        if (Array) {
            let MetaData: any = [...Array]
            console.log(MetaData)
            setRestructureIcon(topCompoIcon);
        }
        if (Taxtype) {
            SmartmetadataItems = [];
            LoadSmartMetadata();
        }
    }, []);
    const callChildFunction = (items: any) => {
        if (childRef.current) {
            childRef.current.callChildFunction(items);
        }
    };
    const trueTopIcon = (items: any) => {
        if (childRef.current) {
            childRef.current.trueTopIcon(items);
        }
    };
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
    //-------------------------------------------------- GENERATE JSON FUNCTION end---------------------------------------------------------------
    return (
        <>
            <span className='pull-right'>
                <a className='text-end hyperlink ' onClick={() => generateJSONOfTaskLists()}>Generate JSON </a>
            </span>
            <ul className="nav nav-tabs" role="tablist">
                {Tabs.map((item: any, index: any) => (
                    <button className={
                        index === 0
                            ? "nav-link active"
                            : "nav-link"
                    } onClick={() => ShowingTabsData(item.Title)} key={index} data-bs-toggle="tab" data-bs-target="#URLTasks" type="button" role="tab" aria-controls="URLTasks" aria-selected="true">
                        {item.Title}
                    </button>
                ))}
            </ul>
            <div className="border border-top-0 clearfix p-2 tab-content " id="myTabContent">
                <div className="tab-pane Alltable mx-height show active" id="URLTasks" role="tabpanel" aria-labelledby="URLTasks">
                    {
                        Smartmetadata &&
                        <GlobalCommanTable compareSeletected={compareSeletected} CloseEditSmartMetaPopup={CloseEditSmartMetaPopup} SelectedItem={SelectedItem} setName={setName} ParentItem={Smartmetadata} AllList={selectedProps.AllList} data={Smartmetadata} TabSelected={TabSelected} ref={childRef} callChildFunction={callChildFunction} callBackSmartMetaData={callBackSmartMetaData} columns={columns} showHeader={true} expandIcon={true} showPagination={true} callBackData={callBackData} />
                    }
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
            {SmartMetadataEditPopupOpen ? <SmartMetadataEditPopup AllList={selectedProps.AllList} CloseEditSmartMetaPopup={CloseEditSmartMetaPopup} EditItemCallBack={callBackSmartMetaData} AllMetadata={Smartmetadata} modalInstance={SelectedSmartMetadataItem} /> : ''}
            {SmartMetadataDeletePopupOpen ? <DeleteSmartMetadata AllList={selectedProps.AllList} CloseDeleteSmartMetaPopup={CloseDeleteSmartMetaPopup} DeleteItemCallBack={callBackSmartMetaData} AllMetadata={Smartmetadata} modalInstance={SelectedSmartMetadataItem} /> : ''}
        </>
    );
}


