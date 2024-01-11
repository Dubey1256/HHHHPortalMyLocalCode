import * as React from 'react';
import OrgContactEditPopup from './orgContactEditPopup';
import CountryContactEditPopup from './CountryContactEditPopup';
import { useState, useEffect, useCallback } from 'react';
import pnp, { Web } from 'sp-pnp-js';
import moment, * as Moment from "moment";
import Tooltip from '../../../../../globalComponents/Tooltip';
import { Panel, PanelType } from 'office-ui-fabric-react';
import ImagesC from '../../../../EditPopupFiles/ImageInformation';
import { myContextValue } from '../../../../../globalComponents/globalCommon'
import CreateContract from '../../../../hrContractsearch/components/CreateContract';


let JointData: any;
let JointHrData:any
const HHHHEditComponent = (props: any) => {
    const myContextData2: any = React.useContext<any>(myContextValue)
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const[createContractPopup,setCreateContractPopup]=useState(false);
    const [imagetab, setImagetab] = React.useState(false);
    const [status, setStatus] = useState({
        orgPopup: false,
        countryPopup: false,
        statePopup: false
    });
    const [HrTagData, setHrTagData]: any = useState({});
    const [siteTaggedHR, setSiteTaggedHR] = useState(false);
    const [siteTaggedSMALSUS, setSiteTaggedSMALSUS] = useState(false);
    const [updateData, setUpdateData]: any = useState({});
    const [URLs, setURLs] = useState([]);
    const [selectedState, setSelectedState] = useState();
    const [currentCountry, setCurrentCountry]: any = useState([])
    const [SmalsusBtnStatus, setSmalsusBtnStatus] = useState({
        personalInfo: true,
        bankInfo: false,
        taxInfo: false,
        qualificationInfo: false,
        socialSecurityInfo: false
    })
    let callBack = props?.callBack;

    useEffect(() => {
        getSmartMetaData();
        if (myContextData2.allSite?.MainSite) {
            getJointCont(props?.props?.Id);

        } else {

            HrGmbhEmployeDeatails(props?.props?.Id);
           
        }
        pnp.sp.web.currentUser.get().then((result: any) => {
            let CurrentUserId = result.Id;
            console.log(CurrentUserId)
        });
    }, [])

    //**********Joint Contact  get Data function********************** */
    const getJointCont = async (Id: any) => {
        try {
            let web = new Web(myContextData2?.allListId?.siteUrl);
            await web.lists.getById(myContextData2?.allListId?.HHHHContactListId)
                .items.getById(Id).select("Id, Title, FirstName, FullName, Department,DOJ,DOE, Company, WorkCity, Suffix, WorkPhone, HomePhone, Comments, WorkAddress, WorkFax, WorkZip, Site, ItemType, JobTitle, Item_x0020_Cover, WebPage, Site, CellPhone, Email, LinkedIn, Created, SocialMediaUrls, SmartCountries/Title, SmartCountries/Id, Author/Title, Modified, Editor/Title, Division/Title, Division/Id, EmployeeID/Title, StaffID, EmployeeID/Id, Institution/Id, Institution/FullName, IM")
                .expand("EmployeeID, Division, Author, Editor, SmartCountries, Institution").get().then((data: any) => {
                    let  tagDivision= []
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
                        HrTagInformation(data?.Id)
                    }
                    // if (SitesTagged.search("SMALSUS") >= 0 && myContextData2.loggedInUserName == data.Email) {
                    //     HrTagInformation(Id);
                    //     setSiteTaggedSMALSUS(true);
                    // }
                    data.Item_x002d_Image = data?.Item_x0020_Cover;
                    if(myContextData2?.divisionData!=undefined){
                        tagDivision=   myContextData2?.divisionData?.filter((divData:any)=>divData?.Parent?.Id==data?.Institution?.Id)
                       }
                       if(tagDivision?.length>0){
                           data.Division=  tagDivision
                       }
                    setUpdateData(data);
                  
                    
                }).catch((error: any) => {
                    console.log(error)
                })



        } catch (error) {
            console.log("Error:", error.message);
        }

    }
    //***************Joint contact function end***************** */

//*****************Hr gmbh get contact function start*************** */
    const HrGmbhEmployeDeatails = async (Id: any) => {
        let selectcolumn:any
        let expandColumn:any
        try {
            if(myContextData2?.allSite?.GMBHSite){
             selectcolumn='Id, Title, FirstName, FullName,DOJ,DOE, Company,SmartCountriesId, SmartContactId, WorkCity, Suffix, WorkPhone, HomePhone, Comments, WorkAddress, WorkFax, WorkZip, ItemType, JobTitle, Item_x0020_Cover, WebPage, CellPhone, Email, LinkedIn, Created, SocialMediaUrls, Author/Title, Modified, Editor/Title, Division/Title, Division/Id, EmployeeID/Title, StaffID, EmployeeID/Id, Institution/Id, Institution/FullName, IM &$expand= EmployeeID,Division, Author, Editor, Institution'
                
            }else{
                selectcolumn='Id,Parenthood,Fedral_State,churchTax,healthInsuranceType,taxClass,childAllowance,healthInsuranceCompany,maritalStatus,dateOfBirth,insuranceNo,otherQualifications,highestVocationalEducation,highestSchoolDiploma,Nationality,placeOfBirth,BIC,IBAN,taxNo,monthlyTaxAllowance, Title, FirstName, FullName,DOJ,DOE, Company,SmartCountriesId, SmartContactId, WorkCity, Suffix, WorkPhone, HomePhone, Comments, WorkAddress, WorkFax, WorkZip, ItemType, JobTitle, Item_x0020_Cover, WebPage, CellPhone, Email, LinkedIn, Created, SocialMediaUrls, Author/Title, Modified, Editor/Title, Division/Title, Division/Id, EmployeeID/Title, StaffID, EmployeeID/Id, Institution/Id, Institution/FullName, IM &$expand= EmployeeID,Division, Author, Editor, Institution'    
            }
          
            let web = new Web(myContextData2?.allListId?.siteUrl);
            await web.lists.getById(myContextData2?.allSite?.GMBHSite ? myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID : myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID)
                .items.getById(Id)
                .select(selectcolumn)
                .get().then((data: any) => {
                    let  tagDivision= []
                    
                    let URL: any[] = JSON.parse(data.SocialMediaUrls != null ? data.SocialMediaUrls : ["{}"]);
                    setURLs(URL);
                    // if (data?.Institution != null && data?.Institution!=undefined) {
                    //    setCurrentInstitute(data?.Institution);
                    // }
                    data.Item_x002d_Image = data?.Item_x0020_Cover;
                    if(myContextData2?.divisionData!=undefined){
                        tagDivision=   myContextData2?.divisionData?.filter((divData:any)=>divData?.Institution?.Id==data?.Institution?.Id)
                       }
                       if(tagDivision?.length>0){
                           data.Division=  tagDivision
                       }
                    if (data?.SmartContactId != undefined ) {
                        JointContactDetails(data)
                    } 
                  
                    else {
                        setUpdateData(data)
                    }


                }).catch((error: any) => {
                    console.log(error)
                });



        } catch (error) {
            console.log("Error:", error.message);
        }
    }

    //*************Hr Gmbh get contact function end******************** */

    //**********Joint conatct function gmbh hr site url************ */
    const JointContactDetails = async (siteData: any) => {
        try {
            let web = new Web(myContextData2?.allListId?.jointSiteUrl);
            await web.lists.getById(myContextData2?.allListId?.HHHHContactListId)
                .items.getById(siteData?.SmartContactId)
                .select("Id", "Title", "FirstName", "FullName", "Department", "Company", "WorkCity", "Suffix", "WorkPhone", "HomePhone", "Comments", "WorkAddress", "WorkFax", "WorkZip", "Site", "ItemType", "JobTitle", "Item_x0020_Cover", "WebPage", "Site", "CellPhone", "Email", "LinkedIn", "Created", "SocialMediaUrls", "SmartCountries/Title", "SmartCountries/Id", "Author/Title", "Modified", "Editor/Title", "Division/Title", "Division/Id", "EmployeeID/Title", "StaffID", "EmployeeID/Id", "Institution/Id", "Institution/FullName", "IM")
                .expand("EmployeeID", "Division", "Author", "Editor", "SmartCountries", "Institution")
                .get().then((data: any) => {
                    // data.map((Item: any) => {
                        let SitesTagged=''
                    data.SitesTagged = ''
                    if (data.Site != null) {
                        if (data.Site.length >= 0) {
                            data.Site?.map((site: any, index: any) => {
                                if (index == 0) {
                                    data.SitesTagged = site;
                                    SitesTagged=site;
                                } else if (index > 0) {
                                    data.SitesTagged = data.SitesTagged + ', ' + site;
                                    SitesTagged=data.SitesTagged + ', ' + site;
                                }
                            })
                        }
                    }
                    if (SitesTagged.search("HR") >= 0 && myContextData2.allSite?.HrSite) {
                        // HrTagInformation(data?.Id);
                        setSiteTaggedHR(true);
                    }
                    if (data?.SmartCountries?.length > 0) {

                        setCurrentCountry(data?.SmartCountries);
                    }
                    if (myContextData2.allSite?.MainSite == false) {
                        siteData.Site = data.Site
                        siteData.SmartCountries = data.SmartCountries
                        setUpdateData(siteData)
                        if(myContextData2.allSite?.HrSite){
                            setHrTagData(siteData);
                            HrTagInformation(data?.Id)
                        }
                    }


                    // siteData.Site = data.Site

                    JointData = data;
                });

        } catch (error) {
            setUpdateData(siteData)
            console.log("Error:", error.message);
        }
    }
     //**********Joint conatct function gmbh hr site url END ************ */

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
//********************* Joint Hr detail function start************** */
    const HrTagInformation = async (Id: any) => {
        try {
            const web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH");
            await web.lists
                .getById("6DD8038B-40D2-4412-B28D-1C86528C7842")
                .items.select(
                    "Id,ID,Title,BIC,Country, Parenthood, IBAN, Nationality,healthInsuranceCompany,highestVocationalEducation,healthInsuranceType,highestSchoolDiploma,insuranceNo,otherQualifications,dateOfBirth,Fedral_State,placeOfBirth,maritalStatus,taxNo,churchTax,taxClass,monthlyTaxAllowance,childAllowance,SmartState/Title,SmartState/Id,SmartLanguages/Title,SmartLanguages/Id,SmartContact/Title,SmartContact/Id")
                .expand("SmartLanguages, SmartState, SmartContact")
                .filter("SmartContact/ID eq " + Id).get().then((data: any) => {

                    // ;
                    //         setHrUpdateData({
                    //             ...HrUpdateData,
                    //             Parenthood: data[0].Parenthood ? data[0].Parenthood : '',
                    //             churchTax: data[0].churchTax ? data[0].churchTax : ''
                    //         });
                    if(myContextData2.allSite?.HrSite){
                        JointHrData=data[0];
                    }else{
                        setHrTagData(data[0]);
                    }
                    
                }).catch((error: any) => {
                    console.log(error)
                });

        } catch (error) {
            console.log("error:", error.message);
        }
    };

    //******************Joint Hr detail function End  */

    //*****************Save for Joint,GMBH,HR Data Update***************************************** */
    const UpdateDetails = async () => {
        let urlData: any;
        if (updateData?.WebPage != undefined && updateData?.WebPage?.Url != undefined) {
            let spliceString = updateData?.WebPage?.Url?.slice(0, 8)
            if (spliceString == "https://") {
                urlData = updateData?.WebPage?.Url;
            } else {
                urlData = "https://" + updateData?.WebPage?.Url;
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

            let postData: any = {
                Title: (updateData?.Title),
                FirstName: (updateData?.FirstName),
                Suffix: (updateData?.Suffix),
                JobTitle: (updateData?.JobTitle),
                FullName: (updateData?.FirstName) + " " + (updateData?.Title!=null?updateData?.Title:""),
                InstitutionId: (updateData?.Institution != undefined ? updateData?.Institution?.Id : null),
                Email: (updateData?.Email),
                Department: (updateData?.Department),
                WorkPhone: (updateData?.WorkPhone),
                CellPhone: (updateData?.CellPhone),
                HomePhone: (updateData?.HomePhone),
                WorkCity: (updateData?.WorkCity),
                WorkAddress: (updateData?.WorkAddress),
                DOJ: updateData?.DOJ != undefined ? new Date(updateData?.DOJ).toISOString() : null,
                DOE: updateData?.DOE != undefined ? new Date(updateData?.DOE).toISOString() : null,
                WebPage: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: "Description",
                    Url: updateData?.WebPage ? urlData : (updateData?.WebPage ? updateData?.WebPage.Url : null)
                },
                Item_x0020_Cover: {
                    "__metadata": { type: "SP.FieldUrlValue" },
                    Description: "Description",
                    Url: updateData?.Item_x002d_Image != undefined ? updateData?.Item_x002d_Image?.Url : (updateData?.Item_x0020_Cover != undefined ? updateData?.Item_x0020_Cover?.Url : null)
                },
                WorkZip: (updateData?.WorkZip),
                IM: (updateData?.IM),
                SocialMediaUrls: JSON.stringify(UrlData),
                SmartCountriesId: {
                    results: updateData?.SmartCountries?.length > 0 ? [updateData?.SmartCountries[0]?.Id] : []
                }
            }
            if (updateData?.Id != undefined) {
                let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                await web.lists.getById(myContextData2?.allListId?.HHHHContactListId).items.getById(myContextData2?.allSite?.GMBHSite || myContextData2?.allSite?.HrSite ? JointData?.Id : updateData?.Id).update(postData).then((e) => {
                    console.log("Your information has been updated successfully");
                    if (myContextData2?.allSite?.GMBHSite) {
                        UpdateGmbhDetails(postData);

                    }
                    if(myContextData2?.allSite?.HrSite){
                        updateHrDetails(postData);
                    }
                //   if (updateData?.Site?.toString().search("HR") >= 0 && myContextData2?.allSite?.MainSite) {
                //             updateJointHrDetails();
           
                //     }
                    // if(myContextData2?.allSite?.MainSite && updateData?.Site?.toString().search("HR") == 0){
                    //     callBack();
                       
                    // }
                    if(myContextData2?.allSite?.MainSite ){
                            callBack();
                           
                        }
                });

            }
        } catch (error) {
            console.log("Error:", error.message);
        }
        // if (updateData?.Site?.toString().search("HR") >= 0) {
        //     updateHrDetails();
           
        // }



    }

    //********************End Save for Joint,GMBH,HR Data Update ************************************ */



    // ************************Update GMBH fUNCTION Start  ***********************

    const UpdateGmbhDetails = async (postData: any) => {

        delete (postData?.Department)
      
        let web = new Web(myContextData2?.allListId?.siteUrl);
        await web.lists.getById(myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID).items.getById(updateData.Id).update(postData).then((e: any) => {
            console.log("request success", e);
            callBack();
        }).catch((error: any) => {
            console.log(error)
        })


    }

    // ************************End Update GMBH fUNCTION ***********************

    //******************* */ Hr update function **************************
   const updateHrDetails=async(postData:any)=>{
    delete (postData?.Department)
      let postDataHr={Nationality: (HrTagData?.Nationality ? HrTagData?.Nationality : null),
      placeOfBirth: (HrTagData?.placeOfBirth ? HrTagData?.placeOfBirth : null),
      BIC: (HrTagData?.BIC ? HrTagData?.BIC : null),
      IBAN: (HrTagData?.IBAN ? HrTagData?.IBAN : null),
      taxNo: (HrTagData?.taxNo ? HrTagData?.taxNo : null),
      monthlyTaxAllowance: (HrTagData?.monthlyTaxAllowance ? HrTagData?.monthlyTaxAllowance : null),
      insuranceNo: (HrTagData?.insuranceNo ? HrTagData?.insuranceNo : null),
      highestSchoolDiploma: (HrTagData?.highestSchoolDiploma ? HrTagData?.highestSchoolDiploma : null),
      highestVocationalEducation: (HrTagData?.highestVocationalEducation ? HrTagData?.highestVocationalEducation : null),
      otherQualifications: (HrTagData?.otherQualifications ? HrTagData?.otherQualifications : null),
      healthInsuranceCompany: (HrTagData?.healthInsuranceCompany ? HrTagData?.healthInsuranceCompany : null),
      dateOfBirth: (HrTagData?.dateOfBirth ? HrTagData?.dateOfBirth : null),
      maritalStatus: (HrTagData?.maritalStatus ? HrTagData?.maritalStatus : null),
      Parenthood: (HrTagData?.Parenthood ? HrTagData?.Parenthood : null),
      taxClass: (HrTagData?.taxClass ? HrTagData?.taxClass : null),
      childAllowance: (HrTagData?.childAllowance ? HrTagData?.childAllowance : null),
      churchTax: (HrTagData?.churchTax ? HrTagData?.churchTax : null),
      healthInsuranceType: (HrTagData?.healthInsuranceType ? HrTagData?.healthInsuranceType : null),
      Fedral_State: (HrTagData?.Fedral_State ? HrTagData?.Fedral_State : null)
      }
      let postDataHrSite = {
        ...postData,
        ...postDataHr
    };
    let web = new Web(myContextData2?.allListId?.siteUrl);
    await web.lists.getById(myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.getById(updateData.Id).update(postDataHrSite).then((e: any) => {
        console.log("request success", e);
        updateJointHrDetails()
       
    }).catch((error: any) => {
        console.log(error)
    })

   }
//******************* */ Hr update function End **************************

    //*************************UpdateHr Deatils joint   Function Start ***************************** */
    const updateJointHrDetails = async () => {
        let Id: any = myContextData2.allSite?.HrSite?JointHrData?.Id:HrTagData.ID;
        try {
            const web = new Web(myContextData2?.allListId?.jointSiteUrl);
            await web.lists
                .getById(myContextData2?.allListId?.MAIN_HR_LISTID)
                .items.getById(Id).update({
                    Nationality: (HrTagData?.Nationality ? HrTagData?.Nationality : null),
                    placeOfBirth: (HrTagData?.placeOfBirth ? HrTagData?.placeOfBirth : null),
                    BIC: (HrTagData?.BIC ? HrTagData?.BIC : null),
                    IBAN: (HrTagData?.IBAN ? HrTagData?.IBAN : null),
                    taxNo: (HrTagData?.taxNo ? HrTagData?.taxNo : null),
                    monthlyTaxAllowance: (HrTagData?.monthlyTaxAllowance ? HrTagData?.monthlyTaxAllowance : null),
                    insuranceNo: (HrTagData?.insuranceNo ? HrTagData?.insuranceNo : null),
                    highestSchoolDiploma: (HrTagData?.highestSchoolDiploma ? HrTagData?.highestSchoolDiploma : null),
                    highestVocationalEducation: (HrTagData?.highestVocationalEducation ? HrTagData?.highestVocationalEducation : null),
                    otherQualifications: (HrTagData?.otherQualifications ? HrTagData?.otherQualifications : null),
                    healthInsuranceCompany: (HrTagData?.healthInsuranceCompany ? HrTagData?.healthInsuranceCompany : null),
                    dateOfBirth: (HrTagData?.dateOfBirth ? HrTagData?.dateOfBirth : null),
                    maritalStatus: (HrTagData?.maritalStatus ? HrTagData?.maritalStatus : null),
                    Parenthood: (HrTagData?.Parenthood ? HrTagData?.Parenthood : null),
                    taxClass: (HrTagData?.taxClass ? HrTagData?.taxClass : null),
                    childAllowance: (HrTagData?.childAllowance ? HrTagData?.childAllowance : null),
                    churchTax: (HrTagData?.churchTax ? HrTagData?.churchTax : null),
                    healthInsuranceType: (HrTagData?.healthInsuranceType ? HrTagData?.healthInsuranceType : null),
                    Fedral_State: (HrTagData?.Fedral_State ? HrTagData?.Fedral_State : null)
                }).then(() => {
                    console.log("Your information has been updated successfully");
                    // alert("Your information has been updated successfully")
                    if( props?.pageName=="Recruiting-Tool"){
                        if(confirm("Are you want to create Contract ?")){
                            setCreateContractPopup(true)
                            //  callBack();
                         }
                         else{
                            if( props?.pageName=="Recruiting-Tool"){
                             window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/HR/SitePages/EmployeeInfo.aspx?employeeId=${updateData.Id}`,"_blank")
                                }
                                 
                                     callBack();
                                  }
                    }else{
                        callBack();
                    }
                    
                   
                })
        } catch (error) {
            console.log("error", error.message)
        }
      
    }
    //************************* End UpdateHr Deatils   Function ***************************** */


    //*******************Delete function***************************  */
    const deleteUserDtl = async () => {
        try {
            if (confirm("Are you sure, you want to delete this?")) {
                if (myContextData2?.allSite?.MainSite) {
                    let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                    await web.lists.getById(myContextData2?.allListId?.HHHHContactListId).items.getById(updateData?.Id).recycle().then(async (data: any) => {
                       console.log("joint data delete")
                       if(updateData?.Site?.toString().search("HR")>=0){
                      let  web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
                        await web.lists.getById(myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.select("Id","SmartContactId").filter(`SmartContactId eq ${updateData?.Id}`).get().then(async (data: any) => { 
                            if(data?.length>0){
                                data?.map(async(deleteData:any)=>{
                                  let   web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/HR");
                                    await web.lists.getById(myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.getById(deleteData.Id).recycle().then((data:any)=>{
                                     console.log("Hr site data delete")
                                    })
                                }) 
                                let web = new Web(myContextData2?.allListId?.jointSiteUrl); 
                                await web.lists.getById(myContextData2?.allListId?.MAIN_HR_LISTID).items.select("Id","SmartContactId").filter(`SmartContactId eq ${updateData?.Id}`).get()
                                .then( (data: any) => { 
                                    console.log(data)
                                    if(data?.length>0){
                                        data?.map(async(deleteData:any)=>{
                                            await web.lists.getById(myContextData2?.allListId?.MAIN_HR_LISTID).items.getById(deleteData.Id).recycle().then(async(data:any)=>{
                                             console.log("Hr joint data delete")
                                             if(updateData?.Site?.toString().search("GMBH")>=0){
                                                let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/GMBH"); 
                                                await web.lists.getById(myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID).items.select("Id","SmartContactId").filter(`SmartContactId eq ${updateData?.Id}`).get()
                                                .then( (data: any) => { 
                                                    console.log(data)
                                                    if(data?.length>0){
                                                        data?.map(async(deleteData:any)=>{
                                                            await web.lists.getById(myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID).items.getById(deleteData.Id).recycle().then((data:any)=>{
                                                             console.log("GMBH  data delete")
                                                            })
                                                        })
                                                    } 
                                                 }).catch((error:any)=>{
                                                    console.error(error,"errr")
                                                })
                                               }
                                            })
                                        })
                                    } 

                                     
                                }).catch((error:any)=>{
                                    console.error(error,"errr")
                                })
                            }
        
                            console.log(data)
                         
                        })
                        callBack();
                       }
                       else if(updateData?.Site?.toString().search("GMBH")>=0){
                        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/GMBH"); 
                        await web.lists.getById(myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID).items.select("Id","SmartContactId").filter(`SmartContactId eq ${updateData?.Id}`).get()
                        .then( (data: any) => { 
                            console.log(data)
                            if(data?.length>0){
                                data?.map(async(deleteData:any)=>{
                                    await web.lists.getById(myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID).items.getById(deleteData.Id).recycle().then((data:any)=>{
                                     console.log("GMBH  data delete")
                                    })
                                })
                            } 
                         }).catch((error:any)=>{
                            console.error(error,"errr")
                        })
                       }
                      
                    }).catch(async (error: any) => {
                        console.log(error)

                    });
                }
                  
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
    const CloseOrgPopup = useCallback((data: any) => {
        setStatus({ ...status, orgPopup: false })
        if (data != undefined) {
            setUpdateData(data);
        }

    }, []);
    const CloseCountryPopup = useCallback((data: any) => {
        setStatus({ ...status, countryPopup: false })
        // setCountryPopup(false);
        if (data != undefined) {
            setUpdateData(data);
            setCurrentCountry(setCurrentCountry?.SmartCountries)
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
  
    const selectState = (e: any, item: any) => {
        if (currentCountry.length > 0) {
            setStatus({
                ...status, orgPopup: false,
                countryPopup: false,
                statePopup: true
            })
            setSelectedState(item?.Fedral_State);
        } else {
            alert("Please select country before selecting state");
        }
    }
    // const selectedStateStatus = useCallback((item: any) => {
    //     setHrUpdateData({ ...HrUpdateData, Fedral_State: item.Title })
    //     setSelectedState(item)
    // }, [])

    //****************End Hr sMALSUS POPUP FUNCTIONALITY */
    const onRenderCustomHeadersmartinfo = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                    <img className='workmember' src={updateData?.Item_x0020_Cover != undefined ? updateData?.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/GmBH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />Edit Contact - {updateData?.FullName}
                </div>
                <Tooltip ComponentId='3433' />
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

    //*****************Contract create function***************** */
    const callBackData=React.useCallback(()=>{
        callBack();
        setCreateContractPopup(false);
    },[])
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
                                <button className="nav-link" id="HR-Tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#HR"
                                    type="button"
                                    role="tab"
                                    aria-controls="HR"
                                    aria-selected="true">HR</button>}
                            {siteTaggedSMALSUS && <button className="nav-link" id="SMALSUS-Tab"
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
                                        <div className="card-header fw-semibold">
                                            General
                                        </div>
                                        <div className="card-body">
                                            <div className="user-form-5 row mb-3">
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
                                            <div className="user-form-4 row mb-3">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Organization</label>
                                                        {updateData?.Institution?.FullName ?
                                                            <div className="block wid90 alignCenter">
                                                                <a className="hreflink" target="_blank"> {updateData?.Institution?.FullName}</a>
                                                                <span className="bg-light svg__icon--cross svg__iconbox hreflink ml-auto" onClick={() => setUpdateData({ ...updateData, Institution: undefined })}></span>
                                                            </div> : <input type='text' />

                                                        }

                                                        <span className="input-group-text" title="Select Organisation">
                                                            <span onClick={() => openOrg()} className="svg__iconbox svg__icon--editBox"></span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Division</label>
                                                        <select className="form-control"value={updateData?.Department}onChange={(e)=>setUpdateData({ ...updateData,Department:e.target.value})}>
                                                            <option selected>Select Division</option>
                                                           {updateData?.Division?.length>0&& updateData?.Division?.map((division:any)=>{
                                                            return(
                                                           <option>{division?.FullName}</option>
                                                            )
                                                           })} 
                                                            
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col pad0">
                                                    <label className="full_width form-label"> D.O.J</label>
                                                    <div> <input type="date" value={updateData?.DOJ != undefined ? moment(updateData?.DOJ).format('YYYY-MM-DD') : null} onChange={(e) => setUpdateData({ ...updateData, DOJ: moment(e.target.value).format('YYYY-MM-DD') })} /></div>
                                                </div>
                                                <div className="col pad0">
                                                    <label className="full_width form-label"> D.O.E</label>
                                                    <div><input type='date' value={updateData?.DOE != undefined ? moment(updateData?.DOE).format('YYYY-MM-DD') : null} onChange={(e) => setUpdateData({ ...updateData, DOE: moment(e.target.value).format('YYYY-MM-DD') })} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="Social-media-account my-2">
                                    <div className="card">
                                        <div className="card-header fw-semibold">
                                            Social Media Accounts
                                        </div>
                                        <div className="card-body">
                                            <div className="user-form-4 row">
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
                                        <div className="card-header fw-semibold">
                                            Contacts
                                        </div>
                                        <div className="card-body">
                                            <div className="user-form-5 row mb-3">
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
                                            <div className="user-form-5 row mb-3">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Skpye</label>
                                                        <input type="text" className="form-control" placeholder="Skpye" defaultValue={updateData?.IM ? updateData?.IM : ""}
                                                            onChange={(e) => setUpdateData({ ...updateData, IM: e.target.value })} aria-label="Skpye" />
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

                                                        <input className="form-control" type="text" defaultValue={updateData?.WebPage ? updateData?.WebPage.Url : ""} onChange={(e) => setUpdateData({ ...updateData, WebPage: { ...updateData.WebPage, Url: e.target.value } })} aria-label="WebPage" />
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

                                                        {updateData?.SmartCountries?.length > 0 ? <div className="block wid90 alignCenter">
                                                            <a className="hreflink" target="_blank">{updateData?.SmartCountries?.[0]?.Title}</a>
                                                            <span
                                                                onClick={() => setUpdateData({ ...updateData, SmartCountries: [] })}
                                                                className="bg-light ml-auto svg__icon--cross svg__iconbox"></span>
                                                        </div> : <input type='text'></input>}

                                                        <span className="input-group-text" title="Smart Category Popup">
                                                            <span onClick={() => openCountry(updateData?.SmartCountries)} className="svg__iconbox svg__icon--editBox"></span>
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
                                
                                <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                                    <button
                                        className="nav-link active"
                                        id="PERSONALIN-FORMATION1"
                                        data-bs-toggle="tab"
                                        data-bs-target="#PERSONALINFORMATION1"
                                        type="button"
                                        role="tab"
                                        aria-controls="PERSONALINFORMATION1"
                                        aria-selected="true">
                                        PERSONAL INFORMATION
                                    </button>
                                    <button
                                        className="nav-link"
                                        id="BANK-INFORMATION1"
                                        data-bs-toggle="tab"
                                        data-bs-target="#BANKINFORMATION1"
                                        type="button"
                                        role="tab"
                                        aria-controls="BANKINFORMATION1"
                                        aria-selected="false">
                                        BANK INFORMATION
                                    </button>
                                    <button
                                        className="nav-link"
                                        id="TAX-INFORMATION1"
                                        data-bs-toggle="tab"
                                        data-bs-target="#TAXINFORMATION1"
                                        type="button"
                                        role="tab"
                                        aria-controls="TAXINFORMATION1"
                                        aria-selected="false">
                                        TAX INFORMATION
                                    </button>
                                    <button
                                        className="nav-link"
                                        id="SOCIALSECURITY-INFORMATION1"
                                        data-bs-toggle="tab"
                                        data-bs-target="#SOCIALSECURITYINFORMATION1"
                                        type="button"
                                        role="tab"
                                        aria-controls="SOCIALSECURITYINFORMATION1"
                                        aria-selected="false">
                                        SOCIAL SECURITY INFORMATION
                                    </button>
                                    <button
                                        className="nav-link"
                                        id="QUALIFICATIONS-Tab1"
                                        data-bs-toggle="tab"
                                        data-bs-target="#QUALIFICATIONS1"
                                        type="button"
                                        role="tab"
                                        aria-controls="QUALIFICATIONS1"
                                        aria-selected="false">
                                        QUALIFICATIONS
                                    </button>
                                </ul>
                                <div className="border border-top-0 clearfix p-3 tab-content" id="myTabContent">
                                    <div className="tab-pane show active" id="PERSONALINFORMATION1" role="tabpanel" aria-labelledby="PERSONALINFORMATION">
                                        <div>
                                            <div className='user-form-3 row'>
                                               
                                                <div className="col">
                                                    <div className="input-group">
                                                        <label className="form-label full-width">Federal state</label>
                                                        <input type="text" className="form-control" id="txtCategories" placeholder="Search Category Here" value="" />
                                                        <span className="input-group-text" title="Smart Category Popup">
                                                            <span onClick={(e) => selectState(e, HrTagData)} className="svg__iconbox svg__icon--editBox"></span>
                                                        </span>
                                                    </div>
                                                    {HrTagData?.Fedral_State!=undefined && HrTagData?.Fedral_State != ''&&<div className="block w-100">
                                                        <a className="hreflink wid90" target="_blank" data-interception="off"></a>
                                                        <span className="bg-light hreflink ml-auto svg__icon--cross svg__iconbox"></span>
                                                    </div>}
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Nationality</label>
                                                        <input type="text" className="form-control" defaultValue={HrTagData?.Nationality ? HrTagData?.Nationality : ''} onChange={(e) => setHrTagData({ ...HrTagData, Nationality: e.target.value })} placeholder='Enter Nationality' />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Date of Birth</label>
                                                        <input type="date" className="form-control"
                                                            defaultValue={HrTagData?.dateOfBirth ? Moment(HrTagData?.dateOfBirth).format("YYYY-MM-DD") : ''} onChange={(e) => setHrTagData({ ...HrTagData, dateOfBirth: Moment(e.target.value).format("YYYY-MM-DD") })} />
                                                    </div></div>
                                            </div>
                                            <div className='user-form-3 row'>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Place of birth</label>
                                                        <input type="text" className="form-control" defaultValue={HrTagData?.placeOfBirth} onChange={(e) => setHrTagData({ ...HrTagData, placeOfBirth: e.target.value })} placeholder='Enter Place of birth' />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Marital status</label>
                                                        <select className="form-control" onChange={(e) => setHrTagData({ ...HrTagData, maritalStatus: e.target.value })}>
                                                            {HrTagData?.maritalStatus ? null :
                                                                <option selected>Select an Option</option>
                                                            }
                                                            <option selected={HrTagData?.maritalStatus == "Single"}>Single</option>
                                                            <option selected={HrTagData?.maritalStatus == "Married"}>Married</option>
                                                            <option selected={HrTagData?.maritalStatus == "Divorced"}>Divorced</option>
                                                            <option selected={HrTagData?.maritalStatus == "Widowed"}>Widowed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Parenthood</label>
                                                        <div>
                                                            <label className='SpfxCheckRadio'><input type="radio" checked={HrTagData?.Parenthood == 'yes'} className='radio' onChange={(e) => setHrTagData({ ...HrTagData, Parenthood: 'yes' })} /> Yes</label>
                                                            <label className='SpfxCheckRadio'><input type="radio" checked={HrTagData?.Parenthood == 'no'} className='radio' onChange={(e) => setHrTagData({ ...HrTagData, Parenthood: 'no' })} /> No</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div></div>
                                    <div className="tab-pane" id="BANKINFORMATION1" role="tabpanel" aria-labelledby="BANKINFORMATION1">
                                            <div className="card-body">
                                                <div className='user-form-2 row'>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">IBAN</label>
                                                            <input type="text" className="form-control" placeholder='Enter IBAN' defaultValue={HrTagData?.IBAN ? HrTagData?.IBAN : ''} onChange={(e) => setHrTagData({ ...HrTagData, IBAN: e.target.value })} />
                                                        </div></div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">BIC</label>
                                                            <input type="text" className="form-control" defaultValue={HrTagData?.BIC ? HrTagData?.BIC : ''} placeholder='Enter BIC' onChange={(e) => setHrTagData({ ...HrTagData, BIC: e.target.value })} />
                                                        </div></div>
                                                </div>
                                            </div></div>
                                    <div className="tab-pane" id="TAXINFORMATION1" role="tabpanel" aria-labelledby="TAXINFORMATION1">
                                        
                                            <div className="card-body">
                                                <div className='user-form-3 row'>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Tax No.
                                                            </label>
                                                            <input type="text" className="form-control" placeholder='Enter Tax No.' defaultValue={HrTagData?.taxNo ? HrTagData?.taxNo : ''} onChange={(e) => setHrTagData({ ...HrTagData, taxNo: e.target.value })} />
                                                        </div></div>
                                                    <div className="col mx-2">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Tax class</label>
                                                            <select className="form-control py-1" onChange={(e) => setHrTagData({ ...HrTagData, taxClass: e.target.value })}>
                                                                {HrTagData?.taxClass ? null :
                                                                    <option selected>Select an Option</option>
                                                                }
                                                                <option selected={HrTagData?.taxClass == "I"}>I</option>
                                                                <option selected={HrTagData?.taxClass == "II"}>II</option>
                                                                <option selected={HrTagData?.taxClass == "III"}>III</option>
                                                                <option selected={HrTagData?.taxClass == "IV"}>IV</option>
                                                                <option selected={HrTagData?.taxClass == "V"}>V</option>
                                                                <option selected={HrTagData?.taxClass == "VI"}>VI</option>
                                                                <option selected={HrTagData?.taxClass == "none"}>None</option>
                                                            </select>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Child allowance</label>
                                                            <select className="form-control" onChange={(e) => setHrTagData({ ...HrTagData, childAllowance: e.target.value })}>
                                                                {HrTagData?.childAllowance ? null :
                                                                    <option selected>Select an Option</option>
                                                                }
                                                                <option selected={HrTagData?.childAllowance == "0.5"}>0.5</option>
                                                                <option selected={HrTagData?.childAllowance == "1"}>1</option>
                                                                <option selected={HrTagData?.childAllowance == "1.5"}>1.5</option>
                                                                <option selected={HrTagData?.childAllowance == "2"}>2</option>
                                                                <option selected={HrTagData?.childAllowance == "2.5"}>2.5</option>
                                                                <option selected={HrTagData?.childAllowance == "3"}>3</option>
                                                                <option selected={HrTagData?.childAllowance == "3.5"}>3.5</option>
                                                                <option selected={HrTagData?.childAllowance == "4"}>4</option>
                                                                <option selected={HrTagData?.childAllowance == "4.5"}>4.5</option>
                                                                <option selected={HrTagData?.childAllowance == "5"}>5</option>
                                                                <option selected={HrTagData?.childAllowance == "5.5"}>5.5</option>
                                                                <option selected={HrTagData?.childAllowance == "6"}>6</option>
                                                                <option selected={HrTagData?.childAllowance == "6.5"}>6.5</option>
                                                                <option selected={HrTagData?.childAllowance == "7"}>7</option>
                                                                <option selected={HrTagData?.childAllowance == "7.5"}>7.5</option>
                                                                <option selected={HrTagData?.childAllowance == "8"}>8</option>
                                                                <option selected={HrTagData?.childAllowance == "8.5"}>8.5</option>
                                                                <option selected={HrTagData?.childAllowance == "9"}>9</option>
                                                                <option selected={HrTagData?.childAllowance == "9.5"}>9.5</option>
                                                                <option selected={HrTagData?.childAllowance == "none"}>None</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='user-form-2 row'>
                                                    
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Monthly tax allowance</label>
                                                            <input type="number" className="form-control" placeholder='Enter Monthly tax allowance' defaultValue={HrTagData?.monthlyTaxAllowance ? HrTagData?.monthlyTaxAllowance : ''} />
                                                        </div></div>
                                                        <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Church tax</label>
                                                            <div>
                                                                <label className='SpfxCheckRadio'><input className='radio' type="radio" onChange={(e) => setHrTagData({ ...HrTagData, churchTax: 'yes' })} checked={HrTagData?.churchTax == 'yes'} /> Yes</label>
                                                                <label className='SpfxCheckRadio'><input className='radio' type="radio" onChange={(e) => setHrTagData({ ...HrTagData, churchTax: 'no' })} checked={HrTagData?.churchTax == 'no'} /> No</label>
                                                            </div></div>
                                                    </div>

                                                </div>
                                            </div></div>
                                    <div className="tab-pane" id="SOCIALSECURITYINFORMATION1" role="tabpanel" aria-labelledby="SOCIALSECURITYINFORMATION1">
                                       <div className="card-body">
                                            <div className='user-form-3 row'>

                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Health Insurance Type</label>
                                                        <select className="form-control" onChange={(e) => setHrTagData({ ...HrTagData, healthInsuranceType: e.target.value })}>
                                                            {HrTagData?.healthInsuranceType ? null :
                                                                <option selected>Select an Option</option>
                                                            }
                                                            <option selected={HrTagData?.healthInsuranceType == "None"}>None</option>
                                                            <option selected={HrTagData?.healthInsuranceType == "Statutory"}>Statutory</option>
                                                            <option selected={HrTagData?.healthInsuranceType == "Private"}>Private</option>
                                                        </select>
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Health Insurance Company
                                                        </label>
                                                        <input type="text" className="form-control" placeholder='Enter Company Name' defaultValue={HrTagData?.healthInsuranceCompany ? HrTagData?.healthInsuranceCompany : ''} onChange={(e) => setHrTagData({ ...HrTagData, healthInsuranceCompany: e.target.value })} />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Health Insurance No
                                                        </label>
                                                        <input type="text" className="form-control" placeholder='Enter Health Insurance No' defaultValue={HrTagData?.insuranceNo ? HrTagData?.insuranceNo : ''} onChange={(e) => setHrTagData({ ...HrTagData, insuranceNo: e.target.value })} />
                                                    </div></div>
                                            </div>

                                        </div></div>
                                    <div className="tab-pane" id="QUALIFICATIONS1" role="tabpanel" aria-labelledby="QUALIFICATIONS1">
                                       
                                            <div className='card-body'>
                                                <div className='user-form-2 row'>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Highest school diploma
                                                            </label>
                                                            <input type="text" className="form-control" placeholder='Enter Highest school diploma' defaultValue={HrTagData?.highestSchoolDiploma ? HrTagData?.highestSchoolDiploma : ''} onChange={(e) => setHrTagData({ ...HrTagData, highestSchoolDiploma: e.target.value })} />
                                                        </div></div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Highest vocational education
                                                            </label>
                                                            <input type="text" className="form-control" placeholder='Enter Highest vocational education' defaultValue={HrTagData?.highestVocationalEducation ? HrTagData?.highestVocationalEducation : ''} onChange={(e) => setHrTagData({ ...HrTagData, highestVocationalEducation: e.target.value })} />
                                                        </div></div>
                                                </div>
                                                <div className='user-form-2 row'>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Other qualifications
                                                            </label>
                                                            <input type="text" className="form-control" placeholder='Enter Other qualifications' defaultValue={HrTagData?.otherQualifications ? HrTagData?.otherQualifications : ''} onChange={(e) => setHrTagData({ ...HrTagData, otherQualifications: e.target.value })} />
                                                        </div></div>
                                                    <div className="col">
                                                        <div className='input-group'>
                                                            <label className="full-width label-form">Languages
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="SMALSUS" role="tabpanel" aria-labelledby="SMALSUS">
                                <div>
                                    {/* <div className="card-header">
                                        <button className={SmalsusBtnStatus.personalInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "personal-info")}>PERSONAL INFORMATION</button>
                                        <button className={SmalsusBtnStatus.bankInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "bank-info")}>BANK INFORMATION</button>
                                        <button className={SmalsusBtnStatus.taxInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "tax-info")}>TAX INFORMATION</button>
                                        <button className={SmalsusBtnStatus.socialSecurityInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "social-security-info")}>SOCIAL SECURITY INFORMATION</button>
                                        <button className={SmalsusBtnStatus.qualificationInfo ? 'hr-tab-btn-active' : 'hr-tab-btn'} onClick={(e) => changeSmalsusTabBtnStatus(e, "qualification-info")}>QUALIFICATIONS</button>
                                    </div> */}
                                    <ul className="fixed-Header nav nav-tabs" id="myTab" role="tablist">
                                        <button
                                            className="nav-link active"
                                            id="PERSONALIN-FORMATION"
                                            data-bs-toggle="tab"
                                            data-bs-target="#PERSONALINFORMATION"
                                            type="button"
                                            role="tab"
                                            aria-controls="PERSONALINFORMATION"
                                            aria-selected="true">
                                            PERSONAL INFORMATION
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="BANK-INFORMATION"
                                            data-bs-toggle="tab"
                                            data-bs-target="#BANKINFORMATION"
                                            type="button"
                                            role="tab"
                                            aria-controls="BANKINFORMATION"
                                            aria-selected="false">
                                            BANK INFORMATION
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="TAX-INFORMATION"
                                            data-bs-toggle="tab"
                                            data-bs-target="#TAXINFORMATION"
                                            type="button"
                                            role="tab"
                                            aria-controls="TAXINFORMATION"
                                            aria-selected="false">
                                            TAX INFORMATION
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="SOCIALSECURITYIN-FORMATION"
                                            data-bs-toggle="tab"
                                            data-bs-target="#SOCIALSECURITYINFORMATION"
                                            type="button"
                                            role="tab"
                                            aria-controls="SOCIALSECURITYINFORMATION"
                                            aria-selected="false">
                                            SOCIAL SECURITY INFORMATION
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="QUALIFICATIONS-Tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#QUALIFICATIONS"
                                            type="button"
                                            role="tab"
                                            aria-controls="QUALIFICATIONS"
                                            aria-selected="false">
                                            QUALIFICATIONS
                                        </button>
                                    </ul>
                                    <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent" >
                                        <div className="tab-pane show active" id="PERSONALINFORMATION" role="tabpanel" aria-labelledby="PERSONALINFORMATION">
                                            {SmalsusBtnStatus.personalInfo ? <div>
                                                <div className='user-form-4 row'>
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
                                                <div className='user-form-4 row'>
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
                                                    <div className='card-header fw-semibold'>
                                                        Permanent Address
                                                    </div>
                                                    <div className='card-body'>
                                                        <div className='user-form-4 row'>
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
                                                        <div className='user-form-4 row'>

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
                                            </div> : null}</div>
                                        <div className="tab-pane" id="BANKINFORMATION" role="tabpanel" aria-labelledby="BANKINFORMATION">
                                            
                                                <div className="card-body">
                                                    <div className='user-form-2 row'>
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
                                                    <div className='user-form-2 row'>
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
                                                </div></div>
                                        <div className="tab-pane" id="TAXINFORMATION" role="tabpanel" aria-labelledby="TAXINFORMATION">
                                           
                                                <div className="card-body">
                                                    <div className='user-form-3 row'>
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
                                                    <div className='user-form-2 row'>
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
                                               </div>
                                        <div className="tab-pane" id="SOCIALSECURITYINFORMATION" role="tabpanel" aria-labelledby="SOCIALSECURITYINFORMATION">
                                            {SmalsusBtnStatus.socialSecurityInfo ?
                                                <div className="card-body">
                                                    <div className='user-form-2 row'>
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
                                                    <div className='user-form-2 row'>
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

                                                </div> : null}</div>
                                        <div className="tab-pane" id="QUALIFICATIONS" role="tabpanel" aria-labelledby="QUALIFICATIONS">
                                           
                                                <div className='card-body'>
                                                    <div className='user-form-2 row'>
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
                                                    <div className='user-form-2 row'>
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
                                                </div> </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {status.orgPopup ? <OrgContactEditPopup callBack={CloseOrgPopup} updateData={updateData} /> : null}
                    {status.countryPopup ? <CountryContactEditPopup popupName="Country" selectedCountry={currentCountry} callBack={CloseCountryPopup} data={countryData} updateData={updateData} /> : null}
                    {status.statePopup ? <CountryContactEditPopup popupName="State" selectedState={selectedState} callBack={CloseCountryPopup} data={stateData} updateData={updateData} /> : null}
                    
                </div >
                <footer className='bg-f4 fixed-bottom'>
                    <div className='align-items-center d-flex justify-content-between me-3 px-4 py-2'>


                        <div>
                            {console.log("footerdiv")}
                            <div><span className='pe-2'>Created</span><span className='pe-2'> {updateData?.Created ? Moment(updateData?.Created).format("DD/MM/YYYY") : ''}&nbsp;By</span><span><a>{updateData?.Author ? updateData?.Author?.Title : ''}</a></span></div>
                            <div><span className='pe-2'>Last modified</span><span className='pe-2'> {updateData?.Modified ? Moment(updateData?.Modified).format("DD/MM/YYYY") : ''}&nbsp;By</span><span><a>{updateData?.Editor ? updateData?.Editor.Title : ''}</a></span></div>
                            {myContextData2.allSite?.MainSite &&<div className='alignCenter'><span onClick={deleteUserDtl} className="svg__iconbox svg__icon--trash hreflink"></span>Delete this item</div>}
                        </div>

                        <div>

                            {(myContextData2.allSite?.MainSite || myContextData2?.allSite?.HrSite)  && <span>
                                <a className="ForAll hreflink" target="_blank" data-interception="off"                        
                                 href={myContextData2.allSite?.MainSite?`${myContextData2?.allListId?.jointSiteUrl}/SitePages/contact-Profile.aspx?contactId=${updateData.Id}}`:`${myContextData2?.allListId?.siteUrl}/SitePages/EmployeeInfo.aspx?employeeId=${updateData.Id}}`}>
                                    <img className="mb-3 icon_siz19" style={{ marginRight: '3px' }}
                                        src="/_layouts/15/images/ichtm.gif?rev=23" alt="icon" />Go to Profile page
                                </a>
                            </span>}

                            {(myContextData2.allSite?.MainSite || myContextData2?.allSite?.HrSite) && <span>|</span>}
                            {myContextData2.allSite?.MainSite && <span>
                                <a className="ForAll hreflink" target="_blank" data-interception="off"
                                    href={`https://hhhhteams.sharepoint.com/sites/HHHH/SitePages/SmartMetaDataPortfolio.aspx`}>
                                    Manage Contact-Categories
                                </a>
                            </span>}
                            {myContextData2.allSite?.MainSite && <span>|</span>}

                            <a href={`${myContextData2.allSite?.MainSite ? myContextData2?.allListId?.jointSiteUrl : myContextData2?.allListId?.siteUrl}/Lists/Contacts/EditForm.aspx?ID=${updateData?.Id}`} data-interception="off"
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
                {createContractPopup && <CreateContract  callback={callBackData} AllListId={myContextData2?.allListId}updateData={updateData} pageName={props?.pageName} />}
            </Panel>
        </>
    )
}
export default HHHHEditComponent;