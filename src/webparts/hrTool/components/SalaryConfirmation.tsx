import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import '../components/EditEmployeeInfo.css';
import '../components/hrportal.css';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';


const SalaryConfirmationPopup = ((props: any) => {
    console.log(props.props)
    console.log("......ContractData", props.contractData)
    const [lgShow, setSalaryConfi] = useState(false);
    const handleClose = () => setSalaryConfi(false);
    const [SalaryItem, setSalaryConfirmation] = useState(null);
    // const [UpdateData, setUpdateData] = useState();
    useEffect(() => {
        SalaryConfirmationData();
    }, []);

    const SalaryConfirmationData = async () => {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
        await web.lists.getById('40f6d3fb-5396-45d1-86d5-dbc5e88c11c8').items.select("Id,NRPSubToTax,NRPSubToTaxDesc,NRPNotSubToTax,NRPNotSubToTaxDesc,uniformFlatRateTax,netNonRecurringPayments,StaffID,Title,Fedral_State,ContriRateHI,healthInsuranceCompany,monthlyAllowance,taxClass,additionalContribution,childAllowances,churchTax,dateOfBirth,personnelNumber,grossSalary,nonRecurringPayments,totalGross,incomeTax,solidaritySurcharge,churchTaxValue,fisicalDeduction,empContriHI,empContriUI,empContriNCI,empContriNCISurcharge,empContriRI,totalSocialSecurityDeduction,netIncome,netSalaries,netDeduction,payOut,employerContriHI,employerContriUI,employerContriNCI,employerContriRI,employerContritaxFreeBenefits,employerLevy1Contri,employerLevy2Contri,employerInsolvencyContri,employerTotalContri,BIC,IBAN,employerTotalSocialSecurity,employerAditionalContri,employeeTotalSocialContri,totalSocialContri,contributionGroupNCI,contributionGroupUI,contributionGroupRI,contributionGroupHi,contributionStatus,Parenthood,insuranceNo,maritalStatus,totalContribution,StreetNo,City,additionalContributionToHI,Month,Year,ZIPCode,HouseNo,Title,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,Contract/WorkingHours").expand("Author,Contract,Editor").filter("Id eq '" + props.props + "'").get()
            .then((Items) => {
                console.log(Items);
                setSalaryConfirmation(Items[0]);
            }).catch((err) => {
                console.log(err.message);
            });
    }


    return (
        <>
           <img  onClick={() => setSalaryConfi(true)}  data-themekey="#" src="/_layouts/images/edititem.gif" />
            <Modal
                size="xl"
                show={lgShow}
                onHide={() => setSalaryConfi(false)}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <h3 className='modal-title'>Salary Info -
                        <span className='form-inline mr-10 pull-right'>
                            <label className="mr-3" htmlFor='accountingDate'>Accounting Date</label>
                            <input type='date' id='accountingDate' placeholder=''/>
                        </span>
                    </h3>
                    <button type="button" className='Close-button' onClick={handleClose}>×</button>
                </Modal.Header>
                <Modal.Body className='p-2 bg-f5f5'>

                    {SalaryItem && <><div className='row mb-4'>
                        <div className='col-sm-12'>
                            <div className='row mb-4'>
                                <div className='col-sm-3'>
                                    <div className='card px-3 mb-10'>
                                        <span className='card-header-title'>Personal Information</span>
                                        <div className='form-group'>
                                            <label htmlFor='Marital'>Marital status</label>
                                            <select className='form-control' defaultValue={SalaryItem.maritalStatus} id='Marital'>
                                                <option selected></option>
                                                <option value='Single'>Ledig</option>
                                                <option value='Married'>Verheiratet</option>
                                                <option value='Divorced'>Geschieden</option>
                                                <option value='Widowed'>Verwitwet</option>
                                            </select>
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='IBAN'>IBAN</label>
                                            <input type='text' defaultValue={SalaryItem.IBAN} className='form-control' id='IBAN' placeholder='Enter IBAN' />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm-3'>
                                    <div className='card px-3 mb-10'>
                                        <span className='card-header-title'>Address Information</span>

                                        <div className='form-group'>
                                            <label htmlFor='federalState'>Federal state</label>
                                            <select defaultValue={SalaryItem.Fedral_State} className='form-control'
                                                id='federalState'>
                                                <option selected></option>
                                                <option value='State.ID'></option>
                                            </select>

                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='BIC'>BIC</label>
                                            <input type='text' defaultValue={SalaryItem.BIC} className='form-control' id='BIC' placeholder='Enter BIC' />
                                        </div>

                                    </div>
                                </div>
                                <div className='col-sm-6 '>
                                    {props.contractData.map((Contract: any, index: any) => {
                                        return (
                                            <div className='card px-3 mb-10' >
                                                <span className='card-header-title'>Contract Details</span>
                                                <div className='col-sm-12 row pad0'>
                                                    <div className='form-group col-sm-6 padL-0'>
                                                        <label htmlFor='contractNumber' className='form-label'>Contract Number</label>
                                                        <input defaultValue={Contract.contractNumber} type='number' className='form-control'
                                                            id='grossSalary' placeholder='Enter Contract Number' readOnly />
                                                    </div>
                                                    <div className='form-group col-sm-6 padR-0'>
                                                        <label htmlFor='startOfContract'>Start of contract</label>
                                                        <input value={Contract.startDate != null ? moment(Contract.startDate).format('DD/MM/YYYY') : ""} type='text' className='form-control'
                                                            id='startOfContract' placeholder='Enter Start of contract' readOnly />
                                                    </div>
                                                    <div className='form-group col-sm-6 padL-0'>
                                                        <label htmlFor='endOfContract'>End of contract</label>
                                                        <input value={Contract.endDate != null ? moment(Contract.endDate).format('DD/MM/YYYY') : ""} type='text' className='form-control'
                                                            id='endOfContract' placeholder='Enter End of contract' readOnly />
                                                    </div>
                                                    <div className='form-group col-sm-6 padR-0'>
                                                        <label htmlFor='grossSalary'>Gross salary</label>
                                                        <input defaultValue={Contract.GrossSalary} type='number' className='form-control'
                                                            id='grossSalary' placeholder='Enter Gross Salary' readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })

                                    }


                                </div>
                            </div>
                        </div>
                    </div>
                        <div className='row mb-4'>
                            <div className='col-sm-12'>
                                <div className='card px-3 mb-10'>
                                    <span className='card-header-title'>Tax information</span>
                                    <div className='row'>
                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='TaxNo'>Tax No.</label>
                                            <input type='text' className='form-control' id='TaxNo'
                                                placeholder='Enter Tax No.' />
                                        </div>
                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='taxclassName'>Tax className</label>
                                            <select defaultValue={SalaryItem.taxClass} className='form-control'id='taxclassName'>
                                                <option selected>Select an Option</option>
                                                <option value='I'>I</option>
                                                <option value='II'>II</option>
                                                <option value='III'>III</option>
                                                <option value='IV'>IV</option>
                                                <option value='V'>V</option>
                                                <option value='VI'>VI</option>
                                            </select>
                                        </div>
                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='childAllowance'>Child allowance</label>
                                            <span>
                                                <select className='form-control' id='childAllowance'>
                                                    <option ng-repeat='options in ChildAllowancesOptions'>
                                                    </option>
                                                </select>
                                            </span>
                                        </div>
                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='Church-Tax'>Church tax</label>
                                            <div className='form-check-inline form-group-border mb-0'>
                                                <div className='form-check form-check-inline'>
                                                    <input defaultChecked={SalaryItem.churchTax=="yes"} value='yes' id='Yes3' name='ChurchTax' type='radio' className='form-check-input' />
                                                    <label className='form-check-label' htmlFor='Yes3'>Yes</label>
                                                </div>
                                                <div className='form-check form-check-inline'> 
                                                    <input defaultChecked={SalaryItem.churchTax=="no"} value='no' id='No3' name='ChurchTax' type='radio' className='form-check-input' />
                                                    <label className='form-check-label' htmlFor='No3'>No</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='monthlyTaxAllowance'>Monthly tax allowance</label>
                                            <input type='number' defaultValue={SalaryItem.monthlyTaxAllowance != null ? SalaryItem.monthlyTaxAllowance : 0} className='form-control'
                                                id='monthlyTaxAllowance' placeholder='Enter Monthly tax allowance' />
                                        </div>

                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='incomeTax'>Income Tax</label>
                                            <input type='text' defaultValue={SalaryItem.incomeTax} className='form-control' id='incomeTax'
                                                placeholder='Enter Income Tax' />
                                        </div>
 
                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='taxFreePayment'>Tax Free Payment</label>
                                            <input type='text' className='form-control'
                                                id='taxFreePayment' placeholder='Enter Tax Free Payment' />
                                        </div>

                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='solidaritySurcharge'>Solidarity Surcharge</label>
                                            <input defaultValue={SalaryItem.solidaritySurcharge} type='text' className='form-control' id='solidaritySurcharge'
                                                placeholder='Enter Solidarity Surcharge' />
                                        </div>

                                        <div className='col-sm-4 form-group'>
                                            <label className='full_width' htmlFor='NRPSubToTaxInput'>Non Recurring Payments <span className='f-12'>(subject to tax & social
                                                security)</span></label>
                                            <div className='col-sm-12 pad0' id='NRPSubToTax'><input defaultValue={SalaryItem.NRPSubToTax} type='number'
                                                className='form-control mb-2' id='NRPSubToTaxInput'
                                                placeholder='Enter Non Recurring Payments' /></div>
                                            {/* <div className='col-sm-8 padR-0'> <input
        ng-hide='NRPSubToTax==undefined||NRPSubToTax==0' type='text'
        className='form-control' id='NRPSubToTaxDesc'
        placeholder='Please add the description' /></div> */}
                                        </div>
                                        <div className='col-sm-4 form-group'>
                                            <label className='full_width' htmlFor='NRPNotSubToTax'>Non Recurring Payments <span className='f-12'>(not subject to
                                                tax & social
                                                security)</span></label>
                                            <div className='col-sm-12 pad0' id='NRPNotSubToTax'> <input defaultValue={SalaryItem.NRPNotSubToTax} type='number'
                                                className='form-control' placeholder='Enter Non Recurring Payments' />
                                            </div>
                                            {/* <div className='col-sm-8 padR-0'> <input
        ng-hide='NRPNotSubToTax==undefined||NRPNotSubToTax==0'
        type='text' className='form-control' id='NRPNotSubToTaxDesc'
        placeholder='Please add the description' /></div> */}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div><div className='row'>
                            <div className='col-sm-12'>
                                <div className='card px-3'>
                                    <span className='card-header-title'>Social security insurance</span>

                                    <div className='row'>
                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='Parenthood'>Parenthood</label>
                                            <div className=' form-check-inline form-group-border mb-0'>
                                                <div className='form-check form-check-inline'>
                                                    <input defaultChecked={SalaryItem.Parenthood=="yes"} value='yes' id='ParenthoodYes' name='Parenthood' type='radio' className='form-check-input' />
                                                    <label className='form-check-label' htmlFor='ParenthoodYes'>YES</label>
                                                </div>
                                                <div className='form-check form-check-inline'>
                                                    <input defaultChecked={SalaryItem.Parenthood=="no"} value='no' id='ParenthoodNO' name='Parenthood' type='radio' className='form-check-input' />
                                                    <label className='form-check-label' htmlFor='ParenthoodNO'>NO</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='healthInsuranceType'>Health Insurance Type</label>
                                            <select name='healthInsuranceType' id='healthInsuranceType' className='form-control'>
                                                <option  selected>Select an Option</option>
                                                <option value='None'>None</option>
                                                <option value='Statutory'>Statutory</option>
                                                <option value='Private'>Private</option>
                                            </select>
                                        </div>
                                        <div className='col-sm-3 form-group'>
                                            <label htmlFor='healthInsuranceNo'>Health Insurance No</label>
                                            <input type='text' className='form-control' defaultValue={SalaryItem.insuranceNo} id='healthInsuranceNo' placeholder='Enter Health Insurance no' />
                                        </div>
                                        <div className='col-sm-3 form-group'>
                                            <label htmlFor='healthInsuranceCompany'>Health Insurance Company</label>
                                            <input type='text' className='form-control' id='healthInsuranceCompany' defaultValue={SalaryItem.healthInsuranceCompany} placeholder='Enter Company Name' />
                                        </div>

                                        <div className='col-sm-2 form-group'>
                                            <label htmlFor='contributionStatus'>Contribution Status</label>
                                            <select name='contributionStatus' defaultValue={SalaryItem.contributionStatus}  id='contributionStatus' className='form-control'>
                                                <option selected>Select an Option</option>
                                                <option value='Standard'>Standard</option>
                                                <option value='Low-Paid Worker'>Low-Paid Worker</option>
                                                <option value='Minijob'>Minijob</option>
                                                <option value='Midi-Job'>Midi-Job</option>
                                                <option value='Working Student'>Working Student</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-sm-2'>
                                            <label htmlFor='levy1Type'>Levy 1 Type</label>
                                            <select name='levy1Type' id='levy1Type' className='form-control'>
                                                <option selected>Select an Option</option>
                                                <option value='Standard'>Standard</option>
                                                <option value='Reduced'>Reduced</option>
                                                <option value='Increased'>Increased</option>
                                            </select>
                                        </div>
                                        <div className='col-sm-2'>
                                            <label htmlFor='levy1RateOfContribution'>Levy 1 Contribution Rate</label>
                                            <input ng-change='calculateValues()' type='number' className='form-control' id='levy1RateOfContribution' placeholder='Enter Levy 1 Contribution' />
                                        </div>
                                        <div className='col-sm-3'>
                                            <label htmlFor='levy1ReimbursementRate'>Levy 1 Reimbursement Rate</label>
                                            <input ng-change='calculateValues()' type='number' className='form-control' id='levy1ReimbursementRate' placeholder='Enter Levy 1 Reimbursement Rate' />
                                        </div>
                                        <div className='col-sm-2'>
                                            <label htmlFor='levy2ContributionRate'>Levy 2 Contribution Rate</label>
                                            <input ng-change='calculateValues()' type='number' className='form-control' id='levy2ContributionRate' placeholder='Enter Levy 2 Contribution Rate' />
                                        </div>
                                        <div className='col-sm-3'>
                                            <label htmlFor='additionalContributionToHI'>Additional Contribution To HI (Rate)</label>
                                            <input ng-change='calculateValues()' type='number' className='form-control' id='additionalContributionToHI' placeholder='Enter Additional Contribution To HI' />
                                        </div>
                                    </div>

                                    <div className='form-group row'>
                                        <div className='col-sm-3 '>
                                            <label htmlFor='tax className'>Contribution group HI</label>
                                            <select defaultValue={SalaryItem.contributionGroupHi} className='form-control' id='contributionGroupHi'>
                                                <option selected>Select an Option</option>
                                                <option ng-value="0">0 - No contribution</option>
                                                <option ng-value="1">1 - General contribution</option>
                                                <option ng-value="2" disabled>
                                                    2 - Reduced contribution</option>
                                                <option ng-value="3" disabled>
                                                    3 - Contribution to agricultural health insurance
                                                </option>
                                                <option ng-value="4" disabled>
                                                    4 - Employer contribution to agricultural health
                                                    insurance</option>
                                                <option ng-value="6" disabled>
                                                    6 - Lump sum for marginally employed persons
                                                </option>
                                                <option ng-value="9" disabled>
                                                    9 - Voluntary insurance (employer pays)</option>
                                            </select>
                                        </div>

                                        <div className='col-sm-3 '>
                                            <label htmlFor='contributionGroupRI'>Contribution group RI</label>
                                            <select className='form-control' defaultValue={SalaryItem.contributionGroupRI} id='contributionGroupRI'>
                                                <option selected>Select an Option</option>
                                                <option ng-value="0">0 - No contribution</option>
                                                <option ng-value="1">1 - Full contribution</option>
                                                <option ng-value="3">3 - Half contribution</option>
                                                <option ng-value="5" disabled>5 - Lump sum for marginally employed persons
                                                </option>
                                            </select>
                                        </div>
                                        <div className='col-sm-3 '>
                                            <label htmlFor='contributionGroupUI'>Contribution group UI</label>
                                            <select defaultValue={SalaryItem.contributionGroupUI} className='form-control' id='contributionGroupUI'>
                                                <option selected>Select an Option</option>
                                                <option ng-value="0">0 - No contribution</option>
                                                <option ng-value="1">1 - Full contribution</option>
                                                <option ng-value="2">2 - Half contribution</option>

                                            </select>
                                        </div>
                                        <div className='col-sm-3 '>
                                            <label htmlFor='contributionGroupNCI'>Contribution group NCI</label>
                                            <select defaultValue={SalaryItem.contributionGroupNCI} className='form-control' id='contributionGroupNCI'>
                                                <option selected>Select an Option</option>
                                                <option ng-value="0">0 - No contribution</option>
                                                <option ng-value="1">1 - Full contribution</option>
                                                <option ng-value="2">2 - Half contribution</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='form-group row'>
                                        <div className='col-sm-2 '>
                                            <label htmlFor='HealthInsurance'>Health Insurance</label>
                                            <input type='text' className='form-control' id='HealthInsurance' placeholder='Health Insurance' readOnly />
                                        </div>
                                        <div className='col-sm-2 '>
                                            <label htmlFor='RetirementInsurance'>Retirement Insurance</label>
                                            <input type='text' className='form-control' id='RetirementInsurance' placeholder='Retirement Insurance' readOnly />
                                        </div>
                                        <div className='col-sm-2 '>
                                            <label htmlFor='unemploymentInsurance'>Unemployment Insurance</label>
                                            <input type='text' className='form-control' id='unemploymentInsurance' placeholder='Unemployment Insurance' readOnly />
                                        </div>
                                        <div className='col-sm-3 '>
                                            <label htmlFor='NursingCareInsurance'>Nursing care insurance</label>
                                            <input type='text' className='form-control' id='NursingCareInsurance' placeholder='Nursing care insurance' readOnly />
                                        </div>

                                        <div className='col-sm-3'>
                                            <label htmlFor='NCI_SurchargeVal'>Nursing care insurance surcharge
                                            </label>
                                            <input type='text' className='form-control' id='NCI_SurchargeVal' placeholder='Nursing care insurance surcharge' readOnly />
                                        </div>
                                    </div>
                                    <div className='form-group row'>
                                        <div className='col-sm-3 '>
                                            <label htmlFor='additionalContributionToHIVal'>Additional Contribution To HI</label>
                                            <input type='text' className='form-control' id='additionalContributionToHIVal' placeholder='Additional Contribution To HI' readOnly />
                                        </div>
                                        <div className='col-sm-2 '>
                                            <label htmlFor='Levy1Contribution'>Levy1 Contribution</label>
                                            <input type='text' className='form-control' id='Levy1Contribution' placeholder='Levy1 Contribution' readOnly />
                                        </div>
                                        <div className='col-sm-2 '>
                                            <label htmlFor='Levy2Contribution'>Levy 2 Contribution</label>
                                            <input type='text' className='form-control' id='Levy2Contribution' placeholder='Levy 2 Contribution' readOnly />
                                        </div>

                                        <div className='col-sm-2'>
                                            <label htmlFor='ChurchTaxVal'>Church Tax
                                            </label>
                                            <input type='text' className='form-control' id='ChurchTaxVal' placeholder='Church Tax' readOnly />
                                        </div>
                                        <div className='col-sm-3'>
                                            <label htmlFor='insolvencyContributionVal'>Insolvency Contribution
                                            </label>
                                            <input type='text' className='form-control' id='insolvencyContributionVal' placeholder='Insolvency Contribution' readOnly />
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div></>}

                </Modal.Body>
                <div className="modal-footer">
                    <div className="col-sm-12">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="text-left">
                                    Created <span ng-bind="Item.Created | date:'dd/MM/yyyy'"></span> by
                                    <span className="footerUsercolor"> </span>
                                </div>
                                <div className="text-left">
                                    Last modified <span ng-bind="Item.Modified | date:'dd/MM/yyyy hh:mm'"></span> by
                                    <span className="footerUsercolor"></span>
                                </div>
                                <div className="text-left">
                                    <a className="hreflink" ng-click="removeItem(institution.Id)">
                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/_layouts/images/delete.gif" />
                                        Delete this item
                                    </a>
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className="pull-right">
                                    <Button type="button" variant="primary" className='FooterBtn'>Save</Button>
                                    <Button type="button" variant="secondary" className='FooterBtn' onClick={handleClose}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal>
        </>
    )
})
export default SalaryConfirmationPopup;