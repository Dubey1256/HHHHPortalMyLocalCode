import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { useState, useEffect } from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { Button, Tabs, Tab, Col, Nav, Row } from 'react-bootstrap';

import HtmlEditorCard from '../../../globalComponents/./HtmlEditor/HtmlEditor'
import pnp, { sp, Web } from "sp-pnp-js";
import * as moment from "moment-timezone";
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { DragDropFiles } from "@pnp/spfx-controls-react/lib/DragDropFiles";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import ComponentPortPolioPopup from "../../EditPopupFiles/ComponentPortfolioSelection"
import LinkedComponent from '../../../globalComponents/EditTaskPopup/LinkedComponent'
import ImageTabComponenet from './ImageTabComponent'
import { Mention } from 'react-mentions';
let AllTasktagsmartinfo: any = [];
let hhhsmartinfoId: any = [];
let mastertaskdetails: any;
let checkboxTitle: any;
const SmartInformation = (props: any) => {
  const [show, setShow] = useState(false);
  const [popupEdit, setpopupEdit] = useState(false);
  const [smartInformationArrow, setsmartInformationArrow] = useState(true);
  const [allValue, setallSetValue] = useState({
    Title: "", URL: "", Acronym: "", Description: "", InfoType: "SmartNotes", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [],
  })
  const [imageTabOpen, setImageTabOpen] = useState(false);
  const [filterSmartinfo, setFiltersmartinfo] = useState([]);
  const [masterTaskdetails, setMasterTaskdetails] = useState([]);
  const [isopencomonentservicepopup, setisopencomonentservicepopup] = useState(false);
  const [componentpopup, setcomponentpopup] = useState(false);
  const [servicespopup, setservicespopup] = useState(false);
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
  const handleClose = () => {
    setpopupEdit(false);
    setshowAdddocument(false);
    setSelectedTilesTitle("")
    setShow(false);
    seteditvalue(null);
    setallSetValue({ ...allValue, Title: "", URL: "", Acronym: "", Description: "", InfoType: "SmartNotes", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [] });

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

      setShow(true);
    }

  }

  useEffect(() => {
    GetResult();
    LoadMasterTaskList();
  }, [show])

  // ===============get smartInformationId tag in task========================
  const GetResult = async () => {
    AllTasktagsmartinfo = [];
    let web = new Web(props.AllListId?.siteUrl);
    let taskDetails: any = [];

    taskDetails = await web.lists
      .getByTitle(props?.listName)
      // .getById(props.AllListId.SiteTaskListID)
      .items
      .getById(props?.Id)
      .select("Id", "Title", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "SmartInformation/Id", "SmartInformation/Title")
      .expand("SmartInformation", "Component", "Services")
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
  const LoadMasterTaskList = async (): Promise<any> => {
    let web = new Web(props.AllListId?.siteUrl);
    await web.lists
      .getById(props?.AllListId.MasterTaskListID).items
      .select(
        "Id",
        "Title",
        "Mileage",
        "TaskListId",
        "TaskListName",
        "Portfolio_x0020_Type"
      ).top(4999).get()
      .then((dataserviccomponent: any) => {
        console.log(dataserviccomponent)
        mastertaskdetails = dataserviccomponent;
        setMasterTaskdetails(dataserviccomponent);
        setallSetValue({ ...allValue, masterTaskdetails: dataserviccomponent })
        return dataserviccomponent
      }).catch((error: any) => {
        console.log(error)
      })

  }

  //============== AllsmartInformation get in smartInformation list ===========================
  const loadAllSmartInformation = async (SmartInformation: any) => {
    var allSmartInformationglobal: any = [];
    const web = new Web(props?.AllListId?.siteUrl);
    // var Data = await web.lists.getByTitle("SmartInformation")
    var Data = await web.lists.getById(props?.AllListId?.SmartInformationListID)
      .items.select('Id,Title,Description,SelectedFolder,URL,Acronym,InfoType/Id,InfoType/Title,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title')
      .expand("InfoType,Author,Editor")
      .get()
    console.log(Data)
    setAllSmartInfo(Data)
    if (Data.length > 0) {
      SmartInformation?.map((items: any) => {
        hhhsmartinfoId.push(items?.Id);
        if (SmartInformation?.length > 0) {
          Data?.map(async (tagsmartinfo: any) => {
            if (tagsmartinfo?.Id == items?.Id) {

              if (tagsmartinfo.Description != null && tagsmartinfo?.Description.includes("<p></p>")) {
                tagsmartinfo.Description = null;
              }
              allSmartInformationglobal.push(tagsmartinfo);

            }
          })
        }
      })
      TagDocument(allSmartInformationglobal);
    }
  }


  // ==============Get Documents tag  and link tag inside smartInformation ==========


  const TagDocument = (allSmartInformationglobal: any) => {
    console.log(mastertaskdetails)
    console.log(masterTaskdetails);
    var allSmartInformationglobaltagdocuments: any = [];
    console.log(AllTasktagsmartinfo)
    if (allSmartInformationglobal != undefined && allSmartInformationglobal?.length > 0) {

      allSmartInformationglobal?.map(async (items: any) => {

        const web = new Web(props?.AllListId?.siteUrl);
        await web.lists.getById(props?.AllListId?.DocumentsListID)
          .items.select("Id,Title,Priority_x0020_Rank,Year,SharewebTask/Id,SharewebTask/Title,SharewebTask/ItemType,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl")
          .expand("Author,Editor,SharewebTask").filter(`SmartInformation/ID  eq ${items?.Id}`).top(4999)
          .get()
          .then(async (result: any[]) => {
            console.log(result);
            result?.map((servicecomponent: any) => {
              if (servicecomponent.SharewebTask != undefined && servicecomponent.SharewebTask.length > 0) {
                mastertaskdetails.map((mastertask: any) => {
                  if (mastertask.Id == servicecomponent.SharewebTask[0].Id) {
                    servicecomponent.SharewebTask[0] = mastertask
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

  const OnChnageTab = () => {
    console.log("sdf hfdsgbsd fbgregre==================");
    setImageTabOpen(true);
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
    setallSetValue({ ...allValue, Description: items })
  }

  // ============set infoType function ==============

  const InfoType = (InfoType: any) => {
    setallSetValue({ ...allValue, InfoType: InfoType })
  }

  //=========panel header for smartinformation  post and edit ===================
  const onRenderCustomHeadersmartinfo = () => {
    return (
      <>

        <div className='ps-4' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
          {popupEdit ? `Add SmartInformation - ${allValue?.Title}` : `Add SmartInformation - ${taskInfo?.Title}`}
        </div>
        <Tooltip ComponentId='993' />
      </>
    );
  };
  //=========panel header for documents upload and edit  ===================
  const onRenderCustomHeaderDocuments = () => {
    return (
      <>

        <div className='ps-4 siteColor' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
          {Editdocpanel ? `Edit Document Metadata - ${EditdocumentsData?.FileLeafRef}` : null}
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

    console.log(movefolderurl);
    console.log(allValue);
    if (allValue?.Title !== null && allValue?.Title !== "") {
      var metaDataId;
      if (SmartMetaData != undefined) {
        SmartMetaData?.map((item: any) => {
          if (item?.Title == allValue?.InfoType) {
            metaDataId = item?.Id;
          }
        })
      }
      const web = new Web(props?.AllListId?.siteUrl);
      let postdata = {
        Title: allValue?.Title != null ? allValue?.Title : "",
        Acronym: allValue.Acronym != null ? allValue?.Acronym : "",
        InfoTypeId: metaDataId != undefined ? metaDataId : null,
        Description: allValue?.Description != null ? allValue?.Description : "",
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
            if ((MovefolderItemUrl == "/Memberarea" || MovefolderItemUrl == "/EDA Only" || MovefolderItemUrl == "/Team") && editvalue.SelectedFolder == "Public") {
              let movedata = await web
                .getFileByServerRelativeUrl(`${movefolderurl}/${editvalue?.Id}_.000`).moveTo(`${movefolderurl}${MovefolderItemUrl}/${editvalue?.Id}_.000`);
              console.log(movedata);
            }
            if ((MovefolderItemUrl == "/Memberarea" || MovefolderItemUrl == "/EDA Only" || MovefolderItemUrl == "/Team") && (editvalue.SelectedFolder == "Memberarea" || editvalue.SelectedFolder == "EDA Only")) {
              let movedata = await web
                .getFileByServerRelativeUrl(`${movefolderurl}/${editvalue.SelectedFolder}/${editvalue?.Id}_.000`).moveTo(`${movefolderurl}${MovefolderItemUrl}/${editvalue?.Id}_.000`);
              console.log(movedata);
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
            if (MovefolderItemUrl == "/Memberarea" || MovefolderItemUrl == "/EDA Only" || MovefolderItemUrl == "/Team") {
              let movedata = await web
                .getFileByServerRelativeUrl(`${movefolderurl}/${res?.data?.ID}_.000`).moveTo(`${movefolderurl}${MovefolderItemUrl}/${res?.data?.ID}_.000`);
              console.log(movedata);
            }
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

                GetResult();
                handleClose();


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
    const web = new Web(props?.AllListId?.siteUrl);
    // await web.lists.getByTitle("SmartInformation")
    await web.lists.getById(props?.AllListId?.SmartInformationListID)
      .items.getById(DeletItemId).recycle()
      .then((res: any) => {
        console.log(res);
        handleClose();

      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //========delete function documents  list items ==================

  const deleteDocumentsData = async (DeletItemId: any) => {
    console.log(DeletItemId);
    const web = new Web(props?.AllListId?.siteUrl);
    // await web.lists.getByTitle("SmartInformation")
    var text: any = "are you sure want to Delete";
    if (confirm(text) == true) {
      await web.lists.getById(props?.AllListId?.DocumentsListID)
        .items.getById(DeletItemId).recycle()
        .then((res: any) => {
          console.log(res);
          GetResult();
          handleClose();
          setEditdocpanel(false);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }


  };

  //======== add document when i click to add document in profile page =========.

  const addDocument = async (Status: any, items: any) => {
    setsmartDocumentpostData(items)
    if (Status == "AddDocument") {
      setshowAdddocument(true)
    }
    else {

      await saveSharewebItem();
      alert('Information saved now items can be attached.');
    }
    setshowAdddocument(true)




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


        if (taskInfo.Component != undefined && taskInfo.Component.length > 0) {
          tagcomponetServicesId = taskInfo.Component[0].Id;

        }
        if (taskInfo.Services != undefined && taskInfo.Services.length > 0) {
          tagcomponetServicesId = taskInfo.Services[0].Id;

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
            SharewebTaskId: { "results": tagcomponetServicesId != undefined ? [tagcomponetServicesId] : [] },

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

        handleClose();
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
    if (editData?.SharewebTask != undefined && editData?.SharewebTask?.length > 0) {

      if (editData?.SharewebTask[0]?.Portfolio_x0020_Type == "Component") {

        setallSetValue({ ...allValue, componentservicesetdataTag: editData?.SharewebTask[0] })
        setservicespopup(false);
        setcomponentpopup(true);
      } else {
        setallSetValue({ ...allValue, componentservicesetdataTag: editData?.SharewebTask[0] })

        setservicespopup(true);
        setcomponentpopup(false);
      }
    }
    setEditdocumentsData(editData);
  }

  // =====================component services click radio butoon on update documents===============

  const checkradiobutton = (e: any, items: any) => {
    if (items == "Component") {
      setservicespopup(false);
      setcomponentpopup(true);
      setallSetValue({ ...allValue, componentservicesetdataTag: undefined })

    }
    if (items == "Service") {
      setservicespopup(true);
      setcomponentpopup(false);
      setallSetValue({ ...allValue, componentservicesetdataTag: undefined })

    }
  }



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

  const ServiceComponentCallBack = React.useCallback((items: any) => {
    console.log(items)
    if (items?.smartComponent != undefined) {
      setallSetValue({ ...allValue, componentservicesetdataTag: items?.smartComponent[0] })
    }
    if (items?.linkedComponent) {
      setallSetValue({ ...allValue, componentservicesetdataTag: items?.linkedComponent[0] })
    }

    setisopencomonentservicepopup(false);
  }, [])

  //============ update documents link update both  function =============

  const updateDocumentsData = async () => {
    console.log(EditdocumentsData);
    console.log(allValue.Title);
    console.log(allValue.DocumentType);
    console.log(allValue.componentservicesetdata);
    console.log(allValue.ItemRank);
    var componetServicetagData: any;
    if (allValue.componentservicesetdata.smartComponent != undefined) {
      componetServicetagData = allValue.componentservicesetdata.smartComponent.Id;
    }
    if (allValue.componentservicesetdata.linkedComponent != undefined) {
      componetServicetagData = allValue.componentservicesetdata.linkedComponent.Id;
    }

    const web = new Web(props?.AllListId?.siteUrl);
    await web.lists.getById(props?.AllListId?.DocumentsListID)
      .items.getById(EditdocumentsData.Id).update({
        Title: EditdocumentsData.Title,
        ItemRank: EditdocumentsData.ItemRank,
        Year: EditdocumentsData.Year,
        ItemType: EditdocumentsData.ItemType,
        SharewebTaskId: { "results": allValue.componentservicesetdataTag != undefined ? [allValue.componentservicesetdataTag.Id] : [] },
        Url: {
          "__metadata": { type: 'SP.FieldUrlValue' },
          'Description': EditdocumentsData?.Url?.Url != "" ? EditdocumentsData?.Url?.Url : "",
          'Url': EditdocumentsData?.Url?.Url ? EditdocumentsData?.Url?.Url : "",
        }

      }).then((updatedItem: any) => {
        console.log(updatedItem)
        if (EditdocumentsData?.Url != undefined) {
          alert(" Link update successfully");
        } else {
          alert("Document(s) update successfully");
        }
        handleClose();
        setallSetValue({ ...allValue, EditTaskpopupstatus: false })
        setEditdocpanel(false);
        GetResult();
      }).catch((err: any) => {
        console.log(err)
      })

    // })

  }
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


  return (
    <div>
      {console.log(masterTaskdetails)}
      <div className='mb-3 card commentsection'>
        <div className='card-header'>
          <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">SmartInformation<span><Tooltip /></span></div>
        </div>

        {SmartInformation != null && SmartInformation.length > 0 && <div className="Sitecomposition p-2">{SmartInformation?.map((SmartInformation: any, i: any) => {
          return (
            <>
              <div className='border dropdown mt-2 shadow'>
                <div className='bg-ee d-flex py-1 '>
                  <span className='full-width'>
                    <a onClick={() => showhideComposition(SmartInformation)}>
                      <span >{smartInformationArrow ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}</span >
                      <span className="pe-3">{SmartInformation?.Title != undefined ? SmartInformation?.Title : ""}</span>
                    </a>

                  </span>
                  <span className='d-flex'>
                    <a onClick={() => handleShow(SmartInformation, "edit")}><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M33.5163 8.21948C33.058 8.34241 32.4072 8.6071 32.0702 8.80767C31.7334 9.00808 26.7046 13.9214 20.8952 19.7259L10.3328 30.2796L9.12891 35.1C8.46677 37.7511 7.95988 39.9549 8.0025 39.9975C8.04497 40.0399 10.2575 39.5397 12.919 38.8857L17.7581 37.6967L28.08 27.4328C33.7569 21.7875 38.6276 16.861 38.9036 16.4849C40.072 14.8925 40.3332 12.7695 39.5586 11.1613C38.8124 9.61207 37.6316 8.62457 36.0303 8.21052C34.9371 7.92775 34.5992 7.92896 33.5163 8.21948ZM35.7021 10.1369C36.5226 10.3802 37.6953 11.5403 37.9134 12.3245C38.2719 13.6133 38.0201 14.521 36.9929 15.6428C36.569 16.1059 36.1442 16.4849 36.0489 16.4849C35.8228 16.4849 31.5338 12.2111 31.5338 11.9858C31.5338 11.706 32.8689 10.5601 33.5598 10.2469C34.3066 9.90852 34.8392 9.88117 35.7021 10.1369ZM32.3317 15.8379L34.5795 18.0779L26.1004 26.543L17.6213 35.008L17.1757 34.0815C16.5838 32.8503 15.1532 31.437 13.9056 30.8508L12.9503 30.4019L21.3663 21.9999C25.9951 17.3788 29.8501 13.5979 29.9332 13.5979C30.0162 13.5979 31.0956 14.6059 32.3317 15.8379ZM12.9633 32.6026C13.8443 32.9996 14.8681 33.9926 15.3354 34.9033C15.9683 36.1368 16.0094 36.0999 13.2656 36.7607C11.9248 37.0836 10.786 37.3059 10.7347 37.2547C10.6535 37.1739 11.6822 32.7077 11.8524 32.4013C11.9525 32.221 12.227 32.2709 12.9633 32.6026Z" fill="#333333" /></svg></a>
                    <a onClick={() => addDocument("AddDocument", SmartInformation)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.8746 14.3436C22.8774 18.8722 22.8262 22.6308 22.7608 22.6962C22.6954 22.7616 18.9893 22.8128 14.525 22.8101C10.0606 22.8073 6.32545 22.8876 6.22467 22.9884C5.99582 23.2172 6.00541 24.6394 6.23742 24.8714C6.33182 24.9658 10.0617 25.0442 14.526 25.0455C18.9903 25.0469 22.6959 25.1009 22.7606 25.1657C22.8254 25.2304 22.8808 28.9921 22.8834 33.5248L22.8884 41.7663L23.9461 41.757L25.0039 41.7476L25.0012 33.3997L24.9986 25.0516L33.2932 25.0542C37.8555 25.0556 41.6431 25.0017 41.7105 24.9343C41.8606 24.7842 41.8537 23.0904 41.7024 22.9392C41.6425 22.8793 37.8594 22.8258 33.2955 22.8204L24.9975 22.8104L24.9925 14.4606L24.9874 6.11084L23.9285 6.11035L22.8695 6.10998L22.8746 14.3436Z" fill="#333333" /></svg>
                    </a>
                  </span>
                </div>

                <div className="border-0 border-bottom m-0 spxdropdown-menu " style={{ display: smartInformationArrow ? 'block' : 'none' }}>
                  <div className="ps-3" dangerouslySetInnerHTML={{ __html: SmartInformation?.Description != null ? SmartInformation?.Description : "No description available" }}></div>
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
                      <div className='card-body p-1 bg-ee mt-1'>
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
                <div className="px-2" style={{ fontSize: "smaller" }}><span className='pe-2'>Created By</span><span className='pe-2'>{SmartInformation?.Created != undefined ? moment(SmartInformation?.Created).format("DD/MM/YYYY") : ""}</span><span className='pe-2'>{SmartInformation?.Author?.Title != undefined ? SmartInformation?.Author?.Title : ""}</span></div>
                <div className="px-2" style={{ fontSize: "smaller" }}><span className='pe-2'>Modified By</span><span className='pe-2'>{SmartInformation?.Modified != undefined ? moment(SmartInformation?.Modified).format("DD/MM/YYYY") : ""}</span><span className='pe-1'>{SmartInformation?.Editor?.Title != undefined ? SmartInformation?.Editor?.Title : ""}</span></div>
              </div>
              <div></div>
            </>)
        })}

        </div>}

        <div className='border card-body p-1 text-end'>
          <a onClick={() => handleShow(null, "add")}><span>+ Add SmartInformation</span></a>
        </div>


      </div>
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
              <label htmlFor="Title" className='full-width'>Title &nbsp;*
                {popupEdit != true && <span><input type="checkbox" onClick={(e) => checkboxFunction(e)} /></span>}</label>
              <input type="text" className='full-width' value={allValue?.Title} id="Title" onChange={(e) => changeInputField(e.target.value, "Title")} />
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
            <div className="col-sm-6 text-lg-start">
              {popupEdit && <div><div><span className='pe-2'>Created</span><span className='pe-2'>{editvalue?.Created !== null ? moment(editvalue?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{editvalue?.Author?.Title}</a></span></div>
                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{editvalue?.Modified !== null ? moment(editvalue?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{editvalue?.Editor?.Title}</a></span></div>
                <div><span className="svg__iconbox svg__icon--trash" onClick={() => deleteSmartinfoData(editvalue.Id)}> </span>Delete this item</div>
              </div>}
            </div>

            <div className='col-sm-6 mt-2 p-0'>
              {popupEdit && <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.Context?._pageContext?._web?.absoluteUrl}/Lists/SmartInformation/EditForm.aspx?ID=${editvalue?.Id != null ? editvalue?.Id : null}`}>Open out-of-the-box form |</a></span>}
              <span><a title='Add Link/ Document' onClick={() => addDocument("popupaddDocument", editvalue)}>Add Link/ Document</a></span>
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


      {/* ================ upload documents link task  panel=========== */}

      <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
        isOpen={showAdddocument}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClose}>
        <div >

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
              <Button className='btn btn-default text-end  btn btn-primary' onClick={() => handleClose()}>
                Cancel
              </Button> </div>
          </div>}
          {SelectedTilesTitle === "UploadEmail" && <div>
            <div>Email</div>
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
            <div className='text-lg-end mt-2'><Button className='btn btn-default text-end  btn btn-primary' onClick={() => handleClose()}>Cancel</Button></div>
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
      <Panel onRenderHeader={onRenderCustomHeaderDocuments}
        isOpen={Editdocpanel}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClosedoc}
        isBlocking={!isopencomonentservicepopup}
        className={servicespopup == true ? "serviepannelgreena" : "siteColor"}
      >
        <Tabs
          defaultActiveKey="BASICINFORMATION"
          transition={false}
          id="noanim-tab-example"
          className=""
        >
          <Tab eventKey="BASICINFORMATION" title="BASICINFORMATION">
            <div className='border border-top-0 p-2'>
              {EditdocumentsData?.Url?.Url && <div className='d-flex'>
                <div className='input-group'><label className='form-label full-width'>URL</label>
                  <input type='text' className="from-control w-75" value={EditdocumentsData?.Url?.Url} onChange={(e => setEditdocumentsData({ ...EditdocumentsData, Url: { ...EditdocumentsData.Url, Url: e.target.value } }))}></input>
                </div>
              </div>}

              <div className='d-flex'>
                <div className="input-group"><label className=" full-width ">Name </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Title} onChange={(e => setEditdocumentsData({ ...EditdocumentsData, Title: e.target.value }))} />.{EditdocumentsData?.File_x0020_Type}
                </div>

                <div className="input-group mx-4"><label className="full-width ">Year </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Year} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Year: e.target.value })} />
                  <span className="input-group-text" title="Linked Component Task Popup">
                    <span className="svg__iconbox svg__icon--editBox"></span>
                  </span>
                </div>

                <div className="input-group">
                  <label className="full-width">Item Rank</label>
                  <select className="form-select" defaultValue={EditdocumentsData?.ItemRank} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, ItemRank: e.target.value })}>
                    {ItemRank.map(function (h: any, i: any) {
                      return (
                        <option key={i} selected={allValue?.ItemRank == h?.rank} value={h?.rank} >{h?.rankTitle}</option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className='d-flex mt-3'>
                <div className="input-group"><label className="full-width ">Title </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Title} onChange={(e => setallSetValue({ ...allValue, Title: e.target.value }))} />
                </div>
                <div className="input-group mx-4">
                  <label className="form-label full-width">
                    <span><input type="radio" name="radio" className="form-check-input" value="Component" checked={componentpopup} onClick={(e) => checkradiobutton(e, "Component")} /> Component</span>
                    <span className='ps-3'><input type="radio" name="radio" className="form-check-input" value="Service" checked={servicespopup} onClick={(e) => checkradiobutton(e, "Service")} /> Service</span>
                  </label>

                  {allValue?.componentservicesetdataTag != undefined &&
                    <div className="d-flex justify-content-between block px-2 py-1" style={{ width: '85%' }}>
                      <a target="_blank" data-interception="off" href="HHHH/SitePages/Portfolio-Profile.aspx?taskId=undefined">{allValue?.componentservicesetdataTag.Title}</a>
                      <a>
                        <span className="bg-light svg__icon--cross svg__iconbox"></span>
                      </a></div>}

                  {allValue?.componentservicesetdataTag == undefined && <input type="text" className="form-control" readOnly />}
                  <span className="input-group-text" title="Linked Component Task Popup">
                    <span className="svg__iconbox svg__icon--editBox" onClick={(e) => setisopencomonentservicepopup(true)}></span>
                  </span>
                </div>
                <div className="input-group"><label className="full-width ">Document Type </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.ItemType} onChange={(e) => { setEditdocumentsData({ ...EditdocumentsData, ItemType: e.target.value }) }} />
                  <span className="input-group-text" title="Linked Component Task Popup">
                    <span className="svg__iconbox svg__icon--editBox"></span>
                  </span>
                </div>
              </div>

            </div>
          </Tab>
          <Tab eventKey="IMAGEINFORMATION" title="IMAGEINFORMATION" >
            <div className='border border-top-0 p-2'>

              <ImageTabComponenet EditdocumentsData={EditdocumentsData} AllListId={props.AllListId} Context={props.Context}/>
            </div>
          </Tab>
        </Tabs>
        <footer className='text-end mt-2'>
          <div className='col-sm-12 row m-0'>
            <div className="col-sm-6 text-lg-start">
              {Editdocpanel && <div><div><span className='pe-2'>Created</span><span className='pe-2'>{EditdocumentsData?.Created !== null ? moment(editvalue?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Author?.Title}</a></span></div>
                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{EditdocumentsData?.Modified !== null ? moment(editvalue?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Editor?.Title}</a></span></div>
                <div><span onClick={() => deleteDocumentsData(EditdocumentsData?.Id)} className="svg__iconbox svg__icon--trash"></span>Delete this item</div>
              </div>}
            </div>

            <div className='col-sm-6 mt-2 p-0'>
              <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.Context?._pageContext?._web?.absoluteUrl}/Documents/Forms/EditForm.aspx?ID=${EditdocumentsData?.Id != null ? EditdocumentsData?.Id : null}`}>Open out-of-the-box form |</a></span>

              <Button className='btn btn-primary ms-1  mx-2' onClick={updateDocumentsData}>
                Save
              </Button>
              <Button className='btn btn-default' onClick={() => handleClosedoc()}>
                Cancel
              </Button>
            </div>
          </div>
        </footer>
      </Panel>
      {allValue.EditTaskpopupstatus && <EditTaskPopup Items={EditTaskdata} context={props?.Context} AllListId={props?.AllListId} Call={() => { CallBack() }} />}
      {isopencomonentservicepopup && componentpopup && <ComponentPortPolioPopup props={allValue?.componentservicesetdata} Call={ServiceComponentCallBack} Dynamic={props.AllListId}></ComponentPortPolioPopup>}
      {isopencomonentservicepopup && servicespopup && <LinkedComponent props={allValue?.componentservicesetdata} Call={ServiceComponentCallBack} Dynamic={props.AllListId}></LinkedComponent>}

    </div>


  )
}
export default SmartInformation;


