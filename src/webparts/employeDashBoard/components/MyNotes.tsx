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
        <div className='ps-4 siteColor subheading'>
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
          <span>
            <button onClick={() => setIsAddNoteModalOpen(true)}>Add Note</button>
          </span>
        </div>
        <div className='myNoteBody'>
          {myNoteData.length > 0 && myNoteData.map((items: any, index: any) => {
            if (selectedNoteIndex == index) {
              return (
                <>
                  <div className='alignCenter justify-content-between p-1'>
                    {/* <div className='boldClable'>{items.Title} </div> */}
                    <div className='ml-auto'>
                      <span className="svg__iconbox svg__icon--share" onClick={() => shareToOutlook(items)}></span>
                      <span className="svg__iconbox svg__icon--editBox" onClick={() => editMyNotes(items)}></span>
                      <span className="svg__iconbox svg__icon--trash" onClick={() => deleteMyNote(items.Id)}></span>
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
            <span onClick={() => changesIndex("left")} className={selectedNoteIndex > 0 ? "active" : ""}><AiFillLeftCircle /></span>
            <span onClick={() => changesIndex("right")} className={selectedNoteIndex + 1 < myNoteData?.length ? "active" : ""}><AiFillRightCircle /></span>
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
        <footer className='modal-footer'>
          <div className="row">
            {isEditNoteModalOpen && (<><div className="row">
              Created <span className="font-weight-normal siteColor">  {editData?.Created ? moment(editData?.Created).format("DD/MM/YYYY") : ""}  </span> By <span className="font-weight-normal siteColor">
                {editData?.Author?.Title ? editData?.Author?.Title : ''}
              </span>
            </div><div className="row">
                Last modified <span className="font-weight-normal siteColor"> {editData?.Modified ? moment(editData?.Modified).format("DD/MM/YYYY") : ''}
                </span> By <span className="font-weight-normal siteColor">
                  {editData?.Editor?.Title ? editData?.Editor?.Title : ''}
                </span>
              </div></>)}
            <div className='col'> <button className="btn btn-primary ms-1" onClick={(e) => AddNoteComment()}>Save</button>
              <button className='btn btn-default ms-1' onClick={() => CloseNotepopup()}>Cancel</button></div>
          </div>
        </footer>
      </Panel>
    </>
  )
}
export default MyNotes;