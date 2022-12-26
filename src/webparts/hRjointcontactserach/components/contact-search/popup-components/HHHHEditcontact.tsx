import * as React from 'react';
import OrgContactEditPopup from './orgContactEditPopup';
import CountryContactEditPopup from './CountryContactEditPopup';
import { useState, useEffect, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import { GoRepoPush } from 'react-icons/go';

const HHHHEditComponent = (props: any) => {
    const [status, setStatus] = useState({
        orgPopup: false,
        countryPopup: false,
        userInfo: true
    })
    // const [countryPopup, setCountryPopup] = useState(false);
    const [updateData, setUpdateData] = useState({
        FirstName: '', Title: '', Suffix: '', JobTitle: '', FullName: '', InstitutionName: '', LinkedIn: '', Twitter: '', Facebook: '', Instagram: '', WorkPhone: '', CellPhone: '', HomePhone: '', WorkCity: '', WorkAddress: '', Email: '', Skype: "",
        WebPage: '', WorkZip: '', Country: '', InstitutionId: '', Department: '',
    })
    const [instituteStatus, setInstituteStatus] = useState(false);
    const [SmartCountriesData, setSmartCountriesData] = useState([]);
    const [userData, setUserData] = useState({
        FirstName: '', Title: '', Suffix: '', JobTitle: '', FullName: '', Institution: { FullName: '', Id: Number, City: '', Country: '' }, LinkedIn: '', Twitter: '', Facebook: '', Instagram: '', WorkPhone: '', CellPhone: '', HomePhone: '', WorkCity: '', WorkAddress: '', Email: '', Skype: "",
        WebPage: { Url: '' }, WorkZip: '', Country: '', InstitutionId: '', Department: '', Item_x0020_Cover: { Url: "" }, IM: '', SmartCountries: '', Created: '', Modified: '', Editor: { Title: '' }, Id: 0,
    });
    const [URLs, setURLs] = useState([]);
    const [slectedOrg, setSelectedOrg] = useState();
    // let URLs: any[] = JSON.parse(userData.SocialMediaUrls != null ? userData.SocialMediaUrls : ["{}"]);
    // const [userInfo, setUserInfo] = React.useState(true);
    const[radioBtnSataus, setRadioBtnStatus] = useState(true)
    const [currentInstitute, setCurrentInstitute] = useState({
        FullName: '', Id: '', City: '', Country: '' 
    });
    let callBack = props.callBack;
    let updateCallBack = props.userUpdateFunction;

    useEffect(() => {
        getUserData();
    }, [])

    const getUserData = async () => {
        try {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            let data = await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a')
                .items.select("Id", "Title", "FirstName", "FullName", "Department", "Company", "WorkCity", "Suffix", "WorkPhone", "HomePhone", "Comments", "WorkAddress", "WorkFax", "WorkZip", "Site", "ItemType", "JobTitle", "Item_x0020_Cover", "WebPage", "Site", "CellPhone", "Email", "LinkedIn", "Created", "SocialMediaUrls", "SmartCountries/Title", "SmartCountries/Id", "Author/Title", "Modified", "Editor/Title", "Division/Title", "Division/Id", "EmployeeID/Title", "StaffID", "EmployeeID/Id", "Institution/Id", "Institution/FullName", "IM")
                .expand("EmployeeID", "Division", "Author", "Editor", "SmartCountries", "Institution").getById(props.props).get()
            setUserData(data);
            let URL: any[] = JSON.parse(data.SocialMediaUrls != null ? data.SocialMediaUrls : ["{}"]);
            setURLs(URL);
         
            if (data.InstitutionId != null) {
                InstitutionDetails(data.InstitutionId);
            }
        } catch (error) {
            console.log("Error:", error.message);
        }

    }

    const InstitutionDetails = async (Id: any) => {
        try {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            let data = await web.lists.getById('9f13fd36-456a-42bc-a5e0-cd954d97fc5f')
                .items.select("FullName", "WorkCountry", "WorkCity", "Id").getById(Id).get();
                console.log("intit data ====", data);
                setCurrentInstitute(data);
        } catch (error) {
            console.log("Error user reasponse:", error.message);
        }
    }
    const UpdateDetails = async () => {
        let urlData: any;
        let spliceString = updateData.WebPage.slice(0, 8)
        if (spliceString == "https://") {
            urlData = updateData.WebPage;
        } else {
            urlData = "https://" + updateData.WebPage;
        }
        let SocialUrls: any = {};
        SocialUrls["LinkedIn"] = (updateData.LinkedIn ? updateData.LinkedIn : (URLs.length ? URLs[0].LinkedIn : null));
        SocialUrls["Facebook"] = (updateData.Facebook ? updateData.Facebook : (URLs.length ? URLs[0].Facebook : null));
        SocialUrls["Twitter"] = (updateData.Twitter ? updateData.Twitter : (URLs.length ? URLs[0].Twitter : null));
        SocialUrls["Instagram"] = (updateData.Instagram ? updateData.Instagram : (URLs.length ? URLs[0].Instagram : null));
        let UrlData: any[] = [];
        UrlData.push(SocialUrls);
        try {
            if (userData.Id != undefined) {
                let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
                await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a').items.getById(userData.Id).update({
                    Title: (updateData.Title ? updateData.Title : userData.Title),
                    FirstName: (updateData.FirstName ? updateData.FirstName : userData.FirstName),
                    Suffix: (updateData.Suffix ? updateData.Suffix : userData.Suffix),
                    JobTitle: (updateData.JobTitle ? updateData.JobTitle : userData.JobTitle),
                    FullName: (updateData.FirstName ? updateData.FirstName : userData.FirstName) + " " + (updateData.Title ? updateData.Title : userData.Title),
                    InstitutionId: (updateData.InstitutionId ? updateData.InstitutionId : (currentInstitute ? currentInstitute.Id : null)),
                    Email: (updateData.Email ? updateData.Email : userData.Email),
                    Department: (updateData.Department ? updateData.Department : userData.Department),
                    WorkPhone: (updateData.WorkPhone ? updateData.WorkPhone : userData.WorkPhone),
                    CellPhone: (updateData.CellPhone ? updateData.CellPhone : userData.CellPhone),
                    HomePhone: (updateData.HomePhone ? updateData.HomePhone : userData.HomePhone),
                    WorkCity: (updateData.WorkCity ? updateData.WorkCity : userData.WorkCity),
                    WorkAddress: (updateData.WorkAddress ? updateData.WorkAddress : userData.WorkAddress),
                    WebPage: {
                        "__metadata": { type: "SP.FieldUrlValue" },
                        Description: "Description",
                        Url: updateData.WebPage ? urlData : (userData.WebPage ? userData.WebPage.Url : null)
                    },
                    WorkZip: (updateData.WorkZip ? updateData.WorkZip : userData.WorkZip),
                    IM: (updateData.Skype ? updateData.Skype : userData.IM),
                    SocialMediaUrls: JSON.stringify(UrlData)
                }).then((e)=>{
                    console.log("Request is :",e);
                });
                updateCallBack();
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
        callBack();
    }
    const deleteUserDtl = async () => {
        try {
            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH');
            await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a').items.getById(userData.Id).delete();
            props.userUpdateFunction();
            callBack();
        } catch (error) {
            console.log("Error:", error.message);
        }
    }
    const openOrg = (item: any) => {
        setStatus({ ...status, orgPopup: true })
        // setOrgPopup(true);
        setSelectedOrg(item);
    }

    const openCountry = (item: any) => {
        setSmartCountriesData(item);
        // setCountryPopup(true);
        setStatus({ ...status, countryPopup: true })
    }
    const CloseOrgPopup = useCallback(() => {
        setStatus({ ...status, orgPopup: false })
        // setOrgPopup(false);
    }, []);
    const CloseCountryPopup = useCallback(() => {
        setStatus({ ...status, countryPopup: false })
        // setCountryPopup(false);
    }, []);
    const selectedOrgStatus = useCallback((item: any) => {
        setSelectedOrg(item.FullName);
        setRadioBtnStatus(false);
        // setStatus({ ...status, radioBtnSataus: false })

    }, [])
    const orgCallBack = useCallback((item: any) => {
        // setStatus({ ...status, instituteStatus: true })
        setInstituteStatus(true);
        setUpdateData({ ...updateData, InstitutionName: item.FullName });
        setUpdateData({ ...updateData, InstitutionId: item.Id });
        setSelectedOrg(item.FullName);
    }, [])
    return (
        <div className="popup-section">
            <div className="popup-container">
                <div className="card">
                    <div className="card-header popup-header d-flex justify-content-between">
                        <div><img className='userImg' src={userData.Item_x0020_Cover != undefined ? userData.Item_x0020_Cover.Url : "NA"} />Edit Contact <b>{userData.FullName}</b></div>
                        <button className="btn-close" onClick={() => callBack()}></button>
                    </div>
                    <div className="card-body">
                        <div className="card">
                            <div className="card-header">
                                <button onClick={() => setStatus({ ...status, userInfo: true })}>Basic Information</button>
                                <button onClick={() => setStatus({ ...status, userInfo: false })}>Image Information</button>
                            </div>
                            <div className="card-body">
                                {status.userInfo ? <div><div className='general-section'>
                                    <div className="card">
                                        <div className="card-header">
                                            General
                                        </div>
                                        <div className="card-body">
                                            <div>
                                                <div className="row">
                                                    <div className="col">
                                                        <input type="text" className="form-control" defaultValue={userData ? userData.FirstName : null} onChange={(e) => setUpdateData({ ...updateData, FirstName: e.target.value })} aria-label="First name" placeholder='First Name' />
                                                    </div>
                                                    <div className="col">
                                                        <input type="text" className="form-control" defaultValue={userData.Title} onChange={(e) => setUpdateData({ ...updateData, Title: e.target.value })} aria-label="Last name" placeholder='Last name' />
                                                    </div>
                                                    <div className="col">
                                                        <input type="text" className="form-control" defaultValue={userData.Suffix} onChange={(e) => setUpdateData({ ...updateData, Suffix: e.target.value })} aria-label="Suffix" placeholder='Suffix' />
                                                    </div>
                                                    <div className="col">
                                                        <input type="text" className="form-control" defaultValue={userData.JobTitle} onChange={(e) => setUpdateData({ ...updateData, JobTitle: e.target.value })} aria-label="JobTitle" placeholder='Job-Title' />
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-check-label">Site</label>
                                                        <div className='d-flex'>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminateDisabled" disabled checked />
                                                                {/* <label className="form-check-label">
                                                                    {userData.SitesTagged}
                                                                </label> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className='d-flex'>
                                                            <p className='form-control'>{instituteStatus ? slectedOrg : <p>{currentInstitute.FullName ? currentInstitute.FullName : null}</p>}</p>
                                                            <button className='btn-sm' onClick={() => openOrg(radioBtnSataus ? currentInstitute.FullName : slectedOrg)}><GoRepoPush /></button>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-check-label">Division</label>
                                                        <select className="form-control" >Select Division
                                                            <option selected>Select-01</option>
                                                            <option>Select-01</option>
                                                            <option>Select-01</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    <div className="Social-media-account my-2">
                                        <div className="card">
                                            <div className="card-header">
                                                Social Media Accounts
                                            </div>
                                            <div className="card-body">
                                                <div>
                                                    <div className="row">
                                                        <div className="col" >
                                                            <label>LinkedIn</label>
                                                            <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].LinkedIn : ""} aria-label="LinkedIn"
                                                                onChange={(e) => setUpdateData({ ...updateData, LinkedIn: e.target.value })} />
                                                        </div>
                                                        <div className="col" >
                                                            <label>Twitter</label>
                                                            <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].Twitter : ""}
                                                                onChange={(e) => setUpdateData({ ...updateData, Twitter: e.target.value })} aria-label="LinkedIn" />
                                                        </div>
                                                        <div className="col" >
                                                            <label>Facebook</label>
                                                            <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].Facebook : ""} onChange={(e) => setUpdateData({ ...updateData, Facebook: e.target.value })} aria-label="LinkedIn" />
                                                        </div>
                                                        <div className="col" >
                                                            <label>Instagram</label>
                                                            <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].Instagram : ''}
                                                                onChange={(e) => setUpdateData({ ...updateData, Instagram: e.target.value })} aria-label="LinkedIn" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="Contact-details my-2">
                                        <div className="card">
                                            <div className="card-header">
                                                Contacts
                                            </div>
                                            <div className="card-body">
                                                <div>
                                                    <div className="row">
                                                        <div className="col">
                                                            <label>Business Phone</label>
                                                            <input type="text" className="form-control" defaultValue={userData.WorkPhone ? userData.WorkPhone : ''} onChange={(e) => setUpdateData({ ...updateData, WorkPhone: e.target.value })} aria-label="Business Phone" />
                                                        </div>
                                                        <div className="col">
                                                            <label>Mobile-No</label>
                                                            <input type="text" className="form-control" defaultValue={userData.CellPhone ? userData.CellPhone : ''} onChange={(e) => setUpdateData({ ...updateData, CellPhone: e.target.value })} aria-label="Mobile-No" />
                                                        </div>
                                                        <div className="col">
                                                            <label>Home-Phone</label>
                                                            <input type="text" className="form-control" defaultValue={userData.HomePhone ? userData.HomePhone : ''} onChange={(e) => setUpdateData({ ...updateData, HomePhone: e.target.value })} aria-label="Home-Phone" />
                                                        </div>
                                                        <div className="col">
                                                            <label>City</label>
                                                            <input type="text" className="form-control" defaultValue={userData.WorkCity ? userData.WorkCity : ''} onChange={(e) => setUpdateData({ ...updateData, WorkCity: e.target.value })} aria-label="City" />
                                                        </div>
                                                        <div className="col">
                                                            <label>Address</label>
                                                            <input type="text" className="form-control" defaultValue={userData.WorkAddress ? userData.WorkAddress : ''} onChange={(e) => setUpdateData({ ...updateData, WorkAddress: e.target.value })} aria-label="Address" />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col">
                                                            <label>Skpye</label>
                                                            <input type="text" className="form-control" placeholder="Skpye" defaultValue={userData.IM ? userData.IM : ""}
                                                                onChange={(e) => setUpdateData({ ...updateData, Skype: e.target.value })} aria-label="Skpye" />
                                                        </div>
                                                        <div className="col">
                                                            <label>Email</label>
                                                            <input type="text" className="form-control" defaultValue={userData.Email ? userData.Email : ""}
                                                                onChange={(e) => setUpdateData({ ...updateData, Email: e.target.value })} aria-label="Email" />
                                                        </div>
                                                        <div className="col">
                                                            <label>WebPage</label>

                                                            <input className="form-control" type="text" defaultValue={userData.WebPage ? userData.WebPage.Url : ""} onChange={(e) => setUpdateData({ ...updateData, WebPage: e.target.value })} aria-label="WebPage" />

                                                        </div>
                                                        <div className="col">
                                                            <label>Zip Code</label>
                                                            <input type="text" className="form-control" defaultValue={userData.WorkZip ? userData.WorkZip : ""} onChange={(e) => setUpdateData({ ...updateData, WorkZip: e.target.value })} aria-label="Zip Code" />
                                                        </div>
                                                        <div className="col">
                                                            <label>Country</label>
                                                            <div className='d-flex '>
                                                                {/* <p className='form-control'>
                                                                    {userData.SmartCountries ? userData.SmartCountries[0].Title : ""}
                                                                </p> */}
                                                                <button onClick={() => openCountry(userData.SmartCountries)}><GoRepoPush /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div></div> : <div><h1>image info</h1></div>}
                                <div footer-section>
                                    <div className="card">
                                        <div className="card-body d-flex justify-content-between">
                                            <div>
                                                <p>Created at {userData.Created ? userData.Created : ''} by {userData.FullName ? userData.FullName : ''}</p>
                                                <p>Last modified {userData.Modified ? userData.Modified : ''} by {userData.Editor ? userData.Editor.Title : ''}</p>
                                                <button className="btn btn-danger" onClick={deleteUserDtl}>Delete this item</button>
                                            </div>
                                            <div className='links-and-buttons'>
                                                <a href='./'>Go to profile page |</a>
                                                <a href='./'> Manage Contact-Categories |</a>
                                                <a href='./'> Open out-of-the-box form</a>
                                                <div className='d-flex justify-content-end'>
                                                    <button className='btn btn-success' onClick={UpdateDetails}>Save</button>
                                                    <button className='btn btn-warning' onClick={() => callBack()} >Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {status.orgPopup ? <OrgContactEditPopup callBack={CloseOrgPopup} orgChange={orgCallBack}  institutionName={slectedOrg} selectedStatus={selectedOrgStatus} /> : null}
            {status.countryPopup ? <CountryContactEditPopup callBack={CloseCountryPopup} data={SmartCountriesData} /> : null}
        </div>

    )
}
export default HHHHEditComponent;