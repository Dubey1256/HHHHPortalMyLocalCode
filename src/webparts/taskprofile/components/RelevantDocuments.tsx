import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Web } from "sp-pnp-js";
import moment from 'moment';
import EditDocument from './EditDocunentPanel'
import { useState, useEffect, forwardRef, useImperativeHandle, createContext } from 'react';
// import { MyContext } from './Taskprofile'
import { myContextValue } from "../../../globalComponents/globalCommon";
let mastertaskdetails: any = [];
const RelevantDocuments = (props: any, ref: any) => {
  const myContextData2: any = React.useContext<any>(myContextValue)
  const [documentData, setDocumentData] = useState([]);

  const [Fileurl, setFileurl] = useState("");
  (true);
  const [editdocpanel, setEditdocpanel] = useState(false);
  const [EditdocData, setEditdocData] = useState({});


  useEffect(() => {
    loadAllSitesDocuments();
  }, [])
  useImperativeHandle(ref, () => ({
    loadAllSitesDocuments
  }))
  const loadAllSitesDocuments = async () => {
    let query = "Id,Title,PriorityRank,Year,Body,Item_x0020_Cover,Portfolios/Id,Portfolios/Title,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl&$expand=Author,Editor,Portfolios"
    if (props.siteName == "Offshore Tasks") {
      props.siteName = "OffShoreTask"
    } else if (props?.siteName == "Master Tasks" || props?.siteName == "Portfolios") {
      props.siteName = 'Portfolios';
      query = "Id,Title,PriorityRank,Year,Body,Item_x0020_Cover,Portfolios/Id,Portfolios/Title,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl&$expand=Author,Editor,Portfolios"

    }
    const web = new Web(props?.siteUrl);
    var filter = (`${props?.siteName}/Id eq ${props?.ID}`);

    console.log(filter);
    try {
      // await web.lists.getByTitle("Documents")
      await web.lists.getById(props?.DocumentsListID)

        .items.select(query)
        .filter(`(${props?.siteName}/Id eq ${props?.ID})and(File_x0020_Type ne 'msg')`)
        .getAll()
        .then((Data: any[]) => {
          let keydoc: any = [];
          if (Data?.length > 0) {
            Data?.map((item: any, index: any) => {
              if(item?.Title.includes(item?.File_x0020_Type)){
                item.Title = getUploadedFileName(item?.Title);
              }
              item.siteType = 'sp'
              item.Description = item?.Body
              if (item?.Title != undefined && item?.File_x0020_Type != undefined) {
                item.docType = item?.File_x0020_Type;
              } else if (item?.Title != undefined && item?.itemSystemObjectType != 1) {
                item.docType = getFileType(item?.Name);
              }
              if (item?.File_x0020_Type == 'aspx') {
                item.docType = 'link'
              }
              if (item?.File_x0020_Type == 'rar') {
                item.docType = 'zip'
              }
              if (item?.File_x0020_Type == 'jpg' || item?.File_x0020_Type == 'jfif') {
                item.docType = 'jpeg'
              }
              if (item?.File_x0020_Type == 'doc') {
                item.docType = 'docx'
              }
              // item.Author = item?.Author?.Title;
              // item.Editor = item?.Editor?.Title;
              item.CreatedDate = moment(item?.Created).format("'DD/MM/YYYY HH:mm'");
              item.ModifiedDate = moment(item?.ModifiedDate).format("'DD/MM/YYYY HH:mm'");
              if (item.ItemRank === 6) {
                keydoc.push(item)
              }

            })
            console.log("document data", Data);
            if (myContextData2?.FunctionCall != undefined && keydoc?.length > 0) {
              myContextData2?.FunctionCall(keydoc, Data[0]?.FileDirRef, false)
            }
              var releventData = Data?.filter((d) => d.ItemRank != 6 && d.ItemRank != 0)
              if (releventData?.length > 0) {
                setDocumentData(releventData);
              } else {
                setDocumentData([])
              }


              setFileurl(Data[0]?.FileDirRef)
           
          }
          else {
            setDocumentData([]);
          }

        })

    } catch (e: any) {
      console.log(e)
    }


  }
  function getFileType(fileName: any) {
    const regex = /(?:\.([^.]+))?$/;
    const match = regex.exec(fileName);
    if (match === null) {
      return null;
    }
    return match[1];
  }

  const editDocumentsLink = (editData: any) => {
    setEditdocpanel(true);
    console.log(editData)
    setEditdocData(editData)

  }
  const callbackeditpopup = () => {
    loadAllSitesDocuments();
    setEditdocpanel(false);
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
  return (
    <>

      {documentData != undefined && documentData?.length > 0 && props?.keyDoc == undefined &&
        <div className='mb-3 card commentsection'>
          <div className='card-header'>
            <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Relevant Documents<span><Tooltip ComponentId={'359'} /></span></div>
          </div>


          {documentData?.map((item: any, index: any) => {
            return (
              <div className='card-body p-1'>
                <ul className='alignCenter list-none text-break'>
                  {/* <li>
                                   <a  href={item?.FileDirRef} target="_blank" data-interception="off" > <span className='svg__iconbox svg__icon--folder'></span></a>
                                </li> */}
                  <li className='pe-1'>
                    <a href={item.EncodedAbsUrl}>
                      <span className={`alignIcon svg__iconbox svg__icon--${item?.docType}`} title={item?.File_x0020_Type}></span>
                    </a>
                  </li>
                  <li>
                    <a className='fontColor3' href={item?.File_x0020_Type == "aspx" ? `${item?.Url?.Url}` : `${item?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off">{item?.Title}.{item?.docType}</a>
                  </li>
                  <li className='ml-auto ps-1'>
                    <span title="Edit" className="svg__iconbox svg__icon--edit hreflink alignIcon" onClick={() => editDocumentsLink(item)}></span>

                  </li>

                </ul>
              </div>
            )
          })}

        </div>
      }

      {documentData?.length > 0 && props?.keyDoc == undefined && props?.siteName != "Master Tasks" && props?.siteName != "Portfolios" && <div className='mb-3 card commentsection'>
        <div className='card-header'>
          <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Main Folder<span><Tooltip /></span></div>
        </div>
        <div className='card-body p-1'>
          <ul className='list-none'>
            <li>
              <a href={Fileurl} target="_blank" data-interception="off" className='d-flex'> <span className='svg__iconbox svg__icon--folder wid30 me-2'></span> <span>{props?.folderName}</span></a>
            </li>
          </ul>
        </div>
      </div>
      }

      {editdocpanel && <EditDocument editData={EditdocData} ColorCode={myContextData2?.ColorCode} AllListId={props.AllListId} Context={props.Context} editdocpanel={editdocpanel} siteName={props?.siteName} callbackeditpopup={callbackeditpopup} />}

    </>

  )

}

export default forwardRef(RelevantDocuments);
