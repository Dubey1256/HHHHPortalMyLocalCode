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
            <img onClick={() => setLgShow(true)} ng-src="/_layouts/images/edititem.gif" data-themekey="#" src="/_layouts/images/edititem.gif" />
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
                                        trigger={() => <span className="FooterBtn">Employee Pdf</span>}
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