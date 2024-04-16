import * as React from "react";
import { useState } from 'react';
import { Web } from 'sp-pnp-js';
import EditContactPopup from "../../contactDatabase/components/EditContactPopup";
let allListId: any = {};
const ContactProfileComponent = (props: any) => {
    const baseUrl = props?.props?.Context?.pageContext?._web?.absoluteUrl;
    const MainSiteUrl = props?.props?.Context?.pageContext?.site?.absoluteUrl;
    let webs = new Web(baseUrl);
    const [Contacts, setContacts] = useState(null);
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
            <div className="container">
                <div className="col-sm-12 no-padding smart-folder pagetitle">
                    <ul className="DisplayInline ps-2">
                        <span>
                            <a href={`${baseUrl}/Sitepages/contacts-search.aspx`} ><span id="spnsubtopic">Contact Database </span></a>
                            <span className="right-icon" id="">
                                <span> &gt; {Contacts?.FirstName}&nbsp;{Contacts?.Title} <span>{Contacts?.null !== undefined && Contacts?.Suffix !== undefined && Contacts?.Suffix !== '' ? `(${Contacts?.Suffix})` : ''}</span> </span>
                            </span>
                        </span>
                    </ul>
                </div>
                <table width="100%" style={{ marginTop: '30px' }}>
                    <tbody>
                        <tr>
                            <td>
                                <h2 className="ml-16 heading">{Contacts?.FirstName}&nbsp;{Contacts?.Title} <span>{Contacts?.Suffix !== null && Contacts?.Suffix !== undefined && Contacts?.Suffix !== '' ? `(${Contacts?.Suffix})` : ''}</span> </h2>

                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="leftcol">
                                    <div style={{ lineHeight: '150px', textAlign: 'center' }}>
                                        <img className="img-fluid" src={Contacts?.ItemCover === undefined || Contacts?.ItemCover === null || Contacts?.ItemCover?.Url === undefined || Contacts?.ItemCover?.Url === null ? `${MainSiteUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg` : Contacts?.ItemCover?.Url} alt="User" />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <a href="javascript:void(0)" className="alignCenter justify-content-center" onClick={() => EditItem()}>
                                            <span className="svg__iconbox svg__icon--edit hreflink"></span>
                                            Edit Profile
                                        </a>
                                    </div>
                                    <div className="ms-clear"></div>
                                </div>
                                <div className="rightcol">
                                    <div className="row">
                                        <div className="col-lg-12 infoblock px-0 contact">
                                            <div className="col-lg-3 label">Organization</div>
                                            <div className="col-lg-9 labeltext">{Contacts?.Company}</div>
                                        </div>
                                        <div className="col-lg-12 infoblock px-0 contact">
                                            <div className="col-lg-3 label">Department</div>
                                            <div className="col-lg-9 labeltext">{Contacts?.ol_Department}</div>
                                        </div>
                                        <div className="col-lg-12 infoblock px-0 contact">
                                            <div className="col-lg-3 label">Job Title</div>
                                            <div className="col-lg-9 labeltext">{Contacts?.JobTitle}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <div className="row">
                                            <h2 className="infoheading  px-0">Contact Information</h2>
                                            <div className="col-md-6 ps-0">
                                                <div className="contact-info">
                                                    <div className="contact-dtls">
                                                        <div className="infocontent-pannel" ><img src={`${baseUrl}//PublishingImages/Icons/24/c_Phone_png.jpg`} title="Business Phone" alt="Phone" />{Contacts?.WorkPhone}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 ps-2 pe-0">
                                                <div className="contact-info">
                                                    <div className="contact-dtls">
                                                        <div className="infocontent-pannel"><img src={`${baseUrl}/PublishingImages/Icons/24/icon_Mobile_png.jpg`} title="Mobile Number" alt="Mobile" /> {Contacts?.CellPhone}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col-md-6 ps-0">
                                                <div className="contact-info">
                                                    <div className="contact-dtls">
                                                        <div className="infocontent-pannel"><img title="Email" src={`${baseUrl}/PublishingImages/Icons/24/circle_mail_png.jpg`} /><a href="mailto:{{Contacts?.Email}}">{Contacts?.Email}</a></div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-6 ps-2 pe-0">
                                                <div className="contact-info">
                                                    <div className="contact-dtls">
                                                        <div className="infocontent-pannel"><img title="Fax" src={`${baseUrl}/PublishingImages/Icons/24/icon_Fax_png.jpg`} /> {Contacts?.WorkFax}</div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-md-12 mt-2">
                                        <div className="row">
                                            <h2 className="infoheading  px-0">Address Information</h2>
                                            <div className="col-md-6 ps-0">
                                                <div className="contact-info">
                                                    <div className="contact-dtls">
                                                        <div className="infocontent-pannel"> <img title="Address" src={`${baseUrl}/PublishingImages/Icons/24/c_Venue.png`} />{Contacts?.WorkAddress}</div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-6 ps-2 pe-0">
                                                <div className="contact-info">
                                                    <div className="contact-dtls">
                                                        <div className="infocontent-pannel"><img title="Country" src={`${baseUrl}/PublishingImages/Icons/24/icon_Street_png.jpg`} /> {Contacts?.WorkCity}</div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="row mt-1">
                                            <div className="col-md-6 ps-0">
                                                <div className="contact-info">
                                                    <div className="contact-dtls">
                                                        <div className="infocontent-pannel"><img title="Webpage" src={`${baseUrl}/PublishingImages/Icons/24/icon_Webpage_png.jpg`} />   <a href={Contacts?.WebPage?.Url} target="_blank">{Contacts?.WebPage?.Url}</a></div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-md-6 ps-2 pe-0">
                                                <div className="contact-info">
                                                    <div className="contact-dtls">
                                                        <div className="infocontent-pannel"><img title="Skype" src={`${baseUrl}/PublishingImages/Icons/24/icon_Skype_png.jpg`} /> <a href={Contacts?.IM} target="_blank">{Contacts?.IM}</a></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-md-12 my-2">
                                        <div className="row">
                                            <h2 className="infoheading  px-0">Notes</h2>
                                            <div className="infocontent-pannel"><p className="padL-10 "><span>{Contacts?.Comments}</span></p></div>

                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {openEditpopup && (<EditContactPopup Context={props?.props?.Context} props={Contacts} allListId={allListId} EditCallBackItemProfile={EditCallBackItemProfile} page={"ContactProfile"}></EditContactPopup>)}
        </>
    );
}
export default ContactProfileComponent;