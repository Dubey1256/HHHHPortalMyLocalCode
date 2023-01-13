import * as React from "react";
import { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Web } from 'sp-pnp-js';
const CreateContact = (props: any) => {
    console.log(props);
   
    const [show, setShow] = useState(true);
   
    const[searchData,setSearchData]=useState([]);
    const[allContact,setAllContact]=useState([]);
    const [isvisible, setisvisible] = useState(false);
    const [isUserExist, setuserExits] = useState(true);
    const[contactNumber,setContactNumber]=useState();
    const[contactStaffId,setContactStaffId]=useState("");
    const [fullName, setFullName] = useState("");
   
    console.log(setShow);
    const handleClose = () =>{
        props.callBack();
    } 
    useEffect(()=>{
        geData();
        createContactStaffId();
       
      },[])  
      const geData=async()=>{
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH');
         await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a').items .select("Id", "Title", "FirstName", "FullName", "Department", "Company", "WorkCity", "Suffix","WorkCountry", "WorkPhone", "HomePhone", "Comments", "WorkAddress", "WorkFax","Office", "WorkZip", "Site", "ItemType", "JobTitle", "Item_x0020_Cover", "WebPage", "Site","EmployeeIDId", "CellPhone", "Email", "LinkedIn", "Created", "SocialMediaUrls", "SmartCountries/Title", "SmartCountries/Id", "Author/Title", "Modified", "Editor/Title", "Division/Title", "Division/Id", "EmployeeID/Title", "StaffID", "EmployeeID/Id", "Institution/Id", "Institution/FullName","IM")
         .expand("EmployeeID", "Division", "Author", "Editor", "SmartCountries", "Institution")
         .orderBy("Created", true)
         .get()
         .then((Data: any[])=>{
            console.log(Data);
            setSearchData(Data);
            setAllContact(Data);
         }) 
         .catch((err) => {
               console.log(err.message);
            });
         }
    const searchFun=(e:any)=>{
        setisvisible(true);
        var key= e.target.value;
      
        setFullName(key);
        const filterdata=allContact.filter((items: any) =>
                items.FullName?.toLowerCase().includes(key)
            )
          setSearchData(filterdata);
          
          if (key.length == 0) {
            setSearchData(allContact);
            setisvisible(false);
        }
        if (filterdata.length == 0) {
   
       
            console.log("data not found");
            setuserExits(false);
        }
     }
     
     const newUserCreate=async()=>{
      var ItemType="";
      if(props.tableStatus==true){
        ItemType="Contact";
      }
      else if(props.tableStatus==true){
        ItemType="Institution";
      }
      console.log(isUserExist);
      if(isUserExist==false){
        const web = new Web(
          'https://hhhhteams.sharepoint.com/sites/HHHH'
         );
         await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a').items.add(
                {
                  Title: fullName.split(" ")[1],
                  FirstName:fullName.split(" ")[0],
                  FullName:fullName,
                  ItemType:ItemType,
                  Site: {
                      results:["HR"]
                  }
                }
          )
         .then(async(res:any)=>{
          console.log(res);
          setisvisible(false);
         await postHrDetailsList(res.data);
         await postLocalData(res.data);
      }) 
      .catch((err) => {
        console.log(err.message);
     });

   }
     }


     const postLocalData=async(selecteditems:any)=>{
      const web = new Web(
        'https://hhhhteams.sharepoint.com/sites/HHHH/HR'
       );
       await web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.add(
              {    
                
                FirstName: selecteditems.FirstName,
                FullName: selecteditems.FullName,
                CellPhone: selecteditems.CellPhone,
                Company: selecteditems.Company,
                Email: selecteditems.Email,
                JobTitle: selecteditems.JobTitle,
                WorkCity: selecteditems.WorkCity,
                WorkCountry: selecteditems.WorkCountry,
                Suffix: selecteditems.Suffix,
                WorkPhone: selecteditems.WorkPhone,
                 HomePhone: selecteditems.HomePhone,
                WorkZip: selecteditems.WorkZip,
                Office: selecteditems.Office,
                Comments: selecteditems.Comments,
                WorkAddress: selecteditems.WorkAddress,
                WorkFax: selecteditems.WorkFax,
                staffID0:contactNumber,
                StaffID:contactStaffId,
                // InstitutionId: $scope.SelectedItem.Institution.Id,
                IM: selecteditems.IM,
                WebPage: selecteditems.WebPage,
                SmartCountriesId: { "results":selecteditems.smartCountryId!=undefined?selecteditems.smartCountryId:[]},
                Title:selecteditems.Title,
                SmartContactId: selecteditems.Id,
                ItemType: selecteditems.ItemType,
                EmployeeIDId: selecteditems.EmployeeIDId != undefined ? selecteditems.EmployeeIDId : null,
                Item_x0020_Cover: selecteditems.Item_x0020_Cover,
                SocialMediaUrls: selecteditems.SocialMediaUrls,
              }
        )
       .then(async(res:any)=>{
        console.log(res);
        await handleClose();

       })
       .catch((err) => {
        console.log(err.message);
     });

     }

     const postHrDetailsList= async(selecteditems:any)=>{
      
      const web = new Web(
        'https://hhhhteams.sharepoint.com/sites/HHHH'
       );
       await web.lists.getById('6DD8038B-40D2-4412-B28D-1C86528C7842').items.add(
              {
                SmartContactId:selecteditems.Id
              }
        )
       .then((res:any)=>{
        console.log(res);
       })
        .catch((err) => {
          console.log(err.message);
       });
     }


     


       const createContactStaffId=async()=>{
        var contactNumber:any;
        var contactId:any;
        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
        await web.lists.getById('A7B80424-E5E1-47C6-80A1-0EE44A70F92C').items.select("Id,Title,staffID0,ItemType").filter("ItemType eq'Contact'").orderBy("staffID0",false).top(1).get()
        .then((Data: any[])=>{
          
          var contactNumberlength:any;
         
          console.log("contract list data ",Data);
          if(Data!=undefined&& Data.length>0){
            
            contactNumber=Data[0].staffID0+1;
        var Contactlength= contactNumber.toString();
            contactNumberlength=Contactlength.length;
            console.log("length of contract number ",contactNumberlength);
            setContactNumber(contactNumber) ;
          } 
          if(Data==undefined|| Data.length==0){
            contactNumber=1;
            var Contactlength= contactNumber.toString();
            contactNumberlength=Contactlength.length;
            setContactNumber(contactNumber) ;
          }
          if(contactNumberlength==0&&contactNumberlength==""){
            contactId="HHHH"+"-"+"0000"+contactNumber;
            setContactStaffId(contactId) ;
          }
          
          else if(contactNumberlength==1 && contactNumberlength>0 && contactNumberlength!="" && contactNumberlength!=undefined){
            contactId="HHHH"+"-"+"0000"+contactNumber;
            setContactStaffId(contactId) ;
          }
         else  if(contactNumberlength==2 && contactNumberlength>0&&contactNumberlength!="" && contactNumberlength!=undefined){
             contactId="HHHH"+"-"+"000"+contactNumber;
             setContactStaffId(contactId) ;
          }
          else  if(contactNumberlength==3 && contactNumberlength>0&&contactNumberlength!="" && contactNumberlength!=undefined){
            contactId="HHHH"+"-"+"00"+contactNumber;
            setContactStaffId(contactId) ;
          }
          else  if(contactNumberlength==4 && contactNumberlength>0&&contactNumberlength!="" && contactNumberlength!=undefined){
           contactId="HHHH"+"-"+"0"+contactNumber;
           setContactStaffId(contactId) ;
          }
        
        
        }) 
        .catch((err) => {
              console.log(err.message);
           });

       }

      const updateSite=async(selecteditems:any,siteconfirmation:any,siteArray:any)=>{
        if(siteconfirmation==true){
        const web = new Web(
          'https://hhhhteams.sharepoint.com/sites/HHHH'
         );
         await web.lists.getById('edc879b9-50d2-4144-8950-5110cacc267a').items.getById(selecteditems.Id).update(
                {
                  Site: {
                      results:siteArray
                  }
                }
          )
         .then(async(res:any)=>{
          console.log(res);
          setisvisible(false);
          alert(" HR Site Tagged");

          //Hr Details list post smartcontact
       
            // const web = new Web(
            //   'https://hhhhteams.sharepoint.com/sites/HHHH'
            //  );
            //  await web.lists.getById('6DD8038B-40D2-4412-B28D-1C86528C7842').items.add(
            //         {
            //           SmartContactId:selecteditems.Id
            //         }
            //   )
            //  .then(async(res:any)=>{
            //   console.log(res);
           await postHrDetailsList(selecteditems)
             await postLocalData(selecteditems)
              //add data in employeeDetails on Hr site 
             
            //   console.log(contactNumber)
              
            //   console.log(contactStaffId)
            // const web = new Web(
            //     'https://hhhhteams.sharepoint.com/sites/HHHH/HR'
            //    );
            //    await web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.add(
            //           {    
                        
            //             FirstName: selecteditems.FirstName,
            //             FullName: selecteditems.FullName,
            //             CellPhone: selecteditems.CellPhone,
            //             Company: selecteditems.Company,
            //             Email: selecteditems.Email,
            //             JobTitle: selecteditems.JobTitle,
            //             WorkCity: selecteditems.WorkCity,
            //             WorkCountry: selecteditems.WorkCountry,
            //             Suffix: selecteditems.Suffix,
            //             WorkPhone: selecteditems.WorkPhone,
            //              HomePhone: selecteditems.HomePhone,
            //             WorkZip: selecteditems.WorkZip,
            //             Office: selecteditems.Office,
            //             Comments: selecteditems.Comments,
            //             WorkAddress: selecteditems.WorkAddress,
            //             WorkFax: selecteditems.WorkFax,
            //             staffID0:contactNumber,
            //             StaffID:contactStaffId,
            //             // InstitutionId: $scope.SelectedItem.Institution.Id,
            //             IM: selecteditems.IM,
            //             WebPage: selecteditems.WebPage,
            //             SmartCountriesId: { "results":selecteditems.smartCountryId!=undefined?selecteditems.smartCountryId:[]},
            //             Title:selecteditems.Title,
            //             SmartContactId: selecteditems.Id,
            //             ItemType: selecteditems.ItemType,
            //             EmployeeIDId: selecteditems.EmployeeIDId != undefined ? selecteditems.EmployeeIDId : null,
            //             Item_x0020_Cover: selecteditems.Item_x0020_Cover,
            //             SocialMediaUrls: selecteditems.SocialMediaUrls,
            //           }
            //     )
            //    .then(async(res:any)=>{
            //     console.log(res);
  
            //    })
            //    .catch((err) => {
            //     console.log(err.message);
            //  });

          //    })
          //    .catch((err) => {
          //     console.log(err.message);
          //  });
           await handleClose();
        })
         .catch((err) => {
           console.log(err.message);
        })};
         
       }
      const checkProfile=async(selecteditems:any)=>{
       var siteArray:any=[];
       var siteconfirmation=false;
  
    if(selecteditems.Site!=undefined){
      selecteditems.Site.map(async(item:any,index:any)=>{
         var itemsite=item.toLowerCase();
            if(itemsite=="hr"){
                //open edit popup....
               }
              else if(itemsite=='gmbh'){
                if(itemsite=='gmbh'){
                    siteArray.push("HR","GMBH")
                  }
                  confirm("are you want to tag   HR site ")?siteconfirmation=true:siteconfirmation=false;
              await updateSite(selecteditems,siteconfirmation,siteArray)
                   
                 }
                }
        )
    }
    else if(selecteditems.Site==undefined){
      siteArray.push("HR");
      confirm("are you want to tag   HR site ")?siteconfirmation=true:siteconfirmation=false;
              
      await updateSite(selecteditems,siteconfirmation,siteArray)
    }
       
       
         }
return(
    <div>
       <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header >
          <Modal.Title>Create Contact</Modal.Title>
          <span  onClick={handleClose}>x</span>
        </Modal.Header>
        <Modal.Body>
         <input type ="text"  placeholder="search name"onChange={(e)=>searchFun(e)}></input>
     {isvisible?<div>  <ul className="list-group">
        {
               searchData.map((item:any,index:any)=>{
                return(
                    <>
                 <li className="list-group-item"value={item.FullName} onClick={() => checkProfile(item)} >{item.FullName}</li>
                   </>
                )
               
             })
            }
           </ul></div>:null}
      
         
     
   
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary"onClick={newUserCreate}>save</Button>
        </Modal.Footer>
      </Modal>
    </div>
)
}
export default  CreateContact;