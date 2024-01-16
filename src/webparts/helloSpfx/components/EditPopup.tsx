import { Panel, PrimaryButton, TextField, Dropdown, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { Item, sp, Web } from 'sp-pnp-js';
import Moment from "moment";
import styles from './HelloSpfx.module.scss';
import HtmlEditorCard from './FloraCommentBox';
import { useEffect, useState } from 'react';
import StarRating from './StarRating';

import Tooltip from '../../../globalComponents/Tooltip';
import './Recruitment.css'
import moment from 'moment-timezone';
import { Row } from 'react-bootstrap';
import { Col } from 'reactstrap';
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
const skillArray: any[] = [];
let EmployeeData: any;
const EditPopup = (props: any) => {
    const [fileSections, setFileSections]: any = useState([{ id: 1, selectedFiles: [], renamedFileName: '' }]);
    const [CandidateTitle, setCandidateTitle] = useState(props.item.CandidateName);
    const [Email, setEmail] = useState(props.item.Email);
    const [folderFiles, setfolderFiles]: any = useState([]);
    const [PhoneNumber, setPhoneNumber] = useState(props.item.PhoneNumber);
    const [Experience, setExperience] = useState(props.item.Experience);
    const [overAllRemark, setoverAllRemark] = useState(props.item.Remarks);
    const [selectedStatus, setSelectedStatus] = useState(props.item.Status0);
    const [Motivation, setMotivation] = useState(props.item.Motivation)
    const [experienceYears, setExperienceYears]: any = useState<any>();
    const [experienceMonths, setExperienceMonths]: any = useState<any>();
    const [showAddDocumentPanel, setShowAddDocumentPanel] = useState(false);
    const star = props.item.IsFavorite ? '⭐' : '';
    const Status = ['New Candidate', 'Under Consideration', 'Interview', 'Negotiation', 'Hired', 'Rejected'];
    const [platformChoices, setPlatformChoices] = useState([
        { name: 'Indeed', selected: false },
        { name: 'Agentur für Arbeit', selected: false },
        { name: 'Jobcenter', selected: false },
        { name: 'GesinesJobtipps', selected: false },
        { name: 'Linkedin', selected: false },
        { name: 'Naukri', selected: false },
        { name: 'Others', selected: false }
    ]);
    type FileSection = {
        id: number;
        selectedFiles: File[];
        renamedFileName: string;
    };
    const [Plats, setPlats] = useState<any[]>([]);
    const [localRatings, setLocalRatings] = useState(props.item?.ratings || []);
    const [TaggedDocuments, setTaggedDocuments] = useState<any[]>([]);
    const [uploadedFile, setuploadedFile]: any = useState({});
    const [showTextInput, setShowTextInput] = useState(false);
    const [otherChoice, setOtherChoice] = useState('');
    const [listData, setListData] = useState([]);
    const [openFeedback, setOpenFeedback] = useState(true)
    
    let allListID={
        InterviewFeedbackFormListId: props?.ListID,
        SkillsPortfolioListID: props?.skillsList,
        siteUrl: props?.siteUrl
    }

    const HRweb = new Web(allListID?.siteUrl)

    const handlePlatformClick = (e: React.ChangeEvent<HTMLInputElement>, PlatformName: string) => {
        const clickedPlatform = e.target.value; // Assuming the value of the checkbox is the platform name

        setPlatformChoices((prevChoices) =>
            prevChoices.map((choice) => {
                if (choice.name === PlatformName) {
                    const updatedChoice = { ...choice, selected: !choice.selected };
                    if (updatedChoice.name === 'Others') {
                        setShowTextInput(updatedChoice.selected); // Toggle showTextInput when "Others" is selected
                    }
                    return updatedChoice;
                }
                return choice;
            })
        );
    };

    const handleOtherChoiceChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setOtherChoice(event.target.value);
    };
    // eslint-disable-next-line eqeqeq
    if (props.item.SelectedPlatforms !== '') {
        const selectedPlatforms = JSON.parse(props.item.SelectedPlatforms);

        useEffect(() => {
            let Array: any = ['Indeed', 'Agentur für Arbeit', 'Jobcenter', 'GesinesJobtipps', 'Linkedin', 'Naukri']
            // Check if any selected platform meets the specified conditions
            const shouldUpdateOthers = selectedPlatforms?.some((item: { selected: any; name: any }) => {

                return (
                    item.selected &&
                    !Array.includes(item.name)
                );
            });
            if (shouldUpdateOthers) {
                const updatedChoices = platformChoices.map((choice) => {
                    if (choice.name === 'Others') {
                        // Update 'Others' based on conditions, leave others unchanged
                        return { ...choice, selected: true };
                    }
                    const matchingItem = selectedPlatforms?.find((item: { name: string; }) => item.name === choice.name);
                    return matchingItem ? { ...choice, selected: matchingItem.selected } : choice;
                });

                const unmatchedNames = selectedPlatforms
                    .filter((item: { selected: any; name: string; }) => item.selected && !Array.includes(item.name))
                    .map((item: { name: string }) => item.name);

                if (unmatchedNames.length > 0) {
                    setOtherChoice(unmatchedNames);
                    setShowTextInput(true); // Set setShowTextInput to true when there are values in otherChoices
                } else {
                    setShowTextInput(false); // Set setShowTextInput to false when otherChoices is empty
                }

                setPlatformChoices(updatedChoices);
            } else {
                // If no conditions are met, update as usual
                const updatedChoices = platformChoices.map((choice) => {
                    const matchingItem = selectedPlatforms?.find((item: { name: string; }) => item.name === choice.name);
                    return matchingItem ? { ...choice, selected: matchingItem.selected } : choice;
                });

                setShowTextInput(false); // Set setShowTextInput to false when no conditions are met
                setPlatformChoices(updatedChoices);
            }
        }, []);
    }
    useEffect(() => {
        const yearsString: string = props.item?.Experience?.toString();
        const experience = yearsString?.split('.');
        const years = experience?.[0]
        const months = experience?.[1]
        let experienceYears = years;
        let experienceMonths = months;
        if (months === '12') {
            let year = parseInt(experienceYears, 10)
            year++;
            experienceYears = year.toString();
            experienceMonths = 0..toString();
        }
        let experienceYearsInt = parseInt(experienceYears)
        let experienceMonthsInt = parseInt(experienceMonths)
        setExperienceYears(experienceYearsInt);
        setExperienceMonths(experienceMonthsInt);
    }, [props.item.Experience]);
    if (props.item.SkillRatings != '') {
        const SkillRatingsdata = JSON.parse(props.item.SkillRatings);
    }

    const onClose = () => {
        props.EditPopupClose();
    }
    const onCloseDoc = () => {
        setShowAddDocumentPanel(false);
        // setFileSections([{ id: 1, selectedFiles: [], renamedFileName: '' }]);
    }
    const handleEditSave = async () => {
        let updateData;
        if (platformChoices && platformChoices.length > 0) {
            platformChoices.forEach(itm => {
                if (itm.selected && itm.name === 'Others') {
                    itm.name = otherChoice;
                }
            });
        }
        try {
            const skillRatingsJson = JSON.stringify(localRatings);
            const platformChoicesString = JSON.stringify(platformChoices);
            let experienceValue = experienceYears || '';
            if (experienceMonths) {
                experienceValue += '.' + experienceMonths;
            }

            updateData = {
                Title: CandidateTitle,
                CandidateName: CandidateTitle,
                Email: Email,
                PhoneNumber: PhoneNumber,
                Experience: experienceValue == "" ? null : experienceValue,
                Remarks: overAllRemark,
                Status0: selectedStatus,
                Motivation: Motivation,
                SkillRatings: skillRatingsJson,
                SelectedPlatforms: platformChoicesString,
            };
            const list = HRweb.lists.getById(allListID?.InterviewFeedbackFormListId);
            await list.items.getById(props.item.Id).update(updateData);
            EmployeeData = updateData;
            if (fileSections && fileSections.some((section: { selectedFiles: string | any[]; }) => section.selectedFiles.length > 0)) {
                await handleUpload(props.item.Id);
            } else {
                props.callbackEdit(props.item.Id);
            }
            console.log("Item updated successfully");
            props.callbackEdit(props.item.Id);

        } catch (error) {
            console.error(error);
            // Handle errors here
        } finally {
            onClose();
        }
    };
    

    const getListData = () => {
        const skillMap: any = {};
        let initialratings: any = {};
        HRweb.lists.getById(allListID?.SkillsPortfolioListID).items.getAll().then((response: any) => {
            setListData(response);
            const filteredData = response.filter((item: any) => {
                return item.Id === props.item.Positions.Id;
            });
            skillArray.push(filteredData);
            initialratings = skillArray[0][0];
            if (props.item.SkillRatings === null || props.item.SkillRatings === undefined || props.item.SkillRatings === '' || props.item.SkillRatings === '[]') {
                props.item.ratings = JSON.parse(initialratings.JobSkills)
            } else {
                props.item.ratings = JSON.parse(props.item.SkillRatings)

            }
            if (props.item.ratings !== null && props.item.ratings !== undefined) {
                for (const obj of props.item.ratings) {
                    skillMap[obj.SkillTitle] = true;
                }
            }
            // Filter array two based on SkillTitle availability in array one
            const unavailableSkills = props.item.ratings.filter((rat: any) => {
                if (rat.SkillTitle !== undefined && rat.SkillTitle !== '') {
                    rat.SkillTitle = addEllipsis(rat.SkillTitle, 50);
                    skillMap[rat.SkillTitle] = true;
                }
                return !skillMap[rat.SkillTitle];
            });
            props.item.ratings.push(...unavailableSkills);
            setLocalRatings(props.item.ratings)
            loadDocumentsByCandidate(props.item.Id)
        }).catch((error: unknown) => {
            console.error(error);
        });
    };
    useEffect(() => {
        getListData();
    }, []);
    const loadDocumentsByCandidate = async (candidateId: number) => {
        try {
            const libraryTitle = 'Documents';
            const columnName = 'InterviewCandidates';
            const documents = await HRweb.lists.getByTitle(libraryTitle)
                .items
                .filter(`${columnName}/Id eq ${candidateId}`)
                .select('Id', 'Title', 'Item_x0020_Type', 'File_x0020_Type', 'FileDirRef', 'FileLeafRef', 'EncodedAbsUrl', 'InterviewCandidates/Id')
                .expand('InterviewCandidates')
                .getAll();
            console.log('Documents loaded successfully:', documents);
            setTaggedDocuments(documents)
            return documents;
        } catch (error) {
            console.error('Error loading documents by candidate:', error);
            return [];
        }
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

                    const uploadedFile = await HRweb.lists.getByTitle("Documents")
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
            const folderFiles = await HRweb.lists.getByTitle(libraryTitle).items.select(selectQuery).getAll();
            setfolderFiles(folderFiles);
            return folderFiles;
        } catch (error) {
            console.error('Error loading documents:', error);
            return [];
        }
    }
    const addEllipsis = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };
    const updateLookupColumn = async (documentId: number, candidateItemId: number) => {
        try {
            const list = HRweb.lists.getByTitle('Documents');
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
            props.callbackEdit(props.item.Id);
        } catch (error) {
            console.error('Error updating lookup column:', error);
        }
    };
    const HtmlEditorCallBack = React.useCallback((EditorData: any) => {
        if (EditorData.length > 8) {
            props.item.Motivation = EditorData;
            setMotivation(EditorData)
        }
    }, [])
    const setRatings = (index: number, selectedRating: number) => {
        const updatedRatings = [...localRatings];
        updatedRatings[index].current = selectedRating;
        setLocalRatings(updatedRatings);
    };
    const removeDocuments = async (libraryTitle: string, documentId: number | undefined, docName: string) => {
        const confirmDeleteDoc = window.confirm("Are you sure you want to Delete Document?")
        try {
            const list = HRweb.lists.getByTitle('Documents');
            
            if (documentId && confirmDeleteDoc) {
                await list.items.getById(documentId).delete();
                setTaggedDocuments(prevDocuments => prevDocuments.filter(doc => doc.Id !== documentId));
                console.log(`Document with ID ${documentId} removed successfully from ${libraryTitle}.`);
            } else if (docName && confirmDeleteDoc) {            
                setTaggedDocuments(prevDocuments => prevDocuments.filter(doc => doc.FileLeafRef !== docName));
                console.log(`Document with FileLeafRef ${docName} removed successfully from ${libraryTitle}.`);
            }
        } catch (error) {
            console.error('Error removing document:', error);
        }
    };

    const delItem = (itm: any) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");

        if (confirmDelete) {

            HRweb.lists
                .getById(allListID?.InterviewFeedbackFormListId)
                .items.getById(itm)
                .recycle()
                .then(() => {
                    alert("Item deleted successfully!");
                })
                .catch((error: any) => {
                    console.error(error);
                });
        } else {
            alert("Deletion canceled.");
        }
        onClose();
    };
    const onRenderCustomHeaderMain = () => {
        return (
            <>
                <div className='subheading'>
                    Candidate Details - {props.item.CandidateName} {star}
                </div>
                <Tooltip ComponentId='4442' />
            </>
        );
    };
    const onRenderCustomHeaderMainDoc = () => {
        return (
            <>
                <div className='subheading'>
                    Add More Documents
                </div>
                <Tooltip ComponentId='4442' />
            </>
        );
    };
    const ClosePopup = React.useCallback(() => {
        props.EditPopupClose()

    }, []);
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
    
    const openDocInNewTab = (url: string | URL | undefined) => {
        window.open(url, '_blank')
    };
    const downloadDoc = (url: string | URL | undefined) => {
        window.open(url + '?download=1');
    };
    var handleDocuments = function () {
        if (fileSections.length > 0) {
            fileSections.forEach(function (section: any) {
                if (section.selectedFiles.length > 0) {
                    section.selectedFiles.forEach(function (itm: any) {
                        let obj = {
                            FileLeafRef: itm.name,
                            File_x0020_Type: itm.name?.split('.')[1]
                        };
                        setTaggedDocuments(prevDocuments => [...prevDocuments, obj]);
                    });
                }
            });
        }
        onCloseDoc();
    };
    return (
        <Panel
            onRenderHeader={onRenderCustomHeaderMain}
            isOpen={true}
            onDismiss={onClose}
            type={PanelType.custom}
            isBlocking={false}
            customWidth={"850px"}
            closeButtonAriaLabel="Close"
        >
            <div className='modal-body mb-5'>
                <div>
                    <div className='sectionHead siteBdrBottom mb-1'>Profile</div>
                    <div className='row'>
                        <div className='col-sm-6 mb-2'>
                            <div className='input-group'>
                                <label className='form-label full-width'>Name</label>
                                <input className='form-control' type='text' placeholder="Name" defaultValue={props.item.CandidateName} onChange={(newValue: any) => setCandidateTitle(newValue.target.value)} />
                            </div>
                        </div>
                        <div className='col-sm-6 mb-2'>
                            <div className='input-group'>
                                <label className='form-label full-width'>Email</label>
                                <input className='form-control' type='text' placeholder="Email" defaultValue={props.item.Email} onChange={(newValue: any) => setEmail(newValue.target.value)} />
                            </div></div>
                        <div className='col-sm-6 mb-2'>
                            <div className='input-group'>
                                <label className='form-label full-width'>Phone Number</label>
                                <input className='form-control' type='number' placeholder="Phone Number" defaultValue={props.item.PhoneNumber} onChange={(newValue: any) => setPhoneNumber(newValue.target.value)} />
                            </div></div>
                        <div className='col-sm-6 mb-2'>
                            <div className='input-group'>
                                <label className='form-label full-width'>Experience</label>
                                <div className='d-flex'>
                                    <input
                                        className='form-control me-2'
                                        type='number'
                                        placeholder='Years'
                                        value={experienceYears}
                                        onChange={(e) => {
                                            let newYears = parseInt(e.target.value);
                                            if (isNaN(newYears) || newYears < 0) {
                                                newYears = 0;
                                            }
                                            setExperienceYears(newYears);
                                        }}
                                    />
                                    <input
                                        className='form-control'
                                        type='number'
                                        placeholder='Months'
                                        value={experienceMonths}
                                        onChange={(e) => {
                                            let newMonths = parseInt(e.target.value);
                                            if (isNaN(newMonths) || newMonths < 0) {
                                                newMonths = 0;
                                            } else if (newMonths > 12) {
                                                newMonths = 12;
                                            }
                                            setExperienceMonths(newMonths);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className='input-group'>
                            <label className="form-label full-width">Platform</label>
                            <div className="CustomCheckRadio justify-content-between valign-middle">
                                {platformChoices.map((item) => (
                                    <label className="SpfxCheckRadio" key={item.name}>
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer form-check-input me-1"
                                            defaultChecked={item.selected}
                                            onChange={(e) => handlePlatformClick(e, item.name)}
                                        />
                                        {item.name}
                                    </label>
                                ))}
                                <label className="label--checkbox">
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter any other platform"
                                        value={otherChoice}
                                        onChange={handleOtherChoiceChange}
                                        style={{ display: showTextInput ? 'block' : 'none' }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 mb-3">
                    <div className="sectionHead siteBdrBottom mb-1">Cover Letter/Motivation</div>
                    <HtmlEditorCard
                        editorValue={props.item.Motivation !== undefined && props.item.Motivation !== null ? props.item.Motivation : ''}
                        HtmlEditorStateChange={HtmlEditorCallBack}
                    />
                </div>
                <div className="col-sm-12 my-4">
                            <label className="full_width">
                                <div className="alignCenter"><span onClick={() => {setOpenFeedback(!openFeedback)}}>{openFeedback ? <BsChevronDown/> : <BsChevronRight/>}</span>Feedback</div>
                            </label>
                        {openFeedback ? (<div className="border border-top-0 p-2">
                            <div className="star-block">
                                {localRatings.map((rating: any, index: number) => (
                                    <div key={index} className="skillBlock">
                                        <div className="skillTitle">{rating.SkillTitle}</div>
                                        <StarRating
                                            rating={rating}
                                            onRatingSelected={(updatedRating: any) => {
                                                const updatedRatings = [...localRatings];
                                                updatedRatings[index] = updatedRating;
                                                setLocalRatings(updatedRatings);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>): null}
                </div>

                <div className="col-sm-12 mb-3">
                    <div className="sectionHead siteBdrBottom mb-1">Overall Remarks</div>
                    <textarea
                        name="remarks"
                        value={overAllRemark}
                        onChange={(e) => setoverAllRemark(e.target.value)}
                        className="full_width scrollbar"
                    />
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className='input-group'>
                            <div className="sectionHead siteBdrBottom mb-1 w-100">Documents
                                <span className="pull-right text-end">
                                    <a onClick={() => setShowAddDocumentPanel(true)} className="f-13 hreflink">+Add More</a>
                                </span>
                            </div>
                            {TaggedDocuments.map(document => (
                                <div className="documenttype-list alignCenter" key={document.Id}>
                                    <span className="mr-10" style={{ display: document.File_x0020_Type === 'pdf' ? 'inline' : 'none' }}>
                                        <span title={document.Title} className="svg__iconbox svg__icon--pdf"></span>
                                    </span>
                                    <span className="mr-10" style={{ display: document.File_x0020_Type === 'xlsx' ? 'inline' : 'none' }}>
                                        <span title={document.Title} className="svg__iconbox svg__icon--xlsx"></span>
                                    </span>
                                    <span className="mr-10" style={{ display: document.File_x0020_Type === 'aspx' ? 'inline' : 'none' }}>
                                        <span title={document.Title} className="svg__iconbox svg__icon--unknownFile"></span>
                                    </span>
                                    <span className="mr-10" style={{ display: document.File_x0020_Type === 'docx' ? 'inline' : 'none' }}>
                                        <span title={document.Title} className="svg__iconbox svg__icon--docx"></span>
                                    </span>
                                    <span className="mr-10" style={{ display: !document.File_x0020_Type || document.File_x0020_Type === 'undefined' ? 'inline' : 'none' }}>
                                        <span className="svg__iconbox svg__icon--document"></span>
                                    </span>
                                    <span style={{ display: document.File_x0020_Type !== 'aspx' ? 'inline' : 'none' }}>
                                        <a onClick={() => openDocInNewTab(document.EncodedAbsUrl)} onDoubleClick={() => {downloadDoc(document.EncodedAbsUrl)}}>
                                            <span>
                                                <span style={{ display: document.FileLeafRef !== 'undefined' ? 'inline' : 'none' }}>
                                                    {document.FileLeafRef}
                                                </span>
                                                <span style={{ display: document.FileLeafRef === 'undefined' ? 'inline' : 'none' }}>
                                                    {document.FileLeafRef}
                                                </span>
                                            </span>
                                        </a>
                                    </span>
                                    <span onClick={() => removeDocuments('', document.Id, document.FileLeafRef)} className="svg__iconbox svg__icon--trash mx-auto"></span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-sm-6 nextStep">
                        <div className="sectionHead siteBdrBottom mb-1 w-100">Status</div>
                        <Dropdown
                            id="status"
                            options={Status.map((itm) => ({ key: itm, text: itm }))}
                            selectedKey={selectedStatus}
                            onChange={(e, option) => setSelectedStatus(option?.key || '')}
                            styles={{ dropdown: { width: '100%' } }}
                        />
                    </div>
                </div>
            </div>
            <footer className="bg-f4 fixed-bottom px-4 py-2">
                <div className="align-items-center d-flex justify-content-between me-3">
                    <div>
                        <div className="">
                            Created{" "}
                            <span className="font-weight-normal siteColor">
                                {" "}
                                {props.item.Created
                                    ? Moment(props.item.Created).format("DD/MM/YYYY")
                                    : ""}{" "}
                            </span>{" "}
                            By{" "}
                            <span className="font-weight-normal siteColor">
                                {props.item.Author?.Title ? props.item.Author?.Title : ""}
                            </span>
                        </div>
                        <div>
                            Last modified{" "}
                            <span className="font-weight-normal siteColor">
                                {" "}
                                {props.item.Modified
                                    ? Moment(props.item.Modified).format("DD/MM/YYYY")
                                    : ""}
                            </span>{" "}
                            By{" "}
                            <span className="font-weight-normal siteColor">
                                {props.item.Editor?.Title ? props.item.Editor.Title : ""}
                            </span>
                        </div>
                        <div>
                            <a className="hreflink siteColor">
                                <span className="alignIcon svg__iconbox hreflink mini svg__icon--trash"></span>
                                <span
                                    onClick={() => delItem(props.item.ID)}
                                >
                                    Delete This Item
                                </span>
                            </a>
                        </div>
                    </div>

                    <div className="float-end text-end">
                        <button onClick={handleEditSave} type='button' className='btn btn-primary'>Save</button>
                        <button onClick={onClose} type='button' className='btn btn-default ms-1'>Cancel</button>
                    </div>
                </div>
            </footer>
            {showAddDocumentPanel && (
                <Panel
                    isOpen={true}
                    onRenderHeader={onRenderCustomHeaderMainDoc}
                    onDismiss={onCloseDoc}
                    type={PanelType.custom}
                    isBlocking={false}
                    customWidth={"750px"}
                    closeButtonAriaLabel="Close"
                // ... (customize the panel as needed)
                >
                    <div>
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
                            <Row className='mb-2 px-2'>
                                <a onClick={addFileSection} className="float-end hreflink my-1 px-1 text-end">
                                    Add More Documents
                                </a>
                            </Row>
                        </Col>
                    </div>
                    <footer className="bg-f4 fixed-bottom px-4 py-2">
                        <div className="float-end text-end">
                            <button onClick={handleDocuments} type='button' className='btn btn-primary'>OK</button>
                            <button onClick={onCloseDoc} type='button' className='btn btn-default ms-1'>Cancel</button>
                        </div>
                    </footer>
                </Panel>
            )}
        </Panel>
    );
};
export default EditPopup;
