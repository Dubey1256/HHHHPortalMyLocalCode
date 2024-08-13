import * as React from "react";
import { useState } from 'react';
import { Web } from 'sp-pnp-js';
import EditContactPopup from "../../hhhcontact/components/EditContactPopup";
import { Col, Container, Row } from "react-bootstrap";
import { SpaOutlined } from "@mui/icons-material";
import "bootstrap/js/dist/tab.js";
import { IoMdMail } from "react-icons/io";
import { FaCity, FaFax, FaAddressCard, FaGlobe } from "react-icons/fa";
import { FaSquarePhone } from "react-icons/fa6";
import { BsSkype } from "react-icons/bs";
let allListId: any = {};
const ContactProfileComponent = (props: any) => {
    const baseUrl = props?.props?.Context?.pageContext?._web?.absoluteUrl;
    const MainSiteUrl = props?.props?.Context?.pageContext?.site?.absoluteUrl;
    let webs = new Web(baseUrl);
    const [Contacts, setContacts] = useState(null);
    const [Masterdata, setMasterdata] = React.useState<any>({});
    const [openEditpopup, setopenEditpopup] = useState(false)

    React.useEffect(() => {
        allListId = {
            TeamContactSearchlistIds: props?.props?.TeamContactSearchlistIds,
            TeamSmartMetadatalistIds: props?.props?.TeamSmartMetadatalistIds,
            baseUrl: baseUrl,
            Context: props?.props?.Context
        }
        loadContacts()
    }, [])

    function getParameterByName(name: string) {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(name) || '';
    }

    const loadContacts = async () => {
        try {
            const itemId = getParameterByName('contactId');
            const data = await webs.lists.getById(allListId?.TeamContactSearchlistIds).items.select("WorkCity", "Id", "WorkCountry", "WorkAddress", "Email", "FullName", "ItemCover", "Attachments", "Company", "JobTitle", "FirstName", "Title", "Suffix", "WebPage", "IM", "ol_Department", "WorkPhone", "CellPhone", "HomePhone", "WorkZip", "Office", "Comments", "WorkFax", "Created", "Modified", "Author/Name", "Author/Title", "Editor/Name", "Editor/Title")
                .expand("Author", "Editor")
                .orderBy("Created", false)
                .filter(`Id eq '${itemId}'`)
                .get();

            if (data && data.length > 0) {
                setContacts(data[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const EditItem = () => {
        setopenEditpopup(true)
    }
    const EditCallBackItemProfile = (updatedData: any) => {
        if (updatedData != "close")
            setContacts(updatedData);
        setopenEditpopup(false)
    }

    return (
        <>
            <Container>
                <section>
                    <div className="sp-breadcrumbv">
                        <ul className="spfxbreadcrumb mb-2 ms-2 mt-16 p-0">
                            <li>
                                <a data-interception="off" target="_blank" href={`${allListId?.baseUrl}/Sitepages/contacts-search.aspx`}>
                                    Contact Database
                                </a>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="border-bottom d-flex pb-2">
                    <div>
                        <img className="user-dp" src={Contacts?.ItemCover === undefined || Contacts?.ItemCover === null || Contacts?.ItemCover?.Url === undefined || Contacts?.ItemCover?.Url === null ? `${MainSiteUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg` : Contacts?.ItemCover?.Url} alt="User" />
                        
                    </div>
                    <div className="w-100 ms-4">
                        <div className="alignCenter">
                            <h2 className="d-flex heading m-0 mb-2 ms-0 ">
                                {Contacts?.FirstName} &nbsp; {Contacts?.Title} <span className="me-1">{Contacts?.Suffix !== null && Contacts?.Suffix !== undefined && Contacts?.Suffix !== '' ? `(${Contacts?.Suffix})` : ''}</span>  
                                <a href="javascript:void(0)" className="alignCenter justify-content-center" onClick={() => EditItem()}>
                                <span className="alignIcon hreflink svg__icon--edit svg__iconbox"></span>   </a>
                            </h2>
                        </div>
                        <section>
                            <Row className="profileHead">
                                <Col md={3} className="bg-Fa profileLeftSec">Organization</Col>
                                <Col md={9} className="bg-Ff profileRightSec">{Contacts?.Company}</Col>
                            </Row>
                            <Row className="profileHead">
                                <Col md={3} className="bg-Fa profileLeftSec">Department</Col>
                                <Col md={9} className="bg-Ff profileRightSec">{Contacts?.ol_Department}</Col>
                            </Row>
                            <Row className="profileHead">
                                <Col md={3} className="bg-Fa profileLeftSec">Job Title</Col>
                                <Col md={9} className="bg-Ff profileRightSec">{Contacts?.JobTitle}</Col>
                            </Row>

                        </section>

                    </div>
                </section>
                <section className="my-3">
                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button className="nav-link active" id="General-Information" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">General Information</button>
                            <button className="nav-link" id="Communication-Account" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Communication Account</button>

                        </div>
                    </nav>
                    <div className="border border-top-0 clearfix p-3 tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="General-Information">
                            <section>
                                <Col className="mt-2">
                                    <Row>
                                        <h2 className="siteBdrBottom siteColor sectionHead ps-0 mb-2">Contact Information</h2>
                                        <Col md={6} className="ps-0">
                                            <span className="f-20">
                                                <FaSquarePhone />
                                            </span>

                                            <span className="infocontent-pannel" >{Contacts?.WorkPhone}</span>

                                        </Col>
                                        <Col md={6} className="ps-0">
                                            <span className="f-20">
                                                <FaSquarePhone title="Mobile Number" />
                                            </span>

                                            <span className="infocontent-pannel"> {Contacts?.CellPhone}</span>
                                        </Col>
                                    </Row>
                                    <Row className="mt-1">
                                        <Col md={6} className="ps-0">
                                            <span className="f-20">
                                                <IoMdMail title="mail" />
                                            </span>
                                            <span className="infocontent-pannel"><a className="hyperlink" href="mailto:{{Contacts?.Email}}"> {Contacts?.Email} </a></span>

                                        </Col>
                                        <Col md={6} className="ps-0">
                                            <span className="f-20">
                                                <FaFax title="Fax" /> 
                                            </span>
                                            <span className="infocontent-pannel"> {Contacts?.WorkFax}</span>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="mt-2">
                                    <Row>
                                        <h2 className="siteBdrBottom siteColor sectionHead ps-0 mb-2">Address Information</h2>
                                        <Col md={6} className="ps-0">
                                            <span className="f-20"> <FaAddressCard /></span>
                                            <span className="infocontent-pannel">{Contacts?.WorkAddress}</span>
                                        </Col>
                                        <Col md={6} className="ps-0">
                                            <span className="f-20"> <FaCity title="City" /></span>
                                            <span className="infocontent-pannel"> {Contacts?.WorkCity}</span>
                                        </Col>

                                    </Row>
                                    <Row className=" mt-1">
                                        <Col md={6} className="ps-0">
                                            <span className="f-20"> <FaGlobe title="Webpage" /></span>
                                            <span className="infocontent-pannel"> <a className="hyperlink" href={Contacts?.WebPage?.Url} target="_blank">{Contacts?.WebPage?.Url}</a></span>
                                        </Col>
                                        <Col md={6} className="ps-0">
                                            <span className="f-20"> <BsSkype /></span>
                                            <span className="infocontent-pannel"> <a href={Contacts?.IM} target="_blank" className="hyperlink">{Contacts?.IM}</a></span>
                                        </Col>

                                    </Row>
                                </Col>
                                <Col className="my-2">
                                    <Row>
                                        <h2 className="siteBdrBottom siteColor sectionHead ps-0 mb-2">Notes</h2>
                                        <div><p><span>{Contacts?.Comments}</span></p></div>

                                    </Row>
                                </Col>
                            </section>
                        </div>
                        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="Communication-Account">
                            <p>Show information if user is added as External User / Internal User in ADContact column.
                                if not available, then start workflow to generate access
                                Invitation button (external)</p>
                        </div>

                    </div>
                </section>






            </Container>
            {openEditpopup && (<EditContactPopup Context={props?.props?.Context} props={Contacts} allListId={allListId} EditCallBackItemProfile={EditCallBackItemProfile} page={"ContactProfile"}></EditContactPopup>)}
        </>
    );
}
export default ContactProfileComponent;
