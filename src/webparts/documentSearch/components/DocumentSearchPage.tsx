
import React, { useEffect, useState } from 'react'
import { Web } from 'sp-pnp-js';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import EditDocument from '../../taskprofile/components/EditDocunentPanel';
import moment from 'moment';
import { Items } from '@pnp/sp/items';
var TaskUser: any = []
let arr: any = []
let mastertaskdata: any = []
// let isColumnDefultSortingDesc: any = false;
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
        web.lists.getById(PageContext.DocumentsListID).items.select("Id,Title,PriorityRank,File/Length,Year,Body,recipients,senderEmail,creationTime,Item_x0020_Cover,Portfolios/Id,Portfolios/Title,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl").filter('FSObjType eq 0').expand("Author,Editor,Portfolios,File").orderBy("Created", false).getAll()
            .then((response: any) => {

                try {
                    response.forEach((Doc: any) => {
                        let AllProjectData: any = []
                        let projectTitle: any = ''
                        let Project: any = " "
                        let projectId: any = ''
                        let AllPortfolioData: any = []
                        let portfolioTitle: any = ''
                        let portfolioId: any = ''
                        let Portfolioss: any = " "

                        Doc?.Title === null ? Doc.Title = Doc?.FileLeafRef : Doc.Title;
                        Doc.Title = Doc?.FileLeafRef
                        Doc?.Title !== null ? Doc.Title = Doc.Title.split(".")[0] : Doc.Title;
                        Doc.Portfolios.map((item: any) => {
                            mastertaskdata.map((mastertask: any) => {
                                if (mastertask.Id == item.Id && mastertask?.Item_x0020_Type == "Project") {
                                    AllProjectData.push(mastertask)
                                }
                            })
                        })
                        AllProjectData.map((items: any, index: any) => {
                            if (items.Title != undefined && items.Title != null) {
                                // items.href = `${PageContext?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${items.Id}`

                                projectTitle += items.Title
                                if (index < AllProjectData.length - 1) {
                                    projectTitle += ", ";
                                    Project = projectTitle
                                }
                                projectTitle = projectTitle.split(",")
                            }
                            if (items.Id != undefined && items.Id != null) {
                                projectId += items.Id
                                if (index < AllProjectData.length - 1) {
                                    projectId += ", ";
                                }
                            }
                            projectId = projectId.split(",")
                        })
                        // For tasks start data-----
                        Doc.Portfolios.map((itemss: any) => {
                            mastertaskdata.map((mastertasks: any) => {
                                if (mastertasks.Id == itemss.Id && mastertasks?.Item_x0020_Type != "Project") {
                                    AllPortfolioData.push(mastertasks)
                                }
                            })
                        })
                        AllPortfolioData.map((itm: any, index: any) => {
                            if (itm.Title != undefined && itm.Title != null) {
                                // items.href = `${PageContext?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${items.Id}`

                                portfolioTitle += itm.Title
                                if (index < AllPortfolioData.length - 1) {
                                    portfolioTitle += ", ";
                                    Portfolioss = portfolioTitle
                                }
                                portfolioTitle = portfolioTitle.split(",")
                            }
                            if (itm.Id != undefined && itm.Id != null) {
                                portfolioId += itm.Id
                                if (index < AllPortfolioData.length - 1) {
                                    portfolioId += ", ";
                                }
                            }
                            portfolioId = portfolioId.split(",")
                        })


                        console.log(AllPortfolioData)
                        // For tasks end -----
                        console.log(AllProjectData)
                        Doc.ProjectPortfolioTitle =
                            Doc.CreatedDate = moment(Doc?.Created).format('DD/MM/YYYY');
                        Doc.ModifiedDate = moment(Doc?.Modified).format('DD/MM/YYYY HH:mm')
                        Doc.SiteIcon = PageContext.context._pageContext._web.title;
                        Doc.ProjectTitle = projectTitle;
                        Doc.portfolioTitle = portfolioTitle
                        Doc.Portfolioss = Portfolioss;
                        // let combinedTitle = [...Project, ...Portfolioss];
                        // Doc.ProjectPortfolioTitle = combinedTitle;
                        Doc.projectId = projectId;
                        Doc.Project = Project;
                        Doc.portfolioId = portfolioId;
                        Doc.FileSize = `${Math.ceil(Doc?.File?.Length / 1024)} KB`;
                        // Doc.Project = [{Title:projectTitle,Id:projectId}]
                        // Doc.href = projectId;
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
        web.lists.getById(PageContext.TaskUsertListID).items.select('Id,Suffix,Title,SortOrder,Item_x0020_Type,Item_x0020_Cover,AssingedToUserId,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType').expand('AssingedToUser').getAll().then((response: any) => {
            TaskUser = response;
            LoadDocs();
        }).catch((error: any) => {
            console.error(error);
        });
    }
    useEffect(() => {
        LoadTaskUser()
        LoadMasterTaskList()
    }, []);

    const LoadMasterTaskList = () => {
        return new Promise(function (resolve, reject) {
            let web = new Web(PageContext.context._pageContext._web.absoluteUrl + '/');
            web.lists
                .getById(PageContext.MasterTaskListID).items
                .select(
                    "Id",
                    "Title",
                    "Mileage",
                    "TaskListId",
                    "Item_x0020_Type",
                    "TaskListName",
                    "PortfolioType/Id",
                    "PortfolioType/Title",
                    "PortfolioType/Color",
                ).expand("PortfolioType").top(4999).get()
                .then((dataserviccomponent: any) => {
                    console.log(dataserviccomponent)
                    mastertaskdata = dataserviccomponent;
                    resolve(dataserviccomponent)

                }).catch((error: any) => {
                    console.log(error)
                    reject(error)
                })
        })
    }
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
                    <a target="_blank" className='alignCenter' data-interception="off" href={row?.original?.FileDirRef}>
                        {row?.original?.File_x0020_Type != 'msg' && row?.original?.File_x0020_Type != 'docx' && row?.original?.File_x0020_Type != 'doc' && row?.original?.File_x0020_Type != 'rar' && row?.original?.File_x0020_Type != 'jpeg' && row?.original?.File_x0020_Type != 'jpg' && row?.original?.File_x0020_Type != 'jfif' && <span title={`${row?.original?.File_x0020_Type}`} className={` svg__iconbox svg__icon--${row?.original?.File_x0020_Type}`}></span>}
                        {row?.original?.File_x0020_Type == 'rar' && <span title={`${row?.original?.File_x0020_Type}`} className="svg__iconbox svg__icon--zip "></span>}
                        {row?.original?.File_x0020_Type == 'msg' ? <span title={`${row?.original?.File_x0020_Type}`} className=" svg__iconbox svg__icon--msg "></span> : ''}
                        {row?.original?.File_x0020_Type == 'jpeg' || row?.original?.File_x0020_Type == 'jpg' ? <span title={`${row?.original?.File_x0020_Type}`} className=" svg__iconbox svg__icon--jpeg "></span> : ''}
                        {row?.original?.File_x0020_Type == 'doc' || row?.original?.File_x0020_Type == 'docx' ? <span title={`${row?.original?.File_x0020_Type}`} className=" svg__iconbox svg__icon--docx "></span> : ''}
                        {row?.original?.File_x0020_Type == 'jfif' ? <span title={`${row?.original?.File_x0020_Type}`} className=" svg__iconbox svg__icon--jpeg "></span> : ''}
                    </a>
                    <a className='ms-1 alignCenter' target="_blank" data-interception="off" href={`${row?.original?.EncodedAbsUrl}?web=1`}> {row?.original?.Title} </a>

                </div>
            ),
        },
        {
            accessorKey: "Project",
            placeholder: "Project",
            header: "",
            size: 120,
            id: "Project",
            // isColumnDefultSortingDesc: true,
            cell: ({ row }) => {
                const projectTitles = row?.original?.ProjectTitle;
                const projectIds = row?.original?.projectId;
                const portfoliosTitle = row?.original?.portfolioTitle;
                const portfolioIdss = row?.original?.portfolioId
                let combinedChildren:any=[];
                if (!Array.isArray(projectTitles) || !Array.isArray(projectIds) || projectTitles.length !== projectIds.length) {
                    return null;
                }
                if (!Array.isArray(portfoliosTitle) || !Array.isArray(portfolioIdss) || portfoliosTitle.length !== portfolioIdss.length) {
                    return null;
                }


                const projectLinks = projectTitles.map((title: any, index: number) => {
                    const projectId = projectIds[index].trim();

                    return (
                        <React.Fragment key={index}>
                            <a
                                target="_blank"
                                data-interception="off"
                                href={`${PageContext?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${projectId}`}>
                                {title}
                            </a>
                            {index < projectTitles.length - 1 && ', '}
                        </React.Fragment>
                    );
                });
                const portfolioLinks = portfoliosTitle?.map((title: any, index: number) => {
                    const portfolioId = portfolioIdss[index].trim();

                    return (
                        <React.Fragment key={index}>
                            <a
                                target="_blank"
                                data-interception="off"
                                href={`${PageContext?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${portfolioId}`}>
                                {title}
                            </a>
                            {index < projectTitles.length - 1 && ', '}
                        </React.Fragment>
                    );
                });
                projectLinks.forEach(item => {
                    if (item?.props?.children && item?.props?.children.length > 0 && item?.props?.children[0]?.props && item?.props?.children[0]?.props?.children) {
                        combinedChildren.push(item.props?.children[0]?.props?.children);
                    }
                });
                // projectLinks.forEach(item => {
                //     if (item?.props?.children && item?.props?.children.length > 0 && item?.props?.children[0]?.props && item?.props?.children[0]?.props?.children) {
                //         combinedChildren.push(
                //             <a key={item.props.children[0].props.children.href} href={item.props.children[0].props.children.href}>
                //                 {item.props.children[0].props.children.text}
                //             </a>
                //         );
                //     }
                // });
                
                portfolioLinks.forEach(item => {
                    if (item?.props?.children && item?.props?.children.length > 0 && item?.props?.children[0]?.props && item?.props?.children[0]?.props?.children) {
                        combinedChildren.push(item?.props?.children[0]?.props?.children);
                    }
                });
                
                var concatenatedString = combinedChildren.join(', ');
                
                console.log(concatenatedString);

                return <>{concatenatedString}</>
            }
        },
        {
            accessorKey: "File_x0020_Type", placeholder: "File Type", header: "", size: 120, id: "File_x0020_Type",
            cell: ({ row }) => (
                <>
                    {row?.original?.File_x0020_Type}

                </>
            )
        },
        {
            accessorKey: "FileSize", placeholder: "File Size", header: "", size: 120, id: "FileSize",
            cell: ({ row }) => (
                <>
                    {Math.ceil(row?.original?.File?.Length / 1024)} KB

                </>
            )
        },
        {
            accessorKey: "Created",
            cell: ({ row }) => (
                <>
                    {row?.original?.CreatedDate}
                    {row?.original?.AllCreatedImages.map((item: any) => (
                        <a className='ms-1' target="_blank" data-interception="off" href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                            {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                        </a>
                    ))}
                </>
            ),
            placeholder: "Created Date", header: "", size: 120, id: "CreatedDate", isColumnDefultSortingDesc: true,
            filterFn: (row: any, columnId: any, filterValue: any) => {
                if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.CreatedDate?.includes(filterValue)) {
                    return true
                } else {
                    return false
                }
            },
        },
        {
            accessorKey: "Modified",
            cell: ({ row }) => (
                <>
                    {row?.original?.ModifiedDate}
                    {row?.original?.AllModifiedImages.map((item: any) => (
                        <a className='ms-1' target="_blank" data-interception="off" href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                            {item?.UserImage != undefined && item?.UserImage != '' ? <img title={item?.Title} className="workmember" src={item?.UserImage}></img> : <img title={item?.Title} className="workmember" src={`${PageContext.context._pageContext._web.serverRelativeUrl}/SiteCollectionImages/ICONS/32/icon_user.jpg`}></img>}
                        </a>
                    ))}
                </>
            ),
            placeholder: "Modified Date", header: "", size: 172, id: "ModifiedDate",
            filterFn: (row: any, columnId: any, filterValue: any) => {
                if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.ModifiedDate?.includes(filterValue)) {
                    return true
                } else {
                    return false
                }
            },

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
    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
    }, []);
    //#endregion
    return (
        <>

            <div className="col-sm-12 clearfix">
                <h2 className="d-flex justify-content-between heading align-items-center siteColor serviceColor_Active">
                    <div>Document Search
                    </div>
                    <div className="text-end fs-6">
                        <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/document-search-old.aspx">Old Document Search</a>
                    </div>
                </h2>
            </div>
            {AllDocs && <div>
                <div className="TableContentSection">
                    <div className='Alltable mt-2 mb-2'>
                        <div className='col-md-12 p-0 '>
                            <GlobalCommanTable columns={columns} data={AllDocs} showHeader={true} callBackData={callBackData} expandIcon={true} hideTeamIcon={true} hideOpenNewTableIcon={true} />
                        </div>
                    </div>
                </div>
            </div>}
            {isEditModalOpen ?
                <EditDocument callbackeditpopup={closeEditPopup} editData={selectedItemId} AllListId={PageContext} Context={PageContext?.context} editdocpanel={isEditModalOpen} />
                :
                null
            }    </>
    )
}