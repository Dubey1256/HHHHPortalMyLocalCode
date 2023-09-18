import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Web } from "sp-pnp-js";
import moment from 'moment';
import EditDocument from './EditDocunentPanel'
import { useState, useEffect,forwardRef,useImperativeHandle,createContext } from 'react';
import {MyContext} from './Taskprofile'
let mastertaskdetails:any=[];
const RelevantDocuments = (props: any,ref:any) => {
    const myContextData2:any=React.useContext<any>(MyContext)
    const [documentData, setDocumentData] = useState([]);
   
    // const [FileName, setFileName] = useState(props?.folderName);
    const [Fileurl, setFileurl] = useState("");
    (true);
    const [editdocpanel, setEditdocpanel] = useState(false);
    const [EditdocData, setEditdocData] = useState({});
    // console.log(props?.folderName);

    useEffect(() => {
        loadAllSitesDocuments();
    }, [])
    useImperativeHandle(ref,()=>({
        loadAllSitesDocuments
    }))
    const loadAllSitesDocuments = async () => {
        if(props.siteName=="Offshore Tasks"){
            props.siteName="OffShoreTask"  
        }
        const web = new Web(props.siteUrl);
        var filter = (`${props?.siteName}/Id eq ${props?.ID}`);
        console.log(filter);
        try{
            // await web.lists.getByTitle("Documents")
            await web.lists.getById(props.DocumentsListID)
            // .items.select("Id,Title,PriorityRank,Year,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl")
            // .expand("Author,Editor").filter(`${props?.siteName}/Id eq ${props?.ID}`).top(4999)
            // .get()
            .items.select("Id,Title,PriorityRank,Year,Body,Item_x0020_Cover,SharewebTask/Id,SharewebTask/Title,SharewebTask/ItemType,Portfolios/Id,Portfolios/Title,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl")
          .expand("Author,Editor,SharewebTask,Portfolios").filter(`${props?.siteName}/Id eq ${props?.ID}`).top(4999)
          .get()
            .then((Data: any[]) => {
              let keydoc:any=[];
                Data?.map((item: any, index: any) => {
                    item.siteType = 'sp'
                    item.Description=item?.Body
                    // item.Author = item?.Author?.Title;
                    // item.Editor = item?.Editor?.Title;
                    item.ModifiedDate = moment(item?.ModifiedDate).format("'DD/MM/YYYY HH:mm'");
                    if(item.ItemRank===6){
                        keydoc.push(item)
                    }
                })
                console.log("document data", Data);
                let smartmetadta:any=[];
                myContextData2.FunctionCall(keydoc,Data[0]?.FileDirRef,false)
                LoadMasterTaskList().then((smartData:any)=>{
                    smartmetadta=smartmetadta.concat(smartData)
                    Data?.map((servicecomponent: any) => {
                        if (servicecomponent.Portfolios != undefined && servicecomponent.Portfolios.length > 0) {
                            smartmetadta.map((mastertask: any) => {
                            if (mastertask.Id == servicecomponent.Portfolios[0].Id) {
                              servicecomponent.Portfolio = mastertask
                            }
                          })
                        }
                      })
               
                    var releventData=Data.filter((d)=>d.ItemRank!=6)
                    setDocumentData(releventData);
                  
                    setFileurl(Data[0]?.FileDirRef) 
                }).catch((error:any)=>{
                  var releventData=Data.filter((d)=>d.ItemRank!=6)
                  setDocumentData(releventData);
                    console.log(error)
                })
                
            })
            // .catch((err) => {
            //     console.log(err.message);
            // });
        }catch(e: any){
         console.log(e)
        }
       

    }
    const LoadMasterTaskList = ()=> {
        return new Promise(function(resolve, reject) {
    
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
        
           
            // return dataserviccomponent
            resolve(dataserviccomponent)
      
          }).catch((error: any) => {
            console.log(error)
            reject(error)
          })
        })
      }
    const editDocumentsLink = (editData: any) => {
        setEditdocpanel(true);
        console.log(editData)
        setEditdocData(editData)
       
      }
      const callbackeditpopup=()=>{
        loadAllSitesDocuments();
        setEditdocpanel(false);
      }
    return (
        <>
              
            {documentData!=undefined&&documentData?.length>0 && props?.keyDoc==undefined && 
            <div className='mb-3 card commentsection'>
                <div className='card-header'>
                    <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Relevant Documents<span><Tooltip ComponentId={'359'}/></span></div>
                </div>

           
                {documentData?.map((item: any, index: any) => {
                    return (
                        <div className='card-body p-1'>
                            <ul  className='d-flex list-none'>
                                {/* <li>
                                   <a  href={item?.FileDirRef} target="_blank" data-interception="off" > <span className='svg__iconbox svg__icon--folder'></span></a>
                                </li> */}
                                <li>
                                  <a  href={item.EncodedAbsUrl}>
                                    {item?.File_x0020_Type=="pdf"&&<span className='svg__iconbox svg__icon--pdf' title="pdf"></span>}
                                    {item?.File_x0020_Type=="docx"&&<span className='svg__iconbox svg__icon--docx'title="docx"></span>} 
                                    {item?.File_x0020_Type=="csv"&&<span className='svg__iconbox svg__icon--csv'title="csv"></span>}
                                    {item?.File_x0020_Type=="xlsx"&&<span className='svg__iconbox svg__icon--xlsx'title="xlsx"></span> }
                                    {item?.File_x0020_Type=="jpeg"||item?.File_x0020_Type=="jpg "&&<span className='svg__iconbox svg__icon--jpeg'title="jpeg"></span>}
                                    {item?.File_x0020_Type=="ppt"||item?.File_x0020_Type=="pptx"&&<span className='svg__iconbox svg__icon--ppt'title="ppt"></span>}
                                    {item?.File_x0020_Type=="svg"&&<span className='svg__iconbox svg__icon--svg'title="svg"></span>}
                                    {item?.File_x0020_Type=="zip"&&<span className='svg__iconbox svg__icon--zip'title="zip"></span>}
                                    {item?.File_x0020_Type=="png"&&<span className='svg__iconbox svg__icon--png'title="png"></span>}
                                    {item?.File_x0020_Type=="txt"&&<span className='svg__iconbox svg__icon--txt'title="txt"></span>}
                                    {item?.File_x0020_Type=="smg"&&<span className='svg__iconbox svg__icon--smg'title="smg"></span>}
                                    
                                    </a>
                                
                                </li>
                                <li>
                                   <a className='px-2' href={`${item?.EncodedAbsUrl}?web=1`}target="_blank" data-interception="off"> <span>{item?.Title}</span></a>
                                </li>
                                <li className='d-end'>
                              <span title="Edit" className="svg__iconbox svg__icon--edit hreflink" onClick={() => editDocumentsLink(item)}></span>
                       
                            </li>

                            </ul>
                        </div>
                    )
                })}
               
            </div>
             }
              
            {documentData?.length>0 &&props?.keyDoc==undefined&&<div className='mb-3 card commentsection'>
                <div className='card-header'>
                    <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Main Folder<span><Tooltip /></span></div>
                </div>
                <div className='card-body p-1'>
                <ul className='list-none'>
                                <li>
                                   <a  href={Fileurl} target="_blank" data-interception="off"  className='d-flex'> <span className='svg__iconbox svg__icon--folder '></span> <span className='ms-3'>{props?.folderName}</span></a>
                                </li>
                                </ul>
                    </div>
                </div>
              }

              {editdocpanel &&<EditDocument editData={EditdocData} AllListId={props.AllListId}Context={props.Context}editdocpanel={editdocpanel}callbackeditpopup={callbackeditpopup}/>}       
             
        </>
    
    )
    
}

export default forwardRef(RelevantDocuments);
export {MyContext}