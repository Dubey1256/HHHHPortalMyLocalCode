import { Panel, Dropdown, PanelType, IDropdownOption } from 'office-ui-fabric-react';
import * as React from 'react';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { useCallback, useState } from 'react';
import { Item, sp, Web } from 'sp-pnp-js';
import Tooltip from '../../../globalComponents/Tooltip';
// import styles from './HelloSpfx.module.scss';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Pagination, PaginationItem, PaginationLink, Progress, Row, Table } from "reactstrap";
import HtmlEditorCard from './FloraCommentBox';
import MsgReader from "@kenjiuno/msgreader"
import { useEffect } from 'react';
import { SiteUser } from 'sp-pnp-js/lib/sharepoint/siteusers';
import AddMorePosition from './AddMorePosition';
let showTextInput: boolean = false;
let PositionChoices: any[] = [];
let siteName: any = '';
let backupCurrentFolder: any = [];
let AllFilesAndFolderBackup: any = [];
let folders: any = [];
let rootSiteName = '';
let TaskTypes: any = [];
let generatedLocalPath = '';
let backupExistingFiles: any = [];


const AddPopup = (props: any) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await sp.web.currentUser.get();
                const defaultUser = [{ text: currentUser.Title, key: currentUser.LoginName }];
                await Promise.all([getchoicecolumns(), onPeoplePickerChange(defaultUser)]);
            } catch (error) {
                console.error(error);
            } finally {
               // Set loading state to false regardless of success or error
            }
        };
        fetchData();
        setDefaultDate(getCurrentDate());
    }, []);
    type FileSection = {
        id: number;
        selectedFiles: File[];
        renamedFileName: string;
    };
    const [fileSections, setFileSections]: any = useState([{ id: 1, selectedFiles: [], renamedFileName: '' }]);
    const [name, setName] = useState('');
    const [exp, setExp] = useState({ years: '', months: '' });
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedInterviwer, setSelectedInterviwer] = React.useState<any[]>([]);
    const [selectedRecAction, setSelectedRecAction] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedDate, setselectedDate] = useState('');
    const [motivationText, setMotivationText] = useState('');
    const [OtherChoiceText, setOtherChoiceText] = useState('');
    const [content, setContent] = React.useState<string>('');
    const [isAddPosititionOpen, setisAddPositionOpen] = React.useState(false);
    const Status = ['New Candidate', 'Under Consideration', 'Interview', 'Negotiation', 'Hired', 'Rejected'];

    const [inputText, setInputText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [SiteUsers, setSiteUsers] = useState([])
    const [defaultDate, setDefaultDate] = useState<string>('');
    const [folderFiles, setfolderFiles]: any = useState([]);
    const [uploadedFile, setuploadedFile]: any = useState({});
    const [showTextInput, setshowTextInput] = useState(false);
    const ActionChoices = ['Invite to Interview', 'Decline', 'Hire'];
    const [updatedPlatformChoices, setupdatedPlatformChoices] = useState<{ name: string; selected: boolean; }[]>([]);
    const [platformChoices, setPlatformChoices] = useState([
        { name: 'Indeed', selected: false },
        { name: 'Agentur für Arbeit', selected: false },
        { name: 'Jobcenter', selected: false },
        { name: 'GesinesJobtipps', selected: false },
        { name: 'Linkedin', selected: false },
        { name: 'Naukri', selected: false },
        { name: 'Others', selected: false }
    ]);
    const [isStarFilled, setIsStarFilled] = useState(false);

    const toggleStar = () => {
        setIsStarFilled(!isStarFilled);
    };
    const onClose = () => {
        props.AddPopupClose();
    }
    const openAddPositionPopup = () => {
        setisAddPositionOpen(true)
    }
    const AddMorePositionClose = () => {
        setisAddPositionOpen(false)
    };
    let allListID = {
        InterviewFeedbackFormListId: props?.ListID,
        SkillsPortfolioListID: props?.skillsList,
        siteUrl: props?.siteUrl
    }

    const HRweb = new Web(allListID?.siteUrl)
    const addCandidate = async () => {
        let formattedExp = '0.0';
        if (updatedPlatformChoices && updatedPlatformChoices.length > 0) {
            updatedPlatformChoices.forEach(itm => {
                if (itm.selected && itm.name === 'Others') {
                    itm.name = OtherChoiceText;
                }
            });
        }
        if (exp !== undefined) {
            formattedExp = exp.years && exp.months ? `${exp.years}.${exp.months}` : exp.years ? `${exp.years}.0` : `0.${exp.months}`;
        }
        const selectedPlatforms = JSON.stringify(updatedPlatformChoices);
        try {
            const candidateItem = await HRweb.lists.getById(allListID?.InterviewFeedbackFormListId).items.add({
                CandidateName: name,
                Email: email,
                PhoneNumber: phone,
                Experience: formattedExp,
                Date: new Date(selectedDate),
                RecommendedAction: selectedRecAction,
                ActiveInterv: selectedInterviwer,
                PositionsId: selectedPosition,
                Status0: "New Candidate",
                SelectedPlatforms: selectedPlatforms,
                Motivation: motivationText,
                IsFavorite: isStarFilled
            });
            const candidateItemId = candidateItem.data.Id;
            handleUpload(candidateItemId);
            props.callbackAdd();
        } catch (error) {
            onClose();
            console.error(error);
        } finally {
            onClose();
        }
    };

    const getCurrentDate = (): string => {
        const currentDate: any = new Date();
        const year: any = currentDate.getFullYear();
        const month: any = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const day: any = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const getchoicecolumns = () => {
        const select = `Id,Title,PositionTitle,PositionDescription,JobSkills`;
        HRweb.lists.getById(allListID?.SkillsPortfolioListID).items.select(select).get()
            .then(response => {
                PositionChoices = response;
            })
            .catch((error: unknown) => {
                console.error(error);
            });
    }
    const HtmlEditorCallBack = useCallback((EditorData: any) => {
        if (EditorData.length > 8) {
            setMotivationText(EditorData);
        }
    }, [])
    const getSizeString = (sizeInBytes: number): string => {
        const kbThreshold = 1024;
        const mbThreshold = kbThreshold * 1024;

        if (sizeInBytes < kbThreshold) {
            return `${sizeInBytes} KB`;
        } else if (sizeInBytes < mbThreshold) {
            const sizeInKB = (sizeInBytes / kbThreshold).toFixed(2);
            return `${sizeInKB} KB`;
        } else {
            const sizeInMB = (sizeInBytes / mbThreshold).toFixed(2);
            return `${sizeInMB} MB`;
        }
    };
    const checkboxChanged = (item: { name: string; selected: boolean; }) => {
        item.selected = !item.selected;
        const updatedPlatformChoicesCopy = [...platformChoices];

        let index = -1;
        for (let i = 0; i < updatedPlatformChoicesCopy.length; i++) {
            if (updatedPlatformChoicesCopy[i].name === item.name) {
                index = i;
                break;
            }
        }
        if (item.name === 'Others') {
            if (item.selected) {
                setshowTextInput(true);
            } else {
                setshowTextInput(false);
            }
        }
        if (item.selected) {
            if (item.name === 'Others') {
                setshowTextInput(true);
            }
            updatedPlatformChoicesCopy[index].selected = true;
        } else {
            if (item.name !== 'Others') {
                setshowTextInput(false);
            }
            updatedPlatformChoicesCopy[index].selected = false;
        }
        setupdatedPlatformChoices(updatedPlatformChoicesCopy);
    };

    const handleNameChange = (e: any) => {
        setName(e.target.value);
    };
    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const handlePhoneChange = (e: any) => {
        setPhone(e.target.value);
    };
    // const handleExpChange = (e: any) => {
    //     setExp(e.target.value);
    // };
    const handleExpYearsChange = (event: any) => {
        const years = event.target.value;
        setExp((prevExp) => ({ ...prevExp, years: years }));
    };

    const handleExpMonthsChange = (event: any) => {
        const months = event.target.value;
        setExp((prevExp) => ({ ...prevExp, months: months }));
    };
    const handleDateChange = (e: any) => {
        setselectedDate(e.target.value);
    };

    const handleOtherChoiceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtherChoiceText(event.target.value);
    };
    const handleRecAction = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        if (item) {
            setSelectedRecAction(item.key as string);
        } else {
            setSelectedRecAction('');
        }
    };
    const handlePosition = (event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption): void => {
        if (item) {
            setSelectedPosition(item.key as string);
        } else {
            setSelectedPosition('');
        }
    };

    var handleFileInputChange = function (e: React.ChangeEvent<HTMLInputElement>, sectionId: number) {
        var files = e.target.files;
        var updatedFileSections = fileSections.map(function (section: any) {
            if (section.id === sectionId) {
                return {
                    id: section.id,
                    selectedFiles: Array.prototype.slice.call(files || []),
                    renamedFileName: section.renamedFileName
                };
            } else {
                return section;
            }
        });
        setFileSections(updatedFileSections);
    };

    const handleUpload = async (candidateItemId: any) => {
        const uploadTasks: any[] = [];
        for (const section of fileSections) {
            for (const file of section.selectedFiles) {
                try {
                    const fileName = section.renamedFileName?.length > 0 ? section.renamedFileName : file.name;
                    const reader = new FileReader();
                    const fileContent = await new Promise<ArrayBuffer>((resolve) => {
                        reader.onloadend = () => resolve(reader.result as ArrayBuffer);
                        reader.readAsArrayBuffer(file);
                    });

                    const uploadedFile = await sp.web.lists.getByTitle("Documents")
                        .rootFolder.folders.getByName("InterviewDocuments")
                        .files.add(fileName, fileContent, true);

                    setuploadedFile(uploadedFile);
                    setTimeout(async () => {
                        const folderFiles: any = await loadDocumentsFromFolder();
                        const matchedFile = folderFiles.find((folderFile: { FileLeafRef: any; }) => folderFile.FileLeafRef === uploadedFile.data.Name);
                        if (matchedFile) {
                            updateLookupColumn(matchedFile.ID, candidateItemId);
                        }
                    }, 2000);

                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
        }

        console.log("All files uploaded successfully");
    };

    async function loadDocumentsFromFolder() {
        const selectQuery =
            'Id,Title,Url,FileSystemObjectType,ItemRank,Author/Id,Author/Title,Editor/Id,Editor/Title,File_x0020_Type,FileDirRef,FileLeafRef,File_x0020_Type,Year,EncodedAbsUrl,Created,Modified&$expand=Author,Editor';
        try {
            const libraryTitle = 'Documents';
            const folderName = 'InterviewDocuments';
            const folderFiles = await sp.web.lists.getByTitle(libraryTitle).items.select(selectQuery).getAll();
            setfolderFiles(folderFiles);
            return folderFiles;
        } catch (error) {
            console.error('Error loading documents:', error);
            return [];
        }
    }

    const updateLookupColumn = async (documentId: number, candidateItemId: number) => {
        try {
            const list = sp.web.lists.getByTitle('Documents');
            const columnName = 'InterviewCandidates';
            const documentItem = await list.items.getById(documentId).get();
            // Ensure to replace 'InterviewCandidates' with the actual internal name of your lookup column
            const postData = {
                [columnName + 'Id']: {
                    results: [candidateItemId],
                },
            };
            await list.items.getById(documentId).update(postData);
            console.log(`Lookup column ${columnName} updated successfully for document with ID ${documentId}.`);
        } catch (error) {
            console.error('Error updating lookup column:', error);
        }
    };
    const addFileSection = () => {
        const newId = fileSections.length + 1;
        const newFileSection: FileSection = { id: newId, selectedFiles: [], renamedFileName: '' };
        setFileSections([...fileSections, newFileSection]);
    };

    const removeFileSection = (sectionIdToRemove: number) => {
        const updatedFileSections = fileSections.filter((section: { id: number; }) => section.id !== sectionIdToRemove);
        setFileSections(updatedFileSections);
    };
    const handleRenamedFileNameChange = (e: React.ChangeEvent<HTMLInputElement>, sectionId: number) => {
        const updatedFileSections = fileSections.map((section: any) =>
            section.id === sectionId ? { ...section, renamedFileName: e.target.value } : section
        );
        setFileSections(updatedFileSections);
    };
    const onRenderCustomHeaderMains = () => {
        return (
            <>
                <div className='subheading'>
                    Add Candidate
                </div>
                <Tooltip ComponentId='4430' />
            </>
        );
    };
    const onPeoplePickerChange = (items: any[]) => {
        setSelectedInterviwer(items[0]?.text);
    };
    return (
        <>
        <Panel
            onRenderHeader={onRenderCustomHeaderMains}
            isOpen={true}
            onDismiss={onClose}
            isBlocking={false}
            //type={PanelType.large}
            closeButtonAriaLabel="Close"
            type={PanelType.custom}
            customWidth={"950px"}
        >
            <div className='modal-body mb-5'>
                <div className="row">
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Candidate Name</label>
                            <input
                                className="form-control"
                                value={name}
                                onChange={handleNameChange}
                                type="text"
                                placeholder="Enter Candidate Name"
                            />
                            <span className='input-addon-starIcon mt-2'
                                role="img"
                                aria-label={isStarFilled ? 'Star filled' : 'Star outline'}
                                style={{
                                    color: isStarFilled ? '#ff8f00' : 'grey', // Set to 'transparent' when not filled
                                }}
                                onClick={toggleStar}
                            >
                                ★
                            </span>
                        </div>
                    </div>
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Total Years of Professional Exp</label>
                            <div className="d-flex gap-2">
                                <div className="input-group mb-2">
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={exp.years}
                                        onChange={handleExpYearsChange}
                                        placeholder="Years"
                                    />
                                </div>
                                <div className="input-group mb-2">
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={exp.months}
                                        onChange={handleExpMonthsChange}
                                        placeholder="Months"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Responsible Staff Member</label>
                            <div className="full-width">
                                <PeoplePicker
                                    context={props.context}
                                    personSelectionLimit={1}
                                    groupName={''}
                                    showtooltip={true}
                                    required={false}
                                    disabled={false}
                                    ensureUser={true}
                                    onChange={onPeoplePickerChange}
                                    principalTypes={[PrincipalType.User]}
                                    resolveDelay={1000}
                                    defaultSelectedUsers={selectedInterviwer}
                                />
                                </div>
                        </div>
                    </div>
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Phone Number</label>
                            <input className="form-control" value={phone} onChange={handlePhoneChange} type="text" placeholder="Enter Phone Number" />
                        </div></div>
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Position 
                                <span onClick={openAddPositionPopup} className="svg__iconbox hreflink svg__icon--Plus mini ml-60 f-14 fw-bold"></span><span className='hreflink ml-9 f-14 fw-bold' onClick={openAddPositionPopup}>Add More</span>
                            </label>
                            
                            <Dropdown
                                id="status" className='w-100 '
                                placeholder='Select Position'
                                options={PositionChoices.map((itm) => ({ key: itm.Id, text: itm.Title }))}
                                selectedKey={selectedPosition}
                                onChange={handlePosition}
                                styles={{ dropdown: { width: '100%' } }}
                            />
                        </div>
                    </div>
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Application Date</label>
                            <input className="form-control" value={selectedDate || defaultDate}
                                onChange={handleDateChange} type="date" placeholder="Date" />
                        </div>
                    </div>
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Email</label>
                            <input className="form-control" value={email}
                                onChange={handleEmailChange} type="email" placeholder="Enter Email" />
                        </div>
                    </div>
                    <div className="col-sm-3 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Recommended Action</label>
                            <Dropdown
                                id="recAction" className='w-100 '

                                placeholder='Select Action'
                                selectedKey={selectedRecAction}
                                onChange={handleRecAction}
                                options={ActionChoices.map((itm) => ({ key: itm, text: itm }))}
                                styles={{ dropdown: { width: '100%' } }}
                            />
                        </div>
                    </div>
                    <div className="col-sm-12 my-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Platform</label>
                            <div className="alignCenter">
                                {platformChoices.map((item) => (
                                    <label className="SpfxCheckRadio" key={item.name}>
                                        <input
                                            type="checkbox"
                                            className="me-1 form-check-input cursor-pointer"
                                            defaultChecked={item.selected}
                                            onChange={() => checkboxChanged(item)}

                                        />
                                        {item.name}
                                    </label>
                                ))}
                                {showTextInput && (
                                    <div className='col-sm-2'><label className="input-group">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={OtherChoiceText}
                                            onChange={handleOtherChoiceInputChange}
                                            placeholder="Enter any other platform"
                                        />
                                    </label>
</div>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="col-sm-12 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Cover Letter/Motivation</label>
                            <HtmlEditorCard
                                editorValue={motivationText}
                                HtmlEditorStateChange={HtmlEditorCallBack}
                            />
                        </div>
                    </div>

                    <div className="col-sm-12 mb-2">
                        <div className='input-group'>
                            <label className="form-label full-width">Upload Documents</label>
                            <Col>
                                {fileSections.map((section: any, index: number) => (
                                    <div key={section.id}>
                                        <Col className='mb-2'>
                                            <span className='valign-middle'>
                                                <input type="file" onChange={(e) => handleFileInputChange(e, section.id)} multiple className='form-control full-width' />
                                                {index > 0 && (
                                                    <span className='svg__iconbox ms-2 svg__icon--trash hreflink' onClick={() => removeFileSection(section.id)}></span>
                                                )}
                                            </span>
                                        </Col>
                                        <Col className='mb-2'>
                                            <input
                                                type="text"
                                                onChange={(e) => handleRenamedFileNameChange(e, section.id)}
                                                value={section.renamedFileName}
                                                placeholder='Rename the document'
                                                className='form-control full-width'
                                            />
                                        </Col>
                                    </div>
                                ))}
                                {/* <Row className='mb-2 px-2'>
                                            <button onClick={handleUpload} disabled={fileSections.some((section: { selectedFiles: string | any[]; }) => section.selectedFiles.length > 0) ? false : true} className="btn btn-primary mt-2 my-1  float-end px-3">
                                                Upload
                                            </button>
                                        </Row> */}
                                <Row className='mb-2 px-2'>
                                    <a onClick={addFileSection} className="float-end hreflink my-1 px-1 text-end">
                                        Add More Documents
                                    </a>
                                </Row>
                            </Col>
                        </div>
                    </div>


                </div>
            </div>
            <footer className="bg-f4 fixed-bottom px-4 py-2">
                <div className="float-end text-end">
                    <button onClick={addCandidate} type='button' className='btn btn-primary'>Save</button>
                    <button onClick={onClose} type='button' className='btn btn-default ms-1'>Cancel</button>
                </div>
            </footer>

        </Panel>
        {isAddPosititionOpen && <AddMorePosition siteUrl={allListID?.siteUrl} skillsList={allListID?.SkillsPortfolioListID} openPopup={isAddPosititionOpen} closePopup={AddMorePositionClose}/>}
        </>
    );
};
export default AddPopup;

