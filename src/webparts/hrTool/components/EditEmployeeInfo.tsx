import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import '../components/EditEmployeeInfo.css';
import '../components/hrportal.css';
import '../components/EmployeeInfo';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';
import Button from 'react-bootstrap/Button';

const EditEmployeeInfo = ((props: any) => {
    console.log("...... EditEmployeeData", props)
    const [formData, setFormData] = useState({
        Title: '', additionalContributionToHI: '', levy2ContributionRate: '', levy1ReimbursementRate: '',
        levy1RateOfContribution: '', levy1Type: '', healthInsuranceCompany: '', healthInsuranceType: '', PersonGroupKey: '', Country: '', Fedral_State: '',
        BIC: '', IBAN: '', contributionGroupNCI: '', contributionGroupUI: '', contributionGroupRI: '', contributionGroupHi: '', Parenthood: '',
        insuranceNo: '', childAllowance: '', monthlyTaxAllowance: '', solidaritySurcharge: '', taxClass: '', churchTax: '', taxNo: '', incomeTax: '',
        taxFreePayments: '', otherQualifications: '', highestVocationalEducation: '', highestSchoolDiploma: '', ZIP_x0020_Code: '', No_x002e_: '',
        City: '', Street: '', maritalStatus: '', Nationality: '', placeOfBirth: '', dateOfBirth: '', contributionStatus: '', NRPSubToTax: '',
        NRPNotSubToTax: '', FirstName: '', WorkPhone: '', CellPhone: '', HomePhone: '', IM: '', Email: '', WorkAddress: '', WorkCity: '', WorkZip: '',
    })
    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => setLgShow(false);
    let AllSmartcountry: any[] = [];
    let AllSmartState: any[] = [];
    let AllSmartLanguage: any[] = [];
    const [EmployeeData, setEmployeeData] = useState(null);
    const [ShowAllInstituion, setShow] = useState(false);
    const OrganisationPopupClose = () => setShow(false);
    const AllInstituionShow = () => setShow(true);
    const [AllContactInstituion, setAllContactInstituion] = useState([]);

    useEffect(() => {
        loadSmartTaxonomyItems();
        LoadEmployeeData();
        LoadAllInstituion();
    }, []);


    //Load Smartmetadata
    const getSmartlanguageTitle = (Item: any, AllTaxonomyItems: any) => {
        var smartLanguage = '';
        let inndex = 1;
        if (Item.SmartLanguagesId != undefined) {
            Item.SmartLanguagesId.map((countrieId: any, index: any) => {
                inndex += index;
                AllTaxonomyItems.map((taxonomyItem: any) => {
                    if (taxonomyItem.Id == countrieId) {
                        if (inndex < Item.SmartLanguagesId.length)
                            smartLanguage += taxonomyItem.Title + ',';
                        else
                            smartLanguage += taxonomyItem.Title;
                    }
                })
            })
        }
        return smartLanguage;
    }

    ////loadSmartTaxonomyItems Data Load

    const loadSmartTaxonomyItems = async () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH');
        await web.lists.getById('d1c6d7c3-f36e-4f95-8715-8da9f33622e7').items.select("Id,SmartSuggestions,Title,SmartFilters,ParentID,Parent/Id,Parent/Title,SortOrder,Selectable,TaxType").expand("Parent").orderBy("SortOrder").top(4999).get()
            .then((data) => {
                console.log(data);
                data.map((taxItem: any) => {
                    if (taxItem.Title != 'Blank' && taxItem.Title != 'Database Status') {
                        if (taxItem.TaxType == 'Countries') {
                            AllSmartcountry.push(taxItem);
                        }
                        if (taxItem.TaxType == 'State') {
                            AllSmartState.push(taxItem);
                        }
                        if (taxItem.TaxType == 'Main Language') {
                            AllSmartLanguage.push(taxItem);
                        }
                    }
                })
            }).catch((err) => {
                console.log(err.message);
            });
    }


    // employeeInfo ALl Information Data Start......
    const LoadEmployeeData = async () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
        await web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.select("Id,additionalContributionToHI,CellPhone,NRPNotSubToTax,NRPSubToTax,HomePhone,FirstName,IM,SmartLanguagesId,WorkCity,WorkZip,WorkAddress,WorkPhone,Email,Item_x0020_Cover,SmartContactId,Title,JobTitle,WebPage,SmartCountriesId,SmartStateId,Institution/Id,Institution/Title,SocialMediaUrls,levy2ContributionRate,SmartInstitutionId,contributionStatus,StaffID,netNonRecurringPayments,levy1ReimbursementRate,levy1RateOfContribution,levy1Type,healthInsuranceCompany,healthInsuranceType,NonRecurringPayments,PersonGroupKey,Country,Fedral_State,BIC,IBAN,contributionGroupNCI,contributionGroupUI,contributionGroupRI,contributionGroupHi,Parenthood,insuranceNo,childAllowance,monthlyTaxAllowance,solidaritySurcharge,taxClass,churchTax,taxNo,incomeTax,taxFreePayments,Languages,otherQualifications,highestVocationalEducation,highestSchoolDiploma,ZIP_x0020_Code,No_x002e_,City,Street,maritalStatus,Nationality,placeOfBirth,dateOfBirth,Created,Author/Title,Modified,Editor/Title,EmployeeID/Title,EmployeeID/Id").expand("EmployeeID,Institution,Author,Editor").filter("Id eq " + props.props).get()
            .then((data) => {
                console.log(data);
                data[0].SocialMediaUrls = JSON.parse(data[0].SocialMediaUrls)
                if (data[0].SmartCountriesId[0] != undefined) {
                    AllSmartcountry.map((country) => {
                        if (data[0].SmartCountriesId[0] == country.Id) {
                            data[0].SmartCountry = country.Title;
                        }
                    })
                }
                if (data[0].SmartStateId[0] != undefined) {
                    AllSmartState.map((state) => {
                        if (data[0].SmartStateId[0] == state.Id) {
                            data[0].FederalState = state.Title;
                        }
                    })
                }
                // if (data[0].Item_x0020_Cover != undefined && data[0].Item_x0020_Cover != '') {
                //     setImage(true);
                // }
                data[0]['LanguagesTextVal'] = getSmartlanguageTitle(data[0], AllSmartLanguage);
                setEmployeeData(data[0]);
                setFormData(data[0])
            }).catch((err) => {
                console.log(err.message);
            });
    }


    const UpdateDetails = async () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
        await web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.getById(props.props).update({
            additionalContributionToHI: formData.additionalContributionToHI,
            levy2ContributionRate: formData.levy2ContributionRate,
            levy1ReimbursementRate: formData.levy1ReimbursementRate,
            levy1RateOfContribution: formData.levy1RateOfContribution,
            levy1Type: formData.levy1Type,
            healthInsuranceCompany: formData.healthInsuranceCompany,
            healthInsuranceType: formData.healthInsuranceType,
            PersonGroupKey: formData.PersonGroupKey,
            Country: formData.Country,
            Fedral_State: formData.Fedral_State,
            BIC: formData.BIC,
            IBAN: formData.IBAN,
            contributionGroupNCI: formData.contributionGroupNCI,
            contributionGroupUI: formData.contributionGroupUI,
            contributionGroupRI: formData.contributionGroupRI,
            contributionGroupHi: formData.contributionGroupHi,
            Parenthood: formData.Parenthood,
            insuranceNo: formData.insuranceNo,
            childAllowance: formData.childAllowance,
            monthlyTaxAllowance: formData.monthlyTaxAllowance,
            solidaritySurcharge: formData.solidaritySurcharge != '' ? formData.solidaritySurcharge : null,
            taxClass: formData.taxClass,
            churchTax: formData.churchTax,
            taxNo: formData.taxNo,
            incomeTax: formData.incomeTax != '' ? formData.incomeTax : null,
            taxFreePayments: formData.taxFreePayments != '' ? formData.taxFreePayments : 0,
            otherQualifications: formData.otherQualifications,
            highestVocationalEducation: formData.highestVocationalEducation,
            highestSchoolDiploma: formData.highestSchoolDiploma,
            ZIP_x0020_Code: formData.ZIP_x0020_Code,
            No_x002e_: formData.No_x002e_,
            City: formData.City,
            Street: formData.Street,
            maritalStatus: formData.maritalStatus,
            Nationality: formData.Nationality,
            placeOfBirth: formData.placeOfBirth,
            dateOfBirth: formData.dateOfBirth,
            contributionStatus: formData.contributionStatus,
            NRPSubToTax: formData.NRPSubToTax,
            NRPNotSubToTax: formData.NRPNotSubToTax,
            FirstName: formData.FirstName,
            Title: formData.Title,
            WorkPhone: formData.WorkPhone,
            CellPhone: formData.CellPhone,
            HomePhone: formData.HomePhone,
            IM: formData.IM,
            Email: formData.Email,
            WorkAddress: formData.WorkAddress,
            WorkCity: formData.WorkCity,
            WorkZip: formData.WorkZip
        }).then((e: any) => {
            alert("Data post Successfully")
            handleClose();

        })
            .catch((err: { message: any; }) => {
                console.log(err.message);
            });
    }

    const handleChange = (e: any, name: any) => {
        setFormData({
            ...formData,
            [name]: e.target.value
        })
    }





    const LoadAllInstituion = async () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH');
        await web.lists.getById('9f13fd36-456a-42bc-a5e0-cd954d97fc5f').items.select("Id,Title,WorkCity,WorkCountry,ItemType").top(4999).get()
            .then((data) => {
                console.log("...*****", data);
                setAllContactInstituion(data);
            }).catch((err) => {
                console.log(err.message);
            });
    }









    return (
        <div>
            {/* <img onClick={() => setLgShow(true)} ng-src="/_layouts/images/edititem.gif" data-themekey="#" src="/_layouts/images/edititem.gif" /> */}
            <div className="mx-auto">
                <span>
                    <span onClick={() => setLgShow(true)} style={{ padding: 3 }} className="btn btn-outline btn-primary">
                        <img src="/_layouts/images/edititem.gif" />Edit HR Details</span>
                </span>
            </div>
            <Modal
                size="xl"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <span className='modal-title' id="example-modal-sizes-title-lg">
                        <span><strong>EditEmployeeInfo</strong></span>
                    </span>
                    <button type="button" className='Close-button' onClick={handleClose}>×</button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <div>
                        {EmployeeData &&
                            <div className="col-sm-12 Edit-tab" aria-colspan={12}>
                                <input id="BASICINFORMATION" type="radio" defaultChecked={true} name="Edit" />
                                <input id="IMAGEINFORMATION" type="radio" name="Edit" />
                                <input id="BANKINFORMATION" type="radio" name="Edit" />
                                <input id="TAXINFORMATION" type="radio" name="Edit" />
                                <input id="SOCIALSECURITYINFORMATION" type="radio" name="Edit" />
                                <input id="EDITQUALIFICATIONS" type="radio" name="Edit" />
                                <nav>
                                    <ul>
                                        <li className="BASICINFORMATION">
                                            <label htmlFor="BASICINFORMATION">BASIC INFORMATION</label>
                                        </li>
                                        <li className="IMAGEINFORMATION">
                                            <label htmlFor="IMAGEINFORMATION">IMAGE INFORMATION</label>
                                        </li>
                                        <li className="BANKINFORMATION">
                                            <label htmlFor="BANKINFORMATION">BANK INFORMATION</label>
                                        </li>
                                        <li className="TAXINFORMATION">
                                            <label htmlFor="TAXINFORMATION">TAX INFORMATION</label>
                                        </li>
                                        <li className="SOCIALSECURITYINFORMATION">
                                            <label htmlFor="SOCIALSECURITYINFORMATION">SOCIAL SECURITY INFORMATION</label>
                                        </li>
                                        <li className="EDITQUALIFICATIONS">
                                            <label htmlFor="EDITQUALIFICATIONS">SOCIAL SECURITY INFORMATION</label>
                                        </li>
                                    </ul>
                                </nav>
                                <section>
                                    <div className="BASICINFORMATION clearfix">
                                        <div className="TAB1 clearfix">
                                            <div className="col-sm-12 pad0">
                                                <fieldset className="fieldsett">
                                                    <legend className="activity">General</legend>
                                                    <div className="row form-group clearfix">
                                                        <div className="col-sm-2">
                                                            <label className="full_width">First Name</label>
                                                            <input type="text" className="form-control" ng-required="true"
                                                                defaultValue={EmployeeData.FirstName} onChange={(e) => handleChange(e, 'FirstName')} />
                                                        </div>
                                                        <div className="col-sm-2">
                                                            <label className="full_width">Last Name</label>
                                                            <input type="text" className="form-control" defaultValue={EmployeeData.Title} onChange={(e) => handleChange(e, 'Title')} />
                                                        </div>
                                                        <div className="col-sm-1">
                                                            <label className="full_width">Suffix</label>
                                                            <input type="text" className="form-control" defaultValue={EmployeeData.Suffix} onChange={(e) => handleChange(e, 'Suffix')} />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <div className="position-relative" ng-show="selectedInstituion.length==0">

                                                                <label>Organisation</label>
                                                                {!EmployeeData.Institution.Title && <><input type="text" className="form-control ui-autocomplete-input" defaultValue={EmployeeData.Institution.Title}
                                                                    id="txtInstitutioncart" autoComplete="off" /><span role="status" aria-live="polite"
                                                                        className="ui-helper-hidden-accessible"></span></>}
                                                                <span className="edit-icons position-absolute">
                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png"
                                                                        onClick={AllInstituionShow} />
                                                                </span>
                                                            </div>

                                                            {EmployeeData.Institution.Title && <div className="position-relative">
                                                                <div className="block mb-20" title={EmployeeData.Institution.Title}>
                                                                    <a className="hreflink" target="_blank" href={EmployeeData.Institution.Title}>{EmployeeData.Institution.Title}</a>
                                                                    <a className="hreflink">
                                                                        <img src="/_layouts/images/delete.gif" />
                                                                    </a>
                                                                </div>
                                                            </div>}
                                                        </div>
                                                        <div className="col-sm-2">
                                                            <label className="full_width">Job Title</label>
                                                            <input type="text" className="form-control" defaultValue={EmployeeData.JobTitle} onChange={(e) => handleChange(e, 'JobTitle')} />
                                                        </div>

                                                        <div className="col-sm-2">
                                                            <div className="col-sm-11 pad0">
                                                                <label className="full_width">
                                                                    Division
                                                                    <select ng-show="Item.Institution.Title !='SDC'" className="form-control"
                                                                        ng-model="Item.Division.Id"
                                                                        ng-options="item.Id as item.Title for item in AllDivisions"
                                                                        ng-change="chnagedivision(Item.Division.Id)">
                                                                        <option value="">Select Division</option>
                                                                    </select>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>


                                            <div className="col-sm-12 pad0 mt-5">

                                                <fieldset className="fieldsett">
                                                    <legend className="activity">Social Media Accounts</legend>

                                                    <div className=" row form-group clearfix">
                                                        <div className="col-sm-3 ">
                                                            <label className="full_width">
                                                                LinkedIn <a className="hreflink"
                                                                    href={EmployeeData.SocialMediaUrls?.[0]?.LinkedIn} target="_blank">
                                                                    <span className="pull-right">
                                                                        <i className="fa fa-linkedin"></i>
                                                                    </span>
                                                                </a>
                                                            </label>
                                                            <input type="text" className="form-control"
                                                                defaultValue={EmployeeData.SocialMediaUrls?.[0]?.LinkedIn} />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="full_width">
                                                                Twitter <a className="hreflink"
                                                                    href={EmployeeData.SocialMediaUrls?.[0]?.Twitter} target="_blank">
                                                                    <span className="pull-right">
                                                                        <i className="fa fa-twitter"></i>
                                                                    </span>
                                                                </a>
                                                            </label>
                                                            <input type="text" className="form-control" defaultValue={EmployeeData.SocialMediaUrls?.[0]?.Twitter} />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="full_width">
                                                                Facebook <a className="hreflink"
                                                                    href={EmployeeData.SocialMediaUrls?.[0]?.Facebook} target="_blank">
                                                                    <span className="pull-right">
                                                                        <i className="fa fa-facebook"></i>
                                                                    </span>
                                                                </a>
                                                            </label>
                                                            <input type="text" className="form-control"
                                                                defaultValue={EmployeeData.SocialMediaUrls?.[0]?.Facebook} />
                                                        </div>
                                                        <div className="col-sm-3">
                                                            <label className="full_width">
                                                                Instagram <a className="hreflink"
                                                                    href={EmployeeData.SocialMediaUrls?.[0]?.Instagram} target="_blank">
                                                                    <span className="pull-right">
                                                                        <i className="fa fa-instagram"></i>
                                                                    </span>
                                                                </a>
                                                            </label>
                                                            <input type="text" className="form-control"
                                                                defaultValue={EmployeeData.SocialMediaUrls?.[0]?.Instagram} />
                                                        </div>
                                                    </div>



                                                </fieldset>
                                            </div>


                                            <div className="col-sm-12 pad0 mt-5">

                                                <fieldset className="fieldsett">
                                                    <legend className="activity">Contact</legend>
                                                    <div className="row form-group">
                                                        <div className="row col-sm-12 bdrgt-clr">
                                                            <div className="col-sm-4">
                                                                <label className="full_width">Business Phone</label>
                                                                <input type="text" className="form-control" defaultValue={EmployeeData.WorkPhone} onChange={(e) => handleChange(e, 'WorkPhone')} />
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <label className="full_width">Mobile Number</label>
                                                                <input type="text" className="form-control" defaultValue={EmployeeData.CellPhone} onChange={(e) => handleChange(e, 'CellPhone')} />
                                                            </div>
                                                            <div className="col-sm-4">
                                                                <label className="full_width">Home Phone</label>
                                                                <input type="text" className="form-control" defaultValue={EmployeeData.HomePhone} onChange={(e) => handleChange(e, 'HomePhone')} />
                                                            </div>
                                                            <div className="col-sm-4 mt-5">
                                                                <label className="full_width">Skype</label>
                                                                <input type="text" className="form-control" defaultValue={EmployeeData.IM} onChange={(e) => handleChange(e, 'IM')} />
                                                            </div>
                                                            <div className="col-sm-4 mt-5" title="Email">
                                                                <label className="full_width">Email</label>
                                                                <input type="text" className="form-control" defaultValue={EmployeeData.Email} onChange={(e) => handleChange(e, 'Email')} />
                                                            </div>
                                                            <div className="col-sm-4 mt-5">
                                                                <form name="validURLFormforWebPage">
                                                                    <label className="full_width">WebPage</label>
                                                                    <input type="text" className="form-control" name="WebPage"
                                                                        ng-pattern="/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,7}(:[0-9]{1,7})?(\/.*)?$/"
                                                                        ng-model="Item.WebPage.Url" />
                                                                    <span className="StarRed"
                                                                        ng-show="validURLFormforWebPage.WebPage.$error.pattern">
                                                                    </span>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>

                                            <div className="col-sm-12 pad0">
                                                <fieldset className="fieldsett row">
                                                    <legend className="activity">Personal Information</legend>

                                                    <div className="col-sm-2 form-group">
                                                        <label className="full_width">Address</label>

                                                        <input type="text" className="form-control"
                                                            ng-model="Item.WorkAddress" defaultValue={EmployeeData.WorkAddress} onChange={(e) => handleChange(e, 'WorkAddress')} />
                                                    </div>
                                                    <div className="col-sm-2 form-group">
                                                        <label htmlFor="Nationality">Nationality</label>
                                                        <input type="text" className="form-control" id="Nationality"
                                                            placeholder="Enter Nationality" defaultValue={EmployeeData.Nationality} onChange={(e) => handleChange(e, 'Nationality')} />
                                                    </div>
                                                    <div className="col-sm-2 form-group">
                                                        <label htmlFor="dateOfBirth ">Date of birth</label>
                                                        <input type="date" className="form-control" id="dateOfBirth" defaultValue={EmployeeData ? moment(EmployeeData.dateOfBirth).format('YYYY-MM-DD') : ''} onChange={(e) => handleChange(e, 'dateOfBirth')} />
                                                    </div>
                                                    <div className="col-sm-2 form-group">
                                                        <label htmlFor="PlaceOfBirth">Place of birth</label>
                                                        <input type="text" className="form-control" id="PlaceOfBirth"
                                                            placeholder="Enter Place of birth" defaultValue={EmployeeData.placeOfBirth} onChange={(e) => handleChange(e, 'placeOfBirth')} />
                                                    </div>

                                                    <div className="col-sm-2 form-group">
                                                        <label htmlFor="Marital">Marital status</label>
                                                        <select defaultValue={EmployeeData.maritalStatus} className="form-control" id="Marital" onChange={(e) => handleChange(e, 'maritalStatus')}>
                                                            <option selected>Select an Option</option>
                                                            <option value="Single">Ledig</option>
                                                            <option value="Married">Verheiratet</option>
                                                            <option value="Divorced">Geschieden</option>
                                                            <option value="Widowed">Verwitwet</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-2 form-group">
                                                        <label htmlFor="Parenthood">Parenthood</label>
                                                        <div className="form-check-inline form-group-border mb-0">
                                                            <div className="form-check form-check-inline">
                                                                <input defaultChecked={EmployeeData.Parenthood == "yes"} value="yes" onChange={(e) => handleChange(e, 'Parenthood')}
                                                                    id="ParenthoodYes" name="Parenthood" type="radio" className="form-check-input" />
                                                                <label className="form-check-label" htmlFor="ParenthoodYes">YES</label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <input defaultChecked={EmployeeData.Parenthood == "no"} value="no" onChange={(e) => handleChange(e, 'Parenthood')}
                                                                    id="ParenthoodNO" name="Parenthood" type="radio" className="form-check-input" />
                                                                <label className="form-check-label" htmlFor="ParenthoodNO">NO</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-2 form-group">
                                                        <label className="full_width">City</label>
                                                        <input type="text" className="form-control"
                                                            ng-model="Item.WorkCity" defaultValue={EmployeeData.WorkCity} onChange={(e) => handleChange(e, 'WorkCity')} />
                                                    </div>

                                                    <div className="col-sm-2">
                                                        <label className="full_width">ZIP Code</label>

                                                        <input type="text"
                                                            className="form-control ng-pristine ng-valid ng-touched"
                                                            ng-model="Item.WorkZip" defaultValue={EmployeeData.WorkZip} onChange={(e) => handleChange(e, 'WorkZip')} />

                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="position-relative" ng-show="selectedInstituion.length==0">

                                                            <label>Country</label>
                                                            {!EmployeeData.SmartCountry && <><input type="text" className="form-control ui-autocomplete-input" defaultValue={EmployeeData.SmartCountry}
                                                                id="txtInstitutioncart" autoComplete="off" /><span role="status" aria-live="polite"
                                                                    className="ui-helper-hidden-accessible"></span></>}
                                                            <span className="edit-icons position-absolute">
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png" />
                                                            </span>
                                                        </div>

                                                        {EmployeeData.SmartCountry && <div className="position-relative">
                                                            <div className="block mb-20" title={EmployeeData.SmartCountry}>
                                                                <a className="hreflink" target="_blank" href={EmployeeData.SmartCountry}>{EmployeeData.SmartCountry}</a>
                                                                <a className="hreflink">
                                                                    <img src="/_layouts/images/delete.gif" />
                                                                </a>
                                                            </div>
                                                        </div>}
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="position-relative" ng-show="selectedInstituion.length==0">
                                                            <label>Federal state</label>
                                                            {!EmployeeData.FederalState && <><input type="text" className="form-control ui-autocomplete-input" defaultValue={EmployeeData.FederalState}
                                                                id="txtInstitutioncart" autoComplete="off" /><span role="status" aria-live="polite"
                                                                    className="ui-helper-hidden-accessible"></span></>}
                                                            <span className="edit-icons position-absolute">
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png" />
                                                            </span>
                                                        </div>

                                                        {EmployeeData.FederalState && <div className="position-relative">
                                                            <div className="block mb-20" title={EmployeeData.FederalState}>
                                                                <a className="hreflink" target="_blank" href={EmployeeData.FederalState}>{EmployeeData.FederalState}</a>
                                                                <a className="hreflink">
                                                                    <img src="/_layouts/images/delete.gif" />
                                                                </a>
                                                            </div>
                                                        </div>}
                                                    </div>
                                                </fieldset>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="IMAGEINFORMATION clearfix">
                                        <div>IMAGEINFORMATION</div>
                                    </div>
                                    <div className="BANKINFORMATION clearfix">
                                        <div className="BANKINFORMATION clearfix">

                                            <div className="col-sm-12 row pad0">
                                                <div className="form-group col-sm-6">
                                                    <label htmlFor="IBAN">IBAN</label>
                                                    <input type="text" className="form-control" id="IBAN"
                                                        placeholder="Enter IBAN" defaultValue={EmployeeData.IBAN} onChange={(e) => handleChange(e, 'IBAN')} />
                                                </div>
                                                <div className="form-group col-sm-6">
                                                    <label htmlFor="BIC">BIC</label>
                                                    <input type="text" className="form-control" id="BIC" placeholder="Enter BIC" defaultValue={EmployeeData.BIC} onChange={(e) => handleChange(e, 'BIC')} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="TAXINFORMATION clearfix">
                                        <div>
                                            <div className="TAXINFORMATION TAB6 clearfix">

                                                <div className="col-sm-12 row pad0">
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="TaxNo">Tax No.</label>
                                                        <input type="text" className="form-control" id="TaxNo"
                                                            placeholder="Enter Tax No." defaultValue={EmployeeData.taxNo} onChange={(e) => handleChange(e, 'taxNo')} />
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="taxClass">Tax Class</label>
                                                        <select defaultValue={EmployeeData.taxClass} className="form-control" onChange={(e) => handleChange(e, 'taxClass')}
                                                            id="taxClass">
                                                            <option selected>Select an Option</option>
                                                            <option value="I">I</option>
                                                            <option value="II">II</option>
                                                            <option value="III">III</option>
                                                            <option value="IV">IV</option>
                                                            <option value="V">V</option>
                                                            <option value="VI">VI</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="childAllowance">Child allowance</label>
                                                        <span ng-show="Parenthood=='yes'">
                                                            <select ng-change="calculateValues()" className="form-control"
                                                                id="childAllowance">
                                                                <option ng-repeat="options in ChildAllowancesOptions"> </option>
                                                            </select>
                                                        </span>
                                                        {/* <span ng-hide="Parenthood=='yes'">
                                                    <select ng-change="calculateValues()" ng-model="childAllowance" className="form-control"
                                                        id="childAllowance">
                                                        <option ng-repeat="options in ChildAllowancesOptions">

                                                        </option>
                                                    </select>
                                                </span> */}

                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="Church-Tax">Church tax</label>
                                                        <div className="form-check-inline form-group-border mb-0">
                                                            <div className="form-check form-check-inline">
                                                                <input defaultChecked={EmployeeData.churchTax == "yes"} value="yes" id="Yes3" onChange={(e) => handleChange(e, 'churchTax')}
                                                                    name="ChurchTax" type="radio" className="form-check-input" />
                                                                <label className="form-check-label" htmlFor="Yes3">Yes</label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <input defaultChecked={EmployeeData.churchTax == "no"} value="no" id="No3" onChange={(e) => handleChange(e, 'churchTax')}
                                                                    name="ChurchTax" type="radio" className="form-check-input" />
                                                                <label className="form-check-label" htmlFor="No3">No</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="col-sm-12 row pad0">
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="monthlyTaxAllowance">Monthly tax allowance</label>
                                                        <input type="number" className="form-control"
                                                            id="monthlyTaxAllowance" placeholder="Enter Monthly tax allowance" defaultValue={EmployeeData.monthlyTaxAllowance} onChange={(e) => handleChange(e, 'monthlyTaxAllowance')} />
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="incomeTax">Income Tax</label>
                                                        <input type="text" className="form-control" id="incomeTax"
                                                            placeholder="Enter Income Tax" defaultValue={EmployeeData.incomeTax} onChange={(e) => handleChange(e, 'incomeTax')} />
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="taxFreePayment">Tax Free Payment</label>
                                                        <input type="text" className="form-control" id="taxFreePayment"
                                                            placeholder="Enter Tax Free Payment" defaultValue={EmployeeData.taxFreePayment} onChange={(e) => handleChange(e, 'taxFreePayment')} />
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="solidaritySurcharge">Solidarity Surcharge</label>
                                                        <input type="text" className="form-control" id="solidaritySurcharge"
                                                            placeholder="Enter Solidarity Surcharge" defaultValue={EmployeeData.solidaritySurcharge} onChange={(e) => handleChange(e, 'solidaritySurcharge')} />

                                                    </div>
                                                </div>
                                                <div className="col-sm-12 row pad0">
                                                    <div className="col-sm-6 form-group">
                                                        <label className="full_width" htmlFor="NRPSubToTaxInput">
                                                            Non Recurring Payments <span>
                                                                (subject to tax & social
                                                                security)
                                                            </span>
                                                        </label>
                                                        <div className="col-sm-12 pad0" id="NRPSubToTax">
                                                            <input type="number" className="form-control mb-2" id="NRPSubToTaxInput"
                                                                placeholder="Enter Non Recurring Payments" defaultValue={EmployeeData.NRPSubToTax} onChange={(e) => handleChange(e, 'NRPSubToTax')} />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 form-group">
                                                        <label className="full_width" htmlFor="NRPNotSubToTax">
                                                            Net Non Recurring Payments <span>
                                                                (not subject to
                                                                tax & social
                                                                security)
                                                            </span>
                                                        </label>
                                                        <div className="col-sm-12 pad0" id="NRPNotSubToTax">
                                                            <input type="number" className="form-control" placeholder="Enter Net Non Recurring Payments" defaultValue={EmployeeData.NRPNotSubToTax} onChange={(e) => handleChange(e, 'NRPNotSubToTax')} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="SOCIALSECURITYINFORMATION clearfix">
                                        <div>
                                            <div className="SOCIALSECURITYINFORMATION TAB7 clearfix">
                                                <div className="col-sm-12 row pad0">
                                                    <div className="col-sm-4 form-group">
                                                        <label htmlFor="healthInsuranceType">Health Insurance Type</label>
                                                        <select defaultValue={EmployeeData.healthInsuranceType} name="healthInsuranceType" onChange={(e) => handleChange(e, 'healthInsuranceType')}
                                                            id="healthInsuranceType" className="form-control">
                                                            <option selected>Select an Option</option>
                                                            <option value="None">None</option>
                                                            <option value="Statutory">Statutory</option>
                                                            <option value="Private">Private</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-4 form-group">
                                                        <label htmlFor="healthInsuranceCompany">Health Insurance Company</label>
                                                        <input type="text" className="form-control"
                                                            id="healthInsuranceCompany" placeholder="Enter Company Name" defaultValue={EmployeeData.healthInsuranceCompany} onChange={(e) => handleChange(e, 'healthInsuranceCompany')} />
                                                    </div>
                                                    <div className="col-sm-4 form-group">
                                                        <label htmlFor="healthInsuranceNo">Health Insurance No</label>
                                                        <input type="text" className="form-control"
                                                            id="healthInsuranceNo" placeholder="Enter Health Insurance no" defaultValue={EmployeeData.insuranceNo} onChange={(e) => handleChange(e, 'insuranceNo')} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 row pad0">
                                                    <div className="col-sm-4 form-group">
                                                        <label htmlFor="PersonGroupKey">Person Group Key</label>
                                                        <select ng-model="PersonGroupKey" defaultValue={EmployeeData.PersonGroupKey} name="PersonGroupKey" id="PersonGroupKey" onChange={(e) => handleChange(e, 'PersonGroupKey')}
                                                            className="form-control">
                                                            <option selected>Select an Option</option>
                                                            <option ng-repeat="personGroupKey in PersonGroupKeyValues" >
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-4 form-group">
                                                        <label htmlFor="contributionStatus">Contribution Status</label>
                                                        <select defaultValue={EmployeeData.contributionStatus} name="contributionStatus" id="contributionStatus" className="form-control" onChange={(e) => handleChange(e, 'contributionStatus')}>
                                                            <option selected>Select an Option</option>
                                                            <option value="Standard">Standard</option>
                                                            <option value="Low-Paid Worker">Low-Paid Worker</option>
                                                            <option value="Minijob">Minijob</option>
                                                            <option value="Midi-Job">Midi-Job</option>
                                                            <option value="Working Student">Working Student</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-4 form-group">
                                                        <label htmlFor="additionalContributionToHI">Additional Contribution To HI (Rate)</label>
                                                        <input type="number" className="form-control" id="additionalContributionToHI"
                                                            placeholder="Enter Additional Contribution To HI" defaultValue={EmployeeData.additionalContributionToHI} onChange={(e) => handleChange(e, 'additionalContributionToHI')} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 row pad0">
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="tax className">Contribution group HI</label>
                                                        <select defaultValue={EmployeeData.contributionGroupHi} className="form-control" id="contributionGroupHi" onChange={(e) => handleChange(e, 'contributionGroupHi')}>
                                                            <option selected>Select an Option</option>
                                                            <option> 0 - No contribution</option>
                                                            <option> 1 - General contribution </option>
                                                            <option> 2 - Reduced contribution </option>
                                                            <option > 3 - Contribution to agricultural health insurance</option>
                                                            <option>
                                                                4 - Employer contribution to agricultural health
                                                                insurance
                                                            </option>
                                                            <option>
                                                                6 - Lump sum for marginally employed persons
                                                            </option>
                                                            <option>9 - Voluntary insurance (employer pays)</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="contributionGroupRI">Contribution group RI</label>
                                                        <select defaultValue={EmployeeData.contributionGroupRI} className="form-control" id="contributionGroupRI" onChange={(e) => handleChange(e, 'contributionGroupRI')}>
                                                            <option selected>Select an Option</option>
                                                            <option>0 - No contribution</option>
                                                            <option>1 - Full contribution</option>
                                                            <option>3 - Half contribution</option>
                                                            <option>
                                                                5 - Lump sum for marginally employed persons
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="contributionGroupUI">Contribution group UI</label>
                                                        <select defaultValue={EmployeeData.contributionGroupUI} className="form-control" id="contributionGroupUI" onChange={(e) => handleChange(e, 'contributionGroupUI')}>
                                                            <option selected>Select an Option</option>
                                                            <option>0 - No contribution</option>
                                                            <option>1 - Full contribution</option>
                                                            <option>2 - Half contribution</option>

                                                        </select>
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="contributionGroupNCI">Contribution group NCI</label>
                                                        <select defaultValue={EmployeeData.contributionGroupNCI} className="form-control" id="contributionGroupNCI" onChange={(e) => handleChange(e, 'contributionGroupNCI')}>
                                                            <option selected>Select an Option</option>
                                                            <option>0 - No contribution</option>
                                                            <option>1 - Full contribution</option>
                                                            <option>2 - Half contribution</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 row pad0">
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="levy1Type">Levy 1 Type</label>
                                                        <select defaultValue={EmployeeData.levy1Type} name="levy1Type" id="levy1Type" className="form-control" onChange={(e) => handleChange(e, 'levy1Type')}>
                                                            <option selected>Select an Option</option>
                                                            <option value="Standard">Standard</option>
                                                            <option value="Reduced">Reduced</option>
                                                            <option value="Increased">Increased</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="levy1RateOfContribution">Levy 1 Contribution Rate</label>
                                                        <input type="number" className="form-control" id="levy1RateOfContribution"
                                                            placeholder="Enter Levy 1 Contribution" defaultValue={EmployeeData.levy1RateOfContribution} onChange={(e) => handleChange(e, 'levy1RateOfContribution')} />
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="levy1ReimbursementRate">Levy 1 Reimbursement Rate</label>
                                                        <input type="number" className="form-control" id="levy1ReimbursementRate"
                                                            placeholder="Enter Levy 1 Reimbursement Rate" defaultValue={EmployeeData.levy1ReimbursementRate} onChange={(e) => handleChange(e, 'levy1ReimbursementRate')} />
                                                    </div>
                                                    <div className="col-sm-3 form-group">
                                                        <label htmlFor="levy2ContributionRate">Levy 2 Contribution Rate</label>
                                                        <input type="number" className="form-control" id="levy2ContributionRate"
                                                            placeholder="Enter Levy 2 Contribution Rate" defaultValue={EmployeeData.levy2ContributionRate} onChange={(e) => handleChange(e, 'levy2ContributionRate')} />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="EDITQUALIFICATIONS clearfix">
                                        <div className="EDITQUALIFICATIONS TAB8 clearfix">
                                            <div className="col-sm-12 row pad0">
                                                <div className="col-sm-6 form-group">
                                                    <label htmlFor="highestSchoolDiploma">Highest school diploma</label>
                                                    <input type="text" className="form-control"
                                                        id="highestSchoolDiploma" placeholder="Enter Highest school diploma" defaultValue={EmployeeData.highestSchoolDiploma} onChange={(e) => handleChange(e, 'highestSchoolDiploma')} />
                                                </div>
                                                <div className="col-sm-6 form-group">
                                                    <label htmlFor="highestVocationalEducation ">Highest vocational education</label>
                                                    <input type="text" className="form-control" id="highestVocationalEducation"
                                                        placeholder="Enter Highest Vocational Education" defaultValue={EmployeeData.highestVocationalEducation} onChange={(e) => handleChange(e, 'highestVocationalEducation')} />
                                                </div>
                                            </div>
                                            <div className="col-sm-12 row pad0">
                                                <div className="col-sm-6 form-group">
                                                    <label htmlFor="otherQualifications">Other qualifications</label>
                                                    <input type="text" className="form-control" id="otherQualifications"
                                                        placeholder="Enter Other qualifications" defaultValue={EmployeeData.otherQualifications} onChange={(e) => handleChange(e, 'otherQualifications')} />
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="position-relative" ng-show="selectedInstituion.length==0">
                                                        <label>Languages</label>
                                                        {!EmployeeData.LanguagesTextVal && <><input type="text" className="form-control ui-autocomplete-input" defaultValue={EmployeeData.LanguagesTextVal}
                                                            id="txtInstitutioncart" autoComplete="off" /><span role="status" aria-live="polite"
                                                                className="ui-helper-hidden-accessible"></span></>}
                                                        <span className="edit-icons position-absolute">
                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png" />
                                                        </span>
                                                    </div>

                                                    {EmployeeData.LanguagesTextVal && <div className="position-relative">
                                                        <div className="block mb-20" title={EmployeeData.LanguagesTextVal}>
                                                            <a className="hreflink" target="_blank" href={EmployeeData.LanguagesTextVal}>{EmployeeData.LanguagesTextVal}</a>
                                                            <a className="hreflink">
                                                                <img src="/_layouts/images/delete.gif" />
                                                            </a>
                                                        </div>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section >
                            </div>
                        }
                    </div >
                </Modal.Body >
                <div className="modal-footer footer-model">
                    {EmployeeData && <div className="col-sm-12">
                        <div className="row">

                            <div className="ItemInfo col-sm-6">
                                <div className="text-left">
                                    Created <span ng-bind="EmployeeData.Created | date:'dd/MM/yyyy'"> {EmployeeData.Created != undefined ? moment(EmployeeData.Created).format('DD/MM/YYYY') : ""}</span> by
                                    <span className="footerUsercolor"> {EmployeeData.Author.Title != undefined ? EmployeeData.Author.Title : ""}</span>
                                </div>
                                <div className="text-left">
                                    Last modified <span ng-bind="EmployeeData.Modified | date:'dd/MM/yyyy hh:mm'"> {EmployeeData.Modified != undefined ? moment(EmployeeData.Modified).format('DD/MM/YYYY hh:ss') : ""}</span> by
                                    <span className="footerUsercolor"> {EmployeeData.Editor.Title != undefined ? EmployeeData.Editor.Title : ""}</span>
                                </div>
                            </div>

                            <div className="col-sm-6 PadR0 ItemInfo-right">
                                <div className="pull-right">
                                    <Button type="button" variant="primary" onClick={UpdateDetails} className='FooterBtn'>Save</Button>
                                    <Button type="button" variant="secondary" className='FooterBtn' onClick={handleClose}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </Modal>

            <div>
                <Modal size="lg" show={ShowAllInstituion} onHide={OrganisationPopupClose}>
                    <Modal.Header>
                        <h3 className="modal-title">
                            Organisation
                        </h3>
                        <button type="button" className='Close-button' onClick={OrganisationPopupClose}>×</button>
                    </Modal.Header>
                    <div className='bg-f5f5 clearfix'>
                        <div className="col-sm-12 padL-0 PadR0">
                            <section className="TableContentSection">
                                <div className="container-fluid">
                                    <section className="TableSection">
                                        <div className="container">
                                            <div className="tab-content clearfix bg-f5f5">
                                                <div className="col-sm-12 padL-0 PadR0">
                                                    <div className="Alltable">
                                                        <div id="table-wrapper" className="col-sm-12 padL-0 PadR0 smart">
                                                            <div className="section-event">
                                                                <div className="container-new">
                                                                    <table className="table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{ width: '10%' }}>
                                                                                    <div className="displayLabel" style={{ width: '9%' }}>
                                                                                        <label></label>
                                                                                    </div>
                                                                                    <div className="smart-relative" style={{ width: '10%' }}>
                                                                                    </div>
                                                                                </th>
                                                                                <th style={{ width: '50%' }}>
                                                                                    <div className="displayLabel" style={{ width: '49%' }}>
                                                                                        <label>Title</label>
                                                                                    </div>
                                                                                    <div className="smart-relative" style={{ width: '50%' }}>
                                                                                        <input id="searchContractId" type="text" className="full_width searchbox_height" placeholder="Title" />
                                                                                        <span className="searchclear">X</span>
                                                                                        <span className="sorticon">
                                                                                            <span>
                                                                                                <i className="fa fa-angle-up hreflink"></i>
                                                                                            </span><span>
                                                                                                <i className="fa fa-angle-down hreflink"></i>
                                                                                            </span>
                                                                                        </span>
                                                                                    </div>
                                                                                </th>
                                                                                <th style={{ width: '20%' }}>
                                                                                    <div className="displayLabel" style={{ width: '19%' }}>
                                                                                        <label>City</label>
                                                                                    </div>
                                                                                    <div style={{ width: '20%' }} className="smart-relative">
                                                                                        <input id="searchTitle" type="text" placeholder="City" className="full_width searchbox_height" />
                                                                                        <span className="searchclear">X</span>

                                                                                        <span className="sorticon">
                                                                                            <span>
                                                                                                <i className="fa fa-angle-up hreflink"></i>
                                                                                            </span><span>
                                                                                                <i className="fa fa-angle-down hreflink"></i>
                                                                                            </span>

                                                                                        </span>
                                                                                    </div>
                                                                                </th>
                                                                                <th style={{ width: '20%' }}>
                                                                                    <div className="displayLabel" style={{ width: '19%' }}>
                                                                                        <label>Country</label>
                                                                                    </div>
                                                                                    <div className="smart-relative" style={{ width: '20%' }}>
                                                                                        <input type="text" className="full_width searchbox_height" placeholder="Country" />
                                                                                        <span className="searchclear">X</span>
                                                                                        <span className="sorticon">
                                                                                            <span>
                                                                                                <i className="fa fa-angle-up hreflink"></i>
                                                                                            </span><span>
                                                                                                <i className="fa fa-angle-down hreflink"></i>
                                                                                            </span>
                                                                                        </span>
                                                                                    </div>
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>






                                                                            {AllContactInstituion.map((item: any, index: any) => {
                                                                                return (
                                                                                    <><tr key={index} className="tabletdRow">
                                                                                        <td>
                                                                                            <input checked={item.Title === EmployeeData?.Institution?.Title} className="no-padding" type="radio" name="chkCompareContact" />
                                                                                        </td>
                                                                                        <td>
                                                                                            <a className="hreflink" href="">
                                                                                                {item.Title}
                                                                                            </a>
                                                                                        </td>
                                                                                        <td>
                                                                                            {item.WorkCity}
                                                                                        </td>
                                                                                        <td>
                                                                                            {item.WorkCountry}
                                                                                        </td>
                                                                                    </tr>
                                                                                    </>
                                                                                )

                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </section>
                        </div>
                    </div>
                    <Modal.Footer>
                        <button type="button" className="btn btn-primary" >
                            Save
                        </button>
                        <button type="button" className="btn btn-default" onClick={OrganisationPopupClose}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div >
    )
})
export default EditEmployeeInfo;