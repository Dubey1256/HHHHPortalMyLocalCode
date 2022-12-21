import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import '../components/Style.css';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Information from './TaxInformation';
import Button from 'react-bootstrap/Button';
import PayrollComponents from './payRollAccount';
import SalarySlipPopup from './SalarySlipPopup';
import { ItemAddResult, Web } from "sp-pnp-js";
import { useEffect, useState } from 'react';
import { Async } from 'office-ui-fabric-react';
import { eq } from 'lodash';




const EmployeeInfo = () => {
    let AllSmartcountry: any[] = [];
    let AllSmartState: any[] = [];
    let AllSmartLanguage: any[] = [];
    const searchParams = new URLSearchParams(window.location.search);
    const employeeId = searchParams.get("employeeId");
    const [salaryData, setEmployees] = useState([]);
    const [HrData, setHrData] = useState(null);
    const [ContractData, setContractData] = useState([]);
    // const [ShowImage, setImage] = useState(false);


    useEffect(() => {
        fetchAPIData();
        loadSmartTaxonomyItems();
        LoadHrData();
        LoadContract();
    }, []);


    const fetchAPIData = async () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
        await web.lists.getById('40f6d3fb-5396-45d1-86d5-dbc5e88c11c8').items.select("Id,Month,Year,accountingDate,totalContribution,Contract/ContractId,Contract/Id,totalGross,fisicalDeduction,payOut").expand("Contract").orderBy("monthInNumber").filter("HHHHStaff/Id eq " + employeeId).get()
            .then((data) => {
                console.log(data);
                setEmployees(data);
            }).catch((err) => {
                console.log(err.message);
            });
    }
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
    const LoadHrData = async () => {

        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
        await web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.select("Id,additionalContributionToHI,FirstName,IM,SmartLanguagesId,WorkCity,WorkZip,WorkAddress,WorkPhone,Email,Item_x0020_Cover,SmartContactId,Title,JobTitle,WebPage,SmartCountriesId,SmartStateId,Institution/Id,Institution/Title,SocialMediaUrls,levy2ContributionRate,SmartInstitutionId,contributionStatus,StaffID,netNonRecurringPayments,levy1ReimbursementRate,levy1RateOfContribution,levy1Type,healthInsuranceCompany,healthInsuranceType,NonRecurringPayments,PersonGroupKey,Country,Fedral_State,BIC,IBAN,contributionGroupNCI,contributionGroupUI,contributionGroupRI,contributionGroupHi,Parenthood,insuranceNo,childAllowance,monthlyTaxAllowance,solidaritySurcharge,taxClass,churchTax,taxNo,incomeTax,taxFreePayments,Languages,otherQualifications,highestVocationalEducation,highestSchoolDiploma,ZIP_x0020_Code,No_x002e_,City,Street,maritalStatus,Nationality,placeOfBirth,dateOfBirth,Created,Author/Title,Modified,Editor/Title,EmployeeID/Title,EmployeeID/Id").expand("EmployeeID,Institution,Author,Editor").filter("Id eq " + employeeId).get()
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
                setHrData(data[0]);
            }).catch((err) => {
                console.log(err.message);
            });
    }


    // Contract ALl Information List Data Start......


    const LoadContract = async () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
        await web.lists.getById('986680CE-5D69-47B4-947C-3998DDC3776C').items.select("Id,Title,WorkingHours,Author/Id,Author/Title,ContractChanged,ContractSigned,endDate,ContractId,PersonnelNumber,HHHHStaff/Title,HHHHStaff/Id,contractNumber,typeOfContract,HolidayEntitlement,GrossSalary,startDate,Attachments,Title,Created,Modified,Editor/Name,Editor/Title,EmployeeID/Id").expand("HHHHStaff,Author,Editor,EmployeeID").filter("HHHHStaff/Id eq " + employeeId).get()
            .then((data) => {
                console.log(data);
                setContractData(data);
            }).catch((err) => {
                console.log(err.message);
            });
    }


    return (
        <div>
            {
                HrData &&
                <div className="col-sm-12 tableHeading  ">
                    <div className="col-sm-3 tableLeft  ">
                        {/* <img className="user-dp" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg" data-themekey="#" /> */}
                        {HrData.Item_x0020_Cover && <img className="user-dp" src={HrData.Item_x0020_Cover.Url} />}
                        {!HrData.Item_x0020_Cover && <img className="user-dp" src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg" />}
                    </div>
                    <div className="col-sm-9 padR-0 tableRight">
                        <div className="align-center HeaderTitle  d-flex justify-space">
                            <div className="EmplyoeeName ng-binding">
                                {HrData.FirstName} {HrData.Title} ({HrData.StaffID})
                            </div>
                            <div className="mx-auto">
                                <span ng-show="showHRDetailsPopup">
                                    <span style={{ padding: 3 }} className="btn btn-outline btn-primary">
                                        <img />Edit HR Details</span>
                                </span>
                            </div>
                        </div>
                        <br />
                        <div>
                            <div className="infoblock contact d-flex">
                                <div className="col-lg-3 label">Organization</div>
                                <div className="col-lg-9 labeltext ng-binding">{HrData.Institution.Title}</div>
                            </div>
                            <div className="infoblock contact d-flex">
                                <div className="col-lg-3 label">Department</div>
                                <div className="col-lg-9 labeltext ng-binding"></div>
                            </div>
                            <div className="infoblock contact d-flex">
                                <div className="col-lg-3 label">Job Title</div>
                                <div className="col-lg-9 labeltext ng-binding">{HrData.JobTitle}</div>
                            </div>

                        </div>
                    </div>
                </div>
            }
            {/* <Tabs defaultActiveKey="INFORMATION" className="categories mb-3 m-3" id="controlled-tab-example">
                <Tab eventKey="INFORMATION" className='allHeaderTabs' title="INFORMATION">

                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Col className='TabChild' sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item >
                                        <Nav.Link className='ItemNav' eventKey="first" >Information</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='ItemNav' eventKey="second">Tax information</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='ItemNav' eventKey="third">Qualifications</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">

                                        {
                                            HrData &&
                                            <div className='InformationFullContainer'>
                                                <div className="col-sm-10">
                                                    <div className="tab-content">
                                                        <div className="tab-pane active" id="Information">
                                                            <div className="row">
                                                                <div className="infoblock  Personal col-sm-12   form-group">
                                                                    <h2 className="blue-clr">Contact Information</h2>
                                                                    <div className='Contact_Info'>
                                                                        <div className="col-sm-6 Phone_Email padL-0 align-center d-flex mb-3">
                                                                            <div className="mr-15">
                                                                                <img title="Business Phone"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/Phone.svg" />
                                                                            </div>
                                                                            <div className="Phone_EmailClild">{HrData.WorkPhone}</div>
                                                                        </div>
                                                                        <div className="col-sm-6 Phone_Email padL-0 align-center d-flex mb-3">
                                                                            <div className="mr-15"><img title="Email"
                                                                                src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/E-mail.svg" />
                                                                            </div>
                                                                            <div className="Phone_EmailClild"> <a
                                                                                ng-href="mailto:{{HrData.Email}}"></a>{HrData.Email}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className=" col-sm-12 infoblock social-Media-Icons Address form-group  ">
                                                                    <h2 className="blue-clr">Social Media Information</h2>

                                                                    <div className='Contact_Info'>
                                                                        <div className="col-sm-6 Phone_Email padL-0 align-center d-flex mb-3">
                                                                            <div className="mr-15">
                                                                                <img title="linkedin"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/linkedin.svg" />
                                                                            </div>
                                                                            <div className="Phone_EmailClild"><a href={HrData.SocialMediaUrls?.[0]?.LinkedIn}
                                                                                target="_blank">{HrData.SocialMediaUrls?.[0]?.LinkedIn}</a></div>
                                                                        </div>
                                                                        <div className="col-sm-6 Phone_Email padL-0 align-center d-flex mb-3">
                                                                            <div className="mr-15"><img title="Skype"
                                                                                src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/skype.svg" />
                                                                            </div>
                                                                            <div className="Phone_EmailClild">  <a href="{{AllEmployeeDetails.IM}}"
                                                                                target="_blank"></a>{HrData.IM}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='Contact_Info'>
                                                                        <div className="col-sm-6 padL-0 Phone_Email  align-center d-flex mb-3">
                                                                            <div className="mr-15 ">
                                                                                <img title="Facebook"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/facebook.svg" />
                                                                            </div>
                                                                            <div className="full_width Phone_EmailClild">
                                                                                <a href={HrData.SocialMediaUrls?.[0]?.Facebook}
                                                                                    target="_blank">{HrData.SocialMediaUrls?.[0]?.Facebook}</a>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-6 padR-0 Phone_Email align-center d-flex mb-3">
                                                                            <div className="mr-15 ">
                                                                                <img title="Instagram"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/instagram.svg" />
                                                                            </div>
                                                                            <div className="full_width Phone_EmailClild">
                                                                                <a href={HrData.SocialMediaUrls?.[0]?.Instagram}
                                                                                    target="_blank">{HrData.SocialMediaUrls?.[0]?.Instagram}</a>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className='Contact_Info'>
                                                                        <div className='col-sm-6 padL-0 align-center Phone_Email d-flex mb-3'>
                                                                            <span className="mr-15 ">
                                                                                <img title="Twitter"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/twitter.svg" />
                                                                            </span>
                                                                            <span className='full_width Phone_EmailClild'>
                                                                                <a href={HrData.SocialMediaUrls?.[0]?.Twitter}
                                                                                    target="_blank">{HrData.SocialMediaUrls?.[0]?.Twitter}</a>
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-sm-6 padR-0 align-center Phone_Email d-flex">
                                                                            <span className='mr-15'><img title="Web Page"
                                                                                src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/link_m.svg" />
                                                                            </span>
                                                                            <span className='full_width Phone_EmailClild'> <a href="{AllEmployeeDetails.WebPage.Url}"
                                                                                target="_blank"></a></span>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div ng-show="showHRDetailsPopup">
                                                                <div ng-show="showHRDeatils">
                                                                    <div className="Contact_Info">
                                                                        <div className="infoblock Address col-sm-6 form-group padL-0">
                                                                            <h2 className="blue-clr">Address Information</h2>
                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="City"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/city.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.WorkCity}</span>
                                                                            </div>
                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="Country"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/Website.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.SmartCountry}</span>
                                                                            </div>

                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="Federal State"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/state.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.FederalState}</span>
                                                                            </div>
                                                                            <div className="align-center d-flex">
                                                                                <span className="mr-15">
                                                                                    <img title="Address"
                                                                                        src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/location.svg" />
                                                                                </span>
                                                                                <span
                                                                                    className="full_width">{HrData.WorkAddress}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="infoblock Address col-sm-6 form-group padR-0 ">
                                                                            <h2 className="blue-clr">Bank Information</h2>
                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="BIC"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/BIC.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.BIC}</span>
                                                                            </div>
                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="IBAN"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/IBAN.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.IBAN}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="infoblock aboutus col-sm-12 form-group clearfix  ">
                                                                            <h2 className="blue-clr">Personal Information</h2>
                                                                            <div className='PersonalInformation'>
                                                                                <div className=" infoblock contact d-flex padL-0">
                                                                                    <div className="col-lg-3 label">Date of birth</div>
                                                                                    <div className="col-lg-9 labeltext">{HrData.dateOfBirth}</div>
                                                                                </div>
                                                                                <div className=" infoblock contact d-flex  ">
                                                                                    <div className="col-lg-3 label">Place of birth</div>
                                                                                    <div className="col-lg-9 labeltext">{HrData.placeOfBirth}
                                                                                    </div>
                                                                                </div>
                                                                                <div className=" infoblock contact d-flex padL-0">
                                                                                    <div className="col-lg-3 label">Nationality</div>
                                                                                    <div className="col-lg-9 labeltext">{HrData.Nationality}</div>
                                                                                </div>
                                                                                <div className=" infoblock contact d-flex  ">
                                                                                    <div className="col-lg-3 label">Marital status</div>
                                                                                    <div className="col-lg-9 labeltext">{HrData.maritalStatus}
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
                                            </div>
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <div>
                                            <Information props={HrData} />
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="third">
                                        {
                                            HrData &&
                                            <div>
                                                <h2 className="heading">Qualifications</h2>
                                                <div className="item-container">
                                                    <div className="item">
                                                        <div className="item-left">
                                                            <div className="item-label">Highest school diploma</div>
                                                            <div className="item-label">Other qualifications</div>
                                                        </div>
                                                        <div className="item-right">
                                                            <div className="item-value">{HrData.highestSchoolDiploma}</div>
                                                            <div className="item-value">{HrData.otherQualifications}</div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="item-left">
                                                            <div className="item-label">Highest vocational education</div>
                                                            <div className="item-label">Languages</div>
                                                        </div>
                                                        <div className="item-right">
                                                            <div className="item-value">{HrData.highestVocationalEducation}</div>
                                                            <div className="item-value">{HrData.LanguagesTextVal}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Tab>
                <Tab eventKey="CONTRACT" className='allHeaderTabs' title="CONTRACT">
                    <div>
                        <h2 className="heading">Contract Details</h2>
                        <div ng-hide="noContracts">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th style={{ width: 25 }}>Contract No.</th>
                                        <th style={{ width: 25 }}>Contract Title</th>
                                        <th style={{ width: 25 }}>Start Date</th>
                                        <th style={{ width: 25 }}>End Date</th>
                                        <th style={{ width: 8 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ContractData.map((contract: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td>{contract.ContractId}</td>
                                                    <td><a href="{{baseUrl}}/SitePages/Contract-Profile.aspx?SmartID={{contract.Id}}"
                                                        target="_blank">{contract.Title}</a></td>
                                                    <td>{contract.startDate}</td>
                                                    <td>{contract.endDate}</td>
                                                    <td><a><img ng-click="editContractItem(contract,'edit')"
                                                        ng-src="/_layouts/images/edititem.gif" data-themekey="#"
                                                        src="/_layouts/images/edititem.gif" />
                                                    </a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="salarySlips" className='allHeaderTabs' title="PAYROLL">

                    <Tab.Container id="left-tabs-example" defaultActiveKey="salarySlips">
                        <Row>
                            <Col className='TabChild' sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item >
                                        <Nav.Link className='ItemNav' eventKey="salarySlips" >Salary Slips</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='ItemNav' eventKey="payrollAccount">Payroll Account</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="salarySlips">
                                        <div>
                                            <div className="col-sm-10  ">

                                                <div className="tab-content">

                                                    <div className="tab-pane active " id="PaymentsTAB2">
                                                        <div className="Contact_Info   underline-border">
                                                            <div className='yearSlect'>
                                                                <select id="SalViewYear">
                                                                    <option value="none" disabled>Select Year</option>
                                                                    <option value="2022" >2022</option>
                                                                </select>
                                                            </div>

                                                            <div ng-show="showHRDetailsPopup" className="ViewSalarySlipBtn mb-10" ng-cloak>
                                                                <div ng-show="isHR">
                                                                    <span >
                                                                        <span ng-hide="ViewSalarySlip"><span ng-click="AddNewPayment(undefined,'Create')" className="btn btn-primary btn-sm CreateSalarySlip ">Create New Salary Slip</span>
                                                                        </span>
                                                                    </span>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <h2 className="Salaryheading"></h2>
                                                        <table className="table table-bordered table-hover mt-10">
                                                            <thead>
                                                                <tr>
                                                                    <th>Contract ID</th>
                                                                    <th>Month</th>
                                                                    <th>Year</th>
                                                                    <th>Gross Salary</th>
                                                                    <th>Tax</th>
                                                                    <th>Social Security</th>
                                                                    <th>Payout</th>
                                                                    <th>Accounting Date</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    salaryData.map((EmployeeSalary: any, index: any) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>{EmployeeSalary.Contract[0].ContractId}</td>
                                                                                <td>{EmployeeSalary.Month}</td>
                                                                                <td>{EmployeeSalary.Year}</td>
                                                                                <td>{EmployeeSalary.totalGross}</td>
                                                                                <td>{EmployeeSalary.fisicalDeduction}</td>
                                                                                <td>{EmployeeSalary.totalContribution}</td>
                                                                                <td>{EmployeeSalary.payOut}</td>
                                                                                <td>{EmployeeSalary.accountingDate}</td>
                                                                                <td><a><SalarySlipPopup props={EmployeeSalary.Id} /></a>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="tab-pane" id="PaymentsTAB3">
                                                        <span>
                                                            <a ng-href="{{baseUrl}}/SitePages/payRollAccount.aspx?employeeId={{MainitemId}}"
                                                                target="_blank" className="btn btn-primary btn-sm pull-right">Payroll Account</a>
                                                            <div>

                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="payrollAccount">
                                        <div>
                                            <PayrollComponents />
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Tab>
                <Tab eventKey="LEAVES" className='allHeaderTabs' title="LEAVES">
                    <div>

                    </div>
                </Tab>
                <Tab eventKey="DOCUMENTS" className='allHeaderTabs' title="DOCUMENTS">
                    <div>
                        <div className="DocumentsTAB clearfix">
                            <div className="row">
                                <div className="col-lg-12  infoblock contact d-flex">
                                    <div className="col-lg-3 label">Confirmation of health insurance</div>
                                    <div className="col-lg-9 labeltext">
                                    </div>
                                </div>
                                <div className="col-lg-12 infoblock contact d-flex">
                                    <div className="col-lg-3 label">Contract of company pension</div>
                                    <div className="col-lg-9 labeltext">
                                    </div>
                                </div>
                                <div className="col-lg-12 infoblock contact d-flex">
                                    <div className="col-lg-3 label">Proof of parenthood</div>
                                    <div className="col-lg-9 labeltext"></div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </Tab>
            </Tabs> */}




            <div className="col-sm-12 emp-tab  ">
                <input id="InformationTAB" type="radio" defaultChecked={true} name="emp" />
                <input id="ContractsTAB" type="radio" name="emp" />
                <input id="PaymentsTAB" type="radio" name="emp" />
                <input id="LeavesTAB" type="radio" name="emp" />
                <input id="DocumentsTAB" type="radio" name="emp" />
                <nav>
                    <ul>
                        <li className="InformationTAB">
                            <label htmlFor="InformationTAB">Information</label>
                        </li>
                        <li className="ContractsTAB">
                            <label htmlFor="ContractsTAB">Contracts</label>
                        </li>
                        <li className="PaymentsTAB">
                            <label htmlFor="PaymentsTAB">Payroll</label>
                        </li>
                        <li className="LeavesTAB">
                            <label htmlFor="LeavesTAB">Leaves</label>
                        </li>
                        <li className="DocumentsTAB">
                            <label htmlFor="DocumentsTAB">Documents</label>
                        </li>
                    </ul>
                </nav>
                <section>
                    <div className="InformationTAB clearfix">
                        <div>
                        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Col className='col-sm-2 padL-0' sm={2}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item >
                                        <Nav.Link className='ItemNav' eventKey="first" >Information</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='ItemNav' eventKey="second">Tax information</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='ItemNav' eventKey="third">Qualifications</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={10}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">

                                        {
                                            HrData &&
                                            <div className='InformationFullContainer'>
                                                <div className="col-sm-12">
                                                    <div className="tab-content">
                                                        <div className="tab-pane active" id="Information">
                                                            <div className="row">
                                                                <div className="infoblock  Personal col-sm-12   form-group">
                                                                    <h2 className="blue-clr">Contact Information</h2>
                                                                    <div className='Contact_Info'>
                                                                        <div className="col-sm-6 Phone_Email padL-0 align-center d-flex mb-3">
                                                                            <div className="mr-15">
                                                                                <img title="Business Phone"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/Phone.svg" />
                                                                            </div>
                                                                            <div className="Phone_EmailClild">{HrData.WorkPhone}</div>
                                                                        </div>
                                                                        <div className="col-sm-6 Phone_Email padL-0 align-center d-flex mb-3">
                                                                            <div className="mr-15"><img title="Email"
                                                                                src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/E-mail.svg" />
                                                                            </div>
                                                                            <div className="Phone_EmailClild"> <a
                                                                                ng-href="mailto:{{HrData.Email}}"></a>{HrData.Email}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className=" col-sm-12 infoblock social-Media-Icons Address form-group  ">
                                                                    <h2 className="blue-clr">Social Media Information</h2>

                                                                    <div className='Contact_Info'>
                                                                        <div className="col-sm-6 Phone_Email padL-0 align-center d-flex mb-3">
                                                                            <div className="mr-15">
                                                                                <img title="linkedin"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/linkedin.svg" />
                                                                            </div>
                                                                            <div className="Phone_EmailClild"><a href={HrData.SocialMediaUrls?.[0]?.LinkedIn}
                                                                                target="_blank">{HrData.SocialMediaUrls?.[0]?.LinkedIn}</a></div>
                                                                        </div>
                                                                        <div className="col-sm-6 Phone_Email padL-0 align-center d-flex mb-3">
                                                                            <div className="mr-15"><img title="Skype"
                                                                                src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/skype.svg" />
                                                                            </div>
                                                                            <div className="Phone_EmailClild">  <a href="{{AllEmployeeDetails.IM}}"
                                                                                target="_blank"></a>{HrData.IM}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='Contact_Info'>
                                                                        <div className="col-sm-6 padL-0 Phone_Email  align-center d-flex mb-3">
                                                                            <div className="mr-15 ">
                                                                                <img title="Facebook"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/facebook.svg" />
                                                                            </div>
                                                                            <div className="full_width Phone_EmailClild">
                                                                                <a href={HrData.SocialMediaUrls?.[0]?.Facebook}
                                                                                    target="_blank">{HrData.SocialMediaUrls?.[0]?.Facebook}</a>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-6 padR-0 Phone_Email align-center d-flex mb-3">
                                                                            <div className="mr-15 ">
                                                                                <img title="Instagram"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/instagram.svg" />
                                                                            </div>
                                                                            <div className="full_width Phone_EmailClild">
                                                                                <a href={HrData.SocialMediaUrls?.[0]?.Instagram}
                                                                                    target="_blank">{HrData.SocialMediaUrls?.[0]?.Instagram}</a>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className='Contact_Info'>
                                                                        <div className='col-sm-6 padL-0 align-center Phone_Email d-flex mb-3'>
                                                                            <span className="mr-15 ">
                                                                                <img title="Twitter"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/twitter.svg" />
                                                                            </span>
                                                                            <span className='full_width Phone_EmailClild'>
                                                                                <a href={HrData.SocialMediaUrls?.[0]?.Twitter}
                                                                                    target="_blank">{HrData.SocialMediaUrls?.[0]?.Twitter}</a>
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-sm-6 padR-0 align-center Phone_Email d-flex">
                                                                            <span className='mr-15'><img title="Web Page"
                                                                                src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/link_m.svg" />
                                                                            </span>
                                                                            <span className='full_width Phone_EmailClild'> <a href="{AllEmployeeDetails.WebPage.Url}"
                                                                                target="_blank"></a></span>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div ng-show="showHRDetailsPopup">
                                                                <div ng-show="showHRDeatils">
                                                                    <div className="Contact_Info">
                                                                        <div className="infoblock Address col-sm-6 form-group padL-0">
                                                                            <h2 className="blue-clr">Address Information</h2>
                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="City"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/city.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.WorkCity}</span>
                                                                            </div>
                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="Country"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/Website.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.SmartCountry}</span>
                                                                            </div>

                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="Federal State"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/state.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.FederalState}</span>
                                                                            </div>
                                                                            <div className="align-center d-flex">
                                                                                <span className="mr-15">
                                                                                    <img title="Address"
                                                                                        src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/location.svg" />
                                                                                </span>
                                                                                <span
                                                                                    className="full_width">{HrData.WorkAddress}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="infoblock Address col-sm-6 form-group padR-0 ">
                                                                            <h2 className="blue-clr">Bank Information</h2>
                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="BIC"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/BIC.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.BIC}</span>
                                                                            </div>
                                                                            <div className="align-center d-flex mb-3">
                                                                                <span className="mr-15"><img title="IBAN"
                                                                                    src="/sites/HHHH/GmBH/SiteCollectionImages/ICONS/24/IBAN.svg" />
                                                                                </span>
                                                                                <span className="full_width">{HrData.IBAN}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="infoblock aboutus col-sm-12 form-group clearfix  ">
                                                                            <h2 className="blue-clr">Personal Information</h2>
                                                                            <div className='PersonalInformation'>
                                                                                <div className=" infoblock contact d-flex padL-0">
                                                                                    <div className="col-lg-3 label">Date of birth</div>
                                                                                    <div className="col-lg-9 labeltext">{HrData.dateOfBirth}</div>
                                                                                </div>
                                                                                <div className=" infoblock contact d-flex  ">
                                                                                    <div className="col-lg-3 label">Place of birth</div>
                                                                                    <div className="col-lg-9 labeltext">{HrData.placeOfBirth}
                                                                                    </div>
                                                                                </div>
                                                                                <div className=" infoblock contact d-flex padL-0">
                                                                                    <div className="col-lg-3 label">Nationality</div>
                                                                                    <div className="col-lg-9 labeltext">{HrData.Nationality}</div>
                                                                                </div>
                                                                                <div className=" infoblock contact d-flex  ">
                                                                                    <div className="col-lg-3 label">Marital status</div>
                                                                                    <div className="col-lg-9 labeltext">{HrData.maritalStatus}
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
                                            </div>
                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <div>
                                            <Information props={HrData} />
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="third">
                                        {
                                            HrData &&
                                            <div>
                                                <h2 className="heading">Qualifications</h2>
                                                <div className="item-container">
                                                    <div className="item">
                                                        <div className="item-left">
                                                            <div className="item-label">Highest school diploma</div>
                                                            <div className="item-label">Other qualifications</div>
                                                        </div>
                                                        <div className="item-right">
                                                            <div className="label-value">{HrData.highestSchoolDiploma}</div>
                                                            <div className="label-value">{HrData.otherQualifications}</div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="item-left">
                                                            <div className="item-label">Highest vocational education</div>
                                                            <div className="item-label">Languages</div>
                                                        </div>
                                                        <div className="item-right">
                                                            <div className="label-value">{HrData.highestVocationalEducation}</div>
                                                            <div className="label-value">{HrData.LanguagesTextVal}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                        </div>
                    </div>
                    <div className="ContractsTAB clearfix">
                        <div>
                        <div>
                        <h2 className="heading">Contract Details</h2>
                        <div ng-hide="noContracts">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th style={{ width: 25 }}>Contract No.</th>
                                        <th style={{ width: 25 }}>Contract Title</th>
                                        <th style={{ width: 25 }}>Start Date</th>
                                        <th style={{ width: 25 }}>End Date</th>
                                        <th style={{ width: 8 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ContractData.map((contract: any, index: any) => {
                                            return (
                                                <tr>
                                                    <td>{contract.ContractId}</td>
                                                    <td><a href="{{baseUrl}}/SitePages/Contract-Profile.aspx?SmartID={{contract.Id}}"
                                                        target="_blank">{contract.Title}</a></td>
                                                    <td>{contract.startDate}</td>
                                                    <td>{contract.endDate}</td>
                                                    <td><a><img ng-click="editContractItem(contract,'edit')"
                                                        ng-src="/_layouts/images/edititem.gif" data-themekey="#"
                                                        src="/_layouts/images/edititem.gif" />
                                                    </a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                        </div>
                    </div>
                    <div className="PaymentsTAB clearfix">
                        <div>
                        <Tab.Container id="left-tabs-example" defaultActiveKey="salarySlips">
                        <Row>
                            <Col className='col-sm-2 padL-0' sm={2}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item >
                                        <Nav.Link className='ItemNav' eventKey="salarySlips" >Salary Slips</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className='ItemNav' eventKey="payrollAccount">Payroll Account</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={10}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="salarySlips">
                                        <div>
                                            <div className="col-sm-10  ">

                                                <div className="tab-content">

                                                    <div className="tab-pane active " id="PaymentsTAB2">
                                                        <div className="Contact_Info   underline-border">
                                                            <div className='yearSlect'>
                                                                <select id="SalViewYear">
                                                                    <option value="none" disabled>Select Year</option>
                                                                    <option value="2022" >2022</option>
                                                                </select>
                                                            </div>

                                                            <div ng-show="showHRDetailsPopup" className="ViewSalarySlipBtn mb-10" ng-cloak>
                                                                <div ng-show="isHR">
                                                                    <span >
                                                                        <span ng-hide="ViewSalarySlip"><span ng-click="AddNewPayment(undefined,'Create')" className="btn btn-primary btn-sm CreateSalarySlip ">Create New Salary Slip</span>
                                                                        </span>
                                                                    </span>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <h2 className="Salaryheading"></h2>
                                                        <table className="table table-bordered table-hover mt-10">
                                                            <thead>
                                                                <tr>
                                                                    <th>Contract ID</th>
                                                                    <th>Month</th>
                                                                    <th>Year</th>
                                                                    <th>Gross Salary</th>
                                                                    <th>Tax</th>
                                                                    <th>Social Security</th>
                                                                    <th>Payout</th>
                                                                    <th>Accounting Date</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    salaryData.map((EmployeeSalary: any, index: any) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>{EmployeeSalary.Contract[0].ContractId}</td>
                                                                                <td>{EmployeeSalary.Month}</td>
                                                                                <td>{EmployeeSalary.Year}</td>
                                                                                <td>{EmployeeSalary.totalGross}</td>
                                                                                <td>{EmployeeSalary.fisicalDeduction}</td>
                                                                                <td>{EmployeeSalary.totalContribution}</td>
                                                                                <td>{EmployeeSalary.payOut}</td>
                                                                                <td>{EmployeeSalary.accountingDate}</td>
                                                                                <td><a><SalarySlipPopup props={EmployeeSalary.Id} /></a>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="tab-pane" id="PaymentsTAB3">
                                                        <span>
                                                            <a ng-href="{{baseUrl}}/SitePages/payRollAccount.aspx?employeeId={{MainitemId}}"
                                                                target="_blank" className="btn btn-primary btn-sm pull-right">Payroll Account</a>
                                                            <div>

                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="payrollAccount">
                                        <div>
                                            <PayrollComponents />
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                        </div>
                    </div>
                    <div className="LeavesTAB clearfix">
                        <div>LeavesTAB</div>
                    </div>
                    <div className="DocumentsTAB clearfix">
                        <div>
                        <div>
                        <div className="DocumentsTAB clearfix">
                            <div className="row">
                                <div className="col-lg-12  infoblock contact d-flex">
                                    <div className="col-lg-3 label">Confirmation of health insurance</div>
                                    <div className="col-lg-9 labeltext">
                                    </div>
                                </div>
                                <div className="col-lg-12 infoblock contact d-flex">
                                    <div className="col-lg-3 label">Contract of company pension</div>
                                    <div className="col-lg-9 labeltext">
                                    </div>
                                </div>
                                <div className="col-lg-12 infoblock contact d-flex">
                                    <div className="col-lg-3 label">Proof of parenthood</div>
                                    <div className="col-lg-9 labeltext"></div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                        </div>
                    </div>
                </section >
            </div>




        </div>

    )

}
export default EmployeeInfo;