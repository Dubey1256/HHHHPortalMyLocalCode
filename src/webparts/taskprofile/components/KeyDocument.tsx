import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Web } from "sp-pnp-js";
import moment from 'moment';
import EditDocument from './EditDocunentPanel'
import { useState, useEffect, forwardRef, useImperativeHandle, createContext ,useMemo,useCallback} from 'react';
import { myContextValue } from '../../../globalComponents/globalCommon'
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import { stringify } from 'uuid';

var MyContextdata:any
const RelevantDocuments = (props: any, ref: any) => {
   MyContextdata = React.useContext(myContextValue)
    const [keyDocument, setKeyDocument] :any= useState([])
    const [copykeyDocument, setCopyKeyDocument] :any= useState([])
    const [Fileurl, setFileurl] = useState("");
    const [editdocpanel, setEditdocpanel] = useState(false);
    const [EditdocData, setEditdocData] = useState({});
    // const [showMore, setShowMore] = useState(3);


   
    React.useMemo(() => {
    //   let copydocData:any =  MyContextdata?.keyDoc.filter((docData:any)=>MyContextdata?.user?.find((user:any)=>user?.AssingedToUser?.Id==docData?.Author?.Id))
         if( MyContextdata?.keyDoc?.length>0){
            MyContextdata?.keyDoc.map((doc:any)=>{
                MyContextdata?.user?.map((user:any)=>{
                    if(user?.AssingedToUser!=undefined &&user?. AssingedToUser?.Id!=undefined){
                        if(user?. AssingedToUser?.Id==doc?.Author?.Id){
                            doc.UserImage=user?.Item_x0020_Cover?.Url
                        }
                    }
                })
            }) 
         }
        // loadAllSitesDocuments();
        // if (MyContextdata?.keyDoc?.length > 0) {
            let keydata: any =JSON.parse(JSON.stringify(MyContextdata.keyDoc))
            setKeyDocument( MyContextdata.keyDoc )
          if( keydata?.length >3){
            setCopyKeyDocument(keydata?.splice(1,3))
         
          }
         
        
           

        // }
        // if (MyContextdata?.FileDirRef != "") {
            setFileurl(MyContextdata.FileDirRef)
           

        // }
    }, [MyContextdata?.keyDoc?.length])

    const columns = useMemo<ColumnDef<unknown, unknown>[]>(() =>
        [{
            accessorKey: "",
            placeholder: "",
            size: 5,
            id: 'Id',
        },
            {
                accessorFn: (row: any) => row?.original?.Title,
                cell: ({ row, column, getValue }: any) => (
                <div className='alignCenter columnFixedTitle'>
                {row?.original?.File_x0020_Type != 'msg' && row?.original?.File_x0020_Type != 'docx' && row?.original?.File_x0020_Type != 'doc' && row?.original?.File_x0020_Type != 'rar' && row?.original?.File_x0020_Type != 'jpeg' && row?.original?.File_x0020_Type != 'jpg' && row?.original?.File_x0020_Type != 'aspx'&&row?.original?.File_x0020_Type != 'jfif' && <span className={` svg__iconbox svg__icon--${row?.original?.File_x0020_Type}`}></span>}
                {row?.original?.File_x0020_Type == 'rar' && <span className="svg__iconbox svg__icon--zip "></span>}
                {row?.original?.File_x0020_Type == 'aspx' || row?.original?.File_x0020_Type == 'msg' || row?.original?.File_x0020_Type == 'apk' ? <span className=" svg__iconbox svg__icon--unknownFile "></span> : ''}
                {row?.original?.File_x0020_Type == 'jpeg' || row?.original?.File_x0020_Type == 'jpg' ? <span className=" svg__iconbox svg__icon--jpeg "></span> : ''}
                {row?.original?.File_x0020_Type == 'doc' || row?.original?.File_x0020_Type == 'docx' ? <span className=" svg__iconbox svg__icon--docx "></span> : ''}
                {row?.original?.File_x0020_Type == 'jfif' ? <span className=" svg__iconbox svg__icon--jpeg "></span> : ''}
                <a className='ms-1 wid90' target="_blank" href={`${row?.original?.EncodedAbsUrl}?web=1`}> {row?.original?.FileLeafRef} </a>
            </div>
                ),
                id: 'Title',
                placeholder: 'Title',
                resetColumnFilters: false,
                header: '',
                size: 500,
            },
            {
                accessorFn: (row: any) => row?.Modified,
                cell: ({ row }: any) => (
                    <div className="text-center"> {row?.original.Modified !== null ? moment(row?.original.Modified).format("DD/MM/YYYY") : ""}</div>       
                ),
                id: 'Modified',
                placeholder: 'Modified',
                resetColumnFilters: false,
                header: '',
                size: 172,
            },
            {
                accessorFn: (row: any) => row?.Created,
                cell: ({ row }: any) => (
                    <div className="text-center">{row?.original.Created !== null ? moment(row?.original.Created).format("DD/MM/YYYY") : ""}
                     
                  
                                    <>
                                        <a href={`${myContextValue?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank" data-interception="off">
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src ={(row?.original?.UserImage)} />                         
                                        </a>
                                    
                                    </>
                             
                                
                    </div>
                    
                ),
                id: 'Created',
                placeholder: 'Created',
                resetColumnFilters: false,
                header: '',
                size: 120,
            },
            {
                accessorFn: "",
                cell: ({ row }: any) => (
                   <span title="Edit" className="svg__iconbox svg__icon--edit hreflink" onClick={() => editDocumentsLink(row?.original)}></span>
                    
                ),
                id: 'CreatedDate',
                placeholder: '',
                resetColumnFilters: false,
                header: '',
                size: 42,
            }
            
        ], [copykeyDocument?.length>0 ? copykeyDocument:keyDocument]);
        
       
        const ShowData = () => {
            if( keyDocument?.length >copykeyDocument?.length + 3){
                let keydata: any =JSON.parse(JSON.stringify(MyContextdata.keyDoc))
                setCopyKeyDocument(keydata.splice(1, copykeyDocument?.length + 3))
             
              }else{
                setCopyKeyDocument(keyDocument)
              }
          console.log("keydocdata",keyDocument)
            // setShowMore (copykeyDocument);
          };

            
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

const callBackData = useCallback((elem: any, getSelectedRowModel: any) => {
    console.log(getSelectedRowModel)
}, []);
    return (
        <>
         
                {console.log("context data key doc =============", MyContextdata)}
                {/* -------key documents code start */}
                {(keyDocument != undefined && keyDocument?.length > 0 )
                
                &&
                    <div className='mb-3 card commentsection'>
                        {/* <div className='card-header'> */}
                            {/* <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Key Documents<span><Tooltip ComponentId={'359'} /></span></div> */}
                        {/* </div> */}
                        {(keyDocument.map((item: any, index: any) => {
                            return (
                                <div className='card-body p-1'>
                                    <ul className='d-flex list-none'>
                                    
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
                                    </ul>    

                                </div>                          
                            )
                        })
                        // .slice(0, showMore ? keyDocument.length : 3
                        )
                         ?                                              
                        ( <GlobalCommanTable  columns={columns} data={copykeyDocument} callBackData={callBackData}/>):""}
                        
                           { copykeyDocument?.length<keyDocument?.length && (
                            <button onClick={ShowData}>
                             Show More
                             </button>
                           )}
                    </div> 
                }
                {/* -------key documents code end */}


                {editdocpanel && <EditDocument editData={EditdocData} ColorCode={MyContextdata?.ColorCode} AllListId={props.AllListId}Keydoc={true} Context={props.Context} editdocpanel={editdocpanel} callbackeditpopup={callbackeditpopup} />}
          
        </>

    )

}

export default forwardRef(RelevantDocuments);
