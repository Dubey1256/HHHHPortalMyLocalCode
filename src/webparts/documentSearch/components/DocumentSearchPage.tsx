

import React, { useEffect, useState } from 'react'
import { Web } from 'sp-pnp-js';
import GlobalCommanTable from '../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable';
import { ColumnDef } from '@tanstack/react-table';
import EditDocument from '../../taskprofile/components/EditDocunentPanel';
import moment from 'moment';
import PageLoad from '../../../globalComponents/pageLoader';
import { Avatar } from "@fluentui/react-components";

import { Items } from '@pnp/sp/items';
var TaskUser: any = []
let arr: any = []
let mastertaskdata: any = []

export default function DocumentSearchPage(Props: any) {
    //#region Required Varibale on Page load BY PB
    var AllListId = Props.Selectedprops
    let SiteURL: string = Props?.Selectedprops?.context?._pageContext?._web?.absoluteUrl
    AllListId.siteUrl = SiteURL;
    let CurrentSiteCheck = SiteURL.indexOf("grueneweltweit") > -1;
    const PageContext = AllListId;
    const [AllDocs, setAllDocs] = useState([]);
    const [selectedItemId, setSelectedItem] = useState(undefined);
    const [isEditModalOpen, setisEditModalOpen] = useState(false);
    const [loading, setloading] = React.useState(false);


    //#endregion
    //#region code to load All Documents By PB
    function filterAndJoinTitles(array: any) {
        const Titles = array?.filter((item: any) => item.Title).map((item: any) => item.Title);
        const joinedTitles = Titles?.join(', ');
        return joinedTitles;
    }
    const LoadDocs = () => {
        let web = new Web(PageContext.context._pageContext._web.absoluteUrl + '/')
        web.lists.getById(PageContext.DocumentsListID).items.select("Id,Title,PriorityRank,File/Length,Year,Body,recipients,senderEmail,creationTime,Item_x0020_Cover,Portfolios/Id,Portfolios/Title,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl").filter('FSObjType eq 0').expand("Author,Editor,Portfolios,File").orderBy("Created", false).getAll()
            .then((response: any) => {


                const filteredResponse = response.filter((Doc: any) => Doc.File_x0020_Type !== 'svg');
                try {
                    filteredResponse.forEach((Doc: any) => {
                        let AllProjectData: any = []
                        let projectTitle: any = ''
                        let Project: any = " "
                        let projectId: any = ''
                        let projectStructureId: any = ''
                        let AllPortfolioData: any = []
                        let portfolioTitle: any = ''
                        let portfolioId: any = ''
                        let Portfolioss: any = " "

                        Doc?.Title === null ? (Doc.Title = Doc?.FileLeafRef) : (Doc.Title);

                        Doc.Title = Doc?.FileLeafRef;
                        Doc?.Title !== null ? Doc.Title = Doc.Title.split(".")[0] : Doc.Title;
                        Doc.Portfolios.map((item: any) => {
                            mastertaskdata.map((mastertask: any) => {
                                if (mastertask.Id == item.Id && (mastertask?.Item_x0020_Type == "Project" || mastertask?.Item_x0020_Type == "Sprint")) {
                                    AllProjectData.push(mastertask)
                                }
                            })
                        })
                        AllProjectData.map((items: any, index: any) => {
                            if (items.Title != undefined && items.Title != null) {
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
                            // for portfolio structure id------
                            if (items.PortfolioStructureID != undefined && items.PortfolioStructureID != null) {
                                projectStructureId += items.PortfolioStructureID
                                if (index < AllProjectData.length - 1) {
                                    projectStructureId += ", ";
                                }
                            }
                            projectStructureId = projectStructureId.split(",")

                        })
                        // For tasks start data-----
                        Doc.Portfolios.map((itemss: any) => {
                            mastertaskdata.map((mastertasks: any) => {
                                if (mastertasks.Id == itemss.Id && mastertasks?.Item_x0020_Type != "Project" && mastertasks?.Item_x0020_Type != "Sprint") {
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
                        // Doc.ProjectPortfolioTitle =
                        Doc.CreatedDate = moment(Doc?.Created).format('DD/MM/YYYY');
                        Doc.ModifiedDate = moment(Doc?.Modified).format('DD/MM/YYYY HH:mm')
                        Doc.SiteIcon = PageContext.context._pageContext._web.title;
                        Doc.ProjectTitle = projectTitle;
                        Doc.portfolioTitle = portfolioTitle
                        Doc.Portfolioss = Portfolioss;
                        Doc.projectId = projectId;
                        Doc.projectStructureId = projectStructureId;
                        Doc.Project = filterAndJoinTitles(Doc?.Portfolios)
                        Doc.portfolioId = portfolioId;
                        Doc.FileSize = `${Math.ceil(Doc?.File?.Length / 1024)} KB`;
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
                            else if (User.AssingedToUser != undefined && User.AssingedToUser.Id != undefined && Doc.Editor.Id == User.AssingedToUser.Id && User.Item_x0020_Cover == undefined) {
                                CreatedUserObj['Title'] = User.Title;
                                CreatedUserObj['UserId'] = User.AssingedToUserId;
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
                            else if (User.AssingedToUser != undefined && User.AssingedToUser.Id != undefined && Doc.Editor.Id == User.AssingedToUser.Id && User.Item_x0020_Cover == undefined) {
                                ModifiedUserObj['Title'] = User.Title;
                                ModifiedUserObj['UserId'] = User.AssingedToUserId;
                            }
                        });
                        Doc.AllCreatedImages.push(CreatedUserObj);
                        Doc.AllModifiedImages.push(ModifiedUserObj)

                    });
                    setloading(false)

                } catch (e) {
                    console.log(e)
                    setloading(false)
                }

                setAllDocs(filteredResponse);
            }).catch((error: any) => {
                console.error(error);
                setloading(false)

            });
    }
    //#endregion
    //#region code to load TaskUser By PB


    const LoadTaskUser = () => {
        let web = new Web(PageContext.context._pageContext._web.absoluteUrl + '/')
        web.lists.getById(PageContext.TaskUserListID).items.select('Id,Suffix,Title,SortOrder,Item_x0020_Type,Item_x0020_Cover,AssingedToUserId,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,ItemType').expand('AssingedToUser').getAll().then((response: any) => {
            TaskUser = response;
            LoadDocs();
        }).catch((error: any) => {
            console.error(error);
            setloading(false)

        });
    }
    useEffect(() => {
        setloading(true)
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
                    "PortfolioStructureID",
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
                    setloading(false)
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
            accessorKey: "Title", placeholder: "Title", header: "", id: "Title", size: 400,
            cell: ({ row }) => (
                <div className='alignCenter '>
                    <a target="_blank" className='alignCenter' data-interception="off" href={row?.original?.FileDirRef}>
                        {row?.original?.File_x0020_Type != 'msg' && row?.original?.File_x0020_Type != 'docx' && row?.original?.File_x0020_Type != 'doc' && row?.original?.File_x0020_Type != 'xls' && row?.original?.File_x0020_Type != 'xlsx' && row?.original?.File_x0020_Type != 'rar' && row?.original?.File_x0020_Type != 'jpeg' && row?.original?.File_x0020_Type != 'jpg' && (row?.original?.File_x0020_Type != 'jfif' && (row?.original?.File_x0020_Type === 'fig' || row?.original?.File_x0020_Type === 'mp4' ? (
                            <span title={`${row?.original?.File_x0020_Type}`} className="svg__iconbox svg__icon--unknownFile"></span>
                        ) : (
                            <>
                                {row?.original?.File_x0020_Type == null ? (
                                    <span className="svg__iconbox svg__icon--unknownFile">
                                    </span>
                                ) :
                                    (
                                        <span title={`${row?.original?.File_x0020_Type}`} className={`svg__iconbox svg__icon--${row?.original?.File_x0020_Type}`}>
                                        </span>
                                    )}
                            </>
                        )))}
                        {row?.original?.File_x0020_Type == 'rar' && <span title={`${row?.original?.File_x0020_Type}`} className="svg__iconbox svg__icon--zip"></span>}

                        {row?.original?.File_x0020_Type == 'msg' ? <span title={`${row?.original?.File_x0020_Type}`} className=" svg__iconbox svg__icon--msg "></span> : ''}
                        {(row?.original?.File_x0020_Type == 'jpeg' || row?.original?.File_x0020_Type == 'jpg') ? <span title={`${row?.original?.File_x0020_Type}`} className=" svg__iconbox svg__icon--jpeg "></span> : ''}
                        {(row?.original?.File_x0020_Type == 'xls' || row?.original?.File_x0020_Type == 'xlsx') ? <span title={`${row?.original?.File_x0020_Type}`} className="svg__iconbox svg__icon--xlsx"></span> : ''}
                        {(row?.original?.File_x0020_Type == 'doc' || row?.original?.File_x0020_Type == 'docx') ? <span title={`${row?.original?.File_x0020_Type}`} className=" svg__iconbox svg__icon--docx "></span> : ''}
                        {row?.original?.File_x0020_Type == 'jfif' ? <span title={`${row?.original?.File_x0020_Type}`} className=" svg__iconbox svg__icon--jpeg "></span> : ''}
                    </a>
                    <a className='ms-1 alignCenter' target="_blank" data-interception="off" href={`${row?.original?.EncodedAbsUrl}?web=1`} > {row?.original?.Title} </a>

                </div>
            ),
        },
        {
            // accessorFn: row?.Project,
            accessorFn: (row) => row?.projectStructureId + " " + row?.Project + " " + row?.portfolioTitle,
            placeholder: "Project/Portfolios",
            header: "",
            size: 200,
            id: "Project",
            cell: ({ row }) => {
                const projectTitles = row?.original?.ProjectTitle;
                const projectIds = row?.original?.projectId;
                const projectstrId = row?.original?.projectStructureId;
                const portfoliosTitle = row?.original?.portfolioTitle;
                const portfolioIdss = row?.original?.portfolioId;
                let combinedChildren: any[] = [];
                let combinedUrls: any[] = [];

                // Check for array lengths and validity of the data
                if ((!Array.isArray(projectTitles) || !Array.isArray(projectIds) || !Array.isArray(projectstrId) || projectTitles.length !== projectIds.length)
                    && (!Array.isArray(portfoliosTitle) || !Array.isArray(portfolioIdss) || portfoliosTitle.length !== portfolioIdss.length)) {
                    return null; // Both projectLinks and portfolioLinks are empty, so return null
                }

                // Handle project links
                if (Array.isArray(projectTitles) && Array.isArray(projectIds) && projectTitles.length === projectIds.length) {
                    const projectLinks = projectTitles.map((title: any, index: number) => {
                        const projectId = projectIds[index].trim();
                        const projectstrIdss = projectstrId[index].trim();
                        const projectUrl = `${PageContext?.siteUrl}/SitePages/PX-Profile.aspx?ProjectId=${projectId}`;
                        // const projectIdFromUrl = new URL(projectUrl).searchParams.get('projectId');
                        const projectIdFromUrl = projectstrIdss;


                        return (
                            <React.Fragment key={index}>
                                <a
                                    target="_blank"
                                    data-interception="off"
                                    href={projectUrl}
                                    title={projectUrl} // Set the title attribute to the URL
                                    style={{ cursor: "pointer" }}

                                >
                                    {projectIdFromUrl}
                                </a>
                                {index < projectTitles.length - 1 && ', '}
                            </React.Fragment>
                        );
                    });

                    projectLinks.forEach(item => {
                        if (item?.props?.children && item?.props?.children.length > 0 && item?.props?.children[0]?.props?.children) {
                            combinedChildren.push(item.props?.children[0]?.props?.children);
                            combinedUrls.push(item.props?.children[0]?.props?.href);
                        }
                    });
                }

                // Handle portfolio links
                if (Array.isArray(portfoliosTitle) && Array.isArray(portfolioIdss) && portfoliosTitle.length === portfolioIdss.length) {
                    const portfolioLinks = portfoliosTitle.map((title: any, index: number) => {
                        const portfolioId = portfolioIdss[index].trim();
                        const portfolioUrl = `${PageContext?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${portfolioId}`;

                        return (
                            <React.Fragment key={index}>
                                <a
                                    target="_blank"
                                    data-interception="off"
                                    href={portfolioUrl}
                                    title={portfolioUrl} // Set the title attribute to the URL
                                    style={{ cursor: "pointer" }}>
                                    {title}
                                </a>
                                {index < portfoliosTitle.length - 1 && ', '}
                            </React.Fragment>
                        );
                    });

                    portfolioLinks.forEach(item => {
                        if (item?.props?.children && item?.props?.children.length > 0 && item?.props?.children[0]?.props?.children) {
                            combinedChildren.push(item.props?.children[0]?.props?.children);
                            combinedUrls.push(item.props?.children[0]?.props?.href);
                        }
                    });
                }

                // Handle click event to open URL in a new tab
                const handleClick = (url: string) => {
                    window.open(url, '_blank');
                };

                return (
                    <div>
                        {combinedChildren.map((text, index) => (
                            <React.Fragment key={index}>
                                <a
                                    target="_blank"
                                    data-interception="off"
                                    href={combinedUrls[index]}
                                    style={{ cursor: "pointer" }}
                                >
                                    {text}
                                </a>
                                {index < combinedChildren.length - 1 && ', '}
                            </React.Fragment>
                        ))}
                    </div>
                );
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
                    {row?.original?.AllCreatedImages?.map((item: any, index: number) => (
                        <a key={index} className='ms-1' target="_blank" data-interception="off" href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}>
                            <Avatar
                                title={item?.Title}
                                className="workmember"
                                image={{ src: item?.UserImage }}
                                name={item?.Title}
                                initials={!item?.UserImage ? item?.Suffix : undefined} // Display initials (suffix) if UserImage is not available
                            />
                             
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
            accessorFn: (row) => row.Modified,
            cell: ({ row }) => (
                <>
                    {row?.original?.ModifiedDate}
                    {row?.original?.AllModifiedImages?.map((item: any, index: number) => (
                        <a
                            key={index} // Ensure each link has a unique key
                            className='ms-1'
                            target="_blank"
                            rel="noopener noreferrer"
                            data-interception="off"
                            href={`${PageContext.context._pageContext._web.serverRelativeUrl}/SitePages/TaskDashboard.aspx?UserId=${item.UserId}&Name=${item.Title}`}
                        >
                            <Avatar
                                title={item?.Title}
                                className="workmember"
                                image={{ src: item?.UserImage }}
                                name={item?.Title}
                                initials={!item?.UserImage ? item?.Suffix : undefined} // Display initials (suffix) if UserImage is not available
                            />
                            
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
                    <a onClick={() => EditItem(row.original)} title="Edit"><span title="Edit Document" className="svg__iconbox svg__icon--edit hreflink me-1"></span></a>
                    <a onClick={() => deleteData(row.original)}><span title="Remove Document" className="svg__iconbox svg__icon--cross dark hreflink"></span></a>
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
                    {/* {!CurrentSiteCheck &&
                        <div className="text-end fs-6">
                            <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/document-search-old.aspx">Old Document Search</a>
                        </div>
                    } */}
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
            }
            {loading ? <PageLoad /> : ''}
        </>
    )
}
