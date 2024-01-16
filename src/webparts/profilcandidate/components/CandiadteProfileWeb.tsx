import *as React from 'react'
import { Tab, Col, Nav, Row, } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Web, sp } from 'sp-pnp-js';
import moment, * as Moment from "moment";
import { FaSquarePhone } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import './CandidateProfile.css';
import { FaCity } from "react-icons/fa";
import { ColumnDef } from '@tanstack/react-table';
import { myContextValue } from '../../../globalComponents/globalCommon'
import HHHHEditComponent from '../../contactSearch/components/contact-search/popup-components/HHHHEditcontact';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import CandidateRating from './CandidateRating';
import EditPopup from '../../helloSpfx/components/EditPopup';
import PageLoader from '../../../globalComponents/pageLoader';

let allSite: any = {
    GMBHSite: false,
    HrSite: false,
    MainSite: true,
}
let OldEmployeeProfile: any
const Profilcandidate = ({ props }: any) => {
    const params = new URLSearchParams(window.location.search);
    const [EmployeeData, setEmployeeData]: any = useState()
    const [localRatings, setLocalRatings] = useState([]);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem]: any = useState(null);
    const [TaggedDocuments, setTaggedDocuments] = useState<any[]>([]);
    const [loaded, setLoaded] = useState(false)
    let allListId = {
        // Context: props?.props.Context,
        // HHHHContactListId: props?.props?.HHHHContactListId,
        InterviewFeedbackFormListId: '298bc01c-710d-400e-bf48-8604d297c3c6',
        SkillsPortfolioListID: 'e79dfd6d-18aa-40e2-8d6e-930a37fe54e4'

        // jointSiteUrl: "https://hhhhteams.sharepoint.com/sites/HHHH"
    }
    useEffect(() => {
        EmployeeDetails(params.get('CandidateId'));
    }, [])
    const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR/');
    const EmployeeDetails = async (Id: any) => {
        try {
            await web.lists.getById('298bc01c-710d-400e-bf48-8604d297c3c6')
                .items.getById(Id).select('Id', 'Title', 'Remarks', 'Motivation', 'Created', 'Modified', 'AuthorId', 'Author/Title', 'Editor/Id', 'Editor/Title', 'SelectedPlatforms', 'Result', 'CandidateStaffID', 'ActiveInterv', 'Status0', 'IsFavorite', 'CandidateName', 'SkillRatings', 'Positions/Id', 'Positions/Title', 'Platform', 'IsFavorite', 'PhoneNumber', 'Email', 'Experience', 'Current_x0020_Company', 'Date', 'CurrentCTC', 'ExpectedCTC', 'NoticePeriod', 'CurrentLocation', 'DateOfJoining', 'HRNAME')
                .expand('Positions', 'Editor', 'Author').get().then((data: any) => {
                    if (data.SkillRatings !== null || data.SkillRatings !== undefined) {
                        const ratings = JSON.parse(data.SkillRatings)
                        setLocalRatings(ratings)
                    }
                    setEmployeeData(data);
                    loadDocumentsByCandidate(data.Id)
                })
        } catch (error) {
            console.log("Error:", error.message);
        }
    };
    const loadDocumentsByCandidate = async (candidateId: any) => {
        try {
            setLoaded(true)
            const libraryTitle = 'Documents';
            const columnName = 'InterviewCandidates';
            const documents = await web.lists.getByTitle(libraryTitle)
                .items
                .filter(`${columnName}/Id eq ${candidateId}`)
                .select('Id', 'Title', 'Item_x0020_Type', 'File_x0020_Type', 'FileDirRef', 'FileLeafRef', 'EncodedAbsUrl', 'InterviewCandidates/Id')
                .expand('InterviewCandidates')
                .getAll();
    
            console.log('Documents loaded successfully:', documents);
            setTaggedDocuments(documents);
            setTimeout(() => {
                setLoaded(false);
              }, 3000);
            return documents;
        } catch (error) {
            console.error('Error loading documents by candidate:', error);
            setLoaded(true)
            return [];
        }
    };
    const EditPopupOpen = (item: any) => {
        setSelectedItem(item);
        setIsEditPopupOpen(true);
    };
    const EditPopupClose = () => {
        setIsEditPopupOpen(false);
    };
    const callbackEdit = (Id: any) => {
        loadDocumentsByCandidate(Id);
        EmployeeDetails(Id) 
    }
    const formatExperience = (exp: any) => {
        if (exp != undefined) {
            const yearsString: string = exp?.toString();
            const experience = yearsString.split('.');
            const year = experience[0]
            const month = experience[1]
            let experienceYears = year;
            let experienceMonths = month;
            if (month === '12') {
                let year = parseInt(experienceYears, 10)
                year++;
                experienceYears = year.toString();
                experienceMonths = 0..toString();
            }
            const years = parseInt(experienceYears)
            const months = parseInt(experienceMonths)
            if (years > 0 && months > 0) {
                return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
            } else if (years > 0) {
                return `${years} year${years > 1 ? 's' : ''}`;
            } else if (months > 0) {
                return `${months} month${months > 1 ? 's' : ''}`;
            } else {
                return 'No experience';
            }
        }
    };

    const openDocInNewTab = (url: string | URL | undefined) => {
            window.open(url, '_blank');
    };
    const downloadDoc = (url: string | URL | undefined) => {
        window.open(url + '?download=1');
    }
    return (
        <>
        {loaded ? <PageLoader/> : null}
        <myContextValue.Provider value={{ ...myContextValue, allSite: allSite, allListId: allListId, loggedInUserName: props?.userDisplayName }}>
            {isEditPopupOpen ? <EditPopup siteUrl={'https://hhhhteams.sharepoint.com/sites/HHHH/HR/'} EditPopupClose={EditPopupClose} callbackEdit={callbackEdit} item={selectedItem} ListID={'298bc01c-710d-400e-bf48-8604d297c3c6'} skillsList={'e79dfd6d-18aa-40e2-8d6e-930a37fe54e4'} /> : ''}
            <div className='alignCenter border-bottom pb-2'>
                <div>
                    <img className='user-dp' src={EmployeeData?.Item_x0020_Cover?.Url != undefined ? EmployeeData?.Item_x0020_Cover?.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                </div>
                <div className='w-100 ms-4'>
                    <div className='alignCenter'>
                        <h2 className='mb-2 ms-0 heading'>{`${EmployeeData?.CandidateName} `}
                            <span onClick={() => EditPopupOpen(EmployeeData)} title="Edit" className="svg__iconbox hreflink alignIcon svg__icon--edit"></span>
                        </h2>
                        {/* <a className='fw-semibold ml-auto' target='_blank' data-interception="off" href={OldEmployeeProfile}>Old Employee Profile</a> */}
                    </div>

                    <div className="row">
                        <div className="col-md-12 ps-2">
                            <div className='profileHead'>
                                <div className="bg-Fa profileLeftSec col-md-3">Position</div>
                                <div className='bg-Ff profileRightSec col-md-9'>{EmployeeData?.Positions?.Title} </div>
                            </div>
                            <div className='profileHead'>
                                <div className="bg-Fa profileLeftSec col-md-3">Experience</div>
                                <div className='bg-Ff profileRightSec col-md-9'>{formatExperience(EmployeeData?.Experience)} </div>
                            </div>
                            <div className='profileHead'>
                                <div className="bg-Fa profileLeftSec col-md-3">Application Date</div>
                                <div className='bg-Ff profileRightSec col-md-9'>{EmployeeData?.Date != undefined ? moment(EmployeeData?.Date)?.format('DD-MM-YYYY') : ""} </div>
                            </div>
                            <div className='profileHead'>
                                <div className="bg-Fa profileLeftSec col-md-3">Responsible Staff Member</div>
                                <div className='bg-Ff profileRightSec col-md-9'>{EmployeeData?.ActiveInterv} </div>
                            </div>
                            <div className='profileHead'>
                                <div className="bg-Fa profileLeftSec col-md-3">Status</div>
                                <div className='bg-Ff profileRightSec col-md-9'>{EmployeeData?.Status0} </div>
                            </div>
                            <div className='profileHead'>
                                <div className="bg-Fa profileLeftSec col-md-3">Platform</div>
                                <div className='bg-Ff profileRightSec col-md-9'>
                                    {EmployeeData?.SelectedPlatforms ? (
                                        (() => {
                                            try {
                                                const platformsArray = JSON.parse(EmployeeData.SelectedPlatforms);

                                                if (Array.isArray(platformsArray) && platformsArray.length > 0) {
                                                    return platformsArray
                                                        .filter(platform => platform.selected)
                                                        .map((platform, index) => (
                                                            <React.Fragment key={platform.name}>
                                                                {index > 0 && ', '}
                                                                {platform.name}
                                                            </React.Fragment>
                                                        ));
                                                }
                                            } catch (error) {
                                                console.error('Error parsing SelectedPlatforms:', error);
                                            }

                                            return '';
                                        })()
                                    ) : (
                                        'No Platform specified'
                                    )}
                                </div>
                            </div>


                        </div>

                    </div>

                </div>

            </div>
            <div>
                <div className='col-sm-12 px-2 mt-3 row'>
                    <div className='siteBdrBottom siteColor sectionHead ps-0 mb-2'>Contact Information</div>
                    <div className="col-sm-6 ps-0 alignCenter mb-3">
                        <span className="f-20" title='Phone Number'>
                            <FaSquarePhone />
                        </span>
                        <span className="full_widivh ms-2 mt-1">{EmployeeData?.PhoneNumber}</span>
                    </div>
                    <div className="col-sm-6 pe-0 alignCenter mb-3">
                        <span className="f-20" title='E-mail'>
                            <IoMdMail />
                        </span>
                        <span className="full_widivh ms-2 mt-1">
                            <a href={`mailto:${EmployeeData?.Email}`}>{EmployeeData?.Email}</a>
                        </span>
                    </div>
                </div>
                <div className='col-sm-12 px-2 mt-3 row'>
                    <div className='siteBdrBottom siteColor sectionHead ps-0 mb-2'>Documents</div>
                    <div className='px-0'>
                        {TaggedDocuments.length > 0 ? (
                            TaggedDocuments.map(document => (
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
                                </div>
                            ))
                        ) : (
                            <div className="no-remarks-message-container">
                                <div className="no-remarks-message">No Documents to Show</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='col-sm-12 px-2 mt-3 row'>
                    <div className='siteBdrBottom siteColor sectionHead ps-0 mb-2'>Feedback</div>
                    {localRatings && localRatings.length > 0 ? (
                        <div className="px-0">
                            <div className="star-block">
                                {localRatings.map((rating: any, index: number) => (
                                    <div key={index} className="skillBlock alignCenter w-100">
                                        <div className='col-md-3 p-0'>
                                            <div className="skillTitle">{rating.SkillTitle}</div>
                                        </div>
                                        <CandidateRating
                                            rating={rating}
                                            onRatingSelected={(updatedRating: any) => {
                                                const updatedRatings = [...localRatings];
                                                // updatedRatings[index] = updatedRating;
                                                setLocalRatings(updatedRatings);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="no-remarks-message-container">
                            <div className="no-remarks-message">No Feedback to Show</div>
                        </div>
                    )}
                </div>

                <div className='col-sm-12 px-2 mt-3 row'>
                    <div className='siteBdrBottom siteColor sectionHead ps-0 mb-2'>Overall Remarks</div>
                    {EmployeeData?.Remarks ? (
                        <div className='px-0' dangerouslySetInnerHTML={{ __html: EmployeeData?.Remarks }} />
                    ) : (
                        <div className="no-remarks-message-container">
                            <div className="no-remarks-message">No remarks to show</div>
                        </div>
                    )}
                </div>
                <div className='col-sm-12 px-2 mt-3 row'>
                    <div className='siteBdrBottom siteColor sectionHead ps-0 mb-2'>Cover Letter/Motivation</div>
                    {EmployeeData?.Motivation ? (
                        <div className='px-0' dangerouslySetInnerHTML={{ __html: EmployeeData?.Motivation }} />
                    ) : (
                        <div className="no-remarks-message-container">
                            <div className="no-remarks-message">No cover letter to show</div>
                        </div>
                    )}
                </div>
            </div>
        </myContextValue.Provider>
        </>
    )
}
export default Profilcandidate
