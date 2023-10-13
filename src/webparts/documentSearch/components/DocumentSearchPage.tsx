import React, { useEffect, useState } from 'react'
import { Web } from 'sp-pnp-js';
// import styles from './DocumentSearch.module.scss';
// import GlobalCommanTable from '../../../GlobalCommon/GlobalCommanTable';
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { ColumnDef } from '@tanstack/react-table';
import DocumentPopup from './DocumentPopup';
import moment from 'moment';
var TaskUser: any = []
export default function DocumentSearchPage(Props: any) {
    //#region Required Varibale on Page load BY PB
    const PageContext = Props.Selectedprops;
    const [AllDocs, setAllDocs] = useState([]);
    const [selectedItemId, setSelectedItem] = useState(undefined);
    const [isEditModalOpen, setisEditModalOpen] = useState(false);
    //#endregion
    //#region code to load All Documents By PB
    const LoadDocs = () => {
        let web = new Web(PageContext.context._pageContext._web.absoluteUrl + '/')
        web.lists.getById(PageContext.DocumentListId).items.select('Id,Title,Year,File_x0020_Type,FileLeafRef,FSObjType,FileDirRef,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl').filter('FSObjType eq 0').expand('Author,Editor').getAll()
            .then((response: any) => {
                try {
                    response.forEach((Doc: any) => {
                        Doc.Created = moment(Doc.Created).format('DD/MM/YYYY');
                        Doc.Modified = moment(Doc.Modified).format('DD/MM/YYYY HH:mm')
                        Doc.SiteIcon = PageContext.context._pageContext._web.title;
                        Doc.AllModifiedImages = [];
                        Doc.AllCreatedImages = [];
                        let CreatedUserObj: any = {};
                        let ModifiedUserObj: any = {};
                        TaskUser.forEach((User: any) => {
                            if (User.AssingedToUser != undefined && User.AssingedToUser.Id != undefined && Doc.Author.Id == User.AssingedToUser.Id && User.Item_x0020_Cover != undefined) {
                                CreatedUserObj['UserImage'] = User.Item_x0020_Cover.Url;
                                CreatedUserObj['Suffix'] = User.Suffix;
                                CreatedUserObj['Title'] = User.Title;
                                CreatedUserObj['UserId'] = User.AssingedToUserId;
                            }
                            else if (Doc.Author.Id == 9) {
                                CreatedUserObj['UserImage'] = PageContext.context._pageContext._web.serverRelativeUrl + '/PublishingImages/Portraits/portrait_Stefan.jpg';
                                CreatedUserObj['Suffix'] = '';
                                CreatedUserObj['Title'] = 'Stefan Hochhuth'
                                CreatedUserObj['UserId'] = 32
                            }

                            if (User.AssingedToUser != undefined && User.AssingedToUser.Id != undefined && Doc.Editor.Id == User.AssingedToUser.Id && User.Item_x0020_Cover != undefined) {
                                ModifiedUserObj['UserImage'] = User.Item_x0020_Cover.Url;
                                ModifiedUserObj['Suffix'] = User.Suffix;
                                ModifiedUserObj['Title'] = User.Title;
                                ModifiedUserObj['UserId'] = User.AssingedToUserId;
                            }
                            else if (Doc.Editor.Id == 9) {
                                ModifiedUserObj['UserImage'] = PageContext.context._pageContext._web.serverRelativeUrl + '/PublishingImages/Portraits/portrait_Stefan.jpg';
                                ModifiedUserObj['Suffix'] = '';
                                ModifiedUserObj['Title'] = 'Stefan Hochhuth'
                                ModifiedUserObj['UserId'] = 32
                            }
                        });
                        Doc.AllCreatedImages.push(CreatedUserObj);
                        Doc.AllModifiedImages.push(ModifiedUserObj)
                    });
                } catch (e) {
                    console.log(e)
                }
                setAllDocs(response);
            }).catch((error: any) => {
                console.error(error);
            });
    }
    //#endregion
    //#region code to load TaskUser By PB
    const LoadTaskUser = () => {
        let web = new Web(PageContext.context._pageContext._web.absoluteUrl + '/')
        web.lists.getById(PageContext.TaskUserListId).items.select('Id,Suffix,Title,SortOrder,Item_x0020_Cover,AssingedToUserId,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType').expand('AssingedToUser').getAll().then((response: any) => {
            TaskUser = response;
            LoadDocs();
        }).catch((error: any) => {
            console.error(error);
        });
    }
    useEffect(() => {
        LoadTaskUser()
    }, []);
    //#endregion
    //#region code to edit delete and callback function BY PB
    const closeEditPopup = () => {
        setisEditModalOpen(false)
        LoadDocs();
    }
    const EditItem = (itemId: any) => {
        setisEditModalOpen(true)
        setSelectedItem(itemId)
    }
    const deleteData = (dlData: any) => {
        var flag: any = confirm('Do you want to delete this item')
        if (flag) {
            let web = new Web(PageContext.context._pageContext._web.absoluteUrl + '/')
            web.lists.getById(PageContext.DocumentListId).items.getById(dlData.Id).recycle().then(() => {
                alert("delete successfully")
                LoadDocs();
            }).catch((error: any) => {
                console.error(error);
            });
        }
    }
    //#endregion 
    //#region code to apply react/10stack global table BY PB
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [
            {
                accessorKey: "Title", placeholder: "Title", header: "",
                cell: ({ row }) => (
                    <>
                        <a target="_blank" href={row?.original?.FileDirRef}>
                            <span className="alignIcon svg__iconbox svg__icon--folder"></span>
                        </a>
                        {row?.original?.Title != undefined && row?.original?.Title != null && row?.original?.Title != '' ? <a target="_blank" href={row?.original?.FileDirRef}> {row?.original?.Title} </a> : <a target="_blank" href={row?.original?.FileDirRef}> {row?.original?.FileLeafRef} </a>}
                    </>
                ),
            },
            {
                accessorKey: "FileLeafRef", placeholder: "Document Url", header: "",
                cell: ({ row }) => (
                    <div className='alignCenter'>
                            {/* {row?.original?.File_x0020_Type == 'pdf' &&
                            <span className="alignIcon  svg__iconbox svg__icon--folder"></span>
                        }
                        {row?.original?.File_x0020_Type == 'docx' &&
                            <span className="alignIcon  svg__iconbox svg__icon--docx"></span>
                        }
                        {row?.original?.File_x0020_Type == 'icmsg' &&
                            <span className="alignIcon  svg__iconbox svg__icon--mail"></span>
                        }
                        {row?.original?.File_x0020_Type == 'pdf' &&
                            <span className="alignIcon  svg__iconbox svg__icon--pdf"></span>
                        }
                        {row?.original?.File_x0020_Type == 'jpg' &&
                            <span className="alignIcon  svg__iconbox svg__icon--jpeg"></span>
                        }
                         {row?.original?.File_x0020_Type == 'png' &&
                            <span className="alignIcon  svg__iconbox svg__icon--png"></span>
                        }
                           {row?.original?.File_x0020_Type == 'Zip' &&
                            <span className="alignIcon  svg__iconbox svg__icon--zip"></span>
                        }
                           {row?.original?.File_x0020_Type == 'png' &&
                            <span className="alignIcon  svg__iconbox svg__icon--png"></span>
                        }
                            {row?.original?.File_x0020_Type == 'svg' &&
                            <span className="alignIcon  svg__iconbox svg__icon--svg"></span>
                        }
                              {row?.original?.File_x0020_Type == 'pptx' &&
                            <span className="alignIcon  svg__iconbox svg__icon--pptx"></span>
                        }
                                {row?.original?.File_x0020_Type == 'xlsx' &&
                            <span className="alignIcon  svg__iconbox svg__icon--xlsx"></span>
                        }
                               {row?.original?.File_x0020_Type == 'msg' &&
                            <span className="alignIcon  svg__iconbox svg__icon--smg "></span>
                        }
                              {row?.original?.File_x0020_Type == 'zip' &&
                            <span className="alignIcon  svg__iconbox svg__icon--zip "></span>
                        }
                             {row?.original?.File_x0020_Type == 'zip' &&
                            <span className={`alignIcon  svg__iconbox svg__icon--${row?.original?.File_x0020_Type}`}></span>
                        }
                         */}
                            {row?.original?.File_x0020_Type != 'msg' && row?.original?.File_x0020_Type != 'docx' && row?.original?.File_x0020_Type != 'doc' && row?.original?.File_x0020_Type != 'rar' && row?.original?.File_x0020_Type != 'jpeg' && row?.original?.File_x0020_Type != 'jpg' && row?.original?.File_x0020_Type != 'aspx' && <span className={`wid30 svg__iconbox svg__icon--${row?.original?.File_x0020_Type}`}></span>}
                            {row?.original?.File_x0020_Type == 'rar' && <span className="wid30 svg__iconbox svg__icon--zip "></span>}
                            {row?.original?.File_x0020_Type == 'aspx' || row?.original?.File_x0020_Type == 'msg' || row?.original?.File_x0020_Type == 'apk' ? <span className="wid30 svg__iconbox svg__icon--unknownFile "></span> : ''}
                            {row?.original?.File_x0020_Type == 'jpeg' || row?.original?.File_x0020_Type == 'jpg' ? <span className="wid30 svg__iconbox svg__icon--jpeg "></span> : ''}
                            {row?.original?.File_x0020_Type == 'doc' || row?.original?.File_x0020_Type == 'docx' ? <span className="wid30 svg__iconbox svg__icon--docx "></span> : ''}
                            {row?.original?.File_x0020_Type == 'jfif' ? <span className="wid30 svg__iconbox svg__icon--jpeg "></span> : ''}
                            {/* <img src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/24/icon_pdf_16.jpg`}></img> */}

                            {/* {row?.original?.File_x0020_Type != 'flv' && row?.original?.File_x0020_Type != 'js' && row?.original?.File_x0020_Type != 'css' && row?.original?.File_x0020_Type != 'zip' && row?.original?.File_x0020_Type != 'aspx' && row?.original?.File_x0020_Type != 'mp4' && row?.original?.File_x0020_Type != 'pdf' && row?.original?.File_x0020_Type != 'jpg' && row?.original?.File_x0020_Type != 'png' && row?.original?.File_x0020_Type != 'gif' &&
                            <img src={`/_layouts/15/images/ic${row?.original?.File_x0020_Type}.png`}></img>} */}

                            {/* {row?.original?.File_x0020_Type == 'flv' || row?.original?.File_x0020_Type == 'js' || row?.original?.File_x0020_Type == 'css' || row?.original?.File_x0020_Type == 'zip' || row?.original?.File_x0020_Type == 'aspx' || row?.original?.File_x0020_Type == 'mp4' || row?.original?.File_x0020_Type == 'jpg' || row?.original?.File_x0020_Type == 'png' || row?.original?.File_x0020_Type == 'gif' &&
                            <img src="/_layouts/15/images/icgen.gif?rev=23"></img>} */}
                        
                        <a className='ms-1' target="_blank" href={`${row?.original?.EncodedAbsUrl}?web=1`}> {row?.original?.FileLeafRef} </a>
                    </div>
                ),
            },
            {
                accessorKey: "Created", placeholder: "Created Date", header: "", size: 120,
                cell: ({ row }) => (
                    <>
                        {row?.original?.AllCreatedImages.map((item: any) => (
                            <a target="_blank" href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                                {row?.original?.Created} {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                            </a>
                        ))}
                    </>
                ),
            },
            {
                accessorKey: "Modified", placeholder: "Modified Date", header: "", size: 152,
                cell: ({ row }) => (
                    <>
                        {row?.original?.AllModifiedImages.map((item: any) => (
                            <a target="_blank" href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                                {row?.original?.Modified} {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                            </a>
                        ))}
                    </>
                ),
            },
            {

                cell: ({ row }) => (
                    <div className='alignCenter'>
                        <a onClick={() => EditItem(row.original.Id)} title="Edit"><span title="Edit Task" className="svg__iconbox svg__icon--edit hreflink me-1"></span></a>
                        <a onClick={() => deleteData(row.original)}><span title="Remove Task" className="svg__iconbox svg__icon--cross dark hreflink"></span></a>
                    </div>
                ),
                accessorKey: '',
                canSort: false,
                placeholder: '',
                header: '',
                id: 'row.original',
                size: 50,
            },
        ],
        [AllDocs]);
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => { }, []);
    //#endregion
    return (
        
        //#Jsx Part By PB
        <> {AllDocs && <div>
            <div><h2 className='mt-2 heading'>Document Search</h2></div>
            <div className='wrapper'>
            <GlobalCommanTable columns={columns} data={AllDocs} showHeader={true} callBackData={callBackData} />
            </div>
        </div>}
            {isEditModalOpen ? <DocumentPopup closeEditPopup={closeEditPopup} pagecontext={PageContext} Id={selectedItemId} /> : ''}
        </>
        //#endregion
    )
}


