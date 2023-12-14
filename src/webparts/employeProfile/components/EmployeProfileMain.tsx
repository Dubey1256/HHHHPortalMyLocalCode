import *as React from 'react'
import { Tab, Col, Nav, Row, } from 'react-bootstrap';
import Information from './Information';
import { useEffect, useState } from 'react';
import { Web } from 'sp-pnp-js';
import moment, * as Moment from "moment";
import { ColumnDef } from '@tanstack/react-table';
import { myContextValue } from '../../../globalComponents/globalCommon'
import HHHHEditComponent from '../../contactSearch/components/contact-search/popup-components/HHHHEditcontact';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
let allListId: any = {};
let allSite: any = {
    GMBHSite: false,
    HrSite: false,
    MainSite: true,
}
let OldEmployeeProfile: any
const EmployeProfileMain = (props: any) => {
    const [EmployeeData, setEmployeeData]: any = useState()
    const [contractData, setContractData] = useState([]);
    const [siteTaggedHR, setSiteTaggedHR] = useState(false);
    const [URLs, setURLs] = useState([]);
    const [hrUpdateData, setHrUpdateData]: any = useState()
    const [EditContactStatus, setEditContactStatus] = useState(false);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (props?.props.Context.pageContext.web.absoluteUrl.toLowerCase().includes("hr")) {
            allSite = {
                HrSite: true,
                MainSite: false
            }
        }
        if (props?.props.Context.pageContext.web.absoluteUrl.toLowerCase().includes("gmbh")) {
            allSite = {
                GMBHSite: true,
                MainSite: false,
            }

        }
        allListId = {
            Context: props?.props.Context,
            HHHHContactListId: props?.props?.HHHHContactListId,
            HHHHInstitutionListId: props?.props?.HHHHInstitutionListId,
            MAIN_SMARTMETADATA_LISTID: props?.props?.MAIN_SMARTMETADATA_LISTID,
            MAIN_HR_LISTID: props?.props?.MAIN_HR_LISTID,
            GMBH_CONTACT_SEARCH_LISTID: props?.props?.GMBH_CONTACT_SEARCH_LISTID,
            HR_EMPLOYEE_DETAILS_LIST_ID: props?.props?.HR_EMPLOYEE_DETAILS_LIST_ID,
            ContractListID: props?.props?.ContractListID,
            siteUrl: props?.props.Context.pageContext.web.absoluteUrl,
            jointSiteUrl: "https://hhhhteams.sharepoint.com/sites/HHHH"
        }
        if (allSite?.MainSite == true) {
            OldEmployeeProfile = `https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/Contact-Profile.aspx?contactId=${params.get('contactId')}`
            if (allSite?.MainSite) {
                EmployeeDetails(params.get('contactId'));
            }


            // InstitutionDetails();
        }
        else if (allSite?.GMBHSite) {
            let contactId = params.get('contactId')
            HrGmbhEmployeDeatails(contactId)
            OldEmployeeProfile = `https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SitePages/Contact-Profile.aspx?contactId=${params.get('contactId')}`
        }
        else if (allSite?.HrSite) {
            OldEmployeeProfile = `https://hhhhteams.sharepoint.com/sites/HHHH/HR/SitePages/EmployeeInfo-old.aspx?employeeId=${params.get('employeeId')}`
            let employeeId = params.get('employeeId')
            HrGmbhEmployeDeatails(employeeId)
        }
    }, [])
    const EmployeeDetails = async (Id: any) => {
        try {
            let web = new Web(allListId?.siteUrl);
            await web.lists.getById(props?.props?.HHHHContactListId)
                .items.getById(Id).select("Id, Title, FirstName, FullName, Department,DOJ,DOE, Company, WorkCity, Suffix, WorkPhone, HomePhone, Comments, WorkAddress, WorkFax, WorkZip, Site, ItemType, JobTitle, Item_x0020_Cover, WebPage, Site, CellPhone, Email, LinkedIn, Created, SocialMediaUrls, SmartCountries/Title, SmartCountries/Id, Author/Title, Modified, Editor/Title, Division/Title, Division/Id, EmployeeID/Title, StaffID, EmployeeID/Id, Institution/Id, Institution/FullName, IM")
                .expand("EmployeeID, Division, Author, Editor, SmartCountries, Institution").get().then((data: any) => {
                    let URL: any[] = JSON.parse(data.SocialMediaUrls != null ? data.SocialMediaUrls : ["{}"]);
                    setURLs(URL);
                    data.SocialMediaUrlsArray = URL
                    // if (data.Institution != null) {
                    //     setCurrentInstitute(data.Institution);
                    // }


                    // let SitesTagged = '';
                    // if (data.Site != null) {
                    //     if (data.Site.length >= 0) {
                    //         data.Site?.map((site: any, index: any) => {
                    //             if (index == 0) {
                    //                 SitesTagged = site;
                    //             } else if (index > 0) {
                    //                 SitesTagged = SitesTagged + ', ' + site;
                    //             }
                    //         })
                    //     }
                    // }
                    // if (SitesTagged.search("HR") >= 0 && myContextData2.loggedInUserName == data.Email) {
                    //     HrTagInformation(Id);
                    //     setSiteTaggedHR(true);
                    // }
                    if (props.props?.userDisplayName == data.Email) {
                        setSiteTaggedHR(true);
                        HrTagInformation(Id);
                    }

                    data.Item_x002d_Image = data?.Item_x0020_Cover;
                    setEmployeeData(data);
                }).catch((error: any) => {
                    console.log(error)
                })



        } catch (error) {
            console.log("Error:", error.message);
        }

    }
    const HrTagInformation = async (Id: any) => {
        try {
            const web = new Web(allListId?.jointSiteUrl);
            let data = await web.lists
                .getById(allListId?.MAIN_HR_LISTID)
                .items.select(
                    "Id,ID,Title,BIC,Country, Parenthood, IBAN, Nationality,healthInsuranceCompany,highestVocationalEducation,healthInsuranceType,highestSchoolDiploma,insuranceNo,otherQualifications,dateOfBirth,Fedral_State,placeOfBirth,maritalStatus,taxNo,churchTax,taxClass,monthlyTaxAllowance,childAllowance,SmartState/Title,SmartState/Id,SmartLanguages/Title,SmartLanguages/Id,SmartContact/Title,SmartContact/Id").expand("SmartLanguages, SmartState, SmartContact").filter("SmartContact/ID eq " + Id).get();
            let array = [];
            array.push(data[0]);
            setHrUpdateData(array[0]);

        } catch (error) {
            console.log("error:", error.message);
        }
    };
    const HrGmbhEmployeDeatails = async (Id: any) => {

        try {
            let web = new Web(allListId?.siteUrl);
            await web.lists.getById(allSite?.GMBHSite ? allListId?.GMBH_CONTACT_SEARCH_LISTID : allListId?.HR_EMPLOYEE_DETAILS_LIST_ID)
                .items.getById(Id)
                .select("Id", "Title", "FirstName", "FullName", "Company", "WorkCity", "Suffix", "WorkPhone", "HomePhone", "Comments", "WorkAddress", "WorkFax", "WorkZip", "ItemType", "JobTitle", "Item_x0020_Cover", "WebPage", "CellPhone", "Email", "LinkedIn", "Created", "SocialMediaUrls", "Author/Title", "Modified", "Editor/Title", "Division/Title", "Division/Id", "EmployeeID/Title", "StaffID", "EmployeeID/Id", "Institution/Id", "Institution/FullName", "IM")
                .expand("EmployeeID", "Division", "Author", "Editor", "Institution")

                .get().then((data: any) => {


                    let URL: any[] = JSON.parse(data.SocialMediaUrls != null ? data.SocialMediaUrls : ["{}"]);
                    setURLs(URL);
                    data.SocialMediaUrlsArray = URL
                    // if (data?.Institution != null && data?.Institution!=undefined) {
                    //    setCurrentInstitute(data?.Institution);
                    // }
                    data.Item_x002d_Image = data?.Item_x0020_Cover;


                    if (allSite?.HrSite) {
                        setSiteTaggedHR(true);
                        HrTagInformation(Id);
                        HrContractDetails(Id)
                    }
                    setEmployeeData(data);
                }).catch((error: any) => {
                    console.log(error)
                })



        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    const ClosePopup = () => {
        setEditContactStatus(false)
    }

    const HrContractDetails = async (Id: any) => {
        try {
            let web = new Web(allListId?.siteUrl);
            await web.lists.getById(allListId?.ContractListID)
                .items.select("Id,Title,Author/Title,Editor/Title,startDate,endDate,ContractSigned,ContractChanged,GrossSalary,PersonnelNumber,ContractId,typeOfContract,Type_OfContract/Id,Type_OfContract/Title,WorkingHours,FolderID,contractNumber,SmartInformation/Id,SmartInformation/Title,EmployeeID/Id,EmployeeID/Title,EmployeeID/Name,HHHHStaff/Id,HHHHStaff/FullName")
                .expand("Author,Editor,EmployeeID,HHHHStaff,SmartInformation,Type_OfContract").filter("HHHHStaff/ID eq " + Id).get().then((hrContractdata: any) => {
                    console.log(hrContractdata);
                    hrContractdata?.map((hrContractdata: any) => {
                        hrContractdata.StartDate = hrContractdata?.startDate != undefined ? moment(hrContractdata?.startDate)?.format('DD-MM-YYYY') : ""
                        hrContractdata.EndDate = hrContractdata?.endDate != undefined ? moment(hrContractdata?.endDate)?.format('DD-MM-YYYY') : ""
                    })
                    setContractData(hrContractdata)
                }).catch((error: any) => {
                    console.log(error)
                })



        } catch (error) {
            console.log("Error:", error.message);
        }
    }


    const columns: any = React.useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 25,
                id: 'Id',
            },
            { accessorKey: "contractNumber", placeholder: "Contract No.", header: "", size: 100, },
            {
                accessorFn: (row: any) => row?.Title,
                cell: ({ row }: any) => (
                    <a target='_blank' data-interception="off"
                        href={allSite?.HrSite ? `${allListId?.siteUrl}/SitePages/EmployeeInfo.aspx?employeeId=${row?.original.Id}` : `${allListId?.siteUrl}/SitePages/Contact-Profile.aspx?contactId=${row?.original.Id}`}
                    >{row.original.Title}</a>

                ),

                canSort: false,
                placeholder: 'Contract Title',
                header: '',
                id: 'Title',
                size: 150,
            },
            { accessorKey: "StartDate", placeholder: "Start Date", header: "", size: 140, },
            { accessorKey: "EndDate", placeholder: "End Date", header: "", size: 140, },

            // {
            //     cell: ({ row }: any) => (
            //         <>
            //             <img className='workmember ' src={`${row.original.Item_x0020_Cover != null && row.original.Item_x0020_Cover.Url != null ? row.original.Item_x0020_Cover.Url : 'https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg'}`} />
            //         </>
            //     ),
            //     accessorFn: '',
            //     canSort: false,
            //     placeholder: '',
            //     header: '',
            //     id: 'row.original',
            //     size: 25,
            // },


            // {
            //     accessorFn: (row: any) => row?.Institution?.FullName,
            //     cell: ({ row }: any) => (
            //         <span>{row?.original?.Institution?.FullName}</span>

            //     ),
            //     canSort: false,
            //     placeholder: 'Organization',
            //     header: '',
            //     id: 'Company',
            //     size: 250,
            // },
            // {
            //     accessorFn: (row: any) => row?.Division?.Title,
            //     cell: ({ row }: any) => (
            //         <span>{row?.original?.Division?.Title}</span>

            //     ),
            //     canSort: false,
            //     placeholder: 'Department',
            //     header: '',
            //     id: 'Department',
            //     size: 80,
            // },

            // { accessorKey: "SitesTagged", placeholder: "Site", header: "", size: 80, },
            // {
            //     cell: ({ row }) => (
            //         <>
            //             {/* <a onClick={() => EditContactPopup(row.original)} title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a> */}
            //             <span onClick={() => EditContactPopup(row.original)} title="Edit" className='svg__iconbox svg__icon--edit hreflink'></span>
            //         </>
            //     ),
            //     accessorKey: '',
            //     canSort: false,
            //     placeholder: '',
            //     header: '',
            //     id: 'row.original',
            //     size: 10,
            // },

        ],
        [contractData]);
    const callBackData = (data: any) => {

        console.log(data)
    }
    return (

        <myContextValue.Provider value={{ ...myContextValue, allSite: allSite, allListId: allListId, loggedInUserName: props.props?.userDisplayName }}>
            <div>
                <div className='alignCenter border-bottom pb-2'>
                    <div>
                        <img className='user-dp' src={EmployeeData?.Item_x0020_Cover?.Url != undefined ? EmployeeData?.Item_x0020_Cover?.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                    </div>
                    <div className='w-100 ms-4'>
                        <div className='alignCenter'>
                            <h2 className='mb-2 ms-0 heading'>{allSite?.HrSite ? `${EmployeeData?.FullName} (${EmployeeData?.StaffID} )` : `${EmployeeData?.FullName}`}
                                {/* <div className="svg__iconbox svg__icon--edit alignIcon hreflink" title="Edit Employee Profile" onClick={()=>setEditContactStatus(true)}></div> */}
                                <a className="hreflink" onClick={() => setEditContactStatus(true)} title="Edit Employee Profile"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333"></path></svg></a>
                            </h2>
                            <a className='fw-semibold ml-auto' target='_blank' data-interception="off" href={OldEmployeeProfile}>Old Employee Profile</a>

                        </div>

                        <div className="row">
                            <div className="col-md-12 ps-2">
                                <dl className='profileHead'>
                                    <dt className="bg-Fa profileLeftSec col-md-3">Organization</dt>
                                    <dd className='bg-Ff profileRightSec col-md-9'>{EmployeeData?.Institution?.FullName} </dd>
                                </dl>
                                <dl className='profileHead'>
                                    <dt className="bg-Fa profileLeftSec col-md-3">Department</dt>
                                    <dd className='bg-Ff profileRightSec col-md-9'>{EmployeeData?.Department} </dd>
                                </dl>
                                <dl className='profileHead'>
                                    <dt className="bg-Fa profileLeftSec col-md-3">Job Title</dt>
                                    <dd className='bg-Ff profileRightSec col-md-9'> {EmployeeData?.JobTitle}</dd>
                                </dl>
                                <dl className='profileHead'>
                                    <dt className="bg-Fa profileLeftSec col-md-3">Date of Joining</dt>
                                    <dd className='bg-Ff profileRightSec col-md-9'>{EmployeeData?.DOJ != undefined ? moment(EmployeeData?.DOJ)?.format('DD-MM-YYYY') : ""} </dd>
                                </dl>
                                <dl className='profileHead'>
                                    <dt className="bg-Fa profileLeftSec col-md-3">Date of Exit</dt>
                                    <dd className='bg-Ff profileRightSec col-md-9'> {EmployeeData?.DOE != undefined ? moment(EmployeeData?.DOE)?.format('DD-MM-YYYY') : ""}</dd>
                                </dl>
                            </div>

                        </div>

                    </div>
                </div>
                {siteTaggedHR ? <div className="my-3">
                    <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                        <button
                            className="nav-link active"
                            id="BASIC-INFORMATION2"
                            data-bs-toggle="tab"
                            data-bs-target="#BASICINFORMATION2"
                            type="button"
                            role="tab"
                            aria-controls="BASICINFORMATION2"
                            aria-selected="true"
                        >
                            BASIC INFORMATION
                            {/* TASK INFORMATION */}
                        </button>
                        <button
                            className="nav-link"
                            id="CONTRACTS-Tab"
                            data-bs-toggle="tab"
                            data-bs-target="#CONTRACTS"
                            type="button"
                            role="tab"
                            aria-controls="CONTRACTS"
                            aria-selected="true"
                        >
                            CONTRACTS
                            {/* TASK INFORMATION */}
                        </button>
                    </ul>
                    <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                        <div className="tab-pane show active" id="BASICINFORMATION2" role="tabpanel" aria-labelledby="BASICINFORMATION2">

                            <div className="col-sm-12 imgTab">
                                <Tab.Container id="left-tabs-example" defaultActiveKey="Information2">
                                    <Row>
                                        <Col sm={2} className='pe-0'>
                                            <Nav variant="pills" className="flex-column">
                                                <Nav.Item >
                                                    <Nav.Link eventKey="Information2" >Information</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="TaxAndInsurance2"> Tax And Insurance</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="Qualifications2" > Qualifications</Nav.Link>
                                                </Nav.Item>


                                            </Nav>
                                        </Col>
                                        <Col sm={10} className='p-0'>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="Information2" className='p-0 border' >
                                                    <Information EmployeeData={EmployeeData} siteTaggedHR={siteTaggedHR} hrUpdateData={hrUpdateData} />
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="TaxAndInsurance2" className='p-0 border'>
                                                    <div className='mt-3'>
                                                        <div className='col-md-12 px-3 row mb-3'>
                                                            <div className='siteBdrBottom siteColor sectionHead p-0 mb-2'>Tax information</div>
                                                            <div className='col-md-4 ps-0'>
                                                                <dl className="profileHead">
                                                                    <dt className="col-md-7 bg-Fa profileLeftSec">
                                                                        Tax No
                                                                    </dt>
                                                                    <dd className="col-md-5 profileRightSec bg-FF">
                                                                        {hrUpdateData?.taxNo}
                                                                    </dd>
                                                                </dl>
                                                                <dl className="profileHead">
                                                                    <dt className="col-md-7 bg-Fa profileLeftSec">
                                                                        Monthly Tax Allowance
                                                                    </dt>
                                                                    <dd className="col-md-5 profileRightSec bg-FF">
                                                                        {hrUpdateData?.monthlyTaxAllowance}
                                                                    </dd>
                                                                </dl>
                                                            </div>
                                                            <div className='col-md-4 p-0'>
                                                                <dl className="profileHead">
                                                                    <dt className="col-md-7 bg-Fa profileLeftSec">
                                                                        Church tax
                                                                    </dt>
                                                                    <dd className="col-md-5 profileRightSec bg-FF">
                                                                        {hrUpdateData?.churchTax}
                                                                    </dd>
                                                                </dl>
                                                                <dl className="profileHead">
                                                                    <dt className="col-md-7 bg-Fa profileLeftSec">
                                                                        Child Allowance
                                                                    </dt>
                                                                    <dd className="col-md-5 profileRightSec bg-FF">
                                                                        {hrUpdateData?.childAllowance}
                                                                    </dd>
                                                                </dl>
                                                            </div>
                                                            <div className='col-md-4 pe-0'>
                                                                <dl className="profileHead">
                                                                    <dt className="col-md-7 bg-Fa profileLeftSec">
                                                                        Tax class
                                                                    </dt>
                                                                    <dd className="col-md-5 profileRightSec bg-FF">
                                                                        {hrUpdateData?.taxClass}
                                                                    </dd>
                                                                </dl>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-12 px-3 row mb-2'>
                                                            <div className='siteBdrBottom sectionHead siteColor p-0'>Social Security Insurance</div>
                                                            <dl className="profileHead p-0">
                                                                <dt className="width200 bg-Fa profileLeftSec">
                                                                    Health Insurance Company
                                                                </dt>
                                                                <dd className="bg-FF profileRightSec">
                                                                    {hrUpdateData?.healthInsuranceCompany}
                                                                </dd>
                                                            </dl>
                                                            <div className='col-md-6 ps-0'>
                                                                <dl className="profileHead">
                                                                    <dt className="width200 bg-Fa profileLeftSec">
                                                                        Health Insurance Type
                                                                    </dt>
                                                                    <dd className="bg-FF profileRightSec">
                                                                        {hrUpdateData?.healthInsuranceType}
                                                                    </dd>
                                                                </dl>
                                                            </div>
                                                            <div className='col-md 6 pe-0'>
                                                                <dl className="profileHead">
                                                                    <dt className="width200 bg-Fa profileLeftSec">
                                                                        Health Insurance No
                                                                    </dt>
                                                                    <dd className="bg-FF profileRightSec">
                                                                        {hrUpdateData?.insuranceNo}
                                                                    </dd>
                                                                </dl>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="Qualifications2" className='p-0 border'>
                                                    <div className='mt-3'>
                                                        <div className='col-sm-12 px-3 row mb-3'>
                                                            <div className='border-bottom siteColor sectionHead mb-2 p-0'>Qualifications</div>
                                                            <div className='col-md-6 ps-0'>
                                                                <dl className="profileHead">
                                                                    <dt className="col-md-5 bg-Fa profileLeftSec">
                                                                        Highest school diploma
                                                                    </dt>
                                                                    <dd className="col-md-7 bg-FF profileRightSec">
                                                                        {hrUpdateData?.highestSchoolDiploma}
                                                                    </dd>
                                                                </dl>
                                                                <dl className="profileHead">
                                                                    <dt className="col-md-5 bg-Fa profileLeftSec">
                                                                        Other qualifications
                                                                    </dt>
                                                                    <dd className="col-md-7 bg-FF profileRightSec">
                                                                        {hrUpdateData?.otherQualifications}
                                                                    </dd>
                                                                </dl>
                                                            </div>

                                                            <div className='col-md-6 pe-0'>
                                                                <dl className="profileHead">
                                                                    <dt className="col-md-5 bg-Fa profileLeftSec">
                                                                        Highest vocational education
                                                                    </dt>
                                                                    <dd className="col-md-7 bg-FF profileRightSec">
                                                                        {hrUpdateData?.highestVocationalEducation}
                                                                    </dd>
                                                                </dl>
                                                                <dl className="profileHead">
                                                                    <dt className="col-md-5 bg-Fa profileLeftSec">
                                                                        Languages
                                                                    </dt>
                                                                    <dd className="col-md-7 bg-FF profileRightSec">
                                                                        {hrUpdateData?.Languages}
                                                                    </dd>
                                                                </dl>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </div>
                        </div>

                        <div className="tab-pane" id="CONTRACTS" role="tabpanel" aria-labelledby="CONTRACTS">
                            <div className='siteBdrBottom mb-1'>Contract Details</div>
                            <div className='Alltable'>

                                <GlobalCommanTable columns={columns} data={contractData} showHeader={true} callBackData={callBackData} />
                            </div>
                        </div>
                    </div>
                </div> : <Information EmployeeData={EmployeeData} siteTaggedHR={siteTaggedHR} />}
                {EditContactStatus ? <HHHHEditComponent props={EmployeeData} callBack={ClosePopup} /> : null}
            </div>
        </myContextValue.Provider>

    )
}
export default EmployeProfileMain


