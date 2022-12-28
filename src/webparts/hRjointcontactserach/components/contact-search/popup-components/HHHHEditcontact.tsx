import * as React from 'react';
import OrgContactEditPopup from './orgContactEditPopup';
import CountryContactEditPopup from './CountryContactEditPopup';
import { useState, useEffect, useCallback } from 'react';
import { Web } from 'sp-pnp-js';
import { GoRepoPush } from 'react-icons/go';


const HHHHEditComponent = (props: any) => {
    const [countryData, setCountryData] =useState([]);
    const [stateData, setStateData] =useState([]);
    const [status, setStatus] = useState({
        orgPopup: false,
        countryPopup: false,
        statePopup: false
    })
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
    const [selectedOrg, setSelectedOrg] = useState();
    const [radioBtnSataus, setRadioBtnStatus] = useState(true)
    const [currentInstitute, setCurrentInstitute] = useState({
        FullName: '', Id: '', City: '', Country: ''
    });
    const [btnStatus, setBtnStatus] = useState({
        basicInfo: true,
        imgInfo: false,
        hrInfo: false
    });
    const [hrBtnStatus, setHrBtnStatus] = useState({
        personalInfo: true,
        bankInfo: false,
        taxInfo: false,
        qualificationInfo: false,
        socialSecurityInfo: false
    })
    let callBack = props.callBack;
    let updateCallBack = props.userUpdateFunction;
    useEffect(() => {
        getUserData();
        getSmartMetaData();
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
    const getSmartMetaData = async () => {
        try {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            let data = await web.lists.getById('d1c6d7c3-f36e-4f95-8715-8da9f33622e7')
                .items.get()
                data.map((item:any, index:any)=>{
                    if(data.TaxType == "country"){
                        setCountryData(item);
                        console.log("country data ====", item);
                    }
                    if(data.TaxType == "state"){
                        setStateData(item);
                        console.log("state data ====", item);
                    }
                })
                console.log("c data ====",countryData)
                console.log("s data ====",stateData)
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
                }).then((e) => {
                    console.log("Request is :", e);
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
        // setStatus({ ...status, orgPopup: true })
        setStatus({
            ...status, orgPopup: true,
            countryPopup: false,
            statePopup: false
        })
        // setOrgPopup(true);
        setSelectedOrg(item);
    }
    const openCountry = (item: any) => {
        setSmartCountriesData(item);
        // setCountryPopup(true);
        // setStatus({ ...status, countryPopup: true })
        setStatus({
            ...status, orgPopup: false,
            countryPopup: true,
            statePopup: false
        })
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
    const changeBtnStatus = (e: any, btnName: any) => {
        if (btnName == "basic-info") {
            setBtnStatus({ ...btnStatus, basicInfo: true, imgInfo: false, hrInfo: false })
        }
        if (btnName == "image-info") {
            setBtnStatus({ ...btnStatus, basicInfo: false, imgInfo: true, hrInfo: false })
        }
        if (btnName == "hr-info") {
            setBtnStatus({ ...btnStatus, basicInfo: false, imgInfo: false, hrInfo: true })
        }
    }
    const changeHrBtnStatus = (e: any, btnName: any) => {
        if (btnName == "personal-info") {
            setHrBtnStatus({ ...hrBtnStatus, personalInfo: true, bankInfo: false, taxInfo: false, qualificationInfo: false, socialSecurityInfo: false })
        }
        if (btnName == "bank-info") {
            setHrBtnStatus({ ...hrBtnStatus, personalInfo: false, bankInfo: true, taxInfo: false, qualificationInfo: false, socialSecurityInfo: false })
        }
        if (btnName == "tax-info") {
            setHrBtnStatus({ ...hrBtnStatus, personalInfo: false, bankInfo: false, taxInfo: true, qualificationInfo: false, socialSecurityInfo: false })
        }
        if (btnName == "social-security-info") {
            setHrBtnStatus({ ...hrBtnStatus, personalInfo: false, bankInfo: false, taxInfo: false, qualificationInfo: false, socialSecurityInfo: true })
        }
        if (btnName == "qualification-info") {
            setHrBtnStatus({ ...hrBtnStatus, personalInfo: false, bankInfo: false, taxInfo: false, qualificationInfo: true, socialSecurityInfo: false })
        }
    }


    const selectState = (e: any) => {
        setStatus({
            ...status, orgPopup: false,
            countryPopup: false,
            statePopup: true
        })
    }

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

                                <button className={btnStatus.basicInfo ? 'tab-btn-active' : 'tab-btn'} onClick={(e) => changeBtnStatus(e, "basic-info")}>BASIC INFORMATION</button>
                                <button className={btnStatus.imgInfo ? 'tab-btn-active' : 'tab-btn'} onClick={(e) => changeBtnStatus(e, "image-info")}>IMAGE INFORMATION</button>
                                <button className={btnStatus.hrInfo ? 'tab-btn-active' : 'tab-btn'} onClick={(e) => changeBtnStatus(e, "hr-info")}>HR</button>
                            </div>
                            <div className="card-body">
                                {btnStatus.basicInfo ? <div><div className='general-section'>
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
                                                            <span className='popup-text'>{instituteStatus ? selectedOrg : <span>{currentInstitute.FullName ? currentInstitute.FullName : null}</span>}</span>
                                                            <button className='popup-btn' onClick={() => openOrg(radioBtnSataus ? currentInstitute.FullName : selectedOrg)}><GoRepoPush /></button>
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
                                                                <button className='popup-btn' onClick={() => openCountry(userData.SmartCountries)}><GoRepoPush /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div></div> : null}
                                {btnStatus.imgInfo ?
                                    <div>
                                        <div className="card">
                                            <div className="card-header">
                                                <button>a</button>
                                                <button>b</button>
                                                <button>c</button>
                                                <button>d</button>
                                                <button>e</button>
                                            </div>
                                            <div className="card-body">
                                                {hrBtnStatus.personalInfo ? <div>personalInfo</div> : null}
                                                {hrBtnStatus.bankInfo ? <div>bankInfo</div> : null}
                                                {hrBtnStatus.taxInfo ? <div>taxInfo</div> : null}
                                                {hrBtnStatus.qualificationInfo ? <div>qualificationInfo</div> : null}
                                                {hrBtnStatus.socialSecurityInfo ? <div>socialSecurityInfo</div> : null}

                                            </div>
                                        </div>
                                    </div> : null}
                                {btnStatus.hrInfo ? <div>
                                    <div className="card">
                                        <div className="card-header">
                                            <button className={hrBtnStatus.personalInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrBtnStatus(e, "personal-info")}>PERSONAL INFORMATION</button>
                                            <button className={hrBtnStatus.bankInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrBtnStatus(e, "bank-info")}>BANK INFORMATION</button>
                                            <button className={hrBtnStatus.taxInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrBtnStatus(e, "tax-info")}>TAX INFORMATION</button>
                                            <button className={hrBtnStatus.socialSecurityInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrBtnStatus(e, "social-security-info")}>SOCIAL SECURITY INFORMATION</button>
                                            <button className={hrBtnStatus.qualificationInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrBtnStatus(e, "qualification-info")}>QUALIFICATIONS</button>
                                        </div>
                                        <div className="card-body">

                                            {hrBtnStatus.personalInfo ? <div>
                                                <div className='d-flex justify-content-between'>
                                                    <div className="col">
                                                        <label className="form-label">Federal state </label>
                                                        <div className='d-flex'>
                                                            <span className='popup-text'>samir</span>
                                                            <button className='popup-btn' onClick={(e) => selectState(e)}><GoRepoPush /></button>
                                                        </div>

                                                    </div>
                                                    <div className="col mx-2">
                                                        <label className="form-label">Nationality</label>
                                                        <input type="text" className="form-control" id="inputPassword4" placeholder='Enter Nationality' />
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-label">Date of birth</label>
                                                        <input type="date" className="form-control" id="inputPassword4" />
                                                    </div>
                                                </div>
                                                <div className='d-flex justify-content-between'>
                                                    <div className="col">
                                                        <label className="form-label">Place of birth</label>
                                                        <input type="text" className="form-control" placeholder='Enter Place of birth' />
                                                    </div>
                                                    <div className="col mx-2">
                                                        <label className="form-label">Marital status</label>
                                                        <select className="form-select">
                                                            <option selected>Select an Option</option>
                                                            <option>Single</option>
                                                            <option>Married</option>
                                                            <option>Divorced</option>
                                                            <option>Widowed</option>
                                                        </select>
                                                    </div>
                                                    <div className="col m-2">
                                                        <label className="form-label">Parenthood</label>
                                                        <div className='my-2'>  <input type="radio" id="inputPassword4" /><label className='mx-2'>Yes</label>
                                                            <input type="radio" id="inputPassword4" /><label className='mx-2'>No</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> : null}
                                            {hrBtnStatus.bankInfo ?
                                                <div className="card-body">
                                                    <div className='d-flex justify-content-between'>
                                                        <div className="col">
                                                            <label className="form-label">IBAN</label>
                                                            <input type="text" className="form-control" placeholder='Enter IBAN' />
                                                        </div>
                                                        <div className="col mx-2">
                                                            <label className="form-label">BIC</label>
                                                            <input type="text" className="form-control" id="inputPassword4" placeholder='Enter BIC' />
                                                        </div>
                                                    </div>
                                                </div> : null}
                                            {hrBtnStatus.taxInfo ?
                                                <div className="card-body">
                                                    <div className='d-flex justify-content-between'>
                                                        <div className="col">
                                                            <label className="form-label">Tax No.
                                                            </label>
                                                            <input type="text" className="form-control" placeholder='Enter Tax No.' />
                                                        </div>
                                                        <div className="col mx-2">
                                                            <label className="form-label">Tax class</label>
                                                            <select className="form-select">
                                                                <option selected>Select an Option</option>
                                                                <option>I</option>
                                                                <option>II</option>
                                                                <option>III</option>
                                                                <option>IV</option>
                                                                <option>V</option>
                                                                <option>VI</option>
                                                            </select>
                                                        </div>
                                                        <div className="col">
                                                            <label className="form-label">Child allowance</label>
                                                            <select className="form-select">
                                                                <option selected>Select an Option</option>
                                                                <option>0.5</option>
                                                                <option>1</option>
                                                                <option>1.5</option>
                                                                <option>2</option>
                                                                <option>2.5</option>
                                                                <option>3</option>
                                                                <option>3.5</option>
                                                                <option>4</option>
                                                                <option>4.5</option>
                                                                <option>5</option>
                                                                <option>5.5</option>
                                                                <option>6</option>
                                                                <option>6.5</option>
                                                                <option>7</option>
                                                                <option>7.5</option>
                                                                <option>8</option>
                                                                <option>8.5</option>
                                                                <option>9</option>
                                                                <option>9.5</option>

                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-between'>
                                                        <div className="col">
                                                            <label className="form-label">Church tax</label>
                                                            <div className='my-2'>
                                                                <input type="radio" id="inputPassword4" /><label className='mx-2'>Yes</label>
                                                                <input type="radio" id="inputPassword4" /><label className='mx-2'>No</label>
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <label className="form-label">Monthly tax allowance</label>
                                                            <input type="number" className="form-control" placeholder='Enter Monthly tax allowance' />
                                                        </div>

                                                    </div>
                                                </div> : null}
                                            {hrBtnStatus.socialSecurityInfo ? <div className="card-body">
                                                <div className='d-flex justify-content-between'>

                                                    <div className="col">
                                                        <label className="form-label">Health Insurance Type</label>
                                                        <select className="form-select">
                                                            <option selected>Select an Option</option>
                                                            <option>None</option>
                                                            <option>Statutory</option>
                                                            <option>Private</option>
                                                        </select>
                                                    </div>
                                                    <div className="col mx-2">
                                                        <label className="form-label">Health Insurance Company
                                                        </label>
                                                        <input type="text" className="form-control" placeholder='Enter Company Name' />
                                                    </div>
                                                    <div className="col">
                                                        <label className="form-label">Health Insurance No
                                                        </label>
                                                        <input type="text" className="form-control" placeholder='Enter Health Insurance No' />
                                                    </div>
                                                </div>

                                            </div> : null}
                                            {hrBtnStatus.qualificationInfo ?
                                                <div className='card-body'>
                                                    <div className='d-flex justify-content-between'>
                                                        <div className="col mx-2">
                                                            <label className="form-label">Highest school diploma
                                                            </label>
                                                            <input type="text" className="form-control" placeholder='Enter Highest school diploma' />
                                                        </div>
                                                        <div className="col mx-2">
                                                            <label className="form-label">Highest vocational education
                                                            </label>
                                                            <input type="text" className="form-control" placeholder='Enter Highest vocational education' />
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-between'>
                                                        <div className="col mx-2">
                                                            <label className="form-label">Other qualifications
                                                            </label>
                                                            <input type="text" className="form-control" placeholder='Enter Other qualifications' />
                                                        </div>
                                                        <div className="col mx-2">
                                                            <label className="form-label">Languages
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div> : null}
                                        </div>
                                    </div>
                                </div> : null}
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
                                                <div className='d-flex justify-content-end my-2'>
                                                    <button className='btn btn-success mx-2' onClick={UpdateDetails}>Save</button>
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
            {status.orgPopup ? <OrgContactEditPopup callBack={CloseOrgPopup} orgChange={orgCallBack} institutionName={selectedOrg} selectedStatus={selectedOrgStatus} /> : null}
            {status.countryPopup ? <CountryContactEditPopup popupName="Country" callBack={CloseCountryPopup} data={SmartCountriesData} /> : null}
            {status.statePopup ? <CountryContactEditPopup popupName="State" callBack={CloseCountryPopup} /> : null}
        </div>

    )
}
export default HHHHEditComponent;