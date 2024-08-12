import * as React from "react";
import { useState } from 'react';
import { Web } from 'sp-pnp-js';
import EditContactPopup from "../../hhhcontact/components/EditContactPopup";
import { Col, Container, Row } from "react-bootstrap";
import { SpaOutlined } from "@mui/icons-material";
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


                <section className="alignCenter border-bottom pb-2">
                    <div>
                        <img className="user-dp" src={Contacts?.ItemCover === undefined || Contacts?.ItemCover === null || Contacts?.ItemCover?.Url === undefined || Contacts?.ItemCover?.Url === null ? `${MainSiteUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg` : Contacts?.ItemCover?.Url} alt="User" />
                        <a href="javascript:void(0)" className="alignCenter justify-content-center" onClick={() => EditItem()}>
                            <span className="svg__iconbox svg__icon--edit hreflink"></span>
                            Edit Profile
                        </a>
                    </div>
                    <div className="w-100 ms-4">
                        <div className="alignCenter">
                            <h2 className="mb-2 ms-0 heading">
                                {Contacts?.FirstName}&nbsp;{Contacts?.Title} <span>{Contacts?.Suffix !== null && Contacts?.Suffix !== undefined && Contacts?.Suffix !== '' ? `(${Contacts?.Suffix})` : ''}</span>
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
                <section>
                    <Col className="mt-3">
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
                                <div className="infocontent-pannel"><a href="mailto:{{Contacts?.Email}}">{Contacts?.Email}</a></div>

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
                                <span>{Contacts?.WorkAddress}</span>
                            </Col>
                            <Col md={6} className="ps-0">
                                <span className="f-20"> <FaCity title="City" /></span>
                                <span> {Contacts?.WorkCity}</span>
                            </Col>

                        </Row>
                        <Row className=" mt-1">
                            <Col md={6} className="ps-0">
                                <span className="f-20"> <FaGlobe title="Webpage" /></span>
                                <span> <a href={Contacts?.WebPage?.Url} target="_blank">{Contacts?.WebPage?.Url}</a></span>
                            </Col>
                            <Col md={6} className="ps-0">
                                <span className="f-20"> <BsSkype /></span>
                                <span> <a href={Contacts?.IM} target="_blank">{Contacts?.IM}</a></span>
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

            </Container>
            {openEditpopup && (<EditContactPopup Context={props?.props?.Context} props={Contacts} allListId={allListId} EditCallBackItemProfile={EditCallBackItemProfile} page={"ContactProfile"}></EditContactPopup>)}
        </>
    );
}
export default ContactProfileComponent;
