import * as React from 'react';

import moment from 'moment';
import EditDocument from './EditDocunentPanel'
import { useState, useEffect, forwardRef, useImperativeHandle, createContext, useMemo, useCallback } from 'react';
import { myContextValue } from '../../../globalComponents/globalCommon'
import * as globalCommon from '../../../globalComponents/globalCommon'
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import Tooltip from '../../../globalComponents/Tooltip';

let finalKeyData: any = [];
var MyContextdata: any
let copyEditData: any
const RelevantDocuments = (props: any, ref: any) => {
    MyContextdata = React.useContext(myContextValue)
    const [keyDocument, setKeyDocument]: any = useState([])
    const [copykeyDocument, setCopyKeyDocument]: any = useState([])
    const [Fileurl, setFileurl] = useState("");
    const [editdocpanel, setEditdocpanel] = useState(false);
    const [EditdocData, setEditdocData]: any = useState({});
    const getKeyDoc = () => {
        finalKeyData = []
        if (MyContextdata?.keyDoc?.length > 0) {
            MyContextdata?.keyDoc.map((doc: any) => {
                MyContextdata?.user?.map((user: any) => {
                    if (user?.AssingedToUser != undefined && user?.AssingedToUser?.Id != undefined) {
                        if (user?.AssingedToUser?.Id == doc?.Author?.Id) {
                            doc.UserImage = user?.Item_x0020_Cover?.Url
                        }
                        if (user?.AssingedToUser?.Id == doc?.Editor?.Id) {
                            doc.EditorImage = user?.Item_x0020_Cover?.Url
                        }
                    }
                })
            })
            let keydata: any = JSON.parse(JSON.stringify(MyContextdata.keyDoc))

            setKeyDocument(MyContextdata.keyDoc)
            if (keydata?.length > 3) {
                setCopyKeyDocument(keydata?.splice(1, 3))

            }

            setFileurl(MyContextdata.FileDirRef)

        } else {
            setKeyDocument([])
        }

    }
    React.useMemo(() => {
        getKeyDoc();
    }, [MyContextdata?.keyDoc])

    const callbackeditpopup = React.useCallback((EditdocumentsData: any) => {
        // loadAllSitesDocuments();

        console.log(EditdocumentsData)

        if (EditdocumentsData != undefined) {
            if (EditdocumentsData == "delete") {
                finalKeyData = []
                if (MyContextdata?.keyDoc?.length == 1) {
                    MyContextdata.keyDoc = [];
                    MyContextdata.FunctionCall(null, null, false)
                } else {
                    let deleteKeyData: any = MyContextdata?.keyDoc?.filter((item: any) => item.Id != copyEditData?.Id)
                    MyContextdata.keyDoc = deleteKeyData;
                    // getKeyDoc()
                //   setKeyDocument(deleteKeyData)
                 if (deleteKeyData?.length <=3) {
                     setCopyKeyDocument([])
                  }

                    MyContextdata.FunctionCall(null, null, false)
                }

                setEditdocpanel(false);
                copyEditData = {}
            }
            if (EditdocumentsData?.ItemRank != undefined && EditdocumentsData?.ItemRank != 6) {
                if (MyContextdata?.keyDoc?.length > 0) {
                    let updatedData: any = MyContextdata?.keyDoc?.filter((item: any) => item.Id != EditdocumentsData.Id)
                    MyContextdata.keyDoc = updatedData;

                    MyContextdata.FunctionCall(null, null, false)
                    setEditdocpanel(false);

                }
            } else {
                if (MyContextdata?.keyDoc?.length > 0) {
                    finalKeyData = []
                    let AllkeydocData = MyContextdata?.keyDoc
                    const indexToReplace = AllkeydocData?.findIndex((item: any) => item.Id == EditdocumentsData.Id)
                    if (indexToReplace !== -1) {
                        AllkeydocData[indexToReplace] = EditdocumentsData
                        MyContextdata.keyDoc = AllkeydocData
                        MyContextdata.FunctionCall(null, null, false)
                        setEditdocpanel(false);
                    }

                }
            }
        }else{
            setEditdocpanel(false);  
        }



    }, [])
    const columns = useMemo<ColumnDef<any, unknown>[]>(() =>
        [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 10,
                id: 'Id',
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row }) => (
                    <div className='alignCenter columnFixedTitle p-0'>
                        <><a href={`${row?.original?.EncodedAbsUrl}?web=1`}>
                            <span className={`alignIcon svg__iconbox svg__icon--${row?.original?.File_x0020_Type}`} title={row?.original?.File_x0020_Type}></span></a>
                            <a className='ms-1 wid90' target="_blank" href={`${row?.original?.EncodedAbsUrl}?web=1`}> {row?.original?.Title} </a>
                        </>
                    </div>
                ),
                id: 'Title',
                placeholder: 'File Name',
                resetColumnFilters: false,
                header: '',
                size: 500,
            },
            {
                accessorFn: (row: any) => row?.Modified,
                cell: ({ row }: any) => (
                    <div> {row?.original.Modified !== null ? moment(row?.original.Modified).format("DD/MM/YYYY") : ""}
                        <>
                            <a onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl, row?.original?.Editor?.Id)}
                                target="_blank" data-interception="off">
                                <img title={row?.original?.Editor?.Title} className="workmember ms-1" src={(row?.original?.EditorImage)} />
                            </a>

                        </>
                    </div>
                ),
                id: 'Modified',
                placeholder: 'Modified',
                resetColumnFilters: false,
                header: '',
                size: 115,
            },
            {
                accessorFn: (row: any) => row?.Created,
                cell: ({ row }: any) => (
                    <div>{row?.original.Created !== null ? moment(row?.original.Created).format("DD/MM/YYYY") : ""}


                        <>
                            <a onClick={() => globalCommon?.openUsersDashboard(props?.AllListId?.siteUrl,row?.original?.Author?.Id)} target="_blank" data-interception="off">
                                <img title={row?.original?.Author?.Title} className="workmember ms-1" src={(row?.original?.UserImage)} />
                            </a>

                        </>


                    </div>

                ),
                id: 'Created',
                placeholder: 'Created',
                resetColumnFilters: false,
                header: '',
                size: 115,
            },
            {
                accessorFn: "",
                cell: ({ row }: any) => (
                    <span title="Edit" className="alignIcon  svg__iconbox svg__icon--edit hreflink" onClick={() => editDocumentsLink(row?.original)}></span>

                ),
                id: 'CreatedDate',
                placeholder: '',
                resetColumnFilters: false,
                header: '',
                size: 42,
            }

        ], [copykeyDocument?.length > 0 ? copykeyDocument : keyDocument?.length>0]);


    const ShowData = () => {
        if (keyDocument?.length > copykeyDocument?.length + 3) {
            let keydata: any = JSON.parse(JSON.stringify(MyContextdata.keyDoc))
            setCopyKeyDocument(keydata.splice(1, copykeyDocument?.length + 3))

        } else {
            setCopyKeyDocument(keyDocument)
        }
        console.log("keydocdata", keyDocument)

    };

    const editDocumentsLink = (editData: any) => {
        copyEditData = [];
        setEditdocpanel(true);
        console.log(editData)
        copyEditData = editData
        setEditdocData(editData)

    }

    const callBackData = useCallback((elem: any, getSelectedRowModel: any) => {
        console.log(getSelectedRowModel)
    }, []);
    return (
        <>

            {console.log("context data key doc =============", MyContextdata)}
            {/* -------key documents code start */}
            {(keyDocument != undefined && keyDocument?.length > 0)

                &&
                <div className='mb-3 card commentsection  mt-4'>
                    <div className='card-header'>
                        <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Key Documents<span><Tooltip ComponentId={'1298'} /></span></div>
                    </div>

                    <div className='TableSection w-100'>
                        <div className='Alltable'>
                            <div className='smart Key-documents'>
                              <GlobalCommanTable columns={columns} wrapperHeight="100%" data={copykeyDocument?.length > 0 ? copykeyDocument : keyDocument} callBackData={callBackData} />
                            </div>
                        </div>
                    </div>

                    {copykeyDocument?.length < keyDocument?.length && copykeyDocument?.length > 0 && (
                        <button onClick={ShowData}>
                            Show More
                        </button>
                    )}
                </div>
            }
            {editdocpanel && <EditDocument editData={EditdocData} ColorCode={MyContextdata?.ColorCode} AllListId={props.AllListId} Keydoc={true} Context={props.Context} editdocpanel={editdocpanel} callbackeditpopup={callbackeditpopup} />}

        </>

    )

}

export default forwardRef(RelevantDocuments);