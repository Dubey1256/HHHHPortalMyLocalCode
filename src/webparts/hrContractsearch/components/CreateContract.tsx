import * as React from "react";
import {
   FaAngleDown,
   FaAngleUp,
   FaChevronDown,
   FaChevronRight
} from "react-icons/fa";
import { sp, Web } from "sp-pnp-js";
import EditContractPopup from "./EditContractPopup";
import * as $ from "jquery";
import { arraysEqual, Modal, Panel, PanelType } from "office-ui-fabric-react";
import * as Moment from "moment";
import CreateContactComponent from "../../contactSearch/components/contact-search/popup-components/CreateContact";

let ResData:any = {}
const CreateContract = (props: any) => {
   let ContractListId = props.AllListId?.ContractListID
   let siteUrl = props.AllListId?.siteUrl
   const [createPopup, setCreatePopup] = React.useState(false)
   const [openEditPopup, setOpenEditPopup] = React.useState(false)
   const [contractType, setContractType] = React.useState(false)
   const [addEmp, setaddEmp] = React.useState(false)
   const [allContactData, setAllContactData] = React.useState([])
   const [smarttaxonomy, setSmarttaxonomy] = React.useState([]);
   const [contactDetailsId, setcontactDetailsId] = React.useState();
   const [CreateContactStatus, setCreateContactStatus] = React.useState(false);
   const [postData, setPostData] = React.useState({
      Title: "",
      contractTypeItem: "",
      checkContractitem: "",
      selectEmp: ""
    });
   const [contractTypeSuffix, setcontractTypeSuffix] = React.useState("");
   React.useEffect(() => {
      loadContactDetails()
      LoadSmartTaxonomy();
      AddTaskTimepopup()
   }, [])

   const AddTaskTimepopup = () => {
      setCreatePopup(true)
   }

   const loadContactDetails=async()=>{
      const web = new Web(siteUrl);
      await web.lists.getById(props.AllListId.HR_EMPLOYEE_DETAILS_LIST_ID).items.select("Id,Title,ItemType,FirstName,FullName,Company,JobTitle,Item_x0020_Cover,EmployeeID/Title,StaffID,EmployeeID/Id").expand("EmployeeID").orderBy("Created",true).get()
      .then((Data: any[])=>{
        console.log(Data);
        var employecopyData:any=[];
        Data.map((item,index)=>{
          if(item.ItemType!=undefined && item.ItemType!=""){
                if(item.ItemType == "Contact"){
                  employecopyData.push(item);
                }
          }
        })
        setAllContactData(employecopyData);
   
        }) 
      .catch((err) => {
            console.log(err.message);
         });
    }
    const LoadSmartTaxonomy=async()=>{
      const web = new Web(siteUrl);
       await web.lists.getById(props.AllListId.MAIN_SMARTMETADATA_LISTID).items.select("Id,Title,TaxType,Suffix").get()
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
   const closeAddTaskTimepopup = () => {
      setCreatePopup(false)
      props.closeContracts();
   }

   const onRenderSelectEmp =()=>{
      return (
         <>
            <div
               className="subheading">
              Select Employee
            </div>

         </>
      );
   }
   const onRenderCustomHeader = () => {
      return (
         <>
            <div
               className="subheading">
               Create Contract
            </div>

         </>
      );
   };
   const openAddEmployeePopup=()=>{
      setaddEmp(true)
   }
   const closeAddEmp=()=>{
      setaddEmp(false)
   }
   const openContractTypePopup=()=>{
      setContractType(true)
   }
   const closeContractTypePopup=()=>{
      setContractType(false)
   }
   const createEmp = async () => {
       
      var contractNumber:any;
      var contractId:any;
      if(postData?.contractTypeItem !=undefined&& postData?.contractTypeItem != ""){
         const web = new Web(siteUrl);
        await web.lists.getById(ContractListId).items.select("Id,contractNumber,Title,ContractId,typeOfContract").filter("typeOfContract eq'"+postData?.contractTypeItem+ "'").orderBy("Created",false).top(1).get()
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
          }
           if(Data==undefined|| Data.length==0){
            contractNumber=1;
            var Contractlength= contractNumber.toString();
            contractNumberlength=Contractlength.length;
            // setContractNumber(contractNumber);
          }
          if(contractNumberlength==0 && contractNumberlength==""){
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
      
         
      const web = new Web(siteUrl);
       await web.lists.getById(ContractListId).items.add(
              {
               Title:postData?.Title,
               typeOfContract:postData?.contractTypeItem,
               HHHHStaffId:contactDetailsId,
               contractNumber:contractNumber,
               ContractId:contractId
              
              }
        )
       .then((res:any)=>{
         console.log(res);
         closeAddEmp()
         ResData = res.data
          setOpenEditPopup(true)
        
         //props.closeContracts(res.data)
         
       })
       .catch((err) => {
         console.log(err.message);
        });
        }
   
    const saveContractType=(checkitem:any,type:any)=>{
      closeContractTypePopup();
      closeAddEmp()
      if(postData.contractTypeItem !=undefined && postData.contractTypeItem !="" && type==="contract"){
        smarttaxonomy.map ((items,index)=>{
          if(items.Title===checkitem){
            setPostData({ ...postData, contractTypeItem: items.Id})
            setcontractTypeSuffix(items.Suffix);
          }
       
        })
        setPostData({ ...postData, contractTypeItem: checkitem})
        closeContractTypePopup();
       }
       else if(postData.selectEmp !=undefined && postData.selectEmp !="" && type==="contact"){
        allContactData.map((items,index)=>{
          if(items.FullName===postData?.selectEmp){
            setcontactDetailsId(items.EmployeeID?.Id);
            
         }
        })
        
         
       }
      
     }
     const callback=()=>{
      setOpenEditPopup(false)
      closeAddTaskTimepopup();
      props.callBack()
     }
     const ClosePopup = React.useCallback(() => {
      setCreateContactStatus(false);
    
  }, []);
   return (
      <>
         <Panel
            onRenderHeader={onRenderCustomHeader}
            type={PanelType.custom}
            customWidth={'750px'}
            isOpen={createPopup}
            onDismiss={closeAddTaskTimepopup}
            isBlocking={false}
         >
            <div>
               <div className="row">
                  <div className="col-sm-4">
                     <div className="input-group">
                        <label className="form-label full-width">Title</label>
                        <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" onChange={(e)=>setPostData({ ...postData, Title: e.target.value })}></input>
                     </div>
                  </div>
                  <div className="col-sm-4">
                     <div className="input-group">
                        <label className="form-label full-width">Employee Name</label>
                        <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value={postData?.selectEmp}/>
                        <span className="input-group-text" title="Status Popup"><span title="Edit Task" className="svg__iconbox svg__icon--editBox" onClick={()=>openAddEmployeePopup()}></span></span>
                     </div>
                  </div>
                  <div className="col-sm-4">
                     <div className="input-group">
                        <label className="form-label full-width">Contract Type</label>
                        <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value={postData?.contractTypeItem}/>
                        <span className="input-group-text" title="Status Popup"><span title="Edit Task" className="svg__iconbox svg__icon--editBox" onClick={()=>openContractTypePopup()}></span></span>
                     </div>
                  </div>
                  <footer>
                     <div className="row">
                        <div className="col-sm-12 text-end mt-2">
                           <button type="button" className="btn btn-primary ms-2" onClick={()=>setCreateContactStatus(true)}>Add New Employee</button>
                           <button type="button" className="btn btn-primary ms-2" onClick={()=>createEmp()}>Create</button>
                           <button type="button" className="btn btn-default ms-2" onClick={()=>closeAddTaskTimepopup()}>Cancel</button>
                        </div>
                     </div>
                  </footer>


               </div>
            </div>


         </Panel>
         <Panel
            onRenderHeader={onRenderSelectEmp}
            type={PanelType.custom}
            customWidth={'750px'}
            isOpen={addEmp}
            onDismiss={closeAddEmp}
            isBlocking={false}
         >
            <div className="modal-body">
            <div className="p-0 mt-2 row">
               {allContactData.map((item,index)=>{
             return(
               
             <div key={index} className="col-sm-4 pl-0 mb-1"> 
             <div className="SpfxCheckRadio">
             <input type="radio" className="radio" id="html" name="fav_language"  defaultChecked={postData.contractTypeItem==item.FullName}  value={item.FullName} onChange={(e)=>setPostData({ ...postData, selectEmp: e.target.value })}></input>
            {item?.FullName}</div></div>
           
               
           )
           })  
         } </div>
           <footer>
                        <div className="col-sm-12 text-end">
                           <button type="button" className="btn btn-primary ms-2" onClick={()=>saveContractType(postData.contractTypeItem,"contact")}>save</button>
                           <button type="button" className="btn btn-default ms-2" onClick={()=>closeAddEmp()}>Cancel</button>
                        </div>
                  </footer>
         </div>
            


         </Panel>

         <Panel
            onRenderHeader={onRenderCustomHeader}
            type={PanelType.custom}
            customWidth={'500px'}
            isOpen={contractType}
            onDismiss={closeContractTypePopup}
            isBlocking={false}
         >
          <div className="modal-body">
            <div className="mt-2">
            {
        smarttaxonomy.map((item,index)=>{
           return(
           
            <div className="SpfxCheckRadio" key={index}> 
             <input type="radio" className="radio" id="html" name="fav_language"  defaultChecked={postData.contractTypeItem==item.Title} value={item?.Title}  onChange={(e) =>
                      setPostData({ ...postData, contractTypeItem : e.target.value })
                    }></input>
           {item.Title}</div>
               
          )
        })  
        }</div>
        </div>  
        <footer>
                        <div className="col-sm-12 text-end">
                           <button type="button" className="btn btn-primary ms-2" onClick={()=>saveContractType(postData.contractTypeItem,"contract")}>save</button>
                           <button type="button" className="btn btn-default ms-2" onClick={()=>closeContractTypePopup()}>Cancel</button>
                        </div>
                  </footer>
               
           
            


         </Panel>
         {openEditPopup && <EditContractPopup props={ResData} AllListId={props.AllListId} callback={callback}></EditContractPopup>}
         {CreateContactStatus ? <CreateContactComponent callBack={ClosePopup} data={allContactData}/> : null}
      </>
   )
}
export default CreateContract;

