import * as React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../components/Style.css';


const PayrollComponents = () => {
    return (
        <div>
            <div>
  
                <div className="Contact_Info pad0 underline-border">
                    <div className='yearSlect'>
                        <select id="SalViewYear">
                            <option value="none" disabled>Select Year</option>
                            <option value="2022" >2022</option>
                        </select>
                    </div>

                    <div ng-show="showHRDetailsPopup" className="ViewPaySlipBtn mb-10" ng-cloak>
                        <div ng-show="isHR">
                            <span >
                                <span ng-hide="ViewSalarySlip"><span ng-click="AddNewPayment(undefined,'Create')" className="btn btn-primary btn-sm CreateSalarySlip ">Payroll Account</span>
                                </span>
                            </span>

                        </div>
                    </div>
                </div>

                <div id="printPayRoll">
                    <div className="col-sm-12 pad0">
                        <strong>
                            <span ng-bind-html="GetColumnDetails('Payroll Account')">Payroll Account</span>
                            <span> 2022</span>
                        </strong>
                    </div>


                    <table className="table payRoll-TopTable">
                        <tbody><tr>
                            <td className="padL-0">
                                <table className="table payRoll-TopTable">
                                    <tbody><tr className="TableColor">
                                        <td className="TableTdSize" ng-bind-html="GetColumnDetails('accountingPeriod')" >Accounting period</td>
                                        <td className="TableTdSize" >January-2022 To August-2022</td>

                                    </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('NAME')" >Name</td>
                                            <td className="TableTdSize" >Abhishek tiwari</td>
                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('address')" >Address</td>
                                            <td className="TableTdSize" >Test Address 201307 test</td>

                                        </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('Fedral_State')" >Federal State</td>
                                            <td className="TableTdSize" >Berlin-West</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('dateOfBirth')" >Date of Birth</td>
                                            <td className="TableTdSize" >18/09/2000</td>

                                        </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('StaffID')" >Staff-ID</td>

                                            <td className="TableTdSize" >HHHH-00007</td>
                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('entryDate')" >Entry Date</td>

                                            <td className="TableTdSize" >01/01/2021</td>
                                        </tr>
                                    </tbody></table>
                            </td>

                            <td>
                                <table className="table table-striped">
                                    <tbody><tr className="TableColor">
                                        <td className="TableTdSize" ng-bind-html="GetColumnDetails('healthInsurance')" >Health insurance</td>
                                        <td className="TableTdSize" >ggggggg</td>
                                    </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('ContriRateHI')" >Contribution rate HI</td>
                                            <td className="TableTdSize" >14,60 %</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('additionalContribution')" >Additional contribution HI</td>
                                            <td className="TableTdSize" >2,00 %</td>

                                        </tr>
                                        <tr>
                                            <td ng-bind-html="GetColumnDetails('ContributionGroupKey')" >Contribution group key</td>
                                            <td >1322</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td ng-bind-html="GetColumnDetails('PersonGroupKey')" >Group</td>
                                            <td >104</td>
                                        </tr>
                                        <tr>
                                            <td ng-bind-html="GetColumnDetails('contributionStatus')" >Contribution status</td>
                                            <td ng-bind="GetColumnDetails(AllEmployeeDetails.contributionStatus)" >Standard</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td ng-bind-html="GetColumnDetails('socialSecurityNo')" >Social Security No.</td>
                                            <td >10 241190 K 510</td>

                                        </tr>
                                    </tbody></table>
                            </td>

                            <td className="padR-0">
                                <table className="table">
                                    <tbody><tr className="TableColor">
                                        <td className="TableTdSize" ng-bind-html="GetColumnDetails('NCISurcharge')" >PV surcharge</td>
                                        <td className="TableTdSize" ng-bind="GetColumnDetails(isNCISurcharge)" >No</td>
                                    </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('taxId')" >Tax-ID</td>
                                            <td className="TableTdSize" >888</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('taxclassName')" >Tax className</td>
                                            <td className="TableTdSize" >IV</td>

                                        </tr>
                                        <tr>
                                            <td ng-bind-html="GetColumnDetails('monthlyAllowance')" >Monthly tax allowance</td>
                                            <td >97,00 EUR</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td ng-bind-html="GetColumnDetails('churchTax')" >Church tax</td>
                                            <td ng-bind="GetColumnDetails(AllEmployeeDetails.churchTax)" >Yes</td>

                                        </tr>
                                        <tr>
                                            <td ng-bind-html="GetColumnDetails('childAllowances')" >Child allowance</td>
                                            <td >4.5</td>

                                        </tr>
                                    </tbody></table>
                            </td>
                        </tr>
                        </tbody></table>

                    <table className="payRollTable table mt-10">
                        <thead>
                            <tr>
                                <td>&nbsp;</td>
                                <td ng-repeat="item in Months track by $index">January</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('accountingDate')">Accounting date</td>
                                <td ng-repeat="item in accountingDate track by $index"></td>

                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerCosts')">Employer costs</td>
                                <td ng-repeat="item in employerCosts track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('grossWage')">Gross wage</td>
                                <td ng-repeat="item in grossWage track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('grossTaxAmount')">Gross tax amount</td>
                                <td ng-repeat="item in grossTax track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('NRPSubToTax')">Non Recurring Payments (subject to tax & social security)</td>
                                <td ng-repeat="item in NRPSubToTax track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('NRPNotSubToTax')">Non Recurring Payments (not subject to tax & social security)</td>
                                <td ng-repeat="item in NRPNotSubToTax track by $index"></td>
                            </tr>
                            <tr className="">
                                <td ng-bind-html="GetColumnDetails('netSalaries')">Net withdrawals/ Net renumeration</td>
                                <td ng-repeat="item in netSalaries track by $index"></td>
                            </tr>

                            <tr className="table-label bdr-top">
                                <td ng-bind-html="GetColumnDetails('taxes')">Taxes</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('incomeTax')">Income tax</td>
                                <td ng-repeat="item in incomeTax track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('solidaritySurcharge')">Solidarity surcharge</td>
                                <td ng-repeat="item in solidaritySurcharge track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('churchTaxValue')">Church Tax</td>
                                <td ng-repeat="item in churchTaxValue track by $index"></td>
                            </tr>
                            {/* <tr ng-if="showUFRT">
                    <td ng-bind-html="GetColumnDetails('uniformFlatRateTax')"></td>
                    <td ng-repeat="item in uniformFlatRateTax track by $index"></td>
                </tr> */}
                            <tr className="table-label bdr-top">
                                <td ng-bind-html="GetColumnDetails('employerShareOfSocialContributions')">Employee share of social contributions</td>
                                <td >&nbsp;</td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriHI')">Health insurance employee</td>
                                <td ng-repeat="item in empContriHI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriAHI')">Health Insurance Additional contribution</td>
                                <td ng-repeat="item in empContriAHI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriRI')">Retirement insurance employee</td>
                                <td ng-repeat="item in empContriRI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriUI')">Unemployement insurance employee</td>
                                <td ng-repeat="item in empContriUI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriNCI')">Nursing care insurance employee</td>
                                <td ng-repeat="item in empContriNCI track by $index"></td>
                            </tr>
                            <tr className="">
                                <td ng-bind-html="GetColumnDetails('empContriNCISurcharge')">Nursing care insurance surcharge</td>
                                <td ng-repeat="item in empContriNCISurcharge track by $index"></td>
                            </tr>

                            <tr className="table-label bdr-top">
                                <td ng-bind-html="GetColumnDetails('employersSocialContributions')">Employer's social contributions</td>
                                <td>&nbsp;</td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriHI')">Health insurance employer</td>
                                <td ng-repeat="item in employerContriHI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriAHI')">Health Insurance Additional Contribution</td>
                                <td ng-repeat="item in employerContriAHI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriRI')">Retirement insurance employer</td>
                                <td ng-repeat="item in employerContriRI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriUI')">Unemployement insurance employer</td>
                                <td ng-repeat="item in employerContriUI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriNCI')">Nursing care insurance employer</td>
                                <td ng-repeat="item in employerContriNCI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerLevy1Contri')">Levy 1</td>
                                <td ng-repeat="item in employerLevy1Contri track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerLevy2Contri')">Levy 2</td>
                                <td ng-repeat="item in employerLevy2Contri track by $index"></td>
                            </tr>
                            <tr className="bdr-top">
                                <td ng-bind-html="GetColumnDetails('employerInsolvencyContri')">Insolvency contribution</td>
                                <td ng-repeat="item in employerInsolvencyContri track by $index">
                                </td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('grossSalarySubToRIUI')">Gross salary subject to pension and unemployment insurance</td>
                                <td ng-repeat="item in grossSalarySubToRIUI track by $index"></td>

                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('grossSalarySubToHINCI')">Gross salary subject to health and nursing care insurance</td>
                                <td ng-repeat="item in grossSalarySubToHINCI track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('totalEmployerSocialConti')">Total employer contribution</td>
                                <td ng-repeat="item in totalEmployerSocialConti track by $index">
                                </td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('totalLevys')">Total levys</td>
                                <td ng-repeat="item in totalLevys track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('totalTotalTax')">Total tax</td>
                                <td ng-repeat="item in totalTotalTax track by $index"></td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('totalSocialContiEmp')">Total social security contributions</td>
                                <td ng-repeat="item in totalSocialContiEmp track by $index"></td>
                            </tr>
                            <tr className="bdr-bottom">
                                <td ng-bind-html="GetColumnDetails('payOut')">Payment amount</td>
                                <td ng-repeat="item in payOut track by $index"></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <button type="button" className="pull-right btn btn-primary mt-2" ng-click="print()">Print</button>
            </div>
        </div>
    )
}
export default PayrollComponents;