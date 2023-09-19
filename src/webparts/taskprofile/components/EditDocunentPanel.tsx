import * as React from 'react';
import { Panel, PanelType } from 'office-ui-fabric-react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Button, Tabs, Tab, Col, Nav, Row } from 'react-bootstrap';
import moment from 'moment';
import { Web } from 'sp-pnp-js';

import HtmlEditorCard from '../../../globalComponents/./HtmlEditor/HtmlEditor'
import ImageTabComponenet from './ImageTabComponent'
import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
import Mycontext from './RelevantDocuments'
const EditDocumentpanel=(props:any)=>{
  // const contextdata: any = React.useContext<any>(Mycontext)
    const [Editdocpanel, setEditdocpanel] = React.useState(false);
    const [EditdocumentsData, setEditdocumentsData] = React.useState(null);
    const [servicespopup, setservicespopup] = React.useState(false);
  
    const [isOpenImageTab, setisOpenImageTab] = React.useState(false);
    const [isopencomonentservicepopup, setisopencomonentservicepopup] = React.useState(false);
    const [editvalue, seteditvalue] = React.useState(null);
    const [allValue, setallSetValue] = React.useState({
        Title: "", URL: "", Acronym: "", Description: "", InfoType: "SmartNotes", SelectedFolder: "Public", fileupload: "", LinkTitle: "", LinkUrl: "", taskTitle: "", Dragdropdoc: "", emailDragdrop: "", ItemRank: "", componentservicesetdata: { smartComponent: undefined, linkedComponent: undefined }, componentservicesetdataTag: undefined, EditTaskpopupstatus: false, DocumentType: "", masterTaskdetails: [],
      })

      React.useEffect(() => {
         if(props?.editData!=undefined){
  
          if (props?.editData?.Portfolio!=undefined) {
            setallSetValue({ ...allValue, componentservicesetdataTag: props?.editData?.Portfolio })
          
          } 
          
        if(props?.editData!=undefined)
        {
          props.editData. docTitle= props?.editData.Title.split(props?.editData.File_x0020_Type)[0]
        }
        setEditdocumentsData(props?.editData); 
         }
             
    }, [])
       
    const handleClosedoc = () => {
        
        props.callbackeditpopup();
        
       
      }
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
      
      const deleteDocumentsData = async (DeletItemId: any) => {
        console.log(DeletItemId);
        const web = new Web(props?.AllListId?.siteUrl);
        // await web.lists.getByTitle("SmartInformation")
        var text: any = "Are you sure want to Delete ?";
        if (confirm(text) == true) {
          await web.lists.getById(props?.AllListId?.DocumentsListID)
            .items.getById(DeletItemId).recycle()
            .then((res: any) => {
              console.log(res);
            //   GetResult();
            //   handleClose();
              setEditdocpanel(false);
              if(props.Keydoc){
                props.callbackeditpopup("delete");
              }else{
                props.callbackeditpopup();
              }
            
            })
            .catch((err) => {
              console.log(err.message);
            });
        }
    
    
      };
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
            Title: EditdocumentsData.docTitle,
            ItemRank: EditdocumentsData.ItemRank,
            Year: EditdocumentsData.Year,
            ItemType: EditdocumentsData.ItemType,
    
            PortfoliosId: { "results": allValue.componentservicesetdataTag != undefined ? [allValue.componentservicesetdataTag.Id] : [] },
            Body:allValue?.Description != "" ? allValue?.Description : "",
            Item_x0020_Cover: {
              "__metadata": { type: 'SP.FieldUrlValue' },
              'Description': EditdocumentsData?.Item_x0020_Cover?.Url != "" ? EditdocumentsData?.UrItem_x0020_Coverl?.Url : "",
              'Url': EditdocumentsData?.Item_x0020_Cover?.Url ? EditdocumentsData?.Item_x0020_Cover?.Url : "",
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
            // handleClose();
            setallSetValue({ ...allValue, EditTaskpopupstatus: false })

            setEditdocpanel(false);
            if(props.Keydoc){
              props.callbackeditpopup(EditdocumentsData);
            }else{
              props.callbackeditpopup();
            }
           
            // GetResult();
          }).catch((err: any) => {
            console.log(err)
          })
    
        // })
    
      }
      const imageTabCallBack = React.useCallback((data: any) => {
        console.log(EditdocumentsData);
        console.log(data)
        setEditdocumentsData(data);
      }, [])
    
    
    const onRenderCustomHeaderDocuments = () => {
      
        return (
          <>
    
            <div className='ps-4 siteColor subheading'>
              {true ? `Edit Document Metadata - ${EditdocumentsData?.FileLeafRef}` : null}
            </div>
            <Tooltip ComponentId={'359'} />
          </>
        );
      };
      const imageta=(e:any)=>{
        if(e){
            setisOpenImageTab(true)
        }
      }
      const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
        console.log(DataItem)
        console.log(Type)
        console.log(functionType)
        if (functionType == "Save") {
          // if (Type == "Component") {
            setallSetValue({ ...allValue, componentservicesetdataTag: DataItem[0] })
          // }
          // if (Type == "Service") {
          //   setallSetValue({ ...allValue, componentservicesetdataTag: DataItem[0] })
          // }
          setisopencomonentservicepopup(false);
        }
        else {
          setisopencomonentservicepopup(false);
        }
      }, [])
      const opencomonentservicepopup=()=>{
        setisopencomonentservicepopup(true)
       
     
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
        setallSetValue({ ...allValue, Description: description })
      }
      //////// folora editor function end///////////
return(
  <>
    <Panel onRenderHeader={onRenderCustomHeaderDocuments}
        isOpen={true}
        type={PanelType.custom}
        customWidth="1091px"
        onDismiss={handleClosedoc}
        isBlocking={false}
        className={servicespopup == true ? "serviepannelgreena" : "siteColor"}
      >
        

        <Tabs
          defaultActiveKey="BASICINFORMATION"
          transition={false}
          id="noanim-tab-example"
          className=""
          onSelect={imageta}
        >

          <Tab eventKey="BASICINFORMATION" title="BASIC INFORMATION">

            <div className='border border-top-0 p-2'>
              {EditdocumentsData?.Url?.Url && <div className='d-flex'>
                <div className='input-group'><label className='form-label full-width'>URL</label>
                  <input type='text' className="from-control w-75" value={EditdocumentsData?.Url?.Url} onChange={(e => setEditdocumentsData({ ...EditdocumentsData, Url: { ...EditdocumentsData.Url, Url: e.target.value } }))}></input>
                </div>
              </div>}

              <div className='d-flex'>
                <div className="input-group"><label className=" full-width ">Name </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.docTitle} onChange={(e => setEditdocumentsData({ ...EditdocumentsData, docTitle: e.target.value }))} />.{EditdocumentsData?.File_x0020_Type}
                </div>

                <div className="input-group mx-4"><label className="full-width ">Year </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Year} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, Year: e.target.value })} />
                  {/* <span className="input-group-text" title="Linked Component Task Popup">
                    <span className="svg__iconbox svg__icon--editBox"></span>
                  </span> */}
                </div>

                <div className="input-group">
                  <label className="full-width">Item Rank</label>
                  <select className="form-select" defaultValue={EditdocumentsData?.ItemRank} onChange={(e) => setEditdocumentsData({ ...EditdocumentsData, ItemRank: e.target.value })}>
                    {ItemRank.map(function (h: any, i: any) {
                      return (
                        <option key={i} 
                        selected={allValue?.ItemRank == h?.rank}
                         value={h?.rank} >{h?.rankTitle}</option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className='d-flex mt-3'>
                <div className="input-group"><label className="full-width ">Title </label>
                  <input type="text" className="form-control" value={EditdocumentsData?.Title}
                   onChange={(e => setallSetValue({ ...allValue, Title: e.target.value }))}
                    />
                </div>
                <div className="input-group mx-4">
                  <label className="form-label full-width">
                    portfolio
                    
                  </label>

                  {allValue?.componentservicesetdataTag != undefined &&
                    <div className="d-flex justify-content-between block px-2 py-1" style={{ width: '85%' }}>
                      <a target="_blank" data-interception="off" href="HHHH/SitePages/Portfolio-Profile.aspx?taskId=undefined">{allValue?.componentservicesetdataTag.Title}</a>
                      <a>
                        <span className="bg-light svg__icon--cross svg__iconbox"></span>
                      </a></div>}

                  {allValue?.componentservicesetdataTag == undefined && <input type="text" className="form-control" readOnly />}
                  <span className="input-group-text" title="Linked Component Task Popup">
                    <span className="svg__iconbox svg__icon--editBox" onClick={(e) => opencomonentservicepopup()}></span>
                  </span>
                </div>
    
              </div>

            </div>
          </Tab>
          <Tab eventKey="IMAGEINFORMATION" title="IMAGE INFORMATION" >
            <div className='border border-top-0 p-2'>

              {isOpenImageTab &&<ImageTabComponenet EditdocumentsData={EditdocumentsData} AllListId={props.AllListId} Context={props.Context} callBack={imageTabCallBack} />}
            </div>
          </Tab>
        </Tabs>
        <footer className='text-end mt-2'>
          <div className='col-sm-12 row m-0'>
            
            <div className='mt-3'> <HtmlEditorCard editorValue={EditdocumentsData?.Description != null ? EditdocumentsData?.Description : ""} HtmlEditorStateChange={HtmlEditorCallBack}> </HtmlEditorCard></div>
            <div className="col-sm-6 text-lg-start">
            <div>
                {console.log("footerdiv")}
                <div><span className='pe-2'>Created</span><span className='pe-2'>{EditdocumentsData?.Created !== null ? moment(editvalue?.Created).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Author?.Title}</a></span></div>
                <div><span className='pe-2'>Last modified</span><span className='pe-2'>{EditdocumentsData?.Modified !== null ? moment(editvalue?.Modified).format("DD/MM/YYYY HH:mm") : ""}&nbsp;By</span><span><a>{EditdocumentsData?.Editor?.Title}</a></span></div>
                <div><span onClick={() => deleteDocumentsData(EditdocumentsData?.Id)} className="svg__iconbox svg__icon--trash hreflink"></span>Delete this item</div>
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

          props={allValue?.componentservicesetdata}
          Dynamic={props.AllListId}
          ComponentType={"Component"}
          Call={ComponentServicePopupCallBack}

        />
      }
      
</>
)
}
export default EditDocumentpanel;
 