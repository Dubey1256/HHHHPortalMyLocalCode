import * as React from 'react';
import { useEffect, useState } from 'react';
import {myContextValue} from '../../../globalComponents/globalCommon'
import { Web } from 'sp-pnp-js';
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { AiFillLeftCircle, AiFillRightCircle, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
const MyNotes=()=>{
  const ContextData:any=React.useContext(myContextValue);
  const [myNoteData,setMyNoteData]=React.useState<any>([]);
  const [isAddNoteModalOpen,setIsAddNoteModalOpen]=React.useState<any>(false);
  const [isEditNoteModalOpen,setisEditNoteModalOpen]=React.useState<any>(false);
  const [editData,seteditData]=React.useState<any>();
  const [noteComment,setnoteComment]=React.useState<any>("");
  const [noteTitle,setnoteTitle]=React.useState<any>("");
  const [selectedNoteIndex,setselectedNoteIndex]=React.useState(0);
  useEffect(()=>{
    GetMyNotesData()
  },[ContextData?.currentUserData!=undefined])
const GetMyNotesData=async()=>{
  if(ContextData?.currentUserData!=undefined){
    const web = new Web(ContextData?.siteUrl);
    await web.lists
    
   .getById('2163fbd9-b6f0-48b8-bc1b-bb48e43f188d')
   .items.select("Id,Title,FeedBack,Author/Title,Author/Id ,Editor/Title,Editor/Id")
   .expand("Author,Editor")
   .filter(`Author/Id eq ${ContextData?.currentUserData?.AssingedToUser?.Id}`)
   .getAll().then(async (data:any)=>{
    if(data.length>0){
      setMyNoteData(data)
    }
   
   }).catch((error:any)=>{
    console.log(error)
   })
  }
}
  const CloseNotepopup=()=>{
    setisEditNoteModalOpen(false);
    setIsAddNoteModalOpen(false);
    setnoteComment("")
    setnoteTitle("")
  }
  const handleUpdateComment=(e:any)=>{
 console.log(e.target.value)
 setnoteComment(e.target.value);
  }
 const  editMyNotes=(editMyNotes:any)=>{
  seteditData(editMyNotes);
  setnoteComment(editMyNotes.FeedBack)
  setnoteTitle(editMyNotes.Title)
  setisEditNoteModalOpen(true)
 }
  const AddNoteComment=async()=>{
      let web = new Web(ContextData?.siteUrl);
    if(isAddNoteModalOpen){
      console.log(noteComment)
    
      await web.lists
       .getById('2163fbd9-b6f0-48b8-bc1b-bb48e43f188d').items
       .add({
         Title: noteTitle,
         FeedBack: noteComment,
       }).then((data:any)=>{
       console.log(data)
       CloseNotepopup();
       GetMyNotesData()
       })
 .catch((error:any)=>{
   console.log(error)
 })
    }else{
       await web.lists
       .getById('2163fbd9-b6f0-48b8-bc1b-bb48e43f188d').items.getById(editData.Id)
       .update({
         Title: noteTitle,
         FeedBack: noteComment,
       }).then((data:any)=>{
       console.log(data)
       CloseNotepopup();
       GetMyNotesData();
       })
 .catch((error:any)=>{
   console.log(error)
 })
    }
   
      
  }
  const deleteMyNote=(id:any)=>{
      let web = new Web(ContextData?.siteUrl);
   web.lists
       .getById('2163fbd9-b6f0-48b8-bc1b-bb48e43f188d').items.getById(id).recycle()
       .then((data:any)=>{
       console.log(data)
       CloseNotepopup();
       GetMyNotesData();
       })
 .catch((error:any)=>{
   console.log(error)
 })
  }

  const changesIndex=(button:any)=>{
    if(button=="right"){
      if(selectedNoteIndex+1<myNoteData?.length)
      setselectedNoteIndex(selectedNoteIndex+1) 
    }else if(button=="left"){
      if(selectedNoteIndex>0)
      setselectedNoteIndex(selectedNoteIndex-1) 
    }
  }

    return(
        <>
      <div>
          <div className='alignCenter justify-content-between p-1'>
              <span className='fw-bold'>My Notes({myNoteData.length>0?myNoteData.length:0})</span>
            <span>
              <button  onClick={()=>setIsAddNoteModalOpen(true)}>Add Note</button>
            </span>
          </div>
          <div className='myNoteBody'>
          {myNoteData.length>0 && myNoteData.map((items:any,index:any)=>{
            if(selectedNoteIndex==index){
             return(
             <>
                <div className='alignCenter justify-content-between p-1'>
                  <div className='boldClable'>{items.Title} </div>
                  <div className='ml-auto'>
                  <span className="svg__iconbox svg__icon--share"></span>
                  <span className="svg__iconbox svg__icon--editBox" onClick={()=>editMyNotes(items)}></span>
                  <span className="svg__iconbox svg__icon--trash" onClick={()=>deleteMyNote(items.Id)}></span>
                  </div>
                </div>
              <div className='NoteFeedback p-1'>
                {items?.FeedBack}
              </div>
              </>
            )}})}
          <div className='text-end nextBeforeSec'>
            <span className='mx-1'>{selectedNoteIndex+1}</span>/<span className='mx-1'>{myNoteData.length}</span>
            <span onClick={()=>changesIndex("left")} className={selectedNoteIndex>0?"active":""}><AiFillLeftCircle/></span>
            <span onClick={()=>changesIndex("right")} className={selectedNoteIndex+1<myNoteData?.length?"active":""}><AiFillRightCircle/></span>
          </div>
            
          </div>
      </div>
       <Panel
        //  onRenderHeader={onRenderCustomHeadereditcomment}
         isOpen={isAddNoteModalOpen ? isAddNoteModalOpen :isEditNoteModalOpen}
         onDismiss={CloseNotepopup}
         isBlocking={isAddNoteModalOpen ? !isAddNoteModalOpen : !isEditNoteModalOpen}>
         <div className="modal-body">
            <div className='input-group'>
                <label className='full-width'>Title</label>
                <input id="NoteTitle"type='text' className='form-control' value={noteTitle}onChange={(e)=>setnoteTitle(e.target.value)} />
            </div>
            <div className='input-group my-3'>
                <label className='full-width'>Description</label>
                <textarea id="txtUpdateComment" rows={6} className="full-width"value={noteComment} onChange={(e) => handleUpdateComment(e)}  >{noteComment}</textarea>
            </div>
         </div>
         <footer className='modal-footer'>
         <button className="btn btn-primary ms-1" onClick={(e) => AddNoteComment()}>Save</button>
           <button className='btn btn-default ms-1' onClick={()=>CloseNotepopup()}>Cancel</button>
          

         </footer>


       </Panel>
        </>
        
    )
}
export default MyNotes;