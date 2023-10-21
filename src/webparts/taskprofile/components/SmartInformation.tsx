import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Button, Tabs, Tab, Col, Nav, Row } from 'react-bootstrap';
import EditDocument from './EditDocunentPanel'
import HtmlEditorCard from '../../../globalComponents/./HtmlEditor/HtmlEditor'
import pnp, { sp, Web } from "sp-pnp-js";
import * as moment from "moment-timezone";
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { DragDropFiles } from "@pnp/spfx-controls-react/lib/DragDropFiles";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
// import ComponentPortPolioPopup from "../../EditPopupFiles/ComponentPortfolioSelection"
// import LinkedComponent from '../../../globalComponents/EditTaskPopup/LinkedComponent'
import ServiceComponentPortfolioPopup from "../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup"

import ImageTabComponenet from './ImageTabComponent'
import { Mention } from 'react-mentions';
let AllTasktagsmartinfo: any = [];
let hhhsmartinfoId: any = [];
let taskUser: any = [];
let mastertaskdetails: any = [];
let MovefolderItemUrl2 = "";
let addSmartInfoPopupAddlinkDoc2 = false;
const SmartInformation = (props: any, ref: any) => {
  const [show, setShow] = useState(false);
  const [popupEdit, setpopupEdit] = useState(false);
  const [smartInformationArrow, setsmartInformationArrow] = useState(true);
  const [allValue, setallSetValue] = useState({
    Title: "", URL: "", Acronym: "", Description: "", InfoType: "SmartNotes", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [],
  })
  const [addSmartInfoPopupAddlinkDoc, setaddSmartInfoPopupAddlinkDoc] = useState(false)
  // const [imageTabOpen, setImageTabOpen] = useState(false);
  const [filterSmartinfo, setFiltersmartinfo] = useState([]);

  const [isopencomonentservicepopup, setisopencomonentservicepopup] = useState(false);
  // const [componentpopup, setcomponentpopup] = useState(false);
  // const [servicespopup, setservicespopup] = useState(false);
  const [uplodDoc, setUploaddoc] = useState(null);
  const [EditTaskdata, setEditTaskdata] = useState();
  const [PostSmartInfo, setPostSmartInfo] = useState(null);
  const [taskInfo, settaskinfo] = useState(null);
  const [SmartMetaData, setLoadSmartMetaData] = useState([]);
  const [SmartInformation, setSmartInformation] = useState([]);
  const [AllSmartInfo, setAllSmartInfo] = useState(null);
  const [MovefolderItemUrl, setMovefolderItemUrl] = useState(null)
  const [showAdddocument, setshowAdddocument] = useState(false);
  const [editvalue, seteditvalue] = useState(null);
  const [SelectedTilesTitle, setSelectedTilesTitle] = useState("");
  const [smartDocumentpostData, setsmartDocumentpostData] = useState(null);
  const [EditdocumentsData, setEditdocumentsData] = useState(null);
  const [Editdocpanel, setEditdocpanel] = useState(false);
  const [EditSmartinfoValue, setEditSmartinfoValue] = useState(null);
  const [Today, setToday] = useState(moment().format("DD/MM/YYYY"));
  const [folderCreated, setFolderCreated] = useState(true)
  // const [taskUser,setTaskUser]=useState([]);
  const handleClose = () => {
    if (addSmartInfoPopupAddlinkDoc2 == false) {


      setpopupEdit(false);
      setshowAdddocument(false);
      setSelectedTilesTitle("")
      setShow(false);
      seteditvalue(null);
      setallSetValue({ ...allValue, Title: "", URL: "", Acronym: "", Description: "", InfoType: "SmartNotes", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [] });
      if (props.showHide === "projectManagement" || props.showHide === "ANCTaskProfile") {
        console.log(props.remarkData)
        props.setRemark(false)
      }
    }
  }
  const handleClosedoc = () => {
    setEditdocpanel(false)
    handleClose();
  }
  const handleShow = async (item: any, value: any) => {

    await LoadSmartMetaData();

    if (value == "edit") {
      setpopupEdit(true);
      seteditvalue(item);
      setEditSmartinfoValue(item)
      setallSetValue({ ...allValue, Title: item.Title, URL: item?.URL?.Url, Description: item?.Description, InfoType: item?.InfoType?.Title, Acronym: item?.Acronym, SelectedFolder: item.SelectedFolder });
      setShow(true);
    } else {
      setallSetValue({ ...allValue, Title: "", URL: "", Acronym: "", Description: "", InfoType: "SmartNotes", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [] });
      if (props.showHide === "projectManagement") {
        setallSetValue({ ...allValue, InfoType: "Remarks" })
        // props.setRemark(false)
      } else {
        setallSetValue({ ...allValue, Title: "", URL: "", Acronym: "", Description: "", InfoType: "SmartNotes", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [] });
      }

      setShow(true);
    }

  }

  useEffect(() => {
    if ((props?.showHide == "projectManagement") && props.editSmartInfo) {
      handleShow(props.RemarkData.SmartInformation[0], "edit")
    } if ((props?.showHide == "projectManagement") && props.editSmartInfo == false) {
      handleShow(null, "add")
    }
    LoadMasterTaskList().then((data: any) => {
      console.log(data)
      GetTaskUsers()
      GetResult();
    })

    // GetResult();

  }, [show])
  useImperativeHandle(ref, () => ({
    GetResult
  }))

  //=========== TaskUser Management=====================
  const GetTaskUsers = async () => {
    let web = new Web(props.AllListId?.siteUrl);
    let taskUsers = [];
    taskUsers = await web.lists
      .getById(props?.AllListId?.TaskUsertListID)
      .items
      .select('Id', 'Email', 'Suffix', 'Title', 'Item_x0020_Cover', 'Company', 'AssingedToUser/Title', 'AssingedToUser/Id',)
      .filter("ItemType eq 'User'")
      .expand('AssingedToUser')
      .get();

    if (taskUsers.length > 0) {
      taskUser = taskUser.concat(taskUsers);
    }


  }


  // ===============get smartInformationId tag in task========================
  const GetResult = async () => {
    AllTasktagsmartinfo = [];
    let web = new Web(props.AllListId?.siteUrl);
    let taskDetails: any = [];
    let query = '';
    if (props?.listName == 'Master Tasks') {
      query = "Id,Title,SmartInformation/Id,SmartInformation/Title&$expand=SmartInformation"
    }else {
      query = "Id,Title,Portfolio/Id,Portfolio/Title,SmartInformation/Id,SmartInformation/Title&$expand=SmartInformation,Portfolio"
      
    }
    taskDetails = await web.lists
      .getByTitle(props?.listName)
      // .getById(props.AllListId.SiteTaskListID)
      .items
      .getById(props?.Id)
      .select(query)
      .get()
    console.log(taskDetails);
    if (taskDetails != undefined) {
      settaskinfo(taskDetails);

      if (taskDetails?.SmartInformation !== undefined && taskDetails?.SmartInformation.length > 0) {

        await GetAllTask(taskDetails?.SmartInformation);
        await loadAllSmartInformation(taskDetails?.SmartInformation);
      }
    }

  }
  // ============master task list  to find the serice or component tag in the documents  ============
  const LoadMasterTaskList = () => {
    return new Promise(function (resolve, reject) {

      let web = new Web(props.AllListId?.siteUrl);
      web.lists
        .getById(props?.AllListId.MasterTaskListID).items
        .select(
          "Id",
          "Title",
          "Mileage",
          "TaskListId",
          "TaskListName",
          "PortfolioType/Id",
          "PortfolioType/Title",
          "PortfolioType/Color",
        ).expand("PortfolioType").top(4999).get()
        .then((dataserviccomponent: any) => {
          console.log(dataserviccomponent)
          mastertaskdetails = mastertaskdetails.concat(dataserviccomponent);

          setallSetValue({ ...allValue, masterTaskdetails: mastertaskdetails })
          // return dataserviccomponent
          resolve(dataserviccomponent)

        }).catch((error: any) => {
          console.log(error)
          reject(error)
        })
    })
  }

  //============== AllsmartInformation get in smartInformation list ===========================
  const loadAllSmartInformation = async (SmartInformation: any) => {
    var allSmartInformationglobal: any = [];
    const web = new Web(props?.AllListId?.siteUrl);
    // var Data = await web.lists.getByTitle("SmartInformation")
    var Data = await web.lists.getById(props?.AllListId?.SmartInformationListID)
      .items.select('Id,Title,Description,SelectedFolder,URL,Acronym,InfoType/Id,InfoType/Title,Created,Modified,Author/Name,Author/Title,Author/Title,Author/Id,Editor/Name,Editor/Title,Editor/Id')
      .expand("InfoType,Author,Editor")
      .get()
    console.log(Data)
    setAllSmartInfo(Data)
    if (Data.length > 0) {
      SmartInformation?.map((items: any) => {

        hhhsmartinfoId.push(items?.Id);
        if (SmartInformation?.length > 0) {
          Data?.map(async (tagsmartinfo: any) => {
            if (tagsmartinfo.Title == "Only For Me") {
              setFolderCreated(false)
              // MovefolderItemUrl2 = `/${tagsmartinfo.Id}_.000`
            }
            if (tagsmartinfo?.Id == items?.Id) {

              allSmartInformationglobal.push(tagsmartinfo);

            }
          })
        }
      })
      taskUser?.map((user: any) => {
        allSmartInformationglobal?.map((smartinfo: any) => {
          if (smartinfo?.Author?.Id == user?.AssingedToUser?.Id) {
            smartinfo.Author.AuthorImage = user?.Item_x0020_Cover
          }
          if (smartinfo?.Editor?.Id == user?.AssingedToUser?.Id) {
            smartinfo.Editor.EditorImage = user?.Item_x0020_Cover
          }
        })

      })

      TagDocument(allSmartInformationglobal);
    }
  }


  // ==============Get Documents tag  and link tag inside smartInformation ==========


  const TagDocument = (allSmartInformationglobal: any) => {
    console.log(mastertaskdetails)

    var allSmartInformationglobaltagdocuments: any = [];
    console.log(AllTasktagsmartinfo)
    if (allSmartInformationglobal != undefined && allSmartInformationglobal?.length > 0) {

      allSmartInformationglobal?.map(async (items: any) => {

        const web = new Web(props?.AllListId?.siteUrl);
        await web.lists.getById(props?.AllListId?.DocumentsListID)
          .items.select("Id,Title,PriorityRank,Year,Item_x0020_Cover,Body,Portfolios/Id,Portfolios/Title,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl")
          .expand("Author,Editor,Portfolios").filter(`SmartInformation/ID  eq ${items?.Id}`).top(4999)
          .get()
          .then(async (result: any[]) => {
            console.log(result);
            result?.map((servicecomponent: any) => {
              servicecomponent.Title = servicecomponent.Title.replace('.', "")
              servicecomponent.Description = servicecomponent?.Body
              if (servicecomponent.Portfolios != undefined && servicecomponent.Portfolios.length > 0) {
                mastertaskdetails.map((mastertask: any) => {
                  if (mastertask.Id == servicecomponent.Portfolios[0].Id) {
                    servicecomponent.Portfolio = mastertask
                  }
                })
              }
            })

            console.log(result);
            items.TagDocument = result
            if (AllTasktagsmartinfo != undefined && AllTasktagsmartinfo.length > 0) {
              AllTasktagsmartinfo?.map((task: any) => {
                if (task?.SmartInformation !== undefined && task?.SmartInformation?.length > 0) {
                  task?.SmartInformation?.map((tagtask: any) => {
                    if (tagtask?.Id == items?.Id) {
                      var tagtaskarray: any = [];
                      tagtaskarray.push(task)
                      items.TagTask = tagtaskarray

                    }

                  })

                }
              })
            }
            console.log(items)
            allSmartInformationglobaltagdocuments.push(items)

            if (allSmartInformationglobal?.length == allSmartInformationglobaltagdocuments?.length) {
              setSmartInformation(allSmartInformationglobaltagdocuments)
            }

          }).catch((err) => {
            console.log(err.message);
            setSmartInformation(allSmartInformationglobal)
          });

      })


    }
    else {
      setSmartInformation(allSmartInformationglobal)
    }
    console.log(allSmartInformationglobaltagdocuments)
  }



  //===============move folder to get the forlderName in the choice column ==================

  const SeleteMoveFloderItem = (item: any) => {
    setallSetValue({ ...allValue, SelectedFolder: item })
    setMovefolderItemUrl("/SmartInformation");
    // switch (item) {
    //   case 'Public':
    //     setMovefolderItemUrl("/SmartInformation");
    //     break;
    //   // case 'Memberarea':
    //   //   setMovefolderItemUrl('/Memberarea');
    //   //   break;
    //   // case 'EDA':
    //   //   setMovefolderItemUrl('/EDA Only');
    //   //   break;
    //   case 'Only For Me':
    //     setMovefolderItemUrl('/Only For Me');
    //     break;
    // }
  }
  // ============load SmartMetaData to get the  infoType in popup======================= 

  const LoadSmartMetaData = async () => {
    const web = new Web(props?.AllListId?.siteUrl);


    await web.lists.getById(props?.AllListId?.SmartMetadataListID)
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
    var description = ""
    if (items == '<p></p>\n') {
      description = ""
    } else {
      description = items
    }
    setallSetValue({ ...allValue, Description: description })
  }

  // ============set infoType function ==============

  const InfoType = (InfoType: any) => {
    setallSetValue({ ...allValue, InfoType: InfoType })
  }

  //=========panel header for smartinformation  post and edit ===================
  const onRenderCustomHeadersmartinfo = () => {
    return (
      <>

        <div className='subheading'>
          {popupEdit ? `Add SmartInformation - ${allValue?.Title}` : `Add SmartInformation - ${taskInfo?.Title}`}
        </div>
        <Tooltip ComponentId='3299' />
      </>
    );
  };

  //=========panel header for documents upload and edit  ===================
  const onRenderCustomHeaderDocuments = () => {
    return (
      <>

        <div className='subheading' >
          {Editdocpanel ? `Edit Document Metadata - ${EditdocumentsData?.FileLeafRef}` : null}
        </div>
        <Tooltip ComponentId='3300' />
      </>
    );
  };
  // =============chnage InputField to set the Data=========================
  const changeInputField = (value: any, item: any) => {
    console.log(value);
    console.log(item);
    if (item == "Title") {
      var filterdata: any;
      if (value != "") {
        setallSetValue({ ...allValue, Title: value })
        filterdata = taskInfo?.SmartInformation?.filter((items: any) => {
          if (items?.Title != null && items?.Title != undefined) {
            if (items.Title.toLowerCase().includes(value.toLowerCase())) {
              return items;
            }
          }
        })
        setFiltersmartinfo(filterdata)
      } else {
        setallSetValue({ ...allValue, Title: value })
        setFiltersmartinfo(filterdata)
      }
    }
    if (item == "url") {
      setallSetValue({ ...allValue, URL: value })
    }
    if (item == "Acronym") {
      setallSetValue({ ...allValue, Acronym: value })
    }
    if (item == "fileupload") {
      console.log(value.target.files[0])
      const selectedFile = value?.target?.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setUploaddoc(fileReader.result);
      };
      fileReader.readAsArrayBuffer(selectedFile);
      // setUploaddoc(value.target.files[0])
      let fileName = value?.target?.files[0]?.name
      setallSetValue({ ...allValue, fileupload: fileName });
    }

  }


  //============= save function to save the data inside smartinformation list  ================.

  const saveSharewebItem = async () => {
    var movefolderurl = `${props?.Context?._pageContext?._web.serverRelativeUrl}/Lists/SmartInformation`
    let infotypeSelectedData: any
    console.log(movefolderurl);
    console.log(allValue);
    if ((allValue?.Title == "" && allValue?.Description != "") || (allValue?.Title != "" && allValue?.Description == "") || (allValue?.Title != "" && allValue?.Description != "")) {
      var metaDataId;
      if (SmartMetaData != undefined) {
        SmartMetaData?.map((item: any) => {
          if (item?.Title == allValue?.InfoType) {
            metaDataId = item?.Id;
            infotypeSelectedData = item
          }
        })
      }
      const web = new Web(props?.AllListId?.siteUrl);
      let postdata = {
        Title: allValue?.Title != "" ? allValue?.Title : taskInfo?.Title,
        Acronym: allValue.Acronym != null ? allValue?.Acronym : "",
        InfoTypeId: metaDataId != undefined ? metaDataId : null,
        Description: allValue?.Description != "" ? allValue?.Description : "",
        SelectedFolder: allValue?.SelectedFolder,
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        URL: {
          "__metadata": { type: 'SP.FieldUrlValue' },
          'Description': allValue.URL != undefined ? allValue?.URL : null,
          'Url': allValue.URL != undefined ? allValue?.URL : null,
        }

      }


      //=============edit the data  save function   ===============

      if (popupEdit) {
        // await web.lists.getByTitle("SmartInformation")
        await web.lists.getById(props?.AllListId?.SmartInformationListID)
          .items.getById(editvalue?.Id).update(postdata)
          .then(async (editData: any) => {
            console.log(editData)
            if (props.showHide === "projectManagement") {
              console.log(props.RemarkData)
              let restdata = editData
              let urlcallback: any = {
                Url: postdata?.URL?.Url,
                Description: postdata?.URL?.Description
              }
              // urlcallback.
              let backupremarkdata = props.RemarkData
              restdata.Created = postdata.Created;
              restdata.Description = postdata.Description;
              restdata.URL = urlcallback;
              restdata.Id = editvalue?.Id
              restdata.ID = editvalue?.Id
              restdata.InfoType = infotypeSelectedData;
              restdata.SelectedFolder = postdata.SelectedFolder;
              restdata.Title = postdata.Title;
              restdata.Acronym = postdata.Acronym;
              // backupremarkdata?.SmartInformation[0]?.push(res?.data)
              backupremarkdata?.SmartInformation.splice(0, 1, restdata);
              if (props?.setRemark != undefined) {
                props.setRemark(false)
              }


            }

            GetResult();
            handleClose();
          })
          .catch((error: any) => {
            console.log(error)
          })
      }
      else {

        // await web.lists.getByTitle("SmartInformation")
        await web.lists.getById(props?.AllListId?.SmartInformationListID)
          .items.add(postdata)
          .then(async (res: any) => {
            console.log(res);

            setPostSmartInfo(res)

            hhhsmartinfoId.push(res?.data?.ID)
            await web.lists.getByTitle(props?.listName)
              // await web.lists.getById(props.AllListId.SiteTaskListID)
              .items.getById(props?.Id).update(
                {
                  SmartInformationId: {
                    "results": hhhsmartinfoId
                  }
                }
              ).then(async (data: any) => {
                console.log(data);
                if (props.showHide === "projectManagement" && addSmartInfoPopupAddlinkDoc2 == false) {
                  console.log(props.RemarkData)
                  let backupremarkdata = props?.RemarkData
                  res.data.InfoType = {}
                  res.data.InfoType = infotypeSelectedData;
                  if (backupremarkdata?.SmartInformation != undefined) {
                    backupremarkdata?.SmartInformation?.push(res?.data)
                  }
                  if (props?.callback != undefined || null) {
                    props?.callback()
                  }
                  if (props.setRemark != undefined || null) {
                    props.setRemark(false)
                  }



                }

                if (addSmartInfoPopupAddlinkDoc2 == false) {
                  GetResult();
                  handleClose();
                }



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
      // setallSetValue({...allValue,AstricMesaage:true})
      setaddSmartInfoPopupAddlinkDoc(false)
      addSmartInfoPopupAddlinkDoc2 = false;
    }


  }

  //===========show hide smartInformation===========

  const showhideComposition = (showhideComposition: any) => {
    if (smartInformationArrow) {

      setsmartInformationArrow(false)

    } else {
      setsmartInformationArrow(true)
    }

  }

  //========delete function smartinfomation items ==================

  const deleteSmartinfoData = async (DeletItemId: any) => {
    console.log(DeletItemId);
    if (confirm("Are you sure, you want to delete this?")) {
      const web = new Web(props?.AllListId?.siteUrl);
      // await web.lists.getByTitle("SmartInformation")
      await web.lists.getById(props?.AllListId?.SmartInformationListID)
        .items.getById(DeletItemId).recycle()
        .then((res: any) => {
          console.log(res);
          if (props.showHide === "projectManagement") {
            console.log(props.RemarkData)
            let backupremarkdata = props?.RemarkData
            if (backupremarkdata.SmartInformation !== undefined || null) {
              backupremarkdata.SmartInformation = [];
            }
            if (props.setRemark != undefined || null) {
              props.setRemark(false)
            }

          }
          handleClose();

        })
        .catch((err) => {
          console.log(err.message);
        });
    }

  };

  //========delete function documents  list items ==================


  //======== add document when i click to add document in profile page =========.

  const addDocument = async (Status: any, items: any) => {
    setsmartDocumentpostData(items)
    if (Status == "AddDocument") {
      setshowAdddocument(true)
    }
    else {
      setaddSmartInfoPopupAddlinkDoc(true);
      addSmartInfoPopupAddlinkDoc2 = true;
      await saveSharewebItem();
      // if (addSmartInfoPopupAddlinkDoc) {
      alert('Information saved now items can be attached.');
      setshowAdddocument(true)
      // }

    }





  }

  //======== select title while upload documents================== 
  const SelectedTiles = (items: any) => {
    setSelectedTilesTitle(items)
  }

  // =============upload document function.main ....===============

  const onUploadDocumentFunction = async (controlId: any, uploadType: any) => {
    if ((allValue.fileupload != null && allValue.fileupload != undefined) || allValue.Dragdropdoc != null && allValue.Dragdropdoc != undefined) {


      var folderName = props?.taskTitle?.substring(5, 34).trim();
      var folderUrl = props?.Context?._pageContext?._web.serverRelativeUrl?.toLowerCase() + '/documents'
      var SiteUrl = props?.AllListId?.siteUrl
      var ListTitle = "Documents"
      console.log(folderName);
      console.log(folderUrl);
      console.log(SiteUrl);
      console.log(ListTitle);
      createFolder(folderName)

    }

  }
  //===============create folder function========================

  const createFolder = async (folderName: any) => {
    if (folderName != "") {
      var libraryName = "Documents";
      var newFolderResult = await sp.web?.rootFolder?.folders.getByName(libraryName).folders.add(folderName);
      console.log("Four folders created", newFolderResult);
    }
    uploadDocumentFinal(folderName);
  }

  // ================final document and file  upload  link title update inside folder and outside folder=====================

  const uploadDocumentFinal = async (folderName: any) => {
    const web = new Web(props?.AllListId?.siteUrl);
    var folderPath: any;
    if (folderName != "") {
      folderPath = `Documents/${folderName}`;
    } else {
      folderPath = "Documents"
    }
    let fileName: any = "";
    if (allValue?.fileupload != "") {
      fileName = allValue?.fileupload;
    }
    if (allValue?.LinkTitle != "") {
      fileName = allValue?.LinkTitle;
    }
    if (allValue?.Dragdropdoc != "") {
      fileName = allValue?.Dragdropdoc;
    }

    const folder = web.getFolderByServerRelativeUrl(folderPath);
    const fileContents = "This is a test file.";
    folder.files.add(fileName, fileContents).then((item: any) => {
      console.log(item)
      console.log(`File ${fileName} uploaded to ${folderPath}`);
      getAll(folderName, folderPath);
    }).catch((error) => {
      console.log(error);
    });

  }
  // ===========get file upload data and Id ============= .

  const getAll = async (folderName: any, folderPath: any) => {
    let fileName: any = "";
    if (allValue?.fileupload != "") {
      fileName = allValue?.fileupload;
    }
    if (allValue?.LinkTitle != "") {
      fileName = allValue?.LinkTitle;
    }
    if (allValue?.Dragdropdoc != "") {
      fileName = allValue?.Dragdropdoc;
    }
    await sp.web.getFileByServerRelativeUrl(`${props?.Context?._pageContext?._web?.serverRelativeUrl}/${folderPath}/${fileName}`).getItem()
      .then(async (res: any) => {
        console.log(res);
        setShow(false);

        //========update  the smartinformation in the file inside Documents list ============ .

        console.log(taskInfo);
        var tagcomponetServicesId: any;


        if (taskInfo?.Portfolio != undefined) {
          tagcomponetServicesId = taskInfo.Portfolio.Id;

        }
        console.log(PostSmartInfo)
        console.log(EditSmartinfoValue);
        var smartinfoData: any;
        if (PostSmartInfo != undefined) {
          smartinfoData = PostSmartInfo.data
        } else {
          smartinfoData = EditSmartinfoValue
        }

        const web = new Web(props?.AllListId?.siteUrl);
        const updatedItem = await web.lists.getById(props?.AllListId?.DocumentsListID)
          .items.getById(res.Id).update({
            SmartInformationId: { "results": smartDocumentpostData != undefined ? [smartDocumentpostData?.Id] : [smartinfoData?.Id] },
            Title: fileName.split(".")[0],
            PortfoliosId: { "results": tagcomponetServicesId != undefined ? [tagcomponetServicesId] : [] },
            Body: allValue?.Description,
            Url: {
              "__metadata": { type: 'SP.FieldUrlValue' },
              'Description': allValue?.LinkUrl != "" ? allValue?.LinkUrl : "",
              'Url': allValue?.LinkUrl != "" ? allValue?.LinkUrl : "",
            }
            // Url:allValue?.LinkUrl!=""?allValue?.LinkUrl:""
          });
        console.log(updatedItem)
        if (allValue?.LinkUrl != "") {
          alert("Link upload successfully");

        } else {
          alert("Document(s) upload successfully");
        }
        addSmartInfoPopupAddlinkDoc2 = false;
        handleClose();
        if (props.showHide === "projectManagement") {
          if (props?.callback != undefined || null) {
            props?.callback()
          }
        }
        GetResult();
        setshowAdddocument(false)
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  //==========create Task function============
  const creatTask = async () => {
    console.log(props?.listName)
    if (allValue?.taskTitle != null) {
      const web = new Web(props?.AllListId?.siteUrl)
      await web.lists.getByTitle(props?.listName).items.add(
        {
          Title: allValue?.taskTitle,
          SmartInformationId: { "results": [(smartDocumentpostData?.Id)] }

        }
      )
        .then((res: any) => {
          console.log(res);
          alert("task created")
          addSmartInfoPopupAddlinkDoc2 = false;
          GetResult();
          handleClose();
          setshowAdddocument(false)
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      alert("please Mention Task Title")
    }

  }

  //======================= Edit documents  and link function ===================
  const editDocumentsLink = (editData: any) => {
    setEditdocpanel(true);
    console.log(editData)
    if (editData?.Portfolios != undefined && editData?.Portfolios?.length > 0) {

      // if (editData?.Portfolio?.Portfolio_x0020_Type == "Component") {
      if (editData?.Portfolio != undefined) {
        setallSetValue({ ...allValue, componentservicesetdataTag: editData?.Portfolio })
        // setservicespopup(false);
        // setcomponentpopup(true);
      }
      // else {
      //   setallSetValue({ ...allValue, componentservicesetdataTag: editData?.SharewebTask[0] })

      //   setservicespopup(true);
      //   setcomponentpopup(false);
      // }
    }
    setEditdocumentsData(editData);
  }
  const callbackeditpopup = () => {
    GetResult();
    setEditdocpanel(false);
  }

  // =====================component services click radio butoon on update documents===============

  // const checkradiobutton = (e: any, items: any) => {
  //   if (items == "Component") {
  //     setservicespopup(false);
  //     setcomponentpopup(true);
  //     setallSetValue({ ...allValue, componentservicesetdataTag: undefined })

  //   }
  //   if (items == "Service") {
  //     setservicespopup(true);
  //     setcomponentpopup(false);
  //     setallSetValue({ ...allValue, componentservicesetdataTag: undefined })

  //   }
  // }



  //=======Edit Task details function .==========
  const edittaskpopup = (editTaskData: any) => {
    console.log(editTaskData);
    editTaskData.siteUrl = props?.AllListId?.siteUrl;
    editTaskData.listName = props?.listName;
    setEditTaskdata(editTaskData);
    setallSetValue({ ...allValue, EditTaskpopupstatus: true })
  }

  //======taskpopup call back function =====
  const CallBack = () => {
    setallSetValue({ ...allValue, EditTaskpopupstatus: false })
  }
  //================all Task load function ===========
  const GetAllTask = (smartinfoData: any) => {
    smartinfoData.map(async (smartinfoData: any) => {
      var web = new Web(props?.AllListId?.siteUrl)
      await web.lists.getByTitle(props?.listName).items.select("Id,Title,SmartInformation/Id,SmartInformation/Title").filter(`SmartInformation/Id eq ${smartinfoData?.Id}`).expand("SmartInformation").get()
        .then((Data: any[]) => {
          if (Data != undefined && Data.length > 0) {
            Data.map((items: any) => {
              if (items.Id != props.Id) {
                AllTasktagsmartinfo.push(items)
              }
            })
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    })

  }
  //============ itemRank drop down array=========
  let ItemRank = [
    { rankTitle: 'Select Item Rank', rank: null },
    { rankTitle: '(8) Top Highlights', rank: 8 },
    { rankTitle: '(7) Featured Item', rank: 7 },
    { rankTitle: '(6) Key Item', rank: 6 },
    { rankTitle: '(5) Relevant Item', rank: 5 },
    { rankTitle: '(4) Background Item', rank: 4 },
    { rankTitle: '(2) to be verified', rank: 2 },
    { rankTitle: '(1) Archive', rank: 1 },
    { rankTitle: '(0) No Show', rank: 0 }
  ]




  //================ drag and drop function or mthod ===================

  const _getDropFiles = (files: any) => {
    for (var i = 0; i < files.length; i++) {
      console.log("Filename: " + files[i]?.name);
      console.log("Path: " + files[i]?.fullPath);
      setallSetValue({ ...allValue, Dragdropdoc: files[i]?.name });

    }
  }

  //========service and component call back function =================

  const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
    console.log(DataItem)
    console.log(Type)
    console.log(functionType)
    if (functionType == "Save") {
      // if (Type == "Component") {
      //   setallSetValue({ ...allValue, componentservicesetdataTag: DataItem[0] })
      // }
      // if (Type == "Service") {
      setallSetValue({ ...allValue, componentservicesetdataTag: DataItem[0] })
    }
    setisopencomonentservicepopup(false);

    // else {
    //   setisopencomonentservicepopup(false);
    // }
  }, [])

  //============ update documents link update both  function =============

  // const updateDocumentsData = async () => {
  //   console.log(EditdocumentsData);
  //   console.log(allValue.Title);
  //   console.log(allValue.DocumentType);
  //   console.log(allValue.componentservicesetdata);
  //   console.log(allValue.ItemRank);
  //   var componetServicetagData: any;
  //   if (allValue.componentservicesetdata.smartComponent != undefined) {
  //     componetServicetagData = allValue.componentservicesetdata.smartComponent.Id;
  //   }
  //   if (allValue.componentservicesetdata.linkedComponent != undefined) {
  //     componetServicetagData = allValue.componentservicesetdata.linkedComponent.Id;
  //   }

  //   const web = new Web(props?.AllListId?.siteUrl);
  //   await web.lists.getById(props?.AllListId?.DocumentsListID)
  //     .items.getById(EditdocumentsData.Id).update({
  //       Title: EditdocumentsData.Title,
  //       ItemRank: EditdocumentsData.ItemRank,
  //       Year: EditdocumentsData.Year,
  //       ItemType: EditdocumentsData.ItemType,

  //       PortfoliosId: { "results": allValue.componentservicesetdataTag != undefined ? [allValue.componentservicesetdataTag.Id] : [] },
  //       Body:allValue?.Description,
  //       Item_x0020_Cover: {
  //         "__metadata": { type: 'SP.FieldUrlValue' },
  //         'Description': EditdocumentsData?.Item_x0020_Cover?.Url != "" ? EditdocumentsData?.UrItem_x0020_Coverl?.Url : "",
  //         'Url': EditdocumentsData?.Item_x0020_Cover?.Url ? EditdocumentsData?.Item_x0020_Cover?.Url : "",
  //       },
  //       Url: {
  //         "__metadata": { type: 'SP.FieldUrlValue' },
  //         'Description': EditdocumentsData?.Url?.Url != "" ? EditdocumentsData?.Url?.Url : "",
  //         'Url': EditdocumentsData?.Url?.Url ? EditdocumentsData?.Url?.Url : "",
  //       }

  //     }).then((updatedItem: any) => {
  //       console.log(updatedItem)
  //       if (EditdocumentsData?.Url != undefined) {
  //         alert(" Link update successfully");
  //       } else {
  //         alert("Document(s) update successfully");
  //       }
  //       handleClose();
  //       setallSetValue({ ...allValue, EditTaskpopupstatus: false })
  //       setEditdocpanel(false);
  //       GetResult();
  //     }).catch((err: any) => {
  //       console.log(err)
  //     })

  //   // })

  // }
  const checkboxFunction = (e: any) => {
    console.log(e);
    if (e.currentTarget.checked) {
      setallSetValue({ ...allValue, Title: `Quick-${taskInfo?.Title}-${Today}` })
    } else {
      setallSetValue({ ...allValue, Title: "" })
    }

  }
  const onclickfilteritems = (items: any) => {
    setallSetValue({ ...allValue, Title: items })
    setFiltersmartinfo([])
  }
  const imageTabCallBack = React.useCallback((data: any) => {
    console.log(EditdocumentsData);
    console.log(data)
    setEditdocumentsData(data);
  }, [])
  const closeDoc = () => {
    addSmartInfoPopupAddlinkDoc2 = false;
    handleClose()
  }
  return (
    <div>

      {(props?.showHide != "projectManagement" && SmartInformation?.length > 0) && <div className='mb-3 card commentsection'>
        <div className='card-header'>
          <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">SmartInformation
            <span className='alignCenter'>
              <span onClick={() => handleShow(null, "add")} className='svg__iconbox svg__icon--Plus mini hreflink' title="Add SmartInformation"></span>
              <Tooltip ComponentId='993' /></span></div>
        </div>

        {SmartInformation != null && SmartInformation.length > 0 && <div className="Sitecomposition p-2">{SmartInformation?.map((SmartInformation: any, i: any) => {
          if ((props?.Context?.pageContext?.legacyPageContext?.userId == SmartInformation?.Author?.Id && SmartInformation?.SelectedFolder == "Only For Me") || SmartInformation.SelectedFolder == "Public") {
            return (
              <>
                <div className='border dropdown mt-2 '>
                  <div className='bg-ee d-flex py-1 '>
                    <span className='full-width'>
                      <a onClick={() => showhideComposition(SmartInformation)}>
                        <span >{smartInformationArrow ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span >
                        <span className="pe-3">{SmartInformation?.Title != undefined ? SmartInformation?.Title : ""}</span>
                      </a>

                    </span>
                    <span className='alignCenter'>
                      <a style={{ cursor: "pointer" }}
                        onClick={() => handleShow(SmartInformation, "edit")}>
                        <span className='svg__iconbox svg__icon--editBox hreflink' title="Edit SmartInformation"></span></a>
                      <a style={{ cursor: "pointer" }} onClick={() => addDocument("AddDocument", SmartInformation)}>
                        <span className='svg__iconbox svg__icon--Plus mini hreflink' title="Add Document"></span>
                      </a>
                    </span>
                  </div>

                  <div className="border-0 border-bottom m-0 spxdropdown-menu" style={{ display: smartInformationArrow ? 'block' : 'none', fontSize: "small" }}>
                    <div className="p-1 px-2" style={{ fontSize: "small" }} dangerouslySetInnerHTML={{ __html: SmartInformation?.Description != null ? SmartInformation?.Description : "No description available" }}></div>
                    {SmartInformation?.TagDocument != undefined && SmartInformation?.TagDocument?.length > 0 && SmartInformation?.TagDocument?.map((item: any, index: any) => {
                      return (
                        <div className='card-body p-1 bg-ee mt-1'>
                          <ul className='alignCenter list-none'>
                            <li>
                              <span><a href={item?.EncodedAbsUrl}>
                                {item?.File_x0020_Type == "pdf" && <span className='svg__iconbox svg__icon--pdf' title="pdf"></span>}
                                {item?.File_x0020_Type == "docx" && <span className='svg__iconbox svg__icon--docx' title="docx"></span>}
                                {item?.File_x0020_Type == "csv" || item?.File_x0020_Type == "xlsx" && <span className='svg__iconbox svg__icon--csv' title="csv"></span>}
                                {item?.File_x0020_Type == "jpeg" || item?.File_x0020_Type == "jpg " && <span className='svg__iconbox svg__icon--jpeg' title="jpeg"></span>}
                                {item?.File_x0020_Type == "ppt" || item?.File_x0020_Type == "pptx" && <span className='svg__iconbox svg__icon--ppt' title="ppt"></span>}
                                {item?.File_x0020_Type == "svg" && <span className='svg__iconbox svg__icon--svg' title="svg"></span>}
                                {item?.File_x0020_Type == "zip" && <span className='svg__iconbox svg__icon--zip' title="zip"></span>}
                                {item?.File_x0020_Type == "png" && <span className='svg__iconbox svg__icon--png' title="png"></span>}
                                {item?.File_x0020_Type == "txt" && <span className='svg__iconbox svg__icon--txt' title="txt"></span>}
                                {item?.File_x0020_Type == "smg" && <span className='svg__iconbox svg__icon--smg' title="smg"></span>}
                                {item.Url != null && <span className='svg__iconbox svg__icon--link' title="smg"></span>}
                              </a></span>
                            </li>
                            <li>
                              {item.Url == null && <span><a className='px-2' href={`${item?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off"> <span>{item?.Title}</span></a></span>}
                              {item.Url != null && <span><a className='px-2' href={`${item?.Url?.Url}`} target="_blank" data-interception="off"> <span>{item?.Title}</span></a></span>}
                            </li>
                            <li className='d-end'>
                              <span title="Edit" className="svg__iconbox svg__icon--edit hreflink" onClick={() => editDocumentsLink(item)}></span>
                            </li>

                          </ul>
                        </div>
                      )
                    })}
                    {SmartInformation.TagTask != undefined && SmartInformation?.TagTask?.length > 0 && SmartInformation?.TagTask?.map((tagtask: any) => {
                      return (
                        <div className='card-body p-0 bg-ee mt-1'>
                          <ul className='alignCenter list-none'>
                            <li>
                              <span><a href={`${props.AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${tagtask?.Id}&Site=${props?.listName}`}><span className='bg-secondary svg__iconbox svg__icon--Task'></span></a></span>
                            </li>
                            <li>
                              <span className='px-2'><a href={`${props?.AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${tagtask?.Id}&Site=${props?.listName}`}>{tagtask?.Title}</a></span>
                            </li>
                            <li className='d-end'>
                              <span title="Edit" className="svg__iconbox svg__icon--edit hreflink" onClick={(e) => edittaskpopup(tagtask)}></span>
                            </li>
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                  <div className="p-1 px-2" style={{ fontSize: "x-small" }}><span className='pe-2'>Created By</span><span className='pe-2'>{SmartInformation?.Created != undefined ? moment(SmartInformation?.Created).format("DD/MM/YYYY") : ""}</span><span className='round px-1'>{SmartInformation?.Author?.AuthorImage != undefined ? <img className='align-self-start' title={SmartInformation?.Author?.Title} src={SmartInformation?.Author?.AuthorImage?.Url} /> : ""}</span></div>
                  <div className="p-1 px-2" style={{ fontSize: "x-small" }}><span className='pe-2'>Modified By</span><span className='pe-2'>{SmartInformation?.Modified != undefined ? moment(SmartInformation?.Modified).format("DD/MM/YYYY") : ""}</span><span className='round px-1'>{SmartInformation?.Editor?.EditorImage != undefined ? <img className='align-self-start' title={SmartInformation?.Editor?.Title} src={SmartInformation?.Editor?.EditorImage?.Url} /> : ""}</span></div>
                </div>
                <div></div>
              </>)
          }

        })}

        </div>}

        {/* <div className='border card-body p-1 text-end'>
          <a style={{ cursor: "pointer" }} onClick={() => handleShow(null, "add")}><span>+ Add SmartInformation</span></a>
        </div> */}


      </div>}
      {/* ================= smartInformation add and edit panel=========== */}

      <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
        isOpen={show}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClose}>
        <div>
          <div className="row">
            <dl className="align-items-center d-flex Hz-align ">
              <dt>
                Select Permission:
              </dt>
              <dt className='SpfxCheckRadio '><input type="radio" className='radio' checked={allValue?.SelectedFolder == "Public"} value="Public" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>Global</label></dt>
              <dt className='SpfxCheckRadio '><input type="radio" className='radio' checked={allValue?.SelectedFolder == "Only For Me"} value="Only For Me" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>Only for me</label></dt>

              {/* <dt><input type="radio" checked={allValue?.SelectedFolder == "Memberarea"} value="Memberarea" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>Memberarea</label></dt> */}
              {/* <dt><input type="radio" checked={allValue?.SelectedFolder == "EDA"} value="EDA" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>EDA Only</label></dt>
              <dt><input type="radio" checked={allValue?.SelectedFolder == "team"} value="team" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>Team</label></dt> */}

            </dl>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor="Title" className='full-width'>Title
                <span className='ml-1 mr-1 text-danger'>*</span>
                {popupEdit != true && <span className='mx-2'><input type="checkbox" className="form-check-input" onClick={(e) => checkboxFunction(e)} /></span>}</label>
              <input type="text" className="full-width" value={allValue?.Title} id="Title" onChange={(e) => changeInputField(e.target.value, "Title")} />
              {/* {allValue.AstricMesaage &&<span className='ml-1 mr-1 text-danger'>Please enter your Title !</span>} */}
              {filterSmartinfo != undefined && filterSmartinfo.length > 0 && <div className='bg-Fa border overflow-auto'><ul className='list-group mx-2 tex'> {filterSmartinfo.map((smartinfofilter: any) => {
                return (
                  < >
                    <li onClick={() => onclickfilteritems(smartinfofilter.Title)}> {smartinfofilter.Title}</li>
                  </>
                )
              })}
              </ul>
              </div>}
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
              <label htmlFor="Acronym" className='full-width'>Acronym</label>
              <input type="text" className='full-width' id="Acronym" value={allValue?.Acronym} onChange={(e) => changeInputField(e.target.value, "Acronym")} />
            </div>}
          </div>
        </div>
        <div className='mt-3'> <HtmlEditorCard editorValue={allValue?.Description != null ? allValue?.Description : ""} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard></div>
        <footer className='text-end mt-2'>
          <div className='col-sm-12 row m-0'>
            <div className="col-sm-6 text-lg-start ps-1">
              {popupEdit && <div><div><span className='pe-2'>Created</span><span className='pe-2'>{editvalue?.Created !== null ? moment(editvalue?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{editvalue?.Author?.Title}</a></span></div>
                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{editvalue?.Modified !== null ? moment(editvalue?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{editvalue?.Editor?.Title}</a></span></div>
                <div className='alignCenter'>Delete this item<span className="svg__iconbox svg__icon--trash" onClick={() => deleteSmartinfoData(editvalue.Id)}> </span></div>
              </div>}
            </div>

            <div className='col-sm-6 mt-2 p-0'>
              {popupEdit && <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.Context?._pageContext?._web?.absoluteUrl}/Lists/SmartInformation/EditForm.aspx?ID=${editvalue?.Id != null ? editvalue?.Id : null}`}>Open out-of-the-box form |</a></span>}
              <span><a title='Add Link/ Document' style={{ cursor: "pointer" }} onClick={() => addDocument("popupaddDocument", editvalue)}>Add Link/ Document</a></span>
              <Button className='btn btn-primary ms-1 me-1' onClick={saveSharewebItem}>
                Save
              </Button>
              <Button className='btn btn-default mx-1' onClick={() => handleClose()}>
                Cancel
              </Button>


            </div>
          </div>
        </footer>
      </Panel>


      {/* ================ upload documents link task  panel=========== */}

      <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
        isOpen={showAdddocument}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={closeDoc}>
        <div >

          <div className='bg-ee d-flex justify-content-center py-4 text-center'>
            <a className={SelectedTilesTitle == "UploadDocument" ? "bg-69 me-2 pe-5 px-4 py-2 BoxShadow" : "bg-69 me-2 pe-5 px-4 py-2"} style={{ cursor: "pointer" }} onClick={() => SelectedTiles('UploadDocument')}>
              <p className='full-width floar-end'>
                Document
              </p>

              <img src="https://hhhhteams.sharepoint.com/sites/Joint/SiteCollectionImages/Tiles/Tile_LibraryBooks.png" title="Documents" data-themekey="#" />


            </a>
            <a className={SelectedTilesTitle == "UploadEmail" ? "bg-69 me-2 pe-5 px-4 py-2 BoxShadow" : "bg-69 me-2 pe-5 px-4 py-2"} style={{ cursor: "pointer" }} onClick={() => SelectedTiles('UploadEmail')}>
              <p className='full-width floar-end'>
                Email
              </p>
              <img src="https://hhhhteams.sharepoint.com/sites/Joint/SiteCollectionImages/Tiles/Tile_MailPlus.png" title="Mail" data-themekey="#" />


            </a>
            <a className={SelectedTilesTitle == "CreateLink" ? "bg-69 me-2 pe-5 px-4 py-2 BoxShadow" : "bg-69 me-2 pe-5 px-4 py-2"} style={{ cursor: "pointer" }} onClick={() => SelectedTiles('CreateLink')}>
              <p className='full-width floar-end'>
                Link
              </p>
              <img src="https://hhhhteams.sharepoint.com/sites/Joint/SiteCollectionImages/Tiles/Tile_Links.png" title="Links" data-themekey="#" />


            </a>
            <a className={SelectedTilesTitle == "Task" ? "bg-69 me-2 pe-5 px-4 py-2 BoxShadow" : "bg-69 me-2 pe-5 px-4 py-2"} style={{ cursor: "pointer" }} onClick={() => SelectedTiles('Task')}>
              <p className='full-width floar-end'>
                Task
              </p>
              <img src="https://hhhhteams.sharepoint.com/sites/Joint/SiteCollectionImages/Tiles/Tile_Task.png" title="Tasks" data-themekey="#" />
            </a>

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
              <div className='BorderDas py-5 px-2 text-center'> {allValue?.Dragdropdoc == "" && <span>Drag and drop here...</span>}
                <span>{allValue?.Dragdropdoc != "" ? allValue?.Dragdropdoc : ""}</span>
              </div>

            </DragDropFiles>
            <div className='row'>
              <div className='col-md-6'>
                <input type='file' onChange={(e) => changeInputField(e, "fileupload")} className="full-width mt-3"></input>
              </div>
              <div className='col-md-6'><input type="text" className="full-width mt-3" placeholder='Rename your document' value={allValue?.fileupload != "" ? allValue?.fileupload : ""}></input></div>
            </div>
            <div className='mt-2 text-end' >
              <button className='btn btn-primary mx-3 text-end ' onClick={(e) => onUploadDocumentFunction("uploadFile", "UploadDocument")}>upload</button>
              <Button className='btn btn-default text-end  btn btn-primary' onClick={() => closeDoc()}>
                Cancel
              </Button> </div>
          </div>}
          {SelectedTilesTitle === "UploadEmail" && <div>
            <div className='mt-2 emailupload'>Email</div>
            <DragDropFiles
              dropEffect="copy"
              // enable={true}  
              onDrop={_getDropFiles}
              iconName="Upload"
              labelMessage="Drag and drop here..."
            >
              <div className='BorderDas py-5 px-2 text-center'> {allValue?.emailDragdrop == "" && <span>Drag and drop here...</span>}
                <span>{allValue?.emailDragdrop != "" ? allValue?.emailDragdrop : ""}</span>
              </div>
            </DragDropFiles>
            <div className='text-lg-end mt-2'><Button className='btn btn-default text-end  btn btn-primary' onClick={() => closeDoc()}>Cancel</Button></div>
          </div>}
          {SelectedTilesTitle === "CreateLink" && <div><div className="card mt-3 ">
            <div className="card-header">
              Link</div>
            <div className='mx-3 my-2'><label htmlFor="Name">Name</label>
              <input type='text' id="Name" className="form-control" placeholder='Name' value={allValue?.LinkTitle != "" ? allValue?.LinkTitle : null} onChange={(e) => setallSetValue({ ...allValue, LinkTitle: e.target.value })}></input>
            </div>
            <div className='mx-3 my-2'><label htmlFor="url">Url</label>
              <input type='text' id="url" className="form-control" placeholder='Url' value={allValue.LinkUrl != "" ? allValue?.LinkUrl : null} onChange={(e) => setallSetValue({ ...allValue, LinkUrl: e.target.value })}></input>
            </div>

            <div className='text-lg-end mt-2'><Button className='btn btn-default mx-3 my-2 text-end' onClick={() => uploadDocumentFinal("")}>Create</Button></div>

          </div>

          </div>}
          {SelectedTilesTitle === "Task" && <div className='card mt-3'>
            <div className='card-header'>Task</div>
            <div className='mx-3 my-2'><label htmlFor="Title">Title</label>
              <input type='text' id="Title" className="form-control" placeholder='Name' onChange={(e) => setallSetValue({ ...allValue, taskTitle: e.target.value })}></input>
            </div>
            <div className='text-lg-end mt-2'><Button className='btn btn-default mx-3 my-2 text-end' onClick={creatTask}>Create</Button></div>
          </div>}
        </div>

      </Panel>

      {/* ===============edit  uploaded documents and link both  data panel============== */}
      {Editdocpanel && <EditDocument editData={EditdocumentsData} AllListId={props.AllListId} Context={props.Context} editdocpanel={Editdocpanel} callbackeditpopup={callbackeditpopup} />}
      {allValue.EditTaskpopupstatus && <EditTaskPopup Items={EditTaskdata} context={props?.Context} AllListId={props?.AllListId} Call={() => { CallBack() }} />}
      {/* {isopencomonentservicepopup && componentpopup && <ComponentPortPolioPopup props={allValue?.componentservicesetdata} Call={ServiceComponentCallBack} Dynamic={props.AllListId}></ComponentPortPolioPopup>}
      {isopencomonentservicepopup && servicespopup && <LinkedComponent props={allValue?.componentservicesetdata} Call={ServiceComponentCallBack} Dynamic={props.AllListId}></LinkedComponent>} */}
      {isopencomonentservicepopup &&
        <ServiceComponentPortfolioPopup

          props={allValue?.componentservicesetdata}
          Dynamic={props.AllListId}
          ComponentType={"Component"}
          Call={ComponentServicePopupCallBack}

        />
      }
      {/* {isopencomonentservicepopup && servicespopup &&
        <ServiceComponentPortfolioPopup
          props={allValue?.componentservicesetdata}
          Dynamic={props.AllListId}
          Call={ComponentServicePopupCallBack}
          ComponentType={"Service"}

        />
      } */}
    </div>


  )
}
export default forwardRef(SmartInformation);


