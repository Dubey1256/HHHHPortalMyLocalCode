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
import CreateContactComponent from '../../contactSearch/components/contact-search/popup-components/CreateContact';
import moment from 'moment-timezone';
const skillArray: any[] = [];
let EmployeeData: any;
const EditPopup = (props: any) => {
    const [CandidateTitle, setCandidateTitle] = useState(props.item.CandidateName);
    const [Email, setEmail] = useState(props.item.Email);
    const [PhoneNumber, setPhoneNumber] = useState(props.item.PhoneNumber);
    const [Experience, setExperience] = useState(props.item.Experience);
    const [overAllRemark, setoverAllRemark] = useState(props.item.Remarks);
    const [selectedStatus, setSelectedStatus] = useState(props.item.Status0);
    const [Motivation, setMotivation] = useState(props.item.Motivation)
    const [CreateContactStatus, setCreateContactStatus] = useState(false)
    const [experienceYears, setExperienceYears] = useState<number>();
    const [experienceMonths, setExperienceMonths] = useState<number>();
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
    const [Plats, setPlats] = useState<any[]>([]);
    const [localRatings, setLocalRatings] = useState(props.item?.ratings || []);
    const [TaggedDocuments, setTaggedDocuments] = useState<any[]>([]);
    const [showTextInput, setShowTextInput] = useState(false);
    const [otherChoice, setOtherChoice] = useState('');
    const [listData, setListData] = useState([]);

    let allListID= {
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
            let Array: any = ['Indeed', 'Agentur für Arbeit', 'Jobcenter', 'GesinesJobtipps','Linkedin','Naukri']
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

        const years = Math.floor(props.item.Experience);
        const months = Math.round((props.item.Experience % 1) * 12);


        // Update state variables
        setExperienceYears(years);
        setExperienceMonths(months);
    }, [props.item.Experience]);
    //eslint-disable-next-line eqeqeq
    if (props.item.SkillRatings != '') {
        const SkillRatingsdata = JSON.parse(props.item.SkillRatings);
    }

    const onClose = () => {
        props.EditPopupClose();
    }
    const handleEditSave = async () => {
        let updateData
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
            updateData = {

                Title: CandidateTitle,
                CandidateName: CandidateTitle,
                Email: Email,
                PhoneNumber: PhoneNumber,
                Experience: Experience,
                Remarks: overAllRemark,
                Status0: selectedStatus,
                Motivation: Motivation,
                SkillRatings: skillRatingsJson,
                SelectedPlatforms: platformChoicesString,

            }
            const list = HRweb.lists.getById(allListID?.InterviewFeedbackFormListId);
            await list.items.getById(props.item.Id).update(updateData);
            EmployeeData = updateData
            console.log("Item updated successfully");
            setCreateContactStatus(true)
            props.callbackEdit(props.item.Id);

        } catch (error) {
            console.error(error);
            // Handle errors here
        } finally {
            if (selectedStatus == "Hired") {


            } else {
                props.EditPopupClose(); // Close the edit popup after saving or if there's an error
            }

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
        }).catch((error: unknown) => {
            console.error(error);
        });
    };
    useEffect(() => {
        getListData();
        loadDocumentsByCandidate(props.item.Id)
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
    const addEllipsis = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };
    const HtmlEditorCallBack = React.useCallback((EditorData: any) => {
        if (EditorData.length > 8) {
            props.item.Motivation = EditorData;
        }
    }, [])
    const setRatings = (index: number, selectedRating: number) => {
        const updatedRatings = [...localRatings];
        updatedRatings[index].current = selectedRating;
        setLocalRatings(updatedRatings);
    };
    const removeDocuments = async (libraryTitle: string, documentId: number) => {
        try {
            // Get the document library by title
            const list = HRweb.lists.getByTitle('Documents');
            await list.items.getById(documentId).delete();
            console.log(`Document with ID ${documentId} removed successfully from ${libraryTitle}.`);
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
    const ClosePopup = React.useCallback(() => {

        setCreateContactStatus(false);
        props.EditPopupClose()

    }, []);
    const openDocInNewTab = (url: string | URL | undefined) => {
        window.open(url, '_blank');
    };
    return (
        <Panel
            onRenderHeader={onRenderCustomHeaderMain}
            isOpen={true}
            onDismiss={onClose}
            type={PanelType.custom}
            isBlocking={false}
            customWidth={"750px"}
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
                                        type='text'
                                        placeholder='Years'
                                        value={experienceYears}
                                        onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                                    />
                                    <input
                                        className='form-control'
                                        type='text'
                                        placeholder='Months'
                                        value={experienceMonths}
                                        onChange={(e) => setExperienceMonths(parseInt(e.target.value) || 0)}
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


                <div className="col-sm-12 my-4">
                    <details>
                        <summary className="alignCenter">
                            <label className="toggler full_width">
                                <div className="alignCenter">Feedback</div>
                            </label>
                        </summary>
                        <div className="border border-top-0 p-2">
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
                                        {/* <div className="comment-block">
                                            <textarea
                                                value={rating.Comment}
                                                onChange={(e) => {
                                                    const updatedRating: any = { ...rating, Comment: e.target.value };
                                                    const updatedRatings = [...localRatings];
                                                    updatedRatings[index] = updatedRating;
                                                    setLocalRatings(updatedRatings);
                                                }}
                                                name="remarks"
                                                className="full_width"
                                                auto-resize
                                            />
                                        </div> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </details>
                </div>
                <div className="col-sm-12 mb-3">
                    <div className="sectionHead siteBdrBottom mb-1">Cover Letter/Motivation</div>
                    <HtmlEditorCard
                        editorValue={props.item.Motivation !== undefined && props.item.Motivation !== null ? props.item.Motivation : ''}
                        HtmlEditorStateChange={HtmlEditorCallBack}
                    />
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
                            <div className="sectionHead siteBdrBottom mb-1 w-100">Documents</div>
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
                                    <a onClick={() => openDocInNewTab(document.EncodedAbsUrl)}>
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
                                    <span onClick={() => removeDocuments('', document.Id)} className="svg__iconbox svg__icon--trash mx-auto"></span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-sm-6 nextStep">
                        <div className="fsectionHead siteBdrBottom mb-1">Status</div>
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
            {CreateContactStatus ? <CreateContactComponent callBack={ClosePopup} data={EmployeeData} pageName={"Recruiting-Tool"} /> : null}
        </Panel>
    );
};
export default EditPopup;
