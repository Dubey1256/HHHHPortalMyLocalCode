import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import '../components/EditEmployeeInfo.css';
import '../components/hrportal.css';



const EditEmployeeInfo = (() => {
    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => setLgShow(false);

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
                                                            ng-model="Item.FirstName" />
                                                    </div>
                                                    <div className="col-sm-2">
                                                        <label className="full_width">Last Name</label>
                                                        <input type="text" className="form-control"
                                                            ng-model="Item.Title" />
                                                    </div>
                                                    <div className="col-sm-1">
                                                        <label className="full_width">Suffix</label>
                                                        <input type="text" className="form-control"
                                                            ng-model="Item.Suffix" />
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div ng-show="selectedInstituion.length==0">
                                                            <div className="col-sm-11 padL-0 PadR0 Doc-align">
                                                                <label>Organisation</label>
                                                                <input type="text" className="form-control ui-autocomplete-input"
                                                                    id="txtInstitutioncart" autoComplete="off" /><span role="status" aria-live="polite"
                                                                        className="ui-helper-hidden-accessible"></span>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-1 PadR0" ng-hide="selectedInstituion.length>0">
                                                            <label className="full_width">&nbsp;</label>
                                                            <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png"
                                                                ng-click="ShowAllInstituion();" />
                                                        </div>
                                                        <div className="col-sm-11 padL-0 PadR0"
                                                            ng-show="selectedInstituion.length>0">
                                                            <label className="full_width">Organisation</label>
                                                            <div className="col-sm-11 block  mb-20"
                                                                title="{{ComponentTitle.STRING}}"
                                                                ng-repeat="item in selectedInstituion track by $index">
                                                                <a className="hreflink" target="_blank"
                                                                    href="{{baseurl}}/SitePages/Institution-Profile.aspx?InstitutionId={{item.Id}}&&name={{item.Title}}"></a>
                                                                <a className="hreflink" ng-click="removeSmartInstitution(item.Id)">
                                                                    <img src="/_layouts/images/delete.gif" />
                                                                </a>
                                                            </div>
                                                            <div className="col-md-1  PadR0" ng-show="selectedInstituion.length>0">
                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png"
                                                                    ng-click="ShowAllInstituion();" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-2">
                                                        <label className="full_width">Job Title</label>
                                                        <input type="text" className="form-control"
                                                            ng-model="Item.JobTitle" />
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
                                                                href="{{ContactLinkedIn}}" target="_blank">
                                                                <span className="pull-right">
                                                                    <i className="fa fa-linkedin"></i>
                                                                </span>
                                                            </a>
                                                        </label>
                                                        <input type="text" className="form-control"
                                                            ng-model="ContactLinkedIn" />
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <label className="full_width">
                                                            Twitter <a className="hreflink"
                                                                href="{{ContactTwitter}}" target="_blank">
                                                                <span className="pull-right">
                                                                    <i className="fa fa-twitter"></i>
                                                                </span>
                                                            </a>
                                                        </label>
                                                        <input type="text" className="form-control" ng-model="ContactTwitter" />
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <label className="full_width">
                                                            Facebook <a className="hreflink"
                                                                href="{{ContactFacebook}}" target="_blank">
                                                                <span className="pull-right">
                                                                    <i className="fa fa-facebook"></i>
                                                                </span>
                                                            </a>
                                                        </label>
                                                        <input type="text" className="form-control"
                                                            ng-model="ContactFacebook" />
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <label className="full_width">
                                                            Instagram <a className="hreflink"
                                                                href="{{ContactInstagram}}" target="_blank">
                                                                <span className="pull-right">
                                                                    <i className="fa fa-instagram"></i>
                                                                </span>
                                                            </a>
                                                        </label>
                                                        <input type="text" className="form-control"
                                                            ng-model="ContactInstagram" />
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
                                                            <input type="text" className="form-control"
                                                                ng-model="Item.WorkPhone" />
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <label className="full_width">Mobile Number</label>
                                                            <input type="text" className="form-control"
                                                                ng-model="Item.CellPhone" />
                                                        </div>
                                                        <div className="col-sm-4">
                                                            <label className="full_width">Home Phone</label>
                                                            <input type="text" className="form-control"
                                                                ng-model="Item.HomePhone" />
                                                        </div>
                                                        <div className="col-sm-4 mt-5">
                                                            <label className="full_width">Skype</label>
                                                            <input type="text" className="form-control" ng-model="Item.IM" />
                                                        </div>
                                                        <div className="col-sm-4 mt-5" title="Email">
                                                            <label className="full_width">Email</label>
                                                            <input type="text" className="form-control" ng-model="Item.Email" />
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
                                                        ng-model="Item.WorkAddress" />
                                                </div>
                                                <div className="col-sm-2 form-group">
                                                    <label htmlFor="Nationality">Nationality</label>
                                                    <input ng-model="Nationality" type="text" className="form-control" id="Nationality"
                                                        placeholder="Enter Nationality" />
                                                </div>
                                                <div className="col-sm-2 form-group">
                                                    <label htmlFor="dateOfBirth ">Date of birth</label>
                                                    <input ng-model="dateOfBirth" type="date" className="form-control" id="dateOfBirth"
                                                        placeholder="Enter Date of birth" />
                                                </div>
                                                <div className="col-sm-2 form-group">
                                                    <label htmlFor="PlaceOfBirth">Place of birth</label>
                                                    <input ng-model="placeOfBirth" type="text" className="form-control" id="PlaceOfBirth"
                                                        placeholder="Enter Place of birth" />
                                                </div>

                                                <div className="col-sm-2 form-group">
                                                    <label htmlFor="Marital">Marital status</label>
                                                    <select ng-model="maritalStatus" className="form-control" id="Marital">
                                                        <option value="none" disabled>Select an Option</option>
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
                                                            <input ng-change="calculateValues()" ng-model="Parenthood" value="yes"
                                                                id="ParenthoodYes" name="Parenthood" type="radio" className="form-check-input" />
                                                            <label className="form-check-label" htmlFor="ParenthoodYes">YES</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input ng-change="calculateValues()" ng-model="Parenthood" value="no"
                                                                id="ParenthoodNO" name="Parenthood" type="radio" className="form-check-input" />
                                                            <label className="form-check-label" htmlFor="ParenthoodNO">NO</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-2 form-group">
                                                    <label className="full_width">City</label>
                                                    <input type="text" className="form-control"
                                                        ng-model="Item.WorkCity" />
                                                </div>

                                                <div className="col-sm-2">
                                                    <label className="full_width">ZIP Code</label>

                                                    <input type="text"
                                                        className="form-control ng-pristine ng-valid ng-touched"
                                                        ng-model="Item.WorkZip" />

                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <div className="col-sm-11 padL-0 PadR0">
                                                        <label className="full_width">
                                                            Country
                                                        </label>
                                                        <input ng-show="smartCountry.length==0" style={{ width: 100 }} type="text" className="form-control"
                                                            id="txtSmartCountries" />

                                                    </div>
                                                    <div className="col-sm-1 PadR0" ng-show="smartCountry.length==0">
                                                        <label className="full_width">&nbsp;</label>
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png"
                                                            ng-click="openSmartTaxonomy('Countries')" />
                                                    </div>
                                                    <div ng-show="smartCountry.length>0" className="col-sm-11 padL-0 PadR0 inner-tabb">
                                                        <div className="block mt-5" ng-repeat="item in smartCountry">
                                                            <a className="hreflink"
                                                                ng-click="removeSmartCountry(item.Id,Item)">
                                                                <img src="/_layouts/images/delete.gif" />
                                                            </a>
                                                        </div>

                                                    </div>
                                                    <div className="col-sm-1 PadR0" ng-show="smartCountry.length>0">
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png"
                                                            ng-click="openSmartTaxonomy('Countries')" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <div className="col-sm-11 padL-0 PadR0">
                                                        <label className="full_width">
                                                            Federal state
                                                        </label>
                                                        <input ng-show="smartState.length==0" style={{ width: 100 }} type="text" className="form-control"
                                                            id="txtSmartState" />

                                                    </div>
                                                    <div className="col-sm-1 PadR0" ng-show="smartState.length==0">
                                                        <label className="full_width">&nbsp;</label>
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png"
                                                            ng-click="openSmartTaxonomy('State')" />
                                                    </div>
                                                    <div ng-show="smartState.length>0" className="col-sm-11 padL-0 PadR0 inner-tabb">
                                                        <div className="block mt-5" ng-repeat="item in smartState">
                                                            <a className="hreflink"
                                                                ng-click="removeSmartState(item.Id,Item)">
                                                                <img src="/_layouts/images/delete.gif" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-1 PadR0" ng-show="smartState.length>0">
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png"
                                                            ng-click="openSmartTaxonomy('State')" />
                                                    </div>

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
                                            <input ng-model="IBAN" type="text" className="form-control" id="IBAN"
                                                placeholder="Enter IBAN" />
                                        </div>
                                        <div className="form-group col-sm-6">
                                            <label htmlFor="BIC">BIC</label>
                                            <input ng-model="BIC" type="text" className="form-control" id="BIC" placeholder="Enter BIC" />
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
                                                    <input ng-model="taxNo" type="text" className="form-control" id="TaxNo"
                                                        placeholder="Enter Tax No." />
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="tax className">Tax  className</label>
                                                    <select ng-change="calculateValues()" ng-model="tax className" className="form-control"
                                                        id="tax className">
                                                        <option value="none" disabled>Select an Option</option>
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
                                                        <select ng-change="calculateValues()" ng-model="childAllowance" className="form-control"
                                                            id="childAllowance">
                                                            <option ng-repeat="options in ChildAllowancesOptions">
                                                            </option>
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
                                                            <input ng-change="calculateValues()" ng-model="churchTax" value="yes" id="Yes3"
                                                                name="ChurchTax" type="radio" className="form-check-input" />
                                                            <label className="form-check-label" htmlFor="Yes3">Yes</label>
                                                        </div>
                                                        <div className="form-check form-check-inline">
                                                            <input ng-change="calculateValues()" ng-model="churchTax" value="no" id="No3"
                                                                name="ChurchTax" type="radio" className="form-check-input" />
                                                            <label className="form-check-label" htmlFor="No3">No</label>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-sm-12 row pad0">
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="monthlyTaxAllowance">Monthly tax allowance</label>
                                                    <input ng-model="monthlyTaxAllowance" type="number" className="form-control"
                                                        id="monthlyTaxAllowance" placeholder="Enter Monthly tax allowance" />
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="incomeTax">Income Tax</label>
                                                    <input ng-model="incomeTax" type="text" className="form-control" id="incomeTax"
                                                        placeholder="Enter Income Tax" />
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="taxFreePayment">Tax Free Payment</label>
                                                    <input ng-model="taxFreePayment" type="text" className="form-control" id="taxFreePayment"
                                                        placeholder="Enter Tax Free Payment" />
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="solidaritySurcharge">Solidarity Surcharge</label>
                                                    <input ng-model="solidaritySurcharge" ng-change="calculateValues()" type="text" className="form-control" id="solidaritySurcharge"
                                                        placeholder="Enter Solidarity Surcharge" />

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
                                                        <input ng-model="NRPSubToTax" ng-change="checkValidation()" type="number"
                                                            className="form-control mb-2" id="NRPSubToTaxInput"
                                                            placeholder="Enter Non Recurring Payments" />
                                                    </div>
                                                    {/* <div className="col-sm-8 padR-0">
                                                        <input ng-model="NRPSubToTaxDesc"
                                                            ng-hide="NRPSubToTax==undefined||NRPSubToTax==0" type="text"
                                                            className="form-control" id="NRPSubToTaxDesc"
                                                            placeholder="Please add the description" />
                                                    </div> */}
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
                                                        <input ng-model="NRPNotSubToTax" ng-change="checkValidation()" type="number"
                                                            className="form-control" placeholder="Enter Net Non Recurring Payments" />
                                                    </div>
                                                    {/* <div className="col-sm-8 padR-0">
                                                        <input ng-model="NRPNotSubToTaxDesc"
                                                            ng-hide="NRPNotSubToTax==undefined||NRPNotSubToTax==0"
                                                            type="text" className="form-control" id="NRPNotSubToTaxDesc"
                                                            placeholder="Please add the description" />
                                                    </div> */}
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
                                                    <select ng-model="healthInsuranceType" name="healthInsuranceType"
                                                        id="healthInsuranceType" className="form-control">
                                                        <option value="none" disabled>Select an Option</option>
                                                        <option value="None">None</option>
                                                        <option value="Statutory">Statutory</option>
                                                        <option value="Private">Private</option>
                                                    </select>
                                                </div>
                                                <div className="col-sm-4 form-group">
                                                    <label htmlFor="healthInsuranceCompany">Health Insurance Company</label>
                                                    <input ng-model="healthInsuranceCompany" type="text" className="form-control"
                                                        id="healthInsuranceCompany" placeholder="Enter Company Name" />
                                                </div>
                                                <div className="col-sm-4 form-group">
                                                    <label htmlFor="healthInsuranceNo">Health Insurance No</label>
                                                    <input type="text" ng-model="healthInsuranceNo" className="form-control"
                                                        id="healthInsuranceNo" placeholder="Enter Health Insurance no" />
                                                </div>
                                            </div>
                                            <div className="col-sm-12 row pad0">
                                                <div className="col-sm-4 form-group">
                                                    <label htmlFor="PersonGroupKey">Person Group Key</label>
                                                    <select ng-model="PersonGroupKey" name="PersonGroupKey" id="PersonGroupKey"
                                                        className="form-control">
                                                        <option value="none" disabled>Select an Option</option>
                                                        <option ng-repeat="personGroupKey in PersonGroupKeyValues" >
                                                        </option>
                                                    </select>
                                                </div>
                                                <div className="col-sm-4 form-group">
                                                    <label htmlFor="contributionStatus">Contribution Status</label>
                                                    <select ng-change="calculateValues()" ng-model="contributionStatus"
                                                        name="contributionStatus" id="contributionStatus" className="form-control">
                                                        <option value="none" disabled>Select an Option</option>
                                                        <option value="Standard">Standard</option>
                                                        <option value="Low-Paid Worker">Low-Paid Worker</option>
                                                        <option value="Minijob">Minijob</option>
                                                        <option value="Midi-Job">Midi-Job</option>
                                                        <option value="Working Student">Working Student</option>
                                                    </select>
                                                </div>
                                                <div className="col-sm-4 form-group">
                                                    <label htmlFor="additionalContributionToHI">Additional Contribution To HI (Rate)</label>
                                                    <input ng-change="calculateValues()" type="number" className="form-control"
                                                        ng-model="additionalContributionToHI" id="additionalContributionToHI"
                                                        placeholder="Enter Additional Contribution To HI" />
                                                </div>
                                            </div>
                                            <div className="col-sm-12 row pad0">
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="tax className">Contribution group HI</label>
                                                    <select ng-change="calculateValues()" ng-model="contributionGroupHi"
                                                        className="form-control" id="contributionGroupHi">
                                                        <option ng-value="none" disabled>Select an Option</option>
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
                                                    <select ng-change="calculateValues()" ng-model="contributionGroupRI"
                                                        className="form-control" id="contributionGroupRI">
                                                        <option ng-value="none" disabled>Select an Option</option>
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
                                                    <select ng-change="calculateValues()" ng-model="contributionGroupUI"
                                                        className="form-control" id="contributionGroupUI">
                                                        <option ng-value="none" disabled>Select an Option</option>
                                                        <option>0 - No contribution</option>
                                                        <option>1 - Full contribution</option>
                                                        <option>2 - Half contribution</option>

                                                    </select>
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="contributionGroupNCI">Contribution group NCI</label>
                                                    <select ng-change="calculateValues()" ng-model="contributionGroupNCI"
                                                        className="form-control" id="contributionGroupNCI">
                                                        <option ng-value="none" disabled>Select an Option</option>
                                                        <option>0 - No contribution</option>
                                                        <option>1 - Full contribution</option>
                                                        <option>2 - Half contribution</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 row pad0">
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="levy1Type">Levy 1 Type</label>
                                                    <select ng-model="levy1Type" name="levy1Type" id="levy1Type" className="form-control">
                                                        <option value="none" disabled>Select an Option</option>
                                                        <option value="Standard">Standard</option>
                                                        <option value="Reduced">Reduced</option>
                                                        <option value="Increased">Increased</option>
                                                    </select>
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="levy1RateOfContribution">Levy 1 Contribution Rate</label>
                                                    <input ng-change="calculateValues()" ng-model="levy1RateOfContribution" type="number"
                                                        className="form-control" id="levy1RateOfContribution"
                                                        placeholder="Enter Levy 1 Contribution" />
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="levy1ReimbursementRate">Levy 1 Reimbursement Rate</label>
                                                    <input ng-change="calculateValues()" ng-model="levy1ReimbursementRate" type="number"
                                                        className="form-control" id="levy1ReimbursementRate"
                                                        placeholder="Enter Levy 1 Reimbursement Rate" />
                                                </div>
                                                <div className="col-sm-3 form-group">
                                                    <label htmlFor="levy2ContributionRate">Levy 2 Contribution Rate</label>
                                                    <input ng-change="calculateValues()" type="number" ng-model="levy2ContributionRate"
                                                        className="form-control" id="levy2ContributionRate"
                                                        placeholder="Enter Levy 2 Contribution Rate" />
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
                                                <input ng-model="highestSchoolDiploma" type="text" className="form-control"
                                                    id="highestSchoolDiploma" placeholder="Enter Highest school diploma" />
                                            </div>
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="highestVocationalEducation ">Highest vocational education</label>
                                                <input ng-model="highestVocationalEducation" type="text" className="form-control"
                                                    id="highestVocationalEducation" placeholder="Enter Highest Vocational Education" />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 row pad0">
                                            <div className="col-sm-6 form-group">
                                                <label htmlFor="otherQualifications">Other qualifications</label>
                                                <input ng-model="otherQualifications" type="text" className="form-control"
                                                    id="otherQualifications" placeholder="Enter Other qualifications" />
                                            </div>
                                            <div className="col-sm-3 form-group">
                                                <div className="col-sm-12 pad0">
                                                    <label className="underline-label">
                                                        Languages
                                                    </label>
                                                    <input type="text" className="form-control"
                                                        ng-model="SearchtxtMainLanguage" id="txtMainLanguage" />
                                                    <span className="input-addon-icon">
                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Logos/EMMCopyTerm.png"
                                                            ng-click="openSmartTaxonomy('Main Language')" />
                                                    </span>
                                                </div>

                                                <div className="col-sm-12 pad0">
                                                    <div className="block mr-5" ng-repeat="item in SmartMainLanguage">
                                                        <a className="hreflink" ng-click="removeSmartMainLanguage(item.Id)">
                                                            <img ng-src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/images/delete.gif" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section >
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
})
export default EditEmployeeInfo