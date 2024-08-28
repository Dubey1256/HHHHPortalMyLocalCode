import * as React from 'react';
import pnp, { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
import ImagesC from '../../EditPopupFiles/ImageInformation'
import HtmlEditorCard from '../../../globalComponents/HtmlEditor/HtmlEditor';
import moment from 'moment';
import CountryContactEditPopup from './CountryContactEditPopup';
import { useState } from 'react';
let JointData: any = [];
const EditInstitutionPopup = (props: any) => {
    const [SelecteditInstitution, setSelecteditInstitution] = useState(true)
    const [imagetab, setImagetab] = React.useState(false);
    const [OpenDivision, setOpenDivision] = React.useState(false);
    const [divisionTitle, setDivisionTitle] = React.useState("");
    const [URLs, setURLs] = React.useState([]);
    let AllCountryData: any = React.useRef()
    const [countryData, setCountryData] = React.useState([]);
    const [status, setStatus] = React.useState({ countryPopup: false });
    const [currentCountry, setCurrentCountry]: any = React.useState([])
    const [updateData, setUpdateData]: any = React.useState({});
    let callBack = props?.callBack;
    React.useEffect(() => {
        getSmartMetaData();

    }, [])

    const jointInstitutionDetails = async (id: any) => {
        try {
            let web = new Web(props?.allListId?.baseUrl);
            await web.lists.getById(props?.allListId?.TeamInstitutionlistIds)
                .items.getById(id)
                .select("Id", "LinkedIn", "Instagram", "Facebook", "Twitter", "Title", "FirstName", "Description", "FullName", "WorkPhone", "SmartCountries/Id", "SmartCountries/Title", "Company", "JobTitle", "About", "InstitutionType", "SocialMediaUrls", "ItemType", "WorkCity", "ItemImage", "WorkCountry", "WorkAddress", "WebPage", "CellPhone", "HomePhone", "Email", "SharewebSites", "Created", "Author/Id", "Author/Title", "Modified", "Editor/Id", "Editor/Title")
                .expand("Author", "Editor", "SmartCountries")
                .get().then((data: any) => {
                    setUpdateData(data);
                }).catch((error: any) => {
                    console.log(error)
                });
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    const openCountry = (item: any) => {
        setStatus({
            ...status,
            countryPopup: true,
        })
    }
    const onRenderCustomHeaderEditInstitution = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                    <img className='workmember'
                        src={updateData?.ItemImage != undefined ? updateData?.ItemImage.Url : `${props?.allListId?.MainsiteUrl}/SiteCollectionImages/ICONS/32/InstitutionPicture.jpg`}
                    />
                    Edit Institution- {updateData?.FullName}

                </div>
            </>
        );
    };

    //***************image information call back Function***********************************/
    function imageta() {
        setImagetab(true);
    }
    const imageTabCallBack = React.useCallback((data: any) => {
        console.log(updateData);
        console.log(data);
    }, []);

    // *****************End image call back function**********************************

    const HtmlEditorCallBack = (items: any) => {
        console.log(items);
        var description = ""
        if (items == '<p></p>\n') {
            description = ""
        } else {
            description = items
        }
        setUpdateData({ ...updateData, Description: description })
    }

    const HtmlEditorCallBackAbout = (items: any) => {
        console.log(items);
        var About = ""
        if (items == '<p></p>\n') {
            About = ""
        } else {
            About = items
        }
        setUpdateData({ ...updateData, About: About })
    }

    //*******************Delete function***************************  */
    const deleteUserDtl = async () => {
        try {
            if (confirm("Are you sure, you want to delete this?")) {
                let web = new Web(props?.allListId?.baseUrl);
                await web.lists.getById(props?.allListId?.TeamInstitutionlistIds).items.getById(updateData?.Id).recycle().then(async (data: any) => {
                }).catch(async (error: any) => {
                    console.log(error)

                });
                closeContactPopup();
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }

    //****************End Delete Function****************** */



    //*****************Save for Joint Data Update***************************************** */
    const UpdateDetails = async () => {
        let urlData: any;
        if (updateData?.WebPage != undefined) {
            let spliceString = updateData?.WebPage?.Description?.slice(0, 8)
            if (spliceString == "https://") {
                urlData = updateData?.WebPage?.Description;
            } else {
                urlData = "https://" + updateData?.Description;
            }
        }
        try {

            let postData: any = {
                Title: (updateData?.Title),
                FullName: (updateData?.FullName),
                Categories: updateData?.Categories,
                Email: (updateData?.Email),
                WorkPhone: (updateData?.WorkPhone),
                CellPhone: (updateData?.CellPhone),
                InstitutionType: updateData?.InstitutionType,
                WorkCity: (updateData?.WorkCity),
                WorkCountry: updateData?.WorkCountry,
                WorkAddress: (updateData?.WorkAddress),
                Description: updateData?.Description,
                About: updateData?.About,
                WebPage: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: updateData?.WebPage ? urlData : (updateData?.WebPage ? updateData?.WebPage?.Url : null),
                    Url: updateData?.WebPage ? urlData : (updateData?.WebPage ? updateData?.WebPage.Url : null)
                },
                LinkedIn: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: updateData?.LinkedIn && updateData?.LinkedIn?.Url ? updateData?.LinkedIn?.Url : null,
                    Url: updateData?.LinkedIn && updateData?.LinkedIn?.Url ? updateData?.LinkedIn?.Url : null,
                },
                Instagram: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: updateData?.Instagram && updateData?.Instagram?.Url ? updateData?.Instagram?.Url : null,
                    Url: updateData?.Instagram && updateData?.Instagram?.Url ? updateData?.Instagram?.Url : null,
                },
                Facebook: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: updateData?.Facebook && updateData?.Facebook?.Url ? updateData?.Facebook?.Url : null,
                    Url: updateData?.Facebook && updateData?.Facebook?.Url ? updateData?.Facebook?.Url : null,
                },
                Twitter: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: updateData?.Twitter && updateData?.Twitter?.Url ? updateData?.Twitter?.Url : null,
                    Url: updateData?.Twitter && updateData?.Twitter?.Url ? updateData?.Twitter?.Url : null,
                },
                WorkZip: (updateData?.WorkZip),
                SmartCountriesId: {
                    results: updateData?.SmartCountries?.length > 0 ? [updateData?.SmartCountries[0]?.Id] : []
                }
            }
            if (updateData?.Id != undefined) {
                let web = new Web(props?.allListId?.baseUrl);
                await web.lists.getById(props?.allListId?.TeamInstitutionlistIds).items.getById(updateData?.Id).update(postData).then((e) => {
                    console.log("Your information has been updated successfully");
                    closeContactPopup();
                });

            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }


    //***********samrt Meta data call function To get The country data ********************* */
    const getSmartMetaData = async () => {
        let countryData: any = [];
        try {
            let web = new Web(props?.allListId?.baseUrl);
            let data = await web.lists.getById(props?.allListId?.TeamSmartMetadatalistIds)
                .items.top(4999).get()
            data.map((item: any, index: any) => {
                if (item.TaxType == "Countries") {
                    countryData.push(item)
                }
            })
            AllCountryData.current = countryData;
            setCountryData(countryData);
            jointInstitutionDetails(props.props.Id);
        } catch (error) {
            console.log("Error:", error.message);
        }

    }
    //************samrt Meta  End function ************* */
    const CloseCountryPopup = React.useCallback((data: any) => {
        setStatus({ ...status, countryPopup: false })
        // setCountryPopup(false);
        if (data != undefined) {
            setUpdateData(data);
        }
    }, []);
    const closeContactPopup = () => {
        setSelecteditInstitution(false)
        props.closeEditpoup()
        props.closeEditInstitutionPopup()   
    };

    return (
        <>
            <Panel onRenderHeader={onRenderCustomHeaderEditInstitution}
                isOpen={true}
                type={PanelType.custom}
                customWidth="1280px"
                onDismiss={() => closeContactPopup()}
                isBlocking={false}
            >
                <div>
                    <div className="modal-body mb-5">
                        <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                            <button className="nav-link active"
                                id="BASIC-INFORMATION"
                                data-bs-toggle="tab"
                                data-bs-target="#BASICINFORMATION"
                                type="button"
                                role="tab"
                                aria-controls="BASICINFORMATION"
                                aria-selected="true">BASIC INFORMATION</button>
                            <button className="nav-link"
                                id="IMAGE-INFORMATION"
                                data-bs-toggle="tab"
                                data-bs-target="#IMAGEINFORMATION"
                                type="button"
                                role="tab"
                                aria-controls="IMAGEINFORMATION"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    imageta()
                                }}
                                aria-selected="true">IMAGE INFORMATION
                            </button>
                        </ul>

                        <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                            <div className="tab-pane show active" id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">
                                <div className='general-section'>
                                    <div className="card-body">
                                        <div className="user-form-5 row">
                                            <div className="col">
                                                <div className='input-group'>
                                                    <label className='full-width label-form'>Title </label>
                                                    <input type="text" className="form-control" defaultValue={updateData ? updateData?.FullName : null} onChange={(e) => setUpdateData({ ...updateData, FullName: e.target.value })} aria-label="full name" placeholder='full Name' />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className='input-group'>
                                                    <label className="full-width label-form">Email</label>
                                                    <input type="text" className="form-control" defaultValue={updateData?.Email ? updateData?.Email : ""}
                                                        onChange={(e) => setUpdateData({ ...updateData, Email: e.target.value })} aria-label="Email" />
                                                </div></div>
                                            <div className="col">
                                                <div className='input-group'>
                                                    <label className="full-width label-form"> Categories</label>
                                                    <input type="text" className="form-control" defaultValue={updateData?.Categories} onChange={(e) => setUpdateData({ ...updateData, Categories: e.target.value })} aria-label="Last name" placeholder='Last name' />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className='input-group'>
                                                    <label className="full-width label-form">City</label>
                                                    <input type="text" className="form-control" defaultValue={updateData?.WorkCity ? updateData?.WorkCity : ''} onChange={(e) => setUpdateData({ ...updateData, WorkCity: e.target.value })} aria-label="City" />
                                                </div></div>
                                        </div>
                                        <div className="card-body">
                                            <div className="user-form-4 row">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label htmlFor="WorkCountry" className='full-width form-label'>Country</label>
                                                        <input type="text" id="WorkCountry" className="form-control" defaultValue={updateData.WorkCountry} onInput={(e: any) => setUpdateData({ ...updateData, WorkCountry: e.target.value ? e.target.value : "" })} />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Address</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.WorkAddress ? updateData?.WorkAddress : ''} onChange={(e) => setUpdateData({ ...updateData, WorkAddress: e.target.value })} aria-label="Address" />
                                                    </div></div>

                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Institution Type</label>

                                                        <input className="form-control" type="text" defaultValue={updateData?.InstitutionType ? updateData?.InstitutionType : ""} onChange={(e) => setUpdateData({ ...updateData, InstitutionType: e.target.value })} aria-label="InstitutionType" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Website</label>

                                                        <input className="form-control" type="text" defaultValue={updateData?.WebPage ? updateData?.WebPage.Url : ""} onChange={(e) => setUpdateData({ ...updateData, WebPage: e.target.value })} aria-label="WebPage" />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="user-form-5 row">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Phone</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.WorkPhone ? updateData?.WorkPhone : ''} onChange={(e) => setUpdateData({ ...updateData, WorkPhone: e.target.value })} aria-label="Business Phone" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Primary Contact</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.CellPhone ? updateData?.CellPhone : ''} onChange={(e) => setUpdateData({ ...updateData, CellPhone: e.target.value })} aria-label="Mobile-No" />
                                                    </div></div>
                                                <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">LinkedIn</label>
                                                        <input className="form-control" type="text" defaultValue={updateData?.LinkedIn ? updateData?.LinkedIn.Url : ""} onChange={(e) => setUpdateData({ ...updateData, LinkedIn: e.target.value })} aria-label="LinkedIn" />
                                                    </div>
                                                </div>
                                                <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Facebook</label>
                                                        <input className="form-control" type="text" defaultValue={updateData?.Facebook ? updateData?.Facebook.Url : ""} onChange={(e) => setUpdateData({ ...updateData, Twitter: e.target.value })} aria-label="Facebook" />
                                                    </div></div>
                                            </div>
                                            <div className="user-form-5 row mt-2">
                                                <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Instagram</label>
                                                        <input className="form-control" type="text" defaultValue={updateData?.Instagram ? updateData?.Instagram.Url : ""} onChange={(e) => setUpdateData({ ...updateData, Instagram: e.target.value })} aria-label="Instagram" />
                                                    </div></div>
                                                <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Twitter</label>
                                                        <input className="form-control" type="text" defaultValue={updateData?.Twitter ? updateData?.Twitter.Url : ""} onChange={(e) => setUpdateData({ ...updateData, Twitter: e.target.value })} aria-label="Twitter" />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <div className="col" >
                                                <div className='input-group'>
                                                    <label className="full-width label-form">Internal Notes</label>
                                                    {updateData?.Id != undefined ? <HtmlEditorCard editorValue={updateData?.Description != null ? updateData?.Description : ""} HtmlEditorStateChange={HtmlEditorCallBack} /> : null}
                                                </div></div>
                                        </div>

                                        <div className="card-body">
                                            <div className="col" >
                                                <div className='input-group'>
                                                    <label className="full-width label-form">About (public information)</label>
                                                    {updateData?.Id != undefined && <HtmlEditorCard editorValue={updateData?.About != null ? updateData?.About : ""} HtmlEditorStateChange={HtmlEditorCallBackAbout} />}
                                                </div></div>
                                        </div> </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="IMAGEINFORMATION" role="tabpanel" aria-labelledby="IMAGEINFORMATION">
                                <div className="row col-sm-12">
                                    {imagetab && (
                                        <ImagesC
                                            EditdocumentsData={updateData}
                                            setData={setUpdateData}
                                            AllListId={props?.allListId}
                                            Context={props?.allListId?.Context}
                                            callBack={imageTabCallBack}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <footer className='bg-f4 fixed-bottom'>
                            <div className='align-items-center d-flex justify-content-between me-3 px-4 py-2'>
                                <div>
                                    {console.log("footerdiv")}
                                    <div><span className='pe-2'>Created</span><span className='pe-2'> {updateData?.Created ? moment(updateData?.Created).format("DD/MM/YYYY") : ''}&nbsp;By</span><span><a>{updateData?.Author ? updateData?.Author?.Title : ''}</a></span></div>
                                    <div><span className='pe-2'>Last modified</span><span className='pe-2'> {updateData?.Modified ? moment(updateData?.Modified).format("DD/MM/YYYY") : ''}&nbsp;By</span><span><a>{updateData?.Editor ? updateData?.Editor.Title : ''}</a></span></div>
                                    <div className='alignCenter'><span
                                        onClick={deleteUserDtl}
                                        className="svg__iconbox svg__icon--trash hreflink"></span>Delete this item</div>
                                </div>

                                <div>
                                    {props.allSite?.MainSite && <span>
                                        <a className="ForAll hreflink" target="_blank" data-interception="off"
                                            href={`${props?.allListId?.baseUrl}/SitePages/Institution-Profile.aspx?InstitutionId=${updateData.Id}`}>
                                            <img className="mb-3 icon_siz19" style={{ marginRight: '3px' }}
                                                src="/_layouts/15/images/ichtm.gif?rev=23" alt="icon" />Go to Profile page
                                        </a>
                                    </span>}
                                    {props.allSite?.MainSite && <span>|</span>}
                                    <a href={`${props?.allListId?.baseUrl}/Lists/Institutions/EditForm.aspx?ID=${updateData?.Id}`} data-interception="off"
                                        target="_blank">Open out-of-the-box form</a>
                                    <button className='btn btn-primary ms-1  mx-2'
                                        onClick={UpdateDetails}
                                    >
                                        Save
                                    </button>
                                    <button className='btn btn-default' onClick={() => closeContactPopup()}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
                {status.countryPopup ? <CountryContactEditPopup popupName="Country" siteurl={props?.siteurl}
                    selectedCountry={currentCountry}
                    callBack={CloseCountryPopup} data={countryData} updateData={updateData} /> : null}
            </Panel>
        </>
    )
}
export default EditInstitutionPopup
