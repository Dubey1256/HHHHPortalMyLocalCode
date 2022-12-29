import * as React from 'react';
import { useEffect, useState } from 'react';
import '../components/Style.css';
import { Web } from "sp-pnp-js";
import * as moment from 'moment';

const PayrollComponents = () => {

    let MonthsName = [{ 'EN': 'January', 'DE': 'Januar' }, { 'EN': 'February', 'DE': 'Februar' }, { 'EN': 'March', 'DE': 'März' }, { 'EN': 'April', 'DE': 'April' }, { 'EN': 'May', 'DE': 'Mai' }, { 'EN': 'June', 'DE': 'Juni' }, { 'EN': 'July', 'DE': 'Juli' }, { 'EN': 'August', 'DE': 'August' }, { 'EN': 'September', 'DE': 'September' }, { 'EN': 'October', 'DE': 'Oktober' }, { 'EN': 'November', 'DE': 'November' }, { 'EN': 'December', 'DE': 'Dezember' }];
    let FederalState = [{ Title: "Bremen", ID: 1 }, { Title: "Hamburg", ID: 2 }, { Title: "Niedersachsen", ID: 3 }, { Title: "Nordrhein-Westfalen", ID: 4 }, { Title: "Hessen", ID: 5 }, { Title: "Rheinland-Pfalz", ID: 6 }, { Title: "Saarland", ID: 7 }, { Title: "Berlin-West", ID: 8 }, { Title: "Schleswig-Holstein", ID: 9 }, { Title: "Bayern", ID: 10 }, { Title: "Baden-Württemberg", ID: 11 }, { Title: "Thüringen", ID: 12 }, { Title: "Sachsen-Anhalt", ID: 13 }, { Title: "Berlin-Ost", ID: 14 }, { Title: "Brandenburg", ID: 15 }, { Title: "Mecklenburg-Vorpommern", ID: 16 }, { Title: "Sachsen", ID: 17 }]
    
    let AvailableMonthsName: any[] = [];
    let Months: any[] = [];
    let accountingDate: any[] = [];
    let employerCosts: any[] = [];
    let grossWage: any[] = [];
    let grossTax: any[] = [];
    let NRPSubToTax: any[] = [];
    let NRPNotSubToTax: any[] = []
    let incomeTax: any[] = [];
    let solidaritySurcharge: any[] = [];
    let churchTaxValue: any[] = [];
    let empContriHI: any[] = [];
    let empContriAHI: any[] = [];
    let empContriUI: any[] = [];
    let empContriNCISurcharge: any[] = [];
    let empContriNCI: any[] = [];
    let empContriRI: any[] = [];
    let employerContriHI: any[] = [];
    let employerContriAHI: any[] = [];
    let employerContriUI: any[] = [];
    let employerContriNCI: any[] = [];
    let employerContriRI: any[] = [];
    let employerLevy1Contri: any[] = [];
    let employerLevy2Contri: any[] = [];
    let employerInsolvencyContri: any[] = [];
    let grossSalarySubToRIUI: any[] = [];
    let grossSalarySubToHINCI: any[] = [];
    let totalEmployerSocialConti: any[] = [];
    let totalLevys: any[] = [];
    let totalTotalTax: any[] = [];
    let totalSocialContiEmp: any[] = [];
    let payOut: any[] = [];
    let netSalaries: any[] = [];
    let uniformFlatRateTax: any[] = [];
    let showUFRT:any=false;

const [FinalMonths,setMonths]=useState([]);
const [FinalaccountingDate,setaccountingDate]=useState([]);
const [FinalemployerCosts,setemployerCosts]=useState([]);
const [FinalgrossWage,setgrossWage]=useState([]);
const [FinalgrossTax,setgrossTax]=useState([]);
const [FinalNRPSubToTax,setNRPSubToTax]=useState([]);
const [FinalNRPNotSubToTax,setNRPNotSubToTax]=useState([]);
const [FinalincomeTax,setincomeTax]=useState([]);
const [FinalsolidaritySurcharge,setsolidaritySurcharge]=useState([]);
const [FinalchurchTaxValue,setchurchTaxValue]=useState([]);
const [FinalempContriHI,setempContriHI]=useState([]);
const [FinalempContriAHI,setempContriAHI]=useState([]);
const [FinalempContriUI,setempContriUI]=useState([]);
const [FinalempContriNCISurcharge,setempContriNCISurcharge]=useState([]);
const [FinalempContriNCI,setempContriNCI]=useState([]);
const [FinalempContriRI,setempContriRI]=useState([]);
const [FinalemployerContriHI,setemployerContriHI]=useState([]);
const [FinalemployerContriAHI,setemployerContriAHI]=useState([]);
const [FinalemployerContriUI,setemployerContriUI]=useState([]);
const [FinalemployerContriNCI,setemployerContriNCI]=useState([]);
const [FinalemployerContriRI,setemployerContriRI]=useState([]);
const [FinalemployerLevy1Contri,setemployerLevy1Contri]=useState([]);
const [FinalemployerLevy2Contri,setemployerLevy2Contri]=useState([]);
const [FinalemployerInsolvencyContri,setemployerInsolvencyContri]=useState([]);
const [FinalgrossSalarySubToRIUI,setgrossSalarySubToRIUI]=useState([]);
const [FinalgrossSalarySubToHINCI,setgrossSalarySubToHINCI]=useState([]);
const [FinaltotalEmployerSocialConti,settotalEmployerSocialConti]=useState([]);
const [FinaltotalLevys,settotalLevys]=useState([]);
const [FinaltotalTotalTax,settotalTotalTax]=useState([]);
const [FinaltotalSocialContiEmp,settotalSocialContiEmp]=useState([]);
const [FinalpayOut,setpayOut]=useState([]);
const [FinalnetSalaries,setnetSalaries]=useState([]);
const [FinaluniformFlatRateTax,setuniformFlatRateTax]=useState([]);
const [AccountingPeriod,setAccountingPeriod]=useState(null);


    let accountingDateAvailable :any = {};
    let employerCostsAvailable :any = {};
    let grossWageAvailable :any = {};
    let grossTaxAvailable :any = {};
    let NRPSubToTaxAvailable :any = {};
    let NRPNotSubToTaxAvailable :any = {};
    let incomeTaxAvailable :any = {};
    let solidaritySurchargeAvailable :any = {};
    let churchTaxValueAvailable :any = {};
    let empContriHIAvailable :any = {};
    let empContriAHIAvailable :any = {};
    let empContriUIAvailable :any = {};
    let empContriNCISurchargeAvailable :any = {};
    let empContriNCIAvailable :any = {};
    let empContriRIAvailable :any = {};
    let employerContriHIAvailable :any = {};
    let employerContriAHIAvailable :any = {};
    let employerContriUIAvailable :any = {};
    let employerContriNCIAvailable :any = {};
    let employerContriRIAvailable :any = {};
    let employerLevy1ContriAvailable :any = {};
    let employerLevy2ContriAvailable :any = {};
    let employerInsolvencyContriAvailable :any = {};
    let grossSalarySubToRIUIAvailable :any = {};
    let grossSalarySubToHINCIAvailable :any = {};
    let totalEmployerSocialContiAvailable :any = {};
    let totalLevysAvailable :any = {};
    let totalTotalTaxAvailable :any = {};
    let totalSocialContiEmpAvailable :any = {};
    let payOutAvailable :any = {};
    let netSalariesAvailable :any = {};
    let uniformFlatRateTaxAvailable :any = {};


    const searchParams = new URLSearchParams(window.location.search);
    const employeeId = searchParams.get("employeeId");
    const [EmployeeDetails, setEmployeeDetails] = useState(null)
    const [AllSalaryRecords, setAllSalaryRecords] = useState(null)

    const [SmartMetaData, setSmartMetaData] = useState([])
    const [ContractDetails, setContractDetails] = useState([])
    const [SalaryDetails, setSalaryDetails] = useState([])
    const [BackupSalaryDetails, setBackupSalaryDetails] = useState([])
    const ContributionHIValues=[{ Title: "0 - No contribution", ID: 0, CRate: 0 }, { Title: "1 - General contribution", ID: 1, CRate: 14.6 }, { Title: "2 - Reduced contribution", ID: 2, CRate: 0 }, { Title: "3 - Contribution to agricultural health insurance", ID: 3, CRate: 0 }, { Title: "4 - Employer contribution to agricultural health insurance", ID: 4, CRate: 0 }, { Title: "6 - Lump sum for marginally employed persons", ID: 6, CRate: 0 }, { Title: "9 - Voluntary insurance (employer pays)", ID: 9, CRate: 0 }]
    let EmpAge:any='';
    let salDataYears=[];
    let SalViewYear:any='';
    useEffect(() => {
        getSmartMetaData();
        getContractData ();
        getSalaryDetails();
    }, []);
    useEffect(() => {
        
        
        getDataFromEmployeeDetails();
       
    }, [SmartMetaData]);
    useEffect(()=>{
        setSalViewYear();
    },[BackupSalaryDetails])
    function fnCalculateAge(dob:any) {


        var birthDate = new Date(dob);
        console.log(" birthDate" + birthDate);
        var difference = Date.now() - birthDate.getTime();
        var ageDate = new Date(difference);
        var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
        return calculatedAge;
    }
    async function getDataFromEmployeeDetails()  {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
         await web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.getById(parseInt(employeeId)).get().then((data) => {
          try {
            if(SmartMetaData!=undefined&&SmartMetaData.length>0){
                SmartMetaData.map((smartItem:any)=>{
                    if(data.SmartStateId!=undefined&&data.SmartStateId[0]==smartItem.Id){
                        data['federalState']=smartItem.Title
                    }
                })
               }
               data['entryDate']='';
               if(data.dateOfBirth!=undefined){
                EmpAge=fnCalculateAge(data.dateOfBirth)
                data['displayDateOfBirth']= moment(data.dateOfBirth).format('DD/MM/YYYY') ;
               }
               if(data!=undefined&&ContractDetails.length>0){
                data['entryDate']= moment(ContractDetails[0].startDate).format('DD/MM/YYYY') ;
               }
               ContributionHIValues.forEach(Group => {
                if (data.contributionGroupHi != undefined && data.contributionGroupHi == Group.Title) {
                    data.ContriRateHi = Group.CRate;
                }
               });
                   
               let contributionGroupHi = '';
               let contributionGroupRI = '';
               let contributionGroupUI = '';
               let contributionGroupNCI = '';
               if (data.contributionGroupHi != undefined) {
                   contributionGroupHi = data.contributionGroupHi.split(' ', 1)[0]
               }
               if (data.contributionGroupRI != undefined) {
                   contributionGroupRI = data.contributionGroupRI.split(' ', 1)[0]
               }
               if (data.contributionGroupUI != undefined) {
                   contributionGroupUI = data.contributionGroupUI.split(' ', 1)[0]
               }
               if (data.contributionGroupNCI != undefined) {
                   contributionGroupNCI = data.contributionGroupNCI.split(' ', 1)[0]
               }
               data['isNCISurcharge']='';
               if (data.Parenthood != undefined && data.Parenthood == "no") {

                   if (EmpAge > 22) {
                        data['isNCISurcharge'] = 'yes'
                   } else {
                        data['isNCISurcharge'] = 'no';
                   }
               } else if (data.Parenthood != undefined && data.Parenthood == "yes") {
                    data['isNCISurcharge'] = 'no';
               }
               data['ContributionGroupKey']='';
               data['ContributionGroupKey'] = contributionGroupHi + contributionGroupRI + contributionGroupUI + contributionGroupNCI;

                setEmployeeDetails(data)
          } catch (error) {
            console.log(error);
          }
           }).catch((err) => {
               console.log(err);
           });
        
    }
     
    async function getSmartMetaData () {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/');
         await web.lists.getById('d1c6d7c3-f36e-4f95-8715-8da9f33622e7').items.top(4999).get().then((data) => {

         setSmartMetaData(data)
        }).catch((err) => {
            console.log(err.message);
        });
       
    }
    async function getContractData () {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
         await web.lists.getById('986680CE-5D69-47B4-947C-3998DDC3776C').items.filter('HHHHStaff/Id eq '+employeeId).orderBy('startDate').get().then((data) => {

            setContractDetails(data)
        }).catch((err) => {
            console.log(err.message);
        });
       
    }
    function dynamicSort(property:any) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a:any, b:any) {

            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    
    function changeSalViewYear  () {
        Months = [];
        accountingDate = [];
        employerCosts = [];
        grossWage = [];
        grossTax = [];
        NRPSubToTax = [];
        NRPNotSubToTax = [];
        incomeTax = [];
        solidaritySurcharge = [];
        churchTaxValue = [];
        empContriHI = [];
        empContriAHI = [];
        empContriUI = [];
        empContriNCISurcharge = [];
        empContriNCI = [];
        empContriRI = [];
        employerContriHI = [];
        employerContriAHI = [];
        employerContriUI = [];
        employerContriNCI = [];
        employerContriRI = [];
        employerLevy1Contri = [];
        employerLevy2Contri = [];
        employerInsolvencyContri = [];
        grossSalarySubToRIUI = [];
        grossSalarySubToHINCI = [];
        totalEmployerSocialConti = [];
        totalLevys = [];
        totalTotalTax = [];
        totalSocialContiEmp = [];
        payOut = []
        netSalaries = [];
        uniformFlatRateTax = [];


        accountingDateAvailable = {};
        employerCostsAvailable = {};
        grossWageAvailable = {};
        grossTaxAvailable = {};
        NRPSubToTaxAvailable = {};
        NRPNotSubToTaxAvailable = {};
        incomeTaxAvailable = {};
        solidaritySurchargeAvailable = {};
        churchTaxValueAvailable = {};
        empContriHIAvailable = {};
        empContriAHIAvailable = {};
        empContriUIAvailable = {};
        empContriNCISurchargeAvailable = {};
        empContriNCIAvailable = {};
        empContriRIAvailable = {};
        employerContriHIAvailable = {};
        employerContriAHIAvailable = {};
        employerContriUIAvailable = {};
        employerContriNCIAvailable = {};
        employerContriRIAvailable = {};
        employerLevy1ContriAvailable = {};
        employerLevy2ContriAvailable = {};
        employerInsolvencyContriAvailable = {};
        grossSalarySubToRIUIAvailable = {};
        grossSalarySubToHINCIAvailable = {};
        totalEmployerSocialContiAvailable = {};
        totalLevysAvailable = {};
        totalTotalTaxAvailable = {};
        totalSocialContiEmpAvailable = {};
        payOutAvailable = {};
        netSalariesAvailable = {};
        uniformFlatRateTaxAvailable = {};

        if(SalaryDetails.length>0){
            loadPayRollDetails(SalViewYear);
        }
    }
    const year = new Date().getFullYear();
    async function loadPayRollDetails  (PayrollYear:any) {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
        await web.lists.getById('40f6d3fb-5396-45d1-86d5-dbc5e88c11c8').items.filter('(HHHHStaff/Id eq '+employeeId + ")and(Year eq " + PayrollYear+')').orderBy('monthInNumber').get().then((data) => {

            setAllSalaryRecords(data)

            data.map((Item:any)=>{
                if (Item.Month != undefined) {
                    AvailableMonthsName.push(Item.Month);
                    let federalState:any=0;
                    FederalState.map((State:any)=>{
                        if (Item.Fedral_State != undefined && Item.Fedral_State == State.Title) {
                            federalState = State.ID;
                        }
                    })
                   

                    accountingDateAvailable[Item.Month] = Item.accountingDate != undefined ?  moment(Item.accountingDate).format('DD/MM/YYYY'): 'NA';
                    employerCostsAvailable[Item.Month] =  Item.employerTotalContri != undefined ? parseFloat(Item.employerTotalContri.toFixed(2)) : 0;
                    grossWageAvailable[Item.Month] = Item.grossSalary != undefined ? parseFloat(Item.grossSalary.toFixed(2)) : 0;
                    let NRPSubToTax = Item.NRPSubToTax != undefined ? Item.NRPSubToTax : 0;
                    NRPSubToTaxAvailable[Item.Month] = parseFloat(NRPSubToTax.toFixed(2));
                    let NRPNotSubToTax = Item.NRPNotSubToTax != undefined ? Item.NRPNotSubToTax : 0
                    NRPNotSubToTaxAvailable[Item.Month] = parseFloat(NRPNotSubToTax.toFixed(2));
                    let grossTax = Item.totalGross != undefined ? Item.totalGross - NRPNotSubToTax : 0;
                    grossTaxAvailable[Item.Month] = parseFloat(grossTax.toFixed(2));
                    let incomeTax = Item.incomeTax != undefined ? Item.incomeTax : 0
                    let solidaritySurcharge = Item.solidaritySurcharge != undefined ? Item.solidaritySurcharge : 0
                    let churchTaxValue = Item.churchTaxValue != undefined ? Item.churchTaxValue : 0
                    let empContriHI = Item.empContriHI != undefined ? Item.empContriHI : 0;
                    let empContriAHI = Item.additionalContributionToHI != undefined ? Item.additionalContributionToHI / 2 : 0;
                    let empContriUI = Item.empContriUI != undefined ? Item.empContriUI : 0;
                    let empContriNCISurcharge = Item.empContriNCISurcharge != undefined ? Item.empContriNCISurcharge : 0;
                    let empContriNCI = Item.empContriNCI != undefined ? Item.empContriNCI : 0;
                    let empContriRI = Item.empContriRI != undefined ? Item.empContriRI : 0;
                    let employerContriHI = Item.employerContriHI != undefined ? Item.employerContriHI : 0;
                    let employerContriAHI = Item.additionalContributionToHI != undefined ? Item.additionalContributionToHI / 2 : 0;
                    let employerContriUI = Item.employerContriUI != undefined ? Item.employerContriUI : 0;
                    let employerContriNCI = Item.employerContriNCI != undefined ? Item.employerContriNCI : 0;
                    let employerContriRI = Item.employerContriRI != undefined ? Item.employerContriRI : 0;
                    let employerLevy1Contri = Item.employerLevy1Contri != undefined ? Item.employerLevy1Contri : 0
                    let employerLevy2Contri = Item.employerLevy2Contri != undefined ? Item.employerLevy2Contri : 0
                    let employerInsolvencyContri = Item.employerInsolvencyContri != undefined ? Item.employerInsolvencyContri : 0
                    incomeTaxAvailable[Item.Month] = parseFloat(incomeTax.toFixed(2));
                    solidaritySurchargeAvailable[Item.Month] = parseFloat(solidaritySurcharge.toFixed(2));
                    churchTaxValueAvailable[Item.Month] = parseFloat(churchTaxValue.toFixed(2));
                    empContriHIAvailable[Item.Month] = parseFloat(empContriHI.toFixed(2));
                    empContriAHIAvailable[Item.Month] = parseFloat(empContriAHI.toFixed(2));
                    empContriUIAvailable[Item.Month] = parseFloat(empContriUI.toFixed(2));
                    empContriNCISurchargeAvailable[Item.Month] = parseFloat(empContriNCISurcharge.toFixed(2));
                    empContriNCIAvailable[Item.Month] = parseFloat(empContriNCI.toFixed(2));
                    empContriRIAvailable[Item.Month] = parseFloat(empContriRI.toFixed(2));
                    employerContriHIAvailable[Item.Month] = parseFloat(employerContriHI.toFixed(2));
                    employerContriAHIAvailable[Item.Month] = parseFloat(employerContriAHI.toFixed(2));
                    employerContriUIAvailable[Item.Month] = parseFloat(employerContriUI.toFixed(2));
                    employerContriNCIAvailable[Item.Month] = parseFloat(employerContriNCI.toFixed(2));
                    employerContriRIAvailable[Item.Month] = parseFloat(employerContriRI.toFixed(2));
                    employerLevy1ContriAvailable[Item.Month] = parseFloat(employerLevy1Contri.toFixed(2));
                    employerLevy2ContriAvailable[Item.Month] = parseFloat(employerLevy2Contri.toFixed(2));
                    employerInsolvencyContriAvailable[Item.Month] = parseFloat(employerInsolvencyContri.toFixed(2));

                    if (federalState <= 11 && federalState >= 1) {
                        if (grossTax != undefined && grossTax <= 7050) {
                            grossSalarySubToRIUIAvailable[Item.Month] = parseFloat(grossTax.toFixed(2));
                        } else if (grossTax != undefined && grossTax > 7050) {
                            grossSalarySubToRIUIAvailable[Item.Month] = 7050;
                        } else {
                            grossSalarySubToRIUIAvailable[Item.Month] = 0;
                        }
                    }
                    if (federalState <= 17 && federalState >= 12) {
                        if (grossTax != undefined && grossTax <= 6750) {
                            grossSalarySubToRIUIAvailable[Item.Month] = parseFloat(grossTax.toFixed(2));
                        } else if (grossTax != undefined && grossTax > 6750) {
                            grossSalarySubToRIUIAvailable[Item.Month] = 6750;
                        } else {
                            grossSalarySubToRIUIAvailable[Item.Month] = 0;
                        }
                    }

                    if (grossTax != undefined && grossTax <= 4837.50) {
                        grossSalarySubToHINCIAvailable[Item.Month] = parseFloat(grossTax.toFixed(2));
                    }
                    else if (grossTax != undefined && grossTax > 4837.50) {
                        grossSalarySubToHINCIAvailable[Item.Month] = 4837.50;
                    } else {
                        grossSalarySubToHINCIAvailable[Item.Month] = 0;
                    }

                    let totalLevys = employerLevy1Contri + employerLevy2Contri + employerInsolvencyContri;
                    let totalTotalTax = incomeTax + solidaritySurcharge + churchTaxValue;
                    let totalEmployerSocialConti = employerContriHI + employerContriAHI + employerContriUI + employerContriNCI + employerContriRI;
                    let totalSocialContiEmp = empContriHI + empContriAHI + empContriUI + empContriNCISurcharge + empContriNCI + empContriRI + totalEmployerSocialConti;
                    totalLevysAvailable[Item.Month] = parseFloat(totalLevys.toFixed(2));
                    totalTotalTaxAvailable[Item.Month] = parseFloat(totalTotalTax.toFixed(2));
                    totalEmployerSocialContiAvailable[Item.Month] = parseFloat(totalEmployerSocialConti.toFixed(2));
                    totalSocialContiEmpAvailable[Item.Month] = parseFloat(totalSocialContiEmp.toFixed(2));
                    payOutAvailable[Item.Month] = Item.payOut != undefined ? parseFloat(Item.payOut.toFixed(2)) : 0
                    
                    netSalariesAvailable[Item.Month] = Item.netSalaries != undefined ? parseFloat(Item.netSalaries.toFixed(2)) : 0


                    uniformFlatRateTaxAvailable[Item.Month] = Item.uniformFlatRateTax != undefined ? parseFloat(Item.uniformFlatRateTax.toFixed(2)) : 0


                }
            });
            let currentAccountingPeriod:any = AvailableMonthsName[0] + '-' + year + ' To ' + AvailableMonthsName[AvailableMonthsName.length - 1] + '-' + year;
            setAccountingPeriod(currentAccountingPeriod);
            createDataArray();

        }).catch((err) => {
           console.log(err.message);
       });            
    };

    let setSalViewYear=()=>{
        if (SalaryDetails.length > 0) {
            BackupSalaryDetails.sort(dynamicSort("Year"));
            salDataYears = [];
            for (let i = parseInt(BackupSalaryDetails[0].Year); i <= BackupSalaryDetails[BackupSalaryDetails.length - 1].Year; i++) {
                salDataYears.push(i.toString());
            }
            if (SalViewYear == undefined||SalViewYear == '') {

                SalViewYear = salDataYears[salDataYears.length - 1];
            }
            changeSalViewYear();

        }
    }

    async function getSalaryDetails () {
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
         await web.lists.getById('40f6d3fb-5396-45d1-86d5-dbc5e88c11c8').items.filter('HHHHStaff/Id eq '+employeeId).get().then((data) => {
            
            setSalaryDetails(data)
            setBackupSalaryDetails(data)
          
        }).catch((err) => {
            console.log(err.message);
        });
       
    }

    let createDataArray = () => {
        let OverAllemployerCosts = 0;
        let OverAllgrossWage = 0;
        let OverAllgrossTax = 0;
        let OverAllNRPSubToTax = 0;
        let OverAllNRPNotSubToTax = 0;
        let OverAllincomeTax = 0;
        let OverAllsolidaritySurcharge = 0;
        let OverAllchurchTaxValue = 0;
        let OverAllempContriHI = 0;
        let OverAllempContriAHI = 0;
        let OverAllempContriUI = 0;
        let OverAllempContriNCISurcharge = 0;
        let OverAllempContriNCI = 0;
        let OverAllempContriRI = 0;
        let OverAllemployerContriHI = 0;
        let OverAllemployerContriAHI = 0;
        let OverAllemployerContriUI = 0;
        let OverAllemployerContriNCI = 0;
        let OverAllemployerContriRI = 0;
        let OverAllemployerLevy1Contri = 0;
        let OverAllemployerLevy2Contri = 0;
        let OverAllemployerInsolvencyContri = 0;
        let OverAllgrossSalarySubToRIUI = 0;
        let OverAllgrossSalarySubToHINCI = 0;
        let OverAlltotalLevys = 0;
        let OverAlltotalTotalTax = 0;
        let OverAlltotalEmployerSocialConti = 0;
        let OverAlltotalSocialContiEmp = 0;
        let OverAllpayOut = 0;
        
        let OverAllnetSalaries = 0;


         let OverAlluniformFlatRateTax = 0;
        let overAllaccountingDate = 'NA';
        let overAllMonth = 'Overall'


            MonthsName.map((AllMonth:any)=>{
            Months.push(AllMonth.EN);
            accountingDate.push(accountingDateAvailable[AllMonth.EN] != undefined ? accountingDateAvailable[AllMonth.EN] : 'NA');

            let employerCostsOfTheMonth = employerCostsAvailable[AllMonth.EN] != undefined ? employerCostsAvailable[AllMonth.EN] : 0;
            employerCosts.push(employerCostsOfTheMonth);
            OverAllemployerCosts = OverAllemployerCosts + employerCostsOfTheMonth;

            let grossWageOfTheMonth = grossWageAvailable[AllMonth.EN] != undefined ? grossWageAvailable[AllMonth.EN] : 0;
            grossWage.push(grossWageOfTheMonth);
            OverAllgrossWage = OverAllgrossWage + grossWageOfTheMonth;

            let grossTaxOfTheMonth = grossTaxAvailable[AllMonth.EN] != undefined ? grossTaxAvailable[AllMonth.EN] : 0;
            grossTax.push(grossTaxOfTheMonth);
            OverAllgrossTax = OverAllgrossTax + grossTaxOfTheMonth;

            let NRPSubToTaxOfTheMonth = NRPSubToTaxAvailable[AllMonth.EN] != undefined ? NRPSubToTaxAvailable[AllMonth.EN] : 0;
            NRPSubToTax.push(NRPSubToTaxOfTheMonth);
            OverAllNRPSubToTax = OverAllNRPSubToTax + NRPSubToTaxOfTheMonth;

            let NRPNotSubToTaxOfTheMonth = NRPNotSubToTaxAvailable[AllMonth.EN] != undefined ? NRPNotSubToTaxAvailable[AllMonth.EN] : 0;
            NRPNotSubToTax.push(NRPNotSubToTaxOfTheMonth);
            OverAllNRPNotSubToTax = OverAllNRPNotSubToTax + NRPNotSubToTaxOfTheMonth;

            let incomeTaxOfTheMonth = incomeTaxAvailable[AllMonth.EN] != undefined ? incomeTaxAvailable[AllMonth.EN] : 0;
            incomeTax.push(incomeTaxOfTheMonth);
            OverAllincomeTax = OverAllincomeTax + incomeTaxOfTheMonth;

            let solidaritySurchargeOfTheMonth = solidaritySurchargeAvailable[AllMonth.EN] != undefined ? solidaritySurchargeAvailable[AllMonth.EN] : 0
            solidaritySurcharge.push(solidaritySurchargeOfTheMonth);
            OverAllsolidaritySurcharge = OverAllsolidaritySurcharge + solidaritySurchargeOfTheMonth;

            let churchTaxValueOfTheMonth = churchTaxValueAvailable[AllMonth.EN] != undefined ? churchTaxValueAvailable[AllMonth.EN] : 0;
            churchTaxValue.push(churchTaxValueOfTheMonth);
            OverAllchurchTaxValue = OverAllchurchTaxValue + churchTaxValueOfTheMonth;

            let empContriHIOfTheMonth = empContriHIAvailable[AllMonth.EN] != undefined ? empContriHIAvailable[AllMonth.EN] : 0
            empContriHI.push(empContriHIOfTheMonth);
            OverAllempContriHI = OverAllempContriHI + empContriHIOfTheMonth;

            let empContriAHIOfTheMonth = empContriAHIAvailable[AllMonth.EN] != undefined ? empContriAHIAvailable[AllMonth.EN] : 0
            empContriAHI.push(empContriAHIOfTheMonth);
            OverAllempContriAHI = OverAllempContriAHI + empContriAHIOfTheMonth;

            let empContriUIOfTheMonth = empContriUIAvailable[AllMonth.EN] != undefined ? empContriUIAvailable[AllMonth.EN] : 0
            empContriUI.push(empContriUIOfTheMonth);
            OverAllempContriUI = OverAllempContriUI + empContriUIOfTheMonth;

            let empContriNCISurchargeOfTheMonth = empContriNCISurchargeAvailable[AllMonth.EN] != undefined ? empContriNCISurchargeAvailable[AllMonth.EN] : 0;
            empContriNCISurcharge.push(empContriNCISurchargeOfTheMonth);
            OverAllempContriNCISurcharge = OverAllempContriNCISurcharge + empContriNCISurchargeOfTheMonth;

            let empContriNCIOfTheMonth = empContriNCIAvailable[AllMonth.EN] != undefined ? empContriNCIAvailable[AllMonth.EN] : 0
            empContriNCI.push(empContriNCIOfTheMonth);
            OverAllempContriNCI = OverAllempContriNCI + empContriNCIOfTheMonth;

            let empContriRIOfTheMonth = empContriRIAvailable[AllMonth.EN] != undefined ? empContriRIAvailable[AllMonth.EN] : 0
            empContriRI.push(empContriRIOfTheMonth);
            OverAllempContriRI = OverAllempContriRI + empContriRIOfTheMonth;

            let employerContriHIOfTheMonth = employerContriHIAvailable[AllMonth.EN] != undefined ? employerContriHIAvailable[AllMonth.EN] : 0
            employerContriHI.push(employerContriHIOfTheMonth);
            OverAllemployerContriHI = OverAllemployerContriHI + employerContriHIOfTheMonth;

            let employerContriAHIOfTheMonth = employerContriAHIAvailable[AllMonth.EN] != undefined ? employerContriAHIAvailable[AllMonth.EN] : 0
            employerContriAHI.push(employerContriAHIOfTheMonth);
            OverAllemployerContriAHI = OverAllemployerContriAHI + employerContriAHIOfTheMonth;

            let employerContriUIOfTheMonth = employerContriUIAvailable[AllMonth.EN] != undefined ? employerContriUIAvailable[AllMonth.EN] : 0
            employerContriUI.push(employerContriUIOfTheMonth);
            OverAllemployerContriUI = OverAllemployerContriUI + employerContriUIOfTheMonth;

            let employerContriNCIOfTheMonth = employerContriNCIAvailable[AllMonth.EN] != undefined ? employerContriNCIAvailable[AllMonth.EN] : 0
            employerContriNCI.push(employerContriNCIOfTheMonth);
            OverAllemployerContriNCI = OverAllemployerContriNCI + employerContriNCIOfTheMonth;

            let employerContriRIOfTheMonth = employerContriRIAvailable[AllMonth.EN] != undefined ? employerContriRIAvailable[AllMonth.EN] : 0
            employerContriRI.push(employerContriRIOfTheMonth);
            OverAllemployerContriRI = OverAllemployerContriRI + employerContriRIOfTheMonth;

            let employerLevy1ContriOfTheMonth = employerLevy1ContriAvailable[AllMonth.EN] != undefined ? employerLevy1ContriAvailable[AllMonth.EN] : 0
            employerLevy1Contri.push(employerLevy1ContriOfTheMonth);
            OverAllemployerLevy1Contri = OverAllemployerLevy1Contri + employerLevy1ContriOfTheMonth;

            let employerLevy2ContriOfTheMonth = employerLevy2ContriAvailable[AllMonth.EN] != undefined ? employerLevy2ContriAvailable[AllMonth.EN] : 0
            employerLevy2Contri.push(employerLevy2ContriOfTheMonth);
            OverAllemployerLevy2Contri = OverAllemployerLevy2Contri + employerLevy2ContriOfTheMonth;

            let employerInsolvencyContriOfTheMonth = employerInsolvencyContriAvailable[AllMonth.EN] != undefined ? employerInsolvencyContriAvailable[AllMonth.EN] : 0
            employerInsolvencyContri.push(employerInsolvencyContriOfTheMonth);
            OverAllemployerInsolvencyContri = OverAllemployerInsolvencyContri + employerInsolvencyContriOfTheMonth;

            let grossSalarySubToRIUIOfTheMonth = grossSalarySubToRIUIAvailable[AllMonth.EN] != undefined ? grossSalarySubToRIUIAvailable[AllMonth.EN] : 0
            grossSalarySubToRIUI.push(grossSalarySubToRIUIOfTheMonth);
            OverAllgrossSalarySubToRIUI = OverAllgrossSalarySubToRIUI + grossSalarySubToRIUIOfTheMonth;

            let grossSalarySubToHINCIOfTheMonth = grossSalarySubToHINCIAvailable[AllMonth.EN] != undefined ? grossSalarySubToHINCIAvailable[AllMonth.EN] : 0
            grossSalarySubToHINCI.push(grossSalarySubToHINCIOfTheMonth);
            OverAllgrossSalarySubToHINCI = OverAllgrossSalarySubToHINCI + grossSalarySubToHINCIOfTheMonth;

            let totalLevysOfTheMonth = totalLevysAvailable[AllMonth.EN] != undefined ? totalLevysAvailable[AllMonth.EN] : 0
            totalLevys.push(totalLevysOfTheMonth);
            OverAlltotalLevys = OverAlltotalLevys + totalLevysOfTheMonth;

            let totalTotalTaxOfTheMonth = totalTotalTaxAvailable[AllMonth.EN] != undefined ? totalTotalTaxAvailable[AllMonth.EN] : 0

            totalTotalTax.push(totalTotalTaxOfTheMonth);
            OverAlltotalTotalTax = OverAlltotalTotalTax + totalTotalTaxOfTheMonth;

            let totalEmployerSocialContiOfTheMonth = totalEmployerSocialContiAvailable[AllMonth.EN] != undefined ? totalEmployerSocialContiAvailable[AllMonth.EN] : 0

            totalEmployerSocialConti.push(totalEmployerSocialContiOfTheMonth);
            OverAlltotalEmployerSocialConti = OverAlltotalEmployerSocialConti + totalEmployerSocialContiOfTheMonth;

            let totalSocialContiEmpOfTheMonth = totalSocialContiEmpAvailable[AllMonth.EN] != undefined ? totalSocialContiEmpAvailable[AllMonth.EN] : 0
            totalSocialContiEmp.push(totalSocialContiEmpOfTheMonth);
            OverAlltotalSocialContiEmp = OverAlltotalSocialContiEmp + totalSocialContiEmpOfTheMonth;

            let payOutOfTheMonth = payOutAvailable[AllMonth.EN] != undefined ? payOutAvailable[AllMonth.EN] : 0
            payOut.push(payOutOfTheMonth);
            OverAllpayOut = OverAllpayOut + payOutOfTheMonth;
            
            let netSalariesOfTheMonth = netSalariesAvailable[AllMonth.EN] != undefined ? netSalariesAvailable[AllMonth.EN] : 0
            netSalaries.push(netSalariesOfTheMonth);
            OverAllnetSalaries = OverAllnetSalaries + netSalariesOfTheMonth;


               let uniformFlatRateTaxOfTheMonth = uniformFlatRateTaxAvailable[AllMonth.EN] != undefined ? uniformFlatRateTaxAvailable[AllMonth.EN] : 0
            uniformFlatRateTax.push(uniformFlatRateTaxOfTheMonth);
            OverAlluniformFlatRateTax = OverAlluniformFlatRateTax + uniformFlatRateTaxOfTheMonth;

        });

        Months.push(overAllMonth);
        accountingDate.push(overAllaccountingDate);
        NRPSubToTax.push(OverAllNRPSubToTax.toFixed(2));
        NRPNotSubToTax.push(OverAllNRPNotSubToTax.toFixed(2));
        employerCosts.push(OverAllemployerCosts.toFixed(2));
        grossWage.push(OverAllgrossWage.toFixed(2));
        grossTax.push(OverAllgrossTax.toFixed(2));
        incomeTax.push(OverAllincomeTax.toFixed(2));
        solidaritySurcharge.push(OverAllsolidaritySurcharge.toFixed(2));
        churchTaxValue.push(OverAllchurchTaxValue.toFixed(2));
        empContriHI.push(OverAllempContriHI.toFixed(2));
        empContriAHI.push(OverAllempContriAHI.toFixed(2));
        empContriUI.push(OverAllempContriUI.toFixed(2));
        empContriNCISurcharge.push(OverAllempContriNCISurcharge.toFixed(2));
        empContriNCI.push(OverAllempContriNCI.toFixed(2));
        empContriRI.push(OverAllempContriRI.toFixed(2));
        employerContriHI.push(OverAllemployerContriHI.toFixed(2));
        employerContriAHI.push(OverAllemployerContriAHI.toFixed(2));
        employerContriUI.push(OverAllemployerContriUI.toFixed(2));
        employerContriNCI.push(OverAllemployerContriNCI.toFixed(2));
        employerContriRI.push(OverAllemployerContriRI.toFixed(2));
        employerLevy1Contri.push(OverAllemployerLevy1Contri.toFixed(2));
        employerLevy2Contri.push(OverAllemployerLevy2Contri.toFixed(2));
        employerInsolvencyContri.push(OverAllemployerInsolvencyContri.toFixed(2));
        grossSalarySubToRIUI.push(OverAllgrossSalarySubToRIUI.toFixed(2));
        grossSalarySubToHINCI.push(OverAllgrossSalarySubToHINCI.toFixed(2));
        totalLevys.push(OverAlltotalLevys.toFixed(2));
        totalTotalTax.push(OverAlltotalTotalTax.toFixed(2));
        totalEmployerSocialConti.push(OverAlltotalEmployerSocialConti.toFixed(2));
        totalSocialContiEmp.push(OverAlltotalSocialContiEmp.toFixed(2));
        payOut.push(OverAllpayOut.toFixed(2));
        netSalaries.push(OverAllnetSalaries.toFixed(2));
         uniformFlatRateTax.push(OverAlluniformFlatRateTax.toFixed(2));


        //  setAvailableMonthsName()
         setMonths(Months)
         setaccountingDate(accountingDate)
         setemployerCosts(employerCosts)
         setgrossWage(grossWage)
         setgrossTax(grossTax)
         setNRPSubToTax(NRPSubToTax)
         setNRPNotSubToTax(NRPNotSubToTax)
         setincomeTax(incomeTax)
         setsolidaritySurcharge(solidaritySurcharge)
         setchurchTaxValue(churchTaxValue)
         setempContriHI(empContriHI)
         setempContriAHI(empContriAHI)
         setempContriUI(empContriUI)
         setempContriNCISurcharge(empContriNCISurcharge)
         setempContriNCI(empContriNCI)
         setempContriRI(empContriRI)
         setemployerContriHI(employerContriHI)
         setemployerContriAHI(employerContriAHI)
         setemployerContriUI(employerContriUI)
         setemployerContriNCI(employerContriNCI)
         setemployerContriRI(employerContriRI)
         setemployerLevy1Contri(employerLevy1Contri)
         setemployerLevy2Contri(employerLevy2Contri)
         setemployerInsolvencyContri(employerInsolvencyContri)
         setgrossSalarySubToRIUI(grossSalarySubToRIUI)
         setgrossSalarySubToHINCI(grossSalarySubToHINCI)
         settotalEmployerSocialConti(totalEmployerSocialConti)
         settotalLevys(totalLevys)
         settotalTotalTax(totalTotalTax)
         settotalSocialContiEmp(totalSocialContiEmp)
         setpayOut(payOut)
         setnetSalaries(netSalaries)
         setuniformFlatRateTax(uniformFlatRateTax)

    }

    return (
        
        <div>
            <div>
                {console.log(EmployeeDetails)}
                {console.log(AccountingPeriod)}
                {console.log(FinaluniformFlatRateTax)}
                {console.log(showUFRT)}
                {console.log(SalaryDetails)}
                {console.log(AllSalaryRecords)}


                <div className="Contact_Info pad0 underline-border">
                    <div className='yearSlect'>
                        {/* <select id="SalViewYear">
                            <option value="none" disabled>Select Year</option>
                            <option value="2022" >2022</option>
                        </select> */}
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

                    {EmployeeDetails &&
                        <div>
                    <table className="table payRoll-TopTable">
                        <tbody><tr>
                            <td className="padL-0">
                                <table className="table payRoll-TopTable">
                                    <tbody><tr className="TableColor">
                                        <td className="TableTdSize" ng-bind-html="GetColumnDetails('accountingPeriod')" >Accounting period</td>
                                        <td className="TableTdSize" >{AccountingPeriod}</td>

                                    </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('NAME')" >Name</td>
                                            <td className="TableTdSize" >{EmployeeDetails.FullName}</td>
                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('address')" >Address</td>
                                            <td className="TableTdSize" >{EmployeeDetails.WorkAddress+' '+EmployeeDetails.WorkZip+' '+EmployeeDetails.WorkCity}</td>

                                        </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('Fedral_State')" >Federal State</td>
                                            <td className="TableTdSize" >{EmployeeDetails.federalState}</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('dateOfBirth')" >Date of Birth</td>
                                            <td className="TableTdSize" >{EmployeeDetails.displayDateOfBirth}</td>

                                        </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('StaffID')" >Staff-ID</td>

                                            <td className="TableTdSize" >{EmployeeDetails.StaffID}</td>
                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('entryDate')" >Entry Date</td>

                                            <td className="TableTdSize" >{EmployeeDetails.entryDate}</td>
                                        </tr>
                                    </tbody></table>
                            </td>

                            <td>
                                <table className="table ">
                                    <tbody><tr className="TableColor">
                                        <td className="TableTdSize" ng-bind-html="GetColumnDetails('healthInsurance')" >Health insurance</td>
                                        <td className="TableTdSize" >{EmployeeDetails.healthInsuranceCompany}</td>
                                    </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('ContriRateHI')" >Contribution rate HI</td>
                                            <td className="TableTdSize" >{(EmployeeDetails.ContriRateHi?EmployeeDetails.ContriRateHi:0 )+'%'}</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('additionalContribution')" >Additional contribution HI</td>
                                            <td className="TableTdSize" >{(EmployeeDetails.additionalContributionToHI?EmployeeDetails.additionalContributionToHI:0 )+'%'}</td>

                                        </tr>
                                        <tr>
                                            <td ng-bind-html="GetColumnDetails('ContributionGroupKey')" >Contribution group key</td>
                                            <td >{EmployeeDetails.ContributionGroupKey}</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td ng-bind-html="GetColumnDetails('PersonGroupKey')" >Group</td>
                                            <td >{EmployeeDetails.PersonGroupKey}</td>
                                        </tr>
                                        <tr>
                                            <td ng-bind-html="GetColumnDetails('contributionStatus')" >Contribution status</td>
                                            <td ng-bind="GetColumnDetails(AllEmployeeDetails.contributionStatus)" >{EmployeeDetails.contributionStatus}</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td ng-bind-html="GetColumnDetails('socialSecurityNo')" >Social Security No.</td>
                                            <td >{EmployeeDetails.insuranceNo}</td>

                                        </tr>
                                    </tbody></table>
                            </td>

                            <td className="padR-0">
                                <table className="table">
                                    <tbody><tr className="TableColor">
                                        <td className="TableTdSize" ng-bind-html="GetColumnDetails('NCISurcharge')" >PV surcharge</td>
                                        <td className="TableTdSize" ng-bind="GetColumnDetails(isNCISurcharge)" >{EmployeeDetails.isNCISurcharge}</td>
                                    </tr>
                                        <tr>
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('taxId')" >Tax-ID</td>
                                            <td className="TableTdSize" >{EmployeeDetails.taxNo}</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td className="TableTdSize" ng-bind-html="GetColumnDetails('taxclassName')" >Tax className</td>
                                            <td className="TableTdSize" >{EmployeeDetails.taxClass}</td>

                                        </tr>
                                        <tr>
                                            <td ng-bind-html="GetColumnDetails('monthlyAllowance')" >Monthly tax allowance</td>
                                            <td >{EmployeeDetails.monthlyTaxAllowance?EmployeeDetails.monthlyTaxAllowance:0+'EUR'}</td>

                                        </tr>
                                        <tr className="TableColor">
                                            <td ng-bind-html="GetColumnDetails('churchTax')" >Church tax</td>
                                            <td >{EmployeeDetails.churchTax?EmployeeDetails.churchTax:0}</td>

                                        </tr>
                                        <tr>
                                            <td ng-bind-html="GetColumnDetails('childAllowances')" >Child allowance</td>
                                            <td >{EmployeeDetails.childAllowance?EmployeeDetails.childAllowance:0}</td>

                                        </tr>
                                    </tbody></table>
                            </td>
                        </tr>
                        </tbody></table>
                        </div>
}
                    <table className="payRollTable table mt-10">
                        <thead>
                            <tr>
                                <td>&nbsp;</td>
                                {
                                    FinalMonths.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('accountingDate')">Accounting date</td>
                                 {
                                    FinalaccountingDate.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }

                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerCosts')">Employer costs</td>
                                 {
                                    FinalemployerCosts.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('grossWage')">Gross wage</td>
                                 {
                                    FinalgrossWage.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('grossTaxAmount')">Gross tax amount</td>
                                 {
                                    FinalgrossTax.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('NRPSubToTax')">Non Recurring Payments (subject to tax & social security)</td>
                                 {
                                    FinalNRPSubToTax.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('NRPNotSubToTax')">Non Recurring Payments (not subject to tax & social security)</td>
                                 {
                                    FinalNRPNotSubToTax.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr className="">
                                <td ng-bind-html="GetColumnDetails('netSalaries')">Net withdrawals/ Net renumeration</td>
                                 {
                                    FinalnetSalaries.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>

                            <tr className="table-label bdr-top">
                                <td ng-bind-html="GetColumnDetails('taxes')">Taxes</td>
                                <td colSpan={13}>&nbsp;</td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('incomeTax')">Income tax</td>
                                 {
                                    FinalincomeTax.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('solidaritySurcharge')">Solidarity surcharge</td>
                                 {
                                    FinalsolidaritySurcharge.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('churchTaxValue')">Church Tax</td>
                                 {
                                    FinalchurchTaxValue.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                        {/* <tr ng-if="showUFRT">
                                <td ng-bind-html="GetColumnDetails('uniformFlatRateTax')"></td>
                                <td ng-repeat="item in uniformFlatRateTax track by $index"></td>
                            </tr> */}
                            <tr className="table-label bdr-top">
                                <td ng-bind-html="GetColumnDetails('employerShareOfSocialContributions')">Employee share of social contributions</td>
                                <td colSpan={13}>&nbsp;</td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriHI')">Health insurance employee</td>
                                 {
                                    FinalempContriHI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriAHI')">Health Insurance Additional contribution</td>
                                 {
                                    FinalempContriAHI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriRI')">Retirement insurance employee</td>
                                 {
                                    FinalempContriRI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriUI')">Unemployement insurance employee</td>
                                 {
                                    FinalempContriUI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('empContriNCI')">Nursing care insurance employee</td>
                                 {
                                    FinalempContriNCI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr className="">
                                <td ng-bind-html="GetColumnDetails('empContriNCISurcharge')">Nursing care insurance surcharge</td>
                                 {
                                    FinalempContriNCISurcharge.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>

                            <tr className="table-label bdr-top">
                                <td ng-bind-html="GetColumnDetails('employersSocialContributions')">Employer's social contributions</td>
                                <td colSpan={13}>&nbsp;</td>
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriHI')">Health insurance employer</td>
                                 {
                                    FinalemployerContriHI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriAHI')">Health Insurance Additional Contribution</td>
                                 {
                                    FinalemployerContriAHI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriRI')">Retirement insurance employer</td>
                                 {
                                    FinalemployerContriRI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriUI')">Unemployement insurance employer</td>
                                 {
                                    FinalemployerContriUI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerContriNCI')">Nursing care insurance employer</td>
                                 {
                                    FinalemployerContriNCI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerLevy1Contri')">Levy 1</td>
                                 {
                                    FinalemployerLevy1Contri.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('employerLevy2Contri')">Levy 2</td>
                                 {
                                    FinalemployerLevy2Contri.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr className="bdr-top">
                                <td ng-bind-html="GetColumnDetails('employerInsolvencyContri')">Insolvency contribution</td>
                                {
                                    FinalemployerInsolvencyContri.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('grossSalarySubToRIUI')">Gross salary subject to pension and unemployment insurance</td>
                                 {
                                    FinalgrossSalarySubToRIUI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }

                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('grossSalarySubToHINCI')">Gross salary subject to health and nursing care insurance</td>
                                 {
                                    FinalgrossSalarySubToHINCI.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('totalEmployerSocialConti')">Total employer contribution</td>
                                 {
                                    FinaltotalEmployerSocialConti.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('totalLevys')">Total levys</td>
                                 {
                                    FinaltotalLevys.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('totalTotalTax')">Total tax</td>
                                 {
                                    FinaltotalTotalTax.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td ng-bind-html="GetColumnDetails('totalSocialContiEmp')">Total social security contributions</td>
                                 {
                                    FinaltotalSocialContiEmp.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
                            </tr>
                            <tr className="bdr-bottom">
                                <td ng-bind-html="GetColumnDetails('payOut')">Payment amount</td>
                                 {
                                    FinalpayOut.map((item:any)=>{
                                       return <td >{item}</td>
                                    })
                                }
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