import * as React from 'react';
import pnp, { Web } from 'sp-pnp-js';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../../../../../globalComponents/Tooltip';
import ImagesC from '../../../../EditPopupFiles/ImageInformation';
import { myContextValue } from '../../../../../globalComponents/globalCommon'
import HtmlEditorCard from '../../../../../globalComponents/HtmlEditor/HtmlEditor';
import moment from 'moment';
import CountryContactEditPopup from './CountryContactEditPopup';
let JointData:any=[];
const EditInstitutionPopup=(props:any)=>{
    const myContextData2: any = React.useContext<any>(myContextValue)
    const [imagetab, setImagetab] = React.useState(false);
    const [OpenDivision, setOpenDivision] = React.useState(false);
    const [divisionTitle, setDivisionTitle] = React.useState("");
    
    const [URLs, setURLs] = React.useState([]);
    let AllCountryData :any= React.useRef()
    const [countryData, setCountryData] = React.useState([]);
    const [status, setStatus] = React.useState({countryPopup: false });
    const [currentCountry, setCurrentCountry] :any= React.useState([])
    const [updateData, setUpdateData]:any = React.useState({});
    let callBack=props?.callBack;
React.useEffect(()=>{
    getSmartMetaData();
    
},[])

 
const HrGmbhInstitutionDeatails=async(Id:any)=>{
  
    try {
        let web = new Web(myContextData2?.allListId?.siteUrl);
        await web.lists.getById(myContextData2?.allSite?.GMBHSite?myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID:myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID)
            .items.getById(Id)
            .select("Id", "Title", "FirstName", "FullName","About","Description","InstitutionType","SocialMediaUrls", "DOJ","DOE","Company","SmartCountriesId","SmartContactId","SmartInstitutionId", "WorkCity", "Suffix", "WorkPhone", "HomePhone", "Comments", "WorkAddress", "WorkFax", "WorkZip",  "ItemType", "JobTitle", "Item_x0020_Cover", "WebPage",  "CellPhone", "Email", "Created", "SocialMediaUrls","Author/Title", "Modified", "Editor/Title", "Division/Title", "Division/Id", "EmployeeID/Title", "StaffID", "EmployeeID/Id", "Institution/Id", "Institution/FullName", "IM")
            .expand("EmployeeID", "Division", "Author", "Editor",  "Institution")
            .get().then((data:any)=>{
               let tagDivision=[];
              
                let URL: any[] = JSON.parse(data.SocialMediaUrls != null ? data.SocialMediaUrls : ["{}"]);
                setURLs(URL);
                if (data?.SmartCountries?.length > 0) {
                    setCurrentCountry(data.SmartCountries);
                }
                // if (data?.Institution != null && data?.Institution!=undefined) {
                //    setCurrentInstitute(data?.Institution);
                // }
                data.Item_x002d_Image = data?.Item_x0020_Cover;
                if(data?.SmartCountriesId!=undefined){
                    let tagCountry = AllCountryData?.current?.filter((country:any)=> country?.Id==data?.SmartCountriesId[0])
                    data.SmartCountries=tagCountry
                }
                
                if (data?.SmartInstitutionId != undefined) {
                    jointInstitutionDetails(data?.SmartInstitutionId)
                }
                if(myContextData2?.divisionData!=undefined){
                 tagDivision=   myContextData2?.divisionData?.filter((divData:any)=>divData?.Institution!=undefined?divData?.Institution?.Id==data?.Id:divData?.InstitutionId==data?.Id)
                }
                if(tagDivision?.length>0){
                    data.Institution=  tagDivision
                }
                    
              setUpdateData(data)
                 }).catch((error:any)=>{
                console.log(error)
            });
      
       
       
    } catch (error) {
        console.log("Error:", error.message);
    }  
}

    const jointInstitutionDetails = async (id:any) => {
        try {
            
            // let web = new Web(myContextData2?.allListId?.jointSiteUrl);
            let web = new Web(myContextData2?.allListId?.siteUrl);
            await web.lists.getById(myContextData2?.allListId?.HHHHInstitutionListId)
                .items .getById(id)
                .select("Id","Title","FirstName","Description","FullName","WorkPhone","SmartCountries/Id","SmartCountries/Title","Company","JobTitle","About","InstitutionType","SocialMediaUrls","ItemType","WorkCity","ItemImage","WorkCountry","WorkAddress","WebPage","CellPhone","HomePhone","Email","SharewebSites","Created","Author/Id","Author/Title","Modified","Editor/Id","Editor/Title")
                .expand("Author", "Editor","SmartCountries")
              .get().then((data: any) => {
                let tagDivision=[];
                let URL: any[] = JSON.parse(data.SocialMediaUrls != null ? data.SocialMediaUrls : ["{}"]);
                setURLs(URL);
                data.Item_x002d_Image = data?.ItemImage;
                if (data?.SmartCountries?.length > 0) {
                    setCurrentCountry(data.SmartCountries);
                }
                // delete data?.LinkedIn;
                // delete data?.Facebook;
                // delete data?.Twitter;
                // delete data?.Instagram;
                  if(myContextData2?.allSite?.GMBHSite || myContextData2?.allSite?.HrSite){
                    JointData=data;
                  }else{
                    if(myContextData2?.divisionData!=undefined){
                        tagDivision=   myContextData2?.divisionData?.filter((divData:any)=> divData?.Parent?.Id==data?.Id)
                       }
                       if(tagDivision?.length>0){
                           data.Institution=  tagDivision
                       }
                    setUpdateData(data);
                  }
                   }).catch((error: any) => {
                    console.log(error)
                });

        } catch (error) {
            console.log("Error:", error.message);
        }

    }
 
      const openCountry = (item: any) => {
        setStatus({
            ...status, 
            countryPopup: true,
            
        })
    }
    const onRenderCustomHeaderEditInstitution = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                <img className='workmember' 
                    src={updateData?.ItemImage != undefined ? updateData?.ItemImage.Url : `${myContextData2?.allListId?.siteUrl}/SiteCollectionImages/ICONS/32/InstitutionPicture.jpg`}
                     />
                Edit Institution- {updateData?.FullName}
                     
                </div>
                <Tooltip ComponentId='626' />
            </>
        );
    };
    const onRenderCustomHeaderDivision = () => {
        return (
            <>
                <div className='subheading alignCenter'>
                   Add  Division  
                      
                </div>
                <Tooltip ComponentId='1064' />
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

    const HtmlEditorCallBack = (items: any) => {
        console.log(items);
        var description = ""
        if (items == '<p></p>\n') {
          description = ""
        } else {
          description = items
        }
        setUpdateData({ ...updateData, Description: description })
      }

    const   HtmlEditorCallBackAbout=(items:any)=>{
        console.log(items);
        var About = ""
        if (items == '<p></p>\n') {
            About = ""
        } else {
            About = items
        }
        setUpdateData({ ...updateData, About: About })
      } 
    
 //*******************Delete function***************************  */
 const deleteUserDtl = async () => {
    try {
        if (confirm("Are you sure, you want to delete this?")) {
             if(myContextData2?.allSite?.MainSite){
                
                // let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                let web = new Web(myContextData2?.allListId?.siteUrl);
                await web.lists.getById(myContextData2?.allListId?.HHHHInstitutionListId).items.getById(myContextData2?.allSite?.GMBHSite||myContextData2?.allSite?.HrSite?JointData?.Id:updateData?.Id).recycle().then(async(data:any)=>{
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



 //*****************Save for Joint,GMBH Data Update***************************************** */
 const UpdateDetails = async () => {
    let urlData: any;
    if(updateData?.WebPage!=undefined){
        let spliceString = updateData?.WebPage?.Description?.slice(0, 8)
        if (spliceString == "https://") {
            urlData = updateData?.WebPage?.Description;
        } else {
            urlData = "https://" + updateData?.Description;
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
            FullName: (updateData?.FullName ),
          Categories:updateData?.Categories,
            Email: (updateData?.Email ),
            WorkPhone: (updateData?.WorkPhone ),
            CellPhone: (updateData?.CellPhone ),
           InstitutionType:updateData?.InstitutionType,
            WorkCity: (updateData?.WorkCity),
            WorkAddress: (updateData?.WorkAddress),
            Description:updateData?.Description,
            About:updateData?.About,
            WebPage: {
                "__metadata": { type: "SP.FieldUrlValue" },
                Description: updateData?.WebPage ? urlData : (updateData?.WebPage ? updateData?.WebPage?.Url :null),
                Url: updateData?.WebPage ? urlData : (updateData?.WebPage ? updateData?.WebPage.Url :null)
            },
            // ItemImage:{
            //     "__metadata": { type: "SP.FieldUrlValue" },
            //     Description: updateData?.Item_x002d_Image!=undefined ? updateData?.Item_x002d_Image?.Url : (updateData?.Item_x0020_Cover!=undefined?updateData?.Item_x0020_Cover?.Url:""),
            //     Url: updateData?.Item_x002d_Image!=undefined ? updateData?.Item_x002d_Image?.Url : (updateData?.Item_x0020_Cover!=undefined?updateData?.Item_x0020_Cover?.Url:"")
            // },
            WorkZip: (updateData?.WorkZip ),
           
            SocialMediaUrls: JSON.stringify(UrlData),
            SmartCountriesId: {
                results:updateData?.SmartCountries?.length>0?[updateData?.SmartCountries[0]?.Id ]: []
            }
        }
        if (updateData?.Id != undefined) {
            
            // let web = new Web(myContextData2?.allListId?.jointSiteUrl);
            let web = new Web(myContextData2?.allListId?.siteUrl);
            await web.lists.getById(myContextData2?.allListId?.HHHHInstitutionListId).items.getById(myContextData2?.allSite?.GMBHSite||myContextData2?.allSite?.HrSite?JointData?.Id:updateData?.Id).update(postData).then((e) => {
                console.log("Your information has been updated successfully");
           if(myContextData2.allSite?.GMBHSite){
            UpdateGmbhDetails(postData);
           
           }
           else if(myContextData2.allSite?.HrSite){
            updateHrDetails(postData)
           }
           else{
            callBack();
           }
          });
         
        }
       } catch (error) {
        console.log("Error:", error.message);
    }
    // if (updateData?.Site?.toString().search("HR") >= 0) {
    //     // updateHrDetails();
    //     callBack();
    // }

   

}

//*****************save function End *************** */
const updateHrDetails = async (postData: any) => {
    let web = new Web(`${myContextData2?.allListId?.siteUrl}/hr`);
        await web.lists.getById(myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID).items.getById(updateData.Id).update(postData).then((e: any) => {
            console.log("request success", e);
            callBack();
        }).catch((error: any) => {
            console.log(error)
        })
    }


const UpdateGmbhDetails = async (postData: any) => {
let web = new Web(`${myContextData2?.allListId?.siteUrl}/GmBH`);
    await web.lists.getById(myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID).items.getById(updateData.Id).update(postData).then((e: any) => {
        console.log("request success", e);
        callBack();
    }).catch((error: any) => {
        console.log(error)
    })
}

const CreateDivision= async()=>{
    let Key: any =divisionTitle;
    let subString = Key.split(" ");
    let lastName=""
    let FirstName=""
    if(subString.length>0){
        lastName=subString.length==2?subString[1]:""
         FirstName=subString[0]
    }
    try {
        let jointData:any
        let localData:any
            if (myContextData2?.allSite?.GMBHSite || myContextData2?.allSite?.HrSite) {
                localData= {
                    
                Title: divisionTitle ,
                FirstName: FirstName,
                FullName: FirstName + " " + lastName,
                ItemType: "Division",
                InstitutionId:updateData?.Id
                
            } 
            jointData= {
                SharewebSites: {
                    results: (myContextData2?.allSite?.GMBHSite?["GMBH"]:["HR"])
                },
                Site: {
                    results: (myContextData2?.allSite?.GMBHSite?["GMBH"]:["HR"])
                },
                Title: divisionTitle ,
                FirstName: FirstName,
                FullName: FirstName + " " + lastName,
                ItemType: "Division",
                ParentId:updateData?.SmartInstitutionId
            }  
            }else{
                jointData= {
                    
                    Title: divisionTitle ,
                    FirstName: FirstName,
                    FullName: FirstName + " " + lastName,
                    ItemType: "Division",
                    ParentId:updateData?.Id
                    
                } 
            }
            
            let tagdiv= updateData?.Institution
            if(tagdiv==undefined){
                tagdiv=[]
            }
           let copydivsion:any=myContextData2?.divisionData;
    if (myContextData2?.allSite?.GMBHSite || myContextData2?.allSite?.HrSite) {
                let web = new Web(myContextData2?.allListId?.siteUrl);
                await web.lists.getById(myContextData2?.allSite?.GMBHSite ? myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID : myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID)
                .items.add(localData).then((newData) => {
                    console.log("local institution also done")
                    newData.data.Parent={
                       Id: newData?.data?.ParentId
                    } 
                    tagdiv.push(newData?.data)
                   
                    myContextData2?.setDivisionData(copydivsion)
                 
                  setUpdateData({...updateData,Institution:tagdiv})
                    setOpenDivision(false)
                    
                }).catch((error: any) => {
                console.log(error)
                })
            } else {
                
                // let web = new Web(myContextData2?.allListId?.jointSiteUrl);
                let web = new Web(myContextData2?.allListId?.siteUrl);
           await web.lists.getById(myContextData2?.allListId?.HHHHInstitutionListId).items.add(jointData ).then(async (data) => {
            console.log("joint institution post sucessfully", data)
            data.data.Parent={
                Id: data?.data?.ParentId
             } 
            tagdiv.push(data?.data)
                    copydivsion.push(data?.data)
            myContextData2?.setDivisionData(copydivsion)
         setUpdateData({...updateData,Institution:tagdiv})
                setOpenDivision(false)
                console.log("request success");
            })
            }

        
    } catch (error) {
        console.log("eeeorCreate Institution", error.message)
    }
    
}

//***********samrt Meta data call function To get The country data ********************* */
const getSmartMetaData = async () => {
    let countryData:any=[];
    try {
        
        // let web = new Web(myContextData2?.allListId?.jointSiteUrl);
        let web = new Web(myContextData2?.allListId?.siteUrl);
        let data = await web.lists.getById(myContextData2?.allListId?.MAIN_SMARTMETADATA_LISTID)
            .items.top(4999).get()
        data.map((item: any, index: any) => {
            // let countryData:any=[];
            // let stateData:any=[];
            if (item.TaxType == "Countries") {
                countryData.push(item)
               
            }
            
        })
        AllCountryData.current= countryData;
        setCountryData(countryData);
        if(myContextData2.allSite?.MainSite){
    
            jointInstitutionDetails(props.props.Id);
            }
            else{
                HrGmbhInstitutionDeatails(props?.props?.Id)
            }
        // setStateData(stateData);
    } catch (error) {
        console.log("Error:", error.message);
    }

}
//************samrt Meta  End function ************* */
const CloseCountryPopup = React.useCallback((data:any) => {
    setStatus({ ...status, countryPopup: false })
    // setCountryPopup(false);
    if(data!=undefined){
        setUpdateData(data);
    }
}, []);


const DeleteDivision= async(divisiondetails:any)=>{
let copyDivision=myContextData2.divisionData
let filterDivision:any
    let copyInstitutionData=updateData
    if( copyInstitutionData?.Institution?.length==1){
        copyInstitutionData.Institution=[]
    }else if( copyInstitutionData?.Institution?.length>1){
        copyInstitutionData?.Institution?.filter((division:any)=>division?.Id!=divisiondetails?.Id)
    }
     setUpdateData(copyInstitutionData);
    if( myContextData2?.divisionData!=undefined){
        filterDivision = copyDivision?.filter((divData:any)=>divData?.Id!=divisiondetails?.Id)
        myContextData2?.setDivisionData(filterDivision)
    //  myContextData2.divisionData=[...filterDivision]
   
      }
     let web = new Web(myContextData2?.allListId?.siteUrl);
    await web.lists.getById(myContextData2.allSite?.MainSite?myContextData2?.allListId?.HHHHInstitutionListId:myContextData2.allSite?.HrSite?myContextData2?.allListId?.HR_EMPLOYEE_DETAILS_LIST_ID:myContextData2?.allListId?.GMBH_CONTACT_SEARCH_LISTID).items.getById(divisiondetails?.Id).recycle().then(async (data: any) => {
        console.log("request success", data);

        setUpdateData((prevData:any) => ({ ...prevData }));
      

       
     
    }).catch((error: any) => {
        console.log(error)
    })
   
}
return(
    <>
      <Panel onRenderHeader={onRenderCustomHeaderEditInstitution}
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
                                aria-selected="true">IMAGE INFORMATION
                                </button>

                                <button className="nav-link"
                                id="Division-Tab"
                                data-bs-toggle="tab"
                                data-bs-target="#Division "
                                type="button"
                                role="tab"
                                aria-controls="Division "
                               
                                aria-selected="true">Division 
                                </button>
                           
 
                        </ul>

                       
                        <div className="border border-top-0 clearfix p-3 tab-content " id="myTabContent">
                            <div className="tab-pane show active" id="BASICINFORMATION" role="tabpanel" aria-labelledby="BASICINFORMATION">
                                <div className='general-section'>
                                    <div className="card-body">
                                            <div className="user-form-5 row">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className='full-width label-form'>Title </label>
                                                        <input type="text" className="form-control" defaultValue={updateData ? updateData?.FullName : null} onChange={(e) => setUpdateData({ ...updateData, FullName: e.target.value })} aria-label="full name" placeholder='full Name' />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Email</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.Email ? updateData?.Email : ""}
                                                            onChange={(e) => setUpdateData({ ...updateData, Email: e.target.value })} aria-label="Email" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form"> Categories</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.Categories} onChange={(e) => setUpdateData({ ...updateData, Categories: e.target.value })} aria-label="Last name" placeholder='Last name' />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">City</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.WorkCity ? updateData?.WorkCity : ''} onChange={(e) => setUpdateData({ ...updateData, WorkCity: e.target.value })} aria-label="City" />
                                                    </div></div>
                                               
                                               

                                            </div>
                                            <div className="card-body">
                                            <div className="user-form-4 row">
                                                  <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Country</label>
                                                            
                                                           {updateData?.SmartCountries?.length>0?<div className="block wid90 alignCenter">
                                                                <a className="hreflink" target="_blank">{updateData?.SmartCountries?.[0]?.Title}</a>
                                                                <span
                                                                    onClick={() => setUpdateData({...updateData, SmartCountries: undefined})}
                                                                    className="bg-light ml-auto svg__icon--cross svg__iconbox"></span>
                                                            </div>:<input type='text'></input>} 
                                                            
                                                            <span className="input-group-text" title="Smart Category Popup">
                                                                <span onClick={() => openCountry(updateData?.SmartCountries)}className="svg__iconbox svg__icon--editBox"></span>
                                                            </span></div>
                                                </div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Address</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.WorkAddress ? updateData?.WorkAddress : ''} onChange={(e) => setUpdateData({ ...updateData, WorkAddress: e.target.value })} aria-label="Address" />
                                                    </div></div>

                                                    <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Institution Type</label>

                                                        <input className="form-control" type="text" defaultValue={updateData?.InstitutionType ? updateData?.InstitutionType : ""} onChange={(e) => setUpdateData({ ...updateData, InstitutionType: e.target.value })} aria-label="InstitutionType" />
                                                    </div>
                                                </div>
                                                    <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Website</label>

                                                        <input className="form-control" type="text" defaultValue={updateData?.WebPage ? updateData?.WebPage.Url : ""} onChange={(e) => setUpdateData({ ...updateData, WebPage: e.target.value })} aria-label="WebPage" />
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="user-form-5 row">
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Phone</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.WorkPhone ? updateData?.WorkPhone : ''} onChange={(e) => setUpdateData({ ...updateData, WorkPhone: e.target.value })} aria-label="Business Phone" />
                                                    </div></div>
                                                <div className="col">
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Primary Contact</label>
                                                        <input type="text" className="form-control" defaultValue={updateData?.CellPhone ? updateData?.CellPhone : ''} onChange={(e) => setUpdateData({ ...updateData, CellPhone: e.target.value })} aria-label="Mobile-No" />
                                                    </div></div>
                                                    <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">LinkedIn</label>
                                                        <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].LinkedIn : ""} aria-label="LinkedIn"
                                                            onChange={(e) => setUpdateData({ ...updateData, LinkedIn: e.target.value })} />
                                                    </div>
                                                </div>
                                            <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Facebook</label>
                                                        <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].Facebook : ""} onChange={(e) => setUpdateData({ ...updateData, Facebook: e.target.value })} aria-label="Facebook" />
                                                    </div></div>
                                              </div>
                                            <div className="user-form-5 row mt-2">
                                              
                                            <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Instagram</label>
                                                        <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].Instagram : ''}
                                                            onChange={(e) => setUpdateData({ ...updateData, Instagram: e.target.value })} aria-label="Instagram" />
                                                    </div></div>
                                                
                                            <div className="col" >
                                                    <div className='input-group'>
                                                        <label className="full-width label-form">Twitter</label>
                                                        <input type="text" className="form-control" defaultValue={URLs.length ? URLs[0].Twitter : ""}
                                                            onChange={(e) => setUpdateData({ ...updateData, Twitter: e.target.value })} aria-label="Twitter" />
                                                    </div>
                                                </div>
                                              
                                            </div>
                                        </div>

                                        <div className="card-body">
                                         <div className="col" >
                                              <div className='input-group'>
                                                  <label className="full-width label-form">Internal Notes</label>
                                                 {updateData?.Id!=undefined ? <HtmlEditorCard editorValue={updateData?.Description != null ? updateData?.Description : ""} HtmlEditorStateChange={HtmlEditorCallBack}/>:null }                     
                                              </div></div>
                                         </div>

                                  <div className="card-body">
                                       <div className="col" >
                                             <div className='input-group'>
                                                 <label className="full-width label-form">About (public information)</label>
                                                 {updateData?.Id!=undefined && <HtmlEditorCard editorValue={updateData?.About != null ? updateData?.About : ""} HtmlEditorStateChange={HtmlEditorCallBackAbout}/> }                     
                                             </div></div>
                                        </div> </div>
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
                             <div className="tab-pane" id="Division" role="tabpanel" aria-labelledby="Division">
                             <span  title="Add Division"className="svg__iconbox svg__icon--Plus mini hreflink" onClick={()=>setOpenDivision(true)}></span>
                             {updateData?.Institution?.length>0?updateData?.Institution?.map((division:any)=>{
                                return(
                                    <div className='col-sm-12'>
                                    <div className='col-sm-4 block'>
                                        <a className='wid90'>{division?.Title}</a>
                                        <span className='svg__iconbox svg__icon--cross light ml-auto clearfix'onClick={()=>DeleteDivision(division)} ></span>
                                    </div>
                                 </div>
                                )
                               
                             }):null}

                            </div>
                            
                            </div>



                            <footer className='bg-f4 fixed-bottom'>
                    <div className='align-items-center d-flex justify-content-between me-3 px-4 py-2'>
                        <div>
                            {console.log("footerdiv")}
                            <div><span className='pe-2'>Created</span><span className='pe-2'> {updateData?.Created ? moment(updateData?.Created).format("DD/MM/YYYY") : ''}&nbsp;By</span><span><a>{updateData?.Author ? updateData?.Author?.Title : ''}</a></span></div>
                            <div><span className='pe-2'>Last modified</span><span className='pe-2'> {updateData?.Modified ? moment(updateData?.Modified).format("DD/MM/YYYY") : ''}&nbsp;By</span><span><a>{updateData?.Editor ? updateData?.Editor.Title : ''}</a></span></div>
                            <div className='alignCenter'><span 
                            onClick={deleteUserDtl}
                             className="svg__iconbox svg__icon--trash hreflink"></span>Delete this item</div>
                        </div>

                        <div>
                           {myContextData2.allSite?.MainSite && <span>
                                <a className="ForAll hreflink" target="_blank" data-interception="off"
                                    // href={`${myContextData2.allSite?.MainSite?myContextData2?.allListId?.jointSiteUrl:myContextData2?.allListId?.siteUrl}/SitePages/contact-Profile.aspx?contactId=${updateData.Id}`}>
                                    href={`${myContextData2.allSite?.MainSite?myContextData2?.allListId?.siteUrl:myContextData2?.allListId?.siteUrl}/SitePages/contact-Profile.aspx?contactId=${updateData.Id}`}>

                                    <img className="mb-3 icon_siz19" style={{ marginRight: '3px' }}
                                        src="/_layouts/15/images/ichtm.gif?rev=23" alt="icon" />Go to Profile page
                                </a>
                            </span>}
                            {myContextData2.allSite?.MainSite && <span>|</span>}
                          {/* <a href={`${myContextData2.allSite?.MainSite?myContextData2?.allListId?.jointSiteUrl:myContextData2?.allListId?.siteUrl}/Lists/Institutions/EditForm.aspx?ID=${updateData?.Id}`}  data-interception="off" */}
                          <a href={`${myContextData2.allSite?.MainSite?myContextData2?.allListId?.siteUrl:myContextData2?.allListId?.siteUrl}/Lists/Institutions/EditForm.aspx?ID=${updateData?.Id}`}  data-interception="off"

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
                    </div>  
                    </div>

                    {status.countryPopup ? <CountryContactEditPopup popupName="Country" siteurl={props?.siteurl}
                    selectedCountry={currentCountry} 
                    callBack={CloseCountryPopup} data={countryData} updateData={updateData} /> : null}


            </Panel>
            <Panel onRenderHeader={onRenderCustomHeaderDivision}
                isOpen={OpenDivision}
                type={PanelType.custom}
                customWidth="560px"
                onDismiss={()=>setOpenDivision(false)}
                isBlocking={false}
             >
                <div className='modal-body'>
                    <div className='input-group'>
                        <input type='text' className='form-control' onChange={(e)=>setDivisionTitle(e.target.value)}></input>
                    </div>
                </div>
        
        <div className='modal-footer mt-2 p-0'>
              <button className='btn btn-primary mx-2' onClick={()=>CreateDivision()}>
                Save
              </button>
              <button className='btn btn-default' onClick={()=>setOpenDivision(false)}>
                Cancel
              </button>
            </div>

      </Panel>
      
    </>
)
}
export default  EditInstitutionPopup
