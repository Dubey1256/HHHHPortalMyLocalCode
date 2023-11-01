import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Web } from "sp-pnp-js";
import moment from 'moment';
import EditDocument from './EditDocunentPanel'
import { useState, useEffect, forwardRef, useImperativeHandle, createContext } from 'react';
import { myContextValue } from '../../../globalComponents/globalCommon'

var MyContextdata:any
const RelevantDocuments = (props: any, ref: any) => {
   MyContextdata = React.useContext(myContextValue)
    const [keyDocument, setKeyDocument] = useState([])
    const [Fileurl, setFileurl] = useState("");
    (true);
    const [editdocpanel, setEditdocpanel] = useState(false);
    const [EditdocData, setEditdocData] = useState({});


    React.useMemo(() => {
        // loadAllSitesDocuments();
        // if (MyContextdata?.keyDoc?.length > 0) {
            setKeyDocument(MyContextdata.keyDoc)
        // }
        // if (MyContextdata?.FileDirRef != "") {
            setFileurl(MyContextdata.FileDirRef)
        // }
    }, [MyContextdata?.keyDoc?.length])

   
    const editDocumentsLink = (editData: any) => {
    
        setEditdocpanel(true);
        console.log(editData)
        setEditdocData(editData)

    }
    const callbackeditpopup = React.useCallback((EditdocumentsData:any) => {
        // loadAllSitesDocuments();
      console.log(EditdocumentsData)
        setEditdocpanel(false);
        if(EditdocumentsData?.ItemType!=6){
            if (MyContextdata?.keyDoc?.length > 0) {
                let updatedData:any=MyContextdata?.keyDoc?.filter((item:any)=>item.Id!=EditdocumentsData.Id)
                MyContextdata.FunctionCall(updatedData,Fileurl,true)
            }
        }
        // else if(EditdocumentsData=='delete'){
        //     MyContextdata.FunctionCall(null,null,true) 
        // }
       
},[])
    return (
        <>
         
                {console.log("context data key doc =============", MyContextdata)}
                {/* -------key documents code start */}
                {keyDocument != undefined && keyDocument?.length > 0 &&
                    <div className='mb-3 card commentsection'>
                        <div className='card-header'>
                            <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Key Documents<span><Tooltip ComponentId={'359'} /></span></div>
                        </div>
                        {keyDocument?.map((item: any, index: any) => {
                            return (
                                <div className='card-body p-1'>
                                    <ul className='d-flex list-none'>
                                        {/* <li>
                                   <a  href={item?.FileDirRef} target="_blank" data-interception="off" > <span className='svg__iconbox svg__icon--folder'></span></a>
                                </li> */}
                                        <li>
                                            <a href={item.EncodedAbsUrl}>
                                                {item?.File_x0020_Type == "pdf" && <span className='svg__iconbox svg__icon--pdf' title="pdf"></span>}
                                                {item?.File_x0020_Type == "docx" && <span className='svg__iconbox svg__icon--docx' title="docx"></span>}
                                                {item?.File_x0020_Type == "csv" && <span className='svg__iconbox svg__icon--csv' title="csv"></span>}
                                                {item?.File_x0020_Type == "xlsx" && <span className='svg__iconbox svg__icon--xlsx' title="xlsx"></span>}
                                                {item?.File_x0020_Type == "jpeg" || item?.File_x0020_Type == "jpg " && <span className='svg__iconbox svg__icon--jpeg' title="jpeg"></span>}
                                                {item?.File_x0020_Type == "ppt" || item?.File_x0020_Type == "pptx" && <span className='svg__iconbox svg__icon--ppt' title="ppt"></span>}
                                                {item?.File_x0020_Type == "svg" && <span className='svg__iconbox svg__icon--svg' title="svg"></span>}
                                                {item?.File_x0020_Type == "zip" && <span className='svg__iconbox svg__icon--zip' title="zip"></span>}
                                                {item?.File_x0020_Type == "png" && <span className='svg__iconbox svg__icon--png' title="png"></span>}
                                                {item?.File_x0020_Type == "txt" && <span className='svg__iconbox svg__icon--txt' title="txt"></span>}
                                                {item?.File_x0020_Type == "smg" && <span className='svg__iconbox svg__icon--smg' title="smg"></span>}

                                            </a>

                                        </li>
                                        <li>
                                            <a className='px-2' href={`${item?.EncodedAbsUrl}?web=1`} target="_blank" data-interception="off"> <span>{item?.Title}</span></a>
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
                {/* -------key documents code end */}


                {editdocpanel && <EditDocument editData={EditdocData} AllListId={props.AllListId}Keydoc={true} Context={props.Context} editdocpanel={editdocpanel} callbackeditpopup={callbackeditpopup} />}
          
        </>

    )

}

export default forwardRef(RelevantDocuments);
