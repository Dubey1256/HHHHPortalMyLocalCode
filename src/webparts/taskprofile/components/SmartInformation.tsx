import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { useState, useEffect } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Button } from 'react-bootstrap';
import HtmlEditorCard from '../../../globalComponents/./HtmlEditor/HtmlEditor'
import pnp, { sp, Web } from "sp-pnp-js";
import * as moment from "moment-timezone";
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { SPHttpClient } from "@microsoft/sp-http";
import { DragDropFiles } from "@pnp/spfx-controls-react/lib/DragDropFiles";
let hhhsmartinfoId: any = [];
const SmartInformation = (props: any) => {
  const [show, setShow] = useState(false);
  const [popupEdit, setpopupEdit] = useState(false);
  const [smartInformation, setsmartInformation] = useState(true);
  const [allValue, setallSetValue] = useState({
    Title: "", URL: "", Acronym: "", Description: "", InfoType: "SmartNotes", SelectedFolder: "Public", fileupload: ""
  })
  const [uplodDoc, setUploaddoc] = useState(null);
  const [PostSmartInfo, setPostSmartInfo] = useState(null);
  const [taskInfo, settaskinfo] = useState(null);
  const [SmartMetaData, setLoadSmartMetaData] = useState([]);
  const [SmartInformation, setSmartInformation] = useState([]);
  const [AllSmartInfo, setAllSmartInfo] = useState(null);
  const [MovefolderItemUrl, setMovefolderItemUrl] = useState(null)
  const [showAdddocument, setshowAdddocument] = useState(false);
  const [editvalue, seteditvalue] = useState(null);
  const [SelectedTilesTitle, setSelectedTilesTitle] = useState("");
  const [smartDocumentpostData, setsmartDocumentpostData] = useState(null)
  const handleClose = () => {
    setpopupEdit(false);
    setshowAdddocument(false);
    setShow(false);
    seteditvalue(null);
    setallSetValue({ ...allValue, Title: "", URL: "", Acronym: "", Description: "", InfoType: "SmartNotes", SelectedFolder: "Public", fileupload: "" });

  }
  const handleShow = async (item: any, value: any) => {

    await LoadSmartMetaData();

    if (value == "edit") {
      setpopupEdit(true);
      seteditvalue(item);
      setallSetValue({ ...allValue, Title: item.Title, URL: item?.URL?.Url, Description: item?.Description, InfoType: item?.InfoType?.Title, Acronym: item?.Acronym, SelectedFolder: item.SelectedFolder });
    }
    setShow(true);
  }

  useEffect(() => {
    GetResult();

  }, [, show])

  // ===============get smartInformationId tag in task========================
  const GetResult = async () => {
    let web = new Web(props.siteurl);
    let taskDetails: any = [];

    taskDetails = await web.lists
      .getByTitle(props.listName)
      // .getById(props.AllListId.SiteTaskListID)
      .items
      .getById(props.Id)
      .select("Id", "Title", "SmartInformation/Id", "SmartInformation/Title")
      .expand("SmartInformation")
      .get()
    console.log(taskDetails);
    settaskinfo(taskDetails);
    if (taskDetails?.SmartInformation !== undefined && taskDetails?.SmartInformation.length > 0) {
      await loadAllSmartInformation(taskDetails?.SmartInformation);
    }
  }
  //============== AllsmartInformation get in smartInformation list ===========================
  const loadAllSmartInformation = async (SmartInformation: any) => {
    var allSmartInformationglobal: any = [];
    const web = new Web(props.siteurl);
    // var Data = await web.lists.getByTitle("SmartInformation")
    var Data = await web.lists.getById(props.AllListId.SmartInformationListID)
    .items.select('Id,Title,Description,SelectedFolder,URL,Acronym,InfoType/Id,InfoType/Title,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title')
      .expand("InfoType,Author,Editor")
      .get()
    console.log(Data)
    setAllSmartInfo(Data)
    if (Data.length > 0) {
      SmartInformation?.map((items: any) => {
        hhhsmartinfoId.push(items?.Id);
        if (SmartInformation?.length > 0) {
          Data?.map((tagsmartinfo: any) => {
            if (tagsmartinfo?.Id == items?.Id) {
              allSmartInformationglobal.push(tagsmartinfo);
            }
          })
        }
      })
    }
    setSmartInformation(allSmartInformationglobal)
  }
  //===============move folder to get the forlderName in the choice column ==================
  const SeleteMoveFloderItem = (item: any) => {
    setallSetValue({ ...allValue, SelectedFolder: item })
    switch (item) {
      case 'Public':
        setMovefolderItemUrl("/SmartInformation");
        break;
      case 'Memberarea':
        setMovefolderItemUrl('/Memberarea');
        break;
      case 'EDA':
        setMovefolderItemUrl('/EDA Only');
        break;
      case 'team':
        setMovefolderItemUrl('/Team');
        break;
    }
  }
  // ============load SmartMetaData to get the  infoType in popup======================= 
  const LoadSmartMetaData = async () => {
    const web = new Web(props.siteurl);
    var ListId = "01a34938-8c7e-4ea6-a003-cee649e8c67a"
    // await web.lists.getByTitle('SmartMetadata')
    await web.lists.getById(props.AllListId.SmartMetadataListID)
    .items.select('ID,Title,ProfileType', 'Parent/Id', 'Parent/Title', "TaxType", 'Description', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Title', 'Editor/Id')
      .expand("Author", "Editor", "Parent").filter("ProfileType eq 'Information'").top(4999)
      .get()
      .then((Data: any[]) => {
        console.log(Data)
        setLoadSmartMetaData(Data);
      }).catch((err) => {
        console.log(err.message);
      });
  }

  // ===============folora editorcall back function ======================

  const HtmlEditorCallBack = (items: any) => {
    console.log(items);
    setallSetValue({ ...allValue, Description: items })
  }
  // set infoType function 
  const InfoType = (InfoType: any) => {
    setallSetValue({ ...allValue, InfoType: InfoType })
  }
  const onRenderCustomHeader = () => {
    return (
      <>

        <div className='ps-4' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
          {popupEdit ? `Add SmartInformation - ${allValue?.Title}` : `Add SmartInformation - ${taskInfo?.Title}`}
        </div>
        <Tooltip ComponentId='993' />
      </>
    );
  };
  // =============chnage InputField to set the Data=========================
  const changeInputField = (value: any, item: any) => {
    console.log(value);
    console.log(item);
    if (item == "Title") {
      setallSetValue({ ...allValue, Title: value })
    }
    if (item == "url") {
      setallSetValue({ ...allValue, URL: value })
    }
    if (item == "Acronym") {
      setallSetValue({ ...allValue, Acronym: value })
    }
    if (item == "fileupload") {
      console.log(value.target.files[0])
      const selectedFile = value.target?.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setUploaddoc(fileReader.result);
      };
      fileReader.readAsArrayBuffer(selectedFile);
      // setUploaddoc(value.target.files[0])
      let fileName = value.target.files[0]?.name
      setallSetValue({ ...allValue, fileupload: fileName });
    }

  }
  //============= save function to save the data ================.
  const saveSharewebItem = async () => {
    var movefolderurl = `${props.spPageContext.serverRelativeUrl}/Lists/SmartInformation`
    // '/sites/HHHH/SP/Lists/TasksTimesheet2'
    console.log(movefolderurl);
    console.log(allValue);
    if (allValue.Title !== null && allValue?.Title !== "") {
      var metaDataId;
      if (SmartMetaData != undefined) {
        SmartMetaData?.map((item: any) => {
          if (item?.Title == allValue?.InfoType) {
            metaDataId = item?.Id;
          }
        })
      }
      const web = new Web(props?.siteurl);
      let postdata = {
        Title: allValue.Title != null ? allValue?.Title : "",
        Acronym: allValue.Acronym != null ? allValue?.Acronym : "",
        InfoTypeId: metaDataId,
        Description: allValue.Description != null ? allValue?.Description : "",
        SelectedFolder: allValue.SelectedFolder,
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        URL: {
          "__metadata": { type: 'SP.FieldUrlValue' },
          'Description': allValue.URL != undefined ? allValue?.URL : null,
          'Url': allValue.URL != undefined ? allValue?.URL : null,
        }

      }
      //=============edit the data call ===============
      if (popupEdit) {
        // await web.lists.getByTitle("SmartInformation")
        await web.lists.getById(props.AllListId.SmartInformationListID)
        .items.getById(editvalue?.Id).update(postdata)
          .then((editData: any) => {
            handleClose();
          })
          .catch((error: any) => {
            console.log(error)
          })
      }
      else {
        // await web.lists.getByTitle("SmartInformation")
        await web.lists.getById(props.AllListId.SmartInformationListID)
        .items.add(postdata)
          .then(async (res: any) => {
            console.log(res);
            setPostSmartInfo(res)
            if (MovefolderItemUrl == "/Memberarea" || MovefolderItemUrl == "/EDA Only" || MovefolderItemUrl == "/Team") {
              let movedata = await web
                .getFileByServerRelativeUrl(`${movefolderurl}/${res.data.ID}_.000`).moveTo(`${movefolderurl}${MovefolderItemUrl}/${res.data.ID}_.000`);
              console.log(movedata);
            }
            hhhsmartinfoId.push(res?.data?.ID)
            await web.lists.getByTitle(props.listName)
            // await web.lists.getById(props.AllListId.SiteTaskListID)
             .items.getById(props.Id).update(
              {
                SmartInformationId: {
                  "results": hhhsmartinfoId
                }
              }
            ).then(async (data: any) => {
              console.log(data);

              handleClose();
              GetResult();

            }).catch((err) => {
              console.log(err.message);
            })

          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    }
    else {
      alert("plese fill the Title")
    }


  }
  //===========show hide smartInformation===========
  const showhideComposition = () => {
    if (smartInformation) {

      setsmartInformation(false)

    } else {
      setsmartInformation(true)
    }

  }
  //========delete function==================
  const deleteData = async (DeletItemId: any) => {
    console.log(DeletItemId);
    const web = new Web(props.siteurl);
    // await web.lists.getByTitle("SmartInformation")
    await web.lists.getById(props.AllListId.SmartInformationListID)
    .items.getById(DeletItemId).delete()
      .then((res: any) => {
        console.log(res);
        handleClose();

      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //======== add document when i click to add document in profile page =========.
  const addDocument = async (Status: any, items: any) => {
    console.log(items)
    setsmartDocumentpostData(items)
    if (Status == "editAddDocument") {
      setshowAdddocument(true)
    }
    else {
      await saveSharewebItem();
      alert('Information saved now items can be attached.');
      console.log(PostSmartInfo);
      setshowAdddocument(true)
    }


  }
  //======== select title while upload documents================== 
  const SelectedTiles = (items: any) => {
    setSelectedTilesTitle(items)
  }
  // =============upload document function.....===============
  const onUploadDocumentFunction = async (controlId: any, uploadType: any) => {
    if (allValue.fileupload != null && allValue.fileupload != undefined) {


      var folderName = props.taskTitle.substring(3, 34).trim();
      var folderUrl = props.Context._pageContext._web.serverRelativeUrl.toLowerCase() + '/documents'
      var SiteUrl = props.siteurl
      var ListIId = "Documents"
      console.log(folderName);
      console.log(folderUrl);
      console.log(SiteUrl);
      console.log(ListIId);
      await GetOrCreateFolder(folderName, folderUrl, SiteUrl, ListIId)
        .then((folder: { UniqueId: any; }) => {
          console.log(`Folder created with ID: ${folder.UniqueId}`);
          uploadDocumentFinal(folderName);
        }).catch((err: string) => {
          console.log("Error creating folder: " + err);
        });

    }

  }
  //===============create folder function========================
  const GetOrCreateFolder = (folderName: any, folderUrl: any, SiteUrl: any, ListIId: any) => {
    console.log(folderName,)
    const endpointUrl: string = `${SiteUrl}/_api/web/lists/getbytitle('${ListIId}')/rootfolder/folders/add(url='${folderName}')`;
    return props.Context.spHttpClient.post(endpointUrl, SPHttpClient.configurations.v1)
      .then((response: { json: () => any; }) => {
        return response.json();
      });
  }
  // ================final document upload=====================
  const uploadDocumentFinal = async (folderName: any) => {
     const web = new Web(props?.siteurl);
    //  const list = sp.web.lists.getByTitle("Documents");
    const list = sp.web.lists.getById(props.AllListId.DocumentsListID);
     list.rootFolder.files.add(allValue?.fileupload, uplodDoc).then(async(result) => {
    console.log("File uploaded successfully");
    console.log(result)
    getAll(folderName);

   
     })
    .catch((error) =>{
      alert("Error is uploading");
    })
  }
    // ===========get file upload data and Id ============= .

    const getAll=async(folderName:any)=>{
   const fileName = allValue.fileupload;
  await sp.web.getFileByServerRelativeUrl(`/sites/HHHH/SP/Documents/${fileName}`).getItem()
    .then(async(res:any)=>{
      console.log(res);
      setShow(false);
   
      //===== update  the smartinformation in the file========= .
      const web = new Web(props.siteurl );
      // const updatedItem = await web.lists.getByTitle("Documents")
      const updatedItem = await web.lists.getById(props.AllListId.DocumentsListID)
      .items.getById(res.Id).update({
        SmartInformationId:{"results":[(smartDocumentpostData.Id)] },
      });
      console.log(updatedItem)
      setallSetValue({ ...allValue, fileupload: "" });
      setshowAdddocument(false)

      //========move file inside folder ====

    //   var  movefolderurl=`${props.spPageContext.serverRelativeUrl}/Documents`
    //   let movedata = await web
    //   .getFileByServerRelativeUrl(`${movefolderurl}/${res.Id}_.000`).moveTo(`${movefolderurl}/t task/${res.Id}}_.000`);
    // console.log(movedata);
    })
    .catch((err) => {
      console.log(err.message);
   });
   }
   
  

  //================ drag and drop function or mthod ===================

  const _getDropFiles = (files: any) => {
    for (var i = 0; i < files.length; i++) {
      console.log("Filename: " + files[i]?.name);
      console.log("Path: " + files[i]?.fullPath);
      setallSetValue({ ...allValue, fileupload: files[i]?.name });

    }
  }
  return (
    <div>
      {console.log(SmartInformation)}
      <div className='mb-3 card commentsection'>
        <div className='card-header'>
          <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">SmartInformation<span><Tooltip /></span></div>
        </div>

        {SmartInformation != null && SmartInformation.length > 0 && <div className="Sitecomposition">{SmartInformation?.map((SmartInformation: any, i: any) => {
          return (
            <>
              <div className='dropdown'>
                <div className='bg-ee d-flex py-1 '>
                  <span className='full-width'>
                    <a onClick={showhideComposition}>
                      <span >{smartInformation ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span >
                      <span className="pe-3">{SmartInformation?.Title != undefined ? SmartInformation?.Title : ""}</span>
                    </a>

                  </span>
                  <span className='d-flex'>
                    <a onClick={() => handleShow(SmartInformation, "edit")}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" /></svg></a>
                    <a onClick={() => addDocument("editAddDocument", SmartInformation)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.8746 14.3436C22.8774 18.8722 22.8262 22.6308 22.7608 22.6962C22.6954 22.7616 18.9893 22.8128 14.525 22.8101C10.0606 22.8073 6.32545 22.8876 6.22467 22.9884C5.99582 23.2172 6.00541 24.6394 6.23742 24.8714C6.33182 24.9658 10.0617 25.0442 14.526 25.0455C18.9903 25.0469 22.6959 25.1009 22.7606 25.1657C22.8254 25.2304 22.8808 28.9921 22.8834 33.5248L22.8884 41.7663L23.9461 41.757L25.0039 41.7476L25.0012 33.3997L24.9986 25.0516L33.2932 25.0542C37.8555 25.0556 41.6431 25.0017 41.7105 24.9343C41.8606 24.7842 41.8537 23.0904 41.7024 22.9392C41.6425 22.8793 37.8594 22.8258 33.2955 22.8204L24.9975 22.8104L24.9925 14.4606L24.9874 6.11084L23.9285 6.11035L22.8695 6.10998L22.8746 14.3436Z" fill="#333333" /></svg>
                    </a>
                  </span>
                </div>

                <div className="border-0 border-bottom m-0 spxdropdown-menu " style={{ display: smartInformation ? 'block' : 'none' }}>
                  <div className="ps-3" dangerouslySetInnerHTML={{ __html: SmartInformation?.Description }}></div>
                </div>
                <div className="px-2" style={{ fontSize: "smaller" }}><span className='pe-2'>Created By</span><span className='pe-2'>{SmartInformation?.Created != undefined ? moment(SmartInformation?.Created).format("DD/MM/YYYY") : ""}</span><span className='pe-2'>{SmartInformation?.Author?.Title != undefined ? SmartInformation?.Author?.Title : ""}</span></div>
                <div className="px-2" style={{ fontSize: "smaller" }}><span className='pe-2'>Modified By</span><span className='pe-2'>{SmartInformation?.Modified != undefined ? moment(SmartInformation?.Modified).format("DD/MM/YYYY") : ""}</span><span className='pe-2'>{SmartInformation?.Editor?.Title != undefined ? SmartInformation?.Editor?.Title : ""}</span></div>
              </div>

            </>)
        })}

        </div>}

        <div className='card-body p-1 text-end'>
          <a onClick={() => handleShow(null, "add")}><span>+ Add SmartInformation</span></a>
        </div>


      </div>

      <Panel onRenderHeader={onRenderCustomHeader}
        isOpen={show}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClose}>
        <div>
          <div className="row">
            <dl className="align-items-center d-flex Hz-align ">
              <dt>
                Select
                Permission:
              </dt>
              <dt><input type="radio" checked={allValue?.SelectedFolder == "Public"} value="Public" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>Public</label></dt>
              <dt><input type="radio" checked={allValue?.SelectedFolder == "Memberarea"} value="Memberarea" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>Memberarea</label></dt>
              <dt><input type="radio" checked={allValue?.SelectedFolder == "EDA"} value="EDA" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>EDA Only</label></dt>
              <dt><input type="radio" checked={allValue?.SelectedFolder == "team"} value="team" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>Team</label></dt>
            </dl>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor="Title" className='full-width'>Title &nbsp;*</label>
              <input type="text" className='full-width' value={allValue?.Title} id="Title" onChange={(e) => changeInputField(e.target.value, "Title")} />
            </div>
            <div className='col-sm-6'>
              <label className='full-width' htmlFor="InfoType">InfoType</label>
              <select className='full-width' name="cars" id="InfoType" value={allValue?.InfoType} onChange={(e) => InfoType(e.target.value)}>
                {SmartMetaData != undefined && SmartMetaData?.map((items: any) => {
                  return (
                    <> <option value={items?.Title}>{items?.Title}</option></>
                  )
                })}

              </select>
            </div>

            <div className='col-md-6'>
              <label htmlFor="URL" className='full-width'>URL</label>
              <input type="text" className='full-width' id="URL" value={allValue?.URL} onChange={(e) => changeInputField(e.target.value, "url")} />
            </div>
            {allValue.InfoType != null && allValue.InfoType == "Glossary" && <div className='col-md-6'>
              <label htmlFor="Acronym" className='full-width'>Acronym &nbsp;*</label>
              <input type="text" className='full-width' id="Acronym" value={allValue?.Acronym} onChange={(e) => changeInputField(e.target.value, "Acronym")} />
            </div>}
          </div>
        </div>
        <div className='mt-3'> <HtmlEditorCard editorValue={allValue?.Description != "" ? allValue.Description : ""} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard></div>
        <footer className='text-end mt-2'>
          <div className='col-sm-12 row m-0'>
            <div className="col-sm-6 text-lg-start">
              {popupEdit && <div><div><span className='pe-2'>Created</span><span className='pe-2'>{editvalue?.Created !== null ? moment(editvalue?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{editvalue?.Author?.Title}</a></span></div>
                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{editvalue?.Modified !== null ? moment(editvalue?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{editvalue?.Editor?.Title}</a></span></div>
                <div><a onClick={() => deleteData(editvalue.Id)}><img className='pe-1' src='https://hhhhteams.sharepoint.com/_layouts/images/delete.gif' />Delete this item</a></div>
              </div>}
            </div>

            <div className='col-sm-6 mt-2 p-0'>
              {popupEdit && <span className='pe-2'><a target="_blank" data-interception="off" href={`${props.spPageContext.absoluteUrl}/Lists/SmartInformation/EditForm.aspx?ID=${editvalue?.Id != null ? editvalue?.Id : null}`}>Open out-of-the-box form |</a></span>}
              <span><a title='Add Link/ Document' onClick={() => addDocument("popupaddDocument", null)}>Add Link/ Document</a></span>
              <Button className='btn btn-primary ms-1  mx-2' onClick={saveSharewebItem}>
                Save
              </Button>
              <Button className='btn btn-default' onClick={() => handleClose()}>
                Cancel
              </Button>
            </div>
          </div>
        </footer>
      </Panel>



      <Panel onRenderHeader={onRenderCustomHeader}
        isOpen={showAdddocument}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClose}>
        <div>

          <div className='bg-ee d-flex justify-content-center py-4 text-center'>
            <a className={SelectedTilesTitle == "UploadDocument" ? "bg-69 me-2 pe-5 px-4 py-2 BoxShadow" : "bg-69 me-2 pe-5 px-4 py-2"} onClick={() => SelectedTiles('UploadDocument')}>
              <p className='full-width floar-end'>
                Document
              </p>

              <img src="https://hhhhteams.sharepoint.com/sites/Joint/SiteCollectionImages/Tiles/Tile_LibraryBooks.png" title="Documents" data-themekey="#" />


            </a>
            <a className={SelectedTilesTitle == "UploadEmail" ? "bg-69 me-2 pe-5 px-4 py-2 BoxShadow" : "bg-69 me-2 pe-5 px-4 py-2"} onClick={() => SelectedTiles('UploadEmail')}>
              <p className='full-width floar-end'>
                Email
              </p>
              <img src="https://hhhhteams.sharepoint.com/sites/Joint/SiteCollectionImages/Tiles/Tile_MailPlus.png" title="Mail" data-themekey="#" />


            </a>
            <a className={SelectedTilesTitle == "CreateLink" ? "bg-69 me-2 pe-5 px-4 py-2 BoxShadow" : "bg-69 me-2 pe-5 px-4 py-2"} onClick={() => SelectedTiles('CreateLink')}>
              <p className='full-width floar-end'>
                Link
              </p>
              <img src="https://hhhhteams.sharepoint.com/sites/Joint/SiteCollectionImages/Tiles/Tile_Links.png" title="Links" data-themekey="#" />


            </a>
            <a className={SelectedTilesTitle == "Task" ? "bg-69 me-2 pe-5 px-4 py-2 BoxShadow" : "bg-69 me-2 pe-5 px-4 py-2"} onClick={() => SelectedTiles('Task')}>
              <p className='full-width floar-end'>
                Task
              </p>
              <img src="https://hhhhteams.sharepoint.com/sites/Joint/SiteCollectionImages/Tiles/Tile_Task.png" title="Tasks" data-themekey="#" />
            </a>
            {/* <a className="tile ng-scope ng-hide" ng-show="CurrentSiteUrl=='GmBH'" onClick={()=>SelectedTiles('Contact')}>
                            <span>
                                Contact
                                <div className="col-sm-12">
                                    <img src="https://hhhhteams.sharepoint.com/sites/Joint/SiteCollectionImages/Tiles/Tile_Contactinfo.png" className="d-block" title="Contacts" data-themekey="#"/>
                                </div>
                            </span>
                        </a> */}
          </div>

          {SelectedTilesTitle === "UploadDocument" && <div className='mt-2'>
            <div className=''>{SelectedTilesTitle}</div>
            <DragDropFiles
              dropEffect="copy"
              // enable={true}  
              onDrop={_getDropFiles}
              iconName="Upload"
            //labelMessage= "My custom upload File"
            >
              <div className='BorderDas py-5 px-2 text-center'> {allValue.fileupload == "" && <span>Drag and drop here...</span>}
                <span>{allValue.fileupload != "" ? allValue.fileupload : ""}</span>
              </div>

            </DragDropFiles>
            <div className='row'>
              <div className='col-md-6'>
                <input type='file' onChange={(e) => changeInputField(e, "fileupload")} className="full-width mt-3"></input>
              </div>
              <div className='col-md-6'><input type="text" className="full-width mt-3" placeholder='Rename your document' value={allValue.fileupload != "" ? allValue.fileupload : ""}></input></div>
            </div>
            <div className='mt-2 text-end' onClick={(e) => onUploadDocumentFunction("uploadFile", "UploadDocument")}><button className='btn  text-end btn btn-primary '>upload</button>  <Button className='btn btn-default text-end  btn btn-primary' onClick={() => handleClose()}>
              Cancel
            </Button> </div>
          </div>}
          {SelectedTilesTitle === "UploadEmail" && <div>  <DragDropFiles
            dropEffect="copy"
            // enable={true}  
            onDrop={_getDropFiles}
            iconName="Upload"
            labelMessage="My custom upload File"
          >
            <div className='border py-5 px-2'> {allValue.fileupload == "" && <span>Drag and drop here...</span>}
              <span>{allValue.fileupload != "" ? allValue.fileupload : ""}</span>
            </div>

          </DragDropFiles></div>}
          {SelectedTilesTitle === "CreateLink" && <div><div className="panel-heading">
            <h3 className="panel-title">
              Link
            </h3>
          </div>

          </div>}
          {SelectedTilesTitle === "Task" && <div>Task</div>}
        </div>

      </Panel>
    </div>
  )
}
export default SmartInformation;


