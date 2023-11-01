import * as React from 'react';
import { useEffect, useState } from 'react';
import { myContextValue } from '../../../globalComponents/globalCommon'
import Tooltip from '../../../globalComponents/Tooltip';
import { Web } from 'sp-pnp-js';
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { AiFillLeftCircle, AiFillRightCircle, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import moment from 'moment';
const MyNotes = () => {
  const ContextData: any = React.useContext(myContextValue);
  const [myNoteData, setMyNoteData] = React.useState<any>([]);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = React.useState<any>(false);
  const [isEditNoteModalOpen, setisEditNoteModalOpen] = React.useState<any>(false);
  const [editData, seteditData] = React.useState<any>();
  const [noteComment, setnoteComment] = React.useState<any>("");
  const [noteTitle, setnoteTitle] = React.useState<any>("");
  const [selectedNoteIndex, setselectedNoteIndex] = React.useState(0);
  useEffect(() => {
    GetMyNotesData()
  }, [ContextData?.currentUserData != undefined])
  const GetMyNotesData = async () => {
    if (ContextData?.currentUserData != undefined) {
      const web = new Web(ContextData?.siteUrl);
      await web.lists
        .getById('2163fbd9-b6f0-48b8-bc1b-bb48e43f188d')
        .items.select("Id,Title,FeedBack,Created,Modified,Author/Title,Author/Id ,Editor/Title,Editor/Id")
        .expand("Author,Editor")
        .filter(`Author/Id eq ${ContextData?.currentUserData?.AssingedToUser?.Id}`)
        .orderBy("Modified desc")
        .getAll().then(async (data: any) => {
          if (data.length > 0) {
            setMyNoteData(data)
          }
        }).catch((error: any) => {
          console.log(error)
        })
    }
  }
  const CloseNotepopup = () => {
    setisEditNoteModalOpen(false);
    setIsAddNoteModalOpen(false);
    setnoteComment("")
    setnoteTitle("")
  }
  const handleUpdateComment = (e: any) => {
    console.log(e.target.value)
    setnoteComment(e.target.value);
  }
  const editMyNotes = (editMyNotes: any) => {
    seteditData(editMyNotes);
    setnoteComment(editMyNotes.FeedBack)
    setnoteTitle(editMyNotes.Title)
    setisEditNoteModalOpen(true)
  }
  const AddNoteComment = async () => {
    let web = new Web(ContextData?.siteUrl);
    if (isAddNoteModalOpen) {
      console.log(noteComment)
      await web.lists
        .getById('2163fbd9-b6f0-48b8-bc1b-bb48e43f188d').items
        .add({
          Title: noteTitle,
          FeedBack: noteComment,
        }).then((data: any) => {
          console.log(data)
          CloseNotepopup();
          GetMyNotesData()
        })
        .catch((error: any) => {
          console.log(error)
        })
    } else {
      await web.lists
        .getById('2163fbd9-b6f0-48b8-bc1b-bb48e43f188d').items.getById(editData.Id)
        .update({
          Title: noteTitle,
          FeedBack: noteComment,
        }).then((data: any) => {
          console.log(data)
          CloseNotepopup();
          GetMyNotesData();
        })
        .catch((error: any) => {
          console.log(error)
        })
    }


  }
  const deleteMyNote = (id: any) => {
    const confirmDeletion = window.confirm("Are you sure you want to delete this note?");
    if (confirmDeletion) {
      let web = new Web(ContextData?.siteUrl);
      web.lists
        .getById('2163fbd9-b6f0-48b8-bc1b-bb48e43f188d').items.getById(id).recycle()
        .then((data: any) => {
          console.log(data);
          CloseNotepopup();
          GetMyNotesData();
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else {
    }
  }

  const changesIndex = (button: any) => {
    if (button == "right") {
      if (selectedNoteIndex + 1 < myNoteData?.length)
        setselectedNoteIndex(selectedNoteIndex + 1)
    } else if (button == "left") {
      if (selectedNoteIndex > 0)
        setselectedNoteIndex(selectedNoteIndex - 1)
    }
  }
  const shareToOutlook = (item:any) => {
  const subject = "Sharing an item via Outlook";
  const body = `Check out this item:\n\nTitle: ${item.Title}\nDescription: ${item.FeedBack}\n\n`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoUrl);
};
  const onRenderCustomHeaderDocuments = () => {
    return (
      <>
        <div className='siteColor subheading'>
          {isAddNoteModalOpen ? `Add Note` : 'Edit Note'}
        </div>
        <Tooltip ComponentId={'359'} />
      </>
    );
  };
  return (
    <>
      <div>
        <div className='alignCenter justify-content-between p-1'>
          <span className='fw-bold'>My Notes({myNoteData.length > 0 ? myNoteData.length : 0})</span>
        </div>
        <div className='myNoteBody'>
          {myNoteData.length > 0 && myNoteData.map((items: any, index: any) => {
            if (selectedNoteIndex == index) {
              return (
                <>
                  <div className='alignCenter justify-content-between p-1'>
                    {/* <div className='boldClable'>{items.Title} </div> */}
                    <div className='ml-auto alignCenter'>
                      <span onClick={() => setIsAddNoteModalOpen(true)} className='mx-1' title='Add Notes'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                        <path d="M11.461 6.35554C11.461 9.10864 9.22913 11.3405 6.47602 11.3405C3.72292 11.3405 1.49109 9.10864 1.49109 6.35554C1.49109 3.60244 3.72292 1.37061 6.47602 1.37061C9.22913 1.37061 11.461 3.60244 11.461 6.35554ZM7.0299 4.14001C7.0299 3.83412 6.78192 3.58613 6.47602 3.58613C6.17013 3.58613 5.92214 3.83412 5.92214 4.14001V5.80166H4.2605C3.9546 5.80166 3.70662 6.04964 3.70662 6.35554C3.70662 6.66144 3.9546 6.90942 4.2605 6.90942H5.92214V8.57107C5.92214 8.87696 6.17013 9.12495 6.47602 9.12495C6.78192 9.12495 7.0299 8.87696 7.0299 8.57107V6.90942H8.69155C8.99745 6.90942 9.24543 6.66144 9.24543 6.35554C9.24543 6.04964 8.99745 5.80166 8.69155 5.80166H7.0299V4.14001Z" fill="#057BD0"/>
                        <path d="M14.2306 4.69388H12.3396C12.2304 4.30767 12.0839 3.93705 11.9046 3.58612H14.2306C15.7601 3.58612 17 4.82603 17 6.35553V11.1032C17 11.5438 16.8249 11.9665 16.5133 12.2781L12.3988 16.3926C12.0872 16.7043 11.6645 16.8793 11.2239 16.8793H6.47623C4.94673 16.8793 3.70682 15.6394 3.70682 14.1099V11.7839C4.05775 11.9632 4.42837 12.1097 4.81458 12.2189V14.1099C4.81458 15.0275 5.55852 15.7715 6.47623 15.7715H10.3534V13.556C10.3534 11.7205 11.8412 10.2327 13.6767 10.2327H15.8922V6.35553C15.8922 5.43782 15.1482 4.69388 14.2306 4.69388ZM11.4612 15.7181C11.5179 15.6912 11.5703 15.6545 11.6155 15.6093L15.73 11.4948C15.7752 11.4496 15.8119 11.3972 15.8388 11.3405H13.6767C12.4531 11.3405 11.4612 12.3324 11.4612 13.556V15.7181Z" fill="#057BD0"/>
                        </svg>
                      </span>
                      <span title='Share Notes' className="svg__iconbox svg__icon--share ms-2 empBg" onClick={() => shareToOutlook(items)}></span>
                      <span title='Edit Notes' className="svg__iconbox svg__icon--editBox mx-1 empBg" onClick={() => editMyNotes(items)}></span>
                      <span title='Delete Notes' className="svg__iconbox svg__icon--trash empBg" onClick={() => deleteMyNote(items.Id)}></span>
                    </div>
                  </div>
                  <div className='NoteFeedback p-1'>
                    {items?.FeedBack}
                  </div>
                </>
              )
            }
          })}
          <div className='text-end nextBeforeSec'>
            <span className='mx-1'>{selectedNoteIndex + 1}</span>/<span className='mx-1'>{myNoteData.length}</span>
            <span title='Tap to Previous Notes' onClick={() => changesIndex("left")} className={selectedNoteIndex > 0 ? "active" : ""}><AiFillLeftCircle /></span>
            <span title='Tap to Next Notes' onClick={() => changesIndex("right")} className={selectedNoteIndex + 1 < myNoteData?.length ? "active" : ""}><AiFillRightCircle /></span>
          </div>

        </div>
      </div>
      <Panel onRenderHeader={onRenderCustomHeaderDocuments}
        isOpen={isAddNoteModalOpen ? isAddNoteModalOpen : isEditNoteModalOpen}
        onDismiss={CloseNotepopup}
        type={PanelType.medium}
        isBlocking={isAddNoteModalOpen ? !isAddNoteModalOpen : !isEditNoteModalOpen}>

        <div className="modal-body">
          <div className='input-group my-3'>
            <label className='full-width'>Add New Notes</label>
            <textarea id="txtUpdateComment" rows={6} className="full-width" value={noteComment} onChange={(e) => handleUpdateComment(e)}  >{noteComment}</textarea>
          </div>
        </div>
        <footer className='bg-f4 fixed-bottom'>
          <div className="align-items-center d-flex justify-content-between px-4 py-2">
            {isEditNoteModalOpen && (<div>
              <div>
              Created <span className="font-weight-normal siteColor">  {editData?.Created ? moment(editData?.Created).format("DD/MM/YYYY") : ""}  </span> By <span className="font-weight-normal siteColor">
                {editData?.Author?.Title ? editData?.Author?.Title : ''}
              </span>
              </div>
              <div>
                Last modified <span className="font-weight-normal siteColor"> {editData?.Modified ? moment(editData?.Modified).format("DD/MM/YYYY") : ''}
                </span> By <span className="font-weight-normal siteColor">
                  {editData?.Editor?.Title ? editData?.Editor?.Title : ''}
                </span>
              </div>
              </div>)}
            <div className='footer-right'> 
              <button className="btn btn-primary ms-1" onClick={(e) => AddNoteComment()}>Save</button>
              <button className='btn btn-default ms-1' onClick={() => CloseNotepopup()}>Cancel</button></div>
          </div>
        </footer>
      </Panel>
    </>
  )
}
export default MyNotes;