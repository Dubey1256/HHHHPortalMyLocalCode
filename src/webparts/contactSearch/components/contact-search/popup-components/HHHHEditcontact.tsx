import * as React from 'react';
import OrgContactEditPopup from './orgContactEditPopup';
import CountryContactEditPopup from './CountryContactEditPopup';
import { useState, useEffect, useCallback } from 'react';
import pnp, { Web } from 'sp-pnp-js';
import { GoRepoPush } from 'react-icons/go';

import moment, * as Moment from "moment";
import Tooltip from '../../../../../globalComponents/Tooltip';
import { Panel, PanelType } from 'office-ui-fabric-react';
import ImagesC from '../../../../EditPopupFiles/ImageInformation';
import { Site } from '@pnp/sp/sites';
import { myContextValue } from '../../../../../globalComponents/globalCommon'
let HrGmbhEmployeData:any=[]
let JointData:any=[];
const HHHHEditComponent = (props: any) => {
    const myContextData2: any = React.useContext<any>(myContextValue)
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [HrTagData, setHrTagData] = useState([]);
    const [imagetab, setImagetab] = React.useState(false);
    const [status, setStatus] = useState({
        orgPopup: false,
        countryPopup: false,
        statePopup: false
    });
    const [siteTaggedHR, setSiteTaggedHR] = useState(false);
    const [siteTaggedSMALSUS, setSiteTaggedSMALSUS] = useState(false);
 
    const [updateData, setUpdateData]:any = useState({});
    const [HrUpdateData, setHrUpdateData] = useState({
        Nationality: "", placeOfBirth: '', BIC: '', IBAN: '', taxNo: '', monthlyTaxAllowance: 0, insuranceNo: "", highestSchoolDiploma: '', highestVocationalEducation: '', otherQualifications: '', Country: '', Fedral_State: '', childAllowance: '', churchTax: '', healthInsuranceType: '', healthInsuranceCompany: '', maritalStatus: '', taxClass: '', SmartContactId: '', SmartLanguagesId: '', SmartStateId: '', dateOfBirth: '', Parenthood: '',
    })
    // const [instituteStatus, setInstituteStatus] = useState(false);
   
    const [URLs, setURLs] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState();
    const [selectedState, setSelectedState] = useState({
        Title: ''
    });
  
    const [currentCountry, setCurrentCountry] :any= useState([])
  
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
  
    useEffect(() => {
        getSmartMetaData();
        if(myContextData2.allSite?.MainSite){
            getUserData(props.props.Id);
         
        }else{
           
            HrGmbhEmployeDeatails(props?.props?.Id);
        }
        pnp.sp.web.currentUser.get().then((result: any) => {
            let CurrentUserId = result.Id;
            console.log(CurrentUserId)
        });
    }, [])
    const getUserData = async (Id: any) => {
        try {
            let web = new Web(myContextData2?.allListId?.siteUrl);
             await web.lists.getById(myContextData2?.allListId?.HHHHContactListId)
                .items.getById(Id).select("Id, Title, FirstName, FullName, Department,DOJ,DOE, Company, WorkCity, Suffix, WorkPhone, HomePhone, Comments, WorkAddress, WorkFax, WorkZip, Site, ItemType, JobTitle, Item_x0020_Cover, WebPage, Site, CellPhone, Email, LinkedIn, Created, SocialMediaUrls, SmartCountries/Title, SmartCountries/Id, Author/Title, Modified, Editor/Title, Division/Title, Division/Id, EmployeeID/Title, StaffID, EmployeeID/Id, Institution/Id, Institution/FullName, IM")
                .expand("EmployeeID, Division, Author, Editor, SmartCountries, Institution").get().then((data:any)=>{
                    let URL: any[] = JSON.parse(data.SocialMediaUrls != null ? data.SocialMediaUrls : ["{}"]);
                    setURLs(URL);
                    // if (data.Institution != null) {
                    //     setCurrentInstitute(data.Institution);
                    // }
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
                    if (SitesTagged.search("HR") >= 0 && myContextData2.loggedInUserName == data.Email) {
                        HrTagInformation(Id);
                        setSiteTaggedHR(true);
                    }
                    if (SitesTagged.search("SMALSUS") >= 0 && myContextData2.loggedInUserName == data.Email) {
                        HrTagInformation(Id);
                        setSiteTaggedSMALSUS(true);
                    }
                    data.Item_x002d_Image = data?.Item_x0020_Cover;
                    setUpdateData(data);  
                }).catch((error:any)=>{
                    console.log(error)
                })

            

        } catch (error) {
            console.log("Error:", error.message);
        }

    }
    const HrGmbhEmployeDeatails=async(Id:any)=>{
    
        try {
            let web = new Web(myContextData2?.allListId?.siteUrl);
            await web.lists.getById(myContextData2?.allSite?.GMBHSite?myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID:myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID)
                .items.getById(Id)
                .select("Id", "Title", "FirstName", "FullName", "DOJ","DOE","Company","SmartCountriesId","SmartContactId","SmartInstitutionId", "WorkCity", "Suffix", "WorkPhone", "HomePhone", "Comments", "WorkAddress", "WorkFax", "WorkZip",  "ItemType", "JobTitle", "Item_x0020_Cover", "WebPage",  "CellPhone", "Email", "LinkedIn", "Created", "SocialMediaUrls","Author/Title", "Modified", "Editor/Title", "Division/Title", "Division/Id", "EmployeeID/Title", "StaffID", "EmployeeID/Id", "Institution/Id", "Institution/FullName", "IM")
                .expand("EmployeeID", "Division", "Author", "Editor",  "Institution")
                .get().then((data:any)=>{
                    
                    HrGmbhEmployeData=data;
                    let URL: any[] = JSON.parse(data.SocialMediaUrls != null ? data.SocialMediaUrls : ["{}"]);
                    setURLs(URL);
                    // if (data?.Institution != null && data?.Institution!=undefined) {
                    //    setCurrentInstitute(data?.Institution);
                    // }
                    data.Item_x002d_Image = data?.Item_x0020_Cover;
                   
                    if(data?.SmartContactId!=undefined){
                        JointDetails(data)
                    }else{
                        setUpdateData(data)
                    }
                
                    
                }).catch((error:any)=>{
                    console.log(error)
                });
          
           
           
        } catch (error) {
            console.log("Error:", error.message);
        }  
    }
    const JointDetails = async (siteData:any) => {
        try {
            let web = new Web(myContextData2?.allListId?.jointSiteUrl);
           await web.lists.getById(myContextData2?.allListId?.HHHHContactListId)
                .items.getById(siteData?.SmartContactId)
                .select("Id", "Title", "FirstName", "FullName", "Department", "Company", "WorkCity", "Suffix", "WorkPhone", "HomePhone", "Comments", "WorkAddress", "WorkFax", "WorkZip", "Site", "ItemType", "JobTitle", "Item_x0020_Cover", "WebPage", "Site", "CellPhone", "Email", "LinkedIn", "Created", "SocialMediaUrls", "SmartCountries/Title", "SmartCountries/Id", "Author/Title", "Modified", "Editor/Title", "Division/Title", "Division/Id", "EmployeeID/Title", "StaffID", "EmployeeID/Id", "Institution/Id", "Institution/FullName", "IM")
                .expand("EmployeeID", "Division", "Author", "Editor", "SmartCountries", "Institution")
              .get().then((data:any)=>{
                // data.map((Item: any) => {
                    data.SitesTagged = ''
                    if (data.Site != null) {
                        if (data.Site.length >= 0) {
                            data.Site?.map((site: any, index: any) => {
                                if (index == 0) {
                                    data.SitesTagged = site;
                                } else if (index > 0) {
                                    data.SitesTagged = data.SitesTagged + ', ' + site;
                                }
                            })
                        }
                    }
                // })
                
                siteData.Site=data.Site
                setUpdateData(siteData)
                JointData=data;
              });
          
        } catch (error) {
            console.log("Error:", error.message);
        }
    }

    const getSmartMetaData = async () => {
        try {
            let web = new Web(myContextData2?.allListId?.jointSiteUrl);
            let data = await web.lists.getById(myContextData2?.allListId?.MAIN_SMARTMETADATA_LISTID)
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
 //*****************Save for Joint,GMBH,HR Data Update***************************************** */
    const UpdateDetails = async () => {
        let urlData: any;
        if(updateData?.WebPage!=undefined){
            let spliceString = updateData?.WebPage.slice(0, 8)
            if (spliceString == "https://") {
                urlData = updateData?.WebPage;
            } else {
                urlData = "https://" + updateData?.WebPage;
            }
        }
       let SocialUrls: any = {};
        SocialUrls["LinkedIn"] = (updateData?.LinkedIn ? updateData?.LinkedIn : (URLs.length ? URLs[0].LinkedIn : null));
        SocialUrls["Facebook"] = (updateData?.Facebook ? updateData?.Facebook : (URLs.length ? URLs[0].Facebook : null));
        SocialUrls["Twitter"] = (updateData?.Twitter ? updateData?.Twitter : (URLs.length ? URLs[0].Twitter : null));
        SocialUrls["Instagram"] = (updateData?.Instagram ? updateData?.Instagram : (URLs.length ? URLs[0].Instagram : null));
        let UrlData: any[] = [];
        UrlData.push(SocialUrls);
        try {

           let postData:any= {
                Title: (updateData?.Title ),
                FirstName: (updateData?.FirstName ),
                Suffix: (updateData?.Suffix ),
                JobTitle: (updateData?.JobTitle ),
                FullName: (updateData?.FirstName ) + " " + (updateData?.Title ),
                InstitutionId: (updateData?.Institution!=undefined? updateData?.Institution?.Id :null),
                Email: (updateData?.Email ),
                Department: (updateData?.Department ),
                WorkPhone: (updateData?.WorkPhone ),
                CellPhone: (updateData?.CellPhone ),
                HomePhone: (updateData?.HomePhone ),
                WorkCity: (updateData?.WorkCity),
                WorkAddress: (updateData?.WorkAddress),
                DOJ:updateData?.DOJ!=undefined?new Date(updateData?.DOJ).toISOString():null,
                DOE:updateData?.DOE!=undefined?new Date(updateData?.DOE).toISOString():null,
                WebPage: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: "Description",
                    Url: updateData?.WebPage ? urlData : (updateData?.WebPage ? updateData?.WebPage.Url : null)
                },
                Item_x0020_Cover:{
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: "Description",
                    Url: updateData?.Item_x002d_Image!=undefined ? updateData?.Item_x002d_Image?.Url : (updateData?.Item_x0020_Cover!=undefined?updateData?.Item_x0020_Cover?.Url:null)
                },
                WorkZip: (updateData?.WorkZip ),
                IM: (updateData?.Skype ),
                SocialMediaUrls: JSON.stringify(UrlData),
                SmartCountriesId: {
                    results:updateData?.SmartCountries.length>0!=undefined?[updateData?.SmartCountries?.Id ]: []
                }
            }
            if (updateData?.Id != undefined) {
                let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                await web.lists.getById(myContextData2?.allListId?.HHHHContactListId).items.getById(myContextData2?.allSite?.GMBHSite||myContextData2?.allSite?.HrSite?JointData?.Id:updateData?.Id).update(postData).then((e) => {
                    console.log("Your information has been updated successfully");
               if(props?.allSite?.GMBHSite){
                UpdateGmbhDetails();
               
               }else{
                callBack();
               }
              });
             
            }
           } catch (error) {
            console.log("Error:", error.message);
        }
        if (updateData?.Site?.toString().search("HR") >= 0) {
            updateHrDetails();
            callBack();
        }

       

    }

 //********************End Save for Joint,GMBH,HR Data Update ************************************ */



    // ************************Update GMBH fUNCTION ***********************

   const UpdateGmbhDetails= async()=>{


        let updateGmbhData:any={
            Title: (updateData.Title ),
            FirstName: (updateData.FirstName),
            FullName: (updateData.FullName ),
            Suffix: (updateData.Suffix ),
            JobTitle: (updateData.JobTitle ),
            Email: (updateData.Email ),
            WorkPhone: (updateData.WorkPhone ),
            CellPhone: (updateData.CellPhone ),
            HomePhone: (updateData.HomePhone ),
            WorkCity: (updateData.WorkCity ),
            WorkAddress: (updateData.WorkAddress ),
            WorkZip: (updateData.WorkZip ),
            IM: (updateData.IM ),
           
        }
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/GmBH');
      await web.lists.getById('6CE99A82-F577-4467-9CDA-613FADA2296F').items.getById(updateData.Id).update(updateGmbhData).then((e:any) => {
       console.log("request success", e);
       callBack();
       }).catch((error:any)=>{
        console.log(error)
       })
        

    }

  // ************************End Update GMBH fUNCTION ***********************


   //*************************UpdateHr Deatils   Function ***************************** */
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
 //************************* End UpdateHr Deatils   Function ***************************** */


    //*******************Delete function***************************  */
    const deleteUserDtl = async () => {
        try {
            if (confirm("Are you sure, you want to delete this?")) {
                 if(myContextData2?.allSite?.MainSite){
                    let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                    await web.lists.getById(myContextData2?.allListId?.HHHHContactListId).items.getById(myContextData2?.allSite?.GMBHSite||myContextData2?.allSite?.HrSite?JointData?.Id:updateData?.Id).recycle().then(async(data:any)=>{
                        if(props?.allSite?.GMBHSite||props?.allSite?.HrSite){
                            let web = new Web(props?.allListId?.siteUrl);
                            await web.lists.getById(props?.allSite?.GMBHSite ? props?.allListId?.GMBH_CONTACT_SEARCH_LISTID : props?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.getById(updateData.Id).recycle(); 
                         }
                    }).catch(async(error:any)=>{
                        console.log(error)
                       
                    });
                 }
                
                if(myContextData2?.allSite?.GMBHSite||myContextData2?.allSite?.HrSite){
                    let web = new Web(myContextData2?.allListId?.siteUrl);
                    await web.lists.getById(myContextData2?.allSite?.GMBHSite ? myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID : myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.getById(updateData.Id).recycle(); 
                 }
             
            
            //  props.userUpdateFunction();
            callBack();
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }

    //****************End Delete Function****************** */


    //****************************Open organation popup & Country popup All callback and openPOPUP handle */
    const openOrg = () => {
        setStatus({
            ...status, orgPopup: true,
            countryPopup: false,
            statePopup: false
        })
       
    }
    const openCountry = (item: any) => {
        setStatus({
            ...status, orgPopup: false,
            countryPopup: true,
            statePopup: false
        })
    }
    const CloseOrgPopup = useCallback((data:any) => {
        setStatus({ ...status, orgPopup: false })
        if(data!=undefined){
            setUpdateData(data);
        }
       
    }, []);
    const CloseCountryPopup = useCallback((data:any) => {
        setStatus({ ...status, countryPopup: false })
        // setCountryPopup(false);
        if(data!=undefined){
            setUpdateData(data);
        }
    }, []);
 
//     const selectedCountryStatus = useCallback((item: any) => {
//           setCurrentCountry(item);
//      let backupdata=JSON.parse(JSON.stringify(updateData));
//         // setInstituteStatus(true);
//        backupdata={
//           ...backupdata,...{
//         SmartCountriesId: item[0].Id,
          
//        }
//    } 
//    setUpdateData(backupdata);
       

//     }, [])
 //****************************  End Open organation popup & Country popup All callback and openPOPUP handle */


 //**********Hr smalsus functionality popup */
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

    //****************End Hr sMALSUS POPUP FUNCTIONALITY */
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                    <img className='workmember' src={updateData?.Item_x0020_Cover != undefined ? updateData?.Item_x0020_Cover.Url : "NA"} />Edit Contact - {updateData?.FullName}
                </div>
                <Tooltip ComponentId='3299' />
            </>
        );
    };

    //***************image information call back Function***********************************/
    function imageta() {
        setImagetab(true);
      }
    const imageTabCallBack = React.useCallback((data: any) => {
        
        // setUpdateData(data);
        console.log(updateData);
        console.log(data);
        // setEditdocumentsData(data);
    }, []);

    // *****************End image call back function**********************************
    return (
        <>
            <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
                isOpen={true}
                type={PanelType.custom}
                customWidth="1280px"
                onDismiss={callBack}
                isBlocking={false}
            >
                <div>
                    <div className="modal-body mb-5">
                        <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                           

                            <button className="nav-link active"
                                id="BASIC-INFORMATION"
                                data-bs-toggle="tab"
                                data-bs-target="#BASICINFORMATION"
                                type="button"
                                role="tab"
                                aria-controls="BASICINFORMATION"
                                aria-selected="true">BASIC INFORMATION</button>
                            <button className="nav-link"
                                id="IMAGE-INFORMATION"
                                data-bs-toggle="tab"
                                data-bs-target="#IMAGEINFORMATION"
                                type="button"
                                role="tab"
                                aria-controls="IMAGEINFORMATION"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    imageta()
                                  }}
                                aria-selected="true">IMAGE INFORMATION</button>
                            {siteTaggedHR &&
                            <button className="nav-link" id="HR"
                                data-bs-toggle="tab"
                                data-bs-target="#HR"
                                type="button"
                                role="tab"
                                aria-controls="HR"
                                aria-selected="true">HR</button>}
                            {siteTaggedSMALSUS&&<button className="nav-link" id="SMALSUS"
                                data-bs-toggle="tab"
                                data-bs-target="#SMALSUS"
                                type="button"
                                role="tab"
                                aria-controls="SMALSUS"
                                aria-selected="true">SMALSUS</button>}
 
                        </ul>

                       
                        <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                            <div className="tab-pane show active" id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">
                                <div className='general-section'>
                                    <div className="card">
                                        <div className="card-header">
                                            General
                                        </div>
                                        <div className="card-body">
                                            <div className="user-form-5">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className='full-width label-form'>First Name </label>
                                                        <input type="text" className="form-control" defaultValue={updateData ? updateData?.FirstName : null} onChange={(e) => setUpdateData({ ...updateData, FirstName: e.target.value })} aria-label="First name" placeholder='First Name' />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form"> Last Name</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.Title} onChange={(e) => setUpdateData({ ...updateData, Title: e.target.value })} aria-label="Last name" placeholder='Last name' />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form"> Suffix</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.Suffix} onChange={(e) => setUpdateData({ ...updateData, Suffix: e.target.value })} aria-label="Suffix" placeholder='Suffix' />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form"> Job Title</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.JobTitle} onChange={(e) => setUpdateData({ ...updateData, JobTitle: e.target.value })} aria-label="JobTitle" placeholder='Job-Title' />

                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Site</label>
                                                        <div className='alignCenter'>
                                                            <label className='SpfxCheckRadio'>
                                                                <input className="me-1 form-check-input" type="checkbox" value="" checked={updateData?.Site?.toString().search("HR") >= 0} />
                                                                HR </label>
                                                            <label className='SpfxCheckRadio'>
                                                                <input className="me-1 form-check-input" type="checkbox" checked={updateData?.Site?.toString().search("GMBH") >= 0} />
                                                                GMBH </label>
                                                            <label className='SpfxCheckRadio'>
                                                                <input className="me-1 form-check-input" type="checkbox" checked={updateData?.Site?.toString().search("SMALSUS") >= 0} />
                                                                SMALSUS </label>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="user-form-4 mt-2">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Organization</label>
                                                        {updateData?.Institution?.FullName ?
                                                            <div className="block wid90 alignCenter">
                                                                <a className="hreflink" target="_blank"> {updateData?.Institution?.FullName}</a>
                                                                <span className="bg-light svg__icon--cross svg__iconbox hreflink ml-auto"></span>
                                                            </div> :<input type='text'/>
                                                          
                                                        }
                                                       
                                                        <span className="input-group-text" title="Select Organisation">
                                                            <span onClick={() => openOrg()} className="svg__iconbox svg__icon--editBox"></span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Division</label>
                                                        <select className="form-control">
                                                            <option selected>Select Division</option>
                                                            <option>SDE-01</option>
                                                            <option>SDE-02</option>
                                                            <option>SDE-03</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col pad0">
                                                    <label className="full_width form-label"> D.O.J</label>
                                                    <div> <input type="date" value={moment(updateData?.DOJ).format('YYYY-MM-DD') } onChange={(e)=>setUpdateData({...updateData,DOJ:moment(e.target.value).format('YYYY-MM-DD') })} /></div>
                                                </div>
                                                <div className="col pad0">
                                                    <label className="full_width form-label"> D.O.E</label>
                                                    <div><input type='date' value={moment(updateData?.DOE).format('YYYY-MM-DD') } onChange={(e)=>setUpdateData({...updateData,DOE:moment(e.target.value).format('YYYY-MM-DD') })} /></div>
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
                                            <div className="user-form-4">
                                                <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">LinkedIn</label>
                                                        <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].LinkedIn : ""} aria-label="LinkedIn"
                                                            onChange={(e) => setUpdateData({ ...updateData, LinkedIn: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Twitter</label>
                                                        <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].Twitter : ""}
                                                            onChange={(e) => setUpdateData({ ...updateData, Twitter: e.target.value })} aria-label="LinkedIn" />
                                                    </div>
                                                </div>
                                                <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Facebook</label>
                                                        <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].Facebook : ""} onChange={(e) => setUpdateData({ ...updateData, Facebook: e.target.value })} aria-label="LinkedIn" />
                                                    </div></div>
                                                <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Instagram</label>
                                                        <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].Instagram : ''}
                                                            onChange={(e) => setUpdateData({ ...updateData, Instagram: e.target.value })} aria-label="LinkedIn" />
                                                    </div></div>
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
                                            <div className="user-form-5">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Business Phone</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.WorkPhone ? updateData?.WorkPhone : ''} onChange={(e) => setUpdateData({ ...updateData, WorkPhone: e.target.value })} aria-label="Business Phone" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Mobile-No</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.CellPhone ? updateData?.CellPhone : ''} onChange={(e) => setUpdateData({ ...updateData, CellPhone: e.target.value })} aria-label="Mobile-No" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Home-Phone</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.HomePhone ? updateData?.HomePhone : ''} onChange={(e) => setUpdateData({ ...updateData, HomePhone: e.target.value })} aria-label="Home-Phone" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">City</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.WorkCity ? updateData?.WorkCity : ''} onChange={(e) => setUpdateData({ ...updateData, WorkCity: e.target.value })} aria-label="City" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Address</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.WorkAddress ? updateData?.WorkAddress : ''} onChange={(e) => setUpdateData({ ...updateData, WorkAddress: e.target.value })} aria-label="Address" />
                                                    </div></div>
                                            </div>
                                            <div className="user-form-5 mt-2">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Skpye</label>
                                                        <input type="text" className="form-control" placeholder="Skpye" defaultValue={updateData?.IM ? updateData?.IM : ""}
                                                            onChange={(e) => setUpdateData({ ...updateData, Skype: e.target.value })} aria-label="Skpye" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Email</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.Email ? updateData?.Email : ""}
                                                            onChange={(e) => setUpdateData({ ...updateData, Email: e.target.value })} aria-label="Email" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">WebPage</label>

                                                        <input className="form-control" type="text" defaultValue={updateData?.WebPage ? updateData?.WebPage.Url : ""} onChange={(e) => setUpdateData({ ...updateData, WebPage: e.target.value })} aria-label="WebPage" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Zip Code</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.WorkZip ? updateData?.WorkZip : ""} onChange={(e) => setUpdateData({ ...updateData, WorkZip: e.target.value })} aria-label="Zip Code" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Country</label>
                                                            
                                                           {updateData?.SmartCountries?.length>0?<div className="block wid90 alignCenter">
                                                                <a className="hreflink" target="_blank">{updateData?.SmartCountries?.[0]?.Title}</a>
                                                                <span
                                                                //  onClick={() => removeSmartCountry(item.Id)}
                                                                    className="bg-light ml-auto svg__icon--cross svg__iconbox"></span>
                                                            </div>:<input type='text'></input>} 
                                                            
                                                            <span className="input-group-text" title="Smart Category Popup">
                                                                <span onClick={() => openCountry(updateData?.SmartCountries)}className="svg__iconbox svg__icon--editBox"></span>
                                                            </span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="IMAGEINFORMATION" role="tabpanel" aria-labelledby="IMAGEINFORMATION">
                                <div className="row col-sm-12">
                                {imagetab && (
                      <ImagesC
                        EditdocumentsData={updateData}
                        setData={setUpdateData}
                        AllListId={myContextData2?.allListId}
                        Context={myContextData2?.allListId?.Context}
                        callBack={imageTabCallBack}
                      />
                    )}
                                    </div>
                            </div>
                            <div className="tab-pane" id="HR" role="tabpanel" aria-labelledby="HR">
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
                                                                <label className="full-width label-form">Federal state </label>
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
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Nationality</label>
                                                                    <input type="text" className="form-control" defaultValue={item.Nationality ? item.Nationality : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, Nationality: e.target.value })} placeholder='Enter Nationality' />
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Date of Birth</label>
                                                                    <input type="date" className="form-control"
                                                                        defaultValue={item.dateOfBirth ? Moment(item.dateOfBirth).format("YYYY-MM-DD") : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, dateOfBirth: Moment(e.target.value).format("YYYY-MM-DD") })} />
                                                                </div></div>
                                                        </div>
                                                        <div className='user-form-3'>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Place of birth</label>
                                                                    <input type="text" className="form-control" defaultValue={item.placeOfBirth} onChange={(e) => setHrUpdateData({ ...HrUpdateData, placeOfBirth: e.target.value })} placeholder='Enter Place of birth' />
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Marital status</label>
                                                                    <select className="form-control" onChange={(e) => setHrUpdateData({ ...HrUpdateData, maritalStatus: e.target.value })}>
                                                                        {item.maritalStatus ? null :
                                                                            <option selected>Select an Option</option>
                                                                        }
                                                                        <option selected={item.maritalStatus == "Single"}>Single</option>
                                                                        <option selected={item.maritalStatus == "Married"}>Married</option>
                                                                        <option selected={item.maritalStatus == "Divorced"}>Divorced</option>
                                                                        <option selected={item.maritalStatus == "Widowed"}>Widowed</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Parenthood</label>
                                                                    <div>
                                                                        <label className='SpfxCheckRadio'><input type="radio" checked={HrUpdateData.Parenthood == 'yes'} className='radio' onChange={(e) => setHrUpdateData({ ...HrUpdateData, Parenthood: 'yes' })} /> Yes</label>
                                                                        <label className='SpfxCheckRadio'><input type="radio" checked={HrUpdateData.Parenthood == 'no'} className='radio' onChange={(e) => setHrUpdateData({ ...HrUpdateData, Parenthood: 'no' })} /> No</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> : null}
                                                    {hrBtnStatus.bankInfo ?
                                                        <div className="card-body">
                                                            <div className='user-form-2'>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">IBAN</label>
                                                                        <input type="text" className="form-control" placeholder='Enter IBAN' defaultValue={item.IBAN ? item.IBAN : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, IBAN: e.target.value })} />
                                                                    </div></div>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">BIC</label>
                                                                        <input type="text" className="form-control" defaultValue={item.BIC ? item.BIC : ''} placeholder='Enter BIC' onChange={(e) => setHrUpdateData({ ...HrUpdateData, BIC: e.target.value })} />
                                                                    </div></div>
                                                            </div>
                                                        </div> : null}
                                                    {hrBtnStatus.taxInfo ?
                                                        <div className="card-body">
                                                            <div className='user-form-3'>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">Tax No.
                                                                        </label>
                                                                        <input type="text" className="form-control" placeholder='Enter Tax No.' defaultValue={item.taxNo ? item.taxNo : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, taxNo: e.target.value })} />
                                                                    </div></div>
                                                                <div className="col mx-2">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">Tax class</label>
                                                                        <select className="form-control py-1" onChange={(e) => setHrUpdateData({ ...HrUpdateData, taxClass: e.target.value })}>
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
                                                                </div>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">Child allowance</label>
                                                                        <select className="form-control" onChange={(e) => setHrUpdateData({ ...HrUpdateData, childAllowance: e.target.value })}>
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
                                                            </div>
                                                            <div className='user-form-2'>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">Church tax</label>
                                                                        <div>
                                                                            <label className='SpfxCheckRadio'><input className='radio' type="radio" onChange={(e) => setHrUpdateData({ ...HrUpdateData, churchTax: 'yes' })} checked={HrUpdateData.churchTax == 'yes'} /> Yes</label>
                                                                            <label className='SpfxCheckRadio'><input className='radio' type="radio" onChange={(e) => setHrUpdateData({ ...HrUpdateData, churchTax: 'no' })} checked={HrUpdateData.churchTax == 'no'} /> No</label>
                                                                        </div></div>
                                                                </div>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">Monthly tax allowance</label>
                                                                        <input type="number" className="form-control" placeholder='Enter Monthly tax allowance' defaultValue={item.monthlyTaxAllowance ? item.monthlyTaxAllowance : ''} />
                                                                    </div></div>

                                                            </div>
                                                        </div> : null}
                                                    {hrBtnStatus.socialSecurityInfo ? <div className="card-body">
                                                        <div className='user-form-3'>

                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Health Insurance Type</label>
                                                                    <select className="form-control" onChange={(e) => setHrUpdateData({ ...HrUpdateData, healthInsuranceType: e.target.value })}>
                                                                        {item.healthInsuranceType ? null :
                                                                            <option selected>Select an Option</option>
                                                                        }
                                                                        <option selected={item.healthInsuranceType == "None"}>None</option>
                                                                        <option selected={item.healthInsuranceType == "Statutory"}>Statutory</option>
                                                                        <option selected={item.healthInsuranceType == "Private"}>Private</option>
                                                                    </select>
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Health Insurance Company
                                                                    </label>
                                                                    <input type="text" className="form-control" placeholder='Enter Company Name' defaultValue={item.healthInsuranceCompany ? item.healthInsuranceCompany : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, healthInsuranceCompany: e.target.value })} />
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Health Insurance No
                                                                    </label>
                                                                    <input type="text" className="form-control" placeholder='Enter Health Insurance No' defaultValue={item.insuranceNo ? item.insuranceNo : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, insuranceNo: e.target.value })} />
                                                                </div></div>
                                                        </div>

                                                    </div> : null}
                                                    {hrBtnStatus.qualificationInfo ?
                                                        <div className='card-body'>
                                                            <div className='user-form-2'>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">Highest school diploma
                                                                        </label>
                                                                        <input type="text" className="form-control" placeholder='Enter Highest school diploma' defaultValue={item.highestSchoolDiploma ? item.highestSchoolDiploma : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, highestSchoolDiploma: e.target.value })} />
                                                                    </div></div>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">Highest vocational education
                                                                        </label>
                                                                        <input type="text" className="form-control" placeholder='Enter Highest vocational education' defaultValue={item.highestVocationalEducation ? item.highestVocationalEducation : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, highestVocationalEducation: e.target.value })} />
                                                                    </div></div>
                                                            </div>
                                                            <div className='user-form-2'>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">Other qualifications
                                                                        </label>
                                                                        <input type="text" className="form-control" placeholder='Enter Other qualifications' defaultValue={item.otherQualifications ? item.otherQualifications : ''} onChange={(e) => setHrUpdateData({ ...HrUpdateData, otherQualifications: e.target.value })} />
                                                                    </div></div>
                                                                <div className="col">
                                                                    <div className='input-group'>
                                                                        <label className="full-width label-form">Languages
                                                                        </label>
                                                                        <input type="text" className="form-control" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> : null}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="SMALSUS" role="tabpanel" aria-labelledby="SMALSUS">
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
                                                        <div className='input-group'>
                                                            <label className='full-width label-form'>Adhar Card No. </label>
                                                            <input type="text" className="form-control" aria-label="Adhar Card No. " placeholder='Adhar Card No. ' />
                                                        </div></div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">PAN Card No.</label>
                                                            <input type="text" className="form-control" aria-label="PAN Card No." placeholder='PAN Card No.' />
                                                        </div></div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Passport No.</label>
                                                            <input type="text" className="form-control" aria-label="Passport No." placeholder='Passport No.' />
                                                        </div></div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Personal Email</label>
                                                            <input type="text" className="form-control" aria-label="JobTitle" placeholder='Job-Title' />
                                                        </div></div>
                                                </div>
                                                <div className='user-form-4'>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Nationality</label>
                                                            <input type="text" className="form-control" placeholder='Enter Nationality' />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Marital status</label>
                                                            <select className="form-control">
                                                                <option selected>Select an Option</option>
                                                                <option>Single</option>
                                                                <option>Married</option>
                                                                <option>Divorced</option>
                                                                <option>Widowed</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Blood Group</label>
                                                            <input type='text' className='form-control' placeholder='Enter Your Blood Group' />
                                                        </div></div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Date of Birth</label>
                                                            <input type="date" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card my-2'>
                                                    <div className='card-header'>
                                                        <h3>Permanent Address</h3>
                                                    </div>
                                                    <div className='card-body'>
                                                        <div className='user-form-4'>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Country</label>
                                                                    <input type="text" className="form-control" placeholder='Country' />
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">State</label>
                                                                    <input type="text" className="form-control" placeholder='State' />
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className='full-width label-form'>City</label>
                                                                    <input type="text" className="form-control" placeholder='City' />
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">District</label>
                                                                    <input type="text" className="form-control" placeholder='District' />
                                                                </div></div>
                                                        </div>
                                                        <div className='user-form-4'>

                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className='full-width label-form'>Street</label>
                                                                    <input type="text" className="form-control" placeholder='Street' />
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Area</label>
                                                                    <input type="text" className="form-control" placeholder='Area' />
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Landmark</label>
                                                                    <input type="text" className="form-control" placeholder='Landmark' />
                                                                </div></div>
                                                            <div className="col">
                                                                <div className='input-group'>
                                                                    <label className="full-width label-form">Zip Code</label>
                                                                    <input type="text" className="form-control" placeholder='Zip Code' />
                                                                </div></div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div> : null}
                                            {SmalsusBtnStatus.bankInfo ?
                                                <div className="card-body">
                                                    <div className='user-form-2'>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className='full-width label-form'>Bank Name</label>
                                                                <input type="text" className="form-control" placeholder='Bank Name' />
                                                            </div></div>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Account Number</label>
                                                                <input type="text" className="form-control" placeholder='Account Number' />
                                                            </div></div>
                                                    </div>
                                                    <div className='user-form-2'>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">IFSC</label>
                                                                <input type="text" className="form-control" placeholder='IFSC' />
                                                            </div></div>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Branch Name</label>
                                                                <input type="number" className="form-control" placeholder='Branch Name' />
                                                            </div></div>
                                                    </div>
                                                </div> : null}
                                            {SmalsusBtnStatus.taxInfo ?
                                                <div className="card-body">
                                                    <div className='user-form-3'>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">UN Number
                                                                </label>
                                                                <input type="text" className="form-control" placeholder='Enter UN Number' />
                                                            </div></div>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">ITR Number
                                                                </label>
                                                                <input type="text" className="form-control" placeholder='Enter ITR Number' />
                                                            </div></div>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Income Tax</label>
                                                                <input type="text" className="form-control" placeholder='Income Tax' />
                                                            </div></div>


                                                    </div>
                                                    <div className='user-form-2'>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">{`(PF) Provident Fund nomination form`}</label>
                                                                <input type="text" className="form-control" placeholder='Provident Fund nomination form' />
                                                            </div></div>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Employee State Insurance (ESI)</label>
                                                                <input type="text" className="form-control" />
                                                            </div></div>

                                                    </div>
                                                </div>
                                                : null}
                                            {SmalsusBtnStatus.socialSecurityInfo ?
                                                <div className="card-body">
                                                    <div className='user-form-2'>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Health Insurance Type</label>
                                                                <select className="form-control" >
                                                                    <option selected>Select an Option</option>
                                                                    <option>None</option>
                                                                    <option >Statutory</option>
                                                                    <option >Private</option>
                                                                </select>
                                                            </div></div>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Health Insurance Company
                                                                </label>
                                                                <input type="text" className="form-control" placeholder='Enter Company Name' />
                                                            </div></div>
                                                    </div>
                                                    <div className='user-form-2'>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Health Insurance Number
                                                                </label>
                                                                <input type="text" className="form-control" placeholder='Enter Company Number' />
                                                            </div></div>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">{`Medical History (Insurance and medical policy)`}
                                                                </label>
                                                                <input type="text" className="form-control" placeholder='Enter Medical History (Insurance and medical policy)' />
                                                            </div></div>
                                                    </div>

                                                </div> : null}
                                            {SmalsusBtnStatus.qualificationInfo ?
                                                <div className='card-body'>
                                                    <div className='user-form-2'>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Highest school diploma
                                                                </label>
                                                                <input type="text" className="form-control" placeholder='Enter Highest school diploma' />
                                                            </div></div>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Highest vocational education
                                                                </label>
                                                                <input type="text" className="form-control" placeholder='Enter Highest vocational education' />
                                                            </div></div>
                                                    </div>
                                                    <div className='user-form-2'>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Other qualifications
                                                                </label>
                                                                <input type="text" className="form-control" placeholder='Enter Other qualifications' />
                                                            </div></div>
                                                        <div className="col">
                                                            <div className='input-group'>
                                                                <label className="full-width label-form">Languages
                                                                </label>
                                                                <input type="text" className="form-control" />
                                                            </div></div>
                                                    </div>
                                                </div> : null}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {status.orgPopup ? <OrgContactEditPopup callBack={CloseOrgPopup}  updateData={updateData}/> : null}
                    {status.countryPopup ? <CountryContactEditPopup popupName="Country" selectedCountry={currentCountry} callBack={CloseCountryPopup} data={countryData} updateData={updateData} /> : null}
                    {status.statePopup ? <CountryContactEditPopup popupName="State"  selectedState={selectedState} callBack={CloseCountryPopup} data={stateData}updateData={updateData} /> : null}
                </div >
                <footer className='bg-f4 fixed-bottom'>
                    <div className='align-items-center d-flex justify-content-between me-3 px-4 py-2'>


                        <div>
                            {console.log("footerdiv")}
                            <div><span className='pe-2'>Created</span><span className='pe-2'> {updateData?.Created ? Moment(updateData?.Created).format("DD/MM/YYYY") : ''}&nbsp;By</span><span><a>{updateData?.FullName ? updateData?.FullName : ''}</a></span></div>
                            <div><span className='pe-2'>Last modified</span><span className='pe-2'> {updateData?.Modified ? Moment(updateData?.Modified).format("DD/MM/YYYY") : ''}&nbsp;By</span><span><a>{updateData?.Editor ? updateData?.Editor.Title : ''}</a></span></div>
                            <div className='alignCenter'><span onClick={deleteUserDtl} className="svg__iconbox svg__icon--trash hreflink"></span>Delete this item</div>
                        </div>

                        <div>
                          
                           {myContextData2.allSite?.MainSite && <span>
                                <a className="ForAll hreflink" target="_blank" data-interception="off"
                                    href={`${myContextData2.allSite?.MainSite?myContextData2?.allListId?.jointSiteUrl:myContextData2?.allListId?.siteUrl}/SitePages/contact-Profile.aspx?contactId=${updateData.Id}`}>
                                    <img className="mb-3 icon_siz19" style={{ marginRight: '3px' }}
                                        src="/_layouts/15/images/ichtm.gif?rev=23" alt="icon" />Go to Profile page
                                </a>
                            </span>}
                        
                            {myContextData2.allSite?.MainSite && <span>|</span>}
                            {myContextData2.allSite?.MainSite &&<span>
                                <a className="ForAll hreflink" target="_blank" data-interception="off"
                                    href={`https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/SmartMetaDataPortfolio.aspx`}>
                                  Manage Contact-Categories 
                                </a>
                            </span>}
                            {myContextData2.allSite?.MainSite && <span>|</span>}

                         <a href={`${myContextData2.allSite?.MainSite?myContextData2?.allListId?.jointSiteUrl:myContextData2?.allListId?.siteUrl}/Lists/Contacts/EditForm.aspx?ID=${updateData?.Id}`}  data-interception="off"
                            target="_blank">Open out-of-the-box form</a> 

                            <button className='btn btn-primary ms-1  mx-2'
                                onClick={UpdateDetails}
                            >
                                Save
                            </button>
                            <button className='btn btn-default' onClick={() => callBack()}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </footer>
            </Panel>
        </>
    )
}
export default HHHHEditComponent;