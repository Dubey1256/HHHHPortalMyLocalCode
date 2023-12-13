import React, { useEffect, useState } from 'react'
import { Web } from 'sp-pnp-js';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import EditDocumentpanel from '../../taskprofile/components/EditDocunentPanel';
import moment from 'moment';
var TaskUser: any = []
export default function DocumentSearchPage(Props: any) {
    //#region Required Varibale on Page load BY PB
    var AllListId = Props.Selectedprops
    AllListId.siteUrl = Props?.Selectedprops?.context?._pageContext?._web?.absoluteUrl
    const PageContext = AllListId;
    const [AllDocs, setAllDocs] = useState([]);
    const [selectedItemId, setSelectedItem] = useState(undefined);
    const [isEditModalOpen, setisEditModalOpen] = useState(false);

    //#endregion
    //#region code to load All Documents By PB
    const LoadDocs = () => {
        let web = new Web(PageContext.context._pageContext._web.absoluteUrl + '/')
        web.lists.getById(PageContext.DocumentsListID).items.select("Id,Title,PriorityRank,Year,Body,Item_x0020_Cover,SharewebTask/Id,SharewebTask/Title,SharewebTask/ItemType,Portfolios/Id,Portfolios/Title,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl").filter('FSObjType eq 0').expand("Author,Editor,SharewebTask,Portfolios").orderBy("Created", false).getAll()
            .then((response: any) => {
                try {
                    response.forEach((Doc: any) => {
                        Doc?.Title === null ? Doc.Title = Doc?.FileLeafRef : '';
                        Doc.CreatedDate = moment(Doc?.Created).format('DD/MM/YYYY');
                        Doc.ModifiedDate = moment(Doc?.Modified).format('DD/MM/YYYY HH:mm')
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
        web.lists.getById(PageContext.TaskUsertListID).items.select('Id,Suffix,Title,SortOrder,Item_x0020_Cover,AssingedToUserId,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType').expand('AssingedToUser').getAll().then((response: any) => {
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
            web.lists.getById(PageContext.DocumentsListID).items.getById(dlData.Id).recycle().then(() => {
                alert("delete successfully")
                LoadDocs();
            }).catch((error: any) => {
                console.error(error);
            });
        }
    }
    //#endregion 
    //#region code to apply react/10stack global table BY PB
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() => [
        {
            accessorKey: "",
            placeholder: "",
            hasCheckbox: false,
            hasCustomExpanded: false,
            hasExpanded: false,
            size: 10,
            id: 'Id',
        },
        {
            accessorKey: "Title", placeholder: "Title", header: "", id: "Title",
            cell: ({ row }) => (
                <div className='alignCenter '>
                    <a target="_blank" href={row?.original?.FileDirRef}>
                        <span className="alignIcon svg__iconbox svg__icon--folder"></span>
                        {row?.original?.Title ? <a className='ms-1 ' title={row?.original?.Title} target="_blank" href={row?.original?.FileDirRef}> {row?.original?.Title} </a> : <a className='ms-1 ' title={row?.original?.FileDirRef} target="_blank" href={row?.original?.FileDirRef}> {row?.original?.FileLeafRef} </a>}
                    </a>
                </div>
            ),

        },
        {
            accessorKey: "FileLeafRef", placeholder: "Document Url", header: "", id: "FileLeafRef",
            cell: ({ row }) => (
                <div className='alignCenter '>
                    {row?.original?.File_x0020_Type != 'msg' && row?.original?.File_x0020_Type != 'docx' && row?.original?.File_x0020_Type != 'doc' && row?.original?.File_x0020_Type != 'rar' && row?.original?.File_x0020_Type != 'jpeg' && row?.original?.File_x0020_Type != 'jpg' && row?.original?.File_x0020_Type != 'aspx' && row?.original?.File_x0020_Type != 'jfif' && <span className={` svg__iconbox svg__icon--${row?.original?.File_x0020_Type}`}></span>}
                    {row?.original?.File_x0020_Type == 'rar' && <span className="svg__iconbox svg__icon--zip "></span>}
                    {row?.original?.File_x0020_Type == 'aspx' || row?.original?.File_x0020_Type == 'msg' || row?.original?.File_x0020_Type == 'apk' ? <span className=" svg__iconbox svg__icon--unknownFile "></span> : ''}
                    {row?.original?.File_x0020_Type == 'jpeg' || row?.original?.File_x0020_Type == 'jpg' ? <span className=" svg__iconbox svg__icon--jpeg "></span> : ''}
                    {row?.original?.File_x0020_Type == 'doc' || row?.original?.File_x0020_Type == 'docx' ? <span className=" svg__iconbox svg__icon--docx "></span> : ''}
                    {row?.original?.File_x0020_Type == 'jfif' ? <span className=" svg__iconbox svg__icon--jpeg "></span> : ''}
                    <a className='ms-1 wid90' target="_blank" href={`${row?.original?.EncodedAbsUrl}?web=1`}> {row?.original?.FileLeafRef} </a>
                </div>
            ),
        },
        {
            accessorKey: "Created", placeholder: "Created Date", header: "", size: 120, id: "Created", isColumnDefultSortingDesc: true,
            cell: ({ row }) => (
                <>
                    {row?.original?.CreatedDate}
                    {row?.original?.AllCreatedImages.map((item: any) => (
                        <a className='ms-1' target="_blank" href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                            {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                        </a>
                    ))}


                </>
            ),
        },
        {
            accessorKey: "Modified", placeholder: "Modified Date", header: "", size: 172, id: "Modified",
            cell: ({ row }) => (
                <>
                    {row?.original?.ModifiedDate}
                    {row?.original?.AllModifiedImages.map((item: any) => (
                        <a className='ms-1' target="_blank" href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                            {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                        </a>
                    ))}


                </>
            ),
        },
        {

            cell: ({ row }) => (
                <div className='alignCenter'>
                    <a onClick={() => EditItem(row.original)} title="Edit"><span title="Edit Task" className="svg__iconbox svg__icon--edit hreflink me-1"></span></a>
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
        <>
            {/* <section className='ContentSection'>
                <div className='row'>
                    <div className='col-sm-3 text-primary'>
                        <h3 className="heading">Document Search
                        </h3>
                    </div>
                    <div className='col-sm-9 text-primary'>
                        <h6 className='pull-right'><b><a data-interception="off"
                            target="_blank" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/document-search-old.aspx">Old Document Search</a></b>
                        </h6>
                    </div>
                </div>
            </section> */}
            <div className="col-sm-12 clearfix">
                <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active">
                    <div>Document Search</div>
                    <div className="text-end fs-6">
                        <a  data-interception="off" target="_blank" className="hreflink serviceColor_Active" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/document-search-old.aspx">Old Document Search</a>
                    </div>
                </h2>
            </div>
            {AllDocs && <div>
                <div className="TableContentSection">
                    <div className='Alltable mt-2'>
                        <div className='col-md-12 p-0 '>
                            <GlobalCommanTable columns={columns} data={AllDocs} showHeader={true} callBackData={callBackData} expandIcon={true} />
                        </div>
                    </div>
                </div>
            </div>}
            {isEditModalOpen ?
                <EditDocumentpanel callbackeditpopup={closeEditPopup} editData={selectedItemId} AllListId={PageContext} Context={PageContext?.context} editdocpanel={isEditModalOpen} />
                :
                null
            }    </>
    )
}



