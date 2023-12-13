/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Panel, PrimaryButton, TextField, Dropdown, PanelType } from 'office-ui-fabric-react';
import * as React from 'react';
import { Item, sp, Web } from 'sp-pnp-js';
import styles from './HelloSpfx.module.scss';
import HtmlEditorCard from './FloraCommentBox';
import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import './Recruitment.css'
import CreateContactComponent from '../../contactSearch/components/contact-search/popup-components/CreateContact';
const skillArray: any[] = [];
let EmployeeData:any;
const EditPopup = (props: any) => {
    const starClassName = props.item && props.item.IsFavorite !== null
        ? (props.item.IsFavorite ? styles.favs : styles.favsGrey)
        : styles.favsGrey;
    const star = props.item.IsFavorite ? '⭐' : '';
    const headerText = `Candidate Details - ${props.item.CandidateName} ${star}`;
    const Status = ['New Candidate', 'Under Consideration', 'Interview', 'Negotiation', 'Hired', 'Rejected'];
    const [platformChoices, setPlatformChoices] = useState([
        { name: 'Indeed', selected: false },
        { name: 'Agentur für Arbeit', selected: false },
        { name: 'Jobcenter', selected: false },
        { name: 'GesinesJobtipps', selected: false },
        { name: 'Others', selected: false }
    ]);
    const [Plats, setPlats] = useState<any[]>([]);
    const [localRatings, setLocalRatings] = useState(props?.item?.ratings || []);
    const [TaggedDocuments, setTaggedDocuments] = useState<any[]>([]);
    const [showTextInput, setShowTextInput] = useState(false);
    const [otherChoice, setOtherChoice] = useState('');
    const [listData, setListData] = useState([]);

    const handlePlatformClick = (e: any) => {
        console.log(e)
        //  console.log(item)
        // setPlatformChoices((prevChoices) =>
        //     prevChoices.map((platform) =>
        //         platform.name === item.name ? { ...platform, selected: !platform.selected } : platform
        //     )
        // );
        // setShowTextInput(item.selected);
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleOtherChoiceChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setOtherChoice(event.target.value);
    };
    // eslint-disable-next-line eqeqeq
    if (props.item.SelectedPlatforms != '') {
        const selectedPlatforms = JSON.parse(props.item.SelectedPlatforms);

        useEffect(() => {
            // Create a new array with updated selected properties
            const updatedChoices = platformChoices.map((choice) => {
                const matchingItem = selectedPlatforms?.find((item: any) => item.name === choice.name);
                return matchingItem ? { ...choice, selected: matchingItem.selected } : choice;
            });

            setPlatformChoices(updatedChoices);
        }, []);

    }
    //eslint-disable-next-line eqeqeq
    if (props.item.SkillRatings != '') {
        const SkillRatingsdata = JSON.parse(props.item.SkillRatings);
    }
    const [CandidateName, setTitle] = useState(props.item.CandidateName);
    const [Email, setEmail] = useState(props.item.Email);
    const [PhoneNumber, setPhoneNumber] = useState(props.item.PhoneNumber);
    const [Experience, setExperience] = useState(props.item.Experience);
    const [overAllRemark, setoverAllRemark] = useState(props.item.Remarks);
    const [selectedStatus, setSelectedStatus] = useState(props.item.Status0);
    const [Motivation, setMotivation] = useState(props.item.Motivation)
    const[CreateContactStatus,setCreateContactStatus]=useState(false)
    const onClose = () => {
        props.EditPopupClose();
    }
    const handleEditSave = async () => {
        let updateData
        try {
            const skillRatingsJson = JSON.stringify(localRatings);
             updateData={
                
                    Title: CandidateName,
                    CandidateName: CandidateName,
                    Email: Email,
                    PhoneNumber: PhoneNumber,
                    Experience: Experience,
                    Remarks: overAllRemark,
                    Status0: selectedStatus,
                    Motivation: Motivation,
                    SkillRatings: skillRatingsJson
               
            }
            const list = sp.web.lists.getById(props.ListID);
            await list.items.getById(props.item.Id).update(updateData);
            console.log("Item updated successfully");
            setCreateContactStatus(true)
            EmployeeData=updateData

        } catch (error) {
            console.error(error);
            // Handle errors here
        } finally {
            if(selectedStatus=="Hired"){
               
                
            }else{
                props.EditPopupClose(); // Close the edit popup after saving or if there's an error
            }
           
        }
    };

    const getListData = () => {
        const skillMap: any = {};
        let initialratings: any = {};
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR/');
        web.lists.getById('e79dfd6d-18aa-40e2-8d6e-930a37fe54e4').items.getAll().then((response: any) => {
            setListData(response);
            const filteredData = response.filter((item: any) => {
                return item.Id === props.item.PositionsId;
            });
            skillArray.push(filteredData);
            initialratings = skillArray[0][0];
            if (props.item.SkillRatings === undefined || props.item.SkillRatings === '') {
                props.item.ratings = initialratings.JobSkills
            } else {
                props.item.ratings = JSON.parse(props.item.SkillRatings)

            }
            for (const obj of props.item.ratings) {
                skillMap[obj.SkillTitle] = true;
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
            const documents = await sp.web.lists.getByTitle(libraryTitle)
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
            // let param: any = Moment(new Date().toLocaleString())

            // FeedBackItem['Title'] = "FeedBackPicture" + param;
            // FeedBackItem['FeedBackDescriptions'] = [];
            // FeedBackItem.FeedBackDescriptions = [{
            //     'Title': EditorData
            // }]
            // FeedBackItem['ImageDate'] = "" + param;
            // FeedBackItem['Completed'] = '';
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
            const list = sp.web.lists.getByTitle('Documents');
            await list.items.getById(documentId).delete();
            console.log(`Document with ID ${documentId} removed successfully from ${libraryTitle}.`);
        } catch (error) {
            console.error('Error removing document:', error);
        }
    };
    const ClosePopup = React.useCallback(() => {
       
        setCreateContactStatus(false);
        props.EditPopupClose()
        
    }, []);
    return (
        <Panel
            headerText={headerText}
            isOpen={true}
            onDismiss={onClose}
            type={PanelType.medium}
            isBlocking={false}
            closeButtonAriaLabel="Close"
        >
            <TextField className='TextField-Input' label="Name" defaultValue={props.item.CandidateName} onChange={(e, newValue) => setTitle(newValue)} />
            <TextField className='TextField-Input' label="Email" defaultValue={props.item.Email} onChange={(e, newValue) => setEmail(newValue)} />
            <TextField className='TextField-Input' label="Phone Number" defaultValue={props.item.PhoneNumber} onChange={(e, newValue) => setPhoneNumber(newValue)} />
            <TextField className='TextField-Input' label="Experience" defaultValue={props.item.Experience} onChange={(e, newValue) => setExperience(newValue)} />
            <div className="col-sm-12 mb-2">
                <label className="form-label full-width">Platform</label>
                <div className="CustomCheckRadio justify-content-between valign-middle">
                    {platformChoices.map((item) => (
                        <label className="label--checkbox" key={item.name}>
                            <input
                                type="checkbox"
                                className="cursor-pointer form-check-input me-1"
                                defaultChecked={item.selected}
                                onChange={(e) => handlePlatformClick(e)}
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

            <div className="col-sm-12 mb-2">
                <label className="form-label full-width">Feedback</label>
                <details>
                    <div className="expand-AccordionContent clearfix">
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
                                    <div className="comment-block">
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </details>
            </div>
            <div className="col-sm-12 mb-2">
                <label className="form-label full-width">Cover Letter/Motivation</label>
                <HtmlEditorCard
                    editorValue={props.item.Motivation !== undefined && props.item.Motivation !== null ? props.item.Motivation : ''}
                    HtmlEditorStateChange={HtmlEditorCallBack}
                />
            </div>

            <div className="col-sm-12 mb-2">
                <label className="form-label full-width">Overall Remarks</label>
                <textarea
                    name="remarks"
                    value={overAllRemark}
                    onChange={(e) => setoverAllRemark(e.target.value)}
                    className="full_width scrollbar"
                />
            </div>
            <div className="Row">
                <div className="col-sm-6">
                    <label className="form-label full-width">Documents</label>
                    <div>
                        {TaggedDocuments.map(document => (
                            <div className="documenttype-list valign-middle" key={document.Id}>
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
                                    <a href={`${document.EncodedAbsUrl}?web=1`} target="_blank">
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
                    <label className="form-label full-width">Status</label>
                    <Dropdown
                        id="status"
                        options={Status.map((itm) => ({ key: itm, text: itm }))}
                        selectedKey={selectedStatus}
                        onChange={(e, option) => setSelectedStatus(option?.key || '')}
                        styles={{ dropdown: { width: '100%' } }}
                    />
                </div>
            </div>
            <footer className="bg-f4 fixed-bottom px-4 py-2">
                <div className="float-end text-end">
                    <PrimaryButton onClick={handleEditSave} text="Save" />
                    <PrimaryButton onClick={onClose} className='ms-1' text="Cancel" />
                </div>
            </footer>
            {CreateContactStatus ? <CreateContactComponent callBack={ClosePopup}data={EmployeeData} pageName={"Recruiting-Tool"}/> : null}
        </Panel>
    );
};
export default EditPopup;
