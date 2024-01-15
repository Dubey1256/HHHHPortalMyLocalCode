import React from 'react'
import DefaultFolderContent from './DefaultFolderContent'
import axios from 'axios';
import { usePopperTooltip } from "react-popper-tooltip";
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { SlArrowRight, SlArrowLeft, SlArrowUp, SlArrowDown } from "react-icons/sl";
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, CustomInput, Pagination, PaginationItem, PaginationLink, Progress, Row, Table } from "reactstrap";
import "react-popper-tooltip/dist/styles.css";
import Tooltip from '../Tooltip';
import { Web } from 'sp-pnp-js'
import { IList } from "@pnp/sp/lists";

import pptxgen from 'pptxgenjs';
import { Button, Modal, ModalBody } from "react-bootstrap";
import * as GlobalFunction from '../globalCommon';
import SmartInformation from '../../webparts/taskprofile/components/SmartInformation';
import ExcelJS from 'exceljs';
import { IFileAddResult } from "@pnp/sp/files";
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import ConnectExistingDoc from './ConnectExistingDoc';
import MsgReader from "@kenjiuno/msgreader"
import { Items } from '@pnp/sp/items';
import { AttachFile } from '@material-ui/icons';
let backupExistingFiles: any = [];
let backupCurrentFolder: any = [];
let AllFilesAndFolderBackup: any = [];
let folders: any = [];
let rootSiteName = '';
let TaskTypes: any = [];
let siteName: any = '';
let tasktypecopy: any = ''
let generatedLocalPath = '';
let TaskTypesItem: any = [];
let temptasktype: any = '';

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
const AncTool = (props: any) => {
    let siteUrl = '';
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [choosePathPopup, setChoosePathPopup] = React.useState(false);
    const [FileNamePopup, setFileNamePopup] = React.useState(false);
    const [ServicesTaskCheck, setServicesTaskCheck] = React.useState(false);
    const [uploadEmailModal, setUploadEmailModal] = React.useState(false);
    const [TaskTypesPopup, setTaskTypesPopup] = React.useState(false);
    const [OpenDefaultContent, setOpenDefaultContent] = React.useState(false);
    const [SelectedItem, setSelectedItem] = React.useState<string>()
    // const [smartInfoModalIsOpen, setSmartInfoModalIsOpen] = React.useState(false);
    const [remark, setRemark] = React.useState(false)
    const [ShowExistingDoc, setShowExistingDoc] = React.useState(false)
    const [editSmartInfo, setEditSmartInfo] = React.useState(false)
    const [folderExist, setFolderExist] = React.useState(false);
    const [Item, setItem]: any = React.useState({});
    const [renamedFileName, setRenamedFileName]: any = React.useState('');
    const [LinkToDocTitle, setLinkToDocTitle]: any = React.useState('');
    const [LinkToDocUrl, setLinkToDocUrl]: any = React.useState('');
    const [createNewDocType, setCreateNewDocType]: any = React.useState('');
    const [newSubFolderName, setNewSubFolderName]: any = React.useState('');
    const [selectPathFromPopup, setSelectPathFromPopup]: any = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [ShowConfirmation, setShowConfirmation]: any = React.useState(false);
    const [ShowConfirmationInside, setShowConfirmationInside]: any = React.useState(false);
    const [UploadedDocDetails, setUploadedDocDetails] = React.useState(null);
    const [newlyCreatedFile, setNewlyCreatedFile]: any = React.useState(null);
    const [itemRank, setItemRank] = React.useState(5);
    const [LinkDocitemRank, setLinkDocitemRank] = React.useState(5);
    const [selectedPath, setSelectedPath] = React.useState({
        displayPath: '',
        completePath: '',
    });
    const [CreateFolderLocation, showCreateFolderLocation] = React.useState(false);
    const [AllFilesAndFolder, setAllFilesAndFolder]: any = React.useState([]);
    const [AllFoldersGrouped, setAllFoldersGrouped]: any = React.useState([]);
    const [currentFolderFiles, setCurrentFolderFiles]: any = React.useState([]);
    const [ExistingFiles, setExistingFiles]: any = React.useState([]);
    const [AllReadytagged, setAllReadytagged]: any = React.useState([]);

    React.useEffect(() => {
        GetSmartMetadata();
        siteUrl = props?.Context?.pageContext?.web?.absoluteUrl;
        if (props?.item != undefined) {
            setItem(props?.item)
        }
        temptasktype = props?.item?.Categories?.split(';');
        if (temptasktype != undefined && temptasktype?.length > 0) {
            tasktypecopy = temptasktype[0]
        }
        pathGenerator();
        rootSiteName = props.Context.pageContext.site.absoluteUrl.split(props.Context.pageContext.site.serverRelativeUrl)[0];
    }, [])
    React.useEffect(() => {
        setTimeout(() => {
            const panelMain: any = document.querySelector('.ms-Panel-main');
            if (panelMain && props?.item?.PortfolioType?.Color) {
                $('.ms-Panel-main').css('--SiteBlue', props?.item?.PortfolioType?.Color); // Set the desired color value here
            }
        }, 2000)
    }, [CreateFolderLocation, modalIsOpen, choosePathPopup]);
    // Generate Path And Basic Calls
    const pathGenerator = async () => {
        const params = new URLSearchParams(window.location.search);
        var query = window.location.search.substring(1);
        console.log(query)
        //Test = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/CreateTask.aspx'
        var vars = query.split("&");
        let Href = window.location.href.toLowerCase().split('?')[0]
        Href = Href.toLowerCase().split('?')[0]
        Href = Href.split('#')[0];
        siteName = params.get("Site");
        if ((siteName == undefined || siteName == '' || siteName?.length == 0) && props?.listName == "Master Tasks") {
            siteName = 'Portfolios'
            props.item.TaskId = props?.item?.PortfolioStructureID
            setItem(props?.item)
        }
        if (siteName?.length > 0) {
            if (siteName === "Offshore Tasks") {
                siteName = "OffShoreTask";
            }
            generatedLocalPath = `/documents/tasks/${siteName}`
        } else {
            if (ServicesTaskCheck) {
                generatedLocalPath = `/documents/Service-Portfolio/${props?.item?.Title}`
            } else {
                generatedLocalPath = `/documents/Component-Portfolio/${props?.item?.Title}`
            }
        }
        if (tasktypecopy != undefined && tasktypecopy != '') {
            var displayUrl = props?.Context?.pageContext?.web?.serverRelativeUrl + generatedLocalPath + '/' + tasktypecopy;
            var internalPath = siteUrl + generatedLocalPath + '/' + tasktypecopy;
        }
        else {
            var displayUrl = props?.Context?.pageContext?.web?.serverRelativeUrl + generatedLocalPath
            var internalPath = siteUrl + generatedLocalPath;
        }
        setSelectedPath({
            ...selectedPath,
            displayPath: displayUrl,
            completePath: internalPath
        })
        fetchFilesByPath(displayUrl)
        let allFiles: any = await getExistingUploadedDocuments()
        let groupedFolders = createGrouping();
        setAllFoldersGrouped(groupedFolders);
        setAllFilesAndFolder(allFiles);
        AllFilesAndFolderBackup = allFiles;
        if (tasktypecopy != undefined && tasktypecopy != '')
            checkFolderExistence(tasktypecopy, displayUrl);
        else
            checkFolderExistence(siteName, displayUrl);
    }
    const checkFolderExistence = (title: any, path: any) => {
        let currentPath: any = `${rootSiteName}${path}`;
        for (let File = 0; File < AllFilesAndFolderBackup.length; File++) {
            if (AllFilesAndFolderBackup[File]?.FileLeafRef == title && AllFilesAndFolderBackup[File]?.FileSystemObjectType == 1 && AllFilesAndFolderBackup[File]?.EncodedAbsUrl?.toLowerCase() == currentPath?.toLowerCase()) {
                setFolderExist(true)
                break;
            }
            else {
                setFolderExist(false);
            }
        }
        AllFilesAndFolderBackup?.map((File: any) => {
        })
    }
    const GetSmartMetadata = async () => {
        let MetaData = [];
        let web = new Web(props?.AllListId?.siteUrl);
        MetaData = await web.lists
            .getById(props.AllListId.SmartMetadataListID)
            .items
            .select("Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Parent/Id,Parent/Title,EncodedAbsUrl,IsVisible,Created,Item_x0020_Cover,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,AlternativeTitle")
            .top(4999)
            .expand('Author,Editor,Parent')
            .get();

        MetaData?.map((data: any) => {
            if (data?.Parent?.Title === 'Type' && data?.TaxType === 'Categories') {
                TaskTypes.push(data);
            }
        })

    }
    // Create Group Hierarchy of Folder //
    const createGrouping = (): any[] => {
        const groupedFolder: any[] = [];
        let copyFolders = GlobalFunction?.deepCopy(folders);
        const findChildren = (parent: any): void => {
            const children = copyFolders.filter((item: any) => item.parentFolderUrl === parent.EncodedAbsUrl);
            if (children.length > 0) {
                for (const child of children) {
                    if (!child.subRows) {
                        child.subRows = [];
                    }
                    parent.subRows.push(child);
                    copyFolders.splice(copyFolders.indexOf(child), 1);
                    findChildren(child);
                }
            }
        };

        while (copyFolders.length > 0) {
            const folder = copyFolders[0];
            if (!copyFolders.some((item: any) => item.EncodedAbsUrl === folder.parentFolderUrl)) {
                folder.subRows = [];
                copyFolders.splice(0, 1);
                groupedFolder.push(folder);
                findChildren(folder);
            } else {
                copyFolders.splice(0, 1); // Skip folders that have parents for now
            }
        }

        return groupedFolder;
    };
    // Get Files And Folders From Server //
    async function getExistingUploadedDocuments(): Promise<any[]> {
        try {
            let alreadyTaggedFiles: any = [];
            let selectQuery = 'Id,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,Editor/Id,Editor/Title,File_x0020_Type,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified,Portfolios/Id,Portfolios/Title&$expand=Author,Editor,Portfolios'

            if (siteName?.length > 0) {
                selectQuery = `Id,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,${siteName}/Id,${siteName}/Title,File_x0020_Type,Editor/Id,Editor/Title,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified,Portfolios/Id,Portfolios/Title&$expand=Author,Editor,${siteName},Portfolios`
            }
            // const files = await folder.files.get();
            let web = new Web(props?.AllListId?.siteUrl);
            const files = await web.lists.getByTitle('Documents').items.select(selectQuery).getAll();
            let newFilesArr: any = [];
            folders = [];
            files?.map((file: any) => {
                if (file?.Title != undefined && file?.File_x0020_Type != undefined) {
                    file.docType = file?.File_x0020_Type
                    newFilesArr.push(file)
                } else if (file?.Title != undefined && file?.FileSystemObjectType != 1) {
                    file.docType = getFileType(file?.Name);
                }
                if (file?.File_x0020_Type == 'aspx') {
                    file.docType = 'link'
                    file.EncodedAbsUrl = file?.Url?.Url
                }
                if (file?.File_x0020_Type == 'rar') {
                    file.docType = 'zip'
                    file.EncodedAbsUrl = file?.Url?.Url
                }
                if (file?.File_x0020_Type == 'msg') {
                    file.docType = 'mail'
                    file.EncodedAbsUrl = file?.Url?.Url
                }
                if (file?.File_x0020_Type == 'jpg' || file?.File_x0020_Type == 'jfif') {
                    file.docType = 'jpeg'
                }
                if (file?.File_x0020_Type == 'doc') {
                    file.docType = 'docx'
                }
                if (file?.Portfolios == undefined) {
                    file.Portfolios = [];
                    file.PortfoliosId = []
                } else {
                    file.PortfoliosId = []
                    file?.Portfolios?.map((Port: any) => {
                        file?.PortfoliosId?.push(Port?.Id)
                    })
                }

                if (file[siteName] != undefined && file[siteName].length > 0 && file[siteName].some((task: any) => task.Id == props?.item?.Id)) {
                    alreadyTaggedFiles.push(file);
                }
                if (file.FileSystemObjectType == 1) {
                    file.isExpanded = false;
                    file.EncodedAbsUrl = file.EncodedAbsUrl.replaceAll('%20', ' ');
                    file.parentFolderUrl = rootSiteName + file.FileDirRef;
                    folders.push(file);
                }
            })
            backupExistingFiles = newFilesArr;
            setExistingFiles(newFilesArr)
            setAllReadytagged(alreadyTaggedFiles);

            return files
        } catch (error) {
            console.log('An error occurred while fetching files:', error);
            return [];
        }
    }
    const fetchFilesByPath = async (folderPath: any) => {
        fetchFilesFromFolder(folderPath)
            .then((files) => {
                files?.map((file: any) => {
                    file.docType = getFileType(file?.Name)
                })
                backupCurrentFolder = files;
                setCurrentFolderFiles(files)
            })
            .catch((error) => {
                console.log('An error occurred:', error);
            });

    }
    async function fetchFilesFromFolder(folderPath: string): Promise<any[]> {
        try {
            let selectQuery = 'Id,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,Editor/Id,Editor/Title,File_x0020_Type,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified,Portfolios/Id,Portfolios/Title&$expand=Author,Editor,Portfolios'

            if (siteName?.length > 0) {
                selectQuery = `Id,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,${siteName}/Id,${siteName}/Title,File_x0020_Type,Editor/Id,Editor/Title,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified,Portfolios/Id,Portfolios/Title&$expand=Author,Editor,${siteName},Portfolios`
            }
            let web = new Web(props?.AllListId?.siteUrl);
            const folder = web.getFolderByServerRelativeUrl(folderPath).select();
            const files = await folder.files.get();

            return files;
        } catch (error) {
            console.log('An error occurred while fetching files:', error);
            return [];
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
    //End//

    // Searching Functions //
    const searchCurrentFolder = (value: any) => {
        if (value?.length > 0) {
            setCurrentFolderFiles((prevFile: any) => {
                return backupCurrentFolder.filter((file: any) => {
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
                return backupExistingFiles.filter((file: any) => {
                    return file?.Title?.toLowerCase()?.includes(value?.toLowerCase());
                });
            });
        } else {
            setExistingFiles(backupExistingFiles);
        }
    }
    //End
    const setModalIsOpenToFalse = () => {
        setSelectedFile(null);
        setModalIsOpen(false);
    }
    // Main Popup Header//
    const onRenderCustomHeaderMain = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div className='subheading'>
                    <img className="imgWid29 pe-1 mb-1 " src={Item?.SiteIcon} />
                    <span className="siteColor">
                        {`Add & Connect Tool - ${Item.TaskId != undefined || Item.TaskId != null ? Item.TaskId : ""} ${Item.Title != undefined || Item.Title != null ? Item.Title : ""}`}
                    </span>
                </div>
                <Tooltip ComponentId="7640" />
            </div>
        );
    };
    const ChoosePathCustomHeader = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div className='subheading'>
                    {/* <img className="imgWid29 pe-1 mb-1 " src={Item?.SiteIcon} /> */}
                    <span className="siteColor">
                        Select Upload Folder
                    </span>
                </div>
                <Tooltip ComponentId="7643" />
            </div>
        );
    };
    //End//
    const ChoosePathCustomHeaderEmail = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div className='subheading'>
                    {/* <img className="imgWid29 pe-1 mb-1 " src={Item?.SiteIcon} /> */}
                    <span className="siteColor">
                        Upload Email
                    </span>
                </div>
                <Tooltip ComponentId="7641" />
                {/* <Tooltip ComponentId="528" /> */}
            </div>
        );
    };
    // File Drag And Drop And Upload
    const handleFileDrop = (event: any) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        console.log('Dropped file:', file); // Log the dropped file for debugging
        setSelectedFile(file);
        setTimeout(() => {
            handleUpload(file);
        }, 2000)
    };
    const handleFileInputChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };
    const handleRankChange = (event: any, from: any) => {
        // const rank =parseInt(event.target.value);  
        if (from == 'Upload') {
            setItemRank(event);
        }
        if (from == 'linkDoc') {
            setLinkDocitemRank(event);
        }
    };
    function base64ToArrayBuffer(base64String: string) {
        try {
            const binaryString = window.atob(base64String);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; ++i) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        } catch (error) {
            console.error("Byte decoding error:", error);
            return null;
        }
    }

    const handleUpload = async (uploadselectedFile: any) => {
        let emailDoc: any = [];
        let attachmentFile = false;
        let uploadedAttachmentFile: any = []
        let attachmentFileIndex: any = null
        let isFolderAvailable = folderExist;
        let fileName = ''
        let uploadPath = selectedPath.displayPath;
        let taggedDocument = {
            fileName: '',
            docType: '',
            uploaded: false,
            tagged: false,
            link: '',
            size: ''
        }
        let filetype = '';

        setTimeout(async () => {
            if (renamedFileName?.length > 0 && selectedFile.name?.length > 0) {
                filetype = getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name)
                fileName = renamedFileName + `.${filetype}`;
            } else {
                fileName = selectedFile != undefined ? selectedFile.name : uploadselectedFile.name;
            }
            if (isFolderAvailable == false) {
                try {
                    if (tasktypecopy != undefined && tasktypecopy != '') {
                        await CreateFolder(`${props?.Context?.pageContext?.web?.serverRelativeUrl}${generatedLocalPath?.split(tasktypecopy)[0]}`, tasktypecopy).then((data: any) => {
                            isFolderAvailable = true
                            setFolderExist(true)
                        })

                    }
                    else {
                        await CreateFolder(`${props?.Context?.pageContext?.web?.serverRelativeUrl}${generatedLocalPath?.split(siteName)[0]}`, siteName).then((data: any) => {
                            isFolderAvailable = true
                            setFolderExist(true)
                        })
                    }

                } catch (error) {
                    console.log('An error occurred while creating the folder:', error);
                }
            }
            if (isFolderAvailable == true) {
                try {
                    // Read the file content
                    const reader = new FileReader();
                    let msgfile: any = {};
                    reader.onloadend = async () => {
                        const fileContent = reader.result as ArrayBuffer;
                        setCreateNewDocType(getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name));
                        if (getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name) == 'msg') {

                            const reader = new FileReader();
                            attachmentFile = true;
                            const testMsg = new MsgReader(fileContent)
                            const testMsgInfo = testMsg.getFileData()
                            console.log(testMsgInfo);
                            msgfile = testMsgInfo
                            if (msgfile?.attachments?.length > 0) {
                                msgfile?.attachments?.map((attach: any) => {
                                    attach.extension = getFileType(attach?.fileName)
                                })
                            }

                            reader.readAsArrayBuffer(selectedFile != undefined ? selectedFile : uploadselectedFile);
                            emailDoc = emailDoc.concat(selectedFile != undefined ? selectedFile : uploadselectedFile);
                            emailDoc = emailDoc.concat(msgfile.attachments);
                            emailDoc?.map((AttachFile: any, index: any) => {
                                if (AttachFile?.extension?.toLowerCase() != "png" && AttachFile?.extension?.toLowerCase() != "jpg" && AttachFile?.extension?.toLowerCase() != "jpeg" && AttachFile?.extension?.toLowerCase() != "svg") {
                                    attachmentFileIndex = index

                                    if (renamedFileName?.length > 0 && selectedFile.name?.length > 0 && getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name) == "msg") {
                                        filetype = getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name)
                                        fileName = renamedFileName + `.${filetype}`;
                                    } else {
                                        fileName = AttachFile.fileName != undefined ? AttachFile?.fileName : AttachFile?.name;
                                    }
                                    uploadFile(AttachFile)
                                }
                            })
                            // };

                        } else {

                            uploadFile(fileContent)
                        }


                    };

                    reader.readAsArrayBuffer(selectedFile != undefined ? selectedFile : uploadselectedFile);


                    const uploadFile = async (fileToUpload: any) => {
                        return new Promise<void>(function (myResolve, myReject) {
                            let fileItems: any;
                            let web = new Web(props?.AllListId?.siteUrl);
                            web.getFolderByServerRelativeUrl(uploadPath)
                                .files.add(fileName, fileToUpload, true).then(async (uploadedFile: any) => {
                                    console.log(uploadedFile);
                                    uploadedAttachmentFile.push(uploadedFile?.data);
                                    if (attachmentFile == true && attachmentFileIndex == uploadedAttachmentFile?.length - 1) {
                                        console.log(uploadedAttachmentFile)
                                        fileItems = await getExistingUploadedDocuments()
                                        uploadedAttachmentFile?.map((attachfile: any) => {
                                            fileItems?.map(async (file: any) => {
                                                if (file?.FileDirRef != undefined && file?.FileDirRef?.toLowerCase() == uploadPath?.toLowerCase() && file?.FileSystemObjectType == 0 && file?.FileLeafRef == attachfile?.Name) {
                                                    let resultArray: any = [];
                                                    resultArray.push(props?.item?.Id)
                                                    let siteColName = `${siteName}Id`
                                                    let fileSize = getSizeString(fileToUpload?.byteLength)
                                                    taggedDocument = {
                                                        ...taggedDocument,
                                                        fileName: fileName,
                                                        docType: getFileType(attachfile?.Name),
                                                        uploaded: true,
                                                        link: `${rootSiteName}${selectedPath.displayPath}/${fileName}?web=1`,
                                                        size: fileSize
                                                    }
                                                    taggedDocument.link = file?.EncodedAbsUrl;
                                                    // Update the document file here
                                                    let postData = {
                                                        [siteColName]: { "results": resultArray },
                                                        ItemRank: itemRank,
                                                        Title: attachfile?.Name
                                                    }
                                                    if (props?.item?.Portfolio?.Id != undefined) {
                                                        postData.PortfoliosId = { "results": [props?.item?.Portfolio?.Id] };
                                                    }
                                                    if (getFileType(attachfile?.Name) == 'msg') {
                                                        postData = {
                                                            ...postData,
                                                            Body: msgfile?.body != undefined ? msgfile?.body : null,
                                                            recipients: msgfile?.recipients?.length > 0 ? JSON.stringify(msgfile?.recipients) : null,
                                                            senderEmail: msgfile?.senderEmail != undefined ? msgfile?.senderEmail : null,
                                                            creationTime: msgfile?.creationTime != undefined ? new Date(msgfile?.creationTime).toISOString() : null
                                                        }
                                                    }
                                                    let web = new Web(props?.AllListId?.siteUrl);
                                                    await web.lists.getByTitle('Documents').items.getById(file.Id)
                                                        .update(postData).then((updatedFile: any) => {
                                                            file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                                                            props?.callBack()
                                                            setAllReadytagged([...AllReadytagged, ...[file]])
                                                            msgfile.fileuploaded = true;
                                                            myResolve()
                                                            pathGenerator();
                                                            cancelPathFolder()
                                                            taggedDocument.tagged = true;
                                                            setUploadedDocDetails(taggedDocument);
                                                            setRenamedFileName('')
                                                            return file;
                                                        })

                                                    console.log("File uploaded successfully.", file);
                                                }
                                            })
                                        }
                                        )
                                    } else {
                                        setTimeout(async () => {
                                            if (attachmentFile == false) {
                                                fileItems = await getExistingUploadedDocuments()
                                                fileItems?.map(async (file: any) => {
                                                    if (file?.FileDirRef != undefined && file?.FileDirRef?.toLowerCase() == uploadPath?.toLowerCase() && file?.FileSystemObjectType == 0 && file?.FileLeafRef == fileName) {
                                                        let resultArray: any = [];
                                                        resultArray.push(props?.item?.Id)
                                                        let siteColName = `${siteName}Id`
                                                        let fileSize = getSizeString(fileToUpload?.byteLength)
                                                        taggedDocument = {
                                                            ...taggedDocument,
                                                            fileName: fileName,
                                                            docType: getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name),
                                                            uploaded: true,
                                                            link: `${rootSiteName}${selectedPath.displayPath}/${fileName}?web=1`,
                                                            size: fileSize
                                                        }
                                                        taggedDocument.link = file?.EncodedAbsUrl;
                                                        // Update the document file here
                                                        let postData = {
                                                            [siteColName]: { "results": resultArray },
                                                            ItemRank: itemRank,
                                                            Title: fileName
                                                        }
                                                        if (props?.item?.Portfolio?.Id != undefined) {
                                                            postData.PortfoliosId = { "results": [props?.item?.Portfolio?.Id] };
                                                        }
                                                        let web = new Web(props?.AllListId?.siteUrl);
                                                        await web.lists.getByTitle('Documents').items.getById(file.Id)
                                                            .update(postData).then((updatedFile: any) => {
                                                                file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                                                                props?.callBack()
                                                                setAllReadytagged([...AllReadytagged, ...[file]])
                                                                msgfile.fileuploaded = true;
                                                                myResolve()
                                                                pathGenerator();
                                                                taggedDocument.tagged = true;
                                                                setUploadedDocDetails(taggedDocument);
                                                                setRenamedFileName('')
                                                                return file;
                                                            })

                                                        console.log("File uploaded successfully.", file);
                                                    }
                                                })
                                            }
                                        }, 2000);
                                    }


                                });
                            setUploadedDocDetails(taggedDocument);
                            setShowConfirmation(true)
                            setUploadEmailModal(false)
                            setModalIsOpenToFalse()
                        })
                    }

                } catch (error) {
                    console.log("File upload failed:", error);
                }
            }
        }, 1500);
        setSelectedFile(null);
        cancelNewCreateFile()
        setItemRank(5);
    };
    //End //
    // Tag and Untag Existing Documents//
    const tagSelectedDoc = async (file: any) => {
        let resultArray: any = [];
        if (file[siteName] != undefined && file[siteName].length > 0) {
            file[siteName].map((task: any) => {
                if (task?.Id != undefined) {
                    resultArray.push(task.Id)
                }
            })
        }
        if (!file?.PortfoliosId?.some((portfolio: any) => portfolio == props?.item?.Portfolio?.Id) && props?.item?.Portfolio?.Id != undefined) {
            file?.PortfoliosId?.push(props?.item?.Portfolio?.Id);
        }
        if (!AllReadytagged?.some((doc: any) => file.Id == doc.Id) && !resultArray.some((taskID: any) => taskID == props?.item?.Id)) {
            resultArray.push(props?.item?.Id)
            let siteColName = `${siteName}Id`
            // Update the document file here
            let web = new Web(props?.AllListId?.siteUrl);
            let PostData = {
                [siteColName]: { "results": resultArray },
                PortfoliosId: { "results": file?.PortfoliosId != undefined ? file?.PortfoliosId : [] }
            }
            await web.lists.getByTitle('Documents').items.getById(file.Id)
                .update(PostData).then((updatedFile: any) => {
                    file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                    setAllReadytagged([...AllReadytagged, ...[file]])
                    props?.callBack()
                    alert(`The file '${file?.Title}' has been successfully tagged to the task '${props?.item?.TaskId}'.`);
                    return file;
                })


        } else if (AllReadytagged?.some((doc: any) => file.Id == doc.Id) && resultArray.some((taskID: any) => taskID == props?.item?.Id)) {
            resultArray = resultArray.filter((taskID: any) => taskID != props?.item?.Id)
            let siteColName = `${siteName}Id`
            // Update the document file here
            let PostData = {
                [siteColName]: { "results": resultArray }
            }
            if (siteColName != "PortfoliosId") {
                PostData.PortfoliosId = { "results": file?.PortfoliosId != undefined ? file?.PortfoliosId : [] };
            }
            let web = new Web(props?.AllListId?.siteUrl);
            await web.lists.getByTitle('Documents').items.getById(file.Id)
                .update(PostData).then((updatedFile: any) => {
                    file[siteName] = file[siteName].filter((task: any) => task.Id != props?.item?.Id);
                    setAllReadytagged((prevFile: any) => {
                        return prevFile.filter((item: any) => {
                            return item.Id != file.Id
                        });
                    });
                    props?.callBack()
                    alert(`The file '${file?.Title}' has been successfully untagged from the task '${props?.item?.TaskId}'.`);
                    return file;
                })


        }

    }
    //End //
    // Create Files direct From Code And Tag
    async function createBlankWordDocx() {
        setCreateNewDocType('docx')
        let jsonResult = await GlobalFunction.docxUint8Array();
        setNewlyCreatedFile(jsonResult)
    }
    async function createBlankExcelXlsx() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.addRow([]);
        const buffer = await workbook.xlsx.writeBuffer();
        setCreateNewDocType('xlsx')
        setNewlyCreatedFile(buffer)
    }
    async function createBlankPowerPointPptx() {
        setCreateNewDocType('pptx')
        const pptx = new pptxgen();
        pptx.addSlide();

        await pptx.stream().then((file: any) => {
            setNewlyCreatedFile(file)
            setFileNamePopup(true);
        })
    }
    const CreateNewAndTag = async () => {
        let taggedDocument = {
            fileName: '',
            docType: '',
            uploaded: false,
            tagged: false,
            link: '',
            size: ''
        }
        let isFolderAvailable = folderExist;
        let fileName = ''
        if (isFolderAvailable == false) {
            try {
                if (tasktypecopy != undefined && tasktypecopy != '') {
                    await CreateFolder(`${props?.Context?.pageContext?.web?.serverRelativeUrl}${generatedLocalPath?.split(tasktypecopy)[0]}`, tasktypecopy).then((data: any) => {
                        isFolderAvailable = true
                        setFolderExist(true)
                    })
                }
                else {
                    await CreateFolder(`${props?.Context?.pageContext?.web?.serverRelativeUrl}${generatedLocalPath?.split(siteName)[0]}`, siteName).then((data: any) => {
                        isFolderAvailable = true
                        setFolderExist(true)
                    })
                }


            } catch (error) {
                console.log('An error occurred while creating the folder:', error);
            }
        }
        if (isFolderAvailable == true) {
            try {
                if (renamedFileName?.length > 0) {
                    fileName = `${renamedFileName}.${createNewDocType}`
                } else {
                    fileName = `${props?.item?.Title}.${createNewDocType}`
                }
                let web = new Web(props?.AllListId?.siteUrl);
                await web.getFolderByServerRelativeUrl(selectedPath.displayPath)
                    .files.add(fileName, newlyCreatedFile, true).then(async (uploadedFile: any) => {
                        let fileSize = getSizeString(newlyCreatedFile?.byteLength)
                        taggedDocument = {
                            ...taggedDocument,
                            fileName: fileName,
                            docType: createNewDocType,
                            uploaded: true,
                            link: `${rootSiteName}${selectedPath.displayPath}/${fileName}?web=1`,
                            size: fileSize
                        }
                        setTimeout(async () => {
                            const fileItems = await getExistingUploadedDocuments()
                            fileItems?.map(async (file: any) => {
                                if (file?.FileDirRef != undefined && file?.FileDirRef?.toLowerCase() == selectedPath?.displayPath?.toLowerCase() && file?.FileSystemObjectType == 0 && file?.FileLeafRef == fileName) {
                                    let resultArray: any = [];
                                    resultArray.push(props?.item?.Id);
                                    let siteColName = `${siteName}Id`;
                                    taggedDocument.link = file.EncodedAbsUrl;
                                    // Update the document file here
                                    let postData = {
                                        [siteColName]: { "results": resultArray },
                                        ItemRank: 5,
                                        Title: fileName
                                    }
                                    if (props?.item?.Portfolio?.Id != undefined) {
                                        postData.PortfoliosId = { "results": [props?.item?.Portfolio?.Id] };
                                    }
                                    let web = new Web(props?.AllListId?.siteUrl);
                                    await web.lists.getByTitle('Documents').items.getById(file.Id)
                                        .update(postData).then((updatedFile: any) => {
                                            file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                                            setAllReadytagged([...AllReadytagged, ...[file]])
                                            taggedDocument.tagged = true;
                                            pathGenerator()
                                            cancelNewCreateFile()
                                            props?.callBack();
                                            return file;
                                        })
                                    console.log("File uploaded successfully.", file);
                                }
                            })
                        }, 2000);

                    });
                setUploadedDocDetails(taggedDocument);
                setShowConfirmation(true)
                setUploadEmailModal(false)
                setModalIsOpenToFalse()
            } catch (error) {
                console.log("File upload failed:", error);
            }
        } cancelNewCreateFile
    }
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
                return `1.2 MB`;
            }
        }
    };
    //File Name Popup
    const cancelNewCreateFile = () => {
        setFileNamePopup(false);
        setNewlyCreatedFile(null);
        setRenamedFileName('');
        setCreateNewDocType('');
        setLinkDocitemRank(5);
        setLinkToDocTitle('');
        setLinkToDocUrl('');
    }
    // Choose Path Folder
    const cancelPathFolder = () => {
        setChoosePathPopup(false);
        setNewSubFolderName('')
        showCreateFolderLocation(false);
        setUploadEmailModal(false);
        setTaskTypesPopup(false);
        TaskTypesItem = [];
    }
    const selectFolderToUpload = () => {
        const temp = selectPathFromPopup.split("/")
        tasktypecopy = temp[temp.length - 1];
        setSelectedPath({
            ...selectedPath,
            displayPath: selectPathFromPopup
        })
        if (selectPathFromPopup != undefined && selectPathFromPopup != '' && selectPathFromPopup?.length > 0)
            checkFolderExistence(tasktypecopy, selectPathFromPopup);
        else
            setFolderExist(true)
        setChoosePathPopup(false);
        showCreateFolderLocation(false);
        setTaskTypesPopup(false);
    }
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
    const setFolderPathFromPopup = (folderName: any) => {
        let selectedfolderName = folderName.split(rootSiteName)[1];
        setSelectPathFromPopup(selectedfolderName === selectPathFromPopup ? '' : selectedfolderName);
    };
    const Folder = ({ folder, onToggle }: any) => {
        const hasChildren = folder.subRows && folder.subRows.length > 0;

        const toggleExpand = () => {
            onToggle(folder);
        };

        return (
            <li style={{ listStyle: 'none' }}>
                <span className='d-flex' onClick={toggleExpand}>
                    <span className='me-1'>
                        {hasChildren ? (
                            folder.isExpanded ? <SlArrowDown /> : <SlArrowRight />
                        ) : (
                            <SlArrowDown style={{ color: 'white' }} />
                        )}
                    </span>
                    <span className='svg__iconbox svg__icon--folder me-1 wid30'></span>
                    <span className={`${rootSiteName}${selectPathFromPopup}` === folder.EncodedAbsUrl ? "highlighted hreflink" : "hreflink"} onClick={() => setFolderPathFromPopup(folder.EncodedAbsUrl)}>{folder.FileLeafRef}</span>
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
    // Choose Path Popup Footer 
    const onRenderCustomFooterMain = () => {
        return (<>

            <div className="p-2 pb-0 px-4">
                <div>
                    <Row className='mb-1'><span className='highlighted'>{selectPathFromPopup?.length > 0 ? `${selectPathFromPopup}` : ''}</span></Row>
                    {CreateFolderLocation ?
                        <Row>
                            <div className='col-md-9'><input type="text" className='form-control' placeholder='Folder Name' value={newSubFolderName} onChange={(e) => setNewSubFolderName(e.target.value)} /></div>
                            <div className='col-md-3 pe-0'><button className="btn btn-primary pull-right" disabled={newSubFolderName?.length > 0 ? false : true} onClick={() => { CreateSubFolder() }}>Create Folder</button></div>
                        </Row> : ''}
                </div>

            </div>
            <footer className='text-end p-2'>

                {/* <label className='me-1'><input className='form-check-input' type='checkbox' /> Update Default Folder </label> */}
                {selectPathFromPopup?.length > 0 && CreateFolderLocation != true ?
                    <label className="text-end me-1">
                        <a className='hreflink btn btn-primary' onClick={() => showCreateFolderLocation(true)}>
                            Create Folder
                        </a>
                    </label> : ''}
                <button className="btn btn-primary me-1" disabled={selectPathFromPopup?.length > 0 ? false : true} onClick={() => { selectFolderToUpload() }}>Select</button>
                <button className='btn btn-default ' onClick={() => cancelPathFolder()}>Cancel</button>
            </footer>
        </>
        );
    };
    const onRenderCustomFooterDefaultMain = () => {
        return (<>

            <div className="p-2 pb-0 px-4">
                <div>
                    <Row className='mb-1'><span className='highlighted'>{selectPathFromPopup?.length > 0 ? `${selectPathFromPopup}` : ''}</span></Row>
                    {CreateFolderLocation ?
                        <Row>
                            <div className='col-md-9'><input type="text" className='form-control' placeholder='Folder Name' value={newSubFolderName} onChange={(e) => setNewSubFolderName(e.target.value)} /></div>
                            <div className='col-md-3 pe-0'><button className="btn btn-primary pull-right" disabled={newSubFolderName?.length > 0 ? false : true} onClick={() => { CreateSubFolder() }}>Create Folder</button></div>
                        </Row> : ''}
                </div>

            </div>
            <footer className='text-end p-2'>

                {/* <label className='me-1'><input className='form-check-input' type='checkbox' /> Update Default Folder </label> */}
                {/* {selectPathFromPopup?.length > 0 && CreateFolderLocation != true ?
                    <label className="text-end me-1">
                        <a className='hreflink btn btn-primary' onClick={() => showCreateFolderLocation(true)}>
                            Create Folder
                        </a>
                    </label> : ''} */}
                <button className="btn btn-primary me-1" disabled={selectPathFromPopup?.length > 0 ? false : true} onClick={() => { selectFolderToUpload() }}>Select</button>
                <button className='btn btn-default ' onClick={() => cancelPathFolder()}>Cancel</button>
            </footer>
        </>
        );
    };
    // Create New Folder
    const CreateFolder = async (path: any, folderName: any): Promise<any> => {
        try {
            let web = new Web(props?.AllListId?.siteUrl);
            const library = web.lists.getByTitle('Documents');
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
    // Confirmation Popup Functions//
    const cancelConfirmationPopup = () => {
        setShowConfirmation(false)
        setUploadEmailModal(false)
        setShowConfirmationInside(false)
        setUploadedDocDetails(undefined);
    }
    const smartnotecall = () => {
        setRemark(false)
        props?.callBack();
    }

    //Task Types Popup
    const openTaskTypesPopup = () => {
        let displayUrl;
        TaskTypesItem = [];
        setTaskTypesPopup(true);
        temptasktype.map((itm: any, index: any) => {
            if (itm != '') {
                TaskTypesItem.push(itm);
            }
        })
        if (TaskTypesItem != undefined && TaskTypesItem?.length > 0) {
            if (selectedPath != undefined && selectedPath.displayPath != undefined && selectedPath.displayPath?.length > 0) {
                displayUrl = props?.Context?.pageContext?.web?.serverRelativeUrl + generatedLocalPath + '/' + selectedPath.displayPath.split('/')[selectedPath.displayPath.split('/').length - 1];
                let count = 0;
                displayUrl = displayUrl.replace(new RegExp(`\\b${siteName}\\b`, 'gi'), match => {
                    count++;
                    return count === 1 ? match : '';
                });
                setSelectedItem(selectedPath.displayPath.split('/')[selectedPath.displayPath.split('/').length - 1])
            } else {
                displayUrl = props?.Context?.pageContext?.web?.serverRelativeUrl + generatedLocalPath + '/' + TaskTypesItem[0];
                setSelectedItem(TaskTypesItem[0])
            }
            setSelectPathFromPopup(displayUrl)


        }
    }
    const ChooseTaskTypesCustomHeader = () => {
        return (
            <>
                <div className='subheading mb-0'>
                    <span className="siteColor">
                        Task Type
                    </span>
                </div>
                <Tooltip />
            </>
        );
    };
    const changeTaskTypeValue = (checked: any, itm: any) => {
        if (checked == true) {
            if (selectedPath.displayPath.indexOf(itm.Title) == -1) {
                var displayUrl = props?.Context?.pageContext?.web?.serverRelativeUrl + generatedLocalPath + '/' + itm
                var internalPath = props?.Context?.pageContext?.web?.absoluteUrl + generatedLocalPath + '/' + itm;
                tasktypecopy = itm;
                setSelectedPath({
                    ...selectedPath,
                    displayPath: displayUrl,
                    completePath: internalPath
                })
                setSelectPathFromPopup(displayUrl)
            }
            setSelectedItem(itm)
        }
        else {
            tasktypecopy = '';
            var displayUrl = props?.Context?.pageContext?.web?.serverRelativeUrl + generatedLocalPath
            var internalPath = props?.Context?.pageContext?.web?.absoluteUrl + generatedLocalPath;
            setSelectedPath({
                ...selectedPath, displayPath: displayUrl, completePath: internalPath
            })
            setSelectedItem(null)
            setSelectPathFromPopup('')
        }

    }
    // end
    // Add Link to Document And tag//
    const CreateLinkAndTag = async () => {
        let taggedDocument = {
            fileName: '',
            docType: '',
            uploaded: false,
            tagged: false,
            link: '',
            size: ''
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
                    '<mso:Url msdt:dt="string">' + LinkToDocUrl + ', ' + LinkToDocUrl + '</mso:Url>' +
                    '</mso:CustomDocumentProperties>' +
                    '</xml></SharePoint:CTFieldRefs><![endif]-->' +
                    '</head>' +
                    '<body>' +
                    "<form id='Form1' runat='server'>" +
                    "<SharePoint:UrlRedirector id='Redirector1' runat='server' />" +
                    '</form>' +
                    '</body>' +
                    '</html>';
                let web = new Web(props?.AllListId?.siteUrl);
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
                            const fileItems = await getExistingUploadedDocuments()
                            fileItems?.map(async (file: any) => {
                                if (file?.FileDirRef != undefined && file?.FileDirRef?.toLowerCase() == selectedPath?.displayPath?.toLowerCase() && file?.FileSystemObjectType == 0 && file?.FileLeafRef == fileName) {
                                    let resultArray: any = [];
                                    resultArray.push(props?.item?.Id);
                                    let siteColName = `${siteName}Id`;
                                    taggedDocument.link = file.EncodedAbsUrl;
                                    // Update the document file here
                                    let postData = {
                                        [siteColName]: { "results": resultArray },
                                        ItemRank: 5,
                                        Title: fileName,
                                        Url: {
                                            "__metadata": { type: "SP.FieldUrlValue" },
                                            Description: LinkToDocUrl ? LinkToDocUrl : '',
                                            Url: LinkToDocUrl ? LinkToDocUrl : ''
                                        },
                                        File_x0020_Type: 'aspx'
                                    }
                                    let web = new Web(props?.AllListId?.siteUrl);
                                    await web.lists.getByTitle('Documents').items.getById(file.Id)
                                        .update(postData).then((updatedFile: any) => {
                                            file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                                            setAllReadytagged([...AllReadytagged, ...[file]])
                                            taggedDocument.tagged = true;
                                            pathGenerator()
                                            cancelNewCreateFile()
                                            props?.callBack();
                                            return file;
                                        })
                                    console.log("File uploaded successfully.", file);
                                }
                            })
                        }, 2000);

                    });
                setUploadedDocDetails(taggedDocument);
                setShowConfirmation(true)
                setUploadEmailModal(false)
                setModalIsOpenToFalse()
            } catch (error) {
                console.log("File upload failed:", error);
            }
        } cancelNewCreateFile
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
    return (
        <>
            <div className={ServicesTaskCheck ? "serviepannelgreena mb-3 card commentsection" : "mb-3 card commentsection"}>
                <CardHeader>
                    <CardTitle className="h5 d-flex justify-content-between align-items-center  mb-0">Add & Connect Tool<span><Tooltip ComponentId='324' /></span></CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        <div className="alignCenter  justify-content-between">
                            {/* <a className='siteColor' onClick={() => { setModalIsOpen(true) }}> Upload Documents</a>  */}
                            <svg className="hreflink" onClick={() => { setModalIsOpen(true) }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="#333333">
                                <title>Upload Documents</title>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0391 41V23.5V6H19.4757H28.9121L33.5299 10.6849L38.1476 15.3699V28.1849V30H35.9414V27.8957V17.0308L31.6544 16.9865L27.3672 16.9424L27.3237 12.5908L27.2801 8.23934L19.7218 8.19621L12.1635 8.15308V23.4995V38.8458L24.0525 38.8033L27.1016 38.7924V39V41H24.0933H10.0391ZM31.8559 14.7915C33.1591 14.7915 34.2255 14.7346 34.2255 14.6649C34.2255 14.5952 33.1591 13.458 31.8559 12.1374L29.4862 9.73654V12.264V14.7915H31.8559ZM16.5759 23.4171V22.3389V21.2607H24.0933H31.6107V22.3389V23.4171H24.0933H16.5759ZM16.5759 27.8957V26.8175V25.7393H24.0933H31.6107V26.8175V27.8957H24.0933H16.5759ZM16.5759 32.2085V31.1303V30.0521H24.0933H31.6107V31.1303V32.2085H24.0933H16.5759Z" fill="#333333" />
                                <path d="M35.4 32H33.6V35.6H30V37.4H33.6V41H35.4V37.4H39V35.6H35.4V32Z" fill="#333333" />
                            </svg>
                            <svg className="hreflink" onClick={() => { setUploadEmailModal(true) }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="#333333">
                                <title>Upload Email</title>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.73609 11.5681C3.68578 11.7002 3.66678 17.3809 3.69423 24.1921L3.74396 36.5761L24.048 36.6251L44.352 36.6739V24.0011V11.3281H24.09C8.05724 11.3281 3.80886 11.3782 3.73609 11.5681ZM41.28 13.9197C41.28 13.9723 37.3923 15.9595 32.6407 18.3357L24.0013 22.6563L15.4567 18.3853C10.7571 16.0362 6.91196 14.049 6.91196 13.9691C6.91196 13.8894 14.6448 13.8241 24.096 13.8241C33.5472 13.8241 41.28 13.8671 41.28 13.9197ZM15.2634 21.0712L24 25.4382L32.7365 21.0712C37.5415 18.6692 41.5591 16.7041 41.6645 16.7041C41.7889 16.7041 41.856 19.7613 41.856 25.4411V34.178L24.048 34.1291L6.23996 34.0801L6.18985 25.6321C6.14281 17.7048 6.1693 16.7041 6.42543 16.7041C6.48111 16.7041 10.4584 18.6692 15.2634 21.0712Z" fill="#333333" />
                                <rect width="13" height="13" transform="translate(34 26)" fill="white" />
                                <path d="M41.4 28H39.6V31.6H36V33.4H39.6V37H41.4V33.4H45V31.6H41.4V28Z" fill="#333333" />
                            </svg>
                            {/* {/ <a className='siteColor' onClick={() => { setUploadEmailModal(true) }}> Upload Email</a> /} */}
                            <svg className="hreflink" onClick={() => { setFileNamePopup(true) }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="#333333">
                                <title>Create New Online File</title>
                                <rect width="48" height="48" fill="white" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.58157 11.104C7.83652 11.3416 7.46851 11.6111 7.21812 12.1035C7.00209 12.528 6.9766 14.0418 7.01468 24.2181L7.05823 35.8478L7.4519 36.2736C7.66841 36.5077 8.10402 36.7756 8.41991 36.8687C8.8026 36.9817 14.108 37.0217 24.3212 36.9889C40.8615 36.9358 39.9299 36.9888 40.6161 36.0632C40.9286 35.6419 40.9403 35.3369 40.983 26.4099C41.0319 16.2148 41.0437 16.3455 40.0207 15.7118C39.5089 15.3945 39.2214 15.3808 33.0792 15.3803C25.7954 15.3794 25.9103 15.3979 25.1066 14.0959C24.2515 12.7107 23.4347 11.7798 22.7462 11.406C22.0712 11.0396 21.9788 11.0345 15.5284 11.0037C11.9346 10.9864 8.80857 11.0317 8.58157 11.104ZM21.8043 13.3465C22.1875 13.5766 23.7565 15.6701 23.7565 15.9513C23.7565 16.1085 22.8223 16.8969 22.2481 17.2241C21.7926 17.4838 21.1438 17.511 15.41 17.511H9.07494V15.2977V13.0843H15.2212C20.5659 13.0843 21.4244 13.1185 21.8043 13.3465ZM38.8832 26.1597L38.8414 34.8083L23.9582 34.8501L9.07494 34.892V27.2672V19.6424L15.488 19.6414C19.3843 19.6409 22.1356 19.5744 22.4986 19.472C22.8272 19.3793 23.4672 19.0051 23.9209 18.6408C25.3137 17.5221 25.2118 17.5355 32.4298 17.5225L38.925 17.511L38.8832 26.1597Z" fill="#333333" />
                                <rect width="13" height="13" transform="translate(33 28)" fill="white" />
                                <path d="M40.3999 30H38.6V33.6H35V35.3999H38.6V39H40.3999V35.3999H44V33.6H40.3999V30Z" fill="#333333" stroke="#333333" stroke-width="0.2" />
                            </svg>
                            {/* {/ <a className='siteColor' onClick={() => { setFileNamePopup(true) }}> Create New Online File</a> /} */}
                            <svg className="hreflink" onClick={() => { setRemark(true) }} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="#333333">
                                <title>Add SmartNotes</title>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 23.5V40H19.9177H28.7609V37.9373H19.9189H11.0769V23.5V9.06249H18.3462H25.6154V13.1875V17.3125H29.7692H33.9231V21.4237V29.3325H36V21.7232V15.8513L31.5432 11.4256L27.0863 7H18.0432H9V23.5ZM30.0866 12.901L32.4515 15.25H30.0719H27.6923V12.901C27.6923 11.6091 27.699 10.5521 27.707 10.5521C27.7152 10.5521 28.7859 11.6091 30.0866 12.901Z" fill="#333333" stroke="#333333" stroke-width="0.2" />
                                <path d="M36.3999 32H34.6V35.6H31V37.3999H34.6V41H36.3999V37.3999H40V35.6H36.3999V32Z" fill="#333333" stroke="#333333" stroke-width="0.2" />
                            </svg>
                            {/* {/ <a className='siteColor' onClick={() => { setRemark(true) }}> Add SmartNote</a> /} */}
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
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >

                    <ModalBody>
                        <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                            <button className="nav-link active" id="Documnets-Tab" data-bs-toggle="tab" data-bs-target="#Documents" type="button" role="tab" aria-controls="Documents" aria-selected="true">
                                Documents
                            </button>
                        </ul>
                        <div className="border border-top-0 clearfix p-3 tab-content Anctoolpopup " id="myTabContent">
                            <div className="tab-pane  show active" id="Documents" role="tabpanel" aria-labelledby="Documents">
                                <div>
                                    <h3 className="pageTitle full-width siteColor pb-1 siteBdrBottom">
                                        1. Upload a Document
                                    </h3>
                                    <Row>
                                        <Col xs={6}>

                                            <div> <label className='form-label full-width fw-semibold'>Select Upload Folder  {temptasktype !== undefined && temptasktype?.length > 2 && <label className='alignIcon svg__iconbox svg__icon--setting' onClick={() => openTaskTypesPopup()}></label>}</label></div>

                                            <div className='alignCenter'>
                                                <span>{folderExist == true ? <span>{selectedPath?.displayPath}</span> : <>{(tasktypecopy != undefined && tasktypecopy != '') ? <span>{selectedPath?.displayPath?.split(tasktypecopy)}
                                                    <span className='highlighted'>{tasktypecopy}
                                                        <div className="popover__wrapper me-1" data-bs-toggle="tooltip" data-bs-placement="auto">
                                                            <span className="alignIcon svg__iconbox svg__icon--info " ></span>
                                                            <div className="popover__content">
                                                                <span>
                                                                    Highlighted folder does not exist. It will be created at the time of document upload.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </span>
                                                    :
                                                    <span>{selectedPath?.displayPath?.split(siteName)}<span className=''>{siteName}

                                                    </span></span>}</>}</span>
                                                <span><a title="Click for Associated Folder" className='hreflink ms-2' onClick={() => setChoosePathPopup(true)} > Change Path </a></span>
                                            </div>
                                            <div className='my-2'><label className='form-label fw-semibold'>All files in default folder:</label><span><a title="Default Folder Content" className='hreflink ms-2' onClick={() => OpenDefaultContentFolder()} > View </a></span></div>

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
                                                                        <th></th>
                                                                        <th className='p-1'>Type</th>
                                                                        <th className='p-1' style={{ width: "300px" }}>Title</th>
                                                                        <th style={{ width: '100px' }} className='p-1'>Rank</th>

                                                                    </tr>

                                                                </thead>
                                                                <tbody className='Scrolling'>
                                                                    {ExistingFiles?.map((file: any) => {
                                                                        if (!AllReadytagged?.some((doc: any) => file?.Id == doc?.Id)) {
                                                                            return (
                                                                                <tr>
                                                                                    <td><input type="checkbox" className='form-check-input hreflink' checked={AllReadytagged?.some((doc: any) => file.Id == doc.Id)} onClick={() => { tagSelectedDoc(file) }} /></td>
                                                                                    <td><span className={`alignIcon  svg__iconbox svg__icon--${file?.docType}`} title={file?.File_x0020_Type}></span></td>
                                                                                    <td><a style={{ wordBreak: "break-all" }} href={`${file?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off" className='hreflink'>{file?.Title}</a></td>
                                                                                    <td>{file?.ItemRank}</td>
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
                                                        <div className='my-2 input-group'>
                                                            <input type="file" onChange={handleFileInputChange} className='form-control' />
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
                                                                onChange={(e, option) => handleRankChange(option?.key, 'linkDoc')}
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
                                                                    <input type="text" onChange={(e) => { setLinkToDocUrl(encodeURIComponent(e.target.value)) }} value={LinkToDocUrl} placeholder='Url' className='form-control' />
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
                                        {/* <ConnectExistingDoc Context={props.Context} AllListId={props?.AllListId} item={Item} folderPath={selectedPath?.completePath} /> */}
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

                                                                    <th className='p-1'>Type</th>
                                                                    <th className='p-1'>Title</th>
                                                                    <th style={{ width: "150px" }}>Item Rank</th>
                                                                    <th style={{ width: "15x" }}>&nbsp;</th>

                                                                </tr>

                                                            </thead>
                                                            <tbody>
                                                                {AllReadytagged?.map((file: any) => {
                                                                    return (
                                                                        <tr>
                                                                            <td><span className={`alignIcon  svg__iconbox svg__icon--${file?.docType}`} title={file?.docType}></span></td>
                                                                            <td><a href={`${file?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off" className='hreflink'>{file?.Title}</a></td>
                                                                            <td>{file?.ItemRank}</td>
                                                                            <td> <span
                                                                                style={{ marginLeft: '6px' }}
                                                                                title='Untag Document'
                                                                                onClick={() => { tagSelectedDoc(file) }}
                                                                                className='alignIcon  svg__iconbox svg__icon--cross dark hreflink'
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
                        </div>
                    </ModalBody>
                </div >
            </Panel >
            <Panel
                type={PanelType.medium}
                isOpen={choosePathPopup}
                onDismiss={cancelPathFolder}
                onRenderHeader={ChoosePathCustomHeader}
                onRenderFooter={onRenderCustomFooterMain}
                isBlocking={false}>
                <div id="folderHierarchy">
                    <ul id="groupedFolders" className='p-0'>
                        {AllFoldersGrouped.map((folder: any) => (
                            <Folder folder={folder} onToggle={handleToggle} />
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
                                {selectedFile ? <p>Selected file: {selectedFile.name}</p> : <p>Drag and drop file here </p>}
                            </div>

                            <Col className='text-center pb-2'>OR</Col>
                            <Row className='mb-2 px-2'>
                                <input type="file" onChange={handleFileInputChange} className='full-width' />
                            </Row>
                            <Row className='mb-2 px-2'>
                                <input type="text" onChange={(e) => { setRenamedFileName(e.target.value) }} value={renamedFileName} placeholder='Rename your document' className='full-width' />
                            </Row>
                            <div className='text-end'>
                                <button onClick={handleUpload} disabled={selectedFile?.name?.length > 0 ? false : true} className="btnCol btn btn-primary">Upload</button>
                                <Button className='btn btn-default mx-1' onClick={() => setUploadEmailModal(false)}>
                                    Cancel
                                </Button>

                            </div>

                        </Col>

                    </div>

                </Col>



            </Panel>
            {
                FileNamePopup ?
                    <div className="modal Anc-Confirmation-modal" >
                        <div className="modal-dialog modal-mg rounded-0 " style={{ maxWidth: "400px" }}>
                            <div className="modal-content rounded-0">
                                <div className="modal-header">
                                    <div className='subheading'>
                                        {/* <img className="imgWid29 pe-1 mb-1 " src={Item?.SiteIcon} /> */}
                                        <span className="siteColor">
                                            Create New Online File {createNewDocType?.length > 0 ? ` - ${createNewDocType}` : ''}
                                        </span>
                                    </div>
                                    <Tooltip ComponentId="7642" />
                                    <span onClick={() => cancelNewCreateFile()}><i className="svg__iconbox svg__icon--cross crossBtn me-1"></i></span>
                                </div>
                                <div className="modal-body p-2 row">
                                    <div className="AnC-CreateDoc-Icon">
                                        <div className={createNewDocType == 'docx' ? 'selected' : ''}>
                                            <span onClick={() => createBlankWordDocx()} className='svg__iconbox svg__icon--docx hreflink' title='Word'></span>
                                        </div>
                                        <div className={createNewDocType == 'xlsx' ? 'selected' : ''}>
                                            <span onClick={() => createBlankExcelXlsx()} className='svg__iconbox svg__icon--xlsx hreflink' title='Excel'></span>
                                        </div>
                                        <div className={createNewDocType == 'pptx' ? 'selected' : ''}>
                                            <span onClick={() => createBlankPowerPointPptx()} className='svg__iconbox svg__icon--ppt hreflink' title='Presentation'></span>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 mt-2">
                                        <input type="text" onChange={(e) => { setRenamedFileName(e.target.value) }} value={renamedFileName} placeholder='Enter File Name' className='full-width' />
                                    </div>
                                </div>
                                <footer className='text-end p-2'>


                                    <button className="btn btn-primary" disabled={renamedFileName?.length > 0 ? false : true} onClick={() => { CreateNewAndTag() }}>Create</button>
                                    <button className='btn btn-default ms-1' onClick={() => cancelNewCreateFile()}>Cancel</button>
                                </footer>
                            </div>
                        </div>
                    </div> : ''
            }
            {
                ShowConfirmation ?
                    <div className="modal Anc-Confirmation-modal" >
                        <div className="modal-dialog modal-mg rounded-0 " style={{ maxWidth: "700px" }}>
                            <div className="modal-content rounded-0">
                                <div className="modal-header">
                                    <h5 className="modal-title">Upload Documents - Confirmation</h5>
                                    <span onClick={() => cancelConfirmationPopup()}><i className="svg__iconbox svg__icon--cross crossBtn"></i></span>
                                </div>
                                <div className="modal-body p-2">
                                    <Col className='p-1'>
                                        <Col><span><strong>Folder :</strong> </span><a href={`${rootSiteName}${selectedPath?.displayPath}`} target="_blank" data-interception="off" className='hreflink'> {selectedPath?.displayPath} <span className="svg__iconbox svg__icon--folder ms-1 alignIcon "></span></a></Col>
                                        <Col className='mb-2'><strong>Metadata-Tag :</strong> <span>{props?.item?.Title}</span></Col>

                                        <Col className='Alltable mt-2'>
                                            <div>
                                                <Table className='table table-hover'>
                                                    <thead className='fixed-Header top-0'>
                                                        <tr>
                                                            <th className='pe-1' style={{ width: "5%" }}>&nbsp;</th>
                                                            <th className='pe-1' style={{ width: "60%" }}>File Name</th>
                                                            <th className='pe-1' style={{ width: "10%" }}>Uploaded</th>
                                                            <th className='pe-1' style={{ width: "8%" }}>Tagged</th>
                                                            <th className='pe-1' style={{ width: "12%" }}>Share Link</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><span className={`svg__iconbox svg__icon--${UploadedDocDetails?.docType}`}></span></td>
                                                            <td><a href={UploadedDocDetails?.link} target="_blank" data-interception="off" className='hreflink'>{UploadedDocDetails?.fileName}</a>{`(${UploadedDocDetails?.size})`}</td>
                                                            <td>{UploadedDocDetails?.uploaded == true ? <span className='alignIcon  svg__iconbox svg__icon--Completed' style={{ width: "15px" }}></span> : <span className='alignIcon  svg__iconbox svg__icon--cross' ></span>}</td>
                                                            <td>{UploadedDocDetails?.tagged == true ? <span className='alignIcon  svg__iconbox svg__icon--Completed' style={{ width: "15px" }}></span> : <span className='alignIcon  svg__iconbox svg__icon--cross'></span>}</td>
                                                            <td>{UploadedDocDetails?.uploaded == true ? <>
                                                                <span className='me-3 alignIcon  svg__iconbox svg__icon--link hreflink' title='Copy Link' data-bs-toggle="popover" data-bs-content="Link Copied" onClick={() => { navigator.clipboard.writeText(UploadedDocDetails?.link); }}></span>
                                                                <span className='alignIcon  svg__iconbox svg__icon--mail hreflink' title='Share In Mail' onClick={() => { window.open(`mailto:?&subject=${props?.item?.Title}&body=${UploadedDocDetails?.link}`) }}></span>
                                                            </> : <></>}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>

                                        </Col>
                                    </Col>
                                </div>
                                <footer className='text-end p-2'>
                                    <button className="btn btn-primary" onClick={() => cancelConfirmationPopup()}>OK</button>
                                </footer>
                            </div>
                        </div>
                    </div> : ''
            }
            {
                remark && <SmartInformation Id={props?.item?.Id}
                    AllListId={props.AllListId}
                    Context={props?.Context}
                    taskTitle={props?.item?.Title}
                    listName={props?.item?.siteType != undefined ? props?.item?.siteType : 'Master Tasks'}
                    showHide={"projectManagement"}
                    setRemark={setRemark}
                    editSmartInfo={editSmartInfo}
                    callback={smartnotecall}
                />
            }
            <Panel type={PanelType.medium}
                isOpen={TaskTypesPopup}
                onDismiss={cancelPathFolder}
                onRenderHeader={ChooseTaskTypesCustomHeader}
                onRenderFooter={onRenderCustomFooterDefaultMain}
                isBlocking={false}>
                <div>
                    {TaskTypesItem != undefined && TaskTypesItem.length > 0 && TaskTypesItem.map((itm: any) => {
                        return (
                            <>
                                <label className='label--checkbox d-flex m-1'>
                                    <input type='checkbox' className='form-check-input me-1' defaultChecked={SelectedItem == itm} checked={SelectedItem == itm} onChange={(e) => changeTaskTypeValue(e.target.checked, itm)} /> {itm}
                                </label>
                            </>
                        )
                    })}
                </div>

            </Panel>
            <Panel type={PanelType.medium}
                isOpen={OpenDefaultContent}
                onDismiss={CancelDefaultContentFolder}
                onRenderHeader={ChooseDefaultContentFolderHeader}
                onRenderFooter={onRenderDefualtContentFooter}
                isBlocking={false}>
                <div>
                    {selectedPath?.displayPath?.length > 0 ?
                        // <DefaultFolderContent Context={props.Context} AllListId={props?.AllListId} item={Item} folderPath={selectedPath?.displayPath} />
                        <div className='panel  mb-2'>
                            {/* <h3 className='pageTitle'>1. Default Folder Content  <hr></hr></h3> */}
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

                                                                    <td><a href={file?.docType == 'pdf' ? file?.ServerRelativeUrl : file?.LinkingUri} target="_blank" data-interception="off" className='hreflink'> {file?.Title} </a></td>
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
        </>
    )
}

export default AncTool;

function myReject(error: any) {
    throw new Error('Function not implemented.');
}
