import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Dropdown, Panel, PanelType } from 'office-ui-fabric-react';
import { Button, Tabs, Tab, Col, Nav, Row } from 'react-bootstrap';
import EditDocument from './EditDocunentPanel'
import HtmlEditorCard from '../../../globalComponents/./HtmlEditor/HtmlEditor'
import pnp, { sp, Web } from "sp-pnp-js";
import * as moment from "moment-timezone";
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { DragDropFiles } from "@pnp/spfx-controls-react/lib/DragDropFiles";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as globalCommon from '../../../globalComponents/globalCommon';
import ServiceComponentPortfolioPopup from "../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup"
import { myContextValue } from "../../../globalComponents/globalCommon";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import EditorComponent from '../../../globalComponents/HtmlEditor/CopyHtmlEditor';
import { ContentState, EditorState, Modifier } from 'draft-js';
let AllTasktagsmartinfo: any = [];
let hhhsmartinfoId: any = [];
let taskUser: any = [];
let mastertaskdetails: any = [];
let addSmartInfoPopupAddlinkDoc2 = false;
let count = 0;
const SmartInformation = (props: any, ref: any) => {
  const myContextData2: any = React.useContext<any>(myContextValue)
  const [show, setShow] = useState(false);
  const [popupEdit, setpopupEdit] = useState(false);
  const [smartInformationArrow, setsmartInformationArrow] = useState(true);
  const [allValue, setallSetValue] = useState({
    Title: "", Id: 1021, URL: "", Acronym: "", Description: "", InfoType: "Information Note", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [],
  })
  const sourceinfo: any[] = [
    { text: 'Select Source', key: 0 },
    { text: 'MS Teams', key: 1 },
    { text: 'Call', key: 2 },
    { text: 'Email', key: 3 },
    { text: 'Task', key: 4 }
  ]
  const initialState = () => EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);
  const [data, setData] = React.useState<any>([]);
  const [smartnoteAuthor, setsmartnoteAuthor] = useState<any>([]);
  const [isUserNameValid, setIsUserNameValid] = useState(false);
  const [filterSmartinfo, setFiltersmartinfo] = useState([]);
  const [InfoDate, setInfoDate] = React.useState('');
  const [infodescription, setinfodescription] = React.useState('');
  const [InfoSource, setInfoSource] = React.useState<any>({ text: 'Select Source', key: 0 });
  const [isopencomonentservicepopup, setisopencomonentservicepopup] = useState(false);
  const [uplodDoc, setUploaddoc] = useState(null);
  const [Htmleditorcall, setHtmleditorcall] = useState(false);
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
  const [folderCreated, setFolderCreated] = useState(true);
  const [sourceTitle, setsourceTitle] = useState('');
  const [state, rerender] = React.useReducer(() => ({}), {});
  const handleClose = () => {
    if (addSmartInfoPopupAddlinkDoc2 == false) {
      setpopupEdit(false);
      setshowAdddocument(false);
      setSelectedTilesTitle("")

      setShow(false);
      seteditvalue(null);
      setallSetValue({ ...allValue, Title: "", URL: "", Acronym: "", Description: "", InfoType: "Information Note", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [] });
      if (props.showHide === "projectManagement" || props.showHide === "ANCTaskProfile") {
        console.log(props.remarkData)
        props.setRemark(false)
      }

    }
  }

  const handleShow = async (item: any, value: any) => {

    await LoadSmartMetaData();
    setTimeout(() => {
      const panelMain: any = document.querySelector('.ms-Panel-main');
      if (panelMain && myContextData2?.ColorCode != undefined) {
        $('.ms-Panel-main').css('--SiteBlue', myContextData2?.ColorCode); // Set the desired color value here
      }
    }, 1000)
    if (value == "edit") {
      setpopupEdit(true);
      seteditvalue(item);
      setInfoDate(item.SmartNoteDate);
      setsmartnoteAuthor(item?.SmartNoteAuthor)
      if (item?.RequirementSource != undefined && item?.RequirementSource != null) {
        sourceinfo.map((itm: any) => {
          if (itm.text === item.RequirementSource) {
            setInfoSource(itm);
          }
        })
      }
      try {
        item.Description = item?.Description.replace(/<[^>]*>|&[^;]+;/g, '');
        if (item?.InfoType?.Title === 'Information Source') {
          setsourceTitle(item.Title);
          setEditorState(insertText(item?.Description, editorState));
        }
      }
      catch (e) {
        console.log(e);
      }


      setEditSmartinfoValue(item);
      setallSetValue({ ...allValue, Title: item.Title, Id: item?.InfoType?.Id, URL: item?.URL?.Url, Description: item?.Description, InfoType: item?.InfoType?.Title, Acronym: item?.Acronym, SelectedFolder: item.SelectedFolder });
      setShow(true);

    } else {
      setallSetValue({ ...allValue, Id: 1021, Title: "", URL: "", Acronym: "", Description: "", InfoType: "Information Note", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [] });
      if (props.showHide === "projectManagement") {
        setallSetValue({ ...allValue, InfoType: "Remarks" })
        // props.setRemark(false)
      } else {
        setallSetValue({ ...allValue, Id: 1021, Title: "", URL: "", Acronym: "", Description: "", InfoType: "Information Note", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [] });
      }
      setInfoDate('');
      setsmartnoteAuthor([]);
      setInfoSource({ text: 'Select Source', key: 0 });
      setEditorState(initialState);
      setShow(true);
      setTimeout(() => {
        const panelMain: any = document.querySelector('.ms-Panel-main');
        if (panelMain && myContextData2?.ColorCode) {
          $('.ms-Panel-main').css('--SiteBlue', myContextData2?.ColorCode); // Set the desired color value here
        }
      }, 1000)
    }

  }

  useEffect(() => {
    if ((props?.showHide == "projectManagement") && props.editSmartInfo) {
      handleShow(props.RemarkData.SmartInformation[0], "edit")
    } if (props.editSmartInfo == false) {
      handleShow(null, "add")
    }
    LoadMasterTaskList().then((data: any) => {
      console.log(data)
      GetTaskUsers()
      GetResult();
    })

    // GetResult();

  }, [])
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
    } else {
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
      .items.select('Id,Title,Description,SelectedFolder,RequirementSource,SmartNoteAuthor/Id,SmartNoteAuthor/Title,SmartNoteAuthor/Name,SmartNoteDate,URL,Acronym,InfoType/Id,InfoType/Title,Created,Modified,Author/Name,Author/Title,Author/Title,Author/Id,Editor/Name,Editor/Title,Editor/Id')
      .expand("InfoType,Author,Editor,SmartNoteAuthor")
      .getAll()
    console.log(Data)
    setAllSmartInfo(Data)
    if (Data.length > 0) {
      SmartInformation?.map((items: any) => {
        items.SmartNoteDate = moment(new Date(new Date(items.SmartNoteDate).setHours(new Date(items.SmartNoteDate).getHours() + 5))).tz("Europe/Berlin").format('DD MMM YYYY HH:mm')
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
          .expand("Author,Editor,Portfolios").filter(`SmartInformation/ID  eq ${items?.Id}`).getAll()

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
              setSmartInformation(allSmartInformationglobaltagdocuments);
              rerender();
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

  }
  // ============load SmartMetaData to get the  infoType in popup======================= 

  const LoadSmartMetaData = async () => {
    const web = new Web(props?.AllListId?.siteUrl);


    await web.lists.getById(props?.AllListId?.SmartMetadataListID)
      .items.select('ID,Title,ProfileType', 'Parent/Id', 'Parent/Title', 'TaxType', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Title', 'Editor/Id')
      .expand("Author", "Editor", "Parent").filter("TaxType eq 'Information'").top(4999)
      .getAll()
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
    if (InfoType?.text === 'Information Source') {      
      setallSetValue({ ...allValue, InfoType: InfoType?.text, Id: InfoType?.key })      
      if (popupEdit) {
        setHtmleditorcall(false);
        var title = `Information Source - ${InfoSource.text}`;
        setsourceTitle(title);
      }
      else {
        setHtmleditorcall(true)
        var title = 'Information Source - ';
        setsourceTitle(title);
      }
    }
    else {
      if (popupEdit) {
        setallSetValue({ ...allValue, InfoType: InfoType?.text, Id: InfoType?.key, Title: '' })
      }
      else {
        setallSetValue({ ...allValue, InfoType: InfoType?.text, Id: InfoType?.key})
      }    
      setsourceTitle('');
      setHtmleditorcall(false);                
    }

  }

  //=========panel header for smartinformation  post and edit ===================
  const onRenderCustomHeadersmartinfo = () => {
    return (
      <>
        <div className='subheading'>
          {popupEdit ? `Edit SmartInformation - ${allValue?.Title === '' ? sourceTitle : allValue?.Title}` : `Add SmartInformation - ${taskInfo?.Title}`}
        </div>
        <Tooltip ComponentId='3299' />
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
    return new Promise<void>(async (resolve, reject) => {
      var movefolderurl = `${props?.Context?._pageContext?._web.serverRelativeUrl}/Lists/SmartInformation`
      let infotypeSelectedData: any
      console.log(movefolderurl);
      console.log(allValue);
      if (allValue.InfoType === 'Information Source') {
        var sourcedescription = editorState.getCurrentContent().getPlainText();
      }
      if ((allValue?.Title == "" && allValue?.Description != "") || (allValue?.Title != "" && allValue?.Description == "") || (allValue?.Title != "" && allValue?.Description != "") || (sourceTitle != '' && sourcedescription != '') || (sourceTitle == '' && sourcedescription == '')) {
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
          Title: allValue?.Title != "" ? allValue.InfoType === 'Information Source' ? sourceTitle : allValue?.Title : allValue.InfoType === 'Information Source' ? sourceTitle : taskInfo?.Title,
          Acronym: allValue.Acronym != null ? allValue?.Acronym : "",
          InfoTypeId: metaDataId != undefined ? metaDataId : null,
          Description: allValue?.Description != "" ? allValue.InfoType === 'Information Source' ? sourcedescription : allValue?.Description : sourcedescription != undefined ? sourcedescription : "",
          SelectedFolder: allValue?.SelectedFolder,
          SmartNoteAuthorId: smartnoteAuthor?.length > 0 ? smartnoteAuthor[0]?.AssingedToUser?.Id : typeof (smartnoteAuthor) === 'object' && smartnoteAuthor?.Id != undefined ? smartnoteAuthor?.Id : null,
          RequirementSource: InfoSource?.text,
          SmartNoteDate: InfoDate != '' ? moment(new Date(InfoDate)).tz("Europe/Berlin").format('DD MMM YYYY HH:mm') : null,
          Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
          URL: {
            "__metadata": { type: 'SP.FieldUrlValue' },
            'Description': allValue.URL != undefined ? allValue?.URL : null,
            'Url': allValue.URL != undefined ? allValue?.URL : null,
          }

        }


        //=============edit the data  save function   ===============

        if (popupEdit) {
          await web.lists.getById(props?.AllListId?.SmartInformationListID)
            .items.getById(editvalue?.Id).update(postdata)
            .then(async (editData: any) => {
              console.log(editData)
              if (props.showHide === "projectManagement" || props.showHide == "ANCTaskProfile") {
                console.log(props.RemarkData)
                let restdata = editData
                let urlcallback: any = {
                  Url: postdata?.URL?.Url,
                  Description: postdata?.URL?.Description
                }
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
                backupremarkdata?.SmartInformation.splice(0, 1, restdata);
                if (props?.setRemark != undefined) {
                  props.setRemark(false)
                  if (props?.callSmartInformation != undefined) {
                    props.callSmartInformation("update")
                  }
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
                  if ((props.showHide === "projectManagement" || props.showHide == "ANCTaskProfile") && addSmartInfoPopupAddlinkDoc2 == false) {
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
                  resolve(data)


                }).catch((err) => {
                  reject(err)
                  console.log(err.message);
                })

            })
            .catch((err) => {
              reject(err)
              console.log(err.message);
            });
        }
      }
      else {
        alert("Please fill the Title")
        reject("Please fill the Title")
        addSmartInfoPopupAddlinkDoc2 = false;
      }
    })
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
          if (props.showHide === "projectManagement" || props.showHide == "ANCTaskProfile") {
            console.log(props.RemarkData)
            let backupremarkdata = props?.RemarkData
            if (backupremarkdata.SmartInformation !== undefined || null) {
              backupremarkdata.SmartInformation = [];
            }
            if (props.setRemark != undefined || null) {
              props.setRemark(false)
            }

          }
          GetResult();
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
    if (Status == "AddDocument" || popupEdit) {
      setshowAdddocument(true)
      setTimeout(() => {
        const panelMain: any = document.querySelector('.ms-Panel-main');
        if (panelMain && myContextData2?.ColorCode) {
          $('.ms-Panel-main').css('--SiteBlue', myContextData2?.ColorCode); // Set the desired color value here
        }
      }, 1000)
    }
    else {

      addSmartInfoPopupAddlinkDoc2 = true;
      await saveSharewebItem().then((resolve: any) => {
        alert('Information saved now items can be attached.');
        setShow(false)
        setshowAdddocument(true)
        setTimeout(() => {
          const panelMain: any = document.querySelector('.ms-Panel-main');
          if (panelMain && myContextData2?.ColorCode != undefined) {
            $('.ms-Panel-main').css('--SiteBlue', myContextData2?.ColorCode); // Set the desired color value here
          }
        }, 1000)
      }).catch((reject: any) => {
        setshowAdddocument(false)
      })

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
          });
        console.log(updatedItem)
        if (allValue?.LinkUrl != "") {
          alert("Link upload successfully");

        } else {
          alert("Document(s) upload successfully");
        }
        addSmartInfoPopupAddlinkDoc2 = false;
        handleClose();
        if (props.showHide === "projectManagement" || props.showHide == "ANCTaskProfile") {
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
          SmartInformationId: { "results": [(smartDocumentpostData != undefined && smartDocumentpostData != null ? smartDocumentpostData?.Id : PostSmartInfo?.data?.Id)] }

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

      if (editData?.Portfolio != undefined) {
        setallSetValue({ ...allValue, componentservicesetdataTag: editData?.Portfolio })

      }

    }
    setEditdocumentsData(editData);
  }
  const callbackeditpopup = () => {
    GetResult();
    setEditdocpanel(false);
  }

  // =====================component services click radio butoon on update documents===============

  //=======Edit Task details function .==========
  const edittaskpopup = (editTaskData: any) => {
    console.log(editTaskData);
    editTaskData.siteUrl = props?.AllListId?.siteUrl;
    editTaskData.listName = props?.listName;
    editTaskData.siteType = props?.listName
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
  //================ People picker function===================

  const userIdentifier = EditSmartinfoValue?.SmartNoteAuthor != undefined ? EditSmartinfoValue?.SmartNoteAuthor?.Name : editvalue?.SmartNoteAuthor?.Name;
  const email = userIdentifier ? userIdentifier.split('|').pop() : '';

  const smartNoteAuthor = (item: any) => {
    if (item.length > 0) {
      const email = item.length > 0 ? item[0].loginName.split('|').pop() : null;

      if (item[0].text === 'Stefan Hochhuth') {
        var member = taskUser.filter((elem: any) => elem.AssingedToUser != undefined && elem.AssingedToUser.Id === 32)
      }
      else {
        var member = taskUser.filter((elem: any) => elem.Email === email)
      }
      setsmartnoteAuthor(member)
      setIsUserNameValid(true);
    }
    else {
      setsmartnoteAuthor([])
      setIsUserNameValid(false);
    }
  }


  const handleSource = (value: any) => {
    setInfoSource(value);
    if (sourceTitle.split('-')[1] === '') {
      var title = sourceTitle + value.text
    }
    else {
      var title = sourceTitle.split('-')[0] + '-' + value.text
    }
    setsourceTitle(title);
  }

  //===================== Handle Editor for Description ==============================//
  // const insertText = (text: any, editorValue: any) => {
  //   const currentContent = editorValue.getCurrentContent();
  //   const currentSelection = editorValue.getSelection();

  //   const newContent = Modifier.replaceText(
  //     currentContent,
  //     currentSelection,
  //     text
  //   );

  //   const newEditorState = EditorState.push(
  //     editorValue,
  //     newContent,
  //     "insert-characters"
  //   );
  //   return EditorState.forceSelection(
  //     newEditorState,
  //     newContent.getSelectionAfter()
  //   );
  // };

  const insertText = (text: any, editorValue: any) => {
    // Create empty content state
    const emptyContentState = ContentState.createFromText('');

    // Create new editor state with empty content
    const emptyEditorState = EditorState.createWithContent(emptyContentState);

    // Extract the current selection from the editor state
    const currentSelection = editorValue.getSelection();

    // Replace the empty content with the text
    const newContent = Modifier.replaceText(
      emptyContentState,
      emptyContentState.getSelectionAfter(),
      text
    );

    // Create a new editor state with the modified content
    const newEditorState = EditorState.push(
      emptyEditorState,
      newContent,
      'insert-characters'
    );

    // Force the selection to be at the end of the inserted text
    const finalEditorState = EditorState.forceSelection(
      newEditorState,
      newContent.getSelectionAfter()
    );

    return finalEditorState;
  };

  const addDescription = () => {

    if (allValue.InfoType === 'Information Source' && smartnoteAuthor.length > 0 && InfoDate != '' && InfoSource.key != 0) {
      var text = `Requirement has been received from ${smartnoteAuthor[0].Title} through ${InfoSource.text} on ${InfoDate.split('-')[2] + '-' + InfoDate.split('-')[1] + '-' + InfoDate.split('-')[0]} `;
      //setallSetValue({ ...allValue, Description: text })    
      setEditorState(insertText(text, editorState));
    }
  }

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

      setallSetValue({ ...allValue, componentservicesetdataTag: DataItem[0] })
    }
    setisopencomonentservicepopup(false);

  }, [])

  //============ update documents link update both  function =============


  const checkboxFunction = (e: any) => {
    console.log(e);
    if (e.currentTarget.checked) {
      setallSetValue({ ...allValue, Title: `Quick-${taskInfo?.Title}-${Today}` })
      setsourceTitle(`Quick-${taskInfo?.Title}-${Today}`);
    } else {
      setallSetValue({ ...allValue, Title: "" });
      if (sourceTitle != '')
        setsourceTitle('');
    }
  }
  const onclickfilteritems = (items: any) => {
    setallSetValue({ ...allValue, Title: items })
    setFiltersmartinfo([])
  }

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

        {SmartInformation != null && SmartInformation.length > 0 && <div className="p-2">{SmartInformation?.map((SmartInformation: any, i: any) => {
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
                              <span><a href={item?.EncodedAbsUrl} target="_blank" data-interception="off">
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
                              {item.Url == null && <span><a className='px-2'  href={`${item?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off"> <span>{item?.Title}</span></a></span>}
                              {item.Url != null && <span><a className='px-2' href={`${item?.Url?.Url}`} target="_blank" data-interception="off"> <span>{item?.Title}</span></a></span>}
                            </li>
                            <li className='ml-auto'>
                              <span title="Edit" className="svg__iconbox svg__icon--edit hreflink alignIcon" onClick={() => editDocumentsLink(item)}></span>
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
                              <span><a href={`${props.AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${tagtask?.Id}&Site=${props?.listName}`} target="_blank" data-interception="off"><span className='bg-secondary svg__iconbox svg__icon--Task'></span></a></span>
                            </li>
                            <li>
                              <span className='px-2'><a href={`${props?.AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${tagtask?.Id}&Site=${props?.listName}`} target="_blank" data-interception="off">{tagtask?.Title}</a></span>
                            </li>
                            <li className='d-end'>
                              <span title="Edit" className="svg__iconbox svg__icon--edit hreflink" onClick={(e) => edittaskpopup(tagtask)}></span>
                            </li>
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                  <div className="p-1 px-2" style={{ fontSize: "x-small" }}><span className='pe-2'>Created By</span><span className='pe-2'>{SmartInformation?.Created != undefined ? moment(SmartInformation?.Created).format("DD/MM/YYYY") : ""}</span><span className='round px-1'>{SmartInformation?.Author?.AuthorImage != undefined ? <img className='align-self-start' onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, SmartInformation?.Author?.Id)} title={SmartInformation?.Author?.Title} src={SmartInformation?.Author?.AuthorImage?.Url} /> : ""}</span></div>
                  <div className="p-1 px-2" style={{ fontSize: "x-small" }}><span className='pe-2'>Modified By</span><span className='pe-2'>{SmartInformation?.Modified != undefined ? moment(SmartInformation?.Modified).format("DD/MM/YYYY") : ""}</span><span className='round px-1'>{SmartInformation?.Editor?.EditorImage != undefined ? <img className='align-self-start' onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, SmartInformation?.Editor?.Id)} title={SmartInformation?.Editor?.Title} src={SmartInformation?.Editor?.EditorImage?.Url} /> : ""}</span></div>
                </div>
                <div></div>
              </>)
          }

        })}

        </div>}



      </div>}
      {/* ================= smartInformation add and edit panel=========== */}

      <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
        isOpen={show}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={() => handleClose()}
        isBlocking={false}
      >

        <div>
          <div className="row">
            <dl className="align-items-center d-flex Hz-align ">
              <dt>
                Select Permission:
              </dt>
              <dt className='SpfxCheckRadio '><input type="radio" className='radio' checked={allValue?.SelectedFolder == "Public"} value="Public" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>Global</label></dt>
              <dt className='SpfxCheckRadio '><input type="radio" className='radio' checked={allValue?.SelectedFolder == "Only For Me"} value="Only For Me" onChange={(e) => SeleteMoveFloderItem(e.target.value)} /><label>Only for me</label></dt>
            </dl>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <div className='input-group'>
                <label htmlFor="Title" className='form-label full-width'>Title
                  <span className='ml-1 mr-1 text-danger'>*</span>
                  {(popupEdit != true && !Htmleditorcall) && <span className='mx-2'><input type="checkbox" className="form-check-input" onClick={(e) => checkboxFunction(e)} /></span>}</label>
                {allValue?.InfoType === 'Information Source' ? <input type="text" className="form-control" value={sourceTitle} id="Title" onChange={(e) => setsourceTitle(e.target.value)} autoComplete='off' /> :
                  <input type="text" className="form-control" value={allValue?.Title} id="Title" onChange={(e) => changeInputField(e.target.value, "Title")} autoComplete='off' />}
                {/* {allValue.AstricMesaage &&<span className='ml-1 mr-1 text-danger'>Please enter your Title !</span>} */}
                {/* {filterSmartinfo != undefined && filterSmartinfo.length > 0 && <div className='bg-Fa border overflow-auto'><ul className='list-group mx-2 tex'> {filterSmartinfo.map((smartinfofilter: any) => {
                  return (
                    < >
                      <li onClick={() => onclickfilteritems(smartinfofilter.Title)}> {smartinfofilter.Title}</li>
                    </>
                  )
                })}
                </ul>
                </div>} */}
              </div></div>
            <div className='col-sm-6'>
              <div className='input-group'>
                <label className='full-width' htmlFor="InfoType">InfoType</label>
                <Dropdown id='sourceinfoid' className='full-width'
                  options={SmartMetaData.map((src) => ({ key: src?.Id, text: src?.Title }))}
                  selectedKey={allValue?.Id}
                  onChange={(e, option) => InfoType(option)}
                  styles={{ dropdown: { width: '100%' } }}
                />
                {/*<select className='form-control' name="cars" id="InfoType" value={allValue?.InfoType} onChange={(e) => InfoType(e.target.value)}>
                {SmartMetaData != undefined && SmartMetaData?.map((items: any) => {
                  return (
                    <> <option value={items?.Title}>{items?.Title}</option></>
                  )
                })}

                </select> */}
              </div>
            </div>

            {allValue?.InfoType !== 'Information Source' && <div className='col-md-6'>
              <div className='input-group'>
                <label htmlFor="URL" className='full-width'>URL</label>
                <input type="text" className='form-control' id="URL" value={allValue?.URL} onChange={(e) => changeInputField(e.target.value, "url")} />
              </div></div>}
            {allValue.InfoType != null && allValue.InfoType == "Glossary" && <div className='col-md-6'> <div className='input-group'>
              <label htmlFor="Acronym" className='full-width'>Acronym</label>
              <input type="text" className='form-control' id="Acronym" value={allValue?.Acronym} onChange={(e) => changeInputField(e.target.value, "Acronym")} />
            </div></div>}
            {allValue.InfoType != null && allValue.InfoType == "Information Source" && <div className='col-md-6 mt-2 d-flex'>
              <div className='col-md-4'>
                <div className='input-group class-input'>
                  <label className='form-label full-width'> Author <span className='ml-1 mr-1 text-danger'>*</span> </label>
                  <PeoplePicker context={props.Context} titleText="" personSelectionLimit={1}
                    principalTypes={[PrincipalType.User]} resolveDelay={1000} onChange={(items) => smartNoteAuthor(items)}
                    defaultSelectedUsers={email ? [email] : []} />
                </div>
              </div>
              <div className='col-md-4 ps-4'>
                <div className='input-group ps-1'>
                  <label htmlFor="InfoDate" className='form-label full-width'> Date <span className='ml-1 mr-1 text-danger'>*</span> </label>
                  <input type="date" className='form-control' id="dateforIonfosource" value={InfoDate != undefined && InfoDate != '' ? moment(InfoDate).format("YYYY-MM-DD") : ''} onChange={(e) => setInfoDate(e.target.value)} />
                </div>
              </div>
              <div className='col-md-4 ps-3'>
                <div className='input-group'>
                  <label htmlFor="InfoDate" className='full-width form-label'> Source <span className='ml-1 mr-1 text-danger'>*</span> </label>
                  {/* <input type="text" className='full-width' value={InfoSource} onChange={(e) => setInfoSource(e.target.value)} /> */}
                  {/* <select className='full-width' name="cars" id="InfoType" value={InfoSource} onChange={(e) => setInfoSource(e.target.value)}>
                    <option value='team'>Team</option>
                    <option value='call'>Call</option>
                    <option value='email'>Email</option>
                  </select> */}
                  <Dropdown id='sourceinfoid' className='full-width'
                    options={sourceinfo.map((src) => ({ key: src?.key, text: src?.text }))}
                    selectedKey={InfoSource?.key}
                    onChange={(e, option) => handleSource(option)}
                    styles={{ dropdown: { width: '100%' } }}
                  />
                </div>
              </div>
            </div>}
          </div>
        </div>
        {!Htmleditorcall && allValue.InfoType !== 'Information Source' && <div className='mt-2'><HtmlEditorCard editorValue={allValue?.Description != null ? allValue?.Description : ""} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard></div>}

        {Htmleditorcall  && <div className='text-end my-1'><a title='Add Description' className='ForAll hreflink' style={{ cursor: "pointer" }} onClick={() => addDescription()}>Add Source Description</a></div>}
        {(Htmleditorcall || (popupEdit && allValue.InfoType === 'Information Source')) && <div className='mt-2'> <EditorComponent editorState={editorState} setEditorState={setEditorState} /> </div>}

        <footer className='text-end mt-2'>
          <div className='col-sm-12 row m-0'>
            <div className={popupEdit ? "col-sm-4 text-lg-start ps-1" : "col-sm-6 text-lg-start ps-1"}>
              {popupEdit && <div><div><span className='pe-2'>Created</span><span className='pe-2'>{editvalue?.Created !== null ? moment(editvalue?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{editvalue?.Author?.Title}</a></span></div>
                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{editvalue?.Modified !== null ? moment(editvalue?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{editvalue?.Editor?.Title}</a></span></div>
                <div className='alignCenter'>Delete this item<span className="svg__iconbox svg__icon--trash" onClick={() => deleteSmartinfoData(editvalue.Id)}> </span></div>
              </div>}
            </div>

            <footer className={popupEdit ? 'col-sm-8 mt-2 p-0' : "mt-2 p-0"}>
              {popupEdit && <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.Context?._pageContext?._web?.absoluteUrl}/Lists/SmartInformation/EditForm.aspx?ID=${editvalue?.Id != null ? editvalue?.Id : null}`}>Open out-of-the-box form |</a></span>}
              <span className='me-2'><a className="ForAll hreflink" target="_blank" data-interception="off"
                href={`${props?.Context?._pageContext?._web?.absoluteUrl}/SitePages/ManageSmartMetaData.aspx`}>
                Manage Information
              </a></span>
              <span className='mx-2'>|</span>

              <span><a title='Add Link/ Document' className='ForAll hreflink' style={{ cursor: "pointer" }} onClick={() => addDocument("popupaddDocument", editvalue)}>Add Link/ Document</a></span>
              <Button className='btn btn-primary ms-1 me-1' onClick={saveSharewebItem} disabled={allValue.InfoType === 'Information Source' ? (sourceTitle == '' || smartnoteAuthor?.length == 0 || InfoDate == '' || InfoSource.key == 0) : allValue?.Title == ''}>
                Save
              </Button>
              <Button className='btn btn-default mx-1' onClick={() => handleClose()}>
                Cancel
              </Button>

            </footer>
          </div>
        </footer>
      </Panel>


      {/* ================ upload documents link task  panel=========== */}

      <Panel onRenderHeader={onRenderCustomHeadersmartinfo}
        isOpen={showAdddocument}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={() => closeDoc()}
        isBlocking={false}
      >

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
            <footer className='mt-2 text-end' >
              <button className='btn btn-primary mx-3 text-end ' onClick={(e) => onUploadDocumentFunction("uploadFile", "UploadDocument")}>Upload</button>
              <Button className='btn btn-default text-end  btn btn-primary' onClick={() => closeDoc()}>
                Cancel
              </Button> </footer>
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
      {Editdocpanel && <EditDocument editData={EditdocumentsData} ColorCode={myContextData2?.ColorCode} AllListId={props.AllListId} Context={props.Context} editdocpanel={Editdocpanel} callbackeditpopup={callbackeditpopup} />}
      {allValue.EditTaskpopupstatus && <EditTaskPopup Items={EditTaskdata} context={props?.Context} AllListId={props?.AllListId} Call={() => { CallBack() }} />}

      {isopencomonentservicepopup &&
        <ServiceComponentPortfolioPopup
          props={allValue?.componentservicesetdata}
          Dynamic={props.AllListId}
          ComponentType={"Component"}
          Call={ComponentServicePopupCallBack}

        />
      }

    </div>
  )
}
export default forwardRef(SmartInformation);
