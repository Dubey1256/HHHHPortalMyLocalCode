import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Button, Tabs, Tab, Col, Nav, Row } from 'react-bootstrap';
import moment from 'moment';
import { Web } from 'sp-pnp-js';
import HtmlEditorCard from '../../../globalComponents/./HtmlEditor/HtmlEditor'

import ImageInformation from '../../EditPopupFiles/ImageInformation';

let mastertaskdetails: any = []
let copyEditData: any = {}
let mydataa: any = [];
let myTaskData: any = []
let count = 0;
var AllListId: any;
var dynamicColumnName: any = [];
var selectedTasks: any = [];
let componentDetailsDaata: any = [];
let tempmetadata: any = [];
const EditLivingDocumentpanel = (props: any) => {
  const [EditdocumentsData, setEditdocumentsData]: any = React.useState();
  const [isOpenImageTab, setisOpenImageTab] = React.useState(false);
  const [projectdata, setProjectData] = React.useState([]);
  const [allProjectDaata, SetAllProjectDaata] = React.useState([]);
  const [Metadata, setMetadata] = React.useState([]);
  // const [selectedTasks, setselectedTasks] = React.useState([]);
    let Status: any = ["selectStatus", "Draft", "Final", "Archived"]
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

  React.useEffect(() => {
    AllListId = props.AllListId   
    AllListId.Context = props.AllListId?.context
    if (props?.editData != undefined) {
        loadSelectedDocuments()
    }  
  }, [props?.editData != undefined])

  React.useEffect(() => {

  }, [])

  const loadSelectedDocuments = async () => {
    const web = new Web(props?.AllListId?.siteUrl);
    try {
        await web.lists.getById(props?.AllListId?.SharewebDocument)
        .items.getById(props?.editData?.Id)
        .select('Id', 'Title', 'PriorityRank', 'Year','Status', 'Body', 'recipients', 'senderEmail', 'creationTime', 'Item_x0020_Cover','File_x0020_Type', 'FileLeafRef', 'FileDirRef', 'ItemRank', 'ItemType', 'Url', 'Created', 'Modified', 'Author/Id', 'Author/Title', 'Editor/Id', 'Editor/Title', 'EncodedAbsUrl')
        .expand('Author,Editor')
        .get()
        .then((Data) => {
          let Title: any = " "
          Data.docTitle = getUploadedFileName(Data?.FileLeafRef);
          Title = Data?.docTitle;
            Data.Title = Title;       
            if (Data?.Title?.includes(Data?.File_x0020_Type)) {
                Data.Title = getUploadedFileName(Data?.Title);
            }  
          Data.siteType = 'LivingDocs';          
          Data.Item_x002d_Image = Data?.Item_x0020_Cover
          let portfolioData: any = []        
          setTimeout(() => {
            const panelMain: any = document.querySelector('.ms-Panel-main');
            if (panelMain && portfolioData[0]?.PortfolioType?.Color) {
              $('.ms-Panel-main').css('--SiteBlue', portfolioData[0]?.PortfolioType?.Color); // Set the desired color value here
            }
          }, 1000)
          console.log("document data", Data);
          setEditdocumentsData(Data);
        });

    } catch (e: any) {
      console.log(e);
    }
  };
    
  const handleClosedoc = () => {
    mastertaskdetails = []
    props.callbackeditpopup();
  }

  const deleteDocumentsData = async (DeletItemId: any) => {
    console.log(DeletItemId);
    const web = new Web(props?.AllListId?.siteUrl);
    var text: any = "Are you sure want to Delete ?";
    if (confirm(text) == true) {
        await web.lists.getById(props?.AllListId?.SharewebDocument)
        .items.getById(DeletItemId).recycle()
        .then((res: any) => {
          console.log(res);

          if (props.Keydoc) {
            props.callbackeditpopup("delete");
          } else {
            props.callbackeditpopup();
          }

        })
        .catch((err) => {
          console.log(err.message);
        });
    }

  }; 
  const updateDocumentsData = async () => {
    let componetServicetagData: any = [];
    if (EditdocumentsData?.Portfolios?.length > 0) {
      EditdocumentsData?.Portfolios?.forEach((portfolioId: any) => {
        componetServicetagData.push(portfolioId?.Id);
      });
    }   
    const postData: any = {
      Title: EditdocumentsData?.Title,
      FileLeafRef: EditdocumentsData?.docTitle,
      ItemRank: EditdocumentsData?.ItemRank == 'Select Item Rank' ? null : EditdocumentsData?.ItemRank,
      Year: EditdocumentsData.Year,
        ItemType: EditdocumentsData.ItemType,
        Status: EditdocumentsData.Status == 'selectStatus' ? '' : EditdocumentsData.Status,
      Body: EditdocumentsData?.Body,
      Item_x0020_Cover: {
        "__metadata": { type: 'SP.FieldUrlValue' },
        'Description': EditdocumentsData?.Item_x002d_Image?.Url != "" ? EditdocumentsData?.UrItem_x002d_Imagel?.Url : "",
        'Url': EditdocumentsData?.Item_x002d_Image?.Url ? EditdocumentsData?.Item_x002d_Image?.Url : "",
      },
      Url: {
        "__metadata": { type: 'SP.FieldUrlValue' },
        'Description': EditdocumentsData?.Url?.Url != "" ? EditdocumentsData?.Url?.Url : "",
        'Url': EditdocumentsData?.Url?.Url ? EditdocumentsData?.Url?.Url : "",
      }

    }   
    const web = new Web(props?.AllListId?.siteUrl);
      await web.lists.getById(props?.AllListId?.SharewebDocument)
      .items.getById(EditdocumentsData.Id).update(postData).then((updatedItem: any) => {
        console.log(updatedItem)
        if (EditdocumentsData?.Url != undefined) {
          alert(" Link update successfully");
        } else {
          alert("Document(s) update successfully");
        }

        if (props?.Keydoc) {
          props.callbackeditpopup(EditdocumentsData);
        } else {
          props.callbackeditpopup();
        }
        mastertaskdetails = []
        // getMasterTaskListTasksData()

      }).catch((err: any) => {
        console.log(err)
        if (err.message.includes('423')) {
          alert("Document you are trying to update/tag is open somewhere else. Please close it and try again.")
        }
      })
  }

  const imageTabCallBack = React.useCallback((data: any) => {
    console.log(EditdocumentsData);
    console.log(data)
    if (data != undefined) {
      setEditdocumentsData(data);
    }
  }, [])

  const onRenderCustomHeaderDocuments = () => {
    return (
      <>
        <div className='subheading'>
          {true ? `Edit Document Metadata - ${EditdocumentsData?.Title != undefined ? EditdocumentsData.Title : EditdocumentsData?.docTitle}` : null}
        </div>
        <Tooltip ComponentId={'942'} />
      </>
    );
  };
  const imageta = (e: any) => {
    if (e) {
      setisOpenImageTab(true)
    }
  } 

  const getUploadedFileName = (fileName: any) => {
    const indexOfLastDot = fileName?.lastIndexOf('.');
    if (indexOfLastDot !== -1) {
      const extractedPart = fileName?.substring(0, indexOfLastDot);
      return extractedPart;
    } else {
      return fileName
    }
  }  
   

  const IsitemExists = function (array: any, Item: any) {
    var isExists = false;
    array.map((item: any) => {
      if (item.Id === Item.Id && item.siteType === Item.siteType) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  }

  /////////folara editor function start//////////
  const HtmlEditorCallBack = (items: any) => {
    console.log(items);
    var description = ""
    if (items == '<p></p>\n') {
      description = ""
    } else {
      description = items
    }
    let copyData = { ...EditdocumentsData }
    copyData.Body = description
    setEditdocumentsData(copyData)
  }
  //////// folora editor function end///////////
  return (
    <>
      <Panel onRenderHeader={onRenderCustomHeaderDocuments}
        isOpen={true}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClosedoc}
        isBlocking={false}
      >
        <Tabs
          defaultActiveKey="BASICINFORMATION"
          transition={false}
          id="noanim-tab-example"
          className="rounded-0"
          onSelect={imageta}
        >

          <Tab eventKey="BASICINFORMATION" title="BASIC INFORMATION" className='p-0'>

            <div className='border border-top-0 p-2'>
              {EditdocumentsData?.Url?.Url && <div className='d-flex'>
                <div className='input-group'><label className='form-label full-width'>URL</label>
                  <input type='text' className="from-control w-75" value={EditdocumentsData?.Url?.Url} onChange={(e => setEditdocumentsData({ ...EditdocumentsData, Url: { ...EditdocumentsData.Url, Url: e.target.value } }))}></input>
                </div>
              </div>}

              <div className='d-flex'>
                <div className="input-group"><label className=" full-width ">Name </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.docTitle} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, docTitle: e.target.value })} />.{EditdocumentsData?.File_x0020_Type}
                </div>

                <div className="input-group mx-4"><label className="full-width ">Year </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Year} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Year: e.target.value })} />
                </div>
                <div className="input-group mx-4">
                    <label className="full-width">Status</label>
                    <select className="form-select" defaultValue={EditdocumentsData?.Status} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Status: e.target.value })}>
                        {Status.map(function (h: any, i: any) {
                            return (
                                <option key={i} selected={EditdocumentsData?.Status == h} value={h} > {h}</option>)
                        })}
                    </select>
                </div>

                <div className="input-group">
                  <label className="full-width">Item Rank</label>
                  <select className="form-select" defaultValue={EditdocumentsData?.ItemRank} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, ItemRank: e.target.value })}>
                    {ItemRank.map(function (h: any, i: any) {
                      return (
                        <option key={i}
                          selected={EditdocumentsData?.ItemRank == h?.rank}
                          value={h?.rank} >{h?.rankTitle}</option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className='row mt-3'>                                              
                  <div className='input-group'>
                        <label className="full-width ">Title </label>
                        <input type="text" className="form-control" value={EditdocumentsData?.Title}
                        onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Title: e.target.value })}
                        />
                  </div>                                          
              </div>


              {/* ------end project--- */}

              {EditdocumentsData?.File_x0020_Type === "msg" ?
                <>
                  <div className='mt-3'>
                    <label className="form-label full-width ">Recipients </label>
                    <div className="input-group gap-1">
                      <label className='form-label full-width'>To:</label>
                      {(EditdocumentsData?.recipients) ?
                        (JSON.parse(EditdocumentsData?.recipients)?.map((item: any) => {
                          if (item.recipType == "to") {
                            return (
                              <div className="col-sm-3">
                                <div className="full-width replaceInput pe-2 alignCenter" onChange={(e) =>
                                  setEditdocumentsData({
                                    ...EditdocumentsData,
                                    recipients: e.target,
                                  })}>
                                  <span className='textDotted'>{item.email}</span>
                                </div>
                              </div>
                            )
                          }
                        }))
                        :
                        <div className="col-sm-3"
                          onChange={(e) =>
                            setEditdocumentsData({
                              ...EditdocumentsData,
                              recipients: e.target,
                            })
                          }
                        >
                          <div className="full-width replaceInput pe-2 alignCenter"></div>
                        </div>

                      }
                      <div className='input-group gap-1'>
                        <label className="form-label full-width">CC:</label>
                        {(EditdocumentsData?.recipients !== null) ?
                          (JSON.parse(EditdocumentsData?.recipients)?.map((items: any) => {
                            if (items.recipType === "cc") {
                              return (
                                <div className="col-sm-3">
                                  <div className="full-width replaceInput pe-2 alignCenter" onChange={(e) =>
                                    setEditdocumentsData({
                                      ...EditdocumentsData,
                                      recipients: e.target,
                                    })}>
                                    <span className='textDotted'>{items.email}</span>
                                  </div></div>
                              )
                            }
                          }))
                          :
                          <div className="col-sm-3"
                            onChange={(e) =>
                              setEditdocumentsData({
                                ...EditdocumentsData,
                                recipients: e.target,
                              })
                            }
                          >
                            <div className="full-width replaceInput pe-2 alignCenter"></div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>

                  <div className='d-flex gap-4 mt-2'>
                    <div className="input-group">
                      <label className="full-width">Sender</label>
                      <input type="text" className="form-control" value={EditdocumentsData?.senderEmail} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, senderEmail: e.target.value })} />

                    </div>
                    <div className="input-group"><label className=" full-width ">Creation Date & Time </label>
                      {EditdocumentsData?.creationTime ?
                        <input type="datetime" className="form-control" value={moment(EditdocumentsData?.creationTime).format("DD/MM/YYYY HH:mm")} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, creationTime: e.target.value })} />
                        :
                        (<input type="datetime" className="form-control" value={EditdocumentsData?.creationTime} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, creationTime: e.target.value })} />)

                      }
                    </div>
                  </div>
                </>
                : ""}
              {EditdocumentsData != undefined && <div className='mt-3'> <HtmlEditorCard editorValue={EditdocumentsData?.Body != undefined ? EditdocumentsData?.Body : ""} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard></div>}
            </div>
          </Tab>
          <Tab eventKey="IMAGEINFORMATION" title="IMAGE INFORMATION" className='p-0'  >
            <div className='border border-top-0 p-2'>

              {isOpenImageTab && <ImageInformation EditdocumentsData={EditdocumentsData} setData={setEditdocumentsData} AllListId={props.AllListId} Context={props.Context} callBack={imageTabCallBack} />}
              {/* {isOpenImageTab && <ImageTabComponenet EditdocumentsData={EditdocumentsData} AllListId={props.AllListId} Context={props.Context} callBack={imageTabCallBack} />} */}
            </div>
          </Tab>
        </Tabs>
        <footer className='text-end mt-2'>
          <div className='col-sm-12 row m-0'>


            <div className="col-sm-6 ps-0 text-lg-start">
              <div>
                {console.log("footerdiv")}
                <div><span className='pe-2'>Created</span><span className='pe-2'>{EditdocumentsData?.Created !== null ? moment(EditdocumentsData?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Author?.Title}</a></span></div>
                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{EditdocumentsData?.Modified !== null ? moment(EditdocumentsData?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Editor?.Title}</a></span></div>
                <div onClick={() => deleteDocumentsData(EditdocumentsData?.Id)} className="hreflink"><span style={{ marginLeft: '-4px' }} className="alignIcon hreflink svg__icon--trash svg__iconbox"></span>Delete this item</div>
              </div>
            </div>

            <div className='col-sm-6 mt-2 p-0'>
              <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.Context?._pageContext?._web?.absoluteUrl}/Documents/Forms/EditForm.aspx?ID=${EditdocumentsData?.Id != null ? EditdocumentsData?.Id : null}`}>Open out-of-the-box form</a></span>


              <button type='button' className='btn btn-primary mx-2'
                onClick={updateDocumentsData}
              >
                Save
              </button>
              <button type='button' className='btn btn-default' onClick={() => handleClosedoc()}>
                Cancel
              </button>
            </div>
          </div>
        </footer>
      </Panel>           
    </>
  )
}
export default EditLivingDocumentpanel;

