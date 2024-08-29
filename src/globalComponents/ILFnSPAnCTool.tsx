import * as React from 'react';
import { Web } from 'sp-pnp-js';
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import * as GlobalFunction from './globalCommon';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CardBody, CardTitle, Col, Row, Table } from "reactstrap";
import { Button, ModalBody } from "react-bootstrap";
import { CustomToolTip } from './customTooltip';
import { Info16Regular, Add16Regular } from "@fluentui/react-icons";
import { Dropdown, Panel, PanelType, Modal } from 'office-ui-fabric-react';
import Tooltip from './Tooltip';
import * as globalCommon from './globalCommon';
import PageLoader from './pageLoader';
import * as Moment from "moment";
let backupExistingFiles: any = [];
let backupExistingEvents: any = [];
let backupExistingNews: any = [];
let backupCurrentFolder: any = [];
let AllFilesAndFolderBackup: any = [];
let folders: any = [];
let rootSiteName = '';
let generatedLocalPath = '';
let AncTaggingConfig: any = {}
let AllTaggedUploadDoc: any = [];
let AllDragItem: any = [];
let loadDataFlag = true;
let webPartInfo: any = [];
let webPartInfoConfig: any = [];
let selectedSiteListDetails: any = {};
let anc_details: any = [];
let taggedType: any = '';
const itemRanks: any[] = [
    { rankTitle: 'Select Item Rank', rank: null },
    { rankTitle: '(8) Top Highlights', rank: 8 },
    { rankTitle: '(7) Featured Item', rank: 7 },
    { rankTitle: '(6) Key Item', rank: 6 },
    { rankTitle: '(5) Relevant Item', rank: 5 },
    { rankTitle: '(4) Background Item', rank: 4 },
    { rankTitle: '(2) to be verified', rank: 2 },
    { rankTitle: '(1) Archive', rank: 1 },
    { rankTitle: '(0) No Show', rank: 0 }
]

let smartTermName: any = '';
export default function GrueneAnCTool(props: any) {
    props.Item.Title = props?.Item?.Title.replace(/[\\/:*?"<>|#{}%~&]/g, '-')
    let siteUrl = '';
    var ListsData: any = [];
    const [Item, setItem] = useState(props?.Item)
    const fileInputRef = useRef(null);
    const [folderUrl, setfolderUrl] = useState(undefined)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [choosePathPopup, setChoosePathPopup] = useState(false);
    const [FileNamePopup, setFileNamePopup] = useState(false);
    const [ServicesTaskCheck, setServicesTaskCheck] = useState(false);
    const [uploadEmailModal, setUploadEmailModal] = useState(false);
    const [TaskTypesPopup, setTaskTypesPopup] = useState(false);
    const [OpenDefaultContent, setOpenDefaultContent] = useState(false);
    const [SelectedItem, setSelectedItem] = useState<string>()
    const [remark, setRemark] = useState(false)
    const [ShowExistingDoc, setShowExistingDoc] = useState(false)
    const [ShowExistingEvents, setShowExistingEvents] = useState(false)
    const [ShowExistingNews, setShowExistingNews] = useState(false)
    const [editSmartInfo, setEditSmartInfo] = useState(false)
    const [folderExist, setFolderExist] = useState(false);
    const [createNewFile, setCreateNewFile] = useState(false);
    const [pageLoaderActive, setPageLoader] = useState(false)
    const [renamedFileName, setRenamedFileName]: any = useState('');
    const [LinkToDocTitle, setLinkToDocTitle]: any = useState('');
    const [LinkToDocUrl, setLinkToDocUrl]: any = useState('');
    const [createNewDocType, setCreateNewDocType]: any = useState('');
    const [newSubFolderName, setNewSubFolderName]: any = useState('');
    const [selectPathFromPopup, setSelectPathFromPopup]: any = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [ShowConfirmation, setShowConfirmation]: any = useState(false);
    const [ShowConfirmationInside, setShowConfirmationInside]: any = useState(false);
    const [UploadedDocDetails, setUploadedDocDetails] = useState([]);
    const [newlyCreatedFile, setNewlyCreatedFile]: any = useState(null);
    const [itemRank, setItemRank] = useState(5);
    const [LinkDocitemRank, setLinkDocitemRank] = useState(5);
    const [selectedPath, setSelectedPath] = useState({ displayPath: '', completePath: '', });
    const [CreateFolderLocation, showCreateFolderLocation] = useState(false);
    const [AllFilesAndFolder, setAllFilesAndFolder]: any = useState([]);
    const [AllFoldersGrouped, setAllFoldersGrouped]: any = useState([]);
    const [currentFolderFiles, setCurrentFolderFiles]: any = useState([]);
    const [ExistingFiles, setExistingFiles]: any = useState([]);
    const [ExistingEvents, setExistingEvents]: any = useState([]);
    const [ExistingNews, setExistingNews]: any = useState([]);
    const [AllReadytagged, setAllReadytagged]: any = useState([]);
    const [AllReadyTaggedEvents, setAllReadyTaggedEvents]: any = useState([]);
    const [AllReadyTaggedNews, setAllReadyTaggedNews]: any = useState([]);
    const [editdocpanel, setEditdocpanel] = useState(false);
    const [EditdocData, setEditdocData] = useState<any>({});
    const [Doctab, setDoctab] = useState('');
    const [Show_Document, setShow_Document] = useState(false);
    const [show_event, setshow_event] = useState(false);
    const [show_news, setshow_news] = useState(false);
    const [hide_tab, sethide_tab] = useState(true);
    const [SelectedTiles, setSelectedTiles] = useState('');
    const [AllSiteConfig, setAllSiteConfig] = useState([]);
    const [folderStructureSourceLists, setfolderStructureSourceLists] = useState([]);
    const [folderStructureCreateInfo, setfolderStructureCreateInfo] = useState([]);
    const [showRadioButton, setshowRadioButton] = useState(false);
    const [isUpdateDefaultFolder, setisUpdateDefaultFolder] = useState(false);
    const [siteTypeCheck, setsiteTypeCheck] = useState('')
    const [siteName, setsiteName] = useState('')
    let siteTitle = '';
    // File Drag And Drop And Upload
    const handleFileDrop = (event: any) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        console.log('Dropped file:', files); // Log the dropped file for debugging
        // setSelectedFile(file);
        // setTimeout(() => {
        //     handleUpload(file);
        // }, 2000)
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setSelectedFile(file);

            // Optionally, you can perform an upload operation for each dropped file
            setTimeout(() => {
                handleUpload(file);
            }, 2000 * i); // Delay the upload for each file
        }
    };
    const handleFileInputChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };
    const handleRankChange = (event: any, from: any) => {
        // const rank =parseInt(event.target.value);  
        if (from == 'Upload') {
            setItemRank(event);
            setDoctab('');
        }
        if (from == 'linkDoc' || from == 'DRAGDROP') {
            setLinkDocitemRank(event);
            setDoctab(from);
        }
    };
    const getUploadedFileName = (fileName: any) => {
        const indexOfLastDot = fileName?.lastIndexOf('.');
        if (indexOfLastDot !== -1) {
            const extractedPart = fileName?.substring(0, indexOfLastDot);
            return extractedPart;
        } else {
            return fileName
        }
    }
    const resetForm = () => {
        fileInputRef.current.form.reset();
    };
    const getSizeString = (sizeInBytes: number): string => {
        const kbThreshold = 1024;
        const mbThreshold = kbThreshold * 1024;

        if (!isNaN(sizeInBytes) && sizeInBytes < kbThreshold) {
            return `${sizeInBytes} KB`;
        } else if (sizeInBytes < mbThreshold) {
            const sizeInKB = (sizeInBytes / kbThreshold)
            if (!isNaN(sizeInKB)) {
                return `${sizeInKB.toFixed(2)} KB`;
            } else {
                return `128 KB`;
            }
        } else {
            const sizeInMB = (sizeInBytes / mbThreshold)
            if (!isNaN(sizeInMB)) {
                return `${sizeInMB.toFixed(2)} MB`;
            } else {
                return `112 KB`;
            }
        }
    };
    const handleUpload = async (uploadselectedFile: any) => {
        let isFolderAvailable = folderExist;
        let fileName = ''
        let uploadPath = selectPathFromPopup?.length > 0 ? selectPathFromPopup : `${folderUrl}/${props?.Item?.Title}`;
        let taggedDocument = {
            fileName: '',
            docType: '',
            uploaded: false,
            tagged: false,
            link: '',
            size: '',
            Id: '',
            ID: '',
        }
        let filetype = '';
        setPageLoader(true)
        setTimeout(async () => {
            if (renamedFileName?.length > 0 && selectedFile.name?.length > 0) {
                filetype = getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name)
                fileName = sanitizeFileName(renamedFileName) + `.${filetype}`;
            } else {
                fileName = selectedFile != undefined ? sanitizeFileName(selectedFile.name) : sanitizeFileName(uploadselectedFile.name);
            }
            if (isFolderAvailable == false) {
                try {
                    await CreateFolder(folderUrl, props?.Item?.Title).then((data: any) => {
                        isFolderAvailable = true
                        setFolderExist(true)
                    })

                } catch (error) {
                    console.log('An error occurred while creating the folder:', error);
                }
            }
            if (isFolderAvailable == true) {
                try {
                    // Read the file content
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        const fileContent = reader.result as ArrayBuffer;
                        uploadFile(fileContent)
                    };

                    reader.readAsArrayBuffer(selectedFile != undefined ? selectedFile : uploadselectedFile);


                    const uploadFile = async (fileToUpload: any) => {
                        setPageLoader(true)
                        return new Promise<void>(function (myResolve, myReject) {
                            let fileItems: any;
                            let web = new Web(`${props?.AllListId?.siteUrl}`);
                            web.getFolderByServerRelativeUrl(uploadPath)
                                .files.add(fileName, fileToUpload, true).then(async (uploadedFile: any) => {
                                    console.log(uploadedFile);
                                    setTimeout(async () => {
                                        fileItems = await getAllSitesListsItems(`${props?.AllListId?.siteUrl}`, selectedSiteListDetails?.listId, selectedSiteListDetails.query)
                                        fileItems?.map(async (file: any) => {
                                            if (file?.FileDirRef != undefined && file?.FileDirRef?.toLowerCase() == uploadPath?.toLowerCase() && file?.FileSystemObjectType == 0 && file?.FileLeafRef == fileName) {
                                                let resultArray: any = [];
                                                resultArray.push(props?.Item?.Id)
                                                let siteColName = `${AncTaggingConfig?.ColumnName}Id`
                                                let fileSize = getSizeString(fileToUpload?.byteLength)
                                                taggedDocument = {
                                                    ...taggedDocument,
                                                    fileName: fileName,
                                                    docType: getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name),
                                                    uploaded: true,
                                                    link: `${rootSiteName}${selectedPath.displayPath}/${fileName}?web=1`,
                                                    size: fileSize,
                                                    Id: file?.Id,
                                                    ID: file?.Id,
                                                }
                                                taggedDocument.link = `${file?.EncodedAbsUrl}?web=1`;
                                                // Update the document file here
                                                let postData: any = {
                                                    ItemRank: Doctab === 'DRAGDROP' ? LinkDocitemRank : itemRank,
                                                    Title: getUploadedFileName(fileName)
                                                }
                                                if (AncTaggingConfig?.ColumnType == 'Multi') {
                                                    postData[siteColName] = { "results": resultArray }
                                                } else {
                                                    postData[siteColName] = props?.Item?.Id;
                                                }
                                                await web.lists.getById(selectedSiteListDetails?.listId).items.getById(file.Id)
                                                    .update(postData).then((updatedFile: any) => {
                                                        props?.callBack()
                                                        file.Title = getUploadedFileName(fileName);
                                                        file.siteType = siteTypeCheck;
                                                        file.ItemRank = Doctab === 'DRAGDROP' ? LinkDocitemRank : itemRank,
                                                            file.Created = Moment(new Date()).format("DD/MM/YYYY HH:mm");
                                                        file.docType = getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name)
                                                        setAllReadytagged([...AllReadytagged, ...[file]])
                                                        myResolve()
                                                        taggedDocument.tagged = true;
                                                        AllTaggedUploadDoc.push(taggedDocument)
                                                        setPageLoader(false)
                                                        setUploadedDocDetails(AllTaggedUploadDoc);
                                                        setRenamedFileName('')
                                                        setSelectedFile(null);

                                                        try {
                                                            resetForm()
                                                        } catch (e) {
                                                            console.log(e)
                                                        }
                                                        return file;
                                                    }).catch((e) => {
                                                        setPageLoader(false)
                                                        setSelectedFile(null);
                                                        try {
                                                            resetForm()
                                                        } catch (e) {
                                                            console.log(e)
                                                        }
                                                    })

                                                console.log("File uploaded successfully.", file);
                                            }
                                        })
                                    }, 2000);
                                });
                            setUploadedDocDetails(AllTaggedUploadDoc);
                            setShowConfirmation(true)
                            setUploadEmailModal(false)
                            // setModalIsOpenToFalse()
                        })
                    }

                } catch (error) {
                    console.log("File upload failed:", error);
                }
            }
        }, 1000);
        setSelectedFile(null);
        cancelNewCreateFile()
        setItemRank(5);
    };
    const cancelNewCreateFile = () => {
        setFileNamePopup(false);
        setNewlyCreatedFile(null);
        setRenamedFileName('');
        setCreateNewDocType('');
        setLinkDocitemRank(5);
        setLinkToDocTitle('');
        setLinkToDocUrl('');
    }
    //End //

    // Searching Functions //
    const searchCurrentFolder = (value: any) => {
        if (value?.length > 0) {
            setCurrentFolderFiles((prevFile: any) => {
                return backupCurrentFolder?.filter((file: any) => {
                    return file?.Title?.toLowerCase()?.includes(value?.toLowerCase());
                });
            });
        } else {
            setCurrentFolderFiles(backupCurrentFolder);
        }
    }
    const searchExistingFile = (value: any) => {
        if (value != undefined && value != '' && value?.length > 0)
            setShowExistingDoc(true)
        else
            setShowExistingDoc(false)
        if (value?.length > 0) {
            setExistingFiles((prevFile: any) => {
                return backupExistingFiles?.filter((file: any) => {
                    return file?.Title?.toLowerCase()?.includes(value?.toLowerCase());
                });
            });
        } else {
            setExistingFiles(backupExistingFiles);
        }
    }
    const searchExistingEvents = (value: any) => {
        if (value != undefined && value != '' && value?.length > 0)
            setShowExistingEvents(true)
        else
            setShowExistingEvents(false)
        if (value?.length > 0) {
            setExistingEvents((prevFile: any) => {
                return backupExistingEvents?.filter((file: any) => {
                    return file?.Title?.toLowerCase()?.includes(value?.toLowerCase());
                });
            });
        } else {
            setExistingEvents(backupExistingEvents);
        }
    }
    const searchExistingNews = (value: any) => {
        if (value != undefined && value != '' && value?.length > 0)
            setShowExistingNews(true)
        else
            setShowExistingNews(false)
        if (value?.length > 0) {
            setExistingNews((prevFile: any) => {
                return backupExistingNews?.filter((file: any) => {
                    return file?.Title?.toLowerCase()?.includes(value?.toLowerCase());
                });
            });
        } else {
            setExistingNews(backupExistingNews);
        }
    }
    //End
    const setModalIsOpenToFalse = () => {
        props?.callBack()
        sethide_tab(true)
        setSelectedFile(null);
        setModalIsOpen(false);
        setShowExistingEvents(false)
        setShowExistingNews(false)
    }
    // Tag and Untag Existing Documents//
    const tagSelectedDoc = async (file: any) => {
        let postData: any = {}
        let alertMessage: any = ''
        let updateType = '';
        if (file?.ColumnType == "Multi" && file[`${file?.ColumnName}Id`]?.length > 0) {
            if (file[`${file?.ColumnName}Id`].some((item: any) => item == props?.Item?.Id)) {
                file[`${file?.ColumnName}Id`] = file[`${file?.ColumnName}Id`]?.filter((item: any) => item != props?.Item?.Id)
                alertMessage = `${file?.itemType} - ${file?.Title} Successfully Untagged from ${props?.Item?.Title}`
                updateType = 'UnTag'
            } else {
                file[`${file?.ColumnName}Id`].push(props?.Item?.Id)
                alertMessage = `${file?.itemType} - ${file?.Title} Successfully Tagged To ${props?.Item?.Title}`
                updateType = 'Tag'
            }
            postData[`${file?.ColumnName}Id`] = { results: file[`${file?.ColumnName}Id`] }
        } else if (file?.ColumnType == "Multi") {
            file[`${file?.ColumnName}Id`] = [props?.Item?.Id]
            postData[`${file?.ColumnName}Id`] = { results: [props?.Item?.Id] }
            alertMessage = `${file?.itemType} - ${file?.Title} Successfully Tagged To ${props?.Item?.Title}`
            updateType = 'Tag'
        } else if (file?.ColumnType == "Single" && file[`${file?.ColumnName}Id`] != props?.Item?.Id) {
            postData[`${file?.ColumnName}Id`] = props?.Item?.Id
            alertMessage = `${file?.itemType} - ${file?.Title} Successfully Tagged To ${props?.Item?.Title}`
            updateType = 'Tag'
        } else if (file?.ColumnType == "Single" && file[`${file?.ColumnName}Id`] == props?.Item?.Id) {
            postData[`${file?.ColumnName}Id`] = null;
            alertMessage = `${file?.itemType} - ${file?.Title} Successfully Untagged from ${props?.Item?.Title}`
            updateType = 'UnTag'
        }

        let web = new Web(file?.SiteUrl);
        const sp = spfi().using(spSPFx(props?.Context));;
        await web.lists.getById(file?.ListId).items.getById(file?.Id)
            .update(postData).then((updatedFile: any) => {
                props?.callBack()
                if (alertMessage?.length > 0) {
                    alert(alertMessage)
                    UpdatestateAfterTag(file?.ListName, updateType, file)
                }
                return file;
            }).catch(async (err: any) => {
                console.log(err)
                if (err.message.includes('423')) {
                    
                    const user = await sp.web.getFolderByServerRelativePath(file?.FileDirRef).files.getByUrl(file?.FileLeafRef).getLockedByUser();
                    console.log(user)
                    alert("Document you are trying to Update/Tag is open somewhere else. Please close the Document and try again")
                }
            })
        // }

    }
    const UpdatestateAfterTag = (tab: any, type: any, file: any) => {
        switch (tab) {
            case 'Documents': {
                let allreadytagged = AllReadytagged?.length > 0 ? AllReadytagged : [];
                let notTagged = ExistingFiles?.length > 0 ? ExistingFiles : []
                if (type == 'Tag') {
                    notTagged = notTagged?.filter((item: any) => item.Id != file?.Id)
                    allreadytagged?.push(file)
                } else if (type == 'UnTag') {
                    allreadytagged = allreadytagged?.filter((item: any) => item.Id != file?.Id)
                    notTagged?.push(file)
                }
                backupExistingFiles = notTagged;
                setAllReadytagged(allreadytagged)
                setExistingFiles(notTagged)
                searchExistingFile('');
                break;
            }
            case 'Announcements': {
                let allreadytagged = AllReadyTaggedNews?.length > 0 ? AllReadyTaggedNews : [];
                let notTagged = ExistingNews?.length > 0 ? ExistingNews : [];
                if (type == 'Tag') {
                    notTagged = notTagged?.filter((item: any) => item.Id != file?.Id)
                    allreadytagged?.push(file)
                } else if (type == 'UnTag') {
                    allreadytagged = allreadytagged?.filter((item: any) => item.Id != file?.Id)
                    notTagged?.push(file)
                }
                backupExistingNews = notTagged;
                setAllReadyTaggedNews(allreadytagged)
                setExistingNews(notTagged)
                searchExistingNews('');
                break;
            }
            case 'Events': {
                let allreadytagged = AllReadyTaggedEvents?.length > 0 ? AllReadyTaggedEvents : [];
                let notTagged = ExistingEvents?.length > 0 ? ExistingEvents : [];
                if (type == 'Tag') {
                    notTagged = notTagged?.filter((item: any) => item.Id != file?.Id)
                    allreadytagged?.push(file)
                } else if (type == 'UnTag') {
                    allreadytagged = allreadytagged?.filter((item: any) => item.Id != file?.Id)
                    notTagged?.push(file)
                }
                backupExistingFiles = notTagged;
                setAllReadyTaggedEvents(allreadytagged)
                setExistingEvents(notTagged)
                searchExistingEvents('');
                break;
            }
            default:
                console.log('No Scenario Found');
                break;
        }
    }
    //End //
    //Task Types Popup

    // Add Link to Document And tag//
    const CreateLinkAndTag = async () => {
        let taggedDocument: any = {
            fileName: '',
            docType: '',
            uploaded: false,
            tagged: false,
            link: '',
            size: '',
            ID: '',
            Id: ''
        }
        let isFolderAvailable = folderExist;
        let fileName = ''
        if (isFolderAvailable == false) {
            try {
                await CreateFolder(`${props?.Context?.pageContext?.web?.serverRelativeUrl}${generatedLocalPath?.split(siteName)[0]}`, siteName).then((data: any) => {
                    isFolderAvailable = true
                    setFolderExist(true)
                })

            } catch (error) {
                console.log('An error occurred while creating the folder:', error);
            }
        }
        if (isFolderAvailable == true) {
            try {
                if (LinkToDocTitle?.length > 0) {
                    fileName = `${LinkToDocTitle}.aspx`
                } else {
                    fileName = `${props?.item?.Title}.aspx`
                }
                var vardata = '<%@ Page language="C#" %>' +
                    "<%@ Assembly Name='Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral,   PublicKeyToken=71e9bce111e9429c' %>" +
                    "<%@ Register TagPrefix='SharePoint' Namespace='Microsoft.SharePoint.WebControls' Assembly='Microsoft.SharePoint' %>" +
                    "<%@ Import Namespace='System.IO' %>" +
                    "<%@ Import Namespace='Microsoft.SharePoint' %>" +
                    "<%@ Import Namespace='Microsoft.SharePoint.Utilities' %>" +
                    "<%@ Import Namespace='Microsoft.SharePoint.WebControls' %>" +
                    '<html xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">' +
                    '<head>' +
                    "<meta name='WebPartPageExpansion' content='full' /> <meta name='progid' content='SharePoint.Link' />" +
                    '<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef,URL,IconOverlay"><xml>' +
                    '<mso:CustomDocumentProperties>' +
                    '<mso:ContentTypeId msdt:dt="string">0x01010A00A9B5E70634EEA14BBCC80A59F37723F3</mso:ContentTypeId>' +
                    '<mso:IconOverlay msdt:dt="string">|docx?d=wb030a1c46dee4fd6ac9e319218f7b63b|linkoverlay.gif</mso:IconOverlay>' +
                    '<mso:Url msdt:dt="string">' + encodeURIComponent(LinkToDocUrl) + ', ' + encodeURIComponent(LinkToDocUrl) + '</mso:Url>' +
                    '</mso:CustomDocumentProperties>' +
                    '</xml></SharePoint:CTFieldRefs><![endif]-->' +
                    '</head>' +
                    '<body>' +
                    "<form id='Form1' runat='server'>" +
                    "<SharePoint:UrlRedirector id='Redirector1' runat='server' />" +
                    '</form>' +
                    '</body>' +
                    '</html>';
                let web = new Web(`${props?.AllListId?.siteUrl}}`);
                await web.getFolderByServerRelativeUrl(selectedPath.displayPath)
                    .files.add(fileName, vardata, true).then(async (uploadedFile: any) => {
                        let fileSize = '10Kb'
                        taggedDocument = {
                            ...taggedDocument,
                            fileName: fileName,
                            docType: 'link',
                            uploaded: true,
                            link: LinkToDocUrl,
                            size: fileSize
                        }
                        setTimeout(async () => {
                            const fileItems = await getAllSitesListsItems(`${props?.AllListId?.siteUrl}}`, selectedSiteListDetails?.listId, selectedSiteListDetails.query)
                            fileItems?.map(async (file: any) => {
                                if (file?.FileDirRef != undefined && file?.FileDirRef?.toLowerCase() == selectedPath?.displayPath?.toLowerCase() && file?.FileSystemObjectType == 0 && file?.FileLeafRef == fileName) {
                                    let resultArray: any = [];
                                    resultArray.push(props?.Item?.Id);
                                    let siteColName = `${Item?.ColumnName}Id`;
                                    if (file != undefined && file.EncodedAbsUrl != undefined && file.EncodedAbsUrl != '')
                                        taggedDocument.link = file.EncodedAbsUrl;
                                    else
                                        taggedDocument.link = LinkToDocUrl;
                                    taggedDocument.Id = file?.Id;
                                    taggedDocument.ID = file?.ID;

                                    // Update the document file here
                                    let postData: any = {

                                        ItemRank: LinkDocitemRank,
                                        Title: getUploadedFileName(fileName),
                                        Url: {
                                            "__metadata": { type: "SP.FieldUrlValue" },
                                            Description: LinkToDocUrl ? LinkToDocUrl : '',
                                            Url: LinkToDocUrl ? LinkToDocUrl : ''
                                        },
                                        File_x0020_Type: 'aspx'
                                    }
                                    if (Item?.ColumnType == 'Multi') {
                                        postData[siteColName] = { "results": resultArray }
                                    } else {
                                        postData[siteColName] = props?.Item?.Id;
                                    }
                                    await web.lists.getById(Item?.listId).items.getById(file.Id)
                                        .update(postData).then((updatedFile: any) => {
                                            file[siteName].push({ Id: props?.Item?.Id, Title: props?.item?.Title });
                                            setAllReadytagged([...AllReadytagged, ...[file]])
                                            taggedDocument.tagged = true;
                                            setPageLoader(false)
                                            props?.callBack();
                                            return file;
                                        }).catch((e) => {
                                            setPageLoader(false)
                                        })
                                    console.log("File uploaded successfully.", file);
                                }
                            })
                        }, 2000);

                    });
                AllTaggedUploadDoc.push(taggedDocument)
                setUploadedDocDetails(AllTaggedUploadDoc);
                setShowConfirmation(true)
                setUploadEmailModal(false)
                // setModalIsOpenToFalse()
            } catch (error) {
                console.log("File upload failed:", error);
            }
        }
    }
    const OpenDefaultContentFolder = () => {
        setOpenDefaultContent(true)
    }
    const CancelDefaultContentFolder = () => {
        setOpenDefaultContent(false)
    }
    const ChooseDefaultContentFolderHeader = () => {
        return (
            <>
                <div className='subheading mb-0'>
                    <span className="siteColor">
                        Default Folder Content
                    </span>
                </div>
            </>
        );
    };
    const onRenderDefualtContentFooter = () => {
        return (<>
            <div className="p-2 pb-0 px-4">
            </div>
            <footer className='text-end p-2'>
                <button className="btn btn-primary me-1" onClick={() => { CancelDefaultContentFolder() }}>OK</button>
            </footer>
        </>
        );
    };
    function sanitizeFileName(fileName: any) {
        const sanitizedFileName = fileName.replaceAll(/[~#%&*{}/:<>?/+|"'-]/g, '');
        const trimmedFileName = sanitizedFileName.trim();
        const truncatedFileName = trimmedFileName.substring(0, 100);
        return truncatedFileName;
    }
    const changeFileName = (e: any) => {
        setRenamedFileName(e.target.value);
        if (e?.target?.value?.length > 0) {
            setCreateNewFile(createNewDocType?.length > 0 ? true : false)
        } else {
            setCreateNewFile(false)
        }

    }
    // Create New Folder
    const CreateFolder = async (path: any, folderName: any): Promise<any> => {
        try {
            let web = new Web(`${props?.AllListId?.siteUrl}`);
            const parentFolder = web.getFolderByServerRelativeUrl(path);
            const data = await parentFolder.folders.add(folderName);
            console.log('Folder created successfully.');
            data?.data?.ServerRelativeUrl?.replaceAll('%20', ' ');
            let newFolder = {
                parentFolderUrl: rootSiteName + path,
                FileLeafRef: folderName,
                FileDirRef: path,
                isExpanded: false,
                EncodedAbsUrl: rootSiteName + data.data.ServerRelativeUrl,
                FileSystemObjectType: 1
            }
            folders.push(newFolder);
            AllFilesAndFolderBackup.push(newFolder);
            setAllFilesAndFolder(AllFilesAndFolderBackup);
            return newFolder; // Return the folder object here
        } catch (error) {
            return Promise.reject(error);
        }
    }
    const CreateSubFolder = async () => {
        try {
            const newFolder = await CreateFolder(selectPathFromPopup, newSubFolderName);
            setSelectPathFromPopup(`${selectPathFromPopup}/${newFolder?.FileLeafRef}`)
            const toggleFolderRecursively = (folder: any) => {
                if (folder.EncodedAbsUrl === newFolder.parentFolderUrl) {
                    folder
                    let subFolders = [];
                    if (folder?.subRows?.length > 0) {
                        subFolders = folder?.subRows;
                    }
                    subFolders.push(newFolder)
                    return { ...folder, isExpanded: true, subRows: subFolders };
                }
                if (folder.subRows && folder.subRows.length > 0) {
                    return {
                        ...folder,
                        subRows: folder.subRows.map(toggleFolderRecursively)
                    };
                }
                return folder;
            };
            setAllFoldersGrouped((prevFolders: any) => {
                const updatedFolders = prevFolders.map(toggleFolderRecursively);
                return updatedFolders;
            });

            showCreateFolderLocation(false);
            setNewSubFolderName('');
        } catch (error) {
            console.error('Error creating subfolder:', error);
        }
    }

    function getFileType(fileName: any) {
        const regex = /(?:\.([^.]+))?$/;
        const match = regex.exec(fileName);
        if (match === null) {
            return null;
        }
        return match[1];
    }
    const HandleSpecialChar = (inputString: any) => {
        // Replace special characters with their proper Unicode equivalents
        let convertedString = inputString;
        Object.keys(specialCharactersMap).forEach(key => {
            const value = specialCharactersMap[key];
            convertedString = convertedString.replace(new RegExp(key, 'g'), value);
        });
        return convertedString;
    }
    const specialCharactersMap: { [key: string]: string } = {
        'Ã¤': 'ä',
        'Ã¼': 'ü',
        'Ã¶': 'ö',
        'ÃŸ': 'ß',
        'Ã„': 'Ä',
        'Ãœ': 'Ü',
        'Ã–': 'Ö',
        'Ã©': 'é',
    };
    // Main Popup Header//
    const onRenderCustomHeaderMain = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                    <span className="siteColor">
                        {`Add & Connect Tool - ${props?.Item.Title != undefined ? props?.Item.Title : ""} `}
                    </span>
                </div>
                <Tooltip ComponentId="7640" />
            </>
        );
    };
    const selectedTab = (tab: any) => {

    }
    const isItemExists = (item: any, taggedItems: any) => {
        var isExists = false;
        taggedItems?.forEach((taggedItem: any) => {
            if (item.Id == taggedItem.Id && item.siteType == taggedItem.siteType) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const isItemExistsInCollection = (array: any, columnName: any, value: any) => {
        var index = -1;
        array?.forEach((item: any, itemIndex: any) => {
            if (item[columnName] == value)
                index = itemIndex;
        });
        return index
    }
    const getOtherDocumentTabItems = (Listitem: any) => {
        var AllDocumentsItems = Listitem.Items;
        Listitem.Items = [];
        AllDocumentsItems?.forEach((item: any) => {
            var flag = true;
            if (item.Document_x002d_Type != undefined && (item.Document_x002d_Type.toLowerCase().indexOf('website') > -1 || item.Document_x002d_Type.toLowerCase().indexOf('video mode') > -1 || item.Document_x002d_Type.toLowerCase().indexOf('presentation mode') > -1)) {
                var flag = false;
            }
            if (flag) {
                item.ListName = 'Documents';
                item.itemType = 'Document';
                Listitem.Items.push(item);
            }
        })
        // var allDocumentItems: any = [];
        AllDocumentsItems?.forEach((tab: any) => {
            tab.taggedItems = getTaggedItems(tab.Items);
            tab.notTaggedItems = getExistingItems(tab.taggedItems, tab.Items);
            tab.Title = tab.Title;
            // allDocumentItems.push(tab);
        })
        Listitem.taggedItems = getTaggedItems(Listitem.Items);
        Listitem.notTaggedItems = getExistingItems(Listitem.taggedItems, Listitem.Items);

        ListsData?.forEach((replaceItem: any, index: any) => {
            if (replaceItem.Title == Listitem.Title) {
                ListsData[index] = Listitem;
            }

        })
        // return allDocumentItems;
    }
    const getExistingItems = (taggedItems: any, AllItems: any) => {
        var ExistingItems: any = [];
        AllItems?.forEach((item: any) => {
            if (!isItemExists(item, taggedItems)) {
                ExistingItems.push(item);
            }
        })
        return ExistingItems;
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
                            if (item.TaskId == props?.Item?.Id && item.listId == props?.AllListId?.SmartMetadataListID ) {
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
    const loadAllSitesListsItems = (tab: any, call_method: any) => {
        var counter: any = 0;
        folders = [];
        AllFilesAndFolderBackup = []
        let ListConfigTocall = AllSiteConfig?.filter((List: any) => List?.ListName == tab);
        ListConfigTocall?.forEach((site: any) => {
            let baseSiteUrl = props?.AllListId?.siteUrl;
            getAllSitesListsItems(baseSiteUrl, site.listId, site.query, site.itemType)
                .then(function (dataItems: any) {
                    counter++;
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
                            item.EncodedAbsUrl = item?.EncodedAbsUrl.replaceAll('%20', ' ');
                            item.parentFolderUrl = rootSiteName + item?.FileDirRef;
                            folders.push(item);
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
                        ListsData.push({ Title: site.ListName, Items: dataItems });
                    }
                    else {
                        dataItems?.forEach((listData: any) => {
                            ListsData[index].Items.push(listData);
                        })
                    }
                    if (ListConfigTocall.length == counter) {
                        ListsData?.forEach((Listitem: any, index: any) => {
                            if (Listitem.Items.length > 0 && Listitem.Title != "Documents") {
                                Listitem.taggedItems = getTaggedItems(Listitem.Items);
                                Listitem.notTaggedItems = getExistingItems(Listitem.taggedItems, Listitem.Items);
                            }
                            if (Listitem.Items.length > 0 && Listitem.Title == "Documents") {
                                let otherDocumentTabsItems: any = getOtherDocumentTabItems(Listitem);
                                otherDocumentTabsItems?.forEach((otherDocumentTabItem: any) => {
                                    ListsData.push(otherDocumentTabItem);
                                })
                            }
                        })
                        let DefaultFolderItems: any = []
                        let FolderPath: any;
                        if (folderUrl)
                            FolderPath = folderUrl
                        if (!folderUrl) {
                            folderStructureCreateInfo.forEach((item: any) => {
                                if (item.siteType == siteTypeCheck) {
                                    setfolderUrl(props?.AllListId?.Context?.pageContext?.web?.serverRelativeUrl + item.defaultFolderUrl);
                                    FolderPath = props?.AllListId?.Context?.pageContext?.web?.serverRelativeUrl + item.defaultFolderUrl
                                    setSelectedPath({
                                        ...selectedPath,
                                        displayPath: FolderPath,
                                        completePath: FolderPath
                                    })
                                }
                            })
                        }
                        ListsData?.forEach((item: any) => {
                            if (tab == 'Documents' && tab == item?.Title) {
                                AllFilesAndFolderBackup = folders;
                                item.FolderItems = [];
                                item?.notTaggedItems.forEach((taggedItem: any) => {
                                    if ((FolderPath != undefined && taggedItem.FileDirRef != undefined) && (FolderPath.toLowerCase() == taggedItem.FileDirRef.toLowerCase() || FolderPath.toLowerCase() == taggedItem.FileDirRef.toLowerCase() + '/')) {
                                        DefaultFolderItems.push(taggedItem);
                                        item.FolderItems.push(taggedItem);
                                    }
                                });
                                if (folders?.length > 0) {
                                    let groupedFolder: any = createGrouping()
                                    setAllFoldersGrouped(groupedFolder);
                                }
                                selectSiteFolderDocument(Item, '')
                                // checkFolderExistence(props?.Item?.Title, `${rootSiteName}${folderUrl}`);
                                setAllReadytagged(item?.taggedItems)
                                setExistingFiles(item?.notTaggedItems)
                                backupExistingFiles = item?.notTaggedItems;
                                setCurrentFolderFiles(DefaultFolderItems)
                                backupCurrentFolder = DefaultFolderItems
                            }
                            else if (tab == 'Announcements' && tab == item?.Title) {
                                setAllReadyTaggedNews(item?.taggedItems)
                                setExistingNews(item?.notTaggedItems)
                                backupExistingNews = item?.notTaggedItems;
                            }
                            else if (tab == 'Events' && tab == item?.Title) {
                                setAllReadyTaggedEvents(item?.taggedItems)
                                setExistingEvents(item?.notTaggedItems)
                                backupExistingEvents = item?.notTaggedItems;
                            }
                        });

                        console.log(ListsData)
                    }
                }).catch((error: any) => {
                    console.log(error)
                });
        });
    }
    const showConnectTool = (tab: any) => {
        sethide_tab(false)
        setsiteTypeCheck(siteName)
        setSelectedTiles(tab)
        if (loadDataFlag) {
            loadDataFlag = true;
            loadAllSitesListsItems(tab, 'tiles');
        }
        if (tab == 'Documents')
            selectedTab('Documents')
        if (tab == 'Events')
            selectedTab('Events')
        if (tab == 'Announcements')
            selectedTab('Announcements')
    }
    const loadAdminConfigurations = async (ancDetails_data: any) => {
        let web = new Web(props?.AllListId?.siteUrl );
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
                let AllSiteConfig: any = [];
                let folderStructureSourceLists: any = [];
                let folderCreateInfo: any = [];
                webPartInfoConfig?.forEach((siteItem: any) => {
                    siteItem?.sourceList?.forEach((item: any) => {
                        AllSiteConfig.push(item)
                        if (siteItem?.Title == 'Documents') {
                            folderStructureSourceLists.push(item);
                        }
                    })
                })
                setAllSiteConfig(AllSiteConfig);
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
                            setItem(item)
                        }
                    })
                    ancDetails_data?.forEach((item: any) => {
                        if (item?.webpartid == props?.webpartId) {
                            anc_details = item;
                            setshowRadioButton(item?.showRadioButtons);
                            setisUpdateDefaultFolder(item?.updateDefaultFolder)
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
                }
            }
        }
    }
    const getAncDetails = async () => {
        let web = new Web(props?.AllListId?.siteUrl);
        let Data: any = await web.lists.getById(props?.AllListId?.RootAdminConfigListId).items.select("Id,Title,Value,Key,Configurations").top(4999).filter("Key eq 'AncDetails'").get();
        if (Data[0] != undefined) {
            loadAdminConfigurations(globalCommon.parseJSON(Data[0]?.Configurations));
        }
    }
    const selectSiteFolderDocument = (siteItem: any, action: any) => {
        setSelectPathFromPopup('')
        let item = siteItem;
        item.FolderLocation = `${props?.AllListId?.siteUrl}`
        item.FolderLocation = item?.FolderLocation?.toLowerCase();
        let path = `${item.FolderLocation}${siteItem?.defaultFolderUrl}`
        if (item.FolderLocation) {
            setfolderUrl(path.split(rootSiteName)[1].toLowerCase());
            setSelectedPath({
                completePath: path.split(rootSiteName)[1].toLowerCase(),
                displayPath: path.split(rootSiteName)[1].toLowerCase()
            })
            checkFolderExistence(props?.Item?.Title, path.toLowerCase());
        }
        selectedSiteListDetails = item
        setItem(item)
        setsiteTypeCheck(siteItem?.siteType)
    }

    const init = (item: any) => {
        item.Id = item.ID;
        if (item?.Title != undefined)
            item.Title = item.Title?.replace(/[\\/:*?"<>|#{}%~&]/g, '-')
        if (!item?.FolderLocation) {
            item.FolderLocation = props?.AllListId?.siteUrl.toLowerCase();
        }
        item.SiteUrl = item.FolderLocation;
        try {
            siteTitle = "Main Site"
            setsiteName("Main Site");
            setsiteTypeCheck("Main Site");

        } catch (e) {
            setsiteName("Main Site");
            setsiteTypeCheck("Main Site");
        }
        selectedSiteListDetails = item
        setItem(item)

        getAncDetails()
    }

    const getMainItem = async (SiteURl: any, ListID: any, Query: any, filter: any) => {
        try {
            let web = new Web(SiteURl);
            let Item = await web.lists.getById(ListID).items.select(Query).filter(filter).getAll();
            if (Item[0] == undefined)
                Item[0] = {}
            init(Item[0]);
        } catch (error) {
            console.log("This is main data receive : " + error);
            console.error(error);
        }
    }
    const getMainItemData = () => {
        let Query = "*,Author/Title,Editor/Title,Parent/Id,Parent/Title&$expand=Parent,Author,Editor&$orderby=Title"
        let filter = `Id eq ${props?.Item?.Id}`
        getMainItem(props?.AllListId?.SitesListUrl , props?.AllListId?.SmartMetadataListID , Query, filter)
    }
    // Choose Path Folder
    const cancelPathFolder = () => {
        setChoosePathPopup(false);
        setNewSubFolderName('')
        showCreateFolderLocation(false);
        setUploadEmailModal(false);
        setTaskTypesPopup(false);
    }
    const checkFolderExistence = (title: any, path: any) => {
        if (!path?.toLowerCase()?.includes(rootSiteName?.toLowerCase())) {
            path = rootSiteName + path;
        }
        let result = AllFilesAndFolderBackup?.some((existingFolder: any) => existingFolder?.FileLeafRef == title && existingFolder?.FileSystemObjectType == 1 && existingFolder?.parentFolderUrl?.toLowerCase() == path?.toLowerCase())
        setFolderExist(result)
    }
    const selectFolderToUpload = () => {
        const temp = selectPathFromPopup.split("/")
        if (selectPathFromPopup?.length > 0) {
            setfolderUrl(selectPathFromPopup.toLowerCase())
            setSelectedPath({
                completePath: selectPathFromPopup.toLowerCase(),
                displayPath: selectPathFromPopup.toLowerCase()
            })
        }
        setChoosePathPopup(false);
        showCreateFolderLocation(false);
        setTaskTypesPopup(false);
    }
    const ChoosePathCustomHeader = () => {
        return (
            <>
                <div className='subheading'>
                    {/* <img className="imgWid29 pe-1 mb-1 " src={Item?.SiteIcon} /> */}
                    Select Upload Folder
                </div>
                <Tooltip ComponentId="7643" />
            </>
        );
    };
    //End//
    const ChoosePathCustomHeaderEmail = () => {
        return (
            <>
                <div className='subheading'>
                    {/* <img className="imgWid29 pe-1 mb-1 " src={Item?.SiteIcon} /> */}
                    Upload Email
                </div>
                <Tooltip ComponentId="7641" />
                {/* <Tooltip ComponentId="528" /> */}
            </>
        );
    };
    const onRenderCustomFooterMain = () => {
        return (<>

            <div className="p-2 pb-0 px-4">
                <div>
                    <Row className='mb-1'><span className='highlightedGreen'>{selectPathFromPopup?.length > 0 ? `${selectPathFromPopup}` : ''}</span></Row>
                    {CreateFolderLocation ?
                        <Row>
                            <div className='col-md-9'><input type="text" className='form-control' placeholder='Folder Name' value={newSubFolderName} onChange={(e) => setNewSubFolderName(e.target.value)} /></div>
                            <div className='col-md-3 pe-0'><button className="btn btn-primary pull-right" disabled={newSubFolderName?.length > 0 ? false : true} onClick={() => { CreateSubFolder() }}>Create Folder</button></div>
                        </Row> : ''}
                </div>

            </div>
            <footer className='text-end p-2'>

                {selectPathFromPopup?.length > 0 && CreateFolderLocation != true ?

                    <button className='btn btn-primary me-1' onClick={() => showCreateFolderLocation(true)}>
                        Create Folder
                    </button>
                    : ''}
                <button className="btn btn-primary me-1" disabled={selectPathFromPopup?.length > 0 ? false : true} onClick={() => { selectFolderToUpload() }}>Select</button>
                <button className='btn btn-default ' onClick={() => cancelPathFolder()}>Cancel</button>
            </footer>
        </>
        );
    };
    const handleToggle = (clickedFolder: any) => {
        const toggleFolderRecursively = (folder: any) => {
            if (folder.EncodedAbsUrl === clickedFolder.EncodedAbsUrl) {
                return { ...folder, isExpanded: !folder.isExpanded };
            }
            if (folder.subRows && folder.subRows.length > 0) {
                return {
                    ...folder,
                    subRows: folder.subRows.map(toggleFolderRecursively)
                };
            }
            return folder;
        };

        setAllFoldersGrouped((prevFolders: any) => {
            const updatedFolders = prevFolders.map(toggleFolderRecursively);
            return updatedFolders;
        });
    };
    const Folder = ({ folder, onToggle }: any) => {
        const hasChildren = folder.subRows && folder.subRows.length > 0;

        const toggleExpand = () => {
            onToggle(folder);
        };

        return (
            <li style={{ listStyle: 'none' }}>
                <span className='alignCenter' >
                    <span className='me-1'>
                        {hasChildren ? (
                            folder.isExpanded ? <SlArrowDown onClick={toggleExpand} /> : <SlArrowRight onClick={toggleExpand} />
                        ) : (
                            <SlArrowDown style={{ color: 'white' }} />
                        )}
                    </span>
                    <span className='svg__iconbox svg__icon--folder me-1 wid30'></span>
                    <span className={`${rootSiteName}${selectPathFromPopup}` === folder.EncodedAbsUrl ? "highlightedGreen hreflink" : "hreflink"} onClick={() => setFolderPathFromPopup(folder.EncodedAbsUrl)}>{folder.FileLeafRef}</span>
                </span>

                {hasChildren && folder.isExpanded && (
                    <ul>
                        {folder.subRows.map((subFolder: any) => (
                            <Folder key={subFolder.name} folder={subFolder} onToggle={onToggle} />
                        ))}
                    </ul>
                )}
            </li>
        );
    };
    const setFolderPathFromPopup = (folderName: any) => {
        let selectedfolderName = folderName.split(rootSiteName)[1];
        setFolderExist(true)
        setSelectPathFromPopup(selectedfolderName === selectPathFromPopup ? '' : selectedfolderName);
    };
    // Confirmation Popup Functions//
    const cancelConfirmationPopup = () => {
        setShowConfirmation(false)
        setUploadEmailModal(false)
        setShowConfirmationInside(false)
        setUploadedDocDetails([]);
        AllTaggedUploadDoc = [];
        AllDragItem = [];
    }
    const editDocumentsLink = (editData: any) => {
        setEditdocpanel(true);
        console.log(editData)
        setEditdocData(editData)
    }
    const showAllExistingItems = (type: any) => {
        if (type == 'Events')
            setShowExistingEvents(true)
        else if (type == 'News')
            setShowExistingNews(true)
    };
    useEffect(() => {
        try {
            const sp = spfi(...props.AllListId.Context)
            const user = sp.web.getFolderByServerRelativePath("{folder relative path}").files.getByUrl("name.txt").getLockedByUser();
            let Context: any = props.AllListId.Context
            rootSiteName = props?.AllListId?.siteUrl
            props.Context = Context
            rootSiteName = props.Context.pageContext.web.absoluteUrl
        } catch (error) {

        }
        getMainItemData()
    }, [])
    const createGrouping = (): any[] => {
        const groupedFolder: any[] = [];
        let copyFolders = GlobalFunction?.deepCopy(folders);
        const findChildren = (parent: any): void => {
            const children = copyFolders?.filter((item: any) => item?.parentFolderUrl === parent?.EncodedAbsUrl);
            if (children?.length > 0) {
                for (const child of children) {
                    if (!child?.subRows) {
                        child.subRows = [];
                    }
                    parent?.subRows?.push(child);
                    copyFolders?.splice(copyFolders?.indexOf(child), 1);
                    findChildren(child);
                }
            }
        };

        while (copyFolders?.length > 0) {
            const folder = copyFolders[0];
            if (!copyFolders.some((item: any) => item?.EncodedAbsUrl === folder?.parentFolderUrl)) {
                folder.subRows = [];
                copyFolders?.splice(0, 1);
                groupedFolder?.push(folder);
                findChildren(folder);
            } else {
                copyFolders.splice(0, 1); // Skip folders that have parents for now
            }
        }
        return groupedFolder;
    };
    return (
        <>
            <div className={"mb-3 card addconnect boxshadow"}>
                <div className='card-header'>
                    <CardTitle className="h5 d-flex justify-content-between align-items-center mb-0">Add & Connect Tool
                        {/* <span><Tooltip ComponentId='324' /></span> */}
                    </CardTitle>
                </div>
                <CardBody>
                    <Row>
                        <div className="text-center">
                            <a onClick={() => { setModalIsOpen(true) }}>
                                Click here to add more content
                            </a>
                        </div>
                    </Row>
                </CardBody>
            </div>
            <Panel
                type={PanelType.large}
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                onRenderHeader={onRenderCustomHeaderMain}
                isBlocking={false}>
                {hide_tab != false && <div id="tilesItems" className="Tile-Style3 justify-center">
                    {Show_Document && <a id="Document" onClick={() => showConnectTool('Documents')} className="tile">
                        <span>
                            Documents
                            <div>
                                <img src={`${props?.AllListId?.siteUrl}/PublishingImages/Tiles/Tile_LibraryBooks.png`} className="d-block" title="Documents" />
                            </div>
                        </span>
                    </a>}
                    {show_event && <a id="Events" onClick={() => showConnectTool('Events')} className="tile">
                        <span>
                            Events
                            <div>
                                <img src={`${props?.AllListId?.siteUrl}/PublishingImages/Tiles/Tile_Events.png`} className="d-block" title="Events" />
                            </div>
                        </span>
                    </a>}
                    {show_news && <a id="News" onClick={() => showConnectTool('Announcements')} className="tile">
                        <span>
                            News
                            <div>
                                <img src={`${props?.AllListId?.siteUrl}/PublishingImages/Tiles/Tile_News.png`} className="d-block" title="News" />
                            </div>
                        </span>
                    </a>}
                </div>}
                {hide_tab != true && <div id="addConnectTooltabs">
                    <ModalBody>
                        <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                            <button className={SelectedTiles == "Documents" || SelectedTiles == "" ? "nav-link active" : "nav-link"} onClick={() => showConnectTool('Documents')} id="Documnets-Tab" data-bs-toggle="tab" data-bs-target="#Documents" type="button" role="tab" aria-controls="Documents" aria-selected="true">
                                Documents
                            </button>
                            <button className={SelectedTiles == "Events" || SelectedTiles == "" ? "nav-link active" : "nav-link"} onClick={() => showConnectTool('Events')} id="Events-Tab" data-bs-toggle="tab" data-bs-target="#Events" type="button" role="tab" aria-controls="Events" aria-selected="true">
                                Events
                            </button>
                            <button className={SelectedTiles == "Announcements" || SelectedTiles == "" ? "nav-link active" : "nav-link"} onClick={() => showConnectTool('Announcements')} id="News-Tab" data-bs-toggle="tab" data-bs-target="#News" type="button" role="tab" aria-controls="News" aria-selected="true">
                                News
                            </button>
                        </ul>
                        <div className="border border-top-0 clearfix p-3 tab-content Anctoolpopup " id="myTabContent">
                            <div className={SelectedTiles == "Documents" || SelectedTiles == "" ? "tab-pane  show active" : "tab-pane  show"} id="Documents" role="tabpanel" aria-labelledby="Documents">
                                <div>
                                    <h3 className="pageTitle full-width siteColor pb-1 siteBdrBottom">
                                        1. Upload a Document
                                    </h3>
                                    <Row>
                                        <Col xs={6}>
                                            {folderStructureCreateInfo.length > 1 && (
                                                <>
                                                    <label className="mb-4">Permission Level <span className="required"> *</span> </label>

                                                    <div className="input-group general-section">
                                                        {folderStructureCreateInfo.map((item) => (
                                                            item.siteType !== 'Joint' && (
                                                                <>
                                                                    <label className="SpfxCheckRadio" onClick={() => selectSiteFolderDocument(item, 'selected')}>
                                                                        <input className="radio" checked={item.siteType === siteTypeCheck}
                                                                            type="radio" value={item?.siteType}
                                                                        />
                                                                        {item.altname ? item.altname : item.siteType}
                                                                    </label>
                                                                </>
                                                            )
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                            <div> <label className='form-label full-width fw-semibold'>Select Upload Folder </label></div>
                                            <div className='alignCenter'>
                                                {selectPathFromPopup?.length > 0 ?
                                                    <span>{selectPathFromPopup?.replace("Shared Documents", "Documents")}</span>
                                                    : <>
                                                        {folderExist == false ?
                                                            <>
                                                                <span>{folderUrl?.replace("Shared Documents", "Documents")}  <span className='highlighted'>/{props?.Item?.Title}
                                                                    <CustomToolTip Description={'Highlighted folder does not exist. It will be created at the time of document upload.'} />
                                                                </span></span>
                                                            </>
                                                            :
                                                            <span>{folderUrl?.replace("Shared Documents", "Documents")}/{props?.Item?.Title}</span>
                                                        }
                                                    </>}

                                                <span><a title="Click for Associated Folder" className='ms-2 siteColor' onClick={() => setChoosePathPopup(true)} > Change Path </a></span>
                                            </div>
                                            <div className='my-2'><label className='form-label fw-semibold'>All files in default folder:</label><span><a title="Default Folder Content" className='hreflink ms-2 siteColor' onClick={() => OpenDefaultContentFolder()} > View </a></span></div>

                                            <div>
                                                <div className='input-group'>
                                                    <label className='form-label full-width fw-semibold'>Search Existing Document</label>
                                                    <input id="searchinputCED" type="search" onChange={(e) => { searchExistingFile(e.target.value) }} placeholder="Search..." className="form-control" />
                                                </div>
                                                {ShowExistingDoc == true && <div className="Alltable mt-2">
                                                    <div>
                                                        {/* <GlobalCommanTable headerOptions={headerOptions} paginatedTable={true} columns={columns} data={ExistingFiles} callBackData={callBackData} showHeader={true} /> */}
                                                        {ExistingFiles?.length > 0 ?
                                                            <Table hover responsive className='mb-0'>
                                                                <thead className='fixed-Header top-0'>
                                                                    <tr>
                                                                         <th style={{ width: "5%" }}>Type</th>
                                                                        <th style={{ width: "80%" }}>Title</th>
                                                                        <th style={{ width: "13%" }}>Rank</th>
                                                                        <th style={{ width: "1%" }}>&nbsp;</th>
                                                                    </tr>

                                                                </thead>
                                                                <tbody className='Scrolling'>
                                                                    {ExistingFiles?.map((file: any) => {
                                                                        if (!AllReadytagged?.some((doc: any) => file?.Id == doc?.Id)) {
                                                                            return (
                                                                                <tr>
                                                                                    <td><span className={`mt-1 svg__iconbox svg__icon--${file?.docType}`} title={file?.File_x0020_Type}></span></td>
                                                                                    <td><a style={{ wordBreak: "break-all" }} href={`${file?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off" >{file?.Title}</a></td>
                                                                                    <td>{file?.ItemRank}</td>
                                                                                    <td> <span style={{ marginLeft: '6px' }} title='tag Document' onClick={() => { tagSelectedDoc(file) }} className='mt-1 svg__iconbox svg__icon--tag grey hreflink dark'></span></td>
                                                                                </tr>
                                                                            )
                                                                        }

                                                                    })}


                                                                </tbody>
                                                            </Table>
                                                            :
                                                            <div className="No_Documents">
                                                                No Documents Available
                                                            </div>
                                                        }
                                                    </div>
                                                </div>}
                                            </div>
                                        </Col>
                                        <Col xs={6}>
                                            <div>
                                                <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                                                    <button className="nav-link active" id="UPLOAD-Tab" data-bs-toggle="tab" data-bs-target="#UPLOAD" type="button" role="tab" aria-controls="UPLOAD" aria-selected="true">
                                                        UPLOAD
                                                    </button>
                                                    <button className="nav-link" id="DRAGDROP-Tab" data-bs-toggle="tab" data-bs-target="#DRAGDROP" type="button" role="tab" aria-controls="DRAGDROP" aria-selected="true">
                                                        DRAG & DROP
                                                    </button>
                                                    <button className="nav-link" id="LINKTO-Tab" data-bs-toggle="tab" data-bs-target="#LINKTO" type="button" role="tab" aria-controls="LINKTO" aria-selected="true">
                                                        LINK TO
                                                    </button>
                                                </ul>
                                                <div className="border border-top-0 clearfix p-3 tab-content Anctoolpopup " id="myTabContent">
                                                    <div className="tab-pane show active" id="UPLOAD" role="tabpanel" aria-labelledby="UPLOAD">
                                                        <label className='form-label full-width fw-semibold'>Item Rank
                                                            <span className='hover-text'>
                                                                <span className='alignIcon svg__iconbox svg__icon--info dark'></span>
                                                                <span className='tooltip-text pop-right fw-normal'>
                                                                    Select Importance and where it should show: 8 =Top highlight(Shows under highlight item list), 7=featured (shows on featured item list on homepage), 6=key item (shows on right list on homepage and as key item on featured profile pages,5=relevant (shows on profile pages), 4= background item (....), 2= to be verified (...)  1= Archive (...) ,  0= no show (does not show in any list but in search results)
                                                                </span></span>
                                                        </label>
                                                        <Dropdown className='full-width'
                                                            id="ItemRankUpload"
                                                            options={itemRanks.map((rank) => ({ key: rank?.rank, text: rank?.rankTitle }))}
                                                            selectedKey={itemRank}
                                                            onChange={(e, option) => handleRankChange(option?.key, 'Upload')}
                                                            styles={{ dropdown: { width: '100%' } }}
                                                        />
                                                        <div className='my-2'>
                                                            <form>
                                                                <input type="file" onChange={handleFileInputChange} className='form-control' ref={fileInputRef} /></form>
                                                        </div>
                                                        <div className='mb-2 input-group'>
                                                            <label className='form-label full-width fw-semibold'>Rename The Document</label>
                                                            <input type="text" onChange={(e) => { setRenamedFileName(e.target.value) }} value={renamedFileName} placeholder='Rename The Document' className='form-control' />
                                                        </div>
                                                        <button onClick={handleUpload} disabled={selectedFile?.name?.length > 0 ? false : true} className="btn btn-primary my-1  float-end">Upload</button>
                                                    </div>
                                                    <div className="tab-pane show" id="DRAGDROP" role="tabpanel" aria-labelledby="DRAGDROP">
                                                        <div className='input-group'>
                                                            <label className='form-label full-width fw-semibold'>Item Rank
                                                                <span className='hover-text'>
                                                                    <span className='alignIcon svg__iconbox svg__icon--info dark'></span>
                                                                    <span className='tooltip-text pop-right fw-normal'>
                                                                        Select Importance and where it should show: 8 =Top highlight(Shows under highlight item list), 7=featured (shows on featured item list on homepage), 6=key item (shows on right list on homepage and as key item on featured profile pages,5=relevant (shows on profile pages), 4= background item (....), 2= to be verified (...)  1= Archive (...) ,  0= no show (does not show in any list but in search results)
                                                                    </span></span>
                                                            </label>
                                                            <Dropdown className='full-width'
                                                                id="ItemRankLinkDoc"
                                                                options={itemRanks.map((rank) => ({ key: rank?.rank, text: rank?.rankTitle }))}
                                                                selectedKey={LinkDocitemRank}
                                                                onChange={(e, option) => handleRankChange(option?.key, 'DRAGDROP')}
                                                                styles={{ dropdown: { width: '100%' } }}
                                                            />
                                                        </div>
                                                        <div className='dragDropbox mt-2' onDragOver={(event) => event.preventDefault()} onDrop={handleFileDrop}>
                                                            {selectedFile ? <p>Selected file: {selectedFile.name}</p> : <p>Drag and drop file here </p>}
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane show" id="LINKTO" role="tabpanel" aria-labelledby="LINKTO">
                                                        <Col>
                                                            <Col className='pe-0'>
                                                                <div className='input-group'>
                                                                    <label className='form-label full-width fw-semibold'>Item Rank
                                                                        <span className='hover-text'>
                                                                            <span className='alignIcon svg__iconbox svg__icon--info dark'></span>
                                                                            <span className='tooltip-text pop-right fw-normal'>
                                                                                Select Importance and where it should show: 8 =Top highlight(Shows under highlight item list), 7=featured (shows on featured item list on homepage), 6=key item (shows on right list on homepage and as key item on featured profile pages,5=relevant (shows on profile pages), 4= background item (....), 2= to be verified (...)  1= Archive (...) ,  0= no show (does not show in any list but in search results)
                                                                            </span></span>
                                                                    </label>
                                                                    <Dropdown className='full-width'
                                                                        id="ItemRankLinkDoc"
                                                                        options={itemRanks.map((rank) => ({ key: rank?.rank, text: rank?.rankTitle }))}
                                                                        selectedKey={LinkDocitemRank}
                                                                        onChange={(e, option) => handleRankChange(option?.key, 'linkDoc')}
                                                                        styles={{ dropdown: { width: '100%' } }}
                                                                    /></div>
                                                            </Col>
                                                            <Col className='col mb-2'>
                                                                <div className='input-group'>
                                                                    <label className='form-label full-width fw-semibold'>Name</label>
                                                                    <input type="text" placeholder='Name' onChange={(e) => { setLinkToDocTitle(e.target.value) }} value={LinkToDocTitle} className='form-control' />
                                                                </div>
                                                            </Col>
                                                            <Col className='clearfix col mb-2'>
                                                                <div className='input-group'>
                                                                    <label className='form-label full-width fw-semibold'>URL</label>
                                                                    <input type="text" onChange={(e) => { setLinkToDocUrl(decodeURIComponent(e.target.value)) }} value={LinkToDocUrl} placeholder='Url' className='form-control' />
                                                                </div>
                                                            </Col>

                                                            <Col>
                                                                <button disabled={(LinkToDocUrl?.length > 0 && LinkToDocTitle?.length > 0) ? false : true} className="btn btn-primary mt-2 my-1  float-end px-3" onClick={() => { CreateLinkAndTag() }}>Create</button>
                                                            </Col>
                                                        </Col>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <Row className='mt-2'>
                                    <Col xs={12}>
                                        <div className="panel">
                                            <h3 className="pageTitle pb-1 siteColor siteBdrBottom">
                                                2. Already Tagged Documents
                                            </h3>
                                            <div className='Alltable'>
                                                {AllReadytagged?.length > 0 ?
                                                    <div>
                                                        <Table className='mb-0' hover responsive>
                                                            <thead className='fixed-Header top-0'>
                                                                <tr>
                                                                    <th style={{ width: "1%" }}>Type</th>
                                                                    <th style={{ width: "39%" }}>Title</th>
                                                                    <th style={{ width: "7%" }}>Rank</th>
                                                                    <th style={{ width: "16%" }}>Date</th>
                                                                    <th style={{ width: "35%" }}>Location folder</th>
                                                                    <th style={{ width: "1%" }}>&nbsp;</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {AllReadytagged?.map((file: any) => {
                                                                    return (
                                                                        <tr>
                                                                            <td><span className={`mt-1 svg__iconbox svg__icon--${file?.docType}`} title={file?.docType}></span></td>
                                                                            <td><a href={`${file?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off" >{file?.Title}</a></td>
                                                                            <td>{file?.ItemRank}</td>
                                                                            <td>{file?.Created}</td>
                                                                            <td>{file?.FileDirRef}</td>
                                                                            <td> <span
                                                                                style={{ marginLeft: '6px' }}
                                                                                title='Untag Document'
                                                                                onClick={() => { tagSelectedDoc(file) }}
                                                                                className='mt-1 svg__iconbox svg__icon--cross dark hreflink'
                                                                            ></span></td>
                                                                        </tr>
                                                                    )
                                                                })}


                                                            </tbody>
                                                        </Table>

                                                    </div>
                                                    :
                                                    <div className="No_Documents">
                                                        No Documents Tagged
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className={SelectedTiles == "Events" || SelectedTiles == "" ? "tab-pane  show active" : "tab-pane  show"} id="Events" role="tabpanel" aria-labelledby="Events">
                                <div>
                                    <Row>
                                        <Col xs={12}>
                                            <div>
                                                <div className='input-group'>
                                                    <label className='form-label full-width fw-semibold'>1. Create Events</label>
                                                </div>
                                                <a className="alignCenter" href={`${props?.AllListId?.siteUrl}/SitePages/EventManagement.aspx?ParentId=${Item?.Id}&TaxType=${Item?.TaxType}`}
                                                    target="_blank" data-interception="off"  >
                                                    <Add16Regular />
                                                    Create New Event
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <div>
                                                <div className='input-group'>
                                                    <label className='form-label full-width fw-semibold'>2. Connect Existing Events</label>
                                                    <a className=" pull-right" onClick={() => showAllExistingItems('Events')}  >  Show all Events
                                                    </a>
                                                    <input id="searchinputCEE" type="search" onChange={(e) => { searchExistingEvents(e.target.value) }} placeholder="Search..." className="form-control" />
                                                </div>
                                                {ShowExistingEvents == true && <div className="Alltable mt-2">
                                                    <div>
                                                        {ExistingEvents?.length > 0 ?
                                                            <Table hover responsive className='mb-0'>
                                                                <thead className='fixed-Header top-0'>
                                                                    <tr>
                                                                        <th style={{ width: "39%" }}>Title</th>
                                                                        <th style={{ width: "7%" }}>Rank</th>
                                                                        <th style={{ width: "16%" }}>Date</th>
                                                                        <th style={{ width: "35%" }}>Location folder</th>
                                                                        <th style={{ width: "1%" }}>&nbsp;</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody className='Scrolling'>
                                                                    {ExistingEvents?.map((file: any) => {
                                                                        if (!AllReadyTaggedEvents?.some((doc: any) => file?.Id == doc?.Id)) {
                                                                            return (
                                                                                <tr>

                                                                                     <td><a style={{ wordBreak: "break-all" }} href={`${file?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off" >{file?.Title}</a></td>
                                                                                    <td>{file?.ItemRank}</td>
                                                                                    <td>{file?.Created}</td>
                                                                                    <td>{file?.FileDirRef}</td>
                                                                                    <td> <span style={{ marginLeft: '6px' }} title='tag Document' onClick={() => { tagSelectedDoc(file) }} className='mt-1 svg__iconbox svg__icon--tag grey hreflink dark'></span></td>
                                                                                </tr>
                                                                            )
                                                                        }
                                                                    })}
                                                                </tbody>
                                                            </Table>
                                                            :
                                                            <div className="No_Documents">
                                                                No Events Available
                                                            </div>
                                                        }
                                                    </div>
                                                </div>}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <Row className='mt-2'>
                                    <Col xs={12}>
                                        <div className="panel">
                                            <h3 className="pageTitle pb-1 siteColor siteBdrBottom">
                                                Already Tagged Events
                                            </h3>
                                            <div className='Alltable'>
                                                {AllReadyTaggedEvents?.length > 0 ?
                                                    <div>
                                                        <Table className='mb-0' hover responsive>
                                                            <thead className='fixed-Header top-0'>
                                                                <tr>

                                                                    <th style={{ width: "39%" }}>Title</th>
                                                                    <th style={{ width: "7%" }}>Rank</th>
                                                                    <th style={{ width: "16%" }}>Date</th>
                                                                    <th style={{ width: "35%" }}>Location folder</th>
                                                                    <th style={{ width: "1%" }}>&nbsp;</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {AllReadyTaggedEvents?.map((file: any) => {
                                                                    return (
                                                                        <tr>
                                                                            <td><a href={`${file?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off" >{file?.Title}</a></td>
                                                                            <td>{file?.ItemRank}</td>
                                                                            <td>{file?.Created}</td>
                                                                            <td>{file?.FileDirRef}</td>
                                                                            <td> <span
                                                                                style={{ marginLeft: '6px' }}
                                                                                title='Untag Document'
                                                                                onClick={() => { tagSelectedDoc(file) }}
                                                                                className='mt-1 svg__iconbox svg__icon--cross dark hreflink'
                                                                            ></span></td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    :
                                                    <div className="No_Documents">
                                                        No Events Tagged
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className={SelectedTiles == "Announcements" || SelectedTiles == "" ? "tab-pane  show active" : "tab-pane  show"} id="Announcements" role="tabpanel" aria-labelledby="News">
                                <div>
                                    <Row>
                                        <Col xs={12}>
                                            <div>
                                                <div className='input-group'>
                                                    <label className='form-label full-width fw-semibold'>1. Create News</label>
                                                </div>
                                                <a className="alignCenter" href={`${props?.AllListId?.siteUrl}/SitePages/NewsManagement.aspx?ParentId=${Item?.Id}&TaxType=${Item?.TaxType}`}
                                                    target="_blank" data-interception="off"  >
                                                    <Add16Regular />
                                                    Create A New News Item.
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <div>
                                                <div className='input-group'>
                                                    <label className='form-label full-width fw-semibold'>2. Connect Existing News</label>
                                                    <a className=" pull-right" onClick={() => showAllExistingItems('News')}  >  Show all News
                                                    </a>
                                                    <input id="searchinputCEE" type="search" onChange={(e) => { searchExistingNews(e.target.value) }} placeholder="Search..." className="form-control" />
                                                </div>
                                                {ShowExistingNews == true && <div className="Alltable mt-2">
                                                    <div>
                                                        {ExistingNews?.length > 0 ?
                                                            <Table hover responsive className='mb-0'>
                                                                <thead className='fixed-Header top-0'>
                                                                    <tr>
                                                                         <th style={{ width: "39%" }}>Title</th>
                                                                        <th style={{ width: "7%" }}>Rank</th>
                                                                        <th style={{ width: "16%" }}>Date</th>
                                                                        <th style={{ width: "35%" }}>Location folder</th>
                                                                        <th style={{ width: "1%" }}>&nbsp;</th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody className='Scrolling'>
                                                                    {ExistingNews?.map((file: any) => {
                                                                        if (!AllReadyTaggedNews?.some((doc: any) => file?.Id == doc?.Id)) {
                                                                            return (
                                                                                <tr>
                                                                                    <td><a style={{ wordBreak: "break-all" }} href={`${file?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off" >{file?.Title}</a></td>
                                                                                    <td>{file?.ItemRank}</td>
                                                                                    <td>{file?.Created}</td>
                                                                                    <td>{file?.FileDirRef}</td>
                                                                                    <td> <span style={{ marginLeft: '6px' }} title='tag Document' onClick={() => { tagSelectedDoc(file) }} className='mt-1 svg__iconbox svg__icon--tag grey hreflink dark'></span></td>

                                                                                </tr>
                                                                            )
                                                                        }
                                                                    })}
                                                                </tbody>
                                                            </Table>
                                                            :
                                                            <div className="No_Documents">
                                                                No News Available
                                                            </div>
                                                        }
                                                    </div>
                                                </div>}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <Row className='mt-2'>
                                    <Col xs={12}>
                                        <div className="panel">
                                            <h3 className="pageTitle pb-1 siteColor siteBdrBottom">
                                                Already Tagged News
                                            </h3>
                                            <div className='Alltable'>
                                                {AllReadyTaggedNews?.length > 0 ?
                                                    <div>
                                                        <Table className='mb-0' hover responsive>
                                                            <thead className='fixed-Header top-0'>
                                                                <tr>
                                                                    <th style={{ width: "40%" }}>Title</th>
                                                                    <th style={{ width: "7%" }}>Rank</th>
                                                                    <th style={{ width: "16%" }}>Date</th>
                                                                    <th style={{ width: "35%" }}>Location folder</th>
                                                                    <th style={{ width: "1%" }}>&nbsp;</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {AllReadyTaggedNews?.map((file: any) => {
                                                                    return (
                                                                        <tr>
                                                                            <td><div><a href={`${file?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off">{file?.Title}</a></div></td>
                                                                            <td>{file?.ItemRank}</td>
                                                                            <td>{file?.Created}</td>
                                                                            <td><div>{file?.FileDirRef}</div></td>
                                                                            <td> <span title='Untag Document' onClick={() => { tagSelectedDoc(file) }} className='alignCenter svg__iconbox svg__icon--cross dark'></span></td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    :
                                                    <div className="No_Documents">
                                                        No News Tagged
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </ModalBody>
                </div >}
            </Panel >
            <Panel type={PanelType.medium}
                isOpen={OpenDefaultContent}
                onDismiss={CancelDefaultContentFolder}
                onRenderHeader={ChooseDefaultContentFolderHeader}
                onRenderFooter={onRenderDefualtContentFooter}
                isBlocking={false}>
                <div>
                    {selectedPath?.displayPath?.length > 0 ?
                        <div className='panel  mb-2'>
                            <div>
                                <input id="searchinput" type="search" onChange={(e) => { searchCurrentFolder(e.target.value) }} placeholder="Search..." className="form-control" />
                                <div className="Alltable mt-2">
                                    <div className="col">
                                        {currentFolderFiles?.length > 0 ?
                                            <div>
                                                <Table className='mb-0' hover responsive>
                                                    <thead className='fixed-Header top-0'>
                                                        <tr>
                                                            <th className='p-1'>Type</th>
                                                            <th className='p-1'>Title</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentFolderFiles?.map((file: any) => {
                                                            return (
                                                                <tr>
                                                                    <td><span className={`alignIcon  svg__iconbox svg__icon--${file?.docType}`} title={file?.docType}></span></td>
                                                                    <td><a href={file?.EncodedAbsUrl} target="_blank" data-interception="off" > {file?.Title} </a></td>
                                                                </tr>
                                                            )
                                                        })}

                                                    </tbody>
                                                </Table>
                                            </div>
                                            :
                                            <div className="No_Documents">
                                                No Documents Available
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        : ''
                    }
                </div>
            </Panel>
            <Modal titleAriaId={`UploadConfirmation`} isOpen={ShowConfirmation} onDismiss={cancelConfirmationPopup} dragOptions={undefined}>
                <div className='alignCenter pt-2'>
                    <div className='ms-2 subheading'>
                        {UploadedDocDetails?.length === 1 ? `${UploadedDocDetails[0]?.fileName} - Upload Confirmation` : 'Upload Confirmation'}
                    </div>
                    <span className='me-1' onClick={() => cancelConfirmationPopup()}><i className="svg__iconbox svg__icon--cross dark crossBtn"></i></span>
                </div>
                {pageLoaderActive ? <PageLoader /> : ''}
                <div className="modal-content border-0 rounded-0" style={{ width: '681px' }}>
                    <div className="modal-body">
                        <div className='clearfix mx-2'>
                            <Col><span><strong>Folder :</strong> </span><a href={`${rootSiteName}${selectedPath?.displayPath}`} target="_blank" data-interception="off" > {selectedPath?.displayPath} <span className="svg__iconbox svg__icon--folder ms-1 alignIcon "></span></a></Col>
                            <Col className='mb-2'><strong>Metadata-Tag :</strong> <span>{props?.item?.Title}</span></Col>

                            <Col className='Alltable mt-2'>
                                <div>
                                    <Table className='table table-hover mb-0'>
                                        <thead className='fixed-Header top-0'>
                                            <tr>
                                                <th className='ps-2' style={{ width: "60%" }}>File Name</th>
                                                {/* <th className='pe-1' style={{ width: "10%" }}>Uploaded</th>
                                                                <th className='pe-1' style={{ width: "8%" }}>Tagged</th> */}
                                                <th className='pe-1 text-center' style={{ width: "12%" }}>Share Link</th>
                                                <th className='pe-1 text-center' style={{ width: "12%" }}>Share in Mail</th>
                                                <th className='pe-1 text-center' style={{ width: "4%" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {UploadedDocDetails?.map((file: any) => {
                                                return (
                                                    <tr>
                                                        <td><div className='alignCenter'>
                                                            <span className={`svg__iconbox svg__icon--${file?.docType}`}></span><a href={file?.link} target="_blank" data-interception="off" className='hreflink me-1'>{file?.fileName}</a>{`(${file?.size})`}</div></td>
                                                        {/* <td>{file?.uploaded == true ? <span className='alignIcon  svg__iconbox svg__icon--Completed' style={{ width: "15px" }}></span> : <span className='alignIcon  svg__iconbox svg__icon--cross' ></span>}</td>
                                                                <td>{file?.tagged == true ? <span className='alignIcon  svg__iconbox svg__icon--Completed' style={{ width: "15px" }}></span> : <span className='alignIcon  svg__iconbox svg__icon--cross'></span>}</td> */}
                                                        <td className='text-center'>{file?.uploaded == true ? <>
                                                            <span className='me-3 alignIcon  svg__iconbox svg__icon--link hreflink' title='Copy Link' data-bs-toggle="popover" data-bs-content="Link Copied" onClick={() => { navigator.clipboard.writeText(file?.link); }}></span>
                                                        </> : <></>}</td>
                                                        <td className='text-center'>{file?.uploaded == true ? <>
                                                            <span className='alignIcon  svg__iconbox svg__icon--mail hreflink' title='Share In Mail' onClick={() => { window.open(`mailto:?&subject=${props?.item?.Title}&body=${file?.link}`) }}></span>
                                                        </> : <></>}</td>
                                                        <td> <span title="Edit" className="svg__iconbox svg__icon--edit hreflink alignIcon" onClick={() => editDocumentsLink(file)}></span></td>
                                                    </tr>
                                                )
                                            })}

                                        </tbody>
                                    </Table>
                                </div>

                            </Col>
                        </div>
                    </div>
                    <footer className='text-end p-2'>
                        <button className="btn btn-primary" onClick={() => cancelConfirmationPopup()}>OK</button>
                    </footer>
                </div>
            </Modal>
            <Panel
                type={PanelType.medium}
                isOpen={choosePathPopup}
                onDismiss={cancelPathFolder}
                onRenderHeader={ChoosePathCustomHeader}
                onRenderFooter={onRenderCustomFooterMain}
                isBlocking={false}>
                <div id="folderHierarchy">
                    <ul id="groupedFolders" className='m-0'>
                        {AllFoldersGrouped.map((folder: any) => (
                            <>
                                {folder?.FileDirRef?.includes(`}`) ? <Folder folder={folder} onToggle={handleToggle} /> : ''}
                            </>

                        ))}
                    </ul>

                </div>
            </Panel>
            <Panel
                type={PanelType.medium}
                isOpen={uploadEmailModal}
                onDismiss={cancelPathFolder}
                onRenderHeader={ChoosePathCustomHeaderEmail}
                isBlocking={false}>
                <Col>
                    <div className="panel">
                        <Col>
                            <div className='dragDropbox my-3' onDragOver={(event) => event.preventDefault()} onDrop={handleFileDrop}>
                                {selectedFile ? <p className='m-0'>Selected file: {selectedFile.name}</p> : <p className='m-0'>Drag and drop file here </p>}
                            </div>
                            <div className='text-center pb-2'>OR</div>
                            <div className='mb-2'>
                                <input type="file" onChange={handleFileInputChange} className='full-width' ref={fileInputRef} />
                            </div>
                            <div className='mb-2'>
                                <form>
                                    <input type="text" onChange={(e) => { setRenamedFileName(e.target.value) }} value={renamedFileName} placeholder='Rename your document' className='full-width' /> </form>
                            </div>
                            <div className='text-end'>
                                <button onClick={handleUpload} disabled={selectedFile?.name?.length > 0 ? false : true} className="btnCol btn btn-primary">Upload</button>
                                <Button className='btn btn-default ms-1' onClick={() => setUploadEmailModal(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </Col>
                    </div>
                </Col>
            </Panel>
        </>
    );

}