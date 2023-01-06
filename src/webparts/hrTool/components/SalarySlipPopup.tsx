import * as React from 'react';
import '../components/SalarySlipPopup.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useRef, useState } from 'react';
import { Web } from "sp-pnp-js";
import ReactToPrint from 'react-to-print';
import * as moment from 'moment';
const SalarySlipPopup = (props: any) => {
    const componentRef = useRef();
    const componentLongRef = useRef();
    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => setLgShow(false);

    const [SalaryItems, setSalarySlipData] = useState([]);

    useEffect(() => {
        SalaryData();
    }, []);

    const SalaryData = async () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
        await web.lists.getById('40f6d3fb-5396-45d1-86d5-dbc5e88c11c8').items.select("Id,NRPSubToTax,NRPSubToTaxDesc,NRPNotSubToTax,NRPNotSubToTaxDesc,uniformFlatRateTax,netNonRecurringPayments,StaffID,Title,Fedral_State,ContriRateHI,healthInsuranceCompany,monthlyAllowance,taxClass,additionalContribution,childAllowances,churchTax,dateOfBirth,personnelNumber,grossSalary,nonRecurringPayments,totalGross,incomeTax,solidaritySurcharge,churchTaxValue,fisicalDeduction,empContriHI,empContriUI,empContriNCI,empContriNCISurcharge,empContriRI,totalSocialSecurityDeduction,netIncome,netSalaries,netDeduction,payOut,employerContriHI,employerContriUI,employerContriNCI,employerContriRI,employerContritaxFreeBenefits,employerLevy1Contri,employerLevy2Contri,employerInsolvencyContri,employerTotalContri,BIC,IBAN,employerTotalSocialSecurity,employerAditionalContri,employeeTotalSocialContri,totalSocialContri,contributionGroupNCI,contributionGroupUI,contributionGroupRI,contributionGroupHi,contributionStatus,Parenthood,insuranceNo,maritalStatus,totalContribution,StreetNo,City,additionalContributionToHI,Month,Year,ZIPCode,HouseNo,Title,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,Contract/WorkingHours").expand("Author,Contract,Editor").filter("Id eq '" + props.props + "'").get()
            .then((Items) => {
                console.log(Items);
                setSalarySlipData(Items);
            }).catch((err) => {
                console.log(err.message);
            });
    }
    return (
        <>
             <a className="pull-right ml-2"onClick={() => setLgShow(true)} >
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M37.9998 12.9621L32.6407 8H11V40H38L37.9998 12.9621ZM37.4598 39.4998H11.5398V8.49977H32.4171L37.4596 13.1687L37.4598 39.4998Z" fill="#000069" stroke="#000069"></path>
                    <path d="M21.4811 25.5057C22.0504 25.0354 22.6198 24.4473 23.2705 23.8203C23.7179 23.35 24.2058 22.6836 24.6125 21.9779C23.8398 19.43 23.4739 16.9994 24.2871 15.8233C24.6531 15.2746 25.2224 15 25.9546 15C26.7678 15 27.378 15.3527 27.6626 16.0191C28.3133 17.4303 27.3372 20.0176 26.158 22.1343C26.4833 23.1534 26.8898 24.2509 27.378 25.4664C27.6628 26.1328 27.9879 26.7991 28.3133 27.4264C31.6481 28.6809 33.6814 30.0919 33.966 31.4249C34.0879 32.0521 33.8846 32.6009 33.3152 33.0321C32.9899 33.2673 32.6239 33.4242 32.2172 33.4242C32.0546 33.4242 31.8918 33.3851 31.7292 33.3458C30.1838 32.9537 28.5167 30.7585 27.2966 28.5242C26.5648 28.2497 25.7106 27.9755 24.7754 27.7403C23.6773 27.4267 22.7015 27.1915 21.8474 27.0348C20.2614 28.25 18.9194 28.9164 17.7401 28.9164C16.8455 28.9555 16.1947 28.6418 15.5848 28.054C14.6901 27.1916 15.056 26.4467 15.178 26.2506C15.9099 25.153 18.1463 24.9176 21.4811 25.5057ZM32.1358 31.9736C32.2983 32.0127 32.3797 31.9736 32.4612 31.9345C32.6237 31.8169 32.6237 31.7384 32.5831 31.66C32.5017 31.1896 31.5665 30.3272 29.5331 29.3864C30.5092 30.7976 31.4853 31.8169 32.1358 31.9736ZM26.3611 16.568C26.3205 16.4895 26.2797 16.3719 25.9543 16.3719C25.6695 16.3719 25.5475 16.4895 25.4664 16.568C25.1005 17.0777 25.141 18.3713 25.5884 20.0959C26.2797 18.6065 26.6459 17.1952 26.3611 16.568ZM25.2224 26.368C25.6292 26.4856 26.0357 26.6032 26.4425 26.7207C26.3205 26.4462 26.1986 26.1719 26.0766 25.9368C25.7918 25.1919 25.4667 24.4471 25.1819 23.6632C24.8565 24.0944 24.572 24.4865 24.2872 24.7608C23.9213 25.1529 23.5554 25.5057 23.1892 25.8584C23.8399 26.0154 24.5311 26.1719 25.2224 26.368ZM16.6418 27.0735C16.9266 27.3871 17.2925 27.5047 17.7398 27.5047C18.3497 27.5047 19.0818 27.2301 19.9357 26.6813C17.577 26.368 16.2352 26.6031 16.6418 27.0735Z" fill="#000069"></path>
                </svg>
            </a>
            <Modal
                size="xl"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <span className='modal-title' id="example-modal-sizes-title-lg">
                        <span><strong>Salary Slip</strong></span>
                    </span>
                    <button type="button" className='Close-button' onClick={handleClose}>×</button>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        {
                            SalaryItems.map((Item: any, index: any) => {
                                return (
                                    <div className="Scrolling">
                                        <div className='collapse ...'>
                                            <table className="SalarySliptable" cellPadding="0" cellSpacing="0" width="100%" ref={componentRef}>
                                                <tbody>
                                                    <tr>
                                                        <th align="left">
                                                            <h2 style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: 600, marginBottom: 0 }}>
                                                                <span>Payroll: </span><span ng-bind="GetColumnDetails(Item.Month)"> {Item.Month}</span>
                                                                <span><span> {Item.Year}</span></span>
                                                            </h2>
                                                        </th>
                                                        <th>
                                                            <img src="https://hhhhcodebase.blob.core.windows.net/hhhh/Online/HR/logo@2x.png" className='pull-right' width="65" />
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <td align="left" width="60%" >
                                                            <p>
                                                                <div>{Item.Title}</div>
                                                                <div>{Item.StreetNo} {Item.HouseNo}</div>
                                                                <div>{Item.ZIPCode} {Item.City}</div>
                                                            </p>
                                                        </td>
                                                        <td align="right">
                                                            <div>
                                                                <p>
                                                                    <div>Hochhuth Consulting GmbH</div>
                                                                    <div>Christinenstr. 16</div>
                                                                    <div>DE-10119 Berlin</div>
                                                                    <div>Telefon: +49 30 868706600</div>
                                                                    <div><a href="mailto:secretariat@hochhuth-consulting.de" />secretariat@hochhuth-consulting.de</div>
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3}>
                                                            <table width="100%" cellPadding="0" cellSpacing="0">
                                                                <tr>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('NAME') | trustedHTML">NAME</td>
                                                                    <td width="25%">{Item.Title}</td>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('Fedral_State') | trustedHTML">Fedral State</td>
                                                                    <td width="25%">{Item.Fedral_State}</td>
                                                                </tr>
                                                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('accountingPeriod') | trustedHTML">Accounting period</td>
                                                                    <td width="25%"><span ng-bind="GetColumnDetails(Item.Month)">{Item.Month}</span>
                                                                        <span>{Item.Year}</span>
                                                                    </td>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('healthInsuranceCompany') | trustedHTML">Health insurance company</td>
                                                                    <td width="25%">{Item.healthInsuranceCompany}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('StaffID') | trustedHTML">StaffID</td>
                                                                    <td width="25%">{Item.StaffID}</td>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('ContriRateHI') | trustedHTML">Contribution rate HI</td>
                                                                    <td width="25%">{Item.ContriRateHI}</td>
                                                                </tr>
                                                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('taxClass') | trustedHTML">Tax class</td>
                                                                    <td width="25%">{Item.taxClass}</td>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('additionalContribution') | trustedHTML">Additional contribution HI </td>
                                                                    <td width="25%">{Item.additionalContribution}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('monthlyAllowance') | trustedHTML">Monthly tax allowance</td>
                                                                    <td width="25%">{Item.monthlyAllowance}</td>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('empContriNCISurcharge') | trustedHTML">Nursing care insurance surcharge</td>
                                                                    <td width="25%">{Item.empContriNCISurcharge}</td>

                                                                </tr>
                                                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('churchTax') | trustedHTML">Church tax</td>
                                                                    <td width="25%" ng-bind="GetColumnDetails(Item.churchTax)">{Item.churchTax}</td>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('ContributionGroupKey') | trustedHTML">Contribution group key</td>
                                                                    <td width="25%"></td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('dateOfBirth') | trustedHTML">Date Of Birth</td>
                                                                    <td width="25%">{Item.dateOfBirth != null ? moment(Item.dateOfBirth).format('DD/MM/YYYY') : ""}</td>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('contributionStatus') | trustedHTML">Contribution status</td>
                                                                    <td width="25%" ng-bind="GetColumnDetails(Item.contributionStatus)">{Item.contributionStatus}</td>
                                                                </tr>
                                                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('childAllowances') | trustedHTML">Child allowance
                                                                    </td>
                                                                    <td width="25%">{Item.childAllowances}</td>
                                                                    <td width="25%">IBAN</td>
                                                                    <td width="25%">{Item.IBAN}</td>
                                                                </tr>
                                                                <tr  >
                                                                    <td width="25%" ng-bind-html="GetColumnDetails('WeeklyWorkingHours') | trustedHTML">Weekly working hours
                                                                    </td>
                                                                    <td width="25%">{Item.Contract.WorkingHours}</td>
                                                                    <td width="25%">BIC</td>
                                                                    <td width="25%">{Item.BIC}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <table className='table' cellPadding="0" cellSpacing="0">
                                                                            <tr>
                                                                                <td><strong ng-bind-html="GetColumnDetails('totalGrossSalaries') | trustedHTML">Total gross salaries</strong></td>
                                                                            </tr>
                                                                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                                <td ng-bind-html="GetColumnDetails('grossSalary') | trustedHTML">Gross Salary</td>
                                                                                <td align="right"> {Item.grossSalary}</td>
                                                                            </tr>
                                                                            <tr  >
                                                                                <td ng-bind-html="GetColumnDetails('nonRecurringPayments') | trustedHTML">Non-recurring payments</td>
                                                                                <td align="right">{Item.nonRecurringPayments}</td>
                                                                            </tr>
                                                                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                                <td align="right">&nbsp;</td>
                                                                                <td>&nbsp;</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td align="right">&nbsp;</td>
                                                                                <td align="right"><strong
                                                                                    ng-bind-html="GetColumnDetails('TotalGrossSalarys') | trustedHTML">Total gross salary</strong>
                                                                                </td>
                                                                            </tr>
                                                                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                                <td align="right">  </td>
                                                                                <td align="right"><strong>{Item.totalGross}</strong>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <span><strong ng-bind-html="GetColumnDetails('employeCosts') | trustedHTML">Employee costs</strong></span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <span><strong ng-bind-html="GetColumnDetails('tax') | trustedHTML">Tax</strong></span>
                                                                    </td>
                                                                </tr>
                                                                <tr style={{ backgroundColor: "#f2f2f2" }} className='WordBreak'>
                                                                    <td><strong
                                                                        ng-bind-html="GetColumnDetails('incomeTax') | trustedHTML"></strong>Income tax</td>
                                                                    <td  ><strong
                                                                        ng-bind-html="GetColumnDetails('solidaritySurcharge') | trustedHTML">Solidarity surcharge</strong></td>
                                                                    <td  ><strong
                                                                        ng-bind-html="GetColumnDetails('churchTax') | trustedHTML">Church tax</strong></td>
                                                                    <td align="right"><strong
                                                                        ng-bind-html="GetColumnDetails('fisicalDeduction') | trustedHTML">Fiscal deduction</strong>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>{Item.incomeTax}</td>
                                                                    <td>{Item.solidaritySurcharge}</td>
                                                                    <td>{Item.churchTaxValue}</td>
                                                                    <td align="right">
                                                                        <strong>{Item.fisicalDeduction}</strong>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <span><strong ng-bind-html="GetColumnDetails('SocialINC') | trustedHTML">Social insurance</strong></span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4} className='pad0'>
                                                                        <table width="100%" cellPadding="0" cellSpacing="0">
                                                                            <tr style={{ backgroundColor: "#f2f2f2" }} className='WordBreak'>
                                                                                <td><strong><span
                                                                                    ng-bind-html="GetColumnDetails('healthinsurance') | trustedHTML">Health insurance</span></strong>
                                                                                </td>
                                                                                <td><strong><span
                                                                                    ng-bind-html="GetColumnDetails('nursingCareInsurance') | trustedHTML">Nursing care insurance</span></strong>
                                                                                </td>
                                                                                <td><strong><span
                                                                                    ng-bind-html="GetColumnDetails('RetirementInsurance') | trustedHTML">Retirement insurance</span></strong>
                                                                                </td>
                                                                                <td><strong><span
                                                                                    ng-bind-html="GetColumnDetails('unemploymentInsurance') | trustedHTML">Unemployment insurance</span></strong>
                                                                                </td>
                                                                                <td align="right"><strong><span
                                                                                    ng-bind-html="GetColumnDetails('Socialsecuritydeductions') | trustedHTML">Social security deductions</span></strong>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>{Item.empContriHI}</td>
                                                                                <td>{Item.empContriNCI + Item.empContriNCISurcharge}</td>
                                                                                <td>{Item.empContriRI}</td>
                                                                                <td>{Item.empContriUI}</td>
                                                                                <td align="right">
                                                                                    <strong>{Item.totalSocialSecurityDeduction}</strong>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4}>
                                                                        <table className='table' width="100%" cellPadding="0" cellSpacing="0">
                                                                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                                <td colSpan={4}><strong ng-bind-html="GetColumnDetails('netincome') | trustedHTML">Net income</strong>
                                                                                </td>

                                                                                <td width="20%" align="right"><strong>{Item.netIncome}</strong></td>
                                                                            </tr>
                                                                            <tr  >
                                                                                <td width="60%" colSpan={4}><strong><span
                                                                                    ng-bind-html="GetColumnDetails('NetSalariesNetDeductions') | trustedHTML">Net salaries/ Net deductions </span></strong>
                                                                                </td>


                                                                                <td width="20%" align="right">{Item.netSalaries}</td>
                                                                            </tr>
                                                                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                                <td colSpan={5} height="20" align="right"><strong
                                                                                    ng-bind-html="GetColumnDetails('payoutAmount') | trustedHTML">Payout Amount</strong>
                                                                                </td>
                                                                            </tr>
                                                                            <tr >
                                                                                <td colSpan={5} align="right">
                                                                                    <strong>{Item.payOut}</strong>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4} className='pad0'>
                                                                        <span><strong ng-bind-html="GetColumnDetails('employercosts') | trustedHTML">Employer costs</strong></span>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colSpan={4} className='pad0'>
                                                                        <table className='table' width="100%" cellPadding="0" cellSpacing="0">
                                                                            <tr style={{ backgroundColor: "#f2f2f2" }} className='WordBreak'>
                                                                                <td width="20%"  ><strong
                                                                                    ng-bind-html="GetColumnDetails('employerCostSocialSecurityInsurances') | trustedHTML">Employer Cost Social Security Insurances</strong>
                                                                                </td>
                                                                                <td width="20%"> </td>
                                                                                <td width="20%"  ><strong
                                                                                    ng-bind-html="GetColumnDetails('additionalEmployerCost') | trustedHTML">Additional Employer Cost</strong></td>
                                                                                <td width="20%"> </td>
                                                                                <td align="right" width="20%"  ><strong
                                                                                    ng-bind-html="GetColumnDetails('Employercos') | trustedHTML">Employer costs</strong></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td width="20%">{Item.employerTotalSocialSecurity}</td>
                                                                                <td width="20%"> </td>
                                                                                <td width="20%">{Item.employerAditionalContri}</td>
                                                                                <td width="20%"> </td>
                                                                                <td width="20%" align="right">
                                                                                    <strong>{Item.employerTotalContri}</strong>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>






                                        <table className="SalarySliptable" cellPadding="0" cellSpacing="0" width="100%" ref={componentLongRef}>
                                            <tbody>
                                                <tr>
                                                    <th align="left">
                                                        <h2 style={{ fontSize: 13, textTransform: 'uppercase', fontWeight: 600, marginBottom: 0 }}>
                                                            <span>Payroll: </span><span ng-bind="GetColumnDetails(Item.Month)"> {Item.Month}</span>
                                                            <span><span> {Item.Year}</span></span>
                                                        </h2>
                                                    </th>
                                                    <th>
                                                        <img src="https://hhhhcodebase.blob.core.windows.net/hhhh/Online/HR/logo@2x.png" className='pull-right' width="65" />
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <td align="left" width="60%" >
                                                        <p>
                                                            <div>{Item.Title}</div>
                                                            <div>{Item.StreetNo} {Item.HouseNo}</div>
                                                            <div>{Item.ZIPCode} {Item.City}</div>
                                                        </p>
                                                    </td>
                                                    <td align="right">
                                                        <div>
                                                            <p>
                                                                <div>Hochhuth Consulting GmbH</div>
                                                                <div>Christinenstr. 16</div>
                                                                <div>DE-10119 Berlin</div>
                                                                <div>Telefon: +49 30 868706600</div>
                                                                <div><a href="mailto:secretariat@hochhuth-consulting.de" />secretariat@hochhuth-consulting.de</div>
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={4}>
                                                        <table width="100%" cellPadding="0" cellSpacing="0">
                                                            <tr>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('NAME') | trustedHTML">NAME</td>
                                                                <td width="25%">{Item.Title}</td>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('Fedral_State') | trustedHTML">Fedral State</td>
                                                                <td width="25%">{Item.Fedral_State}</td>
                                                            </tr>
                                                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('accountingPeriod') | trustedHTML">Accounting period</td>
                                                                <td width="25%"><span ng-bind="GetColumnDetails(Item.Month)">{Item.Month}</span>
                                                                    <span>{Item.Year}</span>
                                                                </td>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('healthInsuranceCompany') | trustedHTML">Health insurance company</td>
                                                                <td width="25%">{Item.healthInsuranceCompany}</td>
                                                            </tr>
                                                            <tr>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('StaffID') | trustedHTML">StaffID</td>
                                                                <td width="25%">{Item.StaffID}</td>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('ContriRateHI') | trustedHTML">Contribution rate HI</td>
                                                                <td width="25%">{Item.ContriRateHI}</td>
                                                            </tr>
                                                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('taxClass') | trustedHTML">Tax class</td>
                                                                <td width="25%">{Item.taxClass}</td>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('additionalContribution') | trustedHTML">Additional contribution HI </td>
                                                                <td width="25%">{Item.additionalContribution}</td>
                                                            </tr>
                                                            <tr>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('monthlyAllowance') | trustedHTML">Monthly tax allowance</td>
                                                                <td width="25%">{Item.monthlyAllowance}</td>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('empContriNCISurcharge') | trustedHTML">Nursing care insurance surcharge</td>
                                                                <td width="25%">{Item.empContriNCISurcharge}</td>

                                                            </tr>
                                                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('churchTax') | trustedHTML">Church tax</td>
                                                                <td width="25%" ng-bind="GetColumnDetails(Item.churchTax)">{Item.churchTax}</td>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('ContributionGroupKey') | trustedHTML">Contribution group key</td>
                                                                <td width="25%"></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('dateOfBirth') | trustedHTML">Date Of Birth</td>
                                                                <td width="25%">{Item.dateOfBirth != null ? moment(Item.dateOfBirth).format('DD/MM/YYYY') : ""}</td>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('contributionStatus') | trustedHTML">Contribution status</td>
                                                                <td width="25%" ng-bind="GetColumnDetails(Item.contributionStatus)">{Item.contributionStatus}</td>
                                                            </tr>
                                                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                <td width="25%" ng-bind-html="GetColumnDetails('childAllowances') | trustedHTML">Child allowance
                                                                </td>
                                                                <td width="25%">{Item.childAllowances}</td>
                                                                <td width="25%">IBAN</td>
                                                                <td width="25%">{Item.IBAN}</td>
                                                            </tr>
                                                            <tr  >
                                                                <td width="25%" ng-bind-html="GetColumnDetails('WeeklyWorkingHours') | trustedHTML">Weekly working hours
                                                                </td>
                                                                <td width="25%">{Item.Contract.WorkingHours}</td>
                                                                <td width="25%">BIC</td>
                                                                <td width="25%">{Item.BIC}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4}>
                                                                    <table className='table' cellPadding="0" cellSpacing="0">
                                                                        <tr>
                                                                            <td><strong ng-bind-html="GetColumnDetails('totalGrossSalaries') | trustedHTML">Total gross salaries</strong></td>
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                            <td ng-bind-html="GetColumnDetails('grossSalary') | trustedHTML">Gross Salary</td>
                                                                            <td align="right"> {Item.grossSalary}</td>
                                                                        </tr>
                                                                        <tr  >
                                                                            <td ng-bind-html="GetColumnDetails('nonRecurringPayments') | trustedHTML">Non-recurring payments</td>
                                                                            <td align="right">{Item.nonRecurringPayments}</td>
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                            <td align="right">&nbsp;</td>
                                                                            <td>&nbsp;</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="right">&nbsp;</td>
                                                                            <td align="right"><strong
                                                                                ng-bind-html="GetColumnDetails('TotalGrossSalarys') | trustedHTML">Total gross salary</strong>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                            <td align="right">  </td>
                                                                            <td align="right"><strong>{Item.totalGross}</strong>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4}>
                                                                    <span><strong ng-bind-html="GetColumnDetails('employeCosts') | trustedHTML">Employee costs</strong></span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4}>
                                                                    <span><strong ng-bind-html="GetColumnDetails('tax') | trustedHTML">Tax</strong></span>
                                                                </td>
                                                            </tr>
                                                            <tr style={{ backgroundColor: "#f2f2f2" }} className='WordBreak'>
                                                                <td><strong
                                                                    ng-bind-html="GetColumnDetails('incomeTax') | trustedHTML"></strong>Income tax</td>
                                                                <td  ><strong
                                                                    ng-bind-html="GetColumnDetails('solidaritySurcharge') | trustedHTML">Solidarity surcharge</strong></td>
                                                                <td  ><strong
                                                                    ng-bind-html="GetColumnDetails('churchTax') | trustedHTML">Church tax</strong></td>
                                                                <td align="right"><strong
                                                                    ng-bind-html="GetColumnDetails('fisicalDeduction') | trustedHTML">Fiscal deduction</strong>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>{Item.incomeTax}</td>
                                                                <td>{Item.solidaritySurcharge}</td>
                                                                <td>{Item.churchTaxValue}</td>
                                                                <td align="right">
                                                                    <strong>{Item.fisicalDeduction}</strong>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4}>
                                                                    <span><strong ng-bind-html="GetColumnDetails('SocialINC') | trustedHTML">Social insurance</strong></span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4} className='pad0'>
                                                                    <table width="100%" cellPadding="0" cellSpacing="0">
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }} className='WordBreak'>
                                                                            <td><strong><span
                                                                                ng-bind-html="GetColumnDetails('healthinsurance') | trustedHTML">Health insurance</span></strong>
                                                                            </td>
                                                                            <td><strong><span
                                                                                ng-bind-html="GetColumnDetails('nursingCareInsurance') | trustedHTML">Nursing care insurance</span></strong>
                                                                            </td>
                                                                            <td><strong><span
                                                                                ng-bind-html="GetColumnDetails('RetirementInsurance') | trustedHTML">Retirement insurance</span></strong>
                                                                            </td>
                                                                            <td><strong><span
                                                                                ng-bind-html="GetColumnDetails('unemploymentInsurance') | trustedHTML">Unemployment insurance</span></strong>
                                                                            </td>
                                                                            <td align="right"><strong><span
                                                                                ng-bind-html="GetColumnDetails('Socialsecuritydeductions') | trustedHTML">Social security deductions</span></strong>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{Item.empContriHI}</td>
                                                                            <td>{Item.empContriNCI + Item.empContriNCISurcharge}</td>
                                                                            <td>{Item.empContriRI}</td>
                                                                            <td>{Item.empContriUI}</td>
                                                                            <td align="right">
                                                                                <strong>{Item.totalSocialSecurityDeduction}</strong>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4}>
                                                                    <table className='table' width="100%" cellPadding="0" cellSpacing="0">
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                            <td colSpan={4}><strong ng-bind-html="GetColumnDetails('netincome') | trustedHTML">Net income</strong>
                                                                            </td>

                                                                            <td width="20%" align="right"><strong>{Item.netIncome}</strong></td>
                                                                        </tr>
                                                                        <tr  >
                                                                            <td width="60%" colSpan={4}><strong><span
                                                                                ng-bind-html="GetColumnDetails('NetSalariesNetDeductions') | trustedHTML">Net salaries/ Net deductions </span></strong>
                                                                            </td>


                                                                            <td width="20%" align="right">{Item.netSalaries}</td>
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                            <td colSpan={5} height="20" align="right"><strong
                                                                                ng-bind-html="GetColumnDetails('payoutAmount') | trustedHTML">Payout Amount</strong>
                                                                            </td>
                                                                        </tr>
                                                                        <tr >
                                                                            <td colSpan={5} align="right">
                                                                                <strong>{Item.payOut}</strong>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4} className='pad0'>
                                                                    <span><strong ng-bind-html="GetColumnDetails('employercosts') | trustedHTML">Employer costs</strong></span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={4} className='pad0'>
                                                                    <table className='table' width="100%" cellPadding="0" cellSpacing="0">
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }} className='WordBreak'>
                                                                            <td><strong ng-bind-html="GetColumnDetails('healthInsurance') | trustedHTML">Health insurance</strong></td>
                                                                            <td><strong ng-bind-html="GetColumnDetails('nursingCareInsurance') | trustedHTML">Nursing care insurance</strong></td>
                                                                            <td><strong ng-bind-html="GetColumnDetails('retirementInsurance') | trustedHTML">Retirement insurance</strong></td>
                                                                            <td><strong ng-bind-html="GetColumnDetails('unemploymentInsurance') | trustedHTML">Unemployment insurance</strong></td>
                                                                            <td> </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{Item.employerContriHI}</td>
                                                                            <td>{Item.employerContriNCI}</td>
                                                                            <td>{Item.employerContriRI}</td>
                                                                            <td>{Item.employerContriUI}</td>
                                                                            <td align="right"><strong> </strong></td>
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                                                                            <td><strong ng-bind-html="GetColumnDetails('employerLevy1Contri') | trustedHTML">Levy 1</strong></td>
                                                                            <td><strong ng-bind-html="GetColumnDetails('employerLevy2Contri') | trustedHTML">Levy 2</strong></td>
                                                                            <td><strong ng-bind-html="GetColumnDetails('employerInsolvencyContri') | trustedHTML">Insolvency contribution</strong></td>
                                                                            <td> </td>
                                                                            <td align="right"><strong ng-bind-html="GetColumnDetails('Socialsecuritydeductions') | trustedHTML">Social security deductions</strong></td>

                                                                        </tr>
                                                                        <tr>
                                                                            <td>{Item.employerLevy1Contri}</td>
                                                                            <td>{Item.employerLevy2Contri}</td>
                                                                            <td>{Item.employerInsolvencyContri}</td>
                                                                            <td> </td>
                                                                            <td align="right"><strong>{Item.employerTotalSocialSecurity}</strong></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={4}>
                                                                                <span><strong ng-bind-html="GetColumnDetails('totalContribution') | trustedHTML">Total contribution</strong></span>
                                                                            </td>
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }} className='WordBreak'>
                                                                            <td><strong ng-bind-html="GetColumnDetails('healthInsurance') | trustedHTML">Health insurance</strong></td>
                                                                            <td><strong ng-bind-html="GetColumnDetails('nursingCareInsurance') | trustedHTML">Nursing care insurance</strong></td>
                                                                            <td><strong ng-bind-html="GetColumnDetails('retirementInsurance') | trustedHTML">Retirement insurance</strong></td>
                                                                            <td><strong ng-bind-html="GetColumnDetails('unemploymentInsurance') | trustedHTML">Unemployment insurance</strong></td>
                                                                            <td> </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{Item.empContriHI + Item.employerContriHI}</td>
                                                                            <td>{Item.empContriNCI + Item.employerContriNCI}</td>
                                                                            <td>{Item.empContriRI + Item.employerContriRI}</td>
                                                                            <td>{Item.empContriUI + Item.employerContriUI}</td>
                                                                            <td align="right"><strong> </strong></td>
                                                                        </tr>
                                                                        <tr style={{ backgroundColor: "#f2f2f2" }} className='WordBreak'>
                                                                            <td ><strong>Levy 1</strong></td>
                                                                            <td ><strong>Levy 2</strong></td>
                                                                            <td ><strong>Insolvency contribution</strong></td>
                                                                            <td> </td>
                                                                            <td align="right"><strong>Total Social security deductions</strong>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{Item.employerLevy1Contri}</td>
                                                                            <td>{Item.employerLevy2Contri}</td>
                                                                            <td>{Item.employerInsolvencyContri}</td>
                                                                            <td> </td>
                                                                            <td align="right"><strong>{Item.totalSocialContri}</strong></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                )
                            })
                        }
                    </div>
                </Modal.Body>
                <div className="modal-footer footer-model">
                    <div className="col-sm-12">
                        <div className="row">
                            {
                                SalaryItems.map((Item, index) => {
                                    return (
                                        <>
                                            <div key={index} className="ItemInfo col-sm-6">
                                                <div className="text-left">
                                                    Created <span ng-bind="Item.Created | date:'dd/MM/yyyy'"> {Item.Created != null ? moment(Item.Created).format('DD/MM/YYYY') : ""}</span> by
                                                    <span className="footerUsercolor"> {Item.Author.Title != undefined ? Item.Author.Title : ""}</span>
                                                </div>
                                                <div className="text-left">
                                                    Last modified <span ng-bind="Item.Modified | date:'dd/MM/yyyy hh:mm'"> {Item.Modified != null ? moment(Item.Modified).format('DD/MM/YYYY hh:ss') : ""}</span> by
                                                    <span className="footerUsercolor"> {Item.Editor.Title != undefined ? Item.Editor.Title : ""}</span>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                            <div className="col-sm-6 PadR0 ItemInfo-right">
                                <div className="pull-right">
                                    
                                    <ReactToPrint
                                        trigger={() => <span className='FooterBtn'>Employee Pdf</span>}
                                        content={() => componentRef.current}
                                    />

                                    <ReactToPrint
                                        trigger={() => <Button type="button" variant="primary" className='FooterBtn'>Print</Button>}
                                        content={() => componentLongRef.current}
                                    />
                                    <Button type="button" variant="secondary" className='FooterBtn' onClick={handleClose}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default SalarySlipPopup;