import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Button, Tabs, Tab, Col, Nav, Row } from 'react-bootstrap';
import moment from 'moment';
import { Web } from 'sp-pnp-js';
import HtmlEditorCard from '../../../globalComponents/./HtmlEditor/HtmlEditor'
import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
import ImageInformation from '../../EditPopupFiles/ImageInformation';
 let mastertaskdetails:any=[]
 let   copyEditData:any={}
const EditDocumentpanel = (props: any) => {
 
  const [EditdocumentsData, setEditdocumentsData] :any= React.useState();
   const [isOpenImageTab, setisOpenImageTab] = React.useState(false);
  const [isopencomonentservicepopup, setisopencomonentservicepopup] = React.useState(false);
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
    if (props?.editData != undefined) {
      LoadMasterTaskList().then((smartData: any) => {
        loadSelectedDocuments() 
      }).catch((error:any)=>{
        console.log(error)
      })
  
      
     
    }
  }, [props?.editData!=undefined])

  const loadSelectedDocuments = async () => {
    const web = new Web(props?.AllListId?.siteUrl);
    try {
      await web.lists.getById(props?.AllListId?.DocumentsListID)
        .items.getById(props?.editData?.Id)
        .select( 'Id','Title','PriorityRank','Year','Body','Item_x0020_Cover','Portfolios/Id','Portfolios/Title','File_x0020_Type','FileLeafRef','FileDirRef','ItemRank','ItemType','Url','Created','Modified','Author/Id','Author/Title','Editor/Id','Editor/Title','EncodedAbsUrl')
        .expand('Author,Editor,Portfolios')
        .get()
        .then((Data) => {
          Data.Title = getUploadedFileName( Data?.Title);
          Data.siteType = 'sp';
          Data.docTitle = getUploadedFileName( Data?.Title);
          Data.Item_x002d_Image=Data?.Item_x0020_Cover
           let portfolioData:any=[]
          if (Data.Portfolios != undefined && Data?.Portfolios?.length > 0) {
            Data?.Portfolios?.map((portfolio: any) => {
              mastertaskdetails.map((mastertask: any) => {
                if (mastertask.Id == portfolio.Id) {
                  portfolioData.push(mastertask);
                }
              });
            });
            Data.Portfolios=portfolioData
          }
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
          mastertaskdetails = dataserviccomponent;
          resolve(dataserviccomponent)

        }).catch((error: any) => {
          console.log(error)
          reject(error)
        })
    })
  }
   const handleClosedoc = () => {
    mastertaskdetails=[]
     props.callbackeditpopup();
   }

  const deleteDocumentsData = async (DeletItemId: any) => {
    console.log(DeletItemId);
    const web = new Web(props?.AllListId?.siteUrl);
   var text: any = "Are you sure want to Delete ?";
    if (confirm(text) == true) {
      await web.lists.getById(props?.AllListId?.DocumentsListID)
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
    let  componetServicetagData: any=[];
    if (EditdocumentsData?.Portfolios?.length>0) {
      EditdocumentsData?.Portfolios?.map((portfolioId:any)=>{
        componetServicetagData.push(portfolioId?.Id)
      })
   
    }
  const web = new Web(props?.AllListId?.siteUrl);
    await web.lists.getById(props?.AllListId?.DocumentsListID)
      .items.getById(EditdocumentsData.Id).update({
        Title: EditdocumentsData?.Title,
        ItemRank: EditdocumentsData?.ItemRank == 'Select Item Rank' ? null : EditdocumentsData?.ItemRank,
        Year: EditdocumentsData.Year,
        ItemType: EditdocumentsData.ItemType,
         PortfoliosId: { "results": componetServicetagData.length>0 ?componetServicetagData : [] },
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

      }).then((updatedItem: any) => {
        console.log(updatedItem)
        if (EditdocumentsData?.Url != undefined) {
          alert(" Link update successfully");
        } else {
          alert("Document(s) update successfully");
        }
      
       
        // setEditdocpanel(false);
        if (props?.Keydoc) {
          props.callbackeditpopup(EditdocumentsData);
        } else {
          props.callbackeditpopup();
        }
        mastertaskdetails=[]
      
      }).catch((err: any) => {
        console.log(err)
      }) 
    }
  const imageTabCallBack = React.useCallback((data: any) => {
    console.log(EditdocumentsData);
    console.log(data)
    if(data!=undefined){
      setEditdocumentsData(data);
    }
    
  }, [])


  const onRenderCustomHeaderDocuments = () => {

    return (
      <>
        <div className='ps-4 siteColor subheading'>
          {true ? `Edit Document Metadata - ${EditdocumentsData?.Title}` : null}
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
  const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
    console.log(DataItem)
    console.log(Type)
    console.log(EditdocumentsData)
    console.log(copyEditData)
    console.log(functionType)
    if (functionType == "Save") {
      let copyPortfoliosData= copyEditData?.Portfolios?.length>0?copyEditData?.Portfolios:[]
      copyPortfoliosData.push(DataItem[0])
      setEditdocumentsData({...copyEditData,Portfolios:copyPortfoliosData});
       setisopencomonentservicepopup(false);
    }
    else {
      setisopencomonentservicepopup(false);
    }
  }, [])

  const getUploadedFileName = (fileName: any) => {
    const indexOfLastDot = fileName?.lastIndexOf('.');
    if (indexOfLastDot !== -1) {
        const extractedPart = fileName?.substring(0, indexOfLastDot);
        return extractedPart;
    }else{
        return fileName
    }
}

  const opencomonentservicepopup = () => {
    copyEditData=[]
    copyEditData= EditdocumentsData
    setisopencomonentservicepopup(true)
     }

      const DeleteTagPortfolios=(deletePortfolioId:any)=>{
      let   copyEditData= EditdocumentsData
          setEditdocumentsData((prev:any)=>{
            return{
              ...prev,Portfolios:prev.Portfolios?.filter((portfolio:any)=>portfolio?.Id!=deletePortfolioId)
            }
          })

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
    let copyData= {...EditdocumentsData}
    copyData.Body=description
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
                  <input type='text' className="from-control w-75" value={EditdocumentsData?.EncodedAbsUrl} onChange={(e => setEditdocumentsData({ ...EditdocumentsData, Url: { ...EditdocumentsData.Url, Url: e.target.value } }))}></input>
                </div>
              </div>}

              <div className='d-flex'>
                <div className="input-group"><label className=" full-width ">Name </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.docTitle} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, docTitle: e.target.value })} />.{EditdocumentsData?.File_x0020_Type}
                </div>

                <div className="input-group mx-4"><label className="full-width ">Year </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Year} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Year: e.target.value })} />
               
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
              <div className='d-flex mt-3'>
                <div className="input-group"><label className="full-width ">Title </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Title}
                    onChange={(e) =>setEditdocumentsData({ ...EditdocumentsData, Title: e.target.value })}
                  />
                </div>
                <div className="input-group mx-4">
                  <label className="form-label full-width">
                    Portfolios
                  </label>

                  {EditdocumentsData?.Portfolios != undefined &&
                  EditdocumentsData?.Portfolios?.map((portfolio:any)=>{
                    return(
                        <div className="d-flex justify-content-between block px-2 py-1" style={{ width: '85%' }}>
                      <a target="_blank" data-interception="off" href={`${props?.AllListId?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${portfolio?.Id}`}>{portfolio?.Title}</a>
                      <a>
                        <span className="bg-light svg__icon--cross svg__iconbox" onClick={()=>DeleteTagPortfolios(portfolio?.Id)}></span>
                      </a></div>
                    )
                  })
                }

                  {EditdocumentsData?.Portfolios?.length==0  &&
                  
                  <input type="text" className="form-control" readOnly />}
                  <span className="input-group-text" title="Linked Component Task Popup">
                    <span className="svg__iconbox svg__icon--editBox" onClick={(e) => opencomonentservicepopup()}></span>
                  </span>
                </div>

              </div>
             {EditdocumentsData!=undefined && <div className='mt-3'> <HtmlEditorCard editorValue={EditdocumentsData?.Body != undefined ? EditdocumentsData?.Body : ""} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard></div>} 
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


            <div className="col-sm-6 text-lg-start">
              <div>
                {console.log("footerdiv")}
                <div><span className='pe-2'>Created</span><span className='pe-2'>{EditdocumentsData?.Created !== null ? moment(EditdocumentsData?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Author?.Title}</a></span></div>
                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{EditdocumentsData?.Modified !== null ? moment(EditdocumentsData?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Editor?.Title}</a></span></div>
                <div onClick={() => deleteDocumentsData(EditdocumentsData?.Id)} className="hreflink"><span className="alignIcon hreflink svg__icon--trash svg__iconbox"></span>Delete this item</div>
              </div>
            </div>

            <div className='col-sm-6 mt-2 p-0'>
              <span className='pe-2'><a target="_blank" data-interception="off" href={`${props?.Context?._pageContext?._web?.absoluteUrl}/Documents/Forms/EditForm.aspx?ID=${EditdocumentsData?.Id != null ? EditdocumentsData?.Id : null}`}>Open out-of-the-box form</a></span>

              <Button className='btn btn-primary ms-1  mx-2'
                onClick={updateDocumentsData}
              >
                Save
              </Button>
              <Button className='btn btn-default' onClick={() => handleClosedoc()}>
                Cancel
              </Button>
            </div>
          </div>
        </footer>
      </Panel>
      {isopencomonentservicepopup &&
        <ServiceComponentPortfolioPopup

          // props={allValue?.componentservicesetdata}
          Dynamic={props.AllListId}
          ComponentType={"Component"}
          Call={ComponentServicePopupCallBack}

        />
      }

    </>
  )
}
export default EditDocumentpanel;
