import React, { useEffect, useState } from 'react'
import { Web } from 'sp-pnp-js';
import styles from './DocumentSearch.module.scss';
// import GlobalCommanTable from '../../../GlobalCommon/GlobalCommanTable';
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import { ColumnDef } from '@tanstack/react-table';
import DocumentPopup from '../../taskprofile/components/EditDocunentPanel';
import moment from 'moment';
var TaskUser: any = []
let mastertaskdetails: any = [];
export default function DocumentSearchPage(Props: any) {
    //#region Required Varibale on Page load BY PB
    const PageContext = Props.Selectedprops;
    PageContext.DocumentsListID = PageContext?.DocumentListId;
    const [AllDocs, setAllDocs] = useState([]);
    const [selectedItemId, setSelectedItem] = useState([]);
    const [isEditModalOpen, setisEditModalOpen] = useState(false);
    //#endregion
    //#region code to load All Documents By PB
    useEffect(() => {
        LoadMasterTaskList().then((data: any) => {
            LoadTaskUser()
        }).catch((error: any) => {
            console.log(error)
        })

    }, []);
    const LoadDocs = () => {
        let web = new Web(PageContext.context._pageContext._web.absoluteUrl + '/')
        web.lists.getById(PageContext.DocumentListId).items.select('Id,Title,Year,File_x0020_Type,Portfolios/Id,Portfolios/Title,FileLeafRef,FSObjType,FileDirRef,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl').filter('FSObjType eq 0').expand('Author,Editor,Portfolios').getAll()
            .then((response: any) => {
                try {
                    response.forEach((Doc: any) => {
                        // Doc.Created = moment(Doc.Created).format('DD/MM/YYYY');
                        // Doc.Modified = moment(Doc.Modified).format('DD/MM/YYYY HH:mm')
                          Doc.Created = Doc.Created;
                        Doc.Modified = Doc.Modified;
                       
                        Doc.SiteIcon = PageContext.context._pageContext._web.title;
                        Doc.AllModifiedImages = [];
                        Doc.AllCreatedImages = [];
                        let CreatedUserObj: any = {};
                        let ModifiedUserObj: any = {};

                        if (Doc.Portfolios != undefined && Doc.Portfolios.length > 0) {
                            mastertaskdetails?.map((mastertask: any) => {
                                if (mastertask.Id == Doc.Portfolios[0].Id) {
                                    Doc.Portfolio = mastertask
                                }
                            })
                        }

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
    const LoadMasterTaskList = () => {
        return new Promise(function (resolve, reject) {

            let web = new Web(PageContext.context._pageContext._web.absoluteUrl + '/');
            web.lists
                .getById(PageContext.MasterTaskListId).items
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

    //#endregion
    //#region code to edit delete and callback function BY PB
    const closeEditPopup = () => {
        setisEditModalOpen(false)
        LoadDocs();
    }
    const EditItem = (itemId: any) => {
      let created =new Date(itemId?.Created)
      let modify=new Date(itemId?.Modified)
      let editData=itemId;
      editData.Created=created;
      editData.modify=modify;
        setisEditModalOpen(true)
        setSelectedItem(editData)
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
    const callbackeditpopup = () => {
        setisEditModalOpen(false)
        LoadDocs();
    }
    //#endregion 
    //#region code to apply react/10stack global table BY PB
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(() =>
        [{
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            size: 15,
            id: 'row.original',
            cell: ({ row }) => (
                <>
                    {row?.original?.SiteIcon}
                </>
            ),
        },
        {
            accessorKey: "Title", placeholder: "Title", header: "", size: 30,
            cell: ({ row }) => (
                <>
                    <a target="_blank" href={row?.original?.FileDirRef}>
                        <img src="/_layouts/15/images/folder.gif"></img>
                    </a>
                    {row?.original?.Title != undefined && row?.original?.Title != null && row?.original?.Title != '' ? <a target="_blank" href={row?.original?.FileDirRef}> {row?.original?.Title} </a> : <a target="_blank" href={row?.original?.FileDirRef}> {row?.original?.FileLeafRef} </a>}
                </>
            ),
        },
        {
            accessorKey: "FileLeafRef", placeholder: "Document Url", header: "", size: 25,
            cell: ({ row }) => (
                <>
                    <a>
                        {row?.original?.File_x0020_Type == 'pdf' &&
                            <img src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/24/icon_pdf_16.jpg`}></img>}

                        {row?.original?.File_x0020_Type != 'flv' && row?.original?.File_x0020_Type != 'js' && row?.original?.File_x0020_Type != 'css' && row?.original?.File_x0020_Type != 'zip' && row?.original?.File_x0020_Type != 'aspx' && row?.original?.File_x0020_Type != 'mp4' && row?.original?.File_x0020_Type != 'pdf' && row?.original?.File_x0020_Type != 'jpg' && row?.original?.File_x0020_Type != 'png' && row?.original?.File_x0020_Type != 'gif' &&
                            <img src={`/_layouts/15/images/ic${row?.original?.File_x0020_Type}.png`}></img>}

                        {row?.original?.File_x0020_Type == 'flv' || row?.original?.File_x0020_Type == 'js' || row?.original?.File_x0020_Type == 'css' || row?.original?.File_x0020_Type == 'zip' || row?.original?.File_x0020_Type == 'aspx' || row?.original?.File_x0020_Type == 'mp4' || row?.original?.File_x0020_Type == 'jpg' || row?.original?.File_x0020_Type == 'png' || row?.original?.File_x0020_Type == 'gif' &&
                            <img src="/_layouts/15/images/icgen.gif?rev=23"></img>}
                    </a>
                    <a target="_blank" href={`${row?.original?.EncodedAbsUrl}?web=1`}> {row?.original?.FileLeafRef} </a>
                </>
            ),
        },
        {
            accessorKey: "Created", placeholder: "Created Date", header: "", size: 20,
            cell: ({ row }) => (
                <>
                    {row?.original?.AllCreatedImages?.map((item: any) => (
                        <a target="_blank" href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                          
                            {moment(row?.original?.Created).format('DD/MM/YYYY')} {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                        </a>
                    ))}
                </>
            ),
        },
        {
            accessorKey: "Modified", placeholder: "Modified Date", header: "", size: 20,
            cell: ({ row }) => (
                <>
                    {row?.original?.AllModifiedImages?.map((item: any) => (
                        <a target="_blank" href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                            {moment(row?.original?.Modified).format('DD/MM/YYYY')} {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                        </a>
                    ))}
                </>
            ),
        },
        {
            cell: ({ row }) => (
                <>

                    <a onClick={() => EditItem(row.original)} title="Edit"><span title="Edit Task" className="svg__iconbox svg__icon--edit hreflink"></span></a>
                    <a onClick={() => deleteData(row.original)}><span title="Remove Task" className="svg__iconbox svg__icon--cross dark hreflink"></span></a>
                </>
            ),
            accessorKey: '',
            canSort: false,
            placeholder: '',
            header: '',
            id: 'row.original',
            size: 20,
        },
        ],
        [AllDocs]);
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        console.log(elem)
    }, []);
    //#endregion
    return (
        //#Jsx Part By PB
        <> {AllDocs && <div>
            <GlobalCommanTable columns={columns} data={AllDocs} showHeader={true} callBackData={callBackData} />
        </div>}
            {isEditModalOpen &&
                <DocumentPopup editData={selectedItemId} AllListId={PageContext}Context={PageContext?.context}
                    editdocpanel={isEditModalOpen} callbackeditpopup={callbackeditpopup} />}
            {/* {isEditModalOpen ? <DocumentPopup editdocpanel={isEditModalOpen} AllListId={PageContext} editData={selectedItemId}callbackeditpopup={callbackeditpopup} /> : ''} */}
        </>
        //#endregion
    )
}


