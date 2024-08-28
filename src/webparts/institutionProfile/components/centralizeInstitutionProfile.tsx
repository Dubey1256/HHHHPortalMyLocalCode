import * as React from "react";
import { useState } from 'react';
import { Web } from 'sp-pnp-js';
import EditInstitutionPopup from "../../hhhcontact/components/EditInstitutionPopup";
import { Contacts } from "@material-ui/icons";
import { Col, Container, Row } from "react-bootstrap";
import { BsGlobe2, BsSkype } from "react-icons/bs";
import { FaHome, FaFax, FaCity, FaGlobe } from "react-icons/fa";
import { FaSquarePhone, FaMapLocationDot } from "react-icons/fa6";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { IoMdMail } from "react-icons/io";
import { MdContactPhone } from "react-icons/Md";
import { SlLocationPin } from "react-icons/sl";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
let allListId: any = {};
const InstitutionProfileComponent = (props: any) => {
    const baseUrl = props?.props?.Context?.pageContext?._web?.absoluteUrl;
    const MainSiteUrl = props?.props?.Context?.pageContext?.site?.absoluteUrl;
    let webs = new Web(baseUrl);
    const [Institutions, setInstitutions] = useState(null);
    const [openEditpopup, setopenEditpopup] = useState(false)
    let Mainwebs = new Web(baseUrl);
    let subsite = props?.props?.siteUrl.split('/')[5].toLowerCase()

    React.useEffect(() => {
        allListId = {
            TeamContactSearchlistIds: props?.props?.TeamContactSearchlistIds,
            TeamInstitutionlistIds: props?.props?.TeamInstitutionlistIds,
            TeamSmartMetadatalistIds: props?.props?.TeamSmartMetadatalistIds,
            MainsiteUrl: props?.props?.MainsiteUrl,
            Context: props?.props?.Context,
            baseUrl: props?.props?.siteUrl
        }
        loadInstitutions()
    }, [])

    function getParameterByName(name: string) {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(name) || '';
    }

    const loadInstitutions = async () => {
        const itemId = getParameterByName('InstitutionId');
        let listId: any
        let listUrl: any
        let query: any
        listUrl = Mainwebs
        listId = allListId?.TeamInstitutionlistIds
        query = `Id eq ${itemId}`;

        try {
            const data = await listUrl.lists.getById(listId).items.select("Site", "LinkedIn", "Instagram", "Facebook", "Twitter", "WorkCity", "Id", "WorkCountry", "WorkAddress", "Email", "FullName", "Company", "JobTitle", "FirstName", "Title", "WorkPhone", "CellPhone", "HomePhone", "WorkZip", "Comments", "WorkFax", "Created", "Modified", "Author/Name", "Author/Title", "Editor/Name", "Editor/Title")
                .expand("Author", "Editor")
                .orderBy("Created", false)
                .filter(query)
                .get();

            if (data && data.length > 0) {
                setInstitutions(data[0]);
            }
        } catch (error) {
            console.error(error);
        } ``
    };
    const EditItem = () => {
        setopenEditpopup(true)
    }
    const EditCallBackItemProfile = (updatedData: any) => {
        setInstitutions(updatedData);
        setopenEditpopup(false)
    }
    const closeEditInstitutionPopup = () => {
        setopenEditpopup(false)
    }

    return (
        <>
            <Container>
                <section>
                    <div className="sp-breadcrumbv">
                        <ul className="spfxbreadcrumb mb-2 ms-2 mt-16 p-0">
                            <li>
                                <a target="_blank"
                                    rel="noopener"
                                    data-interception="off">
                                    <FaHome />{" "}
                                </a>
                            </li>
                            <li>
                                <a data-interception="off" target="_blank" href={`${allListId?.baseUrl}/Sitepages/contacts-search.aspx`}>
                                    Contact Database
                                </a>
                            </li>
                            <li>
                                <a>{Institutions?.FullName}</a>
                            </li>
                        </ul>
                    </div>
                </section>
                <section className="border-bottom d-flex pb-2">
                    <div>
                        <img className="user-dp" src={Institutions?.ItemCover === undefined || Institutions?.ItemCover === null || Institutions?.ItemCover?.Url === undefined || Institutions?.ItemCover?.Url === null ? `${MainSiteUrl}/SiteCollectionImages/ICONS/32/InstitutionPicture.jpg` : Institutions?.ItemCover?.Url} alt="User" />

                    </div>
                    <div className="w-100 ms-4">
                        <div className="alignCenter">
                            <h2 className="d-flex heading m-0 mb-2 ms-0 ">
                                {Institutions?.FullName} <span className="me-1">{Institutions?.Suffix !== null && Institutions?.Suffix !== undefined && Institutions?.Suffix !== '' ? `(${Institutions?.Suffix})` : ''}</span>
                                <a href="javascript:void(0)" className="alignCenter justify-content-center" onClick={() => EditItem()}>
                                    <span className="alignIcon hreflink svg__icon--edit svg__iconbox"></span>   </a>
                            </h2>
                        </div>
                        <section>
                            <Row className="profileHead">
                                <Col md={3} className="bg-Fa profileLeftSec">Email</Col>
                                <Col md={9} className="bg-Ff profileRightSec">{Institutions?.Email}</Col>
                            </Row>
                            <Row className="profileHead">
                                <Col md={3} className="bg-Fa profileLeftSec">City</Col>
                                <Col md={9} className="bg-Ff profileRightSec">{Institutions?.WorkCity}</Col>
                            </Row>
                            <Row className="profileHead">
                                <Col md={3} className="bg-Fa profileLeftSec">Country</Col>
                                <Col md={9} className="bg-Ff profileRightSec">{Institutions?.WorkCountry}</Col>
                            </Row>

                        </section>
                    </div>
                </section>
                <section className="my-3">
                    <section>
                        <Col className="mt-2">
                            <Row>
                                <h2 className="siteBdrBottom siteColor sectionHead ps-0 mb-2">Institution Information</h2>
                                <Col md={6} className="ps-0">
                                    <span className="f-20">
                                        <FaSquarePhone />
                                    </span>
                                    <span className="infocontent-pannel" >{Institutions?.WorkPhone}</span>
                                </Col>
                                <Col md={6} className="ps-0">
                                    <span className="f-20">
                                        <FaSquarePhone title="Mobile Number" />
                                    </span>
                                    <span className="infocontent-pannel"> {Institutions?.CellPhone}</span>
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col md={6} className="ps-0">
                                    <span className="f-20">
                                        <FaFax title="Fax" />
                                    </span>
                                    <span className="infocontent-pannel"> {Institutions?.WorkFax}</span>
                                </Col>
                                <Col md={6} className="ps-0">
                                    <span className="f-20"> <BsSkype /></span>
                                    <span className="infocontent-pannel"> <a href={Institutions?.IM} target="_blank" className="hyperlink">{Institutions?.IM}</a></span>
                                </Col>
                            </Row>
                            <Row className="mt-1">
                                <Col md={6} className="ps-0">
                                    <span className="f-20">
                                        <MdContactPhone title="HomePhone" />
                                    </span>
                                    <span className="infocontent-pannel">{Institutions?.HomePhone} </span>

                                </Col>
                                <Col md={6} className="ps-0">
                                    <span className="f-20">
                                        <FaMapLocationDot title="WorkZip" />
                                    </span>
                                    <span className="infocontent-pannel"> {Institutions?.WorkZip}</span>
                                </Col>
                            </Row>
                        </Col>
                        {/* <Col className="mt-2">
                            <Row>
                                <h2 className="siteBdrBottom siteColor sectionHead ps-0 mb-2">Address Information</h2>
                                <Col md={6} className="ps-0">
                                    <span className="f-20"> <SlLocationPin /></span>
                                    <span className="infocontent-pannel">{Institutions?.WorkAddress}</span>
                                </Col>
                                <Col md={6} className="ps-0">
                                    <span className="f-20"> <HiBuildingOffice2 title="City" /></span>
                                    <span className="infocontent-pannel"> {Institutions?.Office}</span>
                                </Col>
                            </Row>   
                            <Row>                                     
                                <Col md={6} className="ps-0">
                                    <span className="f-20"> <FaGlobe title="Webpage" /></span>
                                    <span className="infocontent-pannel"> <a className="hyperlink" href={Institutions?.WebPage?.Url} target="_blank">{Institutions?.WebPage?.Url}</a></span>
                                </Col>
                            </Row>                    
                        </Col> */}
                        <Col className="mt-2">
                            <Row>
                                <h2 className="siteBdrBottom siteColor sectionHead ps-0 mb-2">Social Media Information</h2>
                                <Col md={6} className="ps-0">
                                    <span className="f-20"> <FaInstagramSquare /></span>
                                    <span className="infocontent-pannel">{Institutions?.Instagram?.Url}</span>
                                </Col>
                                <Col md={6} className="ps-0">
                                    <span className="f-20"> <FaFacebook /></span>
                                    <span className="infocontent-pannel"> {Institutions?.Facebook?.Url}</span>
                                </Col>
                            </Row>
                            <Row className=" mt-1">
                                <Col md={6} className="ps-0">
                                    <span className="f-20"> <FaLinkedin /></span>
                                    <span className="infocontent-pannel">{Institutions?.LinkedIn?.Url}</span>
                                </Col>
                                <Col md={6} className="ps-0">
                                    <span className="f-20"> <FaTwitterSquare /></span>
                                    <span className="infocontent-pannel"> {Institutions?.Twitter?.Url}</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="my-2">
                            <Row>
                                <h2 className="siteBdrBottom siteColor sectionHead ps-0 mb-2">Notes</h2>
                                <div><p><span>{Institutions?.Comments}</span></p></div>
                            </Row>
                        </Col>
                    </section>
                </section>
            </Container>
            {openEditpopup && (<EditInstitutionPopup Context={props?.props?.Context} props={Institutions} allListId={allListId} EditCallBackItemProfile={EditCallBackItemProfile} page={"InstitutionProfile"} closeEditInstitutionPopup={() => { closeEditInstitutionPopup() }}></EditInstitutionPopup>)}
        </>
    );
}
export default InstitutionProfileComponent;
