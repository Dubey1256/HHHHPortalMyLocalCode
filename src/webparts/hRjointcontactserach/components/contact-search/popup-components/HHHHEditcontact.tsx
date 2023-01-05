import * as React from 'react';
import OrgContactEditPopup from './orgContactEditPopup';
import CountryContactEditPopup from './CountryContactEditPopup';
import { useState, useEffect, useCallback } from 'react';
import pnp, { Web } from 'sp-pnp-js';
import { GoRepoPush } from 'react-icons/go';
import { FaBars } from 'react-icons/fa';
import * as Moment from 'moment';


const HHHHEditComponent = (props: any) => {
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [HrTagData, setHrTagData] = useState([]);
    const [status, setStatus] = useState({
        orgPopup: false,
        countryPopup: false,
        statePopup: false
    });
    const [siteTaggedHR, setSiteTaggedHR] = useState(false);
    const [siteTaggedSMALSUS, setSiteTaggedSMALSUS] = useState(false);
    const [updateData, setUpdateData] = useState({
        FirstName: '', Title: '', Suffix: '', JobTitle: '', FullName: '', InstitutionName: '', LinkedIn: '', Twitter: '', Facebook: '', Instagram: '', WorkPhone: '', CellPhone: '', HomePhone: '', WorkCity: '', WorkAddress: '', Email: '', Skype: "",
        WebPage: '', WorkZip: '', Country: '', InstitutionId: 0, Department: '', SmartCountriesId: 0
    });
    const [HrUpdateData, setHrUpdateData] = useState({
        Nationality: "", placeOfBirth: '', BIC: '', IBAN: '', taxNo: '', monthlyTaxAllowance: 0, insuranceNo: "", highestSchoolDiploma: '', highestVocationalEducation: '', otherQualifications: '', Country: '', Fedral_State: '', childAllowance: '', churchTax: '', healthInsuranceType: '', healthInsuranceCompany: '', maritalStatus: '', taxClass: '', SmartContactId: '', SmartLanguagesId: '', SmartStateId: '', dateOfBirth: '', Parenthood: '',
    })
    const [instituteStatus, setInstituteStatus] = useState(false);
    const [userData, setUserData] = useState({
        FirstName: '', Title: '', Suffix: '', JobTitle: '', FullName: '', Institution: { FullName: '', Id: 0, City: '', Country: '' }, LinkedIn: '', Twitter: '', Facebook: '', Instagram: '', WorkPhone: '', CellPhone: '', HomePhone: '', WorkCity: '', WorkAddress: '', Email: '', Skype: "",
        WebPage: { Url: '' }, WorkZip: '', Country: '', InstitutionId: 0, Department: '', Item_x0020_Cover: { Url: "" }, IM: '', SmartCountries: { Title: '' }, Created: '', Modified: '', Editor: { Title: '' }, Id: 0, SmartCountriesId: 0, Site: [],
    });
    const [URLs, setURLs] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState();
    const [selectedState, setSelectedState] = useState({
        Title: ''
    });
    const [radioBtnStatus, setRadioBtnStatus] = useState(true)
    const [currentInstitute, setCurrentInstitute] = useState({
        FullName: '', Id: 0, City: '', Country: ''
    });
    const [currentCountry, setCurrentCountry] = useState([{
        Title: '', Id: 0
    }])
    const [btnStatus, setBtnStatus] = useState({
        basicInfo: true,
        imgInfo: false,
        hrInfo: false,
        smalsusInfo: false
    });
    const [hrBtnStatus, setHrBtnStatus] = useState({
        personalInfo: true,
        bankInfo: false,
        taxInfo: false,
        qualificationInfo: false,
        socialSecurityInfo: false
    })
    const [SmalsusBtnStatus, setSmalsusBtnStatus] = useState({
        personalInfo: true,
        bankInfo: false,
        taxInfo: false,
        qualificationInfo: false,
        socialSecurityInfo: false
    })
    let callBack = props.callBack;
    let updateCallBack = props.userUpdateFunction;
    useEffect(() => {
        getUserData(props.props);
        getSmartMetaData();
        pnp.sp.web.currentUser.get().then((result: any) => {
            let CurrentUserId = result.Id;
            console.log(CurrentUserId)
        });
    }, [])
    const getUserData = async (Id: any) => {
        try {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            let data = await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a')
                .items.getById(Id).select("Id, Title, FirstName, FullName, Department, Company, WorkCity, Suffix, WorkPhone, HomePhone, Comments, WorkAddress, WorkFax, WorkZip, Site, ItemType, JobTitle, Item_x0020_Cover, WebPage, Site, CellPhone, Email, LinkedIn, Created, SocialMediaUrls, SmartCountries/Title, SmartCountries/Id, Author/Title, Modified, Editor/Title, Division/Title, Division/Id, EmployeeID/Title, StaffID, EmployeeID/Id, Institution/Id, Institution/FullName, IM")
                .expand("EmployeeID, Division, Author, Editor, SmartCountries, Institution").get()

            let URL: any[] = JSON.parse(data.SocialMediaUrls != null ? data.SocialMediaUrls : ["{}"]);
            setURLs(URL);
            if (data.Institution != null) {
                setCurrentInstitute(data.Institution);
            }
            if (data.SmartCountries.length > 0) {
                setCurrentCountry(data.SmartCountries);
            }
            let SitesTagged = '';
            if (data.Site != null) {
                if (data.Site.length >= 0) {
                    data.Site?.map((site: any, index: any) => {
                        if (index == 0) {
                            SitesTagged = site;
                        } else if (index > 0) {
                            SitesTagged = SitesTagged + ', ' + site;
                        }
                    })
                }
            }
            if (SitesTagged.search("HR") >= 0 && props.loggedInUserName == data.Email) {
                HrTagInformation(props.props);
                setSiteTaggedHR(true);
            }
            if (SitesTagged.search("SMALSUS") >= 0 && props.loggedInUserName == data.Email) {
                HrTagInformation(props.props);
                setSiteTaggedSMALSUS(true);
            }
            setUserData(data);
            // console.log("user  Data ========", data);
        } catch (error) {
            console.log("Error:", error.message);
        }

    }
    const getSmartMetaData = async () => {
        try {
            let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            let data = await web.lists.getById('d1c6d7c3-f36e-4f95-8715-8da9f33622e7')
                .items.top(4999).get()
            data.map((item: any, index: any) => {
                // let countryData:any=[];
                // let stateData:any=[];
                if (item.TaxType == "Countries") {
                    countryData.push(item)
                }
                else if (item.TaxType == "State") {
                    stateData.push(item)
                }

            })
            setCountryData(countryData);
            setStateData(stateData);
        } catch (error) {
            console.log("Error:", error.message);
        }

    }

    const HrTagInformation = async (Id: any) => {
        try {
            const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            let data = await web.lists
                .getById("6DD8038B-40D2-4412-B28D-1C86528C7842")
                .items.select(
                    "Id,ID,Title,BIC,Country, Parenthood, IBAN, Nationality,healthInsuranceCompany,highestVocationalEducation,healthInsuranceType,highestSchoolDiploma,insuranceNo,otherQualifications,dateOfBirth,Fedral_State,placeOfBirth,maritalStatus,taxNo,churchTax,taxClass,monthlyTaxAllowance,childAllowance,SmartState/Title,SmartState/Id,SmartLanguages/Title,SmartLanguages/Id,SmartContact/Title,SmartContact/Id").expand("SmartLanguages, SmartState, SmartContact").filter("SmartContact/ID eq " + Id).get();
            let array = [];
            array.push(data[0]);
            setHrUpdateData({
                ...HrUpdateData,
                Parenthood: data[0].Parenthood ? data[0].Parenthood : '',
                churchTax: data[0].churchTax ? data[0].churchTax : ''
            });
            setHrTagData(array);
        } catch (error) {
            console.log("error:", error.message);
        }
    };

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
                    SocialMediaUrls: JSON.stringify(UrlData),
                    SmartCountriesId: {
                        results: [(updateData.SmartCountriesId ? updateData.SmartCountriesId : (currentCountry ? currentCountry[0].Id : null))]
                    }
                }).then((e) => {
                    console.log("Your information has been updated successfully");

                });
                updateCallBack();
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
        if (userData.Site?.toString().search("HR") >= 0) {
            updateHrDetails();
        }

        callBack();

    }

    const updateHrDetails = async () => {
        let Id: any = HrTagData[0].ID;
        try {
            const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            await web.lists
                .getById("6DD8038B-40D2-4412-B28D-1C86528C7842")
                .items.getById(Id).update({
                    Nationality: (HrUpdateData.Nationality ? HrUpdateData.Nationality : (HrTagData[0].Nationality ? HrTagData[0].Nationality : null)),
                    placeOfBirth: (HrUpdateData.placeOfBirth ? HrUpdateData.placeOfBirth : (HrTagData[0].placeOfBirth ? HrTagData[0].placeOfBirth : null)),
                    BIC: (HrUpdateData.BIC ? HrUpdateData.BIC : (HrTagData[0].BIC ? HrTagData[0].BIC : null)),
                    IBAN: (HrUpdateData.IBAN ? HrUpdateData.IBAN : (HrTagData[0].IBAN ? HrTagData[0].IBAN : null)),
                    taxNo: (HrUpdateData.taxNo ? HrUpdateData.taxNo : (HrTagData[0].taxNo ? HrTagData[0].taxNo : null)),
                    monthlyTaxAllowance: (HrUpdateData.monthlyTaxAllowance ? HrUpdateData.monthlyTaxAllowance : (HrTagData[0].monthlyTaxAllowance ? HrTagData[0].monthlyTaxAllowance : null)),
                    insuranceNo: (HrUpdateData.insuranceNo ? HrUpdateData.insuranceNo : (HrTagData[0].insuranceNo ? HrTagData[0].insuranceNo : null)),
                    highestSchoolDiploma: (HrUpdateData.highestSchoolDiploma ? HrUpdateData.highestSchoolDiploma : (HrTagData[0].highestSchoolDiploma ? HrTagData[0].highestSchoolDiploma : null)),
                    highestVocationalEducation: (HrUpdateData.highestVocationalEducation ? HrUpdateData.highestVocationalEducation : (HrTagData[0].highestVocationalEducation ? HrTagData[0].highestVocationalEducation : null)),
                    otherQualifications: (HrUpdateData.otherQualifications ? HrUpdateData.otherQualifications : (HrTagData[0].otherQualifications ? HrTagData[0].otherQualifications : null)),
                    healthInsuranceCompany: (HrUpdateData.healthInsuranceCompany ? HrUpdateData.healthInsuranceCompany : (HrTagData[0].healthInsuranceCompany ? HrTagData[0].healthInsuranceCompany : null)),
                    dateOfBirth: (HrUpdateData.dateOfBirth ? HrUpdateData.dateOfBirth : (HrTagData[0].dateOfBirth ? HrTagData[0].dateOfBirth : null)),
                    maritalStatus: (HrUpdateData.maritalStatus ? HrUpdateData.maritalStatus : (HrTagData[0].maritalStatus ? HrTagData[0].maritalStatus : null)),
                    Parenthood: (HrUpdateData.Parenthood ? HrUpdateData.Parenthood : (HrTagData[0].Parenthood ? HrTagData[0].Parenthood : null)),
                    taxClass: (HrUpdateData.taxClass ? HrUpdateData.taxClass : (HrTagData[0].taxClass ? HrTagData[0].taxClass : null)),
                    childAllowance: (HrUpdateData.childAllowance ? HrUpdateData.childAllowance : (HrTagData[0].childAllowance ? HrTagData[0].childAllowance : null)),
                    churchTax: (HrUpdateData.churchTax ? HrUpdateData.churchTax : (HrTagData[0].churchTax ? HrTagData[0].churchTax : null)),
                    healthInsuranceType: (HrUpdateData.healthInsuranceType ? HrUpdateData.healthInsuranceType : (HrTagData[0].healthInsuranceType ? HrTagData[0].healthInsuranceType : null)),
                    Fedral_State: (HrUpdateData.Fedral_State ? HrUpdateData.Fedral_State : (HrTagData[0].Fedral_State ? HrTagData[0].Fedral_State : null))
                }).then(() => {
                    console.log("Your information has been updated successfully");
                })
        } catch (error) {
            console.log("error", error.message)
        }
        alert("Your information has been updated successfully")
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
        setStatus({
            ...status, orgPopup: true,
            countryPopup: false,
            statePopup: false
        })
        setSelectedOrg(item);
    }
    const openCountry = (item: any) => {
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
    }, [])
    const orgCallBack = useCallback((item: any) => {
        // setStatus({ ...status, instituteStatus: true })
        setInstituteStatus(true);
        setUpdateData({ ...updateData, InstitutionName: item.FullName });
        setUpdateData({ ...updateData, InstitutionId: item.Id });
        setSelectedOrg(item.FullName);
    }, [])
    const selectedCountryStatus = useCallback((item: any) => {

        setCurrentCountry(item);
        setUpdateData({ ...updateData, SmartCountriesId: item[0].Id });

    }, [])
    const changeBtnStatus = (e: any, btnName: any) => {
        if (btnName == "basic-info") {
            setBtnStatus({ ...btnStatus, basicInfo: true, imgInfo: false, hrInfo: false, smalsusInfo: false })
        }
        if (btnName == "image-info") {
            setBtnStatus({ ...btnStatus, basicInfo: false, imgInfo: true, hrInfo: false, smalsusInfo: false })
        }
        if (btnName == "hr-info") {
            setBtnStatus({ ...btnStatus, basicInfo: false, imgInfo: false, hrInfo: true, smalsusInfo: false })
        }
        if (btnName == "smalsus-info") {
            setBtnStatus({ ...btnStatus, basicInfo: false, imgInfo: false, hrInfo: false, smalsusInfo: true })
        }
    }
    const changeHrTabBtnStatus = (e: any, btnName: any) => {
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
    const changeSmalsusTabBtnStatus = (e: any, btnName: any) => {
        if (btnName == "personal-info") {
            setSmalsusBtnStatus({ ...SmalsusBtnStatus, personalInfo: true, bankInfo: false, taxInfo: false, qualificationInfo: false, socialSecurityInfo: false })
        }
        if (btnName == "bank-info") {
            setSmalsusBtnStatus({ ...SmalsusBtnStatus, personalInfo: false, bankInfo: true, taxInfo: false, qualificationInfo: false, socialSecurityInfo: false })
        }
        if (btnName == "tax-info") {
            setSmalsusBtnStatus({ ...SmalsusBtnStatus, personalInfo: false, bankInfo: false, taxInfo: true, qualificationInfo: false, socialSecurityInfo: false })
        }
        if (btnName == "social-security-info") {
            setSmalsusBtnStatus({ ...SmalsusBtnStatus, personalInfo: false, bankInfo: false, taxInfo: false, qualificationInfo: false, socialSecurityInfo: true })
        }
        if (btnName == "qualification-info") {
            setSmalsusBtnStatus({ ...SmalsusBtnStatus, personalInfo: false, bankInfo: false, taxInfo: false, qualificationInfo: true, socialSecurityInfo: false })
        }
    }
    const selectState = (e: any, item: any) => {
        if (currentCountry.length > 0) {
            setStatus({
                ...status, orgPopup: false,
                countryPopup: false,
                statePopup: true
            })
            setSelectedState(item);
        } else {
            alert("Please select country before selecting state");
        }
    }
    const selectedStateStatus = useCallback((item: any) => {
        setHrUpdateData({ ...HrUpdateData, Fedral_State: item.Title })
        setSelectedState(item)
    }, [])

    return (
        <div className="popup-section">
            <div className="popup-container">
                <div className="card">
                    <div className="card-header popup-header d-flex justify-content-between">
                        <div><img className='userImg' src={userData.Item_x0020_Cover != undefined ? userData.Item_x0020_Cover.Url : "NA"} />Edit Contact <b>{userData.FullName}</b></div>
                        <div>
                            <button className='header-btn' >
                                <FaBars />
                            </button>
                            <button className='header-btn' onClick={() => callBack()}>
                                <img src="https://hhhhteams.sharepoint.com/_layouts/images/delete.gif" />
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="card">
                            <div className="card-header">
                                <button className={btnStatus.basicInfo ? 'tab-btn-active' : 'tab-btn'} onClick={(e) => changeBtnStatus(e, "basic-info")}>BASIC INFORMATION</button>
                                <button className={btnStatus.imgInfo ? 'tab-btn-active' : 'tab-btn'} onClick={(e) => changeBtnStatus(e, "image-info")}>IMAGE INFORMATION</button>
                                {siteTaggedHR ? <button className={btnStatus.hrInfo ? 'tab-btn-active' : 'tab-btn'} onClick={(e) => changeBtnStatus(e, "hr-info")}>HR</button> : null}
                                {siteTaggedSMALSUS ? <button className={btnStatus.smalsusInfo ? 'tab-btn-active' : 'tab-btn'} onClick={(e) => changeBtnStatus(e, "smalsus-info")}>SMALSUS</button> : null}
                            </div>
                            <div className="card-body">
                                {btnStatus.basicInfo ? <div><div className='general-section'>
                                    <div className="card">
                                        <div className="card-header">
                                            General
                                        </div>
                                        <div className="card-body">
                                            <div>
                                                <div className="user-form-4">
                                                    <div className="col">
                                                        <label className='input-field-label'>First Name </label>
                                                        <input type="text" className="input-field" defaultValue={userData ? userData.FirstName : null} onChange={(e) => setUpdateData({ ...updateData, FirstName: e.target.value })} aria-label="First name" placeholder='First Name' />
                                                    </div>
                                                    <div className="col">
                                                        <label className="input-field-label"> Last Name</label>
                                                        <input type="text" className="input-field" defaultValue={userData.Title} onChange={(e) => setUpdateData({ ...updateData, Title: e.target.value })} aria-label="Last name" placeholder='Last name' />
                                                    </div>
                                                    <div className="col">
                                                        <label className="input-field-label"> Suffix</label>
                                                        <input type="text" className="input-field" defaultValue={userData.Suffix} onChange={(e) => setUpdateData({ ...updateData, Suffix: e.target.value })} aria-label="Suffix" placeholder='Suffix' />
                                                    </div>
                                                    <div className="col">
                                                        <label className="input-field-label"> Job Title</label>
                                                        <input type="text" className="input-field" defaultValue={userData.JobTitle} onChange={(e) => setUpdateData({ ...updateData, JobTitle: e.target.value })} aria-label="JobTitle" placeholder='Job-Title' />
                                                    </div>

                                                </div>
                                                <div className="user-form-3">
                                                    <div className="col">
                                                        <label className="input-field-label">Site</label>
                                                        <div className='d-flex'>
                                                            <div className="d-flex">
                                                                <input className="mx-2" type="checkbox" value="" checked={userData.Site?.toString().search("HR") >= 0} />
                                                                <label> HR </label>
                                                                <input className="mx-2" type="checkbox" checked={userData.Site?.toString().search("GMBH") >= 0} />
                                                                <label> GMBH </label>
                                                                <input className="mx-2" type="checkbox" checked={userData.Site?.toString().search("SMALSUS") >= 0} />
                                                                <label> SMALSUS </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <label className="input-field-label">Division</label>
                                                        <select className="input-field py-2" >
                                                            <option selected>Select Division</option>
                                                            <option>SDE-01</option>
                                                            <option>SDE-02</option>
                                                            <option>SDE-03</option>
                                                        </select>
                                                    </div>
                                                    <div className="col">
                                                        <label className="input-field-label">Select Organization</label>
                                                        <div className='d-flex org-section'>

                                                            {instituteStatus ?
                                                                <span>
                                                                    {selectedOrg}<img src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />
                                                                </span> :
                                                                <span>
                                                                    {currentInstitute.FullName ? <>
                                                                        {currentInstitute.FullName} <img className='mx-2' src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />
                                                                    </> : null}
                                                                </span>}
                                                            <button className='popup-btn' onClick={() => openOrg(radioBtnStatus ? currentInstitute.FullName : selectedOrg)}>
                                                                <GoRepoPush />
                                                            </button>
                                                        </div>
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
                                                    <div className="user-form-4">
                                                        <div className="col" >
                                                            <label className="input-field-label">LinkedIn</label>
                                                            <input type="text" className="input-field" defaultValue={URLs.length ? URLs[0].LinkedIn : ""} aria-label="LinkedIn"
                                                                onChange={(e) => setUpdateData({ ...updateData, LinkedIn: e.target.value })} />
                                                        </div>
                                                        <div className="col" >
                                                            <label className="input-field-label">Twitter</label>
                                                            <input type="text" className="input-field" defaultValue={URLs.length ? URLs[0].Twitter : ""}
                                                                onChange={(e) => setUpdateData({ ...updateData, Twitter: e.target.value })} aria-label="LinkedIn" />
                                                        </div>
                                                        <div className="col" >
                                                            <label className="input-field-label">Facebook</label>
                                                            <input type="text" className="input-field" defaultValue={URLs.length ? URLs[0].Facebook : ""} onChange={(e) => setUpdateData({ ...updateData, Facebook: e.target.value })} aria-label="LinkedIn" />
                                                        </div>
                                                        <div className="col" >
                                                            <label className="input-field-label">Instagram</label>
                                                            <input type="text" className="input-field" defaultValue={URLs.length ? URLs[0].Instagram : ''}
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
                                                    <div className="user-form-5">
                                                        <div className="col">
                                                            <label className="input-field-label">Business Phone</label>
                                                            <input type="text" className="input-field" defaultValue={userData.WorkPhone ? userData.WorkPhone : ''} onChange={(e) => setUpdateData({ ...updateData, WorkPhone: e.target.value })} aria-label="Business Phone" />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Mobile-No</label>
                                                            <input type="text" className="input-field" defaultValue={userData.CellPhone ? userData.CellPhone : ''} onChange={(e) => setUpdateData({ ...updateData, CellPhone: e.target.value })} aria-label="Mobile-No" />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Home-Phone</label>
                                                            <input type="text" className="input-field" defaultValue={userData.HomePhone ? userData.HomePhone : ''} onChange={(e) => setUpdateData({ ...updateData, HomePhone: e.target.value })} aria-label="Home-Phone" />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">City</label>
                                                            <input type="text" className="input-field" defaultValue={userData.WorkCity ? userData.WorkCity : ''} onChange={(e) => setUpdateData({ ...updateData, WorkCity: e.target.value })} aria-label="City" />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Address</label>
                                                            <input type="text" className="input-field" defaultValue={userData.WorkAddress ? userData.WorkAddress : ''} onChange={(e) => setUpdateData({ ...updateData, WorkAddress: e.target.value })} aria-label="Address" />
                                                        </div>
                                                    </div>
                                                    <div className="user-form-5">
                                                        <div className="col">
                                                            <label className="input-field-label">Skpye</label>
                                                            <input type="text" className="input-field" placeholder="Skpye" defaultValue={userData.IM ? userData.IM : ""}
                                                                onChange={(e) => setUpdateData({ ...updateData, Skype: e.target.value })} aria-label="Skpye" />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Email</label>
                                                            <input type="text" className="input-field" defaultValue={userData.Email ? userData.Email : ""}
                                                                onChange={(e) => setUpdateData({ ...updateData, Email: e.target.value })} aria-label="Email" />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">WebPage</label>

                                                            <input className="input-field" type="text" defaultValue={userData.WebPage ? userData.WebPage.Url : ""} onChange={(e) => setUpdateData({ ...updateData, WebPage: e.target.value })} aria-label="WebPage" />

                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Zip Code</label>
                                                            <input type="text" className="input-field" defaultValue={userData.WorkZip ? userData.WorkZip : ""} onChange={(e) => setUpdateData({ ...updateData, WorkZip: e.target.value })} aria-label="Zip Code" />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Country</label>
                                                            <div className='d-flex org-section'>
                                                                <span> {currentCountry.length > 0 ?
                                                                    <>{currentCountry[0].Title ? <>{currentCountry[0].Title}  <img className='mx-2' src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' /></> : null}
                                                                    </>
                                                                    : null}
                                                                </span>
                                                                <button className='popup-btn' onClick={() => openCountry(userData.SmartCountries)}>
                                                                    <GoRepoPush />
                                                                </button>
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
                                            <button className={hrBtnStatus.personalInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrTabBtnStatus(e, "personal-info")}>PERSONAL INFORMATION</button>
                                            <button className={hrBtnStatus.bankInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrTabBtnStatus(e, "bank-info")}>BANK INFORMATION</button>
                                            <button className={hrBtnStatus.taxInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrTabBtnStatus(e, "tax-info")}>TAX INFORMATION</button>
                                            <button className={hrBtnStatus.socialSecurityInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrTabBtnStatus(e, "social-security-info")}>SOCIAL SECURITY INFORMATION</button>
                                            <button className={hrBtnStatus.qualificationInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeHrTabBtnStatus(e, "qualification-info")}>QUALIFICATIONS</button>
                                        </div>
                                        <div className="card-body">
                                            {HrTagData?.map((item: any, index) => {
                                                return (
                                                    <div key={index}>
                                                        {hrBtnStatus.personalInfo ? <div>
                                                            <div className='user-form-3'>
                                                                <div className="col">
                                                                    <label className="input-field-label">Federal state </label>
                                                                    <div className='d-flex org-section'>
                                                                        <span>{selectedState.Title != undefined && selectedState.Title != '' ?
                                                                            <>
                                                                                {selectedState.Title} <img className='mx-2' src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />
                                                                            </> : (item.Fedral_State ?
                                                                                <>{item.Fedral_State}
                                                                                    <img className='mx-2' src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />

                                                                                </>
                                                                                : '')}
                                                                        </span>
                                                                        <button className='popup-btn' onClick={(e) => selectState(e, item)}>
                                                                            <GoRepoPush />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">Nationality</label>
                                                                    <input type="text" className="input-field" defaultValue={item.Nationality ? item.Nationality : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, Nationality: e.target.value })} placeholder='Enter Nationality' />
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">Date of Birth</label>
                                                                    <input type="date" className="input-field"
                                                                        defaultValue={item.dateOfBirth ? Moment(item.dateOfBirth).format("YYYY-MM-DD") : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, dateOfBirth: Moment(e.target.value).format("YYYY-MM-DD") })} />
                                                                </div>
                                                            </div>
                                                            <div className='user-form-3'>
                                                                <div className="col">
                                                                    <label className="input-field-label">Place of birth</label>
                                                                    <input type="text" className="input-field" defaultValue={item.placeOfBirth} onChange={(e) => setHrUpdateData({ ...HrUpdateData, placeOfBirth: e.target.value })} placeholder='Enter Place of birth' />
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">Marital status</label>
                                                                    <select className="input-field" onChange={(e) => setHrUpdateData({ ...HrUpdateData, maritalStatus: e.target.value })}>
                                                                        {item.maritalStatus ? null :
                                                                            <option selected>Select an Option</option>
                                                                        }
                                                                        <option selected={item.maritalStatus == "Single"}>Single</option>
                                                                        <option selected={item.maritalStatus == "Married"}>Married</option>
                                                                        <option selected={item.maritalStatus == "Divorced"}>Divorced</option>
                                                                        <option selected={item.maritalStatus == "Widowed"}>Widowed</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">Parenthood</label>
                                                                    <div className='my-2'>
                                                                        <input type="radio" checked={HrUpdateData.Parenthood == 'yes'} onChange={(e) => setHrUpdateData({ ...HrUpdateData, Parenthood: 'yes' })} />
                                                                        <label className='mx-2' >Yes</label>
                                                                        <input type="radio" checked={HrUpdateData.Parenthood == 'no'} onChange={(e) => setHrUpdateData({ ...HrUpdateData, Parenthood: 'no' })} /><label className='mx-2'>No</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> : null}
                                                        {hrBtnStatus.bankInfo ?
                                                            <div className="card-body">
                                                                <div className='user-form-2'>
                                                                    <div className="col">
                                                                        <label className="input-field-label">IBAN</label>
                                                                        <input type="text" className="input-field" placeholder='Enter IBAN' defaultValue={item.IBAN ? item.IBAN : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, IBAN: e.target.value })} />
                                                                    </div>
                                                                    <div className="col mx-2">
                                                                        <label className="input-field-label">BIC</label>
                                                                        <input type="text" className="input-field" defaultValue={item.BIC ? item.BIC : ''} placeholder='Enter BIC' onChange={(e) => setHrUpdateData({ ...HrUpdateData, BIC: e.target.value })} />
                                                                    </div>
                                                                </div>
                                                            </div> : null}
                                                        {hrBtnStatus.taxInfo ?
                                                            <div className="card-body">
                                                                <div className='user-form-3'>
                                                                    <div className="col">
                                                                        <label className="input-field-label">Tax No.
                                                                        </label>
                                                                        <input type="text" className="input-field" placeholder='Enter Tax No.' defaultValue={item.taxNo ? item.taxNo : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, taxNo: e.target.value })} />
                                                                    </div>
                                                                    <div className="col mx-2">
                                                                        <label className="input-field-label">Tax class</label>
                                                                        <select className="input-field py-1" onChange={(e) => setHrUpdateData({ ...HrUpdateData, taxClass: e.target.value })}>
                                                                            {item.taxClass ? null :
                                                                                <option selected>Select an Option</option>
                                                                            }
                                                                            <option selected={item.taxClass == "I"}>I</option>
                                                                            <option selected={item.taxClass == "II"}>II</option>
                                                                            <option selected={item.taxClass == "III"}>III</option>
                                                                            <option selected={item.taxClass == "IV"}>IV</option>
                                                                            <option selected={item.taxClass == "V"}>V</option>
                                                                            <option selected={item.taxClass == "VI"}>VI</option>
                                                                            <option selected={item.taxClass == "none"}>None</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="col">
                                                                        <label className="input-field-label">Child allowance</label>
                                                                        <select className="input-field py-1" onChange={(e) => setHrUpdateData({ ...HrUpdateData, childAllowance: e.target.value })}>
                                                                            {item.childAllowance ? null :
                                                                                <option selected>Select an Option</option>
                                                                            }
                                                                            <option selected={item.childAllowance == "0.5"}>0.5</option>
                                                                            <option selected={item.childAllowance == "1"}>1</option>
                                                                            <option selected={item.childAllowance == "1.5"}>1.5</option>
                                                                            <option selected={item.childAllowance == "2"}>2</option>
                                                                            <option selected={item.childAllowance == "2.5"}>2.5</option>
                                                                            <option selected={item.childAllowance == "3"}>3</option>
                                                                            <option selected={item.childAllowance == "3.5"}>3.5</option>
                                                                            <option selected={item.childAllowance == "4"}>4</option>
                                                                            <option selected={item.childAllowance == "4.5"}>4.5</option>
                                                                            <option selected={item.childAllowance == "5"}>5</option>
                                                                            <option selected={item.childAllowance == "5.5"}>5.5</option>
                                                                            <option selected={item.childAllowance == "6"}>6</option>
                                                                            <option selected={item.childAllowance == "6.5"}>6.5</option>
                                                                            <option selected={item.childAllowance == "7"}>7</option>
                                                                            <option selected={item.childAllowance == "7.5"}>7.5</option>
                                                                            <option selected={item.childAllowance == "8"}>8</option>
                                                                            <option selected={item.childAllowance == "8.5"}>8.5</option>
                                                                            <option selected={item.childAllowance == "9"}>9</option>
                                                                            <option selected={item.childAllowance == "9.5"}>9.5</option>
                                                                            <option selected={item.childAllowance == "none"}>None</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className='user-form-2'>
                                                                    <div className="col">
                                                                        <label className="input-field-label">Church tax</label>
                                                                        <div className='my-2'>
                                                                            <input type="radio" onChange={(e) => setHrUpdateData({ ...HrUpdateData, churchTax: 'yes' })} checked={HrUpdateData.churchTax == 'yes'} /><label className='mx-2'>Yes</label>
                                                                            <input type="radio" onChange={(e) => setHrUpdateData({ ...HrUpdateData, churchTax: 'no' })} checked={HrUpdateData.churchTax == 'no'} /><label className='mx-2'>No</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col">
                                                                        <label className="input-field-label">Monthly tax allowance</label>
                                                                        <input type="number" className="input-field" placeholder='Enter Monthly tax allowance' defaultValue={item.monthlyTaxAllowance ? item.monthlyTaxAllowance : ''} />
                                                                    </div>

                                                                </div>
                                                            </div> : null}
                                                        {hrBtnStatus.socialSecurityInfo ? <div className="card-body">
                                                            <div className='user-form-3'>

                                                                <div className="col">
                                                                    <label className="input-field-label">Health Insurance Type</label>
                                                                    <select className="input-field py-1" onChange={(e) => setHrUpdateData({ ...HrUpdateData, healthInsuranceType: e.target.value })}>
                                                                        {item.healthInsuranceType ? null :
                                                                            <option selected>Select an Option</option>
                                                                        }
                                                                        <option selected={item.healthInsuranceType == "None"}>None</option>
                                                                        <option selected={item.healthInsuranceType == "Statutory"}>Statutory</option>
                                                                        <option selected={item.healthInsuranceType == "Private"}>Private</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">Health Insurance Company
                                                                    </label>
                                                                    <input type="text" className="input-field py-1" placeholder='Enter Company Name' defaultValue={item.healthInsuranceCompany ? item.healthInsuranceCompany : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, healthInsuranceCompany: e.target.value })} />
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">Health Insurance No
                                                                    </label>
                                                                    <input type="text" className="input-field" placeholder='Enter Health Insurance No' defaultValue={item.insuranceNo ? item.insuranceNo : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, insuranceNo: e.target.value })} />
                                                                </div>
                                                            </div>

                                                        </div> : null}
                                                        {hrBtnStatus.qualificationInfo ?
                                                            <div className='card-body'>
                                                                <div className='user-form-2'>
                                                                    <div className="col">
                                                                        <label className="input-field-label">Highest school diploma
                                                                        </label>
                                                                        <input type="text" className="input-field" placeholder='Enter Highest school diploma' defaultValue={item.highestSchoolDiploma ? item.highestSchoolDiploma : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, highestSchoolDiploma: e.target.value })} />
                                                                    </div>
                                                                    <div className="col">
                                                                        <label className="input-field-label">Highest vocational education
                                                                        </label>
                                                                        <input type="text" className="input-field" placeholder='Enter Highest vocational education' defaultValue={item.highestVocationalEducation ? item.highestVocationalEducation : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, highestVocationalEducation: e.target.value })} />
                                                                    </div>
                                                                </div>
                                                                <div className='user-form-2'>
                                                                    <div className="col">
                                                                        <label className="input-field-label">Other qualifications
                                                                        </label>
                                                                        <input type="text" className="input-field" placeholder='Enter Other qualifications' defaultValue={item.otherQualifications ? item.otherQualifications : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, otherQualifications: e.target.value })} />
                                                                    </div>
                                                                    <div className="col">
                                                                        <label className="input-field-label">Languages
                                                                        </label>
                                                                        <input type="text" className="input-field" />
                                                                    </div>
                                                                </div>
                                                            </div> : null}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div> : null}
                                {btnStatus.smalsusInfo ? <div>
                                    <div className="card">
                                        <div className="card-header">
                                            <button className={SmalsusBtnStatus.personalInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "personal-info")}>PERSONAL INFORMATION</button>
                                            <button className={SmalsusBtnStatus.bankInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "bank-info")}>BANK INFORMATION</button>
                                            <button className={SmalsusBtnStatus.taxInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "tax-info")}>TAX INFORMATION</button>
                                            <button className={SmalsusBtnStatus.socialSecurityInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "social-security-info")}>SOCIAL SECURITY INFORMATION</button>
                                            <button className={SmalsusBtnStatus.qualificationInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "qualification-info")}>QUALIFICATIONS</button>
                                        </div>
                                        <div className="card-body">

                                            <div>
                                                {SmalsusBtnStatus.personalInfo ? <div>
                                                    <div className='user-form-4'>

                                                        <div className="col">
                                                            <label className='input-field-label'>Adhar Card No. </label>
                                                            <input type="text" className="input-field" aria-label="Adhar Card No. " placeholder='Adhar Card No. ' />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">PAN Card No.</label>
                                                            <input type="text" className="input-field" aria-label="PAN Card No." placeholder='PAN Card No.' />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Passport No.</label>
                                                            <input type="text" className="input-field" aria-label="Passport No." placeholder='Passport No.' />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Personal Email</label>
                                                            <input type="text" className="input-field" aria-label="JobTitle" placeholder='Job-Title' />
                                                        </div>
                                                    </div>
                                                    <div className='user-form-4'>
                                                        <div className="col">
                                                            <label className="input-field-label">Nationality</label>
                                                            <input type="text" className="input-field" placeholder='Enter Nationality' />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Marital status</label>
                                                            <select className="input-field">
                                                                <option selected>Select an Option</option>
                                                                <option>Single</option>
                                                                <option>Married</option>
                                                                <option>Divorced</option>
                                                                <option>Widowed</option>
                                                            </select>
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Blood Group</label>
                                                            <input type='text' className='input-field' placeholder='Enter Your Blood Group' />
                                                        </div>
                                                        <div className="col">
                                                            <label className="input-field-label">Date of Birth</label>
                                                            <input type="date" className="input-field" />
                                                        </div>

                                                    </div>
                                                    <div className='card my-2'>
                                                        <div className='card-header'>
                                                            <h3>Permanent Address</h3>
                                                        </div>
                                                        <div className='card-body'>
                                                            <div className='user-form-4'>
                                                                <div className="col">
                                                                    <label className="input-field-label">Country</label>
                                                                    <input type="text" className="input-field" placeholder='Country' />
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">State</label>
                                                                    <input type="text" className="input-field" placeholder='State' />
                                                                </div>
                                                                <div className="col">
                                                                    <label className='input-field-label'>City</label>
                                                                    <input type="text" className="input-field" placeholder='City' />
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">District</label>
                                                                    <input type="text" className="input-field" placeholder='District' />
                                                                </div>
                                                            </div>
                                                            <div className='user-form-4'>
                                                               
                                                                <div className="col">
                                                                    <label className='input-field-label'>Street</label>
                                                                    <input type="text" className="input-field" placeholder='Street' />
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">Area</label>
                                                                    <input type="text" className="input-field" placeholder='Area' />
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">Landmark</label>
                                                                    <input type="text" className="input-field" placeholder='Landmark' />
                                                                </div>
                                                                <div className="col">
                                                                    <label className="input-field-label">Zip Code</label>
                                                                    <input type="text" className="input-field" placeholder='Zip Code' />
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> : null}
                                                {SmalsusBtnStatus.bankInfo ?
                                                    <div className="card-body">
                                                        <div className='user-form-2'>
                                                            <div className="col">
                                                                <label className='input-field-label'>Bank Name</label>
                                                                <input type="text" className="input-field" placeholder='Bank Name' />
                                                            </div>
                                                            <div className="col">
                                                                <label className="input-field-label">Account Number</label>
                                                                <input type="text" className="input-field" placeholder='Account Number' />
                                                            </div>
                                                        </div>
                                                        <div className='user-form-2'>
                                                            <div className="col">
                                                                <label className="input-field-label">IFSC</label>
                                                                <input type="text" className="input-field" placeholder='IFSC' />
                                                            </div>
                                                            <div className="col">
                                                                <label className="input-field-label">Branch Name</label>
                                                                <input type="number" className="input-field" placeholder='Branch Name' />
                                                            </div>
                                                        </div>
                                                    </div> : null}
                                                {SmalsusBtnStatus.taxInfo ?
                                                    <div className="card-body">
                                                        <div className='user-form-3'>
                                                            <div className="col">
                                                                <label className="input-field-label">UN Number
                                                                </label>
                                                                <input type="text" className="input-field" placeholder='Enter UN Number' />
                                                            </div>
                                                            <div className="col">
                                                                <label className="input-field-label">ITR Number
                                                                </label>
                                                                <input type="text" className="input-field" placeholder='Enter ITR Number' />
                                                            </div>
                                                            <div className="col">
                                                                <label className="input-field-label">Income Tax</label>
                                                                <input type="text" className="input-field" placeholder='Income Tax' />
                                                            </div>


                                                        </div>
                                                        <div className='user-form-2'>
                                                            <div className="col">
                                                                <label className="input-field-label">{`(PF) Provident Fund nomination form`}</label>
                                                                <input type="text" className="input-field" placeholder='Provident Fund nomination form' />
                                                            </div>
                                                            <div className="col">
                                                                <label className="input-field-label">Employee State Insurance (ESI)</label>
                                                                <input type="text" className="input-field" />
                                                            </div>

                                                        </div>
                                                    </div>
                                                    : null}
                                                {SmalsusBtnStatus.socialSecurityInfo ?
                                                    <div className="card-body">
                                                        <div className='user-form-2'>
                                                            <div className="col">
                                                                <label className="input-field-label">Health Insurance Type</label>
                                                                <select className="input-field py-1" >
                                                                    <option selected>Select an Option</option>
                                                                    <option>None</option>
                                                                    <option >Statutory</option>
                                                                    <option >Private</option>
                                                                </select>
                                                            </div>
                                                            <div className="col">
                                                                <label className="input-field-label">Health Insurance Company
                                                                </label>
                                                                <input type="text" className="input-field py-1" placeholder='Enter Company Name' />
                                                            </div>
                                                        </div>
                                                        <div className='user-form-2'>
                                                            <div className="col">
                                                                <label className="input-field-label">Health Insurance Number
                                                                </label>
                                                                <input type="text" className="input-field py-1" placeholder='Enter Company Number' />
                                                            </div>
                                                            <div className="col">
                                                                <label className="input-field-label">{`Medical History (Insurance and medical policy)`}
                                                                </label>
                                                                <input type="text" className="input-field py-1" placeholder='Enter Medical History (Insurance and medical policy)' />
                                                            </div>
                                                        </div>

                                                    </div> : null}
                                                {SmalsusBtnStatus.qualificationInfo ?
                                                    <div className='card-body'>
                                                        <div className='user-form-2'>
                                                            <div className="col">
                                                                <label className="input-field-label">Highest school diploma
                                                                </label>
                                                                <input type="text" className="input-field" placeholder='Enter Highest school diploma' />
                                                            </div>
                                                            <div className="col">
                                                                <label className="input-field-label">Highest vocational education
                                                                </label>
                                                                <input type="text" className="input-field" placeholder='Enter Highest vocational education' />
                                                            </div>
                                                        </div>
                                                        <div className='user-form-2'>
                                                            <div className="col">
                                                                <label className="input-field-label">Other qualifications
                                                                </label>
                                                                <input type="text" className="input-field" placeholder='Enter Other qualifications' />
                                                            </div>
                                                            <div className="col">
                                                                <label className="input-field-label">Languages
                                                                </label>
                                                                <input type="text" className="input-field" />
                                                            </div>
                                                        </div>
                                                    </div> : null}
                                            </div>

                                        </div>
                                    </div>
                                </div> : null}
                            </div>
                            <div className="card-footer">
                                <div className="card-body d-flex justify-content-between">
                                    <div>
                                        <div>Created at
                                            <b> {userData.Created ? Moment(userData.Created).format("DD/MM/YYYY") : ''}</b> by
                                            <b> {userData.FullName ? userData.FullName : ''}</b>
                                        </div>
                                        <div>Last modified
                                            <b> {userData.Modified ? Moment(userData.Modified).format("DD/MM/YYYY") : ''}</b> by
                                            <b> {userData.Editor ? userData.Editor.Title : ''}</b>
                                        </div>
                                        <button className="delete-btn" onClick={deleteUserDtl}>
                                            Delete This Contact
                                            <img className='mx-1' src="https://hhhhteams.sharepoint.com/_layouts/images/delete.gif" />
                                        </button>
                                    </div>
                                    <div className='links-and-buttons'>
                                        <a href='./'>Go to profile page |</a>
                                        <a href='./'> Manage Contact-Categories |</a>
                                        <a href='./'> Open out-of-the-box form</a>
                                        <div className='d-flex justify-content-end my-2'>
                                            <button className='save-btn' onClick={UpdateDetails}>Save</button>
                                            <button className='cancel-btn' onClick={() => callBack()} >Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {status.orgPopup ? <OrgContactEditPopup callBack={CloseOrgPopup} orgChange={orgCallBack} institutionName={selectedOrg} selectedStatus={selectedOrgStatus} /> : null}
            {status.countryPopup ? <CountryContactEditPopup popupName="Country" selectedCountry={currentCountry} callBack={CloseCountryPopup} data={countryData} selectedCountryStatus={selectedCountryStatus} /> : null}
            {status.statePopup ? <CountryContactEditPopup popupName="State" selectedStateStatus={selectedStateStatus} selectedState={selectedState} callBack={CloseCountryPopup} data={stateData} /> : null}
        </div >
    )
}
export default HHHHEditComponent;