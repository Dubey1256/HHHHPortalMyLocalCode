import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import './createcontact.css'
import { useState,useEffect } from "react";
import {Web} from "sp-pnp-js";
import Modal from 'react-bootstrap/Modal';
import { Col,Form,Row,Button } from "react-bootstrap";
const CreateContract=(prop:any)=>{
    const [show, setShow] = useState(prop.prop);
    const [contractTypepopup, setcontractTypepopup] = useState(false);
    const [ContactDetailspopup, setContactDetailspopup] = useState(false);
    const[Titlecontract,setTitlecontract]=useState("");
    const[checkContractitem,setcheckContractitem]=useState("");
    const[checkContactitem,setcheckContactitem]=useState("");
    const[ContactDetailsItem,setContactDetailsitem]=useState("");
    const[contractTypeItem,setcontractTypeItem]=useState("");
    const [contractTypeId, setcontractTypeId] = useState();
    const [contactDetailsId, setcontactDetailsId] = useState();
    const [contractTypeSuffix, setcontractTypeSuffix] = useState("");
    const [smarttaxonomy, setSmarttaxonomy] = useState([]);
    const[ContactsDetails,setContactsDetails]=useState([]);

    const handleClose = () =>{
      prop.callback();
     setShow(false);
       } 
    
       const poupcloseContractType=(item:any)=>{
        if(item=="contract"){
          setcontractTypepopup(false);
        }
        else if(item=="contact"){
          setContactDetailspopup(false);
        }
       
       }
          useEffect(()=>{
      LoadSmartTaxonomy();
      loadContactDetails();
          },[])
    const LoadSmartTaxonomy=async()=>{
      const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
       await web.lists.getById("63CAE346-409E-4457-B996-85A788074BCE").items.select("Id,Title,TaxType,Suffix").get()
       .then((Data: any[])=>{
         console.log("smart metadata",Data);
         let smarttaxonomyArray:any=[];
         Data.map((item,index)=>{
          if(item.TaxType!=undefined&& item.TaxType!=null){
            if (item.TaxType == 'Contract'){
              smarttaxonomyArray.push(item);
            }
          }
          
         })
      
         setSmarttaxonomy(smarttaxonomyArray);
         
       }) 
       .catch((err) => {
             console.log(err.message);
          });
         }
        const loadContactDetails=async()=>{
          const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
          await web.lists.getById('a7b80424-e5e1-47c6-80a1-0ee44a70f92c').items.select("Id,Title,ItemType,FirstName,FullName,Company,JobTitle,Item_x0020_Cover,EmployeeID/Title,StaffID,EmployeeID/Id").expand("EmployeeID").orderBy("Created",true).get()
          .then((Data: any[])=>{
            console.log(Data);
            var employecopyData:any=[];
            Data.map((item,index)=>{
              if(item.ItemType!=undefined&& item.ItemType!=""){
                    if(item.ItemType=="Contact"){
                      employecopyData.push(item);
                    }
              }
            })
            setContactsDetails(employecopyData);
       
            }) 
          .catch((err) => {
                console.log(err.message);
             });
        }
      
      
        const openContractTypepopup=(item:any)=>{
          setcontractTypepopup(true);
       }
       const openEmployeeDetailspopup=()=>{
        setContactDetailspopup(true); 
       }
       
       const saveContractType=(checkitem:any,type:any)=>{
          if(checkitem!=undefined&& checkitem!=""&& type==="contract"){
            smarttaxonomy.map ((items,index)=>{
              if(items.Title===checkitem){
                setcontractTypeId(items.Id);
            
                setcontractTypeSuffix(items.Suffix);
              }
           
            })
            setcontractTypeItem(checkitem);
            poupcloseContractType("contract");
           }
           else if(checkitem!=undefined&& checkitem!=""&&type==="contact"){
            ContactsDetails.map((items,index)=>{
              if(items.FullName===checkitem){
                setcontactDetailsId(items.Id);
                
             }
            })
              setContactDetailsitem(checkitem)
            poupcloseContractType("contact");
           }
         }
         console.log("contractType Id:",contractTypeId);
         console.log("contract type suffix",contractTypeSuffix);
         console.log("employename hhhhstaff Id:",contactDetailsId);

        
         const createnewcontract = async () => {
       
          var contractNumber:any;
          var contractId:any;
          console.log("contractType Id:",contractTypeId);
          console.log("contractType Id:",contractTypeItem);
          if(contractTypeItem!=undefined&& contractTypeItem!=""){
            const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/HR');
            await web.lists.getById('986680CE-5D69-47B4-947C-3998DDC3776C').items.select("Id,contractNumber,Title,ContractId,typeOfContract").filter("typeOfContract eq'"+contractTypeItem+ "'").orderBy("Created",false).top(1).get()
            .then((Data: any[])=>{
              
              var contractNumberlength:any;
             
              console.log("contract list data ",Data);
              if(Data!=undefined&& Data.length>0){
                
                contractNumber=Data[0].contractNumber+1;
                console.log(contractTypeSuffix+"-"+contractNumber);
                var Contractlength= contractNumber.toString();
                contractNumberlength=Contractlength.length;
                console.log("length of contract number ",contractNumberlength);
                // setContractNumber(contractNumber) ;
              } if(Data==undefined|| Data.length==0){
                contractNumber=1;
                var Contractlength= contractNumber.toString();
                contractNumberlength=Contractlength.length;
                // setContractNumber(contractNumber);
              }
              if(contractNumberlength==0&&contractNumberlength==""){
                contractId=contractTypeSuffix+"-"+"0000"+contractNumber;
                // setcontractId(contractId);
              }
              
              else if(contractNumberlength==1 && contractNumberlength>0 && contractNumberlength!="" && contractNumberlength!=undefined){
                contractId=contractTypeSuffix+"-"+"0000"+contractNumber;
                // setcontractId(contractId);
              }
             else  if(contractNumberlength==2 && contractNumberlength>0&&contractNumberlength!="" && contractNumberlength!=undefined){
                 contractId=contractTypeSuffix+"-"+"000"+contractNumber;
                // setcontractId(contractId);
              }
              else  if(contractNumberlength==3 && contractNumberlength>0&&contractNumberlength!="" && contractNumberlength!=undefined){
                contractId=contractTypeSuffix+"-"+"00"+contractNumber;
                // setcontractId(contractId);
              }
              else  if(contractNumberlength==4 && contractNumberlength>0&&contractNumberlength!="" && contractNumberlength!=undefined){
               contractId=contractTypeSuffix+"-"+"0"+contractNumber;
                // setcontractId(contractId);
              }
            
            
            }) 
            .catch((err) => {
                  console.log(err.message);
               });

          }
          console.log(contractNumber)
          console.log(contractId)
          console.log(contactDetailsId)
          
             if(Titlecontract!=""&&Titlecontract!=undefined&&ContactDetailsItem!=undefined&&ContactDetailsItem!=""&&contractTypeItem!=""&&contractTypeItem!=undefined){
             const web = new Web(
            "https://hhhhteams.sharepoint.com/sites/HHHH/HR"
           );
           await web.lists.getById("986680CE-5D69-47B4-947C-3998DDC3776C").items.add(
                  {
                   Title:Titlecontract,
                  //  Type_OfContractID:contractTypeId,
                   typeOfContract:contractTypeItem,
                   HHHHStaffId:contactDetailsId,
                   contractNumber:contractNumber,
                   ContractId:contractId
                  
                  }
            )
           .then((res:any)=>{
             console.log(res);
             handleClose();
             
           })
           .catch((err) => {
             console.log(err.message);
            });
            }
            else{
              alert("please Fill All the input field");
            }
        };

      
        return(
         <div  className="modal show"
         style={{ display: 'block', position: 'initial' }}>
       <Modal show={show} onHide={handleClose} size="lg"aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header >
          <Modal.Title>Create Contract</Modal.Title>
        <span onClick={handleClose} >x</span>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>Title</Form.Label>
          <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"onChange={(e)=>setTitlecontract(e.target.value)}></input>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>Employee Name</Form.Label>
          <div> <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"value={ContactDetailsItem}></input>
          <span className="toltrippopup">
        <img  onClick={openEmployeeDetailspopup} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/EMMCopyTerm.png" data-themekey="#"/>
         </span>
         </div>
         
         
        </Form.Group>

        <Form.Group as={Col} controlId="formGridCity">
          <Form.Label>Contract Type</Form.Label>
          <div>
          <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"value={contractTypeItem}></input>
          <span className="toltrippopup-2" >
            <img  onClick={()=>openContractTypepopup(contractTypeItem)} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/EMMCopyTerm.png" data-themekey="#"/>
            </span>
          </div>
         
   
        </Form.Group>
      </Row>
    </Form>
   </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
           Add New Employee
          </Button>
          <Button variant="primary" onClick={createnewcontract}>
         Create
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        
        </Modal.Footer>
      </Modal>



                {/* =========================contract type poup open===================  */}


        <Modal show={contractTypepopup} onHide={()=>poupcloseContractType("contract")} size="lg"aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title>Contract Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <div className='bodypoup col-sm-12 row'>
         {
        smarttaxonomy.map((item,index)=>{
           return(
           <div className="radio col-sm-4">
            <div key={index}> <input type="radio" id="html" name="fav_language"  defaultChecked={checkContractitem==item.Title} value={item.Title}onChange={(e)=>setcheckContractitem(e.target.value)}></input>
            <label >{item.Title}</label></div>
               </div>
          )
        })  
        }
         </div>
     </Modal.Body>
        <Modal.Footer>
      
          <Button variant="primary" onClick={()=>saveContractType(checkContractitem,"contract")}>
             save
          </Button>
          <Button variant="secondary" onClick={()=>poupcloseContractType("contract")}>
            Cancel
          </Button>
        
        </Modal.Footer>
      </Modal>
              
              {/* ===============employedetails poup========================== */}


              <Modal show={ContactDetailspopup} onHide={()=>poupcloseContractType("contact")} size="lg"aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title>Contacts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <div className='bodypoup col-sm-12 row'>
          
         {
        ContactsDetails.map((item,index)=>{
           return(
           <div className="radio col-sm-4">
            <div key={index} > <input type="radio" id="html" name="fav_language"  defaultChecked={checkContactitem==item.FullName} value={item.FullName}onChange={(e)=>setcheckContactitem(e.target.value)}></input>
            <label >{item.FullName}</label></div>
               </div>
          )
        })  
        }
         </div>
     </Modal.Body>
        <Modal.Footer>
      
          <Button variant="primary" onClick={()=>saveContractType(checkContactitem,"contact")}>
             save
          </Button>
          <Button variant="secondary" onClick={()=>poupcloseContractType("contact")}>
            Cancel
          </Button>
        
        </Modal.Footer>
      </Modal>

</div>
)
}
CreateContract.defaultProps ={
    prop:false,
    }
    
export default CreateContract;