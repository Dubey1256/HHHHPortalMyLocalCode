import { Icon } from '@fluentui/react';
import moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { Web } from 'sp-pnp-js';
import Tooltip from '../../../globalComponents/Tooltip';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import { Row } from 'react-bootstrap';
import * as GlobalFunction from '../../../globalComponents/globalCommon';

let SmartTaxonomyItemId: any = ''
let backupCurrentFolder: any = [];
let backupExistingFiles: any = [];
let siteName: any = '';
let generatedLocalPath = '';
let rootSiteName = ''
let folders: any = [];
let AllFilesAndFolderBackup: any = [];
const EventManagementmain = (props: any) => {
    const propsvalue = props?.props
    const [StartDate, setStartDate] = React.useState<any>('');
    const [AllFilesAndFolder, setAllFilesAndFolder]: any = React.useState([]);
    const [ExistingFiles, setExistingFiles]: any = React.useState([]);
    const [AllReadytagged, setAllReadytagged]: any = React.useState([]);
    const [AllFoldersGrouped, setAllFoldersGrouped]: any = React.useState([]);
    const [ImageFolderItem, setImageFolderItem]: any = React.useState([])
    const [itemcreated, setitemcreated] = React.useState(false);
    const [foldercreated, setfoldercreated] = React.useState(false);
    const [imagefoldercreated, setimagefoldercreated] = React.useState(false);
    const [ShortTitle, setShortTitle] = React.useState('');
    const [PageTitle, setPageTitle] = React.useState('');
    const [setfolderurl, folderurl] = React.useState('');
    const [itemRank, setitemRank] = React.useState('');
    const [CreateFolderLocation, showCreateFolderLocation] = React.useState(false);
    const [choosePathPopup, setChoosePathPopup] = React.useState(false)
    const [openpopup, setopenpopup] = React.useState(false);
    const [currentFolderFiles, setCurrentFolderFiles]: any = React.useState([]);
    const [Item, setItem]: any = React.useState({});
    const [selectPathFromPopup, setSelectPathFromPopup]: any = React.useState('');
    const siteUrl = propsvalue?.Context?.pageContext?.web?.absoluteUrl;
    const [newSubFolderName, setNewSubFolderName]: any = React.useState('');
    const [folderExist, setFolderExist] = React.useState(false);
    const [selectedPath, setSelectedPath] = React.useState({
        displayPath: '',
        completePath: '',
    });
    let ItemRank = [
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

    React.useEffect(() => {
        pathGenerator()
        rootSiteName = propsvalue?.Context.pageContext.site.absoluteUrl.split(propsvalue?.Context.pageContext.site.serverRelativeUrl)[0];
    }, [])
    const openCreateeventpopup = () => {
        setopenpopup(true)
        setitemcreated(false)
    }

    const createsmartmetadataItem = () => {
        const postData = {
            Title: ShortTitle,
            Date: StartDate,
            ItemRank: itemRank == '' ? null : itemRank,
            ParentID: 0,
            TaxType: 'Activities',
            ProfileType: 'Event',
        }
        const web = new Web(propsvalue?.siteUrl);
        web.lists.getById('136503cd-706e-4466-941f-eb2dcb39db7f').items.add(postData)
            .then((data: any) => {
                console.log(data)
                console.log("your item has been created")
                SmartTaxonomyItemId = data.Id
                createEvent()                                
            })
            .catch((e: any) => {
                console.log(e)
            })
    }
    const createEvent = () => {
        // const copyStartDate = StartDate.split('-')[2] + '/' + StartDate.split('-')[1] + '/' + StartDate.split('-')[0]
        const postData = {
            Title: ShortTitle,
            EventDate: StartDate,
            ItemRank: itemRank == '' ? null : itemRank,
            Event_x002d_Type: 'Event',
            SmartEventId: SmartTaxonomyItemId,
        }
        const web = new Web(propsvalue?.siteUrl);
        web.lists.getById('860a08d5-9711-4d8e-bd26-93fe09362bd4').items.add(postData)
            .then((data: any) => {
                console.log(data)
                console.log("your item has been created")
                setitemcreated(true)
                CreateFolder()
            })
            .catch((e: any) => {
                console.log(e)
            })

    }

    //Create folder
    const CreateFolder = async (): Promise<any> => {
        try {
            let web = new Web(propsvalue?.siteUrl);
            const folderName = newSubFolderName || ShortTitle;
            const parenturl = selectPathFromPopup || selectedPath.displayPath
            const library = web.lists.getByTitle('Documents');
            const parentFolder = web.getFolderByServerRelativeUrl(parenturl);
            const data = await parentFolder.folders.add(folderName);
            console.log('Folder created successfully.');
            data?.data?.ServerRelativeUrl?.replaceAll('%20', ' ');
            let newFolder = {
                parentFolderUrl: rootSiteName + parenturl,
                FileLeafRef: folderName,
                FileDirRef: parenturl,
                isExpanded: false,
                EncodedAbsUrl: rootSiteName + data.data.ServerRelativeUrl,
                FileSystemObjectType: 1
            }

            folders.push(newFolder);

            AllFilesAndFolderBackup.push(newFolder);
            setAllFilesAndFolder(AllFilesAndFolderBackup);
            setfoldercreated(true)
            createImageFolder()
            return newFolder; // Return the folder object here
        } catch (error) {
            return Promise.reject(error);
        }
    }
    const createImageFolder = async (): Promise<any> => {
        try {
            let web = new Web(propsvalue?.siteUrl);
            const library = web.lists.getByTitle('PublishingImages1');
            const parentFolder = web.getFolderByServerRelativeUrl('/sites/HHHH/GmBH/PublishingImages1/SliderImages');
            const data = await parentFolder.folders.add(ShortTitle);

            if (data?.data?.ServerRelativeUrl) {
                data.data.ServerRelativeUrl = data.data.ServerRelativeUrl.replaceAll('%20', ' ');
            }

            console.log('Image Folder created successfully.');
            setImageFolderItem(data?.data);
            setimagefoldercreated(true)
            setopenpopup(false)
            alert("All folders has been created successfully!")
        } catch (error) {
            console.error('Error creating image folder:', error);
            return Promise.reject(error);
        }
    };


    //End
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
    async function getExistingUploadedDocuments(): Promise<any[]> {
        try {
            let alreadyTaggedFiles: any = [];
            let selectQuery = 'Id,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,Editor/Id,Editor/Title,File_x0020_Type,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified,Portfolios/Id,Portfolios/Title&$expand=Author,Editor,Portfolios'

            if (siteName?.length > 0) {
                selectQuery = `Id,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,${siteName}/Id,${siteName}/Title,File_x0020_Type,Editor/Id,Editor/Title,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified,Portfolios/Id,Portfolios/Title&$expand=Author,Editor,${siteName},Portfolios`
            }
            // const files = await folder.files.get();
            let web = new Web(propsvalue?.siteUrl);
            const files = await web.lists.getByTitle('Documents').items.select(selectQuery).getAll();
            let newFilesArr: any = [];
            folders = [];
            files?.map((file: any) => {
                if ((file?.Title == undefined || file?.Title == '') && file?.FileLeafRef != undefined) {
                    file.Title = file?.FileLeafRef;
                }
                if (file?.FileLeafRef != undefined && file?.FileLeafRef != '') {
                    file.FileLeafRef = HandleSpecialChar(file.FileLeafRef)
                }
                if (file?.Title != undefined && file?.Title != '') {
                    file.Title = HandleSpecialChar(file.Title)
                }
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
                if (file?.File_x0020_Type == 'doc' || file?.File_x0020_Type == 'docx') {
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
                if (file[siteName] != undefined && file[siteName].length > 0 && file?.FileSystemObjectType != 1 && file[siteName].some((task: any) => task.Id == props?.item?.Id)) {
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
    // Generate folder url
    const pathGenerator = async () => {
        const params = new URLSearchParams(window.location.search);
        var query = window.location.search.substring(1);
        console.log(query)
        generatedLocalPath = '/Documents/Events'
        var displayUrl = propsvalue?.Context?.pageContext?.web?.serverRelativeUrl + generatedLocalPath;
        var internalPath = siteUrl + generatedLocalPath;
        setSelectedPath({
            ...selectedPath,
            displayPath: displayUrl,
            completePath: internalPath
        })
        fetchFilesByPath(displayUrl)
        let allFiles: any = await getExistingUploadedDocuments()
        let groupedFolders = createGrouping();
        setAllFoldersGrouped(groupedFolders);
    }

    const fetchFilesByPath = async (folderPath: any) => {
        fetchFilesFromFolder(folderPath)
            .then((files) => {
                files?.map((file: any) => {
                    if ((file?.Title == undefined || file?.Title == '') && file?.Name != undefined) {
                        const lastIndex = file?.Name.lastIndexOf(".");
                        const result = lastIndex !== -1 ? file?.Name.substring(0, lastIndex) : file?.Name;
                        file.Title = result;
                    }

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
            let selectQuery = 'Id,Title,FileDirRef,FileLeafRef,ServerUrl,FSObjType,EncodedAbsUrl,File/Name&$expand=File&$filter=FSObjType eq 1&$orderby=FileLeafRef")'
            let web = new Web(propsvalue?.siteUrl);
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
    const cancelPathFolder = () => {
        setChoosePathPopup(false);
    }
    const setFolderPathFromPopup = (folderName: any) => {
        let selectedfolderName = folderName.split(rootSiteName)[1];
        setSelectPathFromPopup(selectedfolderName === selectPathFromPopup ? '' : selectedfolderName);
    };
    const ChoosePathCustomHeader = () => {
        return (
            <>
                <div className='subheading'>
                    Select Upload Folder
                </div>
                <Tooltip ComponentId="7643" />
            </>
        );
    };
    const EventCreationToolHeader = () => {
        return (
            <>
                <div className='subheading'>
                    Event Creation Tool
                </div>
                <Tooltip ComponentId="7643" />
            </>
        );
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
    const CreateSubFolder = async () => {
        try {
            const newFolder = await CreateFolder();
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
    const selectFolderToUpload = () => {
        const temp = selectPathFromPopup.split("/")
        const copypath = temp[temp.length - 1];
        setSelectedPath({
            ...selectedPath,
            displayPath: selectPathFromPopup
        })
        if (selectPathFromPopup != undefined && selectPathFromPopup != '' && selectPathFromPopup?.length > 0)
            checkFolderExistence(copypath, selectPathFromPopup);
        else
            setFolderExist(true)
        setChoosePathPopup(false);
        showCreateFolderLocation(false);
        // setTaskTypesPopup(false);
    }
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

    const EventCreationToolFooter = () => {
        return (
            <footer className='p-2 px-4 text-end'>
                <button type='button' className='btn btn-primary' onClick={createsmartmetadataItem}>
                    OK
                </button>
                <button type='button' className='btn btn-default ms-2' onClick={closepopup}>
                    Cancel
                </button>
            </footer>
        )
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
    //end

    const clear = () => {
        setStartDate('')
        setStartDate('');
        setShortTitle('');
        setPageTitle('');
        folderurl('');
        setitemRank(null);
    }
    const closepopup = () => {
        setopenpopup(false)
    }
    return (
        <>
            <div className="col-sm-12 clearfix">
                <h2 className="d-flex justify-content-between heading align-items-center siteColor serviceColor_Active">
                    <div>Event Tool</div>
                </h2>
            </div>
            <section>
                <div className='row'>
                    <div className="col-sm-12 pad0">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    Create New Event
                                </h3>
                            </div>
                            <div id="CreateEvents" className="panel-body pad0">
                                <div className="row border-btm pad0">
                                    <div className="col-sm-2 titleLabel">
                                        <label className="full-width ">Start Date <span className='text-danger' title="will be displayed as Page Start Date">*</span> </label>
                                    </div>
                                    <div className="col-sm-10 titlefield">
                                        <div className="alignCenter col-6 gap-3">
                                            <input type="date" autoComplete="off" title="Start Date" placeholder="dd/mm/yyyy" className="form-control" value={StartDate}
                                                onChange={(e) => setStartDate(e.target.value)} />
                                            <span className="alignCenter col-4 gap-1"><input className="form-check-input" type="checkbox" ng-model="addenddate" ng-click="checkenddate(addenddate)" /><label>Multiday Event</label></span>
                                        </div>
                                    </div>
                                </div>

                                <div id="divShortName" className="row border-btm pad0">
                                    <div className="col-sm-2 titleLabel">
                                        <label className="full-width " >Short Event Title <span className='text-danger' title="will be used for metadata and folder names">*</span> </label>
                                    </div>
                                    <div className="col-sm-10 titlefield">
                                        <div className="alignCenter col gap-3">
                                            <span className="col-1">{StartDate ? `${StartDate?.split('-')[0] + '-' + StartDate?.split('-')[1]} ` : 'YYYY-MM'}</span>
                                            <input type="text" placeholder="Short Event Name" className="form-control" value={ShortTitle} onChange={(e) => setShortTitle(e.target.value)} />
                                        </div>
                                    </div>
                                </div>


                                <div className="row border-btm pad0" id="divPageTitle">
                                    <div className="col-sm-2 titleLabel">
                                        <label className="full-width"> Page Title <span className='text-danger' title="will be displayed as Page header">*</span> </label>
                                    </div>
                                    <div className="col-sm-10 titlefield">
                                        <div className="col-sm-12">
                                            <input type="text" className="form-control" placeholder="Page Title" value={PageTitle} onChange={(e) => setPageTitle(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="row border-btm pad0" id="divFolderTitle" >
                                    <div className="col-sm-2 titleLabel">
                                        <label>Folder Url <span className='text-danger' title="will be saved in this folder Location"></span></label>
                                    </div>
                                    <div className="col-sm-10 titlefield">
                                        <span>{selectedPath?.displayPath}<span><a title="Click for Associated Folder" className='ms-2 siteColor' onClick={() => setChoosePathPopup(true)} >Change Path </a></span></span>
                                    </div>
                                </div>
                                <div className="row border-btm pad0" id="divFolderTitle" >
                                    <div className="col-sm-2 titleLabel">
                                        <label> Select Item Rank </label>
                                    </div>
                                    <div className="col-sm-10 titlefield">
                                        <div className="col-sm-4">
                                            <select className="form-select" defaultValue={itemRank} onChange={(e) => setitemRank(e.target.value)}>
                                                {ItemRank.map(function (h: any, i: any) {
                                                    return (
                                                        <option key={i} selected={itemRank == h?.rank} value={h?.rank} >{h?.rankTitle}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer mt-2">
                                <button type='button' className='btn btn-primary mx-2' onClick={openCreateeventpopup}>
                                    Submit
                                </button>
                                <button type='button' className='btn btn-default' onClick={clear}>
                                    Clear
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            {/* <div className='row'>
                    <div className='col-sm-12'>
                        <div className='input-group'>
                            <label className="full-width "> Start Date <span className='text-danger'>*</span> </label>
                            <input type="date" className="form-control" value={StartDate}
                                onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='input-group'>
                            <label className="full-width "> Short Event Title <span className='text-danger'>*</span> </label>
                            <input type="text" className="form-control" value={ShortTitle}
                                onChange={(e) => setShortTitle(e.target.value)} />
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='input-group'>
                            <label className="full-width "> Page Title </label>
                            <input type="text" className="form-control" value={PageTitle}
                                onChange={(e) => setPageTitle(e.target.value)} />
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='input-group'>
                            <label className="full-width "> Folder Url </label>
                            <span>{selectedPath?.displayPath}<span><a title="Click for Associated Folder" className='hreflink ms-2 siteColor' onClick={() => setChoosePathPopup(true)} > Change Path </a></span></span>
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='input-group'>
                            <label className="full-width "> Select Item Rank </label>
                         
                        </div>
                    </div>

                </div>
                <footer className='text-end mt-2'>
                    <div className='col-sm-12 row m-0'>
                        <div className='col-sm-6 mt-2 p-0'>
                            <button type='button' className='btn btn-primary mx-2' onClick={openCreateeventpopup}>
                                Submit
                            </button>
                            <button type='button' className='btn btn-default' onClick={clear}>
                                Clear
                            </button>
                        </div>
                    </div>
                </footer> */}


            <Panel isOpen={openpopup} isBlocking={false} onDismiss={closepopup} type={PanelType.medium} onRenderHeader={EventCreationToolHeader} onRenderFooter={EventCreationToolFooter}>
                <div className='col'>
                    <div className="clearfix col-12 pb-3"><strong>The following items will be created</strong></div>
                    <div className='pb-3'>{itemcreated && <span className='ms-2'><Icon iconName="SkypeCircleCheck" /></span>} SmartMetadata item <strong>{StartDate} {ShortTitle}</strong></div>
                    <div className='pb-3'>{foldercreated && <span className='ms-2'><Icon iconName="SkypeCircleCheck" /></span>} Folder <strong>{StartDate} {ShortTitle}</strong> in {selectedPath?.displayPath}</div>
                    <div>{imagefoldercreated && <span className='ms-2'><Icon iconName="SkypeCircleCheck" /></span>} Image Folder {StartDate} {ShortTitle} in /sites/HHHH/GmBH/PublishingImages/SliderImages</div>
                </div>

            </Panel>
            <Panel type={PanelType.medium} isOpen={choosePathPopup} onDismiss={cancelPathFolder} onRenderHeader={ChoosePathCustomHeader} onRenderFooter={onRenderCustomFooterMain} isBlocking={false} >
                <div id="folderHierarchy" >
                    <ul id="groupedFolders" className='p-0' >
                        {
                            AllFoldersGrouped.map((folder: any) => (
                                <Folder folder={folder} onToggle={handleToggle} />))
                        }
                    </ul>

                </div>
            </Panel>
        </>
    )
}

export default EventManagementmain;
