import React from 'react'
import { Web } from 'sp-pnp-js';
// import EditDocumentpanel from '../webparts/smartpages/components/EditDocunentPanel';
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import * as GlobalFunction from './globalCommon';
import { useCallback, useEffect, useRef, useState } from 'react'

import Tooltip from './Tooltip';
import * as globalCommon from '../globalComponents/globalCommon';
import PageLoader from './pageLoader';
import * as Moment from "moment";
// import EditEventCardPopup from '../webparts/gruneEventSite/components/EditEventCard';
let webPartInfo: any = [];
let webPartInfoConfig: any = [];
let selectedSiteListDetails: any = {};
let anc_details: any = [];
let taggedType: any = '';
let siteTitle = '';
let smartTermName: any = '';
let AncTaggingConfig: any = {}
export const RelevantWebPart = (props: any) => {
    var ListsData: any = [];
    let AllSiteConfig: any = [];
    const [folderStructureSourceLists, setfolderStructureSourceLists] = useState([]);
    const [Show_Document, setShow_Document] = useState(false);
    const [siteTypeCheck, setsiteTypeCheck] = useState('')
    const [show_event, setshow_event] = useState(false);
    const [editDocpopup, setEditDocpopup] = useState(false);
    const [editdocItem, setEditDocItem]: any = useState(undefined);
    const [editNewsEvent, setEditNewsEvent]: any = useState(undefined);
    const [iseditEventOpen, setiseditEventOpen] = React.useState(false);
    const [iseditNewsOpen, setiseditNewsOpen] = React.useState(false);
    const [iseditDocumentOpen, setiseditDocumentOpen] = React.useState(false);
    const [AllReadytagged, setAllReadytagged]: any = useState([]);
    const [AllReadyTaggedEvents, setAllReadyTaggedEvents]: any = useState([]);
    const [AllReadyTaggedNews, setAllReadyTaggedNews]: any = useState([]);
    const [folderUrl, setfolderUrl] = useState(undefined)
    const [show_news, setshow_news] = useState(false);
    const [folderStructureCreateInfo, setfolderStructureCreateInfo] = useState([]);
    useEffect(() => {
        getMainItemData()
    }, [])
    const getAncDetails = async () => {
        let web = new Web(props?.AllListId?.siteUrl);
        let Data: any = await web.lists.getById(props?.AllListId?.RootAdminConfigListId).items.select("Id,Title,Value,Key,Configurations").top(4999).filter("Key eq 'AncDetails'").get();
        if (Data[0] != undefined) {
            loadAdminConfigurations(globalCommon.parseJSON(Data[0]?.Configurations));
        }
    }
    const getMainItem = async (SiteURl: any, ListID: any, Query: any, filter: any) => {
        try {
            let web = new Web(SiteURl);
            let Item = await web.lists.getById(ListID).items.select(Query).filter(filter).getAll();
            if (Item[0] == undefined)
                Item[0] = {}
            getAncDetails();
        } catch (error) {
            console.log("This is main data receive : " + error);
            console.error(error);
        }
    }
    const getMainItemData = () => {
        let Query = "*,Author/Title,Editor/Title,Parent/Id,Parent/Title&$expand=Parent,Author,Editor&$orderby=Title"
        let filter = `Id eq ${props?.Item?.Id}`
        getMainItem(props?.AllListId?.siteUrl, props?.AllListId?.SmartMetadataListID, Query, filter)
    }
    const loadAdminConfigurations = async (ancDetails_data: any) => {
        let web = new Web(props?.AllListId?.siteUrl);
        let Data: any = await web.lists.getById(props?.AllListId?.RootAdminConfigListId).items.select("Id,Title,Value,Key,Configurations").top(4999).filter("Key eq '" + props?.webpartId + "'").get();
        if (Data != undefined) {
            webPartInfo = Data[0];
            if (webPartInfo.Configurations != undefined) {
                try {
                    var Configurations = globalCommon.parseJSON(webPartInfo.Configurations);
                } catch (e) {
                }

                Configurations.forEach((config: any) => {
                    webPartInfoConfig.push(config);
                })
                let AllSiteConfigs: any = [];
                let folderStructureSourceLists: any = [];
                let folderCreateInfo: any = [];
                webPartInfoConfig?.forEach((siteItem: any) => {
                    siteItem?.sourceList?.forEach((item: any) => {
                        AllSiteConfigs.push(item)
                        if (siteItem?.Title == 'Documents') {
                            folderStructureSourceLists.push(item);
                        }
                    })
                })
                AllSiteConfig = AllSiteConfigs;
                setfolderStructureSourceLists(folderStructureSourceLists);
                if (props?.Item?.DefaultFolders) {
                    folderCreateInfo = globalCommon.parseJSON(props?.Item?.DefaultFolders)
                }
                else {
                    webPartInfoConfig.forEach((siteItem: any) => {
                        if (siteItem.Title == 'Documents') {
                            folderCreateInfo = siteItem.CreateInfo;
                            AncTaggingConfig = siteItem.TaggingConfig
                        }
                    });
                    setfolderStructureCreateInfo(folderCreateInfo)
                    folderCreateInfo.forEach((item: any) => {
                        if (item.siteType == siteTitle) {
                            selectedSiteListDetails = item
                        }
                    })
                    ancDetails_data?.forEach((item: any) => {
                        if (item?.webpartid == props?.webpartId) {
                            anc_details = item;
                            taggedType = item?.taggedType;
                            anc_details?.tabs?.forEach((config_item: any) => {
                                if (config_item == 'Documents') {
                                    setShow_Document(true);
                                } else if (config_item == 'Events') {
                                    setshow_event(true);
                                } else if (config_item == 'News') {
                                    setshow_news(true);
                                }
                            })
                        }
                    })
                    loadAllSitesListsItems(props?.usedFor, 'tiles');
                }
            }
        }
    }
    const getTaggedItems = (array: any) => {
        var taggedItems: any = [];
        try {
            array?.forEach((value: any) => {
                smartTermName = value.ColumnName + 'Id';
                if (value.ColumnType == "SingleLine") {
                    if (value[value.ColumnName] != undefined && value[value.ColumnName].Id == props?.Item?.Id) {
                        taggedItems.push(value);
                    }
                }
                else if (value.ColumnType == "Multi") {
                    if (value[smartTermName]?.includes(props?.Item?.Id)) {
                        taggedItems.push(value);
                    }

                } else if (value.ColumnType == "MultiLine") {
                    smartTermName = value.ColumnName;
                    if (value[value.ColumnName] != undefined) {
                        var Items = globalCommon.parseJSON(value[value.ColumnName]);

                        Items?.forEach((item: any) => {
                            if (item.TaskId == props?.Item?.Id && item.listId == props?.AllListId?.SmartMetadataListID) {
                                taggedItems.push(value);
                            }
                        })
                    }
                }
            });
        } catch (e) {
            console.log("Exception Occurs");
        }
        return taggedItems;
    }
    const getAllSitesListsItems: any = (siteUrl: any, listId: any, select: any, itemType?: any | undefined) => {
        return new Promise((resolve, reject) => {
            let web = new Web(siteUrl);
            web.lists.getById(listId).items.select(select).get().then(listItems => {
                let listAllItems: any = listItems;
                resolve(listAllItems);
            }).catch(error => {
                reject(error);
            });
        });
    }
    const isItemExistsInCollection = (array: any, columnName: any, value: any) => {
        var index = -1;
        array?.forEach((item: any, itemIndex: any) => {
            if (item[columnName] == value)
                index = itemIndex;
        });
        return index
    }
    const loadAllSitesListsItems = (tab: any, call_method: any) => {
        var counter: any = 0;
        let ListConfigTocall = AllSiteConfig?.filter((List: any) => List?.ListName == tab);
        ListConfigTocall?.forEach((site: any) => {
            let baseSiteUrl = props?.AllListId?.siteUrl
            getAllSitesListsItems(baseSiteUrl, site.listId, `${site?.query}&$filter=${AncTaggingConfig?.ColumnName}/Id ne null`, site.itemType)
                .then(function (dataItems: any) {
                    counter++;
                    var siteUrl = props?.AllListId?.RootAdminConfigListId + site.siteName == 'Main Site' ? 'Public' : site.siteName;
                    dataItems?.forEach((item: any) => {
                        item.SiteUrl = baseSiteUrl;
                        item.ListId = site.listId;
                        item.ColumnType = site.ColumnType;
                        item.ColumnName = site.ColumnName;
                        item.siteType = site.siteName;
                        item.ListName = site.ListName;
                        item.itemType = site.itemType;
                       
                        
                        if (item?.FileSystemObjectType == 1) {
                            item.isExpanded = false;
                            item.EncodedAbsUrl = item?.EncodedAbsUrl.replaceAll('%20', ' ')
                        } else {
                            item.docType = item?.File_x0020_Type
                            if (item?.Created) {
                                item.Created = Moment(item?.Created).format("DD/MM/YYYY HH:mm");

                            }
                            if (item?.FileDirRef != undefined && item?.FileDirRef != '') {
                                item.FileDirRef = item?.FileDirRef.replace("Shared Documents", "Documents")
                            }
                            if (item?.File_x0020_Type == 'aspx') {
                                item.docType = 'link'
                                item.EncodedAbsUrl = item?.URL?.Url
                            }
                            if (item?.File_x0020_Type == 'rar') {
                                item.docType = 'zip'
                                item.EncodedAbsUrl = item?.URL?.Url
                            }

                            if (item?.File_x0020_Type == 'msg') {
                                item.docType = 'mail'
                                item.EncodedAbsUrl = item?.URL?.Url
                            }
                            if (item?.File_x0020_Type == 'jpg' || item?.File_x0020_Type == 'jfif') {
                                item.docType = 'jpeg'
                            }
                            if (item?.File_x0020_Type == 'doc' || item?.File_x0020_Type == 'docx') {
                                item.docType = 'docx'
                            }
                        }
                    });
                    var index = isItemExistsInCollection(ListsData, 'Title', site.ListName);
                    if (index == -1) {
                        ListsData.push({ Title: site?.ListName, Items: dataItems });
                    }
                    else {
                        ListsData[index].Items = [];
                        dataItems?.forEach((listData: any) => {
                            ListsData[index].Items.push(listData);
                        })
                    }
                    if (ListConfigTocall.length == counter) {
                        ListsData?.forEach((Listitem: any, index: any) => {
                            if (Listitem?.Items?.length > 0) {
                                Listitem.taggedItems = getTaggedItems(Listitem?.Items);
                            }
                        })
                        let DefaultFolderItems: any = []
                        let FolderPath: any;
                        if (folderUrl)
                            FolderPath = folderUrl
                        if (!folderUrl) {
                            folderStructureCreateInfo?.forEach((item: any) => {
                                if (item.siteType == siteTypeCheck) {
                                    setfolderUrl(props?.AllListId?.Context?.pageContext?.web?.serverRelativeUrl + item.defaultFolderUrl);
                                    FolderPath = props?.AllListId?.Context?.pageContext?.web?.serverRelativeUrl + item.defaultFolderUrl
                                }
                            })
                        }
                        ListsData?.forEach((item: any) => {
                            if (tab == 'Documents' && tab == item?.Title) {
                                item.FolderItems = [];
                                setAllReadytagged(item?.taggedItems)
                            }
                            else if (tab == 'Announcements' && tab == item?.Title) {
                                setAllReadyTaggedNews(item?.taggedItems)
                            }
                            else if (tab == 'Events' && tab == item?.Title) {
                                setAllReadyTaggedEvents(item?.taggedItems)
                            }
                        });

                        console.log(ListsData)
                    }
                }).catch((error: any) => {
                    console.log(error)
                });
        });
    }
    const ClosePopup = useCallback(() => {
        setiseditEventOpen(false);
    }, []);
    const Modaltoopenpopup = (item: any) => {
        setEditDocpopup(true);
        setEditDocItem(item);
    }
    const CloseEditSmartDocPopup = () => {
        setEditDocpopup(false);
    }
    return (
        <>
            {props?.usedFor == 'Events' && AllReadyTaggedEvents?.length > 0 && (
                <div className='mb-3 card commentsection'>
                    <div className='card-header'>
                        <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Relevant Events<span><Tooltip ComponentId={'359'} /></span></div>
                    </div>
                    {AllReadyTaggedEvents?.map((event: any) => (
                        <div className='card-body'>
                            <ul className='whatsNew customlist-style1 list-unstyled mb-0'>
                                <li>
                                    <span className="PublishedDate alignCenter">
                                        
                                        <span className="small">   {event?.EventDate ? Moment(event?.EventDate).format("YYYY-MM-DD") : ''}</span>
                                        <span className="svg__iconbox svg__icon--edit ml-auto" onClick={() => { setEditNewsEvent(event); setiseditEventOpen(true) }}></span>
                                        {/* <span title="Edit" className="svg__iconbox svg__icon--edit alignIcon ml-auto" onClick={() => editDocumentsLink(item)}></span> */}
                                    </span>
                                    <span className="PublishedDate valign-middle">
                                        <div className="justify-content-start valign-middle">{event.Title}</div>
                                    </span>
                                </li>
                            </ul>

                        </div>
                    ))}
                </div>
            )}
            {props?.usedFor == 'Documents' && AllReadytagged?.length > 0 && (
                <div className='mb-3 card commentsection'>
                    <div className='card-header'>
                        <div className="card-title h5 d-flex justify-content-between align-items-center mb-0">Relevant Documents<span><Tooltip ComponentId={'359'} /></span></div>
                    </div>
                    {AllReadytagged?.map((document: any) => (
                        <div className='card-body'>
                            <ul className='alignCenter list-none text-break mb-0'>
                                {/* <li>
                                   <a  href={item?.FileDirRef} target="_blank" data-interception="off" > <span className='svg__iconbox svg__icon--folder'></span></a>
                                </li> */}
                                <li className='pe-1'>
                                    <a href={document?.EncodedAbsUrl}>
                                        <span className={`alignIcon svg__iconbox svg__icon--${document?.docType}`} title={document?.File_x0020_Type}></span>
                                    </a>
                                </li>
                                <li>
                                    <a className='fontColor3' href={document?.File_x0020_Type == "aspx" ? `${document?.Url?.Url}` : `${document?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off">{document?.Title}.{document?.docType}</a>
                                </li>
                                <li className='ml-auto ps-1'>
                                    {/* <span title="Edit" className="svg__iconbox svg__icon--edit hreflink alignIcon" onClick={() => editDocumentsLink(item)}></span> */}
                                    <span className="svg__iconbox svg__icon--edit ml-auto" onClick={() => { setEditDocItem(document); setEditDocpopup(true) }}></span>
                                </li>

                            </ul>
                        </div>
                    ))}
                </div>
            )}
            {
                props?.usedFor == 'Announcements' && AllReadyTaggedNews?.length > 0 && (
                    <div className='mb-3 card commentsection'>
                        <div className='card-header'>
                            <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Relevant News<span><Tooltip ComponentId={'359'} /></span></div>
                        </div>
                        {AllReadyTaggedNews?.map((news: any) => (
                            <div className='card-body'>
                                <ul className='whatsNew customlist-style1 list-unstyled mb-0'>
                                    <li>
                                        <span className="PublishedDate alignCenter">
                                            <span className="small">{news?.PublishingDate ? Moment(news?.PublishingDate).format("YYYY-MM-DD") : ''}</span>
                                            <span className="svg__iconbox svg__icon--edit ml-auto" onClick={() => { setEditNewsEvent(news); setiseditEventOpen(true) }}></span>
                                            {/* <span title="Edit" className="svg__iconbox svg__icon--edit alignIcon ml-auto" onClick={() => editDocumentsLink(item)}></span> */}
                                        </span>
                                        <span className="PublishedDate valign-middle">
                                            <div className="justify-content-start valign-middle">{news.Title}</div>
                                        </span>
                                    </li>
                                </ul>

                            </div>
                        ))}
                    </div>
                )
            }
            {/* {editDocpopup ?
                <EditDocumentpanel callbackeditpopup={CloseEditSmartDocPopup} editData={editdocItem} setDocumentData={setEditDocItem} AllListId={props?.AllList} Context={props?.AllListId?.Context?.pageContext} editdocpanel={editDocpopup} />
                :
                null
            }
            {iseditEventOpen && (
                <EditEventCardPopup
                    EditEventData={editNewsEvent}
                    Context={props?.AllListId?.Context}
                    allListId={AllListId}
                    callBack={ClosePopup}
                    usedFor={props?.usedFor == 'Announcements' ? 'NewsCard' : ''}
                />
            )} */}
        </>
    )
}
