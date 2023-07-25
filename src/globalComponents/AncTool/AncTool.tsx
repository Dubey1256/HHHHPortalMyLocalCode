import React from 'react'
import DefaultFolderContent from './DefaultFolderContent'
import axios from 'axios';
// import {
//     Document,
//     Packer,
//     Paragraph
// } from "docx";
import Tooltip from '../Tooltip';
import { sp } from 'sp-pnp-js'
import { Web } from "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";
import pptxgen from 'pptxgenjs';
import { Button, Modal } from "react-bootstrap";
import * as GlobalFunction from '../globalCommon';
// import { Document, Paragraph, Packer, IRunPropertiesOptions } from 'docx';
// import officegen from 'officegen';
import ExcelJS from 'exceljs';
import { IFileAddResult } from "@pnp/sp/files";
import { Panel, PanelType } from 'office-ui-fabric-react';
import ConnectExistingDoc from './ConnectExistingDoc';
let backupExistingFiles: any = [];
let backupCurrentFolder: any = [];
let AllFilesAndFolderBackup: any = [];
let createNewDocType: any = '';
let siteName: any = '';
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
    const [FileNamePopup, setFileNamePopup] = React.useState(false);
    const [ServicesTaskCheck, setServicesTaskCheck] = React.useState(false);
    const [folderExist, setFolderExist] = React.useState(false);
    const [Item, setItem]: any = React.useState({});
    const [renamedFileName, setRenamedFileName]: any = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [newlyCreatedFile, setNewlyCreatedFile]: any = React.useState(null);
    const [itemRank, setItemRank] = React.useState(5);
    const [selectedPath, setSelectedPath] = React.useState({
        displayPath: '',
        completePath: '',
    });
    const [AllFilesAndFolder, setAllFilesAndFolder]: any = React.useState([]);
    const [currentFolderFiles, setCurrentFolderFiles]: any = React.useState([]);
    const [ExistingFiles, setExistingFiles]: any = React.useState([]);
    const [DocsToTag, setDocsToTag]: any = React.useState([]);
    React.useEffect(() => {
        siteUrl = props?.Context?.pageContext?.web?.absoluteUrl;
        if (props?.item != undefined) {
            setItem(props?.item)
            if (props?.item?.Services?.length > 0) {
                setServicesTaskCheck(true)
            }
        }
        pathGenerator();
    }, [])
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
        let path = '';
        if (siteName?.length > 0) {
            if (props?.item?.Services?.length > 0) {
                path = `/documents/tasks/Service-tasks/${siteName}/${props?.item?.Title}`
            } else {
                path = `/documents/tasks/Component-tasks/${siteName}/${props?.item?.Title}`
            }
        } else {
            if (ServicesTaskCheck) {
                path = `/documents/Service-Portfolio/${props?.item?.Title}`
            } else {
                path = `/documents/Component-Portfolio/${props?.item?.Title}`
            }
        }
        let displayUrl = props?.Context?.pageContext?.web?.serverRelativeUrl + path
        let internalPath = siteUrl + path
        setSelectedPath({
            ...selectedPath,
            displayPath: displayUrl,
            completePath: internalPath
        })
        fetchFilesByPath(displayUrl)
        let allFiles: any = await getExistingUploadedDocuments()
        setAllFilesAndFolder(allFiles);
        AllFilesAndFolderBackup = allFiles;
        checkFolderExistence(props?.item?.Title);
    }
    const checkFolderExistence = (title: any) => {
        AllFilesAndFolderBackup?.map((File: any) => {
            if (File?.FileLeafRef == title && File?.FileSystemObjectType == 1) {
                setFolderExist(true)
            }
        })
    }

    async function getExistingUploadedDocuments(): Promise<any[]> {
        try {
            let alreadyTaggedFiles: any = [];
            let selectQuery = 'Id,SharewebId,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,Editor/Id,Editor/Title,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified&$expand=Author,Editor'

            if (siteName?.length > 0) {
                selectQuery = `Id,SharewebId,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,${siteName}/Id,${siteName}/Title,Editor/Id,Editor/Title,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified&$expand=Author,Editor,${siteName}`
            }
            // const files = await folder.files.get();
            const files = await sp.web.lists.getByTitle('Documents').items.select(selectQuery).getAll();
            let newFilesArr: any = [];
            files?.map((file: any) => {
                if (file?.Title != undefined && file?.File_x0020_Type != undefined) {
                    file.docType = getFileType(file?.Name);
                    newFilesArr.push(file)
                }
                if (file[siteName] != undefined && file[siteName].length > 0 && file[siteName].some((task: any) => task.Id == props?.item?.Id)) {
                    alreadyTaggedFiles.push(file);
                }
            })
            backupExistingFiles = newFilesArr;
            setExistingFiles(newFilesArr)
            setDocsToTag(alreadyTaggedFiles);

            return files
        } catch (error) {
            console.log('An error occurred while fetching files:', error);
            return [];
        }
    }
    const searchExistingFile = (value: any) => {
        if (value?.length > 0) {
            setExistingFiles((prevFile: any) => {
                backupExistingFiles
            });
        } else {
            setExistingFiles(backupExistingFiles);
        }
    }

    const tagSelectedDoc = async (file: any) => {
        let resultArray: any = [];
        if (file[siteName] != undefined && file[siteName].length > 0) {
            file[siteName].map((task: any) => {
                if (task?.Id != undefined) {
                    resultArray.push(task.Id)
                }
            })
        }
        if (!DocsToTag?.some((doc: any) => file.Id == doc.Id) && !resultArray.some((taskID: any) => taskID == props?.item?.Id)) {
            resultArray.push(props?.item?.Id)
            let siteColName = `${siteName}Id`
            // Update the document file here
            await sp.web.lists.getByTitle('Documents').items.getById(file.Id)
                .update({ [siteColName]: { "results": resultArray } }).then((updatedFile: any) => {
                    file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                    setDocsToTag([...DocsToTag, ...[file]])
                    alert(`The file '${file?.Title}' has been successfully tagged to the task '${props?.item?.TaskId}'. Please refresh the page to get the changes.`);
                    return file;
                })


        } else if (DocsToTag?.some((doc: any) => file.Id == doc.Id) && resultArray.some((taskID: any) => taskID == props?.item?.Id)) {
            resultArray = resultArray.filter((taskID: any) => taskID != props?.item?.Id)
            let siteColName = `${siteName}Id`
            // Update the document file here
            await sp.web.lists.getByTitle('Documents').items.getById(file.Id)
                .update({ [siteColName]: { "results": resultArray } }).then((updatedFile: any) => {
                    file[siteName] = file[siteName].filter((task: any) => task.Id != props?.item?.Id);
                    setDocsToTag((prevFile: any) => {
                        return prevFile.filter((item: any) => {
                            return item.Id != file.Id
                        });
                    });
                    alert(`The file '${file?.Title}' has been successfully untagged from the task '${props?.item?.TaskId}'. Please refresh the page to get the changes.`);
                    return file;
                })


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

    function getFileType(fileName: any) {
        const regex = /(?:\.([^.]+))?$/;
        const match = regex.exec(fileName);
        if (match === null) {
            return null;
        }
        return match[1];
    }
    async function fetchFilesFromFolder(folderPath: string): Promise<any[]> {
        try {
            const folder = sp.web.getFolderByServerRelativeUrl(folderPath);
            const files = await folder.files.get();

            return files;
        } catch (error) {
            console.log('An error occurred while fetching files:', error);
            return [];
        }
    }
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
    const setModalIsOpenToFalse = () => {
        setSelectedFile(null);
        setModalIsOpen(false);
    }
    const onRenderCustomHeaderMain = () => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <img className="imgWid29 pe-1 mb-1 " src={Item?.SiteIcon} />
                    <span className="siteColor">
                        {`Add & Connect Tool - ${Item.TaskId != undefined || Item.TaskId != null ? Item.TaskId : ""} ${Item.Title != undefined || Item.Title != null ? Item.Title : ""}`}
                    </span>
                </div>
                <Tooltip ComponentId="528" />
            </div>
        );
    };
    const onRenderCustomFooterMain = () => {
        return (
            <footer className={ServicesTaskCheck ? "serviepannelgreena bg-f4 fixed-bottom" : "bg-f4 fixed-bottom"}>
                <div className="align-items-center d-flex justify-content-between me-3 px-4 py-2">
                    <span >
                        <button className="btn btn-primary px-3">
                            OK
                        </button>
                    </span>
                </div>
            </footer>
        )
    }


    const handleFileDrop = (event: any) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleFileInputChange = (event: any) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleRankChange = (event: any) => {
        const rank = parseInt(event.target.value);
        setItemRank(rank);
    };
    const CreateFolder = async (path: any, folderName: any): Promise<any> => {
        try {
            const library = sp.web.lists.getByTitle('Documents');
            const parentFolder = sp.web.getFolderByServerRelativeUrl(path);
            await parentFolder.folders.add(folderName).then((data: any) => {
                console.log('Folder created successfully.');
                return Promise.resolve(data)
            });
        } catch (error) {
            return Promise.reject(error)
        }
    }
    const handleUpload = async () => {
        let isFolderAvailable = folderExist;
        if (isFolderAvailable == false) {
            try {
                await CreateFolder(selectedPath?.displayPath?.split(props?.item?.Title)[0], props?.item?.Title).then((data: any) => {
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

                    // Upload the file
                    await sp.web
                        .getFolderByServerRelativeUrl(selectedPath.displayPath)
                        .files.add(selectedFile?.name, fileContent, true).then(async (uploadedFile: any) => {
                            setTimeout(async () => {
                                const fileItems = await getExistingUploadedDocuments()
                                fileItems?.map(async (file: any) => {
                                    if (file?.FileDirRef != undefined && file?.FileDirRef?.toLowerCase() == selectedPath?.displayPath?.toLowerCase() && file?.FileSystemObjectType == 0 && file?.FileLeafRef == selectedFile?.name) {
                                        let resultArray: any = [];
                                        resultArray.push(props?.item?.Id)
                                        let siteColName = `${siteName}Id`
                                        // Update the document file here
                                        let postData = {
                                            [siteColName]: { "results": resultArray },
                                            ItemRank: itemRank,
                                            Title: renamedFileName?.length > 0 ? renamedFileName : selectedFile?.name?.split(`.${file.docType}`)[0]
                                        }
                                        await sp.web.lists.getByTitle('Documents').items.getById(file.Id)
                                            .update(postData).then((updatedFile: any) => {
                                                file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                                                setDocsToTag([...DocsToTag, ...[file]])
                                                alert(`The file '${renamedFileName?.length > 0 ? renamedFileName : selectedFile?.name}' has been successfully tagged to the task '${props?.item?.TaskId}'.Please refresh the page to get the changes.`);
                                                pathGenerator()
                                                setRenamedFileName('')
                                                return file;
                                            })
                                        console.log("File uploaded successfully.", file);
                                    }
                                })
                            }, 2000);

                        });


                };

                reader.readAsArrayBuffer(selectedFile);
            } catch (error) {
                console.log("File upload failed:", error);
            }
        }
        setSelectedFile(null);
        setItemRank(5);
    };
    // Create Files direct From Code And Tag
    async function createBlankWordDocx() {
        createNewDocType = 'docx'
       let jsonResult= await GlobalFunction.docxUint8Array();
       setNewlyCreatedFile(jsonResult)
       setFileNamePopup(true)
    }

    async function createBlankExcelXlsx() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.addRow([]);
        const buffer = await workbook.xlsx.writeBuffer();
        createNewDocType = 'xlsx'
        setNewlyCreatedFile(buffer)
        setFileNamePopup(true)
    }

    async function createBlankPowerPointPptx() {
        createNewDocType = 'pptx'
        const pptx = new pptxgen();
        pptx.addSlide();

        await pptx.stream().then((file: any) => {
            setNewlyCreatedFile(file)
            setFileNamePopup(true);
        })
    }
    const CreateNewAndTag = async () => {
        let isFolderAvailable = folderExist;
        let fileName = ''
        if (isFolderAvailable == false) {
            try {
                await CreateFolder(selectedPath?.displayPath?.split(props?.item?.Title)[0], props?.item?.Title).then((data: any) => {
                    isFolderAvailable = true
                    setFolderExist(true)
                })

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
                await sp.web
                    .getFolderByServerRelativeUrl(selectedPath.displayPath)
                    .files.add(fileName, newlyCreatedFile, true).then(async (uploadedFile: any) => {
                        setTimeout(async () => {
                            const fileItems = await getExistingUploadedDocuments()
                            fileItems?.map(async (file: any) => {
                                if (file?.FileDirRef != undefined && file?.FileDirRef?.toLowerCase() == selectedPath?.displayPath?.toLowerCase() && file?.FileSystemObjectType == 0 && file?.FileLeafRef == fileName) {
                                    let resultArray: any = [];
                                    resultArray.push(props?.item?.Id)
                                    let siteColName = `${siteName}Id`
                                    // Update the document file here
                                    let postData = {
                                        [siteColName]: { "results": resultArray },
                                        ItemRank: itemRank,
                                        Title: fileName
                                    }
                                    await sp.web.lists.getByTitle('Documents').items.getById(file.Id)
                                        .update(postData).then((updatedFile: any) => {
                                            file[siteName].push({ Id: props?.item?.Id, Title: props?.item?.Title });
                                            setDocsToTag([...DocsToTag, ...[file]])
                                            alert(`The file '${fileName}' has been successfully tagged to the task '${props?.item?.TaskId}'. Please refresh the page to get the changes.`);
                                            pathGenerator()
                                            cancelNewCreateFile()
                                            return file;
                                        })
                                    console.log("File uploaded successfully.", file);
                                }
                            })
                        }, 2000);

                    });
            } catch (error) {
                console.log("File upload failed:", error);
            }
        }
    }
    //File Name Popup
    const cancelNewCreateFile = () => {
        setFileNamePopup(false);
        setNewlyCreatedFile(null);
        setRenamedFileName('');
        createNewDocType = '';
    }



    return (
        <>
            <div className={ServicesTaskCheck ? "serviepannelgreena mb-3 card commentsection" : "mb-3 card commentsection"}>
                <div className='card-header'>

                    <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Add & Connect Tool<span><Tooltip ComponentId='324' /></span></div>

                </div>
                <div className='card-body'>
                    <div className="row">
                        <div className="comment-box hreflink mb-2 col-sm-12">
                            <span onClick={() => { setModalIsOpen(true) }}> Click here to add more content</span>
                        </div>
                        <div className="col-sm-4">
                            <span onClick={() => createBlankWordDocx()} >
                                <span className='svg__iconbox svg__icon--docx hreflink' title='Word'></span>

                            </span>
                        </div>
                        <div className="col-sm-4">
                            <span onClick={() => createBlankExcelXlsx()} >
                                <span className='svg__iconbox svg__icon--xlsx hreflink' title='Excel'></span>

                            </span>
                        </div>
                        <div className="col-sm-4">
                            <span onClick={() => createBlankPowerPointPptx()}>
                                <span className='svg__iconbox svg__icon--ppt hreflink' title='Presentation'></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <Panel
                type={PanelType.large}
                isOpen={modalIsOpen}
                onDismiss={setModalIsOpenToFalse}
                onRenderHeader={onRenderCustomHeaderMain}
                isBlocking={false}
                onRenderFooter={onRenderCustomFooterMain}>
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >

                    <div className="modal-body mb-5">
                        <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                            <button className="nav-link active" id="Documnets-Tab" data-bs-toggle="tab" data-bs-target="#Documents" type="button" role="tab" aria-controls="Documents" aria-selected="true">
                                Documents
                            </button>
                            <button className="nav-link" id="Images-Tab" data-bs-toggle="tab" data-bs-target="#Images" type="button" role="tab" aria-controls="Images" aria-selected="false" >
                                Images
                            </button>

                        </ul>
                        <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                            <div className="tab-pane  show active" id="Documents" role="tabpanel" aria-labelledby="Documents">
                                <div className="row">
                                    <div className="col-sm-6">
                                        {selectedPath?.displayPath?.length > 0 ?
                                            // <DefaultFolderContent Context={props.Context} AllListId={props?.AllListId} item={Item} folderPath={selectedPath?.displayPath} /> 
                                            <div className="">
                                                <details>
                                                    <summary>1. Default Folder Content </summary>
                                                    <div className='AccordionContent mx-height'>
                                                        <div className="col-sm-12 panel-body">
                                                            <input id="searchinput" type="search" onChange={(e) => { searchCurrentFolder(e.target.value) }} placeholder="Search..." className="form-control" />
                                                            <span className="searchclear-project ng-hide" style={{ right: '12px', top: '10px' }}>X</span>
                                                            <div className="Alltable mt-10">
                                                                <div className="col-sm-12 pad0 ">
                                                                    {currentFolderFiles?.length > 0 ?
                                                                        <div className='smart'>
                                                                            <table className='table'>
                                                                                <tr>
                                                                                    <th>DocType</th>
                                                                                    <th>Title</th>
                                                                                </tr>
                                                                                {currentFolderFiles?.map((file: any) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td><span className={`svg__iconbox svg__icon--${file?.docType}`} title={file?.docType}></span></td>
                                                                                            <td><a href={file?.docType == 'pdf' ? file?.ServerRelativeUrl : file?.LinkingUri} target="_blank" data-interception="off" className='hreflink'>{file?.Title}</a></td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </table>
                                                                        </div>
                                                                        :
                                                                        <div className="current_commnet ">
                                                                            No Documents Available
                                                                        </div>
                                                                    }

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </details>
                                            </div>
                                            : ''
                                        }
                                    </div>
                                    <div className="col-sm-6">
                                        <div>
                                            <label className="full_width ">Default Folder</label>
                                            {folderExist == true ? <span>{selectedPath?.displayPath}</span> : <span>{selectedPath?.displayPath?.split(props?.item?.Title)}<span className='highlighted'>{props?.item?.Title}
                                                <div className="popover__wrapper me-1" data-bs-toggle="tooltip" data-bs-placement="auto">
                                                    <span className="svg__iconbox svg__icon--info " ></span>
                                                    <div className="popover__content">
                                                        <span>
                                                            Highlighted folder does not exist. It will be created at the time of document upload.
                                                        </span>
                                                    </div>
                                                </div>
                                            </span></span>}

                                            {/* <span>
                                                <a title="Click for Associated Folder" >Change</a>
                                            </span> */}

                                            <div className="clearfix"></div>
                                        </div>
                                    </div>

                                </div><div className="row form-group clearfix">
                                    <div className="col-sm-6 padL-0">
                                        {/* <ConnectExistingDoc Context={props.Context} AllListId={props?.AllListId} item={Item} folderPath={selectedPath?.completePath} /> */}
                                        <div className="panel panel-default">
                                            <div className="panel-heading">
                                                <h3 className="panel-title">
                                                    2. Connect Existing Documents
                                                </h3>
                                            </div>
                                            <div className="panel-body h309">
                                                <input id="searchinputCED" type="search" onChange={(e) => { searchExistingFile(e.target.value) }} placeholder="Search..." className="form-control " />
                                                <div className="Alltable mt-10 mx-height">
                                                    <div className="container-new b-none h212">
                                                        {/* <GlobalCommanTable headerOptions={headerOptions} paginatedTable={true} columns={columns} data={ExistingFiles} callBackData={callBackData} showHeader={true} /> */}
                                                        {ExistingFiles?.length > 0 ?
                                                            <div className='smart SearchTableCategoryComponent'>
                                                                <table className='table '>
                                                                    <tr>
                                                                        <th>&nbsp;</th>
                                                                        <th>Type</th>
                                                                        <th>Title</th>
                                                                        <th>Item Rank</th>
                                                                    </tr>
                                                                    {ExistingFiles?.map((file: any) => {
                                                                        return (
                                                                            <tr>
                                                                                <td><input type="checkbox" checked={DocsToTag?.some((doc: any) => file.Id == doc.Id)} onClick={() => { tagSelectedDoc(file) }} /></td>
                                                                                <td><span className={`svg__iconbox svg__icon--${file?.File_x0020_Type}`} title={file?.File_x0020_Type}></span></td>
                                                                                <td><a href={file?.EncodedAbsUrl} target="_blank" data-interception="off" className='hreflink'>{file?.Title}</a></td>
                                                                                <td>{file?.ItemRank}</td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                </table>
                                                            </div>
                                                            :
                                                            <div className="current_commnet ">
                                                                No Documents Available
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 pad0">
                                        <div className="panel panel-default add-connect">
                                            <div className="panel-heading ">
                                                <h3 className="panel-title">
                                                    3. Upload a New Document
                                                </h3>
                                            </div>
                                            <div className="panel-body">
                                                <div>
                                                    <div
                                                        className="nontag text-center drophere "
                                                        onDragOver={(event) => event.preventDefault()}
                                                        onDrop={handleFileDrop} >
                                                        {selectedFile ? <p>Selected file: {selectedFile.name}</p> : <p>Drag and drop file here</p>}
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <select value={itemRank} onChange={handleRankChange} className='full-width'>
                                                                {itemRanks.map((rank) => (
                                                                    <option key={rank?.rank} value={rank?.rank}>{rank?.rankTitle}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <input type="file" onChange={handleFileInputChange} className='full-width' />
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <input type="text" onChange={(e) => { setRenamedFileName(e.target.value) }} value={renamedFileName} placeholder='Rename File' className='full-width' />
                                                        </div>
                                                    </div>



                                                    <button onClick={handleUpload} className="btn btn-primary mt-2 my-1  float-end px-3">Upload</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane " id="Images" role="tabpanel" aria-labelledby="Images">
                                    <div className="d-flex justify-content-between">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>
            <Modal
                show={FileNamePopup}
                size="sm"
                // onHide={() => {setShow(false);item?.callBack()}}
                backdrop="static"
                keyboard={false}
                className='rounded-0'
            >
                <Modal.Header >
                    <Modal.Title>Create New File</Modal.Title>
                    <span onClick={() => cancelNewCreateFile()}><i className="svg__iconbox svg__icon--cross crossBtn"></i></span>
                </Modal.Header>
                <Modal.Body className='pb-3'>
                    <div className="col-sm-12">
                        <input type="text" onChange={(e) => { setRenamedFileName(e.target.value) }} value={renamedFileName} placeholder='Enter File Name' className='full-width' />
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0 pb-1 pt-0">
                    <Button disabled={renamedFileName?.length > 0 ? false : true} onClick={() => { CreateNewAndTag() }} className="btn btn-primary">
                        Save
                    </Button>
                    <Button className="btn btn-default" onClick={() => cancelNewCreateFile()}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AncTool;