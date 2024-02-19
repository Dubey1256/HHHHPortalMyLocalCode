import React, { useRef } from 'react'
import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import {  CardBody,  CardTitle, Col, Row, Table } from "reactstrap";
import "react-popper-tooltip/dist/styles.css";
import Tooltip from '../Tooltip';
import { Web } from 'sp-pnp-js'
import pptxgen from 'pptxgenjs';
import { Button,  ModalBody } from "react-bootstrap";
import * as GlobalFunction from '../globalCommon';
import SmartInformation from '../../webparts/taskprofile/components/SmartInformation';
import ExcelJS from 'exceljs';
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import MsgReader from "@kenjiuno/msgreader"
import PageLoader from '../pageLoader';
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
    const fileInputRef = useRef(null);
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
    const [createNewFile, setCreateNewFile] = React.useState(false);
    const [Item, setItem]: any = React.useState({});
    const [pageLoaderActive, setPageLoader] = React.useState(false)
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
    }, [modalIsOpen])
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
        if (tasktypecopy != undefined && tasktypecopy != '') {
            checkFolderExistence(tasktypecopy, displayUrl);
        }
        else
            checkFolderExistence(siteName, displayUrl);
    }
    const checkFolderExistence = (title: any, path: any) => {
        let currentPath: any = `${rootSiteName}${path}`;
        for (let File = 0; File < AllFilesAndFolderBackup.length; File++) {
            if (AllFilesAndFolderBackup[File]?.FileLeafRef == title && AllFilesAndFolderBackup[File]?.FileSystemObjectType == 1 && AllFilesAndFolderBackup[File]?.EncodedAbsUrl?.toLowerCase() == currentPath?.toLowerCase()) {
                setFolderExist(true)

            }
            else {
                setFolderExist(false)
            }
        }

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
                            const testMsg = new MsgReader(fileContent)
                            const testMsgInfo = testMsg.getFileData()
                            console.log(testMsgInfo);
                            msgfile = testMsgInfo

                        } 
                      uploadFile(fileContent)


                    };

                    reader.readAsArrayBuffer(selectedFile != undefined ? selectedFile : uploadselectedFile);


                    const uploadFile = async (fileToUpload: any) => {
                        setPageLoader(true)
                        return new Promise<void>(function (myResolve, myReject) {
                            let fileItems: any;
                            let web = new Web(props?.AllListId?.siteUrl);
                            web.getFolderByServerRelativeUrl(uploadPath)
                                .files.add(fileName, fileToUpload, true).then(async (uploadedFile: any) => {
                                    console.log(uploadedFile);
                                    uploadedAttachmentFile.push(uploadedFile?.data);
                                  
                                        setTimeout(async () => {
                                           
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
                                                        taggedDocument.link = `${file?.EncodedAbsUrl}?web=1`;
                                                        // Update the document file here
                                                        let postData = {
                                                            [siteColName]: { "results": resultArray },
                                                            ItemRank: itemRank,
                                                            Title: getUploadedFileName(fileName)
                                                        }
                                                        if (getFileType(selectedFile != undefined ? selectedFile.name : uploadselectedFile.name) == 'msg') {
                                                            postData = {
                                                                ...postData,
                                                                Body: msgfile?.body != undefined ? msgfile?.body : null,
                                                                recipients: msgfile?.recipients?.length > 0 ? JSON.stringify(msgfile?.recipients) : null,
                                                                senderEmail: msgfile?.senderEmail != undefined ? msgfile?.senderEmail : null,
                                                                creationTime: msgfile?.creationTime != undefined ? new Date(msgfile?.creationTime).toISOString() : null
                                                            }
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
                                                                setPageLoader(false)
                                                                setUploadedDocDetails(taggedDocument);
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
                            setUploadedDocDetails(taggedDocument);
                            setShowConfirmation(true)
                            setUploadEmailModal(false)
                            // setModalIsOpenToFalse()
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
            }
            if (siteColName != 'PortfoliosId')
                PostData.PortfoliosId = { "results": file?.PortfoliosId != undefined ? file?.PortfoliosId : [] }
            let itemType = 'Task';
            if (props?.item?.Item_x0020_Type != undefined) {
                itemType = props?.item?.Item_x0020_Type
            } else if (props?.item?.TaskType?.Id != undefined) {
                itemType = props?.item?.TaskType?.Title
            }
            await web.lists.getByTitle('Documents').items.getById(file.Id)
                .update(PostData).then((updatedFile: any) => {
                    file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                    setAllReadytagged([...AllReadytagged, ...[file]])
                    props?.callBack()
                    alert(`The file '${file?.Title}' has been successfully tagged to the ${itemType} '${props?.item?.TaskId}'.`);
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
            let itemType = 'Task';
            if (props?.item?.Item_x0020_Type != undefined) {
                itemType = props?.item?.Item_x0020_Type
            } else if (props?.item?.TaskType?.Id != undefined) {
                itemType = props?.item?.TaskType?.Title
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
                    alert(`The file '${file?.Title}' has been successfully untagged from the ${itemType} '${props?.item?.TaskId}'.`);
                    return file;
                })


        }

    }
    //End //
    // Create Files direct From Code And Tag
    async function createBlankWordDocx() {
        setFileNamePopup(true);
        setCreateNewDocType('docx')
        let jsonResult = await GlobalFunction.docxUint8Array();
        setNewlyCreatedFile(jsonResult)
        setCreateNewFile(renamedFileName?.length > 0 ? true : false)
    }
    async function createBlankExcelXlsx() {
        setFileNamePopup(true)
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.addRow([]);
        const buffer = await workbook.xlsx.writeBuffer();
        setCreateNewDocType('xlsx')
        setCreateNewFile(renamedFileName?.length > 0 ? true : false)
        setNewlyCreatedFile(buffer)
    }
    async function createBlankPowerPointPptx() {
        setFileNamePopup(true)
        setCreateNewDocType('pptx')
        const pptx = new pptxgen();
        pptx.addSlide();

        await pptx.stream().then((file: any) => {
            setNewlyCreatedFile(file)
            setCreateNewFile(renamedFileName?.length > 0 ? true : false)
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
        setPageLoader(true)
        setCreateNewFile(false)
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
                                    taggedDocument.link = `${file?.EncodedAbsUrl}?web=1`;
                                    // Update the document file here
                                    let postData = {
                                        [siteColName]: { "results": resultArray },
                                        ItemRank: 5,
                                        Title: getUploadedFileName(fileName)
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
                                            setPageLoader(false)
                                            pathGenerator()
                                            cancelNewCreateFile()
                                            setSelectedFile(null);
                                            try {
                                                resetForm()
                                            } catch (e) {
                                                console.log(e)
                                            }
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
                setUploadedDocDetails(taggedDocument);
                setShowConfirmation(true)
                setUploadEmailModal(false)
                //setModalIsOpenToFalse()
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
    // Choose Path Popup Footer 
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
                                    if (file != undefined && file.EncodedAbsUrl != undefined && file.EncodedAbsUrl != '')
                                        taggedDocument.link = file.EncodedAbsUrl;
                                    else
                                        taggedDocument.link = LinkToDocUrl;
                                    // Update the document file here
                                    let postData = {
                                        [siteColName]: { "results": resultArray },
                                        ItemRank: 5,
                                        Title: getUploadedFileName(fileName),
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
                                            setPageLoader(false)
                                            pathGenerator()
                                            cancelNewCreateFile()
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
                setUploadedDocDetails(taggedDocument);
                setShowConfirmation(true)
                setUploadEmailModal(false)
                // setModalIsOpenToFalse()
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
    return (
        <>
            <div className={ServicesTaskCheck ? "serviepannelgreena mb-3 card addconnect" : "mb-3 card addconnect"}>
                <div className='card-header'>
                    <CardTitle className="h5 d-flex justify-content-between align-items-center  mb-0">Add & Connect Tool<span><Tooltip ComponentId='324' /></span></CardTitle>
                </div>
                <CardBody>
                    <Row>
                        <div className="mt-1">
                            <div className='uploadSection'>
                                <label className='fw-semibold full-width'>Upload</label>
                                <div className='uploadSectionContent alignCenter gap-2 mt-1'>
                                    <div className='text-center w-25' onClick={() => { setModalIsOpen(true) }} >
                                        <svg className="hreflink" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"  >
                                            <title>Upload Documents</title>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0391 41V23.5V6H19.4757H28.9121L33.5299 10.6849L38.1476 15.3699V28.1849V30H35.9414V27.8957V17.0308L31.6544 16.9865L27.3672 16.9424L27.3237 12.5908L27.2801 8.23934L19.7218 8.19621L12.1635 8.15308V23.4995V38.8458L24.0525 38.8033L27.1016 38.7924V39V41H24.0933H10.0391ZM31.8559 14.7915C33.1591 14.7915 34.2255 14.7346 34.2255 14.6649C34.2255 14.5952 33.1591 13.458 31.8559 12.1374L29.4862 9.73654V12.264V14.7915H31.8559ZM16.5759 23.4171V22.3389V21.2607H24.0933H31.6107V22.3389V23.4171H24.0933H16.5759ZM16.5759 27.8957V26.8175V25.7393H24.0933H31.6107V26.8175V27.8957H24.0933H16.5759ZM16.5759 32.2085V31.1303V30.0521H24.0933H31.6107V31.1303V32.2085H24.0933H16.5759Z" />
                                            <path d="M35.4 32H33.6V35.6H30V37.4H33.6V41H35.4V37.4H39V35.6H35.4V32Z" />
                                        </svg>
                                        <a className='d-block hreflink siteColor f-12 mt-1'>Documents</a>
                                    </div>
                                    <div className='text-center w-25' onClick={() => { setUploadEmailModal(true) }}>
                                        <svg className="hreflink" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"  >
                                            <title>Email</title>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.73609 11.5681C3.68578 11.7002 3.66678 17.3809 3.69423 24.1921L3.74396 36.5761L24.048 36.6251L44.352 36.6739V24.0011V11.3281H24.09C8.05724 11.3281 3.80886 11.3782 3.73609 11.5681ZM41.28 13.9197C41.28 13.9723 37.3923 15.9595 32.6407 18.3357L24.0013 22.6563L15.4567 18.3853C10.7571 16.0362 6.91196 14.049 6.91196 13.9691C6.91196 13.8894 14.6448 13.8241 24.096 13.8241C33.5472 13.8241 41.28 13.8671 41.28 13.9197ZM15.2634 21.0712L24 25.4382L32.7365 21.0712C37.5415 18.6692 41.5591 16.7041 41.6645 16.7041C41.7889 16.7041 41.856 19.7613 41.856 25.4411V34.178L24.048 34.1291L6.23996 34.0801L6.18985 25.6321C6.14281 17.7048 6.1693 16.7041 6.42543 16.7041C6.48111 16.7041 10.4584 18.6692 15.2634 21.0712Z" />
                                            <rect width="13" height="13" transform="translate(34 26)" fill="white" />
                                            <path d="M41.4 28H39.6V31.6H36V33.4H39.6V37H41.4V33.4H45V31.6H41.4V28Z" />
                                        </svg><a className='d-block siteColor hreflink f-12 mt-1'>Upload Email</a></div>
                                </div>
                            </div>
                            <div className='mt-3'>
                                <div className='createOnlineSection'>
                                    <label className='fw-semibold full-width'>Create New Online-File</label>
                                    <div className="createOnlineSectionContent alignCenter gap-2 mt-1 AnC-CreateDoc-Icon p-0">
                                        <div className={createNewDocType == 'docx' ? 'selected text-center w-25' : 'text-center w-25'}>
                                            <span onClick={() => createBlankWordDocx()} style={{width:"32px",height:"32px"}} className='svg__iconbox svg__icon--docx hreflink' title='Word'></span>
                                            <a className='d-block siteColor hreflink f-12 mb-1'>Word</a>
                                        </div>
                                        <div className={createNewDocType == 'xlsx' ? 'selected text-center w-25' : 'text-center w-25'}>
                                            <span onClick={() => createBlankExcelXlsx()} style={{width:"32px",height:"32px"}} className='svg__iconbox svg__icon--xlsx hreflink' title='Excel'></span>
                                            <a className='d-block siteColor hreflink f-12 mb-1'>Excel</a>
                                        </div>
                                        <div className={createNewDocType == 'pptx' ? 'selected text-center w-25' : 'text-center w-25'}>
                                            <span onClick={() => createBlankPowerPointPptx()} style={{width:"32px",height:"32px"}} className='svg__iconbox svg__icon--ppt hreflink' title='PPT'></span>
                                            <a className='d-block siteColor hreflink f-12 mb-1'>PPT</a>
                                        </div>
                                        <div className='text-center w-25' onClick={() => { setRemark(true) }}>
                                            <svg className="hreflink" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"  >
                                                <title>SmartNotes</title>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 23.5V40H19.9177H28.7609V37.9373H19.9189H11.0769V23.5V9.06249H18.3462H25.6154V13.1875V17.3125H29.7692H33.9231V21.4237V29.3325H36V21.7232V15.8513L31.5432 11.4256L27.0863 7H18.0432H9V23.5ZM30.0866 12.901L32.4515 15.25H30.0719H27.6923V12.901C27.6923 11.6091 27.699 10.5521 27.707 10.5521C27.7152 10.5521 28.7859 11.6091 30.0866 12.901Z" stroke-width="0.2" />
                                                <path d="M36.3999 32H34.6V35.6H31V37.3999H34.6V41H36.3999V37.3999H40V35.6H36.3999V32Z" stroke-width="0.2" />
                                            </svg>
                                            <a className='d-block siteColor hreflink f-12 mt-1'>SmartNotes</a>
                                        </div>
                                    </div>

                                    {/* <div className={createNewDocType == 'docx' ? 'text-center w-25 hreflink selected' : 'text-center w-25 hreflink'} onClick={() => createBlankWordDocx()} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="none">
                                                <title>Word</title>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4355 6.58324H9.4541V9.48268V23.998V41.4545H12.0674H37.8452C37.8567 33.162 37.8028 14.5742 37.8028 14.5742C37.8028 14.5742 32.3014 8.68571 30.0727 6.54579H21.1666C16.5109 6.54131 12.4355 6.58324 12.4355 6.58324ZM29.7342 7.71458L36.6385 14.9128V40.287H10.5987V7.71458H21.14H29.7342Z" fill="#295497" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0536 6.31284C16.6548 6.30292 18.8382 6.29355 21.1669 6.29579H30.1733L30.2459 6.36546C31.365 7.44006 33.3015 9.45139 34.9547 11.1902C35.782 12.0604 36.5397 12.8637 37.0905 13.4494C37.3659 13.7423 37.5896 13.9808 37.7444 14.146L37.9852 14.4032L37.8028 14.5742C37.5528 14.5749 37.5528 14.575 37.5528 14.5751L37.553 14.6732L37.3796 14.4879C37.2249 14.3228 37.0014 14.0846 36.7262 13.7919C36.1759 13.2067 35.4189 12.4041 34.5923 11.5347C32.973 9.83155 31.0915 7.87705 29.9719 6.79579H30.0727V6.54579L29.8996 6.72612C29.9233 6.74892 29.9474 6.77215 29.9719 6.79579H21.1666C18.8395 6.79355 16.6571 6.80291 15.0567 6.81283C14.2565 6.81779 13.6018 6.82289 13.1471 6.82675L12.4388 6.83321L12.4355 6.58324V6.33324H12.4342L13.1429 6.32676C13.5979 6.3229 14.253 6.3178 15.0536 6.31284ZM9.7041 6.83324H12.4355L12.4388 6.83321L12.4355 6.58324L12.4329 6.33325L12.4342 6.33324H9.2041V41.7045H38.0949L38.0952 41.4549C38.101 37.3081 38.0904 30.5876 38.0783 24.9041C38.0723 22.0623 38.0659 19.4797 38.061 17.6075L38.0528 14.5743C38.0528 14.5742 38.0528 14.5735 37.8028 14.5742L38.0528 14.5743L38.0525 14.4753L37.9852 14.4032L37.8028 14.5742L37.62 14.7448L37.553 14.6732L37.561 17.6088C37.5659 19.4809 37.5723 22.0635 37.5783 24.9052C37.5901 30.4761 37.6006 37.0423 37.5956 41.2045H9.7041V6.83324ZM9.7041 41.2045H9.4541V41.4545H9.7041V41.2045ZM9.7041 6.83324H9.4541V6.58324H9.7041V6.83324ZM37.5956 41.2045C37.5954 41.2888 37.5953 41.372 37.5952 41.4542L37.8452 41.4545V41.2045H37.5956ZM10.3487 7.46458H29.8409L36.8885 14.8123V40.537H10.3487V7.46458ZM10.8487 7.96458V40.037H36.3885V15.0133L29.6276 7.96458H10.8487Z" fill="#295497" />
                                                <mask id="mask0_105_895" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="15" y="31" width="17" height="6">
                                                    <path d="M31.7302 31.5469H15.5723V36.1349H31.7302V31.5469Z" fill="white" />
                                                </mask>
                                                <g mask="url(#mask0_105_895)">
                                                    <path d="M15.5723 35.9487V31.6267H16.8489C17.2878 31.6267 17.6735 31.6997 18.0059 31.8461C18.3428 31.9879 18.6044 32.2162 18.7906 32.5309C18.9768 32.8457 19.0699 33.2579 19.0699 33.7677C19.0699 34.2775 18.9768 34.6942 18.7906 35.0178C18.6044 35.337 18.3495 35.5719 18.0259 35.7227C17.7023 35.8733 17.3321 35.9487 16.9155 35.9487H15.5723ZM16.716 35.0311H16.7824C16.9908 35.0311 17.1792 34.9957 17.3477 34.9247C17.5161 34.8538 17.6491 34.7275 17.7466 34.5457C17.8485 34.364 17.8995 34.1046 17.8995 33.7677C17.8995 33.4308 17.8485 33.176 17.7466 33.003C17.6491 32.8257 17.5161 32.7061 17.3477 32.644C17.1792 32.5775 16.9908 32.5443 16.7824 32.5443H16.716V35.0311ZM21.6604 36.0285C21.2614 36.0285 20.9112 35.9398 20.6098 35.7625C20.3084 35.5808 20.0734 35.3215 19.905 34.9845C19.7365 34.6477 19.6523 34.2421 19.6523 33.7677C19.6523 33.2934 19.7365 32.8923 19.905 32.5642C20.0734 32.2317 20.3084 31.979 20.6098 31.8061C20.9112 31.6333 21.2614 31.5469 21.6604 31.5469C22.0594 31.5469 22.4096 31.6333 22.711 31.8061C23.0125 31.979 23.2474 32.2317 23.4159 32.5642C23.5843 32.8923 23.6685 33.2934 23.6685 33.7677C23.6685 34.2421 23.5843 34.6477 23.4159 34.9845C23.2474 35.3215 23.0125 35.5808 22.711 35.7625C22.4096 35.9398 22.0594 36.0285 21.6604 36.0285ZM21.6604 35.0444C21.8333 35.0444 21.9818 34.9934 22.1059 34.8915C22.2345 34.7851 22.332 34.6365 22.3985 34.4459C22.4651 34.2553 22.4983 34.0293 22.4983 33.7677C22.4983 33.5062 22.4651 33.2845 22.3985 33.1028C22.332 32.9166 22.2345 32.7747 22.1059 32.6772C21.9818 32.5797 21.8333 32.5309 21.6604 32.5309C21.4875 32.5309 21.3368 32.5797 21.2083 32.6772C21.0841 32.7747 20.9888 32.9166 20.9224 33.1028C20.8558 33.2845 20.8226 33.5062 20.8226 33.7677C20.8226 34.0293 20.8558 34.2553 20.9224 34.4459C20.9888 34.6365 21.0841 34.7851 21.2083 34.8915C21.3368 34.9934 21.4875 35.0444 21.6604 35.0444ZM26.3175 36.0285C25.9496 36.0285 25.6083 35.9487 25.2935 35.7891C24.9832 35.6251 24.7327 35.3791 24.5421 35.051C24.3515 34.723 24.2563 34.313 24.2563 33.8209C24.2563 33.4574 24.3116 33.136 24.4224 32.8568C24.5377 32.5731 24.6928 32.3337 24.8879 32.1387C25.0874 31.9436 25.3112 31.7973 25.5595 31.6997C25.8122 31.5978 26.0737 31.5469 26.3441 31.5469C26.6323 31.5469 26.8893 31.6045 27.1155 31.7197C27.3459 31.8305 27.5365 31.9635 27.6873 32.1187L27.0888 32.8501C26.9824 32.7571 26.8716 32.6816 26.7564 32.624C26.6456 32.562 26.517 32.5309 26.3707 32.5309C26.2022 32.5309 26.0449 32.5819 25.8986 32.6839C25.7567 32.7814 25.6415 32.9232 25.5528 33.1094C25.4686 33.2956 25.4265 33.5195 25.4265 33.7811C25.4265 34.0515 25.4641 34.2819 25.5395 34.4725C25.6193 34.6587 25.7279 34.8006 25.8653 34.8981C26.0072 34.9957 26.1712 35.0444 26.3574 35.0444C26.5259 35.0444 26.6743 35.0067 26.8029 34.9314C26.9359 34.856 27.049 34.7696 27.1421 34.672L27.7405 35.3901C27.5587 35.6029 27.3459 35.7625 27.1021 35.8689C26.8583 35.9753 26.5968 36.0285 26.3175 36.0285ZM27.9263 35.9487L29.0965 33.7278L27.9928 31.6267H29.2694L29.562 32.3315C29.6107 32.429 29.6595 32.5376 29.7083 32.6573C29.7571 32.777 29.8102 32.9077 29.8679 33.0496H29.8944C29.9432 32.9077 29.9898 32.777 30.0341 32.6573C30.0784 32.5376 30.1205 32.429 30.1605 32.3315L30.4131 31.6267H31.6366L30.5328 33.7811L31.7031 35.9487H30.4264L30.0806 35.1774C30.0275 35.0621 29.9765 34.9469 29.9277 34.8316C29.8789 34.7164 29.828 34.5923 29.7748 34.4592H29.7482C29.7038 34.5923 29.6573 34.7164 29.6085 34.8316C29.5642 34.9469 29.5176 35.0621 29.4689 35.1774L29.1497 35.9487H27.9263Z" fill="#243A4A" />
                                                </g>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.2852 13.582C24.0182 13.6329 23.575 13.7159 20.9066 14.2149C20.6301 14.2666 20.2226 14.3428 20.0011 14.3844C19.1244 14.5484 17.9244 14.7729 17.6636 14.8215C17.5122 14.8498 17.2357 14.9015 17.0492 14.9364C16.8628 14.9714 16.6492 15.0113 16.5746 15.0252L16.439 15.0505L16.437 20.3107C16.4356 23.9492 16.4375 25.5709 16.4432 25.5709C16.4505 25.5709 16.9039 25.655 17.5957 25.7847C17.7098 25.8061 17.9288 25.8471 18.0824 25.8759C18.2359 25.9046 18.455 25.9455 18.569 25.9669C18.6831 25.9883 18.9865 26.045 19.2432 26.0929C19.4999 26.1409 19.7871 26.1945 19.8814 26.2122C20.0379 26.2415 20.4376 26.3164 21.8719 26.5846C22.1483 26.6363 22.5863 26.7182 22.8452 26.7665C23.1041 26.8149 23.4092 26.872 23.5233 26.8934C23.6374 26.9148 23.9138 26.9663 24.1376 27.0079C24.3614 27.0495 24.5525 27.0854 24.5624 27.0876L24.5804 27.0916V26.4065V25.7214L27.4026 25.7213C30.2057 25.7212 30.2252 25.7212 30.2925 25.7052C30.4259 25.6738 30.5601 25.591 30.6482 25.4856C30.7003 25.4233 30.7647 25.2974 30.785 25.2185C30.7985 25.1657 30.7991 24.9356 30.7991 20.3047V15.4464L30.7767 15.3751C30.706 15.1504 30.5522 14.9966 30.3204 14.9188L30.2646 14.9L27.4225 14.898L24.5804 14.8959V14.211C24.5804 13.8343 24.5777 13.5265 24.5744 13.527C24.5711 13.5275 24.441 13.5522 24.2852 13.582ZM30.2287 20.3087V25.1671H27.4045H24.5804V24.7038V24.2405H26.9578H29.3352V23.9356V23.6308H26.9578H24.5804V23.1991V22.7676H26.9578H29.3352V22.4627V22.1578H26.9578H24.5804V21.7381V21.3184H26.9578H29.3352V21.0095V20.7007H26.9578H24.5804V20.281V19.8613H26.9579H29.3354L29.3333 19.5544L29.3312 19.2476L26.9558 19.2455L24.5804 19.2436V18.8159V18.3884H26.9579H29.3354L29.3333 18.0815L29.3312 17.7746L26.9558 17.7727L24.5804 17.7706V17.3549V16.9391H26.9578H29.3352V16.6303V16.3215H26.9578H24.5804V15.886V15.4504H27.4045H30.2287V20.3087ZM22.9411 17.9429C22.9356 17.9722 22.9239 18.0207 22.7903 18.5665C22.753 18.719 22.7082 18.9025 22.6906 18.9743C22.463 19.9068 22.4005 20.1631 22.3496 20.3721C22.3168 20.5071 22.2688 20.7031 22.243 20.8076C22.2172 20.9121 22.1671 21.117 22.1316 21.263C21.9242 22.1161 21.8458 22.4358 21.843 22.438C21.8413 22.4393 21.7323 22.4324 21.6007 22.4225C21.469 22.4127 21.2501 22.397 21.1143 22.3877C20.9783 22.3784 20.865 22.3687 20.865 22.3687C20.8594 22.363 20.2378 19.5708 20.2244 19.4904C20.2078 19.3913 20.1932 19.2594 20.1915 19.1932L20.1905 19.1525L20.1839 19.2001C20.1804 19.2262 20.1716 19.2975 20.1644 19.3584C20.1486 19.4937 20.131 19.5833 20.053 19.9247C20.0196 20.0705 19.9551 20.3556 19.9095 20.5582C19.7928 21.0763 19.6171 21.8524 19.5698 22.0588C19.5479 22.1546 19.5282 22.2411 19.526 22.2508C19.5227 22.266 19.517 22.2686 19.4884 22.2683C19.4306 22.2676 18.6538 22.2089 18.6498 22.2049C18.6449 22.2001 18.6403 22.1785 18.4417 21.2313C18.3864 20.9678 18.3271 20.6863 18.3098 20.6057C18.2812 20.4725 18.2154 20.1604 18.1344 19.7742C18.1175 19.6936 18.0763 19.4976 18.0428 19.3386C17.8429 18.3907 17.8225 18.2913 17.8263 18.2875C17.8313 18.2825 18.5489 18.2292 18.5764 18.2318L18.5999 18.2339L18.7458 19.0733C19.0989 21.1031 19.0854 21.0199 19.0965 21.2233C19.1021 21.3263 19.114 21.3865 19.115 21.3167C19.1158 21.2599 19.1452 21.0431 19.164 20.9562C19.1732 20.9137 19.213 20.7381 19.2524 20.5661C19.2918 20.394 19.3434 20.1678 19.367 20.0632C19.4311 19.7791 19.5107 19.431 19.5461 19.2792C19.5634 19.2052 19.5937 19.0716 19.6135 18.9823C19.6333 18.893 19.6695 18.7327 19.694 18.6259C19.7186 18.5192 19.7531 18.3678 19.7708 18.2894C19.7886 18.211 19.8045 18.1454 19.8062 18.1437C19.8111 18.1387 20.6786 18.0762 20.6829 18.0806C20.6868 18.0844 20.7282 18.2728 20.9632 19.3584C21.3523 21.1554 21.3381 21.0861 21.3612 21.306C21.3743 21.4313 21.3812 21.4596 21.3813 21.389C21.3814 21.333 21.4012 21.1572 21.421 21.0372C21.4296 20.985 21.4978 20.6144 21.5727 20.2137C21.6474 19.8129 21.7659 19.1769 21.8359 18.8001C21.991 17.9647 21.986 17.9907 21.9935 17.9839C21.9968 17.9809 22.0677 17.9741 22.1511 17.9689C22.2345 17.9637 22.4338 17.9495 22.5939 17.9372C22.754 17.925 22.8989 17.9146 22.9159 17.9141L22.9467 17.9132L22.9411 17.9429Z" fill="#295497" />
                                            </svg>
                                            <a className='d-block hreflink siteColor f-12 mt-1'>Word</a>
                                        </div>
                                        <div className={createNewDocType == 'xlsx' ? 'text-center w-25 hreflink selected' : 'text-center w-25 hreflink'} onClick={() => createBlankExcelXlsx()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="none">
                                                <title>Excel</title>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4355 6.58324H9.4541V9.48268V23.998V41.4545H12.0674H37.8452C37.8567 33.162 37.8028 14.5742 37.8028 14.5742C37.8028 14.5742 32.3014 8.68571 30.0727 6.54579H21.1666C16.5109 6.54131 12.4355 6.58324 12.4355 6.58324ZM29.7342 7.71458L36.6385 14.9128V40.287H10.5987V7.71458H21.14H29.7342Z" fill="#1F7244" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0536 6.31284C16.6548 6.30292 18.8382 6.29355 21.1669 6.29579H30.1733L30.2459 6.36546C31.365 7.44006 33.3015 9.45139 34.9547 11.1902C35.782 12.0604 36.5397 12.8637 37.0905 13.4494C37.3659 13.7423 37.5896 13.9808 37.7444 14.146L37.9852 14.4032L37.8028 14.5742C37.5528 14.5749 37.5528 14.575 37.5528 14.5751L37.553 14.6732L37.3796 14.4879C37.2249 14.3228 37.0014 14.0846 36.7262 13.7919C36.1759 13.2067 35.4189 12.4041 34.5923 11.5347C32.973 9.83155 31.0915 7.87705 29.9719 6.79579H30.0727V6.54579L29.8996 6.72612C29.9233 6.74892 29.9474 6.77215 29.9719 6.79579H21.1666C18.8395 6.79355 16.6571 6.80291 15.0567 6.81283C14.2565 6.81779 13.6018 6.82289 13.1471 6.82675L12.4388 6.83321L12.4355 6.58324V6.33324H12.4342L13.1429 6.32676C13.5979 6.3229 14.253 6.3178 15.0536 6.31284ZM9.7041 6.83324H12.4355L12.4388 6.83321L12.4355 6.58324L12.4329 6.33325L12.4342 6.33324H9.2041V41.7045H38.0949L38.0952 41.4549C38.101 37.3081 38.0904 30.5876 38.0783 24.9041C38.0723 22.0623 38.0659 19.4797 38.061 17.6075L38.0528 14.5743C38.0528 14.5742 38.0528 14.5735 37.8028 14.5742L38.0528 14.5743L38.0525 14.4753L37.9852 14.4032L37.8028 14.5742L37.62 14.7448L37.553 14.6732L37.561 17.6088C37.5659 19.4809 37.5723 22.0635 37.5783 24.9052C37.5901 30.4761 37.6006 37.0423 37.5956 41.2045H9.7041V6.83324ZM9.7041 41.2045H9.4541V41.4545H9.7041V41.2045ZM9.7041 6.83324H9.4541V6.58324H9.7041V6.83324ZM37.5956 41.2045C37.5954 41.2888 37.5953 41.372 37.5952 41.4542L37.8452 41.4545V41.2045H37.5956ZM10.3487 7.46458H29.8409L36.8885 14.8123V40.537H10.3487V7.46458ZM10.8487 7.96458V40.037H36.3885V15.0133L29.6276 7.96458H10.8487Z" fill="#1F7244" />
                                                <mask id="mask0_105_873" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="15" y="31" width="17" height="6">
                                                    <path d="M31.7302 31.5469H15.5723V36.1349H31.7302V31.5469Z" fill="white" />
                                                </mask>
                                                <g mask="url(#mask0_105_873)">
                                                    <mask id="mask1_105_873" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="18" y="31" width="12" height="6">
                                                        <path d="M29.3362 31.5469H18.0322V36.1349H29.3362V31.5469Z" fill="white" />
                                                    </mask>
                                                    <g mask="url(#mask1_105_873)">
                                                        <path d="M20.1443 36.0818C19.7764 36.0818 19.4351 36.002 19.1203 35.8424C18.8101 35.6784 18.5596 35.4323 18.369 35.1043C18.1784 34.7763 18.083 34.3662 18.083 33.8742C18.083 33.5107 18.1384 33.1893 18.2493 32.91C18.3645 32.6263 18.5197 32.3869 18.7147 32.1919C18.9142 31.9968 19.1381 31.8506 19.3863 31.7531C19.639 31.6511 19.9005 31.6001 20.1709 31.6001C20.4591 31.6001 20.7162 31.6577 20.9423 31.773C21.1728 31.8838 21.3634 32.0168 21.5141 32.172L20.9157 32.9034C20.8093 32.8103 20.6984 32.7349 20.5832 32.6773C20.4724 32.6152 20.3438 32.5842 20.1976 32.5842C20.029 32.5842 19.8717 32.6352 19.7254 32.7371C19.5836 32.8347 19.4683 32.9765 19.3797 33.1627C19.2954 33.3489 19.2533 33.5728 19.2533 33.8343C19.2533 34.1047 19.291 34.3352 19.3664 34.5259C19.4461 34.712 19.5548 34.8539 19.6922 34.9514C19.8341 35.0489 19.9981 35.0976 20.1842 35.0976C20.3527 35.0976 20.5012 35.06 20.6297 34.9846C20.7627 34.9093 20.8757 34.8228 20.9688 34.7253L21.5673 35.4435C21.3856 35.6562 21.1728 35.8158 20.929 35.9222C20.6851 36.0285 20.4236 36.0818 20.1443 36.0818ZM23.5351 36.0818C23.2647 36.0818 22.9832 36.0308 22.6906 35.9288C22.3981 35.8269 22.1343 35.6717 21.8994 35.4634L22.551 34.6787C22.7061 34.8029 22.8724 34.9048 23.0497 34.9846C23.2314 35.06 23.4021 35.0976 23.5617 35.0976C23.7346 35.0976 23.8587 35.0711 23.9341 35.0179C24.0138 34.9647 24.0537 34.8893 24.0537 34.7918C24.0537 34.7208 24.0293 34.6655 23.9806 34.6256C23.9362 34.5812 23.8698 34.5413 23.7811 34.5059C23.6969 34.466 23.5927 34.4216 23.4686 34.3729L22.93 34.1468C22.7749 34.0848 22.6308 34.0005 22.4978 33.8941C22.3648 33.7833 22.2584 33.6503 22.1786 33.4952C22.0988 33.3356 22.0589 33.1516 22.0589 32.9433C22.0589 32.695 22.1277 32.4712 22.265 32.2717C22.4025 32.0677 22.5909 31.906 22.8303 31.7863C23.0741 31.6621 23.3533 31.6001 23.6681 31.6001C23.9163 31.6001 24.1668 31.6488 24.4194 31.7464C24.6765 31.8395 24.9048 31.9835 25.1043 32.1786L24.5325 32.8968C24.3862 32.7948 24.2443 32.7172 24.1069 32.664C23.9739 32.6108 23.8277 32.5842 23.6681 32.5842C23.5306 32.5842 23.4198 32.6086 23.3356 32.6573C23.2558 32.7061 23.2159 32.7792 23.2159 32.8768C23.2159 32.9433 23.2403 33.0009 23.289 33.0496C23.3423 33.094 23.4176 33.1361 23.5152 33.176C23.6127 33.2115 23.7257 33.2558 23.8543 33.309L24.3795 33.5151C24.5613 33.5861 24.7142 33.6769 24.8384 33.7877C24.9625 33.8941 25.0578 34.0227 25.1243 34.1734C25.1908 34.3241 25.224 34.4992 25.224 34.6987C25.224 34.9425 25.1576 35.1708 25.0245 35.3836C24.896 35.592 24.7054 35.7604 24.4527 35.8889C24.2 36.0175 23.8941 36.0818 23.5351 36.0818ZM26.65 36.002L25.3733 31.6799H26.5835L27.0357 33.5683C27.0978 33.7988 27.1509 34.0271 27.1952 34.2532C27.244 34.4749 27.2972 34.7032 27.3548 34.9381H27.3814C27.4435 34.7032 27.4967 34.4749 27.541 34.2532C27.5898 34.0271 27.643 33.7988 27.7006 33.5683L28.1394 31.6799H29.3097L28.033 36.002H26.65Z" fill="#243A4A" />
                                                    </g>
                                                </g>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.2413 13.5887C23.7986 13.6727 23.0508 13.8139 22.6065 13.8973C22.4127 13.9337 22.0922 13.9942 21.8941 14.0316C21.6959 14.0691 21.3557 14.1333 21.138 14.1743C20.9203 14.2153 20.5516 14.2848 20.3186 14.3288C19.6604 14.4529 19.3697 14.5078 18.6404 14.6452C18.2681 14.7153 17.8041 14.8028 17.6092 14.8396C17.4144 14.8764 17.0938 14.9369 16.8968 14.974C16.6998 15.0111 16.5305 15.0431 16.5207 15.0453L16.5029 15.0493L16.5049 20.3074L16.5069 25.5655L16.6217 25.587C16.6848 25.5988 16.8897 25.6374 17.0769 25.6727C17.892 25.8267 18.4014 25.9228 18.6522 25.9698C18.8003 25.9976 19.1405 26.0617 19.4083 26.1123C19.676 26.1628 20.0822 26.2394 20.3108 26.2825C20.5394 26.3255 20.8511 26.3843 21.0034 26.413C21.1558 26.4418 21.496 26.506 21.7594 26.5556C22.0228 26.6052 22.5804 26.7103 22.9984 26.7891C23.4164 26.8679 23.9383 26.9663 24.1581 27.0076C24.3781 27.049 24.566 27.0849 24.5757 27.0873L24.5935 27.0916V26.4101V25.7285L27.398 25.7265L30.2023 25.7244L30.2657 25.7064C30.4716 25.6481 30.6179 25.5256 30.7043 25.3392C30.7212 25.3028 30.7416 25.2482 30.7497 25.2177C30.7639 25.164 30.7645 25.0156 30.7645 20.3095V15.4567L30.7467 15.3895C30.6812 15.1407 30.4985 14.964 30.2415 14.9007C30.1902 14.8881 29.9979 14.8871 27.39 14.8849L24.5935 14.8825V14.2063C24.5935 13.8343 24.5909 13.5287 24.5876 13.5271C24.5844 13.5254 24.4285 13.5532 24.2413 13.5887ZM30.1984 20.3055V25.1742L27.394 25.1722L24.5896 25.1702V24.7388V24.3073L25.5693 24.3053L26.5489 24.3033V23.6859V23.0684L25.5693 23.0665L24.5896 23.0644V22.8546V22.6449L25.5732 22.6428L26.5568 22.6409V22.0273V21.4139L25.5732 21.4119L24.5896 21.4099V21.1803V20.9508L25.5712 20.9489L26.5529 20.947L26.5549 20.3334L26.5569 19.7198L25.5732 19.7178L24.5896 19.7158V19.4743V19.2329L25.5732 19.2308L26.5568 19.2289V18.6154V18.0019L25.5732 17.9999L24.5896 17.9979V17.7723V17.5467L25.5693 17.5447L26.5489 17.5426V16.9252V16.3078L25.5693 16.3058L24.5896 16.3038L24.5875 15.8802C24.5864 15.6473 24.5872 15.4523 24.5893 15.4468C24.5923 15.4389 25.1609 15.4369 27.3957 15.4369H30.1984V20.3055ZM27.0556 16.9252V17.5427H28.1757H29.2959V16.9252V16.3077H28.1757H27.0556V16.9252ZM21.9322 18.083C21.854 18.2321 21.7549 18.4201 21.7122 18.5006C21.6693 18.5812 21.5747 18.761 21.5018 18.9004C21.429 19.0397 21.3141 19.2588 21.2467 19.3873C21.1084 19.6507 20.9801 19.8957 20.887 20.074L20.824 20.1948L20.9365 20.4065C20.9983 20.523 21.0764 20.6699 21.1102 20.733C21.1439 20.7961 21.2063 20.9137 21.2489 20.9943C21.2914 21.0748 21.3556 21.1959 21.3916 21.2634C21.4275 21.3309 21.5018 21.4708 21.5567 21.5742C21.6117 21.6776 21.7007 21.845 21.7546 21.9463C21.8084 22.0475 21.905 22.23 21.9692 22.3519C22.0333 22.4739 22.091 22.582 22.0974 22.5921C22.1038 22.6023 22.1073 22.6124 22.1052 22.6145C22.0977 22.622 20.9956 22.5434 20.9863 22.5347C20.9812 22.53 20.9398 22.4424 20.8943 22.3401C20.7153 21.9375 20.4819 21.4153 20.3901 21.212C20.283 20.9746 20.2659 20.9277 20.2394 20.7981C20.2293 20.7489 20.2186 20.7116 20.2156 20.715C20.2127 20.7184 20.2058 20.7425 20.2002 20.7687C20.1745 20.889 20.1212 21.0268 19.9923 21.307C19.9181 21.4681 19.7951 21.7353 19.719 21.9007C19.6429 22.0662 19.5576 22.2514 19.5295 22.3124C19.5015 22.3733 19.4754 22.4263 19.4718 22.43C19.4658 22.4361 18.5139 22.3744 18.5068 22.3675C18.5052 22.3659 18.5307 22.3155 18.5634 22.2554C18.5961 22.1953 18.7072 21.9876 18.8104 21.7938C18.9863 21.4636 19.0571 21.331 19.1867 21.0893C19.3181 20.8443 19.3754 20.7367 19.4994 20.5035C19.5722 20.3663 19.637 20.2452 19.6432 20.2343C19.6541 20.2153 19.6428 20.1903 19.384 19.6604C19.2352 19.3556 19.0537 18.9833 18.9807 18.8331C18.9078 18.6829 18.7924 18.4463 18.7244 18.3073C18.6564 18.1684 18.6018 18.0536 18.6033 18.0521C18.6053 18.0501 19.3976 17.9937 19.5585 17.9841L19.5939 17.982L19.6397 18.0929C19.665 18.1539 19.7198 18.2874 19.7616 18.3897C19.8034 18.4921 19.9088 18.7486 19.9958 18.9598C20.1554 19.3472 20.2007 19.4702 20.2335 19.6057C20.2433 19.6465 20.254 19.68 20.2573 19.6801C20.2606 19.6801 20.2632 19.6751 20.2632 19.669C20.2632 19.6508 20.3494 19.3729 20.3776 19.3001C20.3999 19.2428 20.5132 18.9902 20.7791 18.4056C20.8098 18.3381 20.8741 18.1956 20.922 18.0889C20.97 17.9823 21.0119 17.8921 21.0151 17.8885C21.0208 17.8824 21.9215 17.815 22.0258 17.8129L22.0743 17.8119L21.9322 18.083ZM27.0556 18.6154V19.2289H28.1757H29.2959V18.6154V18.0019H28.1757H27.0556V18.6154ZM27.0575 20.3333L27.0595 20.9469L28.1777 20.9488L29.2959 20.9508V20.3352V19.7197H28.1757H27.0554L27.0575 20.3333ZM27.0556 22.0273V22.6409H28.1757H29.2959V22.0273V21.4138H28.1757H27.0556V22.0273ZM27.0556 23.6859V24.3033H28.1757H29.2959V23.6859V23.0684H28.1757H27.0556V23.6859Z" fill="#1F7244" />
                                            </svg>
                                            <a className='d-block hreflink siteColor f-12 mt-1'>Excel</a>
                                        </div>
                                        <div className={createNewDocType == 'pptx' ? 'text-center w-25 hreflink selected' : 'text-center w-25 hreflink'} onClick={() => createBlankPowerPointPptx()} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" fill="none">
                                                <title>PPT</title>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4355 6.58324H9.4541V9.48268V23.998V41.4545H12.0674H37.8452C37.8567 33.162 37.8028 14.5742 37.8028 14.5742C37.8028 14.5742 32.3014 8.68571 30.0727 6.54579H21.1666C16.5109 6.54131 12.4355 6.58324 12.4355 6.58324ZM29.7342 7.71458L36.6385 14.9128V40.287H10.5987V7.71458H21.14H29.7342Z" fill="#D14424" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0536 6.31284C16.6548 6.30292 18.8382 6.29355 21.1669 6.29579H30.1733L30.2459 6.36546C31.365 7.44006 33.3015 9.45139 34.9547 11.1902C35.782 12.0604 36.5397 12.8637 37.0905 13.4494C37.3659 13.7423 37.5896 13.9808 37.7444 14.146L37.9852 14.4032L37.8028 14.5742C37.5528 14.5749 37.5528 14.575 37.5528 14.5751L37.553 14.6732L37.3796 14.4879C37.2249 14.3228 37.0014 14.0846 36.7262 13.7919C36.1759 13.2067 35.4189 12.4041 34.5923 11.5347C32.973 9.83155 31.0915 7.87705 29.9719 6.79579H30.0727V6.54579L29.8996 6.72612C29.9233 6.74892 29.9474 6.77215 29.9719 6.79579H21.1666C18.8395 6.79355 16.6571 6.80291 15.0567 6.81283C14.2565 6.81779 13.6018 6.82289 13.1471 6.82675L12.4388 6.83321L12.4355 6.58324V6.33324H12.4342L13.1429 6.32676C13.5979 6.3229 14.253 6.3178 15.0536 6.31284ZM9.7041 6.83324H12.4355L12.4388 6.83321L12.4355 6.58324L12.4329 6.33325L12.4342 6.33324H9.2041V41.7045H38.0949L38.0952 41.4549C38.101 37.3081 38.0904 30.5876 38.0783 24.9041C38.0723 22.0623 38.0659 19.4797 38.061 17.6075L38.0528 14.5743C38.0528 14.5742 38.0528 14.5735 37.8028 14.5742L38.0528 14.5743L38.0525 14.4753L37.9852 14.4032L37.8028 14.5742L37.62 14.7448L37.553 14.6732L37.561 17.6088C37.5659 19.4809 37.5723 22.0635 37.5783 24.9052C37.5901 30.4761 37.6006 37.0423 37.5956 41.2045H9.7041V6.83324ZM9.7041 41.2045H9.4541V41.4545H9.7041V41.2045ZM9.7041 6.83324H9.4541V6.58324H9.7041V6.83324ZM37.5956 41.2045C37.5954 41.2888 37.5953 41.372 37.5952 41.4542L37.8452 41.4545V41.2045H37.5956ZM10.3487 7.46458H29.8409L36.8885 14.8123V40.537H10.3487V7.46458ZM10.8487 7.96458V40.037H36.3885V15.0133L29.6276 7.96458H10.8487Z" fill="#D14424" />
                                                <mask id="mask0_105_1072" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="15" y="31" width="17" height="6">
                                                    <path d="M31.7302 31.5469H15.5723V36.1349H31.7302V31.5469Z" fill="white" />
                                                </mask>
                                                <g mask="url(#mask0_105_1072)">
                                                    <mask id="mask1_105_1072" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="18" y="31" width="12" height="6">
                                                        <path d="M29.3362 31.6798H18.0322V36.0019H29.3362V31.6798Z" fill="white" />
                                                    </mask>
                                                    <g mask="url(#mask1_105_1072)">
                                                        <path d="M18.0752 36.0019V31.6798H19.6577C19.9725 31.6798 20.2628 31.7242 20.5288 31.8128C20.7948 31.9015 21.0076 32.05 21.1671 32.2583C21.3312 32.4667 21.4132 32.7526 21.4132 33.1161C21.4132 33.4663 21.3312 33.7544 21.1671 33.9805C21.0076 34.2022 20.7948 34.3661 20.5288 34.4725C20.2673 34.5789 19.9858 34.6321 19.6844 34.6321H19.2189V36.0019H18.0752ZM19.2189 33.7278H19.6311C19.8572 33.7278 20.0235 33.6747 20.1299 33.5683C20.2406 33.4574 20.2961 33.3067 20.2961 33.1161C20.2961 32.9211 20.2362 32.7836 20.1166 32.7038C19.9969 32.624 19.8262 32.5841 19.6046 32.5841H19.2189V33.7278ZM22.1206 36.0019V31.6798H23.7032C24.018 31.6798 24.3083 31.7242 24.5742 31.8128C24.8402 31.9015 25.053 32.05 25.2126 32.2583C25.3766 32.4667 25.4586 32.7526 25.4586 33.1161C25.4586 33.4663 25.3766 33.7544 25.2126 33.9805C25.053 34.2022 24.8402 34.3661 24.5742 34.4725C24.3127 34.5789 24.0313 34.6321 23.7298 34.6321H23.2644V36.0019H22.1206ZM23.2644 33.7278H23.6766C23.9027 33.7278 24.0689 33.6747 24.1753 33.5683C24.2861 33.4574 24.3415 33.3067 24.3415 33.1161C24.3415 32.9211 24.2817 32.7836 24.162 32.7038C24.0423 32.624 23.8716 32.5841 23.65 32.5841H23.2644V33.7278ZM26.9906 36.0019V32.6373H25.8469V31.6798H29.278V32.6373H28.1343V36.0019H26.9906Z" fill="#243A4A" />
                                                    </g>
                                                </g>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0768 13.5427C24.0376 13.5502 23.9664 13.5638 23.9184 13.5728C23.8706 13.5818 23.6213 13.6288 23.3645 13.6771C23.1077 13.7255 22.8245 13.7789 22.7353 13.7958C22.5263 13.8356 22.0966 13.9167 21.7699 13.9781C21.6284 14.0047 21.4112 14.0457 21.2871 14.0692C20.9711 14.129 20.1373 14.286 19.8349 14.3426C19.6956 14.3687 19.5656 14.3934 19.5461 14.3975C19.5264 14.4016 19.4054 14.4247 19.277 14.4487C18.8677 14.5252 17.8425 14.7183 17.3223 14.8169C17.2331 14.8338 16.9303 14.8907 16.6496 14.9433C16.3688 14.9959 16.1311 15.0407 16.1213 15.0428L16.1035 15.0468L16.1055 20.3068L16.1075 25.567L16.2658 25.5967C16.6044 25.6602 17.2335 25.7788 17.437 25.8174C17.5545 25.8397 17.6703 25.8615 17.6942 25.8657C17.7181 25.87 17.8481 25.8945 17.9831 25.9201C18.118 25.9457 18.3441 25.9884 18.4856 26.0151C18.6271 26.0416 18.8443 26.0825 18.9683 26.106C19.0924 26.1295 19.3007 26.1687 19.4313 26.1932C19.5619 26.2177 19.7791 26.2587 19.9141 26.2842C20.049 26.3098 20.2751 26.3524 20.4165 26.3791C20.5581 26.4057 20.7771 26.4469 20.9033 26.4707C21.0295 26.4945 21.2379 26.5337 21.3662 26.5579C21.4947 26.582 21.6727 26.6157 21.7619 26.6327C21.9313 26.6647 22.1542 26.7068 22.6206 26.7945C22.7729 26.8233 23.0205 26.87 23.1706 26.8984C23.3208 26.9268 23.4704 26.9549 23.503 26.9608C23.5356 26.9667 23.6585 26.9897 23.776 27.0121C23.8936 27.0345 24.0271 27.0596 24.0728 27.068C24.1185 27.0764 24.1639 27.0851 24.1737 27.0874L24.1915 27.0916V26.1815V25.2712H26.9723C29.4774 25.2712 29.7597 25.27 29.8194 25.2586C30.0157 25.2214 30.1798 25.1043 30.2785 24.9309C30.3138 24.8689 30.3388 24.795 30.352 24.7132C30.3638 24.6407 30.3647 24.2535 30.3627 20.0995L30.3603 15.5648L30.3426 15.5015C30.2739 15.2564 30.0883 15.0776 29.8399 15.0173C29.7859 15.0042 29.6219 15.0033 26.9871 15.0011L24.1915 14.9987V14.2628V13.527L24.1697 13.528C24.1578 13.5285 24.1159 13.5352 24.0768 13.5427ZM29.7925 20.137L29.7906 24.8319H26.9891H24.1875L24.1855 24.2483L24.1835 23.6647H26.4311H28.6787V23.356V23.0473H26.4311H24.1836V22.6161V22.1847H26.4311H28.6787V21.8761V21.5675H26.4311H24.1836V20.7616C24.1836 20.3183 24.1857 19.9535 24.1883 19.951C24.1909 19.9484 24.2138 19.9737 24.239 20.0073C24.6774 20.5891 25.4204 20.8766 26.1423 20.7439C26.6814 20.6447 27.1618 20.3146 27.4485 19.8465C27.6208 19.5649 27.7112 19.2705 27.7333 18.9183L27.7389 18.8293H26.7605H25.7822V17.8554V16.8815L25.7051 16.8864C25.3197 16.9109 25.0088 17.0124 24.7099 17.2112C24.5457 17.3204 24.3576 17.4958 24.2479 17.6422C24.2202 17.6792 24.1944 17.7107 24.1905 17.7121C24.1866 17.7136 24.1836 17.2267 24.1836 16.5785V15.4421H26.9891H29.7945L29.7925 20.137ZM26.0355 16.6261C26.0355 16.6387 26.0407 16.9286 26.0469 17.2703C26.0531 17.6119 26.0607 18.0384 26.0637 18.218L26.0692 18.5444H27.0388H28.0084L28.0033 18.4356C27.9854 18.0567 27.8462 17.6833 27.6028 17.3614C27.5325 17.2684 27.3716 17.1036 27.2819 17.0327C26.9563 16.7752 26.5521 16.6231 26.1522 16.6077L26.0355 16.6032V16.6261ZM20.4443 17.9304C20.5737 17.9517 20.6072 17.9596 20.703 17.9912C20.9083 18.0591 21.0587 18.1561 21.1881 18.3042C21.4077 18.5555 21.5106 18.9176 21.4985 19.3978C21.4906 19.7141 21.4371 19.9347 21.3123 20.1655C21.1099 20.5396 20.7687 20.7971 20.3521 20.8899C20.1728 20.9299 20.1693 20.9301 19.8211 20.9287L19.4907 20.9275V21.7025V22.4776H19.4612C19.4263 22.4776 18.7614 22.4321 18.7013 22.4255L18.6597 22.421V20.2176C18.6597 19.0057 18.6617 18.0135 18.6617 18.0135C18.6617 18.0135 18.9735 17.9903 19.3522 17.9625C19.9639 17.9177 20.0592 17.9124 20.2069 17.9153C20.2986 17.9172 20.405 17.924 20.4443 17.9304ZM19.6371 18.7346C19.5848 18.7376 19.5305 18.7406 19.5164 18.7412L19.4907 18.7423V19.4426V20.143H19.6769C19.8901 20.143 19.9866 20.1343 20.0828 20.1064C20.2201 20.0666 20.3213 19.998 20.3929 19.8961C20.4747 19.7796 20.5099 19.6541 20.5166 19.4545C20.524 19.2345 20.4918 19.0895 20.4072 18.9631C20.36 18.8923 20.3197 18.854 20.2463 18.8097C20.1936 18.778 20.0889 18.7444 20.0112 18.7344C19.9476 18.7261 19.7835 18.7263 19.6371 18.7346Z" fill="#D14424" />
                                            </svg>
                                            <a className='d-block hreflink siteColor f-12 mt-1'>PPT</a>
                                        </div>
                                        <div className='text-center w-25' onClick={() => { setRemark(true) }}>
                                            <svg className="hreflink" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48"  >
                                                <title>SmartNotes</title>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 23.5V40H19.9177H28.7609V37.9373H19.9189H11.0769V23.5V9.06249H18.3462H25.6154V13.1875V17.3125H29.7692H33.9231V21.4237V29.3325H36V21.7232V15.8513L31.5432 11.4256L27.0863 7H18.0432H9V23.5ZM30.0866 12.901L32.4515 15.25H30.0719H27.6923V12.901C27.6923 11.6091 27.699 10.5521 27.707 10.5521C27.7152 10.5521 28.7859 11.6091 30.0866 12.901Z" stroke-width="0.2" />
                                                <path d="M36.3999 32H34.6V35.6H31V37.3999H34.6V41H36.3999V37.3999H40V35.6H36.3999V32Z" stroke-width="0.2" />
                                            </svg>
                                            <a className='d-block siteColor hreflink f-11 mt-1'>SmartNotes</a>
                                        </div> */}
                                </div>
                            </div>
                            {
                                FileNamePopup ?
                                    <>
                                        <div className="col-sm-12 mt-2 p-0 input-group">
                                            <input type="text" onChange={(e) => { changeFileName(e) }} value={renamedFileName} placeholder='Enter File Name' className='form-control' />
                                        </div>
                                        <footer className='text-end py-2'>
                                            <button className="btn btn-primary" disabled={!createNewFile} onClick={() => { CreateNewAndTag() }}>Create</button>
                                            <button className='btn btn-default ms-1' onClick={() => cancelNewCreateFile()}>Cancel</button>
                                        </footer></> : ''
                            }
                            {/* <div className='text-center w-25 px-2' onClick={() => { setUploadEmailModal(true) }}>
                                <svg className="hreflink" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"  >
                                    <title>Upload Email</title>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.73609 11.5681C3.68578 11.7002 3.66678 17.3809 3.69423 24.1921L3.74396 36.5761L24.048 36.6251L44.352 36.6739V24.0011V11.3281H24.09C8.05724 11.3281 3.80886 11.3782 3.73609 11.5681ZM41.28 13.9197C41.28 13.9723 37.3923 15.9595 32.6407 18.3357L24.0013 22.6563L15.4567 18.3853C10.7571 16.0362 6.91196 14.049 6.91196 13.9691C6.91196 13.8894 14.6448 13.8241 24.096 13.8241C33.5472 13.8241 41.28 13.8671 41.28 13.9197ZM15.2634 21.0712L24 25.4382L32.7365 21.0712C37.5415 18.6692 41.5591 16.7041 41.6645 16.7041C41.7889 16.7041 41.856 19.7613 41.856 25.4411V34.178L24.048 34.1291L6.23996 34.0801L6.18985 25.6321C6.14281 17.7048 6.1693 16.7041 6.42543 16.7041C6.48111 16.7041 10.4584 18.6692 15.2634 21.0712Z" />
                                    <rect width="13" height="13" transform="translate(34 26)" fill="white" />
                                    <path d="M41.4 28H39.6V31.6H36V33.4H39.6V37H41.4V33.4H45V31.6H41.4V28Z" />
                                </svg><a className='d-block siteColor hreflink f-11 mt-1'>Upload Email</a></div>
                            <div className='text-center w-25' onClick={() => { setFileNamePopup(true) }}>
                                <svg className="hreflink" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"  >
                                    <title>Create New Online File</title>
                                    <rect width="48" height="48" fill="white" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.58157 11.104C7.83652 11.3416 7.46851 11.6111 7.21812 12.1035C7.00209 12.528 6.9766 14.0418 7.01468 24.2181L7.05823 35.8478L7.4519 36.2736C7.66841 36.5077 8.10402 36.7756 8.41991 36.8687C8.8026 36.9817 14.108 37.0217 24.3212 36.9889C40.8615 36.9358 39.9299 36.9888 40.6161 36.0632C40.9286 35.6419 40.9403 35.3369 40.983 26.4099C41.0319 16.2148 41.0437 16.3455 40.0207 15.7118C39.5089 15.3945 39.2214 15.3808 33.0792 15.3803C25.7954 15.3794 25.9103 15.3979 25.1066 14.0959C24.2515 12.7107 23.4347 11.7798 22.7462 11.406C22.0712 11.0396 21.9788 11.0345 15.5284 11.0037C11.9346 10.9864 8.80857 11.0317 8.58157 11.104ZM21.8043 13.3465C22.1875 13.5766 23.7565 15.6701 23.7565 15.9513C23.7565 16.1085 22.8223 16.8969 22.2481 17.2241C21.7926 17.4838 21.1438 17.511 15.41 17.511H9.07494V15.2977V13.0843H15.2212C20.5659 13.0843 21.4244 13.1185 21.8043 13.3465ZM38.8832 26.1597L38.8414 34.8083L23.9582 34.8501L9.07494 34.892V27.2672V19.6424L15.488 19.6414C19.3843 19.6409 22.1356 19.5744 22.4986 19.472C22.8272 19.3793 23.4672 19.0051 23.9209 18.6408C25.3137 17.5221 25.2118 17.5355 32.4298 17.5225L38.925 17.511L38.8832 26.1597Z" />
                                    <rect width="13" height="13" transform="translate(33 28)" fill="white" />
                                    <path d="M40.3999 30H38.6V33.6H35V35.3999H38.6V39H40.3999V35.3999H44V33.6H40.3999V30Z" stroke-width="0.2" />
                                </svg><a className='d-block siteColor hreflink f-11  mt-1'>Create New Online File</a></div>
                            <div className='text-center w-25' onClick={() => { setRemark(true) }}>
                                <svg className="hreflink" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"  >
                                    <title>Add SmartNotes</title>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 23.5V40H19.9177H28.7609V37.9373H19.9189H11.0769V23.5V9.06249H18.3462H25.6154V13.1875V17.3125H29.7692H33.9231V21.4237V29.3325H36V21.7232V15.8513L31.5432 11.4256L27.0863 7H18.0432H9V23.5ZM30.0866 12.901L32.4515 15.25H30.0719H27.6923V12.901C27.6923 11.6091 27.699 10.5521 27.707 10.5521C27.7152 10.5521 28.7859 11.6091 30.0866 12.901Z" stroke-width="0.2" />
                                    <path d="M36.3999 32H34.6V35.6H31V37.3999H34.6V41H36.3999V37.3999H40V35.6H36.3999V32Z" stroke-width="0.2" />
                                </svg><a className='d-block siteColor hreflink f-11 mt-1'>Add SmartNotes</a></div> */}
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
                                                <span><a title="Click for Associated Folder" className='hreflink ms-2 siteColor' onClick={() => setChoosePathPopup(true)} > Change Path </a></span>
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
                                                                        <th style={{ width: "20px" }}></th>
                                                                        <th style={{ width: "50px" }} className='p-1'>Type</th>
                                                                        <th className='p-1'>Title</th>
                                                                        <th style={{ width: '60px' }} className='p-1'>Rank</th>

                                                                    </tr>

                                                                </thead>
                                                                <tbody className='Scrolling'>
                                                                    {ExistingFiles?.map((file: any) => {
                                                                        if (!AllReadytagged?.some((doc: any) => file?.Id == doc?.Id)) {
                                                                            return (
                                                                                <tr>
                                                                                    <td><input type="checkbox" className='form-check-input hreflink' checked={AllReadytagged?.some((doc: any) => file.Id == doc.Id)} onClick={() => { tagSelectedDoc(file) }} /></td>
                                                                                    <td><span className={`mt-1 svg__iconbox svg__icon--${file?.docType}`} title={file?.File_x0020_Type}></span></td>
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

                                                                    <th style={{ width: "50px" }} className='p-1'>Type</th>
                                                                    <th className='p-1'>Title</th>
                                                                    <th style={{ width: "100px" }}>Item Rank</th>
                                                                    <th style={{ width: "20px" }}>&nbsp;</th>

                                                                </tr>

                                                            </thead>
                                                            <tbody>
                                                                {AllReadytagged?.map((file: any) => {
                                                                    return (
                                                                        <tr>
                                                                            <td><span className={`mt-1 svg__iconbox svg__icon--${file?.docType}`} title={file?.docType}></span></td>
                                                                            <td><a href={`${file?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off" className='hreflink'>{file?.Title}</a></td>
                                                                            <td>{file?.ItemRank}</td>
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
            {
                // FileNamePopup ?
                //     <div className="modal Anc-Confirmation-modal" >
                //         <div className="modal-dialog modal-mg rounded-0 " style={{ maxWidth: "400px" }}>
                //             <div className="modal-content rounded-0">
                //                 <div className="modal-header py-0">
                //                     <div className='d-flex full-width justify-content-between pb-1'>
                //                         <div className='subheading m-0'>
                //                             {/* <img className="imgWid29 pe-1 mb-1 " src={Item?.SiteIcon} /> */}
                //                             <span className="siteColor">
                //                                 Create New Online File {createNewDocType?.length > 0 ? ` - ${createNewDocType}` : ''}
                //                             </span>
                //                         </div>
                //                         <div className='d-flex'>
                //                             <Tooltip ComponentId="7642" />
                //                             <span style={{ marginTop: "7px" }} onClick={() => cancelNewCreateFile()}><i className="svg__iconbox svg__icon--cross crossBtn me-1"></i></span>
                //                         </div>
                //                     </div>


                //                 </div>
                //                 <div className="modal-body p-2 row">
                //                     <div className="AnC-CreateDoc-Icon p-0">
                //                         <div className={createNewDocType == 'docx' ? 'selected' : ''}>
                //                             <span onClick={() => createBlankWordDocx()} className='svg__iconbox svg__icon--docx hreflink' title='Word'></span>
                //                         </div>
                //                         <div className={createNewDocType == 'xlsx' ? 'selected' : ''}>
                //                             <span onClick={() => createBlankExcelXlsx()} className='svg__iconbox svg__icon--xlsx hreflink' title='Excel'></span>
                //                         </div>
                //                         <div className={createNewDocType == 'pptx' ? 'selected' : ''}>
                //                             <span onClick={() => createBlankPowerPointPptx()} className='svg__iconbox svg__icon--ppt hreflink' title='Presentation'></span>
                //                         </div>
                //                     </div>
                //                     <div className="col-sm-12 mt-2 p-0">
                //                         <input type="text" onChange={(e) => { changeFileName(e) }} value={renamedFileName} placeholder='Enter File Name' className='full-width' />
                //                     </div>
                //                 </div>
                //                 <footer className='text-end p-2'>


                //                     <button className="btn btn-primary" disabled={!createNewFile} onClick={() => { CreateNewAndTag() }}>Create</button>
                //                     <button className='btn btn-default ms-1' onClick={() => cancelNewCreateFile()}>Cancel</button>
                //                 </footer>
                //             </div>
                //         </div>
                //     </div> : ''
            }
            {
                ShowConfirmation ?
                    <>

                        <div className="modal Anc-Confirmation-modal" >
                            <div className="modal-dialog modal-mg rounded-0 " style={{ maxWidth: "700px" }}>
                                {pageLoaderActive ? <PageLoader /> : ''}
                                <div className="modal-content rounded-0">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{UploadedDocDetails?.fileName} - Upload Confirmation</h5>
                                        <span onClick={() => cancelConfirmationPopup()}><i className="svg__iconbox svg__icon--cross crossBtn"></i></span>
                                    </div>
                                    <div className="modal-body p-2">
                                        <Col className='p-1'>
                                            <Col><span><strong>Folder :</strong> </span><a href={`${rootSiteName}${selectedPath?.displayPath}`} target="_blank" data-interception="off" className='hreflink'> {selectedPath?.displayPath} <span className="svg__iconbox svg__icon--folder ms-1 alignIcon "></span></a></Col>
                                            <Col className='mb-2'><strong>Metadata-Tag :</strong> <span>{props?.item?.Title}</span></Col>

                                            <Col className='Alltable mt-2'>
                                                <div>
                                                    <Table className='table table-hover mb-0'>
                                                        <thead className='fixed-Header top-0'>
                                                            <tr>
                                                                <th className='ps-2' style={{ width: "60%" }}>File Name</th>
                                                                {/* <th className='pe-1' style={{ width: "10%" }}>Uploaded</th>
                                                                <th className='pe-1' style={{ width: "8%" }}>Tagged</th> */}
                                                                <th className='pe-1' style={{ width: "12%" }}>Share Link</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td><span className={`svg__iconbox svg__icon--${UploadedDocDetails?.docType}`}></span><a href={UploadedDocDetails?.link} target="_blank" data-interception="off" className='hreflink'>{UploadedDocDetails?.fileName}</a>{`(${UploadedDocDetails?.size})`}</td>
                                                                {/* <td>{UploadedDocDetails?.uploaded == true ? <span className='alignIcon  svg__iconbox svg__icon--Completed' style={{ width: "15px" }}></span> : <span className='alignIcon  svg__iconbox svg__icon--cross' ></span>}</td>
                                                                <td>{UploadedDocDetails?.tagged == true ? <span className='alignIcon  svg__iconbox svg__icon--Completed' style={{ width: "15px" }}></span> : <span className='alignIcon  svg__iconbox svg__icon--cross'></span>}</td> */}
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
                        </div>
                    </>
                    : ''
            }
            {
                remark && <SmartInformation Id={props?.item?.Id}
                    AllListId={props.AllListId}
                    Context={props?.Context}
                    taskTitle={props?.item?.Title}
                    listName={props?.item?.siteType != undefined ? props?.item?.siteType : 'Master Tasks'}
                    showHide={"ANCTaskProfile"}
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
            <div className='clearfix'></div>
        </>
    )
}

export default AncTool;

